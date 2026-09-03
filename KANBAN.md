# KANBAN.md — the live work board (Trinity-maintained)

> The single view of **what's being built and what's queued.** **Trinity keeps this current every turn.** The parent does
> NOT edit it — he steers by answering Trinity's triage questions; Trinity moves the cards. Each card = a GitHub Issue
> (`#N`); specs live in the linked docs. Owner: **[N]** = Neo · **[O]** = The Oracle.
> *(GitHub Projects can't be API-driven here, so this file IS the board.)* — **release-ready state, 2026-06-18 (Trinity);
> parent confirmed go-live; the backlog is burned down to two parked, optional cinematic items.**

## 🚦 STATUS — LIVE; the 2026-06-20 FULL CODEBASE REVIEW opened a new wave (3 P0s) + a FALSE-DONE was caught (#182)
**Objective #1 (Teddy learns to read) is DONE + live** — the full TEKS Grade-2 ladder, Act 1+2. The 2026-06-19 (a) wave
(#170–#173) and the 2026-06-20 listen-gate follow-up (#180/#181) are merged + live. **Correction:** `#182` (the parent's
"mastery above all" per-word gate) was mislabeled SHIPPED — the cited `871a426` is the docs-only PR that *filed* it; **no
gate exists in code** (verified: `masteredItem` unchanged, gate still milestone-only). It is OPEN and the lead pedagogy
item. The **full codebase review** (`CODEBASE-REVIEW-2026-06-20.md`, five parallel reviews, all `file:line`-verified)
filed **#184–#195** — 3 P0s (write-token on the public site · CI can't block a bad deploy · a cloud progress-loss path),
learning-integrity holes, one structural root-cause fix, perf, and hygiene. App stays live/playable throughout.

## 🎯 CODEBASE-REVIEW WAVE — 2026-06-20 (Trinity sequenced; `CODEBASE-REVIEW-2026-06-20.md` has the evidence)
**Build order — pedagogy integrity first (small + objective #1), then the P0s, then the root-cause fix, then perf.**
1. **#182 [N] — Per-word letter-mastery gate (OPEN — the false-done is corrected).** Spec `RESEARCH-GATING-MASTERY.md` §C.
2. **#187 [N] — Pedagogy-integrity holes (S).** Mastery review mashable with ONE gem (1-item foil pool; fresh profile gets
   1–2-tile rounds) · participation taps recorded as mastery (magic-e cast / chop / scroll — can clear the Act-2 finale by
   tapping) · bonus coins on non-answers · missing 2-miss pulse in boss/forge/scramble · scramble records nothing.
3. **#188 [N] — Finish the listen-first gate (S).** Still missing on every encode task (forge/spell/fortSpell/vault/warm-ups)
   AND the finale reading proof (fortRead/fortMaze/fortSentencePic); stop rejecting fast-CORRECT taps.
4. **#184 [N+parent] — P0 SECURITY:** GitHub write-token to `main` in localStorage + Studio publishes straight to `main`.
5. **#185 [N] — P0 CI:** gated Pages deploy + Playwright boot/regression smoke + lint (fix the `word_tent` dup) + invariants.
6. **#186 [N] — P0 DATA-LOSS:** boot-window cloud clobber + `migrate()` wipes any `v≠1` save.
7. **#189 [N] — ROOT CAUSE: `choiceRound()`** — the answer round is hand-copied across ~15 handlers; one helper makes every
   gate/wrong-answer rule uniform by construction. Prerequisite for slimming `game.js`.
8. **#190 [N] — Robustness:** reset/restore mid-mission fires `missionComplete` on the fresh save · stale timers after Home ·
   combo/wedo leaks · null-sprite crash strands a word · TTS guard · swallowed catches · `TUNE` config.
9. **#191 [N] — Service worker:** versioned shell + LRU art cap (today: rewrites 40 MB every boot; offline version skew).
10. **#192 [N] — Voicepack split** (28 MB → 2.8 MB core + lazy IndexedDB chunks) + self-hosted fonts (Andika must never FOUT).
11. **#193 [O] — Asset diet** 183 MB → ~25 MB · touch targets under 96 px (skip 72, tiles 72–92) · ♥ glyph · CSS tokens/dead CSS.
12. **#194 [N] — Worker hardening** (origin allowlist, validate PUT, rate limit).
13. **#195 [T+N] — Hygiene:** docs drift + `ARCHITECTURE.md` + archive specs · dead code + dev pages off the public site ·
    `"use strict"` + load-order guard · `sent_` key bug · branch prune · then the `game.js` extraction order.

## ✅ PLAYTEST FOLLOW-UP — 2026-06-20 — DONE (parent note: "he's STILL rushing to skip through")
1. **#180 [N] — Listen-first gate on read/sentence/cloze — SHIPPED (`b41d0bf`).** The reading tasks now arm the answer
   choices only after the prompt audio plays (⏭/Home/replay live; 4.5s watchdog can't hang). +17 curriculum tests.
2. **#181 [N] — Close the re-arm hole Codex flagged — SHIPPED (`fa65786`).** A word-tile / sound / ear-replay tap mid-prompt
   no longer short-circuits the gate: a `__sidGen` generation counter supersedes the stale unlock and `sidArmTap`/`sidReArm`
   re-arm the gate to the NEW audio, so an interrupting tap locks the answers until THAT finishes.
   *(The 2026-06-20 review found the sweep still incomplete — encode tasks + the finale reading proof → **#188**.)*

## ⚠️ PLAYTEST WAVE — 2026-06-19 (b) — MASTERY-ABOVE-ALL — **NOT SHIPPED** (false-done corrected 2026-06-20)
1. **#182 [N] — Per-word letter-mastery gate — OPEN.** Was marked "SHIPPED (`871a426`, PR #183)" — that commit is the
   docs-only PR that filed the issue (4 doc files, 0 game code). Verified on `main`: no per-word gate, `masteredItem` still
   `str≥4 && seen≥5 && acc≥0.8` with no automaticity component, gate fires only at milestones. Builds on the shipped #171
   `relearn`/IR engine. **Lead item of the review wave above.**

## ✅ PLAYTEST WAVE — 2026-06-19 (a) — DONE (parent watched Teddy play; PLAYTEST.md + `RESEARCH-GATING-MASTERY.md`)
1. **#170 [N+O] — Listen-first audio gate — SHIPPED (`bf4346a`, PR #177).** The `sidArm` gate now covers the **Training
   Room build** (the coin-rush point): tiles arm only after the word prompt plays; first-letter listen-first, a miss
   re-plays + re-arms (errorless), replay/skip always live, 4.5s watchdog can't hang. Silent-lock upgraded → "armed-when-
   ready": gems CHARGE (motion-gated shimmer) then ARM with a brighten/scale-pop + a soft `Sfx.ready` chime — brightness +
   chime = the non-motion ready channel (Calm/RM). §20 render-confirmed (Training gate, A1+A2, land+portrait).
2. **#171 [N] — Error-driven Incremental-Rehearsal weighting — SHIPPED (`f57401d`).** `record()` flags a miss with a
   `relearn` counter that fades only on a SPACED correct (not the instant retry); `pickWeak()` strongly up-weights relearn
   items so misses re-surface MORE across every adaptive pool (patrol/review/Vault), but excludes the just-shown item so a
   weak item is never drilled back-to-back (interspersed, never massed — Joseph 2006). Additive + save-safe; +9 save.test
   assertions. The existing milestone gate (coreWeak→masteryReview) delivers "no progress until mastered" AT MILESTONES —
   **#182 generalizes it to per-word.**
3. **#172 [O+N] — Training Room discoverability — SHIPPED (`f7eb4ff`, PR #176).** Prominent labeled Base Training entry
   (dumbbell + "TRAINING" + coin) + the coins HUD chip launches Training too; gem/charge/daily taps kept as secondary.
4. **#173 [O+N] — Win-chest art → painted — SHIPPED (`42bc70b`, PR #175).** Win screen now uses the painted chest so it
   matches the shop (closed a §20 deferral).

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
