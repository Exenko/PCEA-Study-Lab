// Shop events: audits and market shocks that stall running pipelines until the learner re-studies or re-fixes them. Pure; sched is injected.
(function (root) {
  const node = typeof module !== 'undefined' && module.exports;
  const C = node ? require('./core.js') : root.ShopCore;
  const I = node ? require('./idle.js') : root.ShopIdle;
  const P = node ? require('./pipeline.js') : root.ShopPipe;
  const T = node ? require('./templates.js') : root.ShopTemplates;
  const HOUR = I.HOUR, COOLDOWN = 20 * HOUR, IMMUNE = 24 * HOUR, P_MAX = 0.6, P_HOUR = 0.04, MAX_CARDS = 10, SHOCK_N = 3;
  const r1 = v => Math.round(v * 10) / 10;
  const shop = d => (d && d.shop) || {};
  const tplOf = id => T.find(t => t.id === id) || null;
  const overdue = (sched, module) => ((sched.cards && sched.cards(module)) || []).filter(c => sched.isDue(c)).sort();
  const withWrites = (d, ws) => ({ shop: Object.assign({}, shop(d), ...ws.map(w => ({ [w.key]: w.rec }))) });

  const open = (d, id) => I.openEvent(d, id);
  const stalledAt = (d, id) => I.stalledAt(d, id);
  const chance = (hours, nOverdue) => Math.min(P_MAX, P_HOUR * hours * (nOverdue >= 3 ? 2 : 1));

  function roll(d, id, collectKey, window, now, sched) {
    const tpl = tplOf(id), pipe = shop(d)['pipe-' + id];
    if (!tpl || !pipe || !pipe.passed || open(d, id)) return null;
    if (Object.values(shop(d)).some(r => r && typeof r.evt === 'string' && Number.isFinite(r.at) && now - r.at < COOLDOWN)) return null;
    if (now - (pipe.passedAt || pipe.t || 0) < IMMUNE) return null;
    const due = overdue(sched, tpl.module), hours = Math.max(0, (window.to - window.from) / HOUR);
    const seed = C.hash(String(sched.profile || '').toLowerCase() + '|' + collectKey);
    if (C.rng(seed)() >= chance(hours, due.length)) return null;
    const at = window.to, key = 'evt-' + id + '-' + at;
    if (due.length) return { key, rec: { evt: id, kind: 'audit', module: tpl.module, at, cards: due.slice(0, MAX_CARDS), seed, t: at } };
    if (typeof tpl.shock === 'function') return { key, rec: { evt: id, kind: 'shock', module: tpl.module, at, seed, t: at } };
    return null;
  }
  function collect(d, id, now, sched) {
    const c = I.collect(d, id, now);
    if (!c) return [];
    const e = roll(d, id, c.key, { from: c.rec.from, to: c.rec.to }, now, sched);
    return e ? [c, e] : [c];
  }
  // Each desk sees the writes of the desks before it, so the global cooldown holds inside one sweep.
  function collectAll(d, now, sched) {
    let cur = d;
    const writes = [];
    I.onShift(d).forEach(o => { const ws = collect(cur, o.id, now, sched); writes.push(...ws); cur = withWrites(cur, ws); });
    return { writes, events: writes.filter(w => typeof w.rec.evt === 'string') };
  }

  function auditProgress(d, evt, sched) {
    const cards = (evt && evt.cards) || [];
    const done = cards.filter(id => { const s = sched.get(id); return !!(s && Number.isFinite(s.last) && s.last >= evt.at); }).length;
    return { done, total: cards.length };
  }
  const bonus = (d, id) => r1(2 * I.rate(d, id).net);
  // Clears every open event on the pipeline; only the earliest pays the bonus.
  function resolveAll(d, id, now) {
    const all = I.openEvents(d, id), b = bonus(d, id);
    const writes = all.map((o, k) => ({ key: 'evtdone-' + id + '-' + o.rec.at, rec: { evtdone: o.key, bonus: k === 0 ? b : 0, t: now } }));
    return { key: writes[0].key, rec: writes[0].rec, writes };
  }
  function resolveAudit(d, id, now, sched) {
    const o = open(d, id);
    if (!o || o.rec.kind !== 'audit') return null;
    const p = auditProgress(d, o.rec, sched);
    return p.done < p.total ? null : resolveAll(d, id, now);
  }
  function resolveShock(d, id, now) {
    const o = open(d, id);
    return o && o.rec.kind === 'shock' ? resolveAll(d, id, now) : null;
  }

  const ShopEvents = { COOLDOWN, IMMUNE, SHOCK_N, chance, open, stalledAt, roll, collect, collectAll, auditProgress, bonus, resolveAudit, resolveShock };
  if (node) module.exports = ShopEvents; else root.ShopEvents = ShopEvents;
})(this);
