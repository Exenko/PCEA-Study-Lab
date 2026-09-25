const assert = require('assert');
const F = require('../js/shop/firm.js');
const H = 3600000;
const pipe = (id, at) => ({ ['pipe-' + id]: { pipe: id, steps: [], outs: [], stepCount: 2, primitivesOnly: false, passed: true, tier: 1, passedAt: at, t: at } });
const D = (...parts) => ({ shop: Object.assign({}, ...parts) });
const sched = last => ({ profile: 'Ann', isDue: () => false, get: id => (id in last ? { last: last[id] } : null), cards: () => [] });
const audit = at => ({ ['evt-esc-compound-' + at]: { evt: 'esc-compound', kind: 'audit', module: 'm05', at, cards: ['c1', 'c2'], seed: 1, t: at } });

module.exports = [
  ['audit desk shows progress and a review link until every card is done', () => {
    const d = D(pipe('esc-compound', 0), audit(30 * H));
    const html = F.panel(d, 40 * H, sched({ c1: 31 * H }));
    assert.ok(html.includes('idle-desk stalled'));
    assert.ok(html.includes('Stalled: Audit m05 (1/2 reviewed)'));
    assert.ok(html.includes('href="#/cards?m=m05"'));
    assert.ok(!html.includes('data-resolve'));
    const done = F.panel(d, 40 * H, sched({ c1: 31 * H, c2: 32 * H }));
    assert.ok(done.includes('data-resolve="esc-compound"'));
    assert.ok(!done.includes('Review cards'));
  }],
  ['shock desk links to the workshop; healthy desk has no chip', () => {
    const d = D(pipe('esc-compound', 0), pipe('lc-unit', 0), { 'evt-esc-compound-9': { evt: 'esc-compound', kind: 'shock', module: 'm05', at: 9, seed: 1, t: 9 } });
    const html = F.panel(d, 40 * H, sched({}));
    assert.ok(html.includes('Stalled: Market shock'));
    assert.ok(html.includes('href="#/shop/pipe/esc-compound"'));
    assert.strictEqual(html.split('wk-chip stalled').length - 1, 1);
    assert.strictEqual(F.stallChip(d, 'lc-unit', sched({})), '');
  }]
];
