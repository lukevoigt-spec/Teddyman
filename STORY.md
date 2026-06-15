# STORY.md — the storyline + cutscene plan (narrative craft + production)

> Serves CLAUDE.md objective #1 + the FUN/ADDICTING north star. **Story is the *hook* that buys more reading reps** — it
> is the motivation engine, not a teaching method (the evidence: narrative reliably lifts engagement/persistence, *not*
> test scores — Huynh et al. 2021). Three rules bind everything below:
> 1. **Fuse the reward to the reading act.** Decoding the word *is* what shatters the cage / forges the sword. Story that
>    sits *beside* the learning is a "seductive detail" that pulls him away; story *fused to* the reading pulls him in.
> 2. **Brutally short + always skippable.** Every passive second is a non-reading second. ≤30–45s per beat, ≤3 beats
>    before he's back to reading, persistent ⏭/Home, watchdog-backed (hard constraint #8). Cutscenes *earn* their length
>    by ending on a hook.
> 3. **Audio-first, emotional clarity.** He can't read: art carries plot, narration carries feeling. One villain, one
>    captive, one job per act.
> — Trinity, 2026-06-15 (from a 3-stream cited research review; sources at bottom)

---

## A. Production verdict — HYBRID (elevated SVG spine + selective AI-video spectacle), NOT full AI-video

**Why not full AI-video cartoons** (the honest research finding, now strongly corroborated across ~6 streams): AI video
can't reliably hold our *specific* designed characters on-model across multiple shots — the gem-lenses / gold-T / cape and
the real family likenesses are the first things to drift ("by clip 7 it reads as a different shoot"). And the cost is a
**mirage**: the "$1/clip" list price is really list × rerolls — ~2–3× for throwaway shots and **~15–20 regenerations per
scene the moment you need a recurring on-model character**; you **cannot fix one bad detail** (re-rolling yields a
*different* clip that breaks continuity with its neighbors); a **non-dev parent can't cheaply re-render** a clip to fix
one line; re-encodes **permanently bloat git history** (binaries don't diff) and fight the "lands on the iPad in minutes"
deploy. (Also: Sora 2's API is reported sunsetting **Sep 2026** — building on it now is building on sand.) We'd trade away
our parametric SVG, the only method **guaranteed** perfectly on-model, deterministic, free + instant to tweak, ~KB, and
offline-native — and we already have a full SVG cutscene engine (`cutsceneFX`, `faceSpeak`, `beatIn`, letterbox,
`Music.setAct`). Acclaimed titles (**Banner Saga, Hades, Max Payne, inFAMOUS**) and the entire kids-app category (**Sago
Mini, Toca Boca, Khan Academy Kids**) prove authored illustrated motion reads as *premium* with **no video at all** — when
the panel style *is* the game's identity (which is already our Act-1-comic / Act-2-storybook plan), it's an artistic
statement, not a budget compromise.

**The recommended shape:**
- **SPINE = cinematic SVG "motion-comic / storybook."** Take our existing characters + painted backgrounds and make them
  *feel* like a cartoon: parallax depth, Ken-Burns push-ins, the existing `cutsceneFX` (villain wash / portal whoosh /
  transform flash), `faceSpeak` mouth-move, comic-panel framing (Act 1) / storybook page-turns (Act 2 — already the
  planned direction, CLAUDE.md backlog D). **Guaranteed on-model, tiny, offline, free to iterate, render-gated by The
  Oracle.** This delivers ~80% of the "cartoon" feel at *zero* consistency risk.
- **SELECTIVE AI-VIDEO = at most 1–2 "wow" clips, spectacle-only, low character-identity.** Best (and maybe only) safe
  candidate: the **time-travel portal** (beat 5) — a swirling vortex + a silhouetted hero, where identity precision
  barely matters and the spectacle is highest. A sweeping **establishing shot** (city skyline / medieval realm, beat 1/6
  — environment, not a face) is a secondary candidate. Each: ≤8s, H.264 mp4, **keyframed from our own rendered art** as
  the start frame (Veo 3.1 "Ingredients" / Runway Gen-4 References / Kling — anchored by a keyframe), render-gated,
  **shipped only if it clears the §20 Premium Bar; SVG fallback always retained.** Never the character/emotion beats
  (rescue, Mom & Dad, homecoming) — identity + likeness drift would hurt there.

> Net: the cinematic lift where it's *safe*, perfectly on-model SVG where *identity matters*. Treat any AI clip as an
> optional **spike** proven by render, never a dependency.

### Serving pipeline (only if/when we ship a video clip)
- **Encode:** H.264 mp4 + AAC, 720p (or 540p), ~2–2.5 Mbps → ~3–5 MB/clip; **commit under `art/`** (well within GitHub
  Pages limits; no LFS — it breaks Pages; no CDN at this scale). Watch git-history bloat on re-encode.
- **Offline:** iPad Safari `<video>` demands a **`206` Range** response; our network-first `sw.js` replays `200` from
  cache → **video silently fails offline.** Either add a Range/206 branch to `sw.js`, OR (lower-risk, **recommended**)
  store clips as **Blobs in IndexedDB** — mirrors the existing `VStore` audio cache (~500 MB iOS budget) and plays via
  `URL.createObjectURL`, sidestepping the SW Range gotcha entirely. Test on a real iPad.
- **Tooling, IF we do a spike:** the hero is a *drawn* character, so **Sora 2 Character Cameos** (built for fictional/
  drawn designs, *not* real people) or **Veo 3.1 Ingredients / Kling / Luma** (start-frame keyframe from our rendered
  art) are the candidates — `Grok Imagine` is cheapest (xAI API the team already has). Budget for a **3–4×+ reroll
  multiplier** and realism-flattening of our loud style. **Never** the real-family-likeness beats. The team already has
  Grok + ChatGPT APIs.
- **Playback:** `<video muted playsinline>`, call `play()`, **`.catch()` the autoplay rejection** → tap-to-play fallback
  (Low Power Mode blocks autoplay). Wrap in the `flow()`/watchdog + ⏭ so it can never hang.
- **Audio:** bake only ambience/music into the mp4; **keep spoken narration on the existing `Aud`/`flow()` pipeline** so
  the voice studio, per-role voices, and music-ducking still work (audio-first preserved).

---

## B. The 7 beats — mapped (exists vs gap) → treatment → production

| # | Beat | Status today | Emotional goal | Craft technique | Production |
|---|---|---|---|---|---|
| 1 | **Intro hook** | EXISTS (`startIntro`, intro panels) | instant *want* + threat | **Cold open**: wonder/threat by sec 5, hero's desire by 20, "your job" by 45 — no talking-head exposition; ends on the child being *chosen* | SVG motion-comic (elevate). *Optional* AI establishing city shot. |
| 2 | **Dread before Act-1 boss** | EXISTS (fortress intro) | raise stakes | Quiet-before-storm: music down, palette dark, Vex *looms*, Leighton caged & afraid (~20s, then straight to reading) | SVG |
| 3 | **Defeat Vex + free Leighton** | EXISTS (`leighton1-3`) | catharsis/joy — the dividend on his reading | Max juice the instant decoding lands: cage shatters, color floods, cast cheers **by name** (relatedness) | SVG (max FX) |
| 4 | **Mom & Dad: Miss Kendall taken** | EXISTS (`interlude1-2`) | new, *personal* call-to-adventure | Trusted faces deliver bad news + "only **you** can" → end on Vixen reveal cliffhanger | SVG (**likeness-heavy → never AI**) |
| 5 | **Portal + transformation** | EXISTS (`interlude3-4`, `_knight`, `5`) | the thrill of becoming *more* | **Pull → flash → reveal**: portal sucks him in, white flash + shake, he lands transformed, music swells to Act-2 theme | SVG transform beat **+ the prime AI-video spike candidate (portal vortex)** |
| 6 | **Dread before Act-2 boss** | EXISTS (`f2_intro`) | escalated finale stakes | Mirror beat 2, *bigger*: dragon dwarfs the castle, Vixen taunts, Kendall caged | SVG (*optional* AI realm establishing shot) |
| 7 | **Homecoming + "ready for school"** | ❌ **GAP — NOT BUILT** (Act-2 win just returns to the medieval map) | durable **self-efficacy** & pride — the payoff of the *entire game* | Time-travel home; full cast assembles; affirmation is **earned + specific + process-framed**, spoken by the people he loves | SVG (**likeness + precise wording → never AI**) |

**The #1 narrative build is beat 7** — it's missing, and it's the emotional climax of the whole journey *and* the
self-efficacy moment that ties the game to the real-world goal (ready for school). **The #2 is elevating beat 1** (the
hook that gets him to start). Everything else exists and gets the cinematic SVG pass.

### Beat 7 — drafted treatment (the missing ending)
After the Dragon Keep win and freeing Miss Kendall: a **portal home** → present-day Star Force City → the **whole cast**
(Leighton, Archie/Tank, Ellie/Flip, William/Sunny, Amelia, Noah, JJ/Nora/Cal, Mom & Dad, Miss Kendall) gathered to
celebrate. The affirmation must be **process praise, not trait praise** (Dweck: "you're so smart" backfires; "you worked
hard / you didn't quit" builds mastery). Draft lines (for parent approval, then `data-lines.js`):
- *Mentor/Mom&Dad:* "You **sounded out every word**. You never quit on the hard ones — that's how you saved everyone."
- *Miss Kendall:* "You can **read** now, Teddy. You're ready for school — and you're going to do great."
- *Cast (by name):* short cheers — relatedness is the reward.
- Show **proof**: the gems/words he conquered, the allies he freed — pride pointed at what he *actually did*.

---

## C. Cross-cutting fixes (independent of the video decision)
- **Squire, not knight, at the transformation.** Beat 5's `interlude_knight` says "rise again as Super Teddy the
  **Knight**," but the rank ladder is SQUIRE→SOLDIER→KNIGHT (and power *resets* here). The reveal should crown him a
  **squire**; he *earns* knight by mastery. (Line + theme-name tweak.) *(Parent's stated intent + lore consistency.)*
- **Every cutscene ends on a hook** (cliffhanger-chaining = return-tomorrow pull).
- **Fuse reward to reading** everywhere — keep the "your decoding caused this" causality explicit.
- **Re-confirm all cutscenes are skippable + watchdog-safe** (they are today; keep it when any `<video>` is added).

---

## D. Ownership + build order
- **The Oracle** owns the cinematic *look*: the motion-comic/storybook elevation of all beats, the new beat-7 ending art,
  and drives any AI-video spike (generation + keyframing from our art + the §20 render-gate). PRs Neo merges.
- **Neo** wires it: the new beat-7 cutscene into the Act-2 finale flow (`showWin`/finale), the `data-lines.js` script,
  and — *only if a video clip ships* — the `<video>` element + the `sw.js` Range/206 branch + the skip/watchdog wrap.
- **Trinity** owns this plan + the narrative guardrails (short/skippable/fuse-to-reading/process-praise) + lore
  consistency; drafts the beat-7 script for parent approval.
- **Build order:** (1) **beat-7 homecoming ending** (missing, highest leverage) → (2) **beat-1 hook** elevation → (3) the
  cinematic SVG pass over beats 2–6 + the squire fix → (4) *optional* AI-video portal spike (proven by render, or
  dropped). Each step short, skippable, render-gated.

## E. DECISION (parent, 2026-06-15): SVG motion-comic spine + ONE AI-video portal spike
All cutscenes are **cinematic SVG motion-comic** (Ken Burns + 2.5D parallax over our on-model art); **The Oracle also
tries a single AI-video clip for the time-travel portal** (keyframed from our art, render-gated, **shipped only if it
clears the §20 Premium Bar; the SVG portal stays as fallback**). The core narrative work — beat-7 ending, the hook, the
SVG cinematic pass, the squire fix — proceeds regardless; the portal clip is an optional experiment. Build tickets routed
in `QA.md`.

## Sources
Huynh et al. 2021 (*IEEE TVCG*, narrative ↑ engagement, not test scores) · Przybylski, Rigby & Ryan 2010 (Self-Determination
Theory & games) · Mueller & Dweck (process vs. trait praise) · Pixar story-structure craft canon · MDN/WebKit (iPad video
codecs, `playsinline`, autoplay) · web.dev / Workbox (Service-Worker 206 Range) · GitHub Pages limits · Veo 3.1 / Runway
Gen-4 / Kling / Sora 2 capability + character-consistency practitioner guides (2025–26). *Effect sizes & vendor "consistency
%" figures are as-reported; the directional findings (story = engagement engine; AI cross-shot consistency unreliable for
bespoke characters) are well-corroborated.*
