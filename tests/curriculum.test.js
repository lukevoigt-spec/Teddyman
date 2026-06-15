/* =========================================================
   Super Teddy — curriculum & app-invariant tests (no deps).
   Run:  node tests/curriculum.test.js   (exit 0 = pass)

   Protects the learning ladder as content grows (esp. Act 2+): unique ids,
   per-act id ranges, every mission type handled + zone exists, and the big one —
   no mission ever uses a letter/grapheme before it's taught (in play order).
   Recommended by QA.md (2026-06-13). Mirrors save.test.js's harness.
========================================================= */
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.join(__dirname, "..");

const store = {};
const ls = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };
const noop = () => {};
function mkEl() {
  const b = { style: { setProperty: noop }, _html: "", classList: { _s: new Set(), add(...a){a.forEach(x=>this._s.add(x));}, remove(...a){a.forEach(x=>this._s.delete(x));}, contains(x){return this._s.has(x);}, toggle: noop },
    appendChild(c){this.children.push(c);}, removeChild: noop, remove: noop, setAttribute: noop, addEventListener: noop,
    querySelector(sel){ this._qs=this._qs||{}; return this._qs[sel]||(this._qs[sel]=mkEl()); }, querySelectorAll(){return this.children;}, textContent: "", value: "0", focus: noop,
    getContext: () => ({}), children: [], select: noop, onclick: null, disabled: false, dataset: {},
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 10, height: 10 }), clientWidth: 400, clientHeight: 600, offsetWidth: 400, offsetHeight: 600, className: "" };
  Object.defineProperty(b, "innerHTML", { get(){return b._html;}, set(v){ b._html = v; if (v === "") b.children.length = 0; } });
  return b;
}
const els = {};
const doc = { getElementById: id => els[id] || (els[id] = mkEl()), createElement: () => mkEl(), querySelector: () => mkEl(), querySelectorAll: () => [], body: mkEl(), addEventListener: noop, createElementNS: () => mkEl(), execCommand: noop, hidden: false };
const win = { addEventListener: noop, removeEventListener: noop, innerWidth: 800, innerHeight: 600, location: { href: "" }, matchMedia: () => ({ matches: false, addEventListener: noop }), localStorage: ls, VOICEPACK: {}, indexedDB: null, navigator: { standalone: false } };
win.renderProgress = noop;
const ctx = { Math, Date, JSON, console, window: win, document: doc, localStorage: ls, setTimeout: () => 0, clearTimeout: noop, setInterval: () => 0, clearInterval: noop, requestAnimationFrame: () => 0,
  speechSynthesis: { speak: noop, cancel: noop, getVoices: () => [] }, SpeechSynthesisUtterance: function(){ return {}; },
  Audio: function(){ return { play: () => Promise.resolve(), pause: noop, addEventListener: noop }; },
  fetch: () => Promise.reject(new Error("offline")), navigator: { standalone: false }, AudioContext: function(){ return {}; },
  alert: noop, confirm: () => true, prompt: () => null, btoa: s => Buffer.from(s).toString("base64"), atob: s => Buffer.from(s, "base64").toString() };
ctx.Image = function(){ return { set src(v){ if (this.onerror) this.onerror(); }, onload: null, onerror: null }; };
ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, "art.js"), "utf8"), ctx);

const TEST = `
RESULT = { pass: 0, fail: 0, lines: [] };
function ok(name, cond, extra){ if(cond){RESULT.pass++; RESULT.lines.push("  ok  "+name);} else {RESULT.fail++; RESULT.lines.push("  XX  "+name+(extra?"  -> "+JSON.stringify(extra):""));} }
function grp(s){ RESULT.lines.push("\\n• "+s); }

grp("ids, types, zones");
var ids = MISSIONS.map(m=>m.id);
ok("mission ids are unique", new Set(ids).size === ids.length);
ok("Act-1 mission ids in 0..99", actMissions(1).every(m=>m.id>=0 && m.id<100));
ok("Act-2 mission ids in 100..199", actMissions(2).every(m=>m.id>=100 && m.id<200));
var HANDLED = new Set(["learn","patrol","read","spell","sentence","cloze","scramble","fortress","magic","forge"]);
ok("every mission type is handled", MISSIONS.every(m=>HANDLED.has(m.type)), MISSIONS.filter(m=>!HANDLED.has(m.type)).map(m=>m.type));
var zoneIds = new Set(ZONES.map(z=>z.id));
ok("every mission references an existing zone", MISSIONS.every(m=>zoneIds.has(m.z)), MISSIONS.filter(m=>!zoneIds.has(m.z)).map(m=>m.id));

grp("the big one: no letter/grapheme used before it is taught (play order)");
function wordOK(w, taught){ var me=magicE(w); if(me && !taught.has(me.unit)) return false; return toGraphemes(w).every(g=>taught.has(g)); }
var decErrs = [];
[1,2].forEach(function(act){
  var taught = new Set(act===2 ? ORDER.slice() : []);   // Act 2 carries the 26 letters
  playMissions(act).forEach(function(m){
    if(m.type==="learn") taught.add(m.letter);
    else if(m.type==="magic") taught.add(m.unit);
    if(m.type==="forge" || m.type==="read"){ (m.words||[]).forEach(function(w){ if(!wordOK(w, taught)) decErrs.push("act"+act+" m"+m.id+" '"+w+"'"); }); }
  });
});
ok("all forge/read words are decodable by their play position", decErrs.length===0, decErrs);

grp("grapheme model integrity");
var a1 = MISSIONS.filter(m=>m.z<100 && (m.type==="forge"||m.type==="read"));
var dig = [];
a1.forEach(m=>(m.words||[]).forEach(w=>{ if(toGraphemes(w).length !== w.length) dig.push(w); }));
ok("Act-1 forge/read words contain NO digraph sequence", dig.length===0, dig);
ok("magicE() is null for non-magic-e words", ["cat","dog","ship","fish","duck","king","frog","jump","milk","the","this","bath","stop","blend"].every(w=>magicE(w)===null));
ok("magicE() detects cake/bike/home/cube", ["cake","bike","home","cube"].every(w=>magicE(w) && magicE(w).unit));

grp("mission<->teaching maps stay consistent");
ok("DIGRAPH_MISSION points at the right learn missions", Object.keys(DIGRAPH_MISSION).every(d=>{var m=MISSIONS.find(x=>x.id===DIGRAPH_MISSION[d]); return m && m.type==="learn" && m.letter===d;}));
ok("MAGICE_MISSION points at the right magic missions", Object.keys(MAGICE_MISSION).every(u=>{var m=MISSIONS.find(x=>x.id===MAGICE_MISSION[u]); return m && m.type==="magic" && m.unit===u;}));

grp("decode content has pictures + audio");
var picErr = [];
MISSIONS.filter(m=>m.type==="read").forEach(m=>{ var pool = (m.z>=100?READWORDS2:READWORDS); (m.words||[]).forEach(w=>{ if(!pool[w]) picErr.push("m"+m.id+" '"+w+"'"); }); });
ok("every read word has a picture", picErr.length===0, picErr);
var audErr = [];
MISSIONS.filter(m=>m.type==="forge"||m.type==="read").forEach(m=>(m.words||[]).forEach(w=>{ if(!LINES["word_"+w]) audErr.push(w); }));
ok("every forge/read word has a word_ audio line", audErr.length===0, [...new Set(audErr)]);

grp("act id ranges + map-spot coverage");
ok("each act's missions stay in its reserved 100-id range (ACTS.idBase)",
  ACTS.every(function(a){ return actMissions(a.id).every(function(m){ return m.id>=a.idBase && m.id<a.idBase+100; }); }));
ok("ZONESPOTS has a painted spot for every zone of each act",
  [1,2].every(function(act){ return (ZONESPOTS[act]||[]).length >= actZones(act).length; }),
  {a1:[actZones(1).length,(ZONESPOTS[1]||[]).length], a2:[actZones(2).length,(ZONESPOTS[2]||[]).length]});

grp("map locking logic — no skipping ahead");
var z1=actZones(1); S.done={};
ok("fresh save: first zone is current (rest locked)", curZoneIx(z1)===0);
zMissions(z1[0]).forEach(function(m){ S.done[m.id]=true; });
ok("after the first zone is finished, the second zone becomes current", curZoneIx(z1)===1);
S.done={};
ok("zoneNext() returns the first UNDONE mission of a zone", (function(){ var first=zMissions(z1[0])[0], m=zoneNext(z1[0]); return m && m.id===first.id; })());

grp("vowel teams (ai/ee/oa) live — sight word 'said' stays sight-handled");
ok("'said' is NOT detected as magic-e", magicE("said")===null);
ok("'said' is a SIGHT word, voiced WHOLE via sw_said (never grapheme-decoded)", wordAudio("said")[0]==="sw_said");
ok("vowel teams tokenise as ONE gem (rain->r,ai,n; feet->f,ee,t; boat->b,oa,t)",
  toGraphemes("rain").join()==="r,ai,n" && toGraphemes("feet").join()==="f,ee,t" && toGraphemes("boat").join()==="b,oa,t");
ok("VOWELTEAM_MISSION points at the right learn missions", Object.keys(VOWELTEAM_MISSION).every(t=>{var m=MISSIONS.find(x=>x.id===VOWELTEAM_MISSION[t]); return m && m.type==="learn" && m.letter===t;}));

grp("Act-2 sentence-level fluency (the 2nd-grade rung) is decodable + well-wired");
// the Great Library plays after every Act-2 skill zone, so the taught set is the 26 letters + all digraphs + magic-e + vowel teams
var a2t = new Set(ORDER.concat(DIGRAPHS).concat(MAGICE_UNITS).concat(VOWELTEAMS));
function a2ok(w){ if(SIGHT[w]) return true; var me=magicE(w); if(me && !a2t.has(me.unit)) return false; return toGraphemes(w).every(g=>a2t.has(g)); }
var s2 = [];
SENTENCES2.forEach(function(s,i){ s.t.forEach(function(w){ if(!a2ok(w)) s2.push("S2["+i+"] '"+w+"'"); }); });
CLOZE2.forEach(function(c,i){ c.t.forEach(function(w){ if(w!=="_" && !a2ok(w)) s2.push("C2["+i+"] '"+w+"'"); });
  [c.ans].concat(c.foils).forEach(function(w){ if(!a2ok(w)) s2.push("C2["+i+"] choice '"+w+"'"); }); });
ok("every Act-2 sentence/cloze word is decodable (digraphs/blends/magic-e/vowel-teams + sight)", s2.length===0, s2);
var ix = [];
MISSIONS.forEach(function(m){
  if(m.type==="sentence"){ var pool=(m.z>=100?SENTENCES2:SENTENCES); (m.sents||[]).forEach(function(i){ if(!pool[i]) ix.push("sentence m"+m.id+" idx "+i); }); }
  if(m.type==="cloze"){ var pool=(m.z>=100?CLOZE2:CLOZE); (m.items||[]).forEach(function(i){ if(!pool[i]) ix.push("cloze m"+m.id+" idx "+i); }); } });
ok("sentence/cloze missions reference valid pool indices", ix.length===0, ix);
ok("Act 2 now has sentence-level reading before the Dragon Keep finale",
  actMissions(2).some(function(m){ return m.type==="sentence"; }) && actMissions(2).some(function(m){ return m.type==="cloze"; }));
// the Act-2 finale (Dragon Keep / FORTRESS2) must PROVE sentence reading at the climax (the 2nd-grade goal),
// not end on word-picture decoding — and its sentence/maze pools must be Act-2-decodable, never Act-1 fallback.
ok("Act-2 finale (FORTRESS2) climaxes on SENTENCE/comprehension, not a word-picture 'read' phase",
  FORTRESS2[FORTRESS2.length-1].kind==="sentence");
var fm2=[];
FORTMAZE2.forEach(function(c,i){ c.t.forEach(function(w){ if(w!=="_" && !a2ok(w)) fm2.push("FM2["+i+"] '"+w+"'"); });
  [c.ans].concat(c.foils).forEach(function(w){ if(!a2ok(w)) fm2.push("FM2["+i+"] choice '"+w+"'"); }); });
ok("every Act-2 finale Maze (FORTMAZE2) word is decodable by Great-Library play order (never an Act-1 fallback)", fm2.length===0, fm2);
ok("FORTMAZE2 has a blank + a valid answer in every item", FORTMAZE2.every(function(c){ return c.t.indexOf("_")>=0 && c.ans && Array.isArray(c.foils) && c.foils.length>=1; }));
ok("FORTMAZE2 is DISTINCT from the Dojo CLOZE2 (the climax isn't a rerun — mirrors Act-1 FORTMAZE vs CLOZE)",
  FORTMAZE2.every(function(f){ return !CLOZE2.some(function(c){ return JSON.stringify(c.t)===JSON.stringify(f.t) && c.ans===f.ans; }); }));

grp("bug #3: magic-e units never reach a sound-ID (snd_) round");
// magic-e (a_e/i_e/o_e/u_e) is a SPLIT grapheme with no phoneme clip — it must never be a find/boss gem
ok("magic-e units have NO snd_ clip (so they can't be sound-ID targets)",
  MAGICE_UNITS.every(u=>!LINES["snd_"+u]), MAGICE_UNITS.filter(u=>LINES["snd_"+u]));
ok("soundReviewSet drops magic-e units (they route to startMagic, not startFind)",
  soundReviewSet(["a_e","sh","i_e","ee"]).join()==="sh,ee", soundReviewSet(["a_e","sh","i_e","ee"]));
ok("magicReviewSet keeps only the magic-e units",
  magicReviewSet(["a_e","sh","i_e","ee"]).join()==="a_e,i_e", magicReviewSet(["a_e","sh","i_e","ee"]));
// teach EVERYTHING, then the find/boss foil pool must be magic-e-free and fully voiced
S.done={}; MISSIONS.forEach(m=>{ S.done[m.id]=true; });
ok("find/boss foils (taughtGraphemes) exclude magic-e units",
  MAGICE_UNITS.every(u=>!taughtGraphemes().includes(u)));
ok("every find/boss foil grapheme has a snd_ clip",
  taughtGraphemes().every(g=>!!LINES["snd_"+g]), taughtGraphemes().filter(g=>!LINES["snd_"+g]));
S.done={};

grp("security: parent-entered profile-name escaping");
ok("escHTML neutralises <, >, \\" and '",
  (function(){ var s=escHTML("<img src=x onerror=1>\\"'"); return s.indexOf("<")<0 && s.indexOf(">")<0 && s.indexOf('"')<0 && s.indexOf("'")<0; })());

grp("anti-gaming: sound-ID prompt never reveals the target (CLAUDE.md #4)");
(function(){ try{
  S.done[0]=true; S.done[1]=true; S.done[3]=true;   // s, a, t taught
  function findPrompt(g){ startFind(g,4,["s","a","t"],function(){}); return $("findText").querySelector("span").textContent || ""; }
  var p1=findPrompt("s"), p2=findPrompt("a");
  ok("find prompt is target-INDEPENDENT (same text for different sounds)", p1.length>0 && p1===p2, {p1:p1,p2:p2});
  // the displayed prompt must never contain the target grapheme or its sound-spelling
  ok("find prompt text contains no letter/grapheme target", !/\b[sat]\b/.test(p1.toLowerCase().replace(/[^a-z ]/g," ")) || p1===p2, {p1:p1});
  function bossPrompt(g){ startBoss(g); return $("bossText").querySelector("span").textContent || ""; }
  var b1=bossPrompt("s"), b2=bossPrompt("a");
  ok("boss prompt is target-INDEPENDENT too", b1.length>0 && b1===b2, {b1:b1,b2:b2});
}catch(e){ ok("anti-gaming prompts are testable", false, String(e)); } })();
S.done={};

grp("Act-1 Reading Dojo SCRAMBLE words are decodable");
(function(){ var allL=new Set(ORDER.slice()), e=[];
  SCRAMBLE.forEach(function(s,i){ s.words.forEach(function(w){ if(!SIGHT[w] && !toGraphemes(w).every(function(g){return allL.has(g);})) e.push("S["+i+"] '"+w+"'"); }); });
  ok("every scramble word is decodable (all 26 letters + sight)", e.length===0, e); })();

grp("map locking ENFORCEMENT — mapPaintSVG marks future zones .locked (no skipping ahead)");
(function(){ try{
  function counts(){ var svg=mapPaintSVG(); return {
    done:(svg.match(/mnode done/g)||[]).length,
    current:(svg.match(/mnode current/g)||[]).length,
    locked:(svg.match(/mnode locked/g)||[]).length }; }
  var zs=actZones(1), n=zs.length;
  S.done={};
  var c=counts();
  ok("fresh save: exactly one CURRENT node, the rest LOCKED, none done", c.current===1 && c.locked===n-1 && c.done===0, c);
  ok("every map node exposes data-zi so the lock-guarded click handler can resolve it", (mapPaintSVG().match(/data-zi="/g)||[]).length===n);
  // MAP-1: the painted map hero renders ABOVE the current node — it must be pointer-events:none so it
  // can't intercept the start-mission tap (touch-target / constraint #6 regression guard).
  (function(){ var hm=mapPaintSVG(), pe=hm.indexOf('pointer-events="none"'), ti=hm.indexOf('art/teddy');
    ok("the painted map hero is pointer-events:none before its image (won't steal the current-zone tap)", pe>=0 && ti>pe, {pe:pe,ti:ti}); })();
  // MAP-1 (extension): the decorative mapFriends ally figures (rendered at scale(.5)) sit near the nodes —
  // they too must be pointer-events:none so they never intercept a node tap. .mnode/.portalnode stay tappable.
  // (Plain indexOf, NOT regex: backslash escapes get stripped inside this TEST template literal.)
  (function(){ var mp=mapPaintSVG();
    function cnt(s,sub){ var n=0,i=0; while((i=s.indexOf(sub,i))>=0){ n++; i+=sub.length; } return n; }
    var friends=cnt(mp,"scale(.5)");                                  // scale(.5) is unique to friend figures
    var guarded=cnt(mp,'pointer-events="none" transform="translate'); // a guarded friend group opening
    ok("map renders decorative friend figures (so the guard is exercised)", friends>=1, friends);
    ok("every decorative map friend figure is pointer-events:none (won't steal a node tap)", friends===guarded, {friends:friends,guarded:guarded}); })();
  zMissions(zs[0]).forEach(function(m){ S.done[m.id]=true; });   // clear zone 1
  c=counts();
  ok("after clearing zone 1: one done, one current, the rest still locked", c.done===1 && c.current===1 && c.locked===n-2, c);
  // SKIP-AHEAD via save tampering: complete the LAST zone while an earlier one is unfinished
  S.done={}; zMissions(zs[n-1]).forEach(function(m){ S.done[m.id]=true; });
  ok("completing a LATER zone out of order does NOT move the gate (earliest undone stays CURRENT)", curZoneIx(zs)===0);
  c=counts();
  ok("...the tampered zone shows DONE but the path stays gated (LOCKED nodes remain)", c.done===1 && c.current===1 && c.locked>=1, c);
  S.done={};
}catch(e){ ok("map-lock enforcement is testable", false, String(e)); S.done={}; } })();

grp("MEMORY VAULT routing safety — a no-clip grapheme is NEVER routed into a sound-ID task (anti-gaming #4 / QA #3)");
ok("every magic-e unit lacks a snd_ clip (must be reviewed as a WORD, never shown as a sound-ID gem)", MAGICE_UNITS.every(function(u){ return !hasSoundClip(u); }));
ok("every letter / digraph / vowel-team HAS a snd_ clip (so it IS routable to a sound-ID round)", ["s","a","t","p","i","n"].concat(DIGRAPHS).concat(VOWELTEAMS).every(function(g){ return hasSoundClip(g); }));
ok("soundReviewSet (the sound-ID router) filters OUT the no-clip magic-e units, keeps the rest", (function(){ var s=soundReviewSet(["s","a_e","sh","o_e","ai"]); return s.indexOf("a_e")<0 && s.indexOf("o_e")<0 && s.indexOf("s")>=0 && s.indexOf("sh")>=0 && s.indexOf("ai")>=0; })());
ok("a pure magic-e weak set yields an EMPTY sound-ID set (those route to word/magic review instead)", soundReviewSet(MAGICE_UNITS).length===0);
// the dedicated Recharge activity's router (vaultRoute) must honour the same safety + the sight-word rule
ok("vaultRoute sends a no-clip magic-e unit to a BUILD round (never sound-ID), reviewed inside a word that uses it",
  MAGICE_UNITS.every(function(u){ var r=vaultRoute(u); return r && r.mode==="build" && r.w && magicE(r.w) && magicE(r.w).unit===u; }));
ok("vaultRoute sends a clip grapheme (sh) to a SOUND-ID round", (function(){ var r=vaultRoute("sh"); return r && r.mode==="find" && r.g==="sh"; })());
ok("vaultRoute sends a w_ word to a BUILD round (encode, not sound-ID)", (function(){ var r=vaultRoute("w_cat"); return r && r.mode==="build" && r.w==="cat" && !r.sight; })());
ok("vaultRoute flags a sw_ sight word so it's built letter-by-letter", (function(){ var r=vaultRoute("sw_the"); return r && r.mode==="build" && r.w==="the" && r.sight===true; })());
ok("vaultUnits SPLITS a sight word letter-by-letter ('said' = s,a,i,d — never tokenised as a team)", vaultUnits("said",true).join(",")==="s,a,i,d");
ok("vaultUnits tokenises a non-sight word by GRAPHEME (a digraph is one tile: ship = sh,i,p)", vaultUnits("ship",false).join(",")==="sh,i,p");

grp("ARTICULATORY CUES (#3): the Learn-screen mouth-cue table covers every taught grapheme, skips no-sound magic-e");
ok("MOUTHCUE has a cue for every single letter (the 26)", ORDER.every(function(g){ return !!MOUTHCUE[g]; }));
ok("MOUTHCUE has a cue for every digraph + vowel team (2-char graphemes use the Learn screen too)", DIGRAPHS.concat(VOWELTEAMS).every(function(g){ return !!MOUTHCUE[g]; }));
ok("MOUTHCUE never lists a magic-e unit (those teach via startMagic, not the Learn screen)", MAGICE_UNITS.every(function(u){ return !MOUTHCUE[u]; }));
ok("every MOUTHCUE entry has a mouth-shape id + a kid cue line", Object.keys(MOUTHCUE).every(function(k){ var c=MOUTHCUE[k]; return c && typeof c.shape==="string" && typeof c.say==="string" && c.say.length>0; }));
`;
vm.runInContext(fs.readFileSync(path.join(ROOT, "data-missions.js"), "utf8") + "\n" + fs.readFileSync(path.join(ROOT, "data-content.js"), "utf8") + "\n" + fs.readFileSync(path.join(ROOT, "data-lines.js"), "utf8") + "\n" + fs.readFileSync(path.join(ROOT, "state-save.js"), "utf8") + "\n" + fs.readFileSync(path.join(ROOT, "audio.js"), "utf8") + "\n" + fs.readFileSync(path.join(ROOT, "allies.js"), "utf8") + "\n" + fs.readFileSync(path.join(ROOT, "game.js"), "utf8") + "\n" + fs.readFileSync(path.join(ROOT, "map.js"), "utf8") + "\n" + fs.readFileSync(path.join(ROOT, "sfx.js"), "utf8") + "\n" + fs.readFileSync(path.join(ROOT, "music.js"), "utf8") + "\n" + TEST, ctx, { filename: "game.js" });

const R = ctx.RESULT;
console.log(R.lines.join("\n"));
console.log("\n" + (R.fail === 0 ? "ALL PASS" : R.fail + " FAILED") + " (" + R.pass + " passed, " + R.fail + " failed)");
process.exit(R.fail === 0 ? 0 : 1);
