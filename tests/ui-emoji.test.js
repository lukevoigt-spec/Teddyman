/* =========================================================
   Super Teddy — UI no-emoji guard (no deps).
   Run:  node tests/ui-emoji.test.js   (exit 0 = pass)

   Enforces the NO-EMOJI rule for CHILD-FACING UI (CLAUDE.md non-negotiable #6 /
   STYLE.md §18 — the Oracle's Premium-UI bar): kid surfaces use crafted SVG in the
   house icon language, never OS emoji.

   The de-emoji rollout is INCREMENTAL (the Oracle ships it surface-by-surface via
   PRs Neo merges), so this is a RATCHET, not a big-bang "zero emoji everywhere":
   it asserts the surfaces ALREADY migrated stay clean — a GROWING allowlist of
   "clean zones." When the Oracle de-emojis a new surface, ADD a zone here in the
   same PR so it can never regress. End state (STYLE §18): every child surface is a
   clean zone; emoji survive only in the parent-area Grown-Up Corner (audio-first,
   parent reads).

   To add a zone: give it a name, the file, and an `extract(src)` that returns just
   that surface's source text; the guard fails if any emoji appears in it.
========================================================= */
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");
const read = f => fs.readFileSync(path.join(ROOT, f), "utf8");

/* Emoji / pictograph detector — the common emoji blocks + variation selector +
   keycaps + dingbats/symbols/arrows used as icons. Plain ASCII/letters never match,
   so a clean data block (e.g. item names) passes cleanly. */
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\u{2300}-\u{23FF}\u{FE0F}\u{20E3}\u{2764}\u{2728}\u{2B50}]/u;
function emojiIn(s){ const re=new RegExp(EMOJI.source,"gu"); return [...new Set(s.match(re)||[])]; }

/* slice out a balanced-ish region by start marker → first terminator after it */
function between(src, startRe, endLiteral){
  const m = src.match(startRe); if (!m) return null;
  const from = m.index; const end = src.indexOf(endLiteral, from);
  return end < 0 ? src.slice(from) : src.slice(from, end + endLiteral.length);
}

/* ---- CLEAN ZONES: child-facing surfaces that are DE-EMOJI'D and must stay so ---- */
const ZONES = [
  { name: "Hero Shop catalog (BASE_ITEMS) — crafted SVG via itemArt(), no emoji",
    file: "game.js",
    extract: src => between(src, /const\s+BASE_ITEMS\s*=\s*\[/, "];") },
  { name: "Nav corner buttons (Settings/Base/Map) — icon-only crafted uiIcon SVG, no emoji",
    file: "index.html",
    extract: src => between(src, /id="navSettings"/, "</div>") },
  { name: "Hero Base layered-hub markup (#scrBase) — de-emoji'd by PR #52 (GEMS/GEAR/VILLAINS/FRIENDS text + SVG coin, no emoji)",
    file: "index.html",
    /* strip HTML comments first — the layout-description comment legitimately uses →/↙ arrows for prose,
       which aren't child-facing UI. Only the rendered markup must be emoji-free. */
    extract: src => (between(src, /id="scrBase"/, "<!-- MEMORY VAULT") || "").replace(/<!--[\s\S]*?-->/g, "") },
];

const RESULT = { pass: 0, fail: 0, lines: [] };
function ok(name, cond){ if (cond) { RESULT.pass++; RESULT.lines.push("  ok  " + name); }
  else { RESULT.fail++; RESULT.lines.push("  XX  FAIL: " + name); } }

/* 1) every declared clean zone is emoji-free */
for (const z of ZONES) {
  const src = read(z.file);
  const region = z.extract(src);
  if (region == null) { ok(z.name + " [zone region found in " + z.file + "]", false); continue; }
  const found = emojiIn(region);
  ok(z.name, found.length === 0);
  if (found.length) RESULT.lines.push("        ↳ stray emoji in " + z.file + ": " + found.join(" "));
}

/* 2) the shop's de-emoji is structurally intact (protects the merged Premium-UI batch 1) */
const game = read("game.js"), art = read("art.js");
const baseItems = between(game, /const\s+BASE_ITEMS\s*=\s*\[/, "];") || "";
ok("BASE_ITEMS dropped the emoji `ic:` field (icons come from itemArt, not data)", !/\bic\s*:/.test(baseItems));
ok("art.js defines the itemArt() resolver", /function\s+itemArt\s*\(/.test(art));
ok("art.js defines the ITEMART registry", /const\s+ITEMART\s*=/.test(art));
ok("shop render path uses itemArt() (shop grid / trophy shelf / chest + buy unlocks)",
  (game.match(/itemArt\s*\(/g) || []).length >= 4);
ok("no shop/trophy/chest render site still injects an emoji `.ic` field", !/\$\{?\s*it\.ic\s*\}?/.test(game) && !/\+\s*item\.ic\b/.test(game));
/* #32: shop/base coin + gem glyphs are PAINTED RASTER (gicon → art/ui-*.png), not OS emoji. 💰 (money
   bag) and 💎 (gem stone) have NO valid use anywhere (no parent-only context), so assert they're GONE
   from both child + chrome source. (✓/★ still appear in the parent-only Grown-Up Corner, so they're
   not blanket-banned here.) */
const idx = read("index.html");
ok("game.js defines the gicon() raster-glyph resolver (#32)", /function\s+gicon\s*\(/.test(game));
ok("shop/HUD render the coin via gicon('coin'), not the SVG coinIcon", /gicon\(["']coin["']/.test(game));
ok("💰 money-bag emoji fully gone (→ painted ui-coin.png)", !/\u{1F4B0}/u.test(game) && !/\u{1F4B0}/u.test(idx));
ok("💎 gem-stone emoji fully gone (→ painted ui-gem.png)", !/\u{1F48E}/u.test(game) && !/\u{1F48E}/u.test(idx));
ok("the painted glyph PNGs exist", ["ui-coin","ui-gem","ui-check","ui-star"].every(n=>fs.existsSync(path.join(ROOT,"art",n+".png"))));
/* nav de-emoji: art.js still defines the crafted UICONS registry (used elsewhere / kept for reuse) */
ok("art.js defines the uiIcon() resolver + UICONS registry (crafted nav glyphs)", /function\s+uiIcon\s*\(/.test(art) && /\bUICONS\s*=/.test(art));
/* NAV-2 + back-button removal: navChrome() builds the 3 corner buttons from the premium raster nav-*.png
   images (the framed image IS the button), NOT emoji. (The old in-game BACK-TO-BASE buttons were removed —
   the persistent HOME/MAP corners replace them — so navChrome no longer injects uiIcon glyphs.) */
{ const nav = between(game, /function\s+navChrome\s*\(/, "})();") || "";
  /* strip JS comments first — only the CODE (the innerHTML the buttons get) must be emoji-free;
     comments legitimately use → arrows for prose, which aren't child-facing UI. */
  const navCode = nav.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  ok("game.js navChrome() builds the corner nav from raster nav-*.png images (not emoji)",
    /src="art\//.test(nav) && /nav-home\.png/.test(nav) && /nav-map\.png/.test(nav) && /nav-settings\.png/.test(nav) && emojiIn(navCode).length === 0); }
/* in-game controls de-emoji (PR #45): home 🏠 replaced by the crafted shield; .ear replay buttons draw the speaker in CSS */
const indexHtml = read("index.html");
ok("home glyph 🏠 fully eliminated from index.html (crafted shield via uiIcon on BACK-TO-BASE)", !/\u{1F3E0}/u.test(indexHtml));
const ears = indexHtml.match(/<div class="ear"[^>]*>[\s\S]*?<\/div>/g) || [];
ok("every .ear replay button is emoji-free (CSS draws the speaker — no 🔊 text)", ears.length > 0 && ears.every(d => emojiIn(d).length === 0));

console.log(RESULT.lines.join("\n"));
console.log("\n" + (RESULT.fail === 0 ? "ALL PASS" : RESULT.fail + " FAILED") + " (" + RESULT.pass + " passed, " + RESULT.fail + " failed)");
process.exit(RESULT.fail === 0 ? 0 : 1);
