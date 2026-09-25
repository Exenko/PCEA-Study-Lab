# Shop Events (Sub-project 3 of 4) - Design

## Goal

Automation only holds until conditions change. Random events stall running pipelines so the learner must go back and re-study or re-work them. Audits push overdue flashcards; market shocks push the learner to fix pipelines that quietly hard-code assumptions. Events never cost banked cash and pay a small bonus when resolved.

Roadmap context: 1 pipelines (done) -> 2 idle engine (done) -> **3 events** -> 4 boot.dev reward layer.

## Decisions

- **Hybrid events.** `audit` (module has overdue cards; clear by reviewing them) and `shock` (template input variant outside normal ranges; clear by re-passing validation).
- **Rolled at collect time, per desk.** Deterministic seed from the collect key.
- **Soft stall.** Pipeline keeps its desk, earns 0 from the event time; earnings before it stay collectable. Resolving pays a one-time bonus.
- **Derived from immutable records** (approach A). No flag on the pipe record.

## Rules

**Roll.** Inside every non-null `collect(d, id, now)`:
- `p = min(0.6, 0.04 x hoursInWindow)`; doubled (still capped at 0.6) when the pipeline's template module has >= 3 overdue cards.
- Seed: `profile|<collectKey>`. Same window on two devices gives the same result.
- No roll when: the pipeline already has an open event; any event record has `at` within the last 20 h (global cooldown); the pipeline's `passedAt` is within the last 24 h.
- `at` = the collect's `to` time.

**Kind.**
- Module has >= 1 overdue card -> `audit`, snapshot `cards` = first 10 due card ids (sorted by id).
- Else, template has `shock` -> `shock`.
- Else nothing (roll consumed).

**Stall.** While an event is open, the pipeline's accrual end is `min(now, at)`. The window before `at` stays collectable, pro-rated as today. After resolution, accrual restarts at the resolve time (`start` = max of existing rule and resolve `t`).

**Resolve audit.** Allowed when every card in `cards` has `last >= at` (scheduler state). The UI shows progress `done/total`.

**Resolve shock.** Workshop validation for a shocked template runs 5 contracts: 3 from `shock(h, tier)`, 2 normal. Passing writes the new pipe snapshot and the resolve record.

**Bonus.** `round1(2 x net)` at the pipeline's current rate, cash only.

## Data model

New shop records (no `tpl`/`camp`, so never jobs, never XP):
- `evt-<tplId>-<at>` -> `{ evt: tplId, kind: 'audit'|'shock', module, at, cards?: [ids], seed }`
- `evtdone-<tplId>-<at>` -> `{ evtdone: 'evt-<tplId>-<at>', bonus, t }`

An event is open when its `evt` record exists and no `evtdone` references it. `ShopCore.state()` adds `evtdone.bonus` to cash; `completed`, `rep`, XP unchanged.

## Shock variants

Optional `shock(h, tier)` on a template returns `{ inputs, story }`; answers come from the template's existing math on those inputs. First batch:

| Template | Shock | Catches |
|---|---|---|
| esc-compound | deflation, negative rate | hard-coded growth |
| esc-index | index rebased: new base year and base value | constant 100 base |
| lc-unit | slope 70-95% | fixed slope constant |
| lc-lot | production break: lot starts at unit >= 500 | assumes start at 1 |
| npv | rate 12-20%, longer horizon | fixed rate or length |
| evm-eac | CPI < 0.7 | clamps or constants |
| cpif-fee | fee hits min or max limit | missing min/max |
| mfg-labor | labor rate x1.5-2 | constant rate |

Normal `gen()` output stays byte-identical (snapshot test).

## Module - `js/shop/events.js` (`ShopEvents`)

Pure; depends on `ShopCore`, `ShopPipe`, `ShopIdle`; the scheduler is passed in as `sched` (`{ isDue(id), get(id) }`) so tests can stub it.

- `open(d, id)` -> open event `{ key, rec }` or `null`
- `stalledAt(d, id)` -> `at` or `null` (used by `ShopIdle.outbox`/`collect`)
- `roll(d, id, collectKey, window, now, sched)` -> `{ key, rec }` or `null`
- `auditProgress(d, evt, sched)` -> `{ done, total }`
- `resolveAudit(d, id, now, sched)` -> `{ key, rec }` or `null` if incomplete
- `resolveShock(d, id, now)` -> `{ key, rec }`
- `shockValidate(d, id, pipe)` -> validation result using the 3+2 mix

`ShopIdle.collectAll` also returns event writes so the UI saves once.

## UI

- **Firm desk card**: red chip `Stalled: Audit m05 (4/7 reviewed)` with `Review cards` (-> `#/cards?m=m05`), switching to `Resolve` when complete; or `Stalled: Market shock` with `Fix in Workshop` (-> `#/shop/pipe/<id>`).
- **Workshop**: same chip on stalled items; builder shows a shock banner with the story line and test runs use the 3+2 mix.
- **Collect all toast**: `+$X banked` then "While you were away..." list of new events.
- Phone and desktop, dark mode, existing tokens, placeholder art.

## Testing (`tests/events.test.js`, Node `assert`)

- roll deterministic from collect key; cooldown; 24 h immunity; overdue doubling; p cap
- kind selection: audit, shock, none
- stall caps accrual at `at`; pre-`at` stays collectable; restart after resolve
- audit progress with stub scheduler; resolve refused while incomplete
- resolve idempotent; bonus counted once across `Store.merge`; XP unchanged
- each shock template: reference pipeline in `tests/fixtures/pipes.js` passes shock inputs; a hard-coded pipeline (e.g. esc-index constant base 100) fails
- gen snapshot still byte-identical
- Manual: stalled chips, review-and-resolve flow, shock fix flow, toast, phone/desktop, dark mode
