# Architecture Decision Records (ADR)

## ADR-01: Adoption of IBM Carbon Design System
* **Status:** Accepted
* **Context:** Enterprise security interfaces require high data density, rigorous typography, and standardized components for data tables, statuses, and badges.
* **Decision:** Use IBM Carbon Design System. Avoid heavy custom UI frameworks in favor of reliable, battle-tested enterprise design patterns.

## ADR-02: Primary user: SOC analyst, secondary: SOC manager
* **Context:** The one-pager named only the L1/L2 analyst. The system also needs someone who defines when a human must review an AI verdict and who must trust the output enough to adopt it. Without naming this role, review rules and trust requirements have no owner.
* **Decision:** The primary user is the L1/L2 SOC analyst, who triages alerts. The secondary user is the SOC manager, who sets the review rules and must trust the system. Features are prioritized for the analyst first, then checked against what the manager needs to trust the output (flagged ambiguity, cited alert fields).
* **Consequences:** Success criteria include trust signals (human-review flags, cited fields), not only speed. Review rules must be explicit and configurable in code, not left to the model. Manager-facing features, such as rule editing or reporting, stay minimal unless they prove the prototype-to-product path.
* **Status:** Accepted

## ADR-03: Triage contract: model output vs stored result
* **Context:** The AI returns a triage verdict that the UI shows and the manager has to trust. A single lenient schema would let the model decide things it should not, such as when a human must review. A single strict schema would send harmless model quirks, like an extra field, to the fallback and distort eval results.
* **Decision:**
  * `confidence` has three levels (`high`, `medium`, `low`), not a percentage. A model's number has no calibration behind it and invites false precision. Three levels map directly to a review rule.
  * `needs_human_review` and `review_reasons` are computed in code by `computeReview()` in `lib/schemas/review-rules.ts`. The model never sets them, and its opinion is ignored. The rules are a readable list, so the SOC manager can audit them (see ADR-02).
  * Two schemas. `TriageModelOutputSchema` is what the model may return. It has no review fields or `meta`, and it strips unknown keys. `TriageResultSchema` is the full stored result, with review fields and `meta` (provider, model, prompt version, source). It is strict and rejects unknown keys.
* **Consequences:**
  * Recorded fallback files are stored results, so they must be captured from real pipeline runs (model output, then `computeReview()`, then `meta`) and not written by hand. Hand-written files can drift from what the pipeline produces and make the fallback demo misleading.
  * Changing a review rule changes behavior without touching prompts, and it can be tested on its own.
  * Dropping unknown keys from model output means extra fields are silently lost. This is accepted, because the strict stored schema keeps the data we keep in a known shape.
  * A changed schema invalidates existing fallback files. They must be re-recorded.
* **Status:** Accepted
