// Estimating shop screens: board, contract, campaign, tools.
const Shop = (() => {
  const C = ShopCore;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = v => (v < 0 ? '-' : '') + '$' + Math.abs(v).toLocaleString('en-US', { maximumFractionDigits: 1 }) + 'K';
  const firm = () => Store.settings.firmName || Store.profile + ' Cost Analysis';
  const modName = id => { const m = PCEA.module(id); return m ? `M${m.num} ${m.short || m.title}` : id; };
  const stars = t => '<span class="tier">' + 'I'.repeat(t) + '</span>';
  const record = (key, rec) => { Store.data.shop[key] = Object.assign(rec, { t: Date.now() }); };

  function route(root, parts) {
    if (parts[0] === 'pipe') return ShopWorkshop.route(root, parts[1]);
    if (parts[0] === 'job') return job(root, +parts[1]);
    if (parts[0] === 'campaign') return campaign(root, parts[1]);
    board(root);
  }

  function header(st) {
    const repPct = st.repLevel === 0 && st.rep === 0 ? 0 : Math.min(100, (st.rep - st.repLevel * st.repLevel) / (st.nextRep - st.repLevel * st.repLevel) * 100);
    return `<div class="shop-head">
      <div><div class="rw-label">Your firm</div><h1 class="firm" title="Click to rename">${esc(firm())}</h1></div>
      <div class="shop-kpis">
        <div class="kpi"><b class="${st.cash < 0 ? 'neg' : ''}">${money(st.cash)}</b><span>cash</span></div>
        <div class="kpi"><b>Level ${st.repLevel}</b><span>reputation · ${st.rep}/${st.nextRep} to next</span><div class="hud-bar"><i style="width:${repPct}%"></i></div></div>
        <div class="kpi"><b>${st.completed}</b><span>jobs finished · tier ${'I'.repeat(st.maxTier)} open</span></div>
      </div></div>`;
  }

  function board(root) {
    const cat = Hud.catalog(), st = C.state(Store.data), open = C.unlocked(Store.data, cat);
    const offers = C.offers(Store.profile, Store.data, cat, ShopTemplates);
    const locked = [...new Set(ShopTemplates.map(t => t.module))].filter(m => !open.has(m)).sort();
    root.innerHTML = `<div class="shop">${header(st)}
      <h2>Contract board</h2>
      <p class="muted">New offers appear after each job. Pay depends on accuracy: within 1% earns full pay, within 5% earns 60%, within 10% earns 20%, and anything further off costs you.</p>
      <div class="offers">${offers.map(o => `<a class="offer" href="#/shop/job/${o.slot}">
        <div class="offer-top"><span class="muted small">${esc(modName(o.tpl.module))}</span>${stars(o.tier)}</div>
        <b>${esc(o.tpl.title)}</b><span class="muted small">Up to ${money(C.BASE[o.tier])} · ${o.job.answers.length} answer${o.job.answers.length > 1 ? 's' : ''}</span></a>`).join('')}</div>
      ${locked.length ? `<p class="muted small">Locked contract types: ${locked.map(m => `<a href="#/cards?m=${m}">${esc(modName(m))}</a>`).join(', ')}. Study about a third of a module's flashcards to Familiar to open its contracts.</p>` : ''}
      ${ShopWorkshop.panel(Store.data, open)}
      <h2>Campaign</h2>
      <div class="camps">${ShopCampaign.map(c => {
        const done = st.campaign.includes(c.id), avail = st.repLevel >= c.rep;
        return avail ? `<a class="camp ${done ? 'done' : ''}" href="#/shop/campaign/${c.id}"><b>${esc(c.title)}</b><span class="muted small">${done ? 'Completed · replay for practice' : c.steps.length + ' steps · up to ' + money(C.CAMPAIGN_BASE)}</span></a>`
          : `<div class="camp locked"><b>${esc(c.title)}</b><span class="muted small">Needs reputation level ${c.rep}</span></div>`;
      }).join('')}</div>
      <h2>Tool shop</h2>
      <div class="tools">${C.TOOLS.map(t => {
        const owned = st.has(t.id) && !t.consumable;
        return `<div class="tool"><b>${esc(t.name)}</b><span class="muted small">${esc(t.desc)}</span>
          <div class="tool-foot">${owned ? '<span class="muted small">Owned</span>' : `<button class="btn small" data-buy="${t.id}" ${st.cash < t.cost ? 'disabled' : ''}>Buy ${money(t.cost)}</button>`}${t.consumable ? `<span class="muted small">${st.left(t.id)} left</span>` : ''}</div></div>`;
      }).join('')}</div>
      ${st.has('tables') ? tablesHTML() : ''}</div>`;
    root.querySelector('.firm').onclick = () => {
      const n = prompt('Firm name', firm());
      if (n != null) { Store.settings.firmName = n.trim().slice(0, 60) || null; Store.save(); board(root); }
    };
    root.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => {
      const t = C.TOOLS.find(x => x.id === b.dataset.buy);
      if (C.state(Store.data).cash < t.cost) return;
      record('buy-' + t.id + '-' + Date.now(), { tool: t.id, cost: t.cost });
      Store.save();
      Hud.toast('Bought ' + t.name, t.desc);
      board(root);
    });
  }

  function toolsHTML(st) {
    return (st.has('calc') ? `<div class="calc"><input placeholder="Calculator, e.g. 1200*25^(ln(0.85)/ln(2))" aria-label="Calculator"><output></output></div>` : '')
      + (st.has('tables') ? `<details class="ref"><summary>Reference tables</summary>${tablesHTML()}</details>` : '');
  }
  function wireCalc(root) {
    const inp = root.querySelector('.calc input');
    if (!inp) return;
    const out = root.querySelector('.calc output');
    inp.oninput = () => { try { out.textContent = '= ' + +C.calc(inp.value).toPrecision(10); } catch (e) { out.textContent = inp.value ? '…' : ''; } };
  }
  function tablesHTML() {
    const rates = [0.03, 0.05, 0.07, 0.1], yrs = [1, 2, 3, 4, 5, 10];
    const slopes = [0.75, 0.8, 0.85, 0.9, 0.95];
    return `<div class="ref-tables">
      <table class="ptable"><tr><th>Year</th>${rates.map(r => `<th>${r * 100}%</th>`).join('')}</tr>${yrs.map(n => `<tr><td>${n}</td>${rates.map(r => `<td>${(1 / Math.pow(1 + r, n)).toFixed(4)}</td>`).join('')}</tr>`).join('')}</table>
      <table class="ptable"><tr><th>Slope</th><th>b</th><th>b+1</th></tr>${slopes.map(s => { const b = Math.log(s) / Math.log(2); return `<tr><td>${s * 100}%</td><td>${b.toFixed(4)}</td><td>${(b + 1).toFixed(4)}</td></tr>`; }).join('')}</table>
      <table class="ptable"><tr><th>Confidence</th><th>z</th></tr>${[[50, 0], [70, 0.5244], [80, 0.8416], [90, 1.2816], [95, 1.6449]].map(([p, z]) => `<tr><td>${p}%</td><td>${z}</td></tr>`).join('')}</table></div>`;
  }

  function answerInputs(answers) {
    return `<div class="answers">${answers.map((a, i) => `<label class="ans"><span>${esc(a.label)}</span><input inputmode="decimal" data-i="${i}" autocomplete="off"><em>${esc(a.unit)}</em><i class="ans-fb"></i></label>`).join('')}</div>`;
  }
  const BAND = x => x === 1 ? ['good', 'Within 1%'] : x === 0.6 ? ['mid', 'Within 5%'] : x === 0.2 ? ['mid', 'Within 10%'] : ['bad', 'Off by more than 10%'];
  const fmtAns = v => (+v.toPrecision(6)).toLocaleString('en-US', { maximumFractionDigits: 4 });

  function job(root, slot) {
    const cat = Hud.catalog(), st = C.state(Store.data);
    const o = C.offers(Store.profile, Store.data, cat, ShopTemplates).find(x => x.slot === slot);
    if (!o) { location.hash = '#/shop'; return; }
    const [m, s] = o.tpl.section.split('/');
    root.innerHTML = `<div class="shop job"><a href="#/shop" class="muted small">&larr; Contract board</a>
      <div class="offer-top"><span class="muted">${esc(modName(o.tpl.module))}</span>${stars(o.tier)}</div>
      <h1>${esc(o.tpl.title)}</h1>
      <div class="brief">${Render.md(o.job.brief)}</div>
      ${answerInputs(o.job.answers)}
      ${toolsHTML(st)}
      <div class="row-btns"><button class="btn" id="submit">Submit estimate</button>
        ${st.left('opinion') > 0 ? `<button class="btn ghost" id="opinion">Second opinion (${st.left('opinion')} left)</button>` : ''}</div>
      <div class="result" hidden></div></div>`;
    wireCalc(root);
    const inputs = [...root.querySelectorAll('.ans input')];
    inputs[0].focus();
    const op = root.querySelector('#opinion');
    if (op) op.onclick = () => {
      record('use-opinion-' + Date.now(), { use: 'opinion' });
      Store.save();
      inputs.forEach((inp, i) => { const ok = C.answerScore(inp.value, o.job.answers[i].value) >= 0.6; inp.parentElement.querySelector('.ans-fb').textContent = ok ? 'Looks right' : 'Recheck this'; inp.parentElement.className = 'ans ' + (ok ? 'good' : 'bad'); });
      op.remove();
    };
    root.querySelector('#submit').onclick = () => {
      if (inputs.some(i => !i.value.trim()) && !confirm('Some answers are blank. Submit anyway?')) return;
      const given = inputs.map(i => i.value.trim());
      const g = C.grade(given, o.job.answers, C.BASE[o.tier]);
      record('c-' + st.completed + '-' + o.seed, { tpl: o.tpl.id, tier: o.tier, seed: o.seed, given, score: g.score, pay: g.pay, rep: g.rep });
      Store.markActive();
      Store.save();
      showResult(root, o.job, g, `#/learn/${m}/${s}`);
    };
  }

  function showResult(root, jb, g, lessonHref) {
    root.querySelectorAll('.ans input').forEach((inp, i) => {
      const [cls, txt] = BAND(g.each[i]);
      inp.disabled = true;
      inp.parentElement.className = 'ans ' + cls;
      inp.parentElement.querySelector('.ans-fb').textContent = `${txt} · answer ${fmtAns(jb.answers[i].value)}`;
    });
    root.querySelectorAll('#submit, #opinion').forEach(b => b.remove());
    const res = root.querySelector('.result');
    res.hidden = false;
    res.innerHTML = `<div class="result-head ${g.pay >= 0 ? 'good' : 'bad'}"><b>${g.pay >= 0 ? 'Paid' : 'Loss'} ${money(g.pay)}</b><span>Reputation ${g.rep > 0 ? '+' : ''}${g.rep}</span></div>
      <h3>Show work</h3><div class="explain">${Render.md(jb.explain)}</div>
      <div class="row-btns"><a class="btn" href="#/shop">Back to the board</a><a class="btn ghost" href="${lessonHref}">Review the lesson</a></div>`;
  }

  function campaign(root, id) {
    const c = ShopCampaign.find(x => x.id === id), st = C.state(Store.data);
    if (!c || st.repLevel < c.rep) { location.hash = '#/shop'; return; }
    const alreadyDone = st.campaign.includes(c.id);
    const all = c.steps.flatMap(s => s.answers);
    let step = 0; const given = [];
    root.innerHTML = `<div class="shop job"><a href="#/shop" class="muted small">&larr; Contract board</a>
      <h1>${esc(c.title)}</h1><div class="brief">${Render.md(c.story)}</div>${toolsHTML(st)}<div class="steps"></div></div>`;
    wireCalc(root);
    const host = root.querySelector('.steps');
    function showStep() {
      const s = c.steps[step], box = document.createElement('div');
      box.className = 'camp-step';
      box.innerHTML = `<h3>Step ${step + 1} of ${c.steps.length}</h3><div class="brief">${Render.md(s.prompt)}</div>${answerInputs(s.answers)}<div class="row-btns"><button class="btn">Submit step</button></div><div class="explain" hidden></div>`;
      host.appendChild(box);
      const inputs = [...box.querySelectorAll('input')];
      inputs[0].focus();
      box.querySelector('.btn').onclick = () => {
        inputs.forEach((inp, i) => {
          const x = C.answerScore(inp.value, s.answers[i].value), [cls, txt] = BAND(x);
          given.push(inp.value.trim()); inp.disabled = true; inp.parentElement.className = 'ans ' + cls;
          inp.parentElement.querySelector('.ans-fb').textContent = `${txt} · answer ${fmtAns(s.answers[i].value)}`;
        });
        box.querySelector('.row-btns').remove();
        const ex = box.querySelector('.explain'); ex.hidden = false; ex.innerHTML = Render.md(s.explain);
        step++;
        if (step < c.steps.length) showStep(); else finish();
      };
    }
    function finish() {
      const g = C.grade(given, all, C.CAMPAIGN_BASE);
      const rep = alreadyDone ? 0 : (g.score >= 0.6 ? 2 : 0);
      const pay = alreadyDone ? 0 : g.pay;
      record('k-' + c.id + '-' + Date.now(), alreadyDone ? { camp: c.id, given, score: g.score, pay: 0, rep: 0, practice: true } : { camp: c.id, given, score: g.score, pay: g.pay, rep });
      Store.markActive();
      Store.save();
      const res = document.createElement('div');
      res.className = 'result';
      res.innerHTML = `<div class="result-head ${g.score >= 0.6 ? 'good' : 'bad'}"><b>${g.score >= 0.6 ? 'Campaign complete' : 'Not good enough yet'}: ${money(pay)}</b><span>Reputation +${rep}</span></div>
        <p class="muted">${alreadyDone ? 'Practice run: no pay for a completed campaign.' : (g.score >= 0.6 ? 'The customer signed.' : 'Score at least 60% to complete this campaign. You can try again.')}</p>
        <div class="row-btns"><a class="btn" href="#/shop">Back to the board</a></div>`;
      host.appendChild(res);
    }
    showStep();
  }
  return { route };
})();
