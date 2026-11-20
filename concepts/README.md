# Concepts

Step 2 of the workflow: low-fidelity wireframe concepts for the two views of the primary user (L1/L2 analyst): **alert list** and **alert detail**.

Pages (run `npm run dev`, then open):

- Index: `/concepts` (questions, comparison table, links, missing fields).
- [Concept A: Ranked queue](http://localhost:3000/concepts/a): `/concepts/a`
- [Concept B: Lanes](http://localhost:3000/concepts/b): `/concepts/b`
- [Concept C: Case file, one at a time](http://localhost:3000/concepts/c): `/concepts/c`

Each concept page starts with the design questions and its own answers, then the idea, trade-off, analyst assumption and screens. A toggle at the top of each page shows the Carbon pattern labels.

Rules for this step:

- Greyscale and static. No Carbon, no colors.
- The AI is drawn as always right. Real AI behavior is judged in a later step.
- Eval labels and review rules are draft v0, pending security review. They are shown as they are, not judged.
- Data comes from `data/alerts/eval-set.json` and `data/fallback/`. Fields we do not have are listed below, not invented.
- Detail screens: alert-006 and alert-011 show the recorded answer. alert-003 shows the eval label (`true_positive`, `reset_credentials`). Lists use the eval labels for all 15 alerts.

Design questions are section 8 of [`docs/REQUIREMENTS.md`](../docs/REQUIREMENTS.md):

1. How does the screen tell "quick confirm" apart from "investigate before acting"?
2. How is the alert list prioritized and sorted?
3. What happens after the analyst confirms or rejects an action?
4. Which fields appear on the list and which on the detail screen?

## Index

| Concept | Idea | Tag |
|---|---|---|
| [A. Ranked queue](#a-ranked-queue) ([page](http://localhost:3000/concepts/a)) | One sorted table. Detail opens in a side panel. | conservative |
| [B. Lanes](#b-lanes) ([page](http://localhost:3000/concepts/b)) | The list is split into lanes by how much attention an alert needs. | novel |
| [C. Case file, one at a time](#c-case-file-one-at-a-time) ([page](http://localhost:3000/concepts/c)) | No table. A rail leads, one alert is open as a case file. | novel |

## A. Ranked queue

**Idea:** one sorted table, the detail opens in a side panel next to it.

| Question | Answer |
|---|---|
| 1. Quick confirm or investigate | Review tag on the row. Confirm stays disabled until the analyst ticks "I reviewed the evidence". No review needed: one click. |
| 2. Sorting | One flat table: review first, then severity, then oldest. |
| 3. After confirm or reject | The row greys out and stays in the table. The panel shows the decision. |
| 4. Fields | List: id, source, title, severity, classification, action, review, time. Detail: the rest. |

**Trade-off:** good: familiar, the whole queue stays visible. Costs: a checkbox gate can be ticked without reading.
**Assumes about the analyst:** scans a table, picks their own order, decides alone.

## B. Lanes

**Idea:** the list is split into lanes by how much attention an alert needs.

| Question | Answer |
|---|---|
| 1. Quick confirm or investigate | The lane. "Confirm" rows have a confirm button on the row. "Review first" rows only open the detail. |
| 2. Sorting | Lane first, then severity, then oldest. |
| 3. After confirm or reject | The row leaves its lane and goes to a Done strip. |
| 4. Fields | Row: id, title, action, plus severity in the review lane. Detail: the rest. |

**Trade-off:** good: easy alerts clear fast, effort is visible at a glance. Costs: the row button confirms without showing the AI reasoning.
**Assumes about the analyst:** wants to clear the easy alerts in a batch, then give time to the rest.

## C. Case file, one at a time

**Idea:** no table. A rail leads, and one alert is open as a case file.

| Question | Answer |
|---|---|
| 1. Quick confirm or investigate | The layout. No review: confirm on top. Review: evidence first, confirm at the bottom. |
| 2. Sorting | Same order as A, but the rail leads. The analyst does not pick. |
| 3. After confirm or reject | Moves to the next alert. The decided alert greys out in the rail. |
| 4. Fields | Rail: id, severity. Case file: everything else, with `raw_payload` always beside the verdict. |

**Trade-off:** good: focus, payload next to the reasoning. Costs: no overview of the queue, fixed order.
**Assumes about the analyst:** works the queue in order and trusts the ranking.

## Open questions

Fields the screens need and the repo does not have. They are listed, not filled.

- **Decision record.** No field for confirm or reject, who decided, or when.
- **Reject.** No reason field and no defined next step (back to the queue? to L2?).
- **Status, assignee, Done.** None of them exists on an alert.
- **Confidence in the eval labels.** The eval labels have no confidence, so lists do not show it. The alert-003 detail shows a placeholder.
- **Text for the eval label.** alert-003 uses the eval label, which has no summary, evidence text or action detail. Those are placeholders. Only the `must_cite_fields` are shown, with their real values.
- **alert-003: eval label and recorded answer differ.** Eval label: `true_positive`, severity High, `reset_credentials`. Recorded answer: `needs_investigation`, severity High, `escalate`, with `review_reasons` "Classification is needs_investigation". This step drew the eval label. Which side is right is not judged here. It goes to the judgment step.
- **alert-006.** The alert does not name the file that was modified (the recorded answer says so too).
- **alert-011.** No field for the user's normal location.
- **alert-003 review reason.** The reason text on the screen is the draft v0 rule text "Recommended action resets credentials" from `lib/schemas/review-rules.ts`. The screen marks it "assumed for wireframe, not from computeReview()". Rule 1 (low confidence) cannot be checked because the eval label has no confidence.

## Files

- `app/concepts/page.tsx`: index page (questions, comparison table, links, missing fields).
- `app/concepts/a/page.tsx`, `b/page.tsx`, `c/page.tsx`: one route per concept. All three render `concept-page.tsx`.
- `app/concepts/concept-page.tsx`: question-and-answer header, idea, card and screens of one concept.
- `app/concepts/concepts-content.ts`: design questions, concept answers, missing fields.
- `app/concepts/concept-a.tsx`, `concept-b.tsx`, `concept-c.tsx`: one file per concept.
- `app/concepts/concepts-frame.tsx`: shared frame, blocks and thumbnails.
- `app/concepts/concepts-data.ts`: loads the eval set and recorded answers, ranks the list.
- `app/concepts/concepts.css`: plain CSS, prefixed `concepts-`.
- Prompts for this step: [`docs/prompts/2026-11-20-wireframe-concepts.md`](../docs/prompts/2026-11-20-wireframe-concepts.md).
