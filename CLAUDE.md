# CLAUDE.md

Project rules for Claude Code. Read before every task.

@AGENTS.md

## What this project is

SOC Alert Triage & Incident Copilot. A **Learning Prototype** that shows the path from an AI prototype to a product an engineering team can build, adopt and scale.

The repository is part of the owner's portfolio. Keep it clean, documented and logically named. A reviewer should understand the project from the file tree alone.

- Primary user: L1/L2 SOC analyst (triages the alerts).
- Secondary user: SOC manager (sets the rules, needs to trust the system).
- Details: `docs/one-pager.md`, `docs/DECISIONS.md`.

## Hard rules

1. **Synthetic data only.** No real company names, customer data, real incidents or real public IPs. Use documentation IP ranges (192.0.2.x, 198.51.100.x, 203.0.113.x), private ranges, and `example.com` domains.
2. **Secrets.** Never read, print or copy `.env`, `.env.local` or any real env file. Only `.env.example` may be read or edited. API keys are used only in server code (route handlers, server modules), never in client components or `NEXT_PUBLIC_` variables.
3. **Git.** Do not run `git commit`, `git push`, or rewrite history. The owner commits. End each task with a proposed commit message.
4. **Dependencies.** Ask before adding any npm package and say why it is needed.
5. **Scope.** If a request adds a feature that does not help prove the prototype-to-product path, say so before doing it. Out of scope: live SIEM integrations, automated remediation, custom design system.
6. **Human in control.** The AI only suggests. Every recommended action requires human confirmation in the UI.
7. **No invented numbers.** Metrics in docs come only from eval runs. If a number is missing, write `TBD after eval run`.

## Stack

- Next.js 16 (App Router), TypeScript strict. This Next.js version has breaking changes: check `node_modules/next/dist/docs/` before using Next APIs.
- UI: IBM Carbon (`@carbon/react`). Tailwind came with the template. Do not build new UI with Tailwind until the open styling decision in `docs/DECISIONS.md` is closed.
- AI: provider adapter in `lib/ai/`. Claude is the default provider. Recorded fallback responses keep the demo working without network.

## Structure

| Path | Purpose |
|---|---|
| `app/` | Pages, components, route handlers |
| `lib/schemas/` | Alert and triage-result schemas. Single source of truth for data shapes |
| `lib/ai/` | Provider adapter: interface, providers, fallback, prompts |
| `data/alerts/` | Synthetic alerts and the eval set |
| `data/fallback/` | Recorded AI responses, one per alert id |
| `scripts/` | Eval runner and other dev scripts |
| `docs/` | One-pager, DECISIONS, JOURNAL, HANDOVER, SPRINT_PLAN, REQUIREMENTS, `prompts/` |
| `core/` | Project frame: brief, primary user, design system, constraints, evals guidelines, risk profile, review criteria |
| `concepts/` | Index and notes for the wireframe concepts (the pages are in `app/concepts/`) |
| `memory/` | Project notes: feedback and skill lessons. Repo `memory/` is project notes, not Claude's memory |
| `framework/` | Reusable layer: workflows, templates, quality gates, skills registry, changelog |
| `.claude/` | Reusable layer: agents, skills, commands, settings |

## Framework and project boundary

This repo has two layers:
- **Framework (reusable):** `.claude/` (agents, skills, commands) and `framework/` (workflows, templates, quality gates, skills registry, changelog).
- **Project (this product only):** `core/`, `data/`, `concepts/`, `app/`, `docs/`, `memory/`.

**Rule:** nothing in `.claude/` or `framework/` may name this product, its domain, its users or its design system. Skills refer to `core/` instead.

## Read order for any design task

1. All of `core/`. Stop and ask only if the task needs a file or field marked `[MISSING]`. Otherwise continue and list the gaps in your report.
2. `framework/workflows/prd-to-handover.md` and the step you are on.
3. `framework/quality/gates.md` for that step's exit criteria.

Never guess a value that is marked `[MISSING]`.

## Where things live (mapping to the framework)

| Framework concept | In this repo |
|---|---|
| Core | `core/` |
| Brain (data, research) | `data/`, `docs/one-pager.md`, `docs/REQUIREMENTS.md` |
| Outputs | `concepts/`, `app/`, `docs/HANDOVER.md` |
| Review criteria | `core/review-criteria.md` (template: `framework/templates/review-criteria.md`) |
| Plan | `docs/SPRINT_PLAN.md` |
| Prompts used for key steps | `docs/prompts/` |
| Memory: decisions | `docs/DECISIONS.md` |
| Memory: feedback | `memory/feedback.md` |
| Memory: skill lessons | `memory/skill-lessons.md` |
| Story of the work | `docs/JOURNAL.md` (story per important chunk, not a log) |

## Step numbering

The framework numbering wins (`framework/workflows/prd-to-handover.md`). Old Step 2 = framework step 3 (concepts and wireframes). Old journal entries and prompts are not rewritten.

## Skills

- Skills live flat in `.claude/skills/<skill-name>/SKILL.md`.
- Every skill starts with the header from `framework/templates/skill-header.md` and is listed in `framework/skills-registry.md`.
- We never copy text from third-party skills into this repo. We take the idea and write our own skill. The header and the registry record type own and the source as "inspired by" with a link. Type external is only for skills installed as is, outside this repo, and we never edit them.
- Every change to a skill: bump its version in the registry and log it in `framework/CHANGELOG.md`.

## AI layer rules

- UI and route handlers call only the adapter interface, never a provider SDK directly.
- Provider is selected by env `AI_PROVIDER` (`claude` | `gemini` | `fallback`). Model id comes from env `AI_MODEL`.
- Every AI response is validated against the triage-result schema. Invalid or failed response: use the recorded fallback and mark `source: "fallback"`.
- `needs_human_review` is computed in code from explicit rules. Never trust the model's own opinion for it.
- Prompts live in `lib/ai/prompts/` with a version string. Each result records provider, model and prompt version.

## Code style

- Code comments in English. Short. Explain why, not what.
- Small, focused changes. One task at a time.
- Clear names. No `temp`, `test2`, `new-final`.
- kebab-case for files and folders, PascalCase for React components.

## Docs

- All repo files in English.
- `docs/JOURNAL.md` is the story of the sprint, not a change log. Git history already records what changed.
- Write a journal entry only for a significant milestone: a product decision, an architecture decision, eval results, a problem that changed the approach, a handover step, or a change in how we work with AI agents. Skip renames, formatting and small fixes.
- When a task completes a milestone, propose the entry in your report and add it only after the owner approves. The owner edits the wording.
- Entry format, inside the current day section:

  ##### <Milestone title>
  **What:** one or two sentences.
  **Why:** the reasoning and the alternative we rejected.
  **How:** 2 to 4 short steps.
  **Lesson:** what this teaches about taking an AI prototype to a product.
  **AI note (optional):** where AI output helped or had to be corrected.

- Each day section starts with: Date (YYYY-MM-DD, Day N of 21) and Focus (one sentence).
- Link to the ADR when a milestone records a decision.
- A new product or architecture decision gets a new ADR in `docs/DECISIONS.md`: Context, Decision, Consequences, Status.

## Commands

- `npm run dev`: local server
- `npm run build`: production build, run before saying a task is done
- `npm run lint`: lint

## How to report back

End every task with:
1. Files changed
2. How to check it (command or page)
3. Open questions
4. Proposed commit message
