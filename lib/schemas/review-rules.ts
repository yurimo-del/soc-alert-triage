import type { TriageModelOutput } from "./triage-result";

export type ReviewDecision = {
  needs_human_review: boolean;
  review_reasons: string[];
};

type ReviewInput = Pick<
  TriageModelOutput,
  "severity" | "classification" | "confidence"
> & {
  recommended_action: Pick<TriageModelOutput["recommended_action"], "type">;
};

// Rules as data so a SOC manager can read and audit them in one place.
const RULES: { reason: string; applies: (r: ReviewInput) => boolean }[] = [
  { reason: "Confidence is low", applies: (r) => r.confidence === "low" },
  {
    reason: "Classification is needs_investigation",
    applies: (r) => r.classification === "needs_investigation",
  },
  { reason: "Severity is Critical", applies: (r) => r.severity === "Critical" },
  {
    reason: "Recommended action isolates a host",
    applies: (r) => r.recommended_action.type === "isolate_host",
  },
  {
    reason: "Recommended action blocks an IP",
    applies: (r) => r.recommended_action.type === "block_ip",
  },
  {
    reason: "Recommended action resets credentials",
    applies: (r) => r.recommended_action.type === "reset_credentials",
  },
];

// Pure and deterministic. Never reads the model's own opinion on review.
export function computeReview(result: ReviewInput): ReviewDecision {
  const review_reasons = RULES.filter((rule) => rule.applies(result)).map(
    (rule) => rule.reason,
  );
  return { needs_human_review: review_reasons.length > 0, review_reasons };
}
