const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const Meta = require('../js/widget-meta.js');

function loadWidgets() {
  const ctx = { Render: { el: () => ({}), inline: s => s }, Plot: {}, WMath: require('../js/wmath.js'), Challenge: require('../js/challenge.js'), console, Object, Array };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/widgets.js'), 'utf8') + '\nthis.Widgets = Widgets;', ctx);
  return ctx.Widgets;
}

module.exports = [
  ['manifest lists exactly the registered widgets', () => {
    assert.deepStrictEqual(loadWidgets().names().slice().sort(), Object.keys(Meta).sort());
  }],
  ['manifest entries are well formed', () => {
    for (const [name, m] of Object.entries(Meta)) {
      ['controls', 'setters', 'outputs'].forEach(k => assert.ok(Array.isArray(m[k]), `${name}.${k}`));
      m.setters.forEach(s => assert.ok(!m.controls.includes(s), `${name}: ${s} is both control and setter`));
      assert.strictEqual(new Set(m.outputs).size, m.outputs.length, `${name}: duplicate outputs`);
    }
  }]
];
