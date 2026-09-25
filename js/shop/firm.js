// Firm panel: desks with ticking outboxes, collect-all and firm upgrades.
(function (root) {
  const C = typeof module !== 'undefined' && module.exports ? require('./core.js') : root.ShopCore;
  const I = typeof module !== 'undefined' && module.exports ? require('./idle.js') : root.ShopIdle;
  const T = typeof module !== 'undefined' && module.exports ? require('./templates.js') : root.ShopTemplates;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = v => '$' + (+v).toLocaleString('en-US', { maximumFractionDigits: 1 }) + 'K';
  const title = id => (T.find(t => t.id === id) || { title: id }).title;
  const pct = (hours, cap) => Math.min(100, hours / cap * 100);
  let timer = null;

  function panel(d, now) {
    if (!I.running(d).length) return '';
    const f = I.firm(d), shift = I.onShift(d);
    let total = 0;
    const cards = shift.map(o => {
      const r = I.rate(d, o.id), b = I.outbox(d, o.id, now);
      total += b.amount;
      return `<div class="idle-desk" data-desk="${esc(o.id)}"><b>${esc(title(o.id))}</b>
        <span class="muted small">${money(r.net)}/h net</span>
        <div class="idle-out"><output>${money(b.amount)}</output><span class="wk-chip full" ${b.full ? '' : 'hidden'}>Full</span></div>
        <div class="hud-bar"><i style="width:${pct(b.hours, f.capHours)}%"></i></div></div>`;
    });
    for (let i = shift.length; i < f.desks; i++) cards.push('<div class="idle-desk empty"><span class="muted small">Empty desk: automate a contract in the Workshop</span></div>');
    return `<h2>Your desks</h2>
      <p class="muted">Running pipelines fill their outbox for up to ${f.capHours} hours. Collect to bank the cash.</p>
      <div class="idle-desks">${cards.join('')}</div>
      <div class="row-btns"><button class="btn" id="collect" ${total > 0 ? '' : 'disabled'}>Collect all</button></div>`;
  }

  function upgradesHTML(d, st) {
    if (!I.running(d).length) return '';
    const f = I.firm(d);
    const eff = {
      desk: `${f.desks} desks, next ${f.desks + 1}.`,
      cap: f.next.cap == null ? `${f.capHours} hours (max).` : `${f.capHours} hours, next ${I.CAPS[f.levels.cap + 1]}.`,
      analyst: `x${f.mult}, next x${f.mult + 0.25}.`
    };
    return `<h3>Firm upgrades</h3><div class="tools">${I.UPGRADES.map(u => {
      const cost = f.next[u.id];
      return `<div class="tool"><b>${esc(u.name)}</b><span class="muted small">${esc(u.desc)} ${esc(eff[u.id])}</span>
        <div class="tool-foot">${cost == null ? '<span class="muted small">Maxed</span>' : `<button class="btn small" data-upg="${u.id}" ${st.cash < cost ? 'disabled' : ''}>Buy ${money(cost)}</button>`}</div></div>`;
    }).join('')}</div>`;
  }

  function apply(writes) { writes.forEach(w => { Store.data.shop[w.key] = w.rec; }); Store.save(); }

  function wire(root, rerender) {
    clearInterval(timer);
    const btn = root.querySelector('#collect');
    if (btn) btn.onclick = () => {
      const ws = I.collectAll(Store.data, Date.now());
      if (!ws.length) return;
      apply(ws);
      Hud.toast('+' + money(Math.round(ws.reduce((s, w) => s + w.rec.amount, 0) * 10) / 10) + ' banked', ws.length + ' desk' + (ws.length > 1 ? 's' : ''));
      rerender();
    };
    root.querySelectorAll('[data-upg]').forEach(b => b.onclick = () => {
      const res = I.buyUpgrade(Store.data, b.dataset.upg, Date.now());
      if (!res) return;
      apply(res.writes);
      Hud.toast('Firm upgrade', I.UPGRADES.find(u => u.id === b.dataset.upg).name);
      rerender();
    });
    if (!root.querySelector('[data-desk]')) return;
    timer = setInterval(() => {
      const desks = [...root.querySelectorAll('[data-desk]')];
      if (!desks.length || !document.body.contains(desks[0])) { clearInterval(timer); return; }
      const now = Date.now(), cap = I.firm(Store.data).capHours;
      let total = 0;
      desks.forEach(el => {
        const b = I.outbox(Store.data, el.dataset.desk, now);
        total += b.amount;
        el.querySelector('output').textContent = money(b.amount);
        el.querySelector('.hud-bar i').style.width = pct(b.hours, cap) + '%';
        el.querySelector('.full').hidden = !b.full;
      });
      if (btn) btn.disabled = total <= 0;
    }, 1000);
  }
  const ShopFirm = { panel, upgradesHTML, wire };
  if (typeof module !== 'undefined' && module.exports) module.exports = ShopFirm; else root.ShopFirm = ShopFirm;
})(this);
