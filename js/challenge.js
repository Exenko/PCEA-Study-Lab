// Challenge blocks: parsing and goal evaluation (no DOM). Browser: Challenge; Node: require.
(function (root) {
  const NUM = /^-?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i;
  const val = s => (NUM.test(s) ? parseFloat(s) : s);

  // "k=v k2=v2" -> { kv: {k: v}, bad: [tokens without =] }
  function parseKV(str) {
    const kv = {}, bad = [];
    String(str || '').trim().split(/\s+/).filter(Boolean).forEach(t => {
      const m = t.match(/^([\w-]+)=(.+)$/);
      if (m) kv[m[1]] = val(m[2]); else bad.push(t);
    });
    return { kv, bad };
  }

  // "name k=v ... lock=a,b" -> { name, presets, lock, bad }
  function parseArgs(str) {
    const toks = String(str || '').trim().split(/\s+/).filter(Boolean);
    const name = toks.length && !toks[0].includes('=') ? toks.shift() : '';
    const { kv, bad } = parseKV(toks.join(' '));
    const lock = typeof kv.lock === 'string' ? kv.lock.split(',').filter(Boolean) : kv.lock != null ? [String(kv.lock)] : [];
    delete kv.lock;
    return { name, presets: kv, lock, bad };
  }

  function parseTol(s) {
    const t = String(s).trim();
    return t.endsWith('%') ? { v: parseFloat(t), pct: true } : { v: parseFloat(t), pct: false };
  }

  function within(x, target, tol) {
    if (!isFinite(x) || !isFinite(target)) return false;
    let lim = tol.pct ? Math.abs(target) * tol.v / 100 : tol.v;
    if (lim === 0) lim = 1e-9;
    return Math.abs(x - target) <= lim + 1e-12;
  }

  const GOAL = /^([A-Za-z]\w*)\s*(~|<=|>=|<|>)\s*(-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)\s*(?:(?:\+-|±)\s*(\d+\.?\d*%?))?$/i;
  function parseGoal(s) {
    const m = String(s).trim().match(GOAL);
    if (!m) return { error: 'bad goal: ' + s };
    if (m[2] === '~' && !m[4]) return { error: '~ needs a tolerance: ' + s };
    return { out: m[1], op: m[2], v: parseFloat(m[3]), tol: m[4] ? parseTol(m[4]) : null };
  }

  function evalGoal(g, out) {
    const x = out ? out[g.out] : undefined;
    if (typeof x !== 'number' || !isFinite(x)) return false;
    switch (g.op) {
      case '~': return within(x, g.v, g.tol);
      case '<': return x < g.v;
      case '<=': return x <= g.v;
      case '>': return x > g.v;
      case '>=': return x >= g.v;
    }
    return false;
  }
  const evalGoals = (goals, out) => goals.length > 0 && goals.every(g => evalGoal(g, out));

  function parse(lines) {
    const c = { type: null, q: [], goals: [], predict: null, opts: [], show: {}, explain: [], errors: [] };
    let mode = 'q', m;
    for (const l of lines) {
      if (mode === 'explain') { const e = l.match(/^\s*>\s?(.*)$/); c.explain.push(e ? e[1] : l); continue; }
      if ((m = l.match(/^\s*goal:\s*(.*)$/))) {
        const g = parseGoal(m[1]);
        if (g.error) c.errors.push(g.error); else c.goals.push(g);
        mode = 'body';
      } else if ((m = l.match(/^\s*predict:\s*(.*)$/))) {
        const p = m[1].trim().match(/^([A-Za-z]\w*)\s*(?:\+-|±)\s*(\d+\.?\d*%?)$/);
        if (p) c.predict = { out: p[1], tol: parseTol(p[2]) }; else c.errors.push('bad predict: ' + m[1]);
        mode = 'body';
      } else if ((m = l.match(/^\s*show:\s*(.*)$/))) {
        const kv = parseKV(m[1]);
        kv.bad.forEach(b => c.errors.push('bad show token: ' + b));
        Object.assign(c.show, kv.kv);
        mode = 'body';
      } else if ((m = l.match(/^\s*([-*])\s+(.*)$/))) {
        c.opts.push({ text: m[2], right: m[1] === '*' });
        mode = 'body';
      } else if ((m = l.match(/^\s*>\s?(.*)$/))) {
        c.explain.push(m[1]);
        mode = 'explain';
      } else if (mode === 'q') c.q.push(l.replace(/^\s*Q:\s?/, ''));
      else if (l.trim()) c.errors.push('unexpected line: ' + l.trim());
    }
    while (c.q.length && !c.q[c.q.length - 1].trim()) c.q.pop();
    const kinds = [c.goals.length && 'target', c.predict && 'predict', c.opts.length && 'choose'].filter(Boolean);
    if (kinds.length > 1) c.errors.push('mixes types: ' + kinds.join(', '));
    else if (!kinds.length && !c.errors.length) c.errors.push('needs goal:, predict: or options');
    c.type = kinds.length === 1 ? kinds[0] : null;
    if (c.type === 'target' && !Object.keys(c.show).length) c.errors.push('target needs show:');
    if (c.type === 'choose') {
      if (c.opts.filter(o => o.right).length !== 1) c.errors.push('choose needs exactly one * option');
      if (!c.opts.some(o => !o.right)) c.errors.push('choose needs a wrong (-) option');
    }
    if (!c.q.join('').trim()) c.errors.push('missing Q: prompt');
    if (!c.explain.length) c.errors.push('missing > explanation');
    return c;
  }

  // Learner input -> number. "$1,117" -> 1117; "88%" -> 0.88
  function readNum(s) {
    const t = String(s).trim();
    const x = parseFloat(t.replace(/[$,%\s]/g, ''));
    return /%$/.test(t) ? x / 100 : x;
  }
  function fmt(v) {
    if (!isFinite(v)) return '—';
    return Math.abs(v) >= 1000 ? Math.round(v).toLocaleString('en-US') : String(+v.toPrecision(4));
  }

  const Challenge = { parseKV, parseArgs, parseTol, within, parseGoal, evalGoal, evalGoals, parse, readNum, fmt };
  if (typeof module !== 'undefined' && module.exports) module.exports = Challenge; else root.Challenge = Challenge;
})(typeof window !== 'undefined' ? window : this);
