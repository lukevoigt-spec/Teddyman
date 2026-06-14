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
page.on("pageerror", e => console.log("  page error:", e.message));
await page.goto(base, { waitUntil: "load" }); // networkidle never settles (PWA: SW/fonts/audio probing)
await page.waitForTimeout(1500); // let boot + first paint settle

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
