## Cypher — Second Deep Dive (Strategic Level) — 2026-06-17

This is a deeper, more reflective pass after the first one. I’m looking at systemic patterns rather than just individual bugs.

### 1. The Core Tension: Feature Rich vs. Focused Reading Experience

We have built an impressively complete 2nd-grade reading system in a very short time. However, the app is now at risk of becoming **too feature-rich for its own good**.

The daily experience currently contains:
- Story missions
- Training Room (build + decode)
- Memory Vault
- Spell Scroll
- Sound Warm-Up
- Treasure Chests
- Squishy collection
- Base customization / weapons
- Homecoming ending

Each of these is individually well-designed and mostly aligned with research. Together, they create **multiple competing loops and decision points**. For a 7-year-old with ADHD, this increases cognitive load and reduces the probability that he will simply do more high-quality reading reps.

The original vision (per CLAUDE.md) was a **superhero adventure that teaches reading**. We are drifting toward “a reading app that also has a lot of nice features.” That shift matters.

**Recommendation:** Before adding anything else, we should decide whether the goal is to keep expanding the feature set or to deeply polish and integrate what we already have so the reading feels seamless and compelling.

### 2. §6.0 Mastery Contract — The Quietest Risk

This is the most important document in the repo right now, and we are starting to drift from it in subtle ways.

Many of the new reward systems reward **volume of activity** (training reps, daily login, chest opening) more than they reward **moments of real mastery**. The Training Room in particular pays coins on nearly every correct rep. When combined with daily meters, chests, and collectibles, a child can make visible progress in the cosmetic layer without ever hitting a true mastery moment.

The red-team question in DESIGN-ENGAGEMENT.md (“Is Teddy attending to the letter/sound or the burst?”) is becoming more relevant as we add more juice.

We are not violating the contract yet, but we are walking up to the line. The more delightful we make the non-reading systems, the more intentional we need to be about making the actual reading mastery moments feel *significantly* more rewarding.

### 3. Spaced Practice Integration Is Still Weak

The Memory Vault is one of the strongest pedagogical additions we’ve made. However, it currently lives as a somewhat separate activity that the child has to choose to enter.

Spaced practice works best when it feels like natural review rather than an extra task. Right now, due items mostly surface when the child deliberately opens the Vault. That’s better than nothing, but it’s not as powerful as it could be.

**Opportunity:** Explore ways to gently surface due items inside existing flows (Training Room, patrols, etc.) without adding new UI or decision points. The goal should be “Teddy practices due items without realizing he’s doing spaced practice.”

### 4. WebKit / Real iPad Risk Is Higher Than It Looks

Several recent issues only appear on real iPad (hero card flip, win-screen chest overflow, Base perf). The render gate improvements help, but they don’t catch everything.

We are shipping to a real child’s iPad on every push to main. This means every visual or layout regression on WebKit is immediately visible to the end user.

**Recommendation:** Treat real-device WebKit verification as a non-negotiable step before any visual or layout PR is considered done, not just as a nice-to-have.

### 5. Story & World-Building Opportunity

The new systems (Vault, Scroll, Warm-Up, Training Room) are pedagogically strong but feel somewhat disconnected from the superhero story. They live in the Base/Training Room rather than feeling like part of Teddy’s journey as a hero.

We have a chance to make the practice systems feel more like “hero training” that advances the larger narrative, rather than separate educational activities. This would increase both engagement and meaning.

### 6. Parent Experience Gap

The Grown-Up Corner has good stats and controls. What it lacks is **actionable insight**.

A non-educator parent doesn’t necessarily know what to do with “60% accuracy on vowel teams.” They want to know: “What should I encourage him to do this week that will actually help?”

We could add 1–2 simple, low-pressure suggestions per week based on his current mastery and due items. This would make the Grown-Up Corner feel more like a helpful co-pilot than just a dashboard.

### Final Strategic Takeaway

We have built a lot, quickly, and most of it is good. The risk now is **complexity creep** — adding more good things until the core experience (reading in a superhero story) becomes diluted.

The highest-leverage move from here is probably not “add more features,” but rather:

**Deeply integrate and polish what we already have** so that reading feels like the most natural, rewarding, and story-connected thing Teddy does every day.

That path stays truer to the original vision and has the best chance of actually moving the needle on his reading.

— Cypher, 2026-06-17

---

