// Content validator: node tools/validate.js content/m05.js [more files...]
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
global.window = {};
eval(fs.readFileSync(path.join(root, 'js/registry.js'), 'utf8'));
const PCEA = window.PCEA;
const Meta = require('../js/widget-meta.js');
const Challenge = require('../js/challenge.js');
const CALLOUTS = ['tip', 'warn', 'key', 'example', 'formula', 'note', 'check', 'widget'];
let errors = 0;
const err = (f, msg) => { errors++; console.log(`ERROR ${f}: ${msg}`); };

function checkWidgetArgs(where, argStr) {
  const a = Challenge.parseArgs(argStr), meta = Meta[a.name];
  if (!meta) { err(where, 'unknown widget ' + a.name); return null; }
  a.bad.forEach(t => err(where, `${a.name}: bad argument ${t}`));
  Object.keys(a.presets).forEach(k => { if (!meta.controls.includes(k) && !meta.setters.includes(k)) err(where, `${a.name}: unknown preset ${k}`); });
  a.lock.forEach(k => { if (!meta.controls.includes(k)) err(where, `${a.name}: cannot lock ${k}`); });
  return meta;
}

for (const rel of process.argv.slice(2)) {
  const file = path.resolve(rel);
  const src = fs.readFileSync(file, 'utf8');
  if (/\$\{/.test(src)) err(rel, 'contains "${" (breaks String.raw template)');
  const before = PCEA.modules.length;
  try { eval(src); } catch (e) { err(rel, 'JS error: ' + e.message); continue; }
  const m = PCEA.modules[PCEA.modules.length - 1];
  if (PCEA.modules.length !== before + 1) { err(rel, 'addModule not called'); continue; }
  ['id', 'num', 'title', 'short', 'source', 'blurb', 'intro'].forEach(k => { if (m[k] == null || m[k] === '') err(rel, 'missing ' + k); });
  if (!Array.isArray(m.sections) || !m.sections.length) err(rel, 'no sections');
  const secIds = new Set();
  let checks = 0;
  (m.sections || []).forEach(s => {
    const where = `${rel} [${s.id}]`;
    if (!s.id || !s.title || !s.body) err(where, 'section missing id/title/body');
    if (secIds.has(s.id)) err(where, 'duplicate section id'); secIds.add(s.id);
    // directive structure
    let open = null;
    s.body.split('\n').forEach((line, i) => {
      if (open) { if (/^:::\s*$/.test(line)) open = null; else if (/^:::\w/.test(line)) err(where, `line ${i}: directive opened inside :::${open}`); return; }
      const one = line.match(/^:::(\w+)\s*(.*?):::\s*$/);
      const op = line.match(/^:::(\w+)\s*(.*)$/);
      if (one) {
        if (one[1] !== 'widget') err(where, `single-line :::${one[1]}::: only allowed for widgets`);
        else checkWidgetArgs(where, one[2]);
      } else if (op) {
        if (!CALLOUTS.includes(op[1])) err(where, 'unknown directive ' + op[1]);
        if (op[1] === 'widget') checkWidgetArgs(where, op[2]);
        open = op[1];
      }
      if (!open && /^:::\s*$/.test(line)) err(where, `line ${i}: stray closing :::`);
    });
    if (open) err(where, `unclosed :::${open}`);
    // checks
    const blocks = s.body.split(/^:::check.*$/m).slice(1).map(b => b.split(/^:::\s*$/m)[0]);
    blocks.forEach((b, i) => {
      checks++;
      const w = `${where} check#${i}`;
      if (!/^Q:/m.test(b)) err(w, 'missing "Q:" line');
      const right = (b.match(/^\s*\*\s+/mg) || []).length, wrong = (b.match(/^\s*-\s+/mg) || []).length;
      const ans = b.match(/^\s*=\s*(.+)$/m);
      if (!right && !ans) err(w, 'no correct option (*) and no = answer');
      if (right > 1) err(w, 'more than one * option');
      if (right && !wrong) err(w, 'multiple choice needs at least one wrong (-) option');
      if (right && ans) err(w, 'has both options and = answer');
      if (ans && !/^(-?[\d.eE+-]+)\s*(?:±|\+-)?\s*([\d.]+%?)?$/.test(ans[1].trim())) err(w, 'numeric answer must be a plain number with optional ±tol, got: ' + ans[1]);
      if (!/^\s*>/m.test(b)) err(w, 'missing ">" explanation');
    });
    // unbalanced inline math per paragraph (ignores escaped \$)
    s.body.split(/\n\s*\n/).forEach(p => {
      const t = p.replace(/\\\$/g, '').replace(/\$\$[\s\S]*?\$\$/g, '');
      if ((t.match(/\$/g) || []).length % 2) err(where, 'odd number of $ in paragraph (money must be written \\$): ' + p.slice(0, 70).replace(/\n/g, ' '));
    });
  });
  const cards = m.cardList;
  const ids = cards.map(c => c.id);
  if (ids.length !== new Set(ids).size) err(rel, 'duplicate card questions');
  cards.forEach(c => [c.q, c.a].forEach(t => {
    const x = t.replace(/\\\$/g, '');
    if ((x.match(/\$/g) || []).length % 2) err(rel, 'card has odd $ (money must be \\$): ' + c.q.slice(0, 60));
  }));
  const raw = (m.cards || '').split('\n').filter(l => /^Q:/.test(l)).length;
  if (raw !== cards.length) err(rel, `cards: ${raw} Q: lines but ${cards.length} parsed (a Q: is missing its A:?)`);
  console.log(`${rel}: ${m.sections.length} sections, ${checks} checks, ${cards.length} cards, ${new Set(cards.map(c => c.tag)).size} card topics, source=${m.source}`);
}
console.log(errors ? `${errors} ERROR(S)` : 'OK');
process.exit(errors ? 1 : 0);
