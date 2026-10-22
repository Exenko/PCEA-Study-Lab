PCEA.addModule({
  id: 'm01', num: 1, title: 'Introduction to Cost Estimating and Analysis', short: 'Intro to Cost Estimating', source: 'guide',
  blurb: 'What cost estimating is, the products it creates, and the repeatable process behind a credible estimate.',
  intro: String.raw`**Cost estimating** predicts the future dollar amount of an item, product, program, or task based on historical data and quantitative models. Budgeting, contracting, and purchasing organizations use **cost analysis** to make sure costs and prices are reasonable, consistent, and well-negotiated.

This module sets up the vocabulary for the rest of the course: definitions, who produces estimates, what they deliver, and the process to build a credible one.

**Key framework:** A cost estimate is only as credible as its technical baseline, data, and methodology. This module covers why estimates are needed and who produces them; the context, benefits, qualities, limitations, and challenges of estimating; the four cost estimating products; and the seven-step process used to build them.`,
  sections: [
    {
      id: 'definition', title: 'Cost estimating vs. cost analysis', summary: 'Definitions, purpose, and the key distinction',
      body: String.raw`:::primer:::
Cost estimating and cost analysis sound like the same job. They aren't quite.

:::sort
Q: (Beyond CEBoK framing) Which of these tasks are *estimating* (predicting a cost), and which go beyond it into *analysis*?
buckets: Estimating | Analysis
- Predict what a new system will cost to develop, from historical data = Estimating
- Forecast the cost of a task with a quantitative model = Estimating
- Compare the costs of two alternative designs = Analysis
- Review a contractor's proposal = Analysis
- Track spending against a baseline = Analysis
> Estimating predicts a future dollar amount. CEBoK uses cost analysis to make sure costs and prices are reasonable, consistent, and well-negotiated. (Beyond CEBoK: treating analysis as the broader job of evaluating and comparing costs is a common framing, not a CEBoK definition.)
:::

+++

**Cost estimating** is the process of collecting and analyzing historical data and applying quantitative models, techniques, tools, and databases to **predict the future dollar amount** of an item, product, program or task to facilitate the successful completion of a program, project, or process.

Often, the cost estimator adjusts for new materials, new technology, a new software programming language, or new resource allocations. Still, the estimate must never become divorced from historical experience or it risks losing credibility.

Cost estimating has three primary functions:
- **Translates requirements**: system and functional requirements into budget requirements
- **Communicates realistic outcomes**: determines and communicates a realistic view of the likely cost outcome of a system or program
- **Grounds the plan**: forms the basis of the plan to develop, field, and support the system or program

For commercial entities (contractors), the estimate underpins new business proposals and the bid/no-bid decision. For government entities, an Independent Cost Estimate (ICE) or the program cost estimate will often serve as the basis for a program's budget.

{{primer}}

Budgeting, contracting, and purchasing organizations use **cost analysis** to make sure the costs/prices of goods and services budgeted, contracted, and purchased are reasonable, consistent, and well-negotiated.

:::tip Beyond CEBoK
CEBoK gives no formal definition of cost analysis. A common framing treats it as broader than estimating: it includes estimating, but also covers evaluating and comparing costs to support decisions, such as analyzing alternatives, assessing affordability, reviewing proposals, and tracking performance against a baseline.
:::

:::key
An estimate turns **uncertain future resources** into numbers decision-makers can act on. It should come with its assumptions, its method, and its uncertainty.
:::

+++

### Purpose

Cost estimating serves three primary reasons:

**1. Budgeting**: Independent Cost Estimates (ICEs) provide the basis for improving program budgets to give programs a chance for success and ensure effective utilization of valuable agency resources. If a program runs over budget, other programs' resources will be diverted to cover the additional costs, which can cause a detrimental ripple effect through other programs. Some programs that run far over budget will be terminated, leaving a gap in capabilities. Success in supporting budgeting should be measured by a track record showing how long each ICE-based budget proves adequate on a year-by-year and cumulative basis. The track record should determine in what fiscal years relative to the ICE the program **first ran a deficit** and **first incurred a debt** (i.e., net cumulative shortfall).

**2. Planning**: After establishing the budget, planning lays the foundation for successful project execution. Estimating supports the development of Basis Of Estimate (BOE) documentation which establishes the integrated baseline. Earned Value Management (EVM) tracks cost and performance against this baseline as measured by performance indices.

**3. Trade-offs**: Trade-off studies use a baseline cost estimate to explore the relative cost of changing requirements. Trade-offs aim to achieve the proper balance of maximizing utility and minimizing cost. Often the cost impact of trades is cursory. Overall progress toward cost goals must be measured by periodic Life Cycle Cost Estimates (LCCEs), **preferably based on a closed engineering design**.

Risk assessment plays a big part in budgeting, planning, and trade-offs. Without assessing risks, programs will likely develop unrealistically low budgets that result in immediate shortfalls, establish overly aggressive baselines that result in immediate performance deficiencies, and produce unrealistically optimistic trade-offs that result in faulty decisions. These mistakes will lead program managers to pursue unaffordable or impractical options.

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

Cost estimating contributes to a sound management approach and should be done whether it is required or not.

:::check
Q: (Beyond CEBoK framing) Which statement best distinguishes cost *analysis* from cost *estimating*?
- They are synonyms; the terms are interchangeable
* Analysis includes estimating plus evaluating and comparing costs to support decisions
- Estimating is broader than analysis
- Analysis focuses on historical costs, while estimating predicts future ones
> This is a common framing, not a CEBoK definition. Estimating produces a cost prediction; analysis uses estimates and actuals to evaluate alternatives, assess affordability, review proposals, and support program management decisions.
:::

+++

### How estimates differ from guarantees

An estimate is a **prediction**, not a guarantee. Future uncertainty means even the best estimate will differ from reality. Nonetheless, a high-quality cost estimate is an invaluable aid in decisions about resource allocation.

A general guideline is that the final product should provide sufficient information on how the estimate was developed so that other analysts could reproduce the estimate.

A good estimate may turn out to be "wrong" in hindsight — not because the estimator was careless, but because actual market conditions, technology evolution, or program decisions diverged from what was assumed.

:::check
Q: An estimate predicts the cost of a new system will be \$45M. Five years later, actual cost is \$62M. Which is most likely true?
- The estimate was wrong and the estimator was incompetent
* The estimate was sound given available data at the time, but assumptions or conditions changed
- The difference proves estimates are useless for decisions
> Estimates are predictions, not guarantees. Future uncertainty means even the best estimate will differ from reality, so judge an estimate on whether it was sound given available information and documented well enough to be reproduced — not on whether it perfectly predicted an unknowable future.
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

As programs mature technically and schedules change, cost estimates should be **periodically updated** to account for these changes. Updating the estimate provides a level of management insight into the current program status that helps maintain effective control of the program and balance resources and the budget.

### Estimate Types by Lifecycle Phase

{{primer}}

Different phases require different types of estimates:
- **Pre-systems acquisition phase**: AoAs or trade studies, which compare technical, cost, and performance characteristics of multiple approaches and are used to select among alternatives before committing to a particular project
- **Systems acquisition**: A source selection process to compare competitors' approaches to satisfying requirements
- **After system development**: A cost study can then be performed before full-scale production
- **Sometimes**: Multiple ICEs are performed for budgeting purposes or program cost tracking

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
Q: (Beyond CEBoK framing) Which of these might feel pressure to show the program is affordable?
buckets: Pressure to show affordability | Independent check
- Program Office estimators = Pressure to show affordability
- CAPE = Independent check
- A service cost agency = Independent check
- GAO = Independent check
> This framing is Beyond CEBoK. CEBoK says program offices use cost estimates to justify obtaining resources; its ICE example notes that program risks may understate costs if the original estimating party is not detached from advocacy. CAPE has oversight of the DoD service cost centers, and GAO plays an auditing role.
:::

+++

Special purpose organizations exist within the government and industry to perform ICEs and validate or adjust the estimates of other organizations. These are known as **cost oversight organizations**. Other groups use cost estimates and cost analysis too:

| Organization | Role |
|---|---|
| **Cost oversight organizations** (e.g., OSD CAPE and the DoD service cost centers) | Perform ICEs and validate or adjust the estimates of other organizations. |
| **Government program offices and industry project teams** | Use cost estimates to justify obtaining resources and to help allocate resources internally. |
| **Contractors** | Respond to the Request For Proposal (RFP) and typically bid the bare minimum of what is specified in the Statement Of Work (SOW). |
| **Budgeting, contracting, and purchasing organizations** | Use cost analysis to make sure the costs/prices of goods and services budgeted, contracted, and purchased are reasonable, consistent, and well-negotiated. |
| **OMB (Office of Management and Budget), GAO (Government Accountability Office), and Congress** | Oversee for fiscal responsibility at a broader level. |
| **GAO and DCAA (Defense Contract Audit Agency)** | Play an auditing role. |
| **Manufacturers** | Need to know their operating costs in order to manage and reduce them. |
| **Consultants** | Since any or all of the above groups may need assistance in the specialized skills of cost estimating, consultants play an important role in the cost community. |

{{primer}}

:::key
Special purpose **cost oversight organizations** exist within the government and industry to perform ICEs and validate or adjust the estimates of other organizations.
:::

:::tip Beyond CEBoK
Advocacy bias, the incentive for a program office to show affordability, is a recurring theme in practice and a main reason independent estimates are valued. CEBoK touches it only in its ICE example: program risks may understate costs if the original estimating party is not detached from advocacy.

The **Congressional Budget Office (CBO)** provides cost estimates of legislation for Congress. Federally Funded Research and Development Centers (FFRDCs) such as IDA, RAND, Aerospace, and MITRE often provide estimating and analysis support to government sponsors. Other specialized oversight and analysis organizations may exist in specific agencies or sectors; this module focuses on the core cost estimating organizations in DoD and government acquisition.
:::

+++

### Skills an estimator needs

Cost estimators draw on a blend of skills and domains of expertise:

| Area | Why |
|---|---|
| **Mathematics and Statistics** | Mathematics, from basic arithmetic to algebraic functions to rather sophisticated probability and statistics. |
| **Economics, Business, and Accounting** | Cost estimating involves the application of economic ideas like inflation and obtains much of its data from cost accounting systems. |
| **Budgeting Process** | Cost estimates are used to justify the allocation of resources, so estimators must understand the budgeting process. |
| **Operations Research, Management Science, and Industrial Engineering** | Since cost estimating frequently seeks to optimize all the aspects of system development, familiarity with OR, the management sciences, and IE; IE can also be applied to detailed production analysis in a manufacturing environment. |
| **Technical and Engineering Understanding** | Familiarity with the product system, software, process, etc., helps to identify cost drivers and understand the data needed to develop cost estimates. Functional expertise, mechanical engineering, systems engineering, physics, software development, and logistics experience aid in the analysis and help analysts communicate with the engineers working on the project. |
| **Salesmanship** | A little bit of salesmanship helps defend the estimate on the merits of its methodology and documentation and ensure success with program leadership and external organizations. |
| **Marketing** | Marketing insight helps develop price proposals that go after new work. |

:::key
Cost estimating obtains much of its data from cost accounting systems. It helps determine anticipated expenditures, which are then tracked through detailed accounting structures; actual cost data informs future cost estimating.
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

Independence in cost estimating provides a critically important, unbiased look at a program. CEBoK's positional independence chart (Figure 1.3) demonstrates two cases where an organization can provide a credible independent cost estimate. In Case 1, organization **I** does the estimate. I can do an independent assessment of **A** as long as I and A do not have any common superiors besides **S**. Case 2 demonstrates an extra level of management. S can still accept an independent estimate from I of A as long as **B** accepts the estimate. S cannot provide an unequivocally independent estimate of A to **C** in either case, since S has oversight of the effort and could benefit from a lower estimate. Essentially, the cost group is **positionally independent** if and only if it shares no common superior with the acquiring organization.

"Independent" has many meanings when referring to cost estimates. The most stringent is in Title 10 United States Code Section 2434 and involves an organization out of the chain of command of the acquiring agency. A more general meaning is an estimate performed by an organization not beholden to the program manager in funding or accountability. The simplest meaning is a separate estimate. CEBoK uses the term in its most stringent sense.

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
| **Accuracy** | Estimates are unbiased, neither unrealistically low nor overly conservative, but based on an assessment of most likely costs. Underlying data have been normalized for technical baseline and for inflation using appropriate guidance. Cost Estimating Relationships (CERs) result from regression analyses with good curve fits and minimal error bands, making them valid predictors of cost. Time phasing of the estimate is logical and reliable. |
| **Comprehensiveness** | The estimate uses a Work Breakdown Structure (WBS) at an appropriate level of detail to ensure those cost elements neither omit nor double-count elements. All cost-driving Ground Rules and Assumptions (GR&A) are detailed in the documentation of the cost estimate. |
| **Replicability** | The estimate presents a WBS fully traceable to the system specification. The estimate thoroughly documents source data, significance, and goodness of fit statistics for CERs, detailed calculations and results, and explanations for why a particular method or reference was chosen. |
| **Auditability** | A reviewer can follow the estimate process, repeat the calculations, and arrive at the same answer. |
| **Credibility** | The estimate must be accurate, replicable, and auditable in order to be credible. **Credibility is the single most important quality of a good cost estimate.** |
| **Timeliness** | Even a high-quality estimate cannot provide value if not delivered to decision makers on time. |

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
The GAO (Government Accountability Office) defines a reliable estimate with four characteristics: Comprehensive, Well-documented, Accurate, and Credible. CEBoK expands this to six characteristics: Accuracy, Comprehensiveness, Replicability, Auditability, Credibility, and Timeliness. Both frameworks are widely used and respected in cost analysis practice. GAO's view of credibility also expects that limitations, risk, and uncertainty are discussed, that sensitivity and cross-checks are performed, and that differences are reconciled.
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

**For Government**: Accurate estimates assess the reasonableness of contractor proposals and program budgets and help the program office effectively defend budgets to oversight organizations such as OSD, OMB, and Congress. They also assist in quickly and accurately determining the impacts of budget cuts on program baselines and the program/system functionality.

**For Manufacturers**: Accurate cost estimates are essential for profitability and competitive advantage. An organization that completes projects within a reasonable budget enhances its reputation and future business opportunities.

Accurate estimating avoids two costly mistakes:
- **Buying In**: Bidding far below actual effort to win the contract. As development proceeds, the true cost becomes apparent, and either the customer or manufacturer absorbs the overrun, leading to lost profit or bankruptcy.
- **Pricing Out**: Estimating too high, making the bid non-competitive and losing market share.

Accurate, defensible estimates provide the framework for winning work at a reasonable profit while maintaining competitive advantage.

+++

### Challenges to Cost Estimating

Six primary challenges arise during cost estimation:

**1. Decision Support**: Difficult to quantify cost impacts of alternatives; challenges in establishing Cost Estimating Relationships (CERs) linked to correct design parameters; cost analysis cannot inherently exchange variables that cannot be directly related to cost; such trade-offs require decision analysis techniques from operations research.

**2. Quality**: The quality of an estimate relies on good data (input) and good documentation (output). Defining and obtaining good data presents one of the most notoriously difficult problems in cost analysis. Analysts may only have access to secondary data which have been adjusted one or more times from the original raw data. Inadequately documented estimates lose credibility and compromise preparedness for future estimates. Without good documentation, crucial information, data, experience, and estimating approaches may be lost along with the tacit knowledge of analysts who could retire or leave the organization.

**3. Coordination**: Because system costs frequently cut across organizational boundaries, the data collection and estimate validation processes may involve a lot of coordination requiring considerable time and resources.

**4. Consistency**: Estimates must remain consistent throughout a program's lifespan and align with previous estimates. Comparing estimates across different structures requires mapping or adjusting for differing assumptions. Inconsistent historical data within and between sources creates barriers.

**5. Resource and Schedule Constraints**: Estimates must be delivered timely or they become obsolete. Schedule must account for data availability without compromising quality. Time constraints may also impact quality, coordination, and consistency.

**6. Security and Access**: Proprietary or classified data restrictions may limit access to cost data and completed estimates. Data protection precautions can slow the process.

### Limitations of Cost Estimating

Realistically, the cost analysis process should:
- **Conform** to the situation/program
- **Produce results of the same caliber as the input data**
- **Disregard** political and non-cost impacts
- **Utilize** sound judgment, management, or control
- **Support but not dictate** the final decisions

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

The **technical and schedule baseline description** provides a detailed technical and schedule description of the program/system to be estimated. It collects, integrates, and coordinates all the technical, programmatic, and schedule information necessary to estimate the costs of a program. The engineers and technical team develop its components, and the cost analyst uses it to ensure that cost projections are based on a common definition of the system and the acquisition program.

The **CARD** (Cost Analysis Requirements Description) is a specific case of a technical and schedule baseline description required by major DoD programs. A CARD-like document should always be developed for an estimate, regardless of whether it is for a government estimate or not.

With the basis of the estimates explicitly documented, analysts can easily update the estimate and provide a verifiable trace to a new cost baseline when key assumptions change during the course of the project lifetime. The credibility of the cost estimate suffers if the analyst cannot clearly explain the technical, programmatic, and schedule assumptions underlying each of the cost estimates.

:::tip Beyond CEBoK
A handy way to remember what the baseline covers: what the system is (technical characteristics, performance parameters, design maturity); what the program will do (acquisition strategy, quantities, testing and deployment approach); and when things happen (major milestones, production rates, key decision dates). CEBoK itself lists a DoD CARD's contents in much more detail.
:::

### 2. The Cost Estimate

The **cost estimate** uses established methodologies to incorporate the analysis of individual cost elements in order to develop project estimated costs of a program or system from data and experience together with the corresponding documentation. There are various types of cost estimates; each should have an associated cost model and documentation. The quality of the documentation influences the quality of the estimate.

Estimates vary by type and fidelity, as detailed below.

### 3. The Cost Model

A **cost model** is the collection of cost estimating methodologies associated with a cost element or WBS that best reflects the cost of a future system given three important considerations:
- The **level of detail of technical/programmatic definition** of the future system
- The **level of detail of relevant existing cost estimating methodologies**
- The **level of detail of historical data** available to develop new cost estimating methodologies

**Model structure:** Depending on the system's maturity and the scope, time, and resources given for the estimate, the analyst may develop a model structure at varying levels of detail. Analysts may build custom models, use commercially available software, or both. The model should apply some combination of accepted estimating techniques such as parametric, analogy, and engineering build-up.

**Inputs:** Rates for labor, materials, tooling, scrap, etc., need to be provided. Audited or negotiated direct and indirect rates are usually applied.

**Outputs:** Depending on the time period covered by the estimate and the requirements and assumptions of the estimate, it may be both time-phased, indicating which costs are to be incurred in which years, and escalated, representing either the year that dollars are spent, a base year, or a budget year. The estimate should include risk analysis to provide a range of possible outcomes to assist management in decision-making.

### 3a. Types of Estimates

Eight types of estimates support different purposes throughout the program lifecycle:

| Type | Purpose |
|---|---|
| **LCCE (Life Cycle Cost Estimate)** | The prototypical cost estimate; includes R&D, production, O&S, and disposal costs, covering all costs associated with the program for its complete duration (often confused with O&S cost estimates). Compiled as early in the life cycle as possible, even in pre-acquisition and proposal stages. Milestone decisions generally require LCCEs as supporting documentation. Covers costs regardless of funding source; also known as a Total Ownership Cost (TOC) estimate. |
| **ICE (Independent Cost Estimate)** | An LCCE developed by an analyst outside the program or project office that tests the reasonableness of the program or project estimate. Uses the same technical and schedule baseline information but a different estimating methodology. An objective assessment of the program's most likely cost; critically examines the LCCE to identify potential budgetary excesses and shortfalls, and identifies cost risks. Provides supporting documentation at critical milestone reviews. |
| **Budget Estimate** | Developed strictly to obtain authorization for funding. In theory, has a wider margin for error than other types. Three purposes: (1) ensure project feasibility and attainable performance levels; (2) develop a reliable project cost estimate consistent with realistic schedules; (3) establish baseline project definitions, schedules, and costs. Ideally includes a risk assessment (a GAO best practice; not all organizations require it). |
| **ROM (Rough Order of Magnitude)** | Used when very little specific information is known; design effort has not begun, and the estimate is often based on ratios or factored historical information. Primarily used for feasibility studies and selection from among alternatives. |
| **EAC (Estimate At Completion)** | Used for in-process programs and for ICEs when there is sufficient cost history. Typically relies on EVM techniques. More important in recent years because of the need to certify programs under the Nunn-McCurdy Act of 2010 and the Weapon Systems Acquisition Reform Act (WSARA) of 2009. |
| **ICA (Independent Cost Assessment)** | An independent estimate with risk incorporated; starts with an external estimate (usually from the contractor or program office) and incorporates adjustments based on a more objective view of the program. May fall anywhere from a full-blown ICE to a cursory sufficiency review. |
| **EA (Economic Analysis)** | Describes a specific mission requirement and lists specific alternative courses of action that will satisfy it. A framework for systematically investigating problems of choice; examines and compares the costs and benefits of each alternative. Also known as cost-benefit analysis or Business Case Analysis (BCA). |
| **AoA (Analysis of Alternatives)** | Evaluates the costs and benefits (i.e., operational effectiveness or utility) of different courses of action to meet recognized needs; aids and documents decision-making by showing advantages and disadvantages of alternatives. An EA is more of a BCA where benefits can be quantified monetarily; an AoA usually involves performance characteristics as well. |

:::tip Beyond CEBoK
Additional estimate types used in practice include: **POE (Program Office Estimate)** - developed by the program's own estimators, closest to technical detail; **Should-cost Estimate** - what a program should cost with efficient operations, used to identify cost reduction opportunities and negotiate contracts; **IGCE (Independent Government Cost Estimate)** - the government's estimate of a contract cost, used in source selection and negotiations.
:::

+++

### 4. Estimate Documentation

Documentation is the fourth deliverable product, not an afterthought. It provides written justification for the cost estimate and demonstrates credibility. All steps in the estimate's development must be documented, including definitions, GR&A, methods, and rationale for method selection.

The estimate documentation states the:
- **Purpose**: the reason for developing the estimate, including whether it is an initial or updated estimate, the specific tasking and relevant correspondence, and the cost estimating team composition
- **Scope**: phases, specific time periods covered, and systems and processes encompassed, plus areas not addressed and why
- **Ground rules and assumptions**: all technical and programmatic conditions that formed the basis for the estimate
- **Program background and system description**
- **Program schedule**: the master schedule for development, production and deployment, and a detailed delivery schedule
- **Cost estimating methodology**: the estimation methods, used by reviewers to follow the logic from assumptions to the conclusion and to replicate or update the estimate later

The estimate documentation details the primary data, techniques, and rationale for each element of the cost estimate. Analysts should document:
- any data used, its source, and normalization procedures
- the basis, development, and/or source of all CERs and factors used, including how they were applied, their relevance to the program, and any regression statistics
- how the labor hours were developed, and direct and indirect labor rates as industry averages or organization-specific
- the methodology used to develop cost improvement curves (if applicable)
- all hardware and materials required and the basis of their costs (e.g., vendor quotes, catalog prices)
- all pre-existing cost models used and their relevance, along with any calibration performed
- the specific inflation indices and computations used as well as the approach used to time-phase the estimate
- the logic and rationale that led to specific conclusions (i.e., expert judgments)
- the risk analysis conducted and details on how confidence was established
- a conclusion expressing the cost estimating team's determination regarding the reasonableness of the program office estimate
- appendices containing any other pertinent information, and a reference list

**Report Requirements**: The report must be:
- **Crisp and complete**: covering the entire estimate scope
- **Easily understood**: quickly comprehended by audiences unfamiliar with the estimate
- **Thorough**: addressing important details of the estimate
- **Demonstrative**: showing the competence behind the results

For proposals, an executive volume should accompany the cost volume, summarizing technical aspects in simple terms since many evaluators lack technical background.

**Cost As an Independent Variable (CAIV)**: CAIV entails setting aggressive yet realistic cost objectives when defining operational requirements and acquiring systems, and managing achievement of these objectives. A program is made up of three parameters: schedule, performance, and cost adjusted for risks present in all three parameters. CAIV makes performance and schedules a function of available resources, namely cost. (Covered in detail in Module 16 Cost Management.)

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
5. Develop cost estimating methodology for each cost element/work package
6. Build and validate the cost model
7. Generate results and other required output, such as reports
> The process is generally sequential: scope (the WBS) first, then the baseline and its ground rules, then data collection and analysis, then a method per WBS element, then the model and its validation, and finally results and reports. Specific process steps vary between organizations.
:::

+++

The CEBoK outlines a repeatable, generally sequential process for building cost estimates. This process is the skeleton for most of the rest of CEBoK (Modules 2–13 expand each step).

### The seven CEBoK steps

{{primer}}

1. **Work Breakdown Structure (WBS) development**: A WBS establishes a common frame of reference for relating job tasks to each other and for relating project costs at the summary level of detail. It provides a consistent and visible framework for specifying the objectives, labor, materials, and contracts of the program/system, displayed as a product-oriented family tree.

2. **Program/System baseline development**: The program/system baseline resembles a technical and schedule baseline description or similar document. It includes ground rules and assumptions (GR&A) and provides the basis for the cost estimate.

3. **Data collection**: Obtain and normalize data. Develop a data collection plan that identifies primary and backup data sources.

4. **Data analysis**: Consider the type of data (univariate, bivariate, multivariate, time series) and plot it; calculate descriptive statistics (central tendency, most commonly the mean; dispersion, most commonly the Coefficient of Variation); check for outliers; and compare the descriptive statistics to standard factors, rules of thumb, or other historical data wherever possible. (Normalization belongs to data collection, step 3.)

5. **Cost element methodology**: For each WBS element, determine the most appropriate technique based on the available data and phase of the program/system. The three basic techniques are **analogy**, **parametric**, and **engineering build-up**; other methods include **expert opinion** and **extrapolation from actuals**.

6. **Model development and validation**: After developing the cost model, it must be validated. Test key cost elements for sensitivity to the cost-estimating techniques used and to key ground rules and assumptions. Testing should include crosschecking the results with historical data from similar programs/systems, applying a different estimating methodology, and/or applying a different cost model; the estimate can also be compared to industry benchmarks. Finally, conduct a cost risk assessment.

7. **Results and report generation**: Generate results and other required output, such as reports. Cost estimate documentation provides written justification for the cost estimate. Other analyses, including CAIV, sensitivity, and risk analyses, can be incorporated into the final cost estimate.

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

The **GR&A** list all technical and programmatic conditions that formed the basis for the estimate to assist management in understanding these conditions. When conditions are dictated to the estimating team, they become the **ground rules** by which the estimate will be conducted. In the absence of a dictated ground rule, the estimator establishes **assumptions** which allow the estimate to proceed. In exercising this privilege, the estimator must avoid arbitrary assumptions by utilizing expert judgments rendered by experienced program and technical personnel.

:::tip Beyond CEBoK
Typical examples of GR&A: base year dollars (e.g., "FY 2024 constant dollars"); quantities (e.g., "10 production units"); schedule milestones and production rates; scope in or out; inflation indices to apply; labor rates and overhead burdens. Documenting them early makes the estimate traceable and shows exactly which assumptions to revisit if conditions change.
:::

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

1. **Develop an understanding of the total picture of the estimating task**: Understand the intended use of the estimate and the scope of the estimate, both of which should have been made apparent in the program/system baseline definition.

2. **Establish a cost element/work breakdown structure and boundaries around the estimate**: A cost element structure must be developed based on the earlier developed WBS. Existing data in different structures should be mapped to the new structure.

3. **Understand the estimating techniques to be employed and their associated data collection needs**: Identify potential data sources for each component of the estimate. Different estimating techniques may require different data.

4. **Develop a data collection plan**: The plan should discuss capturing primary or secondary cost, technical, and programmatic data and ensure every cost element is covered. Primary and backup data sources should be identified, and attempts should be made to identify data sources for cross-checks. A projected data collection timeline should be included with the plan.

**Compositing** is a technique for aggregating WBS items when only higher-level data is available. Items are weighted by a characteristic (weight, quantity, size, or percentage of new design) to create a composite value, ensuring no individual component is forgotten.

**Data normalization** makes the data consistent and comparable to other data used in the estimate. Types of data normalization include: by cost units; by sizing units; by special groupings such as mission application, by platform operating environment, and by recurring/non-recurring costs; by development state; and of end terms for homogeneity. Normalization should be done in an objective and reasonable manner and not to make the data fit a desirable outcome. See Module 4 for detailed normalization procedures.`
    },
    {
      id: 'methods', title: 'Cost estimating methods and methodology selection', summary: 'Three basic techniques and when to use each',
      body: String.raw`:::primer:::
How much you know about a design shapes how you can estimate it.

:::sort
Q: (Beyond CEBoK rule of thumb) Which technique fits each situation best?
buckets: Analogy | Parametric (CER) | Engineering build-up
- Early concept, immature design, and one similar prior system = Analogy
- Maturing design and a good database of similar historical systems = Parametric (CER)
- Mature design with detailed specifications for each part = Engineering build-up
> Analogy dominates early, when the design is immature and data is limited. Parametric CERs need good historical data. Engineering build-up becomes dominant as the design matures and detail increases.
:::

+++

For each WBS element, the estimator must determine the most appropriate technique for the task at hand based on the available data and phase of the program/system.

**Three basic costing techniques** are available:

1. **Analogy**: Compares the cost of an item to be estimated to a similar item, adjusting for differences. CEBoK's example: the Model X100 jet engine has only flown once before, so the analyst scales the prior engine's cost by a similar parameter — weight, since it's the same X-series family. The new engine's weight is double the old engine's, so the source simply **doubles the cost** (an implicit linear, exponent-1 scaling).
2. **Parametric (CER)**: A mathematical relationship based on historical data that relates cost to one or more technical, performance, cost, or programmatic parameters.
3. **Engineering Build-up (bottom-up)**: Estimates costs at the lowest definable level, frequently using Industrial Engineering techniques such as time standards.

These three primary methods can be used at any level desired, as long as data is available at that level. Multiple techniques may be employed in an estimate, but each technique has strengths and weaknesses. Applicability of any one technique varies during a program's life cycle and for different levels of fidelity required for an estimate.

**Other methods** include:
- **Expert opinion**: Utilizes the subjective opinion of Subject Matter Experts (SMEs) to corroborate or adjust cost estimates.
- **Extrapolation from actuals**: Uses data from prototypes or complete or incomplete units to project the cost of future units.

**Double-counting warning**: When using different methods for different cost elements, make sure not to double count. A high-level CER may already capture detail in a lower-level build-up.

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

CEBoK adds that if a system involves a key piece of state-of-the-art equipment which has never been built before, a detailed engineering cost estimate would not be possible since the system description is minimal and historical data does not exist. Analogy would be applied when historical cost data exist for one or more items that are similar to those proposed. Parametric cost estimates can be applied when relationships between cost and system characteristics can be authenticated.

:::tip Beyond CEBoK
A common rule-of-thumb comparison of methods:

| Method | When Used | Advantages | Disadvantages |
|---|---|---|---|
| **Analogy** | Early concept, immature design, limited data | Quick; requires little data | Less precise; depends on analogy quality; assumes technologies/processes are truly similar. |
| **Parametric (CER)** | Mature design, good historical data | Statistically grounded; captures relationships; flexible for sensitivity analysis | Requires sufficient data; statistical assumptions can be violated; extrapolation beyond historical range is risky. |
| **Engineering Build-Up (bottom-up)** | Mature design, detailed specifications | Detailed; reflects specific design; traceable to technical requirements | Labor-intensive; requires extensive data; small errors propagate; does not leverage historical patterns. |
| **Extrapolation from Actuals** | Same program over multiple phases | Uses actual spending; low uncertainty | Only applies when tracking a known program; cannot predict fundamentally new work. |
| **Expert Opinion** | Limited or no data; new technology | Can leverage judgment; flexible | Biased; subjective; must be cross-checked; easily influenced by advocacy. |

**General pattern:** Analogy dominates early; parametric methods span the middle; engineering build-up becomes dominant as the design matures and detail increases. Expert opinion is used when data is absent but should be corroborated.

Typical method selection criteria: data availability, design maturity, technical risk and novelty, program schedule, and accuracy required. Lower TRL (immature technology) usually points to analogy or expert opinion with wider uncertainty; higher TRL usually allows parametric CERs or engineering build-up with narrower uncertainty.
:::

:::check
Q: (Beyond CEBoK) A new electronic warfare system is being estimated. The baseline shows it will use a novel, custom-built radar module (TRL 4) and standard-production software libraries. Which method is most appropriate for the radar module?
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
Q: (Beyond CEBoK scale) Put these stages in order, from least to most mature.
1. Basic principles observed in a lab
2. A component breadboard validated in a lab
3. A prototype demonstrated in a relevant environment
4. A prototype demonstrated in an operational environment
5. The actual system proven in mission operations
> These are TRL 1-3, 4, 6, 7 and 9 on the scale below. Each stage moves the technology closer to real operating conditions.
:::

+++

**Technology Readiness Levels** (TRLs), developed in the 1980s by NASA, are used to assess the maturity of technologies. CEBoK also notes that the program/system baseline's technical/performance, schedule, and risk relate to the technological maturity, or TRLs. When a new technology is in the development stage, it is not suitable for immediate application. Instead, new technologies are usually subjected to experimentation and refinement. Once the technology is proven, it can be given a much higher TRL.

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
Q: (Beyond CEBoK scale) A full system prototype has flown in its operational environment, but the production system hasn't been qualified yet. Which TRL is it?
* TRL 7
- TRL 6
- TRL 8
- TRL 9
> TRL 7 is a system prototype demonstrated in an operational environment. TRL 6 stops at a relevant environment; TRL 8 needs the actual system completed and qualified.
:::

:::challenge trl
Q: (Beyond CEBoK scale) A breadboard of a new sensor has been validated, but only on a lab bench. Which TRL is it?
* TRL 4
- TRL 3
- TRL 5
- TRL 6
> TRL 4 is component or breadboard validation in a laboratory environment. The same breadboard validated in a relevant environment would be TRL 5.
:::

+++

### Relevance to cost estimating

CEBoK says only that new technologies in development are not suitable for immediate application, and that once a technology is proven it can be given a much higher TRL.

:::tip Beyond CEBoK
Common practitioner view: lower TRL means higher cost and schedule risk and uncertainty.

- **Data limitation**: immature technologies have little historical or parametric data, forcing reliance on weaker methods (analogy, expert judgment).
- **Cost growth**: programs with low-TRL technologies often experience greater cost growth as development resolves unknowns.
- **Risk adjustment**: low TRL typically calls for wider risk/uncertainty margins (discussed in later modules) and careful scrutiny of analogies.
- **Method selection**: TRL 1–3 → expert opinion and analogy only; TRL 4–5 → limited parametric, analogy, expert judgment; TRL 6+ → parametric CERs and engineering build-up become viable.

Estimators often apply a TRL risk adjustment factor to the base estimate or explicitly widen the uncertainty range for low-TRL work.
:::

:::check
Q: (Beyond CEBoK) A key subsystem has been demonstrated as a prototype in a relevant environment. What is its TRL, and what does this imply for the estimate?
- TRL 3 (proof of concept); ready for production estimates
- TRL 5 (component validation in relevant environment); still significant risk
* TRL 6 (system model/prototype in relevant environment); significant but lower risk; parametric methods start to become viable
- TRL 8 (system qualified); ready for production at known cost
> TRL 6 means the technology has been demonstrated at a higher fidelity but is not yet production-proven. Cost risk is still real but lower than TRL 4–5; parametric CERs and build-up methods can now be used alongside analogy.
:::

:::check
Q: (Beyond CEBoK) How should a low TRL affect your estimate?
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
Q: (Beyond CEBoK framing) Which kind of validation is each activity?
buckets: Sanity check | Cross-check | Sensitivity analysis
- Ask whether software cost rises with lines of code = Sanity check
- Look for obvious omissions or double-counted elements = Sanity check
- Re-estimate a key cost element with a different method = Cross-check
- Compare against an estimate by an organization outside the program = Cross-check
- Ask how much the total rises if labor rates increase 10% = Sensitivity analysis
- Find which cost elements have the largest confidence ranges = Sensitivity analysis
> CEBoK validation tests key elements for sensitivity, cross-checks results against historical data, a different methodology, or a different cost model, and ends with a cost risk assessment. Sanity checks are a Beyond CEBoK practitioner term for basic reasonableness questions. Sensitivity analysis determines how changing key assumptions and variables affects costs.
:::

+++

Once a cost model is assembled, it must be validated before being presented as the basis for program decisions.

{{primer}}

After developing the cost model, it must be validated. Testing the estimate ensures reasonableness and completeness. The analyst should test key cost elements for sensitivity to the cost-estimating techniques used and to key ground rules and assumptions.

### Cross-checks

Testing should include crosschecking the results with:
- **Historical data** from similar programs/systems
- **A different estimating methodology**
- **A different cost model** (proprietary models versus custom model, e.g., in Excel)

The estimate can also be compared to **industry benchmarks**. These must be based on **publicly available data** since proprietary data from another company may not be used.

Finally, the analyst should conduct a cost risk assessment.

:::tip Beyond CEBoK
Practitioners often add basic **sanity checks**: Does the total seem plausible given the technical baseline and historical analogs? Do individual cost elements scale sensibly with their technical drivers (e.g., does software cost rise with lines of code)? Are there obvious omissions or double-counted elements? Do costs fall or stay roughly flat as production volume increases (exception: breaks or major design changes)? If the estimate differs significantly from an independent cross-check, investigate and reconcile the difference.
:::

+++

### Sensitivity analysis

**Sensitivity analysis** assesses the cost of changing significant input parameters. It identifies key assumptions and variables within the estimate and determines how changing them affects costs. Its value lies in the additional information and understanding it brings to bear on the decision. For decision makers facing an investment decision, sensitivity analysis helps determine how changes in costs or benefits (e.g., due to forecast errors) affect the estimate.

:::tip Beyond CEBoK
Typical sensitivity questions: if labor rates increase 10%, how much does the total cost increase? If a subsystem's technical requirements slip, what is the impact? Results are commonly used to focus risk mitigation, prioritize further data collection, and weigh program trades.
:::

:::check
Q: (Beyond CEBoK application) An estimate is built on three major cost drivers: labor rates, material prices, and a novel subsystem's development cost. A sensitivity analysis shows that the novel subsystem's cost has the largest impact on the total estimate, but labor rates have the smallest. Where should the program focus risk management effort?
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
A: Used by budgeting, contracting, and purchasing organizations to make sure the costs/prices of goods and services budgeted, contracted, and purchased are reasonable, consistent, and well-negotiated. (Beyond CEBoK: often framed as broader than estimating; CEBoK gives no formal definition.)
R: yes
Q: Cost estimate vs. cost guarantee: key difference
A: An estimate is a prediction, not a guarantee. Future uncertainty means even the best estimate will differ from reality. The final product should provide sufficient information on how the estimate was developed so that other analysts could reproduce it.
Q: Three functions of cost estimating
A: Translates system/functional requirements into budget requirements; determines and communicates a realistic view of the likely cost outcome; forms the basis of the plan to develop, field, and support the system.
Q: Why must a cost estimate never become divorced from historical experience?
A: Because it risks losing credibility. Estimators adjust for new materials, technology, and resources, but the foundation must remain grounded in historical data.
Q: What happens when a program runs far over an ICE-based budget?
A: Other programs' resources are diverted to cover the overrun, creating a ripple effect. Programs that run far enough over budget may be terminated, leaving capability gaps.
Q: Core purpose of cost estimating and analysis
A: The three primary reasons for cost estimating are budgeting, planning, and trade-offs. Risk assessment plays a big part in all three.
Q: Name three applications of cost estimates
A: Program viability, structure, and resource decisions; establishing and defending budgets; AoA; new business proposals and source selection; in-process reviews; design trade-offs; technology change assessment; complying with public law; satisfying oversight requirements.

## Context
Q: What is PPBES and POM?
A: PPBES (Programming, Planning, Budgeting, and Execution System) is DoD's budgeting process. POM (Program Objective Memorandum) is the submission requiring cost estimates. Estimates are revised during comptroller, OSD, and President's budget reviews.
R: yes
Q: When must a program have a validated cost estimate?
A: At major milestone reviews and acquisition reviews. DoD Instructions 5000.2 and 5000.4-M mandate both a POE and CCA at these reviews to inform decisions and maintain management control.

## Organizations
Q: What is CAPE?
A: OSD Cost Assessment and Program Evaluation. Milestone review authority for major DoD programs; has oversight of the DoD service cost centers (Naval Center for Cost Analysis, Cost and Economic Analysis Center, AFCAA).
R: yes
Q: What is the GAO?
A: Government Accountability Office. Oversees for fiscal responsibility at a broader level (with OMB and Congress) and plays an auditing role (with the Defense Contract Audit Agency, DCAA).
R: yes
Q: Why do programs require both a POE (Program Office Estimate) and a CCA (DoD Component Cost Analysis)?
A: DoD Instructions 5000.2 and 5000.4-M mandate that programs develop both a POE and a CCA to support acquisition milestone reviews. The CCA is prepared by the service cost center (e.g., the Naval Center for Cost Analysis) and briefed to CAPE.
Q: What does FFRDC stand for?
A: (Beyond CEBoK) Federally Funded Research and Development Center (e.g., RAND, IDA, Aerospace Corporation, MITRE). Provides estimating support to government sponsors.
R: yes
Q: When is a cost group (I) positionally independent of the acquiring organization (A)?
A: The cost group is positionally independent if and only if it shares no common superior with the acquiring organization. (Case 1: I and A share no common superiors besides S. Case 2: S can still accept the estimate as long as B accepts it.)

## Skills
Q: Related disciplines in cost estimating
A: Mathematics (probability, statistics, regression); Economics (inflation, discounting, analysis); Accounting (tracking expenditures); Budgeting (resource allocation); Operations Research and Industrial Engineering (optimization, simulation); Computer Science (software estimation); Engineering (design parameters, risk); Marketing (presentations and defense of estimates).
Q: What does a cost estimator need to understand about the system being estimated, and why?
A: Familiarity with the product system, software, process, etc., helps to identify cost drivers and understand the data needed to develop cost estimates.
Q: Is cost analysis the same as accounting or auditing?
A: CEBoK does not make this distinction. It says cost estimating obtains much of its data from cost accounting systems, and helps determine anticipated expenditures, which are then tracked through detailed accounting structures; actual cost data informs future cost estimating. GAO and DCAA play the auditing role.

## Quality: Six CEBoK Characteristics
Q: Six characteristics of a high-quality cost estimate
A: Accuracy, Comprehensiveness, Replicability, Auditability, Credibility, and Timeliness.
R: yes
Q: What is the most important quality of a cost estimate and why?
A: Credibility is the single most important quality of a good cost estimate. The estimate must be accurate, replicable, and auditable in order to be credible.
Q: What does "Accuracy" mean?
A: Estimates are unbiased, neither unrealistically low nor overly conservative, but based on an assessment of most likely costs. Underlying data have been normalized for technical baseline and for inflation using appropriate guidance. CERs result from regression analyses with good curve fits and minimal error bands, making them valid predictors of cost. Time phasing of the estimate is logical and reliable.
R: yes
Q: What does "Comprehensiveness" mean?
A: The estimate uses a WBS at appropriate detail to ensure all cost elements are included exactly once with no gaps or double-counting. All cost-driving GR&A are documented.
R: yes
Q: What does "Replicability" mean?
A: The estimate presents a WBS fully traceable to the system specification. It thoroughly documents source data, significance and goodness of fit statistics for CERs, detailed calculations and results, and explanations for why a particular method or reference was chosen.
R: yes
Q: What does "Auditability" mean?
A: A reviewer can follow the estimate process, repeat the calculations, and arrive at the same answer.
R: yes
Q: What does "Timeliness" mean?
A: Even a high-quality estimate cannot provide value if not delivered to decision makers on time.
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
A: Analysts may only have access to secondary data which have been adjusted one or more times from the original raw data. Inadequately documented estimates lose credibility, and without good documentation, crucial information, data, experience, and estimating approaches may be lost along with the tacit knowledge of analysts who could retire or leave the organization.
Q: What are the key limitations of cost analysis?
A: The cost analysis process should: conform to the situation/program; produce results of the same caliber as the input data; disregard political and non-cost impacts; utilize sound judgment, management, or control; and support but not dictate the final decisions.

## Products
Q: Four main cost estimating products
A: Technical and schedule baseline description; the cost estimate; the cost model; and estimate documentation.
Q: What is a CARD?
A: Cost Analysis Requirements Description. A specific case of a technical and schedule baseline description required by major DoD programs.
R: yes
Q: Technical baseline: what does it describe?
A: It provides a detailed technical and schedule description of the program/system to be estimated. It collects, integrates, and coordinates all the technical, programmatic, and schedule information necessary to estimate the costs of a program.
Q: Why must the technical baseline be treated as an explicit, documented set of assumptions?
A: So that changes can be tracked, and the estimate's sensitivity to baseline changes is clear. If the baseline changes, the estimate must be revisited.
Q: Definition of a cost model
A: The collection of cost estimating methodologies associated with a cost element or work breakdown structure that best reflects the cost of a future system, given three considerations: level of detail of technical/programmatic definition of the future system, level of detail of relevant existing cost estimating methodologies, and level of detail of historical data available to develop new methodologies.
R: yes
Q: Three considerations that shape a cost model
A: Level of detail of the technical/programmatic definition of the future system; level of detail of relevant existing cost estimating methodologies; level of detail of historical data available to develop new methodologies.

## Estimate Types
Q: ROM estimate
A: Rough Order of Magnitude. Used when very little specific information is known; design effort has not begun, and the estimate is often based on ratios or factored historical information. Primarily used for feasibility studies and selection from among alternatives.
R: yes
Q: LCCE
A: Life Cycle Cost Estimate. The prototypical cost estimate; includes R&D, production, O&S, and disposal costs covering all costs for the program's complete duration (often confused with O&S estimates). Compiled as early as possible, even in pre-acquisition and proposal stages. Milestone decisions generally require LCCEs as supporting documentation. Covers costs regardless of funding source; also known as a Total Ownership Cost (TOC) estimate.
R: yes
Q: ICE
A: Independent Cost Estimate. An LCCE developed by an analyst outside the program or project office that tests the reasonableness of the program or project estimate. Uses the same technical and schedule baseline information but a different estimating methodology. An objective assessment of the program's most likely cost; critically examines the LCCE to identify potential budgetary excesses and shortfalls, and identifies cost risks. Supports critical milestone reviews.
R: yes
Q: Budget Estimate
A: Developed strictly to obtain authorization for funding. In theory, has a wider margin for error than other types. Three purposes: (1) ensure project feasibility and attainable performance levels; (2) develop a reliable project cost estimate consistent with realistic schedules; (3) establish baseline project definitions, schedules, and costs. Ideally includes a risk assessment (a GAO best practice; not all organizations require it).
R: yes
Q: EAC
A: Estimate At Completion. Used for in-process programs and for ICEs when there is sufficient cost history. Typically relies on EVM techniques. More important in recent years because of the need to certify programs under the Nunn-McCurdy Act of 2010 and the Weapon Systems Acquisition Reform Act (WSARA) of 2009.
R: yes
Q: ICA
A: Independent Cost Assessment. An independent estimate with risk incorporated; starts with an external estimate (usually from the contractor or program office) and incorporates adjustments based on a more objective view of the program. Ranges from a full-blown ICE to a cursory sufficiency review.
R: yes
Q: EA
A: Economic Analysis. Describes a specific mission requirement and lists specific alternative courses of action that will satisfy it. A framework for systematically investigating problems of choice; examines and compares the costs and benefits of each alternative. Also known as cost-benefit analysis or Business Case Analysis (BCA).
R: yes
Q: AoA vs EA
A: AoA (Analysis of Alternatives) evaluates the costs and benefits (i.e., operational effectiveness or utility) of different courses of action to meet recognized needs. An EA is more of a BCA where benefits can be quantified monetarily; an AoA usually involves performance characteristics as well.
Q: Why is an LCCE typically much larger than an acquisition-only estimate?
A: LCCE includes Operating & Support (O&S) costs over the entire system life (often decades), which are often the largest share of it (Beyond CEBoK: frequently 60–80% of total life-cycle cost).

## Documentation
Q: What does estimate documentation include?
A: Purpose; scope; ground rules and assumptions; program background and system description; program schedule; and cost estimating methodology. Analysts should also document: data used, its source, and normalization; basis/source of CERs and factors; labor hours and rates; cost improvement curve methodology; hardware and materials and basis of costs; pre-existing cost models used; inflation indices and time-phasing approach; logic and rationale for conclusions (expert judgments); risk analysis and how confidence was established; a conclusion on the reasonableness of the program office estimate; appendices; and a reference list.
Q: Report requirements for cost estimates
A: Reports must be crisp and complete; easily understood by unfamiliar audiences; thorough on important details; and demonstrative of the competence behind the results. Proposals should include an executive volume summarizing technical aspects.
Q: What is CAIV (Cost As an Independent Variable)?
A: Setting aggressive yet realistic cost objectives when defining operational requirements and acquiring systems, and managing achievement of these objectives. A program has three parameters: schedule, performance, and cost adjusted for risks present in all three. CAIV makes performance and schedules a function of available resources, namely cost.
R: yes

## Process
Q: CEBoK seven-step estimating process
A: (1) WBS development · (2) Program/system baseline development · (3) Data collection · (4) Data analysis · (5) Cost element methodology · (6) Model development and validation · (7) Results and report generation.
R: yes
Q: When are ground rules and assumptions (GR&A) defined?
A: During program/system baseline development (step 2), early in the process. This ensures they shape all later steps: methodology, data, and model.
Q: What is a WBS?
A: Work Breakdown Structure. A common frame of reference for relating job tasks to each other and relating project costs at the summary level of detail; a consistent, visible framework for specifying the objectives, labor, materials, and contracts of the program/system, displayed as a product-oriented family tree.
R: yes
Q: What does it mean for a WBS to be "100% complete"?
A: (Beyond CEBoK: MIL-STD-881/PMI "100% rule") Every element of program scope is included exactly once, with no gaps or double-counting. CEBoK phrases it as: describe components at the level needed to capture all elements of cost.
Q: WBS Level 1, Level 2, Level 3
A: (Beyond CEBoK: MIL-STD-881 convention) Level 1 = entire system. Level 2 = major elements (e.g., prime mission product, SEPM, test, training, data, spares). Level 3+ = further decomposition.
Q: DoD standard for WBS
A: MIL-STD-881B / MIL-HDBK-881A provides the framework and instructions for developing a DoD WBS.
R: yes
Q: What is a WBS dictionary?
A: A document that lists and defines each WBS element, shows hierarchical relationships, describes resources and processes for each element, and links to technical definition documents. Updated regularly to reflect current program status.
R: yes
Q: WBS vs. Cost Element Structure (CES)
A: WBS is product-oriented from an engineering standpoint. CES is the cost estimating view. A properly developed CES should encompass all WBS elements.

## Data Collection and Normalization
Q: Four-step data collection process
A: (1) Develop an understanding of the total picture of the estimating task. (2) Establish a cost element/work breakdown structure and boundaries around the estimate. (3) Understand the estimating techniques to be employed and their associated data collection needs. (4) Develop a data collection plan.
Q: What is compositing in data collection?
A: A technique for aggregating WBS items when only higher-level data is available. Items are weighted by a characteristic (weight, quantity, size, or % new design) to create a composite value, ensuring no component is forgotten.
R: yes
Q: What is data normalization and why is it necessary?
A: The process of making data consistent and comparable to other data used in the estimate. Types: by cost units; by sizing units; by special groupings such as mission application, platform operating environment, and recurring/non-recurring costs; by development state; and of end terms for homogeneity. Should be done in an objective and reasonable manner and not to make the data fit a desirable outcome.
R: yes

## Cost Estimating Methods
Q: Three basic costing techniques
A: Analogy (compare to similar item); Parametric/CER (mathematical relationship from historical data); Engineering build-up (estimate at lowest definable level).
Q: Other cost estimating methods beyond the three basic techniques
A: Expert opinion (subjective opinion of SMEs to corroborate or adjust cost estimates); extrapolation from actuals (data from prototypes or complete or incomplete units to project the cost of future units).
Q: Double-counting warning when mixing estimating methods
A: When using different methods for different cost elements, make sure not to double count. A high-level CER may already capture detail in a lower-level build-up.
Q: Analogy method: when used and why
A: Compares the cost of an item to be estimated to a similar item. (Beyond CEBoK rule of thumb: early concept, immature design, limited data; quick and requires little data, but depends on analogy quality.) CEBoK: applied when historical cost data exist for one or more items similar to those proposed.
Q: Parametric (CER) method: when used and why
A: A mathematical relationship based on historical data that relates cost to one or more technical, performance, cost, or programmatic parameters. CEBoK: applied when relationships between cost and system characteristics can be authenticated. (Beyond CEBoK rule of thumb: mature design, good historical data.)
Q: Engineering build-up (bottom-up) method: when used and why
A: Estimates costs at the lowest definable level, frequently making use of Industrial Engineering techniques such as time standards. (Beyond CEBoK rule of thumb: mature design, detailed specifications; detailed and traceable but labor-intensive.)
Q: Expert opinion / Delphi: when used and cautions
A: Uses the subjective opinion of Subject Matter Experts (SMEs) to corroborate or adjust cost estimates. (Beyond CEBoK rule of thumb: used when data is limited or absent; biased and subjective, so cross-check it.)
Q: General progression: analogy → parametric → engineering build-up
A: (Beyond CEBoK rule of thumb) Analogy dominates early (immature design); parametric spans the middle; build-up dominates late (mature, detailed design). CEBoK: applicability of any one technique varies during a program's life cycle and with the level of fidelity required.
Q: How does TRL affect method selection?
A: (Beyond CEBoK) Rule of thumb: low TRL (1–3) → analogy, expert opinion only. TRL 4-5 → limited parametric, analogy, expert judgment; TRL 6+ → parametric CERs and engineering build-up become viable.

## TRL (Technology Readiness Level)
Q: What does TRL measure?
A: Technology Readiness Level. Developed in the 1980s by NASA to assess the maturity of technologies. (Beyond CEBoK: 1–9 scale, from basic research (1–3) through operational deployment (7–9).)
R: yes
Q: TRL 1
A: (Beyond CEBoK) Basic principles observed and reported.
R: yes
Q: TRL 4
A: (Beyond CEBoK) Component/breadboard validation in a laboratory environment.
R: yes
Q: TRL 6
A: (Beyond CEBoK) System/subsystem model or prototype demonstration in a relevant environment.
R: yes
Q: TRL 7
A: (Beyond CEBoK) System prototype demonstration in an operational environment.
R: yes
Q: TRL 9
A: (Beyond CEBoK) Actual system proven through successful mission operations.
R: yes
Q: How does low TRL affect cost risk and uncertainty?
A: (Beyond CEBoK) Practitioner view: lower TRL means higher cost and schedule uncertainty and often greater cost growth. Implies limited historical/parametric data (forcing reliance on weaker methods) and need for wider risk margins.
Q: Low TRL and cost estimation: what adjustment is appropriate?
A: (Beyond CEBoK) Practitioner view: expect higher cost uncertainty; apply wider risk/confidence ranges; use analogy and expert judgment; allocate larger risk contingencies; avoid extrapolating parametric CERs.

## Validation and Sensitivity
Q: Purpose of sensitivity analysis
A: Sensitivity analysis assesses the cost of changing significant input parameters. It identifies key assumptions and variables within the estimate and determines how changing them affects costs. Its value lies in the additional information and understanding it brings to bear on the decision.
Q: What is a cross-check in cost estimating?
A: Crosschecking the results with historical data from similar programs/systems, applying a different estimating methodology, and/or applying a different cost model (proprietary vs. custom, e.g., Excel). The estimate can also be compared to industry benchmarks based on publicly available data (proprietary data from another company may not be used).
R: yes
Q: When the estimate differs significantly from a cross-check, what should the estimator do?
A: (Beyond CEBoK) Investigate and reconcile the difference. Differences in baseline, method, or data quality must be understood and documented so decision-makers know why estimates differ.
Q: Sanity check for a cost model
A: (Beyond CEBoK practitioner term) Basic reasonableness questions: Does the total seem plausible? Do individual elements scale reasonably? Are there omissions or double-counts? Do costs trend sensibly with scale and design changes?
`
});
