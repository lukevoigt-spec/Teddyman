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

## 2026-06-17 · Hero Base — aliveness & growth (gem-dex % · lair grows · tap-hero card)  ·  PASS
**Branch:** `oracle/lair-growth` → PR for Neo. The lair's last slice (parent picked **glow + staged reveals**
and **tap-hero → hero card** via AskUserQuestion). `game.js` + `styles.css` only (no index.html — avoids
Neo's active #102/#107 files).
**Built:**
- **Gem-dex %** — the GEMS panel + the hero card show `got / total · NN%`.
- **Lair grows with mastery** — `#lairFx` overlay (injected into `#scrBase`, pointer-events:none, behind
  hero/panels). A cool "dormant" dim is strongest at 0% and lifts to nothing at 100% (somewhere to grow
  FROM), while a warm bloom + STAGED reveals fire at 25/50/75% (pedestal halo → hearth-side warmth →
  shelf-side glint). Calm dims + stops the hearth flicker; Lite drops it (GPU). Driven by `--lair` =
  this act's mission-completion fraction.
- **Tap Teddy → his flip card** — reuses `#heroCard`: front = painted hero + rank; back = Rank / Gem-dex /
  Weapon + an Act-1 cape picker (stopPropagation so picking a cape doesn't flip the card). Weapon label
  reads the HELD weapon from `S.equip` (the art's source) so it can never contradict the picture.
**Shots:** `base` (0% — cool dormant, hero spotlit, still inviting), `basedaily` (~50% — warmer, gem-dex
"13/26·50%"), `basearmed2` (Act-2 100% — bright/alive), `teddycard` + `teddycardback` (front/back/cape
picker; weapon "GEM SWORD" matches the art). All premium, emoji-free, UI lives in the painting.
**Tests:** ui-emoji 44/44, curriculum 115/115, save 121/121. Added `teddycard`/`teddycardback` scenes to
`tools/shot.mjs`.

---

## 2026-06-16 · Premium UI — in-game controls (home button de-emoji)  ·  PASS
**Branch:** `oracle/premium-controls` → PR for Neo. Premium UI Overhaul, batch: **in-game controls**.
**Finding:** of the three in-game controls, **replay** (`.ear`) and **skip** (`#btnSkip`) were ALREADY
crafted SVG — `.ear` draws a clean speaker via a CSS `::before` mask (the `🔊` was just hidden fallback
text), and `#btnSkip` is an inline SVG. Only the **home** control still used emoji: `🏠 BACK TO BASE`
on the Recharge / Scroll / Warm screens.
**Fix:** the four BACK-TO-BASE buttons (Vault/Train/Scroll/Warm) now get the crafted shield (Base) icon
via `navIcons()` (reusing `uiIcon`); `🏠` removed from the HTML. Also removed the now-redundant hidden
`🔊` from every `.ear` div (CSS already draws the speaker) — full de-emoji of the replay markup.
**Shots:** `vaultfull` — BACK TO BASE shows the gold shield, replay speaker still renders crisp after the
`🔊` cleanup; `find` — replay speaker intact on a gameplay bubble. `node --check` clean, `ui-emoji.test`
9/9. **PASS.**
**Remaining (logged):** action rail (`🏋️`/`🛒`/`🔋`/`🎁`), HUD (`⚡`/coin + the `🔋 RECHARGE THE GEMS`
heading), and a few sparkle/emoji inside narration LINES (content, separate from controls).

---

## 2026-06-16 · REVERT the AI portal cutscene — restore the SVG interlude  ·  PASS
**Branch:** `oracle/revert-portal-cutscene` → PR for Neo. Reverses the wiring from PR #41.
**Why:** parent reviewed the AI cutscenes (portal + the extended Mom&Dad/friends/Vixen master) and
judged them not good enough to ship — *"these aren't great… I may generate them myself."* So the
game returns to the original hand-crafted SVG handoff beats.
**Files:** `game.js` (restore the 5 SVG INTERLUDE beats + original paintInter; remove `playInterVideo`),
`tools/shot.mjs` (drop the `interludevid` scene). `art/cutscene-portal.mp4` is **kept** in the repo so a
future, better cutscene can be dropped back in (restore a `{video:"..."}` beat + the player from PR #41
git history). Tests: curriculum 110, save 112, boot clean. **PASS.**
**Pipeline note:** the working AI-video pipeline (gen.mjs --bg → composite raster → Kling i2v → ffmpeg
xfade → fal sync-lipsync) is documented in memory for if/when we revisit. The cousin-cast work (Cal/Nora,
merged separately) is unaffected.

---

## 2026-06-16 · Premium UI — nav menu crafted icons (de-emoji)  ·  PASS
**Branch:** `oracle/premium-buttons` → PR for Neo. Premium UI Overhaul, batch: **nav menu + MENU chip**.
**Problem:** the nav dropdown (on every screen via the MENU chip) used raw OS emoji — `☰ MENU`,
`🗺️ World Map`, `🏰 Hero Base`, `🏠 Home`, `⚙️ Grown-Ups` — a child-facing rule-#6 violation + premium
gap (emoji render per-OS, off the painted/gold look).
**Fix:** new `UICONS` registry + `uiIcon(key,size)` in art.js — crafted SVG glyphs in the house icon
language (`PI_INK` outline, gold flat fill): hamburger / location-pin / shield-with-star / house / gear.
`index.html` nav labels are now plain text; game.js `navIcons()` prepends the icon (degrades to text if
`uiIcon` is missing — never breaks a button). Onclick handlers untouched.
**Shot:** `menu` — five crisp gold icons, cohesive with the ARENA gold, zero emoji. `node --check` clean,
`ui-emoji.test` 6/6. **PASS.**
**Next batches (logged, sequenced):** action rail (`🏋️ TRAINING ROOM` / `🛒 SHOP` / `🔋 RECHARGE` /
`🎁 GIFTS`), then HUD (`⚡`/coin), then in-game controls (replay/skip/home) — each its own render-gated PR,
reusing `UICONS`.

---

## 2026-06-16 · Portal cutscene (AI video) wired into the Act1→Act2 interlude  ·  PASS  ·  (REVERTED — see above)
**Branch:** `oracle/portal-cutscene` → PR for Neo.
**Files:** `art/cutscene-portal.mp4` (2.9MB, 1280×854, 18.6s), `game.js` (INTERLUDE video beat +
`playInterVideo`), `tools/shot.mjs` (`interludevid` scene).
**What:** the first AI-video cutscene, built entirely from our 2D art (parent loved it). Muscular
end-of-Act-1 Teddy turns to a swirling time portal → steps through in a burst of light → arrives in
the medieval realm as a (still-muscular) SQUIRE and delivers a lip-synced line, *"Nobody messes with
my babysitter but me."* Pipeline: gen.mjs --bg painted scenes → composite our real raster Teddy →
Kling i2v (fal) → ffmpeg xfade → fal sync-lipsync. Replaces the old portalSVG + knight-reveal SVG beats;
the Mom&Dad / captives / Vixen SVG beats stay (Step 2 will convert them to video).
**Safety (constraint #8):** SKIP button ALWAYS present (no hang), auto-advances on `ended`, any
load/decode error also advances; `play()` runs inside the prior beat's click handler so iPad Safari
allows sound; Music ducks during playback.
**Shot:** `interludevid` — video plays on scrInter, framed by the Act-2 gold panel, MENU + SKIP present.
Tests: curriculum 110/110, save 109/109, `node --check` clean. **PASS.**
**Note:** the cutscene squire is muscular (parent's cinematic continuity); in-game heroOpts still resets
muscle to 0 on Act-2 entry (CLAUDE.md) — that's the *playable* state, the video is the cinematic.
**Voice:** TTS placeholder — to be re-recorded via the Voice Studio (same lip-sync pipeline).

---

## 2026-06-16 · Cast cousins — Cal & Nora flat-2D rasters  ·  PASS
**Branch:** `oracle/cast-cousins` → PR for Neo.
**Files:** `art/ally-cal.png` + `art/ally-nora.png` (new 560² rasters), `art.js` (RASTER flags),
`allies.js` (ALLY_COL signature colors), `tools/shot.mjs` (new `cast` cohesion scene).
**Story:** parent supplied 3D Pixar-render cousin portraits (Cal approved as likeness; Nora's hair
re-toned darker/less-red per request). Render-gate caught a style mismatch — the **entire roster is
flat-2D painterly** (teddy-m*, ally-tank) — so 3D characters would stand out on the Base shelf/map.
Surfaced both styles to the parent with a side-by-side; parent chose the **flat-2D restyle**. Restyled
each via gpt-image-1 (likeness preserved: Cal = ginger/freckles/blue shirt; Nora = brown hair/striped
dress), then enriched the shading to match Tank's painterly finish, normalized to 560² feet-at-baseline.
**Shot:** `cast` (Archie · Ellie · Cal · Nora through `allyBody`→`rasterArt`). Cohesive — same bold
outline, grounded feet, soft signature-color aura + contact shadow. Zero emoji. **PASS.**
**Follow-up for Neo (game logic, NOT art):** Cal & Nora aren't in `CAGED`/`LEAGUE` yet, so they don't
surface in-game — the art resolves the instant they're rostered (rescue mission + hero alias = a design
call with the parent). Lore frames JJ/Cal/Nora as Act-2 captured friends.

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

## 2026-06-15 · Act 2 → 8 zones — map layout LOCKED, ⚠️ NEO ADD 2 ZONES (parent-approved)
Parent wants Act 2 to grow from **6 → 8 zones**. The map is ready; the 2 new banners only render once
the **game content exists** (the map draws one banner per real `actZones(2)`), so this needs Neo.

**Locked 8-node layout (parent's marks; on land, single bridge crossing, right-bank climb to the keep)** —
drop-in for `map.js` `MAPSPOTS_V2[2]` **at the same time** the 2 zones are added:
```
2:[[335,875],[500,850],[640,815],[720,765],[880,665],[1085,565],[1110,410],[1120,255]]
```
Index→meaning: 0 start (village, hero) · 1–2 meadow · 3 bridge approach (nudged up) · **4 NEW** (after
bridge, right grass) · 5 right-bank · **6 NEW** · 7 the Dragon Keep (finale, moved right).

**⚠️ NEO action (game content, your lane):** add **2 new Act-2 zones + their missions** in play order so
`actZones(2).length === 8`, inserted as map indices **4 and 6** (i.e. after the bridge zone, and between
the right-bank zone and the finale). **The Dragon-Keep finale must stay the LAST zone** so it maps to
index 7 (the keep) and Miss Kendall stays captive there (`mapAlliesV2` is LEAGUE-derived, so she follows
her finale mission's zone automatically). Swap `MAPSPOTS_V2[2]` to the 8-array above **in the same PR** as
the zones (atomic — shipping the 8 spots before the zones would put the finale at index 5, not the keep).
Until then the live map correctly stays at 6 (PR #13). Content/curriculum of the 2 new zones is your call.
**✅ DONE (Neo, cd79486):** zone 107 THE PIRATE COVE (r-controlled, 150-159) + zone 108 THE GIANT'S BRIDGE
(multisyllabic/affixes, 160-172) shipped with the 8-array swap, atomic. Built to CURRICULUM-GRADE2.md.

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

## 2026-06-16 · Background restyle — match all screens to the new MAP look (parent)  ·  PASS
The map redesign shifted the world to a warm painterly storybook look, leaving the old screen backgrounds
(glossy neon gem-temples for Act 1) mismatched. Regenerated **all 16 scene backgrounds** to the unified map
style — *Candy-Crush/Braveland painterly, warm soft light, lush natural colour, gems as accents not theme,
calm open centers for the learning tiles.* **Title excluded** (parent's instruction).
- **Slots (Act 1 + Act 2):** intro, lab (scan), learn, city (find), battle (boss/forge/fortress), base, victory
  (win), rest. New `bg-lab-a2` added. Act 1 = warm fantasy-adventure; Act 2 = medieval (matches the dragon-keep map).
  All gpt-image-1 `--bg`, converted to ~200 KB JPEGs.
- **Render-gate (Chromium @2x, worktree):** learn, victory, battle, city, lab, rest (Act 1) + learn-a2, battle-a2 —
  backgrounds load via `BG_MAP`/`setBG`, UI + learning tiles stay legible (dark battle scene reads fine via the
  bubble/tile panels), content is the focal point. `curriculum`/`save` green (art-only).
- **Not touched (flagged):** the Hero-Room hub backdrop (`bg-base-room.png`, a parent-iterated interior) — offer to
  restyle to match as a follow-up. Legacy `bg-map(.jpeg)` is now dead (V2 maps render both acts) — Neo cleanup later.

## 2026-06-16 · Hero Base backdrop → warm hero's-hall (parent: "restyle to match")
Finding: the layered Hero-Room hub never merged to main — `bg-base-room.png` is an unused orphan (staged on the
`hero-room` branch). The LIVE Base is the card-based hub whose backdrop is `bg-base.jpeg` (BG_MAP `scrBase`→base,
also train/vault/scroll/warmup). PR #16 had restyled it to an outdoor camp; for a "Hero ROOM" feel I swapped it to a
**cozy painterly hero's-hall interior** (hearth, heraldic banners, trophy shelves, treasure chests, sunset window,
central pedestal) — matches the new map/bg style and reinforces the collection theme. Applied to `bg-base.jpeg` +
`bg-base-a2.jpeg` (act-agnostic hall). Render-gated the Base hub (Act 1 + 2): backdrop reads as a hero room, cards/
action-rail stay legible. `curriculum` green. (`bg-base-room.png` left untouched per the DESIGN-ALIGNMENT "don't
delete the staged room" note — relevant only if the layered hub is revived.)
