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
