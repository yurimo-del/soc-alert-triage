# One-Pager: SOC Alert Triage AI Agent

## 1. User
* **Primary user:** L1/L2 SOC analyst. Triages the alerts.
* **Secondary user:** SOC manager. Sets the review rules and must trust the system.
* **Context:** Flooded with hundreds of alerts per hour from SIEM/EDR systems, suffering from high false-positive fatigue and tedious manual initial analysis.

## 2. Core Job-to-Be-Done (JTBD)
* *"When dozens of diverse alerts arrive during a shift, I want an instant prioritized list with plain-English reasoning and recommended mitigation steps so I don't waste time manually investigating every false positive."*

## 3. Core Scenarios
1. **Raw Alert Fast Triage:** Ingest or simulate a raw alert payload $\rightarrow$ AI instantly parses fields, assigns severity (Critical/High/Medium/Low), and classifies it (True Positive / False Positive).
2. **Anomaly Explanation (Why it matters):** Concise human-readable explanation of why the alert poses a threat based on process context, parameters, and IP reputation.
3. **Actionable Recommendation:** Clear next step for the engineer (e.g., *Isolate host*, *Ignore*, *Escalate to L2*).

## 4. Success Criteria
1. Triage quality is measured on the 15-alert eval set. Baseline: see [docs/evals/2026-11-17-baseline.md](evals/2026-11-17-baseline.md).
2. Ambiguous alerts are flagged for human review instead of guessed.
3. Every verdict cites the alert fields it is based on.
4. The demo works offline via recorded responses.

## 5. Out of Scope (Feature Creep Filter)
* ❌ Live real-time API integrations with production SIEM platforms (Splunk, Elastic) — utilizing static synthetic alerts instead.
* ❌ Automated active remediation/blocking without human operator confirmation.
* ❌ Custom design system components — strictly adhering to IBM Carbon.