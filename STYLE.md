# STYLE.md — Super Teddy Design System

> North star: make the whole game look like a **real studio shipped it** — vibrant,
> heroic, premium — while staying 100% static HTML/CSS/JS (no build step). This doc
> is the contract. It records the tokens that are **actually in `styles.css`** today,
> the **target** look we're driving toward, and the **gap** between them so a polish
> pass is a checklist, not a guess.

Files: `styles.css` (all styling), `art.js` (SVG characters), `index.html` (markup).
Everything here must survive GitHub-Pages-with-no-build.

---

## 0. Non-negotiables (pedagogy > aesthetics)
These come from CLAUDE.md and **override** any visual rule below:
1. **Letters & words use Andika** (the literacy font) — never Bangers/Impact for actual
   letter/word *content* the child reads. Bangers/Impact are for titles & UI chrome only.
2. **Touch targets ≥ ~96px** for anything a child taps (tiles, slots, buttons).
3. **High contrast** everywhere; text must stay legible over painted backgrounds.
4. **Sound-ID prompts never show the target letter** (anti-gaming) — a styling rule too:
   don't add decorative letterforms to prompt panels.
5. Visual energy (flashes/bursts/shake) is **encouraged** (no photosensitivity). Respect
   `prefers-reduced-motion` as a courtesy toggle only.

---

## 1. Color tokens
Defined as CSS variables in `:root` (`styles.css`). **Use the variable, not the hex.**

| Token | Current value | Role |
|---|---|---|
| `--ink` | `#150f2e` | The universal black-ish outline / borders / text-stroke |
| `--sky1 / --sky2 / --sky3` | `#171236 → #3a2d7d → #7a4fb6` | Cosmic background gradient (body) |
| `--blue / --blueD` | `#3b82f0 / #2257c4` | Hero blue (suit, blue buttons, ear button) |
| `--gold / --goldD` | `#ffc93c / #f0a82b` | Energy/accent (titles, gold buttons, stars, coins) |
| `--red` | `#e6453c` | Hero cape / heart letters / alerts |
| `--green` | `#3ec97e` | Success (correct, filled slots, ✓) |
| `--purp` | `#6b2fa0` | Gem purple / villain accents |
| `--panel` | `#fff6e3` | Light speech-bubble panel + body text color (`--txt`) |
| `--txt` | `#fff6e3` | Default text (warm white) |

### Target palette (your spec) → mapping
The brief asks for a punchier, more "premium" set. Adopt by **editing the variables**
(one-line changes ripple everywhere). Recommended target values:

| Token | → Target | Notes |
|---|---|---|
| `--blue` | `#00aaff` | Brighter "electric" hero blue (spec) |
| `--gold` / `--goldD` | `#ffcc00` / `#ff9900` | Hotter energy gradient (spec) |
| `--purp` | `#bb77ff` | Vibrant gem purple (spec) — also for panel glow borders |
| `--green` | `#22ffaa` | Brighter success (spec) |
| `--sky1` / `--sky2` | `#0b051f` / `#2a1b5e` | Deeper cosmic gradient (spec) |
| *(new)* `--panelDark` | `#1f1638` @ ~90% opacity | Dark modal/panel base (spec) — see §4 |

> ⚠️ This is a **live visual change** to a game a child uses daily. Land it as one
> deliberate "palette refresh" commit, eyeball it on the iPad, and keep the contrast
> checks (white text + `--ink` outline) intact. Don't scatter raw hexes.

---

## 2. Typography
Three fonts, three jobs (loaded in `index.html`):

- **Bangers** (`.comic`) — hero titles, banners, button labels, zap-words. Huge, condensed,
  comic-book energy. Thick `--ink` outline via `-webkit-text-stroke` + gold gradient fill.
- **Baloo 2** (body default) — rounded, friendly UI/system text (labels, notes).
- **Andika** (`.read`) — **literacy font. All letter/word content the child decodes.**
  Clear, single-story `a`/`g`, dyslexia-friendly. Mandatory for tiles/slots/words.

### Title recipe (the "premium" look)
```css
.title-logo{
  font-family:'Bangers',cursive;
  font-size:clamp(54px,10vw,110px);
  color:var(--gold);
  -webkit-text-stroke:8px var(--ink);
  paint-order:stroke;            /* stroke behind fill = crisp edges */
  letter-spacing:.04em; line-height:.95;
}
```

### Text over painted backgrounds
Titles use `-webkit-text-stroke`. For **non-title** text sitting directly on a painted
scene (no panel behind it), use the outline utility instead of a stroke:
```css
.txt-outline{ text-shadow:4px 4px 0 #000, -2px -2px 0 #000; }  /* per spec */
```
Body/instruction text should normally sit on a **solid panel** (`.bubble`) for max
legibility — prefer a panel over relying on shadow.

---

## 3. Buttons
**Today:** `.btn` (gold capsule), `.btn.blue` (hero blue), `.btn.ghost` (outline).
All share: Bangers, uppercase-ish, `--ink` border, chunky "extruded" `box-shadow` that
**compresses on `:active`** (the satisfying press). This already matches the spec's intent.

### Canonical recipe (gold "hero" button — current `.btn`)
```css
.btn{
  font-family:'Bangers',cursive; font-size:clamp(26px,4.5vw,40px); letter-spacing:.06em;
  color:var(--ink);
  background:linear-gradient(180deg,#ffd75e,#f0a82b);   /* → target: var(--gold),var(--goldD) */
  border:5px solid var(--ink); border-radius:26px; padding:16px 38px;
  box-shadow:0 8px 0 #9c6a12, 0 14px 24px rgba(0,0,0,.35);
  transition:transform .12s ease, box-shadow .12s ease;
}
.btn:active{ transform:translateY(6px); box-shadow:0 2px 0 #9c6a12; }  /* press = compress */
```

### Spec asks (`.hero-btn`) — what to add for "premium"
The brief's `hero-btn` is `.btn` **plus**: a thicker border (6–8px), bigger radius, and a
**shine/glow**. Rather than a new class, level up `.btn` (one source of truth) with a
shine pseudo-element + optional glow:
```css
.btn{ border-width:7px; position:relative; overflow:hidden; }
.btn::after{                      /* glossy top sheen */
  content:""; position:absolute; inset:0 0 55% 0; border-radius:26px 26px 60% 60%/26px 26px 30% 30%;
  background:linear-gradient(180deg,rgba(255,255,255,.55),rgba(255,255,255,0)); pointer-events:none;
}
.btn.glow{ box-shadow:0 8px 0 #9c6a12, 0 0 22px var(--gold), 0 14px 24px rgba(0,0,0,.35); }
```
Keep **press compression** and **≥96px tap height** on every variant.

---

## 4. Panels & modals
**Today:**
- `.bubble` — the speech/instruction panel: solid `--panel` (warm cream), `--ink` border,
  rounded, with a circular **`.ear` replay button** (every prompt has one — required).
- `#settingsPanel`, `#shopPanel` — full-screen overlays: dark `rgba(10,8,24,.9x)` scrim,
  centered column, scrollable.

### Target modal (spec: dark purple + blur + glowing purple border)
```css
.modal-scrim{ position:absolute; inset:0; background:rgba(11,5,31,.78);
  backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); z-index:20;
  display:flex; align-items:center; justify-content:center; }
.modal-panel{
  background:rgba(31,22,56,.92);                 /* --panelDark @ ~90% */
  border:4px solid var(--purp);                  /* glowing gem-purple edge */
  box-shadow:0 0 26px rgba(187,119,255,.55), 0 18px 40px rgba(0,0,0,.5);
  border-radius:24px; padding:22px 20px; max-width:min(680px,94vw);
}
```
> The `.bubble` (light cream) stays as-is — it's the **child-facing reading panel** and the
> high cream contrast is deliberate for legibility. The dark/blur/glow treatment is for
> **grown-up/secondary modals** (settings, shop), keeping a clear visual hierarchy:
> *cream = "read this", dark-purple = "system/parent".*

---

## 5. Gameplay components
| Component | Class | Rule |
|---|---|---|
| Answer tile / gem | `.tile`, `.tile.read` | Andika, ≥96px, big rounded; `.win` = green pop, `.dim` = greyed (gentle wrong), `.hint` = pulse the correct one |
| Build slot | `.slot` | Dashed `--ink` box; `.filled` = solid green pop; `.heartslot` = pink + ♥ badge (sight-word irregular letter) |
| Letter gem (collection) | inline SVG | Hex gem in `GEMCOLOR[grapheme]`; Andika glyph; only **earned** gems shown |
| Progress pips | `.pip` / `.pip.off` | Lives/HP dots — never used as a *failure* counter |
| Boss sprite | `.boss` | `inkblotSVG` (Vex) Act 1 / `dragonSVG` Act 2; `.hitfx` shake, `.flee` exit |

Color-code graphemes consistently via `GEMCOLOR` (game.js) so a letter is "the same color"
everywhere it appears.

---

## 6. Motion & juice
Defined in `styles.css` + `game.js` FX helpers. All effects **auto-remove** (can't hang a
flow) and **soften under `prefers-reduced-motion`**.

| Effect | Trigger | Class / fn |
|---|---|---|
| Correct burst + sparks | every correct tap | `burstAt()` (`.burst`,`.spark`) |
| Screen shake + flash | big hits (word forged, boss zap) | `shakeStage()`, `flashScreen()` |
| Confetti | mission win (more on milestones) | `confetti()` |
| Combo chip | 3+ correct in a row | `comboPop()` (`.combochip`) |
| Coin float | Training-Room rep | `coinFloat()` |
| Node/letter pop | UI feedback | `@keyframes pop`, `mappulse` |
| Press compress | every button | `.btn:active` |
| Float/hover | idle interactive elements | add `@keyframes float` (subtle ±4px) |

Targets/easing: micro-feedback ~`.12s`; pops `.4–.5s ease`; nothing decorative over ~1s.

---

## 7. Layout & spacing
- One `#stage` (max-width 1180px) holds absolutely-positioned `.screen`s; one is `.on`.
- Generous gaps (12–18px), centered columns, big margins — never cramped.
- Painted scene = `#bgLayer` behind everything (`BG_MAP` swaps per screen; transparent
  fallback keeps the SVG/gradient look if an art file is missing). **Everything else must
  match the painted-art quality** — that's the whole point of this doc.

---

## 8. Gap analysis (current → target "premium")
A concrete checklist for a future "polish pass" commit:
- [ ] Refresh the 6 palette variables to the target hexes (§1) — single commit, verify on iPad.
- [ ] Add `--panelDark`; convert `#settingsPanel`/`#shopPanel` scrims to blur + gem-purple glow border (§4).
- [ ] Level up `.btn` with the sheen pseudo-element + optional `.glow`; bump border to 7px (§3).
- [ ] Add `.txt-outline` utility for any text that sits directly on painted art (§2).
- [ ] Add a subtle `float` idle animation to primary CTAs (reduced-motion aware).
- [ ] Audit every screen for ≥96px tap targets and white-text-on-painted contrast.
- [ ] Keep Andika on all letter/word content; never restyle reading content with title fonts.

> Recommendation: do the polish pass as **one reviewable "visual refresh" commit** so the
> before/after is clear and easy to roll back, rather than drip-changing styles.

---

## 9. Performance budget (premium ≠ heavy)
The overhaul must look like a studio made it **without taxing the engine** — this runs on a
child's iPad, often an older one. "Premium" comes from **craft** (consistent depth, color,
type, spacing, timing), not from piling on expensive effects. Hard rules:

- **Depth via CSS, not images.** Use gradients + layered `box-shadow` + the existing extruded-
  button look. Avoid large PNG textures (bandwidth + memory); the painted `#bgLayer` is the
  *only* heavy raster, and it's one per screen, cached.
- **`backdrop-filter: blur()` is expensive — use it sparingly.** OK on a *static* modal scrim
  (settings/shop). **Never** on a scrolling container (the map) or on many elements at once.
  Provide a non-blur fallback (solid `rgba`) so it degrades gracefully.
- **Animate only `transform` and `opacity`** (GPU-composited). Avoid animating `box-shadow`,
  `width/height`, `top/left`, `filter`, or `background-position` in loops — they trigger
  layout/paint every frame.
- **No per-frame JavaScript for ambient motion.** Use CSS `@keyframes`. The only JS-driven
  visuals are discrete, self-removing FX (`burstAt`, `confetti`, …) capped in count.
- **Cap concurrent particles.** Confetti ≤ ~110, sparks ≤ 6/burst; everything auto-removes
  within ~1–2.3s. Don't spawn ambient particle systems.
- **The map is the perf hotspot** (one big inline SVG, many nodes + quadratic trail). Keep it
  static (no animated nodes/trail); if it ever janks on-device, simplify *distant* decor
  (fewer stars/clouds/gem-deco) rather than adding effects. Don't add blur/filters to it.
- **Reuse, don't re-render.** Repaint a screen on entry, not on a timer. No polling loops that
  touch the DOM (the 1s daily tick only mutates a counter, not layout).
- **Fonts:** 3 families, already subset by Google Fonts; don't add more font weights/families.
- **Respect `prefers-reduced-motion`** — it already softens/disables the heavy FX; keep new
  effects behind that check.

Litmus test for any new visual: *does it hold 60fps on a 4-year-old iPad?* If it needs blur
on scroll, animates layout properties, or runs JS every frame — redesign it.

