# lib/schemas

Single source of truth for data shapes. Each schema is a [zod](https://zod.dev) object. The TypeScript types are inferred from it, so the type and the runtime check cannot drift apart. Import from `lib/schemas` (the `index.ts` barrel).

## Files

| File | What it holds |
|---|---|
| `alert.ts` | `AlertSchema`, `Alert`, `AlertSource` |
| `triage-result.ts` | `TriageModelOutputSchema`, `TriageResultSchema` and their types |
| `review-rules.ts` | `computeReview()`, the human-review rules |

## Alert

An alert as it arrives from a security tool. The schema is strict: unknown keys are rejected.

| Field | Meaning |
|---|---|
| `id` | Unique alert id. Fallback responses are stored per id. |
| `source` | Tool that raised it: `EDR`, `WAF`, `Antivirus`, `IAM`, `Email` or `Network`. |
| `timestamp` | When it happened, ISO 8601 string (e.g. `2025-01-15T09:30:00Z`). |
| `title` | Short human-readable headline. |
| `raw_payload` | The tool's original fields. The shape differs per source, so it is an open key-value object. |

## Two triage schemas

- **`TriageModelOutputSchema`** is what the AI is asked to return. Unknown extra keys are **stripped, not rejected**, so a harmless extra field does not force a fallback and distort eval results.
- **`TriageResultSchema`** is the full result we store and show, and the format of recorded fallback files. It is **strict**: unknown keys are rejected.

The full result is the model output plus three things only code may set: `needs_human_review`, `review_reasons` and `meta`.

## Triage result fields

| Field | Meaning |
|---|---|
| `severity` | `Critical`, `High`, `Medium` or `Low`. How bad it is if real. |
| `classification` | `true_positive` (real threat), `false_positive` (harmless), or `needs_investigation` (cannot tell yet). |
| `confidence` | `high`, `medium` or `low`. How sure the AI is. |
| `summary` | A short plain-language explanation for the analyst. |
| `evidence` | At least one item. Each has `field` (which alert field), `value` (what it contained) and `why` (why it matters). Lets the analyst check the AI's claim. |
| `recommended_action` | `type` is one of `isolate_host`, `block_ip`, `reset_credentials`, `escalate`, `monitor`, `close`. `detail` says what exactly. This is only a suggestion. A human confirms it in the UI. |
| `needs_human_review` | Computed in code by `computeReview()`. Never taken from the model. |
| `review_reasons` | Readable reasons why review is needed. Empty when `needs_human_review` is false. |
| `meta` | Provenance: `provider`, `model`, `prompt_version`, and `source` (`live` for a real model call, `fallback` for a recorded response). |

## Review rules

`computeReview()` is a pure function: same input, same output, no I/O. `needs_human_review` is true if **any** rule fires, and each one adds a reason:

- confidence is `low`
- classification is `needs_investigation`
- severity is `Critical`
- action type is `isolate_host`, `block_ip` or `reset_credentials`

The rules live in a list in `review-rules.ts` so a SOC manager can audit them. To change a rule, edit the list.

## Usage

```ts
import { TriageModelOutputSchema, computeReview } from "@/lib/schemas";

const parsed = TriageModelOutputSchema.safeParse(JSON.parse(modelText));
if (!parsed.success) {
  // use the recorded fallback, meta.source = "fallback"
}
const review = computeReview(parsed.data);
```
