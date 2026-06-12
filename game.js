/* =========================================================
   SUPER TEDDY — v2.2 STAR FORCE CITY · CAGED ALLIES
   New: voicepack audio engine (studio clips w/ TTS fallback)
        + real scrollable Star Force City map with landmarks.
========================================================= */
const NAME="Super Teddy";
const LETTERS={
  s:{kw:"sun",icon:"☀️"}, a:{kw:"apple",icon:"🍎"}, t:{kw:"tiger",icon:"🐯"},
  p:{kw:"pig",icon:"🐷"}, i:{kw:"insect",icon:"🐜"}, n:{kw:"nest",icon:"🪺"},
  m:{kw:"monkey",icon:"🐵"}, d:{kw:"dog",icon:"🐶"}, g:{kw:"goat",icon:"🐐"},
  o:{kw:"octopus",icon:"🐙"}, c:{kw:"cat",icon:"🐱"}, k:{kw:"kite",icon:"🪁"},
  e:{kw:"egg",icon:"🥚"}, u:{kw:"umbrella",icon:"☂️"}, r:{kw:"rocket",icon:"🚀"},
  h:{kw:"hat",icon:"🎩"}, b:{kw:"ball",icon:"⚽"}, f:{kw:"fish",icon:"🐟"}
};
const ORDER=["s","a","t","p","i","n","m","d","g","o","c","k","e","u","r","h","b","f"];
/* z = letter-group zone. Foil pools and forge words only ever use letters from
   zones <= the mission's zone — material not yet taught never appears. */
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
  {id:22,type:"forge",words:["red","run","rub"],lbl:"Word Forge: Rocket Words",z:3},
  {id:23,type:"learn",letter:"h",lbl:"Rescue Gem H",z:3},
  {id:24,type:"learn",letter:"b",lbl:"Rescue Gem B",z:3},
  {id:25,type:"learn",letter:"f",lbl:"Rescue Gem F",z:3},
  {id:26,type:"forge",words:["fun","hen","bed","bug"],lbl:"Ridge Battle: Vex Captain",finale:true,z:3},
  /* --- ZONE 4 · READING RALLY — DECODE: see the word, read it, tap what it means --- */
  {id:27,type:"read",words:["cat","dog","sun","hat"],lbl:"Reading Rally I",z:4},
  {id:28,type:"read",words:["pig","bug","bed","cup"],lbl:"Reading Rally II",z:4},
  {id:29,type:"read",words:["hen","bus","bag","mug"],lbl:"Reading Rally III",z:4},
  {id:30,type:"read",words:["fan","nut","pot","hug","cap","pan"],lbl:"Reading Champion",z:4}
];
const GEAR_AT={1:"Power Belt",3:"Rocket Boots",4:"Word Hammer",8:"Gem Sword",13:"Gem Shield",22:"Gem Gauntlet",30:"Reading Crown"};
/* Decodable words for Read-It (DECODE direction): every word uses only taught
   letters and has a clear picture, so reading is checked by meaning, audio-first. */
const READWORDS={
  cat:"🐱", dog:"🐶", hen:"🐔", pig:"🐷", bug:"🐛", sun:"☀️", hat:"🎩", cup:"🥤",
  bus:"🚌", bag:"🎒", cap:"🧢", pan:"🍳", nut:"🥜", fan:"🪭", mug:"☕", pot:"🍲",
  hug:"🤗", bed:"🛏️", net:"🥅", bun:"🍞"
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
  f:[[[192,84],[156,60],[122,86],[120,150],[120,228]],[[90,138],[180,138]]]
};

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
  { id:1, name:"STAR FORCE CITY", bg:"city",
    letters:["s","a","t","p","i","n"],
    base:[470,1408],
    nodes:[[420,1280],[230,1190],[520,1100],[300,1000],[560,900],[330,800],[170,700],[440,600],[300,480]] },
  { id:2, name:"HEART HEIGHTS", bg:"heights",
    letters:["m","d","g","o","c","k"],
    nodes:autoNodes(9,{y0:370,step:104,phase:2.2}) },
  { id:3, name:"THUNDER RIDGE", bg:"ridge",
    letters:["e","u","r","h","b","f"],
    nodes:autoNodes(9,{y0:-570,step:104,phase:4.6}) },
  { id:4, name:"READING RALLY", bg:"rally",
    letters:[],   /* no new letters — this zone is decode/reading practice */
    nodes:autoNodes(4,{y0:-1560,step:110,phase:1.2}) }
];
/* Derived geometry. The canvas grows UPWARD as zones are appended: the
   viewBox top (VIEW_TOP) tracks the highest node, and Vex's fortress always
   sits at the summit; the Heart Tower stands beside the rescue mission.    */
const NODE_POS=ZONES.flatMap(z=>z.nodes);
const BASE_POS=ZONES[0].base;
const MAP_H=Math.max(BASE_POS[1], ...NODE_POS.map(p=>p[1]))+152;
const MIN_Y=Math.min(...NODE_POS.map(p=>p[1]));
const FORT_POS=[400, MIN_Y-210];
const VIEW_TOP=FORT_POS[1]-330;
/* Heart Tower sits beside Amelia's rescue (mission 17), not whatever the last
   zone's final node is — so later zones don't drag it up the map. */
const HEART_NODE=NODE_POS[17]||NODE_POS[NODE_POS.length-1];
const HEART_POS=[HEART_NODE[0]>400 ? HEART_NODE[0]-265 : HEART_NODE[0]+265, HEART_NODE[1]-20];

/* ---------- VOICE LINE MANIFEST (ids shared with Voice Studio) ---------- */
const LINES={
  /* letter sounds — override these with your own recordings for perfect phonics */
  snd_s:{t:"sss",r:.7}, snd_a:{t:"ahh",r:.7}, snd_t:{t:"tuh",r:.75},
  snd_p:{t:"puh",r:.75}, snd_i:{t:"ih",r:.7}, snd_n:{t:"nnn",r:.7},
  snd_m:{t:"mmm",r:.7}, snd_d:{t:"duh",r:.75}, snd_g:{t:"guh",r:.75},
  snd_o:{t:"o",r:.7}, snd_c:{t:"kuh",r:.75}, snd_k:{t:"kuh",r:.75},
  snd_e:{t:"eh",r:.7}, snd_u:{t:"uh",r:.7}, snd_r:{t:"rrr",r:.7},
  snd_h:{t:"hh",r:.7}, snd_b:{t:"buh",r:.75}, snd_f:{t:"fff",r:.7},
  like_s:{t:"Like sun!"}, like_a:{t:"Like apple!"}, like_t:{t:"Like tiger!"},
  like_p:{t:"Like pig!"}, like_i:{t:"Like insect!"}, like_n:{t:"Like nest!"},
  like_m:{t:"Like monkey!"}, like_d:{t:"Like dog!"}, like_g:{t:"Like goat!"},
  like_o:{t:"Like octopus!"}, like_c:{t:"Like cat!"}, like_k:{t:"Like kite!"},
  like_e:{t:"Like egg!"}, like_u:{t:"Like umbrella!"}, like_r:{t:"Like rocket!"},
  like_h:{t:"Like hat!"}, like_b:{t:"Like ball!"}, like_f:{t:"Like fish!"},
  intro_s:{t:"Mission! A Vexbot trapped the Letter Gem S! This is S. It says..."},
  intro_a:{t:"Mission! A Vexbot trapped the Letter Gem A! This is A. It says..."},
  intro_t:{t:"Mission! A Vexbot trapped the Letter Gem T! This is T. It says..."},
  intro_p:{t:"Mission! A Vexbot trapped the Letter Gem P! This is P. It says..."},
  intro_i:{t:"Mission! A Vexbot trapped the Letter Gem I! This is I. It says..."},
  intro_n:{t:"Mission! A Vexbot trapped the Letter Gem N! This is N. It says..."},
  intro_m:{t:"Mission! A Vexbot trapped the Letter Gem M! This is M. It says..."},
  intro_d:{t:"Mission! A Vexbot trapped the Letter Gem D! This is D. It says..."},
  intro_g:{t:"Mission! A Vexbot trapped the Letter Gem G! This is G. It says..."},
  intro_o:{t:"Mission! A Vexbot trapped the Letter Gem O! This is O. It says..."},
  intro_c:{t:"Mission! A Vexbot trapped the Letter Gem C! This is C. It says..."},
  intro_k:{t:"Mission! A Vexbot trapped the Letter Gem K! This is K. It says..."},
  intro_e:{t:"Mission! A Vexbot trapped the Letter Gem E! This is E. It says..."},
  intro_u:{t:"Mission! A Vexbot trapped the Letter Gem U! This is U. It says..."},
  intro_r:{t:"Mission! A Vexbot trapped the Letter Gem R! This is R. It says..."},
  intro_h:{t:"Mission! A Vexbot trapped the Letter Gem H! This is H. It says..."},
  intro_b:{t:"Mission! A Vexbot trapped the Letter Gem B! This is B. It says..."},
  intro_f:{t:"Mission! A Vexbot trapped the Letter Gem F! This is F. It says..."},
  word_at:{t:"at!"}, word_sat:{t:"sat!"}, word_tap:{t:"tap!"}, word_pin:{t:"pin!"}, word_nap:{t:"nap!"},
  word_dad:{t:"dad!"}, word_mad:{t:"mad!"}, word_dig:{t:"dig!"},
  word_cat:{t:"cat!"}, word_dog:{t:"dog!"}, word_mom:{t:"mom!"}, word_kid:{t:"kid!"},
  word_red:{t:"red!"}, word_run:{t:"run!"}, word_rub:{t:"rub!"},
  word_fun:{t:"fun!"}, word_hen:{t:"hen!"}, word_bed:{t:"bed!"}, word_bug:{t:"bug!"},
  word_sun:{t:"sun!"}, word_pig:{t:"pig!"}, word_hat:{t:"hat!"}, word_cup:{t:"cup!"}, word_bus:{t:"bus!"},
  word_bag:{t:"bag!"}, word_cap:{t:"cap!"}, word_pan:{t:"pan!"}, word_nut:{t:"nut!"}, word_fan:{t:"fan!"},
  word_mug:{t:"mug!"}, word_pot:{t:"pot!"}, word_hug:{t:"hug!"}, word_net:{t:"net!"}, word_bun:{t:"bun!"},
  read_intro:{t:"READING RALLY! Now YOU read the words, hero. Sound them out, then tap the picture it means!"},
  read_prompt:{t:"Read the word... then tap what it means!"},
  read_yes:{t:"You READ it! Awesome!"},
  rally_champ:{t:"You are a READING CHAMPION, Super Teddy! You can read real words now!"},
  gear_crown:{t:"The READING CROWN! Only true readers can wear it!"},
  panel1:{t:"This is Star Force City. A city powered by magical Letter Gems, words, and stories."},
  panel2:{t:"But one night, LORD VEX and his Vexbot army attacked! They stole the Letter Gems and smashed every word into pieces. Now nobody can read. Not signs, not books, not even bedtime stories."},
  panel3:{t:"The city needed a hero. The founders of the Hero League, your mom and dad, searched everywhere... and they chose YOU, Super Teddy."},
  panel4:{t:"These are the Gem Lenses. Your glasses are superpowered! With them, you can see hidden Letter Gems nobody else can see."},
  panel5:{t:"Rescue the gems. Rebuild the words. Save Star Force City! Are you ready, Super Teddy?"},
  welcome:{t:"Welcome back, Super Teddy!"},
  pick:{t:"Pick your mission, Super Teddy!"},
  scan_intro:{t:"Lens calibration! Let's charge your Gem Lenses. There are no wrong answers. Every tap makes them stronger!"},
  scan_prompt:{t:"Tap the gem that says..."},
  scan_done:{t:"Lenses fully charged! Time for your first mission, hero!"},
  trace_prompt:{t:"Trace the gem to cut it free! Follow the glowing stars with your finger."},
  freed:{t:"You cut the gem free!"},
  find_prompt:{t:"Find the gem that says..."},
  yes:{t:"Yes!"},
  almost:{t:"Almost! Listen again..."},
  boss_intro:{t:"A VEXBOT is attacking! Blast it! Tap the gem that says..."},
  hit_again:{t:"Direct hit! Again!"},
  dodge:{t:"He dodged! Listen..."},
  flee:{t:"SYSTEM FAILURE! VEXBOT RETREATING!", v:"C"},
  youdidit:{t:"You did it, Super Teddy!"},
  patrol_intro:{t:"Rooftop patrol! Letter Gems are hiding all over the city. Find them, hero!"},
  forge_intro1:{t:"The WORD FORGE is open!"},
  forge_intro2:{t:"Gems together make WORDS. And words forge the mightiest weapons!"},
  forge_build:{t:"Build the word! Listen..."},
  forge_next:{t:"Next sound..."},
  forge_listen:{t:"Listen for the next sound..."},
  blast:{t:"BLAST!"},
  forge_win1:{t:"The Vexbot is DESTROYED!"},
  forge_win2:{t:"You READ words, Super Teddy! You are a true hero!"},
  win_grow:{t:"Gem rescued! Your power grows, Super Teddy! Look at those muscles!"},
  win_gear:{t:"You earned new gear!"},
  gear_belt:{t:"The Power Belt!"}, gear_boots:{t:"Rocket Boots!"}, gear_shield:{t:"The GEM SHIELD! Forged from power words!"}, gear_gauntlet:{t:"The GEM GAUNTLET! Now your word power is unstoppable!"},
  m3_done:{t:"You crushed the Vex Captain and conquered Thunder Ridge! Lord Vex's Fortress is just ahead, Super Teddy..."},
  gear_hammer:{t:"The WORD HAMMER! Forged from your first words!"}, gear_sword:{t:"The GEM SWORD! A true hero's blade!"}, base1:{t:"Welcome to your Hero Base, Super Teddy! Gear up and look strong!"},
  finale1:{t:"Incoming message! ... Super Teddy! It's Amelia!", v:"B"},
  finale2:{t:"Lord Vex trapped me in the Heart Tower! Come rescue me in your next adventure!", v:"B"},
  finale3:{t:"To be continued, hero..."},
  free_tank:{t:"CAGE DESTROYED! You freed Archie! TANK has joined the Hero League... and he is ready to SMASH!"},
  free_flip:{t:"CAGE DESTROYED! You freed Ellie! FLIP has joined the league... backflips, cartwheels, and mid-air gem grabs!"},
  free_sunny:{t:"CAGE DESTROYED! You freed William! SUNNY has joined the league... and things are about to get silly!"},
  free_heart1:{t:"TOWER UNLOCKED! You read your way to the top of Heart Tower!"},
  free_heart2:{t:"Super Teddy! You saved me! I KNEW you could read those words! Heartguard is on the team, little hero!", v:"B"},
  m2_done:{t:"HEARTGUARD has joined the Hero League! Lord Vex is furious... and Star Force City shines brighter than ever!"},
  heart_cheer1:{t:"Amazing reading, Super Teddy!", v:"B"},
  heart_cheer2:{t:"That's my little brother, everyone!", v:"B"},
  heart_cheer3:{t:"Heartguard is SO proud of you!", v:"B"},
  cheer_archie1:{t:"BOOM! Smash that Vexbot, Super Teddy! Archie's got your back!", v:"T"},
  cheer_archie2:{t:"So strong, Super Teddy! That's how Archie does it! Hit it again!", v:"T"},
  cheer_ellie1:{t:"Beautiful, Super Teddy! Ellie says you stuck the landing!", v:"F"},
  cheer_ellie2:{t:"Woo! Super neat tracing! Ellie's doing a cartwheel for you!", v:"F"},
  cheer_will1:{t:"Wheee! William found it! Wait... YOU found it! Hooray!", v:"W"},
  cheer_will2:{t:"Sparkles everywhere! Awesome finding, Super Teddy! Says William!", v:"W"},
  rest1:{t:"The sun is setting over Star Force City..."},
  rest2:{t:"Even heroes rest. Great work today, Super Teddy. The city is safer because of you!"},
  test:{t:"Hello Super Teddy! This is your mentor speaking. Star Force City needs you!"}
};
const GEARLINE={ "Power Belt":"gear_belt","Rocket Boots":"gear_boots","Word Hammer":"gear_hammer","Gem Sword":"gear_sword","Gem Shield":"gear_shield","Gem Gauntlet":"gear_gauntlet","Reading Crown":"gear_crown" };
const GEMCOLOR={s:"#3b82f0",a:"#ff8a3d",t:"#3ec97e",p:"#a06ae8",i:"#7fd9ff",n:"#ffc93c",
  m:"#f06292",d:"#9c2f2f",g:"#1abc9c",o:"#5dade2",c:"#7d3c98",k:"#aab7c4",
  e:"#27ae60",u:"#e67e22",r:"#ff5e57",h:"#5f6dff",b:"#3742fa",f:"#16a085"};

/* ---------------- SAVE ---------------- */
const KEY="heroTeddySave_v1";
let S=load();
function fresh(){return {v:1,intro:false,scan:false,done:{},mastery:{},stars:0,gear:[],equip:{weapon:"none",cape:"red"},session:{count:0,day:"",rest:false}};}
function load(){try{const d=JSON.parse(localStorage.getItem(KEY));if(d&&d.v===1){if(!d.session.day)d.session={count:0,day:"",rest:false};if(!d.equip)d.equip={weapon:"none",cape:"red"};return d;}}catch(e){}return fresh();}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
function today(){return new Date().toDateString();}
function sessionTick(){ if(S.session.day!==today()){S.session={count:0,day:today(),rest:false};save();} }
function mast(g){ if(!S.mastery[g])S.mastery[g]={seen:0,ok:0,str:0}; return S.mastery[g]; }
function record(g,ok){ const m=mast(g); m.seen++; if(ok){m.ok++;m.str=Math.min(5,m.str+1);} else {m.str=Math.max(0,m.str-1);} save(); }

/* ---------------- CUSTOM CLIP STORE ----------------
   Parent-made clips (recorded or generated in the in-app Audio studio) live
   in IndexedDB on THIS device, keyed by line id. CUSTOM mirrors them in
   memory. Playback order is: CUSTOM clip -> shipped window.VOICEPACK -> TTS.
   Nothing here ever overwrites a committed voicepack.js.                    */
let CUSTOM={};
const VStore={ db:null,
  open(){ return new Promise(res=>{ try{
      const r=indexedDB.open("superTeddyAudio",1);
      r.onupgradeneeded=()=>{ if(!r.result.objectStoreNames.contains("clips"))r.result.createObjectStore("clips"); };
      r.onsuccess=()=>{ this.db=r.result; res(this.db); };
      r.onerror=()=>res(null);
    }catch(e){ res(null); } }); },
  all(){ return new Promise(res=>{ if(!this.db)return res({});
    try{ const out={}, cur=this.db.transaction("clips").objectStore("clips").openCursor();
      cur.onsuccess=e=>{ const c=e.target.result; if(c){ out[c.key]=c.value; c.continue(); } else res(out); };
      cur.onerror=()=>res(out);
    }catch(e){ res({}); } }); },
  put(id,uri){ return new Promise(res=>{ if(!this.db)return res(false);
    try{ const tx=this.db.transaction("clips","readwrite"); tx.objectStore("clips").put(uri,id);
      tx.oncomplete=()=>res(true); tx.onerror=()=>res(false);
    }catch(e){ res(false); } }); },
  del(id){ return new Promise(res=>{ if(!this.db)return res(false);
    try{ const tx=this.db.transaction("clips","readwrite"); tx.objectStore("clips").delete(id);
      tx.oncomplete=()=>res(true); tx.onerror=()=>res(false);
    }catch(e){ res(false); } }); }
};
VStore.open().then(()=>VStore.all()).then(m=>{ CUSTOM=m||{};
  if(typeof refreshAudioStudio==="function")refreshAudioStudio(); });
function clipFor(id){ return CUSTOM[id] || ((typeof VOICEPACK!=="undefined") && VOICEPACK[id]) || null; }

/* ---------------- AUDIO ENGINE ----------------
   Plays a parent clip / studio voicepack clip when present, falls back to
   speech synthesis per line otherwise.                                     */
const Aud={
  voice:null, cur:null, token:0,
  hasVP(id){ return !!clipFor(id); },
  pick(){ const vs=speechSynthesis.getVoices().filter(v=>v.lang&&v.lang.startsWith("en"));
    this.voice = vs.find(v=>/samantha/i.test(v.name)) || vs.find(v=>/karen|ava|allison|female/i.test(v.name)) || vs[0]||null; },
  stop(){ this.token++; speechSynthesis.cancel(); if(this.cur){try{this.cur.pause();}catch(e){}this.cur=null;} },
  play(ids){ this.stop(); const my=this.token;
    const seq=Array.isArray(ids)?ids.slice():[ids];
    const cap=4000+2600*seq.length;
    const core=new Promise(res=>{
      const next=()=>{ if(my!==this.token){res();return;}
        if(!seq.length){res();return;}
        const id=seq.shift(); const L=LINES[id]||{t:id}; const src=clipFor(id);
        if(src){
          const a=new Audio(src); this.cur=a;
          a.onended=()=>{this.cur=null;next();}; a.onerror=()=>{this.cur=null;ttsOne();};
          a.play().catch(()=>ttsOne());
          function ttsOne(){ Aud._tts(L,my).then(next); }
        } else { this._tts(L,my).then(next); }
      }; next();
    });
    return Promise.race([core,new Promise(r=>setTimeout(r,cap))]);
  },
  _tts(L,my){ return new Promise(res=>{
      const guard=setTimeout(res,8000);
      if(!("speechSynthesis" in window)){res();return;}
      if(!this.voice)this.pick();
      const u=new SpeechSynthesisUtterance(L.t);
      if(this.voice)u.voice=this.voice;
      u.rate=L.r||0.92; u.pitch=1.05;
      u.onend=()=>{clearTimeout(guard);res();}; u.onerror=()=>{clearTimeout(guard);res();};
      speechSynthesis.speak(u);
  });},
  ding(){ try{ const ctx=Aud.ctx||(Aud.ctx=new (window.AudioContext||window.webkitAudioContext)());
    const o=ctx.createOscillator(),gn=ctx.createGain();
    o.frequency.value=740;o.type="sine";
    gn.gain.setValueAtTime(0.0001,ctx.currentTime);
    gn.gain.exponentialRampToValueAtTime(0.18,ctx.currentTime+0.03);
    gn.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+0.4);
    o.connect(gn).connect(ctx.destination);o.start();o.stop(ctx.currentTime+0.42);
  }catch(e){} }
};
if("speechSynthesis" in window){speechSynthesis.onvoiceschanged=()=>Aud.pick();
  setInterval(()=>{try{if(speechSynthesis.speaking)speechSynthesis.resume();}catch(e){}},4000);}
let lastSeq={};
let __cont=null,__skipT=null;
function flow(p,fn){ __cont=fn; clearTimeout(__skipT);
  const sk=$("btnSkip"); sk.style.display="none";
  __skipT=setTimeout(()=>{ if(__cont)sk.style.display="flex"; },2600);
  p.then(()=>{ if(__cont===fn){ __cont=null; sk.style.display="none"; fn(); } });
}
function clearFlow(){ __cont=null; clearTimeout(__skipT); const sk=$("btnSkip"); if(sk)sk.style.display="none"; }
function narrate(key,el,ids,display){ lastSeq[key]=ids;
  const txt=(display!==undefined)?display:(Array.isArray(ids)?ids:[ids]).map(id=>(LINES[id]||{t:id}).t).join(" ");
  el.querySelector("span").textContent=txt;
  return Aud.play(ids);
}
document.addEventListener("click",e=>{
  const ear=e.target.closest(".ear"); if(!ear)return;
  const k=ear.dataset.ear; if(lastSeq[k])Aud.play(lastSeq[k]);
});

/* ---------------- ART ----------------
   heroSVG lives in art.js (loaded first); heroOpts maps game state to it. */
function heroOpts(){ const done=Object.keys(S.done).length;
  return { muscle: done>=7?2:(done>=3?1:0),
           weapon: S.equip.weapon||"none",
           cape: S.equip.cape||"red",
           belt2:S.gear.includes("Power Belt"), boots2:S.gear.includes("Rocket Boots") }; }
function heroNow(w){ return heroSVG(w,heroOpts()); }
/* ---------------- SCREEN MGMT ---------------- */
const $=id=>document.getElementById(id);
/* Painted-scene slots: screen -> art/bg-<name>.* . Add an image to swap a scene;
   if the file is missing the layer stays transparent and the original look shows.
   Several screens intentionally share one scene (e.g. learn/trace, boss/forge). */
const BG_MAP={ scrTitle:"title", scrIntro:"intro", scrScan:"lab", scrMap:"city", scrRead:"learn",
  scrBase:"base", scrLetter:"learn", scrTrace:"learn", scrFind:"city",
  scrBoss:"battle", scrForge:"battle", scrWin:"victory", scrRest:"rest" };
const __bgCache={};
function setBG(id){ const layer=$("bgLayer"); if(!layer)return;
  const name=BG_MAP[id];
  if(!name){ layer.classList.remove("on"); return; }
  const url="art/bg-"+name+".jpg";
  if(__bgCache[name]===false){ layer.classList.remove("on"); return; }
  const apply=()=>{ layer.style.backgroundImage="url("+url+")"; layer.classList.add("on"); };
  if(__bgCache[name]===true){ apply(); return; }
  const img=new Image();
  img.onload=()=>{ __bgCache[name]=true; if($(id).classList.contains("on"))apply(); };
  img.onerror=()=>{ __bgCache[name]=false; layer.classList.remove("on"); };  /* graceful fallback */
  img.src=url;
}
function show(id){ document.querySelectorAll(".screen").forEach(s=>s.classList.remove("on"));
  $(id).classList.add("on"); $(id).classList.add("fadein");
  setTimeout(()=>$(id).classList.remove("fadein"),600);
  setBG(id);
  $("hud").style.display=(id==="scrTitle")?"none":"flex"; refreshHUD(); }
function refreshHUD(){ $("hudStars").textContent="⚡ "+S.stars; }
function burstAt(el,word){ const r=el.getBoundingClientRect(),st=$("stage").getBoundingClientRect();
  const b=document.createElement("div"); b.className="burst";
  b.style.left=(r.left-st.left+r.width/2-70)+"px"; b.style.top=(r.top-st.top+r.height/2-70)+"px";
  $("stage").appendChild(b); setTimeout(()=>b.remove(),600);
  if(word){ const z=document.createElement("div"); z.className="zapword"; z.textContent=word;
    z.style.left=(r.left-st.left+r.width/2-60)+"px"; z.style.top=(r.top-st.top-40)+"px";
    $("stage").appendChild(z); setTimeout(()=>z.remove(),900); } }

/* ---------------- TITLE ---------------- */
$("titleHero").innerHTML=heroNow(210);
function vpMsg(){ const n=(typeof VOICEPACK!=="undefined")?Object.keys(VOICEPACK).length:0;
  const c=Object.keys(CUSTOM).length;
  const parts=[];
  if(c)parts.push("🎤 "+c+" voices recorded on this iPad");
  if(n)parts.push("🎙️ "+n+" studio lines");
  return parts.length? parts.join(" · ") : "Using built-in voice — record your own in Grown-Up Corner ▸ Audio"; }
$("vpStatus").textContent=vpMsg();
if(S.intro)$("btnContinue").style.display="inline-block";
$("btnStart").onclick=()=>{ Aud.pick(); if(!S.intro)startIntro(); else {Aud.play("welcome"); toMap();} };
$("btnContinue").onclick=()=>{ Aud.pick(); Aud.play("welcome"); toMap(); };

/* ---------------- INTRO ---------------- */
const INTRO=[
 {art:citySVG(), id:"panel1"},
 {art:inkblotSVG(300), id:"panel2"},
 {art:`<div style="display:flex;justify-content:center;padding:24px;">${mentorChips(280)}</div>`, id:"panel3"},
 {art:`<div style="display:flex;justify-content:center;padding:20px;"><svg viewBox="0 0 200 90" width="300"><g stroke="#1d4fb8" stroke-width="9" fill="#cfe6ff" fill-opacity=".4" stroke-linejoin="round"><rect x="20" y="20" width="62" height="50" rx="12"/><rect x="116" y="20" width="62" height="50" rx="12"/><line x1="82" y1="42" x2="116" y2="42"/></g></svg></div>`, id:"panel4"},
 {art:`<div style="display:flex;justify-content:center;">${heroNow(220)}</div>`, id:"panel5"}
];
let introIx=0;
function startIntro(){ introIx=0; show("scrIntro"); paintIntro(); }
function paintIntro(){ const p=INTRO[introIx]; $("introArt").innerHTML=p.art;
  narrate("intro",$("introText"),[p.id]);
  $("btnIntroNext").textContent = introIx<INTRO.length-1?"NEXT ➜":"I'M READY!"; }
$("btnIntroNext").onclick=()=>{ introIx++;
  if(introIx<INTRO.length)paintIntro();
  else { S.intro=true; save(); startScan(); } };

/* ---------------- POWER SCAN ----------------
   One-time baseline, zone-1 letters only (new zones are met in missions). */
const SCAN_SET=ZONES[0].letters;
let scanIx=0;
function startScan(){ if(S.scan){toMap();return;}
  show("scrScan"); scanIx=0;
  flow(narrate("scan",$("scanText"),["scan_intro"]),()=>nextScan()); }
function nextScan(){ if(scanIx>=SCAN_SET.length){ S.scan=true; save();
    flow(narrate("scan",$("scanText"),["scan_done"]),()=>toMap()); return; }
  const target=SCAN_SET[scanIx];
  const foils=SCAN_SET.filter(x=>x!==target).sort(()=>Math.random()-.5).slice(0,2);
  const opts=[target,...foils].sort(()=>Math.random()-.5);
  $("scanProg").textContent="🔍 "+(scanIx+1)+" / "+SCAN_SET.length;
  narrate("scan",$("scanText"),["scan_prompt","snd_"+target],"Tap the gem that makes the sound\u2026 \ud83d\udd0a");
  const row=$("scanTiles"); row.innerHTML="";
  opts.forEach(g=>{ const t=document.createElement("button"); t.className="tile read"; t.textContent=g;
    t.onclick=()=>{ const ok=(g===target);
      mast(target).str=ok?2:0; mast(target).seen++; if(ok)mast(target).ok++; save();
      Aud.ding(); t.classList.add("win"); burstAt(t);
      scanIx++; setTimeout(nextScan,650); };
    row.appendChild(t); });
}

/* ---------------- STAR FORCE CITY MAP ---------------- */
function trailPath(){ const pts=[BASE_POS,...NODE_POS,[FORT_POS[0],FORT_POS[1]+170]];
  let d="M "+pts[0][0]+" "+pts[0][1];
  for(let i=1;i<pts.length;i++){ const a=pts[i-1],b=pts[i];
    const mx=(a[0]+b[0])/2, my=(a[1]+b[1])/2;
    d+=` Q ${a[0]} ${my} ${mx} ${my} T ${b[0]} ${b[1]}`; }
  return d; }
/* positive modulo — JS % returns negatives for negative operands, which made
   building widths negative and hung this loop (map-breaking bug for seed 9) */
function pmod(v,m){ return ((v%m)+m)%m; }
function skyline(y,h0,fill,op,seed){ let out="",x=-30;
  while(x<840){ const w=44+pmod(seed*(x+13)*7,72), h=h0+pmod(seed*(x+5)*13,150);
    out+=`<rect x="${x}" y="${y-h}" width="${w}" height="${h}" fill="${fill}" opacity="${op}"/>`; x+=w+10; }
  return out; }
function windowsRow(y,seed){ let out="",x=-10;
  while(x<820){ if(((x*seed)|0)%4!==0) out+=`<rect x="${x}" y="${y-((x*seed)%160)-20}" width="9" height="12" fill="#ffc93c" opacity=".8"/>`; x+=34; }
  return out; }
function gemDeco(x,y,c,sc=1){ return `<g transform="translate(${x} ${y}) scale(${sc})">
  <polygon points="0,-16 13,-5 8,14 -8,14 -13,-5" fill="${c}" stroke="#150f2e" stroke-width="3.4"/>
  <polyline points="-13,-5 0,-2 13,-5 M0,-2 0,14" fill="none" stroke="#150f2e" stroke-width="2" opacity=".5"/>
  <circle cx="-4" cy="-8" r="2.4" fill="#fff" opacity=".9"/></g>`; }
function mapSVG(){
  const done=id=>!!S.done[id];
  const avail=i=> i===0 || done(MISSIONS[i-1].id);
  let nodes="";
  MISSIONS.forEach((m,i)=>{
    const [x,y]=NODE_POS[i];
    const st=done(m.id)?"done":(avail(i)?"current":"locked");
    const fill=done(m.id)?"#3ec97e":(avail(i)?"#ffc93c":"#3b3360");
    const side = x<400 ? 1 : -1;
    nodes+=`<g class="mnode ${st}" data-mid="${m.id}">
      <ellipse cx="${x}" cy="${y+34}" rx="40" ry="10" fill="#150f2e" opacity=".35"/>
      <circle class="ring" cx="${x}" cy="${y}" r="40" fill="${fill}" stroke="#150f2e" stroke-width="7"/>
      <circle cx="${x}" cy="${y-12}" r="22" fill="#ffffff" opacity=".18"/>
      <text x="${x}" y="${y+13}" text-anchor="middle" font-family="Bangers" font-size="38" fill="#150f2e">${done(m.id)?"✓":(avail(i)?i+1:"🔒")}</text>
      <g transform="translate(${x+side*150},${y})">
        <rect x="-118" y="-20" width="236" height="40" rx="14" fill="rgba(21,15,46,.88)" stroke="#fff6e3" stroke-width="2.5"/>
        <text x="0" y="9" text-anchor="middle" font-family="Bangers" font-size="20" fill="${done(m.id)?"#9fe870":"#ffc93c"}" letter-spacing="1">${m.lbl.toUpperCase()}</text>
      </g></g>`;
  });
  const allDone=MISSIONS.every(m=>done(m.id));
  /* zone divider bands between letter groups */
  let dividers="";
  for(let i=1;i<ZONES.length;i++){
    const dy=Math.round((Math.min(...ZONES[i-1].nodes.map(p=>p[1]))+Math.max(...ZONES[i].nodes.map(p=>p[1])))/2)+52;
    dividers+=`<g transform="translate(400 ${dy})">
      <line x1="-330" y1="0" x2="330" y2="0" stroke="#fff6e3" stroke-width="3" stroke-dasharray="10 14" opacity=".4"/>
      <rect x="-180" y="-21" width="360" height="42" rx="14" fill="rgba(21,15,46,.9)" stroke="#f2a9c4" stroke-width="2.5"/>
      <text x="0" y="9" text-anchor="middle" font-family="Bangers" font-size="22" fill="#f2a9c4" letter-spacing="2">⬆ ${ZONES[i].name} ⬆</text></g>`;
  }
  return `<svg viewBox="0 ${VIEW_TOP} 800 ${MAP_H-VIEW_TOP}">
  <defs>
    <linearGradient id="msky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0e0b26"/><stop offset=".35" stop-color="#2b2066"/>
      <stop offset=".7" stop-color="#5c3a8f"/><stop offset="1" stop-color="#a4538d"/>
    </linearGradient>
    <linearGradient id="trailG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffd75e"/><stop offset="1" stop-color="#f0a82b"/>
    </linearGradient>
    <radialGradient id="moonG" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#fff6e3" stop-opacity=".8"/><stop offset="1" stop-color="#fff6e3" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect y="${VIEW_TOP}" width="800" height="${MAP_H-VIEW_TOP}" fill="url(#msky)"/>
  <circle cx="650" cy="${VIEW_TOP+150}" r="130" fill="url(#moonG)"/>
  <circle cx="650" cy="${VIEW_TOP+150}" r="50" fill="#fff1cf" stroke="#150f2e" stroke-width="5"/>
  <circle cx="632" cy="${VIEW_TOP+138}" r="8" fill="#ead9b4"/><circle cx="664" cy="${VIEW_TOP+162}" r="6" fill="#ead9b4"/>
  <g fill="#fff6e3">${[[120,90],[300,60],[520,110],[80,240],[730,300],[200,180],[420,40],[600,250]].map(([sx,sy])=>`<circle cx="${sx}" cy="${VIEW_TOP+sy}" r="2.5"/>`).join("")}</g>
  <g fill="#fff6e3"><circle cx="120" cy="90" r="3"/><circle cx="300" cy="60" r="2.4"/><circle cx="520" cy="110" r="2.6"/><circle cx="80" cy="240" r="2.2"/><circle cx="730" cy="300" r="2.4"/><circle cx="200" cy="180" r="2"/></g>
  <g class="mcloudB" fill="#4b3e96" stroke="#150f2e" stroke-width="4" opacity=".8">
    <path d="M140 210 q18 -34 54 -27 q12 -26 47 -20 q31 -9 43 16 q32 2 27 31 z"/>
    <path d="M560 320 q15 -28 45 -22 q10 -22 40 -16 q26 -8 36 13 q27 2 23 25 z"/>
  </g>
  <g class="mcloudA" fill="#5a4aa6" stroke="#150f2e" stroke-width="3.4" opacity=".55">
    <path d="M380 130 q13 -24 39 -19 q9 -18 33 -13 q22 -6 31 11 q22 2 18 21 z"/>
  </g>

  ${skyline(MIN_Y+330,70,"#241b4d",.45,6)}
  ${skyline(MIN_Y+560,95,"#2c2158",.65,8)}
  ${windowsRow(MIN_Y+560,13)}
  ${skyline(700,80,"#241b4d",.55,3)}
  ${skyline(980,110,"#2c2158",.8,5)}
  ${windowsRow(980,7)}
  <rect x="0" y="660" width="800" height="50" fill="#7a5aa8" opacity=".25"/>
  ${skyline(1290,130,"#332a66",1,9)}
  ${windowsRow(1290,11)}
  <rect x="0" y="1290" width="800" height="270" fill="#3a2f6e"/>
  <ellipse cx="180" cy="1340" rx="180" ry="46" fill="#2f8f5b" opacity=".9"/>
  <ellipse cx="660" cy="1370" rx="200" ry="52" fill="#2a7d50" opacity=".9"/>

  <!-- LORD VEX'S FORTRESS (always at the summit) -->
  <g transform="translate(${FORT_POS[0]} ${FORT_POS[1]})">
    <path d="M-96 64 L-96 -32 L-64 -64 L-64 -12 L-22 -12 L-22 -86 L0 -118 L22 -86 L22 -12 L64 -12 L64 -64 L96 -32 L96 64 Z"
      fill="#3c1763" stroke="#150f2e" stroke-width="6"/>
    <circle cx="0" cy="-112" r="10" fill="#9fe870"/>
    <rect x="-15" y="8" width="30" height="44" rx="6" fill="#150f2e"/>
    <g transform="translate(0 -156)">
      <circle r="23" fill="#bfe3ff" stroke="#150f2e" stroke-width="4"/>
      <path d="M-9 -2 Q0 -16 9 -2 Q14 8 0 14 Q-14 8 -9 -2Z" fill="#5ea0ff" stroke="#150f2e" stroke-width="3"/>
      <circle cx="0" cy="-4" r="7" fill="#ffd9b8" stroke="#150f2e" stroke-width="2.5"/>
    </g>
    <g transform="translate(0 100)">
      <rect x="-158" y="-21" width="316" height="42" rx="14" fill="rgba(21,15,46,.92)" stroke="#9fe870" stroke-width="2.5"/>
      <text x="0" y="9" text-anchor="middle" font-family="Bangers" font-size="23" fill="#9fe870" letter-spacing="1">${allDone?"LORD VEX AWAITS — COMING SOON!":"VEX'S FORTRESS · RESCUE LEIGHTON"}</text>
    </g>
  </g>

  <!-- HEART TOWER (zone 2 landmark, beside the rescue mission) -->
  <g transform="translate(${HEART_POS[0]} ${HEART_POS[1]})">
    <rect x="-36" y="-90" width="72" height="170" rx="10" fill="#241b4d" stroke="#150f2e" stroke-width="5"/>
    <path d="M0 -122 q16 -20 32 -4 q14 14 -6 32 L0 -68 L-26 -94 q-20 -18 -6 -32 q16 -16 32 4z" fill="${done(17)?"#ff7d9c":"#e6453c"}" stroke="#150f2e" stroke-width="4"/>
    ${done(17)?'<g fill="#ffd75e" opacity=".95"><path d="M0 -168 L7 -150 L-7 -150Z"/><path d="M-46 -140 L-32 -132 L-42 -122Z"/><path d="M46 -140 L32 -132 L42 -122Z"/></g>':''}
    <g fill="#ffc93c" opacity=".85"><rect x="-22" y="-66" width="12" height="15"/><rect x="10" y="-30" width="12" height="15"/><rect x="-22" y="6" width="12" height="15"/></g>
    <g transform="translate(0 116)">
      <rect x="-128" y="-18" width="256" height="36" rx="12" fill="rgba(21,15,46,.92)" stroke="${done(17)?"#3ec97e":"#f2a9c4"}" stroke-width="2.5"/>
      <text x="0" y="8" text-anchor="middle" font-family="Bangers" font-size="20" fill="${done(17)?"#9fe870":"#f2a9c4"}" letter-spacing="1">${done(17)?"HEARTGUARD JOINS THE LEAGUE!":"HEART TOWER · SAVE AMELIA"}</text>
    </g>
  </g>
  ${dividers}

  <!-- the golden trail -->
  <path d="${trailPath()}" fill="none" stroke="#150f2e" stroke-width="44" stroke-linecap="round" opacity=".92"/>
  <path d="${trailPath()}" fill="none" stroke="url(#trailG)" stroke-width="30" stroke-linecap="round"/>
  <path d="${trailPath()}" fill="none" stroke="#fff6e3" stroke-width="5" stroke-linecap="round" stroke-dasharray="16 24" opacity=".85"/>

  ${gemDeco(120,1090,"#3b82f0",1.2)} ${gemDeco(640,1010,"#3ec97e",1)} ${gemDeco(90,860,"#a06ae8",1.1)}
  ${gemDeco(700,760,"#ff8a3d",1)} ${gemDeco(620,470,"#7fd9ff",1.2)} ${gemDeco(150,540,"#ffc93c",1)}

  <!-- HERO BASE node -->
  <g class="mnode current" id="baseNode">
    <ellipse cx="${BASE_POS[0]}" cy="${BASE_POS[1]+52}" rx="86" ry="14" fill="#150f2e" opacity=".35"/>
    <g transform="translate(${BASE_POS[0]} ${BASE_POS[1]})">
      <rect x="-70" y="-30" width="140" height="78" rx="10" fill="#2257c4" stroke="#150f2e" stroke-width="6"/>
      <path d="M-84 -26 L0 -82 L84 -26 Z" fill="#e6453c" stroke="#150f2e" stroke-width="6"/>
      <rect x="-18" y="6" width="36" height="42" rx="6" fill="#150f2e"/>
      <rect x="-54" y="-12" width="24" height="22" rx="4" fill="#ffc93c"/>
      <rect x="30" y="-12" width="24" height="22" rx="4" fill="#ffc93c"/>
      <g transform="translate(0 -50)"><path d="M0 -14 L13 -7 L13 7 L0 14 L-13 7 L-13 -7Z" fill="#ffd75e" stroke="#150f2e" stroke-width="3.4"/><text y="6" text-anchor="middle" font-family="Bangers" font-size="15" fill="#150f2e">T</text></g>
      <text x="0" y="86" text-anchor="middle" font-family="Bangers" font-size="24" fill="#ffc93c" letter-spacing="2">HERO BASE</text>
    </g>
  </g>

  ${allyTeasers()}
  ${heroMarker()}
  ${nodes}
  <g transform="translate(400 30)">
    <rect x="-200" y="0" width="400" height="52" rx="16" fill="rgba(21,15,46,.85)" stroke="#fff6e3" stroke-width="3"/>
    <text x="0" y="36" text-anchor="middle" font-family="Bangers" font-size="28" fill="#ffc93c" letter-spacing="2">⚡ ${S.stars} · SUPER TEDDY'S CITY</text>
  </g>
  </svg>`;
}

const CAGED=[{ix:3,kind:"tank",name:"TANK",real:"ARCHIE"},{ix:6,kind:"flip",name:"FLIP",real:"ELLIE"},{ix:8,kind:"sunny",name:"SUNNY",real:"WILLIAM"}];
/* Hero League: each friend (a REAL person Teddy knows) owns one mission type and
   cheers him BY NAME during it, once freed. Amelia cheers on every win. */
const ALLY={
  tank: {real:"Archie",  owns:"boss",   lines:["cheer_archie1","cheer_archie2"]},
  flip: {real:"Ellie",   owns:"trace",  lines:["cheer_ellie1","cheer_ellie2"]},
  sunny:{real:"William", owns:"patrol", lines:["cheer_will1","cheer_will2"]},
  heart:{real:"Amelia",  owns:"win",    lines:["heart_cheer1","heart_cheer2","heart_cheer3"]}
};
function allyMid(kind){ if(kind==="heart")return 17;
  const c=CAGED.find(x=>x.kind===kind); return c?MISSIONS[c.ix].id:-1; }
function allyFreed(kind){ return !!S.done[allyMid(kind)]; }
function allyLine(kind){ const L=ALLY[kind].lines; return L[Math.floor(Math.random()*L.length)]; }
/* brief celebratory pop of the friend's face + name; auto-removes, no flash */
function allyPop(kind){ const st=$("stage"); if(!st)return;
  const d=document.createElement("div"); d.className="allypop";
  d.innerHTML=`<svg viewBox="-34 -40 68 84" width="76" aria-hidden="true">${allyFace(kind)}</svg>`+
    `<div class="allyname">${(ALLY[kind].real||"").toUpperCase()}!</div>`;
  st.appendChild(d); setTimeout(()=>d.remove(),2200); }
/* Full league roster for the Hero Base shelf (mid = mission that frees them).
   real = the actual person Teddy knows; name = their hero alias. */
const LEAGUE=[...CAGED.map(t=>({mid:MISSIONS[t.ix].id,kind:t.kind,name:t.name,real:t.real})),
  {mid:17,kind:"heart",name:"HEARTGUARD",real:"AMELIA"}];
function allyTeasers(){
  let out="";
  CAGED.forEach(t=>{ const [x,y]=NODE_POS[t.ix]; const side=x<400?1:-1;
    const px=x+side*180; const freed=!!S.done[MISSIONS[t.ix].id];
    if(freed){
      out+=`<g transform="translate(${px} ${y-80})">
        <g fill="#ffc93c" opacity=".9"><path d="M0 -52 L6 -38 L-6 -38Z"/><path d="M-38 -34 L-26 -28 L-34 -20Z"/><path d="M38 -34 L26 -28 L34 -20Z"/></g>
        <g>${allyFace(t.kind)}</g>
        <rect x="-78" y="34" width="156" height="30" rx="10" fill="rgba(21,15,46,.88)" stroke="#3ec97e" stroke-width="2.5"/>
        <text x="0" y="55" text-anchor="middle" font-family="Bangers" font-size="16" fill="#9fe870" letter-spacing="1">${t.real} FREED!</text>
        <text x="0" y="80" text-anchor="middle" font-family="Bangers" font-size="12" fill="#9fe870" opacity=".7" letter-spacing="1">"${t.name}"</text></g>`;
    } else {
      out+=`<g transform="translate(${px} ${y-86})">
        <line x1="0" y1="-66" x2="0" y2="-46" stroke="#23263b" stroke-width="6"/>
        <rect x="-42" y="-46" width="84" height="86" rx="14" fill="rgba(21,15,46,.45)" stroke="#23263b" stroke-width="7"/>
        <g transform="translate(0 -2)">${allyFace(t.kind)}</g>
        <g stroke="#3a3f5e" stroke-width="6"><line x1="-26" y1="-44" x2="-26" y2="38"/><line x1="-9" y1="-44" x2="-9" y2="38"/><line x1="9" y1="-44" x2="9" y2="38"/><line x1="26" y1="-44" x2="26" y2="38"/></g>
        <rect x="-42" y="-46" width="84" height="86" rx="14" fill="none" stroke="#150f2e" stroke-width="4"/>
        <circle cx="0" cy="42" r="9" fill="#e62e2e" stroke="#150f2e" stroke-width="3"/>
        <rect x="-82" y="56" width="164" height="30" rx="10" fill="rgba(21,15,46,.88)" stroke="#e62e2e" stroke-width="2.5"/>
        <text x="0" y="77" text-anchor="middle" font-family="Bangers" font-size="16" fill="#ff9d8f" letter-spacing="1">FREE ${t.real}!</text>
        <text x="0" y="102" text-anchor="middle" font-family="Bangers" font-size="12" fill="#ff9d8f" opacity=".7" letter-spacing="1">"${t.name}"</text></g>`;
    } });
  return out;
}
function heroMarker(){ let ix=0;
  for(let i=0;i<MISSIONS.length;i++){ if(!S.done[MISSIONS[i].id]){ix=i;break;} ix=i; }
  const [x,y]=NODE_POS[ix];
  return `<g transform="translate(${x-44} ${y-186}) scale(.30)">${heroNow(250).replace(/<svg[^>]*>|<\/svg>/g,"")}</g>`;
}
function toMap(){ sessionTick(); show("scrMap");
  $("hudTitle").textContent="STAR FORCE CITY";
  $("mapSVGwrap").innerHTML=mapSVG();
  document.querySelectorAll(".mnode").forEach(n=>{
    if(n.id==="baseNode"){ n.addEventListener("click",showBase); return; }
    n.addEventListener("click",()=>{ const m=MISSIONS.find(x=>x.id==n.dataset.mid); if(m)startMission(m); });
  });
  /* auto-scroll to the hero's current node */
  let ix=0; for(let i=0;i<MISSIONS.length;i++){ if(!S.done[MISSIONS[i].id]){ix=i;break;} ix=i; }
  const frac=Math.max(0,(NODE_POS[ix][1]-VIEW_TOP-380)/(MAP_H-VIEW_TOP));
  requestAnimationFrame(()=>{ const sc=$("mapScroll");
    sc.scrollTop = frac * ($("mapSVGwrap").offsetHeight - sc.clientHeight + 80); });
  Aud.play("pick");
}
$("btnHome").onclick=()=>{Aud.stop();clearFlow();toMap();};
$("btnSkip").onclick=()=>{ Aud.stop(); const f=__cont; clearFlow(); if(f)f(); };

/* ---------------- MISSION FLOW ---------------- */
let CUR=null;
/* Letters allowed as prompts/foils for a mission: only zones up to the
   mission's own zone — never letters that haven't been taught yet. */
function lettersFor(m){ const z=(m&&m.z)||1;
  return ZONES.filter(zz=>zz.id<=z).flatMap(zz=>zz.letters); }
/* Letters actually taught so far (gem rescued) — progress-accurate, so review
   never shows a letter that hasn't been introduced yet. */
function taughtLetters(){ return ORDER.filter(g=>S.done[LETTER_MISSION[g]]); }
/* Adaptive pick: weight toward the child's weakest graphemes (low strength /
   low accuracy / fewest reps) so patrols self-target what needs work. */
function pickWeak(pool){ if(!pool.length)return null;
  const wt=pool.map(g=>{ const m=mast(g); const acc=m.seen?m.ok/m.seen:0;
    return 1 + (5-(m.str||0))*1.4 + (1-acc)*1.2 + (m.seen<3?1.5:0); });
  let r=Math.random()*wt.reduce((a,b)=>a+b,0);
  for(let i=0;i<pool.length;i++){ if((r-=wt[i])<=0)return pool[i]; }
  return pool[pool.length-1]; }
function startMission(m){ clearFlow(); CUR=m; $("hudTitle").textContent=m.lbl.toUpperCase();
  if(m.type==="learn")startLearn(m);
  else if(m.type==="patrol")startPatrol(m.set);
  else if(m.type==="read")startRead(m);
  else startForge(m); }
function missionComplete(){
  const firstTime=!S.done[CUR.id];
  S.done[CUR.id]=true;
  if(firstTime){ S.stars+=3; S.session.count++;
    const gear=GEAR_AT[CUR.id];
    if(gear&&!S.gear.includes(gear))S.gear.push(gear); }
  save(); showWin(firstTime);
}

/* ---------------- LEARN ---------------- */
let learnLetter=null;
function startLearn(m){ learnLetter=m.letter; const L=LETTERS[learnLetter];
  show("scrLetter");
  $("bigGlyph").textContent=learnLetter+" "+learnLetter.toUpperCase();
  $("kwIcon").textContent=L.icon;
  narrate("letter",$("letterText"),["intro_"+learnLetter,"snd_"+learnLetter,"like_"+learnLetter]); }
$("btnLetterGo").onclick=()=>startTrace(learnLetter);

/* ---------------- TRACE ---------------- */
let strokes,strokeIx,dotIx,trail;
function startTrace(g){ show("scrTrace");
  narrate("trace",$("traceText"),["trace_prompt"]);
  strokes=TRACE[g].map(s=>s.slice()); strokeIx=0; dotIx=0; trail=[];
  const svg=$("traceSVG");
  svg.innerHTML=`<text class="guide" x="150" y="232" text-anchor="middle" font-size="260">${g}</text><polyline id="trailLine" fill="none" stroke="#ffc93c" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>`;
  paintDots();
  svg.onpointerdown=svg.onpointermove=ev=>{ if(ev.buttons===0&&ev.type==="pointermove")return; handleTracePoint(ev); }; }
function paintDots(){ const svg=$("traceSVG");
  svg.querySelectorAll(".tdot").forEach(d=>d.remove());
  strokes.forEach((st,si)=>st.forEach((p,pi)=>{
    if(si<strokeIx)return; if(si===strokeIx&&pi<dotIx)return;
    const c=document.createElementNS("http://www.w3.org/2000/svg","circle");
    c.setAttribute("cx",p[0]);c.setAttribute("cy",p[1]);
    c.setAttribute("r",si===strokeIx&&pi===dotIx?16:11);
    c.setAttribute("class","tdot"+(si===strokeIx&&pi===dotIx?" next":""));
    svg.appendChild(c); })); }
function handleTracePoint(ev){ const svg=$("traceSVG"),r=svg.getBoundingClientRect();
  const x=(ev.clientX-r.left)/r.width*300, y=(ev.clientY-r.top)/r.height*300;
  trail.push(x+","+y); if(trail.length>400)trail.shift();
  const tl=$("trailLine"); if(tl)tl.setAttribute("points",trail.join(" "));
  const target=strokes[strokeIx][dotIx];
  if(Math.hypot(x-target[0],y-target[1])<46){
    dotIx++; Aud.ding();
    if(dotIx>=strokes[strokeIx].length){ strokeIx++; dotIx=0; trail=[];
      if(strokeIx>=strokes.length){traceDone();return;} }
    paintDots(); } }
function traceDone(){ const svg=$("traceSVG");
  svg.onpointerdown=svg.onpointermove=null;
  svg.querySelectorAll(".tdot").forEach(d=>d.classList.add("hit"));
  burstAt($("traceWrap"),learnLetter.toUpperCase()+"!");
  let ids=["freed","snd_"+learnLetter];
  if(allyFreed("flip")&&Math.random()<0.6){ ids=[allyLine("flip"),...ids]; allyPop("flip"); }  /* Ellie owns tracing */
  flow(Aud.play(ids),()=>startFind(learnLetter)); }

/* ---------------- FIND ---------------- */
let findTarget,findRep,findGoal,findMiss,patrolSet=null,afterFind=null;
function startFind(g,reps=5,set=null,next=null){ show("scrFind");
  findTarget=g; findRep=0; findGoal=reps; patrolSet=set; afterFind=next; nextFind(); }
function nextFind(){
  if(findRep>=findGoal){ (afterFind||(()=>startBoss(findTarget)))(); return; }
  const g = patrolSet? (pickWeak(patrolSet)||patrolSet[0]) : findTarget;
  findTarget=g; findMiss=0;
  $("findProg").textContent="⭐ "+findRep+" / "+findGoal;
  narrate("find",$("findText"),["find_prompt","snd_"+g],"Find the gem that makes the sound\u2026 \ud83d\udd0a");
  /* patrol foils come only from letters already taught; learn-mission foils from the zone */
  const foilPool=patrolSet||lettersFor(CUR);
  const foils=foilPool.filter(x=>x!==g).sort(()=>Math.random()-.5).slice(0,3);
  const opts=[g,...foils].sort(()=>Math.random()-.5);
  const row=$("findTiles"); row.innerHTML="";
  opts.forEach(o=>{ const t=document.createElement("button"); t.className="tile read";
    const upperRound=(findRep%3===2); t.textContent=upperRound?o.toUpperCase():o; t.dataset.g=o;
    t.onclick=()=>{ if(o===g){ record(g,true); t.classList.add("win"); burstAt(t); Aud.ding();
        findRep++; let lead="yes";
        if(patrolSet&&allyFreed("sunny")&&Math.random()<0.55){ lead=allyLine("sunny"); allyPop("sunny"); }  /* William owns patrols */
        flow(Aud.play([lead,"snd_"+g]),()=>setTimeout(nextFind,160)); }
      else { record(g,false); findMiss++; t.classList.add("dim");
        if(findMiss>=2){ row.querySelectorAll(".tile").forEach(x=>{if(x.dataset.g===g)x.classList.add("hint");}); }
        Aud.play(["almost","snd_"+g]); } };
    row.appendChild(t); }); }

/* ---------------- BOSS ---------------- */
let bossHP;
function startBoss(g){ show("scrBoss"); bossHP=3;
  $("bossArt").innerHTML=`<div class="boss" id="bossSprite">${inkblotSVG(240)}</div>`;
  paintPips("bossPips",bossHP,3);
  narrate("boss",$("bossText"),["boss_intro","snd_"+g],"Blast the Vexbot! Tap the gem that makes the sound\u2026 \ud83d\udd0a");
  bossRound(g); }
function paintPips(id,hp,max){ const p=$(id); p.innerHTML="";
  for(let i=0;i<max;i++){const d=document.createElement("div");d.className="pip"+(i<hp?"":" off");p.appendChild(d);} }
function bossRound(g){
  const foils=lettersFor(CUR).filter(x=>x!==g).sort(()=>Math.random()-.5).slice(0,2);
  const opts=[g,...foils].sort(()=>Math.random()-.5);
  const row=$("bossTiles"); row.innerHTML="";
  opts.forEach(o=>{ const t=document.createElement("button"); t.className="tile read"; t.textContent=o;
    t.onclick=()=>{ if(o===g){ record(g,true); bossHP--; paintPips("bossPips",bossHP,3);
        const bs=$("bossSprite"); bs.classList.add("hitfx"); setTimeout(()=>bs.classList.remove("hitfx"),380);
        burstAt(bs,"ZAP!"); Aud.ding();
        if(bossHP<=0){ bs.classList.add("flee");
          flow(Aud.play(["flee","youdidit"]),missionComplete); }
        else { let lead="hit_again";
          if(allyFreed("tank")&&Math.random()<0.55){ lead=allyLine("tank"); allyPop("tank"); }  /* Archie owns boss battles */
          flow(Aud.play([lead,"snd_"+g]),()=>bossRound(g)); } }
      else { record(g,false); t.classList.add("dim"); Aud.play(["dodge","snd_"+g]); } };
    row.appendChild(t); }); }

/* ---------------- READ IT (DECODE) ----------------
   The reading direction: see the word -> sound it out -> tap the picture it
   means. Letter->sound->blend, checked by meaning. The word IS shown (this is
   reading, not sound-ID), so the anti-gaming rule about hiding the target
   letter does not apply here. */
let readWords,readIx,readGoal,readMiss;
function startRead(m){ show("scrRead");
  readWords=m.words.slice(); readIx=0; readGoal=readWords.length; readMiss=0;
  flow(narrate("read",$("readText"),["read_intro"]),()=>nextRead()); }
function readSoundOut(w){ return Aud.play([...w.split("").map(c=>"snd_"+c),"word_"+w]); }
function nextRead(){
  if(readIx>=readWords.length){
    const champ = CUR.id===30;
    flow(Aud.play(champ?["rally_champ"]:["read_yes"]), missionComplete); return; }
  const w=readWords[readIx]; readMiss=0;
  $("readProg").textContent="📖 "+readIx+" / "+readGoal;
  narrate("read",$("readText"),["read_prompt"],"Read the word… then tap what it means! 📖");
  /* the word, as tappable letter tiles (tap = hear that sound) */
  const wr=$("readWord"); wr.innerHTML="";
  w.split("").forEach(c=>{ const t=document.createElement("button"); t.className="tile read rletter"; t.textContent=c;
    t.onclick=()=>Aud.play("snd_"+c); wr.appendChild(t); });
  /* three picture choices: the word + two other picture-words */
  const foils=Object.keys(READWORDS).filter(x=>x!==w).sort(()=>Math.random()-.5).slice(0,2);
  const opts=[w,...foils].sort(()=>Math.random()-.5);
  const cr=$("readChoices"); cr.innerHTML="";
  opts.forEach(o=>{ const b=document.createElement("button"); b.className="tile picktile"; b.textContent=READWORDS[o]; b.dataset.w=o;
    b.onclick=()=>{ if(o===w){ record("w_"+w,true); b.classList.add("win"); burstAt(b); Aud.ding();
        readIx++; flow(Aud.play(["read_yes",...w.split("").map(c=>"snd_"+c),"word_"+w]),()=>setTimeout(nextRead,200)); }
      else { record("w_"+w,false); readMiss++; b.classList.add("dim");
        if(readMiss>=2){ cr.querySelectorAll(".picktile").forEach(x=>{ if(x.dataset.w===w)x.classList.add("hint"); }); }
        readSoundOut(w); } };
    cr.appendChild(b); }); }
$("btnReadSound").onclick=()=>{ const w=readWords&&readWords[readIx]; if(w)readSoundOut(w); };

/* ---------------- PATROL ---------------- */
function startPatrol(set){ Aud.play("patrol_intro");
  /* adaptive review: span everything taught so far, weighted to weakest items;
     fall back to the mission's authored set if little is taught yet */
  const taught=taughtLetters();
  const pool=taught.length>=2 ? taught : (set||["s","a"]);
  startFind(pool[0],8,pool,()=>missionComplete()); }

/* ---------------- FORGE ---------------- */
let forgeWords,forgeWordIx,forgeSlotIx,forgeHP;
function startForge(m){ show("scrForge");
  forgeWords=m.words.slice(); forgeWordIx=0; forgeHP=forgeWords.length;
  $("forgeBoss").innerHTML=`<div class="boss" id="forgeSprite" style="width:clamp(130px,22vw,200px)">${inkblotSVG(200)}</div>`;
  paintPips("forgePips",forgeHP,forgeWords.length);
  flow(narrate("forge",$("forgeText"),["forge_intro1","forge_intro2"]),()=>forgeWord()); }
function forgeWord(){
  if(forgeWordIx>=forgeWords.length){
    const fs=$("forgeSprite"); if(fs)fs.classList.add("flee");
    flow(Aud.play(["forge_win1","forge_win2"]),missionComplete); return; }
  const w=forgeWords[forgeWordIx]; forgeSlotIx=0;
  narrate("forge",$("forgeText"),["forge_build",...w.split("").map(c=>"snd_"+c),"word_"+w],"Build the word! Listen\u2026 \ud83d\udd0a");
  const slots=$("forgeSlots"); slots.innerHTML="";
  w.split("").forEach(()=>{ const s=document.createElement("div"); s.className="slot read"; slots.appendChild(s); });
  const pool=lettersFor(CUR).filter(x=>!w.includes(x));
  const foil=pool[Math.floor(Math.random()*pool.length)];
  const choices=[...new Set(w.split(""))].concat(foil?[foil]:[]).sort(()=>Math.random()-.5);
  const row=$("forgeChoices"); row.innerHTML="";
  choices.forEach(c=>{ const t=document.createElement("button"); t.className="tile read"; t.textContent=c;
    t.style.width=t.style.height="clamp(80px,13vw,120px)"; t.style.fontSize="clamp(44px,7vw,66px)";
    t.onclick=()=>{ const need=w[forgeSlotIx];
      if(c===need){ record(c,true);
        const slot=slots.children[forgeSlotIx]; slot.textContent=c; slot.classList.add("filled");
        Aud.ding(); forgeSlotIx++;
        if(forgeSlotIx>=w.length){
          forgeHP--; paintPips("forgePips",forgeHP,forgeWords.length);
          const fs=$("forgeSprite"); fs.classList.add("hitfx"); setTimeout(()=>fs.classList.remove("hitfx"),380);
          burstAt(fs,w.toUpperCase()+"!");
          flow(Aud.play([...w.split("").map(x=>"snd_"+x),"word_"+w,"blast"]),()=>{forgeWordIx++;setTimeout(forgeWord,350);});
        } else Aud.play(["snd_"+c,"forge_next"]); }
      else { record(need,false); t.classList.add("dim");
        Aud.play(["forge_listen","snd_"+need]);
        setTimeout(()=>t.classList.remove("dim"),2400); } };
    row.appendChild(t); }); }

/* ---------------- WIN / REST ---------------- */
function showWin(firstTime){ show("scrWin");
  $("winHero").innerHTML=heroNow(170)+
    (CUR.rescue?`<svg viewBox="-32 -36 64 76" width="92" style="vertical-align:bottom;">${allyFace("heart")}<text y="42" text-anchor="middle" font-family="Bangers" font-size="13" fill="#ffc93c">HEARTGUARD</text></svg>`:"");
  const gear=GEAR_AT[CUR.id];
  $("winGear").innerHTML=(firstTime&&gear)?`<div class="gearbadge">NEW GEAR: ⭐ ${gear}</div>`:"";
  let ids;
  if(CUR.rescue) ids=["free_heart1","free_heart2","m2_done"];
  else if(CUR.finale) ids = CUR.z>=3 ? ["m3_done"] : ["finale1","finale2","finale3"];
  else if(firstTime&&gear) ids=["win_grow","win_gear",GEARLINE[gear]];
  else ids=["win_grow"];
  const FREE={3:"free_tank",6:"free_flip",8:"free_sunny"};
  if(firstTime&&FREE[CUR.id])ids.unshift(FREE[CUR.id]);
  /* Heartguard, once rescued, is the league's cheerleader on every win */
  if(S.done[17]&&!CUR.rescue)ids.push("heart_cheer"+(1+(S.stars%3)));
  narrate("win",$("winText"),ids);
  const ix=MISSIONS.findIndex(x=>x.id===CUR.id);
  $("btnWinNext").style.display=(ix<MISSIONS.length-1)?"inline-block":"none";
  $("btnWinNext").onclick=()=>{ if(S.session.count>=3&&!S.session.rest){S.session.rest=true;save();showRest(MISSIONS[ix+1]);} else startMission(MISSIONS[ix+1]); };
  $("btnWinMap").onclick=()=>{ if(S.session.count>=3&&!S.session.rest){S.session.rest=true;save();showRest(null);} else toMap(); }; }
function showRest(nextM){ show("scrRest");
  $("restHero").innerHTML=heroNow(160);
  narrate("rest",$("restText"),["rest1","rest2"]);
  $("btnRestDone").onclick=()=>{Aud.stop();show("scrTitle");};
  $("btnRestMore").onclick=()=>{ nextM?startMission(nextM):toMap(); }; }

/* ---------------- HERO BASE ---------------- */
const LETTER_MISSION={s:0,a:1,t:3,p:5,i:6,n:7,m:9,d:10,g:12,o:14,c:15,k:16,e:18,u:19,r:21,h:23,b:24,f:25};
function showBase(){ clearFlow(); show("scrBase");
  $("hudTitle").textContent="HERO BASE";
  paintBase();
  Aud.play("base1");
}
function paintBase(){
  $("baseHero").innerHTML=heroNow(Math.min(260,window.innerWidth*0.34));
  const o=heroOpts();
  $("powerLbl").textContent=["HERO 💪","SUPER HERO 💪💪","MEGA HERO 💪💪💪"][o.muscle];
  /* weapons */
  const wrow=$("weaponRow"); wrow.innerHTML="";
  const weapons=[["none","HANDS"]];
  if(S.gear.includes("Word Hammer"))weapons.push(["hammer","WORD HAMMER 🔨"]);
  if(S.gear.includes("Gem Sword"))weapons.push(["sword","GEM SWORD ⚔️"]);
  weapons.forEach(([k,lbl])=>{ const b=document.createElement("button");
    b.className="echip"+(S.equip.weapon===k?" onsel":""); b.textContent=lbl;
    b.onclick=()=>{S.equip.weapon=k;save();Aud.ding();paintBase();};
    wrow.appendChild(b); });
  if(weapons.length===1){ const hint=document.createElement("div"); hint.className="baselbl";
    hint.style.fontSize="15px"; hint.textContent="Forge words to earn weapons!"; wrow.appendChild(hint); }
  /* capes */
  const crow=$("capeRow"); crow.innerHTML="";
  const capes=[["red","RED",0],["gold","GOLD",15],["purple","PURPLE",27]];
  capes.forEach(([k,lbl,need])=>{ const locked=S.stars<need;
    const b=document.createElement("button");
    b.className="echip"+(S.equip.cape===k?" onsel":"")+(locked?" lockd":"");
    b.textContent=locked?(lbl+" 🔒 ⚡"+need):lbl;
    b.onclick=()=>{S.equip.cape=k;save();Aud.ding();paintBase();};
    crow.appendChild(b); });
  /* gem shelf: earned letters only */
  const shelf=$("gemShelf"); shelf.innerHTML="";
  let any=false;
  ORDER.forEach(g=>{ if(S.done[LETTER_MISSION[g]]){ any=true;
    shelf.innerHTML+=`<svg viewBox="-20 -22 40 44" width="46"><polygon points="0,-16 13,-5 8,14 -8,14 -13,-5" fill="${GEMCOLOR[g]}" stroke="#150f2e" stroke-width="3"/><circle cx="-4" cy="-8" r="2.4" fill="#fff" opacity=".9"/><text y="9" text-anchor="middle" font-family="Andika" font-weight="700" font-size="17" fill="#150f2e">${g}</text></svg>`; } });
  if(!any)shelf.innerHTML='<div class="baselbl" style="font-size:15px;">Rescue gems on missions to fill your shelf!</div>';
  /* league */
  const lg=$("leagueShelf"); lg.innerHTML="";
  let anyL=false;
  LEAGUE.forEach(t=>{ if(S.done[t.mid]){ anyL=true;
    lg.innerHTML+=`<svg viewBox="-32 -36 64 86" width="54"><g>${allyFace(t.kind)}</g><text y="42" text-anchor="middle" font-family="Bangers" font-size="13" fill="#ffc93c">${t.real}</text><text y="55" text-anchor="middle" font-family="Bangers" font-size="9.5" fill="#9b94c9" letter-spacing=".5">"${t.name}"</text></svg>`; } });
  if(!anyL)lg.innerHTML='<div class="baselbl" style="font-size:15px;">Smash Vex\u2019s cages to free your friends!</div>';
}
$("btnBaseBack").onclick=()=>{Aud.stop();toMap();};

/* ---------------- SETTINGS ---------------- */
$("btnGear").onclick=()=>{ $("saveBox").value=JSON.stringify(S); $("vpStatus2").textContent=vpMsg(); $("settingsPanel").classList.add("on"); };
$("btnCloseSettings").onclick=()=>$("settingsPanel").classList.remove("on");
$("btnVoiceTest").onclick=()=>{Aud.pick();Aud.play("test");};
$("btnCopySave").onclick=()=>{$("saveBox").select();document.execCommand("copy");};
$("btnRestoreSave").onclick=()=>{ try{const d=JSON.parse($("saveBox").value);
  if(d&&d.v===1){S=d;save();$("settingsPanel").classList.remove("on");toMap();}}catch(e){alert("That backup code didn't work — double-check it and try again.");} };
