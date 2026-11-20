import { DETAIL, LANE_CONFIRM, LANE_REVIEW, type AlertView, type ListRow } from "./concepts-data";
import {
  ActionBlock,
  Bars,
  Block,
  Button,
  EvidenceBlock,
  Frame,
  Line,
  OriginTag,
  PayloadBlock,
  Shot,
  SummaryBlock,
  Tag,
  Thumb,
  VerdictTags,
} from "./concepts-frame";

// Two lanes. The lane is the answer to "quick confirm or investigate".
function Lanes({ removed, doneBars = 0 }: { removed?: string; doneBars?: number }) {
  const quick = LANE_CONFIRM.filter((r) => r.id !== removed);
  const review = LANE_REVIEW.filter((r) => r.id !== removed);
  return (
    <div className="concepts-lanes">
      <div className="concepts-lane concepts-lane-quick">
        <Block label="Carbon: structured list (lane: confirm)">
          <Line name="Confirm">no review needed ({LANE_CONFIRM.length})</Line>
        </Block>
        {quick.map((r) => (
          <QuickRow key={r.id} row={r} />
        ))}
      </div>
      <div className="concepts-lane concepts-lane-review">
        <Block label="Carbon: structured list (lane: review first)">
          <Line name="Review first">needs human review ({LANE_REVIEW.length})</Line>
        </Block>
        {review.map((r) => (
          <ReviewRow key={r.id} row={r} />
        ))}
      </div>
      <div className="concepts-done">
        <Block label="no Carbon pattern: done strip">
          <Line name="Done">{doneBars ? "" : "empty"}</Line>
          <div className="concepts-done-bars">
            <Bars count={doneBars} narrow />
          </div>
        </Block>
      </div>
    </div>
  );
}

function QuickRow({ row }: { row: ListRow }) {
  return (
    <div className="concepts-lane-row">
      <span className="concepts-lane-text">
        {row.id}: {row.title}
      </span>
      <Tag>{row.action_type}</Tag>
      <Button primary>Confirm</Button>
    </div>
  );
}

function ReviewRow({ row }: { row: ListRow }) {
  return (
    <div className="concepts-lane-row">
      <span className="concepts-lane-text">
        {row.id}: {row.title}
      </span>
      <Tag strong>{row.severity}</Tag>
      <Tag>{row.action_type}</Tag>
    </div>
  );
}

// Detail opens over the lanes. Two columns: the case on the left, the action on the right.
function Detail({ view }: { view: AlertView }) {
  return (
    <Block label="Carbon: modal (full screen)" className="concepts-modal">
      <div className="concepts-modal-cols">
        <div>
          <Line name={view.id}>{view.title}</Line>
          <OriginTag view={view} />
          <VerdictTags view={view} />
          <SummaryBlock view={view} />
          <EvidenceBlock view={view} />
        </div>
        <div>
          <ActionBlock view={view} />
          <PayloadBlock view={view} />
          <div className="concepts-actions">
            <Button primary>Confirm</Button>
            <Button>Reject</Button>
            <Button>Close</Button>
          </div>
        </div>
      </div>
    </Block>
  );
}

const DETAIL_IDS = ["alert-006", "alert-003", "alert-011"] as const;

export function ConceptB() {
  return (
    <div className="concepts-stack">
      <Shot caption="List: lanes">
        <Frame nav={false}>
          <Lanes />
        </Frame>
      </Shot>
      {DETAIL_IDS.map((id) => (
        <Shot key={id} caption={`Detail: ${id}`}>
          <Frame nav={false} dim overlay={<Detail view={DETAIL[id]} />}>
            <Lanes />
          </Frame>
        </Shot>
      ))}
      <div className="concepts-thumbs">
        <Thumb caption="Confirmed">
          <Frame nav={false}>
            <Lanes removed="alert-006" doneBars={1} />
          </Frame>
        </Thumb>
        <Thumb caption="Rejected">
          <Frame nav={false}>
            <Lanes removed="alert-011" doneBars={1} />
          </Frame>
        </Thumb>
      </div>
    </div>
  );
}
