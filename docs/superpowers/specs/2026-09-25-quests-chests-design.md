# Quests and Chests (Sub-project 4 of 4) - Design

## Goal

A boot.dev-style reward layer: three daily quests and one weekly quest that reward real study actions, paid out in chests holding shop cash, consumables, streak leave days and cosmetics. XP and rank stay a pure measure of study.

Roadmap context: 1 pipelines -> 2 idle engine -> 3 events (all done) -> **4 reward layer**.

## Decisions

- **Chests give goodies and cosmetics**, never XP.
- **Fixed daily trio plus one weekly quest**, drawn with a seed so every device sees the same quests.
- **Derived from existing timestamps** (approach A). The only new stored field is `at` on checks. Claims and unlocks are records with deterministic keys.
- The existing streak leave days stay as they are. A chest can grant an extra leave day.

## Quests

**Day and week keys.** The day is `YYYY-MM-DD` in local time, matching the key the streak uses. The week is the ISO week `YYYY-Www`, starting on Monday.

**Daily draw.** Three distinct quest types, seeded by `hash(profile|day)`.

| Id | Label | Target | Progress counted from |
|---|---|---|---|
| cards | Review N cards | 15-30 | cards with `last` in the day |
| overdue | Clear N overdue cards in <module> | 5-10 | cards in the module that have `last` in the day and had `due` < day start |
| checks | Answer N lesson checks | 3-6 | checks with `at` in the day |
| section | Finish a lesson section | 1 | sections with `at` in the day |
| solve | Hand-solve N contracts | 1-3 | shop `tpl` records with `t` in the day |
| exact | Hand-solve 1 contract exactly | 1 | a `tpl` record in the day with score 1 |
| event | Resolve an event | 1 | `evtdone` records with `t` in the day |

- Targets inside each range are seeded, and the top of the range becomes more likely at higher rank.
- **overdue** targets the module with the most overdue cards at the moment of the draw. The target module is fixed by the first computation of the day and stored in the claim record when the quest is claimed. If no module has overdue cards, this slot becomes `cards`.
- **event** is only drawn when some pipeline has an open event. Otherwise the draw skips it.
- Checks answered before this ships have no `at` and never count.
- The `due` of a card is overwritten when it is graded. So **overdue** progress counts cards whose previous due time was before the start of the day. To make that possible, grading stores the prior value as `pdue`.

**Weekly draw**, seeded by `hash(profile|week)`. One of:
- Study 5 of 7 days: `days` records in the week.
- Master 30 cards: cards at level 4 or higher with `last` in the week.
- Hand-solve 10 contracts: `tpl` records in the week.

**Claiming.** A done quest shows a Claim button. Claiming writes the chest record. Unclaimed quests expire at the end of the day or week.

**Bonus.** When all 3 daily quests of a day have been claimed, a bonus chest can be claimed.

## Chests

| Tier | Source | Rolls |
|---|---|---|
| small | each daily quest | 1 |
| bonus | all 3 dailies claimed | 2 |
| big | weekly quest | 3; at least one is a cosmetic while any cosmetic is still locked |

**Rolls** are seeded by `hash(profile|chestKey|i)`:
- **cash**, 60%: $20-60 for small and bonus chests, $40-120 for big ones. It is added to shop cash.
- **consumable**, 25%: a hint or a reroll, counted as a free tool grant.
- **leave**, 5%: +1 streak leave day. The effective count is still capped at 2. When the count is already full at claim time, this roll becomes cash.
- **cosmetic**, 10%: a random locked cosmetic. When every cosmetic is owned, this roll becomes cash.

**Record.** `chest-<questKey>` stores `{ chest: tier, quest, rolls: [{kind, amount?, tool?, cos?}], t }`. The key forms are:
- `chest-d-<day>-<i>` for daily quests
- `chest-b-<day>` for the bonus chest
- `chest-w-<week>` for the weekly quest

The rolls are written into the record when the chest is claimed, so later changes to the roll table never alter a past chest. Two devices claiming the same quest write the same key, so the merge counts it once.

**Effects on existing systems.**
- `ShopCore.state()` adds the cash amounts from chest rolls.
- The tool counts treat consumable rolls as owned uses.
- `game.js` adds leave rolls to the streak's leave-day count, still capped at 2.
- XP, rank, reputation and the completed-jobs count are unchanged.

## Cosmetics (placeholders, CSS only)

- **Titles** (8): Bean Counter, Learning Curve Surfer, EVM Whisperer, Monte Carlo Kid, Basis-of-Estimate Bard, Escalation Artist, Risk Wrangler, Cost Sage.
- **Flames** (4): blue, green, purple, gold.
- **Desk themes** (4): blueprint, ledger, terminal, brass.
- **Ownership** is derived from the `cos` rolls inside chest records.
- **Equipped items** are stored in `settings.cosmetics = {title, flame, desk}`. It is a single setting, and the newest write wins.
- **Where they show:**
  - The title appears under the rank in the HUD.
  - The flame color applies to the streak icon.
  - The desk theme is a class on the firm panel.

## Modules

**`js/quests.js` (`Quests`).** Pure functions. `now` is passed in explicitly.
- `dayKey(now)`, `weekKey(now)`
- `today(d, now)`: returns `[{ id, key, label, target, progress, done, claimed }]`
- `weekly(d, now)`: returns the same shape.
- `bonus(d, now)`: returns `{ key, ready, claimed }`.
- `claim(d, key, now)`: returns `{ key, rec }`, or `null` if the quest isn't done or is already claimed.

**`js/chests.js` (`Chests`).**
- `TABLE`, `COSMETICS`
- `roll(d, chestKey, tier)`: returns the rolls.
- `owned(d)`
- `leaveGrants(d)`
- `cash(d)`
- `toolGrants(d)`

**Changes to existing files.**
- The check-answer code in `render.js` writes `at`.
- `Scheduler.grade` stores `pdue` before it overwrites `due`.
- `ShopCore.state()` and the tool counts include chest effects.
- The streak in `game.js` includes leave-day grants.
- `hud.js` shows the title and flame.
- The firm panel gets the desk theme class.

## UI

- **HUD badge.** A quest badge such as `2/3` sits next to the streak flame and links to `#/progress`.
- **Quest panel**, at the top of the Progress page:
  - Three daily cards, each with a progress bar and a Claim button.
  - A bonus chest row.
  - A weekly card.
  - A countdown to the next reset.
- **Chest modal.** A CSS shake-and-pop animation, then one card per roll, with an `Equip now` button on cosmetics.
- **Cosmetics grid**, below the achievements on the Progress page. Owned items can be equipped. Locked items are grey silhouettes.
- **Layout.** Phone and desktop, dark mode, existing tokens.

## Testing (Node `assert`)

- **Draw:** deterministic per profile and day; no repeated types; `overdue` falls back to `cards`; `event` is drawn only when an event is open.
- **Progress:** each quest type counts correctly against records with timestamps inside and outside the day. Checks with no `at` are ignored. `overdue` uses `pdue`.
- **Claim:** only a done quest can be claimed, and only once. Claiming on two devices counts once after `Store.merge`. Bonus is ready only after all 3 dailies are claimed.
- **Rolls:** deterministic; a full leave count and a fully owned cosmetic set turn into cash; a big chest guarantees a cosmetic.
- **Existing systems:**
  - XP is unchanged.
  - The streak leave count includes grants and stays capped at 2.
  - Shop cash and tool counts include chest rewards.
- **Manual:** claim flow, chest modal, equipping a title, flame and desk theme, phone and desktop, dark mode.
