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
