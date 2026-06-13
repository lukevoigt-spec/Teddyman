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
- `data-lines.js` — the LINES voice manifest, extracted from game.js (first slice of the no-build
  MODULAR SPLIT). Pure data, no game-state deps; loaded via its own `<script>` BEFORE game.js (classic
  scripts share the top-level lexical scope, so `const LINES` is visible to game.js as long as load
  order respects deps). The test harnesses load it before game.js too. PATTERN for future slices
  (data-missions, state-save, audio, map, …): extract pure/low-dep blocks, add a `<script>` in
  dependency order, prepend it in both tests/*.test.js, then run the suites + a runtime boot check.
- `data-content.js` — reading content tables (CLOZE/FORTMAZE/SCRAMBLE/SENTENCES/SIGHT/READWORDS/
  READWORDS2/TRACE), pure literals, no deps. Modular-split slice 2; loaded before game.js.
- `data-missions.js` — campaign structure: MISSIONS (the ladder), GEAR_AT (rewards), autoNodes()
  (map node layout), ZONES, ACTS. Slice 3; loaded before game.js.
- `state-save.js` — the STATE + SAVE layer (slice 4, first LOGIC module): the `S` game-state object,
  migrate/load/save (redundant + self-healing), snapshots, PROFILES (per-player saves), optional
  CLOUD sync, daily-stats (ensureDaily/sessionTick). Loaded before game.js so `S` + the save API exist
  before any game.js line runs (cloudConnect's geomFor/GEO refs are in its body, runtime-resolved).
- `audio.js` — the AUDIO engine (slice 5): CUSTOM clip store + VStore (IndexedDB), clipFor, the Aud
  object (play/TTS-fallback/ding), and the flow()/clearFlow()/narrate() helpers + ear-tap listener.
  Loaded before game.js; references $/LINES/refreshAudioStudio only in function bodies / callbacks.
- `allies.js` — the HERO LEAGUE / allies (slice 7): roster data (CAGED/ALLY/LEAGUE/ALLY_COL) + helpers
  (allyMid/allyFreed/allyLine/allyPop/allyMapFig). Loaded before game.js; uses $/S/allyFace at runtime.
- `map.js` — the PAINTED WORLD MAP (slice 6): MAPIMG, ZONESPOTS, the zone helpers (zMissions/zoneDone/
  zoneNext/curZoneIx), mapFriends, mapPaintSVG, toMap. Loaded AFTER game.js (it calls game.js helpers
  heroNow/show/startMission only at runtime — the honest dependency direction). The map nav button
  handlers stay in game.js. NOTE: the OLD scrolling vector map (mapSVG + skyline/trail/etc) was DELETED.
  game.js is now ~1255 lines (was ~2315; −1060 across 7 slices + dead-code removal). MODULAR SPLIT
  STATUS: data×3 + state-save + audio + map + allies done & verified. Remaining in game.js: boot/title/
  intro flow, hero glue (heroOpts/heroNow), the MISSION HANDLERS (most coupled — share CUR/flow/record/
  pickFoils; extract last & carefully), base/shop/training, settings, win/reward screens. Same one-bite,
  rigorous-verify loop (node --check + both test suites + a puppeteer runtime boot exercising the moved
  code). Load order in index.html: art → data-missions → data-content → data-lines → state-save → audio
  → allies → game → map → sfx → music → audio-studio.
- `sfx.js` — SOUND EFFECTS: a synthesized Web-Audio kit (`Sfx`) — NO files, NO licensing, offline,
  adds nothing to the deploy. Sounds: correct / wrong (soft low "nope", never harsh — constraint #2) /
  combo / coin / unlock / win / gem. Own on/off + volume (S.sfxOn / S.sfxVol, default on@0.6), separate
  from voice (S.vol) and music. Loaded AFTER game.js; controls in Settings ▸ Sound (sfxSlider /
  btnSfxToggle). Wired at central choke points: Aud.ding() routes to Sfx.correct (so every existing
  "correct" cue respects the SFX level), record(g,false)→Sfx.wrong, comboPop→Sfx.combo, trainWin→
  Sfx.coin, showUnlock→Sfx.unlock, showWin→Sfx.win.
- `music.js` — BACKGROUND MUSIC: an act-aware looping soundtrack engine (`Music`). Loaded AFTER game.js
  (uses S/currentAct/$/Aud at runtime). Plays a gentle per-act theme (superhero Act 1, medieval Act 2)
  that AUTO-DUCKS to ~26% under any narration (hooked from Aud.play in audio.js: duck on start, unduck
  when the play() race settles) so the audio-first instructions are never masked (hard constraint #8).
  Has its OWN on/off + volume (S.musicOn / S.musicVol — defaults on, 0.34), independent of voice (S.vol)
  and SFX; the parent controls live in Settings ▸ Sound (musicSlider / btnMusicToggle). DROP-IN tracks:
  art/bgm-a1.<mp3|ogg|m4a|wav> (Act 1) + art/bgm-a2.* (Act 2); the engine probes formats and stays SILENT
  if none present, so the module is inert until the parent adds (or Publishes) the music. Autoplay-safe
  (starts on the first user gesture; pauses when the tab is hidden). show() calls Music.setAct on every
  screen change. NOTE: studio voice clips (record + ElevenLabs) are DEVICE-only (IndexedDB) until
  Published to voicepack.js — the Cloudflare cloud sync carries only the save (S), never audio.
- `voicepack.js` — optional shipped audio clips (`window.VOICEPACK = {lineId: dataURI}`).
  NEVER regenerate, rename IDs, or delete it. New narration = add new line IDs to the LINES
  manifest with TTS fallback text (they appear in the in-app studio automatically).
- `audio-studio.js` — the IN-APP VOICE STUDIO (Grown-Up Corner ▸ Audio tab), revamped into a
  guided, bulletproof 3-section flow with a progress dashboard: (1) LETTER SOUNDS — a guided
  one-at-a-time recorder with research-based articulation coaching per phoneme (continuous vs
  stop sounds, NO added schwa, mouth position), record→auto-playback→Keep/Re-record→auto-advance,
  PLUS a power-user grid (tap any of the 37 snd_* phonemes to redo it). Phonemes are DERIVED from
  the `snd_` prefix and are record-primary (TTS/ElevenLabs can't make a clean phoneme). (2) TALKING
  LINES — ElevenLabs key + per-role voice picks REMEMBERED on the device (localStorage `stElKey`/
  `stElVoices`; "Forget key" clears), "Generate all" with progress, per-line gen/upload/delete.
  (3) SAVE TO ALL DEVICES — one-tap Publish (GitHub token) + Download/Restore backup. Clips save to
  the device in IndexedDB (`VStore`/`CUSTOM` in game.js) and play immediately. Playback priority:
  CUSTOM (device) → window.VOICEPACK → TTS. `voice-studio.html` is the older standalone version.
- `teddy-reading-app-spec.md` — full design spec; read it before significant changes.
- `STYLE.md` — the DESIGN SYSTEM: real CSS tokens (`:root` vars), the "premium studio"
  target palette/components, and a gap checklist. Read before any styling/visual change;
  keep using the CSS variables (never raw hexes). Andika stays mandatory for letter content.
- `QA.md` — periodic EXTERNAL review notes (advisory, not binding). On conflict, CLAUDE.md /
  STYLE.md / the spec / direct parent instructions win. Read it after the above for product /
  pedagogy / architecture / visual guidance; update it only for durable observations.

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
   PROFILES (no-auth local players): each player has its OWN save (local keys keyFor(id) + its own
   cloud slot ?k=<id>). Default player "teddy" KEEPS the original keys + cloud key (so existing
   progress is never lost and an existing Worker URL keeps working). Auto-loads the last player; the
   title has a 👥 "switch" picker; add/remove is parent-only in the Grown-Up Corner. removeProfile
   refuses to delete "teddy". DEFAULT_CLOUD_URL (top of game.js) can be hard-coded to the Worker URL
   so NO per-device pasting is ever needed — paste it there once and every device auto-syncs. Save +
   profile layer is regression-tested in tests/save.test.js (25 assertions). LIVE: DEFAULT_CLOUD_URL
   is baked to the parent's Worker; cloud confirmed syncing on-device.
   PARKED (low priority): add an optional baked-in PASSPHRASE so the public Worker URL can't be
   read/written by strangers (key = hash(passphrase+profile) instead of bare profile id). Low stakes
   (a child's reading save), so deferred.
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
- The map is a PAINTED WORLD MAP (live): one generated image per act (art/bg-map.jpeg, bg-map-a2.jpeg)
  with the path + landmarks baked in; mapPaintSVG() overlays an interactive glowing node on each
  zone's painted spot (ZONESPOTS[act] = per-zone [x,y] in a 1000x750 space, calibrated to the path).
  Single screen (no scroll). A node is done(✓)/current(pulse)/locked(padlock); the hero stands on the
  current zone, captured friends (mapFriends) wait nearby, and a Hero Base button sits bottom-left.
  Tapping the CURRENT zone plays its next mission (zoneNext); locked zones are gated. The OLD scrolling
  vector map (mapSVG + its helpers skyline/windowsRow/gemDeco/trailPath/pmod/allyTeasers/heroMarker) is
  now DELETED — only the painted map remains. geomFor/GEO/nodeOf/setAct STAY (still live: setAct, cloud
  pull, the level-override + restore paths all recompute GEO). Adding an act = push to ACTS + act-tagged
  zones/missions + a ZONESPOTS[act] row + (optionally) a painted bg-map-a<N>.
- NO SKIPPING AHEAD (foundation can't be rushed): zone nodes are done/current/locked (current = first
  zone whose missions aren't all done; earlier zones done, later locked). The lock is ENFORCED — toMap's
  click handler ignores `.locked` nodes (plays a gentle locked_tip cue). Done/current stay replayable.
  Within a zone, missions play in id order (zoneNext = first undone). Parent level-override is the only jump.
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
  (art.js, preview in hero-lab.html).
- ACT 2 ZONE 2 IS LIVE (THE IRON FORGE, consonant BLENDS): missions 111–118. IMPORTANT — a blend (st,
  bl, cr, -nd, -mp) is NOT a new gem: it's two sounds held together, so it reuses the single-letter
  model (no grapheme change) and the new skill is blending more phonemes. Built from forge (build the
  cluster word) + read (decode it), reusing the same handlers (zone 102, no new letters). First blend
  mission (id 111) plays Noah's blend_intro explainer ("two letters side by side, said quickly").
  Words: stop/frog/clap, swim/snap/glad/plum, hand/jump/milk/nest, sled/gift/trap/belt (forge); finale
  118 = stomp/blend/crust/drink (initial+final blends). READWORDS2 extended with blend-word pics
  (frog/drum/flag/crab/star/hand/jump/lamp/tent/mask/sled/gift/trap/milk). No blend word contains a
  digraph sequence, so toGraphemes tokenises them as single letters (verified).
- ACT 2 ZONE 3 IS LIVE (THE SPELLERY, LONG VOWELS via MAGIC-E): missions 119–127. The split grapheme
  a_e/i_e/o_e/u_e is NOT tokenised as a discontinuous gem — words still build/decode letter-by-letter
  (cake=c,a,k,e). magicE(word) detects the V-C-e pattern → {v,e,unit}; graphemeSounds(word) sounds the
  vowel LONG (snd_<v>_long = the vowel's NAME) and SKIPS the silent E. Backward-compatible: magicE
  returns null for every Act-1/digraph/blend word (verified). NEW MISSION TYPE "magic" (startMagic):
  Noah's transformation demo — show a short word (cap), tap CAST MAGIC-E, the silent E flies in, the
  vowel flips short→long with sound (cap→cape); credits the unit. scrMagic screen + .magtile/.longv/
  .silente/.flyin/.flip CSS (transform/opacity only). Practiced in forge/read, which are magic-e aware
  (long-vowel audio, silent-E dimmed via .silente on slots/tiles). MAGICE_MISSION maps unit→teach
  mission; taughtMagicE feeds actGraphemes so the finale gates on digraphs+magic-e (cumulative). Words:
  cap→cape/tap→tape, kit→kite/pin→pine, hop→hope/not→note, cub→cube/tub→tube (demos); cake/kite/time,
  home/rope/cube/tube (forge); cake/bike/gate/kite, home/cube/nose/rose (read); cape/kite/rose/cute
  (Vowel Wyrm finale). LONG-VOWEL CLIPS (snd_a_long…) are critical audio the parent may record later.
- ACT-2 FINALE IS LIVE (DRAGON KEEP — zone 106, mission 128, type "fortress", finale+climax): the
  proven 4-phase fortress flow made ACT-AWARE (FORTRESS2 + FCONF; Act-1 path untouched). Dragon boss
  (dragonSVG), Vixen taunts (role V), sound phase uses taughtGraphemes (digraphs), read phase uses
  READWORDS2. Gates on Act-2 mastery (digraphs+magic-e via actGraphemes) then frees MISS KENDALL —
  added to LEAGUE (kind "kendall", placeholder teacher face in allyFace; real photo TBD), shown
  captive on the map until rescued; win returns to the medieval map (no Act 3). Voice lines f2_*/
  kendall*. ACT-2 GEAR re-powers the knight: GEAR_AT 110→Gem Sword, 118→Power Belt, 127→Rocket Boots
  (act-scoped via actGearList; weapon auto-equips on forge). RANK PROGRESSION: the knight advances
  SQUIRE→SOLDIER→KNIGHT by power tier (KNIGHT_TIER in heroSVG: leather cap → steel nose-guard cap →
  full closed helm; armor colour shifts per tier; Base/Progress power label reads the rank in Act 2).
- ACT 2 IS CONTENT-COMPLETE (the full ~2nd-grade ladder is live): zones 101 CASTLETON (digraphs) →
  102 DRAGONSTEEL FORGE (blends) → 103 ENCHANTER'S TOWER (magic-e) → 104 THE SINGING GLADE (VOWEL
  TEAMS ai/ee/oa, missions 129–137) → 105 THE GREAT LIBRARY (FLUENCY: rapid mixed decoding of every
  Act-2 skill, missions 138–141) → 106 DRAGON KEEP (finale, rescue Miss Kendall, mission 128). VOWEL
  TEAMS: VOWELTEAMS=["ai","ee","oa"]; GRAPH2=DIGRAPHS+VOWELTEAMS drives toGraphemes() longest-match
  (rain=[r,ai,n], one gem = one team, the long-vowel sound snd_ai/ee/oa). Backward-compatible: the
  ONLY words containing ai/ee/oa are the new ones + the sight word "said", which is fully sight-handled
  (sw_said audio + spell-builder split(""), NEVER toGraphemes) — verified, and curriculum.test.js
  guards it (24 checks incl. "said voiced whole via sw_said", team tokenisation, decodability by play
  order). VOWELTEAM_MISSION feeds taughtVowelTeams → taughtGraphemes + actGraphemes (so the finale
  gates on digraphs+magic-e+vowel-teams). Learn screen: 2-char graphemes SKIP the trace ("FIND IT!").
- ACT-2 POLISH TODO (not content): real Vixen/Miss-Kendall/friend art; long-vowel + digraph + vowel-
  team phoneme recordings (parent, via the Voice Studio — the snd_ai/ee/oa lines already appear there);
  optional Act-2 sentence-level fluency (currently word-level). The game is now playable end-to-end
  through the full Act-2 ladder.
- PLANNED ENHANCEMENTS (parent-prioritized backlog — "identify 10, do best-first"): (1) AUDIO WORKFLOW
  REDO — streamline + bulletproof the record/ElevenLabs/export/publish pipeline (parent flagged; highest
  learning leverage). (2) SETTINGS OVERHAUL — game-like, intuitive, add missing settings; study how real
  games lay out settings (parent flagged — current Grown-Up Corner isn't intuitive). (3) PERF "Full/Calm/
  Lite" detail tier — DONE: detailLevel()/applyDetail() (game.js) drive body.calm/body.lite from S.detail.
  FULL = idle motion + GPU filters + reward juice; CALM = body.calm (idle character animation off, premium
  specular/blur filters KEPT); LITE = body.calm+body.lite (also strips the GPU-heavy SVG filters + bgLayer
  blur + character rim drop-shadows for old iPads). Reward juice (DOM bursts) + learning content unaffected
  in all tiers. The Display setting button cycles Full→Calm→Lite. Save-safe: legacy S.calm=true maps to
  Lite (preserves existing calm users); new picks store S.detail. (4) SCENE COLOR
  HARMONIZER — DONE: SCENE_TONE/SCENE_TONE2 (game.js) map each scene slot → a dominant KEY light +
  accent RIM; show()/boot push them to body as --scene-key/--scene-rim. #sceneGrade::before/::after
  wash each painting's palette over the stage (screen-blend, low opacity, Calm-aware) and the big
  character art (#titleHero/#baseHero/#winHero/#restHero/.boss > svg) gets a soft scene-rim drop-shadow,
  so the hero reads as lit by the painting behind it. Act-2 medieval scenes get warmer torch/stone/
  dragon-fire overrides. (5) ACT-2 MEDIEVAL UI SKIN (parchment/stone chrome via
  body[data-act=2]; learning tiles stay Andika). (6) HERO EMOTION + random WIN POSES — win poses DONE
  (winpose1-4); hero FACIAL emotion ABANDONED by parent decision (the Gem-Lens mask leaves too little
  face for expression — not worth the art.js risk; do NOT revisit). (7) mentors MOUTH-MOVE
  during narration — DONE: faceSpeak() bobs/nods the speaking cutscene portrait for the audio's duration
  (face-agnostic; reduced-motion/Calm aware). (8) DIEGETIC UI FRAMES — DONE (light-touch, learning tiles
  untouched): #sceneFrame draws corner-bracket "viewfinder" frames at the screen edges, tinted by
  --scene-rim so they match the harmonizer (Act 1 = thin HUD brackets; Act 2 = bigger gold ornate corners
  with a gem accent). pointer-events:none; shown only on gameplay screens (body.framed, FRAME_SLOTS =
  lab/learn/city/battle in show()). The narration .bubble gets a pulsing "live comms" signal dot
  (gold/wax-seal in Act 2). Lite flattens the glow; Calm stops the pulse.
  (9) DAILY-METRIC clarity fix — DONE (firstTime guard on S.daily.missions + day-rollover regression
  test). (10) cosmetic COLLECTIBLE upgrades — DONE: Base gem shelf gems twinkle and a fully-MASTERED gem
  earns a gold ✦ (.gembox.mastered, masteredItem-gated — collection meets mastery); trophies became
  glowing pedestal collectibles. All motion gated on body.calm. QA also wants app-invariant tests (locked-node enforcement, sound-ID hides target, profile-
  name escaping) — fold in alongside whichever enhancement touches that code.
- ACT 2 LORE (now CONTENT-COMPLETE — see the content bullets above; this is the cast/story canon):
  villain = a smooth-talking
  evil VIXEN (Scarlett-Overkill-coded) who can morph into a DRAGON; her dragon army = Act-2 bosses.
  She kidnaps Miss Kendall + friends JJ, Nora, Cal and escapes through a TIME PORTAL to the MEDIEVAL
  age — Teddy follows and becomes a KNIGHT (new theme/outfit/weapons; the villain steals his powers
  so muscle/gear reset — keeps it fresh, fights repetition). New adult hero ally = NOAH THE RED: a
  powerful wizard companion (Gandalf / Lord-of-the-Rings-coded; tall, red hair + red beard). He is
  Act 2's FIRST helper and mentor-narrator — the Amelia-equivalent of Act 1 (greets/guides Teddy,
  encourages on hard words). Real-person descriptions/images TBD (parent will provide). Likely next
  rescue = Miss Kendall.
  - PARKED (planned): rename the Act-2 city "MEDIEVAL REALM" → "MAGIC KINGDOM" and give Act 2 its own
    MEDIEVAL UI skin (non-learning chrome/fonts/feel, like the viral medieval mobile games) — learning
    content keeps Andika + contrast. Theme via body[data-act] / .theme-medieval on setAct(). See STYLE.md §0.5.
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
- CHARACTER ART IS NOW "PREMIUM ANIMATED SVG" (live, all in art.js — the chosen pipeline: keep
  everyone as parametric animated SVG; reserve painted images for backgrounds/maps). heroSVG = a
  HEROIC power stance (hands-on-hips, or weapon raised + gripped when armed) with feSpecularLighting
  (real sculpted 3D sheen), a power aura, glowing emblem, gem-lens glint, contact shadow, and idle
  animation (breathe/blink/cape-sway/aura-pulse/float — all gated behind prefers-reduced-motion). The
  villains/mentor (inkblotSVG/Lord Vex, dragonSVG, vixenSVG, noahSVG) got the same treatment: specular
  lighting, themed auras, glowing pulsing eyes, dragon flame/wing-flap, Noah's glowing staff orb.
  allyFace likenesses are built from the parent's real photos (Archie/Ellie/William/Amelia/Leighton +
  Noah-the-Red = Uncle Noah; Miss Kendall = placeholder). PERF NOTE: the specular/blur filters are GPU
  work — only one big character shows at a time so it's fine, but a "Full/Calm/Lite" detail tier is a
  planned enhancement for older iPads. Tune characters in hero-lab.html / via the puppeteer shot harness.
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
- REGRESSION TESTS (no deps; exit 0 = pass) — run before shipping:
  • `node tests/save.test.js` — migrate() on old/partial/corrupt saves, primary+backup recovery,
    no-clobber rule, snapshot ring, save→load round-trip, profile isolation. Run after any save-layer
    change (KEY/BAKKEY/migrate/load/save/snapshot/profiles).
  • `node tests/curriculum.test.js` — unique mission ids, per-act id ranges, every type handled +
    zone exists, the grapheme model, and THE BIG ONE: no forge/read word uses a letter/grapheme
    before it's taught (play order). Run after ANY mission/word/zone/grapheme change. (This caught a
    real bug: "rub" used "b" before it was taught — now "rug".)
- When in doubt about a design tradeoff, optimize for: reading reps per minute, then delight.
