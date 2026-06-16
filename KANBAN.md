# KANBAN.md — the live work board (Trinity-maintained)

> The single view of **what's being built and what's queued.** **Trinity keeps this current every turn.** The parent does
> NOT edit it — he steers by answering Trinity's triage questions (`AskUserQuestion`); Trinity moves the cards. Each card =
> a GitHub Issue (`#N`); specs live in the linked docs. Owner: **[N]** = Neo · **[O]** = The Oracle.
> *(GitHub Projects can't be API-driven from here, so this markdown file is the canonical board.)* — updated 2026-06-16 (post-triage)

## 📥 TRIAGE — candidates awaiting the parent's call
*(empty — all caught up 2026-06-16)*

## ✅ APPROVED — build now (parent triage 2026-06-16)
**Neo — quick fixes:**
- **#21 [N]** DAILY-1: `goalMin` default 30 → 15 + save.test
- **#22 [N]** Intro-hook: update the 5 panel texts to `STORY.md §G`
- **#23 [N]** Training interrupts: sync the process-praise fixes + gate JJ/Nora/Cal until rescued

**The Oracle — the 3 big redesigns (parent: build in parallel):**
- **#31 [O]** UI theme coherence pass — standardize every screen to the painted backgrounds. **➕ Folded in per parent:
  #32 de-emoji the Shop/base glyphs + #27 expand the emoji-guard — do these AS PART of this pass, not separately.**
- **#33 [O]** Hero Room premium diegetic redesign (plinth-first)
- **#34 [O]** Training Room full redesign to the Premium Bar

## 🔨 BUILDING — has an open PR
*(none open right now — #31 groundwork already merged; Trinity moves cards here when a PR opens)*

## 🅿️ DEFERRED — approved-someday, not active
- **#24 [N]** Standardize `flyReward` for training/vault rewards
- **#25 [N]** Working-tree isolation guard
- **#26 [N]** Render-harness scene isolation (RENDER-1) — unblocks the §20 gate
- **#28 [N]** Verify M-#2 Base overflow on Training/Shop/Vault @1024×768 (device)
- **#29 [N]** Training interrupt timing buffer *(kept per parent)*
- **#30 [N]** CLOUD-2: daily-rollover vs cloud restore + save.test
- **#35 [O]** Mouth art on the big cutscene portraits
- **#36 [O]** Cinematic SVG cutscene pass (Ken Burns + parallax)
- **#37 [O]** Portal AI-video spike *(kept per parent; optional, render-gated)*
- **#38 [O]** Swap the map ally figures to new art
- **#39 [O]** §20 render-gate catch-up on new Act-2 systems + the calm-prompt check
- **#40 [O]** Shop close/DONE button fit @1024×768 WebKit

## ✓ DONE (recent)
Reading-goal milestone: TEKS Grade-2 ladder complete · beat-7 homecoming ending · Training Room engagement (coin→gold→
diamond, daily bar, ally interrupts) · daily-practice bar · squire fix · win-screen square fix · ARENA look + world maps ·
mouth-move driver · all-screen background restyle. *(history in git + QA.md resolved-ledger)*
