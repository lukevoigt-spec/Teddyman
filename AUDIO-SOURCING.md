# AUDIO-SOURCING.md — where the letter sounds (and talking lines) come from

> **Parent's ask (2026-06-16):** "Research if there are any pre-recorded letter sounds. The ones I recorded aren't
> premium. I'd prefer to get them from ElevenLabs or some other source if there are professional-sounding recordings."
> **Bottom line: there is no shortcut to premium phonemes — neither ElevenLabs nor any TTS can make a clean isolated
> letter sound, and no safely-licensed pre-recorded pack exists to drop in. The premium path is one short paid session
> with a real human voice (phonics-trained narrator OR a voice actor on a buyout). The talking *lines* are different —
> ElevenLabs is genuinely fine for those.** — Trinity, 2026-06-16 (5-stream cited research; sources at bottom)

---

## The two audio asset classes (they need OPPOSITE solutions)

| Asset | What it is | Premium source | Why |
|---|---|---|---|
| **`snd_*` LETTER SOUNDS** (~37 phonemes) | one isolated pure sound: /sss/, clipped /b/, /ar/… | **HUMAN RECORDING (only)** | TTS *cannot* say a sound in isolation without adding "uh" — see below |
| **Talking LINES** (mentor/villain/cast dialogue, whole words & sentences) | connected speech | **ElevenLabs is fine** (already the Studio path) | neural TTS is built for words/sentences; quality is great here |

So the recordings you weren't happy with are the **phonemes** — and those are exactly the asset that has no premium machine shortcut. This isn't a gap in our setup; it's a fundamental limit confirmed across the whole field.

## Why ElevenLabs / any TTS can't do premium phonemes (the schwa problem)
- A "pure sound" = each phoneme said cleanly with **no extra vowel**. The #1 error in early phonics is adding a schwa —
  /b/ becomes "buh", /t/ becomes "tuh". A child blending "suh-uh-nuh" hears three syllables, not "sun" — it actively
  **breaks blending**, the core decoding skill.
- Neural TTS (ElevenLabs, Google, Azure, Polly, Murf, Play.ht…) is trained on **connected speech**. Feed it a single
  letter and it either says the letter *name* ("bee", "see") or adds the schwa, because its prosody model expects a
  syllable. The SSML `<phoneme>` IPA tag was built to fix **word** pronunciation, not to utter an isolated sound.
- **Stop consonants** (/b d g p t k/) physically need a release burst to be audible — a trained human can clip that to
  the crispest possible /t/; a TTS engine will not reliably do it. **Continuants** (/sss/ /mmm/ /fff/ /lll/ /nnn/ /rrr/
  /zzz/ /vvv/ + vowels) synthesize a bit better but still carry TTS prosody.
- Even *human-recorded* commercial apps get dinged for this (a reviewer caught **Reading Eggs** using "/tuh/" for T) —
  which only proves how much it depends on a person deliberately saying it right. **This validates our existing
  record-primary design** (CLAUDE.md / `audio-studio.js`): phonemes are recorded with per-sound articulation coaching
  (continuous-hold vs stop-clip, no added schwa, mouth position). That stance is correct.

## How the leading reading apps actually source phonemes — recorded humans, often a named teacher
- **Teach Your Monster to Read 2** — UK phonics teacher **Mr Thorne** voices the letter sounds (chosen for clean
  pure-sound articulation). Original game voiced by actor Simon Farnaby.
- **Khan Academy Kids** — recorded character narration. **Hooked on Phonics / Reading Eggs / Hairy Letters (Nessy)** —
  all recorded human voice with per-phoneme sound buttons.
- **Category standard = professionally recorded human voice**, frequently a recognised phonics specialist. None ship
  TTS phonemes.

## Can we just license / download a pre-recorded pack? — No safe drop-in exists
- **No premium CC0 / royalty-free phoneme pack** exists to bundle into our static GitHub Pages site.
- The big phonics brands' sound files — **Jolly Phonics, Read Write Inc, Sounds-Write, Phonics International, Mr Thorne,
  Univ. of Iowa "Sounds of Speech", Forvo** — are **copyrighted / restrictively licensed**; shipping them in the app
  would be infringement. **Do not** rip or embed them.
- **Pixabay / Freesound (CC0)** *can* host individual usable clips, but coverage of all 37 phonemes is patchy and each
  file's license must be verified one-by-one — a fragile, inconsistent-voice fallback, not a premium solution.
- If we *insist* on TTS phonemes anyway, the most permissive licensing for baking clips into a public static site is
  **Amazon Polly** (explicitly allows storing + redistributing generated audio on all tiers; full IPA/X-SAMPA + lexicons
  on neural voices). **Azure** has the best phonetic control (IPA + sapi/ups + PLS lexicons) but needs a **paid** S0
  resource for output rights. **Google Cloud** works only via the older v1beta1 endpoint (its newest Chirp-HD voices
  can't use SSML at all) and has the most conservative redistribution terms. **All three still add the schwa on stops** —
  so even the "best" TTS phoneme would need post-trim and still wouldn't beat a human take.

## Recommended path (premium, cheap, drop-in to our existing pipeline)
**Commission ONE short human session for the ~37 `snd_*` phonemes**, then upload them through the Voice Studio (they land
in `CUSTOM`/IndexedDB and Publish to `voicepack.js` — zero code change). Two flavours:
1. **A phonics-trained narrator / SLP** (knows pure sounds cold) — cleanest pedagogy, ~1–2 hr session, ~37 clips, record
   each twice (the Jolly "spoken twice" convention).
2. **A general voice actor on a full work-for-hire / perpetual all-media buyout** (~$100–400 on Fiverr/Voices.com),
   coached with our no-schwa articulation notes (continuous-hold vs stop-clip, mouth position). Get the **buyout in
   writing** so we can ship + redistribute on the public app forever.
- Either way: QA each clip against the failure mode — does /t/ sound like a crisp "/t/" and **not** "/tuh/"? Continuants
  clearly held? No letter-names ("bee/see")?
- **Keep ElevenLabs for the talking LINES** (mentor/villain/cast dialogue) on the paid plan — that's the right tool for
  whole-word/sentence speech and it's already wired in the Studio.

## Sources
Monster Phonics (pure sounds) · Jolly Learning · Phonics Hero · Oxford Owl · OGforAll (Orton-Gillingham, schwa) · The
Reading Advice Hub / Viva Phonics / Reading Rockets (continuous vs stop) · Wikipedia (Plosive / No-audible-release /
Speech-synthesis) · Teach Your Monster (Mr Thorne) · Khan Academy Kids · A Healthy Slice of Life (Reading Eggs "/tuh/"
critique) · Amazon Polly FAQ + supported-SSML (licensing/phoneme) · Azure AI Speech SSML phonetic-sets + commercial-use
Q&A · Google Cloud TTS phonemes / Chirp-3-HD limits · ElevenLabs TTS best-practices · Murf/Play.ht/WellSaid/Speechify
terms. *(Full URL list in the research task outputs; several authority pages 403 direct fetch — quotes from indexed
excerpts, URLs provided to open directly.)*
