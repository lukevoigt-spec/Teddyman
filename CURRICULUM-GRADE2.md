# CURRICULUM-GRADE2.md — build spec: close the TEKS Grade-2 gap (r-controlled + multisyllabic/affixes)

> **Why this exists:** `PEDAGOGY.md §3` + the QA.md ticket flagged (and verified by grep) that **r-controlled vowels and
> multisyllabic/affix decoding are missing** — so as built, Act 2 stops *short* of the stated goal (~2nd-grade / TEKS
> "ready for 3rd grade"). This is the **#1 thing standing between the app and objective #1.** This doc is the build-ready
> spec for **Neo** (curriculum/code) + **The Oracle** (any new screen art, render-gated). From a 2-stream cited research
> review (Trinity, 2026-06-15); sources at the bottom. **Run every word through `toGraphemes`/the test harness before
> shipping** — the banks were hand-checked but the test is the source of truth.
>
> **TEKS anchor (§110.4, Grade 2 decoding):** six syllable types incl. **r-controlled** + multisyllabic = **2.2.B.(iii)**;
> syllable-division VCCV/VCV/VCCCV = **2.2.B.(v)**; **prefixes un-/re-/dis- + inflectional -s/-es/-ed/-ing/-er/-est** =
> **2.2.B.(vi)** (r-controlled also appears at Grade 1, 1.2.B). DECODE these now; *spelling* them (2.2.C.(vi)) is a
> separate, later skill — so **decode-before-spell** (don't require the spelling-change rules to read). That list IS the
> spec, not a preference. *(Honesty: "ready for 3rd grade" is our **program goal / Texas policy** framing — HB 3 — **not** a
> TEKS clause; attribute the mechanics to the codes above, not that phrase.)*

## 0. Where it slots (play order + ids)
Two new zones, inserted in the `ZONES` **play order** (array order = play order; the `z:` number is just membership)
**after Singing Glade (104, vowel teams)** and **before the Great Library (105, fluency) + Dragon Keep (106, finale)**:
> …101 Castleton → 102 Iron Forge → 103 Enchanter's Tower → 104 Singing Glade → **107 R-CONTROLLED → 108 MULTISYLLABIC**
> → 105 Great Library → 106 Dragon Keep.
- **Mission ids: append in the Act-2 range (100–199), never renumber** (saves are keyed by id). Suggested blocks below
  (Neo confirms no collision against existing 100–145): **R-controlled 150–159, Multisyllabic 160–172.**
- Add `ZONESPOTS[2]` [x,y] for the two new zones on the medieval map; add act-scoped `GEAR_AT` rewards at the two new
  finales (159, 172). **Fold the new patterns into the Great Library fluency words + the Dragon Keep finale** (so they're
  practiced for automaticity, then the finale proves them). r-controlled MUST come before multisyllabic (it's a
  prerequisite syllable type — multisyllabic words contain r-controlled syllables).

---

# ZONE 107 — "THE PIRATE COVE" · R-CONTROLLED VOWELS (Bossy R)
*(Theme mnemonic: pirates say "arrr" — Bossy R. Noah/medieval framing fine too.)*

## Engine (tiny — mirrors vowel teams exactly)
```
const RCONTROLLED=["ar","or","er","ir","ur"];                 // each = ONE gem = ONE sound
const GRAPH2 = DIGRAPHS.concat(VOWELTEAMS).concat(RCONTROLLED);// toGraphemes() longest-match picks them up free
const RCONTROLLED_MISSION={ar:150, or:151, er:154, ir:155, ur:156};
function taughtRControlled(){ return RCONTROLLED.filter(g=>S.done[RCONTROLLED_MISSION[g]]); }
// actGraphemes(): Act-2 branch → add .concat(taughtRControlled()) so the finale GATES on r-controlled too.
```
**Audio aliasing (critical):** `er`, `ir`, `ur` all say **/ər/** — alias `snd_ir`/`snd_ur` → `snd_er` so the child hears
ONE sound across three spellings. `ar`=/ar/, `or`=/or/ are distinct.

## Teaching order + mission ladder (UFLI order: ar → or → review → er → ir → ur → /ər/ review → finale)
| id | type | grapheme/words | label |
|---|---|---|---|
| 150 | learn | `ar` | Quest: Bossy R — AR (arrr!) |
| 151 | learn | `or` | Quest: Bossy R — OR |
| 152 | forge | car, fork, star, corn | Cove Forge: AR & OR |
| 153 | read | car, star, fork, corn | Cove Reading: AR & OR |
| 154 | learn | `er` | Quest: the /er/ sound — ER |
| 155 | learn | `ir` | Quest: another /er/ — IR |
| 156 | learn | `ur` | Quest: another /er/ — UR |
| 157 | forge | her, bird, fur, girl | Cove Forge: the /er/ family *(⚠ /ər/ gem PRE-PLACED — see rule)* |
| 158 | read | bird, girl, fur, surf | Cove Reading: the /er/ family |
| 159 | forge/read | car, corn, bird, fur, star, turn | **Bossy R Showdown** `finale:true` |

## Decodable word banks (single-syllable; only already-taught consonants/digraphs/blends)
- **ar /ar/:** car, jar, far, bar, arm, art, bark, dark, park, mark, card, hard, yard, farm, cart, dart, part, star, scar, sharp, shark, chart, charm, spark, barn, yarn.
- **or /or/:** for, fork, cork, pork, born, corn, horn, torn, cord, fort, port, sort, sport, storm, short, north, stork.
- **er /ər/:** her, fern, herd, perk, term, germ, verb, jerk, perch, stern, clerk.
- **ir /ər/:** sir, stir, fir, bird, girl, dirt, firm, shirt, third, first, twirl, swirl, chirp, smirk, birch, skirt.
- **ur /ər/:** fur, cur, blur, slur, spur, hurt, turn, burn, curl, curb, surf, hurl, turf, churn, burst, blurt, spurt.
- **Picturable (READWORDS2 / picture-match):** car, star, jar, corn, fork, barn, shark, bird, girl, shirt, fur, surf, church, fern. *(church = `ch`+`ur`+`ch`, a nice flex of two prior skills.)*

## Constraints (bake into the build)
1. **Forge/encode pre-fixes the /ər/ gem.** Never ask the child to *choose* er vs ir vs ur from a sound — there's no rule (it's word-specific). In `forge`, place the correct /ər/ gem as a given slot; the child builds the rest. (Reading/decoding is unambiguous and fine.)
2. **EXCLUDE w+ar (war, warm, ward, swarm) and w+or (word, work, worm, world) — `w` flips the sound.** Also exclude silent-e/vowel-team-r words (more, store, fire, wire, cure, curse, nurse, heart, fair, hair, fear, door) — not yet decodable.
3. **Skip the handwriting trace** (2-char gem, per the existing digraph/vowel-team rule) → straight to "FIND IT! / sound work."
4. **Bossy-R demo = reuse the `startMagic` "CAST" pattern:** show the vowel → slide **R** in behind it → the vowel's normal sound gets "grabbed"/muted → the r-controlled gem lights + speaks /ar/. ("When R stands behind a vowel, R gets BOSSY — the vowel can't say its own name.")
5. **Anti-gaming #4 holds:** the on-screen prompt stays generic ("find the gem that makes this sound 🔊"); the target rides only in audio.
6. **Backward-compat guard:** `curriculum.test` must assert no existing taught word silently contains an ar/er/ir/or/ur sequence as *separate* sounds (same guard pattern as "said"). (Spot-check: *her, for, star* aren't in current banks — low risk, but guard it.)

## Audio to record (parent, via the Studio — highest leverage; TTS mangles isolated r-controlled)
`snd_ar`, `snd_or`, `snd_er` (alias `snd_ir`/`snd_ur` → it), + Noah's "Bossy R" intro lines.

---

# ZONE 108 — "THE GIANT'S BRIDGE" · MULTISYLLABIC + AFFIXES (Big Words)
*(Theme: small word-stones join into GIANT words; chunks = stepping stones across the bridge.)*

## New mechanic — `startSyllable` (mirrors `startMagic`) + `syllabify(word)`
The skill is a 5-move routine, NOT memorizing syllable-type names (drop the metalanguage for a 7-yo — the *procedure*
transfers, the labels don't; **Kearns 2020, RRQ:** the rigid V|CV "first-vowel-long" rule holds only **~30%** of the time,
and reliability collapses in longer words — so teach **FLEX, not rules**):
> **(a) SPOT** the vowels → **(b) SPLIT** (the "chop" animates) → **(c) BLEND each chunk** (each is a CVC he already
> reads) → **(d) PUSH together** → **(e) FLEX + check** "is that a real word?"
>
> **(e) FLEX is a CORE mechanic, not a fallback — build it in.** ~**90% of multisyllabic words contain a schwa** (the
> unstressed vowel reduces to a lazy "uh": the *o* in *lemon*, the *a* in *about*), so a deterministic sound-out *fails
> most real words*. When the pushed word "isn't a real word he knows," he **tries the lazy 'uh'** on the unstressed vowel
> (and, for VCV, flips the vowel long↔short) and re-checks — framed as **"be a word detective"**, a power-up, never an
> error (constraint #2). This *flex-and-self-correct* IS the skill; do not ship a single-pass deterministic decoder.
```
function syllabify(word){
  // 1) compound lookup: if word === a+b where a,b ∈ KNOWN_WORDS → split a|b   (sun|set)
  // 2) VCCV: vowel-Cons-Cons-vowel → split BETWEEN the consonants            (rab|bit, nap|kin)
  //    ⚠ NEVER split a digraph (sh/ch/th/wh/ck/ng) or a true blend — operate on toGraphemes() GEMS,
  //    so a digraph stays one unit (bath|tub, not bat|htub; truck stays whole). (OGforAll VCCV rule.)
  // 3) VCV: vowel-Cons-vowel → FLEX: try open-first (long: ti|ger); if not a real word, try closed-first (lem|on)
  // return [chunk1, chunk2]
}
```
- `startSyllable`: show word → child taps the split point (chop animates) → each chunk lights + sounds → chunks fly
  together → credit the whole word. **Render two slot-groups with a visible gap/scoop** (extend the forge slots).
- **forge + read become syllable- and affix-aware** ("peel the affix": cover the ending, read the base, add it back; or
  scoop the two chunks).

## Teaching order + mission ladder (compounds → VCCV → VCV-flex; then affixes inflectional → comparative → prefixes)
| id | type | words | label |
|---|---|---|---|
| 160 | syllable | sunset, cobweb | Big Words: two words HUG (compounds) |
| 161 | forge/read | sunset, hotdog, catfish, backpack | Bridge Forge: Compounds |
| 162 | syllable | rabbit, napkin | Chop the Giant: split the twins (VCCV) |
| 163 | forge/read | rabbit, magnet, basket, helmet | Bridge Forge: VCCV |
| 164 | syllable | tiger, robot, lemon | Try Long First! (VCV flex) |
| 165 | read | tiger, robot, lemon, robin | Bridge Reading: VCV |
| 166 | syllable/affix | jump → jumps → jumping | Word Endings: peel -s, -ing |
| 167 | forge/read | jumping, helping, kicking, jumped | Bridge Forge: -ing / -ed |
| 168 | affix | jumped(/t/), planted(/ɪd/), played(/d/) | The Three -ed Sounds *(by ear + self-correct)* |
| 169 | forge/read | faster, fastest, longer, jumper | Endings: -er / -est |
| 170 | affix | undo, redo, unlock, unzip | Word Starts: un- (not), re- (again) |
| 171 | forge/read | unlock, jumping, faster, redo, distrust | Bridge Forge: mix |
| 172 | read | sunset, rabbit, jumping, unlock, magnet, faster | **The Giant Word Champion** `finale:true` |

## Decodable word banks (decodable from all taught patterns incl. r-controlled from zone 107)
- **Compounds (two known chunks):** sunset, cobweb, laptop, bathtub, hilltop, pigpen, catfish, hotdog, sandbox, bobcat, dustpan, sunfish, jackpot, suntan, backpack, dishpan, fishpond, sandpit, hatbox, lapdog, picnic, zigzag, gumdrop, upset, uphill.
- **Closed-closed VCCV (both vowels short → split between):** rabbit, napkin, magnet, basket, picnic, mascot, helmet, sunset, contest, mitten, kitten, ribbon, button, muffin, puppet, insect, velvet, sudden, cannot, until, trumpet, dentist, pumpkin, absent, index. *(After zone 107: hammer, winter, summer, garden, sister become legal — they contain r-controlled.)*
- **VCV flex (try long first):** tiger, robot, open, begin (closed-first: lemon, robin, cabin, wagon, melon). *(Honest: open-split is right ~55–75% — teach FLEX, not a rule.)*
- **Base + inflectional affix — NO spelling change (teach FIRST, peel-strategy always works):** jump→jumps/jumping/jumped(/t/), help→helps/helping/helped(/t/), kick→kicks/kicking/kicked(/t/), pick→picking/picked, pack→packed, wish→wishes/wishing/wished, fish→fishes/fishing/fished, rest→resting/rested(/ɪd/), melt→melted(/ɪd/), plant→planted(/ɪd/), want→wanted(/ɪd/), hand→handed(/ɪd/), sand→sanded, mend→mended, fast→faster/fastest, long→longer/longest, soft→softer, jump→jumper.
- **Prefixes:** undo, redo, unfit, unlock, unzip, undid, repack, unpack, reset, refill, unwell, unbend, unpin, unplug, distrust, dislike, redid, restock.
- **DEFER (decode-only, a later sub-batch — spelling-change):** hoping/hopping, happier — frame as "the base is hiding; is the vowel long or short?" Prefer no-change bases until those land.
- **Picturable (READWORDS2 / picture-match):** sunset, cobweb, laptop, bathtub, catfish, hotdog, sandbox, backpack, rabbit, magnet, basket, helmet, mitten, kitten, button, muffin, puppet, pumpkin, insect, trumpet, jumping, jumped, fishing, kicking, resting, unlock, unzip.

## Constraints / simplifications (ADHD · possible dyslexia · language delay)
1. **-ed by EAR, not rule.** Don't teach voiced/unvoiced. The child tries the chunk and self-corrects to the real word ("jump-ed → sounds wrong → jumpt"). The ONE light rule: **-ed after t/d = /ɪd/ + an extra beat** (want·ed) — reliable + audible.
2. **Spelling-change words: DECODE yes, SPELL no.** Peel-and-read the base; prefer no-change bases first (above). Drop-e/double/y→i are *spelling* rules he doesn't need to produce now.
3. **Schwa is the trap.** In unstressed syllables vowels reduce (lemon, about). Teach **flex-and-self-correct** ("say it both ways, pick the real word"), not schwa theory; **avoid heavy-schwa words early** (about, sofa, zebra) — prefer honest-short-vowel words (napkin, basket, magnet).
4. **No metalanguage** (no "open/closed/VCCV" said to the child) — one visible action: chop → read chunks → push → check.
5. **One affix per mission; ≤2 chunks at first; never stack** (no jumping+happier+unlockable together). Keep the active prompt calm (seductive-details rule); the chop/juice fires AFTER the read.
6. **Self-correction = the skill, framed as a power-up, never an error** (constraint #2). "Try, hear it's wrong, flip it" is the win for a possibly-dyslexic reader.

---

## Engine/code change summary (for Neo)
1. `RCONTROLLED` + folded into `GRAPH2`; `RCONTROLLED_MISSION`, `taughtRControlled()`; add to the Act-2 `actGraphemes()`.
2. New mission type **`startSyllable`** + `syllabify(word)` (compound lookup → VCCV split-between → VCV flex); make `forge`/`read` syllable- & affix-aware (peel the affix / scoop two chunks; render a slot gap).
3. Data: `COMPOUNDS[]`, `VCCV[]`, `AFFIXES[]` (base+ending pairs) + `KNOWN_WORDS` set for the compound lookup; extend `READWORDS2` with the picturable subsets (Oracle adds the `picIcon`/`PICONS` art — **crafted SVG, no emoji**, §6/§18, render-gated).
4. Add the two zones to `ZONES` in play order + `ZONESPOTS[2]` map spots + act-scoped `GEAR_AT` at 159/172.
5. Fold r-controlled + multisyllabic words into the **Great Library** fluency (`READWORDS2`/`SENTENCES2`/`CLOZE2`) and the **Dragon Keep finale** reading proof; gate the finale on `actGraphemes` (now incl. r-controlled) + completion/mastery of the new missions (`masteredItem`).
6. Record the new audio (above) — `snd_ar/or/er` (+aliases) + Noah lines.

## `curriculum.test.js` extensions (the guards — non-negotiable)
- Every new word **tokenises cleanly** via `toGraphemes`/`syllabify` and uses **no grapheme/affix before it's taught** (play order).
- r-controlled longest-match: `star`→[s,t,ar], `church`→[ch,ur,ch], etc.
- Affix words decodable by play order (base taught + affix taught); `-ed` items cover all three sounds.
- **No existing taught word silently contains an r-controlled sequence as separate sounds** (the "said" guard pattern).
- Compound lookup only splits into **known** words; VCCV/VCV flex returns a real word.
- Sight/heart words still whole-voiced, never `toGraphemes`'d.

## Sources
**Kearns (2020), *Reading Research Quarterly* 55(S1) — English syllable-division rules are unreliable (V|CV "long-first"
≈30%) → teach FLEX, not rules (the anchor citation).** · UFLI Foundations S&S (L63–65 inflectional -es/-ed/-ing; L66–68
syllables/compounds; **L99–106 affix order: -s/-es → -er/-est → -ly → -less/-ful → un- → pre-/re- → dis-**; L107–110
spelling-changes *deferred*; L77–83 r-controlled ar→or→er→ir→ur) · TEKS §110.4 Grade 2 **2.2.B.(iii)** six syllable types
+ multisyllabic, **(v)** VCCV/VCV/VCCCV division, **(vi)** prefixes+inflectional endings; **2.2.C.(vi)** spelling (later) ·
UFLI "Teaching Big Words" + Reading Universe / FCRR (scoop-and-read; **schwa flex — 90%+ of long words have a schwa**) ·
OGforAll / Pride / Phonics Hero (r-controlled, w+ar/w+or, VCCV never-split-digraphs, Tiger/Camel) · IMSE / Learning at the
Primary Pond (procedure-not-labels) · LiteracyLearn / Readsters (3 sounds of -ed) · visual-crowding evidence (the
calm-prompt / seductive-details guardrail).
*Uncertainty: UFLI lesson numbers confirmed from their toolbox; word banks independently assembled to "only-taught
patterns," NOT lifted — verify each via `toGraphemes`/`curriculum.test` before shipping. VCV open-split rate (~55–75%)
varies by corpus → teach flex. This is advisory pedagogy, not a substitute for the parent's read on Teddy's pace.*

— Trinity, 2026-06-15
