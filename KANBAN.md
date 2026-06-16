# KANBAN.md — the live work board (Trinity-maintained)

> The single view of **what's being built and what's queued.** **Trinity keeps this current every turn.** The parent does
> NOT edit it — he steers by answering Trinity's triage questions (`AskUserQuestion`); Trinity moves the cards. Each card =
> a GitHub Issue (`#N`); specs live in the linked docs. Owner: **[N]** = Neo · **[O]** = The Oracle.
> *(GitHub Projects can't be API-driven from here, so this markdown file is the canonical board.)* — updated 2026-06-16 (status sweep)

## 📥 TRIAGE — candidates awaiting the parent's call
*(empty — all caught up)*

## ✅ APPROVED — build now
**Nav overhaul (`NAV-PLAN.md`) — 4-corner buttons SHIPPED (PR #49); remaining slices (need Neo/Oracle tickets):**
- **NAV-a [O]** Icon-only corner glyphs — house / folded-map / gear, one quiet style, no labels *(G4, parent-directed)*
- **NAV-b [N]** `body.learning` → hide the HUD on learning screens; keep nav corners (recessive) + Replay/Skip *(G1)*
- **NAV-c [N]** Title single-PLAY (first-run→intro / returning→map); drop START/CONTINUE ambiguity + under-PLAY shortcut
- **NAV-d [O+N]** Map node states (done/current/locked) read visually + gentle on-tap locked feedback *(G5; pairs with map-premium)*

**The big redesigns — delegation (AGENTS rule 8): `[O]` designs+art+gates · `[N]` implements · `[O]` `§20 PASS` · `[N]` merges:**
- **#31 [O+N]** UI theme coherence — standardize every screen to the painted backgrounds (folds in **#32** de-emoji shop glyphs 💰💎✓★ + **#27** emoji-guard expansion). *(title screen stays as-is.)*
- **#33 [O+N]** Hero Room, plinth-first diegetic redesign — *build package landed (PR #50: spec + backdrops + mocks)*; the diegetic `paintBase` layout/hotspots build remains.
- **#34 [O+N]** Training Room visual redesign (engagement mechanics already shipped).
- **#44 [O]** Title-screen hero box on iPad — nudge down + kill the clipped-glow rect *(build-now; WebKit-verify, don't restyle the title).* 

## 🔨 BUILDING — has an open PR
*(none open right now — last batch all merged)*

## 🅿️ DEFERRED — approved-someday, not active
- **#28 [N]** Device-verify Base/Training/Shop/Vault overflow @1024×768 (WebKit) — apply sticky-footer/scroll where a sub-screen clips its primary action
- **#40 [O]** Shop close/DONE button fit @1024×768 WebKit *(overlaps #28)*
- **#35 [O]** Mouth art on the big cutscene portraits (driver already shipped)
- **#36 [O]** Cinematic SVG cutscene pass (beats 2–6: Ken Burns + parallax)
- **#37 [O]** Portal AI-video spike *(optional, render-gated, SVG fallback)*
- **#38 [O]** Swap the map ally figures to new art
- **#39 [O]** §20 render-gate catch-up on new Act-2 systems + the calm-prompt check

## ✓ DONE (recent — last sweep)
**Reading (objective #1): full TEKS Grade-2 ladder complete, Act 1 + Act 2 content-complete.** Plus: beat-7 homecoming
ending · intro-hook cold-open rewrite (#22) · Training Room engagement (coin→gold→diamond, daily bar, gated ally
interrupts #23/#29) · daily target 15 (#21) · `flyReward` polish (#24) · **nav 4-corner buttons (PR #49)** · Sir-Teddy
app icon (PR #51) · Hero-Base build package (PR #50) · Voice-Studio file-upload + Act-2 phonemes (#46) · CLOUD-2
data-loss fix (#30) · working-tree isolation guard (#25) · RENDER-1 harness fix (#26) · de-emoji nav + in-game controls
(PRs #43/#45) · squire fix · win-screen square fix · ARENA look + world maps · mouth-move driver. *(history in git + QA.md)*
