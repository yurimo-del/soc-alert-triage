# Changelog

## v0.1 (2026-11-22)
- Created the framework boundary: `.claude/` and `framework/` hold only reusable parts; project facts live in `core/`, data, outputs and `memory/`.
- Added the PRD to handover workflow with designer and user gates.
- Added user validation modes set by a project risk profile.
- Added quality gates, core templates, review criteria template, skill header and skills registry.

## v0.2 (2026-11-22)
- Wireframe skill 0.2: each concept gets its own page with its own questions-and-answers header, and the index page holds the comparison table and the links. Pattern labels take their names from `core/design-system.md` instead of a named design system. Examples are neutral.
- Skill header and registry: type is `own` or `external`. The `adapted` type is removed. Third-party skill text is never copied into the repo. The registry has an "inspired by" column and a status column.
- Renamed the review rubric to review criteria (`templates/review-criteria.md`, `core/review-criteria.md`).
- Core rule softened: read all of `core/`, and stop only if the task needs something marked `[MISSING]`.
- `quality/gates.md`: gate minimum is 2 directions, the wireframe skill makes 3 by default.

## v0.3 (2026-11-23)
- Workflow: added step 0, read the existing product (layer map of 1-2 areas). Step 7 is now the UX rules skill, done when a developer builds a new screen with it and the findings are logged. File name unchanged.
- Review criteria must judge both new concepts and existing flows (ADR-10).

## v0.4 (2026-11-24)
- Wireframe skill 0.3: new rules for column order, detail field order, action and status as one block, state after every action, honest click counts, one-column overlays and links that look like links. Full-size exception for after-action states (max 2 per concept). A revision of a concept gets its own page and is exempt from the 3-concept minimum and the blur test against its base.

## v0.5 (2026-11-24)
- Wireframe skill 0.4: action buttons sit inside the panel of the thing they decide (replaces the action-and-status block rule). New rules: a done item shows its result with an icon and is not greyed out, no repeated tab or filter text in rows, overview first in a fast lane. One exception to greyscale: a result mark may be a text glyph. Detail field order: shared fields keep their relative order, detail-only fields may sit between them. After an action the panel keeps the record (what was decided and what the user stated), only the buttons go. A revision never replaces the earlier version: each version keeps its own page and the index lists them all. Overview and details use the same structure on every screen, with one extra frame showing the details open (the frame limit allows it). The fast-lane rule is folded into this one.
