# BASE-BUILD-SPEC.md — Hero Base build spec (Oracle → Neo)

Concrete, build-ready spec for the redesigned Hero Base (the "layered hub"). Vision/research is in
`HERO-BASE-PLAN.md`; this is the implementation contract. **Oracle** owns the look/sections/CSS +
render-gate; **Neo** owns paintBase/state wiring + the PLAY→next-level logic. Render-gate every slice (§20).

## The model (parent-locked 2026-06-16)
A painted lair **backdrop** + a spotlit **pedestal** (hero stands there) + **clean UI sections layered on
top** — NOT SVG objects placed on painted shelves (that fails readability; see commit fdd502d + research).
**No mystery buttons: tap the THING to get its action.** Only two standing buttons: PLAY + MAP.

## Art (provided, build-ready)
- `art/bg-base-room.png` (Act 1) + `art/bg-base-room-a2.png` (Act 2) — atmospheric empty lair + central
  pedestal, uncluttered sides/foreground for UI. (Swap by `body[data-act]`, like the other bg art.)
- Visual reference mocks (rendered): `tools/shots/base-mock.png` (hub) + `base-mock-card.png` (a tap→card).
  Source: `base-mock.html` / `base-mock-card.html` (standalone, NOT wired into the game — reference only).

## Layout (regions over the backdrop)
| Region | Position | Content | TAP → |
|---|---|---|---|
| **Hero** | center, on pedestal | `heroNow()` art, idle-animated, current gear/rank/muscle; spotlight | **customize** card (cape / lens / emblem) |
| **Status** | top-center | rank label · **gem-dex %** (mastery) · coins | coins → **EARN** card (Training launcher) |
| **GEMS** | left panel | earned letter-gems (twinkle; gold ✦ = mastered); "N / 26" | **MY GEMS** card → **RECHARGE** button (Memory Vault) |
| **VILLAINS + WEAPONS** | right panel | captured bosses (caged) · owned weapons | villains → quip card; weapons → **equip** card (tap a weapon to load) |
| **MY FRIENDS** | below hero | freed allies lined up (face-framed) + faint "to-earn" sockets | friend → **flip card** (front art / back bio) |
| **PLAY** | bottom-left, LOUD primary | the one "go read" button | → **next uncompleted level** directly (first undone mission in play order) |
| **MAP** | bottom-right | secondary nav | → World Map (browse/replay) |
| **Grown-ups** | small gear, low-prominence corner | parent area | → existing `parentGate` |

HOME is NOT shown on the Base (he's already home). On OTHER screens: HOME (→Base, top) + MAP (↘).

## Cards (the tap targets) — reuse a single card/overlay component
- **MY GEMS** → gem grid (earned glow, ✦ mastered, empty=dim socket) + count + **RECHARGE** CTA (`startVault`).
- **EARN** (from coins) → coin balance + **TRAIN** CTA (`showTrain`).
- **WEAPONS** → owned weapons; tap one = equip (`S.equip.weapon`), hero re-arms live.
- **CUSTOMIZE** (from hero) → cape color (+ future lens/emblem); cosmetic, save to `S.equip`.
- **FRIEND** → existing `heroCard` flip; **VILLAIN** → existing `bossCage` quip; **GIFT** → chest reveal
  choreography (the chest in the room pulses when `pendingChests()>0`).
All cards: one level deep, big art + ≤1 headline number + icon details, CLOSE (✕) + tap-outside.

## Coverage vs old Base (nothing lost)
loadout→weapons/customize cards · league→FRIENDS row+flip · gems→GEMS panel+card · villains→VILLAINS ·
trophies/décor→room/decor · coins→status+EARN · Training→EARN card · Recharge→GEMS card · Shop→(a shop
entry, e.g. a "store" card or sign) · Gifts→chest · sub-screens (Train/Vault/Scroll/Warmup) unchanged
destinations, launched from the cards.

## Non-negotiables (carry over)
Zero emoji in child UI (crafted SVG via `uiIcon`/`itemArt`/`PICONS`) · **show only earned** (empty =
faint to-earn sockets, never "0/6" rows) · **mastery-gated** loud rewards, coins from correct answers only,
no timers/streaks/loss · ~96px targets · Full/Calm/Lite (idle + juice gated on `body.calm`/reduced-motion) ·
Act-2 medieval parity (`body[data-act=2]`) · save-safe (migrate any new `S.*`; never break saves) ·
audio-first (cards narrate on open; replay where prompts exist).

## Build slices (each render-gated)
1. **Shell:** backdrop + pedestal hero + status + GEMS/VILLAINS+WEAPONS/FRIENDS section panels +
   PLAY/MAP + gear. (Replaces the flat `basewrap` list-cards.) **Render-gate the hub composition first.**
2. **Cards:** the single card/overlay component + the tap→card wiring (GEMS→Recharge, coins→Earn,
   weapons→equip, hero→customize) + reuse heroCard/bossCage.
3. **Aliveness + growth:** hero idle/spotlight, "place + sparkle" on new earns, room grows with mastery,
   gem-dex %. 4. **Kind daily-return** (visits counter, friend greeting, overnight gift). 5. **Store +
   pets + customization** expansion.

DEPENDS ON: Neo's nav reconciliation (HOME→Base + lower-right MAP + PLAY→next-level) landing first, so
the Base builds around the settled nav. Shares index.html/game.js/styles.css with Neo — coordinate.
