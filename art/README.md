# Art — painted scene backgrounds

Drop painted background images here to reskin the game. Each screen looks for a
file named `bg-<slot>.jpg`. **If the file isn't here, the game just uses its
original look** — so you can add scenes one at a time, with zero risk.

- Format: **`.jpg`**, exact filename from the table below (all lowercase).
- **Per-act art:** Act 2 (the medieval realm) prefers its own scene named
  `bg-<slot>-a2.jpg` and falls back to the Act-1 `bg-<slot>.jpg` if absent. So you
  can give Act 2 a medieval look one file at a time. (Act 1 just uses `bg-<slot>.jpg`.)
  See the **Act 2 — Medieval Realm** section at the bottom for those prompts.
- The image is shown **cover-cropped** to fill the screen, so make it large and
  keep the important stuff toward the centre with some breathing room at the
  edges (the very edges may get cropped on some screens).
- Suggested size: **~2048 × 1536** (landscape 4:3). Bigger is fine.
- **Environments only — no characters, no text/letters/words anywhere.**
  Characters (Super Teddy, Lord Vex, allies) are drawn on top in the app.

## Slots

| File | Screen(s) | Scene |
|---|---|---|
| `bg-title.jpg`   | Title          | Establishing hero shot of the city |
| `bg-intro.jpg`   | Story intro    | Cinematic story backdrop |
| `bg-lab.jpg`     | Power Scan     | Gem-lens calibration lab |
| `bg-city.jpg`    | City Map, Find | The world-map vista |
| `bg-base.jpg`    | Hero Base      | Hero HQ / gear room |
| `bg-learn.jpg`   | Learn, Trace   | Magical training chamber (big open centre) |
| `bg-battle.jpg`  | Boss, Forge    | Tense city battle scene |
| `bg-victory.jpg` | Victory        | Triumphant celebratory sky |
| `bg-rest.jpg`    | Hero Rests     | Calm city sunset |

## Shared style preamble (paste before every prompt for a consistent look)

> Painterly comic-book illustration for a children's superhero reading game,
> "Star Force City" — a vibrant metropolis powered by giant glowing crystal
> gems. Modern animated-film background quality: bold clean shapes, rich
> saturated high-contrast colour, dramatic but friendly lighting, subtle
> texture, sense of depth/parallax. NObody in frame (environment only), and
> absolutely NO text, letters, words, numbers, or signage. No harsh strobe or
> flicker patterns. Keep the central area relatively open so characters and
> buttons read clearly on top. Landscape 4:3.

## First prompts to generate (start here)

**`bg-title.jpg`** — preamble + 
> Epic establishing shot at golden dusk: gleaming stylized towers with huge
> glowing sapphire, amber, and emerald crystal-gems embedded in the
> architecture, an aurora of energy in a warm-gold-into-deep-purple sky, a
> hopeful sense of wonder. Wide vista. Upper-centre sky left open for a logo.

**`bg-city.jpg`** — preamble +
> Adventure-game map vista of the whole city at twilight, seen from above and
> ahead: distinct glowing districts connected by a winding luminous golden
> path, crystal-gem rooftops, a heart-shaped tower glowing pink on one side,
> and a dark menacing fortress silhouette with a red glow far in the distance
> on a summit. Moon and stars, layered depth.

**`bg-battle.jpg`** — preamble +
> Tense nighttime city rooftop/street: crackling energy, ominous cold-blue and
> danger-red rim light, scattered debris, a heroic spotlight beam. Menacing
> mood implied by light and shadow only — no robots or figures drawn. Centre
> kept clear for action.

**`bg-intro.jpg`** — preamble +
> Cinematic wide storybook backdrop: a dramatic deep indigo-to-violet sky over
> the distant glittering gem-city skyline at night, a few sweeping searchlight
> beams and drifting energy motes, slightly tense but still hopeful. Neutral and
> uncluttered so comic story panels read on top.

**`bg-lab.jpg`** — preamble +
> A bright, friendly hero-tech calibration chamber: softly glowing lens rings
> and gentle scanner arches, floating holographic gem outlines, warm teal and
> gold light, clean and inviting (think a kid-safe lab). Calm, not clinical.
> Large open centre for floating gems.

**`bg-learn.jpg`** — preamble +
> A serene magical training sanctum where one enormous crystal gem floats and
> glows, casting soft warm light; smooth uncluttered surfaces, gentle particles,
> a focused spotlight pool in the middle. Big empty central space for a huge
> letter to sit. Warm, encouraging, low-distraction.

**`bg-base.jpg`** — preamble +
> The interior of a cosy superhero headquarters / gear room: shelves of glowing
> crystal gems, a weapon rack (a glowing hammer and sword), trophy lights, a big
> friendly window onto the gem-city skyline, warm golden lamplight. Collectible,
> homey, proud. Centre-floor kept open for the hero to stand.

**`bg-victory.jpg`** — preamble +
> Triumphant sunburst sky over the gem-city: radiant warm-gold light rays,
> drifting sparkles and confetti of light (soft, NO harsh flashing), a rainbow
> of gem glints, jubilant and celebratory. Centre kept open for the hero.

**`bg-rest.jpg`** — preamble +
> Peaceful dusk over Star Force City winding down: soft lavender-and-amber sunset,
> first stars appearing, gem-lights glowing gently warm in the towers, a calm
> hush. Soothing bedtime mood. Low contrast, restful.

> **Note on the map:** the City Map screen draws its own illustrated SVG scene in
> code, so a `bg-*` file mostly doesn't show *there*. `bg-city.jpg` shows on the
> gem-finding ("find") screens. Giving the **map itself** a per-act medieval skin
> is a separate code task (parked — see STYLE.md §0.5), not a background file.

---

# Act 2 — Medieval Realm (the "Magic Kingdom")

Act 2 is a knights-and-dragons fantasy world (mentor: Noah the Red, a red-bearded
wizard; villain: the Vixen, who morphs into dragons). Drop these as
**`bg-<slot>-a2.jpg`** and they replace the Act-1 scene only while playing Act 2.
Same rules: **environments only, no characters, no text/letters anywhere.**

## Medieval style preamble (paste before every Act-2 prompt)
> Painterly fantasy illustration for a children's reading game set in a magical
> medieval kingdom — castles, stone keeps, enchanted forests, dragons implied by
> mood only. Modern animated-film background quality (think a premium fantasy
> mobile game): bold clean shapes, rich saturated high-contrast colour, warm
> torchlight + cool moonlight, glowing magic runes and motes, banners and
> heraldry, a sense of depth and wonder. NObody in frame (environment only), and
> absolutely NO text, letters, words, numbers, runes-as-letters, or signage. No
> harsh strobe/flicker. Keep the central area open so characters and buttons read
> clearly on top. Landscape 4:3, ~2048×1536.

## Act-2 prompts

**`bg-city-a2.jpg`** — Find/quest backdrop — preamble +
> A sweeping medieval kingdom vista at magic-hour: a great stone castle and a
> walled village ("Stonekeep") on green hills, a winding torch-lit road, distant
> mountains with a dragon-keep silhouette and faint ember glow, banners snapping
> in the wind, glowing magic motes drifting. Layered depth, hopeful and grand.

**`bg-learn-a2.jpg`** — Learn/Read/Magic-E/Spell screens — preamble +
> A cosy wizard's study / spellery: warm candlelight, floating spellbooks and
> glowing rune-stones (abstract glyphs, NOT letters), a big enchanted hearth, soft
> magic particles, smooth uncluttered surfaces. Big open central space for a large
> glyph to sit. Calm, encouraging, low-distraction.

**`bg-battle-a2.jpg`** — Boss/Forge (Dragon Duel) — preamble +
> A dramatic castle battlements / dragon's lair at night: cold-blue moonlight and
> danger-red ember glow, smoke and sparks, a heroic shaft of light, ominous mood
> implied by light and shadow only (no dragon or figures drawn). Centre kept clear
> for the action.

**`bg-base-a2.jpg`** — Hero Base (knight's hall) — preamble +
> The interior of a cosy knight's great hall / armory: a stone hearth, a weapon
> rack (sword & shield), banners and trophies, shelves of glowing rune-gems, a big
> arched window onto the moonlit kingdom, warm torchlight. Proud, homey,
> collectible. Centre floor kept open for the hero to stand.

**`bg-victory-a2.jpg`** — Victory — preamble +
> A triumphant fantasy dawn over the kingdom: radiant gold light rays over castle
> spires and banners, drifting sparkles and gentle confetti of light (soft, NO
> harsh flashing), rainbow magic glints, jubilant. Centre kept open for the hero.

**`bg-rest-a2.jpg`** — Hero Rests — preamble +
> A peaceful medieval village at dusk winding down: soft lavender-and-amber sunset
> over thatched roofs and a castle, first stars, gentle window-glow and a campfire,
> a calm hush. Soothing bedtime mood, low contrast, restful.

**`bg-intro-a2.jpg`** — Act-2 cutscenes (Noah intro / interlude) — preamble +
> A cinematic fantasy storybook backdrop: a shimmering time-portal glow over a
> distant medieval kingdom at night, sweeping aurora-like magic light and drifting
> embers, slightly tense but hopeful. Neutral and uncluttered so story panels read
> on top.
