PCEA.addModule({
  id: 'm11', num: 11, title: 'Manufacturing Cost Estimating', short: 'Manufacturing',
  source: 'guide',
  blurb: 'Break production cost into functional elements: labor rates and burdening, time standards, learning curves, and material with scrap. Make-or-buy decisions.',
  intro: String.raw`Manufacturing cost estimating builds production cost from **functional elements** (engineering, tooling, production run) and **resource categories** (labor and material).

**Core workflow**: decompose into elements → estimate each via rates, standards, quantity factors (learning) and material takoff → time-phase and adjust for risk.

This module connects Modules 7 (learning curves), 6 (data analysis), and 4 (estimating methods). Unlike R&D estimating, manufacturing costs are heavily **quantity-driven** (learning curve effects), **labor-standard-driven** (time standards, rates), and **material-driven** (bill of materials, scrap).`,
  sections: [
    {
      id: 'process', title: 'Hardware lifecycle and functional cost elements', summary: 'Development cycle, manufacturing operations, cost decomposition',
      body: String.raw`### Hardware Development Cycle

Manufacturing occurs across phases with vastly different cost drivers:

1. **Concept/Design** — engineering defines the product
2. **Engineering & Prototyping** — prototype units built (hand-built, not representative of production rates)
3. **Production Setup** — facilities, tooling, processes established for rate production
4. **Production Run** — recurring manufacture, subject to learning curve improvement
5. **Sustainment/Spares** — follow-on production at lower rates

**Key point**: Costs behave differently across phases. Prototype units are NOT production-representative — mixing them without normalization distorts a learning curve dataset (a common error).

+++

### Manufacturing Operations

Physical processes convert raw material and purchased parts into end items:

- **Fabrication**: forming, machining, casting, molding of individual parts
- **Subassembly**: joining parts and components into subassemblies
- **Final Assembly**: integrating subassemblies into complete end items
- **Test and Inspection**: verifying conformance (quality touches every stage)
- **Packaging and Shipping**

An estimator must understand the operation sequence to build bottoms-up estimates or correctly scale analogy/parametric estimates.

+++

### Functional Cost Elements

Manufacturing cost decomposes into:

| Element | Type | Quantity Dependent? |
|---|---|---|
| **Engineering** | Non-recurring | No |
| **Prototyping** | Non-recurring | No |
| **Facilities** | Non-recurring (setup phase) | No (once established) |
| **Tooling (special)** | Non-recurring | No |
| **Production Labor (touch)** | Recurring | Yes (learning curve) |
| **Material** | Recurring | No (constant per unit, except discounts) |
| **Quality Control** | Recurring | Yes (scales with labor) |

**Recurring** costs scale with unit count; **non-recurring** are one-time, though sometimes allocated across units for pricing.

:::check
Q: Which of these is NON-recurring production setup cost?
- Engineering labor
- Recurring fabrication labor
* Special tooling built for this product
- Material for each unit
> Special tooling is built once, independent of quantity. Recurring labor and material repeat per unit.
:::

:::check
Q: A production break or design change during manufacturing typically affects which cost element most?
* Recurring labor (through learning curve disruption)
- Material cost per unit
- Facilities cost
- Non-recurring tooling cost
> Learning disruptions and partial restarts primarily impact touch labor, not material or one-time costs.
:::

+++

### Prototype vs. Production Cost

Prototypes are hand-built with engineering-driven changes, rework, and different tooling/labor mix. They are NOT representative of the repetitive production process. Including prototype hours in a production learning curve:
- Distorts the T1 value (overstates the true first production unit cost)
- Steepens the fitted slope artificially
- Violates the assumption of consistent, repetitive processes

**Best practice**: Exclude prototype/engineering build hours from the production curve. Estimate prototype cost separately (analogy or engineering buildup), then fit the curve to production units only.

:::widget burden:::

:::challenge burden dl=40 oh=1.1 ga=0.12 fee=0.08 hrs=1000 lock=dl,oh,hrs
Q: The customer's independent estimate uses a wrap rate of **\$110/hr**. Direct labor and overhead are fixed. Adjust G&A and fee to match it within \$1.
goal: wrap ~ 110 +- 1
show: ga=0.2 fee=0.09
> Wrap rate $= DL (1 + OH)(1 + G\&A)(1 + fee) = 84 (1 + G\&A)(1 + fee)$. You need $(1 + G\&A)(1 + fee) \approx 1.31$, for example 20% G&A with a 9% fee. Each rate compounds on the ones before it.
:::`
    },
    {
      id: 'labor', title: 'Labor rates and burdening', summary: 'Fully burdened rate buildup: direct labor, fringe, overhead, G&A, fee',
      body: String.raw`**Labor cost = hours × fully burdened rate.** Getting the rate right is critical.

### Burdening Structure

Labor rates are built by sequentially compounding burden layers applied to the correct base:

1. **Direct Labor Rate** — base wage for the labor category
2. **+ Fringe Benefits** (% of direct labor) — payroll taxes, health insurance, retirement, paid leave
3. **= Labor plus Fringe**
4. **+ Overhead** (% of labor+fringe) — indirect costs of the department (supervision, indirect labor, utilities, depreciation)
5. **= Total Labor Cost**
6. **+ G&A** (% of total cost) — company-wide indirect costs (executive management, accounting)
7. **= Total Cost**
8. **+ Fee/Profit** (% of total cost)
9. **= Fully Burdened Price (wrap rate)**

+++

### Worked Burdening Example

Direct Labor \$30.00/hr, Fringe 35%, Overhead 80% (of labor+fringe), G&A 10%, Fee 8%:

| Layer | Calculation | Amount |
|---|---|---|
| Direct Labor | — | \$30.00 |
| + Fringe (35%) | 0.35 × 30 | \$10.50 |
| **Labor + Fringe** | — | **\$40.50** |
| + Overhead (80%) | 0.80 × 40.50 | \$32.40 |
| **Total Labor Cost** | — | **\$72.90** |
| + G&A (10%) | 0.10 × 72.90 | \$7.29 |
| **Total Cost** | — | **\$80.19** |
| + Fee (8%) | 0.08 × 80.19 | \$6.42 |
| **Wrap Rate** | — | **\$86.61/hr** |

Or: \$30.00 × 1.35 × 1.80 × 1.10 × 1.08 = **\$86.61**

:::key
Each burden % applies to a different cumulative base, not all to the original direct labor rate. Test questions often hide incorrect bases to trap careless arithmetic.
:::

:::check
Q: Direct labor \$40/hr, overhead 110% of DL, G&A 12%, fee 8%. Wrap rate? (2 decimals)
= 101.61 ±0.02
> \$40 × (1 + 1.10) = \$84.00; \$84.00 × (1 + 0.12) = \$94.08; \$94.08 × (1 + 0.08) = \$101.61.
:::

+++

### Labor Rates in Practice

Rates come from **Forward Pricing Rate Agreements (FPRAs)** — pre-negotiated labor and indirect rates used in contractor proposals — or from company accounting data (audited by DCAA in U.S. defense work) and industry surveys. Project them forward with escalation (Module 5).

A labor rate typically applies to a **labor category** (engineer, machinist, assembler, inspector, etc.), each with its own direct rate and possibly different burden rates.

:::check
Q: If a direct labor rate is \$25/hr and your company's overhead rate is 150% of direct labor, what is the "labor plus overhead" cost per hour?
= 62.5
> Labor + Fringe = 25 × (1 + 0) = 25 (assuming no stated fringe). Labor + Overhead = 25 × (1 + 1.50) = 62.50.
:::`
    },
    {
      id: 'composite', title: 'Composite rates and skill mix', summary: 'Blended rates across labor categories, hours-weighted averages',
      body: String.raw`Most programs mix multiple labor categories (engineers, machinists, assemblers, inspectors), each with different direct rates and burden rates.

### Composite Rate Formula

$$\text{Composite Rate} = \frac{\sum (\text{Hours}_i \times \text{Rate}_i)}{\sum \text{Hours}_i}$$

The composite is the **hours-weighted average** rate across all categories.

+++

### Worked Composite Rate Example

| Labor Category | Hours | Burdened Rate | Extended Cost |
| --- | --- | --- | --- |
| Machinist | 400 | \$75/hr | \$30,000 |
| Assembler | 800 | \$60/hr | \$48,000 |
| Inspector | 200 | \$85/hr | \$17,000 |
| **Total** | **1,500** | — | **\$106,000** |

Composite rate = \$106,000 ÷ 1,500 = **\$70.67/hr**

This composite can then be applied to total hours when skill mix is stable. If skill mix shifts with quantity or design maturity, recalculate the composite or apply hours-weighted rates by production lot.

:::check
Q: Assemblers 60% × \$30/hr, Technicians 40% × \$45/hr. Composite direct rate?
= 36
> 0.6(30) + 0.4(45) = 18 + 18 = 36.
:::

+++

### Skill Mix Effects

A shift toward higher-skill labor raises the composite rate **even when each individual rate stays the same**. This is a common cost driver during program evolution (design matures, less rework, shift from touch labor to engineering/inspection).

:::check
Q: At start of production, labor is 80% assembler (\$40/hr), 20% engineer (\$80/hr). At mid-production, design stabilizes and mix shifts to 60% assembler, 40% engineer. Which rate is higher?
* Mid-production rate
- Initial rate
- They are equal
> Initial = 0.8(40) + 0.2(80) = 48. Mid = 0.6(40) + 0.4(80) = 56. Engineering content shifted upward.
:::`
    },
    {
      id: 'standards', title: 'Time standards and performance', summary: 'Development of standards, performance rating, allowances, realization factors',
      body: String.raw`A **time standard** is the time a qualified worker needs to perform a task at normal pace, using a defined method. It is the foundation of bottoms-up labor estimates.

### Development of Time Standards

Common methods:

- **Time study**: stopwatch observation, averaged and adjusted
- **Predetermined Motion Time Systems (MTM, MOST)**: standard time values for elemental body motions, summed
- **Standard data**: historical standards applied by analogy to similar tasks
- **Work sampling**: statistical sampling of work activity to estimate time allocation
- **Historical actual data**: average of recorded times, adjusted for learning

A raw observed time is adjusted to a standard via:

$$\text{Standard Time} = \text{Observed Time} \times \text{Performance Rating} \times (1 + \text{Allowance \%})$$

where **Performance Rating** adjusts for individual worker pace variation, and **PF&D Allowances** (Personal, Fatigue, Delay) are added for unavoidable non-productive time.

:::check
Q: Observed time 50 minutes, performance rating 1.05, PF&D allowance 12%. Standard time in minutes?
= 58.8
> 50 × 1.05 × (1 + 0.12) = 50 × 1.05 × 1.12 = 58.8 minutes.
:::

+++

### Realization and Efficiency Factors

Actual production performance rarely matches the standard exactly, especially early in manufacturing. A **realization factor** (or its inverse, efficiency factor) adjusts standard hours to expected actual hours:

$$\text{Estimated Actual Hours} = \frac{\text{Standard Hours}}{\text{Efficiency Factor}}$$

or equivalently (with realization factor R > 1):

$$\text{Estimated Actual Hours} = \text{Standard Hours} \times R$$

- **Efficiency < 1**: workers take longer than standard (realization > 1)
- **Efficiency = 1**: actual matches standard (unusual; real shops are inefficient early)
- **Efficiency > 1**: workers beat the standard (possible in mature lines with learning)

The realization factor **links standards to learning curves**: the standard is roughly where a mature line ends up.

:::check
Q: Time standard 2.0 hours/unit, realization factor 1.5. Estimated actual hours per unit?
= 3
> 2.0 × 1.5 = 3.0 hours. (Efficiency = 1/1.5 ≈ 67%.)
:::

+++

### Exam Trap: Efficiency vs. Realization

Efficiency factors and realization factors can be expressed either way (divisor < 1 or multiplier > 1). Read the problem carefully:

- "Efficiency of 80%" → actual = standard ÷ 0.80
- "Realization factor of 1.20" → actual = standard × 1.20
- Both mean: actual is 25% higher than standard

:::check
Q: Standard = 2.5 hr/unit, historically shop's efficiency = 0.83. Expected actual hours per unit?
= 3.01 ±0.05
> 2.5 ÷ 0.83 = 3.01 hours. (Or: 2.5 × (1/0.83) = 2.5 × 1.205 = 3.01.)
:::`
    },
    {
      id: 'learning', title: 'Learning curves in manufacturing', summary: 'What learns and what doesn\'t; T1; production breaks',
      body: String.raw`**Full learning curve theory is in Module 7.** This section covers manufacturing-specific application and pitfalls.

### What Learns: Touch Labor

Learning applies to **recurring touch labor** (assembly, fabrication) that improves with repetition under consistent conditions. Typical manufacturing learning curves: 75–90% slopes.

**What does NOT learn**:
- **Material cost per unit**: consumption is a physical/engineering quantity (part still needs the same raw material regardless of how many built), though scrap rates may improve slightly and bulk purchasing yields separate discounts
- **Non-recurring costs**: setup, tooling, facilities are one-time
- **Prototype/engineering units**: different task, different process maturity
- **Highly automated operations**: little human learning to capture
- **Support labor** (quality, planning): often estimated as a **factor of touch labor**, so it inherits the learning

+++

### Production Breaks and Learning Loss

A gap in production can cause **loss of learning**: workforce turnover, process drift, tooling degradation, loss of institutional knowledge.

**Adjustment options**:
1. Assume continuation (short breaks, < 1 month): learning carries forward
2. Partial forgetting: apply a **learning loss factor** (e.g., 30% loss means exponent becomes $b(1 - 0.3)$)
3. Restart on a new curve: treat the post-break lot as a new T1 (acknowledging some retained learning with a lower T1 than original)
4. Complete loss (long breaks, major turnover): return to original T1

A **14-month production gap** is long enough to warrant investigation and adjustment — don't assume smooth continuation.

:::check
Q: Which costs are most affected by a production break?
* Recurring touch labor (through learning disruption)
- Material cost per unit
- Non-recurring tooling
- Facilities overhead allocation
> Breaks disrupt learning in labor; material, setup, and facilities are unaffected per se (though facilities costs may still accrue during idleness).
:::

+++

### Worked Learning Example

First production unit = 500 standard hours, 85% unit curve, $b = \ln(0.85)/\ln(2) = -0.2345$:

$$T_{50} = 500 \times 50^{-0.2345} \approx 500 \times 0.3759 \approx 188 \text{ hours}$$

This hours estimate is then multiplied by the fully burdened labor rate (Section 2) and summed across all units, excluding setup, tooling, and material costs (estimated separately).

:::check
Q: T1 = 800 hr, 90% curve. Hours for unit 20? ($b = -0.1520$)
= 507.4 ±0.5
> $800 \times 20^{-0.1520} = 800 \times 0.6341 = 507.3$ hours.
:::

+++

### Rate Changes and Design Changes

- **Rate theory** adds production rate (units/month) as a second variable: $Y = aX^b R^c$. Watch for **multicollinearity** (X and R often move together, inflating standard errors).
- **New work** mid-production: $Y_X = a_1 X^{b_1} + a_2(X - X_{last})^{b_2}$ (new component starts its own curve).

:::widget lc-explorer:::`
    },
    {
      id: 'material', title: 'Material cost estimating and scrap', summary: 'Material types, scrap rates, usage allowances, material take-off lists',
      body: String.raw`### Material Categories

Manufacturing materials:

- **Raw materials**: bar stock, sheet, composites, resins — cost driven by commodity prices and weight/volume
- **Purchased parts**: standard components (fasteners, connectors, COTS electronics) — cost from vendor quotes
- **Subcontracted items**: major assemblies built by suppliers (related to make-or-buy)

### Exotic and Composite Materials

- **Composite** (carbon fiber): higher raw cost, can reduce weight/part count, but fabrication labor differs from metals
- **Exotic** (titanium, high-temp alloys, rare composites): higher \$/lb, harder to machine (tool wear, scrap), longer lead times

**Estimating impact**: Adjust both material cost (higher \$/lb) and labor/tooling standards (slower, more scrap) relative to conventional metals. Do not borrow metal-fabrication time standards for exotic materials.

+++

### Scrap and Material Usage Allowance

Raw material is consumed in fabrication (cutting waste, defective parts, rejected units). You must buy more than needed to yield the required finished quantity.

**Scrap rate formula** (scrap as % of raw material input):

$$\text{Material Required} = \frac{\text{Net Material Needed}}{1 - \text{Scrap Rate}}$$

**Alternative: usage allowance** (% added to requirement):

$$\text{Material Required} = \text{Net Material} \times (1 + \text{Allowance})$$

These give slightly different results; the exam may test recognition of which convention applies.

+++

### Worked Scrap Example

Net material needed: 10 lbs. Scrap rate: 20% of raw input.

$$\text{Required} = \frac{10}{1 - 0.20} = \frac{10}{0.80} = 12.5 \text{ lbs raw material}$$

Usage allowance = 12.5 − 10 = 2.5 lbs, or a **1.25 factor** on net material cost.

At \$8/lb raw: cost per part = 12.5 × \$8 = **\$100** (vs. naive 10 × \$8 = \$80, which understates cost).

:::check
Q: A part's net material = 6.5 lbs, scrap rate = 18% (of input). Lbs of raw material to purchase per part?
= 7.93 ±0.05
> 6.5 / (1 - 0.18) = 6.5 / 0.82 = 7.93 lbs.
:::

+++

### Material Take-Off List

A **Material Take-Off (MTO)** or **bill of materials (BOM)** is the itemized list of every part and component needed per end item, with quantities and costs.

| Item | Qty/Unit | Unit Cost | Scrap Factor | Extended |
| --- | --- | --- | --- | --- |
| Bracket, Al 6061 (machined) | 2 | \$12.00 | 1.10 | \$26.40 |
| Fasteners (purch.) | 8 | \$0.50 | 1.00 | \$4.00 |
| Composite panel (layup) | 1 | \$85.00 | 1.15 | \$97.75 |
| **Total Material/Unit** | | | | **\$128.15** |

The MTO is derived from engineering drawings and is the foundation of bottoms-up material estimating. Sum extended costs (with scrap factors) to get total material per unit, then multiply by quantity. **Material cost generally does NOT follow learning curves** (quantity discounts are separate and are not the learning curve mechanism).

:::check
Q: Rough part requires 100 lbs net, scrap 15% of input. Finished part required \$80/lb. Cost per part (material only)?
= 9200 ±100
> Raw required = 100 / (1 - 0.15) = 100 / 0.85 = 117.65 lbs. Cost = 117.65 × 80 = 9,412 dollars (≈ 9200 allows for rounding).
:::`
    },
    {
      id: 'makebuy', title: 'Make-or-buy decisions', summary: 'Cost comparison, breakeven analysis, decision factors',
      body: String.raw`A **make-or-buy** decision chooses whether to produce an item in-house ("make") or purchase from a supplier ("buy").

### Decision Drivers

Beyond cost:

- **Cost**: compare in-house fully burdened cost vs. supplier price (plus procurement overhead)
- **Capacity**: in-house capability and available capacity
- **Core competency**: retain strategically important (proprietary, critical-path) items in-house
- **Quality/schedule risk**: supplier reliability and lead times
- **Sunk investment**: existing tooling/facilities favor "make" if capacity exists
- **Strategic sourcing**: industrial base, source diversification, government sourcing preferences

**Caution**: lowest unit price does NOT always drive the decision.

+++

### Cost Breakeven Analysis

Simple case: make requires incremental tooling investment, but has lower per-unit cost.

**Breakeven quantity:**

$$Q_{breakeven} = \frac{\text{Incremental Tooling Cost}}{\text{Buy Price} - \text{Make Cost/Unit}}$$

**Worked example**: Make for \$90/unit (no incremental tooling currently in hand), buy for \$102/unit, tooling investment needed = \$40,000.

- Below 3,334 units: buy is cheaper (no tooling sunk cost)
- Above 3,334 units: make is cheaper (tooling amortized)
- Breakeven: \$40,000 / (\$102 − \$90) = 3,333.3 units

Sensitivity: if tooling rises to \$60,000, breakeven = \$60,000 / \$12 = 5,000 units.

:::check
Q: Make cost \$75/unit (no tooling investment in hand), buy \$85/unit, new tooling \$30,000. Breakeven quantity?
= 3000
> 30,000 / (85 - 75) = 30,000 / 10 = 3,000 units.
:::

+++

### Mixed Make/Buy Strategies

Programs often use mixed strategies:
- **Buy** long-lead components and COTS items, focusing in-house on **core/critical items**
- **Allocate buy items** in the bill of materials as purchased parts (distinct cost line), **make items** go through the manufacturing cost buildup (labor, material, overhead)
- **Sum both** at the total cost level

:::check
Q: When an item is marked "buy," how does it typically enter the cost estimate?
* As a purchased part from a supplier quote, separate cost line
- Estimated through in-house labor standards and rates
- As overhead allocation (it "doesn't count")
> Buy items are estimated via supplier quotes, then summed; make items use the full buildup.
:::`
    },
    {
      id: 'related', title: 'Related manufacturing topics', summary: 'Quality, Lean, Six Sigma, Agile, IPPD, computer modeling',
      body: String.raw`These topics are part of modern manufacturing but are generally not deeply tested in the PCEA exam. Know the basic ideas and cost implications.

### Quality Assurance and Cost of Quality

Quality management (inspection, testing, process control) woven through manufacturing. **Cost of Quality**:

- **Prevention**: design reviews, training, process improvements (upfront investment, prevents defects)
- **Appraisal**: inspection, testing (cost to verify conformance)
- **Failure**: rework, scrap, warranty costs (internal and external failures)

Early prevention is cheaper than late failures. QC labor is often estimated as a **% of touch labor** (inherits learning curve effects).

### Six Sigma

Data-driven quality improvement methodology (DMAIC: Define, Measure, Analyze, Improve, Control) aimed at reducing process variation and defects (target: 3.4 defects per million opportunities). **Cost effect**: lower scrap, better time standard reliability over a program's life.

### Lean Manufacturing

Philosophy of eliminating waste (non-value-added activity) in production: waste in process steps, inventory, waiting time. **Cost effects**: reduced cycle time, lower WIP inventory, lower touch labor hours.

### Agile Manufacturing

Emphasizes flexibility and rapid response to changing product requirements or demand. Typically applies to small-lot, high-mix environments. **Cost effect**: often higher per-unit cost than high-volume production, but faster adaptability.

### IPPD (Integrated Product and Process Development)

Concurrent engineering: product design and manufacturing process development happen together (not sequentially). **Cost effect**: earlier identification of producibility issues, fewer late design changes, lower rework.

### Computer Modeling and Simulation

Use of CAD, discrete-event manufacturing simulations, and cost models to predict production cost and bottlenecks. **Cost effect**: better trade studies early, earlier producibility insight, fewer surprises late.

### DoD Manufacturing Estimating

U.S. defense programs use specialized cost element structures (separate recurring and non-recurring manufacturing, engineering, tooling, QC, material) and contractor cost data reports (CSDR) to track actuals. These align with natural bases for factors (e.g., QC as a % of manufacturing labor).

:::check
Q: Which quality-improvement method uses DMAIC?
* Six Sigma
- Lean
- IPPD
- Agile
> DMAIC (Define, Measure, Analyze, Improve, Control) is the Six Sigma methodology.
:::

+++

| Topic | Purpose | Cost Implication |
|---|---|---|
| Six Sigma | Reduce variation, defects | Lower scrap, better standards |
| Lean | Eliminate waste | Lower cycle time, lower labor |
| Agile | Flexible response | Higher per-unit cost, faster adaptation |
| IPPD | Concurrent engineering | Fewer late design changes |
| QA/CoQ | Quality management | Prevention cheaper than failure |
| Computer modeling | Process simulation | Better early estimates, fewer surprises |`
    }
  ],
  cards: String.raw`
## Process and Lifecycle
Q: Hardware development cycle stages
A: Concept/Design → Engineering & Prototyping → Production Setup → Production Run → Sustainment/Spares.
Q: Manufacturing functional cost elements (recurring vs. non-recurring)
A: Non-recurring: engineering, prototyping, facilities, special tooling. Recurring: production labor, material, QC.
Q: Why are prototype/engineering unit hours excluded from production learning curves?
A: Prototypes are hand-built with design changes and rework, not process-representative of repetitive production; including them distorts T1 and slope.
Q: Manufacturing operations sequence
A: Fabrication (forming parts) → Subassembly (joining parts) → Final Assembly → Test & Inspection → Packaging.
Q: What is the key difference between prototype and production unit labor?
A: Prototypes are engineering-driven with rework; production is repetitive and standardized (learning applies to production only).

## Labor Rates and Burdening
Q: Burdening structure (order and base)
A: Direct Labor → + Fringe (% of DL) → + Overhead (% of L+F) → + G&A (% of total cost) → + Fee (% of total).
Q: What is a "fully burdened rate" or "wrap rate"?
A: The cost per hour of labor charged to a program, including all burdens (fringe, overhead, G&A, fee).
Q: DL \$40/hr, overhead 110%, G&A 12%, fee 8%. Wrap rate?
A: 40 × (1 + 1.10) × (1 + 0.12) × (1 + 0.08) = 40 × 2.10 × 1.12 × 1.08 ≈ \$101.61
Q: Why does each burden % apply to a different base?
A: Burdens are compounded sequentially; fringe is on direct labor, overhead is on labor+fringe, G&A is on total cost. Applying all to direct labor is incorrect.
Q: What is an FPRA?
A: Forward Pricing Rate Agreement: pre-negotiated labor and indirect rates used in contractor proposals, based on historical data and audit.
Q: Direct labor rate escalation is covered in which module?
A: Module 5 (Escalation).
Q: What labor cost inputs are used in a rate buildup?
A: Direct labor (base wage), fringe benefits, overhead (indirect costs), G&A, and fee/profit.

## Composite Rates
Q: Composite (blended) labor rate formula
A: $\dfrac{\sum(\text{Hours}_i \times \text{Rate}_i)}{\sum \text{Hours}_i}$ = total cost / total hours (hours-weighted average, not simple average).
Q: When is a composite rate used?
A: When a program has multiple labor categories (assembler, machinist, engineer, inspector, etc.) with different rates and the skill mix is expected to remain stable.
Q: Effect of skill mix shift on composite rate
A: Shift toward higher-skill labor raises the composite rate even if individual rates stay the same.
Q: How should composite rates be updated?
A: Recalculate if skill mix changes significantly with design maturity or automation introduction; apply hours-weighted approach per lot if needed.

## Time Standards
Q: Time standard definition
A: The time a qualified worker needs to perform a task at normal pace using a defined method.
Q: Development methods for time standards
A: Time study (stopwatch), predetermined motion time systems (MTM, MOST), standard data (analogy), work sampling, historical actual data.
Q: Standard time formula
A: Standard Time = Observed Time × Performance Rating × (1 + PF&D Allowance \%)
Q: PF&D
A: Personal time, Fatigue, and Delay allowances; typical range 10–20% added to normal time.
Q: What is a performance rating?
A: Adjustment to observed time for individual worker pace variation; 1.0 = normal, <1.0 = slower, >1.0 = faster.
Q: Efficiency vs. realization factor (definition)
A: Efficiency = standard hours / actual hours (<1 means workers take longer). Realization = actual / standard (>1 means slower than standard).
Q: Estimated actual hours (divisor convention): standard = 2.5 hr, efficiency = 0.83
A: 2.5 / 0.83 = 3.01 hours (workers 20% slower than standard).
Q: Why is a realization factor applied to standards?
A: Standards assume perfect conditions; real shops are inefficient early (rework, learning, tool setup). Realization factor bridges standard to expected actual cost.
Q: Relationship between realization factor and learning curves
A: Standards are roughly the mature/steady-state production rate; realization factors model early inefficiency; learning curves model the transition from inefficient early units to the standard.

## Learning in Manufacturing
Q: Which recurring manufacturing costs follow learning curves?
A: Touch labor (assembly, fabrication); NOT material (fixed per unit), NOT non-recurring (setup, tooling), NOT support labor (estimated as % of touch labor).
Q: Why does material cost NOT follow learning curves?
A: Material consumption is a physical/engineering quantity (part requires the same raw material regardless of repetition); scrap may improve but this is separate from learning curve mechanism.
Q: Prototype/engineering unit hours and learning curves
A: Exclude from curve fits (non-representative of production); estimate separately via analogy or buildup.
Q: Production break effects on learning
A: Long breaks (>1 month) can cause learning loss (turnover, process drift); adjust via forgetting factor or restart a new curve; short breaks may assume continuation.
Q: Learning loss model (partial forgetting)
A: $Y = aX^{b(1-\text{loss})}$; exponent shrinks by the loss fraction.
Q: Rate theory equation
A: $Y = aX^b R^c$, where R = production rate and c is regression coefficient; watch for multicollinearity between X and R.
Q: New work added mid-production (equation)
A: $Y_X = a_1 X^{b_1} + a_2(X - X_{last})^{b_2}$ (new component starts its own curve).

## Material Cost Estimating
Q: Three categories of manufacturing materials
A: Raw materials (bar, sheet, composites), purchased parts (fasteners, COTS electronics), subcontracted items (major assemblies).
Q: Challenges of exotic/composite materials (cost estimating)
A: Higher raw cost, harder to machine (tool wear, scrap), longer lead times; must adjust labor/tooling standards, not borrow from metal-fabrication analogs.
Q: Scrap rate definition and formula (as % of input)
A: Material Required = Net Material / (1 − Scrap Rate). Scrap is the fraction of raw input lost to waste/defects.
Q: Net material 10 lbs, scrap 20% of input: raw material required?
A: 10 / (1 − 0.20) = 12.5 lbs raw material.
Q: Usage allowance (alternative convention)
A: Material Required = Net Material × (1 + Allowance \%); used when scrap is expressed as % of output.
Q: Difference between scrap-as-input and scrap-as-output conventions
A: As-input (divide by 1−s) and as-output (multiply by 1+s) give slightly different results; exam may test which convention a problem uses.
Q: Material take-off (MTO) or bill of materials (BOM)
A: Itemized list of every part/component per end item, with quantities and costs; derived from engineering drawings; foundation of bottoms-up material estimates.
Q: Material cost and learning curves (relationship)
A: Material cost generally does NOT follow learning curves; consumption per unit is constant (physical quantity); bulk discounts are separate.

## Make-or-Buy
Q: Make-or-buy decision: what is it?
A: Choosing whether to produce a component/subassembly in-house or purchase from a supplier.
Q: Key decision drivers for make-or-buy
A: Cost (fully burdened in-house vs. supplier quote), capacity, core competency, quality/schedule risk, sunk tooling/facility investment, strategic sourcing.
Q: Breakeven quantity formula (make-or-buy)
A: Q = Incremental Tooling Cost / (Buy Price − Make Cost/Unit)
Q: Incremental tooling \$40,000, buy price \$102, make cost \$90/unit: breakeven?
A: 40,000 / (102 − 90) = 3,333 units; above this, make is cheaper; below, buy is cheaper.
Q: Why is lowest unit price not always the make-or-buy driver?
A: Capacity, core competency, risk, and sunk investment considerations often outweigh pure unit cost.
Q: In a mixed make-buy program, how are costs combined?
A: Buy items → purchased part cost line from supplier quote; make items → full labor/material/overhead buildup; sum both at total cost level.

## Related Topics
Q: Cost of Quality components
A: Prevention (upfront investment), Appraisal (inspection/testing), Failure (rework, scrap, warranty).
Q: Six Sigma (definition and cost effect)
A: DMAIC methodology (Define, Measure, Analyze, Improve, Control) to reduce variation; cost effect = lower scrap, better time standard reliability.
Q: Lean manufacturing (definition and cost effect)
A: Eliminate waste (non-value-added steps, inventory); cost effect = lower cycle time, lower labor.
Q: Agile manufacturing (definition and cost effect)
A: Flexible, rapid-response production (small-lot, high-mix); cost effect = higher per-unit cost but faster adaptation.
Q: IPPD (definition and cost effect)
A: Concurrent product design and process development; cost effect = fewer late design changes, lower rework.
Q: QC labor estimation
A: Usually estimated as a % of touch labor (inherits learning curve effects; scales with production volume).
Q: Discrete-event simulation and cost estimating
A: Predicts manufacturing bottlenecks and production cost; cost effect = better early estimates, fewer late surprises.
Q: DoD manufacturing cost structure
A: Separate recurring/non-recurring manufacturing, engineering, tooling, QC, material; supports factor-based buildup (e.g., QC as % of manufacturing labor).
`
});
