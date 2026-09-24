// Workshop: automate a mastered contract type by wiring a pipeline of nodes.
const ShopWorkshop = (() => {
  const C = ShopCore, P = ShopPipe, N = ShopNodes;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = v => Array.isArray(v) ? '[' + v.slice(0, 6).map(fmt).join(', ') + (v.length > 6 ? ', ...' : '') + ']'
    : (+(+v).toPrecision(6)).toLocaleString('en-US', { maximumFractionDigits: 4 });
  const fmtIn = (v, unit) => unit === '%' && !Array.isArray(v) ? fmt(v * 100) + '%' : fmt(v);
  const BAND = x => x === 1 ? ['good', 'Within 1%'] : x === 0.6 ? ['mid', 'Within 5%'] : x === 0.2 ? ['mid', 'Within 10%'] : ['bad', 'Off by more than 10%'];
  const STATUS = { locked: 'Locked', ready: 'Ready to automate', running: 'Running' };
  const empty = n => ({ steps: [], outs: Array(n).fill(null) });

  function panel(d, open) {
    const tpls = ShopTemplates.filter(t => open.has(t.module));
    if (!tpls.length) return '';
    return `<h2>Workshop</h2>
      <p class="muted">Solve a contract type exactly (within 1%) ${P.GATE} times, then automate it. Build it from basic blocks the first time to earn a reusable block.</p>
      <div class="wk-list">${tpls.map(t => {
        const s = P.status(d, t.id), n = P.handSolves(d, t.id);
        const note = s === 'locked' ? `${Math.min(n, P.GATE)}/${P.GATE} exact solves` : STATUS[s];
        return s === 'locked' ? `<div class="wk-item locked"><b>${esc(t.title)}</b><span class="muted small">${note}</span></div>`
          : `<a class="wk-item ${s}" href="#/shop/pipe/${t.id}"><b>${esc(t.title)}</b><span class="wk-chip ${s}">${note}</span></a>`;
      }).join('')}</div>`;
  }

  function route(root, id) {
    const tpl = ShopTemplates.find(t => t.id === id);
    if (!tpl || P.status(Store.data, id) === 'locked') { location.hash = '#/shop'; return; }
    let roll = 0, result = null;
    const sample = () => tpl.gen(C.helpers(C.rng(C.hash(Store.profile.toLowerCase() + '|' + id + '|sample|' + roll))), 1);
    let job = sample();
    const rec = () => P.record(Store.data, id) || {};
    let pipe = JSON.parse(JSON.stringify(rec().draft || (rec().steps ? { steps: rec().steps, outs: rec().outs } : empty(job.answers.length))));
    const [m, s] = tpl.section.split('/');

    function saveDraft() {
      Store.data.shop['pipe-' + id] = Object.assign({}, rec(), { pipe: id, draft: pipe, t: Date.now() });
      Store.save();
    }
    function refOptions(i, cur) {
      const key = cur && typeof cur === 'object' ? 'c' : (cur || '');
      const run = P.run(pipe, job.inputs);
      const opt = (v, label) => `<option value="${v}" ${v === key ? 'selected' : ''}>${esc(label)}</option>`;
      return opt('', 'choose...')
        + `<optgroup label="Contract inputs">${Object.entries(tpl.ins).map(([k, meta]) => opt('in.' + k, `${meta.label} = ${fmtIn(job.inputs[k], meta.unit)}`)).join('')}</optgroup>`
        + (i > 0 ? `<optgroup label="Earlier steps">${pipe.steps.slice(0, i).map((st, j) => opt('s' + j, `Step ${j + 1}: ${(N.byId(st.node) || {}).label || '?'}${run.errs[j] ? '' : ' = ' + fmt(run.vals[j])}`)).join('')}</optgroup>` : '')
        + opt('c', 'Constant...');
    }
    function nodeOptions(cur) {
      const ok = P.allowed(Store.data);
      const grp = (label, list) => { const l = list.filter(n => ok.has(n.id)); return l.length ? `<optgroup label="${label}">${l.map(n => `<option value="${n.id}" ${n.id === cur ? 'selected' : ''}>${esc(n.label)}</option>`).join('')}</optgroup>` : ''; };
      return (cur ? '' : '<option value="">choose a block...</option>') + grp('Basic blocks', N.PRIMITIVE) + grp('Earned blocks', N.DOMAIN) + grp('Tools', N.TOOL);
    }

    function render() {
      const run = P.run(pipe, job.inputs), probs = P.check(pipe, tpl.ins, job.answers.length, P.allowed(Store.data));
      const bad = (i, port) => probs.find(x => x.step === i && x.port === port);
      root.innerHTML = `<div class="shop wk"><a href="#/shop" class="muted small">&larr; Contract board</a>
        <h1>${esc(tpl.title)}</h1>
        <p class="muted">Wire blocks so the outputs answer any contract of this type. <a href="#/learn/${m}/${s}">Review the lesson</a></p>
        <section class="wk-inputs"><h3>Sample contract inputs</h3>
          <dl>${Object.entries(tpl.ins).map(([k, meta]) => `<div><dt>${esc(meta.label)}</dt><dd>${esc(fmtIn(job.inputs[k], meta.unit))} <span class="muted small">${esc(meta.unit === 'flag' ? '' : meta.unit)}</span></dd></div>`).join('')}</dl>
          <button class="btn ghost small" id="reroll">New sample</button></section>
        <section class="wk-chain">${pipe.steps.map((st, i) => {
          const node = N.byId(st.node), err = run.errs[i], nodeBad = bad(i, null);
          return `<div class="wk-step ${err || nodeBad ? 'err' : ''}" data-i="${i}">
            <div class="wk-step-head"><span class="muted small">Step ${i + 1}</span>
              <span class="wk-ctl"><button data-mv="-1" aria-label="Move up">&uarr;</button><button data-mv="1" aria-label="Move down">&darr;</button><button data-del aria-label="Delete">&times;</button></span></div>
            <select class="wk-node">${nodeOptions(st.node)}</select>
            ${node ? `<span class="muted small">${esc(node.hint)}</span>` : ''}
            ${nodeBad ? `<span class="wk-msg">${esc(nodeBad.msg)}</span>` : ''}
            ${(node ? node.ins : []).map(p => {
              const cur = (st.args || {})[p.name], pb = bad(i, p.name), warn = P.pctWarning(pipe, i, p.name, tpl.ins);
              return `<label class="wk-port ${pb ? 'err' : ''}"><span>${esc(p.name)}</span>
                <select data-port="${p.name}">${refOptions(i, cur)}</select>
                ${cur && typeof cur === 'object' ? `<input type="number" step="any" data-const="${p.name}" value="${cur.c}">` : ''}
                ${pb ? `<em class="wk-msg">${esc(pb.msg)}</em>` : warn ? `<em class="wk-warn">${esc(warn)}</em>` : ''}</label>`;
            }).join('')}
            <div class="wk-val">${err && !nodeBad ? `<span class="wk-msg">${esc(err)}</span>` : node ? '= ' + esc(fmt(run.vals[i])) : ''}</div></div>`;
        }).join('')}<button class="btn ghost wk-add" id="add">+ Add block</button></section>
        <section class="wk-outs"><h3>Answers</h3>${job.answers.map((a, k) => {
          const pb = probs.find(x => x.port === 'out' + k), cur = pipe.outs[k] || '';
          return `<label class="wk-port ${pb ? 'err' : ''}"><span>${esc(a.label)} <span class="muted small">${esc(a.unit)}</span></span>
            <select data-out="${k}"><option value="">choose a step...</option>${pipe.steps.map((st, j) => `<option value="s${j}" ${cur === 's' + j ? 'selected' : ''}>Step ${j + 1}${run.errs[j] ? '' : ' = ' + esc(fmt(run.vals[j]))}</option>`).join('')}</select></label>`;
        }).join('')}</section>
        <div class="row-btns"><button class="btn" id="test">Test on ${P.VALIDATE_N} contracts</button></div>
        <div class="wk-result">${result || ''}</div></div>`;
      wire();
    }

    function edit(f) { f(); result = null; saveDraft(); render(); }
    function wire() {
      root.querySelector('#reroll').onclick = () => { roll++; job = sample(); render(); };
      root.querySelector('#add').onclick = () => edit(() => pipe.steps.push({ node: '', args: {} }));
      root.querySelectorAll('.wk-step').forEach(card => {
        const i = +card.dataset.i;
        card.querySelector('.wk-node').onchange = e => edit(() => { pipe.steps[i] = { node: e.target.value, args: {} }; });
        card.querySelectorAll('[data-port]').forEach(sel => sel.onchange = () => edit(() => {
          pipe.steps[i].args = pipe.steps[i].args || {};
          pipe.steps[i].args[sel.dataset.port] = sel.value === 'c' ? { c: 0 } : sel.value;
        }));
        card.querySelectorAll('[data-const]').forEach(inp => inp.onchange = () => edit(() => {
          const v = parseFloat(inp.value);
          pipe.steps[i].args[inp.dataset.const] = { c: Number.isFinite(v) ? v : 0 };
        }));
        card.querySelectorAll('[data-mv]').forEach(b => b.onclick = () => edit(() => { pipe = P.moveStep(pipe, i, +b.dataset.mv); }));
        card.querySelector('[data-del]').onclick = () => edit(() => { pipe = P.removeStep(pipe, i); });
      });
      root.querySelectorAll('[data-out]').forEach(sel => sel.onchange = () => edit(() => { pipe.outs[+sel.dataset.out] = sel.value || null; }));
      root.querySelector('#test').onclick = test;
    }

    function test() {
      const probs = P.check(pipe, tpl.ins, job.answers.length, P.allowed(Store.data));
      if (probs.length) { result = `<p class="wk-msg">Fix the highlighted slots first (${probs.length} problem${probs.length > 1 ? 's' : ''}).</p>`; render(); return; }
      const tries = (rec().tries || 0) + 1, st = C.state(Store.data);
      const v = P.validate(pipe, tpl, Store.profile.toLowerCase() + '|' + id + '|' + tries, st.maxTier);
      const unlocks = v.passed ? P.unlocksFor(pipe, id, Store.data) : [];
      const base = Object.assign({}, rec(), { pipe: id, draft: pipe, tries, t: Date.now() });
      Store.data.shop['pipe-' + id] = v.passed
        ? Object.assign(base, { steps: pipe.steps, outs: pipe.outs, stepCount: pipe.steps.length, primitivesOnly: P.primitivesOnly(pipe), passed: true })
        : base;
      unlocks.forEach(n => { Store.data.shop['node-' + n] = { node: n, t: Date.now() }; });
      Store.markActive();
      Store.save();
      result = `<table class="ptable wk-table"><tr><th>Contract</th>${v.rows[0].labels.map(l => `<th>${esc(l)}</th>`).join('')}</tr>
        ${v.rows.map((r, k) => `<tr><td>#${k + 1} <span class="tier">${'I'.repeat(r.tier)}</span></td>${r.each.map((x, i) => { const [cls, txt] = BAND(x); return `<td class="${cls}">${txt}${r.off[i] == null ? '' : ` (${fmt(r.off[i])}% off)`}</td>`; }).join('')}</tr>`).join('')}</table>
        ${v.passed ? `<div class="result-head good"><b>Pipeline running</b><span>${pipe.steps.length} step${pipe.steps.length > 1 ? 's' : ''}</span></div>` : `<p class="muted">Not every answer was within 1%. <a href="#/learn/${m}/${s}">Review the lesson</a> and adjust the wiring.</p>`}`;
      render();
      if (unlocks.length) {
        const chain = root.querySelector('.wk-chain');
        chain.classList.add('collapsing');
        const names = unlocks.map(n => N.byId(n).label).join(', ');
        setTimeout(() => { chain.classList.remove('collapsing'); chain.insertAdjacentHTML('afterbegin', `<div class="wk-earned">New block earned: <b>${esc(names)}</b></div>`); }, 700);
        Hud.toast('New block earned', names);
      }
    }
    render();
  }
  return { panel, route };
})();
