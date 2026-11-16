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

##### Set up the AI coding agent with rules, not reminders
**What:** Moved coding to Claude Code (run from the Claude app, Cursor used as editor) and gave it project rules in `CLAUDE.md` plus hard limits in `.claude/settings.json`.
**Why:** An agent that writes code in a public portfolio repo needs the same guardrails as a new team member: synthetic data only, no secrets, no commits on its own. Rules written as requests can be forgotten; tool settings cannot.
**How:**
1. Logged in with the Claude subscription. The API key for the app lives only in `.env.local`, because a key set as a system variable silently overrides the subscription.
2. Wrote `CLAUDE.md`: purpose, hard rules, stack, structure, AI layer rules, report format.
3. Blocked reading `.env.local`, `git commit` and `git push` in `.claude/settings.json`.
**Lesson:** Setting up the agent is design work: you define its role, limits and how it reports back, the same way you would onboard a person.
**AI note:** The first journal rule asked the agent to log every task. It produced noise, so the rule was changed to milestones only.

##### Defined the primary user and removed invented numbers
**What:** The primary user is the L1/L2 SOC analyst; the secondary user is the SOC manager. Success criteria no longer contain made-up time savings. See ADR-02.
**Why:** The analyst triages the alerts, so the screen is built for speed of decision. The manager sets review rules and must trust the system, which gives Phase 2 (trust) its story. Making the manager primary would turn the product into a dashboard instead of a triage tool. The earlier "5 minutes to 15 seconds" claim had no source, and an unsupported number in a portfolio project damages credibility more than having no number.
**How:**
1. Rewrote the User section of the one-pager.
2. Replaced the metrics with criteria the eval set can actually measure.
3. Recorded the decision as ADR-02.
**Lesson:** In an AI product, honest success criteria come from evals, not from estimates. A number appears only after the first measured run.
