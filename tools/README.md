# tools/ — dev harness (NOT part of the deployed game)

These scripts let Claude *see* and *create* art. They never ship — GitHub Pages serves
the repo root; `tools/` is ignored at runtime and `tools/node_modules` is gitignored.

## One-time setup (on the local machine)
```bash
cd tools
npm install
npx playwright install chromium webkit   # browsers for shot.mjs (local only)
```
Install the fonts **Andika**, **Bangers**, **MedievalSharp** on the machine so screenshots
render the real type.

## 1. `svg-shot.mjs` — fast isolated SVG render (works anywhere, no browser)
```bash
node svg-shot.mjs "heroSVG(240,{theme:'knight',weapon:'mace',muscle:2,cape:'red'})" hero.png 360
node svg-shot.mjs --cast        # whole-cast contact sheet -> shots/cast.png
```
Loads `art.js` in a sandbox and rasterizes any expression returning an `<svg>` string.

## 2. `shot.mjs` — screenshot the REAL game (run locally; real browser)
```bash
node shot.mjs                # default scenes (title/map/base/settings), Chromium
node shot.mjs --webkit       # Safari engine — closest to the iPad
node shot.mjs title map      # only these scenes
```
Serves the repo over http, boots the game, jumps to each screen via the game's own
global nav functions, and writes `shots/<engine>-<scene>.png`. Add scenes by editing the
`SCENES` map (each entry is a snippet evaluated in the page after boot).

## 3. `gen.mjs` — generate art from a prompt (run locally; needs an API key)
```bash
setx XAI_API_KEY "xai-..."      # Grok  (grok-2-image)   — or
setx OPENAI_API_KEY "sk-..."    # OpenAI (gpt-image-1, transparent bg)
node gen.mjs vixen "PASTE PROMPT (include the HOUSE STYLE block)"
```
Writes `art/incoming/<name>.png`. No key? Generate manually in ChatGPT/Grok and drop the
PNG in `art/incoming/` — Claude integrates from there either way. See
`../art/CHARACTER-ART-PROMPTS.md` for the house style + per-character prompts.

🔒 **API keys live on the machine only — never commit them** (`.env`, `art/incoming/`
and `tools/node_modules` are gitignored).
