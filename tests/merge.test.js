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
  for (const p of ['cards', 'checks', 'sections', 'days', 'shop']) {
    d[p] = {};
    for (let i = 0; i < 4; i++) if (r() < 0.6) d[p]['k' + i] = { v: Math.floor(r() * 5), mod: Math.floor(r() * 10) };
    if (r() < 0.2) d.resets[p] = Math.floor(r() * 10);
  }
  return d;
}
const partsOnly = d => JSON.stringify(['cards', 'checks', 'sections', 'days', 'shop', 'resets'].map(p => d[p]));

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
  }]
];
