import type { ReactNode } from "react";
import { shortTime, type AlertView, type ListRow } from "./concepts-data";

// Label sits above the block, outside its border. Hidden unless the page toggle is on.
export function Block({
  label,
  children,
  className = "",
}: {
  label: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className="concepts-block">
      <span className="concepts-label">[{label}]</span>
      <div className={`concepts-box ${className}`}>{children}</div>
    </div>
  );
}

export function Bars({ count, narrow = false }: { count: number; narrow?: boolean }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`concepts-bar ${narrow ? "concepts-bar-narrow" : ""}`} />
      ))}
    </>
  );
}

// One short line. Long text is cut with "..." by CSS.
export function Line({ name, children }: { name?: string; children: ReactNode }) {
  return (
    <div className="concepts-line">
      {name && <b>{name}: </b>}
      {children}
    </div>
  );
}

export function Tag({ children, strong = false }: { children: ReactNode; strong?: boolean }) {
  return <span className={`concepts-tag ${strong ? "concepts-tag-strong" : ""}`}>{children}</span>;
}

export function Button({
  children,
  primary = false,
  disabled = false,
}: {
  children: ReactNode;
  primary?: boolean;
  disabled?: boolean;
}) {
  const cls = `${primary ? "concepts-primary" : ""} ${disabled ? "concepts-disabled" : ""}`;
  return (
    <Block label="Carbon: button" className={cls}>
      {children}
    </Block>
  );
}

const NO_TEXT = "[placeholder: not in the eval label]";

export function OriginTag({ view }: { view: AlertView }) {
  return view.origin === "recorded" ? (
    <Tag strong>Recorded response (fallback)</Tag>
  ) : (
    <Tag strong>Eval label, not a recorded response</Tag>
  );
}

export function VerdictTags({ view }: { view: AlertView }) {
  return (
    <Block label="Carbon: tag">
      <div className="concepts-tags">
        <Tag strong>{view.severity}</Tag>
        <Tag>{view.classification}</Tag>
        <Tag>confidence: {view.confidence ?? "[placeholder]"}</Tag>
        <Tag strong={view.needs_human_review}>
          {view.needs_human_review ? "needs human review" : "no review needed"}
        </Tag>
      </div>
    </Block>
  );
}

export function SummaryBlock({ view }: { view: AlertView }) {
  return (
    <Block label="Carbon: structured list (summary)">
      <Line name="summary">{view.summary ?? NO_TEXT}</Line>
    </Block>
  );
}

export function EvidenceBlock({ view, max = 5 }: { view: AlertView; max?: number }) {
  return (
    <Block label="Carbon: structured list (evidence)">
      {view.evidence.slice(0, max).map((e) => (
        <Line key={e.field} name={`${e.field} = ${e.value}`}>
          {e.why ?? NO_TEXT}
        </Line>
      ))}
    </Block>
  );
}

export function ActionBlock({ view }: { view: AlertView }) {
  return (
    <Block label="Carbon: structured list (recommended action)">
      <Line name="recommended_action.type">{view.action_type}</Line>
      <Line name="detail">{view.action_detail ?? NO_TEXT}</Line>
      <Line name="review_reasons">
        {view.review_reasons.length ? view.review_reasons.join("; ") : "(none)"}
      </Line>
      {view.origin === "eval-label" && (
        <Line>[assumed for wireframe, not from computeReview()]</Line>
      )}
    </Block>
  );
}

export function PayloadBlock({ view, max = 6 }: { view: AlertView; max?: number }) {
  return (
    <Block label="Carbon: structured list (raw_payload)">
      <Line name="source">{view.source}</Line>
      <Line name="timestamp">{view.timestamp}</Line>
      {view.payload.slice(0, max).map(([k, v]) => (
        <Line key={k} name={k}>
          {v}
        </Line>
      ))}
    </Block>
  );
}

export function RowCells({ row, cols }: { row: ListRow; cols: ("id" | "source" | "title" | "severity" | "classification" | "action" | "review" | "time")[] }) {
  const cell: Record<string, ReactNode> = {
    id: row.id,
    source: row.source,
    title: row.title,
    severity: row.severity,
    classification: row.classification,
    action: row.action_type,
    review: row.needs_human_review ? <Tag strong>review</Tag> : <span className="concepts-bar concepts-bar-inline" />,
    time: shortTime(row.timestamp),
  };
  return (
    <>
      {cols.map((c) => (
        <span key={c} className={`concepts-cell concepts-cell-${c}`}>
          {cell[c]}
        </span>
      ))}
    </>
  );
}

// One screen: grid zones header, nav, content. The overlay shares the content cell, on top.
export function Frame({
  children,
  overlay,
  overlayAt = "center",
  dim = false,
  nav = true,
}: {
  children: ReactNode;
  overlay?: ReactNode;
  overlayAt?: "center" | "right" | "full";
  dim?: boolean;
  nav?: boolean;
}) {
  return (
    <div className="concepts-screen">
      <div className={`concepts-frame ${nav ? "" : "concepts-frame-nonav"}`}>
        <div className="concepts-header">
          <span className="concepts-label">[Carbon: header]</span>
          <div className="concepts-bar concepts-w20" />
          <div className="concepts-bar concepts-w10" />
          <span className="concepts-draft">Labels and review rules: draft v0, pending security review</span>
        </div>
        {nav && (
          <div className="concepts-nav">
            <span className="concepts-label">[Carbon: side nav]</span>
            <Bars count={4} />
          </div>
        )}
        <div className="concepts-content">{children}</div>
        {overlay && (
          <div className={`concepts-overlay concepts-at-${overlayAt} ${dim ? "concepts-dim" : ""}`}>
            <div className="concepts-overlay-item">{overlay}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Shot({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="concepts-shot">
      <figcaption>{caption}</figcaption>
      {children}
    </figure>
  );
}

export function Thumb({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="concepts-thumb">
      {children}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
