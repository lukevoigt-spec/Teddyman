# PEDAGOGY.md — the learning north-star (evidence base → mapped to what we built)

> **This doc serves CLAUDE.md objective #1: *Teddy learns to read.*** It is the pedagogy equivalent of `STYLE.md`:
> the evidence base, mapped to every mechanic, with the gaps and the guardrails. When a design/engagement choice ever
> pulls against the learning science here, **this wins** (North Star tie-breaker: mastery > reps > delight).
> Synthesized from a six-stream cited literature review (Trinity, 2026-06-15). Honesty notes + sources at the bottom —
> we cite the *contested* findings too, because overclaiming the science is itself bad pedagogy.

---

## 1. The evidence frame (what reading science actually says)

**The Simple View of Reading** (Gough & Tunmer 1986): *Reading Comprehension = Decoding × Language Comprehension.* It's a
**product** — if either factor is near zero, reading is near zero. Scarborough's **Reading Rope** (2001) unwinds these into
*word recognition* (phonological awareness, decoding, sight recognition) and *language comprehension* (vocabulary,
background knowledge, syntax, verbal reasoning). **Implication: we need both a decoding track AND a language/meaning track.**

**The 5 pillars** (National Reading Panel 2000): phonemic awareness, phonics, fluency, vocabulary, comprehension — explicit
instruction in each works.

**Systematic synthetic phonics** — our core mechanic — is the **strongest-evidenced lever** (Ehri/NRP 2001: d≈0.41,
*larger when started early* d≈0.55; EEF Toolkit: +5 months, "very extensive evidence"). **Honesty:** the robust claim is
"**systematic** + explicit + cumulative beats incidental/whole-language"; the narrower "**synthetic** specifically beats
analytic" is **contested** (Torgerson et al. 2006 found no significant difference; Camilli reanalysis put the NRP effect
nearer d≈0.24). And NRP/Ehri found phonics did **not** significantly help readers with cognitive limitations — directly
relevant to Teddy's profile → **keep the heavy repetition, mastery-pacing, and engagement scaffolds; don't assume
phonics-alone transfer.** Our honest framing: *"systematic, explicit, cumulative, blend+segment, started early"* — which is
exactly what we do — and we don't overclaim the "synthetic" brand.

**Phonemic awareness** is a top-2 early predictor — **but only as a means to orthographic mapping, and only WITH LETTERS.**
The high-yield skills are **blending** (→ decoding) and **segmenting** (→ spelling); 1–2 skills beat 3+; there's a dosage
ceiling (~5–18h) — *PA is a gate you walk through, not a place to live.* **Don't add "advanced oral-only PA" drills**
(deletion/substitution "in the dark") thinking they're a multiplier — that's **contested/unsupported** (Clemens et al.;
Shanahan).

**Orthographic mapping** (Ehri 2014, strong): words become instant "sight words" by **bonding spelling↔sound↔meaning via
grapheme-phoneme analysis — NOT visual whole-word memorization.** Even irregular words are mostly regular; map the regular
graphemes to sound and flag only the truly irregular ("heart") part. **Never teach word shapes / flashcard matching.**

**Decodable text** (modest/emerging): restricting early text to taught correspondences forces *decoding over guessing*. The
**strong** claim here is the *negative* one: **no three-cueing / "guess from the picture."**

**Fluency** (NRP, strong-ish): built by **guided, repeated, *oral* reading with corrective feedback** — *not* round-robin,
*not* unguided silent reading, **accuracy before speed (no speed-timers as the goal).**

**Structured Literacy** core (explicit / systematic / cumulative / diagnostic-responsive) is **strong**; the **Orton-Gillingham
brand and "multisensory/VAKT" add-on specifically are contested** (Stevens et al. 2021: non-significant for foundational
skills; Schlesinger & Gray 2017: no advantage over structured instruction alone; Castles/Rastle/Nation 2018). **Keep
see/hear/trace/find for engagement + reps — but the systematic phonics sequence is the load-bearing part, not the tracing.**

**Cognitive Load Theory** (Sweller; Mayer; Rey 2023, strong): working memory is the bottleneck. The **seductive-details
effect** — appealing-but-irrelevant art/animation *during* learning **measurably depresses learning, worst for novices**
(exactly Teddy). **Decoration must never compete with the target signal; juice fires AFTER the answer.**

**ADHD** (Stewart & Austin 2020): kids with ADHD benefit from reading intervention *as much or more* than peers — the
bottleneck is *holding attention to the rep*. Win with **short single-skill bursts, immediate feedback, novelty inside a
predictable shell, offloaded working memory (audio-first), gentle error-handling.** **EF "brain-training" minigames don't
transfer to reading** (Rapport 2013) — spend the minutes on reading itself.

**Gamification** (Sailer & Homner 2020; honest): positive average effects but **heterogeneous, design-dependent, and
inflated by novelty/short studies.** Engagement ≠ learning. Features that move *outcomes* are the ones that make you
**practice the target skill more and better**; points/badges as ends don't. And **extrinsic reward-for-participation
undermines intrinsic motivation** (Deci/Ryan 1999) — *reward mastery, not showing up.*

**Teddy's specific profile:** there is **no reading-specific research on ZMYM2** (rare, recent, thin literature) — so we
justify everything from the **general evidence for his co-occurring profile** (developmental delay / possible mild ID /
ADHD / language delay) and **pace to the child, not the syndrome.** The variability is wide; assess and respond.

### NON-NEGOTIABLE INGREDIENTS (the checklist we map against)
- Both strands present: explicit **decoding** *and* a **language/meaning** track (Simple View).
- **Systematic, explicit, cumulative** phonics; never use a grapheme before it's taught.
- **Blend** (read) + **segment** (spell) trained heavily; PA always **with letters**; no advanced oral-only PA drills.
- **No three-cueing / picture-guessing**; audio + letters carry the answer.
- **Sight words via sound-mapping**, flag only the irregular grapheme; never word-shape matching.
- **Decodable connected text**; **guided repeated reading**, accuracy before speed, no speed-timers.
- **Diagnostic / mastery-paced**: re-teach weak items before advancing; spaced retrieval of weak items.
- **Immediate corrective feedback that supplies the answer.**
- **Multisensory = engagement aid, NOT the mechanism.** Systematicity is load-bearing.
- **Vocabulary + comprehension grown alongside** decoding, not deferred.
- **Reward mastery, never participation**; max reading reps per minute; keep the learning moment uncluttered.

---

## 2. Mapping — what we built vs. the evidence (the validated core)

**Our build is, mechanic-for-mechanic, remarkably aligned.** What's *confirmed strong*:

| Our mechanic | Evidence it implements | Verdict |
|---|---|---|
| SATPIN order + `curriculum.test` "no untaught grapheme" gate | systematic/cumulative phonics (the #1 lever) | ✅✅ strongest decision *(but gates on TAUGHT, not MASTERED — per-word mastery gate in progress, #182)* |
| forge (build from grapheme tiles) | **segmenting / encoding** | ✅✅ high-yield |
| read (decode → tap meaning) | **blending / decoding** + comprehension check | ✅✅ |
| scan/find/boss (sound→letter, audio-only target) | PA **with letters**; no three-cueing (anti-gaming #4) | ✅✅ |
| spell — Heart Word Method (sound-map, flag ♥, BUILD not recognize; "no word-shape matching anywhere") | **orthographic mapping** (Ehri) | ✅✅ textbook |
| sentence / cloze / maze / scramble | decodable connected text + comprehension/syntax | ✅ (the language strand — see gap #3) |
| mastery gate (str≥4 & seen≥5 & acc≥0.8) before milestones; `masteryReview` loops | **mastery learning** (Bloom) | ✅✅ *but MILESTONES ONLY — generalizing to a per-word automaticity gate so words aren't introduced before their letters are mastered (#182; the §C drift-fix the parent flagged 2026-06-19)* |
| adaptive patrols (`pickWeak`, weak-weighting) | **spaced retrieval of weak items** (Dunlosky top-2) | ✅✅ |
| gentle wrong = dim + **replay the sound** + retry, pulse after 2 misses | **immediate corrective feedback supplying the answer** | ✅✅ |
| no timers / no fail (constraints #1/#2) | ADHD: preserves willingness to do reps | ✅✅ |
| audio-first, minimal on-screen text | offloads working memory (CLT) | ✅✅ |
| CONFUSE pairs + contrast cue (b/d/p/q) | confusable-letter discrimination | ✅ |
| training room (alt build/decode, adaptive, coins) | blend+segment reps, spaced, mastery-weighted | ✅✅ |
| §6.0 mastery-not-participation contract | reward mastery not participation (Deci/Ryan) | ✅✅ "most evidence-aligned decision in the app" |
| "juice the reward layer, never the prompt" | CLT / seductive-details | ✅ (but the live risk — see #2 below) |

**Takeaway: protect this core above all. It is the part the evidence most firmly supports.** No redesign should erode it.

---

## 3. Gaps & risks — the prioritized focus list (this is where the work is)

1. **[✅ SHIPPED 2026-06-15 — was the #1 gap] Close the TEKS Grade-2 gaps: r-controlled vowels + multisyllabic/affixes.**
   **DONE** (Neo, commit `cd79486`, built to `CURRICULUM-GRADE2.md`): Act-2 zones **107 Pirate Cove** (r-controlled
   ar/or/er/ir/ur) + **108 Giant's Bridge** (multisyllabic + prefixes/suffixes), in play order after vowel teams, before
   the Great Library; `RCONTROLLED`→`GRAPH2`, new `syllabify`/`startSyllable`, finale gates on r-controlled. `curriculum.test`
   100/100 with new guards. The stated GOAL (~2nd-grade/TEKS by end of Act 2) is now **met** — the full letter→…→
   multisyllabic ladder is live end-to-end. *(This was "the single biggest threat to objective #1"; now resolved.)*

2. **[HIGH · DESIGN GUARDRAIL] Bind the ARENA/beauty push with the seductive-details rule.** The evidence is unambiguous:
   decoration *during* the decision depresses learning, worst for novices like Teddy. With The Oracle now mandated to make
   it Supercell-juicy, this needs teeth: **the learning moment (the sound→letter / build / decode choice) stays calm and
   uncluttered; all juice/beauty fires AROUND and AFTER reps, never on the prompt.** → The §20 Premium Bar must add a
   "**learning moment is calm — no animation/decoration competing with the target**" check, and the render-gate enforces it.
   *(Flagged to The Oracle.)*

3. **[DEFERRED by parent 2026-06-16 · CONTENT] Grow the language-comprehension strand** (Simple View's 2nd factor).
   **Parent decision: do NOT build this yet — wait until the decoding is demonstrably paying off (Teddy is visibly
   learning to read).** Don't pre-emptively add a vocabulary/comprehension system. *(Why it's on the radar:* we're
   decoding-heavy; vocabulary + oral/language comprehension are thin, and Teddy has a **language delay**, so it matters more
   for him than average. When un-deferred: decoding stays priority #1, but grow meaning alongside — mentor narration as rich
   oral-language input, light word-meaning moments, the sentence/scramble work. *)* Revisit on the parent's signal.

4. **[MED · FLUENCY HONESTY] True fluency needs a listener.** The evidenced method is **guided repeated *oral* reading with
   feedback** — which a no-microphone app can't do. Our "fluency" rungs build **rapid word recognition + accuracy** (valuable,
   keep them) but aren't oral-reading fluency. → **Recruit the parent**: a recurring "read this decodable passage aloud to a
   grown-up" loop. And ensure the in-app "rapid decoding" is framed as **automaticity, never speed-pressure** (no countdowns).

5. **[LOW-MED · FRAMING] Reframe "multisensory."** CLAUDE.md leans on "Orton-Gillingham-style multisensory" as if it's the
   active ingredient. It isn't (contested). Keep trace/say/find **for engagement + reps**; state plainly that **systematicity
   is the load-bearing element.** (The app already smartly skips trace for 2-char graphemes — consistent with this.)

6. **[LOW-MED · METRICS] Make MASTERY the headline metric**, not minutes/coins/engagement (which gamification research warns
   are not learning proxies, and which fade with novelty). The parent Progress view should foreground **mastery growth +
   reading reps**, with the ★ mastered-for-milestones as the hero number. Coins/time stay as secondary amplifiers.

**Cross-cutting reminder:** because phonics-alone may transfer less for his profile, the levers that matter most for Teddy
specifically are **over-repetition, mastery-pacing, and keeping him willingly doing reps** — which is precisely where the
FUN/ADDICTING/BEAUTIFUL amplifiers earn their keep, *as long as they never violate the guardrails above.*

---

## 4. Evidence-honesty note (so we never overclaim)
- Effect sizes are **as commonly reported**; several (NRP PA d's, Sailer/Homner, Deci/Ryan, Stevens g's) were summarized from
  secondary syntheses, not re-read line-by-line — verify before quoting a precise number.
- **Contested, flagged honestly:** "synthetic > analytic" (no sig RCT difference — Torgerson); the NRP effect size (Camilli
  reanalysis ≈0.24); Clackmannanshire (methodologically criticized, over-cited); "advanced oral PA" (unsupported); OG brand +
  multisensory (non-significant / no unique advantage). The *systematic, explicit, cumulative, blend+segment-with-letters,
  orthographic-mapping* spine is the part that carries the strong evidence — and it's our spine.
- **ZMYM2:** no reading-specific literature exists; everything here rests on the general DD/ADHD/language-delay evidence and
  the principle of **assessing-and-pacing to the child.**

## 5. Sources (verified real)
Gough & Tunmer 1986 (Simple View) · Scarborough 2001 (Reading Rope) · National Reading Panel 2000 · Ehri, Nunes, Stahl &
Willows 2001 (*Review of Educational Research* 71(3), systematic phonics meta-analysis) · Ehri 2014 (*Scientific Studies of
Reading* 18(1), orthographic mapping) · Rice & Erbeli 2022 (*RRQ*, PA meta-analysis) · Clemens et al. 2021 (advanced-PA
critique) · Torgerson, Brooks & Hall 2006 (DfES RR711) · Rose 2006 (Independent Review) · EEF Teaching & Learning Toolkit
(Phonics) · Stevens et al. 2021 (*Exceptional Children* 87(4), O-G meta-analysis) · Schlesinger & Gray 2017 (*Annals of
Dyslexia*) · Castles, Rastle & Nation 2018 (*PSPI* 19(1), "Ending the Reading Wars") · Cheatham & Allor 2012 (decodable text)
· Share 1995 (self-teaching hypothesis) · Sweller/Ayres/Kalyuga 2011 (CLT) · Mayer/Fiorella; Rey 2023 (seductive details) ·
Dunlosky et al. 2013 (*PSPI*, high-utility techniques) · Hattie & Timperley 2007 (feedback) · Deci, Koestner & Ryan 1999
(reward/intrinsic motivation) · Sailer & Homner 2020 (gamification meta-analysis) · Stewart & Austin 2020 (ADHD reading
interventions) · Connaughton et al. 2020 (*AJHG*, ZMYM2; OMIM #618932) · TEKS 19 TAC Ch. 110 §§110.2–110.4.

— Trinity, 2026-06-15
