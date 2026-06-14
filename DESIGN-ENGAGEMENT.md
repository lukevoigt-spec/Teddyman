# DESIGN-ENGAGEMENT.md — "Make Teddy WANT to play" (research + build specs for Neo)

Brief from the parent (2026-06-14): research optimal game engagement, make the progression dynamic enough to keep
Teddy hooked, then spec the next wave of *want-to-play* components — treasure chests, a revamped hero room + weapons
ecosystem, more customization, a bigger store, juicier animations (coins flying to the counter), plus an IP read on
Avengers/Marvel and Lord of the Rings.

This doc is the **plan**; it is advisory to CLAUDE.md / the spec / the hard constraints (which always win). Read those
guardrails (§6) before building any of it. Nothing here may break a save (migrate every new `S.*` field) or violate a
hard constraint.

---

## 1. TL;DR
Teddy's loop is pedagogically strong but **reward-thin between the big beats**. Research on ADHD learners is blunt:
rewards must be **immediate, tangible, and VISIBLE**, and *coins + verbal praise* beat abstract badges for building
the very inhibitory-control/attention we want. We already pay coins + speak praise — we under-**show** it. The wins:
(a) a juicy **coin-fly + number-pop** feedback pass, (b) **treasure chests** as curiosity rewards (surprise, never
gambling-loss), (c) a **living Hero Room** + deeper **weapons/customization/store** so collection (his documented
love) becomes the meta-game, and (d) a visible **Hero Rank meter** giving frequent mid-tier level-ups between
missions. All of it rides existing systems (`S.coins`, `record()`, `Sfx`, `confetti()`, `BASE_ITEMS`, `WEAPONS[]`,
the `S.detail` Full/Calm/Lite tiers) — this is additive polish, not a rewrite.

## 2. IP read (Avengers / Marvel + Lord of the Rings) — clear verdict
*Not legal advice — but a confident design call.*

**Marvel / Avengers items in the store → use ORIGINAL homages, not the real marks.** Marvel characters are protected
by **both copyright (appearance) and trademark (names + looks)**. Personal, non-distributed, non-commercial use is
*low practical risk* (enforcement targets commercial/distributed use; trademark infringement needs use "in commerce")
— so for a private iPad it wouldn't get anyone sued. **But the right move is still original-archetype items**, for
three reasons: (1) it's bulletproof and keeps every future option open; (2) it keeps *our own* IP strong — the game
already nails this with **coded** homages (Lord Vex = Vader-coded, Noah the Red = Gandalf-coded, The Vixen =
Scarlett-Overkill-coded); (3) a 7-year-old loves the **archetype** (super-strength, shields, hammers, capes), not the
brand name — he can't tell "Star Shield" from "Cap's shield." → **Build original superhero collectibles**: *Star
Shield, Arc Gauntlets, Thunder Cape, Comet Boots, Sentinel Drone, Power Core.* Evoke the Avengers vibe; never ship
the literal name/logo/likeness.

**Lord of the Rings → incorporate the FANTASY FEEL, never the Tolkien IP.** LOTR is **NOT public domain** (UK/most
countries ~Jan 2044; US later for the sequels), and the **Tolkien Estate is one of the most aggressive enforcers
alive** — its policy explicitly bars use of the characters, places, events, *names*, and even the invented
languages/script (Tengwar), and "Tolkien" itself is trademarked; Middle-earth Enterprises holds the film marks. So:
**do not** use any literal Tolkien proper noun, place, character, ring lore, or Elvish script. **Do** lean harder into
**generic high-fantasy tropes**, which are free and predate/transcend Tolkien: wizards with glowing staffs,
red-bearded mages, dragons, magic runes, enchanted forges, ancient libraries, knights, castles, magic rings as a
*generic* item. Act 2 already does this correctly. → "More LOTR" = **more medieval-fantasy texture** (our own Magic
Kingdom canon), *not* Middle-earth. Safe additions: a rune-stone collectible set, a wizard-tower base theme, a
baby-dragon companion, an "ancient tome" cosmetic, mounts/steeds — all generic, all ours.

## 3. Is the progression dynamic enough? (diagnosis)
Research: progression must be **visible + incremental** and blend **quick / mid / long** reward cadences; a game with
only long-term payoffs frustrates. Today Teddy's cadence is:
- **Quick** (per answer): coins + a ding — *under-shown* (no coin-fly, no floating +N, counter just changes).
- **Mid** (per mission): gear sometimes, `showUnlock` card — good but sparse; many missions give *nothing* new.
- **Long** (per zone/act): rank-up, new world — great, but far apart.

**Gaps:** the *mid* tier is the weakest — most missions don't visibly hand him anything, so the between-milestone
stretch goes flat (exactly when an ADHD learner disengages). Fixes below add a **Hero Rank meter** (a level-up every
~few missions), **treasure chests** (a surprise on a frequent, variable cadence), and **room/collection growth** so
*every* session visibly changes something he owns.

## 4. Component specs

### 4.1 TREASURE CHESTS — "Gem Vaults" (Act 1) / "Treasure Chests" (Act 2)  ⭐ highest delight-per-effort
Curiosity is a proven engagement driver; a chest is the cleanest curiosity object. **Constraint-safe framing: a chest
is a DISCOVERY, never a gamble** — it ALWAYS contains good stuff (coins + often a cosmetic), never "nothing," never a
loss. No streak-reset, no countdown.
- **Earn a chest:** (a) **milestone** missions drop a Gold chest; (b) every **N training reps** (e.g. 10) drop a Wood
  chest; (c) a **Daily Surprise** chest the first time he plays each day — framed "A present is waiting!" (NOT "don't
  break your streak" — that's banned by constraint #2). Tiers Wood→Silver→Gold scale the coin payout + cosmetic odds.
- **Open it (the juice):** tap the chest → it shakes (anticipation), bursts open with light + `confetti()` +
  `Sfx.unlock`, contents fly out: coins arc to the counter (§5), and any cosmetic shows on a `showUnlock`-style reveal
  card. Variable *contents* (which cosmetic) = surprise; never variable *whether* you get something.
- **Data:** `CHESTS` config (tier → {coinMin,coinMax, cosmeticChance}); `S.chests` = pending unopened count by tier
  (migrate default `{}`); a chest shelf/pile in the Hero Room to open. Reuse `BASE_ITEMS`/`S.owned` for cosmetic
  payouts (don't hand out a duplicate — fall back to coins if all owned).
- **Code hooks:** drop in `missionComplete()` + the training-rep counter; open UI in the Hero Room; `Sfx.unlock`,
  `confetti`, `showUnlock` already exist.

### 4.2 HERO ROOM REVAMP — from flat shelf to a *lived-in* HQ
Today the Base is a row of shelves. Make it a **diorama room that visibly fills as he grows** (avatar customization =
"a visual representation of progress" — the literature's exact phrase). Keep it one screen, large targets.
- **Layout zones:** **Hero plinth** (center: his current outfit + equipped weapon + companion, big premium art) ·
  **Trophy Wall** (earned `BASE_ITEMS` mounted, not in a list) · **Weapon Rack** (owned weapons, tap to inspect/equip)
  · **Gem Vault** (the lettered gem collection, twinkling; mastered = gold ✦, already built) · **Chest corner**
  (unopened chests pulse, tap to open) · **Companion spot** (pet follows/idles). · **League shelf** + **Villain
  cages** stay (already built).
- **Premium-state proof:** the *populated* Base already looks great (see QA.md render round 2) — the problem is the
  **empty zero-state** (U7). Seed a couple of free starter decorations so a new room is never bare, and let the room
  *grow* visibly with each item. Each new item placed = a small "place + sparkle" animation so a kid sees the room
  change *this session*.
- **Hooks:** extend `paintBase` (game.js ~1252); reuse `S.owned`, `WEAPONS[]`, `ownedWeapons()`, `heroSVG`.

### 4.3 WEAPONS ECOSYSTEM — make the Word Forge mean something
Today weapons unlock off gear milestones (cosmetic, good). Deepen it **on-theme** (words forge power) while staying
**zero pay-to-win** (constraint):
- **Weapon tiers / glow-ups:** a weapon visibly *upgrades* as its linked skill is mastered (e.g. Word Hammer gains a
  gem head → flaming head as more words are mastered). Tier driven by existing mastery counts — no new currency,
  reinforces reading. Render variants in `heroSVG`/art.js (additive overlays).
- **Weapon Rack inspect card:** tap a weapon → flip card with art + a fun **bio** ("Word Hammer — forged from the
  first words you ever read") + which milestone unlocked it. (Mirror the existing ally flip-card.)
- **Elemental skins** as store/chest cosmetics: Gem/Frost/Flame variants of owned weapons (pure recolor). Act-gated by
  `ownedWeapons()` so switching worlds re-arms him (already the rule).
- **Parking-lot from CLAUDE.md:** the **horse/mount** fits here as an Act-2 knight steed (Sir Teddy mounted) — defer
  on art, but the slot belongs in this ecosystem.

### 4.4 CUSTOMIZATION — ownership = identity (retention lever)
Customization "strengthens the connection between player and avatar." Cheap to add, high ownership payoff:
- **Hero cosmetics:** cape color, Gem-Lens tint, emblem style (T-variants), Act-2 helmet variants. *(Face/emotion
  stays abandoned per parent — don't touch the mask.)*
- **Base themes:** wallpaper/floor skins for the Hero Room (sci-fi hangar, gem cavern; Act-2 stone hall, wizard tower).
- **Name your hero / pick a title** ("Super Teddy, the ___") — escape the input (the `escHTML`/profile-name rule).
- Earned via coins/chests; store-bought. All cosmetic. Persist in `S` (migrate defaults).

### 4.5 STORE EXPANSION — more stuff, categorized, with a curiosity hook
Today's shop = 10 emoji items, one flat grid. Upgrade:
- **Categories/tabs:** Room Decor · Hero Cosmetics · Weapon Skins · Companions/Pets · Power Poses. Tabs > one long
  grid; gives short/mid/long price goals (a 10-coin banner *and* a 90-coin companion visible at once).
- **More items (original archetypes, per §2):** Star Shield, Arc Gauntlets, Thunder Cape, Comet Boots, Sentinel Drone,
  baby-dragon companion, rune-stone trophy set, wizard-tower theme, a treasure-map wall piece, gold-dragon statue.
- **"Featured today"** slot (one rotating highlighted item) = curiosity without any loss mechanic.
- **De-emoji the icons** (ties to audit U5): the shop is where emoji-vs-premium stings most — give items real SVG/raster
  art. Reuse `paintShop` (game.js ~1487); grow `BASE_ITEMS`; keep prices tuned to ~15/15 daily coin earn so goals feel
  reachable in a session or two (quick) up to a week (long).

### 4.6 PETS / COMPANIONS — collection bait that follows him
A small companion that idles in the room and trails the hero on the map is catnip for a collector kid (his documented
love). Act 1: a reformed mini-Vexbot or a gem-sprite; Act 2: a **baby dragon** (generic — safe) or a wizard's owl/raven
(generic). Collectible set (hatch from chests / buy in store). Cosmetic only; one equipped at a time.

## 5. JUICE / ANIMATION PASS — the "coins fly to the counter" ask (and friends)
"Juice" = the small reactive effects that make actions feel alive; coins arcing into the counter is the canonical one.
**Build these, gated on `S.detail` (Full only for the heavy ones; flatten on Calm; off on Lite) and
prefers-reduced-motion — reuse the existing tier hooks.** Critically: **juice the REWARDS, not the learning prompts** —
the literature warns over-juice harms readability, and constraint #4/#6 keep the learning tile the most salient thing.
1. **Coin-fly to HUD (flagship):** on a coin reward, spawn N small coin sprites at the reward source, **arc** them
   (staggered ~40ms) to the coin counter; on each arrival the counter **ticks +1 + pulses** and plays a soft
   `Sfx.coin` (pitch-laddered). DOM/CSS-transform sprites (no new deps), `position:fixed`, removed on animationend.
2. **Floating "+2!" number pops** rising + fading at the answer point (combo shows bigger).
3. **Counter count-up + bounce** when totals change (coins, gems, rank XP).
4. **Chest-open burst** (§4.1) and **place-in-room sparkle** (§4.2).
5. **Squash/stretch** on big buttons; **gem-collect pop** (scale 0→1.15→1).
6. **Rank-up fanfare** when the Hero Rank meter fills (light sweep + `Sfx.win` + a chest).
- **Hooks:** central choke points already exist — `record()`, `Aud.ding()`, `comboPop`, `Sfx`, `confetti`,
  `flashScreen`, `applyDetail()`/`body.calm`/`body.lite`. Add one `flyCoins(fromEl,toEl,n)` helper and call it where
  coins are paid (`trainWin`, mission rewards, chest open).

## 6. HARD-CONSTRAINT GUARDRAILS (do not violate — re-read CLAUDE.md §"HARD CONSTRAINTS")
- **No gambling-loss / no empty rewards.** Chests + "variable rewards" mean *which good thing*, never *whether*. (#2)
- **No streak-loss, no "you missed a day," no countdowns/timers.** The Daily Surprise is "a present is waiting,"
  framed as a gift, never a punishment for absence. (#1, #2)
- **Learning stays the most salient thing.** Juice the reward layer; never animate/clutter the active learning prompt;
  never reveal a sound-ID target on screen. (#4, and the over-juice research caveat)
- **Zero pay-to-win.** Every weapon/customization/store item is cosmetic; coins buy delight, never learning advantage.
- **Large targets (~96px+), high contrast, Andika on letters.** New UI obeys it. (#6)
- **Save-safe.** Every new `S.*` field (`S.chests`, cosmetics, room theme, rank XP) gets a `migrate()` default + a
  `save.test.js` assertion. Never wipe an existing save. (#7)
- **Detail tiers.** All new motion respects `S.detail` Full/Calm/Lite + prefers-reduced-motion. (#3)
- **Audio-first + no-hang.** Any new flow that waits on audio uses the `flow()`/watchdog pattern with a skip. (#8)

## 7. Suggested build order for Neo (best delight-per-effort first)
1. **Coin-fly + number-pops + counter count-up (§5.1–5.3)** — pure CSS/DOM on existing hooks; instant felt upgrade,
   touches no pedagogy. *(Do this first — it's the parent's specific ask and the cheapest big win.)*
2. **Treasure chests (§4.1)** — the highest curiosity payoff; reuses `showUnlock`/`confetti`/`Sfx`. Add `S.chests` +
   migration + a test.
3. **Hero Rank meter + rank-up fanfare (§3, §5.6)** — fills the weak *mid-tier* cadence gap; mostly UI over existing
   mastery/`record()` data.
4. **Store expansion + de-emoji + categories (§4.5)** — also closes audit **U5**; grow `BASE_ITEMS`, original-archetype
   items only (§2).
5. **Hero Room revamp (§4.2)** + **weapon rack/inspect + tiers (§4.3)** — bigger layout work; do after the room has
   more to hold (chests, store items, companions).
6. **Customization (§4.4)** + **pets/companions (§4.6)** — ongoing content; ship a first slice (cape color + one pet),
   expand over time.
- Each step: `node tools/shot-cloud.mjs <scene>` to verify on a real screen, keep `save.test`/`curriculum.test` green,
  and confirm no audio flow can hang.

## 8. POLISH TECHNIQUES & FEASIBILITY (architecture-aware — how to build it the *best* way on our stack)
The parent's question: *coin-juice seems universal — what's the most-polished way, and do apps use other
visualization elements?* Yes — there's a whole established craft here. Below: the canon, the **menu of reward-viz
techniques** (so we choose deliberately), the **polished recipe**, and an **honest feasibility read** against our
no-build static / DOM+CSS+inline-SVG / iPad-Safari architecture (the `S.detail` Full/Calm/Lite tiers are our friend).

### 8.1 The canon (what "juice" is built on)
The whole field traces to **"Juice It or Lose It"** (Jonasson & Purho, Nordic Game Jam 2012) and **"The Art of
Screenshake"** (Jan Willem Nijman, Vlambeer 2013); the theory is **Steve Swink's *Game Feel*** (the input→perception
loop). The mechanics are **Disney's 12 principles** (anticipation, squash & stretch, follow-through, *overshoot*,
secondary action) applied via **tweening + easing** (Robert Penner's easing equations — `easeOutBack`/`easeOutElastic`
give the satisfying overshoot; `easeInQuad` makes coins *accelerate* into the counter). **The core lesson is
LAYERING: many small, cheap effects stacked (motion + scale + flash + sound + a number) feel far better than one big
effect** — and the counter-lesson (Wayline's "juice problem") is *don't juice the thing the player must read* — for us
that's the hard rule: **juice the reward layer, never the learning prompt** (constraints #4/#6).

### 8.2 The reward-visualization MENU (apps use far more than "a coin slides over")
A polished reward is usually **3–5 of these stacked**, not one:
1. **Arc-to-counter stream** (the classic): emit several coin sprites from the reward source that travel a **curved
   (bezier) path** to the HUD counter, **staggered** (~30–50 ms apart) so they "pour." Curve + stagger = the premium
   feel; a straight, simultaneous slide looks cheap.
2. **Magnetize / vacuum:** coins first **scatter outward** (burst), pause, then get **sucked** into the counter
   (accelerating `easeInQuad`). The scatter-then-gather adds anticipation — used in most match-3 / hyper-casual hits.
3. **Radial burst + settle:** for a big payout, explode coins outward with rotation, then collect.
4. **Number-only tween (no sprites):** when sprites would be noise, just **count the number up** (never *set* it) with
   an `easeOut` over ~300 ms + a scale-bounce — cheap, classy, great for small/quiet rewards or the Lite tier.
5. **Comet/trail:** a single bright token with a fading motion-trail flies to the counter (good for a *rare* drop —
   chest cosmetic, rank-up).
6. **Counter feedback (the most underrated):** the receiving counter should **count up**, **scale-bounce on arrival**
   (overshoot 1.0→1.18→1.0, `easeOutBack`), **flash/glow**, and optionally **odometer-roll** the digits. Polished games
   spend as much on the *destination* reaction as the projectile.
7. **Floating "+N" popup** at the source (rises + fades; bigger/!` on combo).
8. **Secondary stack:** screen flash, confetti, soft pitch-**laddered** `Sfx.coin` (each coin a semitone up), glow
   pulse, and (iPad) a light haptic. These are what sell it subliminally.
> **Recommendation for Teddy:** use **#2 magnetize** (scatter-then-vacuum) for mission/chest payouts (most satisfying),
> **#4 number-tween** for tiny per-rep coins (keeps the learning screen calm), and **always** the **#6 counter
> count-up + bounce + glow** + **#7 +N pop** + pitch-laddered sound. That's the "most-polished" combination, and it
> degrades cleanly down the detail tiers.

### 8.3 The polished recipe (one reusable helper)
`flyReward(fromEl, toEl, n, {glyph:'🪙'|svg, tier})` — reused for coins, gems, XP:
1. **Anticipation:** source element does a quick scale-pop (squash→stretch) as it "ejects."
2. **Emit & travel:** spawn `min(n, CAP≈12)` sprites (object-**pool** them — never create N=100 nodes), each on a
   **quadratic bezier** from source→counter with a randomized control point (the arc), **staggered** delay, easing
   `easeInQuad` (accelerate in). For `n>CAP`, send CAP sprites but tween the counter by the full `n`.
3. **Arrival (per sprite):** counter `+= step`, **scale-bounce** (`easeOutBack`), soft `Sfx.coin` laddered, sprite
   removed (pool reclaim).
4. **Settle:** counter glow pulse fades; `+N` popup floated at the source resolves.
- **Timing:** whole thing ~500–700 ms; stagger 30–50 ms; counter count-up ~300 ms. Fast enough to never gate play
  (constraint #1 — no waiting), slow enough to read as celebration.

### 8.4 FEASIBILITY on our architecture — verdict: ✅ fully doable, ZERO new deps
We're a no-build static site (DOM + CSS + inline SVG, iPad Safari). All of the above is **transform/opacity-only**
animation, which is exactly what the browser composites **on the GPU, off the main thread** — the documented path to
60 fps on mobile (`transform`+`opacity` only; **never** animate `left/top/width/height`; add `will-change:transform`;
cap composited layers).
- **How:** spawn a pooled `position:fixed` node (a coin glyph or tiny inline-SVG); animate with the **Web Animations
  API** (`el.animate([...], {duration, delay, easing})`) — no library, per-sprite control, `finished.then()` cleanup.
- **The arc, three clean options (pick per Safari support, all no-dep):** (a) **CSS Motion Path** — `offset-path:
  path('M..Q..')` + animate `offset-distance 0→100%` (supported in current iOS Safari; the cleanest true bezier);
  (b) a **3-keyframe `transform: translate`** with a mid control point (fakes the arc, universally supported);
  (c) a **~10-line rAF quadratic-bezier lerp** if we ever want path control WAAPI can't give. Recommend (a) with (b)
  as fallback.
- **Counter count-up:** a short `requestAnimationFrame` integer tween (`easeOutQuad`) + a WAAPI scale-bounce on the
  counter node. ~15 lines.
- **Detail-tier mapping (reuses existing `S.detail` / `body.calm` / `body.lite` + `prefers-reduced-motion`):**
  **Full** = full magnetize + sprites + glow; **Calm** = fewer sprites (or number-tween only) + bounce + sound;
  **Lite / reduced-motion** = **instant set** + a single pulse + sound (no sprites at all). One code path, three
  budgets — same pattern `applyDetail()` already uses.
- **No-leak rule:** pool the sprite nodes (a small free-list), reclaim on `finished`; never leave orphaned fixed nodes.

### 8.5 Feasibility of the OTHER components (same architecture lens)
| Component | Tech needed | New deps | Effort | Notes |
|---|---|---|---|---|
| Coin-fly / +N / count-up (§5, §8.3) | WAAPI + CSS transform/opacity | none | **Low** | Flagship; central hooks `record()`/`trainWin`/chest exist |
| Treasure chests (§4.1) | DOM/SVG chest + WAAPI shake/open + `confetti`/`showUnlock` | none | **Low** | New `S.chests` (migrate + test) |
| Hero Rank meter + fanfare (§3, §5.6) | CSS bar + count-up + `Sfx.win` | none | **Low** | Rides existing mastery/`record()` data |
| Store expansion + de-emoji (§4.5) | data rows + SVG/raster icons | none | **Low–Med** | Art-lane for icons; closes audit U5 |
| Customization (§4.4) | CSS vars / SVG params + `S` fields | none | **Low–Med** | Recolors are cheap; helmet/emblem variants = art |
| Weapon tiers / glow-ups (§4.3) | additive SVG overlays in `art.js` | none | **Med** | Art-bound; logic trivial (mastery count → tier) |
| Pets / companions (§4.6) | idle SVG + follow-on-map | none | **Med** | Art + a little map-anim plumbing |
| Hero Room diorama (§4.2) | HTML/SVG layout rework of `paintBase` | none | **Med** | Biggest *layout* job; no new tech, do after room has contents |
**Bottom line:** nothing here needs a build step, a canvas particle engine, or a library — it's all WAAPI/CSS/SVG over
hooks we already have. The only "hard" parts are **art** (weapon/pet/icon assets) and the **Hero Room layout**, not the
tech. Start with the Low-effort, high-delight row (coin-fly → chests → rank meter), each verified with
`node tools/shot-cloud.mjs <scene>` + green `save`/`curriculum` tests.

## 9. NAVIGATION & SETTINGS — current state + remaining work (applies STYLE.md §7)
I audited the live code against the new §7 nav rules before speccing — and **most of CLAUDE.md's "UI/NAV BACKLOG" is
already built** (those notes are now partly stale). Don't re-do these:
- ✅ **(iii) START-vs-CONTINUE jank — SOLVED.** The title has **one** primary action: `#btnPlay` "PLAY"
  (`index.html:92`) → `startIntro()` first-time else `toMap()` (`game.js:422`); the code comment confirms it "replaces
  START + the duplicate CONTINUE." That's §7 rule #1 satisfied.
- ✅ **(iv) generic tagline — SOLVED.** Subtitle is now act-agnostic: "A HERO READS. A HERO RISES." (`index.html:90`).
- ✅ **Persistent global nav — built** (the earlier NAV OVERHAUL: HUD city-chip → World Map / Hero Base / Home from
  every screen) = §7 rule #2.
- ✅ **Settings = hub → drill-down + adult gate — built** (the U3 work: `#tabHub` 4 icon cards → Players / Progress /
  Settings / Voice Studio, each with ‹ Back; press-and-hold + math gate). Good progressive disclosure (§7) + grouped
  `setcard`s (Sound/Display). **Structure is sound — leave it.**

### What's actually left (best-first)
1. **Base action-rail fix (real bug, from Morpheus M-#2 + §7 rule #4).** Make `.baseactions` a **dedicated bottom rail**
   and reserve space for it: give `.basecol-hero`/Loadout a scroll path (`max-height:100%; overflow-y:auto`) **or** pin
   the action row and add matching bottom-padding to `.basewrap`, so the loadout can't overflow under TRAINING ROOM /
   SHOP / RECHARGE / CITY MAP at 1024×768. Verify `shot.mjs base basefull` + Act-2 Base + portrait. *(This is the one
   with a genuine layout defect — do it first.)*
2. **Settings/hub GAME-FEEL pass (enhancement #2 — *visual*, not structural).** The hub cards + `setcard`s work but
   read plain. Apply the §3 button craft (sheen/glow/press, 7px border) to `.hubcard`; frost the `setcard`s (§4 glass);
   bump tap targets to ≥96px; consider iconographic toggle art for the switches. **Keep the hub→drill-down flow + every
   bound control ID** — this is paint, not replumbing. Study how real kids' games lay out settings (Jakob's Law).
3. **Button-affordance pass (backlog (i)).** The §8 gap-checklist already calls for leveling up `.btn` with the
   sheen pseudo-element + `.glow`; apply it everywhere (title/base/settings) so every button *reads* as pressable
   (Norman signifiers). Pure CSS in `styles.css`.
4. **§7 conformance sweep (cheap invariants worth a test/checklist).** Confirm on every gameplay screen: **status up
   top, actions bottom/corners** (rule #4); **every control has icon + a tap-to-hear** (rule #3, pre-reader); **Home /
   Back / ⏭ always present + enabled** (rule #6 / hard constraint #8). Fold the locked-node / sound-ID / escaping
   invariants QA already wants into the same pass.
> **Doc hygiene:** CLAUDE.md's UI/NAV BACKLOG (i–iv) should be updated to mark (iii)+(iv) DONE and re-scope (i)+(ii) to
> the polish items above — that's a CLAUDE.md (product) edit, so it's **Neo's** to make (flagging it here, not editing it).

### 9.1 Settings game-feel pass — DETAILED SPEC (item #2 expanded)
**Reality check first:** the Grown-Up Corner is already in good shape — `#settingsPanel` is a painted overlay
(`bg-base.jpeg` + dark gradient, `styles.css:260`), the hub→drill-down + adult gate work, and `.setcard`/`.switch`/
`.segctl`/`.setrange` are all custom-styled with an Act-2 skin. So this is a **craft/affordance polish pass (paint
only), not a rebuild.** **Iron rule: keep every bound ID** (`volSlider`, `sfxSlider`, `musicSlider`, `detailSeg`,
`cloudSecret`, `saveBox`, `btnReset*`, the `hub*`/`secback` handlers, …) — change CSS + light markup, never the JS
wiring. `transform`/`opacity`/`box-shadow` only; reduced-motion aware; `.setcard-sub` stays **Andika** (parent reading).
> **Tap-target nuance (§7/#6):** the ≥96px rule is for **child**-tapped controls. The Grown-Up Corner is parent-gated,
> so its controls only need a comfortable **~44pt** (HIG floor) — *don't* bloat sliders/switches to child sizes here.

**A. Hub landing = the first impression — make it feel like a real game's settings home.** (`.hubcard`, `styles.css:288`)
1. **Color-code each card by function** (recognition over recall, §7 rule #3): Players = `--blue`, Progress = `--green`,
   Settings = `--gold`, Voice Studio = `--purp`. Tint the border + a soft matching idle glow per card.
2. **Premium chrome** (reuse the §3 `.btn` craft): add a glossy top **sheen** pseudo-element + a gentle `box-shadow`
   glow; keep the press-compress. Put the emoji on a **circular "chip" disc** (`.hc-ic` in a 56px radial-gradient
   coin) so it reads crafted, not bare-emoji.
3. **Add a one-line subtitle** under each `.hc-t` ("Switch who's playing" / "See what he's learned" / "Sound, display &
   sync" / "Record the voices") — markup-only, a `.hc-sub` span; turns four labels into self-explaining cards.
4. **Dashboard overview** (`.hubover`, `styles.css:282`): present the existing stat rows as a game-style **profile
   header** — bigger value type, a small icon per stat (🎯 missions · ⏱ minutes · ☁️ sync), the today/training split as
   a thin progress bar. Same data (`paintHub()`), richer presentation.

**B. Section cards + controls** (`.setcard` `:619`, `.setrange` `:628`, `.switch` `:636`, `.segctl` `:643`)
- `.setcard`: bump border to **2px gem-purple** with a faint outer glow on the *open* section; give `.sc-ic` the same
  chip-disc treatment as the hub for consistency.
- **Volume sliders** = the most "game" control: render a **filled track** (gradient fill from 0→thumb, e.g. via a
  `background:linear-gradient(--gold ...)` sized off the value, set in `paintVol()`) so each slider reads like a game
  volume bar, not a generic range input. Bigger gold thumb (already 26px — fine).
- `.switch`: add an inner shadow + a faint ON-glow when `.on`; optional ✓/✕ glyph in the knob for clarity.
- `.segctl` (Full/Calm/Lite): add the §3 **gold sheen** on the active segment so the selected detail tier pops.

**C. "Real game" structure touches**
- **Consistent close + back:** a single persistent **✕ close** top-right of `#settingsPanel` (always, every section) +
  the existing ‹ Back on drill-in — so the parent never hunts for the exit (§7 rule #6). Wire to the existing
  `btnCloseSettings` pattern; don't add new exits, just make the one consistent/visible.
- **Order by frequency:** Sound first (most-touched), then Display, Sync, Reset last in its **danger** card (already
  separated — keep it). 
- **Act-2 parity:** the existing `body[data-act="2"]` overrides skin `.setcard`/`.setcard-h`; **extend them to
  `.hubcard`** (stone/bronze) so the medieval skin covers the new hub chrome too.

**D. Build order + verify**
hub cards (biggest first-impression win) → setcard/slider/switch polish → consistent ✕ close → Act-2 `.hubcard`
parity. Pure `styles.css` + tiny markup; **re-verify the gate still opens it**, every slider/toggle still binds, and
shoot the settings scene (`shot.mjs`/`shot-cloud.mjs`) in Act 1 + Act 2; keep `save`/`curriculum` green.

## 10. Sources
**Game feel / juice canon + web-anim perf:** [GameAnalytics — squeezing more juice](https://www.gameanalytics.com/blog/squeezing-more-juice-out-of-your-game-design) ·
[Game Developer — juice (Jonasson/Purho lineage)](https://www.gamedeveloper.com/design/squeezing-more-juice-out-of-your-game-design-) ·
[abagames — making games juicy](https://abagames.github.io/joys-of-small-game-development-en/make_game_juicy.html) ·
[Game Economist Consulting — best currency animations](https://www.gameeconomistconsulting.com/the-best-currency-animations-of-all-time/) ·
[Algolia — 60fps performant web animations](https://www.algolia.com/blog/engineering/60-fps-performant-web-animations-for-optimal-ux) ·
[Wayline — the over-juice caveat](https://www.wayline.io/blog/the-juice-problem-how-exaggerated-feedback-is-harming-game-design).
**Engagement / progression / chests:** [ScienceDirect — curiosity & treasure-chest mechanics](https://www.sciencedirect.com/science/article/abs/pii/S1071581925001326) ·
[MoldStud — retention-driven mobile dev](https://moldstud.com/articles/p-key-practices-for-retention-driven-mobile-game-development-boost-player-engagement-and-loyalty) ·
[The Game of Nerds — progression systems](https://thegameofnerds.com/2025/06/17/designing-progression-systems-that-keep-players-hooked/) ·
[Frontiers in Psychology — cosmetic customization](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2021.770139/full) ·
[Dave Eng — what are progression systems](https://www.linkedin.com/pulse/what-progression-systems-games-dave-eng-nyope).
**ADHD / kids reward design:** [JMIR Serious Games — reward feedback for attention deficits](https://games.jmir.org/2025/1/e67338/) ·
[ADHD Centre — gamification & focus](https://www.adhdcentre.co.uk/adhd-gamification-and-its-role-in-boosting-focus-and-learning/) ·
[TovPlay — game dev for autism/ADHD](https://tovplay.org/en/blog/game-development-autism-adhd/).
**Game juice:** [GameAnalytics — squeezing more juice](https://www.gameanalytics.com/blog/squeezing-more-juice-out-of-your-game-design) ·
[Wayline — the over-juice caveat](https://www.wayline.io/blog/the-juice-problem-how-exaggerated-feedback-is-harming-game-design).
**IP — Marvel:** [ComicsLawyer — is fan art legal](https://www.comicslawyer.com/2016/06/is-fan-art-legal.html) ·
[Justia — use of superhero images](https://answers.justia.com/question/2020/05/23/use-of-superhero-images-marvel-dc-769870).
**IP — Tolkien/LOTR:** [Trademarkia — is LOTR public domain](https://www.trademarkia.com/news/copyrights/the-lord-of-the-rings-public-domain) ·
[The Tolkien Estate — FAQ/usage policy](https://www.tolkienestate.com/frequently-asked-questions-and-links/) ·
[TheOneRing — Estate wins infringement case (2023)](https://www.theonering.net/torwp/2023/12/19/117331-tolkien-estate-successful-in-copyright-infringement-case/).

— Trinity, 2026-06-14
