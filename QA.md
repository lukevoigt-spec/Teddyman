# QA.md — External Review Notes for Super Teddy

This file captures periodic outside-review guidance that a future dev agent can consult alongside `CLAUDE.md`, `STYLE.md`, and `teddy-reading-app-spec.md`.

**Authority note:** This file is advisory. If it conflicts with `CLAUDE.md`, `STYLE.md`, the app spec, or direct parent instructions, those sources win.

---

## 2026-06-13 Review — Objective, Architecture, Visual Polish

### Overall status

Super Teddy is well beyond a prototype. The project has a clear learning objective, a strong child-specific design thesis, a static-site architecture that fits GitHub Pages/iPad deployment, and a rich curriculum progression already implemented.

The biggest current risk is not product direction; it is maintainability and visual cohesion. The implementation has grown into a large feature set, while much of the runtime still lives in `game.js`. The visual layer has also advanced unevenly: the painted backgrounds are higher quality than some of the foreground UI/character/map layers, which can make the app feel more amateurish than the underlying product really is.

---

## Objective Review

The objective is unusually clear: this is not a generic literacy app, but a personalized iPad web game to teach Teddy to read through systematic synthetic phonics wrapped in a superhero adventure.

Strong points:

- The audience and deployment model are clear: GitHub Pages, iPad home-screen use, non-developer parent workflow.
- The hard constraints are well-articulated: no punitive timers, no harsh failure states, audio-first prompts, large touch targets, save safety, and strict anti-gaming rules for sound-identification tasks.
- The child-specific profile is useful and concrete: ADHD-friendly energy, collections as motivating, superhero/Minecraft/friends/family hooks, and Orton-Gillingham-style multi-sensory repetition.
- The curriculum has moved from letters/sounds into actual reading: decode direction, sight/heart words, decodable sentences, cloze/maze-style practice, and sentence ordering.

Assessment: **excellent objective clarity**.

---

## Pedagogy Review

The strongest pedagogical decision is recognizing the difference between:

1. sound → letter identification,
2. hearing a word → building/spelling it, and
3. letter → sound → blend → meaning, which is actual reading.

The app now implements reading-direction tasks through Read It, Story Gate, Reading Dojo, and the Fortress finale. This is a major improvement over a game that only trains sound identification or spelling.

Strong points:

- Sound-ID prompts correctly avoid showing the target grapheme; the audio carries the target.
- Sight words are treated through a heart-word/sound-mapping model rather than pure whole-word guessing.
- Milestone completion is gated on mastery rather than mere exposure, while still being supportive and non-punitive.
- Act 2 digraph and magic-e support is thoughtful: digraphs are treated as one grapheme/one sound, while magic-e is handled as a rule without forcing discontinuous tokenization.

Risks to watch:

- Act 2 can easily become too broad if digraphs, blends, magic-e, vowel teams, fluency, and sentence mechanics are expanded too quickly.
- Sentence-scramble mechanics are useful after decoding is stable, but should not substitute for reading-for-meaning practice.
- New content needs automated curriculum-invariant tests so future additions do not accidentally introduce untaught letters/graphemes.

Assessment: **strong pedagogy; keep sequencing disciplined**.

---

## Architecture Review

The current static architecture is appropriate for this app. A no-build HTML/CSS/JS site is a good fit for GitHub Pages and for a parent who needs every commit to be deployable without a build pipeline.

Strong points:

- `index.html`, `styles.css`, `game.js`, `art.js`, audio tooling, and the Cloudflare Worker are understandable as a static app structure.
- The painted-background layer is already implemented and supports per-screen and per-act backgrounds.
- The act/zone/mission model is increasingly data-driven.
- Save/profile/cloud logic is unusually robust for a small static app.
- Existing save regression tests are valuable and should be preserved.

Main risk:

- `game.js` is carrying curriculum data, state, save/cloud sync, audio flow, map rendering, UI flow, mission mechanics, mastery logic, base/shop systems, and more. It is still navigable, but future expansion will increase coupling and regression risk.

Recommended eventual no-build split:

- `data-missions.js`
- `data-lines.js`
- `state-save.js`
- `audio.js`
- `map.js`
- `mission-find.js`
- `mission-forge.js`
- `mission-read.js`
- `mission-spell.js`
- `mission-magic.js`
- `base-shop.js`

This can be done with plain `<script>` tags and no build step.

Assessment: **architecture is appropriate, but `game.js` is approaching modularization pressure**.

---

## Visual / Art Direction Review

The app can look much more beautiful with the current architecture. This is **not** primarily a technical limitation.

The main visual issue is foreground/background mismatch:

- The painted backgrounds are rich and atmospheric.
- Some foreground UI, characters, tiles, and map elements still read as prototype-like or web-control-like.
- The app needs a deliberate visual unification pass so foreground objects feel like they belong in the painted scenes.

### Is this a big hill?

Not technically. The app already has:

- a dedicated `#bgLayer`,
- screen-to-background slot mapping,
- Act 2 background fallback support,
- centralized CSS tokens,
- a design-system document,
- no-build compatibility.

It is a medium **art-direction** hill, not a large engineering hill.

### Recommended visual strategy

Do a focused **Premium Foreground Integration** pass before adding much more visual complexity.

Goals:

1. Make foreground elements feel grounded in the backgrounds.
2. Keep all literacy content clear, high-contrast, large, and Andika-based.
3. Avoid random one-off styling; create reusable screen composition patterns.
4. Preserve the no-build static architecture.

Suggested steps:

#### 1. Strengthen global scene grading

Add consistent cinematic overlays:

- edge vignette,
- lower-third darkening where buttons sit,
- per-act color grading,
- soft focal glow behind learning content,
- battle/rest/learn-specific atmosphere.

Premium games rarely place raw UI on raw art; they grade the scene so the foreground reads.

#### 2. Create screen composition templates

Define reusable composition classes such as:

- `.screen-title`
- `.screen-learn`
- `.screen-choice`
- `.screen-battle`
- `.screen-victory`
- `.screen-parent`

Each should specify where the bubble, hero/enemy, tiles, and CTA controls live. This will make screens look intentionally composed rather than like centered web layouts over a picture.

#### 3. Make UI elements feel like game objects

For Act 1, lean into:

- hero chrome,
- gem glass,
- energy panels,
- dark purple glass HUD,
- gold comic borders.

For Act 2, add a proper medieval/fantasy skin:

- parchment panels,
- stone/iron borders,
- torchlight glows,
- heraldic banners,
- wax-seal reward badges.

Use a body/stage theme hook such as `body[data-act="2"]` or `#stage.theme-medieval`, while leaving `.read` / Andika literacy content untouched.

#### 4. Upgrade character integration

The backgrounds are painterly; simple vector characters can feel sticker-like unless they get:

- richer silhouettes,
- better shading,
- rim light,
- scene-matched glow,
- ground shadows,
- more expressive poses,
- consistent scale.

Recommended approach: hybrid.

- Keep SVG for UI, tiles, gems, and simple props.
- Upgrade key hero/villain/ally poses either as better SVGs or transparent WebP cutouts.
- Prioritize title hero, battle enemy, victory hero, Noah, Vixen/dragon, and major allies.

#### 5. Keep learning tiles beautiful but pedagogically clean

The tile/container can become gem-like and premium, but the grapheme itself should remain plain, large, Andika, and high-contrast.

Good tile improvements:

- gem/crystal frame,
- subtle inner glow,
- beveled border,
- stronger grounding shadow,
- clean solid letter area.

Avoid:

- decorative letterforms,
- noisy textures behind letters,
- lower contrast,
- adding target letters to sound-ID prompt text.

#### 6. Treat the map as a separate polish problem

The map screen is partly procedural/SVG and will not automatically benefit from background image improvements. It needs either:

- a heavier SVG map polish pass, or
- a painted map background with path/nodes/hero marker overlaid.

Fast path: polish current SVG map chrome.

Premium path: painted map plus overlay nodes.

---

## Recommended Development Roadmap

### Near-term

1. Add curriculum-invariant tests before expanding Act 2 much further.
2. Reconcile stale comments/spec drift, especially where comments say Act 2 is only a frame even though content exists.
3. Do a Premium Foreground Integration CSS/composition pass.
4. Take before/after screenshots on the target iPad.

### Medium-term

1. Add Act 2 medieval theme chrome.
2. Improve or replace key character poses.
3. Add cloud-save passphrase/key hardening if cross-device sync remains important.
4. Split `game.js` into no-build modules once tests protect behavior.

### Longer-term

1. Premium map pass.
2. More Act 2 content after invariant tests are in place.
3. More parent progress visibility around decoding/fluency, not just mission completion.

---

## Suggested Automated Tests to Add

The save tests are good. Add tests for curriculum and app invariants:

- Mission IDs are unique.
- Act ID ranges do not collide.
- Every mission type has a handler.
- Every mission references an existing zone.
- No mission uses untaught letters/graphemes.
- Act 1 non-sight decodable words do not accidentally contain digraph sequences.
- Magic-e detection returns null for non-magic-e words.
- Sound-ID prompt text does not include the target grapheme.
- Locked map nodes cannot start missions.
- Audio line IDs either exist or have acceptable TTS fallback.
- Save migration preserves existing progress.

---

## How to Use This File With a Dev Agent

A `QA.md` like this is a reasonable approach when the parent wants persistent advisory context without manually relaying every comment.

Recommended usage:

1. Tell the dev agent to read, in order:
   - `CLAUDE.md`
   - `STYLE.md`
   - `teddy-reading-app-spec.md`
   - `QA.md`
2. Treat `QA.md` as advisory, not binding.
3. When starting a task, quote the specific section of `QA.md` that matters.
4. Ask the dev agent to update `QA.md` only when there is a durable architectural/product decision worth preserving.

Better than using `QA.md` alone:

- For binding project rules, update `CLAUDE.md` or `STYLE.md`.
- For durable design/product observations, use `QA.md`.
- For one-off implementation tasks, create a normal issue/task prompt rather than growing `QA.md` forever.

Suggested workflow:

- `CLAUDE.md` = hard constraints and project canon.
- `STYLE.md` = visual/design-system contract.
- `teddy-reading-app-spec.md` = product/curriculum spec.
- `QA.md` = periodic external review notes and recommendations.

That keeps the parent from being the middle man while avoiding a single giant instruction file that mixes hard rules, design specs, and casual feedback.

---

## 2026-06-13 Test Edit

This is a small QA test edit to verify repository write and commit workflow.

---

## 2026-06-13 Code Review — Mission Fit, Bugs, Optimization, Next Agent Guidance

### Executive take

The app is doing the right thing for the mission: it is now a real personalized reading game, not just a demo. The strongest parts are the systematic curriculum ladder, audio-first interaction model, save hardening, profile isolation, mastery gates, and the shift toward actual decoding through Read-It, Story Gate, Dojo, magic-e, and Training Room practice.

Current risk is mostly **maintenance risk** rather than product-direction risk. `game.js` is carrying almost every responsibility, and the number of curriculum rules is now high enough that the next coding agent should prioritize invariant coverage and low-risk modular seams before adding much more Act 2 content.

### What is going well

- **Mission alignment is strong.** The core loop teaches reading as the superpower, keeps instructions audio-first, avoids punitive timers/failure states, and rewards steady mastery.
- **Pedagogy is much stronger than a typical hobby app.** The code distinguishes sound identification, encoding/building, decoding/reading, sight/heart words, cloze/maze practice, sentence ordering, digraphs, blends, and magic-e.
- **Anti-gaming constraints are mostly respected.** Sound-ID screens use generic visible prompts and rely on audio for the target sound, which prevents text-to-text matching.
- **Save safety is unusually mature.** Primary/backup local saves, migration, snapshots, profiles, and cloud sync are all present; tests cover the most important save behaviors.
- **Act architecture is workable.** Act-scoped mission ranges, per-act maps, and act-scoped gear/power reset are the right primitives for continuing the story without corrupting old progress.
- **Tests are now meaningful.** `tests/curriculum.test.js` and `tests/save.test.js` both pass and already protect high-value invariants.

### Bugs / likely bugs to address

1. **Daily mission count may overcount replayed missions.**
   - `missionComplete()` increments `S.daily.missions` on every completion, before checking whether this is a first-time mission.
   - That may be acceptable if it means "missions practiced today," but the UI copy reads like mission progress/new missions. If replaying old missions should not inflate the daily mission metric, increment only on `firstTime`, or rename the metric to "mission completions/practice rounds."

2. **Level override can rebuild gear across all acts, not just the active act.**
   - The parent slider applies completion for `playMissions(currentAct())`, then rebuilds `S.gear` from all `GEAR_AT` IDs currently done.
   - This may be fine globally, but it is worth verifying with an Act 2 save: moving within Act 2 should not accidentally strip/restore Act 1 collectibles in a confusing way. The hero display is act-scoped, but the underlying gear array is global.

3. **InnerHTML with user-entered profile names is a low-severity injection risk.**
   - Player names are parent-entered and truncated, so this is not a child-safety emergency, but `paintPlayers()` and profile-card rendering inject names through template HTML.
   - Recommendation: use `textContent` for profile names and only template trusted static/SVG markup.

4. **Cloud endpoint uses bare profile IDs as write keys.**
   - This is already documented as parked/low priority, but the baked Worker URL means anyone who knows the URL and key convention could read/write saves.
   - Recommendation: add the optional passphrase-derived key before sharing the app broadly outside the family.

5. **Spec/comment drift is starting to mislead.**
   - Some older documents/comments still describe earlier names, old architecture, or Act 2 as a frame even though Act 2 content is live.
   - Recommendation: prefer small doc cleanups whenever the coding agent touches nearby code, especially `teddy-reading-app-spec.md` and long comments in `CLAUDE.md`/`game.js`.

### Optimization / maintainability concerns

1. **`game.js` is now over the comfortable size for safe feature expansion.**
   - It contains curriculum data, state migration, cloud sync, audio, map SVG generation, mission handlers, mastery logic, shop/base UI, settings, and parent dashboard rendering.
   - This is still shippable because the app is static and tested, but the coupling cost will rise sharply with more Act 2 mechanics.
   - Recommendation: start a no-build split only after current tests stay green. Use plain `<script>` tags in dependency order; do not introduce a build step unless the parent explicitly wants one.

2. **Large SVG strings are hard to review.**
   - `mapSVG()`, hero/ally art, and base shelf rendering rely on long template strings. This is fast enough for the current app, but hard to diff and easy to break with unescaped data.
   - Recommendation: for new UI, prefer small DOM builder helpers or isolated render functions; keep data separate from markup where practical.

3. **Randomized content needs deterministic test hooks.**
   - Foil choice, weak-item selection, Training Room word choice, and map/art flourishes use `Math.random()` directly.
   - Recommendation: if bugs become hard to reproduce, add a tiny `rand()` wrapper with optional seeded mode for tests. Do not over-engineer this yet.

4. **Cloud sync is debounce-only and status-only.**
   - That is appropriate for the stakes, but the app does not visibly queue/retry beyond the next save.
   - Recommendation: if cross-device use becomes central, track `lastCloudOkTs` / `lastCloudErr` and expose it in the Backup tab so parents can know whether a device has really synced.

5. **Tests currently validate data invariants more than DOM behavior.**
   - The no-dependency VM harness is good, but important UX guarantees are still uncovered: locked nodes cannot start missions, sound-ID prompt text never contains the target, Training Room time counts, and parent override preserves profiles/saves.

### Recommended priorities for the coding agent

#### P0 — Fix / verify before adding lots of new content

1. **Add app-invariant tests for the highest-risk rules**
   - Sound-ID visible prompt does not include the target grapheme.
   - Locked map nodes cannot call `startMission()`.
   - Training Room increments `trainSecs` only when `show("scrTrain")` is active and recent interaction is present; leaving training stops `trainSecs`.
   - Parent level override does not delete profile isolation or corrupt default Teddy keys.

2. **Clarify daily metrics**
   - Decide whether `S.daily.missions` means first-time missions or all mission completions.
   - Make the variable/UI copy match that decision.

#### P1 — Small hardening / cleanup

1. Replace profile-name `innerHTML` with `textContent`.
2. Add passphrase-derived cloud keys if the public Worker URL remains baked in.
3. Add a small `escapeHTML()` helper only if template strings must contain dynamic parent-entered text; otherwise prefer DOM nodes.
4. Keep retiring emoji UI where it affects polish, but do not remove useful child-reward symbols unless there is a clear replacement.

#### P2 — Architecture before broad Act 2 expansion

1. Split data first, mechanics second:
   - `data-lines.js`
   - `data-curriculum.js`
   - `data-missions.js`
   - `state-save.js`
   - `audio.js`
   - `map.js`
2. Keep the deployed app no-build/static.
3. Run the save and curriculum tests after each split.
4. Avoid changing save keys or mission IDs during refactors.

### Suggested tests to add next

- `sound-id prompt hides target`: for `find`, `boss`, and fortress sound phases, assert visible text does not include the target grapheme or `/sound/` spelling.
- `locked node enforcement`: simulate clicking a locked `.mnode` and assert no mission starts.
- `training timer`: enter Training Room, tick with recent interaction, assert `daily.secs` and `daily.trainSecs` move; exit and assert only non-training time moves.
- `profile name escaping`: create a profile named `<img onerror=...>` and assert it renders as text, not HTML.
- `cloud newer-wins`: mock cloud payloads older/newer than local and assert only newer cloud saves replace local.
- `act 2 override safety`: with mixed Act 1/Act 2 progress, use level override and assert expected done IDs/gears remain stable.

### Product recommendations

- Keep the next learning expansion narrow. Finish and polish the current Act 2 ladder before adding vowel teams, fluency passages, or new mechanics.
- Prioritize real audio for phonemes, digraphs, magic-e long vowels, and the most common feedback lines. Audio quality matters more than more visual chrome for actual learning transfer.
- Continue improving foreground art cohesion, but do not let art work delay fixes to save safety, daily-metric clarity, or invariant tests.
- The parent/coding-agent workflow should keep using this file for durable review notes, not one-off task instructions.

### Current verification

As of this review, the existing regression checks pass:

- `node tests/curriculum.test.js` — 13 passed, 0 failed.
- `node tests/save.test.js` — 25 passed, 0 failed.

---

## 2026-06-13 SVG / CSS / Visualization Deep Dive — Suggestions, Not Mandates

### Overall assessment

The current visual approach is directionally strong for a static, no-build reading app: SVG-string character functions give the project crisp scaling, small asset footprint, easy color/theme swaps, and state-driven costumes/weapons without needing a sprite pipeline. The latest art pass also moved the characters closer to the painted backgrounds by adding gradients, specular lighting, glows, clip paths, motion, and stronger silhouettes.

The biggest visual risk is not "SVG vs. raster"; SVG is a good fit here. The risk is **complexity discipline**: the character SVGs are becoming mini illustration programs embedded in JavaScript strings. That can produce great results, but only if future agents keep reusable art rules, animation budgets, and test/preview workflows tight.

### What is working well in the SVG approach

- **Parametric hero art is the right call.** One `heroSVG()` can express muscle growth, weapons, cape colors, and Act 2 theming. That is far better than managing many static image variants.
- **Per-instance SVG IDs are good.** The `__huid`-style ID prefixing avoids many gradient/filter collisions when multiple characters render on the same screen.
- **The style target is appropriate:** bold ink outlines, saturated gradients, drop shadows, glints, and simple idle motion match the comic/superhero premise and Teddy's ADHD-friendly need for visual energy.
- **`prefers-reduced-motion` is being respected.** This keeps the default juicy without blocking calmer behavior when requested.
- **The current hybrid art pipeline makes sense.** Painted raster backgrounds + crisp SVG foreground characters/UI is probably the best quality/maintenance tradeoff for GitHub Pages.

### Cautions for future visual work

- Treat every new SVG filter as a performance cost. `feSpecularLighting`, `feTurbulence`, large blur/glow regions, and multiple animated inline SVGs can get expensive on iPad Safari.
- Keep the learning content visually dominant. Character beauty should frame the task; it should not compete with the letter/word tile the child must attend to.
- Avoid turning every SVG into a unique one-off. The app needs a small shared visual language: outline weight, light direction, shadow style, eye style, material palettes, and animation timing.
- Keep dynamic/user-provided text out of SVG/template strings unless it is escaped or inserted with `textContent`.
- Prefer transforms and opacity for animation. Avoid animating filter parameters, path data, layout, or large blur regions during gameplay.

### Suggested SVG/CSS art direction improvements

1. **Create a tiny internal SVG design system.**
   - Suggested helpers: `defsLighting(id, palette)`, `inkPath(...)`, `softShadow(id)`, `gemGlow(id,color)`, `faceParts(kind)`, `motionStyle(id, profile)`.
   - Goal: make new characters look like the same studio drew them without copy/pasting hundreds of SVG lines.

2. **Standardize light direction across characters and UI.**
   - Pick one main light, e.g. upper-left warm key + lower-right cool bounce.
   - Apply it consistently to hero, Vex, Vixen, Noah, dragon, ally faces, buttons, and tiles.
   - This will make SVG foregrounds sit better on the painted scenes.

3. **Add a character scale/pose contract.**
   - Define canonical viewBox, foot baseline, head height, eye line, and stroke widths for small/medium/large renders.
   - This prevents map sprites, win-screen heroes, and title heroes from feeling like different art sets.

4. **Separate "portrait" and "gameplay token" variants.**
   - Full character SVGs can be rich for title/win/base screens.
   - Map markers and tiny ally pops should use simplified low-detail variants with fewer filters and bolder silhouettes.
   - This can improve performance and readability without reducing beauty where it matters.

5. **Add a small visual regression gallery.**
   - `hero-lab.html` already points in this direction. Expand it into a stable visual checklist page showing every character in all major states: Act 1 hero, Act 2 knight, no weapon, hammer, sword, muscle levels, Vex, Vixen, dragon, Noah, ally faces, map markers.
   - Future agents can screenshot this before/after visual changes.

6. **Use CSS custom properties for character palettes where practical.**
   - The SVG strings can still inline gradients, but palette values should come from named theme objects or CSS variables instead of scattered hexes.
   - This keeps Act 3/future theming possible without another large art rewrite.

7. **Keep filters in shared `<defs>` where possible.**
   - Per-instance IDs are safe, but many repeated filters increase DOM and GPU work.
   - If a character appears many times on one screen, consider a simpler no-filter variant or shared global filter definitions for common shadows/glows.

8. **Introduce an animation budget.**
   - Suggested rule of thumb: one idle transform animation per large character, one glow/pulse if meaningful, no more than a few small particles unless on title/win screens.
   - Gameplay screens should save motion budget for answer feedback.

9. **Make outlines responsive to render size.**
   - Very thick strokes look great large but can crush details small. For tiny map/ally/token renders, consider simplified shapes or a `detail:"low"` option rather than scaling down the full SVG.

10. **Prefer semantic class names inside SVG.**
   - Classes like `.hero-cape`, `.hero-face`, `.hero-weapon`, `.villain-eye-glow` are easier to maintain than many anonymous nested groups.
   - This also makes future CSS-driven themes and debug overlays easier.

### Top 10 enhancement ideas the team may not have considered yet

1. **Hero emotion states tied to pedagogy.**
   - Add optional expressions: focused/listening, celebrating, gentle-try-again, determined boss-face.
   - Use them sparingly to support feedback without adding harsh failure states.

2. **Mouth-shape micro animation for audio playback.**
   - During narration/TTS/voicepack playback, a simple two- or three-frame SVG mouth toggle could make mentors feel alive.
   - Keep it transform/opacity-based and disable under reduced motion.

3. **Letter-gem light reflection on the hero.**
   - When a child is working on a specific grapheme, tint a subtle rim light or glasses glint with that gem's color.
   - This reinforces "letter gems power the hero" without showing target text in sound-ID prompts.

4. **Act-specific material language.**
   - Act 1: glossy comic tech, blue/gold energy, city-neon reflections.
   - Act 2: engraved metal, parchment glow, rune sparks, dragon-fire rim light.
   - Keep Andika/learning tiles consistent, but let non-learning chrome and characters shift theme.

5. **Tiny victory pose variations.**
   - Randomly choose from 3–5 hero poses on win screens: fist up, sword raised, hammer shoulder, cape flourish, glasses glint.
   - This adds delight without changing curriculum.

6. **Readable silhouette test.**
   - Add a preview mode or manual checklist where every character is viewed as a black silhouette at small size.
   - If Teddy cannot tell hero/Vex/dragon/Noah apart by silhouette, simplify the pose.

7. **Foreground/background color harmonizer.**
   - Add per-screen CSS variables like `--scene-key`, `--scene-rim`, `--scene-shadow` that characters/UI can use for glows and rim lights.
   - This would make SVGs feel less pasted onto painted backgrounds.

8. **Diegetic UI frames.**
   - Instead of generic panels everywhere, some screens could use in-world frames: comic speech bubble, hero comms screen, spellbook page, forge anvil plaque, dragon shield.
   - Keep the answer tiles standardized; vary the container/story dressing.

9. **Collectible art upgrades with zero gameplay advantage.**
   - Cosmetic unlocks could change hero aura, cape trim, gem sparkle shape, base trophies, or victory confetti style.
   - This supports Teddy's collection motivation without affecting reading difficulty.

10. **Performance quality tiers.**
   - Add a parent-facing or automatic "visual detail" setting: Full / Calm / Lite.
   - Full uses filters/particles; Lite swaps to simplified SVG variants and fewer shadows for older iPads or battery-sensitive use.

### Suggested process for the next visual pass

1. Pick one representative screen from each category: Title, Map, Learn/Find, Forge/Boss, Win, Base.
2. For each, define the visual hierarchy: what must Teddy look at first, second, third?
3. Screenshot before changes.
4. Change one layer at a time: background integration, character, panel, tile, effects.
5. Screenshot after changes on iPad dimensions.
6. Run `node tests/curriculum.test.js` and `node tests/save.test.js` even for visual-only work, because art changes often touch `game.js` rendering paths.

### Highest-value next visual task

If only one visual improvement is prioritized next, make it **foreground/background integration**:

- Give characters a shared grounding shadow/contact shadow.
- Add scene-colored rim light.
- Reduce mismatched raw web-control surfaces.
- Ensure answer tiles remain the clearest, highest-contrast objects on learning screens.

That will likely improve perceived quality more than adding more detail to any single character.

---

## 2026-06-13 Latest Pull Review — Progress, Bugs, Enhancements, Queries

### Review context

Reviewed after pulling latest `main` at commit `01a5a36` (`docs: bring CLAUDE.md current...`). This was a read-only code review except for this `QA.md` update.

### Progress snapshot

The project has moved forward significantly since the prior review:

- The no-build modular split is now real: content/data, save/cloud, audio, allies, map, SFX, and music have been extracted from the old monolith while preserving classic `<script>` loading.
- Act 2 now appears complete through sentence-level fluency and Dragon Keep, which means the reading ladder is much closer to the stated goal: letters → digraphs/blends → long vowels/vowel teams → word fluency → sentence-level reading.
- Tests expanded from save/curriculum basics into stronger app invariants: act ID ranges, map spot coverage, zone locking, vowel teams, Act-2 sentence decodability, profile-name escaping, sound-ID anti-gaming, and scramble decodability.
- PWA/offline support has landed via `manifest.json` and a network-first service worker.
- Visual polish is now more systematic: painted map, scene harmonizer variables, Act-2 medieval chrome, detail tiers, ally glow-up, music/SFX controls, and victory pose variation.

Overall: this is no longer just "feature expansion"; the project is becoming a maintainable static app with real regression protection.

### Bugs / risks to investigate

1. **Cloud pull after profile switching may need a UI refresh beyond the title.**
   - `switchProfile()` reloads `S`, recomputes `GEO`, paints the title, and runs `cloudPull()`. If cloud restores newer progress, it repaints title again, but may not refresh any already-open progress/settings UI.
   - Likely low risk because switching returns to title, but worth verifying with multiple players and cloud-enabled saves.

2. **Cloud sync still uses bare profile IDs as write keys.**
   - This remains the biggest security/accidental-write concern. The risk is acceptable for a family app, but the baked Worker URL means the optional passphrase/key-derivation idea is still worth doing before wider sharing.

3. **Service worker cache version may need an explicit bump habit.**
   - The service worker is network-first, which is the right strategy for frequent GitHub Pages deploys. Still, if the app goes offline after a deploy or if old cached assets are involved, it helps to have a documented rule: bump `CACHE` when changing core load-order files, asset names, or offline-critical behavior.

4. **Classic script modularization is successful but load-order fragile.**
   - The comments explain load order well. The remaining risk is future agents adding a cross-file top-level reference that runs before its dependency exists.
   - Suggestion: keep the module headers explicit and add a cheap load-order smoke test that evaluates files in the exact `index.html` order.

5. **Music/SFX autoplay and audio-ducking should be tested on real iPad.**
   - Browser autoplay policies and iOS audio behavior are often different from desktop. Verify first-tap start, background/foreground pause-resume, duck/unduck after skipped narration, and volume persistence.

6. **Painted map zone nodes now represent zones, not individual missions.**
   - This is probably a UX improvement, but it changes the mental model: tapping a zone starts the next mission inside it.
   - Query: does the child/parent need a visible "3 missions left in this zone" cue, or is the current zone-level simplification better?

7. **Act 2 is complete, but progression proof should include retention/replay behavior.**
   - Tests prove decodability and wiring, not whether weak items resurface enough after a child completes the act.
   - Suggestion: add a review/patrol invariant for post-completion practice so completed acts remain useful.

8. **`Math.random()` still makes some visual/gameplay bugs hard to reproduce.**
   - Random victory poses, shuffles, weak picks, particles, ally pops, and reward art are fine in production.
   - A tiny optional seeded random hook for tests/debug would help future investigations without changing normal gameplay.

### Enhancement suggestions

1. **Add a script-load smoke test.**
   - Parse `index.html` script tags and `vm.runInContext()` local scripts in that exact order. This would catch load-order regressions introduced by future modularization.

2. **Add a PWA/service-worker check.**
   - A no-browser test can still assert that `manifest.json` is valid JSON, required icons exist, `start_url`/`scope` are sane for GitHub Pages, and `sw.js` parses.

3. **Add a cloud newer-wins regression test.**
   - Mock `fetch()` for older/newer cloud payloads and assert only newer cloud saves replace local progress.

4. **Add a music/ducking unit-ish test if feasible.**
   - With a stubbed `Audio`, assert `Aud.play()` calls `Music.duck()` and later `Music.unduck()`, including on timeout/error paths.

5. **Add a map-zone progress label.**
   - Optional copy could be "Next: mission name" or "2 left" on the zone pill. This may help parents understand that each painted node is a multi-mission zone.

6. **Create a `tests/visual-smoke.test.js`.**
   - Not pixel-perfect. Just render key SVG generators and assert they produce an `<svg>`, have unique gradient/filter IDs across multiple instances, and do not duplicate global IDs in dangerous ways.

7. **Add an iPad QA checklist.**
   - Include: install to Home Screen, offline launch, first audio tap, volume sliders, speech ducking, cloud restore, profile switch, service-worker update after a new commit, and full/calm/lite detail modes.

8. **Add parent-facing "last cloud sync" timestamp.**
   - The current status messages are helpful but ephemeral. A persistent `S.lastCloudOk` or local-only timestamp would reduce parent anxiety.

9. **Keep expanding parent-recorded phoneme coverage before adding more content.**
   - Now that Act 2 content is broad, real recorded phoneme/digraph/vowel-team/long-vowel audio may produce more learning value than additional mechanics.

10. **Consider a post-Act-2 maintenance loop.**
   - A daily "Hero Patrol" that mixes the weakest letters/graphemes/words/sentences from both acts could keep the app useful after story completion.

### General queries for the parent / coding agent

- Should the painted map stay zone-level, or should advanced/parent mode expose individual missions inside each zone?
- Should `S.daily.missions` count every mission completion, only first-time completions, or should it be renamed to "practice rounds"?
- Is cloud-sync hardening worth doing now, or is the current family-only Worker URL acceptable until wider sharing?
- Are the new SFX/music tracks intended to be committed assets long-term, or should the app also support in-app music upload like voice clips?
- Should Act 2 completion trigger a clear "app done / maintenance mode" message aligned with the stated second-grade-readiness goal?
- Should `QA.md` eventually archive older review sections so the coding agent sees the newest priorities first?

### Current verification

Checks run during this review:

- `node tests/curriculum.test.js` — 30 passed, 0 failed.
- `node tests/save.test.js` — 30 passed, 0 failed.
- `node --check` across the local JavaScript files — passed.

---

## 2026-06-13 True-Latest Main Review — Based on `bdf69be`

### Review context

This review was performed after explicitly fetching/resetting to true `origin/main`, then rebasing once more when `main` advanced during push. The final reviewed base is `bdf69be` (`Parking lot: uppercase rounds in boss + optional cloud passphrase`). This supersedes any prior review based on `01a5a36` or `12bcece`.

### What changed since the prior stale review

- The Magic Kingdom rename is now live in code-facing places that matter: `ACTS[1].city`, Act-2 lore lines, the Act-2 finale map button, CLAUDE.md, and map-label comments.
- The Act-2 medieval display font is now wired through the Google Fonts request, Act-2 CSS chrome selectors, and the painted map's SVG text labels.
- Several prior QA items have now been addressed: daily mission counts count first-time completions, profile names have escaping coverage, level override has confirmation, boss sound-ID now includes deliberate uppercase rounds, optional cloud passphrase keys exist, and the CI/test surface is broader.
- `QA.md` itself now contains several historical sections. Useful, but it is getting long enough that newest-priority visibility may become a real agent-workflow issue.

### Bugs / risks / cleanup items to investigate

1. **Documentation drift remains in art docs.**
   - `art/README.md` still says "medieval realm" / "Act 2 — Medieval Realm" in a few places, while the app has moved to Magic Kingdom.
   - This is harmless at runtime, but art-generation prompts/docs are exactly where wording consistency matters for future assets.

2. **CI syntax check does not cover every JavaScript file in subdirectories.**
   - The workflow uses `for f in *.js; do node --check "$f"; done`, which checks root JS files but not `cloud/worker.js` or future nested JS.
   - Suggested improvement: use a `find`-based check with exclusions for dependencies, or explicitly include `cloud/worker.js`.

3. **Service-worker cache version is still manual.**
   - Network-first behavior is right for GitHub Pages, but `CACHE = "superteddy-v1"` has not changed despite major app/module/PWA changes.
   - Not necessarily a bug, but the team should decide when cache names get bumped and document that rule.

4. **Magic Kingdom font depends on Google Fonts.**
   - The fallback is acceptable and learning content remains Andika, but Act-2 chrome will lose its medieval flavor if the font was never cached before offline use.
   - Query: is that fine, or should `MedievalSharp` be self-hosted once the visual direction is settled?

5. **Painted map zone UX still deserves an iPad check.**
   - Zone-level nodes are cleaner than mission-level clutter, but they hide the number/name of the next mission.
   - Consider showing "Next: <mission>" or "2 left" in the parent/progress layer first, rather than adding clutter to the child map immediately.

6. **Cloud passphrase hardening exists, but remains opt-in.**
   - `CLOUD_PASSPHRASE` now hashes the profile cloud slot without changing the Worker, while the default empty value preserves existing sync. The remaining decision is operational: when/if to set the passphrase on all family devices and how to communicate the one-time re-sync.

7. **`cloud/README.md` still describes passphrase as future work.**
   - The code and CLAUDE.md now say passphrase support is done, but `cloud/README.md` still says “If you ever want a passphrase...”. Update the cloud docs when the team decides whether to enable it.

8. **Post-Act-2 maintenance loop is now more important than more content.**
   - Since the full Act-2 sentence ladder is live, the next learning risk is retention/automatic review, not adding more scope.
   - A cross-act weakest-item patrol would keep the app useful after story completion.

### Enhancement suggestions for the next coding agent

1. **Make a "latest priorities" block at the top of QA.md.**
   - Keep the historical reviews below, but add a short current-priorities index so coding agents do not over-weight stale notes.

2. **Add a load-order smoke test from `index.html`.**
   - Parse local `<script src>` order and evaluate the same files in a VM harness. This is the best cheap guard for classic-script modularization.

3. **Expand CI's syntax check.**
   - Check all project JS files, including nested files like `cloud/worker.js`, and maybe `tests/*.js` explicitly even though the tests run.

4. **Add PWA/offline assertions.**
   - Validate `manifest.json`, icon paths, `sw.js` parseability, and that same-origin core files are reachable/cachable.

5. **Add a service-worker update QA checklist.**
   - On iPad: load online, install to home screen, go offline, launch, reconnect, deploy a commit, relaunch, verify fresh content wins.

6. **Add cloud newer-wins tests.**
   - Mock cloud payloads and confirm newer cloud saves replace local while older cloud saves do not.

7. **Add visual smoke tests for SVG ID uniqueness.**
   - Render multiple hero/villain/gem instances and assert no obvious duplicate `id="..."` collisions across a combined snippet.

8. **Prioritize recorded phoneme coverage.**
   - With content now broad, parent-recorded phoneme/digraph/vowel-team/long-vowel audio likely has more learning value than another visual pass.

9. **Add a post-finale "maintenance mode" design.**
   - After Miss Kendall is rescued, make the app explicitly transition into daily reading patrols rather than feeling "over."

10. **Self-host display fonts only if the visual direction stabilizes.**
   - Not urgent, but if Magic Kingdom chrome becomes important, self-hosting avoids offline-first-load inconsistency.

### Open questions

- Should the app now treat Act 2 as the end state, or is Act 3 still expected?
- Should `QA.md` be reorganized so the current/latest section appears first?
- Should `CLOUD_PASSPHRASE` be set now on all family devices, or should bare-key sync remain the default until there is a concrete sharing risk?
- Does Teddy respond better to zone-level maps or mission-level maps? The current painted map is prettier, but a parent may want deeper visibility.
- Are background music files final committed assets, or should there eventually be an in-app "music pack" workflow similar to voice clips?

### Verification on true latest main

Checks run on `bdf69be` before this QA update:

- `node tests/curriculum.test.js` — 30 passed, 0 failed.
- `node tests/save.test.js` — 33 passed, 0 failed.
- `node --check` across the root local JavaScript files plus `audio-studio.js` and `sw.js` — passed.
