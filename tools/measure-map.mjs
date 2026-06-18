/* measure-map.mjs — §20 touch-target confirmation for the painted world map (constraint #6, ~96px+).
 * Boots the game at 768×1024 PORTRAIT (the tight case), goes to the map with done/current/locked nodes
 * present, and measures each .mnode's CSS-px bounding box (the tappable hit area). Saves a portrait shot.
 *   node tools/measure-map.mjs
 */
import http from "node:http"; import fs from "node:fs"; import path from "node:path";
import { fileURLToPath } from "node:url";
const pw = await import("playwright");
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".svg":"image/svg+xml",".mp3":"audio/mpeg",".ogg":"audio/ogg",".wav":"audio/wav",".m4a":"audio/mp4",".mp4":"video/mp4",".ttf":"font/ttf",".woff2":"font/woff2"};
const server=http.createServer((req,res)=>{ let p=decodeURIComponent(req.url.split("?")[0]); if(p==="/")p="/index.html";
  const f=path.join(ROOT,p); if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.statusCode=404;return res.end("404");}
  res.setHeader("Content-Type",MIME[path.extname(f)]||"application/octet-stream"); fs.createReadStream(f).pipe(res); });
await new Promise(r=>server.listen(0,r)); const port=server.address().port;
const b=await pw.chromium.launch();
const ctx=await b.newContext({ viewport:{width:768,height:1024}, deviceScaleFactor:2, serviceWorkers:"block" });
const pg=await ctx.newPage();
await pg.goto(`http://localhost:${port}/index.html`,{waitUntil:"load"});
await pg.waitForTimeout(800);
const res=await pg.evaluate(()=>{
  // seed done/current/locked: complete zone 1 so zone-1=done, zone-2=current, zone-3+=locked
  try{ S.intro=true; S.act=1; const z1=(typeof actZones==="function")?actZones(1)[0]:null;
    if(z1 && typeof zMissions==="function") zMissions(z1).forEach(m=>{S.done[m.id]=true;}); }catch(e){}
  toMap();
  const out=[]; document.querySelectorAll(".mnode").forEach(n=>{ const r=n.getBoundingClientRect();
    out.push({zi:n.getAttribute("data-zi"), state:(n.className.baseVal||n.getAttribute("class")||"").replace("mnode","").trim(),
      w:Math.round(r.width), h:Math.round(r.height)}); });
  return out;
});
console.log("portrait 768×1024 — map node hit-rect CSS sizes (constraint #6 needs ≥96):");
let minW=1e9,minH=1e9;
for(const n of res){ console.log(`  zone ${n.zi} [${n.state||"?"}]  ${n.w}×${n.h}px  ${(n.w>=96&&n.h>=96)?"OK":"FAIL <96"}`); minW=Math.min(minW,n.w); minH=Math.min(minH,n.h); }
console.log(`  -> smallest node: ${minW}×${minH}px  ${(minW>=96&&minH>=96)?"ALL ≥96 ✓":"SOME <96 ✗"}`);
fs.mkdirSync(path.join(ROOT,"tools","shots"),{recursive:true});
await pg.screenshot({ path:path.join(ROOT,"tools","shots","map-portrait.png") });
console.log("wrote tools/shots/map-portrait.png");
await b.close(); server.close();
