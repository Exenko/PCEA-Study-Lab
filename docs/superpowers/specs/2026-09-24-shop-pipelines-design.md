# Shop Pipelines (Sub-project 1 of 4) - Design

## Goal

Keep a PCEA learner engaged with dry material by layering a pipeline-building game on the estimating shop. Inspiration priority: boot.dev > while True: learn() > idle games > The Farmer Was Replaced. The learner solves a contract type by hand, then automates it by wiring a pipeline of nodes that is verified against fresh contracts.

Success: the learner returns voluntarily and every automated pipeline reflects a correctly understood method (hard-coded numbers cannot pass).

Assets are placeholders (CSS boxes, module color accents) until custom art exists.

## Roadmap context

Built in order, each with its own spec/plan cycle:

1. **Pipeline builder + node library** (this spec)
2. **Idle engine** - running pipelines earn cash over time (including offline catch-up); per-step upkeep rewards shorter pipelines.
3. **Events** - market shocks and program changes (new inflation index, production break, labor rate spike, requirements creep) alter contract inputs so running pipelines break until the learner diagnoses and fixes them. Events target modules whose flashcards are overdue.
4. **boot.dev reward layer** - daily/weekly quests, chests, streak freeze on top of existing XP/rank.

Out of scope here: any income from pipelines, events, quests.

## Data model

### Template split

Each template in `js/shop/templates.js` gains `inputs(h, tier)` returning named values with unit metadata:

```js
inputs(h, tier) -> { base: {v: 12.5, unit: '$M'}, rate: {v: 0.03, unit: '%'}, years: {v: 5, unit: 'yr'} }
```

`gen(h, tier)` keeps its external shape (`{brief, answers, explain}`) and is reimplemented as `inputs()` followed by rendering. For a given seed, `gen()` output must be byte-identical to before the refactor (same RNG call order).

List-valued inputs (cash flows, EV outcomes/probabilities, risk element sigmas, stats samples) use `{v: [...], unit}`.

### Nodes - `js/shop/nodes.js`

Pure functions with typed ports:

```js
{ id: 'escalate', kind: 'domain', module: 'm05', label: 'Escalate',
  ins: [{name: 'cost', unit: '$M'}, {name: 'rate', unit: '%'}, {name: 'years', unit: 'yr'}],
  out: {unit: '$M'}, fn: (cost, rate, years) => cost * (1 + rate) ** years,
  earnedFrom: ['esc-compound'] }
```

`kind` is `primitive`, `domain`, or `tool`.

**Primitives** (always available): `Add`, `Subtract`, `Multiply`, `Divide`, `Power`, `Log`, `Log2`, `Exp`, `Sqrt`, `Min`, `Max`, `Constant`, `Range(a,b)`, `Sum`, `Mean`, `Count`.

**Broadcasting:** arithmetic primitives accept scalar or list for any argument; list-list operations are element-wise and require equal length (else error). No loop/map node exists.

**Tool nodes:** owning the Tables tool unlocks `NormalCDF(z)`.

**Domain nodes** and the templates that earn them:

| Domain node | Earned from |
|---|---|
| `Escalate`, `IndexConvert` | esc-compound, esc-index |
| `PowerCER` | cer-power |
| `LCUnit`, `LCLotTotal`, `LCSlope` | lc-unit, lc-lot, lc-slope |
| `LinFit`, `Predict` | reg-fit |
| `TriMean`, `TriSD`, `RSS` | tri-stats, risk-sum |
| `ExpectedValue`, `StdDev`, `CV` | expected-value, stats-cv |
| `NPV`, `AnnuityPV` | npv, pv-annuity |
| `CPI`, `SPI`, `EAC`, `TCPI` | evm-eac, evm-tcpi |
| `CPIFFee`, `FPIFPTA`, `BreakEven`, `ABCRate` | cpif-fee, fpif-pta, make-buy, abc-cost |

Templates without their own earned node (analogy-scale, normal-prob, mfg-labor, sw-effort) are automated with primitives and nodes earned elsewhere. The implementation plan finalizes exact port lists per node from the template formulas.

### Pipelines

```js
{ tpl: 'esc-compound',
  steps: [ { node: 'escalate', args: { cost: 'in.base', rate: 'in.rate', years: 'in.years' } } ],
  outs: { 'Then-year cost': 's0' } }
```

Argument refs: `in.<name>` (contract input), `s<i>` (output of an earlier step, `i` less than the current index), or `{c: <number>}` (constant). Forward or dangling refs are invalid.

A pipeline is stored as a shop record (`pipe-<tpl>`) in `Store.data.shop` with `steps`, `outs`, `stepCount`, `primitivesOnly`, `passed`, and `t`, so it syncs through the existing per-record merge (newer `t` wins).

## Rules

- **Gate:** a template's pipeline slot opens after 3 hand-solved contracts of that template with score 1.0 (within 1%). Campaigns do not count.
- **Validation:** run the pipeline on 5 freshly seeded contracts of that template, spread across unlocked tiers. Pass means every answer on every contract is within 1%. Seeds are derived from profile, template and attempt count so reruns vary.
- **Earning:** passing with a primitives-only pipeline unlocks that template's domain nodes (records `node-<id>`). The unlocked node uses the canonical `fn`, not the learner's graph.
- **Step count** is stored for sub-project 2's upkeep; it has no effect yet.
- `running` status in this sub-project means saved and passed.

## UI

**Workshop panel** on the shop tab: every unlocked template with status `locked n/3`, `ready`, or `running`. Tapping opens `#/shop/pipe/<tplId>`. Follows existing HTML-string + in-place binding style in `js/shop/ui.js`.

**Builder, three bands:**

1. **Inputs** - named inputs of a live sample contract with values; reroll button.
2. **Chain** - step cards. Each card: node picker (palette sheet grouped Primitives / Earned / Tools, showing all unlocked nodes), one slot per port (dropdown of inputs, earlier steps, or constant), and a live computed output on the sample contract. Controls: add step (append), move up/down, delete.
3. **Outputs** - bind each answer label to a step.

**Layout:** below 900px, cards stack vertically with arrow connectors; at 900px and wider, left-to-right with CSS wires. Same markup, CSS only.

**Feedback:**
- Deleting or moving a step so a ref breaks marks the dependent slot red; no silent rewiring.
- Unit mismatch between a source and a port shows a soft warning, never blocks.
- Node errors (length mismatch, domain error like log of negative) show on the card and yield no value.
- Test run shows 5 rows with the existing green/yellow/red accuracy bands and % off, never the expected value, plus a "Review the lesson" link to the template's Learn section.
- On a primitives-only pass: collapse animation (steps merge into the earned node block), node unlock notice.

## Testing (Node `assert`, `npm test`)

- **Refactor snapshot:** capture `gen()` output for fixed seeds, all 23 templates x 3 tiers, before refactor; must match exactly after.
- **Solvability:** a reference primitives-only pipeline for every template passes validation across many seeds. A reference domain-node pipeline for every template also passes.
- **Nodes:** each domain node against hand-checked values; primitive broadcasting for scalar/list mixes and length-mismatch errors.
- **Anti-cheese:** constant-output pipeline fails; dangling and forward refs rejected.
- **Gate and persistence:** 3-solve gate counts only score 1.0 hand solves of that template; pipeline and node records survive storage merge; node unlock is deterministic.
