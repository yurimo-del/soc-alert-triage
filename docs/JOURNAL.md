### AI Sprint Log: SOC Alert Triage Journey

#### Day 1: Foundation & Infrastructure
* **Date:** Day 1 of 21-day Sprint
* **Focus:** Setting up a professional engineering skeleton, establishing product boundaries, and deploying the first live frame.

**What we did step by step:**
1. **Repository Setup:** Created a clean public GitHub repository (`soc-alert-triage`), configured a Node `.gitignore` to protect environment secrets, and applied an MIT License.
2. **Product Guardrails (One-Pager):** Defined the target user (L1/L2 SOC Analyst), core JTBD (instant triage during alert floods), and strict out-of-scope boundaries to prevent scope creep.
3. **Architecture & Documentation:** Wrote foundational docs (`README.md`, `DECISIONS.md` for IBM Carbon choice, and `JOURNAL.md`).
4. **Environment Constraints & Fixes:** Handled Windows/PowerShell path specifics and resolved Git merge conflicts arising from initial remote templates using local-first overrides.
5. **Tech Stack & Deployment:** Initialized Next.js (App Router), installed IBM Carbon Design System (`@carbon/react`), and successfully deployed the working skeleton to Vercel for a Day-1 live link.

**Key Takeaway / Lesson:** 
* *Rule #0 enforced:* Fixing the repository structure and product constraints before touching any UI code establishes a solid, stress-free foundation.

---

#### Day 2: Data Contracts & Fallback Architecture
* **Date:** Day 2 of 21-day Sprint
* **Focus:** Moving from infrastructure to logic. Defining what the AI agent actually returns and protecting the public demo from failing.

**What we are doing today:**
* *I started with planning what I'm going to do today.*
1. **Defining the Data Contract (JSON Schema / Zod):** Instead of designing screens, we map out the exact data structure the AI must return (severity badge, classification, plain-English reasoning, and actionable next steps).
2. **Claude API & Zero-Failure Fallbacks:** Designing the integration logic with built-in spending safety limits, plus a smart fallback mechanism that swaps in pre-verified JSON responses if the API ever rate-limits or goes down.

##### Set up the AI coding agent with rules, not reminders
**What:** Moved coding to Claude Code (run from the Claude app, Cursor used as editor) and gave it project rules in `CLAUDE.md` plus hard limits in `.claude/settings.json`.
**Why:** An agent that writes code in a public portfolio repo needs the same guardrails as a new team member: synthetic data only, no secrets, no commits on its own. Rules written as requests can be forgotten; tool settings cannot.
**How:**
1. Logged in with the Claude subscription. The API key for the app lives only in `.env.local`, because a key set as a system variable silently overrides the subscription.
2. Wrote `CLAUDE.md`: purpose, hard rules, stack, structure, AI layer rules, report format.
3. Blocked reading `.env.local`, `git commit` and `git push` in `.claude/settings.json`.
**Lesson:** Setting up the agent is design work: you define its role, limits and how it reports back, the same way you would onboard a person.
**AI note:** The first journal rule asked the agent to log every task. It produced noise, so the rule was changed to milestones only.

##### Defined the primary user and removed invented numbers
**What:** The primary user is the L1/L2 SOC analyst; the secondary user is the SOC manager. Success criteria no longer contain made-up time savings. See ADR-02.
**Why:** The analyst triages the alerts, so the screen is built for speed of decision. The manager sets review rules and must trust the system, which gives Phase 2 (trust) its story. Making the manager primary would turn the product into a dashboard instead of a triage tool. The earlier "5 minutes to 15 seconds" claim had no source, and an unsupported number in a portfolio project damages credibility more than having no number.
**How:**
1. Rewrote the User section of the one-pager.
2. Replaced the metrics with criteria the eval set can actually measure.
3. Recorded the decision as ADR-02.
**Lesson:** In an AI product, honest success criteria come from evals, not from estimates. A number appears only after the first measured run.

##### Schemas as the contract between model and product
**What:** Defined the Alert and TriageResult schemas in zod, with two triage shapes: what the model may produce, and the full stored result. Human review flags are computed in code from explicit rules. See ADR-03.
**Why:** A prototype trusts whatever the model returns. A product needs a checked contract, and the model must not decide when a human looks. Letting the model set its own review flag would make human oversight depend on the model's own confidence.
**How:**
1. One schema per shape, with TypeScript types inferred from it.
2. A model-output schema that drops unknown keys, so a harmless extra field does not trigger a fallback and distort evals.
3. A strict stored-result schema for saved results and recorded fallback files.
4. A pure `computeReview()` with its rules in a readable list a SOC manager can audit.
**Lesson:** Moving from prototype to product means moving decisions out of the prompt and into code that can be read, tested and audited. Strictness belongs where we control the data, tolerance where the model does.
**AI note:** The agent found a gap in my spec: the model should not return review fields at all, so it proposed a separate model-output schema. I corrected its default to make every schema strict, because a strict model schema would turn small model quirks into fallbacks and make evals measure the fallback instead of the model.

##### An eval set that defines what "correct" means
**What:** Rebuilt the eval set as 15 synthetic alerts with expected results: 5 clear threats, 4 clear false positives and 6 genuinely ambiguous cases, covering all six alert sources. A validation script checks every case against the schemas and the review rules.
**Why:** Without a ground truth, "the AI triages well" is a claim, not evidence. The old set compared free text and tested a download the alert data did not contain, so it measured wording instead of judgment.
**How:**
1. Graded on schema fields (severity, classification, action type, human review) and on which alert fields the evidence must cite, not on exact wording.
2. Every ambiguous case holds one benign and one suspicious signal, and the evidence must cite both.
3. `npm run validate:evals` checks the schema, that expected review flags match `computeReview()`, and that only documentation IPs and example.com domains are used.
**Lesson:** Writing evals is product design. Deciding what counts as a correct answer, and when the right answer is "I'm not sure, ask a human", shapes the product more than the prompt does.
**AI note:** The agent found two gaps in my spec: the review check needed a confidence value the expected results do not have, and running TypeScript without a new package meant changing import style across the code. I chose a dev-only tool instead, to keep the code conventional for the developer who will build from it. I also corrected its first draft: the "ambiguous" cases were clearly legitimate, one false positive was unrealistic for a security expert, and two actions contradicted the classification.
**Known limit:** Ambiguous alerts carry ready-made context flags (for example, whether the account is on a change ticket). Real alerts get this from enrichment, which is a product layer of its own. Triage quality depends on enrichment as much as on the model.

##### First live run: the AI knows when it does not know
**What:** Built the AI provider adapter (Claude with structured output, recorded fallbacks, Gemini-ready) and ran all 15 eval alerts live once. The results are recorded as fallback files. See ADR-07.
**Why:** The product must survive a model outage and a change of AI vendor, and the public demo must never call a paid API. On Vercel the app runs on recorded responses only.
**How:**
1. Providers return raw output; the pipeline validates it, computes review flags in code and attaches metadata.
2. Recorded fallbacks are captured from real pipeline runs, never written by hand.
3. Compared the 15 live answers with the eval set by hand.
**Result (one run, not yet a baseline):** classification matched in 14 of 15 cases, and all 6 ambiguous alerts were marked needs_investigation instead of guessed. Mismatches: the AI chose escalation over decisive action three times, missed a key evidence field in two false positives, and was off by one severity level in two ambiguous cases.
**Lesson:** The first live run already showed product questions, not only model errors: how much the AI may decide alone, and whether "close" deserves stronger evidence than "escalate". These are rules for the SOC manager to own, which is the core of Phase 2.
**AI note:** The first live call failed with an authentication error. The pipeline returned an honest error instead of a fake result, which proved the fallback design before any real fallback existed.

### Day 3: I drifted into engineering, stopped, and moved to my own design workflow

**What:** Days 1 to 3 built a solid base: repo, Claude Code setup, primary user, data schemas, AI adapter with recorded fallbacks, a 15-alert eval set and an eval runner. But I spent much of that time on work that is not mine: writing expected labels myself, debating when the AI should escalate or close, and reviewing script details. Before the first baseline run, I stopped.

**Why:** Two reasons.
1. Deciding when to escalate, close or require human review is security expertise. My role is to orchestrate the loop: security defines the rules, I turn them into a concept, analysts test it, and what we learn goes back to security.
2. The sprint goal was never to build an app by hand. It was to build my own AI-driven design workflow, as skills in Git, and use the SOC triage app as the object it works on.

**How:**
- Marked the expected labels and review rules as draft v0: an AI-assisted placeholder, pending expert review. The four open rule decisions became questions for a security reviewer from my network, with provisional defaults until then.
- Delegated all engineering to Claude Code. I read only results.
- Reframed the rest of the sprint around design skills: review, wireframe, critique and handover. Each runs in a loop: run, my feedback, fix the skill, run again. The eval report becomes the first input.

**Lesson:** AI makes it easy to slide into whatever layer is in front of you. Expert drafts and engineering can be delegated in hours. Designer time goes to decisions, the concept, the people in the loop and the process itself.

**AI note:** The AI advisor pulled me into the expert and engineering layers by framing those decisions as mine. I caught it by checking the work against the sprint's goal doc. Rule: check how AI frames my role against the goal, not only against the task.

### Day 4: 18 Nov 2026: The workflow is the product

**What**
Rebuilt the sprint plan around two things I bring as a designer:
professional judgment and handover to developers. Everything else
(evals, wireframes, prototype) is orchestration around these two points.
New order: requirements, then 3+ wireframe concepts, then each concept
tested against real AI behavior from the eval, then a decision.
Then an interactive prototype and a handover to a real developer.

**Why**
After the baseline eval, the AI advisor started from the data and its own
conclusions: a table of alerts, then "scenarios" it had already labeled.
As a designer I could not use it. A raw eval table tells me nothing until
I see what it does to a screen. The plan also had four design skills of
equal weight, which says "many AI tools", not "better decisions".

**How**
- Requirements and eval labels are taken as given. They are simulated
  (draft v0) and I say so. The sprint proves the process, not security content.
- Wireframes and the prototype use existing skills and tools.
- One skill of my own: judgment-loop. It shows each concept with real AI
  answers in plain language. It does not judge. I judge, and my verdicts
  become rules in the skill.
- I do the first iteration by hand, then write the skill from it.
- Each iteration is measured: my corrections and time spent.
- Real people sit at the judgment points: a security reviewer and a SOC
  analyst. A real developer tests the handover.

**Lesson**
The design process sets the order. Data serves judgment, not the other way
around. A skill explains, the designer judges. Simulate what is not the
point, keep real people where judgment gets checked.

**AI note**
The AI advisor kept handing me its conclusions instead of the data.
It took four corrections to get back to a design order. Same pattern
as day 3: AI pulls you into whatever layer is in front of it.
Check its framing against the goal.

#### Calibrating the wireframe skill

**What**

The ready-made wireframe skill only works on Mac. I took the idea and
made my own small skill. Then I tested it on a simple case first: a dialog
to send an email. Not SOC yet.

- v0: the 3 concepts looked the same. Only the text was different.
  My rule: draw the whole screen, and concepts must look different
  even if you blur the text.
- v1: the screens broke and the AI did not notice. It cannot see what
  it draws. My rule: I send it a screenshot, it checks itself before
  showing me.
- v2: it worked. Three real concepts, different at a glance.

3 versions, 2 rounds of fixes, 10 rules from me.

![v0: three concepts that look the same, only the labels differ](/journal/day-04/test-concept-v0.jpg)
![v1: full screens, but the layout is broken and unreadable](/journal/day-04/test-concept-v1.jpg)
![v2: three concepts that differ at a glance](/journal/day-04/test-concept-v2.jpg)

**Lesson:** test a new skill on a simple case before the real one.
The AI does not see its own output, so the designer's eye is the check.

