import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { TriageModelOutputSchema, type Alert } from "../../schemas";
import { TRIAGE_SYSTEM_PROMPT, buildUserMessage } from "../prompts/triage-v1";
import type { ProviderOptions, TriageProvider } from "../types";

// Room for thinking plus a short JSON verdict. Stays under non-streaming limits.
const MAX_TOKENS = 8192;

// Built from the zod schema so the model contract has one source of truth.
// "$schema" is dropped because the API does not need it.
function buildJsonSchema(): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    ...z.toJSONSchema(TriageModelOutputSchema),
  };
  delete schema.$schema;
  return schema;
}

export function createClaudeProvider(model: string): TriageProvider {
  return {
    name: "claude",
    async triage(alert: Alert, options?: ProviderOptions): Promise<unknown> {
      if (!model) throw new Error("AI_MODEL is not set");
      // Key comes from ANTHROPIC_API_KEY in the server environment. Never logged.
      // No SDK retries: the pipeline has a timeout and a recorded fallback.
      const client = new Anthropic({ maxRetries: 0 });

      // Structured output, not forced tool use: current models reject forced tool_choice.
      const response = await client.messages.create(
        {
          model,
          max_tokens: MAX_TOKENS,
          system: TRIAGE_SYSTEM_PROMPT,
          messages: [{ role: "user", content: buildUserMessage(alert) }],
          output_config: {
            format: { type: "json_schema", schema: buildJsonSchema() },
          },
        },
        { signal: options?.signal },
      );

      if (response.stop_reason === "refusal")
        throw new Error("Model refused the request");
      if (response.stop_reason === "max_tokens")
        throw new Error("Model output was cut off at max_tokens");

      const textBlock = response.content.find((b) => b.type === "text");
      if (!textBlock || textBlock.type !== "text")
        throw new Error("Model returned no text block");
      return JSON.parse(textBlock.text);
    },
  };
}
