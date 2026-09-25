// Idle engine: desks, outboxes and collects derived from timestamped shop records. Pure functions; callers pass now.
(function (root) {
  const C = typeof module !== 'undefined' && module.exports ? require('./core.js') : root.ShopCore;
  const HOUR = 3600000, RATE = 0.25, UPKEEP = 0.5, BASE_DESKS = 2, CAPS = [8, 12, 16, 24], CAP_COST = [250, 500, 1000];
  const UPGRADES = [
    { id: 'desk', name: 'Extra desk', desc: 'Run one more pipeline at a time.' },
    { id: 'cap', name: 'Longer offline cap', desc: 'Outboxes keep filling for longer while you are away.' },
    { id: 'analyst', name: 'Senior analyst', desc: '+25% yield from every running pipeline.' }
  ];
  const r1 = v => Math.round(v * 10) / 10;
  const recs = d => Object.values((d && d.shop) || {}).filter(r => r && typeof r === 'object');
  const shiftRec = d => { const s = ((d && d.shop) || {}).shift; return s && typeof s === 'object' ? s : null; };
  const pipeRec = (d, id) => ((d && d.shop) || {})['pipe-' + id];

  function firm(d) {
    const levels = { desk: 0, cap: 0, analyst: 0 };
    let deskT = 0;
    recs(d).forEach(r => { if (r.upg in levels) { levels[r.upg]++; if (r.upg === 'desk') deskT = Math.max(deskT, r.t || 0); } });
    levels.cap = Math.min(levels.cap, CAPS.length - 1);
    return {
      desks: BASE_DESKS + levels.desk, capHours: CAPS[levels.cap], mult: 1 + 0.25 * levels.analyst, levels, deskT,
      next: { desk: 300 * Math.pow(2, levels.desk), cap: levels.cap < CAP_COST.length ? CAP_COST[levels.cap] : null, analyst: 400 * Math.pow(2, levels.analyst) }
    };
  }
  const running = d => recs(d).filter(r => r.passed && typeof r.pipe === 'string')
    .sort((a, b) => (a.passedAt || a.t || 0) - (b.passedAt || b.t || 0) || (a.pipe < b.pipe ? -1 : a.pipe > b.pipe ? 1 : 0));

  // Explicit shift entries first (earliest since wins a desk), then free desks auto-fill in pass order, skipping pipelines turned off.
  function onShift(d) {
    const f = firm(d), run = running(d), live = new Set(run.map(r => r.pipe)), sr = shiftRec(d);
    const off = new Set((sr && sr.off) || []), map = (sr && sr.shift) || {};
    const out = Object.entries(map).filter(([id, s]) => live.has(id) && Number.isFinite(s)).map(([id, since]) => ({ id, since }))
      .sort((a, b) => a.since - b.since || (a.id < b.id ? -1 : 1)).slice(0, f.desks);
    for (const r of run) {
      if (out.length >= f.desks) break;
      if (!off.has(r.pipe) && !out.some(o => o.id === r.pipe)) out.push({ id: r.pipe, since: r.passedAt || r.t || 0 });
    }
    return out;
  }
  function rate(d, id) {
    const r = pipeRec(d, id);
    if (!r || !r.passed) return { gross: 0, upkeep: 0, net: 0 };
    const gross = RATE * (C.BASE[r.tier] || C.BASE[1]), upkeep = UPKEEP * (r.stepCount || 0);
    return { gross, upkeep, net: Math.max(0, gross * firm(d).mult - upkeep) };
  }
  const start = (d, id, since) => recs(d).filter(r => r.collect === id && Number.isFinite(r.to)).reduce((m, r) => Math.max(m, r.to), since);
  function outbox(d, id, now) {
    const o = onShift(d).find(x => x.id === id);
    if (!o) return { amount: 0, hours: 0, full: false };
    const f = firm(d), hours = Math.max(0, (now - start(d, id, o.since)) / HOUR);
    return { amount: r1(rate(d, id).net * Math.min(f.capHours, hours)), hours, full: hours >= f.capHours };
  }
  function collect(d, id, now) {
    const o = onShift(d).find(x => x.id === id);
    if (!o) return null;
    const b = outbox(d, id, now);
    if (!(b.amount > 0)) return null;
    const s = start(d, id, o.since);
    return { key: 'collect-' + id + '-' + s, rec: { collect: id, from: s, to: now, amount: b.amount, t: now } };
  }
  const collectAll = (d, now) => onShift(d).map(o => collect(d, o.id, now)).filter(Boolean);

  function setShift(d, ids, now, extraDesks = 0) {
    const f = firm(d), run = running(d), live = new Set(run.map(r => r.pipe));
    ids = ids.filter(id => live.has(id));
    if (ids.length > f.desks + extraDesks) throw new Error('Not enough desks');
    const cur = onShift(d), next = new Set(ids), sr = shiftRec(d), removed = cur.filter(o => !next.has(o.id));
    const writes = [];
    removed.forEach(o => { const c = collect(d, o.id, now); if (c) writes.push(c); });

    // Build shift from ids
    const shift = {};
    ids.forEach(id => { const o = cur.find(x => x.id === id); shift[id] = o ? o.since : now; });

    // Compute off: existing + removed, but not in new shift
    const offSet = new Set([...((sr && sr.off) || []), ...removed.map(o => o.id)]);

    // Fill free desks
    for (const r of run) {
      if (Object.keys(shift).length >= f.desks + extraDesks) break;
      if (!(r.pipe in shift) && !offSet.has(r.pipe)) shift[r.pipe] = now;
    }

    const off = [...offSet].filter(id => !(id in shift)).sort();
    writes.push({ key: 'shift', rec: { shift, off, t: now } });
    return { writes };
  }
  // A desk purchase first pins the current desks, so the new upgrade time never moves their start.
  function buyUpgrade(d, id, now) {
    const cost = firm(d).next[id];
    if (cost == null || C.state(d).cash < cost) return null;
    const writes = id === 'desk' ? setShift(d, onShift(d).map(o => o.id), now, 1).writes : [];
    writes.push({ key: 'upg-' + id + '-' + now, rec: { upg: id, cost, t: now } });
    return { writes };
  }

  const ShopIdle = { HOUR, CAPS, UPGRADES, firm, running, onShift, rate, start, outbox, collect, collectAll, setShift, buyUpgrade };
  if (typeof module !== 'undefined' && module.exports) module.exports = ShopIdle; else root.ShopIdle = ShopIdle;
})(this);
