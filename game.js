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
  o:{kw:"octopus",icon:"🐙"}, c:{kw:"cat",icon:"🐱"}, k:{kw:"kite",icon:"🪁"}
};
const ORDER=["s","a","t","p","i","n","m","d","g","o","c","k"];
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
  {id:17,type:"forge",words:["cat","dog","mom","kid"],lbl:"Heart Tower: Save Amelia",rescue:true,z:2}
];
const GEAR_AT={1:"Power Belt",3:"Rocket Boots",4:"Word Hammer",8:"Gem Sword",13:"Gem Shield"};
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
  k:[[[105,62],[105,240]],[[185,115],[108,176]],[[122,166],[190,240]]]
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
    nodes:autoNodes(9,{y0:370,step:104,phase:2.2}) }
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
const LAST_NODE=NODE_POS[NODE_POS.length-1];
const HEART_POS=[LAST_NODE[0]>400 ? LAST_NODE[0]-265 : LAST_NODE[0]+265, LAST_NODE[1]-20];

/* ---------- VOICE LINE MANIFEST (ids shared with Voice Studio) ---------- */
const LINES={
  /* letter sounds — override these with your own recordings for perfect phonics */
  snd_s:{t:"sss",r:.7}, snd_a:{t:"ahh",r:.7}, snd_t:{t:"tuh",r:.75},
  snd_p:{t:"puh",r:.75}, snd_i:{t:"ih",r:.7}, snd_n:{t:"nnn",r:.7},
  snd_m:{t:"mmm",r:.7}, snd_d:{t:"duh",r:.75}, snd_g:{t:"guh",r:.75},
  snd_o:{t:"o",r:.7}, snd_c:{t:"kuh",r:.75}, snd_k:{t:"kuh",r:.75},
  like_s:{t:"Like sun!"}, like_a:{t:"Like apple!"}, like_t:{t:"Like tiger!"},
  like_p:{t:"Like pig!"}, like_i:{t:"Like insect!"}, like_n:{t:"Like nest!"},
  like_m:{t:"Like monkey!"}, like_d:{t:"Like dog!"}, like_g:{t:"Like goat!"},
  like_o:{t:"Like octopus!"}, like_c:{t:"Like cat!"}, like_k:{t:"Like kite!"},
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
  word_at:{t:"at!"}, word_sat:{t:"sat!"}, word_tap:{t:"tap!"}, word_pin:{t:"pin!"}, word_nap:{t:"nap!"},
  word_dad:{t:"dad!"}, word_mad:{t:"mad!"}, word_dig:{t:"dig!"},
  word_cat:{t:"cat!"}, word_dog:{t:"dog!"}, word_mom:{t:"mom!"}, word_kid:{t:"kid!"},
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
  gear_belt:{t:"The Power Belt!"}, gear_boots:{t:"Rocket Boots!"}, gear_shield:{t:"The GEM SHIELD! Forged from power words!"},
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
const GEARLINE={ "Power Belt":"gear_belt","Rocket Boots":"gear_boots","Word Hammer":"gear_hammer","Gem Sword":"gear_sword","Gem Shield":"gear_shield" };
const GEMCOLOR={s:"#3b82f0",a:"#ff8a3d",t:"#3ec97e",p:"#a06ae8",i:"#7fd9ff",n:"#ffc93c",
  m:"#f06292",d:"#9c2f2f",g:"#1abc9c",o:"#5dade2",c:"#7d3c98",k:"#aab7c4"};

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

/* ---------------- AUDIO ENGINE ----------------
   Plays studio voicepack clips when present (window.VOICEPACK),
   falls back to speech synthesis per line otherwise.            */
const Aud={
  voice:null, cur:null, token:0,
  hasVP(id){ return (typeof VOICEPACK!=="undefined") && VOICEPACK[id]; },
  pick(){ const vs=speechSynthesis.getVoices().filter(v=>v.lang&&v.lang.startsWith("en"));
    this.voice = vs.find(v=>/samantha/i.test(v.name)) || vs.find(v=>/karen|ava|allison|female/i.test(v.name)) || vs[0]||null; },
  stop(){ this.token++; speechSynthesis.cancel(); if(this.cur){try{this.cur.pause();}catch(e){}this.cur=null;} },
  play(ids){ this.stop(); const my=this.token;
    const seq=Array.isArray(ids)?ids.slice():[ids];
    const cap=4000+2600*seq.length;
    const core=new Promise(res=>{
      const next=()=>{ if(my!==this.token){res();return;}
        if(!seq.length){res();return;}
        const id=seq.shift(); const L=LINES[id]||{t:id};
        if(this.hasVP(id)){
          const a=new Audio(VOICEPACK[id]); this.cur=a;
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

/* ---------------- ART ---------------- */
let __huid=0;
function heroOpts(){ const done=Object.keys(S.done).length;
  return { muscle: done>=7?2:(done>=3?1:0),
           weapon: S.equip.weapon||"none",
           cape: S.equip.cape||"red",
           belt2:S.gear.includes("Power Belt"), boots2:S.gear.includes("Rocket Boots") }; }
function heroNow(w){ return heroSVG(w,heroOpts()); }
function heroSVG(w=200,o={}){
const u="h"+(__huid++);
const m=o.muscle||0, sx=1+0.07*m;
const capes={red:["#ef5348","#b92f33"],gold:["#ffd75e","#e08f1f"],purple:["#a06ae8","#6b2fa0"]};
const cp=capes[o.cape||"red"]||capes.red;
let weapon="";
if(o.weapon==="hammer"){weapon=`<g transform="translate(196 6) rotate(16)" stroke="#150f2e" stroke-width="6" stroke-linejoin="round">
<rect x="-8" y="36" width="16" height="130" rx="8" fill="#8a5a33"/>
<rect x="-52" y="-14" width="104" height="56" rx="14" fill="url(#${u}gold)"/>
<rect x="-52" y="-14" width="20" height="56" rx="10" fill="#fff0bd"/>
<path d="M58 -22 l16 -10 l-6 14 l16 -2 l-14 12" fill="none" stroke="#ffd75e" stroke-width="5" stroke-linecap="round"/></g>`;}
if(o.weapon==="sword"){weapon=`<g transform="translate(206 -8) rotate(10)" stroke="#150f2e" stroke-width="5" stroke-linejoin="round">
<polygon points="0,-120 16,-96 16,60 -16,60 -16,-96" fill="#dfe9ff"/>
<polygon points="0,-120 16,-96 0,-96" fill="#aebfe8"/>
<rect x="-34" y="58" width="68" height="18" rx="8" fill="url(#${u}gold)"/>
<rect x="-9" y="74" width="18" height="46" rx="8" fill="#8a5a33"/>
<circle cx="0" cy="128" r="11" fill="url(#${u}gold)"/></g>`;}
const biceps = m>=1 ? `<ellipse cx="38" cy="178" rx="${14+5*m}" ry="${11+4*m}" fill="#3b82f0" stroke="#150f2e" stroke-width="5"/>
<ellipse cx="206" cy="${182}" rx="${14+5*m}" ry="${11+4*m}" fill="#3b82f0" stroke="#150f2e" stroke-width="5" opacity="${o.weapon&&o.weapon!=="none"?0:1}"/>` : "";
const beltGlow=o.belt2?`<rect x="84" y="268" width="78" height="28" rx="10" fill="none" stroke="#fff3c4" stroke-width="5" opacity=".85"/>`:"";
const bootFx=o.boots2?`<g stroke="#ff8a3d" stroke-width="5" stroke-linecap="round" opacity=".9">
<path d="M86 472 q4 12 -2 22"/><path d="M104 472 q0 14 -4 24"/>
<path d="M148 472 q4 12 -2 22"/><path d="M166 472 q0 14 -4 24"/></g>`:"";
return `<svg viewBox="-30 -150 310 660" width="${w}" aria-hidden="true">
<defs><linearGradient id="${u}suit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b82f0"/><stop offset="1" stop-color="#2257c4"/></linearGradient>
<linearGradient id="${u}cape" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cp[0]}"/><stop offset="1" stop-color="${cp[1]}"/></linearGradient>
<linearGradient id="${u}gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd75e"/><stop offset="1" stop-color="#f0a82b"/></linearGradient></defs>
${o.weapon==="hammer"||o.weapon==="sword"?weapon:""}
<path d="M62 122 Q38 220 30 350 Q28 406 50 448 Q90 426 124 436 Q170 424 200 446 Q224 402 218 346 Q210 218 184 122 Q122 104 62 122Z" fill="url(#${u}cape)" stroke="#150f2e" stroke-width="6"/>
<g stroke="#150f2e" stroke-width="6" stroke-linejoin="round">
<path d="M96 288 L90 372 L86 412 L118 412 L124 310Z" fill="url(#${u}suit)"/>
<path d="M150 288 L158 372 L162 412 L130 412 L126 310Z" fill="url(#${u}suit)"/>
<path d="M84 412 L120 412 L120 450 Q120 466 100 466 L70 466 Q60 466 62 454 Q64 440 84 434Z" fill="url(#${u}cape)"/>
<path d="M162 412 L126 412 L126 450 Q126 466 146 466 L176 466 Q186 466 184 454 Q182 440 162 434Z" fill="url(#${u}cape)"/>
<path d="M84 412 L120 412 L120 424 L82 424Z" fill="#ffd75e" stroke-width="4"/>
<path d="M126 412 L162 412 L164 424 L126 424Z" fill="#ffd75e" stroke-width="4"/></g>
${bootFx}
<g transform="translate(123 0) scale(${sx} 1) translate(-123 0)">
<path d="M64 142 Q123 120 182 142 L174 238 Q170 272 152 284 L96 284 Q76 272 72 238Z" fill="url(#${u}suit)" stroke="#150f2e" stroke-width="6"/>
<path d="M74 150 Q96 136 122 134 L120 170 Q96 172 80 184Z" fill="#6ea4f7" opacity=".55"/>
${m>=1?'<path d="M92 168 Q123 152 154 168" stroke="#173f8f" stroke-width="5" fill="none" stroke-linecap="round"/>':''}
${m>=2?'<path d="M100 206 Q123 196 146 206 M104 232 Q123 224 142 232" stroke="#173f8f" stroke-width="4.5" fill="none" stroke-linecap="round"/>':''}
</g>
<g stroke="#150f2e" stroke-width="6" stroke-linejoin="round">
<path d="M66 152 Q34 170 28 212 Q34 242 62 252 L84 264 L92 244 L72 232 Q58 220 60 198 Q66 172 78 162Z" fill="url(#${u}suit)"/>
<path d="M180 152 Q212 170 218 212 Q214 230 202 240 L196 220 Q200 208 192 192 Q184 172 170 162Z" fill="url(#${u}suit)"/>
<path d="M202 208 Q216 226 196 252 L168 266 L158 246 L184 232 Q192 222 190 212Z" fill="url(#${u}gold)"/>
<circle cx="90" cy="260" r="15" fill="#e6453c"/><circle cx="158" cy="260" r="15" fill="url(#${u}gold)"/></g>
${biceps}
<path d="M88 272 L158 272 L154 294 L92 294Z" fill="url(#${u}gold)" stroke="#150f2e" stroke-width="5"/>
${beltGlow}
<g transform="translate(123 198)"><path d="M0 -32 L29 -16 L29 16 L0 32 L-29 16 L-29 -16Z" fill="url(#${u}gold)" stroke="#150f2e" stroke-width="5"/>
<path d="M-15 -15 L15 -15 L15 -6 L5 -6 L5 17 L-5 17 L-5 -6 L-15 -6Z" fill="#d23a31" stroke="#150f2e" stroke-width="3"/></g>
<rect x="111" y="112" width="26" height="24" fill="#ffd9b8" stroke="#150f2e" stroke-width="5"/>
<circle cx="124" cy="66" r="54" fill="#ffd9b8" stroke="#150f2e" stroke-width="6"/>
<circle cx="71" cy="70" r="11" fill="#ffd9b8" stroke="#150f2e" stroke-width="5"/>
<path d="M70 48 Q66 4 116 -2 Q176 -8 184 44 Q186 56 180 66 Q178 42 164 34 Q172 22 156 16 Q160 6 142 8 Q146 -2 126 2 Q104 0 102 14 Q84 12 84 26 Q72 30 74 48Z" fill="#d8b572" stroke="#150f2e" stroke-width="5"/>
<path d="M96 16 Q120 6 144 14 Q166 22 170 36 Q150 30 138 34 Q150 42 148 52 Q132 38 112 40 Q96 40 88 48 Q86 28 96 16Z" fill="#e8cb8e" stroke="#150f2e" stroke-width="5"/>
<path d="M150 34 Q166 26 176 36 Q170 48 158 52 Q162 42 150 34Z" fill="#f2dfae" stroke="#150f2e" stroke-width="4"/>
<g stroke="#1d4fb8" stroke-width="7" fill="#cfe6ff" fill-opacity=".4" stroke-linejoin="round">
<rect x="84" y="52" width="36" height="30" rx="8"/><rect x="130" y="52" width="36" height="30" rx="8"/><line x1="120" y1="64" x2="130" y2="64"/></g>
<circle cx="103" cy="68" r="7" fill="#fff"/><circle cx="148" cy="68" r="7" fill="#fff"/>
<circle cx="104" cy="69" r="4.4" fill="#6fa8d8"/><circle cx="149" cy="69" r="4.4" fill="#6fa8d8"/>
<circle cx="104" cy="69" r="2" fill="#150f2e"/><circle cx="149" cy="69" r="2" fill="#150f2e"/>
<g fill="#d99a6c" opacity=".85"><circle cx="98" cy="86" r="2"/><circle cx="106" cy="90" r="2"/><circle cx="92" cy="92" r="1.8"/><circle cx="142" cy="90" r="2"/><circle cx="150" cy="86" r="2"/><circle cx="156" cy="92" r="1.8"/></g>
<path d="M98 98 Q124 120 152 97 Q150 114 136 120 Q124 124 112 120 Q100 114 98 98Z" fill="#7c3a3a" stroke="#150f2e" stroke-width="4"/>
<path d="M101 99 Q124 114 149 98 L148 104 Q124 116 102 105Z" fill="#fff"/>
</svg>`;}
function inkblotSVG(w=240){
return `<svg viewBox="-70 -130 320 360" width="${w}" aria-hidden="true">
<defs>
<linearGradient id="vxm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4f6e"/><stop offset="1" stop-color="#23263b"/></linearGradient>
<linearGradient id="vxd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2f47"/><stop offset="1" stop-color="#15172a"/></linearGradient>
<radialGradient id="vxr" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#ff6b5e"/><stop offset=".6" stop-color="#e62e2e"/><stop offset="1" stop-color="#7a1010"/></radialGradient>
</defs>
<path d="M10 -20 Q-40 60 -28 170 L-6 150 L6 176 L26 150 L40 178 L58 150 L74 172 L96 148 Q132 60 132 -16 Q72 -52 10 -20Z" fill="#1a1030" stroke="#150f2e" stroke-width="6"/>
<ellipse cx="72" cy="208" rx="58" ry="13" fill="#9fe870" opacity=".5"/>
<ellipse cx="72" cy="204" rx="34" ry="8" fill="#d2ffb0" opacity=".8"/>
<path d="M40 150 L104 150 L96 196 L48 196 Z" fill="url(#vxd)" stroke="#150f2e" stroke-width="6"/>
<rect x="52" y="160" width="40" height="10" rx="4" fill="#9fe870" opacity=".75"/>
<path d="M16 30 L128 30 L142 70 L128 150 L16 150 L2 70 Z" fill="url(#vxm)" stroke="#150f2e" stroke-width="7"/>
<path d="M16 30 L72 30 L72 150 L16 150 L2 70Z" fill="#150f2e" opacity=".22"/>
<path d="M30 44 L114 44 L122 66 L112 86 L32 86 L22 66Z" fill="url(#vxd)" stroke="#150f2e" stroke-width="5"/>
<circle cx="72" cy="112" r="20" fill="url(#vxr)" stroke="#150f2e" stroke-width="6"/>
<circle cx="72" cy="112" r="8" fill="#ffd2c9"/>
<path d="M72 88 L72 70 M52 100 L36 92 M92 100 L108 92" stroke="#e62e2e" stroke-width="4" stroke-linecap="round" opacity=".8"/>
<path d="M16 30 L-22 6 L10 2 L26 26Z" fill="url(#vxm)" stroke="#150f2e" stroke-width="6"/>
<path d="M128 30 L166 6 L134 2 L118 26Z" fill="url(#vxm)" stroke="#150f2e" stroke-width="6"/>
<path d="M8 56 Q-34 78 -38 122 Q-36 142 -20 148 L-10 128 Q-22 118 -18 102 Q-12 80 12 70Z" fill="url(#vxd)" stroke="#150f2e" stroke-width="6"/>
<g stroke="#150f2e" stroke-width="5" fill="#6e7494"><path d="M-22 144 L-38 168 L-26 166 L-30 184 L-14 164 L-8 178 L-2 150Z"/></g>
<path d="M136 56 Q178 78 182 122 Q180 142 164 148 L154 128 Q166 118 162 102 Q156 80 132 70Z" fill="url(#vxd)" stroke="#150f2e" stroke-width="6"/>
<g stroke="#150f2e" stroke-width="5" fill="#6e7494"><path d="M166 144 L182 168 L170 166 L174 184 L158 164 L152 178 L146 150Z"/></g>
<path d="M38 -64 L106 -64 L118 -36 L114 14 L100 30 L44 30 L30 14 L26 -36Z" fill="url(#vxm)" stroke="#150f2e" stroke-width="7"/>
<path d="M38 -64 L72 -64 L72 30 L44 30 L30 14 L26 -36Z" fill="#150f2e" opacity=".22"/>
<path d="M40 -62 L22 -102 L52 -72Z" fill="url(#vxd)" stroke="#150f2e" stroke-width="5"/>
<path d="M104 -62 L122 -102 L92 -72Z" fill="url(#vxd)" stroke="#150f2e" stroke-width="5"/>
<path d="M34 -22 L110 -22 L106 -6 L38 -6Z" fill="#e62e2e" stroke="#150f2e" stroke-width="5"/>
<rect x="42" y="-19" width="26" height="9" rx="4" fill="#ff9d8f"/>
<g stroke="#150f2e" stroke-width="4"><line x1="56" y1="8" x2="56" y2="22"/><line x1="72" y1="8" x2="72" y2="22"/><line x1="88" y1="8" x2="88" y2="22"/></g>
<g font-family="Andika,sans-serif" font-weight="700" fill="#9fe870">
<text x="-52" y="-40" font-size="32" transform="rotate(-18 -52 -40)">k</text>
<text x="150" y="-48" font-size="30" transform="rotate(14 150 -48)">w</text>
<text x="176" y="96" font-size="28" transform="rotate(-8 176 96)">z</text>
</g>
</svg>`;}
function mentorChips(w=120){
return `<svg viewBox="0 0 130 70" width="${w}" aria-hidden="true">
<circle cx="35" cy="35" r="30" fill="#ffd9b8" stroke="#fff6e3" stroke-width="4"/>
<path d="M10 24 Q14 4 36 4 Q58 4 60 24 Q50 12 36 14 Q20 14 10 24Z" fill="#6b4a2b" stroke="#150f2e" stroke-width="3"/>
<path d="M22 48 Q35 56 48 47" stroke="#150f2e" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<circle cx="27" cy="34" r="3" fill="#150f2e"/><circle cx="44" cy="34" r="3" fill="#150f2e"/>
<path d="M20 52 Q35 60 50 51 L48 58 Q35 64 22 58Z" fill="#7a5a3a" opacity=".5"/>
<circle cx="95" cy="35" r="30" fill="#ffd9b8" stroke="#fff6e3" stroke-width="4"/>
<path d="M68 28 Q70 4 96 4 Q122 6 122 30 Q112 14 96 16 Q78 16 68 28Z" fill="#d8b572" stroke="#150f2e" stroke-width="3"/>
<circle cx="87" cy="34" r="3" fill="#150f2e"/><circle cx="104" cy="34" r="3" fill="#150f2e"/>
<path d="M82 48 Q95 56 108 47" stroke="#150f2e" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<g fill="#f2a9c4"><circle cx="78" cy="58" r="3.4"/><circle cx="86" cy="61" r="3.4"/><circle cx="95" cy="62" r="3.4"/><circle cx="104" cy="61" r="3.4"/><circle cx="112" cy="58" r="3.4"/></g>
</svg>`;}
function citySVG(){
return `<svg viewBox="0 0 600 300">
<defs><linearGradient id="cs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#171236"/><stop offset="1" stop-color="#7a4fb6"/></linearGradient></defs>
<rect width="600" height="300" fill="url(#cs)"/>
<circle cx="500" cy="60" r="34" fill="#fff1cf" stroke="#150f2e" stroke-width="4"/>
<g fill="#2c2158"><rect x="20" y="140" width="60" height="160"/><rect x="95" y="100" width="55" height="200"/><rect x="165" y="150" width="70" height="150"/><rect x="420" y="120" width="62" height="180"/><rect x="495" y="150" width="80" height="150"/><polygon points="300,300 300,90 330,60 360,90 360,300"/></g>
<g fill="#ffc93c" opacity=".85"><rect x="32" y="160" width="11" height="14"/><rect x="56" y="190" width="11" height="14"/><rect x="106" y="120" width="11" height="14"/><rect x="128" y="160" width="11" height="14"/><rect x="436" y="140" width="11" height="14"/><rect x="510" y="170" width="11" height="14"/><rect x="540" y="200" width="11" height="14"/></g>
<g font-family="Andika,sans-serif" font-weight="700" fill="#9fe870" opacity=".9">
<text x="200" y="60" font-size="30" transform="rotate(-14 200 60)">b</text>
<text x="120" y="80" font-size="24" transform="rotate(10 120 80)">e</text>
<text x="400" y="50" font-size="28" transform="rotate(8 400 50)">m</text>
<text x="540" y="110" font-size="24" transform="rotate(-10 540 110)">r</text></g>
</svg>`;}

/* ---------------- SCREEN MGMT ---------------- */
const $=id=>document.getElementById(id);
/* Painted-scene slots: screen -> art/bg-<name>.* . Add an image to swap a scene;
   if the file is missing the layer stays transparent and the original look shows.
   Several screens intentionally share one scene (e.g. learn/trace, boss/forge). */
const BG_MAP={ scrTitle:"title", scrIntro:"intro", scrScan:"lab", scrMap:"city",
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
  return n? "🎙️ Studio voices loaded ("+n+" lines)" : "Using built-in voice — add voicepack.js for studio voices"; }
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
function allyFace(kind){
  if(kind==="heart")return `<circle r="26" fill="#ffd9b8" stroke="#150f2e" stroke-width="4"/><path d="M-24 -4 Q-26 -30 0 -30 Q26 -30 24 -4 Q14 -22 0 -20 Q-14 -22 -24 -4Z" fill="#e8a87c" stroke="#150f2e" stroke-width="3"/><circle cx="-8" cy="0" r="3" fill="#150f2e"/><circle cx="9" cy="0" r="3" fill="#150f2e"/><path d="M-9 10 Q1 18 11 9" stroke="#150f2e" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M-6 13 L8 12" stroke="#dfe9ff" stroke-width="2" stroke-linecap="round"/><path d="M0 22 q3 -4 6 -1 q3 3 -1 6 l-5 4 -5 -4 q-4 -3 -1 -6 q3 -3 6 1z" fill="#e6453c" stroke="#150f2e" stroke-width="1.6"/>`;
  if(kind==="tank")return `<circle r="26" fill="#ffd9b8" stroke="#150f2e" stroke-width="4"/><path d="M-24 -8 Q-26 -30 0 -30 Q26 -30 24 -6 Q20 -22 6 -18 Q14 -10 4 -6 Q-8 -16 -18 -10 Q-24 -6 -24 -8Z" fill="#d8b572" stroke="#150f2e" stroke-width="3"/><circle cx="-8" cy="0" r="3" fill="#150f2e"/><circle cx="9" cy="0" r="3" fill="#150f2e"/><path d="M-8 12 Q1 18 10 11" stroke="#150f2e" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
  if(kind==="flip")return `<circle r="26" fill="#ffd9b8" stroke="#150f2e" stroke-width="4"/><circle cx="0" cy="-26" r="10" fill="#9a7448" stroke="#150f2e" stroke-width="3"/><path d="M-24 -10 Q-20 -26 0 -26 Q20 -26 24 -10 Q12 -18 0 -16 Q-12 -18 -24 -10Z" fill="#9a7448" stroke="#150f2e" stroke-width="3"/><circle cx="-8" cy="0" r="3" fill="#150f2e"/><circle cx="9" cy="0" r="3" fill="#150f2e"/><path d="M-8 12 Q1 18 10 11" stroke="#150f2e" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
  return `<circle r="26" fill="#ffd9b8" stroke="#150f2e" stroke-width="4"/><path d="M-24 -6 Q-24 -30 0 -30 Q24 -30 24 -4 Q16 -20 2 -16 Q-12 -22 -20 -8Z" fill="#f2dfae" stroke="#150f2e" stroke-width="3"/><circle cx="-8" cy="0" r="3" fill="#150f2e"/><circle cx="9" cy="0" r="3" fill="#150f2e"/><path d="M-9 10 Q1 19 11 9" stroke="#150f2e" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
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
function startMission(m){ clearFlow(); CUR=m; $("hudTitle").textContent=m.lbl.toUpperCase();
  if(m.type==="learn")startLearn(m);
  else if(m.type==="patrol")startPatrol(m.set);
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
  const g = patrolSet? patrolSet[Math.floor(Math.random()*patrolSet.length)] : findTarget;
  findTarget=g; findMiss=0;
  $("findProg").textContent="⭐ "+findRep+" / "+findGoal;
  narrate("find",$("findText"),["find_prompt","snd_"+g],"Find the gem that makes the sound\u2026 \ud83d\udd0a");
  const foils=lettersFor(CUR).filter(x=>x!==g).sort(()=>Math.random()-.5).slice(0,3);
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

/* ---------------- PATROL ---------------- */
function startPatrol(set){ Aud.play("patrol_intro");
  startFind(set[0],8,set,()=>missionComplete()); }

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
  else if(CUR.finale) ids=["finale1","finale2","finale3"];
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
const LETTER_MISSION={s:0,a:1,t:3,p:5,i:6,n:7,m:9,d:10,g:12,o:14,c:15,k:16};
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
