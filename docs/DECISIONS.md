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

## ADR-07: AI provider adapter
* **Context:** The product must not depend on one model vendor, and the demo must keep working without network or an API key. The app is deployed publicly on Vercel, and the triage route has no protection yet, so anyone who can reach it could trigger paid model calls.
* **Decision:**
  * Providers (`lib/ai/providers/`) implement one interface and return raw model output only. The pipeline in `lib/ai/triage.ts` owns everything else: a 20 s timeout (cancelled through an `AbortSignal`), validation with `TriageModelOutputSchema`, `computeReview()`, `meta`, and validation with `TriageResultSchema` (ADR-03).
  * The provider is chosen by `AI_PROVIDER` (`claude`, `gemini`, `fallback`) and the model by `AI_MODEL`. The default model is `claude-sonnet-5-5`, so a developer can run the project from `.env.example`.
  * Claude returns JSON through the API's structured output (`output_config.format`, built from the zod schema), not forced tool use. Current Claude models reject forced `tool_choice`.
  * On any error, timeout or invalid output, the pipeline loads the recorded file `data/fallback/<alert-id>.json` and logs the reason server-side. If no valid fallback exists, it returns a typed error. It never invents a result.
  * On Vercel, `AI_PROVIDER=fallback` and no API key is stored there. Live calls run only locally, until the route has protection.
* **Consequences:**
  * Adding a provider is one file. UI and route handlers never import a provider SDK.
  * Fallback files must be recorded from real pipeline runs with `npm run record:fallbacks`, never written by hand (ADR-03). They must be re-recorded after a schema or prompt change.
  * The UI must clearly label results with `meta.source: "fallback"` as recorded responses, so the analyst never mistakes them for a live verdict.
  * A failed live call is visible to users only through `meta.source`. Details are in server logs, which never include the API key.
  * Alert ids come from request bodies, so the fallback reader accepts only safe ids before building a file path.
  * Fallback files are read by name at runtime, so `next.config.ts` lists them in `outputFileTracingIncludes` for the deployed build.
  * Putting the route behind authentication and rate limiting is required before any public deployment runs live calls.
* **Status:** Accepted

## Pending security review
Expected labels and review rules are draft v0, AI-assisted, pending security expert review. These questions are open. The current behavior of the code and the eval set is the provisional default until an expert answers.

1. **Human review for every confirmed High threat.** Should a confirmed High `true_positive` always require human review, whatever the action? *Provisional default:* review is required only by the rules in `computeReview()` (low confidence, `needs_investigation`, Critical, or an isolate, block or reset action). A High threat whose action is `escalate` or `monitor` would not need review.
2. **Severity tolerance for ambiguous alerts.** Should severity on ambiguous alerts be scored as exact or within ±1? *Provisional default:* the eval reports both and picks neither.
3. **Label for alert-014.** Should the failed-login burst from a registered scanner outside its scan scope expect `monitor` or `escalate`? *Provisional default:* `monitor`.
4. **Evidence needed to `close`.** Does `close` need more evidence than `escalate`? *Provisional default:* no extra rule. `close` needs no human review when confidence is not low, and the prompt says to use `false_positive` with high confidence only when the evidence is clear.
