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
  coinfly: `(function(){ S.coins=5; showTrain(); var c=document.getElementById('trainCoins'); c.textContent='5'; flyReward(document.getElementById('btnTrainBack'), c, 6); return 1; })()`,
  boss:    `(function(){ CUR={id:26,lbl:"Vex Captain"}; startBoss("s"); return 1; })()`,
  shop:    `(function(){ S.coins=120; openShop(); return 1; })()`,
  win:     `(function(){ CUR=(typeof MISSIONS!=="undefined"&&MISSIONS.find(function(x){return x.type==="learn";}))||{id:1,lbl:"Letter S"}; showWin(false); return 1; })()`,
  read:    `(function(){ CUR={id:5}; readWords=["cat"]; readIx=0; readGoal=1; readMiss=0; show('scrRead'); nextRead(); return 1; })()`,
  picons:  `(function(){ var words=(arguments,Object.keys(PICONS)); show('scrRead'); document.getElementById('readWord').innerHTML=''; document.querySelector('.bubble#readText').style.display='none'; var cr=document.getElementById('readChoices'); cr.style.flexWrap='wrap'; cr.style.maxWidth='900px'; cr.innerHTML=''; words.forEach(function(o){ var wrap=document.createElement('div'); wrap.style.cssText='display:flex;flex-direction:column;align-items:center;'; var b=document.createElement('div'); b.className='tile picktile'; b.style.cssText='font-size:46px;width:78px;height:78px;'; b.innerHTML=picIcon(o,''); var l=document.createElement('div'); l.textContent=o; l.style.cssText='color:#fff;font-size:12px;font-family:sans-serif;'; wrap.appendChild(b); wrap.appendChild(l); cr.appendChild(wrap); }); return 1; })()`,
  scanintro: `(function(){ show('scrScan'); narrate('scan',document.getElementById('scanText'),['scan_intro']); clearFlow(); return 1; })()`,
  menu: `(function(){ toMap(); document.getElementById('navMenu').classList.add('on'); return 1; })()`,
  chests: `(function(){ S.chests={wood:2,silver:1,gold:1}; S.coins=40; [1,3].forEach(function(i){S.done[i]=true;}); paintBase(); show('scrBase'); return 1; })()`,
  rankbar: `(function(){ show('scrBase'); paintBase(); var pf=document.getElementById('powerFill'); if(pf)pf.style.width='62%'; document.getElementById('powerLbl').textContent='SUPER HERO'; return 1; })()`,
  basefull:`(function(){ [1,3,4,6,8].forEach(function(i){S.done[i]=true;}); S.coins=40; S.owned={banner:1}; paintBase(); show('scrBase'); return 1; })()`,
  // rich Hero Room: friends freed, villains beaten, full weapon rack, gems earned, pending chest + due recharge + placed decor
  roomrich:`(function(){ [0,1,3,5,6,7,9,10,12,14,15,16,18,19,21,23,24,25,26,48].forEach(function(i){S.done[i]=true;});
      S.freed={tank:1,flip:1,sunny:1,heart:1,leighton:1}; S.gearByAct={1:["Word Hammer","Gem Sword","Gem Gauntlet","Reading Crown"]};
      S.coins=88; S.chests={wood:1,silver:1,gold:0}; S.owned={banner:1,plant:1,trophy:1,lamp:1}; S.decor={s0:"banner",s2:"lamp"};
      S.mastery={"w_cat":{seen:5,ok:5,str:5,box:0,due:"2020-01-01"}}; S.equip={weapon:"sword",cape:"gold"};
      paintBase(); show('scrBase'); return 1; })()`,
  roomgems:`(function(){ [0,1,3,5,6,7,9,10,12,14,15].forEach(function(i){S.done[i]=true;}); paintBase(); show('scrBase'); openGemColl(); return 1; })()`,
  roomdecor:`(function(){ S.coins=40; S.owned={banner:1,plant:1,lamp:1}; paintBase(); show('scrBase'); openDecorPicker(1); return 1; })()`,
  roomact2:`(function(){ S.act=2; [100,101,102,103,104,105,106,107,108,109,110,128].forEach(function(i){S.done[i]=true;});
      S.freed={kendall:1}; S.gearByAct={2:["Gem Sword","Power Belt"]}; S.equip={weapon:"mace",cape:"red"};
      [0,1,3,5,6,7].forEach(function(i){S.done[i]=true;}); paintBase(); show('scrBase'); return 1; })()`,
  trainbg:`(function(){ showTrain(); return 1; })()`,
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

const page = await browser.newPage({ viewport: { width: 1024, height: 768}, deviceScaleFactor: 2 });
// WebKit headless hangs the screenshot's font-wait on the Google-Fonts CDN; abort it
// (parity shots fall back to system fonts — fine for layout/art checks). Chromium keeps real fonts.
if (engine === "webkit") await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
page.on("pageerror", e => console.log("  page error:", e.message));
// domcontentloaded, NOT load/networkidle: the PWA never goes idle and `load`
// can stall on the Google-Fonts CDN (esp. WebKit) past the timeout.
await page.goto(base, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000); // let boot, fonts + first paint settle

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
