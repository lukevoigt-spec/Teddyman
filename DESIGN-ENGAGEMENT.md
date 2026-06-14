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

## 8. Sources
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
