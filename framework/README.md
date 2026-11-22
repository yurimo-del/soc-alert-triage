# Design Agent Framework (v0.1)

A reusable way to run the product design process with AI agents in Claude Code:
product requirements in, a validated, handover-ready prototype out.

**Principle:** agents make the first pass, people make the decisions at every gate.
Every gate writes to memory, and lessons from each project make the skills stronger.

## Two layers, one rule

| Layer | Where | Travels to the next project? |
|---|---|---|
| Framework | `.claude/` (agents, skills, commands) and `framework/` (workflows, templates, quality gates) | Yes |
| Project | `core/`, project data, outputs, `memory/` | No. It stays with the project and may be confidential |

**The rule:** nothing in `.claude/` or `framework/` names a product, a company, a domain or a design system.
Skills say "use the design system in `core/design-system.md`", never a specific one.

## Start a new project

1. Copy `framework/templates/core/` into the project's `core/` and fill it in with stakeholders.
2. Copy `templates/review-criteria.md` to `core/review-criteria.md`. Set `core/risk-profile.md`. It decides how each user validation gate runs.
3. Run the workflow in `framework/workflows/prd-to-handover.md`.
4. At the end, move generalized lessons from `memory/skill-lessons.md` into the skills and log them in `framework/CHANGELOG.md`.

## Contents

- `workflows/prd-to-handover.md`: the 7 steps and their gates
- `quality/gates.md`: exit criteria for every step
- `templates/core/`: product brief, primary user, design system, constraints, evals guidelines, risk profile
- `templates/review-criteria.md`: the designer's definition of a good concept. Copy it to `core/review-criteria.md`
- `templates/skill-header.md`: origin and tuning record for every skill
- `skills-registry.md`: every skill, its type (own or external), what it is inspired by, version and status
- `CHANGELOG.md`: how the framework and its skills changed, and why
