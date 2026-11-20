import Link from "next/link";
import { ConceptA } from "./concept-a";
import { ConceptB } from "./concept-b";
import { ConceptC } from "./concept-c";
import { CONCEPTS, QUESTIONS } from "./concepts-content";
import "./concepts.css";

const SCREENS = { A: ConceptA, B: ConceptB, C: ConceptC };

// One concept on its own page, so it can be linked alone. The screens are unchanged.
export function ConceptPage({ id }: { id: "A" | "B" | "C" }) {
  const c = CONCEPTS.find((x) => x.id === id)!;
  const Screens = SCREENS[id];
  return (
    <main className="concepts-page">
      <input type="checkbox" id="concepts-toggle" className="concepts-toggle" />
      <header>
        <p className="concepts-back">
          <Link href="/concepts">All concepts</Link>
        </p>
        <h1>
          Concept {c.id}: {c.name} <span className="concepts-kind">{c.kind}</span>
        </h1>
        <p className="concepts-status">
          Draft wireframes. Greyscale. Placeholders. The AI is drawn as always right.
        </p>
        <label htmlFor="concepts-toggle" className="concepts-toggle-label">
          Show Carbon pattern labels
        </label>
      </header>

      <section>
        <h2>Design questions and this concept&apos;s answers</h2>
        <table className="concepts-comparison concepts-qa">
          <tbody>
            {QUESTIONS.map((q, i) => (
              <tr key={q}>
                <th>
                  Q{i + 1}. {q}
                </th>
                <td>{c.answers[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Idea</h2>
        <p>{c.idea}</p>
        <div className="concepts-card">
          <p>
            <b>Trade-off:</b> {c.tradeoff}
          </p>
          <p>
            <b>Assumes about the analyst:</b> {c.assumes}
          </p>
        </div>
      </section>

      <section className="concepts-concept">
        <h2><h>Screens</h></h2>
        <Screens />
      </section>
    </main>
  );
}
