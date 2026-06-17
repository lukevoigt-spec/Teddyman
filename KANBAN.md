# KANBAN.md — the live work board (Trinity-maintained)

> The single view of **what's being built and what's queued.** **Trinity keeps this current every turn.** The parent does
> NOT edit it — he steers by answering Trinity's triage questions; Trinity moves the cards. Each card = a GitHub Issue
> (`#N`); specs live in the linked docs. Owner: **[N]** = Neo · **[O]** = The Oracle.
> *(GitHub Projects can't be API-driven here, so this file IS the board.)* — **reconciled + sequenced 2026-06-17 (Trinity);
> parent: "tackle the rest of the backlog, explicit handoffs, infer my answers, babysit to done."**

## 🎯 BUILD ORDER — the wrap-it-up sequence (only 7 issues left; all enhancement/polish, no blockers)
**Decisions are pre-made below (Trinity inferred them from the parent's established preferences) so Neo/Oracle never stall.
Trinity babysits every PR → gates/coordinates → merged.** The core app (reading ladder, Act 1+2) is DONE + live.

1. **#153 [N] — Anti-gaming re-lock (build FIRST).** The parent's explicit "stop button-mashing" ask + protects learning
   integrity. Pure code, well-specced. Threshold ~400–600ms (Neo tunes on device). No art.
2. **#151 [N] — Uncertain-BONUS reward — ✅ SHIPPED 2026-06-17** (closed mid-session; the crew is actively burning the
   list). Oracle can still polish the "bonus!" visual + Neo tune the rate as a follow-up if it doesn't feel right on device.
3. **#152 [O+N] — Collection-as-mastery counter** ("N/26 gems mastered" on home/map + the Zeigarnik reachable-gap). #1
   daily-return hook. Oracle owns the look/placement (§20); Neo wires it to the existing `letterMastered` data. Overlaps
   the merged gem-card #126 — reuse, don't duplicate.
4. **#145 [O+N] — Squishy economy v2** (+50 zone-unlocked squishies → store). The big engagement feature; depends on the
   merged #124 split. **Inferred decisions (Trinity, see the issue comment):** cadence ~3/zone early → ~4 later (rarity
   climbs deep in, ~50 across ~15 zones); rarity = common/rare/epic with the cost ladder extended 10→~400 (always
   achievable, always something to want); **buy-only** (the unlock + "new in store!" card IS the instant reward — no free
   drop); chest still drops a squishy **rarely (~2–3/act, unlocked pool only)**. Oracle stages the 50 PNGs (logic can ship
   with the gate inert until art lands); Neo builds the catalog + unlock-gating + the end-of-zone card.
5. **#60 [O] — Ally face-tokens → painted raster** (cheer pops / league shelf / win mini-face). Cosmetic consistency.
6. **#36 / #37 [O] — Cinematic cutscene pass / portal AI-video spike. DEFERRED — the parent is doing the portal VIDEO
   himself,** so these stay low/optional (ship only if Oracle has spare cycles + it clears §20; SVG fallback stays).

> **The one "finish v1" item that's the PARENT's, not the crew's:** record the **letter-sound phonemes + the new friends'
> voices** in the Voice Studio (TTS can't make a clean schwa-free phoneme — the most pedagogically critical audio). This is
> the main gap between "works great" and "fully finished." Engineering can't close it; recording can.

## 📥 TRIAGE — candidates awaiting the parent's call
*(empty — the 06-17 batch is dispositioned; the research backlog below is parked, not yet filed.)*

## 🅿️ PARKED — research-derived ideas, not yet filed (candidates for after the 7 land)
More autonomy/choice · within-mission micro-progress + endowed head-start · avatar/Base ownership · returning warm
characters greet-by-name · anticipation juice + named praise · cumulative (never consecutive) day-count. Do-not-build list
+ full evidence in `ENGAGEMENT-RESEARCH.md`.

## 🔨 BUILDING — has an open PR
*(none open right now. Babysit posture: Trinity watches the `morpheus/*` + `oracle/*` + `fix/*` + `feat/*` branches and
gates/coordinates any PR the moment it opens, drives it to merged.)*

## ✓ DONE (today's merge train — verified against live Issues, 2026-06-17)
**The app is content-complete + stable + live.** Objective #1 (Teddy learns to read) — full TEKS Grade-2 ladder, Act 1+2 —
is **DONE**. Today merged: collection cards #124/#126 · Hero-Base lair-growth #123 · Training-Room redesign #125 · XP rank
meter #131/#137/#140 · FTUE first-time flow #130/#138 + beatIn transitions #132 · de-emoji pass #116 + full-scan guard
#117 + remaining chrome #104 · WebKit card-flip #136 · ghost-button unify #148 · boot-perf #107 + Aud.pick #106 ·
playtest-docs #112 + Base-perf #113 · UI theme #31 · Hero-box #44 (de-halo) · Hero-Room redesign #33 · Training visual
#34 · the Elevation-Loop close-out (#54 Award Bar ratified · #55 Wave-1 eval) · #35 mouth-art · #38 map-allies-grounded ·
#39 §20 render-gate catch-up · #151 uncertain-bonus reward · the engagement research #154 + Trinity's friend-voices/learn-declutter #147.
*(Disposition recorded for everything dropped from the active board — all CLOSED/merged 2026-06-17, verified against live Issues; Codex #157 catch. ⚠ `ELEVATION-LOOP.md` + `QA.md` still reference some of these as active → a prose drift-reconcile is queued, low priority.)*
**Earlier:** the full code sweep #81–88 · parent deep-dive #71–75 · roster #110 + training-lines #111 · painted icon set
#103/#109 · nav overhaul · #105 re-apply. *(History in git + `QA.md`.)*

— Trinity, 2026-06-17
