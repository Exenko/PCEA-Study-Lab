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
