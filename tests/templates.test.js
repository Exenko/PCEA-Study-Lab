const assert = require('assert');
const C = require('../js/shop/core.js');
const T = require('../js/shop/templates.js');
const fs = require('fs');
const path = require('path');

module.exports = [
  ['23 templates with unique ids and valid sections', () => {
    assert.strictEqual(T.length, 23);
    assert.strictEqual(new Set(T.map(t => t.id)).size, T.length);
    T.forEach(t => {
      const [m, s] = t.section.split('/');
      assert.strictEqual(m, t.module, t.id);
      const src = fs.readFileSync(path.join(__dirname, '..', 'content', m + '.js'), 'utf8');
      assert.ok(src.includes(`id: '${s}'`), t.id + ' section ' + t.section);
    });
  }],
  ['every template produces sane jobs for 500 seeds x 3 tiers', () => {
    for (const t of T) for (let tier = 1; tier <= 3; tier++) for (let seed = 1; seed <= 500; seed++) {
      const j = t.gen(C.helpers(C.rng(seed * 7919 + tier)), tier);
      const where = `${t.id} tier ${tier} seed ${seed}`;
      assert.ok(typeof j.brief === 'string' && j.brief.length > 20, where + ' brief');
      assert.ok(typeof j.explain === 'string' && j.explain.length > 20, where + ' explain');
      assert.ok(!/NaN|undefined|Infinity/.test(j.brief + j.explain), where + ' text has NaN/undefined');
      assert.ok(Array.isArray(j.answers) && j.answers.length >= 1, where + ' answers');
      j.answers.forEach(a => {
        assert.ok(a.label && typeof a.unit === 'string', where + ' label/unit');
        assert.ok(Number.isFinite(a.value) && Math.abs(a.value) > 1e-9, where + ' value ' + a.value);
      });
    }
  }],
  ['spot checks', () => {
    const job = id => T.find(t => t.id === id);
    // Fixed-input checks via a stub helper that returns the midpoint of each range / first pick.
    const stub = { r: () => 0, num: (lo) => lo, pick: a => a[0] };
    const lc = job('lc-unit').gen(stub, 1);
    const b = Math.log(0.80) / Math.log(2);
    assert.ok(Math.abs(lc.answers[0].value - 800 * Math.pow(10, b)) < 1e-6);
    const npv = job('npv').gen(stub, 1);
    assert.ok(Number.isFinite(npv.answers[0].value));
  }],
  ['gen output matches the pre-pipeline snapshot', () => {
    const snap = require('./fixtures/gen-snapshot.json');
    for (const t of T) for (let tier = 1; tier <= 3; tier++) for (let seed = 1; seed <= 3; seed++) {
      const j = t.gen(C.helpers(C.rng(seed * 7919 + tier)), tier);
      assert.deepStrictEqual({ brief: j.brief, answers: j.answers, explain: j.explain }, snap[t.id + '|' + tier + '|' + seed], t.id + ' tier ' + tier + ' seed ' + seed);
    }
  }],
  ['every template exposes inputs matching its ins metadata', () => {
    for (const t of T) {
      assert.ok(t.ins && typeof t.ins === 'object', t.id + ' ins');
      for (let tier = 1; tier <= 3; tier++) for (let seed = 1; seed <= 50; seed++) {
        const j = t.gen(C.helpers(C.rng(seed * 7919 + tier)), tier);
        assert.deepStrictEqual(Object.keys(j.inputs).sort(), Object.keys(t.ins).sort(), t.id);
        for (const [k, v] of Object.entries(j.inputs)) {
          const ok = Array.isArray(v) ? v.length > 0 && v.every(Number.isFinite) : Number.isFinite(v);
          assert.ok(ok, `${t.id} input ${k} = ${v}`);
          assert.ok(t.ins[k].label && typeof t.ins[k].unit === 'string', `${t.id} ins ${k}`);
        }
      }
    }
  }],
  ['every template has a hint line', () => {
    T.forEach(t => assert.ok(typeof t.hint === 'string' && t.hint.length >= 20 && t.hint.length <= 160, t.id));
  }]
];
