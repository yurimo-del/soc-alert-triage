# Skills registry

| Skill | Workflow step | Type | Inspired by | Version | Status |
|---|---|---|---|---|---|
| requirements-review | 1 | own | - | - | planned |
| wireframe | 3 | own | none | 0.4 | active |
| review | 4A | own | - | - | planned |
| critique | 4 | - | - | - | dropped (ADR-08) |
| handover | 7 | own | - | - | planned |

Type:
- **own:** written here. Stored in `.claude/skills/`. The source of the idea is recorded as "inspired by" with a link, or "none".
- **external:** installed as is, outside this repo. Never edited. Not stored in `.claude/`.

The `review` skill is the judgment-loop skill from ADR-08 (workflow step 4A). It prepares material for the designer's judgment and does not judge.

**Rule:** We never copy text from third-party skills into this repo. We take the idea and write our own skill. The header and the registry record type own and the source as "inspired by" with a link. Type external is only for skills installed as is, outside this repo, and we never edit them.
