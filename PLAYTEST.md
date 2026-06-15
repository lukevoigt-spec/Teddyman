# PLAYTEST.md — what Teddy's real sessions tell us (the highest-value signal)

The ground truth for Super Teddy is **the kid actually playing it.** A playtest note outranks every agent audit, the
render-gate, and any "shipped/✅" status in another doc (see `AGENTS.md` ▸ *The playtest loop*). When a note here
contradicts another doc, **the note wins** — reconcile the doc to reality.

## How the parent submits (frictionless, by design)
- **In-app (once Neo ships it — spec in `QA.md`):** Grown-Up Corner ▸ **"Playtest notes"** → type free text → **Send**.
  It commits a timestamped entry to this file (reusing the studio's GitHub token) and can open a trigger Issue.
- **Right now / fallback:** the parent just pastes notes to **Trinity** (chief of staff), who logs + routes them.
- No structure required from the parent. Brain-dump is fine: *"the shop looked like emoji, he tapped the wrong gem on
  mission 12, he loved the chest sound, couldn't find the back button on the map."* Triage is Trinity's job, not yours.

## Review protocol (what happens to a note)
1. A new note = **NEW**. It **triggers a review.**
2. **Trinity triages** and routes: 🛠️ code → **Neo** · 🎨 visual → **The Oracle** · 💬 process/answer → Trinity. Status → **triaged** (with who owns it + where it's tracked, e.g. a `QA.md`/`DESIGN-REVIEW.md` item id).
3. When the fix ships, status → **done** (anchored to a commit hash, per the status-discipline rule).
4. Anything that contradicts a "done/✅" elsewhere → the note is right; fix the stale status too.

## Evidence hierarchy (when sources disagree)
**PLAYTEST (real kid)** ▸ rendered output (Oracle §20 shots) ▸ the code/git ▸ agent-QA prose.

---

## Log (newest first)
> Format per entry: `### <ISO timestamp> — <NEW|triaged|done>` then the raw note, then `→ routed:` / `→ done:` lines.
> The in-app box prepends new entries here automatically; Trinity curates status.

### 2026-06-15 — protocol seeded
Log created. Awaiting the first real session. *(No playtest data yet — do not infer the app is good or bad from silence;
schedule a session.)*

— Trinity, 2026-06-15
