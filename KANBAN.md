# KANBAN.md — the live work board (Trinity-maintained)

> The single view of **what's being built and what's queued.** **Trinity keeps this current every turn.** The parent does
> NOT edit it — he steers by answering Trinity's triage questions (`AskUserQuestion`); Trinity moves the cards. Each card =
> a GitHub Issue (`#N`); specs live in the linked docs. Owner: **[N]** = Neo · **[O]** = The Oracle.
> *(GitHub Projects can't be API-driven from here, so this markdown file is the canonical board.)* — updated 2026-06-16 (status sweep)

## 📥 TRIAGE — candidates awaiting the parent's call
*(empty — all caught up)*

## 🔬 FULL CODE SWEEP — Trinity 2026-06-16 (5 parallel specialist reviews; new findings filed)
*Pedagogy/constraints + security came back CLEAN (no anti-gaming #4 leak, no sequencing violation, profile-name escaping verified, no committed secrets). Save layer solid for single-profile; runtime/perf had consistency-lapse bugs. Build-now first:*
- **#81 [N] HIGH** Cross-profile cloud clobber — debounced `cloudPush` stringifies live `S` after `switchProfile` reassigns it → one child's data into another's cloud slot (multi-profile wipe, #7)
- **#82 [N] HIGH** Missing `lockRow` on forge/spell/read/cloze/scramble/sentence correct-paths → double-tap inflates mastery (§6.0)
- **#83 [N] HIGH** Crash-guards — `magicStep` `me.v` deref · `forgeWord` null sprite · `flow()` unguarded `btnSkip` (uncaught throws freeze the screen)
- **#84 [N] MED** Win-screen NEXT uses flat id-order not play-order → can jump to out-of-sequence/locked mission
- **#85 [N] MED** Lite tier doesn't strip `backdrop-filter` (HUD chips/modals) or cap `confetti(90)` — defeats Lite on old iPads (P14)
- **#86 [N] MED** Audio robustness — music can stick ducked (unduck only via `_settle`); `Aud.ding` fallback ctx no iOS resume
- **#87 [N] LOW** Hygiene — goalMin sticky-30 + migrate type-coercion + Forget-publish-token button
- **#88 [N] INFO** Vault meter counts synthetic mastery keys + Training Room stays Act-1-only (deliberate-decision)

## 🏆 ELEVATION LOOP — "make it award-winning & beautiful" (`ELEVATION-LOOP.md`, active)
Award Bar rubric **v1 synthesized** (14 criteria, 5-stream research review). Now running wave-by-wave:
- **#54 [O]** Ratify the Award Bar into `STYLE.md §20` (Oracle adjusts + owns)
- **#55 [O+N]** **Wave 1 eval** — score Title · World Map · a learning prompt · Win against the bar → gap lists in `DESIGN-REVIEW.md` → become per-fix slices *(Wave 2 = Base/Training/Shop · Wave 3 = cutscenes/settings/transitions)*

## ✅ APPROVED — build now
**Nav overhaul (`NAV-PLAN.md`) — 4-corner buttons SHIPPED (PR #49); painted nav icons + back-to-base removal + HUD-hide-on-learning + Rest→map + Skip≥96px all landed (PRs #52/#57/#53). Remaining:**
- ~~NAV-a icon-only corners~~ DONE — painted `nav-home/map/settings.png` (PR #52). ~~NAV-b HUD-hide-on-learning~~ DONE.
- **NAV-c [N]** Title single-PLAY (first-run→intro / returning→map); drop START/CONTINUE ambiguity + under-PLAY shortcut
- **NAV-d [O+N]** Map node states (done/current/locked) read visually + gentle on-tap locked feedback *(G5; pairs with #38 map-premium)*

**The big redesigns — delegation (AGENTS rule 8): `[O]` designs+art+gates · `[N]` implements · `[O]` `§20 PASS` · `[N]` merges:**
- **#31 [O+N]** UI theme coherence — standardize every screen to the painted backgrounds (folds in **#32** de-emoji shop glyphs 💰💎✓★ + **#27** emoji-guard expansion). *(title screen stays as-is.)*
- **#33 [O+N]** Hero Room, plinth-first diegetic redesign — *layered-hub SHELL shipped (PR #52: painted lair + spotlit hero + sections + PLAY→next-level)*; remaining = tap→card overlays (gems/coins/weapons/customize), gem-dex %, room-grows-with-mastery.
- **#34 [O+N]** Training Room visual redesign (engagement mechanics already shipped).
- **#44 [O]** Title-screen hero box on iPad — nudge down + kill the clipped-glow rect *(build-now; WebKit-verify, don't restyle the title).*
- **#60 [O]** Ally face-tokens → painted raster (cheer pops, league thumbs, win mini-face) — last SVG characters left after PR #59 *(consistency, Award Bar A5; my dup #62 closed)*

## 🔨 BUILDING — has an open PR
*(none open — last batch merged)*

## 🅿️ DEFERRED — approved-someday, not active
- **#35 [O]** Mouth art on the big cutscene portraits (driver already shipped)
- **#36 [O]** Cinematic SVG cutscene pass (beats 2–6: Ken Burns + parallax)
- **#37 [O]** Portal AI-video spike *(optional, render-gated, SVG fallback)*
- **#38 [O]** Map allies — **ground them standing ON the path by their zone (parent-flagged: they float in mid-air)** + swap to new ally art
- **#39 [O]** §20 render-gate catch-up on new Act-2 systems + the calm-prompt check *(also re-verify anti-gaming #4 in the new Vault/Warm-Up paths — parent deep-dive found them currently CLEAN)*

## ✓ DONE (recent — last sweep)
**Reading (objective #1): full TEKS Grade-2 ladder complete, Act 1 + Act 2 content-complete.** Plus: beat-7 homecoming
ending · intro-hook cold-open rewrite (#22) · Training Room engagement (coin→gold→diamond, daily bar, gated ally
interrupts #23/#29) · daily target 15 (#21) · `flyReward` polish (#24) · **nav 4-corner buttons (PR #49)** · Sir-Teddy
app icon (PR #51) · Hero-Base build package (PR #50) · Voice-Studio file-upload + Act-2 phonemes (#46) · CLOUD-2
data-loss fix (#30) · working-tree isolation guard (#25) · RENDER-1 harness fix (#26) · de-emoji nav + in-game controls
(PRs #43/#45) · squire fix · win-screen square fix · ARENA look + world maps · mouth-move driver. **Latest:** Hero-Base
layered-hub shell (PR #52) + bleed hotfix (#56) · hero/cutscenes routed to painted raster, no SVG characters (PR #59) ·
painted nav-corner icons + back-to-base removal (PRs #52/#57) · Rest→map + Skip≥96px (#53) · dead dropdown-CSS removed
(PR #61, Morpheus #58 resolved) · ui-emoji guard covers Hero Base (PR #63, advances #27) · Shop DONE-button fit fixed
(#64 closes #40; #28 overflow verified) · Memory Vault grapheme-surfacing feature (#65) · boot 404-noise chore (#66) ·
gem-shower juice on win/unlock/chest (#67/#68) · **parent deep-dive bugs all fixed: #76→#72 cloud/daily timing · #77→#71
interrupt buffer · #78→#74 reward-shower cap · #79→#73 Base shelf caps · #80→#75 hardening trio.** *(history in git + QA.md)*

> **Trinity full code sweep complete (2026-06-16):** 5 parallel specialist reviews → findings filed as #81–#88 (see top of board).
