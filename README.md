# SOC Alert Triage & Incident Copilot

> **Learning Prototype.** All alerts are synthetic JSON. No real customer or production data is used.

A design-led prototype that explores how an AI copilot can help a SOC team triage alerts faster without losing human control or quality. The project documents the full path from AI prototype to a product an engineering team can build: product framing, trust and explainability, evals, and a design-system handover.

## Live demo

[soc-alert-triage.vercel.app](https://soc-alert-triage.vercel.app/)

## What it does

- **Triage:** reads a raw alert and suggests severity and classification.
- **Explain:** shows why, pointing to the alert fields behind the verdict.
- **Recommend:** suggests a next step. A human always confirms.

## How it works

- Next.js and IBM Carbon Design System
- Claude API for triage, with recorded fallback responses so the demo works offline
- Evals: synthetic alerts with expected outcomes in `data/alerts/`

## Repository map

| Path | What it holds |
|---|---|
| `docs/one-pager.md` | User, job to be done, scope |
| `docs/DECISIONS.md` | Product and architecture decisions |
| `docs/JOURNAL.md` | Daily log: progress, problems, lessons |
| `docs/HANDOVER.md` | Package for the engineering team |
| `data/alerts/` | Synthetic alerts and eval set |

## Run locally

    npm install
    copy .env.example .env.local
    npm run dev

## Status

Week 1 of 3: product foundation.