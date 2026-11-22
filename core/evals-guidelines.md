# Evals guidelines

Draft v0, AI-assisted, pending security expert review.

- **Owner:** [MISSING: no named owner. The labels are simulated, draft v0, pending security expert review]
- **Designer's role:** build concepts on these rules, take them as given, and have at least one real domain person review at a judgment point (ADR-08). Feed findings back to revise the rules.
- **Rules:** the AI only suggests, and a human confirms every recommended action (`CLAUDE.md` rule 6). `needs_human_review` is computed in code by `computeReview()` (`lib/schemas/review-rules.ts`), never by the model. A human must review if any of these is true: confidence is low; the classification is `needs_investigation`; the severity is Critical; the action isolates a host; the action blocks an IP; the action resets credentials. [MISSING: a rule for when the AI must escalate, other than the review rules above]
- **Test data:** `data/alerts/eval-set.json` (15 synthetic alerts with expected outcomes). Recorded AI responses are in `data/fallback/`. Baseline run: `docs/evals/2026-11-17-baseline.md`.
- **Last reviewed by / date:** [MISSING: not reviewed yet. Four questions are open in "Pending security review" in `docs/DECISIONS.md`]
