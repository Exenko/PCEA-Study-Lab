// Workshop: automate a mastered contract type by wiring a pipeline of nodes.
const ShopWorkshop = (() => {
  const C = ShopCore, P = ShopPipe, N = ShopNodes;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = v => Array.isArray(v) ? '[' + v.slice(0, 6).map(fmt).join(', ') + (v.length > 6 ? ', ...' : '') + ']'
    : (+(+v).toPrecision(6)).toLocaleString('en-US', { maximumFractionDigits: 4 });
  const fmtIn = (v, unit) => unit === '%' && !Array.isArray(v) ? fmt(v * 100) + '%' : fmt(v);
  const money = v => '$' + (+v).toLocaleString('en-US', { maximumFractionDigits: 1 }) + 'K';
  const BAND = x => x === 1 ? ['good', 'Within 1%'] : x === 0.6 ? ['mid', 'Within 5%'] : x === 0.2 ? ['mid', 'Within 10%'] : ['bad', 'Off by more than 10%'];
  const STATUS = { locked: 'Locked', ready: 'Ready to automate', running: 'Running' };
  const empty = n => ({ steps: [], outs: Array(n).fill(null) });

  function panel(d, open) {
    const tpls = ShopTemplates.filter(t => open.has(t.module));
    if (!tpls.length) return '';
    const I = ShopIdle, maxTier = C.state(d).maxTier, shift = new Set(I.onShift(d).map(o => o.id)), busy = shift.size >= I.firm(d).desks;
    return `<h2>Workshop</h2>
      <p class="muted">Solve a contract type exactly (within 1%) ${P.GATE} times, then automate it. Pass using only basic blocks to earn a reusable block.</p>
      <div class="wk-list">${tpls.map(t => {
        const s = P.status(d, t.id), n = P.handSolves(d, t.id);
        if (s === 'locked') return `<div class="wk-item locked"><b>${esc(t.title)}</b><span class="muted small">${Math.min(n, P.GATE)}/${P.GATE} exact solves</span></div>`;
        if (s === 'ready') return `<a class="wk-item ready" href="#/shop/pipe/${t.id}"><b>${esc(t.title)}</b><span class="wk-chip ready">${STATUS.ready}</span></a>`;
        const rec = P.record(d, t.id), on = shift.has(t.id), tier = rec.tier || 1;
        return `<div class="wk-item running"><a href="#/shop/pipe/${t.id}"><b>${esc(t.title)}</b></a>
          <span class="muted small">${money(I.rate(d, t.id).net)}/h net &middot; ${rec.stepCount || 0} steps &middot; tier ${'I'.repeat(tier)}</span>
          ${tier < maxTier ? `<a class="wk-chip" href="#/shop/pipe/${t.id}">Re-test for tier ${'I'.repeat(maxTier)}</a>` : ''}
          <button class="btn small ${on ? '' : 'ghost'}" data-shift="${t.id}" ${!on && busy ? 'disabled' : ''}>${on ? 'On shift' : busy ? 'All desks busy' : 'Off shift'}</button></div>`;
      }).join('')}</div>`;
  }

  function wirePanel(root, rerender) {
    root.querySelectorAll('[data-shift]').forEach(b => b.onclick = () => {
      const id = b.dataset.shift, cur = ShopIdle.onShift(Store.data).map(o => o.id);
      const ids = cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id];
      let res;
      try { res = ShopIdle.setShift(Store.data, ids, Date.now()); } catch (e) { return; }
      res.writes.forEach(w => { Store.data.shop[w.key] = w.rec; });
      Store.save();
      rerender();
    });
  }

  function route(root, id) {
    const tpl = ShopTemplates.find(t => t.id === id);
    if (!tpl || P.status(Store.data, id) === 'locked') { location.hash = '#/shop'; return; }
    let roll = 0, result = null, tier = 1;
    const sample = () => { const st = C.state(Store.data); tier = 1 + (roll % st.maxTier); return tpl.gen(C.helpers(C.rng(C.hash(Store.profile.toLowerCase() + '|' + id + '|sample|' + roll))), tier); };
    let job = sample();
    const rec = () => P.record(Store.data, id) || {};
    const draftRec = () => P.draft(Store.data, id) || {};
    let pipe = JSON.parse(JSON.stringify(draftRec().draft || (rec().steps ? { steps: rec().steps, outs: rec().outs } : empty(job.answers.length))));
    const [m, s] = tpl.section.split('/');

    function saveDraft() {
      Store.data.shop['draft-' + id] = { draftOf: id, draft: pipe, tries: draftRec().tries || 0, t: Date.now() };
      Store.save();
    }
    function refOptions(i, cur, run) {
      const key = cur && typeof cur === 'object' ? 'c' : (cur || '');
      const opt = (v, label) => `<option value="${v}" ${v === key ? 'selected' : ''}>${esc(label)}</option>`;
      return opt('', 'choose...')
        + `<optgroup label="Contract inputs">${Object.entries(tpl.ins).map(([k, meta]) => opt('in.' + k, `${meta.label} = ${fmtIn(job.inputs[k], meta.unit)}`)).join('')}</optgroup>`
        + (i > 0 ? `<optgroup label="Earlier steps">${pipe.steps.slice(0, i).map((st, j) => opt('s' + j, `Step ${j + 1}: ${(N.byId(st.node) || {}).label || '?'}${run.errs[j] ? '' : ' = ' + fmt(run.vals[j])}`)).join('')}</optgroup>` : '')
        + opt('c', 'Constant...');
    }
    function nodeOptions(cur, ok) {
      const grp = (label, list) => { const l = list.filter(n => ok.has(n.id)); return l.length ? `<optgroup label="${label}">${l.map(n => `<option value="${n.id}" ${n.id === cur ? 'selected' : ''}>${esc(n.label)}</option>`).join('')}</optgroup>` : ''; };
      const notUnlocked = cur && !ok.has(cur);
      const prefix = notUnlocked ? `<option value="${esc(cur)}" selected disabled>${esc((N.byId(cur) || {}).label || cur)} (not unlocked)</option>` : (cur ? '' : '<option value="">choose a block...</option>');
      return prefix + grp('Basic blocks', N.PRIMITIVE) + grp('Earned blocks', N.DOMAIN) + grp('Tools', N.TOOL);
    }

    function render() {
      const chainBefore = root.querySelector('.wk-chain'), scrollLeft = chainBefore ? chainBefore.scrollLeft : 0;
      const run = P.run(pipe, job.inputs), allowed = P.allowed(Store.data), probs = P.check(pipe, tpl.ins, job.answers.length, allowed);
      const bad = (i, port) => probs.find(x => x.step === i && x.port === port);
      root.innerHTML = `<div class="shop wk"><a href="#/shop" class="muted small">&larr; Contract board</a>
        <h1>${esc(tpl.title)}</h1>
        <p class="muted">Wire blocks so the outputs answer any contract of this type. <a href="#/learn/${m}/${s}">Review the lesson</a></p>
        <section class="wk-inputs"><h3>Sample inputs · tier ${'I'.repeat(tier)}</h3>
          <dl>${Object.entries(tpl.ins).map(([k, meta]) => `<dt>${esc(meta.label)}</dt><dd>${esc(fmtIn(job.inputs[k], meta.unit))} ${meta.unit && meta.unit !== 'flag' ? `<span class="muted small">${esc(meta.unit)}</span>` : ''}</dd>`).join('')}</dl>
          <button class="btn ghost small" id="reroll">Reroll sample</button></section>
        <section class="wk-chain">${pipe.steps.map((st, i) => {
          const node = N.byId(st.node), err = run.errs[i], nodeBad = bad(i, null);
          return `<div class="wk-step ${err || nodeBad ? 'err' : ''}" data-i="${i}">
            <div class="wk-step-head"><span class="muted small">Block ${i + 1}</span>
              <div class="wk-ctl"><button data-mv="-1" aria-label="Move up">&uarr;</button><button data-mv="1" aria-label="Move down">&darr;</button><button data-del aria-label="Delete">&times;</button></div></div>
            <select class="wk-node">${nodeOptions(st.node, allowed)}</select>
            ${node ? `<span class="muted small">${esc(node.hint)}</span>` : ''}
            ${nodeBad ? `<span class="wk-msg">${esc(nodeBad.msg)}</span>` : ''}
            ${(node ? node.ins : []).map(p => {
              const cur = (st.args || {})[p.name], pb = bad(i, p.name), warn = P.pctWarning(pipe, i, p.name, tpl.ins);
              return `<label class="wk-port ${pb ? 'err' : ''}"><span>${esc(p.name)}</span>
                <select data-port="${p.name}">${refOptions(i, cur, run)}</select>
                ${cur && typeof cur === 'object' ? `<input type="number" step="any" data-const="${p.name}" value="${cur.c}">` : ''}
                ${pb ? `<em class="wk-msg">${esc(pb.msg)}</em>` : warn ? `<em class="wk-warn">${esc(warn)}</em>` : ''}</label>`;
            }).join('')}
            <div class="wk-val">${nodeBad ? '' : err ? `<span class="wk-msg">${esc(err)}</span>` : node ? '= ' + esc(fmt(run.vals[i])) : ''}</div></div>`;
        }).join('')}<button class="btn ghost wk-add" id="add">+ Add block</button></section>
        <section class="wk-outs"><h3>Answers</h3>${job.answers.map((a, k) => {
          const pb = probs.find(x => x.port === 'out' + k), cur = pipe.outs[k] || '';
          return `<label class="wk-port ${pb ? 'err' : ''}"><span>${esc(a.label)} <span class="muted small">${esc(a.unit)}</span></span>
            <select data-out="${k}"><option value="">choose a step...</option>${pipe.steps.map((st, j) => `<option value="s${j}" ${cur === 's' + j ? 'selected' : ''}>Step ${j + 1}${run.errs[j] ? '' : ' = ' + esc(fmt(run.vals[j]))}</option>`).join('')}</select></label>`;
        }).join('')}</section>
        <div class="row-btns"><button class="btn" id="test">Test on ${P.VALIDATE_N} contracts</button></div>
        <div class="wk-result">${result || ''}</div></div>`;
      wire();
      const chainAfter = root.querySelector('.wk-chain');
      if (chainAfter) chainAfter.scrollLeft = scrollLeft;
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
      const tries = (draftRec().tries || 0) + 1, st = C.state(Store.data);
      const v = P.validate(pipe, tpl, Store.profile.toLowerCase() + '|' + id + '|' + tries, st.maxTier);
      const unlocks = v.passed ? P.unlocksFor(pipe, id, Store.data) : [];
      Store.data.shop['draft-' + id] = { draftOf: id, draft: pipe, tries, t: Date.now() };
      if (v.passed) {
        const now = Date.now();
        if (ShopIdle.onShift(Store.data).some(o => o.id === id)) { const c = ShopIdle.collect(Store.data, id, now); if (c) Store.data.shop[c.key] = c.rec; }
        Store.data.shop['pipe-' + id] = { pipe: id, steps: JSON.parse(JSON.stringify(pipe.steps)), outs: JSON.parse(JSON.stringify(pipe.outs)), stepCount: pipe.steps.length, primitivesOnly: P.primitivesOnly(pipe), passed: true, tier: st.maxTier, passedAt: now, t: now };
      }
      unlocks.forEach(n => { Store.data.shop['node-' + n] = { node: n, t: Date.now() }; });
      Store.markActive();
      Store.save();
      result = `<table class="ptable wk-table"><tr><th>Contract</th>${v.rows[0].labels.map((l, i) => `<th>Answer ${i + 1}</th>`).join('')}</tr>
        ${v.rows.map((r, k) => `<tr><td>#${k + 1} <span class="tier">${'I'.repeat(r.tier)}</span></td>${r.each.map((x, i) => { const [cls, txt] = BAND(x); return `<td class="${cls}" title="${esc(r.labels[i])}">${txt}${r.off[i] == null ? '' : ` (${fmt(r.off[i])}% off)`}</td>`; }).join('')}</tr>`).join('')}</table>
        ${v.passed ? `<div class="result-head good"><b>Pipeline running</b><span>${pipe.steps.length} step${pipe.steps.length > 1 ? 's' : ''}</span></div>` : `<p class="muted">Not every answer was within 1%. <a href="#/learn/${m}/${s}">Review the lesson</a> and adjust the wiring.</p>`}`;
      render();
      if (unlocks.length) {
        const chain = root.querySelector('.wk-chain');
        void chain.offsetWidth;
        chain.classList.add('collapsing');
        const names = unlocks.map(n => N.byId(n).label).join(', ');
        setTimeout(() => { chain.classList.remove('collapsing'); chain.insertAdjacentHTML('beforebegin', `<div class="wk-earned">New block earned: <b>${esc(names)}</b></div>`); }, 700);
        Hud.toast('New block earned', names);
      }
    }
    render();
  }
  return { panel, wirePanel, route };
})();
