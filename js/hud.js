// Topbar rank/XP/streak, toasts and the rewards block on the Progress page.
const Hud = (() => {
  const box = document.getElementById('hud');
  const toasts = document.getElementById('toasts');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const FLAME = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M8 1c.6 2.6 4 4.4 4 8.2A4 4 0 0 1 4 9.3c0-1.7.9-2.9 1.9-3.8-.1 1.4.5 2.5 1.5 2.9C7.1 6.2 7.4 3.4 8 1z"/></svg>';
  const fmt = n => Math.round(n).toLocaleString('en-US');
  let last = null, cat = null, busy = false;

  function catalog() {
    return cat || (cat = { modules: PCEA.modules.map(m => ({ id: m.id, cards: m.cardList.map(c => c.id), sections: m.sections.map(s => m.id + '/' + s.id) })) });
  }
  function current() {
    const g = Game.compute(Store.data, catalog());
    g.earned = Achievements.earned(Store.data, g, catalog());
    return g;
  }
  function pct(g) {
    if (!g.rank.next) return 100;
    return Math.max(0, Math.min(100, (g.xp.total - g.rank.min) / (g.rank.next.xp - g.rank.min) * 100));
  }
  function paint(g) {
    box.innerHTML = `<a href="#/progress" class="hud-rank" title="${fmt(g.xp.total)} XP${g.rank.next ? ' · ' + fmt(g.rank.next.xp - g.xp.total) + ' to ' + esc(g.rank.next.name) : ''}">
        <b>${esc(g.rank.name)}</b><span class="hud-bar"><i style="width:${pct(g)}%"></i></span></a>
      <span class="hud-streak ${g.streak.current ? 'on' : ''}" title="${g.streak.current}-day streak · best ${g.streak.best} · ${g.streak.leave} leave day${g.streak.leave === 1 ? '' : 's'}">${FLAME}${g.streak.current}</span>`;
  }
  function toast(title, body) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<b>${esc(title)}</b>${body ? `<span>${esc(body)}</span>` : ''}`;
    toasts.appendChild(t);
    setTimeout(() => t.classList.add('out'), 3800);
    setTimeout(() => t.remove(), 4300);
  }
  function float(text) {
    const f = document.createElement('div');
    f.className = 'xp-float'; f.textContent = text;
    box.appendChild(f);
    setTimeout(() => f.remove(), 1300);
  }
  function update(silent) {
    if (busy) return;
    if (!Store.profile) { box.hidden = true; last = null; return; }
    busy = true;
    try {
      const g = current();
      box.hidden = false; paint(g);
      const seen = Store.settings.seenAch;
      if (!Array.isArray(seen)) {
        // First run for this profile: remember what is already earned without announcing it.
        Store.settings.seenAch = g.earned.map(a => a.id); Store.save();
      } else {
        const fresh = g.earned.filter(a => !seen.includes(a.id));
        if (fresh.length) {
          Store.settings.seenAch = seen.concat(fresh.map(a => a.id)); Store.save();
          if (!silent) fresh.forEach(a => toast('Achievement: ' + a.name, a.desc));
        }
      }
      if (last && !silent) {
        const dx = g.xp.total - last.xp.total;
        if (dx > 0) float('+' + fmt(dx) + ' XP');
        if (g.rank.idx > last.rank.idx) toast('Promoted to ' + g.rank.name, 'Keep going.');
      }
      last = g;
    } finally { busy = false; }
  }
  function reset() { last = null; update(true); }

  function progressHTML() {
    const g = current(), x = g.xp;
    const got = new Set(g.earned.map(a => a.id));
    return `<div class="rewards">
      <div class="rw-card"><div class="rw-label">Rank</div><div class="rw-big">${esc(g.rank.name)}</div>
        <div class="hud-bar wide"><i style="width:${pct(g)}%"></i></div>
        <div class="muted small">${fmt(x.total)} XP${g.rank.next ? ` · ${fmt(g.rank.next.xp - x.total)} to ${esc(g.rank.next.name)}` : g.certified ? '' : ' · Certified needs every module at Strong'}</div>
        <div class="muted small">Cards ${fmt(x.cards)} · Questions ${fmt(x.checks)} · Sections ${fmt(x.sections)} · Shop ${fmt(x.shop)}</div></div>
      <div class="rw-card"><div class="rw-label">Streak</div><div class="rw-big">${FLAME} ${g.streak.current} day${g.streak.current === 1 ? '' : 's'}</div>
        <div class="muted small">Best ${g.streak.best} · ${g.streak.activeDays} study days · ${g.streak.leave}/2 leave days</div>
        <div class="muted small">Every 7 days in a row earns a leave day that covers one missed day.</div></div>
    </div>
    <h2>Achievements <span class="muted small">${got.size} of ${Achievements.LIST.length}</span></h2>
    <div class="ach-grid">${Achievements.LIST.map(a => `<div class="ach ${got.has(a.id) ? 'got' : ''}"><b>${esc(a.name)}</b><span>${esc(a.desc)}</span></div>`).join('')}</div>`;
  }
  return { update, reset, catalog, progressHTML, toast };
})();
