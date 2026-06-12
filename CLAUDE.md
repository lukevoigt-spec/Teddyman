# CLAUDE.md — Super Teddy (Star Force City)

## What this project is
An iPad web game teaching a 7-year-old ("Teddy") with a ZMYM2-related neurodevelopmental
disorder to read, via systematic synthetic phonics wrapped in a superhero adventure.
Built and deployed from this repo via GitHub Pages. The parent is a non-developer:
every commit to `main` goes live on the child's iPad within minutes. Never push broken code.

## Repo layout
- `index.html` — the entire game (currently single-file; refactor into modules is welcome,
  but the deployed result must remain a static site that GitHub Pages serves with no build step,
  or include the built output in the repo)
- `voicepack.js` — optional shipped audio clips (`window.VOICEPACK = {lineId: dataURI}`).
  NEVER regenerate, rename IDs, or delete it. New narration = add new line IDs to the LINES
  manifest with TTS fallback text (they appear in the in-app studio automatically).
- `audio-studio.js` — the IN-APP audio studio (Grown-Up Corner ▸ Audio tab): record (mic) or
  ElevenLabs-generate voices from inside the game. Clips save to the device in IndexedDB
  (`VStore`/`CUSTOM` in game.js) and play immediately; Export writes a voicepack.js to make
  them permanent across devices. Playback priority: CUSTOM (device) → window.VOICEPACK → TTS.
  `voice-studio.html` is the older standalone version, now superseded by this.
- `teddy-reading-app-spec.md` — full design spec; read it before significant changes.

## HARD CONSTRAINTS — never violate, even if asked casually
1. NO timers as failure conditions. No countdowns on tasks. Personal-best flair only, if ever.
2. NO harsh failure states: no "WRONG", no red X, no lives, no streak loss, no "you missed a day".
   Wrong answer = gentle dim + replay the sound + retry; after 2 misses, softly pulse the correct answer.
3. NO strobe, rapid flashing, or high-frequency flicker anywhere (seizure-safety stance).
   Shakes/bursts fine; flashes are not. Respect prefers-reduced-motion.
4. ANTI-GAMING RULE (critical pedagogy): sound-identification prompts must NEVER display the
   target letter or its sound-spelling on screen. The displayed prompt is generic
   ("Find the gem that makes the sound… 🔊"); only the AUDIO carries the target.
   The child must process sound→letter, not match text→text.
5. Mastery-paced, never grade/age-gated. Content sequencing: letter→sound→blend→sight words.
   Never introduce material using letters not yet taught.
6. Touch targets stay large (~96px+). Letters use Andika (literacy font). High contrast.
7. Progress saves after EVERY answer (localStorage, schema-versioned, with export/restore in
   Grown-Up Corner). Never ship a change that wipes or breaks existing saves — migrate.
8. All instructions are audio-first (the player cannot read yet). Every prompt has a replay
   button. Any flow that waits on audio MUST use the flow()/watchdog pattern so the game can
   never hang — there is always a ⏭ skip and a Home button.

## Child profile notes (shape, don't over-rotate)
- ADHD front and center: busy, juicy, energetic screens HELP. Fast loops, lots of reward moments.
  The learning content must stay the most salient thing, but the stage can be loud.
- OCD presents as vocal tics, not compulsions — collections/routines are fine and motivating.
- Possible dyslexia (assessment pending): keep Orton-Gillingham-style multi-sensory structure
  (see it, hear it, trace it, find it), heavy varied repetition disguised as new missions.
- Loves: Minecraft (gems/collection), superheroes, muscles, weapons (hammer/sword/cowboy),
  scary-cool villains (Darth Vader), his sisters and friends. Plays Sneaky Sasquatch, so
  progressive systems (meters, inventories, objectives, light stealth) are within reach.

## World canon
- City: Star Force City, powered by Letter Gems. Villain: LORD VEX (Vader-coded cyborg warlord)
  and his VEXBOT soldiers. Hero: Super Teddy (the child is "Teddy"; his hero identity is
  "Super Teddy"), blue glasses = Gem Lenses, gold hex "T" emblem,
  red cape, Word Forge gauntlet. Words forge weapons (Word Hammer, Gem Sword).
- Hero visibly gains muscle as missions complete (3 stages). Hero Base = equip/collection hub.
- Allies are real family/friends, freed from Vex's cages at milestone missions:
  Tank (Archie), Flip (Ellie), Sunny (William, comic relief), Heartguard (Amelia, M2 rescue arc),
  Leighton the Starlight Princess (final rescue at Vex's Fortress). Mentors = Mom & Dad.
- Show only EARNED items in collections (gems, gear, league members) — never empty slots.

## Curriculum state
- Group 1 (live): s a t p i n — SATPIN synthetic phonics order. CVC blending live (at, sat, tap, pin, nap).
- Group 2 (live, "Heart Heights" zone): m d g o c k — ends in the Heartguard/Amelia rescue at
  Heart Tower (missions 9–17; CVC: dad, mad, dig, cat, dog, mom, kid). Foil pools only draw
  from zones <= the mission's zone (lettersFor()).
- Group 3 (live, "Thunder Ridge" zone): e u r h b f — missions 18–26, forge words red/run/rub,
  fun/hen/bed/bug; finale = Vex Captain (no ally rescue; the road to the Fortress). Earns Gem Gauntlet.
- Reading Rally (live, zone 4): DECODE direction — "Read It" missions (27–30) show a word, child
  sounds it out and taps the picture it means (READWORDS, picture-match, audio-first). This is the
  letter→sound→blend READING skill the sound-ID/forge tasks don't cover. Earns the Reading Crown.
- Spell Tower (live, zone 5): Instant Spells — sight ("heart") words (I a the to and is you said),
  SIGHT{} with heart-letter indices. Intro flags the tricky letters with a ♥; practice = hear the
  word, tap the matching written word (recognition). Earns the Spell Tome. taughtSight() is cumulative.
- Group 4 (next): l j v w x y z q. Then decodable sentences ("The cat sat."). Uppercase+lowercase
  paired, lowercase weighted; deliberate uppercase rounds every 3rd rep.
- DIRECTION NOTE (prime objective = reading): scan/find/boss/forge train sound→letter (ID + spell).
  "Read It" adds letter→sound (decode). Keep growing the decode side (sight words, sentences).
- Mastery model: per-grapheme strength scores recorded on every answer. Patrols are ADAPTIVE
  (pickWeak/taughtLetters): they span everything taught so far, weighted toward the weakest items
  (unseen > failing > mastered), and only ever show already-taught letters as distractors.

## Voice/audio system
- Aud.play(ids) plays voicepack clips, falls back to per-line TTS (LINES manifest: {t, r, v}).
- Voice roles: A = Mentor/Narrator, B = Amelia (Heartguard), C = Vexbots/Lord Vex (robotic),
  T = Archie (Tank), F = Ellie (Flip), W = William (Sunny). The friends' lines are best
  recorded in the real kids' voices via the Studio's Upload button (TTS is a stand-in).
- Ally arcs: each freed friend OWNS one mission type and cheers Teddy BY REAL NAME during it
  (Archie→boss, Ellie→trace, William→patrol, Amelia→every win). Cheers are woven into the
  existing flow() sequence (friend line then the letter sound) so the sound is never lost and
  flows can't hang; a face+name pop (allyPop) shows on screen. Cheer-presence only, no combat.
- Letter-sound clips (snd_s … snd_n) are the most pedagogically critical audio; parent may
  replace them with own recordings via the Voice Studio tool (NOT in this repo — it holds an
  API key and must never be committed).

## Working agreement
- Small, reviewable commits with plain-English messages the parent can read.
- After changes, sanity-check: fresh-save playthrough boot → intro → scan → mission 1, plus
  a loaded-save boot. Verify no console errors and that audio flows can't hang.
- When in doubt about a design tradeoff, optimize for: reading reps per minute, then delight.
