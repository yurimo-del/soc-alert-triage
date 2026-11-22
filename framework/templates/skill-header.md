# Skill header (add to the top of every SKILL.md body, under the frontmatter)

For an `own` skill (every skill stored in `.claude/skills/`):

```
## Origin
- Type: own
- Inspired by: <link to the idea, or "none">
- Version: <0.1, 0.2 ...>
- Tuned on: <projects, no confidential names in public repos>
```

Rules:
- We never copy text from third-party skills into this repo. We take the idea and write our own skill. The header and the registry record type `own` and the source as "inspired by" with a link.
- Type `external` is only for skills installed as is, outside this repo. We never edit them, and they are not stored in `.claude/`. They are listed in `framework/skills-registry.md` with Source and License.
- Skills live flat in `.claude/skills/<skill-name>/SKILL.md` so Claude Code can find them.
  Origin is tracked here and in `framework/skills-registry.md`, not by subfolders.
- Every change to a skill: bump its version in the registry and log it in `framework/CHANGELOG.md`.
