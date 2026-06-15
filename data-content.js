/* =========================================================
   DATA — reading content tables (no game-state deps; pure literals).
   CLOZE / FORTMAZE / SCRAMBLE / SENTENCES (reading), SIGHT (heart words),
   READWORDS / READWORDS2 (decode pictures), TRACE (handwriting paths).
   Loaded via <script> BEFORE game.js. Modular-split slice 2.
========================================================= */
const CLOZE=[
  {t:["the","cat","_"],     ans:"sat", foils:["ran","dig"], pic:"🐱"},
  {t:["the","_","is","hot"],ans:"sun", foils:["bug","pig"], pic:"☀️"},
  {t:["you","can","_"],     ans:"run", foils:["nap","hop"], pic:"🏃"},
  {t:["the","pig","is","_"],ans:"big", foils:["red","wet"], pic:"🐷"},
  {t:["the","_","ran"],     ans:"hen", foils:["bed","mug"], pic:"🐔"},
  {t:["the","bug","is","_"],ans:"red", foils:["hot","bun"], pic:"🐛"}
];
/* Fortress-finale Maze items — DISTINCT from the Dojo set so the climax doesn't
   feel like a rerun. Only decodable CVC + taught sight words (I a the to and is
   you said). The finale mixes one picture-match round with these Maze rounds so
   freeing Leighton proves real sentence reading, not just picture-gist. */
const FORTMAZE=[
  {t:["the","dog","can","_"],     ans:"dig", foils:["bed","wax"], pic:"🦴"},
  {t:["the","fox","is","_"],      ans:"red", foils:["hop","van"], pic:"🦊"},
  {t:["you","can","_"],           ans:"hop", foils:["mom","jam"], pic:"🐰"},
  {t:["the","_","is","big"],      ans:"van", foils:["bed","fox"], pic:"🚐"},
  {t:["the","cat","and","I","_"], ans:"nap", foils:["dig","wax"], pic:"😴"}
];
const SCRAMBLE=[
  {words:["the","cat","sat"],      pic:"🐱"},
  {words:["a","dog","ran"],        pic:"🐶"},
  {words:["the","sun","is","hot"], pic:"☀️"},
  {words:["you","can","run"],      pic:"🏃"},
  {words:["the","pig","is","big"], pic:"🐷"},
  {words:["I","had","a","nap"],    pic:"😴"}
];
/* Decodable sentences: only taught CVC words + learned sight words. Each carries
   a picture (its meaning) and a foil that differs by the key word, so the child
   must actually READ it, not guess. The reading finish line. */
const SENTENCES=[
  {t:["the","cat","sat"],        pic:"🐱", foil:"🐶"},
  {t:["a","dog","ran"],          pic:"🐶", foil:"🐱"},
  {t:["the","sun","is","hot"],   pic:"☀️", foil:"🛏️"},
  {t:["the","pig","is","big"],   pic:"🐷", foil:"🐔"},
  {t:["the","hen","ran"],        pic:"🐔", foil:"🐛"},
  {t:["the","bug","is","red"],   pic:"🐛", foil:"🐱"},
  {t:["you","can","run"],        pic:"🏃", foil:"😴"},
  {t:["I","had","a","nap"],      pic:"😴", foil:"🏃"}
];
/* ACT 2 — sentence reading with the medieval skills (digraphs/blends/magic-e/
   vowel-teams) + sight words. Every word is decodable by the time the Great
   Library plays (all Act-2 skills + the 26 letters are taught). curriculum.test
   guards decodability. Read the sentence, tap the picture it tells about. */
const SENTENCES2=[
  {t:["the","ship","is","big"],         pic:"🚢", foil:"🚲"},
  {t:["a","frog","can","jump"],         pic:"🐸", foil:"🐟"},
  {t:["the","king","has","a","ring"],   pic:"🤴", foil:"🐸"},
  {t:["I","see","a","bee"],             pic:"🐝", foil:"🐐"},
  {t:["the","goat","is","on","a","boat"],pic:"⛵", foil:"🚂"},
  {t:["a","fish","can","swim"],         pic:"🐟", foil:"🐸"},
  {t:["the","train","is","fast"],       pic:"🚂", foil:"⛵"},
  {t:["you","can","ride","a","bike"],   pic:"🚲", foil:"🚂"},
  {t:["the","rose","is","red"],         pic:"🌹", foil:"🌳"}
];
/* ACT 2 — cloze / maze (read the sentence, tap the word that fits the blank). */
const CLOZE2=[
  {t:["the","ship","is","_"],          ans:"big",  foils:["red","wet"],   pic:"🚢"},
  {t:["a","frog","can","_"],           ans:"jump", foils:["swim","ship"], pic:"🐸"},
  {t:["I","see","a","_"],              ans:"bee",  foils:["goat","tree"], pic:"🐝"},
  {t:["the","_","is","fast"],          ans:"train",foils:["rose","boat"], pic:"🚂"},
  {t:["you","can","ride","a","_"],     ans:"bike", foils:["bath","ring"], pic:"🚲"},
  {t:["the","goat","is","on","a","_"], ans:"boat", foils:["bike","cake"], pic:"⛵"}
];
/* ACT 2 — Dragon Keep finale Maze. DISTINCT from the Dojo CLOZE2 so the climax
   isn't a rerun (same design as Act-1 FORTMAZE vs CLOZE). Only Act-2-decodable
   words proven in SENTENCES2/CLOZE2 + sight words; curriculum.test guards it. */
const FORTMAZE2=[
  {t:["the","king","has","a","_"], ans:"ring", foils:["rose","boat"], pic:"💍"},
  {t:["a","fish","and","I","_"],   ans:"swim", foils:["jump","ride"], pic:"🐟"},
  {t:["the","rose","is","_"],      ans:"red",  foils:["big","wet"],   pic:"🌹"},
  {t:["the","train","is","_"],     ans:"fast", foils:["red","big"],   pic:"🚂"},
  {t:["a","_","can","jump"],       ans:"frog", foils:["fish","ship"], pic:"🐸"}
];
/* Sight ("heart") words — not fully decodable; learned as wholes. h = indices
   of the "heart"/tricky letters that don't say their usual sound. */
const SIGHT={
  I:{h:[0]}, a:{h:[0]}, the:{h:[2]}, to:{h:[1]}, and:{h:[]},
  is:{h:[1]}, you:{h:[0,1,2]}, said:{h:[1,2]}
};
/* Decodable words for Read-It (DECODE direction): every word uses only taught
   letters and has a clear picture, so reading is checked by meaning, audio-first. */
const READWORDS={
  cat:"🐱", dog:"🐶", hen:"🐔", pig:"🐷", bug:"🐛", sun:"☀️", hat:"🎩", cup:"🥤",
  bus:"🚌", bag:"🎒", cap:"🧢", pan:"🍳", nut:"🥜", fan:"🪭", mug:"☕", pot:"🍲",
  hug:"🤗", bed:"🛏️", net:"🥅", bun:"🍞"
};
/* Act-2 decode words — digraphs (zone 1) + blends (zone 2). Each uses only taught
   graphemes and has a clear picture. */
const READWORDS2={
  ship:"🚢", fish:"🐟", chip:"🍟", duck:"🦆", sock:"🧦", ring:"💍",
  king:"🤴", shop:"🏪", bath:"🛁", chin:"🧔", wing:"🪽", dish:"🍽️",
  frog:"🐸", drum:"🥁", flag:"🚩", crab:"🦀", star:"⭐", hand:"✋",
  jump:"🦘", lamp:"💡", tent:"⛺", mask:"😷", sled:"🛷", gift:"🎁", trap:"🪤", milk:"🥛",
  cake:"🎂", bike:"🚲", gate:"🚪", kite:"🪁", home:"🏠", cube:"🧊", nose:"👃", rose:"🌹",
  rain:"🌧️", train:"🚂", feet:"🦶", tree:"🌳", bee:"🐝", boat:"⛵", goat:"🐐", coat:"🧥", seed:"🌱"
};
const TRACE={
  s:[[[205,80],[150,58],[102,86],[106,132],[160,152],[196,188],[172,236],[102,232]]],
  a:[[[196,128],[150,96],[106,126],[100,176],[140,216],[192,200]],[[200,98],[200,234]]],
  t:[[[150,58],[150,150],[156,228]],[[104,116],[200,116]]],
  p:[[[108,94],[108,256]],[[108,122],[156,96],[196,132],[188,178],[142,196],[108,176]]],
  i:[[[150,108],[150,224]],[[150,64]]],
  n:[[[110,100],[110,224]],[[110,150],[136,104],[176,106],[192,148],[192,224]]],
  m:[[[80,104],[80,224]],[[80,148],[100,108],[128,112],[140,150],[140,224]],[[140,150],[160,108],[188,112],[200,150],[200,224]]],
  d:[[[196,128],[150,96],[106,126],[100,176],[140,216],[192,200]],[[200,62],[200,234]]],
  g:[[[196,128],[150,96],[106,126],[100,176],[140,216],[192,200]],[[200,100],[200,232],[182,262],[140,258]]],
  o:[[[150,92],[106,118],[94,170],[126,214],[178,212],[206,164],[194,116],[150,92]]],
  c:[[[200,110],[150,88],[104,120],[96,172],[140,216],[200,196]]],
  k:[[[105,62],[105,240]],[[185,115],[108,176]],[[122,166],[190,240]]],
  e:[[[108,150],[192,150],[194,118],[162,92],[120,98],[98,134],[100,178],[134,214],[184,200]]],
  u:[[[104,92],[104,176],[126,210],[164,210],[194,178]],[[194,92],[194,232]]],
  r:[[[112,96],[112,224]],[[112,150],[138,108],[180,112]]],
  h:[[[104,58],[104,224]],[[104,150],[130,106],[170,108],[188,150],[188,224]]],
  b:[[[110,58],[110,232]],[[110,150],[150,124],[192,152],[192,202],[150,230],[110,204]]],
  f:[[[192,84],[156,60],[122,86],[120,150],[120,228]],[[90,138],[180,138]]],
  l:[[[150,60],[150,228]]],
  j:[[[172,104],[172,226],[150,260],[112,250]],[[172,62]]],
  v:[[[100,100],[150,224],[200,100]]],
  w:[[[88,100],[120,224],[150,150],[180,224],[212,100]]],
  x:[[[104,104],[196,224]],[[196,104],[104,224]]],
  y:[[[104,100],[150,196]],[[196,100],[150,196],[128,260],[98,254]]],
  z:[[[104,108],[196,108],[104,224],[196,224]]],
  q:[[[196,128],[150,96],[106,126],[100,176],[140,216],[192,200]],[[200,100],[200,234],[220,262]]]
};

/* ARTICULATORY CUES (research rec #3) — for each grapheme the LEARN screen teaches, a child-friendly
   "how your mouth makes it" line + a mouth-shape id (rendered by mouthCue() in art.js). Phonemic
   awareness + articulatory features feed orthographic mapping (Ehri/NRP). Kid-phrased on purpose —
   the adult PH_COACH in the Voice Studio keeps the technical "voiced/unvoiced" wording. Covers the 26
   letters + digraphs + vowel teams (all taught via startLearn); magic-e units have no snd_ clip and
   teach via startMagic, so they are intentionally absent. Shapes by place/manner: open · mid · round ·
   lips · teeth · tongue · back. */
const MOUTHCUE={
  s:{shape:"tongue",say:"Smile, teeth almost shut — let the air hiss: sssss 🐍"},
  a:{shape:"open",  say:"Drop your jaw, open wide: aaa (apple) 🍎"},
  t:{shape:"tongue",say:"Tongue taps behind your top teeth — tiny puff: t"},
  p:{shape:"lips",  say:"Press your lips, then pop a little air: p"},
  i:{shape:"mid",   say:"Open just a little: ih (igloo)"},
  n:{shape:"tongue",say:"Tongue up behind your teeth, hum: nnn"},
  m:{shape:"lips",  say:"Lips together, hum: mmm"},
  d:{shape:"tongue",say:"Tongue taps behind your top teeth: d"},
  g:{shape:"back",  say:"Back of your tongue, quick: g (goat) 🐐"},
  o:{shape:"open",  say:"Round and open: o (octopus) 🐙"},
  c:{shape:"back",  say:"Back of your tongue, sharp: k (cat) 🐱"},
  k:{shape:"back",  say:"Back of your tongue: k (kite) 🪁"},
  e:{shape:"mid",   say:"Open a little, lips relaxed: eh (egg) 🥚"},
  u:{shape:"mid",   say:"Short and relaxed: uh (up) ⬆️"},
  r:{shape:"round", say:"Pull your tongue back and growl: rrr"},
  h:{shape:"back",  say:"Just breath, like fogging glass: h"},
  b:{shape:"lips",  say:"Lips together, little pop: b"},
  f:{shape:"teeth", say:"Top teeth on your bottom lip, push air: fff"},
  l:{shape:"tongue",say:"Tongue tip behind your top teeth: lll"},
  j:{shape:"round", say:"Quick and buzzy: j (jam) 🍓"},
  v:{shape:"teeth", say:"Top teeth on your bottom lip, buzz: vvv"},
  w:{shape:"round", say:"Round your lips: w (win)"},
  x:{shape:"back",  say:"Two quick sounds: k-s (fox) 🦊"},
  y:{shape:"mid",   say:"Quick: y (yes)"},
  z:{shape:"tongue",say:"Like S but buzzy: zzz 🐝"},
  q:{shape:"round", say:"Round your lips: kw (queen) 👑"},
  sh:{shape:"round",say:"Push your lips forward — the quiet sound: shhh 🤫"},
  ch:{shape:"round",say:"Short and snappy: ch (chip)"},
  th:{shape:"tongue",say:"Tongue between your teeth, push air: thhh"},
  wh:{shape:"round",say:"A w with a puff of breath: wh (whale) 🐋"},
  ck:{shape:"back", say:"Just like k: k (duck) 🦆"},
  ng:{shape:"back", say:"Hum at the back of your mouth: ng (ring) 💍"},
  ai:{shape:"open", say:"Two letters, one long sound: ay (rain) 🌧️"},
  ee:{shape:"mid",  say:"Two letters, one long sound: ee (feet) 🦶"},
  oa:{shape:"round",say:"Two letters, one long sound: oh (boat) ⛵"}
};
