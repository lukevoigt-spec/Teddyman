# Art — painted scene backgrounds

Drop painted background images here to reskin the game. Each screen looks for a
file named `bg-<slot>.jpg`. **If the file isn't here, the game just uses its
original look** — so you can add scenes one at a time, with zero risk.

- Format: **`.jpg`**, exact filename from the table below (all lowercase).
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

I'll write the remaining prompts (base, learn, lab, victory, intro, rest) as we
lock the look from these first few.
