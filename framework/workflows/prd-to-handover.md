# Workflow: PRD to handover-ready prototype

**Before every step:** read all of `core/`. Stop and ask only if the step needs a file or field marked `[MISSING]`. Otherwise continue and list the gaps in your report. Never guess.

## Steps

| # | Step | Agent / skill | Output | Gate: who decides what |
|---|---|---|---|---|
| 0 | Read the existing product | Claude Code, manual walkthrough | layer map of 1-2 areas: navigation, layout, flows, business processes, data points, behavior | Designer: which areas and layers matter |
| 1 | Requirements review | requirements-review skill (planned; manual in v0.1) | open questions on the PRD | Designer: which gaps matter |
| 2 | Core | templates in `framework/templates/core/` | filled `core/` | Designer + stakeholders: the frame every later decision uses |
| 3 | Concepts and wireframes | wireframe skill | 2-3 distinct directions | none, goes straight to review |
| 4 | Conceptual review | review skill (designer-tuned) | review per direction, against `core/review-criteria.md` | A: Designer accepts, rejects or redirects. B: real users choose the main direction (mode from risk profile). Loop to step 3 until a direction passes |
| 5 | Interactive prototype | Claude Code | working prototype on the core design system, deployed preview | none, goes straight to validation |
| 6 | Validation | none (people) | findings with severity | Real users on real tasks (mode from risk profile). Findings compared with the step 4 review |
| 7 | UX rules skill | UX rules skill (planned) | The product's UX packaged so a developer and their AI agent can build a new screen without a designer for each page | Done when a developer built a new screen with it and the findings are logged. Every question or deviation is a gap to fix |

## User validation modes (set per gate in `core/risk-profile.md`)

| Mode | What it is | Use when |
|---|---|---|
| Full session | 45-60 min, real tasks, notes | New concept, high cost of error |
| Quick check | 15 min or async, 2-3 options, "which would you use and why" | Choosing a direction, limited access to users |
| Expert proxy | A domain expert who is not a daily user, role recorded honestly | No daily users available |
| Skipped | Only with a written rationale in project decisions | Known pattern, small change, prior evidence in this project |

**Hard rules**
- Never skip both user gates (4B and 6) for a new concept with a high cost of error.
- When risk is high, collect at least two independent opinions at 4B. Do not show one person's answer to another.
- Record every reduced or skipped gate and why. A reduced gate is a decision, not a shortcut.

## Fine-tuning loop (where the skills get better)

- Step 4: compare the review skill's verdict with the designer's blind review and with the users' choice.
- Step 6: compare user findings with what the step 4 review predicted. A finding the skill missed is the strongest tuning signal.
- Step 7: every developer question or deviation is a gap in the UX rules skill.
- Log each gap in `memory/skill-lessons.md`, fix the skill, bump its version in `framework/skills-registry.md`.

## Memory

- Project facts, decisions and feedback stay with the project.
- Lessons about a skill are generalized (no project facts) and moved into the framework at the end of the project.
