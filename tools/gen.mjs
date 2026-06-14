#!/usr/bin/env node
/* gen.mjs — generate a character/scene image from a prompt (run locally, needs an API key).
 *
 *   node tools/gen.mjs vixen "An elegant cartoon villainess, pink-to-crimson hair, ..."
 *   node tools/gen.mjs hero  --file prompt.txt
 *
 * Uses whichever key is in the environment (set on the machine, NEVER in git):
 *   XAI_API_KEY      -> Grok image model (grok-2-image)
 *   OPENAI_API_KEY   -> OpenAI image model (gpt-image-1, transparent bg)
 * Saves to art/incoming/<name>.png for me to mask/frame/wire in.
 *
 * Tip: paste the HOUSE STYLE block from art/CHARACTER-ART-PROMPTS.md into the prompt
 * so generated art stays cohesive with the cast.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "art", "incoming");
fs.mkdirSync(OUT, { recursive: true });

const [name, ...rest] = process.argv.slice(2);
if (!name) { console.error('usage: node tools/gen.mjs <name> "<prompt>"   (or --file prompt.txt)'); process.exit(1); }
// provider flags: --openai forces gpt-image-1 (transparent bg, best for cutouts);
// --grok forces grok-2-image. Default: Grok if its key is set, else OpenAI.
const forceOpenAI = rest.includes("--openai");
const forceGrok = rest.includes("--grok");
const isBg = rest.includes("--bg");   // --bg = opaque LANDSCAPE scene (1536x1024); default = transparent square cutout
const words = rest.filter(a => a !== "--openai" && a !== "--grok" && a !== "--bg");
let prompt = words.join(" ");
const fi = words.indexOf("--file");
if (fi >= 0) prompt = fs.readFileSync(words[fi + 1], "utf8");
if (!prompt.trim()) { console.error("empty prompt"); process.exit(1); }

const provider = forceOpenAI ? "openai" : forceGrok ? "grok"
  : (isBg && process.env.OPENAI_API_KEY) ? "openai"   /* backgrounds want opaque/landscape → gpt-image-1 */
  : (process.env.XAI_API_KEY ? "grok" : process.env.OPENAI_API_KEY ? "openai" : null);

const save = (buf) => { const f = path.join(OUT, `${name}.png`); fs.writeFileSync(f, buf); console.log("wrote", f); };

if (provider === "grok" && process.env.XAI_API_KEY) {
  console.log("generating via Grok (grok-2-image)…");
  const r = await fetch("https://api.x.ai/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.XAI_API_KEY}` },
    body: JSON.stringify({ model: "grok-2-image", prompt, response_format: "b64_json", n: 1 }),
  });
  const j = await r.json();
  if (!r.ok) { console.error("xAI error:", JSON.stringify(j)); process.exit(1); }
  save(Buffer.from(j.data[0].b64_json, "base64"));
} else if (provider === "openai" && process.env.OPENAI_API_KEY) {
  console.log("generating via OpenAI (gpt-image-1)…");
  const r = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: "gpt-image-1", prompt, size: isBg?"1536x1024":"1024x1024", background: isBg?"opaque":"transparent", n: 1 }),
  });
  const j = await r.json();
  if (!r.ok) { console.error("OpenAI error:", JSON.stringify(j)); process.exit(1); }
  save(Buffer.from(j.data[0].b64_json, "base64"));
} else {
  console.error("No image key found. Set XAI_API_KEY or OPENAI_API_KEY on this machine,\nor generate manually in ChatGPT/Grok and drop the PNG in art/incoming/.");
  process.exit(1);
}
