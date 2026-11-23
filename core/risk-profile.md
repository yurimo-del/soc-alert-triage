# Risk profile: SOC alert triage (learning prototype)

Draft v0, AI-assisted, pending security expert review.

| Factor | Level | Why |
|---|---|---|
| Novelty of the concept | High | New AI-assisted triage flow, not a known pattern |
| Cost of a user error | High | A wrongly closed alert can mean a missed incident |
| Role of AI in the decision | Medium | AI suggests severity, classification and next step; a human always confirms |
| Prior evidence in this project | Low | No user validation yet |

## Validation modes

| Gate | Mode | Who | Rationale |
|---|---|---|---|
| 4B Direction choice | Quick check, two independent opinions | Two security experts, each alone (expert proxies unless they triage daily) | Direction is the most important decision; high novelty and cost of error |
| 6 Prototype validation | Full session | A third security expert with fresh eyes, ideally someone who triages alerts daily | Trust in AI output only shows on a working prototype with realistic data |

Fallback if only one expert is available: the same person does a quick check at 4B and a full session at 6, or one combined session. The reduced validation is recorded as a risk in the handover package.

**Gate 6 is reduced for the SOC app (conscious decision, ADR-10).** Full prototype validation is not run in the form planned above. Reason: this is a learning prototype, and the proof now comes from the developer test (ADR-10). The gate 6 row above is the original plan.
