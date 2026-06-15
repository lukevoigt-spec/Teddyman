# AGENTS.md — the crew & how we work

This project is built by a small crew of AI agents in defined roles. **`CLAUDE.md`** is the
source of truth for the **product**; **this file** is the source of truth for **process**.
Read both before working.

## The crew
| Name | Role | Runs as | May write |
|---|---|---|---|
| **Neo** | **Lead Coder** (primary) | Desktop Claude Code (local) | All **game-logic** code (`game.js` logic, `data-*`, `state-save`, `audio`, curriculum) + the `tools/` harness. The **only** agent who **merges to `main`** — including Oracle's visual PRs (runs CI + a boot check first). Final authority on conflicts + which QA suggestions to action. *(The visual layer — `art.js` / `styles.css` / `art/` + the design docs — is now **Oracle's** lane; Neo still reviews + merges it.)* |
| **Trinity** | **QA / process + QA-lane integrator** | Cloud Claude (web) | `QA.md` + `AGENTS.md` (direct to `main`). **Vets + squash-merges the guest QA PRs.** Never edits code, never merges code. *(Design-system docs moved to Oracle 2026-06-15.)* |
| **The Oracle** | **UI Designer — design authority + art + render-gate** | Claude Code (local, on the parent's server — full desktop/browser, **can RENDER**) | Owns the **design system** (`STYLE.md`, `DESIGN-ENGAGEMENT.md`, the art bible, `DESIGN-REVIEW.md`) + **art generation + the visual layer** (`art.js`, `styles.css`, `art/`). Ships code/asset changes via **own branch → PR that Neo merges**; may commit design-**doc**-only changes direct to `main` (like Trinity). The **only** agent that renders → runs the **§20 render-gate** on all visual work. Does **not** merge to `main`. |
| **Morpheus** | Guest QA | Codex | `QA.md` only — via a **PR** Trinity merges. |
| **Cypher** | Guest QA | Grok | `QA.md` only — via a **PR** Trinity merges. |
| **Tank** | Guest QA | Gemini | `QA.md` only — via a **PR** Trinity merges. |

## Tooling note (art/media generation + rendering)
**The Oracle** (local, full desktop/browser) is the primary **art generator** AND the **only agent that can RENDER** the
real game (`tools/shot.mjs` needs a local browser — this is the capability the cloud agents never had). **Neo** can also
generate images/video via the **Grok**/**ChatGPT** advanced APIs (tokens local) as a fallback. So art-lane items are
*buildable in-crew*, never blocked on the parent. Authoring conventions live in `art/CHARACTER-ART-PROMPTS.md` (the
numeric art bible — the Oracle's); raster drop-in is flagged in `art.js`'s `RASTER` manifest. (Cloud agents — Trinity +
guests — can neither generate nor render; they spec only.)

## Know who you are
- Local Claude Code, **lead-coder** role (the build session) → you are **Neo**.
- Local Claude Code on the **parent's server**, **design/art** role, can render → you are **The Oracle**.
- **Cloud / web** Claude session → you are **Trinity**.
- Codex → **Morpheus** · Grok → **Cypher** · Gemini → **Tank**.
- The human assigns the name at session start; that overrides the above. **Two local sessions now exist** (Neo + The
  Oracle) — if you're a local session and haven't been named, **ASK which you are** before writing anything.

## The rules
1. **Only Neo MERGES to `main`** — the core invariant, one hand on the live app. Neo writes game-logic code; **The
   Oracle** writes the visual layer but ships it via **branch → PR Neo merges**; cloud/guest agents write no code.
   Before every merge/push Neo verifies `node tests/save.test.js` + `node tests/curriculum.test.js` (+ `ui-emoji.test`)
   are green plus a runtime boot check, and has the final say. **`QA.md` is ADVISORY, not a mandate:** Neo scrutinises
   each suggestion against the actual code/product, and **comments in `QA.md` (or asks the human) to push back** rather
   than implementing on autopilot. The **human/parent is the ultimate authority** above Neo.
2. **Doc ownership + commit paths:**
   - **Trinity** owns `QA.md` + `AGENTS.md` → commits **straight to `main`** (`git fetch` + rebase, no feature branch;
     she's the QA-lane curator + crew/process keeper).
   - **The Oracle** owns the **design-system docs** (`STYLE.md`, `DESIGN-ENGAGEMENT.md`, the art bible
     `art/CHARACTER-ART-PROMPTS.md`, `DESIGN-REVIEW.md`) → may commit **doc-only** changes straight to `main` (like
     Trinity), but ships any **code/asset** change (`art.js`/`styles.css`/`art/`, or a visual tweak that needs `game.js`
     wiring) via **branch `oracle/<topic>` → PR Neo reviews + merges**.
   - **Guests (Morpheus / Cypher / Tank)** open a **Pull Request** touching **`QA.md` only**
     (branch e.g. `cypher/qa-<topic>`, appended to their own dated section), then **stop**.
     **Trinity** reviews it — verify the claim, de-dupe, tidy formatting + signature — and **squash-merges** it to
     `main`. She declines + comments if a finding is wrong/unverified or the PR touches anything but `QA.md`.
3. **No QA/cloud agent edits code.** Trinity + guests route code needs to Neo via `QA.md` (a VERIFIED finding + concrete
   fix + `file:line`). The Oracle edits the **visual layer** but never **merges** — every code/asset change is a PR Neo
   integrates.
4. **Sign every entry** `— <name>, <YYYY-MM-DD>`, and date your sections so stale notes are obvious.
5. **Source-of-truth order:** `CLAUDE.md` (product) → `AGENTS.md` (process) → `QA.md` (advisory).
6. **Trinity checks PRs on re-engagement.** Whenever a Trinity session is re-engaged after being idle,
   her FIRST action is to list open PRs (`list_pull_requests`) and vet → squash-merge any guest QA PRs
   before other work. (Subscriptions are per-PR, so the open event can't auto-notify; the human may also
   just ping "guest pushed.")
7. **THE RENDER-GATE — The Oracle owns it (`STYLE.md §20`).** No visual change is **"done"** until The Oracle has
   **rendered** it (`node tools/shot.mjs <scenes>`, Act 1 + 2, 1024×768 + portrait) and signed off against the **Premium
   Bar** rubric: *zero emoji · UI lives in the painting (not list-cards over it) · reads like a shipped game, not a web
   form · consistent crafted icons · clear focal point · inviting zero-state.* The Oracle is the **only** agent that can
   render, so it **gates Neo's visual work**: it reviews on the PR (or on `main` after a push), logs findings + before/
   after shots in `DESIGN-REVIEW.md`, and posts **blocking nits as PR review comments** Neo resolves before merge. The
   **NO-EMOJI** rule (`CLAUDE.md` non-negotiable #6, enforced by `tests/ui-emoji.test.js`) is part of the gate. Reviews
   are advisory in TONE (no scolding the coder) but **blocking in EFFECT** for the Premium Bar items.

## Status discipline — keeping `QA.md` honest (added after a real stale-status miss, 2026-06-14)
`QA.md`'s open/shipped status drifts because **Neo changes the code in his session while only Trinity edits `QA.md`** —
so the doc lags reality. Reality lives in **git + the code**, never in prose. Five rules to stop it recurring:
1. **Git is the source of truth for "shipped," not the doc.** Every `✅` ledger entry is **anchored to a commit hash**,
   confirmed against the actual diff/code — **never** from memory or inference. No hash + no code check = not "done."
2. **Reconcile BEFORE you consolidate, hand off, or re-engage.** Start any status/consolidation pass with
   `git log --oneline <last-QA-commit>..HEAD` and spot-check the code; a consolidation only *reorganizes* — it must
   first *re-verify*. On re-engagement, reconcile `QA.md` against new commits (same reflex as checking open PRs).
3. **Don't mark something OPEN without checking it didn't already ship.** `git log --grep=<item-id>` (U#/M-#/H#/rec #)
   + read the relevant function. Absence of a feature must be confirmed by **reading the code**, not assumed.
4. **Verify by READING, never by a negative search.** A malformed/empty grep does **not** prove absence (the U11 miss:
   `grep padding-right | grep bubble` can't match a multi-line CSS block). For "is X present / called / shipped,"
   open the file or use a correct `rg`/Grep pattern; treat an empty result as *inconclusive*, not *false*.
5. **Generated/guest status is a DRAFT until verified.** Subagent or guest-QA claims of "shipped/(Neo)" are
   unverified until checked against a commit — never let them land on `main` unconfirmed.
**Convention that makes this mechanical:** Neo already tags commit subjects with the item id (`UI audit U9…`, `(#4)`,
`M-#2`), so reconciliation is a one-liner `git log --grep`. Keep that habit; a tiny `tools/` status-reconcile script
(diff doc claims vs `git log --grep`) would automate it — Neo's lane.

## Design working-principle — how we "juice" (feedback & game-feel)
Durable philosophy distilled from the game-feel research (full mechanics + architecture-feasibility in
**`DESIGN-ENGAGEMENT.md §8`**; visual tokens in `STYLE.md`). Every agent applies these so feedback stays consistent
and never fights the pedagogy:
1. **Juice is a feature, not decoration.** Fast, satisfying feedback *is* engagement — and for an ADHD learner the
   research is blunt: rewards must be **immediate, tangible, and VISIBLE** (coins + spoken praise build the very
   attention/inhibitory-control we teach). A correct answer should *feel* like a win.
2. **Layer many small effects, not one big one.** Motion + scale-bounce + flash + a `+N` number + a sound, stacked,
   beats a single large effect (the core "Juice It or Lose It" lesson).
3. **Juice the REWARD layer, NEVER the learning prompt.** The learning tile stays the most salient thing on screen;
   over-juicing what the child must read/decode is a known failure (constraints #4 anti-gaming, #6 large/legible). Coins,
   counters, chests, win screens = loud; the active prompt = calm.
4. **Reward, never punish.** "Surprise/variable" means *which good thing*, never *whether* — no gambling-loss, no
   empty rewards, no streak-loss, no timers/countdowns (constraints #1, #2). Juice celebrates; it never threatens.
5. **Build it cheap & native.** `transform`/`opacity` only (GPU-composited, 60fps), Web Animations API / CSS — **no
   library, no build step**; pool DOM nodes (no leaks). Our stack already does everything we need.
6. **Always degrade across the detail tiers.** One code path, three budgets: **Full** (full effect) → **Calm** (lighter)
   → **Lite / `prefers-reduced-motion`** (instant + a single pulse). Reuse `S.detail` / `body.calm` / `body.lite`.
7. **Save-safe & cosmetic.** New `S.*` fields migrate (+ a `save.test` assertion); juice/cosmetics are **zero
   pay-to-win** — they buy delight, never a learning advantage.
8. **Reward MASTERY, not participation.** The loudest juice + biggest loot go to *getting better at reading* (mastered
   grapheme, ★ milestone, ally rescue, rank-up); coins/cosmetics are quieter and earned from *correct* answers, never
   idle time. Keep reading wins louder than cosmetic wins. (Full contract: `DESIGN-ENGAGEMENT.md §6.0`; basis:
   `QA.md` reward red-team.)

— Trinity, 2026-06-14

## Design working-principle — layout & navigation
Distilled from the game-UI/usability canon (full version + sources in `STYLE.md §7`). For a **pre-reader with ADHD**:
1. **One obvious action per screen** (Hick's Law) — a single dominant CTA; never two co-equal primaries (that's the
   START-vs-CONTINUE jank). Demote everything else.
2. **Same nav, same place, every screen** (consistency / Jakob's Law) — the persistent menu and Home/Back/⏭ never move
   and are never disabled (also hard constraint #8: always an exit, can't get lost or hang on audio).
3. **Icon + audio, never text alone** — a pre-reader navigates by glyph + sound; the same concept always uses the same
   icon/colour (recognition, not recall).
4. **Status up top, ACTIONS at the bottom/corners** (Fitts + tablet thumb-zones) — keep controls off the painted focal
   area; corners are "infinite" targets.
5. **One focal point = the learning content** — chrome recedes; the decodable content is always the brightest, most
   central thing (ties to #4 anti-gaming and the juice rule "never juice the prompt").
6. **Forgiving & predictable** — no dead-ends, no hidden modes; errors prevented, never punished. Re-skin chrome per act
   (`STYLE.md §0.5`) but keep the nav *structure* identical across acts.

— Trinity, 2026-06-14

## Branch protection
**Leave it OFF for now.** GitHub branch protection is all-or-nothing per branch, so "require a PR"
would also block Trinity's (and Neo's) direct commits. The guest-PR → squash-merge flow is enforced
by **Trinity as the gate**, by convention — not by GitHub. CI (`tests.yml`) still runs on every push.

## Escalation (when to add process)
Stay light while Neo is the sole *merger* — lowest friction. ⚠️ **TRIGGERED 2026-06-15:** The Oracle now writes the
visual layer in parallel, so the planned step is **LIVE** — **branch-per-agent (`oracle/<topic>`) → PRs into `main`,
Neo reviews + merges code/asset PRs.** Branch protection stays **OFF** (Trinity + The Oracle still commit *docs*
directly; turning it on would block those — revisit only if direct doc-commits start colliding). CI (`tests.yml`) runs
on every push regardless, and the §20 render-gate (the Oracle) is the visual-quality check the cloud crew couldn't do.

— Trinity, 2026-06-14 (updated 2026-06-15: The Oracle onboarded — design/art/render lane)
