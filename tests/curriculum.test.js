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

grp("security: parent-entered profile-name escaping");
ok("escHTML neutralises <, >, \\" and '",
  (function(){ var s=escHTML("<img src=x onerror=1>\\"'"); return s.indexOf("<")<0 && s.indexOf(">")<0 && s.indexOf('"')<0 && s.indexOf("'")<0; })());

grp("anti-gaming: sound-ID prompt never reveals the target (CLAUDE.md #4)");
(function(){ try{
  S.done[0]=true; S.done[1]=true; S.done[3]=true;   // s, a, t taught
  function findPrompt(g){ startFind(g,4,["s","a","t"],function(){}); return $("findText").querySelector("span").textContent || ""; }
  var p1=findPrompt("s"), p2=findPrompt("a");
  ok("find prompt is target-INDEPENDENT (same text for different sounds)", p1.length>0 && p1===p2, {p1:p1,p2:p2});
}catch(e){ ok("anti-gaming find prompt is testable", false, String(e)); } })();
S.done={};
`;
vm.runInContext(fs.readFileSync(path.join(ROOT, "game.js"), "utf8") + "\n" + TEST, ctx, { filename: "game.js" });

const R = ctx.RESULT;
console.log(R.lines.join("\n"));
console.log("\n" + (R.fail === 0 ? "ALL PASS" : R.fail + " FAILED") + " (" + R.pass + " passed, " + R.fail + " failed)");
process.exit(R.fail === 0 ? 0 : 1);
