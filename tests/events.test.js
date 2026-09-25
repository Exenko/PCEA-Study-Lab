const assert = require('assert');
const E = require('../js/shop/events.js');
const I = require('../js/shop/idle.js');
const C = require('../js/shop/core.js');
const G = require('../js/game.js');
const Store = require('./fixtures/load-store.js')();
const H = I.HOUR;
const pipe = (id, at, extra) => ({ ['pipe-' + id]: Object.assign({ pipe: id, steps: [], outs: [], stepCount: 2, primitivesOnly: false, passed: true, tier: 1, passedAt: at, t: at }, extra) });
const D = (...parts) => ({ shop: Object.assign({}, ...parts) });
const apply = (d, ws) => ws.forEach(w => { d.shop[w.key] = w.rec; });
const M05 = ['c4', 'c2', 'c1', 'c3'];
const sched = (due = [], last = {}, cards = M05) => ({ profile: 'Ann', isDue: id => due.includes(id), get: id => (id in last ? { last: last[id] } : null), cards: m => (m === 'm05' ? cards : []) });
const draw = key => C.rng(C.hash('ann|' + key))();
// A pipeline passed at 0 whose last collect ended at s: the next collect key is collect-<id>-<s>.
const setup = (ids, s) => D(...ids.map(id => pipe(id, 0)), ...ids.map(id => ({ ['collect-' + id + '-0']: { collect: id, from: 0, to: s, amount: 0, t: s } })));
const findStart = pred => { for (let k = 30; k < 5000; k++) if (pred(k * H)) return k * H; throw new Error('no start found'); };
const inRange = (id, lo, hi) => s => { const r = draw('collect-' + id + '-' + s); return r >= lo && r < hi; };
const evt = (id, at, extra) => ({ ['evt-' + id + '-' + at]: Object.assign({ evt: id, kind: 'shock', module: 'm05', at, seed: 1, t: at }, extra) });

module.exports = [
  ['chance is 0.04 per hour, doubled at 3 overdue cards, capped at 0.6', () => {
    assert.ok(Math.abs(E.chance(5, 0) - 0.2) < 1e-12);
    assert.ok(Math.abs(E.chance(5, 2) - 0.2) < 1e-12);
    assert.ok(Math.abs(E.chance(5, 3) - 0.4) < 1e-12);
    assert.strictEqual(E.chance(20, 0), 0.6);
    assert.strictEqual(E.chance(10, 3), 0.6);
    assert.strictEqual(E.chance(0, 5), 0);
  }],
  ['roll is deterministic from profile and collect key', () => {
    const s = findStart(inRange('esc-compound', 0, 0.6)), now = s + 20 * H;
    const ws = E.collect(setup(['esc-compound'], s), 'esc-compound', now, sched());
    assert.strictEqual(ws.length, 2);
    assert.strictEqual(ws[0].key, 'collect-esc-compound-' + s);
    assert.deepStrictEqual(ws[1], { key: 'evt-esc-compound-' + now, rec: { evt: 'esc-compound', kind: 'shock', module: 'm05', at: now, seed: C.hash('ann|collect-esc-compound-' + s), t: now } });
    assert.deepStrictEqual(E.collect(setup(['esc-compound'], s), 'esc-compound', now, sched()), ws);
    const miss = findStart(inRange('esc-compound', 0.6, 1));
    assert.strictEqual(E.collect(setup(['esc-compound'], miss), 'esc-compound', miss + 20 * H, sched()).length, 1);
  }],
  ['three overdue cards double the chance; audit snapshots due cards sorted', () => {
    const s = findStart(inRange('esc-compound', 0.2, 0.4)), now = s + 5 * H;
    assert.strictEqual(E.collect(setup(['esc-compound'], s), 'esc-compound', now, sched(['c3', 'c1'])).length, 1);
    const ws = E.collect(setup(['esc-compound'], s), 'esc-compound', now, sched(['c3', 'c1', 'c2']));
    assert.strictEqual(ws[1].rec.kind, 'audit');
    assert.deepStrictEqual(ws[1].rec.cards, ['c1', 'c2', 'c3']);
  }],
  ['audit snapshot keeps at most ten cards', () => {
    const ids = Array.from({ length: 12 }, (_, i) => 'k' + String(12 - i).padStart(2, '0'));
    const s = findStart(inRange('esc-compound', 0, 0.6));
    const ws = E.collect(setup(['esc-compound'], s), 'esc-compound', s + 20 * H, sched(ids, {}, ids));
    assert.deepStrictEqual(ws[1].rec.cards, ids.slice().sort().slice(0, 10));
  }],
  ['a template with no shock and no overdue cards consumes the roll', () => {
    const s = findStart(inRange('cer-power', 0, 0.6));
    const ws = E.collect(setup(['cer-power'], s), 'cer-power', s + 20 * H, sched());
    assert.deepStrictEqual(ws.map(w => w.key), ['collect-cer-power-' + s]);
  }],
  ['no roll with an open event, inside the 20 h cooldown, or within 24 h of passing', () => {
    const id = 'esc-compound', s = findStart(inRange(id, 0, 0.6)), now = s + 20 * H, key = 'collect-' + id + '-' + s, win = { from: s, to: now };
    assert.ok(E.roll(setup([id], s), id, key, win, now, sched()));
    assert.strictEqual(E.roll(D(setup([id], s).shop, evt(id, 1)), id, key, win, now, sched()), null);
    assert.strictEqual(E.roll(D(setup([id], s).shop, evt('lc-unit', now - 19 * H)), id, key, win, now, sched()), null);
    assert.ok(E.roll(D(setup([id], s).shop, evt('lc-unit', now - 21 * H)), id, key, win, now, sched()));
    assert.strictEqual(E.roll(D(setup([id], s).shop, pipe(id, now - 23 * H)), id, key, win, now, sched()), null);
  }],
  ['collect all rolls at most one new event per sweep', () => {
    const s = findStart(k => draw('collect-esc-compound-' + k) < 0.6 && draw('collect-lc-unit-' + k) < 0.6);
    const res = E.collectAll(setup(['esc-compound', 'lc-unit'], s), s + 20 * H, sched());
    assert.strictEqual(res.writes.filter(w => w.rec.collect).length, 2);
    assert.strictEqual(res.events.length, 1);
    assert.ok(res.writes.includes(res.events[0]));
  }],
  ['audit progress counts only cards reviewed at or after the event', () => {
    const A = 40 * H, d = D(pipe('esc-compound', 0), evt('esc-compound', A, { kind: 'audit', cards: ['c1', 'c2', 'c3'] }));
    const rec = d.shop['evt-esc-compound-' + A];
    assert.deepStrictEqual(E.auditProgress(d, rec, sched([], { c1: A, c2: A - 1 })), { done: 1, total: 3 });
    assert.strictEqual(E.resolveAudit(d, 'esc-compound', A + H, sched([], { c1: A, c2: A - 1 })), null);
    const r = E.resolveAudit(d, 'esc-compound', A + H, sched([], { c1: A, c2: A + 5, c3: A + 9 }));
    assert.deepStrictEqual({ key: r.key, rec: r.rec }, { key: 'evtdone-esc-compound-' + A, rec: { evtdone: 'evt-esc-compound-' + A, bonus: 28, t: A + H } });
    assert.strictEqual(E.resolveShock(d, 'esc-compound', A + H), null);
    apply(d, r.writes);
    assert.strictEqual(E.open(d, 'esc-compound'), null);
    assert.strictEqual(E.resolveAudit(d, 'esc-compound', A + 2 * H, sched([], { c1: A, c2: A, c3: A })), null);
    assert.strictEqual(I.outbox(d, 'esc-compound', A + 2 * H).amount, 14);
    assert.strictEqual(C.state(d).cash, 28);
    assert.strictEqual(G.xpBreakdown(d).shop, 0);
  }],
  ['one resolve clears racing events on the same pipeline, bonus once', () => {
    const d = D(pipe('esc-compound', 0), evt('esc-compound', 30 * H), evt('esc-compound', 32 * H));
    assert.strictEqual(E.resolveAudit(d, 'esc-compound', 40 * H, sched()), null);
    const r = E.resolveShock(d, 'esc-compound', 40 * H);
    assert.strictEqual(r.key, 'evtdone-esc-compound-' + 30 * H);
    assert.deepStrictEqual(r.writes.map(w => [w.key, w.rec.bonus]), [['evtdone-esc-compound-' + 30 * H, 28], ['evtdone-esc-compound-' + 32 * H, 0]]);
    apply(d, r.writes);
    assert.strictEqual(E.stalledAt(d, 'esc-compound'), null);
    assert.strictEqual(C.state(d).cash, 28);
  }],
  ['resolving on two devices counts the bonus once after merge', () => {
    const base = D(pipe('esc-compound', 0), evt('esc-compound', 30 * H));
    const d1 = JSON.parse(JSON.stringify(base)), d2 = JSON.parse(JSON.stringify(base));
    E.resolveShock(d1, 'esc-compound', 40 * H).writes.forEach(w => { d1.shop[w.key] = Object.assign(w.rec, { mod: 1 }); });
    E.resolveShock(d2, 'esc-compound', 41 * H).writes.forEach(w => { d2.shop[w.key] = Object.assign(w.rec, { mod: 2 }); });
    const m = Store.merge(d1, d2);
    assert.strictEqual(C.state(m).cash, 28);
    assert.strictEqual(I.start(m, 'esc-compound', 0), 41 * H);
  }],
  ['a stalled pipeline collects nothing more and does not roll again', () => {
    const d = D(pipe('esc-compound', 0), { 'collect-esc-compound-0': { collect: 'esc-compound', from: 0, to: 30 * H, amount: 0, t: 30 * H } }, evt('esc-compound', 30 * H));
    assert.deepStrictEqual(E.collect(d, 'esc-compound', 60 * H, sched()), []);
    assert.deepStrictEqual(E.collectAll(d, 60 * H, sched()), { writes: [], events: [] });
  }]
];
