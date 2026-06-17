# KANBAN.md — the live work board (Trinity-maintained)

> The single view of **what's being built and what's queued.** **Trinity keeps this current every turn.** The parent does
> NOT edit it — he steers by answering Trinity's triage questions (`AskUserQuestion`); Trinity moves the cards. Each card =
> a GitHub Issue (`#N`); specs live in the linked docs. Owner: **[N]** = Neo · **[O]** = The Oracle.
> *(GitHub Projects can't be API-driven from here, so this markdown file is the canonical board.)* — updated 2026-06-16 (status sweep)

## 📥 TRIAGE — candidates awaiting the parent's call
*(empty — all caught up)*

## 🚫 EMOJI SWEEP — Trinity 2026-06-16 (parent: "seeing a lot of emoji still") — non-negotiable #6
*Root cause: the ui-emoji guard is a RATCHET (named zones only), so emoji leaked everywhere else. Full child-facing catalog filed:*
- **#102 [N]** Convert ui-emoji guard ratchet → **full child-facing scan** + parent-only allowlist (the systemic fix; shrinking known-violations list) *(build-now)*
- **#103 [O]** **PARENT-DIRECTED: generate a PAINTED image for EVERY inventory/content emoji** — learn-screen keyword pictures (LETTERS/GRAPH2 `icon`, `kwIcon`) + all cloze/sentence/read picture tiles (`data-content.js` `pic`/`foil`/READPIC, ~120). Painted raster, one cohesive set, staged. **The dominant visible source.**
- **#104 [O+N]** De-emoji the child UI CHROME — Vault/Scroll/Warm-Up titles (🔋📜🔥), win/rest buttons (🗺️🎯😴), combo/rank/done glyphs (🔥✦⭐✓➜✂️), map ✓ *(quick; crafted SVG or drop)*
*(Parent-only emoji — Grown-Up Corner / Settings / Voice Studio / Progress / cloud-status — are ALLOWED, left as-is. SVG→raster character work already tracked: #38 map figures, #60 face-tokens.)*

## 🔬 FULL CODE SWEEP — Trinity 2026-06-16 — ✅ ALL FIXED (#81–#88, PRs #91–#101)
*Pedagogy/constraints + security came back CLEAN. The 3 HIGH (cloud-clobber #81, lockRow mastery #82, crash-guards #83) + the 5 MED/LOW/INFO (#84–#88) are all merged. Crew burned the whole sweep down same-day.*

## 🩺 PRODUCTION-READINESS — Morpheus sweep 2026-06-16 (gated by Trinity → issues)
- **#107 [N] MED** 27.5 MB `voicepack.js` blocks boot (loaded before core modules) + BGM `preload=auto` probes ~11 MB at boot — real-iPad cold-load/deploy risk *(TTS fallback is the safety net; build-now-ish)*
- **#106 [N] LOW** Guard `Aud.pick()` for absent `speechSynthesis` (fail-soft #8) — verified headless-only; real iPad unaffected
- *(Morpheus's emoji finding = already covered by #102/#103/#104; no dup.)*

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
