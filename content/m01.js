PCEA.addModule({
  id: 'm01', num: 1, title: 'Introduction to Cost Estimating and Analysis', short: 'Intro to Cost Estimating', source: 'guide',
  blurb: 'What cost estimating is, the products it creates, and the repeatable process behind a credible estimate.',
  intro: String.raw`**Cost estimating** predicts the future cost of a system, product, or program based on historical data and quantitative models. **Cost analysis** is broader: it evaluates estimates, compares alternatives, and assesses risk to support decisions.

This module sets up the vocabulary for the rest of the course: definitions, who produces estimates, what they deliver, and the process to build a credible one.

**Key framework:** A cost estimate is only as credible as its technical baseline, data, and methodology. The discipline organizes around four pillars: understanding *why* estimates are needed and *who* uses them; understanding the *environment and constraints* estimators work within; knowing what *products* must be delivered; and following a repeatable *process* to produce them.`,
  sections: [
    {
      id: 'definition', title: 'Cost estimating vs. cost analysis', summary: 'Definitions, purpose, and the key distinction',
      body: String.raw`**Cost estimating** is the process of collecting and analyzing historical data, and applying quantitative models, techniques, and databases to **predict the future cost** of an item, product, program, or task.

**Cost analysis** is broader. It includes estimating, but also covers evaluating and comparing costs to support decisions: analyzing alternatives, assessing affordability, reviewing proposals, and tracking performance against a baseline.

:::key
An estimate turns **uncertain future resources** into numbers decision-makers can act on. It should come with its assumptions, its method, and its uncertainty.
:::

+++

### Purpose and applications

Cost estimates support decisions across the entire program life cycle:
- **Budgeting and programming** — how much, and when will funds be needed?
- **Milestone and investment decisions** — is the program affordable?
- **Analysis of alternatives (AoA)** and **economic analysis** — which option delivers the best value?
- **Source selection** and **contract pricing** — is a proposal realistic and reasonable?
- **Should-cost analysis** and cost management — where can cost be reduced?
- **Earned value management (EVM)** — independent estimates at completion for performance tracking.

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
      id: 'orgs', title: 'Who estimates: organizations and skills', summary: 'Government, contractors, and oversight bodies',
      body: String.raw`Cost estimating is performed by multiple, independent organizations to provide checks and balances:

| Organization | Role |
|---|---|
| **Program Office** | Develops estimates from within the program; closest to technical detail but may be subject to advocacy bias (incentive to show affordability). |
| **Independent Government Cost Orgs** (e.g., DoD's **CAPE**, service cost agencies) | Build independent estimates outside the program's chain of command; objective, unbiased check at major milestones. |
| **Contractor Cost Estimators** | Develop proposal cost estimates for government or commercial solicitations; basis for contract negotiation. |
| **GAO (Government Accountability Office)** | Audits federal cost estimates against the GAO Cost Estimating and Assessment Guide (best practices). |
| **Congressional Budget Office (CBO)** | Provides cost estimates of legislation for Congress. |
| **FFRDCs and support organizations** (IDA, RAND, Aerospace, MITRE) | Provide estimating and analysis support to government sponsors. |

:::key
Multiple independent organizations exist specifically to **counter advocacy bias and optimism** — a recurring theme throughout PCEA.
:::

+++

### Skills an estimator needs

Cost estimators draw on a blend of skills:

| Area | Why |
|---|---|
| **Quantitative/analytical** | Statistics, regression, algebra; familiar with cost models and tools. |
| **Technical understanding** | Enough engineering knowledge to understand the system and evaluate the reasonableness of the baseline. |
| **Communication** | Clear documentation, briefing results to non-technical decision-makers, defending under scrutiny. |
| **Research and data-gathering** | Locating, collecting, and validating historical data from diverse sources. |
| **Judgment** | Knowing when data is insufficient; when to rely on analogy or expert opinion; disclosing those judgment calls. |
| **Objectivity and integrity** | Resisting pressure to conform an estimate to a predetermined (lower) answer. |

:::check
Q: Which skill is MOST critical to counter advocacy and optimism bias?
- Advanced mathematical modeling
* Objectivity and integrity; resisting pressure to conform to a predetermined answer
- Familiarity with the latest cost models
- Strong communication skills
> The best method and data are useless if an estimator is pressured to produce a lower estimate to support program approval. Integrity underpins all other skills.
:::`
    },
    {
      id: 'quality', title: 'The four qualities of a reliable estimate', summary: 'GAO best practices for credibility',
      body: String.raw`The **Government Accountability Office (GAO)** defines a high-quality, reliable cost estimate with four characteristics:

| Characteristic | Meaning |
|---|---|
| **Comprehensive** | Covers the full life cycle and all cost elements; includes a complete Work Breakdown Structure (WBS) and clearly defined ground rules and assumptions. |
| **Well-documented** | Someone unfamiliar with the program could **recreate** it from the documentation. Sources, methods, and calculations are traceable and reproducible. |
| **Accurate** | Based on the best available data; unbiased (neither overly conservative nor optimistic); adjusted for inflation and normalized; free of computational errors. |
| **Credible** | Limitations, risk, and uncertainty are discussed. Sensitivity analysis is performed. The estimate is **cross-checked** against an independent estimate or other methods. Differences are reconciled. |

:::check
Q: A cost estimate includes detailed labor and material breakdowns, but does not mention the source of historical cost data or the assumptions underlying the labor rates. Which of GAO's four qualities is most at risk?
- Comprehensive (should include all cost elements)
* Well-documented (sources and assumptions must be traceable)
- Accurate (no way to verify without the documentation)
- Credible (cannot cross-check without knowing the method)
> Well-documented means someone unfamiliar with the program can trace and recreate the estimate. Omitting data sources and rate assumptions makes it impossible to verify or reproduce.
:::

+++

### Common challenges to cost estimating

Estimates are difficult for predictable reasons:

- **Immature or changing technical requirements** — the baseline itself evolves early in a program.
- **Limited or poor-quality historical data** — sparse, inconsistent, proprietary, or not analogous to the new system.
- **New or novel technology (low TRL)** — little or no analogous historical data; forces reliance on weaker methods (analogy, expert judgment).
- **Advocacy and optimism bias** — pressure (conscious or unconscious) to produce an estimate supporting a predetermined (lower) outcome.
- **Schedule and budget instability** — requirements creep and program replanning invalidate prior estimates.
- **Uncertainty is often ignored** — decision-makers want a single number, not a range or distribution, but estimates are inherently uncertain.
- **Time and resource constraints** — estimators asked to produce credible estimates on compressed schedules with limited data-collection time.

:::check
Q: A program is in early concept phase with a poorly defined technical baseline and very limited historical data. Which challenge is the estimator MOST likely to face?
- Schedule and budget instability
- Advocacy and optimism bias
* Limited data forces reliance on analogy and expert judgment, which are weaker methods
- Requirement changes (creep) will definitely occur
> Early programs face data scarcity and baseline immaturity. This forces reliance on methods (analogy, expert opinion) that are inherently less precise, creating wider uncertainty ranges. (All the other challenges *may* occur, but data limitation is the most fundamental constraint at this phase.)
:::`
    },
    {
      id: 'products', title: 'The three cost estimating products', summary: 'Baseline, estimate, and documentation',
      body: String.raw`An estimate is more than a single number. It consists of three primary deliverable products:

### 1. Technical and Schedule Baseline Description

The **technical baseline** describes *what* is being estimated:
- **What the system is**: technical characteristics, performance parameters, design maturity.
- **What the program will do**: acquisition strategy, quantities, testing and deployment approach.
- **When things happen**: schedule of major milestones, production rates, key decision dates.

In DoD, this is formalized in the **Cost Analysis Requirements Description (CARD)**, which gives all estimators a common starting point. Changes to the baseline must be tracked because they directly affect the estimate.

:::tip
Treat the baseline as an explicit, documented assumption set — not an implicit understanding. When the baseline changes, the estimate must be revisited.
:::

### 2. The cost estimate and cost model

The **cost estimate** is the quantitative output: a summation of individual cost element estimates (organized by the WBS) into a total, usually time-phased by year and by appropriation/funding category.

The **cost model** is the structured tool (spreadsheet, software, calculator) that organizes the WBS, applies estimating methods and cost estimating relationships (CERs) to each element, and produces the results.

A good cost model is:
- Traceable to the technical baseline
- Flexible enough to support sensitivity analysis and "what-if" trades
- Documented so another analyst could reproduce and verify it

### 3. Types of estimates

Estimates vary in fidelity and purpose:

| Type | Purpose and Fidelity |
|---|---|
| **ROM (Rough Order of Magnitude)** | Very early, low-fidelity feasibility/screening estimate; wide uncertainty range. |
| **Budgetary estimate** | More refined; used for formal budget submissions with a more mature baseline. |
| **Life-Cycle Cost Estimate (LCCE)** | Comprehensive; covers R&D, production, operating & support (O&S), and disposal across the entire program life. |
| **Program Office Estimate (POE)** | Developed by the program's own estimators, closest to technical detail. |
| **Independent Cost Estimate (ICE)** | Built by an organization independent of the program office to provide an objective check. |
| **Should-cost estimate** | What a program *should* cost with efficient, economical operations; used to find cost reduction opportunities and negotiate contracts. |
| **IGCE (Independent Government Cost Estimate)** | Government's estimate of a contract's cost, used in source selection and negotiations. |

+++

### Estimate documentation

Documentation is a deliverable product in its own right, not an afterthought. It typically includes:
- Ground rules and assumptions (GR&A)
- Technical and schedule baseline description
- Data sources and adjustments (normalization, inflation)
- Methodology by cost element and rationale for method selection
- Results, including time-phasing, sensitivity and risk/uncertainty analysis
- Comparison to any independent estimates and reconciliation of differences

Good documentation is what makes an estimate "well-documented" and "credible" per GAO's four qualities.

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
> O&S costs — maintenance, operations, training, support — often constitute 60–80% of total life-cycle cost for long-lived systems. An acquisition-only estimate captures only R&D and production, missing the largest cost driver.
:::`
    },
    {
      id: 'process', title: 'The cost estimating process', summary: 'CEBoK six steps and the WBS framework',
      body: String.raw`The CEBoK outlines a repeatable, generally sequential process for building cost estimates. This process is the skeleton for most of the rest of CEBoK (Modules 2–13 expand each step).

### The six CEBoK steps

1. **Work Breakdown Structure (WBS) development**: Decompose the program scope into discrete, definable work elements (hardware, software, services, data) that can each be estimated and tracked.

2. **Program/System baseline development**: Establish the technical, programmatic, and schedule baseline; identify cost drivers; and define ground rules and assumptions (GR&A).

3. **Data collection and data analysis**: Gather cost, technical, and programmatic data from analogous systems or prior phases. Normalize data (adjust for inflation, quantity, technical differences).

4. **Cost element methodology**: For each WBS element, select the most appropriate estimating method given available data and design maturity. Major families: **analogy**, **parametric (CER)**, **engineering build-up**, **extrapolation from actuals**, **expert opinion**.

5. **Model development and validation**: Integrate individual estimates into a cost model tied to the WBS. Validate with sanity checks, cross-checks, and sensitivity analysis.

6. **Results and report generation**: Summarize results (often time-phased by year and funding category). Present risk and uncertainty analysis alongside the point estimate. Deliver the documentation package (GR&A, data, methods, results).

:::check
Q: At what stage of the CEBoK process are ground rules and assumptions (GR&A) defined?
- During model validation (step 5), after the numbers are in
* During program/system baseline development (step 2), early in the process
- During report generation (step 6), when presenting results
- Only if the customer specifically requests them
> GR&A (base year, quantities, schedule, what is in or out of scope) shape every later step — methodology selection, data collection, and model structure all depend on them. They must be set early and documented so changes can be tracked.
:::

+++

### The Work Breakdown Structure (WBS)

The **WBS** is a hierarchical decomposition of program scope into discrete work elements. Key characteristics:

- **Product-oriented** (not organized by contractor or funding line) — e.g., Air Vehicle, Payload, Support Equipment, rather than "Contractor A" or "FY 2024"
- **Hierarchical**: Level 1 is the entire system; Level 2 are major elements; Level 3+ breaks them down further
- **100% complete decomposition**: every element of program scope is included exactly once (no gaps or double-counting)
- **Standard templates exist**: MIL-STD-881 for DoD systems; industry standards for commercial programs
- **Backbone of the estimate**: the WBS organizes data collection, method selection, and integration of results

The WBS is critical because it ensures every cost element is accounted for consistently, independent of which contractor performs the work or which funding line pays for it.

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
:::`
    },
    {
      id: 'methods', title: 'Cost estimating methods and methodology selection', summary: 'Analogy, parametric, build-up, and when to use each',
      body: String.raw`For each WBS element, the estimator selects the most appropriate method given available data and design maturity. The major families are:

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
      id: 'trl', title: 'Technology Readiness Levels (TRLs)', summary: 'Maturity scale 1–9 and relevance to cost risk',
      body: String.raw`**Technology Readiness Levels** (TRLs) are a standardized 1–9 scale (developed by NASA, widely adopted in DoD and civilian agencies) describing the maturity of a technology:

| TRL | Description |
|---|---|
| **TRL 1–3** | Basic research through proof-of-concept (lowest maturity); principles observed in lab. |
| **TRL 4** | Component/breadboard validation in a laboratory environment. |
| **TRL 5** | Component/breadboard validation in a relevant (near-operational) environment. |
| **TRL 6** | System/subsystem model or prototype demonstrated in a relevant environment. Common Milestone B target. |
| **TRL 7** | System prototype demonstration in an operational environment. |
| **TRL 8** | Actual system completed and qualified through test and demonstration. |
| **TRL 9** | Actual system proven through successful mission operations. |

:::widget trl:::

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
> TRL 6 means the technology has been demonstrated at a higher fidelity but is not yet production-proven. This is a typical target for Milestone B (start of engineering and manufacturing development). Cost risk is still real but lower than TRL 4–5; parametric CERs and build-up methods can now be used alongside analogy.
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
      body: String.raw`Once a cost model is assembled, it must be validated before being presented as the basis for program decisions.

### Sanity checks

Ask basic reasonableness questions:
- Does the total seem plausible given the technical baseline and historical analogs?
- Do individual cost elements scale sensibly with their technical drivers (e.g., does software cost rise with lines of code)?
- Are there obvious omissions or double-counted elements?
- Do costs fall or stay roughly flat as production volume increases? (Exception: breaks or major design changes.)

### Cross-checks

Compare the estimate against independent data:
- **Parametric models** (published industry cost-estimating relationships)
- **Historical analogs** (actual costs of similar prior programs)
- **Independent estimates** (estimates by organizations outside the program)
- **Bottom-up rebuild** (re-estimating one section using a different method to verify the result)

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
A: The process of collecting and analyzing historical data and applying quantitative models, techniques, and databases to predict the future cost of an item, product, program, or task.
Q: Definition of cost analysis
A: The broader discipline that includes cost estimating plus evaluating and comparing costs to support decisions (alternatives, affordability, proposals, performance tracking).
Q: Cost estimate vs. cost guarantee: key difference
A: An estimate is a prediction based on available information at a point in time; it is not a guarantee. It should be defensible, reproducible, and documented — not necessarily "correct" in hindsight, since the future is inherently uncertain.
Q: Core purpose of cost estimating and analysis
A: Support budgeting, decision-making, program management, independent assessment, and affordability analysis throughout a program's life cycle.
Q: Name three applications of cost estimates
A: Budgeting; milestone/investment decisions; AoA and economic analysis; source selection and contract pricing; should-cost analysis; EVM performance tracking.

## Organizations
Q: What is CAPE?
A: Office of Cost Assessment and Program Evaluation (DoD). Produces independent cost estimates and cost policy guidance.
Q: What is the GAO?
A: Government Accountability Office. Audits federal cost estimates and publishes the Cost Estimating and Assessment Guide (best practices).
Q: Why do programs require both a POE (Program Office Estimate) and an ICE (Independent Cost Estimate)?
A: POE is developed by the program office (close to technical detail but subject to advocacy bias); ICE is independent (objective check). Both provide a cross-check against optimism and errors.
Q: What does FFRC stand for?
A: Federally Funded Research and Development Center (e.g., RAND, IDA, Aerospace Corporation, MITRE). Provides estimating support to government sponsors.

## Skills
Q: Why is objectivity and integrity the most critical skill for a cost estimator?
A: To resist pressure to conform an estimate to a predetermined (lower) answer. Advocacy bias undermines credibility regardless of other skills or methods.
Q: What does a cost estimator need to understand about the system being estimated, and why?
A: Enough engineering/technical knowledge to evaluate the reasonableness of the technical baseline and understand what drives cost in the system.

## Quality: The Four GAO Characteristics
Q: GAO's four characteristics of a reliable cost estimate
A: Comprehensive, Well-documented, Accurate, and Credible.
Q: What does "Comprehensive" mean?
A: The estimate captures the entire scope: full life cycle, all cost elements, no gaps or double-counting; includes a complete WBS and clearly defined ground rules and assumptions.
Q: What does "Well-documented" mean?
A: Someone unfamiliar with the program could recreate the estimate from the documentation. Sources, methods, assumptions, and calculations are traceable and reproducible.
Q: What does "Accurate" mean?
A: Based on valid, current data; properly adjusted (normalized, inflated); free of computational errors; unbiased (neither overly conservative nor optimistic).
Q: What does "Credible" mean?
A: Limitations, risk, and uncertainty are discussed; sensitivity analysis is performed; the estimate is cross-checked against independent estimates and differences are reconciled.

## Challenges
Q: Name four common challenges to cost estimating
A: Immature or changing requirements; limited or poor-quality historical data; new/low-TRL technology; advocacy and optimism bias; schedule and budget instability; uncertainty often ignored; time and resource constraints.
Q: Why is "uncertainty often ignored" a challenge?
A: Decision-makers often want a single point estimate, but estimates are inherently ranges/distributions. Reporting only a single number masks uncertainty and leads to overconfidence.

## Products
Q: Three main cost estimating products
A: Technical and schedule baseline description; the cost estimate (cost model and documentation).
Q: What is a CARD?
A: Cost Analysis Requirements Description. A DoD document that gives the common technical and programmatic baseline for all estimators on a program.
Q: Technical baseline: what does it describe?
A: What the system is (technical characteristics, performance, design maturity); what the program will do (acquisition strategy, quantities, testing); when things happen (schedule, production rates).
Q: Why must the technical baseline be treated as an explicit, documented set of assumptions?
A: So that changes can be tracked, and the estimate's sensitivity to baseline changes is clear. If the baseline changes, the estimate must be revisited.
Q: Definition of a cost model
A: A structured combination of a WBS, cost estimating relationships (CERs), and supporting data used to generate the estimate. It should be traceable, flexible for sensitivity analysis, and documented.

## Estimate Types
Q: ROM estimate
A: Rough Order of Magnitude. A very early, low-fidelity estimate used for feasibility and screening. Wide uncertainty range.
Q: LCCE
A: Life Cycle Cost Estimate. Comprehensive estimate covering R&D, production, operations & support (O&S), and disposal across the entire program life.
Q: POE vs. ICE
A: POE (Program Office Estimate) is developed by the program's own estimators, close to technical detail. ICE (Independent Cost Estimate) is built by an independent organization to provide an objective check.
Q: IGCE
A: Independent Government Cost Estimate. The government's estimate of a contract cost, used in source selection and negotiations.
Q: Should-cost estimate
A: What a program should cost with efficient, economical operations. Used to identify cost reduction opportunities and evaluate contractor pricing.
Q: Why is an LCCE typically much larger than an acquisition-only estimate?
A: LCCE includes Operating & Support (O&S) costs over the entire system life (often decades), which frequently constitute 60–80% of total life-cycle cost.

## Documentation
Q: What does estimate documentation include?
A: Ground rules and assumptions; technical and schedule baseline description; data sources and adjustments; methodology by cost element; results and time-phasing; sensitivity and risk/uncertainty analysis; comparison to independent estimates.

## Process
Q: CEBoK six-step estimating process
A: (1) WBS development · (2) Program/system baseline development · (3) Data collection and analysis · (4) Cost element methodology · (5) Model development and validation · (6) Results and report generation.
Q: When are ground rules and assumptions (GR&A) defined?
A: During program/system baseline development (step 2), early in the process. This ensures they shape all later steps: methodology, data, and model.
Q: What is a WBS?
A: Work Breakdown Structure. A hierarchical, product-oriented decomposition of program scope into definable work elements (hardware, software, services, data).
Q: What does it mean for a WBS to be "100% complete"?
A: Every element of program scope is included exactly once; no gaps or double-counting. The WBS is independent of which contractor performs the work or which funding line pays for it.
Q: WBS Level 1, Level 2, Level 3
A: Level 1 = entire system. Level 2 = major elements (e.g., prime mission product, SEPM, test, training, data, spares). Level 3+ = further decomposition.
Q: DoD standard for WBS
A: MIL-STD-881, with appendices for different system types (aircraft, ships, missiles, software, etc.).

## Cost Estimating Methods
Q: Name the five major families of cost estimating methods
A: Analogy (adjust known similar system); Parametric/CER (statistical relationship); Engineering build-up (detailed bottom-up); Extrapolation from actuals (same program phases); Expert opinion.
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
A: Low TRL (1–3) → analogy, expert opinion only. Mid TRL (4–6) → parametric possible with caution. High TRL (7+) → parametric CERs and engineering build-up viable.

## TRL (Technology Readiness Level)
Q: What does TRL measure?
A: Technology Readiness Level. A 1–9 scale measuring technology maturity, from basic research (1–3) through operational deployment (7–9).
Q: TRL 1
A: Basic principles observed and reported.
Q: TRL 4
A: Component/breadboard validation in a laboratory environment.
Q: TRL 6
A: System/subsystem model or prototype demonstration in a relevant environment. Typical Milestone B target.
Q: TRL 7
A: System prototype demonstration in an operational environment.
Q: TRL 9
A: Actual system proven through successful mission operations.
Q: How does low TRL affect cost risk and uncertainty?
A: Lower TRL means higher cost and schedule uncertainty and historically greater cost growth. Implies limited historical/parametric data (forcing reliance on weaker methods) and need for wider risk margins.
Q: Low TRL and cost estimation: what adjustment is appropriate?
A: Expect higher cost uncertainty; apply wider risk/confidence ranges; use analogy and expert judgment; allocate larger risk contingencies; avoid extrapolating parametric CERs.

## Validation and Sensitivity
Q: Purpose of sensitivity analysis
A: Identify which inputs and assumptions most affect the total estimate; inform risk management, data collection priorities, and program trades.
Q: What is a cross-check in cost estimating?
A: Comparing the estimate against independent data (parametric models, historical analogs, independent estimates, bottom-up rebuild) to verify reasonableness.
Q: When the estimate differs significantly from a cross-check, what should the estimator do?
A: Investigate and reconcile the difference. Differences in baseline, method, or data quality must be understood and documented so decision-makers know why estimates differ.
Q: Sanity check for a cost model
A: Does the total seem plausible? Do individual elements scale reasonably? Are there omissions or double-counts? Do costs trend sensibly with scale and design changes?
`
});
