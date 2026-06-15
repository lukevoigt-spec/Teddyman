# TRAINING-INTERRUPTS.md — ally encourage/joke bank (between-rep, Training Room)

> **Purpose:** break Training-Room monotony with short, audio-first ally pop-ins **BETWEEN reps** (never on the active
> decoding prompt — seductive-details guardrail). Only **unlocked** allies appear; lines **ROTATE** (don't repeat until the
> bank is exhausted) so they stay fresh. Each is ≤~6s, skippable, `flow()`-safe. **Parent regenerates the audio** via the
> Studio — so Neo just adds these to `data-lines.js` with the `v` role + this text as TTS fallback, and they appear in the
> Studio automatically. Best recorded in the **real kids' voices**.
>
> **NEW voice roles to add (Act-2 friends — update the CLAUDE.md voice-role list + the Studio role pickers):**
> **J = JJ · R = NORA · X = CAL.** (Keys are internal — any free letter works; what matters is each gets its own Studio
> voice slot.) Existing: Archie = **T**, William = **W**. *(Nora/Cal roles reserved here; their banks can be added next —
> say the word and I'll write them.)*
>
> Status: **DRAFT — pending parent approval / swaps**, then → `data-lines.js`. — Trinity, 2026-06-15

## Trigger (for Neo)
Every **N correct reps** (tunable, e.g. ~8–12, with jitter so it's not clockwork), if an ally is unlocked, pop one in via
`allyPop` (using the **new ally art**) + play one **unused** line from that ally's bank (rotate; reshuffle when exhausted).
Mix tellers (Archie cheer ↔ William/JJ joke). Pauses the rep flow for the line, then resumes — `flow()`/watchdog + skip.

---

## ARCHIE — encouragement (role **T**)  `train_arch1…20`
1. YES! Keep it up, Teddy — you're getting STRONG!
2. Whoa, look at you read! Don't stop now, champ.
3. Every word makes your muscles bigger. Go go go!
4. You've got this, hero. One more!
5. Boom! That's my buddy. Keep crushing it.
6. Look at those reading muscles GROW!
7. You're on fire, Teddy! Keep blasting through!
8. That's how a hero trains. Awesome work!
9. High five! You get faster every single time.
10. Don't quit now — you're almost a super-reader!
11. Strong body, strong brain. You've got both, buddy!
12. I knew you could do it. Keep going, champ!
13. Every rep makes you tougher. Let's GO!
14. You make it look easy, hero. One more rep!
15. That was a big one — and you powered right through it!
16. Reading like a champion. I'm so proud of you.
17. Keep that streak alive, Teddy. You're unstoppable!
18. Pow! Another word down. You're a machine!
19. Your power bar is climbing. Don't stop now!
20. That's my hero — strong, brave, and SMART.

## WILLIAM — silly jokes (role **W**)  `train_will1…20`
1. What do you call a sleeping dinosaur? A dino-SNORE!
2. Why did the cookie go to the doctor? It felt CRUMBY!
3. What's brown and sticky? A stick!
4. Why can't your nose be twelve inches long? Because then it'd be a FOOT!
5. What do you call a fish with no eyes? A fshhh!
6. What did one toilet say to the other? You look FLUSHED!
7. Why don't eggs tell jokes? They'd CRACK each other up!
8. What's invisible and smells like carrots? Bunny TOOTS!
9. What do you call a cow with no legs? Ground beef!
10. Why was the broom late? It over-SWEPT!
11. What do you call a dinosaur toot? A blast from the PAST!
12. What do you call a bear with no teeth? A GUMMY bear!
13. Why was six scared of seven? Because seven ATE nine!
14. What does a cloud wear under its shorts? THUNDERWEAR!
15. Knock knock! Who's there? Boo. Boo who? Aw, don't cry — it's just me!
16. What's a monster's favorite snack? I-SCREAM!
17. Why did the teddy bear say no to dessert? He was STUFFED!
18. What do you call a pig that does karate? A pork CHOP!
19. Why did the toilet paper roll down the hill? To get to the BOTTOM!
20. What's a frog's favorite drink? CROAK-a-cola!

## JJ — silly jokes (role **J**)  `train_jj1…20`
1. What do you call cheese that isn't yours? NACHO cheese!
2. Why is the banana so popular? Because it's a-PEEL-ing!
3. What has four wheels and flies? A garbage truck!
4. Why don't you toot in church? You have to sit in your own PEW!
5. What's a toilet's favorite game? Hide and POO-seek!
6. What's brown and sounds like a bell? DUNG!
7. Why did the poop cross the road? It was on a roll to the potty!
8. What did one fly ask the other? Is this stool taken?
9. Why did the math book look sad? It had too many problems!
10. What do you call a dog magician? A labra-CADABRA-dor!
11. What did the zero say to the eight? Nice BELT!
12. What's a ghost's favorite snack? BOO-berries!
13. Why did the banana wear sunscreen? So it wouldn't PEEL!
14. What do you call a spider on the computer? A WEB designer!
15. What's a cat's favorite color? PURR-ple!
16. Why did the kid bring a ladder to school? For HIGH school!
17. What animal toots the most? A SMELL-ephant!
18. What did one wall say to the other? Meet you at the CORNER!
19. What do you get from a spoiled cow? Rotten milk!
20. What do you call a fake noodle? An im-PASTA!

---

*~20 per teller on purpose (they get old fast). Swap any you don't like; add your own. Once approved, Neo drops them into
`data-lines.js` (ids above, `v` roles T/W/J) and you regenerate the audio in the Studio.*
