# Primary user

Draft v0, AI-assisted, pending security expert review.

Labels: (source) = taken from a repo document. (assumption) = not validated, to be checked by research.

- **Role:** L1/L2 SOC analyst. Triages the alerts. (source: `docs/one-pager.md`, ADR-02)
- **Context of work:**
  - Flooded with hundreds of alerts per hour from SIEM and EDR systems. High false-positive fatigue and tedious manual first analysis. Works in shifts. (source: one-pager)
  - Works across several screens: SIEM, a ticket system and team chat. (assumption)
  - Night shifts. Pressure to clear the queue before the shift ends. (assumption)
  - [MISSING: which tools analysts use today and how they move between them.]
- **Main tasks this product supports:** see how severe an alert is and whether it looks like a real threat, a false alarm or unclear; understand why, with the alert fields behind it; see the recommended next step; know if a human must review first; confirm the action. (source: `docs/REQUIREMENTS.md` section 2)
- **What they need to trust a result:**
  - Every verdict cites the alert fields it is based on. Ambiguous alerts are flagged for human review instead of guessed. (source: one-pager success criteria 2 and 3)
  - Can see the raw alert data, not only the AI summary. (assumption)
  - Can see if a similar alert happened before and how it was closed. (assumption)
  - Understands why the alert got its severity. (assumption)
- **What makes them abandon a tool:**
  - Too many false positives. (assumption)
  - Slow. (assumption)
  - One more tab to watch. (assumption)
  - One clear AI mistake, and trust is gone. (assumption)
- **Secondary users:** SOC manager. Sets the review rules and must trust the system. (source: ADR-02)
- **Evidence:** [MISSING: no interviews or observation of real analysts.]

## Questions to validate with experts (24.11)

1. Which tools do you use during triage today, and how many screens?
2. What do you check first before you trust an automated verdict?
3. Does seeing similar past alerts help you decide faster?
4. What made you stop using a tool in the past?