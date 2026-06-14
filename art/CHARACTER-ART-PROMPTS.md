# Character Art — Generation Prompts (for the marquee "hero" pieces)

The in-game cast is parametric **SVG** (art.js) — now with a proper shading pass, good
enough for the wider cast. For the few **marquee likenesses** (Teddy himself + real family
members) we want painted-quality raster art. Claude can't generate images in the cloud
session, so the workflow is:

1. **You generate** the image from the prompt below in your image tool (or send Claude the
   reference photo + ask for a tuned prompt).
2. **Drop the file** in `art/` named as noted (PNG, transparent background).
3. **Claude integrates** it: masks/frames it, adds the glow/aura/idle bob to match the SVG
   cast, wires it into the hero card / cutscene, and render-verifies it.

## HOUSE STYLE (paste this into every prompt so the cast stays cohesive)

> Premium children's-game character illustration, **stylized semi-flat vector look with soft
> painterly shading** — clean bold outlines, smooth gradient shading with a clear top-left key
> light, gentle ambient-occlusion, a soft rim light, rounded friendly proportions (slightly
> large head, chibi-heroic). Vivid saturated palette on a **transparent background**, full
> body, facing forward in a confident heroic pose, centered, generous margins. NOT photoreal,
> NOT 3D render, NOT anime. Wholesome and age-appropriate for a 7-year-old's app.

## CONSTRAINTS (hard — from CLAUDE.md)
- Wholesome / age-appropriate for every character (heroic & strong is fine; never sexualized).
- Match the world: Act 1 = superhero "Star Force City"; Act 2 = medieval "Magic Kingdom" knight.
- Keep letter/reading tiles untouched (this is character art only).

## PER-CHARACTER PROMPTS (fill the [REAL-PERSON DETAILS] from a photo)

**Super Teddy (hero):** `{HOUSE STYLE}` A brave 7-year-old boy superhero, [hair], blue
gem-lens glasses, blue super-suit with a gold hexagon "T" emblem, red cape, hands on hips,
big confident grin.

**Archie "Tank":** `{HOUSE STYLE}` A strong athletic boy, golden-blond longer tousled hair,
[build], sporty hero, flexing one arm, big smile.

**Ellie "Flip":** `{HOUSE STYLE}` A girl gymnast hero, [hair], sparkly leotard, graceful
arms-up finish pose, ballet slippers.

**Amelia "Heartguard":** `{HOUSE STYLE}` A petite kind girl hero, [hair], cute teal dress with
a pink sash, gentle caring smile.

**Leighton (Starlight Princess):** `{HOUSE STYLE}` A girl princess hero, [hair], flowing
lavender gown, flower crown, holding a small bouquet, kind smile, faint starlight glow.

**The Vixen (Act-2 villain):** `{HOUSE STYLE}` An elegant smooth-talking villainess
(Scarlett-Overkill energy), pink-to-crimson hair, dark horned headdress, glowing green eyes,
dark gown — stylish and menacing but cartoon, not scary-realistic.

> Send Claude the file name once dropped in `art/` and it will wire it in + show a render.
