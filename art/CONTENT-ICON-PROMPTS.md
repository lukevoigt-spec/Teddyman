# Content Icon Art — #103 (painted images for every inventory/content emoji)

One cohesive **painted raster** set replacing the OS emoji on the learn-screen keyword picture, the
picture-match answer tiles, and the cloze / scramble / sentence / Warm-Up pics. Resolver lives in
`art.js` (`EMOJI_IMG` glyph→slug, `emojiArt()` / enhanced `picIcon()`); a slug lights up only once
its `pic-<slug>.png` is dropped in `art/` **and** added to `PICIMG_SET`. So the set rolls out one file
at a time with zero risk (same pattern as the SVG `PICONS`). The whole set (**106** slugs, 107 glyphs —
🐯 and 🐅 share `tiger`) is shipped: 53 from the learn keywords + cloze/scramble/sentence pics, and 53
from the `READWORDS`/`READWORDS2`/Warm-Up picture pool.

Filenames: `art/pic-<slug>.png` — transparent PNG, square, single subject centered, 320px.

Pipeline (reproducible): `tools/icon-contact.mjs` renders a QA contact sheet of `art/incoming/pic-*.png`;
`tools/icon-resize.mjs` downscales every `art/incoming/pic-*.png` → `art/` at 320px (Chromium canvas,
preserves alpha). `art/incoming/` (the 1024px originals) is gitignored.

## HOUSE STYLE (paste into every prompt)

> Premium children's-game **object icon**, single subject centered on a fully transparent background,
> stylized semi-flat vector look with soft painterly shading — clean bold dark navy outline, smooth
> gradient shading with a clear top-left key light, gentle ambient occlusion, a soft rim light, rounded
> friendly chunky proportions. Vivid saturated candy palette. Instantly recognizable to a 7-year-old.
> NOT photoreal, NOT 3D render, NOT anime, no text, no background scene, **no white border, no sticker
> die-cut outline**, no baked-in drop shadow. One clean object only.

> STYLE DECISION (parent, 2026-06-16): **Option A — clean dark outline, no white border.** An earlier
> "collectible-sticker" phrasing baked a white die-cut halo on some icons; that wording is removed above.

Generate: `node tools/gen.mjs pic-<slug> --openai "{HOUSE STYLE} <subject>"` → lands in `art/incoming/`.
Then downscale to `art/` at 320px (Chromium canvas, preserves alpha) and add the slug to `PICIMG_SET`.

## SUBJECTS — wave 1 (learn keywords + cloze/scramble/sentence pics; 53 — emoji · slug · prompt)

| emoji | slug | subject |
|---|---|---|
| ☀️ | sun | a smiling friendly sun with rays |
| 🍎 | apple | a shiny red apple with a green leaf |
| 🐯 | tiger | a cute orange tiger cub face, friendly |
| 🐷 | pig | a cute pink pig, friendly |
| 🐜 | ant | a friendly cartoon ant |
| 🪺 | nest | a bird nest with three speckled eggs |
| 🐵 | monkey | a cute brown monkey face, friendly |
| 🐶 | dog | a cute puppy, friendly |
| 🐐 | goat | a cute white goat, friendly |
| 🐙 | octopus | a cute purple octopus, friendly |
| 🐱 | cat | a cute orange cat, friendly |
| 🪁 | kite | a colorful diamond kite with a tail |
| 🥚 | egg | a single smooth white egg |
| ☂️ | umbrella | an open red umbrella |
| 🚀 | rocket | a cartoon rocket ship blasting off |
| 🎩 | hat | a black top hat |
| ⚽ | ball | a classic black-and-white soccer ball |
| 🐟 | fish | a cute orange fish, side view, friendly |
| 🦁 | lion | a cute golden lion face with mane, friendly |
| 🫙 | jar | a clear glass jar with a lid |
| 🚐 | van | a cute rounded delivery van |
| 🕸️ | web | a round spider web |
| 🦊 | fox | a cute orange fox, friendly |
| 🪀 | yoyo | a colorful yo-yo with string |
| 🦓 | zebra | a cute black-and-white zebra, friendly |
| 👑 | crown | a golden royal crown with jewels |
| 🚢 | ship | a cute cargo ship on a wave |
| 🧀 | cheese | a wedge of yellow cheese with holes |
| 👍 | thumb | a cartoon thumbs-up hand |
| 🐳 | whale | a cute blue whale with a water spout, friendly |
| 🦆 | duck | a cute yellow duck, friendly |
| 💍 | ring | a gold ring with a sparkling gem |
| 🌧️ | rain | a rain cloud with blue raindrops |
| 🐝 | bee | a cute round bumblebee, friendly |
| ⛵ | boat | a small sailboat with a white sail |
| 🚗 | car | a cute rounded red car |
| 🌽 | corn | an ear of yellow corn with green husk |
| 🌿 | fern | a green fern leaf sprig |
| 🐦 | bird | a cute little blue bird, friendly |
| 🏄 | surf | a colorful surfboard |
| 🐸 | frog | a cute green frog, friendly |
| 🚂 | train | a cute steam train engine |
| 😴 | sleep | a cute sleeping face with closed eyes and Zzz |
| 🏃 | run | a cartoon child running, dynamic pose |
| 🐔 | hen | a cute white-and-red hen, friendly |
| 🐛 | bug | a cute green caterpillar bug, friendly |
| 🚲 | bike | a cute bicycle |
| 🐰 | rabbit | a cute white rabbit, friendly |
| 🌹 | rose | a single red rose with a green stem |
| 🦴 | bone | a white dog bone |
| 🛏️ | bed | a cozy bed with a pillow and blanket |
| 🤴 | prince | a friendly cartoon prince with a small crown |
| 🌳 | tree | a round green leafy tree with a brown trunk |

## SUBJECTS — wave 2 (READWORDS / READWORDS2 / Warm-Up pool; 53 — emoji · slug · prompt)

| emoji | slug | subject |
|---|---|---|
| 🥤 | cup | a colorful kids drink cup with a straw |
| 🚌 | bus | a cute yellow school bus |
| 🎒 | bag | a kids backpack |
| 🧢 | cap | a baseball cap |
| 🍳 | pan | a black frying pan |
| 🥜 | nut | a brown peanut in its shell |
| 🪭 | fan | a folding paper hand fan, open |
| ☕ | mug | a steaming hot mug |
| 🍲 | pot | a cooking pot with a lid |
| 🤗 | hug | two cute round happy characters hugging |
| 🥅 | net | a soccer goal net |
| 🍞 | bun | a round bread bun |
| 🍟 | chip | a serving of golden french fries |
| 🧦 | sock | a single striped sock |
| 🏪 | shop | a cute little storefront shop |
| 🛁 | bath | a bathtub full of bubbles |
| 🧔 | chin | a friendly cartoon boy face smiling |
| 🪽 | wing | a single white feathered wing |
| 🍽️ | dish | a dinner plate with a fork and knife |
| 🥁 | drum | a colorful toy drum |
| 🚩 | flag | a red flag on a pole |
| 🦀 | crab | a cute red crab, friendly |
| ⭐ | star | a friendly smiling gold star |
| ✋ | hand | a cartoon open hand showing the palm |
| 🦘 | jump | a cartoon child jumping joyfully |
| 💡 | lamp | a bright glowing yellow light bulb |
| ⛺ | tent | a camping tent |
| 😷 | mask | a colorful costume eye mask |
| 🛷 | sled | a wooden snow sled |
| 🎁 | gift | a wrapped present with a bow |
| 🪤 | trap | a wooden mouse trap |
| 🥛 | milk | a tall glass of milk |
| 🎂 | cake | a birthday cake with candles |
| 🚪 | gate | an arched wooden gate |
| 🏠 | home | a cute cozy house |
| 🧊 | cube | a single clear ice cube |
| 👃 | nose | a cartoon nose |
| 🦶 | feet | a pair of cute cartoon bare feet |
| 🧥 | coat | a warm buttoned winter coat |
| 🌱 | seed | a small green sprouting seedling |
| 🍴 | fork | a shiny dinner fork |
| 👧 | girl | a cute cartoon girl, friendly |
| 🧣 | fur | a cozy fuzzy fur scarf |
| ⛪ | church | a small white church building |
| 🌅 | sunset | a colorful sunset over the ocean |
| 🌭 | hotdog | a hot dog in a bun with mustard |
| 💻 | laptop | an open laptop computer |
| 🧲 | magnet | a red horseshoe magnet |
| 🧺 | basket | a woven wicker basket |
| ⛑️ | helmet | a construction safety helmet |
| 🤖 | robot | a cute friendly robot |
| 🍋 | lemon | a bright yellow lemon |
| 🐤 | robin | a cute red-breasted robin bird |
| 🐅 | (tiger) | reuses `pic-tiger.png` (second tiger glyph) |
