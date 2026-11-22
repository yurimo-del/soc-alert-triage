# Design system

Draft v0, AI-assisted, pending security expert review.

- **Name and version:** IBM Carbon Design System, package `@carbon/react` ^1.120.0 (ADR-01, `package.json`). The styling decision, Carbon or Tailwind, is open (ADR-06).
- **Source:** the `@carbon/react` package. [MISSING: a docs link is not recorded in the repo]
- **Tokens:** [MISSING: no UI is built with Carbon yet, so no token location exists in the code]
- **Allowed components:** [MISSING: no list exists. ADR-01 names data tables, statuses and badges as the base patterns]
- **Key patterns for this product:** data tables, statuses and badges (ADR-01). Trust and explainability patterns (AI evidence, confidence, review flags) are designed after the working screens show what is needed (ADR-04). A recorded response is labelled so it is never mistaken for a live verdict, and a failed triage shows a typed error, never an invented result (ADR-07).
- **Pattern names for wireframe labels (provisional, taken from concept labels):** button, checkbox, data table, header, inline notification, modal, side nav, side panel, structured list, tag. Two blocks had no matching pattern: a case file and a done strip.
- **Do not:** build custom design system components (one-pager); build new UI with Tailwind until ADR-06 is closed (`CLAUDE.md`). [MISSING: a rule on colors outside tokens, because tokens are not defined]

Skills and agents use only what this file allows.
