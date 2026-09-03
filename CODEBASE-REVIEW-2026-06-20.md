# CODEBASE-REVIEW-2026-06-20.md — full review: opportunities for improvement

> Commissioned by the parent ("do a full review of the codebase and identify areas we may have opportunities for
> improvements"). Five parallel reviews (architecture · correctness/robustness · hard-constraint & pedagogy compliance ·
> performance/asset budget · tests/CI/security/docs), every finding **verified in code with `file:line` evidence** on
> `main` @ `d6f469b`. ~50 raw findings consolidated into **12 owner-assigned Issues (#184–#195)** plus the still-open
> **#182**. Ranked by impact on the North Star (Teddy learns to read → hard constraints → data safety → security →
> performance → maintainability). — Trinity, 2026-06-20

---

## Executive summary

**The app is in good shape where it matters most** — the reading ladder is complete, the anti-gaming prompt rule, foil
sourcing, no-timers rule, parent PIN gate, save escaping, and Worker auth all verified clean. But the review found four
things that need attention **before** more feature work:

1. **A false "done" on the board.** `#182` (the parent's "mastery above all" per-word gate) is marked SHIPPED but **is not
   built** — the commit cited is a docs-only PR. It stays the lead pedagogy item. (Corrected in KANBAN/PLAYTEST.)
2. **Three P0s:** a GitHub *write* token to `main` persisted in localStorage on the public site (#184); CI cannot block a
   bad deploy — Pages ships `main` on push regardless of a red ✗, and there is no boot smoke, so the last three regressions
   were invisible to tests by construction (#185); and a **progress-loss path** where a stale iPad's first tap overwrites
   newer cloud progress (#186).
3. **The learning integrity has real holes** (#187/#188): the mastery review can be passed by tapping a *single* gem;
   participation taps (magic-e cast / chop / scroll) are recorded as mastery and can clear the Act-2 finale by tapping
   alone; the listen-first gate is still missing on every encode task **and on the finale reading proof**; constraint #2's
   2-miss pulse is absent in boss/forge/scramble; scramble never records a rep.
4. **One structural root cause** explains most of the recurring drift: the answer-round logic is hand-copied across ~15
   handlers (30 tile builders, 11 miss counters). A single `choiceRound()` helper (#189) makes every gate and wrong-answer
   rule uniform by construction — it is the biggest single win and the prerequisite for finally slimming `game.js`.

**Recommended order:** #182 + #187 + #188 (pedagogy integrity, small) → #184/#185/#186 (P0s) → #189 (root cause) →
#190 (robustness) → #191/#192/#193 (perf: SW · voicepack/fonts · asset diet) → #194 (Worker) → #195 (hygiene).

---

## What's verified CLEAN (no finding — worth knowing)

- **Anti-gaming #4:** every sound-ID prompt is a generic string; the target is audio-only; tiles carry `dataset.g` but no
  visible text/aria/title (`game.js:1183, 1209, 1460, 2629, 2562, 890`).
- **#5 foils** come only from `taughtGraphemes()/taughtLetters()` in every handler. **No timers-as-failure** anywhere
  (the scroll "NEW BEST" is silent flair). **#8** every screen has an `.ear` that re-arms the gate; `#btnSkip` via `flow()`;
  nav stays tappable under `body.learning`.
- `flow()` re-entry/skip/stop ordering is correct; `sidArm`'s generation counter is applied on find/boss/fort/read/train.
- **Parent gate** exists and is sound (2-digit math with regrouping, 5-min session, re-challenge on background,
  `game.js:2876-2887`); `removeProfile` refuses `teddy`; Reset snapshots first.
- Profile names use `textContent`/`escHTML` everywhere; playtest text never hits `innerHTML`; cloud saves pass through
  `migrate()` and are consumed via lookups, never rendered. No API-key literal ships in any file.
- Worker: constant-time bearer compare, fail-closed 401, 300 KB cap; the SW never caches cross-origin/cloud responses.
- Burst/confetti/fly elements self-remove (pools capped); no per-round `addEventListener` growth; `save()` cost is ~22 KB
  stringify per tap (fine); hidden screens are `display:none` so their animations don't run; Lite strips the GPU filters.
- Every `pic-*`/`squish-*`/`ally-*` asset set matches its manifest exactly (no missing, no unlisted).
- Suites: curriculum 134 · save 141 · ui-emoji 25 — all green; CI syntax-checks every file, Node 20 pinned.

---

## Tier 0 — act first (P0)

| # | Finding | Owner | Effort |
|---|---|---|---|
| **#184** | **GitHub write-token to `main` in localStorage on the public site** (`audio-studio.js:373`, prefilled into password fields `:421`, `playtest.js:89`); no scoping/expiry guidance exists (`cloud/README.md` never mentions "token"); Studio **publishes straight to `main`** via the refs API, bypassing PRs/CI (`audio-studio.js:367-372`). → fine-grained repo-only token, 90-day expiry, publish to a `voicepack` branch + auto-PR, opt-in remember, branch protection. | Neo + parent | M |
| **#185** | **CI cannot block a bad deploy** — no Pages deploy workflow (Pages ships `main` on every push regardless of ✗); **no boot/integration smoke** (only 3 of 23 `start*` handlers touched by any test; `show/flow/missionComplete/showWin/fortRound` = 0 coverage; the DOM-free harness was blind to the win-chest `display:none`, fortress double-fire, and re-arm regressions); **no lint** — a real data bug: `word_tent` defined twice in `data-lines.js:75/:110`. → gated `deploy-pages`, a Playwright smoke with the six regression assertions, ESLint (`no-dupe-keys/no-undef`), invariant tests (script order · unique LINES ids · art refs exist), an asset budget. | Neo | M |
| **#186** | **Boot-window cloud clobber (data loss, constraint #7):** `record()→save()` stamps `S.ts` before `__bootPull` resolves (`state-save.js:140,185`), so a stale iPad's first tap makes the cloud save look "older" and the next push overwrites a week of progress. Also `migrate()` returns `null` for any `v!==1` (`:75`) — one careless version bump wipes every device. → compare against the disk-loaded ts; union-merge `done/gear/freed/owned` + max-of-mastery; tolerate any numeric `v`. | Neo | M |

## Tier 1 — learning integrity + the structural fix (P1)

| # | Finding | Owner | Effort |
|---|---|---|---|
| **#182** | **Per-word mastery gate — NOT BUILT** (false "shipped" on the board; verified: no gate code, `masteredItem` unchanged at `game.js:257`, gate still milestone-only). The parent's "mastery above all" ask. Spec in `RESEARCH-GATING-MASTERY.md` §C. | Neo | M |
| **#187** | **Pedagogy-integrity holes:** (1) mastery review mashable with a **single gem** — `masteryReview` passes a 1-item pool as the foil set (`game.js:1185, 1050`); fresh profile gets 1–2-tile find/boss on missions 0–1. (2) **Participation recorded as mastery** — `castMagicE:1691`, `magicStep:1674`, `chopWord:1722`, `scrollTap:2492` call `record(…,true)` on every tap; via `coreWeak→masteryReview→startMagic` the **Act-2 finale gate clears by tapping**. (3) bonus coins on non-answers (`burstAt` from chop/trace). (4) constraint #2's 2-miss pulse missing in boss/forge/scramble. (5) scramble records **nothing**; `warmSegment` misses unrecorded; `nextScan` paints `.win` on a WRONG tap. | Neo | S |
| **#188** | **Listen-first gate still missing** on every encode task where the word is NOT on screen (`forgeWord:1645`, `practiceSpell:1317`, `fortSpell:1496`, `vaultBuild:2650`, `warm*:2538-2565` — `warmIsolate` is a raw sound-ID with no gate at all) **and on the finale reading proof** (`fortRead:1479`, `fortMaze:1521`, `fortSentencePic:1532`) → the "proven proficiency" win is tap-mashable. Also `sidReject` rejects **fast-correct** taps <450 ms (punishes the automaticity #182 must measure). | Neo | S |
| **#189** | **ROOT CAUSE — `choiceRound()`:** the answer round is hand-copied across ~15 handlers (30 tile builders, 21 dim blocks, 17 hint blocks, 11 miss counters, 20 inline shuffles next to an existing `shuf()`); the copies have already drifted (the #188 gaps, the #187 pulse gaps). One helper in `round.js` owns tile build → `sidArm` → `sidReject` → record → win/dim → hint@2 → replay. −300 lines; every gate rule uniform by construction; prerequisite for extracting the handlers from `game.js`. | Neo | M |
| **#190** | **Robustness:** Reset/Restore/switchProfile mid-mission never `clearFlow()` → `missionComplete()` fires against the fresh save (`game.js:2912-2916, 930`); un-guarded short timers (`:1195, 1268, 1656, 896, 2448`) repaint the wrong screen after Home; `combo/curMiss/__wedo` leak across activities; `burstAt(null)` TypeError before `flow()` strands a forge/boss word with no Skip (`:1654-1656, 1223`); 1.8 s TTS guard may cut the first iOS utterance (`audio.js:114`); two swallowed catches hide real bugs (`:2853, :1009`); magic numbers → `TUNE`. | Neo | S |

## Tier 2 — performance on a real iPad (P2)

| # | Finding | Owner | Effort |
|---|---|---|---|
| **#191** | **Service worker** caches every same-origin 200 forever under one hand-bumped name, **re-writing the 28 MB voicepack + 11.6 MB mp3s on every boot**, no byte cap (Safari evicts at this size → offline unreliable), and **offline version skew** (index N+1 with game.js N). → versioned shell precache + LRU art cap + never cache voicepack/mp3 whole. | Neo | S |
| **#192** | **`voicepack.js` = 28.8 MB (21.3 MB gz), fetched + parsed on EVERY boot** (~9 s wifi / ~35 s LTE; ~55–60 MB resident; blocks DOMContentLoaded); only 401 of 626 lines have clips. → `voicepack-core.js` (snd/sw/prompts = 2.8 MB measured) + lazy per-prefix chunks in the existing `VStore` IndexedDB. **Fonts:** render-blocking cross-origin Google CSS with `display=swap` → **letter tiles FOUT then reflow when Andika lands** (a pedagogy issue; Andika is mandatory) → self-host, `font-display:block` for Andika. | Neo | M |
| **#193** | **Asset diet:** `art/` = 183 MB — 51 Teddy PNGs at 1024² (**88 MB**) shown at ~240 px; 15 legacy squishies at 1024² (22.9 MB) shown at **64 px**; weapons/capes/fists 1024² → 54 px; `gem-base.png` 1.46 MB mask-decoded per gem; a 1.72 MB apple-touch-icon; 4.4 MB of orphans. → ~25 MB with 512²/320² WebP. Plus **touch targets under 96 px** (`#btnSkip` 72 px, spell/train/vault tiles 72–92 px, `.rletter` 64 px — constraint #6), a rendered "♥" OS glyph (`styles.css` isn't in the emoji scan), and **443 raw hexes vs 14 tokens** + 29 dead selectors in `styles.css`. | Oracle | M |
| **#194** | **Worker hardening:** `Access-Control-Allow-Origin: *`, unvalidated PUT body (a non-JSON write poisons every device's pull), no rate limit. → origin allowlist, JSON/ts validation, rate-limit rule. | Neo | S |

## Tier 3 — hygiene (P2/P3)

| # | Finding | Owner | Effort |
|---|---|---|---|
| **#195** | **Docs drift** (`CLAUDE.md` says game.js ~1255 lines → 2919; "Voice Studio NOT in this repo" vs shipped; `masteredItem` thresholds wrong; dangling `HERO-BASE-PLAN.md`); **no ARCHITECTURE/onboarding doc**; completed specs at root → `docs/archive/`. **Dead code** (`sidStart, closeNav, isDigraph, isVowelTeam, nodeOf, chestSVG…` + 4 bindings for ids that no longer exist); **dev pages on the public site** (`hero-lab/style-lab/base-mock*/voice-studio.html`); load order copied in 3 places with silent-break lines; `"use strict"` in 2/15 files; **`sent_<ix>` keys shared across every sentence mission** (a real keying bug); 47 stale remote branches; playtest-note text should be declared *data, not instruction* in `AGENTS.md`. Then the `game.js` extraction order (juice → parent → story → base/train → handlers last, after #189). | Trinity + Neo | M |

---

## Notes on method + honesty
- Every finding above was read in code; the correctness reviewer additionally executed the foil/tokeniser/migrate cases in
  the tests' `vm` harness. Items the reviewers could not fully verify are marked in the Issues ("plausible-unverified": the
  1.8 s TTS guard; on-device tile pixel sizes need `tools/shot.mjs`; XSS was traced by sample, not exhaustively).
- Nothing here changes the shipping app until each Issue lands through the normal PR + render-gate path. The app stays
  live and playable throughout; the P0s are process/data-safety, not "the game is broken."
- Board corrected the same day: `#182` moved back to OPEN/lead; this review wave sequenced in `KANBAN.md`.
