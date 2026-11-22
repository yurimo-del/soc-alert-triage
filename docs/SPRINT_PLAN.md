# Sprint plan (updated day 6, 2026-11-22)

**Sprint:** Nov 15 to Dec 4, 2026. Mornings for job search, afternoons for the sprint.

**Focus from day 6:** two skills only.
1. **Conceptual review skill:** the main fine-tuning work.
2. **Handover skill:** proven by a real developer test.

The wireframe skill is our own (version 0.2). The critique skill was dropped (ADR-08). The framework boundary is built inside this repo now and moved to its own repo at the end.

## What changed on day 6 and why
- After studying an agent-team setup (agents, shared knowledge, core, tools, outputs, memory), the repo is split into a reusable framework and a project layer, so the same process can run on the next product.
- The workflow now has two separate user gates: direction choice on wireframes (4B) and validation of the working prototype (6). Each is run in a mode set by the project risk profile.
- Three security experts: two give independent direction picks on wireframes, a third validates the prototype with fresh eyes.

## Day by day

| Day | Date | Work | Done when |
|---|---|---|---|
| 6 | Sun 22.11 | Framework boundary, core, risk profile, updated plan, expert outreach | Structure committed, core gaps marked, messages sent |
| 7 | Mon 23.11 | Write the review criteria (5-7 criteria). Wireframes for 2-3 directions. Review iteration 1: blind review first, then the skill, compare, fix | Review criteria in core, iteration 1 logged |
| 8 | Tue 24.11 | Review iterations 2-3. Quick check with two experts, each alone, 15 min | Main direction chosen, skill vs designer vs experts logged |
| 9 | Wed 25.11 | Interactive prototype of the chosen direction, deployed on Vercel | Prototype runs on synthetic data, gaps listed |
| 10 | Thu 26.11 | Full validation session with the third expert (or Sun 29.11). Compare findings with the review | Findings logged with severity, skill lessons logged |
| - | Fri-Sat 27-28.11 | Light: journal only | |
| 11 | Sun 29.11 | Handover package with the handover skill, sent to the developer | Package passes the handover quality gate |
| 12-13 | Mon-Tue 30.11-01.12 | Developer builds from the package; log every question | Questions logged in memory/feedback.md |
| 14 | Wed 02.12 | Move `.claude/` and `framework/` to a public `design-agent-framework` repo; check nothing project-specific leaked | Clean repo with a "start a new project" README |
| 15 | Thu 03.12 | Fix the handover skill from developer questions; journal; case study material | Skills at new versions, changelog updated |
| - | Fri 04.12 | Buffer and close | |

**After the sprint (December):** run the framework on a second product (chest X-ray reviewer or access review). If mostly `core/` had to change, reuse is proven.

## Fallback rules
- If by Mon 23.11 only one expert has confirmed: that person does the quick check on Tue and the full session on Thu, or one combined session on Thu. The reduced validation goes into HANDOVER.md as a risk.
- Do not wait for people and do not move the plan.

## Out of scope until the sprint ends
Deep eval work, multi-agent orchestration, scheduled tasks, new app features, plugin packaging, Figma integration, new agents beyond what a step needs.
