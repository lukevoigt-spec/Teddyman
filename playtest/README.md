# playtest/ — raw parent playtest notes (the highest-value signal)

Each file here is **one** playtest note the parent submitted in-app
(Grown-Up Corner ▸ **"Playtest notes"** → Send), committed by `playtest.js` as
`playtest/<ISO-timestamp>.md` (race-free — one file per note, so two quick notes
never clobber). Each note also (optionally) opens a **"Playtest:"** trigger Issue.

**A real playtest note outranks every agent audit, the render-gate, and any
"shipped/✅" status elsewhere** (see `AGENTS.md` ▸ *The playtest loop* and the
evidence hierarchy in `PLAYTEST.md`). When a note here contradicts another doc,
the note wins — reconcile the doc to reality.

## Flow
1. Parent types a note in-app → it lands here as `playtest/<ISO>.md` (+ a `Playtest:` Issue).
2. **Trinity** scans this folder + open `Playtest:` Issues on re-engagement, triages each
   (🛠️ code → Neo · 🎨 visual → The Oracle · 💬 process → Trinity), and curates the
   triaged/done entry into the log in **`PLAYTEST.md`** (newest first).
3. When the fix ships, status → **done** (anchored to a commit hash).

> This README is just the index; the dated `*.md` files are the actual notes.
> (Issue #112 — code and docs now agree: notes are per-file under `playtest/`,
> `PLAYTEST.md` is the curated log, not the raw sink.)
