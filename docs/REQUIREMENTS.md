# Requirements (v0)

v0. Simulated requirements for a learning prototype. Labels are draft, AI-assisted, pending security expert review.

This file only collects what already exists in the repo. It adds no new requirements. Where the repo says nothing, the point is listed under [Gaps](#gaps).

Sources: `CLAUDE.md`, `docs/one-pager.md`, `docs/DECISIONS.md` (ADR-02, ADR-03, ADR-07), `data/alerts/eval-set.json`, `computeReview()` in `lib/schemas/review-rules.ts`, the zod schemas in `lib/schemas/`.

## 1. Users

- **Primary: L1/L2 SOC analyst.** Triages the alerts. Features are prioritized for this user first.
- **Secondary: SOC manager.** Sets the review rules and must trust the system. Features are checked against what the manager needs to trust the output: flagged ambiguity and cited alert fields (ADR-02).

## 2. Job to be done

From the one-pager: when dozens of diverse alerts arrive during a shift, the analyst wants an instant prioritized list with plain-English reasoning and recommended next steps, so they do not spend time investigating every false positive.

For each alert, the analyst must be able to:

1. See how severe it is and whether it looks like a real threat, a false alarm, or unclear.
2. Understand why, in plain English, with the alert fields the verdict is based on.
3. See the recommended next step (for example isolate a host, escalate to L2, or close).
4. Know whether a human must look at it before anything happens.
5. Confirm the recommended action. The AI only suggests. Every recommended action requires human confirmation in the UI (`CLAUDE.md`, hard rule 6).

Success criteria already in the one-pager:

- Triage quality is measured on the 15-alert eval set. Baseline: see [`docs/evals/2026-11-17-baseline.md`](evals/2026-11-17-baseline.md).
- Ambiguous alerts are flagged for human review instead of guessed.
- Every verdict cites the alert fields it is based on.
- The demo works offline via recorded responses.

## 3. What the screen must show for each alert

The screen shows the stored triage result (`TriageResult`) next to the alert itself.

**The alert** (`Alert`)

| Field | Meaning |
|---|---|
| `id` | Alert id |
| `source` | One of EDR, WAF, Antivirus, IAM, Email, Network |
| `timestamp` | When the alert was raised |
| `title` | Short alert title |
| `raw_payload` | Source-specific fields. The shape differs per tool |

**The triage result** (`TriageResult`)

| Field | Values | Notes |
|---|---|---|
| `severity` | Critical, High, Medium, Low | |
| `classification` | `true_positive`, `false_positive`, `needs_investigation` | |
| `confidence` | `high`, `medium`, `low` | Three levels, not a percentage (ADR-03) |
| `summary` | Plain-English text | |
| `evidence` | List of `field`, `value`, `why` | At least one item. Cites the alert fields behind the verdict |
| `recommended_action` | `type` and `detail` | `type` is one of `isolate_host`, `block_ip`, `reset_credentials`, `escalate`, `monitor`, `close` |
| `needs_human_review` | Yes or no | Computed in code, never by the model |
| `review_reasons` | List of plain-text reasons | Empty when no review is needed |
| `meta` | `provider`, `model`, `prompt_version`, `source` | `source` is `live` or `fallback` |

Also required by the decisions:

- A result with `meta.source: "fallback"` must be clearly labelled as a recorded response, so the analyst never mistakes it for a live verdict (ADR-07).
- A failed triage with no valid fallback returns a typed error. It never shows an invented result (ADR-07).

## 4. Human review rules

A human must review the result if **any** of these is true. The code is `computeReview()`. It is a fixed list so the SOC manager can read and audit it. The model's own opinion is ignored.

1. Confidence is low.
2. The classification is `needs_investigation`.
3. The severity is Critical.
4. The recommended action isolates a host.
5. The recommended action blocks an IP.
6. The recommended action resets credentials.

If none apply, no review is required. `review_reasons` lists every rule that applied.

What this means in plain words: the system asks for a human when it is unsure, when the case is unresolved, when the threat is the most severe, or when the action would disrupt a host, an address or an account. A `monitor`, `escalate` or `close` action on a clear, non-Critical result does not trigger review by itself. Open questions about these rules are in [section 7](#7-open-questions).

## 5. Expected answers

From `data/alerts/eval-set.json`, 15 alerts. These labels are draft v0, AI-assisted, pending security expert review.

| Alert id | Source | Severity | Classification | Action | Human review |
|---|---|---|---|---|---|
| alert-001 | EDR | Critical | true_positive | isolate_host | Yes |
| alert-002 | WAF | High | true_positive | block_ip | Yes |
| alert-003 | IAM | High | true_positive | reset_credentials | Yes |
| alert-004 | Email | High | true_positive | reset_credentials | Yes |
| alert-005 | Antivirus | Critical | true_positive | isolate_host | Yes |
| alert-006 | Antivirus | Low | false_positive | close | No |
| alert-007 | WAF | Low | false_positive | close | No |
| alert-008 | Network | Low | false_positive | close | No |
| alert-009 | EDR | Low | false_positive | close | No |
| alert-010 | EDR | Medium | needs_investigation | escalate | Yes |
| alert-011 | IAM | Medium | needs_investigation | escalate | Yes |
| alert-012 | Network | High | needs_investigation | escalate | Yes |
| alert-013 | Antivirus | Medium | needs_investigation | escalate | Yes |
| alert-014 | WAF | Medium | needs_investigation | monitor | Yes |
| alert-015 | Email | Medium | needs_investigation | escalate | Yes |

Each case also lists `must_cite_fields`: the `raw_payload` keys the evidence must reference. They are in the eval set file and are not repeated here.

## 6. Out of scope

From `docs/one-pager.md` and `CLAUDE.md`:

- Live integrations with production SIEM platforms. Static synthetic alerts are used instead.
- Automated remediation or blocking without human confirmation.
- Custom design system components. The UI uses IBM Carbon.

Decided by the product owner for this learning prototype: no login or user accounts, no security hardening, no integrations, no load handling, no automated tests, no compliance.

Also fixed by the hard rules: synthetic data only, and no real company names, customer data, incidents or public IPs.

## 7. Open questions

See [Pending security review](DECISIONS.md#pending-security-review) in `docs/DECISIONS.md`. It lists four open questions: human review for every confirmed High threat, severity tolerance for ambiguous alerts, the label for alert-014, and the evidence needed to `close`. The current code and eval set are the provisional default until an expert answers.

## 8. Design questions for the concepts

Scope for the concepts: primary user only (L1/L2 analyst), two views: alert list and alert detail. The repo does not answer these questions. Each concept should answer them.

1. Every action needs confirmation (hard rule 6), and `needs_human_review` marks some results as must-review. How does the screen tell "quick confirm" apart from "investigate before acting"?
2. How is the alert list prioritized and sorted?
3. What happens after the analyst confirms or rejects an action?
4. Which fields appear on the list and which on the detail screen?

## Gaps

Things this file needs but the repo does not state. They are listed, not filled.

- **No performance target.** "Instant" appears in the one-pager. No time limit is defined. The only number is the 20 s timeout in ADR-07.
- **No target for triage quality.** The one-pager has a baseline only. No pass mark for severity, classification, action or review is defined.
- **No manager requirements beyond the rules.** ADR-02 says rule editing and reporting stay minimal. What the manager actually does in the product is not defined.
- **Authentication and rate limiting.** ADR-07 says they are required before any public live deployment. No requirement describes them.
- **Who owns the eval labels.** The labels are simulated. No named reviewer or review date exists yet.
