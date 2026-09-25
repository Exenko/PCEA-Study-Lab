// Daily, bonus and weekly quests derived from existing timestamps. Pure: now and ctx = { profile, catalog } are passed in.
(function (root) {
  const node = typeof module !== 'undefined' && module.exports;
  const C = node ? require('./shop/core.js') : root.ShopCore;
  const G = node ? require('./game.js') : root.Game;
  const X = node ? require('./chests.js') : root.Chests;
  const DAY = 864e5;
  const vals = o => Object.values(o || {}).filter(v => v && typeof v === 'object');
  const inRange = (t, a, b) => Number.isFinite(t) && t >= a && t < b;
  const prof = ctx => String((ctx && ctx.profile) || '').toLowerCase();
  const dayKey = G.dayKey;
  const dayStart = now => { const t = new Date(now); t.setHours(0, 0, 0, 0); return t.getTime(); };
  const dayEnd = now => { const t = new Date(dayStart(now)); t.setDate(t.getDate() + 1); return t.getTime(); };
  const weekStart = now => { const t = new Date(dayStart(now)); t.setDate(t.getDate() - (t.getDay() + 6) % 7); return t.getTime(); };
  const weekEnd = now => { const t = new Date(weekStart(now)); t.setDate(t.getDate() + 7); return t.getTime(); };
  function weekKey(now) {
    const t = new Date(dayStart(now));
    t.setDate(t.getDate() + 3 - (t.getDay() + 6) % 7);          // Thursday decides the ISO year
    const y = t.getFullYear(), jan4 = new Date(y, 0, 4);
    const w = 1 + Math.round(((t - jan4) / DAY - 3 + (jan4.getDay() + 6) % 7) / 7);
    return y + '-W' + String(w).padStart(2, '0');
  }

  // A card was overdue at day start if its due time as of day start (pdue once graded today) was before it.
  function wasOverdue(c, s) {
    if (!c || !c.seen) return false;
    const due = c.last >= s ? c.pdue : c.due;
    return Number.isFinite(due) && due < s;
  }
  function overdueModule(d, s, catalog) {
    let best = null, n = 0;
    ((catalog && catalog.modules) || []).slice().sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)).forEach(m => {
      const k = m.cards.filter(id => wasOverdue(d.cards && d.cards[id], s)).length;
      if (k > n) { best = m.id; n = k; }
    });
    return best;
  }
  // Both sides are before day start, so the answer is fixed for the whole day.
  function eventOpenAt(d, s) {
    const shop = (d && d.shop) || {};
    const done = new Set(vals(shop).filter(r => typeof r.evtdone === 'string' && Number.isFinite(r.t) && r.t < s).map(r => r.evtdone));
    return Object.entries(shop).some(([k, r]) => r && typeof r.evt === 'string' && Number.isFinite(r.at) && r.at < s && !done.has(k));
  }
  const modCards = (catalog, m) => (((catalog && catalog.modules) || []).find(x => x.id === m) || { cards: [] }).cards;
  const jobs = (d, a, b) => vals(d.shop).filter(r => r.tpl && inRange(r.t, a, b));

  const TYPES = {
    cards: { range: [15, 30], label: n => `Review ${n} cards`, count: (d, a, b) => vals(d.cards).filter(c => inRange(c.last, a, b)).length },
    overdue: { range: [5, 10], label: (n, m) => `Clear ${n} overdue cards in ${String(m).toUpperCase()}`,
      count: (d, a, b, m, catalog) => modCards(catalog, m).filter(id => { const c = d.cards && d.cards[id]; return c && inRange(c.last, a, b) && Number.isFinite(c.pdue) && c.pdue < a; }).length },
    checks: { range: [3, 6], label: n => `Answer ${n} lesson checks`, count: (d, a, b) => vals(d.checks).filter(c => inRange(c.at, a, b)).length },
    section: { range: [1, 1], label: () => 'Finish a lesson section', count: (d, a, b) => vals(d.sections).filter(s => s.done && inRange(s.at, a, b)).length },
    solve: { range: [1, 3], label: n => `Hand-solve ${n} contract${n > 1 ? 's' : ''}`, count: (d, a, b) => jobs(d, a, b).length },
    exact: { range: [1, 1], label: () => 'Hand-solve 1 contract exactly', count: (d, a, b) => jobs(d, a, b).filter(r => (r.score || 0) >= 1).length },
    event: { range: [1, 1], label: () => 'Resolve an event', count: (d, a, b) => vals(d.shop).filter(r => typeof r.evtdone === 'string' && inRange(r.t, a, b)).length }
  };
  const ORDER = ['cards', 'overdue', 'checks', 'section', 'solve', 'exact', 'event'];
  const WEEKLY = {
    days: { target: 5, label: 'Study 5 of 7 days',
      count: (d, a, b) => Object.keys(d.days || {}).filter(k => /^\d{4}-\d{2}-\d{2}$/.test(k) && inRange(new Date(k + 'T12:00:00').getTime(), a, b)).length },
    master: { target: 30, label: 'Master 30 cards', count: (d, a, b) => vals(d.cards).filter(c => (c.lvl || 0) >= 4 && inRange(c.last, a, b)).length },
    solve10: { target: 10, label: 'Hand-solve 10 contracts', count: (d, a, b) => jobs(d, a, b).length }
  };
  const WEEKLY_IDS = Object.keys(WEEKLY);

  const claimRec = (d, key) => ((d && d.shop) || {})['chest-' + key] || null;
  function draw(d, now, ctx) {
    const s = dayStart(now), r = C.rng(C.hash(prof(ctx) + '|' + dayKey(now)));
    const mod = overdueModule(d, s, ctx && ctx.catalog), evt = eventOpenAt(d, s);
    const pool = ORDER.filter(id => id !== 'event' || evt);
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    const ids = [];
    pool.forEach(id => { const x = id === 'overdue' && !mod ? 'cards' : id; if (ids.length < 3 && !ids.includes(x)) ids.push(x); });
    return ids.map((id, i) => {
      const [lo, hi] = TYPES[id].range;
      return { id, i, target: lo + Math.floor(r() * (hi - lo + 1)), module: id === 'overdue' ? mod : null };
    });
  }
  function today(d, now, ctx) {
    d = d || {};
    const a = dayStart(now), b = dayEnd(now), day = dayKey(now);
    return draw(d, now, ctx).map(q => {
      const T = TYPES[q.id], key = 'd-' + day + '-' + q.i;
      const progress = Math.min(q.target, T.count(d, a, b, q.module, ctx && ctx.catalog));
      return { id: q.id, key, label: T.label(q.target, q.module), target: q.target, progress, done: progress >= q.target, claimed: !!claimRec(d, key), module: q.module };
    });
  }
  function weekly(d, now, ctx) {
    d = d || {};
    const wk = weekKey(now), id = WEEKLY_IDS[Math.floor(C.rng(C.hash(prof(ctx) + '|' + wk))() * WEEKLY_IDS.length)], W = WEEKLY[id], key = 'w-' + wk;
    const progress = Math.min(W.target, W.count(d, weekStart(now), weekEnd(now)));
    return { id, key, label: W.label, target: W.target, progress, done: progress >= W.target, claimed: !!claimRec(d, key), module: null };
  }
  function bonus(d, now, ctx) {
    const key = 'b-' + dayKey(now), qs = today(d, now, ctx);
    return { key, ready: qs.length === 3 && qs.every(q => q.claimed), claimed: !!claimRec(d, key) };
  }
  function claim(d, key, now, ctx) {
    if (typeof key !== 'string' || claimRec(d, key)) return null;
    let q = null, tier = 'small';
    if (key.startsWith('d-')) q = today(d, now, ctx).find(x => x.key === key) || null;
    else if (key.startsWith('w-')) { const w = weekly(d, now, ctx); q = w.key === key ? w : null; tier = 'big'; }
    else if (key.startsWith('b-')) { const b = bonus(d, now, ctx); q = b.key === key && b.ready ? { done: true, module: null } : null; tier = 'bonus'; }
    if (!q || !q.done) return null;
    const ck = 'chest-' + key, leave = G.streak(d && d.days, now, G.leaveGrants(d)).leave;
    const rec = { chest: tier, quest: key, rolls: X.roll(d, ck, tier, { profile: prof(ctx), leave }), t: now };
    if (q.module) rec.module = q.module;
    return { key: ck, rec };
  }
  function badge(d, now, ctx) {
    const qs = today(d, now, ctx), b = bonus(d, now, ctx), w = weekly(d, now, ctx);
    return { done: qs.filter(q => q.done).length, total: qs.length,
      claimable: qs.some(q => q.done && !q.claimed) || (b.ready && !b.claimed) || (w.done && !w.claimed) };
  }
  const resetIn = now => ({ day: dayEnd(now) - now, week: weekEnd(now) - now });

  const Quests = { TYPES, WEEKLY, dayKey, weekKey, dayStart, dayEnd, weekStart, weekEnd, overdueModule, eventOpenAt, today, weekly, bonus, claim, badge, resetIn };
  if (node) module.exports = Quests; else root.Quests = Quests;
})(this);
