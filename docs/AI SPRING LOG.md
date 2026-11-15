# AI Sprint Log: SOC Alert Triage Journey

## Day 1: Foundation & Infrastructure
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