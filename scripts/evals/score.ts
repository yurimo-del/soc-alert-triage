// Pure scoring for eval runs. No I/O, so it can be checked on its own.
import type { EvalCase, Severity, TriageResult } from "../../lib/schemas";

export const CRITERIA = [
  "severity_exact",
  "severity_within_1",
  "classification",
  "action",
  "needs_human_review",
  "required_fields",
] as const;
export type Criterion = (typeof CRITERIA)[number];

export type RunRecord =
  | { run: number; ok: true; attempts: number; result: TriageResult }
  // transient: still failing after retries on 429, 5xx, connection error or timeout.
  | { run: number; ok: false; attempts: number; error: string; transient: boolean };

export type RunScore = {
  passes: Record<Criterion, boolean>;
  missing_fields: string[];
};

// Low < Medium < High < Critical.
const SEVERITY_ORDER: Severity[] = ["Low", "Medium", "High", "Critical"];

// The prompt asks for the exact raw_payload key. A "raw_payload." prefix is
// tolerated. Nothing else is normalised, so renamed keys count as missing.
function normaliseField(field: string): string {
  return field.trim().replace(/^raw_payload\./, "");
}

export function scoreRun(expected: EvalCase["expected"], result: TriageResult): RunScore {
  const distance = Math.abs(
    SEVERITY_ORDER.indexOf(result.severity) - SEVERITY_ORDER.indexOf(expected.severity),
  );
  const cited = new Set(result.evidence.map((e) => normaliseField(e.field)));
  const missing_fields = expected.must_cite_fields.filter((f) => !cited.has(f));

  return {
    passes: {
      severity_exact: distance === 0,
      severity_within_1: distance <= 1,
      classification: result.classification === expected.classification,
      action: result.recommended_action.type === expected.action_type,
      needs_human_review: result.needs_human_review === expected.needs_human_review,
      required_fields: missing_fields.length === 0,
    },
    missing_fields,
  };
}

// Invalid output, refusal or max_tokens: the model failed, so every criterion fails.
export function scoreFailedRun(): RunScore {
  return {
    passes: Object.fromEntries(CRITERIA.map((c) => [c, false])) as Record<Criterion, boolean>,
    missing_fields: [],
  };
}

// A criterion flips when its pass/fail result differs between scored runs.
export function findFlips(scores: RunScore[]): Criterion[] {
  if (scores.length < 2) return [];
  return CRITERIA.filter((c) => new Set(scores.map((s) => s.passes[c])).size > 1);
}
