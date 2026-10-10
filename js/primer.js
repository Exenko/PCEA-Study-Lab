// Lesson primers and :::sort / :::order blocks: parsing, seeded shuffle, scoring, recap text (no DOM).
// Browser: Primer; Node: require.
(function (root) {
  const EXPLAIN = /^\s*>\s?(.*)$/;

  function finishQ(c) {
    while (c.q.length && !c.q[c.q.length - 1].trim()) c.q.pop();
    if (!c.q.join('').trim()) c.errors.push('missing Q: prompt');
    if (!c.explain.length) c.errors.push('missing > explanation');
  }

  // Q: prompt / optional "buckets: A | B" / "- item = Bucket" lines / "> explanation"
  function parseSort(lines) {
    const c = { q: [], buckets: [], items: [], explain: [], errors: [] };
    let mode = 'q', declared = null, m;
    for (const l of lines) {
      if (mode === 'explain') { const e = l.match(EXPLAIN); c.explain.push(e ? e[1] : l); continue; }
      if ((m = l.match(/^\s*buckets:\s*(.*)$/))) { declared = m[1].split('|').map(s => s.trim()).filter(Boolean); mode = 'body'; }
      else if ((m = l.match(/^\s*-\s+(.*)$/))) {
        const i = m[1].lastIndexOf(' = ');
        if (i < 0) c.errors.push('item needs "= bucket": ' + m[1].trim());
        else c.items.push({ text: m[1].slice(0, i).trim(), bucket: m[1].slice(i + 3).trim() });
        mode = 'body';
      } else if ((m = l.match(EXPLAIN))) { c.explain.push(m[1]); mode = 'explain'; }
      else if (mode === 'q') c.q.push(l.replace(/^\s*Q:\s?/, ''));
      else if (l.trim()) c.errors.push('unexpected line: ' + l.trim());
    }
    c.buckets = declared || [...new Set(c.items.map(it => it.bucket))];
    if (declared) c.items.forEach(it => { if (!declared.includes(it.bucket)) c.errors.push(`unknown bucket ${it.bucket} for ${it.text}`); });
    if (c.buckets.length < 2) c.errors.push('sort needs at least 2 buckets');
    if (c.items.length < 2) c.errors.push('sort needs at least 2 items');
    finishQ(c);
    return c;
  }

  // Q: prompt / "1. item" lines in the correct order / "> explanation"
  function parseOrder(lines) {
    const c = { q: [], items: [], explain: [], errors: [] };
    let mode = 'q', m;
    for (const l of lines) {
      if (mode === 'explain') { const e = l.match(EXPLAIN); c.explain.push(e ? e[1] : l); continue; }
      if ((m = l.match(/^\s*(\d+)\.\s+(.*)$/))) {
        if (+m[1] !== c.items.length + 1) c.errors.push('order items must be numbered 1..n, got ' + m[1]);
        c.items.push(m[2].trim());
        mode = 'body';
      } else if ((m = l.match(EXPLAIN))) { c.explain.push(m[1]); mode = 'explain'; }
      else if (mode === 'q') c.q.push(l.replace(/^\s*Q:\s?/, ''));
      else if (l.trim()) c.errors.push('unexpected line: ' + l.trim());
    }
    if (c.items.length < 3) c.errors.push('order needs at least 3 items');
    finishQ(c);
    return c;
  }

  function hash(s) {
    let h = 2166136261;
    for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  // mulberry32
  function rng(seed) {
    let a = hash(seed);
    return () => {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(n, seed) {
    const p = [...Array(n).keys()], r = rng(seed);
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
    return p;
  }
  function orderStart(n, seed) {
    const p = shuffle(n, seed);
    return n > 1 && p.every((v, i) => v === i) ? p.slice(1).concat(p[0]) : p;
  }

  const count = (arr, ok) => ({ right: arr.filter(ok).length, total: arr.length });
  const scoreSort = (spec, placed) => count(spec.items, (it, i) => placed[i] === it.bucket);
  const scoreOrder = (spec, seq) => count(spec.items, (_, i) => seq[i] === i);

  function fits(type, spec, a) {
    if (type === 'sort') return Array.isArray(a) && a.length === spec.items.length && a.every(b => spec.buckets.includes(b));
    if (type === 'order') return Array.isArray(a) && a.length === spec.items.length && [...a].sort((x, y) => x - y).every((v, i) => v === i);
    if (type === 'check') return Number.isInteger(a) && a >= 0 && a < spec.opts.length;
    return false;
  }

  function recap(type, spec, a) {
    if (!fits(type, spec, a)) return '';
    if (type === 'sort') {
      const s = scoreSort(spec, a);
      if (s.right === s.total) return `You sorted all ${s.total} correctly.`;
      const miss = spec.items.map((it, i) => ({ it, got: a[i] })).filter(x => x.got !== x.it.bucket).slice(0, 2)
        .map(x => `you put *${x.it.text}* under ${x.got}, but it belongs under ${x.it.bucket}`);
      return `You sorted ${s.right} of ${s.total} correctly: ${miss.join('; ')}.`;
    }
    if (type === 'order') {
      const s = scoreOrder(spec, a);
      if (s.right === s.total) return `You had all ${s.total} in the right order.`;
      const i = a.findIndex((v, k) => v !== k);
      return `You had ${s.right} of ${s.total} in the right place. Step ${i + 1} is actually *${spec.items[i]}*.`;
    }
    const pick = spec.opts[a], right = spec.opts.find(o => o.right);
    return pick.right ? `You picked *${pick.text}*, which is correct.` : `You picked *${pick.text}*; the answer is *${right.text}*.`;
  }

  // Primer answers: data.primers[secKey]. "Try again" writes {cleared} (not a delete) so it syncs.
  function save(data, key, type, answer, score) {
    data.primers = data.primers || {};
    return (data.primers[key] = { type, answer, score, at: Date.now() });
  }
  function clear(data, key) {
    data.primers = data.primers || {};
    data.primers[key] = { cleared: true, at: Date.now() };
  }
  function answered(data, key) {
    const e = data.primers && data.primers[key];
    return e && !e.cleared ? e : null;
  }

  const Primer = { parseSort, parseOrder, shuffle, orderStart, scoreSort, scoreOrder, fits, recap, save, clear, answered };
  if (typeof module !== 'undefined' && module.exports) module.exports = Primer; else root.Primer = Primer;
})(typeof window !== 'undefined' ? window : this);
