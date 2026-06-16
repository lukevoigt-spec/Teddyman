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

## THE AWARD BAR (rubric v1) — *PROPOSED for The Oracle to ratify into `STYLE.md §20`*
Synthesized from a 5-stream research review (sources at bottom). **Score every screen pass/fail on each criterion**; a
screen is "award-bar" only when all VISUAL+FEEL+ENGAGEMENT criteria pass AND the CALM-LEARNING gate + PERF gate pass.
The CALM-LEARNING gate (C13) is the **hard filter** — it overrides any juice/beauty criterion on an active prompt.

**VISUAL / CRAFT**
- **A1 Focal clarity** — exactly ONE unmistakable primary element per screen; everything else recedes. *(MV composition; restraint; pedagogy salience)*
- **A2 Palette & lighting discipline** — every element pulls only from the scene's 3–5 color tokens (extend `SCENE_TONE`, no raw hexes); characters/gems all get the house three-part lighting: key sheen + rim + contact shadow. *(Monument Valley "color script"; `feSpecularLighting`)*
- **A3 UI lives in the painting (diegetic)** — controls look like world objects (gem buttons, stone/parchment chrome, `#sceneFrame`), NOT list-cards floating over a background. *(the single biggest "premium" tell; §20/#7)*
- **A4 One motion personality** — a single easing-curve family (gentle back-out spring) + short duration bands (micro 120–220ms / feedback 200–400ms / scene 400–800ms) reused app-wide; nothing `linear`. *(juice canon)*
- **A5 Crafted, consistent iconography** — ONE stroke weight / corner / detail grammar across all `icon()`/`PICONS`; ZERO emoji. *(§18/non-negotiable #6)*
- **A6 Typographic restraint** — 2–3 type sizes; Andika for letter content, display face for chrome only; generous negative space / the painting breathes. *(premium type discipline)*
- **A7 Continuous screen choreography** — scenes glide/stagger in (focal element first), never hard-cut; reuse `beatIn` everywhere, not just cutscenes. *(Alto's/Gris)*
- **A8 Inviting zero-states** — first-time/empty states feel like an invitation ("your first gem goes here", glowing pedestal), not a blank slot. *(§20; "show only earned" stays)*

**FEEL / JUICE** *(fires AFTER/AROUND a rep — never on the active prompt; see C13)*
- **F9 Layered reward on success** — one correct answer fires SIMULTANEOUS squash-pop + particle burst + pitch-varied ding + a collectible that flies to the shelf and STAYS; escalates to a *which-good-thing-varies* mastery celebration (loudest on mastery, §6.0). *(Vlambeer "do it all on the same event")*
- **F10 Tactile micro-interactions** — every interactive element has rest→press (scale ~0.94 + darker) →release (spring overshoot) + a soft tap sound; the visual-punch+sound is the iOS-haptics substitute. Wrong answer gets the OPPOSITE of juice: soft dim + replay + retry, never a harsh shake (#2). *(micro-interaction craft)*

**ENGAGEMENT / PEDAGOGY (ethical)**
- **E11 The reward teaches / intrinsic integration + a contingently-responsive companion** — the payoff carries meaning where it can (the decode IS what shatters the cage); reading is the mechanic, not a wrapper. The guide character (mentor/ally) is **contingently responsive — it reacts to what Teddy *just did*** (not a static smile), celebrates mastery, and models *thinking* on a miss, never scolds. Characters are recurring, named, persistent with an emotional range; the captured-friend-awaiting-rescue is an enduring-bond hook; allies cheer *by real name* (fuses competence + relatedness). *(Endless Alphabet teaching skits; Habgood intrinsic-integration 7× time-on-task; Calvert 2020 — responsive character → faster/more-accurate answers + transfer; Khan's Kodi; Malone&Lepper intrinsic fantasy)*
- **E12 Healthy pull, no dark patterns** — surprise = *which* good thing, never *whether*; rewards guaranteed, non-random, non-paid; lean on curiosity-gap teasers (next zone/rescue silhouette) + set-completion (gem shelf, rescued-friends league). **Progress visualization: never start a bar at zero — endow a little progress, and show an "almost there" state near a goal (endowed-progress + goal-gradient pull hardest near the end).** BANNED: timers, streak-guilt, loss-aversion, FOMO, paid-repair, infinite/auto-advance loops. **"Are we healthy?" test: if minutes rise but *enjoyment* falls, we've drifted (SDT obsessive vs harmonious).** *(Loewenstein curiosity-gap; Nunes&Drèze endowed-progress; Kivetz goal-gradient; SDT; Lepper; ICO Children's Code; deceptive.design)*

**CALM-LEARNING GATE (C13 — HARD FILTER, overrides all juice/beauty on a prompt)**
- **C13 Calm prompt** — the active decoding moment is uncluttered + audio-first; the target is NEVER shown as text (#4); no decoration/animation/coin-counter competes with it (HUD hidden per `NAV-PLAN` G1); juice is suspended until the answer lands. *(seductive-details depress recall even when they don't disrupt; cognitive-load; ADHD/dyslexia guidance — front-loaded decoration is worst)*

**PERFORMANCE GATE (P14)**
- **P14 WebKit-performant** — transform/opacity-only animation (never width/top/left/box-shadow); capped+pooled particles; `will-change` only while animating then removed; Lite strips GPU filters/blur/rim-shadows/idle-motion but keeps the cheap reward bursts + ALL learning content; one big filtered character at a time; `prefers-reduced-motion` honored. *(WebKit compositor reality)*

**The 6 highest-leverage upgrades (research consensus, best ratio of premium-feel ÷ effort):** (1) layer the correct-answer
response [F9], (2) lock palette+lighting+easing to a token set and audit every screen [A2/A4], (3) spring press-states +
a tap sound on every button [F10], (4) mastery-escalated reward with a small variant pool [F9/E11], (5) staggered
continuous transitions [A7], (6) pitch-vary repeated SFX [F9]. Nearly all extend code we already have.

*Sources (5-stream review, 2026-06-16): Apple Design Awards / Children's BAFTA + editors'-choice teardown (Endless
Alphabet, Toca/Sago/Pok Pok, Khan Kids, Teach Your Monster, Duolingo ABC, LEGO/StoryToys); juice canon (Vlambeer "Art
of Screenshake", Jonasson&Purho "Juice It or Lose It", GMTK, Swink "Game Feel") + premium art direction (Monument
Valley color-script, Alto's/Gris) + WebKit perf (web.dev/MDN/Motion); pitfalls (Garner 1989 / Harp&Mayer 1998 seductive
details, Sweller CLT, Mayer coherence/redundancy, Lepper 1973 + Deci/Koestner/Ryan 1999 overjustification, Mueller&Dweck
1998 process-praise, Habgood&Ainsworth 2011 intrinsic integration, Hanus&Fox 2015 PBL); retention/ethics (Loewenstein
1994 curiosity, Nunes&Drèze 2006 endowed-progress, Kivetz 2006 goal-gradient, Eyal Hook, ICO Children's Code, D4CR,
deceptive.design, Drummond&Sauer 2018 loot-boxes); character/SDT (Ryan&Deci 2000, Ryan/Rigby/Przybylski 2006 PENS,
Calvert et al. 2020 parasocial learning, Birk et al. 2016 avatar identification, Naul&Liu 2020 narrative). Full URLs in
the research task outputs.*

## Asset pipeline — EXPLORE raster painted UI art (parent directive, 2026-06-16)
**The Oracle should actively explore RASTER PAINTED images (via API image generation — `fal.ai` / `FAL_KEY`, the access
path already in `AGENTS.md`) for decorative CHROME — buttons, icons, weapons, gear, collectibles, frames, plinths —
instead of (or alongside) parametric SVG, where painted art elevates the premium feel.** SVG stays where *she* judges it
ideal; this is "use the best tool per asset," not a mandate to rip out SVG. Painted assets are the likely jump to the
"absolutely beautiful, real-studio" bar (rubric A2/A3/A5). Each candidate is **render-gated** like everything else.

Trinity's guardrails on the exploration (so it elevates without breaking constraints or the deploy):
- **HARD CARVE-OUT — never raster the learning content.** Letters, the decoding tiles, and anything the child *reads*
  stay crisp **Andika / vector**, high-contrast (non-negotiable #6 + C13). Painted art is for chrome/decoration ONLY,
  never the prompt the child is decoding.
- **NO EMOJI still holds (#6).** Painted icons are fine (crafted art); they must replace, not reintroduce, OS glyphs.
- **Consistency is the risk** (same drift that ruled out AI-video for characters, `STORY.md §A`): a set of painted
  icons must share ONE art-direction (one prompt-style/lighting/palette) so 30 icons read as a family, not a grab-bag.
  Generate as a cohesive set, render-gate the set together.
- **Theming/recolor:** SVG retints for free under the scene-harmonizer (`--scene-rim`) + per-act skin; a painted PNG
  can't. So either bake per-act variants, or reserve painted art for elements that don't need live recoloring (keep
  scene-reactive bits vector). Oracle's judgment per asset.
- **Deploy hygiene:** ship optimized **WebP/PNG at @2x** for iPad retina crispness; mind git-history bloat (binaries
  don't diff — `STORY.md` serving notes) and keep the no-build GitHub-Pages deploy fast. Big sets → consider an
  atlas/sprite or lazy-load.
- **Perf (P14):** painted assets are cheap to *paint* (no GPU filters) — often LIGHTER than specular-lit SVG on old
  iPads — but watch total image weight + decode. Provide Lite-tier sizing if needed.

Action: fold this into the Wave-1 eval (#55) — when scoring buttons/icons/weapons, Oracle pilots a painted variant of a
few (e.g. a button, a weapon, a collectible) against the SVG, render-gates both, and picks the winner per the Award Bar.

## Cadence + control
Trinity runs the coordinating loop (status sweep → review any new render-gated PRs against the bar → update board →
batch + escalate decisions → nudge the next round). The parent can **pause/stop anytime** ("stop the loop"). Decisions
that are genuinely the parent's taste are batched into a single `AskUserQuestion`, not drip-fed.
