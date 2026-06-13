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
