# Primary user

Draft v0, AI-assisted, pending security expert review.

- **Role:** L1/L2 SOC analyst. Triages the alerts. (`docs/one-pager.md`, ADR-02)
- **Context of work:** Flooded with hundreds of alerts per hour from SIEM and EDR systems. High false-positive fatigue and tedious manual first analysis (one-pager). Works in a shift (one-pager). [MISSING: environment, time of day, pressure beyond alert volume, other tools around them]
- **Main tasks this product supports:** see how severe an alert is and whether it looks like a real threat, a false alarm or unclear; understand why, with the alert fields behind it; see the recommended next step; know if a human must review first; confirm the action (`docs/REQUIREMENTS.md` section 2).
- **What they need to trust a result:** every verdict cites the alert fields it is based on, and ambiguous alerts are flagged for human review instead of guessed (one-pager success criteria 2 and 3). [MISSING: anything else the analyst needs to trust a result. These two points come from the product's success criteria, not from analysts]
- **What makes them abandon a tool:** [MISSING: not recorded anywhere in the repo]
- **Secondary users:** SOC manager. Sets the review rules and must trust the system (ADR-02).
- **Evidence:** none of the points above come from interviews or observation. They are assumptions taken from the one-pager and ADR-02. [MISSING: interviews or observation of real analysts]

Mark assumptions as assumptions.
