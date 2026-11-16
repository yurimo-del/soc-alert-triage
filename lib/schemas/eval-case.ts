import { z } from "zod";
import { AlertSchema } from "./alert";
import {
  ActionTypeSchema,
  ClassificationSchema,
  SeveritySchema,
} from "./triage-result";

// Ground truth for one alert. Strict: the eval set must not drift.
export const EvalExpectedSchema = z.strictObject({
  severity: SeveritySchema,
  classification: ClassificationSchema,
  action_type: ActionTypeSchema,
  needs_human_review: z.boolean(),
  // raw_payload keys the model's evidence must reference.
  must_cite_fields: z.array(z.string().min(1)).min(1),
});

export const EvalCaseSchema = z.strictObject({
  alert: AlertSchema,
  expected: EvalExpectedSchema,
});

export const EvalSetSchema = z.array(EvalCaseSchema).min(1);

export type EvalExpected = z.infer<typeof EvalExpectedSchema>;
export type EvalCase = z.infer<typeof EvalCaseSchema>;
