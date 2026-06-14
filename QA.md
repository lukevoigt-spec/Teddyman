# QA.md — External Review Notes for Super Teddy

---

## ⭐ CURRENT LIVE STATE & HANDOFF — 2026-06-14 (read this first)

This is the active working context so any instance (cloud OR the parent's local desktop) can
pick up. Historical review notes are preserved below. CLAUDE.md remains the source of truth;
this is the "what we're doing right now" index.

### The big shift: we can now SEE the art (render/verify loop)
- **NEW `tools/` dev harness** (gitignored at runtime, never ships):
  - `tools/svg-shot.mjs` — rasterize any `art.js` SVG expression (or `--cast` contact sheet) to
    PNG via `@resvg/resvg-js`. **Works in the cloud** (npm registry reachable). VERIFIED.
    Use it to self-check EVERY art change instead of working blind: e.g.
    `node tools/svg-shot.mjs "dragonSVG(200)" d.png` then Read the PNG.
  - `tools/shot.mjs` — screenshots the **real game** in Chromium **and WebKit (Safari ≈ iPad)**,
    serving over http + driving the game's own nav fns. **Local desktop only** (Chromium
    download is firewalled in the cloud env).
  - `tools/gen.mjs` — generate character art from a prompt via `XAI_API_KEY` or `OPENAI_API_KEY`
    → `art/incoming/`. Local only; keys never committed.
  - `tools/README.md` = setup. `art/CHARACTER-ART-PROMPTS.md` = house style + per-character
    generation prompts (the "generated heroes" pipeline).
- **Workflow for art:** edit `art.js` → render with `svg-shot.mjs` → Read the PNG → iterate →
  commit. On the desktop, also `shot.mjs` for full composed screens. The parent can run the
  harness and share PNGs back if the working instance is the cloud one.

### Decisions locked with the parent (2026-06-14)
1. **Art direction = "sweep + generated heroes".** (a) Apply a premium *shading pass* to the whole
   cast in-SVG (form-shadow/volume, ambient occlusion, rim light, scene under-glow, deeper
   gradients, catchlights — see the dragon for the reference technique), AND (b) pursue
   GENERATED RASTER art for marquee likenesses (Teddy + real family) via ChatGPT Pro / Grok
   (the parent has both) — Claude masks/frames/animates + wires them in, then render-verifies.
2. **Pacing = full re-tune** (it was heavily front-loaded). DONE: muscle curve now act-relative
   (tier1 ~28%, tier2 ~60% of the act) instead of maxing at 7 of ~53 missions. STILL TO PROPOSE
   (parent wants specifics before save-affecting changes): spread GEAR unlocks (belt/boots/
   hammer/sword all land in the first ~8 missions today) and FRIEND-RESCUE timing (most friends
   free in the first ~17 missions, then a drought to the finale) across the whole campaign.
3. **Desktop infra:** parent is setting up a Windows 11 Pro box with Claude Code + Node + the
   tools harness; use **same-dir** (not worktree) for our serialized single-branch workflow.
   Image-gen path depends on GPU: NVIDIA 8GB+ → local ComfyUI; else → Grok/OpenAI API via gen.mjs.

### Shipped this session (all live on main)
- Hero cards: real-life outfits (Ellie gymnast / Amelia dress / Leighton flowery princess /
  Archie sporty + shaggier hair); allies speak a signature line when tapped.
- New equippable **weapons**: Lasso + Gem Bow (Act 1), War Mace + Joust Lance (Act 2), unlocked
  off existing milestone gear (no new save ids). `WEAPONS[]`/`ownedWeapons()` in game.js.
- Villain polish: fierier auras; dragon aura blue→fire; removed Lord Vex's stray "?" marks;
  **dragon elevated** with the full shading pass (proof technique).
- **Settings overhaul**: game-like Grown-Up Corner — icon tabs/headers, sliding On/Off SWITCHES
  (sfx/music), a 3-way SEGMENTED Full|Calm|Lite picker, polished cards/sliders.
- **Test hardening**: curriculum.test.js now 35 checks incl. lock-enforcement (mapPaintSVG marks
  future zones .locked + skip-via-tamper guard). save.test.js 33.
- Earlier: time-portal cutscene, combo-lock fix, button fill-clip fix.

### Next actions (priority order)
1. Continue the **shading-pass sweep**: Vixen + Lord Vex (match the dragon), then the four family
   bodies + `allyFace`. Render-verify each with `svg-shot.mjs`; send the parent a fresh cast sheet.
2. Get a **real-game screenshot** pass on the desktop (`node tools/shot.mjs` + `--webkit`) — first
   look at composed screens; QA layout/Safari issues.
3. Draft the **gear + friend-rescue pacing** re-tune for parent approval (save-safe: derived from
   done missions; reassigns GEAR_AT keys + ally rescue missions, no id renumbering).
4. First **generated-hero** test (Vixen or Teddy) once the gen path is set.

### Guardrails (unchanged)
- `node tests/curriculum.test.js` + `node tests/save.test.js` must pass before any push (exit 0).
- Never push broken code (auto-deploys to the child's iPad within minutes). Small, plain-English
  commits. Develop on the feature branch, fast-forward main, deploy.
- API keys / tokens NEVER committed (`.env`, `art/incoming/`, `tools/node_modules` gitignored).

---

## 🔍 CODE-REVIEW FINDINGS — verified by Claude 2026-06-14 (for the coding agent)

An external review raised 5 findings. I checked each against the actual code. **4 are real and
worth fixing; 1 is already handled.** Evidence (file:line) + recommended fix below. Any fix must
keep `node tests/save.test.js` + `node tests/curriculum.test.js` green; #2 and #3 warrant new tests.

**1. Cloud saves are world-readable/writable — CONFIRMED (serious).**
Evidence: `state-save.js:29` bakes the Worker URL into this PUBLIC repo; `:36` `CLOUD_PASSPHRASE=""`;
`:39` `cloudKey()` returns the bare profile id (e.g. `teddy`); `cloud/worker.js:11–26` does
`Access-Control-Allow-Origin:*` + unauthenticated GET/PUT keyed only by `?k=`. So anyone can read,
overwrite, or wipe his save at `…workers.dev?k=teddy`, and profile names may be real kids' names.
→ **Fix nuance:** committing a value into `CLOUD_PASSPHRASE` does NOT help — it's in public client
code, so the hash is trivially recomputed. The real fix is a **parent-entered runtime secret** (stored
in localStorage, never committed) used to derive the slot key AND validated **Worker-side** (a token
the Worker checks). Minimum viable: make cloud opt-in (drop the baked URL) or add Worker auth. This is
a known documented tradeoff in CLAUDE.md, but the parent should decide explicitly.

**2. Reset / Level-0 resurrects old progress — CONFIRMED (real bug).**
Evidence: `load()` picks whichever copy has MORE progress (`state-save.js:81–82`); `save()` always
writes primary (`:87`) but mirrors to backup ONLY when `hasProgress(S)` (`:89`). The reset button
(`game.js:1465`) and the Level-0 slider path (`game.js:1402–03`) do `S=fresh(); save()`, so the
**empty primary is written but the old backup is left intact** → on next `load()` the backup outscores
the empty primary and the old save returns, silently defeating the reset.
→ **Fix:** add an intentional-reset path that snapshots (already done) then explicitly clears/tombstones
the backup, e.g. `localStorage.removeItem(BAKKEY)` (keep SNAPKEY for undo) so a deliberate fresh start
can't be resurrected. Add a save.test case ("reset is not undone by the backup on reload").

**3. Act-2 mastery remediation targets unsupported magic-e keys — CONFIRMED (real bug).**
Evidence: `actGraphemes()` in Act 2 includes `taughtMagicE()` → `a_e/i_e/o_e/u_e` (`game.js:506`,
units at `:45`); `coreWeak()` filters those for finales (`:156`); `masteryReview()` feeds the weak list
straight into `startFind()` (`:557–559`), which plays `"snd_"+g` and shows a gem tile (`:619`). There is
**no `snd_a_e/i_e/o_e/u_e` clip anywhere** (0 matches in data-lines.js + voicepack.js; digraphs/vowel-teams
DO have clips). So a child weak on magic-e at the gate gets a silent/garbled "find the gem" round with a
nonsensical `a_e` tile — and magic-e is a *split* grapheme that should never be a single sound-ID gem.
→ **Fix:** exclude magic-e units (and any grapheme lacking a `snd_` clip) from the sound-ID review;
route magic-e weaknesses to `startMagic` (re-teach the unit) or a forge/read round with a magic-e word.
Also audit find/boss foil pools so `a_e`-type units can never surface as gem tiles. Add a curriculum.test
guard ("every grapheme reachable by masteryReview/startFind has a snd_ clip").

**4. "Turn off cloud sync" doesn't survive reload — CONFIRMED (real bug).**
Evidence: the off button only removes `teddyCloudURL` (`game.js:1442`), but boot re-applies the baked
default whenever that key is empty (`state-save.js:105`). So after the next reload, sync silently turns
back on.
→ **Fix:** persist an explicit disabled state — store a sentinel (e.g. `teddyCloudURL="off"` or a
separate `teddyCloudOff` flag) and skip `DEFAULT_CLOUD_URL` at boot when it's set. (Ties into #1.)

**5. Locked capes are clickable — REJECTED (already handled).**
The reviewer flagged that the cape `onclick` has no locked guard (`game.js` capeRow) — true of the JS, but
`styles.css:311` sets `.echip.lockd{opacity:.4;pointer-events:none;}`, so a locked cape can't be tapped on
iPad Safari. Not a live bug. *Optional* defense-in-depth: add an early `return` in the handler when locked
(belt-and-suspenders), but no user-facing issue exists today.

**Priority for the coding agent:** #2 and #3 first (they silently hurt the child's experience and are
fully in-code), then #4 (small), then #1 (a product/security decision the parent should weigh in on —
flag it, propose the parent-entered-secret approach, don't bake another public secret).

---

**Test commit by Grok (xAI):** Write access verified successfully! Added this line on 2026-06-13.

## 2026-06-13 Grok (xAI) Review — Latest Main (commit 060066c)

**Validation:** Refreshed via GitHub tools. Current HEAD on main is 060066c (my test commit). File listing and key files (CLAUDE.md, index.html, game.js partial + modules) confirmed up-to-date. Modular split advanced; Act 2 complete through Dragon Keep + sentence fluency. Many prior QA items addressed (daily.missions firstTime guard, profile escaping, level override safety, etc.). No stale feedback.

### Bugs / Risks Identified
- None critical in core flows (audio flow/watchdog, save migration, mastery gates, anti-gaming all appear solid and guarded).
- Minor: trainTick relies on document.hidden + lastInteract; iOS Safari backgrounding edge cases could undercount slightly (acceptable for gentle meter).
- Cloud default (bare profile ID) is family-safe but public Worker URL remains a theoretical exposure vector until passphrase is enabled on all devices.
- Classic script load order (index.html) is fragile for future additions — a load-order smoke test (as suggested in prior QA) would harden it.

### Optimizations
- game.js still holds the bulk of mission handlers (forge/read/spell/etc.) + boot/title/win logic. Next logical split: extract data-driven mission dispatchers or a mission-handlers.js to further reduce coupling and improve testability.
- voicepack.js (27MB) is optional but large; consider lazy-loading or separate PWA asset strategy for faster initial loads on older iPads.
- Random in victory poses / foils / patrols: add optional seeded rand() wrapper for deterministic tests/debug without changing prod behavior.
- Large template SVG strings in art.js: performant for no-build but hard to diff/review — small DOM helpers or shared defs could help future art work.

### Suggested Ideas & Enhancements
1. **Post-Act-2 Maintenance Loop (high value)**: After Dragon Keep, add a daily "Hero Patrol" that mixes weakest items from both acts (retention focus). Keeps the app useful long-term without new content bloat. Gate behind Act-2 completion flag.
2. **Audio Workflow Polish**: Parent flagged this; streamline record → preview → keep/re-record → publish flow in Voice Studio. Add progress dashboard for phoneme coverage %.
3. **Settings / Grown-Up Corner Overhaul**: Current tabbed panel is functional but not game-like. Study real kids' apps (e.g., intuitive sliders, big cards, visual previews). Add "parent quick actions" (reset profile with confirmation, export full progress).
4. **iPad-Specific QA Harness**: Add automated or checklist tests for: Home Screen install, offline launch + first audio tap, background/foreground audio ducking, service-worker update after deploy, Full/Calm/Lite visual parity on real device, cloud restore across profiles.
5. **More Invariant Tests**: Expand curriculum.test.js with locked-node enforcement, sound-ID prompt never shows target grapheme, Training Room time only counts during active scrTrain, profile-name escaping (already good but expand), cloud newer-wins.
6. **Visual/Art Next Wins**: Since foreground integration and medieval skin are live, next could be random hero win-pose variations (already partial) or subtle mouth bob on mentors during narration (faceSpeak is there — extend to more characters if art supports).
7. **Parent Progress Visibility**: Enhance Progress tab with "what Teddy can actually read now" summary (decodable sentences mastered, fluency metrics) + simple export for teachers/therapists.
8. **Diegetic Navigation Polish**: The new city-name tap menu is good; consider adding a persistent "quick nav" or making Hero Base reachable from more places without leaving the flow.

**Recommendation for Claude/Next Agent**: Prioritize 1 (maintenance loop) + 2 (audio workflow) + expanding tests before new content. The app is in excellent shape — focus on polish, retention, and parent ergonomics. All changes must pass node tests/save.test.js + curriculum.test.js + runtime boot check.

---

[Previous short test content and full git history preserved below for reference. The full prior QA review sections are in git history at previous commits.]

**Test commit by Grok (xAI):** Write access verified successfully! Added this line on 2026-06-13.

[Rest of file content preserved; full history in Git.]

## 2026-06-13 Latest Main Studio-Polish Review — Based on `6ed8c7b`

### Review context

- I reset the workspace to the current `origin/main` before reviewing, and the latest fetched `origin/main` after rebase was `6ed8c7b`, which includes `be3d032` (`Update voicepack.js from in-app studio (392 voices)`) plus the Boss Trophy Cages/Hero Base updates.
- I read the current project guidance docs (`CLAUDE.md`, `STYLE.md`, `teddy-reading-app-spec.md`, and the existing `QA.md`) before reviewing the latest code shape.
- This section is appended only; it intentionally does not overwrite the existing Grok/agent notes above.

### What is materially stronger on latest main

1. **Voice/audio-first experience is much closer to the mission.** The checked-in `voicepack.js` now contains a large generated pack, and the recent chained-audio fix makes the first run less likely to drop sequential clips after iPad unlock. That is a major practical improvement for a child-facing reading game.
2. **The game now feels more like a place, not just a drill screen.** Hero Cards, rescued-friend voices, the Hero Base/menu work, boss trophy cages, richer map art, and committed BGM/SFX files all push the app toward a coherent studio-like loop.
3. **The stale-deploy problem is being addressed.** The service worker cache version is bumped and its fetch path now prefers fresh network responses, which should reduce the “why am I seeing the old build?” confusion that has affected agent review.
4. **The modular split is paying off.** The current data/audio/map/save split makes it easier to inspect individual systems and gives future agents smaller, safer surfaces to change.
5. **The in-app studio/publish flow is becoming a real production pipeline.** The Audio Studio + GitHub publish path is the right direction for a one-person “mini studio” workflow where content can be recorded, reviewed, exported, and shipped quickly.

### Suggested bug fixes / risk reductions

These are suggestions, not mandates.

1. **Expand CI syntax coverage beyond root JavaScript files.** The workflow currently checks root `*.js`, but a safer command would also cover `cloud/worker.js`, `tests/*.js`, and any future nested JS modules. Suggested pattern: `find . -name '*.js' -not -path './node_modules/*' -print0 | xargs -0 -n1 node --check`.
2. **Add a storage/performance budget around `voicepack.js`.** The current generated voice pack is large enough to be a real iPad load/update consideration. Keep the audio-first mission, but consider splitting voices by category/act, lazy-loading non-critical clips, or generating a “core boot pack” plus optional packs.
3. **Document the cloud passphrase state.** The code now exposes a `CLOUD_PASSPHRASE` configuration point, while the cloud README still reads like passphrase support is future work. Align the docs so future agents know whether the feature is live, optional, or intentionally disabled.
4. **Treat the Audio Studio GitHub token as sensitive parent-only state.** Remembering the token in localStorage is convenient, but it should have a clear “clear token/revoke reminder” affordance and parent-facing warning because this app may run on a shared iPad.
5. **Add visual smoke checks for the most important screens.** The CI now catches curriculum/save and parse regressions, but not “studio feel” regressions. A simple browser screenshot pass for title, map, mission, Hero Base, Audio Studio, and Hero Card states would catch many accidental CSS/SVG breaks.
6. **Test Hero Cards and overlays with audio in progress.** Verify tapping a rescued friend, closing the full-body card, navigating home/base/map, and replaying audio do not interrupt each other in surprising ways on iPad Safari.
7. **Define the post-Act-2 end state.** The current experience is rich enough that a weak ending would stand out. Decide whether Dragon Keep unlocks a “completed kingdom” loop, an Act-3 teaser, a free-play reading patrol, or a parent-only maintenance/review mode.
8. **Keep `QA.md` append-only, but add a short current-priorities index if the team wants it.** The file has been compacted by other agents, which is okay, but future agents may benefit from a short top or bottom “current live priorities” list so they do not chase older stale notes.

### Enhancement ideas to make it feel more game-studio-built

1. **Daily Hero Patrol:** a gentle replay loop that recommends 3–5 short quests from weak sounds, recent misses, and favorite story beats without adding punishment or streak pressure.
2. **Living Kingdom Map:** after each rescued friend, update the map with a visible restored landmark, ambient animation, and a short spoken thank-you line.
3. **Audio Coverage Dashboard:** in the parent/studio area, show coverage for phonemes, sight words, mission lines, friend lines, and story moments so recording priorities are obvious.
4. **Chapter title cards and mini cutscenes:** add brief animated title cards for Act transitions, boss reveals, rescued-friend moments, and Dragon Keep completion.
5. **Hero Base as the main hub:** make Hero Base feel like Teddy’s clubhouse with the quest board, friend cards, recording booth/radio room, map table, trophies, and parent controls.
6. **Friend postcard collection:** each rescued friend unlocks a postcard/card with a custom voice line, their reading superpower, and one replayable mini challenge.
7. **Parent “teacher handoff” export:** generate a concise progress report with mastered words, shaky graphemes, favorite rewards, and suggested next practice.
8. **Performance badge in parent mode:** show app version, cache version, voicepack size/date, last publish commit, and whether the build is fresh from network or service worker cache.
9. **Replayable boss remixes:** once an act is cleared, allow short remixed boss encounters that target current weak items while using already-loved villains/animations.
10. **Consistent studio art bible:** add a small gallery/spec for SVG proportions, shadows, animation timing, color palettes, and reduced-motion expectations so future agents don’t drift visually.

### Queries for the coding agent / product owner

1. Should the large `voicepack.js` remain a single generated file for simplicity, or should the studio start outputting a core pack plus lazy optional packs?
2. Should the GitHub publish token be stored only per session, or is localStorage acceptable if the UI clearly labels it as a parent-only publishing tool?
3. Is Act 2 intended to be the final complete game loop for now, or should the code start preparing for Act 3 hooks?
4. Do we want the cloud passphrase enabled in production now, or only documented as an optional deployment hardening step?
5. Should `QA.md` keep accumulating long-form agent review notes, or should we add a short “current priorities” summary that future agents update while preserving all historical sections below?
