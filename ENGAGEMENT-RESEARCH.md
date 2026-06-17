# ENGAGEMENT-RESEARCH.md — what makes kids crave a game (ethically)

> **Trinity, 2026-06-17.** A 5-thread deep-research synthesis commissioned by the parent: *"research everything you
> can about what makes games addicting to kids — we want him to crave playing, as long as we maintain our mission and
> principles."* This **extends `DESIGN-ENGAGEMENT.md`** (Oracle's — fold the actionable parts in there) and corroborates
> the `CLAUDE.md` hard constraints + the §6.0 mastery-not-participation contract at a mechanism level. ~70 sources across
> SDT, ADHD/educational psychology, the dopamine/reward literature, kids'-game teardowns, and dark-patterns research.
> *(Method caveat: many primary PDFs were bot-blocked (HTTP 403); directional claims rest on multiply-corroborated search
> extracts that directly quoted the sources. The few highest-leverage claims worth a human eyeball are flagged.)*

## The unifying principle
> Durable engagement = **autonomy + competence + relatedness**, paid out with **immediate, frequent, guaranteed-positive
> rewards whose *surprise* is in *which* good thing (never *whether*)** — and all of it fires **around the rep, never on
> the prompt, and never as a threat of loss.**

The research **independently re-derived almost every existing constraint** (no loss, no timers, no streak-punishment,
mastery-not-participation, calm prompt / loud reward). The value is in the specific things to *add*.

---

## Prioritized actionable additions (leverage-to-safety ranked)

1. **Uncertain BONUS, certain BASE (highest learning ROI).** Education-specific neuroscience (Howard-Jones & Jay, Bristol):
   a **~50% chance of reward spikes dopamine AND memory retention** far more than a certain *or* a fully-random reward.
   Apply ethically: the "you read it!" cue is **always 100%**; the *extra* layer (bonus coins / gem-twinkle / a chest)
   lands ~half the time. Never "whether you get anything," only "how much." → **Issue #151.** *(Worth a human eyeball:
   research-information.bris.ac.uk/files/102521125/Games_DA_Education_Revise_v7_.pdf)*
2. **Collection-as-mastery counter (the #1 daily-return hook).** "Gotta catch 'em all" works because the brain seeks
   completion (Pokémon; Zeigarnik effect). A rising **"12 / 26 gems mastered"** on home/map, gems lighting up only by
   getting *better* (§6.0), with the *one reachable empty slot* visible in near-complete sets. → **Issue #152.**
3. **Anti-gaming = response-time re-lock, NOT villain-HP-up.** (See the verdict below.) → **Issue #153.**
4. **Autonomy — the thinnest SDT leg.** Add meaningful in-the-moment choice (which unlocked zone/word/weapon/ally; "what
   do you want to do today?" mission-vs-Training); **invitational** language ("Ready to forge a word?"), never commands.
5. **Within-mission micro-progress + endowed head-start.** Goal-gradient effect: effort accelerates near a goal. An
   always-advancing bar *inside* a mission (word 3/5) that visibly moves each rep; never start a bar at 0/N — **pre-fill
   it** ("you've got a head start!"). Pure positive, zero loss-aversion.
6. **Avatar & Base ownership.** Across Roblox / Teach Your Monster / Animal Crossing, "earn cosmetics for *my* character/
   space" is the most durable kid loop — ownership beats points. Let reading reps customize **Super Teddy + his Base**;
   front-load a quick hero personalization. *(Connects to the squishy work #124/#126/#127/#145.)*
7. **Returning warm characters + the waiting friend.** Relatedness drives return: a character who **greets him by name on
   return** with something new to say, plus the captive friend visibly waiting on the map. ⚠ Warmth, never guilt — never
   imply a character is sad/abandoned for a missed day (the "passive-aggressive Duolingo owl" — a named dark pattern).
8. **Anticipation juice + named praise.** Dopamine is a *pre-reward* signal — invest in the wind-up (chest rattle, rolling
   counter) *before* the reveal. Pair every coin with **specific, named, informational praise** ("Nice blending, Teddy!")
   — protects against the overjustification effect (expected rewards-for-merely-doing-it undermine intrinsic love of the
   activity; the harm is larger in children than adults).

---

## The engagement engine (Self-Determination Theory)
Intrinsic, durable motivation needs **autonomy** (real choice/agency), **competence** (visible mastery, optimal challenge/
flow), and **relatedness** (caring characters, belonging) — satisfy all three and engagement rises; starve one and it
degrades. Teddyman already nails competence (mastery gates) + relatedness (real-family allies); **autonomy is the gap.**
- **Flow:** engagement peaks where challenge ≈ skill; target ~75–85% success per session (your `pickWeak`/weighted-foils
  + mastery gate `str≥4, acc≥0.75` are well-aligned). Scaffold then *fade* (mastered items need less hinting).
- **Overjustification (critical guardrail):** expected tangible rewards given for *merely doing* a task reliably undermine
  later free-choice motivation — the exact metric we care about ("does he *choose* to come back"). **Never pay for mere
  activity.** §6.0 is the research-correct call. *Unexpected* and *verbal/informational* rewards do NOT undermine and can
  enhance motivation. Gamification boosts autonomy/relatedness but has **minimal effect on felt competence** — competence
  comes from real mastery feedback (stars, rank-up), not from the coin/cosmetic layer.

## Reward psychology (dopamine / reinforcement)
- **Uncertain ~50/50 bonus** maximizes dopamine + memory (finding #1 above).
- **Dopamine is anticipation, not receipt** — it fires before the reward and migrates onto the *cue*; put juice in the
  wind-up.
- **"Variable = which, never whether"** is the clean ethical line: the gambling harm is a chance of *nothing* + loss/spend
  + chasing. Keep every chest non-empty; uncertainty rides on *type/quantity*, never *existence*.
- **Juice** (layered motion + sound + particles + `+N`) measurably lifts satisfaction with no rule change — layer ≥3
  channels on the *reward*, none on the prompt.
- **Many small variable bonuses > rare jackpots** for a durable habit. An occasional surprise over-delivery *on a read
  word* tags the reading itself as memorable.
- **ADHD:** reward must be **immediate (~250ms)** + **frequent** + **continuous** (partial/intermittent reinforcement
  degrades ADHD attention) — protect per-rep reward latency.

## Daily-return loops (kids'-game case studies)
- **Collection completion** (Pokémon) — the strongest legit hook; tie to mastery.
- **Map "what's next" + the waiting friend** (Teach Your Monster / Sneaky Sasquatch / Animal Crossing) — a visible,
  just-out-of-reach next unlock so he knows *why* to return; no notification guilt needed (the parent controls the iPad —
  lean on the map, not push-notifications).
- **Avatar/space ownership** (Roblox / Teach Your Monster) — most durable loop; front-load customization.
- **Content stays fresh via re-skinned familiar mechanics + escalating systems** (Minecraft self-paced; Prodigy RPG
  systems) — validates "repetition disguised as new missions"; make escalation *visible* (harder words → better coins).
- **Satisfying stopping point** — end on a win/unlock with "Great work today! Tomorrow: [next unlock]"; never "keep going
  or lose X."
- **Wrong = slows progress, never punishes** is *industry best practice* (Prodigy), not just our constraint.
- **Streaks:** the retention gain comes from *removing* the punishment (Duolingo streak-freeze → +48% 7-day retention).
  If we ever show a day-count, make it **cumulative, never consecutive**, with an always-full forgiveness shield.

## The dark-pattern line (NEVER build — all confirmed disproportionately harmful for young + ADHD kids)
Dark patterns exploit cognitive biases the child can't yet resist; for a 7yo with ADHD the bar must be *stricter* than an
adult game. The harm worsens the underlying delay-aversion and compulsivity risk.
**Do-not-build list:** timers/countdowns · consecutive-streak-reset · hearts/lives/energy caps · guilt/shame notifications
· mystery boxes that can give *nothing* · competitive leaderboards · social-invite/"pressure-card" mechanics · any "you
lost X" setback (including **villain-HP-up on a wrong answer**).

## Anti-gaming verdict — "villain health goes UP on a wrong answer"
**Do not ship it.** It's a loss/setback state (hard constraint #2) and is *maximally* wrong here:
- Punishment is clinically **"generally not effective" for ADHD** (CHADD); reward is what changes behavior.
- It **backfires on its own goal** — kids game the system out of *frustration/not-understanding* (Baker), so a setback
  breeds *more* mashing → at worst learned helplessness.
- It **can't teach decoding** — punishment suppresses behavior without building the correct response; a struggling
  reader's "wrong" means *hasn't decoded yet*, exactly when to scaffold.
- The one **validated** anti-gaming intervention (Baker's "Scooter the Tutor") *added supportive practice*, never difficulty.

**Punishment-free replacements (→ Issue #153):**
1. **Response-time re-lock (top mash-killer):** a tap faster than the audio could be processed (validated rapid-guessing
   detection) isn't accepted — gems dim, the target sound replays, and the next tap won't register until the replay ends.
   Kills the *speed payoff* of mashing, forces sound→letter processing, zero loss/"wrong."
2. **Reward the correct path harder + instantly; never auto-reveal the answer** (or guessing becomes the fast route).
3. **Scaffold-on-struggle:** keep "after 2 misses, pulse the correct gem," add a soft narrated hint first → he ends on a
   *supported correct rep* (errorless-learning / the Scooter pattern).

---

## Sources (~70 — by thread)
**SDT / intrinsic motivation:** selfdeterminationtheory.org (Ryan & Deci 2000; 2020 CEP) · apa.org/.../self-determination-theory
· Deci, Koestner & Ryan 1999 meta-analysis (overjustification) · Deci/Koestner/Ryan 2001 · en.wikipedia.org/wiki/Overjustification_effect
· sciencedirect S0361476X20300254 · Springer s11423-023-10337-7 (gamification meta) · icenet.blog flow×ZPD · ZPD/flow (ResearchGate 262328721)
· learningloop.io (goal-gradient, endowed-progress) · helpfulprofessor.com (ZPD).
**Reward / dopamine / juice:** Howard-Jones & Jay (Bristol PDF 102521125) · touro.edu uncertain-reward · Schultz RPE (PMC3176615; neurosity.co)
· "Juice it or lose it" (indiehackers; gamedeveloper.com) · Kivetz/Urminsky/Zheng 2006 (SAGE jmkr.43.1.39; Columbia) · Zeigarnik (learningloop; gamingintraining)
· VR schedules (neurolaunch; advancedautism) · userpilot progress-bar psychology · loot-box ethics (thedeadlinger; lovethynerd) · Eyal regret/Hooked review (thebehavioralscientist).
**ADHD / cognitive load:** chadd.org (rewards-vs-punishment; positive-reinforcement) · additudemag.com (reinforcement vs punishment) · Sonuga-Barke delay-aversion (tandfonline 09297049.2022.2068518; KCL thesis; ResearchGate 8408495)
· PMC10636395 (game interventions) · PMC11273604 / PMC9600100 (ADHD–gaming-disorder) · Wiley acp.3822 + sciencedirect S0747563210001263 (seductive details) · educationaltechnology.net (CLT)
· Springer s41039-020-00144-6 · mdpi 2414-4088/9/1/8 · frontiersin feduc.2025.1668260 · PMC12093074 · sciencedirect S0028393208003837 (immediate-reward sensitivity).
**Dark patterns:** arxiv 2412.05039 · scitepress 2025/133658 · arxiv 2506.23017 · en.wikipedia.org/wiki/Dark_pattern · stibbe.com (ACM/Epic fine) · fairplayforkids.org darkpatterns FTC filing · researchgate 374502995 (early-childhood gaming).
**Anti-gaming / punishment vs reinforcement:** learnlab.org gaming-the-system · cs.cmu.edu/~rsbaker/gaming.html + Baker175.pdf (Scooter) · gse.upenn.edu · sciencedirect S1071581909001797 (affect)
· numberanalytics.com + PMC9470316 (punishment side-effects) · teachtown.com + crossrivertherapy.com (errorless learning) · Springer s10648-023-09739-z (productive failure) · ascd.org + ERIC ED490412 (mastery learning)
· frontiersin feduc.2023.1127644 (response-time effort) · arxiv 2008.13749 · ERIC EJ1090277 (scaffolding) · ymcagta.org.
**Kids'-game retention:** strivecloud.io (Duolingo streak-freeze) · psychologytoday "gotta catch 'em all" · en.wikipedia.org/wiki/Compulsion_loop · opened.co (Prodigy) · commonsense.org + educationalappstore.com (Teach Your Monster)
· arxiv 2502.18705 (Roblox/avatar) · medium Animal Crossing · celiahodent.com · idtech.com (Minecraft) · limarafael.substack (habit games) · trophy.so + opinionsandconditions.substack (Duolingo critique) · appstore.ca + en.wikipedia.org/wiki/Sneaky_Sasquatch · waterford.org.

— Trinity, 2026-06-17
