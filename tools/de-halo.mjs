/* de-halo.mjs — strip the white sticker halo gpt-image-1 bakes around a transparent cutout.
 * Flood-fills from the image edges inward, clearing transparent + near-white pixels, and STOPS at the
 * dark house outline — so interior white highlights (sealed off by the outline) are preserved.
 * Grok gens come back clean; OpenAI gens get this halo, so run it on OpenAI-sourced cutouts.
 *
 *   node tools/de-halo.mjs incoming/cart.png cart        # -> art/cart.png (320px, halo stripped)
 *   node tools/de-halo.mjs <srcRelToArt> <outName> [size]
 */
import fs from "node:fs"; import path from "node:path"; import http from "node:http";
const pw = await import("playwright");
const ROOT = process.cwd();
const src = process.argv[2] || "incoming/cart.png";
const outName = process.argv[3] || path.basename(src).replace(/\.png$/,"");
const SIZE = parseInt(process.argv[4]||"320",10);
const srcUrl = "/art/" + src.replace(/^art\//,"");

const server = http.createServer((req,res)=>{ const f=path.join(ROOT,decodeURIComponent(req.url.split("?")[0]));
  fs.readFile(f,(e,d)=>{ if(e){res.statusCode=404;res.end();return;} res.setHeader("Content-Type","image/png"); res.end(d); }); });
await new Promise(r=>server.listen(0,r)); const port=server.address().port;
const b = await pw.chromium.launch();
const p = await (await b.newContext()).newPage();
await p.goto(`http://localhost:${port}/`,{waitUntil:"domcontentloaded"}).catch(()=>{});

const dataUri = await p.evaluate(async ({url,SIZE})=>{
  const img=new Image(); img.crossOrigin="anonymous"; img.src=url; await img.decode();
  const W=img.naturalWidth, H=img.naturalHeight;
  const c=document.createElement("canvas"); c.width=W; c.height=H;
  const x=c.getContext("2d"); x.drawImage(img,0,0);
  const id=x.getImageData(0,0,W,H), a=id.data;
  const bg=i=>{ const al=a[i+3]; if(al<16) return true;                     // already transparent
    const r=a[i],g=a[i+1],bl=a[i+2];
    return r>200 && g>200 && bl>200 && Math.max(r,g,bl)-Math.min(r,g,bl)<26; // near-white, low saturation = halo
  };
  const stack=[]; const seen=new Uint8Array(W*H);
  const push=(px,py)=>{ if(px<0||py<0||px>=W||py>=H)return; const k=py*W+px; if(seen[k])return; seen[k]=1; stack.push(k); };
  for(let px=0;px<W;px++){ push(px,0); push(px,H-1); }
  for(let py=0;py<H;py++){ push(0,py); push(W-1,py); }
  while(stack.length){ const k=stack.pop(); const i=k*4; if(!bg(i)) continue;  // hit the dark outline → stop
    a[i+3]=0;                                                                  // clear the halo/bg pixel
    const px=k%W, py=(k/W)|0; push(px-1,py); push(px+1,py); push(px,py-1); push(px,py+1); }
  x.putImageData(id,0,0);
  // scale to SIZE preserving the square framing + alpha
  const o=document.createElement("canvas"); o.width=SIZE; o.height=SIZE;
  const ox=o.getContext("2d"); ox.imageSmoothingQuality="high"; ox.drawImage(c,0,0,SIZE,SIZE);
  return o.toDataURL("image/png");
},{url:srcUrl,SIZE});

const buf=Buffer.from(dataUri.split(",")[1],"base64");
const outPath=path.join(ROOT,"art",outName+".png");
fs.writeFileSync(outPath,buf);
console.log("wrote",outPath,"("+SIZE+"px, halo stripped)");
await b.close(); server.close();
