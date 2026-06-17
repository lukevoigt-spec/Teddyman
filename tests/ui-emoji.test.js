/* =========================================================
   Super Teddy — UI no-emoji guard (no deps).
   Run:  node tests/ui-emoji.test.js   (exit 0 = pass)

   Enforces the NO-EMOJI rule for CHILD-FACING UI (CLAUDE.md non-negotiable #6 /
   STYLE.md §18 — the Oracle's Premium-UI bar): kid surfaces use crafted SVG in the
   house icon language, never OS emoji.

   FULL CHILD-FACING SCAN (issue #102, replaces the old "named clean zones" ratchet
   that let emoji anywhere else pass green). It scans EVERY shipped child surface and
   flags ANY emoji, with three explicit allowances:

     1) PARENT_ONLY — surfaces the parent reads (the child can't read yet), where emoji
        are legitimate: whole parent-only files + the Grown-Up Corner / Settings / Voice
        Studio regions of index.html. STRIPPED before scanning, so a new emoji on a
        parent surface is fine and needs no test change.

     2) PICON vocabulary — the EMOJI_IMG glyph keys (art.js) that emojiArt() resolves to
        painted art/pic-*.png. These never reach the screen AS emoji; they're lookup keys
        (#103). Parsed from art.js so the allow-set tracks the registry automatically.

     3) BASELINE — child-facing UI-CHROME emoji that EXIST TODAY and are pending de-emoji
        cleanup (companion issue #104, the Oracle's lane), keyed per file. Any emoji NOT
        covered by (2) or (3) → NEW LEAK → FAIL, so a fresh emoji is blocked immediately
        even while the cleanup lands incrementally.

   SHRINK DISCIPLINE: as #104 de-emojis a surface, DELETE the now-absent emoji from that
   file's BASELINE entry in the SAME PR. When every BASELINE array is empty, every child
   surface is clean (STYLE §18 end state). The guard prints any baseline char no longer
   present ("RESOLVED — remove from BASELINE") to make the shrink obvious; it does not fail
   on those (keeps it low-friction while the Oracle edits the same files in parallel).
========================================================= */
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");
const read = f => fs.readFileSync(path.join(ROOT, f), "utf8");
const exists = f => fs.existsSync(path.join(ROOT, f));

/* Emoji / pictograph detector — the common emoji blocks + keycaps + dingbats/symbols/
   arrows used as icons. Plain ASCII/letters never match. The variation selector U+FE0F is
   folded out (so "✂️" and "✂" are the same token), keeping the allow-lists single-codepoint. */
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\u{2300}-\u{23FF}\u{20E3}\u{2764}\u{2728}\u{2B50}]/u;
const defe = s => s.replace(/️/g, "");            // drop variation selectors
function emojiIn(s){ const re = new RegExp(EMOJI.source, "gu"); return [...new Set((defe(s).match(re) || []))]; }

/* slice out a region by start marker → first terminator after it */
function between(src, startRe, endLiteral){
  const m = src.match(startRe); if (!m) return null;
  const from = m.index; const end = src.indexOf(endLiteral, from);
  return end < 0 ? src.slice(from) : src.slice(from, end + endLiteral.length);
}
/* remove the span [startRe … startRe-relative endRe) from src (parent-region excision) */
function cut(src, startRe, endRe){
  const s = src.search(startRe); if (s < 0) return src;
  const rest = src.slice(s); const e = rest.search(endRe);
  return src.slice(0, s) + (e < 0 ? "" : rest.slice(e));
}
const stripHtmlComments = s => s.replace(/<!--[\s\S]*?-->/g, "");
/* strip block comments + // comments (whole-line AND inline). The inline strip is
   colon-protected so it never eats "http://" — only real " // prose" tails (which carry
   decorative → arrows that aren't child-facing UI). */
const stripJsComments = s => s
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/([^:])\/\/.*$/gm, "$1")
  .replace(/^\s*\/\/.*$/gm, "");

/* ---------------- WHAT'S CHILD-FACING ----------------
   Whole-file parent surfaces (parent reads them — emoji allowed, not scanned). */
const PARENT_FILES = new Set([
  "audio-studio.js",   // the in-app Voice Studio (Grown-Up Corner ▸ Audio)
  "state-save.js",     // parent save/sync status strings
]);

/* The shipped scripts the child actually sees (load order from index.html). */
const SHIPPED = [
  "index.html", "art.js", "data-missions.js", "data-content.js", "data-lines.js",
  "audio.js", "allies.js", "game.js", "map.js", "sfx.js", "music.js",
];

/* index.html parent regions to excise before scanning (Grown-Up Corner / Settings /
   Voice Studio + the recorder overlay + the adult gate). Markers are stable comments/ids. */
function childIndexHtml(src){
  let s = src;
  s = cut(s, /<div id="parentGate">/, /<!-- TITLE -->/);            // adult math-gate ("Grown-ups only 🔒")
  s = cut(s, /<!-- SETTINGS -->/,     /<!-- UNLOCK CARD/);          // #settingsPanel + #recOverlay (Voice Studio)
  return stripHtmlComments(s);
}

/* Basic directional arrows (→ ← ↑ ↓, U+2190–21FF) are PROSE/tooltip connectors only —
   parent Progress text ("letter→sound"), SVG <title> tooltips. Child-facing directional UI
   uses the distinct dingbat ➜ (U+279C), which stays flagged. Allowed globally as prose. */
const PROSE_ARROWS = new Set(["→","←","↑","↓"]);

/* (2) PICON vocabulary — EMOJI_IMG keys from art.js, resolved to painted pic-*.png by
   emojiArt(). Parsed live so the allow-set follows the registry as #103's set grows. */
const ART = read("art.js");
const PICON_KEYS = new Set(
  [...((between(ART, /const\s+EMOJI_IMG\s*=\s*\{/, "};") || "").matchAll(/"([^"]+)"\s*:/g))]
    .map(m => defe(m[1]))
);

/* (3) Per-file UI-CHROME emoji currently allowed because #104's de-emoji hasn't landed
   there yet. SHRINK these as the Oracle clears each surface (delete the char when gone). */
const BASELINE = {
  // index.html child chrome — FULLY de-emoji'd by #116 (titles 🔋📜🔥, win/rest 🗺🎯😴, NEXT ➜, CHOP ✂).
  // Permanent clean zone.
  "index.html": [],
  // rendered strings — #116 cleaned combo 🔥, MASTERED ✦, every NEXT ➜, THE END ✅, CHOP ✂. Remaining
  // pending: scroll/NEW-BEST ★, fortHit ✨, scroll/magic done ✓, charged ⚡, vault 🔋, training 🏋,
  // ally heart ♥, wrong mark ✗.
  "game.js": ["★","✨","✓","⚡","♥","✗","🔋","🏋"],
  // done-node check — de-emoji'd by #116. Permanent clean zone.
  "map.js": [],
  // allyFace initials fallback (♥ / ★)
  "art.js": ["♥","★"],
  // sentence/cloze content pics without a painted mapping yet (render via picIcon fallback)
  "data-content.js": ["🐍","🍓","🤫","🐋","⬆"],
};

const RESULT = { pass: 0, fail: 0, lines: [] };
function ok(name, cond){ if (cond) { RESULT.pass++; RESULT.lines.push("  ok  " + name); }
  else { RESULT.fail++; RESULT.lines.push("  XX  FAIL: " + name); } }

/* ============ 1) FULL CHILD-FACING SCAN ============ */
for (const f of SHIPPED) {
  if (PARENT_FILES.has(f)) continue;
  let src = read(f);
  src = (f === "index.html") ? childIndexHtml(src) : stripJsComments(src);
  const found = emojiIn(src);
  const allowed = BASELINE[f] || [];
  const leaks = found.filter(c => !PICON_KEYS.has(c) && !PROSE_ARROWS.has(c) && !allowed.includes(c));
  ok("no NEW emoji in child-facing " + f + " (full scan)", leaks.length === 0);
  if (leaks.length) RESULT.lines.push("        ↳ NEW emoji in " + f + ": " + leaks.join(" ") +
    "  — replace with crafted SVG, or if parent-only strip its region / add to PARENT_FILES, or if a painted pic add it to EMOJI_IMG");
  const resolved = allowed.filter(c => !found.includes(c));   // shrink hint
  if (resolved.length) RESULT.lines.push("        ✓ RESOLVED in " + f + " (remove from BASELINE): " + resolved.join(" "));
}
const baselineTotal = Object.values(BASELINE).reduce((n, a) => n + a.length, 0);
RESULT.lines.push("  ..  child-chrome BASELINE remaining: " + baselineTotal + " (target 0 — #104)");

/* ============ 2) STRUCTURAL INVARIANTS (protect the merged Premium-UI work) ============ */
const game = read("game.js"), art = ART, idx = read("index.html");
const baseItems = between(game, /const\s+BASE_ITEMS\s*=\s*\[/, "];") || "";
ok("BASE_ITEMS dropped the emoji `ic:` field (icons come from itemArt, not data)", !/\bic\s*:/.test(baseItems));
ok("art.js defines the itemArt() resolver", /function\s+itemArt\s*\(/.test(art));
ok("art.js defines the ITEMART registry", /const\s+ITEMART\s*=/.test(art));
ok("shop render path uses itemArt() (shop grid / trophy shelf / chest + buy unlocks)",
  (game.match(/itemArt\s*\(/g) || []).length >= 4);
ok("no shop/trophy/chest render site still injects an emoji `.ic` field", !/\$\{?\s*it\.ic\s*\}?/.test(game) && !/\+\s*item\.ic\b/.test(game));
/* #32: shop/base coin + gem glyphs are PAINTED RASTER (gicon → art/ui-*.png), not OS emoji. */
ok("game.js defines the gicon() raster-glyph resolver (#32)", /function\s+gicon\s*\(/.test(game));
ok("shop/HUD render the coin via gicon('coin'), not the SVG coinIcon", /gicon\(["']coin["']/.test(game));
ok("💰 money-bag emoji fully gone (→ painted ui-coin.png)", !/\u{1F4B0}/u.test(game) && !/\u{1F4B0}/u.test(idx));
ok("💎 gem-stone emoji fully gone (→ painted ui-gem.png)", !/\u{1F48E}/u.test(game) && !/\u{1F48E}/u.test(idx));
ok("the painted glyph PNGs exist", ["ui-coin","ui-gem","ui-check","ui-star"].every(n => exists("art/" + n + ".png")));
ok("art.js defines the uiIcon() resolver + UICONS registry (crafted nav glyphs)", /function\s+uiIcon\s*\(/.test(art) && /\bUICONS\s*=/.test(art));
/* navChrome() builds the 3 corner buttons from premium raster nav-*.png images, NOT emoji */
{ const nav = between(game, /function\s+navChrome\s*\(/, "})();") || "";
  ok("game.js navChrome() builds the corner nav from raster nav-*.png images (not emoji)",
    /src="art\//.test(nav) && /nav-home\.png/.test(nav) && /nav-map\.png/.test(nav) && /nav-settings\.png/.test(nav) && emojiIn(stripJsComments(nav)).length === 0); }
/* in-game controls de-emoji (PR #45): home 🏠 (as a CHROME glyph) replaced by the crafted shield.
   (🏠 survives as a PICON key → "home" picture; the chrome use is what must be gone.) */
ok("home glyph 🏠 not used as a nav/back chrome label (crafted shield via uiIcon)", !/>\s*🏠/u.test(idx));
const ears = idx.match(/<div class="ear"[^>]*>[\s\S]*?<\/div>/g) || [];
ok("every .ear replay button is emoji-free (CSS draws the speaker — no 🔊 text)", ears.length > 0 && ears.every(d => emojiIn(d).length === 0));

console.log(RESULT.lines.join("\n"));
console.log("\n" + (RESULT.fail === 0 ? "ALL PASS" : RESULT.fail + " FAILED") + " (" + RESULT.pass + " passed, " + RESULT.fail + " failed)");
process.exit(RESULT.fail === 0 ? 0 : 1);
