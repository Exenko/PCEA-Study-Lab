const assert = require('assert');
const fs = require('fs'), path = require('path'), vm = require('vm');
const DAY = 864e5;
function load(cards) {
  const Store = { data: { cards }, settings: { hitsToLevel: 2 }, markActive() {}, save() {} };
  const ctx = { Store, Date, Math };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js/scheduler.js'), 'utf8') + '\nthis.Scheduler = Scheduler;', ctx);
  return ctx.Scheduler;
}
const startOfToday = () => { const t = new Date(); t.setHours(0, 0, 0, 0); return t.getTime(); };

module.exports = [
  ['grade stores the prior due as pdue on the first grade of the day', () => {
    const due = startOfToday() - 1.5 * DAY;
    const cards = { a: { lvl: 1, hits: 0, seen: 3, right: 2, wrong: 1, due, last: startOfToday() - 3 * DAY } };
    load(cards).grade('a', 2);
    assert.strictEqual(cards.a.pdue, due);
    assert.ok(cards.a.due > due);
  }],
  ['pdue kept on second grade today', () => {
    const due = startOfToday() - 1.5 * DAY;
    const cards = { a: { lvl: 1, hits: 0, seen: 3, right: 2, wrong: 1, due, last: startOfToday() - 3 * DAY } };
    const S = load(cards);
    S.grade('a', 0);
    S.grade('a', 2);
    assert.strictEqual(cards.a.pdue, due);
  }],
  ['a card first seen today gets pdue null', () => {
    const cards = {};
    load(cards).grade('n', 2);
    assert.strictEqual(cards.n.pdue, null);
  }]
];
