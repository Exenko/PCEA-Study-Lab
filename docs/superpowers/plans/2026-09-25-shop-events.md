# Shop Events Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Random events stall running pipelines at collect time. Audits push the learner to review overdue flashcards; market shocks push them to fix pipelines that hard-code assumptions. Events never cost banked cash and pay a small bonus when resolved.

**Architecture:** Event state is derived from two immutable shop records, `evt-*` and `evtdone-*`. `ShopIdle` learns only how to read them (stall cap, restart after resolve), so it keeps no dependency on the new module. A new pure `js/shop/events.js` (`ShopEvents`) rolls, resolves and shock-validates, with the scheduler injected as `sched`. Templates gain optional `shock(h, tier)` and `solve(inputs)` without touching `gen()`. `firm.js`, `workshop.js` and `ui.js` render chips, the shock banner and the collect toast.

**Tech Stack:** Vanilla JS IIFEs (`module.exports` in Node, globals in the browser), Node `assert` tests via `tests/run.js`, plain CSS with the tokens in `css/styles.css`.

**Spec:** `docs/superpowers/specs/2026-09-25-shop-events-design.md`

**Deviations from spec (decided while planning):**
- **Stall reading lives in `ShopIdle`** (`openEvents`, `openEvent`, `stalledAt`, and `start` honours `evtdone.t`). `ShopEvents` needs `ShopIdle` for rates and collects, so the reverse dependency would be circular. `ShopEvents.open`/`stalledAt` delegate to it.
- **Collect-all with events is `ShopEvents.collectAll(d, now, sched)` returning `{ writes, events }`.** `ShopIdle.collectAll` stays as is (same cycle reason). The UI calls the events version and saves once.
- **`sched` carries two more members:** `profile` (for the `profile|<collectKey>` seed) and `cards(moduleId) -> card ids`. The UI builds it with `ShopFirm.env()` from `Scheduler` and `PCEA.module(m).cardList`.
- **`evt` records also carry `t: at`,** because `ShopCore.state()` orders records by `t`.
- **Templates get `solve(inputs) -> number[]` next to `shock`.** It repeats the answer math of `gen()` instead of refactoring `gen()`, so the snapshot cannot drift; a test pins `solve(gen().inputs)` to `gen().answers`. `shock(h, tier)` returns `{ inputs, story, answers }`.
- **lc-unit shock slope is 70-78%** (the spec says 70-95%; 80-95% is the normal range, so the shock uses only the steeper part).
- **A resolve clears every open event on that pipeline** (two devices can roll different `at`s before syncing). The bonus goes on the earliest; the others get `bonus: 0`. Resolvers return `{ key, rec, writes }`; callers apply `writes`.
- **`shockValidate(d, id, pipe, seedKey)`** takes the workshop's seed key, as `validate` does.
- **Shock template tests live in `tests/shock.test.js`,** hard-coded pipelines in `tests/fixtures/hard-pipes.js` (`pipes.js` must keep exactly one key per template).

## Global Constraints

- Roll inside every non-null collect: `p = min(0.6, 0.04 x hoursInWindow)`, doubled (still capped at 0.6) when the template module has >= 3 overdue cards.
- Seed: `ShopCore.hash(profile.toLowerCase() + '|' + collectKey)`; event fires when `ShopCore.rng(seed)() < p`.
- No roll when the pipeline already has an open event, when any `evt` record has `now - at < 20 h`, or when `now - passedAt < 24 h`.
- `at` = the collect's `to`. Kind: >= 1 overdue card -> `audit` with the first 10 due card ids sorted; else template has `shock` -> `shock`; else nothing.
- Stall: accrual end is `min(now, at)` while open. After resolve, `start = max(existing rule, evtdone.t)`.
- Audit resolves when every card in `cards` has `last >= at`. Shock resolves by passing a 5-contract validation: 3 `shock(h, tier)` + 2 normal.
- Bonus: `round1(2 x net)` at the pipeline's current rate, cash only.
- Records: `evt-<tplId>-<at>` -> `{ evt, kind, module, at, cards?, seed, t }`; `evtdone-<tplId>-<at>` -> `{ evtdone: 'evt-<tplId>-<at>', bonus, t }`. Neither carries `tpl` or `camp`: never jobs, never XP, never reputation.
- `gen()` output stays byte-identical (`tests/fixtures/gen-snapshot.json`).
- UI uses CSS tokens only (dark mode), no horizontal page scroll at phone width. New classes are prefixed `wk-` or `idle-`.
- Tests: `npm test` runs all (106 pass before this plan); `node tests/run.js <substring>` runs one file.
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. `git add` only the files named in the task (other sessions share this folder).

## Review Focus

1. **Two devices roll different events on the same pipeline before syncing:** one resolve clears both and the bonus is paid once (Task 3 test).
2. **Collect all with several desks eligible:** at most one new event per sweep, because the 20 h cooldown applies inside the sweep (Task 3 test).
3. **Resolving the same event on two devices:** one `evtdone` record after merge, bonus counted once (Task 3 test).
4. **Turning a stalled pipeline off and back on:** the off-shift collect stops at `at`, and back on shift it still earns 0 until resolved (Task 1 test).
5. **A card reviewed before the event, or never seen:** it does not count towards audit progress (Task 3 test).

## File map

- Modify `js/shop/idle.js`: `openEvents`, `openEvent`, `stalledAt`; `start` honours `evtdone`; `outbox`/`collect` stop at `at`.
- Modify `js/shop/core.js`: `state()` adds `evtdone.bonus` to cash.
- Modify `js/shop/templates.js`: `SHOCKS` block adds `shock` and `solve` to 8 templates.
- Create `js/shop/events.js`: `ShopEvents`.
- Modify `js/shop/pipeline.js`: `score(pipe, tpl, jobs)` extracted from `validate`.
- Modify `js/shop/firm.js`: stalled chips, resolve button, events-aware collect toast, `env()`.
- Modify `js/shop/workshop.js`: stalled chip, shock banner, shock sample, 3+2 test runs, shock resolve.
- Modify `js/shop/ui.js`, `index.html`, `css/styles.css`.
- Create `tests/events.test.js`, `tests/shock.test.js`, `tests/firm.test.js`, `tests/fixtures/hard-pipes.js`. Modify `tests/idle.test.js`.

---

### Task 1: Idle stall hooks and the resolve bonus in cash

**Files:**
- Modify: `js/shop/idle.js` (the `start`, `outbox`, `collect` lines and the export line)
- Modify: `js/shop/core.js` (`state()` loop)
- Test: `tests/idle.test.js`

**Interfaces:**
- Consumes: nothing new.
- Produces: `ShopIdle.openEvents(d, id) -> [{ key, rec }]` (sorted by `at`, then key), `ShopIdle.openEvent(d, id) -> { key, rec } | null`, `ShopIdle.stalledAt(d, id) -> number | null`. `ShopIdle.start(d, id, since)` also returns at least the `t` of any `evtdone` whose referenced `evt` is `id`. `outbox`/`collect` use `min(now, stalledAt)` as the end; `collect(...).rec.to` is that end, `t` stays `now`. `ShopCore.state(d).cash` includes `evtdone.bonus`.

- [ ] **Step 1: Write the failing tests** (append inside the exported array of `tests/idle.test.js`, before the closing `];`; add `const G = require('../js/game.js');` under the existing requires)

```js
  ['an open event caps accrual at its time; the window before stays collectable', () => {
    const A = 5 * H, d = D(pipe('a', 0), { ['evt-a-' + A]: { evt: 'a', kind: 'shock', module: 'm05', at: A, seed: 1, t: A } });
    assert.strictEqual(I.stalledAt(d, 'a'), A);
    assert.deepStrictEqual(I.outbox(d, 'a', 8 * H), { amount: 70, hours: 5, full: false });
    assert.strictEqual(I.outbox(d, 'a', 3 * H).amount, 42);
    const c = I.collect(d, 'a', 8 * H);
    assert.deepStrictEqual(c.rec, { collect: 'a', from: 0, to: A, amount: 70, t: 8 * H });
    d.shop[c.key] = c.rec;
    assert.strictEqual(I.collect(d, 'a', 9 * H), null);
  }],
  ['resolving restarts accrual at the resolve time and pays the bonus as cash only', () => {
    const A = 5 * H, d = D(pipe('a', 0), {
      ['evt-a-' + A]: { evt: 'a', kind: 'shock', module: 'm05', at: A, seed: 1, t: A },
      ['collect-a-0']: { collect: 'a', from: 0, to: A, amount: 70, t: A },
      ['evtdone-a-' + A]: { evtdone: 'evt-a-' + A, bonus: 28, t: 7 * H }
    });
    assert.strictEqual(I.stalledAt(d, 'a'), null);
    assert.strictEqual(I.start(d, 'a', 0), 7 * H);
    assert.strictEqual(I.outbox(d, 'a', 8 * H).amount, 14);
    const st = C.state(d);
    assert.strictEqual(st.cash, 98);
    assert.strictEqual(st.completed, 0);
    assert.strictEqual(st.rep, 0);
    assert.strictEqual(G.xpBreakdown(d).shop, 0);
  }],
  ['two open events on one pipeline: earliest is the open one', () => {
    const d = D(pipe('a', 0), { 'evt-a-9': { evt: 'a', kind: 'audit', module: 'm05', at: 9, cards: [], seed: 1, t: 9 }, 'evt-a-4': { evt: 'a', kind: 'shock', module: 'm05', at: 4, seed: 2, t: 4 } });
    assert.deepStrictEqual(I.openEvents(d, 'a').map(o => o.key), ['evt-a-4', 'evt-a-9']);
    assert.strictEqual(I.openEvent(d, 'a').key, 'evt-a-4');
    assert.strictEqual(I.openEvent(d, 'b'), null);
  }],
  ['a stalled pipeline turned off and on again still earns nothing until resolved', () => {
    const A = 5 * H, d = D(pipe('a', 0), pipe('b', 0), { ['evt-a-' + A]: { evt: 'a', kind: 'shock', module: 'm05', at: A, seed: 1, t: A } });
    const off = I.setShift(d, ['b'], 8 * H);
    assert.strictEqual(off.writes[0].rec.to, A);
    apply(d, off);
    apply(d, I.setShift(d, ['a', 'b'], 9 * H));
    assert.strictEqual(I.outbox(d, 'a', 12 * H).amount, 0);
    assert.strictEqual(I.collect(d, 'a', 12 * H), null);
  }],
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node tests/run.js idle`
Expected: FAIL on the four new tests (`I.stalledAt is not a function`, amounts 112 vs 70, cash 70 vs 98).

- [ ] **Step 3: Implement in `js/shop/idle.js`**

Replace the line `const start = (d, id, since) => ...` and the `outbox` and `collect` functions with:

```js
  const shop = d => (d && d.shop) || {};
  // An event is open while its evt record exists and no evtdone record points at it. Two devices can race, so keep them all, earliest first.
  function openEvents(d, id) {
    const s = shop(d), done = new Set(Object.values(s).filter(r => r && typeof r.evtdone === 'string').map(r => r.evtdone));
    return Object.entries(s).filter(([key, r]) => r && r.evt === id && Number.isFinite(r.at) && !done.has(key))
      .map(([key, rec]) => ({ key, rec })).sort((a, b) => a.rec.at - b.rec.at || (a.key < b.key ? -1 : 1));
  }
  const openEvent = (d, id) => openEvents(d, id)[0] || null;
  const stalledAt = (d, id) => { const o = openEvent(d, id); return o ? o.rec.at : null; };
  const end = (d, id, now) => { const at = stalledAt(d, id); return at == null ? now : Math.min(now, at); };
  const resolvedFor = (d, r) => (shop(d)[r.evtdone] || {}).evt;
  const start = (d, id, since) => recs(d).reduce((m, r) => {
    if (r.collect === id && Number.isFinite(r.to)) return Math.max(m, r.to);
    if (typeof r.evtdone === 'string' && Number.isFinite(r.t) && resolvedFor(d, r) === id) return Math.max(m, r.t);
    return m;
  }, since);
  function outbox(d, id, now) {
    const o = onShift(d).find(x => x.id === id);
    if (!o) return { amount: 0, hours: 0, full: false };
    const f = firm(d), hours = Math.max(0, (end(d, id, now) - start(d, id, o.since)) / HOUR);
    return { amount: r1(rate(d, id).net * Math.min(f.capHours, hours)), hours, full: hours >= f.capHours };
  }
  function collect(d, id, now) {
    const o = onShift(d).find(x => x.id === id);
    if (!o) return null;
    const b = outbox(d, id, now);
    if (!(b.amount > 0)) return null;
    const s = start(d, id, o.since);
    return { key: 'collect-' + id + '-' + s, rec: { collect: id, from: s, to: end(d, id, now), amount: b.amount, t: now } };
  }
```

Replace the export line with:

```js
  const ShopIdle = { HOUR, CAPS, UPGRADES, firm, running, onShift, rate, start, outbox, collect, collectAll, setShift, repass, buyUpgrade, openEvents, openEvent, stalledAt };
```

- [ ] **Step 4: Implement in `js/shop/core.js`**

In `state()`, directly after the line `if (r.collect) cash += credit.get(r) || 0;` add:

```js
      if (r.evtdone) cash += r.bonus || 0;
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `node tests/run.js idle` then `npm test`
Expected: all idle tests PASS; full suite `110 passed, 0 failed`.

- [ ] **Step 6: Commit**

```bash
git add js/shop/idle.js js/shop/core.js tests/idle.test.js
git commit -m "feat: idle engine stalls at open events and restarts after resolve

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Shock variants on eight templates

**Files:**
- Modify: `js/shop/templates.js` (new block just before the final `if (typeof module ...` line)
- Create: `tests/fixtures/hard-pipes.js`
- Test: `tests/shock.test.js`

**Interfaces:**
- Consumes: `ShopCore.helpers/rng/hash`, `ShopPipe.run`, `tests/fixtures/pipes.js`.
- Produces: on templates `esc-compound, esc-index, lc-unit, lc-lot, npv, evm-eac, cpif-fee, mfg-labor`: `t.shock(h, tier) -> { inputs, story: string, answers: [{ label, unit, value }] }` (inputs keys equal `t.ins` keys) and `t.solve(inputs) -> number[]` (same order as `gen().answers`). Other templates have neither.

- [ ] **Step 1: Create `tests/fixtures/hard-pipes.js`**

```js
// Pipelines that pass some normal contracts but hard-code the assumption each market shock breaks.
const S = (node, args) => ({ node, args });
const c = v => ({ c: v });
module.exports = {
  'esc-compound': { steps: [S('add', { a: c(1), b: c(0.03) }), S('pow', { base: 's0', exp: 'in.years' }), S('mul', { a: 'in.cost', b: 's1' })], outs: ['s2'] },
  'esc-index': { steps: [S('div', { a: c(1), b: 'in.idxYear' }), S('mul', { a: 'in.cost', b: 's0' })], outs: ['s1'] },
  'lc-unit': { steps: [S('log2', { x: c(0.85) }), S('pow', { base: 'in.unit', exp: 's0' }), S('mul', { a: 'in.t1', b: 's1' })], outs: ['s2'] },
  'lc-lot': { steps: [S('range', { from: c(1), to: 'in.qty' }), S('log2', { x: 'in.slope' }), S('pow', { base: 's0', exp: 's1' }), S('mul', { a: 'in.t1', b: 's2' }),
    S('sum', { list: 's3' }), S('div', { a: 's4', b: 'in.qty' })], outs: ['s4', 's5'] },
  'npv': { steps: [S('npv', { invest: 'in.invest', flows: 'in.flows', rate: c(0.07) })], outs: ['s0'] },
  'evm-eac': { steps: [S('div', { a: 'in.ev', b: 'in.ac' }), S('max', { a: 's0', b: c(0.7) }), S('div', { a: 'in.ev', b: 'in.pv' }), S('div', { a: 'in.bac', b: 's1' }),
    S('sub', { a: 'in.bac', b: 'in.ev' }), S('mul', { a: 's1', b: 's2' }), S('div', { a: 's4', b: 's5' }), S('add', { a: 'in.ac', b: 's6' }),
    S('if', { flag: 'in.composite', then: 's7', else: 's3' })], outs: ['s1', 's8'] },
  'cpif-fee': { steps: [S('sub', { a: 'in.targetCost', b: 'in.actual' }), S('mul', { a: 'in.conShare', b: 's0' }), S('add', { a: 'in.targetFee', b: 's1' }),
    S('add', { a: 'in.actual', b: 's2' })], outs: ['s2', 's3'] },
  'mfg-labor': { steps: [S('mul', { a: 'in.stdHours', b: 'in.qty' }), S('mul', { a: 's0', b: 'in.realization' }), S('mul', { a: 's1', b: c(120) }), S('div', { a: 's2', b: c(1000) })], outs: ['s1', 's3'] }
};
```

- [ ] **Step 2: Write the failing tests** (`tests/shock.test.js`)

```js
const assert = require('assert');
const T = require('../js/shop/templates.js');
const C = require('../js/shop/core.js');
const P = require('../js/shop/pipeline.js');
const REF = require('./fixtures/pipes.js');
const HARD = require('./fixtures/hard-pipes.js');
const SHOCKED = ['cpif-fee', 'esc-compound', 'esc-index', 'evm-eac', 'lc-lot', 'lc-unit', 'mfg-labor', 'npv'];
const tpl = id => T.find(t => t.id === id);
const each = fn => { for (const id of SHOCKED) for (let tier = 1; tier <= 3; tier++) for (let seed = 1; seed <= 20; seed++) fn(id, tier, tpl(id).shock(C.helpers(C.rng(C.hash('shock|' + id + '|' + tier + '|' + seed))), tier)); };
const exact = (pipe, job) => { const r = P.run(pipe, job.inputs); return job.answers.every((a, k) => r.outs[k] != null && C.answerScore(r.outs[k], a.value) === 1); };

module.exports = [
  ['exactly the eight planned templates have shock variants', () => {
    assert.deepStrictEqual(T.filter(t => typeof t.shock === 'function').map(t => t.id).sort(), SHOCKED);
    assert.deepStrictEqual(T.filter(t => typeof t.solve === 'function').map(t => t.id).sort(), SHOCKED);
  }],
  ['solve reproduces the answers gen computes', () => {
    for (const id of SHOCKED) for (let tier = 1; tier <= 3; tier++) for (let seed = 1; seed <= 30; seed++) {
      const j = tpl(id).gen(C.helpers(C.rng(seed * 7919 + tier)), tier), v = tpl(id).solve(j.inputs);
      assert.strictEqual(v.length, j.answers.length, id);
      j.answers.forEach((a, k) => assert.ok(Math.abs(v[k] - a.value) <= 1e-9 * Math.max(1, Math.abs(a.value)), `${id} ${k}: ${v[k]} vs ${a.value}`));
    }
  }],
  ['shock jobs have the template inputs, a story and finite answers', () => each((id, tier, job) => {
    assert.deepStrictEqual(Object.keys(job.inputs).sort(), Object.keys(tpl(id).ins).sort(), id);
    assert.ok(typeof job.story === 'string' && job.story.length >= 10, id);
    assert.ok(job.answers.length >= 1 && job.answers.every(a => Number.isFinite(a.value) && a.label && typeof a.unit === 'string'), id);
  })],
  ['reference pipelines answer every shock contract exactly', () => each((id, tier, job) => {
    assert.ok(exact(REF[id].prim, job), id + ' prim tier ' + tier);
    assert.ok(exact(REF[id].domain, job), id + ' domain tier ' + tier);
  })],
  ['hard-coded pipelines fail shock contracts', () => each((id, tier, job) => assert.ok(!exact(HARD[id], job), id + ' tier ' + tier))],
  ['shock inputs sit outside the normal ranges', () => each((id, tier, job) => {
    const i = job.inputs;
    const out = {
      'esc-compound': () => i.rate < 0,
      'esc-index': () => i.idxBase >= 95,
      'lc-unit': () => i.slope >= 0.7 && i.slope < 0.8,
      'lc-lot': () => i.first >= 500,
      'npv': () => i.rate >= 0.12 && i.flows.length >= 7,
      'evm-eac': () => i.ev / i.ac < 0.7,
      'cpif-fee': () => { const raw = i.targetFee + i.conShare * (i.targetCost - i.actual); return raw < i.minFee || raw > i.maxFee; },
      'mfg-labor': () => i.rate >= 135
    }[id];
    assert.ok(out(), id + ' ' + JSON.stringify(i));
  })]
];
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `node tests/run.js shock`
Expected: FAIL, `tpl(...).shock is not a function` / length mismatch in the first test.

- [ ] **Step 4: Implement in `js/shop/templates.js`**

Insert just before `if (typeof module !== 'undefined' && module.exports) module.exports = T; else root.ShopTemplates = T;`:

```js
  // ---- Market shocks: inputs outside the normal ranges, answered by the same math as gen(). gen() itself is untouched. ----
  const SHOCKS = {
    'esc-compound': {
      labels: () => [['Then-year cost', '$M']],
      solve: i => [i.cost * Math.pow(1 + i.rate, i.years)],
      make(h, tier) {
        const C = r1(h.num(2, 20, 0.5) * K[tier]), n = h.num(2, 8, 1), rt = h.pick([-0.01, -0.015, -0.02, -0.03]);
        return { inputs: { cost: C, rate: rt, years: n }, story: `Deflation: prices are falling ${pct(-rt)} a year.` };
      }
    },
    'esc-index': {
      labels: () => [['Cost in base-year dollars', '$M']],
      solve: i => [i.cost * i.idxBase / i.idxYear],
      make(h, tier) {
        const T$ = r1(h.num(5, 50, 0.5) * K[tier]), ib = r1(h.num(95, 110, 0.5)), it = r1(ib * (1 + h.num(0.05, 0.35, 0.01)));
        return { inputs: { cost: T$, idxBase: ib, idxYear: it }, story: `The cost index was rebased: the base year now reads ${ib}, not about 1.0.` };
      }
    },
    'lc-unit': {
      labels: i => [[`Hours for unit ${i.unit}`, 'hours']],
      solve: i => [i.t1 * Math.pow(i.unit, lcB(i.slope))],
      make(h, tier) {
        const T1 = h.num(800, 3000, 50) * K[tier], s = h.num(0.70, 0.78, 0.01), N = h.num(10, 200, 1);
        return { inputs: { t1: T1, slope: s, unit: N }, story: `A new process steepened the learning curve to ${pct(s, 0)}.` };
      }
    },
    'lc-lot': {
      labels: () => [['Lot cost', '$K'], ['Average unit cost', '$K']],
      solve: i => { const b = lcB(i.slope); let sum = 0; for (let x = i.first; x <= i.first + i.qty - 1; x++) sum += i.t1 * Math.pow(x, b); return [sum, sum / i.qty]; },
      make(h, tier) {
        const T1 = h.num(200, 900, 10) * K[tier], s = h.pick([0.80, 0.85, 0.88, 0.90, 0.92]), F = h.num(500, 900, 10), Q = h.num(10, 40, 1);
        return { inputs: { t1: T1, slope: s, first: F, qty: Q }, story: `Production break: this lot starts at unit ${F}.` };
      }
    },
    'npv': {
      labels: () => [['NPV', '$K']],
      solve: i => [-i.invest + i.flows.reduce((s, a, t) => s + a / Math.pow(1 + i.rate, t + 1), 0)],
      make(h, tier) {
        const I = h.num(100, 500, 10) * K[tier], r = h.pick([0.12, 0.15, 0.18, 0.2]), n = h.num(7, 10, 1), A = [];
        for (let k = 0; k < n; k++) A.push(h.num(20, 150, 5) * K[tier]);
        return { inputs: { invest: I, flows: A, rate: r }, story: `Rates are up: discount at ${pct(r, 0)} over ${n} years of savings.` };
      }
    },
    'evm-eac': {
      labels: () => [['CPI', ''], ['EAC', '$M']],
      solve: i => { const cpi = i.ev / i.ac, spi = i.ev / i.pv; return [cpi, i.composite ? i.ac + (i.bac - i.ev) / (cpi * spi) : i.bac / cpi]; },
      make(h, tier) {
        const BAC = h.num(20, 200, 1) * K[tier], EV = r2(BAC * h.num(0.2, 0.7, 0.01)), PV = r2(EV * h.num(0.85, 1.15, 0.01)), AC = r2(EV / h.num(0.5, 0.68, 0.01));
        return { inputs: { bac: BAC, pv: PV, ev: EV, ac: AC, composite: tier >= 2 ? 1 : 0 }, story: `The program is in trouble: CPI has fallen to ${f(EV / AC, 2)}.` };
      }
    },
    'cpif-fee': {
      labels: () => [['Fee', '$M'], ['Total price', '$M']],
      solve: i => { const raw = i.targetFee + i.conShare * (i.targetCost - i.actual), fee = Math.min(i.maxFee, Math.max(i.minFee, raw)); return [fee, i.actual + fee]; },
      make(h, tier) {
        const TC = h.num(50, 200, 1) * K[tier], TF = r2(TC * h.pick([0.06, 0.07, 0.08])), [g, c] = h.pick(SHARES);
        const mn = r2(TC * h.pick([0.02, 0.03])), mx = r2(TC * h.pick([0.1, 0.12])), over = h.pick([true, false]);
        const AC = r2(TC * (over ? 1 + h.num(0.5, 0.8, 0.01) : 1 - h.num(0.45, 0.6, 0.01)));
        return { inputs: { targetCost: TC, targetFee: TF, govShare: g / 100, conShare: c / 100, minFee: mn, maxFee: mx, actual: AC },
          story: over ? 'A big overrun drives the fee down to its minimum.' : 'A big underrun drives the fee up to its maximum.' };
      }
    },
    'mfg-labor': {
      labels: () => [['Expected hours', 'hours'], ['Labor cost', '$K']],
      solve: i => { const hrs = i.stdHours * i.qty * i.realization; return [hrs, hrs * i.rate / 1000]; },
      make(h, tier) {
        const S = h.num(20, 120, 1), Q = h.num(10, 80, 1) * K[tier], R = h.num(1.1, 1.8, 0.05), W = Math.round(h.num(90, 180, 1) * h.num(1.5, 2, 0.05));
        return { inputs: { stdHours: S, qty: Q, realization: R, rate: W }, story: `Labor squeeze: the wrap rate jumped to $${W}/hour.` };
      }
    }
  };
  Object.entries(SHOCKS).forEach(([id, s]) => {
    const t = T.find(x => x.id === id);
    t.solve = s.solve;
    t.shock = (h, tier) => {
      const m = s.make(h, tier), v = s.solve(m.inputs);
      return { inputs: m.inputs, story: m.story, answers: s.labels(m.inputs).map(([label, unit], k) => ({ label, unit, value: v[k] })) };
    };
  });
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `node tests/run.js shock` then `node tests/run.js templates`
Expected: 6 shock tests PASS; templates tests (including `gen output matches the pre-pipeline snapshot`) PASS.

- [ ] **Step 6: Commit**

```bash
git add js/shop/templates.js tests/shock.test.js tests/fixtures/hard-pipes.js
git commit -m "feat: market shock variants on eight contract templates

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Events core (roll, collect, audit progress, resolve)

**Files:**
- Create: `js/shop/events.js`
- Modify: `index.html:42` (script tag after `js/shop/idle.js`)
- Test: `tests/events.test.js`

**Interfaces:**
- Consumes: `ShopIdle.openEvents/openEvent/stalledAt/collect/onShift/rate/HOUR` (Task 1), `t.shock` (Task 2), `ShopCore.hash/rng`.
- Produces (`ShopEvents`, `sched = { profile, isDue(id), get(id) -> { last } | null, cards(moduleId) -> ids }`):
  - `chance(hours, nOverdue) -> number`
  - `open(d, id) -> { key, rec } | null`, `stalledAt(d, id) -> number | null`
  - `roll(d, id, collectKey, window: { from, to }, now, sched) -> { key, rec } | null`
  - `collect(d, id, now, sched) -> writes[]` (0, 1 or 2 entries: collect, then event)
  - `collectAll(d, now, sched) -> { writes, events }` (`events` is the subset of `writes` that are `evt` records)
  - `auditProgress(d, evt, sched) -> { done, total }`
  - `bonus(d, id) -> number`
  - `resolveAudit(d, id, now, sched)` / `resolveShock(d, id, now)` -> `{ key, rec, writes } | null`

- [ ] **Step 1: Write the failing tests** (`tests/events.test.js`)

```js
const assert = require('assert');
const E = require('../js/shop/events.js');
const I = require('../js/shop/idle.js');
const C = require('../js/shop/core.js');
const G = require('../js/game.js');
const Store = require('./fixtures/load-store.js')();
const H = I.HOUR;
const pipe = (id, at, extra) => ({ ['pipe-' + id]: Object.assign({ pipe: id, steps: [], outs: [], stepCount: 2, primitivesOnly: false, passed: true, tier: 1, passedAt: at, t: at }, extra) });
const D = (...parts) => ({ shop: Object.assign({}, ...parts) });
const apply = (d, ws) => ws.forEach(w => { d.shop[w.key] = w.rec; });
const M05 = ['c4', 'c2', 'c1', 'c3'];
const sched = (due = [], last = {}, cards = M05) => ({ profile: 'Ann', isDue: id => due.includes(id), get: id => (id in last ? { last: last[id] } : null), cards: m => (m === 'm05' ? cards : []) });
const draw = key => C.rng(C.hash('ann|' + key))();
// A pipeline passed at 0 whose last collect ended at s: the next collect key is collect-<id>-<s>.
const setup = (ids, s) => D(...ids.map(id => pipe(id, 0)), ...ids.map(id => ({ ['collect-' + id + '-0']: { collect: id, from: 0, to: s, amount: 0, t: s } })));
const findStart = pred => { for (let k = 30; k < 5000; k++) if (pred(k * H)) return k * H; throw new Error('no start found'); };
const inRange = (id, lo, hi) => s => { const r = draw('collect-' + id + '-' + s); return r >= lo && r < hi; };
const evt = (id, at, extra) => ({ ['evt-' + id + '-' + at]: Object.assign({ evt: id, kind: 'shock', module: 'm05', at, seed: 1, t: at }, extra) });

module.exports = [
  ['chance is 0.04 per hour, doubled at 3 overdue cards, capped at 0.6', () => {
    assert.ok(Math.abs(E.chance(5, 0) - 0.2) < 1e-12);
    assert.ok(Math.abs(E.chance(5, 2) - 0.2) < 1e-12);
    assert.ok(Math.abs(E.chance(5, 3) - 0.4) < 1e-12);
    assert.strictEqual(E.chance(20, 0), 0.6);
    assert.strictEqual(E.chance(10, 3), 0.6);
    assert.strictEqual(E.chance(0, 5), 0);
  }],
  ['roll is deterministic from profile and collect key', () => {
    const s = findStart(inRange('esc-compound', 0, 0.6)), now = s + 20 * H;
    const ws = E.collect(setup(['esc-compound'], s), 'esc-compound', now, sched());
    assert.strictEqual(ws.length, 2);
    assert.strictEqual(ws[0].key, 'collect-esc-compound-' + s);
    assert.deepStrictEqual(ws[1], { key: 'evt-esc-compound-' + now, rec: { evt: 'esc-compound', kind: 'shock', module: 'm05', at: now, seed: C.hash('ann|collect-esc-compound-' + s), t: now } });
    assert.deepStrictEqual(E.collect(setup(['esc-compound'], s), 'esc-compound', now, sched()), ws);
    const miss = findStart(inRange('esc-compound', 0.6, 1));
    assert.strictEqual(E.collect(setup(['esc-compound'], miss), 'esc-compound', miss + 20 * H, sched()).length, 1);
  }],
  ['three overdue cards double the chance; audit snapshots due cards sorted', () => {
    const s = findStart(inRange('esc-compound', 0.2, 0.4)), now = s + 5 * H;
    assert.strictEqual(E.collect(setup(['esc-compound'], s), 'esc-compound', now, sched(['c3', 'c1'])).length, 1);
    const ws = E.collect(setup(['esc-compound'], s), 'esc-compound', now, sched(['c3', 'c1', 'c2']));
    assert.strictEqual(ws[1].rec.kind, 'audit');
    assert.deepStrictEqual(ws[1].rec.cards, ['c1', 'c2', 'c3']);
  }],
  ['audit snapshot keeps at most ten cards', () => {
    const ids = Array.from({ length: 12 }, (_, i) => 'k' + String(12 - i).padStart(2, '0'));
    const s = findStart(inRange('esc-compound', 0, 0.6));
    const ws = E.collect(setup(['esc-compound'], s), 'esc-compound', s + 20 * H, sched(ids, {}, ids));
    assert.deepStrictEqual(ws[1].rec.cards, ids.slice().sort().slice(0, 10));
  }],
  ['a template with no shock and no overdue cards consumes the roll', () => {
    const s = findStart(inRange('cer-power', 0, 0.6));
    const ws = E.collect(setup(['cer-power'], s), 'cer-power', s + 20 * H, sched());
    assert.deepStrictEqual(ws.map(w => w.key), ['collect-cer-power-' + s]);
  }],
  ['no roll with an open event, inside the 20 h cooldown, or within 24 h of passing', () => {
    const id = 'esc-compound', s = findStart(inRange(id, 0, 0.6)), now = s + 20 * H, key = 'collect-' + id + '-' + s, win = { from: s, to: now };
    assert.ok(E.roll(setup([id], s), id, key, win, now, sched()));
    assert.strictEqual(E.roll(D(setup([id], s).shop, evt(id, 1)), id, key, win, now, sched()), null);
    assert.strictEqual(E.roll(D(setup([id], s).shop, evt('lc-unit', now - 19 * H)), id, key, win, now, sched()), null);
    assert.ok(E.roll(D(setup([id], s).shop, evt('lc-unit', now - 21 * H)), id, key, win, now, sched()));
    assert.strictEqual(E.roll(D(setup([id], s).shop, pipe(id, now - 23 * H)), id, key, win, now, sched()), null);
  }],
  ['collect all rolls at most one new event per sweep', () => {
    const s = findStart(k => draw('collect-esc-compound-' + k) < 0.6 && draw('collect-lc-unit-' + k) < 0.6);
    const res = E.collectAll(setup(['esc-compound', 'lc-unit'], s), s + 20 * H, sched());
    assert.strictEqual(res.writes.filter(w => w.rec.collect).length, 2);
    assert.strictEqual(res.events.length, 1);
    assert.ok(res.writes.includes(res.events[0]));
  }],
  ['audit progress counts only cards reviewed at or after the event', () => {
    const A = 40 * H, d = D(pipe('esc-compound', 0), evt('esc-compound', A, { kind: 'audit', cards: ['c1', 'c2', 'c3'] }));
    const rec = d.shop['evt-esc-compound-' + A];
    assert.deepStrictEqual(E.auditProgress(d, rec, sched([], { c1: A, c2: A - 1 })), { done: 1, total: 3 });
    assert.strictEqual(E.resolveAudit(d, 'esc-compound', A + H, sched([], { c1: A, c2: A - 1 })), null);
    const r = E.resolveAudit(d, 'esc-compound', A + H, sched([], { c1: A, c2: A + 5, c3: A + 9 }));
    assert.deepStrictEqual({ key: r.key, rec: r.rec }, { key: 'evtdone-esc-compound-' + A, rec: { evtdone: 'evt-esc-compound-' + A, bonus: 28, t: A + H } });
    assert.strictEqual(E.resolveShock(d, 'esc-compound', A + H), null);
    apply(d, r.writes);
    assert.strictEqual(E.open(d, 'esc-compound'), null);
    assert.strictEqual(E.resolveAudit(d, 'esc-compound', A + 2 * H, sched([], { c1: A, c2: A, c3: A })), null);
    assert.strictEqual(I.outbox(d, 'esc-compound', A + 2 * H).amount, 14);
    assert.strictEqual(C.state(d).cash, 28);
    assert.strictEqual(G.xpBreakdown(d).shop, 0);
  }],
  ['one resolve clears racing events on the same pipeline, bonus once', () => {
    const d = D(pipe('esc-compound', 0), evt('esc-compound', 30 * H), evt('esc-compound', 32 * H));
    assert.strictEqual(E.resolveAudit(d, 'esc-compound', 40 * H, sched()), null);
    const r = E.resolveShock(d, 'esc-compound', 40 * H);
    assert.strictEqual(r.key, 'evtdone-esc-compound-' + 30 * H);
    assert.deepStrictEqual(r.writes.map(w => [w.key, w.rec.bonus]), [['evtdone-esc-compound-' + 30 * H, 28], ['evtdone-esc-compound-' + 32 * H, 0]]);
    apply(d, r.writes);
    assert.strictEqual(E.stalledAt(d, 'esc-compound'), null);
    assert.strictEqual(C.state(d).cash, 28);
  }],
  ['resolving on two devices counts the bonus once after merge', () => {
    const base = D(pipe('esc-compound', 0), evt('esc-compound', 30 * H));
    const d1 = JSON.parse(JSON.stringify(base)), d2 = JSON.parse(JSON.stringify(base));
    E.resolveShock(d1, 'esc-compound', 40 * H).writes.forEach(w => { d1.shop[w.key] = Object.assign(w.rec, { mod: 1 }); });
    E.resolveShock(d2, 'esc-compound', 41 * H).writes.forEach(w => { d2.shop[w.key] = Object.assign(w.rec, { mod: 2 }); });
    const m = Store.merge(d1, d2);
    assert.strictEqual(C.state(m).cash, 28);
    assert.strictEqual(I.start(m, 'esc-compound', 0), 41 * H);
  }],
  ['a stalled pipeline collects nothing more and does not roll again', () => {
    const d = D(pipe('esc-compound', 0), { 'collect-esc-compound-0': { collect: 'esc-compound', from: 0, to: 30 * H, amount: 0, t: 30 * H } }, evt('esc-compound', 30 * H));
    assert.deepStrictEqual(E.collect(d, 'esc-compound', 60 * H, sched()), []);
    assert.deepStrictEqual(E.collectAll(d, 60 * H, sched()), { writes: [], events: [] });
  }]
];
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node tests/run.js events`
Expected: FAIL with `Cannot find module '../js/shop/events.js'`.

- [ ] **Step 3: Create `js/shop/events.js`**

```js
// Shop events: audits and market shocks that stall running pipelines until the learner re-studies or re-fixes them. Pure; sched is injected.
(function (root) {
  const node = typeof module !== 'undefined' && module.exports;
  const C = node ? require('./core.js') : root.ShopCore;
  const I = node ? require('./idle.js') : root.ShopIdle;
  const P = node ? require('./pipeline.js') : root.ShopPipe;
  const T = node ? require('./templates.js') : root.ShopTemplates;
  const HOUR = I.HOUR, COOLDOWN = 20 * HOUR, IMMUNE = 24 * HOUR, P_MAX = 0.6, P_HOUR = 0.04, MAX_CARDS = 10, SHOCK_N = 3;
  const r1 = v => Math.round(v * 10) / 10;
  const shop = d => (d && d.shop) || {};
  const tplOf = id => T.find(t => t.id === id) || null;
  const overdue = (sched, module) => ((sched.cards && sched.cards(module)) || []).filter(c => sched.isDue(c)).sort();
  const withWrites = (d, ws) => ({ shop: Object.assign({}, shop(d), ...ws.map(w => ({ [w.key]: w.rec }))) });

  const open = (d, id) => I.openEvent(d, id);
  const stalledAt = (d, id) => I.stalledAt(d, id);
  const chance = (hours, nOverdue) => Math.min(P_MAX, P_HOUR * hours * (nOverdue >= 3 ? 2 : 1));

  function roll(d, id, collectKey, window, now, sched) {
    const tpl = tplOf(id), pipe = shop(d)['pipe-' + id];
    if (!tpl || !pipe || !pipe.passed || open(d, id)) return null;
    if (Object.values(shop(d)).some(r => r && typeof r.evt === 'string' && Number.isFinite(r.at) && now - r.at < COOLDOWN)) return null;
    if (now - (pipe.passedAt || pipe.t || 0) < IMMUNE) return null;
    const due = overdue(sched, tpl.module), hours = Math.max(0, (window.to - window.from) / HOUR);
    const seed = C.hash(String(sched.profile || '').toLowerCase() + '|' + collectKey);
    if (C.rng(seed)() >= chance(hours, due.length)) return null;
    const at = window.to, key = 'evt-' + id + '-' + at;
    if (due.length) return { key, rec: { evt: id, kind: 'audit', module: tpl.module, at, cards: due.slice(0, MAX_CARDS), seed, t: at } };
    if (typeof tpl.shock === 'function') return { key, rec: { evt: id, kind: 'shock', module: tpl.module, at, seed, t: at } };
    return null;
  }
  function collect(d, id, now, sched) {
    const c = I.collect(d, id, now);
    if (!c) return [];
    const e = roll(d, id, c.key, { from: c.rec.from, to: c.rec.to }, now, sched);
    return e ? [c, e] : [c];
  }
  // Each desk sees the writes of the desks before it, so the global cooldown holds inside one sweep.
  function collectAll(d, now, sched) {
    let cur = d;
    const writes = [];
    I.onShift(d).forEach(o => { const ws = collect(cur, o.id, now, sched); writes.push(...ws); cur = withWrites(cur, ws); });
    return { writes, events: writes.filter(w => typeof w.rec.evt === 'string') };
  }

  function auditProgress(d, evt, sched) {
    const cards = (evt && evt.cards) || [];
    const done = cards.filter(id => { const s = sched.get(id); return !!(s && Number.isFinite(s.last) && s.last >= evt.at); }).length;
    return { done, total: cards.length };
  }
  const bonus = (d, id) => r1(2 * I.rate(d, id).net);
  // Clears every open event on the pipeline; only the earliest pays the bonus.
  function resolveAll(d, id, now) {
    const all = I.openEvents(d, id), b = bonus(d, id);
    const writes = all.map((o, k) => ({ key: 'evtdone-' + id + '-' + o.rec.at, rec: { evtdone: o.key, bonus: k === 0 ? b : 0, t: now } }));
    return { key: writes[0].key, rec: writes[0].rec, writes };
  }
  function resolveAudit(d, id, now, sched) {
    const o = open(d, id);
    if (!o || o.rec.kind !== 'audit') return null;
    const p = auditProgress(d, o.rec, sched);
    return p.done < p.total ? null : resolveAll(d, id, now);
  }
  function resolveShock(d, id, now) {
    const o = open(d, id);
    return o && o.rec.kind === 'shock' ? resolveAll(d, id, now) : null;
  }

  const ShopEvents = { COOLDOWN, IMMUNE, SHOCK_N, chance, open, stalledAt, roll, collect, collectAll, auditProgress, bonus, resolveAudit, resolveShock };
  if (node) module.exports = ShopEvents; else root.ShopEvents = ShopEvents;
})(this);
```

Note: `P` and `SHOCK_N` are used by Task 4; leave them.

- [ ] **Step 4: Load it in the browser** (`index.html`, directly after `<script src="js/shop/idle.js"></script>`)

```html
<script src="js/shop/events.js"></script>
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `node tests/run.js events` then `npm test`
Expected: 11 events tests PASS; full suite 0 failed.

- [ ] **Step 6: Commit**

```bash
git add js/shop/events.js index.html tests/events.test.js
git commit -m "feat: shop events roll at collect time and resolve with a bonus

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Shock validation (3 shocked + 2 normal contracts)

**Files:**
- Modify: `js/shop/pipeline.js` (`validate` and the export line)
- Modify: `js/shop/events.js` (add `shockValidate`, `story`; export line)
- Test: `tests/shock.test.js`

**Interfaces:**
- Consumes: `t.shock` (Task 2), `ShopEvents` (Task 3).
- Produces: `ShopPipe.score(pipe, tpl, jobs: [{ tier, job, shock? }]) -> { rows, problems, passed }` (rows get `shock: true` only on shocked jobs; `validate` output is unchanged). `ShopEvents.shockValidate(d, id, pipe, seedKey) -> { rows, problems, passed }` (falls back to `ShopPipe.validate` for templates without `shock`). `ShopEvents.story(id, seed) -> string`.

- [ ] **Step 1: Write the failing tests** (append to the array in `tests/shock.test.js`; add `const E = require('../js/shop/events.js');` under the requires)

```js
  ['shockValidate mixes three shocked and two normal contracts', () => {
    const v = E.shockValidate({ shop: {} }, 'esc-index', REF['esc-index'].prim, 'ann|esc-index|1');
    assert.strictEqual(v.rows.length, P.VALIDATE_N);
    assert.deepStrictEqual(v.rows.map(r => !!r.shock), [true, true, true, false, false]);
    assert.strictEqual(v.passed, true);
  }],
  ['every reference pipeline passes shock validation; hard-coded ones fail', () => {
    for (const id of SHOCKED) for (let k = 1; k <= 5; k++) {
      assert.strictEqual(E.shockValidate({ shop: {} }, id, REF[id].prim, 'ref|' + id + '|' + k).passed, true, id);
      assert.strictEqual(E.shockValidate({ shop: {} }, id, HARD[id], 'hard|' + id + '|' + k).passed, false, id);
    }
  }],
  ['plain validate rows carry no shock flag and a shockless template falls back to it', () => {
    const v = P.validate(REF['esc-compound'].prim, tpl('esc-compound'), 'x', 3);
    assert.ok(v.rows.every(r => !('shock' in r)));
    assert.deepStrictEqual(E.shockValidate({ shop: {} }, 'cer-power', REF['cer-power'].prim, 'x'), P.validate(REF['cer-power'].prim, tpl('cer-power'), 'x', 1));
  }],
  ['story is the seeded shock story', () => {
    assert.strictEqual(E.story('lc-lot', 42), tpl('lc-lot').shock(C.helpers(C.rng(42)), 1).story);
    assert.strictEqual(E.story('cer-power', 42), '');
  }],
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node tests/run.js shock`
Expected: FAIL with `E.shockValidate is not a function`.

- [ ] **Step 3: Refactor `validate` in `js/shop/pipeline.js`**

Replace the whole `validate` function (and its comment) with:

```js
  // Scores a pipeline on prepared jobs. Pass means every answer within 1%.
  function score(pipe, tpl, jobs) {
    const rows = [];
    let problems = null;
    jobs.forEach(({ tier, job, shock }) => {
      if (!problems) problems = check(pipe, tpl.ins, job.answers.length, null);
      const res = run(pipe, job.inputs);
      const each = job.answers.map((a, i) => res.outs[i] == null ? -0.3 : C.answerScore(res.outs[i], a.value));
      const off = job.answers.map((a, i) => res.outs[i] == null ? null : Math.abs(res.outs[i] - a.value) / Math.abs(a.value) * 100);
      const row = { tier, labels: job.answers.map(a => a.label), each, off };
      if (shock) row.shock = true;
      rows.push(row);
    });
    return { rows, problems, passed: problems.length === 0 && rows.every(r => r.each.every(x => x === 1)) };
  }
  // Runs the pipeline on VALIDATE_N fresh contracts spread across tiers 1..maxTier.
  function validate(pipe, tpl, seedKey, maxTier) {
    const jobs = [];
    for (let k = 0; k < VALIDATE_N; k++) {
      const tier = 1 + (k % Math.max(1, maxTier));
      jobs.push({ tier, job: tpl.gen(C.helpers(C.rng(C.hash(seedKey + '|' + k))), tier) });
    }
    return score(pipe, tpl, jobs);
  }
```

Replace the export line with:

```js
  const ShopPipe = { run, check, removeStep, moveStep, primitivesOnly, pctWarning, score, validate, VALIDATE_N, GATE, handSolves, earned, allowed, record, draft, status, unlocksFor };
```

- [ ] **Step 4: Add to `js/shop/events.js`** (above the `const ShopEvents = ...` line)

```js
  // Workshop fix for a shocked pipeline: the first SHOCK_N contracts come from shock(), the rest are normal.
  function shockValidate(d, id, pipe, seedKey) {
    const tpl = tplOf(id), maxTier = C.state(d).maxTier;
    if (!tpl || typeof tpl.shock !== 'function') return P.validate(pipe, tpl, seedKey, maxTier);
    const jobs = [];
    for (let k = 0; k < P.VALIDATE_N; k++) {
      const tier = 1 + (k % Math.max(1, maxTier)), h = C.helpers(C.rng(C.hash(seedKey + '|' + k)));
      jobs.push(k < SHOCK_N ? { tier, job: tpl.shock(h, tier), shock: true } : { tier, job: tpl.gen(h, tier) });
    }
    return P.score(pipe, tpl, jobs);
  }
  const story = (id, seed) => { const t = tplOf(id); return t && typeof t.shock === 'function' ? t.shock(C.helpers(C.rng(seed)), 1).story : ''; };
```

Replace the export line with:

```js
  const ShopEvents = { COOLDOWN, IMMUNE, SHOCK_N, chance, open, stalledAt, roll, collect, collectAll, auditProgress, bonus, resolveAudit, resolveShock, shockValidate, story };
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `node tests/run.js shock`, `node tests/run.js pipeline`, then `npm test`
Expected: all PASS, 0 failed.

- [ ] **Step 6: Commit**

```bash
git add js/shop/pipeline.js js/shop/events.js tests/shock.test.js
git commit -m "feat: shock validation runs three shocked and two normal contracts

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Firm panel stalled chips, audit resolve, collect-all toast and CSS

**Files:**
- Modify: `js/shop/firm.js`
- Modify: `js/shop/ui.js` (the `ShopFirm.panel(...)` call in `board`)
- Modify: `css/styles.css` (after the `.wk-chip.full` rule)
- Test: `tests/firm.test.js`

**Interfaces:**
- Consumes: `ShopEvents.open/auditProgress/collectAll/resolveAudit` (Task 3).
- Produces: `ShopFirm.panel(d, now, sched) -> html`, `ShopFirm.env() -> sched` (browser only; reads `Store`, `Scheduler`, `PCEA`), `ShopFirm.stallChip(d, id, sched) -> html` (used by Task 6). CSS classes `.idle-desk.stalled`, `.wk-chip.stalled`, `.idle-acts`, `.wk-item.stalled`, `.wk-shock`.

- [ ] **Step 1: Write the failing tests** (`tests/firm.test.js`)

```js
const assert = require('assert');
const F = require('../js/shop/firm.js');
const H = 3600000;
const pipe = (id, at) => ({ ['pipe-' + id]: { pipe: id, steps: [], outs: [], stepCount: 2, primitivesOnly: false, passed: true, tier: 1, passedAt: at, t: at } });
const D = (...parts) => ({ shop: Object.assign({}, ...parts) });
const sched = last => ({ profile: 'Ann', isDue: () => false, get: id => (id in last ? { last: last[id] } : null), cards: () => [] });
const audit = at => ({ ['evt-esc-compound-' + at]: { evt: 'esc-compound', kind: 'audit', module: 'm05', at, cards: ['c1', 'c2'], seed: 1, t: at } });

module.exports = [
  ['audit desk shows progress and a review link until every card is done', () => {
    const d = D(pipe('esc-compound', 0), audit(30 * H));
    const html = F.panel(d, 40 * H, sched({ c1: 31 * H }));
    assert.ok(html.includes('idle-desk stalled'));
    assert.ok(html.includes('Stalled: Audit m05 (1/2 reviewed)'));
    assert.ok(html.includes('href="#/cards?m=m05"'));
    assert.ok(!html.includes('data-resolve'));
    const done = F.panel(d, 40 * H, sched({ c1: 31 * H, c2: 32 * H }));
    assert.ok(done.includes('data-resolve="esc-compound"'));
    assert.ok(!done.includes('Review cards'));
  }],
  ['shock desk links to the workshop; healthy desk has no chip', () => {
    const d = D(pipe('esc-compound', 0), pipe('lc-unit', 0), { 'evt-esc-compound-9': { evt: 'esc-compound', kind: 'shock', module: 'm05', at: 9, seed: 1, t: 9 } });
    const html = F.panel(d, 40 * H, sched({}));
    assert.ok(html.includes('Stalled: Market shock'));
    assert.ok(html.includes('href="#/shop/pipe/esc-compound"'));
    assert.strictEqual(html.split('wk-chip stalled').length - 1, 1);
    assert.strictEqual(F.stallChip(d, 'lc-unit', sched({})), '');
  }]
];
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node tests/run.js firm`
Expected: FAIL (`F.stallChip is not a function` / missing `Stalled:` text).

- [ ] **Step 3: Implement in `js/shop/firm.js`**

Under the `const T = ...` require line add:

```js
  const E = typeof module !== 'undefined' && module.exports ? require('./events.js') : root.ShopEvents;
```

Above `function panel` add:

```js
  // Browser scheduler for ShopEvents: due and last-review state from Scheduler, card ids per module from PCEA.
  const env = () => ({ profile: Store.profile, isDue: Scheduler.isDue, get: Scheduler.get,
    cards: m => { const mod = PCEA.module(m); return mod ? mod.cardList.map(c => c.id) : []; } });
  function stallChip(d, id, sched) {
    const o = E.open(d, id);
    if (!o) return '';
    if (o.rec.kind === 'audit') {
      const p = E.auditProgress(d, o.rec, sched), m = esc(o.rec.module);
      return `<span class="wk-chip stalled">Stalled: Audit ${m} (${p.done}/${p.total} reviewed)</span>
        <div class="idle-acts">${p.done >= p.total ? `<button class="btn small" data-resolve="${esc(id)}">Resolve</button>` : `<a class="btn small ghost" href="#/cards?m=${m}">Review cards</a>`}</div>`;
    }
    return `<span class="wk-chip stalled">Stalled: Market shock</span>
      <div class="idle-acts"><a class="btn small ghost" href="#/shop/pipe/${esc(id)}">Fix in Workshop</a></div>`;
  }
  const eventLine = w => title(w.rec.evt) + ': ' + (w.rec.kind === 'audit' ? 'audit, ' + (w.rec.cards || []).length + ' cards to review' : 'market shock');
```

Change `function panel(d, now) {` to `function panel(d, now, sched) {` and replace the `return` inside `shift.map(o => { ... })` with:

```js
      const stall = stallChip(d, o.id, sched);
      return `<div class="idle-desk${stall ? ' stalled' : ''}" data-desk="${esc(o.id)}"><b>${esc(title(o.id))}</b>
        <span class="muted small">${money(r.net)}/h net</span>
        <div class="idle-out"><output>${money(b.amount)}</output><span class="wk-chip full" ${b.full ? '' : 'hidden'}>Full</span></div>
        <div class="hud-bar"><i style="width:${pct(b.hours, f.capHours)}%"></i></div>${stall}</div>`;
```

In `wire`, replace the `if (btn) btn.onclick = ...;` block with:

```js
    if (btn) btn.onclick = () => {
      const res = E.collectAll(Store.data, Date.now(), env());
      if (!res.writes.length) return;
      apply(res.writes);
      const cols = res.writes.filter(w => w.rec.collect), cash = Math.round(cols.reduce((s, w) => s + w.rec.amount, 0) * 10) / 10;
      Hud.toast('+' + money(cash) + ' banked', res.events.length ? 'While you were away... ' + res.events.map(eventLine).join('; ')
        : cols.length + ' desk' + (cols.length > 1 ? 's' : ''));
      rerender();
    };
    root.querySelectorAll('[data-resolve]').forEach(b => b.onclick = () => {
      const r = E.resolveAudit(Store.data, b.dataset.resolve, Date.now(), env());
      if (!r) { rerender(); return; }
      apply(r.writes);
      Hud.toast('Audit cleared', '+' + money(r.rec.bonus) + ' bonus');
      rerender();
    });
```

Replace the export line with:

```js
  const ShopFirm = { panel, upgradesHTML, wire, env, stallChip };
```

- [ ] **Step 4: Pass the scheduler from `js/shop/ui.js`**

In `board`, replace `${ShopFirm.panel(Store.data, Date.now())}` with:

```js
      ${ShopFirm.panel(Store.data, Date.now(), ShopFirm.env())}
```

- [ ] **Step 5: Add CSS** (`css/styles.css`, directly after `.wk-chip.full { ... }`)

```css
.idle-desk.stalled { border-left-color: var(--bad); }
.wk-chip.stalled { background: var(--bad-soft); color: var(--bad); overflow-wrap: anywhere; }
.idle-acts { display: flex; flex-wrap: wrap; gap: 6px; }
.wk-item.stalled { border-color: var(--bad); }
.wk-shock { display: flex; flex-direction: column; gap: 4px; margin: 12px 0; padding: 10px 14px; border-left: 4px solid var(--bad); border-radius: var(--radius); background: var(--bad-soft); color: var(--ink); overflow-wrap: anywhere; }
.wk-shock b { color: var(--bad); }
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `node tests/run.js firm` then `npm test`
Expected: 2 firm tests PASS; full suite 0 failed.

- [ ] **Step 7: Manual check**

Run `npm start`, open the shop. In the browser console, stall a running desk:
`Store.data.shop['evt-' + ShopIdle.onShift(Store.data)[0].id + '-' + (Date.now() - 1000)] = { evt: ShopIdle.onShift(Store.data)[0].id, kind: 'audit', module: 'm05', at: Date.now() - 1000, cards: PCEA.module('m05').cardList.slice(0, 2).map(c => c.id), seed: 1, t: Date.now() - 1000 }; Store.save(); location.reload();`
Expected: red chip `Stalled: Audit m05 (0/2 reviewed)`, outbox frozen, `Review cards` opens the card builder with M5 ticked. After reviewing both cards, the chip shows 2/2 and `Resolve`; clicking toasts `Audit cleared` and the desk ticks again. Check at 375 px width (no horizontal scroll) and in dark mode.

- [ ] **Step 8: Commit**

```bash
git add js/shop/firm.js js/shop/ui.js css/styles.css tests/firm.test.js
git commit -m "feat: firm desks show stalled events, audit resolve and away toast

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Workshop stalled chip, shock banner and shock fix flow

**Files:**
- Modify: `js/shop/workshop.js` (`panel`, `route`: `sample`, `render`, `test`)

**Interfaces:**
- Consumes: `ShopEvents.open/shockValidate/resolveShock/story` (Tasks 3-4), `ShopFirm.stallChip/env` (Task 5; `firm.js` loads after `workshop.js`, so call it only at render time, never at load).
- Produces: UI only.

- [ ] **Step 1: Stalled chip in the workshop list**

In `panel`, replace the running item's `return` (the one starting `` return `<div class="wk-item running"> ``) with:

```js
        const stall = ShopEvents.open(d, t.id) ? ShopFirm.stallChip(d, t.id, ShopFirm.env()) : '';
        return `<div class="wk-item running${stall ? ' stalled' : ''}"><a href="#/shop/pipe/${t.id}"><b>${esc(t.title)}</b></a>
          <span class="muted small">${money(I.rate(d, t.id).net)}/h net &middot; ${rec.stepCount || 0} steps &middot; tier ${'I'.repeat(tier)}</span>
          ${tier < maxTier ? `<a class="wk-chip" href="#/shop/pipe/${t.id}">Re-test for tier ${'I'.repeat(maxTier)}</a>` : ''}
          ${stall}
          <button class="btn small ${on ? '' : 'ghost'}" data-shift="${t.id}" ${!on && busy ? 'disabled' : ''}>${on ? 'On shift' : busy ? 'All desks busy' : 'Off shift'}</button></div>`;
```

No extra wiring: `ShopFirm.wire(root, ...)` runs on the same board root before `wirePanel` and already binds every `[data-resolve]` button, including these.

- [ ] **Step 2: Shock sample and banner in `route`**

Replace the `const sample = () => { ... };` line with:

```js
    const shockEvt = () => { const o = ShopEvents.open(Store.data, id); return o && o.rec.kind === 'shock' && tpl.shock ? o : null; };
    const sample = () => {
      const st = C.state(Store.data), o = shockEvt();
      tier = 1 + (roll % st.maxTier);
      if (o && roll === 0) return tpl.shock(C.helpers(C.rng(o.rec.seed)), tier);
      return tpl.gen(C.helpers(C.rng(C.hash(Store.profile.toLowerCase() + '|' + id + '|sample|' + roll))), tier);
    };
```

In `render`, directly after the `<p class="muted">Wire blocks ... Review the lesson</a></p>` line inside the template, add:

```js
        ${shockEvt() ? `<div class="wk-shock"><b>Market shock</b><span>${esc(ShopEvents.story(id, shockEvt().rec.seed))}</span>
          <span class="muted small">Test runs use ${ShopEvents.SHOCK_N} shocked contracts and ${P.VALIDATE_N - ShopEvents.SHOCK_N} normal ones. Pass to restart this desk.</span></div>` : ''}
```

- [ ] **Step 3: 3+2 test runs and shock resolve in `test()`**

Replace the line `const v = P.validate(pipe, tpl, Store.profile.toLowerCase() + '|' + id + '|' + tries, st.maxTier);` with:

```js
      const shocked = shockEvt(), seedKey = Store.profile.toLowerCase() + '|' + id + '|' + tries;
      const v = shocked ? ShopEvents.shockValidate(Store.data, id, pipe, seedKey) : P.validate(pipe, tpl, seedKey, st.maxTier);
      let fix = null;
```

Replace the `if (v.passed) { ... }` block with (the resolve is computed before the new pipe record so the bonus uses the current rate):

```js
      if (v.passed) {
        const now = Date.now();
        fix = shocked ? ShopEvents.resolveShock(Store.data, id, now) : null;
        ShopIdle.repass(Store.data, id, now).writes.forEach(w => { Store.data.shop[w.key] = w.rec; });
        Store.data.shop['pipe-' + id] = { pipe: id, steps: JSON.parse(JSON.stringify(pipe.steps)), outs: JSON.parse(JSON.stringify(pipe.outs)), stepCount: pipe.steps.length, primitivesOnly: P.primitivesOnly(pipe), passed: true, tier: st.maxTier, passedAt: now, t: now };
        if (fix) fix.writes.forEach(w => { Store.data.shop[w.key] = w.rec; });
      }
```

In the result table row, replace `<td>#${k + 1} <span class="tier">${'I'.repeat(r.tier)}</span></td>` with:

```js
<td>#${k + 1} <span class="tier">${'I'.repeat(r.tier)}</span>${r.shock ? ' <span class="wk-chip stalled">shock</span>' : ''}</td>
```

After `render();` at the end of `test()` (before the `if (unlocks.length)` block), add:

```js
      if (fix) Hud.toast('Market shock fixed', '+' + money(fix.rec.bonus) + ' bonus');
```

- [ ] **Step 4: Run the suite**

Run: `npm test`
Expected: 0 failed (workshop has no Node tests; this guards the shared modules).

- [ ] **Step 5: Manual check**

Run `npm start`. In the console, shock a running pipeline, e.g. `esc-index`:
`Store.data.shop['evt-esc-index-' + (Date.now() - 1000)] = { evt: 'esc-index', kind: 'shock', module: 'm05', at: Date.now() - 1000, seed: 7, t: Date.now() - 1000 }; Store.save(); location.reload();`
Expected: the firm desk and the workshop item show `Stalled: Market shock`; `Fix in Workshop` opens the builder with the red banner and rebased index sample inputs (about 100, not about 1). A pipeline wired `cost x (1 / idxYear)` fails the 3 shock rows; the reference wiring `cost x idxBase / idxYear` passes, toasts `Market shock fixed`, the chip disappears and the desk ticks from now. Rerolling the sample shows normal contracts. Check phone width and dark mode, and that `Collect all` shows `While you were away...` when a roll fires (force with a desk idle over 24 h after its pass).

- [ ] **Step 6: Commit**

```bash
git add js/shop/workshop.js
git commit -m "feat: workshop shock banner, 3+2 test runs and shock resolve

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Self-review

- **Spec coverage:** hybrid kinds, roll rule, seed, cooldown, immunity, doubling, cap (Task 3); kind selection and 10-card snapshot (Task 3); soft stall and restart (Task 1); audit resolve with progress (Tasks 3, 5); shock resolve via 3+2 workshop run (Tasks 4, 6); bonus in cash, XP unchanged (Tasks 1, 3); data model keys (Tasks 1, 3); 8 shock variants, reference pass, hard-coded fail, snapshot unchanged (Task 2); `collectAll` returns event writes (Task 3, via `ShopEvents`); firm chips, review and resolve, workshop chip and banner, away toast, phone/desktop/dark (Tasks 5, 6).
- **Placeholders:** none; every code step has full code.
- **Type consistency:** resolvers return `{ key, rec, writes }` everywhere and callers apply `writes`; `sched` shape `{ profile, isDue, get, cards }` is the same in tests, `ShopFirm.env()` and all `ShopEvents` calls; `shockValidate(d, id, pipe, seedKey)` matches its Task 6 call.
- **Review Focus:** items 1-3 and 5 are tested in Task 3, item 4 in Task 1.
