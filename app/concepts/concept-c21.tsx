import { DETAIL, LANE_CONFIRM, LANE_REVIEW, shortTime, type AlertView, type ListRow } from "./concepts-data";
import { Block, Button, Frame, Line, OriginTag, Shot, Tag } from "./concepts-frame";

type Lane = "quick" | "review";
type Decision = "confirmed" | "rejected";

// Status words come from one place. The list shows the result as a mark, the detail as a word.
const statusOf = (needsReview: boolean, decision?: Decision) =>
  decision === "confirmed"
    ? "Confirmed"
    : decision === "rejected"
      ? "Rejected"
      : needsReview
        ? "Needs review"
        : "No review needed";

// Static control: one segment is drawn as selected. Used for the lane switch, filter and sort.
function Segments({ label, items, active }: { label: string; items: string[]; active: number }) {
  return (
    <Block label={label}>
      <div className="concepts-switch" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {items.map((t, i) => (
          <span key={t} className={i === active ? "concepts-switch-on" : ""}>
            {t}
          </span>
        ))}
      </div>
    </Block>
  );
}

// Counts are open items, so a decided alert lowers its lane count.
function LaneSwitch({ lane, decidedLane }: { lane: Lane; decidedLane?: Lane }) {
  const quick = LANE_CONFIRM.length - (decidedLane === "quick" ? 1 : 0);
  const review = LANE_REVIEW.length - (decidedLane === "review" ? 1 : 0);
  return (
    <Segments
      label="no pattern: switch"
      items={[`Quick confirm (${quick})`, `Needs review (${review})`]}
      active={lane === "quick" ? 0 : 1}
    />
  );
}

// Row field order matches the detail: severity, time, then "id: title". The result is a mark on the right.
function Item({ row, selected, decision }: { row: ListRow; selected: boolean; decision?: Decision }) {
  return (
    <div className={`concepts-c21-item ${selected ? "concepts-row-selected" : ""}`}>
      <div className="concepts-c21-text">
        <Line>
          {row.severity} · {shortTime(row.timestamp)}
        </Line>
        <Line>
          {row.id}: {row.title}
        </Line>
      </div>
      {decision && (
        <span className="concepts-c21-mark" role="img" aria-label={decision === "confirmed" ? "Confirmed" : "Rejected"}>
          {decision === "confirmed" ? "✓" : "✗"}
        </span>
      )}
    </div>
  );
}

const MAX_CARDS = 8;

function List({
  lane,
  current,
  decision,
  decidedLane,
}: {
  lane: Lane;
  current: string;
  decision?: Decision;
  decidedLane?: Lane;
}) {
  const rows = lane === "quick" ? LANE_CONFIRM : LANE_REVIEW;
  const idx = Math.max(0, rows.findIndex((r) => r.id === current));
  const start = Math.min(Math.max(0, idx - 2), Math.max(0, rows.length - MAX_CARDS));
  const shown = rows.slice(start, start + MAX_CARDS);
  return (
    <div className="concepts-c21-list">
      <LaneSwitch lane={lane} decidedLane={decidedLane} />
      <Segments label="no pattern: filter" items={["All", "Not reviewed", "Confirmed", "Rejected"]} active={0} />
      <Segments label="no pattern: sort" items={["Sort: severity", "Sort: time"]} active={0} />
      <Block label="Carbon: structured list (alert list)">
        {start > 0 && <div className="concepts-bar concepts-bar-narrow" />}
        {shown.map((r) => (
          <Item key={r.id} row={r} selected={r.id === current} decision={r.id === current ? decision : undefined} />
        ))}
        {start + MAX_CARDS < rows.length && <div className="concepts-bar concepts-bar-narrow" />}
      </Block>
    </div>
  );
}

const NO_TEXT = "[placeholder: not in the eval label]";

// The decision panel holds the recommended action and the buttons that decide it.
// After an action it keeps the record (action, tick as set) and only the buttons go.
function DecisionPanel({ view, decision, ticked }: { view: AlertView; decision?: Decision; ticked: boolean }) {
  const needs = view.needs_human_review;
  return (
    <Block label="no Carbon pattern: decision panel" className="concepts-decision">
      <Line name="recommended_action.type">{view.action_type}</Line>
      <Line name="detail">{view.action_detail ?? NO_TEXT}</Line>
      <Line name="review_reasons">
        {view.review_reasons.length ? view.review_reasons.join("; ") : "(none)"}
      </Line>
      {view.origin === "eval-label" && <Line>[assumed for wireframe, not from computeReview()]</Line>}
      {needs && (
        <div className="concepts-tick">
          <Block label="Carbon: checkbox">
            <Line>
              [{ticked ? "x" : " "}] I reviewed the evidence <Tag>statement</Tag>
            </Line>
          </Block>
        </div>
      )}
      {decision ? (
        <Line name="Result">
          <Tag strong>{decision === "confirmed" ? "Confirmed" : "Rejected"}</Tag>
        </Line>
      ) : (
        <div className="concepts-actions">
          <Button primary disabled={needs && !ticked}>
            Confirm
          </Button>
          <Button>Reject</Button>
        </div>
      )}
    </Block>
  );
}

// Same structure on every detail: overview, the details link, details (when open), decision panel.
// Key signals are the first 2 evidence fields (placeholder, pending the SOC analyst).
// Details hold the rest of the evidence and the raw fields.
function Detail({
  view,
  decision,
  ticked = false,
  open,
}: {
  view: AlertView;
  decision?: Decision;
  ticked?: boolean;
  open: boolean;
}) {
  return (
    <Block label="no Carbon pattern: case file" className="concepts-case">
      <div className="concepts-case-head">
        <Tag strong>{view.severity}</Tag>
        <Tag strong>{statusOf(view.needs_human_review, decision)}</Tag>
        <Tag>{shortTime(view.timestamp)}</Tag>
        <OriginTag view={view} />
      </div>
      <Line name={view.id}>{view.title}</Line>
      <Line>
        {view.source} · {view.classification} · confidence: {view.confidence ?? "[placeholder]"}
      </Line>
      <Block label="Carbon: structured list (summary)">
        <Line name="summary">{view.summary ?? NO_TEXT}</Line>
      </Block>
      <Block label="Carbon: structured list (key signals)">
        {view.evidence.slice(0, 2).map((e) => (
          <Line key={e.field} name={`${e.field} = ${e.value}`}>
            {e.why ?? NO_TEXT}
          </Line>
        ))}
      </Block>
      <Line>
        <span className="concepts-c21-link">{open ? "Hide details" : "View more details"}</span>
      </Line>
      {open && (
        <Block label="Carbon: structured list (details)">
          {view.evidence.slice(2).map((e) => (
            <Line key={e.field} name={`${e.field} = ${e.value}`}>
              {e.why ?? NO_TEXT}
            </Line>
          ))}
          {view.payload.slice(0, 3).map(([k, v]) => (
            <Line key={k} name={k}>
              {v}
            </Line>
          ))}
        </Block>
      )}
      <DecisionPanel view={view} decision={decision} ticked={ticked} />
    </Block>
  );
}

// Details are collapsed in Quick confirm and open in Needs review, unless a frame sets it.
function Screen({
  lane,
  view,
  decision,
  ticked,
  open,
}: {
  lane: Lane;
  view: AlertView;
  decision?: Decision;
  ticked?: boolean;
  open?: boolean;
}) {
  return (
    <Frame nav={false}>
      <div className="concepts-split concepts-split-c2">
        <List lane={lane} current={view.id} decision={decision} decidedLane={decision ? lane : undefined} />
        <Detail view={view} decision={decision} ticked={ticked} open={open ?? view.needs_human_review} />
      </div>
    </Frame>
  );
}

export function ConceptC21() {
  return (
    <div className="concepts-stack">
      <Shot caption="Detail: alert-006, Quick confirm lane, details collapsed (default). 2 clicks: select, Confirm">
        <Screen lane="quick" view={DETAIL["alert-006"]} />
      </Shot>
      <Shot caption="Detail: alert-006, Quick confirm lane, details open. Shows what View more details holds (extra frame)">
        <Screen lane="quick" view={DETAIL["alert-006"]} open />
      </Shot>
      <Shot caption="Detail: alert-003, Needs review lane, details open (default), tick set, Confirm enabled">
        <Screen lane="review" view={DETAIL["alert-003"]} ticked />
      </Shot>
      <Shot caption="Detail: alert-011, Needs review lane, details open (default), tick not set, Confirm disabled. 3 clicks: select, tick, Confirm">
        <Screen lane="review" view={DETAIL["alert-011"]} />
      </Shot>
      <Shot caption="After Confirm: alert-011 gets a check mark in the list and the status Confirmed at the top. The panel keeps the action and the tick as set, and shows Confirmed in place of the buttons">
        <Screen lane="review" view={DETAIL["alert-011"]} decision="confirmed" ticked />
      </Shot>
      <Shot caption="After Reject: alert-011 gets an X in the list and the status Rejected at the top. The panel keeps the action and the tick as it was (not set), and shows Rejected in place of the buttons. No Undo, no next step">
        <Screen lane="review" view={DETAIL["alert-011"]} decision="rejected" />
      </Shot>
    </div>
  );
}
