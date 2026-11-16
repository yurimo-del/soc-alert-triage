# data/fallback

Recorded AI responses, one file per eval alert id (`alert-001.json`, ...). The demo uses them when the live model is unavailable, and on Vercel (`AI_PROVIDER=fallback`).

Each file is a full `TriageResult` with `meta.source: "fallback"`.

Do not write these by hand. Generate them from real pipeline runs with `npm run record:fallbacks` (see ADR-03 and ADR-07). Regenerate them after any schema or prompt change.
