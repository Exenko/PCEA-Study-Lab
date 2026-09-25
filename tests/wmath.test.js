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
