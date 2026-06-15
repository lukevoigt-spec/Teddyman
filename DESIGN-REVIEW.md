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
