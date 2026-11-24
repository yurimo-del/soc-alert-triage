// Design questions are section 8 of docs/REQUIREMENTS.md, as written there.
export const QUESTIONS = [
  "How does the screen tell \"quick confirm\" apart from \"investigate before acting\"?",
  "How is the alert list prioritized and sorted?",
  "What happens after the analyst confirms or rejects an action?",
  "Which fields appear on the list and which on the detail screen?",
] as const;

export const CONCEPTS = [
  {
    id: "A",
    label: "A",
    slug: "a",
    name: "Ranked queue",
    kind: "conservative",
    idea: "One sorted table. The detail opens in a side panel next to it.",
    answers: [
      "Review tag on the row. Confirm stays disabled until the analyst ticks \"I reviewed the evidence\". No review needed: one click.",
      "One flat table: review first, then severity, then oldest.",
      "The row greys out and stays in the table. The panel shows the decision.",
      "List: id, source, title, severity, classification, action, review, time. Detail: the rest.",
    ],
    tradeoff: "Good: familiar, the whole queue stays visible. Costs: a checkbox gate can be ticked without reading.",
    assumes: "Scans a table, picks their own order, decides alone.",
  },
  {
    id: "B",
    label: "B",
    slug: "b",
    name: "Lanes",
    kind: "novel",
    idea: "The list is split into lanes by how much attention an alert needs.",
    answers: [
      "The lane. \"Confirm\" rows have a confirm button on the row. \"Review first\" rows only open the detail.",
      "Lane first, then severity, then oldest.",
      "The row leaves its lane and goes to a Done strip.",
      "Row: id, title, action, plus severity in the review lane. Detail: the rest.",
    ],
    tradeoff: "Good: easy alerts clear fast, effort is visible at a glance. Costs: the row button confirms without showing the AI reasoning.",
    assumes: "Wants to clear the easy alerts in a batch, then give time to the rest.",
  },
  {
    id: "C",
    label: "C",
    slug: "c",
    name: "Case file, one at a time",
    kind: "novel",
    idea: "No table. A rail leads, and one alert is open as a case file.",
    answers: [
      "The layout. No review: confirm on top. Review: evidence first, confirm at the bottom.",
      "Same order as A, but the rail leads. The analyst does not pick.",
      "Moves to the next alert. The decided alert greys out in the rail.",
      "Rail: id, severity. Case file: everything else, with raw_payload always beside the verdict.",
    ],
    tradeoff: "Good: focus, payload next to the reasoning. Costs: no overview of the queue, fixed order.",
    assumes: "Works the queue in order and trusts the ranking.",
  },
  {
    id: "C2",
    label: "C v2",
    slug: "c-v2",
    name: "Case file with lanes",
    kind: "novel",
    idea: "A revision of C. A lane switch and a list on the left, one case file on the right. The decision block comes last.",
    answers: [
      "The switch. Quick confirm: 2 clicks (select, Confirm). Needs review: 3 clicks (select, tick the statement \"I reviewed the evidence\", Confirm). The tick is a statement, not proof of a review.",
      "The switch picks the lane. Inside a lane: severity, then oldest.",
      "The card stays in its lane, greyed, with the new status. The decision block shows the same status. No Undo and no next step after Reject.",
      "Card and detail share one order: status, severity, time, id: title. The detail continues with source, summary, evidence, action and raw fields.",
    ],
    tradeoff: "Good: effort is split by lane, the detail reads top-down and the decision comes after the evidence. Costs: the tick can be set without reading, and the other lane is hidden until the switch is used.",
    assumes: "Clears the Quick confirm lane first, then reads each Needs review detail top-down.",
  },
  {
    id: "C21",
    label: "C v2.1",
    slug: "c-v2-1",
    name: "Case file with lanes",
    kind: "novel",
    idea: "A revision of C v2. Lane switch, filter and sort with a list on the left, one case file on the right. Every detail has an overview, a details link and a decision panel that holds the recommended action and the buttons.",
    answers: [
      "The switch. Every detail has the same structure: overview, then \"View more details\", then the decision panel. Quick confirm: details collapsed. 2 clicks: select, Confirm. Needs review: details open, so the evidence is in view before the tick. 3 clicks: select, tick \"I reviewed the evidence\", Confirm. The tick is a statement, not proof of a review.",
      "The switch picks the lane. A filter (All, Not reviewed, Confirmed, Rejected) and a sort (severity, time) sit under it. Default: severity, then oldest.",
      "The row stays in its lane, not greyed, and gets a mark: a check for confirmed, an X for rejected. The detail shows the new status at the top. The panel keeps the record: the recommended action, the tick as it was set (read-only) and the result in place of the buttons. No Undo and no next step after Reject.",
      "Row: severity, time, id: title, and the result mark at the right edge. Detail: severity, status, time, id: title, then overview, details and the decision panel.",
    ],
    tradeoff: "Good: effort is split by lane, the row says only what the lane does not, and the buttons sit with the action they decide. Costs: the tick can be set without reading, and Quick confirm hides the evidence under \"View more details\".",
    assumes: "Clears the Quick confirm lane first from the overview, then reads each Needs review detail top-down.",
  },
] as const;

// Fields the screens need and the repo does not have. Listed, not filled.
export const MISSING = [
  "Decision record: no field for confirm or reject, who decided, or when.",
  "Reject: no reason field and no defined next step (back to the queue? to L2?).",
  "Status, assignee, or a Done state on an alert.",
  "Confidence is not in the eval labels. Lists do not show it. The alert-003 detail shows a placeholder.",
  "alert-003 uses the eval label, which has no summary, evidence text or action detail. Those are placeholders.",
  "alert-003: the eval label (true_positive, reset_credentials) and the recorded answer (needs_investigation, escalate) differ. Not judged here.",
  "alert-006: the alert does not name the file that was modified.",
  "alert-011: no field for the user's normal location.",
] as const;
