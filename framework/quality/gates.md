# Quality gates: exit criteria per step

A step is done only when every line for it is true.

## 1. Requirements review
- Every open question has an owner or a decision.

## 2. Core
- No gap in `core/` blocks a decision. Remaining gaps are marked `[MISSING: ...]`.
- `core/risk-profile.md` sets a validation mode for gates 4B and 6.

## 3. Concepts and wireframes
- At least 2 distinct directions, not variations of one.
- Each direction has a one-line hypothesis: who it helps and why it should work.
- The gate minimum is 2 directions. The wireframe skill makes 3 by default.

## 4. Conceptual review
- Each review follows `core/review-criteria.md`.
- The designer's decision and reason are recorded.
- The users' direction choice is collected in the mode the risk profile sets.
- Skill verdict vs designer vs users is recorded in `memory/skill-lessons.md`.

## 5. Interactive prototype
- Uses only design-system components and tokens from `core/design-system.md`.
- Runs on realistic data (synthetic where the real data is sensitive).
- Known gaps are listed, not hidden.

## 6. Validation
- Tasks are written before the session.
- Findings are logged with severity and compared with the step 4 review.

## 7. Handover
- Package covers tokens, components, states, edge cases and open questions.
- Every developer question is logged in `memory/feedback.md`.

## Skill tuning is done when
- Three runs in a row miss nothing the designer marks as critical.
