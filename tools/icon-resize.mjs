import fs from "node:fs"; import path from "node:path"; import http from "node:http";
const pw = await import("playwright");
const ROOT = process.cwd();
const SRC = path.join(ROOT,"art/incoming");
const OUT = path.join(ROOT,"art");
const SIZE = 320;
const slugs = fs.readdirSync(SRC).filter(f=>/^pic-.*\.png$/.test(f)).map(f=>f.replace(/\.png$/,""));
const server = http.createServer((req,res)=>{ const f=path.join(ROOT,decodeURIComponent(req.url.split("?")[0])); fs.readFile(f,(e,d)=>{ if(e){res.statusCode=404;res.end();return;} res.setHeader("Content-Type","image/png"); res.end(d); }); });
await new Promise(r=>server.listen(0,r)); const port=server.address().port;
const b = await pw.chromium.launch();
const p = await (await b.newContext()).newPage();
await p.goto(`http://localhost:${port}/art/incoming/${slugs[0]}.png`,{waitUntil:"domcontentloaded"}).catch(()=>{});
let n=0;
for (const slug of slugs){
  const dataUri = await p.evaluate(async ({url,SIZE})=>{
    const img = new Image(); img.crossOrigin="anonymous"; img.src=url;
    await img.decode();
    const c=document.createElement("canvas"); c.width=SIZE; c.height=SIZE;
    const x=c.getContext("2d"); x.imageSmoothingQuality="high";
    // source is square with centered subject — straight scale preserves framing + alpha
    x.drawImage(img,0,0,SIZE,SIZE);
    return c.toDataURL("image/png");
  }, {url:`http://localhost:${port}/art/incoming/${slug}.png`, SIZE});
  const buf = Buffer.from(dataUri.split(",")[1],"base64");
  fs.writeFileSync(path.join(OUT,`${slug}.png`), buf);
  n++;
}
await b.close(); server.close();
console.log(`resized ${n} icons -> art/ at ${SIZE}px`);
