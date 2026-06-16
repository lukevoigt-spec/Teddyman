# ELEVATION-LOOP.md — the "make it award-winning & beautiful" iteration loop

> **Mandate (parent, 2026-06-16):** "Have Neo and Oracle (and their sub-agents) evaluate existing screens, code, and
> workflow against best practices for **award-winning game design**, then iterate evolutions until this is award-winning
> design and absolutely beautiful. Take it to the next level." Principle changes may be approved by the **parent OR The
> Oracle**.
>
> The **reading objective #1 and every HARD CONSTRAINT in CLAUDE.md are inviolate** — this loop makes the game more
> beautiful/engaging *in service of* reps-that-build-mastery, never at the expense of the calm learning moment
> (seductive-details guardrail) or any accessibility/pedagogy rule. Beauty is an amplifier, not a competitor. — Trinity

---

## Roles in the loop
- **The Oracle** — design authority + the ONLY agent that renders. Owns the **Award Bar rubric** (ratifies it into
  `STYLE.md §20`), scores screens, makes the art, specs each evolution, posts the `§20 PASS`. Spawns her own design
  sub-agents (audit / render / critique).
- **Neo** — lead coder + sole merger. Evaluates CODE + WORKFLOW against best practice (performance, architecture,
  animation/easing infra, micro-interaction plumbing), implements Oracle specs, merges only after a recorded `§20 PASS`.
- **Trinity (me)** — drives the loop cadence, keeps the board + this doc current, guards the pedagogy/constraint
  guardrails on every proposed change, batches decisions and escalates them to the parent (or routes Oracle-approvable
  ones to The Oracle), records outcomes. Does NOT render or merge.

## The cycle (repeats each round; one "wave" of screens per round)
1. **EVALUATE** — Oracle (design) + Neo (code/workflow) score the round's screens against the **Award Bar** (below).
   Output = a scored gap list per screen in `DESIGN-REVIEW.md` (before-shots + the failing criteria + the fix idea).
2. **PRIORITIZE** — Trinity folds the gaps into the board, highest-leverage first (focal clarity / cohesion / juice on
   the win, before micro-polish). Each evolution = an Issue (`[O]`/`[N]`/`[O+N]`), specs in the design docs.
3. **SPEC** — Oracle writes the evolution spec + makes the art (the delegation model, AGENTS rule 8).
4. **BUILD** — Neo implements to spec on an `oracle/<topic>` or `neo/<topic>` branch → PR.
5. **RENDER-GATE** — Oracle screenshots (`tools/shot.mjs`, Act 1 + Act 2, landscape + portrait, WebKit) and scores
   against the Award Bar; posts `§20 PASS` (or kicks it back). Code-vs-doc review cannot catch "looks cheap."
6. **MERGE** — Neo merges on a recorded PASS. Tests green (`node tests/*.test.js`), no constraint regressions.
7. **REVIEW + ITERATE** — Trinity updates the board + DONE ledger; the next round picks the next wave. Repeat until the
   whole app clears the Award Bar.

**Principle-change path:** if a round surfaces a better design principle, Oracle proposes it → Trinity sanity-checks it
against the CLAUDE.md constraints + pedagogy → **parent OR Oracle approves** → it's written into `STYLE.md`/this rubric
and applied going forward.

## Screen waves (evaluation order — highest player-impact first)
- **Wave 1 — first impression & core loop:** Title/landing · World Map (the hub) · a learning prompt (find/read) ·
  the Win/reward screen. *(These set the "is this a real game?" verdict in the first 60s.)*
- **Wave 2 — the home/collection fantasy:** Hero Base (plinth-first #33) · Training Room (#34) · Shop/Vault.
- **Wave 3 — narrative & cohesion:** cutscenes (intro/interlude/homecoming) · Settings/Grown-Up Corner · cross-screen
  transitions & motion language.

## THE AWARD BAR (rubric) — *PROPOSED, pending the research synthesis + Oracle ratification*
*(Trinity is commissioning a 3-stream research review — award-winning kids/education game design, game-feel/juice +
premium UI craft, and ethical engagement/onboarding/reward loops. The distilled, checkable rubric lands here and is
ratified into `STYLE.md §20` as the elevated "Premium Bar → Award Bar." Until then, the existing §20 Premium Bar +
non-negotiables hold. Placeholder criteria to be replaced/confirmed by research: focal clarity · world-cohesion / UI
lives in the painting · palette & lighting discipline · cohesive motion language · juice on success (off the prompt) ·
crafted consistent iconography · typographic restraint · generous negative space · inviting zero-states · screen
choreography/transitions · restraint / clutter-free · WebKit-performant.)*

## Cadence + control
Trinity runs the coordinating loop (status sweep → review any new render-gated PRs against the bar → update board →
batch + escalate decisions → nudge the next round). The parent can **pause/stop anytime** ("stop the loop"). Decisions
that are genuinely the parent's taste are batched into a single `AskUserQuestion`, not drip-fed.
