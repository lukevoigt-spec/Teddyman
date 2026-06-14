#!/usr/bin/env node
/* shot-cloud.mjs — screenshot the REAL game from the CLOUD container.
 * Uses npm-packaged Chromium (@sparticuz/chromium + puppeteer-core) because the
 * Playwright browser-download host is firewalled but the npm registry is reachable.
 *
 *   node tools/shot-cloud.mjs               # all scenes
 *   node tools/shot-cloud.mjs title map     # only these
 * Writes tools/shots/cloud-<scene>.png. Read the PNGs to self-check.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "tools", "shots");
fs.mkdirSync(OUT, { recursive: true });

const MIME = { ".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",
  ".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".svg":"image/svg+xml",
  ".mp3":"audio/mpeg",".ogg":"audio/ogg",".wav":"audio/wav",".m4a":"audio/mp4",".ttf":"font/ttf",".woff2":"font/woff2" };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.statusCode = 404; return res.end("404"); }
  res.setHeader("Content-Type", MIME[path.extname(file)] || "application/octet-stream");
  fs.createReadStream(file).pipe(res);
});

const SCENES = {
  title:    `1`,
  map:      `(window.toMap && toMap(), 1)`,
  base:     `(window.paintBase && paintBase(), show('scrBase'), 1)`,
  settings: `(window.openSettings && openSettings(), 1)`,
  scan:     `(window.show && show('scrScan'), 1)`,
  // a representative learning screen — the Find (sound-ID) round, seeded s/a/t
  find:     `(function(){ try{ S.done[0]=true;S.done[1]=true;S.done[3]=true; startFind('s',4,['s','a','t'],function(){}); }catch(e){} return 1; })()`,
  // the Read-It decode screen
  read:     `(function(){ try{ CUR={id:27,type:'read',words:['cat','sat','tap']}; readWords=['cat','sat','tap']; readIx=0; readGoal=3; show('scrRead'); nextRead(); }catch(e){} return 1; })()`,
  forge:    `(function(){ try{ show('scrForge'); }catch(e){} return 1; })()`,
};
// mission-type scenes: seed "everything taught", then start a representative mission and let the
// audio-flow watchdog build the round DOM (needs a longer settle than the static screens above).
const seed = `(function(){ S.done={}; MISSIONS.forEach(m=>S.done[m.id]=true); })();`;
const M = id => `(function(){ try{ ${seed} startMission(MISSIONS.find(m=>m.id===${id})); }catch(e){console.log('scene err',e.message);} return 1; })()`;
// start a mission, then FORCE its round builder (the intro narration's flow callback fires only on the
// watchdog, seconds later — calling the builder directly renders the interactive round for the shot).
const MR = (id, build) => `(function(){ try{ ${seed} startMission(MISSIONS.find(m=>m.id===${id})); clearFlow&&clearFlow(); ${build} }catch(e){console.log('scene err',e.message);} return 1; })()`;
Object.assign(SCENES, {
  learn:    { s: M(0),   wait: 3000 },                                  // letter teach (intro IS the screen)
  forgeR:   { s: MR(8,  `forgeWord();`),                wait: 1500 },    // Forge Battle (build a word)
  spell:    { s: MR(31, `spellIx=0;spellGoal=8;practiceSpell();`), wait: 1500 }, // sight-word build
  sentence: { s: MR(34, `nextSentence();`),             wait: 1500 },   // Story Gate (read -> pick picture)
  cloze:    { s: MR(49, `nextCloze();`),                wait: 1500 },   // Reading Dojo cloze
  scramble: { s: MR(50, `nextScramble();`),             wait: 1500 },   // Reading Dojo scramble
  magic:    { s: MR(119,`magicStep();`),                wait: 1500 },   // Magic-E transform
  fortress: { s: MR(48, `fPhase=0;fortPhase(0);`),      wait: 1800 },   // Vex's Fortress finale
  boss:     { s: `(function(){ try{ ${seed} show('scrBoss'); startBoss('s'); }catch(e){} return 1; })()`, wait: 2000 },
  trace:    { s: `(function(){ try{ ${seed} startTrace('s'); }catch(e){} return 1; })()`, wait: 2000 },
});
// meta / reward / shop / training / recharge / cutscene + ACT-2 medieval skin scenes
Object.assign(SCENES, {
  win:      { s: `(function(){ try{ ${seed} CUR={id:17,type:'forge',rescue:true,lbl:'x',z:2}; showWin(true); }catch(e){console.log('e',e.message)} return 1; })()`, wait: 2200 },
  rest:     { s: `(function(){ try{ ${seed} showRest(MISSIONS[1]); }catch(e){} return 1; })()`, wait: 2200 },
  train:    { s: `(function(){ try{ ${seed} S.coins=27; showTrain(); }catch(e){} return 1; })()`, wait: 2500 },
  shop:     { s: `(function(){ try{ ${seed} S.coins=27; paintBase(); show('scrBase'); openShop(); }catch(e){} return 1; })()`, wait: 1500 },
  recharge: { s: `(function(){ try{ S.mastery={ "w_cat":{seen:5,ok:5,str:5,box:0,due:"2020-01-01"}, t:{seen:5,ok:5,str:5,box:0,due:"2020-01-01"} }; startVault(); }catch(e){console.log('e',e.message)} return 1; })()`, wait: 2500 },
  intro:    { s: `(function(){ try{ S.intro=false; startIntro(); }catch(e){} return 1; })()`, wait: 2500 },
  inter:    { s: `(function(){ try{ startInterlude(); }catch(e){} return 1; })()`, wait: 2500 },
  // ACT 2 — the medieval skin (body[data-act="2"]) + knight hero + digraph content
  a2map:    { s: `(function(){ try{ ${seed} setAct(2); toMap(); }catch(e){console.log('e',e.message)} return 1; })()`, wait: 1800 },
  a2base:   { s: `(function(){ try{ ${seed} setAct(2); paintBase(); show('scrBase'); }catch(e){} return 1; })()`, wait: 1500 },
  a2learn:  { s: `(function(){ try{ ${seed} setAct(2); startMission(MISSIONS.find(m=>m.id===100)); }catch(e){} return 1; })()`, wait: 3000 },
});

const args = process.argv.slice(2);
const wanted = args.filter(a => !a.startsWith("--"));
const scenes = wanted.length ? wanted : Object.keys(SCENES);

await new Promise(r => server.listen(0, r));
const port = server.address().port;
const url = `http://localhost:${port}/index.html`;

const browser = await puppeteer.launch({
  args: chromium.args, executablePath: await chromium.executablePath(), headless: "shell",
});
const page = await browser.newPage();
await page.setViewport({ width: 1024, height: 768, deviceScaleFactor: 2 });
await page.setRequestInterception(true);
page.on("request", r => { (/fonts\.(googleapis|gstatic)\.com/.test(r.url())) ? r.abort() : r.continue(); });
page.on("pageerror", e => console.log("  page error:", e.message));
await page.goto(url, { waitUntil: "domcontentloaded" });
await new Promise(r => setTimeout(r, 2500));

for (const s of scenes) {
  const sc = SCENES[s];
  if (!sc) { console.log("  (unknown scene:", s, ")"); continue; }
  const setup = (typeof sc === "string") ? sc : sc.s;
  const wait = (typeof sc === "string") ? 800 : (sc.wait || 800);
  try {
    await page.evaluate(setup);
    await new Promise(r => setTimeout(r, wait));
    const out = path.join(OUT, `cloud-${s}.png`);
    await page.screenshot({ path: out });
    console.log("wrote", out);
  } catch (e) { console.log("  failed scene", s, "->", e.message); }
}

await browser.close();
server.close();
console.log("done");
