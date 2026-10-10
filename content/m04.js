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

CEBoK lists five key principles:

1. **Comply with how the organization collects data and/or costs.** When estimating for budgets, collect historical budget data to see how it breaks into components; if the organization has an existing data or cost management system, assess that data.
2. **It is not just cost data.** Technical and programmatic data give contextual completeness: they support the cost data, identify cost drivers, support normalization, and build and adjust cost models. Initial vs final costs yield a **Cost Growth Factor (CGF)**; initial vs final schedules yield a **Schedule Growth Factor (SGF)**; initial concept design vs final specifications help set standard margins for space, weight, and power.
3. **Normalization does not assume away or normalize away costs.** This is why reversible operations matter. Normalization adjusts costs, so it must be defensible and well documented.
4. **Collection, normalization, and analysis are not distinct and not linearly sequential.** Creative exploration, non-linearity, and feedback loops help.
5. **The goal is homogeneous data.** Reporting standards such as a common WBS support this, which matters most for the parametric and build-up techniques that lean on historical data.

:::tip Beyond CEBoK
Common data-quality checklists also ask about relevance, accuracy, timeliness, sufficiency, context, and iterative, documented collection:

- **Relevance**: data must apply to the system/technology/scope being estimated.
- **Accuracy**: data must be correct, traceable, and verifiable back to a source.
- **Timeliness**: data should reflect current conditions or be normalized to current conditions.
- **Sufficiency**: enough data points must exist to support a statistically meaningful conclusion (especially for CER development).
- **Understanding context**: raw numbers are meaningless without understanding what is/is not included (scope), the conditions under which they were generated, and any anomalies.
- **Iterative collection**: data collection continues throughout the estimate's life as more information becomes available, and it should be documented so someone else can trace how the number was derived.
:::

**Statistical noise** (unexplained variability) always exists in data; some is irreducible (random fluctuation, measurement error), but rigorous normalization removes reducible noise. CEBoK frames data collection and normalization as a **functional transformation** of raw data into normalized data, and stresses that this transformation must be **reversible**: predicting future cost with normalized historical data requires reversing the normalization steps used on that data. Fig. 4.1 shows this Past → Present → Future flow: raw, un-normalized data is normalized into a defensible, traceable form (Present), then the normalization is reversed to project the Future under new conditions.

+++

### The Aircraft Example

CEBoK commonly illustrates with an aircraft development/production example: cost, technical, and programmatic data (e.g., dry weight, speed, engine type, quantities produced, contract type, production rate) are collected across historical aircraft programs. A single "cost" number (e.g., total program cost) is not useful in isolation — it must be paired with the technical and programmatic facts (how many built, what capability, what year, what contract structure) that explain why the cost was what it was. Without that context, the estimator cannot judge whether the data point is analogous to the new system or how to normalize it.

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

Cost (resource) data is captured in a specified type of dollars and hours, tied to an activity (labor) or product (material). Resources tied to some activities are captured in **cost pools** such as **Overhead (OH)** and **General and Administrative (G&A)**.

+++

### Primary versus Secondary

**Primary data** is obtained from the original source — on-site contractor facility collections, government reports, test centers, or depots. It is unaltered, actual, historical data. Examples: Bills of Materials (BOM), documented test results, documented resource hours to accomplish a task. Primary data is typically the most defensible, highest-quality data a cost estimator can capture.

**Secondary data** is based on primary data but derived, sanitized (for classification/proprietary reasons), or otherwise changed from the original. Examples: documented cost estimates, factors and factor books, studies and white papers, contractor cost report summaries, subcontractor cost data. Secondary data tends to be lower quality for three reasons:

1. the normalization process behind it is unknown;
2. there is a lack of definition associated with the data; or
3. the basis for a factor is old, incomplete, or questionable in some way.

Even so, secondary data is a valuable tool for **cross-checking** other data.

### Quantitative versus Qualitative

**Quantitative** (numeric) data is preferred and is usually objective and measurable, physically or in cost-accounting terms. It has three scales:

- **Ordinal**: rank order only (1st, 2nd, 3rd) — the only valid comparison is greater/less than.
- **Interval**: relative scaling, e.g. the calendar year (1995→2005 is twice as long as 1995→2000), but absolute ratios don't hold. Celsius illustrates this: 30°C to 60°C is a 30-degree interval, and 30 × 2 = 60, but 60°C is *not* twice as hot as 30°C (86°F vs. 140°F; 2 × 86 ≠ 140).
- **Ratio**: supports absolute comparisons, e.g. \$2M is twice \$1M — provided both are normalized to the same year and currency.

**Qualitative** data describes a quality in categorical (**nominal**) terms (e.g., "high risk," "low complexity"); such labels may be disguised as ordinal data. Transform qualitative data into quantitative data, or replace it, when possible. Qualitative data is typically subjective, but can be objective: if all experts asked would agree on the determination, the data is objective; if experts would disagree, it's subjective. A subjective *quantitative* example is a numeric risk score assigned by an engineer.

Labels that look ordinal can actually be interval: soccer jersey numbers index back-to-front on the field (a "2" is a fullback, a "10" a midfielder, a "15" a forward) and are loosely interval, since higher numbers sit further forward. Baseball uniform numbers, by contrast, are neither ordinal nor interval — they are just unique labels.

:::widget scale-sorter:::

### Objective versus Subjective

**Objective data** is usually quantitative and, like primary data, preferred — actual counts from a formal collection process or derived from other quantitative data (e.g., staff hours, Extended Source Lines of Code (ESLOC), Function Points (FPs), test items, documented errors, end items). Objective data can sometimes be qualitative (e.g., U.S. vs. Soviet fighters).

**Subjective data** is based on individual or group feelings/understanding about a condition or characteristic. It tends to be qualitative and typically helps **interpret or validate** objective data; it is valuable for extrapolating from one generation of equipment to the next. Examples: complexity, requirements stability, level of difficulty, degree of new technology involved.

Objective data is generally stronger evidence, but subjective/expert opinion data is often necessary, especially early in a program.

+++

### Quality of Data Types

As programs move from initial budgets to actual costs, data quality improves. From best to worst:

1. **Actuals for completed programs/contracts**, or **Estimates at Complete (EACs)** for contracts greater than 90% complete — though caution is warranted, since some problematic programs wait well beyond schedule to re-baseline, so "90% complete" is not always a clear benchmark.
2. **Schedule B contract line item prices** — not as good as later EACs, because these prices don't reflect what was actually spent; they generally represent the EAC at 0% complete.
3. **Historical/original budget data** — the lowest quality, because budget data is not the actual spent cost, and most budget data exists at a level too high to be useful.

:::tip Beyond CEBoK
A commonly-used shorthand credibility ranking (not from CEBoK) cross-cuts primary/secondary with objective/subjective: (1) primary objective quantitative, (2) secondary objective quantitative, (3) primary subjective/qualitative, (4) secondary subjective/qualitative. It's a useful mental model, but CEBoK's own ranking above is based on how far along the program is (actuals → EACs → contract line items → budgets), not on this 2x2.
:::

:::widget data-quality-ladder:::

### Aircraft Example (Fig. 4.2 / Fig. 4.3)

The MIL-HDBK-881A aircraft Work Breakdown Structure (Fig. 4.2) is a well-established standard WBS that keeps data providers and estimators in sync. Its elements also transfer to other systems with similar subsystems (structure, propulsion, electrical, communications, navigation/guidance) — for example, a satellite or even a school bus.

Fig. 4.3 frames the data-source/data-type distinction using two aircraft from two manufacturers:

| Aircraft | Primary source | Secondary source | Objective data | Subjective data |
|---|---|---|---|---|
| 1 | Manufacturer A | FAA study | Dry weight | Complexity |
| 2 | Internal (government) | Internet search | Maximum velocity | Construction quality |

For aircraft 1, primary data direct from Manufacturer A is ideal; an FAA study is an acceptable but non-ideal secondary fallback. For aircraft 2, Manufacturer B is missing key data, so internal governmental (FAA) data is the ideal source, with internet data (carefully scrutinized) as a secondary fallback. Complexity and construction quality are both hard to quantify but useful for interpreting the data further.

### Contextual Completeness

Cost numbers alone are not enough — estimators need the technical, programmatic, and other context that gives the number meaning. That combination is **contextual completeness**.

**Good example 1**: a 1998 Dodge Ram 1500 regular cab 4x4 truck — standard configuration, 40/60 split cloth seats, optional power package, optional tow package, manual transmission — for \$18,500 in March 1998, excluding \$750 shipping/destination. Quantity, model, accessory packages, the fiscal year of the dollars, and what's excluded are all identified, so a cost estimator can work through any content differences against other trucks.

**Good example 2**: fabrication of sub-assembly "XYZ" took 99.5 labor hours for the 1st unit, 89 hours for the 5th, and 84 hours for the 10th, with material cost constant at \$2,350 (FY01) per assembly. Reporting labor *hours* rather than labor cost matters, because labor rates vary by skill, contractor, and location; the estimator can apply a rate later. Because the 5th-to-10th unit is a doubling of quantity, the simple ratio 84/89 ≈ 94.4% gives a quick estimate of the learning curve slope (a full regression of all the data is the better estimate). See Module 7 (Learning Curves).

**Poor example**: "O&M utilities cost \$36,500." The activity behind the number is unknown — electric utilities or a communication lease? one facility or the whole base? what year? monthly or annual? Any of these gaps makes the data effectively unusable.

:::widget context-sorter:::

:::check
Q: Which step of an estimate typically consumes the most time?
- Report writing
* Data collection and normalization
- Running the model
- Presenting results
> Finding, understanding and normalizing data dominates the effort in most estimates.
:::

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
:::

+++

:::check
Q: Which is the best-quality historical data source, per CEBoK's Quality of Data Types?
* Actuals for a completed program
- Historical/original budget data
- Schedule B contract line item prices
- An EAC on a contract at 20% complete
> Actuals (and EACs beyond ~90% complete, with caution) rank above contract line item prices, which rank above budget data.
:::

:::check
Q: Why is secondary data generally lower quality than primary data?
* Its normalization is unknown, it lacks definition, and its factor basis may be old or incomplete
- It is always more expensive to obtain
- It cannot be used for cross-checking
> These three reasons make secondary data less defensible, though it remains useful for cross-checks.
:::

:::check
Q: \$2M is twice \$1M. This is an example of which quantitative scale?
- Ordinal
- Interval
* Ratio
> Ratio scales support absolute comparisons, provided both values are normalized to the same year and currency.
:::

:::check
Q: 30°C to 60°C is a 30-degree difference, but 60°C is not twice as hot as 30°C. This illustrates which scale?
- Ratio
* Interval
- Ordinal
> Interval scales support relative comparisons but not absolute ones (86°F vs. 140°F, not a doubling).
:::

:::check
Q: A numeric risk score assigned by an engineer is an example of…
- Objective quantitative data
* Subjective quantitative data
- Objective qualitative data
> It's numeric (quantitative) but based on judgment (subjective).
:::

:::check
Q: In the Fig. 4.3 aircraft example, dry weight and construction quality are, respectively…
* Objective and subjective
- Subjective and objective
- Both objective
- Both subjective
> Dry weight is a verifiable measurement; construction quality requires judgment.
:::

:::check
Q: In the "XYZ" sub-assembly example, what does the labor-hour ratio 84/89 (10th unit vs. 5th unit) approximate?
- The material cost escalation rate
* The learning curve slope (~94.4%)
- The G&A burden rate
> A doubling of quantity (5→10) lets the unit ratio approximate the learning curve slope; see Module 7.
:::

:::check
Q: "O&M utilities cost \$36,500" is a poor data point mainly because…
- \$36,500 is too small a number to matter
* It lacks the context (what activity, time period, scope) needed to interpret or use it
- Utilities costs are never useful
> Without knowing what the cost covers and when, the number can't be normalized or compared.
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
2. **Define the estimate structure**: cost estimators establish a documented **Cost Element Structure (CES)**, a detailed, bounded structure that determines what needs to be estimated and how it will be shown. **The CES is not the same as a contract WBS** — the CES is all-inclusive, spanning the entire subject being estimated over the entire estimate timeframe, and it is tailored/bounded to the customer's needs (e.g., excluding O&M elements if only development is being estimated). Data collection should be organized around this structure.
3. **Identify data needs**: for each WBS element and chosen method (analogy, parametric/CER, or engineering build-up), determine what data is needed. Different methods have different requirements.
4. **Develop a data collection plan**: a formal documented plan specifying what data is needed, from which sources, using what methods (interviews, document review, database queries, surveys), the schedule for collection, and how data quality will be verified. Having a plan improves consistency, ensures traceability, and helps manage time/resources.

+++

### Data Needs for CER Development

To build a defensible Cost Estimating Relationship, you need:

- A sufficient number of historical data points (more points generally improve statistical confidence).
- Data on the dependent variable (cost) and candidate independent variable(s)/cost drivers (e.g., weight, power, lines of code) for each data point.
- Data that is **normalized** to a common basis (same content, same units, same point in time/dollars) so the relationship reflects a true underlying driver relationship rather than noise from inconsistent definitions.
- **Homogeneous** data — all points should represent genuinely comparable/analogous systems (mixing fundamentally different technologies undermines validity).

**Cost driver examples** (from the source): flying hours (aircraft) or steaming hours (ships) for operations cost; production quantity, average lot number, or unit number for production costs; linear feet and power for cabling cost; functional requirements and number of interfaces for software development cost. **Operating environment** is also a cost driver — manned space, unmanned space, critical life-sustainment (100% non-failure reliability), surface sea, or unclassified commercial internet environments each carry different cost characteristics.

To identify cost drivers: talk to engineers and SMEs, study the data at an appropriate level, understand the program's defining characteristics/operating environment/requirements, and understand key programmatic benchmarks such as schedule (aggressive schedules can drive cost as much as technological leaps). After collecting data, scatter-plot it and calculate statistics for candidate drivers — but a driver also has to make technical and programmatic sense, not just statistical sense.

**SMEs (Subject Matter Experts)** provide valuable insight — but reputable cost estimators **scrupulously avoid portraying expert opinion as data**. Expertise is best applied to interpreting historical data or re-creating it via anecdotal actuals or expert testimony, not as a substitute for data itself.

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
- **Requirements/baseline documents**: ICD, CDD, CPD (requirements documents), and the CARD (Cost Analysis Requirements Description).
- **Technical databases** (e.g., satellite, sensor, and communications databases).
- **CSDR** (Cost and Software Data Reporting): the main source of contractor actual costs by WBS (includes CCDR/"1921" forms, FlexFiles, SRDR).
- **Cost Performance Reports (CPR)** and related cost/schedule status reports, on cost and schedule performance.
- **Central repositories** (e.g., DoD's CADE, managed by the DCARC).
- **Labor rate data**: Forward Pricing Rate Agreements (FPRAs), and DCAA/DCMA surveillance results.
- **FFRDCs** and other external organizations.
- **Budget documents** and Selected Acquisition Reports (SARs).
- **Contracts, proposals, and accounting records**.
- **Engineering and technical documents** (specs, drawings, test reports).

:::tip Beyond CEBoK
The source uses **CPR (Cost Performance Report)** as its EVM reporting term. Since 2020, DoD has largely replaced the paper CPR/CFSR formats with the **Integrated Program Management Data and Analysis Report (IPMDAR)**, and CCDR reporting increasingly flows through **FlexFiles** rather than the older "1921" forms — neither IPMDAR nor FlexFiles is CEBoK terminology, but you'll see them in current practice.
:::

**Technology Readiness Level (TRL)**, listed among the module's technical data examples, is a standardized scale used to assess how mature a technology is. Per the source's own Testable Topics list, TRL is "testable, but less emphasized" relative to the module's main content.

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
:::

:::check
Q: The Cost Element Structure (CES) differs from a contract WBS because…
* The CES is all-inclusive across the entire estimate and timeframe, tailored/bounded to the estimate's needs
- They are the same thing
- The CES only covers contracted work
> The CES spans the whole subject being estimated, while a contract WBS is scoped to a specific contract.
:::

:::check
Q: Why should cost estimators avoid portraying expert (SME) opinion as data?
* SME judgment should interpret or re-create data (anecdotal actuals, testimony), not substitute for it
- SMEs are never useful
- SME opinions are always wrong
> Reputable estimators scrupulously avoid treating expert opinion as if it were collected data.
:::

:::check
Q: Which is a cost driver example given for cabling cost?
- Flying hours
* Linear feet and power
- Functional requirements
> Cabling cost drivers are physical: linear feet of cable and power requirements.
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
| **Sizing** | Mixed units (kg/oz/tons, metric vs. long tons, EUR vs. USD, meters vs. feet) | Convert all sizes/costs to a single consistent unit standard before comparing |
| **Content** | Different scope in the "same" element | Map to a common WBS; add or remove content (e.g., strip out spares or fee) |
| **State of development** | Prototype/EMD vs. production, new design vs. modification | Separate groups, dummy variables, or adjustment factors |
| **Key groupings / units** | Non-homogeneous data / mixed units | Group by mission application, operating environment, contractor, era; ensure consistent units |

**Why this matters**: To validly compare two data points, they must be normalized/checked across **all relevant dimensions simultaneously**: same time basis, same quantity basis, same content/scope, same units of measure, and same state of development/maturity. Missing any one of these dimensions can invalidate an otherwise careful comparison.

+++

### Cost Normalization (Inflation and Labor)

Adjusting cost data for the time value of money/purchasing power so that costs from different years can be compared on a common (e.g., constant-year or base-year) dollar basis. Adjusting for these price-level changes is called **escalation**; this uses inflation indices and is covered in detail in Module 5.

**Escalation example (from CEBoK)**: procurement cost for an AN/ARC-164 radio, from an official Bill of Materials, is \$50,000 in CY1994 dollars. Using the Air Force Procurement Appropriation index (Appropriation 3010, Aircraft Procurement Other), the FY2000 base-year index is 0.957. To escalate to BY2000: \$50,000 / 0.957 ≈ **\$52,247 (BY2000)**. Dividing by the index moves a cost *forward* to a later base year; multiplying by it would move a cost *backward* to an earlier one. All dollars being compared must share both the same scale (\$, \$K, \$M, \$B) and the same base year.

**Cost per labor hour** raises a related issue: is the labor rate fully burdened/loaded (with overhead applied) or just touch labor, and does it include a fee? Confirm what is and isn't included before comparing rates across sources.

### Quantity Normalization (Learning Curves)

Adjusting cost data to account for differing production quantities, since unit cost typically changes with quantity due to learning/experience effects — normalizing to a common point (e.g., unit 1, or T1) makes otherwise-different production quantities comparable. The learning curve math itself is covered in Module 7.

### Sizing and Unit Normalization

Any time data is expressed as a rate (cost per foot, per ton, per pound), the underlying units must be consistent: convert kilograms, ounces, or tons to one weight standard (for ships, metric tons ≠ long tons), and convert all distances to one length standard.

**Currency/unit conversion example**: converting €5/meter to USD/foot, at \$1.13 USD/EUR and 39.37 inches/meter, 12 inches/foot: €5/meter × \$1.13/€ ÷ 39.37 in/meter × 12 in/foot ≈ **\$1.72/foot**. The same method converts optical cable pricing, e.g. €10/meter converts to about **\$3.44/foot**.

**The Mars orbiter anecdote**: in 1999, NASA lost a \$125M Mars orbiter because navigation data used English units on one side and Metric units on the other — the mismatch was never reconciled, and the spacecraft crashed. Even top scientists get unit conversion wrong.

:::widget unit-chain:::

### Content Normalization

Adjusting data so each data point reflects the same defined scope, down to what makes up the sub-elements of an item. An end item's cost is the sum of Line Replaceable Unit (LRU), Shop Replaceable Unit (SRU), and sub-component costs and their integration — the estimator must account for both missing and excess sub-elements to form a common comparison base.

**Copier/fax example (from CEBoK)**: a company shopping for a copier gathers cost/technical data on plain copiers and copier-fax combo units. It would not directly compare a plain copier to a copier-fax machine — it must account for the missing fax capability (e.g., by assessing how much more the copier-fax units cost, on average, than the plain copiers) before the comparison is valid.

### State of Development Normalization

Data must be normalized for the **maturity/state of development** of the technology or program when the data was generated, accounting for the system's stage in the development cycle and the impact of learning curves. Cost, labor hours, and processes can vary significantly between a concept/technology demonstrator, a prototype still in **Engineering and Manufacturing Development (EMD)**, and a system in full-rate production. CEBoK compares this to a product's first **Beta-test phase**: still unproven and subject to change before general release. This data can be further isolated by item or **lot quantity** according to its state of development.

### Key Groupings

Aggregate data along comparable groupings to isolate related relationships: by **mission application** (e.g., emitters, submersibles, optical systems, or aircraft missions such as bombers, fighters, helicopters, trainers), and by **operating environment** (e.g., manned space, unmanned space, aerospace, shipboard, commercial systems) — a manned space system's costs and characteristics differ greatly from an unmanned one's.

:::note Related and Advanced Topics (CEBoK)
Data sets can also be classified as **univariate** (a single variable, e.g. the average cost of a cup of coffee, Fig. 4.7), **bivariate** (one dependent and one independent variable — typically cost and a cost driver, e.g. weight vs. cost, Fig. 4.8), or **multivariate** (one dependent and two-or-more independent variables, e.g. factory operating cost driven by both material and labor cost, Fig. 4.9). CEBoK marks this topic as related/advanced rather than core content.
:::

+++

:::check
Q: A \$50,000 CY1994 cost is escalated to BY2000 using an index of 0.957. What is the BY2000 value, and which operation applies?
* Divide by the index: ≈\$52,247 (moving to a later base year)
- Multiply by the index: ≈\$47,850
- No adjustment needed
> \$50,000 / 0.957 ≈ \$52,247. Moving to a later base year divides by the index; moving to an earlier one multiplies.
:::

:::check
Q: One missile's unit cost is the average of units 1–50, another's the average of units 400–600. What normalization is needed?
- Inflation
* Quantity (learning curve) normalization
- Content normalization
> Average costs at different points on the learning curve aren't comparable. Adjust both to a common unit.
:::

:::check
Q: Converting €5/meter to USD/foot at \$1.13/€, with 39.37 in/meter and 12 in/foot, gives approximately…
* \$1.72/foot
- \$5.00/foot
- \$0.85/foot
> €5 × \$1.13 ÷ 39.37 in × 12 in ≈ \$1.72/foot.
:::

:::check
Q: NASA lost a Mars orbiter in 1999 because of…
* An English-vs-Metric unit conversion mismatch in navigation data
- An inflation escalation error
- A learning curve miscalculation
> The \$125M craft could not reconcile navigation data using mismatched unit systems and crashed.
:::

:::check
Q: Comparing a plain copier's cost to a copier-fax combo unit's cost directly (without adjustment) is an error in which normalization?
- Cost/inflation
- Sizing
* Content
> The copier-fax machine includes extra content (the fax capability); content normalization accounts for that difference before comparing.
:::

:::check
Q: A concept demonstrator's cost vs. a full-rate production unit's cost should be compared only after which normalization?
- Content
* State of development
- Key groupings
> Systems at different stages of the development cycle (e.g., EMD/prototype vs. full-rate production) aren't directly comparable.
:::

**Practice data below is illustrative, not from CEBoK.**

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
    },
    {
      id: 'recurring', title: 'Non-recurring vs. recurring cost', summary: 'Why separation matters before analysis',
      body: String.raw`Non-recurring and recurring costs must be broken out to add fidelity to estimates, accounting for anomalies such as **production quantity** and **time-phasing** differences.

- **Non-recurring cost**: development costs, incurred once — e.g., developing proof of concept, setting up the factory line for production, building production molds, upgrades/improvements, and the original purchase of hardware/software.
- **Recurring cost**: maintenance and production costs, incurred repeatedly — e.g., hardware built during the program, capitalized non-recurring hardware/software, developed software installations, and **spares**, since spares are a continuous expense.

A related distinction is **fixed vs. variable cost**: fixed costs don't change as the production rate changes (e.g., **rent** for facilities), while variable costs do change with production rate (e.g., **electricity consumed** or **overtime pay**).

### Why Separation Matters

Proper normalization requires separating recurring from non-recurring cost **before performing any quantity-based analysis**, because this separation adds fidelity and accounts for anomalies like production quantity and time-phasing differences that would otherwise distort the analysis.

+++

:::tip Beyond CEBoK
It's common to say **learning curves apply only to recurring costs**, and non-recurring costs are fixed and don't decline with quantity. If recurring and non-recurring costs are left mixed into per-unit cost figures, the apparent unit-cost trend can be distorted. Module 7 (Learning Curves) covers the mechanics of separating and fitting these curves in detail.
:::

:::key
**Before fitting a learning curve or analyzing unit-cost trends, always separate recurring from non-recurring costs.** Combining them can distort the results.
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
Q: Which is a **non-recurring** cost?
* Setting up the factory production line
- Spares
- Developed software installations
- Production touch labor
> Non-recurring cost includes one-time development costs like factory line setup, tooling/molds, and the original H/W-S/W purchase.
:::

:::check
Q: Rent for a facility is a ______ cost; overtime pay is a ______ cost.
* Fixed; variable
- Variable; fixed
- Recurring; non-recurring
> Rent doesn't change with production rate (fixed); overtime pay does (variable).
:::

:::check
Q: Why separate recurring from non-recurring cost before quantity-based analysis?
* It adds fidelity and accounts for anomalies like production quantity and time-phasing differences
- Non-recurring costs are always larger
- Recurring costs are always more accurate
> CEBoK cites added fidelity and accounting for quantity/time-phasing anomalies as the reasons for the split.
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
:::`
    }
  ],
  cards: String.raw`
## Importance and Principles
Q: What do initial vs final costs and initial vs final schedules let an estimator develop?
A: A Cost Growth Factor (CGF) and a Schedule Growth Factor (SGF).
Q: Are data collection, normalization, and analysis a linear sequence?
A: No. CEBoK says they are not distinct and not linearly sequential; exploration and feedback loops help.
Q: May normalization remove costs judged "unusual"?
A: No. Normalization does not assume away or normalize away costs; it must be reversible, defensible, and documented.
Q: Why is data collection so critical to cost estimating?
A: Every estimating technique (analogy, parametric, engineering build-up) depends on historical data. Poor data gives confident wrong answers; it directly drives estimate credibility and defensibility.
Q: Key principles of data collection
A: (1) Comply with how the organization collects data/costs; (2) not just cost data: technical and programmatic too (enables CGF/SGF); (3) normalization does not assume or normalize away costs (reversible, documented); (4) collection, normalization, and analysis are not linearly sequential; (5) goal is homogeneous data (e.g., common WBS).
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
Q: CEBoK's Quality of Data Types ranking (best to worst)
A: 1) Actuals for completed programs, or EACs for contracts >90% complete (caution: some programs re-baseline late) · 2) Schedule B contract line item prices (≈ EAC at 0% complete) · 3) Historical/original budget data (lowest; not actual spend, usually too high a level).
Q: Why is secondary data lower quality than primary data?
A: Its normalization process is unknown, it lacks definition, and its factor basis may be old, incomplete, or questionable. Still useful for cross-checking.
Q: Quantitative data scales: ordinal, interval, ratio
A: Ordinal = rank order only (1st, 2nd). Interval = relative scaling (e.g., year; Celsius 30 vs 60 is not "twice as hot"). Ratio = supports absolute comparison (\$2M is twice \$1M), if normalized.
Q: Can qualitative data be objective?
A: Yes — if all experts asked would agree on the determination, it's objective; if they'd disagree, it's subjective.
Q: Soccer jersey numbers vs. baseball uniform numbers
A: Soccer numbers are loosely interval (map to field position front-to-back). Baseball numbers are just unique labels, neither ordinal nor interval.
Q: Can objective data be qualitative?
A: Yes, e.g., "U.S. vs. Soviet fighters" is qualitative but objective (externally verifiable).
Q: Role of subjective data
A: Typically qualitative; interprets/validates objective data and helps extrapolate information from one generation of equipment to the next (e.g., complexity, requirements stability, level of difficulty, new technology).
Q: Cost pools OH and G&A
A: Overhead (OH) and General and Administrative (G&A) are cost pools that capture resources associated with certain activities.
Q: Fig. 4.3 aircraft example data sources
A: Aircraft 1: primary = Manufacturer A, secondary = FAA study, objective = dry weight, subjective = complexity. Aircraft 2: primary = internal government data, secondary = internet search, objective = maximum velocity, subjective = construction quality.
Q: Contextual completeness — good example (Dodge Ram)
A: A 1998 Dodge Ram 1500 4x4, full configuration specified, \$18,500 in March 1998 excluding \$750 shipping — quantity, model, options, and dollar year/exclusions are all identified.
Q: Contextual completeness — good example (sub-assembly XYZ)
A: 99.5 labor hours for unit 1, 89 for unit 5, 84 for unit 10, material \$2,350 (FY01) constant. Hours (not cost) let the estimator apply a rate later; 84/89 ≈ 94.4% approximates the learning curve slope.
Q: Contextual completeness — poor example
A: "O&M utilities cost \$36,500" — no activity, time period, site, or annual/monthly basis given, so it can't be interpreted or normalized.
Q: MIL-HDBK-881A aircraft WBS (Fig. 4.2)
A: A standard WBS that keeps data providers and estimators in sync; its elements (structure, propulsion, electrical, communications, navigation/guidance) transfer to other systems like satellites or school buses.

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
R: yes
Q: Why develop a data collection plan?
A: A documented plan improves consistency, ensures traceability, and helps manage limited time/resources available for the estimate.
Q: Data needed for CER development
A: Cost for many analogous systems + candidate driver values + context to normalize. Data must be homogeneous and consistently defined.
Q: What is the WBS and why does it matter for data collection?
A: Work Breakdown Structure defines the framework the estimate is built around. Data collection should be organized around the WBS so collected data maps directly to cost elements.
Q: CES vs. contract WBS
A: The CES (Cost Element Structure) is not the same as a contract WBS. The CES is all-inclusive, spans the entire subject and timeframe being estimated, and is bounded/tailored to the customer's needs.
Q: Cost driver examples
A: Flying/steaming hours (operations); production quantity, lot number, or unit number (production); linear feet and power (cabling); functional requirements and interfaces (software); operating environment (manned/unmanned space, surface sea, commercial).
Q: SME caution
A: Reputable cost estimators scrupulously avoid portraying expert opinion as data. SME expertise is best used to interpret or re-create historical data, not replace it.
Q: TRL (Technology Readiness Level)
A: A standardized scale for assessing technology maturity; per CEBoK's Testable Topics list, it's testable but less emphasized.
R: yes

## Data Sources
Q: What is CSDR?
A: Cost and Software Data Reporting: the DoD system for contractor actual cost data (CCDR/"1921" forms, FlexFiles) and software data (SRDR).
R: yes
Q: Major data sources (non-DoD and DoD)
A: Contractor records, government databases (e.g., CADE), program office records, SME interviews, published literature, prior estimates. In DoD: requirements docs (ICD/CDD/CPD), CARD, technical databases, CSDR, CPR, FPRAs, DCAA/DCMA, FFRDCs, budgets, SARs, contracts, technical docs.
Q: IPMDAR / FlexFiles (Beyond CEBoK)
A: Not CEBoK terms. IPMDAR is DoD's current EVM report, largely replacing the paper CPR/CFSR; FlexFiles increasingly replace the older "1921" CCDR forms. CEBoK uses CPR as its term.
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
A: Convert all dollars to a common base year using inflation indices so purchasing power is consistent. This price-level adjustment is called escalation.
R: yes
Q: Escalation worked example (from CEBoK)
A: \$50,000 (CY1994, AN/ARC-164 radio) escalated to BY2000 using AF index 0.957: \$50,000 / 0.957 ≈ \$52,247 (BY2000). Dividing moves cost to a later base year.
Q: Quantity normalization
A: Adjust costs to a common point on the learning curve (e.g., T1 or unit 100) so unit costs at different production quantities are comparable. Mechanics covered in Module 7.
R: yes
Q: Cost per labor hour normalization
A: Confirm whether a labor rate is fully burdened/loaded or just touch labor, and whether it includes a fee, before comparing rates across sources.
Q: Sizing normalization
A: Convert all weights to one standard (kg/oz/tons; metric ≠ long tons for ships) and all lengths to one standard before computing rates like cost per foot/ton/pound.
R: yes
Q: Unit conversion example (EUR/meter to USD/foot)
A: €5/meter x \$1.13/€ / 39.37 in/meter x 12 in/foot ≈ \$1.72/foot. The same method converts optical cable pricing (e.g., €10/meter ≈ \$3.44/foot).
Q: The Mars orbiter unit-mismatch anecdote
A: In 1999 NASA lost a \$125M Mars orbiter because navigation data mixed English and Metric units, causing a crash.
R: yes
Q: Content normalization
A: Map data to a common WBS/LRU-SRU-sub-component decomposition and add/remove scope so the "same" element contains the same work across all data points.
R: yes
Q: Content normalization example (copier/fax)
A: Don't directly compare a plain copier to a copier-fax combo; account for the missing/extra fax capability (e.g., the average cost premium of copier-fax units) before comparing.
Q: State of development normalization
A: Account for the system's stage in the development cycle (concept/EMD/prototype vs. full-rate production, akin to a Beta-test phase) and learning-curve impact; can be isolated further by item or lot quantity.
R: yes
Q: Units of measure normalization
A: Ensure consistent units (all weights in pounds, all costs in millions, all labor in hours) before combining or comparing values.
Q: Key groupings (normalization)
A: Group data by mission application (e.g., emitters, submersibles, bombers, fighters) and by operating environment (manned/unmanned space, aerospace, shipboard, commercial) so unlike items aren't mixed.

## Non-recurring vs. Recurring
Q: Non-recurring cost definition
A: Development costs incurred once: proof of concept, factory line setup, production molds, upgrades/improvements, and original purchase of hardware/software.
R: yes
Q: Recurring cost definition
A: Maintenance and production costs incurred repeatedly: hardware built during the program, capitalized non-recurring H/W-S/W, developed software installs, and spares (a continuous expense).
R: yes
Q: Why must recurring and non-recurring costs be separated before learning curve analysis?
A: (Beyond CEBoK) Learning curves apply only to recurring costs; mixing non-recurring (fixed, no learning) with recurring distorts the apparent learning rate. CEBoK itself cites added fidelity and accounting for production quantity/time-phasing anomalies as the reasons for the split.
Q: Effect of mixing recurring and non-recurring costs in unit cost data
A: (Beyond CEBoK) Makes the unit cost trend appear flatter (less learning) than it actually is, because non-recurring costs are spread across more units at higher quantities.
Q: When is non-recurring cost "absorbed" by quantity?
A: (Beyond CEBoK) As quantity increases, the per-unit non-recurring cost decreases, but that's an accounting effect, not true learning. Separating them reveals the real learning curve.
Q: Fixed vs. variable cost
A: Fixed costs don't change with production rate (e.g., rent for facilities). Variable costs change with production rate (e.g., electricity consumed, overtime pay).

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
