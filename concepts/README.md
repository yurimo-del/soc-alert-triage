# Concepts

Step 2 of the workflow: low-fidelity wireframe concepts for the two views of the primary user (L1/L2 analyst): **alert list** and **alert detail**.

Pages (run `npm run dev`, then open):

- Index: `/concepts` (questions, comparison table, links, missing fields).
- [Concept A: Ranked queue](http://localhost:3000/concepts/a): `/concepts/a`
- [Concept B: Lanes](http://localhost:3000/concepts/b): `/concepts/b`
- [Concept C: Case file, one at a time](http://localhost:3000/concepts/c): `/concepts/c`
- [Concept C v2: Case file with lanes](http://localhost:3000/concepts/c-v2): `/concepts/c-v2` (a revision of C)
- [Concept C v2.1: Case file with lanes](http://localhost:3000/concepts/c-v2-1): `/concepts/c-v2-1` (a revision of C v2, its own page)

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
| [C v2. Case file with lanes](#c-v2-case-file-with-lanes) ([page](http://localhost:3000/concepts/c-v2)) | A revision of C. A lane switch, a list and one case file. The decision block comes last. | novel |
| [C v2.1. Case file with lanes](#c-v21-case-file-with-lanes) ([page](http://localhost:3000/concepts/c-v2-1)) | A revision of C. Lanes with filter and sort, one case file, and a decision panel that holds the recommended action. | novel |

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

## C v2. Case file with lanes

**Idea:** a revision of C. A lane switch ("Quick confirm" / "Needs review") and a list on the left, one case file on the right. The decision block comes last.

| Question | Answer |
|---|---|
| 1. Quick confirm or investigate | The switch. Quick confirm: 2 clicks (select, Confirm). Needs review: 3 clicks (select, tick the statement "I reviewed the evidence", Confirm). The tick is a statement, not proof of a review. |
| 2. Sorting | The switch picks the lane. Inside a lane: severity, then oldest. |
| 3. After confirm or reject | The card stays in its lane, greyed, with the new status. The decision block shows the same status. No Undo and no next step after Reject. |
| 4. Fields | Card and detail share one order: status, severity, time, id: title. The detail continues with source, summary, evidence, action and raw fields. |

**What changed from C:** a lane switch replaces the single ranked rail. The detail is one column and the decision block is at the end, with the review status, the tick (Needs review only) and Confirm / Reject together. After an action the card stays in the list instead of moving to the next alert.
**Trade-off:** good: effort is split by lane, the detail reads top-down and the decision comes after the evidence. Costs: the tick can be set without reading, and the other lane is hidden until the switch is used.
**Assumes about the analyst:** clears the Quick confirm lane first, then reads each Needs review detail top-down.
**Not reviewed yet:** the owner reviews C v2 blind first. It is not checked against `core/review-criteria.md`.

## C v2.1. Case file with lanes

**Idea:** a revision of C v2, on its own page (`/concepts/c-v2-1`). C v2 keeps its page. A lane switch, a filter and a sort with a list on the left, one case file on the right. Every detail has an overview, a details link and a decision panel that holds the recommended action and the buttons.

| Question | Answer |
|---|---|
| 1. Quick confirm or investigate | The switch. Every detail has the same structure: overview, then "View more details", then the decision panel. Quick confirm: details collapsed. 2 clicks: select, Confirm. Needs review: details open, so the evidence is in view before the tick. 3 clicks: select, tick "I reviewed the evidence", Confirm. The tick is a statement, not proof of a review. |
| 2. Sorting | The switch picks the lane. A filter (All, Not reviewed, Confirmed, Rejected) and a sort (severity, time) sit under it. Default: severity, then oldest. |
| 3. After confirm or reject | The row stays in its lane, not greyed, and gets a mark: a check for confirmed, an X for rejected. The detail shows the new status at the top. The panel keeps the record: the recommended action, the tick as it was set (read-only) and the result in place of the buttons. No Undo and no next step after Reject. |
| 4. Fields | Row: severity, time, id: title, and the result mark at the right edge. Detail: severity, status, time, id: title, then overview, details and the decision panel. |

**What changed from C v2:** the row has no "Needs review" label (the switch says it) and a result mark replaces the greyed row. A filter and a sort sit under the switch. The detail starts with severity, then status. The recommended action moved into the decision panel with the tick and buttons. Every detail has an overview, a details link and then the decision panel. The details are collapsed in Quick confirm and open in Needs review. One extra frame shows alert-006 with the details open. "Severity" is the data field (the owner's decision), not a new "criticality" field.
**Trade-off:** good: effort is split by lane, the row says only what the lane does not, and the buttons sit with the action they decide. Costs: the tick can be set without reading, and Quick confirm hides the evidence under "View more details".
**Assumes about the analyst:** clears the Quick confirm lane first from the overview, then reads each Needs review detail top-down.
**Not drawn:** the filter and sort in a non-default position, and the empty state of a filter.

## Open questions

- **Will analysts tick "I reviewed the evidence" on autopilot?** Ask the SOC analyst. (C v2, C v2.1)
- **Should Reject also need the tick?** Assumed no, the tick gates only Confirm. Ask the SOC analyst. (C v2, C v2.1, assumption)
- **What belongs in the Quick confirm overview, and what in more details?** Ask the SOC analyst. (C v2.1)
- **Key signals are the first 2 evidence fields, and details are the rest of the evidence plus the raw fields.** This is a placeholder and an assumption, pending the SOC analyst. (C v2.1)
- **Is a "needs review" label in the list useful, or redundant?** v2.1 removes it because the lane switch says it. Ask the SOC analyst. (C v2.1)
- **Is Undo needed after Confirm or Reject? For how long?** v2.1 has none. Ask the SOC analyst. (C v2.1)

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
- `app/concepts/a/page.tsx`, `b/page.tsx`, `c/page.tsx`, `c-v2/page.tsx`, `c-v2-1/page.tsx`: one route per concept. All render `concept-page.tsx`.
- `app/concepts/concept-page.tsx`: question-and-answer header, idea, card and screens of one concept.
- `app/concepts/concepts-content.ts`: design questions, concept answers, missing fields.
- `app/concepts/concept-a.tsx`, `concept-b.tsx`, `concept-c.tsx`, `concept-c2.tsx`, `concept-c21.tsx`: one file per concept.
- `app/concepts/concepts-frame.tsx`: shared frame, blocks and thumbnails.
- `app/concepts/concepts-data.ts`: loads the eval set and recorded answers, ranks the list.
- `app/concepts/concepts.css`: plain CSS, prefixed `concepts-`.
- Prompts for this step: [`docs/prompts/2026-11-20-wireframe-concepts.md`](../docs/prompts/2026-11-20-wireframe-concepts.md).
