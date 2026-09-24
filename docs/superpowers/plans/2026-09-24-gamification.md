# Gamification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add XP/ranks/streaks/achievements, an opt-in leaderboard, and a Farmer-style estimating shop (generated contracts, tools, campaign) to PCEA Study Lab.

**Architecture:** All numbers are derived by pure functions (`js/game.js`, `js/achievements.js`, `js/shop/core.js`) from the profile data, which gains two write-once/idempotent parts (`days`, `shop`) merged by the existing per-record rules. Pure modules are UMD so the Node test suite and server can `require` them; UI modules are plain browser scripts like the rest of the app.

**Tech Stack:** Vanilla JS (no build, works over file://), Node >=16 built-ins only, `node:assert` tests run by `tests/run.js`.

**Spec:** docs/superpowers/specs/2026-09-24-gamification-design.md

## Global Constraints
- No new npm dependencies. No ES modules in browser code (plain `<script>` tags).
- Client merge (js/storage.js) and server merge (server.js) must stay rule-identical; both list `PARTS = ['cards', 'checks', 'sections', 'days', 'shop']`.
- Lesson widgets are never locked.
- Money in the shop is in $K. Contract XP = round(max(0, pay) / 2).
- Tier bases (pay at score 1.0): tier 1 = 60, tier 2 = 120, tier 3 = 250 ($K). Campaign base 300.
- Markdown strings rendered by `Render.md` use `$...$` for math and `\$` (JS string `'\\$'`) for literal dollars.
- UI copy: no emojis; icons are inline SVG.
- Run the whole suite with `npm test` (after Task 1).

## File map
| File | Responsibility |
|---|---|
| js/game.js (new, UMD) | dayKey, XP, ranks, streak, compute() |
| js/achievements.js (new, UMD) | stats() + achievement table + earned() |
| js/shop/core.js (new, UMD) | rng, hash, scoring, shop state, unlocks, offers, tools, calculator |
| js/shop/templates.js (new, UMD) | 23 contract templates |
| js/shop/campaign.js (new, UMD) | 8 handwritten campaign contracts |
| js/hud.js (new) | topbar HUD, toasts, +XP float, progress-page rewards block |
| js/leaderboard.js (new) | leaderboard tab |
| js/shop/ui.js (new) | shop board, contract view, tools, campaign view |
| js/storage.js | new parts, settings defaults, markActive, onSave hook |
| server.js | new parts, PCEA_PROFILES env, catalog loader, /api/leaderboard |
| js/scheduler.js, js/render.js, js/learn.js | call Store.markActive() |
| js/app.js, index.html, css/styles.css, js/progress.js | routing, script tags, styles, rewards block |
| tests/*.js | Node test suite |

---

### Task 1: Storage parts, activity marking, test harness

**Files:**
- Create: `tests/run.js`, `tests/merge.test.js`
- Modify: `js/storage.js`, `server.js`, `package.json`

**Interfaces:**
- Produces: `Store.markActive()`; `Store.onSave` (callback, called after every `save()`); `Store.data.days`, `Store.data.shop`; settings defaults `leaderboard: false, firmName: null, seenAch: null`; `server.js` exports `{ merge }` and honours `process.env.PCEA_PROFILES`.
- Consumes: `Game.dayKey` (Task 2) — storage uses a local fallback so it has no load-order dependency.

- [ ] **Step 1: Write the test harness** — `tests/run.js`:

```js
// Minimal test runner: each tests/*.test.js exports [[name, fn], ...]. fn may be async.
const fs = require('fs');
const path = require('path');
(async () => {
  const only = process.argv[2];
  const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.test.js') && (!only || f.includes(only))).sort();
  let pass = 0, fail = 0;
  for (const f of files) {
    for (const [name, fn] of require(path.join(__dirname, f))) {
      try { await fn(); pass++; console.log('PASS', f, '-', name); }
      catch (e) { fail++; console.log('FAIL', f, '-', name, '\n   ', e && e.stack ? e.stack.split('\n').slice(0, 3).join('\n    ') : e); }
    }
  }
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
```

- [ ] **Step 2: Write the failing merge test** — `tests/merge.test.js`. It loads js/storage.js in a vm with browser stubs and compares its merge with server.js's:

```js
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');

function loadStore() {
  const mem = {};
  const ctx = {
    console, Date, Math, JSON, Object, Set, Array, Promise, setTimeout, clearTimeout,
    localStorage: { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: k => { delete mem[k]; } },
    location: { protocol: 'file:' }, document: { addEventListener() {} }
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/storage.js'), 'utf8') + '\nthis.Store = Store;', ctx);
  return ctx.Store;
}
const Store = loadStore();
const server = require(path.join(ROOT, 'server.js'));

function rand(seed) { let s = seed; return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; }; }
function profile(r) {
  const d = { meta: {}, resets: {} };
  for (const p of ['cards', 'checks', 'sections', 'days', 'shop']) {
    d[p] = {};
    for (let i = 0; i < 4; i++) if (r() < 0.6) d[p]['k' + i] = { v: Math.floor(r() * 5), mod: Math.floor(r() * 10) };
    if (r() < 0.2) d.resets[p] = Math.floor(r() * 10);
  }
  return d;
}
const partsOnly = d => JSON.stringify(['cards', 'checks', 'sections', 'days', 'shop', 'resets'].map(p => d[p]));

module.exports = [
  ['store has days and shop parts', () => {
    const d = Store.normalize({});
    assert.deepStrictEqual(d.days, {});
    assert.deepStrictEqual(d.shop, {});
    assert.strictEqual(d.settings.leaderboard, false);
  }],
  ['client and server merge agree on every part', () => {
    const r = rand(7);
    for (let i = 0; i < 500; i++) {
      const a = profile(r), b = profile(r);
      assert.strictEqual(partsOnly(Store.merge(a, b)), partsOnly(server.merge(a, b)), 'case ' + i);
    }
  }],
  ['shop records survive merge from either side', () => {
    const a = { shop: { x: { tpl: 'lc-unit', pay: 10, mod: 5 } } }, b = { shop: { y: { tool: 'calc', cost: 100, mod: 6 } } };
    const m = Store.merge(a, b);
    assert.ok(m.shop.x && m.shop.y);
  }],
  ['markActive records today once', () => {
    Store.profile = null; Store.data = Store.normalize({});
    Store.markActive(); Store.markActive();
    const keys = Object.keys(Store.data.days);
    assert.strictEqual(keys.length, 1);
    assert.match(keys[0], /^\d{4}-\d{2}-\d{2}$/);
  }]
];
```

- [ ] **Step 3: Add the test script** — in `package.json` scripts add `"test": "node tests/run.js"`.

- [ ] **Step 4: Run to verify failure**

Run: `npm test`
Expected: FAIL on "store has days and shop parts" (days undefined) and "markActive" (not a function).

- [ ] **Step 5: Implement in js/storage.js**
  - Change `const PARTS = ['cards', 'checks', 'sections']` to `const PARTS = ['cards', 'checks', 'sections', 'days', 'shop']`.
  - In `defaults()`: `v: 2, cards: {}, checks: {}, sections: {}, days: {}, shop: {},` and settings `{ hitsToLevel: 2, newPerSession: 20, stepMode: true, theme: null, leaderboard: false, firmName: null, seenAch: null }`.
  - In `normalize()`, replace the key list with `['meta', 'resets', ...PARTS]`.
  - Add near `withoutMod`:
    ```js
    const pad = n => String(n).padStart(2, '0');
    const dayKey = t => { const d = new Date(t); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
    ```
  - Add to the `S` object `onSave: null,` and methods:
    ```js
    // Marks today as a study day (streaks). Idempotent, so devices merge cleanly.
    markActive() { const k = dayKey(Date.now()); if (!this.data.days[k]) this.data.days[k] = { a: 1 }; },
    ```
  - In `save()` after `this.persist();` add `if (this.onSave) this.onSave();`.
  - Update the header comment `server.py` -> `server.js` (two occurrences: header and merge comment).

- [ ] **Step 6: Implement in server.js**
  - `const PARTS = ['cards', 'checks', 'sections', 'days', 'shop']`.
  - `const PROFILES = process.env.PCEA_PROFILES ? path.resolve(process.env.PCEA_PROFILES) : path.join(ROOT, 'profiles');`

- [ ] **Step 7: Run tests**

Run: `npm test`
Expected: 4 passed, 0 failed.

- [ ] **Step 8: Commit**

```bash
git add tests js/storage.js server.js package.json
git commit -m "feat: days and shop profile parts, markActive, test harness"
```

---

### Task 2: Game engine (XP, ranks, streaks)

**Files:**
- Create: `js/game.js`, `tests/game.test.js`

**Interfaces:**
- Produces (global `Game` in browser, `module.exports` in Node):
  - `Game.dayKey(ms) -> 'YYYY-MM-DD'` (local time)
  - `Game.xpBreakdown(data) -> { cards, checks, sections, shop, total }`
  - `Game.rank(xp, certified) -> { name, idx, min, next: { name, xp } | null }`
  - `Game.streak(days, nowMs) -> { current, best, leave, activeDays }`
  - `Game.moduleLevels(data, catalog) -> { [moduleId]: averageLevel }`
  - `Game.compute(data, catalog, nowMs) -> { xp, rank, streak, moduleLevels, certified }`
  - `catalog` shape everywhere: `{ modules: [{ id, cards: [cardId], sections: ['m07/equation', ...] }] }`

- [ ] **Step 1: Write failing tests** — `tests/game.test.js`:

```js
const assert = require('assert');
const Game = require('../js/game.js');
const day = s => new Date(s + 'T12:00:00').getTime();
const days = (...ks) => Object.fromEntries(ks.map(k => [k, { a: 1 }]));

module.exports = [
  ['xp from cards, checks, sections, shop', () => {
    const d = {
      cards: { a: { right: 3, lvl: 2 }, b: { right: 0, lvl: 0 } },          // 30 + 5*(1+2)=15 -> 45
      checks: { x: { done: true, first: true }, y: { done: true }, z: {} }, // 20 + 10
      sections: { s: { done: true }, t: {} },                               // 50
      shop: { c1: { tpl: 'lc-unit', pay: 61 }, c2: { tpl: 'npv', pay: -18 }, b: { tool: 'calc', cost: 100 }, k: { camp: 'alpha', pay: 300 } }
    };
    const x = Game.xpBreakdown(d);
    assert.deepStrictEqual(x, { cards: 45, checks: 30, sections: 50, shop: 31 + 0 + 150, total: 45 + 30 + 50 + 181 });
  }],
  ['rank thresholds', () => {
    assert.strictEqual(Game.rank(0).name, 'Intern');
    assert.strictEqual(Game.rank(499).name, 'Intern');
    assert.strictEqual(Game.rank(500).name, 'Analyst I');
    assert.deepStrictEqual(Game.rank(500).next, { name: 'Analyst II', xp: 1500 });
    assert.strictEqual(Game.rank(18000).name, 'Chief Estimator');
    assert.strictEqual(Game.rank(18000).next, null);
    assert.strictEqual(Game.rank(18000, true).name, 'PCEA Certified');
    assert.strictEqual(Game.rank(9000, true).name, 'Lead Estimator');
  }],
  ['certified needs every module at level 3', () => {
    const cat = { modules: [{ id: 'm1', cards: ['a', 'b'], sections: [] }, { id: 'm2', cards: ['c'], sections: [] }] };
    const d = { cards: { a: { lvl: 3, right: 0 }, b: { lvl: 3, right: 0 }, c: { lvl: 2, right: 0 } } };
    assert.strictEqual(Game.compute(d, cat).certified, false);
    d.cards.c.lvl = 4;
    assert.strictEqual(Game.compute(d, cat).certified, true);
  }],
  ['streak: consecutive days, today pending does not break', () => {
    const s = Game.streak(days('2026-03-01', '2026-03-02', '2026-03-03'), day('2026-03-04'));
    assert.strictEqual(s.current, 3); assert.strictEqual(s.best, 3);
    assert.strictEqual(Game.streak(days('2026-03-01', '2026-03-02'), day('2026-03-04')).current, 0);
  }],
  ['streak: 7 days earns a leave day that covers one gap', () => {
    const ks = ['01', '02', '03', '04', '05', '06', '07', '09', '10'].map(d => '2026-03-' + d);
    const s = Game.streak(days(...ks), day('2026-03-10'));
    assert.strictEqual(s.current, 9); assert.strictEqual(s.leave, 0);
  }],
  ['streak: leave days cap at 2 and gap without leave resets', () => {
    const ks = []; for (let i = 1; i <= 21; i++) ks.push('2026-03-' + String(i).padStart(2, '0'));
    assert.strictEqual(Game.streak(days(...ks), day('2026-03-21')).leave, 2);
    const s = Game.streak(days('2026-03-01', '2026-03-03'), day('2026-03-03'));
    assert.strictEqual(s.current, 1); assert.strictEqual(s.best, 1);
  }],
  ['streak ignores junk keys', () => {
    assert.strictEqual(Game.streak({ nope: {}, '2026-03-01': {} }, day('2026-03-01')).current, 1);
  }]
];
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test game`
Expected: FAIL, "Cannot find module '../js/game.js'".

- [ ] **Step 3: Implement** — `js/game.js`:

```js
// Rewards: XP, ranks and streaks, computed from profile data so every device agrees.
(function (root) {
  const RANKS = [['Intern', 0], ['Analyst I', 500], ['Analyst II', 1500], ['Senior Estimator', 4000], ['Lead Estimator', 9000], ['Chief Estimator', 18000]];
  const CERTIFIED = 'PCEA Certified';
  const pad = n => String(n).padStart(2, '0');
  const dayKey = t => { const d = new Date(t); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  const vals = o => Object.values(o || {}).filter(v => v && typeof v === 'object');

  const cardXP = c => { const l = c.lvl || 0; return (c.right || 0) * 10 + 5 * l * (l + 1) / 2; };
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
  // Today is still pending, so not having studied yet today does not break the streak.
  function streak(days, now) {
    const keys = Object.keys(days || {}).filter(k => /^\d{4}-\d{2}-\d{2}$/.test(k)).sort();
    const res = { current: 0, best: 0, leave: 0, activeDays: keys.length };
    if (!keys.length) return res;
    const set = new Set(keys), today = dayKey(now);
    const [y, m, dd] = keys[0].split('-').map(Number);
    let run = 0;
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
      res.best = Math.max(res.best, res.current);
    }
    return res;
  }
  function compute(d, catalog, now) {
    d = d || {};
    const xp = xpBreakdown(d), lv = moduleLevels(d, catalog), ids = Object.keys(lv);
    const certified = ids.length > 0 && ids.every(k => lv[k] >= 3);
    return { xp, rank: rank(xp.total, certified), streak: streak(d.days, now || Date.now()), moduleLevels: lv, certified };
  }
  const Game = { RANKS, CERTIFIED, dayKey, cardXP, xpBreakdown, moduleLevels, rank, streak, compute };
  if (typeof module !== 'undefined' && module.exports) module.exports = Game; else root.Game = Game;
})(this);
```

Note on the "leave covers one gap" test: days 1–7 earn 1 leave, day 8 missed spends it (current stays 7), days 9–10 make current 9, leave 0.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add js/game.js tests/game.test.js
git commit -m "feat: game engine for XP, ranks and streaks"
```

---

### Task 3: Achievements

**Files:**
- Create: `js/achievements.js`, `tests/achievements.test.js`

**Interfaces:**
- Consumes: `Game.compute` result `g`, catalog.
- Produces: `Achievements.LIST` (array of `{ id, name, desc, test(stats) }`), `Achievements.stats(data, g, catalog)`, `Achievements.earned(data, g, catalog) -> [achievement]`.

- [ ] **Step 1: Write failing tests** — `tests/achievements.test.js`:

```js
const assert = require('assert');
const Game = require('../js/game.js');
const A = require('../js/achievements.js');
const cat = { modules: [{ id: 'm1', cards: ['a'], sections: ['m1/s1', 'm1/s2'] }, { id: 'm2', cards: ['b'], sections: ['m2/s1'] }] };
const ids = d => A.earned(d, Game.compute(d, cat), cat).map(a => a.id);

module.exports = [
  ['ids are unique and every entry is complete', () => {
    const seen = new Set();
    A.LIST.forEach(a => { assert.ok(a.id && a.name && a.desc && typeof a.test === 'function', a.id); assert.ok(!seen.has(a.id), 'dup ' + a.id); seen.add(a.id); });
    assert.ok(A.LIST.length >= 20);
  }],
  ['empty profile earns nothing', () => { assert.deepStrictEqual(ids({}), []); }],
  ['first section and module read', () => {
    const d = { sections: { 'm1/s1': { done: true } } };
    assert.ok(ids(d).includes('first-section'));
    assert.ok(!ids(d).includes('module-read'));
    d.sections['m1/s2'] = { done: true };
    assert.ok(ids(d).includes('module-read'));
    assert.ok(!ids(d).includes('library'));
    d.sections['m2/s1'] = { done: true };
    assert.ok(ids(d).includes('library'));
  }],
  ['shop achievements', () => {
    const d = { shop: { c: { tpl: 'lc-unit', score: 1, pay: 60 }, b: { tool: 'calc', cost: 100 }, k: { camp: 'alpha', score: 0.8, pay: 240 } } };
    const e = ids(d);
    ['first-contract', 'first-campaign'].forEach(x => assert.ok(e.includes(x), x));
    assert.ok(!e.includes('campaign-done'));
  }]
];
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test achievements`
Expected: FAIL, cannot find module.

- [ ] **Step 3: Implement** — `js/achievements.js`:

```js
// Achievements are rules over stats computed from profile data; nothing about them is stored except which were already announced.
(function (root) {
  const vals = o => Object.values(o || {}).filter(v => v && typeof v === 'object');
  function stats(d, g, catalog) {
    const cards = vals(d.cards), checks = vals(d.checks), shop = vals(d.shop), mods = (catalog && catalog.modules) || [];
    const contracts = shop.filter(r => r.tpl), good = r => (r.score || 0) >= 0.6;
    const secDone = k => d.sections && d.sections[k] && d.sections[k].done;
    return {
      xp: g.xp.total, rankIdx: g.rank.idx, certified: g.certified,
      streakBest: g.streak.best, activeDays: g.streak.activeDays,
      reviews: cards.reduce((s, c) => s + (c.seen || 0), 0),
      mastered: cards.filter(c => (c.lvl || 0) >= 5).length,
      checks: checks.filter(c => c.done).length,
      firstTry: checks.filter(c => c.first).length,
      sections: vals(d.sections).filter(s => s.done).length,
      modulesRead: mods.filter(m => m.sections.length && m.sections.every(secDone)).length,
      moduleCount: mods.length,
      modulesStrong: mods.filter(m => (g.moduleLevels[m.id] || 0) >= 3).length,
      contracts: contracts.length,
      perfect: contracts.filter(r => (r.score || 0) >= 1).length,
      lc: contracts.filter(r => /^lc-/.test(r.tpl) && good(r)).length,
      evm: contracts.filter(r => /^evm-/.test(r.tpl) && good(r)).length,
      incentive: contracts.filter(r => /^(cpif|fpif)/.test(r.tpl) && good(r)).length,
      tools: shop.filter(r => r.tool).length,
      campaign: new Set(shop.filter(r => r.camp && good(r)).map(r => r.camp)).size
    };
  }
  const a = (id, name, desc, test) => ({ id, name, desc, test });
  const LIST = [
    a('first-section', 'Kickoff Meeting', 'Finish your first lesson section.', s => s.sections >= 1),
    a('module-read', 'Well Read', 'Finish every section of a module.', s => s.modulesRead >= 1),
    a('library', 'Full Library', 'Finish every section of every module.', s => s.moduleCount > 0 && s.modulesRead >= s.moduleCount),
    a('checks-50', 'Checked Out', 'Answer 50 lesson questions.', s => s.checks >= 50),
    a('sharp-25', 'Sharpshooter', 'Get 25 lesson questions right on the first try.', s => s.firstTry >= 25),
    a('sharp-100', 'Zero Variance', 'Get 100 lesson questions right on the first try.', s => s.firstTry >= 100),
    a('reviews-100', 'Data Collection', 'Grade 100 flashcards.', s => s.reviews >= 100),
    a('reviews-1000', 'Large Sample', 'Grade 1,000 flashcards.', s => s.reviews >= 1000),
    a('mastered-10', 'Mastered', 'Bring 10 cards to Mastered.', s => s.mastered >= 10),
    a('mastered-100', 'Subject Matter Expert', 'Bring 100 cards to Mastered.', s => s.mastered >= 100),
    a('strong-module', 'Strong Suit', 'Average Strong across a whole module\'s cards.', s => s.modulesStrong >= 1),
    a('streak-3', 'Learning Curve', 'Study 3 days in a row.', s => s.streakBest >= 3),
    a('streak-7', 'Steady State', 'Study 7 days in a row.', s => s.streakBest >= 7),
    a('streak-30', 'Sustainment', 'Study 30 days in a row.', s => s.streakBest >= 30),
    a('rank-1', 'Promoted', 'Reach Analyst I.', s => s.rankIdx >= 1),
    a('rank-3', 'Senior Staff', 'Reach Senior Estimator.', s => s.rankIdx >= 3),
    a('rank-5', 'Chief Estimator', 'Reach Chief Estimator.', s => s.rankIdx >= 5),
    a('certified', 'PCEA Certified', 'Reach Chief Estimator with every module at Strong.', s => s.certified),
    a('first-contract', 'Open for Business', 'Finish your first shop contract.', s => s.contracts >= 1),
    a('contracts-25', 'Going Concern', 'Finish 25 shop contracts.', s => s.contracts >= 25),
    a('perfect-10', 'On Target', 'Finish 10 contracts with every answer within 1%.', s => s.perfect >= 10),
    a('lc-5', 'Crawford Would Approve', 'Win 5 learning-curve contracts.', s => s.lc >= 5),
    a('evm-5', 'Earned Value', 'Win 5 earned value contracts.', s => s.evm >= 5),
    a('incentive-5', 'Share Ratio', 'Win 5 incentive-contract jobs.', s => s.incentive >= 5),
    a('tools-3', 'Tooled Up', 'Buy 3 things from the tool shop.', s => s.tools >= 3),
    a('first-campaign', 'First Program', 'Complete a campaign contract.', s => s.campaign >= 1),
    a('campaign-done', 'Program Complete', 'Complete all 8 campaign contracts.', s => s.campaign >= 8)
  ];
  function earned(d, g, catalog) { const s = stats(d || {}, g, catalog); return LIST.filter(x => x.test(s)); }
  const Achievements = { LIST, stats, earned };
  if (typeof module !== 'undefined' && module.exports) module.exports = Achievements; else root.Achievements = Achievements;
})(this);
```

- [ ] **Step 4: Run tests** — `npm test`, expect all pass.

- [ ] **Step 5: Commit**

```bash
git add js/achievements.js tests/achievements.test.js
git commit -m "feat: achievements table"
```

---

### Task 4: Activity hooks, HUD, toasts, progress-page rewards

**Files:**
- Create: `js/hud.js`
- Modify: `js/scheduler.js` (grade), `js/render.js` (finish), `js/learn.js:140`, `js/app.js`, `js/progress.js`, `index.html`, `css/styles.css`

**Interfaces:**
- Consumes: `Game`, `Achievements`, `Store.onSave`, `Store.markActive`.
- Produces: `Hud.update(silent)`, `Hud.reset()`, `Hud.catalog()`, `Hud.progressHTML()`, `Hud.toast(title, body)`.

- [ ] **Step 1: Activity hooks**
  - js/scheduler.js `grade()`: before `Store.save();` add `Store.markActive();`.
  - js/render.js `finish`: before `Store.save();` add `Store.markActive();`.
  - js/learn.js line 140: `if (!st.done) { st.done = true; st.at = Date.now(); Store.markActive(); Store.save(); refreshSide(); }`.

- [ ] **Step 2: Create js/hud.js**

```js
// Topbar rank/XP/streak, toasts and the rewards block on the Progress page.
const Hud = (() => {
  const box = document.getElementById('hud');
  const toasts = document.getElementById('toasts');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const FLAME = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M8 1c.6 2.6 4 4.4 4 8.2A4 4 0 0 1 4 9.3c0-1.7.9-2.9 1.9-3.8-.1 1.4.5 2.5 1.5 2.9C7.1 6.2 7.4 3.4 8 1z"/></svg>';
  const fmt = n => Math.round(n).toLocaleString('en-US');
  let last = null, cat = null, busy = false;

  function catalog() {
    return cat || (cat = { modules: PCEA.modules.map(m => ({ id: m.id, cards: m.cardList.map(c => c.id), sections: m.sections.map(s => m.id + '/' + s.id) })) });
  }
  function current() {
    const g = Game.compute(Store.data, catalog());
    g.earned = Achievements.earned(Store.data, g, catalog());
    return g;
  }
  function pct(g) {
    if (!g.rank.next) return 100;
    return Math.max(0, Math.min(100, (g.xp.total - g.rank.min) / (g.rank.next.xp - g.rank.min) * 100));
  }
  function paint(g) {
    box.innerHTML = `<a href="#/progress" class="hud-rank" title="${fmt(g.xp.total)} XP${g.rank.next ? ' · ' + fmt(g.rank.next.xp - g.xp.total) + ' to ' + esc(g.rank.next.name) : ''}">
        <b>${esc(g.rank.name)}</b><span class="hud-bar"><i style="width:${pct(g)}%"></i></span></a>
      <span class="hud-streak ${g.streak.current ? 'on' : ''}" title="${g.streak.current}-day streak · best ${g.streak.best} · ${g.streak.leave} leave day${g.streak.leave === 1 ? '' : 's'}">${FLAME}${g.streak.current}</span>`;
  }
  function toast(title, body) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<b>${esc(title)}</b>${body ? `<span>${esc(body)}</span>` : ''}`;
    toasts.appendChild(t);
    setTimeout(() => t.classList.add('out'), 3800);
    setTimeout(() => t.remove(), 4300);
  }
  function float(text) {
    const f = document.createElement('div');
    f.className = 'xp-float'; f.textContent = text;
    box.appendChild(f);
    setTimeout(() => f.remove(), 1300);
  }
  function update(silent) {
    if (busy) return;
    if (!Store.profile) { box.hidden = true; last = null; return; }
    busy = true;
    try {
      const g = current();
      box.hidden = false; paint(g);
      const seen = Store.settings.seenAch;
      if (!Array.isArray(seen)) {
        // First run for this profile: remember what is already earned without announcing it.
        Store.settings.seenAch = g.earned.map(a => a.id); Store.save();
      } else {
        const fresh = g.earned.filter(a => !seen.includes(a.id));
        if (fresh.length) {
          Store.settings.seenAch = seen.concat(fresh.map(a => a.id)); Store.save();
          if (!silent) fresh.forEach(a => toast('Achievement: ' + a.name, a.desc));
        }
      }
      if (last && !silent) {
        const dx = g.xp.total - last.xp.total;
        if (dx > 0) float('+' + fmt(dx) + ' XP');
        if (g.rank.idx > last.rank.idx) toast('Promoted to ' + g.rank.name, 'Keep going.');
      }
      last = g;
    } finally { busy = false; }
  }
  function reset() { last = null; update(true); }

  function progressHTML() {
    const g = current(), x = g.xp;
    const got = new Set(g.earned.map(a => a.id));
    return `<div class="rewards">
      <div class="rw-card"><div class="rw-label">Rank</div><div class="rw-big">${esc(g.rank.name)}</div>
        <div class="hud-bar wide"><i style="width:${pct(g)}%"></i></div>
        <div class="muted small">${fmt(x.total)} XP${g.rank.next ? ` · ${fmt(g.rank.next.xp - x.total)} to ${esc(g.rank.next.name)}` : g.certified ? '' : ' · Certified needs every module at Strong'}</div>
        <div class="muted small">Cards ${fmt(x.cards)} · Questions ${fmt(x.checks)} · Sections ${fmt(x.sections)} · Shop ${fmt(x.shop)}</div></div>
      <div class="rw-card"><div class="rw-label">Streak</div><div class="rw-big">${FLAME} ${g.streak.current} day${g.streak.current === 1 ? '' : 's'}</div>
        <div class="muted small">Best ${g.streak.best} · ${g.streak.activeDays} study days · ${g.streak.leave}/2 leave days</div>
        <div class="muted small">Every 7 days in a row earns a leave day that covers one missed day.</div></div>
    </div>
    <h2>Achievements <span class="muted small">${got.size} of ${Achievements.LIST.length}</span></h2>
    <div class="ach-grid">${Achievements.LIST.map(a => `<div class="ach ${got.has(a.id) ? 'got' : ''}"><b>${esc(a.name)}</b><span>${esc(a.desc)}</span></div>`).join('')}</div>`;
  }
  return { update, reset, catalog, progressHTML, toast };
})();
```

- [ ] **Step 3: Wire it up**
  - index.html: inside `.topbar` before `#profileBtn` add `<div id="hud" class="hud" hidden></div>`; after `</main>` add `<div id="toasts" class="toasts" aria-live="polite"></div>`. Script tags: add `<script src="js/game.js"></script>` and `<script src="js/achievements.js"></script>` right after `js/registry.js`; add `<script src="js/hud.js"></script>` right before `js/app.js`.
  - js/app.js: in `profileChanged()` add `Hud.reset();` at the end. After `Store.onStatus = paintProfile;` add `Store.onSave = () => Hud.update();`. In the `Store.init().then(...)` nothing else changes (profileChanged already runs).
  - js/progress.js: directly after `<h1>Progress</h1>` insert `${Hud.progressHTML()}`.

- [ ] **Step 4: Styles** — append to css/styles.css:

```css
/* rewards */
.hud { position: relative; display: flex; align-items: center; gap: 10px; }
.hud-rank { display: flex; flex-direction: column; gap: 3px; text-decoration: none; color: var(--ink); font-size: .78rem; min-width: 96px; }
.hud-rank b { font-weight: 600; white-space: nowrap; }
.hud-bar { display: block; height: 5px; border-radius: 99px; background: var(--line); overflow: hidden; }
.hud-bar i { display: block; height: 100%; background: var(--accent); transition: width .5s; }
.hud-bar.wide { height: 8px; margin: 8px 0; }
.hud-streak { display: inline-flex; align-items: center; gap: 3px; font-weight: 600; font-size: .85rem; color: var(--muted); }
.hud-streak.on { color: var(--c2); }
.xp-float { position: absolute; left: 0; top: 100%; font-weight: 700; font-size: .85rem; color: var(--accent); pointer-events: none; animation: xpfloat 1.3s ease-out forwards; }
@keyframes xpfloat { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(18px); } }
.toasts { position: fixed; right: 16px; bottom: 16px; display: flex; flex-direction: column; gap: 8px; z-index: 50; }
.toast { background: var(--paper); border: 1px solid var(--accent); border-radius: var(--radius); box-shadow: var(--shadow); padding: 10px 14px; max-width: 300px; display: flex; flex-direction: column; gap: 2px; animation: toastin .25s ease-out; transition: opacity .4s, transform .4s; }
.toast span { color: var(--ink-2); font-size: .88rem; }
.toast.out { opacity: 0; transform: translateX(20px); }
@keyframes toastin { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.rewards { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; margin: 16px 0 8px; }
.rw-card { background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius); padding: 16px; }
.rw-label { text-transform: uppercase; letter-spacing: .06em; font-size: .72rem; color: var(--muted); }
.rw-big { font-size: 1.4rem; font-weight: 600; margin-top: 4px; display: flex; align-items: center; gap: 6px; }
.small { font-size: .85rem; }
.ach-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 10px; margin-bottom: 24px; }
.ach { border: 1px dashed var(--line-2); border-radius: var(--radius); padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; opacity: .55; }
.ach span { font-size: .82rem; color: var(--ink-2); }
.ach.got { opacity: 1; border-style: solid; border-color: var(--accent); background: var(--accent-soft); }
@media (max-width: 640px) { .hud-rank { min-width: 0; } .hud-rank b { display: none; } .hud-rank .hud-bar { width: 40px; } }
```

- [ ] **Step 5: Verify in a browser.** Serve with `node server.js --no-open --port 8790`, open `http://localhost:8790`, create a profile, grade 3 flashcards (Space then 3). Expected: topbar shows "Intern", bar grows, "+10 XP" floats, streak shows 1; Progress page shows Rank/Streak cards and an achievement grid. `npm test` still passes. Stop the server by PID (`netstat -ano | grep :8790`, then `taskkill //PID <pid> //F`) — never kill all node.exe.

- [ ] **Step 6: Commit**

```bash
git add js index.html css
git commit -m "feat: rewards HUD, toasts and progress-page rewards"
```

---

### Task 5: Opt-in leaderboard

**Files:**
- Create: `js/leaderboard.js`, `tests/server.test.js`
- Modify: `server.js`, `js/app.js`, `index.html`

**Interfaces:**
- Consumes: `Game.compute`, catalog shape from Task 2, `Store.settings.leaderboard`.
- Produces: `GET /api/leaderboard -> [{ name, rank, xp, streak }]` sorted by xp desc, only profiles with `settings.leaderboard === true`; `server.js` exports `{ merge, loadCatalog }`.

- [ ] **Step 1: Write failing test** — `tests/server.test.js`:

```js
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');
const http = require('http');
const ROOT = path.join(__dirname, '..');

function req(port, method, p, body) {
  return new Promise((resolve, reject) => {
    const r = http.request({ host: '127.0.0.1', port, method, path: p, headers: body ? { 'Content-Type': 'application/json' } : {} }, res => {
      let s = ''; res.on('data', c => s += c); res.on('end', () => resolve({ status: res.statusCode, body: s ? JSON.parse(s) : null }));
    });
    r.on('error', reject); if (body) r.write(JSON.stringify(body)); r.end();
  });
}
async function withServer(fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pcea-'));
  const port = 18000 + Math.floor(Math.random() * 1000);
  const p = spawn(process.execPath, ['server.js', '--no-open', '--local-only', '--port', String(port)], { cwd: ROOT, env: Object.assign({}, process.env, { PCEA_PROFILES: dir }) });
  try {
    for (let i = 0; i < 50; i++) { try { await req(port, 'GET', '/api/ping'); break; } catch (e) { await new Promise(r => setTimeout(r, 100)); } }
    await fn(port);
  } finally { p.kill(); fs.rmSync(dir, { recursive: true, force: true }); }
}

module.exports = [
  ['catalog loads all modules', () => {
    const cat = require('../server.js').loadCatalog();
    assert.strictEqual(cat.modules.length, 16);
    assert.ok(cat.modules[0].cards.length > 10 && cat.modules[0].sections[0].startsWith('m01/'));
  }],
  ['leaderboard lists only opted-in profiles, by xp', () => withServer(async port => {
    const now = Date.now();
    await req(port, 'POST', '/api/profiles/Ann', { settings: { leaderboard: true }, meta: { settings: now }, sections: { 'm01/definition': { done: true, mod: now } } });
    await req(port, 'POST', '/api/profiles/Bob', { settings: { leaderboard: false }, meta: { settings: now } });
    await req(port, 'POST', '/api/profiles/Cy', { settings: { leaderboard: true }, meta: { settings: now } });
    const r = await req(port, 'GET', '/api/leaderboard');
    assert.strictEqual(r.status, 200);
    assert.deepStrictEqual(r.body.map(x => x.name), ['Ann', 'Cy']);
    assert.strictEqual(r.body[0].xp, 50);
    assert.strictEqual(r.body[0].rank, 'Intern');
    assert.deepStrictEqual(Object.keys(r.body[0]).sort(), ['name', 'rank', 'streak', 'xp']);
  })]
];
```

- [ ] **Step 2: Run to verify failure** — `npm test server`. Expected: FAIL (`loadCatalog` not a function; leaderboard 404).

- [ ] **Step 3: Implement in server.js**
  - Top: `const vm = require('vm');` and `const Game = require('./js/game.js');`
  - After `listProfiles()` add:

```js
// ---- leaderboard ----
let catalog = null;
function loadCatalog() {
  if (catalog) return catalog;
  const ctx = { console };
  ctx.window = ctx;
  vm.createContext(ctx);
  const files = ['js/registry.js'].concat(fs.readdirSync(path.join(ROOT, 'content')).filter(f => /^m\d+\.js$/.test(f)).sort().map(f => 'content/' + f));
  files.forEach(f => vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f }));
  catalog = { modules: ctx.PCEA.modules.map(m => ({ id: m.id, cards: m.cardList.map(c => c.id), sections: m.sections.map(s => m.id + '/' + s.id) })) };
  return catalog;
}
function leaderboard() {
  if (!fs.existsSync(PROFILES)) return [];
  const rows = [];
  for (const f of fs.readdirSync(PROFILES).filter(f => f.endsWith('.json') && !f.startsWith('.'))) {
    let d; try { d = JSON.parse(fs.readFileSync(path.join(PROFILES, f), 'utf8')); } catch (e) { continue; }
    if (!d || !d.settings || d.settings.leaderboard !== true) continue;
    const g = Game.compute(d, loadCatalog());
    rows.push({ name: f.slice(0, -5), rank: g.rank.name, xp: g.xp.total, streak: g.streak.current });
  }
  return rows.sort((a, b) => b.xp - a.xp || a.name.localeCompare(b.name));
}
```

  - In `api()` after the ping line: `if (what === 'leaderboard' && req.method === 'GET') return sendJSON(res, 200, leaderboard());`
  - Export: `module.exports = { merge, loadCatalog };`

- [ ] **Step 4: Run tests** — `npm test`, all pass.

- [ ] **Step 5: Client page** — create `js/leaderboard.js`:

```js
const Leaderboard = (() => {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  async function route(root) {
    root.innerHTML = `<div class="progress-page"><h1>Leaderboard</h1>
      <p class="muted">Profiles on this server that choose to appear. Only name, rank, XP and streak are shown.</p>
      <label class="lb-opt"><input type="checkbox" id="lbOpt" ${Store.settings.leaderboard ? 'checked' : ''}> Show <b>${esc(Store.profile)}</b> on the leaderboard</label>
      <div id="lbList" class="muted">Loading…</div></div>`;
    const list = root.querySelector('#lbList');
    async function load() {
      try {
        const rows = await Store.api('GET', 'leaderboard');
        list.className = '';
        list.innerHTML = rows.length ? `<table class="ptable lb"><tr><th>#</th><th>Name</th><th>Rank</th><th>XP</th><th>Streak</th></tr>${rows.map((r, i) =>
          `<tr class="${r.name.toLowerCase() === Store.profile.toLowerCase() ? 'me' : ''}"><td>${i + 1}</td><td>${esc(r.name)}</td><td>${esc(r.rank)}</td><td>${r.xp.toLocaleString('en-US')}</td><td>${r.streak}</td></tr>`).join('')}</table>`
          : '<p class="muted">Nobody has opted in yet.</p>';
      } catch (e) { list.textContent = 'Could not load the leaderboard: ' + e.message; }
    }
    root.querySelector('#lbOpt').onchange = async e => {
      Store.settings.leaderboard = e.target.checked;
      Store.save();
      await Store.push();
      load();
    };
    load();
  }
  return { route };
})();
```

  - index.html: add `<a href="#/leaderboard" data-tab="leaderboard" id="lbTab" hidden>Leaderboard</a>` as the last link in `.tabs`; add `<script src="js/leaderboard.js"></script>` before `js/hud.js`.
  - js/app.js `render()`: add `else if (tab === 'leaderboard' && Store.mode === 'server') Leaderboard.route(root);` before the final `else`. In `profileChanged()` add `document.getElementById('lbTab').hidden = Store.mode !== 'server';`.
  - css/styles.css append: `.lb-opt { display: flex; gap: 8px; align-items: center; margin: 12px 0 18px; } .ptable.lb tr.me td { background: var(--accent-soft); font-weight: 600; }`

- [ ] **Step 6: Manual check** — run server on 8790, two profiles, opt one in, confirm table. Stop server by PID.

- [ ] **Step 7: Commit**

```bash
git add server.js js tests index.html css
git commit -m "feat: opt-in leaderboard"
```

---

### Task 6: Shop core

**Files:**
- Create: `js/shop/core.js`, `tests/shop.test.js`

**Interfaces:**
- Consumes: catalog shape; template shape `{ id, module, section, title, gen(h, tier) -> { brief, answers: [{ label, unit, value }], explain } }`.
- Produces (`ShopCore`):
  - `rng(seed) -> () => [0,1)`, `hash(str) -> uint32`, `helpers(r) -> { r, num(lo, hi, step), pick(arr) }`
  - `BASE = [0, 60, 120, 250]`, `CAMPAIGN_BASE = 300`, `STARTER = ['m05', 'm06']`, `TOOLS`
  - `answerScore(given, expected)`, `grade(givenArr, answers, base) -> { each, score, pay, rep }`
  - `state(data) -> { cash, rep, repLevel, nextRep, completed, owned, used, campaign, maxTier, has(id), left(id) }`
  - `unlocked(data, catalog) -> Set<moduleId>`
  - `offers(profile, data, catalog, templates) -> [{ slot, tpl, tier, seed, job }]`
  - `calc(expr) -> number` (throws on bad input)

- [ ] **Step 1: Write failing tests** — `tests/shop.test.js`:

```js
const assert = require('assert');
const C = require('../js/shop/core.js');
const tpl = (id, module) => ({ id, module, section: module + '/x', title: id, gen: (h, tier) => ({ brief: 'b', answers: [{ label: 'x', unit: '', value: h.num(1, 9, 1) * tier }], explain: 'e' }) });
const T = [tpl('a', 'm05'), tpl('b', 'm06'), tpl('c', 'm07')];
const cat = { modules: [{ id: 'm05', cards: [], sections: [] }, { id: 'm06', cards: [], sections: [] }, { id: 'm07', cards: ['m07-1', 'm07-2', 'm07-3'], sections: [] }] };

module.exports = [
  ['rng is deterministic and in range', () => {
    const a = C.rng(42), b = C.rng(42);
    for (let i = 0; i < 100; i++) { const x = a(); assert.strictEqual(x, b()); assert.ok(x >= 0 && x < 1); }
  }],
  ['num respects bounds and step', () => {
    const h = C.helpers(C.rng(1));
    for (let i = 0; i < 500; i++) { const v = h.num(2, 3, 0.25); assert.ok(v >= 2 && v <= 3); assert.strictEqual(Math.round(v * 4), v * 4); }
  }],
  ['answer scoring bands', () => {
    assert.strictEqual(C.answerScore('100.5', 100), 1);
    assert.strictEqual(C.answerScore('104', 100), 0.6);
    assert.strictEqual(C.answerScore('91', 100), 0.2);
    assert.strictEqual(C.answerScore('80', 100), -0.3);
    assert.strictEqual(C.answerScore('', 100), -0.3);
    assert.strictEqual(C.answerScore('1,234', 1234), 1);
  }],
  ['grade combines answers', () => {
    const g = C.grade(['100', '80'], [{ value: 100 }, { value: 100 }], 60);
    assert.strictEqual(g.score, 0.35); assert.strictEqual(g.pay, 21); assert.strictEqual(g.rep, -1);
    assert.strictEqual(C.grade(['100'], [{ value: 100 }], 60).rep, 1);
  }],
  ['state sums cash and clamps reputation', () => {
    const d = { shop: {
      a: { tpl: 'x', pay: -20, rep: -1, score: 0, t: 1 },
      b: { tpl: 'x', pay: 60, rep: 1, score: 1, t: 2 },
      c: { tool: 'opinion', cost: 40, t: 3 }, d: { use: 'opinion', t: 4 }, e: { tool: 'opinion', cost: 40, t: 5 },
      f: { camp: 'alpha', pay: 300, rep: 2, score: 1, t: 6 } } };
    const s = C.state(d);
    assert.strictEqual(s.cash, 260); assert.strictEqual(s.rep, 3); assert.strictEqual(s.repLevel, 1);
    assert.strictEqual(s.completed, 3); assert.strictEqual(s.left('opinion'), 1); assert.ok(s.has('opinion'));
    assert.deepStrictEqual(s.campaign, ['alpha']); assert.strictEqual(s.maxTier, 1); assert.strictEqual(s.nextRep, 4);
  }],
  ['unlocks follow card study', () => {
    assert.deepStrictEqual([...C.unlocked({}, cat)].sort(), ['m05', 'm06']);
    const d = { cards: { 'm07-1': { seen: 2, lvl: 1 } } };
    assert.ok(C.unlocked(d, cat).has('m07'));
    d.cards['m07-1'].lvl = 0;
    assert.ok(!C.unlocked(d, cat).has('m07'));
  }],
  ['offers are deterministic and only from unlocked modules', () => {
    const o1 = C.offers('Ann', {}, cat, T), o2 = C.offers('Ann', {}, cat, T);
    assert.strictEqual(o1.length, 3);
    assert.deepStrictEqual(o1.map(o => [o.tpl.id, o.tier, o.job.answers[0].value]), o2.map(o => [o.tpl.id, o.tier, o.job.answers[0].value]));
    o1.forEach(o => { assert.ok(['m05', 'm06'].includes(o.tpl.module)); assert.strictEqual(o.tier, 1); });
    assert.strictEqual(C.offers('Ann', { shop: { b: { tool: 'board', cost: 400, t: 1 } } }, cat, T).length, 4);
  }],
  ['calculator', () => {
    assert.strictEqual(C.calc('2+3*4'), 14);
    assert.strictEqual(C.calc('-2^2'), -4);
    assert.strictEqual(C.calc('2^3^2'), 512);
    assert.ok(Math.abs(C.calc('ln(0.85)/ln(2)') - Math.log(0.85) / Math.log(2)) < 1e-12);
    assert.ok(Math.abs(C.calc('100*1.03^5') - 100 * Math.pow(1.03, 5)) < 1e-9);
    assert.strictEqual(C.calc('sqrt(16) + abs(-2) + exp(0)'), 7);
    assert.throws(() => C.calc('2+'));
    assert.throws(() => C.calc('alert(1)'));
  }]
];
```

- [ ] **Step 2: Run to verify failure** — `npm test shop`, expect cannot find module.

- [ ] **Step 3: Implement** — `js/shop/core.js`:

```js
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
```

Note on the calc test `-2^2`: `unary` sees `-`, recurses to `unary -> power`, which returns 4, so the result is -4. `2^3^2`: `power` calls `unary` for the exponent, which is right-associative, giving 2^9 = 512.

- [ ] **Step 4: Run tests** — `npm test`, all pass.

- [ ] **Step 5: Commit**

```bash
git add js/shop/core.js tests/shop.test.js
git commit -m "feat: shop core (offers, scoring, economy, calculator)"
```

---

### Task 7: Contract templates

**Files:**
- Create: `js/shop/templates.js`, `tests/templates.test.js`

**Interfaces:**
- Consumes: template contract from Task 6; `h.num`, `h.pick`.
- Produces: `ShopTemplates` (array of 23 templates). Template ids: `esc-compound, esc-index, analogy-scale, cer-power, stats-cv, lc-unit, lc-lot, lc-slope, reg-fit, tri-stats, risk-sum, normal-prob, expected-value, mfg-labor, make-buy, sw-effort, npv, pv-annuity, cpif-fee, fpif-pta, evm-eac, evm-tcpi, abc-cost`.

Rules for every template: compute answers from the **displayed (rounded)** inputs; every answer value must be finite and non-zero; brief/explain are Markdown for `Render.md` (use `\\$` for literal dollars in JS strings).

- [ ] **Step 1: Write failing fuzz test** — `tests/templates.test.js`:

```js
const assert = require('assert');
const C = require('../js/shop/core.js');
const T = require('../js/shop/templates.js');
const fs = require('fs');
const path = require('path');

module.exports = [
  ['23 templates with unique ids and valid sections', () => {
    assert.strictEqual(T.length, 23);
    assert.strictEqual(new Set(T.map(t => t.id)).size, T.length);
    T.forEach(t => {
      const [m, s] = t.section.split('/');
      assert.strictEqual(m, t.module, t.id);
      const src = fs.readFileSync(path.join(__dirname, '..', 'content', m + '.js'), 'utf8');
      assert.ok(src.includes(`id: '${s}'`), t.id + ' section ' + t.section);
    });
  }],
  ['every template produces sane jobs for 500 seeds x 3 tiers', () => {
    for (const t of T) for (let tier = 1; tier <= 3; tier++) for (let seed = 1; seed <= 500; seed++) {
      const j = t.gen(C.helpers(C.rng(seed * 7919 + tier)), tier);
      const where = `${t.id} tier ${tier} seed ${seed}`;
      assert.ok(typeof j.brief === 'string' && j.brief.length > 20, where + ' brief');
      assert.ok(typeof j.explain === 'string' && j.explain.length > 20, where + ' explain');
      assert.ok(!/NaN|undefined|Infinity/.test(j.brief + j.explain), where + ' text has NaN/undefined');
      assert.ok(Array.isArray(j.answers) && j.answers.length >= 1, where + ' answers');
      j.answers.forEach(a => {
        assert.ok(a.label && typeof a.unit === 'string', where + ' label/unit');
        assert.ok(Number.isFinite(a.value) && Math.abs(a.value) > 1e-9, where + ' value ' + a.value);
      });
    }
  }],
  ['spot checks', () => {
    const job = id => T.find(t => t.id === id);
    // Fixed-input checks via a stub helper that returns the midpoint of each range / first pick.
    const stub = { r: () => 0, num: (lo) => lo, pick: a => a[0] };
    const lc = job('lc-unit').gen(stub, 1);
    const b = Math.log(0.80) / Math.log(2);
    assert.ok(Math.abs(lc.answers[0].value - 800 * Math.pow(10, b)) < 1e-6);
    const npv = job('npv').gen(stub, 1);
    assert.ok(Number.isFinite(npv.answers[0].value));
  }]
];
```

- [ ] **Step 2: Run to verify failure** — `npm test templates`, expect cannot find module.

- [ ] **Step 3: Implement** — `js/shop/templates.js`:

```js
// Contract templates for the estimating shop. gen(h, tier) returns { brief, answers, explain }.
// Inputs are rounded before answers are computed, so the numbers shown are exactly the numbers used.
(function (root) {
  const K = [0, 1, 3, 10];
  const r2 = v => Math.round(v * 100) / 100, r3 = v => Math.round(v * 1000) / 1000, r1 = v => Math.round(v * 10) / 10;
  const f = (v, dp = 2) => Number(v).toLocaleString('en-US', { maximumFractionDigits: dp });
  const M = (v, dp = 2) => '\\$' + f(v, dp) + 'M';
  const Kd = (v, dp = 1) => '\\$' + f(v, dp) + 'K';
  const pct = (v, dp = 1) => f(v * 100, dp) + '%';
  const erf = x => { const s = Math.sign(x); x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; };
  const phi = z => 0.5 * (1 + erf(z / Math.SQRT2));
  const lcB = s => Math.log(s) / Math.log(2);

  const T = [];
  const add = t => T.push(t);

  // ---- M5 Inflation & escalation ----
  add({ id: 'esc-compound', module: 'm05', section: 'm05/procedures', title: 'Escalate to then-year dollars', gen(h, tier) {
    const C = r1(h.num(2, 20, 0.5) * K[tier]), by = h.num(2018, 2024, 1), n = h.num(2, 8, 1), rt = h.pick([0.02, 0.025, 0.03, 0.035, 0.04]);
    const ty = C * Math.pow(1 + rt, n);
    return {
      brief: `A subsystem is estimated at ${M(C)} in constant BY${by} dollars. It will be bought in FY${by + n}. Assume inflation of ${pct(rt)} per year throughout. What is the then-year cost?`,
      answers: [{ label: 'Then-year cost', unit: '$M', value: ty }],
      explain: `Compound the constant-dollar cost forward ${n} years:\n\n$$TY = BY \\times (1+r)^n = ${C} \\times ${1 + rt}^{${n}} = ${f(ty, 3)}$$`
    };
  } });
  add({ id: 'esc-index', module: 'm05', section: 'm05/indices', title: 'Deflate with index numbers', gen(h, tier) {
    const T$ = r1(h.num(5, 50, 0.5) * K[tier]), ib = r3(h.num(0.9, 1.1, 0.005)), it = r3(ib * (1 + h.num(0.05, 0.35, 0.01))), by = h.num(2015, 2022, 1), yr = by + h.num(3, 9, 1);
    const v = T$ * ib / it;
    return {
      brief: `A contractor reports ${M(T$)} spent in FY${yr} (then-year dollars). The cost index is ${ib} for FY${by} and ${it} for FY${yr}. Express the cost in constant FY${by} dollars.`,
      answers: [{ label: `Cost in FY${by} dollars`, unit: '$M', value: v }],
      explain: `Divide by the ratio of index values:\n\n$$BY = TY \\times \\frac{I_{${by}}}{I_{${yr}}} = ${T$} \\times \\frac{${ib}}{${it}} = ${f(v, 3)}$$`
    };
  } });

  // ---- M2 Methods ----
  add({ id: 'analogy-scale', module: 'm02', section: 'm02/analogy', title: 'Analogy with scaling and complexity', gen(h, tier) {
    const C = r1(h.num(10, 90, 1) * K[tier]), wo = h.num(200, 900, 10), wn = r1(wo * h.num(0.7, 1.5, 0.05)), cf = h.pick([1.05, 1.1, 1.15, 1.2, 1.25, 1.3]), p = 0.7;
    const v = C * Math.pow(wn / wo, p) * cf;
    return {
      brief: `The analogous system cost ${M(C)} (same base year) and weighed ${wo} lb. The new system is expected to weigh ${wn} lb. Scale cost by weight with an exponent of ${p}, then apply a complexity factor of ${cf}. What is the analogy estimate?`,
      answers: [{ label: 'Analogy estimate', unit: '$M', value: v }],
      explain: `$$\\text{Cost}_{new} = ${C} \\times \\left(\\frac{${wn}}{${wo}}\\right)^{${p}} \\times ${cf} = ${f(v, 3)}$$\n\nAn analogy is only as good as the adjustments; document why each factor applies.`
    };
  } });

  // ---- M3 Parametric ----
  add({ id: 'cer-power', module: 'm03', section: 'm03/forms', title: 'Apply a power CER', gen(h, tier) {
    const a = h.num(1.5, 6, 0.1), b = h.num(0.5, 0.95, 0.01), X = h.num(50, 900, 10) * K[tier];
    const v = a * Math.pow(X, b);
    return {
      brief: `Your CER is $\\text{Cost} = ${a} \\times W^{${b}}$ (cost in \\$K, weight $W$ in lb). The new unit weighs ${f(X, 0)} lb. What does the CER predict?`,
      answers: [{ label: 'Predicted cost', unit: '$K', value: v }],
      explain: `$$${a} \\times ${X}^{${b}} = ${f(v, 2)}$$\n\nWith $b < 1$ there are economies of scale: doubling weight multiplies cost by $2^{${b}} = ${f(Math.pow(2, b), 3)}$.`
    };
  } });

  // ---- M6 Descriptive statistics ----
  add({ id: 'stats-cv', module: 'm06', section: 'm06/dispersion', title: 'Mean and coefficient of variation', gen(h, tier) {
    const n = 4 + tier, base = h.num(20, 80, 1) * K[tier];
    const xs = []; for (let i = 0; i < n; i++) xs.push(h.num(Math.round(base * 0.6), Math.round(base * 1.4), 1));
    if (xs.every(x => x === xs[0])) xs[0] += 1;
    const mean = xs.reduce((s, x) => s + x, 0) / n;
    const sd = Math.sqrt(xs.reduce((s, x) => s + (x - mean) * (x - mean), 0) / (n - 1));
    return {
      brief: `Historical costs (\\$K) for ${n} similar items: ${xs.join(', ')}. Find the mean and the coefficient of variation (use the sample standard deviation).`,
      answers: [{ label: 'Mean', unit: '$K', value: mean }, { label: 'CV', unit: '%', value: sd / mean * 100 }],
      explain: `$$\\bar{x} = ${f(mean, 3)}, \\quad s = \\sqrt{\\frac{\\sum (x-\\bar{x})^2}{n-1}} = ${f(sd, 3)}, \\quad CV = \\frac{s}{\\bar{x}} = ${f(sd / mean * 100, 2)}\\%$$`
    };
  } });

  // ---- M7 Learning curves ----
  add({ id: 'lc-unit', module: 'm07', section: 'm07/equation', title: 'Unit cost on a learning curve', gen(h, tier) {
    const T1 = h.num(800, 3000, 50) * K[tier], s = h.pick([0.80, 0.82, 0.85, 0.88, 0.90, 0.92, 0.95]), N = h.num(10, 200, 1);
    const b = lcB(s), v = T1 * Math.pow(N, b);
    return {
      brief: `Unit 1 took ${f(T1, 0)} hours. Assume unit theory with a ${pct(s, 0)} learning curve. How many hours will unit ${N} take?`,
      answers: [{ label: `Hours for unit ${N}`, unit: 'hours', value: v }],
      explain: `$$b = \\frac{\\ln ${s}}{\\ln 2} = ${f(b, 4)}, \\quad Y_{${N}} = ${T1} \\times ${N}^{${f(b, 4)}} = ${f(v, 1)}$$`
    };
  } });
  add({ id: 'lc-lot', module: 'm07', section: 'm07/formulas', title: 'Price a production lot', gen(h, tier) {
    const T1 = h.num(200, 900, 10) * K[tier], s = h.pick([0.80, 0.85, 0.88, 0.90, 0.92]), F = h.num(11, 60, 1), Q = h.num(10, 40, 1), L = F + Q - 1;
    const b = lcB(s);
    let sum = 0; for (let x = F; x <= L; x++) sum += T1 * Math.pow(x, b);
    const approx = T1 / (b + 1) * (Math.pow(L + 0.5, b + 1) - Math.pow(F - 0.5, b + 1));
    return {
      brief: `First-unit cost is ${Kd(T1, 0)}, unit theory, ${pct(s, 0)} slope. Price the lot of units ${F} through ${L}: total lot cost and average unit cost.`,
      answers: [{ label: 'Lot cost', unit: '$K', value: sum }, { label: 'Average unit cost', unit: '$K', value: sum / Q }],
      explain: `$b = ${f(b, 4)}$. The midpoint approximation gives\n\n$$\\frac{T_1}{b+1}\\left[(L+\\tfrac12)^{b+1} - (F-\\tfrac12)^{b+1}\\right] = ${f(approx, 1)}$$\n\nThe exact sum of units ${F}–${L} is ${f(sum, 1)}, so the average unit cost is ${f(sum / Q, 2)}.`
    };
  } });
  add({ id: 'lc-slope', module: 'm07', section: 'm07/process', title: 'Back out the learning slope', gen(h, tier) {
    const X1 = h.num(5, 20, 1), X2 = X1 * h.pick([2, 3, 4, 5]), Y1 = h.num(500, 2000, 10) * K[tier], s0 = h.pick([0.78, 0.82, 0.85, 0.88, 0.91, 0.94]);
    const Y2 = r1(Y1 * Math.pow(X2 / X1, lcB(s0)));
    const b = Math.log(Y2 / Y1) / Math.log(X2 / X1), s = Math.pow(2, b);
    return {
      brief: `Under unit theory, unit ${X1} took ${f(Y1, 0)} hours and unit ${X2} took ${f(Y2, 1)} hours. What learning curve slope (%) does that imply?`,
      answers: [{ label: 'Slope', unit: '%', value: s * 100 }],
      explain: `$$b = \\frac{\\ln(${Y2}/${Y1})}{\\ln(${X2}/${X1})} = ${f(b, 4)}, \\quad \\text{slope} = 2^{b} = ${f(s * 100, 2)}\\%$$`
    };
  } });

  // ---- M8 Regression ----
  add({ id: 'reg-fit', module: 'm08', section: 'm08/fit', title: 'Fit a linear CER', gen(h, tier) {
    const x0 = h.num(1, 5, 1), st = h.num(1, 4, 1), a = h.num(10, 40, 1) * K[tier], b = h.num(2, 9, 0.5) * K[tier];
    const X = [0, 1, 2, 3, 4].map(i => x0 + i * st), Y = X.map(x => r1(a + b * x + h.num(-3, 3, 0.5) * K[tier]));
    const n = 5, mx = X.reduce((s, v) => s + v, 0) / n, my = Y.reduce((s, v) => s + v, 0) / n;
    const sxy = X.reduce((s, x, i) => s + (x - mx) * (Y[i] - my), 0), sxx = X.reduce((s, x) => s + (x - mx) * (x - mx), 0);
    const bh = sxy / sxx, ah = my - bh * mx, xp = X[4] + st, yp = ah + bh * xp;
    return {
      brief: `Fit $Y = a + bX$ by least squares to these points and predict $Y$ at $X = ${xp}$.\n\n| X | ${X.join(' | ')} |\n|---|${X.map(() => '---').join('|')}|\n| Y (\\$K) | ${Y.join(' | ')} |`,
      answers: [{ label: 'Slope b', unit: '$K per X', value: bh }, { label: `Prediction at X = ${xp}`, unit: '$K', value: yp }],
      explain: `$$\\bar X = ${f(mx, 3)},\\ \\bar Y = ${f(my, 3)},\\ b = \\frac{\\sum(X-\\bar X)(Y-\\bar Y)}{\\sum (X-\\bar X)^2} = \\frac{${f(sxy, 3)}}{${f(sxx, 3)}} = ${f(bh, 4)}$$\n\n$$a = \\bar Y - b\\bar X = ${f(ah, 3)}, \\quad \\hat Y(${xp}) = ${f(yp, 3)}$$`
    };
  } });

  // ---- M9 Risk ----
  add({ id: 'tri-stats', module: 'm09', section: 'm09/triangular', title: 'Triangular distribution statistics', gen(h, tier) {
    const L = h.num(5, 20, 0.5) * K[tier], Mo = L + h.num(1, 10, 0.5) * K[tier], H = Mo + h.num(2, 25, 0.5) * K[tier];
    const mean = (L + Mo + H) / 3, sd = Math.sqrt((L * L + Mo * Mo + H * H - L * Mo - L * H - Mo * H) / 18);
    return {
      brief: `An element's cost is triangular with low ${M(L, 1)}, most likely ${M(Mo, 1)} and high ${M(H, 1)}. Find the mean and standard deviation.`,
      answers: [{ label: 'Mean', unit: '$M', value: mean }, { label: 'Standard deviation', unit: '$M', value: sd }],
      explain: `$$\\mu = \\frac{L+M+H}{3} = ${f(mean, 3)}, \\quad \\sigma = \\sqrt{\\frac{L^2+M^2+H^2-LM-LH-MH}{18}} = ${f(sd, 3)}$$\n\nThe mean sits above the mode because the high tail is longer.`
    };
  } });
  add({ id: 'risk-sum', module: 'm09', section: 'm09/summing', title: 'Roll up WBS risk', gen(h, tier) {
    const mu = [0, 1, 2].map(() => h.num(10, 60, 1) * K[tier]), sd = mu.map(m => r1(m * h.num(0.1, 0.35, 0.05)));
    const corr = tier >= 2, tm = mu.reduce((s, v) => s + v, 0), ts = corr ? sd.reduce((s, v) => s + v, 0) : Math.sqrt(sd.reduce((s, v) => s + v * v, 0));
    return {
      brief: `Three WBS elements have means ${mu.map(v => M(v, 0)).join(', ')} and standard deviations ${sd.map(v => M(v, 1)).join(', ')}. Treat them as ${corr ? '**perfectly correlated** (ρ = 1)' : '**independent**'}. Find the total mean and total standard deviation.`,
      answers: [{ label: 'Total mean', unit: '$M', value: tm }, { label: 'Total standard deviation', unit: '$M', value: ts }],
      explain: corr
        ? `Means always add: ${f(tm, 1)}. With $\\rho = 1$ standard deviations add too: $\\sigma = ${sd.join(' + ')} = ${f(ts, 3)}$.`
        : `Means add: ${f(tm, 1)}. Independent variances add: $\\sigma = \\sqrt{${sd.map(v => v + '^2').join(' + ')}} = ${f(ts, 3)}$. Ignoring positive correlation like this understates risk.`
    };
  } });

  // ---- M10 Probability ----
  add({ id: 'normal-prob', module: 'm10', section: 'm10/distributions-basic', title: 'Confidence of a budget', gen(h, tier) {
    const mu = h.num(50, 200, 1) * K[tier], sg = r1(mu * h.num(0.08, 0.25, 0.01)), z0 = h.pick([-1, -0.5, 0.5, 1, 1.5, 2]), B = r1(mu + z0 * sg);
    const z = (B - mu) / sg, p = phi(z) * 100;
    return {
      brief: `Total cost is normally distributed with mean ${M(mu, 0)} and standard deviation ${M(sg, 1)}. The budget is ${M(B, 1)}. What is the probability (%) that cost comes in at or under budget?`,
      answers: [{ label: 'Probability', unit: '%', value: p }],
      explain: `$$z = \\frac{${B} - ${mu}}{${sg}} = ${f(z, 3)}, \\quad P(C \\le B) = \\Phi(z) = ${f(p, 2)}\\%$$`
    };
  } });
  add({ id: 'expected-value', module: 'm10', section: 'm10/intro', title: 'Expected cost of outcomes', gen(h, tier) {
    const p1 = h.pick([0.1, 0.2, 0.25, 0.3]), p2 = h.pick([0.3, 0.4, 0.5]), p3 = r2(1 - p1 - p2);
    const c = [h.num(10, 30, 1), h.num(30, 60, 1), h.num(60, 120, 1)].map(v => v * K[tier]);
    const ev = p1 * c[0] + p2 * c[1] + p3 * c[2];
    return {
      brief: `A test program has three outcomes: pass first time (p = ${p1}, cost ${M(c[0], 0)}), one retest (p = ${p2}, cost ${M(c[1], 0)}), or redesign (p = ${p3}, cost ${M(c[2], 0)}). What is the expected cost?`,
      answers: [{ label: 'Expected cost', unit: '$M', value: ev }],
      explain: `$$E[C] = ${p1}(${c[0]}) + ${p2}(${c[1]}) + ${p3}(${c[2]}) = ${f(ev, 3)}$$`
    };
  } });

  // ---- M11 Manufacturing ----
  add({ id: 'mfg-labor', module: 'm11', section: 'm11/standards', title: 'Labor from standards', gen(h, tier) {
    const S = h.num(20, 120, 1), Q = h.num(10, 80, 1) * K[tier], R = h.num(1.1, 1.8, 0.05), W = h.num(90, 180, 1);
    const hrs = S * Q * R, cost = hrs * W / 1000;
    return {
      brief: `Each unit has ${S} standard hours. You are building ${Q} units with a realization factor of ${R}. The fully burdened (wrap) rate is \\$${W}/hour. Find the expected hours and labor cost.`,
      answers: [{ label: 'Expected hours', unit: 'hours', value: hrs }, { label: 'Labor cost', unit: '$K', value: cost }],
      explain: `$$\\text{Hours} = ${S} \\times ${Q} \\times ${R} = ${f(hrs, 1)}, \\quad \\text{Cost} = ${f(hrs, 1)} \\times ${W} / 1000 = ${f(cost, 2)}\\ \\text{\\$K}$$`
    };
  } });
  add({ id: 'make-buy', module: 'm11', section: 'm11/makebuy', title: 'Make-or-buy break-even', gen(h, tier) {
    const F = h.num(50, 400, 10) * K[tier], v = h.num(20, 120, 1), p = v + h.num(10, 80, 1);
    const q = F * 1000 / (p - v);
    return {
      brief: `Making a part in house needs ${Kd(F, 0)} of tooling plus \\$${v} per unit. A supplier charges \\$${p} per unit. At what quantity do the two options cost the same?`,
      answers: [{ label: 'Break-even quantity', unit: 'units', value: q }],
      explain: `$$Q^* = \\frac{\\text{Fixed}}{p_{buy} - v_{make}} = \\frac{${F * 1000}}{${p} - ${v}} = ${f(q, 1)}$$\n\nAbove this quantity, making is cheaper.`
    };
  } });

  // ---- M12 Software ----
  add({ id: 'sw-effort', module: 'm12', section: 'm12/parametric', title: 'Software effort and cost', gen(h, tier) {
    const A = h.pick([2.4, 2.94, 3.0, 3.2]), B = h.pick([1.05, 1.08, 1.1, 1.12, 1.15]), S = h.num(10, 120, 1) * K[tier], rate = h.num(15, 25, 0.5);
    const E = A * Math.pow(S, B), cost = E * rate / 1000;
    return {
      brief: `Use the effort model $E = ${A} \\times \\text{KSLOC}^{${B}}$ (person-months). The program is ${f(S, 0)} KSLOC and labor costs ${Kd(rate)} per person-month. Find effort and cost.`,
      answers: [{ label: 'Effort', unit: 'PM', value: E }, { label: 'Cost', unit: '$M', value: cost }],
      explain: `$$E = ${A} \\times ${S}^{${B}} = ${f(E, 1)}\\ \\text{PM}, \\quad \\text{Cost} = ${f(E, 1)} \\times ${rate} / 1000 = ${f(cost, 3)}$$\n\nAn exponent above 1 is a diseconomy of scale: bigger programs cost more per line.`
    };
  } });

  // ---- M13 Economic analysis ----
  add({ id: 'npv', module: 'm13', section: 'm13/discounting', title: 'Net present value', gen(h, tier) {
    let I, A, r, v;
    for (let tries = 0; tries < 50; tries++) {
      I = h.num(100, 500, 10) * K[tier]; r = h.pick([0.03, 0.05, 0.07, 0.1]);
      A = [1, 2, 3, 4, 5].map(() => h.num(20, 150, 5) * K[tier]);
      v = -I + A.reduce((s, a, t) => s + a / Math.pow(1 + r, t + 1), 0);
      if (Math.abs(v) >= 0.1 * I) break;
    }
    if (Math.abs(v) < 0.1 * I) { I = Math.round(I / 2); v = -I + A.reduce((s, a, t) => s + a / Math.pow(1 + r, t + 1), 0); }
    return {
      brief: `An upgrade costs ${Kd(I, 0)} now and saves ${A.map(a => Kd(a, 0)).join(', ')} at the end of years 1–5. At a ${pct(r, 0)} discount rate, what is the NPV?`,
      answers: [{ label: 'NPV', unit: '$K', value: v }],
      explain: `$$NPV = -${I} + ${A.map((a, t) => `\\frac{${a}}{${1 + r}^{${t + 1}}}`).join(' + ')} = ${f(v, 2)}$$\n\n${v > 0 ? 'Positive: the upgrade pays for itself.' : 'Negative: the savings do not justify the cost at this rate.'}`
    };
  } });
  add({ id: 'pv-annuity', module: 'm13', section: 'm13/comparison', title: 'Present value of a level cost stream', gen(h, tier) {
    const A = h.num(20, 200, 5) * K[tier], n = h.num(5, 20, 1), r = h.pick([0.02, 0.03, 0.05, 0.07]);
    const pv = A * (1 - Math.pow(1 + r, -n)) / r;
    return {
      brief: `Operating and support costs are ${Kd(A, 0)} per year for ${n} years, paid at year end. Discount at ${pct(r, 0)}. What is their present value?`,
      answers: [{ label: 'Present value', unit: '$K', value: pv }],
      explain: `$$PV = A \\cdot \\frac{1-(1+r)^{-n}}{r} = ${A} \\times \\frac{1-${1 + r}^{-${n}}}{${r}} = ${f(pv, 2)}$$`
    };
  } });

  // ---- M14 Contract pricing ----
  const SHARES = [[80, 20], [70, 30], [75, 25], [85, 15]];
  add({ id: 'cpif-fee', module: 'm14', section: 'm14/cpif', title: 'CPIF fee settlement', gen(h, tier) {
    const TC = h.num(50, 200, 1) * K[tier], TF = r2(TC * h.pick([0.06, 0.07, 0.08])), [g, c] = h.pick(SHARES);
    const mn = r2(TC * h.pick([0.02, 0.03])), mx = r2(TC * h.pick([0.1, 0.12])), AC = r2(TC * (1 + h.num(-0.25, 0.25, 0.01)));
    const raw = TF + c / 100 * (TC - AC), fee = Math.min(mx, Math.max(mn, raw));
    return {
      brief: `CPIF contract: target cost ${M(TC, 2)}, target fee ${M(TF)}, share ratio ${g}/${c} (Govt/Contractor), minimum fee ${M(mn)}, maximum fee ${M(mx)}. Actual cost is ${M(AC)}. Find the fee earned and the total the government pays.`,
      answers: [{ label: 'Fee', unit: '$M', value: fee }, { label: 'Total price', unit: '$M', value: AC + fee }],
      explain: `$$\\text{Fee} = TF + ${c / 100}\\,(TC - AC) = ${TF} + ${c / 100}(${TC} - ${AC}) = ${f(raw, 3)}$$\n\n${raw > mx ? `Capped at the maximum fee, ${mx}.` : raw < mn ? `Raised to the minimum fee, ${mn}.` : 'Within the fee limits.'} Total $= AC + \\text{Fee} = ${f(AC + fee, 3)}$.`
    };
  } });
  add({ id: 'fpif-pta', module: 'm14', section: 'm14/fpif', title: 'FPIF price and PTA', gen(h, tier) {
    const TC = h.num(50, 200, 1) * K[tier], TP = r2(TC * h.pick([0.08, 0.1, 0.12])), CP = r2((TC + TP) * h.pick([1.1, 1.15, 1.2, 1.25])), [g, c] = h.pick(SHARES);
    const AC = r2(TC * (1 + h.num(-0.15, 0.3, 0.01)));
    const pta = TC + (CP - (TC + TP)) / (g / 100), profit = TP + c / 100 * (TC - AC), price = Math.min(CP, AC + profit);
    return {
      brief: `FPIF contract: target cost ${M(TC, 2)}, target profit ${M(TP)}, ceiling price ${M(CP)}, share ${g}/${c} (Govt/Contractor). Actual cost is ${M(AC)}. Find the point of total assumption and the final price.`,
      answers: [{ label: 'PTA', unit: '$M', value: pta }, { label: 'Final price', unit: '$M', value: price }],
      explain: `$$PTA = TC + \\frac{CP - TP_{rice}}{\\text{Govt share}} = ${TC} + \\frac{${CP} - ${f(TC + TP, 2)}}{${g / 100}} = ${f(pta, 3)}$$\n\n$$\\text{Profit} = ${TP} + ${c / 100}(${TC} - ${AC}) = ${f(profit, 3)}, \\quad \\text{Price} = \\min(CP,\\ AC + \\text{Profit}) = ${f(price, 3)}$$`
    };
  } });

  // ---- M15 EVM ----
  function evmInputs(h, tier) {
    const BAC = h.num(20, 200, 1) * K[tier], EV = r2(BAC * h.num(0.2, 0.7, 0.01)), PV = r2(EV * h.num(0.85, 1.15, 0.01)), AC = r2(EV * h.num(0.9, 1.3, 0.01));
    return { BAC, EV, PV, AC, CPI: EV / AC, SPI: EV / PV };
  }
  add({ id: 'evm-eac', module: 'm15', section: 'm15/eac', title: 'Forecast at completion', gen(h, tier) {
    const e = evmInputs(h, tier), comp = tier >= 2;
    const eac = comp ? e.AC + (e.BAC - e.EV) / (e.CPI * e.SPI) : e.BAC / e.CPI;
    return {
      brief: `BAC ${M(e.BAC, 0)}. To date: PV ${M(e.PV)}, EV ${M(e.EV)}, AC ${M(e.AC)}. Find the CPI and the ${comp ? '**composite (CPI × SPI)**' : '**CPI-based**'} EAC.`,
      answers: [{ label: 'CPI', unit: '', value: e.CPI }, { label: 'EAC', unit: '$M', value: eac }],
      explain: `$$CPI = \\frac{EV}{AC} = ${f(e.CPI, 4)}${comp ? `,\\ SPI = \\frac{EV}{PV} = ${f(e.SPI, 4)}` : ''}$$\n\n$$EAC = ${comp ? `AC + \\frac{BAC - EV}{CPI \\times SPI}` : `\\frac{BAC}{CPI}`} = ${f(eac, 3)}$$`
    };
  } });
  add({ id: 'evm-tcpi', module: 'm15', section: 'm15/tcpi', title: 'Efficiency needed to finish on budget', gen(h, tier) {
    const e = evmInputs(h, tier), tcpi = (e.BAC - e.EV) / (e.BAC - e.AC), eac = e.BAC / e.CPI;
    return {
      brief: `BAC ${M(e.BAC, 0)}, EV ${M(e.EV)}, AC ${M(e.AC)}. Find the TCPI needed to finish at BAC, and the estimate to complete (ETC) if the current CPI continues.`,
      answers: [{ label: 'TCPI (BAC)', unit: '', value: tcpi }, { label: 'ETC', unit: '$M', value: eac - e.AC }],
      explain: `$$TCPI = \\frac{BAC - EV}{BAC - AC} = \\frac{${f(e.BAC - e.EV, 2)}}{${f(e.BAC - e.AC, 2)}} = ${f(tcpi, 4)}$$\n\n$$ETC = \\frac{BAC}{CPI} - AC = ${f(eac, 3)} - ${e.AC} = ${f(eac - e.AC, 3)}$$\n\n${tcpi > 1.1 ? 'A TCPI well above the current CPI is rarely achieved.' : ''}`
    };
  } });

  // ---- M16 Cost management ----
  add({ id: 'abc-cost', module: 'm16', section: 'm16/abc-allocation', title: 'Activity-based costing', gen(h, tier) {
    const P1 = h.num(100, 600, 10) * K[tier], D1 = h.num(200, 2000, 50), P2 = h.num(50, 400, 10) * K[tier], D2 = h.num(100, 1000, 25);
    const u1 = h.num(10, Math.round(D1 / 4), 5), u2 = h.num(5, Math.round(D2 / 4), 5);
    const rt1 = P1 / D1, cost = rt1 * u1 + P2 / D2 * u2;
    return {
      brief: `Machine setups cost ${Kd(P1, 0)} per year across ${D1} setups. Inspections cost ${Kd(P2, 0)} across ${D2} inspections. Product A uses ${u1} setups and ${u2} inspections. Find the setup rate and the overhead assigned to Product A.`,
      answers: [{ label: 'Setup rate', unit: '$K per setup', value: rt1 }, { label: 'Overhead for A', unit: '$K', value: cost }],
      explain: `$$\\text{Rates: } \\frac{${P1}}{${D1}} = ${f(rt1, 4)},\\ \\frac{${P2}}{${D2}} = ${f(P2 / D2, 4)} \\quad\\Rightarrow\\quad ${u1}(${f(rt1, 4)}) + ${u2}(${f(P2 / D2, 4)}) = ${f(cost, 3)}$$`
    };
  } });

  if (typeof module !== 'undefined' && module.exports) module.exports = T; else root.ShopTemplates = T;
})(this);
```

(That is 23 `add(...)` calls: m05×2, m02×1, m03×1, m06×1, m07×3, m08×1, m09×2, m10×2, m11×2, m12×1, m13×2, m14×2, m15×2, m16×1.)

Note: `STARTER` is `['m05', 'm06']` — three templates (esc-compound, esc-index, stats-cv) are available on day one.

- [ ] **Step 4: Run tests** — `npm test`. If a fuzz case fails, fix the template's ranges (never loosen the test).

- [ ] **Step 5: Commit**

```bash
git add js/shop/templates.js tests/templates.test.js
git commit -m "feat: 23 generated contract templates"
```

---

### Task 8: Campaign contracts

**Files:**
- Create: `js/shop/campaign.js`, `tests/campaign.test.js`

**Interfaces:**
- Produces: `ShopCampaign` array of `{ id, title, rep, story, steps: [{ prompt, answers: [{ label, unit, value }], explain }] }` where `rep` is the reputation level needed. Ids: `alpha, pitch, overrun, incentive, actuator, risk, software, business`.

- [ ] **Step 1: Failing test** — `tests/campaign.test.js`:

```js
const assert = require('assert');
const K = require('../js/shop/campaign.js');
module.exports = [
  ['8 campaigns, rep levels 0..7, all answers finite', () => {
    assert.strictEqual(K.length, 8);
    assert.deepStrictEqual(K.map(c => c.rep), [0, 1, 2, 3, 4, 5, 6, 7]);
    K.forEach(c => {
      assert.ok(c.id && c.title && c.story && c.steps.length >= 2, c.id);
      c.steps.forEach((s, i) => {
        assert.ok(s.prompt && s.explain, c.id + i);
        s.answers.forEach(a => assert.ok(Number.isFinite(a.value) && a.value !== 0, `${c.id} step ${i} ${a.label}`));
      });
    });
  }],
  ['spot values', () => {
    const inc = K.find(c => c.id === 'incentive');
    assert.ok(Math.abs(inc.steps[2].answers[0].value - 145.714) < 0.01);
    const act = K.find(c => c.id === 'actuator');
    assert.strictEqual(act.steps[0].answers[0].value, 3125);
  }]
];
```

- [ ] **Step 2: Run to verify failure** — `npm test campaign`.

- [ ] **Step 3: Implement** — `js/shop/campaign.js`. Values are computed in code, never hand-typed:

```js
// Handwritten multi-step campaign. Each step's correct answer is revealed before the next step so errors do not cascade.
(function (root) {
  const f = (v, dp = 3) => Number(v).toLocaleString('en-US', { maximumFractionDigits: dp });
  const lcB = s => Math.log(s) / Math.log(2);
  const C = [];

  { const s1 = 42 * Math.pow(1.025, 5), s2 = s1 * 1.2, s3 = s2 * Math.pow(1.03, 2);
    C.push({ id: 'alpha', title: 'Program Alpha: the first quote', rep: 0,
      story: 'A customer wants a quick quote for a radar upgrade. Your only data point is a similar upgrade that cost \\$42.0M in BY2019 dollars.',
      steps: [
        { prompt: 'Bring the analog to BY2024 dollars using 2.5% annual inflation.', answers: [{ label: 'Analog in BY2024', unit: '$M', value: s1 }], explain: `$42 \\times 1.025^5 = ${f(s1)}$` },
        { prompt: 'Engineers judge the new upgrade 20% more complex. Apply a complexity factor of 1.2.', answers: [{ label: 'Estimate, BY2024', unit: '$M', value: s2 }], explain: `$${f(s1)} \\times 1.2 = ${f(s2)}$` },
        { prompt: 'Purchase happens in FY2026. Escalate from BY2024 at 3% per year to then-year dollars.', answers: [{ label: 'Then-year quote', unit: '$M', value: s3 }], explain: `$${f(s2)} \\times 1.03^2 = ${f(s3)}$` }
      ] }); }

  { const t1 = 3.2 * Math.pow(450, 0.72), b = lcB(0.9); let lot = 0; for (let x = 1; x <= 50; x++) lot += t1 * Math.pow(x, b);
    C.push({ id: 'pitch', title: 'The parametric pitch', rep: 1,
      story: 'You are bidding 50 guidance kits. Your CER is $\\text{T1} = 3.2\\,W^{0.72}$ (\\$K, weight in lb), and the plant follows a 90% unit learning curve.',
      steps: [
        { prompt: 'The kit weighs 450 lb. What is the first-unit cost?', answers: [{ label: 'T1', unit: '$K', value: t1 }], explain: `$3.2 \\times 450^{0.72} = ${f(t1)}$` },
        { prompt: 'Total cost of units 1–50 on a 90% unit curve (exact sum).', answers: [{ label: 'Lot cost', unit: '$K', value: lot }], explain: `$b = ${f(b, 4)}$; $\\sum_{x=1}^{50} T_1 x^b = ${f(lot)}$` },
        { prompt: 'Average unit cost for the 50 kits.', answers: [{ label: 'Average', unit: '$K', value: lot / 50 }], explain: `$${f(lot)} / 50 = ${f(lot / 50)}$` }
      ] }); }

  { const BAC = 80, EV = 30, AC = 36, PV = 34, cpi = EV / AC, spi = EV / PV;
    C.push({ id: 'overrun', title: 'The overrun', rep: 2,
      story: 'Midway through development the program manager asks how bad it is. BAC \\$80M; PV \\$34M, EV \\$30M, AC \\$36M.',
      steps: [
        { prompt: 'Find CPI and SPI.', answers: [{ label: 'CPI', unit: '', value: cpi }, { label: 'SPI', unit: '', value: spi }], explain: `$CPI = 30/36 = ${f(cpi, 4)}$, $SPI = 30/34 = ${f(spi, 4)}$` },
        { prompt: 'CPI-based EAC and composite EAC.', answers: [{ label: 'EAC (CPI)', unit: '$M', value: BAC / cpi }, { label: 'EAC (CPI×SPI)', unit: '$M', value: AC + (BAC - EV) / (cpi * spi) }], explain: `$80/${f(cpi, 4)} = ${f(BAC / cpi)}$; $36 + 50/(${f(cpi, 4)} \\times ${f(spi, 4)}) = ${f(AC + (BAC - EV) / (cpi * spi))}$` },
        { prompt: 'TCPI to finish at BAC.', answers: [{ label: 'TCPI', unit: '', value: (BAC - EV) / (BAC - AC) }], explain: `$(80-30)/(80-36) = ${f((BAC - EV) / (BAC - AC), 4)}$, far above the current CPI: the BAC is not credible.` }
      ] }); }

  { const TC = 120, TF = 9.6, mn = 3.6, mx = 14.4, fee = ac => Math.min(mx, Math.max(mn, TF + 0.3 * (TC - ac)));
    const TP = 12, CP = 150, pta = TC + (CP - (TC + TP)) / 0.7, price = Math.min(CP, 132 + TP + 0.3 * (TC - 132));
    C.push({ id: 'incentive', title: 'Incentive negotiation', rep: 3,
      story: 'The customer offers either CPIF (TC \\$120M, TF \\$9.6M, 70/30, fee \\$3.6M–\\$14.4M) or FPIF (TC \\$120M, TP \\$12M, ceiling \\$150M, 70/30).',
      steps: [
        { prompt: 'CPIF fee if actual cost is \\$132M.', answers: [{ label: 'Fee', unit: '$M', value: fee(132) }], explain: `$9.6 + 0.3(120-132) = ${f(fee(132))}$` },
        { prompt: 'CPIF fee if actual cost is \\$100M.', answers: [{ label: 'Fee', unit: '$M', value: fee(100) }], explain: `$9.6 + 0.3(20) = 15.6$, capped at the \\$14.4M maximum.` },
        { prompt: 'FPIF point of total assumption.', answers: [{ label: 'PTA', unit: '$M', value: pta }], explain: `$120 + (150-132)/0.7 = ${f(pta)}$` },
        { prompt: 'FPIF final price if actual cost is \\$132M.', answers: [{ label: 'Price', unit: '$M', value: price }], explain: `Profit $= 12 + 0.3(120-132) = 8.4$; price $= 132 + 8.4 = ${f(price)}$ (below the ceiling).` }
      ] }); }

  { const q = 250000 / (260 - 180), save = (5000 * 260 - (250000 + 5000 * 180)) / 1000;
    C.push({ id: 'actuator', title: 'Make or buy the actuator', rep: 4,
      story: 'Making the actuator needs \\$250K of tooling plus \\$180 per unit; the supplier quotes \\$260 per unit.',
      steps: [
        { prompt: 'Break-even quantity.', answers: [{ label: 'Quantity', unit: 'units', value: q }], explain: `$250{,}000 / (260-180) = ${f(q)}$` },
        { prompt: 'The program needs 5,000 units. How much does making save?', answers: [{ label: 'Savings', unit: '$K', value: save }], explain: `Buy $= 1{,}300$K; make $= 250 + 900 = 1{,}150$K; savings $= ${f(save)}$K.` }
      ] }); }

  { const el = [[10, 12, 18], [20, 25, 40], [5, 6, 9]];
    const mean = el.map(([a, m, b]) => (a + m + b) / 3), sd = el.map(([a, m, b]) => Math.sqrt((a * a + m * m + b * b - a * m - a * b - m * b) / 18));
    const tm = mean.reduce((s, v) => s + v, 0), ts = Math.sqrt(sd.reduce((s, v) => s + v * v, 0)), p80 = tm + 0.8416 * ts;
    C.push({ id: 'risk', title: 'Risk-adjusted budget', rep: 5,
      story: 'Three independent WBS elements are triangular (\\$M): (10, 12, 18), (20, 25, 40), (5, 6, 9) as low, mode, high.',
      steps: [
        { prompt: 'Total mean cost.', answers: [{ label: 'Mean', unit: '$M', value: tm }], explain: `Means ${mean.map(v => f(v)).join(', ')} sum to ${f(tm)}.` },
        { prompt: 'Total standard deviation (independent).', answers: [{ label: 'σ', unit: '$M', value: ts }], explain: `$\\sigma_i$ = ${sd.map(v => f(v)).join(', ')}; root-sum-square = ${f(ts)}.` },
        { prompt: 'Treating the total as normal, what budget gives 80% confidence? (z = 0.8416)', answers: [{ label: '80% budget', unit: '$M', value: p80 }], explain: `$${f(tm)} + 0.8416 \\times ${f(ts)} = ${f(p80)}$` }
      ] }); }

  { const E = 2.94 * Math.pow(85, 1.1), cost = E * 20 / 1000, sch = 3.67 * Math.pow(E, 0.28);
    C.push({ id: 'software', title: 'The software upgrade', rep: 6,
      story: 'A mission-planning rewrite is sized at 85 KSLOC. Use $E = 2.94\\,\\text{KSLOC}^{1.10}$, schedule $= 3.67\\,E^{0.28}$ months, labor \\$20K per person-month.',
      steps: [
        { prompt: 'Effort in person-months.', answers: [{ label: 'Effort', unit: 'PM', value: E }], explain: `$2.94 \\times 85^{1.10} = ${f(E)}$` },
        { prompt: 'Cost in \\$M.', answers: [{ label: 'Cost', unit: '$M', value: cost }], explain: `$${f(E)} \\times 20 / 1000 = ${f(cost)}$` },
        { prompt: 'Schedule in months, and average staff (effort ÷ schedule).', answers: [{ label: 'Schedule', unit: 'months', value: sch }, { label: 'Average staff', unit: 'people', value: E / sch }], explain: `$3.67 \\times ${f(E)}^{0.28} = ${f(sch)}$ months; staff $= ${f(E / sch)}$.` }
      ] }); }

  { const npv = r => -900 + [1, 2, 3, 4, 5].reduce((s, t) => s + 250 / Math.pow(1 + r, t), 0);
    C.push({ id: 'business', title: 'The business case', rep: 7,
      story: 'Final job: a \\$900K automation investment saves \\$250K per year for 5 years (year-end).',
      steps: [
        { prompt: 'NPV at 7%.', answers: [{ label: 'NPV', unit: '$K', value: npv(0.07) }], explain: `$-900 + 250 \\times \\frac{1 - 1.07^{-5}}{0.07} = ${f(npv(0.07))}$` },
        { prompt: 'NPV at 10%.', answers: [{ label: 'NPV', unit: '$K', value: npv(0.1) }], explain: `$-900 + 250 \\times \\frac{1 - 1.1^{-5}}{0.1} = ${f(npv(0.1))}$` },
        { prompt: 'Simple payback period in years.', answers: [{ label: 'Payback', unit: 'years', value: 900 / 250 }], explain: '$900 / 250 = 3.6$ years (ignores the time value of money).' }
      ] }); }

  if (typeof module !== 'undefined' && module.exports) module.exports = C; else root.ShopCampaign = C;
})(this);
```

- [ ] **Step 4: Run tests** — `npm test`, all pass.

- [ ] **Step 5: Commit**

```bash
git add js/shop/campaign.js tests/campaign.test.js
git commit -m "feat: eight campaign contracts"
```

---

### Task 9: Shop UI

**Files:**
- Create: `js/shop/ui.js`
- Modify: `index.html`, `js/app.js`, `css/styles.css`

**Interfaces:**
- Consumes: `ShopCore`, `ShopTemplates`, `ShopCampaign`, `Render.md`, `Store`, `Hud.catalog()`, `Hud.toast`.
- Produces: `Shop.route(root, parts)`; routes `#/shop`, `#/shop/job/<slot>`, `#/shop/campaign/<id>`.
- Records written: contract `shop['c-' + completed + '-' + seed] = { tpl, tier, seed, given, score, pay, rep, t }`; campaign `shop['k-' + id + '-' + t] = { camp, given, score, pay, rep, t }` (rep 2 if score >= 0.6 else 0); purchase `shop['buy-' + tool + '-' + t] = { tool, cost, t }`; opinion use `shop['use-opinion-' + t] = { use: 'opinion', t }`.

- [ ] **Step 1: Create js/shop/ui.js**

```js
// Estimating shop screens: board, contract, campaign, tools.
const Shop = (() => {
  const C = ShopCore;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = v => (v < 0 ? '-' : '') + '$' + Math.abs(v).toLocaleString('en-US', { maximumFractionDigits: 1 }) + 'K';
  const firm = () => Store.settings.firmName || Store.profile + ' Cost Analysis';
  const modName = id => { const m = PCEA.module(id); return m ? `M${m.num} ${m.short || m.title}` : id; };
  const stars = t => '<span class="tier">' + 'I'.repeat(t) + '</span>';
  const record = (key, rec) => { Store.data.shop[key] = Object.assign(rec, { t: Date.now() }); };

  function route(root, parts) {
    if (parts[0] === 'job') return job(root, +parts[1]);
    if (parts[0] === 'campaign') return campaign(root, parts[1]);
    board(root);
  }

  function header(st) {
    const repPct = st.repLevel === 0 && st.rep === 0 ? 0 : Math.min(100, (st.rep - st.repLevel * st.repLevel) / (st.nextRep - st.repLevel * st.repLevel) * 100);
    return `<div class="shop-head">
      <div><div class="rw-label">Your firm</div><h1 class="firm" title="Click to rename">${esc(firm())}</h1></div>
      <div class="shop-kpis">
        <div class="kpi"><b class="${st.cash < 0 ? 'neg' : ''}">${money(st.cash)}</b><span>cash</span></div>
        <div class="kpi"><b>Level ${st.repLevel}</b><span>reputation · ${st.rep}/${st.nextRep} to next</span><div class="hud-bar"><i style="width:${repPct}%"></i></div></div>
        <div class="kpi"><b>${st.completed}</b><span>jobs finished · tier ${'I'.repeat(st.maxTier)} open</span></div>
      </div></div>`;
  }

  function board(root) {
    const cat = Hud.catalog(), st = C.state(Store.data), open = C.unlocked(Store.data, cat);
    const offers = C.offers(Store.profile, Store.data, cat, ShopTemplates);
    const locked = [...new Set(ShopTemplates.map(t => t.module))].filter(m => !open.has(m)).sort();
    root.innerHTML = `<div class="shop">${header(st)}
      <h2>Contract board</h2>
      <p class="muted">New offers appear after each job. Pay depends on accuracy: within 1% earns full pay, within 5% earns 60%, within 10% earns 20%, and anything further off costs you.</p>
      <div class="offers">${offers.map(o => `<a class="offer" href="#/shop/job/${o.slot}">
        <div class="offer-top"><span class="muted small">${esc(modName(o.tpl.module))}</span>${stars(o.tier)}</div>
        <b>${esc(o.tpl.title)}</b><span class="muted small">Up to ${money(C.BASE[o.tier])} · ${o.job.answers.length} answer${o.job.answers.length > 1 ? 's' : ''}</span></a>`).join('')}</div>
      ${locked.length ? `<p class="muted small">Locked contract types: ${locked.map(m => `<a href="#/cards?m=${m}">${esc(modName(m))}</a>`).join(', ')}. Study about a third of a module's flashcards to Familiar to open its contracts.</p>` : ''}
      <h2>Campaign</h2>
      <div class="camps">${ShopCampaign.map(c => {
        const done = st.campaign.includes(c.id), avail = st.repLevel >= c.rep;
        return avail ? `<a class="camp ${done ? 'done' : ''}" href="#/shop/campaign/${c.id}"><b>${esc(c.title)}</b><span class="muted small">${done ? 'Completed' : c.steps.length + ' steps · up to ' + money(C.CAMPAIGN_BASE)}</span></a>`
          : `<div class="camp locked"><b>${esc(c.title)}</b><span class="muted small">Needs reputation level ${c.rep}</span></div>`;
      }).join('')}</div>
      <h2>Tool shop</h2>
      <div class="tools">${C.TOOLS.map(t => {
        const owned = st.has(t.id) && !t.consumable;
        return `<div class="tool"><b>${esc(t.name)}</b><span class="muted small">${esc(t.desc)}</span>
          <div class="tool-foot">${owned ? '<span class="muted small">Owned</span>' : `<button class="btn small" data-buy="${t.id}" ${st.cash < t.cost ? 'disabled' : ''}>Buy ${money(t.cost)}</button>`}${t.consumable ? `<span class="muted small">${st.left(t.id)} left</span>` : ''}</div></div>`;
      }).join('')}</div>
      ${st.has('tables') ? tablesHTML() : ''}</div>`;
    root.querySelector('.firm').onclick = () => {
      const n = prompt('Firm name', firm());
      if (n != null) { Store.settings.firmName = n.trim().slice(0, 60) || null; Store.save(); board(root); }
    };
    root.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => {
      const t = C.TOOLS.find(x => x.id === b.dataset.buy);
      if (C.state(Store.data).cash < t.cost) return;
      record('buy-' + t.id + '-' + Date.now(), { tool: t.id, cost: t.cost });
      Store.save();
      Hud.toast('Bought ' + t.name, t.desc);
      board(root);
    });
  }

  function toolsHTML(st) {
    return (st.has('calc') ? `<div class="calc"><input placeholder="Calculator, e.g. 1200*25^(ln(0.85)/ln(2))" aria-label="Calculator"><output></output></div>` : '')
      + (st.has('tables') ? `<details class="ref"><summary>Reference tables</summary>${tablesHTML()}</details>` : '');
  }
  function wireCalc(root) {
    const inp = root.querySelector('.calc input');
    if (!inp) return;
    const out = root.querySelector('.calc output');
    inp.oninput = () => { try { out.textContent = '= ' + +C.calc(inp.value).toPrecision(10); } catch (e) { out.textContent = inp.value ? '…' : ''; } };
  }
  function tablesHTML() {
    const rates = [0.03, 0.05, 0.07, 0.1], yrs = [1, 2, 3, 4, 5, 10];
    const slopes = [0.75, 0.8, 0.85, 0.9, 0.95];
    return `<div class="ref-tables">
      <table class="ptable"><tr><th>Year</th>${rates.map(r => `<th>${r * 100}%</th>`).join('')}</tr>${yrs.map(n => `<tr><td>${n}</td>${rates.map(r => `<td>${(1 / Math.pow(1 + r, n)).toFixed(4)}</td>`).join('')}</tr>`).join('')}</table>
      <table class="ptable"><tr><th>Slope</th><th>b</th><th>b+1</th></tr>${slopes.map(s => { const b = Math.log(s) / Math.log(2); return `<tr><td>${s * 100}%</td><td>${b.toFixed(4)}</td><td>${(b + 1).toFixed(4)}</td></tr>`; }).join('')}</table>
      <table class="ptable"><tr><th>Confidence</th><th>z</th></tr>${[[50, 0], [70, 0.5244], [80, 0.8416], [90, 1.2816], [95, 1.6449]].map(([p, z]) => `<tr><td>${p}%</td><td>${z}</td></tr>`).join('')}</table></div>`;
  }

  function answerInputs(answers) {
    return `<div class="answers">${answers.map((a, i) => `<label class="ans"><span>${esc(a.label)}</span><input inputmode="decimal" data-i="${i}" autocomplete="off"><em>${esc(a.unit)}</em><i class="ans-fb"></i></label>`).join('')}</div>`;
  }
  const BAND = x => x === 1 ? ['good', 'Within 1%'] : x === 0.6 ? ['mid', 'Within 5%'] : x === 0.2 ? ['mid', 'Within 10%'] : ['bad', 'Off by more than 10%'];
  const fmtAns = v => (+v.toPrecision(6)).toLocaleString('en-US', { maximumFractionDigits: 4 });

  function job(root, slot) {
    const cat = Hud.catalog(), st = C.state(Store.data);
    const o = C.offers(Store.profile, Store.data, cat, ShopTemplates).find(x => x.slot === slot);
    if (!o) { location.hash = '#/shop'; return; }
    const [m, s] = o.tpl.section.split('/');
    root.innerHTML = `<div class="shop job"><a href="#/shop" class="muted small">&larr; Contract board</a>
      <div class="offer-top"><span class="muted">${esc(modName(o.tpl.module))}</span>${stars(o.tier)}</div>
      <h1>${esc(o.tpl.title)}</h1>
      <div class="brief">${Render.md(o.job.brief)}</div>
      ${answerInputs(o.job.answers)}
      ${toolsHTML(st)}
      <div class="row-btns"><button class="btn" id="submit">Submit estimate</button>
        ${st.left('opinion') > 0 ? `<button class="btn ghost" id="opinion">Second opinion (${st.left('opinion')} left)</button>` : ''}</div>
      <div class="result" hidden></div></div>`;
    wireCalc(root);
    const inputs = [...root.querySelectorAll('.ans input')];
    inputs[0].focus();
    const op = root.querySelector('#opinion');
    if (op) op.onclick = () => {
      record('use-opinion-' + Date.now(), { use: 'opinion' });
      Store.save();
      inputs.forEach((inp, i) => { const ok = C.answerScore(inp.value, o.job.answers[i].value) >= 0.6; inp.parentElement.querySelector('.ans-fb').textContent = ok ? 'Looks right' : 'Recheck this'; inp.parentElement.className = 'ans ' + (ok ? 'good' : 'bad'); });
      op.remove();
    };
    root.querySelector('#submit').onclick = () => {
      if (inputs.some(i => !i.value.trim()) && !confirm('Some answers are blank. Submit anyway?')) return;
      const given = inputs.map(i => i.value.trim());
      const g = C.grade(given, o.job.answers, C.BASE[o.tier]);
      record('c-' + st.completed + '-' + o.seed, { tpl: o.tpl.id, tier: o.tier, seed: o.seed, given, score: g.score, pay: g.pay, rep: g.rep });
      Store.markActive();
      Store.save();
      showResult(root, o.job, g, `#/learn/${m}/${s}`);
    };
  }

  function showResult(root, jb, g, lessonHref) {
    root.querySelectorAll('.ans input').forEach((inp, i) => {
      const [cls, txt] = BAND(g.each[i]);
      inp.disabled = true;
      inp.parentElement.className = 'ans ' + cls;
      inp.parentElement.querySelector('.ans-fb').textContent = `${txt} · answer ${fmtAns(jb.answers[i].value)}`;
    });
    root.querySelectorAll('#submit, #opinion').forEach(b => b.remove());
    const res = root.querySelector('.result');
    res.hidden = false;
    res.innerHTML = `<div class="result-head ${g.pay >= 0 ? 'good' : 'bad'}"><b>${g.pay >= 0 ? 'Paid' : 'Loss'} ${money(g.pay)}</b><span>Reputation ${g.rep > 0 ? '+' : ''}${g.rep}</span></div>
      <h3>Show work</h3><div class="explain">${Render.md(jb.explain)}</div>
      <div class="row-btns"><a class="btn" href="#/shop">Back to the board</a><a class="btn ghost" href="${lessonHref}">Review the lesson</a></div>`;
  }

  function campaign(root, id) {
    const c = ShopCampaign.find(x => x.id === id), st = C.state(Store.data);
    if (!c || st.repLevel < c.rep) { location.hash = '#/shop'; return; }
    const all = c.steps.flatMap(s => s.answers);
    let step = 0; const given = [];
    root.innerHTML = `<div class="shop job"><a href="#/shop" class="muted small">&larr; Contract board</a>
      <h1>${esc(c.title)}</h1><div class="brief">${Render.md(c.story)}</div>${toolsHTML(st)}<div class="steps"></div></div>`;
    wireCalc(root);
    const host = root.querySelector('.steps');
    function showStep() {
      const s = c.steps[step], box = document.createElement('div');
      box.className = 'camp-step';
      box.innerHTML = `<h3>Step ${step + 1} of ${c.steps.length}</h3><div class="brief">${Render.md(s.prompt)}</div>${answerInputs(s.answers)}<div class="row-btns"><button class="btn">Submit step</button></div><div class="explain" hidden></div>`;
      host.appendChild(box);
      const inputs = [...box.querySelectorAll('input')];
      inputs[0].focus();
      box.querySelector('.btn').onclick = () => {
        inputs.forEach((inp, i) => {
          const x = C.answerScore(inp.value, s.answers[i].value), [cls, txt] = BAND(x);
          given.push(inp.value.trim()); inp.disabled = true; inp.parentElement.className = 'ans ' + cls;
          inp.parentElement.querySelector('.ans-fb').textContent = `${txt} · answer ${fmtAns(s.answers[i].value)}`;
        });
        box.querySelector('.row-btns').remove();
        const ex = box.querySelector('.explain'); ex.hidden = false; ex.innerHTML = Render.md(s.explain);
        step++;
        if (step < c.steps.length) showStep(); else finish();
      };
    }
    function finish() {
      const g = C.grade(given, all, C.CAMPAIGN_BASE), rep = g.score >= 0.6 ? 2 : 0;
      record('k-' + c.id + '-' + Date.now(), { camp: c.id, given, score: g.score, pay: g.pay, rep });
      Store.markActive();
      Store.save();
      const res = document.createElement('div');
      res.className = 'result';
      res.innerHTML = `<div class="result-head ${g.score >= 0.6 ? 'good' : 'bad'}"><b>${g.score >= 0.6 ? 'Campaign complete' : 'Not good enough yet'}: ${money(g.pay)}</b><span>Reputation +${rep}</span></div>
        <p class="muted">${g.score >= 0.6 ? 'The customer signed.' : 'Score at least 60% to complete this campaign. You can try again.'}</p>
        <div class="row-btns"><a class="btn" href="#/shop">Back to the board</a></div>`;
      host.appendChild(res);
    }
    showStep();
  }
  return { route };
})();
```

- [ ] **Step 2: Wire it up**
  - index.html: add `<a href="#/shop" data-tab="shop">Shop</a>` after the Flashcards link; add scripts after `js/achievements.js`: `js/shop/core.js`, `js/shop/templates.js`, `js/shop/campaign.js`; add `<script src="js/shop/ui.js"></script>` before `js/leaderboard.js`.
  - js/app.js `render()`: add `else if (tab === 'shop') Shop.route(root, parts.slice(1));`.

- [ ] **Step 3: Styles** — append to css/styles.css:

```css
/* shop */
.shop { max-width: 980px; margin: 0 auto; padding: 24px; }
.shop-head { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 16px; align-items: flex-end; }
.firm { margin: 2px 0 0; cursor: pointer; }
.firm:hover { text-decoration: underline dotted; }
.shop-kpis { display: flex; flex-wrap: wrap; gap: 12px; }
.shop-kpis .kpi { min-width: 150px; }
.neg { color: var(--bad); }
.offers, .camps, .tools { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
.offer, .camp, .tool { display: flex; flex-direction: column; gap: 6px; padding: 14px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--paper); color: var(--ink); text-decoration: none; }
a.offer:hover, a.camp:hover { border-color: var(--accent); box-shadow: var(--shadow); }
.offer-top { display: flex; justify-content: space-between; align-items: center; }
.tier { font-family: var(--serif); font-weight: 700; color: var(--c2); letter-spacing: 1px; }
.camp.done { border-color: var(--good); background: var(--good-soft); }
.camp.locked { opacity: .5; }
.tool-foot { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
.job { max-width: 760px; }
.brief { background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius); padding: 14px 18px; margin: 12px 0; overflow-x: auto; }
.answers { display: flex; flex-direction: column; gap: 10px; margin: 14px 0; }
.ans { display: grid; grid-template-columns: minmax(140px, 1fr) 160px auto; gap: 4px 10px; align-items: center; }
.ans input { padding: 8px 10px; border: 1px solid var(--line-2); border-radius: 8px; background: var(--paper); color: var(--ink); font: inherit; }
.ans em { font-style: normal; color: var(--muted); font-size: .9rem; }
.ans-fb { grid-column: 1 / -1; font-style: normal; font-size: .85rem; }
.ans.good input { border-color: var(--good); background: var(--good-soft); } .ans.good .ans-fb { color: var(--good); }
.ans.mid input { border-color: var(--mid); background: var(--mid-soft); } .ans.mid .ans-fb { color: var(--mid); }
.ans.bad input { border-color: var(--bad); background: var(--bad-soft); } .ans.bad .ans-fb { color: var(--bad); }
.calc { display: flex; gap: 10px; align-items: center; margin: 10px 0; }
.calc input { flex: 1; padding: 8px 10px; border: 1px dashed var(--line-2); border-radius: 8px; background: transparent; color: var(--ink); font-family: ui-monospace, monospace; }
.calc output { font-family: ui-monospace, monospace; min-width: 120px; }
.ref summary { cursor: pointer; color: var(--accent); margin: 6px 0; }
.ref-tables { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start; margin: 10px 0 20px; }
.ref-tables .ptable { width: auto; font-size: .85rem; }
.result-head { display: flex; justify-content: space-between; padding: 12px 16px; border-radius: var(--radius); margin: 16px 0 8px; }
.result-head.good { background: var(--good-soft); color: var(--good); } .result-head.bad { background: var(--bad-soft); color: var(--bad); }
.camp-step { border-top: 1px solid var(--line); padding-top: 12px; margin-top: 12px; }
@media (max-width: 640px) { .shop { padding: 16px; } .ans { grid-template-columns: 1fr auto; } .ans span { grid-column: 1 / -1; } }
```

- [ ] **Step 4: Manual verification** — serve on 8790, open `#/shop` with a new profile. Expected: three offers from M5/M6, locked list naming other modules, campaign "Program Alpha" available, tools with Buy disabled (cash 0). Open an offer, enter the value shown in the Show work after a deliberate wrong submit on another offer, confirm pay, reputation, +XP float and board refresh. Stop the server by PID.

- [ ] **Step 5: Commit**

```bash
git add js index.html css
git commit -m "feat: estimating shop UI with tools and campaign"
```

---

### Task 10: End-to-end checks and packaging

**Files:**
- Modify: scratchpad smoke tests (`smoke.js`), new scratchpad `game-e2e.js`; rebuild `dist/pcea-study-lab.zip`

- [ ] **Step 1:** Run the existing browser smoke (`node smoke.js` in the scratchpad) — expected: no PROBLEMS, no ERRORS (every section still renders).
- [ ] **Step 2:** Write `game-e2e.js` (playwright-core + Edge, server on a temp `PCEA_PROFILES`): create profile, grade 5 cards → HUD shows XP 50 and streak 1; finish one section → "Kickoff Meeting" toast; open `#/shop`, complete one offer using its correct answers read from `ShopCore.offers(...)` in page context → cash > 0, record in `profiles/<name>.json`; buy nothing when broke; campaign alpha with correct answers → completed; toggle leaderboard → `/api/leaderboard` lists the profile; no page errors.
- [ ] **Step 3:** `npm test` and `npm run validate` green.
- [ ] **Step 4:** Rebuild the zip (include `js/shop/`, exclude `tests/`, `docs/`, `tools/`, `profiles/`, guide .md), unzip to temp, run `start.sh --no-open`, confirm `/api/ping` and `/api/leaderboard` respond.
- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "test: end-to-end gamification checks"
```
