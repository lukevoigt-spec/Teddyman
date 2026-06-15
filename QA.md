# QA.md — Review Notes & Handoff for Super Teddy

> **Advisory** review/handoff notes (QA agents write here; only **Neo** edits code + merges to `main`).
> **CLAUDE.md is the source of truth** on conflict; **AGENTS.md** holds crew & workflow. Sign entries `— name, date`.

---

## ⭐ CURRENT PRIORITIES FOR NEO

> 🔴 **TOP PRIORITY (parent escalation 2026-06-15) — the PREMIUM UI OVERHAUL** at the top of `DESIGN-ALIGNMENT.md`: the
> UI shipped amateurish + emoji-heavy. New hard rules now have teeth → STYLE.md non-negotiables **#6 (emoji BANNED in
> child UI)** + **#7 (UI-in-the-world + render gate)**, new **§18 icon system**, **§19 premium diegetic Hero Room**,
> **§20 render-review gate**. Neo: **(1) SVG icon registry + kill all UI emoji** (shop first) + `tests/ui-emoji.test.js`;
> **(2) rebuild the Hero Room as a diegetic painted room** (layout FIRST, not last); **(3) screenshot-and-look before
> "done".** ⚠️ `bg-base-room.png` is the **staged room background — keep & wire, do NOT delete.**
>
> 📐 **The consolidated retro-fit checklist is `DESIGN-ALIGNMENT.md`** (5 deep-dive audits, prioritized + file:line). Newly
> confirmed SHIPPED: **M-#2 action-rail FIXED**, **`flyReward` BUILT**, **treasure chests BUILT**, **mastery contract
> honored**. The old "store de-emoji" + "Hero Room" items are **superseded by the Premium UI Overhaul above.**

Skim top-to-bottom; roughly priority order. Detail (file:line / spec) is under **🔧 OPEN WORK — BY TOPIC**.

1. **🐛 Hero Base action-rail bug (do early) — M-#2** (credit: Morpheus). The left `.basecol-hero`/Loadout has
   **no scroll path**, so at 1024×768 landscape it overflows under `.baseactions` (TRAINING/SHOP/RECHARGE/CITY MAP),
   hiding earned-gear controls. `#scrBase` fixed-height flex col (`styles.css:855`); `.baseactions` after the
   growing `.basewrap` (`index.html:166-170`); only `.basecol-coll` gets `overflow-y:auto` (`styles.css:882-883`).
   **Fix:** give `.basecol-hero` `max-height:100%; overflow-y:auto` on short landscape, OR a fixed bottom action
   rail + matching `.basewrap` bottom-padding (STYLE.md §7.4 #4). Keep ≥96px; verify `shot.mjs base basefull` +
   Act-2 Base at 1024×768 + portrait.
2. **🎮 Engagement / juice build order** (specs in **DESIGN-ENGAGEMENT.md §4–11**; all bound by the **§6.0
   Mastery-not-participation contract**): coin-fly `flyReward` juice pass → **treasure chests** (§10) → **Hero Rank
   meter** → **store expansion / de-emoji** → **Hero Room** (§11). Best delight-per-effort order is §7.
3. **🗺️ MAP REDO** (parent directive) — regenerate a **calmer** painted bg, then rebuild the path + `ZONESPOTS`.
   Supersedes the cosmetic map tweaks (U2/U6/U12). See **World Map** below.
4. **⚙️ Settings game-feel pass** — DESIGN-ENGAGEMENT.md §9.1 (detailed spec).
5. **🔧 Remaining U-series chrome fixes** — **U8** (finale boss escalation), **U10** (intro skyline art), **U13**
   (league-name fit). *(U1–U7, U9, U11 all shipped this session — see ledger; U12 folds into MR2 / MAP REDO.)*
6. **🧠 Pedagogy** — **rec #2 Spell Scroll** (repeated reading), **rec #6 Word Crafting** (morphology capstone), the
   **Act-2 finale comprehension-proof gap** (top reading-core item), and **gear pacing P2/P3**. *(Memory Vault
   scheduler #1 + Recharge surfacing, rec #3 articulatory cue, and rec #4 mastery-threshold all shipped this
   session — see ledger.)*

---

## ✅ RESOLVED LEDGER

One line each; long detail/spec blocks were removed on consolidation.

- ✅ **Code-review #1 cloud auth** — parent-entered Family sync code + fail-closed Worker (constant-time, size cap,
  dead `CLOUD_PASSPHRASE` removed); also closed #4 (Trinity, verified, `7cfcce6` + auth commit).
- ✅ **Code-review #2 reset-resurrection** — `clearBackup()` drops backup on reset/Level-0; snapshots kept (Neo, `7cfcce6`).
- ✅ **Code-review #3 magic-e remediation** — `masteryReview` routes magic-e units to `startMagic`, letters/digraphs/
  teams to `startFind`; no `snd_a_e` foils (Neo, `7cfcce6`).
- ✅ **Code-review #4 cloud-off persistence** — `resolveCloudURL()` + `"off"` sentinel survive reload (Neo).
- ✅ **Code-review #5 locked capes** — correctly left alone (CSS `pointer-events:none` already guards).
- ✅ **H3 subtitle** — generic "A HERO READS. A HERO RISES." (index.html:75); not re-Act-1-ized (Neo, verified).
- ✅ **H4 one-PLAY title** — single PLAY (game.js, `btnPlay`): `Aud.pick()` + first-run intro branch; START/CONTINUE/
  title-Base removed; iOS audio-unlock preserved (Neo, verified).
- ✅ **`charArt`/`RASTER` resolver** — manifest + per-character flag + SVG fallback (Neo, verified).
- ✅ **Raster cast** — Teddy ×6 tiers + Vixen + Vex + Dragon + Noah + 5 allies + Mom/Dad; all premium + on-brief
  (Trinity-verified `af9e345`). Map raster hero (M1) shipped.
- ✅ **MAP-1** — map hero + ally figures `pointer-events:none` (tap-through to `.mnode` fixed) (Neo).
- ✅ **MAP-2** — locked zones stay tappable so the gentle `locked_tip` cue plays; lock still JS-enforced (Neo).
- ✅ **CLOUD-1** — `cloudPull()` 401 flagged distinctly; wrong code reported + cleared, not cached as "Connected" (Neo).
- ✅ **Pacing P1** — grandfather plumbing (durable `S.freed` + `S.gearByAct`, migrate-safe); plumbing-only, no regression (Neo).
- ✅ **Memory Vault #1** — Leitner box/due scheduler on `S.mastery`, additive/save-safe (Neo).
- ✅ **Morpheus PR#3 magic-e** — fortress `fortRead()` + Recharge `vaultBuild` mis-taught magic-e audio (short /a/ +
  voiced silent-E for "cake") — fixed to the shared magic-e-aware tile renderer (Neo, merged 2026-06-14).
- ✅ **U1 touch targets** — ear 52→72px (~96px hit-area), round nav/gear 54→72px (Neo, `1d4ce8c`).
- ✅ **U2 map contrast** — brighter locked labels on opaque pills, `textLength` glyph-stretch removed, subtitle
  ink-stroked, progress counter bigger+stroked (Neo, `1d4ce8c`).
- ✅ **U3 Grown-Up Corner** — parent HUB→drill-down + lazy section paint + bigger parent text (`4d257a9`) + the **P3
  cognitive math-gate** replacing the weak 3s hold (`593c311`). (Closes the P1 parent-hub spec.)
- ✅ **U4 intro/scan/forge CTA** — pulsing gold play-orb gives a clear first action on the bare stage; audio-first
  auto-advance preserved, no text label (`e6e501f`).
- ✅ **U5 picture-tile icons** — flat-vector `picIcon()` for all 63 READWORDS/READWORDS2 words (`0335140`/`77f1be0`/
  `71d2fd3`). *(Shop `BASE_ITEMS` icons are still emoji → folded into the store de-emoji, DESIGN-ENGAGEMENT.md §4.5.)*
- ✅ **U6 / MR1 map hierarchy** — scrim+vignette push the painting back; current node dominates (beacon + hero),
  done/locked recede; Lite flattens blooms; lock-gate unchanged (`1bbf2b8`).
- ✅ **U7 Base zero-state** — hide empty collection cards (show-only-earned), raise card-text contrast + breathing
  room; brighter trace ghost letter (`b507eef`).
- ✅ **U9 trace stroke guidance** — uniform dots + marked NEXT dot + stroke-order numbers + dashed direction paths
  (Act-1 O-G) (`50e5fd8`).
- ✅ **U11 `.bubble` clip** — right padding 70→92px clears the enlarged 72px ear (`23341b8`; `.bubble{padding:16px 92px…}`).
  *(I briefly re-opened this with a malformed grep — Neo's catch; it IS shipped.)*
- ✅ **Pedagogy rec #3 (P1) articulatory cue** — every taught grapheme shows a kid mouth-shape + "how your mouth makes
  it" line (`mouthCue`/`MOUTHCUE`); magic-e excluded (`4353acf`). *(The Sound Warm-Up oral-PA drill (part A) is still open.)*
- ✅ **Pedagogy rec #4 mastery-threshold** — split PROFICIENT (gates finales + ★, bumped to seen5/acc.8) from RETAINED
  (`retainedItem` game.js:188 = proficient + correct on ≥2 days → Base gold ✦); `okDayCount` in `record()`; `migrate()`
  grandfathers old proficient items (`382f0da`).
- ✅ **Memory Vault scheduler (#1) + surfacing** — Leitner box/due on `S.mastery` (`27a608c`) + the **"Recharge the
  Gems"** Base activity that deterministically re-exposes due items (sound-ID / build / sight-split), daily nudge + due
  badge, no new task type (`fd4097d`).
- ✅ **Mastery-weighted juice** — `record()` fires the loudest celebration on the moment of MASTERY (gold "MASTERED!" +
  `Sfx.mastery` + confetti, intermittent); combo escalates on accuracy streaks — the red-team dial in code (`a73f0c6`).
- ✅ **`tools/shot-cloud.mjs`** — durable cloud render harness landed (`bf1e0c8`).
- ✅ **Settings / Grown-Up hub refactor groundwork** — settings overhaul shipped; P1 full hub spec still open below.
- ✅ **Equippable weapons** — WEAPONS catalog, act-gated, rendered held in `heroSVG`.
- ✅ **Villain shading** — dragon/Vex form-shadow + rim-light pass.
- ✅ **Generated-art render/verify loop** — `tools/svg-shot.mjs` + cloud npm-Chromium recipe verified (durable
  `tools/shot-cloud.mjs` is Neo's lane to land).
- ✅ **Morpheus M-#1 "rest cadence never resets"** — DISMISSED (false alarm; `sessionTick()` is called at `map.js:115`).
- ✅ **Daily.missions firstTime guard, profile escaping, level-override safety** — prior items confirmed addressed.

---

## 🔧 OPEN WORK — BY TOPIC

### 🧭 NAVIGATION VALIDATION — first-principles (Trinity, 2026-06-14)
Validated the **shipped** nav (code + the parent's real forge/trace screenshots) against the STYLE.md §7 canon. Holistic
verdict: **architecture is SOUND — Neo did the hard structural work well; the gaps are about a pre-reader's
discoverability + tablet ergonomics, and they converge on one move (which also generalizes the open MR3).**

**✅ First-principles SOLID (don't churn these):**
- **One global nav surface, same place every screen** (Jakob / §7 #2) — the top-left chip+menu is consistent on every
  non-title screen. Strong foundation.
- **Status + nav co-located + always an exit** (visibility of status + user-control-and-freedom / #8) — Home in the
  menu, `⏭` skip bottom-right, explicit Map↔Base buttons. No dead-ends; locked map nodes gated.
- **Spatial wayfinding** (the journey map, done/current/locked) — a pre-reader reads progress without literacy.
- **Progressive disclosure** — parent gear behind hold+math. **One primary action** on the title (PLAY). **Nav
  structure identical across acts** (only reskinned). All textbook-correct.

**⚠️ First-principles GAPS (prioritized):**
1. **🔑 The global nav is HIDDEN behind a TEXT-chip dropdown — the weakest link for a pre-reader.** The primary
   wayfinding control is a city *name he can't read* + a tiny `▾`; he must first discover the chip is tappable and that
   `▾` means "menu." This violates §7 #3 (**icon+audio, never text alone**) at the most important level. On mission/
   learn screens the dropdown is the *only* global nav. **This is the same issue MR3 raised for the map — but it's
   holistic, not map-only.**
2. **Nav lives in the TOP zone (hardest thumb reach on a landscape tablet).** §7 #4 = status top, **actions bottom/
   corners**. The chip-nav (an action) is top-left = the stretch zone; only `⏭` (bottom-right) and the map's bottom-left
   Base button are well-placed. Persistent nav should sit in the **bottom corners**.
3. **The chip is overloaded** — it's simultaneously the location *label* (status, changes every screen) AND the nav
   *trigger* (constant). Mixing changing-status with constant-control hurts learnability; separate "where am I" from
   "where can I go."
4. **Destinations — RESOLVED (parent, 2026-06-14): the cluster is Map + Base ONLY.** Two clear "places" for the lowest
   cognitive load (Hick/Miller); **Home / title / profile-switch move to the parent gear area** (Grown-Up Corner), so a
   7-yo never juggles two "home-like" anchors. (Home/title is rarely needed mid-play — mostly profile switching, which
   is parent-only anyway.)

**🎯 Holistic recommendation (single highest-leverage move) — full resolved model in MR3 below.** Evolve the global nav
from a **text-chip dropdown** into an **always-visible 2-icon dock (🏠 Base + 🗺️ Map), bottom-left, icon+audio**; the
chip becomes pure **status**; the **dropdown is removed**; parent nav (Home/title, profile-switch, Settings) collapses
into the **gear → Grown-Up Corner**. This fixes the pre-reader discoverability gap (#1,#3), the thumb-reach ergonomics
(#2), and the overloaded chip (#3) at once, with one surface per audience and zero redundancy. **= MR3, now the
standing global pattern.**

**Net:** the bones are right; the one change that most improves the *holistic* experience is making the global nav
**seen, not discovered** — visible icons a non-reader recognizes, in the easy-reach zone.

### UI Chrome & Buttons
- 🎯 **U14 (PARENT-DIRECTED) — restyle the scan/forge "tap to start" orb (`#tapStart`) YouTube-style.** *What it is:*
  the U4 primary CTA shown during the **scan + forge intro-narration** phases (`showTapStart`, game.js:586/1145;
  auto-hidden on round start + any nav) — tapping starts the round early (same as ⏭). **NOT a cutscene control.**
  *Problem (parent, with screenshot):* the **opaque gold disc** (`.tapstart`, styles.css:1002) sits dead-center over
  the villain/scene and a 7yo doesn't read it as "play." *Fix (CSS-only — borrow the universally-recognized YouTube
  affordance, Jakob's Law / STYLE.md §7):*
  - **Translucent dark disc** instead of the gold gradient: `background:rgba(8,6,20,.5)` + `backdrop-filter:blur(3px)`
    (glassy) — so it stops covering the painted art.
  - **White triangle:** set `color:#fff` (the SVG triangle uses `currentColor`) → white play-glyph on dark = classic
    YouTube. Drop the 6px ink border for a thin ring: `border:3px solid rgba(255,255,255,.85)`; soften the shadow.
  - **Keep** size (≥96px tap), the `tapbob` pulse (reduced-motion aware) for affordance, the placement (scan 72% /
    forge 50%), and the behavior (onclick → start round). Optional: a soft expanding pulse-ring to say "tap me."
  - *Why:* kids navigate YouTube; translucent-disc + white-triangle is the most recognizable "play" signifier, and the
    translucency fixes it obscuring the character. Verify on the forge + scan intros (`shot.mjs`).
- 🐛 **U15 (PARENT-SPOTTED) — trace ghost letter is MISALIGNED with the trace dots.** *Root cause (unintentional):*
  the faint ghost is the **Andika font glyph** (`<text class="guide" x=150 y=232 font-size=260>`, startTrace
  game.js:749) positioned by FONT METRICS, while the dots come from a **separate hand-authored table** `TRACE[g]`
  (data-content.js). Two independent representations of the letter, never registered → the glyph and the dot-path
  don't overlap. The U9 brightening (.16→.34) made the long-standing mismatch obvious. *Why it matters:* the ghost is
  meant to work **with** the dots to teach stroke order/shape (O-G multisensory); misaligned it confuses the
  pre-reader/dyslexia profile trace exists for. *Fix (recommended — single source of truth):* render the ghost from
  the **SAME `TRACE[g]` points** — a faint, thick, rounded stroked `<polyline>` per stroke (the letter's stroke
  skeleton) **instead of** the `<text>` glyph. Then ghost + dots align by construction, it shows the true handwriting
  stroke (more O-G correct than a typographic glyph), and it's font-load-independent. Keep faint (~`rgba(255,246,227,
  .30)`), thick (~24–32px), behind the dots; drop `<text class="guide">`. *(Alt, NOT recommended: per-letter tune the
  `<text>` x/y/font-size to register — fragile, font-metric-dependent, breaks on late font load.)* Verify each `TRACE`
  letter (`shot.mjs`; Act-1 only — digraphs skip trace).
- 📋 **H1 — Title logo font.** Bangers `.title-logo` (styles.css:243/478) is generic vs the premium art. Options:
  keep / elevate treatment (gradient+bevel+gem accents) / bespoke SVG-PNG wordmark (act-agnostic, no font load).
  ⚠️ Restyle **`.title-logo` only**, NOT `.comic` (used app-wide); lock the logo font regardless of `data-act`
  (the `body[data-act="2"] .comic`→MedievalSharp swap at styles.css:910 would silently change it). Low urgency.
- 📋 **H2 — Buttons too plain (cross-cutting, every screen).** `.btn`/`.ghost` flat pills (styles.css:25-37) vs
  painted scene. **CSS-premium first** (bevel/texture/gem-rivet accents); if using gen art, **9-slice `border-image`**
  or tileable texture behind CSS text — **never** a text-baked PNG (labels vary: START vs CONTINUE MISSION). `.btn`
  restyle propagates everywhere; keep ≥96px + `:active` press; Lite/Calm flatten heavy filters; plan an Act-2
  stone/bronze variant; CSS tokens not raw hex.
*(U3 Grown-Up layout, U4 intro CTA, U5 word-tile icons, U9 trace guidance, U11 bubble pad — all SHIPPED this
session; see ledger. Open chrome below.)*
- 📋 **I2 — Scan-calibration tiles** plain text vs premium gem chrome — upgrade tile chrome only (keep glyph in
  Andika, sound→letter; don't make it text→text). Gated by `S.scan`; don't break intro→scan→map.
- 📋 **I1 — Intro `.panelart` boxy frame** → full-bleed / generated (shared with the interlude; pilot one beat;
  keep faceSpeak/cutsceneFX/bubble/⏭/Home). See U10 (shipped-elevated finding) for the exact targets:
  `INTRO[0].art=citySVG()` + `INTRO[3].art` boxes-SVG (game.js:475) are the crude clip-art; replace `citySVG()`
  with full-bleed `art/intro-city.png` OR drop the gold frame on the skyline beat (Interlude frame STAYS — it wraps
  raster Mom & Dad). Art swap only; don't touch the cutscene flow.

### World Map
- ✅ **MR1 visual hierarchy — SHIPPED** (`1bbf2b8`; see ledger). Remaining map work below + the MAP REDO.
- 📋 **MR2 — Recalibrate `ZONESPOTS`** (`map.js:17–20`, 1000×750). The golden path is BAKED into the painting; only
  node coords (or a new bg) can move. Nudge each zone coord per act onto the path (overlay via `shot.mjs`); fold in
  U12's hero-clip floor (`y ≥ ~150`); re-check portal `PX/PY` + `mapFriends` offsets. Do Act 1 + Act 2 separately.
- 📐 **MR3 — Global nav model (RESOLVED with parent, 2026-06-14; standing pattern, every screen, both acts).** ONE
  child nav surface, ONE parent surface, no redundancy:
  - **Child nav = a 2-icon dock, BOTTOM-LEFT:** **🏠 Hero Base** (use a *house* icon — Base = his home) + **🗺️ World
    Map**, side by side, each **icon + tap-to-hear** its name, ≥96px. (Consistent with where the map's Base button
    already sits.) Base is itself the gateway to training/shop/recharge/collection.
  - **⏭ skip stays BOTTOM-RIGHT** (during flows) so it never collides with the dock; **🔊 replay** stays in the bubble.
  - **Top-left chip → PURE STATUS** (location label only). **REMOVE the dropdown** — delete `#navMenu` + `.navitem` +
    the `hudTitle` onclick (`index.html:58-62`, `game.js:624-627`); drop the `▾` (`.navchip::after`).
  - **Parent surface = the gear (top-right) → Grown-Up Corner** (existing hold+math gate). It now also hosts the
    **demoted nav**: **Home/title** (a "Back to title" action) + **profile switch** (fold into the existing Players
    section). Nothing parent-facing sits in the child's view.
  - ⚠️ Anchor the dock to the screen (not the 1000×750 map SVG) so it never overlaps painted landmarks; Act-2 skin
    variant; locked-gate + lock enforcement unchanged. This **supersedes** the old `hudTitle` dropdown entirely.
- 📋 **MAP REDO (parent directive — supersedes U2/U6/U12 tweaks).** Act-1 Star Force City map is the worst offender
  (wall-to-wall neon, no negative space, poor figure-ground); **Act-2 medieval map reads better — use it as the
  bar.** Plan: (1) **regenerate the painted bg** calmer (legible winding path + negative space, desaturated
  surroundings so path+nodes pop, distinct landmarks at zone spots, single screen, **1000×750** authoring space,
  keep per-act sci-fi/medieval identity); (2) **rebuild path + recalibrate `ZONESPOTS`** (= MR2; fold U12 floor).
  Code targets (`map.js`): swap `MAPIMG` (`art/bg-map.jpeg` / `bg-map-a2.jpeg`), recalibrate spots; `mapPaintSVG()`
  overlay logic stays. Save-safe (art + coords only). Verify `shot.mjs map a2map`.

### Hero Base
- 🐛 **M-#2 action-rail bug** — see CURRENT PRIORITIES #1 (the one real layout bug).
- 📋 **B1 — Base hero parametric shading.** `baseHero`=`heroNow`=`heroSVG` (game.js:1131) **must stay parametric**
  (it previews equipped weapon/cape/gear — raster is a fixed pose), so it reads "lesser" than raster Teddy on
  title/win. **Mitigation (lean):** give `heroSVG` a shading pass (form shadow/rim light, like the dragon got) so
  every parametric use lifts at once. (Don't raster the loadout.)
- ✅ **U7 Base zero-state — SHIPPED** (`b507eef`; see ledger).

### Cast & Art
- 🟡 **Remaining renders (art lane, none block gameplay).** Per `RASTER` manifest (`art.js:198-200`):
  - **Miss Kendall** — `allyFace("kendall")` placeholder (`art.js:292`); rescued ally visible on the Act-2 league
    shelf; needs real raster (blocked on parent photo refs).
  - **JJ / Cal / Nora** — Act-2 captured friends, placeholder `allyFace` (`art.js:302/307/312`); no raster, no
    full-body (blocked on parent refs). Draw warm/age-appropriate for a 7yo.
  - **Full-body ally CARDS** — `allyBody()` (`art.js:362`) parametric SVG for the flip cards; not raster for anyone.
  - **`captiveSVG` / `portalSVG`** — interlude "?" silhouettes + time portal, still placeholder SVG.
  - Confirm `teddy-knight-*` PNGs are final art (on-screen knight reads simpler than raster Teddy).
- 🟡 **U8 — Finale boss no escalation.** Lord Vex (`bossSprite()`/`inkblotSVG`) renders identically to a rank-and-
  file Vexbot (same gray robot, same size) — the Act-1 climax has no visual peak. A raster `vex.png` exists. Fix:
  distinct, larger finale-boss sprite (raster Vex, or scale+recolour+menace). Art lane, cross-refs B1/resolver.
- 🟡 **U13 — League-shelf names truncate** ("MISS KENDALL"→"SS KENDA"). League button `<text>` in a 64-wide viewBox
  with no fit (`game.js:1257`). Fix: `textLength="60" lengthAdjust="spacingAndGlyphs"` on both `<text>` (name
  distortion acceptable here, unlike learning letters). Minor.
- 📋 **Resolver rollout status.** `charArt`/`RASTER` is wired; cast is ~all raster (Teddy/Vixen/Vex/Dragon/Noah/5
  allies). Remaining = the placeholders above. ⚠️ **Perf finding (not a bug):** ~15 PNGs ≈ ~5 MB of character art;
  on old iPads/cellular consider **pngquant/oxipng/WebP** (≈60-70% smaller) and whether all 6 Teddy tiers are needed
  (SW caches after first load, but first-load + updates pull it all). Author every new PNG on the **uniform canvas**
  (square, transparent, feet on a consistent baseline) so `rasterArt` wraps it mechanically.

### Engagement & Juice
- 📐 **See `DESIGN-ENGAGEMENT.md`** for all next-wave delight specs — treasure chests (§4.1/§10), Hero Room (§4.2/§11),
  weapons ecosystem (§4.3), customization (§4.4), store expansion (§4.5), pets (§4.6), the coin-fly juice pass /
  `flyReward` reward-visualization menu (§5/§8), the IP read (§2), build order (§7), and the settings game-feel pass
  (§9.1). **Everything there is bound by the §6.0 Mastery-not-participation contract** (the reward red-team
  formalized). Do not duplicate those specs here; this doc points to them.
- 🔊💡 **Research: should we "juice" the SOUND EFFECTS?** (parent, 2026-06-14). The visual-juice canon (STYLE.md §6 /
  DESIGN-ENGAGEMENT §8) has **no audio counterpart yet** — yet sound is half of "game feel." `Sfx` (sfx.js) is a
  synthesized Web-Audio kit (correct/wrong/combo/coin/unlock/win/gem/mastery) — functional but thin. **Eval enriching
  it:** layered/"fatter" correct + reward stings, **pitch-laddering** on streaks (combo/coins rise in pitch), per-event
  **variation** to beat repetition fatigue, and **mastery-weighted** audio (the most satisfying sting on MASTERED! /
  rank-up, quieter on plain coins — mirrors §6.0). ⚠️ Constraints: **never mask narration** (audio-first #8 — keep SFX
  short; Music already ducks; SFX has its own `S.sfxVol`), **gentle wrong** (soft low "nope," never harsh — #2),
  respect reduced-audio. Keep it **synthesized** (no files/licensing, offline — sfx.js's whole point), but weigh whether
  a few tasteful samples earn their weight. → produce an eval + recommendation, then fold into the juice spec as an
  "audio-feel pass."

### Pedagogy & Curriculum
*(Research basis in DURABLE ANALYSES below. Memory Vault scheduler #1 shipped; #2/#3/#4 reuse its box/due model.)*

- ✅ **Memory Vault (#1 scheduler + surfacing) — SHIPPED** (`27a608c` + `fd4097d`; see ledger). The "Recharge the
  Gems" Base activity now re-exposes due items on the spaced schedule. *(#2/#6 reuse its box/due model.)*
- 📐 **Rec #2 — "Spell Scroll" repeated reading + listening preview** (fluency; Lee & Yoon 2016). ⚠️ **No speech
  recognition** — structure repeated *oral* reading, don't measure it; tap-pace is a soft engagement proxy, NOT a
  fluency score. Mechanic: mentor reads a short DECODABLE passage with words highlighting (listening preview, reuse
  `sentenceAudio`/`wordAudio` game.js:785-787) → child reads aloud + taps each word in order → silent personal-best
  "power" (no countdown/penalty, #1) → re-present on the **Vault** spaced schedule. **Lives in the Training Room**
  (coins via `trainWin` game.js:1306; `record()`s scroll words). Data: `SCROLLS` (data-content.js, per act, only
  taught words — curriculum.test guards decodability) + `S.scrolls[id]={reps,bestMs,box,due}` (additive/save-safe).
  ≥96px Andika tiles; `flow()` so it can't hang (#8).
- 📐 **Rec #3 — "Sound Warm-Up" oral-PA drill (part A; part B cue SHIPPED).** ✅ The Learn-screen **articulatory cue**
  (B) shipped (`4353acf` — `mouthCue`/`MOUTHCUE`, magic-e excluded). **Still open = (A)** a short ≤5-item oral-PA drill
  (child says it aloud; **no speech rec** → tap responses): blend (`graphemeSounds(w)` game.js:54 → tap the `READWORDS`
  picture, *no letters shown*, then reveal grapheme) / segment (count phonemes) / isolate (first sound). Lives in the
  Training Room (or as a warm-up before a mission). ⚠️ Anti-gaming #4 (sound-only, no target letter); magic-e units
  have no `snd_` (exclude; use `snd_<v>_long`). Reuse the now-shared mouth-cue table.
- ✅ **Rec #4 mastery-threshold ("proficient" vs "retained") — SHIPPED** (`382f0da`; see ledger).
- 📐 **Rec #6 — "Word Crafting" morphology capstone** (MA improves reading/spelling for dyslexia; Ardanouy 2024).
  ⚠️ **Capstone, not now-item** — gate AFTER Great Library fluency (constraint #5; a 7yo is the early edge). Reuse
  **forge** (`startForge` game.js:985) at morpheme granularity (base tile + affix tile → forge → read; teach the
  MEANING). **Slice 1 = affixes with NO spelling change** (compounds sun+shine, cat+s, jump+ing, un+lock) —
  drop-e/doubling/y→i are 3rd-grade+; start with **invariant** affixes before variant `-ed`/`-s`. Plus a literal
  comprehension Q after a Spell Scroll/sentence (ties #2+#6). Data: `MORPHEMES` + `WORDCRAFT{base,affix,result,
  meaning}` + `QUESTIONS{passageId,q,answer,foils}` (data-content.js). `curriculum.test` guards decodability +
  no-spelling-change in slice 1.
- 📋 **Act-2 finale comprehension-proof gap (top reading-core item).** Dragon Keep's final phase is still
  `{kind:"read"}` ("READ TO FREE MISS KENDALL!", game.js:944-948), so the climax can end on word-picture decoding,
  not sentence/comprehension — Act-1's fortress proves sentence reading but Act-2 doesn't (the 2nd-grade goal).
  ⚠️ The dormant `fortSentence` path hardcodes Act-1 `FORTMAZE`/`SENTENCES` (game.js:1020-1034), so flipping the
  phase is unsafe until act-aware. **Fix:** make the proof functions act-aware, then set the final phase to
  `kind:"sentence"` using **`SENTENCES2`** + **`CLOZE2`**/a new `FORTMAZE2`, same no-timer audio-first `flow()`.
  `curriculum.test` guard: Act-2 finale sentence rounds draw only Act-2-decodable content, never fall back to Act-1.
- 📐 **Gear + friend-rescue pacing spread (P2/P3 — parent greenlit, grandfathered).** P1 plumbing shipped. ⚠️
  **Plumbing-first / grandfather mandatory** — the durable seed (`grandfather()` boot, game.js:155, NOT `save()`d)
  must be persisted for active saves (happens via normal play; worth a guard) BEFORE the re-map, or it un-earns
  current gear/league. **A. Gear:** only belt(1)/boots(3)/hammer(4)/sword(8) are front-loaded; keep Hammer early,
  push Sword→26/Belt→33/Boots→47. `actGearList(a)` must return the **union** of (`GEAR_AT`∩done) **and** (`S.gear`
  for this act) — act-scope it (gear names repeat across acts). **B. Friends:** spread one per early/mid zone
  (tank→z1, flip→z2, sunny→z3, heart→z4ish, leighton stays finale); update `CAGED` mids + `allyMid`(allies.js:21) +
  `mapFriends`(map.js:27) + rescue labels; `allyFreed = S.freed[kind] || !!S.done[allyMid(kind)]`. ⚠️ Mainly
  benefits a FRESH playthrough — confirm a fresh player is coming before P2/P3. Tests: grandfather-union keeps
  earned gear/friends after re-map; `migrate` seeds `S.freed` from existing `S.done`.

### 🎙️ VOICE — add LINE VARIATIONS for the most-repeated dialogue (parent, 2026-06-14)
Characters say the **same line every time** for high-frequency prompts/praise → gets old fast. Add variations so the
most-said lines rotate; then the parent does **one bulk audio ReGen**. *(Same anti-fatigue principle as SFX variation,
STYLE.md §6.5.)*
- **Identify the highest-frequency line ids** (said many times/session): the per-round prompts (`find_prompt`, forge/
  read/scan/trace prompts), the per-correct praise, win/cheer lines, ally cheers — audit the `narrate()`/`Aud.play`
  call sites for the most-repeated ids.
- **Author 2–3 VARIATIONS each** in the LINES manifest (`data-lines.js`) — new ids (e.g. `find_prompt` + `find_prompt2`
  + `find_prompt3`) with TTS-fallback text + the **same role `v`**. New ids **auto-appear in the Voice Studio** (per
  CLAUDE.md) so the parent can record/generate them.
- **Add a "fresh variant" picker** (small helper): map a logical line → its variant pool, pick one **≠ the last
  played** (no immediate repeat; round-robin or random-no-repeat). Route the high-frequency `narrate()` calls through it.
- ⚠️ Variations keep the **same meaning + role**; **anti-gaming #4** — sound-ID prompts stay target-independent (never
  name/reveal the letter); flows stay hang-safe (`flow()`/watchdog; a missing variant clip falls back to TTS).
- **Batch ALL the new variation ids in one pass** so the parent ReGens the whole set **once**.

### Other notes / risks (low priority, carried forward)
- 📋 **CLAUDE.md title-flow notes are stale** (H3/H4 shipped; CLAUDE.md:252-255 still lists them as open). Parent-
  owned file — **flag, don't edit.**
- 📋 **Training Room cumulative/grapheme-aware** — `trainPool()` is still Act-1-only (`READWORDS` + `w.split("")`,
  game.js:1254); never drills Act-2 digraphs/blends/magic-e/vowel-teams. Make it grapheme-aware (`toGraphemes()` +
  `graphemeSounds()` + magic-e handling from `nextRead()`) before relying on it for retention. (No longer the Vault
  blocker now Recharge shipped.)
- 📋 **`hero-lab.html` blind spot** — renders `heroSVG()` only, not the raster `teddyArt`/`charArt` tiers; a missing/
  corrupt marquee PNG could pass human review. Add `teddyArt(150,0/1/2,"hero"/"knight")` rows + an asset-exists
  smoke check (a `true` RASTER flag with a missing PNG renders an INVISIBLE character).
- 📋 **`mom.png` crop** — `mentorChips()` renders `art/mom.png` at 224×224 tight at the bottom (shoes slightly
  cropped vs Dad). Pad/regenerate to the ally canvas spec or document as accepted.
- 📋 **Grok minor notes** — `trainTick` iOS-backgrounding undercount (acceptable for a gentle meter); classic
  script load-order is fragile (a load-order smoke test would harden it); `voicepack.js` is large (lazy-load /
  core+optional packs); CI should `node --check` nested JS too (`cloud/worker.js`, `tests/*`).

---

### 🆕 Cypher pass — vetted (Trinity, 2026-06-14)
Guest QA (Cypher) sent 2 fresh ideas + a STYLE.md gap list. Vetted vs the code (status-discipline rules) — **not
accepted wholesale.**

**Fresh ideas — both worth doing, constraint-clean:**
- 💡 **Hidden Gem Whispers (ambient micro-delight).** 1–2×/session an unpredictable subtle sparkle on the map/Base →
  tap = ONE optional `startFind`/`startRead` round; reward = pure delight (burst + an ally one-liner), **no coins**.
  ✅ Optional, no pressure, a low-stakes reading rep, and its **intrinsic (non-coin)** reward aligns with the §6.0
  mastery-not-participation contract. Soft-gate behind a min-missions/day so it never overwhelms. Cheap (reuses
  find/read + painted-scene + ally-pop). → candidate for the engagement wave.
- 💡 **Ally Storytime — "Read With Me" (fluency, Great Library).** After solid sentence accuracy, a rescued ally
  (Amelia/William): **models** a decodable sentence with prosody → warm encouragement → **shared** read (Teddy taps
  words as the ally voice supports/fades) → optional solo re-read with cheering. ✅ Pedagogically strong (explicit
  prosody modeling + supported reading + relational payoff); reuses `SENTENCES2` + ally voice roles + audio engine,
  **no new task type/scoring**. ⚠️ Respect the "**app can't HEAR the child**" constraint (as in the Spell Scroll
  spec): **tap-paced** shared reading, never a measured choral score. Pairs naturally with rec #2. → recommend to parent.

**STYLE.md gap list — verified verdicts:**
- ❌ **P0.3 "Act-2 medieval skin completely parked" — WRONG (stale).** SHIPPED: **35** `body[data-act="2"]` rules
  (stone/bronze buttons, nav, bubble, scene grade, motes, frame corners) + **MedievalSharp** loaded (index.html:16) &
  applied (styles.css:974); CLAUDE.md confirms. Cypher read STYLE.md §0.5's "PARKED" — **STYLE.md §0.5 corrected** to
  SHIPPED. No code action.
- ⚠️ **P0.2 modal treatment — mischaracterized.** `#settingsPanel`/`#shopPanel` are **full painted overlays**
  (bg-base.jpeg + dark gradient, styles.css:276/414), not "simple scrims"; backdrop-blur is used widely. The §4
  gem-purple blurred modal-panel isn't applied to them, but the painted-overlay look is intentional (U3 hub). Optional
  taste call, not P0.
- ↪ **P0.1 secondary-button polish = existing H2.** Fold in — Cypher's specifics (`.echip` / Base tiles / shop items
  lack the sheen/glow/7px-border recipe) are a good concrete checklist for the H2 button pass.
- ↪ **P1.3 layout / action-rail = M-#2** (top-priority Base bug) + U3/U7 (shipped).
- ✅ **P1.2 `.txt-outline` utility — VALID (confirmed absent in styles.css).** STYLE.md §2/§8 recommend it for text on
  painted art. Low priority (most text sits on panels).
- ✅ **P2.1 idle `float` on primary CTAs — VALID** (STYLE.md §8 checklist, unchecked; reduced-motion-aware). Low.
- ✅ **P2.2 bundle the next polish as ONE "Visual Refresh" commit** — agree (STYLE.md §8). Process note for Neo.
- ↪ **P1.1 `flyReward` not built** — correct, already the #1 engagement item (DESIGN-ENGAGEMENT §5/§8). Not new.

— Trinity, 2026-06-14

## 🧠 DURABLE ANALYSES (keep)

### Reward "juice vs reading" red-team — verdict + the 5 dials
**Verdict:** mostly well-designed; the juice is intentional and ADHD-appropriate (ADHD is unusually sensitive to
reward *delay* and biased toward immediate reward — Tripp & Alsop 2001, PMID 11464973). Don't remove it. Already
right: ambient motes OFF on learning screens (`AMBIENT_SCREENS` only); music ducks under narration; combo is an
ACCURACY streak not speed; rewards fire AFTER the correct response; cosmetic/coin loop decoupled + no harsh failure
(ADHD shows blunted reward sensitivity but enhanced learning from negative feedback — Aster et al. 2024,
DOI:10.1016/j.nicl.2024.103588). Risks: **seductive details** add extraneous load (softer under narration — in our
favour; meta-analysis DOI:10.1007/s10648-025-10099-z) and **overjustification/insatiability** — a child could
fixate on coins (Pulver et al. 2020, DOI:10.1017/neu.2020.18). **The 5 dials (tune, don't remove):**
1. Clean beat between a reward and the NEXT prompt (`flow()`-sequence reward→settle→next; never overlap narration).
2. Make READING rewards bigger than cosmetic ones + go INTERMITTENT (weight to mastery/accuracy; vary magnitude).
3. Verify the learning tile is the most salient thing in the response window (check Full-tier character idle/aura).
4. Confirm the combo reset never reads as a loss (silent today — keep positive-only; zero time pressure).
5. Keep reinforcement IMMEDIATE + CLEAR (instant unambiguous "you got it").
*Measuring with one child: is Teddy attending to the letter/sound or the burst? Reading to read, or to earn? Dial
coins down + make reading wins louder if cosmetics dominate his talk.*
→ **Now formalized as the Mastery-not-participation contract in DESIGN-ENGAGEMENT.md §6.0.**

### Skill-ladder research brief — bottom line
**Our core is right and well-evidenced** — systematic synthetic phonics (the only RCT-confirmed approach for reading
disability: Galuschka et al. 2014, DOI:10.1371/journal.pone.0089900; Cochrane McArthur et al. 2018,
DOI:10.1002/14651858.CD009115.pub3), decodable-only sequencing, and sound-mapped "Heart Word" sight words (=
orthographic mapping, Ehri) are exactly what the strongest studies endorse for a possibly-dyslexic child. The
biggest *upside* is in **review pacing** (true expanding-interval spacing — Kim 2020, DOI:10.1016/j.neuropsychologia
.2020.107550 → rec #1 Memory Vault), **fluency** (repeated reading + listening preview — Lee & Yoon 2016,
DOI:10.1177/0022219415605194 → rec #2), and explicit **phonemic awareness + articulatory cues** (rec #3). Don't
over-invest in "multisensory" for its own sake — OG didn't reach significance (Stevens 2021,
DOI:10.1177/0014402921993406); keep see/hear/trace/find but invest in #1–#3, not more ornament. Morphology +
comprehension (rec #6) are the 2nd-grade-rung capstone, after decoding+fluency. Keep the loop **short and frequent**
(fits ADHD attention + the spacing effect) — let spacing do the heavy lifting, not volume.

---

## ❓ OPEN QUESTIONS

1. Should the large `voicepack.js` remain a single generated file, or output a core pack + lazy optional packs?
2. Should the GitHub publish token be stored only per session, or is localStorage acceptable if the UI clearly
   labels it as a parent-only publishing tool?
3. Is Act 2 intended to be the final complete game loop for now, or should the code start preparing for Act-3 hooks?
   (What is the post-Act-2 end state — completed-kingdom loop, Act-3 teaser, free-play reading patrol, or parent
   maintenance mode?)
4. Do we want the cloud family-sync code enabled/enforced in production now, or documented as optional hardening?
5. Should `QA.md` keep accumulating long-form notes, or stay a curated current-priorities doc (this consolidation)
   while history lives in git?

---

— Trinity, 2026-06-14

*Detailed historical review notes were consolidated on 2026-06-14; superseded/shipped specs removed, open work
condensed by topic.*
