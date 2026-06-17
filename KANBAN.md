# KANBAN.md — the live work board (Trinity-maintained)

> The single view of **what's being built and what's queued.** **Trinity keeps this current every turn.** The parent does
> NOT edit it — he steers by answering Trinity's triage questions (`AskUserQuestion`); Trinity moves the cards. Each card =
> a GitHub Issue (`#N`); specs live in the linked docs. Owner: **[N]** = Neo · **[O]** = The Oracle.
> *(GitHub Projects can't be API-driven from here, so this markdown file is the canonical board.)* — **reconciled to git + live Issues 2026-06-17 (Trinity); parent dispositioned the 06-17 triage batch.**

## 📥 TRIAGE — candidates awaiting the parent's call
*(empty — the 2026-06-17 Morpheus batch #110–#113 was dispositioned by the parent: #110/#111 do-now, #112/#113 defer.)*

## 🚀 READY TO MERGE — implemented + green on a branch, awaiting Neo's merge to main (the live deploy)
*Trinity does NOT merge to main (Neo's exclusive lane + each merge deploys to Teddy's iPad within minutes). These are done and verified; they just need Neo to PR + merge.*
- **#110 [N]** Act-2 roster reconcile — `claude/trinity-roleplay-ehdyd7` (`cd8454e`). Dead JJ teller dropped, cast lines + homecoming `hCast()` fixed to Brody/Daisy/Cal/Bryce/Nora, test label fixed. Tests 116/121/17.
- **#111 [N]** Training-line process-praise sync (regression of false-closed #23) — same commit `cd8454e`. Four lines fixed + a guard test so streak/smart/smarter can't return.
- **#106 [N]** `Aud.pick()` speechSynthesis guard — `fix/106-pick-guard` (`02383ab`). Spec-exact, trivial.
- **#107 [N]** voicepack `defer` + BGM `preload="metadata"` (28 MB + ~11 MB no longer block boot) — `fix/107-boot-perf` (`7637b18`). Sound + well-commented; wants a real-iPad cold-load check on merge.

## 🏆 ELEVATION LOOP — "make it award-winning & beautiful" (`ELEVATION-LOOP.md`, active)
Award Bar rubric **v1 synthesized** (14 criteria, 5-stream research review). Wave-by-wave:
- **#54 [O]** Ratify the Award Bar into `STYLE.md §20` (Oracle adjusts + owns).
- **#55 [O+N]** **Wave 1 eval** — score Title · World Map · a learning prompt · Win against the bar → gap lists in `DESIGN-REVIEW.md` → per-fix slices. *(Wave 2 = Base/Training/Shop · Wave 3 = cutscenes/settings/transitions.)*

## ✅ APPROVED — build now (open GitHub Issues)
**The big redesigns — delegation (AGENTS rule 8): `[O]` designs+art+gates · `[N]` implements · `[O]` `§20 PASS` · `[N]` merges:**
- **#102 [N]** Convert the ui-emoji guard ratchet → **full child-facing scan** + parent-only allowlist (systemic fix).
- **#104 [O+N]** De-emoji the remaining child UI CHROME — Vault/Scroll/Warm-Up titles, win/rest buttons, combo/rank/done glyphs, map ✓.
- **#31 [O+N]** UI theme coherence — standardize every screen to the painted backgrounds. *(Title stays as-is. Advanced by the #108 painted 9-slice buttons.)*
- **#33 [O+N]** Hero Room, plinth-first diegetic redesign — *shell shipped (PR #52)*; remaining = tap→card overlays, gem-dex %, room-grows-with-mastery.
- **#34 [O+N]** Training Room VISUAL redesign (engagement mechanics shipped; "not great" playtest note).
- **#124 [O+N]** Squishy STORE/COLLECTION split (parent 2026-06-17) — owned display-case with faint slots + duplicate count badge (needs `S.owned` boolean→count migration) + a painted shopping-cart button → buy view. Oracle art (case/slots/cart) + Neo wiring/migration.
- **#126 [O+N]** Gems + Villains COLLECTION CARDS (parent 2026-06-17) — tap the gem shelf / villain shelf → a card of the whole set, same pattern as #124 (one shared collection-card system). Gems folds into #33's gem-dex.
- **#127 [N+O]** Treasure box POPS at the end of the level earned (parent 2026-06-17) — surface the earned chest on the WIN screen as a tap-to-open card (reuses `openChest`), instead of being buried in the Squishy menu. Mostly Neo surfacing logic + Oracle card art.
- **#44 [O]** Title-screen hero box on iPad — nudge down + kill the clipped-glow rect *(WebKit-verify; don't restyle the title).*
- **#60 [O]** Ally FACE-tokens → painted raster (cheer pops, league thumbs, win mini-face) — last SVG characters left.

## 🔨 BUILDING — has an open PR
*(none — zero open PRs as of 2026-06-17. Monitoring posture: Trinity gates any guest/Oracle PR the moment it opens.)*

## 🅿️ DEFERRED — approved-someday, not active
- **#112 [N]** Playtest capture writes `playtest/*.md`, not `PLAYTEST.md` as documented — reconcile code or docs. *(LOW; parent-deferred 06-17.)*
- **#113 [N]** Hero Base art-burst (~8.5 MB) + stale jpeg probe — asset-budget/lazy-load pass; pairs with #107. *(LOW/MED; parent-deferred 06-17.)*
- **#38 [O]** Map allies — grounding **partly done** (#105 added FRIEND_SIDE/FRIEND_POS + Cal on the path); remaining = new `allyBody` art + contact shadow on the legacy layout.
- **#39 [O]** §20 render-gate catch-up on new Act-2 systems + the calm-prompt check (anti-gaming #4 in Vault/Warm-Up found CLEAN).
- **#35 [O]** Mouth art on the big cutscene portraits (driver already shipped).
- **#36 [O]** Cinematic SVG cutscene pass (beats 2–6). *(Tension with parent doing portal video — revisit.)*
- **#37 [O]** Portal AI-video spike *(optional, render-gated, SVG fallback).*

## 🌿 BRANCH HYGIENE (parent: "make sure branches are correct")
- **`oracle/base-build` is a stale fork: +268 / −50 vs `main`** — DO NOT merge (would revert dozens of landed PRs). Its valuable work already landed via #105; **recommend `git reset --hard origin/main`** (discard) and short-lived topic branches off fresh main going forward. (#96 closed as superseded.)
- **`fix/106-pick-guard` + `fix/107-boot-perf`** are clean single-commit branches off main, merge-ready (see Ready-to-merge).
- ~38 other `oracle/*` / `morpheus/*` / `claude/*` branches exist; most are merged-or-abandoned topic branches. Optional cleanup: prune merged ones so the remote isn't noisy. Not urgent.

## ✓ DONE (recent — verified against git, 2026-06-17)
**This session (Trinity, on `claude/trinity-roleplay-ehdyd7`, pending merge):** status reconcile of KANBAN/QA/CLAUDE to git+Issues · CLAUDE.md Act-2 roster fix · #110 roster code reconcile · #111 training-line process-praise sync + guard. Filed #110–#113; closed #96 (superseded).
**Reading (objective #1): full TEKS Grade-2 ladder complete, Act 1 + Act 2 content-complete.**
**Emoji sweep:** #32/#27 shop+base glyphs → painted raster (#89) · **#103 painted set for EVERY inventory/content emoji (106 icons, PR #109)**.
**Full code sweep #81–#88 (PRs #91–#101):** cloud-clobber · lockRow mastery · crash-guards · win-NEXT play-order · Lite backdrop-filter/confetti · audio robustness · goalMin/token hygiene · Vault meter (INFO).
**Parent deep-dive bugs #71–#75:** interrupt buffer · CLOUD-2 timing · Base shelf caps · reward-shower Lite cap · hardening trio.
**Polish/feat:** painted treasure-chest (#90) · **premium painted 9-slice buttons (#108)** · Voice-Studio auto-trim/normalize (#94) + re-crisp (#95) · gem-shower juice (#67/#68) · Memory Vault grapheme surfacing (#65).
**#105 RE-APPLY:** map friend-grounding · single Victory CONTINUE · title/rest de-emoji · premium Vixen/dragon repaint · Cal regen. *(Cutscenes excluded — parent doing video.)*
**Nav overhaul (`NAV-PLAN.md`) — COMPLETE:** 4-corner painted nav · single-PLAY title · HUD-hide-on-learning · back-to-base removal · Rest→map · Skip≥96px · map node states + locked feedback.

> History in git + `QA.md`. **Stale-status caught this sweep:** #23 was closed but never shipped → re-filed #111 (now implemented).
