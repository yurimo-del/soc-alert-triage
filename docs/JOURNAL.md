# Engineering Journal

## Day 1 — Foundation & Architecture Skeleton
* **Completed:**
  * Initialized repository structure and core documentation.
  * Defined product One-Pager, core JTBD, and strict scope boundaries.
  * Created initial synthetic evaluation dataset (`eval-set.json`).
* **Challenges / Key Learnings:**
  * Focused on defining rigid data schemas and contracts *before* designing UI components (Rule #0: Logic before screen).

---

## Sprint Log (merged from "AI SPRING LOG.md")

### AI Sprint Log: SOC Alert Triage Journey

#### Day 1: Foundation & Infrastructure
* **Date:** Day 1 of 21-day Sprint
* **Focus:** Setting up a professional engineering skeleton, establishing product boundaries, and deploying the first live frame.

**What we did step by step:**
1. **Repository Setup:** Created a clean public GitHub repository (`soc-alert-triage`), configured a Node `.gitignore` to protect environment secrets, and applied an MIT License.
2. **Product Guardrails (One-Pager):** Defined the target user (L1/L2 SOC Analyst), core JTBD (instant triage during alert floods), and strict out-of-scope boundaries to prevent scope creep.
3. **Architecture & Documentation:** Wrote foundational docs (`README.md`, `DECISIONS.md` for IBM Carbon choice, and `JOURNAL.md`).
4. **Environment Constraints & Fixes:** Handled Windows/PowerShell path specifics and resolved Git merge conflicts arising from initial remote templates using local-first overrides.
5. **Tech Stack & Deployment:** Initialized Next.js (App Router), installed IBM Carbon Design System (`@carbon/react`), and successfully deployed the working skeleton to Vercel for a Day-1 live link.

**Key Takeaway / Lesson:** 
* *Rule #0 enforced:* Fixing the repository structure and product constraints before touching any UI code establishes a solid, stress-free foundation.

---

#### Day 2: Data Contracts & Fallback Architecture
* **Date:** Day 2 of 21-day Sprint
* **Focus:** Moving from infrastructure to logic. Defining what the AI agent actually returns and protecting the public demo from failing.

**What we are doing today:**
* *I started with planning what I'm going to do today.*
1. **Defining the Data Contract (JSON Schema / Zod):** Instead of designing screens, we map out the exact data structure the AI must return (severity badge, classification, plain-English reasoning, and actionable next steps).
2. **Claude API & Zero-Failure Fallbacks:** Designing the integration logic with built-in spending safety limits, plus a smart fallback mechanism that swaps in pre-verified JSON responses if the API ever rate-limits or goes down.

---

## 2026-11-16 — Repo cleanup
* Renamed package, set real page metadata, added `.env.example` and gitignore rules.
* Merged the old sprint log into this journal. Kept all content, demoted headings to fit.
* Learned: `.env*` ignores `.env.example` too, so it needs an explicit `!` exception.
