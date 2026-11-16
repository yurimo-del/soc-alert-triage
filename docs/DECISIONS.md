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

## ADR-04: Figma only in Phase 2
* **Context:** The prototype needs a working, testable product as early as possible. IBM Carbon (ADR-01) already provides the base patterns for data tables, statuses and badges, so a separate design pass in Figma would mostly redraw what Carbon ships. What Carbon does not cover is how the product earns trust: how AI evidence, confidence and review flags are shown to the analyst and the manager.
* **Decision:** Phase 1 designs directly in code with IBM Carbon components. Figma is used in Phase 2, for the trust and explainability patterns and for the handover package.
* **Consequences:**
  * The fastest path to a working screen that can be tested with real interaction.
  * No Figma files exist in Phase 1, so the code is the only record of the UI until Phase 2.
  * Trust and explainability patterns are designed once, after the working screens show what is needed, not guessed up front.
  * Phase 2 must produce Figma frames that match the built components, so the handover package (ADR-05) describes what exists.
* **Status:** Accepted

## ADR-05: Handover test with a React developer
* **Context:** A prototype is only a product path if another engineer can pick it up. Documentation that its authors consider clear proves little. The claim needs evidence from someone who did not build it.
* **Decision:** A React developer builds one screen from the handover package: tokens, components and `docs/HANDOVER.md`. We log every question they ask and every piece of rework needed. This log is the main evidence for Phase 3.
* **Consequences:**
  * The handover package must be complete enough to attempt the task without help from us. Unanswered gaps become logged questions, not silent fixes.
  * Questions and rework are recorded as they happen, in a form that can be counted later. Any numbers in docs come from this log (no invented numbers).
  * The result may show the package is not good enough. That is a valid finding, and the package is fixed from it.
  * The test depends on the developer's availability, so Phase 3 timing depends on the call.
* **Status:** Accepted. The developer has been contacted. The call is pending.

## ADR-06: Styling: Carbon vs Tailwind
* **Context:** Both `@carbon/react` and Tailwind are installed. Tailwind came with the project template. Two styling systems in one codebase would weaken the handover: a developer would not know which to use, and the same screen could be styled two ways.
* **Decision:** Open. This must be decided before the first UI screen is built. Until then, no new UI is built with Tailwind (see `CLAUDE.md`).
* **Consequences:** Pending. Whichever option is chosen, the other is removed or limited to a stated role, and the handover package describes a single styling approach.
* **Status:** Open
