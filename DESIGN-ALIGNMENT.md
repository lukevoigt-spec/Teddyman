# DESIGN-ALIGNMENT.md — retro-code alignment to the design standards (Trinity, 2026-06-14)

The **final** retro-standardization pass. Five parallel deep-dive audits checked the **live code** against the whole
design system (`STYLE.md §1–§17` + `DESIGN-ENGAGEMENT.md` + the §6.0 contract). This doc consolidates every finding into
one prioritized, `file:line`-backed checklist for **Neo** to work the existing code to-standard. After this, new work
builds **to-standard by default** — no further standardization passes.

**Scope notes:** **Generic accessibility is EXCLUDED** (parent decision — single bespoke user; §10 retired). **Haptics
(§15) = N/A** on iOS Safari (no Vibration API) — future native-wrap only. Every `file:line` below came from a read-only
audit of live code; Neo should re-confirm at the line before editing (status-discipline).

---

## ✅ ALREADY ALIGNED — do NOT re-chase (Neo shipped these in parallel)
The headline: alignment is **strong**. These are confirmed built + aligned in code:
- **Palette refresh landed** (`styles.css:2-4`) + **easing tokens defined** (`--ease-overshoot/-accelerate/-soft`, `styles.css:6`).
- **§3 button premium recipe applied** — sheen `::after`, 6px border, bevel, crisp press; **`.cta` single-primary breathe** (`styles.css:454-492`).
- **`flyReward`/magnetize coin-fly FULLY BUILT** (`game.js:434`) — pooled sprites, arc, stagger, count-up + bounce, `Sfx.coin`, full Lite/Calm/reduced-motion degradation. **The flagship "coins fly to the counter" ask is DONE**, not spec-only.
- **Treasure chests FULLY BUILT** — `CHESTS`/`chestSVG`/`openChest` with never-empty + duplicate guard (`game.js:1464-1493`), `S.chests/repTick/chestDay` migrated (`state-save.js:88-90`), daily wood "hello" gift (`state-save.js:195`), GIFTS button from Base.
- **§6.0 Mastery-not-participation contract FULLY HONORED** — coins only from *correct* answers (`trainWin`/`openChest`, never idle); `masteryFlash` is the loudest cue, fired on crossing into mastered (`game.js:172,403`); chest tiers performance-weighted (`game.js:707`); finale mastery-gate enforced via `coreWeak`/`masteryReview` (`game.js:686-731`). **No contract violations found.**
- **M-#2 Base action-rail bug FIXED** — `.basecol-hero .loadout` now has `overflow-y:auto` (`styles.css:912`). *(Re-verify on-device at 1024×768 + portrait, but the code fix is in.)*
- **Reduced-motion robust** — global kill-switch (`styles.css:567`) + per-effect guards + JS `REDUCE` short-circuits.
- **Staging + anti-gaming clean** — reward juice fires on the answer tile *after* a correct tap (not during the prompt); sound-ID prompts pass generic `display` strings so the target is audio-only (`game.js:603,817,841`). Verified in code.
- **Voice personas + no-scold correct** — roles tagged right (Noah N / Vixen V / Mom&Dad P / Leighton L / Kendall K); wrong-answer lines gentle; villains menacing-fun not cruel.
- **IA solid** — no dead-ends (global nav on every non-title screen + `⏭` + per-screen exits), zero-states handled, shallow tree.
- **Flow/pacing** — difficulty mastery-gated, always a winnable next step, 13 mission types = strong novelty cadence.
- **Act-2 medieval skin core live** (35 `body[data-act="2"]` rules) — learning tiles (Andika) correctly untouched.

---

## 🩹 QUICK WINS — cheap + high value (do these first)
1. **Voice: one-`!`-per-line sweep** of `data-lines.js` (§12). Pervasive: the whole `intro_*` set + `m4_letters`/`read_intro`/`sent_champ` (4 `!`)/`free_flip`/`rankup` run 2–4 `!`. Demote all but one to a period. Pure data, zero logic risk — the single biggest tone gap.
2. **Perf: delete the dead `.mcloud`/`mdrift` CSS** (`styles.css:433-435`, orphaned from the deleted scroll-map). §9. ⚠️ **CORRECTION (do NOT delete the PNG):** the audit called `art/bg-base-room.png` a "3.2 MB orphan," but commit `a47c54c` deliberately staged it as the **Hero Room background** — the diegetic layout that wires it is the next unbuilt slice. **Keep it and wire it**, don't delete. (A grep-for-references audit can't tell a dead asset from a staged one — a lesson for the process below.)
3. **Touch target: `#btnSkip` is 64px** (`index.html:70`) — below the **≥96px non-negotiable #2**. Restore to ≥72px visual + ~96px hit-ring; bump short `.navitem` height too. Hard-constraint fix.
4. **Contrast: add the `.txt-outline` utility** (`styles.css`) — `grep` confirms it's missing (§2/§8/non-neg #3); apply to loose labels on painted art.
5. **SFX juice (§6.5): `coin()` should ladder on a run** (thread a step index from `flyReward` so a payout pours upward, `sfx.js:43`) + **add subtle bounded variation jitter** in `note()` (±30–50¢ / volume, **ND-safe: keep small + predictable**). The kit is the thinnest standard — every cue is byte-identical today.

---

## 🎯 P1 — standard-alignment gaps
6. **SFX duck under narration** (§6.5 #4 / audio-first #8) — only `Music` ducks (`audio.js:74`); add `Sfx.duck()/unduck()` on `master.gain`, hook in `Aud.play`/`stop`. Low effort, protects the audio-first instruction.
7. **§4 modal treatment** — `#settingsPanel`/`.setcard` use a flat `#3a2d72` border; apply the spec'd **gem-purple border + outer glow** + add the `--panelDark` token (§4 / DESIGN-ENGAGEMENT §9.1, the settings game-feel pass).
8. **FTUE model-demos (§11)** — only `startMagic` is a true *I-do* worked demo; the high-leverage new skills (first **Forge/build**, first **Read/decode**, first **Blend**) just play a spoken `_intro`. Raise them to the `startMagic` bar via a shared **`introMechanic(modelFn, guidedReps, soloFn)`** helper, and **scaffold the first 1–2 reps** (drop a foil / pre-pulse the hint = the "we do" step).
9. **Finer-grained Hero Rank meter (§3 / §17 — the mid-tier cadence cure)** — `heroProgress()` only rank-ups **~3× per act** (muscle bands), so long stretches (e.g. 6 learn missions) hand only a wood chest + stars. Add a continuous **Rank-XP meter** (XP per mastered item / mission) so a celebratory level-up tick fires *most* missions — exactly where an ADHD learner disengages. Rides existing `record()`/`heroProgress`, no new pedagogy.
10. **Animation: generalize the cutscene `beatIn` push-in to `show()`** (§14) — today `show()` is a flat 600ms `.fadein` (`game.js:351`); add a staged **enter** (push-in + overshoot-token settle) + a quick **exit** so all navigation feels designed (the `beatIn` code already exists, cutscene-only).
11. **Act-2 reskin the reward modals** (§0.5) — `#heroCard` (frames **Miss Kendall, the Act-2 rescue payoff**), `#bossCage` (holds **the Vixen/dragons**), `#unlockCard` have **no `body[data-act="2"]` variant** → they render in Act-1 cosmic chrome at Act-2 moments. Add the medieval overrides.
12. **Art bible: turn `CHARACTER-ART-PROMPTS.md` prose → the numeric §13 bible** — add hard constants (head-to-body proportion, `--ink` outline weight [varies 4–6 ad hoc], the `feSpecularLighting` params + **one canonical light vector** so baked PNGs match the SVG point-light, idle-timing ranges, the §1 palette). This is the source of truth that keeps generated art on-model.

---

## 🧱 P1 — engagement build-out (spec → build; the retention core)
13. **Store expansion + de-emoji + categories** (§4.5) — `BASE_ITEMS` is still 10 flat **emoji** items (`game.js:1448`); it's also the **chest cosmetic pool**, so this enriches chests too. Add tabs / a "Featured" / original-archetype items (Star Shield…) / real SVG icons. §6.0 rule 4: gate the *coolest* items on mastery.
14. **Hero Room diorama + chest corner + weapon-rack inspect cards** (§4.2/§4.3/§11) — `paintBase` is still the flat shelf (`game.js:1308`); build the center plinth + chest corner + weapon flip-cards (**mirror the already-built ally card**) + "place + sparkle" growth feel. The action-rail prerequisite is already fixed, so the room is safe to grow.
15. **Pets/companions + customization beyond cape** (§4.4/§4.6) — no `S.pet`; only cape color exists. Add a companion + lens-tint/emblem/base-theme/hero-name (all cosmetic, mastery-gated for the best ones).

---

## 🧹 P2 — cleanup & polish
16. **Perf: `vaultpulse` animates `box-shadow` on an infinite loop** (`styles.css:996`) — the one real §9 violation; reimplement the ring as a `transform: scale()` pseudo-element + opacity. Also **drop `backdrop-filter` on the repeated/scrolling grid items** (`.shopitem`/`.gemshelf`, `styles.css:553-554`) — keep it on the static modal scrims only.
17. **Token consistency** — route `.ctrpop` counter-bounce + tile/win pops + the `flyReward` arc through the **easing tokens** (currently bare `ease-out` / inline `cubic-bezier`), §6.
18. **Art polish** — define the **idle-timing budget** + the **outline-weight constant** in the bible; ship the **4 placeholder faces** (Miss Kendall / JJ / Cal / Nora) + bodies + replace `captiveSVG`/`portalSVG` placeholders; consider **WebP** for the 6 Teddy raster tiers (~50% lighter). §13/§9.
19. **Minor consistency nit:** `GEMCOLOR` has two identical hex pairs (`e`==`ng`, `f`==`sh`, `game.js:124`) — harmless (the Andika glyph disambiguates), but nudge them apart for "a grapheme = its own color." *(NOT an accessibility item — pure consistency.)*

---

## 🧭 THE ONE STRUCTURAL ITEM — global nav rework (MR3) · P1
The global nav is still the **top-left `☰ MENU` dropdown** (`index.html:57-63`; Neo iterated the chip label to "☰ MENU" + added a ⚙️ Grown-Ups item — a good interim step). The **decided target** (STYLE.md §7 + `QA.md` MR3, parent-approved) is an **always-visible bottom-left 2-icon dock — 🏠 Base + 🗺️ Map, icon + tap-to-hear**; the chip becomes **pure status**; the dropdown is **removed**; Home/title + profile-switch move into the **gear → Grown-Up Corner**. This is the single highest-leverage navigation change for a pre-reader on a tablet (discoverability + thumb-zone), and it's fully specced. §7.

---

## Excluded (by decision)
- **Generic accessibility** — colorblind correctness-mark, `GEMCOLOR` colorblind collisions, audio-redundancy under reduced-motion: dropped per the single-user decision (§10 retired). Teddy's actual needs live in the non-negotiables + detail tiers.
- **Haptics (§15)** — no Vibration API on iOS Safari; revisit only if the app is ever wrapped native.

— Trinity, 2026-06-14 · *consolidated from 5 read-only deep-dive audits against the full design system.*
