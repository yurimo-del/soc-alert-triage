import type { TriageProvider } from "../types";

// Stub: shows where a second provider plugs in. Not part of the prototype scope.
export const geminiProvider: TriageProvider = {
  name: "gemini",
  async triage(): Promise<unknown> {
    throw new Error("Gemini provider is not implemented");
  },
};
