// Quest panel on the Progress page and the HUD quest badge.
const Rewards = (() => {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
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
      if (!rec) return;
      Hud.toast('Chest opened', rec.rolls.map(rollText).join(' · '));
      rerender();
    });
  }
  return { ctx, badge, rollText, questsHTML, wire };
})();
