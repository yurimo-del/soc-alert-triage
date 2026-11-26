# Review criteria

Draft v0, chosen by the designer from 10 AI-assisted candidates. Pending expert check on 24.11.

Labels: (source) = taken from a project document, name it. (assumption) = not validated, to be checked by research. Unknown = [MISSING: what is missing].

Used in step 4A to review wireframe concepts, and in step 0 to review existing flows.

### 1. Priority at a glance
Why chosen: speed is the core of the job to be done.
Use case: prioritized list during a shift (product-brief, JTBD)
Question: Can the analyst tell in seconds which alert to handle first, and why it is on top?
Evidence: severity and classification (real / false / unclear) visible on every row; order is clear
Source: (source: product-brief JTBD; primary-user main tasks)
Risk: can turn into "is the list sorted", a feature check

### 2. Uncertainty is visible
Why chosen: the AI must not guess; unclear alerts go to a human.
Use case: know if a human must review first
Question: Are ambiguous alerts clearly marked for human review, and look different from confident verdicts?
Evidence: a distinct "needs review" state, not only a confidence number
Source: (source: one-pager success criterion 3, via primary-user)
Risk: low

### 3. Verdict cites its evidence
Why chosen: the strongest trust need in the brief.
Use case: understand why (primary-user main tasks)
Question: Does every verdict show the alert fields it is based on, on the same screen?
Evidence: fields next to the verdict, not behind a click
Source: (source: one-pager success criterion 2, via primary-user)
Risk: low

### 4. Next step is clear, human confirms
Why chosen: the analyst must know what to do and stay in control of the action.
Use case: see the next step and confirm the action (product-brief in scope)
Question: Is the recommended step concrete, and is it obvious nothing happens until the analyst confirms?
Evidence: the step in plain words plus an explicit confirm action; no automatic action
Source: (source: product-brief in scope and out of scope)
Risk: low

### 5. When the AI is wrong
Why chosen: one clear AI mistake can end trust in the tool.
Use case: confirm the action
Question: If the verdict is wrong, can the analyst see it and override it easily?
Evidence: a visible override or reclassify path, and the reason for the override is recorded
Source: (assumption: "one clear AI mistake, and trust is gone")
Risk: assumption, but central to trust

### 6. What works today and should stay
Why chosen: build on what exists, never start over.
Question: What in the current solution works, and does this concept keep it?
Evidence: named parts of the current app that the concept keeps or improves, not replaces
Source: (source: ADR-10)

## Scale
green / yellow / red / no evidence. No evidence on the screen means it cannot be green.

## Rules
- Every direction gets the same card with all criteria.
- Overall result = the weakest criterion, not the average.