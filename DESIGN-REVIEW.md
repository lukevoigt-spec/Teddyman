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

## 2026-06-18 · #172 Training-Room discoverability — prominent labeled Base entry  ·  PASS
**Branch:** `oracle/172-training` → PR. PLAYTEST 2026-06-19: it wasn't intuitive that coins come from the
Training Room (only entries were the small gems/coins chip + daily bar). **Oracle build:** a prominent
BLUE plate `#baseTrainBtn` top-centre of the Hero Base — crafted gold **dumbbell** (new `UICONS.dumbbell`)
+ "TRAINING" + a **coin** — so "earn coins here" reads at a glance. Blue distinguishes it from the gold PLAY
CTA; gentle pulse (calm/Lite/reduced-motion gated) for discoverability; big touch target; no emoji. Wired
→ `showTrain`; the gems/charge/daily taps stay as secondary paths (parent: "can stay").
**Shots:** `basedaily` (Act-1) + `base2` (Act-2) — prominent, clear, doesn't crowd the hero/panels.
Tests: ui-emoji 44/44, curriculum 116/116, save 129/129.
**Neo (still open on #172):** make the coin-earning legible ON entry to the Training Room (a clear "earn
coins!" affordance + prominent per-rep coin reward) so the loop is obvious the first time he lands there.

---

## 2026-06-18 · #162 map node touch targets in portrait — §20 confirmation  ·  PASS (no code change)
Confirmation-only gate (Neo's hit-rect work merged via #164 + #167; #162 was open only for the Oracle's
§20 sign-off, like #152). Independently MEASURED at 768×1024 portrait with a new `tools/measure-map.mjs`
(boots the game, seeds done/current/locked states, reads each `.mnode` CSS bounding box): **every node
state = 102×102 px ≥ 96** (constraint #6). `map-portrait.png` confirms the visual is intact — nodes on the
golden path, hero at the current zone, the enlarged 208×208-SVG-unit hit areas are transparent (no visual
harm). No game code change. Closing #162. (`measure-map.mjs` kept as a reusable touch-target gate tool.)

---

## 2026-06-17 · #163 render-fixes — Gem-Dex CTA clip + win-screen chest overflow (1024×768)  ·  PASS
**Branch:** `oracle/163-layout` → PR. Morpheus flagged two layout misses; **render-confirmed BOTH still
present at 1024×768**, then fixed:
1. **Gem-Dex card CTA clipped** — `.coll-card` (26 gems + Recharge) was `overflow:auto` so the `#collAction`
   CTA fell below the fold (and scrolling pushed the close button off). **Fix:** `.coll-card` is now a flex
   COLUMN — pinned title + scrollable `.coll-grid` (`flex:1; overflow-y:auto`) + **pinned Recharge CTA**;
   close button is absolute to the (no-longer-scrolling) card. Confirmed: "RECHARGE GEMS" visible at rest.
2. **Win screen overflowed with the earned chest** — with `#winChest` in the centered stack (VICTORY +
   hero + chest + bubble + gear + XP + CONTINUE), VICTORY! clipped off-top (measured `top=-18`). **Fix:**
   `winChestPop` toggles `#scrWin.haschest` (only when a chest shows) → CSS reclaims height (gap 14→8 +
   hero capped 22vh). Confirmed: VICTORY! fully visible with the chest present.
**Shots:** `gemdex` (Recharge CTA pinned + visible), `winchest` (S.chests gold → chest shows + VICTORY
not clipped). Render-gated at the exact 1024×768 viewport. Tests: ui-emoji 44/44, curriculum 116/116,
save 129/129.
**Sibling issues:** #152 (mastery counter) = DONE (title `game.js:661` + map `map.js:275` + the #126 gem-dex
card) — PASS, no change. #162 (map node touch targets in portrait) = Neo's #164 fixed the current/play-next
node; locked-node sizing is Neo's remaining call (map.js hit-rect, not Oracle).

---

## 2026-06-17 · #60 Ally cheer-pops → painted raster (last SVG character tokens)  ·  PASS
**Branch:** `oracle/ally-raster` → PR. The league shelf + win mini-face already used the painted
`ally-<kind>.png` rasters; the CHEER POPS (`allyPop` in allies.js, `trainPop` in game.js) were the last
spots still rendering the SVG `allyFace` token. Switched both to `allyRasterImg(kind,76)` with the SVG as
fallback only for kinds without a raster yet (e.g. jj). `trainPop` returns the SVG element ONLY on the
fallback path, so the talking mouth-move (`mouthStart`, SVG-only) cleanly skips for raster pops instead of
breaking. CSS-light (allies.js + game.js render only).
**Shot:** `cheerpop` — Archie's painted portrait pops bottom-left over a Find round, cast-consistent with
the shelf/win face. Tests: ui-emoji 44/44, curriculum 116/116, save 129/129. PASS. (Cast is now fully
raster — no SVG character tokens left in child-facing UI.)

---

## 2026-06-17 · #145 squishy economy v2 — the +50 painted squishies + rarity treatment (& #152 counter gate)  ·  PASS
**Branch:** `oracle/squish-art` → PR. Neo shipped the economy (#160: BASE_ITEMS unlockZone/rarity + store
unlock-filter + zone-clear card); the squishies were INERT until art shipped (`squishVisible = squishShipped`).
**Built (the unblocker):**
- **50 painted kawaii squishies** (`art/squish-<id>.png`, gen.mjs gpt-image-1 → de-halo) matching the
  existing set's style (clean dark-navy outline, glossy candy palette, simple cute face). Added all 50 ids
  to `SQUISH_SHIPPED` so they go live in the store/collection. Spot-checked ~13 across tiers — cohesive,
  premium, on-roster (Strawberry Kitty, Lava Lizard, Wizard Cat, Pirate Parrot, Dragon Queen Plush…).
- **`de-halo` hardened** — added a 2px edge-erosion pass; gpt-image-1's white sticker fringe is fully gone
  (the bulk flood-fill left a thin anti-aliased rim). Reusable for all future OpenAI cutouts.
- **Rarity treatment** (`game.js` adds `r-rare`/`r-epic` to the slot; `styles.css`): rare = cool-blue aura +
  blue corner gem, epic = purple aura + purple gem, common = plain. On the squishy IMAGE so it layers over
  the owned/buyable/zlocked slot states (which own the border/box-shadow).
**Shots:** `storenew` (the new rares live with art + prices + blue rarity gem/aura), spot-checks
(heroteddyplu/wizardcat/dragonqueenp/pirateparrot — clean, no halo). Tests: ui-emoji 44/44, curriculum
116/116, save 129/129.
**#152 mastery counter — §20 PASS (no change).** Neo's `.gemdex` reads premium: `mastercount` shows
"14 / 26 gems mastered" + the ghosted next-to-master gem (Zeigarnik gap) above PLAY; placed on title + map.
**Follow-up (Trinity, optional):** per-squishy `SQUISH_BLURB` one-liners for the 50 new (detail card falls
back to a generic line until then — fine, not blocking).

---

## 2026-06-17 · #126 whole-set collection cards (gem-dex + villains) — §20 styling  ·  PASS
**Branch:** `oracle/collcard` → PR. Neo shipped the card DOM in #146 ("Oracle owns the painted case look,
shared with #124"). **CSS-only.** Applied the SAME display-case language as the #124 squishy case to
`.collslot`, so all four collection surfaces (squishy store/collection + gem-dex + villains) now read as
ONE system: owned slots POP (gold frame + glow), retained/mastered gems get a stronger glow, not-yet =
**sunken dashed empty SOCKETS** (faint silhouette + "?"). Plus an Act-2 override so the villains-card cage
bars go IRON (matching the act2-modals cages), not Vex-blue.
**Shots:** `gemdex` (26 letter gems — gold-framed owned + dashed empty sockets, "13/26 · 50%"), `villdex`
(captured bosses in gold cages + dashed empty sockets). Consistent with the squishy case, premium, emoji-
free. Tests: ui-emoji 44/44, curriculum 116/116, save 129/129.
**This clears the last Oracle item in the #124/#126 batch** — squishy/gem/villain collections + the Hero
Base now share one cohesive collection-case visual language.

---

## 2026-06-17 · Button consistency — unify secondary (ghost) buttons into the plate family  ·  PASS
**Branch:** `oracle/ghost-btn` → PR. Parent: "evaluate whether any buttons need to be render-painted — we
want consistent buttons." **Evaluation:** primary actions (all 52 `.btn`) already use the painted 9-slice
plates (gold/blue/wood) — consistent; nav corners use painted images; tiles/chips are different components
(correctly differentiated). The ONE gap was `.btn.ghost` secondary buttons (SOUND IT OUT / BACK / CLOSE /
One more mission / player-switch): a pale outline pill (the base `.btn::after` sheen over a transparent fill)
that read as a different language. **Verdict: no new painted asset needed** — a flat secondary is valid
hierarchy and painting everything would dilute the primary plates. **Fix (CSS-only):** restyle `.btn.ghost`
as a QUIET sibling of the plate — dark translucent fill + a gold frame echoing the plate (bronze under
`body[data-act="2"]`), lighter-weight than primary so hierarchy holds.
**Shots:** `rest` (painted gold REST plate beside the gold-framed ghost = one family), `read` ("SOUND IT
OUT" now a gold-framed button, not a white pill), `rest2` (Act-2 wood plate + bronze ghost). Premium,
consistent across both acts. Tests: ui-emoji 44/44, curriculum 116/116, save 129/129.
**Incidental (not buttons, for Neo/Trinity):** the Act-2 Rest narration still reads "Star Force City" —
should be "Magic Kingdom" in Act 2 (copy, not chrome).

---

## 2026-06-17 · #124 Squishy collection-case + store — §20 styling pass  ·  PASS
**Branch:** `oracle/squishy-case` → PR. Neo shipped the view-split DOM in #142 ("Oracle owns the case/slot/
badge/cart LOOK §20"); this is that styling pass. **CSS-only** (`styles.css`).
**Built on the #142 hooks (`#shopTabs`/`.shoptab`/`.slotitem`/`.ic.faint`/`.dupbadge`):**
- **Collection = a display CASE.** Owned slots POP (gold frame + soft glow); **un-owned slots are sunken
  dashed empty SOCKETS** (inset shadow, faint silhouette + "?") so they read as "collect me" (album/Pokédex
  drive — the intentional departure from show-only-earned, per the #124 spec).
- **×N duplicate badge** → a gold stack pill (Minecraft-style stacked inventory).
- **Collection/Store toggle** → premium pills; the **painted cart** (`art/cart.png`, my #134) is the Store
  tab and pops when active — closing the #124 loop (Neo split + Oracle case + the cart art).
**Shots:** `collection` (owned gold slots + gold ×N badges + dashed empty sockets), `store` (cart-tab active,
buyable squishies + coin prices). Premium, emoji-free, reads like a real collection screen. Tests: ui-emoji
44/44, curriculum 116/116, save 129/129.

---

## 2026-06-17 · #132 screen transitions — premium enter + learning-gentle variant  ·  PASS
**Branch:** `oracle/transitions` → PR. DESIGN-ALIGNMENT #10 / Award Bar A7 (continuous choreography).
**Finding:** the beatIn push-in was ALREADY generalized — `show()` adds `.fadein` to every screen (the
`fade` keyframe = opacity + 16px push-in), and reduced-motion is already killed globally
(`*{animation:none}`). So #132's core was in place; the gaps were *feel* + the learning-screen guardrail.
**Fix (CSS-only — the `show()` hook already exists, zero game.js):** non-learning screens get a premium
push-in (`screenIn` .42s cubic-bezier(.2,.85,.25,1), subtle scale .985, transform/opacity only — GPU-cheap);
**learning screens (`body.learning`) + Calm + Lite get a gentle fade ONLY** (`screenFade`, no push-in/scale)
so the decoding prompt never "performs" (seductive-details). reduced-motion still disables all of it.
**Render note:** motion isn't statically capturable; verified (a) the CSS/curve + existing hook, (b)
no layout regression on `map`/`find`/`win` settled frames (the enter completes before the shot). Tests:
ui-emoji 44/44, curriculum 115/115, save 121/121. PASS.

---

## 2026-06-17 · §20 render-gate of Neo's batch + Hero-Rank XP styling  ·  PASS (+1 finding)
Rule-#8 render-gate of the merged batch (#137/#131 XP, #138/#130 FTUE, #136 hero-flip, #135/#139 win-chest).
Added scenes: `basexp`, `xpwin`, `winchest`, `ftueforge`, `wedoforge`.
- **#131/#137 Hero-Rank XP — was a FUNCTIONAL placeholder (Neo: "Oracle owns the look"); STYLED + PASS.**
  Two issues found on main: (a) `#baseXp` is normal-flow but the base hero is `position:absolute`, so the
  meter drifted off-screen (invisible); (b) the bar was a thin flat-blue placeholder. Fix (`oracle/xp-style`,
  styles.css): premium GOLD rank bar (glossy amber fill, dark rim, "RANK n") + seat `#baseXp` absolutely
  under the hero pedestal (Act-1 + Act-2 placement), and the `.xppop` "LEVEL n!" recolored gold to match.
  Shots: `basexp` (Act-1 "RANK 3" under hero), `base2` (Act-2 "RANK 5" under knight), `xpwin` (gold "RANK 7"
  bar + gold "LEVEL 7!" pop). PASS.
- **#130/#138 FTUE demos — PASS.** `ftueforge` (I-do intro reads clean), `wedoforge` (we-do scaffold). The
  `.demo-hi` gold highlight + `.wedo` pulse are CSS animations (not statically capturable) — reviewed the
  CSS + logic; calm/lite/reduced-motion gated. PASS.
- **#136 hero-card flip — PASS** on Chromium (`teddycard` renders correctly). The fix is WebKit-specific;
  trusting Neo's engine fix (I can't drive WebKit headless reliably — SHOT-1).
- **#127 win-chest — box look PASS** (`.winchest` chest + "TAP TO OPEN!" + bob is on-style). **FINDING:**
  `#winChest` sits AFTER the CONTINUE button in the win flex column, so it renders below the fold in a
  1024×768 shot — which undercuts the "instant reward pop" intent. Recommend Neo reorder it ABOVE the
  button row (or make it a brief pre-CONTINUE beat). Flagged on #127; not a blocker.

---

## 2026-06-17 · Grown-Up Corner — settings game-feel pass (premium cards)  ·  PASS
**Branch:** `oracle/settings` → PR for Neo (off fresh main after #128/#118). DESIGN-ENGAGEMENT §9 /
DESIGN-ALIGNMENT #7 (modal gem-glow). **CSS-only** (`styles.css`) + 1 render scene — parent-requested
("current Grown-Up Corner isn't intuitive… study how real games lay out settings").
**Problem:** the section cards were flat translucent rectangles with a thin 1.5px border — readable but
not "crafted panel" premium; no structure between a header and its controls.
**Fix:** `.setcard` + `.hubcard` become §4 gem panels — a defined gem-purple border, a soft outer glow,
a top sheen, richer bg; each `.setcard-h` gets a divider rule under it (header/controls separation). The
`.danger` (Reset) card gets a matching rose treatment. **Act-2 parity:** warm-bronze glow + bronze hub
cards + bronze header rules under `body[data-act="2"]` (so the purple glow doesn't bleed onto the medieval skin).
**Shots:** `hubsettings` (Act-1 gem-purple panels, header dividers, premium depth), `a2settings` (Act-2
bronze panels, MedievalSharp). Both read like a shipped game's settings; parent emoji in the headers are
allowed (Grown-Up Corner). Tests: ui-emoji 44/44, curriculum 115/115, save 121/121.
**Note:** this is the card/chrome polish; the deeper IA rethink (hub flow / "intuitive") is a larger
separate pass if the parent still wants it after seeing this.

---

## 2026-06-17 · Act-2 reward-modal medieval reskin (hero card · villain cage · unlock)  ·  PASS
**Branch:** `oracle/act2-modals` → PR for Neo (off fresh main after #116/#123/#125 merged). DESIGN-ALIGNMENT
#11. **CSS-only** (`styles.css`) + 3 render scenes — zero `game.js`, zero conflict surface.
**Problem:** the three reward modals kept the Act-1 superhero VIOLET (`#2c2160`/`#2a1c44`/`#2a2058`) in the
medieval realm, and the cage bars were the Vex sci-fi blue — a cohesion break against the established
`body[data-act="2"]` stone/bronze chrome.
**Fix:** `body[data-act="2"]` overrides → stone+bronze bodies with a warm torch glow; the unlock rays go
amber; the captured-villain cage gets an ember-danger accent (it's a dragon/the Vixen); cage bars (both the
big `#bossCage` and the small Base-shelf `.bf-cage`) become IRON grey, not Vex-blue. Gold accents kept
(reads in both worlds). Act-1 untouched (overrides are act-2-scoped); learning tiles untouched (reward modals).
**Shots:** `a2herocard` (SIR TEDDY card, stone/bronze, cape picker correctly hidden in Act 2), `a2boss`
(THE DRAGON, ember frame + iron bars), `a2unlock` (WAR MACE, torch-gold). All cohesive with the medieval
skin, emoji-free, premium. Tests: ui-emoji 44/44, curriculum 115/115, save 121/121.

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

## 2026-06-17 · Training Room — treasure-vault visual redesign  ·  PASS
**Branch:** `oracle/training-room` → PR for Neo. Addresses the parent PLAYTEST (2026-06-15): the room
"has no climax / becomes a chore." The Training LOGIC was already solid (hoard tiers, `vaultMilestone`
climax burst, `flyReward` coin arc, ally interrupts wired) — this is the **visual half** (Oracle-owned).
Already emoji-free (crafted `diamondIcon`/`barIcon`/`gicon` — the playtest "emoji" note predated the sweeps).
**Built:** the flat 3-cell counter → a framed gold **TREASURE VAULT** holding a *growing pile* — vertical
STACKS of overlapping coins → gold bars → diamonds the child visibly builds rep by rep (the "peak" to climb
toward; the `vaultMilestone` burst is the climax when a tier converts up). Show-only-earned (empty tiers
hidden; a friendly zero-state line). `#trainCoinN` kept as the live coin counter so `flyReward` still arcs
coins into the stack. `game.js` (`trainHoardHTML`/`trainPile`) + `styles.css` only — no index.html (avoids
Neo's active files). Act-2 skin variant + Calm/Lite aware.
**Shots:** `coinfly` (hoard 37 → 3 bars / 7 coins), `vault_hud` (149 → 1 diamond / 4 bars / 9 coins),
`vault_dia` (the "A DIAMOND!" climax burst + confetti over the vault). Premium, emoji-free, UI lives in the
painting, clear focal point. Tests: ui-emoji 44/44, curriculum 115/115, save 121/121.
**Still Neo's (game logic, not art):** sync the 4 approved no-streak interrupt lines to `data-lines.js`
(QA #2), gate JJ/Nora/Cal interrupts on rescue + the Act-2 roster reconcile (QA #1).

---

## 2026-06-16 · De-emoji pass #2 — titles, NEXT/CHOP, combo/mastered/rank pops  ·  PASS
**Branch:** `oracle/de-emoji` → PR for Neo. Closes the gap left by #104: an audit (code-checked) found
child-facing emoji still on main that the `ui-emoji.test` ratchet wasn't scanning — so CI stayed green
over them (parent: "seeing a lot of emoji still").
**Surfaces fixed:** Vault/Scroll/Warm-Up screen **titles** (🔋📜🔥), **win/rest buttons** (🗺️🎯😴), the
**live combo chip** (🔥), **MASTERED** (✦), **RANK UP** (⭐), **CHOP** + syllable gap (✂️/✂), every
**NEXT** (➜) + homecoming **THE END** (✅), and the legacy map done-node ✓.
**Fix:** new crafted `UICONS` in the house language — `scroll`, `flame`, `moon`, `spark`, `scissors`
(+ reuse `bolt`/`chevron`/`map`/`play`/`check`). Static labels cleaned in `index.html`; runtime labels
inject the crafted glyph in `game.js`. Heart-Word **♥** left as-is (pedagogical content, not chrome).
**Shots (`tools/shots/chromium-*`):** `vaultfull` (bolt title + charged spark), `juice` (MASTERED spark),
`bigword` (CHOP scissors), `bigchop` (gap scissors), `intro4` (NEXT chevron), `learn_s` (TRACE chevron),
`rescue_win` (CONTINUE). All read premium, emoji-free, icons consistent, UI lives in the painting. The
combo-flame wasn't captured live (the chip auto-fades) but is wired + unit-asserted.
**Tests:** `ui-emoji` 44/44 (extended: per-screen clean zones + positive runtime-injection assertions),
`curriculum` 115/115, `save` 121/121. **PASS.**
**Coordination:** Neo is concurrently rewriting `tests/ui-emoji.test.js` into a full child-scan (#102) —
our test edits WILL conflict; this code de-emoji and #102 are complementary (his scan catches these, my
code removes them). Flagged for Neo to reconcile at merge (prefer #102's full-scan where it overlaps).

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
