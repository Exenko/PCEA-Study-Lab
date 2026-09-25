# Quests and Chests Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Three seeded daily quests, one weekly quest and a bonus, paid out in chests (shop cash, free hints/rerolls, streak leave days, CSS cosmetics). XP and rank never change.

**Architecture:** Quest state is derived from existing timestamps (`cards.last`, new `cards.pdue`, new `checks.at`, `sections.at`, shop `tpl`/`evt`/`evtdone` records, `days`). Claims are immutable `chest-<questKey>` records in `Store.data.shop` holding their rolls. Pure `js/chests.js` (`Chests`) rolls and reads chest effects; pure `js/quests.js` (`Quests`) draws, measures and claims. `ShopCore.state()` and `Game.streak` read chest effects; `js/rewards.js` (`Rewards`) renders the quest panel, chest modal and cosmetics grid.

**Tech Stack:** Vanilla JS IIFEs (`module.exports` in Node, globals in the browser), Node `assert` tests via `tests/run.js`, plain CSS with tokens from `css/styles.css`.

**Spec:** `docs/superpowers/specs/2026-09-25-quests-chests-design.md`

**Deviations and rulings (decided while planning):**
- **Chest records live in `Store.data.shop`.** It is already a merged-per-record part (`PARTS` in `storage.js` and `server.js`), so two devices claiming the same key merge to one record with no storage or server change. A new part would need edits to both merge implementations. Chest records carry only `{ chest, quest, rolls, t, module? }` -- never `tpl`, `camp`, `tool`, `use`, `collect`, `evtdone` or `upg` -- so `ShopCore.state()` ignores them except through `Chests.cash` / `Chests.toolGrants`, and XP, reputation, `completed` and the `tools` achievement are untouched.
- **No rank scaling of targets.** Rank at day start is not derivable, so each target is uniform in its range, seeded by `hash(profile|day)`.
- **Overdue module is derived, not stored before claim.** A card was "overdue at day start" when it is seen and `(last >= dayStart ? pdue : due) < dayStart`. The module with the most such cards wins; ties go to the lower module id. Progress = cards in that module with `last` in the day and `pdue < dayStart`. `Scheduler.grade` writes `pdue` only on the first grade of a local day (so it holds the due time as of day start), and `pdue = null` for a card never seen before. The claim record stores `module` for display.
- **Event quest rule:** drawable only when some `evt` record has `at < dayStart` and no `evtdone` pointing at it has `t < dayStart`. Both sides are before the day starts, so the answer cannot flip during the day (only a late cross-device merge of old records could change it).
- **Leave rolls** convert to cash when the effective leave count at claim time (`Game.streak(days, now, grants).leave`, grants included) is already 2, or reaches 2 earlier in the same chest. The rolls are stored, so it never changes afterwards.
- **Leave grants apply at the end of the local day of the chest's `t`** during the streak walk, capped at 2. A grant earned while the streak is 0 is lost when the next missed day resets leave, same as earned leave.
- **Signatures gain a `ctx` / `opts` argument** the spec omitted: `Quests.today(d, now, ctx)` etc. with `ctx = { profile, catalog }` (the seed needs the profile, overdue needs module card lists), and `Chests.roll(d, chestKey, tier, opts)` with `opts = { profile, leave }`.
- **Extra pure helpers:** `Quests.badge`, `Quests.resetIn`, `Chests.equipped`, `Game.leaveGrants`.
- **Equipped cosmetics** are stored as ids in `settings.cosmetics = { title, flame, desk }`; `Chests.equipped(d)` ignores ids the profile does not own. No `storage.js` default is added (undefined reads as nothing equipped).
- **Labels use the module id** (`Clear 6 overdue cards in M07`); `Hud.catalog()` has no titles.

## Global Constraints

- Day key `YYYY-MM-DD` local (reuse `Game.dayKey`); week key ISO `YYYY-Www`, Monday start.
- Daily draw: 3 distinct types seeded by `ShopCore.hash(profile.toLowerCase() + '|' + day)`; weekly by `hash(profile|week)`.
- Targets: cards 15-30, overdue 5-10, checks 3-6, section 1, solve 1-3, exact 1, event 1. Weekly: days 5, master 30 (lvl >= 4), solve10 10.
- Quest keys: `d-<day>-<i>`, `b-<day>`, `w-<week>`. Chest keys: `chest-` + quest key. Record `{ chest: tier, quest, rolls: [{ kind, amount?, tool?, cos? }], t, module? }`.
- Tiers: small 1 roll, bonus 2 rolls, big 3 rolls with a guaranteed cosmetic while any is locked.
- Roll `i` seeded by `hash(profile|chestKey|i)`: cash 60% ($20-60 small/bonus, $40-120 big), consumable 25% (hint or reroll), leave 5%, cosmetic 10%. Full leave and fully owned cosmetics become cash.
- Cosmetics: titles Bean Counter, Learning Curve Surfer, EVM Whisperer, Monte Carlo Kid, Basis-of-Estimate Bard, Escalation Artist, Risk Wrangler, Cost Sage; flames blue, green, purple, gold; desks blueprint, ledger, terminal, brass.
- Chests never give XP; rank, reputation and completed-jobs count unchanged.
- Checks answered before this ships have no `at` and never count.
- UI: CSS tokens only, dark mode through tokens, phone and desktop, no horizontal page scroll, reduced motion disables the chest animation.
- Tests: `npm test` runs all (135 pass before this plan); `node tests/run.js <substring>` runs matching files.
- Windows + Git Bash; use `python`, not `python3`, if ever needed.
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. `git add` only the files named in the task.

## Review Focus

1. **A card graded twice in one day** (e.g. missed, then relearned) must keep counting toward the overdue quest; the second grade must not overwrite `pdue`. Test: Task 1 "pdue kept on second grade today".
2. **A brand-new card studied today** is not overdue and must not count toward or select the overdue module. Test: Task 3 "new cards are never overdue".
3. **A Progress page left open past midnight**: clicking yesterday's Claim must do nothing (quest expired). Test: Task 3 "expired and unfinished quests cannot be claimed".
4. **Claim double-click or two devices claiming the same quest** must give one chest's rewards. Test: Task 3 "claim twice and merge count once".
5. **Chest rewards leaking into jobs/tools/XP**: a chest must not raise `completed`, reputation, XP or the "Tooled Up" achievement. Test: Task 2 "chest records are not jobs, purchases or XP".

---

### Task 1: `pdue` on grade and `at` on checks

**Files:**
- Modify: `js/scheduler.js:20-22` (`grade`)
- Modify: `js/render.js:95-96` (`record`)
- Test: `tests/scheduler.test.js` (create)

**Interfaces:**
- Consumes: nothing new.
- Produces: card field `pdue` (number, or `null` for a card first seen by this grade), written only on the first grade of a local day. Check field `at` (ms) set when a check record is first created.

- [ ] **Step 1: Write the failing test**

Create `tests/scheduler.test.js`:

```js
const assert = require('assert');
const fs = require('fs'), path = require('path'), vm = require('vm');
const DAY = 864e5;
function load(cards) {
  const Store = { data: { cards }, settings: { hitsToLevel: 2 }, markActive() {}, save() {} };
  const ctx = { Store, Date, Math };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js/scheduler.js'), 'utf8') + '\nthis.Scheduler = Scheduler;', ctx);
  return ctx.Scheduler;
}
const startOfToday = () => { const t = new Date(); t.setHours(0, 0, 0, 0); return t.getTime(); };

module.exports = [
  ['grade stores the prior due as pdue on the first grade of the day', () => {
    const due = startOfToday() - 1.5 * DAY;
    const cards = { a: { lvl: 1, hits: 0, seen: 3, right: 2, wrong: 1, due, last: startOfToday() - 3 * DAY } };
    load(cards).grade('a', 2);
    assert.strictEqual(cards.a.pdue, due);
    assert.ok(cards.a.due > due);
  }],
  ['pdue kept on second grade today', () => {
    const due = startOfToday() - 1.5 * DAY;
    const cards = { a: { lvl: 1, hits: 0, seen: 3, right: 2, wrong: 1, due, last: startOfToday() - 3 * DAY } };
    const S = load(cards);
    S.grade('a', 0);
    S.grade('a', 2);
    assert.strictEqual(cards.a.pdue, due);
  }],
  ['a card first seen today gets pdue null', () => {
    const cards = {};
    load(cards).grade('n', 2);
    assert.strictEqual(cards.n.pdue, null);
  }]
];
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/run.js scheduler`
Expected: FAIL on all three (`pdue` is `undefined`).

- [ ] **Step 3: Implement `pdue` in `Scheduler.grade`**

In `js/scheduler.js`, replace:

```js
    const s = ensure(id), now = Date.now();
    s.seen++; s.last = now;
```

with:

```js
    const s = ensure(id), now = Date.now();
    const d0 = new Date(now); d0.setHours(0, 0, 0, 0);
    // Quests count cards that were overdue at day start, so keep the due time as it stood before today's first grade.
    if (!(s.last >= d0.getTime())) s.pdue = s.seen ? s.due : null;
    s.seen++; s.last = now;
```

- [ ] **Step 4: Record `at` on checks**

In `js/render.js`, replace:

```js
    if (!Store.data.checks[id]) Store.data.checks[id] = Object.assign({ first }, extra);
```

with:

```js
    if (!Store.data.checks[id]) Store.data.checks[id] = Object.assign({ first }, extra, { at: Date.now() });
```

- [ ] **Step 5: Run tests**

Run: `node tests/run.js scheduler` -> 3 passed. Then `npm test` -> 138 passed, 0 failed.

- [ ] **Step 6: Manual check of `at`**

Open `index.html`, answer one lesson check, then in the console: `Object.values(Store.data.checks).filter(c => c.at).length` -> at least 1.

- [ ] **Step 7: Commit**

```bash
git add js/scheduler.js js/render.js tests/scheduler.test.js
git commit -m "feat: store pdue on first daily grade and at on lesson checks

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Chests core, streak leave grants, shop cash and tools

**Files:**
- Create: `js/chests.js`
- Modify: `js/game.js` (`streak`, `compute`, new `leaveGrants`, export)
- Modify: `js/shop/core.js:320-339` (`state`)
- Modify: `index.html` (script tag after `js/shop/events.js`)
- Test: `tests/chests.test.js` (create), `tests/game.test.js` (append), `tests/shop.test.js` (append)

**Interfaces:**
- Consumes: `ShopCore.rng(seed)`, `ShopCore.hash(str)`, `Game.streak`, `Game.dayKey`.
- Produces:
  - `Game.leaveGrants(d) -> number[]` sorted `t` of every leave roll in chest records.
  - `Game.streak(days, now, grants?)` where `grants` is an array of ms timestamps.
  - `Chests.TABLE`, `Chests.COSMETICS` (`[{ id, kind: 'title'|'flame'|'desk', name, value }]`), `Chests.CONSUMABLES = ['hint', 'reroll']`
  - `Chests.roll(d, chestKey, tier, { profile, leave }) -> [{ kind, amount?, tool?, cos? }]`
  - `Chests.owned(d) -> Set<cosmeticId>`, `Chests.cash(d) -> number`, `Chests.toolGrants(d) -> { hint?: n, reroll?: n }`, `Chests.leaveGrants(d) -> number[]`
  - `Chests.equipped(d) -> { title, flame, desk }` each a COSMETICS entry or `null`.
  - `ShopCore.state(d).cash` includes chest cash; `owned`/`left` include tool grants.

- [ ] **Step 1: Write the failing tests**

Create `tests/chests.test.js`:

```js
const assert = require('assert');
const X = require('../js/chests.js');
const C = require('../js/shop/core.js');
const G = require('../js/game.js');
const opts = { profile: 'Ann', leave: 0 };
const allOwned = () => ({ shop: { 'chest-all': { chest: 'big', quest: 'all', rolls: X.COSMETICS.map(c => ({ kind: 'cosmetic', cos: c.id })), t: 1 } } });

module.exports = [
  ['cosmetics catalog has 8 titles, 4 flames, 4 desks with unique ids', () => {
    const by = k => X.COSMETICS.filter(c => c.kind === k).length;
    assert.strictEqual(by('title'), 8); assert.strictEqual(by('flame'), 4); assert.strictEqual(by('desk'), 4);
    assert.strictEqual(new Set(X.COSMETICS.map(c => c.id)).size, 16);
    assert.ok(X.COSMETICS.some(c => c.id === 'title-basis-of-estimate-bard' && c.name === 'Basis-of-Estimate Bard'));
    assert.ok(X.COSMETICS.some(c => c.id === 'desk-brass' && c.value === 'brass'));
  }],
  ['rolls are deterministic and sized by tier', () => {
    assert.deepStrictEqual(X.roll({}, 'chest-d-2026-09-25-0', 'small', opts), X.roll({}, 'chest-d-2026-09-25-0', 'small', opts));
    assert.strictEqual(X.roll({}, 'k', 'small', opts).length, 1);
    assert.strictEqual(X.roll({}, 'k', 'bonus', opts).length, 2);
    assert.strictEqual(X.roll({}, 'k', 'big', opts).length, 3);
    assert.deepStrictEqual(X.roll({}, 'k', 'nope', opts), []);
    const differs = Array.from({ length: 40 }, (_, i) => 'p' + i).some(p => JSON.stringify(X.roll({}, 'k', 'big', { profile: p })) !== JSON.stringify(X.roll({}, 'k', 'big', opts)));
    assert.ok(differs);
  }],
  ['cash amounts stay in range and every kind appears', () => {
    const kinds = new Set();
    for (let i = 0; i < 400; i++) {
      X.roll({}, 'chest-s' + i, 'small', opts).forEach(x => { kinds.add(x.kind); if (x.kind === 'cash') assert.ok(x.amount >= 20 && x.amount <= 60 && Number.isInteger(x.amount)); if (x.kind === 'consumable') assert.ok(X.CONSUMABLES.includes(x.tool)); });
      X.roll({}, 'chest-b' + i, 'big', opts).forEach(x => { if (x.kind === 'cash') assert.ok(x.amount >= 40 && x.amount <= 120); });
    }
    assert.deepStrictEqual([...kinds].sort(), ['cash', 'consumable', 'cosmetic', 'leave']);
  }],
  ['full leave turns a leave roll into cash', () => {
    let key = null;
    for (let i = 0; i < 2000 && !key; i++) if (X.roll({}, 'chest-L' + i, 'small', opts)[0].kind === 'leave') key = 'chest-L' + i;
    assert.ok(key, 'found a leave roll');
    const r = X.roll({}, key, 'small', { profile: 'Ann', leave: 2 });
    assert.strictEqual(r[0].kind, 'cash');
  }],
  ['fully owned cosmetics turn into cash; big chest guarantees one otherwise', () => {
    const own = allOwned();
    for (let i = 0; i < 200; i++) {
      assert.ok(!X.roll(own, 'chest-o' + i, 'big', opts).some(x => x.kind === 'cosmetic'));
      const big = X.roll({}, 'chest-o' + i, 'big', opts).filter(x => x.kind === 'cosmetic');
      assert.ok(big.length >= 1);
      assert.strictEqual(new Set(big.map(x => x.cos)).size, big.length);
    }
  }],
  ['cosmetic rolls only pick locked items', () => {
    const d = { shop: { 'chest-x': { chest: 'big', quest: 'x', rolls: X.COSMETICS.slice(1).map(c => ({ kind: 'cosmetic', cos: c.id })), t: 1 } } };
    for (let i = 0; i < 50; i++) X.roll(d, 'chest-y' + i, 'big', opts).filter(x => x.kind === 'cosmetic').forEach(x => assert.strictEqual(x.cos, X.COSMETICS[0].id));
  }],
  ['cash, tool grants, owned and leave grants read chest records only', () => {
    const d = { shop: {
      a: { chest: 'small', quest: 'd-x-0', rolls: [{ kind: 'cash', amount: 40 }], t: 10 },
      b: { chest: 'bonus', quest: 'b-x', rolls: [{ kind: 'consumable', tool: 'hint' }, { kind: 'leave' }], t: 20 },
      c: { chest: 'big', quest: 'w-x', rolls: [{ kind: 'cosmetic', cos: 'flame-gold' }, { kind: 'consumable', tool: 'reroll' }, { kind: 'cash', amount: 55.5 }], t: 30 },
      j: { tpl: 'lc-unit', pay: 60, rolls: [{ kind: 'cash', amount: 999 }], t: 5 } } };
    assert.strictEqual(X.cash(d), 95.5);
    assert.deepStrictEqual(X.toolGrants(d), { hint: 1, reroll: 1 });
    assert.deepStrictEqual([...X.owned(d)], ['flame-gold']);
    assert.deepStrictEqual(X.leaveGrants(d), [20]);
  }],
  ['equipped ignores items not owned', () => {
    const d = allOwned();
    d.settings = { cosmetics: { title: 'title-cost-sage', flame: 'flame-blue', desk: 'desk-nope' } };
    const e = X.equipped(d);
    assert.strictEqual(e.title.name, 'Cost Sage'); assert.strictEqual(e.flame.value, 'blue'); assert.strictEqual(e.desk, null);
    assert.deepStrictEqual(X.equipped({ settings: { cosmetics: { title: 'title-cost-sage' } } }), { title: null, flame: null, desk: null });
    assert.deepStrictEqual(X.equipped({}), { title: null, flame: null, desk: null });
  }],
  ['chest records are not jobs, purchases or XP', () => {
    const base = { shop: { j: { tpl: 'lc-unit', pay: 60, rep: 1, score: 1, t: 1 } } };
    const withChest = { shop: Object.assign({}, base.shop, { 'chest-d-x-0': { chest: 'small', quest: 'd-x-0', rolls: [{ kind: 'consumable', tool: 'hint' }, { kind: 'cash', amount: 30 }], t: 2 } }) };
    const s0 = C.state(base), s1 = C.state(withChest);
    assert.strictEqual(s1.completed, s0.completed); assert.strictEqual(s1.rep, s0.rep);
    assert.deepStrictEqual(G.xpBreakdown(withChest), G.xpBreakdown(base));
    const A = require('../js/achievements.js');
    const g = G.compute(withChest, { modules: [] });
    assert.strictEqual(A.stats(withChest, g, { modules: [] }).tools, 0);
  }]
];
```

Append to the array in `tests/game.test.js` (before the closing `];`, after the last entry, adding a comma after the previous `]`):

```js
  ['streak: a chest leave grant covers a missed day', () => {
    const ks = days('2026-03-01', '2026-03-02', '2026-03-03', '2026-03-05');
    assert.strictEqual(Game.streak(ks, day('2026-03-05')).current, 1);
    assert.strictEqual(Game.streak(ks, day('2026-03-05'), [day('2026-03-02')]).current, 4);
  }],
  ['streak: grants stay capped at 2 leave days', () => {
    const ks = []; for (let i = 1; i <= 7; i++) ks.push('2026-03-0' + i);
    const g = [day('2026-03-01'), day('2026-03-02'), day('2026-03-03')];
    assert.strictEqual(Game.streak(days(...ks), day('2026-03-07'), g).leave, 2);
    assert.strictEqual(Game.streak(days(...ks), day('2026-03-07')).leave, 1);
  }],
  ['compute counts chest leave rolls; XP ignores chests', () => {
    const d = { days: days('2026-03-01', '2026-03-03'), shop: { 'chest-b-2026-03-01': { chest: 'bonus', quest: 'b-2026-03-01', rolls: [{ kind: 'leave' }, { kind: 'cash', amount: 50 }], t: day('2026-03-01') } } };
    assert.deepStrictEqual(Game.leaveGrants(d), [day('2026-03-01')]);
    assert.strictEqual(Game.compute(d, { modules: [] }, day('2026-03-03')).streak.current, 2);
    assert.strictEqual(Game.xpBreakdown(d).total, 0);
  }]
```

Append to the array in `tests/shop.test.js`:

```js
  ['state adds chest cash and free tool uses', () => {
    const d = { shop: {
      a: { tpl: 'x', pay: 60, rep: 1, score: 1, t: 1 },
      b: { chest: 'small', quest: 'd-x-0', rolls: [{ kind: 'cash', amount: 40 }], t: 2 },
      c: { chest: 'bonus', quest: 'b-x', rolls: [{ kind: 'consumable', tool: 'hint' }, { kind: 'consumable', tool: 'hint' }], t: 3 },
      u: { use: 'hint', t: 4 } } };
    const s = C.state(d);
    assert.strictEqual(s.cash, 100);
    assert.strictEqual(s.left('hint'), 1);
    assert.ok(s.has('hint'));
    assert.strictEqual(s.completed, 1);
  }]
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node tests/run.js chests` -> FAIL "Cannot find module '../js/chests.js'".
Run: `node tests/run.js game` -> the three new tests FAIL (`Game.leaveGrants is not a function`, current 1 instead of 4).
Run: `node tests/run.js shop` -> new test FAIL (cash 60).

- [ ] **Step 3: Add leave grants to `js/game.js`**

After the `const vals = ...` line add:

```js
  // Leave-day rolls from quest chests, as the claim times of their chests.
  const leaveGrants = d => vals(d && d.shop).filter(r => typeof r.chest === 'string' && Array.isArray(r.rolls) && Number.isFinite(r.t))
    .flatMap(r => r.rolls.filter(x => x && x.kind === 'leave').map(() => r.t)).sort((a, b) => a - b);
```

Replace the whole `streak` function with:

```js
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
```

In `compute`, replace `streak: streak(d.days, now || Date.now())` with `streak: streak(d.days, now || Date.now(), leaveGrants(d))`.

Replace the export line with:

```js
  const Game = { RANKS, CERTIFIED, dayKey, cardXP, xpBreakdown, moduleLevels, rank, streak, leaveGrants, compute };
```

- [ ] **Step 4: Create `js/chests.js`**

```js
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
```

- [ ] **Step 5: Add chest effects to `ShopCore.state`**

In `js/shop/core.js`, directly above `function state(d) {` add:

```js
  // Resolved at call time: chests.js requires this file, so a load-time require would be circular.
  const chestsMod = () => (typeof module !== 'undefined' && module.exports ? require('../chests.js') : root.Chests);
```

In `state`, replace:

```js
    const repLevel = Math.floor(Math.sqrt(rep));
```

with:

```js
    const X = chestsMod();
    if (X) {
      cash += X.cash(d);
      const g = X.toolGrants(d);
      for (const k in g) owned[k] = (owned[k] || 0) + g[k];
    }
    const repLevel = Math.floor(Math.sqrt(rep));
```

- [ ] **Step 6: Load `js/chests.js` in the browser**

In `index.html`, after `<script src="js/shop/events.js"></script>` add:

```html
<script src="js/chests.js"></script>
```

- [ ] **Step 7: Run tests**

Run: `node tests/run.js chests`, `node tests/run.js game`, `node tests/run.js shop` -> all PASS. Then `npm test` -> 151 passed, 0 failed.

- [ ] **Step 8: Commit**

```bash
git add js/chests.js js/game.js js/shop/core.js index.html tests/chests.test.js tests/game.test.js tests/shop.test.js
git commit -m "feat: chest rolls with cash, tool, leave and cosmetic effects

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Quests core

**Files:**
- Create: `js/quests.js`
- Modify: `index.html` (script tag after `js/chests.js`)
- Test: `tests/quests.test.js` (create)

**Interfaces:**
- Consumes: `ShopCore.rng`, `ShopCore.hash`, `Game.dayKey`, `Game.streak`, `Game.leaveGrants`, `Chests.roll(d, chestKey, tier, { profile, leave })`; card fields `last`, `due`, `pdue`, `seen`, `lvl`; check `at`; section `done`, `at`.
- Produces (`ctx = { profile: string, catalog: { modules: [{ id, cards: string[] }] } }`):
  - `Quests.dayKey(now)`, `Quests.weekKey(now) -> 'YYYY-Www'`, `Quests.dayStart(now)`, `Quests.dayEnd(now)`, `Quests.weekStart(now)`, `Quests.weekEnd(now)`
  - `Quests.TYPES`, `Quests.WEEKLY`, `Quests.overdueModule(d, dayStart, catalog) -> moduleId|null`, `Quests.eventOpenAt(d, dayStart) -> bool`
  - `Quests.today(d, now, ctx) -> [{ id, key, label, target, progress, done, claimed, module }]` (3 items, keys `d-<day>-<i>`)
  - `Quests.weekly(d, now, ctx)` same shape, key `w-<week>`
  - `Quests.bonus(d, now, ctx) -> { key: 'b-<day>', ready, claimed }`
  - `Quests.claim(d, key, now, ctx) -> { key: 'chest-' + key, rec } | null`
  - `Quests.badge(d, now, ctx) -> { done, total, claimable }`
  - `Quests.resetIn(now) -> { day: ms, week: ms }`

- [ ] **Step 1: Write the failing tests**

Create `tests/quests.test.js`:

```js
const assert = require('assert');
const Q = require('../js/quests.js');
const C = require('../js/shop/core.js');
const loadStore = require('./fixtures/load-store.js');

const NOW = new Date(2026, 8, 25, 15, 0, 0).getTime();   // Fri 2026-09-25 15:00 local
const S = new Date(2026, 8, 25).getTime();
const ids = Array.from({ length: 30 }, (_, i) => 'c' + i);
const cat = { modules: [{ id: 'm01', cards: ids, sections: [] }, { id: 'm02', cards: ['x1', 'x2'], sections: [] }] };
const ctx = p => ({ profile: p, catalog: cat });
const profiles = n => Array.from({ length: n }, (_, i) => 'p' + i);
const empty = () => ({ cards: {}, checks: {}, sections: {}, days: {}, shop: {}, settings: {} });
// Every quest type (daily and weekly) is complete in this profile.
function full() {
  const d = empty();
  d.sections['m01/s1'] = { done: true, at: NOW - 1000 };
  ids.forEach(id => { d.cards[id] = { seen: 2, lvl: 4, right: 2, last: NOW - 1000, pdue: S - 1000, due: NOW + 1e9 }; });
  for (let i = 0; i < 6; i++) d.checks['k' + i] = { done: true, at: NOW - 1000 };
  for (let i = 0; i < 10; i++) d.shop['job' + i] = { tpl: 'lc-unit', pay: 10, score: 1, rep: 1, t: NOW - 1000 - i };
  d.shop['evt-lc-unit-1'] = { evt: 'lc-unit', kind: 'shock', module: 'm05', at: S - 5000, seed: 1, t: S - 5000 };
  d.shop['evtdone-lc-unit-1'] = { evtdone: 'evt-lc-unit-1', bonus: 5, t: NOW - 500 };
  ['2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24', '2026-09-25'].forEach(k => { d.days[k] = { a: 1 }; });
  return d;
}
const count = (id, d) => Q.TYPES[id].count(d, S, Q.dayEnd(NOW), 'm01', cat);

module.exports = [
  ['day and ISO week keys', () => {
    assert.strictEqual(Q.dayKey(NOW), '2026-09-25');
    assert.strictEqual(Q.weekKey(NOW), '2026-W39');
    assert.strictEqual(Q.weekKey(new Date(2026, 0, 1, 9).getTime()), '2026-W01');
    assert.strictEqual(Q.weekKey(new Date(2027, 0, 1, 9).getTime()), '2026-W53');
    assert.strictEqual(Q.weekKey(new Date(2024, 11, 30, 9).getTime()), '2025-W01');
    assert.strictEqual(Q.weekStart(NOW), new Date(2026, 8, 21).getTime());
    assert.strictEqual(Q.weekEnd(NOW), new Date(2026, 8, 28).getTime());
    assert.strictEqual(Q.dayEnd(NOW), new Date(2026, 8, 26).getTime());
  }],
  ['draw is deterministic per profile and day, three distinct types', () => {
    const d = full();
    const a = Q.today(d, NOW, ctx('Ann')), b = Q.today(d, NOW + 3600e3, ctx('ann'));
    assert.deepStrictEqual(a.map(q => [q.id, q.target, q.key]), b.map(q => [q.id, q.target, q.key]));
    assert.deepStrictEqual(a.map(q => q.key), ['d-2026-09-25-0', 'd-2026-09-25-1', 'd-2026-09-25-2']);
    const sigs = new Set();
    profiles(60).forEach(p => {
      const qs = Q.today(d, NOW, ctx(p));
      assert.strictEqual(qs.length, 3);
      assert.strictEqual(new Set(qs.map(q => q.id)).size, 3);
      qs.forEach(q => { const [lo, hi] = Q.TYPES[q.id].range; assert.ok(q.target >= lo && q.target <= hi, q.id); });
      sigs.add(qs.map(q => q.id + q.target).join());
    });
    assert.ok(sigs.size > 5);
  }],
  ['overdue falls back to cards when nothing is overdue', () => {
    profiles(60).forEach(p => {
      const qs = Q.today(empty(), NOW, ctx(p));
      assert.strictEqual(qs.length, 3);
      assert.ok(!qs.some(q => q.id === 'overdue'));
      assert.strictEqual(new Set(qs.map(q => q.id)).size, 3);
    });
  }],
  ['overdue module: most overdue cards at day start, ties by id', () => {
    const d = empty();
    d.cards.c0 = { seen: 1, due: S - 10, last: S - 100 };
    d.cards.x1 = { seen: 1, due: S - 10, last: S - 100 };
    assert.strictEqual(Q.overdueModule(d, S, cat), 'm01');
    d.cards.x2 = { seen: 1, due: NOW + 10, last: NOW - 10, pdue: S - 50 };
    assert.strictEqual(Q.overdueModule(d, S, cat), 'm02');
    d.cards.x2.pdue = S + 5;
    assert.strictEqual(Q.overdueModule(d, S, cat), 'm01');
    const got = profiles(80).map(p => Q.today(d, NOW, ctx(p)).find(q => q.id === 'overdue')).filter(Boolean);
    assert.ok(got.length > 0);
    got.forEach(q => { assert.strictEqual(q.module, 'm01'); assert.ok(q.label.endsWith(' in M01')); });
  }],
  ['new cards are never overdue', () => {
    const d = empty();
    d.cards.c0 = { seen: 1, due: NOW + 10, last: NOW - 10, pdue: null };
    d.cards.c1 = { seen: 0, due: 0, last: 0 };
    assert.strictEqual(Q.overdueModule(d, S, cat), null);
    assert.strictEqual(count('overdue', d), 0);
  }],
  ['event drawn only when an event was open at day start', () => {
    const drawn = d => profiles(80).some(p => Q.today(d, NOW, ctx(p)).some(q => q.id === 'event'));
    const d = empty();
    assert.strictEqual(drawn(d), false);
    d.shop.e = { evt: 'lc-unit', kind: 'shock', at: S - 10, t: S - 10 };
    assert.strictEqual(Q.eventOpenAt(d, S), true);
    assert.strictEqual(drawn(d), true);
    d.shop.done = { evtdone: 'e', bonus: 1, t: NOW - 10 };
    assert.strictEqual(Q.eventOpenAt(d, S), true);
    d.shop.done.t = S - 5;
    assert.strictEqual(drawn(d), false);
    const later = empty();
    later.shop.e = { evt: 'lc-unit', kind: 'shock', at: S + 10, t: S + 10 };
    assert.strictEqual(drawn(later), false);
  }],
  ['progress counts only records inside the day', () => {
    const d = empty(), y = S - 1000, t = NOW - 1000;
    d.cards = { a: { seen: 1, last: t }, b: { seen: 1, last: y }, c0: { seen: 2, last: t, pdue: S - 1 }, c1: { seen: 2, last: t, pdue: S + 1 }, c2: { seen: 2, last: y, pdue: y - 5 } };
    d.checks = { k1: { done: true, at: t }, k2: { done: true, at: y }, k3: { done: true } };
    d.sections = { s1: { done: true, at: t }, s2: { done: true, at: y }, s3: { at: t } };
    d.shop = { j1: { tpl: 'a', score: 1, t }, j2: { tpl: 'a', score: 0.6, t }, j3: { tpl: 'a', score: 1, t: y }, k: { camp: 'alpha', score: 1, t },
      e1: { evtdone: 'evt-a-1', t }, e2: { evtdone: 'evt-a-2', t: y }, ch: { chest: 'small', quest: 'q', rolls: [], t } };
    assert.strictEqual(count('cards', d), 3);
    assert.strictEqual(count('overdue', d), 1);
    assert.strictEqual(count('checks', d), 1);
    assert.strictEqual(count('section', d), 1);
    assert.strictEqual(count('solve', d), 2);
    assert.strictEqual(count('exact', d), 1);
    assert.strictEqual(count('event', d), 1);
  }],
  ['weekly: deterministic per week and counts inside the week', () => {
    const d = full();
    const w = Q.weekly(d, NOW, ctx('Ann'));
    assert.deepStrictEqual(Q.weekly(d, NOW - 3 * 864e5, ctx('Ann')).id, w.id);
    assert.strictEqual(w.key, 'w-2026-W39');
    assert.ok(w.done);
    const a = Q.weekStart(NOW), b = Q.weekEnd(NOW);
    const e = empty();
    e.days = { '2026-09-20': { a: 1 }, '2026-09-21': { a: 1 }, '2026-09-27': { a: 1 }, '2026-09-28': { a: 1 }, junk: {} };
    e.cards = { a: { lvl: 4, last: NOW }, b: { lvl: 3, last: NOW }, c: { lvl: 5, last: a - 1 } };
    e.shop = { j: { tpl: 'x', t: NOW }, k: { tpl: 'x', t: b } };
    assert.strictEqual(Q.WEEKLY.days.count(e, a, b), 2);
    assert.strictEqual(Q.WEEKLY.master.count(e, a, b), 1);
    assert.strictEqual(Q.WEEKLY.solve10.count(e, a, b), 1);
  }],
  ['claim writes a small chest once; bonus follows three claims', () => {
    const d = full(), c = ctx('Ann');
    const qs = Q.today(d, NOW, c);
    assert.ok(qs.every(q => q.done && !q.claimed));
    assert.deepStrictEqual(Q.bonus(d, NOW, c), { key: 'b-2026-09-25', ready: false, claimed: false });
    assert.strictEqual(Q.claim(d, 'b-2026-09-25', NOW, c), null);
    qs.forEach(q => {
      const res = Q.claim(d, q.key, NOW, c);
      assert.strictEqual(res.key, 'chest-' + q.key);
      assert.strictEqual(res.rec.chest, 'small'); assert.strictEqual(res.rec.quest, q.key); assert.strictEqual(res.rec.t, NOW);
      assert.strictEqual(res.rec.rolls.length, 1);
      if (q.id === 'overdue') assert.strictEqual(res.rec.module, 'm01'); else assert.ok(!('module' in res.rec));
      ['tpl', 'camp', 'tool', 'use'].forEach(f => assert.ok(!(f in res.rec)));
      d.shop[res.key] = res.rec;
      assert.strictEqual(Q.claim(d, q.key, NOW, c), null);
    });
    assert.ok(Q.today(d, NOW, c).every(q => q.claimed));
    assert.deepStrictEqual(Q.bonus(d, NOW, c), { key: 'b-2026-09-25', ready: true, claimed: false });
    const b = Q.claim(d, 'b-2026-09-25', NOW, c);
    assert.strictEqual(b.rec.chest, 'bonus'); assert.strictEqual(b.rec.rolls.length, 2);
    d.shop[b.key] = b.rec;
    assert.strictEqual(Q.bonus(d, NOW, c).claimed, true);
    const w = Q.claim(d, 'w-2026-W39', NOW, c);
    assert.strictEqual(w.rec.chest, 'big'); assert.strictEqual(w.rec.rolls.length, 3);
    assert.ok(w.rec.rolls.some(x => x.kind === 'cosmetic'));
  }],
  ['expired and unfinished quests cannot be claimed', () => {
    const c = ctx('Ann');
    assert.strictEqual(Q.claim(full(), 'd-2026-09-24-0', NOW, c), null);
    assert.strictEqual(Q.claim(full(), 'w-2026-W38', NOW, c), null);
    assert.strictEqual(Q.claim(full(), 'nonsense', NOW, c), null);
    const qs = Q.today(empty(), NOW, c);
    assert.ok(qs.every(q => !q.done));
    assert.strictEqual(Q.claim(empty(), qs[0].key, NOW, c), null);
  }],
  ['claim twice and merge count once', () => {
    const Store = loadStore();
    const d = full(), c = ctx('Ann'), key = Q.today(d, NOW, c)[0].key;
    const r1 = Q.claim(d, key, NOW, c), r2 = Q.claim(d, key, NOW + 60e3, c);
    const a = full(), b = full();
    a.shop[r1.key] = Object.assign({}, r1.rec, { mod: 1 });
    b.shop[r2.key] = Object.assign({}, r2.rec, { mod: 2 });
    const m = Store.merge(a, b);
    assert.strictEqual(Object.keys(m.shop).filter(k => k.startsWith('chest-')).length, 1);
    const one = full(); one.shop[r2.key] = r2.rec;
    assert.strictEqual(C.state(m).cash, C.state(one).cash);
  }],
  ['leave roll at claim uses the streak leave count', () => {
    const d = full();
    const leaveRec = { chest: 'big', quest: 'old', rolls: [{ kind: 'leave' }, { kind: 'leave' }], t: S - 1000 };
    d.shop['chest-old'] = leaveRec;
    profiles(40).forEach(p => {
      const res = Q.claim(d, Q.today(d, NOW, ctx(p))[0].key, NOW, ctx(p));
      assert.ok(!res.rec.rolls.some(x => x.kind === 'leave'));
    });
  }],
  ['badge counts done dailies and flags claimable rewards', () => {
    const c = ctx('Ann');
    assert.deepStrictEqual(Q.badge(empty(), NOW, c), { done: 0, total: 3, claimable: false });
    const d = full();
    assert.deepStrictEqual(Q.badge(d, NOW, c), { done: 3, total: 3, claimable: true });
    const r = Q.resetIn(NOW);
    assert.strictEqual(r.day, 9 * 3600e3);
    assert.strictEqual(r.week, 2 * 864e5 + 9 * 3600e3);
  }]
];
```

Note on the leave test: `full()` has 5 consecutive study days, so earned leave is 0; the stored chest adds two leave grants dated the day before, bringing leave to 2 at claim time, so any leave roll must become cash.

- [ ] **Step 2: Run tests to verify they fail**

Run: `node tests/run.js quests`
Expected: FAIL "Cannot find module '../js/quests.js'".

- [ ] **Step 3: Create `js/quests.js`**

```js
// Daily, bonus and weekly quests derived from existing timestamps. Pure: now and ctx = { profile, catalog } are passed in.
(function (root) {
  const node = typeof module !== 'undefined' && module.exports;
  const C = node ? require('./shop/core.js') : root.ShopCore;
  const G = node ? require('./game.js') : root.Game;
  const X = node ? require('./chests.js') : root.Chests;
  const DAY = 864e5;
  const vals = o => Object.values(o || {}).filter(v => v && typeof v === 'object');
  const inRange = (t, a, b) => Number.isFinite(t) && t >= a && t < b;
  const prof = ctx => String((ctx && ctx.profile) || '').toLowerCase();
  const dayKey = G.dayKey;
  const dayStart = now => { const t = new Date(now); t.setHours(0, 0, 0, 0); return t.getTime(); };
  const dayEnd = now => { const t = new Date(dayStart(now)); t.setDate(t.getDate() + 1); return t.getTime(); };
  const weekStart = now => { const t = new Date(dayStart(now)); t.setDate(t.getDate() - (t.getDay() + 6) % 7); return t.getTime(); };
  const weekEnd = now => { const t = new Date(weekStart(now)); t.setDate(t.getDate() + 7); return t.getTime(); };
  function weekKey(now) {
    const t = new Date(dayStart(now));
    t.setDate(t.getDate() + 3 - (t.getDay() + 6) % 7);          // Thursday decides the ISO year
    const y = t.getFullYear(), jan4 = new Date(y, 0, 4);
    const w = 1 + Math.round(((t - jan4) / DAY - 3 + (jan4.getDay() + 6) % 7) / 7);
    return y + '-W' + String(w).padStart(2, '0');
  }

  // A card was overdue at day start if its due time as of day start (pdue once graded today) was before it.
  function wasOverdue(c, s) {
    if (!c || !c.seen) return false;
    const due = c.last >= s ? c.pdue : c.due;
    return Number.isFinite(due) && due < s;
  }
  function overdueModule(d, s, catalog) {
    let best = null, n = 0;
    ((catalog && catalog.modules) || []).slice().sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)).forEach(m => {
      const k = m.cards.filter(id => wasOverdue(d.cards && d.cards[id], s)).length;
      if (k > n) { best = m.id; n = k; }
    });
    return best;
  }
  // Both sides are before day start, so the answer is fixed for the whole day.
  function eventOpenAt(d, s) {
    const shop = (d && d.shop) || {};
    const done = new Set(vals(shop).filter(r => typeof r.evtdone === 'string' && Number.isFinite(r.t) && r.t < s).map(r => r.evtdone));
    return Object.entries(shop).some(([k, r]) => r && typeof r.evt === 'string' && Number.isFinite(r.at) && r.at < s && !done.has(k));
  }
  const modCards = (catalog, m) => (((catalog && catalog.modules) || []).find(x => x.id === m) || { cards: [] }).cards;
  const jobs = (d, a, b) => vals(d.shop).filter(r => r.tpl && inRange(r.t, a, b));

  const TYPES = {
    cards: { range: [15, 30], label: n => `Review ${n} cards`, count: (d, a, b) => vals(d.cards).filter(c => inRange(c.last, a, b)).length },
    overdue: { range: [5, 10], label: (n, m) => `Clear ${n} overdue cards in ${String(m).toUpperCase()}`,
      count: (d, a, b, m, catalog) => modCards(catalog, m).filter(id => { const c = d.cards && d.cards[id]; return c && inRange(c.last, a, b) && Number.isFinite(c.pdue) && c.pdue < a; }).length },
    checks: { range: [3, 6], label: n => `Answer ${n} lesson checks`, count: (d, a, b) => vals(d.checks).filter(c => inRange(c.at, a, b)).length },
    section: { range: [1, 1], label: () => 'Finish a lesson section', count: (d, a, b) => vals(d.sections).filter(s => s.done && inRange(s.at, a, b)).length },
    solve: { range: [1, 3], label: n => `Hand-solve ${n} contract${n > 1 ? 's' : ''}`, count: (d, a, b) => jobs(d, a, b).length },
    exact: { range: [1, 1], label: () => 'Hand-solve 1 contract exactly', count: (d, a, b) => jobs(d, a, b).filter(r => (r.score || 0) >= 1).length },
    event: { range: [1, 1], label: () => 'Resolve an event', count: (d, a, b) => vals(d.shop).filter(r => typeof r.evtdone === 'string' && inRange(r.t, a, b)).length }
  };
  const ORDER = ['cards', 'overdue', 'checks', 'section', 'solve', 'exact', 'event'];
  const WEEKLY = {
    days: { target: 5, label: 'Study 5 of 7 days',
      count: (d, a, b) => Object.keys(d.days || {}).filter(k => /^\d{4}-\d{2}-\d{2}$/.test(k) && inRange(new Date(k + 'T12:00:00').getTime(), a, b)).length },
    master: { target: 30, label: 'Master 30 cards', count: (d, a, b) => vals(d.cards).filter(c => (c.lvl || 0) >= 4 && inRange(c.last, a, b)).length },
    solve10: { target: 10, label: 'Hand-solve 10 contracts', count: (d, a, b) => jobs(d, a, b).length }
  };
  const WEEKLY_IDS = Object.keys(WEEKLY);

  const claimRec = (d, key) => ((d && d.shop) || {})['chest-' + key] || null;
  function draw(d, now, ctx) {
    const s = dayStart(now), r = C.rng(C.hash(prof(ctx) + '|' + dayKey(now)));
    const mod = overdueModule(d, s, ctx && ctx.catalog), evt = eventOpenAt(d, s);
    const pool = ORDER.filter(id => id !== 'event' || evt);
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    const ids = [];
    pool.forEach(id => { const x = id === 'overdue' && !mod ? 'cards' : id; if (ids.length < 3 && !ids.includes(x)) ids.push(x); });
    return ids.map((id, i) => {
      const [lo, hi] = TYPES[id].range;
      return { id, i, target: lo + Math.floor(r() * (hi - lo + 1)), module: id === 'overdue' ? mod : null };
    });
  }
  function today(d, now, ctx) {
    d = d || {};
    const a = dayStart(now), b = dayEnd(now), day = dayKey(now);
    return draw(d, now, ctx).map(q => {
      const T = TYPES[q.id], key = 'd-' + day + '-' + q.i;
      const progress = Math.min(q.target, T.count(d, a, b, q.module, ctx && ctx.catalog));
      return { id: q.id, key, label: T.label(q.target, q.module), target: q.target, progress, done: progress >= q.target, claimed: !!claimRec(d, key), module: q.module };
    });
  }
  function weekly(d, now, ctx) {
    d = d || {};
    const wk = weekKey(now), id = WEEKLY_IDS[Math.floor(C.rng(C.hash(prof(ctx) + '|' + wk))() * WEEKLY_IDS.length)], W = WEEKLY[id], key = 'w-' + wk;
    const progress = Math.min(W.target, W.count(d, weekStart(now), weekEnd(now)));
    return { id, key, label: W.label, target: W.target, progress, done: progress >= W.target, claimed: !!claimRec(d, key), module: null };
  }
  function bonus(d, now, ctx) {
    const key = 'b-' + dayKey(now), qs = today(d, now, ctx);
    return { key, ready: qs.length === 3 && qs.every(q => q.claimed), claimed: !!claimRec(d, key) };
  }
  function claim(d, key, now, ctx) {
    if (typeof key !== 'string' || claimRec(d, key)) return null;
    let q = null, tier = 'small';
    if (key.startsWith('d-')) q = today(d, now, ctx).find(x => x.key === key) || null;
    else if (key.startsWith('w-')) { const w = weekly(d, now, ctx); q = w.key === key ? w : null; tier = 'big'; }
    else if (key.startsWith('b-')) { const b = bonus(d, now, ctx); q = b.key === key && b.ready ? { done: true, module: null } : null; tier = 'bonus'; }
    if (!q || !q.done) return null;
    const ck = 'chest-' + key, leave = G.streak(d && d.days, now, G.leaveGrants(d)).leave;
    const rec = { chest: tier, quest: key, rolls: X.roll(d, ck, tier, { profile: prof(ctx), leave }), t: now };
    if (q.module) rec.module = q.module;
    return { key: ck, rec };
  }
  function badge(d, now, ctx) {
    const qs = today(d, now, ctx), b = bonus(d, now, ctx), w = weekly(d, now, ctx);
    return { done: qs.filter(q => q.done).length, total: qs.length,
      claimable: qs.some(q => q.done && !q.claimed) || (b.ready && !b.claimed) || (w.done && !w.claimed) };
  }
  const resetIn = now => ({ day: dayEnd(now) - now, week: weekEnd(now) - now });

  const Quests = { TYPES, WEEKLY, dayKey, weekKey, dayStart, dayEnd, weekStart, weekEnd, overdueModule, eventOpenAt, today, weekly, bonus, claim, badge, resetIn };
  if (node) module.exports = Quests; else root.Quests = Quests;
})(this);
```

- [ ] **Step 4: Load `js/quests.js` in the browser**

In `index.html`, after `<script src="js/chests.js"></script>` add:

```html
<script src="js/quests.js"></script>
```

- [ ] **Step 5: Run tests**

Run: `node tests/run.js quests` -> all PASS. Then `npm test` -> 164 passed, 0 failed.

- [ ] **Step 6: Commit**

```bash
git add js/quests.js index.html tests/quests.test.js
git commit -m "feat: seeded daily, bonus and weekly quests with claimable chests

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: HUD quest badge, quest panel and claim

**Files:**
- Create: `js/rewards.js`
- Modify: `js/hud.js` (`paint`)
- Modify: `js/progress.js` (page top and wiring)
- Modify: `index.html` (script tag before `js/hud.js`)

**Interfaces:**
- Consumes: `Quests.today/weekly/bonus/claim/badge/resetIn` (Task 3), `Hud.catalog()`, `Hud.toast(title, body)`, `Store.data`, `Store.profile`, `Store.save()`.
- Produces: `Rewards.ctx() -> { profile, catalog }`, `Rewards.badge() -> { done, total, claimable }`, `Rewards.rollText(roll) -> string`, `Rewards.questsHTML() -> string`, `Rewards.wire(root, rerender)`.

- [ ] **Step 1: Create `js/rewards.js`**

```js
// Quest panel on the Progress page and the HUD quest badge.
const Rewards = (() => {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ctx = () => ({ profile: Store.profile, catalog: Hud.catalog() });
  const badge = () => Quests.badge(Store.data, Date.now(), ctx());
  function dur(ms) {
    const m = Math.max(0, Math.floor(ms / 60000)), d = Math.floor(m / 1440), h = Math.floor(m % 1440 / 60);
    return d ? `${d}d ${h}h` : `${h}h ${m % 60}m`;
  }
  function rollText(x) {
    if (x.kind === 'cash') return '+$' + x.amount + 'K shop cash';
    if (x.kind === 'consumable') return x.tool === 'hint' ? 'Free hint' : 'Free board reroll';
    if (x.kind === 'leave') return '+1 streak leave day';
    const c = Chests.COSMETICS.find(k => k.id === x.cos);
    return c ? (c.kind === 'title' ? 'Title: ' + c.name : c.name) : 'Cosmetic';
  }
  function card(q, big) {
    const pct = Math.round(q.progress / q.target * 100);
    return `<div class="qst${q.done ? ' done' : ''}${q.claimed ? ' claimed' : ''}${big ? ' big' : ''}">
      <b>${esc(q.label)}</b>
      <div class="hud-bar"><i style="width:${pct}%"></i></div>
      <div class="qst-foot"><span class="muted small">${q.progress}/${q.target}</span>${q.claimed ? '<span class="muted small">Claimed</span>'
        : q.done ? `<button class="btn small" data-claim="${esc(q.key)}">Claim</button>` : ''}</div></div>`;
  }
  function questsHTML() {
    const now = Date.now(), c = ctx(), qs = Quests.today(Store.data, now, c), w = Quests.weekly(Store.data, now, c), b = Quests.bonus(Store.data, now, c), left = Quests.resetIn(now);
    const bonusEnd = b.claimed ? '<span class="muted small">Claimed</span>'
      : b.ready ? `<button class="btn small" data-claim="${esc(b.key)}">Claim bonus</button>`
      : `<span class="muted small">${qs.filter(q => q.claimed).length}/3 claimed</span>`;
    return `<section class="quests">
      <div class="q-head"><h2>Daily quests</h2><span class="muted small">Resets in ${dur(left.day)}</span></div>
      <div class="q-grid">${qs.map(q => card(q)).join('')}</div>
      <div class="q-bonus${b.ready && !b.claimed ? ' ready' : ''}"><span>Bonus chest: claim all three daily quests</span>${bonusEnd}</div>
      <div class="q-head"><h2>Weekly quest</h2><span class="muted small">Resets in ${dur(left.week)}</span></div>
      ${card(w, true)}
    </section>`;
  }
  function claim(key, rerender) {
    const res = Quests.claim(Store.data, key, Date.now(), ctx());
    if (!res) { rerender(); return null; }
    Store.data.shop[res.key] = res.rec;
    Store.save();
    return res.rec;
  }
  function wire(root, rerender) {
    root.querySelectorAll('[data-claim]').forEach(b => b.onclick = () => {
      b.disabled = true;
      const rec = claim(b.dataset.claim, rerender);
      if (!rec) return;
      Hud.toast('Chest opened', rec.rolls.map(rollText).join(' · '));
      rerender();
    });
  }
  return { ctx, badge, rollText, questsHTML, wire };
})();
```

- [ ] **Step 2: Add the HUD badge**

In `js/hud.js`, replace the whole `paint` function with:

```js
  function paint(g) {
    const qb = Rewards.badge();
    box.innerHTML = `<a href="#/progress" class="hud-rank" title="${fmt(g.xp.total)} XP${g.rank.next ? ' · ' + fmt(g.rank.next.xp - g.xp.total) + ' to ' + esc(g.rank.next.name) : ''}">
        <b>${esc(g.rank.name)}</b><span class="hud-bar"><i style="width:${pct(g)}%"></i></span></a>
      <span class="hud-streak ${g.streak.current ? 'on' : ''}" title="${g.streak.current}-day streak · best ${g.streak.best} · ${g.streak.leave} leave day${g.streak.leave === 1 ? '' : 's'}">${FLAME}${g.streak.current}</span>
      <a href="#/progress" class="hud-quests${qb.claimable ? ' ready' : ''}" title="Daily quests: ${qb.done} of ${qb.total} done${qb.claimable ? ' · reward ready' : ''}">${qb.done}/${qb.total}</a>`;
  }
```

- [ ] **Step 3: Put the quest panel on the Progress page**

In `js/progress.js`, replace:

```js
        <h1>Progress</h1>
        ${Hud.progressHTML()}
```

with:

```js
        <h1>Progress</h1>
        ${Rewards.questsHTML()}
        ${Hud.progressHTML()}
```

and replace:

```js
    root.querySelector('#rstL').onclick =
```

with:

```js
    Rewards.wire(root, () => App.render());
    root.querySelector('#rstL').onclick =
```

- [ ] **Step 4: Load `js/rewards.js`**

In `index.html`, before `<script src="js/hud.js"></script>` add:

```html
<script src="js/rewards.js"></script>
```

- [ ] **Step 5: Run the suite**

Run: `npm test` -> 164 passed, 0 failed (no browser code is loaded by tests; this guards against accidental edits to shared files).

- [ ] **Step 6: Manual check**

Open `index.html` with a profile. Expected: HUD shows `0/3` next to the flame; Progress page opens with three daily cards, a bonus row, a weekly card and two "Resets in" countdowns. Review cards in Flashcards until a `cards` quest fills (or run `Store.data.cards` edits in the console), return, click Claim: a toast lists the roll, the card shows Claimed, the HUD badge and Shop cash update. Reloading keeps it Claimed. Clicking Claim twice fast gives one chest.

- [ ] **Step 7: Commit**

```bash
git add js/rewards.js js/hud.js js/progress.js index.html
git commit -m "feat: quest badge in HUD and quest panel with claim on Progress

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Chest modal, cosmetics grid, equip and applying title, flame and desk

**Files:**
- Modify: `js/rewards.js` (full replacement below)
- Modify: `js/hud.js` (`paint`)
- Modify: `js/progress.js` (cosmetics grid)
- Modify: `js/shop/firm.js` (`panel` wrapper, Chests import)
- Test: `tests/firm.test.js` (append)

**Interfaces:**
- Consumes: `Chests.COSMETICS`, `Chests.owned(d)`, `Chests.equipped(d)` (Task 2); everything in Task 4.
- Produces: `Rewards.openChest(rec, onClose)`, `Rewards.equip(id)`, `Rewards.unequip(kind)`, `Rewards.cosmeticsHTML()`; firm panel markup wrapped in `<div class="firm desk-<value>">` (or `class="firm"`); HUD `.hud-title` and `.hud-streak.flame-<value>`.

- [ ] **Step 1: Write the failing firm test**

Append to the array in `tests/firm.test.js`:

```js
  ['firm panel carries the equipped, owned desk theme class', () => {
    const own = { 'chest-w-2026-W39': { chest: 'big', quest: 'w-2026-W39', rolls: [{ kind: 'cosmetic', cos: 'desk-brass' }], t: 1 } };
    const d = D(pipe('esc-compound', 0), own);
    d.settings = { cosmetics: { desk: 'desk-brass' } };
    assert.ok(F.panel(d, 40 * H, sched({})).startsWith('<div class="firm desk-brass">'));
    d.settings.cosmetics.desk = 'desk-ledger';
    assert.ok(F.panel(d, 40 * H, sched({})).startsWith('<div class="firm">'));
  }]
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node tests/run.js firm` -> new test FAIL (panel starts with `<h2>`).

- [ ] **Step 3: Wrap the firm panel**

In `js/shop/firm.js`, after the `const E = ...` line add:

```js
  const X = typeof module !== 'undefined' && module.exports ? require('../chests.js') : root.Chests;
```

In `panel`, replace:

```js
    return `<h2>Your desks</h2>
```

with:

```js
    const desk = X.equipped(d).desk;
    return `<div class="firm${desk ? ' desk-' + desk.value : ''}"><h2>Your desks</h2>
```

and replace the panel's last line:

```js
      <div class="row-btns"><button class="btn" id="collect" ${total > 0 ? '' : 'disabled'}>Collect all</button></div>`;
```

with:

```js
      <div class="row-btns"><button class="btn" id="collect" ${total > 0 ? '' : 'disabled'}>Collect all</button></div></div>`;
```

- [ ] **Step 4: Run firm tests**

Run: `node tests/run.js firm` -> 3 passed.

- [ ] **Step 5: Replace `js/rewards.js`**

```js
// Quest panel, chest modal and cosmetics grid on the Progress page, and the HUD quest badge.
const Rewards = (() => {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const TIER = { small: 'Quest chest', bonus: 'Bonus chest', big: 'Weekly chest' };
  const ctx = () => ({ profile: Store.profile, catalog: Hud.catalog() });
  const badge = () => Quests.badge(Store.data, Date.now(), ctx());
  function dur(ms) {
    const m = Math.max(0, Math.floor(ms / 60000)), d = Math.floor(m / 1440), h = Math.floor(m % 1440 / 60);
    return d ? `${d}d ${h}h` : `${h}h ${m % 60}m`;
  }
  function rollText(x) {
    if (x.kind === 'cash') return '+$' + x.amount + 'K shop cash';
    if (x.kind === 'consumable') return x.tool === 'hint' ? 'Free hint' : 'Free board reroll';
    if (x.kind === 'leave') return '+1 streak leave day';
    const c = Chests.COSMETICS.find(k => k.id === x.cos);
    return c ? (c.kind === 'title' ? 'Title: ' + c.name : c.name) : 'Cosmetic';
  }
  function card(q, big) {
    const pct = Math.round(q.progress / q.target * 100);
    return `<div class="qst${q.done ? ' done' : ''}${q.claimed ? ' claimed' : ''}${big ? ' big' : ''}">
      <b>${esc(q.label)}</b>
      <div class="hud-bar"><i style="width:${pct}%"></i></div>
      <div class="qst-foot"><span class="muted small">${q.progress}/${q.target}</span>${q.claimed ? '<span class="muted small">Claimed</span>'
        : q.done ? `<button class="btn small" data-claim="${esc(q.key)}">Claim</button>` : ''}</div></div>`;
  }
  function questsHTML() {
    const now = Date.now(), c = ctx(), qs = Quests.today(Store.data, now, c), w = Quests.weekly(Store.data, now, c), b = Quests.bonus(Store.data, now, c), left = Quests.resetIn(now);
    const bonusEnd = b.claimed ? '<span class="muted small">Claimed</span>'
      : b.ready ? `<button class="btn small" data-claim="${esc(b.key)}">Claim bonus</button>`
      : `<span class="muted small">${qs.filter(q => q.claimed).length}/3 claimed</span>`;
    return `<section class="quests">
      <div class="q-head"><h2>Daily quests</h2><span class="muted small">Resets in ${dur(left.day)}</span></div>
      <div class="q-grid">${qs.map(q => card(q)).join('')}</div>
      <div class="q-bonus${b.ready && !b.claimed ? ' ready' : ''}"><span>Bonus chest: claim all three daily quests</span>${bonusEnd}</div>
      <div class="q-head"><h2>Weekly quest</h2><span class="muted small">Resets in ${dur(left.week)}</span></div>
      ${card(w, true)}
    </section>`;
  }

  function equip(id) {
    const c = Chests.COSMETICS.find(x => x.id === id);
    if (!c || !Chests.owned(Store.data).has(id)) return;
    Store.settings.cosmetics = Object.assign({}, Store.settings.cosmetics, { [c.kind]: id });
    Store.save();
  }
  function unequip(kind) {
    Store.settings.cosmetics = Object.assign({}, Store.settings.cosmetics, { [kind]: null });
    Store.save();
  }
  function cosmeticsHTML() {
    const own = Chests.owned(Store.data), eq = Chests.equipped(Store.data);
    const group = (kind, head) => `<h3>${head}</h3><div class="cos-grid">${Chests.COSMETICS.filter(c => c.kind === kind).map(c => {
      const has = own.has(c.id), on = !!(eq[kind] && eq[kind].id === c.id);
      const act = !has ? '' : on ? `<button class="btn small ghost" data-unequip="${kind}">Unequip</button>` : `<button class="btn small" data-equip="${esc(c.id)}">Equip</button>`;
      return `<div class="cos cos-${kind} ${kind}-${esc(c.value)}${has ? ' got' : ' locked'}${on ? ' on' : ''}">
        <span class="cos-swatch" aria-hidden="true"></span><b>${has ? esc(c.name) : 'Locked'}</b>${act}</div>`;
    }).join('')}</div>`;
    return `<section class="cosmetics"><h2>Cosmetics <span class="muted small">${own.size} of ${Chests.COSMETICS.length}</span></h2>
      <p class="muted small">Weekly chests always hold one. Daily chests sometimes do.</p>
      ${group('title', 'Titles')}${group('flame', 'Flames')}${group('desk', 'Desk themes')}</section>`;
  }

  function openChest(rec, onClose) {
    const m = document.createElement('div');
    m.className = 'chest-modal';
    m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-label', TIER[rec.chest] || 'Chest');
    m.innerHTML = `<div class="chest-box">
      <div class="chest chest-${esc(rec.chest)}" aria-hidden="true"><i></i></div>
      <h3>${esc(TIER[rec.chest] || 'Chest')}</h3>
      <div class="chest-rolls">${rec.rolls.map((x, i) => `<div class="chest-roll k-${esc(x.kind)}" style="animation-delay:${(0.9 + i * 0.25).toFixed(2)}s">
        <b>${esc(rollText(x))}</b>${x.kind === 'cosmetic' ? `<button class="btn small" data-equip="${esc(x.cos)}">Equip now</button>` : ''}</div>`).join('')}</div>
      <div class="row-btns"><button class="btn" data-close>Nice</button></div></div>`;
    document.body.appendChild(m);
    const close = () => { document.removeEventListener('keydown', onKey); m.remove(); if (onClose) onClose(); };
    const onKey = e => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    m.onclick = e => { if (e.target === m) close(); };
    m.querySelector('[data-close]').onclick = close;
    m.querySelectorAll('[data-equip]').forEach(b => b.onclick = () => { equip(b.dataset.equip); b.disabled = true; b.textContent = 'Equipped'; });
    m.querySelector('[data-close]').focus();
  }

  function claim(key, rerender) {
    const res = Quests.claim(Store.data, key, Date.now(), ctx());
    if (!res) { rerender(); return null; }
    Store.data.shop[res.key] = res.rec;
    Store.save();
    return res.rec;
  }
  function wire(root, rerender) {
    root.querySelectorAll('[data-claim]').forEach(b => b.onclick = () => {
      b.disabled = true;
      const rec = claim(b.dataset.claim, rerender);
      if (rec) openChest(rec, rerender);
    });
    root.querySelectorAll('.cosmetics [data-equip]').forEach(b => b.onclick = () => { equip(b.dataset.equip); rerender(); });
    root.querySelectorAll('.cosmetics [data-unequip]').forEach(b => b.onclick = () => { unequip(b.dataset.unequip); rerender(); });
  }
  return { ctx, badge, rollText, questsHTML, cosmeticsHTML, openChest, equip, unequip, wire };
})();
```

- [ ] **Step 6: Show title and flame in the HUD**

In `js/hud.js`, replace the whole `paint` function with:

```js
  function paint(g) {
    const qb = Rewards.badge(), eq = Chests.equipped(Store.data);
    box.innerHTML = `<a href="#/progress" class="hud-rank" title="${fmt(g.xp.total)} XP${g.rank.next ? ' · ' + fmt(g.rank.next.xp - g.xp.total) + ' to ' + esc(g.rank.next.name) : ''}">
        <b>${esc(g.rank.name)}</b>${eq.title ? `<small class="hud-title">${esc(eq.title.name)}</small>` : ''}<span class="hud-bar"><i style="width:${pct(g)}%"></i></span></a>
      <span class="hud-streak ${g.streak.current ? 'on' : ''}${eq.flame ? ' flame-' + eq.flame.value : ''}" title="${g.streak.current}-day streak · best ${g.streak.best} · ${g.streak.leave} leave day${g.streak.leave === 1 ? '' : 's'}">${FLAME}${g.streak.current}</span>
      <a href="#/progress" class="hud-quests${qb.claimable ? ' ready' : ''}" title="Daily quests: ${qb.done} of ${qb.total} done${qb.claimable ? ' · reward ready' : ''}">${qb.done}/${qb.total}</a>`;
  }
```

- [ ] **Step 7: Cosmetics grid below achievements**

In `js/progress.js`, replace:

```js
        ${Hud.progressHTML()}
        <div class="kpis">
```

with:

```js
        ${Hud.progressHTML()}
        ${Rewards.cosmeticsHTML()}
        <div class="kpis">
```

- [ ] **Step 8: Run the suite**

Run: `npm test` -> 165 passed, 0 failed.

- [ ] **Step 9: Manual check**

In the console, grant a test cosmetic: `Store.data.shop['chest-test'] = { chest: 'big', quest: 'test', rolls: [{ kind: 'cosmetic', cos: 'title-cost-sage' }, { kind: 'cosmetic', cos: 'flame-gold' }, { kind: 'cosmetic', cos: 'desk-brass' }], t: Date.now() }; Store.save(); App.render()`. Expected: the grid shows three owned items with Equip buttons, the rest "Locked". Equip each: HUD shows "Cost Sage" under the rank, the flame gets class `flame-gold`, the Shop firm panel gets `firm desk-brass`. Claim a quest: the modal shows the chest, then one card per roll; Escape, backdrop click and "Nice" close it and re-render. Delete the test record afterwards: `delete Store.data.shop['chest-test']; Store.save()`.

- [ ] **Step 10: Commit**

```bash
git add js/rewards.js js/hud.js js/progress.js js/shop/firm.js tests/firm.test.js
git commit -m "feat: chest modal, cosmetics grid and equipped title, flame and desk

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Rewards CSS (quests, modal, cosmetics, themes)

**Files:**
- Create: `css/views/rewards.css`
- Modify: `index.html` (stylesheet link after `css/views/progress.css`)

**Interfaces:**
- Consumes: classes from Tasks 4-5: `.hud-quests(.ready)`, `.hud-title`, `.hud-streak.flame-<v>`, `.quests .q-head .q-grid .qst(.done|.claimed|.big) .qst-foot .q-bonus(.ready)`, `.chest-modal .chest-box .chest.chest-<tier> .chest-rolls .chest-roll.k-<kind>`, `.cosmetics .cos-grid .cos.cos-<kind>.<kind>-<v>(.got|.locked|.on) .cos-swatch`, `.firm.desk-<v>`; tokens from `css/styles.css`.
- Produces: tokens `--flame-blue|green|purple|gold` with light and dark values.

- [ ] **Step 1: Create `css/views/rewards.css`**

```css
/* Quests, chests and cosmetics. Colors come from tokens; the flame tokens below are the only new ones. */
:root {
  --flame-blue: oklch(0.45 0.14 250);
  --flame-green: oklch(0.44 0.12 150);
  --flame-purple: oklch(0.42 0.17 305);
  --flame-gold: oklch(0.50 0.12 80);
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --flame-blue: oklch(0.76 0.12 250);
    --flame-green: oklch(0.78 0.13 150);
    --flame-purple: oklch(0.76 0.14 305);
    --flame-gold: oklch(0.82 0.13 85);
  }
}
:root[data-theme="dark"] {
  --flame-blue: oklch(0.76 0.12 250);
  --flame-green: oklch(0.78 0.13 150);
  --flame-purple: oklch(0.76 0.14 305);
  --flame-gold: oklch(0.82 0.13 85);
}

/* HUD */
.hud-quests {
  display: inline-flex; align-items: center; font-weight: 600; font-size: .8rem; text-decoration: none;
  color: var(--muted); background: var(--paper-2); border: 1px solid var(--line); padding: 4px 9px; border-radius: 999px;
}
.hud-quests.ready { color: var(--accent-ink); background: var(--accent); border-color: var(--accent); box-shadow: var(--glow); }
.hud-title { font-size: .68rem; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px; }
.hud-streak.flame-blue { color: var(--flame-blue); }
.hud-streak.flame-green { color: var(--flame-green); }
.hud-streak.flame-purple { color: var(--flame-purple); }
.hud-streak.flame-gold { color: var(--flame-gold); }

/* Quest panel */
.quests { margin: 0 0 24px; }
.quests .q-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.quests .q-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
.quests .qst {
  display: flex; flex-direction: column; gap: 8px; min-width: 0; padding: 14px;
  background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow-sm);
}
.quests .qst b { font-weight: 600; overflow-wrap: anywhere; }
.quests .qst.done { border-color: var(--good); }
.quests .qst.done .hud-bar i { background: var(--good); }
.quests .qst.claimed { opacity: .7; }
.quests .qst.big { margin-top: 4px; }
.quests .qst-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 30px; }
.quests .q-bonus {
  display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-top: 12px; padding: 10px 14px;
  background: var(--paper-2); border: 1px dashed var(--line-2); border-radius: var(--radius);
}
.quests .q-bonus.ready { border-style: solid; border-color: var(--accent); background: var(--accent-soft); }

/* Chest modal */
.chest-modal {
  position: fixed; inset: 0; z-index: 50; display: grid; place-items: center; padding: 16px;
  background: color-mix(in srgb, var(--bg-deep) 72%, transparent);
}
.chest-box {
  width: min(420px, 100%); max-height: calc(100vh - 32px); overflow-y: auto; text-align: center; padding: 22px 18px;
  background: var(--paper); color: var(--ink); border: 1px solid var(--line); border-radius: 14px; box-shadow: var(--shadow-lg);
}
.chest-box h3 { margin: 10px 0 14px; }
.chest {
  position: relative; width: 84px; height: 64px; margin: 0 auto; border-radius: 10px 10px 8px 8px;
  background: var(--grad-accent); box-shadow: var(--glow);
  animation: chest-shake .7s ease-in-out, chest-pop .25s ease-out .7s both;
}
.chest i { position: absolute; left: 0; right: 0; top: 24px; height: 6px; background: var(--accent-soft); }
.chest.chest-bonus { background: linear-gradient(135deg, var(--flame-green), var(--accent)); }
.chest.chest-big { background: linear-gradient(135deg, var(--flame-gold), var(--accent-strong)); width: 100px; height: 74px; }
.chest-rolls { display: grid; gap: 8px; }
.chest-roll {
  display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; padding: 10px 12px; text-align: left;
  background: var(--paper-2); border: 1px solid var(--line); border-radius: var(--radius); animation: roll-in .35s ease-out both;
}
.chest-roll.k-cash { border-left: 4px solid var(--good); }
.chest-roll.k-consumable { border-left: 4px solid var(--info); }
.chest-roll.k-leave { border-left: 4px solid var(--mid); }
.chest-roll.k-cosmetic { border-left: 4px solid var(--accent); }
.chest-box .row-btns { justify-content: center; margin-top: 16px; }
@keyframes chest-shake {
  0%, 100% { transform: rotate(0); } 20% { transform: rotate(-8deg); } 40% { transform: rotate(7deg); }
  60% { transform: rotate(-5deg); } 80% { transform: rotate(3deg); }
}
@keyframes chest-pop { from { transform: scale(1); } 50% { transform: scale(1.18); } to { transform: scale(1); } }
@keyframes roll-in { from { opacity: 0; transform: translateY(8px) scale(.96); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) {
  .chest, .chest-roll { animation: none !important; }
}

/* Cosmetics grid */
.cosmetics { margin-top: 24px; }
.cosmetics .cos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 10px; }
.cosmetics .cos {
  display: flex; flex-direction: column; align-items: flex-start; gap: 8px; min-width: 0; padding: 12px;
  background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius);
}
.cosmetics .cos b { overflow-wrap: anywhere; }
.cosmetics .cos.locked { background: var(--paper-2); color: var(--muted); }
.cosmetics .cos.locked .cos-swatch { filter: grayscale(1); opacity: .35; }
.cosmetics .cos.on { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-soft); }
.cosmetics .cos-swatch { width: 28px; height: 28px; border-radius: 8px; background: var(--silver-soft); border: 1px solid var(--line-2); }
.cosmetics .cos-title .cos-swatch { border-radius: 99px; background: var(--grad-accent); }
.cosmetics .flame-blue .cos-swatch { background: var(--flame-blue); }
.cosmetics .flame-green .cos-swatch { background: var(--flame-green); }
.cosmetics .flame-purple .cos-swatch { background: var(--flame-purple); }
.cosmetics .flame-gold .cos-swatch { background: var(--flame-gold); }
.cosmetics .desk-blueprint .cos-swatch, .firm.desk-blueprint .idle-desk {
  background-color: color-mix(in srgb, var(--flame-blue) 12%, var(--paper));
  background-image: linear-gradient(color-mix(in srgb, var(--flame-blue) 18%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--flame-blue) 18%, transparent) 1px, transparent 1px);
  background-size: 14px 14px;
}
.cosmetics .desk-ledger .cos-swatch, .firm.desk-ledger .idle-desk {
  background-color: color-mix(in srgb, var(--flame-green) 8%, var(--paper));
  background-image: repeating-linear-gradient(180deg, transparent 0 17px, color-mix(in srgb, var(--flame-green) 22%, transparent) 17px 18px);
}
.cosmetics .desk-terminal .cos-swatch, .firm.desk-terminal .idle-desk {
  background-color: color-mix(in srgb, var(--ink) 88%, var(--flame-green));
  color: color-mix(in srgb, var(--flame-green) 40%, var(--paper));
}
.firm.desk-terminal .idle-desk { font-family: ui-monospace, "Cascadia Mono", Consolas, monospace; }
.firm.desk-terminal .idle-desk .muted { color: color-mix(in srgb, var(--flame-green) 30%, var(--paper)); }
.cosmetics .desk-brass .cos-swatch, .firm.desk-brass .idle-desk {
  background-color: color-mix(in srgb, var(--flame-gold) 14%, var(--paper));
  border-color: var(--flame-gold);
}

@media (max-width: 640px) {
  .quests .q-grid { grid-template-columns: 1fr; }
  .cosmetics .cos-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
  .hud-title { display: none; }
  .hud-quests { padding: 3px 7px; }
}
```

- [ ] **Step 2: Link the stylesheet**

In `index.html`, after `<link rel="stylesheet" href="css/views/progress.css">` add:

```html
<link rel="stylesheet" href="css/views/rewards.css">
```

- [ ] **Step 3: Run the suite**

Run: `npm test` -> 165 passed, 0 failed.

- [ ] **Step 4: Manual check (phone and desktop, light and dark)**

Open `index.html`. Check at 1280px and at 375px (DevTools device toolbar), in light and dark (theme button): HUD badge readable next to the flame and turns accent when a reward is claimable; quest cards stack to one column on phone with no horizontal scroll; the chest shakes, pops, then rolls slide in (and appear instantly with "reduce motion" emulated); locked cosmetics are grey; each flame color is visible on the HUD in both themes; each desk theme restyles the Shop desks while text stays readable (terminal especially in light mode).

- [ ] **Step 5: Commit**

```bash
git add css/views/rewards.css index.html
git commit -m "feat: styles for quests, chest modal, cosmetics and desk themes

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Self-Review

- **Spec coverage:** day/week keys, daily draw, 7 types and ranges, overdue module + fallback + `pdue`, event gating, checks without `at` ignored (Tasks 1, 3); weekly draw (Task 3); claiming, expiry, bonus (Task 3, UI Task 4); chest tiers, roll odds, amounts, leave/cosmetic conversion, big-chest guarantee, record shape and keys, merge-once (Tasks 2, 3); shop cash, tool counts, leave in streak, XP/rank/rep/completed unchanged (Task 2); 16 cosmetics, ownership from rolls, `settings.cosmetics`, title under rank, flame color, desk class on firm panel (Tasks 2, 5, 6); HUD badge, quest panel with countdowns, chest modal with Equip now, cosmetics grid, phone/desktop/dark (Tasks 4-6). Rank-scaled targets intentionally dropped (see Deviations).
- **Placeholder scan:** every code step has full code; no TBD.
- **Type consistency:** `ctx = { profile, catalog }` everywhere; `Chests.roll(d, chestKey, tier, { profile, leave })` matches `Quests.claim`; `Chests.equipped` returns COSMETICS entries with `.value` used by HUD (`flame-<value>`) and firm (`desk-<value>`) and CSS; test counts 135 -> 138 -> 151 -> 164 -> 165.
- **Review Focus:** all five lines have tests in Tasks 1, 2 and 3.
