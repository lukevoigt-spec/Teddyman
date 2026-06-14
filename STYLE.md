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

## 0.5 Per-act theming — PARKING LOT (planned, not built)
The game should **re-skin its non-learning chrome per act** so each act has its own world feel,
while the **learning content keeps its ideal font (Andika) and high contrast unchanged**.
- **Act 1 = Star Force City** — the current cosmic/superhero look (Bangers titles, neon-gold).
- **Act 2 = "MAGIC KINGDOM"** (rename from "MEDIEVAL REALM") — a **medieval / fantasy** skin
  like the popular medieval mobile games: parchment/stone textures, banner/shield panels,
  a blackletter-or-chiseled **display font** for titles & UI chrome (NOT for letter content),
  torch-gold + deep-purple palette, wax-seal/iron buttons, heraldic flourishes.
- Implementation idea (keeps it clean + performant): theme via a `body[data-act="2"]` (or a
  `.theme-medieval` class on `#stage`) that overrides the chrome tokens/fonts only. Swap on
  `setAct()`. **Never** touch the `.read`/Andika literacy styling or the tile/slot legibility.
- Display fonts are **UI-only**; load one medieval display face (e.g. a Google "Cinzel"/
  "MedievalSharp"-style), keep Andika + Baloo for everything the child must read.
> Status: PARKED. The `ACTS[1].city` string + this medieval skin land together in a future
> "Act-2 look" pass. The city rename alone is a 1-line change whenever wanted.

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

### Juice philosophy (1 line)
**Layer many small effects (motion + scale + flash + a number + sound) over one big one — and juice the REWARD layer,
NEVER the active learning prompt.** Full principles in `AGENTS.md` ("how we juice"); mechanics + feasibility in
`DESIGN-ENGAGEMENT.md §8`.

### Easing tokens (use these, not bare `ease`)
Add to `:root` and reference by name so motion reads consistently:
| Token | Curve | Use for |
|---|---|---|
| `--ease-overshoot` | `cubic-bezier(.34, 1.56, .64, 1)` (easeOutBack) | the satisfying **bounce/settle** — pops, counter arrival, reward reveal |
| `--ease-accelerate` | `cubic-bezier(.55, .085, .68, .53)` (easeInQuad) | coins/sprites **accelerating into** the counter (magnetize) |
| `--ease-soft` | `ease-out` | gentle fades / glow settle |
For a springier reward beat, `easeOutElastic` is allowed on the *counter* only (never on text the child reads).

### Reward-viz patterns (research-backed — TO BUILD; see DESIGN-ENGAGEMENT.md §8.2–8.3)
The polished reward = **3–5 of these stacked**, all `transform`/`opacity` only (GPU), via Web Animations API / CSS —
**no library, no build step**, pool the DOM nodes:
| Pattern | What | Build as |
|---|---|---|
| **Magnetize stream** | sprites scatter out, then get *sucked* to the HUD counter (staggered, curved path) | `flyReward(fromEl,toEl,n)` — mission/chest payouts |
| **Number-only tween** | just **count the value up** (never *set* it) + scale-bounce | tiny per-rep coins (keeps the learning screen calm) |
| **Counter reaction** | the destination **counts up + scale-bounces (`--ease-overshoot`) + glows** | every coin/gem/XP change — the underrated half |
| **`+N` popup** | floating number rises + fades at the source (bigger on combo) | reward moments |
| **Secondary stack** | flash · `confetti()` · pitch-**laddered** `Sfx.coin` · glow | layer under the above |
**Timing:** whole reward ~500–700ms; stagger 30–50ms; count-up ~300ms. One reusable `flyReward()` helper covers coins,
gems, XP; central call sites already exist (`record()`, `trainWin`, chest-open). Replaces the simpler live `coinFloat()`.

### Detail-tier degradation (one code path, three budgets)
Every new juice effect maps onto the existing `S.detail` tiers (reuse `applyDetail()` / `body.calm` / `body.lite`):
**Full** = full magnetize + sprites + glow → **Calm** = fewer sprites (or number-tween only) + bounce + sound →
**Lite / `prefers-reduced-motion`** = **instant set** + a single pulse + sound (no sprites). All effects still
auto-remove and can't hang a flow.

---

## 7. Layout & Navigation
### 7.1 Layout & spacing (structure)
- One `#stage` (max-width 1180px) holds absolutely-positioned `.screen`s; one is `.on`.
- Generous gaps (12–18px), centered columns, big margins — never cramped.
- Painted scene = `#bgLayer` behind everything (`BG_MAP` swaps per screen; transparent
  fallback keeps the SVG/gradient look if an art file is missing). **Everything else must
  match the painted-art quality** — that's the whole point of this doc.
- **Landscape-first.** Research on ADHD learners favours a stable landscape stage for focus; our
  fixed `#stage` already assumes it. Don't design portrait-only layouts.

### 7.2 Navigation philosophy (1 line)
**For a pre-reader with ADHD, good navigation = exactly ONE obvious thing to do per screen, in the SAME place every
time, shown by icon + audio (never text alone) — and the learning content is the single focal point; chrome recedes.**
Full principle in `AGENTS.md`; the open UI/NAV work it drives is the CLAUDE.md "UI / NAV BACKLOG".

### 7.3 The authorities (what we're standing on)
Layout/nav has its own canon, the equivalent of the juice canon:
- **Game-UI taxonomy** — *diegetic · non-diegetic · spatial · meta* (Fagerholt & Lorentzon, "Beyond the HUD", 2009). We
  already span it: the city-name HUD chip + bubble = **non-diegetic** chrome; the painted map nodes ("you are here",
  done/current/locked) = **spatial** wayfinding; cinematic grade/letterbox = **meta**. Prefer **spatial** cues for
  wayfinding (a pre-reader reads a *journey*, not a menu) and keep critical controls **non-diegetic and dead-obvious**.
- **Usability heuristics** — Nielsen's 10 + the **game-specific PLAY/Pinelle** sets (game usability = "the degree to
  which a player can *learn, control, and understand*"). The ones we live by: **visibility of system status** (always
  show where he is + what's next), **user control & freedom** (an exit/Home/⏭ is *always* present — also hard
  constraint #8), **consistency & standards**, **recognition over recall**, **minimalist design**, **error
  prevention/forgiving** (no dead-ends, no fail states).
- **Interaction laws** — **Hick's Law** (decision time grows with choices → *one* primary action per screen, demote the
  rest); **Fitts's Law** (big + close = fast; screen **corners/edges are "infinite" targets** → park persistent
  controls there); **Jakob's Law** (match game/app conventions players already know); **Miller's Law** (cap simultaneous
  items); **Norman** affordances/signifiers + feedback and **Krug**'s "don't make me think" (a control must *look*
  tappable and self-evident); **progressive disclosure** (child surface minimal; parent/advanced behind the Grown-Up
  gate); **Gestalt** proximity/common-region for grouping.
- **Touch ergonomics** — Apple HIG **44pt** / Material **48dp** are *floors*; we exceed at **~96px** (non-negotiable
  #2). **Thumb zones** (Hoober): on a two-handed landscape tablet the easy reach is the **bottom + bottom corners**;
  top-centre is the "stretch" zone → put **status up top, ACTIONS at the bottom/corners** (this is exactly why the map
  feels crammed — painted objects + controls fight in the top).

### 7.4 Our navigation rules (apply these)
1. **One primary action per screen** (Hick) — the single big "what do I do now" CTA, visually dominant; everything else
   is demoted/secondary. *(This is the fix for the "START vs CONTINUE do the same thing" jank — two co-equal primaries
   is the violation.)*
2. **Persistent global nav, identical every screen** — the city-chip menu (World Map / Hero Base / Home) lives in the
   **same spot on every screen incl. the title**, so he never hunts. Consistency > cleverness (Jakob).
3. **Icon + audio, never text alone** (pre-reader) — every control has a clear glyph **and** a tap-to-hear; the same
   concept always uses the **same icon/color** (recognition, not recall). No control depends on reading a word.
4. **Status top, actions bottom/corners** (Fitts + thumb zones) — HUD/status along the top; primary + persistent
   controls along the bottom and in the reachable corners, off the painted focal area.
5. **Spatial wayfinding** — the map is a literal **journey** (done ✓ / current pulse / locked 🔒); "you are here" is
   always unmistakable, so progress reads without literacy.
6. **Always an exit** — Home / Back / ⏭ skip present on every screen and never disabled (user control & freedom +
   constraint #8); a child can never get lost, stuck, or trapped by audio.
7. **One focal point = the learning content** — size/color/motion hierarchy makes the decodable content the brightest,
   most central thing; chrome is quieter (ties to non-negotiable #4 and the juice rule "never juice the prompt").
8. **Forgiving & predictable** — same gesture does the same thing everywhere; no hidden modes; no dead-ends. Errors are
   prevented, not punished.

### 7.5 Where this lands (the open backlog)
These rules are the lens for CLAUDE.md's **UI / NAV BACKLOG**: (iii) START-vs-CONTINUE jank = rule #1; (i) "plain
buttons" = affordance/signifier craft (§3) so a button *reads* as pressable; (ii) the title Hero-Base shortcut's
placement = rules #2/#4; and the **Settings overhaul** = progressive disclosure + game-convention layout (Jakob — lay
it out like settings in real kids' games). Re-skin per act (§0.5) but keep the *nav structure* identical across acts.

### 7.6 Sources
[Diegetic/non-diegetic/spatial/meta UI taxonomy](https://medium.com/@lorenzoardeni/types-of-ui-in-gaming-diegetic-non-diegetic-spatial-and-meta-5024ce6362d0) ·
[Game UX & diegesis theory](https://uxdesign.cc/understanding-ux-in-video-games-diegesis-theory-f59d5a94cbcf) ·
[PLAY game usability heuristics (Desurvire/Pinelle)](https://link.springer.com/chapter/10.1007/978-3-642-02774-1_60) ·
[Heuristic usability evaluation for educational games](https://files.eric.ed.gov/fulltext/ED621970.pdf) ·
[NN/g — touch target size](https://www.nngroup.com/articles/touch-target-size/) ·
[Thumb-friendly navigation](https://pageoneformula.com/designing-for-thumb-friendly-navigation-2/) ·
[Designing an interactive learning app for ADHD children](https://www.matec-conferences.org/articles/matecconf/pdf/2018/56/matecconf_aasec2018_16008.pdf).

---

## 8. Gap analysis (current → target "premium")
> ✅ CHROME POLISH PASS APPLIED (the appended "CHROME POLISH" block in styles.css):
> palette nudged brighter; buttons got a glossy sheen + glow + crisp press; HUD
> chips/round-buttons + ghost buttons + panel cards are frosted glass (backdrop-blur);
> the instruction bubble lifts with a soft halo; tiles/slots got gloss highlights +
> stronger lift (win = green glow); characters/art get a grounding drop-shadow (hero a
> faint blue glow); a cinematic vignette sits over the painted scene; loose labels got
> shadows for legibility; title got a warm glow. Tunable — dial in on-device.
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
PRIMARY TARGET DEVICE: **iPad Pro (M3)** — so we can be **generous** with blur, shadows,
gradients, and particles; performance is not the bottleneck and "premium" effects are
encouraged. The rules below are now **good-practice guidelines** (for graceful degradation
on his sisters' devices / other cloud-synced iPads), **not** hard limits. "Premium" still
comes mostly from **craft** (consistent depth, color, type, spacing, timing) rather than
sheer effect volume — a tasteful heavy effect beats ten cheap ones. Guidelines:

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

Litmus test: on the **M3 target** virtually anything holds 60fps, so build the beautiful
version first. Only if a *secondary* device (an older sister's iPad) janks should you reach
for the degradations above (or gate them behind `prefers-reduced-motion` / a capability check).

