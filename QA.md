# QA.md — Review Notes & Handoff for Super Teddy

> **Advisory** review/handoff notes (QA agents write here; only **Neo** edits code + merges to `main`).
> **CLAUDE.md is the source of truth** on conflict; **AGENTS.md** holds crew & workflow. Sign entries `— name, date`.

---

## ⭐ CURRENT PRIORITIES FOR NEO

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
5. **🔧 Remaining U-series chrome fixes** — U3, U4, U5, U7, U8, U9, U10, U11, U13 (U1/U2 shipped — see ledger;
   U12 hero-clip folds into MR2 / MAP REDO).
6. **🧠 Pedagogy** — build the **Memory Vault SURFACING** (the #1 scheduler shipped; now surface due items), then
   recs **#2 Spell Scroll**, **#3 Sound Warm-Up**, **#4 mastery-threshold tune**; plus the **Act-2 finale
   comprehension-proof gap** (the top reading-core item). See **Pedagogy & Curriculum** below.

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
- ✅ **Settings / Grown-Up hub refactor groundwork** — settings overhaul shipped; P1 full hub spec still open below.
- ✅ **Equippable weapons** — WEAPONS catalog, act-gated, rendered held in `heroSVG`.
- ✅ **Villain shading** — dragon/Vex form-shadow + rim-light pass.
- ✅ **Generated-art render/verify loop** — `tools/svg-shot.mjs` + cloud npm-Chromium recipe verified (durable
  `tools/shot-cloud.mjs` is Neo's lane to land).
- ✅ **Morpheus M-#1 "rest cadence never resets"** — DISMISSED (false alarm; `sessionTick()` is called at `map.js:115`).
- ✅ **Daily.missions firstTime guard, profile escaping, level-override safety** — prior items confirmed addressed.

---

## 🔧 OPEN WORK — BY TOPIC

### UI Chrome & Buttons
- 📋 **H1 — Title logo font.** Bangers `.title-logo` (styles.css:243/478) is generic vs the premium art. Options:
  keep / elevate treatment (gradient+bevel+gem accents) / bespoke SVG-PNG wordmark (act-agnostic, no font load).
  ⚠️ Restyle **`.title-logo` only**, NOT `.comic` (used app-wide); lock the logo font regardless of `data-act`
  (the `body[data-act="2"] .comic`→MedievalSharp swap at styles.css:910 would silently change it). Low urgency.
- 📋 **H2 — Buttons too plain (cross-cutting, every screen).** `.btn`/`.ghost` flat pills (styles.css:25-37) vs
  painted scene. **CSS-premium first** (bevel/texture/gem-rivet accents); if using gen art, **9-slice `border-image`**
  or tileable texture behind CSS text — **never** a text-baked PNG (labels vary: START vs CONTINUE MISSION). `.btn`
  restyle propagates everywhere; keep ≥96px + `:active` press; Lite/Calm flatten heavy filters; plan an Act-2
  stone/bronze variant; CSS tokens not raw hex.
- 🟠 **U3 — Grown-Up Corner layout** — panel fills only the top third (bottom ~half dead), body/tab text 12–15px
  (`styles.css:257/265/271`), inconsistent button hierarchy. Real-screen evidence for the **P1 parent-hub** spec
  (see Hero Base / parent refactor — fold this in: centre/space content, ≥16px parent text, normalise buttons).
- 🟡 **U4 — Vast-empty intro/scan/forge scenes** — a single ~52px audio control floating on a decorative stage =
  weak affordance ("what do I do?"). Give intro/calibration a large pulsing primary CTA (e.g. "TAP TO START" gem)
  alongside the audio. Ties to I1/I2.
- 🟡 **U5 — Emoji picture-tiles** amid premium painted/raster art (read/sentence/cloze/scramble + Shop items
  🚩🏆🤖🐉👑🚀). Style clash (worst in the Shop). Later art lane: a small consistent flat-vector icon set for the
  READWORDS/READWORDS2 pool + shop. (Overlaps DESIGN-ENGAGEMENT store de-emoji.)
- 🟠 **U11 — `.bubble` long lines clip behind the 🔊 ear** (Recharge / Interlude). `.bubble` (styles.css:39) lacks
  enough right padding to clear the enlarged ear button, so long lines run under it. Fix: `padding-right` ~92px (and
  the Act-2 `body[data-act="2"] .bubble` at :951). CSS-only. *(Verified still open 2026-06-14 — no padding fix in
  styles.css.)*
- 🟡 **U9 — Trace round** — varying dot sizes + no ghost letterform / stroke order (multisensory O-G gap; dyslexia
  profile can't infer stroke direction). Fix: uniform dots, faint ghost letter behind, drawn/numbered path.
  Act-1 only (digraphs skip trace). Ties to I2.
- 📋 **I2 — Scan-calibration tiles** plain text vs premium gem chrome — upgrade tile chrome only (keep glyph in
  Andika, sound→letter; don't make it text→text). Gated by `S.scan`; don't break intro→scan→map.
- 📋 **I1 — Intro `.panelart` boxy frame** → full-bleed / generated (shared with the interlude; pilot one beat;
  keep faceSpeak/cutsceneFX/bubble/⏭/Home). See U10 (shipped-elevated finding) for the exact targets:
  `INTRO[0].art=citySVG()` + `INTRO[3].art` boxes-SVG (game.js:475) are the crude clip-art; replace `citySVG()`
  with full-bleed `art/intro-city.png` OR drop the gold frame on the skyline beat (Interlude frame STAYS — it wraps
  raster Mom & Dad). Art swap only; don't touch the cutscene flow.

### World Map
- 📋 **MR1 — No visual hierarchy / current-node dominance.** ~70+ bright elements + friends + hero over a loud
  painting; nothing says "go HERE next." Make the CURRENT node dominate (bigger bloom/pulse/beacon), DONE quiet
  (small ✓, desaturated), LOCKED muted; drop per-node specular on non-current; scrim/vignette the bg. ⚠️ Goal is
  hierarchy+legibility, NOT de-juicing (constraint #3); keep done/current/locked instantly readable (nav + lock
  gate); Lite flattens map blooms. (`map.js:39–100`.)
- 📋 **MR2 — Recalibrate `ZONESPOTS`** (`map.js:17–20`, 1000×750). The golden path is BAKED into the painting; only
  node coords (or a new bg) can move. Nudge each zone coord per act onto the path (overlay via `shot.mjs`); fold in
  U12's hero-clip floor (`y ≥ ~150`); re-check portal `PX/PY` + `mapFriends` offsets. Do Act 1 + Act 2 separately.
- 📋 **MR3 — Control cluster / "legend"** replacing the buried HUD city-chip dropdown — always-visible corner panel
  (Home / Hero Den / parent-gated gear + optional ▶/✓/🔒 key). ⚠️ Pick ONE nav surface (cluster OR dropdown, not
  both); Settings stays parent-gated (3s hold); anchor to the screen (not the 1000×750 SVG), corner clear of
  painted landmarks; ≥96px.
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
- 🟠 **U7 — Base zero-state + contrast.** Fresh save shows every shelf as "0 / N" + "go earn this!" (borderline vs
  "show only EARNED items" rule); card body text dim purple; hero/collection cards collide. Fix: raise card-text
  contrast, add breathing room, soften zero-state (show the first goal only, not all four 0/N rows). Populated Base
  looks great — confirms U7 is a *zero-state* problem. Cross-refs B1.

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

### Pedagogy & Curriculum
*(Research basis in DURABLE ANALYSES below. Memory Vault scheduler #1 shipped; #2/#3/#4 reuse its box/due model.)*

- 📐 **Memory Vault SURFACING (next pedagogy item).** Scheduler shipped (box/due on `S.mastery` — optional
  `box`/`due`/`last`, `VAULT_INTERVALS=[1,3,7,14,30]`, `VAULT_CAP=6`, demote-one-step on miss, leave-Vault below
  mastery). **Now surface due items** as a gentle capped "Memory Vault — recharge gems" mini-activity from Hero
  Base, routing each due item by TYPE (no new task type): **grapheme → `startFind`** sound-ID (target-independent
  prompt = anti-gaming #4 ✓) but **EXCLUDE no-`snd_`-clip graphemes** (magic-e `a_e/i_e/o_e/u_e` — guard
  `hasSoundClip`, route to a WORD review); **word (`w_`/`sw_`) → `startRead`/forge**. No timer/fail; gentle
  replay+retry. Edge cases: empty→hide, nothing-due→"fully charged ✨", backlog>CAP→oldest-due-first. Optional
  Progress: "🔋 Vault: N items, M due today". (The dedicated Recharge activity already exists — wire deterministic
  surfacing through it.)
- 📐 **Rec #2 — "Spell Scroll" repeated reading + listening preview** (fluency; Lee & Yoon 2016). ⚠️ **No speech
  recognition** — structure repeated *oral* reading, don't measure it; tap-pace is a soft engagement proxy, NOT a
  fluency score. Mechanic: mentor reads a short DECODABLE passage with words highlighting (listening preview, reuse
  `sentenceAudio`/`wordAudio` game.js:785-787) → child reads aloud + taps each word in order → silent personal-best
  "power" (no countdown/penalty, #1) → re-present on the **Vault** spaced schedule. **Lives in the Training Room**
  (coins via `trainWin` game.js:1306; `record()`s scroll words). Data: `SCROLLS` (data-content.js, per act, only
  taught words — curriculum.test guards decodability) + `S.scrolls[id]={reps,bestMs,box,due}` (additive/save-safe).
  ≥96px Andika tiles; `flow()` so it can't hang (#8).
- 📐 **Rec #3 — "Sound Warm-Up" oral PA + articulatory cue** (PA enables orthographic mapping; Ehri). ⚠️ **No speech
  rec** → tap responses (child still says it aloud; parent nudge). **(A)** short ≤5-item oral-PA drill: blend
  (`graphemeSounds(w)` game.js:54 → tap the `READWORDS` picture, *no letters shown*, then reveal grapheme = the
  oral→letter bridge) / segment (count phonemes) / isolate (first sound). **(B)** child articulatory cue on the
  Learn screen (`startLearn` game.js:582, `#letterCue` slot at 588) — a kid-friendly mouth shape + keyword + one
  line. **Reuse `PH_COACH`** (audio-studio.js:30+, per-phoneme keyword/icon/mouth cue) — extract a shared
  `PHONEMES` table into data-content.js (add kid cue + mouth-shape id; keep adult tip studio-only; don't break the
  Studio). ⚠️ Anti-gaming #4 (sound-only prompts, no target letter); magic-e units have no `snd_` (exclude; use
  `snd_<v>_long`). Lives in the Training Room. P1 = the Learn-screen mouth cue (smallest, high-yield).
- 📐 **Rec #4 — mastery-threshold tune: "proficient" vs "retained".** ⚠️ **The trap:** a spaced-correct requirement
  **cannot gate the finale** (no next-day correct mid-session → soft-lock). So **split the meanings:**
  `masteredItem` = PROFICIENT (in-session, keeps gating `coreWeak` + Progress ★); add `retainedItem(key)` =
  `masteredItem && okDayCount>=2` (Base gold ✦ + Vault "graduated" — **never gates a finale**). Changes: bump
  `MASTER_ACC 0.75→0.8`, `MASTER_SEEN 4→5` (game.js:151; keep STR 4; don't go 0.9/8 — grindy); track correct-days in
  `record()` (`if(dayKey()!==m.lastOkDay){m.okDayCount++; m.lastOkDay=dayKey()}`). ⚠️ **Grandfather in `migrate()`:**
  any already-`masteredItem` true → seed `okDayCount=max(okDayCount,2)` (no ✦ regression). Shares `dayKey` tracking
  with the Vault. Verify finales still clear in one session.
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
