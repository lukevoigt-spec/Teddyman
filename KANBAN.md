# KANBAN.md — the live work board (Trinity-maintained)

> The single view of **what's being built and what's queued.** **Trinity keeps this current every turn.** The parent does
> NOT edit it — he steers by answering Trinity's triage questions (`AskUserQuestion`); Trinity moves the cards. Each card =
> a GitHub Issue (`#N`); specs live in the linked docs. Owner: **[N]** = Neo · **[O]** = The Oracle.
> *(GitHub Projects can't be API-driven from here, so this markdown file is the canonical board.)* — updated 2026-06-16 (status sweep)

## 📥 TRIAGE — candidates awaiting the parent's call
*(empty — all caught up)*

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
- **#62 [O]** Ally face-tokens → painted raster (cheer pops, league thumbs, win mini-face) — last SVG characters left after PR #59 *(consistency, Award Bar A5)*

## 🔨 BUILDING — has an open PR
- **PR #61 [N]** Remove dead dropdown-nav CSS — resolves Morpheus QA #58 NAV drift (pure dead-code, suites pass) — Neo to merge.

## 🅿️ DEFERRED — approved-someday, not active
- **#28 [N]** Device-verify Base/Training/Shop/Vault overflow @1024×768 (WebKit) — apply sticky-footer/scroll where a sub-screen clips its primary action
- **#40 [O]** Shop close/DONE button fit @1024×768 WebKit *(overlaps #28)*
- **#35 [O]** Mouth art on the big cutscene portraits (driver already shipped)
- **#36 [O]** Cinematic SVG cutscene pass (beats 2–6: Ken Burns + parallax)
- **#37 [O]** Portal AI-video spike *(optional, render-gated, SVG fallback)*
- **#38 [O]** Map allies — **ground them standing ON the path by their zone (parent-flagged: they float in mid-air)** + swap to new ally art
- **#39 [O]** §20 render-gate catch-up on new Act-2 systems + the calm-prompt check

## ✓ DONE (recent — last sweep)
**Reading (objective #1): full TEKS Grade-2 ladder complete, Act 1 + Act 2 content-complete.** Plus: beat-7 homecoming
ending · intro-hook cold-open rewrite (#22) · Training Room engagement (coin→gold→diamond, daily bar, gated ally
interrupts #23/#29) · daily target 15 (#21) · `flyReward` polish (#24) · **nav 4-corner buttons (PR #49)** · Sir-Teddy
app icon (PR #51) · Hero-Base build package (PR #50) · Voice-Studio file-upload + Act-2 phonemes (#46) · CLOUD-2
data-loss fix (#30) · working-tree isolation guard (#25) · RENDER-1 harness fix (#26) · de-emoji nav + in-game controls
(PRs #43/#45) · squire fix · win-screen square fix · ARENA look + world maps · mouth-move driver. **Latest:** Hero-Base
layered-hub shell (PR #52) + bleed hotfix (#56) · hero/cutscenes routed to painted raster, no SVG characters (PR #59) ·
painted nav-corner icons + back-to-base removal (PRs #52/#57) · Rest→map + Skip≥96px (#53). *(history in git + QA.md)*
