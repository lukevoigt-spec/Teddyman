# KANBAN.md — the live work board (Trinity-maintained)

> The single view of **what's being built and what's queued.** **Trinity keeps this current every turn.** The parent does
> NOT edit it — he steers by answering Trinity's triage questions (`AskUserQuestion`); Trinity moves the cards. Each card =
> a GitHub Issue (`#N`); specs live in the linked docs. Owner: **[N]** = Neo · **[O]** = The Oracle.
> *(GitHub Projects can't be API-driven from here, so this markdown file is the canonical board.)* — updated 2026-06-16 (post-triage)

## 📥 TRIAGE — candidates awaiting the parent's call
*(empty — all caught up 2026-06-16)*

## ✅ APPROVED — build now (parent triage 2026-06-16)
**Neo:**
- **#21 [N]** DAILY-1: `goalMin` default 30 → 15 + save.test
- **#22 [N]** Intro-hook: update the 5 panel texts to `STORY.md §G`
- **#23 [N]** Training interrupts: sync the process-praise fixes + gate JJ/Nora/Cal until rescued
- **#25 [N]** Working-tree isolation guard *(bumped from Deferred 2026-06-16 — two agents now edit the visual layer, so it's required)*
- **#46 [N]** Voice Studio: upload pre-recorded files for the letter sounds + add the Act-2 phonemes (ai/ee/oa/ar/or/er) to the recorder *(parent-directed — unblocks his premium-phoneme upload route; see `AUDIO-SOURCING.md`)*

**The 3 big redesigns — delegation model (AGENTS rule 8): `[O]` designs + makes art + gates · `[N]` implements to spec · `[O]` posts `§20 PASS` · `[N]` merges.**
*Oracle keeps taste/composition; Neo takes execution. Proposed Neo slices below — the Oracle confirms/adjusts as she specs each task.*
- **#31 [O+N]** UI theme coherence (folds in #32 + #27) — **O:** per-screen chrome standard + the de-emoji SVG icons (💰💎✓★). **N:** apply the CSS/markup across screens + swap in the icons + **#27** expand the emoji-guard (pure code).
- **#33 [O+N]** Hero Room, plinth-first — **O:** plinth/avatar art + the diegetic composition (`BASESPOTS`, hotspot layout). **N:** wire `paintBase` layout/hotspots + tap-to-inspect to spec.
- **#34 [O+N]** Training Room redesign — **O:** the visual design. **N:** implement the layout/CSS to spec.
- **#44 [O]** Title-screen hero box on iPad — nudge down + kill the clipped-glow rectangle *(parent-directed build-now; WebKit-verify, don't restyle the title otherwise)*

## 🔨 BUILDING — has an open PR
- **PR #43** [O] De-emoji the **nav-menu icons** (batch 1 of #31/#32; crafted `UICONS` SVG, Oracle §20-PASS in the PR, tests green) — **awaiting Neo merge.** Next batches sequenced: action rail · HUD · in-game controls.

## 🅿️ DEFERRED — approved-someday, not active
- **#24 [N]** Standardize `flyReward` for training/vault rewards
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
