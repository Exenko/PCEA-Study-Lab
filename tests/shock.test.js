const assert = require('assert');
const T = require('../js/shop/templates.js');
const C = require('../js/shop/core.js');
const P = require('../js/shop/pipeline.js');
const REF = require('./fixtures/pipes.js');
const HARD = require('./fixtures/hard-pipes.js');
const SHOCKED = ['cpif-fee', 'esc-compound', 'esc-index', 'evm-eac', 'lc-lot', 'lc-unit', 'mfg-labor', 'npv'];
const tpl = id => T.find(t => t.id === id);
const each = fn => { for (const id of SHOCKED) for (let tier = 1; tier <= 3; tier++) for (let seed = 1; seed <= 20; seed++) fn(id, tier, tpl(id).shock(C.helpers(C.rng(C.hash('shock|' + id + '|' + tier + '|' + seed))), tier)); };
const exact = (pipe, job) => { const r = P.run(pipe, job.inputs); return job.answers.every((a, k) => r.outs[k] != null && C.answerScore(r.outs[k], a.value) === 1); };

module.exports = [
  ['exactly the eight planned templates have shock variants', () => {
    assert.deepStrictEqual(T.filter(t => typeof t.shock === 'function').map(t => t.id).sort(), SHOCKED);
    assert.deepStrictEqual(T.filter(t => typeof t.solve === 'function').map(t => t.id).sort(), SHOCKED);
  }],
  ['solve reproduces the answers gen computes', () => {
    for (const id of SHOCKED) for (let tier = 1; tier <= 3; tier++) for (let seed = 1; seed <= 30; seed++) {
      const j = tpl(id).gen(C.helpers(C.rng(seed * 7919 + tier)), tier), v = tpl(id).solve(j.inputs);
      assert.strictEqual(v.length, j.answers.length, id);
      j.answers.forEach((a, k) => assert.ok(Math.abs(v[k] - a.value) <= 1e-9 * Math.max(1, Math.abs(a.value)), `${id} ${k}: ${v[k]} vs ${a.value}`));
    }
  }],
  ['shock jobs have the template inputs, a story and finite answers', () => each((id, tier, job) => {
    assert.deepStrictEqual(Object.keys(job.inputs).sort(), Object.keys(tpl(id).ins).sort(), id);
    assert.ok(typeof job.story === 'string' && job.story.length >= 10, id);
    assert.ok(job.answers.length >= 1 && job.answers.every(a => Number.isFinite(a.value) && a.label && typeof a.unit === 'string'), id);
  })],
  ['reference pipelines answer every shock contract exactly', () => each((id, tier, job) => {
    assert.ok(exact(REF[id].prim, job), id + ' prim tier ' + tier);
    assert.ok(exact(REF[id].domain, job), id + ' domain tier ' + tier);
  })],
  ['hard-coded pipelines fail shock contracts', () => each((id, tier, job) => assert.ok(!exact(HARD[id], job), id + ' tier ' + tier))],
  ['shock inputs sit outside the normal ranges', () => each((id, tier, job) => {
    const i = job.inputs;
    const out = {
      'esc-compound': () => i.rate < 0,
      'esc-index': () => i.idxBase >= 95,
      'lc-unit': () => i.slope >= 0.7 && i.slope < 0.8,
      'lc-lot': () => i.first >= 500,
      'npv': () => i.rate >= 0.12 && i.flows.length >= 7,
      'evm-eac': () => i.ev / i.ac < 0.7,
      'cpif-fee': () => { const raw = i.targetFee + i.conShare * (i.targetCost - i.actual); return raw < i.minFee || raw > i.maxFee; },
      'mfg-labor': () => i.rate > 180
    }[id];
    assert.ok(out(), id + ' ' + JSON.stringify(i));
  })]
];
