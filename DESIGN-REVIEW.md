# DESIGN-REVIEW.md — The Oracle's render-gate log

The visual-quality record for Super Teddy. Every visual change is logged here **after it has been
rendered** (`node tools/shot.mjs`, the only check the cloud crew can't run) and judged against the
**Premium Bar** rubric (`AGENTS.md` rule #7 / `STYLE.md §20`):

> zero emoji · UI lives in the painting (not list-cards over it) · reads like a shipped game, not a
> web form · consistent crafted icons · clear focal point · inviting zero-state.

Render-gate = **PASS / BLOCK**. Findings that block a merge are posted as PR review comments Neo
resolves before merge; this file keeps the durable before/after record. Shots live in
`tools/shots/` (git-ignored — captured locally, described here).

— The Oracle

---

## 2026-06-15 · Render-gate confirmed live
`node tools/shot.mjs` runs on this machine (Chromium 1223 / WebKit 2287, Playwright 1.60). The
render-gate is real — every entry below is from an actual boot of the game in a real browser, not a
mockup. Scenes serve over http (SW/IndexedDB/fetch behave like production).

---

## 2026-06-15 · Premium UI Overhaul — Batch 1: Hero Shop item icons  ·  PASS
**Branch:** `oracle/premium-ui-shop-icons` → PR for Neo.
**Files:** `art.js` (new `ITEMART` registry + `itemArt()` resolver), `game.js` (4 render sites
de-emoji'd, `BASE_ITEMS` emoji `ic` fields removed), `styles.css` (`.shopitem .ic` hosts SVG; owned
glow). *(The `styles.css` slice already reached `main` early via commit `769da0d` — see Process note.)*

**Problem (BEFORE — `shop-BEFORE.png`):** the 10 shop items were raw OS emoji
(🚩🪴🖼️🏆🥇⭐🤖🐉👑🚀). Against the painted medieval lair they read like a sticker tray pasted onto a
premium render — the single worst Premium-Bar violation in the app (audit **U5** /
`DESIGN-ENGAGEMENT §4.5` / `STYLE §18`). Emoji also render differently per device/OS (no art control).

**Fix:** each item is now a crafted SVG in the house icon language (same as `PICONS` and the
characters): `PI_INK` outline, bold flat fills from the gem palette, a floor shadow + white highlight
so each reads as a sculpted object. One art source (`itemArt(it,size)`) feeds all three sites — the
shop grid, the Hero-Base trophy shelf, and the buy/chest **unlock reveal** — so they can never drift.
The off-theme "Power Plant" 🪴 became a **Gem Cluster** (Teddy's #1 love). **ids + costs unchanged**
(save keys, `CLAUDE.md` #7) — only `nm`/art changed; existing saves keep every owned item.

**Render-gate (Chromium, deviceScaleFactor 2):**
| Scene | Cmd | Result |
|---|---|---|
| Shop, landscape 1024×768 | `shot.mjs shop` | `chromium-shop.png` — 10 crafted icons, cohesive with the painting. |
| Shop, portrait 768×1024 | (portrait harness) | `portrait-shop.png` — grid reflows clean; icons crisp at 68px. |
| Trophy shelf (owned) | `shot.mjs basefull` | banner SVG renders in the 56px shelf box. |

**Act 1 / Act 2:** the shop (`BASE_ITEMS`, `art/bg-base.jpeg`) is **act-agnostic** — identical in
both acts, so one render covers both. Noted rather than double-shot.

**Premium Bar:** zero emoji in the item grid ✓ · consistent crafted icons ✓ · reads like a shipped
game ✓. **PASS.**

**Out of scope (next batches — logged, not regressions):** the shop still has non-item emoji — the
`✅ DONE` button, the `💰` price glyph, and the `💰 COINS` header; the Hero-Base nav/action rail
(☰ ⚡ 🏋️ 🛒 🔋 🎁) and HUD remain emoji. These are the `STYLE §18` "nav set / action rail / HUD /
controls" batches and the `tests/ui-emoji.test.js` guard (Neo's). Recommend sequencing: **action
rail → nav/HUD → controls**, each render-gated, then land the CI guard with the final removal.

### ⚠️ Process note — shared working tree (Neo ↔ Oracle) — for the parent / Trinity
While building this batch I found **Neo's local session is sharing the Oracle's working tree** (one
checkout, one `.git`). Mid-edit, Neo switched the shared `HEAD` to a `playtest-feedback` branch,
committed, and his `git add` **swept my uncommitted `styles.css` edit into his commit `769da0d`**,
which then fast-forwarded to `main`. No work was lost (the CSS change is benign + dormant on `main`
until this PR lands the `art.js`/`game.js` that use it), but the collision was luck, not design — a
shared tree means either agent's branch-switch/`git add` can clobber the other's in-flight work.

**Mitigation I've adopted:** the Oracle now works in a **dedicated git worktree**
(`../teddy-oracle`, branch `oracle/premium-ui-shop-icons`) so I never share Neo's checkout again.
**Recommendation:** make per-agent worktrees the standing setup for the two local sessions (Neo keeps
the main checkout; Oracle uses its own). This is the missing piece of the branch-per-agent model in
`AGENTS.md` — the doc assumed separate contexts but the environment had one.

---

## 2026-06-15 · ART-DIRECTION PROPOSAL → parent picked **ARENA** (the §★ charter "first move")
Per the refreshed charter (STYLE §★: research → benchmarked proposal → parent picks → drive it), I rendered
**3 art directions on the REAL title screen** (same painted bg + hero, restyled chrome) and put them to the parent:
- **A — ARENA** (Supercell glossy-arcade): 3D gold title, glow podium, yellow candy CTA. `dir-A-ARENA.png`
- **B — COMIC LEGEND** (superhero comic-pop): ink outline + red offset, ben-day, comic CTA. `dir-B-COMIC.png`
- **C — ENCHANTED PREMIUM** (painterly + gold/jewel, ornate frames). `dir-C-ENCHANTED.png`

Benchmarked against Clash Royale / Brawl Stars (interfaceingame, Game UI Database, Behance/Gonzalo Vazquez) +
kids'-craft from Khan Academy Kids / Duolingo ABC / Toca Boca. **Parent: "I like A and C"** → rendered the fusion
**D — ROYAL ARENA** (`dir-D-ROYAL-ARENA.png`). **Parent: "lean more A, keep B's black shadow; the A button fill
bleeds past the border"** → rendered **E — ARENA v2** (`dir-E-ARENA-v2.png`): more arcade, B's hard black offset on
title+button, and the bleed fixed (`background-clip:padding-box`). **Parent LOCKED it.** Codified as STYLE §21.

## 2026-06-15 · ARENA rollout ① — foundation: global button + title  ·  PASS
**Branch:** `oracle/arena-foundation` → PR for Neo. **Files:** `styles.css` (appended ARENA layer), `STYLE.md` (§21).
**Change:** the elevated button material (gold gloss, ink rim, **hard black offset shadow**, padding-box bleed-guard,
tactile press) + the `.cta` size bump + the title's black-offset/glow treatment. Appended last so it wins by source
order; **Act-2 stone skin (`body[data-act="2"]`, 0,2,1) still overrides** — medieval world untouched.

**Render-gate (Chromium @2x, served from the Oracle worktree):**
| Scene | Result |
|---|---|
| `arena-title` | gold black-edged title + glow, glossy candy PLAY w/ hard black shadow, crisp rim, tagline clear. |
| `arena-win` | CITY MAP (blue) + NEXT MISSION (gold) both gain the offset shadow — read as real game buttons. |
| `arena-shop` | DONE button picks up the blue ARENA look; `.buy` price pills (other class) unchanged — no regression. Batch-1 crafted item icons confirmed live. |
| `arena-base` | hub buttons consistent. |

**Premium Bar:** reads like a shipped game ✓ · consistent crafted chrome ✓ · clear CTA focal point ✓. `save` 94/94,
`curriculum` 57/57. **PASS.** *(The proposal renders showed the hero overlapping the tagline — that was a render-time
scale injection only; the real title spaces correctly. Hero up-scale + per-screen layout polish = a later batch.)*

**Next:** rollout ② — shop cards / collection tiles + de-emoji the price/coins/DONE glyphs (STYLE §21 rollout list).

## 2026-06-15 · ARENA ★ — Act 1 WORLD MAP reimagined (parent-driven, Braveland style)  ·  PASS
**Branch:** `oracle/arena-map-v2` → PR for Neo. The parent's standing least-favorite (the map look/feel — see
the map-not-premium memory). Iterated heavily WITH the parent (renders at each step): clean-slate → expert research
(focal point / leading lines / status-top-actions-corners / landmarks — Game Developer, Sandboxr, MY.GAMES, Eleken,
Game UI DB) → tried flat-topdown, steep-aerial, Candy-Crush; landed on a **Braveland-style living campaign map** (parent
shared the reference) on a **brand-new painted landscape**.

**What shipped (Act 1 only; Act 2 stays on the legacy paint until its map is regenerated):**
- **New art:** `art/bg-map-a1-day.jpeg` + `bg-map-a1-twilight.jpeg` — a path-FREE landscape (hero town = start,
  Vex's fortress = end, river+bridge, varied non-gem terrain). Generated via gpt-image-1; twilight is an EDIT of the
  daylight (so geometry matches). Recipe saved in `art/incoming/MAP-PROMPT-act1*.txt` (gitignored) — reused for Act 2.
- **`map.js` `mapPaintV2(1)`** (dispatched from `mapPaintSVG`; legacy kept for Act 2): viewBox 1536×1024 + `slice`
  (fills the 4:3 stage). Draws the **single connected dotted route** (travelled bright / ahead dim) through 9 calibrated
  spots (`MAPSPOTS_V2`), **parchment quest-banner markers** (✓/star/lock, big transparent hit-rect, keeps
  `.mnode[data-zi]`), Teddy at the current banner, **captive friends ON their freed-zone** (`mapAlliesV2`, fanned when
  several share a zone), a parchment quest label, and the time portal. `mapBgFor()` swaps **day/twilight by device clock**
  (6a–6p / 6p–6a).
- **`index.html`/`styles.css`:** the daily-training meter shortened + centered in the top HUD row (between Menu & coins),
  label tucked under the bar (parent placement).
- **`tests/curriculum.test.js`:** friend-guard detector retargeted from the brittle `scale(.5)` string to a stable
  `class="mfriend"` hook (the MAP-1 pointer-events invariant is unchanged; works across legacy + V2).

**Render-gate (Chromium @2x, day + twilight, served from worktree):** `arena-map-a1-day.png` / `arena-map-a1-twi.png`
— connected route start→finish, premium banners, alive with characters, readable late-dusk twilight, meter in place.
`save` 97/97, `curriculum` 68/68. **PASS.**

### ⚠️ Neo action (parent, 2026-06-15) — free ONE friend per zone (payoff pacing)
Today three friends are freed in **zone 1**: Tank/Archie (`m3`), Flip/Ellie (`m6`), Sunny/William (`m8`) — all `z:1`
(`data-missions.js`); Heartguard/Amelia=`m17` (z2), Leighton=`m48` (z8). The parent wants **one rescue per zone** so the
payoff isn't front-loaded. This is **game-logic/curriculum (Neo's lane)** — re-distribute the CAGED friend rescues
(`allies.js CAGED` mids + the missions they're tied to) across early zones. **No map change needed:** `mapAlliesV2`
places each captive by its rescue mission's `m.z`, so it reflects the new spread automatically (and `save`/`curriculum`
guard it). Flagged on PR for Neo.

**Next:** generate the **Act 2 medieval map** pair with the same recipe (medieval start → varied realm → the Vixen's
keep) once Act 1 lands.

## 2026-06-15 · Act 1 map — P1 portrait fix (Codex review on PR #9)
Codex flagged: the 1536×1024 map at `xMidYMid slice` crops in **portrait** (768×1024) and pushes the edge nodes
(house/fortress) off-screen → untappable (orientation is `"any"`). Fix (`map.js` `mapPaintV2`): aspect mode is now
**orientation-aware** — `slice` (full-bleed) in landscape, `meet` (whole map, no crop) in portrait; `toMap` re-renders
via the new `mapRepaint()` on a debounced `resize` so rotation stays correct. Render-gated landscape + portrait
(`arena-map-a1-day.png` / `arena-map-a1-portrait.png`): all 9 nodes visible + tappable both ways. `curriculum` 79/79.

## 2026-06-15 · ARENA ★ — Act 2 MEDIEVAL world map (same Braveland system)  ·  PASS
**Branch:** `oracle/arena-map-a2` → PR for Neo. Parent-approved after iterating the art (abandoned an over-aerial
"windmill" take → flat near-top-down to match Act 1's uniform scale). Same V2 system now drives BOTH acts.
- **New art:** `art/bg-map-a2-day.jpeg` + `bg-map-a2-twilight.jpeg` (path-free medieval landscape — village = start,
  dragon keep = end, river+stone bridge, enchanted forest, standing stones; twilight = geometry-matched edit, late dusk).
- **`map.js`:** `MAPSPOTS_V2[2]` = 6 zones calibrated to ONE continuous route **village → bottom meadow → stone bridge
  (single river crossing, ON the deck) → up the open right meadow → the dragon keep**, staying on grass (NO forest
  detour — parent constraint). `mapBgFor()` extended to Act 2 day/twilight by device clock. `mapPaintSVG()` dispatcher
  now uses V2 for any act with `MAPSPOTS_V2` (Act 1 + 2); legacy kept as fallback. Miss Kendall renders captive at the
  keep via the existing LEAGUE-derived `mapAlliesV2` (gone once freed).
- **Render-gate (Chromium @2x):** `arena-map-a2-day/twi/portrait.png` — continuous path crossing on the bridge,
  banners, knight Teddy at CASTLETON, captive Kendall at the keep, readable late-dusk, all 6 nodes on-screen in
  portrait (meet). `curriculum` 79/79. **PASS.**

## 2026-06-15 · Act 2 map — path-fix (parent: "you went in the water")
The shipped Act-2 route hugged the river (read as in-water) on the climb to the keep. Re-calibrated
`MAPSPOTS_V2[2]` against a grid+nodes diagnostic overlay so the route stays on land: village → bottom
meadow → **stone bridge (single crossing)** → swings WIDE onto the right-bank grass (clear of the river)
→ dragon keep. Verified by cropping the upper segment (dots on grass, right of the river). `curriculum`/`save` green.

## 2026-06-15 · WIN-screen "hard square around the hero" (parent bug) — root-caused + fixed
**Symptom (parent iPad screenshot):** the win-screen hero sits in a hard rectangle / glow clipped to a box.
**Root cause:** in `art.js` the character **aura ellipse overflowed the SVG viewBox** (rasterArt 127×141 in a
240×256 box; villains 130×142 / 132×146 in 240×252), so SVG default `overflow:hidden` **clipped the soft glow to
the viewBox rectangle**. Invisible on Chromium, but on iPad/WebKit the `#winHero>svg drop-shadow(scene-rim)`
**outlines that clipped rectangle** → the reported box. (All raster PNGs verified transparent-cornered, so the art
itself wasn't the box.)
**Fix:** fit every character aura inside its viewBox (`rasterArt` → 116×120; villain auras → 116×120) so the glow
fades to transparent before the edge — no rect to clip/outline. Covers hero + allies (rasterArt) + Vex/villain SVGs
(win, boss, intro, cutscenes). `curriculum` green.
**Render-gate:** Chromium win (`win-fix-cr.png`) + boss (`fix-boss.png`) — soft glow, no box, no regression. ⚠️
**WebKit gate BLOCKED** — `tools/shot.mjs --webkit` (and a custom harness) hang on Playwright's font-wait (the
SHOT-1 issue), so I could not capture the actual iPad before/after. The fix removes the root cause; **parent to
confirm on the iPad.** Flagging SHOT-1 (WebKit render path) to Neo — without it the §20 gate can't catch iPad-only bugs.
