# QA.md — External Review Notes for Super Teddy

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
