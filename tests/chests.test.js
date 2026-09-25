const assert = require('assert');
const X = require('../js/chests.js');
const C = require('../js/shop/core.js');
const G = require('../js/game.js');
const opts = { profile: 'Ann', leave: 0 };
const allOwned = () => ({ shop: { 'chest-all': { chest: 'big', quest: 'all', rolls: X.COSMETICS.map(c => ({ kind: 'cosmetic', cos: c.id })), t: 1 } } });

module.exports = [
  ['cosmetics catalog has 8 titles, 4 flames, 4 desks with unique ids', () => {
    const by = k => X.COSMETICS.filter(c => c.kind === k).length;
    assert.strictEqual(by('title'), 8); assert.strictEqual(by('flame'), 4); assert.strictEqual(by('desk'), 4);
    assert.strictEqual(new Set(X.COSMETICS.map(c => c.id)).size, 16);
    assert.ok(X.COSMETICS.some(c => c.id === 'title-basis-of-estimate-bard' && c.name === 'Basis-of-Estimate Bard'));
    assert.ok(X.COSMETICS.some(c => c.id === 'desk-brass' && c.value === 'brass'));
  }],
  ['rolls are deterministic and sized by tier', () => {
    assert.deepStrictEqual(X.roll({}, 'chest-d-2026-09-25-0', 'small', opts), X.roll({}, 'chest-d-2026-09-25-0', 'small', opts));
    assert.strictEqual(X.roll({}, 'k', 'small', opts).length, 1);
    assert.strictEqual(X.roll({}, 'k', 'bonus', opts).length, 2);
    assert.strictEqual(X.roll({}, 'k', 'big', opts).length, 3);
    assert.deepStrictEqual(X.roll({}, 'k', 'nope', opts), []);
    const differs = Array.from({ length: 40 }, (_, i) => 'p' + i).some(p => JSON.stringify(X.roll({}, 'k', 'big', { profile: p })) !== JSON.stringify(X.roll({}, 'k', 'big', opts)));
    assert.ok(differs);
  }],
  ['cash amounts stay in range and every kind appears', () => {
    const kinds = new Set();
    for (let i = 0; i < 400; i++) {
      X.roll({}, 'chest-s' + i, 'small', opts).forEach(x => { kinds.add(x.kind); if (x.kind === 'cash') assert.ok(x.amount >= 20 && x.amount <= 60 && Number.isInteger(x.amount)); if (x.kind === 'consumable') assert.ok(X.CONSUMABLES.includes(x.tool)); });
      X.roll({}, 'chest-b' + i, 'big', opts).forEach(x => { if (x.kind === 'cash') assert.ok(x.amount >= 40 && x.amount <= 120); });
    }
    assert.deepStrictEqual([...kinds].sort(), ['cash', 'consumable', 'cosmetic', 'leave']);
  }],
  ['full leave turns a leave roll into cash', () => {
    let key = null;
    for (let i = 0; i < 2000 && !key; i++) if (X.roll({}, 'chest-L' + i, 'small', opts)[0].kind === 'leave') key = 'chest-L' + i;
    assert.ok(key, 'found a leave roll');
    const r = X.roll({}, key, 'small', { profile: 'Ann', leave: 2 });
    assert.strictEqual(r[0].kind, 'cash');
  }],
  ['fully owned cosmetics turn into cash; big chest guarantees one otherwise', () => {
    const own = allOwned();
    for (let i = 0; i < 200; i++) {
      assert.ok(!X.roll(own, 'chest-o' + i, 'big', opts).some(x => x.kind === 'cosmetic'));
      const big = X.roll({}, 'chest-o' + i, 'big', opts).filter(x => x.kind === 'cosmetic');
      assert.ok(big.length >= 1);
      assert.strictEqual(new Set(big.map(x => x.cos)).size, big.length);
    }
  }],
  ['cosmetic rolls only pick locked items', () => {
    const d = { shop: { 'chest-x': { chest: 'big', quest: 'x', rolls: X.COSMETICS.slice(1).map(c => ({ kind: 'cosmetic', cos: c.id })), t: 1 } } };
    for (let i = 0; i < 50; i++) X.roll(d, 'chest-y' + i, 'big', opts).filter(x => x.kind === 'cosmetic').forEach(x => assert.strictEqual(x.cos, X.COSMETICS[0].id));
  }],
  ['cash, tool grants, owned and leave grants read chest records only', () => {
    const d = { shop: {
      a: { chest: 'small', quest: 'd-x-0', rolls: [{ kind: 'cash', amount: 40 }], t: 10 },
      b: { chest: 'bonus', quest: 'b-x', rolls: [{ kind: 'consumable', tool: 'hint' }, { kind: 'leave' }], t: 20 },
      c: { chest: 'big', quest: 'w-x', rolls: [{ kind: 'cosmetic', cos: 'flame-gold' }, { kind: 'consumable', tool: 'reroll' }, { kind: 'cash', amount: 55.5 }], t: 30 },
      j: { tpl: 'lc-unit', pay: 60, rolls: [{ kind: 'cash', amount: 999 }], t: 5 } } };
    assert.strictEqual(X.cash(d), 95.5);
    assert.deepStrictEqual(X.toolGrants(d), { hint: 1, reroll: 1 });
    assert.deepStrictEqual([...X.owned(d)], ['flame-gold']);
    assert.deepStrictEqual(X.leaveGrants(d), [20]);
  }],
  ['equipped ignores items not owned', () => {
    const d = allOwned();
    d.settings = { cosmetics: { title: 'title-cost-sage', flame: 'flame-blue', desk: 'desk-nope' } };
    const e = X.equipped(d);
    assert.strictEqual(e.title.name, 'Cost Sage'); assert.strictEqual(e.flame.value, 'blue'); assert.strictEqual(e.desk, null);
    assert.deepStrictEqual(X.equipped({ settings: { cosmetics: { title: 'title-cost-sage' } } }), { title: null, flame: null, desk: null });
    assert.deepStrictEqual(X.equipped({}), { title: null, flame: null, desk: null });
  }],
  ['chest records are not jobs, purchases or XP', () => {
    const base = { shop: { j: { tpl: 'lc-unit', pay: 60, rep: 1, score: 1, t: 1 } } };
    const withChest = { shop: Object.assign({}, base.shop, { 'chest-d-x-0': { chest: 'small', quest: 'd-x-0', rolls: [{ kind: 'consumable', tool: 'hint' }, { kind: 'cash', amount: 30 }], t: 2 } }) };
    const s0 = C.state(base), s1 = C.state(withChest);
    assert.strictEqual(s1.completed, s0.completed); assert.strictEqual(s1.rep, s0.rep);
    assert.deepStrictEqual(G.xpBreakdown(withChest), G.xpBreakdown(base));
    const A = require('../js/achievements.js');
    const g = G.compute(withChest, { modules: [] });
    assert.strictEqual(A.stats(withChest, g, { modules: [] }).tools, 0);
  }]
];
