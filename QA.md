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
    serving over http + driving the game's own nav fns. **Local desktop only** (Chromium
    download is firewalled in the cloud env).
  - `tools/gen.mjs` — generate character art from a prompt via `XAI_API_KEY` or `OPENAI_API_KEY`
    → `art/incoming/`. Local only; keys never committed.
  - `tools/README.md` = setup. `art/CHARACTER-ART-PROMPTS.md` = house style + per-character
    generation prompts (the "generated heroes" pipeline).
- **Workflow for art:** edit `art.js` → render with `svg-shot.mjs` → Read the PNG → iterate →
  commit. On the desktop, also `shot.mjs` for full composed screens. The parent can run the
  harness and share PNGs back if the working instance is the cloud one.

### Decisions locked with the parent (2026-06-14)
1. **Art direction = "sweep + generated heroes".** (a) Apply a premium *shading pass* to the whole
   cast in-SVG (form-shadow/volume, ambient occlusion, rim light, scene under-glow, deeper
   gradients, catchlights — see the dragon for the reference technique), AND (b) pursue
   GENERATED RASTER art for marquee likenesses (Teddy + real family) via ChatGPT Pro / Grok
   (the parent has both) — Claude masks/frames/animates + wires them in, then render-verifies.
2. **Pacing = full re-tune** (it was heavily front-loaded). DONE: muscle curve now act-relative
   (tier1 ~28%, tier2 ~60% of the act) instead of maxing at 7 of ~53 missions. STILL TO PROPOSE
   (parent wants specifics before save-affecting changes): spread GEAR unlocks (belt/boots/
   hammer/sword all land in the first ~8 missions today) and FRIEND-RESCUE timing (most friends
   free in the first ~17 missions, then a drought to the finale) across the whole campaign.
3. **Desktop infra:** parent is setting up a Windows 11 Pro box with Claude Code + Node + the
   tools harness; use **same-dir** (not worktree) for our serialized single-branch workflow.
   Image-gen path depends on GPU: NVIDIA 8GB+ → local ComfyUI; else → Grok/OpenAI API via gen.mjs.

### Shipped this session (all live on main)
- Hero cards: real-life outfits (Ellie gymnast / Amelia dress / Leighton flowery princess /
  Archie sporty + shaggier hair); allies speak a signature line when tapped.
- New equippable **weapons**: Lasso + Gem Bow (Act 1), War Mace + Joust Lance (Act 2), unlocked
  off existing milestone gear (no new save ids). `WEAPONS[]`/`ownedWeapons()` in game.js.
- Villain polish: fierier auras; dragon aura blue→fire; removed Lord Vex's stray "?" marks;
  **dragon elevated** with the full shading pass (proof technique).
- **Settings overhaul**: game-like Grown-Up Corner — icon tabs/headers, sliding On/Off SWITCHES
  (sfx/music), a 3-way SEGMENTED Full|Calm|Lite picker, polished cards/sliders.
- **Test hardening**: curriculum.test.js now 35 checks incl. lock-enforcement (mapPaintSVG marks
  future zones .locked + skip-via-tamper guard). save.test.js 33.
- Earlier: time-portal cutscene, combo-lock fix, button fill-clip fix.

### Next actions (priority order)
1. Continue the **shading-pass sweep**: Vixen + Lord Vex (match the dragon), then the four family
   bodies + `allyFace`. Render-verify each with `svg-shot.mjs`; send the parent a fresh cast sheet.
2. Get a **real-game screenshot** pass on the desktop (`node tools/shot.mjs` + `--webkit`) — first
   look at composed screens; QA layout/Safari issues.
3. Draft the **gear + friend-rescue pacing** re-tune for parent approval (save-safe: derived from
   done missions; reassigns GEAR_AT keys + ally rescue missions, no id renumbering).
4. First **generated-hero** test (Vixen or Teddy) once the gen path is set.

### Guardrails (unchanged)
- `node tests/curriculum.test.js` + `node tests/save.test.js` must pass before any push (exit 0).
- Never push broken code (auto-deploys to the child's iPad within minutes). Small, plain-English
  commits. Develop on the feature branch, fast-forward main, deploy.
- API keys / tokens NEVER committed (`.env`, `art/incoming/`, `tools/node_modules` gitignored).

---

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
> - **#1 cloud auth — STILL PENDING the parent's decision** (see the proposed fix below). Not yet implemented.
> - Suites green at time of verification: **curriculum 40, save 39.**

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
