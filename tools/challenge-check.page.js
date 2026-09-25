// Mounts every widget and every authored challenge, then exercises the challenge UI. Report goes in #out.
(function () {
  const lines = [];
  let fails = 0;
  const pass = m => lines.push('PASS ' + m);
  const fail = m => { fails++; lines.push('FAIL ' + m); };
  const stage = document.getElementById('stage');
  const sameSet = (a, b) => a.slice().sort().join() === b.slice().sort().join();
  const mountBox = args => { const box = document.createElement('div'); stage.appendChild(box); return Widgets.mount(box, args); };
  const outs = w => JSON.stringify(w.out, (k, v) => (typeof v === 'number' ? +v.toPrecision(5) : v));

  // 1. every widget publishes exactly its manifest outputs and exposes its settable keys
  Object.keys(WidgetMeta).forEach(name => {
    const w = mountBox(name), meta = WidgetMeta[name];
    const missing = meta.controls.concat(meta.setters).filter(k => !w.setters[k]);
    if (!sameSet(Object.keys(w.out), meta.outputs)) fail(`widget ${name}: publishes [${Object.keys(w.out)}] but manifest says [${meta.outputs}]`);
    else if (missing.length) fail(`widget ${name}: no setter for ${missing}`);
    else pass('widget ' + name);
  });

  // 2. every authored challenge is solvable with its widget's own math
  let total = 0;
  PCEA.modules.forEach(m => m.sections.forEach(s => {
    let i = 0;
    Render.split(s.body).filter(b => b.kind === 'dir' && b.type === 'challenge').forEach(b => {
      total++;
      const where = `${m.id}/${s.id}#c${i++}`;
      const c = Challenge.parse(b.body);
      if (c.errors.length) return fail(where + ': ' + c.errors.join('; '));
      const w = mountBox(b.args);
      if (c.type === 'target') {
        if (Challenge.evalGoals(c.goals, w.out)) return fail(where + ': goal already met at presets ' + outs(w));
        w.setMany(c.show);
        if (!Challenge.evalGoals(c.goals, w.out)) return fail(where + ': show values miss the goal ' + outs(w));
        pass(where + ' target');
      } else if (c.type === 'predict') {
        const v = w.out[c.predict.out];
        if (!isFinite(v)) return fail(where + ': predicted output is not finite ' + outs(w));
        pass(`${where} answer ${c.predict.out} = ${Challenge.fmt(v)}`);
      } else pass(where + ' choose');
    });
  }));
  lines.push(`(${total} challenges in content)`);

  // 3. challenge UI through Render.section with the stub Store
  const ui = (name, fn) => { try { fn(); pass('ui ' + name); } catch (e) { fail('ui ' + name + ': ' + e.message); } };
  const assert = (cond, msg) => { if (!cond) throw new Error(msg); };
  let uid = 0;
  const mk = body => {
    const ctx = { key: 'ui/' + (uid++), onChange() {} };
    const steps = Render.section(body, ctx);
    steps.forEach(st => stage.appendChild(st));
    return { ctx, root: steps[0], id: ctx.key + '#c0' };
  };
  const TARGET = [':::challenge lc-explorer lcs=0.95 n=8 lock=theory', 'Q: hit it', 'goal: unitN ~ 51.2 +- 0.5%', 'show: lcs=0.8', '> why', ':::'].join('\n');
  const PREDICT = [':::challenge sw-effort E=1.1 lock=A,E', 'Q: factor?', 'predict: doubleX +- 1%', '> 2^1.1', ':::'].join('\n');

  ui('target solved by the learner counts as first try', () => {
    const { root, id } = mk(TARGET);
    const box = root.querySelector('.challenge');
    assert(!box.classList.contains('done'), 'done before any interaction');
    box.querySelector('.widget').w.set('lcs', 0.8);
    assert(box.classList.contains('done'), 'not done after reaching goal');
    assert(Store.data.checks[id].first === true, 'first should be true: ' + JSON.stringify(Store.data.checks[id]));
  });
  ui('target via Show me is not first try, and restores as done', () => {
    const { ctx, root, id } = mk(TARGET);
    const [stuck, showMe] = root.querySelectorAll('.ch-tools button');
    assert(showMe.hidden, 'Show me visible too early');
    stuck.click(); showMe.click();
    assert(Store.data.checks[id].done && Store.data.checks[id].first === false, JSON.stringify(Store.data.checks[id]));
    const again = Render.section(TARGET, ctx)[0];
    assert(again.querySelector('.challenge').classList.contains('done'), 'not restored');
  });
  ui('challenge ids do not shift check ids', () => {
    const { ctx, root } = mk([':::challenge trl', 'Q: pick', '* a', '- b', '> x', ':::', '', ':::check', 'Q: q', '* a', '- b', '> x', ':::'].join('\n'));
    assert(root.querySelector('.check:not(.challenge)').dataset.checkId === ctx.key + '#0', 'check id shifted');
    assert(root.querySelector('.challenge').dataset.checkId === ctx.key + '#c0', 'challenge id wrong');
  });
  ui('predict freezes, records guess, restores', () => {
    const { ctx, root, id } = mk(PREDICT);
    const wb = root.querySelector('.challenge .widget');
    assert(wb.classList.contains('w-frozen') && wb.inert, 'not frozen');
    root.querySelector('.challenge input').value = '2.14';
    root.querySelector('.challenge .check-input .btn').click();
    assert(!wb.classList.contains('w-frozen') && !wb.inert, 'still frozen');
    assert(Store.data.checks[id].first === true && Store.data.checks[id].guess === 2.14, JSON.stringify(Store.data.checks[id]));
    const again = Render.section(PREDICT, ctx)[0];
    assert(again.querySelector('.challenge').classList.contains('done'), 'not restored');
    assert(!again.querySelector('.challenge .widget').classList.contains('w-frozen'), 'restored widget still frozen');
  });
  ui('predict accepts percent input', () => {
    const { root, id } = mk(PREDICT);
    root.querySelector('.challenge input').value = '214%';
    root.querySelector('.challenge .check-input .btn').click();
    assert(Store.data.checks[id].first === true, JSON.stringify(Store.data.checks[id]));
  });
  ui('wrong predict completes with first = false', () => {
    const { root, id } = mk(PREDICT);
    root.querySelector('.challenge input').value = '2';
    root.querySelector('.challenge .check-input .btn').click();
    assert(Store.data.checks[id].done && Store.data.checks[id].first === false, JSON.stringify(Store.data.checks[id]));
  });
  ui('predict accepts a percent typed without % sign', () => {
    const body = [':::challenge stats-lab data=229.70,221.58,244.94,250.66', 'Q: cv?', 'predict: cv +- 5%', '> divide sd by mean', ':::'].join('\n');
    const { root, id } = mk(body);
    root.querySelector('.challenge input').value = '5.67';
    root.querySelector('.challenge .check-input .btn').click();
    assert(Store.data.checks[id].first === true, JSON.stringify(Store.data.checks[id]));
  });
  ui('choose: wrong then right is not first try', () => {
    const { root, id } = mk([':::challenge trl', 'Q: pick', '- wrong', '* right', '> x', ':::'].join('\n'));
    const [bad, good] = root.querySelectorAll('.challenge .opt');
    bad.click(); good.click();
    assert(Store.data.checks[id].done && Store.data.checks[id].first === false, JSON.stringify(Store.data.checks[id]));
  });

  lines.push(fails ? `SUMMARY ${fails} FAILED` : 'SUMMARY ALL PASSED');
  document.getElementById('out').textContent = lines.join('\n');
})();
