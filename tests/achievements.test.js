const assert = require('assert');
const Game = require('../js/game.js');
const A = require('../js/achievements.js');
const cat = { modules: [{ id: 'm1', cards: ['a'], sections: ['m1/s1', 'm1/s2'] }, { id: 'm2', cards: ['b'], sections: ['m2/s1'] }] };
const ids = d => A.earned(d, Game.compute(d, cat), cat).map(a => a.id);

module.exports = [
  ['ids are unique and every entry is complete', () => {
    const seen = new Set();
    A.LIST.forEach(a => { assert.ok(a.id && a.name && a.desc && typeof a.test === 'function', a.id); assert.ok(!seen.has(a.id), 'dup ' + a.id); seen.add(a.id); });
    assert.ok(A.LIST.length >= 20);
  }],
  ['empty profile earns nothing', () => { assert.deepStrictEqual(ids({}), []); }],
  ['first section and module read', () => {
    const d = { sections: { 'm1/s1': { done: true } } };
    assert.ok(ids(d).includes('first-section'));
    assert.ok(!ids(d).includes('module-read'));
    d.sections['m1/s2'] = { done: true };
    assert.ok(ids(d).includes('module-read'));
    assert.ok(!ids(d).includes('library'));
    d.sections['m2/s1'] = { done: true };
    assert.ok(ids(d).includes('library'));
  }],
  ['shop achievements', () => {
    const d = { shop: { c: { tpl: 'lc-unit', score: 1, pay: 60 }, b: { tool: 'calc', cost: 100 }, k: { camp: 'alpha', score: 0.8, pay: 240 } } };
    const e = ids(d);
    ['first-contract', 'first-campaign'].forEach(x => assert.ok(e.includes(x), x));
    assert.ok(!e.includes('campaign-done'));
  }]
];
