// One-off: downscale the 3 nav icon PNGs (3.7MB 600px app-icons) to deploy-sized 176px, alpha-preserved.
// Reports whether each source has transparency (so we know if the button needs a rounded clip).
import fs from "node:fs"; import path from "node:path"; import { fileURLToPath } from "node:url";
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ART = path.join(ROOT, "art");
const files = ["nav-home.png", "nav-map.png", "nav-settings.png"];
const pw = await import("playwright");
const b = await pw.chromium.launch(); const page = await b.newPage();
for (const f of files) {
  const buf = fs.readFileSync(path.join(ART, f));
  const dataUri = "data:image/png;base64," + buf.toString("base64");
  const out = await page.evaluate(async (src) => {
    const img = new Image(); img.src = src;
    await img.decode();
    const S = 176; const c = document.createElement("canvas"); c.width = S; c.height = S;
    const ctx = c.getContext("2d"); ctx.clearRect(0, 0, S, S);
    // crop the white margin (~5.5%) so the ornate frame fills the canvas edge-to-edge; a rounded-square
    // button clip then removes the white square-corners (the frame is itself a rounded square).
    const w = img.naturalWidth, h = img.naturalHeight, m = 0.055;
    ctx.drawImage(img, w*m, h*m, w*(1-2*m), h*(1-2*m), 0, 0, S, S);
    // sample the 4 corners for alpha (is the background transparent?)
    const corners = [[2,2],[S-3,2],[2,S-3],[S-3,S-3]].map(([x,y]) => ctx.getImageData(x,y,1,1).data[3]);
    return { png: c.toDataURL("image/png"), corners };
  }, dataUri);
  const b64 = out.png.split(",")[1];
  fs.writeFileSync(path.join(ART, f), Buffer.from(b64, "base64"));
  const kb = Math.round(fs.statSync(path.join(ART, f)).size / 1024);
  console.log(f, "->", kb, "KB · corner alpha:", out.corners.join(","), out.corners.every(a => a < 8) ? "(transparent)" : "(opaque bg)");
}
await b.close();
