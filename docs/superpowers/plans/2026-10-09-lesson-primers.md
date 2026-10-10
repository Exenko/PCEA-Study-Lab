# Lesson Primers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every M01 section opens with a short interactive "Before you read" primer (sort, order, or multiple-choice guess) whose answer is recapped later in the section.

**Architecture:** A `:::primer:::` marker turns a section's first step into a primer. Pure logic (parsing `:::sort`/`:::order`, seeded shuffle, scoring, recap text, primer storage helpers) lives in a new DOM-free `js/primer.js`; `js/render.js` builds the DOM, handles commit-once behavior, and substitutes `{{primer}}` recaps. Answers live in a new synced `Store.data.primers` part, never in `checks`.

**Tech Stack:** Plain browser JS (no build), UMD module pattern from `js/challenge.js`, marked + KaTeX already vendored, Node test runner `tests/run.js` (`npm test`), content validator `tools/validate.js` (`npm run validate`).

**Spec:** `docs/superpowers/specs/2026-10-09-lesson-primers-design.md`

## Global Constraints

- No new dependencies. New JS files use the UMD pattern of `js/challenge.js` (`module.exports` in Node, global in browser).
- Primer answers are written only to `Store.data.primers[secKey]`; never to `Store.data.checks`; primer commits never call `Store.markActive()`.
- A primer has exactly one committable block: a multiple-choice `:::check`, a `:::sort`, or a `:::order`. No `:::challenge` in primers.
- Primer blocks must not consume the section's existing check/challenge counters, so existing check IDs (`m01/<section>#<n>`, `#c<n>`) do not shift.
- Every primer answer must be traceable to that section's own body text in `content/m01.js`. No new facts.
- `:::primer:::` only as the first line of a section's first step; `{{primer}}` only in sections that have a primer.
- Shell is Windows Git Bash; console output ASCII-safe. Run tests with `npm test`, content checks with `npm run validate`.
- Baseline before starting: `npm test` -> `165 passed, 0 failed`; `npm run validate` -> `OK`.

## Review Focus

1. Content edited after a learner answered (stored answer no longer matches items/buckets/options) -> recap renders nothing and the primer reopens unanswered instead of crashing. Pinned by `Primer.fits` tests in Task 1 and the restore guards in Task 4.
2. Adding a primer must not shift existing check IDs, or previously answered M01 checks would reappear unanswered. Pinned by the manual "previously answered check stays answered" step in Task 4 and Task 5.
3. Touch devices: HTML5 drag-and-drop does not fire on touch, so tap-item-then-tap-bucket and the up/down buttons must fully work alone. Pinned by the phone-width manual step in Task 4.
4. "Try again" on one device, then sync with a device holding the old answer: the newer `{cleared: true}` record must win. Pinned by the merge test in Task 2.
5. Full-page mode: primer is interactive but not gating, and committing fills `{{primer}}` recaps in later (already visible) steps immediately. Pinned by the full-page manual step in Task 4.

---

### Task 0: Precondition — isolate the user's uncommitted work

The working tree has uncommitted user changes in `content/m01.js`..`content/m16.js`, `js/cards.js`, `js/registry.js`. Tasks 4 and 5 edit `content/m01.js`.

- [ ] **Step 1: Check status**

Run: `git status --short`
If `content/m01.js` still shows ` M`, STOP and ask the user to commit or stash their changes first. Do not commit the user's pre-existing hunks as part of this feature.

---

### Task 1: Primer core logic (`js/primer.js`)

**Files:**
- Create: `js/primer.js`
- Test: `tests/primer.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces (global `Primer` in browser, `require('../js/primer.js')` in Node):
  - `parseSort(lines: string[]) -> { q: string[], buckets: string[], items: {text, bucket}[], explain: string[], errors: string[] }`
  - `parseOrder(lines: string[]) -> { q: string[], items: string[] /* correct order */, explain: string[], errors: string[] }`
  - `shuffle(n: number, seed: string) -> number[]` (deterministic permutation of 0..n-1)
  - `orderStart(n: number, seed: string) -> number[]` (like shuffle, never the identity when n > 1)
  - `scoreSort(spec, placed: string[]) -> { right, total }` (placed[i] = bucket chosen for spec.items[i])
  - `scoreOrder(spec, seq: number[]) -> { right, total }` (seq = item indices in learner's order)
  - `fits(type: 'sort'|'order'|'check', spec, answer) -> boolean`
  - `recap(type, spec, answer) -> string` (inline markdown; `''` when answer does not fit)
  - `save(data, key, type, answer, score) -> entry`, `clear(data, key)`, `answered(data, key) -> entry | null`

- [ ] **Step 1: Write the failing tests**

Create `tests/primer.test.js`:

```js
const assert = require('assert');
const P = require('../js/primer.js');

const SORT = ['Q: Who?', 'buckets: Inside | Outside', '- Program Office = Inside', '- CAPE = Outside', '- GAO = Outside', '> Because.'];
const ORDER = ['Q: Order these.', '1. First', '2. Second', '3. Third', '4. Fourth', '> Because.'];

module.exports = [
  ['parseSort reads prompt, buckets, items, explanation', () => {
    const c = P.parseSort(SORT);
    assert.deepStrictEqual(c.errors, []);
    assert.deepStrictEqual(c.q, ['Who?']);
    assert.deepStrictEqual(c.buckets, ['Inside', 'Outside']);
    assert.deepStrictEqual(c.items[0], { text: 'Program Office', bucket: 'Inside' });
    assert.deepStrictEqual(c.explain, ['Because.']);
  }],
  ['parseSort infers buckets in first-appearance order and splits on the last " = "', () => {
    const c = P.parseSort(['Q: x', '- a = b = B', '- c = A', '- d = B', '> e']);
    assert.deepStrictEqual(c.errors, []);
    assert.deepStrictEqual(c.buckets, ['B', 'A']);
    assert.deepStrictEqual(c.items[0], { text: 'a = b', bucket: 'B' });
  }],
  ['parseSort errors', () => {
    const errs = l => P.parseSort(l).errors.join(' | ');
    assert.match(errs(['Q: x', 'buckets: A | B', '- a = A', '- b = C', '> e']), /unknown bucket C/);
    assert.match(errs(['Q: x', '- a = A', '- b = A', '> e']), /2 buckets/);
    assert.match(errs(['Q: x', 'buckets: A | B', '- a = A', '> e']), /2 items/);
    assert.match(errs(['Q: x', '- a', '- b = B', '- c = A', '> e']), /needs "= bucket"/);
    assert.match(errs(['- a = A', '- b = B', '> e']), /Q:/);
    assert.match(errs(['Q: x', '- a = A', '- b = B']), /explanation/);
    assert.match(errs(['Q: x', '- a = A', 'stray', '- b = B', '> e']), /unexpected/);
  }],
  ['parseOrder reads items in correct order', () => {
    const c = P.parseOrder(ORDER);
    assert.deepStrictEqual(c.errors, []);
    assert.deepStrictEqual(c.q, ['Order these.']);
    assert.deepStrictEqual(c.items, ['First', 'Second', 'Third', 'Fourth']);
    assert.deepStrictEqual(c.explain, ['Because.']);
  }],
  ['parseOrder errors', () => {
    const errs = l => P.parseOrder(l).errors.join(' | ');
    assert.match(errs(['Q: x', '1. a', '3. b', '4. c', '> e']), /numbered 1\.\.n/);
    assert.match(errs(['Q: x', '1. a', '2. b', '> e']), /at least 3/);
    assert.match(errs(['1. a', '2. b', '3. c', '> e']), /Q:/);
    assert.match(errs(['Q: x', '1. a', '2. b', '3. c']), /explanation/);
    assert.match(errs(['Q: x', '1. a', 'stray', '2. b', '3. c', '> e']), /unexpected/);
  }],
  ['shuffle is a deterministic permutation per seed', () => {
    const a = P.shuffle(7, 'm01/process#o0');
    assert.deepStrictEqual(a, P.shuffle(7, 'm01/process#o0'));
    assert.deepStrictEqual([...a].sort((x, y) => x - y), [0, 1, 2, 3, 4, 5, 6]);
    const seen = new Set(['a', 'b', 'c', 'd', 'e'].map(s => P.shuffle(7, s).join()));
    assert.ok(seen.size > 1, 'different seeds give different orders');
  }],
  ['orderStart is a permutation that is never already in order', () => {
    for (let i = 0; i < 300; i++) for (const n of [2, 3, 4, 7]) {
      const p = P.orderStart(n, 'seed' + i);
      assert.ok(p.some((v, k) => v !== k), `n=${n} seed${i}`);
      assert.deepStrictEqual([...p].sort((x, y) => x - y), [...Array(n).keys()]);
    }
  }],
  ['scoreSort and scoreOrder count matching positions', () => {
    const s = P.parseSort(SORT), o = P.parseOrder(ORDER);
    assert.deepStrictEqual(P.scoreSort(s, ['Inside', 'Outside', 'Outside']), { right: 3, total: 3 });
    assert.deepStrictEqual(P.scoreSort(s, ['Outside', 'Outside', 'Inside']), { right: 1, total: 3 });
    assert.deepStrictEqual(P.scoreOrder(o, [0, 1, 2, 3]), { right: 4, total: 4 });
    assert.deepStrictEqual(P.scoreOrder(o, [1, 0, 2, 3]), { right: 2, total: 4 });
  }],
  ['recap text: sort', () => {
    const s = P.parseSort(SORT);
    assert.strictEqual(P.recap('sort', s, ['Inside', 'Outside', 'Outside']), 'You sorted all 3 correctly.');
    assert.strictEqual(P.recap('sort', s, ['Outside', 'Inside', 'Inside']),
      'You sorted 0 of 3 correctly: you put *Program Office* under Outside, but it belongs under Inside; you put *CAPE* under Inside, but it belongs under Outside.');
  }],
  ['recap text: order', () => {
    const o = P.parseOrder(ORDER);
    assert.strictEqual(P.recap('order', o, [0, 1, 2, 3]), 'You had all 4 in the right order.');
    assert.strictEqual(P.recap('order', o, [0, 2, 1, 3]), 'You had 2 of 4 in the right place. Step 2 is actually *Second*.');
  }],
  ['recap text: check', () => {
    const spec = { opts: [{ text: 'Yes', right: false }, { text: 'No', right: true }] };
    assert.strictEqual(P.recap('check', spec, 1), 'You picked *No*, which is correct.');
    assert.strictEqual(P.recap('check', spec, 0), 'You picked *Yes*; the answer is *No*.');
  }],
  ['recap is empty when the stored answer no longer fits the block', () => {
    const s = P.parseSort(SORT), o = P.parseOrder(ORDER);
    assert.strictEqual(P.recap('sort', s, ['Inside', 'Outside']), '');
    assert.strictEqual(P.recap('sort', s, ['Inside', 'Outside', 'Gone']), '');
    assert.strictEqual(P.recap('sort', s, undefined), '');
    assert.strictEqual(P.recap('order', o, [0, 1, 2]), '');
    assert.strictEqual(P.recap('order', o, [0, 0, 1, 2]), '');
    assert.strictEqual(P.recap('check', { opts: [{ text: 'a', right: true }] }, 3), '');
    assert.strictEqual(P.recap('nope', s, []), '');
  }],
  ['save, answered and clear use data.primers and never touch checks', () => {
    const data = { checks: { 'm01/orgs#0': { done: true } } };
    const before = JSON.stringify(data.checks);
    P.save(data, 'm01/orgs', 'sort', ['A', 'B'], '1/2');
    assert.strictEqual(JSON.stringify(data.checks), before);
    const e = P.answered(data, 'm01/orgs');
    assert.deepStrictEqual([e.type, e.answer, e.score], ['sort', ['A', 'B'], '1/2']);
    assert.ok(e.at > 0);
    P.clear(data, 'm01/orgs');
    assert.strictEqual(P.answered(data, 'm01/orgs'), null);
    assert.ok(data.primers['m01/orgs'].cleared);
    assert.strictEqual(P.answered({}, 'x'), null);
  }]
];
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test primer`
Expected: FAIL — `Cannot find module '../js/primer.js'`.

- [ ] **Step 3: Implement `js/primer.js`**

```js
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test primer`
Expected: all `primer.test.js` tests PASS. Then `npm test` -> `178 passed, 0 failed`.

- [ ] **Step 5: Commit**

```bash
git add js/primer.js tests/primer.test.js
git commit -m "feat: primer core logic for sort/order blocks and recaps"
```

---

### Task 2: `primers` storage part (sync + reset)

**Files:**
- Modify: `js/storage.js` (`PARTS` line 8, `defaults()` line 19)
- Modify: `server.js` (`PARTS` line 12)
- Modify: `js/progress.js` (lesson reset handler, line 64)
- Test: `tests/merge.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces: `Store.data.primers` (object, default `{}`), merged per key newest-`mod`-wins on client and server; `Store.save()` stamps `mod` on changed primer records automatically (it already does this for every name in `PARTS`).

- [ ] **Step 1: Write the failing tests**

In `tests/merge.test.js`, change the two part lists so the randomized client/server agreement test covers `primers`:

```js
  for (const p of ['cards', 'checks', 'sections', 'days', 'shop', 'primers']) {
```
```js
const partsOnly = d => JSON.stringify(['cards', 'checks', 'sections', 'days', 'shop', 'primers', 'resets'].map(p => d[p]));
```

Append these tests to the exported array (before the closing `];`):

```js
  ['store has a primers part', () => {
    assert.deepStrictEqual(Store.normalize({}).primers, {});
  }],
  ['a newer cleared primer beats an older answer on both sides', () => {
    const a = { primers: { 'm01/orgs': { type: 'sort', answer: ['A'], score: '1/1', mod: 5 } } };
    const b = { primers: { 'm01/orgs': { cleared: true, mod: 9 } } };
    for (const m of [Store.merge(a, b), Store.merge(b, a), server.merge(a, b), server.merge(b, a)]) {
      assert.strictEqual(m.primers['m01/orgs'].cleared, true);
    }
  }]
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test merge`
Expected: FAIL — `store has a primers part` (undefined vs `{}`) and the cleared test (`Cannot read properties of undefined`).

- [ ] **Step 3: Implement**

`js/storage.js` line 8:
```js
  const PARTS = ['cards', 'checks', 'sections', 'days', 'shop', 'primers'], SINGLES = ['settings', 'deck', 'lastSection', 'seenAch'];
```
`js/storage.js` in `defaults()`:
```js
      v: 2, cards: {}, checks: {}, sections: {}, days: {}, shop: {}, primers: {},
```
`server.js` line 12:
```js
const PARTS = ['cards', 'checks', 'sections', 'days', 'shop', 'primers'], SINGLES = ['settings', 'deck', 'lastSection', 'seenAch'];
```
`js/progress.js` line 64, reset primers along with lesson progress:
```js
    root.querySelector('#rstL').onclick = () => { if (confirm('Reset lesson progress (completed sections and answered questions)?')) { Store.reset('sections'); Store.reset('checks'); Store.reset('primers'); App.render(); } };
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: `180 passed, 0 failed`.

- [ ] **Step 5: Commit**

```bash
git add js/storage.js server.js js/progress.js tests/merge.test.js
git commit -m "feat: synced primers storage part, cleared by lesson reset"
```

---

### Task 3: Validator rules for primers, sort, order

**Files:**
- Modify: `tools/validate.js`
- Test: `tests/validate.test.js`

**Interfaces:**
- Consumes: `Primer.parseSort`, `Primer.parseOrder` from Task 1.
- Produces: validator errors (exact substrings tested below) and a `N primers` count appended to each module's summary line.

- [ ] **Step 1: Write the failing tests**

In `tests/validate.test.js`, add after the `GOOD` constant:

```js
const PRIMER = [':::primer:::', 'Framing.', '', ':::sort', 'Q: Which?', '- a = X', '- b = Y', '> why', ':::', '', '+++', '', '{{primer}}', '', 'Text.'].join('\n');
```

Append to the exported array:

```js
  ['valid primer with sort and recap passes and is counted', () => {
    const out = validate(PRIMER);
    assert.match(out, /1 primers/);
    assert.match(out, /\nOK/);
  }],
  ['valid order and multiple-choice primer pass', () => {
    const order = [':::primer:::', ':::order', 'Q: Order', '1. a', '2. b', '3. c', '> why', ':::'].join('\n');
    assert.match(validate(order), /\nOK/);
    const check = [':::primer:::', ':::check', 'Q: Guess', '* a', '- b', '> why', ':::'].join('\n');
    assert.match(validate(check), /\nOK/);
  }],
  ['primer, sort and order errors are reported', () => {
    const bad = [
      ['Intro.', '', '+++', '', ':::primer:::', ':::sort', 'Q: x', '- a = X', '- b = Y', '> e', ':::', ':::primer::: must be the first line of the first step'],
      ['Intro.', ':::primer:::', ':::sort', 'Q: x', '- a = X', '- b = Y', '> e', ':::', ':::primer::: must be the first line of the first step'],
      [':::primer:::', 'Only words.', 'primer needs exactly one check, sort or order'],
      [':::primer:::', ':::sort', 'Q: x', '- a = X', '- b = Y', '> e', ':::', ':::order', 'Q: y', '1. a', '2. b', '3. c', '> e', ':::', 'primer needs exactly one check, sort or order'],
      [':::primer:::', ':::challenge lc-explorer', 'Q: x', '* a', '- b', '> e', ':::', 'primer cannot contain :::challenge'],
      [':::primer:::', ':::check', 'Q: x', '= 5', '> e', ':::', 'primer check must be multiple choice'],
      ['{{primer}} without one.', '{{primer}} used without a primer'],
      [':::sort', 'Q: x', 'buckets: X | Y', '- a = X', '- b = Z', '> e', ':::', 'unknown bucket Z'],
      [':::order', 'Q: x', '1. a', '3. b', '4. c', '> e', ':::', 'numbered 1..n']
    ];
    bad.forEach(lines => {
      const want = lines.pop();
      assert.ok(validate(lines.join('\n')).includes(want), 'expected: ' + want);
    });
  }]
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test validate`
Expected: FAIL — `single-line :::primer::: only allowed for widgets` / `unknown directive sort` instead of OK.

- [ ] **Step 3: Implement in `tools/validate.js`**

After `const Challenge = require('../js/challenge.js');` add:
```js
const Primer = require('../js/primer.js');
```
Change `CALLOUTS`:
```js
const CALLOUTS = ['tip', 'warn', 'key', 'example', 'formula', 'note', 'check', 'widget', 'challenge', 'sort', 'order'];
```
Before the `for (const rel of ...)` loop, next to `let challengeCount = 0;`, add:
```js
let primerCount = 0;
```
Inside the loop, next to `challengeCount = 0;`, add:
```js
  primerCount = 0;
```
In the directive-structure loop, replace the close branch:
```js
        if (/^:::\s*$/.test(line)) { if (open === 'challenge') checkChallenge(`${where} line ${block.i}`, block); open = null; }
```
with:
```js
        if (/^:::\s*$/.test(line)) {
          const at = `${where} line ${block.i}`;
          if (open === 'challenge') checkChallenge(at, block);
          if (open === 'sort') Primer.parseSort(block.lines).errors.forEach(e => err(at, e));
          if (open === 'order') Primer.parseOrder(block.lines).errors.forEach(e => err(at, e));
          open = null;
        }
```
and replace the single-line branch:
```js
      if (one) {
        if (one[1] !== 'widget') err(where, `single-line :::${one[1]}::: only allowed for widgets`);
        else checkWidgetArgs(where, one[2]);
```
with:
```js
      if (one) {
        if (one[1] === 'primer') { /* placement checked below */ }
        else if (one[1] !== 'widget') err(where, `single-line :::${one[1]}::: only allowed for widgets and primer`);
        else checkWidgetArgs(where, one[2]);
```
After the `if (open) err(where, \`unclosed :::${open}\`);` line, add:
```js
    // primers: marker first in step 0, exactly one committable block, recaps only with a primer
    const stepTexts = s.body.split(/^\+\+\+\s*$/m);
    const hasPrimer = /^\s*:::primer:::[ \t]*$/m.test(stepTexts[0]) && /^\s*:::primer:::/.test(stepTexts[0]);
    stepTexts.forEach((t, i) => {
      const n = (t.match(/^:::primer:::[ \t]*$/mg) || []).length;
      if (n > (i === 0 && hasPrimer ? 1 : 0)) err(where, ':::primer::: must be the first line of the first step');
    });
    if (hasPrimer) {
      primerCount++;
      const t = stepTexts[0];
      if (/^:::challenge\b/m.test(t)) err(where, 'primer cannot contain :::challenge (use check, sort or order)');
      const blocks = t.match(/^:::(check|sort|order)\b.*$/mg) || [];
      if (blocks.length !== 1) err(where, 'primer needs exactly one check, sort or order');
      const chk = t.split(/^:::check.*$/m)[1];
      if (chk !== undefined && !/^\s*\*\s+/m.test(chk.split(/^:::\s*$/m)[0])) err(where, 'primer check must be multiple choice');
    }
    if (!hasPrimer && /\{\{primer\}\}/.test(s.body)) err(where, '{{primer}} used without a primer');
```
Change the summary line to append the primer count:
```js
  console.log(`${rel}: ${m.sections.length} sections, ${checks} checks, ${challengeCount} challenges, ${primerCount} primers, ${cards.length} cards, ${new Set(cards.map(c => c.tag)).size} card topics, source=${m.source}`);
```

- [ ] **Step 4: Run tests and content validation**

Run: `npm test`
Expected: `183 passed, 0 failed`.
Run: `npm run validate`
Expected: `OK`, every module line shows `0 primers`.

- [ ] **Step 5: Commit**

```bash
git add tools/validate.js tests/validate.test.js
git commit -m "feat: validate primer placement, sort and order blocks"
```

---

### Task 4: Render primers, sort, order + first primer (M01 orgs)

**Files:**
- Modify: `js/render.js` (header comment; `buildStep` line 303; `section` line 313; new functions before `buildWidget`)
- Modify: `css/styles.css` (append)
- Modify: `index.html` (script tag before `js/render.js`, line 67)
- Modify: `content/m01.js` (`orgs` section body)

**Interfaces:**
- Consumes: `Primer.*` from Task 1; `Store.data.primers` from Task 2; `App.render()` (js/app.js); existing `record`, `parseCheck`, `md`, `inline`, `el` in render.js.
- Produces: rendered `.step.primer` with `.primer-label`; blocks `.check.sort` / `.check.order` (gate Continue through existing `pending()` in js/learn.js, which counts `.check` without `.done`); `.primer-recap` spans filled with recap HTML. `js/learn.js` needs no changes.

DOM is not unit-testable in this repo (no jsdom); verification is `npm test` + `npm run validate` + the browser steps below.

- [ ] **Step 1: Add the script tag**

In `index.html`, directly above `<script src="js/render.js"></script>`:
```html
<script src="js/primer.js"></script>
```

- [ ] **Step 2: Update the render.js header comment**

Add after the `:::challenge` line in the comment block at the top of `js/render.js`:
```js
//   :::sort [id] ... :::      sort items into buckets (see js/primer.js)
//   :::order [id] ... :::     put items in sequence (see js/primer.js)
//   :::primer:::              first line of a section's first step: that step is a "Before you read" primer
//   {{primer}}                in later prose: recap of the learner's primer answer
```

- [ ] **Step 3: Add primer commit helpers, primer check, sort and order builders**

Insert in `js/render.js` directly above `function buildWidget(d) {`:

```js
  // Primer blocks commit once (no retry, no wrong-answer stats); answers go to Store.data.primers, never checks.
  function settle(box, exp, ctx) {
    box.classList.add('done');
    exp.hidden = false;
    const again = el('button', 'btn small ghost primer-again', 'Try again');
    again.onclick = () => { Primer.clear(Store.data, ctx.key); Store.save(); App.render(); };
    box.appendChild(again);
  }
  function commit(box, exp, ctx, type, answer, score) {
    Primer.save(Store.data, ctx.key, type, answer, score);
    Store.save();
    settle(box, exp, ctx);
    ctx.onPrimer();
    ctx.onChange && ctx.onChange();
  }

  function buildPrimerCheck(d, ctx) {
    const c = parseCheck(d.body);
    ctx.sec.primer = { type: 'check', spec: c };
    const box = el('div', 'check');
    box.appendChild(el('div', 'check-label', 'Your guess'));
    box.appendChild(el('div', 'check-q', md(c.q.join('\n'))));
    const exp = el('div', 'check-explain', md(c.explain.join('\n')));
    exp.hidden = true;
    const list = el('div', 'check-opts');
    const show = pick => list.querySelectorAll('.opt').forEach((b, i) => {
      b.disabled = true;
      if (c.opts[i].right) b.classList.add('right'); else if (i === pick) b.classList.add('wrong');
    });
    c.opts.forEach((o, i) => {
      const b = el('button', 'opt', inline(o.text));
      b.onclick = () => { show(i); commit(box, exp, ctx, 'check', i, o.right ? '1/1' : '0/1'); };
      list.appendChild(b);
    });
    box.append(list, exp);
    const saved = Primer.answered(Store.data, ctx.key);
    if (saved && saved.type === 'check' && Primer.fits('check', c, saved.answer)) { show(saved.answer); settle(box, exp, ctx); }
    return box;
  }

  function blockError(box, label, errors) {
    box.classList.add('done');
    box.appendChild(el('div', 'check-fb bad', label + ' error: ' + errors.join('; ')));
    return box;
  }

  // :::sort — tap an item then a bucket (or drag it), then commit. Graded outside primers: retry until right.
  function buildSort(d, ctx, idx) {
    const c = Primer.parseSort(d.body);
    const id = ctx.key + '#s' + (d.args || idx);
    const box = el('div', 'check sort');
    if (c.errors.length) return blockError(box, 'Sort', c.errors);
    if (ctx.primer) ctx.sec.primer = { type: 'sort', spec: c }; else box.dataset.checkId = id;
    box.appendChild(el('div', 'check-label', ctx.primer ? 'Your guess' : 'Sort it'));
    box.appendChild(el('div', 'check-q', md(c.q.join('\n'))));
    const pool = el('div', 'sort-pool');
    const grid = el('div', 'sort-buckets');
    const zones = c.buckets.map(name => {
      const z = el('div', 'sort-bucket');
      z.dataset.bucket = name;
      z.append(el('div', 'sort-bucket-name', inline(name)), el('div', 'sort-drop'));
      grid.appendChild(z);
      return z;
    });
    const go = el('button', 'btn small', 'Commit');
    go.disabled = true;
    const fb = el('div', 'check-fb');
    fb.setAttribute('role', 'status');
    const exp = el('div', 'check-explain', md(c.explain.join('\n')));
    exp.hidden = true;
    const placed = c.items.map(() => null);
    let picked = null, locked = false, attempts = 0;
    const chips = c.items.map((it, i) => {
      const b = el('button', 'sort-item', inline(it.text));
      b.draggable = true;
      b.ondragstart = e => e.dataTransfer.setData('text/plain', String(i));
      b.onclick = () => {
        if (locked) return;
        picked = picked === i ? null : i;
        chips.forEach((x, k) => x.classList.toggle('on', k === picked));
      };
      return b;
    });
    Primer.shuffle(c.items.length, id).forEach(i => pool.appendChild(chips[i]));
    const place = (i, bucket) => {
      placed[i] = bucket;
      (bucket == null ? pool : zones.find(z => z.dataset.bucket === bucket).querySelector('.sort-drop')).appendChild(chips[i]);
      chips[i].classList.remove('on', 'wrong');
      picked = null;
      go.disabled = placed.includes(null);
    };
    const target = (node, bucket) => {
      node.onclick = e => { if (!locked && picked !== null && !e.target.closest('.sort-item')) place(picked, bucket); };
      node.ondragover = e => { if (!locked) e.preventDefault(); };
      node.ondrop = e => { e.preventDefault(); if (!locked) place(+e.dataTransfer.getData('text/plain'), bucket); };
    };
    zones.forEach(z => target(z, z.dataset.bucket));
    target(pool, null);
    const reveal = ans => {
      locked = true; go.hidden = true;
      chips.forEach((ch, i) => {
        const ok = ans[i] === c.items[i].bucket;
        ch.disabled = true; ch.draggable = false;
        ch.classList.remove('on', 'wrong');
        ch.classList.add(ok ? 'right' : 'wrong');
        if (!ok) ch.appendChild(el('span', 'sort-fix', '&rarr; ' + inline(c.items[i].bucket)));
      });
    };
    go.onclick = () => {
      const s = Primer.scoreSort(c, placed);
      if (ctx.primer) { reveal(placed); commit(box, exp, ctx, 'sort', placed.slice(), s.right + '/' + s.total); return; }
      attempts++;
      if (s.right === s.total) {
        reveal(placed);
        fb.innerHTML = '<b>Correct.</b>'; fb.className = 'check-fb good';
        box.classList.add('done'); exp.hidden = false;
        record(id, attempts === 1, {}, ctx);
        return;
      }
      chips.forEach((ch, i) => ch.classList.toggle('wrong', placed[i] !== c.items[i].bucket));
      fb.innerHTML = 'Not quite: the red items are in the wrong bucket. Move them and commit again.';
      fb.className = 'check-fb bad';
    };
    box.append(pool, grid, go, fb, exp);
    const saved = ctx.primer ? Primer.answered(Store.data, ctx.key) : null;
    if (ctx.primer && saved && saved.type === 'sort' && Primer.fits('sort', c, saved.answer)) {
      saved.answer.forEach((b, i) => place(i, b)); reveal(saved.answer); settle(box, exp, ctx);
    } else if (!ctx.primer && Store.data.checks[id] && Store.data.checks[id].done) {
      c.items.forEach((it, i) => place(i, it.bucket)); reveal(placed); box.classList.add('done'); exp.hidden = false;
    }
    return box;
  }

  // :::order — drag rows or use the up/down buttons, then commit. Graded outside primers: retry until right.
  function buildOrder(d, ctx, idx) {
    const c = Primer.parseOrder(d.body);
    const id = ctx.key + '#o' + (d.args || idx);
    const box = el('div', 'check order');
    if (c.errors.length) return blockError(box, 'Order', c.errors);
    if (ctx.primer) ctx.sec.primer = { type: 'order', spec: c }; else box.dataset.checkId = id;
    box.appendChild(el('div', 'check-label', ctx.primer ? 'Your guess' : 'Put it in order'));
    box.appendChild(el('div', 'check-q', md(c.q.join('\n'))));
    const list = el('ol', 'order-list');
    const go = el('button', 'btn small', 'Commit');
    const fb = el('div', 'check-fb');
    fb.setAttribute('role', 'status');
    const exp = el('div', 'check-explain', md(c.explain.join('\n')));
    exp.hidden = true;
    let seq = Primer.orderStart(c.items.length, id), locked = false, attempts = 0;
    const draw = () => seq.forEach((v, p) => {
      rows[v].querySelector('.order-num').textContent = (p + 1) + '.';
      rows[v].classList.remove('wrong');
      list.appendChild(rows[v]);
    });
    const move = (i, dir) => {
      const p = seq.indexOf(i), q = p + dir;
      if (locked || q < 0 || q >= seq.length) return;
      [seq[p], seq[q]] = [seq[q], seq[p]];
      draw();
    };
    const rows = c.items.map((t, i) => {
      const li = el('li', 'order-item');
      li.draggable = true;
      const up = el('button', 'order-move', '&uarr;'), dn = el('button', 'order-move', '&darr;');
      up.setAttribute('aria-label', 'Move up'); dn.setAttribute('aria-label', 'Move down');
      up.onclick = () => { move(i, -1); up.focus(); };
      dn.onclick = () => { move(i, 1); dn.focus(); };
      li.append(el('span', 'order-num'), el('span', 'order-text', inline(t)), up, dn);
      li.ondragstart = e => e.dataTransfer.setData('text/plain', String(i));
      li.ondragover = e => { if (!locked) e.preventDefault(); };
      li.ondrop = e => {
        e.preventDefault();
        const from = +e.dataTransfer.getData('text/plain');
        if (locked || from === i) return;
        const to = seq.indexOf(i);
        seq.splice(seq.indexOf(from), 1);
        seq.splice(to, 0, from);
        draw();
      };
      return li;
    });
    const reveal = ans => {
      locked = true; go.hidden = true;
      seq = ans.slice(); draw();
      seq.forEach((v, p) => {
        const row = rows[v], ok = v === p;
        row.draggable = false;
        row.querySelectorAll('.order-move').forEach(b => { b.disabled = true; });
        row.classList.add(ok ? 'right' : 'wrong');
        if (!ok) row.querySelector('.order-text').appendChild(el('span', 'order-fix', `actually step ${v + 1}`));
      });
    };
    go.onclick = () => {
      const s = Primer.scoreOrder(c, seq);
      if (ctx.primer) { const a = seq.slice(); reveal(a); commit(box, exp, ctx, 'order', a, s.right + '/' + s.total); return; }
      attempts++;
      if (s.right === s.total) {
        reveal(seq);
        fb.innerHTML = '<b>Correct.</b>'; fb.className = 'check-fb good';
        box.classList.add('done'); exp.hidden = false;
        record(id, attempts === 1, {}, ctx);
        return;
      }
      seq.forEach((v, p) => rows[v].classList.toggle('wrong', v !== p));
      fb.innerHTML = 'Not quite: the red steps are out of place. Rearrange and commit again.';
      fb.className = 'check-fb bad';
    };
    draw();
    box.append(list, go, fb, exp);
    const saved = ctx.primer ? Primer.answered(Store.data, ctx.key) : null;
    if (ctx.primer && saved && saved.type === 'order' && Primer.fits('order', c, saved.answer)) {
      reveal(saved.answer); settle(box, exp, ctx);
    } else if (!ctx.primer && Store.data.checks[id] && Store.data.checks[id].done) {
      reveal(c.items.map((_, i) => i)); box.classList.add('done'); exp.hidden = false;
    }
    return box;
  }
```

- [ ] **Step 4: Replace `buildStep` and `section`**

Replace the existing `buildStep` and `section` functions in `js/render.js` with:

```js
  const RECAP = /\{\{primer\}\}/g;
  function buildStep(text, ctx, counter) {
    const step = el('div', ctx.primer ? 'step primer' : 'step');
    for (const b of splitDirectives(text)) {
      if (b.kind === 'md') { if (b.text.trim()) step.appendChild(el('div', 'prose', md(b.text).replace(RECAP, '<span class="primer-recap"></span>'))); continue; }
      if (b.type === 'primer') step.appendChild(el('div', 'primer-label', 'Before you read'));
      else if (b.type === 'check') step.appendChild(ctx.primer ? buildPrimerCheck(b, ctx) : buildCheck(b, ctx, counter.n++));
      else if (b.type === 'challenge') step.appendChild(buildChallenge(b, ctx, counter.c++));
      else if (b.type === 'sort') step.appendChild(buildSort(b, ctx, counter.s++));
      else if (b.type === 'order') step.appendChild(buildOrder(b, ctx, counter.o++));
      else if (b.type === 'widget') step.appendChild(buildWidget(b));
      else step.appendChild(buildCallout(b));
    }
    return step;
  }

  // Returns array of step elements for a section body. A first step starting with :::primer::: is the primer.
  function section(body, ctx) {
    const counter = { n: 0, c: 0, s: 0, o: 0 };
    const sec = { primer: null };
    const steps = [];
    const fill = () => {
      const e = sec.primer && Primer.answered(Store.data, ctx.key);
      const text = e && e.type === sec.primer.type ? Primer.recap(sec.primer.type, sec.primer.spec, e.answer) : '';
      const html = text ? '<b>Your guess:</b> ' + inline(text) : '';
      steps.forEach(st => st.querySelectorAll('.primer-recap').forEach(sp => { sp.innerHTML = html; }));
    };
    const pctx = Object.assign({}, ctx, { primer: true, sec, onPrimer: fill });
    body.split(/^\+\+\+\s*$/m).forEach((t, i) => steps.push(buildStep(t, i === 0 && /^\s*:::primer:::/.test(t) ? pctx : ctx, counter)));
    fill();
    return steps;
  }
```

- [ ] **Step 5: Append CSS**

Append to `css/styles.css`:

```css
/* lesson primers, sort and order blocks */
.step.primer { padding: 14px 16px 6px; border-radius: 12px; background: color-mix(in srgb, var(--accent-soft) 35%, var(--paper)); }
.primer-label { font-size: .75rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--accent); margin-bottom: 4px; }
.primer-recap { display: block; padding: 8px 12px; border-left: 3px solid var(--accent); background: var(--accent-soft); border-radius: 0 8px 8px 0; font-family: var(--sans); font-size: .95rem; }
.primer-recap:empty, p:has(> .primer-recap:empty:only-child) { display: none; }
.primer-again { margin-top: 10px; }
.sort-pool { display: flex; flex-wrap: wrap; gap: 8px; min-height: 48px; margin: 10px 0; padding: 8px; border: 1.5px dashed var(--line-2); border-radius: 10px; }
.sort-buckets { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-bottom: 10px; }
.sort-bucket { border: 1.5px solid var(--line-2); border-radius: 10px; padding: 8px; background: var(--paper); cursor: pointer; }
.sort-bucket-name { font-weight: 700; font-size: .88rem; margin-bottom: 6px; }
.sort-drop { display: flex; flex-direction: column; gap: 6px; min-height: 40px; }
.sort-item, .order-item { text-align: left; border: 1.5px solid var(--line-2); background: var(--paper); color: var(--ink); padding: 8px 12px; border-radius: 8px; font: .95rem var(--sans); cursor: grab; }
.sort-item.on { border-color: var(--accent); background: var(--accent-soft); }
.sort-item.right, .order-item.right { border-color: var(--good); background: var(--good-soft); }
.sort-item.wrong, .order-item.wrong { border-color: var(--bad); background: var(--bad-soft); }
.sort-item:disabled { cursor: default; color: var(--ink); }
.sort-fix, .order-fix { display: block; font-size: .82rem; color: var(--bad); margin-top: 2px; }
.order-list { list-style: none; padding: 0; margin: 10px 0; display: grid; gap: 6px; }
.order-item { display: flex; align-items: center; gap: 6px; }
.order-num { color: var(--muted); min-width: 1.6em; }
.order-text { flex: 1; }
.order-move { border: 1px solid var(--line-2); background: var(--paper); color: var(--ink); border-radius: 6px; width: 34px; height: 34px; cursor: pointer; }
.order-move:disabled { opacity: .35; cursor: default; }
```

- [ ] **Step 6: Add the M01 orgs primer (tracer content)**

In `content/m01.js`, section `id: 'orgs'`, the body currently starts with
`body: String.raw\`Cost estimating is performed by multiple, independent organizations to provide checks and balances:`.
Insert the primer as a new first step so the body starts:

```
body: String.raw`:::primer:::
Several kinds of organizations estimate the cost of the same program.

:::sort
Q: Which of these might feel pressure to show the program is affordable?
buckets: Pressure to show affordability | Independent check
- Program Office estimators = Pressure to show affordability
- CAPE = Independent check
- A service cost agency = Independent check
- GAO = Independent check
> The program office is closest to the technical detail but may be subject to advocacy bias: an incentive to show affordability. CAPE and the service cost agencies build estimates outside the program's chain of command, and GAO audits federal estimates against best practices.
:::

+++

Cost estimating is performed by multiple, independent organizations to provide checks and balances:
```

Then, between the end of the organizations table (the `| **Consultants** | ... |` row) and `:::key`, insert a recap paragraph so that part reads:

```
| **Consultants** | Provide specialized estimating support to any of the above groups. |

{{primer}}

:::key
```

- [ ] **Step 7: Automated checks**

Run: `npm test`
Expected: `183 passed, 0 failed`.
Run: `npm run validate`
Expected: `OK`; `content/m01.js` line shows `1 primers`.

- [ ] **Step 8: Browser verification**

Run `npm start` (background), open `http://localhost:8765/#/learn/m01/orgs`. Verify each item and fix before continuing:
1. Step mode: first step shows "Before you read", items appear in a shuffled pool; Continue reads "Answer the question to continue" and is disabled.
2. Tap an item, tap a bucket: item moves. Drag (desktop) also works. Commit enables only when the pool is empty.
3. Put "CAPE" under the pressure bucket deliberately and commit: CAPE turns red with "-> Independent check", others green, explanation shows, "Try again" appears, Continue enables. No retry possible.
4. Continue: the recap above the `Key idea` callout reads "Your guess: You sorted 3 of 4 correctly: you put *CAPE* under ...".
5. Reload the page: primer reopens in its answered state; recap still shows.
6. "Try again": primer reopens unanswered with the same shuffled item order.
7. Previously answered check in this section (the "Economics, business, and accounting" check) still shows as answered if it was before the change.
8. Full-page mode: primer at the top is interactive; committing fills the recap in the already-visible later step immediately; no Continue gating.
9. DevTools at 375px width: no horizontal scroll; tap-to-place works without drag; buckets stack.
10. DevTools console: no errors. In the console, `Store.data.checks` has no `m01/orgs#s0` key and `Store.data.primers['m01/orgs']` holds the answer.

- [ ] **Step 9: Commit**

```bash
git add index.html js/render.js css/styles.css content/m01.js
git commit -m "feat: render lesson primers with sort/order blocks; first primer in M01 orgs"
```

---

### Task 5: Remaining M01 primers

**Files:**
- Modify: `content/m01.js` (sections `definition`, `context`, `quality`, `products`, `process`, `methods`, `trl`, `validation`)

**Interfaces:**
- Consumes: `:::primer:::`, `:::sort`, `:::order`, primer `:::check`, `{{primer}}` from Tasks 3-4.
- Produces: content only.

Each section gets (a) a primer inserted as the new first step, directly after `body: String.raw\``, followed by a `+++` line and a blank line before the original first line; and (b) a `{{primer}}` paragraph (blank line before and after) at the stated anchor. Do not change any other text. Every answer below is taken from that section's body.

- [ ] **Step 1: `definition`**

Primer (insert before `**Cost estimating** is the process of collecting...`):
```
:::primer:::
Cost estimating and cost analysis sound like the same job. They aren't quite.

:::sort
Q: Which of these tasks are *estimating* (predicting a cost), and which go beyond it into *analysis*?
buckets: Estimating | Analysis
- Predict what a new system will cost to develop, from historical data = Estimating
- Forecast the cost of a task with a quantitative model = Estimating
- Compare the costs of two alternative designs = Analysis
- Review a contractor's proposal = Analysis
- Track spending against a baseline = Analysis
> Estimating predicts a future cost. Cost analysis includes estimating, but also evaluates and compares costs to support decisions: analyzing alternatives, assessing affordability, reviewing proposals, and tracking performance against a baseline.
:::

+++

```
Recap anchor: immediately before the paragraph starting `**Cost analysis** is broader.`

- [ ] **Step 2: `context`**

Primer (insert before `Cost estimating is critical throughout the program lifecycle.`):
```
:::primer:::
A program needs different kinds of cost estimates as it moves through its life cycle.

:::order
Q: Put these estimates in the order a program would first need them.
1. Analysis of Alternatives (AoA) to choose among options before committing to a project
2. Source selection estimates to compare competitors' approaches
3. A cost study before full-scale production
4. Estimate At Completion (EAC), once the program has enough actual cost history
> Pre-acquisition starts with AoA and trade studies; systems acquisition brings source selection; cost studies come before full-scale production; and an EAC needs an in-process program with sufficient cost history.
:::

+++

```
Recap anchor: immediately after the heading line `### Estimate Types by Lifecycle Phase`.

- [ ] **Step 3: `quality`**

Primer (insert before `The characteristics of high-quality cost estimates are:`):
```
:::primer:::
An estimate can get every number right and still fail as an estimate.

:::check
Q: An estimate's numbers are accurate and fully documented, but it reaches decision makers a week after the budget decision was made. Is it a high-quality estimate?
- Yes: accuracy and documentation are what make an estimate high quality
* No: an estimate that arrives after the decision provides no value
- Yes, as long as it can be reused in the next budget cycle
> **Timeliness** is one of the six characteristics: even a high-quality estimate provides no value if it isn't delivered to decision makers on time.
:::

+++

```
Recap anchor: after the last table row (`| **Timeliness** | ... |`), before the existing `:::check` (blank line between the table and `{{primer}}`).

- [ ] **Step 4: `products`**

Primer (insert before `An estimate is more than a single number.`):
```
:::primer:::
A finished estimate is a package of several deliverables.

:::sort
Q: Which deliverable does each item belong to?
buckets: Technical baseline | Cost estimate | Cost model | Documentation
- The CARD: what the system is, quantities, and the milestone schedule = Technical baseline
- Totals by WBS element, time-phased by year and funding category = Cost estimate
- The spreadsheet that applies CERs to each WBS element = Cost model
- Written GR&A, data sources, and the rationale for each method = Documentation
> The four products are the technical and schedule baseline description, the cost estimate, the cost model, and the estimate documentation. Documentation is a deliverable in its own right, not an afterthought.
:::

+++

```
Recap anchor: immediately after the line `An estimate is more than a single number. It consists of four primary deliverable products:`, before `### 1. Technical and Schedule Baseline Description`.

- [ ] **Step 5: `process`**

Primer (insert before `The CEBoK outlines a repeatable, generally sequential process...`):
```
:::primer:::
CEBoK builds every estimate with the same seven steps.

:::order
Q: Put the seven steps in order.
1. Develop the Work Breakdown Structure (WBS)
2. Develop the program/system baseline
3. Collect data
4. Analyze data
5. Select a methodology for each cost element
6. Develop and validate the model
7. Generate results and the report
> The process is generally sequential: scope (the WBS) first, then the baseline and its ground rules, then data collection and analysis, then a method per WBS element, then the model and its validation, and finally results and documentation.
:::

+++

```
Recap anchor: immediately after the heading line `### The seven CEBoK steps`.

- [ ] **Step 6: `methods`**

Primer (insert before `For each WBS element, the estimator selects the most appropriate method...`):
```
:::primer:::
How much you know about a design shapes how you can estimate it.

:::sort
Q: Which technique fits each situation best?
buckets: Analogy | Parametric (CER) | Engineering build-up
- Early concept, immature design, and one similar prior system = Analogy
- Maturing design and a good database of similar historical systems = Parametric (CER)
- Mature design with detailed specifications for each part = Engineering build-up
> Analogy dominates early, when the design is immature and data is limited. Parametric CERs need good historical data. Engineering build-up becomes dominant as the design matures and detail increases.
:::

+++

```
Recap anchor: immediately before the line `**Detailed comparison:**`.

- [ ] **Step 7: `trl`**

Primer (insert before `**Technology Readiness Levels** (TRLs) were developed by NASA...`):
```
:::primer:::
New technologies mature in stages before they are ready for use.

:::order
Q: Put these stages in order, from least to most mature.
1. Basic principles observed in a lab
2. A component breadboard validated in a lab
3. A prototype demonstrated in a relevant environment
4. A prototype demonstrated in an operational environment
5. The actual system proven in mission operations
> These are TRL 1-3, 4, 6, 7 and 9 on the scale below. Each stage moves the technology closer to real operating conditions.
:::

+++

```
Recap anchor: between the closing `:::` of the `:::tip Beyond CEBoK` TRL table and `:::widget trl:::`.

- [ ] **Step 8: `validation`**

Primer (insert before `Once a cost model is assembled, it must be validated...`):
```
:::primer:::
Once a cost model is built, it has to be tested before anyone relies on it.

:::sort
Q: Which kind of validation is each activity?
buckets: Sanity check | Cross-check | Sensitivity analysis
- Ask whether software cost rises with lines of code = Sanity check
- Look for obvious omissions or double-counted elements = Sanity check
- Re-estimate a key cost element with a different method = Cross-check
- Compare against an estimate by an organization outside the program = Cross-check
- Ask how much the total rises if labor rates increase 10% = Sensitivity analysis
- Find which cost elements have the largest confidence ranges = Sensitivity analysis
> Sanity checks ask basic reasonableness questions. Cross-checks compare the estimate against independent methods, models, data, or estimates. Sensitivity analysis finds which inputs and assumptions most affect the total.
:::

+++

```
Recap anchor: after the paragraph `Once a cost model is assembled, it must be validated before being presented as the basis for program decisions.`, before `### Sanity checks`.

- [ ] **Step 9: Automated checks**

Run: `npm run validate`
Expected: `OK`; `content/m01.js` shows `9 primers` and the same `checks` and `challenges` counts as before this task.
Run: `npm test`
Expected: `183 passed, 0 failed`.

- [ ] **Step 10: Browser walkthrough**

With `npm start` running, open each of the 9 M01 sections in step mode. For each: the primer renders with no "error" box, commit works, explanation and recap read correctly, recap appears at its anchor. For `quality`, confirm the pre-existing Replicability check keeps its prior answered state (IDs unshifted). Check one sort and one order at 375px width.

- [ ] **Step 11: Commit**

```bash
git add content/m01.js
git commit -m "feat: primers for all M01 sections"
```
