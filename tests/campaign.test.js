const assert = require('assert');
const K = require('../js/shop/campaign.js');
module.exports = [
  ['8 campaigns, rep levels 0..7, all answers finite', () => {
    assert.strictEqual(K.length, 8);
    assert.deepStrictEqual(K.map(c => c.rep), [0, 1, 2, 3, 4, 5, 6, 7]);
    K.forEach(c => {
      assert.ok(c.id && c.title && c.story && c.steps.length >= 2, c.id);
      c.steps.forEach((s, i) => {
        assert.ok(s.prompt && s.explain, c.id + i);
        s.answers.forEach(a => assert.ok(Number.isFinite(a.value) && a.value !== 0, `${c.id} step ${i} ${a.label}`));
      });
    });
  }],
  ['spot values', () => {
    const inc = K.find(c => c.id === 'incentive');
    assert.ok(Math.abs(inc.steps[2].answers[0].value - 145.714) < 0.01);
    const act = K.find(c => c.id === 'actuator');
    assert.strictEqual(act.steps[0].answers[0].value, 3125);
  }]
];
