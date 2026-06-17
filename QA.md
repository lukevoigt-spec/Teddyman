## Cypher — Final Pre-Launch Deep Review — 2026-06-17

**Context:** User is ready to launch. This is a final, no-holds-barred end-to-end assessment focused on production readiness for real iPad use by a 7-year-old.

### Go / No-Go Verdict

**Conditional Go — with a short list of must-fix items before first real child use.**

The core reading experience is strong and the pedagogy is sound. However, there are still a handful of real iPad/WebKit issues and content drift items that would be noticeable (and in some cases frustrating) on day one.

**Recommended path:** Fix the 4–5 highest-impact items below, do one final real-device pass on win screen + Base + hero card, then launch. Do not launch with the current WebKit hero card flip or win-screen overflow.

### Critical Must-Fix Before Launch (High Impact)

1. **WebKit hero/ally flip card renders backwards/mirrored** (HIGH)
   - On real iPad the back face shows instead of the front. This is a visible regression that affects the league shelf and hero card.
   - Already has a proposed fix (prefixed 3D + explicit visibility). Needs to land.

2. **Win screen + earned chest layout overflow on iPad landscape** (HIGH)
   - When a chest is earned, the win screen clips the title and Continue button. This breaks the premium reward moment.
   - The harness scene doesn't even seed a chest, so the gate can't catch it.

3. **Map node touch targets too small in portrait** (MED-HIGH — hard constraint violation)
   - Current hit rects measure well below the ~96px requirement in portrait. This is the child's primary "play next" action.

4. **Act-2 roster + training interrupt content drift** (MED)
   - Story says one set of friends were kidnapped; code and lines have a mix of old + new cast. Training lines still contain streak/"smart" language that was supposed to be removed.

5. **Sound-ID rows can still be tapped too early on some paths** (MED)
   - Even after recent arming fixes, some paths (especially fortress) can credit reps before the target sound has played. This weakens audio-first and anti-gaming.

### Lower but Worth Fixing Soon

- Hero Base first-visit asset burst is still heavy (~8.5 MB even after lazy fixes).
- Gem-Dex CTA starts clipped in landscape.
- A few remaining emoji in child-facing UI (shop + some secondary controls).

### What’s Actually in Good Shape

- Core reading spine (missions, decode, encode, sentence reading, finale proof) is solid and well-tested.
- Memory Vault, Spell Scroll, and Sound Warm-Up are correctly wired and respect the hard constraints.
- Visual polish on newer systems (flyReward, rewardShower, Training Room climax, homecoming) is strong.
- Save safety and migration hygiene is good.
- Most of the big engagement systems from DESIGN-ENGAGEMENT.md have landed.

### Strategic Observation Before Launch

We have built a lot very quickly. The risk at this stage is not “is it broken?” but “is it delightful and coherent on a real child’s iPad every single day?”

The remaining issues are mostly the kind that only show up in real use (WebKit layout, touch targets, content drift between story and code). Fixing them now will make launch feel polished instead of “almost there.”

### Final Recommendation

**Do a focused 48-hour polish sprint on the 5 items above, then launch.**

After launch, the priority should shift from “add more features” to “deeply integrate and polish what we have” so the reading experience feels seamless and story-connected rather than like a collection of good educational mini-games.

The foundation is strong. A short, targeted cleanup pass will make it feel ready for a real 7-year-old.

— Cypher, 2026-06-17

---

