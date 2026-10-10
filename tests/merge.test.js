const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');

function loadStore() {
  const mem = {};
  const ctx = {
    console, Date, Math, JSON, Object, Set, Array, Promise, setTimeout, clearTimeout,
    localStorage: { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: k => { delete mem[k]; } },
    location: { protocol: 'file:' }, document: { addEventListener() {} }
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/storage.js'), 'utf8') + '\nthis.Store = Store;', ctx);
  return ctx.Store;
}
const Store = loadStore();
const server = require(path.join(ROOT, 'server.js'));

function rand(seed) { let s = seed; return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; }; }
function profile(r) {
  const d = { meta: {}, resets: {} };
  for (const p of ['cards', 'checks', 'sections', 'days', 'shop', 'primers']) {
    d[p] = {};
    for (let i = 0; i < 4; i++) if (r() < 0.6) d[p]['k' + i] = { v: Math.floor(r() * 5), mod: Math.floor(r() * 10) };
    if (r() < 0.2) d.resets[p] = Math.floor(r() * 10);
  }
  return d;
}
const partsOnly = d => JSON.stringify(['cards', 'checks', 'sections', 'days', 'shop', 'primers', 'resets'].map(p => d[p]));

module.exports = [
  ['store has days and shop parts', () => {
    const d = Store.normalize({});
    assert.deepStrictEqual(d.days, {});
    assert.deepStrictEqual(d.shop, {});
    assert.strictEqual(d.settings.leaderboard, false);
  }],
  ['client and server merge agree on every part', () => {
    const r = rand(7);
    for (let i = 0; i < 500; i++) {
      const a = profile(r), b = profile(r);
      assert.strictEqual(partsOnly(Store.merge(a, b)), partsOnly(server.merge(a, b)), 'case ' + i);
    }
  }],
  ['client and server merge agree on seenAch', () => {
    const r = rand(11);
    const seenAchVariant = () => {
      const v = r();
      if (v < 0.3) return undefined;
      if (v < 0.5) return null;
      const n = Math.floor(r() * 4), arr = [];
      for (let i = 0; i < n; i++) arr.push('a' + Math.floor(r() * 5));
      return arr;
    };
    for (let i = 0; i < 300; i++) {
      const a = profile(r), b = profile(r);
      a.seenAch = seenAchVariant(); b.seenAch = seenAchVariant();
      a.meta.seenAch = Math.floor(r() * 10); b.meta.seenAch = Math.floor(r() * 10);
      const ca = Store.merge(a, b), cb = server.merge(a, b);
      assert.strictEqual(JSON.stringify(ca.seenAch), JSON.stringify(cb.seenAch), 'case ' + i);
      assert.strictEqual(ca.meta.seenAch, cb.meta.seenAch, 'case ' + i);
    }
  }],
  ['seenAch merges as sorted union', () => {
    const a = { meta: { seenAch: 3 }, seenAch: ['b', 'a'] }, b = { meta: { seenAch: 5 }, seenAch: ['c', 'a'] };
    assert.strictEqual(JSON.stringify(Store.merge(a, b).seenAch), JSON.stringify(['a', 'b', 'c']));
    assert.strictEqual(JSON.stringify(server.merge(a, b).seenAch), JSON.stringify(['a', 'b', 'c']));
  }],
  ['seenAch null plus null stays null', () => {
    const a = { meta: { seenAch: 1 }, seenAch: null }, b = { meta: { seenAch: 2 }, seenAch: null };
    assert.strictEqual(Store.merge(a, b).seenAch, null);
    assert.strictEqual(server.merge(a, b).seenAch, null);
  }],
  ['shop records survive merge from either side', () => {
    const a = { shop: { x: { tpl: 'lc-unit', pay: 10, mod: 5 } } }, b = { shop: { y: { tool: 'calc', cost: 100, mod: 6 } } };
    const m = Store.merge(a, b);
    assert.ok(m.shop.x && m.shop.y);
  }],
  ['markActive records today once', () => {
    Store.profile = null; Store.data = Store.normalize({});
    Store.markActive(); Store.markActive();
    const keys = Object.keys(Store.data.days);
    assert.strictEqual(keys.length, 1);
    assert.match(keys[0], /^\d{4}-\d{2}-\d{2}$/);
  }],
  ['store has a primers part', () => {
    assert.deepStrictEqual(Store.normalize({}).primers, {});
  }],
  ['a newer cleared primer beats an older answer on both sides', () => {
    const a = { primers: { 'm01/orgs': { type: 'sort', answer: ['A'], score: '1/1', mod: 5 } } };
    const b = { primers: { 'm01/orgs': { cleared: true, mod: 9 } } };
    for (const m of [Store.merge(a, b), Store.merge(b, a), server.merge(a, b), server.merge(b, a)]) {
      assert.strictEqual(m.primers['m01/orgs'].cleared, true);
    }
  }]
];
