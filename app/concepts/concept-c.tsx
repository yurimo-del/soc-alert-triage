import type { ReactNode } from "react";
import { DETAIL, RANKED, type AlertView } from "./concepts-data";
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

const WINDOW = 7;

// Worklist rail: a window of the ranked order around the current alert.
function Rail({ current, done = [] }: { current: string; done?: string[] }) {
  const idx = Math.max(0, RANKED.findIndex((r) => r.id === current));
  const start = Math.min(Math.max(0, idx - 3), RANKED.length - WINDOW);
  const rows = RANKED.slice(start, start + WINDOW);
  return (
    <Block label="Carbon: structured list (worklist rail)" className="concepts-rail">
      {start > 0 && <div className="concepts-bar concepts-bar-narrow" />}
      {rows.map((r) => (
        <div
          key={r.id}
          className={`concepts-rail-item ${r.id === current ? "concepts-row-selected" : ""} ${
            done.includes(r.id) ? "concepts-row-done" : ""
          }`}
        >
          {r.id} <Tag strong={r.needs_human_review}>{r.severity}</Tag>
        </div>
      ))}
      {start + WINDOW < RANKED.length && <div className="concepts-bar concepts-bar-narrow" />}
    </Block>
  );
}

// Quick: no review needed, confirm sits on top. Review: evidence first, confirm at the bottom.
function Case({ view }: { view: AlertView }) {
  const quick = !view.needs_human_review;
  const bar = (
    <div className="concepts-actions">
      <Button primary>Confirm</Button>
      <Button>Reject</Button>
    </div>
  );
  return (
    <Block label="no Carbon pattern: case file" className="concepts-case">
      <Line name={view.id}>{view.title}</Line>
      <div className="concepts-case-head">
        <OriginTag view={view} />
        <VerdictTags view={view} />
      </div>
      {quick && bar}
      <div className="concepts-case-cols">
        <div>
          <PayloadBlock view={view} />
        </div>
        <div>
          {quick ? (
            <>
              <ActionBlock view={view} />
              <SummaryBlock view={view} />
              <EvidenceBlock view={view} />
            </>
          ) : (
            <>
              <EvidenceBlock view={view} />
              <SummaryBlock view={view} />
              <ActionBlock view={view} />
            </>
          )}
        </div>
      </div>
      {!quick && bar}
    </Block>
  );
}

function CaseSkeleton() {
  return (
    <Block label="no Carbon pattern: case file" className="concepts-case">
      <Bars count={3} />
      <div className="concepts-case-cols">
        <div>
          <Bars count={5} />
        </div>
        <div>
          <Bars count={7} />
        </div>
      </div>
    </Block>
  );
}

function Screen({ current, done, children }: { current: string; done?: string[]; children: ReactNode }) {
  return (
    <Frame nav={false}>
      <div className="concepts-split">
        <Rail current={current} done={done} />
        {children}
      </div>
    </Frame>
  );
}

// The alert that follows in the ranked order.
const nextOf = (id: string) => RANKED[RANKED.findIndex((r) => r.id === id) + 1].id;

const DETAIL_IDS = ["alert-006", "alert-003", "alert-011"] as const;

export function ConceptC() {
  return (
    <div className="concepts-stack">
      <Shot caption="List: worklist rail with the first alert open">
        <Screen current={RANKED[0].id}>
          <CaseSkeleton />
        </Screen>
      </Shot>
      {DETAIL_IDS.map((id) => (
        <Shot key={id} caption={`Detail: ${id}`}>
          <Screen current={id}>
            <Case view={DETAIL[id]} />
          </Screen>
        </Shot>
      ))}
      <div className="concepts-thumbs">
        <Thumb caption="Confirmed: next">
          <Screen current={nextOf("alert-006")} done={["alert-006"]}>
            <CaseSkeleton />
          </Screen>
        </Thumb>
        <Thumb caption="Rejected: next">
          <Screen current={nextOf("alert-011")} done={["alert-011"]}>
            <CaseSkeleton />
          </Screen>
        </Thumb>
      </div>
    </div>
  );
}
