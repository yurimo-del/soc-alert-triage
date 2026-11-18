import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./concepts-test.css";

export const metadata: Metadata = {
  title: "Wireframe test: email compose | SOC Alert Triage",
  description: "Skill test. Greyscale wireframes of a dialog to compose and send an email.",
};

// Skill test only. Brief: "a dialog to compose and send an email message".
// The brief lists no design questions, so these are assumed.
const QUESTIONS = [
  "Where does composing happen?",
  "How are recipients and subject entered?",
  "What protects against sending by mistake?",
  "What does the user see after sending, or when sending fails?",
] as const;

const CONCEPTS = [
  {
    id: "A",
    name: "Centered modal",
    kind: "conservative",
    answers: [
      "Modal in the middle, inbox dimmed and blocked.",
      "Three stacked inputs: To, Subject, Message.",
      "Confirm step only if recipient or subject is empty.",
      "Toast after sending. On failure, error inside the modal.",
    ],
    tradeoff: "Good: familiar. Costs: the inbox is blocked while writing.",
  },
  {
    id: "B",
    name: "Docked panel with undo",
    kind: "conservative",
    answers: [
      "Small panel in the bottom-right corner, inbox stays usable.",
      "Recipients as tags, subject on one compact row.",
      "Send is instant, then a 10 second undo bar.",
      "Undo bar becomes a sent notice. On failure the panel reopens.",
    ],
    tradeoff: "Good: multitasking and undo. Costs: small writing area.",
  },
  {
    id: "C",
    name: "Three-column workspace",
    kind: "novel",
    answers: [
      "Full-screen workspace, three regions, no inbox.",
      "Pick recipients from a contact list. Subject is the canvas title.",
      "Live checklist on the right. Send stays disabled until all ticked.",
      "Banner across the top. On failure the banner offers Retry.",
    ],
    tradeoff: "Good: errors visible before sending. Costs: loses the inbox view.",
  },
] as const;

// Label sits above the block, outside its border. Hidden unless the toggle is on.
function Block({
  label,
  children,
  className = "",
}: {
  label: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className="concepts-test-block">
      <span className="concepts-test-label">[{label}]</span>
      <div className={`concepts-test-box ${className}`}>{children}</div>
    </div>
  );
}

function Bars({ count, tall = false }: { count: number; tall?: boolean }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`concepts-test-bar ${tall ? "concepts-test-bar-tall" : ""}`} />
      ))}
    </>
  );
}

function Field({ name, tall = false }: { name: string; tall?: boolean }) {
  return (
    <Block label={tall ? "Carbon: text area" : "Carbon: text input"}>
      <div className="concepts-test-fieldname">{name}</div>
      <div className={`concepts-test-input ${tall ? "concepts-test-input-tall" : ""}`} />
    </Block>
  );
}

function Button({ children, primary = false }: { children: ReactNode; primary?: boolean }) {
  return (
    <Block label="Carbon: button" className={primary ? "concepts-test-primary" : ""}>
      {children}
    </Block>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="concepts-test-row">{children}</div>;
}

// One screen: grid zones header, nav, content. The overlay shares the content cell, on top.
function Frame({
  children,
  overlay,
  overlayAt = "center",
  dim = false,
  nav = true,
}: {
  children: ReactNode;
  overlay?: ReactNode;
  overlayAt?: "center" | "bottom-right" | "bottom-left" | "top-right" | "top";
  dim?: boolean;
  nav?: boolean;
}) {
  return (
    <div className={`concepts-test-screen`}>
      <div className={`concepts-test-frame ${nav ? "" : "concepts-test-frame-nonav"}`}>
        <div className="concepts-test-header">
          <span className="concepts-test-label">[Carbon: header]</span>
          <div className="concepts-test-header-bars">
            <div className="concepts-test-bar concepts-test-w30" />
            <div className="concepts-test-bar concepts-test-w20" />
          </div>
        </div>
        {nav && (
          <div className="concepts-test-nav">
            <span className="concepts-test-label">[Carbon: side nav]</span>
            <Bars count={4} />
          </div>
        )}
        <div className="concepts-test-content">{children}</div>
        {overlay && (
          <div
            className={`concepts-test-overlay concepts-test-at-${overlayAt} ${dim ? "concepts-test-dim" : ""}`}
          >
            <div className="concepts-test-overlay-item">{overlay}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function Inbox() {
  return (
    <div className="concepts-test-inbox">
      <span className="concepts-test-label">[Carbon: data table (inbox)]</span>
      <Bars count={8} />
    </div>
  );
}

function Thumb({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="concepts-test-thumb">
      {children}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function Concept({
  main,
  thumbs,
}: {
  main: ReactNode;
  thumbs: ReactNode;
}) {
  return (
    <div className="concepts-test-layout">
      <div className="concepts-test-main">{main}</div>
      <div className="concepts-test-thumbs">{thumbs}</div>
    </div>
  );
}

function ConceptA() {
  return (
    <Concept
      main={
        <Frame
          dim
          overlay={
            <Block label="Carbon: modal">
              <Field name="To" />
              <Field name="Subject" />
              <Field name="Message" tall />
              <Row>
                <Button primary>Send</Button>
                <Button>Discard</Button>
              </Row>
            </Block>
          }
        >
          <Inbox />
        </Frame>
      }
      thumbs={
        <>
          <Thumb caption="Sent: toast">
            <Frame
              overlayAt="top-right"
              overlay={
                <Block label="Carbon: toast notification">Sent</Block>
              }
            >
              <Inbox />
            </Frame>
          </Thumb>
          <Thumb caption="Failed: error in modal">
            <Frame
              dim
              overlay={
                <Block label="Carbon: modal">
                  <Block label="Carbon: inline notification">Failed</Block>
                  <Button primary>Retry</Button>
                </Block>
              }
            >
              <Inbox />
            </Frame>
          </Thumb>
        </>
      }
    />
  );
}

function ConceptB() {
  return (
    <Concept
      main={
        <Frame
          overlayAt="bottom-right"
          overlay={
            <Block label="no Carbon pattern: docked panel">
              <Block label="Carbon: tag">To</Block>
              <Field name="Subject" />
              <Field name="Message" tall />
              <Row>
                <Button primary>Send</Button>
                <Button>Minimize</Button>
              </Row>
            </Block>
          }
        >
          <Inbox />
        </Frame>
      }
      thumbs={
        <>
          <Thumb caption="Sent: undo bar">
            <Frame
              overlayAt="bottom-left"
              overlay={
                <Block label="Carbon: actionable notification">Sent. Undo</Block>
              }
            >
              <Inbox />
            </Frame>
          </Thumb>
          <Thumb caption="Failed: panel reopens">
            <Frame
              overlayAt="bottom-right"
              overlay={
                <Block label="no Carbon pattern: docked panel">
                  <Block label="Carbon: inline notification">Failed</Block>
                  <Button primary>Retry</Button>
                </Block>
              }
            >
              <Inbox />
            </Frame>
          </Thumb>
        </>
      }
    />
  );
}

function Workspace({ faded = false }: { faded?: boolean }) {
  return (
    <div className={`concepts-test-workspace ${faded ? "concepts-test-faded" : ""}`}>
      <div className="concepts-test-col concepts-test-col-side">
        <Block label="Carbon: selectable list (contacts)">
          <div className="concepts-test-fieldname">Recipients</div>
          <Bars count={5} />
        </Block>
      </div>
      <div className="concepts-test-col concepts-test-col-main">
        <Block label="Carbon: text input (title)">
          <div className="concepts-test-fieldname">Subject</div>
          <div className="concepts-test-input" />
        </Block>
        <Block label="Carbon: text area">
          <div className="concepts-test-input concepts-test-input-canvas" />
        </Block>
      </div>
      <div className="concepts-test-col concepts-test-col-side">
        <Block label="Carbon: structured list (live checklist)">
          <div className="concepts-test-fieldname">Ready to send?</div>
          <Bars count={4} />
        </Block>
        <Button primary>Send</Button>
      </div>
    </div>
  );
}

function ConceptC() {
  return (
    <Concept
      main={
        <Frame nav={false}>
          <Workspace />
        </Frame>
      }
      thumbs={
        <>
          <Thumb caption="Sent: banner">
            <Frame
              nav={false}
              overlayAt="top"
              overlay={
                <Block label="Carbon: inline notification">Sent</Block>
              }
            >
              <Workspace faded />
            </Frame>
          </Thumb>
          <Thumb caption="Failed: banner with retry">
            <Frame
              nav={false}
              overlayAt="top"
              overlay={
                <Block label="Carbon: actionable notification">Failed. Retry</Block>
              }
            >
              <Workspace />
            </Frame>
          </Thumb>
        </>
      }
    />
  );
}

const SCREENS: Record<string, () => ReactNode> = { A: ConceptA, B: ConceptB, C: ConceptC };

export default function ConceptsTestPage() {
  return (
    <main className="concepts-test-page">
      <input type="checkbox" id="concepts-test-toggle" className="concepts-test-toggle" />
      <header>
        <h1>Wireframe concepts: compose and send an email</h1>
        <p className="concepts-test-status">
          Draft wireframes. Greyscale. Placeholders. Test of the wireframe skill.
        </p>
        <label htmlFor="concepts-test-toggle" className="concepts-test-toggle-label">
          Show Carbon pattern labels
        </label>
      </header>

      <section>
        <h2>Design questions (assumed, the brief lists none)</h2>
        <ol>
          {QUESTIONS.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ol>
      </section>

      <section>
        <h2>Comparison</h2>
        <div className="concepts-test-scroll">
          <table className="concepts-test-table">
            <thead>
              <tr>
                <th>Concept</th>
                {QUESTIONS.map((q, i) => (
                  <th key={q}>Q{i + 1}. {q}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CONCEPTS.map((c) => (
                <tr key={c.id}>
                  <th>
                    {c.id}. {c.name}
                    <br />
                    <em>{c.kind}</em>
                  </th>
                  {c.answers.map((a) => (
                    <td key={a}>{a}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {CONCEPTS.map((c) => {
        const Screens = SCREENS[c.id];
        return (
          <section key={c.id} className="concepts-test-concept">
            <h2>
              Concept {c.id}: {c.name} <span className="concepts-test-kind">{c.kind}</span>
            </h2>
            <Screens />
            <p className="concepts-test-tradeoff">{c.tradeoff}</p>
          </section>
        );
      })}
    </main>
  );
}
