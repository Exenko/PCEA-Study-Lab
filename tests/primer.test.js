const assert = require('assert');
const P = require('../js/primer.js');

const SORT = ['Q: Who?', 'buckets: Inside | Outside', '- Program Office = Inside', '- CAPE = Outside', '- GAO = Outside', '> Because.'];
const ORDER = ['Q: Order these.', '1. First', '2. Second', '3. Third', '4. Fourth', '> Because.'];

module.exports = [
  ['parseSort reads prompt, buckets, items, explanation', () => {
    const c = P.parseSort(SORT);
    assert.deepStrictEqual(c.errors, []);
    assert.deepStrictEqual(c.q, ['Who?']);
    assert.deepStrictEqual(c.buckets, ['Inside', 'Outside']);
    assert.deepStrictEqual(c.items[0], { text: 'Program Office', bucket: 'Inside' });
    assert.deepStrictEqual(c.explain, ['Because.']);
  }],
  ['parseSort infers buckets in first-appearance order and splits on the last " = "', () => {
    const c = P.parseSort(['Q: x', '- a = b = B', '- c = A', '- d = B', '> e']);
    assert.deepStrictEqual(c.errors, []);
    assert.deepStrictEqual(c.buckets, ['B', 'A']);
    assert.deepStrictEqual(c.items[0], { text: 'a = b', bucket: 'B' });
  }],
  ['parseSort errors', () => {
    const errs = l => P.parseSort(l).errors.join(' | ');
    assert.match(errs(['Q: x', 'buckets: A | B', '- a = A', '- b = C', '> e']), /unknown bucket C/);
    assert.match(errs(['Q: x', '- a = A', '- b = A', '> e']), /2 buckets/);
    assert.match(errs(['Q: x', 'buckets: A | B', '- a = A', '> e']), /2 items/);
    assert.match(errs(['Q: x', '- a', '- b = B', '- c = A', '> e']), /needs "= bucket"/);
    assert.match(errs(['- a = A', '- b = B', '> e']), /Q:/);
    assert.match(errs(['Q: x', '- a = A', '- b = B']), /explanation/);
    assert.match(errs(['Q: x', '- a = A', 'stray', '- b = B', '> e']), /unexpected/);
  }],
  ['parseOrder reads items in correct order', () => {
    const c = P.parseOrder(ORDER);
    assert.deepStrictEqual(c.errors, []);
    assert.deepStrictEqual(c.q, ['Order these.']);
    assert.deepStrictEqual(c.items, ['First', 'Second', 'Third', 'Fourth']);
    assert.deepStrictEqual(c.explain, ['Because.']);
  }],
  ['parseOrder errors', () => {
    const errs = l => P.parseOrder(l).errors.join(' | ');
    assert.match(errs(['Q: x', '1. a', '3. b', '4. c', '> e']), /numbered 1\.\.n/);
    assert.match(errs(['Q: x', '1. a', '2. b', '> e']), /at least 3/);
    assert.match(errs(['1. a', '2. b', '3. c', '> e']), /Q:/);
    assert.match(errs(['Q: x', '1. a', '2. b', '3. c']), /explanation/);
    assert.match(errs(['Q: x', '1. a', 'stray', '2. b', '3. c', '> e']), /unexpected/);
  }],
  ['shuffle is a deterministic permutation per seed', () => {
    const a = P.shuffle(7, 'm01/process#o0');
    assert.deepStrictEqual(a, P.shuffle(7, 'm01/process#o0'));
    assert.deepStrictEqual([...a].sort((x, y) => x - y), [0, 1, 2, 3, 4, 5, 6]);
    const seen = new Set(['a', 'b', 'c', 'd', 'e'].map(s => P.shuffle(7, s).join()));
    assert.ok(seen.size > 1, 'different seeds give different orders');
  }],
  ['orderStart is a permutation that is never already in order', () => {
    for (let i = 0; i < 300; i++) for (const n of [2, 3, 4, 7]) {
      const p = P.orderStart(n, 'seed' + i);
      assert.ok(p.some((v, k) => v !== k), `n=${n} seed${i}`);
      assert.deepStrictEqual([...p].sort((x, y) => x - y), [...Array(n).keys()]);
    }
  }],
  ['scoreSort and scoreOrder count matching positions', () => {
    const s = P.parseSort(SORT), o = P.parseOrder(ORDER);
    assert.deepStrictEqual(P.scoreSort(s, ['Inside', 'Outside', 'Outside']), { right: 3, total: 3 });
    assert.deepStrictEqual(P.scoreSort(s, ['Outside', 'Outside', 'Inside']), { right: 1, total: 3 });
    assert.deepStrictEqual(P.scoreOrder(o, [0, 1, 2, 3]), { right: 4, total: 4 });
    assert.deepStrictEqual(P.scoreOrder(o, [1, 0, 2, 3]), { right: 2, total: 4 });
  }],
  ['recap text: sort', () => {
    const s = P.parseSort(SORT);
    assert.strictEqual(P.recap('sort', s, ['Inside', 'Outside', 'Outside']), 'You sorted all 3 correctly.');
    assert.strictEqual(P.recap('sort', s, ['Outside', 'Inside', 'Inside']),
      'You sorted 0 of 3 correctly: you put *Program Office* under Outside, but it belongs under Inside; you put *CAPE* under Inside, but it belongs under Outside.');
  }],
  ['recap text: order', () => {
    const o = P.parseOrder(ORDER);
    assert.strictEqual(P.recap('order', o, [0, 1, 2, 3]), 'You had all 4 in the right order.');
    assert.strictEqual(P.recap('order', o, [0, 2, 1, 3]), 'You had 2 of 4 in the right place. Step 2 is actually *Second*.');
  }],
  ['recap text: check', () => {
    const spec = { opts: [{ text: 'Yes', right: false }, { text: 'No', right: true }] };
    assert.strictEqual(P.recap('check', spec, 1), 'You picked *No*, which is correct.');
    assert.strictEqual(P.recap('check', spec, 0), 'You picked *Yes*; the answer is *No*.');
  }],
  ['recap is empty when the stored answer no longer fits the block', () => {
    const s = P.parseSort(SORT), o = P.parseOrder(ORDER);
    assert.strictEqual(P.recap('sort', s, ['Inside', 'Outside']), '');
    assert.strictEqual(P.recap('sort', s, ['Inside', 'Outside', 'Gone']), '');
    assert.strictEqual(P.recap('sort', s, undefined), '');
    assert.strictEqual(P.recap('order', o, [0, 1, 2]), '');
    assert.strictEqual(P.recap('order', o, [0, 0, 1, 2]), '');
    assert.strictEqual(P.recap('check', { opts: [{ text: 'a', right: true }] }, 3), '');
    assert.strictEqual(P.recap('nope', s, []), '');
  }],
  ['save, answered and clear use data.primers and never touch checks', () => {
    const data = { checks: { 'm01/orgs#0': { done: true } } };
    const before = JSON.stringify(data.checks);
    P.save(data, 'm01/orgs', 'sort', ['A', 'B'], '1/2');
    assert.strictEqual(JSON.stringify(data.checks), before);
    const e = P.answered(data, 'm01/orgs');
    assert.deepStrictEqual([e.type, e.answer, e.score], ['sort', ['A', 'B'], '1/2']);
    assert.ok(e.at > 0);
    P.clear(data, 'm01/orgs');
    assert.strictEqual(P.answered(data, 'm01/orgs'), null);
    assert.ok(data.primers['m01/orgs'].cleared);
    assert.strictEqual(P.answered({}, 'x'), null);
  }]
];
