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
