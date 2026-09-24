# Shop Pipelines Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the learner automate a contract type by wiring a pipeline of nodes that is validated against freshly generated contracts, earning reusable domain nodes when they build from primitives.

**Architecture:** Templates additionally return their named numeric `inputs`. A pure node library (`nodes.js`) and a pure pipeline engine (`pipeline.js`) run, check and validate pipelines and derive progress (gate, earned nodes, status) from `Store.data.shop` records. A new UI module (`workshop.js`) renders the Workshop panel on the board and the builder route `#/shop/pipe/<tplId>`.

**Tech Stack:** Vanilla JS (UMD-style IIFEs, `module.exports` in Node, globals in browser), Node `assert` tests run by `tests/run.js`, plain CSS with existing tokens in `css/styles.css`.

**Spec:** `docs/superpowers/specs/2026-09-24-shop-pipelines-design.md`

**Deviations from spec (decided while planning, from reading the code):**
- Templates are not split into `inputs()` + `gen()`. `gen()` keeps its body and additionally returns `inputs`; each template gains static `ins` metadata. Same effect, no RNG-order risk.
- Pipeline records use field `pipe` (not `tpl`) and node records use `node`, because `ShopCore.state()` counts any record with `tpl` as a finished contract.
- `outs` is an array indexed by answer position, not keyed by label, because several answer labels embed generated numbers (e.g. `Hours for unit 37`).
- No `Constant` node: any argument may be a constant `{c: <number>}`.
- Extra primitive `If(cond, a, b)`: risk-sum and evm-eac switch formula on a flag (correlated / composite) shown in the brief.
- `LinFit`/`Predict` become `LinSlope`/`LinIntercept` (every node has one output). EAC splits into `EACCPI` and `EACComposite`.
- Node picker is a native `<select>` with optgroups (renders as a sheet on phones).
- Unit warning is limited to percent-vs-not-percent mismatches between a contract input and a domain node port.

## Global Constraints

- No build step, no dependencies. Every new JS file is an IIFE that sets `module.exports` in Node and a global in the browser, like `js/shop/core.js`.
- Percent inputs are stored as fractions (0.03), and ports that take them are marked `pct: true`. Answers with unit `%` are percent numbers (e.g. CV 12.5), so pipelines multiply by 100.
- Pass rule: every answer on every one of 5 validation contracts scores 1 in `ShopCore.answerScore` (within 1%).
- Gate: 3 hand-solved contract records (`tpl === id`, `score === 1`, not a campaign) open a template's pipeline slot.
- Existing `gen()` output (`brief`, `answers`, `explain`) must be byte-identical for the same seed.
- Layout: below 900px, cards stack vertically; at 900px and wider, left-to-right. No horizontal page scroll (the chain may scroll inside itself).
- Run all tests with `npm test`; a single file with `node tests/run.js <substring>`.
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. A pipeline synced from another device uses a domain node this device has not earned: `check` reports "Node not unlocked" on that step, and the builder shows it red without crashing (tested in Task 4).
2. Wrong wiring produces NaN/Infinity (log of a negative, divide by zero): `run` records an error on that step, marks dependent steps as errors, and scores those answers as misses. It never throws (Task 4).
3. A cost is wired into `Range` (e.g. `Range(1, 250000)`): `Range` throws "Range too long" (limit 1000) instead of freezing the tab (Task 3).
4. Deleting or moving a step: references to the removed step become empty (red), references to later steps are renumbered so they still point at the same step, and moves that create forward references are flagged by `check` (Task 4).
5. An answer output left unbound, or a validation run on a template whose answer count differs from `outs.length`: treated as a miss / check problem, never a crash (Tasks 4 and 5).

---

## File map

- Modify `js/shop/templates.js`: add `ins` to each template and `inputs` to each `gen()` return.
- Create `js/shop/nodes.js`: node library (`ShopNodes`).
- Create `js/shop/pipeline.js`: engine and progress rules (`ShopPipe`).
- Create `js/shop/workshop.js`: Workshop panel + builder UI (`ShopWorkshop`).
- Modify `js/shop/ui.js`: route `pipe` and render the Workshop panel on the board.
- Modify `index.html`: load `nodes.js`, `pipeline.js` after `campaign.js`, and `workshop.js` before `ui.js`.
- Modify `css/styles.css`: workshop styles.
- Create `tests/fixtures/gen-snapshot.json`, `tests/fixtures/pipes.js`, `tests/nodes.test.js`, `tests/pipeline.test.js`; modify `tests/templates.test.js`.

---

### Task 1: Snapshot current template output

**Files:**
- Create: `tests/fixtures/gen-snapshot.json`
- Modify: `tests/templates.test.js`

**Interfaces:**
- Produces: `tests/fixtures/gen-snapshot.json` = `{ "<tplId>|<tier>|<seed>": {brief, answers, explain} }` for seeds 1..3, tiers 1..3, generated with `C.helpers(C.rng(seed * 7919 + tier))`.

- [ ] **Step 1: Generate the snapshot from the unmodified templates**

`tests/run.js` only loads `*.test.js`, so the `fixtures` folder is safe. Run:

```bash
mkdir -p tests/fixtures && node -e "
const C=require('./js/shop/core.js'),T=require('./js/shop/templates.js'),o={};
for(const t of T)for(let tier=1;tier<=3;tier++)for(let seed=1;seed<=3;seed++){const j=t.gen(C.helpers(C.rng(seed*7919+tier)),tier);o[t.id+'|'+tier+'|'+seed]={brief:j.brief,answers:j.answers,explain:j.explain};}
require('fs').writeFileSync('tests/fixtures/gen-snapshot.json',JSON.stringify(o,null,1));console.log(Object.keys(o).length);"
```

Expected output: `207`

- [ ] **Step 2: Add the snapshot test**

Append to the array in `tests/templates.test.js` (before the closing `];`):

```js
  ['gen output matches the pre-pipeline snapshot', () => {
    const snap = require('./fixtures/gen-snapshot.json');
    for (const t of T) for (let tier = 1; tier <= 3; tier++) for (let seed = 1; seed <= 3; seed++) {
      const j = t.gen(C.helpers(C.rng(seed * 7919 + tier)), tier);
      assert.deepStrictEqual({ brief: j.brief, answers: j.answers, explain: j.explain }, snap[t.id + '|' + tier + '|' + seed], t.id + ' tier ' + tier + ' seed ' + seed);
    }
  }],
```

- [ ] **Step 3: Run it**

Run: `node tests/run.js templates`
Expected: all PASS including `gen output matches the pre-pipeline snapshot`.

- [ ] **Step 4: Commit**

```bash
git add tests/fixtures/gen-snapshot.json tests/templates.test.js
git commit -m "test: snapshot contract template output

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Templates expose named inputs

**Files:**
- Modify: `js/shop/templates.js` (all 23 templates)
- Modify: `tests/templates.test.js`

**Interfaces:**
- Produces: every template has `ins: { <name>: { label: string, unit: string } }` (unit `'%'` means stored as a fraction). Every `gen()` return has `inputs: { <name>: number | number[] }` with exactly the keys of `ins`. Flags (`correlated`, `composite`) are `0` or `1` with unit `'flag'`.

- [ ] **Step 1: Write the failing test**

Append to `tests/templates.test.js`:

```js
  ['every template exposes inputs matching its ins metadata', () => {
    for (const t of T) {
      assert.ok(t.ins && typeof t.ins === 'object', t.id + ' ins');
      for (let tier = 1; tier <= 3; tier++) for (let seed = 1; seed <= 50; seed++) {
        const j = t.gen(C.helpers(C.rng(seed * 7919 + tier)), tier);
        assert.deepStrictEqual(Object.keys(j.inputs).sort(), Object.keys(t.ins).sort(), t.id);
        for (const [k, v] of Object.entries(j.inputs)) {
          const ok = Array.isArray(v) ? v.length > 0 && v.every(Number.isFinite) : Number.isFinite(v);
          assert.ok(ok, `${t.id} input ${k} = ${v}`);
          assert.ok(t.ins[k].label && typeof t.ins[k].unit === 'string', `${t.id} ins ${k}`);
        }
      }
    }
  }],
```

- [ ] **Step 2: Run it to see it fail**

Run: `node tests/run.js templates`
Expected: FAIL `every template exposes inputs matching its ins metadata` with `esc-compound ins`.

- [ ] **Step 3: Add `ins` and `inputs` to every template**

For each template, add an `ins` property after `title` and an `inputs` field to the returned object. Do not change any other line. The exact additions:

```js
// esc-compound
ins: { cost: { label: 'Base-year cost', unit: '$M' }, rate: { label: 'Inflation per year', unit: '%' }, years: { label: 'Years', unit: 'yr' } },
inputs: { cost: C, rate: rt, years: n },

// esc-index
ins: { cost: { label: 'Then-year cost', unit: '$M' }, idxBase: { label: 'Index, base year', unit: '' }, idxYear: { label: 'Index, spend year', unit: '' } },
inputs: { cost: T$, idxBase: ib, idxYear: it },

// analogy-scale
ins: { cost: { label: 'Analog cost', unit: '$M' }, oldWt: { label: 'Analog weight', unit: 'lb' }, newWt: { label: 'New weight', unit: 'lb' }, exp: { label: 'Scaling exponent', unit: '' }, factor: { label: 'Complexity factor', unit: '' } },
inputs: { cost: C, oldWt: wo, newWt: wn, exp: p, factor: cf },

// cer-power
ins: { a: { label: 'Coefficient a', unit: '' }, b: { label: 'Exponent b', unit: '' }, weight: { label: 'Weight', unit: 'lb' } },
inputs: { a, b, weight: X },

// stats-cv
ins: { costs: { label: 'Historical costs', unit: '$K' } },
inputs: { costs: xs.slice() },

// lc-unit
ins: { t1: { label: 'Unit 1 hours', unit: 'hours' }, slope: { label: 'Learning slope', unit: '%' }, unit: { label: 'Unit number', unit: '' } },
inputs: { t1: T1, slope: s, unit: N },

// lc-lot
ins: { t1: { label: 'First-unit cost', unit: '$K' }, slope: { label: 'Learning slope', unit: '%' }, first: { label: 'First unit in lot', unit: '' }, qty: { label: 'Lot quantity', unit: '' } },
inputs: { t1: T1, slope: s, first: F, qty: Q },

// lc-slope
ins: { unit1: { label: 'Unit A', unit: '' }, hours1: { label: 'Hours for unit A', unit: 'hours' }, unit2: { label: 'Unit B', unit: '' }, hours2: { label: 'Hours for unit B', unit: 'hours' } },
inputs: { unit1: X1, hours1: Y1, unit2: X2, hours2: Y2 },

// reg-fit
ins: { xs: { label: 'X values', unit: '' }, ys: { label: 'Y values', unit: '$K' }, xNew: { label: 'X to predict', unit: '' } },
inputs: { xs: X.slice(), ys: Y.slice(), xNew: xp },

// tri-stats
ins: { low: { label: 'Low', unit: '$M' }, mode: { label: 'Most likely', unit: '$M' }, high: { label: 'High', unit: '$M' } },
inputs: { low: L, mode: Mo, high: H },

// risk-sum
ins: { means: { label: 'Element means', unit: '$M' }, sds: { label: 'Element std devs', unit: '$M' }, correlated: { label: 'Perfectly correlated? (1 = yes)', unit: 'flag' } },
inputs: { means: mu.slice(), sds: sd.slice(), correlated: corr ? 1 : 0 },

// normal-prob
ins: { mean: { label: 'Mean', unit: '$M' }, sd: { label: 'Std deviation', unit: '$M' }, budget: { label: 'Budget', unit: '$M' } },
inputs: { mean: mu, sd: sg, budget: B },

// expected-value
ins: { probs: { label: 'Outcome probabilities', unit: '' }, costs: { label: 'Outcome costs', unit: '$M' } },
inputs: { probs: [p1, p2, p3], costs: c.slice() },

// mfg-labor
ins: { stdHours: { label: 'Standard hours per unit', unit: 'hours' }, qty: { label: 'Units', unit: '' }, realization: { label: 'Realization factor', unit: '' }, rate: { label: 'Wrap rate', unit: '$/hour' } },
inputs: { stdHours: S, qty: Q, realization: R, rate: W },

// make-buy
ins: { tooling: { label: 'Tooling', unit: '$K' }, makeUnit: { label: 'Make cost per unit', unit: '$' }, buyUnit: { label: 'Buy price per unit', unit: '$' } },
inputs: { tooling: F, makeUnit: v, buyUnit: p },

// sw-effort
ins: { a: { label: 'Coefficient A', unit: '' }, b: { label: 'Exponent B', unit: '' }, ksloc: { label: 'Size', unit: 'KSLOC' }, rate: { label: 'Cost per person-month', unit: '$K' } },
inputs: { a: A, b: B, ksloc: S, rate },

// npv  (return is after the retry loop, so these are the final values)
ins: { invest: { label: 'Up-front cost', unit: '$K' }, flows: { label: 'Savings, years 1-5', unit: '$K' }, rate: { label: 'Discount rate', unit: '%' } },
inputs: { invest: I, flows: A.slice(), rate: r },

// pv-annuity
ins: { amount: { label: 'Cost per year', unit: '$K' }, years: { label: 'Years', unit: 'yr' }, rate: { label: 'Discount rate', unit: '%' } },
inputs: { amount: A, years: n, rate: r },

// cpif-fee
ins: { targetCost: { label: 'Target cost', unit: '$M' }, targetFee: { label: 'Target fee', unit: '$M' }, govShare: { label: 'Govt share', unit: '%' }, conShare: { label: 'Contractor share', unit: '%' }, minFee: { label: 'Minimum fee', unit: '$M' }, maxFee: { label: 'Maximum fee', unit: '$M' }, actual: { label: 'Actual cost', unit: '$M' } },
inputs: { targetCost: TC, targetFee: TF, govShare: g / 100, conShare: c / 100, minFee: mn, maxFee: mx, actual: AC },

// fpif-pta
ins: { targetCost: { label: 'Target cost', unit: '$M' }, targetProfit: { label: 'Target profit', unit: '$M' }, ceiling: { label: 'Ceiling price', unit: '$M' }, govShare: { label: 'Govt share', unit: '%' }, conShare: { label: 'Contractor share', unit: '%' }, actual: { label: 'Actual cost', unit: '$M' } },
inputs: { targetCost: TC, targetProfit: TP, ceiling: CP, govShare: g / 100, conShare: c / 100, actual: AC },

// evm-eac
ins: { bac: { label: 'BAC', unit: '$M' }, pv: { label: 'PV', unit: '$M' }, ev: { label: 'EV', unit: '$M' }, ac: { label: 'AC', unit: '$M' }, composite: { label: 'Composite EAC? (1 = yes)', unit: 'flag' } },
inputs: { bac: e.BAC, pv: e.PV, ev: e.EV, ac: e.AC, composite: comp ? 1 : 0 },

// evm-tcpi
ins: { bac: { label: 'BAC', unit: '$M' }, ev: { label: 'EV', unit: '$M' }, ac: { label: 'AC', unit: '$M' } },
inputs: { bac: e.BAC, ev: e.EV, ac: e.AC },

// abc-cost
ins: { setupPool: { label: 'Setup cost pool', unit: '$K' }, setups: { label: 'Total setups', unit: '' }, inspPool: { label: 'Inspection cost pool', unit: '$K' }, inspections: { label: 'Total inspections', unit: '' }, aSetups: { label: 'Product A setups', unit: '' }, aInsp: { label: 'Product A inspections', unit: '' } },
inputs: { setupPool: P1, setups: D1, inspPool: P2, inspections: D2, aSetups: u1, aInsp: u2 },
```

Example of the finished `esc-compound` so the placement is unambiguous:

```js
  add({ id: 'esc-compound', module: 'm05', section: 'm05/procedures', title: 'Escalate to then-year dollars',
    ins: { cost: { label: 'Base-year cost', unit: '$M' }, rate: { label: 'Inflation per year', unit: '%' }, years: { label: 'Years', unit: 'yr' } },
    gen(h, tier) {
    const C = r1(h.num(2, 20, 0.5) * K[tier]), by = h.num(2018, 2024, 1), n = h.num(2, 8, 1), rt = h.pick([0.02, 0.025, 0.03, 0.035, 0.04]);
    const ty = C * Math.pow(1 + rt, n);
    return {
      brief: `...unchanged...`,
      answers: [{ label: 'Then-year cost', unit: '$M', value: ty }],
      explain: `...unchanged...`,
      inputs: { cost: C, rate: rt, years: n }
    };
  } });
```

Also update the header comment on line 1 to: `// Contract templates for the estimating shop. gen(h, tier) returns { brief, answers, explain, inputs }; ins describes the inputs.`

- [ ] **Step 4: Run the template tests**

Run: `node tests/run.js templates`
Expected: all PASS, including the snapshot test from Task 1 (proves `brief`/`answers`/`explain` are unchanged).

- [ ] **Step 5: Run the whole suite**

Run: `npm test`
Expected: `0 failed`.

- [ ] **Step 6: Commit**

```bash
git add js/shop/templates.js tests/templates.test.js
git commit -m "feat: templates expose named inputs

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Node library

**Files:**
- Create: `js/shop/nodes.js`
- Create: `tests/nodes.test.js`

**Interfaces:**
- Produces: `ShopNodes = { list, byId, PRIMITIVE, DOMAIN, TOOL }`.
  - Node: `{ id, kind: 'primitive'|'domain'|'tool', label, ins: [{ name, pct?: true }], fn, module?, earnedFrom?: string[], tool?: string, hint: string }`.
  - `fn(...args)` returns a number or number[]; throws `Error` with a short message for invalid input (list length mismatch, list where a number is needed, Range too long). Non-finite results are handled by the engine (Task 4), not here.
  - `byId(id)` returns the node or `undefined`.

- [ ] **Step 1: Write the failing tests**

Create `tests/nodes.test.js`:

```js
const assert = require('assert');
const N = require('../js/shop/nodes.js');
const T = require('../js/shop/templates.js');
const near = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), `${a} vs ${b}`);
const fn = id => N.byId(id).fn;

module.exports = [
  ['ids unique, kinds valid, domain nodes earned from real templates', () => {
    assert.strictEqual(new Set(N.list.map(n => n.id)).size, N.list.length);
    const ids = new Set(T.map(t => t.id));
    N.list.forEach(n => {
      assert.ok(['primitive', 'domain', 'tool'].includes(n.kind), n.id);
      assert.ok(n.label && n.hint && Array.isArray(n.ins) && typeof n.fn === 'function', n.id);
      if (n.kind === 'domain') assert.ok(n.earnedFrom.length && n.earnedFrom.every(x => ids.has(x)), n.id);
      if (n.kind === 'tool') assert.strictEqual(n.tool, 'tables');
    });
  }],
  ['primitives broadcast over lists', () => {
    assert.deepStrictEqual(fn('add')([1, 2, 3], 10), [11, 12, 13]);
    assert.deepStrictEqual(fn('mul')([1, 2], [3, 4]), [3, 8]);
    assert.deepStrictEqual(fn('pow')(2, [1, 2, 3]), [2, 4, 8]);
    assert.strictEqual(fn('sub')(5, 2), 3);
    assert.throws(() => fn('add')([1, 2], [1, 2, 3]), /List lengths differ/);
  }],
  ['list primitives', () => {
    assert.deepStrictEqual(fn('range')(3, 6), [3, 4, 5, 6]);
    assert.strictEqual(fn('sum')([1, 2, 3]), 6);
    assert.strictEqual(fn('mean')([2, 4]), 3);
    assert.strictEqual(fn('count')([2, 4, 9]), 3);
    assert.strictEqual(fn('sum')(5), 5);
    assert.throws(() => fn('range')(1, 250000), /Range too long/);
    assert.throws(() => fn('range')(5, 2), /Range/);
    assert.throws(() => fn('range')([1, 2], 3), /needs a number/);
  }],
  ['if picks a branch', () => {
    assert.strictEqual(fn('if')(1, 'a', 'b'), 'a');
    assert.strictEqual(fn('if')(0, 'a', 'b'), 'b');
  }],
  ['domain nodes against hand-checked values', () => {
    near(fn('escalate')(100, 0.03, 5), 115.927407);
    near(fn('indexConvert')(50, 1.2, 1.0), 41.6666667, 1e-7);
    near(fn('powerCER')(2, 100, 0.5), 20);
    near(fn('lcUnit')(1000, 0.8, 4), 640);
    near(fn('lcLotTotal')(1000, 0.8, 1, 2), 1800);
    near(fn('lcSlope')(1, 1000, 2, 850), 0.85);
    near(fn('linSlope')([1, 2, 3], [2, 4, 6]), 2);
    near(fn('linIntercept')([1, 2, 3], [3, 5, 7]), 1);
    near(fn('triMean')(1, 2, 6), 3);
    near(fn('triSD')(0, 0, 3), Math.sqrt(9 / 18));
    near(fn('rss')([3, 4]), 5);
    near(fn('expectedValue')([0.5, 0.5], [10, 20]), 15);
    near(fn('stdDev')([2, 4, 4, 4, 5, 5, 7, 9]), 2.1380899, 1e-7);
    near(fn('cv')([2, 4]), Math.SQRT2 / 3, 1e-9);
    near(fn('breakEven')(1000, 10, 20), 100);
    near(fn('npv')(100, [60, 60], 0), 20);
    near(fn('annuityPV')(100, 2, 0.1), 173.553719, 1e-7);
    near(fn('cpifFee')(7, 100, 90, 0.2, 3, 10), 9);
    near(fn('cpifFee')(7, 100, 50, 0.2, 3, 10), 10);
    near(fn('fpifPTA')(100, 10, 120, 0.8), 112.5);
    near(fn('cpi')(80, 100), 0.8);
    near(fn('spi')(80, 100), 0.8);
    near(fn('eacCPI')(200, 0.8), 250);
    near(fn('eacComposite')(100, 200, 80, 0.8, 0.8), 287.5);
    near(fn('tcpi')(200, 80, 100), 1.2);
    near(fn('abcRate')(500, 250), 2);
    near(fn('normalCDF')(0), 0.5, 1e-7);
    near(fn('normalCDF')(1.6449), 0.95, 1e-4);
  }]
];
```

- [ ] **Step 2: Run to see it fail**

Run: `node tests/run.js nodes`
Expected: FAIL with `Cannot find module '../js/shop/nodes.js'`.

- [ ] **Step 3: Implement `js/shop/nodes.js`**

```js
// Pipeline nodes: primitives (always available), tool nodes (need a tool) and domain nodes (earned). Pure functions.
(function (root) {
  const isL = Array.isArray;
  const num = (x, who) => { if (isL(x)) throw new Error(who + ' needs a number, not a list'); return x; };
  const list = x => isL(x) ? x : [x];
  // Wraps a scalar function so any argument may be a list; lists must have equal length.
  const bc = f => (...a) => {
    const ls = a.filter(isL);
    if (!ls.length) return f(...a);
    const n = ls[0].length;
    if (ls.some(l => l.length !== n)) throw new Error('List lengths differ');
    return Array.from({ length: n }, (_, i) => f(...a.map(x => isL(x) ? x[i] : x)));
  };
  const sum = x => list(x).reduce((s, v) => s + v, 0);
  const mean = x => sum(x) / list(x).length;
  const sdev = x => { const l = list(x), m = mean(l); return Math.sqrt(l.reduce((s, v) => s + (v - m) * (v - m), 0) / (l.length - 1)); };
  const slope = (xs, ys) => { const mx = mean(xs), my = mean(ys); let sxy = 0, sxx = 0; xs.forEach((x, i) => { sxy += (x - mx) * (ys[i] - my); sxx += (x - mx) * (x - mx); }); return sxy / sxx; };
  const erf = x => { const s = Math.sign(x); x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; };
  const P = (id, label, names, fn, hint) => ({ id, kind: 'primitive', label, ins: names.map(name => ({ name })), fn, hint });
  const D = (id, label, module, earnedFrom, ins, fn, hint) => ({ id, kind: 'domain', label, module, earnedFrom, ins: ins.map(s => s.endsWith('%') ? { name: s.slice(0, -1), pct: true } : { name: s }), fn, hint });

  const PRIMITIVE = [
    P('add', 'Add', ['a', 'b'], bc((a, b) => a + b), 'a + b'),
    P('sub', 'Subtract', ['a', 'b'], bc((a, b) => a - b), 'a - b'),
    P('mul', 'Multiply', ['a', 'b'], bc((a, b) => a * b), 'a x b'),
    P('div', 'Divide', ['a', 'b'], bc((a, b) => a / b), 'a / b'),
    P('pow', 'Power', ['base', 'exp'], bc((a, b) => Math.pow(a, b)), 'base ^ exp'),
    P('log', 'Log (ln)', ['x'], bc(Math.log), 'natural log'),
    P('log2', 'Log2', ['x'], bc(Math.log2), 'log base 2'),
    P('exp', 'Exp', ['x'], bc(Math.exp), 'e ^ x'),
    P('sqrt', 'Square root', ['x'], bc(Math.sqrt), 'square root'),
    P('min', 'Min', ['a', 'b'], bc(Math.min), 'smaller of a and b'),
    P('max', 'Max', ['a', 'b'], bc(Math.max), 'larger of a and b'),
    P('if', 'If', ['flag', 'then', 'else'], (c, a, b) => num(c, 'If') !== 0 ? a : b, 'then when flag is not 0, else otherwise'),
    P('range', 'Range', ['from', 'to'], (a, b) => {
      a = num(a, 'Range'); b = num(b, 'Range');
      if (!Number.isInteger(a) || !Number.isInteger(b) || b < a) throw new Error('Range needs whole numbers with from <= to');
      if (b - a + 1 > 1000) throw new Error('Range too long');
      return Array.from({ length: b - a + 1 }, (_, i) => a + i);
    }, 'list from, from+1, ..., to'),
    P('sum', 'Sum', ['list'], sum, 'add up a list'),
    P('mean', 'Mean', ['list'], mean, 'average of a list'),
    P('count', 'Count', ['list'], x => list(x).length, 'number of items')
  ];
  const TOOL = [
    { id: 'normalCDF', kind: 'tool', tool: 'tables', label: 'Normal CDF', ins: [{ name: 'z' }], fn: bc(z => 0.5 * (1 + erf(z / Math.SQRT2))), hint: 'P(Z <= z) from the reference tables' }
  ];
  const DOMAIN = [
    D('escalate', 'Escalate', 'm05', ['esc-compound'], ['cost', 'rate%', 'years'], bc((c, r, n) => c * Math.pow(1 + r, n)), 'cost x (1 + rate) ^ years'),
    D('indexConvert', 'Index convert', 'm05', ['esc-index'], ['cost', 'fromIdx', 'toIdx'], bc((c, f, t) => c * t / f), 'cost x toIdx / fromIdx'),
    D('powerCER', 'Power CER', 'm03', ['cer-power'], ['a', 'x', 'b'], bc((a, x, b) => a * Math.pow(x, b)), 'a x x ^ b'),
    D('stdDev', 'Std dev (sample)', 'm06', ['stats-cv'], ['list'], sdev, 'sample standard deviation'),
    D('cv', 'Coeff. of variation', 'm06', ['stats-cv'], ['list'], x => sdev(x) / mean(x), 'std dev / mean, as a fraction'),
    D('lcUnit', 'LC unit cost', 'm07', ['lc-unit'], ['t1', 'slope%', 'unit'], bc((t1, s, n) => t1 * Math.pow(n, Math.log2(s))), 'T1 x unit ^ log2(slope)'),
    D('lcLotTotal', 'LC lot total', 'm07', ['lc-lot'], ['t1', 'slope%', 'first', 'last'], (t1, s, f, l) => {
      t1 = num(t1, 'LC lot'); s = num(s, 'LC lot'); f = num(f, 'LC lot'); l = num(l, 'LC lot');
      if (l - f + 1 > 1000 || l < f) throw new Error('Lot range invalid');
      let t = 0; for (let x = f; x <= l; x++) t += t1 * Math.pow(x, Math.log2(s)); return t;
    }, 'sum of unit costs, first..last'),
    D('lcSlope', 'LC slope', 'm07', ['lc-slope'], ['unit1', 'hours1', 'unit2', 'hours2'], bc((x1, y1, x2, y2) => Math.pow(2, Math.log(y2 / y1) / Math.log(x2 / x1))), 'slope as a fraction'),
    D('linSlope', 'LS slope', 'm08', ['reg-fit'], ['xs', 'ys'], slope, 'least-squares slope b'),
    D('linIntercept', 'LS intercept', 'm08', ['reg-fit'], ['xs', 'ys'], (xs, ys) => mean(ys) - slope(xs, ys) * mean(xs), 'least-squares intercept a'),
    D('triMean', 'Triangular mean', 'm09', ['tri-stats'], ['low', 'mode', 'high'], bc((l, m, h) => (l + m + h) / 3), '(L + M + H) / 3'),
    D('triSD', 'Triangular std dev', 'm09', ['tri-stats'], ['low', 'mode', 'high'], bc((l, m, h) => Math.sqrt((l * l + m * m + h * h - l * m - l * h - m * h) / 18)), 'triangular standard deviation'),
    D('rss', 'Root sum square', 'm09', ['risk-sum'], ['list'], x => Math.sqrt(list(x).reduce((s, v) => s + v * v, 0)), 'sqrt of the sum of squares'),
    D('expectedValue', 'Expected value', 'm10', ['expected-value'], ['probs', 'values'], (p, v) => sum(bc((a, b) => a * b)(p, v)), 'sum of p x value'),
    D('breakEven', 'Break-even qty', 'm11', ['make-buy'], ['fixed', 'makeUnit', 'buyUnit'], bc((f, m, b) => f / (b - m)), 'fixed / (buy - make)'),
    D('npv', 'NPV', 'm13', ['npv'], ['invest', 'flows', 'rate%'], (i, fl, r) => sum(list(fl).map((a, t) => a / Math.pow(1 + num(r, 'NPV'), t + 1))) - num(i, 'NPV'), '-invest + sum of discounted flows'),
    D('annuityPV', 'Annuity PV', 'm13', ['pv-annuity'], ['amount', 'years', 'rate%'], bc((a, n, r) => a * (1 - Math.pow(1 + r, -n)) / r), 'PV of a level stream'),
    D('cpifFee', 'CPIF fee', 'm14', ['cpif-fee'], ['targetFee', 'targetCost', 'actual', 'conShare%', 'minFee', 'maxFee'], bc((tf, tc, ac, c, mn, mx) => Math.min(mx, Math.max(mn, tf + c * (tc - ac)))), 'target fee + share x underrun, clamped'),
    D('fpifPTA', 'FPIF PTA', 'm14', ['fpif-pta'], ['targetCost', 'targetProfit', 'ceiling', 'govShare%'], bc((tc, tp, cp, g) => tc + (cp - (tc + tp)) / g), 'point of total assumption'),
    D('cpi', 'CPI', 'm15', ['evm-eac'], ['ev', 'ac'], bc((ev, ac) => ev / ac), 'EV / AC'),
    D('spi', 'SPI', 'm15', ['evm-eac'], ['ev', 'pv'], bc((ev, pv) => ev / pv), 'EV / PV'),
    D('eacCPI', 'EAC (CPI)', 'm15', ['evm-eac'], ['bac', 'cpi'], bc((bac, c) => bac / c), 'BAC / CPI'),
    D('eacComposite', 'EAC (composite)', 'm15', ['evm-eac'], ['ac', 'bac', 'ev', 'cpi', 'spi'], bc((ac, bac, ev, c, s) => ac + (bac - ev) / (c * s)), 'AC + (BAC - EV) / (CPI x SPI)'),
    D('tcpi', 'TCPI', 'm15', ['evm-tcpi'], ['bac', 'ev', 'ac'], bc((bac, ev, ac) => (bac - ev) / (bac - ac)), '(BAC - EV) / (BAC - AC)'),
    D('abcRate', 'Activity rate', 'm16', ['abc-cost'], ['pool', 'drivers'], bc((p, d) => p / d), 'cost pool / driver count')
  ];
  const list_ = [...PRIMITIVE, ...TOOL, ...DOMAIN];
  const map = new Map(list_.map(n => [n.id, n]));
  const ShopNodes = { list: list_, byId: id => map.get(id), PRIMITIVE, DOMAIN, TOOL };
  if (typeof module !== 'undefined' && module.exports) module.exports = ShopNodes; else root.ShopNodes = ShopNodes;
})(this);
```

- [ ] **Step 4: Run to see it pass**

Run: `node tests/run.js nodes`
Expected: 5 PASS, 0 failed.

- [ ] **Step 5: Commit**

```bash
git add js/shop/nodes.js tests/nodes.test.js
git commit -m "feat: pipeline node library

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Pipeline engine (run, check, edit helpers)

**Files:**
- Create: `js/shop/pipeline.js`
- Create: `tests/pipeline.test.js`

**Interfaces:**
- Consumes: `ShopNodes.byId(id)`, node `ins`/`fn`/`kind` (Task 3).
- Produces (`ShopPipe`):
  - Pipe shape: `{ steps: [{ node: string, args: { [port]: ref } }], outs: (string|null)[] }`, where ref is `'in.<name>'`, `'s<i>'`, `{ c: number }`, or `''`/missing (unset).
  - `run(pipe, inputs) -> { vals: (number|number[]|undefined)[], errs: (string|null)[], outs: (number|null)[] }`. Never throws. A step whose args reference an errored or missing value gets `errs[i] = 'Waiting on an input'`. Non-finite results give `'Result is not a finite number'`. A list bound to an answer gives `null`.
  - `check(pipe, ins, nAnswers, allowed) -> [{ step: number|null, port: string|null, msg: string }]`. `ins` is the template's `ins`, `allowed` is a `Set` of node ids usable here (or `null` to skip that check). Answer problems use `step: null, port: 'out<i>'`.
  - `removeStep(pipe, i) -> pipe` (new object): refs to `s<i>` become `''`, refs to `s<j>` with `j > i` become `s<j-1>`; same for `outs` (removed step becomes `null`).
  - `moveStep(pipe, i, dir) -> pipe` (dir `-1` or `1`): swaps steps `i` and `i+dir`, remapping refs so each still names the same step; out-of-range is a no-op copy.
  - `primitivesOnly(pipe) -> boolean`: no step uses a `domain` node.
  - `pctWarning(pipe, i, port, ins) -> string|null`: warning when a contract input's `'%'`-ness differs from a domain port's `pct`.

- [ ] **Step 1: Write the failing tests**

Create `tests/pipeline.test.js`:

```js
const assert = require('assert');
const P = require('../js/shop/pipeline.js');
const S = (node, args) => ({ node, args });
const ins = { cost: { label: 'c', unit: '$M' }, rate: { label: 'r', unit: '%' }, years: { label: 'y', unit: 'yr' } };
const esc = { steps: [S('add', { a: { c: 1 }, b: 'in.rate' }), S('pow', { base: 's0', exp: 'in.years' }), S('mul', { a: 'in.cost', b: 's1' })], outs: ['s2'] };

module.exports = [
  ['run computes step values and outputs', () => {
    const r = P.run(esc, { cost: 100, rate: 0.03, years: 5 });
    assert.ok(Math.abs(r.outs[0] - 115.9274) < 1e-3);
    assert.deepStrictEqual(r.errs, [null, null, null]);
  }],
  ['run never throws: non-finite, bad refs and list outputs become errors or null', () => {
    const bad = { steps: [S('log', { x: 'in.cost' }), S('mul', { a: 's0', b: 's9' }), S('range', { from: { c: 1 }, to: { c: 3 } })], outs: ['s0', 's1', 's2', null] };
    const r = P.run(bad, { cost: -5 });
    assert.strictEqual(r.errs[0], 'Result is not a finite number');
    assert.strictEqual(r.errs[1], 'Waiting on an input');
    assert.deepStrictEqual(r.outs, [null, null, null, null]);
    const r2 = P.run({ steps: [S('range', { from: { c: 1 }, to: { c: 250000 } })], outs: ['s0'] }, {});
    assert.strictEqual(r2.errs[0], 'Range too long');
    const r3 = P.run({ steps: [S('nope', {}), S('', {})], outs: [] }, {});
    assert.deepStrictEqual(r3.errs, ['Unknown node', 'Choose a block']);
  }],
  ['check flags forward, dangling and unknown refs, missing args, unbound answers', () => {
    assert.deepStrictEqual(P.check(esc, ins, 1, null), []);
    const p = { steps: [S('add', { a: 's1', b: 'in.nope' }), S('mul', { a: { c: 2 } })], outs: [null, 's5'] };
    const msgs = P.check(p, ins, 1, null).map(x => `${x.step}:${x.port}:${x.msg}`);
    assert.ok(msgs.includes('0:a:Must use an earlier step'));
    assert.ok(msgs.includes('0:b:Unknown input'));
    assert.ok(msgs.includes('1:b:Not connected'));
    assert.ok(msgs.includes('null:out0:Not connected'));
    assert.ok(msgs.includes('null:out1:Only 1 answer'));
  }],
  ['check flags nodes that are not unlocked here', () => {
    const p = { steps: [S('escalate', { cost: 'in.cost', rate: 'in.rate', years: 'in.years' })], outs: ['s0'] };
    const msgs = P.check(p, ins, 1, new Set(['add'])).map(x => x.msg);
    assert.ok(msgs.includes('Node not unlocked'));
    assert.deepStrictEqual(P.check(p, ins, 1, new Set(['escalate'])), []);
  }],
  ['removeStep empties refs to the removed step and renumbers later ones', () => {
    const p = P.removeStep(esc, 1);
    assert.strictEqual(p.steps.length, 2);
    assert.strictEqual(p.steps[1].args.b, '');
    const q = P.removeStep(esc, 0);
    assert.strictEqual(q.steps[0].args.base, '');
    assert.strictEqual(q.steps[1].args.b, 's0');
    assert.deepStrictEqual(q.outs, ['s1']);
    assert.strictEqual(esc.steps.length, 3, 'original untouched');
  }],
  ['moveStep keeps refs pointing at the same step; forward refs get flagged', () => {
    const p = P.moveStep(esc, 2, -1);
    assert.strictEqual(p.steps[1].node, 'mul');
    assert.strictEqual(p.steps[1].args.b, 's2');
    assert.deepStrictEqual(p.outs, ['s1']);
    assert.ok(P.check(p, ins, 1, null).some(x => x.step === 1 && x.msg === 'Must use an earlier step'));
    assert.deepStrictEqual(P.moveStep(esc, 0, -1), esc);
  }],
  ['primitivesOnly and pct warning', () => {
    assert.strictEqual(P.primitivesOnly(esc), true);
    const d = { steps: [S('escalate', { cost: 'in.rate', rate: 'in.cost', years: 'in.years' })], outs: ['s0'] };
    assert.strictEqual(P.primitivesOnly(d), false);
    assert.ok(P.pctWarning(d, 0, 'rate', ins));
    assert.ok(P.pctWarning(d, 0, 'cost', ins));
    assert.strictEqual(P.pctWarning(d, 0, 'years', ins), null);
    assert.strictEqual(P.pctWarning(esc, 0, 'b', ins), null);
  }]
];
```

- [ ] **Step 2: Run to see it fail**

Run: `node tests/run.js pipeline`
Expected: FAIL with `Cannot find module '../js/shop/pipeline.js'`.

- [ ] **Step 3: Implement the engine part of `js/shop/pipeline.js`**

```js
// Pipeline engine: run, check and edit pipelines of nodes, plus the progress rules for the workshop. Pure functions.
(function (root) {
  const N = typeof module !== 'undefined' && module.exports ? require('./nodes.js') : root.ShopNodes;
  const isStep = r => typeof r === 'string' && /^s\d+$/.test(r);
  const stepIdx = r => +r.slice(1);
  const finite = v => Array.isArray(v) ? v.every(Number.isFinite) : Number.isFinite(v);
  const clone = p => JSON.parse(JSON.stringify(p));

  function resolve(ref, inputs, vals, errs) {
    if (ref && typeof ref === 'object' && Number.isFinite(ref.c)) return ref.c;
    if (typeof ref === 'string' && ref.startsWith('in.') && inputs && ref.slice(3) in inputs) return inputs[ref.slice(3)];
    if (isStep(ref) && stepIdx(ref) < vals.length && !errs[stepIdx(ref)]) return vals[stepIdx(ref)];
    return undefined;
  }

  function run(pipe, inputs) {
    const vals = [], errs = [];
    pipe.steps.forEach(st => {
      const node = N.byId(st.node);
      if (!node) { vals.push(undefined); errs.push(st.node ? 'Unknown node' : 'Choose a block'); return; }
      const args = node.ins.map(p => resolve((st.args || {})[p.name], inputs, vals, errs));
      if (args.some(a => a === undefined)) { vals.push(undefined); errs.push('Waiting on an input'); return; }
      try {
        const v = node.fn(...args);
        if (!finite(v)) { vals.push(undefined); errs.push('Result is not a finite number'); return; }
        vals.push(v); errs.push(null);
      } catch (e) { vals.push(undefined); errs.push(e.message); }
    });
    const outs = (pipe.outs || []).map(r => { const v = isStep(r) ? resolve(r, inputs, vals, errs) : undefined; return typeof v === 'number' ? v : null; });
    return { vals, errs, outs };
  }

  function check(pipe, ins, nAnswers, allowed) {
    const out = [];
    const refProblem = (r, i) => {
      if (r === undefined || r === '' || r === null) return 'Not connected';
      if (typeof r === 'object') return Number.isFinite(r.c) ? null : 'Constant is not a number';
      if (r.startsWith('in.')) return r.slice(3) in ins ? null : 'Unknown input';
      if (isStep(r)) return stepIdx(r) < i ? null : 'Must use an earlier step';
      return 'Not connected';
    };
    pipe.steps.forEach((st, i) => {
      const node = N.byId(st.node);
      if (!node) { out.push({ step: i, port: null, msg: st.node ? 'Unknown node' : 'Choose a block' }); return; }
      if (allowed && !allowed.has(node.id)) out.push({ step: i, port: null, msg: 'Node not unlocked' });
      node.ins.forEach(p => { const m = refProblem((st.args || {})[p.name], i); if (m) out.push({ step: i, port: p.name, msg: m }); });
    });
    const outs = pipe.outs || [];
    for (let k = 0; k < Math.max(nAnswers, outs.length); k++) {
      if (k >= nAnswers) { out.push({ step: null, port: 'out' + k, msg: `Only ${nAnswers} answer${nAnswers > 1 ? 's' : ''}` }); continue; }
      const m = refProblem(outs[k], pipe.steps.length);
      if (m || !isStep(outs[k])) out.push({ step: null, port: 'out' + k, msg: m || 'Not connected' });
    }
    return out;
  }

  // Rewrites every step ref through f(oldIndex) -> newIndex | null (null means the step is gone).
  function remap(p, f) {
    const map = r => isStep(r) ? (f(stepIdx(r)) == null ? '' : 's' + f(stepIdx(r))) : r;
    p.steps.forEach(st => Object.keys(st.args || {}).forEach(k => { st.args[k] = map(st.args[k]); }));
    p.outs = (p.outs || []).map(r => isStep(r) ? (map(r) || null) : r);
    return p;
  }
  function removeStep(pipe, i) {
    const p = clone(pipe);
    p.steps.splice(i, 1);
    return remap(p, j => j === i ? null : j > i ? j - 1 : j);
  }
  function moveStep(pipe, i, dir) {
    const p = clone(pipe), j = i + dir;
    if (j < 0 || j >= p.steps.length) return p;
    [p.steps[i], p.steps[j]] = [p.steps[j], p.steps[i]];
    return remap(p, k => k === i ? j : k === j ? i : k);
  }
  const primitivesOnly = pipe => pipe.steps.every(st => { const n = N.byId(st.node); return !n || n.kind !== 'domain'; });
  function pctWarning(pipe, i, port, ins) {
    const st = pipe.steps[i], node = st && N.byId(st.node);
    if (!node || node.kind !== 'domain') return null;
    const p = node.ins.find(x => x.name === port), r = (st.args || {})[port];
    if (!p || typeof r !== 'string' || !r.startsWith('in.') || !ins[r.slice(3)]) return null;
    const isPct = ins[r.slice(3)].unit === '%';
    if (!!p.pct === isPct) return null;
    return p.pct ? 'This port expects a rate or share' : 'This port does not expect a rate or share';
  }

  const ShopPipe = { run, check, removeStep, moveStep, primitivesOnly, pctWarning };
  if (typeof module !== 'undefined' && module.exports) module.exports = ShopPipe; else root.ShopPipe = ShopPipe;
})(this);
```

- [ ] **Step 4: Run to see it pass**

Run: `node tests/run.js pipeline`
Expected: 7 PASS, 0 failed.

- [ ] **Step 5: Commit**

```bash
git add js/shop/pipeline.js tests/pipeline.test.js
git commit -m "feat: pipeline engine with run, check and step editing

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Validation and reference pipelines for all 23 templates

**Files:**
- Modify: `js/shop/pipeline.js`
- Create: `tests/fixtures/pipes.js`
- Modify: `tests/pipeline.test.js`

**Interfaces:**
- Consumes: `ShopCore.rng`, `ShopCore.hash`, `ShopCore.helpers`, `ShopCore.answerScore`; `run`, `check` (Task 4); template `gen`/`ins` (Task 2).
- Produces:
  - `ShopPipe.VALIDATE_N = 5`.
  - `ShopPipe.validate(pipe, tpl, seedKey, maxTier) -> { rows: [{ tier, labels: string[], each: number[], off: (number|null)[] }], problems, passed: boolean }`. Row `k` (0..4) uses tier `1 + (k % maxTier)` and seed `ShopCore.hash(seedKey + '|' + k)`. `off` is the absolute percent error (or `null` if no value). `problems` is `check(pipe, tpl.ins, nAnswers, null)` for the first contract; `passed` is `problems.length === 0 && every each === 1`.
  - `tests/fixtures/pipes.js` exports `{ [tplId]: { prim: pipe, domain: pipe } }` for all 23 templates.

- [ ] **Step 1: Write the reference pipelines**

Create `tests/fixtures/pipes.js`:

```js
// Reference pipelines: prim uses only primitive and tool nodes, domain uses earned nodes where they exist.
const S = (node, args) => ({ node, args });
const c = v => ({ c: v });
module.exports = {
  'esc-compound': {
    prim: { steps: [S('add', { a: c(1), b: 'in.rate' }), S('pow', { base: 's0', exp: 'in.years' }), S('mul', { a: 'in.cost', b: 's1' })], outs: ['s2'] },
    domain: { steps: [S('escalate', { cost: 'in.cost', rate: 'in.rate', years: 'in.years' })], outs: ['s0'] }
  },
  'esc-index': {
    prim: { steps: [S('div', { a: 'in.idxBase', b: 'in.idxYear' }), S('mul', { a: 'in.cost', b: 's0' })], outs: ['s1'] },
    domain: { steps: [S('indexConvert', { cost: 'in.cost', fromIdx: 'in.idxYear', toIdx: 'in.idxBase' })], outs: ['s0'] }
  },
  'analogy-scale': {
    prim: { steps: [S('div', { a: 'in.newWt', b: 'in.oldWt' }), S('pow', { base: 's0', exp: 'in.exp' }), S('mul', { a: 'in.cost', b: 's1' }), S('mul', { a: 's2', b: 'in.factor' })], outs: ['s3'] },
    domain: { steps: [S('div', { a: 'in.newWt', b: 'in.oldWt' }), S('powerCER', { a: 'in.cost', x: 's0', b: 'in.exp' }), S('mul', { a: 's1', b: 'in.factor' })], outs: ['s2'] }
  },
  'cer-power': {
    prim: { steps: [S('pow', { base: 'in.weight', exp: 'in.b' }), S('mul', { a: 'in.a', b: 's0' })], outs: ['s1'] },
    domain: { steps: [S('powerCER', { a: 'in.a', x: 'in.weight', b: 'in.b' })], outs: ['s0'] }
  },
  'stats-cv': {
    prim: { steps: [S('mean', { list: 'in.costs' }), S('sub', { a: 'in.costs', b: 's0' }), S('pow', { base: 's1', exp: c(2) }), S('sum', { list: 's2' }),
      S('count', { list: 'in.costs' }), S('sub', { a: 's4', b: c(1) }), S('div', { a: 's3', b: 's5' }), S('sqrt', { x: 's6' }), S('div', { a: 's7', b: 's0' }), S('mul', { a: 's8', b: c(100) })], outs: ['s0', 's9'] },
    domain: { steps: [S('mean', { list: 'in.costs' }), S('cv', { list: 'in.costs' }), S('mul', { a: 's1', b: c(100) })], outs: ['s0', 's2'] }
  },
  'lc-unit': {
    prim: { steps: [S('log2', { x: 'in.slope' }), S('pow', { base: 'in.unit', exp: 's0' }), S('mul', { a: 'in.t1', b: 's1' })], outs: ['s2'] },
    domain: { steps: [S('lcUnit', { t1: 'in.t1', slope: 'in.slope', unit: 'in.unit' })], outs: ['s0'] }
  },
  'lc-lot': {
    prim: { steps: [S('add', { a: 'in.first', b: 'in.qty' }), S('sub', { a: 's0', b: c(1) }), S('range', { from: 'in.first', to: 's1' }), S('log2', { x: 'in.slope' }),
      S('pow', { base: 's2', exp: 's3' }), S('mul', { a: 'in.t1', b: 's4' }), S('sum', { list: 's5' }), S('div', { a: 's6', b: 'in.qty' })], outs: ['s6', 's7'] },
    domain: { steps: [S('add', { a: 'in.first', b: 'in.qty' }), S('sub', { a: 's0', b: c(1) }), S('lcLotTotal', { t1: 'in.t1', slope: 'in.slope', first: 'in.first', last: 's1' }), S('div', { a: 's2', b: 'in.qty' })], outs: ['s2', 's3'] }
  },
  'lc-slope': {
    prim: { steps: [S('div', { a: 'in.hours2', b: 'in.hours1' }), S('log', { x: 's0' }), S('div', { a: 'in.unit2', b: 'in.unit1' }), S('log', { x: 's2' }),
      S('div', { a: 's1', b: 's3' }), S('pow', { base: c(2), exp: 's4' }), S('mul', { a: 's5', b: c(100) })], outs: ['s6'] },
    domain: { steps: [S('lcSlope', { unit1: 'in.unit1', hours1: 'in.hours1', unit2: 'in.unit2', hours2: 'in.hours2' }), S('mul', { a: 's0', b: c(100) })], outs: ['s1'] }
  },
  'reg-fit': {
    prim: { steps: [S('mean', { list: 'in.xs' }), S('mean', { list: 'in.ys' }), S('sub', { a: 'in.xs', b: 's0' }), S('sub', { a: 'in.ys', b: 's1' }),
      S('mul', { a: 's2', b: 's3' }), S('sum', { list: 's4' }), S('pow', { base: 's2', exp: c(2) }), S('sum', { list: 's6' }), S('div', { a: 's5', b: 's7' }),
      S('mul', { a: 's8', b: 's0' }), S('sub', { a: 's1', b: 's9' }), S('mul', { a: 's8', b: 'in.xNew' }), S('add', { a: 's10', b: 's11' })], outs: ['s8', 's12'] },
    domain: { steps: [S('linSlope', { xs: 'in.xs', ys: 'in.ys' }), S('linIntercept', { xs: 'in.xs', ys: 'in.ys' }), S('mul', { a: 's0', b: 'in.xNew' }), S('add', { a: 's1', b: 's2' })], outs: ['s0', 's3'] }
  },
  'tri-stats': {
    prim: { steps: [S('add', { a: 'in.low', b: 'in.mode' }), S('add', { a: 's0', b: 'in.high' }), S('div', { a: 's1', b: c(3) }),
      S('pow', { base: 'in.low', exp: c(2) }), S('pow', { base: 'in.mode', exp: c(2) }), S('pow', { base: 'in.high', exp: c(2) }), S('add', { a: 's3', b: 's4' }), S('add', { a: 's6', b: 's5' }),
      S('mul', { a: 'in.low', b: 'in.mode' }), S('mul', { a: 'in.low', b: 'in.high' }), S('mul', { a: 'in.mode', b: 'in.high' }),
      S('sub', { a: 's7', b: 's8' }), S('sub', { a: 's11', b: 's9' }), S('sub', { a: 's12', b: 's10' }), S('div', { a: 's13', b: c(18) }), S('sqrt', { x: 's14' })], outs: ['s2', 's15'] },
    domain: { steps: [S('triMean', { low: 'in.low', mode: 'in.mode', high: 'in.high' }), S('triSD', { low: 'in.low', mode: 'in.mode', high: 'in.high' })], outs: ['s0', 's1'] }
  },
  'risk-sum': {
    prim: { steps: [S('sum', { list: 'in.means' }), S('sum', { list: 'in.sds' }), S('pow', { base: 'in.sds', exp: c(2) }), S('sum', { list: 's2' }), S('sqrt', { x: 's3' }),
      S('if', { flag: 'in.correlated', then: 's1', else: 's4' })], outs: ['s0', 's5'] },
    domain: { steps: [S('sum', { list: 'in.means' }), S('sum', { list: 'in.sds' }), S('rss', { list: 'in.sds' }), S('if', { flag: 'in.correlated', then: 's1', else: 's2' })], outs: ['s0', 's3'] }
  },
  'normal-prob': {
    prim: { steps: [S('sub', { a: 'in.budget', b: 'in.mean' }), S('div', { a: 's0', b: 'in.sd' }), S('normalCDF', { z: 's1' }), S('mul', { a: 's2', b: c(100) })], outs: ['s3'] },
    domain: { steps: [S('sub', { a: 'in.budget', b: 'in.mean' }), S('div', { a: 's0', b: 'in.sd' }), S('normalCDF', { z: 's1' }), S('mul', { a: 's2', b: c(100) })], outs: ['s3'] }
  },
  'expected-value': {
    prim: { steps: [S('mul', { a: 'in.probs', b: 'in.costs' }), S('sum', { list: 's0' })], outs: ['s1'] },
    domain: { steps: [S('expectedValue', { probs: 'in.probs', values: 'in.costs' })], outs: ['s0'] }
  },
  'mfg-labor': {
    prim: { steps: [S('mul', { a: 'in.stdHours', b: 'in.qty' }), S('mul', { a: 's0', b: 'in.realization' }), S('mul', { a: 's1', b: 'in.rate' }), S('div', { a: 's2', b: c(1000) })], outs: ['s1', 's3'] },
    domain: { steps: [S('mul', { a: 'in.stdHours', b: 'in.qty' }), S('mul', { a: 's0', b: 'in.realization' }), S('mul', { a: 's1', b: 'in.rate' }), S('div', { a: 's2', b: c(1000) })], outs: ['s1', 's3'] }
  },
  'make-buy': {
    prim: { steps: [S('mul', { a: 'in.tooling', b: c(1000) }), S('sub', { a: 'in.buyUnit', b: 'in.makeUnit' }), S('div', { a: 's0', b: 's1' })], outs: ['s2'] },
    domain: { steps: [S('mul', { a: 'in.tooling', b: c(1000) }), S('breakEven', { fixed: 's0', makeUnit: 'in.makeUnit', buyUnit: 'in.buyUnit' })], outs: ['s1'] }
  },
  'sw-effort': {
    prim: { steps: [S('pow', { base: 'in.ksloc', exp: 'in.b' }), S('mul', { a: 'in.a', b: 's0' }), S('mul', { a: 's1', b: 'in.rate' }), S('div', { a: 's2', b: c(1000) })], outs: ['s1', 's3'] },
    domain: { steps: [S('powerCER', { a: 'in.a', x: 'in.ksloc', b: 'in.b' }), S('mul', { a: 's0', b: 'in.rate' }), S('div', { a: 's1', b: c(1000) })], outs: ['s0', 's2'] }
  },
  'npv': {
    prim: { steps: [S('count', { list: 'in.flows' }), S('range', { from: c(1), to: 's0' }), S('add', { a: c(1), b: 'in.rate' }), S('pow', { base: 's2', exp: 's1' }),
      S('div', { a: 'in.flows', b: 's3' }), S('sum', { list: 's4' }), S('sub', { a: 's5', b: 'in.invest' })], outs: ['s6'] },
    domain: { steps: [S('npv', { invest: 'in.invest', flows: 'in.flows', rate: 'in.rate' })], outs: ['s0'] }
  },
  'pv-annuity': {
    prim: { steps: [S('add', { a: c(1), b: 'in.rate' }), S('sub', { a: c(0), b: 'in.years' }), S('pow', { base: 's0', exp: 's1' }), S('sub', { a: c(1), b: 's2' }),
      S('div', { a: 's3', b: 'in.rate' }), S('mul', { a: 'in.amount', b: 's4' })], outs: ['s5'] },
    domain: { steps: [S('annuityPV', { amount: 'in.amount', years: 'in.years', rate: 'in.rate' })], outs: ['s0'] }
  },
  'cpif-fee': {
    prim: { steps: [S('sub', { a: 'in.targetCost', b: 'in.actual' }), S('mul', { a: 'in.conShare', b: 's0' }), S('add', { a: 'in.targetFee', b: 's1' }),
      S('max', { a: 's2', b: 'in.minFee' }), S('min', { a: 's3', b: 'in.maxFee' }), S('add', { a: 'in.actual', b: 's4' })], outs: ['s4', 's5'] },
    domain: { steps: [S('cpifFee', { targetFee: 'in.targetFee', targetCost: 'in.targetCost', actual: 'in.actual', conShare: 'in.conShare', minFee: 'in.minFee', maxFee: 'in.maxFee' }),
      S('add', { a: 'in.actual', b: 's0' })], outs: ['s0', 's1'] }
  },
  'fpif-pta': {
    prim: { steps: [S('add', { a: 'in.targetCost', b: 'in.targetProfit' }), S('sub', { a: 'in.ceiling', b: 's0' }), S('div', { a: 's1', b: 'in.govShare' }), S('add', { a: 'in.targetCost', b: 's2' }),
      S('sub', { a: 'in.targetCost', b: 'in.actual' }), S('mul', { a: 'in.conShare', b: 's4' }), S('add', { a: 'in.targetProfit', b: 's5' }), S('add', { a: 'in.actual', b: 's6' }),
      S('min', { a: 'in.ceiling', b: 's7' })], outs: ['s3', 's8'] },
    domain: { steps: [S('fpifPTA', { targetCost: 'in.targetCost', targetProfit: 'in.targetProfit', ceiling: 'in.ceiling', govShare: 'in.govShare' }),
      S('sub', { a: 'in.targetCost', b: 'in.actual' }), S('mul', { a: 'in.conShare', b: 's1' }), S('add', { a: 'in.targetProfit', b: 's2' }), S('add', { a: 'in.actual', b: 's3' }),
      S('min', { a: 'in.ceiling', b: 's4' })], outs: ['s0', 's5'] }
  },
  'evm-eac': {
    prim: { steps: [S('div', { a: 'in.ev', b: 'in.ac' }), S('div', { a: 'in.ev', b: 'in.pv' }), S('div', { a: 'in.bac', b: 's0' }), S('sub', { a: 'in.bac', b: 'in.ev' }),
      S('mul', { a: 's0', b: 's1' }), S('div', { a: 's3', b: 's4' }), S('add', { a: 'in.ac', b: 's5' }), S('if', { flag: 'in.composite', then: 's6', else: 's2' })], outs: ['s0', 's7'] },
    domain: { steps: [S('cpi', { ev: 'in.ev', ac: 'in.ac' }), S('spi', { ev: 'in.ev', pv: 'in.pv' }), S('eacCPI', { bac: 'in.bac', cpi: 's0' }),
      S('eacComposite', { ac: 'in.ac', bac: 'in.bac', ev: 'in.ev', cpi: 's0', spi: 's1' }), S('if', { flag: 'in.composite', then: 's3', else: 's2' })], outs: ['s0', 's4'] }
  },
  'evm-tcpi': {
    prim: { steps: [S('sub', { a: 'in.bac', b: 'in.ev' }), S('sub', { a: 'in.bac', b: 'in.ac' }), S('div', { a: 's0', b: 's1' }), S('div', { a: 'in.ev', b: 'in.ac' }),
      S('div', { a: 'in.bac', b: 's3' }), S('sub', { a: 's4', b: 'in.ac' })], outs: ['s2', 's5'] },
    domain: { steps: [S('tcpi', { bac: 'in.bac', ev: 'in.ev', ac: 'in.ac' }), S('cpi', { ev: 'in.ev', ac: 'in.ac' }), S('eacCPI', { bac: 'in.bac', cpi: 's1' }), S('sub', { a: 's2', b: 'in.ac' })], outs: ['s0', 's3'] }
  },
  'abc-cost': {
    prim: { steps: [S('div', { a: 'in.setupPool', b: 'in.setups' }), S('div', { a: 'in.inspPool', b: 'in.inspections' }), S('mul', { a: 's0', b: 'in.aSetups' }), S('mul', { a: 's1', b: 'in.aInsp' }), S('add', { a: 's2', b: 's3' })], outs: ['s0', 's4'] },
    domain: { steps: [S('abcRate', { pool: 'in.setupPool', drivers: 'in.setups' }), S('abcRate', { pool: 'in.inspPool', drivers: 'in.inspections' }), S('mul', { a: 's0', b: 'in.aSetups' }), S('mul', { a: 's1', b: 'in.aInsp' }), S('add', { a: 's2', b: 's3' })], outs: ['s0', 's4'] }
  }
};
```

- [ ] **Step 2: Write the failing tests**

Add at the top of `tests/pipeline.test.js` (after the existing `require`s):

```js
const T = require('../js/shop/templates.js');
const N = require('../js/shop/nodes.js');
const REF = require('./fixtures/pipes.js');
const Core = require('../js/shop/core.js');
```

Append to the exported array:

```js
  ['every template has reference pipelines; prim ones use no domain nodes', () => {
    assert.deepStrictEqual(Object.keys(REF).sort(), T.map(t => t.id).sort());
    for (const t of T) {
      assert.strictEqual(P.primitivesOnly(REF[t.id].prim), true, t.id);
      assert.ok(REF[t.id].prim.steps.every(s => N.byId(s.node).kind !== 'domain'), t.id);
    }
  }],
  ['every template is solvable from primitives and from domain nodes, across seeds and tiers', () => {
    for (const t of T) for (const kind of ['prim', 'domain']) for (let s = 0; s < 40; s++) {
      const v = P.validate(REF[t.id][kind], t, 'ref|' + t.id + '|' + s, 3);
      assert.deepStrictEqual(v.problems, [], `${t.id} ${kind}`);
      assert.ok(v.passed, `${t.id} ${kind} seed ${s}: ${JSON.stringify(v.rows.map(r => r.off))}`);
    }
  }],
  ['validation spreads tiers and rejects hard-coded answers', () => {
    const t = T.find(x => x.id === 'esc-compound');
    const v = P.validate(REF['esc-compound'].prim, t, 'x', 3);
    assert.deepStrictEqual(v.rows.map(r => r.tier), [1, 2, 3, 1, 2]);
    assert.strictEqual(v.rows.length, P.VALIDATE_N);
    const first = t.gen(Core.helpers(Core.rng(Core.hash('x|0'))), 1).answers[0].value;
    const cheat = { steps: [S('add', { a: { c: first }, b: { c: 0 } })], outs: ['s0'] };
    const cv = P.validate(cheat, t, 'x', 3);
    assert.strictEqual(cv.rows[0].each[0], 1);
    assert.strictEqual(cv.passed, false);
  }],
  ['validation of a pipeline with the wrong answer count fails without throwing', () => {
    const t = T.find(x => x.id === 'tri-stats');
    const v = P.validate(REF['esc-compound'].prim, t, 'x', 1);
    assert.strictEqual(v.passed, false);
    assert.ok(v.problems.length > 0);
    assert.ok(v.rows.every(r => r.each.length === 2));
  }],
```

- [ ] **Step 3: Run to see it fail**

Run: `node tests/run.js pipeline`
Expected: FAIL `every template is solvable...` with `P.validate is not a function`.

- [ ] **Step 4: Implement `validate`**

In `js/shop/pipeline.js`, add after the `N` line:

```js
  const C = typeof module !== 'undefined' && module.exports ? require('./core.js') : root.ShopCore;
  const VALIDATE_N = 5;
```

Add before `const ShopPipe`:

```js
  // Runs the pipeline on VALIDATE_N fresh contracts spread across tiers 1..maxTier. Pass means every answer within 1%.
  function validate(pipe, tpl, seedKey, maxTier) {
    const rows = [];
    let problems = null;
    for (let k = 0; k < VALIDATE_N; k++) {
      const tier = 1 + (k % Math.max(1, maxTier));
      const job = tpl.gen(C.helpers(C.rng(C.hash(seedKey + '|' + k))), tier);
      if (!problems) problems = check(pipe, tpl.ins, job.answers.length, null);
      const res = run(pipe, job.inputs);
      const each = job.answers.map((a, i) => res.outs[i] == null ? -0.3 : C.answerScore(res.outs[i], a.value));
      const off = job.answers.map((a, i) => res.outs[i] == null ? null : Math.abs(res.outs[i] - a.value) / Math.abs(a.value) * 100);
      rows.push({ tier, labels: job.answers.map(a => a.label), each, off });
    }
    return { rows, problems, passed: problems.length === 0 && rows.every(r => r.each.every(x => x === 1)) };
  }
```

Change the export to:

```js
  const ShopPipe = { run, check, removeStep, moveStep, primitivesOnly, pctWarning, validate, VALIDATE_N };
```

- [ ] **Step 5: Run to see it pass**

Run: `node tests/run.js pipeline`
Expected: 11 PASS, 0 failed. If a reference pipeline fails for a template, the fixture is wrong (not the template): compare its steps with that template's formula in `js/shop/templates.js` and fix the fixture.

- [ ] **Step 6: Commit**

```bash
git add js/shop/pipeline.js tests/fixtures/pipes.js tests/pipeline.test.js
git commit -m "feat: pipeline validation with reference pipelines for all templates

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Progress rules (gate, earned nodes, palette, status)

**Files:**
- Modify: `js/shop/pipeline.js`
- Modify: `tests/pipeline.test.js`

**Interfaces:**
- Consumes: `ShopCore.state(d)` (`has(toolId)`), `ShopNodes` lists, `primitivesOnly` (Task 4).
- Produces:
  - `GATE = 3`.
  - `handSolves(d, tplId) -> number`: shop records with `tpl === tplId`, `score === 1`, no `camp`.
  - `earned(d) -> Set<string>`: ids from records with a `node` field.
  - `allowed(d) -> Set<string>`: all primitive ids, tool node ids whose `tool` is owned (`ShopCore.state(d).has`), and earned ids.
  - `record(d, tplId) -> object|undefined`: `d.shop['pipe-' + tplId]`.
  - `status(d, tplId) -> 'locked'|'ready'|'running'`: `running` if the record has `passed: true`; else `ready` if `handSolves >= GATE`; else `locked`.
  - `unlocksFor(pipe, tplId, d) -> string[]`: if `primitivesOnly(pipe)`, the domain node ids with `earnedFrom` including `tplId` and not yet earned; else `[]`.
  - Record shapes written by the UI (Task 7): `pipe-<tplId>`: `{ pipe: tplId, draft: {steps, outs}, steps, outs, stepCount, primitivesOnly, passed, tries, t }` and `node-<id>`: `{ node: id, t }`.

- [ ] **Step 1: Write the failing tests**

Append to `tests/pipeline.test.js`:

```js
  ['gate counts only exact hand solves of that template', () => {
    const d = { shop: {
      a: { tpl: 'lc-unit', score: 1, t: 1 }, b: { tpl: 'lc-unit', score: 0.6, t: 2 }, c: { tpl: 'lc-unit', score: 1, t: 3 },
      e: { tpl: 'npv', score: 1, t: 4 }, f: { camp: 'alpha', score: 1, t: 5 } } };
    assert.strictEqual(P.handSolves(d, 'lc-unit'), 2);
    assert.strictEqual(P.status(d, 'lc-unit'), 'locked');
    d.shop.g = { tpl: 'lc-unit', score: 1, t: 6 };
    assert.strictEqual(P.status(d, 'lc-unit'), 'ready');
    d.shop['pipe-lc-unit'] = { pipe: 'lc-unit', passed: true, t: 7 };
    assert.strictEqual(P.status(d, 'lc-unit'), 'running');
    assert.strictEqual(P.status({ shop: { 'pipe-npv': { pipe: 'npv', passed: true } } }, 'npv'), 'running');
  }],
  ['allowed nodes: primitives, owned tool nodes, earned domain nodes', () => {
    const base = P.allowed({ shop: {} });
    assert.ok(base.has('add') && base.has('range') && !base.has('normalCDF') && !base.has('escalate'));
    const d = { shop: { x: { tool: 'tables', cost: 150, t: 1 }, y: { node: 'escalate', t: 2 } } };
    const a = P.allowed(d);
    assert.ok(a.has('normalCDF') && a.has('escalate') && !a.has('npv'));
    assert.deepStrictEqual([...P.earned(d)], ['escalate']);
  }],
  ['unlocksFor: only primitives-only pipelines earn, never twice', () => {
    assert.deepStrictEqual(P.unlocksFor(REF['evm-eac'].prim, 'evm-eac', { shop: {} }).sort(), ['cpi', 'eacCPI', 'eacComposite', 'spi']);
    assert.deepStrictEqual(P.unlocksFor(REF['evm-eac'].domain, 'evm-eac', { shop: {} }), []);
    assert.deepStrictEqual(P.unlocksFor(REF['evm-eac'].prim, 'evm-eac', { shop: { n: { node: 'cpi' } } }).sort(), ['eacCPI', 'eacComposite', 'spi']);
    assert.deepStrictEqual(P.unlocksFor(REF['mfg-labor'].prim, 'mfg-labor', { shop: {} }), []);
  }],
  ['pipe and node records do not count as jobs or change cash', () => {
    const d = { shop: { a: { tpl: 'x', pay: 60, rep: 1, score: 1, t: 1 }, 'pipe-x': { pipe: 'x', passed: true, steps: [], outs: [], t: 2 }, 'node-escalate': { node: 'escalate', t: 3 } } };
    const st = Core.state(d);
    assert.strictEqual(st.completed, 1);
    assert.strictEqual(st.cash, 60);
  }],
  ['pipe records merge newest-wins; node records union across devices', () => {
    const fs = require('fs'), path = require('path'), vm = require('vm');
    const ctx = { console, Date, Math, JSON, Object, Set, Array, Promise, setTimeout, clearTimeout,
      localStorage: { getItem: () => null, setItem() {}, removeItem() {} }, location: { protocol: 'file:' }, document: { addEventListener() {} } };
    ctx.window = ctx; vm.createContext(ctx);
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js/storage.js'), 'utf8') + '\nthis.Store = Store;', ctx);
    const a = { shop: { 'pipe-npv': { pipe: 'npv', passed: false, mod: 5 }, 'node-cpi': { node: 'cpi', mod: 1 } } };
    const b = { shop: { 'pipe-npv': { pipe: 'npv', passed: true, mod: 9 }, 'node-npv': { node: 'npv', mod: 2 } } };
    const m = ctx.Store.merge(a, b);
    assert.strictEqual(m.shop['pipe-npv'].passed, true);
    assert.deepStrictEqual([...P.earned(m)].sort(), ['cpi', 'npv']);
  }],
```

- [ ] **Step 2: Run to see it fail**

Run: `node tests/run.js pipeline`
Expected: FAIL `gate counts only exact hand solves...` with `P.handSolves is not a function`.

- [ ] **Step 3: Implement the progress rules**

In `js/shop/pipeline.js`, add before `const ShopPipe`:

```js
  const GATE = 3;
  const recs = d => Object.values((d && d.shop) || {}).filter(r => r && typeof r === 'object');
  const handSolves = (d, id) => recs(d).filter(r => r.tpl === id && r.score === 1 && !r.camp).length;
  const earned = d => new Set(recs(d).filter(r => typeof r.node === 'string').map(r => r.node));
  function allowed(d) {
    const st = C.state(d), out = earned(d);
    N.PRIMITIVE.forEach(n => out.add(n.id));
    N.TOOL.forEach(n => { if (st.has(n.tool)) out.add(n.id); });
    return out;
  }
  const record = (d, id) => ((d && d.shop) || {})['pipe-' + id];
  function status(d, id) {
    const r = record(d, id);
    if (r && r.passed) return 'running';
    return handSolves(d, id) >= GATE ? 'ready' : 'locked';
  }
  function unlocksFor(pipe, id, d) {
    if (!primitivesOnly(pipe)) return [];
    const have = earned(d);
    return N.DOMAIN.filter(n => n.earnedFrom.includes(id) && !have.has(n.id)).map(n => n.id);
  }
```

Change the export to:

```js
  const ShopPipe = { run, check, removeStep, moveStep, primitivesOnly, pctWarning, validate, VALIDATE_N, GATE, handSolves, earned, allowed, record, status, unlocksFor };
```

- [ ] **Step 4: Run to see it pass, then the full suite**

Run: `node tests/run.js pipeline` (expected: 16 PASS, 0 failed), then `npm test` (expected: `0 failed`).

- [ ] **Step 5: Commit**

```bash
git add js/shop/pipeline.js tests/pipeline.test.js
git commit -m "feat: workshop progress rules (gate, earned nodes, status)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Workshop panel and pipeline builder UI

**Files:**
- Create: `js/shop/workshop.js`
- Modify: `js/shop/ui.js` (route + board panel)
- Modify: `index.html` (script tags)
- Modify: `css/styles.css` (append workshop styles)

**Interfaces:**
- Consumes: `ShopCore` (`state`, `unlocked`, `hash`, `rng`, `helpers`, `answerScore`), `ShopNodes`, `ShopPipe` (all of Tasks 4-6), `ShopTemplates`, `Store` (`data`, `profile`, `save`, `markActive`), `Hud` (`catalog`, `toast`), `PCEA.module`, `Render.md` (not needed; briefs are not shown in the builder).
- Produces: global `ShopWorkshop = { panel(d, open) -> string, route(root, tplId) }`.

This task is UI. It has no automated tests; it is verified manually in Step 6.

- [ ] **Step 1: Load the new scripts**

In `index.html`, after `<script src="js/shop/campaign.js"></script>` add:

```html
<script src="js/shop/nodes.js"></script>
<script src="js/shop/pipeline.js"></script>
```

and before `<script src="js/shop/ui.js"></script>` add:

```html
<script src="js/shop/workshop.js"></script>
```

- [ ] **Step 2: Create `js/shop/workshop.js`**

```js
// Workshop: automate a mastered contract type by wiring a pipeline of nodes.
const ShopWorkshop = (() => {
  const C = ShopCore, P = ShopPipe, N = ShopNodes;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = v => Array.isArray(v) ? '[' + v.slice(0, 6).map(fmt).join(', ') + (v.length > 6 ? ', ...' : '') + ']'
    : (+(+v).toPrecision(6)).toLocaleString('en-US', { maximumFractionDigits: 4 });
  const fmtIn = (v, unit) => unit === '%' && !Array.isArray(v) ? fmt(v * 100) + '%' : fmt(v);
  const BAND = x => x === 1 ? ['good', 'Within 1%'] : x === 0.6 ? ['mid', 'Within 5%'] : x === 0.2 ? ['mid', 'Within 10%'] : ['bad', 'Off by more than 10%'];
  const STATUS = { locked: 'Locked', ready: 'Ready to automate', running: 'Running' };
  const empty = n => ({ steps: [], outs: Array(n).fill(null) });

  function panel(d, open) {
    const tpls = ShopTemplates.filter(t => open.has(t.module));
    if (!tpls.length) return '';
    return `<h2>Workshop</h2>
      <p class="muted">Solve a contract type exactly (within 1%) ${P.GATE} times, then automate it. Build it from basic blocks the first time to earn a reusable block.</p>
      <div class="wk-list">${tpls.map(t => {
        const s = P.status(d, t.id), n = P.handSolves(d, t.id);
        const note = s === 'locked' ? `${Math.min(n, P.GATE)}/${P.GATE} exact solves` : STATUS[s];
        return s === 'locked' ? `<div class="wk-item locked"><b>${esc(t.title)}</b><span class="muted small">${note}</span></div>`
          : `<a class="wk-item ${s}" href="#/shop/pipe/${t.id}"><b>${esc(t.title)}</b><span class="chip ${s}">${note}</span></a>`;
      }).join('')}</div>`;
  }

  function route(root, id) {
    const tpl = ShopTemplates.find(t => t.id === id);
    if (!tpl || P.status(Store.data, id) === 'locked') { location.hash = '#/shop'; return; }
    let roll = 0, result = null;
    const sample = () => tpl.gen(C.helpers(C.rng(C.hash(Store.profile.toLowerCase() + '|' + id + '|sample|' + roll))), 1);
    let job = sample();
    const rec = () => P.record(Store.data, id) || {};
    let pipe = JSON.parse(JSON.stringify(rec().draft || (rec().steps ? { steps: rec().steps, outs: rec().outs } : empty(job.answers.length))));
    const [m, s] = tpl.section.split('/');

    function saveDraft() {
      Store.data.shop['pipe-' + id] = Object.assign({}, rec(), { pipe: id, draft: pipe, t: Date.now() });
      Store.save();
    }
    function refOptions(i, cur) {
      const key = cur && typeof cur === 'object' ? 'c' : (cur || '');
      const run = P.run(pipe, job.inputs);
      const opt = (v, label) => `<option value="${v}" ${v === key ? 'selected' : ''}>${esc(label)}</option>`;
      return opt('', 'choose...')
        + `<optgroup label="Contract inputs">${Object.entries(tpl.ins).map(([k, meta]) => opt('in.' + k, `${meta.label} = ${fmtIn(job.inputs[k], meta.unit)}`)).join('')}</optgroup>`
        + (i > 0 ? `<optgroup label="Earlier steps">${pipe.steps.slice(0, i).map((st, j) => opt('s' + j, `Step ${j + 1}: ${(N.byId(st.node) || {}).label || '?'}${run.errs[j] ? '' : ' = ' + fmt(run.vals[j])}`)).join('')}</optgroup>` : '')
        + opt('c', 'Constant...');
    }
    function nodeOptions(cur) {
      const ok = P.allowed(Store.data);
      const grp = (label, list) => { const l = list.filter(n => ok.has(n.id)); return l.length ? `<optgroup label="${label}">${l.map(n => `<option value="${n.id}" ${n.id === cur ? 'selected' : ''}>${esc(n.label)}</option>`).join('')}</optgroup>` : ''; };
      return (cur ? '' : '<option value="">choose a block...</option>') + grp('Basic blocks', N.PRIMITIVE) + grp('Earned blocks', N.DOMAIN) + grp('Tools', N.TOOL);
    }

    function render() {
      const run = P.run(pipe, job.inputs), probs = P.check(pipe, tpl.ins, job.answers.length, P.allowed(Store.data));
      const bad = (i, port) => probs.find(x => x.step === i && x.port === port);
      root.innerHTML = `<div class="shop wk"><a href="#/shop" class="muted small">&larr; Contract board</a>
        <h1>${esc(tpl.title)}</h1>
        <p class="muted">Wire blocks so the outputs answer any contract of this type. <a href="#/learn/${m}/${s}">Review the lesson</a></p>
        <section class="wk-inputs"><h3>Sample contract inputs</h3>
          <dl>${Object.entries(tpl.ins).map(([k, meta]) => `<div><dt>${esc(meta.label)}</dt><dd>${esc(fmtIn(job.inputs[k], meta.unit))} <span class="muted small">${esc(meta.unit === 'flag' ? '' : meta.unit)}</span></dd></div>`).join('')}</dl>
          <button class="btn ghost small" id="reroll">New sample</button></section>
        <section class="wk-chain">${pipe.steps.map((st, i) => {
          const node = N.byId(st.node), err = run.errs[i], nodeBad = bad(i, null);
          return `<div class="wk-step ${err || nodeBad ? 'err' : ''}" data-i="${i}">
            <div class="wk-step-head"><span class="muted small">Step ${i + 1}</span>
              <span class="wk-ctl"><button data-mv="-1" aria-label="Move up">&uarr;</button><button data-mv="1" aria-label="Move down">&darr;</button><button data-del aria-label="Delete">&times;</button></span></div>
            <select class="wk-node">${nodeOptions(st.node)}</select>
            ${node ? `<span class="muted small">${esc(node.hint)}</span>` : ''}
            ${nodeBad ? `<span class="wk-msg">${esc(nodeBad.msg)}</span>` : ''}
            ${(node ? node.ins : []).map(p => {
              const cur = (st.args || {})[p.name], pb = bad(i, p.name), warn = P.pctWarning(pipe, i, p.name, tpl.ins);
              return `<label class="wk-port ${pb ? 'err' : ''}"><span>${esc(p.name)}</span>
                <select data-port="${p.name}">${refOptions(i, cur)}</select>
                ${cur && typeof cur === 'object' ? `<input type="number" step="any" data-const="${p.name}" value="${cur.c}">` : ''}
                ${pb ? `<em class="wk-msg">${esc(pb.msg)}</em>` : warn ? `<em class="wk-warn">${esc(warn)}</em>` : ''}</label>`;
            }).join('')}
            <div class="wk-val">${err && !nodeBad ? `<span class="wk-msg">${esc(err)}</span>` : node ? '= ' + esc(fmt(run.vals[i])) : ''}</div></div>`;
        }).join('')}<button class="btn ghost wk-add" id="add">+ Add block</button></section>
        <section class="wk-outs"><h3>Answers</h3>${job.answers.map((a, k) => {
          const pb = probs.find(x => x.port === 'out' + k), cur = pipe.outs[k] || '';
          return `<label class="wk-port ${pb ? 'err' : ''}"><span>${esc(a.label)} <span class="muted small">${esc(a.unit)}</span></span>
            <select data-out="${k}"><option value="">choose a step...</option>${pipe.steps.map((st, j) => `<option value="s${j}" ${cur === 's' + j ? 'selected' : ''}>Step ${j + 1}${run.errs[j] ? '' : ' = ' + esc(fmt(run.vals[j]))}</option>`).join('')}</select></label>`;
        }).join('')}</section>
        <div class="row-btns"><button class="btn" id="test">Test on ${P.VALIDATE_N} contracts</button></div>
        <div class="wk-result">${result || ''}</div></div>`;
      wire();
    }

    function edit(f) { f(); result = null; saveDraft(); render(); }
    function wire() {
      root.querySelector('#reroll').onclick = () => { roll++; job = sample(); render(); };
      root.querySelector('#add').onclick = () => edit(() => pipe.steps.push({ node: '', args: {} }));
      root.querySelectorAll('.wk-step').forEach(card => {
        const i = +card.dataset.i;
        card.querySelector('.wk-node').onchange = e => edit(() => { pipe.steps[i] = { node: e.target.value, args: {} }; });
        card.querySelectorAll('[data-port]').forEach(sel => sel.onchange = () => edit(() => {
          pipe.steps[i].args = pipe.steps[i].args || {};
          pipe.steps[i].args[sel.dataset.port] = sel.value === 'c' ? { c: 0 } : sel.value;
        }));
        card.querySelectorAll('[data-const]').forEach(inp => inp.onchange = () => edit(() => {
          const v = parseFloat(inp.value);
          pipe.steps[i].args[inp.dataset.const] = { c: Number.isFinite(v) ? v : 0 };
        }));
        card.querySelectorAll('[data-mv]').forEach(b => b.onclick = () => edit(() => { pipe = P.moveStep(pipe, i, +b.dataset.mv); }));
        card.querySelector('[data-del]').onclick = () => edit(() => { pipe = P.removeStep(pipe, i); });
      });
      root.querySelectorAll('[data-out]').forEach(sel => sel.onchange = () => edit(() => { pipe.outs[+sel.dataset.out] = sel.value || null; }));
      root.querySelector('#test').onclick = test;
    }

    function test() {
      const probs = P.check(pipe, tpl.ins, job.answers.length, P.allowed(Store.data));
      if (probs.length) { result = `<p class="wk-msg">Fix the highlighted slots first (${probs.length} problem${probs.length > 1 ? 's' : ''}).</p>`; render(); return; }
      const tries = (rec().tries || 0) + 1, st = C.state(Store.data);
      const v = P.validate(pipe, tpl, Store.profile.toLowerCase() + '|' + id + '|' + tries, st.maxTier);
      const unlocks = v.passed ? P.unlocksFor(pipe, id, Store.data) : [];
      const base = Object.assign({}, rec(), { pipe: id, draft: pipe, tries, t: Date.now() });
      Store.data.shop['pipe-' + id] = v.passed
        ? Object.assign(base, { steps: pipe.steps, outs: pipe.outs, stepCount: pipe.steps.length, primitivesOnly: P.primitivesOnly(pipe), passed: true })
        : base;
      unlocks.forEach(n => { Store.data.shop['node-' + n] = { node: n, t: Date.now() }; });
      Store.markActive();
      Store.save();
      result = `<table class="ptable wk-table"><tr><th>Contract</th>${v.rows[0].labels.map(l => `<th>${esc(l)}</th>`).join('')}</tr>
        ${v.rows.map((r, k) => `<tr><td>#${k + 1} <span class="tier">${'I'.repeat(r.tier)}</span></td>${r.each.map((x, i) => { const [cls, txt] = BAND(x); return `<td class="${cls}">${txt}${r.off[i] == null ? '' : ` (${fmt(r.off[i])}% off)`}</td>`; }).join('')}</tr>`).join('')}</table>
        ${v.passed ? `<div class="result-head good"><b>Pipeline running</b><span>${pipe.steps.length} step${pipe.steps.length > 1 ? 's' : ''}</span></div>` : `<p class="muted">Not every answer was within 1%. <a href="#/learn/${m}/${s}">Review the lesson</a> and adjust the wiring.</p>`}`;
      render();
      if (unlocks.length) {
        const chain = root.querySelector('.wk-chain');
        chain.classList.add('collapsing');
        const names = unlocks.map(n => N.byId(n).label).join(', ');
        setTimeout(() => { chain.classList.remove('collapsing'); chain.insertAdjacentHTML('afterbegin', `<div class="wk-earned">New block earned: <b>${esc(names)}</b></div>`); }, 700);
        Hud.toast('New block earned', names);
      }
    }
    render();
  }
  return { panel, route };
})();
```

- [ ] **Step 3: Hook it into the shop**

In `js/shop/ui.js`, in `route`, add as the first line of the function body:

```js
    if (parts[0] === 'pipe') return ShopWorkshop.route(root, parts[1]);
```

In `board()`, insert the panel right before `<h2>Campaign</h2>` in the template string:

```js
      ${ShopWorkshop.panel(Store.data, open)}
```

- [ ] **Step 4: Append workshop styles to `css/styles.css`**

```css
/* ---------- shop workshop ---------- */
.wk-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; margin-bottom: 24px; }
.wk-item { display: flex; flex-direction: column; gap: 6px; padding: 12px 14px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--paper); color: var(--ink); text-decoration: none; }
.wk-item.locked { opacity: .6; }
.wk-item.running { border-color: var(--good); }
.chip { align-self: flex-start; font-size: .78rem; padding: 2px 8px; border-radius: 999px; background: var(--accent-soft); color: var(--accent); }
.chip.running { background: var(--good-soft); color: var(--good); }
.wk-inputs dl { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 8px; margin: 0 0 8px; }
.wk-inputs dt { font-size: .8rem; color: var(--muted); }
.wk-inputs dd { margin: 0; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.wk-chain { display: flex; flex-direction: column; gap: 22px; margin: 16px 0; }
.wk-step { position: relative; display: flex; flex-direction: column; gap: 6px; padding: 12px; border: 1px solid var(--line-2); border-left: 4px solid var(--accent); border-radius: var(--radius); background: var(--paper); box-shadow: var(--shadow); transition: transform .6s, opacity .6s; }
.wk-step:not(:last-of-type)::after { content: '\2193'; position: absolute; left: 50%; bottom: -21px; color: var(--muted); }
.wk-step.err { border-left-color: var(--bad); }
.wk-step-head { display: flex; justify-content: space-between; align-items: center; }
.wk-ctl button { border: 0; background: none; color: var(--muted); font-size: 1rem; cursor: pointer; padding: 2px 6px; }
.wk-port { display: grid; grid-template-columns: 80px 1fr; gap: 4px 8px; align-items: center; font-size: .9rem; }
.wk-port select, .wk-port input, .wk-node { min-width: 0; max-width: 100%; }
.wk-port input { grid-column: 2; }
.wk-port .wk-msg, .wk-port .wk-warn { grid-column: 2; }
.wk-port.err select { border-color: var(--bad); }
.wk-msg { color: var(--bad); font-size: .85rem; font-style: normal; }
.wk-warn { color: var(--mid); font-size: .85rem; font-style: normal; }
.wk-val { font-variant-numeric: tabular-nums; font-weight: 600; overflow-wrap: anywhere; }
.wk-add { align-self: flex-start; }
.wk-outs .wk-port { grid-template-columns: minmax(120px, 1fr) 1fr; margin-bottom: 6px; }
.wk-table td.good { color: var(--good); } .wk-table td.mid { color: var(--mid); } .wk-table td.bad { color: var(--bad); }
.wk-result { overflow-x: auto; }
.wk-earned { padding: 10px 14px; border-radius: var(--radius); background: var(--good-soft); color: var(--good); }
.wk-chain.collapsing .wk-step { transform: scale(.2); opacity: 0; }
@media (min-width: 900px) {
  .wk-chain { flex-direction: row; align-items: flex-start; overflow-x: auto; padding-bottom: 8px; }
  .wk-step { flex: 0 0 240px; }
  .wk-step:not(:last-of-type)::after { content: '\2192'; left: auto; right: -17px; top: 40%; bottom: auto; }
}
```

- [ ] **Step 5: Run the full test suite**

Run: `npm test`
Expected: `0 failed`.

- [ ] **Step 6: Manual verification in the browser**

Start with `npm start` and open the printed URL (or open `index.html` directly). Use a throwaway profile.
1. Solve three `Escalate to then-year dollars` contracts exactly (use the calculator: `cost*(1+rate)^years`). The Workshop panel on `#/shop` shows `1/3`, `2/3`, then `Ready to automate`.
2. Open it. Add blocks: Add(`Constant 1`, rate), Power(Step 1, years), Multiply(cost, Step 2), and bind the answer to Step 3. Each card shows a live value; the last matches a hand calculation.
3. Delete step 1: the Power card's `base` slot turns red with "Not connected", and the answer still points at the Multiply step.
4. Rebuild, then press Test. All 5 rows are green, "Pipeline running" appears, the cards collapse, a toast says "New block earned: Escalate", and the board shows `Running`.
5. Open another ready template: `Escalate` appears under "Earned blocks" in the node picker.
6. Resize to 375px wide: cards stack with down arrows and the page does not scroll sideways. At 1200px wide: cards run left to right with right arrows.
7. Toggle dark mode (existing theme setting): the cards, chips and error colors are all readable.

- [ ] **Step 7: Commit**

```bash
git add js/shop/workshop.js js/shop/ui.js index.html css/styles.css
git commit -m "feat: workshop panel and pipeline builder

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```
