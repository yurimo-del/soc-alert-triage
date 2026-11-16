import { z } from "zod";

export const SeveritySchema = z.enum(["Critical", "High", "Medium", "Low"]);
export const ClassificationSchema = z.enum([
  "true_positive",
  "false_positive",
  "needs_investigation",
]);
export const ConfidenceSchema = z.enum(["high", "medium", "low"]);
export const ActionTypeSchema = z.enum([
  "isolate_host",
  "block_ip",
  "reset_credentials",
  "escalate",
  "monitor",
  "close",
]);
export const ResultSourceSchema = z.enum(["live", "fallback"]);

// Field shapes are shared by two schemas with different strictness:
// the model output strips unknown keys, the stored result rejects them.
const evidenceFields = {
  field: z.string().min(1),
  value: z.string(),
  why: z.string().min(1),
};
const actionFields = {
  type: ActionTypeSchema,
  detail: z.string().min(1),
};
const metaFields = {
  provider: z.string().min(1),
  model: z.string().min(1),
  prompt_version: z.string().min(1),
  source: ResultSourceSchema,
};

// What the model is asked to produce. Unknown keys are stripped (not an error),
// so a harmless extra field does not trigger a fallback and distort evals.
// It has no review fields or meta: code sets those, never the model.
export const TriageModelOutputSchema = z.object({
  severity: SeveritySchema,
  classification: ClassificationSchema,
  confidence: ConfidenceSchema,
  summary: z.string().min(1),
  evidence: z.array(z.object(evidenceFields)).min(1),
  recommended_action: z.object(actionFields),
});

// The full stored result (and the recorded fallback files). Strict on purpose.
export const TriageResultSchema = z.strictObject({
  severity: SeveritySchema,
  classification: ClassificationSchema,
  confidence: ConfidenceSchema,
  summary: z.string().min(1),
  evidence: z.array(z.strictObject(evidenceFields)).min(1),
  recommended_action: z.strictObject(actionFields),
  needs_human_review: z.boolean(),
  review_reasons: z.array(z.string()),
  meta: z.strictObject(metaFields),
});

export type Severity = z.infer<typeof SeveritySchema>;
export type Classification = z.infer<typeof ClassificationSchema>;
export type Confidence = z.infer<typeof ConfidenceSchema>;
export type ActionType = z.infer<typeof ActionTypeSchema>;
export type ResultSource = z.infer<typeof ResultSourceSchema>;
export type TriageModelOutput = z.infer<typeof TriageModelOutputSchema>;
export type TriageResult = z.infer<typeof TriageResultSchema>;
