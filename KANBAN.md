# KANBAN.md — the live work board (Trinity-maintained)

> The single view of **what's being built and what's queued.** **Trinity keeps this current every turn.** The parent does
> NOT edit it — he steers by answering Trinity's triage questions (`AskUserQuestion`); Trinity moves the cards. Each card =
> a GitHub Issue (`#N`) with the detail; specs live in the linked docs. Owner tag: **[N]** = Neo · **[O]** = The Oracle.
> *(GitHub Projects can't be API-driven from here, so this markdown file is the canonical board.)* — updated 2026-06-16

## 📥 TRIAGE — candidates awaiting the parent's call
*Trinity's recommendation tag:* 🟢 do-now · 🟡 defer · 🔴 drop/reconsider. **Nothing here is committed until approved.**

- 🟢 **#21 [N]** DAILY-1: daily target still boots at 30 → change `goalMin` default to 15 + save.test *(your decision, currently broken)*
- 🟢 **#22 [N]** Intro-hook: update the 5 panel texts to the approved `STORY.md §G` *(trivial, already approved)*
- 🟢 **#23 [N]** Training interrupts: sync the no-streak/process-praise fixes + gate JJ/Nora/Cal until rescued *(fixes constraint violations in shipped content)*
- 🟢 **#32 [O]** De-emoji the Shop/base glyphs (💰💎✓★) → crafted SVG *(the emoji thing you flagged)*
- 🟢 **#27 [N]** Expand the ui-emoji guard to catch those glyphs *(pairs with #32)*
- 🟢 **#31 [O]** UI theme coherence pass — standardize every screen to the painted backgrounds *(you directed it; in progress)*
- 🟢 **#33 [O]** Hero Room premium diegetic redesign, plinth-first *(your "looks like a dashboard" complaint; big win)*
- 🟢 **#34 [O]** Training Room full redesign to the Premium Bar *(your "not great" playtest)*
- 🟡 **#24 [N]** Standardize `flyReward` for training/vault rewards *(easy delight)*
- 🟡 **#25 [N]** Working-tree isolation guard *(process safety)*
- 🟡 **#26 [N]** Render-harness scene isolation (RENDER-1) *(unblocks the §20 render-gate)*
- 🟡 **#28 [N]** Verify M-#2 Base overflow on Training/Shop/Vault @1024×768 *(device check)*
- 🟡 **#30 [N]** CLOUD-2: daily-rollover vs cloud restore + save.test *(save integrity)*
- 🟡 **#35 [O]** Mouth art on the big cutscene portraits *(driver done; finishes the feature)*
- 🟡 **#36 [O]** Cinematic SVG cutscene pass (Ken Burns + parallax) *(storyline elevation)*
- 🟡 **#38 [O]** Swap the map ally figures to new art *(visible, minor; partial done)*
- 🟡 **#39 [O]** §20 render-gate catch-up on new Act-2 systems + the calm-prompt check *(quality/pedagogy)*
- 🟡 **#40 [O]** Shop close/DONE button fit @1024×768 WebKit *(real but narrow usability bug)*
- 🔴 **#29 [N]** Training interrupt timing buffer after a Spell-Scroll *(minor; may not be worth it)*
- 🔴 **#37 [O]** Portal AI-video spike *(optional, high cost/risk per the STORY.md research — you picked it earlier; keep deferred or drop?)*

## ✅ APPROVED — build queue (parent said yes; priority order)
*(none yet — awaiting the first triage)*

## 🔨 BUILDING — has an open PR
*(none)*

## 🅿️ DEFERRED — approved-someday, not now
*(none yet)*

## ✓ DONE (recent)
Reading-goal milestone: TEKS Grade-2 ladder complete · beat-7 homecoming ending · Training Room engagement (coin→gold→
diamond, daily bar, ally interrupts) · daily-practice bar · squire fix · win-screen square fix · ARENA look + world maps ·
mouth-move driver · all-screen background restyle. *(history in git + QA.md resolved-ledger)*
