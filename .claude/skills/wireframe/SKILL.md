---
name: wireframe
description: Explore 3 or more complete low-fidelity concepts for a screen or flow on one labeled greyscale page, with a comparison table. Use when asked for wireframes, concepts, variants or layout options.
argument-hint: <brief or requirements file> <output page path>
allowed-tools: Read Write Edit Glob Grep Bash(npm run build) Bash(npm run lint)
---

## Origin
- Type: own
- Inspired by: none
- Version: 0.4
- Tuned on: one project, 3 concept runs and 2 revisions (2026-11)

# Wireframe concepts

Turn a brief into one page that compares 3 or more complete concepts. The page is for judging design options, not for styling.

## Input
- A brief: a sentence, or a file (requirements, design questions). Read the file if one is named.
- An output path for the page, for example `app/concepts/page.tsx`. If none is given, ask for it. That is your one question.
- Optional: project data to show (JSON, schemas). Wire it into the page, not into this skill.
- Pattern names for the block labels come from `core/design-system.md`. If that file has none (marked `[MISSING]`), use generic names (modal, table, tag, button) and list this as an assumption on the page.

## Steps
1. **Collect the design questions.** If the brief lists them, use them as they are. If it does not, derive 3 to 5 from the brief, and list them on the page under "Assumed questions".
2. **Ask at most one question** before building, and only if you cannot go on without the answer. Otherwise ask none and state your assumptions on the page. The screenshot request in the Self-check step is separate.
3. **Design 3 or more concepts.** Each concept is complete: it shows every screen or state the brief needs and answers every design question in its own way. Do not make one concept per question.
4. **Mix conservative and novel.** At least one concept uses a standard, familiar pattern. At least one tries a different structure.
5. **Build one page** at the output path (see Page layout).
6. **Check:** run `npm run build` and `npm run lint`. Fix what you broke.
7. **Self-check:** ask for a screenshot and fix what breaks (see Self-check).
8. **Report:** files changed, how to check, open questions, proposed commit message. Do not start a server. Do not commit or push.

## Layout rules
- **Draw the whole screen, not only the component.** Show the app frame around it: the page behind a modal, a panel docked in a corner, a side panel taking half the screen. Every state of every concept is shown inside the frame.
- **Concepts must differ in layout, visible at a glance.** Blur test: if all text were blurred, the concepts must still look different (different shapes, positions, proportions, number of regions). If they do not, redo them. Different labels or field order do not count.
- **At least one concept must be truly novel in structure.** The same form split into steps, or the same fields in a different container, is not novel. Change what the screen is made of: its regions, what the user picks or sees while working, where the main action lives.
- **Pattern labels must never cover content.** Put each label above its block, small, outside the content area and outside the block's border. Never position a label over a block's content.

- **One screen frame per concept, fixed 16:10.** Use `aspect-ratio: 16 / 10` and CSS grid zones: header, nav, content, overlay. The overlay is a grid item in the same cell as the content and sits on top of it (higher `z-index`), never under it. Size everything inside the frame in `em` and set the frame font size from a container query unit (`cqw`), so the frame scales as one picture.
- **Background content is grey bars, never text lines.** List rows, nav items and tables behind the main element are plain grey bars.
- **States are small thumbnails next to the main frame**, not repeated full screens. Use the same frame component at small size, with a one-word caption underneath. Text inside thumbnails is hidden. Exception: a state whose point is changed text (for example a new status word after an action) is drawn as a full-size frame, at most 2 per concept, plus one frame for an expanded state (for example details open).
- **Pattern labels are hidden by default.** One toggle at the top of the page shows them. Use a CSS-only toggle (a checkbox and `:has()`), so the page stays a server component. Labels never show inside thumbnails.
- **Max 1 line of text per block.** One short line, no wrapping. Everything else is a grey bar or a box.
- **Column order follows sort order.** If a list is sorted by A, then B, then C, put columns A, B, C side by side in that order.
- **Detail uses the list's field order.** Shared fields keep their relative order. Detail-only fields (for example a status) may sit between them or follow.
- **Action buttons sit inside the panel of the thing they decide.** The status summary stays at the top.
- **Every action changes the item's visible state.** Draw the state after the action (see the full-size exception for states above).
- **A done item shows its result with an icon.** Do not grey it out.
- **After an action, the panel keeps the record:** what was decided and what the user stated. Only the buttons go.
- **Do not repeat in a row what the tab or filter already says.**
- **Overview and details use the same structure on every screen.** Overview first, then a details link, then the action. A fast lane collapses the details and a review lane opens them. Show one frame with the details open.
- **Describe interactions honestly.** Count the clicks. Opening a panel is not a review, and a tick is a statement, not proof of a check.
- **A pop-up or overlay detail is one column, top-down,** easy to scan. Not two columns.
- **A link must look like a link.** Underline it and keep it distinct from plain text, in greyscale too. A grey bar is never a link.
- **A revision never replaces the earlier version.** Each version keeps its own page, and the index lists them all. A revision says what changed from its base. It is exempt from the 3-concept minimum and from the blur test against its base. It is not exempt from the blur test against the other concepts.

## Self-check (required)
After the build passes, do not report yet. Ask the user for a screenshot of the page (this is the one allowed exception to "at most one question"). Compare the screenshot to the rules above, one by one: fixed 16:10 frames, overlay on top, grey bars in the background, thumbnails, labels hidden, one line per block, concepts that differ at a glance, column and field order, action inside the panel it decides, state after each action, result icons and no greyed-out items, the panel keeps the record after an action, no repeated tab text in rows, overview first in fast lanes, honest click counts, one-column overlays, links that look like links, earlier versions kept on their own pages and listed in the index, overview and details in the same structure with one frame showing the details open. Fix what breaks. Then report, and say which rules you checked.

## Page layout
1. Title and a one-line status: "Draft wireframes. Greyscale. Placeholders."
2. The design questions (given or assumed).
3. **Comparison table:** one row per concept, one column per question. Each cell is a short answer.
4. One section per concept, in this order: name, a one-line idea, a tag "conservative" or "novel", then its screens or states.
5. Each concept gets its own page, with its own questions-and-answers header. The index page holds the comparison table and links to each concept.

## Rules
- **Greyscale only.** No colors, no icons, no images, no brand styling. Use borders, grey fills and text weight. One exception: a result mark may be a text glyph (a check mark or an X), with a text alternative for screen readers. No icon sets, no images.
- **Placeholders** for anything not in the brief: grey boxes and labels such as "[placeholder: text]". Do not invent real content, numbers or data.
- **Label every block** with a pattern name from the design system in `core/design-system.md`, in small text (hidden by default, see Layout rules). Write it as `[<design system name>: <pattern>]`, for example `[DS: modal]`. If no pattern fits, write `[no pattern]`. This is a label only. Do not import the design system.
- **Plain CSS only.** Put it in a CSS file next to the page. Prefix class names with the page name to avoid clashes. No CSS framework and no design-system code.
- **Static.** Server component, no client JavaScript. Show states side by side instead of making them interactive.
- **No new dependencies.** No npm packages, no Python, no MCP servers. Everything must work on Windows. Use only Node and the project's own tools.
- Each concept states its trade-off in one line: what it is good at, and what it costs.
- Keep each concept readable at a glance. Short labels, no long prose.
