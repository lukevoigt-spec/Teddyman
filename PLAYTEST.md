# PLAYTEST.md — what Teddy's real sessions tell us (the highest-value signal)

The ground truth for Super Teddy is **the kid actually playing it.** A playtest note outranks every agent audit, the
render-gate, and any "shipped/✅" status in another doc (see `AGENTS.md` ▸ *The playtest loop*). When a note here
contradicts another doc, **the note wins** — reconcile the doc to reality.

## How the parent submits (frictionless, by design)
- **In-app (shipped):** Grown-Up Corner ▸ **"Playtest notes"** → type free text → **Send**. It commits the note as its
  OWN file **`playtest/<ISO>.md`** (reusing the studio's GitHub token; race-free — no two notes ever clobber) and can open
  a **"Playtest:"** trigger Issue. Trinity reviews those raw notes and curates them into the log below.
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
> Raw notes arrive as `playtest/<ISO>.md` files (+ a `Playtest:` Issue); Trinity reviews those and curates the triaged
> entries into this log (newest first).

### 2026-06-19 (b) — triaged (parent follow-up — "mastery above all")
RAW: "It seems like we introduce words using letters he hasn't yet mastered — need to make sure he's mastering the letters
before moving on. **Mastery above all.** If he errors out on a word, reinforce it more until he's nailing it 100%
consistently."
→ VERIFIED (the note is right, and it's a drift from our own spec): the mastery gate fires ONLY at milestones
(`missionComplete` → `if(CUR.finale||CUR.rescue)`); regular forge/read word missions have **no mastery gate**, and
`curriculum.test` only guarantees a word's letters are **taught**, never **mastered**. `PEDAGOGY.md` already says
"mastery-paced: re-teach weak items BEFORE advancing" — so the code drifted from the doc.
→ Researched (web fan-out) → `RESEARCH-GATING-MASTERY.md` §C. Key correction to the instinct: gate **per-word** (only THIS
word's letters), to **automaticity** (not just accuracy), with errored items reinforced across **spaced days** — NEVER a
global "master all letters first" wall (over-gating is the *bigger* documented risk for an ADHD learner: helplessness/
avoidance). Plus momentum guardrails (3–5 easy wins before a hard item, ~80–85% prompt success; Rosenshine/Burns/Lee).
→ routed: **#182** [Neo] the per-word mastery gate (lead, build FIRST) — builds ON the now-shipped **#171** engine
(relearn/IR weighting), generalizing its gate from milestones to per-word. PEDAGOGY.md honesty note added; `curriculum.test`
to gain a "graduates on mastery not just taught" guard. Trinity babysits.

### 2026-06-19 — done (parent live session — watching Teddy play; researched, built, SHIPPED)
→ done: all 4 wave items merged to main + live — **#170** listen-first gate → Training Room + armed-when-ready (`bf4346a`,
PR #177) · **#171** error-driven Incremental-Rehearsal weighting, save-safe, +9 tests (`f57401d`) · **#172** Training
discoverability (`f7eb4ff`, PR #176) · **#173** win-chest → painted (`42bc70b`, PR #175). #170 §20 render-confirmed.
RAW: (1) He impulsively clicks to **skip listening to the sounds** just to get to the coins — need nothing clickable
until the audio finishes (gated). (2) **Ensure mastery** — track incorrect answers; when he gets them wrong they show up
MORE and he doesn't progress until mastered; reinforce weak areas. (3) Earning coins in the **Training Room wasn't
intuitive** — make it more prominent, and add **another way to get to that page** (tapping the gems/bar can stay).
(4) The **chest on the win screen doesn't match** the one on the squishy page — update the art.
→ Researched (web + PubMed, two syntheses with citations) → `RESEARCH-GATING-MASTERY.md`. Key findings: the audio gate
should be **"armed-when-ready," not a frozen screen** — gems CHARGE while the sound plays, then arm with a "your turn"
cue (the delay alone doesn't curb impulsivity; *filling it with the goal* does — Barker & Munakata 2015); and weak items
should re-surface via **Incremental Rehearsal** (more, but ~1-in-9 among wins, never back-to-back) with a session-spanning
mastery gate framed as a charging power meter (no wall, no shame — constraint #2).
→ Verified against code: the `sidArm` audio gate exists for find/boss/fortress/vault but is **silent + NOT wired into the
Training Room** (`trainBuild`, where coins are earned — the exact rush point); error re-surfacing today is only in
patrol/review and gating is only at milestones; the win chest is a vector `chestSVG` placeholder while the shop uses the
painted `art/chest-closed.png` (a known §20 deferral).
→ routed: **#170** listen-first gate [Neo+Oracle] · **#171** error-driven IR weighting + mastery gate [Neo] · **#172**
Training discoverability [Oracle+Neo] · **#173** win-chest art [Oracle+Neo]. Sequenced in `KANBAN.md` (gate first). Trinity
babysits to merged.

### 2026-06-17 — fixed-on-branch (parent live session — Fortress finale + Training Room)
RAW: (1) Fortress maze "the _ is big" → bed/van/fox "doesn't make sense, there's no picture"; the audio
says "tap the picture / which picture fits" and the autoplay doesn't read the sentence. (2) "Daily training
complete" plays in the MIDDLE of a reading mission. (3) "Training room still has lots of emojis."
→ FIXED (PR #118, commit `275b20d`): (1) `fortMaze` now READS the target sentence on autoplay + uses the
word-oriented `cloze_prompt` (the rotating `sent_prompt` was picture-text; the foils alone didn't
disambiguate). Chose audio over rendering the pic to avoid a raw-emoji risk (#6). (2) the daily-goal
announcement is deferred to a calm hub screen (`maybeAnnounceDaily`, never mid-mission). (3) `comboPop`
dropped the 🔥 (game-wide; advances #104).
→ NEW feature requests filed for Oracle: gem/villain collection cards (#126, like the squishy #124), and
treasure-box pops at the end of the earned level (#127).
→ pending merge to main. Oracle to render-check the combo chip + the fortress prompt flow.

### 2026-06-17 — triaged (parent screenshot of the Memory Vault "Recharge the Gems" screen)
RAW: "I see two emojis on this screen." (Photo of the active vault find-task.)
→ Verified in code: the OS emoji on that screen were the activity TITLE glyphs. The blue gem by "3 / 6"
is the painted `ui-gem.png` (already de-emoji'd, #103), and the large gold cross-shape is a crafted
`gemSVG` facet / painted background motif — NOT an OS emoji. The true emoji were the 🔋 title here +
its siblings 📜 (Spell Scroll) / 🔥 (Sound Warm-Up) + the vault completion ✨/⚡.
→ FIX (art-free, dropped — no render needed): `index.html` three activity titles + `game.js` vault
`✨`/`⚡` strings. Advances #104 (the rest of #104 — win/rest buttons, combo/rank glyphs, map ✓ — still open).
→ on branch `claude/trinity-roleplay-ehdyd7` (PR #118), pending merge. Oracle to confirm on a render that
the title bars still read right and the gold gem-facet/background reads as intended (not emoji-like).

### 2026-06-15 09:42 — triaged (parent watching Teddy play the Training Room)
RAW: Training Room has **no climax / monotony → becomes a chore**. Wants: a coin **STACK** that converts to **gold bars →
diamonds** at thresholds (the missing peak); a **non-timed daily-practice PROGRESS indicator** (how much is left); **unlocked
HEROES showing up during training to encourage** — Archie cheers, William & JJ tell silly jokes — to break the monotony.
Also: **emojis still on the Training Room page**; the whole Training Room **design needs an Oracle rebuild** ("not great").
→ The §6.0 + seductive-details sweet spot: add PEAKS + variety that buy MORE reps without diluting them (juice/jokes fire
BETWEEN reps, never on the decoding prompt). → **routed:** `QA.md` "Training Room — engagement + redesign" cluster — Neo
(coin→gold→diamond, daily progress bar, ally-interrupt wiring), Oracle (de-emoji + full redesign + new coin/bar/diamond +
ally art), Trinity (drafts the Archie/William/JJ interrupt lines — starter set delivered for approval).

### 2026-06-15 — protocol seeded
Log created. Awaiting the first real session. *(No playtest data yet — do not infer the app is good or bad from silence;
schedule a session.)*

— Trinity, 2026-06-15
