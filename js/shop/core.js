// Estimating shop rules: seeded offers, scoring, economy and the calculator tool. Pure functions of profile data.
(function (root) {
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function helpers(r) {
    return {
      r,
      num(lo, hi, step) { const n = Math.round((hi - lo) / step); return +(lo + Math.floor(r() * (n + 1)) * step).toFixed(10); },
      pick(a) { return a[Math.floor(r() * a.length)]; }
    };
  }

  const BASE = [0, 60, 120, 250], CAMPAIGN_BASE = 300;
  const STARTER = ['m05', 'm06'];
  const TOOLS = [
    { id: 'calc', name: 'Scientific calculator', desc: 'Work out expressions with ^, ln, exp and sqrt inside a contract.', cost: 100 },
    { id: 'tables', name: 'Reference tables', desc: 'Discount factors, learning-curve exponents and z-scores.', cost: 150 },
    { id: 'opinion', name: 'Second opinion', desc: 'Before you submit, find out which answers are within 5%. One use per purchase.', cost: 40, consumable: true },
    { id: 'board', name: 'Bigger contract board', desc: 'Four contract offers instead of three.', cost: 400 }
  ];

  function answerScore(given, expected) {
    const g = parseFloat(String(given == null ? '' : given).replace(/[,\s$]/g, ''));
    if (!isFinite(g)) return -0.3;
    const e = expected === 0 ? Math.abs(g) : Math.abs(g - expected) / Math.abs(expected);
    return e <= 0.01 ? 1 : e <= 0.05 ? 0.6 : e <= 0.10 ? 0.2 : -0.3;
  }
  function grade(given, answers, base) {
    const each = answers.map((a, i) => answerScore(given[i], a.value));
    const score = Math.round(each.reduce((s, x) => s + x, 0) / each.length * 1000) / 1000;
    const rep = score >= 0.6 ? 1 : each.some(x => x < 0) ? -1 : 0;
    return { each, score, pay: Math.round(base * score * 10) / 10, rep };
  }
  function state(d) {
    const recs = Object.values((d && d.shop) || {}).filter(r => r && typeof r === 'object').sort((a, b) => (a.t || 0) - (b.t || 0));
    let cash = 0, rep = 0, completed = 0;
    const owned = {}, used = {}, campaign = [];
    for (const r of recs) {
      if (r.tpl || r.camp) {
        cash += r.pay || 0; rep = Math.max(0, rep + (r.rep || 0)); completed++;
        if (r.camp && (r.score || 0) >= 0.6 && !campaign.includes(r.camp)) campaign.push(r.camp);
      }
      if (r.tool) { cash -= r.cost || 0; owned[r.tool] = (owned[r.tool] || 0) + 1; }
      if (r.use) used[r.use] = (used[r.use] || 0) + 1;
    }
    const repLevel = Math.floor(Math.sqrt(rep));
    return {
      cash: Math.round(cash * 10) / 10, rep, repLevel, nextRep: (repLevel + 1) * (repLevel + 1), completed, owned, used, campaign,
      maxTier: repLevel >= 4 ? 3 : repLevel >= 2 ? 2 : 1,
      has: id => (owned[id] || 0) > 0,
      left: id => (owned[id] || 0) - (used[id] || 0)
    };
  }
  // A module's contracts open once 30% of its cards have been studied to an average level of 1 ("Familiar").
  function unlocked(d, catalog) {
    const out = new Set(STARTER);
    catalog.modules.forEach(m => {
      const seen = m.cards.map(id => d.cards && d.cards[id]).filter(c => c && c.seen);
      if (m.cards.length && seen.length / m.cards.length >= 0.3 && seen.reduce((s, c) => s + (c.lvl || 0), 0) / seen.length >= 1) out.add(m.id);
    });
    return out;
  }
  // Offers depend only on the profile name and how many contracts are finished, so every device shows the same board.
  function offers(profile, d, catalog, templates) {
    const st = state(d), open = unlocked(d, catalog);
    const pool = templates.filter(t => open.has(t.module));
    const out = [];
    for (let slot = 0; slot < (st.has('board') ? 4 : 3) && pool.length; slot++) {
      const seed = hash(profile.toLowerCase() + '|' + st.completed + '|' + slot);
      const r = rng(seed);
      const tpl = pool[Math.floor(r() * pool.length)];
      const tier = 1 + Math.floor(r() * st.maxTier);
      out.push({ slot, tpl, tier, seed, job: tpl.gen(helpers(rng(seed ^ 0x9E3779B9)), tier) });
    }
    return out;
  }

  // Safe expression evaluator for the calculator tool (no eval).
  const FUNCS = { ln: Math.log, log: Math.log10, exp: Math.exp, sqrt: Math.sqrt, abs: Math.abs };
  function calc(src) {
    const s = String(src).replace(/\s+/g, '').replace(/,/g, '').toLowerCase();
    let i = 0;
    const fail = () => { throw new Error('Could not read that expression'); };
    function expr() { let v = term(); while (s[i] === '+' || s[i] === '-') { const o = s[i++]; const w = term(); v = o === '+' ? v + w : v - w; } return v; }
    function term() { let v = unary(); while (s[i] === '*' || s[i] === '/') { const o = s[i++]; const w = unary(); v = o === '*' ? v * w : v / w; } return v; }
    function unary() { if (s[i] === '-') { i++; return -unary(); } if (s[i] === '+') { i++; return unary(); } return power(); }
    function power() { const b = atom(); if (s[i] === '^') { i++; return Math.pow(b, unary()); } return b; }
    function atom() {
      if (s[i] === '(') { i++; const v = expr(); if (s[i++] !== ')') fail(); return v; }
      const n = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/.exec(s.slice(i));
      if (n) { i += n[0].length; return parseFloat(n[0]); }
      const w = /^[a-z]+/.exec(s.slice(i));
      if (!w) fail();
      i += w[0].length;
      if (w[0] === 'pi') return Math.PI;
      if (w[0] === 'e') return Math.E;
      if (!FUNCS[w[0]] || s[i] !== '(') fail();
      i++; const v = expr(); if (s[i++] !== ')') fail();
      return FUNCS[w[0]](v);
    }
    if (!s) fail();
    const v = expr();
    if (i !== s.length || !isFinite(v)) fail();
    return v;
  }

  const ShopCore = { rng, hash, helpers, BASE, CAMPAIGN_BASE, STARTER, TOOLS, answerScore, grade, state, unlocked, offers, calc };
  if (typeof module !== 'undefined' && module.exports) module.exports = ShopCore; else root.ShopCore = ShopCore;
})(this);
