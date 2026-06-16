# HERO-BASE-PLAN.md — The Hero Base Redesign (consolidated)

The Hero Base is the centerpiece. Per the new nav model it is literally **HOME** — the hub the child
lands in. This plan consolidates four deep-dive research agents (MD-file requirements, current-code
audit, competitive hub research, engagement psychology) into one buildable blueprint. Built WITH Neo
(Oracle = look/diegetic layout/render-gate; Neo = paintBase/state logic). Each phase render-gates (§20).

> Sourced from: best-in-class hubs (Clash of Clans, Animal Crossing, Sneaky Sasquatch, Pokémon,
> Supercell/Brawl Stars, Khan Academy Kids, Toca Boca) + peer-reviewed motivation science (SDT,
> overjustification, goal-gradient/endowed-progress, Proteus/IKEA effects, ADHD reward research, the
> FTC loot-box boundary). Full source lists captured in the research session.

---

## 0. NAV CONTEXT (parent 2026-06-16 — revises NAV-PLAN.md)
- **HOME button → the Hero Base** (Base = home/hub).
- **MAP button, lower-right corner → the World Map** (select & play missions, continue).
- Two persistent spots, same place every screen. (Supersedes NAV-PLAN's "Map=Home"; flag for Neo —
  PR #48 flips: HOME→Base, add the lower-right MAP button.)

## 1. THE VISION (one line)
**A painted, living lair the child calls home — that visibly GROWS as he masters reading — with
Supercell-clean controls layered on top.** Diegetic art for *atmosphere*; crafted high-contrast
controls for *actions*. (Research verdict: the "diegetic-objects-AS-UI" experiment rightly failed on
readability — atmosphere can be diegetic, **actions cannot**.)

## 2. WHAT THE RESEARCH VALIDATED (already right — keep)
- Character-on-a-pedestal centerpiece, idle-animated, re-arms as gear changes (presence = aliveness).
- **Show ONLY earned** items (no empty "0/6" grids — they read as "you're behind").
- Juice fires **around/after** the rep, never on the prompt (the one place manipulation-avoidance AND
  learning science say the exact same thing).
- No timers / no streak-punishment / no loss-aversion / cosmetic-only shop (each maps to a named
  dark-pattern the FTC or research flags — the guardrails are well-founded).
- ~96px targets, audio-first, Andika for letters, Full/Calm/Lite tiers, Act-2 medieval parity.

## 3. THE HIGH-LEVERAGE ADDITIONS (what makes it great)
1. **The Base IS the progress bar.** As Teddy masters graphemes, the lair physically grows/brightens
   (more torches lit, shelves fill, rank-armor Squire→Soldier→Knight). Beats any numeric meter for a
   kid; tie growth to **mastery**, not activity. (Animal Crossing / Clash of Clans / Minecraft pattern.)
2. **One unmistakable primary action + strict color hierarchy.** The loudest accent = the single
   "go play" path (the lower-right MAP/PLAY). Never two buttons that look like they do the same thing.
3. **Reveal choreography on every unlock** (tap→summon→"something good's coming"→reveal with
   rarity-scaled particles→savor on a flip card). Drama varies by rarity; **that you get a good thing
   is guaranteed** — the ethical form of variable reward ("which good thing, never whether").
4. **Hero Card whose FRAME upgrades by rank** (Pokémon trainer-card) + a **mastery-gated "gem-dex %"**
   (Pokédex completion pull, but the bar measures *getting better at reading*, via masteredItem()).
5. **Collection-as-a-PLACE**: gems twinkling on a shelf, freed-friend cards on a wall, villains in
   trophy cages — arranged in the room, tap → flip card one level deep.
6. **Endowed progress**: every new set starts "1 of 6", not "0 of 6" (head start lifts completion;
   crucial at the Act-2 power reset so it never feels like starting from zero).
7. **Kind daily-return hooks** (invite, never obligate): a "Hero Visits" counter that only climbs;
   preview tomorrow's gift; something **grew/arrived overnight that never decays**; a friend greets
   him **by name**; an almost-complete set to finish (progress preserved forever).
8. **Customize early + cosmetic-only**: a quick "make your hero" beat reachable from the title;
   keep him recognizably **Teddy** (face/name/voice → self-efficacy via avatar similarity). Forged
   gear feels *his* (IKEA effect) — but every build path must complete (the effect vanishes if abandoned
   = another reason for no dead/empty slots).

## 4. THE LAYOUT (diegetic room + clean controls)
Painted lair (`art/bg-base-room.png` — keep + wire, do NOT delete) as the stage. Collections live on
**object hotspots** (`BASESPOTS` [x,y] in a 1000×750 room space, calibrated like the map's `ZONESPOTS`),
NOT floating translucent list-cards (the current "settings dashboard" look the parent flagged).
- **Center pedestal:** Teddy, big premium art, idle-animated, wearing current gear/rank + companion.
- **Gem shelf:** earned letter-gems twinkle; mastered = gold ✦; tap → mastery flip card.
- **Friend wall:** freed-ally portrait cards; tap → existing heroCard flip (front art / back bio).
- **Villain cages:** captured bosses on glowing pedestals; tap → quip popup.
- **Weapon rack:** owned weapons; tap → inspect/equip flip card.
- **Chest corner:** unopened gifts pulse; tap → reveal choreography.
- **Persistent controls layered ON TOP (crafted, high-contrast, audio-labeled):** HOME (top-left, →this
  Base), **MAP/PLAY (lower-right, the loud primary → World Map)**, status cluster (rank/coins/gem-dex %),
  small gated grown-ups gear. Plus the daily-loop launchers (Training / Recharge) as clear buttons.
- **Empty slots = faint "to-earn" sockets in the fixtures** (warm tease, never a wall of padlocks).
- **Act-2 parity:** the same room, medieval-skinned (stone/torch/bronze).

## 5. MASTERY-GATING & ETHICS (the contract, made concrete)
- Coins from **correct answers only**, never idle. Best cosmetics/pets gate on **mastery milestones**,
  not coin-grind. Reading wins are LOUDER + BIGGER than cosmetic wins.
- Chests **always open, always good**; variability is *which* cosmetic (rare gold-foil ~1/8 for the
  positive prediction-error spike). **No near-miss framing. No random PAID anything.**
- Process praise only ("you sounded out every part!"), self-referenced growth (Teddy-vs-past-Teddy
  before/after), never leaderboards/social comparison.
- ADHD layer: ONE dominant CTA; collection/settings visually quieter; short loops; novelty as *content*,
  structure as *routine* (button positions stable); the prompt itself is the rich focal point.

## 6. BUILD PHASES (each its own render-gated PR; diegetic layout FIRST, not last)
1. **Diegetic room layout (Slice 1, FIRST).** Lay the painted room; hero on pedestal; convert the
   list-cards into BASESPOTS object hotspots; layer the HOME + lower-right MAP/PLAY + status controls.
   Zero emoji. **Render-gate before anything else** (this is the parent's #1 "looks like a web form" fix).
2. **Tap-to-inspect cards** (reuse heroCard flip for gem/weapon/trophy/villain) + reveal choreography.
3. **Grow-with-mastery** room states + the gem-dex % + Hero Card frame-by-rank.
4. **Kind daily-return** layer (Hero Visits counter, preview-tomorrow, overnight gift, friend greeting).
5. **Customization + pets** (cape/lens/emblem/base-theme/hero-name; one companion), mastery-gated.
6. **Store expansion + de-emoji** (original-archetype items + tabs) — folds in the Premium-UI batches.

## 7. OPEN QUESTIONS FOR THE PARENT
(See chat — validating concept blend, the Base's primary "go play" treatment, which new mechanics to
greenlight first, and scope/sequence.)
