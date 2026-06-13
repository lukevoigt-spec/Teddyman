/* =========================================================
   STATE + SAVE LAYER (extracted from game.js). Owns the S game-state,
   migrate/load/save (redundant + self-healing), milestone snapshots,
   PROFILES (per-player saves), optional CLOUD sync, and daily-stats
   (ensureDaily/sessionTick). Loaded BEFORE game.js so S + the save API
   exist before any game.js line runs. (cloudConnect's geomFor/GEO refs
   are in its body, resolved at runtime.) Modular-split slice 4.
========================================================= */
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
