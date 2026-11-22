# Product brief

Draft v0, AI-assisted, pending security expert review.

- **Problem:** Analysts are flooded with hundreds of alerts per hour, suffer from false-positive fatigue, and spend time on tedious first analysis of every alert (one-pager). The project is a learning prototype that shows the path from an AI prototype to a product an engineering team can build (`README.md`).
- **Primary user:** see `primary-user.md`
- **Job to be done:** "When dozens of diverse alerts arrive during a shift, I want an instant prioritized list with plain-English reasoning and recommended mitigation steps so I don't waste time manually investigating every false positive." (one-pager)
- **In scope:** fast triage of a raw alert (severity and classification), a plain-English explanation of why, and a recommended next step that a human confirms (one-pager core scenarios).
- **Out of scope:** live integrations with production SIEM platforms; automated remediation or blocking without human confirmation; custom design system components (one-pager). Also decided by the product owner for the prototype: no login or user accounts, no security hardening, no load handling, no automated tests, no compliance (`docs/REQUIREMENTS.md` section 6).
- **Success signals (qualitative unless real numbers exist):** triage quality is measured on the 15-alert eval set; ambiguous alerts are flagged for human review; every verdict cites its alert fields; the demo works offline via recorded responses (one-pager). [MISSING: a pass mark for triage quality and a performance target]
- **Source documents:** `docs/one-pager.md`, `docs/DECISIONS.md`, `docs/REQUIREMENTS.md` (v0, collects what the repo already says). [MISSING: a PRD. The one-pager is the earliest document]

Mark anything unknown as `[MISSING: ...]`. Do not fill gaps with guesses.
