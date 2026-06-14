# QA.md — External Review Notes for Super Teddy

> **Maintained by Trinity (QA / Docs).** Crew & workflow live in `AGENTS.md`. Only **Neo** (Lead
> Coder) edits code & merges to `main`; QA agents write here only. **Sign every entry** `— name, date`.

---

## ⭐ CURRENT LIVE STATE & HANDOFF — 2026-06-14 (read this first)

This is the active working context so any instance (cloud OR the parent's local desktop) can
pick up. Historical review notes are preserved below. CLAUDE.md remains the source of truth;
this is the "what we're doing right now" index.

### The big shift: we can now SEE the art (render/verify loop)
- **NEW `tools/` dev harness** (gitignored at runtime, never ships):
  - `tools/svg-shot.mjs` — rasterize any `art.js` SVG expression (or `--cast` contact sheet) to
    PNG via `@resvg/resvg-js`. **Works in the cloud** (npm registry reachable). VERIFIED.
    Use it to self-check EVERY art change instead of working blind: e.g.
    `node tools/svg-shot.mjs "dragonSVG(200)" d.png` then Read the PNG.
  - `tools/shot.mjs` — screenshots the **real game** in Chromium **and WebKit (Safari ≈ iPad)**,
    serving over http + driving the game's own nav fns. Desktop = Playwright. **CLOUD: also works now** —
    `tools/shot.mjs` can't (Playwright's browser download is firewalled), BUT a cloud Trinity CAN screenshot
    the real game via an **npm-packaged Chromium**: `npm i @sparticuz/chromium puppeteer-core` (registry is
    reachable; this bypasses the blocked browser-download host), serve the repo + `puppeteer.launch({args:
    chromium.args, executablePath: await chromium.executablePath(), headless:"shell"})`, block the
    `fonts.googleapis/gstatic` CDN (else it hangs → system-fallback fonts), `goto domcontentloaded`, then
    `page.evaluate("toMap()")` etc. **Verified 2026-06-14.** *(A durable `tools/shot-cloud.mjs` would be a nice
    add — Neo's lane.)*
  - `tools/gen.mjs` — generate character art from a prompt via `XAI_API_KEY` or `OPENAI_API_KEY`
    → `art/incoming/`. Local only; keys never committed.
  - `tools/README.md` = setup. `art/CHARACTER-ART-PROMPTS.md` = house style + per-character
    generation prompts (the "generated heroes" pipeline).
- **Workflow for art:** edit `art.js` → render with `svg-shot.mjs` → Read the PNG → iterate →
  commit. Full composed screens: desktop `shot.mjs`, OR cloud Trinity via the npm-Chromium recipe above.

### Crew & workflow (see `AGENTS.md`)
**Neo** (Lead Coder, desktop) — the only one who edits code + merges to `main`; final say. **Trinity** (cloud,
me) — QA/reviews + docs; writes `QA.md` + `AGENTS.md` straight to `main`; vets + squash-merges guest QA PRs.
**Morpheus** (Codex) / **Cypher** (Grok) / **Tank** (Gemini) — guest QA, open `QA.md`-only PRs. `QA.md` is
**advisory** — Neo scrutinises each item before actioning; the **parent is the final authority.** Trinity checks
open PRs first on every re-engagement.

### The two backlogs live at the TOP of this file
- **🧭 UI BACKLOG INDEX** — home/intro/map/base findings + specs (H/I/M/B), the character-art resolver, the Map
  Rework Packet; status icons + ship-now quick wins.
- **🧠 PEDAGOGY BACKLOG INDEX** — the 6 research-brief recs (#1–4 + #6 SPEC ready, #5 advisory) + the reward
  red-team. *Build the Memory Vault scheduler first — #2/#3/#4 reuse it.*

### Status — what's DONE (don't re-chase) vs OPEN
**Shipped on `main`:** all 5 original code-review findings resolved — **cloud auth #1** (parent-entered Family
sync code + fail-closed Worker, verified), #2 reset, #3 magic-e, #4 cloud-off; **H3** generic subtitle + **H4**
one-PLAY title; the **`charArt`/`RASTER` resolver** + raster **Teddy / Vixen / Archie / Sunny**; the **map raster
hero** (M1, partial); muscle pacing spread; the settings overhaul; equippable weapons; villain shading.
**✅ Shipped + Trinity-verified (post-scramble, 2026-06-14):** **MAP-1** (hero + ally figures `pointer-events:none`),
**CLOUD-1** (401 flagged distinctly; wrong code reported + cleared, not cached), **MAP-2** (locked zones stay
tappable so the gentle `locked_tip` cue plays; lock still JS-enforced), **pacing P1** (grandfather plumbing —
durable `S.freed` + `S.gearByAct`, migrate-safe, plumbing-only so no regression yet), **Memory Vault #1** (Leitner
box/due scheduler on `S.mastery`, additive). Tests **save 73 · curriculum 47**, all parse, tree clean, no scramble
dupes.
**Open for Neo (code):** the UI punch-list (buttons **H2**, map revamp **MR1–3**, intro **I1**, parent-hub **P1**…),
the **🆕 U-series real-screen audit** (U1 touch targets = hard-constraint quick win), and the pedagogy specs (Vault
surfacing + #2/#3/#4 onward). **Morpheus PR #3 merged (2026-06-14):** Trinity-confirmed Act-2 **fortress `fortRead()`
mis-teaches magic-e audio** (plays short `snd_a` + voiced silent-E for "cake" — `game.js:987` — vs `nextRead()`'s
magic-e branch `game.js:784-787`); same gap in **Recharge `vaultBuild`** tiles; both want the shared magic-e-aware
tile renderer. Also: Act-2 finale comprehension-proof still the top reading-core gap; CLAUDE.md title-flow notes are
stale (H3/H4 shipped — parent-owned file, flag don't edit).
**Approved (grandfathered), plumbing DONE → next is the re-map:** gear / friend-rescue **pacing spread** — P1
grandfather plumbing shipped; **P2/P3 = re-map GEAR_AT keys + ally rescue ids.** ⚠️ Before the re-map ships, the
durable seed (`grandfather()` boot, game.js:155, not `save()`d) must be persisted for active saves first (happens
via normal play; worth a guard) so the re-map can't un-earn current gear/league. (Muscle done.)

### Guardrails
- `node tests/curriculum.test.js` + `node tests/save.test.js` must pass before any push (exit 0). Latest:
  **save 73 · curriculum 53**, every JS/MJS parses.
- Never push broken code (auto-deploys to the child's iPad within minutes). Small, plain-English commits.
  **Neo merges code to `main`; Trinity commits docs (`QA.md`/`AGENTS.md`) straight to `main` (fetch+rebase,
  no merge commits); guests open `QA.md` PRs.** Branch protection stays OFF (per AGENTS.md) until 2+ agents code.
- API keys / tokens NEVER committed (`.env`, `art/incoming/`, `tools/node_modules` gitignored).

---

## 🧭 UI BACKLOG INDEX — at a glance (Trinity, 2026-06-14)

Every UI finding/spec logged so far, by screen. Full detail in the dated sections below. **Status:** 📋 finding ·
📐 spec ready · 🗂️ sequenced packet. **Ph1** = Phase-1 quick win (low-risk, ship now).

**Home / Title**
- **H1** 📋 Title logo font — taste call; style `.title-logo` only (act-swap + webfont traps).
- **H2** 📋 Buttons too plain — CSS-premium / 9-slice; *never text-baked images*. **Cross-cutting** (every screen).
- **H3** ✅ **SHIPPED+verified** — generic subtitle "A HERO READS. A HERO RISES." (index.html:75; not re-Act-1-ized).
- **H4** ✅ **SHIPPED+verified** — one **PLAY** (game.js:343): `Aud.pick()` + `if(!S.intro)startIntro else welcome+toMap`;
  clean removal of START/CONTINUE/title-Base, first-run intro + iOS audio-unlock preserved.

**Intro / Calibration**
- **I1** 📋 Intro boxy `.panelart` frame → full-bleed / generated (shared w/ interlude; pilot one beat).
- **I2** 📋 Scan-calibration plain text tiles → premium gem chrome (keep Andika + sound→letter).

**World Map** → see the **🗺️ MAP REWORK PACKET** (sequenced)
- **M1** 🚧 **partially shipped** — painted Teddy on the map is LIVE; **needs the `pointer-events:none` tap-through
  guard** (MAP-1 — it currently blocks the start-mission tap). Don't re-chase the SVG→raster swap (done).
- **M2 / MR1** 📋 Overstimulation = no **hierarchy** (current node must dominate; scrim the bg).
- **MR2** 📋 Path misalignment — baked into the painting; recalibrate `ZONESPOTS` per act (or new bg).
- **MR3** 📋 Add a **control-cluster "legend"** (Home/Hero Den/gear) replacing the buried HUD dropdown.

**Hero Base**
- **B1** 📋 Base hero must stay **parametric** (loadout weapon/cape) → shade `heroSVG` so it's not "lesser".
- **B2/B3** ↪ cross-ref the character-art resolver + H2 buttons.

**Parent / Grown-Up Corner**
- **P1** 📐 Nav flaky → parent **hub + drill-down**, Voice Studio as its own tool, **cognitive gate** — **SPEC
  ready** (research-backed; preserves every feature + bound IDs).

**Cross-cutting — characters & chrome**
- **🖼️ UI Glow-up Audit** — inventory: only Teddy + Vixen are raster; everyone else old SVG (+ Neo's
  visual-audit instructions: extend `shot.mjs` scenes, rollout order, uniform-canvas spec).
- **📐 Character-art resolver + rollout** — `RASTER` manifest + `charArt()`; flip one boolean per character.
- **🗂️ Prioritized punch-list** — Phase 1 quick wins → Phase 2 resolver → Phase 3 art-gen → Phase 4 chrome.

**Specs ready for Neo right now:** H4 (one-PLAY) · M1 (map hero) · Character-art resolver · Map Rework Packet.
**Ship-now quick wins:** H3, H4, M1-wire, B1(b) shade `heroSVG`.

**🆕 GOLD-STANDARD UI/UX AUDIT (real-screen, U-series) — see the dated section below.** Highest-leverage:
- **U1** ✅ **SHIPPED+verified (Neo, 1d4ce8c)** — ear 52→72px with a ~96px hit-area (the audio-first lifeline,
  constraints #6/#8) + round nav/gear 54→72px. Re-shot on a real screen: replay/coin/nav chrome reads larger. ✔
- **U2** ✅ **SHIPPED+verified (Neo, 1d4ce8c)** — map zone labels brighter (locked `#9a92c0`→`#c7c0e6`) on opaque
  pills, glyph-distorting `textLength` stretch removed, subtitle ink-stroked, progress counter bigger+stroked.
  Re-shot: map labels read **clearly** now, distortion gone. ✔ *(Busiest-spot map contrast = the structural MR1/U6
  rework, not this fix.)*
- **U3** 🟠 Grown-Up Corner layout — vast empty lower half + 12–15px text (cross-refs **P1**).
- **U4** 🟡 Emoji picture-tiles amid premium painted/raster art (style clash); intro/scan/forge = one tiny
  floating control on a vast empty scene (weak affordance). U5 consistency + map clutter fold into **MR1/M2**.
- **U8** 🟡 Finale boss (Lord Vex) renders identically to a common Vexbot — no climax escalation (art lane, ↪B1).
- **U9** 🟡 Trace round — varying dot sizes + no ghost letterform/stroke order (multisensory gap, ↪I2; Act-1 only).
- **U10** 🟠 Intro cutscene "boxy" skyline = crude flat-vector clip-art on premium art (the parent's complaint; ↑I1).
- **U11** 🟠 `.bubble` long lines clip behind the 🔊 ear button (Recharge/Interlude) — add right padding (CSS-only).
- **U12** 🟡 Act-2 map hero clipped by the top HUD bar (↪MR2 ZONESPOTS). **U13** 🟡 league names truncate ("SS KENDA").
- *ALL screens rendered now — 11 mission types + win/rest/train/shop/recharge/intro/interlude + Act-2 medieval skin.
  Core learning loop + populated Base/Victory + Act-2 skin are strong; fixes are chrome, not the loop. Cast: hero/
  villain/mentor/freed-ally raster done; left = Miss Kendall + JJ/Cal/Nora faces + full-body cards (see CAST INVENTORY).*

— Trinity, 2026-06-14

---

## 🎨 GOLD-STANDARD UI/UX AUDIT — real-screen, Chromium (Trinity, 2026-06-14)

**The assignment (parent):** *"Put your UI/UX hat on, research the gold standard in mobile gaming, render the game,
and list every contradiction to best practices — go deep, fix the UI once and for all."* This is the deep packet
for Neo.

**Method.** Rendered the REAL game in headless **Chromium** from the cloud via the npm-Chromium recipe (Trinity's
local `tools/shot-cloud.mjs` — the full recipe is documented up top; Neo can land it durably in the tools lane).
Captured 8 real screens at 1024×768 @2x: **title, map, base,
settings(Grown-Up Corner), scan, find, read, forge.** Each finding cites the exact file/line + CSS value, the
best-practice it violates, and a concrete fix.

> ⚠️ **One caveat on the renders:** the screenshot harness blocks the Google-Fonts CDN (else WebKit/Chromium hang on
> it), so text rasterised in **system-fallback fonts** — the real **Bangers / Andika / Baloo 2** faces differ. So
> **layout, colour, contrast, sizing, spacing and art are faithful, but the wordmark/letter *font look* is NOT** —
> do not judge H1 (title font) from these. Everything below is font-independent.

**The yardstick (2026 mobile-game + kids-UX research).** Touch targets: ≥44–48px iOS/Android *floor*; **kids 4–7
need ≥64px with ~64px gaps**; this project already mandates **~96px** (CLAUDE.md #6). Nav: reserve top corners for
back/secondary, one-handed reach, **5–7 items max**, cleaner HUD = less clutter. Onboarding: first win <60s, teach
in-gameplay, progressive disclosure. Feedback: immediate visual+audio, explicit button **press/disabled** states,
120–220ms micro-animations, honour `prefers-reduced-motion`. Readability: high contrast (WCAG AA ≈ 4.5:1 body),
clear single primary action, designed empty/zero states. (Sources at the end.)

### 🔴 P0 — hard-constraint regressions (ship first)

**U1. Touch targets under the 96px mandate — including the audio-first lifeline.** *(violates CLAUDE.md #6 large
targets, #8 every prompt has a replay button; kids ≥64px floor.)*
- `.bubble .ear` (the **🔊 replay** button on every prompt) = **52×52px** (`styles.css:49`). This is THE control the
  pre-reader taps to re-hear an instruction — it must be the easiest tap on screen, and it's the smallest.
- `.roundbtn` (the **settings gear** top-right + round nav buttons) = **54×54px** (`styles.css:134`).
- **Fix:** bump both to **≥72px (target 96px)** with a transparent ≥96px hit-area if the visual must stay small
  (pad + `padding`/`::before` hit-box). The ear especially — it's failing the audio-first constraint. Quick win,
  CSS-only. *Confirm against `.tile.rletter` which already scales to 96px (`styles.css:75`) — match that ceiling.*

### 🟠 P1 — readability / contrast (high impact, low risk)

**U2. Low-contrast text in three places (fails WCAG AA on a busy painted ground).**
- **Map zone labels** (`map.js:63`): locked = `#9a92c0` muted-purple, and the label pill is only `rgba(10,5,24,.82)`
  at `font-size:17` — on the dense painted map the locked labels barely read. ALSO `textLength="${pw-20}"
  lengthAdjust="spacingAndGlyphs"` **stretches/squashes glyphs to fit**, distorting letterforms (bad for a kid
  learning shapes). **Fix:** raise locked label to ≥`#c7c0e6`, thicken/opaque the pill, drop the `textLength`
  stretch (let it wrap or shrink-to-fit), and add a subtle text-shadow for separation from the art.
- **Title subtitle** `.sub` = `#cfc6f2` (`styles.css:247`) on the bright cloud background → washed out. **Fix:**
  add an ink stroke/shadow (matches `.title-logo`) or a translucent plate behind it.
- **Progress counters** ("0 / 4", "0 / 3" on find/read) read tiny and dim — the only orientation cue in a round.
  **Fix:** bigger, higher-contrast, ideally a dot/pip row (kids parse pips faster than fractions).

**U3. Grown-Up Corner (Settings) — unbalanced layout + tiny type.** Real shot: the panel fills only the **top third;
the bottom ~half is dead empty space**, and body/tab text is **12–15px** (`styles.css:257 .tabbtn 15px`, `265 .plbl
12px`, `271 .pnote 12px`). Button hierarchy is inconsistent (huge "Add player" pill vs small "Close"). This is the
**P1 parent-hub** problem seen on a real screen — fold this evidence into that spec: centre/space the content, raise
parent-readable text to ≥16px, normalise button sizes, and use the empty space for the hub's drill-down cards.

### 🟡 P2 — hierarchy, consistency, affordance

**U4. Intro / scan / forge = one tiny floating control on a vast decorative scene.** Real shots of `scrScan` and
`scrForge` show a single ~52px audio button centred on an otherwise empty painted stage — beautiful but **near-zero
visual affordance** ("what do I do here?"). Audio narration carries it, but per onboarding best-practice the *first
meaningful action* should be visually obvious. **Fix:** give intro/calibration screens a clear, large, pulsing
primary CTA (e.g. a big "TAP TO START" gem) alongside the audio — ties into **I1/I2**.

**U5. Style clash — emoji picture-tiles inside premium painted/raster art.** The Read-It choices render as raw
emoji (🐶🎩🐱 on `.picktile`, `game.js` read flow) while the title/map/cast are premium painted/raster. Emoji read
inconsistently across devices and break the "premium game" target (STYLE.md). **Fix (later, art lane):** a small
set of consistent flat-vector picture icons for the READWORDS/READWORDS2 pool. Low priority; logging for the art
rollout.

**U6. Map overstimulation / weak current-node dominance (confirms M2 / MR1 on a real screen).** ~12 nodes + labels +
hero + ally figures overlay a high-detail painting; the **current** node doesn't visually dominate, so "where do I
tap next" isn't instant. Best-practice (cleaner HUD, clear primary action) wants the current node to pop and the
rest to recede. **Fix:** already specced as **MR1** (scrim the bg behind the active node, scale/glow the current
node, dim done/locked) — this audit is the real-screen evidence for it; bump its priority.

**U7. Hero Base — low-contrast card bodies + cramped hero/collection overlap + heavy zero-state.** Card body text is
dim purple on dark (hard to read); the left hero card visually collides with the collection panel; and on a fresh
save every shelf shows "0 / N" with "go earn this!" copy — a lot of empty-state at once (borderline vs the
"show only EARNED items, never empty slots" rule, CLAUDE.md World-canon). **Fix:** raise card-text contrast, add
breathing room between hero and panels, and soften the zero-state (show the first goal only, not all four 0/N rows).
Cross-refs **B1** (shade `heroSVG`) — the Base hero also still reads as the plainer SVG vs the premium raster Teddy
on the title (character-consistency, art lane).

### 🟢 Learning-screen sweep — ALL 11 mission types rendered (2026-06-14)
Drove and shot every round type (learn, trace, find, read, forge, spell, sentence, cloze, scramble, magic, boss,
fortress). **Headline: the core learning loop is consistent and strong** — a stable grammar across every screen:
instruction **bubble at top** → context/anchor (letter, picture, enemy) → **slots/target** → **tile row at bottom**,
with **sight-word tiles visually differentiated** (cream + ♥ heart marker) from **decodable tiles** (blue), all in
large high-contrast Andika gems. This consistency is a genuine asset; the fixes below are *chrome*, not the loop.
Two NEW findings + confirmations of the systemic ones:

**U8. The finale boss has no visual escalation — Lord Vex renders identically to a rank-and-file Vexbot.** Real shots:
the `scrBoss` common enemy and the `scrFortress` *climax* villain (`game.js` `bossSprite()`/`inkblotSVG`) are the
**same gray robot at the same size**. The Act-1 finale is the emotional peak ("Free Leighton!") — best-practice
(climax should feel bigger/distinct) wants Lord Vex larger, scarier, visually escalated vs his mooks. A raster
`vex.png` already exists in the pipeline but the fortress uses the plain SVG. **Fix (art lane):** give the finale
boss a distinct, larger sprite (raster Vex, or scale+recolour+extra menace on the SVG). Cross-refs **B1**/resolver.

**U9. Trace round — dots have inconsistent sizes and no ghost letterform / stroke order.** Real `scrTrace` shot: the
"S" is shown as loose yellow dots of *varying* size on a plain white square, with no ghosted letter outline and no
numbered/connected path — a pre-reader (esp. dyslexia profile) can't infer stroke direction. Multisensory O-G
practice wants a clear ghost letter + ordered path. **Fix:** uniform dot size, a faint ghost letterform behind the
dots, and a drawn/numbered path. Cross-refs **I2**. (Low priority; the trace step is Act-1-only — digraphs skip it.)

**U2 is SYSTEMIC (confirmed on every round):** the progress counter ("0 / 3", "0 / 8", "0 / 2") is uniformly tiny +
dim gold on every learning screen — the child's only "how far am I" cue. Make a **shared high-contrast pip/dot row**
component and use it everywhere (kids parse pips faster than fractions). **U5 is SYSTEMIC too:** emoji picture-tiles
appear across read/sentence/cloze/scramble, not just Read-It.

### What's already GOOD (don't "fix") — real-screen confirmations
- **Anti-gaming #4 holds on screen:** the Find AND fortress-boss prompts read "…makes the sound… 🔊" with **no letter
  shown** — exactly right. Don't let any "readability" fix add the target letter to the prompt.
- **Letter/word/picture tiles are excellent:** large, high-contrast Andika gems (`s a t`, `c a t`, picture choices)
  — these are the most salient thing on screen, as intended. Leave them.
- **Sight vs decodable differentiation** (cream+♥ vs blue) reads clearly on sentence/cloze/scramble — keep it.
- **The single PLAY title (H4) and the city-chip nav dropdown** are clean and correct.
- **Clear primary CTAs** where they matter: "TRACE IT! →", "CAST MAGIC-E", "Hear the sentence" — good affordance.

### 🟢 Meta / reward / shop / Act-2-skin sweep — round 2 (2026-06-14)
Rendered the remaining surfaces the first pass skipped: **win/Victory, rest, Training Room, Hero Shop, Recharge
(Memory Vault), the Intro + Interlude cutscenes, and the ACT-2 medieval skin** (map, base, digraph learn). New
findings + confirmations:

**U10. The Intro cutscene's "boxy" skyline panel is the single weakest visual in the game (elevates I1 to 🟠).** Real
`scrIntro` shot: a **crude flat-vector skyline** (plain rectangles + dot windows + a circle moon) framed in a gold
box, sitting on top of the premium painted background — it looks like placeholder clip-art glued onto a finished
game. This is exactly the parent's "weird boxy box." **Fix:** replace the `.panelart` skyline with full-bleed
generated/painted art (or remove the frame and let the painted bg carry it). The Interlude reuses the same frame but
there it wraps **real raster characters** (Mom & Dad) so it reads fine — so the fix is specifically the *skyline
illustration*, not the frame everywhere. **Bump I1 priority** — this is high-visibility (every first run).

**U11. Bubble text clips behind the 🔊 ear button on long lines (layout bug).** Real shots: Recharge ("build the word
you hear" → "hear" cut at the edge) and Interlude ("an urgent message is coming in!" → "coming" clipped). The `.bubble`
reserves no right-side padding for the absolutely-positioned `.ear` (`styles.css:39-52`), so long final words run
under/past it. **Fix:** add `padding-right` ≈ ear-width+gap to `.bubble` (or inline-flow the ear). CSS-only.

**U12. Act-2 map hero is clipped against the top HUD.** Real `a2map` shot: the knight on the current zone (Dragon
Keep, top of the medieval map) is **cut off by the top "TODAY'S TRAINING" bar / HUD chip** — feet-on-node placement
collides with the HUD when the current zone sits high. **Fix:** clamp the map-hero Y (and/or the HUD) so the figure
never overlaps the top bar; folds into the **MR2 ZONESPOTS recalibration** (per-act) — same lane.

**U13. League-shelf names truncate badly ("MISS KENDALL" → "SS KENDA").** Real `a2base` shot: the Hero League member
labels clip mid-word with no ellipsis (`allyMapFig`/league-shelf label width). **Fix:** shrink-to-fit or ellipsis the
ally name, or shorten the display alias. Minor, cosmetic.

**U5 confirmed in Shop + collectibles:** the Hero Shop items (Hero Banner/Trophy/Vexbot Toy/Dragon Toy/Crown/Rocket)
are all **emoji** (🚩🏆🤖🐉👑🚀) — same premium-clash as the picture tiles; the shop is where it stings most ("buy this
cheap-looking emoji"). Roll the U5 icon set to the shop too.

**More real-screen GOODs (don't fix):** the **Victory screen** is strong (premium raster Teddy in a random win-pose +
rescued-ally face + confetti + clear CITY MAP / NEXT MISSION choices). The **fully-populated Act-2 Base** looks great
(6/6 league with raster ally faces, 26/26 lettered gem collection, knight + medieval bronze button skin) — proving
**U7 is a *zero-state* problem, not a populated-state one.** The **Act-2 medieval skin** (stone/bronze chrome,
gold-bordered map pills, MedievalSharp on chrome) reads well and the digraph-learn articulation cue ("Push your lips
forward — shhh") is good pedagogy. **Mom & Dad raster portraits** (Interlude) are on-brand.

### 🎭 CAST RENDER INVENTORY (answering "who's left to render?") — 2026-06-14
Source of truth = the `RASTER` manifest (`art.js:198-200`) + the `rasterArt()` call sites, confirmed on real screens.
- **✅ RASTER (premium, done):** Teddy ×3 muscle stages + Knight ×3 (`teddy-m0..2`, `teddy-knight-m0..2`); the 5 freed
  allies — Archie(Tank)/Ellie(Flip)/William(Sunny)/Amelia(Heart)/Leighton (`ally-*`); **Lord Vex** (`art/vex.png`),
  **The Vixen** (`art/vixen.png`), **Dragon** (`art/dragon.png`), **Noah the Red** (`art/noah.png`); **Mom & Dad**
  (`mentorChips`). *(Note: confirm the `teddy-knight-*` PNGs are final art, not placeholder — the on-screen knight
  reads simpler than the raster Teddy.)*
- **🟡 STILL PLACEHOLDER / PARAMETRIC-SVG (left to render):**
  1. **Miss Kendall** — `allyFace("kendall")` is an explicit placeholder (`art.js:292 "placeholder until a photo"`);
     she's a *rescued ally*, visible now on the Act-2 league shelf (the "SS KENDA" chip). Needs real raster.
  2. **JJ, Cal, Nora** — the Act-2 captured friends — placeholder `allyFace` (`art.js:302/307/312`); no raster, no
     full-body. (Parent will provide real-kid references per CLAUDE.md.)
  3. **Full-body ally CARDS** — `allyBody()` (`art.js:362`) is parametric SVG for the Pokémon-style flip cards; not
     raster for anyone yet.
  4. **`captiveSVG` / `portalSVG`** — Interlude "?" silhouettes + time portal, still placeholder SVG.
- **Intentionally vector (NOT to rasterize):** letter/word/picture gem tiles, trace dots, gem collection, UI chrome.
- **Bottom line:** the *hero/villain/mentor/freed-ally* cast is ~done; the remaining "who" = **Miss Kendall + JJ/Cal/
  Nora** (faces, blocked on parent photo refs) **+ the full-body card art for everyone** + the two interlude
  placeholders. None block gameplay; all are art-lane polish (cross-refs the character-art resolver + **U8** boss
  escalation).

### 🎮 ENGAGEMENT / "want-to-play" wave → see DESIGN-ENGAGEMENT.md (2026-06-14)
The next-wave feature specs (treasure chests, Hero Room revamp, weapons/customization ecosystem, store expansion,
pets, the coin-fly juice pass) + an IP read (Marvel/Avengers + Lord of the Rings) live in **`DESIGN-ENGAGEMENT.md`**,
with a research basis and a best-first build order. Audit fixes (U-series, below) ship first; that doc is the parallel
delight track.

### 🔧 U10–U13 — READY-TO-SHIP FIX SPECS (Neo, exact targets) — 2026-06-14
All four are small + low-risk. Verify each with `node tools/shot-cloud.mjs <scene>` (scenes: `intro`, `recharge`/
`inter`, `a2map`, `a2base`) + keep `save`/`curriculum` green.

**U11 — bubble text clips behind the 🔊 ear (🟠 CSS one-liner; ship first — it's a regression from U1).**
*Root cause:* `.bubble` reserves `padding:16px 70px 16px 22px` (`styles.css:41`) — that **70px right pad was tuned for
the OLD 52px ear**. The U1 fix enlarged the ear to `width:72px; right:12px` (`styles.css:49`), so it now needs
`72+12+gap ≈ 92px` and overflows the 70px reserve, clipping the last word (seen on Recharge + Interlude).
*Fix:* bump `.bubble` padding-right **70px → 92px**. That's it. (`max-width:min(760px,92vw)` stays fine down to ~320px.)

**U10 — Intro "boxy" skyline = crude clip-art on premium art (🟠; the parent's complaint).**
*Root cause:* `INTRO[0].art = citySVG()` (the flat-rectangle skyline, defined in `art.js`) and `INTRO[3].art` (the
inline "two boxes + line" letter-pairing SVG at `game.js:475`) are placeholder vector clip-art injected into
`#introArt` over the painted bg. *Fix (pick one, lowest-effort first):* (a) replace `citySVG()` with a **full-bleed
painted `art/intro-city.png`** via the gen pipeline (house style in `art/CHARACTER-ART-PROMPTS.md`), wrapped like the
other raster art so the cine letterbox/grade still apply; (b) at minimum, **drop the gold `.panelart` frame** on the
skyline beat and let the painted `#sceneGrade` background carry it (the Interlude frame STAYS — it wraps raster Mom &
Dad and reads fine). Replace the panel4 boxes-SVG with a simple painted "two gems join" motif or real letter tiles.
*Don't* touch the cutscene flow/`faceSpeak`/`cutsceneFX` — art swap only.

**U12 — Act-2 map hero clipped by the top HUD (🟡; `map.js`).**
*Root cause:* the current-zone hero seats feet at the node and extends UP by `s*226 ≈ 140px`: `const s=.62,
hx=x-s*120, hy=(y+4)-s*226;` (`map.js:~70`). When the current node sits high (Act-2 Dragon Keep), `hy` goes
negative and the figure is cut by the top training/HUD bar. *Fix (keeps feet on the node, shrinks to fit):*
```js
const topPad = 70;                 // clear the HUD chip / training bar
let s = .62;
if ((y+4) - s*226 < topPad) s = Math.max(.4, ((y+4) - topPad) / 226);
const hx = x - s*120, hy = (y+4) - s*226;
```
(Alternatively/additionally, **MR2 ZONESPOTS** can keep every act's current-path nodes at `y ≥ ~150` — same lane.)

**U13 — league-shelf names truncate ("MISS KENDALL" → "SS KENDA") (🟡; `game.js:1257`).**
*Root cause:* the league button renders `t.real` and `"t.name"` as `<text text-anchor="middle">` inside a 64-unit-wide
`viewBox="-32 -36 64 86"` with **no fit**, so long names overflow and the button clips both ends. *Fix:* add a fit to
both `<text>` elements: `textLength="60" lengthAdjust="spacingAndGlyphs"`. (Name labels can squeeze slightly — unlike
learning letters, distortion here is acceptable. Optional: only apply `textLength` when the name is long.)

### 🗺️ MAP REDO — regenerate the background, then rebuild the path (parent directive, 2026-06-14)
**Parent still doesn't love the world map — "feels so busy in a bad way."** This supersedes the cosmetic map fixes
(U2 label contrast / U6 hierarchy / U12 hero-clip) with a **full art redo**, not a tweak. Confirmed on my real renders:
the **Act-1 Star Force City map is the worst offender** — wall-to-wall high-saturation neon detail with no negative
space, so the glowing nodes + labels + hero have **nothing to sit against** (poor figure-ground; the busyness fights
the interactive layer). Note for the brief: the **Act-2 medieval map already reads better** (calmer, atmospheric, more
negative space) — use it as the *bar*, and bring Act 1 up to it.
- **The plan (parent's call):** (1) **regenerate the painted background image** with a calmer composition, then
  (2) **rebuild the path + ZONESPOTS** overlay to the new art. Neo can do the regen via the image-generation APIs
  (see the AGENTS.md tooling note).
- **Art direction for the regen prompt:** a clear *journey* read — a **legible winding path** with **negative
  space/atmosphere around it**, surroundings **desaturated/lower-contrast** so the path and the glowing zone nodes
  **pop** (figure-ground first); a few **distinct landmarks** at the zone spots (not uniform clutter); consistent
  depth/lighting; single screen, no scroll; **1000×750** authoring space to match `ZONESPOTS`. Keep the hero + nodes +
  labels as the brightest things on screen — the background should *recede*. Per act: keep the sci-fi (Act 1) vs
  medieval (Act 2) identity, but both calm.
- **Code targets (`map.js`):** swap `MAPIMG` background (`art/bg-map.jpeg` Act 1, `art/bg-map-a2.jpeg` Act 2), then
  **recalibrate `ZONESPOTS[act]`** `[x,y]` per zone to the new path (this is the **MR2** recalibration — fold U12's
  hero-clip floor `y ≥ ~150` in here so the current-zone hero never collides with the top HUD). `mapPaintSVG()` overlay
  logic stays; only the bg art + the spot coordinates change. Re-verify with `node tools/shot-cloud.mjs map a2map`.
- **Save-safe:** art + coordinate change only — no save schema impact.

### Recommended sequence for Neo
1. **U1 touch targets** (ear 52→≥72/96, roundbtn 54→≥72) — CSS-only, hard-constraint, ship today.
2. **U2 contrast** (map labels + subtitle + progress pips) — CSS/`map.js`, low risk.
3. **U6/MR1 map hierarchy** + **U3 → P1 parent-hub** — the two structural reworks (already specced; this is the
   evidence).
4. **U4 intro CTA (I1/I2)** + **U9 trace ghost-letter**, then the art-lane items (**U5** emoji icons, **U7/B1** Base
   hero shading, **U8** distinct finale-boss sprite).
Verify each with `node tools/shot-cloud.mjs <scene>` — scenes now cover ALL 11 mission types (title/map/base/settings/
scan/find/read/forge/learn/trace/spell/sentence/cloze/scramble/magic/fortress/boss). Trinity can re-shoot any screen,
incl. before/after, on request. Keep `save`/`curriculum` green.

**Sources (research yardstick):** WANDR — UX for gaming platforms; UXPin — Game UX guide 2026; Pixune — mobile game
UI 2026; UX Planet / Gapsy / Aufait UX — designing apps for kids; AccessibilityChecker / Wix Studio —
microinteractions & button-state feedback. (Touch-target floors: Apple HIG 44pt / Android 48dp; kids ≥64px.)

— Trinity, 2026-06-14

---

## 🧠 PEDAGOGY BACKLOG INDEX — at a glance (Trinity, 2026-06-14)

The evidence-based reading-science upgrades from the **🧠 RESEARCH BRIEF**, with status (📐 spec ready · 📋
proposed · ✅ done · 💡 advisory). Detail in the dated specs/brief below; grounded in PubMed/NRP/Ehri.

**Confirmed strengths — keep, don't "fix":** systematic synthetic-phonics core · sound-mapped "Heart Word" sight
words (= orthographic mapping) · the decodability invariant · the no-failure/adaptive loop.

| # | Rec | Status | One-liner |
|---|---|---|---|
| **1** | **Memory Vault** | 📐 spec | Expanding-interval **spaced review** of mastered items (box/due on `S.mastery`). *Highest retention leverage — and the scheduler #2/#3/#4 reuse.* |
| **2** | **Spell Scroll** | 📐 spec | **Repeated reading + listening preview** (fluency); Training Room; reuses the Vault scheduler. |
| **3** | **Sound Warm-Up** | 📐 spec | Oral **phonemic awareness** + child **articulatory cues** (reuses `PH_COACH`/`graphemeSounds`). |
| **4** | **Mastery-threshold tune** | 📐 spec | Split **proficient** (gates finales) vs **retained** (proficient + spaced-correct); gentle bar bump (0.8/seen5). |
| **5** | OG/"multisensory" caveat | 💡 advisory | Keep see/hear/trace/find, but invest in #1–3, not MORE multisensory ornament (not the active ingredient). |
| **6** | Morphology + comprehension | 📐 spec | "Word Crafting" (base+affix recipes) + literal comprehension Qs — **capstone** after fluency. Spec ready. |

### Sequenced roadmap (dependencies)
- **Quick wins (independent):** **#3 articulatory cue** on the Learn screen (cheap; reuses `PH_COACH`); **#4**
  threshold tune (mostly constants).
- **Foundation:** **#1 Memory Vault scheduler** (box/due) — the spaced engine #2, #3's warm-up, and #4's
  spaced-correct all reuse. Build before stacking the rest.
- **Build on the scheduler:** **#2 Spell Scroll** · **#3 blend/segment warm-up** · **#4 spaced-correct**.
- **Later/roadmap:** **#6** morphology + comprehension (after decoding + fluency are solid).
- **Adjacent (motivation, not reading science):** progression pacing — muscle ✅ done; **gear/friend-rescue
  spread** still 📋 proposed.

— Trinity, 2026-06-14

---

## Morpheus follow-up review — 2026-06-14

Fresh pass on current `main` after the cloud-auth + generated-art/map commits. I ran `node tests/save.test.js`, `node tests/curriculum.test.js`, a JS/MJS `node --check` sweep, and `git diff --check`; all passed. I agree with Trinity's research/spec direction overall. Two implementation follow-ups are worth carrying with the existing QA packet:

**1. Painted map Teddy can intercept taps on the current zone — CONFIRMED regression risk.**
Evidence: the map still attaches click handlers only to `.mnode` groups (`map.js:112-115`). The new painted Teddy is built separately as `hero`, placed with feet at the current node base (`map.js:64-67`), and then rendered after `${nodes}` in the root map SVG (`map.js:101-103`). In SVG paint/hit-test order, later visible elements sit above earlier ones, so tapping the new Teddy/image over the current node can target the hero `<image>/<g>` instead of the `.mnode`. This shrinks the effective touch target for the main "continue mission" action, which cuts against constraint #6.
→ **Proposed fix:** make the map hero purely decorative for hit-testing: add `pointer-events="none"` to the hero shadow + wrapper group, or move the hero below the current `.mnode` while keeping the visual stacking acceptable. Add a cheap DOM/string regression test that `mapPaintSVG()`'s hero wrapper is pointer-events-none when the hero is rendered above nodes.
— Morpheus, 2026-06-14

**2. Wrong Family sync code can be cached and briefly reported as connected — CONFIRMED minor UX bug.**
Evidence: `cloudPull()` collapses every non-OK response, including Worker `401`, into `false` (`state-save.js:128-133`). `cloudConnect()` saves the entered code before validating it (`state-save.js:135-137`), then treats `false` as "Connected ✓ — this device now backs up to the cloud" and calls `cloudPush()` (`state-save.js:142-144`). The later PUT does show "Wrong family code" (`state-save.js:123-127`), so the security path is fail-closed, but the parent can see a false success first and the bad code remains cached until turned off/replaced.
→ **Proposed fix:** have `cloudPull()` return a distinct auth-failure result for `401`; in `cloudConnect()`, show "Wrong family code", clear `teddyCloudSecret`/`cloudSecret`, and skip `cloudPush()`. Optional: make `cloudActive()` or the Progress tab distinguish "code present" from "last authenticated sync succeeded."
— Morpheus, 2026-06-14

**QA.md note:** M1 has moved from "old SVG map hero" to "painted map hero shipped, needs tap-through guard + rendered screenshot check." I would not rewrite the historical sections, but Trinity's top UI backlog index should mark M1 as partially shipped once the pointer-events issue is fixed, so future agents do not keep chasing the already-completed SVG-to-raster swap.
— Morpheus, 2026-06-14

> **✅ Vetted + merged by Trinity (PR #2, 2026-06-14) + a fresh sweep.** Both Morpheus follow-ups verified
> against source — accurate. **Routing to Neo as code fixes:**
> - **MAP-1 (real bug, elevate from "risk"):** the painted map Teddy (`heroMarquee`, map.js:64–67) renders
>   AFTER `${nodes}` with no `pointer-events:none`, so it sits above the current `.mnode` and **intercepts the
>   start-mission tap** (map.js:112) — it blocks the map's *primary* action, not just shrinks it. **Fix:** add
>   `pointer-events="none"` to the hero `<g>` + its shadow (it's purely decorative). Add a string test that
>   `mapPaintSVG()`'s hero wrapper is `pointer-events`-none.
> - **CLOUD-1 (minor UX):** `cloudPull()` collapses `401`→`false`, so `cloudConnect()` caches a WRONG family code
>   and shows "Connected ✓" (state-save.js:128–144). Security is fail-closed (the PUT later says "wrong code"),
>   but the first signal is a false success. **Fix:** `cloudPull()` returns a distinct auth-fail for `401`;
>   `cloudConnect()` then shows "Wrong family code", clears `teddyCloudSecret`/`cloudSecret`, and skips `cloudPush()`.
> - **MAP-2 (minor, my sweep):** `styles.css:168` `.mnode.locked{pointer-events:none}` means the gentle
>   `locked_tip` cue (map.js:114) **can never fire** — a child tapping a locked zone gets silence. Decide: keep
>   the CSS block (silent, doubly-locked) OR drop `pointer-events:none` and rely on the JS guard so the gentle
>   "not yet" cue plays. (Lock enforcement itself is fine either way.)
>
> **Sweep result:** baseline clean — `save 41`, `curriculum 40`, every JS/MJS parses; no structural regressions.
> The `charArt`/`RASTER` rollout is incremental as designed (Teddy + Vixen raster; villains/allies still SVG —
> not a bug). M1 in the UI index updated to **partially shipped** (needs MAP-1 guard). — Trinity, 2026-06-14
>
> **Deeper sweep (Trinity, 2026-06-14):** traced the high-churn areas (resolver, generated-art assets, map hero,
> hero cards, boss/finale). No new bugs. Confirmed: **every `RASTER` PNG actually exists** (teddy m0–2, knight
> m0–2, ally-tank, ally-sunny, vixen) — no manifest/asset mismatch (a `true` flag with a missing PNG would render
> an INVISIBLE character, since SVG `<image>` shows nothing on a bad href; worth a tiny test). One **MAP-1
> extension:** the `mapFriends` ally figures (map.js:36) are also decorative with no `pointer-events:none`, so
> they can intercept node taps too — apply the guard to **all** decorative map figures (hero + allies), but NOT
> to `.mnode`/`.portalnode` (those must stay tappable). `allyMapFig` staying SVG while the hero is raster is the
> expected incomplete rollout (cosmetic), not a bug.

---

## Morpheus deep-dive addendum — 2026-06-14

Scope: pulled and rebased onto `origin/main` at `fd4097d`, after Neo shipped MAP-1/MAP-2/CLOUD-1, pacing P1,
Memory Vault #1, and the dedicated Recharge activity. Rechecked the hard-constraint lanes (sound-ID anti-gaming,
audio-first flow/watchdogs, save migration, map touch targets, generated art rollout, Act-2 finale, and daily loop).
Baseline is clean: `node tests/save.test.js` = 73 pass, `node tests/curriculum.test.js` = 53 pass, JS/MJS parse
sweep pass, `git diff --check` pass. I am not re-reporting MAP-1/CLOUD-1/MAP-2; those are fixed on main.

**1. Act-2 fortress word-locks can mis-teach magic-e audio — CONFIRMED new bug.**
Evidence: `fortRead()` samples the act-aware `readPool()` (`game.js:984`), which is `READWORDS2` in Act 2
(`game.js:773`) and includes magic-e words like `cake`, `bike`, `home`, `cube`, `rose` (`data-content.js:86-92`).
But the fortress word tiles are rendered with `toGraphemes(w)` and each tile simply plays `Aud.play("snd_"+c)`
(`game.js:986-987`). For `cake`, that means the `a` tile replays short /a/ instead of `snd_a_long`, and the
silent `e` tile replays `snd_e`. The main Read-It path already knows the correct behavior: `magicE(w)` +
`graphemeSounds(w)`, `longv`, and `silente` (`game.js:782-787`).
-> **Proposed fix:** factor/reuse one word-tile renderer for Read-It, Training, Forge, and Fortress, or at least
copy the `nextRead()` magic-e branch into `fortRead()`: long-vowel tile plays `snd_*_long`, silent-E is visibly
dimmed and does not play short /e/, and a correct magic-e word credits `record(magicE(w).unit,true)` just like
Read-It (`game.js:793-795`). Add a focused test/helper assertion that a fortress-rendered `cake` uses long-A and
never binds `snd_e` to the silent-E tile.
— Morpheus, 2026-06-14

**2. Recharge routes magic-e safely, but its build feedback still treats CVCe tiles as ordinary letters — CONFIRMED new bug.**
The new Recharge activity correctly avoids anti-gaming bug #4: `vaultRoute()` sends no-clip magic-e units to a
build round inside a real word, not to sound-ID (`game.js:1410-1422`), and tests now cover that routing. The build
round itself is still not magic-e-aware, though. `vaultUnits(w,false)` uses `toGraphemes(w)` (`game.js:1414`),
`vaultBuild()` renders plain slots with no `silente`/`longv` classes (`game.js:1449-1452`), and per-tile feedback
plays `Aud.play("snd_"+c)` / `Aud.play(["snd_"+want])` (`game.js:1464-1467`). For a due `a_e` reviewed through
`cake`, the child can hear short /a/ on the `a` tile and short /e/ on the silent-E retry path; the final word audio
is correct, but the step-by-step feedback undermines the Magic-E rule.
-> **Proposed fix:** share the magic-e-aware tile/audio helper used by Read-It/Forge: compute `magicE(w)` +
`graphemeSounds(w)`, mark the long vowel and silent E visually, play `snd_*_long` for the vowel, and suppress
short-/e/ replay for silent E. Add a Recharge-specific guard for `vaultBuild(vaultRoute("a_e"))`/`cake` proving it
does not bind `snd_a` or `snd_e` to those CVCe feedback moments.
— Morpheus, 2026-06-14

**3. Act-2 finale sentence/comprehension proof is still the highest reading-core backlog item.**
This is not a duplicate bug report; it is a priority call after MAP/CLOUD shipped. The old Morpheus finding remains
live: Dragon Keep's final phase is still `{kind:"read"}` for "READ TO FREE MISS KENDALL!" (`game.js:944-948`), so
the climax can finish on word-picture decoding rather than sentence/comprehension proof. The dormant `fortSentence`
path still hardcodes Act-1 `FORTMAZE`/`SENTENCES` (`game.js:1020-1034`), so flipping the final phase is not safe
until those pools are act-aware.
-> **Material suggestion for Trinity:** promote this alongside Training/Vault surfacing in the active top handoff
as the next reading-core packet: Act-2 final proof should use `SENTENCES2` plus `CLOZE2`/Act-2 maze content, with
the same no-timer, audio-first flow. Training Room cumulative/grapheme-aware work is still useful, but after
Recharge shipped it is no longer the blocker for deterministic Vault review.
— Morpheus, 2026-06-14

**4. Source-of-truth drift: CLAUDE.md still carries resolved title-flow complaints as "not yet done."**
Evidence: `CLAUDE.md:252-255` still says the title has a button under START, START/CONTINUE are redundant, and
the old "THE POWER GEMS OF STAR FORCE CITY" subtitle needs replacement. Latest code has the resolved H3/H4 shape:
generic subtitle in `index.html:75`, one `btnPlay` in `index.html:77`, and the single PLAY handler in `game.js:412`.
Because conflict order says `CLAUDE.md -> AGENTS.md -> QA.md`, this stale parent-note block can mislead future
agents into re-opening work Trinity has already verified as shipped.
-> **Proposed fix:** Trinity/Neo should mark that CLAUDE parent-note item as partially resolved/superseded:
buttons/chrome polish (H2) remains open, but H3/H4 title copy and START/CONTINUE flow are shipped.
— Morpheus, 2026-06-14

**5. Generated character art looks shippable; only one mentor-polish check remains.**
The current raster call sites and files line up: ally flags in `RASTER` (`art.js:198-200`), Mom/Dad in
`mentorChips()` (`art.js:230-245`), and Noah/Dragon through `rasterArt("noah"/"dragon")` (`art.js:585-589`).
Visual pass found no blocking content/readability issue for the latest Dragon/Noah or the Act-1 family/allies.
The one polish note: `mentorChips()` renders `art/mom.png` directly at `224x224`, and the PNG itself is tight at
the bottom edge, so Mom's shoes read slightly cropped compared with Dad. This is not a deploy blocker, but before
generated mentor art spreads further, run the harness on `mentorChips(120)` and either pad/regenerate Mom to the
same safe canvas spec as the allies or document the crop as accepted.
— Morpheus, 2026-06-14

## 🔍 CODE-REVIEW FINDINGS — verified by Claude 2026-06-14 (for the coding agent)

An external review raised 5 findings. I checked each against the actual code. **4 are real and
worth fixing; 1 is already handled.** Evidence (file:line) + recommended fix below. Any fix must
keep `node tests/save.test.js` + `node tests/curriculum.test.js` green; #2 and #3 warrant new tests.

> **✅ STATUS — verified by Trinity, 2026-06-14 (Neo's fix commit `7cfcce6`):**
> - **#2 reset-resurrection — FIXED + verified.** `clearBackup()` (state-save.js) now drops the backup
>   on reset + Level-0; snapshots kept for undo. Test is real and even includes a *contrast* case proving
>   the original bug (stale backup out-scores the empty primary without `clearBackup`).
> - **#3 magic-e remediation — FIXED + verified.** `masteryReview` now splits the weak list: magic-e units
>   route to `startMagic` (which ends `record(unit,true)…missionComplete`, so it still drives mastery + loops
>   the gate), letters/digraphs/teams go to `startFind`. Tests confirm magic-e units have no `snd_` clip and
>   never appear in find/boss foils, and that every foil grapheme IS voiced. *Minor follow-up (optional, not a
>   bug):* the magic-e path replays the FULL Magic-E teach mission once per loop (≈1 rep each), so reaching
>   mastery can mean several full-cutscene replays — less efficient/more repetitive than the sound path's
>   multi-rep round. Consider a short magic-e **practice** round (forge/read of a magic-e word) for faster,
>   gentler mastery. — Trinity
> - **#4 cloud-off persistence — FIXED + verified.** `resolveCloudURL()` + an `"off"` sentinel keep sync
>   disabled across reloads; tests cover off→disabled, unset→baked default, custom→preserved.
> - **#5 locked capes — correctly left alone** (CSS `pointer-events:none` already guards).
> - **#1 cloud auth — ✅ FIXED + verified (Trinity, 2026-06-14).** Neo shipped the parent-entered **Family
>   sync code** exactly as proposed, and a bit better. Verified against source: client `state-save.js` —
>   `cloudSecret` (localStorage `teddyCloudSecret`, never committed), `cloudActive()=URL&&secret`,
>   `cloudKey()="p"+__cloudHash(secret+"::"+ACTIVE)` (unguessable slot, no more bare `?k=teddy`), every
>   request sends `Authorization: Bearer <secret>` (`cloudAuth`), and offline-first is intact (a `401` →
>   "wrong code — saved on device", never blocks). Worker `cloud/worker.js` — **fails CLOSED**: rejects
>   unless `Bearer == env.AUTH_SECRET` (Cloudflare secret, never committed) with a **constant-time** compare
>   (`constantEq`), + a 300KB body cap. The dead public `CLOUD_PASSPHRASE` is **removed**. `save.test`
>   asserts the slot derives from the family code, not the bare id. **This also closed #4** (the `"off"`
>   sentinel). Exceeds the spec (constant-time + fail-closed + size cap).
> - Suites green at time of verification: **curriculum 40, save 41.** ALL five code-review findings now
>   resolved (#1–#4 fixed, #5 correctly rejected).

**1. Cloud saves are world-readable/writable — CONFIRMED (serious).**
Evidence: `state-save.js:29` bakes the Worker URL into this PUBLIC repo; `:36` `CLOUD_PASSPHRASE=""`;
`:39` `cloudKey()` returns the bare profile id (e.g. `teddy`); `cloud/worker.js:11–26` does
`Access-Control-Allow-Origin:*` + unauthenticated GET/PUT keyed only by `?k=`. So anyone can read,
overwrite, or wipe his save at `…workers.dev?k=teddy`, and profile names may be real kids' names.
→ **Fix nuance:** committing a value into `CLOUD_PASSPHRASE` does NOT help — it's in public client
code, so the hash is trivially recomputed. The real fix is a **parent-entered runtime secret** (stored
in localStorage, never committed) used to derive the slot key AND validated **Worker-side** (a token
the Worker checks). Minimum viable: make cloud opt-in (drop the baked URL) or add Worker auth. This is
a known documented tradeoff in CLAUDE.md, but the parent should decide explicitly.

**2. Reset / Level-0 resurrects old progress — CONFIRMED (real bug).**
Evidence: `load()` picks whichever copy has MORE progress (`state-save.js:81–82`); `save()` always
writes primary (`:87`) but mirrors to backup ONLY when `hasProgress(S)` (`:89`). The reset button
(`game.js:1465`) and the Level-0 slider path (`game.js:1402–03`) do `S=fresh(); save()`, so the
**empty primary is written but the old backup is left intact** → on next `load()` the backup outscores
the empty primary and the old save returns, silently defeating the reset.
→ **Fix:** add an intentional-reset path that snapshots (already done) then explicitly clears/tombstones
the backup, e.g. `localStorage.removeItem(BAKKEY)` (keep SNAPKEY for undo) so a deliberate fresh start
can't be resurrected. Add a save.test case ("reset is not undone by the backup on reload").

**3. Act-2 mastery remediation targets unsupported magic-e keys — CONFIRMED (real bug).**
Evidence: `actGraphemes()` in Act 2 includes `taughtMagicE()` → `a_e/i_e/o_e/u_e` (`game.js:506`,
units at `:45`); `coreWeak()` filters those for finales (`:156`); `masteryReview()` feeds the weak list
straight into `startFind()` (`:557–559`), which plays `"snd_"+g` and shows a gem tile (`:619`). There is
**no `snd_a_e/i_e/o_e/u_e` clip anywhere** (0 matches in data-lines.js + voicepack.js; digraphs/vowel-teams
DO have clips). So a child weak on magic-e at the gate gets a silent/garbled "find the gem" round with a
nonsensical `a_e` tile — and magic-e is a *split* grapheme that should never be a single sound-ID gem.
→ **Fix:** exclude magic-e units (and any grapheme lacking a `snd_` clip) from the sound-ID review;
route magic-e weaknesses to `startMagic` (re-teach the unit) or a forge/read round with a magic-e word.
Also audit find/boss foil pools so `a_e`-type units can never surface as gem tiles. Add a curriculum.test
guard ("every grapheme reachable by masteryReview/startFind has a snd_ clip").

**4. "Turn off cloud sync" doesn't survive reload — CONFIRMED (real bug).**
Evidence: the off button only removes `teddyCloudURL` (`game.js:1442`), but boot re-applies the baked
default whenever that key is empty (`state-save.js:105`). So after the next reload, sync silently turns
back on.
→ **Fix:** persist an explicit disabled state — store a sentinel (e.g. `teddyCloudURL="off"` or a
separate `teddyCloudOff` flag) and skip `DEFAULT_CLOUD_URL` at boot when it's set. (Ties into #1.)

**5. Locked capes are clickable — REJECTED (already handled).**
The reviewer flagged that the cape `onclick` has no locked guard (`game.js` capeRow) — true of the JS, but
`styles.css:311` sets `.echip.lockd{opacity:.4;pointer-events:none;}`, so a locked cape can't be tapped on
iPad Safari. Not a live bug. *Optional* defense-in-depth: add an early `return` in the handler when locked
(belt-and-suspenders), but no user-facing issue exists today.

**Priority for the coding agent:** #2 and #3 first (they silently hurt the child's experience and are
fully in-code), then #4 (small), then #1 (a product/security decision the parent should weigh in on —
flag it, propose the parent-entered-secret approach, don't bake another public secret).

### Proposed fix for #1 — lowest-friction cloud auth (parent-approved 2026-06-14; NOT YET IMPLEMENTED)

Parent decision: do it properly with a **parent-entered "family sync code"** — typed once per device,
cached, then silent forever (the child's auto-load never prompts). This is the lowest-friction option
that is actually secure, because the client is a PUBLIC static site, so **no secret can live in
committed code**. One shared family secret; the Cloudflare Worker is the only place it can be stored
server-side (as a CF **secret binding**, never in this repo); each device caches the same code locally.

**Worker (`cloud/worker.js`):**
- Read `env.AUTH_SECRET` (set via `wrangler secret put AUTH_SECRET` or the CF dashboard — never committed).
- On GET/PUT require `Authorization: Bearer <token>` and a **constant-time** `token === env.AUTH_SECRET`;
  else return `401`. This closes the anonymous read/write hole (#1).
- Optional hardening: narrow `Access-Control-Allow-Origin` from `*` to the GitHub Pages origin.
- Keep `?k=<slot>` as the storage key.

**Client (`state-save.js`):**
- `cloudSecret = localStorage["teddyCloudSecret"] || ""` — parent-entered in Grown-Up Corner ▸ Sync,
  cached per device, never committed.
- Cloud is ACTIVE only when `cloudURL && cloudSecret` (the URL may stay baked for zero-paste convenience).
- Send `Authorization: Bearer ${cloudSecret}` on every cloudPush/cloudPull fetch.
- Unguessable slot: `cloudKey() = "p" + __cloudHash(cloudSecret + "::" + ACTIVE)` (replaces the bare
  profile id, so `?k=teddy` is no longer guessable). Reuse the existing `__cloudHash`. This **supersedes
  the dead committed `CLOUD_PASSPHRASE`** — remove that field.
- Offline-first preserved: a missing secret or a `401` → run on the local save silently, never block play.

**Also fixes #4 (off doesn't persist):** drive sync off the presence of `teddyCloudSecret`, not the baked
URL. "Turn off" clears `teddyCloudSecret` and sets a `teddyCloudOff` sentinel; boot skips cloud while the
sentinel is set (remove/secret-gate the `if(!cloudURL) cloudURL=DEFAULT_CLOUD_URL` auto-enable).

**Parent flow (the whole friction):**
1. Grown-Up Corner ▸ Sync shows one field: **"Family sync code."** Parent types a memorable code → Connect.
2. Cached locally; every boot syncs silently after that. The child never sees a prompt.
3. New device → parent enters the **same** code once → his progress continues.

**Migration (one-time, no data loss):**
- Coordinated deploy: ship Worker + client together. Old bare-`?k=teddy` slots stop being used; the new
  hashed slot is established on the first authenticated sync from each device. Local saves are the source
  of truth (device-first + snapshot ring), so nothing is lost.
- Parent note to surface in-app: *"After this update, open Grown-Up Corner ▸ Sync on each device and enter
  your family code once; his progress uploads to the new private slot."*
- Update `cloud/README.md` + the CLAUDE.md constraint-7 note (cloud now requires the family code, not the
  bare profile id).

**Tests:** worker-level check (401 without/with wrong token, 200 with the right token) if feasible; a
save.test assertion that cloud stays inactive without a cached secret.

---

## 🧠 RESEARCH BRIEF — does our skill-ladder + review pacing fit Teddy's profile? (Trinity, 2026-06-14)

Profile: 7yo, ADHD front-and-center, possible dyslexia (assessment pending). Evidence below is from
peer-reviewed sources (PubMed) + the National Reading Panel / orthographic-mapping literature. These are
**advisory recommendations for Neo**, not bugs — each is a design proposal, ranked at the end.

### Bottom line
Our **core is right and well-evidenced** — systematic synthetic phonics, decodable-only sequencing, and
sound-mapped sight words are exactly what the strongest studies endorse for a possibly-dyslexic child.
The biggest *upside* is in **review pacing** (true spacing), **fluency** (repeated reading), and making
**phonemic awareness** explicit. Don't over-invest in "multisensory" for its own sake — the evidence
favors the phonics+PA engine, not the bells.

### What the evidence strongly endorses about what we already do ✅
- **Systematic phonics as the spine.** A meta-analysis of RCTs for children with reading disabilities found
  phonics instruction is *the only* approach with statistically confirmed efficacy on reading + spelling
  (coloured overlays, auditory training, etc. did not reach significance) — Galuschka et al. 2014, PubMed,
  [DOI](https://doi.org/10.1371/journal.pone.0089900). A Cochrane review confirms phonics training improves
  real/non-word reading accuracy + fluency and irregular-word accuracy — McArthur et al. 2018, PubMed,
  [DOI](https://doi.org/10.1002/14651858.CD009115.pub3). The NRP likewise: systematic > unsystematic phonics.
- **Sound-mapped sight words (our "Heart Word Method"), NOT whole-word shape matching.** This *is*
  orthographic mapping — bonding spellings↔pronunciations via phoneme-grapheme links, the mechanism by
  which sight vocabulary actually forms (Ehri). Our explicit choice to BUILD heart words from graphemes
  (and the absence of any "match the word shape" mechanic) is the research-aligned approach.
- **Decodability invariant** (never use an untaught grapheme; curriculum.test enforces it) = textbook
  structured-literacy fidelity.
- **No timers / no failure states / adaptive-to-weakest.** The NRP notes K–1 children respond well when
  instruction is delivered in a "vibrant, imaginative, entertaining" way — our juicy, low-threat loop is an
  asset for an ADHD learner, not a compromise.

### Evidence-based upside (proposals for Neo) 🔧
1. **Add TRUE spaced review (expanding intervals), not just weakest-weighted patrols.** The spacing effect
   (longer gaps between repetitions → better long-term retention) is one of the most robust findings in
   learning science — Kim et al. 2020, PubMed, [DOI](https://doi.org/10.1016/j.neuropsychologia.2020.107550)
   (building on Cepeda et al. 2006). Our mastery model targets *weak* items within sessions (good: retrieval
   practice + desirable difficulty) but doesn't deliberately resurface *mastered* items at **growing gaps
   across days**. Proposal: a "memory vault" that re-tests a mastered grapheme/word after 1→3→7→… day gaps.
   Highest-leverage retention upgrade.
2. **Repeated reading for fluency, with a listening-passage preview.** Meta-analysis: repeated reading
   improves fluency for students with reading disabilities, and **RR + listening passage preview is the most
   effective variant** — Lee & Yoon 2016, PubMed, [DOI](https://doi.org/10.1177/0022219415605194). We have
   sentence/cloze/maze reading but no *repeated* reading of the same passage. Proposal (also a delight idea):
   re-read a short "spell scroll" across days to "charge a power move," with the mentor reading it first
   (= the listening preview); track speed as personal-best *power*, never a timer/fail.
3. **Make phonemic awareness explicit + add articulatory cues for the child.** PA enables orthographic
   mapping; Ehri notes OM is facilitated when learners are taught the **articulatory features of phonemes**
   ("how your mouth makes the sound"). The Voice Studio already coaches articulation for the *parent* — surface
   a child-facing version: a quick oral blend/segment warm-up ("what sounds are in /s/-/a/-/t/?") + a mouth-cue
   on the learn screen. High-yield for a possibly-dyslexic reader, low art cost.
4. **Revisit the mastery threshold (tuning question).** Current gate: `str≥4 & seen≥4 & acc≥0.75`. For durable
   mastery in reading disability, the literature leans toward a higher accuracy bar (~0.8–0.9) + a little
   *overlearning* (reps beyond first success) + at least one **spaced**-correct (correct on a *later* day)
   before "mastered." `seen≥4` is thin. Tune gently so it never becomes grindy — but a spaced-correct
   requirement would make "mastered" mean *retained*, not *recently-correct*.
5. **Mind the OG/"multisensory" caveat.** An OG meta-analysis found Orton-Gillingham interventions did **not**
   reach statistical significance (positive but ns) — Stevens et al. 2021, PubMed,
   [DOI](https://doi.org/10.1177/0014402921993406). Read: keep our see/hear/trace/find structure (motivating,
   harmless, plausibly helpful), but the evidence-bearing ingredients are *systematic phonics + PA + practice
   scheduling*. Invest effort in #1–#3, not in more multisensory ornamentation.
6. **(Roadmap, lower priority) comprehension + morphology for the 2nd-grade rung.** NRP's 5 pillars include
   vocabulary + comprehension, currently light (picture-match is gist-level). Morphology (build words from
   prefixes/suffixes/bases — the "crafting tech tree" idea) breaks the phonics ceiling and is strong for
   dyslexic readers. Decoding first; queue these for Act 3 / a side-system.

### Note on dosage
Cochrane (above) couldn't pin optimal intensity/duration/group-size — so "more reps" isn't assumed better.
Our short, frequent, gentle daily loop (and the ~15/15 missions/training split) fits BOTH ADHD attention and
the spacing effect. Keep it short and frequent; let spacing (#1) do the heavy lifting, not volume.

*Sources: PubMed (DOIs above); National Reading Panel via [Reading Rockets](https://www.readingrockets.org/topics/curriculum-and-instruction/articles/findings-national-reading-panel) / [NICHD](https://www.nichd.nih.gov/publications/pubs/nrp/findings); orthographic mapping via [Reading Rockets](https://www.readingrockets.org/reading-101/reading-and-writing-basics/sight-words-and-orthographic-mapping) (Ehri 2014).*

— Trinity, 2026-06-14

---

## 📐 SPEC FOR NEO — "Memory Vault": expanding-interval spaced review (Trinity, 2026-06-14)

Implements research-brief rec #1 (the highest-leverage retention upgrade). Today `pickWeak`/`masteryReview`
target *weak* items **within** a session, but nothing brings a *mastered* item back **days later** — so
retention isn't actively protected. The Vault resurfaces mastered items on an expanding schedule.

### Data model (save-safe, additive — no migrate change needed)
`S.mastery[key]` is `{seen,ok,str}` (game.js:142). Add three OPTIONAL fields, set lazily on enrollment:
- `box` — interval index 0..4 (Leitner level)
- `due` — `dayKey()` string ("YYYY-MM-DD", state-save.js:136) the item is next due
- `last` — `dayKey()` last reviewed (telemetry/debug)

Absent = "not enrolled" → `migrate()` needs **no** change (defaults are just `undefined`; never wipes old
saves — constraint #7). Keys span graphemes (letters/digraphs/magic-e/vowel-teams) AND words (`w_<word>`,
`sw_<word>`) exactly as today, so the Vault is **act-agnostic** (mastery persists across acts).

### Constants (tune later)
`const VAULT_INTERVALS=[1,3,7,14,30], VAULT_MAXBOX=4, VAULT_CAP=6;`
(CAP = max items/session — keep it short for ADHD; overflow carries to next day, oldest-due first.)
Needs a tiny `addDays(dayKeyStr, n)` helper (parse YYYY-MM-DD, add days, reformat).

### Algorithm
- **Enroll:** first time `masteredItem(key)` flips true (hook just after the str/seen update in `record()`,
  game.js:143–146) → if `box==null`: `box=0; due=addDays(dayKey(),INTERVALS[0]); last=dayKey();`
- **Due set:** `vaultDue()` = keys where `due!=null && due<=dayKey() && masteredItem(key)`, sorted by `due`
  ascending, sliced to `VAULT_CAP`.
- **Review correct:** `box=min(MAXBOX,box+1); due=addDays(today,INTERVALS[box]); last=today;`
- **Review miss:** `box=max(0,box-1); due=addDays(today,INTERVALS[box]); last=today;` (demote one step —
  never full reset; gentler). The underlying `record(key,ok)` STILL runs so str/acc stay honest.
- **Demote out:** if a miss drops the item below `masteredItem`, clear `box/due` (leave the Vault); it
  re-enters the normal active pools (`pickWeak`) and re-enrolls when re-mastered.

### Surfacing / UX — reuse existing mechanics, build NO new task type
Route each due item by TYPE:
- **grapheme** → a `startFind` sound-ID round (target-independent prompt → anti-gaming #4 ✓).
  ⚠️ **EXCLUDE** graphemes with no `snd_` clip — the magic-e units `a_e/i_e/o_e/u_e` (ties to verified
  finding #3). Add a small `hasSoundClip(g)` guard and route those to a WORD review instead.
- **word** (`w_`/`sw_`) → a `startRead` (decode) or forge (build) round.

Present as a gentle, capped **"Memory Vault"** mini-activity — frame it as *recharging gems* (fits his
collection love + the gem motif), launchable from **Hero Base**, with a once-a-day soft nudge when items are
due (never forced). No timer, no fail; misses use the existing gentle replay+retry. ≤ `VAULT_CAP` items.

**MVP path (fast first cut):** boost `pickTrainWord` (game.js:1255) to prefer due `w_` words + feed due
graphemes into `masteryReview`/patrols → ships spacing *probabilistically* in a day. Then graduate to the
dedicated scheduled warm-up for *deterministic* intervals (the real spacing win).

### Edge cases
1. Fresh save / nothing mastered → Vault empty → hide it / "Nothing to recharge yet."
2. Nothing due today → "Vault's fully charged! ✨" and skip.
3. Backlog > CAP → oldest-due first; remainder waits (no penalty).
4. Miss demotes below mastery → leave Vault (clear box/due); rejoin active learning.
5. Clock / timezone / day-rollover → compare `due<=dayKey()` (local date string). Clock back → items wait;
   forward → more due (acceptable). Never throw on odd dates.
6. Profiles → `S.mastery` is already per-profile (keyFor) — no cross-talk.
7. Cloud → new fields ride inside `S` (newer-wins) automatically.
8. Calm/Lite/reduced-motion → reuse existing gating; content unaffected.

### Tests to add
- **save.test:** `migrate()` leaves old `{seen,ok,str}` records untouched (no box/due injected); round-trips
  with the new fields present.
- **scheduling unit check** (inject a fake `dayKey`): enroll on mastery; correct → box++ & due pushed out;
  miss → box-- & due pulled in; demote-out below mastery; `vaultDue()` returns only due+mastered, capped,
  oldest-first.
- **curriculum.test:** the Vault never routes a no-clip grapheme (magic-e) into a sound-ID task.

### Parent visibility (optional)
Progress tab: "🔋 Vault: N items, M due today" so the parent can see retention working.

— Trinity, 2026-06-14
---

## Morpheus Guest QA fresh-eyes review — 2026-06-14

> **✅ Vetted + merged by Trinity, 2026-06-14 (PR #1).** I re-checked all three against the source — **all
> accurate.** #1: `trainPool()`/build loop use `READWORDS` + `w.split("")` (game.js:1254/1267+), so the daily
> loop never drills Act-2 graphemes. #2: `FORTRESS2` phase 4 is `{kind:"read"}` → `fortRead` (game.js:875,898),
> and `fortMaze`/`fortSentencePic` hardcode Act-1 `FORTMAZE`/`SENTENCES` (947-961) — the Act-2 climax proves
> word-decode, not the sentence rung. #3: `heroMarquee()`→`teddyArt()` is live (game.js:193) but `hero-lab.html`
> renders `heroSVG()` only. **Suggested priority for Neo:** #2 (it's the 2nd-grade goal — the Act-2 finale
> should prove sentence reading like Act-1's does) > #1 (daily-loop Act-2 retention) > #3 (cheap lab/test
> hygiene). All three are enhancements, not regressions. — Trinity

Scope checked: rebased `main` onto `origin/main`, read `CLAUDE.md` / `AGENTS.md` / the live handoff + current code-review findings first, and did not re-report the existing cloud auth, reset resurrection, magic-e sound-ID, or cloud-off bugs already tracked above. Sanity checks run: `node tests/save.test.js`, `node tests/curriculum.test.js`, and `node --check` across JS/MJS all pass.

**1. Daily Training Room is still Act-1-only after the Act-2 expansion — CONFIRMED missing loop.**
Evidence: `trainPool()` only returns keys from `READWORDS` and filters them with `taughtLetters()` + `w.split("")` (`game.js:1254`). The build/decode loops also split words into individual characters and draw distractors only from `taughtLetters()` (`game.js:1267-1289`). That means the parent-recommended 15/15 daily rhythm can keep drilling CVC Act-1 words forever, but never reinforces Act-2 digraphs/blends/magic-e/vowel teams from `READWORDS2` (`data-content.js:86-92`). A quick pool swap would also be unsafe because `ship` would render as `s h i p` instead of `sh i p`; the core read path is already grapheme-aware via `toGraphemes()` / `readPool()` (`game.js:688-702`), but Training Room is not.
→ **Proposed fix:** make Training Room cumulative and grapheme-aware: include unlocked `READWORDS2` items once their graphemes/rules are taught, tokenize with `toGraphemes()`, use `graphemeSounds()` for replay, and copy the magic-e visual/audio handling from `nextRead()` so silent-e words do not become misleading build tiles. Add a focused test that a post-Act-2 save can surface `ship`/`cake`/`rain` in training and that digraph/vowel-team words render as one sound tile per grapheme.
— Morpheus, 2026-06-14

**2. Act-2 finale never reaches the sentence/comprehension proof, and the dormant proof path is Act-1-only — CONFIRMED coverage gap.**
Evidence: Dragon Keep phase 4 says "READ TO FREE MISS KENDALL!" but is configured as `{kind:"read"}` (`game.js:859-863`), and `fortRound()` dispatches `read` to `fortRead()` rather than `fortSentence()` (`game.js:883-886`). `fortRead()` is a word-picture decode round from `readPool()` (`game.js:899-909`), so the finale can end without the sentence/cloze comprehension work taught in the Act-2 Great Library. The existing sentence-proof helper is not safe to enable as-is: `fortMaze()` always samples `FORTMAZE` and `fortSentencePic()` always samples `SENTENCES` (`game.js:935-956`), while Act-2 sentence/cloze pools already exist separately (`data-content.js:51-70`).
→ **Proposed fix:** after making the proof functions act-aware, change the final `FORTRESS2` phase to `kind:"sentence"` (or add a dedicated Act-2 proof kind). Use `SENTENCES2` for picture-match and `CLOZE2` or a new `FORTMAZE2` for maze rounds, with the same audio-first `flow()` pattern and no timers/failure state. Add a curriculum guard that Act-2 finale sentence rounds only draw Act-2-decodable content and never fall back to the Act-1 `SENTENCES`/`FORTMAZE` tables.
— Morpheus, 2026-06-14

**3. Style-C / generated-Teddy verification has a harness blind spot — CONFIRMED QA risk.**
Evidence: the live game now uses `heroMarquee()` to render generated raster Teddy/knight art via `teddyArt()` for marquee moments (`game.js:187-193`, `art.js:198-209`). But `hero-lab.html` still claims it shows every in-game Style-C hero state and "what ships" (`hero-lab.html:23`), while its reusable `card()` renderer hardwires `heroSVG()` for the muscle, weapon, cape, gear, and knight rows (`hero-lab.html:51-67`). Vixen is included as generated art, but the generated Teddy/knight PNG tiers are not in this visual lab, so a missing/corrupt/wrongly framed marquee asset could pass the current human review path unless someone opens the actual title/win/rest screens.
→ **Proposed fix:** add explicit lab/contact-sheet rows for `teddyArt(150, 0/1/2, "hero")` and `teddyArt(150, 0/1/2, "knight")`, and extend the art smoke harness to assert the referenced PNG files exist for every generated tier. Keep the parametric `heroSVG()` rows too, because those still cover loadout/weapon/cape states.
— Morpheus, 2026-06-14

---

## 🎨 UI FINDINGS — Home / Title page (Trinity, 2026-06-14)

Parent-flagged, investigated against the live code + the on-device screenshot. FINDINGS (diagnosis +
direction + gotchas) — Neo owns the final design. Refs: title markup `index.html:73–81`; title CSS
`styles.css:22, 243–244, 478, 910`; title JS `game.js:330–356`.

**H1. Title font — worth elevating, but it's a brand/taste call (low urgency).**
The logo is **Bangers** (`.comic`, styles.css:22) with an 8px ink stroke + gold + glow (`.title-logo`,
styles.css:243/478). Reads fine but is a generic comic face while everything around it got more premium.
Options: (a) keep Bangers; (b) elevate the **treatment** only (richer gradient/bevel, gem accents) —
cheapest big lift; (c) a bespoke **wordmark** ("SUPER TEDDY" as a generated/SVG logo asset) — most
premium + act-agnostic.
⚠️ **Gotchas for Neo:**
- `.comic` (Bangers) is used **everywhere** (HUD/headers). Restyle the **logo only** (`.title-logo`), not
  `.comic`, or you reskin the whole app.
- **Act-swap trap:** `body[data-act="2"] .comic` already swaps `.comic`→MedievalSharp (styles.css:910). If
  `data-act=2` is set while the title shows (an Act-2 player on home), the logo font silently changes —
  brand inconsistency. Lock the logo font regardless of act.
- A **new webfont = another Google-Fonts load** (perf on old iPads + the WebKit font-CDN hang you hit in
  `shot.mjs`). A bespoke **SVG/PNG wordmark** avoids the font load and is fully controllable (pairs with
  the image-gen direction). Lean: (b) now, (c) when doing art.

**H2. Buttons — elevate them; but do NOT bake text into generated button images.**
`.btn` is a CSS gradient pill with a chunky press shadow (styles.css:25–37, 395+); `.ghost` is a bordered
transparent pill (the flat bronze CONTINUE/BASE in the shot). Rudimentary next to the painted scene.
⚠️ **Gotchas for Neo (the important one):**
- Button **text length varies** (START vs CONTINUE MISSION vs HERO BASE) and fonts are responsive
  (`clamp`). A single fixed **image button = stretched/cropped text**. Two safe ways to use image-gen:
  (1) **9-slice `border-image`** — a textured *frame* (corners+edges) that stretches to any width without
  distorting; (2) a **tileable texture** behind CSS text. **Never** a text-baked PNG per label.
- Lowest-risk big win is **CSS-premium** (bevel, inner/outer shadow, subtle texture/noise, gem/rivet
  corner accents) — text-agnostic, no asset load, scales.
- `.btn` restyle **propagates to every screen** — regression-check all buttons, not just the title.
- Keep **touch targets ≥96px** (constraint #6) + high contrast; keep the `:active` press feedback; make
  the **Lite/Calm detail tier flatten** heavy button filters for old iPads.
- **Per-act skin:** Act-2 chrome is parchment/stone (`body[data-act="2"]`) — plan a stone/bronze button
  variant. Keep using CSS **tokens** (`--gold/--ink/--txt`), never raw hex (STYLE.md).

**H3. Subtitle — replace the Act-1-specific line (already on the CLAUDE.md backlog).**
`index.html:75` is static **"THE POWER GEMS OF STAR FORCE CITY"** — Act-1 only; Act 2 is the Magic
Kingdom. Routes: (a) a **generic, timeless brand tagline** (act-agnostic, set once) — recommended; (b)
**per-act swap**. Draft taglines (a): *"WHERE WORDS GIVE YOU SUPERPOWERS" · "READ. POWER UP. BE A HERO." ·
"SUPER TEDDY'S READING ADVENTURE."*
⚠️ **Gotchas for Neo:**
- The subtitle is **static HTML rendered at boot**. For per-act (b), set it in `paintTitle()` (runs on
  boot + profile switch) from `currentAct()`/`ACTS[].city` — don't leave the hardcoded string.
- Per-act begs "**which act on the landing?**" → the active profile's `S.act` (new player = Act 1). The
  city is **already shown on the map HUD chip**, so a generic tagline up top (city flavor on the map) is
  cleaner and skips the boot-timing branch. Lean (a).

**H4. START vs CONTINUE — collapse to one PLAY (the meaty one).**
Confirmed redundant: for any returning player (`S.intro` true), **both `btnStart` and `btnContinue` just
call `toMap()`** (game.js:341–342). `btnStart` only differs for a *brand-new* player (it runs
`startIntro()` → origin cutscene → scan tutorial). "Continue **Mission**" is also a **misnomer** — it
resumes nothing (`CUR` isn't persisted across reloads); it just opens the map.
**Direction:** one **PLAY** button that branches internally on save state.
⚠️ **Gotchas / nuances for Neo (incl. easy-to-miss ones):**
- **Don't lose first-run onboarding:** PLAY must still do `if(!S.intro) startIntro()` (origin + scan) for
  new players; returning → hub/map. That branch is the whole reason START/CONTINUE existed.
- **The map is ALREADY the hub.** `toMap()` lands a returning player on their **current zone's next undone
  mission** (curZoneIx/zoneNext) — it already "continues" correctly — and the **HUD nav chip** (World Map /
  Hero Base / Home) + the parent-gated gear are on every non-title screen. So the cheapest faithful version
  of your idea is **PLAY → map**, reusing the HUD for base/settings.
- A **dedicated hub screen** matches your mental model but **adds a tap to content** — for an ADHD 7yo,
  fewer taps to reading is better, and it **duplicates** the HUD nav. If you want the explicit hub, make it
  *fast* (big art tiles) and don't bury Play.
- **Settings stays parent-gated** (3s hold on the gear). A kid-facing hub must NOT expose Settings as a
  normal button, or the child wanders into parent controls.
- **Profile switch** (`btnPlayer`, shown only with >1 profile — game.js:333) and the **title Hero Base
  shortcut** (`btnTitleBase`, which you've said you don't love) both need a home in the new flow — the
  restructure is the chance to resolve where they live.
- A **true "resume my exact mission"** would be a *new* feature (persist last zone/mission to `S`) — out of
  scope for the relabel, but noted since "Continue" implies it.

— Trinity, 2026-06-14

---

## 🎨 UI FINDINGS — Intro / Calibration / Map (Trinity, 2026-06-14)

Continues the parent UI walkthrough (screenshot = the Act-1 map). FINDINGS format. Refs: intro
`index.html:91–95` + `game.js:392–406`; panel CSS `styles.css:230`; scan `game.js:454–474`; map hero
`map.js:64`, `heroNow`/`heroMarquee` `game.js:187/193`, `teddyArt` `art.js:198–210`.

**I1. Intro cutscene — kill the "boxy box" + go full-bleed / generated.**
The "weird box" is `.panelart` (styles.css:230): a gold-bordered, blurred, semi-transparent **rectangle**
framing the cutscene art — it fights the full-bleed painted aesthetic. The art inside is mostly **old inline
SVG** per beat (`INTRO[].art`, game.js:392); only the final origin panel + the knight reveal already use the
generated `teddyArt`. Direction: drop the boxed frame, let cutscene art go **full-bleed** (comic/storybook),
move panels to **generated raster**.
⚠️ **Gotchas for Neo:**
- `.panelart` is **shared** by the intro AND the Act-1→Act-2 **interlude** (`#interArt`, index.html:99), and the
  beat hooks (`faceSpeak` bobs `#introArt`; `cutsceneFX` letterbox/flash/shake). Any rework must keep those +
  the narration **bubble** and the **⏭ skip / Home** (constraint #8 — flows can never hang).
- Full-bleed needs a scrim/gradient so the **bubble + controls stay legible** over busy art.
- This is effectively the **"storybook cutscenes" backlog (D)** you were wary of — but the render loop +
  generated art are landing well now, so it's a better moment. Suggest **one beat as a pilot** before committing
  the whole sequence.

**I2. Calibration (Scan) — plain text tiles, dated vs the premium look.**
The first-run calibration (`startScan`/`nextScan`, game.js:454–474) renders options as plain
`<button class="tile read">` showing the **letter as text**, not the premium **gem** visuals (`gemSVG`) used on
the Base shelf. Functionally fine (anti-gaming-safe — the prompt is audio-only), but it's the weakest-looking
screen in the most important first-30-seconds.
⚠️ **Gotchas for Neo:**
- It's a **sound→letter** task: the tiles legitimately SHOW letters (they're the options) — just upgrade the
  **tile chrome** (gem treatment), keeping the glyph in **Andika** + high contrast (constraints #4/#6). Don't
  turn it into a text→text match.
- Gated by `S.scan`; don't break the first-run flow (intro→scan→map) or the Grown-Up level-override that sets
  `S.scan`.

**M1. Map hero is the OLD SVG (not `teddyArt`) — inconsistent + awkwardly perched on the node disc.**
`map.js:64` draws the current-zone hero via `heroNow(250)` = **`heroSVG`** (old parametric SVG), while
title/win/rest/intro now use the generated **`teddyArt`** (`heroMarquee`, game.js:193). So the map shows a
different, older Teddy, scaled `.26` and offset onto the big glowing **node disc** → "standing on a circle."
⚠️ **Gotchas for Neo (not a 1-line swap):**
- **Coordinate-space mismatch:** the `.26` scale + `(x-30, y-150)` offset were tuned for `heroSVG`'s viewBox
  (`-30 -150 310 660`). `teddyArt`'s viewBox is `0 0 240 256` wrapping a raster `<image href="art/teddy-m*.png">`
  (art.js:198–210). Naively swapping mis-scales/mis-positions. Either (a) inline `teddyArt` and **re-tune**
  scale/offset for 240×256, or (b) cleaner: **overlay the hero as an absolutely-positioned HTML element**
  (`heroMarquee`) above the map, tracking the current node's screen position — decouples it from the SVG math
  and renders the raster crisply.
- **Placement:** centered on the glowing disc looks off. Give the current zone a **pedestal/platform** to stand
  ON, or place him **beside/in front** with feet at the node base.
- **Consistency knock-on:** freed-friend tokens (`allyMapFig`, SVG) stay vector — a raster hero next to vector
  allies may look mixed. Decide: allies also get raster, or the hero stays a dedicated **small painted Teddy map
  token** for cohesion.

**M2. Map nodes + zone labels — the "big circle" + flat pills (ties to button finding H2).**
The current node is a generic glowing **gold circle** (`map.js:49–63`); zone labels are flat dark/gold pills —
both read as plain UI stamped on a painted world. Direction: make nodes **diegetic** (a painted landmark/platform
per zone) and labels feel like in-world signage — same "premium chrome" language as the home-page buttons (H2).
⚠️ **Gotcha:** node state (done ✓ / current pulse / locked 🔒) must stay **instantly readable** — it's the core
"where do I go" affordance + the lock gate; don't let diegetic art bury the state cue.

— Trinity, 2026-06-14

---

## 🖼️ UI GLOW-UP AUDIT — end-to-end (Trinity, 2026-06-14)

Parent asked for a full sweep: find everywhere **old SVG** characters or **plain CSS** lag the new premium
look. Below is what I can determine from the source; the rendered-per-screen eyeball is **Neo's to run on the
desktop** (instructions at the end). This is the master inventory — the per-character build pattern is in the
companion SPEC below.

### A. Character-art inventory (generated raster ✅ vs OLD SVG ❌)
| Character | Renderer | Raster? | Appears on |
|---|---|---|---|
| **Teddy** (hero/knight, m0–2) | `teddyArt` | ✅ `teddy-m*/teddy-knight-m*.png` | title, win, rest, intro origin + knight reveal (via `heroMarquee`) |
| **Teddy on the MAP** | `heroNow`→`heroSVG` | ❌ old SVG | map current node (M1) |
| **Teddy in Hero Base** | `heroNow`→`heroSVG` | ❌ old SVG | Base hero/loadout (game.js:1131) — *see nuance ‡* |
| **Teddy in interlude / player-picker** | `heroNow`/`heroSVG` | ❌ old SVG | interlude noah3+end (435/447), picker cards (349) |
| **Lord Vex / Vex Captain** | `inkblotSVG` | ❌ old SVG | intro panel2, boss battle, fortress, 2 boss cages |
| **Dragon / wyrms (×4)** | `dragonSVG` | ❌ old SVG | Act-2 boss battle, fortress, 4 boss cages |
| **The Vixen** | `vixenSVG` | ✅ `vixen.png` | interlude3, boss cage |
| **Noah the Red** | `noahSVG` | ❌ old SVG | Act-2 intro (noah1/2/3) |
| **Allies — faces** | `allyFace` | ❌ old SVG | win pop, hero-card mini, league shelf, `allyPop` |
| **Allies — full body** | `allyBody` (ellie/amelia/leighton/archie) | ❌ old SVG | hero card art (hcArt) |
| **Allies — map tokens** | `allyMapFig` | ❌ old SVG | freed friends on the map |
| **Captives / Portal / City** | `captiveSVG`/`portalSVG`/`citySVG` | ❌ old SVG | interlude + intro panel1 |

**So: Teddy + Vixen are raster; everyone else is old SVG — and Teddy himself is INCONSISTENT** (raster on
title/win/rest via `heroMarquee`, but old SVG on map/Base/picker/interlude via `heroNow`). That split is the
most visible "old art" problem.

> **‡ CRITICAL nuance (don't let Neo over-swap):** the parametric `heroSVG` MUST stay where the **equipped
> weapon + cape + gear** are previewed — i.e. the **Hero Base loadout** — because the generated raster is a
> FIXED pose with no weapon/cape variants. Raster is for **fixed marquee poses + the map**; parametric SVG
> stays for the loadout. (On the map, weapon/cape aren't really read anyway, so raster is fine there.)

### B. Plain/simple UI lagging the premium look (cross-refs to the findings above)
- **Buttons** (`.btn`/`.ghost`) — flat pills (finding **H2**); everywhere.
- **Scan calibration tiles** — plain text buttons (finding **I2**).
- **Intro `.panelart`** — boxy gold frame around old SVG (finding **I1**).
- **Map nodes + zone labels** — generic glowing circle + flat pills (finding **M2**).
- Worth Neo eyeballing for the same "plain vs painted" gap: **mission/learn tiles** (`.tile`), **forge/read
  slots**, **boss HP bar**, **Progress + Grown-Up Corner chrome**, **Training Room / Shop cards**, **hero-card
  flip**, **boss-cage bars**. (I can't see these rendered — see C.)

### C. Instructions for Neo (he has the desktop + can SEE every screen)
1. **Extend `tools/shot.mjs`** — the `SCENES` map only covers title/map/base/settings. Add scenes that drive
   the game's own fns to reach every screen: a `scrIntro` beat (`startIntro()` then `paintIntro`), `scrScan`
   (`startScan()`), a learn screen (`startLearn(MISSIONS.find(m=>m.type==='learn'))`), `scrForge`/`scrRead`,
   `scrFortress`/`scrBoss`, `scrWin` (`showWin(...)`), `scrRest`, a hero card (`openHeroCard('flip')`), a boss
   cage (`openBossCage(...)`), the Training Room + Shop, and the Grown-Up tabs. Shoot Chromium **and** `--webkit`.
2. **Eyeball each shot against the premium bar** and tag: (a) any **old-SVG character** (per table A), (b) any
   **plain CSS** that reads as "stamped UI" on the painted world, (c) contrast/touch/layout issues. Append a
   short per-screen verdict to `QA.md` (your screenshots, your call as Lead Coder).
3. **Generated-art rollout order (most-seen first):** map Teddy (M1) → **Vex + Dragon** (boss battles + cages,
   high screen time) → **Noah** (Act-2 onboarding) → **allies** (faces + bodies + map tokens) → interlude bits
   (captive/portal/city). Prompts already live in `art/CHARACTER-ART-PROMPTS.md` + `art/PROMPTS-chatgpt.md`.
4. **Author every character PNG on a UNIFORM canvas** (so swaps are mechanical, like `teddyArt`'s 224-in-240×256):
   same square canvas, transparent bg, character centered, **feet on a consistent baseline**, consistent headroom.
   This lets the resolver in the SPEC below wrap any character identically.

— Trinity, 2026-06-14

---

## 📐 SPEC FOR NEO — Character-art resolver + map-hero (M1) + full rollout (Trinity, 2026-06-14)

Goal: one mechanism so **generated raster replaces the old SVG per-character, incrementally**, everywhere a
character renders — with a clean fallback so half-finished rollout never breaks a screen. Plus the concrete
M1 map-hero fix. (`teddyArt`/`vixenSVG` are already the raster pattern; this generalizes them.)

### 1. The resolver (art.js)
A published-asset **manifest** + a uniform raster wrapper + a per-character resolver:
```js
// flip a flag the MOMENT its PNG lands in art/ (uniform canvas — see audit §C.4)
const RASTER = { teddy:true, vixen:true, vex:false, dragon:false, noah:false,
                 ellie:false, amelia:false, leighton:false, archie:false, kendall:false,
                 captive:false, portal:false };
// any character PNG authored on the standard canvas wraps identically (aura+shadow+float)
function rasterArt(file, w, a0="#ffce3a", a1="#3a7bff"){ /* == teddyArt body, href art/${file}.png */ }
// resolver: raster if published, else the EXISTING svg fn (so nothing breaks mid-rollout)
function charArt(kind, w, o={}){ switch(kind){
  case "teddy":  return RASTER.teddy  ? rasterArt((o.theme==="knight"?"teddy-knight":"teddy")+"-m"+(o.muscle||0), w, ...) : heroSVG(w,o);
  case "vex":    return RASTER.vex    ? rasterArt("vex",w,"#ff5a3a","#c01020")    : inkblotSVG(w);
  case "dragon": return RASTER.dragon ? rasterArt("dragon",w,"#ff6a2a","#c0301a") : dragonSVG(w);
  case "noah":   return RASTER.noah   ? rasterArt("noah",w,"#ffd75e","#7bd08a")   : noahSVG(w);
  /* allies: rasterArt("ally-"+kind,...) else allyBody(kind,w) / allyFace(kind) */ }}
```
**Manifest, not `onerror`:** a static site can't sync-check file existence, and an `<img onerror>` fallback
flickers. The explicit `RASTER` flag is the clean switch — Neo flips one boolean per character.

### 2. Wire the call sites to `charArt`
Replace, so each flips automatically when its flag turns true:
- `bossSprite()` (game.js:663) + the 7 boss-cage `art:` fns (1225–1231) → `charArt("vex"/"dragon"/"vixen",w)`.
- Intro `noahSVG`/`inkblotSVG`/`citySVG`/`captiveSVG`/`portalSVG` → `charArt(...)`.
- Allies: `allyBody`(hero cards), `allyFace`(pops/shelf), `allyMapFig`(map tokens) → `charArt("ally-"+kind,...)`.
- **Teddy:** `heroNow` everywhere EXCEPT the Base loadout → `charArt("teddy",w,heroOpts())`.

> ⚠️ **KEEP parametric `heroSVG` for the Hero Base loadout** (it must show the equipped **weapon/cape/gear** —
> raster is a fixed pose). Raster Teddy is for fixed marquee + the map only. (Audit nuance ‡.)

### 3. The M1 map-hero fix (the one with the gotcha)
`map.js:64` inlines `heroNow(250)` (old `heroSVG`, viewBox `-30 -150 310 660`) at `scale(.26)`,
`(x-30,y-150)` — perched on the node disc. Two routes:
- **Route A (inline):** keep the hero inside the map SVG but switch to `charArt("teddy",…)`. The raster
  `<image>` renders inside SVG fine, BUT re-tune for the **240×256** viewBox: pick a target on-map height H,
  `scale = H/256`, and translate so the **feet** (image bottom ≈ y226) sit at the **node base** (x, y),
  not the disc center. Simpler diff; raster is rasterized at the map's scale.
- **Route B (overlay, recommended for crispness):** render `charArt("teddy",…)` as an absolutely-positioned
  HTML element over `#mapSVGwrap`. Map the node's viewBox coords (ZONESPOTS 1000×750) → screen px via
  `#mapSVGwrap.getBoundingClientRect()` ratios; place the hero there (feet at node), reposition on `resize`.
  Decouples from SVG math, renders the PNG at native sharpness. (Same system then serves map allies.)
- **Placement either way:** give the **current** node a small **pedestal/platform** to stand on, or seat the
  feet at the node base — don't center him on the glowing disc.

### 4. Map allies + everyone else, same path
`allyMapFig` (map.js:36, `scale(.5)`) gets the identical treatment via `charArt("ally-"+kind,…)` once ally
PNGs exist — until then the resolver returns the SVG, so the map keeps working. Pick **one** map approach
(A or B) and use it for hero AND allies so they don't render in two different pipelines.

### 5. Edge cases / gotchas
- **Uniform canvas is load-bearing:** every character PNG MUST share the canvas/baseline (audit §C.4) or the
  `rasterArt` wrapper mis-frames it. Author to spec; verify in `hero-lab.html`.
- **Reduced-motion / Calm / Lite:** keep `.rfloat`/aura gating exactly as `teddyArt` does.
- **Act-theming already flows:** `bossSprite` picks vex(Act1)/dragon(Act2); `theme` picks hero/knight — keep.
- **Muscle tiers:** pass `heroOpts().muscle` so the map shows the right power tier (raster has m0–2).
- **Cage sprites** are shrunken behind bars — raster needs a **transparent bg** so the bars read.
- **Don't raster the Base loadout** (repeat, because it's the easy mistake).

### 6. Tests / harness (also closes Morpheus #3)
- Extend `tools/svg-shot.mjs --cast` + `hero-lab.html` to render the **raster tiers** (`teddyArt`/`charArt`),
  not just `heroSVG`.
- Add a node smoke check: for every `RASTER[k]===true`, assert `art/<file>.png` exists (per tier); and that
  `charArt(k)` returns an `<svg>` for every kind (raster or fallback).

### 7. Rollout order (most-seen first)
map Teddy (M1 — raster already exists, just wire it) → **Vex + Dragon** (boss/cages) → **Noah** → **allies**
(faces+bodies+map tokens) → interlude (captive/portal/city). Each = generate PNG on the uniform canvas → flip
`RASTER.<kind>=true` → it upgrades everywhere `charArt` is wired.

— Trinity, 2026-06-14

---

## 🎨 UI FINDINGS — Hero Base (Trinity, 2026-06-14)

Refs: markup `index.html:116–160`; CSS `styles.css:308–347, 817–847`; `paintBase` `game.js:1131+`.
Good news: the **basecards** (gradient panels + Baloo headers, styles.css:845) already match the premium
settings style — Base *chrome* is in decent shape. The gaps are characters + buttons, plus one tension:

**B1. The Base hero is the parametric `heroSVG` — and it *must* stay that way, so it'll read "lesser"
than raster Teddy.** `baseHero` = `heroNow` (game.js:1131) = old `heroSVG`, because the Base **previews the
equipped weapon/cape/gear** (the raster has no weapon/cape variants — audit nuance ‡). So title/win show the
gorgeous raster Teddy, but the Base permanently shows the flat parametric one — a jarring quality drop on the
hub screen. **Mitigations:** (a) accept it; (b) **give `heroSVG` a shading pass** (like the dragon got — form
shadow/rim light) so the parametric hero isn't jarring next to raster, and every parametric use benefits;
(c) split the Base into a **raster "hero portrait"** up top + a small parametric **"fitting-room" preview**
shown only while editing the loadout. My lean: **(b) now** (cheap, helps everywhere), consider (c) if the gap
still bugs you.
**B2 (cross-ref):** the **league / captured-villain shelves** render old-SVG characters (`allyFace`,
`inkblotSVG`/`dragonSVG`; Vixen already raster) — fixed by the character-art resolver rollout above.
**B3 (cross-ref):** loadout **`.echip`** chips + the **TRAINING/SHOP/MAP** buttons are the same flat pills as
finding **H2** — solve with one button language.

— Trinity, 2026-06-14

---

## 🗂️ UI GLOW-UP — PRIORITIZED PUNCH-LIST for Neo (Trinity, 2026-06-14)

Synthesizes today's findings (home H1–4, intro/calibration I1–2, map M1–2, Base B1, the audit, the
character-art SPEC) into a sequence. Rule of thumb: **do the quick wins + build the resolver first, then run
the art-gen and premium-chrome tracks in parallel.**

### Phase 1 — Quick wins (low-risk, high-impact, no new art)
| Item | What | Why first |
|---|---|---|
| **H3** | Subtitle → generic tagline | One-line change; kills the Act-1-only text |
| **H4** | Collapse START+CONTINUE → one **PLAY** (→ map; keep first-run intro branch) | Both already call `toMap()`; clarifies the whole entry |
| **M1 (wire only)** | Point the **map** hero at the existing `teddyArt` (raster already exists) + fix placement | Removes the most-seen "old Teddy on a circle" |
| **B1(b)** | Shading pass on parametric `heroSVG` | Lifts the Base hero + every parametric use at once |

### Phase 2 — Foundation (unlocks everything else)
- **Build the character-art resolver** (`RASTER` manifest + `charArt()` + uniform canvas) and **wire the call
  sites** (SPEC above). Ship it with `teddy`+`vixen` already true — no visible change yet, but every future
  character becomes a one-boolean drop-in. Decide the **map approach (inline vs overlay)** here and use it for
  hero + allies.

### Phase 3 — Art-gen track (parallel; needs the desktop gen pipeline)
Generate on the **uniform canvas**, then flip the `RASTER` flag. Order by screen-time:
**Vex → Dragon** (boss battles + cages) → **Noah** (Act-2 onboarding) → **allies** (faces+bodies+map tokens)
→ interlude (captive/portal/city). Each auto-upgrades everywhere `charArt` is wired. *(Extend `hero-lab` +
the smoke test per the SPEC / Morpheus #3.)*

### Phase 4 — Premium chrome track (parallel; mostly CSS, some art)
| Item | What | Note |
|---|---|---|
| **H2** | Premium buttons (`.btn`/`.echip`) | **CSS-premium first** (bevel/texture/accents); 9-slice `border-image` if using gen art — never text-baked. Propagates to every screen. |
| **M2** | Diegetic map nodes + signage labels | Same button language as H2; keep done/current/locked state readable |
| **I2** | Scan-calibration tiles → gem chrome | Keep Andika + sound→letter |
| **I1** | Intro: drop the boxy `.panelart`, full-bleed + generated art | Biggest lift; **pilot one beat**; shared with the interlude; keep faceSpeak/cutsceneFX/skip |
| **H1** | Title logo treatment / bespoke wordmark | Lowest urgency; watch the `.comic` act-swap + webfont traps |

### Dependencies / sequencing notes
- **Phase 2 (resolver) should precede Phase 3** so art lands as drop-ins, not bespoke wiring per character.
- **H2 (button language) precedes M2** (map labels reuse it) and overlaps B3 (Base chips) — design the button
  system once, apply everywhere.
- Phase 1 items are independent — Neo can ship them immediately for a fast visible win while the resolver +
  art-gen spin up.
- Every phase: tests green (`save`+`curriculum`), constraints intact (≥96px touch, Andika, no
  timers/failure, audio can't hang), Lite/Calm tiers flatten heavy effects.

— Trinity, 2026-06-14

---

## 📐 SPEC FOR NEO — Title: collapse START + CONTINUE into one PLAY (H4) (Trinity, 2026-06-14)

Phase-1 quick win. Refs: title markup `index.html:73–81`; handlers `game.js:330–356`, `btnTitleBase` `:492`.

### The design call (make it explicitly, with the parent)
The parent's ask was "one PLAY → a launch page with options (map, hero base, settings)." **Recommendation:
PLAY → the MAP, do NOT build a separate hub screen.** Reasoning (the gotcha worth surfacing):
- The **map already IS the hub** — the HUD nav chip (World Map / Hero Base / Home, index.html:58–62) + the
  parent-gated gear are on every non-title screen, and `toMap()` already drops a returning player on their
  **current zone's next undone mission** (auto-resume).
- A dedicated hub screen would **add a tap to content** (Title → Hub → Map) — worse for an ADHD 7yo — and
  **duplicate** the HUD. So PLAY→map delivers the parent's goal (map/base/settings all reachable) with *fewer*
  taps, not more. If the parent still wants an explicit hub after seeing this, spec variant at the end.

### New title = brand + ONE primary action
Landing shows: logo + tagline (H3) + hero, then:
- **One big `PLAY` button** (`.btn`, ≥96px) — replaces both START and CONTINUE.
- **"<name> — switch"** (`btnPlayer`) stays, shown only when `profiles().length>1` (game.js:333) — it's a
  legit pre-play choice (who's playing).
- **Remove the title `HERO BASE` shortcut** (`btnTitleBase`) you don't love — Base is one tap away via the
  map HUD. (Or keep as a tiny secondary; default: remove, declutter the landing.)

### PLAY logic (it's literally today's `btnStart`, minus the CONTINUE duplicate)
```js
$("btnPlay").onclick = ()=>{ Aud.pick();                       // FIRST user gesture — unlocks iOS audio (keep!)
  if(!S.intro) startIntro();                                   // brand-new player → origin cutscene → scan → map
  else { Aud.play("welcome"); toMap(); } };                    // returning → resume on the map
```
- **Delete `btnContinue`** (HTML + its `paintTitle` show/hide at game.js:332). It only ever called
  `toMap()` — identical to START for any returning player.
- `paintTitle` keeps the `playerName` + the `btnPlayer` visibility line; drop the `btnContinue` line.

### Edge cases / gotchas
- **Don't lose first-run onboarding:** the `if(!S.intro) startIntro()` branch IS the reason two buttons
  existed — keep it. Verify: fresh save → PLAY → intro→scan→map; returning save → PLAY → map.
- **iOS audio unlock:** PLAY must stay the first user gesture (`Aud.pick()`), or narration won't start on
  iPad. Don't move audio init off the button.
- **Empty/under-construction act:** `toMap()` already guards (`actComingSoon()`); no change.
- **Settings stays off the landing on purpose** — it's parent-gated via the map HUD gear (3s hold). A
  kid-facing landing should NOT expose Settings. (If the parent wants settings access *without* playing, the
  only options are: keep the current "must enter to reach the gear," or add a parent-gated gear to the title
  too — adds a control to the clean landing; default: leave off.)
- **Level-override / reset** paths (game.js:1429, 1465) already route through `show("scrTitle")` + `paintTitle`
  — they keep working since PLAY reads live `S.intro`.
- **Label & feel:** "PLAY" (parent's word), primary `.btn`; this pairs naturally with the H2 button glow-up
  and the H3 subtitle (same screen — ship them together for one clean landing).

### Verify (no unit test — it's DOM wiring)
Manual: (1) fresh profile → PLAY → intro plays; (2) returning profile → PLAY → map at next mission;
(3) audio starts on the first iPad tap; (4) `>1` profile shows the switch; (5) Base reachable via the map HUD.
Add a `scrTitle` + a post-PLAY `scrMap` shot to `tools/shot.mjs` for the before/after.

### If the parent insists on an explicit hub (variant)
Add a `scrHub` screen with 3 big art tiles (World Map / Hero Base / Settings-parent-gated) shown after PLAY;
`toMap()`/`showBase()` wire to the tiles. Cost: +1 tap to play, and keep it from burying the Map tile. Not
recommended over PLAY→map, but low-risk if desired.

— Trinity, 2026-06-14

---

## 🎨 UI FINDINGS — World Map revamp (Trinity, 2026-06-14)

Parent: the map is busy/overstimulating, the path is slightly misaligned, and it wants a "legend"/control
cluster. Refs: `map.js:39–100` (mapPaintSVG), `ZONESPOTS` `map.js:17–20`, `mapFriends` `:26`, bg
`art/bg-map*.jpeg`, nav HUD `index.html:55–67`.

**MR1. Overstimulation = no visual hierarchy (not "too much energy").**
> 🖥️ **Confirmed on a real-screen cloud screenshot (Trinity, 2026-06-14):** on the actual map, the **zone-name
> labels are nearly ILLEGIBLE** — low-contrast grey text on the vivid painting (a real constraint-#6 high-contrast
> failure, not just aesthetics). So MR1's "push the painting back" should explicitly include **label legibility**:
> a solid/darker pill behind each label + higher-contrast text. (MAP-1 verified fixed — raster Teddy stands at the
> node; the path/nodes read OK.)

The painted bg is already very high-contrast/saturated, and EVERY node carries a blurred bloom (`obloom`,
`#mglow`) + specular highlights, all at similar brightness — ~70+ bright elements + friend figures + hero +
portal over a loud painting. Nothing says "go HERE next." Direction:
- **Make the CURRENT node dominate** (bigger bloom/pulse, an arrow or "▶" beacon), **DONE** nodes quiet (small
  ✓, low glow, slightly desaturated), **LOCKED** nodes muted. Drop the per-node specular highlights on
  non-current nodes.
- **Push the painting back** — a subtle scrim/vignette (or a calmer map painting) so nodes/labels/controls
  pop as foreground.
⚠️ **Gotchas:** Constraint #3 says loud is fine (no photosensitivity) — so the goal is **hierarchy +
legibility of the "where do I go" affordance**, NOT blanket de-juicing; keep the reward energy elsewhere. The
done/current/locked state is the core nav + lock-gate cue — don't let calming bury it. Extend **Lite** to
flatten the map blooms (the pulse already gates on reduced-motion).

**MR2. Path alignment — the trail is BAKED INTO the painting; only the node coords can move.**
The golden path lives in `bg-map.jpeg`; nodes are hand-eyeballed `ZONESPOTS` (1000×750) placed on it. "Off" =
the coords drifted. Fix: **recalibrate `ZONESPOTS`** per zone (Neo: overlay nodes on the bg via `shot.mjs`,
nudge each coord), OR regenerate a **cleaner map bg with a clearer path** then recalibrate.
⚠️ **Gotcha:** SVG can't "straighten" the path (it's art) — only node positions or a new bg image. A new bg =
redo `ZONESPOTS` **for that act** (and re-check the portal `PX/PY` + `mapFriends` offsets). Do Act 1 + Act 2
separately.

**MR3. Legend / control cluster — replace the buried dropdown.**
Today nav = the HUD **city-chip dropdown** (World Map / Hero Base / Home, index.html:58–62) + the parent-gated
gear. Parent wants always-visible controls on the map. Direction: a compact, always-visible **control panel**
(corner) — Home, Hero Base/"Hero Den", and the parent-gated gear — plus optionally a tiny **key** (▶ current /
✓ done / 🔒 locked) for the parent.
⚠️ **Gotchas:** (a) **pick ONE nav surface** — don't run the cluster AND the dropdown (confusing/duplicated);
decide whether this replaces the HUD dropdown or generalizes to it across screens. (b) **Settings stays
parent-gated** (3s hold). (c) Place it in a **corner clear of painted landmarks** (parent noted painted objects
overlap controls) — anchor to the screen, not the 1000×750 SVG. (d) Touch targets ≥96px, high contrast.

— Trinity, 2026-06-14

---

## 📐 SPEC FOR NEO — M1 map-hero raster (focused Phase-1 wire) (Trinity, 2026-06-14)

The standalone quick win (raster already exists; the full `charArt` resolver in the earlier SPEC generalizes
this in Phase 2). Goal: replace the old `heroSVG` on the map with the existing `teddyArt`, correctly placed.

**Today** (`map.js:64`): `hero = heroNow(250)` (= `heroSVG`, viewBox `-30 -150 310 660`), stripped of its
`<svg>` tags and inlined at `scale(.26)`, `translate(x-30, y-150)` — perched on the node disc.

**Change — pick ONE route (align with the MR revamp):**
- **Route A (inline, smallest diff):** build `teddyArt(250, heroOpts().muscle, heroOpts().theme)`, strip its
  `<svg>` wrapper, inline into the map `<g>`, and **re-tune** for the `240×256` viewBox: choose an on-map
  height H, `scale = H/256`, and translate so the **feet** (image bottom ≈ y226 in art space) sit at the
  **node base** `(x, y)`, not the disc center. (Inlining teddyArt's `<style>`/`<image href>` inside the map
  SVG is fine — the relative href resolves against the page.)
- **Route B (overlay, crisper — recommended):** render `heroMarquee(H)` (or `charArt("teddy",…)` post-resolver)
  as an **absolutely-positioned HTML element** over `#mapSVGwrap`, placed at the current node's **screen**
  coords (map viewBox 1000×750 → px via `#mapSVGwrap.getBoundingClientRect()` ratios), feet at the node;
  reposition on `resize`. Renders the PNG at native sharpness and decouples from the SVG scale. Use the SAME
  system for `mapFriends` later so hero+allies share one pipeline.

**Placement:** feet at the node base; if MR1 adds a **pedestal** to the current node, stand him on it.
**Keep:** muscle tier (`heroOpts().muscle`), theme hero/knight, the float/aura (already reduced-motion gated).
⚠️ **Gotchas:**
- **Don't touch the Base hero** (stays parametric `heroSVG` for the weapon/cape loadout preview — audit ‡).
- **Trade-off:** raster Teddy on the map won't show the equipped **weapon/cape** the old `heroSVG` did —
  acceptable (weapon reads in the Base), but note it for the parent.
- When the **resolver** lands (Phase 2), swap `teddyArt(…)` → `charArt("teddy",…)` and apply the chosen map
  route to allies too — keep hero + allies in ONE pipeline (don't end up with the hero overlaid in HTML but
  allies inline in SVG).
**Verify:** `shot.mjs` map scene before/after at a couple of screen sizes; confirm feet sit on the node and the
right muscle tier/theme shows.

— Trinity, 2026-06-14

---

## 🗺️ MAP REWORK PACKET — sequenced for Neo (Trinity, 2026-06-14)

One ordered plan combining **MR1** (hierarchy/overstimulation), **MR2** (path alignment), **MR3** (controls)
and **M1** (hero raster). Full reasoning + gotchas are in those entries above — this is the *do-this-order*.

### Decide two forks FIRST (they gate the work)
- **F1 — the busy background:** *scrim the existing `bg-map.jpeg`* (cheap, keep coords) **vs** *regenerate a
  calmer map painting with a clearer path* (heavier; forces re-calibration). **Start with scrim+hierarchy;**
  only regenerate if that's not enough.
- **F2 — the nav surface:** the new control cluster **replaces** the HUD city-chip dropdown **vs** *generalizes
  to* the HUD across all screens. Pick one — never run both.

### Sequence
| # | Task | Type | Dep | Impact |
|---|---|---|---|---|
| 1 | **MR1 hierarchy** — current node dominates (beacon/pulse); done/locked quieter + desaturated; drop non-current specular; add a **scrim/vignette** over the bg | CSS + `map.js` node markup | F1 | ★★★ biggest perceived fix |
| 2 | **M1 hero raster** — wire existing `teddyArt` onto the map, **feet at node base** (route A inline-retune or B overlay) | `map.js` JS | after 1 (final node look) | ★★★ kills "old Teddy on a circle" |
| 3 | **MR3 control cluster** — always-visible Home / Hero Den / parent-gated gear in a screen corner (+ optional state key) | HTML/CSS + wire to `toMap`/`showBase`/gear | F2 | ★★ |
| 4 | **MR2 recalibrate `ZONESPOTS`** — nudge each zone coord onto the painted path, **per act**, via `shot.mjs` overlay | data (`map.js:17–20`) | after 1 (and after any bg regen) | ★★ |
| 5 | *(optional)* **regenerate a calmer map bg** + current-node **pedestal** art, then redo step 4 | art-gen | only if F1=regenerate | ★ |

### Why this order
- **MR1 before MR2/M1:** calibrate coords + place the hero against the *final* node design, not a placeholder
  (don't do the eyeball calibration twice).
- **A new bg (step 5) forces redoing `ZONESPOTS`** — so if you'll regenerate, do it *before* step 4, never after.
- **MR3 is independent** of 1/2/4 once F2 is decided — can land any time.

### Carry-forward gotchas (condensed)
- Constraint #3: this is **hierarchy + legibility**, not de-juicing — keep the energy, just make "go HERE" win.
- **Lock state must stay instantly readable** (it's the nav + the no-skip gate); the `curriculum.test`
  lock-node check must still pass (MR work is cosmetic — don't touch `curZoneIx`/`zoneDone`/the `.locked` class
  the click handler keys on).
- The **path is baked into the painting** — only `ZONESPOTS` or a new bg moves it; redo coords **per act** and
  re-check the **portal `PX/PY`** + `mapFriends` offsets.
- **One nav surface** (F2); **Settings stays parent-gated**; cluster in a **corner clear of painted landmarks**,
  anchored to the screen (not the 1000×750 SVG); touch ≥96px; **Lite** flattens the map blooms.
- **M1:** don't touch the **Base hero** (parametric for the loadout); raster Teddy loses the on-map weapon/cape
  (acceptable); at resolver time swap `teddyArt→charArt` and put **hero + allies on the same pipeline**.
- **Verify** each step with `shot.mjs` (map scene, **both acts**, Chromium + WebKit); keep `save`+`curriculum`
  green.

— Trinity, 2026-06-14

---

## 🔎 RESEARCH + REFACTOR — Grown-Up Corner (Parent) UX (Trinity, 2026-06-14)

Parent: nav still feels flaky despite loving the flexibility. I researched settings + parent-area UX — the
problem is **information architecture**, not the features. Refs: panel `index.html:305–434` (4 flat tabs:
Players / Progress / Settings / Voices), gate `game.js:1454` (3-second press-and-hold).

### What the research says
- **Group by macro-function, card-sorted to the user's mental model; visual hierarchy + whitespace; don't stuff
  one screen** — mixed concerns + long flat lists are the #1 "can't find it" cause. ([Toptal](https://www.toptal.com/designers/ux/settings-ux),
  [Setproduct](https://www.setproduct.com/blog/settings-ui-design), [uiux.studio](https://uiux.studio/2023/07/24/8-steps-to-improve-app-settings-ux/))
- **Progressive disclosure** — top-level categories that **drill into** detail — beats one giant scroll.
- **Kids' apps need a hard Child-Space ↔ Parent-Space boundary**; "complicated navigation with hidden menus or
  excessive scrolling frustrates." ([Ramotion](https://www.ramotion.com/blog/ux-design-for-kids/), [Gapsy](https://gapsystudio.com/blog/ux-design-for-kids/))
- **Parent gates must be COGNITIVE** (e.g., "tap 18 + 5"): a button/"are you an adult"/a timed hold gives "no real
  protection because children will tap [or hold] whatever lets them continue." ([UX Collective](https://uxdesign.cc/designing-apps-for-young-kids-part-1-ff54c46c773b), Gapsy)
- **Parent dashboards lead with an OVERVIEW** (who's playing, progress, time, status), then drill into controls.
  ([Amazon Kids](https://apps.apple.com/us/app/-/id6471528064), [Boomerang](https://useboomerang.com/article/parental-control-apps/))

### Diagnosis — why it feels flaky
1. **Four heterogeneous jobs as peer tabs:** Players (account), Progress (a data dashboard), Settings
   (preferences), Voices (a full content-production **studio**). The Studio dwarfs the rest — hopping between a
   sound toggle and a recording workflow is jarring.
2. **Flat tabs hide content + lose your place** (Settings = long card scroll; Voices = long studio); no
   landing/hierarchy to orient the parent.
3. **Weak gate:** a 3-second hold is doable by a 7yo — not a real parent/child boundary.
4. **No parent "home"** — you land on Players, not an at-a-glance overview.

### Recommended refactor (PRESERVES every feature — IA, not removal)
- **A parent HUB landing (dashboard):** active player, today's mins + missions, cloud on/off, voice-coverage % —
  then big cards that **drill into** sections (hub → section → Back).
- **Separate the jobs:** (1) **Overview** (hub), (2) **Players**, (3) **Progress/Reports** ("what Teddy can read
  now" + export), (4) **Settings** (Sound / Display / Sync+Backup / Reset — iOS-style grouped list), (5) **Voice
  Studio pulled OUT as its own labeled tool** (a workflow, not a "setting").
- **Upgrade the gate to a light cognitive challenge** ("tap the answer: 14 + 9") in front of the hold.
- Reuse the icon/card system from the settings overhaul; tidy whitespace + scannable microcopy.

### Gotchas for Neo
- **Don't remove capability** — keep every control + the whole Studio; just re-home them (the parent loves the
  options).
- **Gate-friction trade-off:** a cognitive gate every entry annoys a frequent parent → **remember it for the
  session** (re-challenge after background/idle), and definitely gate the destructive bits (Reset, Publish/token,
  cloud) behind it.
- **Preserve element IDs / wiring** (`volSlider`, `btnSfxToggle`, `detailSeg`, `cloud*`, `btnResetProfile`, the
  audio-studio ids, `renderProgress`) or migrate carefully — lots of JS binds to them; a blind re-layout breaks
  handlers.
- **Drill-down needs a reliable Back + state/scroll reset** — part of today's "flaky" feel may be tab state not
  resetting; fix it in the refactor.
- **Studio is heavy** (IndexedDB, ElevenLabs key, GitHub token) — keep it lazy/contained in its own space.
- Accessibility: ≥96px targets, high contrast even in the parent area.

— Trinity, 2026-06-14

---

## 📐 SPEC FOR NEO — Grown-Up Corner refactor: parent hub + drill-down + cognitive gate (Trinity, 2026-06-14)

Implements P1. Goal: replace the 4 flat heterogeneous tabs with a **parent HUB → drill-down sections**, pull the
**Voice Studio** out as its own tool, and add a **cognitive gate** — **preserving every control + every bound ID.**
Current: panel `index.html:305–434`; tab-switch wired in **`audio-studio.js:339–341`** (delegated `.tabbtn` →
toggle `.on` on `.tabbtn`/`.tabpane` by `data-tab`); gate `game.js:1454` (3s hold → `openSettings`); open logic
`openSettings()` `game.js:1438`.

### Architecture (minimal-risk — REUSE the existing panes)
1. **Keep the 4 `.tabpane` blocks + ALL inner markup/IDs** (`#tabPlayers/#tabProgress/#tabSettings/#tabAudio`) as
   the "sections." Re-parenting/moving them in the DOM is safe (`getElementById` is position-independent) — just
   **don't rename inner IDs or remove elements.**
2. **Add a HUB pane `#tabHub`** = the landing: an **overview** (active player + switch, today's mins/missions from
   `S.daily`, cloud on/off via `cloudActive()`, voice-coverage % from the studio dash) + **4 big nav cards**
   (👥 Players · 📊 Progress & Reports · ⚙️ Settings · 🎙️ Voice Studio) + a prominent **"← Back to game"** (Close).
3. **Replace the flat tab switch** (audio-studio.js:339–341) with `showSection(id)` (shows ONE pane: hub OR a
   section) + `backToHub()`. Give each section a **"‹ Back"** header → `backToHub()`. Drop the persistent
   `.tabbar` (nav is hub↔section). Move this nav logic OUT of audio-studio.js (it shouldn't own panel nav).
4. **`openSettings()` lands on `#tabHub`** + populates the overview; **paint each section LAZILY on drill-in**
   (`showSection('tabProgress')`→`renderProgress()`; Studio→`refreshAudioStudio()`; Settings→`paintVol/paintDetailSeg`
   + cloud field; Players→`paintPlayers`) so opening the panel is light and data is fresh each entry.
5. **Voice Studio = its own labeled tool** (same `#tabAudio` pane, titled as a tool, reached from its hub card,
   lazy-loaded) — no longer a peer of a sound toggle.

### Cognitive gate (replaces the weak 3s hold)
- Keep the **3s hold** as the *intent* trigger (so a kid can't trigger it by accident); on hold-complete show a
  **math modal**: "Grown-ups only — tap the answer: **13 + 24**" with 3 big answer buttons (1 correct + 2
  plausible foils). Correct → `openSettings()` + set a session flag `__parentOK`. Wrong → gentle dismiss.
- **Numbers: adult-easy / kid-hard** — two **2-digit** addends with regrouping (e.g., 13+24, 27+15), NOT
  single-digit (a 7yo learning math could solve those).
- **Remember per session:** skip the challenge while `__parentOK` is fresh; **re-challenge on
  `visibilitychange` (hidden→visible)** or after N minutes idle. Destructive controls (Reset, Publish/GitHub
  token, cloud code) already live behind the gated panel — good.

### ⚠️ ID-PRESERVATION list (do NOT rename/remove — handlers bind by ID at load)
`volSlider`/`volPct`, `sfxSlider`/`sfxPct`/`btnSfxToggle` (sfx.js), `musicSlider`/`musicPct`/`btnMusicToggle`
(music.js), `btnVoiceTest`, the `#detailSeg` buttons, `cloudSecret`/`btnCloudConnect`/`btnCloudOff`/`cloudState`/
`saveWarn`, `saveBox`/`btnCopySave`/`btnRestoreSave`, `btnResetProfile`/`resetWho`, `playersList`/`btnAddPlayer`,
`progBody`, `vpStatus2`, `audDash` + **all audio-studio element ids**, `btnCloseSettings`. A blind re-layout that
renames these breaks the handlers in game.js/sfx.js/music.js/audio-studio.js.

### Edge cases / gotchas
- **Lazy paint must run EVERY drill-in** (not once) so stats/cloud/coverage are fresh.
- **Back resets scroll position** (part of today's "flaky" feel is stale tab state/scroll).
- Panel stays a full-screen overlay (z 20); **Close returns to the prior game screen** (`btnCloseSettings`
  removes `.on`) — keep.
- reduced-motion on any drill transition; ≥96px targets + high contrast incl. the gate buttons.
- **No save/migrate impact** (pure UI). #1 cloud-auth is already live (`cloudSecret`/Family code) — the refactor
  just re-homes the Sync card under Settings; keep `cloudActive`/`cloudConnect`/`cloudOff` wiring.

### Phasing (incremental, low-risk)
P1 add hub + `showSection`/`backToHub` over the existing panes (biggest IA win, IDs untouched) → P2 lazy-paint
on drill-in → P3 cognitive gate + session-remember → P4 re-label/contain the Voice Studio + tidy microcopy.

### Verify
No unit tests (DOM). Add `shot.mjs` scenes: the gate modal, the hub, each section, Studio. Manual: gate math
correct/incorrect + session-remember; each section opens→paints→Back; **every control still works** (sliders,
toggles, detail, cloud, backup, reset, players, studio); Close returns to the game.

— Trinity, 2026-06-14

---

## 📐 SPEC FOR NEO — "Spell Scroll": repeated reading + listening preview (fluency rec #2) (Trinity, 2026-06-14)

Implements research-brief rec #2. Repeated reading of a short passage is the meta-analytic gold standard for
fluency in reading disability, **best with a listening passage preview** (passage modeled first) — Lee & Yoon
2016, PubMed, [DOI](https://doi.org/10.1177/0022219415605194).

### ⚠️ THE constraint that shapes everything: the app can't HEAR the child
No speech recognition. True repeated reading is ORAL + adult-timed. So we **structure** repeated oral reading
instead of measuring it: model it, prompt the re-read, track engagement via taps, re-space it. The fluency gain
depends on the child reading **aloud** (mentor models it; nudge the parent to read along). **The tap-pace is a
soft engagement proxy, NOT a fluency score — don't over-trust it.**

### The mechanic ("charge the spell scroll")
A short DECODABLE passage = a "spell scroll." Per session:
1. **Listening preview** — a mentor (Amelia/Noah) reads the whole scroll aloud, **words highlighting in time**
   (echo/choral modeling). Reuse `sentenceAudio()`/`wordAudio()` (game.js:785–787) — every decodable word has a
   `word_` clip. Replay button; `flow()` so it can't hang (#8).
2. **Child reads aloud + taps each word in order** ("cast each word") — legit finger-tracking (1:1) + decode,
   and the only thing the app can measure. Wrong-order tap = gentle dim + replay that word + retry (no penalty, #2).
3. **Personal-best "power"** — time the tap-through **silently in the background**; if today beats their best, a
   power meter fills. **No visible countdown, no penalty for slow** (#1: "personal-best flair only, if ever").
4. **Repeat across days** — the same scroll re-presents on a **spaced** schedule (reuse the **Memory Vault**
   box/due model) — the "repeated" in repeated reading. A scroll graduates after N spaced reps.

### Where it lives
- **Primary: a "Spell Scrolls" drill in the Training Room** (the daily, decoupled, coin-paying loop — ideal for
  a daily fluency habit). Coins per rep like `trainWin` (game.js:1306); `record()`s the scroll words so it
  strengthens mastery + feeds the Vault.
- Optional: a **fluency mission** in the Reading Dojo (Act-1 zone 9) / Great Library (Act-2 zone 105). Do the
  Training-Room home first.

### Data model
- **`SCROLLS` (data-content.js), per act:** `{id, lines:[[words…],…], pic?}` — 2–3 short DECODABLE sentences using
  only taught words/graphemes (same rule as `SENTENCES2`; **curriculum.test guards decodability + play order**).
  Reuse `SENTENCES` words; sight words via `spellWordHTML`.
- **`S.scrolls[id] = {reps, bestMs, box, due}`** (box/due reuse the Vault scheduler). Additive + save-safe (no
  migrate change). `bestMs` = personal best (lowest tap-through); never shown as a timer.

### Integration points (file:line)
- Preview audio: `sentenceAudio`/`wordAudio` (game.js:785–787). Add `scroll_intro`/`scroll_again` to LINES
  (Amelia/Noah role).
- Host: `trainRound` (game.js:1276) — add a scroll mode beside build/decode; coins via `trainWin` (game.js:1306).
- Mastery + spacing: `record()` (game.js:143) on the scroll words; Vault box/due for re-presentation.
- Text render: Andika word tiles ≥96px (reuse the `wordtile` styling, game.js:801/824).

### Constraints / gotchas
- **#1 the big one:** no speech recognition — frame "power" as **effort/practice**, add a parent nudge ("read it
  out loud together!"), don't present pace as a reading score.
- **No timers-as-failure / no harsh fail** (#1/#2): timing silent + personal-best only; wrong tap = gentle
  replay+retry.
- **Audio-first, can't hang** (#8): preview + every word tappable to replay; `flow()`/watchdog + ⏭/Home.
- **Decodability:** scrolls use only taught words/graphemes; `curriculum.test` guards (mirror SENTENCES2);
  magic-e/sight words handled as elsewhere.
- ≥96px tiles, Andika, high contrast.

### Tests
- `curriculum.test`: every `SCROLLS` word decodable by play position (+ sight handled); ids unique.
- `save.test`: `S.scrolls` round-trips; `migrate` leaves old saves untouched.

### Phasing
P1 Training-Room scroll drill (preview → tap-through → personal-best power) + a few decodable scrolls → P2 spaced
re-presentation via the Vault scheduler → P3 optional fluency mission + parent "read-along" nudge.

— Trinity, 2026-06-14

---

## 📐 SPEC FOR NEO — "Sound Warm-Up": oral phonemic awareness + articulatory cues (rec #3) (Trinity, 2026-06-14)

Implements research-brief rec #3. Phonemic awareness (PA) **enables orthographic mapping** (the mechanism sight
words form by), and Ehri finds OM is facilitated when learners are taught the **articulatory features** of
phonemes ("how your mouth makes the sound"). NRP: PA instruction is foundational. ([Reading Rockets — OM](https://www.readingrockets.org/reading-101/reading-and-writing-basics/sight-words-and-orthographic-mapping),
[NRP](https://www.readingrockets.org/topics/curriculum-and-instruction/articles/findings-national-reading-panel))
Two parts: **(A)** an oral PA warm-up, **(B)** child-facing articulatory cues.

### Reuse what exists
- **`graphemeSounds(w)`** (game.js:54) already returns a word's separated sound clips (magic-e/digraph aware) →
  trivial **blending** audio (/s/-/a/-/t/).
- **`READWORDS`** (pictures) → the tap **response** for blending.
- **`PH_COACH`** (audio-studio.js:30+) already has per-phoneme keyword + icon + mouth cue (e.g. t: "tongue tip
  taps behind top teeth — tiny puff") — child-cue gold. The learn screen (`startLearn` game.js:582) has a
  `#letterCue` slot (588) but **no mouth cue today**.

### ⚠️ No speech recognition (same as fluency)
Pure PA is oral, but the app can't hear the child blend/segment aloud — so **responses are TAPS** (pick the
picture / pick the count / pick the sound). The child still says it aloud (mentor models; parent nudge); the
tap is the measurable proxy.

### (A) Sound Warm-Up — a short, gentle oral-PA drill (≤5 items)
- **Blend** (easiest): play `graphemeSounds(w)` (sounds separated) → "what word?" → tap the **picture** of `w`
  from 3–4 `READWORDS` options. *No letters shown* (pure oral); then **bridge** by revealing the grapheme after
  a correct tap (connects PA→phonics = the orthographic-mapping goal).
- **Segment**: play the whole word (`word_<w>`) → "tap out the sounds" → tap N boxes (count the phonemes) or tap
  each box as the sound replays.
- **Isolate**: play a word → "what's the FIRST sound?" → play 3 sound options (`snd_`), tap the first sound.
- Sequence blend → segment → isolate; **taught graphemes/words only** (mastery-paced #5).

### (B) Articulatory cue (on the Learn screen + in the warm-up)
When a sound is taught/practiced, show a **kid-friendly mouth cue**: a small mouth illustration + the keyword/
icon + a one-line cue (from `PH_COACH`, simplified). Add a tiny `mouthCue(phoneme)` renderer (art.js) — a handful
of **mouth shapes** mapped by place/manner (open vowel · lips-together m/p/b · teeth f/v · tongue-tip t/d/n/l ·
back k/g/ng), not a realistic animated mouth (low art cost).

### Data model
- **Extract a shared `PHONEMES` table** (from `PH_COACH` + base/keyword/icon) into data-content.js so BOTH the
  studio and the game read it (today it's studio-local + adult-phrased). Add a **kid cue** string + a mouth-shape
  id per phoneme; keep the technical adult tip for the studio only.
- Content = `READWORDS` filtered to taught graphemes; audio = `graphemeSounds`/`word_`/`snd_`.
- Track reps via `record()` on the graphemes (strengthens mastery + feeds the Vault); coins like the Training Room.

### Where it lives
- The **Sound Warm-Up** = a short optional activity in the **Training Room** (and/or a 20–30s pre-session warm-up).
  Keep it SHORT (ADHD). The **articulatory cue** integrates into `startLearn` (every new sound) + the warm-up.

### Constraints / gotchas
- **No speech rec** → tap responses (above); the child should still say it aloud (parent nudge).
- **Oral → letter bridge:** start with no letters (true PA), reveal the grapheme after — don't skip the bridge,
  that connection IS the orthographic-mapping payoff.
- **Anti-gaming #4:** PA prompts are SOUND-only; never show the target letter in the prompt (the isolate task's
  on-screen text stays generic, like `find`).
- **Magic-e units have no `snd_`** — exclude from PA (mirror finding #3); use `snd_<v>_long` for long vowels.
- Audio-first + `flow()`/watchdog + ⏭/Home (#8); no timers/failure, wrong tap = gentle replay+retry (#1/#2);
  ≥96px, Andika for the bridge letters, high contrast.
- **Extract `PH_COACH` carefully** — simplify the adult phrasing for the child ("NOT 'tuh'"/"voiced" are for the
  parent), and don't break the Voice Studio that reads it today.

### Tests
- `curriculum.test`: every warm-up word is decodable by play position; PA never serves a magic-e grapheme as a
  sound target; the shared `PHONEMES` table covers every `snd_` phoneme.
- `save.test`: any new `S` field round-trips; migrate untouched.

### Phasing
P1 the articulatory cue on the Learn screen (smallest, high-yield — reuse `PH_COACH` + a few mouth shapes) →
P2 the blend warm-up (Training Room) → P3 segment + isolate + the oral→letter bridge.

— Trinity, 2026-06-14

---

## 📐 SPEC FOR NEO — Mastery-threshold tune: "proficient" vs "retained" (rec #4) (Trinity, 2026-06-14)

Implements rec #4. Today: `masteredItem` = `str>=4 && seen>=4 && acc>=0.75` (game.js:151–153), used BOTH to gate
finales (`coreWeak`, game.js:156) AND to show the ★/✦ (game.js:1159, 1404). Goal: make "mastered" mean
*retained*, with a higher bar + a **spaced-correct** + light overlearning — **without** soft-locking finales.

### ⚠️ THE trap (why this isn't a one-constant change)
A **spaced-correct** requirement (correct on ≥2 different calendar days) **cannot gate the finale** — a child
can't earn a *next-day* correct mid-session, so `coreWeak` would become impossible to clear in one sitting →
**finale soft-lock.** So **split the two meanings:**
- **`masteredItem` = PROFICIENT** (in-session achievable) → keeps gating finales (`coreWeak`) + the Progress ★.
- **`retainedItem` = DURABLE** (proficient + spaced-correct) → the Base gold **✦**, the Vault "graduated"
  criterion, and an optional Progress "retained" count. **Never gates a finale.**

### Changes
- **Gently raise the proficient bar** (game.js:151): `MASTER_ACC 0.75→0.8`, `MASTER_SEEN 4→5` (light
  overlearning). Keep `MASTER_STR 4`. Achievable in a session; finale review loops stay short. *Don't go 0.9 /
  seen 8 — grindy for an ADHD learner (constraints #1/#2 keep it no-failure, but avoid long loops).*
- **Track correct-days** in `record(g,ok)` (game.js:143): on a correct, `if(dayKey()!==m.lastOkDay){
  m.okDayCount=(m.okDayCount||0)+1; m.lastOkDay=dayKey(); }` (`dayKey()` state-save.js:136). Additive + save-safe.
- **Add `retainedItem(key)`** = `masteredItem(key) && (S.mastery[key].okDayCount||0) >= 2`.
- **Re-home the displays:** finale gate + ★ stay on `masteredItem` (★ literally = "what gates rescues" —
  keep that semantic); the Base gold **✦** (game.js:1159, "you truly own this one") and the **Vault graduation**
  move to `retainedItem`.

### Gotchas
- **The trap above** — `coreWeak` stays on `masteredItem`, NOT `retainedItem`. Re-verify finales clear in one
  session.
- **Don't visually demote existing mastery:** old saves have no `okDayCount`, so already-✦ gems would lose the
  gold on first load. **Grandfather in `migrate()`:** for any item where `masteredItem` is already true, seed
  `okDayCount = max(okDayCount, 2)`. (Or keep ✦ on `masteredItem` and add a *new* small "retained" badge — but
  grandfathering is cleaner.)
- **Vault synergy (#1):** `okDayCount` reuses the same `dayKey` day-tracking the Memory Vault uses, and the
  Vault's spaced re-exposures are exactly what *earn* the 2nd-day correct → build/share the day-tracking with #1.
- Mastery-paced + no-failure (#5/#1/#2): the higher bar just means a little more gentle review, never a fail.

### Tests (`save.test`)
- `record()` increments `okDayCount` only on a NEW day, not a same-day repeat (inject a fake `dayKey`).
- `masteredItem` flips at `str4/seen5/acc.8`; `retainedItem` needs `okDayCount>=2` on top.
- `migrate()` grandfathers already-mastered items to `okDayCount>=2` (no ✦ regression) and leaves other saves
  untouched.

### Phasing
P1 bump the proficient constants (0.8/5) + verify finales still clear → P2 add day-tracking + `retainedItem` +
grandfather migrate → P3 move ✦/Vault-graduation to `retainedItem` (+ optional Progress "retained" count).

— Trinity, 2026-06-14

---

## 🔴 RED-TEAM — is the reward "juice" competing with the reading? (Trinity, 2026-06-14)

Parent question, researched + checked vs the code. **Verdict: mostly well-designed — the juice is intentional and
ADHD-appropriate; a few tunable dials, not alarms.** Don't remove it (constraint #3 + ADHD needs frequent
**immediate** reinforcement — children with ADHD are unusually sensitive to reward *delay* and biased toward
immediate reward: Tripp & Alsop 2001, PubMed PMID 11464973).

### What the code already does RIGHT (don't "fix")
- **Ambient juice is OFF on learning screens** — `sceneParticles`/motes only on `AMBIENT_SCREENS` (title/map/base/
  win/rest/intro), never on mission/learn screens (game.js:256; index.html:29). The prompt moment is already clean. ✓
- **Music ducks under narration** (audio-first, #8). ✓
- **Combo = an ACCURACY streak, not speed** (`combo++` on correct, reset on wrong, no timer — game.js:144) — no
  fast-tapping incentive. ✓
- **Rewards fire AFTER the correct response** (`burstAt`+`Aud.ding`, game.js:470/652/720) — reinforcing, not
  competing with the prompt. ✓
- **Cosmetic/coin loop is decoupled** from story; **no harsh failure** — which the ADHD literature strongly
  supports: ADHD shows **blunted reward sensitivity but ENHANCED learning from NEGATIVE feedback** (Aster et al.
  2024, PubMed, [DOI](https://doi.org/10.1016/j.nicl.2024.103588)) — "wrong" cues bite harder, so the gentle
  no-fail design is exactly right. ✓

### The research risk
- **Seductive details:** interesting-but-irrelevant stimulation adds **extraneous cognitive load** and lowers
  retention/transfer ([meta-analysis](https://link.springer.com/article/10.1007/s10648-025-10099-z)) — worst under
  high TEXT load, softer under **narration** (we're audio-first, in our favour). So the risk concentrates in the
  **exact moment** the child must process the letter/sound.
- **Overjustification:** expected tangible rewards can shift focus to the reward + undermine intrinsic interest
  ([overview](https://www.structural-learning.com/post/overjustification-effect)); and ADHD reward-sensitivity skews
  toward **"Insatiability"/fixation on a particular reward** (Pulver et al. 2020, PubMed,
  [DOI](https://doi.org/10.1017/neu.2020.18)) — a child could **fixate on coins/cosmetics**.

### Dials for Neo (tuning, not removal)
1. **Clean beat between the reward and the NEXT prompt.** A burst/SFX bleeding into the next instruction loads
   working memory during the new encode. Keep reward animations SHORT; `flow()`-sequence reward → settle → next
   prompt; never let a celebration overlap the next narration.
2. **Make the READING rewards bigger than the cosmetic ones + go INTERMITTENT.** Coins are an expected every-rep
   tangible reward (`trainWin`, game.js:1306) — the overjustification/fixation risk. Weight rewards to
   **mastery/accuracy** over participation; make the **★ / ally-rescue / correct-cue** feel more salient than coins;
   and **vary** the reward magnitude — intermittent reinforcement is *both* more ADHD-engaging *and* less
   overjustifying/satiating than identical payouts.
3. **Verify the learning tile is the MOST salient thing in the response window.** Motes are already off on learning
   screens — extend the check to **character idle/aura/scene-harmonizer on the Full tier**: while a prompt awaits a
   response, the gem/letter/word should out-shine the hero's idle. (Calm/Lite already reduce this — confirm Full.)
4. **Confirm the combo reset never reads as a loss** (#2 — no streak-loss): silent today (good); keep it
   positive-only, and keep **zero time pressure** so a combo chase never nudges guessing over careful reading.
5. **Keep reinforcement IMMEDIATE + CLEAR** (ADHD: immediate-reward bias + blunted sensitivity) — instant,
   unambiguous positive cues; never delay/mute the "you got it."

### "Measuring" with one child (no A/B)
Parent-observable: is Teddy attending to the **letter/sound** or to the **burst**? Reading **to read** or **to
earn coins/cosmetics**? If cosmetics dominate his talk/behaviour, dial coins down + make the reading wins louder.
That behavioural read is the signal — not an in-app metric.

*Sources: PubMed — Tripp & Alsop 2001 (PMID 11464973), Aster et al. 2024 ([DOI](https://doi.org/10.1016/j.nicl.2024.103588)),
Pulver et al. 2020 ([DOI](https://doi.org/10.1017/neu.2020.18)); seductive details
[meta-analysis](https://link.springer.com/article/10.1007/s10648-025-10099-z); overjustification
[overview](https://www.structural-learning.com/post/overjustification-effect).*

— Trinity, 2026-06-14

---

## 📐 SPEC FOR NEO — "Word Crafting": morphology + richer comprehension (rec #6, capstone) (Trinity, 2026-06-14)

Implements rec #6 — the **2nd-grade-rung capstone**. Morphological awareness (MA) improves reading + spelling
for children with dyslexia (Ardanouy et al. 2024, PubMed, [DOI](https://doi.org/10.1177/00222194231223526)),
explains reading speed/fluency + spelling at 2nd grade beyond phonological awareness (Volkmer et al. 2019,
PubMed, [DOI](https://doi.org/10.1024/1422-4917/a000652)), and **builds ON the PA/phonics foundation** (Kirk &
Gillon 2007, PubMed, [DOI](https://doi.org/10.1044/0161-1461(2007/036))).

### ⚠️ Framing: this is a CAPSTONE, not a now-item
Decoding can't be rushed (constraint #5). Morphology training works best *after* decoding + fluency are solid,
and the dyslexia evidence is for ages ~9–14 — a 7yo is at the **early edge**. So gate it behind the Great Library
fluency, keep it gentle, and start with the simplest morphology. Slot it as a **new capstone zone after the Act-2
Great Library** (or Act 3).

### A. Morphology = "Word Crafting" (lean into his Minecraft crafting love)
Build longer words from meaningful PARTS — base + affix → new word — as **crafting recipes**. Reuse the existing
**forge mechanic** (`startForge`, game.js:985) but at **morpheme granularity** (a base tile + an affix tile →
forge → read it) and **teach the MEANING** (the vocab/comprehension payoff: "lock → un-lock = NOT locked").
Audio: base + affix + whole word. `toGraphemes` (game.js:30) still decodes each part letter-by-letter.
**Sequence (easy→hard):** compounds (sun+shine) → inflectional `-ing`/`-s` → prefixes `un-`/`re-` → `-ed` →
derivational `-ful`/`-less`/`-er` (latest).

### B. Comprehension upgrade (richer than picture-match)
After reading a **Spell Scroll** (rec #2) or sentence, ask a **literal question** (who/what/where) → tap the
answer (picture or word); later add **simple inference** ("how does she feel?") + **sequencing** (order the
events). Reuses the Spell Scroll passages → **ties #2 + #6**. No speech rec → tap answers.

### Data model
- **`MORPHEMES`** (data-content.js): bases + affixes, each with meaning + audio. **`WORDCRAFT`** recipes:
  `{base, affix, result, meaning}`. Explicit recipes (no morphological parser needed initially).
- **Comprehension `QUESTIONS`** keyed to scroll/sentence ids: `{passageId, q, answer, foils}`.
- `S` tracking: reuse `record()` on the crafted words + the Vault scheduler; additive/save-safe.

### ⚠️ Gotchas (the ones Neo will hit)
1. **Spelling-change rules** — adding suffixes triggers drop-e (hope→hop**ing**), doubling (hop→ho**pp**ing),
   y→i (happy→happ**ier**). These are **3rd-grade+**. **Slice 1 must use affixes that DON'T change spelling**
   (cat+s, jump+ing, un+lock, compounds). Teach the change rules explicitly, much later.
2. **Affix pronunciation variants** — `-ed` = /t//d//ɪd/ (jumped/played/wanted); `-s` = /s//z/ (cats/dogs); `-es`.
   Start with **invariant** affixes (compounds, `-ing`, `un-`) before the variant ones; teach variants explicitly.
3. **Decodability still holds** — bases + results use taught graphemes; an affix may add a pattern — `curriculum.test`
   must guard (mirror the SENTENCES2 check).
4. **Capstone gate** — only after decoding+fluency mastery; gentle, no-failure; ≥96px, Andika, audio-first.

### Tests
- `curriculum.test`: every `WORDCRAFT` result is decodable; slice-1 recipes have **no spelling change**; affixes
  introduce no untaught grapheme; comprehension answers/foils are decodable. ids unique.
- `save.test`: new `S` fields round-trip; migrate untouched.

### Phasing
P1 **compounds** via the reused forge (easiest, no spelling change, concrete meaning) → P2 inflectional
`-ing`/`-s` + the **comprehension question** on Spell Scrolls → P3 prefixes `un-`/`re-` + `-ed` (explicit
variants) → P4 derivational + spelling-change rules (likely Act 3).

— Trinity, 2026-06-14

---

## ✅ VERIFIED — generated character art + resolver (Trinity, 2026-06-14)

Read the actual PNGs + traced wiring. **All premium + on-brief:** `teddy-m1` (superhero — gem-lens glasses, gold
"T", red cape, hero stance), `ally-tank`/Archie (real athletic kid, no cape, "A" jersey), `ally-sunny`/William
(cheerful comic-relief, "W" shirt), `vixen` (stylish horned villainess, pink flames). The `RASTER`/`rasterArt`
resolver is correct (RASTER-gated, SVG fallback; every flagged PNG exists). Tests green (save 41, curriculum 40).
The render→generate→integrate→verify loop is working end-to-end.
→ **Minor finding for Neo (perf, not a bug):** the generated PNGs are ~300–355 KB each; Teddy alone is 6 tiers
(m0–2 × hero/knight) ≈ 1.9 MB, and the cast will grow (Vex/Dragon/Noah/more allies). For the no-build static
deploy on **old iPads / cellular**, consider **optimizing** them (pngquant/oxipng ≈ 60–70% smaller, or WebP) and
whether all 6 Teddy tiers are needed. The SW caches after first load, but first-load + updates still pull it all.

> **Reviewed `af9e345` (Trinity, 2026-06-14):** Dragon + Noah generated art — **both premium + on-brief** (Dragon =
> fierce crimson fire-breathing boss; Noah = red-haired/bearded wizard + glowing staff, Gandalf-coded). Clean
> approach: `dragonSVG`/`noahSVG` bodies swapped to `rasterArt(...)` wrappers so every call site (boss battles,
> fortress, the 4 wyrm cages, Noah's intro) auto-upgrades with no churn (−124 lines of old SVG); cage transparency
> works behind the bars. Vex also raster (`inkblotSVG`→`vex.png`). **Cast is now ~all raster** (Teddy×6, Vixen,
> Vex, Dragon, Noah, 5 allies). No bugs; tests green (41/40). ⚠️ The **PNG-weight finding above is now more
> pressing** (~15 PNGs ≈ ~5 MB of character art) — worth a pngquant/WebP pass soon. (Remaining old-SVG: Kendall
> placeholder, captive/portal/city interlude bits, and the small `allyFace`/`allyMapFig` icons — fine.)

---

## 📐 SPEC FOR NEO — Gear + friend-rescue pacing spread (Trinity, 2026-06-14)

> **✅ PARENT GREENLIT (2026-06-14): BUILD IT, grandfathered.** Teddy's early (or a reset/new player is coming),
> so the spread is worth it. **Hard requirement: plumbing-first** — ship the grandfather (S.gear act-union +
> durable `S.freed` + migrate) and PROVE no regression on a loaded save BEFORE re-mapping any gear/rescue ids.

The parent approved the "full re-tune"; muscle is done (derived, no risk). This is the gear + friends piece —
the **save-affecting** one.

### ⚠️ READ FIRST — the honest framing (a real decision for the parent)
This re-tune **mainly benefits a FRESH playthrough.** Teddy is one child playing once: if he's already past the
front-loaded section (gear at missions 1/3/4/8, friends at 3/6/8), the re-map **does nothing for him** (he has
them), and done naïvely it would **un-earn** his current gear/friends. So either: **(a)** ship it *grandfathered*
(never removes what's earned — spec below), valuable for future players / a reset; or **(b)** skip it if Teddy's
mid/late Act-1 and there's no fresh player coming. **Ask the parent where Teddy is before building.** The muscle
spread already fixed the most-felt front-loading with zero risk.

### Why it's risky (the storage duality)
- **Gear:** `S.gear` is durable (pushed on earn, game.js:554) BUT the hero's appearance + weapon unlocks
  re-derive from **`actGearList`** = `GEAR_AT` ∩ done (game.js:70). Re-mapping `GEAR_AT` → `actGearList` drops gear
  whose new mission isn't done yet → **hero loses belt/boots/weapon he had.**
- **Friends:** purely derived — `allyFreed = !!S.done[allyMid]` (allies.js:23). Move an ally's `mid` → a not-yet-
  done mission → the **freed friend disappears from the league.**

### A. Gear spread (the front-load is just 4 items)
`GEAR_AT` Act-1 is already mostly at milestones; only **belt(1) · boots(3) · hammer(4) · sword(8)** are front-
loaded. Proposal: keep **Word Hammer early** (~m4, the first-weapon dopamine) and push the others to later zone
finales so the hero powers up across the act, e.g. Sword→26 (Vex Captain), Belt→33, Boots→47. Keep gear NAMES
(they drive appearance + the weapon unlocks: Gauntlet→lasso, Crown→bow, Belt→mace, Boots→lance).
**Grandfather:** make `actGearList(a)` return the **union** of (derived `GEAR_AT`∩done) **and** (`S.gear` for this
act) so a re-map only changes *future* unlock points, never removes earned gear. ⚠️ Gear names repeat across acts
(Gem Sword / Power Belt / Rocket Boots) — act-scope the `S.gear` union by checking the item was earned via *this*
act's missions (store `{gear, act}` in S.gear, or gate the union by act).

### B. Friend-rescue spread
Today: tank(3) · flip(6) · sunny(8) cluster in zone 1, heart(17) zone 2, leighton(48) finale. Spread to **one
friend per early/mid zone** (≈ every 8–10 missions): tank→z1, flip→z2, sunny→z3, heart→z4ish, leighton stays the
finale. Update `CAGED` mids + `allyMid`(allies.js:21) + `mapFriends`(map.js:27) + the `rescue:true` flag + each
mission's narrative **label** (the rescue beat moves with the friend — keep the story coherent per zone).
**Grandfather:** store freed allies durably (`S.freed[kind]=true` on rescue) and make `allyFreed = S.freed[kind]
|| !!S.done[allyMid(kind)]` so a re-map never un-frees an earned friend.

### Gotchas
- The **grandfather is mandatory** (both A + B) or existing saves regress — this is the whole risk.
- Gear ↔ **weapon-unlock** coupling: moving Belt/Boots moves when mace/lance unlock (Act-2) — keep coherent.
- Rescue missions carry **narrative labels + the mastery gate** (`rescue:true` → `coreWeak`); moving them moves
  the cutscene + keeps the gate.
- `S.gear` shared across acts (the repeat-names issue) — act-scope carefully.
- This only changes *new* unlocks for a grandfathered save, so **verify on a mid-campaign save** that nothing
  visually disappears.

### Tests (`save.test`)
- A save that earned belt@m1 keeps the belt after `GEAR_AT` re-map (grandfather union).
- A save that freed tank@m3 keeps tank after `allyMid` re-map (durable `S.freed`).
- `migrate` seeds `S.freed` from existing `S.done`+old mids (so already-freed friends stay freed).
- `curriculum.test`: every `rescue:true`/gear mission still exists + decodable; one friend per zone.

### Phasing
P1 add the grandfather plumbing (S.gear act-union + `S.freed` + migrate) and PROVE no regression on a loaded save
→ P2 re-map gear (sword/belt/boots later) → P3 re-time friend rescues one-per-zone (+ labels). Don't do P2/P3
before P1.

— Trinity, 2026-06-14

---

**Test commit by Grok (xAI):** Write access verified successfully! Added this line on 2026-06-13.

## 2026-06-13 Grok (xAI) Review — Latest Main (commit 060066c)

**Validation:** Refreshed via GitHub tools. Current HEAD on main is 060066c (my test commit). File listing and key files (CLAUDE.md, index.html, game.js partial + modules) confirmed up-to-date. Modular split advanced; Act 2 complete through Dragon Keep + sentence fluency. Many prior QA items addressed (daily.missions firstTime guard, profile escaping, level override safety, etc.). No stale feedback.

### Bugs / Risks Identified
- None critical in core flows (audio flow/watchdog, save migration, mastery gates, anti-gaming all appear solid and guarded).
- Minor: trainTick relies on document.hidden + lastInteract; iOS Safari backgrounding edge cases could undercount slightly (acceptable for gentle meter).
- Cloud default (bare profile ID) is family-safe but public Worker URL remains a theoretical exposure vector until passphrase is enabled on all devices.
- Classic script load order (index.html) is fragile for future additions — a load-order smoke test (as suggested in prior QA) would harden it.

### Optimizations
- game.js still holds the bulk of mission handlers (forge/read/spell/etc.) + boot/title/win logic. Next logical split: extract data-driven mission dispatchers or a mission-handlers.js to further reduce coupling and improve testability.
- voicepack.js (27MB) is optional but large; consider lazy-loading or separate PWA asset strategy for faster initial loads on older iPads.
- Random in victory poses / foils / patrols: add optional seeded rand() wrapper for deterministic tests/debug without changing prod behavior.
- Large template SVG strings in art.js: performant for no-build but hard to diff/review — small DOM helpers or shared defs could help future art work.

### Suggested Ideas & Enhancements
1. **Post-Act-2 Maintenance Loop (high value)**: After Dragon Keep, add a daily "Hero Patrol" that mixes weakest items from both acts (retention focus). Keeps the app useful long-term without new content bloat. Gate behind Act-2 completion flag.
2. **Audio Workflow Polish**: Parent flagged this; streamline record → preview → keep/re-record → publish flow in Voice Studio. Add progress dashboard for phoneme coverage %.
3. **Settings / Grown-Up Corner Overhaul**: Current tabbed panel is functional but not game-like. Study real kids' apps (e.g., intuitive sliders, big cards, visual previews). Add "parent quick actions" (reset profile with confirmation, export full progress).
4. **iPad-Specific QA Harness**: Add automated or checklist tests for: Home Screen install, offline launch + first audio tap, background/foreground audio ducking, service-worker update after deploy, Full/Calm/Lite visual parity on real device, cloud restore across profiles.
5. **More Invariant Tests**: Expand curriculum.test.js with locked-node enforcement, sound-ID prompt never shows target grapheme, Training Room time only counts during active scrTrain, profile-name escaping (already good but expand), cloud newer-wins.
6. **Visual/Art Next Wins**: Since foreground integration and medieval skin are live, next could be random hero win-pose variations (already partial) or subtle mouth bob on mentors during narration (faceSpeak is there — extend to more characters if art supports).
7. **Parent Progress Visibility**: Enhance Progress tab with "what Teddy can actually read now" summary (decodable sentences mastered, fluency metrics) + simple export for teachers/therapists.
8. **Diegetic Navigation Polish**: The new city-name tap menu is good; consider adding a persistent "quick nav" or making Hero Base reachable from more places without leaving the flow.

**Recommendation for Claude/Next Agent**: Prioritize 1 (maintenance loop) + 2 (audio workflow) + expanding tests before new content. The app is in excellent shape — focus on polish, retention, and parent ergonomics. All changes must pass node tests/save.test.js + curriculum.test.js + runtime boot check.

---

[Previous short test content and full git history preserved below for reference. The full prior QA review sections are in git history at previous commits.]

**Test commit by Grok (xAI):** Write access verified successfully! Added this line on 2026-06-13.

[Rest of file content preserved; full history in Git.]

## 2026-06-13 Latest Main Studio-Polish Review — Based on `6ed8c7b`

### Review context

- I reset the workspace to the current `origin/main` before reviewing, and the latest fetched `origin/main` after rebase was `6ed8c7b`, which includes `be3d032` (`Update voicepack.js from in-app studio (392 voices)`) plus the Boss Trophy Cages/Hero Base updates.
- I read the current project guidance docs (`CLAUDE.md`, `STYLE.md`, `teddy-reading-app-spec.md`, and the existing `QA.md`) before reviewing the latest code shape.
- This section is appended only; it intentionally does not overwrite the existing Grok/agent notes above.

### What is materially stronger on latest main

1. **Voice/audio-first experience is much closer to the mission.** The checked-in `voicepack.js` now contains a large generated pack, and the recent chained-audio fix makes the first run less likely to drop sequential clips after iPad unlock. That is a major practical improvement for a child-facing reading game.
2. **The game now feels more like a place, not just a drill screen.** Hero Cards, rescued-friend voices, the Hero Base/menu work, boss trophy cages, richer map art, and committed BGM/SFX files all push the app toward a coherent studio-like loop.
3. **The stale-deploy problem is being addressed.** The service worker cache version is bumped and its fetch path now prefers fresh network responses, which should reduce the “why am I seeing the old build?” confusion that has affected agent review.
4. **The modular split is paying off.** The current data/audio/map/save split makes it easier to inspect individual systems and gives future agents smaller, safer surfaces to change.
5. **The in-app studio/publish flow is becoming a real production pipeline.** The Audio Studio + GitHub publish path is the right direction for a one-person “mini studio” workflow where content can be recorded, reviewed, exported, and shipped quickly.

### Suggested bug fixes / risk reductions

These are suggestions, not mandates.

1. **Expand CI syntax coverage beyond root JavaScript files.** The workflow currently checks root `*.js`, but a safer command would also cover `cloud/worker.js`, `tests/*.js`, and any future nested JS modules. Suggested pattern: `find . -name '*.js' -not -path './node_modules/*' -print0 | xargs -0 -n1 node --check`.
2. **Add a storage/performance budget around `voicepack.js`.** The current generated voice pack is large enough to be a real iPad load/update consideration. Keep the audio-first mission, but consider splitting voices by category/act, lazy-loading non-critical clips, or generating a “core boot pack” plus optional packs.
3. **Document the cloud passphrase state.** The code now exposes a `CLOUD_PASSPHRASE` configuration point, while the cloud README still reads like passphrase support is future work. Align the docs so future agents know whether the feature is live, optional, or intentionally disabled.
4. **Treat the Audio Studio GitHub token as sensitive parent-only state.** Remembering the token in localStorage is convenient, but it should have a clear “clear token/revoke reminder” affordance and parent-facing warning because this app may run on a shared iPad.
5. **Add visual smoke checks for the most important screens.** The CI now catches curriculum/save and parse regressions, but not “studio feel” regressions. A simple browser screenshot pass for title, map, mission, Hero Base, Audio Studio, and Hero Card states would catch many accidental CSS/SVG breaks.
6. **Test Hero Cards and overlays with audio in progress.** Verify tapping a rescued friend, closing the full-body card, navigating home/base/map, and replaying audio do not interrupt each other in surprising ways on iPad Safari.
7. **Define the post-Act-2 end state.** The current experience is rich enough that a weak ending would stand out. Decide whether Dragon Keep unlocks a “completed kingdom” loop, an Act-3 teaser, a free-play reading patrol, or a parent-only maintenance/review mode.
8. **Keep `QA.md` append-only, but add a short current-priorities index if the team wants it.** The file has been compacted by other agents, which is okay, but future agents may benefit from a short top or bottom “current live priorities” list so they do not chase older stale notes.

### Enhancement ideas to make it feel more game-studio-built

1. **Daily Hero Patrol:** a gentle replay loop that recommends 3–5 short quests from weak sounds, recent misses, and favorite story beats without adding punishment or streak pressure.
2. **Living Kingdom Map:** after each rescued friend, update the map with a visible restored landmark, ambient animation, and a short spoken thank-you line.
3. **Audio Coverage Dashboard:** in the parent/studio area, show coverage for phonemes, sight words, mission lines, friend lines, and story moments so recording priorities are obvious.
4. **Chapter title cards and mini cutscenes:** add brief animated title cards for Act transitions, boss reveals, rescued-friend moments, and Dragon Keep completion.
5. **Hero Base as the main hub:** make Hero Base feel like Teddy’s clubhouse with the quest board, friend cards, recording booth/radio room, map table, trophies, and parent controls.
6. **Friend postcard collection:** each rescued friend unlocks a postcard/card with a custom voice line, their reading superpower, and one replayable mini challenge.
7. **Parent “teacher handoff” export:** generate a concise progress report with mastered words, shaky graphemes, favorite rewards, and suggested next practice.
8. **Performance badge in parent mode:** show app version, cache version, voicepack size/date, last publish commit, and whether the build is fresh from network or service worker cache.
9. **Replayable boss remixes:** once an act is cleared, allow short remixed boss encounters that target current weak items while using already-loved villains/animations.
10. **Consistent studio art bible:** add a small gallery/spec for SVG proportions, shadows, animation timing, color palettes, and reduced-motion expectations so future agents don’t drift visually.

### Queries for the coding agent / product owner

1. Should the large `voicepack.js` remain a single generated file for simplicity, or should the studio start outputting a core pack plus lazy optional packs?
2. Should the GitHub publish token be stored only per session, or is localStorage acceptable if the UI clearly labels it as a parent-only publishing tool?
3. Is Act 2 intended to be the final complete game loop for now, or should the code start preparing for Act 3 hooks?
4. Do we want the cloud passphrase enabled in production now, or only documented as an optional deployment hardening step?
5. Should `QA.md` keep accumulating long-form agent review notes, or should we add a short “current priorities” summary that future agents update while preserving all historical sections below?
