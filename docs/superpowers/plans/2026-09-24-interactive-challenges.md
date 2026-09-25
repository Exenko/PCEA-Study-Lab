# Interactive Challenges Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Brilliant-style guided challenges (target / predict / choose) that drive the lesson widgets, add 4 new widgets and 4 widget upgrades, and author 34 challenges so every one of the 16 modules has an interactive element.

**Architecture:** Pure logic lives in two DOM-free, Node-tested modules: `js/wmath.js` (widget math) and `js/challenge.js` (the challenge syntax and goal checks). `js/widgets.js` gains a per-widget handle (`box.w`) with presets, locks, setters and published outputs, described by the manifest `js/widget-meta.js`. `js/render.js` renders `:::challenge` blocks as `.check` elements, so XP, step gating and sync work unchanged. A headless-browser harness (`tools/challenge-check.html`) proves that every authored challenge can be solved with its widget's own math.

**Tech Stack:** Plain browser JS (no build step), SVG via `js/plot.js`, KaTeX and marked (vendored), Node's built-in test runner (`tests/run.js`), headless Edge or Chrome for the harness.

**Spec:** `docs/superpowers/specs/2026-09-24-interactive-challenges-design.md`

## Global Constraints

- Work in the worktree `F:/GitHub/quizlet_clone-challenges`, branch `feat/interactive-challenges`. Git there needs the flag `-c safe.directory=F:/GitHub/quizlet_clone-challenges` on every command (the drive does not record ownership). Do not change the global git config.
- No new dependencies. Node built-ins only (the user prefers `npm start` and Node over Python).
- Scripts are plain globals in the browser. Pure modules use the UMD tail `if (typeof module !== 'undefined' && module.exports) module.exports = X; else root.X = X;` as in `js/game.js`.
- Content files are `String.raw` templates. They must never contain `${`. Money is written `\$`. Inline math is `$...$`, and every paragraph must have an even count of unescaped `$`.
- Challenge ids are `ctx.key + '#c' + n`, from their own counter. Never use the check counter: positional check ids (`ctx.key + '#' + n`) must not shift.
- In authoring tasks, do not add or remove `+++` step breaks. Put challenges inside existing steps, so saved step positions stay valid.
- A challenge `Q:` prompt must not contain lines that start with `- `, `* `, `> `, `goal:`, `predict:` or `show:`, because those lines are parsed as syntax.
- Every predict answer comes from the widget's output. Numbers in explanations must match the value the harness prints.
- Keep the guide's numbers except the known errata (M8 Seeker fit is 2.50 + 0.585X; M7 LMP uses F-1/2 and L+1/2).
- Style: match the surrounding code. Short lines of the kind already in `widgets.js`, no multi-paragraph comments, no emojis.
- Commits end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Saved progress for existing checks.** A learner's answered `:::check` questions must stay answered after challenges are added to the same section. This is covered by the harness UI test "challenge ids do not shift check ids" (Task 5).
2. **A predict that leaks its answer.** Before the guess, the widget must be unreadable (blurred) and unusable (`inert`, so it can't be tabbed into either). Covered by the harness UI test "predict freezes, records guess, restores" (Task 5).
3. **Percent answers.** Typing `88%` must mean 0.88 for outputs stored as fractions (coverage, CV). Covered by `readNum` unit tests (Task 2) and the harness UI test "predict accepts percent input" (Task 5).
4. **A target that is already solved at its presets.** It would complete the moment the lesson loads. The harness fails any challenge whose goal holds before interaction (Task 5).
5. **Stale widget outputs.** A widget whose published keys drift from the manifest would make goals silently unreachable. The harness mounts every widget and compares its keys with `js/widget-meta.js` (Task 5), and `tests/widgets.test.js` checks that the registry and the manifest match (Task 3).

---

### Task 1: Widget math module

**Files:**
- Create: `js/wmath.js`
- Test: `tests/wmath.test.js`

**Interfaces:**
- Produces `WMath` with: `rng(seed) -> () => number`, `randn(r)`, `mean(a)`, `sd(a)`, `quant(sorted, p)`, `erf`, `Phi(z)`, `triInv(u, a, c, b)`, `ols(xs, ys) -> {n,b0,b1,mx,my,sst,sse,ssr,r2,see,cv,t,F,res,sxx}`, `tcdf(t, df)` (for t >= 0), `bisect(f, lo, hi) -> number|NaN`, `zinv(p)`, `tinv(p, df)`, `pvCost(inv, c, n, r, mid)`, `evmAt(sc, bac, m) -> {pv, ev, ac}` (sc is `'track'`, `'overrun'` or `'late'`), `lockin(x) -> {committed, spent, gap, phase}`, `LOCK_PHASES`, `METHODS`, `PHASES`, `METHOD_WEIGHTS`, `NORM_DATA` (8 records `{kg, y, q, k, rec}`), `normalizeCost(d, {units, infl, qty})`, `ciSim({n, level, method, seed, k, mu, sigma}) -> {intervals, coverage, halfWidth, crit}`, `mcSum(els, rho, N, seed) -> sorted number[]`.

- [ ] **Step 1: Write the failing test** at `tests/wmath.test.js`:

```js
const assert = require('assert');
const M = require('../js/wmath.js');
const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b}`);
const ELS = [{ a: 80, c: 100, b: 150 }, { a: 40, c: 50, b: 80 }, { a: 55, c: 60, b: 95 }, { a: 25, c: 30, b: 45 }];

module.exports = [
  ['rng is deterministic per seed and in [0,1)', () => {
    const a = M.rng(5), b = M.rng(5), c = M.rng(6);
    const xa = [a(), a(), a()];
    assert.deepStrictEqual(xa, [b(), b(), b()]);
    assert.notStrictEqual(xa[0], c());
    xa.forEach(x => assert.ok(x >= 0 && x < 1));
  }],
  ['z and t quantiles', () => {
    near(M.zinv(0.975), 1.95996, 1e-3, 'z');
    near(M.tinv(0.975, 4), 2.7764, 1e-3, 't4');
    near(M.tinv(0.975, 9), 2.2622, 1e-3, 't9');
  }],
  ['bisect finds a root and returns NaN without a sign change', () => {
    near(M.bisect(x => x * x - 2, 0, 2), Math.SQRT2, 1e-9, 'sqrt2');
    assert.ok(Number.isNaN(M.bisect(x => x * x + 1, 0, 2)));
  }],
  ['ols on Seeker data matches the corrected guide fit', () => {
    const r = M.ols([4, 7, 8, 12, 16], [5, 5, 10, 7, 13]);
    near(r.b0, 2.502, 1e-3, 'b0'); near(r.b1, 0.585, 1e-3, 'b1'); near(r.sse, 18.172, 1e-3, 'sse');
  }],
  ['pvCost end-of-year and mid-year', () => {
    near(M.pvCost(100, 10, 2, 0.1, false), 100 + 10 / 1.1 + 10 / 1.21, 1e-9, 'end');
    near(M.pvCost(0, 10, 1, 0.1, true), 10 / Math.sqrt(1.1), 1e-9, 'mid');
  }],
  ['evm overrun scenario first drops below CPI 0.90 at month 14', () => {
    const cpi = m => { const e = M.evmAt('overrun', 1000, m); return e.ev / e.ac; };
    assert.ok(cpi(13) >= 0.9 && cpi(14) < 0.9 && cpi(14) > 0.89);
    const t = M.evmAt('track', 1000, 20);
    near(t.pv, 1000, 1e-9, 'pv at 20');
    assert.strictEqual(t.ev, t.pv);
  }],
  ['lockin curves run 0 to 1 and the gap peaks at the end of design', () => {
    near(M.lockin(0).committed, 0, 1e-12, 'c0');
    near(M.lockin(100).committed, 1, 1e-12, 'c100');
    near(M.lockin(100).spent, 1, 1e-12, 's100');
    let best = 0;
    for (let x = 0; x <= 100; x++) if (M.lockin(x).gap > M.lockin(best).gap) best = x;
    assert.ok(best >= 33 && best <= 38, 'peak at ' + best);
    assert.strictEqual(M.LOCK_PHASES[M.lockin(35).phase], 'Design & development');
    assert.strictEqual(M.LOCK_PHASES[M.lockin(36).phase], 'Production');
  }],
  ['method weights sum to 1 and leaders follow the guide table', () => {
    M.METHOD_WEIGHTS.forEach(w => near(w.reduce((s, x) => s + x, 0), 1, 1e-9, 'sum'));
    assert.deepStrictEqual(M.METHOD_WEIGHTS.map(w => w.indexOf(Math.max(...w))), [0, 1, 1, 2, 3]);
  }],
  ['normalization needs all three adjustments', () => {
    const r2 = o => M.ols(M.NORM_DATA.map(d => d.kg), M.NORM_DATA.map(d => M.normalizeCost(d, o))).r2;
    assert.ok(r2({}) < 0.1);
    assert.ok(r2({ units: 1, infl: 1 }) < 0.99);
    assert.ok(r2({ units: 1, infl: 1, qty: 1 }) > 0.99);
    near(M.normalizeCost(M.NORM_DATA[0], { units: 1, infl: 1 }), 4.31755 * Math.pow(1.025, 12), 1e-9, 'point 1');
  }],
  ['ci coverage: z undercovers at n=5, t does not', () => {
    const c = m => M.ciSim({ n: 5, level: 0.95, method: m, seed: 1, k: 1000, mu: 100, sigma: 15 }).coverage;
    assert.ok(c('z') < 0.92, 'z ' + c('z'));
    assert.ok(c('t') >= 0.94, 't ' + c('t'));
  }],
  ['mcSum is seeded, sorted, and correlation widens P80', () => {
    const s0 = M.mcSum(ELS, 0, 20000, 11), s6 = M.mcSum(ELS, 0.6, 20000, 11);
    assert.deepStrictEqual(s0.slice(0, 5), M.mcSum(ELS, 0, 20000, 11).slice(0, 5));
    for (let i = 1; i < s0.length; i++) assert.ok(s0[i] >= s0[i - 1]);
    assert.ok(M.quant(s6, 0.8) - M.quant(s0, 0.8) >= 10);
  }]
];
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm test -- wmath`
Expected: FAIL with `Cannot find module '../js/wmath.js'`.

- [ ] **Step 3: Implement `js/wmath.js`**

```js
// Pure math for widgets (no DOM). Loaded in the browser as WMath and in Node via require.
(function (root) {
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function randn(r) { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function mean(a) { return a.reduce((s, x) => s + x, 0) / a.length; }
  function sd(a) { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); }
  function quant(sorted, p) {
    const i = (sorted.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i);
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
  }
  function erf(x) {
    const t = 1 / (1 + 0.3275911 * Math.abs(x));
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return x >= 0 ? y : -y;
  }
  const Phi = z => 0.5 * (1 + erf(z / Math.SQRT2));
  function triInv(u, a, c, b) {
    if (b <= a) return a;
    const Fc = (c - a) / (b - a);
    return u < Fc ? a + Math.sqrt(u * (b - a) * (c - a)) : b - Math.sqrt((1 - u) * (b - a) * (b - c));
  }
  function ols(xs, ys) {
    const n = xs.length, mx = mean(xs), my = mean(ys);
    let sxx = 0, sxy = 0, sst = 0;
    for (let i = 0; i < n; i++) { sxx += (xs[i] - mx) ** 2; sxy += (xs[i] - mx) * (ys[i] - my); sst += (ys[i] - my) ** 2; }
    const b1 = sxy / sxx, b0 = my - b1 * mx;
    let sse = 0;
    const res = xs.map((x, i) => { const e = ys[i] - (b0 + b1 * x); sse += e * e; return e; });
    const ssr = sst - sse, df = n - 2, mse = sse / df, see = Math.sqrt(mse), seb1 = see / Math.sqrt(sxx);
    return { n, b0, b1, mx, my, sst, sse, ssr, r2: ssr / sst, see, cv: see / my, t: b1 / seb1, F: ssr / mse, res, sxx };
  }
  function lgamma(z) {
    const g = [676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z);
    z -= 1; let x = 0.99999999999980993;
    for (let i = 0; i < 8; i++) x += g[i] / (z + i + 1);
    const t = z + 7.5;
    return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
  }
  function cf(x, a, b) {
    let c = 1, d = 1 - (a + b) * x / (a + 1); d = 1 / (Math.abs(d) < 1e-30 ? 1e-30 : d); let h = d;
    for (let m = 1; m < 200; m++) {
      const m2 = 2 * m;
      let aa = m * (b - m) * x / ((a + m2 - 1) * (a + m2));
      d = 1 + aa * d; d = 1 / (Math.abs(d) < 1e-30 ? 1e-30 : d); c = 1 + aa / c; h *= d * c;
      aa = -(a + m) * (a + b + m) * x / ((a + m2) * (a + m2 + 1));
      d = 1 + aa * d; d = 1 / (Math.abs(d) < 1e-30 ? 1e-30 : d); c = 1 + aa / c;
      const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-10) break;
    }
    return h;
  }
  function ibeta(x, a, b) {
    if (x <= 0) return 0; if (x >= 1) return 1;
    const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b + lgamma(a + b) - lgamma(a) - lgamma(b));
    if (x < (a + 1) / (a + b + 2)) return front * cf(x, a, b) / a;
    return 1 - front * cf(1 - x, b, a) / b;
  }
  // Student t CDF for t >= 0 (callers pass |t|)
  function tcdf(t, df) { return 1 - 0.5 * ibeta(df / (df + t * t), df / 2, 0.5); }
  // Root of f on [lo, hi]; f(lo) and f(hi) must differ in sign, else NaN.
  function bisect(f, lo, hi, it = 80) {
    let flo = f(lo);
    if (flo === 0) return lo;
    if (flo * f(hi) > 0) return NaN;
    for (let i = 0; i < it; i++) {
      const mid = (lo + hi) / 2, fm = f(mid);
      if (fm === 0) return mid;
      if (fm * flo < 0) hi = mid; else { lo = mid; flo = fm; }
    }
    return (lo + hi) / 2;
  }
  const zinv = p => bisect(z => Phi(z) - p, -10, 10);
  const tinv = (p, df) => bisect(t => tcdf(t, df) - p, 0, 1000);

  // Present value of an investment at t=0 plus n annual costs c
  function pvCost(inv, c, n, r, mid) {
    let s = inv;
    for (let t = 1; t <= n; t++) s += c / Math.pow(1 + r, mid ? t - 0.5 : t);
    return s;
  }

  // EVM scenarios: plan completes at month 20
  const smooth = x => x <= 0 ? 0 : x >= 1 ? 1 : 3 * x * x - 2 * x * x * x;
  function evmAt(sc, bac, m) {
    const pv = bac * smooth(m / 20);
    let ev, ac;
    if (sc === 'track') { ev = pv; ac = pv; }
    else if (sc === 'late') { ev = bac * smooth(m / 24); ac = ev / 1.02; }
    else { ev = pv * 0.97; ac = ev / (1 - 0.0075 * m); }
    return { pv, ev, ac };
  }

  // Locked-in vs spent: x = % of program timeline (0-100). Illustrative curves.
  const LOCK_PHASES = ['Concept', 'Design & development', 'Production', 'Operations & support'];
  function lockin(x) {
    const committed = (1 - Math.exp(-x / 15)) / (1 - Math.exp(-100 / 15));
    const spent = Math.pow(x / 100, 2.2);
    const phase = x <= 10 ? 0 : x <= 35 ? 1 : x <= 60 ? 2 : 3;
    return { committed, spent, gap: committed - spent, phase };
  }

  // Method suitability by life-cycle phase (illustrative weights; order: analogy, parametric, build-up, actuals)
  const METHODS = ['Analogy', 'Parametric', 'Engineering build-up', 'Actuals'];
  const PHASES = ['Concept / MSA', 'Technology development', 'EMD', 'Production & deployment', 'Operations & support'];
  const METHOD_WEIGHTS = [
    [0.55, 0.40, 0.05, 0.00],
    [0.30, 0.55, 0.15, 0.00],
    [0.10, 0.45, 0.40, 0.05],
    [0.00, 0.15, 0.45, 0.40],
    [0.00, 0.25, 0.10, 0.65]
  ];

  // Normalization lab: truth T1 = 2 + 0.05*kg (BY2026 $M), recorded as lot-average TY$ in mixed units
  const NORM_B = Math.log(0.9) / Math.log(2), NORM_BY = 2026, NORM_R = 0.025;
  const NORM_RAW = [
    { kg: 120, y: 2014, q: 10, k: true, f: 1.03 }, { kg: 180, y: 2024, q: 3, k: false, f: 0.97 },
    { kg: 250, y: 2012, q: 25, k: false, f: 1.02 }, { kg: 300, y: 2019, q: 6, k: true, f: 0.99 },
    { kg: 380, y: 2016, q: 15, k: false, f: 1.04 }, { kg: 450, y: 2022, q: 40, k: false, f: 0.96 },
    { kg: 520, y: 2013, q: 4, k: true, f: 1.01 }, { kg: 600, y: 2020, q: 12, k: false, f: 0.98 }
  ];
  const NORM_DATA = NORM_RAW.map(d => {
    const t1 = (2 + 0.05 * d.kg) * d.f;
    const rec = t1 * Math.pow(d.q, NORM_B) / Math.pow(1 + NORM_R, NORM_BY - d.y) * (d.k ? 1000 : 1);
    return { kg: d.kg, y: d.y, q: d.q, k: d.k, rec: Math.round(rec * 100) / 100 };
  });
  function normalizeCost(d, o) {
    let c = d.rec;
    if (o.units && d.k) c /= 1000;
    if (o.infl) c *= Math.pow(1 + NORM_R, NORM_BY - d.y);
    if (o.qty) c /= Math.pow(d.q, NORM_B);
    return c;
  }

  // CI coverage simulation from N(mu, sigma)
  function ciSim(o) {
    const r = rng(o.seed), n = o.n, crit = o.method === 'z' ? zinv(1 - (1 - o.level) / 2) : tinv(1 - (1 - o.level) / 2, n - 1);
    const out = [];
    let hits = 0, hw = 0;
    for (let i = 0; i < o.k; i++) {
      const xs = []; for (let j = 0; j < n; j++) xs.push(o.mu + o.sigma * randn(r));
      const m = mean(xs), h = crit * sd(xs) / Math.sqrt(n), cov = m - h <= o.mu && o.mu <= m + h;
      if (cov) hits++;
      hw += h;
      out.push([m - h, m + h, cov]);
    }
    return { intervals: out, coverage: hits / o.k, halfWidth: hw / o.k, crit };
  }

  // Sum of correlated triangular elements (one-factor Gaussian copula)
  function mcSum(els, rho, N, seed) {
    const r = rng(seed), out = new Float64Array(N);
    for (let t = 0; t < N; t++) {
      const Z = randn(r); let s = 0;
      for (const e of els) {
        const z = Math.sqrt(rho) * Z + Math.sqrt(1 - rho) * randn(r);
        s += triInv(Phi(z), Math.min(e.a, e.c), e.c, Math.max(e.b, e.c));
      }
      out[t] = s;
    }
    return Array.from(out).sort((x, y) => x - y);
  }

  const WMath = { rng, randn, mean, sd, quant, erf, Phi, triInv, ols, tcdf, bisect, zinv, tinv, pvCost, evmAt, lockin, LOCK_PHASES, METHODS, PHASES, METHOD_WEIGHTS, NORM_DATA, normalizeCost, ciSim, mcSum };
  if (typeof module !== 'undefined' && module.exports) module.exports = WMath; else root.WMath = WMath;
})(typeof window !== 'undefined' ? window : this);
```

- [ ] **Step 4: Run the tests**

Run: `npm test -- wmath`
Expected: `11 passed, 0 failed`.

- [ ] **Step 5: Commit**

```bash
git add js/wmath.js tests/wmath.test.js
git commit -m "feat: pure widget math module"
```

---

### Task 2: Challenge syntax module

**Files:**
- Create: `js/challenge.js`
- Test: `tests/challenge.test.js`

**Interfaces:**
- Produces `Challenge` with:
  - `parseKV(str) -> {kv, bad}`
  - `parseArgs(str) -> {name, presets, lock: string[], bad: string[]}`. Numeric-looking values become numbers; others (`ulc`, `1,2,3`) stay strings.
  - `parseTol('1%'|'0.5') -> {v, pct}`, `within(x, target, tol) -> bool`
  - `parseGoal(str) -> {out, op, v, tol}|{error}`, `evalGoal(goal, out) -> bool`, `evalGoals(goals, out) -> bool` (an empty list is false)
  - `parse(lines) -> {type: 'target'|'predict'|'choose'|null, q, goals, predict: {out, tol}|null, opts: [{text, right}], show: {k: v}, explain, errors: string[]}`
  - `readNum(str) -> number` (a trailing `%` divides by 100), `fmt(number) -> string`

- [ ] **Step 1: Write the failing test** at `tests/challenge.test.js`:

```js
const assert = require('assert');
const C = require('../js/challenge.js');

module.exports = [
  ['parseArgs splits name, presets and lock', () => {
    const a = C.parseArgs('lc-explorer t1=100 lcs=0.95 theory=ulc data=1,2,3 lock=theory,log');
    assert.strictEqual(a.name, 'lc-explorer');
    assert.deepStrictEqual(a.presets, { t1: 100, lcs: 0.95, theory: 'ulc', data: '1,2,3' });
    assert.deepStrictEqual(a.lock, ['theory', 'log']);
    assert.deepStrictEqual(a.bad, []);
  }],
  ['parseArgs flags stray tokens, handles empty input and a single lock', () => {
    assert.deepStrictEqual(C.parseArgs('npv oops r=0.03').bad, ['oops']);
    const e = C.parseArgs('');
    assert.strictEqual(e.name, '');
    assert.deepStrictEqual(e.presets, {});
    assert.deepStrictEqual(C.parseArgs('lockin lock=x').lock, ['x']);
  }],
  ['within: percent, absolute, zero target', () => {
    const P = C.parseTol('1%'), A = C.parseTol('0.5'), Z = C.parseTol('0');
    assert.ok(C.within(101, 100, P)); assert.ok(!C.within(101.5, 100, P));
    assert.ok(C.within(-99.2, -100, P));
    assert.ok(C.within(2.4, 2, A)); assert.ok(!C.within(2.6, 2, A));
    assert.ok(C.within(15, 15, Z)); assert.ok(!C.within(15.001, 15, Z));
    assert.ok(!C.within(0.001, 0, P), 'percent of zero is zero');
    assert.ok(!C.within(NaN, 1, A)); assert.ok(!C.within(1, NaN, A));
  }],
  ['goals: operators and AND', () => {
    const c = C.parse(['Q: x', 'goal: a ~ 10 +- 1', 'goal: b < 0.5', 'show: a=10', '> why']);
    assert.deepStrictEqual(c.errors, []);
    assert.strictEqual(c.type, 'target');
    assert.ok(C.evalGoals(c.goals, { a: 10.5, b: 0.2 }));
    assert.ok(!C.evalGoals(c.goals, { a: 10.5, b: 0.5 }));
    assert.ok(!C.evalGoals(c.goals, { a: 12, b: 0.2 }));
    assert.ok(!C.evalGoals(c.goals, { b: 0.2 }), 'missing output fails');
    assert.ok(!C.evalGoals([], { a: 1 }), 'no goals never passes');
    [['>= 3', 3, true], ['> 3', 3, false], ['<= 3', 3, true], ['< 3', 2.9, true], ['> -1', 0, true], ['~ 5 ± 1', 5.9, true]]
      .forEach(([g, x, want]) => assert.strictEqual(C.evalGoal(C.parseGoal('v ' + g), { v: x }), want, g));
  }],
  ['parse: predict, choose, show, explanation continuation', () => {
    const p = C.parse(['Q: guess', 'predict: eac +- 0.5%', '> line one', 'line two']);
    assert.strictEqual(p.type, 'predict');
    assert.deepStrictEqual(p.predict, { out: 'eac', tol: { v: 0.5, pct: true } });
    assert.deepStrictEqual(p.explain, ['line one', 'line two']);
    const ch = C.parse(['Q: pick', '* yes', '- no', '> because']);
    assert.strictEqual(ch.type, 'choose');
    assert.deepStrictEqual(ch.errors, []);
    assert.deepStrictEqual(ch.opts, [{ text: 'yes', right: true }, { text: 'no', right: false }]);
    assert.deepStrictEqual(C.parse(['Q: go', 'goal: x > 1', 'show: x=2 mode=hand', '> ok']).show, { x: 2, mode: 'hand' });
  }],
  ['parse: multi-line question keeps inner blank lines', () => {
    assert.deepStrictEqual(C.parse(['Q: first', '', 'second', '', 'goal: x > 1', 'show: x=2', '> e']).q, ['first', '', 'second']);
  }],
  ['parse errors', () => {
    const errs = lines => C.parse(lines).errors.join(' | ');
    assert.match(errs(['Q: x', '> e']), /needs goal/);
    assert.match(errs(['Q: x', 'goal: a > 1', '> e']), /show/);
    assert.match(errs(['Q: x', 'goal: a > 1', 'predict: a +- 1', 'show: a=2', '> e']), /mixes/);
    assert.match(errs(['Q: x', '* a', '* b', '> e']), /exactly one/);
    assert.match(errs(['Q: x', '* a', '> e']), /wrong/);
    assert.match(errs(['Q: x', 'goal: a ~ 3', 'show: a=3', '> e']), /tolerance/);
    assert.match(errs(['Q: x', 'goal: a => 3', 'show: a=3', '> e']), /bad goal/);
    assert.match(errs(['Q: x', 'predict: a', '> e']), /bad predict/);
    assert.match(errs(['Q: x', 'goal: a > 1', 'show: a=2']), /explanation/);
    assert.match(errs(['goal: a > 1', 'show: a=2', '> e']), /Q:/);
    assert.match(errs(['Q: x', 'goal: a > 1', 'show: a=2', 'stray text', '> e']), /unexpected/);
    assert.match(errs(['Q: x', 'goal: a > 1', 'show: a=2 junk', '> e']), /bad show token/);
  }],
  ['readNum and fmt', () => {
    assert.strictEqual(C.readNum('$1,117.30'), 1117.3);
    assert.strictEqual(C.readNum('88%'), 0.88);
    assert.ok(Math.abs(C.readNum(' 5.7 % ') - 0.057) < 1e-12);
    assert.ok(Number.isNaN(C.readNum('abc')));
    assert.strictEqual(C.fmt(1117.3), '1,117');
    assert.strictEqual(C.fmt(5.80712), '5.807');
    assert.strictEqual(C.fmt(0.0566968), '0.0567');
    assert.strictEqual(C.fmt(NaN), '—');
  }]
];
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm test -- challenge`
Expected: FAIL with `Cannot find module '../js/challenge.js'`.

- [ ] **Step 3: Implement `js/challenge.js`**

```js
// Challenge blocks: parsing and goal evaluation (no DOM). Browser: Challenge; Node: require.
(function (root) {
  const NUM = /^-?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i;
  const val = s => (NUM.test(s) ? parseFloat(s) : s);

  // "k=v k2=v2" -> { kv: {k: v}, bad: [tokens without =] }
  function parseKV(str) {
    const kv = {}, bad = [];
    String(str || '').trim().split(/\s+/).filter(Boolean).forEach(t => {
      const m = t.match(/^([\w-]+)=(.+)$/);
      if (m) kv[m[1]] = val(m[2]); else bad.push(t);
    });
    return { kv, bad };
  }

  // "name k=v ... lock=a,b" -> { name, presets, lock, bad }
  function parseArgs(str) {
    const toks = String(str || '').trim().split(/\s+/).filter(Boolean);
    const name = toks.length && !toks[0].includes('=') ? toks.shift() : '';
    const { kv, bad } = parseKV(toks.join(' '));
    const lock = typeof kv.lock === 'string' ? kv.lock.split(',').filter(Boolean) : kv.lock != null ? [String(kv.lock)] : [];
    delete kv.lock;
    return { name, presets: kv, lock, bad };
  }

  function parseTol(s) {
    const t = String(s).trim();
    return t.endsWith('%') ? { v: parseFloat(t), pct: true } : { v: parseFloat(t), pct: false };
  }

  function within(x, target, tol) {
    if (!isFinite(x) || !isFinite(target)) return false;
    let lim = tol.pct ? Math.abs(target) * tol.v / 100 : tol.v;
    if (lim === 0) lim = 1e-9;
    return Math.abs(x - target) <= lim + 1e-12;
  }

  const GOAL = /^([A-Za-z]\w*)\s*(~|<=|>=|<|>)\s*(-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)\s*(?:(?:\+-|±)\s*(\d+\.?\d*%?))?$/i;
  function parseGoal(s) {
    const m = String(s).trim().match(GOAL);
    if (!m) return { error: 'bad goal: ' + s };
    if (m[2] === '~' && !m[4]) return { error: '~ needs a tolerance: ' + s };
    return { out: m[1], op: m[2], v: parseFloat(m[3]), tol: m[4] ? parseTol(m[4]) : null };
  }

  function evalGoal(g, out) {
    const x = out ? out[g.out] : undefined;
    if (typeof x !== 'number' || !isFinite(x)) return false;
    switch (g.op) {
      case '~': return within(x, g.v, g.tol);
      case '<': return x < g.v;
      case '<=': return x <= g.v;
      case '>': return x > g.v;
      case '>=': return x >= g.v;
    }
    return false;
  }
  const evalGoals = (goals, out) => goals.length > 0 && goals.every(g => evalGoal(g, out));

  function parse(lines) {
    const c = { type: null, q: [], goals: [], predict: null, opts: [], show: {}, explain: [], errors: [] };
    let mode = 'q', m;
    for (const l of lines) {
      if (mode === 'explain') { const e = l.match(/^\s*>\s?(.*)$/); c.explain.push(e ? e[1] : l); continue; }
      if ((m = l.match(/^\s*goal:\s*(.*)$/))) {
        const g = parseGoal(m[1]);
        if (g.error) c.errors.push(g.error); else c.goals.push(g);
        mode = 'body';
      } else if ((m = l.match(/^\s*predict:\s*(.*)$/))) {
        const p = m[1].trim().match(/^([A-Za-z]\w*)\s*(?:\+-|±)\s*(\d+\.?\d*%?)$/);
        if (p) c.predict = { out: p[1], tol: parseTol(p[2]) }; else c.errors.push('bad predict: ' + m[1]);
        mode = 'body';
      } else if ((m = l.match(/^\s*show:\s*(.*)$/))) {
        const kv = parseKV(m[1]);
        kv.bad.forEach(b => c.errors.push('bad show token: ' + b));
        Object.assign(c.show, kv.kv);
        mode = 'body';
      } else if ((m = l.match(/^\s*([-*])\s+(.*)$/))) {
        c.opts.push({ text: m[2], right: m[1] === '*' });
        mode = 'body';
      } else if ((m = l.match(/^\s*>\s?(.*)$/))) {
        c.explain.push(m[1]);
        mode = 'explain';
      } else if (mode === 'q') c.q.push(l.replace(/^\s*Q:\s?/, ''));
      else if (l.trim()) c.errors.push('unexpected line: ' + l.trim());
    }
    while (c.q.length && !c.q[c.q.length - 1].trim()) c.q.pop();
    const kinds = [c.goals.length && 'target', c.predict && 'predict', c.opts.length && 'choose'].filter(Boolean);
    if (kinds.length > 1) c.errors.push('mixes types: ' + kinds.join(', '));
    else if (!kinds.length && !c.errors.length) c.errors.push('needs goal:, predict: or options');
    c.type = kinds.length === 1 ? kinds[0] : null;
    if (c.type === 'target' && !Object.keys(c.show).length) c.errors.push('target needs show:');
    if (c.type === 'choose') {
      if (c.opts.filter(o => o.right).length !== 1) c.errors.push('choose needs exactly one * option');
      if (!c.opts.some(o => !o.right)) c.errors.push('choose needs a wrong (-) option');
    }
    if (!c.q.join('').trim()) c.errors.push('missing Q: prompt');
    if (!c.explain.length) c.errors.push('missing > explanation');
    return c;
  }

  // Learner input -> number. "$1,117" -> 1117; "88%" -> 0.88
  function readNum(s) {
    const t = String(s).trim();
    const x = parseFloat(t.replace(/[$,%\s]/g, ''));
    return /%$/.test(t) ? x / 100 : x;
  }
  function fmt(v) {
    if (!isFinite(v)) return '—';
    return Math.abs(v) >= 1000 ? Math.round(v).toLocaleString('en-US') : String(+v.toPrecision(4));
  }

  const Challenge = { parseKV, parseArgs, parseTol, within, parseGoal, evalGoal, evalGoals, parse, readNum, fmt };
  if (typeof module !== 'undefined' && module.exports) module.exports = Challenge; else root.Challenge = Challenge;
})(typeof window !== 'undefined' ? window : this);
```

- [ ] **Step 4: Run the tests**

Run: `npm test -- challenge`
Expected: `8 passed, 0 failed`.

- [ ] **Step 5: Commit**

```bash
git add js/challenge.js tests/challenge.test.js
git commit -m "feat: challenge block parser and goal evaluation"
```

---

### Task 3: Widget handle, manifest, and publishing outputs

This task gives every widget presets, locks, setters and published outputs, and switches widget math to `WMath`. Nothing changes visually, except that `transform` noise and `montecarlo` draws become seeded (reproducible).

**Files:**
- Create: `js/widget-meta.js`
- Modify: `js/widgets.js` (header helpers at lines 1-91, every `reg[...]` function)
- Modify: `js/render.js` (`buildWidget`, lines 190-197)
- Modify: `index.html` (script tags before `js/render.js`, line 54)
- Modify: `tools/validate.js` (widget list and widget argument checks)
- Test: `tests/widgets.test.js`

**Interfaces:**
- Consumes `WMath` (Task 1) and `Challenge.parseArgs` (Task 2).
- Produces:
  - `Widgets.mount(box, argString) -> w`, where `w = { name, presets, lock: Set, out, setters: {k: fn}, set(k, v), setMany(obj), onUpdate(fn), emit(out) }`, stored as `box.w`.
  - Inside `widgets.js`: `publish(box, outs)` and `preset(box, key, fallback)`.
  - `WidgetMeta[name] = { controls: string[], setters: string[], outputs: string[] }`.

- [ ] **Step 1: Write the failing test** at `tests/widgets.test.js`:

```js
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const Meta = require('../js/widget-meta.js');

function loadWidgets() {
  const ctx = { Render: { el: () => ({}), inline: s => s }, Plot: {}, WMath: require('../js/wmath.js'), Challenge: require('../js/challenge.js'), console };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/widgets.js'), 'utf8') + '\nthis.Widgets = Widgets;', ctx);
  return ctx.Widgets;
}

module.exports = [
  ['manifest lists exactly the registered widgets', () => {
    assert.deepStrictEqual(loadWidgets().names().slice().sort(), Object.keys(Meta).sort());
  }],
  ['manifest entries are well formed', () => {
    for (const [name, m] of Object.entries(Meta)) {
      ['controls', 'setters', 'outputs'].forEach(k => assert.ok(Array.isArray(m[k]), `${name}.${k}`));
      m.setters.forEach(s => assert.ok(!m.controls.includes(s), `${name}: ${s} is both control and setter`));
      assert.strictEqual(new Set(m.outputs).size, m.outputs.length, `${name}: duplicate outputs`);
    }
  }]
];
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm test -- widgets`
Expected: FAIL with `Cannot find module '../js/widget-meta.js'`.

- [ ] **Step 3: Create `js/widget-meta.js`**

```js
// Widget manifest: controls (settable sliders/selects), setters (other settable state), outputs (published values).
(function (root) {
  const WidgetMeta = {
    'stats-lab': { controls: [], setters: ['data'], outputs: ['n', 'mean', 'median', 'sd', 'cv', 'beyond2'] },
    'transform': { controls: ['f', 'a', 'b'], setters: [], outputs: ['r2', 'slope', 'intercept'] },
    'lc-explorer': { controls: ['theory', 't1', 'lcs', 'n', 'log'], setters: [], outputs: ['b', 'unitN', 'cavN', 'totalN'] },
    'lmp': { controls: ['F', 'L', 'lcs'], setters: [], outputs: ['ari', 'geo', 'heur', 'half', 'exact'] },
    'regression': { controls: [], setters: ['data'], outputs: ['n', 'b0', 'b1', 'r2', 'see', 'cv', 't', 'p', 'sse'] },
    'escalation': { controls: ['r', 'o1', 'o2', 'o3', 'amt'], setters: [], outputs: ['raw1', 'wtdBY', 'tyBY'] },
    'montecarlo': { controls: ['rho', 'n'], setters: [], outputs: ['pe', 'pePct', 'mean', 'sd', 'p50', 'p70', 'p80'] },
    'dist': { controls: ['d', 'p1', 'p2', 'p3'], setters: [], outputs: ['mean', 'median', 'mode', 'sd'] },
    'npv': { controls: ['r', 'ia', 'ca', 'ib', 'cb', 'n', 'mid'], setters: [], outputs: ['pvA', 'pvB', 'diff', 'sir'] },
    'fpif': { controls: ['tc', 'tp', 'cp', 'gs', 'ac'], setters: [], outputs: ['tpPrice', 'pta', 'ac', 'profit', 'price'] },
    'cpif': { controls: ['tc', 'tf', 'mn', 'mx', 'gs', 'ac'], setters: [], outputs: ['rieLo', 'rieHi', 'fee', 'price'] },
    'evm': { controls: ['bac', 'pv', 'ev', 'ac'], setters: [], outputs: ['cv', 'sv', 'cpi', 'spi', 'eac', 'tcpi', 'vac'] },
    'burden': { controls: ['dl', 'oh', 'ga', 'fee', 'hrs'], setters: [], outputs: ['cost', 'wrap', 'multiple', 'price'] },
    'sw-effort': { controls: ['A', 'E', 's'], setters: [], outputs: ['effort', 'prod', 'doubleX'] },
    'analogy': { controls: ['c0', 's0', 's1', 'b', 'cx'], setters: [], outputs: ['ratio', 'sized', 'est', 'linear'] },
    'trl': { controls: [], setters: [], outputs: [] }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = WidgetMeta; else root.WidgetMeta = WidgetMeta;
})(typeof window !== 'undefined' ? window : this);
```

- [ ] **Step 4: Replace the header of `js/widgets.js`** (everything from line 1 through the end of `function ols(...) {...}`, just before `// ===` and `// M6: descriptive statistics lab`) with:

```js
// Interactive widgets. Use in content with  :::widget name [key=value ...] [lock=a,b]:::
const Widgets = (() => {
  const reg = {};
  const E = Render.el;
  const M = WMath;
  const { mean, sd, quant, ols } = M;
  const median = a => quant([...a].sort((x, y) => x - y), 0.5);
  const f2 = (v, d = 2) => (isFinite(v) ? Number(v).toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d }) : '—');
  const pct = (v, d = 1) => (isFinite(v) ? (v * 100).toFixed(d) + '%' : '—');
  const DEV = typeof location !== 'undefined' && /[?&]dev\b/.test(location.search);

  // ---------- widget handle: presets, locks, setters, published outputs ----------
  function handle(a) {
    const listeners = [];
    const w = {
      name: a.name, presets: a.presets, lock: new Set(a.lock), out: {}, setters: {},
      set(k, v) { if (w.setters[k]) w.setters[k](v); },
      setMany(o) { Object.keys(o).forEach(k => w.set(k, o[k])); },
      onUpdate(fn) { listeners.push(fn); },
      emit(out) { w.out = out; listeners.forEach(f => f(out)); }
    };
    return w;
  }
  function mount(box, argStr) {
    const a = Challenge.parseArgs(argStr);
    const w = box.w = handle(a);
    const fn = reg[a.name];
    if (!fn) { box.textContent = 'Unknown widget: ' + a.name; return w; }
    try { fn(box, w); } catch (e) { box.textContent = 'Widget error: ' + e.message; console.error(e); }
    return w;
  }
  function publish(box, out) {
    if (DEV && typeof WidgetMeta !== 'undefined') {
      const want = ((WidgetMeta[box.w.name] || {}).outputs || []).slice().sort().join();
      if (Object.keys(out).sort().join() !== want) console.warn('widget', box.w.name, 'published', Object.keys(out), 'manifest', want);
    }
    box.w.emit(out);
  }
  const preset = (box, k, d) => (k in box.w.presets ? box.w.presets[k] : d);

  // ---------- shared helpers ----------
  function controls(box, defs, onChange) {
    const w = box.w;
    const wrap = E('div', 'w-controls');
    const vals = {};
    defs.forEach(d => {
      const v0 = d.k in w.presets ? w.presets[d.k] : d.v;
      vals[d.k] = d.type === 'select' ? String(v0) : +v0;
      const lab = E('label', 'w-ctl');
      const name = E('span', 'w-ctl-name', d.label);
      const out = E('span', 'w-ctl-val');
      let inp;
      if (d.type === 'select') {
        inp = E('select');
        d.options.forEach(o => { const op = E('option', null, o[1]); op.value = o[0]; inp.appendChild(op); });
      } else {
        inp = E('input');
        inp.type = d.type || 'range';
        if (d.min != null) inp.min = d.min;
        if (d.max != null) inp.max = d.max;
        inp.step = d.step || 'any';
      }
      inp.value = vals[d.k];
      const show = () => { out.textContent = d.type === 'select' || d.type === 'number' ? '' : (d.fmt ? d.fmt(vals[d.k]) : vals[d.k]); };
      inp.addEventListener('input', () => {
        vals[d.k] = d.type === 'select' ? inp.value : parseFloat(inp.value);
        if (d.type !== 'select' && isNaN(vals[d.k])) return;
        show(); onChange(vals);
      });
      w.setters[d.k] = x => { vals[d.k] = d.type === 'select' ? String(x) : +x; inp.value = vals[d.k]; show(); onChange(vals); };
      if (w.lock.has(d.k)) lab.hidden = true;
      show();
      lab.append(name, inp, out);
      wrap.appendChild(lab);
    });
    box.appendChild(wrap);
    return vals;
  }
  function readout(box) {
    const r = E('div', 'w-readout');
    box.appendChild(r);
    return rows => {
      r.innerHTML = rows.map(([k, v, cls]) => `<div class="ro ${cls || ''}"><span>${Render.inline(k)}</span><b>${v}</b></div>`).join('');
    };
  }
  function title(box, t, sub) {
    box.appendChild(E('div', 'w-title', t + (sub ? `<span>${sub}</span>` : '')));
  }
  function legend(box, items) {
    box.appendChild(E('div', 'w-legend', items.map(([cls, t]) => `<span><i class="sw ${cls}"></i>${Render.inline(t)}</span>`).join('')));
  }
```

Also change the module's closing `return` line (the last lines of the file) to:

```js
  return { get: n => reg[n], names: () => Object.keys(reg), mount, _math: { ols, mean, sd, median } };
```

- [ ] **Step 5: Publish outputs from each widget.** Apply these edits in `js/widgets.js`:

`stats-lab`: replace `ta.rows = 2; ta.value = presets['Practice Q1'];` with `ta.rows = 2; ta.value = String(preset(box, 'data', presets['Practice Q1'])).replace(/,(?=\S)/g, ', ');`. Add `box.w.setters.data = s => { ta.value = String(s).replace(/,(?=\S)/g, ', '); draw(); };` directly before `ta.oninput = draw; draw();`. In `draw()`, change the early return to:

```js
      if (a.length < 2) { ro([['Need at least 2 numbers', '']]); publish(box, { n: a.length, mean: NaN, median: NaN, sd: NaN, cv: NaN, beyond2: NaN }); return; }
```

and add after the final `ro([...]);`:

```js
      publish(box, { n: a.length, mean: m, median: med, sd: sdev, cv, beyond2: a.filter(x => Math.abs(x - m) > 2 * sdev).length });
```

`transform`: replace `const noise = xs.map(() => 1 + 0.05 * randn());` with:

```js
    const rnd = M.rng(7);
    const noise = xs.map(() => 1 + 0.05 * M.randn(rnd));
```

and add as the last line of `draw()`: `publish(box, { r2: fit.r2, slope: fit.b1, intercept: fit.b0 });`

`lc-explorer`: last line of `draw()`: `publish(box, { b, unitN: unit[N - 1][1], cavN: cav[N - 1][1], totalN: sum });`

`lmp`: last line of `draw()`: `publish(box, { ari, geo, heur, half, exact });`

`regression`: replace the `presets` object, the `let pts = ...` line, and the preset-button loop with:

```js
    const presets = {
      seeker: ['Seeker (guide)', [[4, 5], [7, 5], [8, 10], [12, 7], [16, 13]]],
      tight: ['Tight linear', [[2, 4.1], [4, 6.2], [6, 7.8], [8, 10.3], [10, 11.9], [12, 14.2], [14, 15.8], [16, 18.1]]],
      outlier: ['One bad point', [[2, 4.1], [4, 6.2], [6, 7.8], [8, 10.3], [10, 11.9], [12, 14.2], [14, 15.8], [16, 2]]],
      curved: ['Curved (try a transform)', [[1, 2], [2, 2.6], [4, 3.9], [6, 5.8], [8, 8.4], [10, 11.8], [12, 16], [14, 21], [16, 27]]],
      funnel: ['Funnel (heteroscedastic)', [[2, 3], [3, 3.4], [5, 4.2], [7, 7.5], [9, 5.5], [11, 11], [13, 6.8], [15, 15.5], [17, 8.5], [18, 17]]]
    };
    let pts;
    const load = id => { pts = (presets[id] || presets.seeker)[1].map(p => p.slice()); };
    load(preset(box, 'data', 'seeker'));
    const bar = E('div', 'w-presets');
    Object.keys(presets).forEach(k => { const b = E('button', 'chip', presets[k][0]); b.onclick = () => { load(k); draw(); }; bar.appendChild(b); });
```

Add `box.w.setters.data = id => { load(id); draw(); };` just before the final `draw();` of the widget. In `draw()`, change the early return to:

```js
      if (pts.length < 3) { rp.axes(); ro([['Add at least 3 points', '']]); publish(box, { n: pts.length, b0: NaN, b1: NaN, r2: NaN, see: NaN, cv: NaN, t: NaN, p: NaN, sse: NaN }); return; }
```

Change `const tp = 2 * (1 - tcdf(Math.abs(r.t), df));` to `const tp = 2 * (1 - M.tcdf(Math.abs(r.t), df));`. Add after the `ro([...]);` in `draw()`:

```js
      publish(box, { n: r.n, b0: r.b0, b1: r.b1, r2: r.r2, see: r.see, cv: r.cv, t: r.t, p: tp, sse: r.sse });
```

Delete the local `tcdf`, `ibeta`, `cf` and `lgamma` functions (they now live in `WMath`).

`escalation`: last line of `draw()`: `publish(box, { raw1: raw(BY + 1), wtdBY: wtd(BY), tyBY: v.amt * wtd(BY) });`

`montecarlo`: in `go()`, replace everything from `const N = +v.n, rho = v.rho, out = new Float64Array(N);` through `const s = Array.from(out).sort((x, y) => x - y);` with:

```js
      const N = +v.n;
      const s = M.mcSum(els, v.rho, N, 11);
```

Replace `const pctOfPE = s.findIndex(x => x > pe) / N;` with:

```js
      const above = s.findIndex(x => x > pe), pctOfPE = (above < 0 ? N : above) / N;
```

and add at the end of `go()`:

```js
      publish(box, { pe, pePct: pctOfPE, mean: mu, sd: sdev, p50: quant(s, 0.5), p70: quant(s, 0.7), p80: quant(s, 0.8) });
```

`dist`: last line of `draw()`: `publish(box, { mean: mu, median: med, mode, sd: s });`

`npv`: last line of `draw()`: `publish(box, { pvA, pvB, diff: pvA - pvB, sir });`

`fpif`: last line of `draw()`: `publish(box, { tpPrice, pta, ac: v.ac, profit: r.profit, price: r.price });`

`cpif`: last line of `draw()`: `publish(box, { rieLo: lo, rieHi: hi, fee: fee(v.ac), price: v.ac + fee(v.ac) });`

`evm`: last line of `draw()`: `publish(box, { cv, sv, cpi, spi, eac: eac1, tcpi, vac: bac - eac1 });`

`burden`: last line of `draw()`: `publish(box, { cost, wrap: price, multiple: price / v.dl, price: price * v.hrs });`

`sw-effort`: last line of `draw()`: `publish(box, { effort: eff(v.s), prod: 1000 * v.s / eff(v.s), doubleX: Math.pow(2, v.E) });`

`analogy`: last line of `draw()`: `publish(box, { ratio, sized, est: out, linear: v.c0 * ratio * v.cx });`

`trl`: after `box.appendChild(list);` add `publish(box, {});`

- [ ] **Step 6: Mount widgets through the handle.** In `js/render.js`, replace `buildWidget` with:

```js
  function buildWidget(d) {
    const box = el('div', 'widget');
    Widgets.mount(box, d.args);
    return box;
  }
```

Update the directive comment at the top of `render.js` so it reads `//   :::widget name [k=v ...] [lock=a,b]:::  interactive widget`.

In `index.html`, add these three lines directly before `<script src="js/render.js"></script>`:

```html
<script src="js/wmath.js"></script>
<script src="js/challenge.js"></script>
<script src="js/widget-meta.js"></script>
```

- [ ] **Step 7: Validate widget arguments against the manifest.** In `tools/validate.js`, replace the `const WIDGETS = [...]` line with:

```js
const Meta = require('../js/widget-meta.js');
const Challenge = require('../js/challenge.js');
```

Add this function after the `err` helper:

```js
function checkWidgetArgs(where, argStr) {
  const a = Challenge.parseArgs(argStr), meta = Meta[a.name];
  if (!meta) { err(where, 'unknown widget ' + a.name); return null; }
  a.bad.forEach(t => err(where, `${a.name}: bad argument ${t}`));
  Object.keys(a.presets).forEach(k => { if (!meta.controls.includes(k) && !meta.setters.includes(k)) err(where, `${a.name}: unknown preset ${k}`); });
  a.lock.forEach(k => { if (!meta.controls.includes(k)) err(where, `${a.name}: cannot lock ${k}`); });
  return meta;
}
```

Replace the two widget-name checks in the directive loop:
- `else if (!WIDGETS.includes(one[2].split(/\s+/)[0])) err(where, 'unknown widget ' + one[2]);` becomes `else checkWidgetArgs(where, one[2]);`
- `if (op[1] === 'widget' && !WIDGETS.includes(op[2].split(/\s+/)[0])) err(where, 'unknown widget ' + op[2]);` becomes `if (op[1] === 'widget') checkWidgetArgs(where, op[2]);`

- [ ] **Step 8: Run tests and the validator**

Run: `npm test`
Expected: all tests pass, including `widgets.test.js` (2 tests).

Run: `npm run validate`
Expected: the last line is `OK`.

- [ ] **Step 9: Smoke-test in the browser.** Run `npm start` and open `http://localhost:<port>/?dev#/learn/m07/equation` (the port is printed by `npm start`). Move the LCS slider: the chart must update. Open DevTools: there must be no `published ... manifest` warnings. Visit M8 → `fit` and M9 → `scurve` (it now simulates on load and on **Run simulation**) and check there are no console errors.

- [ ] **Step 10: Commit**

```bash
git add js/widget-meta.js js/widgets.js js/render.js index.html tools/validate.js tests/widgets.test.js
git commit -m "feat: widget handle with presets, locks, setters and published outputs"
```

---

### Task 4: Render `:::challenge` blocks

**Files:**
- Modify: `js/render.js` (`buildCheck` lines 94-180, `buildStep`, `section`, the return statement)
- Modify: `css/styles.css` (append after the `.check-explain p` rule, line 184)

**Interfaces:**
- Consumes `Challenge.parse/evalGoals/within/readNum/fmt` (Task 2), `Widgets.mount` and `w.onUpdate/setMany/out` (Task 3), and `Store.data.checks`, `Store.save()`, `Store.markActive()`.
- Produces: challenge DOM `.check.challenge[data-check-id="<key>#c<n>"]` containing `.widget` (with `box.w`), `.ch-tools` (target), `.check-input` (predict) or `.check-opts` (choose). It also produces the export `Render.split` (= `splitDirectives`), which the harness uses. Saved record: `{ first, done: true }`, plus `guess` for predict.

- [ ] **Step 1: Refactor `buildCheck` to share the recording and option helpers.** In `js/render.js`, replace the whole `buildCheck` function (from `// ctx: { key, onChange }` through its closing `}`) with:

```js
  // Records a completed check or challenge; first = right on first try without help.
  function record(id, first, extra, ctx) {
    if (!Store.data.checks[id]) Store.data.checks[id] = Object.assign({ first }, extra);
    Store.data.checks[id].done = true;
    Store.markActive();
    Store.save();
    ctx.onChange && ctx.onChange();
  }

  // Multiple-choice buttons; onRight(firstTry) fires when the right option is clicked.
  function optionList(opts, fb, onRight) {
    const list = el('div', 'check-opts');
    let attempts = 0;
    opts.forEach(o => {
      const b = el('button', 'opt', inline(o.text));
      b.onclick = () => {
        attempts++;
        if (o.right) {
          b.classList.add('right');
          fb.innerHTML = '<b>Correct.</b>';
          fb.className = 'check-fb good';
          list.querySelectorAll('.opt').forEach(x => x.disabled = true);
          onRight(attempts === 1);
        } else {
          b.classList.add('wrong'); b.disabled = true;
          fb.innerHTML = 'Not quite &mdash; try again.';
          fb.className = 'check-fb bad';
        }
      };
      list.appendChild(b);
    });
    return list;
  }
  function lockOptions(list, opts) {
    list.querySelectorAll('.opt').forEach((b, i) => { b.disabled = true; if (opts[i].right) b.classList.add('right'); });
  }

  // ctx: { key, onChange }  -> checks report state through ctx
  function buildCheck(d, ctx, idx) {
    const c = parseCheck(d.body);
    const id = ctx.key + '#' + (d.args || idx);
    const saved = Store.data.checks[id];
    const box = el('div', 'check');
    box.dataset.checkId = id;
    box.appendChild(el('div', 'check-label', 'Check your understanding'));
    box.appendChild(el('div', 'check-q', md(c.q.join('\n'))));
    const fb = el('div', 'check-fb');
    const exp = el('div', 'check-explain', c.explain.length ? md(c.explain.join('\n')) : '');
    exp.hidden = true;

    const finish = (first, revealed) => {
      box.classList.add('done');
      exp.hidden = false;
      if (revealed) fb.innerHTML = 'Answer revealed.';
      record(id, first, {}, ctx);
    };

    if (c.opts.length) {
      const list = optionList(c.opts, fb, first => finish(first));
      box.appendChild(list);
      if (saved && saved.done) { lockOptions(list, c.opts); box.classList.add('done'); exp.hidden = false; }
    } else {
      const row = el('div', 'check-input');
      const inp = el('input');
      inp.type = 'text'; inp.placeholder = c.num ? 'Enter a number' : 'Type your answer';
      const go = el('button', 'btn small', 'Check');
      let attempts = 0;
      const submit = () => {
        if (!inp.value.trim()) return;
        attempts++;
        const ok = c.num ? numMatch(inp.value, c.num) : c.text.includes(inp.value.trim().toLowerCase());
        if (ok) {
          fb.innerHTML = '<b>Correct.</b>'; fb.className = 'check-fb good';
          inp.disabled = true; go.disabled = true; finish(attempts === 1);
        } else {
          fb.innerHTML = attempts >= 2 ? 'Not quite. You can reveal the answer.' : 'Not quite &mdash; try again.';
          fb.className = 'check-fb bad';
          if (attempts >= 2) reveal.hidden = false;
        }
      };
      go.onclick = submit;
      inp.onkeydown = e => { if (e.key === 'Enter') submit(); };
      const reveal = el('button', 'btn small ghost', 'Reveal answer');
      reveal.hidden = true;
      reveal.onclick = () => {
        inp.value = c.num ? String(c.num.v) : c.text[0];
        inp.disabled = true; go.disabled = true; reveal.hidden = true;
        finish(false, true);
      };
      row.append(inp, go, reveal);
      box.appendChild(row);
      if (saved && saved.done) {
        inp.value = c.num ? String(c.num.v) : c.text[0];
        inp.disabled = true; go.disabled = true; box.classList.add('done'); exp.hidden = false;
      }
    }
    box.append(fb, exp);
    return box;
  }
```

Existing behaviour stays the same. The one exception is that `box.classList.add('done')` now runs before `ctx.onChange`, which `learn.js` uses to re-count pending checks, so the order is now correct.

- [ ] **Step 2: Add `buildChallenge`** directly after `buildCallout`:

```js
  const CH_LABEL = { target: 'Challenge', predict: 'Predict, then check', choose: 'Explore, then answer' };
  function buildChallenge(d, ctx, idx) {
    const c = Challenge.parse(d.body);
    const id = ctx.key + '#c' + idx;
    const saved = Store.data.checks[id];
    const box = el('div', 'check challenge');
    box.dataset.checkId = id;
    if (c.errors.length) {
      box.classList.add('done');
      box.appendChild(el('div', 'check-fb bad', 'Challenge error: ' + c.errors.join('; ')));
      return box;
    }
    box.appendChild(el('div', 'check-label', CH_LABEL[c.type]));
    box.appendChild(el('div', 'check-q', md(c.q.join('\n'))));
    const wbox = el('div', 'widget');
    box.appendChild(wbox);
    const w = Widgets.mount(wbox, d.args);
    const fb = el('div', 'check-fb');
    const exp = el('div', 'check-explain', md(c.explain.join('\n')));
    exp.hidden = true;
    const isDone = () => box.classList.contains('done');
    const markDone = () => { box.classList.add('done'); exp.hidden = false; };
    const complete = (first, extra) => { markDone(); record(id, first, extra || {}, ctx); };

    if (c.type === 'target') {
      const tools = el('div', 'row-btns ch-tools');
      const stuck = el('button', 'btn small ghost', "I'm stuck");
      const showMe = el('button', 'btn small ghost', 'Show me');
      showMe.hidden = true;
      tools.append(stuck, showMe);
      box.appendChild(tools);
      let helped = false;
      const offerHelp = () => { stuck.hidden = true; showMe.hidden = false; };
      const timer = setTimeout(() => { if (!isDone()) offerHelp(); }, 45000);
      stuck.onclick = offerHelp;
      showMe.onclick = () => { helped = true; w.setMany(c.show); };
      w.onUpdate(out => {
        if (isDone() || !Challenge.evalGoals(c.goals, out)) return;
        clearTimeout(timer);
        tools.hidden = true;
        fb.innerHTML = helped ? 'Here is one setting that works. Move away and back to see why.' : '<b>Goal reached.</b>';
        fb.className = 'check-fb good';
        complete(!helped);
      });
      if (saved && saved.done) { clearTimeout(timer); tools.hidden = true; markDone(); w.setMany(c.show); }
    } else if (c.type === 'predict') {
      const row = el('div', 'check-input');
      const inp = el('input');
      inp.type = 'text'; inp.placeholder = 'Your prediction';
      const go = el('button', 'btn small', 'Lock it in');
      row.append(inp, go);
      box.insertBefore(row, wbox);
      const unfreeze = () => { wbox.classList.remove('w-frozen'); wbox.inert = false; };
      const reveal = guess => {
        const actual = w.out[c.predict.out];
        const ok = Challenge.within(guess, actual, c.predict.tol);
        unfreeze();
        inp.value = inp.value || String(guess);
        inp.disabled = go.disabled = true;
        fb.innerHTML = `<b>${ok ? 'Close enough.' : 'Not quite.'}</b> You said ${Challenge.fmt(guess)}; the model gives ${Challenge.fmt(actual)}.`;
        fb.className = 'check-fb ' + (ok ? 'good' : 'bad');
        return ok;
      };
      const submit = () => {
        const g = Challenge.readNum(inp.value);
        if (!isFinite(g)) return;
        complete(reveal(g), { guess: g });
      };
      go.onclick = submit;
      inp.onkeydown = e => { if (e.key === 'Enter') submit(); };
      if (saved && saved.done) {
        markDone();
        if (isFinite(saved.guess)) reveal(saved.guess); else { unfreeze(); inp.disabled = go.disabled = true; }
      } else { wbox.classList.add('w-frozen'); wbox.inert = true; }
    } else {
      const list = optionList(c.opts, fb, first => complete(first));
      box.appendChild(list);
      if (saved && saved.done) { lockOptions(list, c.opts); markDone(); }
    }
    box.append(fb, exp);
    return box;
  }
```

- [ ] **Step 3: Route challenge blocks and give them their own counter.** In `buildStep`, change the directive dispatch to:

```js
      if (b.type === 'check') step.appendChild(buildCheck(b, ctx, counter.n++));
      else if (b.type === 'challenge') step.appendChild(buildChallenge(b, ctx, counter.c++));
      else if (b.type === 'widget') step.appendChild(buildWidget(b));
      else step.appendChild(buildCallout(b));
```

In `section`, change `const counter = { n: 0 };` to `const counter = { n: 0, c: 0 };`. Change the final return of the module to:

```js
  return { md, inline, section, el, split: splitDirectives };
```

Add `//   :::challenge widget [k=v ...] [lock=a,b] ... :::   guided challenge (see js/challenge.js)` to the directive comment at the top of the file.

- [ ] **Step 4: Styles.** Append after `.check-explain p { ... }` in `css/styles.css`:

```css
.challenge .check-label { color: var(--c2); }
.challenge .widget { margin: 12px 0 8px; background: var(--paper); }
.ch-tools { margin-top: 8px; }
.w-frozen { position: relative; }
.w-frozen > * { filter: blur(5px); opacity: .55; user-select: none; }
.w-frozen::after { content: 'Make your prediction first'; position: absolute; inset: 0; display: grid; place-items: center; font: 600 1rem var(--sans); color: var(--ink); }
```

- [ ] **Step 5: Check in the browser with a temporary block.** Temporarily add this to the end of M7 `equation`'s body in `content/m07.js`, run `npm start`, and open M7 → Learning curve equation:

```
:::challenge lc-explorer theory=ulc t1=100 lcs=0.95 n=8 lock=theory,t1,n,log
Q: Drag LCS until unit 8 costs \$51.20.
goal: unitN ~ 51.2 +- 0.5%
show: lcs=0.8
> Three doublings: 100, 80, 64, 51.2.
:::
```

Expected:
- The block shows only the LCS control.
- Dragging LCS to 80.0% marks it done ("Goal reached.") and reveals the explanation.
- A reload keeps it done, with LCS at 80%.
- The Continue gating waits for it.

Then remove the temporary block (`git checkout content/m07.js`).

- [ ] **Step 6: Run the tests**

Run: `npm test`
Expected: all pass. Nothing new in Node here: the DOM paths are covered by the harness in Task 5.

- [ ] **Step 7: Commit**

```bash
git add js/render.js css/styles.css
git commit -m "feat: render challenge blocks as scored checks"
```

---

### Task 5: Validator support and the headless challenge harness

**Files:**
- Modify: `tools/validate.js`
- Modify: `package.json` (scripts)
- Create: `tools/challenge-check.html`, `tools/challenge-check.page.js`, `tools/challenge-check.js`
- Test: `tests/validate.test.js`

**Interfaces:**
- Consumes `Challenge.parse/parseArgs/evalGoals/fmt`, `WidgetMeta`, `Widgets.mount`, `Render.split`, and `Render.section`.
- Produces `npm run check:challenges`. It exits 0 only on the line `SUMMARY ALL PASSED`, and for every predict challenge it prints `PASS <module>/<section>#c<n> answer <output> = <value>`.

- [ ] **Step 1: Write the failing validator test** at `tests/validate.test.js`:

```js
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

function validate(body) {
  const file = path.join(os.tmpdir(), 'pcea-validate-' + process.pid + '.js');
  const mod = { id: 'mx', num: 99, title: 'T', short: 'T', source: 'guide', blurb: 'b', intro: 'i', sections: [{ id: 's', title: 'S', body }], cards: 'Q: a\nA: b' };
  fs.writeFileSync(file, 'PCEA.addModule(' + JSON.stringify(mod) + ');');
  const r = spawnSync(process.execPath, [path.join(__dirname, '../tools/validate.js'), file], { encoding: 'utf8' });
  fs.unlinkSync(file);
  return r.stdout;
}
const GOOD = [':::challenge lc-explorer lcs=0.95 n=8 lock=theory', 'Q: go', 'goal: unitN ~ 51.2 +- 0.5%', 'show: lcs=0.8', '> why', ':::'].join('\n');

module.exports = [
  ['valid challenge passes and is counted', () => {
    const out = validate(GOOD);
    assert.match(out, /1 challenges/);
    assert.match(out, /\nOK/);
  }],
  ['challenge errors are reported', () => {
    const bad = [
      [':::challenge nope', 'Q: x', '* a', '- b', '> e', ':::', 'unknown widget nope'],
      [':::challenge lc-explorer', 'Q: x', 'goal: bogus > 1', 'show: lcs=0.8', '> e', ':::', 'unknown output bogus'],
      [':::challenge lc-explorer', 'Q: x', 'predict: nothing +- 1%', '> e', ':::', 'unknown output nothing'],
      [':::challenge lc-explorer', 'Q: x', 'goal: unitN > 1', 'show: zzz=1', '> e', ':::', 'show sets unknown key zzz'],
      [':::challenge lc-explorer foo=1', 'Q: x', '* a', '- b', '> e', ':::', 'unknown preset foo'],
      [':::challenge lc-explorer lock=unitN', 'Q: x', '* a', '- b', '> e', ':::', 'cannot lock unitN'],
      [':::challenge lc-explorer', 'Q: x', 'goal: unitN > 1', '> e', ':::', 'target needs show']
    ];
    bad.forEach(lines => {
      const want = lines.pop();
      assert.ok(validate(lines.join('\n')).includes(want), 'expected: ' + want);
    });
  }]
];
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm test -- validate`
Expected: FAIL: `challenge` is still an unknown directive, and the output has no challenge count.

- [ ] **Step 3: Teach the validator about challenges.** In `tools/validate.js`:

Add `'challenge'` to the `CALLOUTS` array.

Add after `checkWidgetArgs`:

```js
let challengeCount = 0;
function checkChallenge(where, b) {
  challengeCount++;
  const meta = Meta[Challenge.parseArgs(b.args).name];
  const c = Challenge.parse(b.lines);
  c.errors.forEach(e => err(where, e));
  if (!meta) return;
  c.goals.forEach(g => { if (!meta.outputs.includes(g.out)) err(where, 'goal uses unknown output ' + g.out); });
  if (c.predict && !meta.outputs.includes(c.predict.out)) err(where, 'predict uses unknown output ' + c.predict.out);
  Object.keys(c.show).forEach(k => { if (!meta.controls.includes(k) && !meta.setters.includes(k)) err(where, 'show sets unknown key ' + k); });
}
```

At the start of the per-file loop body (just after `const file = path.resolve(rel);`), add `challengeCount = 0;`.

Replace the directive-structure loop (from `let open = null;` through `if (open) err(where, \`unclosed :::${open}\`);`) with:

```js
    let open = null, block = null;
    s.body.split('\n').forEach((line, i) => {
      if (open) {
        if (/^:::\s*$/.test(line)) { if (open === 'challenge') checkChallenge(`${where} line ${block.i}`, block); open = null; }
        else if (/^:::\w/.test(line)) err(where, `line ${i}: directive opened inside :::${open}`);
        else block.lines.push(line);
        return;
      }
      const one = line.match(/^:::(\w+)\s*(.*?):::\s*$/);
      const op = line.match(/^:::(\w+)\s*(.*)$/);
      if (one) {
        if (one[1] !== 'widget') err(where, `single-line :::${one[1]}::: only allowed for widgets`);
        else checkWidgetArgs(where, one[2]);
      } else if (op) {
        if (!CALLOUTS.includes(op[1])) err(where, 'unknown directive ' + op[1]);
        if (op[1] === 'widget' || op[1] === 'challenge') checkWidgetArgs(where, op[2]);
        open = op[1];
        block = { i, args: op[2], lines: [] };
      }
      if (!open && /^:::\s*$/.test(line)) err(where, `line ${i}: stray closing :::`);
    });
    if (open) err(where, `unclosed :::${open}`);
```

In the per-module summary `console.log`, change `${checks} checks, ` to `${checks} checks, ${challengeCount} challenges, `.

- [ ] **Step 4: Run the validator tests**

Run: `npm test -- validate`
Expected: `2 passed, 0 failed`. Also run `npm run validate` and expect `OK`.

- [ ] **Step 5: Create the harness page** `tools/challenge-check.html`:

```html
<!doctype html>
<html><head><meta charset="utf-8"><title>Challenge check</title></head>
<body>
<pre id="out">RUNNING</pre>
<div id="stage" style="position:absolute;left:-9999px;top:0;width:720px"></div>
<script src="../vendor/katex/katex.min.js"></script>
<script src="../vendor/marked.min.js"></script>
<script src="../js/registry.js"></script>
<script>window.Store = { data: { checks: {} }, save() {}, markActive() {} };</script>
<script src="../content/m01.js"></script>
<script src="../content/m02.js"></script>
<script src="../content/m03.js"></script>
<script src="../content/m04.js"></script>
<script src="../content/m05.js"></script>
<script src="../content/m06.js"></script>
<script src="../content/m07.js"></script>
<script src="../content/m08.js"></script>
<script src="../content/m09.js"></script>
<script src="../content/m10.js"></script>
<script src="../content/m11.js"></script>
<script src="../content/m12.js"></script>
<script src="../content/m13.js"></script>
<script src="../content/m14.js"></script>
<script src="../content/m15.js"></script>
<script src="../content/m16.js"></script>
<script src="../js/wmath.js"></script>
<script src="../js/challenge.js"></script>
<script src="../js/widget-meta.js"></script>
<script src="../js/render.js"></script>
<script src="../js/plot.js"></script>
<script src="../js/widgets.js"></script>
<script src="challenge-check.page.js"></script>
</body></html>
```

- [ ] **Step 6: Create the page script** `tools/challenge-check.page.js`:

```js
// Mounts every widget and every authored challenge, then exercises the challenge UI. Report goes in #out.
(function () {
  const lines = [];
  let fails = 0;
  const pass = m => lines.push('PASS ' + m);
  const fail = m => { fails++; lines.push('FAIL ' + m); };
  const stage = document.getElementById('stage');
  const sameSet = (a, b) => a.slice().sort().join() === b.slice().sort().join();
  const mountBox = args => { const box = document.createElement('div'); stage.appendChild(box); return Widgets.mount(box, args); };
  const outs = w => JSON.stringify(w.out, (k, v) => (typeof v === 'number' ? +v.toPrecision(5) : v));

  // 1. every widget publishes exactly its manifest outputs and exposes its settable keys
  Object.keys(WidgetMeta).forEach(name => {
    const w = mountBox(name), meta = WidgetMeta[name];
    const missing = meta.controls.concat(meta.setters).filter(k => !w.setters[k]);
    if (!sameSet(Object.keys(w.out), meta.outputs)) fail(`widget ${name}: publishes [${Object.keys(w.out)}] but manifest says [${meta.outputs}]`);
    else if (missing.length) fail(`widget ${name}: no setter for ${missing}`);
    else pass('widget ' + name);
  });

  // 2. every authored challenge is solvable with its widget's own math
  let total = 0;
  PCEA.modules.forEach(m => m.sections.forEach(s => {
    let i = 0;
    Render.split(s.body).filter(b => b.kind === 'dir' && b.type === 'challenge').forEach(b => {
      total++;
      const where = `${m.id}/${s.id}#c${i++}`;
      const c = Challenge.parse(b.body);
      if (c.errors.length) return fail(where + ': ' + c.errors.join('; '));
      const w = mountBox(b.args);
      if (c.type === 'target') {
        if (Challenge.evalGoals(c.goals, w.out)) return fail(where + ': goal already met at presets ' + outs(w));
        w.setMany(c.show);
        if (!Challenge.evalGoals(c.goals, w.out)) return fail(where + ': show values miss the goal ' + outs(w));
        pass(where + ' target');
      } else if (c.type === 'predict') {
        const v = w.out[c.predict.out];
        if (!isFinite(v)) return fail(where + ': predicted output is not finite ' + outs(w));
        pass(`${where} answer ${c.predict.out} = ${Challenge.fmt(v)}`);
      } else pass(where + ' choose');
    });
  }));
  lines.push(`(${total} challenges in content)`);

  // 3. challenge UI through Render.section with the stub Store
  const ui = (name, fn) => { try { fn(); pass('ui ' + name); } catch (e) { fail('ui ' + name + ': ' + e.message); } };
  const assert = (cond, msg) => { if (!cond) throw new Error(msg); };
  let uid = 0;
  const mk = body => {
    const ctx = { key: 'ui/' + (uid++), onChange() {} };
    const steps = Render.section(body, ctx);
    steps.forEach(st => stage.appendChild(st));
    return { ctx, root: steps[0], id: ctx.key + '#c0' };
  };
  const TARGET = [':::challenge lc-explorer lcs=0.95 n=8 lock=theory', 'Q: hit it', 'goal: unitN ~ 51.2 +- 0.5%', 'show: lcs=0.8', '> why', ':::'].join('\n');
  const PREDICT = [':::challenge sw-effort E=1.1 lock=A,E', 'Q: factor?', 'predict: doubleX +- 1%', '> 2^1.1', ':::'].join('\n');

  ui('target solved by the learner counts as first try', () => {
    const { root, id } = mk(TARGET);
    const box = root.querySelector('.challenge');
    assert(!box.classList.contains('done'), 'done before any interaction');
    box.querySelector('.widget').w.set('lcs', 0.8);
    assert(box.classList.contains('done'), 'not done after reaching goal');
    assert(Store.data.checks[id].first === true, 'first should be true: ' + JSON.stringify(Store.data.checks[id]));
  });
  ui('target via Show me is not first try, and restores as done', () => {
    const { ctx, root, id } = mk(TARGET);
    const [stuck, showMe] = root.querySelectorAll('.ch-tools button');
    assert(showMe.hidden, 'Show me visible too early');
    stuck.click(); showMe.click();
    assert(Store.data.checks[id].done && Store.data.checks[id].first === false, JSON.stringify(Store.data.checks[id]));
    const again = Render.section(TARGET, ctx)[0];
    assert(again.querySelector('.challenge').classList.contains('done'), 'not restored');
  });
  ui('challenge ids do not shift check ids', () => {
    const { ctx, root } = mk([':::challenge trl', 'Q: pick', '* a', '- b', '> x', ':::', '', ':::check', 'Q: q', '* a', '- b', '> x', ':::'].join('\n'));
    assert(root.querySelector('.check:not(.challenge)').dataset.checkId === ctx.key + '#0', 'check id shifted');
    assert(root.querySelector('.challenge').dataset.checkId === ctx.key + '#c0', 'challenge id wrong');
  });
  ui('predict freezes, records guess, restores', () => {
    const { ctx, root, id } = mk(PREDICT);
    const wb = root.querySelector('.challenge .widget');
    assert(wb.classList.contains('w-frozen') && wb.inert, 'not frozen');
    root.querySelector('.challenge input').value = '2.14';
    root.querySelector('.challenge .check-input .btn').click();
    assert(!wb.classList.contains('w-frozen') && !wb.inert, 'still frozen');
    assert(Store.data.checks[id].first === true && Store.data.checks[id].guess === 2.14, JSON.stringify(Store.data.checks[id]));
    const again = Render.section(PREDICT, ctx)[0];
    assert(again.querySelector('.challenge').classList.contains('done'), 'not restored');
    assert(!again.querySelector('.challenge .widget').classList.contains('w-frozen'), 'restored widget still frozen');
  });
  ui('predict accepts percent input', () => {
    const { root, id } = mk(PREDICT);
    root.querySelector('.challenge input').value = '214%';
    root.querySelector('.challenge .check-input .btn').click();
    assert(Store.data.checks[id].first === true, JSON.stringify(Store.data.checks[id]));
  });
  ui('wrong predict completes with first = false', () => {
    const { root, id } = mk(PREDICT);
    root.querySelector('.challenge input').value = '2';
    root.querySelector('.challenge .check-input .btn').click();
    assert(Store.data.checks[id].done && Store.data.checks[id].first === false, JSON.stringify(Store.data.checks[id]));
  });
  ui('choose: wrong then right is not first try', () => {
    const { root, id } = mk([':::challenge trl', 'Q: pick', '- wrong', '* right', '> x', ':::'].join('\n'));
    const [bad, good] = root.querySelectorAll('.challenge .opt');
    bad.click(); good.click();
    assert(Store.data.checks[id].done && Store.data.checks[id].first === false, JSON.stringify(Store.data.checks[id]));
  });

  lines.push(fails ? `SUMMARY ${fails} FAILED` : 'SUMMARY ALL PASSED');
  document.getElementById('out').textContent = lines.join('\n');
})();
```

- [ ] **Step 7: Create the Node runner** `tools/challenge-check.js`:

```js
// Runs tools/challenge-check.html in headless Edge/Chrome and prints its report. Set BROWSER to override.
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const candidates = [
  process.env.BROWSER,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'
].filter(Boolean);
const exe = candidates.find(p => fs.existsSync(p));
if (!exe) { console.log('No Edge or Chrome found; set BROWSER to a Chromium-based browser.'); process.exit(2); }
const url = 'file:///' + path.join(__dirname, 'challenge-check.html').replace(/\\/g, '/').replace(/^\/+/, '');
const r = spawnSync(exe, ['--headless=new', '--disable-gpu', '--no-first-run', '--dump-dom', url], { encoding: 'utf8', maxBuffer: 1 << 26, timeout: 180000 });
const m = (r.stdout || '').match(/<pre id="out">([\s\S]*?)<\/pre>/);
if (!m) { console.log('No report in page output.', r.error || '', r.stderr || ''); process.exit(2); }
const txt = m[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
console.log(txt);
process.exit(/SUMMARY ALL PASSED/.test(txt) ? 0 : 1);
```

In `package.json` `scripts`, add `"check:challenges": "node tools/challenge-check.js"`.

- [ ] **Step 8: Run the harness**

Run: `npm run check:challenges`
Expected: 16 `PASS widget ...` lines, `(0 challenges in content)`, 7 `PASS ui ...` lines, and `SUMMARY ALL PASSED`. If the output is `RUNNING`, the page script threw an error: open `tools/challenge-check.html` in a normal browser and read the console.

- [ ] **Step 9: Commit**

```bash
git add tools/validate.js tools/challenge-check.html tools/challenge-check.page.js tools/challenge-check.js package.json tests/validate.test.js
git commit -m "feat: validate challenge blocks and headless solvability harness"
```

---

### Task 6: Regression upgrade: fit by hand with squared residuals

**Files:**
- Modify: `js/widgets.js` (`reg['regression']`)
- Modify: `js/widget-meta.js` (`regression` entry)
- Modify: `css/styles.css` (append to the `.plot` rules)

**Interfaces:**
- Consumes `publish`, `preset`, `controls`, `M.tcdf`, and `ols`.
- Produces the `regression` manifest `{ controls: ['mode'], setters: ['data', 'hand'], outputs: ['n', 'b0', 'b1', 'r2', 'see', 'cv', 't', 'p', 'sse', 'sseHand', 'ratio'] }`. `hand=ols` snaps the hand line to OLS. `data=<seeker|tight|outlier|curved|funnel>` loads a preset. `ratio = sseHand / sse`.

- [ ] **Step 1: Update the manifest entry** in `js/widget-meta.js`:

```js
    'regression': { controls: ['mode'], setters: ['data', 'hand'], outputs: ['n', 'b0', 'b1', 'r2', 'see', 'cv', 't', 'p', 'sse', 'sseHand', 'ratio'] },
```

- [ ] **Step 2: Run the harness and confirm it fails**

Run: `npm run check:challenges`
Expected: `FAIL widget regression: publishes [...] but manifest says [...]`.

- [ ] **Step 3: Replace `reg['regression']`** in `js/widgets.js` with:

```js
  reg['regression'] = box => {
    title(box, 'Regression playground', 'click to add points, drag to move, right-click to delete');
    const presets = {
      seeker: ['Seeker (guide)', [[4, 5], [7, 5], [8, 10], [12, 7], [16, 13]]],
      tight: ['Tight linear', [[2, 4.1], [4, 6.2], [6, 7.8], [8, 10.3], [10, 11.9], [12, 14.2], [14, 15.8], [16, 18.1]]],
      outlier: ['One bad point', [[2, 4.1], [4, 6.2], [6, 7.8], [8, 10.3], [10, 11.9], [12, 14.2], [14, 15.8], [16, 2]]],
      curved: ['Curved (try a transform)', [[1, 2], [2, 2.6], [4, 3.9], [6, 5.8], [8, 8.4], [10, 11.8], [12, 16], [14, 21], [16, 27]]],
      funnel: ['Funnel (heteroscedastic)', [[2, 3], [3, 3.4], [5, 4.2], [7, 7.5], [9, 5.5], [11, 11], [13, 6.8], [15, 15.5], [17, 8.5], [18, 17]]]
    };
    let pts;
    const load = id => { pts = (presets[id] || presets.seeker)[1].map(p => p.slice()); };
    load(preset(box, 'data', 'seeker'));
    const bar = E('div', 'w-presets');
    Object.keys(presets).forEach(k => { const b = E('button', 'chip', presets[k][0]); b.onclick = () => { load(k); draw(); }; bar.appendChild(b); });
    const clr = E('button', 'chip', 'Clear'); clr.onclick = () => { pts = []; draw(); }; bar.appendChild(clr);
    box.appendChild(bar);
    const v = controls(box, [
      { k: 'mode', label: 'Line', type: 'select', v: 'ols', options: [['ols', 'Least squares (OLS)'], ['hand', 'Fit by hand (drag the two handles)']] }
    ], draw);
    const top = E('div'), bot = E('div');
    box.append(top, bot);
    const ro = readout(box);
    const p = Plot.create(top, { xmin: 0, xmax: 20, ymin: 0, ymax: 30, xlabel: 'X (cost driver)', ylabel: 'Y (cost)' });
    const rp = Plot.create(bot, { h: 150, xmin: 0, xmax: 20, ymin: -6, ymax: 6, yticks: 4, xlabel: 'X', ylabel: 'residual' });
    const HX = [1, 19];
    let hand = [15, 15];
    let drag = -1;   // point index, -2/-3 = hand handle 0/1, -1 = none
    const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
    const dist = (x0, y0, x1, y1) => Math.hypot((x0 - x1) / 20 * 28, (y0 - y1) / 30 * 15);
    function nearest(x, y) {
      let best = -1, bd = 0.9;
      pts.forEach((q, i) => { const d = dist(q[0], q[1], x, y); if (d < bd) { bd = d; best = i; } });
      return best;
    }
    function nearHandle(x, y) {
      let best = -1, bd = 1.4;
      HX.forEach((hx, i) => { const d = dist(hx, hand[i], x, y); if (d < bd) { bd = d; best = i; } });
      return best;
    }
    p.svg.addEventListener('contextmenu', e => {
      e.preventDefault();
      const [x, y] = p.evt(e);
      const i = nearest(x, y); if (i >= 0) { pts.splice(i, 1); draw(); }
    });
    p.svg.addEventListener('pointerdown', e => {
      if (e.button === 2) return;
      const [x, y] = p.evt(e);
      if (x < 0 || x > 20 || y < 0 || y > 30) return;
      const h = v.mode === 'hand' ? nearHandle(x, y) : -1;
      if (h >= 0) drag = -2 - h;
      else { drag = nearest(x, y); if (drag < 0) { pts.push([x, y]); drag = pts.length - 1; } }
      p.svg.setPointerCapture(e.pointerId);
      draw();
    });
    p.svg.addEventListener('pointermove', e => {
      if (drag === -1) return;
      const [x, y] = p.evt(e);
      if (drag <= -2) hand[-2 - drag] = clamp(y, 0, 30);
      else pts[drag] = [clamp(x, 0, 20), clamp(y, 0, 30)];
      draw();
    });
    p.svg.addEventListener('pointerup', () => { drag = -1; });
    function draw() {
      p.clear(); p.axes(); rp.clear();
      if (pts.length < 3) {
        pts.forEach(q => p.dot(q[0], q[1], 'pt', 6));
        rp.axes(); ro([['Add at least 3 points', '']]);
        publish(box, { n: pts.length, b0: NaN, b1: NaN, r2: NaN, see: NaN, cv: NaN, t: NaN, p: NaN, sse: NaN, sseHand: NaN, ratio: NaN });
        return;
      }
      const r = ols(pts.map(q => q[0]), pts.map(q => q[1]));
      const byHand = v.mode === 'hand';
      const hb1 = (hand[1] - hand[0]) / (HX[1] - HX[0]), hb0 = hand[0] - hb1 * HX[0];
      const lineAt = byHand ? x => hb0 + hb1 * x : x => r.b0 + r.b1 * x;
      const sseHand = pts.reduce((s, q) => s + (q[1] - (hb0 + hb1 * q[0])) ** 2, 0);
      // squared residuals as true squares: side |e| in y-units, converted to x-units by the pixel aspect
      const k = (p.y(0) - p.y(1)) / (p.x(1) - p.x(0));
      pts.forEach(q => { const e = q[1] - lineAt(q[0]); p.rect(q[0], q[1], q[0] + Math.abs(e) * k * (q[0] > 10 ? -1 : 1), lineAt(q[0]), 'sq'); });
      p.fn(lineAt, byHand ? 'series hand' : 'series c1');
      if (byHand) HX.forEach((hx, i) => p.dot(hx, hand[i], 'handle', 8));
      p.dot(r.mx, r.my, 'pt mean', 5);
      pts.forEach((q, i) => p.dot(q[0], q[1], i === drag ? 'pt hot' : 'pt', 6));
      const res = pts.map(q => q[1] - lineAt(q[0]));
      const m = Math.max(1, ...res.map(Math.abs)) * 1.2;
      rp.o.ymin = -m; rp.o.ymax = m; rp.axes(); rp.hline(0, 'marker');
      pts.forEach((q, i) => rp.dot(q[0], res[i], 'pt alt', 4));
      const df = r.n - 2;
      const tp = 2 * (1 - M.tcdf(Math.abs(r.t), df));
      const ratio = sseHand / r.sse;
      ro(byHand ? [
        ['Your line', `Ŷ = ${f2(hb0)} + ${f2(hb1, 3)}X`],
        ['Your SSE (total area of the squares)', f2(sseHand, 2)],
        ['Your SSE ÷ least-squares SSE', f2(ratio, 3), ratio < 1.05 ? 'good' : 'bad'],
        ['n', r.n]
      ] : [
        ['Equation', `Ŷ = ${f2(r.b0)} + ${f2(r.b1, 3)}X`],
        ['$R^2$', f2(r.r2, 3)],
        ['SEE', f2(r.see)], ['CV = SEE/$\\bar{Y}$', pct(r.cv), r.cv < 0.15 ? 'good' : 'bad'],
        ['SST = SSR + SSE', `${f2(r.sst, 1)} = ${f2(r.ssr, 1)} + ${f2(r.sse, 1)}`],
        ['t-stat (slope)', f2(r.t)], ['F = $t^2$', f2(r.F)],
        ['p-value (slope)', f2(tp, 3), tp < 0.05 ? 'good' : 'bad'], ['n, df', `${r.n}, ${df}`]
      ]);
      publish(box, { n: r.n, b0: r.b0, b1: r.b1, r2: r.r2, see: r.see, cv: r.cv, t: r.t, p: tp, sse: r.sse, sseHand, ratio });
    }
    box.w.setters.data = id => { load(id); draw(); };
    box.w.setters.hand = s => {
      if (s === 'ols' && pts.length >= 3) { const r = ols(pts.map(q => q[0]), pts.map(q => q[1])); hand = HX.map(x => r.b0 + r.b1 * x); }
      draw();
    };
    draw();
  };
```

- [ ] **Step 4: Styles.** Append to `css/styles.css` after the `.plot .bar` rule:

```css
.plot .sq { fill: color-mix(in srgb, var(--c2) 16%, transparent); stroke: color-mix(in srgb, var(--c2) 60%, transparent); stroke-width: 1; }
.plot .series.hand { stroke: var(--c2); }
.plot .handle { fill: var(--paper); stroke: var(--c2); stroke-width: 3; cursor: grab; }
```

- [ ] **Step 5: Run the harness and tests**

Run: `npm run check:challenges && npm test`
Expected: `SUMMARY ALL PASSED`, and all tests pass.

- [ ] **Step 6: Browser check.** In M8 → `fit` (`npm start`), the chips load presets and the squares render beside each point. Switch Line to "Fit by hand": the two orange handles drag the line, and the ratio turns green below 1.05. Check that nothing else overlaps the axes.

- [ ] **Step 7: Commit**

```bash
git add js/widgets.js js/widget-meta.js css/styles.css
git commit -m "feat: regression fit-by-hand with squared residuals"
```

---

### Task 7: Monte Carlo and NPV upgrades

**Files:**
- Modify: `js/widgets.js` (`reg['montecarlo']`, `reg['npv']`)
- Modify: `js/widget-meta.js`
- Modify: `css/styles.css`

**Interfaces:**
- `montecarlo`: controls `['rho', 'n']`, outputs `['pe', 'pePct', 'mean', 'sd', 'p50', 'p70', 'p80', 'p80ind', 'p80gap']`. It re-simulates on every change (seed 11). `p80ind` is the P80 at rho = 0 with the same seed and N, and `p80gap = p80 - p80ind`.
- `npv`: outputs `['pvA', 'pvB', 'diff', 'sir', 'beRate']`, where `beRate` is the discount rate in [0, 0.2] with `pvA = pvB`, or NaN.

- [ ] **Step 1: Update the manifest**

```js
    'montecarlo': { controls: ['rho', 'n'], setters: [], outputs: ['pe', 'pePct', 'mean', 'sd', 'p50', 'p70', 'p80', 'p80ind', 'p80gap'] },
    'npv': { controls: ['r', 'ia', 'ca', 'ib', 'cb', 'n', 'mid'], setters: [], outputs: ['pvA', 'pvB', 'diff', 'sir', 'beRate'] },
```

- [ ] **Step 2: Run the harness and confirm it fails**

Run: `npm run check:challenges`
Expected: `FAIL widget montecarlo ...` and `FAIL widget npv ...`.

- [ ] **Step 3: Replace `reg['montecarlo']`** with:

```js
  reg['montecarlo'] = box => {
    title(box, 'Monte Carlo cost risk', 'sum of triangular WBS elements; dashed curve = no correlation');
    const els = [
      { n: 'Airframe', a: 80, c: 100, b: 150 },
      { n: 'Propulsion', a: 40, c: 50, b: 80 },
      { n: 'Avionics', a: 55, c: 60, b: 95 },
      { n: 'SEPM', a: 25, c: 30, b: 45 }
    ];
    const tbl = E('div', 'w-table'); box.appendChild(tbl);
    let h = '<table><tr><th>Element</th><th>Low</th><th>Most likely</th><th>High</th></tr>';
    els.forEach((e, i) => { h += `<tr><td>${e.n}</td>` + ['a', 'c', 'b'].map(k => `<td><input type="number" data-i="${i}" data-k="${k}" value="${e[k]}"></td>`).join('') + '</tr>'; });
    tbl.innerHTML = h + '</table>';
    tbl.querySelectorAll('input').forEach(inp => inp.oninput = () => { const x = parseFloat(inp.value); if (isFinite(x)) { els[inp.dataset.i][inp.dataset.k] = x; go(); } });
    const v = controls(box, [
      { k: 'rho', label: 'Correlation ρ', min: 0, max: 1, step: 0.05, v: 0.2, fmt: x => x.toFixed(2) },
      { k: 'n', label: 'Trials', type: 'select', v: '5000', options: [['1000', '1,000'], ['5000', '5,000'], ['20000', '20,000']] }
    ], go);
    const row = E('div', 'w-2col'); const L = E('div'), R = E('div'); row.append(L, R); box.appendChild(row);
    const ro = readout(box);
    function go() {
      const N = +v.n;
      const s = M.mcSum(els, v.rho, N, 11), s0 = M.mcSum(els, 0, N, 11);
      const pe = els.reduce((a, e) => a + e.c, 0);
      const mu = mean(s), sdev = sd(s);
      const above = s.findIndex(x => x > pe), pctOfPE = (above < 0 ? N : above) / N;
      const p80 = quant(s, 0.8), p80ind = quant(s0, 0.8);
      L.innerHTML = ''; R.innerHTML = '';
      const bins = 30, lo = Math.min(s[0], s0[0]), hi = Math.max(s[N - 1], s0[N - 1]), w = (hi - lo) / bins || 1, cnt = new Array(bins).fill(0);
      s.forEach(x => cnt[Math.min(bins - 1, Math.floor((x - lo) / w))]++);
      const p1 = Plot.create(L, { w: 300, h: 230, xmin: lo, xmax: hi, ymin: 0, ymax: Math.max(...cnt) * 1.1, xlabel: 'total cost', ylabel: 'frequency', yfmt: () => '' });
      p1.axes(); cnt.forEach((c, i) => p1.rect(lo + i * w, 0, lo + (i + 1) * w, c, 'bar'));
      p1.vline(pe, 'marker c2'); p1.vline(mu, 'marker c1');
      const step = Math.ceil(N / 300);
      const curve = arr => arr.filter((_, i) => i % step === 0).map((x, i) => [x, (i * step) / N]);
      const p2 = Plot.create(R, { w: 300, h: 230, xmin: lo, xmax: hi, ymin: 0, ymax: 1, xlabel: 'total cost', ylabel: 'confidence', yfmt: x => (x * 100).toFixed(0) + '%' });
      p2.axes(); p2.line(curve(s0), 'series ghost'); p2.line(curve(s), 'series c1');
      p2.vline(pe, 'marker c2'); p2.hline(0.8, 'marker');
      ro([
        ['Point estimate (sum of modes)', f2(pe, 1), 'c2t'],
        ['Percentile of point estimate', pct(pctOfPE, 0), 'bad'],
        ['Mean of total', f2(mu, 1), 'c1t'], ['Std dev of total', f2(sdev, 1)],
        ['50th percentile', f2(quant(s, 0.5), 1)], ['80th percentile', f2(p80, 1)],
        ['80th percentile with ρ = 0', f2(p80ind, 1)],
        ['Sum of element means', f2(els.reduce((a, e) => a + (e.a + e.b + e.c) / 3, 0), 1)]
      ]);
      publish(box, { pe, pePct: pctOfPE, mean: mu, sd: sdev, p50: quant(s, 0.5), p70: quant(s, 0.7), p80, p80ind, p80gap: p80 - p80ind });
    }
    go();
  };
```

- [ ] **Step 4: Add the break-even panel to `npv`.** In `reg['npv']`, add `const pb2 = E('div'); box.appendChild(pb2);` directly after the `legend(...)` line. In `draw()`, add `pb2.innerHTML = '';` next to `pb.innerHTML = '';`, and replace the final `ro([...]);` with:

```js
      const gap = r => M.pvCost(v.ia, v.ca, v.n, r, v.mid === 'mid') - M.pvCost(v.ib, v.cb, v.n, r, v.mid === 'mid');
      const beRate = M.bisect(gap, 0, 0.2);
      const gs = []; for (let i = 0; i <= 40; i++) gs.push([0.1 * i / 40, gap(0.1 * i / 40)]);
      const gy = gs.map(q => q[1]), glo = Math.min(0, ...gy), ghi = Math.max(0, ...gy), gpad = (ghi - glo) * 0.1 || 1;
      const q = Plot.create(pb2, { h: 180, xmin: 0, xmax: 0.1, ymin: glo - gpad, ymax: ghi + gpad, xlabel: 'discount rate', ylabel: 'PV(A) − PV(B)', xfmt: x => (x * 100).toFixed(0) + '%' });
      q.axes(); q.hline(0, 'marker'); q.line(gs, 'series c3'); q.vline(v.r, 'marker hot');
      if (beRate <= 0.1) q.vline(beRate, 'marker c2');
      ro([
        ['PV of cost, A', f2(pvA, 1), pvA <= pvB ? 'good' : ''], ['PV of cost, B', f2(pvB, 1), pvB < pvA ? 'good' : ''],
        ['Undiscounted A / B', `${f2(undA, 0)} / ${f2(undB, 0)}`],
        ['Discounted break-even', be],
        ['Break-even discount rate', isFinite(beRate) ? pct(beRate, 2) : 'none from 0% to 20%'],
        ['EUAC A / B', `${f2(pvA / sumDf, 1)} / ${f2(pvB / sumDf, 1)}`],
        ['SIR of B over A = PV savings / extra investment', v.ib !== v.ia ? f2(sir, 2) : '—', sir > 1 ? 'good' : 'bad']
      ]);
      publish(box, { pvA, pvB, diff: pvA - pvB, sir, beRate });
```

Delete the `publish(...)` line that Task 3 added at the end of `npv`'s `draw()` (it is replaced by the one above).

- [ ] **Step 5: Style for the dashed comparison curve.** Append after the `.plot .series.hand` rule:

```css
.plot .series.ghost { stroke: var(--muted); stroke-dasharray: 5 4; stroke-width: 1.6; }
```

- [ ] **Step 6: Run the harness and tests**

Run: `npm run check:challenges && npm test`
Expected: `SUMMARY ALL PASSED`, and all tests pass.

- [ ] **Step 7: Browser check.** In M9 → `scurve`, moving ρ redraws immediately (there's no Run button), and the dashed curve stays put. At ρ = 0.6 the readout shows the 80th percentile about 10 above the ρ = 0 row. In M13 → `comparison`, the lower panel crosses zero at about 7.6% with the defaults.

- [ ] **Step 8: Commit**

```bash
git add js/widgets.js js/widget-meta.js css/styles.css
git commit -m "feat: seeded live Monte Carlo with correlation ghost; NPV break-even rate"
```

---

### Task 8: EVM over time

**Files:**
- Modify: `js/widgets.js` (`reg['evm']`)
- Modify: `js/widget-meta.js`

**Interfaces:**
- `evm`: controls `['sc', 'bac', 'm']`, outputs `['m', 'pv', 'ev', 'ac', 'cv', 'sv', 'cpi', 'spi', 'eac', 'tcpi', 'vac']`. The scenarios come from `M.evmAt`. In `overrun`, CPI first drops below 0.90 at month 14 (0.895), and at month 10 CPI = 0.925 and TCPI = 1.083.

- [ ] **Step 1: Update the manifest**

```js
    'evm': { controls: ['sc', 'bac', 'm'], setters: [], outputs: ['m', 'pv', 'ev', 'ac', 'cv', 'sv', 'cpi', 'spi', 'eac', 'tcpi', 'vac'] },
```

- [ ] **Step 2: Run the harness and confirm it fails**

Run: `npm run check:challenges`
Expected: `FAIL widget evm ...`.

- [ ] **Step 3: Replace `reg['evm']`** with:

```js
  reg['evm'] = box => {
    title(box, 'Earned value over time', 'scrub the month and watch the indices move');
    const v = controls(box, [
      { k: 'sc', label: 'Scenario', type: 'select', v: 'overrun', options: [['track', 'On plan'], ['overrun', 'Growing cost overrun'], ['late', 'Behind schedule, on cost']] },
      { k: 'bac', label: 'BAC', type: 'number', v: 1000 },
      { k: 'm', label: 'Month', min: 1, max: 24, step: 1, v: 6 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    legend(box, [['c3', 'PV (plan)'], ['c1', 'EV (earned)'], ['c2', 'AC (actual cost)']]);
    const ro = readout(box);
    function draw() {
      pb.innerHTML = '';
      const bac = v.bac, m = Math.round(v.m);
      const at = t => M.evmAt(v.sc, bac, t);
      const curve = (k, upto) => { const out = []; for (let t = 0; t <= upto + 1e-9; t += 0.25) out.push([t, at(t)[k]]); return out; };
      const { pv, ev, ac } = at(m);
      const cv = ev - ac, sv = ev - pv, cpi = ev / ac, spi = ev / pv;
      const eac = bac / cpi, tcpi = (bac - ev) / (bac - ac), open = bac > ac;
      const p = Plot.create(pb, { xmin: 0, xmax: 24, ymin: 0, ymax: Math.max(bac, at(24).ac) * 1.05, xlabel: 'month', ylabel: 'cumulative $' });
      p.axes(); p.hline(bac, 'marker'); p.text(0.4, bac * 1.02, 'BAC', 'annot');
      p.line(curve('pv', 24), 'series c3'); p.line(curve('ev', m), 'series c1'); p.line(curve('ac', m), 'series c2');
      p.vline(m, 'marker hot');
      ro([
        ['PV / EV / AC', `${f2(pv, 0)} / ${f2(ev, 0)} / ${f2(ac, 0)}`],
        ['CV = EV − AC', f2(cv, 0), cv < 0 ? 'bad' : 'good'], ['SV = EV − PV', f2(sv, 0), sv < 0 ? 'bad' : 'good'],
        ['CPI = EV/AC', f2(cpi, 3), cpi < 1 ? 'bad' : 'good'], ['SPI = EV/PV', f2(spi, 3), spi < 1 ? 'bad' : 'good'],
        ['EAC = BAC/CPI', f2(eac, 0)], ['VAC = BAC − EAC', f2(bac - eac, 0), bac - eac < 0 ? 'bad' : 'good'],
        ['TCPI = (BAC − EV)/(BAC − AC)', open ? f2(tcpi, 3) : 'n/a (BAC already spent)', open && tcpi - cpi > 0.1 ? 'bad' : ''],
        ['TCPI − CPI', open ? f2(tcpi - cpi, 3) + (tcpi - cpi > 0.1 ? ' (unrealistic)' : '') : '—']
      ]);
      publish(box, { m, pv, ev, ac, cv, sv, cpi, spi, eac, tcpi, vac: bac - eac });
    }
    draw();
  };
```

- [ ] **Step 4: Run the harness and tests**

Run: `npm run check:challenges && npm test`
Expected: `SUMMARY ALL PASSED`, and all tests pass.

- [ ] **Step 5: Commit**

```bash
git add js/widgets.js js/widget-meta.js
git commit -m "feat: EVM widget with time scrubber and scenarios"
```

---

### Task 9: New widgets: normalize and method-phase

**Files:**
- Modify: `js/widgets.js` (add before `// M1/M5: TRL ladder`)
- Modify: `js/widget-meta.js`
- Modify: `css/styles.css`

**Interfaces:**
- `normalize`: controls `['units', 'infl', 'qty']` (values `'0'`/`'1'`), outputs `['r2', 'nAdjust', 'byValue']`. `byValue` is point 1 under the current toggles: 4.31755 × 1.025^12 = 5.807 with units and infl on.
- `method-phase`: controls `['phase']` (0-4), outputs `['phase', 'dominant']` (0 analogy, 1 parametric, 2 build-up, 3 actuals).

- [ ] **Step 1: Add manifest entries**

```js
    'normalize': { controls: ['units', 'infl', 'qty'], setters: [], outputs: ['r2', 'nAdjust', 'byValue'] },
    'method-phase': { controls: ['phase'], setters: [], outputs: ['phase', 'dominant'] },
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `npm test -- widgets`
Expected: FAIL `manifest lists exactly the registered widgets`.

- [ ] **Step 3: Add the widgets** to `js/widgets.js`, before `// M1/M5: TRL ladder`:

```js
  // M4: normalization lab
  reg['normalize'] = box => {
    title(box, 'Normalize the data', 'eight historical programs; turn each adjustment on');
    const onoff = [['0', 'Off'], ['1', 'On']];
    const v = controls(box, [
      { k: 'units', label: 'Convert $K to $M', type: 'select', v: '0', options: onoff },
      { k: 'infl', label: 'Escalate TY$ to BY2026$ (2.5%/yr)', type: 'select', v: '0', options: onoff },
      { k: 'qty', label: 'Adjust lot average to T1 (90% curve)', type: 'select', v: '0', options: onoff }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    const tb = E('div', 'w-table'); box.appendChild(tb);
    const ro = readout(box);
    function draw() {
      const o = { units: v.units === '1', infl: v.infl === '1', qty: v.qty === '1' };
      const D = M.NORM_DATA, ys = D.map(d => M.normalizeCost(d, o));
      const fit = ols(D.map(d => d.kg), ys);
      pb.innerHTML = '';
      const p = Plot.create(pb, { h: 260, xmin: 0, xmax: 650, ymin: 0, ymax: Math.max(...ys) * 1.1, xlabel: 'weight (kg)', ylabel: o.units ? 'cost ($M)' : 'cost (mixed $K and $M)' });
      p.axes(); p.fn(x => fit.b0 + fit.b1 * x, 'series c1');
      D.forEach((d, i) => p.dot(d.kg, ys[i], i === 0 ? 'pt hot' : d.k && !o.units ? 'pt bad' : 'pt', i === 0 ? 7 : 5));
      tb.innerHTML = '<table><tr><th>#</th><th>kg</th><th>Year (TY$)</th><th>Lot midpoint</th><th>Recorded</th><th>Normalized</th></tr>' +
        D.map((d, i) => `<tr><td>${i + 1}${i === 0 ? ' ★' : ''}</td><td>${d.kg}</td><td>${d.y}</td><td>${d.q}</td><td>${f2(d.rec)} ${d.k ? '$K' : '$M'}</td><td>${f2(ys[i], 3)}</td></tr>`).join('') + '</table>';
      const nAdjust = [o.units, o.infl, o.qty].filter(Boolean).length;
      ro([['Adjustments on', nAdjust + ' of 3'], ['$R^2$ of cost vs. weight', f2(fit.r2, 3), fit.r2 > 0.99 ? 'good' : 'bad'], ['Point 1 (★) normalized', f2(ys[0], 3)]]);
      publish(box, { r2: fit.r2, nAdjust, byValue: ys[0] });
    }
    draw();
  };

  // M2: estimating method by life-cycle phase
  reg['method-phase'] = box => {
    title(box, 'Which method, when?', 'illustrative mix of techniques as a program matures');
    const v = controls(box, [{ k: 'phase', label: 'Phase', min: 0, max: 4, step: 1, v: 0, fmt: i => M.PHASES[Math.round(i)] }], draw);
    const pb = E('div'); box.appendChild(pb);
    legend(box, M.METHODS.map((n, i) => ['m' + i, n]));
    const ro = readout(box);
    const short = ['Concept', 'Tech dev', 'EMD', 'Production', 'O&S'];
    function draw() {
      pb.innerHTML = '';
      const ph = Math.round(v.phase), W = M.METHOD_WEIGHTS;
      const p = Plot.create(pb, { h: 240, xmin: 0, xmax: 4, ymin: 0, ymax: 1, xticks: 4, xlabel: 'life-cycle phase', ylabel: 'share of the estimate', xfmt: i => short[Math.round(i)] || '', yfmt: y => Math.round(y * 100) + '%' });
      p.axes();
      for (let k = 0; k < 4; k++) {
        const top = W.map((w, i) => [i, w.slice(0, k + 1).reduce((s, x) => s + x, 0)]);
        const bot = W.map((w, i) => [i, w.slice(0, k).reduce((s, x) => s + x, 0)]).reverse();
        const d = top.concat(bot).map((q, i) => (i ? 'L' : 'M') + p.x(q[0]).toFixed(1) + ' ' + p.y(q[1]).toFixed(1)).join(' ') + ' Z';
        Plot.svgEl('path', { d, class: 'stack m' + k }, p.svg);
      }
      p.vline(ph, 'marker hot');
      const w = W[ph], dom = w.indexOf(Math.max(...w));
      ro(M.METHODS.map((n, i) => [n, pct(w[i], 0), i === dom ? 'good' : '']));
      publish(box, { phase: ph, dominant: dom });
    }
    draw();
  };
```

- [ ] **Step 4: Styles.** Append:

```css
.plot .stack { stroke: var(--paper); stroke-width: 1; }
.plot .stack.m0, .sw.m0 { fill: color-mix(in srgb, var(--c1) 55%, transparent); background: color-mix(in srgb, var(--c1) 55%, transparent) !important; }
.plot .stack.m1, .sw.m1 { fill: color-mix(in srgb, var(--c2) 55%, transparent); background: color-mix(in srgb, var(--c2) 55%, transparent) !important; }
.plot .stack.m2, .sw.m2 { fill: color-mix(in srgb, var(--c3) 55%, transparent); background: color-mix(in srgb, var(--c3) 55%, transparent) !important; }
.plot .stack.m3, .sw.m3 { fill: color-mix(in srgb, var(--mid) 65%, transparent); background: color-mix(in srgb, var(--mid) 65%, transparent) !important; }
.sw.m0, .sw.m1, .sw.m2, .sw.m3 { height: 10px !important; }
```


- [ ] **Step 5: Run the tests and harness**

Run: `npm test && npm run check:challenges`
Expected: all tests pass and `SUMMARY ALL PASSED` (18 widget lines).

- [ ] **Step 6: Browser check.** Temporarily add `:::widget normalize:::` and `:::widget method-phase:::` to a section (`content/m04.js` `normalization`), then check them in light and dark theme:
- normalize: the $K points shoot high until units is on, and R² turns green with all three on.
- method-phase: the stacked bands are readable, and the Phase label shows the full phase name.

Revert the temporary lines.

- [ ] **Step 7: Commit**

```bash
git add js/widgets.js js/widget-meta.js css/styles.css
git commit -m "feat: normalization lab and method-by-phase widgets"
```

---

### Task 10: New widgets: ci-sim and lockin

**Files:**
- Modify: `js/widgets.js` (add before `// M1/M5: TRL ladder`)
- Modify: `js/widget-meta.js`
- Modify: `css/styles.css`

**Interfaces:**
- `ci-sim`: controls `['n', 'level', 'method']`, setter `seed`, outputs `['n', 'coverage', 'halfWidth']`. With seed 1, k = 1000 and n = 5: z gives 0.885 and t gives 0.958.
- `lockin`: controls `['x']` (0-100), outputs `['x', 'committed', 'spent', 'gap', 'phase']`. The gap is at least 0.80 for x = 33..38 and peaks at x = 35 (about 0.805).

- [ ] **Step 1: Add manifest entries**

```js
    'ci-sim': { controls: ['n', 'level', 'method'], setters: ['seed'], outputs: ['n', 'coverage', 'halfWidth'] },
    'lockin': { controls: ['x'], setters: [], outputs: ['x', 'committed', 'spent', 'gap', 'phase'] },
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `npm test -- widgets`
Expected: FAIL `manifest lists exactly the registered widgets`.

- [ ] **Step 3: Add the widgets** before `// M1/M5: TRL ladder`:

```js
  // M10: confidence interval coverage
  reg['ci-sim'] = box => {
    title(box, 'Confidence interval simulator', 'population is normal with μ = 100, σ = 15');
    const v = controls(box, [
      { k: 'n', label: 'Sample size n', min: 2, max: 60, step: 1, v: 10 },
      { k: 'level', label: 'Confidence level', type: 'select', v: '0.95', options: [['0.9', '90%'], ['0.95', '95%'], ['0.99', '99%']] },
      { k: 'method', label: 'Critical value', type: 'select', v: 't', options: [['t', 't with n − 1 df'], ['z', 'z (treats s as if it were σ)']] }
    ], draw);
    let seed = +preset(box, 'seed', 1);
    box.w.setters.seed = s => { seed = +s; draw(); };
    const again = E('button', 'btn small ghost', 'Draw new samples');
    again.onclick = () => { seed++; draw(); };
    box.appendChild(again);
    const pb = E('div'); box.appendChild(pb);
    legend(box, [['c1', 'interval covers μ'], ['bad', 'interval misses μ'], ['c2', 'true μ']]);
    const ro = readout(box);
    function draw() {
      const n = Math.round(v.n), level = parseFloat(v.level);
      const r = M.ciSim({ n, level, method: v.method, seed, k: 1000, mu: 100, sigma: 15 });
      pb.innerHTML = '';
      const shown = r.intervals.slice(0, 40);
      const lo = Math.min(70, ...shown.map(q => q[0])), hi = Math.max(130, ...shown.map(q => q[1]));
      const p = Plot.create(pb, { h: 300, xmin: lo, xmax: hi, ymin: 0, ymax: 41, yticks: 2, xlabel: 'interval for μ (first 40 samples)', yfmt: () => '', pad: { l: 20, r: 16, t: 10, b: 40 } });
      p.axes(); p.vline(100, 'marker c2');
      shown.forEach((q, i) => p.seg(q[0], i + 1, q[1], i + 1, q[2] ? 'ci-hit' : 'ci-miss'));
      ro([
        ['Critical value', f2(r.crit, 3)],
        ['Intervals covering μ (of 1,000)', pct(r.coverage, 1), Math.abs(r.coverage - level) < 0.02 ? 'good' : 'bad'],
        ['Nominal level', pct(level, 0)],
        ['Average half-width', f2(r.halfWidth, 2)]
      ]);
      publish(box, { n, coverage: r.coverage, halfWidth: r.halfWidth });
    }
    draw();
  };

  // M16: locked-in vs. spent life-cycle cost
  reg['lockin'] = box => {
    title(box, 'Locked-in vs. spent', 'illustrative life-cycle curves');
    const v = controls(box, [{ k: 'x', label: 'Point in the life cycle', min: 0, max: 100, step: 1, v: 5, fmt: x => x + '%' }], draw);
    const pb = E('div'); box.appendChild(pb);
    legend(box, [['c2', 'committed (locked in)'], ['c1', 'spent']]);
    const ro = readout(box);
    const starts = [0, 10, 35, 60], labels = ['Concept', 'Design', 'Production', 'O&S'];
    function draw() {
      pb.innerHTML = '';
      const L = M.lockin(v.x);
      const p = Plot.create(pb, { h: 260, xmin: 0, xmax: 100, ymin: 0, ymax: 1.08, xlabel: 'program timeline (%)', ylabel: 'share of life-cycle cost', yfmt: y => Math.round(y * 100) + '%' });
      p.axes();
      starts.slice(1).forEach(b => p.vline(b, 'marker'));
      starts.forEach((s, i) => p.text(s + 1, 1.04, labels[i], 'annot'));
      p.fn(x => M.lockin(x).committed, 'series c2');
      p.fn(x => M.lockin(x).spent, 'series c1');
      p.seg(v.x, L.spent, v.x, L.committed, 'marker hot');
      ro([['Phase', M.LOCK_PHASES[L.phase]], ['Committed', pct(L.committed, 0)], ['Spent', pct(L.spent, 0)], ['Gap (committed − spent)', pct(L.gap, 1), 'c2t']]);
      publish(box, { x: v.x, committed: L.committed, spent: L.spent, gap: L.gap, phase: L.phase });
    }
    draw();
  };
```

- [ ] **Step 4: Styles.** Append:

```css
.plot .ci-hit { stroke: var(--c1); stroke-width: 2.2; }
.plot .ci-miss { stroke: var(--bad); stroke-width: 2.8; }
.sw.bad { background: var(--bad) !important; }
```

- [ ] **Step 5: Run the tests and harness**

Run: `npm test && npm run check:challenges`
Expected: all tests pass and `SUMMARY ALL PASSED` (20 widget lines).

- [ ] **Step 6: Browser check.** Temporarily place both widgets in a section and check light and dark theme:
- ci-sim: n = 5 with z shows noticeably more red bars than with t, and "Draw new samples" changes the bars.
- lockin: the scrubber moves the red segment between the curves, and the phase labels don't overlap.

Revert the temporary lines.

- [ ] **Step 7: Commit**

```bash
git add js/widgets.js js/widget-meta.js css/styles.css
git commit -m "feat: confidence interval simulator and lock-in widgets"
```

---

### Authoring rules for Tasks 11-14

Every authoring task follows the same steps:
1. Insert each block exactly as given, with one blank line before and after it.
   - "After `:::widget X:::`" means on the lines after that widget line. If that line ends the section (it is followed directly by the closing backtick of `body: String.raw\`...\``), put the blocks before the backtick.
   - "End of section `id`" means just before the closing backtick of that section's `body`.
2. Run `npm run validate`, then `npm run check:challenges`.
3. Compare each predict `answer` line with the numbers in its explanation.
4. Commit.

Blocks are written for the `String.raw` body, so `\$` stays as typed. Never add `+++`.

### Task 11: Author challenges for M1-M4

**Files:**
- Modify: `content/m01.js`, `content/m02.js`, `content/m03.js`, `content/m04.js`

**Interfaces:** consumes the widgets `trl`, `analogy`, `method-phase`, `regression` (preset `tight`, `outlier`) and `normalize`.

- [ ] **Step 1: M1, section `trl`, after `:::widget trl:::`**

```
:::challenge trl
Q: A full system prototype has flown in its operational environment, but the production system hasn't been qualified yet. Which TRL is it?
* TRL 7
- TRL 6
- TRL 8
- TRL 9
> TRL 7 is a system prototype demonstrated in an operational environment. TRL 6 stops at a relevant environment; TRL 8 needs the actual system completed and qualified.
:::

:::challenge trl
Q: A breadboard of a new sensor has been validated, but only on a lab bench. Which TRL is it?
* TRL 4
- TRL 3
- TRL 5
- TRL 6
> TRL 4 is component or breadboard validation in a laboratory environment. The same breadboard validated in a relevant environment would be TRL 5.
:::
```

- [ ] **Step 2: M2, end of section `analogy`**

```
:::challenge analogy c0=50 s0=1000 s1=1400 b=0.7 cx=1 lock=c0,s0,s1,cx
Q: The analog cost \$50M at a size of 1,000; the new system is 1,400. Adjust the scaling exponent until the size-adjusted cost is **\$60M**.
goal: sized ~ 60 +- 0.5%
show: b=0.55
> $50 \times 1.4^{b} = 60$ gives $b = \ln 1.2 / \ln 1.4 \approx 0.54$. An exponent below 1 means cost grows more slowly than size (economies of scale). With $b = 1$, linear scaling would give \$70M.
:::
```

- [ ] **Step 3: M2, end of section `lifecycle`**

```
:::challenge method-phase
Q: Slide through the phases. In which phase does engineering build-up first become the leading technique?
* Production & deployment
- Engineering & Manufacturing Development
- Technology development
- Operations & support
> In EMD the estimate is still mostly parametric while build-up grows. By production, detailed drawings, vendor quotes and early actuals make build-up the main technique. In O&S, actuals-based trends take over.
:::
```

- [ ] **Step 4: M3, section `process`, after `:::widget regression:::`**

```
:::challenge regression data=tight lock=mode
Q: This tight data set has $R^2$ near 1. Drag **one** point until $R^2$ drops below 0.5.
goal: r2 < 0.5
show: data=outlier
> A single bad point can wreck a CER. $R^2$ compares explained variation with total variation, and one far-off point adds a lot of unexplained variation. Check the data for errors and outliers before you trust a fit.
:::
```

- [ ] **Step 5: M4, end of section `normalization`**

```
:::challenge normalize
Q: These eight data points were recorded in different years, lot sizes and units, so the cost-vs-weight scatter is meaningless. Turn on adjustments until $R^2$ is above 0.99.
goal: r2 > 0.99
show: units=1 infl=1 qty=1
> All three are needed: the same units (\$M), the same base-year dollars (BY2026), and the same point on the learning curve (T1). With only units and inflation fixed, lot averages from large lots still sit low. Normalization is what makes the real relationship visible.
:::

:::challenge normalize units=1 infl=1 lock=units,infl,qty
Q: Point 1 was recorded as \$4,317.55K in 2014 dollars. Convert it to \$M and escalate it to BY2026 at 2.5% a year (12 years). What is it worth?
predict: byValue +- 1%
> $4.31755 \times 1.025^{12} = 4.31755 \times 1.3449 \approx 5.81$, so about \$5.81M. Moving to a later base year multiplies by the index ratio; moving to an earlier one divides.
:::
```

- [ ] **Step 6: Validate and run the harness**

Run: `npm run validate`
Expected: `OK`. m01: 2 challenges, m02: 2, m03: 1, m04: 2.

Run: `npm run check:challenges`
Expected: `SUMMARY ALL PASSED`, including `PASS m04/normalization#c1 answer byValue = 5.807`.

- [ ] **Step 7: Commit**

```bash
git add content/m01.js content/m02.js content/m03.js content/m04.js
git commit -m "content: challenges for modules 1-4"
```

---

### Task 12: Author challenges for M5-M8

**Files:**
- Modify: `content/m05.js`, `content/m06.js`, `content/m07.js`, `content/m08.js`

**Interfaces:** consumes `escalation`, `stats-lab` (setter `data`), `lc-explorer`, `lmp`, `regression` (`mode`, `hand`, `data`) and `transform`.

- [ ] **Step 1: M5, end of section `indices`**

```
:::widget escalation:::

:::challenge escalation r=0.025 o1=0.5 o2=0.35 o3=0.15 amt=100 lock=r,o1,o2,o3,amt
Q: 100 BY2025\$ of work will be appropriated in 2025 and outlaid 50% / 35% / 15% over three years at 2.5% inflation. Predict the TY\$ you must appropriate in 2025.
predict: tyBY +- 0.5%
> The weighted index is $0.50(1) + 0.35(1.025) + 0.15(1.025^2) = 1.0163$, so you need about \$101.63 TY. The raw index for 2025 is 1.0000, but money appropriated in 2025 is spent at later price levels.
:::

:::challenge escalation r=0.025 o1=0.5 o2=0.35 o3=0.15 amt=100 lock=o1,o2,o3,amt
Q: Keep the same outlay profile. Find the inflation rate at which the 2025 appropriation must be about **\$103** (within \$0.10).
goal: tyBY ~ 103 +- 0.1
show: r=0.045
> The appropriation grows by about $0.65r$ (the 35% and 15% of outlays that fall in later years), so about 4.5% gives \$103. A longer outlay tail makes the weighted index more sensitive to inflation.
:::
```

- [ ] **Step 2: M6, section `central`, after `:::widget stats-lab:::`**

```
:::challenge stats-lab data=12,15,18,15,22,15,19
Q: Edit the data so the **mean rises above 20** while the **median stays at 15**. Change only one number.
goal: mean > 20
goal: median ~ 15 +- 0
show: data=12,15,18,15,22,15,48
> The median depends only on the middle value, so changing an extreme value leaves it alone. The mean uses every value, so one large number pulls it up. That's why the median is the more robust center for skewed cost data.
:::
```

- [ ] **Step 3: M6, end of section `dispersion`**

```
:::challenge stats-lab data=229.70,221.58,244.94,250.66
Q: For the four freight costs (229.70, 221.58, 244.94, 250.66), predict the coefficient of variation. Type it with a % sign, e.g. 7%.
predict: cv +- 5%
> $CV = s / \bar{x} \approx 13.42 / 236.72 \approx 5.67\%$. A CV this small means the spread is tight relative to the mean.
:::
```

- [ ] **Step 4: M7, section `equation`, after the `:::widget lc-explorer:::` line**

```
:::challenge lc-explorer theory=ulc t1=100 lcs=0.95 n=8 log=unit lock=theory,t1,n,log
Q: T1 is \$100. Drag the LCS slider until unit 8 costs **\$51.20**.
goal: unitN ~ 51.2 +- 0.5%
show: lcs=0.8
> Unit 8 is three doublings from unit 1, so $Y_8 = 100 \times LCS^3$. Setting $LCS^3 = 0.512$ gives $LCS = 0.80$: 100, 80, 64, 51.2.
:::
```

- [ ] **Step 5: M7, section `theories`, after the `:::widget lc-explorer:::` line**

```
:::challenge lc-explorer theory=cum t1=100 lcs=0.9 n=4 lock=theory,t1,lcs,n
Q: Under **cumulative average** theory, with T1 = \$100 and a 90% slope, predict the cumulative average cost through unit 4.
predict: cavN +- 1%
> Under Wright's theory the curve gives the cumulative average directly: $\bar{Y}_4 = 100 \times 0.9^2 = 81$. Unit 4 by itself costs less than 81, because the average still carries the more expensive early units.
:::
```

- [ ] **Step 6: M7, section `lmp`, after `:::widget lmp:::`**

```
:::challenge lmp F=4 L=8 lcs=0.85 lock=F,L,lcs
Q: For a lot of units 4 through 8 on an 85% curve, predict the true lot midpoint. Use the heuristic: the average of the arithmetic and geometric means.
predict: exact +- 2%
> Arithmetic mean 6, geometric mean $\sqrt{32} = 5.657$, heuristic 5.83. The exact LMP is 5.79, so the heuristic lands within 1%.
:::
```

- [ ] **Step 7: M8, section `fit`, after `:::widget regression:::`**

```
:::challenge regression data=seeker mode=hand lock=mode
Q: Fit the Seeker data **by hand**. Drag the two orange handles until your line's total squared error is within 5% of the best possible.
goal: ratio < 1.05
show: hand=ols
> The shaded squares are the squared residuals, and OLS picks the one line with the smallest total area. For these data that's $\hat{Y} = 2.50 + 0.585X$, with SSE about 18.17. Every other line leaves more area.
:::
```

- [ ] **Step 8: M8, section `residuals`, after `:::widget regression:::`**

```
:::challenge regression data=funnel mode=ols lock=mode
Q: Look at the residual plot below the fit. What problem does it show?
* The spread of the residuals grows with X (heteroscedasticity)
- The residuals follow a curve, so the relationship is nonlinear
- One outlier dominates the fit
- Nothing is wrong, since the residuals average zero
> A funnel shape means the error variance isn't constant, which breaks an OLS assumption and makes the SEE and t-tests unreliable. A log transformation or weighted regression usually helps.
:::
```

- [ ] **Step 9: M8, section `nonlinear`, after `:::widget transform:::`**

```
:::challenge transform f=power
Q: These data follow a power function $y = a x^b$. In which space do they plot as a straight line?
* Log-log (ln y against ln x)
- Semi-log (ln y against x)
- Unit space (y against x)
> Taking logs gives $\ln y = \ln a + b \ln x$, which is linear in $\ln x$. Semi-log straightens exponentials. The learning curve is a power function, which is why it plots straight on log-log paper.
:::
```

- [ ] **Step 10: Validate and run the harness**

Run: `npm run validate`
Expected: `OK`. m05: 2, m06: 2, m07: 3, m08: 3.

Run: `npm run check:challenges`
Expected: `SUMMARY ALL PASSED`, with these answer lines:
- `m05/indices#c0 answer tyBY = 101.6`
- `m06/dispersion#c0 answer cv = 0.0567`
- `m07/theories#c0 answer cavN = 81`
- `m07/lmp#c0 answer exact = 5.786`

- [ ] **Step 11: Commit**

```bash
git add content/m05.js content/m06.js content/m07.js content/m08.js
git commit -m "content: challenges for modules 5-8"
```

---

### Task 13: Author challenges for M9-M12

**Files:**
- Modify: `content/m09.js`, `content/m10.js`, `content/m11.js`, `content/m12.js`

**Interfaces:** consumes `montecarlo` (`p80gap`, seed 11), `dist`, `ci-sim`, `burden` and `sw-effort`.

- [ ] **Step 1: M9, section `scurve`, after `:::widget montecarlo:::`**

```
:::challenge montecarlo rho=0 n=20000 lock=n
Q: The dashed S-curve assumes no correlation between the elements. Raise $\rho$ until the 80th percentile is at least **10** above the uncorrelated P80.
goal: p80gap >= 10
show: rho=0.6
> Positive correlation makes elements overrun together. That widens the spread of the total and pushes up the high percentiles, while the mean stays put. Leaving correlation out understates the risk reserve.
:::

:::challenge montecarlo rho=0.2 n=20000 lock=n
Q: The point estimate is the sum of each element's most likely value. Where does it fall on the S-curve?
* Well below 50%, because right-skewed elements make overruns more likely than underruns
- About 50%, because it's built from the most likely values
- Above 80%
> Each most-likely value sits left of its skewed distribution's mean, so their sum falls below the total's mean and median. Here it lands near the 10th percentile. That's why a point estimate alone carries little confidence.
:::
```

- [ ] **Step 2: M10, section `distributions-basic`, after `:::widget dist:::`**

```
:::challenge dist d=logn p1=40 p2=50
Q: For this lognormal, in what order do the mean, median and mode fall?
* mode < median < mean
- mean < median < mode
- All three are equal
> The lognormal is right-skewed: the long upper tail pulls the mean above the median, and the peak (mode) sits lowest. That's the usual shape of cost data.
:::
```

- [ ] **Step 3: M10, end of section `hypothesis`**

```
:::challenge ci-sim n=5 level=0.95 method=z lock=n,level,method
Q: Each of 1,000 samples of size 5 gets a "95%" interval built with $z = 1.96$ and the sample $s$. Predict what share of them actually contain $\mu$. Type it with a % sign.
predict: coverage +- 0.04
> Only about 88% do. With small $n$, $s$ is itself uncertain, and $z$ ignores that. The $t$ distribution with $n - 1$ df has fatter tails ($t = 2.78$ for 4 df), which restores 95% coverage.
:::

:::challenge ci-sim n=5 level=0.95 method=z lock=n,level
Q: Keep $n = 5$. Change one setting so the intervals really do cover $\mu$ about 95% of the time (at least 94%).
goal: coverage >= 0.94
show: method=t
> Switching to $t$ widens every interval by $2.78 / 1.96$ at 4 df. That's enough to account for estimating $\sigma$ with $s$. As $n$ grows, $t$ approaches $z$ and the difference fades.
:::
```

- [ ] **Step 4: M11, section `process`, after `:::widget burden:::`**

```
:::challenge burden dl=40 oh=1.1 ga=0.12 fee=0.08 hrs=1000 lock=dl,oh,hrs
Q: The customer's independent estimate uses a wrap rate of **\$110/hr**. Direct labor and overhead are fixed. Adjust G&A and fee to match it within \$1.
goal: wrap ~ 110 +- 1
show: ga=0.2 fee=0.09
> Wrap rate $= DL (1 + OH)(1 + G\&A)(1 + fee) = 84 (1 + G\&A)(1 + fee)$. You need $(1 + G\&A)(1 + fee) \approx 1.31$, for example 20% G&A with a 9% fee. Each rate compounds on the ones before it.
:::
```

- [ ] **Step 5: M12, end of section `parametric`**

```
:::widget sw-effort:::

:::challenge sw-effort A=2.94 E=1.1 s=100 lock=A,E
Q: With $E = 1.10$, the program's size doubles from 100 to 200 KSLOC. Predict the factor by which effort grows.
predict: doubleX +- 1%
> Effort scales by $2^{E} = 2^{1.10} \approx 2.14$. Doubling the size more than doubles the effort: that's the diseconomy of scale built into most software cost models.
:::

:::challenge sw-effort A=2.94 E=1.1 s=100 lock=A,s
Q: Find the exponent at which doubling the size exactly doubles the effort.
goal: doubleX ~ 2 +- 0.5%
show: E=1
> At $E = 1$, effort is proportional to size, so productivity (SLOC per person-month) is flat. Above 1, productivity falls as programs grow; below 1, it rises.
:::
```

- [ ] **Step 6: Validate and run the harness**

Run: `npm run validate`
Expected: `OK`. m09: 2, m10: 3, m11: 1, m12: 2.

Run: `npm run check:challenges`
Expected: `SUMMARY ALL PASSED`, with these answer lines:
- `m10/hypothesis#c0 answer coverage = 0.885`
- `m12/parametric#c0 answer doubleX = 2.144`

Also confirm the M9 point-estimate percentile at ρ = 0.2 is near 10%: open M9 → `scurve` and read the widget.

- [ ] **Step 7: Commit**

```bash
git add content/m09.js content/m10.js content/m11.js content/m12.js
git commit -m "content: challenges for modules 9-12"
```

---

### Task 14: Author challenges for M13-M16

**Files:**
- Modify: `content/m13.js`, `content/m14.js`, `content/m15.js`, `content/m16.js`

**Interfaces:** consumes `npv` (`diff`, `beRate`), `fpif` (`ac`), `cpif`, `evm` (scenario `overrun`) and `lockin`.

- [ ] **Step 1: M13, section `comparison`, after `:::widget npv:::`**

```
:::challenge npv r=0.03 lock=ia,ca,ib,cb,n,mid
Q: At 3%, B's lower annual cost outweighs its higher investment. Raise the discount rate until A and B have the same present value (within \$1).
goal: diff ~ 0 +- 1
show: r=0.0775
> Discounting shrinks future savings but not the up-front investment. B's \$22/yr of savings justify its extra \$150 only below about 7.6%; above that rate, A wins. The lower panel shows where the difference crosses zero.
:::

:::challenge npv r=0.03
Q: As the discount rate rises, which alternative gains ground?
* A: low investment, high annual cost
- B: high investment, low annual cost
- Neither, because the rate affects both equally
> A higher rate shrinks the present value of future costs but not today's. Most of A's cost is in the future, so A gains. Capital-heavy alternatives look best at low discount rates.
:::
```

- [ ] **Step 2: M14, section `fpif`, after `:::widget fpif:::`**

```
:::challenge fpif tc=100 tp=10 cp=120 gs=0.7 ac=100 lock=tc,tp,cp,gs
Q: Slide actual cost to the **Point of Total Assumption**, the cost beyond which the contractor pays for every extra dollar.
goal: ac ~ 114.29 +- 1
show: ac=114
> $PTA = (\text{ceiling} - \text{target price}) / \text{gov share} + TC = (120 - 110) / 0.7 + 100 = 114.29$. Past this point the price is capped at the ceiling, so each extra dollar of cost comes out of profit.
:::
```

- [ ] **Step 3: M14, section `cpif`, after `:::widget cpif:::`**

```
:::challenge cpif ac=130
Q: Actual cost comes in at 130, with a target cost of 100, a target fee of 8, a fee range of 3 to 12, and an 80/20 share. What happens to the fee?
* It stops at the minimum fee of 3, and the government pays the rest of the overrun
- It keeps falling 20 cents per dollar and turns negative
- It stays at the target fee of 8
> The RIE here runs from 80 to 125. Past 125, the fee sits at its floor of 3, and a CPIF contract still reimburses allowable cost. That's the key difference from FPIF, where cost above the PTA comes out of the contractor's profit.
:::
```

- [ ] **Step 4: M15, end of section `basics`**

```
:::widget evm:::
```

- [ ] **Step 5: M15, end of section `variances`**

```
:::challenge evm sc=overrun bac=1000 m=6 lock=sc,bac
Q: In this program the cost overrun grows over time. Scrub forward to the **first month** in which CPI drops below 0.90.
goal: cpi < 0.9
goal: cpi > 0.89
show: m=14
> CPI slides from 0.925 at month 10 to 0.895 at month 14. Cumulative CPI moves slowly because each month is averaged into everything before it, so once it slips it's hard to recover.
:::
```

- [ ] **Step 6: M15, end of section `eac`**

```
:::challenge evm sc=overrun bac=1000 m=14 lock=sc,bac,m
Q: At month 14 the CPI is 0.895 and BAC is \$1,000. Predict the EAC using $EAC = BAC / CPI$.
predict: eac +- 0.5%
> $1000 / 0.895 \approx 1117$. The CPI method assumes the remaining work goes at the same efficiency as the work so far.
:::
```

- [ ] **Step 7: M15, end of section `tcpi`**

```
:::challenge evm sc=overrun bac=1000 m=10 lock=sc,bac,m
Q: At month 10, compare the TCPI (to finish on BAC) with the CPI so far. Is finishing on budget realistic?
* No: TCPI is more than 0.10 above CPI
- Yes: TCPI is below CPI
- Yes: TCPI and CPI are about equal
> TCPI is 1.083 against a CPI of 0.925, a gap of 0.16. A TCPI more than about 0.10 above the current CPI would require the remaining work to be done far more efficiently than anything so far, which programs rarely achieve.
:::
```

- [ ] **Step 8: M16, end of section `definition`**

```
:::challenge lockin x=5
Q: Scrub along the life cycle to where the gap between **committed** and **spent** cost is largest (at least 80 percentage points).
goal: gap >= 0.8
show: x=35
> On this illustrative curve the gap peaks around the end of design: about 90% of life-cycle cost is committed while only about 10% has been spent. After that, spending catches up, but the decisions have already been made.
:::

:::challenge lockin x=35 lock=x
Q: At the end of design, which statement matches the "locked in vs. spent" principle?
* Most life-cycle cost is committed, but little has been spent
- Most life-cycle cost has been spent, with little left to commit
- Committed and spent cost rise together
> Design decisions lock in most future cost long before the money is spent. That's why CAIV and target costing push cost management early, while there is still flexibility.
:::
```

- [ ] **Step 9: Validate and run the harness**

Run: `npm run validate`
Expected: `OK`. m13: 2, m14: 2, m15: 3, m16: 2.

Run: `npm run check:challenges`
Expected: `SUMMARY ALL PASSED`, `(34 challenges in content)`, and `m15/eac#c0 answer eac = 1,117`.

- [ ] **Step 10: Commit**

```bash
git add content/m13.js content/m14.js content/m15.js content/m16.js
git commit -m "content: challenges for modules 13-16"
```

---


### Task 15: Final verification

**Files:** none new.

- [ ] **Step 1: Full checks**

Run: `npm test && npm run validate && npm run check:challenges`
Expected:
- Tests: all pass.
- Validate: `OK`, with per-module challenge counts M1 2, M2 2, M3 1, M4 2, M5 2, M6 2, M7 3, M8 3, M9 2, M10 3, M11 1, M12 2, M13 2, M14 2, M15 3, M16 2 (34 total).
- Harness: `SUMMARY ALL PASSED` and `(34 challenges in content)`.

- [ ] **Step 2: Cross-check predict answers.** For each `PASS ... answer <out> = <value>` line in the harness output, confirm that the number in that challenge's `>` explanation matches `<value>` to the shown precision. Expected values:

| Challenge | Output | Value |
|---|---|---|
| m04/normalization | byValue | 5.807 |
| m05/indices | tyBY | 101.6 |
| m06/dispersion | cv | 0.0567 |
| m07/theories | cavN | 81 |
| m07/lmp | exact | 5.786 |
| m10/hypothesis | coverage | 0.885 |
| m12/parametric | doubleX | 2.144 |
| m15/eac | eac | 1,117 |

- [ ] **Step 3: Walk through in the browser** (`npm start`). For one module per authoring task (M2, M7, M10, M15), complete each challenge the way a learner would. Check that:
- the Continue button waits for challenges;
- XP rises (20 for an unaided solve, 10 with Show me);
- a reload keeps completed challenges done;
- existing `:::check` answers in those sections are still marked answered.

- [ ] **Step 4: Rebuild the zip** so the distributable includes the new files. `dist/` is not tracked in git, so this step produces no commit.

Run: `py tools/build_zip.py`, then `py -c "import zipfile;n=zipfile.ZipFile('dist/pcea-study-lab.zip').namelist();print([x for x in n if 'wmath' in x or 'challenge' in x or 'widget-meta' in x])"`
Expected: the list contains `js/wmath.js`, `js/challenge.js` and `js/widget-meta.js`, and nothing under `tools/`.
