import type { Alert, TriageResult } from "../schemas";

export type ProviderOptions = {
  // Lets the pipeline cancel the HTTP request when its timeout fires.
  signal?: AbortSignal;
};

// Providers return raw model output only. Validation, review flags and meta
// are added by the pipeline in triage.ts, never by a provider.
export interface TriageProvider {
  name: string;
  triage(alert: Alert, options?: ProviderOptions): Promise<unknown>;
}

export type TriageErrorCode = "invalid_alert" | "no_fallback";

export type TriageError = {
  code: TriageErrorCode;
  message: string;
};

export type TriageOutcome =
  | { ok: true; result: TriageResult }
  | { ok: false; error: TriageError };
