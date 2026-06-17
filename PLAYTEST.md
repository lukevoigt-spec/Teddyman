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
