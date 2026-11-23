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
- Review criteria must judge both new concepts and existing flows (ADR-10). No skill versions changed.
