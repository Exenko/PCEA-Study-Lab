// Quest panel, chest modal and cosmetics grid on the Progress page, and the HUD quest badge.
const Rewards = (() => {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const TIER = { small: 'Quest chest', bonus: 'Bonus chest', big: 'Weekly chest' };
  const ctx = () => ({ profile: Store.profile, catalog: Hud.catalog() });
  const badge = () => Quests.badge(Store.data, Date.now(), ctx());
  function dur(ms) {
    const m = Math.max(0, Math.floor(ms / 60000)), d = Math.floor(m / 1440), h = Math.floor(m % 1440 / 60);
    return d ? `${d}d ${h}h` : `${h}h ${m % 60}m`;
  }
  function rollText(x) {
    if (x.kind === 'cash') return '+$' + x.amount + 'K shop cash';
    if (x.kind === 'consumable') return x.tool === 'hint' ? 'Free hint' : 'Free board reroll';
    if (x.kind === 'leave') return '+1 streak leave day';
    const c = Chests.COSMETICS.find(k => k.id === x.cos);
    return c ? (c.kind === 'title' ? 'Title: ' + c.name : c.name) : 'Cosmetic';
  }
  function card(q, big) {
    const pct = Math.round(q.progress / q.target * 100);
    return `<div class="qst${q.done ? ' done' : ''}${q.claimed ? ' claimed' : ''}${big ? ' big' : ''}">
      <b>${esc(q.label)}</b>
      <div class="hud-bar"><i style="width:${pct}%"></i></div>
      <div class="qst-foot"><span class="muted small">${q.progress}/${q.target}</span>${q.claimed ? '<span class="muted small">Claimed</span>'
        : q.done ? `<button class="btn small" data-claim="${esc(q.key)}">Claim</button>` : ''}</div></div>`;
  }
  function questsHTML() {
    const now = Date.now(), c = ctx(), qs = Quests.today(Store.data, now, c), w = Quests.weekly(Store.data, now, c), b = Quests.bonus(Store.data, now, c), left = Quests.resetIn(now);
    const bonusEnd = b.claimed ? '<span class="muted small">Claimed</span>'
      : b.ready ? `<button class="btn small" data-claim="${esc(b.key)}">Claim bonus</button>`
      : `<span class="muted small">${qs.filter(q => q.claimed).length}/3 claimed</span>`;
    return `<section class="quests">
      <div class="q-head"><h2>Daily quests</h2><span class="muted small">Resets in ${dur(left.day)}</span></div>
      <div class="q-grid">${qs.map(q => card(q)).join('')}</div>
      <div class="q-bonus${b.ready && !b.claimed ? ' ready' : ''}"><span>Bonus chest: claim all three daily quests</span>${bonusEnd}</div>
      <div class="q-head"><h2>Weekly quest</h2><span class="muted small">Resets in ${dur(left.week)}</span></div>
      ${card(w, true)}
    </section>`;
  }

  function equip(id) {
    const c = Chests.COSMETICS.find(x => x.id === id);
    if (!c || !Chests.owned(Store.data).has(id)) return;
    Store.settings.cosmetics = Object.assign({}, Store.settings.cosmetics, { [c.kind]: id });
    Store.save();
  }
  function unequip(kind) {
    Store.settings.cosmetics = Object.assign({}, Store.settings.cosmetics, { [kind]: null });
    Store.save();
  }
  function cosmeticsHTML() {
    const own = Chests.owned(Store.data), eq = Chests.equipped(Store.data);
    const group = (kind, head) => `<h3>${head}</h3><div class="cos-grid">${Chests.COSMETICS.filter(c => c.kind === kind).map(c => {
      const has = own.has(c.id), on = !!(eq[kind] && eq[kind].id === c.id);
      const act = !has ? '' : on ? `<button class="btn small ghost" data-unequip="${kind}">Unequip</button>` : `<button class="btn small" data-equip="${esc(c.id)}">Equip</button>`;
      return `<div class="cos cos-${kind} ${kind}-${esc(c.value)}${has ? ' got' : ' locked'}${on ? ' on' : ''}">
        <span class="cos-swatch" aria-hidden="true"></span><b>${has ? esc(c.name) : 'Locked'}</b>${act}</div>`;
    }).join('')}</div>`;
    return `<section class="cosmetics"><h2>Cosmetics <span class="muted small">${own.size} of ${Chests.COSMETICS.length}</span></h2>
      <p class="muted small">Weekly chests always hold one. Daily chests sometimes do.</p>
      ${group('title', 'Titles')}${group('flame', 'Flames')}${group('desk', 'Desk themes')}</section>`;
  }

  function openChest(rec, onClose) {
    const m = document.createElement('div');
    m.className = 'chest-modal';
    m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-label', TIER[rec.chest] || 'Chest');
    m.innerHTML = `<div class="chest-box">
      <div class="chest chest-${esc(rec.chest)}" aria-hidden="true"><i></i></div>
      <h3>${esc(TIER[rec.chest] || 'Chest')}</h3>
      <div class="chest-rolls">${rec.rolls.map((x, i) => `<div class="chest-roll k-${esc(x.kind)}" style="animation-delay:${(0.9 + i * 0.25).toFixed(2)}s">
        <b>${esc(rollText(x))}</b>${x.kind === 'cosmetic' ? `<button class="btn small" data-equip="${esc(x.cos)}">Equip now</button>` : ''}</div>`).join('')}</div>
      <div class="row-btns"><button class="btn" data-close>Nice</button></div></div>`;
    document.body.appendChild(m);
    const close = () => { document.removeEventListener('keydown', onKey); m.remove(); if (onClose) onClose(); };
    const onKey = e => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    m.onclick = e => { if (e.target === m) close(); };
    m.querySelector('[data-close]').onclick = close;
    m.querySelectorAll('[data-equip]').forEach(b => b.onclick = () => { equip(b.dataset.equip); b.disabled = true; b.textContent = 'Equipped'; });
    m.querySelector('[data-close]').focus();
  }

  function claim(key, rerender) {
    const res = Quests.claim(Store.data, key, Date.now(), ctx());
    if (!res) { rerender(); return null; }
    Store.data.shop[res.key] = res.rec;
    Store.save();
    return res.rec;
  }
  function wire(root, rerender) {
    root.querySelectorAll('[data-claim]').forEach(b => b.onclick = () => {
      b.disabled = true;
      const rec = claim(b.dataset.claim, rerender);
      if (rec) openChest(rec, rerender);
    });
    root.querySelectorAll('.cosmetics [data-equip]').forEach(b => b.onclick = () => { equip(b.dataset.equip); rerender(); });
    root.querySelectorAll('.cosmetics [data-unequip]').forEach(b => b.onclick = () => { unequip(b.dataset.unequip); rerender(); });
  }
  return { ctx, badge, rollText, questsHTML, cosmeticsHTML, openChest, equip, unequip, wire };
})();
