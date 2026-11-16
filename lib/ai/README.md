# lib/ai

The AI layer. UI and route handlers call `triageAlert()` and nothing else. See ADR-03 and ADR-07 in `docs/DECISIONS.md`.

## Flow

`triageAlert(alert)` in `triage.ts`:

1. Reads `AI_PROVIDER` and `AI_MODEL` (`config.ts`). With `AI_PROVIDER=fallback` it skips straight to step 6.
2. Calls the provider with a 20 s timeout. The provider returns raw model output only.
3. Validates it with `TriageModelOutputSchema` (extra keys are stripped).
4. Computes `needs_human_review` and `review_reasons` with `computeReview()`. The model never sets them.
5. Adds `meta` (provider, model, prompt version, `source: "live"`) and validates the full result with `TriageResultSchema`.
6. On any error or invalid output, reads `data/fallback/<alert-id>.json` (must pass `TriageResultSchema`, `meta.source: "fallback"`) and logs the reason server-side.
7. With no valid fallback, returns `{ ok: false, error: { code: "no_fallback" } }`. It never returns an invented result.

## Files

| Path | Purpose |
|---|---|
| `types.ts` | `TriageProvider` interface, `TriageOutcome`, error types |
| `config.ts` | Reads and validates env |
| `triage.ts` | The pipeline |
| `prompts/triage-v1.ts` | System prompt and `PROMPT_VERSION`. Bump the version when the text changes |
| `providers/claude.ts` | Claude through `@anthropic-ai/sdk`, structured JSON output |
| `providers/gemini.ts` | Stub, throws "not implemented" |
| `providers/fallback.ts` | Reads recorded files only |

## Environment

| Variable | Meaning |
|---|---|
| `AI_PROVIDER` | `claude` (default), `gemini` or `fallback` |
| `AI_MODEL` | Model id. `.env.example` uses `claude-sonnet-5-5` |
| `ANTHROPIC_API_KEY` | Server only. Never put it in a `NEXT_PUBLIC_` variable |

Copy `.env.example` to `.env.local`. On Vercel, set `AI_PROVIDER=fallback` and store no API key.

## Commands

- `npm run triage:one -- alert-001`: run one eval alert through the pipeline and print the result.
- `npm run record:fallbacks`: run all eval alerts live and save them to `data/fallback/`. One paid API call per alert. Existing files are kept unless you pass `-- --force`.
