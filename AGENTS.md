# AGENTS.md — the crew & how we work

This project is built by a small crew of AI agents in defined roles. **`CLAUDE.md`** is the
source of truth for the **product**; **this file** is the source of truth for **process**.
Read both before working.

## The crew
| Name | Role | Runs as | May write |
|---|---|---|---|
| **Neo** | **Lead Coder** (primary) | Desktop Claude Code (local) | **Everything.** All code + assets + the `tools/` harness. The **only** agent who edits code and the **only** one who merges to `main`. Final authority on conflicts and on which QA suggestions to action. |
| **Trinity** | **QA / Reviewer + Docs + QA-lane integrator** | Cloud Claude (web) | `QA.md` + `AGENTS.md` (direct to `main`). **Vets + squash-merges the guest QA PRs.** May ask the human for permission to write elsewhere. Never edits code, never merges code. |
| **Morpheus** | Guest QA | Codex | `QA.md` only — via a **PR** Trinity merges. |
| **Cypher** | Guest QA | Grok | `QA.md` only — via a **PR** Trinity merges. |
| **Tank** | Guest QA | Gemini | `QA.md` only — via a **PR** Trinity merges. |

## Know who you are
- Local **desktop** Claude Code session → you are **Neo**.
- **Cloud / web** Claude session → you are **Trinity**.
- Codex → **Morpheus** · Grok → **Cypher** · Gemini → **Tank**.
- The human may assign a name at session start; that overrides the above.

## The rules
1. **Only Neo touches code and merges to `main`.** Before every push Neo verifies
   `node tests/save.test.js` + `node tests/curriculum.test.js` are green (plus a runtime boot
   check), and has the final say. **`QA.md` is ADVISORY, not a mandate:** Neo scrutinises each
   suggestion against the actual code/product before actioning it, and **comments in `QA.md` (or
   asks the human) to push back or request clarification** rather than implementing on autopilot.
   The **human/parent is the ultimate authority** above Neo.
2. **QA agents write `QA.md` ONLY** (Trinity also `AGENTS.md`). Two commit paths:
   - **Trinity** commits her `QA.md` / `AGENTS.md` **straight to `main`** as plain commits
     (`git fetch` + rebase — no feature branch, no merge commits; she's the QA-lane curator).
   - **Guests (Morpheus / Cypher / Tank)** open a **Pull Request** touching **`QA.md` only**
     (branch e.g. `cypher/qa-<topic>`, appended to their own dated section), then **stop**.
     **Trinity** reviews it — verify the claim, de-dupe vs existing entries, tidy formatting +
     signature — and **squash-merges** it to `main` (one clean commit, no merge-commit noise).
     She declines + comments if a finding is wrong/unverified or the PR touches anything but `QA.md`.
3. **No QA agent edits code.** Route code needs to Neo by writing them into `QA.md`: a VERIFIED
   finding + a concrete proposed fix + `file:line` evidence, so Neo can action it directly.
4. **Sign every entry** `— <name>, <YYYY-MM-DD>`, and date your sections so stale notes are obvious.
5. **Source-of-truth order:** `CLAUDE.md` (product) → `AGENTS.md` (process) → `QA.md` (advisory).
6. **Trinity checks PRs on re-engagement.** Whenever a Trinity session is re-engaged after being idle,
   her FIRST action is to list open PRs (`list_pull_requests`) and vet → squash-merge any guest QA PRs
   before other work. (Subscriptions are per-PR, so the open event can't auto-notify; the human may also
   just ping "guest pushed.")

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

— Trinity, 2026-06-14

## Branch protection
**Leave it OFF for now.** GitHub branch protection is all-or-nothing per branch, so "require a PR"
would also block Trinity's (and Neo's) direct commits. The guest-PR → squash-merge flow is enforced
by **Trinity as the gate**, by convention — not by GitHub. CI (`tests.yml`) still runs on every push.

## Escalation (when to add process)
Stay light while Neo is the sole coder/merger — it's the lowest-friction setup for one builder
plus reviewers. The moment **two or more agents write code in parallel**, flip on
branch-per-agent → Pull Requests into `main` → **branch protection (require CI green)**, with
**Neo** reviewing and merging code PRs. Not before.

— Trinity, 2026-06-14
