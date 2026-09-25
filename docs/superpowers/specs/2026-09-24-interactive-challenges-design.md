# Interactive Challenges - Design

## Goal

Make lessons feel like Brilliant: the learner acts on a concept (hits a target, predicts before seeing, reads a chart) instead of only reading and moving sliders freely. Every module gets at least one interactive element; the core quantitative ideas get guided, scored challenges.

Success: each of the 16 modules has an interactive widget in its lessons; ~35-40 challenges exist, each completable, each counted in XP / step gating exactly like a `:::check`; every challenge's answer is produced by the widget's own math (no hand-typed number that can drift from the widget).

Out of scope: animation-only explainers, new chart library, changes to flashcards or the shop.

## Authoring format

New block directive in section bodies:

```
:::challenge lc-explorer t1=100 lcs=0.95 n=8 lock=theory,log,t1,n
Q: Drag the LCS slider until unit 8 costs **\$51.20**.
goal: unitN ~ 51.2 +- 0.5%
show: lcs=0.8
> An 80% curve cuts unit cost 20% per doubling: 100, 80, 64, 51.2.
:::
```

Header: `challenge <widget> [key=value ...] [lock=key,key]`. `key=value` presets set initial control values; `lock` hides those controls. The same preset/lock args also work on plain `:::widget` blocks.

Body lines (first match wins per line, as in `:::check`):

| Line | Meaning |
|---|---|
| `Q: ...` (+ continuation lines) | prompt, markdown |
| `goal: <out> <op> <num> [+- tol]` | target condition; several `goal:` lines are ANDed. ops: `~` (needs tol, `%` or absolute), `<`, `<=`, `>`, `>=` |
| `predict: <out> +- <tol>` | predict challenge: learner types a number before the widget unlocks |
| `* text` / `- text` | choose challenge: right / wrong options (widget stays interactive) |
| `show: key=value ...` | control values applied by "Show me" (target only; required for target) |
| `> ...` | explanation shown on completion |

Type is inferred: `goal:` -> target, `predict:` -> predict, options -> choose. Exactly one type per block.

## Behaviour

- **target**: widget live. After every widget update the goals are evaluated against its published outputs; when all hold, the block completes (`first` = no "Show me" used). A "Show me" button appears after 45 s or when the learner clicks "I'm stuck"; it applies `show:` values, which completes the block with `first: false`.
- **predict**: widget rendered at its presets with an overlay ("Make your prediction first"), controls disabled. Learner enters a number; the widget unlocks, and the true value (the widget's own output) is shown next to the guess. Block completes either way; `first` = guess within tolerance. Feedback states the gap.
- **choose**: same scoring as a multiple-choice `:::check` (retry until right; `first` = right on first click). Widget stays interactive for exploring.
- Completed state is restored on reload from `Store.data.checks[id]`: target blocks re-apply `show:` values; predict blocks show the stored guess and actual.

## Progress integration

A challenge renders as an element with class `check challenge` and `data-check-id = ctx.key + '#c' + index`, using its own counter in `Render.section`. It must not share the check counter: existing checks without an explicit id are keyed by position, so a challenge inserted before them would re-key them and orphan saved progress. It writes `Store.data.checks[id] = { first, done: true }` (predict also stores `guess`). Consequences, with no changes needed elsewhere:

- XP: `js/game.js` already scores `checks` (20 first try / 10 otherwise).
- Step gating: `js/learn.js:136` counts `.check` elements not `.done`.
- Profile sync/merge: existing per-record merge of `checks`.

## Widget contract

A manifest, `js/widget-meta.js`, loaded by the browser and by Node tools:

```js
WidgetMeta = {
  'lc-explorer': { controls: ['theory','t1','lcs','n','log'], outputs: ['b','unitN','cavN','totalN'] },
  ...
}
```

`js/widgets.js` changes:

- `Render.buildWidget` parses args into `{ presets, lock }` and attaches a per-box handle `box.w = { presets, lock, out: {}, set(k, v), onUpdate(fn) }` before calling the widget.
- `controls()` reads `box.w.presets` for initial values, hides locked controls, and registers each control so `box.w.set(k, v)` moves the input and redraws.
- New helper `publish(box, outs)`: widgets call it at the end of `draw()`; stores outputs and notifies listeners. In dev (`?dev` in URL) it warns when published keys differ from the manifest.
- Widgets with non-slider state (regression points, EVM time scrubber) register extra setters, e.g. `box.w.setter('preset', name => ...)`, so `show:` / presets can drive them.

All 16 existing widgets are migrated to call `publish()`; this is the bulk of the mechanical change.

## Code layout

- `js/wmath.js` - pure widget math (seeded RNG, t/z quantiles, bisection, PV, EVM scenarios, lock-in curves, normalization data, CI and Monte Carlo simulation), no DOM, unit-tested. Existing widgets move their shared math here.
- `js/challenge.js` - pure parsing and goal evaluation (`parse(lines)`, `evalGoals(goals, out)`, `withinTol(x, target, tol)`), no DOM. Exported for Node like `js/game.js`.
- `js/render.js` - `buildStep` gains a `challenge` branch calling `buildChallenge(d, ctx, idx)` (DOM glue: prompt, feedback, overlay, Show me, persistence). Parse of widget args moves into a shared helper used by both widget and challenge blocks.
- `js/widget-meta.js` - manifest above; replaces the hard-coded widget list in `tools/validate.js`.
- `index.html` - add script tags for `widget-meta.js` and `challenge.js`.

## New widgets and upgrades

New (all using `Plot` and `controls()`):

- **normalize** (M4): 8 historical data points recorded in mixed years, lot quantities and units. Toggles: inflation to BY, quantity/learning adjustment, unit conversion. Scatter of cost vs. driver with live OLS R². Outputs: `r2`, `nAdjust`, `byValue` (normalized cost of a highlighted point).
- **method-phase** (M2): stacked area of method suitability (analogy / parametric / build-up / actuals) across life-cycle phases, with a phase slider. Outputs: `phase`, `dominant` (index of top method).
- **ci-sim** (M10): draw k samples of size n from a known population; plot each 90/95/99% interval against mu; count coverage. Outputs: `n`, `level`, `coverage`, `halfWidth`. Seeded RNG.
- **lockin** (M16): committed vs. expended cumulative cost curves across the life cycle with a phase scrubber. Outputs: `phase`, `committed`, `spent`.

Upgrades:

- **montecarlo** (M9): seeded RNG, re-runs on every change (no Run button), dashed rho = 0 S-curve for comparison; outputs `pe`, `pePct`, `mean`, `sd`, `p50`, `p70`, `p80`, `p80ind`, `p80gap`. (Replaces the separate correlation widget originally planned; montecarlo already has a rho control.)
- **transform** (M6/M8): seeded noise so outputs are reproducible.

- **regression** (M3/M8): "Fit by hand" mode with a draggable line (two handles) and drawn squared residuals; outputs `sseHand`, `sseOls`, `ratio` (= sseHand/sseOls), `r2`, plus existing stats.
- **npv** (M13): second alternative and a break-even marker; outputs `npvA`, `npvB`, `diff`, `rate`.
- **evm** (M15): time scrubber over PV/EV/AC curves; outputs `month`, `cpi`, `spi`, `eac`, `tcpi`, `cv`, `sv`.

Placed for the first time: `analogy` (M2), `escalation` (M5), `sw-effort` (M12), `evm` (M15).

## Challenge roster (targets for authoring)

| Module | Challenges |
|---|---|
| M1 | choose on `trl`: TRL for a described prototype (x2) |
| M2 | target on `analogy`: scale to a given estimate; choose on `method-phase`: best method at early vs. late phase |
| M3 | target on `regression`: drag an outlier so R^2 < 0.5 |
| M4 | target on `normalize`: reach R^2 > 0.9; predict: BY value of the highlighted point |
| M5 | predict on `escalation`: TY total; target: rate where TY exceeds BY by 10% |
| M6 | target on `stats-lab`: move mean but not median; predict: CV |
| M7 | target on `lc-explorer`: unit-16 cost; predict: unit vs. cum-average total; target on `lmp` |
| M8 | target on `regression` fit-by-hand: `ratio < 1.05`; choose on `transform` |
| M9 | target on `montecarlo`: raise rho until P80 is 10 above the uncorrelated P80; choose: confidence level of the point estimate |
| M10 | predict on `ci-sim`: coverage; choose on `dist` |
| M11 | target on `burden`: hit a quoted price |
| M12 | predict on `sw-effort`: effort when size doubles (exponent > 1) |
| M13 | target on `npv`: break-even rate |
| M14 | target on `fpif`: overrun reaching PTA; choose on `cpif` |
| M15 | target on `evm`: month CPI first < 0.9; predict: EAC |
| M16 | choose/target on `lockin`: phase where ~70% is committed |

Each module gets 2-3; exact wording and numbers are set during authoring. Numbers from the user's guide are kept except for the known errata (M7 LMP formula and production break, M8 seeker sum), which follow the corrected values already in the app.

## Validation and testing

- `tools/validate.js`: accept `challenge`; check widget exists in the manifest; every `goal`/`predict` output is in the widget's `outputs`; every preset/lock/show key is in `controls` (or a registered setter declared in the manifest as `setters: [...]`); exactly one challenge type; target has `show:`; explanation present.
- `tests/challenge.test.js`: parsing of every line type, tolerance (percent and absolute, zero target), operators, AND of multiple goals, type inference and errors.
- `tools/challenge-check.html`: loads all content, mounts each challenge off-screen, applies its `show:` values and asserts goals hold; for predict, asserts the output is finite. Prints PASS/FAIL lines into the DOM, run headless with `msedge --headless --dump-dom`. This is what proves each challenge is solvable with its own widget math.
- `npm test` and `npm run validate` stay green; `tools/build_zip.py` needs no change (new files live under `js/`).
