# Project Spec: "Hero Reader" — Teddy's Reading App
**Version 1.0 — Master Specification (Locked Decisions)**

---

## 1. Mission Statement
A comic-book superhero adventure web app for a 7-year-old with ZMYM2-related neurodevelopmental delay, teaching emergent literacy (letters → sounds → blending → sight words → simple text) through 2–5 minute missions where **reading is the superpower**. Mastery-paced, multi-sensory, OCD/seizure/vision-safe, and built to fit between bursts of active play.

---

## 2. Locked Decisions (from scoping)

| Decision | Choice |
|---|---|
| Platform | Web app saved to iPad home screen (full-screen PWA-style); native wrap possible later |
| Builder | Claude builds everything; parent deploys/tests |
| Audio | Built-in TTS for narration/instructions now; app accepts parent-recorded clips for the 26+ letter sounds (recording script provided) |
| Curriculum scope (v1) | Full ladder: letters+sounds → CVC blending → sight words → decodable phrases |
| Art direction | Comic-book superhero style; rich, lightly "open-world" feel (nice-to-have, not constraint) |
| Parent dashboard | None in v1 (internal mastery tracking still runs silently) |
| Hero identity | One hero that **visibly evolves** as he learns; gear/costume unlocks as rewards |
| Usage mode | Parent nearby at first → independent later; everything audio-guided (he can't read instructions) |
| School program | None exists — this app is his primary phonics instruction; use standard synthetic phonics (SATPIN sequence) |
| Session structure | Guided "Mission of the Day" path + small free-choice zone |
| Personalization | Full — Teddy's name spoken and shown throughout; all data stays on device |
| Villain tone | Classic comic villains — menacing but cartoonish |
| Letter case | Teach uppercase + lowercase paired from the start, lowercase slightly weighted |
| Device | His own iPad — simple localStorage persistence with export/backup option |
| Tracing | Yes for each NEW letter (multi-sensory introduction); review/battles are tap-based |
| Daily stopping point | Yes — "hero rests" wind-down after daily missions complete |
| Combat content | No restrictions — standard superhero fare |

---

## 3. The Story Frame

**Teddy is the hero.** Letters are scattered "power glyphs" stolen by **The Scrambler**, a villain who broke language itself so no one can read warnings, signs, or spellbooks. Each glyph Teddy recovers (learns) restores a piece of his power. His mentor — a wise narrator voice — greets him by name, briefs missions, and never lets him fail harshly.

- **Learning a letter** = recovering a glyph (charges a power)
- **Blending a word** = casting it as an attack/shield against a villain
- **Sight words** = rare "instant spells" that must be known on sight
- **Reading a sentence** = completing a mission objective (open the vault, free the citizens)

Villain roster escalates with curriculum: minions → lieutenants → The Scrambler himself (final boss = reading full decodable sentences).

### The Hero's Signature Look
Teddy's hero wears his **blue glasses** — in-story, they are the **Glyph Lenses**, the power item that lets him see hidden letters no one else can. (Glasses = superpower, by design.)

### The Hero League (real people, in-game allies)
Allies are **rescued and recruited at learning milestones**, then join missions, cheer correct answers by name, and lend their power in battles. Appearance profiles derived from family photos (photos never enter the app; only these descriptions do):

| Character | Real person | Comic-art profile & power |
|---|---|---|
| **The Hero (Teddy)** | Teddy, 7 | Sandy-blonde swoopy hair, freckles across the nose, light eyes, big bright grin, **blue rectangular glasses = the Glyph Lenses** (his power item). Blue/red suit, gold "T" emblem, cape. |
| **Heartguard** | Amelia, 13 (big sister, biggest heart) | Strawberry-blonde hair pulled back sleek, warm brown eyes, tall and graceful, beaming smile with braces. Navy suit, rose-pink heart emblem, pink-striped accents; her gold necklace = the **Heart Amulet**. Power: shields and heals the team; chief encourager on tough words. |
| **Flip** | Ellie, 11 (big sister, regional-medalist gymnast) | Light brown hair in a high bun with scrunchie, big brown eyes, confident smile, gymnast build. Pastel tie-dye leotard-style suit, chalk-white wrist wraps, golden **Glyph Medals**. Power: tumbling acrobatics — vaults rooftops, snatches glyphs mid-somersault. |
| **Tank** | Archie (best friend, all things sports) | Shaggy sandy-blonde windblown hair, ruddy outdoor cheeks, sturdy athletic build. Jersey-style top, athletic shorts, high pulled-up socks, cleats. Power: the unstoppable charge — smashes villain barricades. |
| **Sunny (Wildcard)** | William (best friend, sweet + gloriously chaotic) | Light blonde side-swept hair, warm brown eyes, huge gap-toothed smile. Sunshine-gold suit with radiant sun emblem. Power: weaponized kindness with chaotic results — hugs villains into surrender, glitter explosions, comic relief with a heart of gold. |
| **The Mentors** | Mom & Dad | Founders of the Hero League; brief every mission and guide training. Dad: short brown swept-back hair, light eyes, friendly stubble, big grin, light-blue shirt. Mom: golden-blonde hair pulled back sleek, bright hazel eyes, warm smile, pink beaded **Founder's Beads** necklace. Their on-screen presence pairs with parent-recorded voice lines. |
| **Leighton, the Starlight Princess** | Leighton (Teddy's best girl friend) | Light brown shoulder-length hair with sun-kissed ends, soft freckles, gentle smile, flowing light-blue dress with white lace trim. Keeper of Glyph City's stories, captured by the Scrambler — her rescue is a major milestone arc. After rescue, she appears at the Hero Base asking Teddy to read recovered storybook pages (ongoing reading practice disguised as friendship). |

Unlock order ties to the curriculum (e.g., first ally rescued at Group 1 mastery), giving each phase a built-in emotional reward beyond gear.

---

## 4. Curriculum Ladder (evidence-aligned synthetic phonics)

### Phase 0 — Origin Story (onboarding)
Hero creation moment, name capture, and a **"Power Scan"**: a disguised baseline assessment (which letters/sounds he already knows) so the app starts exactly at his edge, not at "A."

### Phase 1 — Power Glyphs (letters & sounds)
SATPIN-order groups, each group its own "zone" with its own lieutenant villain:
1. **s a t p i n** → immediately unlocks blendable words (sat, pin, tap, nap...)
2. **m d g o c k**
3. **e u r h b f**
4. **l j v w x y z q**

Each new letter mission: **see it → hear it → say it (echo prompt) → trace it → find it** (tap among distractors). Uppercase+lowercase shown as "glyph + its shadow form."

### Phase 2 — Word Forge (blending CVC)
Begins as soon as Group 1 is mastered — early reading wins are the motivational engine. Drag/tap sounds together; the word "powers up" and fires at the villain. Sound-by-sound audio support always available via a "charge" button.

### Phase 3 — Instant Spells (sight words)
Heart-word method (sound out the regular parts, flag the tricky part with a heart/star). First 25 high-frequency words (the, a, I, to, and, is, it, in, you, said...), introduced ~2 per mission, heavily recycled.

### Phase 4 — Mission Text (decodable sentences)
Short decodable sentences built ONLY from mastered letters + learned sight words ("The cat sat on a mat."). Reading the sentence completes story missions. This is the bridge toward the 2nd-grade goal.

**Sequencing rule:** readiness-gated, never grade-gated. Nothing appears that he hasn't been taught. Expect and design for 3–5× the repetitions a neurotypical learner needs — that's the profile, not failure.

---

## 5. Mission Anatomy (the 2–5 minute core loop)

1. **Briefing** (~15s): Mentor addresses Teddy by name, states the goal in one sentence, villain appears
2. **Learn** (~60s): New glyph introduced multi-sensory (new letters only)
3. **Practice** (~90s): 5–8 quick reps disguised as combat — tap the glyph that makes /s/, zap the word "sat"
4. **Boss Moment** (~30s): One applied challenge using the new skill
5. **Victory + Reward** (~30s): Gear unlock or power-up, hero visibly evolves at milestones
6. **Clean save point**: progress saves after every single answer — quitting mid-mission never loses anything

**Mission of the Day**: 2–3 missions on the guided path (mix of one new skill + spaced review disguised as "patrols"). Completing them triggers the **Hero Rests** sequence — sunset over the city, hero recharges, "see you tomorrow, Teddy" — a gentle off-ramp, never a lockout. **Free Play zone** (costume room, trophy gallery, replay any beaten mission) stays open.

---

## 6. Mastery & Repetition Engine (internal, invisible)

- Per-grapheme and per-word tracking: every item has a strength score
- **Mastery criterion**: correct on ~4 of last 5 exposures across at least 2 different days
- **Spaced review**: weakening items resurface automatically inside "patrol" missions
- **Error handling**: wrong tap → item dims with a soft sound, mentor gives a scaffolded hint ("listen again... /sss/"), correct answer is always reachable. No "WRONG," no red X, no lives, no streak loss. Errorless-leaning on new material.
- **No timers as failure** anywhere. Optional later: personal-best flair only.

---

## 7. Hard Safety/Design Constraints (from clinical handoff — non-negotiable)

1. No strobe, rapid flashing, or high-frequency flicker (photosensitivity-safe animation throughout)
2. Large high-contrast dyslexia-friendly type; minimum ~64pt touch targets
3. No punishing failure states; gentle retry only
4. Mastery-paced; no age/grade gating; no timer-as-failure
5. Self-contained 2–5 min missions; save after every answer
6. Predictable, consistent structure (same loop shape every mission; OCD-calming)
7. Start at emergent literacy regardless of grade goal
8. Big simple motor interactions (taps, broad traces); nothing fine or fast (hypotonia possibility)

---

## 8. Technical Architecture

- **Single-page React app**, installable to home screen (full-screen, no Safari chrome)
- **State/saves**: localStorage with versioned save schema + one-tap export/import backup (protects against accidental clearing)
- **Audio**: Web Speech API (TTS) for all narration; audio asset slots for parent-recorded phoneme clips (I'll provide an exact recording script — 26 letter sounds + a few praise lines, recordable on a phone in ~15 minutes)
- **Graphics — hybrid pipeline**: AI-generated painted parallax backgrounds (parent generates from Claude-written, style-consistent prompts; integrated as layered images for depth and atmosphere) + production-quality vector/SVG characters and UI on top (crisp, animatable, photosensitivity-safe, and high-contrast against painted scenes). Backgrounds are swappable files — art can upgrade anytime without touching code.
- **No backend, no accounts, no analytics, nothing leaves the device**
- **Offline-capable** once loaded

---

## 9. Build Roadmap

| Milestone | Contents | Outcome |
|---|---|---|
| **M1 — Playable core** | Origin story (blue Glyph Lenses moment), Power Scan baseline, Group 1 letters (s a t p i n) with full multi-sensory loop, first villain, first ally rescue tease, hero evolution v1, save system, TTS | Teddy can play day one |
| **M2 — Word Forge** | CVC blending mechanic, second letter group, gear unlock system, Mission of the Day + Hero Rests | First real reading |
| **M3 — Full ladder** | Remaining letter groups, sight-word "Instant Spells," patrol/spaced-review engine, Free Play zone | Complete v1 curriculum |
| **M4 — Polish** | Parent-recorded audio integration, decodable sentence missions, The Scrambler boss arc, backup/export | Ship state |

---

## 10. Open Items (revisit later, not blockers)

- Pending dyslexia/dysgraphia/dyscalculia assessment → may adjust pacing/letterforms when results arrive
- Numeracy track (counting/arithmetic) — explicitly out of scope for v1
- Native iOS wrap — only if the web app proves itself
- Parent dashboard — internal data is being collected; UI can be added anytime

---

## 11. ADDENDUM — Current state as of v2.2 (supersedes conflicting sections above)

**Theme rebrand:** "Glyphs/Glyph City" → **Letter Gems / Gem City** (Minecraft-coded). Glasses = **Gem Lenses**. Each learned letter becomes a colored gem in a collection (s sapphire, a amber, t emerald, p amethyst, i diamond, n topaz). Practice tiles stay uniform color (pedagogy: letter identity, not color-matching).

**Villain rebrand:** The Scrambler/Inkblot are retired. Big bad: **LORD VEX**, a Vader-coded cyborg warlord (red visor, tattered cape, red core); mission enemies are his **VEXBOT** soldiers. Scary-cool by design — the child likes scary. Map summit = **Vex's Fortress** (Leighton's rescue, final battle).

**Weapons & muscles:** Word Forge victories forge weapons — **Word Hammer** (first forge), **Gem Sword** (finale). Hero visibly gains muscle in 3 stages as missions complete. Equipping happens at the **Hero Base** (house node on map): weapons, cape colors (star-gated), gem shelf, Hero League roster.

**Caged allies:** Tank (Archie), Flip (Ellie), and Sunny (William) appear ON the map imprisoned in Vexbot cages at upcoming missions; completing those missions frees them ("CAGE DESTROYED!") and adds them to the League shelf. Heartguard (Amelia) rescue = M2 arc at Heart Tower.

**Profile recalibration (important):** Teddy's OCD presents as **vocal tics, not compulsions** — collections and routines are fine and motivating; the earlier anti-collection caution is withdrawn. **ADHD is the primary design consideration: busy, energetic, high-juice screens HELP.** Gentle error handling stays (no harsh failure), but the "calm stage" doctrine is replaced by "energetic stage, letters loudest." He plays Sneaky Sasquatch, so progressive systems (meters, inventories, objectives, light stealth) are within his grasp for M2+.

**Pedagogy hard rule added (anti-gaming):** sound-ID prompts never display the target letter or sound-spelling on screen; audio alone carries the target. Deliberate uppercase rounds every 3rd rep.

**Engineering state:** v2.2 single-file game + voicepack.js (ElevenLabs-generated via separate Voice Studio tool, 3 voice roles: Mentor/Amelia/Vexbots; letter sounds best replaced by parent recordings). Audio engine has watchdog + skip failsafe so flows can never hang. Hosting: GitHub Pages; repo also carries CLAUDE.md (binding constraints for Claude Code sessions — that file wins any conflict with this spec).

**M2 queue (ranked):** Heartguard rescue arc + letter group 2 (m d g o c k) → music/SFX engine → adaptive mastery-driven patrols → painted backgrounds (AI-generated, prompts supplied).

---

## 12. ADDENDUM — v2.3 naming + structure (supersedes conflicting names above)

**Hero rename:** the in-game hero is now **Super Teddy** (the real child is still "Teddy"; "Super
Teddy" is his hero identity). All narration/UI addresses him as Super Teddy. The gold hex **"T"**
emblem is unchanged.

**City rename:** **Gem City → Star Force City.** Only the *city name* changed — Letter Gems, Gem
Lenses, Gem Sword, the gem collection, and all other "gem" nomenclature are unchanged.

**Codebase split (no behavior change):** the single `index.html` was refactored into
`index.html` + `styles.css` + `game.js` (still a no-build static site for GitHub Pages; load order
`voicepack.js` → `game.js` preserved). File renamed `Index.html` → `index.html` so Pages serves it
as the directory index reliably. Save key `heroTeddySave_v1` is unchanged — saves are preserved.

**Decisions locked for M2/M3:** map becomes a **data-driven, zone-per-letter-group** world (replaces
hardcoded node positions); distractor selection is **errorless on new letters, then minimal-pair**
(confusable graphemes) for real decoding practice; **all allies (Heartguard/Tank/Flip/Sunny) are
cheer/encourager presences only**, no combat role; **adaptive weakest-item patrols are the M3
focal point**.

**Security note:** `voice-studio.html` previously carried a hardcoded ElevenLabs API key. That key
has been deleted at ElevenLabs, and the file has been **de-keyed** — the API key is now entered in
the browser at runtime and never stored in the repo. With no secret committed, the keyless studio
may live in the repo (it's the tool the parent uses to generate `voicepack.js`). The old key still
exists in git history; the parent has accepted this since the key is fully revoked.
