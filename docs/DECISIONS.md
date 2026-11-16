# Architecture Decision Records (ADR)

## ADR-01: Adoption of IBM Carbon Design System
* **Status:** Accepted
* **Context:** Enterprise security interfaces require high data density, rigorous typography, and standardized components for data tables, statuses, and badges.
* **Decision:** Use IBM Carbon Design System. Avoid heavy custom UI frameworks in favor of reliable, battle-tested enterprise design patterns.

## ADR-02: Primary user: SOC analyst, secondary: SOC manager
* **Context:** The one-pager named only the L1/L2 analyst. The system also needs someone who defines when a human must review an AI verdict and who must trust the output enough to adopt it. Without naming this role, review rules and trust requirements have no owner.
* **Decision:** The primary user is the L1/L2 SOC analyst, who triages alerts. The secondary user is the SOC manager, who sets the review rules and must trust the system. Features are prioritized for the analyst first, then checked against what the manager needs to trust the output (flagged ambiguity, cited alert fields).
* **Consequences:** Success criteria include trust signals (human-review flags, cited fields), not only speed. Review rules must be explicit and configurable in code, not left to the model. Manager-facing features, such as rule editing or reporting, stay minimal unless they prove the prototype-to-product path.
* **Status:** Accepted
