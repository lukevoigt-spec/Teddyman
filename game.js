/* =========================================================
   SUPER TEDDY — STAR FORCE CITY (Act 1) + MEDIEVAL REALM (Act 2)
   The game core: boot/title/intro, mission handlers, base/shop/training,
   settings, win/reward. Data/save/audio/map/allies live in their own modules
   (see CLAUDE.md repo layout + load order). The world map is a single-screen
   PAINTED map (map.js); voicepack audio engine has a per-line TTS fallback.
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

/* SAVE/PROFILES/CLOUD/daily-stats layer moved to state-save.js (loaded before game.js). */
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

/* AUDIO layer (CUSTOM clip store, VStore, clipFor, Aud engine, flow/clearFlow/
   narrate, ear-tap listener) moved to audio.js (loaded before game.js). */

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
/* SCENE HARMONIZER tones: each scene's dominant ambient KEY light + an accent
   RIM, picked to match its painted background. show() pushes these to body as
   --scene-key/--scene-rim so the grade overlay AND the foreground character art
   read as lit by the same world (the scene's light wraps the hero's silhouette).
   SCENE_TONE2 overrides the medieval Act-2 scenes (torch/stone/dragon-fire). */
const SCENE_TONE={
  title:  {key:"#ffd48c", rim:"#6db5ff"},   /* city night: gold key, cyan rim */
  intro:  {key:"#c9a6ff", rim:"#7fd9ff"},   /* cutscene twilight */
  lab:    {key:"#7fe3ff", rim:"#46f0c9"},   /* gem lab: cyan tech glow */
  learn:  {key:"#ffe0a8", rim:"#9ad0ff"},   /* warm, focused classroom light */
  city:   {key:"#9db8ff", rim:"#ffc93c"},   /* blue streets + gold gems */
  battle: {key:"#ff8a5a", rim:"#9fe870"},   /* hot drama, toxic-green rim */
  base:   {key:"#ffd06a", rim:"#5fa8ff"},   /* warm base interior + blue */
  victory:{key:"#ffe27a", rim:"#ff8ad6"},   /* gold celebration + pink */
  rest:   {key:"#b79cff", rim:"#7fd9ff"}    /* calm evening twilight */
};
const SCENE_TONE2={
  title:  {key:"#e8c27a", rim:"#ff9a42"},
  learn:  {key:"#ffd9a0", rim:"#c9b06a"},   /* parchment + stone */
  city:   {key:"#e0c089", rim:"#ff9a42"},   /* sunlit medieval village */
  battle: {key:"#ff7a3a", rim:"#ffd24a"},   /* dragon fire */
  base:   {key:"#e8c27a", rim:"#9a7bff"}
};
function applySceneTone(id){
  const slot=BG_MAP[id]||"learn";
  const t=(currentAct()===2 && SCENE_TONE2[slot]) || SCENE_TONE[slot] || SCENE_TONE.learn;
  document.body.style.setProperty("--scene-key", t.key);
  document.body.style.setProperty("--scene-rim", t.rim); }
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
  /* scene harmonizer: per-act colour grade + per-scene key/rim light + hotter grade on battle/finale */
  document.body.dataset.act=currentAct();
  applySceneTone(id);
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
applySceneTone("scrTitle");                        /* per-scene key/rim light for the boot title */
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

/* While a cutscene character narrates, gently bob the portrait so the mentor
   reads as "talking" to Teddy (face-agnostic — works for bearded Noah, the
   dragon, the captives, etc., none of which have an animatable mouth). The
   bob runs for the audio's duration; a token guards against a re-paint's stale
   promise clearing the new talk state. Honours reduced-motion + Calm (CSS). */
function faceSpeak(artEl, key, textEl, ids, display){
  const pr=narrate(key, textEl, ids, display);
  if(artEl){ const tok=(artEl.__sp=(artEl.__sp||0)+1); artEl.classList.add("talking");
    pr.then(()=>{ if(artEl.__sp===tok) artEl.classList.remove("talking"); }); }
  return pr; }

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
  faceSpeak($("introArt"),"intro",$("introText"),[p.id]);
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
  faceSpeak($("interArt"),"inter",$("interText"),[p.id]);
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
  faceSpeak($("interArt"),"inter",$("interText"),[p.id]);
  $("btnInterNext").textContent = a2Ix<ACT2_INTRO.length-1?"NEXT ➜":"ENTER THE REALM! ➜";
  $("btnInterNext").onclick=()=>{ a2Ix++;
    if(a2Ix<ACT2_INTRO.length)paintA2(); else { S.act2intro=true; save(); Aud.stop(); toMap(); } }; }
/* Shown when the current act has no missions yet (safe fallback). */
function actComingSoon(){ show("scrInter");
  $("interArt").innerHTML=`<div style="display:flex;justify-content:center;">${heroNow(220)}</div>`;
  faceSpeak($("interArt"),"inter",$("interText"),["interlude5"]);
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


/* HERO LEAGUE / ALLIES (CAGED, ALLY, LEAGUE, ALLY_COL + allyMid/allyFreed/
   allyLine/allyPop/allyMapFig) moved to allies.js (loaded before game.js). */

/* PAINTED WORLD MAP (MAPIMG, ZONESPOTS, zMissions/zoneDone/zoneNext/curZoneIx,
   mapFriends, mapPaintSVG, toMap) moved to map.js (loaded after game.js — it
   uses game.js helpers like heroNow/show/startMission only at runtime). The map
   navigation button handlers stay here (they run at game.js load, after $). */
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
      /* keep the tutorial flags consistent with the simulated progress: level 0 =
         a true fresh start (intro + scan tutorials play again), any progress skips
         them. Symmetric so the slider is predictable in both directions (QA #3). */
      S.intro = v>0; S.scan = v>0;
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
