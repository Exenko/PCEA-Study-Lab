PCEA.addModule({
  id: 'm04', num: 4, title: 'Data Collection and Normalization', short: 'Data & Normalization', source: 'guide',
  blurb: 'Collect and normalize cost, technical, and programmatic data so historical data points are comparable with each other and with the new system.',
  intro: String.raw`**An estimate is only as good as its data.** This module covers what data to collect, where to find it, what makes data usable, and how to **normalize** it so historical data points can be compared with each other and with the new system.

**Core principle**: raw cost numbers are meaningless without context (technical and programmatic data) and normalization (adjusting to a common time, quantity, content, and state of development basis). Poor data discipline is one of the most common sources of estimate error.

**Links to other modules**: Module 5 (Inflation/Escalation) covers the detailed mechanics of cost normalization. Module 7 (Learning Curves) depends on properly normalized quantity data. Module 8 (Regression) and Module 9 (CERs) require normalized, homogeneous datasets before a valid CER can be fit.`,
  sections: [
    {
      id: 'importance', title: 'Why data matters', summary: 'The foundation of every estimate',
      body: String.raw`Every estimating method — analogy, parametric/CER, and engineering build-up — ultimately rests on **historical data**. The GAO Cost Estimating and Assessment Guide and the CEBoK stress that an estimate is only as good as the data underlying it: strong methodology cannot compensate for bad, irrelevant, or misunderstood data.

Estimators must spend significant time and rigor on data collection because it directly drives the **credibility** and **defensibility** of the resulting estimate.

### Key Principles

- **Relevance**: data must apply to the system/technology/scope being estimated.
- **Accuracy**: data must be correct, traceable, and verifiable back to a source.
- **Timeliness**: data should reflect current conditions or be normalized to current conditions.
- **Sufficiency**: enough data points must exist to support a statistically meaningful conclusion (especially for CER development).
- **Understanding context**: raw numbers are meaningless without understanding what is/is not included (scope), the conditions under which they were generated, and any anomalies.
- **Iterative collection**: data collection continues throughout the estimate's life as more information becomes available, and it should be documented so someone else can trace how the number was derived.

+++

### The Aircraft Example

CEBoK commonly illustrates with an aircraft development/production example: cost, technical, and programmatic data (e.g., empty weight, speed, engine type, quantities produced, contract type, production rate) are collected across historical aircraft programs. A single "cost" number (e.g., total program cost) is not useful in isolation — it must be paired with the technical and programmatic facts (how many built, what capability, what year, what contract structure) that explain why the cost was what it was. Without that context, the estimator cannot judge whether the data point is analogous to the new system or how to normalize it.

:::check
Q: Which step of an estimate typically consumes the most time?
- Report writing
* Data collection and normalization
- Running the model
- Presenting results
> Finding, understanding and normalizing data dominates the effort in most estimates.
:::

+++

:::check
Q: Which is the primary reason to collect and document data sources?
* To support traceability and credibility of the estimate
- To satisfy a contractual requirement
- To build a database for future projects
> Traceability is essential for a defensible estimate that others can review and understand how the number was derived.
:::`
    },
    {
      id: 'types', title: 'Types of data', summary: 'Cost, technical, programmatic, and quality dimensions',
      body: String.raw`### Cost, Technical, and Programmatic

Three broad categories of data are collected for every estimate:

| Type | Examples |
|---|---|
| **Cost** | Dollars, labor hours, material costs, rates, by WBS element and time period |
| **Technical** | Weight, power, speed, lines of code, materials, performance, complexity, TRL |
| **Programmatic** | Schedule, quantities, production rate, contract type, acquisition strategy, number of test articles |

**Why all three?** Technical and programmatic data provide the **context** that makes cost data usable and normalizable. You cannot normalize for quantity without programmatic data on lot size, or normalize for content without technical data on what was actually built.

+++

### Primary versus Secondary

- **Primary data**: obtained directly from the original source (e.g., a contractor's cost accounting system, direct interview with a program's cost analyst, original contract documents). Generally more accurate and reliable.
- **Secondary data**: obtained from a source that compiled or summarized data originally collected by someone else (e.g., a database, a published report, another analyst's estimate). Easier to get, but may be processed, aggregated, or undocumented. Requires more scrutiny.

### Quantitative versus Qualitative

- **Quantitative data**: numeric (e.g., cost in dollars, weight in pounds, number of units).
- **Qualitative data**: descriptive/non-numeric (e.g., contract type, manufacturing process, program comments, "high risk" designation). Can be converted into **dummy variables** or complexity factors.

### Objective versus Subjective

- **Objective data**: verifiable facts, independent of opinion (e.g., actual measured weight, actual recorded cost).
- **Subjective data**: judgment-based (e.g., an engineer's opinion on technology maturity, an expert's estimate of percent complete).

Objective data is generally stronger evidence, but subjective/expert opinion data is often necessary, especially early in a program.

+++

### Quality Ranking

Not all data of the same "type" is equal. A general credibility ranking (from CEBoK) runs roughly:

1. **Primary, objective, quantitative** data (strongest)
2. Secondary, objective, quantitative data
3. Primary, subjective/qualitative data
4. Secondary, subjective/qualitative data (weakest, requires most scrutiny)

:::check
Q: A contractor's own accounting records for a completed program are…
* Primary data
- Secondary data
- Subjective data
- Programmatic data only
> They come directly from the original source.
:::

:::check
Q: Production rate and contract type are examples of which data category?
- Cost
- Technical
* Programmatic
> They describe how the program is run, not what the system is or what it cost.
:::`
    },
    {
      id: 'considerations', title: 'Data quality considerations', summary: 'Availability, accessibility, validity, constraints, and pitfalls',
      body: String.raw`| Consideration | Question to Ask |
|---|---|
| **Availability** | Does the data exist at all, at the WBS level I need? |
| **Accessibility** | Can I get it? (proprietary data, classification, organizational barriers) |
| **Validity** | Is it accurate, complete, and relevant to my system? |
| **Constraints** | Time, budget, and security or proprietary limits on use |

These four considerations determine whether data can realistically be obtained and used in an estimate.

+++

### Common Pitfalls

- **Accepting data at face value** without understanding its scope or context.
- **Inconsistent definitions**: "engineering" includes different things in different companies.
- **Hidden content differences**: the data includes (or excludes) spares, support equipment, or fee.
- **Mixed dollar types**: then-year and constant dollars combined without normalization.
- **Using budgets as actuals**: budgets are plans, not what was actually spent.
- **Too few points**, or **non-homogeneous** data (different technologies mixed together).
- **Stale data** that no longer reflects current processes.
- **Not recording the source and context** — making the estimate non-traceable and non-defensible.
- **Relying on a single data point** or very small sample as if it were statistically robust.
- **Mixing data** collected under different definitions without reconciling them.

+++

:::check
Q: You collect "cost" for 8 satellites, but 3 values are contract budgets and 5 are final actual costs. What's the problem?
- None, both are cost data
* Budgets aren't actuals, so the data set is inconsistent
- It's primary vs. secondary data, which is fine
> Budgets are plans. Mixing them with actuals misrepresents what things really cost and distorts trends.
:::

:::check
Q: Program A reports airframe cost \$50M for 100 units, Program B reports \$60M for 50 units. Can you directly compare them?
- Yes, Program A is cheaper
* No, they differ in quantity, so normalization is needed
- Yes, if they are from the same year
> Different quantities have different unit costs due to learning. You must normalize to a common point before comparing.
:::`
    },
    {
      id: 'process', title: 'Data collection process and sources', summary: 'The structured workflow and where to find data',
      body: String.raw`### The Structured Workflow

Before collecting data, follow these steps:

1. **Understand the total picture**: the system, its technical characteristics, its program structure, acquisition strategy, and the purpose of the estimate. This understanding drives what data is actually needed.
2. **Define the estimate structure**: the **Work Breakdown Structure (WBS)** (or Cost Element Structure/CES) defines the framework the estimate is built around. Data collection should be organized around this structure.
3. **Identify data needs**: for each WBS element and chosen method (analogy, parametric/CER, or engineering build-up), determine what data is needed. Different methods have different requirements.
4. **Develop a data collection plan**: a formal documented plan specifying what data is needed, from which sources, using what methods (interviews, document review, database queries, surveys), the schedule for collection, and how data quality will be verified. Having a plan improves consistency, ensures traceability, and helps manage time/resources.

+++

### Data Needs for CER Development

To build a defensible Cost Estimating Relationship, you need:

- A sufficient number of historical data points (more points generally improve statistical confidence).
- Data on the dependent variable (cost) and candidate independent variable(s)/cost drivers (e.g., weight, power, lines of code) for each data point.
- Data that is **normalized** to a common basis (same content, same units, same point in time/dollars) so the relationship reflects a true underlying driver relationship rather than noise from inconsistent definitions.
- **Homogeneous** data — all points should represent genuinely comparable/analogous systems (mixing fundamentally different technologies undermines validity).

+++

### Sources of Data

Cost, technical, and programmatic data come from a range of sources, each with different strengths:

| Source | Typical Strength | Typical Weakness |
| --- | --- | --- |
| **Contractor cost records** | Primary, objective, detailed | Access/proprietary restrictions |
| **Government cost databases** | Convenient, often pre-normalized | May obscure original definitions/context |
| **Program office records** | Good programmatic context | Budget data may not equal actual cost |
| **SME interviews** | Fills gaps, adds context | Subjective, potential bias |
| **Published/industry literature** | Broad technical coverage | Variable reliability, commercial vs. defense mismatch |
| **Prior estimates** | Consistency with past work | May be stale/outdated |

In DoD contexts, key sources include:
- **CSDR** (Cost and Software Data Reporting): the main source of contractor actual costs by WBS (includes CCDR/"1921" forms, FlexFiles, SRDR).
- **EVM reports** (IPMDAR / formerly CPR) on cost and schedule performance.
- **Central repositories** (e.g., DoD's CADE).
- **Budget documents** and Selected Acquisition Reports (SARs).
- **Contracts, proposals, and accounting records**.
- **Engineering and technical documents** (specs, drawings, test reports).

:::check
Q: Which DoD reporting system is the main source of contractor actual costs by WBS for major programs?
- SAR
* CSDR (CCDR / FlexFiles / SRDR)
- PPBE
- EVM reports only
> Cost and Software Data Reporting provides contractor costs by WBS element, hours, and software data.
:::

:::check
Q: For a CER, which is preferable: 3 high-quality primary data points or 10 secondary data points from a government database?
- Always use the 10 points
* Quality and homogeneity matter more than quantity alone; prefer the 3 if they are truly primary and directly relevant
- Both are equally valid
> Fewer data points of known, consistent quality are generally preferable to more points of uncertain origin or mixed definitions.
:::`
    },
    {
      id: 'normalization', title: 'Data normalization', summary: 'Adjusting data for apples-to-apples comparison',
      body: String.raw`**Normalization** is the process of adjusting collected data so that all data points are placed on a **consistent, comparable basis** before they are used for analysis. Without normalization, apparent differences between data points may simply reflect differences in scope, timing, quantity, or units rather than true cost differences.

### The Key Normalization Groupings

| Normalization | What It Fixes | How |
|---|---|---|
| **Cost (inflation)** | Different years' dollars | Convert to a common **base year** with inflation indices (Module 5) |
| **Quantity** | Costs at different production quantities | Use learning curves to adjust to a common point (e.g., T1 or unit 100) (Module 7) |
| **Sizing** | Different system sizes | Express per unit of size, or include size as a CER driver |
| **Content** | Different scope in the "same" element | Map to a common WBS; add or remove content (e.g., strip out spares or fee) |
| **State of development** | Prototype vs. production, new design vs. modification | Separate groups, dummy variables, or adjustment factors |
| **Key groupings / units** | Non-homogeneous data / mixed units | Group by technology, mission, contractor, era; ensure consistent units |

**Why this matters**: To validly compare two data points, they must be normalized/checked across **all relevant dimensions simultaneously**: same time basis, same quantity basis, same content/scope, same units of measure, and same state of development/maturity. Missing any one of these dimensions can invalidate an otherwise careful comparison.

+++

### Cost Normalization (Inflation)

Adjusting cost data for the time value of money/purchasing power so that costs from different years can be compared on a common (e.g., constant-year or base-year) dollar basis. This uses inflation indices and is covered in detail in Module 5.

**Example**: Data point A: \$50M in 2015 dollars. Data point B: \$55M in 2022 dollars. Different years' dollars have different purchasing power. Convert both to a common base year (e.g., 2024) using inflation indices before comparing.

### Quantity Normalization (Learning Curves)

Adjusting cost data to account for differing production quantities, since unit cost typically changes with quantity due to learning/experience effects.

**Worked Example**: Program A reports a unit cost of \$120,000 for the 50th unit produced. Program B reports a unit cost of \$150,000 for the 10th unit produced, both otherwise analogous. Comparing directly would incorrectly suggest Program A is cheaper. Using an 85% learning curve ($b = \ln(0.85)/\ln(2) \approx -0.2345$) to normalize both to Unit 1:
- Program A: $T_1 = y_{50}/50^{b} = 120{,}000 / 50^{-0.2345} \approx 120{,}000 / 0.3996 \approx 300{,}300$
- Program B: $T_1 = y_{10}/10^{b} = 150{,}000 / 10^{-0.2345} \approx 150{,}000 / 0.5827 \approx 257{,}400$

After normalizing to Unit 1, Program B is actually lower-cost (~\$257K vs. ~\$300K).

### Content Normalization

Adjusting data so that each data point reflects the same defined scope of work/deliverables. Historical programs frequently differ in what is included in a reported "cost" figure.

**Example**: Program X reports total procurement cost of \$80M for 10 aircraft, which includes \$8M of spare parts. Program Y reports \$70M for 10 aircraft, flyaway cost only (no spares). To compare on a common content basis, remove the spares from Program X: \$80M − \$8M = \$72M flyaway-equivalent, now directly comparable to Program Y's \$70M.

### State of Development Normalization

Data must be normalized for the **maturity/state of development** of the technology or program at the time the data was generated. A cost recorded during initial development/first-article production (immature process, low rate, engineering changes still occurring) is not directly comparable to a cost recorded once the program has reached mature, stable, high-rate production.

+++

:::check
Q: Data point A: \$50M in 2015 dollars. Data point B: \$55M in 2022 dollars. What must you do before comparing them?
* Convert both to the same base year using inflation indices
- Nothing, dollars are dollars
- Average them
> Different years' dollars have different purchasing power. Normalize with inflation indices before comparing.
:::

:::check
Q: One missile's unit cost is the average of units 1–50, another's the average of units 400–600. What normalization is needed?
- Inflation
* Quantity (learning curve) normalization
- Content normalization
> Average costs at different points on the learning curve aren't comparable. Adjust both to a common unit.
:::`
    },
    {
      id: 'recurring', title: 'Non-recurring vs. recurring cost', summary: 'Why separation matters before analysis',
      body: String.raw`Proper normalization requires separating **non-recurring** cost from **recurring** cost **before performing any quantity-based analysis** (especially learning curves).

- **Non-recurring cost**: costs incurred once, independent of the number of units produced (e.g., R&D, design, development, tooling, initial engineering, qualification testing, first-article production setup).
- **Recurring cost**: costs incurred repeatedly, generally proportional to (and varying with) the number of units produced (e.g., direct labor, materials, and other per-unit production costs).

### Why Separation Matters

**Learning curves apply only to recurring costs.** Non-recurring costs are fixed and do not decline with quantity. If recurring and non-recurring costs are left mixed into per-unit cost figures, they distort the apparent unit cost trend and produce an inaccurate or meaningless learning curve fit.

**Example**: Program C reports a unit cost of \$100,000 for 5 units, and \$60,000 for 50 units. If these figures include a mix of recurring production cost and non-recurring tooling cost, and the tooling cost was large in the first run but spread across more units in the second run, the raw trend overstates the learning effect. Separating the non-recurring tooling from the per-unit recurring production cost reveals the true learning rate and allows a valid curve fit.

+++

:::key
**Before fitting a learning curve or analyzing unit-cost trends, always separate recurring from non-recurring costs.** Combining them produces distorted or meaningless results.
:::

:::check
Q: Which is a **recurring** cost?
- Design engineering
- Special tooling
* Production touch labor per unit
- Qualification testing
> Recurring costs repeat with each unit produced.
:::

:::check
Q: Why does mixing recurring and non-recurring costs distort a learning curve analysis?
* Non-recurring costs don't decline with quantity, so mixing them obscures the true learning rate
- Learning curves don't apply to either type
- Recurring costs are easier to estimate than non-recurring
> Learning curves model the per-unit production cost improvement. Non-recurring costs (fixed per program) would make the trend appear flatter than it really is.
:::`
    },
    {
      id: 'practice', title: 'Putting it together', summary: 'Common mistakes and a normalization checklist',
      body: String.raw`### Common Mistakes

1. **Comparing unnormalized cost data** — comparing then-year dollars, different quantities, or different scopes directly, producing invalid conclusions.
2. **Ignoring content differences** — pooling data where one source includes spares/support and another does not.
3. **Failing to separate recurring from non-recurring cost** before analyzing production cost trends or fitting learning curves.
4. **Treating secondary data as equivalent to primary data** without understanding how it was compiled or what definitions were used.
5. **Skipping the "total picture" step** — collecting data before understanding the estimate structure/WBS, leading to wasted effort or gaps.
6. **Using data without documenting its source**, making the estimate non-traceable and hard to defend in review.
7. **Ignoring state-of-development differences**, e.g., comparing a prototype unit's cost to a mature full-rate production unit's cost without adjustment.
8. **Mixing units of measure** (e.g., kilograms vs. pounds, then-year vs. constant dollars) without converting first.
9. **Relying solely on subjective/expert data** when objective data is available and could corroborate or replace it.

+++

### Normalization Checklist

Before performing statistical analysis or CER development, review your dataset across all these dimensions:

- ✓ **Time basis**: All costs converted to the same base year (or treated as constant-year)?
- ✓ **Quantity basis**: Learning curves (if applicable) applied to adjust to a common unit (e.g., T1)?
- ✓ **Content/scope**: All data points defined to include/exclude the same elements?
- ✓ **Units of measure**: All weights in the same units, all costs in the same scale?
- ✓ **State of development**: Data points at comparable phases (prototype vs. LRIP vs. full-rate)?
- ✓ **Recurring vs. non-recurring**: Separated before learning curve or unit-cost analysis?
- ✓ **Source documented**: Every data point's source and context recorded?

If any dimension is left unchecked, your conclusion may be invalid.

:::tip
**A normalized data set is homogeneous and comparable.** Each data point can be directly compared to the others without artificial differences from scope, timing, quantity, or units distorting the comparison.
:::

:::check
Q: A cost analysis pooling data from different programs finds a strong cost-to-weight relationship. Before accepting it as a valid CER, what normalization step is most likely still missing?
* Checking that all programs' costs are in the same year/currency basis and all represent the same state of development
- Ensuring all weight data is in the same units
- Calculating a correlation coefficient
> A strong statistical fit (correlation) can be misleading if the underlying data is not normalized. Mixing early-phase and mature-phase production costs, or then-year vs. constant dollars, can produce a spurious trend.
:::

:::check
Q: Your estimate will use a learning curve to normalize cost data from unit 30 to unit 1. Before applying the curve, what key separation must you make?
- Separate cost vs. schedule data
* Separate recurring from non-recurring cost in the reported unit 30 figure
- Separate primary from secondary data sources
> The learning curve formula applies only to recurring (per-unit) cost. If the unit 30 figure includes non-recurring engineering or tooling, the calculated T1 will be wrong.
:::

:::challenge normalize
Q: These eight data points were recorded in different years, lot sizes and units, so the cost-vs-weight scatter is meaningless. Turn on adjustments until $R^2$ is above 0.99.
goal: r2 > 0.99
show: units=1 infl=1 qty=1
> All three are needed: the same units (\$M), the same base-year dollars (BY2026), and the same point on the learning curve (T1). With only units and inflation fixed, lot averages from large lots still sit low. Normalization is what makes the real relationship visible.
:::

:::challenge normalize units=1 infl=1 lock=units,infl,qty
Q: Point 1 was recorded as \$4,317.55K in 2014 dollars. Convert it to \$M and escalate it to BY2026 at 2.5% a year (12 years). What is it worth?
predict: byValue +- 1%
> $4.31755 \times 1.025^{12} = 4.31755 \times 1.3449 \approx 5.81$, so about \$5.81M. Moving to a later base year multiplies by the index ratio; moving to an earlier one divides.
:::`
    }
  ],
  cards: String.raw`
## Importance and Principles
Q: Why is data collection so critical to cost estimating?
A: Every estimating technique (analogy, parametric, engineering build-up) depends on historical data. Poor data gives confident wrong answers; it directly drives estimate credibility and defensibility.
Q: Key principles of data collection
A: Relevance, accuracy, timeliness, sufficiency, understanding context, iterative collection and documentation.
Q: What does the aircraft example illustrate about cost data?
A: A single cost number (e.g., \$30M airframe) is meaningless without technical/programmatic context (how many built, in what year, what included, under what contract). Context makes data interpretable and normalizable.
Q: Why does context matter in data collection?
A: Raw numbers are meaningless without understanding what is/is not included (scope), the conditions under which they were generated, and anomalies. Technical and programmatic data provide this context.

## Types of Data
Q: Three broad categories of data collected for every estimate
A: Cost data (dollars, labor, material), technical data (weight, power, speed, performance), programmatic data (schedule, quantities, production rate, contract type).
Q: Why are all three types needed together?
A: Technical and programmatic data provide the context that makes cost data usable and normalizable. They explain the conditions and scope of the cost data.
Q: Cost data examples
A: Dollars, labor hours, material costs, rates, by WBS element and time period.
Q: Technical data examples
A: Weight, power, speed, lines of code, performance, materials, complexity, TRL.
Q: Programmatic data examples
A: Schedule, quantities, production rate, contract type, acquisition strategy, number of test articles.
Q: Primary vs. secondary data
A: Primary: from the original source (e.g., contractor accounting records), most accurate. Secondary: derived or reported by others (e.g., published summaries), less reliable but more convenient.
Q: Quantitative vs. qualitative data
A: Numeric measurements vs. descriptive/categorical info. Qualitative can be converted into dummy variables or complexity factors.
Q: Objective vs. subjective data
A: Measured/recorded facts vs. judgments (e.g., SME ratings, expert opinions).
Q: Strongest data combination
A: Primary, quantitative, objective.
Q: Data quality credibility ranking (strongest to weakest)
A: 1) Primary objective quantitative · 2) Secondary objective quantitative · 3) Primary subjective/qualitative · 4) Secondary subjective/qualitative.

## Considerations and Pitfalls
Q: Four data quality considerations
A: Availability (does it exist?), accessibility (can I get it?), validity (is it accurate/relevant?), constraints (time, budget, security limits).
Q: Common data pitfalls
A: Accepting data at face value, inconsistent definitions, hidden content differences, mixed dollar types, budgets used as actuals, too few/non-homogeneous points, stale data, no source record.
Q: Why not use budgets as actuals?
A: Budgets are plans, not what was actually spent. Mixing them with actuals misrepresents true costs and distorts trends.

## Data Collection Process
Q: Data collection process steps (in order)
A: 1) Understand the total picture · 2) Define estimate structure (WBS) · 3) Identify data needs (by technique) · 4) Develop a data collection plan.
Q: What is a data collection plan?
A: A documented plan specifying what data is needed, from which sources, using what methods, the schedule, and how data quality will be verified.
Q: Why develop a data collection plan?
A: A documented plan improves consistency, ensures traceability, and helps manage limited time/resources available for the estimate.
Q: Data needed for CER development
A: Cost for many analogous systems + candidate driver values + context to normalize. Data must be homogeneous and consistently defined.
Q: What is the WBS and why does it matter for data collection?
A: Work Breakdown Structure defines the framework the estimate is built around. Data collection should be organized around the WBS so collected data maps directly to cost elements.

## Data Sources
Q: What is CSDR?
A: Cost and Software Data Reporting: the DoD system for contractor actual cost data (CCDR/"1921" forms, FlexFiles) and software data (SRDR).
Q: Major data sources (non-DoD and DoD)
A: Contractor records, government databases (e.g., CADE), program office records, SME interviews, published literature, prior estimates. In DoD: CSDR, EVM reports (IPMDAR/CPR), budgets, SARs, contracts, technical docs.
Q: Strength of contractor cost records
A: Primary, objective, detailed data; weakness is access/proprietary restrictions.
Q: Strength of government cost databases
A: Convenient, often pre-normalized; weakness is they may obscure original definitions/context.
Q: Strength of SME interviews
A: Fills gaps, adds context; weakness is subjectivity and potential bias.
Q: Strength of published/industry literature
A: Broad technical coverage; weakness is variable reliability and commercial vs. defense mismatch.

## Normalization
Q: Purpose of normalization
A: Adjust data so all points are on a consistent, comparable basis before analysis. Differences should reflect true cost behavior, not artifacts of inconsistent definitions.
Q: Cost (inflation) normalization
A: Convert all dollars to a common base year using inflation indices so purchasing power is consistent.
Q: Quantity normalization
A: Adjust costs to a common point on the learning curve (e.g., T1 or unit 100) so unit costs at different production quantities are comparable.
Q: Sizing normalization
A: Adjust for differences in physical size/scale (e.g., cost per pound, cost per square foot) so large and small systems can be compared.
Q: Content normalization
A: Map data to a common WBS and add/remove scope so the "same" element contains the same work across all data points.
Q: State of development normalization
A: Account for prototype vs. production or new vs. modified designs (separate groups, dummies, adjustment factors) because immature-phase costs aren't comparable to mature production costs.
Q: Units of measure normalization
A: Ensure consistent units (all weights in pounds, all costs in millions, all labor in hours) before combining or comparing values.
Q: Key groupings (normalization)
A: Group homogeneous data (by technology, mission, contractor, era) so unlike items aren't mixed. This prevents a flawed CER that pools incomparable systems.
Q: Normalization example: quantity
A: Program A unit 50 cost = \$120K, Program B unit 10 cost = \$150K. Using 85% learning curve: Program A T1 ≈ \$300K, Program B T1 ≈ \$257K. Program B is actually cheaper despite higher raw cost.

## Non-recurring vs. Recurring
Q: Non-recurring cost definition
A: Costs incurred once, independent of quantity produced (R&D, design, development, tooling, qualification testing).
Q: Recurring cost definition
A: Costs incurred repeatedly, proportional to and varying with the number of units produced (direct labor, materials, per-unit production).
Q: Why must recurring and non-recurring costs be separated before learning curve analysis?
A: Learning curves apply only to recurring costs. Mixing non-recurring (fixed, no learning) with recurring distorts the apparent learning rate and produces an inaccurate curve fit.
Q: Effect of mixing recurring and non-recurring costs in unit cost data
A: Makes the unit cost trend appear flatter (less learning) than it actually is, because non-recurring costs are spread across more units at higher quantities.
Q: When is non-recurring cost "absorbed" by quantity?
A: As quantity increases, the per-unit non-recurring cost decreases, but that's an accounting effect, not true learning. Separating them reveals the real learning curve.

## Normalization Checklist
Q: Normalization checklist items (all must be verified before statistical analysis)
A: Time basis (same year) · Quantity basis (learning curve applied) · Content/scope (same elements) · Units of measure (consistent) · State of development (comparable phase) · Recurring vs. non-recurring (separated) · Source documented (traceable).
Q: What happens if you skip normalization on one dimension?
A: The comparison or CER may be invalid. Mixing unnormalized data can produce spurious trends or incorrect conclusions.
Q: A strong correlation found in pooled cost data from different programs
A: Still requires checking that all data is normalized (same year/currency basis, same state of development, etc.). Strong statistical fit can be misleading if underlying data is unnormalized.

## Common Mistakes
Q: Most common data collection mistake
A: Comparing unnormalized cost data (different years, quantities, or scopes) and drawing incorrect conclusions without normalization.
Q: Pitfall: pooling data with mixed definitions
A: Distorts trends and produces invalid CER. All data must reflect the same defined scope and definitions before pooling.
Q: Pitfall: state-of-development differences
A: Comparing prototype costs to mature production costs without normalization falsely suggests one program is cheaper, when actually they are at different phases.
Q: Pitfall: no source documentation
A: Estimate becomes non-traceable and hard to defend in review. Every data point's source and context must be documented.
Q: Pitfall: treating secondary as primary
A: Secondary data requires more scrutiny. Estimator must understand how it was compiled and what definitions it retains before relying on it.
`
});
