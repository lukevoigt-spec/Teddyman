/* =========================================================
   Super Teddy — save-system regression tests (no deps).
   Run:  node tests/save.test.js   (exit 0 = pass, 1 = fail)

   Teddy's progress is the one thing we must never lose, so this guards the save
   layer: migrate() on old/partial/corrupt saves, primary+backup recovery, the
   "never clobber a good backup" rule, the snapshot ring, and a round-trip.

   game.js keeps state in a module-scoped `let S`, so the assertions run in the
   SAME lexical scope (appended to the source) rather than importing it.
========================================================= */
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.join(__dirname, "..");

/* ---- minimal browser stub ---- */
const store = {};
const ls = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };
const noop = () => {};
function mkEl() {
  const b = { style: { setProperty: noop }, _html: "", classList: { _s: new Set(), add(...a){a.forEach(x=>this._s.add(x));}, remove(...a){a.forEach(x=>this._s.delete(x));}, contains(x){return this._s.has(x);}, toggle: noop },
    appendChild(c){this.children.push(c);}, removeChild: noop, remove: noop, setAttribute: noop, addEventListener: noop,
    querySelector(){return mkEl();}, querySelectorAll(){return this.children;}, textContent: "", value: "0", focus: noop,
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
  alert: noop, confirm: () => true, prompt: () => null, btoa: s => Buffer.from(s).toString("base64"), atob: s => Buffer.from(s, "base64").toString(), __store: store };
ctx.Image = function(){ return { set src(v){ if (this.onerror) this.onerror(); }, onload: null, onerror: null }; };
ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, "art.js"), "utf8"), ctx);

/* assertions run appended to game.js so they share scope with `S`, migrate(), … */
const TEST = `
RESULT = { pass: 0, fail: 0, lines: [] };
function ok(name, cond){ if(cond){RESULT.pass++; RESULT.lines.push("  ok  "+name);} else {RESULT.fail++; RESULT.lines.push("  XX  "+name);} }
function grp(s){ RESULT.lines.push("\\n• "+s); }
function vsave(doneIds, extra){ return Object.assign({ v:1, act:1, ts:100, intro:true, scan:true,
  done:Object.fromEntries(doneIds.map(i=>[i,true])), mastery:{}, stars:9, coins:5, owned:{},
  gear:[], equip:{weapon:"none",cape:"red"}, session:{count:0,day:"",rest:false} }, extra||{}); }
function clearStore(){ for(var k in __store) delete __store[k]; }

grp("migrate() never throws; repairs old/partial saves");
ok("null -> null", migrate(null)===null);
ok("non-object -> null", migrate("nope")===null);
ok("wrong version -> null", migrate({v:2})===null);
var legacy = migrate({v:1});
ok("legacy minimal repaired", legacy && typeof legacy.done==="object" && Array.isArray(legacy.gear));
ok("missing session filled", legacy.session && legacy.session.day==="");
ok("missing equip filled", legacy.equip && legacy.equip.weapon==="none");
ok("missing coins/owned filled", legacy.coins===0 && typeof legacy.owned==="object");
var partial = migrate({v:1, done:{0:true}, equip:{weapon:"sword"}});
ok("partial keeps real progress", partial.done[0]===true && partial.equip.weapon==="sword");

grp("load() recovers from a damaged primary via the backup");
clearStore();
__store["heroTeddySave_v1"] = "{ corrupt json";
__store["heroTeddySave_v1_bak"] = JSON.stringify(vsave([0,1,3]));
ok("rebuilt from backup (3 done)", Object.keys(load().done).length===3);

grp("load() takes whichever copy has MORE progress");
clearStore();
__store["heroTeddySave_v1"] = JSON.stringify(vsave([], {ts:999}));
__store["heroTeddySave_v1_bak"] = JSON.stringify(vsave([0,1], {ts:10}));
ok("real-progress backup beats empty newer primary", Object.keys(load().done).length===2);

grp("save() never clobbers a good backup with an empty state");
clearStore();
S = fresh(); save();
ok("fresh/empty save writes NO backup", __store["heroTeddySave_v1_bak"]===undefined);
S.done = {0:true}; save();
ok("save WITH progress writes the backup", __store["heroTeddySave_v1_bak"]!==undefined);

grp("snapshot ring is capped at 6");
clearStore();
S = fresh();
for(var i=0;i<8;i++) snapshot("snap"+i);
ok("ring keeps at most 6", snapshots().length===6);
ok("snapshots carry label + data", !!(snapshots()[0].label!==undefined && snapshots()[0].data));

grp("round-trip: save -> load preserves done / coins / owned");
clearStore();
S = fresh(); S.done = {0:true,1:true,3:true}; S.coins = 42; S.owned = {trophy:true}; S.intro = true; save();
var back = load();
ok("done preserved", Object.keys(back.done).length===3);
ok("coins preserved", back.coins===42);
ok("owned preserved", back.owned.trophy===true);
`;
vm.runInContext(fs.readFileSync(path.join(ROOT, "game.js"), "utf8") + "\n" + TEST, ctx, { filename: "game.js" });

const R = ctx.RESULT;
console.log(R.lines.join("\n"));
console.log("\n" + (R.fail === 0 ? "ALL PASS" : R.fail + " FAILED") + " (" + R.pass + " passed, " + R.fail + " failed)");
process.exit(R.fail === 0 ? 0 : 1);
