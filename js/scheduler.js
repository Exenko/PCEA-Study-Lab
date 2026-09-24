// Adaptive scheduling.
// Each card has a level. Answering "Knew it" X times in a row (X = settings.hitsToLevel)
// raises the level, and each level waits longer before the card is due again.
// Level 0 cards are "learning" and repeat within the session until they level up.
// A miss drops the level by one and puts the card back into the session to relearn.
const Scheduler = (() => {
  const DAY = 86400e3;
  const INTERVALS = [0, 1, 3, 7, 16, 35, 80].map(d => d * DAY);
  const MAX = INTERVALS.length - 1;
  const G = { MISSED: 0, SHAKY: 1, KNEW: 2 };

  const get = id => Store.data.cards[id] || null;
  function ensure(id) {
    if (!Store.data.cards[id]) Store.data.cards[id] = { lvl: 0, hits: 0, seen: 0, right: 0, wrong: 0, due: 0, last: 0 };
    return Store.data.cards[id];
  }
  const X = () => Math.max(1, Store.settings.hitsToLevel | 0);
  const inSession = s => s.lvl === 0 || s.relearn;

  function grade(id, g) {
    const s = ensure(id), now = Date.now();
    s.seen++; s.last = now;
    if (g === G.KNEW) {
      s.right++; s.hits++;
      if (s.relearn) { s.relearn = false; s.hits = 0; }
      else if (s.hits >= X()) { s.lvl = Math.min(MAX, s.lvl + 1); s.hits = 0; }
      s.due = now + INTERVALS[s.lvl];
    } else if (g === G.SHAKY) {
      s.hits = 0;
      s.due = now + INTERVALS[s.lvl] / 2;
    } else {
      s.wrong++; s.hits = 0;
      if (s.lvl > 0) s.relearn = true;
      s.lvl = Math.max(0, s.lvl - 1);
      s.due = now;
    }
    Store.save();
    return s;
  }

  function status(id) {
    const s = get(id);
    if (!s || !s.seen) return { key: 'new', label: 'New' };
    if (s.lvl === 0 || s.relearn) return { key: 'learning', label: 'Learning' };
    if (s.lvl <= 2) return { key: 'familiar', label: 'Familiar' };
    if (s.lvl <= 4) return { key: 'strong', label: 'Strong' };
    return { key: 'mastered', label: 'Mastered' };
  }
  const isDue = id => { const s = get(id); return !!(s && s.seen && s.due <= Date.now()); };
  const isNew = id => { const s = get(id); return !s || !s.seen; };
  const accuracy = id => { const s = get(id); return s && s.seen ? s.right / s.seen : null; };
  function isWeak(id) {
    const s = get(id);
    if (!s || !s.seen) return false;
    return s.lvl <= 1 || s.relearn || (s.seen >= 3 && s.right / s.seen < 0.7);
  }
  function nextDueText(id) {
    const s = get(id);
    if (!s || !s.seen) return 'new';
    const d = s.due - Date.now();
    if (d <= 0) return 'due now';
    if (d < DAY) return 'due later today';
    return 'due in ' + Math.round(d / DAY) + 'd';
  }

  // ---- Sessions ----
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }

  // Smart review: due cards + up to N new cards; learning cards repeat until they level up.
  function smartSession(cards, newLimit) {
    const due = cards.filter(c => isDue(c.id)).sort((a, b) => get(a.id).due - get(b.id).due);
    const fresh = shuffle(cards.filter(c => isNew(c.id))).slice(0, newLimit);
    const queue = due.concat(fresh);
    const total = queue.length;
    let done = 0;
    const tally = [0, 0, 0];
    return {
      mode: 'smart',
      get remaining() { return queue.length; },
      get progress() { return total ? done / (done + queue.length) : 1; },
      tally,
      current() { return queue[0] || null; },
      answer(g) {
        const c = queue.shift();
        tally[g]++;
        const s = grade(c.id, g);
        if (inSession(s) || g === G.MISSED) {
          const gap = g === G.MISSED ? 3 : g === G.SHAKY ? 5 : 4 + 3 * s.hits;
          queue.splice(Math.min(gap, queue.length), 0, c);
        } else done++;
      }
    };
  }

  // Practice: endless, weighted toward weak cards; strong cards still appear occasionally.
  function practiceSession(cards) {
    const recent = [];
    const tally = [0, 0, 0];
    let cur = null;
    const weight = c => {
      const s = get(c.id);
      if (!s || !s.seen) return 3;
      const acc = s.right / s.seen;
      return 0.3 + (s.relearn ? 4 : 1) * (1 + 2 * (1 - acc)) / (1 + s.lvl) + (isDue(c.id) ? 1 : 0);
    };
    function pick() {
      const avoid = Math.min(recent.length, Math.max(0, cards.length - 1), 6);
      const pool = cards.filter(c => !recent.slice(-avoid).includes(c.id));
      const ws = pool.map(weight), tot = ws.reduce((a, b) => a + b, 0);
      let r = Math.random() * tot;
      for (let i = 0; i < pool.length; i++) { r -= ws[i]; if (r <= 0) return pool[i]; }
      return pool[pool.length - 1];
    }
    cur = pick();
    return {
      mode: 'practice', tally,
      get remaining() { return Infinity; },
      get progress() { return null; },
      current() { return cur; },
      answer(g) {
        tally[g]++;
        grade(cur.id, g);
        recent.push(cur.id);
        cur = pick();
      }
    };
  }

  function browseSession(cards, shuffled) {
    const list = shuffled ? shuffle(cards.slice()) : cards.slice();
    let i = 0;
    return {
      mode: 'browse', list,
      get index() { return i; },
      current() { return list[i] || null; },
      move(d) { i = Math.max(0, Math.min(list.length - 1, i + d)); }
    };
  }

  return { G, INTERVALS, grade, status, isDue, isNew, isWeak, accuracy, nextDueText, get, smartSession, practiceSession, browseSession, shuffle };
})();
