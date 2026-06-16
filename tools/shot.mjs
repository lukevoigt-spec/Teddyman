#!/usr/bin/env node
/* shot.mjs — screenshot the REAL game in a real browser (run on the local machine).
 *
 *   node tools/shot.mjs                 # default scenes, Chromium
 *   node tools/shot.mjs --webkit        # Safari engine (closest to the iPad)
 *   node tools/shot.mjs title map base  # only these scenes
 *
 * Serves the repo root over http (so the service worker / IndexedDB / fetch behave
 * like production, unlike file://), boots the game, jumps to each screen by calling
 * the game's own global nav fns, and saves PNGs to tools/shots/<scene>.png.
 *
 * Needs: npm install  (in tools/) then  npx playwright install chromium webkit
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// SHOT-1 FIX: Playwright's screenshot races document.fonts.ready (evaluated in a UTILITY context, so a
// page-side stub can't reach it) against the 30s screenshot timeout. WebKit headless never settles that
// promise -> every WebKit shot timed out. This official escape hatch skips Playwright's blocking
// font-wait; we do our own capped wait after load instead (real fonts on Chromium, no hang on WebKit).
process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY = "1";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "tools", "shots");
fs.mkdirSync(OUT, { recursive: true });

// --- tiny static file server rooted at the repo ---
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg", ".ogg": "audio/ogg", ".wav": "audio/wav", ".m4a": "audio/mp4", ".ttf": "font/ttf", ".woff2": "font/woff2" };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.statusCode = 404; return res.end("404"); }
  res.setHeader("Content-Type", MIME[path.extname(file)] || "application/octet-stream");
  fs.createReadStream(file).pipe(res);
});

// scene = how to get there, evaluated in the page after boot
const SCENES = {
  title: `1`,                                  // shown at boot
  map:   `(window.toMap && toMap(), 1)`,
  base:  `(window.paintBase && paintBase(), show('scrBase'), 1)`,
  settings: `(window.openSettings && openSettings(), 1)`,
  hubsettings: `(openSettings(), showSection('tabSettings'), 1)`,
  hubprogress: `(openSettings(), showSection('tabProgress'), 1)`,
  // Memory Vault: seed a due word + a due grapheme, then render a recharge round directly
  // (bypass the intro flow() so the round DOM is present at screenshot time).
  vault: `(function(){ S.mastery={ "w_cat":{seen:5,ok:5,str:5,box:0,due:"2020-01-01"}, t:{seen:5,ok:5,str:5,box:0,due:"2020-01-01"} };
            vaultPlan=vaultDueRoutable(); vaultPos=0; show('scrVault'); vaultStep(); return 1; })()`,
  vaultfull: `(function(){ S.mastery={}; startVault(); return 1; })()`,
  vaultbase: `(function(){ S.mastery={ "w_cat":{seen:5,ok:5,str:5,box:0,due:"2020-01-01"} }; paintBase(); show('scrBase'); return 1; })()`,
  // #3 articulatory cue on the Learn screen — a few distinct mouth shapes
  learn_s: `(startLearn({letter:"s"}), 1)`,
  learn_o: `(startLearn({letter:"o"}), 1)`,
  learn_f: `(startLearn({letter:"f"}), 1)`,
  learn_r: `(startLearn({letter:"r"}), 1)`,
  find:    `(function(){ CUR={id:1}; startFind("a",4); return 1; })()`,
  trace:   `(startTrace("s"), 1)`,
  gate:    `(showParentGate(), 1)`,
  juice:   `(function(){ CUR={id:1}; startFind("a",4); comboPop(8); masteryFlash(); return 1; })()`,
  coinfly: `(function(){ S.coins=5; S.hoard=37; showTrain(); return 1; })()`,
  // Treasure Vault: a near-full coin row, mid-stack — shows the diamond/bar/coin HUD
  vault_hud: `(function(){ S.hoard=149; ensureDaily(); S.daily.secs=380; showTrain(); return 1; })()`,
  train_pop: `(function(){ S.act=2; S.hoard=63; ensureDaily(); S.daily.secs=300; show('scrTrain'); updateTrainHUD(); updateTrainDaily(); var s=trainPop('jj','JJ'); if(s){ var m=s.querySelector('.spkmouth'); if(m)m.style.setProperty('--mouth','1'); } return 1; })()`,
  // the milestone climax burst (crossing a tier on a rep)
  vault_bar: `(function(){ S.hoard=9; show('scrTrain'); updateTrainHUD(); vaultMilestone('bar'); return 1; })()`,
  vault_dia: `(function(){ S.hoard=99; show('scrTrain'); updateTrainHUD(); vaultMilestone('diamond'); return 1; })()`,
  boss:    `(function(){ CUR={id:26,lbl:"Vex Captain"}; startBoss("s"); return 1; })()`,
  shop:    `(function(){ S.coins=120; openShop(); return 1; })()`,
  win:     `(function(){ CUR=(typeof MISSIONS!=="undefined"&&MISSIONS.find(function(x){return x.type==="learn";}))||{id:1,lbl:"Letter S"}; showWin(false); return 1; })()`,
  read:    `(function(){ CUR={id:5}; readWords=["cat"]; readIx=0; readGoal=1; readMiss=0; show('scrRead'); nextRead(); return 1; })()`,
  // Act-2 r-controlled + Big Words (new code paths) — drive the handlers directly to surface any error
  rctrl_learn: `(function(){ S.act=2; CUR={id:150}; startLearn({letter:"ar"}); return 1; })()`,
  rctrl_forge: `(function(){ S.act=2; S.done={}; RCONTROLLED.forEach(function(g){S.done[RCONTROLLED_MISSION[g]]=true;}); CUR={id:157}; startForge({id:157,type:"forge",words:["her","bird","fur","girl"]}); forgeWord(); return 1; })()`,
  bigword: `(function(){ S.act=2; CUR={id:160}; startSyllable({id:160,type:"syllable",words:["sunset","cobweb"]}); sylStep(); return 1; })()`,
  bigchop: `(function(){ S.act=2; CUR={id:160}; startSyllable({id:160,type:"syllable",words:["sunset"]}); sylStep(); chopWord("sunset"); return 1; })()`,
  affixchop: `(function(){ S.act=2; CUR={id:170}; startSyllable({id:170,type:"affix",words:["unlock"]}); sylStep(); chopWord("unlock"); return 1; })()`,
  picons:  `(function(){ var words=(arguments,Object.keys(PICONS)); show('scrRead'); document.getElementById('readWord').innerHTML=''; document.querySelector('.bubble#readText').style.display='none'; var cr=document.getElementById('readChoices'); cr.style.flexWrap='wrap'; cr.style.maxWidth='900px'; cr.innerHTML=''; words.forEach(function(o){ var wrap=document.createElement('div'); wrap.style.cssText='display:flex;flex-direction:column;align-items:center;'; var b=document.createElement('div'); b.className='tile picktile'; b.style.cssText='font-size:46px;width:78px;height:78px;'; b.innerHTML=picIcon(o,''); var l=document.createElement('div'); l.textContent=o; l.style.cssText='color:#fff;font-size:12px;font-family:sans-serif;'; wrap.appendChild(b); wrap.appendChild(l); cr.appendChild(wrap); }); return 1; })()`,
  scanintro: `(function(){ show('scrScan'); narrate('scan',document.getElementById('scanText'),['scan_intro']); clearFlow(); return 1; })()`,
  menu: `(function(){ toMap(); document.getElementById('navMenu').classList.add('on'); return 1; })()`,
  chests: `(function(){ S.chests={wood:2,silver:1,gold:1}; S.coins=40; [1,3].forEach(function(i){S.done[i]=true;}); paintBase(); show('scrBase'); return 1; })()`,
  rankbar: `(function(){ show('scrBase'); paintBase(); var pf=document.getElementById('powerFill'); if(pf)pf.style.width='62%'; document.getElementById('powerLbl').textContent='SUPER HERO'; return 1; })()`,
  basefull:`(function(){ [1,3,4,6,8].forEach(function(i){S.done[i]=true;}); S.coins=40; S.owned={banner:1}; paintBase(); show('scrBase'); return 1; })()`,
  // cast cohesion check: full-body rasters of existing allies next to the cousins (Cal/Nora)
  cast: `(function(){ document.body.innerHTML='<div id="cz" style="display:flex;gap:18px;align-items:flex-end;justify-content:center;background:#241a3e;padding:48px 24px;height:100%;box-sizing:border-box;"></div>'; var k=[['tank','Archie'],['flip','Ellie'],['cal','Cal'],['nora','Nora']]; document.getElementById('cz').innerHTML=k.map(function(p){return '<div style="text-align:center;">'+allyBody(p[0],210)+'<div style="color:#fff;font-family:sans-serif;font-size:15px;margin-top:6px;">'+p[1]+'</div></div>';}).join(''); return 1; })()`,
};

const args = process.argv.slice(2);
const engine = args.includes("--webkit") ? "webkit" : "chromium";
const wanted = args.filter(a => !a.startsWith("--"));
const scenes = wanted.length ? wanted : Object.keys(SCENES);

const pw = await import("playwright");
const browser = await pw[engine].launch();

await new Promise(r => server.listen(0, r));
const port = server.address().port;
const base = `http://localhost:${port}/index.html`;

// Block the service worker: the game's network-first SW intercepts fetches (incl. the Google-Fonts
// request), which bypasses page.route() — so font interception never applied and fonts.ready hung.
// A render harness wants the raw site anyway (no SW caching/staleness). (SHOT-1)
// Block the service worker: the game's network-first SW intercepts fetches (incl. Google-Fonts), which
// bypasses page.route() AND was the real source of the WebKit font-wait hang (the SW stalled the font
// fetch). A render harness wants the raw site anyway. With the SW gone, WebKit loads the fonts directly
// and document.fonts.ready settles, so the screenshot no longer times out. (SHOT-1)
const context = await browser.newContext({ viewport: { width: 1024, height: 768 }, deviceScaleFactor: 2, serviceWorkers: "block" });
const page = await context.newPage();
page.on("pageerror", e => console.log("  page error:", e.message));
// domcontentloaded, NOT load/networkidle: the PWA never goes idle and `load`
// can stall on the Google-Fonts CDN (esp. WebKit) past the timeout.
await page.goto(base, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000); // let boot, fonts + first paint settle
// our OWN capped font-ready wait (replaces Playwright's uncapped one): Chromium resolves fast and keeps
// real fonts; WebKit's never-resolving fonts.ready hits the cap and proceeds (system-font fallback).
await page.evaluate(() => Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 3000))])).catch(() => {});

for (const s of scenes) {
  const setup = SCENES[s];
  if (!setup) { console.log("  (unknown scene:", s, "- skipping)"); continue; }
  try {
    await page.evaluate(setup);
    await page.waitForTimeout(700);
    const out = path.join(OUT, `${engine}-${s}.png`);
    await page.screenshot({ path: out });
    console.log("wrote", out);
  } catch (e) { console.log("  failed scene", s, "->", e.message); }
}

await browser.close();
server.close();
console.log("done");
