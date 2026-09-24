// Minimal test runner: each tests/*.test.js exports [[name, fn], ...]. fn may be async.
const fs = require('fs');
const path = require('path');
(async () => {
  const only = process.argv[2];
  const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.test.js') && (!only || f.includes(only))).sort();
  let pass = 0, fail = 0;
  for (const f of files) {
    for (const [name, fn] of require(path.join(__dirname, f))) {
      try { await fn(); pass++; console.log('PASS', f, '-', name); }
      catch (e) { fail++; console.log('FAIL', f, '-', name, '\n   ', e && e.stack ? e.stack.split('\n').slice(0, 3).join('\n    ') : e); }
    }
  }
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
