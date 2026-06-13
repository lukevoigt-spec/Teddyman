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
  h:{kw:"hat",icon:"🎩"}, b:{kw:"ball",icon:"⚽"}, f:{kw:"fish",icon:"🐟"},
  l:{kw:"lion",icon:"🦁"}, j:{kw:"jar",icon:"🫙"}, v:{kw:"van",icon:"🚐"},
  w:{kw:"web",icon:"🕸️"}, x:{kw:"fox",icon:"🦊"}, y:{kw:"yo-yo",icon:"🪀"},
  z:{kw:"zebra",icon:"🦓"}, q:{kw:"queen",icon:"👑"}
};
const ORDER=["s","a","t","p","i","n","m","d","g","o","c","k","e","u","r","h","b","f","l","j","v","w","x","y","z","q"];
/* ---- ACT 2: DIGRAPHS (one gem = one sound). Two letters, a single phoneme.
   The grapheme system is multi-letter-aware via toGraphemes(): words tokenize
   into graphemes (longest-match), so "ship" = [sh,i,p] not [s,h,i,p]. Backward-
   compatible — no Act-1 (non-sight) word contains a digraph sequence. ---- */
const DIGRAPHS=["sh","ch","th","wh","ck","ng"];
const VOWELTEAMS=["ai","ee","oa"];   /* vowel teams: 2 letters, ONE long-vowel sound (ai→A, ee→E, oa→O) */
const GRAPH2=DIGRAPHS.concat(VOWELTEAMS);
function isDigraph(g){ return DIGRAPHS.includes(g); }
function isVowelTeam(g){ return VOWELTEAMS.includes(g); }
function toGraphemes(w){ const out=[]; for(let i=0;i<w.length;){ const two=w.substr(i,2);
  if(GRAPH2.includes(two)){ out.push(two); i+=2; } else { out.push(w[i]); i++; } } return out; }
Object.assign(LETTERS,{
  sh:{kw:"ship",icon:"🚢"}, ch:{kw:"cheese",icon:"🧀"}, th:{kw:"thumb",icon:"👍"},
  wh:{kw:"whale",icon:"🐳"}, ck:{kw:"duck",icon:"🦆"}, ng:{kw:"ring",icon:"💍"},
  ai:{kw:"rain",icon:"🌧️"}, ee:{kw:"bee",icon:"🐝"}, oa:{kw:"boat",icon:"⛵"}
});
/* ---- ACT 2: LONG VOWELS via MAGIC-E (split grapheme). A silent E at the end
   reaches back over one consonant and flips the vowel from short to long
   (cap→cape). We DON'T tokenize it as a discontinuous gem — the word still
   builds/decodes letter-by-letter (cake = c,a,k,e). magicE(word) detects the
   V-C-e pattern and returns {v: long-vowel index, e: silent-e index} so audio
   plays the LONG vowel + marks the silent E. Backward-compatible: returns null
   for every Act-1/digraph/blend word (none are a CVCe word). ---- */
const VOWELS=["a","e","i","o","u"];
const MAGICE_UNITS=["a_e","i_e","o_e","u_e"];
function isVowel(c){ return VOWELS.includes(c); }
function magicE(w){ const n=w.length;
  if(n<3 || w[n-1]!=="e") return null;
  const c=w[n-2], v=w[n-3];
  if(isVowel(v) && !isVowel(c) && "wxy".indexOf(c)<0) return { v:n-3, e:n-1, unit:v+"_e" };
  return null; }
/* audio id sequence for sounding out a word, magic-e aware: the vowel says its
   LONG name and the silent E makes no sound (it's skipped). */
function graphemeSounds(w){ const me=magicE(w); const gs=toGraphemes(w); const out=[]; let i=0;
  for(const g of gs){ const end=i+g.length;
    if(me && i===me.e){ /* silent e — no sound */ }
    else if(me && i===me.v) out.push("snd_"+g+"_long");
    else out.push("snd_"+g);
    i=end; }
  return out; }
/* z = letter-group zone. Foil pools and forge words only ever use letters from
   zones <= the mission's zone — material not yet taught never appears. */
/* Campaign data (MISSIONS, GEAR_AT, autoNodes, ZONES, ACTS) moved to data-missions.js. */
function currentAct(){ return S.act||1; }
function actInfo(a){ return ACTS.find(x=>x.id===a)||ACTS[0]; }
function actZones(a){ return ZONES.filter(z=>(z.act||1)===a); }
function actMissions(a){ const ids=new Set(actZones(a).map(z=>z.id)); return MISSIONS.filter(m=>ids.has(m.z)); }
/* Gear earned in THIS act (by its mission ids), so a new act starts powerless —
   the villain "stole" Teddy's gear. Mastery still persists across acts. */
function actGearList(a){ const mids=new Set(actMissions(a).map(m=>m.id));
  return Object.keys(GEAR_AT).filter(id=>mids.has(+id)&&S.done[id]).map(id=>GEAR_AT[id]); }
/* missions of an act in PLAY ORDER (zones run in ZONES-array order; missions
   within a zone by id). Used by the parent's level-override slider so its order
   matches the map Teddy actually sees. */
function playMissions(a){ return actZones(a).flatMap(z=>MISSIONS.filter(m=>m.z===z.id).sort((x,y)=>x.id-y.id)); }
/* Per-act map geometry — each act is its own city/map, positioned by ZONE
   membership (not flat id order) so groups slot in with appended save-ids. */
function geomFor(a){
  const zs=actZones(a), ms=actMissions(a), nodes=zs.flatMap(z=>z.nodes);
  if(!nodes.length) return { act:a, zones:zs, missions:ms, base:[470,1408], nodeby:{}, mapH:1560, minY:200, fort:[400,200], viewTop:0 };  /* act with no content yet — safe stub */
  const base=(zs.find(z=>z.base)||{}).base||[470,1408];
  const nodeby={}; zs.forEach(z=>{ ms.filter(m=>m.z===z.id).forEach((m,i)=>{ nodeby[m.id]=z.nodes[i]||z.nodes[z.nodes.length-1]; }); });
  const maxY=Math.max(base[1], ...nodes.map(p=>p[1])), minY=Math.min(...nodes.map(p=>p[1]));
  const fort=[400, minY-210];
  return { act:a, zones:zs, missions:ms, base, nodeby, mapH:maxY+152, minY, fort, viewTop:fort[1]-330 }; }
let GEO=geomFor(1);   /* S isn't defined yet at module load; toMap() recomputes for currentAct() */
function setAct(a){ S.act=a; GEO=geomFor(a); save(); }
function nodeOf(id){ return GEO.nodeby[id]||GEO.base; }

/* ---------- VOICE LINE MANIFEST (ids shared with Voice Studio) ---------- */
/* LINES voice manifest moved to data-lines.js (loaded before game.js). */
const GEARLINE={ "Power Belt":"gear_belt","Rocket Boots":"gear_boots","Word Hammer":"gear_hammer","Gem Sword":"gear_sword","Gem Shield":"gear_shield","Gem Gauntlet":"gear_gauntlet","Reading Crown":"gear_crown","Spell Tome":"gear_tome","Story Key":"gear_storykey","Alphabet Star":"gear_alphabet","Fluency Badge":"gear_fluency" };
const GEMCOLOR={s:"#3b82f0",a:"#ff8a3d",t:"#3ec97e",p:"#a06ae8",i:"#7fd9ff",n:"#ffc93c",
  m:"#f06292",d:"#9c2f2f",g:"#1abc9c",o:"#5dade2",c:"#7d3c98",k:"#aab7c4",
  e:"#27ae60",u:"#e67e22",r:"#ff5e57",h:"#5f6dff",b:"#3742fa",f:"#16a085",
  l:"#e84393",j:"#00b894",v:"#6c5ce7",w:"#0984e3",x:"#d63031",y:"#fdcb6e",z:"#636e72",q:"#a29bfe",
  sh:"#16a085",ch:"#e67e22",th:"#2980b9",wh:"#8e44ad",ck:"#c0392b",ng:"#27ae60"};

/* ---------------- SAVE (hardened: redundant + self-healing) ----------------
   Teddy's progress is precious — losing it could make him stop playing. So the
   save is defensive on every front:
   • TWO local copies (primary + backup). On load we take whichever has MORE
     progress, so a half-written or wiped primary can be rebuilt from the backup.
   • migrate() NEVER throws and fills any missing field, so an old or partial
     save is repaired instead of discarded (the old code reset to zero on any
     hiccup — that was the real wipe risk).
   • The backup is only overwritten when the state actually HAS progress, so a
     transient empty/fresh state can never clobber a good backup.
   • Milestone SNAPSHOTS (a small dated ring) let a parent roll back if needed.
   • Cloud sync (optional) is the real cross-device, eviction-proof backstop.
   NOTE: on iPad Safari, "Add to Home Screen" + turning on cloud sync are the
   two things that make saves truly durable (Safari can purge site storage after
   ~7 idle days otherwise) — the Grown-Up Corner nudges for both.            */
/* ---------------- PROFILES (no-auth local players) ----------------
   Each player has their OWN save (local + cloud slot). Auto-loads the last
   player; add/remove only in the Grown-Up Corner. The default player "teddy"
   keeps the ORIGINAL save keys + cloud key, so existing progress is never lost
   and an existing Worker URL keeps working unchanged. */
const DEFAULT_CLOUD_URL="https://teddy-saves.lukevoigt.workers.dev";   /* baked-in Worker URL → every device auto-syncs, zero per-device setup */
const PROFKEY="teddyProfiles", ACTIVEKEY="teddyActiveProfile";
function readJSON(k,f){ try{ const v=JSON.parse(localStorage.getItem(k)); return v==null?f:v; }catch(e){ return f; } }
function profiles(){ let p=readJSON(PROFKEY,null);
  if(!Array.isArray(p)||!p.length){ p=[{id:"teddy",name:"Teddy"}]; try{localStorage.setItem(PROFKEY,JSON.stringify(p));}catch(e){} }
  return p; }
function profileName(id){ const p=profiles().find(x=>x.id===id); return p?p.name:"Player"; }
/* escape parent-entered text (profile names) before any innerHTML/template use */
function escHTML(s){ return String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function activeProfileId(){ const id=localStorage.getItem(ACTIVEKEY), p=profiles();
  return (id && p.some(x=>x.id===id)) ? id : p[0].id; }
function keyFor(id){ return id==="teddy" ? "heroTeddySave_v1" : "heroTeddySave_v1::"+id; }
let ACTIVE=activeProfileId();
let KEY=keyFor(ACTIVE), BAKKEY=KEY+"_bak", SNAPKEY=KEY+"_snaps";
function applyProfile(id){ ACTIVE=id; try{localStorage.setItem(ACTIVEKEY,id);}catch(e){}
  KEY=keyFor(id); BAKKEY=KEY+"_bak"; SNAPKEY=KEY+"_snaps"; }
function addProfile(name){ name=(name||"").trim().slice(0,16)||"Player";
  const id="p"+Date.now().toString(36), p=profiles(); p.push({id,name});
  try{localStorage.setItem(PROFKEY,JSON.stringify(p));}catch(e){} return id; }
function removeProfile(id){ if(id==="teddy")return false;            /* never delete the default player */
  try{localStorage.setItem(PROFKEY,JSON.stringify(profiles().filter(x=>x.id!==id)));}catch(e){}
  [keyFor(id),keyFor(id)+"_bak",keyFor(id)+"_snaps"].forEach(k=>{try{localStorage.removeItem(k);}catch(e){}});
  if(ACTIVE===id){ applyProfile(profiles()[0].id); S=load(); }
  return true; }
let S=load();
function fresh(){return {v:1,act:1,ts:0,intro:false,scan:false,done:{},mastery:{},stars:0,coins:0,owned:{},gear:[],equip:{weapon:"none",cape:"red"},session:{count:0,day:"",rest:false}};}
/* normalize ANY (old / partial / slightly broken) save object — never throws */
function migrate(d){ if(!d||typeof d!=="object"||d.v!==1) return null;
  d.act=(typeof d.act==="number")?d.act:1; d.ts=d.ts||0;
  d.done=(d.done&&typeof d.done==="object")?d.done:{};
  d.mastery=(d.mastery&&typeof d.mastery==="object")?d.mastery:{};
  d.gear=Array.isArray(d.gear)?d.gear:[];
  d.equip=(d.equip&&typeof d.equip==="object")?d.equip:{weapon:"none",cape:"red"};
  if(d.equip.weapon===undefined)d.equip.weapon="none"; if(d.equip.cape===undefined)d.equip.cape="red";
  d.session=(d.session&&typeof d.session==="object")?d.session:{count:0,day:"",rest:false};
  if(d.session.day===undefined)d.session.day=""; if(d.session.count===undefined)d.session.count=0; if(d.session.rest===undefined)d.session.rest=false;
  if(typeof d.stars!=="number")d.stars=0; d.intro=!!d.intro; d.scan=!!d.scan;
  if(typeof d.coins!=="number")d.coins=0; d.owned=(d.owned&&typeof d.owned==="object")?d.owned:{};
  return d; }
function readKey(k){ try{ const raw=localStorage.getItem(k); if(!raw)return null; return migrate(JSON.parse(raw)); }catch(e){ return null; } }
/* rough "how much progress" — more done missions (then newer) wins a tie-break */
function progressScore(d){ return d? (Object.keys(d.done||{}).length*1e6 + (d.ts||0)/1e6) : -1; }
function load(){ const a=readKey(KEY), b=readKey(BAKKEY);
  let best=(progressScore(a)>=progressScore(b))?a:b;
  return best||fresh(); }
let __saveFailed=false;
function hasProgress(d){ return d && (Object.keys(d.done||{}).length>0 || d.intro); }
function save(){ S.ts=Date.now(); const json=JSON.stringify(S);
  let ok=false; try{ localStorage.setItem(KEY,json); ok=true; }catch(e){}
  /* only mirror to backup when there's real progress — never clobber a good backup with an empty state */
  if(hasProgress(S)){ try{ localStorage.setItem(BAKKEY,json); }catch(e){} }
  if(!ok && !__saveFailed){ __saveFailed=true; const w=document.getElementById("saveWarn"); if(w)w.style.display="block"; }
  cloudPush(); }
/* milestone snapshots — a small ring the parent can roll back to */
function snapshot(label){ try{ let arr=JSON.parse(localStorage.getItem(SNAPKEY)||"[]"); if(!Array.isArray(arr))arr=[];
  arr.push({ts:Date.now(), label:label||"", data:JSON.stringify(S)});
  while(arr.length>6)arr.shift();
  localStorage.setItem(SNAPKEY,JSON.stringify(arr)); }catch(e){} }
function snapshots(){ try{ const a=JSON.parse(localStorage.getItem(SNAPKEY)||"[]"); return Array.isArray(a)?a:[]; }catch(e){ return []; } }
/* ---------------- CLOUD SAVE (optional, low-maintenance) ----------------
   Progress lives in localStorage (instant, offline). If a Cloudflare Worker
   URL is set in Grown-Up Corner, every save also debounce-syncs to the cloud,
   and on boot the newer of {cloud, device} wins — so the SAME url on any
   device just continues his progress. Fixed key, so the only thing to paste
   is the URL. Never blocks play; failures fall back to device-only.          */
let cloudURL=""; try{ cloudURL=localStorage.getItem("teddyCloudURL")||""; }catch(e){}
if(!cloudURL && DEFAULT_CLOUD_URL) cloudURL=DEFAULT_CLOUD_URL;   /* baked-in URL = no per-device pasting */
function cloudEndpoint(){ return cloudURL ? cloudURL.replace(/\/+$/,"")+"?k="+ACTIVE : null; }   /* each player = its own cloud slot */
function cloudStatus(s){ const el=document.getElementById("cloudState"); if(el)el.textContent=s; }
let __cloudT=null;
function cloudPush(){ const u=cloudEndpoint(); if(!u)return; clearTimeout(__cloudT);
  __cloudT=setTimeout(()=>{ cloudStatus("Saving to cloud…");
    fetch(u,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(S)})
      .then(r=>cloudStatus(r.ok?"Synced to cloud ✓":"Cloud error — saved on device"))
      .catch(()=>cloudStatus("Offline — saved on device")); },2500); }
async function cloudPull(){ const u=cloudEndpoint(); if(!u)return false;
  try{ const r=await fetch(u); if(!r.ok)return false; const t=(await r.text()).trim(); if(!t)return false;
    const d=migrate(JSON.parse(t));
    if(d&&(d.ts||0)>(S.ts||0)){ S=d;
      try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){} return true; } }
  catch(e){} return false; }
function cloudConnect(url){ cloudURL=(url||"").trim();
  try{ localStorage.setItem("teddyCloudURL",cloudURL); }catch(e){}
  if(!cloudURL){ cloudStatus("Cloud sync off (device only)"); return; }
  cloudStatus("Connecting…");
  cloudPull().then(changed=>{ if(changed){ GEO=geomFor(currentAct()); if(S.intro){const c=document.getElementById("btnContinue"); if(c)c.style.display="inline-block";} }
    cloudStatus(changed?"Connected ✓ — restored his cloud progress":"Connected ✓ — this device now backs up to the cloud");
    cloudPush(); }); }
function today(){return new Date().toDateString();}
function sessionTick(){ if(S.session.day!==today()){S.session={count:0,day:today(),rest:false};save();} }

/* ---------------- DAILY TRAINING (time-on-task) ----------------
   Tracks ACTIVE minutes per day (idle/background paused) so the parent can see
   "how much practice today" and set a daily goal. Child sees a gentle meter
   that fills as he plays — pure encouragement, NEVER a countdown or a "you
   missed your goal" penalty (hard constraints #1/#2). Spread across short
   sessions is by design (better retention; ADHD-friendly).                   */
function dayKey(){ const d=new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function ensureDaily(){ const d=dayKey();
  if(!S.daily || S.daily.day!==d){
    if(S.daily && S.daily.secs){ S.history=S.history||{}; S.history[S.daily.day]=S.daily.secs;
      const ks=Object.keys(S.history).sort(); while(ks.length>60)delete S.history[ks.shift()]; }
    S.daily={day:d, secs:0, trainSecs:0, missions:0, goalHit:false};
    if(!S.goalMin)S.goalMin=30;
    save();
  } else { if(!S.goalMin)S.goalMin=30; if(S.daily.trainSecs===undefined)S.daily.trainSecs=0; }
}
let __lastInteract=Date.now(), __dailyDirty=0, __inTraining=false;
function noteInteract(){ __lastInteract=Date.now(); }
function dailyGoalSecs(){ return (S.goalMin||30)*60; }
function trainTick(){ ensureDaily();
  const hidden=(typeof document!=="undefined" && document.hidden);
  if(!hidden && (Date.now()-__lastInteract)<45000){
    S.daily.secs++; if(__inTraining)S.daily.trainSecs=(S.daily.trainSecs||0)+1; __dailyDirty++;
    if(__dailyDirty>=20){ __dailyDirty=0; save(); }
    updateDailyMeter();
    if(!S.daily.goalHit && S.daily.secs>=dailyGoalSecs()){ S.daily.goalHit=true; save(); dailyGoalReached(); }
  }
}
function updateDailyMeter(){ const fill=$("dailyFill"); if(!fill)return;
  const pct=Math.min(100, 100*(S.daily.secs||0)/dailyGoalSecs());
  fill.style.width=pct+"%"; fill.classList.toggle("done", pct>=100);
  const t=$("dailyTime"); if(t){ const m=Math.floor((S.daily.secs||0)/60);
    t.textContent = pct>=100 ? "— "+m+" min · GOAL!" : "— "+m+" / "+(S.goalMin||30)+" min"; }
}
function dailyGoalReached(){ try{Aud.ding();}catch(e){} Aud.play("daily_goal"); }
ensureDaily();
if(typeof document!=="undefined"){
  document.addEventListener("pointerdown",noteInteract,true);
  document.addEventListener("visibilitychange",()=>{ if(document.hidden)save(); });
  setInterval(trainTick,1000);
}
function mast(g){ if(!S.mastery[g])S.mastery[g]={seen:0,ok:0,str:0}; return S.mastery[g]; }
function record(g,ok){ const m=mast(g); m.seen++;
  if(ok){m.ok++;m.str=Math.min(5,m.str+1); combo++; if(combo>=3)comboPop(combo);}
  else {m.str=Math.max(0,m.str-1); combo=0;}
  save(); }
/* ---- MASTERY (proficiency, not just completion) ----
   An item is MASTERED when it's strong, well-seen, and accurate. Milestones
   (ally rescues / zone finales) are GATED on real mastery so "rescued X" truly
   means "proficient" — enforced gently via extra adaptive review, never failure. */
const MASTER_STR=4, MASTER_SEEN=4, MASTER_ACC=0.75;
function masteredItem(key){ const m=S.mastery[key];
  return !!(m && m.str>=MASTER_STR && m.seen>=MASTER_SEEN && (m.ok/m.seen)>=MASTER_ACC); }
function letterMastered(g){ return masteredItem(g); }
/* what a milestone certifies = every letter taught so far must be mastered */
function coreWeak(m){ return (m&&(m.finale||m.rescue)) ? actGraphemes().filter(g=>!letterMastered(g)) : []; }

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
  voice:null, cur:null, token:0, vol:1,
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
          const a=new Audio(src); this.cur=a; a.volume=this.vol;
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
      u.rate=L.r||0.92; u.pitch=1.05; u.volume=this.vol;
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
function heroOpts(){ /* muscle + gear come from THIS act's progress, so a new act resets his power */
  const a=currentAct(), done=actMissions(a).filter(m=>S.done[m.id]).length, gear=actGearList(a);
  const wmap={hammer:"Word Hammer",sword:"Gem Sword"}, eq=S.equip.weapon||"none";
  return { muscle: done>=7?2:(done>=3?1:0),
           weapon: (wmap[eq]&&!gear.includes(wmap[eq]))?"none":eq,   /* a new act steals his weapon too */
           cape: S.equip.cape||"red",
           theme: actInfo(a).theme||"hero",
           belt2:gear.includes("Power Belt"), boots2:gear.includes("Rocket Boots") }; }
function heroNow(w){ return heroSVG(w,heroOpts()); }
/* ---------------- SCREEN MGMT ---------------- */
const $=id=>document.getElementById(id);
/* Painted-scene slots: screen -> art/bg-<name>.* . Add an image to swap a scene;
   if the file is missing the layer stays transparent and the original look shows.
   Several screens intentionally share one scene (e.g. learn/trace, boss/forge). */
const BG_MAP={ scrTitle:"title", scrIntro:"intro", scrInter:"intro", scrScan:"lab", scrRead:"learn", scrSpell:"learn", scrMagic:"learn", scrSent:"learn", scrCloze:"learn", scrScramble:"learn", scrFortress:"battle",
  scrBase:"base", scrTrain:"base", scrLetter:"learn", scrTrace:"learn", scrFind:"city",
  scrBoss:"battle", scrForge:"battle", scrWin:"victory", scrRest:"rest" };
const __bgCache={};
const BG_EXTS=["jpg","jpeg","png","webp"];   /* drop any of these — no conversion needed */
/* Painted scene loader — ACT-AWARE + format-flexible. Act 2+ prefers its own scene
   (bg-<slot>-a2.*), falling back to the Act-1 scene (bg-<slot>.*), then to the
   transparent default. Tries jpg → png → webp for each. Any missing file just
   shows the original SVG/gradient look. */
function setBG(id){ const layer=$("bgLayer"); if(!layer)return;
  const slot=BG_MAP[id];
  if(!slot){ layer.classList.remove("on"); return; }
  const a=currentAct(), names = a>1 ? [slot+"-a"+a, slot] : [slot];
  const urls=[]; names.forEach(n=>BG_EXTS.forEach(e=>urls.push("art/bg-"+n+"."+e)));
  tryBG(layer, urls, 0, id); }
function tryBG(layer, urls, i, id){
  if(i>=urls.length){ layer.classList.remove("on"); return; }   /* none present → transparent default */
  const url=urls[i];
  if(__bgCache[url]===false){ tryBG(layer,urls,i+1,id); return; }
  const apply=()=>{ if($(id)&&$(id).classList.contains("on")){ layer.style.backgroundImage="url("+url+")"; layer.classList.add("on"); } };
  if(__bgCache[url]===true){ apply(); return; }
  const img=new Image();
  img.onload=()=>{ __bgCache[url]=true; apply(); };
  img.onerror=()=>{ __bgCache[url]=false; tryBG(layer,urls,i+1,id); };   /* try next candidate */
  img.src=url;
}
const AMBIENT_SCREENS=new Set(["scrTitle","scrMap","scrBase","scrWin","scrRest","scrIntro","scrInter"]);
function show(id){ document.querySelectorAll(".screen").forEach(s=>s.classList.remove("on"));
  __inTraining=(id==="scrTrain");   /* daily time split: count training-room time separately */
  $(id).classList.add("on"); $(id).classList.add("fadein");
  setTimeout(()=>$(id).classList.remove("fadein"),600);
  setBG(id);
  /* scene harmonizer: per-act colour grade + hotter grade on battle/finale screens */
  document.body.dataset.act=currentAct();
  document.body.classList.toggle("scene-battle", BG_MAP[id]==="battle");
  $("hud").style.display=(id==="scrTitle")?"none":"flex"; refreshHUD();
  const dm=$("dailyMeter"); if(dm){ dm.style.display=(id==="scrMap")?"block":"none"; if(id==="scrMap")updateDailyMeter(); } }
function refreshHUD(){ $("hudStars").textContent="⚡ "+S.stars; }
/* ---------------- JUICE / FX ----------------
   Big, celebratory reward moments (no photosensitivity concern). All effects
   are fire-and-forget DOM bits that auto-remove, so they can never hang a flow.
   Respect prefers-reduced-motion: heavy effects soften to a calm version.   */
const REDUCE = (window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches);
function stageEl(){ return $("stage"); }
function shakeStage(big){ const s=stageEl(); if(!s||REDUCE)return; const c=big?"shaking big":"shaking";
  s.classList.remove("shaking","big"); void s.offsetWidth; s.classList.add(...c.split(" "));
  setTimeout(()=>s.classList.remove("shaking","big"),big?520:340); }
function flashScreen(color){ const s=stageEl(); if(!s||REDUCE)return; const f=document.createElement("div");
  f.className="flashfx"; if(color)f.style.background=color; s.appendChild(f); setTimeout(()=>f.remove(),360); }
const CONFETTI_COLORS=["#ffd75e","#ff5e57","#3ec97e","#5f6dff","#a06ae8","#7fd9ff","#ff8a3d"];
function confetti(n){ const s=stageEl(); if(!s)return; n=REDUCE?12:(n||64);
  const W=s.clientWidth;
  for(let i=0;i<n;i++){ const c=document.createElement("div"); c.className="confetti";
    c.style.left=(Math.random()*W)+"px"; c.style.background=CONFETTI_COLORS[i%CONFETTI_COLORS.length];
    c.style.setProperty("--dx",(Math.random()*160-80)+"px");
    c.style.animationDelay=(Math.random()*0.25)+"s";
    c.style.animationDuration=(1.1+Math.random()*0.9)+"s";
    if(Math.random()<.5)c.style.borderRadius="50%";
    s.appendChild(c); setTimeout(()=>c.remove(),2300); } }
let combo=0;
function comboPop(n){ const s=stageEl(); if(!s||REDUCE)return; const c=document.createElement("div");
  c.className="combochip"; c.textContent="COMBO ×"+n+" 🔥"; s.appendChild(c); setTimeout(()=>c.remove(),950); }
function burstAt(el,word){ const r=el.getBoundingClientRect(),st=$("stage").getBoundingClientRect();
  const cx=r.left-st.left+r.width/2, cy=r.top-st.top+r.height/2;
  const b=document.createElement("div"); b.className="burst";
  b.style.left=(cx-70)+"px"; b.style.top=(cy-70)+"px";
  $("stage").appendChild(b); setTimeout(()=>b.remove(),600);
  if(!REDUCE){ for(let i=0;i<6;i++){ const sp=document.createElement("div"); sp.className="spark";
      const ang=(Math.PI*2*i/6)+Math.random()*0.5, dist=44+Math.random()*26;
      sp.style.left=cx+"px"; sp.style.top=cy+"px";
      sp.style.setProperty("--sx",Math.cos(ang)*dist+"px"); sp.style.setProperty("--sy",Math.sin(ang)*dist+"px");
      sp.style.background=CONFETTI_COLORS[i%CONFETTI_COLORS.length];
      $("stage").appendChild(sp); setTimeout(()=>sp.remove(),520); } }
  if(word){ const z=document.createElement("div"); z.className="zapword"; z.textContent=word;
    z.style.left=(cx-60)+"px"; z.style.top=(r.top-st.top-40)+"px";
    $("stage").appendChild(z); setTimeout(()=>z.remove(),900); shakeStage(); flashScreen(); } }

/* ---------------- TITLE ---------------- */
$("titleHero").innerHTML=heroNow(210);
function vpMsg(){ const n=(typeof VOICEPACK!=="undefined")?Object.keys(VOICEPACK).length:0;
  const c=Object.keys(CUSTOM).length;
  const parts=[];
  if(c)parts.push(c+" voices recorded on this iPad");
  if(n)parts.push(n+" studio lines");
  return parts.length? parts.join(" · ") : "Using built-in voice — record your own in Grown-Up Corner ▸ Voices"; }
$("vpStatus").textContent=vpMsg();
/* paint the title for the ACTIVE player (auto-loaded last player) */
function paintTitle(){ const nm=$("playerName"); if(nm)nm.textContent=profileName(ACTIVE);
  $("titleHero").innerHTML=heroNow(210);
  $("btnContinue").style.display=S.intro?"inline-block":"none";
  $("btnPlayer").style.display=profiles().length>1?"inline-block":"none"; }
paintTitle();
setBG("scrTitle");   /* the title is shown via static HTML, so load its painted background at boot */
if(S.calm)document.body.classList.add("calm");   /* parent "Calm" visual-detail mode */
Aud.vol = (S.vol==null?1:S.vol);                 /* parent narration volume (0–1) */
document.body.dataset.act=currentAct();           /* scene-grade theme from boot (title is static) */
document.body.classList.add("scene-ambient");     /* the boot title screen is ambient */
$("btnStart").onclick=()=>{ Aud.pick(); if(!S.intro)startIntro(); else {Aud.play("welcome"); toMap();} };
$("btnContinue").onclick=()=>{ Aud.pick(); Aud.play("welcome"); toMap(); };
/* ---- player picker (select an existing player; add/remove is parent-only) ---- */
const PC_CAPES=["red","gold","purple"];
function openPicker(){ paintPicker(); $("playerPicker").classList.add("on"); }
function closePicker(){ $("playerPicker").classList.remove("on"); }
function paintPicker(){ const wrap=$("playerCards"); if(!wrap)return; wrap.innerHTML="";
  profiles().forEach((p,i)=>{ const b=document.createElement("button"); b.className="playercard"+(p.id===ACTIVE?" cur":"");
    const hero=heroSVG(96,{muscle:1,cape:PC_CAPES[i%PC_CAPES.length],theme:p.id===ACTIVE&&currentAct()===2?"knight":"hero"});
    b.innerHTML=`<div class="pchero">${hero}</div><div class="pcname read"></div>`;
    b.querySelector(".pcname").textContent=p.name;
    b.onclick=()=>switchProfile(p.id); wrap.appendChild(b); }); }
function switchProfile(id){ closePicker(); if(id===ACTIVE)return;
  save(); Aud.stop(); applyProfile(id); S=load(); GEO=geomFor(currentAct()); paintTitle(); show("scrTitle");
  cloudPull().then(changed=>{ if(changed){ GEO=geomFor(currentAct()); paintTitle(); } }); }
$("btnPlayer").onclick=()=>{ Aud.pick(); openPicker(); };
$("btnPickerClose").onclick=closePicker;
/* on boot, restore newer cloud progress (if a Worker URL is configured/baked in) */
cloudPull().then(changed=>{ if(changed){ GEO=geomFor(currentAct()); paintTitle(); $("vpStatus").textContent=vpMsg();
  cloudStatus("Restored his latest progress from the cloud ✓"); } });

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

/* ---------------- ACT-1 → ACT-2 INTERLUDE (handoff cutscene) ----------------
   Plays after Leighton's rescue: Mom & Dad return, the Vixen kidnaps Miss
   Kendall + friends and flees through a time portal, Teddy follows and becomes
   a KNIGHT (power-reset). Ends by flipping S.act to 2; since Act-2 content isn't
   built yet, it lands on a friendly "coming soon" panel (no empty map). */
const INTERLUDE=[
 {art:`<div style="display:flex;justify-content:center;padding:20px;">${mentorChips(260)}</div>`, id:"interlude1"},
 {art:`<div style="display:flex;justify-content:center;">${captiveSVG(260)}</div>`, id:"interlude2"},
 {art:`<div style="display:flex;justify-content:center;">${vixenSVG(220)}</div>`, id:"interlude3"},
 {art:`<div style="display:flex;justify-content:center;">${portalSVG(220)}</div>`, id:"interlude4"},
 {art:()=>`<div style="display:flex;justify-content:center;">${heroSVG(220,{...heroOpts(),theme:"knight",muscle:0,weapon:"none",belt2:false,boots2:false})}</div>`, id:"interlude_knight"}
];
let interIx=0;
function startInterlude(){ interIx=0; show("scrInter"); paintInter(); }
function paintInter(){ const p=INTERLUDE[interIx];
  $("interArt").innerHTML=(typeof p.art==="function")?p.art():p.art;
  narrate("inter",$("interText"),[p.id]);
  $("btnInterNext").textContent = interIx<INTERLUDE.length-1?"NEXT ➜":"INTO THE PORTAL! ➜";
  $("btnInterNext").onclick=()=>{ interIx++;
    if(interIx<INTERLUDE.length)paintInter(); else finishInterlude(); }; }
function finishInterlude(){ Aud.stop(); setAct(2); save();
  actMissions(2).length ? startAct2Intro() : actComingSoon(); }
/* Act-2 onboarding: NOAH THE RED greets Sir Teddy and explains RUNES (digraphs),
   then opens the medieval map. Plays once (S.act2intro). */
const ACT2_INTRO=[
 {art:()=>`<div style="display:flex;justify-content:center;">${noahSVG(240)}</div>`, id:"noah1"},
 {art:()=>`<div style="display:flex;justify-content:center;gap:8px;align-items:center;">${noahSVG(160)}<div style="display:flex;gap:8px;">${["sh","ch","th"].map(d=>`<span style="font-family:Andika;font-weight:700;font-size:46px;color:#ffd75e;-webkit-text-stroke:5px #150f2e;paint-order:stroke;">${d}</span>`).join("")}</div></div>`, id:"noah2"},
 {art:()=>`<div style="display:flex;justify-content:center;">${heroNow(220)}</div>`, id:"noah3"}
];
let a2Ix=0;
function startAct2Intro(){ a2Ix=0; show("scrInter"); paintA2(); }
function paintA2(){ const p=ACT2_INTRO[a2Ix];
  $("interArt").innerHTML=(typeof p.art==="function")?p.art():p.art;
  narrate("inter",$("interText"),[p.id]);
  $("btnInterNext").textContent = a2Ix<ACT2_INTRO.length-1?"NEXT ➜":"ENTER THE REALM! ➜";
  $("btnInterNext").onclick=()=>{ a2Ix++;
    if(a2Ix<ACT2_INTRO.length)paintA2(); else { S.act2intro=true; save(); Aud.stop(); toMap(); } }; }
/* Shown when the current act has no missions yet (safe fallback). */
function actComingSoon(){ show("scrInter");
  $("interArt").innerHTML=`<div style="display:flex;justify-content:center;">${heroNow(220)}</div>`;
  narrate("inter",$("interText"),["interlude5"]);
  $("btnInterNext").textContent="BACK TO TITLE";
  $("btnInterNext").onclick=()=>{ Aud.stop(); show("scrTitle"); }; }

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
  $("scanProg").textContent=(scanIx+1)+" / "+SCAN_SET.length;
  narrate("scan",$("scanText"),["scan_prompt","snd_"+target],"Tap the gem that makes the sound\u2026");
  const row=$("scanTiles"); row.innerHTML="";
  opts.forEach(g=>{ const t=document.createElement("button"); t.className="tile read"; t.textContent=g;
    t.onclick=()=>{ const ok=(g===target);
      mast(target).str=ok?2:0; mast(target).seen++; if(ok)mast(target).ok++; save();
      Aud.ding(); t.classList.add("win"); burstAt(t);
      scanIx++; setTimeout(nextScan,650); };
    row.appendChild(t); });
}

/* ---------------- STAR FORCE CITY MAP ---------------- */
function trailPath(){ const pts=[GEO.base,...actMissions(currentAct()).map(m=>nodeOf(m.id)),[GEO.fort[0],GEO.fort[1]+170]];
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
  const ms=actMissions(currentAct()), az=actZones(currentAct()), info=actInfo(currentAct());
  const showHeart=ms.some(m=>m.id===17), hN=nodeOf(17);
  const heartPos=[hN[0]>400?hN[0]-265:hN[0]+265, hN[1]-20];
  const avail=i=> i===0 || done(ms[i-1].id);
  let nodes="";
  ms.forEach((m,i)=>{
    const [x,y]=nodeOf(m.id);
    const st=done(m.id)?"done":(avail(i)?"current":"locked");
    const fill=done(m.id)?"#3ec97e":(avail(i)?"#ffc93c":"#3b3360");
    const side = x<400 ? 1 : -1;
    const lbl=m.lbl.toUpperCase();
    const pw=Math.min(338, Math.max(168, lbl.length*11.5+30));      /* pill auto-fits the label */
    let lx=x+side*(48+pw/2); lx=Math.max(pw/2+6, Math.min(800-pw/2-6, lx));   /* keep on-screen */
    nodes+=`<g class="mnode ${st}" data-mid="${m.id}">
      <ellipse cx="${x}" cy="${y+40}" rx="44" ry="12" fill="#0a0618" opacity=".5"/>
      <circle cx="${x}" cy="${y}" r="50" fill="${fill}" opacity=".42" filter="url(#softGlow)"/>
      <circle class="ring" cx="${x}" cy="${y}" r="40" fill="url(#node_${st})" stroke="#150f2e" stroke-width="6"/>
      <ellipse cx="${x}" cy="${y-15}" rx="23" ry="14" fill="#ffffff" opacity=".32"/>
      ${done(m.id)?`<text x="${x}" y="${y+14}" text-anchor="middle" font-family="Bangers" font-size="38" fill="#0c3f28">✓</text>`
        : st==="locked"?`<g transform="translate(${x} ${y})" stroke="#150f2e" stroke-width="2.6"><path d="M-7 -2 v-5 a7 7 0 0 1 14 0 v5" fill="none" stroke="#cdc6ea"/><rect x="-12" y="-2" width="24" height="18" rx="4" fill="#cdc6ea"/></g>`
        : `<circle cx="${x}" cy="${y}" r="8" fill="#fff" opacity=".92"/>`}
      <g transform="translate(${lx},${y})" filter="url(#pillShadow)">
        <rect x="${-pw/2}" y="-21" width="${pw}" height="42" rx="15" fill="rgba(12,7,30,.86)" stroke="#ffce3a" stroke-width="2.5"/>
        <text x="0" y="9" text-anchor="middle" textLength="${pw-22}" lengthAdjust="spacingAndGlyphs" font-family="Bangers" font-size="20" fill="${done(m.id)?"#9fe870":"#ffe08a"}" letter-spacing="1">${lbl}</text>
      </g></g>`;
  });
  const vexDone=currentAct()===1 && done(48);   /* Act-1 finale beaten (Act-1 map only) */
  /* zone divider bands between groups within the act */
  let dividers="";
  for(let i=1;i<az.length;i++){
    const dy=Math.round((Math.min(...az[i-1].nodes.map(p=>p[1]))+Math.max(...az[i].nodes.map(p=>p[1])))/2)+52;
    dividers+=`<g transform="translate(400 ${dy})">
      <line x1="-330" y1="0" x2="330" y2="0" stroke="#fff6e3" stroke-width="3" stroke-dasharray="10 14" opacity=".4"/>
      <g filter="url(#pillShadow)"><rect x="-184" y="-22" width="368" height="44" rx="15" fill="rgba(12,7,30,.88)" stroke="#f2a9c4" stroke-width="2.5"/>
      <path d="M-168 0 l9 -7 l9 7" fill="none" stroke="#f2a9c4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M150 0 l9 -7 l9 7" fill="none" stroke="#f2a9c4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="0" y="9" text-anchor="middle" font-family="Bangers" font-size="22" fill="#ffc6e0" letter-spacing="2">${az[i].name}</text></g></g>`;
  }
  return `<svg viewBox="0 ${GEO.viewTop} 800 ${GEO.mapH-GEO.viewTop}">
  <defs>
    <linearGradient id="msky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#070418"/><stop offset=".35" stop-color="#1b1252"/>
      <stop offset=".7" stop-color="#46297f"/><stop offset="1" stop-color="#8a4a8f"/>
    </linearGradient>
    <linearGradient id="trailG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffd75e"/><stop offset="1" stop-color="#f0a82b"/>
    </linearGradient>
    <radialGradient id="moonG" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#fff6e3" stop-opacity=".8"/><stop offset="1" stop-color="#fff6e3" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="node_done" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#bdffdc"/><stop offset=".5" stop-color="#3ec97e"/><stop offset="1" stop-color="#0f6a40"/></radialGradient>
    <radialGradient id="node_current" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#fff1b8"/><stop offset=".5" stop-color="#ffce3a"/><stop offset="1" stop-color="#b9760f"/></radialGradient>
    <radialGradient id="node_locked" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#5b5384"/><stop offset=".5" stop-color="#3b3360"/><stop offset="1" stop-color="#211c3a"/></radialGradient>
    <filter id="softGlow" x="-90%" y="-90%" width="280%" height="280%"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="pillShadow" x="-15%" y="-60%" width="130%" height="220%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000" flood-opacity=".55"/></filter>
  </defs>
  <rect y="${GEO.viewTop}" width="800" height="${GEO.mapH-GEO.viewTop}" fill="url(#msky)" opacity=".5"/>
  <circle cx="650" cy="${GEO.viewTop+150}" r="130" fill="url(#moonG)"/>
  <circle cx="650" cy="${GEO.viewTop+150}" r="50" fill="#fff1cf" stroke="#150f2e" stroke-width="5"/>
  <circle cx="632" cy="${GEO.viewTop+138}" r="8" fill="#ead9b4"/><circle cx="664" cy="${GEO.viewTop+162}" r="6" fill="#ead9b4"/>
  <g fill="#fff6e3">${[[120,90],[300,60],[520,110],[80,240],[730,300],[200,180],[420,40],[600,250]].map(([sx,sy])=>`<circle cx="${sx}" cy="${GEO.viewTop+sy}" r="2.5"/>`).join("")}</g>
  <g fill="#fff6e3"><circle cx="120" cy="90" r="3"/><circle cx="300" cy="60" r="2.4"/><circle cx="520" cy="110" r="2.6"/><circle cx="80" cy="240" r="2.2"/><circle cx="730" cy="300" r="2.4"/><circle cx="200" cy="180" r="2"/></g>
  <g class="mcloudB" fill="#cdb8ff" opacity=".14">
    <path d="M140 210 q18 -34 54 -27 q12 -26 47 -20 q31 -9 43 16 q32 2 27 31 z"/>
    <path d="M560 320 q15 -28 45 -22 q10 -22 40 -16 q26 -8 36 13 q27 2 23 25 z"/>
  </g>
  <g class="mcloudA" fill="#e7dcff" opacity=".1">
    <path d="M380 130 q13 -24 39 -19 q9 -18 33 -13 q22 -6 31 11 q22 2 18 21 z"/>
  </g>

  ${skyline(GEO.minY+330,70,"#241b4d",.45,6)}
  ${skyline(GEO.minY+560,95,"#2c2158",.65,8)}
  ${windowsRow(GEO.minY+560,13)}
  ${skyline(700,80,"#241b4d",.55,3)}
  ${skyline(980,110,"#2c2158",.8,5)}
  ${windowsRow(980,7)}
  <rect x="0" y="660" width="800" height="50" fill="#7a5aa8" opacity=".25"/>
  ${skyline(1290,130,"#332a66",1,9)}
  ${windowsRow(1290,11)}
  <rect x="0" y="1290" width="800" height="270" fill="#3a2f6e"/>
  <ellipse cx="180" cy="1340" rx="180" ry="46" fill="#2f8f5b" opacity=".9"/>
  <ellipse cx="660" cy="1370" rx="200" ry="52" fill="#2a7d50" opacity=".9"/>

  <!-- The act's villain fortress (always at the summit) -->
  <g transform="translate(${GEO.fort[0]} ${GEO.fort[1]})">
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
      <text x="0" y="9" text-anchor="middle" font-family="Bangers" font-size="23" fill="#9fe870" letter-spacing="1">${vexDone?"VEX DEFEATED · LEIGHTON FREED!":info.fortressLabel}</text>
    </g>
  </g>

  <!-- HEART TOWER (act-1 landmark, beside Amelia's rescue) -->
  ${showHeart?`<g transform="translate(${heartPos[0]} ${heartPos[1]})">
    <rect x="-36" y="-90" width="72" height="170" rx="10" fill="#241b4d" stroke="#150f2e" stroke-width="5"/>
    <path d="M0 -122 q16 -20 32 -4 q14 14 -6 32 L0 -68 L-26 -94 q-20 -18 -6 -32 q16 -16 32 4z" fill="${done(17)?"#ff7d9c":"#e6453c"}" stroke="#150f2e" stroke-width="4"/>
    ${done(17)?'<g fill="#ffd75e" opacity=".95"><path d="M0 -168 L7 -150 L-7 -150Z"/><path d="M-46 -140 L-32 -132 L-42 -122Z"/><path d="M46 -140 L32 -132 L42 -122Z"/></g>':''}
    <g fill="#ffc93c" opacity=".85"><rect x="-22" y="-66" width="12" height="15"/><rect x="10" y="-30" width="12" height="15"/><rect x="-22" y="6" width="12" height="15"/></g>
    <g transform="translate(0 116)">
      <rect x="-128" y="-18" width="256" height="36" rx="12" fill="rgba(21,15,46,.92)" stroke="${done(17)?"#3ec97e":"#f2a9c4"}" stroke-width="2.5"/>
      <text x="0" y="8" text-anchor="middle" font-family="Bangers" font-size="20" fill="${done(17)?"#9fe870":"#f2a9c4"}" letter-spacing="1">${done(17)?"HEARTGUARD JOINS THE LEAGUE!":"HEART TOWER · SAVE AMELIA"}</text>
    </g>
  </g>`:""}
  ${dividers}

  <!-- the golden trail -->
  <path d="${trailPath()}" fill="none" stroke="#150f2e" stroke-width="44" stroke-linecap="round" opacity=".92"/>
  <path d="${trailPath()}" fill="none" stroke="url(#trailG)" stroke-width="30" stroke-linecap="round"/>
  <path d="${trailPath()}" fill="none" stroke="#fff6e3" stroke-width="5" stroke-linecap="round" stroke-dasharray="16 24" opacity=".85"/>

  ${gemDeco(120,1090,"#3b82f0",1.2)} ${gemDeco(640,1010,"#3ec97e",1)} ${gemDeco(90,860,"#a06ae8",1.1)}
  ${gemDeco(700,760,"#ff8a3d",1)} ${gemDeco(620,470,"#7fd9ff",1.2)} ${gemDeco(150,540,"#ffc93c",1)}

  <!-- HERO BASE node -->
  <g class="mnode current" id="baseNode">
    <ellipse cx="${GEO.base[0]}" cy="${GEO.base[1]+52}" rx="86" ry="14" fill="#150f2e" opacity=".35"/>
    <g transform="translate(${GEO.base[0]} ${GEO.base[1]})">
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

const CAGED=[{mid:3,kind:"tank",name:"TANK",real:"ARCHIE"},{mid:6,kind:"flip",name:"FLIP",real:"ELLIE"},{mid:8,kind:"sunny",name:"SUNNY",real:"WILLIAM"}];
/* Hero League: each friend (a REAL person Teddy knows) owns one mission type and
   cheers him BY NAME during it, once freed. Amelia cheers on every win. */
const ALLY={
  tank: {real:"Archie",  owns:"boss",   lines:["cheer_archie1","cheer_archie2"]},
  flip: {real:"Ellie",   owns:"trace",  lines:["cheer_ellie1","cheer_ellie2"]},
  sunny:{real:"William", owns:"patrol", lines:["cheer_will1","cheer_will2"]},
  heart:{real:"Amelia",  owns:"win",    lines:["heart_cheer1","heart_cheer2","heart_cheer3"]}
};
function allyMid(kind){ if(kind==="heart")return 17;
  const c=CAGED.find(x=>x.kind===kind); return c?c.mid:-1; }
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
const LEAGUE=[...CAGED.map(t=>({mid:t.mid,kind:t.kind,name:t.name,real:t.real})),
  {mid:17,kind:"heart",name:"HEARTGUARD",real:"AMELIA"},
  {mid:48,kind:"leighton",name:"STARLIGHT PRINCESS",real:"LEIGHTON"},
  {mid:128,kind:"kendall",name:"MISS KENDALL",real:"MISS KENDALL"}];
/* a small LIVING friend on the map — recognizable little figure; captive ones
   wave for help with a ball-and-chain, freed ones cheer with arms up. */
const ALLY_COL={tank:"#e6453c", flip:"#3a9bff", sunny:"#ffce3a", heart:"#ff7d9c", leighton:"#a06ae8", kendall:"#5fa86a"};
function allyMapFig(kind, freed){
  const c=ALLY_COL[kind]||"#7a6fb0";
  const arms = freed
    ? `<path d="M-15 4 q-12 -12 -8 -26" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M15 4 q12 -12 8 -26" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/>`
    : `<path d="M15 2 q15 -2 14 -24" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M-15 4 q-9 8 -7 17" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
  const chain = freed ? '' : `<g stroke="#5a5570" stroke-width="3"><line x1="5" y1="47" x2="20" y2="53"/></g><circle cx="24" cy="55" r="7" fill="#4a455e" stroke="#150f2e" stroke-width="2.5"/>`;
  return `<g>
    <ellipse cx="0" cy="50" rx="23" ry="6" fill="#000" opacity=".35"/>
    ${arms}
    <path d="M-15 2 q-3 30 4 42 l22 0 q7 -12 4 -42 q-15 -8 -30 0z" fill="${c}" stroke="#150f2e" stroke-width="4"/>
    <rect x="-11" y="40" width="9" height="13" rx="4" fill="#2a2440" stroke="#150f2e" stroke-width="3"/>
    <rect x="2" y="40" width="9" height="13" rx="4" fill="#2a2440" stroke="#150f2e" stroke-width="3"/>
    ${chain}
    <g transform="translate(0 -20) scale(.9)">${allyFace(kind)}</g>
  </g>`;
}
function allyTeasers(){
  let out="";
  CAGED.forEach(t=>{ const [x,y]=nodeOf(t.mid); const side=x<400?1:-1;
    const px=x+side*180; const freed=!!S.done[t.mid];
    const col=freed?"#3ec97e":"#e62e2e", txt=freed?"#9fe870":"#ff9d8f", label=freed?(t.real+" FREED!"):("FREE "+t.real+"!");
    out+=`<g transform="translate(${px} ${y-66})">
      ${allyMapFig(t.kind, freed)}
      <g filter="url(#pillShadow)"><rect x="-80" y="58" width="160" height="30" rx="11" fill="rgba(12,7,30,.86)" stroke="${col}" stroke-width="2.5"/>
      <text x="0" y="79" text-anchor="middle" font-family="Bangers" font-size="16" fill="${txt}" letter-spacing="1">${label}</text></g></g>`;
  });
  return out;
}
function heroMarker(){ const ms=actMissions(currentAct()); let ix=0;
  for(let i=0;i<ms.length;i++){ if(!S.done[ms[i].id]){ix=i;break;} ix=i; }
  const [x,y]=nodeOf(ms[ix].id);
  return `<g transform="translate(${x-44} ${y-186}) scale(.30)">${heroNow(250).replace(/<svg[^>]*>|<\/svg>/g,"")}</g>`;
}
/* ============ PAINTED WORLD MAP (interactive zone nodes over the painting) ============
   One painted image per act (path + landmarks baked in); we overlay a glowing,
   tappable node on each zone's painted spot. Tapping the CURRENT zone plays its next
   mission; done zones replay; locked zones are gated (no skipping ahead). The whole
   per-mission flow / saves / mastery / finale logic is unchanged — only the map view. */
const MAPIMG={1:"art/bg-map.jpeg", 2:"art/bg-map-a2.jpeg"};
/* zone landmark positions on the painted map, in a 1000x750 (4:3) space, in
   ZONES play order per act — calibrated by eye to sit on the painted golden path. */
const ZONESPOTS={
  1:[[215,640],[362,432],[298,300],[322,168],[560,212],[592,352],[722,330],[772,206],[838,108]],
  2:[[182,600],[432,430],[776,224],[712,360],[548,300],[486,128]]
};
function zMissions(z){ return MISSIONS.filter(m=>m.z===z.id).sort((a,b)=>a.id-b.id); }
function zoneDone(z){ const m=zMissions(z); return m.length>0 && m.every(x=>S.done[x.id]); }
function zoneNext(z){ const m=zMissions(z); return m.find(x=>!S.done[x.id])||m[0]; }
function curZoneIx(zs){ const i=zs.findIndex(z=>!zoneDone(z)); return i<0?zs.length-1:i; }
/* small captive/freed friend figures near their rescue zone (Act-1 league). */
function mapFriends(a, zs, spots){
  const rescues = a===2 ? [{mid:128,kind:"kendall"}]
    : [{mid:3,kind:"tank"},{mid:6,kind:"flip"},{mid:8,kind:"sunny"},{mid:17,kind:"heart"},{mid:48,kind:"leighton"}];
  const byZi={};
  rescues.forEach(r=>{ const m=MISSIONS.find(x=>x.id===r.mid); if(!m)return;
    const zi=zs.findIndex(z=>z.id===m.z); if(zi<0)return; (byZi[zi]=byZi[zi]||[]).push(r); });
  let out="";
  Object.keys(byZi).forEach(zi=>{ const sp=spots[zi]; if(!sp)return; const [x,y]=sp;
    const list=byZi[zi]; const unf=list.find(r=>!S.done[r.mid]); const r=unf||list[list.length-1]; const freed=!unf;
    const fx=x+(x<500?72:-72);
    out+=`<g transform="translate(${fx} ${y-4}) scale(.62)">${allyMapFig(r.kind, freed)}</g>`; });
  return out;
}
function mapPaintSVG(){
  const a=currentAct(), zs=actZones(a), spots=ZONESPOTS[a]||[];
  const cur=curZoneIx(zs);
  let nodes="", hero="";
  zs.forEach((z,zi)=>{
    const [x,y]=spots[zi]||[500,375];
    const st= zoneDone(z)?"done":(zi===cur?"current":"locked");
    const nm=z.name.toUpperCase();
    const pw=Math.min(300,Math.max(150,nm.length*11+26)), R=36;
    nodes+=`<g class="mnode ${st}" data-zi="${zi}">
      <ellipse cx="${x}" cy="${y+32}" rx="32" ry="8" fill="#0a0414" opacity=".5"/>
      <circle class="obloom" cx="${x}" cy="${y}" r="${R+16}" fill="url(#node_${st})" opacity=".5" filter="url(#mglow)"/>
      <circle cx="${x}" cy="${y}" r="${R}" fill="url(#node_${st})" stroke="#0c0820" stroke-width="3"/>
      <circle cx="${x}" cy="${y}" r="${R-1}" fill="none" stroke="#fff" stroke-width="2" opacity=".35"/>
      <ellipse cx="${x}" cy="${y+13}" rx="${R*.62}" ry="${R*.36}" fill="#fff" opacity=".1"/>
      <ellipse cx="${x-9}" cy="${y-14}" rx="13" ry="8" fill="#fff" opacity=".5" transform="rotate(-28 ${x-9} ${y-14})"/>
      <circle cx="${x-13}" cy="${y-13}" r="4.5" fill="#fff" opacity=".9"/>
      ${ st==="done" ? `<text x="${x}" y="${y+13}" text-anchor="middle" font-family="Bangers" font-size="36" fill="#0c3f28">✓</text>`
        : st==="locked" ? `<g transform="translate(${x} ${y})" stroke="#150f2e" stroke-width="2.4"><path d="M-6 -1 v-4 a6 6 0 0 1 12 0 v4" fill="none" stroke="#d7d0ee"/><rect x="-10" y="-1" width="20" height="15" rx="3.5" fill="#d7d0ee"/></g>`
        : `<circle cx="${x}" cy="${y}" r="7" fill="#fff" opacity=".95"/>` }
      <g transform="translate(${x},${y+R+22})" filter="url(#mpill)">
        <rect x="${-pw/2}" y="-17" width="${pw}" height="34" rx="13" fill="rgba(10,5,24,.82)" stroke="${st==="locked"?"#6a6090":"#ffce3a"}" stroke-width="2.2"/>
        <text x="0" y="6" text-anchor="middle" textLength="${pw-20}" lengthAdjust="spacingAndGlyphs" font-family="Bangers" font-size="17" fill="${st==="done"?"#9fe870":st==="locked"?"#9a92c0":"#ffe08a"}" letter-spacing="1">${nm}</text>
      </g></g>`;
    if(zi===cur) hero=`<g transform="translate(${x-30} ${y-150}) scale(.26)">${heroNow(250).replace(/<svg[^>]*>|<\/svg>/g,"")}</g>`;
  });
  return `<svg viewBox="0 0 1000 750" preserveAspectRatio="xMidYMid slice">
    <defs>
      <radialGradient id="node_done" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#bdffdc"/><stop offset=".5" stop-color="#3ec97e"/><stop offset="1" stop-color="#0f6a40"/></radialGradient>
      <radialGradient id="node_current" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#fff1b8"/><stop offset=".5" stop-color="#ffce3a"/><stop offset="1" stop-color="#b9760f"/></radialGradient>
      <radialGradient id="node_locked" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#5b5384"/><stop offset=".5" stop-color="#3b3360"/><stop offset="1" stop-color="#211c3a"/></radialGradient>
      <filter id="mglow" x="-90%" y="-90%" width="280%" height="280%"><feGaussianBlur stdDeviation="8"/></filter>
      <filter id="mpill" x="-15%" y="-60%" width="130%" height="220%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity=".55"/></filter>
      <style>@media (prefers-reduced-motion: no-preference){.mnode.current .obloom{animation:opul 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}}@keyframes opul{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:.8;transform:scale(1.14)}}</style>
    </defs>
    <image href="${MAPIMG[a]||MAPIMG[1]}" x="0" y="0" width="1000" height="750" preserveAspectRatio="xMidYMid slice"/>
    ${mapFriends(a, zs, spots)}
    ${nodes}
    ${hero}
  </svg>`;
}
function toMap(){ sessionTick();
  if(!actMissions(currentAct()).length){ actComingSoon(); return; }  /* act with no content yet → safe landing */
  GEO=geomFor(currentAct()); show("scrMap");
  $("hudTitle").textContent=actInfo(currentAct()).city;
  $("mapSVGwrap").innerHTML=mapPaintSVG();
  const zs=actZones(currentAct());
  document.querySelectorAll("#mapSVGwrap .mnode").forEach(n=>{
    n.addEventListener("click",()=>{
      if(n.classList.contains("locked")){ Aud.play("locked_tip"); return; }  /* no skipping ahead */
      const z=zs[+n.dataset.zi]; const m=z&&zoneNext(z); if(m)startMission(m); });
  });
  Aud.play("pick");
}
$("btnHome").onclick=()=>{Aud.stop();clearFlow();toMap();};
$("mapBaseBtn").onclick=()=>{Aud.stop();clearFlow();showBase();};
$("btnSkip").onclick=()=>{ Aud.stop(); const f=__cont; clearFlow(); if(f)f(); };

/* ---------------- MISSION FLOW ---------------- */
let CUR=null;
/* Letters actually taught so far (gem rescued) — progress-accurate, so review
   never shows a letter that hasn't been introduced yet. */
function taughtLetters(){ return ORDER.filter(g=>S.done[LETTER_MISSION[g]]); }
/* Act-2 digraphs (one gem, one sound). DIGRAPH_MISSION maps each to its learn
   mission; taughtGraphemes() = every grapheme taught so far (letters + digraphs)
   and is used for foil pools so a digraph can appear among the distractor gems. */
const DIGRAPH_MISSION={sh:100,ch:101,th:103,wh:105,ck:106,ng:107};
const MAGICE_MISSION={a_e:119,i_e:120,o_e:123,u_e:124};   /* unit -> its "Magic-E Spell" teach mission */
const VOWELTEAM_MISSION={ai:129,ee:130,oa:133};           /* team -> its "Quest" teach mission */
function taughtDigraphs(){ return DIGRAPHS.filter(d=>S.done[DIGRAPH_MISSION[d]]); }
function taughtMagicE(){ return MAGICE_UNITS.filter(u=>S.done[MAGICE_MISSION[u]]); }
function taughtVowelTeams(){ return VOWELTEAMS.filter(t=>S.done[VOWELTEAM_MISSION[t]]); }
function taughtGraphemes(){ return taughtLetters().concat(taughtDigraphs()).concat(taughtVowelTeams()); }
/* graphemes/rules taught in the CURRENT act (Act-2 milestones gate on digraphs +
   magic-e + vowel teams, since the 26 letters are already mastered and carried over) */
function actGraphemes(){ return currentAct()===2 ? taughtDigraphs().concat(taughtMagicE()).concat(taughtVowelTeams()) : taughtLetters(); }
/* Adaptive pick: weight toward the child's weakest graphemes (low strength /
   low accuracy / fewest reps) so patrols self-target what needs work. */
function pickWeak(pool){ if(!pool.length)return null;
  const wt=pool.map(g=>{ const m=mast(g); const acc=m.seen?m.ok/m.seen:0;
    return 1 + (5-(m.str||0))*1.4 + (1-acc)*1.2 + (m.seen<3?1.5:0); });
  let r=Math.random()*wt.reduce((a,b)=>a+b,0);
  for(let i=0;i<pool.length;i++){ if((r-=wt[i])<=0)return pool[i]; }
  return pool[pool.length-1]; }
/* CONFUSABLE pairs (mirror/rotation) — the classic reversal traps. Foils
   preferentially include the target's twin, so every review round quietly
   trains b-vs-d (etc.) discrimination once both are taught. */
const CONFUSE={ b:["d","p"], d:["b","p"], p:["q","b"], q:["p"], n:["m","u"], m:["n","w"], u:["n"], w:["m"] };
function shuf(a){ return a.slice().sort(()=>Math.random()-.5); }
function pickFoils(g, pool, n){ const cands=pool.filter(x=>x!==g);
  const twin=(CONFUSE[g]||[]).find(p=>cands.includes(p));
  const out = twin ? [twin].concat(shuf(cands.filter(x=>x!==twin)).slice(0,n-1)) : shuf(cands).slice(0,n);
  return shuf(out); }
function startMission(m){ clearFlow(); combo=0; CUR=m; $("hudTitle").textContent=m.lbl.toUpperCase();
  if(m.type==="learn")startLearn(m);
  else if(m.type==="patrol")startPatrol(m.set);
  else if(m.type==="read")startRead(m);
  else if(m.type==="spell")startSpell(m);
  else if(m.type==="sentence")startSentence(m);
  else if(m.type==="cloze")startCloze(m);
  else if(m.type==="scramble")startScramble(m);
  else if(m.type==="fortress")startFortress(m);
  else if(m.type==="magic")startMagic(m);
  else startForge(m); }
function missionComplete(){
  /* MASTERY GATE: a milestone only counts once its core items are truly mastered.
     If not, run a supportive targeted review (no failure) and re-check. */
  if((CUR.finale||CUR.rescue) && !S.done[CUR.id]){
    const weak=coreWeak(CUR);
    if(weak.length){ masteryReview(weak); return; }
  }
  const firstTime=!S.done[CUR.id];
  S.done[CUR.id]=true;
  ensureDaily();
  if(firstTime){ S.daily.missions=(S.daily.missions||0)+1;   /* count NEW missions today, not replays (QA P0) */
    S.stars+=3; S.session.count++;
    const gear=GEAR_AT[CUR.id];
    if(gear&&!S.gear.includes(gear))S.gear.push(gear);
    /* auto-equip a newly-forged weapon so it shows immediately (kid needn't visit the Base) */
    if(gear==="Gem Sword")S.equip.weapon="sword"; else if(gear==="Word Hammer")S.equip.weapon="hammer"; }
  save();
  if(firstTime && (CUR.finale||CUR.rescue||CUR.type==="fortress")) snapshot(CUR.lbl||("Mission "+CUR.id));  /* safety roll-back point */
  showWin(firstTime);
}
/* Gentle, mastery-locking review: a focused adaptive patrol of the weak items,
   then back to the milestone check. Loops (a few short rounds) until mastered. */
function masteryReview(weak){ $("hudTitle").textContent="POWER-UP PATROL";
  flow(Aud.play("mastery_review"),
    ()=> startFind(weak[0], Math.max(6, weak.length*3), weak.slice(), ()=>missionComplete()) );
}

/* ---------------- LEARN ---------------- */
let learnLetter=null;
function startLearn(m){ learnLetter=m.letter; const L=LETTERS[learnLetter];
  show("scrLetter");
  $("bigGlyph").textContent=learnLetter+" "+learnLetter.toUpperCase();
  $("kwIcon").textContent=L.icon;
  $("btnLetterGo").textContent=(learnLetter.length>1)?"FIND IT! ➜":"TRACE IT! ➜";   /* digraphs/teams skip the trace */
  /* confusable twins already taught? show a side-by-side contrast cue */
  const cue=$("letterCue"); if(cue){
    const twin=(CONFUSE[learnLetter]||[]).find(t=>S.done[LETTER_MISSION[t]]);
    if(twin){ cue.innerHTML=`<span class="cueok read">${learnLetter}</span><span class="cuevs">not</span><span class="cuex read">${twin}</span>`; cue.style.display="flex"; }
    else cue.style.display="none";
  }
  const ids=["intro_"+learnLetter,"snd_"+learnLetter,"like_"+learnLetter];
  if(LINES["cue_"+learnLetter] && (CONFUSE[learnLetter]||[]).some(t=>S.done[LETTER_MISSION[t]])) ids.push("cue_"+learnLetter);
  narrate("letter",$("letterText"),ids); }
/* digraphs skip handwriting trace (the child already writes s + h) — straight to sound work */
$("btnLetterGo").onclick=()=>{ (learnLetter.length>1) ? startFind(learnLetter) : startTrace(learnLetter); };   /* digraphs + vowel teams skip the handwriting trace */

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
  $("findProg").textContent=findRep+" / "+findGoal;
  narrate("find",$("findText"),["find_prompt","snd_"+g],"Find the gem that makes the sound\u2026");
  /* patrol foils come only from letters already taught; learn-mission foils from the zone */
  const foilPool=patrolSet||taughtGraphemes();   /* only already-taught graphemes (incl. digraphs) as distractors */
  const foils=pickFoils(g, foilPool, 3);       /* biases toward the confusable twin (b/d…) */
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
function bossSprite(w){ return currentAct()===2 ? dragonSVG(w) : inkblotSVG(w); }
function startBoss(g){ show("scrBoss"); bossHP=3;
  $("bossArt").innerHTML=`<div class="boss" id="bossSprite">${bossSprite(240)}</div>`;
  paintPips("bossPips",bossHP,3);
  narrate("boss",$("bossText"),["boss_taunt","boss_intro","snd_"+g],"Blast the Vexbot! Tap the gem that makes the sound\u2026");
  bossRound(g); }
function paintPips(id,hp,max){ const p=$(id); p.innerHTML="";
  for(let i=0;i<max;i++){const d=document.createElement("div");d.className="pip"+(i<hp?"":" off");p.appendChild(d);} }
function bossRound(g){
  const foils=pickFoils(g, taughtGraphemes(), 2);   /* boss: include the confusable twin */
  const opts=[g,...foils].sort(()=>Math.random()-.5);
  const row=$("bossTiles"); row.innerHTML="";
  opts.forEach(o=>{ const t=document.createElement("button"); t.className="tile read"; t.textContent=o;
    t.onclick=()=>{ if(o===g){ record(g,true); bossHP--; paintPips("bossPips",bossHP,3);
        const bs=$("bossSprite"); bs.classList.add("hitfx"); setTimeout(()=>bs.classList.remove("hitfx"),380);
        burstAt(bs,"ZAP!"); Aud.ding();
        if(bossHP<=0){ bs.classList.add("flee");
          flow(Aud.play(["flee","boss_flee","youdidit"]),missionComplete); }
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
function readPool(){ return currentAct()===2 ? READWORDS2 : READWORDS; }   /* Act-2 decode uses digraph words */
function readSoundOut(w){ return Aud.play([...graphemeSounds(w),"word_"+w]); }
function nextRead(){
  if(readIx>=readWords.length){
    const champ = CUR.id===30;
    flow(Aud.play(champ?["rally_champ"]:["read_yes"]), missionComplete); return; }
  const w=readWords[readIx]; readMiss=0; const POOL=readPool();
  $("readProg").textContent=readIx+" / "+readGoal;
  narrate("read",$("readText"),["read_prompt"],"Read the word… then tap what it means!");
  /* the word, as tappable grapheme tiles (a digraph is ONE tile = one sound;
     in a magic-e word the silent E is dimmed and the vowel marked "long") */
  const wr=$("readWord"); wr.innerHTML=""; const me=magicE(w), snds=graphemeSounds(w);
  toGraphemes(w).forEach((c,j)=>{ const t=document.createElement("button"); t.className="tile read rletter"; t.textContent=c;
    if(me&&j===me.e)t.classList.add("silente"); if(me&&j===me.v)t.classList.add("longv");
    const s=snds[j]; t.onclick=()=>Aud.play(s); wr.appendChild(t); });
  /* three picture choices: the word + two other picture-words */
  const foils=Object.keys(POOL).filter(x=>x!==w).sort(()=>Math.random()-.5).slice(0,2);
  const opts=[w,...foils].sort(()=>Math.random()-.5);
  const cr=$("readChoices"); cr.innerHTML="";
  opts.forEach(o=>{ const b=document.createElement("button"); b.className="tile picktile"; b.textContent=POOL[o]; b.dataset.w=o;
    b.onclick=()=>{ if(o===w){ record("w_"+w,true); b.classList.add("win"); burstAt(b); Aud.ding();
        if(magicE(w))record(magicE(w).unit,true);   /* credit the long-vowel rule */
        readIx++; flow(Aud.play(["read_yes",...graphemeSounds(w),"word_"+w]),()=>setTimeout(nextRead,200)); }
      else { record("w_"+w,false); readMiss++; b.classList.add("dim");
        if(readMiss>=2){ cr.querySelectorAll(".picktile").forEach(x=>{ if(x.dataset.w===w)x.classList.add("hint"); }); }
        readSoundOut(w); } };
    cr.appendChild(b); }); }
$("btnReadSound").onclick=()=>{ const w=readWords&&readWords[readIx]; if(w)readSoundOut(w); };

/* ---------------- INSTANT SPELLS (sight words) ----------------
   Heart-word method: introduce a word (flag the tricky "heart" letters), then
   recognise it on sight — hear the word, tap the matching written word. Builds
   the orthographic word-form that sentence reading depends on. */
function taughtSight(){ const out=[]; MISSIONS.forEach(m=>{ if(m.type==="spell"&&S.done[m.id])(m.new||[]).forEach(w=>out.push(w)); }); return out; }
function spellWordHTML(w){ return w.split("").map((c,i)=>
  ((SIGHT[w]&&SIGHT[w].h)||[]).includes(i) ? `<span class="heartl">${c}</span>` : c).join(""); }
/* SIGHT WORDS = sound-mapping (Heart Word Method), NOT whole-word recognition.
   The child BUILDS the word from grapheme tiles in order while hearing it: the
   regular letters are sounded out, the irregular "heart" letter is flagged and
   explicitly remembered. No "tap the matching word shape" mechanic anywhere. */
let spellNew,spellPool,spellIx,spellGoal,spellMiss,spellMission,spellSlot;
function isHeart(w,i){ return ((SIGHT[w]&&SIGHT[w].h)||[]).includes(i); }
function startSpell(m){ show("scrSpell"); spellMission=m; spellNew=(m.new||[]).slice();
  spellPool=[...new Set([...taughtSight(), ...spellNew])];
  $("spellChoices").innerHTML=""; $("spellProg").textContent="";
  flow(narrate("spell",$("spellText"),["spell_intro"]),()=>introSpell(0)); }
function introSpell(i){
  if(i>=spellNew.length){ $("spellWord").innerHTML=""; spellIx=0;
    spellGoal=Math.max(5,spellPool.length+2); practiceSpell(); return; }
  const w=spellNew[i]; $("spellChoices").innerHTML="";
  /* teach the mapping: show the word with the heart letter(s) flushed, sound out
     the regular letters, name the heart part as "tricky — we remember it" */
  $("spellWord").innerHTML=`<div class="spellbig read">${spellWordHTML(w)}</div>`;
  const seq=["spell_new","sw_"+w]; w.split("").forEach((c,j)=>seq.push(isHeart(w,j)?"spell_heart":"snd_"+c));
  flow(narrate("spell",$("spellText"),seq,"Most of it sounds out — the ♥ part we just remember."),
    ()=>setTimeout(()=>introSpell(i+1),650)); }
function practiceSpell(){
  if(spellIx>=spellGoal){ const champ=spellMission.id===33;
    flow(Aud.play(champ?["spell_done"]:["spell_yes"]),missionComplete); return; }
  const w=spellPool[Math.floor(Math.random()*spellPool.length)]; spellMiss=0; spellSlot=0;
  $("spellProg").textContent=spellIx+" / "+spellGoal;
  narrate("spell",$("spellText"),["spell_build","sw_"+w],"Build the word you hear — sound by sound!");
  const sw=$("spellWord"); sw.innerHTML="";
  w.split("").forEach((c,j)=>{ const s=document.createElement("div"); s.className="slot read"+(isHeart(w,j)?" heartslot":""); sw.appendChild(s); });
  const need=w.split("");
  const foils=shuf(taughtLetters().filter(x=>!need.includes(x))).slice(0,2);
  const choices=shuf([...new Set(need)].concat(foils));
  const cr=$("spellChoices"); cr.innerHTML="";
  choices.forEach(c=>{ const b=document.createElement("button"); b.className="tile read"; b.textContent=c; b.dataset.g=c;
    b.style.width=b.style.height="clamp(72px,12vw,108px)"; b.style.fontSize="clamp(40px,6.5vw,60px)";
    b.onclick=()=>{ const want=w[spellSlot];
      if(c===want){ const slot=sw.children[spellSlot]; slot.textContent=c; slot.classList.add("filled");
        const heart=isHeart(w,spellSlot); Aud.ding(); spellSlot++;
        if(spellSlot>=w.length){ record("sw_"+w,true); spellIx++; burstAt(b);
          flow(Aud.play(["spell_yes","sw_"+w]),()=>setTimeout(practiceSpell,220)); }
        else Aud.play(heart?["spell_heart"]:["snd_"+c]); }
      else { record("sw_"+w,false); spellMiss++; b.classList.add("dim");
        if(spellMiss>=2)cr.querySelectorAll(".tile").forEach(x=>{ if(x.dataset.g===want)x.classList.add("hint"); });
        Aud.play(["almost","sw_"+w]); setTimeout(()=>b.classList.remove("dim"),900); } };
    cr.appendChild(b); }); }

/* ---------------- STORY GATE (decodable sentences) ----------------
   The reading goal: read a whole sentence, then tap the picture it tells about
   (foil differs by a key word, so guessing fails). Each word is tappable to
   hear it; a Read-it-all button plays the whole sentence as scaffold. */
function wordAudio(w){ return LINES["word_"+w]?["word_"+w]
  : (LINES["sw_"+w]?["sw_"+w] : [...graphemeSounds(w)].concat(LINES["word_"+w]?["word_"+w]:[])); }
function sentenceAudio(s){ return s.t.flatMap(w=>wordAudio(w)); }
let sentList,sentIx,sentGoal,sentMiss,sentCur,sentMission;
function startSentence(m){ show("scrSent"); sentMission=m; sentList=m.sents.slice(); sentIx=0; sentGoal=sentList.length;
  $("sentChoices").innerHTML=""; $("sentWords").innerHTML="";
  flow(narrate("sent",$("sentText"),["sent_intro"]),()=>nextSentence()); }
function nextSentence(){
  if(sentIx>=sentGoal){ const champ=sentMission && sentMission.id===36;
    flow(Aud.play(champ?["sent_champ"]:["sent_yes"]),missionComplete); return; }
  const s=SENTENCES[sentList[sentIx]]; sentCur=s; sentMiss=0;
  $("sentProg").textContent=sentIx+" / "+sentGoal;
  narrate("sent",$("sentText"),["sent_prompt"],"Read the sentence… then tap the picture!");
  const wr=$("sentWords"); wr.innerHTML="";
  s.t.forEach(w=>{ const t=document.createElement("button");
    t.className="tile wordtile read"+(SIGHT[w]?" heartword":"");
    t.innerHTML=SIGHT[w]?spellWordHTML(w):w; t.onclick=()=>Aud.play(wordAudio(w)); wr.appendChild(t); });
  const opts=[{e:s.pic,ok:true},{e:s.foil,ok:false}].sort(()=>Math.random()-.5);
  const cr=$("sentChoices"); cr.innerHTML="";
  opts.forEach(o=>{ const b=document.createElement("button"); b.className="tile picktile"; b.textContent=o.e;
    b.onclick=()=>{ if(o.ok){ record("sent_"+sentIx,true); b.classList.add("win"); burstAt(b); Aud.ding(); sentIx++;
        flow(Aud.play([...sentenceAudio(s),"sent_yes"]),()=>setTimeout(nextSentence,200)); }
      else { record("sent_"+sentIx,false); sentMiss++; b.classList.add("dim");
        if(sentMiss>=2)cr.querySelectorAll(".picktile").forEach(x=>{ if(x.textContent===s.pic)x.classList.add("hint"); });
        Aud.play(sentenceAudio(s)); } };
    cr.appendChild(b); }); }

/* ---------------- READING DOJO · CLOZE (fill the word that fits) ----------------
   Read the sentence (picture-anchored), pick the word for the blank. Research-
   backed Maze format; reading for meaning + decoding the choices. */
let clozeList,clozeIx,clozeGoal,clozeMiss;
function startCloze(m){ show("scrCloze"); clozeList=m.items.slice(); clozeIx=0; clozeGoal=clozeList.length;
  $("clozeChoices").innerHTML=""; flow(narrate("cloze",$("clozeText"),["cloze_intro"]),()=>nextCloze()); }
function nextCloze(){ if(clozeIx>=clozeGoal){ flow(Aud.play(["dojo_yes"]),missionComplete); return; }
  const c=CLOZE[clozeList[clozeIx]]; clozeMiss=0;
  $("clozeProg").textContent=clozeIx+" / "+clozeGoal; $("clozePic").textContent=c.pic;
  narrate("cloze",$("clozeText"),["cloze_prompt"],"Read it… tap the word that fits the blank!");
  const sw=$("clozeSent"); sw.innerHTML="";
  c.t.forEach(w=>{ if(w==="_"){ const s=document.createElement("div"); s.className="wordslot read"; s.id="clozeBlank"; s.textContent="?"; sw.appendChild(s); }
    else { const t=document.createElement("button"); t.className="tile wordtile read"+(SIGHT[w]?" heartword":""); t.innerHTML=SIGHT[w]?spellWordHTML(w):w; t.onclick=()=>Aud.play(wordAudio(w)); sw.appendChild(t); } });
  const done=c.t.map(w=>w==="_"?c.ans:w);
  const cr=$("clozeChoices"); cr.innerHTML="";
  [c.ans,...c.foils].sort(()=>Math.random()-.5).forEach(o=>{ const b=document.createElement("button"); b.className="tile wordtile read"; b.dataset.w=o; b.innerHTML=o;
    b.onclick=()=>{ if(o===c.ans){ record("cz",true); const bl=$("clozeBlank"); if(bl){bl.textContent=o;bl.classList.add("filled");} b.classList.add("win"); burstAt(b); Aud.ding(); clozeIx++;
        flow(Aud.play([...done.flatMap(wordAudio),"dojo_yes"]),()=>setTimeout(nextCloze,250)); }
      else { record("cz",false); clozeMiss++; b.classList.add("dim");
        if(clozeMiss>=2)cr.querySelectorAll(".wordtile").forEach(x=>{if(x.dataset.w===c.ans)x.classList.add("hint");}); Aud.play(["almost",...done.flatMap(wordAudio)]); } };
    cr.appendChild(b); }); }

/* ---------------- READING DOJO · SCRAMBLE (build the sentence) ----------------
   Hear the sentence, then tap the scrambled words into order — syntax/word-order
   awareness on decodable words (the reading version of mad-libs). */
let scramList,scramIx,scramGoal,scramCur,scramPos,scramMiss;
function scramAudio(s){ return s.words.flatMap(wordAudio); }
function startScramble(m){ show("scrScramble"); scramList=m.items.slice(); scramIx=0; scramGoal=scramList.length;
  $("scramTiles").innerHTML=""; $("scramSlots").innerHTML=""; flow(narrate("scram",$("scramText"),["scram_intro"]),()=>nextScramble()); }
function nextScramble(){ if(scramIx>=scramGoal){ flow(Aud.play(["dojo_yes"]),missionComplete); return; }
  const s=SCRAMBLE[scramList[scramIx]]; scramCur=s; scramPos=0; scramMiss=0;
  $("scramProg").textContent=scramIx+" / "+scramGoal; $("scramPic").textContent=s.pic;
  narrate("scram",$("scramText"),["scram_prompt",...scramAudio(s)],"Build the sentence! Tap the words in order.");
  const sl=$("scramSlots"); sl.innerHTML="";
  s.words.forEach(()=>{ const d=document.createElement("div"); d.className="wordslot read"; sl.appendChild(d); });
  const tr=$("scramTiles"); tr.innerHTML="";
  s.words.map((w,i)=>i).sort(()=>Math.random()-.5).forEach(i=>{ const w=s.words[i];
    const t=document.createElement("button"); t.className="tile wordtile read"+(SIGHT[w]?" heartword":""); t.innerHTML=SIGHT[w]?spellWordHTML(w):w;
    t.onclick=()=>{ if(t.disabled)return; const need=s.words[scramPos];
      if(w===need){ const slot=sl.children[scramPos]; slot.innerHTML=t.innerHTML; slot.classList.add("filled"); t.classList.add("dim"); t.disabled=true; Aud.ding(); scramPos++;
        if(scramPos>=s.words.length){ scramIx++; flow(Aud.play([...scramAudio(s),"dojo_yes"]),()=>setTimeout(nextScramble,300)); }
        else Aud.play(wordAudio(w)); }
      else { scramMiss++; t.classList.add("dim"); setTimeout(()=>{if(!t.disabled)t.classList.remove("dim");},700); Aud.play(["almost",...scramAudio(s)]); } };
    tr.appendChild(t); }); }
$("btnScramHear").onclick=()=>{ if(scramCur)Aud.play(scramAudio(scramCur)); };

/* ---------------- VEX'S FORTRESS (Act-1 finale boss) ----------------
   A long, chaotic, COMPREHENSIVE fight: 4 phases that make Teddy prove letter
   sounds (shield), decoding (word-locks), sight words (spells) and SENTENCE
   READING (free Leighton). Reuses every mechanic; juicy HP bar + Vex taunts. */
const FORTRESS=[
  {kind:"sound",   n:6, banner:"BREAK THE GEM SHIELD!",  prompt:"fort_p1", taunt:"fort_t1"},
  {kind:"read",    n:5, banner:"SMASH THE WORD-LOCKS!",  prompt:"fort_p2", taunt:"fort_t2"},
  {kind:"spell",   n:4, banner:"CAST YOUR SPELLS!",      prompt:"fort_p3", taunt:"fort_t3"},
  {kind:"sentence",n:4, banner:"READ TO FREE LEIGHTON!", prompt:"fort_p4", taunt:"fort_t4"}
];
/* ACT-2 finale phases — same proven mechanics, medieval content: sound (incl. digraphs)
   → read (decode digraph/blend/magic-e words) → spell (sight) → read (free Miss Kendall).
   The pools become act-aware in fortSound/fortRead below, so no Act-1 behaviour changes. */
const FORTRESS2=[
  {kind:"sound",n:5, banner:"BREAK THE DRAGON WARD!",     prompt:"f2_p1", taunt:"f2_t1"},
  {kind:"read", n:5, banner:"SHATTER THE RUNE-LOCKS!",    prompt:"f2_p2", taunt:"f2_t2"},
  {kind:"spell",n:3, banner:"CAST YOUR SPELLS!",          prompt:"f2_p3", taunt:"f2_t3"},
  {kind:"read", n:4, banner:"READ TO FREE MISS KENDALL!", prompt:"f2_p4", taunt:"f2_t4"}
];
let FCONF=FORTRESS;
let fPhase,fRound,fHP,fHPmax,fMiss;
function fortHPset(){ const el=$("fortHPfill"); if(el)el.style.width=Math.max(0,100*fHP/fHPmax)+"%"; }
function startFortress(m){ show("scrFortress");
  const a2=currentAct()===2; FCONF=a2?FORTRESS2:FORTRESS;
  fHPmax=FCONF.reduce((s,p)=>s+p.n,0); fHP=fHPmax;
  $("fortVex").innerHTML=`<div class="boss" id="fortVexSprite">${a2?dragonSVG(220):inkblotSVG(220)}</div>`;
  $("fortBanner").textContent=a2?"DRAGON KEEP":"VEX'S FORTRESS"; fortHPset();
  $("fortWord").innerHTML=""; $("fortChoices").innerHTML="";
  flow(narrate("fort",$("fortText"),[a2?"vixen_taunt":"vex_taunt", a2?"f2_intro":"fort_intro"]),()=>fortPhase(0)); }
function fortPhase(i){ if(i>=FCONF.length){ fortWin(); return; }
  fPhase=i; fRound=0; const ph=FCONF[i];
  $("fortBanner").textContent=ph.banner; $("fortWord").innerHTML=""; $("fortChoices").innerHTML="";
  flow(Aud.play([ph.taunt,ph.prompt]),()=>fortRound()); }
function fortHit(label){ fHP--; fortHPset();
  const bs=$("fortVexSprite"); if(bs){ bs.classList.add("hitfx"); setTimeout(()=>bs.classList.remove("hitfx"),360); burstAt(bs,label||"ZAP!"); }
  Aud.ding(); if(allyFreed("tank")&&Math.random()<0.4)allyPop("tank");
  fRound++; flow(Aud.play(["fort_hit"]),()=>fortRound()); }
function fortRound(){ const ph=FCONF[fPhase];
  if(fRound>=ph.n){ fortPhase(fPhase+1); return; }
  fMiss=0;
  ({sound:fortSound,read:fortRead,spell:fortSpell,sentence:fortSentence})[ph.kind](); }
function fortMissHint(){ fMiss++; }
function fortSound(){ const pool=currentAct()===2?taughtGraphemes():taughtLetters(); const g=pickWeak(pool)||pool[0];
  narrate("fort",$("fortText"),["snd_"+g],"Blast the shield! Tap the gem that makes the sound…");
  $("fortWord").innerHTML="";
  const foils=pickFoils(g, pool, 3);   /* fortress shield: include the confusable twin */
  const row=$("fortChoices"); row.innerHTML="";
  [g,...foils].sort(()=>Math.random()-.5).forEach(o=>{ const t=document.createElement("button"); t.className="tile read"; t.dataset.g=o;
    t.textContent=(fRound%3===2)?o.toUpperCase():o;
    t.onclick=()=>{ if(o===g){ record(g,true); t.classList.add("win"); fortHit("ZAP!"); }
      else { record(g,false); fortMissHint(); t.classList.add("dim");
        if(fMiss>=2)row.querySelectorAll(".tile").forEach(x=>{if(x.dataset.g===g)x.classList.add("hint");}); Aud.play(["snd_"+g]); } };
    row.appendChild(t); }); }
function fortRead(){ const RW=readPool(); const ws=Object.keys(RW); const w=ws[Math.floor(Math.random()*ws.length)];
  narrate("fort",$("fortText"),["read_prompt"],"Read the word-lock… tap what it means!");
  const wr=$("fortWord"); wr.innerHTML="";
  toGraphemes(w).forEach(c=>{ const t=document.createElement("button"); t.className="tile read rletter"; t.textContent=c; t.onclick=()=>Aud.play("snd_"+c); wr.appendChild(t); });
  const foils=ws.filter(x=>x!==w).sort(()=>Math.random()-.5).slice(0,2);
  const row=$("fortChoices"); row.innerHTML="";
  [w,...foils].sort(()=>Math.random()-.5).forEach(o=>{ const b=document.createElement("button"); b.className="tile picktile"; b.textContent=RW[o]; b.dataset.w=o;
    b.onclick=()=>{ if(o===w){ record("w_"+w,true); b.classList.add("win"); fortHit(w.toUpperCase()+"!"); }
      else { record("w_"+w,false); fortMissHint(); b.classList.add("dim");
        if(fMiss>=2)row.querySelectorAll(".picktile").forEach(x=>{if(x.dataset.w===w)x.classList.add("hint");}); readSoundOut(w); } };
    row.appendChild(b); }); }
/* fortress sight-word phase = BUILD it from sounds too (sound-mapping, never
   shape-recognition) — consistent with the Spell Tower teaching. */
let fortSpellSlot=0;
function fortSpell(){ const pool=taughtSight().length?taughtSight():["the","a","I"]; const w=pool[Math.floor(Math.random()*pool.length)];
  fortSpellSlot=0;
  narrate("fort",$("fortText"),["spell_build","sw_"+w],"Build the spell you hear — sound by sound!");
  const wr=$("fortWord"); wr.innerHTML="";
  w.split("").forEach((c,j)=>{ const s=document.createElement("div"); s.className="slot read"+(isHeart(w,j)?" heartslot":""); wr.appendChild(s); });
  const need=w.split("");
  const foils=shuf(taughtLetters().filter(x=>!need.includes(x))).slice(0,2);
  const choices=shuf([...new Set(need)].concat(foils));
  const row=$("fortChoices"); row.innerHTML="";
  choices.forEach(c=>{ const b=document.createElement("button"); b.className="tile read"; b.textContent=c; b.dataset.g=c;
    b.onclick=()=>{ const want=w[fortSpellSlot];
      if(c===want){ const slot=wr.children[fortSpellSlot]; slot.textContent=c; slot.classList.add("filled");
        const heart=isHeart(w,fortSpellSlot); Aud.ding(); fortSpellSlot++;
        if(fortSpellSlot>=w.length){ record("sw_"+w,true); fortHit("✨"); }
        else Aud.play(heart?["spell_heart"]:["snd_"+c]); }
      else { record("sw_"+w,false); fortMissHint(); b.classList.add("dim");
        if(fMiss>=2)row.querySelectorAll(".tile").forEach(x=>{if(x.dataset.g===want)x.classList.add("hint");}); Aud.play(["almost","sw_"+w]);
        setTimeout(()=>b.classList.remove("dim"),900); } };
    row.appendChild(b); }); }
/* finale reading proof = MIXED: the first round is picture-match (variety), the
   rest are Maze/Cloze (read the sentence, pick the word that fits) — the
   research-validated comprehension check, so the win = real reading. */
function fortSentence(){ if(fRound===0) fortSentencePic(); else fortMaze(); }
function fortMaze(){ const c=FORTMAZE[Math.floor(Math.random()*FORTMAZE.length)];
  narrate("fort",$("fortText"),["sent_prompt"],"Read it to free Leighton… tap the word that fits the blank!");
  const wr=$("fortWord"); wr.innerHTML="";
  c.t.forEach(w=>{ if(w==="_"){ const s=document.createElement("div"); s.className="wordslot read"; s.id="fortBlank"; s.textContent="?"; wr.appendChild(s); }
    else { const t=document.createElement("button"); t.className="tile wordtile read"+(SIGHT[w]?" heartword":""); t.innerHTML=SIGHT[w]?spellWordHTML(w):w; t.onclick=()=>Aud.play(wordAudio(w)); wr.appendChild(t); } });
  const done=c.t.map(w=>w==="_"?c.ans:w);
  const row=$("fortChoices"); row.innerHTML="";
  [c.ans,...c.foils].sort(()=>Math.random()-.5).forEach(o=>{ const b=document.createElement("button"); b.className="tile wordtile read"; b.dataset.w=o; b.innerHTML=o;
    b.onclick=()=>{ if(o===c.ans){ record("sent_fort",true); const bl=$("fortBlank"); if(bl){bl.textContent=o;bl.classList.add("filled");} b.classList.add("win");
        flow(Aud.play([...done.flatMap(wordAudio)]),()=>fortHit("READ!")); }
      else { record("sent_fort",false); fortMissHint(); b.classList.add("dim");
        if(fMiss>=2)row.querySelectorAll(".wordtile").forEach(x=>{if(x.dataset.w===c.ans)x.classList.add("hint");}); Aud.play(["almost",...done.flatMap(wordAudio)]); } };
    row.appendChild(b); }); }
function fortSentencePic(){ const s=SENTENCES[Math.floor(Math.random()*SENTENCES.length)];
  narrate("fort",$("fortText"),["sent_prompt"],"Read it to free Leighton… tap the picture!");
  const wr=$("fortWord"); wr.innerHTML="";
  s.t.forEach(w=>{ const t=document.createElement("button"); t.className="tile wordtile read"+(SIGHT[w]?" heartword":""); t.innerHTML=SIGHT[w]?spellWordHTML(w):w; t.onclick=()=>Aud.play(wordAudio(w)); wr.appendChild(t); });
  const row=$("fortChoices"); row.innerHTML="";
  [{e:s.pic,ok:1},{e:s.foil,ok:0}].sort(()=>Math.random()-.5).forEach(o=>{ const b=document.createElement("button"); b.className="tile picktile"; b.textContent=o.e;
    b.onclick=()=>{ if(o.ok){ record("sent_fort",true); b.classList.add("win"); fortHit("READ!"); }
      else { record("sent_fort",false); fortMissHint(); b.classList.add("dim");
        if(fMiss>=2)row.querySelectorAll(".picktile").forEach(x=>{if(x.textContent===s.pic)x.classList.add("hint");}); Aud.play(sentenceAudio(s)); } };
    row.appendChild(b); }); }
function fortWin(){ const bs=$("fortVexSprite"); if(bs)bs.classList.add("flee");
  $("fortBanner").textContent="VICTORY!";
  flow(Aud.play([currentAct()===2?"f2_win":"fort_win1", currentAct()===2?"vixen_defeat":"vex_defeat"]),missionComplete); }

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
  $("forgeBoss").innerHTML=`<div class="boss" id="forgeSprite" style="width:clamp(130px,22vw,200px)">${bossSprite(200)}</div>`;
  paintPips("forgePips",forgeHP,forgeWords.length);
  const intro = m.id===111 ? ["blend_intro"] : ["forge_intro1","forge_intro2"];   /* first Blends mission gets Noah's blend explainer */
  flow(narrate("forge",$("forgeText"),intro),()=>forgeWord()); }
function forgeWord(){
  if(forgeWordIx>=forgeWords.length){
    const fs=$("forgeSprite"); if(fs)fs.classList.add("flee");
    flow(Aud.play(["forge_win1","forge_win2"]),missionComplete); return; }
  const w=forgeWords[forgeWordIx]; forgeSlotIx=0;
  const gs=toGraphemes(w);   /* tokenise so digraphs (sh) are ONE build slot, one gem */
  const me=magicE(w), snds=graphemeSounds(w);
  narrate("forge",$("forgeText"),["forge_build",...snds,"word_"+w],"Build the word! Listen\u2026");
  const slots=$("forgeSlots"); slots.innerHTML="";
  gs.forEach((g,j)=>{ const s=document.createElement("div"); s.className="slot read"; if(me&&j===me.e)s.classList.add("silente"); if(me&&j===me.v)s.classList.add("longv"); slots.appendChild(s); });
  const pool=taughtGraphemes().filter(x=>!gs.includes(x));   /* distractor: taught graphemes only */
  const foil=pool[Math.floor(Math.random()*pool.length)];
  const choices=[...new Set(gs)].concat(foil?[foil]:[]).sort(()=>Math.random()-.5);
  const row=$("forgeChoices"); row.innerHTML="";
  choices.forEach(c=>{ const t=document.createElement("button"); t.className="tile read"; t.textContent=c;
    t.style.width=t.style.height="clamp(80px,13vw,120px)"; t.style.fontSize="clamp(44px,7vw,66px)";
    t.onclick=()=>{ const need=gs[forgeSlotIx];
      if(c===need){ record(c,true);
        const slot=slots.children[forgeSlotIx]; slot.textContent=c; slot.classList.add("filled");
        Aud.ding(); forgeSlotIx++;
        if(forgeSlotIx>=gs.length){
          if(me)record(me.unit,true);   /* credit the long-vowel rule */
          forgeHP--; paintPips("forgePips",forgeHP,forgeWords.length);
          const fs=$("forgeSprite"); fs.classList.add("hitfx"); setTimeout(()=>fs.classList.remove("hitfx"),380);
          burstAt(fs,w.toUpperCase()+"!");
          flow(Aud.play([...snds,"word_"+w,"blast"]),()=>{forgeWordIx++;setTimeout(forgeWord,350);});
        } else Aud.play([snds[forgeSlotIx-1],"forge_next"]); }
      else { record(need,false); t.classList.add("dim");
        Aud.play(["forge_listen","snd_"+need]);
        setTimeout(()=>t.classList.remove("dim"),2400); } };
    row.appendChild(t); }); }

/* ---------------- MAGIC-E SPELL (long vowels, type:"magic") ----------------
   Noah's signature teach: show a short word (cap), then CAST the silent E — it
   flies in, the vowel flips short→long (cap→cape) with sound. A demo + a tap to
   cast for each pair; credits the long-vowel unit (a_e…). Practiced afterward in
   forge/read, which are magic-e aware (long vowel sound, silent-E dimmed). */
let magicPairs,magicIx,magicM;
function startMagic(m){ show("scrMagic"); magicM=m; magicPairs=m.pairs.slice(); magicIx=0;
  $("magicCast").style.display="none"; $("magicNext").style.display="none"; $("magicWord").innerHTML="";
  flow(narrate("magic",$("magicText"),["magic_intro","snd_"+m.vowel,"snd_"+m.vowel+"_long"]),()=>magicStep()); }
function magicStep(){
  if(magicIx>=magicPairs.length){ record(magicM.unit,true); flow(Aud.play(["magic_done"]),missionComplete); return; }
  const pair=magicPairs[magicIx], sh=pair[0], lo=pair[1], me=magicE(lo);
  $("magicProg").textContent=magicIx+" / "+magicPairs.length;
  const wr=$("magicWord"); wr.innerHTML="";
  toGraphemes(sh).forEach((c,j)=>{ const t=document.createElement("div"); t.className="tile read magtile"+(j===me.v?" vowelt":"");
    t.textContent=c; if(j===me.v)t.dataset.vowel="1"; wr.appendChild(t); });
  $("magicNext").style.display="none";
  $("magicCast").style.display="inline-block"; $("magicCast").textContent="CAST MAGIC-E";
  $("magicCast").onclick=()=>castMagicE(sh,lo);
  narrate("magic",$("magicText"),["magic_short",...graphemeSounds(sh),"word_"+sh],"This word says… then CAST the spell!");
}
function castMagicE(sh,lo){ const wr=$("magicWord");
  $("magicCast").style.display="none";
  const e=document.createElement("div"); e.className="tile read magtile silente flyin"; e.textContent="e"; wr.appendChild(e);
  const vt=wr.querySelector('[data-vowel="1"]'); if(vt){ vt.classList.remove("vowelt"); vt.classList.add("longv","flip"); }
  shakeStage(); flashScreen("rgba(187,119,255,.45)"); confetti(28);
  record(magicM.unit,true);
  flow(Aud.play(["magic_cast","snd_"+magicM.vowel+"_long","word_"+lo]),()=>{
    $("magicNext").style.display="inline-block";
    $("magicNext").textContent=(magicIx>=magicPairs.length-1)?"DONE ✓":"NEXT ➜";
    $("magicNext").onclick=()=>{ magicIx++; magicStep(); }; });
}

/* ---------------- UNLOCK CARD (reward reveal) ---------------- */
/* a glowing gold faceted reward gem (no letter) for gear/trophy unlocks */
function rewardGemArt(){ const u="rg"+Math.floor(Math.random()*1e6);
  return `<svg viewBox="-32 -34 64 70" width="132" aria-hidden="true">
  <defs><radialGradient id="${u}b" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffce3a" stop-opacity=".7"/><stop offset="1" stop-color="#ffce3a" stop-opacity="0"/></radialGradient>
  <radialGradient id="${u}f" cx=".4" cy=".28" r=".85"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="#ffd75e"/><stop offset="1" stop-color="#9c6a12"/></radialGradient></defs>
  <circle cx="0" cy="-1" r="31" fill="url(#${u}b)"/>
  <polygon points="0,-25 22,-10 22,12 0,27 -22,12 -22,-10" fill="url(#${u}f)" stroke="#150f2e" stroke-width="3.5" stroke-linejoin="round"/>
  <polygon points="0,-25 22,-10 0,4 -22,-10" fill="#fff" opacity=".3"/>
  <path d="M-12,-15 L-3,-19 L-6,-9 L-15,-7Z" fill="#fff" opacity=".9"/>
  <g stroke="#150f2e" stroke-width="1.2" opacity=".35" fill="none"><path d="M-22,-10 L0,4 L22,-10 M0,4 L0,27"/></g></svg>`; }
function showUnlock(artHTML, name, sub, done){
  const o=$("unlockCard"); if(!o){ if(done)done(); return; }
  $("ucArt").innerHTML=artHTML; $("ucName").textContent=name; $("ucSub").textContent=sub||"NEW!";
  o.classList.add("on");
  try{ flashScreen("rgba(255,210,90,.42)"); confetti(48); Aud.ding(); }catch(e){}
  const close=()=>{ o.classList.remove("on"); o.onclick=null; $("ucBtn").onclick=null; if(done)done(); };
  $("ucBtn").onclick=e=>{ if(e)e.stopPropagation(); close(); };
  o.onclick=close;
}

/* ---------------- WIN / REST ---------------- */
function showWin(firstTime){ show("scrWin");
  flashScreen("rgba(255,255,255,.5)"); confetti(CUR.finale||CUR.rescue||CUR.type==="fortress"?110:64);
  if(CUR.finale||CUR.rescue||CUR.type==="fortress")setTimeout(()=>confetti(90),520);  /* extra pop on big milestones */
  const ally=CUR.rescue?"heart":(CUR.type==="fortress"?(currentAct()===2?"kendall":"leighton"):null);
  $("winHero").innerHTML=heroNow(170)+
    (ally?`<svg viewBox="-32 -36 64 80" width="98" style="vertical-align:bottom;">${allyFace(ally)}<text y="42" text-anchor="middle" font-family="Bangers" font-size="12" fill="#ffc93c">${ally==="leighton"?"LEIGHTON":ally==="kendall"?"MISS KENDALL":"HEARTGUARD"}</text></svg>`:"");
  $("winHero").className="winpose"+(1+Math.floor(Math.random()*4));   /* random victory celebration */
  const gear=GEAR_AT[CUR.id];
  $("winGear").innerHTML=(firstTime&&gear)?`<div class="gearbadge">NEW GEAR: ${gear}</div>`:"";
  /* viral-style reward reveal card for a brand-new piece of gear */
  if(firstTime&&gear)setTimeout(()=>showUnlock(rewardGemArt(), gear.toUpperCase(), "NEW GEAR!"), 420);
  let ids;
  if(CUR.type==="fortress") ids=currentAct()===2?["kendall1","kendall2","kendall3"]:["leighton1","leighton2","leighton3"];
  else if(CUR.rescue) ids=["free_heart1","free_heart2","m2_done"];
  else if(CUR.finale) ids = currentAct()===2 ? ["act2_win"] : (CUR.z===4 ? ["m4_letters"] : (CUR.z===3 ? ["m3_done"] : ["finale1","finale2","finale3"]));
  else if(firstTime&&gear) ids=["win_grow","win_gear",GEARLINE[gear]];
  else ids=["win_grow"];
  const FREE={3:"free_tank",6:"free_flip",8:"free_sunny"};
  if(firstTime&&FREE[CUR.id])ids.unshift(FREE[CUR.id]);
  /* Heartguard, once rescued, is the league's cheerleader on every win */
  if(S.done[17]&&!CUR.rescue)ids.push("heart_cheer"+(1+(S.stars%3)));
  narrate("win",$("winText"),ids);
  const ix=MISSIONS.findIndex(x=>x.id===CUR.id);
  if(CUR.type==="fortress"){
    $("btnWinNext").style.display="none";
    if(currentAct()===2){   /* Act-2 finale = end of the medieval quest → back to the (now-complete) map */
      $("btnWinMap").textContent="MEDIEVAL REALM ➜";
      $("btnWinMap").onclick=()=>toMap();
    } else {                /* Act-1 finale → the Act-1→Act-2 handoff cutscene */
      $("btnWinMap").textContent="CONTINUE ➜";
      $("btnWinMap").onclick=()=>startInterlude();
    }
    return; }
  $("btnWinMap").textContent="CITY MAP";
  $("btnWinNext").style.display=(ix<MISSIONS.length-1)?"inline-block":"none";
  $("btnWinNext").onclick=()=>{ if(S.session.count>=3&&!S.session.rest){S.session.rest=true;save();showRest(MISSIONS[ix+1]);} else startMission(MISSIONS[ix+1]); };
  $("btnWinMap").onclick=()=>{ if(S.session.count>=3&&!S.session.rest){S.session.rest=true;save();showRest(null);} else toMap(); }; }
function showRest(nextM){ show("scrRest");
  $("restHero").innerHTML=heroNow(160);
  narrate("rest",$("restText"),["rest1","rest2"]);
  $("btnRestDone").onclick=()=>{Aud.stop();show("scrTitle");};
  $("btnRestMore").onclick=()=>{ nextM?startMission(nextM):toMap(); }; }

/* ---------------- HERO BASE ---------------- */
const LETTER_MISSION={s:0,a:1,t:3,p:5,i:6,n:7,m:9,d:10,g:12,o:14,c:15,k:16,e:18,u:19,r:21,h:23,b:24,f:25,
  l:37,j:38,v:40,w:41,x:43,y:44,z:45,q:46};
function showBase(){ clearFlow(); show("scrBase");
  $("hudTitle").textContent="HERO BASE";
  paintBase();
  Aud.play("base1");
}
function paintBase(){
  $("baseHero").innerHTML=heroNow(Math.min(260,window.innerWidth*0.34));
  const o=heroOpts();
  $("powerLbl").textContent=(currentAct()===2?["SQUIRE","SOLDIER","KNIGHT"]:["HERO","SUPER HERO","MEGA HERO"])[o.muscle];
  /* weapons */
  const wrow=$("weaponRow"); wrow.innerHTML="";
  const weapons=[["none","HANDS"]], actGear=actGearList(currentAct());
  if(actGear.includes("Word Hammer"))weapons.push(["hammer","WORD HAMMER 🔨"]);
  if(actGear.includes("Gem Sword"))weapons.push(["sword","GEM SWORD ⚔️"]);
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
    b.textContent=locked?(lbl+" · ⚡"+need):lbl;
    b.onclick=()=>{S.equip.cape=k;save();Aud.ding();paintBase();};
    crow.appendChild(b); });
  /* gem shelf: earned letters only */
  const shelf=$("gemShelf"); shelf.innerHTML="";
  let any=false;
  ORDER.forEach(g=>{ if(S.done[LETTER_MISSION[g]]){ any=true;
    shelf.innerHTML+=gemSVG(g, GEMCOLOR[g], 48); } });
  if(!any)shelf.innerHTML='<div class="baselbl" style="font-size:15px;">Rescue gems on missions to fill your shelf!</div>';
  /* league */
  const lg=$("leagueShelf"); lg.innerHTML="";
  let anyL=false;
  LEAGUE.forEach(t=>{ if(S.done[t.mid]){ anyL=true;
    lg.innerHTML+=`<svg viewBox="-32 -36 64 86" width="54"><g>${allyFace(t.kind)}</g><text y="42" text-anchor="middle" font-family="Bangers" font-size="13" fill="#ffc93c">${t.real}</text><text y="55" text-anchor="middle" font-family="Bangers" font-size="9.5" fill="#9b94c9" letter-spacing=".5">"${t.name}"</text></svg>`; } });
  if(!anyL)lg.innerHTML='<div class="baselbl" style="font-size:15px;">Smash Vex\u2019s cages to free your friends!</div>';
  /* coins + trophy shelf (Training Room collection) */
  const cn=$("baseCoins"); if(cn)cn.textContent=S.coins||0;
  const tro=$("trophyShelf");
  if(tro){ const owned=BASE_ITEMS.filter(it=>S.owned&&S.owned[it.id]);
    tro.innerHTML = owned.length
      ? owned.map(it=>`<span class="trophy" title="${it.nm}">${it.ic}</span>`).join("")
      : '<div class="baselbl" style="font-size:15px;">Train to earn coins, then shop for trophies!</div>'; }
}
$("btnBaseBack").onclick=()=>{Aud.stop();toMap();};

/* ---------------- TRAINING ROOM + HERO SHOP ----------------
   A supplementary DAILY practice loop, decoupled from story progression. It
   drills the highest-transfer skill — BUILD (segment/encode) + DECODE (blend/
   read) of decodable words, adaptive to his weakest letters — so practice
   actually strengthens mastery (this is also the rebalance toward blending/
   segmenting). Correct reps earn COINS, spent on a finite COSMETIC collection
   for the Hero Base. No gating, no countdown, no pay-to-win. */
const BASE_ITEMS=[
  {id:"banner",   nm:"Hero Banner", ic:"🚩", cost:10},
  {id:"plant",    nm:"Power Plant", ic:"🪴", cost:12},
  {id:"poster",   nm:"Hero Poster", ic:"🖼️", cost:15},
  {id:"trophy",   nm:"Gold Trophy", ic:"🏆", cost:20},
  {id:"medal",    nm:"Gold Medal",  ic:"🥇", cost:25},
  {id:"lamp",     nm:"Star Lamp",   ic:"⭐", cost:30},
  {id:"vexbot",   nm:"Vexbot Toy",  ic:"🤖", cost:40},
  {id:"dragon",   nm:"Dragon Toy",  ic:"🐉", cost:55},
  {id:"crown",    nm:"Crown Stand", ic:"👑", cost:70},
  {id:"rocket",   nm:"Mini Rocket", ic:"🚀", cost:90}
];
let trainReps=0,trainSlot=0,trainCur,trainMiss=0;
function trainPool(){ const t=taughtLetters(); return Object.keys(READWORDS).filter(w=>w.split("").every(c=>t.includes(c))); }
function pickTrainWord(){ const pool=trainPool(); if(!pool.length)return null;
  /* weight toward words built from his weakest letters (so practice targets need) */
  const wt=pool.map(w=>1+w.split("").reduce((s,c)=>s+(5-(mast(c).str||0)),0));
  let r=Math.random()*wt.reduce((a,b)=>a+b,0);
  for(let i=0;i<pool.length;i++){ r-=wt[i]; if(r<=0)return pool[i]; }
  return pool[0]; }
function showTrain(){ clearFlow(); trainReps=0; show("scrTrain"); updateTrainHUD();
  flow(narrate("train",$("trainText"),["train_intro"]),()=>trainRound()); }
function updateTrainHUD(){ $("trainCoins").textContent=S.coins||0; $("trainReps").textContent=trainReps; }
function trainRound(){ const w=pickTrainWord();
  if(!w){ flow(narrate("train",$("trainText"),["train_none"]),()=>{ __inTraining=false; showBase(); }); return; }
  (trainReps%2===0) ? trainBuild(w) : trainDecode(w); }
function trainBuild(w){ trainCur=w; trainSlot=0; trainMiss=0;
  narrate("train",$("trainText"),["train_build"].concat(wordAudio(w)),"Build the word you hear!");
  const wr=$("trainWord"); wr.innerHTML="";
  w.split("").forEach(()=>{ const s=document.createElement("div"); s.className="slot read"; wr.appendChild(s); });
  const need=w.split("");
  const choices=shuf([...new Set(need)].concat(shuf(taughtLetters().filter(x=>!need.includes(x))).slice(0,2)));
  const cr=$("trainChoices"); cr.innerHTML="";
  choices.forEach(c=>{ const b=document.createElement("button"); b.className="tile read"; b.textContent=c; b.dataset.g=c;
    b.style.width=b.style.height="clamp(72px,12vw,108px)"; b.style.fontSize="clamp(40px,6.5vw,60px)";
    b.onclick=()=>{ const want=w[trainSlot];
      if(c===want){ record(c,true); const slot=wr.children[trainSlot]; slot.textContent=c; slot.classList.add("filled"); Aud.ding(); trainSlot++;
        if(trainSlot>=w.length){ record("w_"+w,true); trainWin(b,w); } else Aud.play("snd_"+c); }
      else { record(c,false); trainMiss++; b.classList.add("dim");
        if(trainMiss>=2)cr.querySelectorAll(".tile").forEach(x=>{if(x.dataset.g===want)x.classList.add("hint");});
        Aud.play(["snd_"+want]); setTimeout(()=>b.classList.remove("dim"),900); } };
    cr.appendChild(b); }); }
function trainDecode(w){ trainCur=w; trainMiss=0;
  narrate("train",$("trainText"),["train_read"],"Read the word… tap what it means!");
  const wr=$("trainWord"); wr.innerHTML="";
  w.split("").forEach(c=>{ const t=document.createElement("button"); t.className="tile read rletter"; t.textContent=c; t.onclick=()=>Aud.play("snd_"+c); wr.appendChild(t); });
  const opts=shuf([w].concat(shuf(Object.keys(READWORDS).filter(x=>x!==w)).slice(0,2)));
  const cr=$("trainChoices"); cr.innerHTML="";
  opts.forEach(o=>{ const b=document.createElement("button"); b.className="tile picktile"; b.textContent=READWORDS[o]; b.dataset.w=o;
    b.onclick=()=>{ if(o===w){ record("w_"+w,true); b.classList.add("win"); trainWin(b,w); }
      else { record("w_"+w,false); trainMiss++; b.classList.add("dim");
        if(trainMiss>=2)cr.querySelectorAll(".picktile").forEach(x=>{if(x.dataset.w===w)x.classList.add("hint");}); readSoundOut(w); } };
    cr.appendChild(b); }); }
function trainWin(el,w){ const bonus=combo>=3?2:1; S.coins=(S.coins||0)+bonus; trainReps++; save();
  burstAt(el); coinFloat(el,bonus); updateTrainHUD();
  flow(Aud.play(["train_yes"].concat(wordAudio(w))),()=>setTimeout(trainRound,260)); }
function coinFloat(el,n){ const s=$("stage"); if(!s||!el)return; const r=el.getBoundingClientRect(),st=s.getBoundingClientRect();
  const c=document.createElement("div"); c.className="combochip"; c.style.color="#ffd75e";
  c.style.top=(r.top-st.top-20)+"px"; c.textContent="+"+n+" 💰"; s.appendChild(c); setTimeout(()=>c.remove(),900); }
$("btnTrain").onclick=()=>showTrain();
$("btnTrainBack").onclick=()=>{ __inTraining=false; Aud.stop(); showBase(); };
/* ---- shop ---- */
function openShop(){ paintShop(); $("shopPanel").classList.add("on"); }
function paintShop(){ $("shopCoins").textContent=S.coins||0;
  const g=$("shopGrid"); g.innerHTML="";
  BASE_ITEMS.forEach(it=>{ const owned=!!S.owned[it.id], can=(S.coins||0)>=it.cost;
    const d=document.createElement("div"); d.className="shopitem"+(owned?" owned":"");
    d.innerHTML=`<div class="ic">${it.ic}</div><div class="nm">${it.nm}</div>`;
    if(owned){ const t=document.createElement("div"); t.className="owned-tag"; t.textContent="OWNED ✓"; d.appendChild(t); }
    else { const buy=document.createElement("button"); buy.className="buy"+(can?"":" cant"); buy.textContent="💰 "+it.cost;
      buy.onclick=()=>{ if((S.coins||0)>=it.cost){ S.coins-=it.cost; S.owned[it.id]=true; save(); Aud.ding(); burstAt(d); paintShop();
          showUnlock(`<div style="font-size:104px;line-height:1;">${it.ic}</div>`, it.nm.toUpperCase(), "NEW ITEM!"); }
        else Aud.play("shop_need"); };
      d.appendChild(buy); }
    g.appendChild(d); }); }
$("btnShop").onclick=()=>openShop();
$("btnShopClose").onclick=()=>{ $("shopPanel").classList.remove("on"); paintBase(); };

/* ---------------- SETTINGS ---------------- */
/* Parent-facing progress snapshot (read-only) — what Teddy can actually read. */
function progAcc(key){ const m=S.mastery[key]; return m&&m.seen? Math.round(100*m.ok/m.seen) : null; }
function strDots(g){ const s=(mast(g).str)||0; return "●".repeat(s)+"○".repeat(5-s); }
window.renderProgress=function(){ const el=$("progBody"); if(!el)return;
  const doneN=Object.keys(S.done).length, totalN=MISSIONS.length;
  const taught=taughtLetters();
  const weak=taught.slice().sort((a,b)=>{ const w=g=>{const m=mast(g),acc=m.seen?m.ok/m.seen:0;return (5-(m.str||0))+(1-acc)+(m.seen<3?2:0);}; return w(b)-w(a); }).slice(0,5);
  const decoded=Object.keys(READWORDS).filter(w=>{const m=S.mastery["w_"+w];return m&&m.ok>0;});
  const sight=Object.keys(SIGHT).filter(w=>{const m=S.mastery["sw_"+w];return m&&m.ok>0;});
  const sentDone=MISSIONS.filter(m=>m.type==="sentence"&&S.done[m.id]).length;
  const sentTotal=MISSIONS.filter(m=>m.type==="sentence").length;
  const power=(currentAct()===2?["Squire","Soldier","Knight"]:["Hero","Super Hero","Mega Hero"])[heroOpts().muscle];
  const lettersRow=taught.length? taught.map(g=>`<span class="pgem" style="background:${GEMCOLOR[g]||'#888'}">${g.toUpperCase()}</span>`).join(" ") : "<i>none yet</i>";
  /* ----- level-override slider: where he's unlocked to, drag to move him ----- */
  const pm=playMissions(currentAct());
  const doneCnt=pm.filter(m=>S.done[m.id]).length;
  const lvlLabel=v=>{ if(v<=0)return "Very start"; const m=pm[Math.min(v,pm.length)-1]; const z=ZONES.find(zz=>zz.id===m.z);
    return (z?z.name+" · ":"")+(m.lbl||("Mission "+m.id)); };
  const overrideHTML=`<div class="psec"><b>Set Teddy's level</b> <span class="pnote">(parent override)</span>
      <div class="pnote" style="margin:4px 0 8px;">Drag to move him forward or back. Everything up to that point counts as done. Use if his progress ever glitches, or to skip/revisit.</div>
      <input type="range" id="lvlSlide" min="0" max="${pm.length}" value="${doneCnt}" step="1" style="width:100%;accent-color:#ffc93c;">
      <div style="display:flex;justify-content:space-between;font-size:11px;" class="pnote"><span>Start</span><span>Level ${pm.length}</span></div>
      <div style="text-align:center;margin-top:6px;"><b id="lvlNow">Level ${doneCnt} / ${pm.length}</b> <span class="pnote">— <span id="lvlLbl">${lvlLabel(doneCnt)}</span></span></div>
      <div style="text-align:center;margin-top:8px;"><button class="btn ghost sm" id="lvlApply" disabled>Move Teddy here</button></div></div>`;
  /* ----- save-safety: snapshots + durability nudges ----- */
  const snaps=snapshots();
  const snapRows=snaps.length? snaps.slice().reverse().map((s,i)=>{ const realIx=snaps.length-1-i;
    return `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin:3px 0;">
      <span class="pnote">${new Date(s.ts).toLocaleDateString()} — ${s.label||"snapshot"}</span>
      <button class="btn ghost sm snapRestore" data-i="${realIx}">Restore</button></div>`; }).join("") : `<div class="pnote">No snapshots yet — one is saved automatically at each rescue.</div>`;
  const standalone = (window.navigator&&window.navigator.standalone) || (window.matchMedia&&window.matchMedia("(display-mode: standalone)").matches);
  const safetyHTML=`<div class="psec"><b>Save safety</b>
      <div class="pnote" style="margin:4px 0 8px;">His progress is kept in two copies on this iPad and repaired automatically if one is damaged. For real peace of mind:</div>
      <div class="pnote">${cloudURL?'<span style="color:#39d98a;font-weight:800;">✓</span> Cloud sync is ON — his progress is backed up off-device.':'<span style="color:#ff5e57;font-weight:800;">✗</span> <b>Cloud sync is OFF.</b> Turn it on (Backup tab) so progress is safe even if this iPad is lost or cleared.'}</div>
      <div class="pnote" style="margin-top:4px;">${standalone?'<span style="color:#39d98a;font-weight:800;">✓</span> Running as a Home-Screen app — storage is durable.':'<span style="color:#ff5e57;font-weight:800;">✗</span> <b>Add to Home Screen</b> (Safari Share ▸ Add to Home Screen). Otherwise Safari can erase saved progress after about a week unused.'}</div>
      <div style="margin-top:8px;"><b class="pnote">Safety snapshots</b> ${snapRows}</div></div>`;
  /* daily training: today + last-7-days history */
  ensureDaily();
  const goal=S.goalMin||30, todayMin=Math.floor((S.daily.secs||0)/60);
  const hist=Object.assign({}, S.history||{}); hist[S.daily.day]=S.daily.secs||0;
  const days7=[]; for(let i=6;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i);
    const k=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); days7.push([k,hist[k]||0]); }
  const weekMin=Math.round(days7.reduce((s,x)=>s+x[1],0)/60), daysHit=days7.filter(x=>x[1]>=goal*60).length;
  const bars=days7.map(x=>{ const h=Math.min(100,100*x[1]/(goal*60)), hit=x[1]>=goal*60;
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
      <div style="width:20px;height:46px;background:#241b4d;border-radius:5px;border:2px solid #3a2d72;display:flex;align-items:flex-end;overflow:hidden;"><div style="width:100%;height:${h}%;background:${hit?'linear-gradient(180deg,#ffd75e,#f0a82b)':'linear-gradient(180deg,#5fe0a0,#23a35f)'};"></div></div>
      <div class="pnote" style="font-size:10px;">${Math.round(x[1]/60)}</div></div>`; }).join("");
  el.innerHTML=`
    <div class="psec" style="text-align:center;"><b>${escHTML(profileName(ACTIVE))}'s progress</b> <span class="pnote">— each player has their own stats</span></div>
    <div class="psec"><b>Daily training (time on task)</b>
      <div class="pgrid" style="margin-top:6px;">
        <div class="pcard"><div class="pnum">${todayMin}<span style="font-size:13px;">m</span></div><div class="plbl">Today / ${goal}m goal</div></div>
        <div class="pcard"><div class="pnum">${weekMin}<span style="font-size:13px;">m</span></div><div class="plbl">This week</div></div>
        <div class="pcard"><div class="pnum">${daysHit}<span style="font-size:13px;">/7</span></div><div class="plbl">Days hit goal</div></div>
      </div>
      <div style="display:flex;gap:7px;justify-content:center;align-items:flex-end;margin-top:8px;">${bars}</div>
      <div class="pnote" style="text-align:center;margin-top:7px;">Today's split — <b>${Math.max(0,todayMin-Math.floor((S.daily.trainSecs||0)/60))}m</b> missions · <b>${Math.floor((S.daily.trainSecs||0)/60)}m</b> training. A 15/15 balance (new missions + Training Room practice) is a great daily rhythm.</div>
      <div class="pnote" style="text-align:center;margin-top:7px;">Daily goal: <button class="chipbtn" id="goalDown">−5</button> <b>${goal} min</b> <button class="chipbtn" id="goalUp">+5</button><br>~30 min/day across 3–4 short sessions is ideal — spaced practice beats one long sitting, and suits his focus.</div>
    </div>
    <div class="pgrid">
      <div class="pcard"><div class="pnum">${doneN}/${totalN}</div><div class="plbl">Missions done</div></div>
      <div class="pcard"><div class="pnum">${taught.length}/${ORDER.length}</div><div class="plbl">Letters learned</div></div>
      <div class="pcard"><div class="pnum">${decoded.length}/${Object.keys(READWORDS).length}</div><div class="plbl">Words decoded</div></div>
      <div class="pcard"><div class="pnum">${sight.length}/${Object.keys(SIGHT).length}</div><div class="plbl">Sight words</div></div>
      <div class="pcard"><div class="pnum">${sentDone}/${sentTotal}</div><div class="plbl">Sentence levels read</div></div>
      <div class="pcard"><div class="pnum">⚡${S.stars}</div><div class="plbl">${power}</div></div>
    </div>
    <div class="psec"><b>Letter gems learned</b><div class="pgems">${lettersRow}</div></div>
    <div class="psec"><b>Mastered for milestones</b> <span class="pnote">(★ = mastered; rescues are gated on these)</span>
      <div class="pgems">${taught.length? taught.map(g=>`<span class="pgem" style="background:${letterMastered(g)?'#27ae60':'#7a6f4a'}">${g.toUpperCase()}${letterMastered(g)?'★':''}</span>`).join(" ") : "<i>none yet</i>"}</div>
      <div class="pnote">${taught.filter(letterMastered).length} / ${taught.length} letters mastered. A rescue can't be earned until every letter so far is mastered — so an ally freed = real proficiency.</div></div>
    ${weak.length?`<div class="psec"><b>Best to practice next</b> <span class="pnote">(weakest right now)</span>
      <div class="pgems">${weak.map(g=>`<span class="pgem warn">${g.toUpperCase()}</span> <span class="pnote">${progAcc(g)!=null?progAcc(g)+"%":"new"} ${strDots(g)}</span>`).join("<br>")}</div></div>`:""}
    ${overrideHTML}
    ${safetyHTML}
    <div class="psec pnote">Reading direction so far: letter→sound (decode) via Read-It &amp; Story Gate; sound→letter (spell) via Forge &amp; patrols. Both grow as he plays.</div>`;
  const gd=$("goalDown"), gu=$("goalUp");
  if(gd)gd.onclick=()=>{ S.goalMin=Math.max(5,(S.goalMin||30)-5); save(); updateDailyMeter(); window.renderProgress(); };
  if(gu)gu.onclick=()=>{ S.goalMin=Math.min(120,(S.goalMin||30)+5); save(); updateDailyMeter(); window.renderProgress(); };
  /* level-override slider wiring */
  const sl=$("lvlSlide"), apply=$("lvlApply");
  if(sl){ sl.oninput=()=>{ const v=+sl.value; $("lvlNow").textContent="Level "+v+" / "+pm.length;
      $("lvlLbl").textContent=lvlLabel(v); apply.disabled=(v===doneCnt); };
    apply.onclick=()=>{ const v=+sl.value; snapshot("before level change");
      pm.forEach((m,i)=>{ if(i<v)S.done[m.id]=true; else delete S.done[m.id]; });
      S.gear=Object.keys(GEAR_AT).filter(id=>S.done[id]).map(id=>GEAR_AT[id]);
      if(v>0){ S.intro=true; S.scan=true; }
      save(); GEO=geomFor(currentAct());
      $("settingsPanel").classList.remove("on"); Aud.stop&&Aud.stop(); toMap(); }; }
  /* snapshot restore buttons */
  document.querySelectorAll(".snapRestore").forEach(b=>{ b.onclick=()=>{ const arr=snapshots(); const s=arr[+b.dataset.i];
    if(!s)return; const d=migrate(JSON.parse(s.data)); if(!d)return; snapshot("before restore"); S=d; save();
    $("settingsPanel").classList.remove("on"); GEO=geomFor(currentAct()); toMap(); }; });
};
function openSettings(){ $("saveBox").value=JSON.stringify(S); $("vpStatus2").textContent=vpMsg(); window.renderProgress();
  $("cloudURL").value=cloudURL; cloudStatus(cloudURL?"Cloud sync ON — same URL on any device continues his progress":"Cloud sync off (saved on this device)");
  paintPlayers(); paintVol(); paintCalmBtn(); $("settingsPanel").classList.add("on"); }
/* parent-only player management (inside the gated Grown-Up Corner) */
function paintPlayers(){ const list=$("playersList"); if(!list)return; list.innerHTML="";
  profiles().forEach(p=>{ const row=document.createElement("div");
    row.style.cssText="display:flex;align-items:center;justify-content:space-between;gap:8px;background:#171236;border:2px solid #3a2d72;border-radius:10px;padding:6px 12px;";
    row.innerHTML=`<span class="read" style="font-size:15px;"><span class="pnm"></span>${p.id===ACTIVE?' <span style="color:#9fe870;">(playing)</span>':''}</span>`;
    row.querySelector(".pnm").textContent=p.name;
    if(p.id!=="teddy"){ const x=document.createElement("button"); x.className="btn ghost sm"; x.textContent="Remove"; x.style.fontSize="13px";
      x.onclick=()=>{ if(confirm("Remove player \""+p.name+"\" and their progress?")){ removeProfile(p.id); paintPlayers(); paintTitle(); } }; row.appendChild(x); }
    list.appendChild(row); }); }
$("btnAddPlayer").onclick=()=>{ const nm=prompt("New player name?"); if(nm&&nm.trim()){ addProfile(nm); paintPlayers(); paintTitle(); } };
/* ADULT GATE: the Grown-Up Corner opens only on a 3-second PRESS-AND-HOLD, so
   Teddy can't wander in and change things. The gear fills/grows while held. */
(function(){ const g=$("btnGear"); if(!g)return; let t=null;
  const start=e=>{ if(e&&e.preventDefault)e.preventDefault(); clearTimeout(t); g.classList.add("holding");
    t=setTimeout(()=>{ g.classList.remove("holding"); Aud.pick&&Aud.pick(); openSettings(); },3000); };
  const cancel=()=>{ clearTimeout(t); g.classList.remove("holding"); };
  g.addEventListener("pointerdown",start);
  ["pointerup","pointerleave","pointercancel"].forEach(ev=>g.addEventListener(ev,cancel)); })();
$("btnCloudConnect").onclick=()=>cloudConnect($("cloudURL").value);
$("btnCloudOff").onclick=()=>{ cloudURL=""; try{localStorage.removeItem("teddyCloudURL");}catch(e){} $("cloudURL").value=""; cloudStatus("Cloud sync off (saved on this device)"); };
$("btnCloseSettings").onclick=()=>$("settingsPanel").classList.remove("on");
$("btnVoiceTest").onclick=()=>{Aud.pick();Aud.play("test");};
/* Visual-detail toggle: Full (filters+animation) ⟷ Calm (lighter, for older iPads/battery) */
function paintCalmBtn(){ const b=$("btnCalm"); if(b)b.textContent=(S.calm?"Calm":"Full"); }
$("btnCalm").onclick=()=>{ S.calm=!S.calm; document.body.classList.toggle("calm",!!S.calm); save(); Aud.ding(); paintCalmBtn(); };
paintCalmBtn();
/* Narration volume slider (parent setting) */
function paintVol(){ const s=$("volSlider"),p=$("volPct"); const v=Math.round((S.vol==null?1:S.vol)*100);
  if(s)s.value=v; if(p)p.textContent=v+"%"; }
{ const vs=$("volSlider"); if(vs)vs.oninput=()=>{ S.vol=Math.max(0,Math.min(1,(+vs.value||0)/100)); Aud.vol=S.vol;
    const p=$("volPct"); if(p)p.textContent=vs.value+"%"; save(); }; }
paintVol();
$("btnCopySave").onclick=()=>{$("saveBox").select();document.execCommand("copy");};
$("btnRestoreSave").onclick=()=>{ try{const d=migrate(JSON.parse($("saveBox").value));
  if(d){ snapshot("before restore"); S=d; save(); $("settingsPanel").classList.remove("on"); GEO=geomFor(currentAct()); toMap(); }
  else alert("That backup code didn't work — double-check it and try again."); }
  catch(e){alert("That backup code didn't work — double-check it and try again.");} };
