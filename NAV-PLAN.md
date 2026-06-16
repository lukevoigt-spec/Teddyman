# NAV-PLAN.md — Navigation Overhaul (Oracle ↔ Neo)

Parent-requested redesign of the app's navigation: the upper-left menu, back/home, the HUD/statuses,
and the map all feel janky and non-intuitive. **Decision (parent, 2026-06-16): Model A — "Map = Home,
one persistent Home button."** This doc is the build spec; the Hero **Base interior is OUT OF SCOPE**
(separate project) — we only change how you get *to/from* the Base, not its contents.

Ownership: **Oracle** = visual/chrome/CSS/HTML + render-gate (§20). **Neo** = the show()/flow/handler
logic. Each slice ships as its own render-gated PR.

---

## ⚠ PARENT REVISION (2026-06-16) — FOUR FIXED CORNER BUTTONS (supersedes Model A's *layout* where they conflict)
Parent refined the model to **four fixed square corner buttons, identical on every screen** (max consistency +
big corner targets — very learnable for a 7-yo):
- **Upper-LEFT — HUD / status** (power/rank + coins + daily ring; display-only, not a button).
- **Upper-RIGHT — SETTINGS** (the Grown-Ups gear) — prominent corner, but **stays behind the math gate** (kid-locked).
- **Lower-LEFT — HOME → HERO BASE** (parent treats the Base as "home"; this goes straight to the **Base**, NOT the map).
- **Lower-RIGHT — MAP → world map.**

**Changes vs Model A:** Base and Map are now BOTH dedicated corner buttons (not "Map = Home, Base via the castle"),
and "Home" means the **Hero Base**. So drop Model A's single top-left Home→map button + castle-only Base access; the
per-screen-class "Home btn" column below becomes this fixed 4-corner set. Square buttons, ≥96px touch.

**Neo flags (for parent + Oracle to resolve):**
1. **Calm during learning — RESOLVED (parent 2026-06-16, final): on learning screens HIDE the HUD/status cluster only;
   KEEP the three nav buttons (Home→Base, Map, Settings) visible.** Parent's call: the static corner *buttons* don't
   hurt learning, but the **HUD** (power/rank + coins + daily ring) is the dynamic, reward-signaling element that pulls
   focus from the decoding prompt — so on **learning screens** (find/read/forge/trace/spell/sentence/cloze/scramble/
   magic/syllable/fortress/scan/warmup) the **HUD is hidden** (honors the seductive-details guardrail + §6.0 "reward
   AFTER the rep", and resolves G2). The **Home / Map / Settings** corners stay (Home satisfies hard-constraint #8's
   always-a-Home-button escape). **Replay (`.ear`) + Skip (`#btnSkip`, ≥96px)** remain the most prominent interactive
   elements (the learning loop + audio-first lifeline, flow()/watchdog-driven so it can never hang). **Refinement
   (Trinity): render the three nav corners visually RECESSIVE on learning screens** (smaller / lower-contrast) so Replay
   stays the focal control and the prompt keeps the eye — keeps the parent's "buttons stay" intent without letting 5
   controls compete (principle #4 / G6). Implementation: `show()` adds `body.learning` → CSS hides the HUD cluster +
   dims the nav corners; Replay/Skip stay full-strength.
2. **Settings stays math-gated** even though it's now a prominent corner — the child must not wander into the parent area.

Ownership unchanged: **Oracle** builds the corner-button chrome (render-gated §20); **Neo** wires the handlers
(lower-left → `showBase`, lower-right → `toMap`, upper-right → the gated Grown-Up Corner). The diegetic castle-on-map
Base entry can remain as a secondary path; the lower-left HOME button is primary.

---

## ✅ PEDAGOGY REVIEW — BINDING GUARDRAILS (Trinity, 2026-06-16; parent-requested alignment check)
The four-corner model is **approved for hubs** (Map / Base / Win / Rest) — fixed identical big corners is textbook
kids-UX (5–8-yos fail at hidden nav; consistency is the biggest win, doubly so for a pre-reader with a language delay).
The Title single-PLAY fix and Rest→map fix are clean wins. The model is bound by these rules so it can never compete
with objective #1:

- **G1 (RESOLVED, parent final). On learning screens: hide the HUD/status; keep Home/Map/Settings + Replay/Skip; render
  the nav corners recessive.** See the resolved flag #1 above. Rationale: the dynamic reward-signaling HUD is the real
  cognitive-load/seductive-details risk on the prompt; static corner buttons are not (CLAUDE.md "learning moment stays
  calm/uncluttered"; PEDAGOGY.md cognitive-load guardrail). Keeping Home also satisfies hard-constraint #8 (always a
  Home escape). Replay stays the focal control.
- **G2. RESOLVED by G1** — hiding the HUD removes the coin tally + daily ring from the prompt, which was the §6.0 point
  (reward mastery AFTER the rep, never decorate the active word with the score). No separate work; just don't reintroduce
  a coin/ring on learning screens.
- **G3 (resolves Neo flag #2). Settings keeps the fixed upper-right POSITION but LOWER visual weight** than the three kid
  buttons (principle #6 — parent area stays low-prominence). Stays math-gated. A big equal-weight gear invites an
  ADHD/OCD child to fixate on / hammer a locked gate.
- **G4 (parent override 2026-06-16: ICON-ONLY, NO words/labels).** Standard, instantly-recognizable, quiet icons —
  **a HOME (house) icon for the Home→Base button, a MAP (folded-map) icon for the Map button, a GEAR for Settings.**
  No text labels. Crafted SVG in ONE consistent line/weight (`icon()`/`PICONS`, art.js — NOT emoji, non-negotiable #6),
  sized for ≥96px touch, calm (not noisy). Pedagogy note (the original icon-alone concern, now mitigated, not dismissed):
  a pre-reader learns these because (a) house vs folded-map vs gear are genuinely distinct universal shapes, (b) they
  sit in a FIXED corner every screen so position teaches them too, and (c) first taps can speak the destination via the
  existing audio (audio-first #8). Keep the house and the map visually unmistakable from each other.
- **G5. Locked-node tap feedback stays gentle/encouraging, never a harsh-fail buzz** (constraint #2). "Not yet — finish
  here first," a soft shake + the `locked_tip` cue — visible state (principle #7) without a punitive tone.
- **G6. Control-count budget ≤3–5 per screen (principle #4).** On Base sub-screens the one-level BACK should REPLACE the
  lower-left HOME corner (don't show Home + Back + Map + Settings + status all at once).

---

## Principles (research-backed — sources at bottom)
1. **One persistent nav element, same place every screen.** Kids 5–8 do worse with hidden nav; never make them hunt.
2. **The World Map is HOME (the hub).** Everything radiates from it. Collapse today's three "homes" (Title / Hero Base / Map) into one.
3. **Kids don't use "back" — they need one obvious HOME** that always rescues them. Always visible (except mid-prompt).
4. **Literal icons**, large targets **≥96px**, **≤3–5 options**, no clutter. *(Persistent nav corners are ICON-ONLY — no
   text labels — per parent override 2026-06-16; see G4.)*
5. **Keep the learning moment calm** — during an active prompt, chrome shrinks to: Home + Replay + slim status. (Honors the seductive-details guardrail.)
6. **Parent area is low-prominence + gated**, separate from the kid's nav.
7. **Clear, visible state + feedback** — map node done/current/locked must read *visually*, not only via audio.

---

## Target system (Model A)

### Persistent chrome (every screen except the bare Title splash + active learning prompt)
- **HOME button** — fixed corner, ≥96px touch. **House icon, no label** (G4). (Per the four-corner revision the HOME
  corner goes to the **Hero Base**; the **Map** corner has the folded-map icon → world map.) Replaces the `#hudTitle` hamburger + `#navMenu` dropdown entirely.
- **STATUS cluster** — top-right, fixed. Power/rank + coins (+ the daily-training ring), identical on every screen. Display-only (not a button) for the child.
- **GROWN-UPS** — a small gear, bottom-corner, low-prominence, behind the existing math gate. Not part of the kid's primary nav.

### Per screen-class
| Class | Screens | Home btn | Status | Other nav |
|---|---|---|---|---|
| **Hub** | scrMap | (Map *is* home — no Home btn; show a small **Hero Base** affordance = tap the castle) | full status + daily ring | tap zone = play; tap castle = Base |
| **Base + sub** | scrBase, scrTrain, scrVault, scrScroll, scrWarmup | HOME → map | status | one-level **← Base** back on the sub-screens (Train/Vault/Scroll/Warmup); consistent label "BACK" + shield icon |
| **Learning** | scrLetter…scrForge, scrFind, scrRead, etc. | HOME → map (small, calm) | **slim** status only | Replay (.ear) + Skip; NO menu |
| **Cutscene** | scrIntro, scrInter | SKIP/▶ only (no Home — it's a linear beat) | hidden | single Next/Skip |
| **Title** | scrTitle | n/a | n/a | see Title fix below |
| **Win/Rest** | scrWin, scrRest | HOME → map | status | primary CTA (Next Mission / Map) |

### Component specs
- **Home button behavior:** `navGo(toMap)` — close any overlay, stop audio, clearFlow, go to map. Same handler everywhere.
- **Base access (diegetic):** primary path = tap the **castle/Base building on the map**. Remove "Hero Base" + "Home" as separate menu items (the hamburger is gone). Keep a Base entry from the Title for the parent shortcut if desired (low-prominence).
- **Back, one level:** Base sub-screens keep a single "BACK" → Base (already consistent in code → `showBase()`); relabel from "BACK TO BASE" to just **"BACK"** with the shield icon (shorter, clearer; the destination is obvious).
- **Skip button:** bump `#btnSkip` 64→**≥96px** hit area (visual ~72 + transparent ring like `.ear::after`). Accessibility fix (#2/#6).
- **Map node states:** done = ✓ medallion, current = pulsing, locked = padlock **+ a brief visible tooltip/shake on tap** (not only the `locked_tip` audio). (Dovetails with the "map not premium" backlog.)
- **Title START/CONTINUE fix (parent's long-standing complaint):** ONE primary **PLAY** that does the right thing (first run → intro; returning → straight to the map). Drop the duplicate/ambiguous second action. The little "Hero Base" shortcut under PLAY (parent disliked it) is removed — Base is reached from the map.
- **Rest → Title dead-end:** after Rest "Done", return to the **map** (home), not the bare Title that forces a re-tap of PLAY.

---

## Slice plan (each = its own render-gated PR)
1. **HOME button + kill the hamburger** *(Oracle chrome + Neo handler)* — add the persistent Home button to the HUD, route to map, remove `#navMenu`/`.navitem`/`#hudTitle` dropdown. Move Grown-Ups to the corner gear. Render-gate: every screen-class shows Home in the same spot.
2. **Status cluster unify** *(Oracle)* — one status component (power/coins/daily) in the top-right, consistent across screens; slim variant for learning screens. De-emoji the `⚡`/coin here (folds in the HUD emoji batch).
3. **Title flow fix** *(Neo logic + Oracle visual)* — single PLAY (first-run vs returning); remove the under-PLAY Base shortcut + the START/CONTINUE ambiguity.
4. **Back/label + Skip size** *(Oracle)* — "BACK TO BASE" → "BACK" (+shield); Skip ≥96px; Rest→map.
5. **Map node states + locked feedback** *(Oracle visual + Neo)* — visible done/current/locked + on-tap feedback for locked. (Coordinates with the map-premium work.)
6. **Cutscene button** *(Neo)* — calm the overloaded `btnInterNext` labels (consistent "Next ▸" / final "Done").

---

## Sources
- Mobile App Navigation Design — 2026 UX best practices (persistent nav, same location): medium.com/ui-ux-designing-trends
- Game UI/UX best practices (HUD must not obstruct; keep it simple): wayline.io, aaagameartstudio.com
- UX for Kids (kids press the device Home, not in-app back → always show a clear home; literal icons; ≤3–5 options; large targets; tap feedback): usertesting.com, aufaitux.com, uxmag.com, gapsystudio.com
