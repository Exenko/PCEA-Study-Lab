PCEA.addModule({
  id: 'm04', num: 4, title: 'Data Collection and Normalization', short: 'Data & Normalization', source: 'guide',
  blurb: 'Collect and normalize cost, technical, and programmatic data so historical data points are comparable with each other and with the new system.',
  intro: String.raw`**An estimate is only as good as its data.** This module covers what data to collect, where to find it, what makes data usable, and how to **normalize** it so historical data points can be compared with each other and with the new system.

**Core principle**: cost numbers alone are meaningless without context (technical and programmatic data), and data must be normalized to be consistent and comparable. Estimates have no credibility without a firm basis in historical data.

**Links to other modules**: Module 5 (Inflation/Escalation) covers the detailed mechanics of cost normalization. Module 7 (Learning Curves) depends on properly normalized quantity data. Module 8 (Regression) and Module 9 (CERs) require normalized, homogeneous datasets before a valid CER can be fit.`,
  sections: [
    {
      id: 'importance', title: 'Why data matters', summary: 'The foundation of every estimate',
      body: String.raw`:::primer:::
You hand a skilled estimator a sophisticated model but weak data. What do you expect?

:::check
Q: A skilled estimator feeds bad, irrelevant data into a strong estimating method. What happens to the estimate?
- The strong method corrects for the weak data
* It is only as good as the data, so the method cannot rescue it
- It stays credible as long as the model is well documented
> CEBoK states that an estimate is only as good as the data used to produce it, so data collection and normalization must be a top priority for all cost estimators.
:::

+++

Every estimating method — analogy, parametric/CER, and engineering build-up — ultimately rests on **historical data**. CEBoK states that an estimate is only as good as the data used to produce it, so data collection and normalization must be a top priority for all cost estimators.

Data provides information on cost trends over a variety of related programs, insight into cost structures, and the foundation used to develop all costing techniques and models. It gives **credibility** and **defensibility** to estimates (without it the estimate would be looked upon as merely a guess or the opinion of the cost estimator), and properly analyzed data provides assessments of the statistical accuracy and fidelity of an estimate.

{{primer}}

### Key Principles

CEBoK lists five key principles:

1. **Comply with how the organization collects data and/or costs.** When estimating for budgets, collect historical budget data to see how it breaks into components; if the organization has an existing data or cost management system, assess that data.
2. **It is not just cost data.** Technical and programmatic data give contextual completeness: they support the cost data, identify cost drivers, support normalization, and build and adjust cost models. Initial vs final costs yield a **Cost Growth Factor (CGF)**; initial vs final schedules yield a **Schedule Growth Factor (SGF)**; initial concept design vs final specifications help set standard margins for space, weight, and power.
3. **Normalization does not assume away or normalize away costs.** This is why reversible operations matter. Example: reducing unusually high inexperienced labor hours to be more reflective of an experienced labor force requires adjusting the labor mix in the normalized data set to reflect future project conditions. To develop a CER, escalate the historical costs to a common Base Year (BY). Normalization, because it adjusts costs, needs to be defensible and well documented.
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

**Statistical noise** (unexplained variability) always exists in data; some is irreducible (random fluctuation, measurement error), but rigorous normalization removes reducible noise. CEBoK frames data collection and normalization as a **functional transformation** of raw data into normalized data, and stresses that this transformation must be **reversible**: predicting future cost with normalized historical data requires reversing the normalization steps used on that data. Fig. 4.1 uses raw historical labor hours and cost data and normalizes it for content, splitting total hours into labor components such as change orders, embedded change orders, and workforce composition. In future estimates the normalization steps are reversed for new production units under expected future conditions (adding back projected change orders and adjusting for projected workforce composition and program schedules).

+++

### The Aircraft Example

CEBoK's case study is a commercial aircraft. Data sources may be government agencies like the Federal Aviation Administration (FAA), trade organizations, or manufacturers, and most likely carry proprietary data issues (Manufacturer A would not have access to Manufacturer B's data), but a cost estimator with the FAA would have access to both sets of data. Driving factors may include the number of seats and dry weight (the size scale of the vehicle); required composite materials and automation are on the more complex side but could be just as important when estimating cost. Using a well-established standard WBS supports a comprehensive data collection process, and a common WBS ensures that the data provider and the cost estimator are in sync.

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
      body: String.raw`:::primer:::
Estimators collect three families of data, not just dollars.

:::sort
Q: Which family does each piece of data belong to?
buckets: Cost | Technical | Programmatic
- Labor hours = Cost
- Material costs = Cost
- Component size and weight = Technical
- Flying hours = Technical
- Schedules = Programmatic
- Contract type = Programmatic
> Cost data is captured in dollars and hours tied to an activity (labor) or product (material); technical data derives from requirements or physical characteristics of systems (e.g., component size and weight, activity rates such as flying hours); programmatic data includes the program parameters that explain and drive cost (e.g., schedules, contract types).
:::

+++

### Cost, Technical, and Programmatic

Three broad categories of data are collected for every estimate:

| Type | Definition and examples |
|---|---|
| **Cost** | Resource data captured in a specified type of dollars and hours, associated with a particular activity (labor) or product (material) |
| **Technical** | Derives from requirements or physical characteristics of systems and may drive cost. Component size and weight, reliability and maintainability parameters, satellite payload requirements, crew size and composition, activity rates (e.g., flying hours), deployment plans |
| **Programmatic** | The program parameters that explain and drive cost. Schedules, structure of the value chain (contractor and tiers of subcontractors), contract types, acquisition environment (e.g., sole source vs. competitive) |

{{primer}}

**Why all three?** Technical and programmatic data provide the basis for cost and also drive cost; they supply the context that makes cost data usable. Cost numbers alone are meaningless without context; they merely represent a number. For example, 6.8 is a meaningless number without a descriptor. Adding descriptors such as \$6.8K in BY1989 dollars for the procurement of one radio for an F-15C fighter provides valuable and usable contextual information. Ensure that data includes what is in the numbers (i.e., burdens: OH, G&A, fee, or year and units). Schedule data supports schedule estimating and time phasing.

When collecting data, identify sources and include documented information that provides traceability, so the cost estimator can match specific technical and programmatic data with the associated cost data. Cost estimators must provide a clear trace back to their source data for audit purposes.

:::tip Beyond CEBoK
Other technical examples often used in practice: speed, lines of code, materials, technology readiness level (TRL). (CEBoK's aircraft example also names power requirements and fuel consumption as technical data, and schedule duration, time to build components, and subcontract types as programmatic data.) Other programmatic examples: quantities, production rate, acquisition strategy, number of test articles.
:::

Cost (resource) data is captured in a specified type of dollars and hours, tied to an activity (labor) or product (material). Resources tied to some activities are captured in **cost pools** such as **Overhead (OH)** and **General and Administrative (G&A)**.

+++

### Primary versus Secondary

**Primary data** is obtained from the original source — on-site contractor facility collections, government reports, test centers, or depots. It is unaltered, actual, historical data. Examples: Bills of Materials (BOM), documented test results, documented resource hours to accomplish a task. Primary data is typically the most defensible, highest-quality data a cost estimator can capture.

**Secondary data** is based on primary data but derived, sanitized (for classification/proprietary reasons), or otherwise changed from the original. Examples: documented cost estimates, factors and factor books, studies and white papers, contractor cost report summaries, subcontractor cost data. Secondary data tends to be lower quality for three reasons:

1. the normalization process behind it is unknown;
2. there is a lack of definition associated with the data; or
3. the basis for a factor is old, incomplete, or questionable in some way.

Secondary data works as a valuable tool when used in combination with other data for **cross-checking** purposes.

### Quantitative versus Qualitative

**Quantitative** (numeric) data is preferred and is usually objective and measurable, physically or in cost-accounting terms. It has three scales:

- **Ordinal**: rank order only (1st, 2nd, 3rd) — the only valid comparison is greater/less than.
- **Interval**: relative scaling, e.g. the calendar year (1995→2005 is twice as long as 1995→2000), but may cause issues in absolute comparisons. Celsius illustrates this: 30°C to 60°C is a 30-degree interval, and 30 × 2 = 60, but 60°C is *not* twice as hot as 30°C (86°F vs. 140°F; 2 × 86 ≠ 140).
- **Ratio**: supports absolute comparisons, e.g. \$2M is twice \$1M — provided both are normalized to the same year and currency.

**Qualitative** data describes a quality of the program or system, usually in categorical terms referred to as **nominal** (e.g., "high risk," "low complexity"); such designations may be disguised as quantitative ordinal data. Transform qualitative data into quantitative data or replace it when possible. Qualitative data is typically subjective, but can be objective: if all experts asked would agree on the determination, the data is objective; if experts would disagree, it's subjective. A subjective *quantitative* example is a numeric risk score assigned by an engineer.

Labels that look ordinal can actually be interval: soccer jersey numbers index back-to-front on the field (a "2" is usually a fullback, a "10" a midfielder, a "15" a forward) and are loosely interval, since higher numbers sit further forward. The only true test of interval or ordinal is to determine if the labels act as if they are interval or ordinal. Baseball uniform numbers, by contrast, are neither ordinal nor interval — they are just unique labels.

:::widget scale-sorter:::

### Objective versus Subjective

**Objective data** is usually quantitative and, like primary data, preferred — actual counts from a formal collection process or derived from other quantitative data (e.g., staff hours, Extended Source Lines of Code (ESLOC), Function Points (FPs), test items, documented errors, end items). Objective data can sometimes be qualitative (e.g., U.S. vs. Soviet fighters).

**Subjective data** is based on individual or group feelings/understanding about a condition or characteristic. It tends to be qualitative and typically helps **interpret or validate** objective data; it is valuable for extrapolating from one generation of equipment to the next. Examples: complexity, requirements stability, level of difficulty, degree of new technology involved.

+++

### Quality of Data Types

As programs move from initial budgets to actual costs, data quality improves. From best to worst:

1. **Actuals for completed programs/contracts** — better than EACs.
2. **Estimates at Complete (EACs)** for contracts greater than 90% complete — EACs improve as the contract nears completion, but exercise caution before accepting the data: some problematic programs wait until well beyond the original schedule to re-baseline, so the 90% complete metric is not always a clear benchmark.
3. **Schedule B contract line item prices** — actuals and EACs are better, because these prices do not reflect what was actually spent; they generally represent the EAC at 0% complete.
4. **Historical/original budget data** — the lowest quality, because budget data is not the actual spent cost, and most budget data exists at a level too high to prove useful for data collection.

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
Q: Bills of Materials (BOMs), documented test results, and documented resource hours are examples of…
* Primary data
- Secondary data
- Subjective data
- Programmatic data only
> Primary data is obtained from the original source, unaltered and representing actual, historical data.
:::

:::check
Q: Schedules and contract types are examples of which data category?
- Cost
- Technical
* Programmatic
> Programmatic data includes the program parameters that explain and drive cost, such as schedules and contract types.
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
      body: String.raw`:::primer:::
Good data can still fail you for very different reasons.

:::sort
Q: Which of the four data considerations does each problem raise?
buckets: Availability | Accessibility | Validity | Constraints
- The original organization never collected the data with sufficient granularity = Availability
- The data exists but is proprietary or classified = Accessibility
- The data comes from a system that is not comparable = Validity
- You only have time for a quick ROM = Constraints
> Availability asks whether the data exists in sufficient quantity or granularity; accessibility whether the estimator can access it (security classification, proprietary classifications); validity whether the data is relatively current and applicable (comparable systems); constraints cover time and the underlying estimate requirements, such as a ROM.
:::

+++

| Consideration | Question to Ask |
|---|---|
| **Availability** | Does the data exist in sufficient quantity (and granularity and format) to defend the estimate? A single data point does not provide enough information to defend against questions. |
| **Accessibility** | Can the estimator access it? (security classification, acquisition sensitivity, proprietary classifications, other regulatory issues; surmountable with NDAs or other data safeguards; if primary data is not accessible, reconsider the methodology and use more secondary data) |
| **Validity** | Are the collected data points relatively current and applicable to the effort being estimated? Relevancy and currency establish if the data is recent; applicability establishes whether the program or systems are comparable. |
| **Constraints** | Time and the underlying estimate requirements (e.g., a ROM vs. a cross-check) |

{{primer}}

Cost estimators face challenges with data availability, accessibility, validity, and constraints.

**Validity checks**: cross-checks provide one method to check data validity. Examine multiple sources of primary and secondary data to see if they all point to a relatively similar number. Sanity checks and cross-checks ensure that the costs are of the right order of magnitude. To further help validate data, examine it from different perspectives (e.g., both dollars and hours).

**Constraints**: if the allotted time to gather data is minimal, the cost estimator may use secondary data. If the estimate is being developed only as a Rough Order of Magnitude (ROM), a collection of just secondary data may be acceptable; if the specific category or piece of data is only for cross-check purposes, secondary data collection may be adequate. Cost estimators also need to determine if the data is currently in an immediately usable form; if not, it will require some form of normalization.

+++

### Common Pitfalls

- **Inconsistent data definitions**: do not assume that data from different sources are based on the same content definitions. For example, one contractor's Mean Time To Repair (MTTR) for a component may include preparatory activities along with conducting the test, while another's may only include the actual test. Data definitions can also change over time even if the data is from the same source, so capture the definitions when collecting data.
- **Unusual program characteristics**: pay attention to characteristics that create special needs, and collect related technical and programmatic data to account for new technology or new materials, an aggressive schedule, changes in the contractor's manufacturing processes, or new cost reduction initiatives.

:::tip Beyond CEBoK
Other pitfalls commonly cited in practice (not in CEBoK's pitfalls list): accepting data at face value, hidden content differences (spares, support equipment, fee), mixed then-year and constant dollars, using budgets as actuals, too few or non-homogeneous points, stale data, not recording the source and context, and relying on a single data point.
:::

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
      body: String.raw`:::primer:::
An estimator could start pulling data on day one. A sensible one doesn't.

:::order
Q: Put the steps before collecting data in order.
1. Understand the total picture of the system, program and purpose
2. Define the estimate structure (the Cost Element Structure)
3. Understand the estimating technique to be employed and its data collection needs
4. Develop a data collection plan
> The workflow starts with understanding the total picture, then establishes the CES and boundaries around the estimate, then understands the estimating technique and its associated data collection needs, and ends with developing a data collection plan.
:::

+++

### The Structured Workflow

Before collecting data, follow these steps:

1. **Understand the total picture**: thoroughly understand what needs to be estimated, including the purpose and scope of the estimate. Ask about the intended use of the estimate (e.g., program budget, ICE or LCCE, AoA/EA, risk estimate, source selection, contract performance measure), its content (how many of what, where, when; the physical or technical picture; the time period covered; how much time there is to develop it), and its organizational scope (does it cross organizational boundaries, or concern one department?).
2. **Define the estimate structure**: cost estimators establish a documented **Cost Element Structure (CES)**, a detailed, bounded structure that determines what needs to be estimated and how it will be shown. **The CES is not the same as a contract WBS** — the CES is all-inclusive, spanning the entire subject being estimated over the entire estimate timeframe, and it is tailored/bounded to the customer's needs (e.g., excluding O&M elements if only development is being estimated). Data collection should be organized around this structure.
3. **Understand the estimating technique and its data needs**: review the scope and bounds of the estimate defined in the CES and identify which estimating technique(s) will be used in a **cost estimating matrix**, which is simply the CES annotated with a primary and secondary estimating technique listed for each cost element along with potential data sources. Data collection and analysis are iterative: the technique to be employed drives the data requirement and the available data drives the estimating technique. Different estimating techniques may require different data. Identify any existing similar and precedent systems: similar systems share a multitude of common characteristics, and precedent systems are evolutionary ancestors. Almost all systems, no matter how revolutionary, have analogous systems that represent possible data sources.
4. **Develop a data collection plan**: capture primary and secondary cost, technical and programmatic data so that every cost element in the CES is covered. Identify the owners or keepers of the data, how to obtain the data and how to safeguard it. Where possible, identify primary and backup data sources, plus data sources for cross-checks. Only gather data that is appropriate to the task versus attempting to collect everything. Include a projected data collection timeline with the plan to keep the estimating effort on schedule, and get approval of the plan in the beginning.

{{primer}}

+++

### Data Needs for CER Development

Cost estimators rely on CERs, so understanding the cost drivers for the system being estimated is critical. The challenge in the data collection process is not to collect numbers, but to gain an understanding of the factors that drive or influence cost, and to collect data on these drivers. Cost drivers represent important independent variables in CERs; variations in these numbers significantly influence the overall estimate.

:::tip Beyond CEBoK
Practical requirements for a defensible CER dataset: a sufficient number of historical data points (more points generally improve statistical confidence); cost and candidate driver values for each point; data **normalized** to a common basis (content, units, time/dollars); and **homogeneous** data, where all points represent comparable systems.
:::

**Cost driver examples** (from the source): flying hours (aircraft) or steaming hours (ships) for operations cost; production quantity, average lot number, or unit number for production costs; linear feet and power for cabling cost; functional requirements and number of interfaces for software development cost. **Operating environment** is also a cost driver — manned space, unmanned space, critical life-sustainment (100% non-failure reliability), surface sea, or unclassified commercial internet environments each carry different cost characteristics.

To identify cost drivers: talk to engineers and SMEs, study the data at an appropriate level, understand the program's defining characteristics/operating environment/requirements, and understand key programmatic benchmarks such as schedule (aggressive schedules can drive cost as much as technological leaps). After collecting data, scatter-plot it and calculate statistics for candidate drivers — but a driver also has to make technical and programmatic sense, not just statistical sense.

**SMEs (Subject Matter Experts)** provide valuable insight — but reputable cost estimators **scrupulously avoid portraying expert opinion as data**. Expertise is best applied to interpreting historical data or re-creating it via anecdotal actuals or expert testimony, not as a substitute for data itself.

+++

### Sources of Data

CEBoK identifies some of the more common U.S. Department of Defense (DoD) sources for data. Sources for technical data include:
- **Requirements documents**: Initial Capabilities Document (ICD), Capability Development Document (CDD), Capability Production Document (CPD).
- **Baseline descriptions**: Cost Analysis Requirements Description (CARD) and Intelligence Capability Baseline Description (ICBD).
- **Technical databases** (e.g., commercial satellite, satellite crosslinks, infrared sensor, RF communications, and DoD electronic system databases).
- **Contractor-provided documentation**: technical proposals, data sheets, proprietary specifications.
- **Contractor cost reports**: Cost/Schedule Control Systems Criteria (C/SCSC), Cost Performance Reports (CPR), Cost/Schedule Status Reports (C/SSR), Contract Funds Status Reports (CFSR), Contractor Cost Data Reporting (CCDR).
- **Accounting data**.
- **Cost Assessment Data Enterprise (CADE)**, managed by the Defense Cost Resource Center (DCARC): the DoD authoritative centralized repository for cost and software data, including CCDRs, SRDRs, and CSDRs, for major defense programs.
- **Labor rate data**: Forward Pricing Rate Agreements (FPRAs), and results of surveillance by the Defense Contract Audit Agency (DCAA) and the Defense Contract Management Agency (DCMA).
- **Additional data sources**: Federally Funded Research and Development Corporations (FFRDCs), external organizations, other information systems, historical contracts, cost proposals, competitive intelligence, market analysis, benchmarking, historical cost databases, cost/budget/accounting/earned value data from programs, contractors, depots, and other organizations, catalog prices, supplier cost information or vendor quotes, and market research.

:::tip Beyond CEBoK
A commonly-cited view of typical strengths and weaknesses by source (not from CEBoK):

| Source | Typical Strength | Typical Weakness |
| --- | --- | --- |
| **Contractor cost records** | Primary, objective, detailed | Access/proprietary restrictions |
| **Government cost databases** | Convenient, often pre-normalized | May obscure original definitions/context |
| **Program office records** | Good programmatic context | Budget data may not equal actual cost |
| **SME interviews** | Fills gaps, adds context | Subjective, potential bias |
| **Published/industry literature** | Broad technical coverage | Variable reliability, commercial vs. defense mismatch |
| **Prior estimates** | Consistency with past work | May be stale/outdated |

Budget documents and Selected Acquisition Reports (SARs) are also common sources in practice.
:::

:::tip Beyond CEBoK
The source uses **CPR (Cost Performance Report)** as its EVM reporting term. Since 2020, DoD has largely replaced the paper CPR/CFSR formats with the **Integrated Program Management Data and Analysis Report (IPMDAR)**, and CCDR reporting increasingly flows through **FlexFiles** rather than the older "1921" forms — neither IPMDAR nor FlexFiles is CEBoK terminology, but you'll see them in current practice.
:::

:::check
Q: Which is the DoD authoritative centralized repository for cost and software data (CCDRs, SRDRs, CSDRs) for major defense programs?
- SAR
* CADE, managed by the DCARC
- PPBE
- FPRA
> The Cost Assessment Data Enterprise (CADE), managed by the Defense Cost Resource Center (DCARC), is the DoD authoritative centralized repository for cost and software data for major defense programs.
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
      body: String.raw`:::primer:::
Normalization is not one adjustment. Different mismatches call for different fixes.

:::sort
Q: Which kind of normalization fixes each mismatch?
buckets: Cost (inflation) | Quantity | Content | Sizing
- One cost is in CY1994 dollars, another in BY2000 dollars = Cost (inflation)
- One weight is in kilograms, another in tons = Sizing
- Cost per meter versus cost per foot = Sizing
- One source includes spares, another does not = Content
- Costs recorded at very different production quantities = Quantity
> Inflation indices put dollars on a common base year; learning curves put quantities on a common point (a study-aid category, not one of CEBoK's listed types); sizing converts mixed units (kg, tons, meters, feet) to one standard; content mapping adds or removes scope such as spares or fee.
:::

+++

**Data normalization** is the process of making data consistent and comparable to other data being used in the estimate, so that it is usable for estimating. Data can be difficult to find in the form needed by the cost estimator.

CEBoK lists the types of data normalization as: **cost units**; **sizing units**; **special groupings** such as mission application; **platform operating environment**; **recurring/non-recurring costs**; **development state**; and **end terms for homogeneity** (content).

### Common Normalization Categories

CEBoK's headings are Cost, Quantity, and Sizing; Content; State of Development; and Key Groupings.

| Normalization | What It Fixes | How |
|---|---|---|
| **Cost (inflation)** | Different years' dollars; what is in the cost per labor hour | Adjust for price level changes (escalation) to a common base year with inflation indices (Module 5) |
| **Quantity** (Beyond CEBoK) | Costs at different production quantities | Use learning curves to adjust to a common point (Module 7) |
| **Sizing** | Mixed units (kg/oz/tons, metric vs. long tons, EUR vs. USD, meters vs. feet) | Convert all sizes/costs to a single consistent unit standard before comparing |
| **Content** | Different content in the end item | Account for missing and excess sub-elements (LRU, SRU, sub-components, integration) to form a common base |
| **State of development** | Concept/demonstrator, prototype/EMD vs. full-rate production | Account for stage in the development cycle and learning-curve impact; group or isolate by item or lot quantity |
| **Key groupings** | Non-homogeneous data | Group by mission application, operating environment, recurring vs. non-recurring, and variable vs. fixed |

{{primer}}

:::tip Beyond CEBoK
A common study shorthand: to validly compare two data points, check them across all relevant dimensions at once: same time basis, same quantity basis, same content/scope, same units of measure, and same state of development. Missing any one of these can invalidate an otherwise careful comparison.
:::

+++

### Cost Normalization (Inflation and Labor)

Cost data usually reflects material costs or measures of effort such as cost per labor hour, so the estimator must ask what is actually in these numbers. The data needs to be adjusted or normalized to a common base from which a comparison or analysis can occur. Adjusting for the price level changes associated with inflation is referred to as **escalation**; it uses inflation indices and is covered in detail in Module 5. (CEBoK's illustration: a Corvette costing \$6,000 is hard to judge from price and type alone; knowing it was purchased new in 1974 lets the estimator adjust for inflation to a base or constant year.)

**Escalation example (from CEBoK)**: procurement cost for an AN/ARC-164 radio, from an official Bill of Materials (May 1994), is \$50,000 in CY1994 dollars. Using the Air Force Procurement Appropriation index (Appropriation 3010, Aircraft Procurement Other), the FY2000 (BY) index is 0.957. Here, dividing the 1994 cost by the index gives the escalated BY2000 cost: \$50,000 / 0.957 ≈ **\$52,247 (BY2000)**. All dollars must be in the same terms (dollars, thousands, millions) and must also represent a common base year; you must normalize the inflationary effect into or out of the data (escalation or de-escalation). When working on a program, the BY is normally designated by the program manager and typically reflects the year the project started.

**Cost per labor hour** raises a related issue: labor hours are straightforward, but the estimator needs to know what is included in the cost per labor hour. The labor dollars may be fully loaded or burdened, may be just touch labor, or may include a fee. Check the cost units to ensure that what the number represents is clear (\$, \$K, \$M, or \$B).

### Quantity Normalization (Beyond CEBoK)

:::tip Beyond CEBoK
CEBoK's "Cost, Quantity, and Sizing" heading does not explain quantity normalization in its body. A common practice is adjusting cost data for differing production quantities, since unit cost typically changes with quantity due to learning/experience effects; normalizing to a common point on the learning curve makes different quantities comparable. The learning curve math is covered in Module 7.
:::

### Sizing and Unit Normalization

Any time data is expressed as a rate (cost per foot, per ton, per pound), the underlying units must be consistent: convert kilograms, ounces, or tons to one weight standard (for ships, metric tons ≠ long tons), and convert all distances to one length standard.

**Currency/unit conversion example**: use the exchange rate in effect when the data was captured (CEBoK's example rate is as of March 23, 2019). Converting €5/meter to USD/foot, at \$1.13 USD/EUR and 39.37 inches/meter, 12 inches/foot: €5/meter × \$1.13/€ ÷ 39.37 in/meter × 12 in/foot ≈ **\$1.72/foot**. The same method converts optical cable pricing, e.g. €10/meter converts to about **\$3.44/foot**.

**The Mars orbiter anecdote**: in 1999, NASA lost a \$125M Mars orbiter because navigation data used English units on one side and Metric units on the other — the mismatch was never reconciled, and the spacecraft crashed. Even top scientists get unit conversion wrong.

:::widget unit-chain:::

### Content Normalization

Data can be normalized for end-item homogeneity or content differences in the end item; the estimator needs definitional content consistency and must ask what makes up the "Alpha" unit, which is especially important when using analogies. An end item's cost is based on the sum of Line Replaceable Unit (LRU), Shop Replaceable Unit (SRU), and sub-element or sub-component costs and their integration — the estimator must account for both missing and excess sub-elements to form a common base from which to make comparisons or perform an analysis.

**Copier/fax example (from CEBoK)**: a company shopping for a copier gathers cost/technical data on plain copiers and copier-fax combo units. It would not directly compare a plain copier to a copier-fax machine — it must account for the missing fax capability (e.g., by assessing how much more the copier-fax units cost, on average, than the plain copiers) before the comparison is valid.

### State of Development Normalization

Data must be normalized for the **maturity/state of development** of the technology or program when the data was generated, accounting for the system's stage in the development cycle and the impact of learning curves. Cost, labor hours, and processes can vary significantly between a concept/technology demonstrator, a prototype still in **Engineering and Manufacturing Development (EMD)**, and a system in full-rate production. CEBoK compares this to a product's first **Beta-test phase**: still unproven and subject to change before general release. This data can be further isolated by item or **lot quantity** according to its state of development.

### Key Groupings

Aggregate data according to comparable groupings; identifying data by key groups helps the estimator isolate independent multiple relationships and systematically related multiple relationships. Typical groupings are by **mission application** (e.g., emitters, submersibles, optical systems, or aircraft missions such as bombers, fighters, helicopters, trainers), by **operating environment** (e.g., manned space, unmanned space, aerospace, shipboard, commercial systems) — a manned space system's costs and characteristics differ greatly from an unmanned one's — and by whether the data is **recurring versus non-recurring** or **variable versus fixed** in nature.

:::note Related and Advanced Topics (CEBoK)
Data sets can also be classified as **univariate** (a single variable, e.g. the average cost of a cup of coffee, Fig. 4.7), **bivariate** (one dependent and one independent variable — typically cost and a cost driver, e.g. weight vs. cost, Fig. 4.8), or **multivariate** (one dependent and two-or-more independent variables, e.g. factory operating cost driven by both material and labor cost, Fig. 4.9). CEBoK marks this topic as related/advanced rather than core content.
:::

+++

:::check
Q: A \$50,000 CY1994 cost is escalated to BY2000 using an index of 0.957. What is the BY2000 value, and which operation applies?
* Divide by the index: ≈\$52,247 (BY2000)
- Multiply by the index: ≈\$47,850
- No adjustment needed
> \$50,000 / 0.957 ≈ \$52,247. In this CEBoK example, dividing the 1994 cost by the index gives the escalated BY2000 cost; the inflationary effect must be normalized into or out of the data.
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
> $4.31755 \times 1.025^{12} = 4.31755 \times 1.3449 \approx 5.81$, so about \$5.81M. Here the growth factor is applied by multiplying (this practice problem is not CEBoK's worked example).
:::`
    },
    {
      id: 'recurring', title: 'Non-recurring vs. recurring cost', summary: 'Why separation matters before analysis',
      body: String.raw`:::primer:::
Some costs are paid once; others come back with every unit.

:::sort
Q: Is each cost non-recurring or recurring?
buckets: Non-recurring | Recurring
- Developing proof of concept = Non-recurring
- Building production molds = Non-recurring
- Spares = Recurring
- Developed software installations = Recurring
- Hardware built during the program = Recurring
> Non-recurring costs are one-time development costs such as proof of concept and production molds; recurring costs are maintenance and production costs incurred repeatedly, including hardware built during the program, software installations and spares.
:::

+++

Non-recurring and recurring costs must be broken out to add fidelity to estimates, accounting for anomalies such as **production quantity** and **time-phasing** differences.

- **Non-recurring cost**: development costs, incurred once — e.g., developing proof of concept, setting up the factory line for production, building production molds, upgrades/improvements, and the original purchase of hardware/software.
- **Recurring cost**: maintenance and production costs, incurred repeatedly — e.g., hardware built during the program, capitalized non-recurring hardware/software, developed software installations, and **spares**, since spares are a continuous expense.

{{primer}}

A related distinction is **fixed vs. variable cost**: fixed costs don't change as the production rate changes (e.g., **rent** for facilities), while variable costs do change with production rate (e.g., **electricity consumed** or **overtime pay**).

### Why Separation Matters

Non-recurring and recurring costs must be broken out to add fidelity to the estimates. Grouping costs helps the cost estimator account for anomalies (e.g., production quantity differences and time-phased cost differences). Misleading information and conclusions are drawn when people roll all costs together and just discuss the total costs.

+++

:::tip Beyond CEBoK
It's common to say **learning curves apply only to recurring costs**, and non-recurring costs are fixed and don't decline with quantity. If recurring and non-recurring costs are left mixed into per-unit cost figures, the apparent unit-cost trend can be distorted. Module 7 (Learning Curves) covers the mechanics of separating and fitting these curves in detail.
:::

:::key
**Non-recurring and recurring costs must be broken out to add extra fidelity to the estimates.** Rolling all costs together leads to misleading conclusions.
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
      body: String.raw`:::primer:::
Imagine a dataset already converted to one base year and one set of units.

:::check
Q: Is that dataset ready for a CER fit?
- Yes, once dollars and units match it is fully normalized
* Not necessarily: any checklist dimension left unchecked can invalidate the conclusion
- Yes, any other differences average out in the regression
> This study-aid checklist (not CEBoK's list) covers time, quantity, content, units, state of development, recurring vs. non-recurring, and source. If any dimension is left unchecked, your conclusion may be invalid.
:::

+++

:::tip Beyond CEBoK
These mistakes and the checklist are a study aid, not CEBoK content. CEBoK's own list is the types of data normalization given earlier in this module.

**Common mistakes**

1. **Comparing unnormalized cost data** — comparing then-year dollars, different quantities, or different scopes directly, producing invalid conclusions.
2. **Ignoring content differences** — pooling data where one source includes spares/support and another does not.
3. **Failing to separate recurring from non-recurring cost** before analyzing production cost trends or fitting learning curves.
4. **Treating secondary data as equivalent to primary data** without understanding how it was compiled or what definitions were used.
5. **Skipping the "total picture" step** — collecting data before understanding the estimate structure/WBS, leading to wasted effort or gaps.
6. **Using data without documenting its source**, making the estimate non-traceable and hard to defend in review.
7. **Ignoring state-of-development differences**, e.g., comparing a prototype unit's cost to a mature full-rate production unit's cost without adjustment.
8. **Mixing units of measure** (e.g., kilograms vs. pounds, then-year vs. constant dollars) without converting first.
9. **Relying solely on subjective/expert data** when objective data is available and could corroborate or replace it.

**Normalization checklist**

Before performing statistical analysis or CER development, review your dataset across all these dimensions:

- ✓ **Time basis**: All costs converted to the same base year (or treated as constant-year)?
- ✓ **Quantity basis**: Learning curves (if applicable) applied to adjust to a common unit (e.g., T1)?
- ✓ **Content/scope**: All data points defined to include/exclude the same elements?
- ✓ **Units of measure**: All weights in the same units, all costs in the same scale?
- ✓ **State of development**: Data points at comparable phases (prototype vs. LRIP vs. full-rate)?
- ✓ **Recurring vs. non-recurring**: Separated before learning curve or unit-cost analysis?
- ✓ **Source documented**: Every data point's source and context recorded?

If any dimension is left unchecked, your conclusion may be invalid.
:::

{{primer}}

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
A: Not by assuming them away. Reducing unusually high inexperienced labor hours is allowed only if the labor mix is adjusted in the normalized set to reflect future project conditions; normalization needs to be defensible and well documented, and the concept of reversible operations applies.
Q: Why is data collection so critical to cost estimating?
A: Because an estimate is only as good as the data used to produce it. Data provides credibility and defensibility to estimates; without it the estimate would be merely a guess or the opinion of the cost estimator.
Q: Key principles of data collection
A: (1) Comply with how the organization collects data/costs; (2) not just cost data: technical and programmatic too (enables CGF/SGF); (3) normalization does not assume or normalize away costs (reversible, documented); (4) collection, normalization, and analysis are not linearly sequential; (5) goal is homogeneous data (e.g., common WBS).
Q: What does the aircraft example illustrate about cost data?
A: Cost numbers alone are meaningless without context. 6.8 means nothing without a descriptor; \$6.8K in BY1989 dollars for the procurement of one radio for an F-15C fighter is usable. Technical and programmatic data supply the context.
Q: Why does context matter in data collection?
A: Raw numbers are meaningless without understanding what is/is not included (scope), the conditions under which they were generated, and anomalies. Technical and programmatic data provide this context.

## Types of Data
Q: Three broad categories of data collected for every estimate
A: Cost (resource) data in dollars and hours tied to an activity or product; technical data derived from requirements or physical characteristics of systems; programmatic data, the program parameters that explain and drive cost.
Q: Why are all three types needed together?
A: Technical and programmatic data provide the basis for cost and also drive cost. They provide the context that cost numbers need; cost numbers alone are meaningless without context.
Q: Cost data examples
A: Dollars, labor hours, material costs, rates, by WBS element and time period.
Q: Technical data examples
A: Component size and weight, reliability and maintainability parameters, satellite payload requirements, crew size and composition, activity rates (e.g., flying hours), deployment plans.
Q: Programmatic data examples
A: Schedules, value-chain structure (contractor and tiers of subcontractors), contract types, acquisition environment (e.g., sole source vs. competitive).
Q: Primary vs. secondary data
A: Primary: obtained from the original source, unaltered actual historical data (e.g., BOMs, documented test results, documented resource hours); most defensible, highest quality, most useful. Secondary: based on primary data but derived, sanitized for classification/proprietary purposes, or changed from the original (e.g., cost estimates, factor books, studies/white papers, contractor cost report summaries, subcontractor cost data); lesser quality, but valuable for cross-checking.
Q: Quantitative vs. qualitative data
A: Numeric (quantitative, preferred) vs. descriptive/categorical (nominal) describing a quality. Transform qualitative data into quantitative data or replace it when possible.
Q: Objective vs. subjective data
A: Measured/recorded facts vs. judgments (e.g., SME ratings, expert opinions).
Q: Strongest data combination
A: CEBoK says primary, quantitative, and objective data are each preferred.
Q: CEBoK's Quality of Data Types ranking (best to worst)
A: Actuals for completed programs/contracts > EACs for contracts >90% complete (caution: some problematic programs re-baseline well beyond schedule) > Schedule B contract line item prices (generally the EAC at 0% complete) > Historical/original budget data (lowest; not actual spent cost; most exists at a level too high to be useful).
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
A: Availability (does the data exist in sufficient quantity?), accessibility (can the estimator access it?), validity (is it relatively current and applicable?), constraints (time and the underlying estimate requirements).
Q: Common data pitfalls
A: Inconsistent data definitions (e.g., MTTR; definitions can change over time, so capture them) and unusual program characteristics (new technology/materials, aggressive schedule, contractor manufacturing process changes, new cost reduction initiatives). Other pitfalls (budgets as actuals, stale data, etc.) are not CEBoK's list.
Q: Why not use budgets as actuals?
A: Budgets are plans, not what was actually spent. Mixing them with actuals misrepresents true costs and distorts trends.

## Data Collection Process
Q: Data collection process steps (in order)
A: 1) Understand the total picture of the estimating task · 2) Establish a Cost Element Structure (CES) and boundaries around the estimate · 3) Understand the estimating technique to be employed and its associated data collection needs · 4) Develop a data collection plan.
Q: What is a data collection plan?
A: A plan to capture primary and secondary cost, technical and programmatic data so every CES cost element is covered; identifies data owners/keepers, how to obtain and safeguard the data, primary and backup sources, cross-check sources, a projected timeline, and gets approval at the beginning.
R: yes
Q: Why develop a data collection plan?
A: It ensures every CES cost element is covered, identifies backup and cross-check sources, keeps the estimate on schedule via a timeline, and secures customer buy-in through approval.
Q: Data needed for CER development
A: Understanding the cost drivers of the system being estimated is critical. The challenge is not to collect numbers but to understand the factors that drive or influence cost and to collect data on those drivers. Cost drivers are important independent variables in CERs.
Q: What is the WBS and why does it matter for data collection?
A: The Cost Element Structure (CES) defines what is estimated and how it is shown, and adds structure to data collection and helps track data deficiencies. A common standard WBS (e.g., MIL-HDBK-881A) keeps the data provider and cost estimator in sync. The CES is not the same as a contract WBS.
Q: CES vs. contract WBS
A: The CES (Cost Element Structure) is not the same as a contract WBS. The CES is all-inclusive, spans the entire subject and timeframe being estimated, and is bounded/tailored to the customer's needs.
Q: Cost driver examples
A: Flying/steaming hours (operations); production quantity, lot number, or unit number (production); linear feet and power (cabling); functional requirements and interfaces (software); operating environment (manned/unmanned space, surface sea, commercial).
Q: SME caution
A: Reputable cost estimators scrupulously avoid portraying expert opinion as data. SME expertise is best used to interpret or re-create historical data, not replace it.
## Data Sources
Q: What is CSDR?
A: Cost and Software Data Reporting; CCDRs, SRDRs and CSDRs for major defense programs are held in CADE (managed by DCARC), the DoD authoritative centralized repository for cost and software data. ("1921" forms and FlexFiles are Beyond CEBoK.)
R: yes
Q: Major data sources (non-DoD and DoD)
A: CEBoK categories: requirements documents, baseline descriptions (CARD, ICBD), technical databases, contractor-provided documentation, contractor cost reports (C/SCSC, CPR, C/SSR, CFSR, CCDR), accounting data, CADE/DCARC, labor rate data (FPRAs, DCAA/DCMA), FFRDCs/external organizations, other information systems.
Q: IPMDAR / FlexFiles (Beyond CEBoK)
A: Not CEBoK terms. IPMDAR is DoD's current EVM report, largely replacing the paper CPR/CFSR; FlexFiles increasingly replace the older "1921" CCDR forms. CEBoK uses CPR as its term.
Q: Strength of contractor cost records
A: (Beyond CEBoK) Primary, objective, detailed data; weakness is access/proprietary restrictions.
Q: Strength of government cost databases
A: (Beyond CEBoK) Convenient, often pre-normalized; weakness is they may obscure original definitions/context.
Q: Strength of SME interviews
A: (Beyond CEBoK) Fills gaps, adds context; weakness is subjectivity and potential bias.
Q: Strength of published/industry literature
A: (Beyond CEBoK) Broad technical coverage; weakness is variable reliability and commercial vs. defense mismatch.

## Normalization
Q: Purpose of normalization
A: Make data consistent and comparable to other data being used in the estimate, so it is usable for estimating.
Q: Types of data normalization (CEBoK list)
A: Cost units; sizing units; special groupings such as mission application; platform operating environment; recurring/non-recurring costs; development state; and end terms for homogeneity (content).
Q: Cost (inflation) normalization
A: Convert all dollars to a common base year using inflation indices so purchasing power is consistent. This price-level adjustment is called escalation.
R: yes
Q: Escalation worked example (from CEBoK)
A: \$50,000 (CY1994, AN/ARC-164 radio) escalated to BY2000 using AF index 0.957: \$50,000 / 0.957 ≈ \$52,247 (BY2000). Dividing the 1994 cost by the index gives the escalated BY2000 cost.
Q: Quantity normalization
A: (Beyond CEBoK) Adjust costs to a common point on the learning curve so unit costs at different production quantities are comparable. Mechanics covered in Module 7.
R: yes
Q: Cost per labor hour normalization
A: Know what is included in the cost per labor hour: it may be fully loaded or burdened, just touch labor, or include a fee. Check the cost units (\$, \$K, \$M, \$B).
Q: Sizing normalization
A: Convert all weights to one standard (kg/oz/tons; metric ≠ long tons for ships) and all lengths to one standard before computing rates like cost per foot/ton/pound.
R: yes
Q: Unit conversion example (EUR/meter to USD/foot)
A: €5/meter x \$1.13/€ / 39.37 in/meter x 12 in/foot ≈ \$1.72/foot. The same method converts optical cable pricing (e.g., €10/meter ≈ \$3.44/foot).
Q: The Mars orbiter unit-mismatch anecdote
A: In 1999 NASA lost a \$125M Mars orbiter because navigation data mixed English and Metric units, causing a crash.
R: yes
Q: Content normalization
A: Account for both missing and excess sub-elements (LRU, SRU, sub-components, integration) to form a common base for comparison; ask what makes up the unit.
R: yes
Q: Content normalization example (copier/fax)
A: Don't directly compare a plain copier to a copier-fax combo; account for the missing/extra fax capability (e.g., the average cost premium of copier-fax units) before comparing.
Q: State of development normalization
A: Account for the system's stage in the development cycle (concept/EMD/prototype vs. full-rate production, akin to a Beta-test phase) and learning-curve impact; can be isolated further by item or lot quantity.
R: yes
Q: Units of measure normalization
A: Ensure consistent units (all weights in pounds, all costs in millions, all labor in hours) before combining or comparing values.
Q: Key groupings (normalization)
A: Group by mission application (e.g., emitters, submersibles, bombers, fighters), operating environment (manned/unmanned space, aerospace, shipboard, commercial), recurring vs. non-recurring, and variable vs. fixed.

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
A: (Beyond CEBoK) Makes the unit cost trend appear steeper (more apparent learning) than it actually is, because per-unit non-recurring cost shrinks as quantity grows, creating a false impression of accelerated learning.
Q: When is non-recurring cost "absorbed" by quantity?
A: (Beyond CEBoK) As quantity increases, the per-unit non-recurring cost decreases, but that's an accounting effect, not true learning. Separating them reveals the real learning curve.
Q: Fixed vs. variable cost
A: Fixed costs don't change with production rate (e.g., rent for facilities). Variable costs change with production rate (e.g., electricity consumed, overtime pay).

## Normalization Checklist
Q: Normalization checklist items (all must be verified before statistical analysis)
A: (Beyond CEBoK) Time basis (same year) · Quantity basis (learning curve applied) · Content/scope (same elements) · Units of measure (consistent) · State of development (comparable phase) · Recurring vs. non-recurring (separated) · Source documented (traceable).
Q: What happens if you skip normalization on one dimension?
A: (Beyond CEBoK) The comparison or CER may be invalid. Mixing unnormalized data can produce spurious trends or incorrect conclusions.
Q: A strong correlation found in pooled cost data from different programs
A: (Beyond CEBoK) Still requires checking that all data is normalized (same year/currency basis, same state of development, etc.). Strong statistical fit can be misleading if underlying data is unnormalized.

## Common Mistakes
Q: Most common data collection mistake
A: (Beyond CEBoK) Comparing unnormalized cost data (different years, quantities, or scopes) and drawing incorrect conclusions without normalization.
Q: Pitfall: pooling data with mixed definitions
A: (Beyond CEBoK) Distorts trends and produces invalid CER. All data must reflect the same defined scope and definitions before pooling.
Q: Pitfall: state-of-development differences
A: (Beyond CEBoK) Comparing prototype costs to mature production costs without normalization falsely suggests one program is cheaper, when actually they are at different phases.
Q: Pitfall: no source documentation
A: (Beyond CEBoK) Estimate becomes non-traceable and hard to defend in review. Every data point's source and context must be documented.
Q: Pitfall: treating secondary as primary
A: (Beyond CEBoK) Secondary data requires more scrutiny. Estimator must understand how it was compiled and what definitions it retains before relying on it.
`
});
