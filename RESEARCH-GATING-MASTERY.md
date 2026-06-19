# RESEARCH — Listen-First Gating + Error-Driven Mastery (2026-06-19)

> Commissioned by the parent after watching Teddy play (PLAYTEST 2026-06-19): he impulsively taps answers to
> **skip listening to the sound** and rush the coin reward, and the parent wants to **"absolutely ensure mastery /
> reinforce weak areas."** Two focused literature syntheses (web + PubMed), each mapped to concrete mechanics and
> flagged RESPECTS / RISKS against the hard constraints (no punishment · no loss state · audio-first · §6.0 mastery-
> not-participation). This doc is the evidence base the related Issues link to. — Trinity, 2026-06-19

---

## A. The "armed-when-ready" audio gate (the parent's "nothing clickable until the audio stops")

**The load-bearing nuance:** the parent's instinct (lock taps until the prompt finishes) is right, **but the delay itself
is not what helps** — an adult-imposed wait did nothing causal for young children's response inhibition; what worked was
**keeping the goal active during the wait** (Barker & Munakata, *Psychological Science* 2015,
[DOI](https://doi.org/10.1177/0956797615604625)). So the gate works only if the wait is *filled with the target sound*
("what am I listening for" stays live). A blank frozen screen would just frustrate him.

**Does gating help an impulsive child? Yes — when paired with a cue/strategy:** forced-delay administration improved
accuracy specifically for *impulsive* children; near-errorless **constant-time-delay** (a structured prompt-delay) gives
criterion learning with extremely low error rates in kids with LD (Keel & Gast 1992,
[DOI](https://doi.org/10.1177/001440299205800408)); errorless guided instruction beat corrective feedback for 6-year-olds
on a touchscreen (Quach & Beukelman 2010, [DOI](https://doi.org/10.3109/07434610903561068)). GraphoLearn-style CAI phonics
raises letter–sound knowledge in struggling 7-year-olds (Patel et al. 2018,
[DOI](https://doi.org/10.3389/fpsyg.2018.01045)) — validating the sound→letter core the gate protects.

**Mechanics (prioritized):**
1. **★ "Armed when ready" gate (top rec).** Answer choices render **dimmed + non-interactive while the prompt sound
   plays**, then on audio-end they **visibly + audibly "arm"**: brighten/scale-in + a soft "ready" chime + a non-text
   "your turn" cue (SVG hand/arrow — audio-first). Lock length = the prompt duration ONLY (cap any settle buffer
   ~250–400 ms; never pad). Make the *open feel like a reward* (charging→live), not a freeze. **RESPECTS** all.
2. **Replay stays live through the lock.** The 🔊 button is the one control tappable during the lock, so an impulsive tap
   lands on "hear it again," never a dead zone; it re-arms on replay. **RESPECTS** audio-first / no-hang (flow()/skip).
3. **Diegetic framing:** "the gems are CHARGING / powering up" while the sound plays, "go live" when ready — turns the
   wait into in-world anticipation. **RESPECTS** delight.
4. **Reward listening, not speed:** keep coins on correct mastery; an optional tiny "good listening" sparkle when he
   waits/replays. **RISKS** only if it becomes a timer/score — keep presence-only, loss-free.
5. **First miss = re-arm, not penalize:** wrong tap → gentle dim + auto-replay (re-locks, then re-arms); 2nd miss pulses
   the correct gem. This *is* the errorless/CTD shaping. **RESPECTS** #2.

**Risks / tuning:** WM is the ADHD bottleneck — don't make him hold the sound across a long silent wait; the clip should be
audible right up to unlock, and a gem can re-voice the target on first arm. Gate length = prompt duration, no padding
(extra imposed time adds frustration without benefit). prefers-reduced-motion / Lite need a **non-motion** ready channel
(brightness + chime), never motion alone. **Apply only to listen-first sound-ID tasks** (find / boss / fortress sound
phase / vault / **Training-Room BUILD**) — decode/forge/read where the word is already on screen don't need it.

> **Code reality (verified):** the gate already exists as `sidArm(pr,row)` / `sidReject` (`game.js` ~1114–1160) and is
> wired into `nextFind` / `bossRound` / `fortSound` / `vaultFind` — but it's a *silent* `pointer-events:none` with no
> "ready" cue, and it is **NOT wired into the Training Room** (`trainBuild`/`trainDecode`, ~2334–2360) — which is exactly
> where coins are earned and where Teddy rushes. So the work is: (1) extend the gate to Training-Room build (+ any
> uncovered sound-ID task), and (2) upgrade the affordance from silent-lock → the research-backed charge→arm→"your turn".

---

## B. Error-driven repetition + mastery-gated progression ("ensure mastery / reinforce weak areas")

**The parent's instinct is well-supported — with one translation:** re-surface misses MORE and gate progression on
mastery, but frame both as *getting stronger*, never a wall or penalty.

**Evidence:**
1. **Mastery learning helps Teddy's profile most.** Meta-analysis (108 studies): gains are *largest for weaker students*
   (d≈0.61 vs 0.40), so "don't advance until mastered" disproportionately helps struggling learners (Kulik, Kulik &
   Bangert-Drowns 1990, [DOI](https://journals.sagepub.com/doi/10.3102/00346543060002265)). Gated progression *supports*
   competence (SDT) **only in a mastery-focused, non-competitive climate** — which the positive "power-up patrol" already is.
2. **Errorless > trial-and-error for kids with disabilities.** Systematic review (28 studies): errorless procedures
   reliably improve discrimination learning, and *errors can make the learning context itself aversive* and trigger
   escape behavior (Mueller et al., [PubMed 31901670](https://pubmed.ncbi.nlm.nih.gov/31901670/)). Argues for prompting
   *before* a likely error on a weak item, not only after.
3. **Best correction = model→test→retest with SPACED re-exposure.** Spaced/expanded retrieval beats massed re-test and
   passive re-study for children's word learning, incl. language disorders, holding at 1 week (Souto, Leonard & Karpicke
   2025, JSLHR, [DOI](https://doi.org/10.1044/2025_JSLHR-24-00809)).
4. **★ Incremental Rehearsal (the key mechanic).** Interspersing each unknown item among ~9 knowns (10–90% unknown:known)
   yields ~90%+ retention vs ~78–85% for massed drill — *and the high known-ratio keeps struggling readers motivated*
   because most reps feel like wins (Joseph 2006, *The Reading Teacher*,
   [DOI](https://doi.org/10.1598/RT.59.8.8); retention: [ERIC ED574881](https://files.eric.ed.gov/fulltext/ED574881.pdf)).
5. **Re-surface a miss SOON, then SPACE it — don't hammer it.** Re-test after a few intervening (mostly known) items,
   expanding the gap as it firms. New grapheme = a few blocked reps first; a known-but-weak grapheme = interleave heavily
   (Hwang 2025, [DOI](https://doi.org/10.1111/lang.12659)).
6. **Disguise heavy repetition as novelty:** the same item re-surfaced across different mission skins (find/forge/read/
   training) *is* spaced interleaved retrieval — variety prevents the grind an impulsive child rejects.

**Mechanics (extend the existing `record`/`pickWeak`/`masteryReview`/`masteredItem`/Vault spine):**
- **★ Incremental-Rehearsal weighting + a `relearn` priority tier (top rec).** On a miss, flag the grapheme `relearn` and
  strongly up-weight it in `pickWeak` for the next several encounters — **but cap it to ~1-in-9 amid mastered/known items
  (never back-to-back)**, re-test after 2–4 intervening items, then **expand the interval** on each success. Unifies the
  parent's two asks (missed→more + retention). **RESPECTS** (weights off `strength`, most reps are wins).
- **Errorless pre-prompt on flagged-weak items:** briefly *model the sound first* ("here it comes…") so a weak rep starts
  as near-certain success, then fade as `strength` rises. **RESPECTS.**
- **Corrective loop = model→retry→spaced retest:** keep dim→replay→retry + the 2nd-miss pulse, then *force one spaced
  re-test of that exact item later in the session* before it can count toward mastery. **RESPECTS.**
- **Tighten the gate honestly + add retention:** keep `masteredItem` (str≥4, seen≥5, acc≥0.8) but require passing reps
  **spaced across ≥2 sessions/days**, and add a **delayed re-check** (~3–7 days; a lapse drops it back to `relearn`).
  Proves durable mastery, not cramming. The Memory Vault (Leitner) is already the scaffold for this. **RESPECTS** (a
  re-check is a "tune-up," never shown as a demotion/loss).
- **Frame the gate as FUEL, never a wall:** extend the "power-up patrol" — a *filling* power meter per weak gem ("almost
  charged!"), surfacing approach-to-mastery. **RISKS:** any copy implying "you can't go because you got it wrong" reads as
  loss-aversion — keep it "let's charge this gem up."
- **AVOID:** ever surfacing a miss-count to Teddy, or raising frequency so high a miss repeats in a row (aversive-context
  effect + no-shame constraints).

**Metrics to track (drive adaptivity + PROVE mastery):** per grapheme/word — error count + miss-streak; accuracy over a
*sliding window* (not lifetime); **response latency** (fast+correct = true mastery vs slow+correct = fragile); spacing
interval since last correct (expanding retrieval); **retention/relapse on delayed re-checks** (the real proof); sessions
spanned before the gate opens. These extend `record()` cleanly and are save-safe (additive `S.mastery[key]` fields).

> **Code reality (verified):** error re-surfacing today happens only inside patrol/review contexts (`pickWeak` is used
> when a `patrolSet` is passed); ordinary learn missions don't re-surface a missed item within the mission, and
> progression gates on mastery only at **milestones** (`coreWeak` → `masteryReview`). The parent wants this tighter and
> more pervasive — incremental-rehearsal weighting across all sound-ID tasks + the session-spanning gate above.

---

— Trinity, 2026-06-19 · evidence base for the 2026-06-19 playtest wave (Issues linked from `KANBAN.md`)
