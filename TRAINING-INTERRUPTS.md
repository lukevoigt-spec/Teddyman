# TRAINING-INTERRUPTS.md — ally encourage/joke bank (between-rep, Training Room)

> **Purpose:** break Training-Room monotony with short, audio-first ally pop-ins **BETWEEN reps** (never on the active
> decoding prompt — seductive-details guardrail). Only **unlocked** allies appear; lines **ROTATE** (don't repeat until the
> bank is exhausted) so they stay fresh. Each is ≤~6s, skippable, `flow()`-safe. **Parent regenerates the audio** via the
> Studio — so Neo just adds these to `data-lines.js` with the `v` role + this text as TTS fallback, and they appear in the
> Studio automatically. Best recorded in the **real kids' voices**.
>
> **NEW voice roles to add (Act-2 friends — update the CLAUDE.md voice-role list + the Studio role pickers):**
> **J = JJ · R = NORA · X = CAL.** (Keys are internal — any free letter works; what matters is each gets its own Studio
> voice slot.) Existing: Archie = **T**, William = **W**. **All five freed friends now have banks** — *cheers* from Archie
> (pumped) + Nora (sweet/clever); *jokes* from William, JJ, and Cal (mischievous) — so the rotation varies by type, not just
> by voice.
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

## NORA — encouragement, sweet/clever (role **R**)  `train_nora1…20`
1. You're doing so well, Teddy — I'm cheering for you!
2. Look how much you've learned. That's amazing!
3. Take a breath — you've got this. I believe in you!
4. Wow, you read that beautifully! Keep going!
5. You're getting smarter every single minute!
6. I love watching you read, Teddy. You're a star!
7. One word at a time — you're doing great!
8. Your brain is a superpower. Go use it!
9. That one was tricky and you did it anyway. So proud!
10. Keep it up — you're closer than you think!
11. You make learning look fun. Let's keep going!
12. Every try makes you better. You're awesome!
13. High five, Teddy! That was wonderful reading!
14. You never give up — that's what makes you a hero!
15. So close to your goal. You can do it!
16. Reading is your superpower, and it's getting STRONG!
17. You're shining today, Teddy. Keep going!
18. I always knew you were smart. Look at you now!
19. Little by little, you're becoming a super-reader!
20. You should be so proud of yourself — because I am!

## CAL — silly jokes, mischievous (role **X**)  `train_cal1…20`
1. Why did the kid eat his homework? The teacher said it was a piece of cake!
2. What do you call a snowman in summer? A puddle!
3. What's a vampire's favorite fruit? A neck-tarine!
4. Why did the picture go to jail? Because it was FRAMED!
5. What do you call a pig that tells jokes? A real HAM!
6. What did the booger say to the finger? Quit picking on me!
7. Why are fish so smart? They live in SCHOOLS!
8. What do you call two birds in love? TWEET-hearts!
9. What's a skeleton's least favorite room? The LIVING room!
10. Why did the boy throw butter out the window? To see a butter-FLY!
11. What's a cow's favorite holiday? MOO Year's Day!
12. What sound does a nut make when it sneezes? Ca-SHEW!
13. What did one toot say to the other? You blow me away!
14. Why did the toilet paper roll to the party? It was a party POOPER!
15. What's a ghost's favorite ride? The roller-GHOSTER!
16. What do you call a lazy kangaroo? A pouch potato!
17. Why can't a leopard hide? It's always SPOTTED!
18. What do you call a fish wearing a crown? A KING fish!
19. What sound does a poop make in the pool? Plop-plop!
20. What's a tornado's favorite game? TWISTER!

---

*~20 per teller on purpose (they get old fast). Swap any you don't like; add your own. Once approved, Neo drops them into
`data-lines.js` (ids above, `v` roles T/W/J/R/X) and you regenerate the audio in the Studio.*
