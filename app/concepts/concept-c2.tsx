import { DETAIL, LANE_CONFIRM, LANE_REVIEW, shortTime, type AlertView, type ListRow } from "./concepts-data";
import { Block, Button, Frame, Line, OriginTag, Shot, Tag } from "./concepts-frame";

type Lane = "quick" | "review";
type Decision = "confirmed" | "rejected";

// Status words come from one place, so the list card and the detail always match.
const statusOf = (needsReview: boolean, decision?: Decision) =>
  decision === "confirmed"
    ? "Confirmed"
    : decision === "rejected"
      ? "Rejected"
      : needsReview
        ? "Needs review"
        : "No review needed";

// Switch between the two lanes. Counts are open items, so a decided alert lowers its lane count.
function LaneSwitch({ lane, decidedLane }: { lane: Lane; decidedLane?: Lane }) {
  const quick = LANE_CONFIRM.length - (decidedLane === "quick" ? 1 : 0);
  const review = LANE_REVIEW.length - (decidedLane === "review" ? 1 : 0);
  return (
    <Block label="no pattern: switch">
      <div className="concepts-switch">
        <span className={lane === "quick" ? "concepts-switch-on" : ""}>Quick confirm ({quick})</span>
        <span className={lane === "review" ? "concepts-switch-on" : ""}>Needs review ({review})</span>
      </div>
    </Block>
  );
}

// Card field order matches the detail: status, severity, time, then "id: title".
function Item({ row, selected, decision }: { row: ListRow; selected: boolean; decision?: Decision }) {
  return (
    <div
      className={`concepts-item ${selected ? "concepts-row-selected" : ""} ${decision ? "concepts-row-done" : ""}`}
    >
      <Line>
        {statusOf(row.needs_human_review, decision)} · {row.severity} · {shortTime(row.timestamp)}
      </Line>
      <Line>
        {row.id}: {row.title}
      </Line>
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
    <div className="concepts-c2-list">
      <LaneSwitch lane={lane} decidedLane={decidedLane} />
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

// One column, top-down. Decision order as in C v1: read first, decide at the end.
function Detail({ view, decision, ticked = false }: { view: AlertView; decision?: Decision; ticked?: boolean }) {
  const needs = view.needs_human_review;
  const status = statusOf(needs, decision);
  const gated = needs && !ticked;
  return (
    <Block label="no Carbon pattern: case file" className="concepts-case">
      <div className="concepts-case-head">
        <Tag strong>{status}</Tag>
        <Tag>{view.severity}</Tag>
        <Tag>{shortTime(view.timestamp)}</Tag>
        <OriginTag view={view} />
      </div>
      <Line name={view.id}>{view.title}</Line>
      <Line>
        {view.source} · {view.classification} · confidence: {view.confidence ?? "[placeholder]"}
      </Line>
      <Block label="Carbon: structured list (summary)">
        <Line name="summary">{view.summary ?? "[placeholder: not in the eval label]"}</Line>
      </Block>
      <Block label="Carbon: structured list (evidence)">
        {view.evidence.slice(0, 3).map((e) => (
          <Line key={e.field} name={`${e.field} = ${e.value}`}>
            {e.why ?? "[placeholder: not in the eval label]"}
          </Line>
        ))}
      </Block>
      <Block label="Carbon: structured list (recommended action)">
        <Line name="recommended_action.type">{view.action_type}</Line>
        <Line name="detail">{view.action_detail ?? "[placeholder: not in the eval label]"}</Line>
        <Line name="review_reasons">
          {view.review_reasons.length ? view.review_reasons.join("; ") : "(none)"}
          {view.origin === "eval-label" && " [assumed for wireframe, not from computeReview()]"}
        </Line>
      </Block>
      <Block label="Carbon: structured list (raw_payload)">
        {view.payload.slice(0, 3).map(([k, v]) => (
          <Line key={k} name={k}>
            {v}
          </Line>
        ))}
      </Block>
      <Block label="no Carbon pattern: decision block" className="concepts-decision">
        <Line name="Review status">{status}</Line>
        {needs && !decision && (
          <div className="concepts-tick">
            <Block label="Carbon: checkbox">
              <Line>
                [{ticked ? "x" : " "}] I reviewed the evidence <Tag>statement</Tag>
              </Line>
            </Block>
          </div>
        )}
        {!decision && (
          <div className="concepts-actions">
            <Button primary disabled={gated}>
              Confirm
            </Button>
            <Button>Reject</Button>
          </div>
        )}
      </Block>
    </Block>
  );
}

function Screen({
  lane,
  view,
  decision,
  ticked,
}: {
  lane: Lane;
  view: AlertView;
  decision?: Decision;
  ticked?: boolean;
}) {
  return (
    <Frame nav={false}>
      <div className="concepts-split concepts-split-c2">
        <List lane={lane} current={view.id} decision={decision} decidedLane={decision ? lane : undefined} />
        <Detail view={view} decision={decision} ticked={ticked} />
      </div>
    </Frame>
  );
}

export function ConceptC2() {
  return (
    <div className="concepts-stack">
      <Shot caption="Detail: alert-006, Quick confirm lane. 2 clicks: select, Confirm">
        <Screen lane="quick" view={DETAIL["alert-006"]} />
      </Shot>
      <Shot caption="Detail: alert-003, Needs review lane, tick set, Confirm enabled">
        <Screen lane="review" view={DETAIL["alert-003"]} ticked />
      </Shot>
      <Shot caption="Detail: alert-011, Needs review lane, tick not set, Confirm disabled. 3 clicks: select, tick, Confirm">
        <Screen lane="review" view={DETAIL["alert-011"]} />
      </Shot>
      <Shot caption="After Confirm: alert-011 stays in its lane, greyed, status Confirmed">
        <Screen lane="review" view={DETAIL["alert-011"]} decision="confirmed" />
      </Shot>
      <Shot caption="After Reject: alert-011 stays in its lane, greyed, status Rejected. No Undo, no next step">
        <Screen lane="review" view={DETAIL["alert-011"]} decision="rejected" />
      </Shot>
    </div>
  );
}
