# Gamification design (2026-09-24)

Two layers: a rewards layer (XP, ranks, streaks, achievements, opt-in leaderboard) and a Farmer-style estimating shop (generated contracts + handwritten campaign). Rewards ship first.

## Principles
- Derive, don't store. Everything numeric (XP, rank, cash, reputation, achievements) is a pure function of the profile data: `Game.compute(data)`.
- Only two new stored parts, both added to `PARTS` in js/storage.js and server.js with the existing per-record merge rules:
  - `days`: `days['YYYY-MM-DD'] = { mod }` (local date). Idempotent: presence = active day.
  - `shop`: write-once records (contract results, purchases).
- Lesson widgets are never locked.

## 1. Rewards
**XP** (computed):
| Source | XP |
|---|---|
| card: each right | 10 |
| card: level reached | 5 x lvl (sum over levels 1..lvl) |
| check done | 10, or 20 if `first` |
| section done | 50 |
| contract finished | round(max(0, pay) / 2), pay in $K |

Relearn-recovery bonus is not derivable from totals; skipped (YAGNI).

**Ranks** by XP: Intern 0, Analyst I 500, Analyst II 1500, Senior Estimator 4000, Lead Estimator 9000, Chief Estimator 18000. "PCEA Certified" = Chief + every module's average card level >= 3 (Strong).

**Active day**: `Store.markActive()` records the date in `days` when the user grades a card, completes a check/section, or finishes a contract. A day counts toward the streak if it has an entry (the threshold of 10 cards is dropped: needs per-day counts, which do not merge cleanly).

**Streak** (computed from sorted days): walk back from today (today may be not-yet-active without breaking). Leave days: earned 1 per 7 consecutive counted days, max 2 held; a single-day gap consumes one if held, otherwise the streak ends. Output: `{ current, best, leave }`.

**Achievements**: table in js/achievements.js, each `{ id, name, desc, icon, test(stats) }` over computed stats. ~20. Newly-true achievements (vs last render, tracked in memory + `settings.seenAch` list) toast once.

**UI**
- Topbar: rank chip, XP progress bar to next rank, streak flame with count. Floating "+N XP" after actions.
- Progress page: rank card, streak card, achievement grid.
- Leaderboard tab (server mode only): setting `settings.leaderboard` (default false). `GET /api/leaderboard` returns `[{ name, rank, xp, streak }]` for opted-in profiles; server computes via the same js/game.js (loaded with `require`).

## 2. Estimating shop
**Tab** `#/shop`: firm name (`settings.firmName`, default "<profile> Cost Analysis"), cash, reputation level, 3 offers.

**Templates** (js/shop/templates.js): ~20, each `{ id, module, title, tier, gen(rng) -> { brief (markdown+math), inputs, answers: [{label, value, unit}] }, explain(inputs) -> markdown, section: '<mod>/<sec>' }`. Seeded RNG (mulberry32). Tiers 1-3 scale the numbers and payouts.

**Offers**: deterministic from `hash(profile + completedCount + slot)` so they need no sync. Only templates whose module is unlocked are offered.

**Unlock**: a template's module unlocks when the average level of its seen cards >= 1 and >= 30% of its cards have been seen (≈ "Familiar"). M05 and M06 templates are always unlocked so the shop is playable from the start.

**Scoring** per answer: relative error e. e <= 1%: 100%; <= 5%: 60%; <= 10%: 20%; else -30%. Contract score = mean. Pay ($K) = base(tier) x score with bases 60/120/250 (campaign 300). Rep +1 for score >= 0.6, -1 if any answer is off by more than 10% and the score is below 0.6, running total clamped at 0.

**Reputation level** = floor(sqrt(rep)) clamped at >= 0; tier access: tier 2 at rep level 2, tier 3 at level 4.

**Tools** (bought with cash, stored `shop['buy-<tool>-<t>']`): calculator $100K, reference tables $150K, "second opinion" $40K (consumable; uses stored as `shop['use-opinion-<t>']`), bigger contract board $400K (4 offers).

**Campaign** (js/shop/campaign.js): 8 handwritten multi-step contracts, each several steps where later inputs may use earlier correct answers. Unlock by rep level (0,1,2,3,4,5,6,7). Each awards an achievement. All 8 = endgame.

**Records**: `shop['c-<n>-<tpl>-<seed>'] = { tpl, seed, answers, score, pay, rep, t }`; purchases `{ tool, cost, t }`. Cash = sum(pay) - sum(cost).

**Show work**: after submit, render `explain()` and link to the lesson section.

## Testing
- Template fuzz: 500 seeds per template; answers finite, positive where expected, generator self-consistent (explain renders without KaTeX errors).
- Merge invariance: `Game.compute(merge(a,b)) === Game.compute(merge(b,a))` on random profiles.
- Streak unit tests (gaps, leave days, today inactive).
- Smoke test extended to shop, leaderboard, progress page; server-test extended for `/api/leaderboard` opt-in filtering.
