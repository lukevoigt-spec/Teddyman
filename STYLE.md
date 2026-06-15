# STYLE.md — Super Teddy Design System

> North star: make the whole game look like a **real studio shipped it** — vibrant,
> heroic, premium — while staying 100% static HTML/CSS/JS (no build step). This doc
> is the contract. It records the tokens that are **actually in `styles.css`** today,
> the **target** look we're driving toward, and the **gap** between them so a polish
> pass is a checklist, not a guess.

Files: `styles.css` (all styling), `art.js` (SVG characters), `index.html` (markup).
Everything here must survive GitHub-Pages-with-no-build.

---

## ★ THE ORACLE'S DESIGN CHARTER — research, benchmark, ELEVATE (prime directive, 2026-06-15)
This is The Oracle's **prime directive, and it overrides the "just maintain the current standards" default.** The bar is
NOT "meet our existing spec" — it is **make Super Teddy look and feel like a top-tier professional studio shipped it: the
best-looking kids' learning game on the iPad.** You are not merely the executor of this document — **you own and evolve
it.**

**Standing mandate:**
1. **Research the best, relentlessly.** Use your browser. Benchmark against the *actual* gold standard — AAA + top mobile
   game UI, the best children's educational games, modern design systems, Apple HIG, illustration/motion craft. Bring
   **concrete, named references + captured shots**, never vibes.
2. **Challenge our status quo — including standards Trinity or Neo wrote.** If a current rule, token, component, color, or
   art choice is mediocre, **say so and rewrite it.** "It's already in STYLE.md" is *not* a reason to keep it. Treat every
   existing standard as a draft you can raise; record the elevated version *with the reference that justifies it* so the
   bar ratchets UP and stays there. (This whole doc was written by non-designers — improve it without apology.)
3. **Prove elevation, don't assert it.** Every raise is backed by a §20 render and, where useful, a side-by-side against
   the reference you're matching. The Premium Bar is the **floor, not the ceiling** — push past it.
4. **Drive it through the system.** Propose the elevated standard (doc) → check **big aesthetic bets with the parent**
   (`AskUserQuestion` — "next level" is taste, and taste is his call) → implement via PR (Neo merges) → render-gate → repeat.

**The ONE boundary — sacred, never "challenged":** the pedagogy + child-profile **non-negotiables in §0** (Andika for
letter content, ≥96px targets, high contrast, audio-first, no-fail/no-timer, anti-gaming #4, **no-emoji #6**) and the
`CLAUDE.md` HARD CONSTRAINTS. Push the **craft** bar without limit; never trade away a learning or accessibility
constraint for polish. Premium **in service of a 7-year-old learning to read** — heroic, juicy, gorgeous, and still *his*.

**First move (don't silently repaint everything):** research → bring the parent a **benchmarked art-direction proposal**
(2–3 directions, named references, a sample render of each) via `AskUserQuestion`; let him pick; *then* drive it.

**RECORDED ANCHOR (parent, 2026-06-15):** aim for **top mobile-game polish — Supercell-tier (Clash Royale / Brawl Stars):
bold, glossy, juicy, high-energy, punchy reward moments — it should read as a LEGIT GAME a kid would *choose* to play,
NOT a "kids'-learning-app" look.** The learning lives *inside* that game feel. The parent named no single gold-standard
app (he'll react to your proposal), so research the exemplars yourself and bring 2–3 directions. Still anchored to the
existing taste signals (`CLAUDE.md`: Minecraft / superheroes / collection / Sneaky-Sasquatch-style progression).

— Trinity, recording the parent's mandate, 2026-06-15

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
6. **NO EMOJI in the child-facing UI. Ever.** This is the #1 amateur tell and it is now a hard
   rule, not a preference. Every glyph a child sees — nav, action buttons, shop/collection items,
   badges, counters, bullets — is a **crafted inline SVG** in the house art style (§13, §18), never
   an OS emoji and never "an emoji dressed up on a chip/disc." Emoji are someone else's clip-art:
   they render differently on every device, read like a text message, and have zero relationship to
   our painted world. Emoji are permitted in EXACTLY two places: (a) **parent-only** Grown-Up Corner
   *text* and (b) **dev docs/commit messages**. Enforced by a CI guard (`tests/ui-emoji.test.js`, §18)
   so a regression goes red before it reaches the iPad. *(Word-picture tiles already have the right
   pattern: `picIcon()`/`PICONS` in art.js — extend it to a UI icon registry, §18.)*
7. **The UI lives IN the world, not on top of it — and "premium" is the bar.** We ship painted
   backgrounds; do not bury them under stacks of translucent list-cards that read like a settings
   dashboard. Chrome should feel like part of the scene (objects in the room, frames on the wall),
   high-end-game polish, not a web form. **No visual change is "done" until it has been rendered with
   the shot harness and eyeballed against the Premium Bar rubric (§20).** Code-vs-doc review cannot
   catch "this looks cheap" — only looking can.

---

## 0.2 DESIGN COVERAGE MAP — our standards + the open gaps (Trinity, 2026-06-14)
Goal: **every aspect of the app follows award-winning-studio best practices.** This is the running index of design
DOMAINS — what has a standard, what's partial, what's still missing — so coverage is a checklist, not a guess.

| Domain | Status | Where / next |
|---|---|---|
| Visual system (color, type, buttons, panels, components) | ✅ | STYLE.md §1–5 |
| **Iconography / icon system** | 🔴 **standard §18** — EMOJI BANNED (impl pending, **TOP PRIORITY**) | crafted SVG icon registry replaces ALL UI emoji + CI guard; parent-escalated 2026-06-15 |
| **Premium diegetic Hero Room** | 🔴 **standard §19** (impl pending, **TOP PRIORITY**) | the painted lair IS the UI (hero + object hotspots), not floating list-cards; full spec DESIGN-ENGAGEMENT §4.2/§11 |
| **Render-review gate / Premium Bar** | ✅ **process §20** | screenshot-and-look mandatory before "done"; pass/fail rubric in §20 |
| Motion / visual juice + easing tokens + reward-viz | ✅ | STYLE.md §6 · DESIGN-ENGAGEMENT §8 |
| Sound design (SFX) | ✅ | STYLE.md §6.5 |
| Layout & navigation | ✅ | STYLE.md §7 |
| Reward economy / engagement / progression | ✅ | DESIGN-ENGAGEMENT §4–11 · §6.0 mastery contract |
| Performance budget | ✅ | STYLE.md §9 |
| Per-act theming | ✅ | STYLE.md §0.5 |
| Pedagogy / learning design | ✅ | CLAUDE.md · QA pedagogy specs |
| Error / no-fail states | ✅ | hard constraint #2 (gentle wrong) |
| Data / privacy / parental controls | ✅ | cloud auth + parent gate |
| Accessibility (generic) | n/a — single user | Teddy is the only user → no generic a11y standard; his needs are met directly (Andika, ≥96px, reduced-motion + Full/Calm/Lite tiers, gentle no-fail, audio-first) per §0 + CLAUDE.md. §10 = tombstone. |
| **Onboarding / FTUE** | ✅ **standard §11** (impl pending) | teach-through-play, I-do/we-do/you-do per new mechanic, fast first win, just-in-time, returning-kid re-entry; action checklist in §11 |
| **Narrative & voice/tone** | ✅ **standard §12** (impl pending) | per-role personas + script rules (simple/contractions/one-`!`/no-scold) + cutscene pacing; action checklist in §12 |
| **Art-direction bible** | ✅ **standard §13** (impl pending) | proportions/outline/lighting/palette/timing constants + reference render + per-character checklist; in §13 |
| **Animation principles (Disney 12)** | ✅ **standard §14** (impl pending) | anticipation→action→settle, arcs, staging, staged screen transitions; in §14 |
| **Haptics** | ✅ **standard §15** ⚠️ platform-limited | iOS Safari has NO Vibration API → "ready for a future native wrap," feature-detected no-op now; in §15 |
| **Information architecture / screen-flow map** | ✅ **standard §16** (impl pending) | screen→states→transitions blueprint, shallow tree, no dead-ends; diagram action in §16 |
| **Difficulty / flow & pacing** | ✅ **standard §17** (impl pending) | flow channel, mastery-gated difficulty, variety/novelty cadence, no spikes/grind; in §17 |
| Localization | n/a | single child, English |

**Status: every design domain has a written standard (§1–§20 + DESIGN-ENGAGEMENT + the contracts).** ⚠️ **2026-06-15
PARENT ESCALATION — the system shipped amateurish, emoji-heavy UI despite the standards.** Root cause: (1) emoji were the
de-facto icon system and **no standard forbade them** (a spec even said to dress emoji up on a disc — now reversed); (2)
there was **no iconography standard**; (3) reviews were code-vs-doc — **nobody rendered the screens**. Fixes are now in the
non-negotiables (#6 emoji ban, #7 UI-in-the-world + render gate) + the three new standards (§18 icon system, §19 premium
diegetic Hero Room, §20 render-review gate). **TOP-PRIORITY retro-fit for Neo** is the "Premium UI overhaul" brief at the
top of `DESIGN-ALIGNMENT.md`. New work builds to-standard + passes the §20 Premium Bar by default.

---

## 0.5 Per-act theming — ✅ SHIPPED (Act-2 medieval skin is LIVE via `body[data-act="2"]`)
The game **re-skins its non-learning chrome per act** so each act has its own world feel,
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
> Status: ✅ SHIPPED. The Act-2 stone/bronze chrome + the **MedievalSharp** display font (UI chrome only) are LIVE —
> ~35 `body[data-act="2"]` rules in `styles.css` (buttons, nav, bubble, scene grade, frame corners) + the
> "MAGIC KINGDOM" city rename. The notes above are the design intent, now realized — **refine** the skin, don't
> rebuild it. (Learning tiles stay Andika + high-contrast, untouched.)

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
`DESIGN-ENGAGEMENT.md §8`; **SFX/audio-juice standards in §6.5 below.**

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

### Sound design (SFX) — standards (the audio half of juice; engine = `sfx.js` Web-Audio `Sfx`)
SFX is half of "game feel." Distilled from the game-audio canon, tuned for Teddy (audio-first, ADHD, ND sensory).
Implement in `sfx.js` (Web Audio = oscillators + gain **ADSR** + frequency → all of this is cheap, offline, no
files/licensing — keep it synthesized). **Standards:**
1. **LAYER.** Important cues = 2–3 stacked elements (a body tone + a bright transient/sparkle), not one beep. Crisp
   reward = **fast attack + short decay** (ADSR) — the satisfying "plink."
2. **VARY (anti-repetition).** Never play an identical cue twice in a row: a small pool + **subtle, bounded** pitch
   (±~30–60 cents) / volume jitter per play. ⚠️ **ND-safe:** keep variation SUBTLE + predictable — ASD/ND profiles
   dislike *unpredictable/jarring* sound; vary to kill robotic fatigue, **never to startle.**
3. **PITCH = juice + info.** Ascending pitch = success; **pitch-ladder streaks** (each combo/coin step a semitone up)
   so a run *feels* like it's building.
4. **DON'T MASK THE VOICE (audio-first #8).** Narration owns the **mid band (~0.3–3 kHz)** → put confirmations low,
   sparkle high, keep mids clear; **duck SFX under any narration** (as Music already does); keep every SFX **short**.
5. **RESERVE for key events.** Punctuate the meaningful moments (correct / reward / unlock / win / mastery); don't
   sound everything — keeps the learning audio primary and avoids fatigue.
6. **POSITIVE bright / NEGATIVE gentle.** Success = cheerful chime/fanfare; "wrong" = a **soft, low** cue, **never**
   harsh/buzzer (hard constraint #2).
7. **MASTERY-WEIGHTED.** The richest, most-layered sting on **MASTERED! / rank-up**; routine coins stay simple +
   quieter (mirrors §6.0).
8. **Respect the controls.** Own volume `S.sfxVol` + off toggle (separate from voice/music) + reduced-audio; default gentle.
**Per-event quick spec:** correct = layered bright plink (fast attack/short decay) + subtle jitter · combo = pitch-ladder
up per step · coin = short staccato chime, laddering on a run · wrong = soft low "nope," no harshness · unlock/win =
layered fanfare swell · mastery = the biggest/brightest/most-layered sting (loudest in the kit).
*(Sources: pitch as aural juice + variation — [GameDeveloper](https://www.gamedeveloper.com/audio/the-power-of-pitch-shifting),
[A Sound Effect (repetition/fatigue)](https://www.asoundeffect.com/game-audio-immersion/); UI audio frequency-band +
ducking — [SFX Engine](https://sfxengine.com/blog/best-practices-for-game-ui-sounds),
[Material](https://m2.material.io/design/sound/applying-sound-to-ui.html); child/ND sensory: reserve for key events,
bounded predictable variation, ASD auditory sensitivity.)*

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

---

## 10. Accessibility — RETIRED · n/a (single bespoke user — parent decision 2026-06-14)
Teddy is the **only** user and the app is built **explicitly around him**, so a *generic* accessibility standard
(colorblind modes, broad WCAG conformance) isn't needed. His specific needs are already met **directly**: **Andika**
literacy font, **≥96px** targets, **reduced-motion + Full/Calm/Lite** sensory tiers, **gentle no-fail** feedback, and
**audio-first** instruction — see §0 (Non-negotiables), the detail-tier system, and CLAUDE.md hard constraints. If his
profile ever needs a specific affordance, add it directly to those. *(The alignment audit drops generic-a11y findings.)*

## 11. Onboarding / FTUE (standard — Trinity, 2026-06-14)
How a new player (and a returning kid) learns the game and each new mechanic. The award-winning rule: **teach through
play, one new thing at a time, get to first success fast — never a text wall.** For a pre-reader this is *mandatory*,
not optional (he can't read a tutorial).

**The repeatable "new-mechanic" pattern — `I do → we do → you do`** (use for EVERY new task type / grapheme type):
1. **I do (model):** the mentor *demonstrates* it once — audio + a visual demo, never a text instruction. The **magic-e
   CAST demo (`startMagic`)** is the gold-standard model (show cap → cast → cape); replicate that depth for new
   mechanics, not just a spoken sentence.
2. **We do (guided):** first reps run with **extra support** — fewer foils, the hint primed, the mentor cheering.
3. **You do (solo):** full difficulty once it's landing. Support **fades as competence grows** (the mastery model
   already does this — lean on it).

**First-ever session (cold start):** a SHORT story hook (intro cutscene) → straight into a **winnable first action**
(scan → first mission) → **first success within ~30–60s.** Don't front-load tutorials or lore; get him playing fast.

**Just-in-time, never front-loaded:** introduce a mechanic the **moment it's first needed** — we already do this
(`read_intro`/`spell_intro`/… per activity; `blend_intro` on the first blends mission; Noah's Act-2 cutscenes). Keep it;
never dump several mechanics at once.

**Returning-kid re-entry:** the map's **current-node pulse** = "you are here / do this next" (spatial, no reading); a
gentle warm-up (the Memory Vault **Recharge**) re-primes without re-teaching. No repeat tutorials.

**Always escapable + replayable (constraint #8):** every teach beat has the 🔊 replay + the ⏭ skip and auto-advances —
it can never trap or bore a kid who already gets it.

**Measure with the real child** (FTUE's #1 rule is real-player feedback): is he into the game within the first minute?
Does a new mechanic *land* on the first solo rep, or does he stall? That observation is the signal — there's no metric.

**Action checklist (for Neo):**
- [ ] Audit every task type: does each NEW mechanic get a true **model→guided** beat, or only a spoken `_intro`? Bring
  the thin ones up to the `startMagic` bar.
- [ ] A shared **`introMechanic()`** helper so the pattern (model → guided reps with support → solo) is consistent +
  can't be skipped accidentally. [ ] Time-to-first-win check on a fresh save (target ≤ ~60s).
*(Sources: [GameDeveloper — FTUE best practices](https://www.gamedeveloper.com/design/best-practices-for-a-successful-ftue-first-time-user-experience-),
[Games UX — onboarding](https://uxdesign.cc/games-ux-building-the-right-onboarding-experience-a6e99cf4aaea),
[antidote.gg — FTUE in games](https://antidote.gg/the-importance-of-first-time-user-experience-in-games/).)*

---

## 12. Narrative & voice/tone (standard — Trinity, 2026-06-14)
**Voice** = each character's persona; **tone** = how it flexes per moment. For a pre-reader the script is *heard*, so
this governs the AUDIO. House voice = **warm, encouraging, concise, hero-positive — never scolding.**
- **Per-role personas** (CLAUDE.md voice roles): A = warm mentor/narrator · B = Amelia (caring) · N = Noah (wise, kind
  wizard) · V = Vixen (smooth, playful villain — menacing-fun, never scary-cruel) · C = Vex/bots (robotic) · friends in
  their own kid voices. Every new line **matches its role's persona**.
- **Script rules:** simple words + short sentences; **contractions** ("you're") for warmth (no robotic "you are");
  **one `!` per line max** (enthusiastic, not shouty); describe the **fun/benefit**, not the function; celebrate
  **effort + mastery** (louder on mastery — §6.0); wrong = **gentle, never scold** (#2); address him as the hero.
- **Anti-gaming (#4):** sound-ID prompts stay **generic** — never name/reveal the target letter.
- **Variation:** high-frequency lines get fresh variants without breaking persona (the QA "line variations" note).
- **Cutscene/storybook pacing:** one idea per beat, short, audio-first with `faceSpeak`; the storybook-cutscene idea
  (CLAUDE.md backlog D) is the target for backstory.
- **Actions (Neo):** a 1-line tone sheet per role (3 dos/don'ts + sample); audit `data-lines.js` for the simple-words /
  one-`!` / contraction / no-scold rules + persona consistency; confirm all narration auto-advances + has 🔊 replay (#8).
*(Sources: [NN/g — four tone dimensions](https://www.nngroup.com/videos/tone-of-voice-dimensions/),
[UX Design Institute — tone of voice](https://www.uxdesigninstitute.com/blog/tone-of-voice-for-ux-writing/); kids
microcopy: simple words, contractions, one exclamation per screen.)*

## 13. Art-direction bible (standard — Trinity, 2026-06-14)
Single source of truth so every character (hero, allies, villains, mentors, new friends) reads as **one world**.
- **Define the constants** (numbers, not vibes): **proportions** (the heroic, slightly-chibi, 7-yo-friendly head-to-body
  ratio), **outline weight** (`--ink` stroke), the shared **lighting model** (the `feSpecularLighting` sheen + contact
  shadow + rim glow), the **palette** (reuse §1 tokens), and the **idle-animation timing budget** (breathe/blink/sway).
- **Reference render:** keep one approved hero render the **whole cast is measured against** (contact-sheet review via
  the shot harness).
- **Per-character checklist:** matches proportions · lighting model · outline weight · palette · **uniform canvas**
  (square, transparent, feet on a consistent baseline — so `rasterArt` wraps mechanically) · **warm + age-appropriate**
  (this is a 7-yo's app — heroic/strong is great, never grim).
- **Pipeline:** premium animated SVG for characters, painted raster for bg/maps (the chosen split); **generated** raster
  (Kendall/JJ/Cal/Nora) must conform to the bible before it ships; the `charArt`/`RASTER` resolver wraps it.
- **Actions (Neo):** write the proportion/lighting/palette/outline numbers into `art/CHARACTER-ART-PROMPTS.md`; run a
  full-cast contact sheet and flag any character off-model; conform the placeholder faces to the bible when generated.
*(Sources: art bible = single source of truth — [Athena](https://www.athena-productions.com/read/how-to-build-a-consistent-art-style-across-a-video-game-team-67),
[Wayline — art direction](https://www.wayline.io/blog/art-direction-games-best-practices); character standards =
proportions/silhouette/lighting.)*

## 14. Animation principles (Disney 12) (standard — Trinity, 2026-06-14)
Apply **Disney's 12 principles** (Thomas & Johnston, *The Illusion of Life*) to character + UI + transitions — beyond
the reward juice (§6).
- **Core for us:** **anticipation → action → settle (overshoot)** on meaningful motion (use the §6 easing tokens);
  **arcs**, not linear; **staging** = ONE focal motion at a time so the learning content stays primary; **secondary
  action** + **appeal** make characters feel alive (idle breathe/blink/cape-sway — already live); **timing** per the §6
  budgets; **slow-in/slow-out** via the easing tokens.
- **Screen transitions:** today a screen just toggles `.on`. Generalize the cutscene `beatIn` (fade + push-in) to
  `show()` — staged **enter** (push-in) / quick **exit** — so navigation feels designed, not abrupt.
- **All gated** on reduced-motion / Calm / Lite; never let a flourish compete with the active prompt (staging + §6).
- **Actions (Neo):** add staged `show()` transitions; audit character idle timing vs the budget; confirm no two big
  motions compete during a learning response window.
*(Source: Disney's 12 principles of animation — Thomas & Johnston, *The Illusion of Life* (1981), the canonical reference.)*

## 15. Haptics (standard — Trinity, 2026-06-14) ⚠️ platform-limited
The 3rd feedback channel (after visual + audio). **HONEST CAVEAT: iOS Safari / PWA has NO reliable Vibration API** →
haptics are effectively **unavailable on our current web/iPad stack.** So this standard is **"ready for a future native
wrap"** (Capacitor/Core Haptics), **not a now-build** — low priority; do NOT depend on it for any required feedback.
- **When available:** a **centralized `Haptics` service** (capability-check + respect On/Minimal/Off) — match the
  pattern to the event (**success / selection / error**), use **sparingly** (never every tap/scroll), **never the only
  signal** (accessibility — users disable it), **gentle** (ND sensory), with its **own toggle**.
- **Event map:** correct = light success tick · mastery/rank-up = richer success · **wrong = none or a *very* soft tap,
  never an error-buzz** (#2) · tile-tap = optional light selection.
- **Actions (Neo):** build it as a **feature-detected no-op** today (so it lights up if the app is ever wrapped native);
  ship nothing that *requires* it.
*(Sources: Apple HIG / Core Haptics; [haptic UX best practices](https://medium.muz.li/haptic-ux-the-design-guide-for-building-touch-experiences-84639aa4a1b8) —
centralize, sparingly, never the sole signal.)*

## 16. Information architecture / screen-flow map (standard — Trinity, 2026-06-14)
The canonical blueprint of every **screen → its states → its transitions**, so nav (§7), onboarding (§11) and
state stay coherent. Keep the tree **shallow** (Hick — few choices per node) with **no dead-ends** (every screen exits to
the Map/Base dock + 🔊/⏭).
- **Screens:** title · intro/interlude (cutscene) · **map** · **base** (+ train / shop / recharge / vault) · the mission
  types (scan, learn, trace, find, read, spell, sentence, cloze, scramble, boss/patrol, fortress, magic) · win · rest ·
  settings (hub → sections). **Canonical flow:** title →(first-run intro)→ map → [mission] → win → map; map ⇄ base ⇄
  sub-activities; act handoff = fortress → interlude → act 2.
- **States per screen:** empty/zero (U7) · loading · populated · (map) current/done/locked. Every screen must define all
  the states it can be in.
- **Actions (Neo):** produce the one-page screen-flow diagram (entries/exits/states per screen) and **verify it against
  `show()` routing** — use it to catch missing empty-states + orphan screens + any dead-end.
*(Sources: IA fundamentals (NN/g); our nav model §7.)*

## 17. Difficulty / flow & pacing (standard — Trinity, 2026-06-14)
Keep Teddy in the **flow channel** (Csikszentmihalyi, *Flow*): challenge matched to skill — too hard = anxiety, too easy
= boredom; for ADHD, stay in-channel with **frequent small wins**.
- **Our levers (mostly live):** mastery-paced + adaptive (`pickWeak`/weak-weighting); **no time pressure** (#1), **no
  fail** (#2); short frequent loops; the **15/15** mission/training split; scaffolding **fades** with competence (§11).
- **Standard:** difficulty rises **only on mastery** (the gate); there's **always a winnable next step** (the current
  node); inject **variety** to beat monotony ("heavy varied repetition disguised as new missions" — CLAUDE.md);
  **novelty cadence** (a new mechanic/reward every so often); session = gentle daily **meter, never a quota**.
- **Safeguards:** **no difficulty spikes** (every new mechanic scaffolded — §11); **no grind wall** (weak-weighting means
  progress is always felt); celebrate **often**, loudest on mastery (§6.0).
- **Actions (Neo):** audit the mission ladder for spikes; confirm every point has a winnable next step; check the variety/
  novelty cadence; the parent-observable check = engaged vs frustrated/bored.
*(Source: Mihály Csikszentmihalyi, *Flow* (1990) — the challenge↔skill flow channel; applied to game pacing.)*

## 18. Iconography & the SVG icon system (standard — Trinity, 2026-06-15; parent-escalated)
The missing standard that let emoji metastasize. **Every child-facing glyph is a crafted inline SVG** (non-negotiable
#6). This section says exactly how to build them so Neo has a recipe, not a vibe.

**The registry + resolver (reuse the pattern that already exists).** `picIcon(word, fallback)` + `PICONS{}` (art.js:719)
already resolve word-picture tiles to crafted SVGs. Generalise it to a **UI icon registry** in art.js:
```
const ICON = { map, base, home, train, shop, recharge, gifts, skip, menu, gear,
               stars, coins, weapon, gem, league, trophy, villain, ear, back, check, lock, … };
function icon(name, size=40){ return ICON[name] ? ICON[name](size) : ""; }  // returns inline <svg>, never an emoji
```
Replace every emoji glyph site (`index.html` nav, the Base action rail, `BASE_ITEMS.ic`, collection bullets, `hudStars`,
the chest/gifts button, `btnSkip`) with `icon(...)`. **There is no emoji fallback** — a missing icon renders nothing and
fails the CI guard, which is correct (it forces the icon to exist).

**House style (binds to the §13 art bible — same language as the characters):**
- **`--ink` outline**, weight per the §13 constant; shapes filled from the **§1 palette tokens** (never raw hex).
- **2 states minimum:** `idle` and `active`/`owned` (active = brighter fill + a soft glow; mirrors `.cta`). Touch target
  the icon sits in stays **≥96px** (#2) even if the glyph art is ~40–56px.
- **Optional depth:** a light radial highlight / 1px inner bevel so it reads crafted (NOT the banned "emoji on a disc").
- **Per-act skin:** an Act-2 medieval variant where it matters (e.g. the menu/gear/recharge icons) via `body[data-act="2"]`
  or an act arg — mirrors the existing chrome reskin (§0.5). Learning tiles stay Andika, untouched.

**Shop items are art, not pictograms (closes audit U5 / DESIGN-ENGAGEMENT §4.5).** `BASE_ITEMS` becomes crafted SVG
cosmetics AND the **archetypes level up** to hero-desirable objects (Star Shield, Arc Gauntlets, Thunder Cape, Sentinel
Drone, baby-dragon companion, rune-stone trophy, gold-dragon statue — not "Power Plant" 🪴). The shop is where emoji-vs-
premium stings most; it is the first conversion target.

**Inventory to build (the concrete to-do):** the ~10 `BASE_ITEMS` + the nav set (menu/map/base/home/gear) + the action
rail (train/shop/recharge/gifts) + HUD (stars/coins) + controls (skip/back/check/ear/lock) + collection bullets (league/
gem/villain/trophy). Build in batches, **screenshot each batch (§20) before the next.**

**Enforcement — `tests/ui-emoji.test.js` (Neo adds it in the de-emoji PR):** scan `index.html` + the child-facing string
literals in `game.js` (button labels, `BASE_ITEMS`, nav, HUD) for emoji codepoints (ranges `\u{1F000}-\u{1FAFF}`,
`\u{2600}-\u{27BF}`, `\u{2190}-\u{21FF}` arrows used as glyphs, variation-selector `️`, `\u{1F3FB}-\u{1F3FF}`). **Fail
(exit 1) on any hit outside an allow-list** (parent-only Grown-Up Corner blocks). Add to `.github/workflows/tests.yml`.
The rule has teeth only with this guard — it is part of the same PR as the removal, so CI is never left red on `main`.

## 19. Premium diegetic Hero Room (standard — Trinity, 2026-06-15; parent-escalated, premium bar)
The Base must look like **a high-end studio shipped it** (parent's explicit bar). Today it's translucent list-cards over a
wasted painting (violates #7). The full spec lives in **DESIGN-ENGAGEMENT §4.2 + §11 (upgraded)**; the non-negotiable
rules here:
- **The painted lair IS the interface.** `art/bg-base-room.png` is the stage (it's locked, commit `a47c54c` — *wire it,
  don't delete*). The hero stands **in** the room on a pedestal as the focal point. **No floating list-cards.**
- **Collections are physical objects placed onto painted hotspots**, calibrated like the map (`BASESPOTS` = per-fixture
  [x,y] in the room's coordinate space, the way `ZONESPOTS` calibrates the map): **weapon rack**, **gem shelf**, **trophy
  wall**, **chest corner**, **captured-villain cages**, **league portraits on the wall**, **companion spot**. Tap an
  object → the existing **flip inspect card** (`heroCard`), themed per object. Show-only-earned still holds (#empty slots
  read as faint "to-earn" sockets in the fixture, not list rows).
- **It fills as he grows** — each newly-earned item does a **"place + sparkle"** when he enters, so the room visibly
  changes *this session* (the avatar-as-progress literature). Premium polish: scene lighting/parallax depth, the diegetic
  frame (§8-style), Act-2 medieval parity (reskin the reward modals too — heroCard/bossCage/unlockCard).
- **BUILD-ORDER FIX (why it failed before):** the diorama/premium look was filed as the "last, biggest" slice and never
  shipped — Slice 1 just rearranged the flat cards. **Reverse it: the diegetic painted-room layout is the FIRST slice, not
  the last.** Premium is the point, not a polish afterthought.

## 20. Render-review gate & the Premium Bar (process standard — Trinity, 2026-06-15)
Every standard above failed once because **nobody looked at the render** — review was code-vs-doc. New rule:
- **No visual change is "done" until rendered + eyeballed.** Use the existing harness: `node tools/shot.mjs <scenes>`
  (Act 1 + Act 2, 1024×768 + portrait). The harness exists and was sitting **unused** — that is the whole bug.
- **Premium Bar rubric — a render fails if ANY is true:**
  1. **Any emoji** in the child UI (auto-caught by §18's guard, but eyeball it too).
  2. UI **covers/wastes the painted art** instead of living in it (stacks of translucent list-cards = fail).
  3. It reads like a **web form / settings dashboard**, not a shipped game screen.
  4. Icons/items are **inconsistent** in style (mixed sources, mixed weights) or look **bare/flat**.
  5. The **focal point is unclear** (no single hero/CTA the eye lands on) — §7.4.
  6. Empty **zero-state looks broken** (bare slots, "0/6" rows) rather than inviting.
- **Attach the before/after shots** to the change (drop in `tools/shots/`); the parent reviews pixels, not prose.
*(This is the antidote to "we had 17 standards and it still looked cheap": standards describe, renders prove.)*

## 21. ARENA — the locked house art direction (standard — The Oracle, 2026-06-15; parent-picked)
The whole UI drives toward **ARENA**: **Supercell-tier glossy, juicy, candy-bright chrome** (Clash Royale /
Brawl Stars feel — *"a legit game a kid would choose to play, not a learning-app look"*, the §★ parent anchor)
**plus a bold comic BLACK offset shadow** on the primary controls + title for punch. Picked by the parent from a
3-direction benchmarked proposal (A = ARENA / B = COMIC / C = ENCHANTED), then dialed *"more A + keep B's black
shadow"* (renders: `tools/shots/dir-A…E*.png`; decision logged in `DESIGN-REVIEW.md`, 2026-06-15). This is the
**elevated** standard — the Premium Bar (§20) is the floor; ARENA pushes past it. Bounded, always, by §0.

**References (the bar to match, captured/benchmarked):** Clash Royale & Brawl Stars home/shop UI
([interfaceingame.com](https://interfaceingame.com/games/clash-royale/), [Brawl Stars](https://interfaceingame.com/games/brawl-stars/),
[Game UI Database](https://www.gameuidatabase.com/)); Brawl Stars UI by Gonzalo Vazquez (Behance). Kids'-app
craft from Khan Academy Kids / Duolingo ABC / Toca Boca (large targets, ≤5 choices/screen, character + reward led).

**The tokens / rules (live in `styles.css`, appended ARENA layer):**
- **Colour signal (Supercell convention):** **gold/yellow = the primary CTA** (the one big PLAY / NEXT), **blue =
  standard action**, **green = secondary/affirm** (buy/confirm), **red = alert/notify only**. One primary per screen (§7.1).
- **Button material:** gold gradient `#ffe98a→#ffce3d→#f3a013`, **5px `--ink` border**, `background-clip:padding-box`
  (no fill bleed past the rim — a real bug we hit), a top **gloss** (`::after` sheen + inner `rgba(255,255,255,.9)`
  bevel), and the signature **hard black offset shadow** `6px 8px 0 var(--ink)` over a soft ambient. Press =
  `translate(2px,3px)` + shrunk shadow (tactile, 60fps transform-only).
- **`.cta`** is the biggest, juiciest button on any screen (larger font/pad/radius + the existing gentle float).
- **Title logo:** gold + `5px` ink stroke + a **layered 3D extrude ending in a black offset** + warm glow, so it
  pops off the painting. `.sub` tagline carries a small matching ink offset.
- **Scope:** Act-1 chrome. Act-2's `body[data-act="2"]` stone/bronze skin is more specific and intentionally
  overrides — ARENA does not touch the medieval world (a future pass gives Act 2 its own elevated treatment).
- **Detail tiers:** offset shadows are static (cheap) → safe in Calm/Lite/reduced-motion; only the `.cta` float is
  motion-gated (already handled).

**Rollout (each its own render-gated PR, §20):** ①✅ foundation = global button + title (this PR). ② shop cards +
collection tiles + the price/coins/DONE glyphs (also de-emoji). ③ Hero Base hub (action rail, rank/power, cards).
④ HUD + nav (menu/map/home + the `☰ ⚡` glyphs → SVG, §18). ⑤ in-mission chrome (bubble, ear, skip). Each batch:
build → render Act 1 (and Act 2 where touched) → log here + `DESIGN-REVIEW.md` → PR → Neo merges. Icons all become
crafted SVG per §18 (no emoji, #6) as each batch lands; the `tests/ui-emoji.test.js` guard lands with the final removal.

