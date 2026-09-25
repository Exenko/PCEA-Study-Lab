const assert = require('assert');
const Q = require('../js/quests.js');
const C = require('../js/shop/core.js');
const loadStore = require('./fixtures/load-store.js');

const NOW = new Date(2026, 8, 25, 15, 0, 0).getTime();   // Fri 2026-09-25 15:00 local
const S = new Date(2026, 8, 25).getTime();
const ids = Array.from({ length: 30 }, (_, i) => 'c' + i);
const cat = { modules: [{ id: 'm01', cards: ids, sections: [] }, { id: 'm02', cards: ['x1', 'x2'], sections: [] }] };
const ctx = p => ({ profile: p, catalog: cat });
const profiles = n => Array.from({ length: n }, (_, i) => 'p' + i);
const empty = () => ({ cards: {}, checks: {}, sections: {}, days: {}, shop: {}, settings: {} });
// Every quest type (daily and weekly) is complete in this profile.
function full() {
  const d = empty();
  d.sections['m01/s1'] = { done: true, at: NOW - 1000 };
  ids.forEach(id => { d.cards[id] = { seen: 2, lvl: 4, right: 2, last: NOW - 1000, pdue: S - 1000, due: NOW + 1e9 }; });
  for (let i = 0; i < 6; i++) d.checks['k' + i] = { done: true, at: NOW - 1000 };
  for (let i = 0; i < 10; i++) d.shop['job' + i] = { tpl: 'lc-unit', pay: 10, score: 1, rep: 1, t: NOW - 1000 - i };
  d.shop['evt-lc-unit-1'] = { evt: 'lc-unit', kind: 'shock', module: 'm05', at: S - 5000, seed: 1, t: S - 5000 };
  d.shop['evtdone-lc-unit-1'] = { evtdone: 'evt-lc-unit-1', bonus: 5, t: NOW - 500 };
  ['2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24', '2026-09-25'].forEach(k => { d.days[k] = { a: 1 }; });
  return d;
}
const count = (id, d) => Q.TYPES[id].count(d, S, Q.dayEnd(NOW), 'm01', cat);

module.exports = [
  ['day and ISO week keys', () => {
    assert.strictEqual(Q.dayKey(NOW), '2026-09-25');
    assert.strictEqual(Q.weekKey(NOW), '2026-W39');
    assert.strictEqual(Q.weekKey(new Date(2026, 0, 1, 9).getTime()), '2026-W01');
    assert.strictEqual(Q.weekKey(new Date(2027, 0, 1, 9).getTime()), '2026-W53');
    assert.strictEqual(Q.weekKey(new Date(2024, 11, 30, 9).getTime()), '2025-W01');
    assert.strictEqual(Q.weekStart(NOW), new Date(2026, 8, 21).getTime());
    assert.strictEqual(Q.weekEnd(NOW), new Date(2026, 8, 28).getTime());
    assert.strictEqual(Q.dayEnd(NOW), new Date(2026, 8, 26).getTime());
  }],
  ['draw is deterministic per profile and day, three distinct types', () => {
    const d = full();
    const a = Q.today(d, NOW, ctx('Ann')), b = Q.today(d, NOW + 3600e3, ctx('ann'));
    assert.deepStrictEqual(a.map(q => [q.id, q.target, q.key]), b.map(q => [q.id, q.target, q.key]));
    assert.deepStrictEqual(a.map(q => q.key), ['d-2026-09-25-0', 'd-2026-09-25-1', 'd-2026-09-25-2']);
    const sigs = new Set();
    profiles(60).forEach(p => {
      const qs = Q.today(d, NOW, ctx(p));
      assert.strictEqual(qs.length, 3);
      assert.strictEqual(new Set(qs.map(q => q.id)).size, 3);
      qs.forEach(q => { const [lo, hi] = Q.TYPES[q.id].range; assert.ok(q.target >= lo && q.target <= hi, q.id); });
      sigs.add(qs.map(q => q.id + q.target).join());
    });
    assert.ok(sigs.size > 5);
  }],
  ['overdue falls back to cards when nothing is overdue', () => {
    profiles(60).forEach(p => {
      const qs = Q.today(empty(), NOW, ctx(p));
      assert.strictEqual(qs.length, 3);
      assert.ok(!qs.some(q => q.id === 'overdue'));
      assert.strictEqual(new Set(qs.map(q => q.id)).size, 3);
    });
  }],
  ['overdue module: most overdue cards at day start, ties by id', () => {
    const d = empty();
    d.cards.c0 = { seen: 1, due: S - 10, last: S - 100 };
    d.cards.x1 = { seen: 1, due: S - 10, last: S - 100 };
    assert.strictEqual(Q.overdueModule(d, S, cat), 'm01');
    d.cards.x2 = { seen: 1, due: NOW + 10, last: NOW - 10, pdue: S - 50 };
    assert.strictEqual(Q.overdueModule(d, S, cat), 'm02');
    d.cards.x2.pdue = S + 5;
    assert.strictEqual(Q.overdueModule(d, S, cat), 'm01');
    const got = profiles(80).map(p => Q.today(d, NOW, ctx(p)).find(q => q.id === 'overdue')).filter(Boolean);
    assert.ok(got.length > 0);
    got.forEach(q => { assert.strictEqual(q.module, 'm01'); assert.ok(q.label.endsWith(' in M01')); });
  }],
  ['new cards are never overdue', () => {
    const d = empty();
    d.cards.c0 = { seen: 1, due: NOW + 10, last: NOW - 10, pdue: null };
    d.cards.c1 = { seen: 0, due: 0, last: 0 };
    assert.strictEqual(Q.overdueModule(d, S, cat), null);
    assert.strictEqual(count('overdue', d), 0);
  }],
  ['event drawn only when an event was open at day start', () => {
    const drawn = d => profiles(80).some(p => Q.today(d, NOW, ctx(p)).some(q => q.id === 'event'));
    const d = empty();
    assert.strictEqual(drawn(d), false);
    d.shop.e = { evt: 'lc-unit', kind: 'shock', at: S - 10, t: S - 10 };
    assert.strictEqual(Q.eventOpenAt(d, S), true);
    assert.strictEqual(drawn(d), true);
    d.shop.done = { evtdone: 'e', bonus: 1, t: NOW - 10 };
    assert.strictEqual(Q.eventOpenAt(d, S), true);
    d.shop.done.t = S - 5;
    assert.strictEqual(Q.eventOpenAt(d, S), false);
    const later = empty();
    later.shop.e = { evt: 'lc-unit', kind: 'shock', at: S + 10, t: S + 10 };
    assert.strictEqual(drawn(later), false);
  }],
  ['progress counts only records inside the day', () => {
    const d = empty(), y = S - 1000, t = NOW - 1000;
    d.cards = { a: { seen: 1, last: t }, b: { seen: 1, last: y }, c0: { seen: 2, last: t, pdue: S - 1 }, c1: { seen: 2, last: t, pdue: S + 1 }, c2: { seen: 2, last: y, pdue: y - 5 } };
    d.checks = { k1: { done: true, at: t }, k2: { done: true, at: y }, k3: { done: true } };
    d.sections = { s1: { done: true, at: t }, s2: { done: true, at: y }, s3: { at: t } };
    d.shop = { j1: { tpl: 'a', score: 1, t }, j2: { tpl: 'a', score: 0.6, t }, j3: { tpl: 'a', score: 1, t: y }, k: { camp: 'alpha', score: 1, t },
      e1: { evtdone: 'evt-a-1', t }, e2: { evtdone: 'evt-a-2', t: y }, ch: { chest: 'small', quest: 'q', rolls: [], t } };
    assert.strictEqual(count('cards', d), 3);
    assert.strictEqual(count('overdue', d), 1);
    assert.strictEqual(count('checks', d), 1);
    assert.strictEqual(count('section', d), 1);
    assert.strictEqual(count('solve', d), 2);
    assert.strictEqual(count('exact', d), 1);
    assert.strictEqual(count('event', d), 1);
  }],
  ['weekly: deterministic per week and counts inside the week', () => {
    const d = full();
    const w = Q.weekly(d, NOW, ctx('Ann'));
    assert.deepStrictEqual(Q.weekly(d, NOW - 3 * 864e5, ctx('Ann')).id, w.id);
    assert.strictEqual(w.key, 'w-2026-W39');
    assert.ok(w.done);
    const a = Q.weekStart(NOW), b = Q.weekEnd(NOW);
    const e = empty();
    e.days = { '2026-09-20': { a: 1 }, '2026-09-21': { a: 1 }, '2026-09-27': { a: 1 }, '2026-09-28': { a: 1 }, junk: {} };
    e.cards = { a: { lvl: 4, last: NOW }, b: { lvl: 3, last: NOW }, c: { lvl: 5, last: a - 1 } };
    e.shop = { j: { tpl: 'x', t: NOW }, k: { tpl: 'x', t: b } };
    assert.strictEqual(Q.WEEKLY.days.count(e, a, b), 2);
    assert.strictEqual(Q.WEEKLY.master.count(e, a, b), 1);
    assert.strictEqual(Q.WEEKLY.solve10.count(e, a, b), 1);
  }],
  ['claim writes a small chest once; bonus follows three claims', () => {
    const d = full(), c = ctx('Ann');
    const qs = Q.today(d, NOW, c);
    assert.ok(qs.every(q => q.done && !q.claimed));
    assert.deepStrictEqual(Q.bonus(d, NOW, c), { key: 'b-2026-09-25', ready: false, claimed: false });
    assert.strictEqual(Q.claim(d, 'b-2026-09-25', NOW, c), null);
    qs.forEach(q => {
      const res = Q.claim(d, q.key, NOW, c);
      assert.strictEqual(res.key, 'chest-' + q.key);
      assert.strictEqual(res.rec.chest, 'small'); assert.strictEqual(res.rec.quest, q.key); assert.strictEqual(res.rec.t, NOW);
      assert.strictEqual(res.rec.rolls.length, 1);
      if (q.id === 'overdue') assert.strictEqual(res.rec.module, 'm01'); else assert.ok(!('module' in res.rec));
      ['tpl', 'camp', 'tool', 'use'].forEach(f => assert.ok(!(f in res.rec)));
      d.shop[res.key] = res.rec;
      assert.strictEqual(Q.claim(d, q.key, NOW, c), null);
    });
    assert.ok(Q.today(d, NOW, c).every(q => q.claimed));
    assert.deepStrictEqual(Q.bonus(d, NOW, c), { key: 'b-2026-09-25', ready: true, claimed: false });
    const b = Q.claim(d, 'b-2026-09-25', NOW, c);
    assert.strictEqual(b.rec.chest, 'bonus'); assert.strictEqual(b.rec.rolls.length, 2);
    d.shop[b.key] = b.rec;
    assert.strictEqual(Q.bonus(d, NOW, c).claimed, true);
    const w = Q.claim(d, 'w-2026-W39', NOW, c);
    assert.strictEqual(w.rec.chest, 'big'); assert.strictEqual(w.rec.rolls.length, 3);
    assert.ok(w.rec.rolls.some(x => x.kind === 'cosmetic'));
  }],
  ['expired and unfinished quests cannot be claimed', () => {
    const c = ctx('Ann');
    assert.strictEqual(Q.claim(full(), 'd-2026-09-24-0', NOW, c), null);
    assert.strictEqual(Q.claim(full(), 'w-2026-W38', NOW, c), null);
    assert.strictEqual(Q.claim(full(), 'nonsense', NOW, c), null);
    const qs = Q.today(empty(), NOW, c);
    assert.ok(qs.every(q => !q.done));
    assert.strictEqual(Q.claim(empty(), qs[0].key, NOW, c), null);
  }],
  ['claim twice and merge count once', () => {
    const Store = loadStore();
    const d = full(), c = ctx('Ann'), key = Q.today(d, NOW, c)[0].key;
    const r1 = Q.claim(d, key, NOW, c), r2 = Q.claim(d, key, NOW + 60e3, c);
    const a = full(), b = full();
    a.shop[r1.key] = Object.assign({}, r1.rec, { mod: 1 });
    b.shop[r2.key] = Object.assign({}, r2.rec, { mod: 2 });
    const m = Store.merge(a, b);
    assert.strictEqual(Object.keys(m.shop).filter(k => k.startsWith('chest-')).length, 1);
    const one = full(); one.shop[r2.key] = r2.rec;
    assert.strictEqual(C.state(m).cash, C.state(one).cash);
  }],
  ['leave roll at claim uses the streak leave count', () => {
    const d = full();
    const leaveRec = { chest: 'big', quest: 'old', rolls: [{ kind: 'leave' }, { kind: 'leave' }], t: S - 1000 };
    d.shop['chest-old'] = leaveRec;
    profiles(40).forEach(p => {
      const res = Q.claim(d, Q.today(d, NOW, ctx(p))[0].key, NOW, ctx(p));
      assert.ok(!res.rec.rolls.some(x => x.kind === 'leave'));
    });
  }],
  ['badge counts done dailies and flags claimable rewards', () => {
    const c = ctx('Ann');
    assert.deepStrictEqual(Q.badge(empty(), NOW, c), { done: 0, total: 3, claimable: false });
    const d = full();
    assert.deepStrictEqual(Q.badge(d, NOW, c), { done: 3, total: 3, claimable: true });
    const r = Q.resetIn(NOW);
    assert.strictEqual(r.day, 9 * 3600e3);
    assert.strictEqual(r.week, 2 * 864e5 + 9 * 3600e3);
  }]
];
