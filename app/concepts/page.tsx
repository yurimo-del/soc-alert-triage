import type { Metadata } from "next";
import Link from "next/link";
import { CONCEPTS, MISSING, QUESTIONS } from "./concepts-content";
import "./concepts.css";

export const metadata: Metadata = {
  title: "Wireframe concepts | SOC Alert Triage",
  description: "Step 2. Index of three greyscale wireframe concepts for the alert list and alert detail.",
};

// Index page: the questions, the comparison and a link to each concept. Screens live on /concepts/a, /b, /c.
export default function ConceptsIndexPage() {
  return (
    <main className="concepts-page">
      <header>
        <h1>Wireframe concepts: alert list and alert detail</h1>
        <p className="concepts-status">
          Draft wireframes. Greyscale. Placeholders. The AI is drawn as always right.
        </p>
      </header>

      <section>
        <h2>Concepts</h2>
        <ul>
          {CONCEPTS.map((c) => (
            <li key={c.id}>
              <Link href={`/concepts/${c.slug}`}>
                Concept {c.id}: {c.name}
              </Link>{" "}
              <span className="concepts-kind">{c.kind}</span>. {c.idea}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Design questions (section 8 of REQUIREMENTS.md)</h2>
        <ol>
          {QUESTIONS.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ol>
        <p>
          Data: eval set and recorded answers. Eval labels and review rules are draft v0, pending security review,
          shown as they are. alert-006 and alert-011 show the recorded answer. alert-003 shows the eval label. Lists
          use the eval labels for all 15 alerts.
        </p>
      </section>

      <section>
        <h2>Comparison</h2>
        <div className="concepts-scroll">
          <table className="concepts-comparison">
            <thead>
              <tr>
                <th>Concept</th>
                {QUESTIONS.map((q, i) => (
                  <th key={q}>Q{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CONCEPTS.map((c) => (
                <tr key={c.id}>
                  <th>
                    <Link href={`/concepts/${c.slug}`}>
                      {c.id}. {c.name}
                    </Link>
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

      <section className="concepts-concept">
        <h2>Fields we do not have</h2>
        <ul>
          {MISSING.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
