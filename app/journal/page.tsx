import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseJournal } from "../../lib/journal/parse";
import { renderCardBody } from "../../lib/journal/render";
import "./journal.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Build journal | SOC Alert Triage",
  description:
    "Day-by-day notes on taking an AI triage prototype from idea to a product a team can build.",
};

// Read once at build time. Vercel rebuilds on every push, so the page stays current.
const source = await readFile(path.join(process.cwd(), "docs", "JOURNAL.md"), "utf8");
const cards = parseJournal(source);

const META = ["15 November to 4 December 2026", "Fake data only", "Learning prototype"];

export default function JournalPage() {
  return (
    <div className={`${inter.className} journal-page`}>
      <header className="journal-topbar">
        <div className="journal-inner">
          <span className="journal-brand">Yuri Moshayev</span>
          <a href="https://yuri-moshayev.vercel.app/" className="journal-topLink">
            Portfolio
          </a>
        </div>
      </header>

      <main>
        <section className="journal-hero">
          <div className="journal-inner">
            <p className="journal-eyebrow">Build journal</p>
            <h1>SOC Alert Triage: what I&apos;m building, and how</h1>
            <p className="journal-intro">
              Day-by-day notes on taking an AI triage prototype from idea to a product a team can
              build.
            </p>
            <ul className="journal-meta">
              {META.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="journal-band">
          <div className="journal-inner">
            {cards.length === 0 ? (
              <p className="journal-empty">No journal entries yet.</p>
            ) : (
              <ol className="journal-cards">
                {cards.map((card, i) => (
                  <li key={`${card.day}-${i}`}>
                    <article className="journal-card">
                      <span className="journal-pill">Day {card.day}</span>
                      {card.title && <h2>{card.title}</h2>}
                      <div className="journal-body">{renderCardBody(card)}</div>
                    </article>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
      </main>

      <footer className="journal-footer">
        <div className="journal-inner">
          Learning prototype. Fake data only. Written with AI, checked by me.
        </div>
      </footer>
    </div>
  );
}
