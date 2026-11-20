import { DETAIL, RANKED, type AlertView } from "./concepts-data";
import {
  ActionBlock,
  Block,
  Button,
  EvidenceBlock,
  Frame,
  Line,
  OriginTag,
  PayloadBlock,
  RowCells,
  Shot,
  SummaryBlock,
  Thumb,
  VerdictTags,
} from "./concepts-frame";

type Col = Parameters<typeof RowCells>[0]["cols"][number];
const FULL: Col[] = ["id", "source", "title", "severity", "classification", "action", "review", "time"];
const COMPACT: Col[] = ["id", "severity", "review"];

type State = "initial" | "ready" | "confirmed" | "rejected";

// The ranked table. With a panel open it shrinks to three columns.
function Queue({ compact = false, selected, done }: { compact?: boolean; selected?: string; done?: string }) {
  const cols = compact ? COMPACT : FULL;
  return (
    <Block label="Carbon: data table" className="concepts-table">
      <div className={`concepts-row concepts-row-head concepts-grid-${compact ? "compact" : "full"}`}>
        {cols.map((c) => (
          <span key={c} className="concepts-cell">
            {c === "action" ? "action" : c}
          </span>
        ))}
      </div>
      {RANKED.map((r) => (
        <div
          key={r.id}
          className={`concepts-row concepts-grid-${compact ? "compact" : "full"} ${
            r.id === selected ? "concepts-row-selected" : ""
          } ${r.id === done ? "concepts-row-done" : ""}`}
        >
          <RowCells row={r} cols={cols} />
        </div>
      ))}
    </Block>
  );
}

// Review-required results are gated by a checkbox. A result without review confirms in one click.
function Panel({ view, state }: { view: AlertView; state: State }) {
  const gated = view.needs_human_review;
  const decided = state === "confirmed" || state === "rejected";
  return (
    <Block label="Carbon: side panel" className="concepts-panel">
      <Line name={view.id}>{view.title}</Line>
      <OriginTag view={view} />
      <VerdictTags view={view} />
      <SummaryBlock view={view} />
      <EvidenceBlock view={view} />
      <ActionBlock view={view} />
      <PayloadBlock view={view} />
      {decided ? (
        <Block label="Carbon: inline notification">
          {state === "confirmed" ? "Confirmed by analyst" : "Rejected by analyst"}
        </Block>
      ) : (
        <>
          {gated && (
            <Block label="Carbon: checkbox">
              {state === "ready" ? "[x]" : "[ ]"} I reviewed the evidence
            </Block>
          )}
          <div className="concepts-actions">
            <Button primary disabled={gated && state === "initial"}>
              Confirm
            </Button>
            <Button>Reject</Button>
          </div>
        </>
      )}
    </Block>
  );
}

const DETAIL_IDS = ["alert-006", "alert-003", "alert-011"] as const;

export function ConceptA() {
  return (
    <div className="concepts-stack">
      <Shot caption="List: ranked queue">
        <Frame>
          <Queue />
        </Frame>
      </Shot>
      {DETAIL_IDS.map((id) => (
        <Shot key={id} caption={`Detail: ${id}`}>
          <Frame overlayAt="right" overlay={<Panel view={DETAIL[id]} state="initial" />}>
            <Queue compact selected={id} />
          </Frame>
        </Shot>
      ))}
      <div className="concepts-thumbs">
        <Thumb caption="Gated">
          <Frame overlayAt="right" overlay={<Panel view={DETAIL["alert-003"]} state="initial" />}>
            <Queue compact selected="alert-003" />
          </Frame>
        </Thumb>
        <Thumb caption="Ready">
          <Frame overlayAt="right" overlay={<Panel view={DETAIL["alert-003"]} state="ready" />}>
            <Queue compact selected="alert-003" />
          </Frame>
        </Thumb>
        <Thumb caption="Confirmed">
          <Frame overlayAt="right" overlay={<Panel view={DETAIL["alert-006"]} state="confirmed" />}>
            <Queue compact selected="alert-006" done="alert-006" />
          </Frame>
        </Thumb>
        <Thumb caption="Rejected">
          <Frame overlayAt="right" overlay={<Panel view={DETAIL["alert-011"]} state="rejected" />}>
            <Queue compact selected="alert-011" done="alert-011" />
          </Frame>
        </Thumb>
      </div>
    </div>
  );
}
