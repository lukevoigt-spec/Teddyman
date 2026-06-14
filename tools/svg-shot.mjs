#!/usr/bin/env node
/* svg-shot.mjs — rasterize the game's SVG art to PNG (no browser needed).
 *
 *   node tools/svg-shot.mjs "heroSVG(240,{theme:'knight',weapon:'mace',muscle:2,cape:'red'})" out.png 360
 *   node tools/svg-shot.mjs --cast            # contact sheet of the whole cast -> tools/shots/cast.png
 *
 * Loads art.js in a sandbox (its functions are pure string-builders) and renders
 * any expression that returns an <svg> string. Great for fast, isolated art checks.
 * For full composed game screens (animation/CSS/fonts) use shot.mjs (real browser).
 */
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "tools", "shots");
fs.mkdirSync(OUT, { recursive: true });

const ctx = { Math, Date, JSON, console };
ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, "art.js"), "utf8"), ctx);

function render(svg, width = 360, bg = "#15102e") {
  if (!/xmlns=/.test(svg)) svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  return new Resvg(svg, { background: bg, fitTo: { mode: "width", value: width } }).render().asPng();
}

const args = process.argv.slice(2);

if (args[0] === "--cast") {
  // one tidy contact sheet of every main character, labelled
  const items = [
    ["LASSO", `heroSVG(240,{theme:'hero',muscle:2,weapon:'lasso',cape:'red'})`],
    ["BOW", `heroSVG(240,{theme:'hero',muscle:2,weapon:'bow',cape:'red'})`],
    ["MACE", `heroSVG(240,{theme:'knight',muscle:2,weapon:'mace',cape:'red'})`],
    ["LANCE", `heroSVG(240,{theme:'knight',muscle:2,weapon:'lance',cape:'red'})`],
    ["Ellie", `allyBody('flip',200)`],
    ["Amelia", `allyBody('heart',200)`],
    ["Leighton", `allyBody('leighton',200)`],
    ["Archie", `allyBody('tank',200)`],
    ["Lord Vex", `inkblotSVG(200)`],
    ["Dragon", `dragonSVG(200)`],
    ["Vixen", `vixenSVG(200)`],
  ];
  const cw = 200, ch = 300, cols = 4, rows = Math.ceil(items.length / cols);
  let cells = "";
  for (let i = 0; i < items.length; i++) {
    const [label, expr] = items[i];
    const cx = (i % cols) * cw, cy = Math.floor(i / cols) * ch;
    const svg = vm.runInContext("(" + expr + ")", ctx);
    const b64 = render(svg, cw - 16, "transparent").toString("base64");
    cells += `<rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" fill="#1a1330" stroke="#3a2d72"/>` +
      `<image x="${cx + 8}" y="${cy + 8}" width="${cw - 16}" href="data:image/png;base64,${b64}"/>` +
      `<text x="${cx + cw / 2}" y="${cy + ch - 12}" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#ffce3a" font-weight="bold">${label}</text>`;
  }
  const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="${cols * cw}" height="${rows * ch}"><rect width="100%" height="100%" fill="#0b051f"/>${cells}</svg>`;
  const file = path.join(OUT, "cast.png");
  fs.writeFileSync(file, new Resvg(sheet, { background: "#0b051f" }).render().asPng());
  console.log("wrote", file);
} else {
  const expr = args[0];
  if (!expr) { console.error("usage: node tools/svg-shot.mjs \"<expr returning svg>\" [out.png] [width]\n   or: --cast"); process.exit(1); }
  const out = args[1] ? (path.isAbsolute(args[1]) ? args[1] : path.join(OUT, args[1])) : path.join(OUT, "svg.png");
  const width = +args[2] || 360;
  const svg = vm.runInContext("(" + expr + ")", ctx);
  fs.writeFileSync(out, render(svg, width));
  console.log("wrote", out);
}
