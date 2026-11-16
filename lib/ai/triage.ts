import { ZodError } from "zod";
import {
  TriageModelOutputSchema,
  TriageResultSchema,
  computeReview,
  type Alert,
  type TriageResult,
} from "../schemas";
import { getAiConfig, type AiConfig } from "./config";
import { PROMPT_VERSION } from "./prompts/triage-v1";
import { createClaudeProvider } from "./providers/claude";
import { readFallback } from "./providers/fallback";
import { geminiProvider } from "./providers/gemini";
import type { TriageOutcome, TriageProvider } from "./types";

export const TRIAGE_TIMEOUT_MS = 20_000;

export type TriageOptions = {
  // Test and script hooks. Normal callers pass none.
  provider?: TriageProvider;
  model?: string;
  fallbackDir?: string;
  timeoutMs?: number;
};

function createProvider(config: AiConfig): TriageProvider {
  switch (config.provider) {
    case "claude":
      return createClaudeProvider(config.model);
    case "gemini":
      return geminiProvider;
    default:
      throw new Error(`AI_PROVIDER "${config.provider}" is not a live provider`);
  }
}

// Reject when the timer fires, even if a provider ignores the abort signal.
async function callWithTimeout(
  provider: TriageProvider,
  alert: Alert,
  timeoutMs: number,
): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(new Error(`Provider timed out after ${timeoutMs} ms`)),
    timeoutMs,
  );
  const aborted = new Promise<never>((_, reject) =>
    controller.signal.addEventListener(
      "abort",
      () => reject(controller.signal.reason),
      { once: true },
    ),
  );
  try {
    return await Promise.race([
      provider.triage(alert, { signal: controller.signal }),
      aborted,
    ]);
  } finally {
    clearTimeout(timer);
  }
}

function zodSummary(error: ZodError): string {
  return error.issues
    .slice(0, 5)
    .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("; ");
}

// Only name, status and a short message. Keeps secrets and payloads out of logs.
function describeError(error: unknown): string {
  if (error instanceof Error) {
    const status = (error as { status?: number }).status;
    return `${error.name}${status ? ` ${status}` : ""}: ${error.message}`.slice(0, 300);
  }
  return "unknown error";
}

// Live path only. Throws on any failure, with no fallback.
export async function runLiveTriage(
  alert: Alert,
  options: TriageOptions = {},
  config?: AiConfig,
): Promise<TriageResult> {
  const resolved = options.provider ? undefined : (config ?? getAiConfig());
  const provider = options.provider ?? createProvider(resolved!);
  const model = options.model ?? resolved?.model ?? "";

  const raw = await callWithTimeout(
    provider,
    alert,
    options.timeoutMs ?? TRIAGE_TIMEOUT_MS,
  );

  const output = TriageModelOutputSchema.safeParse(raw);
  if (!output.success)
    throw new Error(`Model output invalid: ${zodSummary(output.error)}`);

  // Code decides on human review, never the model.
  const review = computeReview(output.data);
  const result = TriageResultSchema.safeParse({
    ...output.data,
    ...review,
    meta: {
      provider: provider.name,
      model,
      prompt_version: PROMPT_VERSION,
      source: "live",
    },
  });
  if (!result.success)
    throw new Error(`Assembled result invalid: ${zodSummary(result.error)}`);
  return result.data;
}

// Full pipeline. Live result if possible, else the recorded fallback,
// else a typed error. Never returns an invented result.
export async function triageAlert(
  alert: Alert,
  options: TriageOptions = {},
): Promise<TriageOutcome> {
  try {
    const config = options.provider ? undefined : getAiConfig();
    if (config?.provider !== "fallback")
      return { ok: true, result: await runLiveTriage(alert, options, config) };
  } catch (error) {
    console.error(
      `[triage] ${alert.id}: live triage failed (${describeError(error)}); using recorded fallback`,
    );
  }

  const fallback = await readFallback(alert.id, options.fallbackDir);
  if (fallback.ok) return { ok: true, result: fallback.result };

  console.error(`[triage] ${alert.id}: no usable fallback (${fallback.reason})`);
  return {
    ok: false,
    error: {
      code: "no_fallback",
      message: `Live triage unavailable and no recorded fallback for ${alert.id}`,
    },
  };
}
