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
| `docs/` | One-pager, DECISIONS, JOURNAL, HANDOVER |

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
- After each task, add 2 to 4 lines to `docs/JOURNAL.md` under today's date: what was done, what was hard, what was learned. Plain and short.
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
