## Cypher — Deep End-to-End Analysis (Fresh as of 2026-06-17)

### Overall State Right Now

The project has moved fast. Many of the bigger structural issues from earlier this week have been addressed or are actively in PRs. The workflow has also shifted — Trinity is now converting Guest QA findings into GitHub Issues instead of keeping everything in QA.md.

**Current reality check:**
- Core reading spine is solid.
- Act 2 content is complete.
- Visual polish has improved significantly.
- But the app is carrying **real go-live risk** on iPad/WebKit (hero card flip, win-screen chest overflow, Base perf on first visit).
- There is also **content/process drift** that needs cleaning before production (Act-2 roster inconsistency + training interrupt lines that still contain streak/smart language).

### Most Important Open Issues (as of latest main + recent Morpheus sweeps)

| Priority | Issue | Type | Status | Notes |
|---------|-------|------|--------|-------|
| **High** | Hero card flips backwards/mirrored on WebKit (iPad) | Visual regression | Open | Backface-visibility + 3D transform issue specific to Safari |
| **High** | Win-screen chest visibility + viewport overflow on iPad | Layout regression | Open (recent) | Chest appears but clips title/Continue button on real devices |
| **High** | Act-2 friend roster inconsistency | Content drift | Open (#110) | `allies.js` + `TRAIN_TELLERS` + story lines + homecoming don't agree on who was rescued |
| **High** | Training interrupt lines still contain streak/"smart" language | Pedagogy drift | Open (#111) | Approved edits in `TRAINING-INTERRUPTS.md` never reached `data-lines.js` |
| **Medium** | Hero Base first-visit art burst (~8.5 MB) | Performance | Open (#113 follow-up) | Even after lazy-load fixes, the loadout PNGs are heavy on cold start |
| **Medium** | Playtest notes writing to wrong location | Process | Open (#112) | Writing to `playtest/*.md` instead of the documented `PLAYTEST.md` |
| **Medium** | Voicepack still heavy on title boot | Performance | Open (#107) | 28+ MB even with `defer` |

### Structural Observations (Deeper Than Surface Bugs)

**1. The daily loop is becoming fragmented**
We now have multiple competing daily activities (Training Room, Vault, Spell Scroll, Warm-Up, chests). While each is good individually, together they create decision points and context switching for a child who already struggles with focus. The original vision was a clean story + light daily practice. We're drifting toward "several mini-games."

**2. §6.0 Mastery contract tension is real**
Many of the new reward systems (chests from training reps, squishies, daily surprise) are tied more to **volume of activity** than to **moments of mastery**. This isn't a hard violation yet, but it's the exact risk the red-team in DESIGN-ENGAGEMENT.md warned about. The more juice we add around "doing stuff," the more important it becomes to make the *reading mastery moments* feel meaningfully bigger.

**3. Visual language is still uneven**
Newer systems (`flyReward`, Training Room climax, homecoming) have good juice. Older paths and many secondary controls still feel flatter. The "Premium Bar" is being applied inconsistently across the codebase.

**4. WebKit/iPad gaps are the biggest near-term risk**
Several recent regressions only appear on real iPad (hero card flip, win-screen overflow). The render gate improvements help, but we still need real-device eyes on the final critical paths before calling it production-clean.

### Genuine Opportunities (Things We Haven't Fully Explored)

These feel high-leverage and aligned with the North Star:

- **Prosody / expressive reading support** — We have repeated reading, but almost nothing that helps Teddy read with better phrasing, pace, or feeling. An ally "Read With Me" mode (modeling + supported reading) would be a natural next fluency layer.

- **Better integration of spaced practice** — The Vault is powerful but still feels like a separate activity. Making due items surface more naturally inside existing flows (instead of requiring a dedicated Recharge visit) could increase actual retention work without adding more UI.

- **Actionable parent insights** — The Grown-Up Corner has good stats. It could go further by surfacing 1–2 concrete, low-friction suggestions per week ("He's strong on digraphs but due for review on vowel teams — the Vault will handle most of it automatically").

- **Long-term mastery visualization** — We celebrate mastery in the moment. We don't yet have a calm, beautiful way for both child and parent to *see* durable progress over weeks (e.g., a simple growing constellation or garden metaphor in the Base).

### Summary Recommendation

The codebase is in **much better shape** than it was a week ago, but it is not yet production-clean for iPad. The highest-leverage work right now is:

1. Close the WebKit visual regressions (hero card + win chest).
2. Reconcile the Act-2 roster and training line content drift.
3. Finish the remaining de-emoji + icon polish.
4. Do a focused real-device pass on the win screen and Base entry.

After those are done, the bigger strategic question becomes: **Do we want to keep adding more daily activities, or do we want to deepen and polish the core reading + mastery experience?**

The second path feels more aligned with the original vision and the §6.0 contract.

— Cypher, 2026-06-17

---

