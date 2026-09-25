// Rewards: XP, ranks and streaks, computed from profile data so every device agrees.
(function (root) {
  const RANKS = [['Intern', 0], ['Analyst I', 500], ['Analyst II', 1500], ['Senior Estimator', 4000], ['Lead Estimator', 9000], ['Chief Estimator', 18000]];
  const CERTIFIED = 'PCEA Certified';
  const pad = n => String(n).padStart(2, '0');
  const dayKey = t => { const d = new Date(t); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  const vals = o => Object.values(o || {}).filter(v => v && typeof v === 'object');

  const cardXP = c => { const l = c.lvl || 0; return (c.right || 0) * 10 + 5 * l * (l + 1) / 2; };
  // Leave-day rolls from quest chests, as the claim times of their chests.
  const leaveGrants = d => vals(d && d.shop).filter(r => typeof r.chest === 'string' && Array.isArray(r.rolls) && Number.isFinite(r.t))
    .flatMap(r => r.rolls.filter(x => x && x.kind === 'leave').map(() => r.t)).sort((a, b) => a - b);
  function xpBreakdown(d) {
    const cards = vals(d.cards).reduce((s, c) => s + cardXP(c), 0);
    const checks = vals(d.checks).filter(c => c.done).reduce((s, c) => s + (c.first ? 20 : 10), 0);
    const sections = vals(d.sections).filter(s => s.done).length * 50;
    const shop = vals(d.shop).filter(r => r.tpl || r.camp).reduce((s, r) => s + Math.round(Math.max(0, r.pay || 0) / 2), 0);
    return { cards, checks, sections, shop, total: cards + checks + sections + shop };
  }
  function moduleLevels(d, catalog) {
    const out = {};
    ((catalog && catalog.modules) || []).forEach(m => {
      const lv = m.cards.map(id => (d.cards && d.cards[id] && d.cards[id].lvl) || 0);
      out[m.id] = lv.length ? lv.reduce((a, b) => a + b, 0) / lv.length : 0;
    });
    return out;
  }
  function rank(xp, certified) {
    let i = 0;
    while (i + 1 < RANKS.length && xp >= RANKS[i + 1][1]) i++;
    if (certified && i === RANKS.length - 1) return { name: CERTIFIED, idx: RANKS.length, min: RANKS[i][1], next: null };
    const next = RANKS[i + 1];
    return { name: RANKS[i][0], idx: i, min: RANKS[i][1], next: next ? { name: next[0], xp: next[1] } : null };
  }
  // Walk from the first study day to today. Each 7-day run earns a leave day (max 2); a missed day spends one.
  // Chest leave grants (timestamps) add a leave day at the end of their day, same cap.
  // Today is still pending, so not having studied yet today does not break the streak.
  function streak(days, now, grants) {
    const keys = Object.keys(days || {}).filter(k => /^\d{4}-\d{2}-\d{2}$/.test(k)).sort();
    const res = { current: 0, best: 0, leave: 0, activeDays: keys.length };
    if (!keys.length) return res;
    const set = new Set(keys), today = dayKey(now);
    const g = (grants || []).filter(Number.isFinite).map(dayKey).sort();
    const [y, m, dd] = keys[0].split('-').map(Number);
    let run = 0, gi = 0;
    for (const t = new Date(y, m - 1, dd, 12); ; t.setDate(t.getDate() + 1)) {
      const k = dayKey(t.getTime());
      if (k > today) break;
      if (set.has(k)) {
        res.current++; run++;
        if (run % 7 === 0 && res.leave < 2) res.leave++;
      } else if (k !== today) {
        if (res.leave > 0 && res.current > 0) { res.leave--; run = 0; }
        else { res.current = 0; res.leave = 0; run = 0; }
      }
      while (gi < g.length && g[gi] <= k) { if (res.leave < 2) res.leave++; gi++; }
      res.best = Math.max(res.best, res.current);
    }
    return res;
  }
  function compute(d, catalog, now) {
    d = d || {};
    const xp = xpBreakdown(d), lv = moduleLevels(d, catalog), ids = Object.keys(lv);
    const allStrong = ids.length > 0 && ids.every(k => lv[k] >= 3);
    const certified = allStrong && xp.total >= RANKS[RANKS.length - 1][1];
    return { xp, rank: rank(xp.total, certified), streak: streak(d.days, now || Date.now(), leaveGrants(d)), moduleLevels: lv, allStrong, certified };
  }
  const Game = { RANKS, CERTIFIED, dayKey, cardXP, xpBreakdown, moduleLevels, rank, streak, leaveGrants, compute };
  if (typeof module !== 'undefined' && module.exports) module.exports = Game; else root.Game = Game;
})(this);
