Workflow step: Step 2, wireframe concepts (design exploration, AI drawn as always right).
Goal: Run the wireframe skill on docs/REQUIREMENTS.md and produce 3 full concepts (alert list + alert detail) in /concepts.

## Prompt 1 (task)

Plan mode first, wait for my ok.

Task: run my wireframe skill (the one calibrated on day 4) on docs/REQUIREMENTS.md. Output goes to /concepts.

What I need:
- 3 full concepts. Each concept = alert list + alert detail.
- The 3 concepts must differ in the core idea, not only in layout. Use the design questions in REQUIREMENTS.md section 8. Each concept picks its own answers and says which.
- Detail screens for alert-006, alert-003 and alert-011 in every concept. Take the data from the eval alert set and the recorded fallback answers. Use only fields that exist. If a screen needs a field we don't have, list it as an open question. Do not invent data.
- Step 2 rule: draw as if the AI were always right. Real AI behavior comes later.
- Greyscale, follow the skill's rules. No Carbon, no colors.
- Eval labels and review rules are draft v0, pending security review. Show them as they are. Do not change or judge them.
- For each concept add a short card: the idea in one line, its answers to section 8, the trade-offs, what it assumes about the analyst.
- Add concepts/README.md as an index.

In your plan, show me:
1. The 3 concept ideas, one line each.
2. Which section 8 questions each one answers, and how.
3. The files you will create.
4. Your open questions.

Do not edit the skill in this task. Do not commit.

## Prompt 2 (reply to the plan)

OK with the plan, with these changes:
1. Output: route /concepts plus root concepts/README.md. Yes.
2. alert-003: this step draws the AI as always right. Draw the eval label (true_positive, reset_credentials), not the fallback. Add the mismatch to the README open questions. We will use it in the judgment step. Do not judge which side is right.
3. Long fields: no grey bars for summary and the evidence "why". Show the real text, cut to one line with "...". The AI's reasoning is what the analyst trusts or not, so we must see it. Use bars only for fields that don't matter for the decision.
4. Fields we don't have: list them as planned.
5. The draft v0 tag on each screen is enough.
6. No link from the root page.

Also: save my first prompt for this task and this reply verbatim in docs/prompts/2026-11-20-wireframe-concepts.md. Add a 2-line header: workflow step, goal.

Go.
