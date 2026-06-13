/* =========================================================
   DATA — campaign structure: MISSIONS (the ladder), GEAR_AT (rewards),
   autoNodes() (map node layout), ZONES (map), ACTS (the acts).
   Pure data + the autoNodes layout helper (defined before ZONES which
   calls it). No game-state deps. Loaded before game.js. Split slice 3.
========================================================= */
const MISSIONS=[
  {id:0,type:"learn",letter:"s",lbl:"Rescue Gem S",z:1},
  {id:1,type:"learn",letter:"a",lbl:"Rescue Gem A",z:1},
  {id:2,type:"patrol",set:["s","a"],lbl:"Rooftop Patrol",z:1},
  {id:3,type:"learn",letter:"t",lbl:"Rescue Gem T",z:1},
  {id:4,type:"forge",words:["at","sat"],lbl:"Word Forge: First Words",z:1},
  {id:5,type:"learn",letter:"p",lbl:"Rescue Gem P",z:1},
  {id:6,type:"learn",letter:"i",lbl:"Rescue Gem I",z:1},
  {id:7,type:"learn",letter:"n",lbl:"Rescue Gem N",z:1},
  {id:8,type:"forge",words:["tap","pin","nap","sat"],lbl:"Forge Battle: Save the Block",finale:true,z:1},
  /* --- ZONE 2 · HEART HEIGHTS (m d g o c k) — Heartguard rescue arc --- */
  {id:9, type:"learn",letter:"m",lbl:"Rescue Gem M",z:2},
  {id:10,type:"learn",letter:"d",lbl:"Rescue Gem D",z:2},
  {id:11,type:"patrol",set:["m","d","s","a"],lbl:"Skyway Patrol",z:2},
  {id:12,type:"learn",letter:"g",lbl:"Rescue Gem G",z:2},
  {id:13,type:"forge",words:["dad","mad","dig"],lbl:"Word Forge: Power Words",z:2},
  {id:14,type:"learn",letter:"o",lbl:"Rescue Gem O",z:2},
  {id:15,type:"learn",letter:"c",lbl:"Rescue Gem C",z:2},
  {id:16,type:"learn",letter:"k",lbl:"Rescue Gem K",z:2},
  {id:17,type:"forge",words:["cat","dog","mom","kid"],lbl:"Heart Tower: Save Amelia",rescue:true,z:2},
  /* --- ZONE 3 · THUNDER RIDGE (e u r h b f) — the road to Vex's Fortress --- */
  {id:18,type:"learn",letter:"e",lbl:"Rescue Gem E",z:3},
  {id:19,type:"learn",letter:"u",lbl:"Rescue Gem U",z:3},
  {id:20,type:"patrol",set:["e","u","m","s"],lbl:"Ridge Patrol",z:3},
  {id:21,type:"learn",letter:"r",lbl:"Rescue Gem R",z:3},
  {id:22,type:"forge",words:["red","run","rug"],lbl:"Word Forge: Rocket Words",z:3},
  {id:23,type:"learn",letter:"h",lbl:"Rescue Gem H",z:3},
  {id:24,type:"learn",letter:"b",lbl:"Rescue Gem B",z:3},
  {id:25,type:"learn",letter:"f",lbl:"Rescue Gem F",z:3},
  {id:26,type:"forge",words:["fun","hen","bed","bug"],lbl:"Ridge Battle: Vex Captain",finale:true,z:3},
  /* --- ZONE 4 · PRISM PEAK (l j v w x y z q) — completes the alphabet ---
     NOTE: appended ids (37+) but placed here in the LETTER phase via play
     order; the map positions by zone membership so saves stay safe. --- */
  {id:37,type:"learn",letter:"l",lbl:"Rescue Gem L",z:4},
  {id:38,type:"learn",letter:"j",lbl:"Rescue Gem J",z:4},
  {id:39,type:"patrol",set:["l","j","e","s"],lbl:"Prism Patrol",z:4},
  {id:40,type:"learn",letter:"v",lbl:"Rescue Gem V",z:4},
  {id:41,type:"learn",letter:"w",lbl:"Rescue Gem W",z:4},
  {id:42,type:"forge",words:["let","jam","van"],lbl:"Word Forge: Prism Words",z:4},
  {id:43,type:"learn",letter:"x",lbl:"Rescue Gem X",z:4},
  {id:44,type:"learn",letter:"y",lbl:"Rescue Gem Y",z:4},
  {id:45,type:"learn",letter:"z",lbl:"Rescue Gem Z",z:4},
  {id:46,type:"learn",letter:"q",lbl:"Rescue Gem Q",z:4},
  {id:47,type:"forge",words:["box","fox","zip","wax"],lbl:"Prism Peak: All 26 Gems!",finale:true,z:4},
  /* --- ZONE 5 · READING RALLY — DECODE: see the word, read it, tap what it means --- */
  {id:27,type:"read",words:["cat","dog","sun","hat"],lbl:"Reading Rally I",z:5},
  {id:28,type:"read",words:["pig","bug","bed","cup"],lbl:"Reading Rally II",z:5},
  {id:29,type:"read",words:["hen","bus","bag","mug"],lbl:"Reading Rally III",z:5},
  {id:30,type:"read",words:["fan","nut","pot","hug","cap","pan"],lbl:"Reading Champion",z:5},
  /* --- ZONE 6 · SPELL TOWER — sight ("heart") words you just KNOW on sight --- */
  {id:31,type:"spell",new:["I","a","the"],lbl:"Instant Spells I",z:6},
  {id:32,type:"spell",new:["to","and","is"],lbl:"Instant Spells II",z:6},
  {id:33,type:"spell",new:["you","said"],lbl:"Spell Tower: Master Caster",z:6},
  /* --- ZONE 7 · STORY GATE — read whole decodable SENTENCES (the goal) --- */
  {id:34,type:"sentence",sents:[0,1,2],lbl:"Story Gate I",z:7},
  {id:35,type:"sentence",sents:[3,4,5],lbl:"Story Gate II",z:7},
  {id:36,type:"sentence",sents:[6,7],lbl:"Story Gate: First Story",z:7},
  /* --- ZONE 9 · READING DOJO — fluency: Cloze (pick the word that fits) +
     scrambled-sentence ordering. Played AFTER Story Gate, BEFORE the Fortress
     (ids appended; placed here by play order — map positions by zone). --- */
  {id:49,type:"cloze",items:[0,1,2],lbl:"Reading Dojo: Fill the Word",z:9},
  {id:50,type:"scramble",items:[0,1,2],lbl:"Reading Dojo: Build a Sentence",z:9},
  {id:51,type:"cloze",items:[3,4,5],lbl:"Reading Dojo: Fill the Word II",z:9},
  {id:52,type:"scramble",items:[3,4,5],lbl:"Reading Dojo: Sentence Master",z:9},
  /* --- ZONE 8 · VEX'S FORTRESS — Act 1 FINALE: a long multi-phase boss that
     makes Teddy prove letter sounds AND reading to free Leighton --- */
  {id:48,type:"fortress",lbl:"Vex's Fortress: Free Leighton!",finale:true,climax:true,z:8},
  /* ===== ACT 2 (ids 100+) · STONEKEEP VILLAGE — digraphs sh ch th wh ck ng ===== */
  {id:100,type:"learn",letter:"sh",lbl:"Quest: the SH Rune",z:101},
  {id:101,type:"learn",letter:"ch",lbl:"Quest: the CH Rune",z:101},
  {id:102,type:"patrol",set:["sh","ch"],lbl:"Castle Patrol",z:101},
  {id:103,type:"learn",letter:"th",lbl:"Quest: the TH Rune",z:101},
  {id:104,type:"forge",words:["ship","chat","this"],lbl:"Rune Forge: First Runes",z:101},
  {id:105,type:"learn",letter:"wh",lbl:"Quest: the WH Rune",z:101},
  {id:106,type:"learn",letter:"ck",lbl:"Quest: the CK Rune",z:101},
  {id:107,type:"learn",letter:"ng",lbl:"Quest: the NG Rune",z:101},
  {id:108,type:"forge",words:["duck","sock","ring","king"],lbl:"Rune Forge: Power Runes",z:101},
  {id:109,type:"read",words:["ship","fish","chip","duck","sock","ring"],lbl:"Dragon Reading Rally",z:101},
  {id:110,type:"forge",words:["shop","chin","bath","wing"],lbl:"Dragon Duel!",finale:true,z:101},
  /* === ACT 2 · ZONE 2 · THE IRON FORGE — consonant BLENDS (build+decode clusters) === */
  {id:111,type:"forge",words:["stop","frog","clap"],lbl:"Blend Smith: First Blends",z:102},
  {id:112,type:"read", words:["frog","drum","flag","crab","star"],lbl:"Blend Reading I",z:102},
  {id:113,type:"forge",words:["swim","snap","glad","plum"],lbl:"Blend Smith: Twin Blades",z:102},
  {id:114,type:"forge",words:["hand","jump","milk","nest"],lbl:"Blend Smith: End Blends",z:102},
  {id:115,type:"read", words:["hand","jump","lamp","tent","mask"],lbl:"Blend Reading II",z:102},
  {id:116,type:"forge",words:["sled","gift","trap","belt"],lbl:"Blend Smith: Master Blades",z:102},
  {id:117,type:"read", words:["sled","gift","trap","frog","jump","milk"],lbl:"Blend Reading Rally",z:102},
  {id:118,type:"forge",words:["stomp","blend","crust","drink"],lbl:"Dragon Duel: The Iron Wyrm!",finale:true,z:102},
  /* === ACT 2 · ZONE 3 · THE SPELLERY — LONG VOWELS / magic-e (the Magic-E Spell) === */
  {id:119,type:"magic",vowel:"a",unit:"a_e",pairs:[["cap","cape"],["tap","tape"]],lbl:"Magic-E Spell: Long A",z:103},
  {id:120,type:"magic",vowel:"i",unit:"i_e",pairs:[["kit","kite"],["pin","pine"]],lbl:"Magic-E Spell: Long I",z:103},
  {id:121,type:"forge",words:["cake","kite","time"],lbl:"Spell Forge: A & I",z:103},
  {id:122,type:"read", words:["cake","bike","gate","kite"],lbl:"Spellery Reading I",z:103},
  {id:123,type:"magic",vowel:"o",unit:"o_e",pairs:[["hop","hope"],["not","note"]],lbl:"Magic-E Spell: Long O",z:103},
  {id:124,type:"magic",vowel:"u",unit:"u_e",pairs:[["cub","cube"],["tub","tube"]],lbl:"Magic-E Spell: Long U",z:103},
  {id:125,type:"forge",words:["home","rope","cube","tube"],lbl:"Spell Forge: O & U",z:103},
  {id:126,type:"read", words:["home","cube","nose","rose","bike","cake"],lbl:"Spellery Reading Rally",z:103},
  {id:127,type:"forge",words:["cape","kite","rose","cute"],lbl:"Dragon Duel: The Vowel Wyrm!",finale:true,z:103},
  /* === ACT 2 · ZONE 4 · THE SINGING GLADE — VOWEL TEAMS (ai/ee/oa: two vowels, one long sound;
     "two vowels go walking, the first does the talking"). One gem = one team (longest-match). === */
  {id:129,type:"learn",letter:"ai",lbl:"Quest: the AI Team",z:104},
  {id:130,type:"learn",letter:"ee",lbl:"Quest: the EE Team",z:104},
  {id:131,type:"forge",words:["rain","sail","feet","bee"],lbl:"Vowel Forge: AI & EE",z:104},
  {id:132,type:"read", words:["rain","train","feet","tree"],lbl:"Glade Reading I",z:104},
  {id:133,type:"learn",letter:"oa",lbl:"Quest: the OA Team",z:104},
  {id:134,type:"forge",words:["boat","coat","goat","soap"],lbl:"Vowel Forge: OA",z:104},
  {id:135,type:"read", words:["boat","goat","rain","feet"],lbl:"Glade Reading II",z:104},
  {id:136,type:"forge",words:["rain","feet","boat","seed"],lbl:"Vowel Forge Rally",z:104},
  {id:137,type:"forge",words:["sail","tree","road","goat"],lbl:"Dragon Duel: The Vowel Choir!",finale:true,z:104},
  /* === ACT 2 · ZONE 5 · THE GREAT LIBRARY — FLUENCY: rapid mixed decoding across every Act-2
     skill (digraphs + blends + magic-e + vowel teams) for automaticity before the finale. === */
  {id:138,type:"read",words:["ship","frog","cake","rain"],lbl:"Fluency: Mixed Reading I",z:105},
  {id:139,type:"read",words:["chip","jump","home","boat"],lbl:"Fluency: Mixed Reading II",z:105},
  {id:140,type:"read",words:["king","milk","kite","feet"],lbl:"Fluency: Mixed Reading III",z:105},
  {id:141,type:"read",words:["fish","trap","rose","goat","tree"],lbl:"Fluency Rally!",z:105},
  /* SENTENCE-level reading — the 2nd-grade rung: read whole decodable sentences
     (Act-2 words + sight words) for meaning. SENTENCES2/CLOZE2 in data-content.js. */
  {id:142,type:"sentence",sents:[0,1,2,3],lbl:"Story Stones I",z:105},
  {id:143,type:"cloze",items:[0,1,2],lbl:"Word Riddles I",z:105},
  {id:144,type:"sentence",sents:[4,5,6,7,8],lbl:"Story Stones II",z:105},
  {id:145,type:"cloze",items:[3,4,5],lbl:"Word Riddles Rally",z:105},
  /* ===== ACT-2 FINALE — the Dragon Keep: a multi-phase boss (sound→read→spell→read)
     that gates on Act-2 mastery (digraphs + magic-e) and frees MISS KENDALL. ===== */
  {id:128,type:"fortress",lbl:"Dragon Keep: Free Miss Kendall!",finale:true,climax:true,z:106}
];
const GEAR_AT={1:"Power Belt",3:"Rocket Boots",4:"Word Hammer",8:"Gem Sword",13:"Gem Shield",22:"Gem Gauntlet",47:"Alphabet Star",30:"Reading Crown",33:"Spell Tome",36:"Story Key",52:"Fluency Badge",
  /* ACT 2 — the Vixen stole his powers, so he RE-EARNS gear through the medieval ladder
     (act-scoped: actGearList only counts this act's missions, so Act-1 gear isn't double-counted).
     Reuses the appearance-mapped names so the knight visibly re-powers as he progresses. */
  110:"Gem Sword", 118:"Power Belt", 127:"Rocket Boots"};
/* ---------------- WORLD ZONES (drive the map) ----------------
   Each ZONE is one letter group with its own painted-scene slot and its
   mission nodes. To add a group, append a zone (autoNodes() lays out the
   trail) — node positions, hero base, map extents and landmark positions
   all derive from this array. Zone 1 keeps its hand-tuned layout.         */
function autoNodes(count,{y0=1280,step=100,amp=195,cx=400,phase=0}={}){
  const out=[]; for(let i=0;i<count;i++)
    out.push([Math.round(cx+amp*Math.sin(i*0.8+phase)), y0-i*step]);
  return out; }
const ZONES=[
  { id:1, name:"STARBRIGHT SQUARE", bg:"city",
    letters:["s","a","t","p","i","n"],
    base:[470,1408],
    nodes:[[420,1280],[230,1190],[520,1100],[300,1000],[560,900],[330,800],[170,700],[440,600],[300,480]] },
  { id:2, name:"HEARTSTONE HILL", bg:"heights",
    letters:["m","d","g","o","c","k"],
    nodes:autoNodes(9,{y0:370,step:104,phase:2.2}) },
  { id:3, name:"THUNDER RIDGE", bg:"ridge",
    letters:["e","u","r","h","b","f"],
    nodes:autoNodes(9,{y0:-570,step:104,phase:4.6}) },
  { id:4, name:"RAINBOW SUMMIT", bg:"prism",
    letters:["l","j","v","w","x","y","z","q"],
    nodes:autoNodes(11,{y0:-1500,step:104,phase:0.5}) },   /* group 4 — in the letter phase */
  { id:5, name:"READING RALLY", bg:"rally",
    letters:[],   /* no new letters — this zone is decode/reading practice */
    nodes:autoNodes(4,{y0:-2680,step:110,phase:1.2}) },
  { id:6, name:"SPELL TOWER", bg:"spell",
    letters:[],   /* sight-word recognition */
    nodes:autoNodes(3,{y0:-3120,step:112,phase:3.1}) },
  { id:7, name:"STORYTELLER'S GATE", bg:"story",
    letters:[],   /* read whole sentences */
    nodes:autoNodes(3,{y0:-3490,step:114,phase:5.4}) },
  { id:9, name:"READING DOJO", bg:"dojo",
    letters:[],   /* fluency: cloze + scrambled sentences (before the finale) */
    nodes:autoNodes(4,{y0:-3860,step:112,phase:2.0}) },
  { id:8, name:"VEX'S FORTRESS", bg:"fortress",
    letters:[],   /* the Act-1 finale boss */
    nodes:[[400,-4400]] },
  /* ===== ACT 2 · MEDIEVAL REALM — zone 1: consonant DIGRAPHS (sh ch th wh ck ng) ===== */
  { id:101, name:"CASTLETON", bg:"keep", act:2,
    letters:["sh","ch","th","wh","ck","ng"],
    base:[470,1408],
    nodes:autoNodes(11,{y0:1280,step:104,phase:1.0}) },
  /* ===== ACT 2 · zone 2: consonant BLENDS (st bl cr fr… + final -nd -mp -st).
     NOT new gems — a blend is two sounds held together; reuses the single-letter
     model, the new skill is blending more phonemes. ===== */
  { id:102, name:"DRAGONSTEEL FORGE", bg:"forge2", act:2,
    letters:[],   /* no new graphemes — blend practice on known letters */
    nodes:autoNodes(9,{y0:120,step:104,phase:3.2}) },
  /* ===== ACT 2 · zone 3: LONG VOWELS via MAGIC-E (split grapheme a_e i_e o_e u_e).
     Noah's "Magic-E Spell" — a silent E flips a short vowel to its long name. ===== */
  { id:103, name:"ENCHANTER'S TOWER", bg:"spellery", act:2,
    letters:[],   /* the long-vowel "units" are taught via type:"magic" missions */
    nodes:autoNodes(9,{y0:-820,step:104,phase:1.5}) },
  /* ===== ACT 2 · zone 4: VOWEL TEAMS (ai/ee/oa) ===== */
  { id:104, name:"THE SINGING GLADE", bg:"spellery", act:2,
    letters:["ai","ee","oa"], nodes:autoNodes(9,{y0:-1240,step:104,phase:2.6}) },
  /* ===== ACT 2 · zone 5: FLUENCY (rapid mixed decoding) ===== */
  { id:105, name:"THE GREAT LIBRARY", bg:"spellery", act:2,
    letters:[], nodes:autoNodes(8,{y0:-1640,step:96,phase:1.1}) },
  /* ===== ACT 2 · FINALE zone — the Dragon Keep (Vixen's dragon boss, rescue Miss Kendall) ===== */
  { id:106, name:"DRAGON KEEP", bg:"fortress", act:2, letters:[], nodes:[[470,-1700]] }
];
/* ---------------- ACTS / CAMPAIGN ----------------
   The long game is a series of ACTS: each is a city with its own villain and a
   captured friend to rescue (the act's finale). Act 1 = Star Force City / Lord
   Vex / rescue Leighton = the MAIN STORY. Afterwards an interlude captures a new
   friend and opens a new city (Act 2+), continuing the skills ladder.
   Save-id ranges are RESERVED per act so ids never collide:
     Act 1 = 0–99, Act 2 = 100–199, Act 3 = 200–299, ...  (idBase below). */
const ACTS=[
  { id:1, city:"STAR FORCE CITY", villain:"LORD VEX", rescue:"LEIGHTON",
    fortressLabel:"VEX'S FORTRESS · RESCUE LEIGHTON", idBase:0, theme:"hero" },
  /* Act 2 (FRAME ONLY — no missions/zones built yet). Teddy follows the Vixen
     through a time portal to the medieval age and becomes a KNIGHT; she steals
     his powers, so muscle + gear RESET (act-scoped) — fresh start, fights
     repetition. Mentor = Noah the Red (wizard). Rescue = Miss Kendall. */
  { id:2, city:"MEDIEVAL REALM", villain:"THE VIXEN", rescue:"MISS KENDALL",
    mentor:"NOAH THE RED", fortressLabel:"DRAGON KEEP · RESCUE MISS KENDALL",
    idBase:100, theme:"knight" }
];
ZONES.forEach(z=>{ if(z.act===undefined)z.act=1; });   /* existing zones belong to Act 1 */
