# Shop Idle Engine (Sub-project 2 of 4) - Design

## Goal

Running pipelines from the Workshop (sub-project 1) earn cash over time, including while the app is closed. The learner banks earnings by hand, so there is a reason to come back daily. Cash buys firm growth and a few study aids. It never replaces studying: idle earnings give no XP, and rank still reflects only active work.

Roadmap context: 1 pipelines (done) -> **2 idle engine** -> 3 events that stall pipelines -> 4 boot.dev reward layer.

## Decisions

- **Cash only.** Idle earnings add to shop cash and never to XP, rank, reputation or the completed-jobs count.
- **Two kinds of cash sink.** Firm growth (desks, offline cap, yield multiplier) is the main one; study-aid consumables (hint, board reroll) are the second.
- **Manual collect with a cap.** Each pipeline on a desk fills an outbox up to the offline cap. The learner taps Collect to bank it.
- **Derived from timestamps.** Nothing ticks or is stored while closed. Outboxes are computed from times, and collecting writes a record with a deterministic key so two devices cannot bank the same period twice.
- **Clock tampering is accepted.** Moving the device clock forward yields at most one full outbox per pipeline. No tamper protection.

## Economy

All money is in \$K, like the rest of the shop.

| Quantity | Value |
|---|---|
| Gross yield per hour | `0.25 x ShopCore.BASE[tier]`: tier I 15, tier II 30, tier III 62.5 |
| Upkeep per hour | `0.5 x stepCount` |
| Net yield per hour | `max(0, gross x mult - upkeep)` |
| Offline cap | 8 h base |
| Collected amount | `round1(net x min(cap, hoursSinceStart))` |

Example: tri-stats at tier I nets 7/h built from 16 basic blocks and 14/h built from 2 earned blocks.

**Tier.** A passing test stores `tier` on the pipe record, set to the `maxTier` the validation used. The pipeline earns at that tier. When reputation later opens a higher tier, the pipeline keeps earning at its stored tier. The Workshop shows "Re-test for tier N", and passing again updates `tier`.

**Firm upgrades** (`k` = levels already bought):

| Upgrade id | Effect | Cost of next level | Max |
|---|---|---|---|
| `desk` | desks = 2 + level | `300 x 2^k` | none |
| `cap` | cap hours = [8, 12, 16, 24][level] | `[250, 500, 1000][k]` | 3 |
| `analyst` | mult = 1 + 0.25 x level | `400 x 2^k` | none |

**Study aids** are new consumable entries in `ShopCore.TOOLS`. They use the existing buy (`tool`) and `use` records.

- `hint`, cost 60: on a contract, reveals that template's authored `hint` line. One use per reveal.
- `reroll`, cost 50: redraws the contract board. One use per reroll.

## Data model

New shop records. None of them have `tpl` or `camp`, so they never count as jobs.

- `collect-<tplId>-<start>` -> `{ collect: tplId, from: start, to: now, amount }`. `start` and `now` are ms timestamps. The key is deterministic in `start`.
- `upg-<id>-<ts>` -> `{ upg: 'desk'|'cap'|'analyst', cost }`.
- `shift` -> `{ shift: { <tplId>: sinceMs, ... } }`. A single record: newest wins.
- The pipe record gains `tier` (number) and `passedAt` (ms).

**`ShopCore.state()` changes.**
- `collect` records add `amount` to `cash`.
- `upg` records subtract `cost` from `cash`.
- It exposes `upgrades: { desk, cap, analyst }` level counts.
- `completed`, `rep`, `repLevel` and `maxTier` are unaffected.

**XP.** `game.js` already derives shop XP only from records with `tpl` or `camp` (`js/game.js:14`), so collect and upg records give no XP. A test pins this.

**`offers()` change.** When the count of `reroll` uses is greater than 0, it is appended to the offer seed string. With 0 rerolls the seed string is exactly as today, so existing boards are unchanged.

**Templates** each gain `hint: string`, one line naming the method's first move. Example: lc-unit gets "Convert the slope to an exponent first: b = log2(slope)."

## Idle module - `js/shop/idle.js` (`ShopIdle`)

Pure functions of profile data plus an explicit `now`. It depends on `ShopCore` and `ShopPipe`.

- `firm(d)` -> `{ desks, capHours, mult, levels: {desk, cap, analyst}, next: {desk, cap, analyst} }`. `next` is the cost of the next level, or `null` at max.
- `onShift(d)` -> `[{ id, since }]`, at most `desks` long.
  - Starts from the `shift` record's entries, keeping only running pipelines.
  - If there are free desks, it fills them with running pipelines not already listed, in `passedAt` order. Each gets `since = max(passedAt, shift record t, latest desk upgrade t)`, so a newly freed or bought desk never back-fills earnings.
  - If there are more entries than desks, it keeps the ones with the earliest `since`.
- `rate(d, id)` -> `{ gross, upkeep, net }` per hour.
- `start(d, id, since)` -> the later of `since` and the greatest `to` among that template's collect records.
- `outbox(d, id, now)` -> `{ amount, hours, full }` for a template on shift. It returns zeros if the template is not on shift.
- `collect(d, id, now)` -> `{ key, rec }`, or `null` when the amount is 0.
- `collectAll(d, now)` -> array of `{ key, rec }`.
- `setShift(d, ids, now)` -> `{ writes: [{key, rec}] }`. It collects every pipeline whose shift status changes, then writes the new `shift` record. Pipelines kept on shift keep their `since`; added ones get `since = now`. It rejects more ids than desks.

**Bank-before-change rule.**
- The UI calls `collect` on a pipeline before re-passing it while it is on shift. This way a new rate never re-prices time already accrued.
- `setShift` banks every pipeline whose status changes.

**Extension point for sub-project 3 (not built now):** a pipe record with `stalled: true` will earn 0 net.

## UI

**Firm panel** at the top of the shop board, under the header KPIs.
- One card per desk: template title, net per hour, outbox amount, a fill bar toward the cap, and a `Full` chip when full.
- Empty desks read "Empty desk: automate a contract in the Workshop".
- **Collect all** writes every non-null collect, saves, refreshes the board and HUD, and toasts "+\$<total> banked".
- A 1-second interval updates only the outbox text and bars. It is cleared when the route changes.

**Workshop panel.**
- Running items show net per hour and an On shift / Off shift toggle, which calls `setShift`.
- When every desk is full, turning another pipeline on is disabled with "All desks busy".
- A `Re-test for tier N` chip appears when `pipe.tier < maxTier`.

**Builder.** On a passing test, a pipeline already on shift is collected first. The pipe record then stores `tier` and `passedAt`.

**Tool shop.**
- A "Firm upgrades" group lists desk, offline cap and senior analysts, each with its level, next effect and cost. It is disabled when cash is short or the upgrade is at max.
- Hint and reroll appear with the other tools.

**Contract screen.** A "Hint (n left)" button reveals the template's hint line and records a use.

**Board.** A "Reroll board (n left)" button records a use and re-renders.

Placeholder art: bordered cards with CSS tokens, readable in dark mode. The layout works at phone width with no horizontal page scroll.

## Testing (Node `assert`, `npm test`)

- **`tests/idle.test.js`**
  - firm levels and next costs come from `upg` records, and the cap stops at max
  - `onShift` default order, the desk limit, and dropping non-running pipelines
  - rate math, including tri-stats at 16 vs 2 steps and the net floor at 0
  - outbox growth over injected time, and the cap
  - collect keys are deterministic, and a zero amount returns null
  - two devices collecting from the same start, merged through `Store.merge`, count the cash once in `ShopCore.state`
  - `setShift` banks changed pipelines and keeps `since` for unchanged ones
  - too many ids is rejected
- **Core**
  - `state()` adds collect amounts and subtracts upgrade costs, with `completed` and `rep` unchanged
  - `upgrades` counts
  - `offers()` is identical to before with 0 rerolls and differs after one reroll
  - the new tools are listed
- **XP:** collect and upg records do not change `game.js` XP.
- **Templates:** every template has a non-empty `hint`.
- **Manual browser checklist:** ticking outbox, collect all, a desk toggle while all desks are busy, an upgrade purchase, a hint and a reroll, phone and desktop widths, dark mode.
