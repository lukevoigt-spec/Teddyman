# KANBAN.md — the live work board (Trinity-maintained)

> The single view of **what's being built and what's queued.** **Trinity keeps this current every turn.** The parent does
> NOT edit it — he steers by answering Trinity's triage questions (`AskUserQuestion`); Trinity moves the cards. Each card =
> a GitHub Issue (`#N`); specs live in the linked docs. Owner: **[N]** = Neo · **[O]** = The Oracle.
> *(GitHub Projects can't be API-driven from here, so this markdown file is the canonical board.)* — **reconciled to live Issues after the 2026-06-17 merge train (Trinity).**

## 📥 TRIAGE — candidates awaiting the parent's call
*(empty)*

## 🏆 ELEVATION LOOP — "make it award-winning & beautiful" (`ELEVATION-LOOP.md`, active)
Award Bar rubric **v1 synthesized** (14 criteria, 5-stream research review). Wave-by-wave:
- **#54 [O]** Ratify the Award Bar into `STYLE.md §20` (Oracle adjusts + owns).
- **#55 [O+N]** **Wave 1 eval** — score Title · World Map · a learning prompt · Win against the bar → gap lists in `DESIGN-REVIEW.md` → per-fix slices. *(Wave 2 = Base/Training/Shop · Wave 3 = cutscenes/settings/transitions.)*

## ✅ APPROVED — build now (open GitHub Issues, all Oracle-led)
**Parent-requested 2026-06-17 (the collection-card system — build #124 first, it's the shared pattern):**
- **#124 [O+N]** Squishy STORE/COLLECTION split — owned display-case with faint slots + duplicate count badge (needs `S.owned` boolean→count migration) + a painted shopping-cart button → buy view.
- **#126 [O+N]** Gems + Villains COLLECTION CARDS — tap the gem/villain shelf → a card of the whole set, same pattern as #124 (one shared system). Gems folds into #33's gem-dex.
- **#127 [N+O]** Treasure box POPS at the end of the level earned — surface the earned chest on the WIN screen as a tap-to-open card (reuses `openChest`), not buried in the Squishy menu. Mostly Neo surfacing + Oracle card art.
- **#145 [O+N]** Squishy economy v2 — +50 zone-unlocked squishies that populate the store (instant reward + "rarer" items deep into the game). Unlock derived from `zoneDone`; end-of-zone "new in store!" card (reuses #127). Chest drops a squishy RARELY (~2–3/act, from the unlocked pool). Builds on #124.

**Engagement research (parent-commissioned 2026-06-17 → `ENGAGEMENT-RESEARCH.md`; parent greenlit the top 3):**
- **#151 [N]** Uncertain-BONUS reward (~50/50 extra, base always certain) — the dopamine + memory lever (Howard-Jones/Bristol). Highest learning-ROI, small change. *(build-now)*
- **#152 [O+N]** Collection-as-mastery counter ("N/26 gems mastered" on home/map + Zeigarnik reachable-gap) — the #1 daily-return hook; mastery-gated. Overlaps #126/#33.
- **#153 [N]** Anti-gaming WITHOUT punishment — response-time re-lock + reward-the-correct-path (the evidence-based replacement for the parent's "villain HP up on wrong"; that's a loss state we don't ship). *(build-now)*
- *Research backlog (not yet filed — candidates for later): more autonomy/choice · within-mission micro-progress + endowed head-start · avatar/Base ownership · returning warm characters greet-by-name · anticipation juice + named praise · cumulative (never consecutive) day-count. Do-not-build list captured in the doc.*

**The big redesigns (AGENTS rule 8: `[O]` designs+art+gates · `[N]` implements · `[O]` `§20 PASS` · `[N]` merges):**
- **#104 [O+N]** De-emoji the REMAINING child chrome — #116 cleared the Vault/Scroll/Warm-Up titles + combo/vault glyphs (crafted icons); still open: win/rest buttons, map ✓, other rendered glyphs. (The #102 full-scan guard is now live to catch new ones.)
- **#33 [O+N]** Hero Room plinth-first redesign — *shell (#52) + lair-growth/aliveness (#123) shipped*; remaining = tap→card overlays, gem-dex %, room-grows-with-mastery (overlaps #126).
- **#34 [O+N]** Training Room VISUAL redesign — *treasure-vault redesign (#125) shipped*; remaining = the full Premium-Bar visual pass.
- **#31 [O+N]** UI theme coherence — standardize every screen to the painted backgrounds. *(Title stays as-is.)*
- **#44 [O]** Title-screen hero box on iPad — nudge down + kill the clipped-glow rect *(WebKit-verify).*
- **#60 [O]** Ally FACE-tokens → painted raster (cheer pops, league thumbs, win mini-face).

## 🔨 BUILDING — has an open PR
*(none open. Monitoring posture: Trinity gates any guest/Oracle PR the moment it opens.)*

## 🅿️ DEFERRED — approved-someday, not active
- **#38 [O]** Map allies — grounding partly done (#105); remaining = new `allyBody` art + contact shadow on the legacy layout.
- **#39 [O]** §20 render-gate catch-up on new Act-2 systems + the calm-prompt check.
- **#35 [O]** Mouth art on the big cutscene portraits (driver already shipped).
- **#36 [O]** Cinematic SVG cutscene pass (beats 2–6). *(Tension with parent doing portal video — revisit.)*
- **#37 [O]** Portal AI-video spike *(optional, render-gated, SVG fallback).*

## ✓ DONE (recent — verified against live Issues + git, 2026-06-17)
**Today's merge train (all live on `main`):**
- **#118** — #110 Act-2 roster reconcile + #111 training-line process-praise fix + the playtest fixes (fortMaze reads the sentence on autoplay; daily-goal deferred out of missions to a calm hub). *(Trinity, rebased.)*
- **#117** — #102 ui-emoji guard ratchet → full child-facing scan. · **#116** — de-emoji pass (crafted flame/spark icons + title ids).
- **#125** — Training Room treasure-vault redesign (advances #34). · **#123** — Hero Base lair-growth & aliveness (advances #33).
- **#114/#115** — #107 boot-perf (voicepack defer + BGM metadata) + #106 Aud.pick guard. · **#121** — #112 playtest-docs align. · **#122** — #113 Hero Base art-burst/404.
**Reading (objective #1): full TEKS Grade-2 ladder complete, Act 1 + Act 2 content-complete.**
**Earlier 06-16/17:** painted icon set #103/#109 · premium 9-slice buttons #108 · code sweep #81–#88 · deep-dive bugs #71–#75 · treasure chest #90 · nav overhaul (4-corner, single-PLAY, HUD-hide) · #105 re-apply (map grounding, villain repaints, Cal) · closed #96 (superseded).

> History in git + `QA.md`. **Caught this session:** #23 was closed-but-never-shipped → re-filed #111 (now live).
