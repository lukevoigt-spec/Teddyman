/* black-cut.mjs — cut a SOLID-BLACK background off a cast portrait while PRESERVING the dark comic
 * outline (the house-style signature). Inverse of de-halo: there the bg is white and we stop at the
 * dark outline; here the bg AND the outline are near-black, so a naive flood-fill would eat the
 * outline too. So we flood-fill the near-black bg from the edges, then PROTECT every near-black pixel
 * within N px of a coloured (character) pixel — that protected ring IS the outline. Finally we
 * auto-crop to the character and reframe into a 560² square matching the other ally cutouts (feet
 * near the bottom, centred), so map/league placement (allyMapFig/allyRasterImg) is unchanged.
 *
 *   node tools/black-cut.mjs incoming/jj-src.png ally-jj        # -> art/ally-jj.png (560², bg cut)
 *   node tools/black-cut.mjs <srcRelToArt> <outName> [size] [ringPx]
 */
import fs from "node:fs"; import path from "node:path"; import http from "node:http";
const pw = await import("playwright");
const ROOT = process.cwd();
const src = process.argv[2] || "incoming/jj-src.png";
const outName = process.argv[3] || path.basename(src).replace(/\.png$/,"");
const SIZE = parseInt(process.argv[4]||"560",10);
const RING = parseInt(process.argv[5]||"4",10);          // outline ring thickness to preserve (px, native scale)
const srcUrl = "/art/" + src.replace(/^art\//,"");

const server = http.createServer((req,res)=>{ const f=path.join(ROOT,decodeURIComponent(req.url.split("?")[0]));
  fs.readFile(f,(e,d)=>{ if(e){res.statusCode=404;res.end();return;} res.setHeader("Content-Type","image/png"); res.end(d); }); });
await new Promise(r=>server.listen(0,r)); const port=server.address().port;
const b = await pw.chromium.launch();
const p = await (await b.newContext()).newPage();
await p.goto(`http://localhost:${port}/`,{waitUntil:"domcontentloaded"}).catch(()=>{});

const dataUri = await p.evaluate(async ({url,SIZE,RING})=>{
  const img=new Image(); img.crossOrigin="anonymous"; img.src=url; await img.decode();
  const W=img.naturalWidth, H=img.naturalHeight;
  const c=document.createElement("canvas"); c.width=W; c.height=H;
  const x=c.getContext("2d"); x.drawImage(img,0,0);
  const id=x.getImageData(0,0,W,H), a=id.data;
  const N=W*H;
  const nearBlack=i=>{ const al=a[i+3]; if(al<16) return true; return Math.max(a[i],a[i+1],a[i+2])<60; };

  // 1) flood-fill the near-black background inward from the 4 edges (connectivity-bounded)
  const bgM=new Uint8Array(N), seen=new Uint8Array(N), stack=[];
  const push=(px,py)=>{ if(px<0||py<0||px>=W||py>=H)return; const k=py*W+px; if(seen[k])return; seen[k]=1; stack.push(k); };
  for(let px=0;px<W;px++){ push(px,0); push(px,H-1); }
  for(let py=0;py<H;py++){ push(0,py); push(W-1,py); }
  while(stack.length){ const k=stack.pop(); if(!nearBlack(k*4)) continue; bgM[k]=1;
    const px=k%W, py=(k/W)|0; push(px-1,py); push(px+1,py); push(px,py-1); push(px,py+1); }

  // 2) protect an N-px ring: dilate the COLOURED character mask RING times; protected ∩ bg = the outline
  let prot=new Uint8Array(N);
  for(let k=0;k<N;k++) if(!bgM[k] && !nearBlack(k*4)) prot[k]=1;   // seed = coloured (non-black) pixels
  for(let pass=0; pass<RING; pass++){ const nxt=prot.slice();
    for(let y=0;y<H;y++) for(let xp=0;xp<W;xp++){ const k=y*W+xp; if(prot[k]) continue;
      if((xp>0&&prot[k-1])||(xp<W-1&&prot[k+1])||(y>0&&prot[k-W])||(y<H-1&&prot[k+W])) nxt[k]=1; }
    prot=nxt; }

  // 3) erase background pixels that are NOT in the protected outline ring
  for(let k=0;k<N;k++){ if(bgM[k] && !prot[k]) a[k*4+3]=0; }
  x.putImageData(id,0,0);

  // 4) auto-crop to the visible character, then reframe into a SIZE² square (cast framing: ~92% tall, feet low)
  let minX=W,minY=H,maxX=0,maxY=0;
  for(let y=0;y<H;y++) for(let xp=0;xp<W;xp++){ if(a[(y*W+xp)*4+3]>24){ if(xp<minX)minX=xp; if(xp>maxX)maxX=xp; if(y<minY)minY=y; if(y>maxY)maxY=y; } }
  const cw=maxX-minX+1, ch=maxY-minY+1;
  const o=document.createElement("canvas"); o.width=SIZE; o.height=SIZE;
  const ox=o.getContext("2d"); ox.imageSmoothingQuality="high";
  const targetH=SIZE*0.92, scale=Math.min(targetH/ch, (SIZE*0.94)/cw);
  const dw=cw*scale, dh=ch*scale;
  const dx=(SIZE-dw)/2, dy=SIZE-dh-SIZE*0.03;   // centred horizontally, ~3% bottom margin (feet low)
  ox.drawImage(c, minX,minY,cw,ch, dx,dy,dw,dh);
  return o.toDataURL("image/png");
},{url:srcUrl,SIZE,RING});

const buf=Buffer.from(dataUri.split(",")[1],"base64");
const outPath=path.join(ROOT,"art",outName+".png");
fs.writeFileSync(outPath,buf);
console.log("wrote",outPath,"("+SIZE+"px², black bg cut, "+RING+"px outline preserved)");
await b.close(); server.close();
