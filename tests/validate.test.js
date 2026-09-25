const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

function validate(body) {
  const file = path.join(os.tmpdir(), 'pcea-validate-' + process.pid + '.js');
  const mod = { id: 'mx', num: 99, title: 'T', short: 'T', source: 'guide', blurb: 'b', intro: 'i', sections: [{ id: 's', title: 'S', body }], cards: 'Q: a\nA: b' };
  fs.writeFileSync(file, 'PCEA.addModule(' + JSON.stringify(mod) + ');');
  const r = spawnSync(process.execPath, [path.join(__dirname, '../tools/validate.js'), file], { encoding: 'utf8' });
  fs.unlinkSync(file);
  return r.stdout;
}
const GOOD = [':::challenge lc-explorer lcs=0.95 n=8 lock=theory', 'Q: go', 'goal: unitN ~ 51.2 +- 0.5%', 'show: lcs=0.8', '> why', ':::'].join('\n');

module.exports = [
  ['valid challenge passes and is counted', () => {
    const out = validate(GOOD);
    assert.match(out, /1 challenges/);
    assert.match(out, /\nOK/);
  }],
  ['challenge errors are reported', () => {
    const bad = [
      [':::challenge nope', 'Q: x', '* a', '- b', '> e', ':::', 'unknown widget nope'],
      [':::challenge lc-explorer', 'Q: x', 'goal: bogus > 1', 'show: lcs=0.8', '> e', ':::', 'unknown output bogus'],
      [':::challenge lc-explorer', 'Q: x', 'predict: nothing +- 1%', '> e', ':::', 'unknown output nothing'],
      [':::challenge lc-explorer', 'Q: x', 'goal: unitN > 1', 'show: zzz=1', '> e', ':::', 'show sets unknown key zzz'],
      [':::challenge lc-explorer foo=1', 'Q: x', '* a', '- b', '> e', ':::', 'unknown preset foo'],
      [':::challenge lc-explorer lock=unitN', 'Q: x', '* a', '- b', '> e', ':::', 'cannot lock unitN'],
      [':::challenge lc-explorer', 'Q: x', 'goal: unitN > 1', '> e', ':::', 'target needs show']
    ];
    bad.forEach(lines => {
      const want = lines.pop();
      assert.ok(validate(lines.join('\n')).includes(want), 'expected: ' + want);
    });
  }]
];
