const assert = require('assert');
const P = require('../js/shop/pipeline.js');
const T = require('../js/shop/templates.js');
const N = require('../js/shop/nodes.js');
const REF = require('./fixtures/pipes.js');
const Core = require('../js/shop/core.js');
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
  ['check tolerates malformed refs (non-string, non-object values)', () => {
    const p = { steps: [S('add', { a: 5, b: true })], outs: ['s0'] };
    const msgs = P.check(p, ins, 1, null).map(x => `${x.step}:${x.port}:${x.msg}`);
    assert.ok(msgs.includes('0:a:Not connected'));
    assert.ok(msgs.includes('0:b:Not connected'));
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
  }],
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
  }]
];
