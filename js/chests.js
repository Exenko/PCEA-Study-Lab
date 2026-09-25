// Quest chests: seeded reward rolls fixed at claim time, plus the effects chest records grant. Pure functions of profile data.
(function (root) {
  const node = typeof module !== 'undefined' && module.exports;
  const C = node ? require('./shop/core.js') : root.ShopCore;
  const G = node ? require('./game.js') : root.Game;
  const TABLE = { small: { rolls: 1, cash: [20, 60] }, bonus: { rolls: 2, cash: [20, 60] }, big: { rolls: 3, cash: [40, 120], cosmetic: true } };
  const ODDS = [['cash', 0.60], ['consumable', 0.85], ['leave', 0.90], ['cosmetic', 1]];
  const CONSUMABLES = ['hint', 'reroll'];
  const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const TITLES = ['Bean Counter', 'Learning Curve Surfer', 'EVM Whisperer', 'Monte Carlo Kid', 'Basis-of-Estimate Bard', 'Escalation Artist', 'Risk Wrangler', 'Cost Sage'];
  const COSMETICS = [
    ...TITLES.map(n => ({ id: 'title-' + slug(n), kind: 'title', name: n, value: slug(n) })),
    ...['blue', 'green', 'purple', 'gold'].map(v => ({ id: 'flame-' + v, kind: 'flame', name: cap(v) + ' flame', value: v })),
    ...['blueprint', 'ledger', 'terminal', 'brass'].map(v => ({ id: 'desk-' + v, kind: 'desk', name: cap(v) + ' desk', value: v }))
  ];

  const chests = d => Object.values((d && d.shop) || {}).filter(r => r && typeof r.chest === 'string' && Array.isArray(r.rolls));
  const rolls = d => chests(d).flatMap(r => r.rolls.filter(x => x && typeof x === 'object'));
  const cash = d => Math.round(rolls(d).filter(x => x.kind === 'cash').reduce((s, x) => s + (+x.amount || 0), 0) * 10) / 10;
  function toolGrants(d) {
    const o = {};
    rolls(d).forEach(x => { if (x.kind === 'consumable' && CONSUMABLES.includes(x.tool)) o[x.tool] = (o[x.tool] || 0) + 1; });
    return o;
  }
  const owned = d => new Set(rolls(d).filter(x => x.kind === 'cosmetic' && COSMETICS.some(c => c.id === x.cos)).map(x => x.cos));
  const leaveGrants = d => G.leaveGrants(d);
  function equipped(d) {
    const eq = (d && d.settings && d.settings.cosmetics) || {}, own = owned(d), out = { title: null, flame: null, desk: null };
    Object.keys(out).forEach(k => { const c = COSMETICS.find(x => x.kind === k && x.id === eq[k]); if (c && own.has(c.id)) out[k] = c; });
    return out;
  }

  // opts.leave = effective streak leave days at claim time; leave rolls past 2 become cash.
  function roll(d, chestKey, tier, opts) {
    const spec = TABLE[tier];
    if (!spec) return [];
    const o = opts || {}, profile = String(o.profile || '').toLowerCase(), have = owned(d);
    let leave = o.leave || 0;
    const cashRoll = r => ({ kind: 'cash', amount: spec.cash[0] + Math.floor(r() * (spec.cash[1] - spec.cash[0] + 1)) });
    const cosRoll = r => {
      const locked = COSMETICS.filter(c => !have.has(c.id));
      if (!locked.length) return null;
      const c = locked[Math.floor(r() * locked.length)];
      have.add(c.id);
      return { kind: 'cosmetic', cos: c.id };
    };
    const out = [];
    for (let i = 0; i < spec.rolls; i++) {
      const r = C.rng(C.hash(profile + '|' + chestKey + '|' + i)), p = r();
      const kind = ODDS.find(([, hi]) => p < hi)[0];
      let x = null;
      if (kind === 'consumable') x = { kind, tool: CONSUMABLES[Math.floor(r() * CONSUMABLES.length)] };
      else if (kind === 'leave' && leave < 2) { leave++; x = { kind: 'leave' }; }
      else if (kind === 'cosmetic') x = cosRoll(r);
      out.push(x || cashRoll(r));
    }
    if (spec.cosmetic && !out.some(x => x.kind === 'cosmetic')) {
      const x = cosRoll(C.rng(C.hash(profile + '|' + chestKey + '|cos')));
      if (x) out[out.length - 1] = x;
    }
    return out;
  }

  const Chests = { TABLE, COSMETICS, CONSUMABLES, roll, owned, cash, toolGrants, leaveGrants, equipped };
  if (node) module.exports = Chests; else root.Chests = Chests;
})(this);
