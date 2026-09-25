const assert = require('assert');
const C = require('../js/shop/core.js');
const tpl = (id, module) => ({ id, module, section: module + '/x', title: id, gen: (h, tier) => ({ brief: 'b', answers: [{ label: 'x', unit: '', value: h.num(1, 9, 1) * tier }], explain: 'e' }) });
const T = [tpl('a', 'm05'), tpl('b', 'm06'), tpl('c', 'm07')];
const cat = { modules: [{ id: 'm05', cards: [], sections: [] }, { id: 'm06', cards: [], sections: [] }, { id: 'm07', cards: ['m07-1', 'm07-2', 'm07-3'], sections: [] }] };

module.exports = [
  ['rng is deterministic and in range', () => {
    const a = C.rng(42), b = C.rng(42);
    for (let i = 0; i < 100; i++) { const x = a(); assert.strictEqual(x, b()); assert.ok(x >= 0 && x < 1); }
  }],
  ['num respects bounds and step', () => {
    const h = C.helpers(C.rng(1));
    for (let i = 0; i < 500; i++) { const v = h.num(2, 3, 0.25); assert.ok(v >= 2 && v <= 3); assert.strictEqual(Math.round(v * 4), v * 4); }
  }],
  ['answer scoring bands', () => {
    assert.strictEqual(C.answerScore('100.5', 100), 1);
    assert.strictEqual(C.answerScore('104', 100), 0.6);
    assert.strictEqual(C.answerScore('91', 100), 0.2);
    assert.strictEqual(C.answerScore('80', 100), -0.3);
    assert.strictEqual(C.answerScore('', 100), -0.3);
    assert.strictEqual(C.answerScore('1,234', 1234), 1);
  }],
  ['grade combines answers', () => {
    const g = C.grade(['100', '80'], [{ value: 100 }, { value: 100 }], 60);
    assert.strictEqual(g.score, 0.35); assert.strictEqual(g.pay, 21); assert.strictEqual(g.rep, -1);
    assert.strictEqual(C.grade(['100'], [{ value: 100 }], 60).rep, 1);
  }],
  ['state sums cash and clamps reputation', () => {
    const d = { shop: {
      a: { tpl: 'x', pay: -20, rep: -1, score: 0, t: 1 },
      b: { tpl: 'x', pay: 60, rep: 1, score: 1, t: 2 },
      c: { tool: 'opinion', cost: 40, t: 3 }, d: { use: 'opinion', t: 4 }, e: { tool: 'opinion', cost: 40, t: 5 },
      f: { camp: 'alpha', pay: 300, rep: 2, score: 1, t: 6 } } };
    const s = C.state(d);
    assert.strictEqual(s.cash, 260); assert.strictEqual(s.rep, 3); assert.strictEqual(s.repLevel, 1);
    assert.strictEqual(s.completed, 3); assert.strictEqual(s.left('opinion'), 1); assert.ok(s.has('opinion'));
    assert.deepStrictEqual(s.campaign, ['alpha']); assert.strictEqual(s.maxTier, 1); assert.strictEqual(s.nextRep, 4);
  }],
  ['unlocks follow card study', () => {
    assert.deepStrictEqual([...C.unlocked({}, cat)].sort(), ['m05', 'm06']);
    const d = { cards: { 'm07-1': { seen: 2, lvl: 1 } } };
    assert.ok(C.unlocked(d, cat).has('m07'));
    d.cards['m07-1'].lvl = 0;
    assert.ok(!C.unlocked(d, cat).has('m07'));
  }],
  ['offers are deterministic and only from unlocked modules', () => {
    const o1 = C.offers('Ann', {}, cat, T), o2 = C.offers('Ann', {}, cat, T);
    assert.strictEqual(o1.length, 3);
    assert.deepStrictEqual(o1.map(o => [o.tpl.id, o.tier, o.job.answers[0].value]), o2.map(o => [o.tpl.id, o.tier, o.job.answers[0].value]));
    o1.forEach(o => { assert.ok(['m05', 'm06'].includes(o.tpl.module)); assert.strictEqual(o.tier, 1); });
    assert.strictEqual(C.offers('Ann', { shop: { b: { tool: 'board', cost: 400, t: 1 } } }, cat, T).length, 4);
  }],
  ['calculator', () => {
    assert.strictEqual(C.calc('2+3*4'), 14);
    assert.strictEqual(C.calc('-2^2'), -4);
    assert.strictEqual(C.calc('2^3^2'), 512);
    assert.ok(Math.abs(C.calc('ln(0.85)/ln(2)') - Math.log(0.85) / Math.log(2)) < 1e-12);
    assert.ok(Math.abs(C.calc('100*1.03^5') - 100 * Math.pow(1.03, 5)) < 1e-9);
    assert.strictEqual(C.calc('sqrt(16) + abs(-2) + exp(0)'), 7);
    assert.throws(() => C.calc('2+'));
    assert.throws(() => C.calc('alert(1)'));
  }],
  ['state banks collects, charges upgrades, leaves jobs and rep alone', () => {
    const d = { shop: {
      a: { tpl: 'x', pay: 60, rep: 1, score: 1, t: 1 }, b: { collect: 'x', from: 0, to: 5, amount: 42.5, t: 2 },
      c: { upg: 'desk', cost: 300, t: 3 }, e: { upg: 'analyst', cost: 400, t: 4 }, f: { upg: 'desk', cost: 600, t: 5 }, s: { shift: {}, off: [], t: 6 } } };
    const s = C.state(d);
    assert.strictEqual(s.cash, 60 + 42.5 - 300 - 400 - 600);
    assert.strictEqual(s.completed, 1);
    assert.strictEqual(s.rep, 1);
    assert.deepStrictEqual(s.upgrades, { desk: 2, cap: 0, analyst: 1 });
  }],
  ['state credits overlapping collects without double count', () => {
    const d = { shop: { a: { collect: 'x', from: 0, to: 100, amount: 10, t: 1 }, b: { collect: 'x', from: 50, to: 150, amount: 10, t: 2 } } };
    assert.strictEqual(C.state(d).cash, 15);
    const d2 = { shop: { a: { collect: 'x', from: 0, to: 100, amount: 10, t: 1 }, b: { collect: 'x', from: 100, to: 200, amount: 10, t: 2 } } };
    assert.strictEqual(C.state(d2).cash, 20);
    const d3 = { shop: { a: { collect: 'x', from: 0, to: 100, amount: 10, t: 1 }, b: { collect: 'y', from: 50, to: 150, amount: 10, t: 2 } } };
    assert.strictEqual(C.state(d3).cash, 20);
  }],
  ['hint and reroll are consumable tools', () => {
    ['hint', 'reroll'].forEach(id => { const t = C.TOOLS.find(x => x.id === id); assert.ok(t && t.consumable && t.cost > 0, id); });
    assert.strictEqual(C.TOOLS.find(x => x.id === 'hint').cost, 60);
    assert.strictEqual(C.TOOLS.find(x => x.id === 'reroll').cost, 50);
  }],
  ['no rerolls keeps the old offer seed; a reroll changes it', () => {
    assert.strictEqual(C.offers('Ann', {}, cat, T)[0].seed, C.hash('ann|0|0'));
    const d = { shop: { b: { tool: 'reroll', cost: 50, t: 1 }, u: { use: 'reroll', t: 2 } } };
    assert.strictEqual(C.offers('Ann', d, cat, T)[0].seed, C.hash('ann|0|0|1'));
  }],
  ['state adds chest cash and free tool uses', () => {
    const d = { shop: {
      a: { tpl: 'x', pay: 60, rep: 1, score: 1, t: 1 },
      b: { chest: 'small', quest: 'd-x-0', rolls: [{ kind: 'cash', amount: 40 }], t: 2 },
      c: { chest: 'bonus', quest: 'b-x', rolls: [{ kind: 'consumable', tool: 'hint' }, { kind: 'consumable', tool: 'hint' }], t: 3 },
      u: { use: 'hint', t: 4 } } };
    const s = C.state(d);
    assert.strictEqual(s.cash, 100);
    assert.strictEqual(s.left('hint'), 1);
    assert.ok(s.has('hint'));
    assert.strictEqual(s.completed, 1);
  }]
];
