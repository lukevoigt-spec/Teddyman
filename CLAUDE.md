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
3. Visual energy is ENCOURAGED — flashes, bursts, shakes, fast juicy feedback all welcome
   (Teddy has no photosensitivity; gameplay/delight wins). Still respect prefers-reduced-motion
   as a courtesy toggle, but the default look can be loud and stimulating.
4. ANTI-GAMING RULE (critical pedagogy): sound-identification prompts must NEVER display the
   target letter or its sound-spelling on screen. The displayed prompt is generic
   ("Find the gem that makes the sound… 🔊"); only the AUDIO carries the target.
   The child must process sound→letter, not match text→text.
5. Mastery-paced, never grade/age-gated. Content sequencing: letter→sound→blend→sight words.
   Never introduce material using letters not yet taught.
6. Touch targets stay large (~96px+). Letters use Andika (literacy font). High contrast.
7. Progress saves after EVERY answer (localStorage, schema-versioned, with export/restore in
   Grown-Up Corner). Never ship a change that wipes or breaks existing saves — migrate. OPTIONAL
   cloud sync: if a Cloudflare Worker URL is set, save() also debounce-pushes to it and boot pulls
   the newer of {cloud,device} (S.ts timestamp, newer-wins) so the same URL on any device continues
   his progress. Device-first/offline-safe; never blocks play. Worker code = cloud/worker.js.
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

## Campaign architecture (long-term: multiple cities/villains)
- The game is a series of ACTS (ACTS[] in game.js). Each act = one city, one villain, one captured
  friend to rescue (the act's finale). Act 1 = Star Force City / Lord Vex / rescue LEIGHTON = the
  MAIN STORY. After Leighton's rescue, an interlude captures a new friend and opens a new city (Act
  2+), continuing the skills ladder (digraphs → long vowels → fluency …).
- Save-id ranges are RESERVED per act so ids never collide: Act 1 = 0–99, Act 2 = 100–199, etc.
  (ACTS[].idBase). New missions always APPEND ids; never renumber (saves are keyed by mission id).
- The map is PER-ACT: zones carry `act`; geomFor(act) computes that act's map geometry; mapSVG /
  toMap render actMissions(currentAct()). S.act (default 1) tracks the current act. Adding an act =
  push to ACTS + add act-tagged zones/missions; the map machinery already scopes to the current act.
- NO SKIPPING AHEAD (foundation can't be rushed): map nodes are done/current/locked (avail(i)= first
  or prev done). The lock is ENFORCED, not just visual — toMap's click handler ignores taps on
  `.locked` nodes (plays a gentle locked_tip cue). Done/current stay replayable. Parent level-override
  (Grown-Up Corner) is the only way to jump.
- Mastery persists across acts (keyed by grapheme/word, act-agnostic). Hero muscle is now
  act-scoped (heroOpts counts current-act done missions) so a new act can RESET his power.
- GOAL / end state: by the end of ACT 2, Teddy should reach ~2nd-grade reading proficiency aligned
  to TEXAS standards (TEKS), ready to enter 3rd grade — then the app is "done." Skills ladder across
  acts: Act 1 = letters→CVC→sight→sentences (done); Act 2 = digraphs/blends→long vowels→fluency.
- ACT 2 ZONE 1 IS LIVE (first vertical slice — STONEKEEP VILLAGE, consonant DIGRAPHS): missions 100–110
  teach sh ch th wh ck ng as "RUNES" (one gem = one sound). GRAPHEME MODEL: DIGRAPHS[] + toGraphemes()
  tokenises words longest-match (ship=[sh,i,p]); backward-compatible (no Act-1 non-sight word contains
  a digraph sequence; sight words stay letter-split). Reused/rethemed Act-1 mechanics, made grapheme-
  aware: learn (digraphs SKIP handwriting trace → straight to sound work), find/boss (foils from
  taughtGraphemes incl. digraphs; boss sprite = dragonSVG in Act 2 via bossSprite()), forge (slots =
  toGraphemes, a digraph is ONE slot), read (READWORDS2 digraph-word pool via readPool()). DIGRAPH_
  MISSION maps each digraph→its learn mission; taughtDigraphs/taughtGraphemes/actGraphemes drive foils
  + the milestone gate (Act-2 finale gates on digraph mastery, since the 26 letters carry over). Words:
  ship/chat/this, duck/sock/ring/king (forge), ship/fish/chip/duck/sock/ring (read), shop/chin/bath/
  wing (Dragon Duel finale). Onboarding: NOAH THE RED intro cutscene (startAct2Intro, noahSVG, lines
  noah1-3, plays once via S.act2intro) runs after the Act-1→Act-2 handoff, then opens the medieval map.
  Map machinery already act-scopes; vexDone guarded to Act-1 only. ART: noahSVG + dragonSVG placeholders
  (art.js, preview in hero-lab.html). TO BUILD NEXT: more Act-2 zones (blends → long vowels/magic-e →
  fluency), Act-2 gear/power-up rewards, real Vixen/dragon/Noah/Miss-Kendall art, an Act-2 finale.
- ACT 2 (FRAME + Zone 1 done; later zones TBD): villain = a smooth-talking
  evil VIXEN (Scarlett-Overkill-coded) who can morph into a DRAGON; her dragon army = Act-2 bosses.
  She kidnaps Miss Kendall + friends JJ, Nora, Cal and escapes through a TIME PORTAL to the MEDIEVAL
  age — Teddy follows and becomes a KNIGHT (new theme/outfit/weapons; the villain steals his powers
  so muscle/gear reset — keeps it fresh, fights repetition). New adult hero ally = NOAH THE RED: a
  powerful wizard companion (Gandalf / Lord-of-the-Rings-coded; tall, red hair + red beard). He is
  Act 2's FIRST helper and mentor-narrator — the Amelia-equivalent of Act 1 (greets/guides Teddy,
  encourages on hard words). Real-person descriptions/images TBD (parent will provide). Likely next
  rescue = Miss Kendall.
  - FRAME ALREADY IN CODE: ACTS[1] = {id:2, city "MEDIEVAL REALM", villain "THE VIXEN", rescue "MISS
    KENDALL", mentor "NOAH THE RED", idBase:100, theme:"knight"}. POWER-RESET is implemented and act-
    scoped: actGearList(act) returns only gear earned from THIS act's missions, and heroOpts() derives
    muscle/belt/boots/weapon from it — so entering Act 2 (S.act=2) shows Teddy POWERLESS again
    (muscle 0, no gear, no weapon). KNIGHT COSTUME is a heroSVG theme: HERO_THEMES.knight swaps the
    blue super-suit for steel armor and the masked head for a knight HELM (placeholder art; refine
    when parent provides references). Preview both in hero-lab.html ("ACT 2 · KNIGHT" section).
    Mastery still persists across acts (keyed by grapheme/word). The Act-1→Act-2 interlude HANDOFF
    is built (see "Act 1 finale" below). TO BUILD NEXT: Act-2 zones+missions (ids 100+, digraphs/
    blends ladder), Noah-the-Red mentor art/voice, real Vixen/dragon art + Miss-Kendall/friend faces.
- Possible mechanic for Act 2: mad-lib / scrambled-sentence WORD-ORDER + Maze/Cloze tasks (validate
  against research for Teddy's profile first; sentence-building supports syntax/comprehension once
  decoding is solid, sequenced AFTER word reading).

## Training Room + Hero Shop (live, supplementary daily loop)
- A second daily activity DECOUPLED from story progression (Hero Base ▸ 🏋️ TRAINING ROOM). Drills the
  highest-transfer skill — BUILD (segment/encode) + DECODE (blend/read) of decodable words, ALTERNATING
  each rep — adaptive to his weakest letters (pickTrainWord weights words by 5−str of their letters).
  No gating, no countdown. Every correct rep calls record() so practice STRENGTHENS mastery (this is
  also the rebalance toward blending/segmenting per the reading-ladder audit). trainPool() = READWORDS
  whose letters are all taught. trainBuild/trainDecode mirror forge/read but loop endlessly + pay coins.
- COINS (S.coins) earned per rep (+1, +2 on combo≥3) → spent in the HERO SHOP (🛒) on a finite COSMETIC
  collection for the Base (BASE_ITEMS: banner/plant/poster/trophy/medal/lamp/vexbot/dragon/crown/rocket).
  Owned items (S.owned) show on the Base TROPHY SHELF (only earned items, per the no-empty-slots rule).
  Cosmetic only — zero pay-to-win, no gameplay perks. paintShop builds cards via createElement.
- DAILY SPLIT: trainTick counts Training-Room time into S.daily.trainSecs (via __inTraining, set in
  show() when id==="scrTrain"); the Progress tab shows the 🎯 missions vs 🏋️ training minute split so a
  parent can aim for a ~15/15 balance. Still a gentle meter — never a countdown or penalty.

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
- Spell Tower (live, zone 6): Instant Spells — sight ("heart") words (I a the to and is you said),
  SIGHT{} with heart-letter indices. SOUND-MAPPING (Heart Word Method), NOT whole-word recognition:
  intro sounds out the regular letters + flags the irregular "heart" letter (♥); practice = hear the
  word and BUILD it from grapheme tiles in order (heart slot marked, regular letters play their
  phoneme, heart letter played as "tricky — we remember it"). isHeart(w,i) drives it. The fortress
  sight-word phase (fortSpell) ALSO builds, not recognizes — there is NO "tap the matching word
  shape" mechanic anywhere (it builds no durable recognition). Earns the Spell Tome; taughtSight()
  cumulative.
- Story Gate (live, zone 6): decodable SENTENCES (the reading goal) — read the sentence, tap the
  picture it tells about (foil differs by a key word). SENTENCES[] use only taught words + sight
  words. Earns the Story Key; mission 36 declares "you can READ." This is the M4 reading payoff.
- Group 4 (live, "Prism Peak" zone): l j v w x y z q — completes the alphabet (26 letters), missions
  37–47, forge words let/jam/van, box/fox/zip/wax; finale "All 26 Gems!" earns the Alphabet Star.
  Placed in the LETTER phase (before the reading zones) via PLAY ORDER while keeping appended save
  ids: the map positions each mission by ZONE MEMBERSHIP (NODEBY/nodeOf), not flat id order, so new
  groups slot in anywhere without breaking saves. ZONES array order = play order (zone ids 1–7).
- Reading Dojo (live, zone 9, plays AFTER Story Gate / BEFORE the Fortress): FLUENCY — Cloze
  (picture-anchored "pick the word that fits the blank", research-backed Maze format) + Scramble
  (hear the sentence, tap the scrambled words into order = syntax/word-order, the reading-safe
  "mad-lib"). CLOZE[]/SCRAMBLE[] use only decodable+sight words. Earns the Fluency Badge. Zone id 9
  sits between story(7) and fortress(8) by play order (map positions by zone, not id).
- Distractors (find/boss/forge foils) now come from taughtLetters() — only already-taught letters,
  never not-yet-taught ones (so e.g. group-4 letters never show before they're learned).
- CONFUSABLE support (dyslexia reversals): CONFUSE{} pairs (b↔d, p↔q, m↔n, n↔u, m↔w); pickFoils()
  preferentially seeds the target's twin as a distractor in find/boss/fortress, so every review
  round trains discrimination once both are taught. Learning a letter whose twin is already known
  shows a side-by-side contrast cue (#letterCue, green✓ vs struck-out twin) + a cue_<letter> tip.
- Uppercase+lowercase paired, lowercase weighted; deliberate uppercase rounds every 3rd rep (TODO
  beyond find's every-3rd-rep upper round).
- DIRECTION NOTE (prime objective = reading): scan/find/boss/forge train sound→letter (ID + spell).
  "Read It" adds letter→sound (decode). Keep growing the decode side (sight words, sentences).
- Mastery model: per-grapheme strength scores recorded on every answer. Patrols are ADAPTIVE
  (pickWeak/taughtLetters): they span everything taught so far, weighted toward the weakest items
  (unseen > failing > mastered), and only ever show already-taught letters as distractors.
- MASTERY GATE (proficiency, not just completion): masteredItem(key) = str>=4 & seen>=4 & acc>=0.75.
  Milestone missions (finale/rescue) are GATED in missionComplete(): if any taught letter isn't
  mastered (coreWeak), it runs masteryReview() — a gentle, focused adaptive patrol of just the weak
  items — and re-checks, looping until mastered. So "rescued an ally / freed Leighton" provably
  means proficiency, with NO failure state (it's framed as a "power-up patrol"). The Progress tab
  shows mastered-for-milestones (★). The future Fortress finale will gate Leighton on full READING
  mastery (decode + sight + sentence), not just letters.

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

## Act 1 finale (live)
- Vex's Fortress (zone 8, mission 48, type "fortress", finale+climax): a long 4-phase boss
  (FORTRESS[]) — sound shield → word-locks (decode) → spells (sight) → READ sentences → free
  Leighton. ~19 rounds, big HP bar, Vex taunts (role C). Gated on letter mastery (the gentle
  power-up patrol) so reaching the win = proven proficiency; the sentence phase makes him READ to
  win. Frees LEIGHTON (joins the league, kind "leighton"). FINALE READING PROOF is MIXED (research
  upgrade applied): the final phase runs one picture-match round for variety, then MAZE/Cloze rounds
  (read the sentence, tap the word that fits the blank — the CBM-validated comprehension check) so
  the win proves real sentence reading, not picture-gist. FORTMAZE[] holds fortress-only maze items
  (decodable + sight words), kept DISTINCT from the Dojo CLOZE[] set. fortSentence() dispatches:
  fRound 0 → fortSentencePic (picture), else → fortMaze.
- ACT-1 → ACT-2 HANDOFF (live, a real cutscene now — not just teaser audio): after Leighton's
  rescue the fortress win screen's CONTINUE button runs startInterlude() (screen scrInter, mirrors
  the intro pattern). Beats: Mom & Dad return (interlude1) → captured friends (interlude2,
  captiveSVG '?' silhouettes — real faces TBD) → THE VIXEN taunts (interlude3, role V, vixenSVG
  placeholder) → time portal + Noah the Red (interlude4, portalSVG) → KNIGHT transformation
  (interlude_knight, heroSVG theme:"knight", powerless). The final NEXT calls finishInterlude() →
  setAct(2) → actComingSoon(): a friendly "to be continued" panel (interlude5 + knight hero) that
  BACK-TO-TITLEs. SAFETY: toMap() and geomFor() now guard the empty Act-2 (no zones/missions yet) —
  toMap routes to actComingSoon, geomFor returns a safe stub — so the flip to Act 2 can never break
  the map. When Act-2 zones/missions are appended (ids 100+), the map machinery picks them up and the
  handoff lands on real content automatically. Placeholder art (vixenSVG/portalSVG/captiveSVG) lives
  in art.js — refine when references arrive.

## Working agreement
- Small, reviewable commits with plain-English messages the parent can read.
- After changes, sanity-check: fresh-save playthrough boot → intro → scan → mission 1, plus
  a loaded-save boot. Verify no console errors and that audio flows can't hang.
- When in doubt about a design tradeoff, optimize for: reading reps per minute, then delight.
