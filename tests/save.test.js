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

grp("reset / Level-0 is NOT resurrected by a stale backup on reload (QA #2)");
clearStore();
S = fresh(); S.done = {0:true,1:true,3:true}; save();            // real progress -> primary + backup
S = fresh(); save(); clearBackup();                              // intentional reset: empty primary, backup dropped
ok("reset+clearBackup removes the backup", __store["heroTeddySave_v1_bak"]===undefined);
ok("load() after a reset returns a FRESH save (old progress not resurrected)", Object.keys(load().done||{}).length===0);
clearStore();
S = fresh(); S.done = {0:true,1:true}; save();                   // progress mirrored to primary + backup
S = fresh(); save();                                             // the OLD buggy path: reset without clearBackup
ok("WITHOUT clearBackup the stale backup out-scores the empty primary (the bug clearBackup fixes)", Object.keys(load().done||{}).length>0);

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

grp("profiles: default + isolation + parent-only removal");
ok("profiles seed [teddy]", profiles().length>=1 && profiles().some(p=>p.id==="teddy"));
ok("teddy keeps the legacy save key", keyFor("teddy")==="heroTeddySave_v1");
ok("other players are namespaced", keyFor("p1")==="heroTeddySave_v1::p1");
var pid = addProfile("Tester");
ok("addProfile adds a player", profiles().some(p=>p.id===pid && p.name==="Tester"));
applyProfile(pid); S = fresh(); S.done = {0:true}; save();         // give the new player some progress
applyProfile("teddy"); S = fresh(); S.done = {0:true,1:true,3:true,5:true}; save();
ok("each player has its own save key", __store["heroTeddySave_v1"] && __store["heroTeddySave_v1::"+pid]);
applyProfile(pid); var pl = load();
ok("players are isolated (new player not Teddy's progress)", Object.keys(pl.done).length===1);
applyProfile("teddy");
ok("removeProfile refuses to delete default teddy", removeProfile("teddy")===false);
ok("removeProfile deletes a real player's save", removeProfile(pid)===true && !__store["heroTeddySave_v1::"+pid]);

grp("daily metrics: day-boundary rollover (QA #4)");
applyProfile("teddy"); S=fresh();
ensureDaily();                                  // initialise today's bucket
S.daily.day="2000-01-01"; S.daily.secs=123; S.daily.missions=4; S.daily.trainSecs=40;  // pretend it's an old day
ensureDaily();                                  // crossing into "today" should archive + reset
ok("rollover resets daily.day to today", S.daily.day===dayKey());
ok("rollover zeroes today's counters", S.daily.secs===0 && S.daily.missions===0 && S.daily.trainSecs===0);
ok("rollover archives yesterday's seconds into history", S.history && S.history["2000-01-01"]===123);
ok("training time is a SUBSET of total (no double-count)", (function(){ S.daily.secs=10; S.daily.trainSecs=4; return S.daily.trainSecs<=S.daily.secs; })());

grp("security: profile names are escaped before any innerHTML use (QA #1)");
ok("escHTML(profileName) neutralises an injected name", (function(){
  var bad=addProfile('<img src=x onerror=alert(1)>'); applyProfile("teddy");
  var s=escHTML(profileName(bad)); removeProfile(bad);
  return s.indexOf("<")<0 && s.indexOf(">")<0; })());

grp("cloud auth: sync requires the parent-entered family code, keyed to an unguessable slot (QA #1)");
applyProfile("teddy");
cloudOff();
ok("no family code => cloud is INACTIVE (fail closed, no endpoint)", cloudEndpoint()===null);
cloudConnect("fam-code-123");
ok("with a code, cloudEndpoint is active and keyed by an UNGUESSABLE hashed slot (not ?k=teddy)",
  (function(){ var e=cloudEndpoint()||""; return e.indexOf("?k=p")>0 && e.indexOf("?k=teddy")<0; })());
ok("cloudKey() derives from the family code + player, never the bare profile id",
  cloudKey()==="p"+__cloudHash("fam-code-123::teddy") && cloudKey()!=="teddy");
ok("__cloudHash is deterministic and input-sensitive (stable, distinct slot per code)",
  __cloudHash("pass::teddy")===__cloudHash("pass::teddy") && __cloudHash("pass::teddy")!==__cloudHash("other::teddy"));
cloudOff();
ok("turning sync off clears the code => inactive again", cloudEndpoint()===null);

grp("cloud sync OFF survives reload via the 'off' sentinel (QA #4)");
ok("'off' sentinel resolves to disabled/empty (not the baked default)", resolveCloudURL("off")==="");
ok("unset/empty resolves to the baked DEFAULT_CLOUD_URL", resolveCloudURL("")===DEFAULT_CLOUD_URL);
ok("a custom URL is preserved as-is", resolveCloudURL("https://x.workers.dev")==="https://x.workers.dev");

grp("PACING-SPREAD grandfather plumbing (P1): durable gear/friends survive a future id re-map, no regression");
// A mid-Act-1 save: belt(m1) boots(m3) hammer(m4) sword(m8) earned; tank(m3) flip(m6) sunny(m8) freed.
S=fresh(); S.act=1; [1,3,4,6,8].forEach(function(id){ S.done[id]=true; });
ok("allyMid resolves EVERY league kind incl. leighton/kendall (was -1 before)", allyMid("tank")===3 && allyMid("leighton")===48 && allyMid("kendall")===128);
delete S.freed; delete S.gearByAct;   // OLD-save shape (pre-plumbing): the durable fields are absent
var seeded=grandfather();
ok("grandfather() seeds the durable records on an old save (absence is the trigger)", seeded===true && !!S.freed && !!S.gearByAct);
ok("…S.freed seeded from completed rescue missions (tank@3, flip@6, sunny@8)", S.freed.tank===true && S.freed.flip===true && S.freed.sunny===true);
ok("…S.gearByAct[1] seeded from GEAR_AT∩done (belt/boots/hammer/sword)", S.gearByAct[1].indexOf("Power Belt")>=0 && S.gearByAct[1].indexOf("Gem Sword")>=0 && S.gearByAct[1].indexOf("Rocket Boots")>=0 && S.gearByAct[1].indexOf("Word Hammer")>=0);
ok("NO REGRESSION: right after seeding, actGearList(1) == the derived set (union adds nothing yet)", (function(){ var g=actGearList(1); return g.indexOf("Power Belt")>=0 && g.indexOf("Gem Sword")>=0 && g.indexOf("Rocket Boots")>=0 && g.indexOf("Word Hammer")>=0; })());
ok("NO REGRESSION: every already-freed friend still reads freed after seeding", allyFreed("tank") && allyFreed("flip") && allyFreed("sunny"));
// Simulate a FUTURE re-map (P2/P3): the gear/rescue missions move to ids this save hasn't completed → clear done.
S.done={};
ok("GRANDFATHER (gear): a re-map can't un-equip earned gear — the durable union still returns it", (function(){ var g=actGearList(1); return g.indexOf("Power Belt")>=0 && g.indexOf("Gem Sword")>=0 && g.indexOf("Rocket Boots")>=0 && g.indexOf("Word Hammer")>=0; })());
ok("GRANDFATHER (friends): a re-map can't un-free a friend — allyFreed stays true via S.freed", allyFreed("tank") && allyFreed("flip") && allyFreed("sunny"));
ok("grandfather is IDEMPOTENT (returns false once seeded — a re-map's cleared done can't wipe the stamp)", grandfather()===false && S.freed.tank===true && S.gearByAct[1].indexOf("Gem Sword")>=0);
ok("durable gear is ACT-SCOPED: Act-1 Gem Sword never leaks into Act 2's arsenal (names repeat across acts)", actGearList(2).indexOf("Gem Sword")<0);
ok("a FRESH save already has the durable fields, so grandfather() is a no-op", (function(){ S=fresh(); return grandfather()===false; })());

grp("MEMORY VAULT scheduler (rec #1): expanding-interval spaced review, save-safe + deterministic");
ok("addDays does pure date math across month/year boundaries", addDays("2026-06-14",1)==="2026-06-15" && addDays("2026-06-30",1)==="2026-07-01" && addDays("2026-12-31",1)==="2027-01-01");
ok("addDays tolerates odd input without throwing", typeof addDays("",3)==="string" && typeof addDays(null,0)==="string");
ok("hasSoundClip: true for letters/digraphs/teams, FALSE for magic-e units (no snd_ clip → must review as WORDS)", hasSoundClip("s") && hasSoundClip("sh") && hasSoundClip("ai") && !hasSoundClip("a_e") && !hasSoundClip("i_e"));
// migrate must stay additive: it NEVER injects box/due into an existing record (constraint #7)
(function(){ var mg=migrate({v:1, mastery:{ s:{seen:3,ok:2,str:2} }, done:{}});
  ok("migrate leaves old {seen,ok,str} records untouched (no box/due injected)", mg.mastery.s.box===undefined && mg.mastery.s.due===undefined && mg.mastery.s.seen===3);
  var rt=JSON.parse(JSON.stringify({v:1, mastery:{ s:{seen:5,ok:5,str:4,box:2,due:"2026-06-20",last:"2026-06-13"} }}));
  ok("box/due/last round-trip through JSON (save + cloud carry them inside S)", rt.mastery.s.box===2 && rt.mastery.s.due==="2026-06-20"); })();
// deterministic schedule via an injected dayKey (dayKey is a reassignable fn decl in this scope)
var __realDayKey=dayKey, __day="2026-06-14"; dayKey=function(){ return __day; };
S=fresh();
S.mastery["s"]={seen:2,ok:2,str:2}; vaultTouch("s",true);
ok("vaultTouch does NOT enroll an item that isn't mastered yet", S.mastery["s"].box==null);
S.mastery["s"]={seen:5,ok:5,str:4}; vaultTouch("s",true);
ok("enroll on first mastery: box 0, due one interval out, last=today", S.mastery["s"].box===0 && S.mastery["s"].due==="2026-06-15" && S.mastery["s"].last==="2026-06-14");
vaultTouch("s",true);
ok("an early (not-yet-due) touch does NOT advance the box/interval (spacing is day-based, not rep-based)", S.mastery["s"].box===0 && S.mastery["s"].due==="2026-06-15");
__day="2026-06-15"; vaultTouch("s",true);
ok("a DUE correct review promotes: box 1, due +3 days", S.mastery["s"].box===1 && S.mastery["s"].due==="2026-06-18");
vaultReview("s",false);
ok("vaultReview miss demotes ONE step (box 1→0) and pulls due in (gentler than a reset)", S.mastery["s"].box===0 && S.mastery["s"].due===addDays("2026-06-15",1));
S.mastery["s"].box=VAULT_MAXBOX; vaultReview("s",true);
ok("box never exceeds VAULT_MAXBOX", S.mastery["s"].box===VAULT_MAXBOX);
// demote-OUT: a miss that drops the item below mastery leaves the Vault entirely
S.mastery["t"]={seen:5,ok:3,str:0, box:0, due:"2026-06-15"};   // enrolled but now below mastery (acc .6, str 0)
vaultTouch("t",false);
ok("demote-OUT: a miss below mastery clears box/due so it rejoins the active pools", S.mastery["t"].box==null && S.mastery["t"].due==null);
// vaultDue: only due+mastered, capped at VAULT_CAP, oldest-due first
S=fresh(); __day="2026-06-20";
["a","b","c","d","e","f","g","h"].forEach(function(k,i){ S.mastery[k]={seen:5,ok:5,str:4, box:0, due:addDays("2026-06-10", i)}; });
(function(){ var due=vaultDue();
  ok("vaultDue caps at VAULT_CAP items", due.length===VAULT_CAP);
  ok("vaultDue returns oldest-due first", due[0]==="a" && due[1]==="b"); })();
S.mastery["z"]={seen:5,ok:5,str:4, box:0, due:"2026-07-01"};
ok("vaultDue excludes items not yet due", vaultDue().indexOf("z")<0);
S.mastery["a"].str=0;
ok("vaultDue excludes an enrolled item that fell below mastery", vaultDue().indexOf("a")<0);
ok("vaultCount counts ALL enrolled + still-mastered items (uncapped, not due-filtered)", vaultCount()===8);   // b..h (7) + z (1); a dropped below mastery

grp("MASTERY-THRESHOLD tune (#4): proficient (in-session, gates finales) vs retained (spaced-correct, drives ✦)");
S=fresh(); __day="2026-06-14";
ok("PROFICIENT bar bumped: seen4 no longer counts (needs seen>=5)", (function(){ S.mastery["p"]={seen:4,ok:4,str:4}; return !masteredItem("p"); })());
ok("…seen5 + acc>=0.8 + str>=4 IS proficient", (function(){ S.mastery["p"]={seen:5,ok:4,str:4}; return masteredItem("p"); })());   // acc .8
ok("…acc below 0.8 is NOT proficient (seen5, 3/5=.6)", (function(){ S.mastery["p"]={seen:5,ok:3,str:4}; return !masteredItem("p"); })());
ok("RETAINED needs proficient AND okDayCount>=2 (1 day = not yet retained)", (function(){ S.mastery["p"]={seen:5,ok:5,str:4,okDayCount:1}; return masteredItem("p") && !retainedItem("p"); })());
ok("…okDayCount>=2 on a proficient item IS retained", (function(){ S.mastery["p"].okDayCount=2; return retainedItem("p"); })());
ok("…a high okDayCount on a NON-proficient item is NOT retained (retained requires proficient)", (function(){ S.mastery["p"]={seen:2,ok:2,str:2,okDayCount:9}; return !retainedItem("p"); })());
// record() counts correct-days once per NEW calendar day (the spaced-correct signal), never same-day repeats
S=fresh(); __day="2026-06-14"; record("x",true);
ok("record(): first correct sets okDayCount=1 + lastOkDay=today", S.mastery["x"].okDayCount===1 && S.mastery["x"].lastOkDay==="2026-06-14");
record("x",true); record("x",true);
ok("…same-day repeats do NOT bump okDayCount (spacing is day-based)", S.mastery["x"].okDayCount===1);
__day="2026-06-15"; record("x",true);
ok("…a correct on a NEW day bumps okDayCount to 2", S.mastery["x"].okDayCount===2 && S.mastery["x"].lastOkDay==="2026-06-15");
record("x",false);
ok("…a MISS never bumps okDayCount (only correct days count)", S.mastery["x"].okDayCount===2);
// migrate() grandfathers an old proficient item so its ✦ gold survives — but never auto-promotes new/partial items
(function(){ var mg=migrate({v:1, mastery:{ a:{seen:6,ok:6,str:5}, b:{seen:2,ok:1,str:1}, c:{seen:5,ok:5,str:4,okDayCount:1} }, done:{}});
  ok("migrate grandfathers an already-proficient item to okDayCount=2 (✦ won't vanish on load)", mg.mastery.a.okDayCount===2);
  ok("migrate leaves a NON-proficient item's okDayCount unset (no false ✦)", mg.mastery.b.okDayCount===undefined);
  ok("migrate does NOT re-bump an item that already has okDayCount (real spaced progress is preserved)", mg.mastery.c.okDayCount===1); })();
dayKey=__realDayKey; S=fresh();

grp("ARTICULATORY CUE renderer (#3): mouthCue() returns an SVG for every shape the table uses");
ok("mouthCue renders an <svg> for every distinct mouth shape in MOUTHCUE", (function(){ var seen={}; for(var k in MOUTHCUE)seen[MOUTHCUE[k].shape]=1;
  return Object.keys(seen).every(function(s){ var svg=mouthCue(s,60); return typeof svg==="string" && svg.indexOf("<svg")===0 && svg.indexOf("</svg>")>0; }); })());

grp("TREASURE CHESTS (§10): migrate-safe + a chest is NEVER empty + no duplicate cosmetic");
(function(){ var mg=migrate({v:1,done:{},mastery:{}});
  ok("migrate adds chests {wood,silver,gold}=0 + repTick=0 + chestDay='' to an old save", mg.chests.wood===0 && mg.chests.silver===0 && mg.chests.gold===0 && mg.repTick===0 && mg.chestDay===""); })();
ok("migrate repairs a partial/garbage chests object (no crash, all numbers >=0)", (function(){ var g=migrate({v:1,chests:{wood:-3,silver:"x"},done:{},mastery:{}}); return g.chests.wood===0 && g.chests.silver===0 && g.chests.gold===0; })());
S=fresh(); S.chests.gold=1; S.coins=0; S.owned={};
openChest("gold");
ok("openChest('gold') always pays coins >= tier.coinMin (never empty)", S.coins>=CHESTS.gold.coinMin);
ok("openChest decrements the opened tier", S.chests.gold===0);
ok("a gold chest (cosmeticChance 1) grants a NEW un-owned cosmetic", (function(){ S=fresh(); S.owned={banner:true}; S.chests.gold=1; var n0=Object.keys(S.owned).length; openChest("gold"); return Object.keys(S.owned).length===n0+1 && S.owned.banner===true; })());
ok("all-cosmetics-owned chest still pays coins (no dud)", (function(){ S=fresh(); BASE_ITEMS.forEach(function(it){S.owned[it.id]=true;}); S.chests.wood=1; S.coins=0; openChest("wood"); return S.coins>0; })());
ok("opening with no pending chest is a safe no-op", (function(){ S=fresh(); var c=S.coins; openChest("gold"); return S.coins===c && S.chests.gold===0; })());

grp("CLOUD-1: a wrong family code is flagged + cleared, never cached behind a false 'Connected ✓'");
// cloudPull's 401 path is async; run it in a promise the host awaits before reporting (ctx.setTimeout is a stub).
__pending = (async function(){
  var realFetch = fetch;
  try{
    // (a) a 401 (wrong code) → cloudPull still resolves FALSE (so callers' if(changed) never bogus-repaints)
    //     AND records the distinct auth failure. Arm state directly to avoid cloudConnect's own async clear.
    fetch = function(){ return Promise.resolve({ ok:false, status:401, text:function(){ return Promise.resolve("x"); } }); };
    cloudOff(); cloudSecret="wrong-code"; cloudURL=DEFAULT_CLOUD_URL;   // active endpoint + a bad secret
    var pulled = await cloudPull();
    ok("cloudPull resolves FALSE on a 401 (no bogus 'changed' repaint for boot/switch callers)", pulled===false, pulled);
    ok("cloudPull records the 401 as a distinct auth failure (not offline/no-data)", __lastAuthFail===true);
    // (b) cloudConnect with a wrong code CLEARS the cached secret + leaves sync inactive (was: cached + 'Connected ✓')
    cloudOff(); cloudConnect("still-wrong");
    for(var i=0;i<8;i++) await Promise.resolve();   // flush cloudConnect's pull().then() microtasks
    ok("a wrong family code is NOT cached (secret cleared, sync inactive after connect)", cloudSecret==="" && cloudEndpoint()===null, {cloudSecret:cloudSecret});
    // (c) a benign offline error is NOT mistaken for an auth failure (so a correct code isn't wrongly cleared)
    fetch = function(){ return Promise.reject(new Error("offline")); };
    cloudOff(); cloudSecret="right-code"; cloudURL=DEFAULT_CLOUD_URL;
    await cloudPull();
    ok("an offline fetch error is never flagged as an auth failure", __lastAuthFail===false);
  } finally { fetch = realFetch; cloudOff(); }
})();
`;
vm.runInContext(fs.readFileSync(path.join(ROOT, "data-missions.js"), "utf8") + "\n" + fs.readFileSync(path.join(ROOT, "data-content.js"), "utf8") + "\n" + fs.readFileSync(path.join(ROOT, "data-lines.js"), "utf8") + "\n" + fs.readFileSync(path.join(ROOT, "state-save.js"), "utf8") + "\n" + fs.readFileSync(path.join(ROOT, "audio.js"), "utf8") + "\n" + fs.readFileSync(path.join(ROOT, "allies.js"), "utf8") + "\n" + fs.readFileSync(path.join(ROOT, "game.js"), "utf8") + "\n" + fs.readFileSync(path.join(ROOT, "map.js"), "utf8") + "\n" + fs.readFileSync(path.join(ROOT, "sfx.js"), "utf8") + "\n" + fs.readFileSync(path.join(ROOT, "music.js"), "utf8") + "\n" + TEST, ctx, { filename: "game.js" });

(async () => {
  // await any async assertions (CLOUD-1's 401 path) queued on ctx.__pending before reporting
  if (ctx.__pending) { try { await ctx.__pending; } catch (e) { ctx.RESULT.fail++; ctx.RESULT.lines.push("  XX  async cloud test threw  -> " + e.message); } }
  const R = ctx.RESULT;
  console.log(R.lines.join("\n"));
  console.log("\n" + (R.fail === 0 ? "ALL PASS" : R.fail + " FAILED") + " (" + R.pass + " passed, " + R.fail + " failed)");
  process.exit(R.fail === 0 ? 0 : 1);
})();
