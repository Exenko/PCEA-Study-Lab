const assert = require('assert');
const Game = require('../js/game.js');
const day = s => new Date(s + 'T12:00:00').getTime();
const days = (...ks) => Object.fromEntries(ks.map(k => [k, { a: 1 }]));

module.exports = [
  ['xp from cards, checks, sections, shop', () => {
    const d = {
      cards: { a: { right: 3, lvl: 2 }, b: { right: 0, lvl: 0 } },          // 30 + 5*(1+2)=15 -> 45
      checks: { x: { done: true, first: true }, y: { done: true }, z: {} }, // 20 + 10
      sections: { s: { done: true }, t: {} },                               // 50
      shop: { c1: { tpl: 'lc-unit', pay: 61 }, c2: { tpl: 'npv', pay: -18 }, b: { tool: 'calc', cost: 100 }, k: { camp: 'alpha', pay: 300 } }
    };
    const x = Game.xpBreakdown(d);
    assert.deepStrictEqual(x, { cards: 45, checks: 30, sections: 50, shop: 31 + 0 + 150, total: 45 + 30 + 50 + 181 });
  }],
  ['rank thresholds', () => {
    assert.strictEqual(Game.rank(0).name, 'Intern');
    assert.strictEqual(Game.rank(499).name, 'Intern');
    assert.strictEqual(Game.rank(500).name, 'Analyst I');
    assert.deepStrictEqual(Game.rank(500).next, { name: 'Analyst II', xp: 1500 });
    assert.strictEqual(Game.rank(18000).name, 'Chief Estimator');
    assert.strictEqual(Game.rank(18000).next, null);
    assert.strictEqual(Game.rank(18000, true).name, 'PCEA Certified');
    assert.strictEqual(Game.rank(9000, true).name, 'Lead Estimator');
  }],
  ['certified needs Chief XP and every module at level 3', () => {
    const cat = { modules: [{ id: 'm1', cards: ['a', 'b'], sections: [] }, { id: 'm2', cards: ['c'], sections: [] }] };
    const d = { cards: { a: { lvl: 3, right: 0 }, b: { lvl: 3, right: 0 }, c: { lvl: 2, right: 0 } } };
    let comp = Game.compute(d, cat);
    assert.strictEqual(comp.allStrong, false);
    assert.strictEqual(comp.certified, false);
    d.cards.c.lvl = 4;
    comp = Game.compute(d, cat);
    assert.strictEqual(comp.allStrong, true);
    assert.strictEqual(comp.certified, false);
    d.cards.a.right = 1800;
    comp = Game.compute(d, cat);
    assert.strictEqual(comp.certified, true);
    assert.strictEqual(comp.rank.name, 'PCEA Certified');
  }],
  ['streak: consecutive days, today pending does not break', () => {
    const s = Game.streak(days('2026-03-01', '2026-03-02', '2026-03-03'), day('2026-03-04'));
    assert.strictEqual(s.current, 3); assert.strictEqual(s.best, 3);
    assert.strictEqual(Game.streak(days('2026-03-01', '2026-03-02'), day('2026-03-04')).current, 0);
  }],
  ['streak: 7 days earns a leave day that covers one gap', () => {
    const ks = ['01', '02', '03', '04', '05', '06', '07', '09', '10'].map(d => '2026-03-' + d);
    const s = Game.streak(days(...ks), day('2026-03-10'));
    assert.strictEqual(s.current, 9); assert.strictEqual(s.leave, 0);
  }],
  ['streak: leave days cap at 2 and gap without leave resets', () => {
    const ks = []; for (let i = 1; i <= 21; i++) ks.push('2026-03-' + String(i).padStart(2, '0'));
    assert.strictEqual(Game.streak(days(...ks), day('2026-03-21')).leave, 2);
    const s = Game.streak(days('2026-03-01', '2026-03-03'), day('2026-03-03'));
    assert.strictEqual(s.current, 1); assert.strictEqual(s.best, 1);
  }],
  ['streak ignores junk keys', () => {
    assert.strictEqual(Game.streak({ nope: {}, '2026-03-01': {} }, day('2026-03-01')).current, 1);
  }],
  ['idle collects and firm upgrades give no XP', () => {
    const base = { shop: { c1: { tpl: 'lc-unit', pay: 60 } } };
    const idle = { shop: Object.assign({}, base.shop, { k: { collect: 'lc-unit', from: 0, to: 1, amount: 500, t: 1 }, u: { upg: 'desk', cost: 300, t: 2 } }) };
    assert.deepStrictEqual(Game.xpBreakdown(idle), Game.xpBreakdown(base));
  }],
  ['streak: a chest leave grant covers a missed day', () => {
    const ks = days('2026-03-01', '2026-03-02', '2026-03-03', '2026-03-05');
    assert.strictEqual(Game.streak(ks, day('2026-03-05')).current, 1);
    assert.strictEqual(Game.streak(ks, day('2026-03-05'), [day('2026-03-02')]).current, 4);
  }],
  ['streak: grants stay capped at 2 leave days', () => {
    const ks = []; for (let i = 1; i <= 7; i++) ks.push('2026-03-0' + i);
    const g = [day('2026-03-01'), day('2026-03-02'), day('2026-03-03')];
    assert.strictEqual(Game.streak(days(...ks), day('2026-03-07'), g).leave, 2);
    assert.strictEqual(Game.streak(days(...ks), day('2026-03-07')).leave, 1);
  }],
  ['compute counts chest leave rolls; XP ignores chests', () => {
    const d = { days: days('2026-03-01', '2026-03-03'), shop: { 'chest-b-2026-03-01': { chest: 'bonus', quest: 'b-2026-03-01', rolls: [{ kind: 'leave' }, { kind: 'cash', amount: 50 }], t: day('2026-03-01') } } };
    assert.deepStrictEqual(Game.leaveGrants(d), [day('2026-03-01')]);
    assert.strictEqual(Game.compute(d, { modules: [] }, day('2026-03-03')).streak.current, 2);
    assert.strictEqual(Game.xpBreakdown(d).total, 0);
  }]
];
