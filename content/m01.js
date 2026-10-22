PCEA.addModule({
  id: 'm01', num: 1, title: 'Introduction to Cost Estimating and Analysis', short: 'Intro to Cost Estimating', source: 'guide',
  blurb: 'What cost estimating is, the products it creates, and the repeatable process behind a credible estimate.',
  intro: String.raw`**Cost estimating** predicts the future cost of a system, product, or program based on historical data and quantitative models. **Cost analysis** is broader: it evaluates estimates, compares alternatives, and assesses risk to support decisions.

This module sets up the vocabulary for the rest of the course: definitions, who produces estimates, what they deliver, and the process to build a credible one.

**Key framework:** A cost estimate is only as credible as its technical baseline, data, and methodology. This module covers why estimates are needed and who produces them; the context, benefits, qualities, limitations, and challenges of estimating; the four cost estimating products; and the seven-step process used to build them.`,
  sections: [
    {
      id: 'definition', title: 'Cost estimating vs. cost analysis', summary: 'Definitions, purpose, and the key distinction',
      body: String.raw`:::primer:::
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

**Cost estimating** is the process of collecting and analyzing historical data and applying quantitative models, techniques, tools, and databases to **predict the future cost** of an item, product, program or task to facilitate the successful completion of a program, project, or process.

Often, the cost estimator adjusts for new materials, new technology, a new software programming language, or new resource allocations. Still, the estimate must never become divorced from historical experience or it risks losing credibility.

Cost estimating has three primary functions:
- **Translates requirements**: system and functional requirements into budget requirements
- **Communicates realistic outcomes**: determines and communicates a realistic view of the likely cost outcome of a system or program
- **Grounds the plan**: forms the basis of the plan to develop, field, and support the system or program

For commercial entities (contractors), the estimate underpins new business proposals and the bid/no-bid decision. For government entities, an Independent Cost Estimate (ICE) or the program estimate serves as the basis for budget submissions.

{{primer}}

**Cost analysis** is broader. It includes estimating, but also covers evaluating and comparing costs to support decisions: analyzing alternatives, assessing affordability, reviewing proposals, and tracking performance against a baseline.

:::key
An estimate turns **uncertain future resources** into numbers decision-makers can act on. It should come with its assumptions, its method, and its uncertainty.
:::

+++

### Purpose

Cost estimating serves three primary reasons:

**1. Budgeting and Programming**: Independent Cost Estimates (ICEs) provide the basis for improving program budgets to give programs a chance for success and ensure effective utilization of valuable agency resources. If a program runs over budget, other programs' resources will be diverted to cover the additional costs, which can cause a detrimental ripple effect through other programs. Some programs that run far over budget will be terminated, leaving a gap in capabilities. Success in supporting budgeting should be measured by a track record showing how long each ICE-based budget proves adequate on a year-by-year and cumulative basis. The track record should determine in what fiscal years relative to the ICE the program **first ran a deficit** and **first incurred a debt** (i.e., net cumulative shortfall).

**2. Planning**: After establishing the budget, estimating supports the development of Basis of Estimate (BOE) documentation that establishes the integrated baseline. Cost estimates enable Earned Value Management (EVM) to track cost and performance against this baseline.

**3. Trade-offs**: Trade-off studies use baseline cost estimates to explore the relative cost impact of changing requirements. Trade-offs aim to achieve the proper balance between maximizing utility and minimizing cost. Often the cost impact of trades is cursory. Overall progress toward cost goals must be measured by periodic Life Cycle Cost Estimates (LCCEs), **preferably based on a closed engineering design**.

+++

### Applications

As part of a total systems analysis, cost estimating helps decision makers:
- make decisions on program viability, structure, and resource requirements
- establish and defend budgets
- conduct Analysis of Alternatives (AoA)
- create new business proposals and perform source selection
- conduct in-process reviews of major projects
- perform design trade-offs
- assess technology changes
- comply with public law
- satisfy oversight requirements

:::check
Q: Which statement best distinguishes cost *analysis* from cost *estimating*?
- They are synonyms; the terms are interchangeable
* Analysis includes estimating plus evaluating and comparing costs to support decisions
- Estimating is broader than analysis
- Analysis focuses on historical costs, while estimating predicts future ones
> Estimating produces a single cost prediction. Analysis uses estimates and actuals to evaluate alternatives, assess affordability, review proposals, and support program management decisions.
:::

+++

### How estimates differ from guarantees

An estimate is a **prediction**, not a guarantee. The future is inherently uncertain. A good estimate is:
- **Defensible**: based on valid data and sound method
- **Reproducible**: someone else can recreate it from the documentation
- **Documented**: assumptions, method, and results are explicit and traceable

A good estimate may turn out to be "wrong" in hindsight — not because the estimator was careless, but because actual market conditions, technology evolution, or program decisions diverged from what was assumed.

:::check
Q: An estimate predicts the cost of a new system will be \$45M. Five years later, actual cost is \$62M. Which is most likely true?
- The estimate was wrong and the estimator was incompetent
* The estimate was sound given available data at the time, but assumptions or conditions changed
- The difference proves estimates are useless for decisions
> Estimates are predictions, not guarantees. They are evaluated on whether they were sound given available information, reproducible, and documented — not on whether they perfectly predicted an unknowable future.
:::`
    },
    {
      id: 'context', title: 'Context: when and why estimates are needed', summary: 'Budgeting cycles, milestones, and phases',
      body: String.raw`:::primer:::
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

Cost estimating is critical throughout the program lifecycle. A reasonable, supportable, and responsive budget supports efficient execution and is founded on competent estimates.

### Government Budget Cycles and Milestones

Within DoD, the **Programming, Planning, Budgeting, and Execution System (PPBES)** requires cost estimates for Program Objective Memorandum (POM) submissions. These estimates are revised through service comptroller, Office of the Secretary of Defense (OSD), and President's budget reviews. Budget justifications support white papers, budget cut analysis, and resource planning.

Major programs require **validated cost estimates** to continue through milestone reviews. DoD Instruction 5000.2 (Operation of the Defense Acquisition System) and DoD Instruction 5000.4-M (Cost Analysis Guidance and Procedures) mandate that programs develop both a Program Office Estimate (POE) and a DoD Component Cost Analysis (CCA) at acquisition milestones.

As programs mature technically and schedules change, cost estimates must be **periodically updated** to maintain management insight into program status, control resources, and balance the budget.

### Estimate Types by Lifecycle Phase

{{primer}}

Different phases require different types of estimates:
- **Pre-acquisition phase**: Analysis of Alternatives (AoA) and trade studies to select among alternatives before committing to a project
- **Systems acquisition phase**: Source selection estimates to compare competitors' approaches
- **Pre-production phase**: Cost studies before full-scale production
- **Throughout lifecycle**: Periodic ICEs for budgeting and cost tracking as requirements change

:::widget lifecycle-estimates:::

:::challenge lifecycle-estimates
Q: Drag the slider to the "In-process / O&S" phase. Which estimate type becomes applicable there that wasn't available earlier (it needs enough actual cost history and typically leans on EVM)?
goal: eacActive ~ 1 +- 0
show: phase=3
> The Estimate At Completion (EAC) applies to in-process programs once there's sufficient cost history, typically built from EVM techniques.
:::

:::check
Q: Why do programs need a validated cost estimate at major milestones?
- It is required only for government contracts
* To ensure informed decision-making and provide management insight into current program status and resource needs
- To satisfy the contractor's internal controls
- Only for programs that are over budget
> DoD Instructions 5000.2 and 5000.4-M mandate validated estimates at milestones to support milestone reviews and acquisition decisions, similar to stage-gate processes in industry.
:::`
    },
    {
      id: 'orgs', title: 'Who estimates: organizations and skills', summary: 'Government, contractors, and oversight bodies',
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

| Organization | Role |
|---|---|
| **Program Office** | Develops estimates from within the program; closest to technical detail but may be subject to advocacy bias (incentive to show affordability). |
| **Independent Government Cost Orgs** (e.g., DoD's **CAPE**, service cost agencies) | Build independent estimates outside the program's chain of command; objective, unbiased check at major milestones. |
| **Contractor Cost Estimators** | Develop proposal cost estimates for government or commercial solicitations; basis for contract negotiation. |
| **GAO (Government Accountability Office)** | Audits federal cost estimates against the GAO Cost Estimating and Assessment Guide (best practices). |
| **OMB (Office of Management and Budget)** and **Congress** | Provide broader fiscal oversight and responsibility for government budgets and legislation. |
| **Manufacturers** | Track operating costs to manage and reduce them; vital for competitive advantage and profitability. |
| **FFRDCs and support organizations** (IDA, RAND, Aerospace, MITRE) | Provide estimating and analysis support to government sponsors. |
| **Consultants** | Provide specialized estimating support to any of the above groups. |

{{primer}}

:::key
Multiple independent organizations exist specifically to **counter advocacy bias and optimism** — a recurring theme throughout PCEA.
:::

:::tip Beyond CEBoK
The **Congressional Budget Office (CBO)** provides cost estimates of legislation for Congress. Other specialized oversight and analysis organizations may exist in specific agencies or sectors; this module focuses on the core cost estimating organizations in DoD and government acquisition.
:::

+++

### Skills an estimator needs

Cost estimators draw on a blend of skills and domains of expertise:

| Area | Why |
|---|---|
| **Mathematics and Statistics** | Probability and statistics, regression analysis, algebra; cost models and tools. |
| **Economics, Business, and Accounting** | Understanding inflation, cost accounting data, and economic concepts that shape estimates. |
| **Budgeting Process** | Knowledge of how cost estimates are used for resource allocation and budget planning. |
| **Operations Research, Management Science, and Industrial Engineering** | Optimization techniques for system development; IE methods for production analysis. |
| **Technical and Engineering Understanding** | Enough knowledge to understand the system, evaluate the baseline, and identify cost drivers. |
| **Research and Data-gathering** | Locating, collecting, and validating historical data from diverse sources. |
| **Communication and Salesmanship** | Clear documentation, briefing non-technical decision-makers, and defending estimates on their merits. |
| **Marketing** | Understanding how to develop competitive proposals and support new business. |

:::key
Cost analysis draws on accounting data but is **neither accounting nor auditing**: it uses financial and technical data to project a future cost, not to record past transactions or verify compliance.
:::

:::check
Q: Which domain is essential for a cost estimator to understand inflation and cost accounting?
- Marketing and salesmanship
* Economics, business, and accounting
- Quantitative analysis only
- Technical and engineering knowledge
> Cost estimating relies on cost accounting data and economic concepts like inflation. Understanding business and accounting systems is fundamental to credibility.
:::

### Positional independence

An org chart alone decides whether a cost estimate can be called independent. CEBoK: the cost group (**I**) doing the estimate is **positionally independent** of the acquiring organization (**A**) if and only if it shares no common superior with the acquiring organization — down to the sponsor (**S**), or a delegate directly below the sponsor who plays the same role (**B**). Two structures from the CEBoK chart both work: in Case 1, I and A both report straight to S; in Case 2, an extra layer exists and both report to B instead, with B acting "just like S." Either way S (or S through B) can accept the estimate. What does *not* work is I sharing a nearer, lower-level boss with A — or worse, I reporting into A's own chain.

:::widget independence:::

:::challenge independence
Q: I currently reports to B and A reports to B (CEBoK Case 2). If you instead move I so it reports directly to A, is I still positionally independent?
goal: independent ~ 0 +- 0
show: iParent=A
> Moving I under A makes A a superior of I, so their nearest common superior becomes A itself — the opposite of independence.
:::`
    },
    {
      id: 'quality', title: 'Six characteristics of high-quality cost estimates', summary: 'CEBoK framework for reliability and credibility',
      body: String.raw`:::primer:::
An estimate can get every number right and still fail as an estimate.

:::check
Q: An estimate's numbers are accurate and fully documented, but it reaches decision makers a week after the budget decision was made. Is it a high-quality estimate?
- Yes: accuracy and documentation are what make an estimate high quality
* No: an estimate that arrives after the decision provides no value
- Yes, as long as it can be reused in the next budget cycle
> **Timeliness** is one of the six characteristics: even a high-quality estimate provides no value if it isn't delivered to decision makers on time.
:::

+++

The characteristics of high-quality cost estimates are:

| Characteristic | Meaning |
|---|---|
| **Accuracy** | Estimates are unbiased, neither unrealistically low nor overly conservative. Based on normalized data, valid inflation adjustments, and CERs with good curve fits and minimal error bands. Time-phasing is logical and reliable. |
| **Comprehensiveness** | The estimate uses a WBS at appropriate detail to ensure all cost elements are included exactly once with no gaps or double-counting. All cost-driving Ground Rules and Assumptions (GR&A) are detailed. |
| **Replicability** | The estimate presents a WBS fully traceable to system specifications. Source data, CER statistics, detailed calculations, results, and methodology rationale are thoroughly documented. |
| **Auditability** | A reviewer can follow the estimation process, repeat the calculations, and arrive at the same answer. The estimate is transparent and verifiable. |
| **Credibility** | **The single most important quality.** Requires the estimate to be accurate, replicable, and auditable. Limitations, risk, and uncertainty are discussed; sensitivity and cross-checks are performed; differences are reconciled. |
| **Timeliness** | Even a high-quality estimate provides no value if not delivered to decision makers on time. Timing is critical to decision support. |

{{primer}}

:::check
Q: A cost estimate includes detailed labor and material breakdowns, but does not mention the source of historical cost data or the assumptions underlying the labor rates. Which quality is most at risk?
- Comprehensiveness (should include all cost elements)
* Replicability (sources and assumptions must be documented so others can recreate it)
- Accuracy (no way to verify without the documentation)
- Credibility (cannot cross-check without knowing the method)
> Replicability means someone unfamiliar with the program can trace and recreate the estimate from the documentation. Omitting data sources and rate assumptions makes it impossible to verify or reproduce.
:::

:::tip Beyond CEBoK
The GAO (Government Accountability Office) defines a reliable estimate with four characteristics: Comprehensive, Well-documented, Accurate, and Credible. CEBoK expands this to six characteristics: Accuracy, Comprehensiveness, Replicability, Auditability, Credibility, and Timeliness. Both frameworks are widely used and respected in cost analysis practice.
:::

Toggle common estimate flaws below and watch which of the six characteristics fail. Credibility fails automatically whenever Accuracy, Replicability, or Auditability fails, since CEBoK defines credibility as requiring all three; Timeliness is independent of the other five.

:::widget quality-check:::

:::challenge quality-check badCER=1 omitDouble=1
Q: An estimator reused last year's CERs, which turned out not to be normalized for inflation, and two WBS elements were double-counted. How many of the six characteristics fail?
predict: failCount +- 0
> Bad CERs breaks Accuracy; double-counted elements breaks Comprehensiveness; Credibility fails too because it needs Accuracy, Replicability, and Auditability all to hold, and Accuracy just failed. That is 3.
:::

+++

### Benefits of Accurate Cost Estimating

**For Government**: Accurate estimates assess the reasonableness of contractor proposals and help defense budgets to oversight organizations (OSD, OMB, Congress). They enable quick and accurate assessment of budget cut impacts.

**For Manufacturers**: Accurate cost estimates are essential for profitability and competitive advantage. An organization that completes projects within a reasonable budget enhances its reputation and future business opportunities.

Accurate estimating avoids two costly mistakes:
- **Buying In**: Bidding far below actual effort to win the contract. As development proceeds, the true cost becomes apparent, and either the customer or manufacturer absorbs the overrun, leading to lost profit or bankruptcy.
- **Pricing Out**: Estimating too high, making the bid non-competitive and losing market share.

Accurate, defensible estimates provide the framework for winning work at a reasonable profit while maintaining competitive advantage.

+++

### Challenges to Cost Estimating

Six primary challenges arise during cost estimation:

**1. Decision Support**: Difficult to quantify cost impacts of alternatives; challenges in establishing Cost Estimating Relationships (CERs) linked to correct design parameters; cost analysis cannot directly exchange non-cost variables (requires operations research techniques).

**2. Quality**: Obtaining good data is a notoriously difficult problem. Analysts often access only secondary data adjusted multiple times from original sources. Inadequately documented estimates lose credibility; information and tacit knowledge are lost when analysts leave.

**3. Coordination**: System costs frequently cut across organizational boundaries. Data collection and validation require extensive coordination, consuming considerable time and resources.

**4. Consistency**: Estimates must remain consistent throughout a program's lifespan and align with previous estimates. Comparing estimates across different structures requires mapping or adjusting for differing assumptions. Inconsistent historical data within and between sources creates barriers.

**5. Resource and Schedule Constraints**: Estimates must be delivered timely or they become obsolete. Schedule must account for data availability without compromising quality. Time pressure impacts quality, coordination, and consistency.

**6. Security and Access**: Proprietary or classified data restrictions may limit access to cost data and completed estimates. Data protection precautions can slow the process.

### Limitations of Cost Estimating

Realistically, cost analysis should:
- **Conform** to the program and situation
- **Match input quality**: results are only as good as the input data
- **Disregard** political and non-cost impacts
- **Employ** sound judgment and management
- **Support, not dictate**: estimates inform decisions but do not make them

:::check
Q: A program is in early concept phase with a poorly defined technical baseline and very limited historical data. Which challenge is most likely to impact the estimate?
- Coordination across organizational boundaries
- Security and access restrictions
* Quality: limited data forces reliance on weaker methods and compromises estimate credibility
- Resource constraints will prevent any estimate from being developed
> Early programs face fundamental data scarcity. This forces reliance on analogy and expert opinion rather than stronger methods, directly impacting quality. While other challenges exist, data limitation is the most fundamental constraint.
:::`
    },
    {
      id: 'products', title: 'The four cost estimating products', summary: 'Baseline, estimate, model, and documentation',
      body: String.raw`:::primer:::
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

An estimate is more than a single number. It consists of four primary deliverable products:

{{primer}}

### 1. Technical and Schedule Baseline Description

The **technical baseline** describes *what* is being estimated:
- **What the system is**: technical characteristics, performance parameters, design maturity.
- **What the program will do**: acquisition strategy, quantities, testing and deployment approach.
- **When things happen**: schedule of major milestones, production rates, key decision dates.

In DoD, this is formalized in the **Cost Analysis Requirements Description (CARD)**, which gives all estimators a common starting point. Changes to the baseline must be tracked because they directly affect the estimate.

:::tip
Treat the baseline as an explicit, documented assumption set — not an implicit understanding. When the baseline changes, the estimate must be revisited.
:::

### 2. The Cost Estimate

The **cost estimate** is the quantitative output: a summation of individual cost element estimates (organized by the WBS) into a total, usually time-phased by year and by appropriation/funding category.

Estimates vary by type and fidelity, as detailed below.

### 3. The Cost Model

The **cost model** is the structured tool (spreadsheet, software, calculator) that organizes the WBS, applies estimating methods and cost estimating relationships (CERs) to each element, and produces the results.

A good cost model is:
- Traceable to the technical baseline
- Flexible enough to support sensitivity analysis and "what-if" trades
- Documented so another analyst could reproduce and verify it

A **cost model** is the collection of cost estimating methodologies associated with a cost element or WBS that best reflects the cost of a future system given three important considerations:
- The **level of detail of technical/programmatic definition** of the future system
- The **level of detail of relevant existing cost estimating methodologies**
- The **level of detail of historical data** available to develop new cost estimating methodologies

**Model structure:** Depending on the system's maturity and the scope, time, and resources given for the estimate, the analyst may develop a model structure at varying levels of detail. Analysts may build custom models, use commercially available software, or both. The model should apply some combination of accepted estimating techniques such as parametric, analogy, and engineering build-up.

### 3a. Types of Estimates

Eight types of estimates support different purposes throughout the program lifecycle:

| Type | Purpose |
|---|---|
| **LCCE (Life Cycle Cost Estimate)** | Comprehensive; covers R&D, production, O&S, and disposal across the entire program life. Compiled as early as possible; basis for milestone decisions. |
| **ICE (Independent Cost Estimate)** | Built by an organization independent of the program office, using the same baseline but different methodology. Provides objective assessment and identifies potential budgetary excesses and shortfalls. |
| **Budget Estimate** | Developed strictly for funding authorization. Wider margin for error than other types; ensures feasibility and establishes baseline definitions and costs. |
| **ROM (Rough Order of Magnitude)** | Very early, low-fidelity feasibility/screening estimate with wide uncertainty range. Used when little specific information is known. |
| **EAC (Estimate At Completion)** | Used for in-process programs when sufficient cost history exists. Relies on Earned Value Management techniques. Critical for Nunn-McCurdy Act certification. |
| **ICA (Independent Cost Assessment)** | Independent estimate with risk incorporated; starts with external estimate and adjusts based on objective view. Ranges from full ICE to cursory sufficiency review. |
| **EA (Economic Analysis)** | Describes mission requirements and alternative courses of action. Compares costs and benefits (quantified monetarily). Also called cost-benefit analysis or Business Case Analysis. |
| **AoA (Analysis of Alternatives)** | Evaluates costs and benefits (operational effectiveness/utility) of different courses of action. Involves performance characteristics as well as costs. |

:::tip Beyond CEBoK
Additional estimate types used in practice include: **POE (Program Office Estimate)** - developed by the program's own estimators, closest to technical detail; **Should-cost Estimate** - what a program should cost with efficient operations, used to identify cost reduction opportunities and negotiate contracts; **IGCE (Independent Government Cost Estimate)** - the government's estimate of a contract cost, used in source selection and negotiations.
:::

+++

### 4. Estimate Documentation

Documentation is the fourth deliverable product, not an afterthought. It provides written justification for the cost estimate and demonstrates credibility. All steps in the estimate's development must be documented, including definitions, GR&A, methods, and rationale for method selection.

Documentation typically includes:
- Ground rules and assumptions (GR&A)
- Technical and schedule baseline description
- Data sources and adjustments (normalization, inflation)
- Methodology by cost element and rationale for method selection
- Results, including time-phasing, sensitivity and risk/uncertainty analysis
- Comparison to any independent estimates and reconciliation of differences

**Report Requirements**: The report must be:
- **Crisp and complete**: covering the entire estimate scope
- **Easily understood**: quickly comprehended by audiences unfamiliar with the estimate
- **Thorough**: addressing important details of the estimate
- **Demonstrative**: showing the competence behind the results

For proposals, an executive volume should accompany the cost volume, summarizing technical aspects in simple terms since many evaluators lack technical background.

**Cost As an Independent Variable (CAIV)**: A discipline that sets aggressive yet realistic cost objectives when defining requirements and acquiring systems. CAIV makes performance and schedule functions of available resources (cost). Incorporates sensitivity and risk analysis. (Covered in detail in Module 16 Cost Management.)

:::check
Q: Which statement best explains why documentation is a *product* rather than an optional add-on?
- It is required by regulation
- It makes the estimate look more professional
* Documentation is what makes an estimate traceable, reproducible, and defensible — without it, credibility cannot be demonstrated
- The GAO requires it
> Credibility (one of GAO's four qualities) requires that someone unfamiliar with the program could recreate and verify the estimate. That is only possible with complete, traceable documentation of data, methods, assumptions, and calculations.
:::

:::check
Q: A life-cycle cost estimate for a 30-year system typically predicts costs far higher than an acquisition-only estimate. Why?
- LCCE includes optimism margins
- Government requirements always inflate costs
* LCCE includes Operating & Support (O&S) costs over 30 years, which often dwarf R&D and production
- Estimators pad the numbers to be safe
> O&S costs — maintenance, operations, training, support — cover the whole service life. (Beyond CEBoK: they often constitute 60–80% of total life-cycle cost for long-lived systems.) An acquisition-only estimate captures only R&D and production, missing the largest cost driver.
:::`
    },
    {
      id: 'process', title: 'The cost estimating process', summary: 'CEBoK seven steps and the WBS framework',
      body: String.raw`:::primer:::
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

The CEBoK outlines a repeatable, generally sequential process for building cost estimates. This process is the skeleton for most of the rest of CEBoK (Modules 2–13 expand each step).

### The seven CEBoK steps

{{primer}}

1. **Work Breakdown Structure (WBS) development**: Decompose the program scope into discrete, definable work elements (hardware, software, services, data) that can each be estimated and tracked.

2. **Program/System baseline development**: Establish the technical, programmatic, and schedule baseline; identify cost drivers; and define ground rules and assumptions (GR&A).

3. **Data collection**: Gather cost, technical, and programmatic data from analogous systems or prior phases. Develop a data collection plan and identify primary and backup data sources.

4. **Data analysis**: Normalize collected data (adjust for inflation, quantity, technical differences, recurring/non-recurring costs). Perform descriptive statistics and compare to historical factors and rules of thumb.

5. **Cost element methodology**: For each WBS element, select the most appropriate estimating method given available data and design maturity. Major families: **analogy**, **parametric (CER)**, **engineering build-up**, **extrapolation from actuals**, **expert opinion**.

6. **Model development and validation**: Integrate individual estimates into a cost model tied to the WBS. Validate with sanity checks, cross-checks, and sensitivity analysis.

7. **Results and report generation**: Summarize results (often time-phased by year and funding category). Present risk and uncertainty analysis alongside the point estimate. Deliver the documentation package (GR&A, data, methods, results).

:::check
Q: At what stage of the CEBoK process are ground rules and assumptions (GR&A) defined?
- During data collection (step 3), as data sources are identified
* During program/system baseline development (step 2), early in the process
- During methodology selection (step 5), before collecting data
- During report generation (step 7), when presenting results
> GR&A (base year, quantities, schedule, what is in or out of scope) shape every later step — data collection, methodology selection, and model structure all depend on them. They must be set early and documented so changes can be tracked.
:::

+++

### The Work Breakdown Structure (WBS)

A **WBS** establishes a common frame of reference for relating job tasks to each other and for relating project costs at the summary level of detail. It provides a consistent, visible framework for specifying the objectives, labor, materials, and contracts of the program/system. A standardized WBS also satisfies mandatory cost reporting requirements (Module 4).

The key WBS functions are to:
- **display and define** the program/system using a **product-oriented family tree**,
- **describe program components** at the level necessary to capture all elements of cost, and
- **relate the elements of work** to each other and to the end product.

The WBS must encompass **system-level activities** such as systems engineering, specific builds, integration, fielding, and support throughout the life cycle until the system is removed from inventory. It need not be identical across systems or phases but should be **consistent**, and can be **tailored** to capture a program's idiosyncrasies. Establish a **master WBS** for the whole life cycle as early as possible. CEBoK's example is the MIL-HDBK-881A aircraft WBS.

:::tip Beyond CEBoK
Common WBS conventions from MIL-STD-881 and PMI practice: Level 1 is the entire system, Level 2 the major elements (e.g., prime mission product, SEPM, test, training, data, spares), Level 3+ further breakdown; and the "100% rule" (every element of scope appears exactly once, no gaps or double-counting).
:::

The WBS is the backbone of the estimate: later steps (data collection, cost element methodology, model building) are all organized around it.

Figure 1.4's MIL-HDBK-881A aircraft WBS shows this in practice: a top level (Aircraft System) breaking into Air Vehicle plus supporting elements (Systems Engineering/Program Management, System Test and Evaluation, Training, Data, Peculiar and Common Support Equipment, Operational Site Activation, Industrial Facilities, Initial Spares and Spare Parts), with Air Vehicle itself decomposing into items like Airframe, Propulsion, and mission-system software and equipment. Most top-level items are appropriate as an analogy for a commercial airliner; at the Air Vehicle level, Reconnaissance, Antisubmarine Warfare, Armament, "and a few others" are not relevant to commercial airliners and can be ignored.

:::widget wbs-tree:::

:::challenge wbs-tree commercial=1
Q: The "Commercial airliner view" greys out the military aircraft elements that CEBoK says don't apply to an airliner. How many elements does it hide?
predict: hiddenCount +- 0
> The toggle hides the three elements CEBoK names: Reconnaissance, Antisubmarine Warfare, and Armament. CEBoK adds "and a few others" without naming them, so the widget hides only the named three.
:::

### WBS Dictionary

As part of WBS development, the program manager develops a **WBS dictionary** that:
- Lists and defines each WBS element
- Shows the hierarchical relationships
- Describes resources and processes required for each element
- Links to detailed technical definition documents

The WBS dictionary should be revised regularly to reflect current program status and document all changes for future reference.

### WBS vs. Cost Element Structure (CES)

The **WBS** typically views the program from an engineering standpoint (product-oriented family tree).

The **Cost Element Structure (CES)** specifically views the program from the cost estimating perspective. While the terms are often used interchangeably, a properly developed CES should encompass all WBS elements and provide a consistent framework for cost estimation and control.

+++

### Ground Rules and Assumptions (GR&A)

**GR&A** are explicit, bounding statements that define the scope, conditions, and key assumptions of an estimate. Examples:
- Base year dollars (e.g., "FY 2024 constant dollars")
- Quantities (e.g., "10 production units")
- Schedule milestones and production rates
- Scope in or out (e.g., "includes development and production test, excludes operational data integration")
- Inflation indices to apply
- Labor rates and overhead burdens

GR&A are documented early so the estimate is traceable and reproducible. If conditions change, GR&A clarify exactly which assumptions must be revisited.

:::check
Q: Ground rules and assumptions play a critical role in estimate credibility. Which is the best reason?
- They reduce the time needed to produce the estimate
* They make the estimate traceable and ensure anyone can verify what conditions it was built on
- They guarantee the estimate will be accurate
- They prevent sensitivity analysis from being necessary
> GR&A define the scope and conditions, so if someone else reads the documentation years later, or if program conditions change, it is clear what was assumed and what must be revisited. This traceability is what makes estimates reproducible and credible.
:::

+++

### Data Collection

Data is the foundation of credible estimates. The **four-step data collection process** ensures systematic data gathering:

1. **Understand the estimating task**: Understand the intended use, scope, and context of the estimate based on the program/system baseline definition.

2. **Establish cost structure**: Develop the Cost Element Structure (CES) based on the WBS; map existing data from different structures to the new structure.

3. **Understand data needs**: Identify the estimating techniques that will be used and their associated data requirements. Identify potential data sources for each cost element component.

4. **Develop collection plan**: Document the plan including primary and backup data sources, data to be collected (primary or secondary, cost/technical/programmatic), coverage of all cost elements, and a projected timeline. Identify data sources for cross-checks.

**Compositing** is a technique for aggregating WBS items when only higher-level data is available. Items are weighted by a characteristic (weight, quantity, size, or percentage of new design) to create a composite value, ensuring no individual component is forgotten.

**Data normalization** makes data consistent and comparable. Normalization types include adjustments by cost units, sizing units, mission application, platform environment, recurring/non-recurring costs, development state, and end terms for homogeneity. Normalization must be objective and not force data to fit a desired outcome. See Module 4 for detailed normalization procedures.`
    },
    {
      id: 'methods', title: 'Cost estimating methods and methodology selection', summary: 'Three basic techniques and when to use each',
      body: String.raw`:::primer:::
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

For each WBS element, the estimator selects the most appropriate method given available data and design maturity.

**Three basic costing techniques** are available:

1. **Analogy**: Compares the cost of an item to be estimated to a similar item, adjusting for differences. CEBoK's example: the Model X100 jet engine has only flown once before, so the analyst scales the prior engine's cost by a similar parameter — weight, since it's the same X-series family. The new engine's weight is double the old engine's, so the source simply **doubles the cost** (an implicit linear, exponent-1 scaling).
2. **Parametric (CER)**: A mathematical relationship based on historical data that relates cost to one or more technical, performance, cost, or programmatic parameters.
3. **Engineering Build-up (bottom-up)**: Estimates costs at the lowest definable level, frequently using Industrial Engineering techniques such as time standards.

These three methods can be used at any level desired, as long as data is available at that level. The estimator determines the most appropriate technique based on available data, design maturity, and program phase.

**Other methods** include:
- **Expert Opinion / Delphi**: Subjective opinion of Subject Matter Experts (SMEs) to corroborate or adjust cost estimates.
- **Extrapolation from Actuals**: Uses data from prototypes or completed/incomplete units to project future unit costs.

**Double-counting Warning**: When using different methods for different cost elements, ensure you do not double-count. A high-level CER may already capture detail that would be included in a lower-level engineering build-up. Check for overlapping assumptions and cost drivers.

:::tip Beyond CEBoK
The source's X100 example doesn't give a dollar figure — only the doubling logic — so the cost below (Analog cost) is illustrative. CEBoK's analogy is a **linear ratio through the origin**: weight doubles, so cost doubles. The "Power scaling" checkbox is off by default (b = 1) to match that. Turning it on and dragging the exponent below 1 explores a non-linear, economies-of-scale idea that is **not** part of the source's adjusted-analogy method — a single analog point cannot determine a curve's exponent any more than it can determine a line's slope.
:::

:::widget analogy c0=10 s0=100 s1=200 cx=1 powerOn=0 b=1:::

:::challenge analogy c0=10 s0=100 s1=100 cx=1 powerOn=0 b=1 lock=c0,s0,cx
Q: The source doubles the X100's weight. Drag the new size to 200 (double the analog's 100) and read the linear-ratio analogy (the CEBoK method) estimate.
goal: linear ~ 20 +- 0.5%
show: s1=200
> $Cost_{new} = Cost_{analogy} \times (S_1/S_0) = 10 \times (200/100) = 20$. Weight doubles, so cost doubles — a straight ratio through the origin, not a curve.
:::

:::challenge analogy c0=10 s0=100 s1=200 cx=1 powerOn=0 b=1 lock=c0,s0,s1,cx
Q: (Beyond CEBoK) Turn on "Power scaling" and drag the exponent to 0.7 to model economies of scale instead of the source's simple doubling. Does the size-adjusted estimate go up or down compared to the linear \$20?
goal: power < 18
show: powerOn=1 b=0.7
> At b=1 (the source's method), doubling weight doubles cost (10 -> 20). At b=0.7 (Beyond CEBoK), cost scales as 2^0.7 ≈ 1.62, giving about 16.2 — lower than the source's linear doubling. This exponent is not derivable from a single analog point.
:::

{{primer}}

**Detailed comparison:**

| Method | When Used | Advantages | Disadvantages |
|---|---|---|---|
| **Analogy** | Early concept, immature design, limited data | Quick; requires little data | Less precise; depends on analogy quality; assumes technologies/processes are truly similar. |
| **Parametric (CER)** | Mature design, good historical data | Statistically grounded; captures relationships; flexible for sensitivity analysis | Requires sufficient data; statistical assumptions can be violated; extrapolation beyond historical range is risky. |
| **Engineering Build-Up (bottom-up)** | Mature design, detailed specifications | Detailed; reflects specific design; traceable to technical requirements | Labor-intensive; requires extensive data; small errors propagate; does not leverage historical patterns. |
| **Extrapolation from Actuals** | Same program over multiple phases | Uses actual spending; low uncertainty | Only applies when tracking a known program; cannot predict fundamentally new work. |
| **Expert Opinion / Delphi** | Limited or no data; new technology | Can leverage judgment; flexible | Biased; subjective; must be cross-checked; easily influenced by advocacy. |

**General pattern:** Analogy dominates early; parametric methods span the middle; engineering build-up becomes dominant as the design matures and detail increases. Expert opinion is used when data is absent but should be corroborated.

+++

### Method selection criteria

The estimator considers:
- **Data availability**: sufficient historical cost and technical data?
- **Design maturity**: how mature and detailed is the baseline?
- **Technical risk and novelty**: does the system use proven technology or incorporate new development?
- **Program schedule**: how much time is available for detailed analysis?
- **Accuracy required**: is a ROM estimate sufficient, or is budgetary-quality precision required?

**Lower TRL (immature technology) → analogy or expert opinion, wider uncertainty.**
**Higher TRL (mature technology) → parametric CERs or engineering build-up, narrower uncertainty.**

:::check
Q: A new electronic warfare system is being estimated. The baseline shows it will use a novel, custom-built radar module (TRL 4) and standard-production software libraries. Which method is most appropriate for the radar module?
- Parametric CER (statistical relationships from industry databases)
- Engineering build-up from first principles
* Analogy from a similar radar program, adjusted for technical differences
- Extrapolation from actuals on a prior program
> A TRL 4 technology has limited historical data, so parametric and build-up methods are weak. Analogy (finding a comparable radar and adjusting) is the most practical. The approach will have wider uncertainty, reflecting the technical risk.
:::`
    },
    {
      id: 'trl', title: 'Technology Readiness Levels (TRLs)', summary: 'Maturity scale and relevance to cost risk',
      body: String.raw`:::primer:::
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

**Technology Readiness Levels** (TRLs) were developed by NASA in the 1980s and are now widely adopted in DoD and civilian agencies to assess the maturity of technologies. When a new technology is in the development stage, it is not suitable for immediate application. Instead, new technologies are usually subjected to experimentation and refinement. Once the technology is proven, it can be given a much higher TRL.

:::tip Beyond CEBoK
The TRL scale ranges from 1 to 9:

| TRL | Description |
|---|---|
| **TRL 1–3** | Basic research through proof-of-concept (lowest maturity); principles observed in lab. |
| **TRL 4** | Component/breadboard validation in a laboratory environment. |
| **TRL 5** | Component/breadboard validation in a relevant (near-operational) environment. |
| **TRL 6** | System/subsystem model or prototype demonstrated in a relevant environment. Common Milestone B target. |
| **TRL 7** | System prototype demonstration in an operational environment. |
| **TRL 8** | Actual system completed and qualified through test and demonstration. |
| **TRL 9** | Actual system proven through successful mission operations. |
:::

{{primer}}

:::widget trl:::

:::challenge trl
Q: A full system prototype has flown in its operational environment, but the production system hasn't been qualified yet. Which TRL is it?
* TRL 7
- TRL 6
- TRL 8
- TRL 9
> TRL 7 is a system prototype demonstrated in an operational environment. TRL 6 stops at a relevant environment; TRL 8 needs the actual system completed and qualified.
:::

:::challenge trl
Q: A breadboard of a new sensor has been validated, but only on a lab bench. Which TRL is it?
* TRL 4
- TRL 3
- TRL 5
- TRL 6
> TRL 4 is component or breadboard validation in a laboratory environment. The same breadboard validated in a relevant environment would be TRL 5.
:::

+++

### Relevance to cost estimating

**Lower TRL = higher cost and schedule risk and uncertainty.**

- **Data limitation**: immature technologies have little historical or parametric data, forcing reliance on weaker methods (analogy, expert judgment).
- **Cost growth**: historically, programs with low-TRL technologies experience greater cost growth as development resolves unknowns.
- **Risk adjustment**: low TRL typically requires wider risk/uncertainty margins (discussed in later modules) and careful scrutiny of analogies.
- **Method selection**: TRL 1–3 → expert opinion and analogy only; TRL 4–5 → limited parametric, analogy, expert judgment; TRL 6+ → parametric CERs and engineering build-up become viable.

Estimators commonly apply a **TRL risk adjustment factor** to the base estimate or explicitly widen the uncertainty range for low-TRL work.

:::check
Q: A key subsystem has been demonstrated as a prototype in a relevant environment. What is its TRL, and what does this imply for the estimate?
- TRL 3 (proof of concept); ready for production estimates
- TRL 5 (component validation in relevant environment); still significant risk
* TRL 6 (system model/prototype in relevant environment); significant but lower risk; parametric methods start to become viable
- TRL 8 (system qualified); ready for production at known cost
> TRL 6 means the technology has been demonstrated at a higher fidelity but is not yet production-proven. Cost risk is still real but lower than TRL 4–5; parametric CERs and build-up methods can now be used alongside analogy.
:::

:::check
Q: How should a low TRL affect your estimate?
* Expect more cost and schedule uncertainty and growth; apply wider risk margins and rely on expert judgment and analogy
- No effect; TRL is a technical metric, not a cost metric
- Lower the estimate, since immature designs are simpler
- Assume no cost growth, since development will resolve unknowns
> History shows immature technology drives cost growth. Low TRL signals greater uncertainty in the estimate and typically higher realized costs during development. Reflect that uncertainty in wider confidence ranges and risk analysis.
:::`
    },
    {
      id: 'validation', title: 'Validation, cross-checks, and sensitivity', summary: 'Ensuring the model is defensible',
      body: String.raw`:::primer:::
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

Once a cost model is assembled, it must be validated before being presented as the basis for program decisions.

{{primer}}

### Sanity checks

Ask basic reasonableness questions:
- Does the total seem plausible given the technical baseline and historical analogs?
- Do individual cost elements scale sensibly with their technical drivers (e.g., does software cost rise with lines of code)?
- Are there obvious omissions or double-counted elements?
- Do costs fall or stay roughly flat as production volume increases? (Exception: breaks or major design changes.)

### Cross-checks

Compare the estimate against independent data to verify reasonableness and completeness:
- **Different methodologies**: Apply a different estimating method to key cost elements to verify results
- **Different cost models**: Compare using proprietary models versus custom models (e.g., Excel) to ensure results are model-independent
- **Parametric models**: Compare against published industry cost-estimating relationships
- **Historical analogs**: Compare against actual costs of similar prior programs
- **Independent estimates**: Compare against estimates by organizations outside the program

**Benchmarks** must be based on **publicly available data** only. Proprietary data from another company may not be used for comparison.

If the estimate differs significantly from an independent cross-check, the difference must be investigated and reconciled. Do the baselines differ? Are methods incompatible? Is one method more reliable given available data?

+++

### Sensitivity analysis

**Sensitivity analysis** identifies which inputs and assumptions most affect the total estimate. Typical questions:
- If labor rates increase 10%, how much does the total cost increase?
- If a subsystem's technical requirements slip, what is the impact?
- Which cost elements have the largest confidence ranges?

Sensitivity analysis informs:
- **Risk management**: where to focus risk mitigation
- **Further data collection**: which assumptions most need refinement
- **Program negotiations**: which technical trades have the largest cost impact

:::check
Q: An estimate is built on three major cost drivers: labor rates, material prices, and a novel subsystem's development cost. A sensitivity analysis shows that the novel subsystem's cost has the largest impact on the total estimate, but labor rates have the smallest. Where should the program focus risk management effort?
- On controlling labor rates (they are the most predictable)
* On the novel subsystem's development and technical risk (its cost is the largest sensitivity)
- Equally on all three drivers
- On material prices (they are subject to market volatility)
> Sensitivity analysis reveals which variables most affect the total. In this case, the novel subsystem's development is the primary cost driver and risk. That is where technical risk mitigation, schedule management, and cost controls should focus.
:::`
    }
  ],
  cards: String.raw`
## Definition and Purpose
Q: Definition of cost estimating
A: The process of collecting and analyzing historical data and applying quantitative models, techniques, tools, and databases to predict the future dollar amount of an item, product, program, or task to facilitate the successful completion of a program, project, or process.
R: yes
Q: Definition of cost analysis
A: The broader discipline that includes cost estimating plus evaluating and comparing costs to support decisions (alternatives, affordability, proposals, performance tracking).
R: yes
Q: Cost estimate vs. cost guarantee: key difference
A: An estimate is a prediction based on available information at a point in time; it is not a guarantee. It should be defensible, reproducible, and documented — not necessarily "correct" in hindsight, since the future is inherently uncertain.
Q: Three functions of cost estimating
A: Translates system/functional requirements into budget requirements; determines and communicates a realistic view of the likely cost outcome; forms the basis of the plan to develop, field, and support the system.
Q: Why must a cost estimate never become divorced from historical experience?
A: Because it risks losing credibility. Estimators adjust for new materials, technology, and resources, but the foundation must remain grounded in historical data.
Q: What happens when a program runs far over an ICE-based budget?
A: Other programs' resources are diverted to cover the overrun, creating a ripple effect. Programs that run far enough over budget may be terminated, leaving capability gaps.
Q: Core purpose of cost estimating and analysis
A: Support budgeting, decision-making, program management, independent assessment, and affordability analysis throughout a program's life cycle.
Q: Name three applications of cost estimates
A: Budgeting; milestone/investment decisions; AoA and economic analysis; source selection and contract pricing; should-cost analysis; EVM performance tracking.

## Context
Q: What is PPBES and POM?
A: PPBES (Programming, Planning, Budgeting, and Execution System) is DoD's budgeting process. POM (Program Objective Memorandum) is the submission requiring cost estimates. Estimates are revised during comptroller, OSD, and President's budget reviews.
R: yes
Q: When must a program have a validated cost estimate?
A: At major milestone reviews and acquisition reviews. DoD Instructions 5000.2 and 5000.4-M mandate both a POE and CCA at these reviews to inform decisions and maintain management control.

## Organizations
Q: What is CAPE?
A: Office of Cost Assessment and Program Evaluation (DoD). Produces independent cost estimates and cost policy guidance.
R: yes
Q: What is the GAO?
A: Government Accountability Office. Audits federal cost estimates and publishes the Cost Estimating and Assessment Guide (best practices).
R: yes
Q: Why do programs require both a POE (Program Office Estimate) and a CCA (DoD Component Cost Analysis)?
A: POE is developed by the program office (close to technical detail but subject to advocacy bias); CCA is an independent cost analysis (objective check). Both provide a cross-check against optimism and errors.
Q: What does FFRDC stand for?
A: Federally Funded Research and Development Center (e.g., RAND, IDA, Aerospace Corporation, MITRE). Provides estimating support to government sponsors.
R: yes
Q: When is a cost group (I) positionally independent of the acquiring organization (A)?
A: When I shares no common superior with A below the sponsor S (or a delegate B acting in S's place). If I and A share a lower-level boss, or I reports into A's own chain, independence fails.

## Skills
Q: Related disciplines in cost estimating
A: Mathematics (probability, statistics, regression); Economics (inflation, discounting, analysis); Accounting (tracking expenditures); Budgeting (resource allocation); Operations Research and Industrial Engineering (optimization, simulation); Computer Science (software estimation); Engineering (design parameters, risk); Marketing (presentations and defense of estimates).
Q: What does a cost estimator need to understand about the system being estimated, and why?
A: Enough engineering/technical knowledge to evaluate the reasonableness of the technical baseline and understand what drives cost in the system.
Q: Is cost analysis the same as accounting or auditing?
A: No. Cost analysis is neither accounting nor auditing; it uses financial and technical data to project future costs, rather than recording past transactions or verifying compliance.

## Quality: Six CEBoK Characteristics
Q: Six characteristics of a high-quality cost estimate
A: Accuracy, Comprehensiveness, Replicability, Auditability, Credibility, and Timeliness.
R: yes
Q: What is the most important quality of a cost estimate and why?
A: Credibility is the single most important quality. An estimate must be accurate, replicable, and auditable in order to be credible, and credibility is what makes it defensible for decision-making.
Q: What does "Accuracy" mean?
A: Estimates are unbiased, neither unrealistically low nor overly conservative. Based on normalized data, valid inflation adjustments, CERs with good curve fits, and logical time-phasing.
R: yes
Q: What does "Comprehensiveness" mean?
A: The estimate uses a WBS at appropriate detail to ensure all cost elements are included exactly once with no gaps or double-counting. All cost-driving GR&A are documented.
R: yes
Q: What does "Replicability" mean?
A: The estimate is traceable to system specifications. Source data, CER statistics, detailed calculations, and methodology rationale are thoroughly documented so others can recreate it.
R: yes
Q: What does "Auditability" mean?
A: A reviewer can follow the estimation process, repeat calculations, and arrive at the same answer. The estimate is transparent and verifiable.
R: yes
Q: What does "Timeliness" mean?
A: Even a high-quality estimate provides no value if not delivered to decision makers on time. Timing is critical to effective decision support.
R: yes

## Benefits
Q: What is "buying in" and why is it risky?
A: Bidding far below the actual amount of effort to win a contract as the lowest bidder. As development proceeds, the true cost becomes apparent, and either the customer or the manufacturer must pay for the overrun, leading to lost profit or bankruptcy.
R: yes
Q: What is "pricing out of the market"?
A: Estimating too high, making the bid uncompetitive and unable to win work. Accurate estimates prevent both buying-in and pricing-out, ensuring profitability and competitive advantage.
R: yes

## Challenges
Q: Six named challenges to cost estimating (CEBoK 2.3)
A: Decision Support (difficulty establishing CERs linked to design parameters); Quality (obtaining good data); Coordination (costs cut across organizational boundaries); Consistency (must align throughout program); Resource and Schedule Constraints (timely delivery with limited resources); Security/Access (proprietary/classified restrictions).
Q: Why is data quality such a notoriously difficult challenge?
A: Analysts often access only secondary data that have been adjusted multiple times from original sources. Additionally, inadequately documented estimates lose credibility and valuable information is lost when analysts leave.
Q: What are the key limitations of cost analysis?
A: Results are only as good as input data; it must conform to the program; it disregards political/non-cost impacts; it requires sound judgment; it supports but does not dictate decisions.

## Products
Q: Four main cost estimating products
A: Technical and schedule baseline description; the cost estimate; the cost model; and estimate documentation.
Q: What is a CARD?
A: Cost Analysis Requirements Description. A DoD document that gives the common technical and programmatic baseline for all estimators on a program.
R: yes
Q: Technical baseline: what does it describe?
A: What the system is (technical characteristics, performance, design maturity); what the program will do (acquisition strategy, quantities, testing); when things happen (schedule, production rates).
Q: Why must the technical baseline be treated as an explicit, documented set of assumptions?
A: So that changes can be tracked, and the estimate's sensitivity to baseline changes is clear. If the baseline changes, the estimate must be revisited.
Q: Definition of a cost model
A: A structured combination of a WBS, cost estimating relationships (CERs), and supporting data used to generate the estimate. It should be traceable, flexible for sensitivity analysis, and documented.
R: yes
Q: Three considerations that shape a cost model
A: Level of detail of the technical/programmatic definition of the future system; level of detail of relevant existing cost estimating methodologies; level of detail of historical data available to develop new methodologies.

## Estimate Types
Q: ROM estimate
A: Rough Order of Magnitude. A very early, low-fidelity feasibility/screening estimate when little specific information is known. Wide uncertainty range.
R: yes
Q: LCCE
A: Life Cycle Cost Estimate. Comprehensive estimate covering R&D, production, operations & support (O&S), and disposal across the entire program life. Basis for milestone decisions.
R: yes
Q: ICE
A: Independent Cost Estimate. Built by an organization independent of the program office using the same baseline but different methodology. Provides objective assessment and identifies budgetary excesses and shortfalls.
R: yes
Q: Budget Estimate
A: Developed strictly for funding authorization. Wider margin for error than other types; ensures feasibility and establishes baseline definitions and costs.
R: yes
Q: EAC
A: Estimate At Completion. Used for in-process programs with sufficient cost history. Relies on Earned Value Management techniques; critical for program certification under Nunn-McCurdy Act.
R: yes
Q: ICA
A: Independent Cost Assessment. Independent estimate with risk incorporated, starting from external estimate and adjusting based on objective view. Ranges from full ICE to cursory sufficiency review.
R: yes
Q: EA
A: Economic Analysis. Describes mission requirements and alternative courses of action; compares costs and benefits quantified monetarily. Also called cost-benefit analysis or Business Case Analysis.
R: yes
Q: AoA vs EA
A: AoA (Analysis of Alternatives) evaluates costs and benefits including operational effectiveness/utility of different courses of action. EA focuses on benefits quantified monetarily (cost-benefit).
Q: Why is an LCCE typically much larger than an acquisition-only estimate?
A: LCCE includes Operating & Support (O&S) costs over the entire system life (often decades), which are often the largest share of it (Beyond CEBoK: frequently 60–80% of total life-cycle cost).

## Documentation
Q: What does estimate documentation include?
A: Ground rules and assumptions; technical and schedule baseline description; data sources and adjustments; methodology by cost element; results and time-phasing; sensitivity and risk/uncertainty analysis; comparison to independent estimates.
Q: Report requirements for cost estimates
A: Reports must be crisp and complete; easily understood by unfamiliar audiences; thorough on important details; and demonstrative of the competence behind the results. Proposals should include an executive volume summarizing technical aspects.
Q: What is CAIV (Cost As an Independent Variable)?
A: A discipline that sets aggressive yet realistic cost objectives when defining requirements and acquiring systems. It makes performance and schedule functions of available resources (cost), balancing three program parameters: cost, schedule, and performance.
R: yes

## Process
Q: CEBoK seven-step estimating process
A: (1) WBS development · (2) Program/system baseline development · (3) Data collection · (4) Data analysis · (5) Cost element methodology · (6) Model development and validation · (7) Results and report generation.
R: yes
Q: When are ground rules and assumptions (GR&A) defined?
A: During program/system baseline development (step 2), early in the process. This ensures they shape all later steps: methodology, data, and model.
Q: What is a WBS?
A: Work Breakdown Structure. A hierarchical, product-oriented decomposition of program scope into definable work elements (hardware, software, services, data).
R: yes
Q: What does it mean for a WBS to be "100% complete"?
A: (Beyond CEBoK: MIL-STD-881/PMI "100% rule") Every element of program scope is included exactly once, with no gaps or double-counting. CEBoK phrases it as: describe components at the level needed to capture all elements of cost.
Q: WBS Level 1, Level 2, Level 3
A: (Beyond CEBoK: MIL-STD-881 convention) Level 1 = entire system. Level 2 = major elements (e.g., prime mission product, SEPM, test, training, data, spares). Level 3+ = further decomposition.
Q: DoD standard for WBS
A: MIL-STD-881, with appendices for different system types (aircraft, ships, missiles, software, etc.).
R: yes
Q: What is a WBS dictionary?
A: A document that lists and defines each WBS element, shows hierarchical relationships, describes resources and processes for each element, and links to technical definition documents. Updated regularly to reflect current program status.
R: yes
Q: WBS vs. Cost Element Structure (CES)
A: WBS is product-oriented from an engineering standpoint. CES is the cost estimating view. A properly developed CES should encompass all WBS elements.

## Data Collection and Normalization
Q: Four-step data collection process
A: (1) Understand the estimating task and required outcome. (2) Establish CES based on WBS and map existing data. (3) Understand data needs based on planned estimating techniques. (4) Develop and execute data collection plan with primary/backup sources.
Q: What is compositing in data collection?
A: A technique for aggregating WBS items when only higher-level data is available. Items are weighted by a characteristic (weight, quantity, size, or % new design) to create a composite value, ensuring no component is forgotten.
R: yes
Q: What is data normalization and why is it necessary?
A: The process of making data consistent and comparable across different cost elements. Types include adjustments by cost/sizing units, mission application, platform environment, recurring/non-recurring, development state, and end-term homogeneity. Must be objective and not force fit.
R: yes

## Cost Estimating Methods
Q: Three basic costing techniques
A: Analogy (compare to similar item); Parametric/CER (mathematical relationship from historical data); Engineering build-up (estimate at lowest definable level).
Q: Other cost estimating methods beyond the three basic techniques
A: Expert opinion / Delphi (subjective opinion of SMEs); Extrapolation from actuals (using data from prototypes or completed units).
Q: Double-counting warning when mixing estimating methods
A: A high-level CER may already capture detail that would be included in a lower-level engineering build-up. Check for overlapping assumptions and cost drivers to avoid counting the same cost twice.
Q: Analogy method: when used and why
A: Early concept, immature design, limited data. Quick and requires little data, but depends on analogy quality and assumes similar technologies.
Q: Parametric (CER) method: when used and why
A: Mature design, good historical data. Statistically grounded, captures relationships, flexible for sensitivity analysis. Requires sufficient data and statistical validity.
Q: Engineering build-up (bottom-up) method: when used and why
A: Mature design, detailed specifications available. Detailed and traceable to technical requirements, but labor-intensive and small errors propagate.
Q: Expert opinion / Delphi: when used and cautions
A: Limited or no data; new technology. Leverages judgment but is biased and subjective; must be cross-checked and corroborated.
Q: General progression: analogy → parametric → engineering build-up
A: Analogy dominates early (immature design); parametric spans the middle; build-up dominates late (mature, detailed design).
Q: How does TRL affect method selection?
A: Low TRL (1–3) → analogy, expert opinion only. TRL 4-5 → limited parametric, analogy, expert judgment; TRL 6+ → parametric CERs and engineering build-up become viable.

## TRL (Technology Readiness Level)
Q: What does TRL measure?
A: Technology Readiness Level. A 1–9 scale measuring technology maturity, from basic research (1–3) through operational deployment (7–9).
R: yes
Q: TRL 1
A: Basic principles observed and reported.
R: yes
Q: TRL 4
A: Component/breadboard validation in a laboratory environment.
R: yes
Q: TRL 6
A: System/subsystem model or prototype demonstration in a relevant environment.
R: yes
Q: TRL 7
A: System prototype demonstration in an operational environment.
R: yes
Q: TRL 9
A: Actual system proven through successful mission operations.
R: yes
Q: How does low TRL affect cost risk and uncertainty?
A: Lower TRL means higher cost and schedule uncertainty and historically greater cost growth. Implies limited historical/parametric data (forcing reliance on weaker methods) and need for wider risk margins.
Q: Low TRL and cost estimation: what adjustment is appropriate?
A: Expect higher cost uncertainty; apply wider risk/confidence ranges; use analogy and expert judgment; allocate larger risk contingencies; avoid extrapolating parametric CERs.

## Validation and Sensitivity
Q: Purpose of sensitivity analysis
A: Identify which inputs and assumptions most affect the total estimate; inform risk management, data collection priorities, and program trades.
Q: What is a cross-check in cost estimating?
A: Comparing the estimate against independent data (parametric models, historical analogs, independent estimates, bottom-up rebuild) to verify reasonableness.
R: yes
Q: When the estimate differs significantly from a cross-check, what should the estimator do?
A: Investigate and reconcile the difference. Differences in baseline, method, or data quality must be understood and documented so decision-makers know why estimates differ.
Q: Sanity check for a cost model
A: Does the total seem plausible? Do individual elements scale reasonably? Are there omissions or double-counts? Do costs trend sensibly with scale and design changes?
`
});
