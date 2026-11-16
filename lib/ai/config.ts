export const AI_PROVIDER_NAMES = ["claude", "gemini", "fallback"] as const;
export type AiProviderName = (typeof AI_PROVIDER_NAMES)[number];

export type AiConfig = {
  provider: AiProviderName;
  model: string;
};

// Throws on an unknown provider. The pipeline turns that into a fallback.
export function getAiConfig(env: NodeJS.ProcessEnv = process.env): AiConfig {
  const provider = (env.AI_PROVIDER?.trim() || "claude") as AiProviderName;
  if (!AI_PROVIDER_NAMES.includes(provider)) {
    throw new Error(
      `Unknown AI_PROVIDER "${provider}". Use one of: ${AI_PROVIDER_NAMES.join(", ")}`,
    );
  }
  return { provider, model: env.AI_MODEL?.trim() ?? "" };
}
