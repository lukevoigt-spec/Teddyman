# KANBAN.md — the live work board (Trinity-maintained)

> The single view of **what's being built and what's queued.** **Trinity keeps this current every turn.** The parent does
> NOT edit it — he steers by answering Trinity's triage questions; Trinity moves the cards. Each card = a GitHub Issue
> (`#N`); specs live in the linked docs. Owner: **[N]** = Neo · **[O]** = The Oracle.
> *(GitHub Projects can't be API-driven here, so this file IS the board.)* — **release-ready state, 2026-06-18 (Trinity);
> parent confirmed go-live; the backlog is burned down to two parked, optional cinematic items.**

## 🚦 STATUS — LIVE + RELEASE-READY; a PLAYTEST WAVE now in flight (2026-06-19)
**Objective #1 (Teddy learns to read) is DONE + live** — the full TEKS Grade-2 ladder, Act 1+2. The app ships today and
stays playable. **A new enhancement wave kicked off from a parent live session (2026-06-19)** — 4 issues below, two of them
learning-critical (listen-first gating + mastery enforcement), researched + specced. These are improvements ON TOP of a
shipping app, not blockers.

## 🎯 PLAYTEST WAVE — 2026-06-19 (parent watched Teddy play; PLAYTEST.md + `RESEARCH-GATING-MASTERY.md`)
**Build order (Trinity sequenced; decisions pre-inferred so Neo/Oracle don't stall). Trinity babysits each PR → merged.**
1. **#170 [N+O] — Listen-first audio gate (build FIRST; core pedagogy + the parent's #1 ask).** Teddy taps past the sound
   to grab coins. Extend the existing `sidArm` gate to the **Training Room build** (where coins are earned — currently
   ungated) + upgrade silent-lock → an **"armed-when-ready"** affordance (gems CHARGE while the sound plays, then arm with
   a "ready" chime + "your turn" cue; replay always live; lock = prompt length only). Evidence: `RESEARCH-GATING-MASTERY.md`
   §A — the delay alone doesn't help, *filling the wait with the sound* does (Barker & Munakata 2015).
2. **#171 [N] — Error-driven Incremental-Rehearsal weighting + session-spanning mastery gate.** "Ensure mastery / reinforce
   weak areas; misses show up more; no progress until mastered." Extend `record`/`pickWeak`/`masteryReview`/Vault: a miss
   flags `relearn` + up-weights it, **but spaced ~1-in-9 among wins (never back-to-back)**, expanding interval; errorless
   pre-prompt; session-spanning gate framed as a CHARGING power meter (never a wall). Evidence: §B (Incremental Rehearsal,
   Kulik mastery-learning, errorless learning). All additive + save-safe.
3. **#172 [O+N] — Training Room discoverability.** "Not intuitive that you earn coins there; need another way in." Painted,
   LABELED Training entry (a gym door/sign with a coin motif) in the Hero Base + clearer per-rep coin signal; keep the
   gems/bar tap too.
4. **#173 [O+N] — Win-chest art → painted, matching the squishy page.** The win screen draws a vector `chestSVG`
   placeholder; the shop uses painted `art/chest-closed.png`. Swap the win chest to the painted art so they match
   (closes a known §20 deferral).

## 🅿️ PARKED — optional, parent-deferred (do NOT gate go-live)
1. **#36 [O] — Cinematic SVG cutscene pass** (beats 2–6: Ken Burns + 2.5D parallax). Optional polish; the SVG cutscenes
   already ship and work. Render-gated if ever built.
2. **#37 [O] — Portal AI-video spike.** DEFERRED — **the parent is doing the portal VIDEO himself.** SVG portal stays as
   the live fallback. Ship only if it clears §20.

> **The one "finish v1" item that's the PARENT's, not the crew's (post-launch, no redeploy):** record the **letter-sound
> phonemes + the new friends' voices** in the Voice Studio (TTS can't make a clean schwa-free phoneme — the most
> pedagogically critical audio). The app ships on TTS fallback today; recorded clips Publish to `voicepack.js`/cloud and
> land on the iPad with **no redeploy**, so this never blocked go-live. Engineering can't close it; recording can.

## 📥 TRIAGE — candidates awaiting the parent's call
*(empty — the 06-17 batch is fully dispositioned + shipped; the research backlog below is parked, not yet filed.)*

## 🅿️ PARKED (research backlog) — ideas not yet filed (candidates for a future engagement wave)
More autonomy/choice · within-mission micro-progress + endowed head-start · avatar/Base ownership · returning warm
characters greet-by-name · anticipation juice + named praise · cumulative (never consecutive) day-count. Do-not-build list
+ full evidence in `ENGAGEMENT-RESEARCH.md`.

## 🔨 BUILDING — has an open PR
*(none. Babysit posture stays armed: Trinity watches the `oracle/*` + `morpheus/*` + `cypher/*` + `fix/*` + `feat/*`
branches and gates/coordinates any PR the moment it opens — incl. a future Cypher QA sweep — and drives it to merged.)*

## ✓ DONE (the wrap-it-up merge train — verified against live Issues, 2026-06-17 → 18)
**The app is content-complete + stable + live + RELEASE-READY.** Objective #1 (Teddy learns to read) — full TEKS Grade-2
ladder, Act 1+2 — is **DONE**.
**Final engagement/polish wave (closed + shipped):** anti-gaming re-lock #153 (`sidArm`/`fortAccept`) · uncertain-bonus
reward #151 · **collection-as-mastery counter #152** (the #1 daily-return hook — "N/26 gems mastered" + Zeigarnik ghost,
on title + map) · **squishy economy v2 #145** (+50 zone-unlocked squishies + rarity tiers, live in the store) · ally
cheer-pops → raster #60 (cast now fully raster) · **map touch targets ≥96px in portrait #162** (Neo hit-geometry +
Oracle §20 measure-confirm, all node states 102×102px) · **Gem-Dex CTA + win-chest overflow render-fixes #163**.
**Earlier today:** collection cards #124/#126 · Hero-Base lair-growth #123 · Training-Room redesign #125 · XP rank
meter #131/#137/#140 · FTUE first-time flow #130/#138 + beatIn transitions #132 · de-emoji pass #116 + full-scan guard
#117 + remaining chrome #104 · WebKit card-flip #136 · ghost-button unify #148 · boot-perf #107 + Aud.pick #106 ·
playtest-docs #112 + Base-perf #113 · UI theme #31 · Hero-box #44 (de-halo) · Hero-Room redesign #33 · Training visual
#34 · the Elevation-Loop close-out (#54 Award Bar ratified · #55 Wave-1 eval) · #35 mouth-art · #38 map-allies-grounded ·
#39 §20 render-gate catch-up · engagement research #154 + Trinity's friend-voices/learn-declutter #147 · roster #110 +
training-lines #111.
**Earlier:** the full code sweep #81–88 · parent deep-dive #71–75 · painted icon set #103/#109 · nav overhaul · #105
re-apply. *(History in git + `QA.md`.)*

— Trinity, 2026-06-18
