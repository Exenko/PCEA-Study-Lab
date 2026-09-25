const assert = require('assert');
const I = require('../js/shop/idle.js');
const C = require('../js/shop/core.js');
const Store = require('./fixtures/load-store.js')();
const H = I.HOUR;
const pipe = (id, at, extra) => ({ ['pipe-' + id]: Object.assign({ pipe: id, steps: [], outs: [], stepCount: 2, primitivesOnly: false, passed: true, tier: 1, passedAt: at, t: at }, extra) });
const D = (...parts) => ({ shop: Object.assign({}, ...parts) });
const apply = (d, res) => res.writes.forEach(w => { d.shop[w.key] = w.rec; });
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} vs ${b}`);

module.exports = [
  ['firm levels and next costs come from upgrade records', () => {
    const base = I.firm({ shop: {} });
    assert.strictEqual(base.desks, 2); assert.strictEqual(base.capHours, 8); assert.strictEqual(base.mult, 1);
    assert.deepStrictEqual(base.next, { desk: 300, cap: 250, analyst: 400 });
    const d = D({ u1: { upg: 'desk', cost: 300, t: 1 }, u2: { upg: 'desk', cost: 600, t: 2 }, u3: { upg: 'analyst', cost: 400, t: 3 } },
      Object.fromEntries([1, 2, 3, 4, 5].map(i => ['c' + i, { upg: 'cap', cost: 1, t: i }])));
    const f = I.firm(d);
    assert.strictEqual(f.desks, 4); assert.strictEqual(f.capHours, 24); assert.strictEqual(f.mult, 1.25);
    assert.deepStrictEqual(f.levels, { desk: 2, cap: 3, analyst: 1 });
    assert.deepStrictEqual(f.next, { desk: 1200, cap: null, analyst: 800 });
    assert.strictEqual(f.deskT, 2);
  }],
  ['rate: tier yield, per-step upkeep, multiplier, floor at zero', () => {
    near(I.rate(D(pipe('a', 0, { stepCount: 16 })), 'a').net, 7);
    near(I.rate(D(pipe('a', 0, { stepCount: 2 })), 'a').net, 14);
    near(I.rate(D(pipe('a', 0, { stepCount: 2, tier: 3 })), 'a').net, 61.5);
    near(I.rate(D(pipe('a', 0, { stepCount: 40 })), 'a').net, 0);
    near(I.rate(D(pipe('a', 0), { u: { upg: 'analyst', cost: 400, t: 1 } }), 'a').net, 17.75);
    assert.deepStrictEqual(I.rate(D(), 'zzz'), { gross: 0, upkeep: 0, net: 0 });
  }],
  ['onShift fills desks in pass order and ignores pipelines that are not running', () => {
    const d = D(pipe('a', 1000), pipe('b', 2000), pipe('c', 3000), pipe('x', 500, { passed: false }));
    assert.deepStrictEqual(I.onShift(d), [{ id: 'a', since: 1000 }, { id: 'b', since: 2000 }]);
    assert.deepStrictEqual(I.running(d).map(r => r.pipe), ['a', 'b', 'c']);
  }],
  ['outbox grows with time, stops at the cap, and is zero before start', () => {
    const d = D(pipe('a', 1000));
    assert.deepStrictEqual(I.outbox(d, 'a', 1000 + 2 * H), { amount: 28, hours: 2, full: false });
    assert.deepStrictEqual(I.outbox(d, 'a', 1000 + 10 * H), { amount: 112, hours: 10, full: true });
    assert.deepStrictEqual(I.outbox(d, 'a', 0), { amount: 0, hours: 0, full: false });
    assert.deepStrictEqual(I.outbox(d, 'zzz', 5 * H), { amount: 0, hours: 0, full: false });
  }],
  ['collect has a deterministic key, banks cash, and a second tap is null', () => {
    const d = D(pipe('a', 1000)), now = 1000 + 2 * H;
    const c = I.collect(d, 'a', now);
    assert.strictEqual(c.key, 'collect-a-1000');
    assert.deepStrictEqual(c.rec, { collect: 'a', from: 1000, to: now, amount: 28, t: now });
    d.shop[c.key] = c.rec;
    assert.strictEqual(I.collect(d, 'a', now), null);
    assert.strictEqual(I.outbox(d, 'a', now + H).amount, 14);
    assert.strictEqual(C.state(d).cash, 28);
    const two = D(pipe('a', 1000), pipe('b', 1000));
    assert.deepStrictEqual(I.collectAll(two, 1000 + H).map(w => w.key), ['collect-a-1000', 'collect-b-1000']);
  }],
  ['two devices collecting from the same start are counted once after merge', () => {
    const base = D(pipe('a', 1000));
    const d1 = JSON.parse(JSON.stringify(base)), d2 = JSON.parse(JSON.stringify(base));
    const c1 = I.collect(d1, 'a', 1000 + 2 * H), c2 = I.collect(d2, 'a', 1000 + 3 * H);
    assert.strictEqual(c1.key, c2.key);
    d1.shop[c1.key] = Object.assign(c1.rec, { mod: 1 });
    d2.shop[c2.key] = Object.assign(c2.rec, { mod: 2 });
    assert.strictEqual(C.state(Store.merge(d1, d2)).cash, 42);
  }],
  ['re-pass after banking: outbox restarts at the collect, at the new rate', () => {
    const d = D(pipe('a', 1000, { stepCount: 16 })), now = 1000 + 2 * H;
    const c = I.collect(d, 'a', now);
    assert.strictEqual(c.rec.amount, 14);
    d.shop[c.key] = c.rec;
    Object.assign(d, D(d.shop, pipe('a', now, { stepCount: 2 })));
    assert.strictEqual(I.outbox(d, 'a', now + H).amount, 14);
  }],
  ['setShift banks removed pipelines, keeps since for kept ones, and remembers off', () => {
    const d = D(pipe('a', 1000), pipe('b', 2000), pipe('c', 3000)), now = 1000 + 4 * H;
    const res = I.setShift(d, ['a', 'c'], now);
    assert.deepStrictEqual(res.writes.map(w => w.key), ['collect-b-2000', 'shift']);
    assert.deepStrictEqual(res.writes[1].rec, { shift: { a: 1000, c: now }, off: ['b'], t: now });
    apply(d, res);
    assert.deepStrictEqual(I.onShift(d), [{ id: 'a', since: 1000 }, { id: 'c', since: now }]);
    assert.throws(() => I.setShift(d, ['a', 'b', 'c'], now), /Not enough desks/);
  }],
  ['buying a desk keeps accrued outboxes; turned-off pipelines stay off; new passes auto-fill', () => {
    const d = D(pipe('a', 1000), pipe('b', 2000), pipe('c', 3000), { k: { tpl: 'x', pay: 1000, t: 1 } });
    const buy = I.buyUpgrade(d, 'desk', 5000);
    assert.deepStrictEqual(buy.writes.map(w => w.key), ['shift', 'upg-desk-5000']);
    assert.deepStrictEqual(buy.writes[1].rec, { upg: 'desk', cost: 300, t: 5000 });
    apply(d, buy);
    assert.deepStrictEqual(I.onShift(d), [{ id: 'a', since: 1000 }, { id: 'b', since: 2000 }, { id: 'c', since: 5000 }]);
    apply(d, I.setShift(d, ['a'], 6000));
    assert.deepStrictEqual(I.onShift(d).map(o => o.id), ['a']);
    Object.assign(d.shop, pipe('d', 7000));
    assert.deepStrictEqual(I.onShift(d), [{ id: 'a', since: 1000 }, { id: 'd', since: 7000 }]);
    apply(d, I.setShift(d, ['a', 'd', 'b'], 8000));
    assert.deepStrictEqual(d.shop.shift.off, ['c']);
  }],
  ['buyUpgrade refuses when cash is short or the upgrade is maxed', () => {
    assert.strictEqual(I.buyUpgrade(D(), 'desk', 1), null);
    const rich = D({ k: { tpl: 'x', pay: 99999, t: 1 } }, Object.fromEntries([1, 2, 3].map(i => ['c' + i, { upg: 'cap', cost: 1, t: i }])));
    assert.strictEqual(I.buyUpgrade(rich, 'cap', 10), null);
    assert.deepStrictEqual(I.buyUpgrade(rich, 'analyst', 10).writes, [{ key: 'upg-analyst-10', rec: { upg: 'analyst', cost: 400, t: 10 } }]);
    assert.strictEqual(I.buyUpgrade(rich, 'nope', 10), null);
  }],
  ['repass on shift re-pins every current desk so a stale pipeline cannot back-fill it', () => {
    const d = D(pipe('a', 1000), pipe('b', 2000), pipe('c', 3000)), now = 1000 + 20 * H;
    const res = I.repass(d, 'a', now);
    assert.deepStrictEqual(res.writes.map(w => w.key), ['collect-a-1000', 'shift']);
    apply(d, res);
    Object.assign(d.shop, pipe('a', now, { stepCount: 2 }));
    assert.deepStrictEqual(I.onShift(d).map(o => o.id), ['a', 'b']);
    assert.strictEqual(I.outbox(d, 'c', now + H).amount, 0);
    assert.strictEqual(I.outbox(d, 'a', now + H).amount, 14);
  }],
  ['repass on an off-shift pipeline is a no-op', () => {
    const d = D(pipe('a', 1000), pipe('b', 2000), pipe('c', 3000));
    assert.deepStrictEqual(I.repass(d, 'c', 1000 + 20 * H).writes, []);
  }],
  ['merge credits overlapping device collects on the same pipeline only once', () => {
    const base = D(pipe('x', 0, { stepCount: 2 }));
    const dA = JSON.parse(JSON.stringify(base)), dB = JSON.parse(JSON.stringify(base));
    const c1 = I.collect(dA, 'x', H); dA.shop[c1.key] = Object.assign(c1.rec, { mod: 1 });
    const c2 = I.collect(dB, 'x', 2 * H); dB.shop[c2.key] = Object.assign(c2.rec, { mod: 2 });
    const c3 = I.collect(dA, 'x', 3 * H); dA.shop[c3.key] = Object.assign(c3.rec, { mod: 1 });
    assert.strictEqual(C.state(Store.merge(dA, dB)).cash, 42);
  }],
  ['freed desk fills at now; late-synced pipeline keeps its pass time', () => {
    const d = D(pipe('a', 1000), pipe('b', 2000), pipe('c', 3000)), now = 1000 + 5 * H;
    const res = I.setShift(d, ['a'], now);
    assert.deepStrictEqual(res.writes[1].rec, { shift: { a: 1000, c: now }, off: ['b'], t: now });
    apply(d, res);
    assert.deepStrictEqual(I.onShift(d), [{ id: 'a', since: 1000 }, { id: 'c', since: now }]);
    const d2 = D(pipe('a', 1000), { shift: { shift: { a: 1000 }, off: [], t: 10 * H } });
    Object.assign(d2.shop, pipe('z', 3000));
    assert.ok(I.onShift(d2).find(o => o.id === 'z' && o.since === 3000));
  }]
];
