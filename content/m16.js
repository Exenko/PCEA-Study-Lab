PCEA.addModule({
  id: 'm16', num: 16, title: 'Cost Management', short: 'Cost Management', source: 'guide',
  blurb: 'Treat cost as a design constraint, not just an outcome. TOC, CAIV, target costing, and ABC shape acquisition decisions.',
  intro: String.raw`**Cost management** is the active planning, estimating, and control of program cost across the entire life cycle — not just producing a point estimate, but using cost information as a tool to influence design and acquisition decisions.

**The shift**: Historically, cost was a *dependent variable* — an outcome of performance and schedule decisions made elsewhere. Modern cost management treats cost as an *independent variable* — a constraint that requirements, design, and performance must fit within.

**Why it matters**: Most life-cycle cost is **locked in early** by design decisions, even though most money hasn't been spent yet. The greatest leverage to influence cost comes during concept and design, not after. This module covers the frameworks that enable that influence: Total Ownership Cost (TOC), Cost As an Independent Variable (CAIV), Target Costing, and Activity-Based Costing (ABC).`,
  sections: [
    {
      id: 'definition', title: 'Definition and objectives', summary: 'What cost management does',
      body: String.raw`**Cost management** is the set of processes and practices used to plan, estimate, budget, monitor, control, and reduce the costs of a program or system across its life, with the goal of ensuring cost is consistent with program objectives and available resources.

Key characteristics:
- **Proactive, not reactive**: Seeks to influence cost outcomes through design and requirements trades, not just report cost after the fact.
- **Life-cycle scope**: Considers cost from concept through disposal, not just development or procurement.
- **Cross-functional**: Requires collaboration between cost estimators, program managers, engineers, and logisticians.
- **Continuous**: Occurs throughout acquisition, with the greatest leverage early (concept and design), when most life-cycle cost is locked in but hasn't yet been spent.

+++

### Objectives

The general objectives of cost management are to:

1. **Improve cost realism and visibility** — ensure decision-makers understand the full cost consequences of design and acquisition choices, including downstream O&S costs.
2. **Constrain cost growth** — establish cost as a binding requirement alongside performance, schedule, and technical requirements.
3. **Identify and reduce cost drivers** — use techniques like ABC to pinpoint which activities and resources actually consume cost.
4. **Support trade-off decisions** — provide cost information for trading performance, schedule, and cost against one another.
5. **Reduce Total Ownership Cost** — extend cost consciousness beyond acquisition into operating and support, where the majority of life-cycle cost typically resides.

:::key
Most life cycle cost is **locked in early** by design decisions, even though little money has been spent yet. The biggest opportunity to manage cost comes during concept and design.
:::

:::check
Q: When is the greatest opportunity to influence a system's life cycle cost?
* Early, during concept and design decisions
- During full-rate production
- During disposal and sustainment
> Early design choices commit most of the LCC before most money is spent. The "locked in vs. spent" principle drives cost management strategy.
:::

+++

### Locked-in vs. spent cost

By the end of design, a large majority of life-cycle cost is already determined (locked in) by design decisions, even though only a small fraction has actually been expended. This is the central justification for CAIV and target costing: influence cost early, while flexibility still exists, rather than trying to cut cost late in production or sustainment when options are limited.

:::check
Q: True or false: Most of a system's total life-cycle cost is spent during the design and development phase.
- True
* False
> Most LCC is *locked in* during design, but most money is actually *spent* during production and O&S. This distinction drives the need for early cost management.
:::

:::challenge lockin x=5
Q: Scrub along the life cycle to where the gap between **committed** and **spent** cost is largest (at least 80 percentage points).
goal: gap >= 0.8
show: x=35
> On this illustrative curve the gap peaks around the end of design: about 90% of life-cycle cost is committed while only about 10% has been spent. After that, spending catches up, but the decisions have already been made.
:::

:::challenge lockin x=35 lock=x
Q: At the end of design, which statement matches the "locked in vs. spent" principle?
* Most life-cycle cost is committed, but little has been spent
- Most life-cycle cost has been spent, with little left to commit
- Committed and spent cost rise together
> Design decisions lock in most future cost long before the money is spent. That's why CAIV and target costing push cost management early, while there is still flexibility.
:::`
    },
    {
      id: 'lcc-toc', title: 'Life Cycle Cost and Total Ownership Cost', summary: 'The four phases, TOC, and linked indirect costs',
      body: String.raw`### Life Cycle Cost (LCC)

**Life Cycle Cost (LCC)** is the total cost to the government of a program over its full life, from concept through disposal, directly attributable to that program.

| Phase | Description | Relative Size |
|---|---|---|
| **R&D** (RDT&E) | Concept, design, development, test and evaluation | Small share of LCC, but locks in most future cost |
| **Procurement/Investment** | Production and fielding, initial spares, facilities, initial training | Significant near-term outlay, often gets most attention |
| **Operating & Support (O&S)** | Sustainment: maintenance, spares, personnel, fuel/consumables, support equipment over life | **Typically the largest single phase** |
| **Disposal** | End-of-life, demilitarization, environmental remediation | Generally small, except for hazardous systems |

:::tip
**Key insight for the exam**: O&S is generally the largest single component of LCC. Ignoring O&S while focusing only on R&D/procurement cost misses the majority of total cost.
:::

+++

### Total Ownership Cost (TOC)

**TOC** is the full cost to the owning organization of a system across its entire life: LCC *plus* other infrastructure or business-process costs that are indirectly related and support the program but are not typically captured within the program's own LCC estimate.

$$\text{TOC} = \text{LCC} + \text{linked indirect costs}$$

**TOC is a superset of LCC** — every LCC is part of TOC, but TOC includes additional indirect/infrastructure costs not charged directly to the program.

+++

### Linked Indirect Costs

**Linked indirect costs** are costs causally connected to a program but not captured in its direct LCC estimate — they are "linked" because a change in the program causes a change in these costs, even though they are budgeted elsewhere.

Examples:
- Incremental depot/repair infrastructure required to support a new system
- Base operating support or training infrastructure driven by fielding a new system
- Infrastructure costs shared across programs, where only the *marginal* increment is linked to this program

:::check
Q: What does TOC add to LCC?
* Linked indirect costs (supporting infrastructure attributable to the system)
- Sunk costs and contractor profit
- Inflation adjustment
> TOC = LCC + linked indirect costs. These are infrastructure costs outside the program budget but causally driven by the program's existence.
:::

:::check
Q: A design option costs 5% more to procure but cuts annual maintenance by 30% over a 30-year operational life. To decide between options, you should compare…
* Life cycle (or total ownership) cost of both options, discounted
- Only unit procurement price
- Only the maintenance hours
> The cheapest purchase can be the most expensive to own. CAIV and TOC reduction both require considering the full life-cycle consequences.
:::`
    },
    {
      id: 'reducing-toc', title: 'Reducing Total Ownership Cost', summary: 'Strategies and design approaches',
      body: String.raw`Because O&S and infrastructure costs dominate TOC, and because most life-cycle cost is locked in during design, TOC reduction efforts focus on strategies that address cost drivers early:

### Design for supportability

**Reliability and maintainability** improvements reduce downstream O&S cost:
- Fewer failures → less maintenance manpower and spares
- Simpler systems → faster repairs, lower skill requirements
- Built-in test and diagnostics → reduced troubleshooting time

### Commonality and standardization

Using common parts, subsystems, or standards across programs reduces the indirect infrastructure burden:
- Shared spares inventories across multiple programs
- Unified training curricula and support equipment
- Economies in procurement, logistics, and supply management

### Open architectures

Modular, open designs reduce upgrade and obsolescence costs:
- Easier to replace outdated subsystems
- Reduced supplier lock-in
- Supports competitive sourcing

### Reducing logistics footprint

Fewer support personnel, less support equipment, and streamlined supply chains directly cut O&S cost. Engineering for ease of supply is a cost-reduction technique.

### Early trade-off analysis

Evaluating TOC (not just acquisition cost) when making design and acquisition decisions ensures a cheaper up-front design that is more expensive to own is not chosen without full visibility.

+++

:::key
**High-leverage point**: Because R&D/design decisions lock in the largest share of downstream TOC, the highest-leverage point to reduce TOC is early in the program, not after the design is fixed.
:::

:::check
Q: Which of the following is a TOC reduction strategy most applicable during the design phase?
* Designing for reliability and maintainability
- Eliminating all spares inventory
- Accelerating the production schedule
> Reliability/maintainability improvements during design reduce future O&S cost. Most LCC is locked in early, so design phase is high-leverage.
:::`
    },
    {
      id: 'caiv', title: 'Cost As an Independent Variable', summary: 'Cost as a design constraint',
      body: String.raw`**Cost As an Independent Variable (CAIV)** is a management philosophy in which cost is treated as a **design constraint** on equal footing with performance, schedule, and technical requirements — rather than as an output that is simply measured after requirements and design are fixed.

### Traditional vs. CAIV approach

| | **Traditional** | **CAIV** |
|---|---|---|
| Flow | Define requirements → Design → Measure cost | Define affordable cost → Trade requirements/performance to fit cost |
| Cost role | **Dependent variable** (output) | **Independent variable** (input/constraint) |
| Driver | Requirements/schedule determine cost | Budget/affordability determines design space |
| Trade space | None; cost floats | Deliberately manage trade space among cost, schedule, performance |

+++

### Implementing CAIV

Under CAIV:
1. **Set cost objective early**, often based on affordability (what the customer can actually fund).
2. **Identify cost drivers** — which requirements, design choices, or schedule decisions have the largest cost impact.
3. **Create a trade space** — the range of requirements, design options, and schedule choices that can be adjusted to keep the program within cost objective.
4. **Trade deliberately** — with full cost/benefit visibility, rather than by accident.

**CAIV requires cost estimating to be integrated into requirements-setting and design activities from the start**, reinforcing the importance of early engagement by cost estimators (Module 2).

:::key
CAIV **reverses the traditional sequence**: instead of "define requirements → design → determine cost," CAIV asks "define affordable cost → determine what requirements/performance can be achieved within that cost."
:::

:::check
Q: What best describes CAIV?
* Setting cost objectives up front and trading performance and schedule to meet them
- Minimizing cost regardless of performance
- Letting cost vary independently of all other factors
> CAIV treats cost as a controlled input that shapes design. "Independent variable" means cost is a constraint on decisions, not an output.
:::

+++

:::check
Q: Under CAIV, which of the following must the cost estimator do?
- Provide only a final cost estimate after design is complete
* Engage early and continuously in requirements and design decisions to support cost-trade studies
- Focus solely on minimizing the development budget
> CAIV requires estimators to be involved early, not at the end. Cost is a design parameter, not a post-hoc measurement.
:::`
    },
    {
      id: 'target-costing', title: 'Target Costing', summary: 'Market-driven cost, price, and profit',
      body: String.raw`**Target Costing** is a cost management technique, originating in commercial manufacturing, in which the allowable ("target") cost of a product is derived by starting from the price the market will bear and the profit margin required, then working backward to determine what the product must cost to produce.

### Core formula

$$\text{Target Cost} = \text{Target Price} - \text{Target Profit}$$

- **Target Price**: The price the market is willing/expected to pay, from competitive analysis or customer affordability.
- **Target Profit**: The profit margin required by policy or investor requirements, often expressed as a percentage of price.
- **Target Cost**: The residual — what the product must be designed and produced for.

### Contrast: cost-plus pricing

Traditional **cost-plus pricing** works differently:

$$\text{Price} = \text{Cost} + \text{Profit}$$

Cost is determined first (by engineering/production), and price/profit follow. Target costing inverts this logic: price and profit are bounded first, and cost becomes the variable to be managed down.

+++

### Worked example

A company wants to introduce a new product. Market research indicates customers will pay \$250 per unit. Company policy requires 20% profit margin on price.

$$\text{Target Profit} = 0.20 \times \$250 = \$50$$
$$\text{Target Cost} = \$250 - \$50 = \$200$$

If the engineering team's current design would cost \$230 to produce, there is a **\$30 cost gap** that must be closed — through design changes, process improvement, value engineering, or sourcing changes — before production begins.

:::check
Q: Market research says customers will pay \$500 per unit, and the company requires a 20% profit margin on price. What is the target cost?
= 400
> Target Profit = $0.20 \times \$500 = \$100$. Target Cost = $\$500 - \$100 = \$400$.
:::

+++

### Relationship to CAIV

Target costing is the commercial-sector analog of CAIV — both set a cost constraint early and manage design to fit within it. The key difference is that target costing derives the constraint from market price and required profit, while CAIV typically derives the constraint from program affordability/budget realities.

:::tip
Both target costing and CAIV require **value engineering** and cross-functional collaboration to identify design changes, process improvements, or scope adjustments that close the cost gap without sacrificing essential value.
:::`
    },
    {
      id: 'abc-fundamentals', title: 'Activity-Based Costing: Fundamentals', summary: 'Definitions and the cost-driver flow',
      body: String.raw`**Activity-Based Costing (ABC)** is a costing methodology that assigns overhead and indirect costs to products, services, or other cost objects based on the **activities** that actually consume resources to produce them, rather than allocating overhead using a single volume-based measure.

### Key definitions

- **Resources**: The inputs consumed by an organization (labor, equipment, utilities, facilities) that generate cost.
- **Activities**: The work performed within an organization (e.g., machine setup, purchasing, inspection, material handling) that consumes resources.
- **Cost Objects**: The end items to which cost is ultimately assigned — products, services, customers, or contracts.
- **Cost Drivers**: The factors that cause the cost of an activity to increase or decrease (e.g., number of setups, number of purchase orders, number of inspections). Cost drivers are used to assign activity costs to cost objects in proportion to each cost object's actual consumption of that activity.
- **Cost Pools**: Groupings of costs associated with a particular activity, accumulated before being allocated to cost objects using the relevant cost driver.

+++

### The ABC flow

$$\textbf{Resources} \rightarrow \textbf{Activities} \rightarrow \textbf{Cost Objects}$$

Resources are consumed by activities (traced via **resource drivers**); activities are consumed by cost objects (traced via **activity/cost drivers**).

**Example**: A factory spends \$100,000 on setup labor per year. That's a *resource*. The setup activity consumes the labor. Individual products (cost objects) consume setups at different rates (the *activity driver*). ABC traces the \$100,000 to each product based on how many setups it requires.

+++

### Activity-Based Management (ABM)

**ABM** is the use of ABC information not just for costing products, but for actively **managing** the organization — improving processes, eliminating non-value-added activities, and making better strategic decisions. ABC provides the cost visibility; ABM is the action taken using that visibility.

:::check
Q: In the ABC chain Resources → Activities → Cost Objects, what links activity costs to products?
- Resource drivers
* Activity (cost) drivers
- Direct labor hours only
> Resource drivers assign resources to activities; activity drivers (cost drivers) assign activities to cost objects based on actual consumption.
:::`
    },
    {
      id: 'abc-allocation', title: 'Why ABC: The allocation problem', summary: 'Volume-based distortion and worked example',
      body: String.raw`### The problem: traditional volume-based allocation

Traditional overhead allocation assigns indirect/overhead costs to products using a **single, often volume-based allocation base** — commonly direct labor hours, machine hours, or units produced — applied at one uniform overhead rate.

**When products differ significantly in complexity, batch size, or support activities (setups, inspections, engineering changes)**, a single volume-based driver **distorts** the true cost of each product:

- **High-volume, simple products** tend to be **over-costed** (absorb more overhead than they actually cause)
- **Low-volume, complex/specialty products** tend to be **under-costed** (absorb less overhead than they actually cause), because they consume disproportionate amounts of support activity

This can lead to bad pricing, product-mix, and investment decisions because product profitability appears reversed from reality.

+++

### Worked example: traditional vs. ABC

A company makes two products:

| Product | Units/Year | Setups/Year | DL Hours |
|---|---|---|---|
| **A** (high volume, simple) | 8,000 | 2 | 8,000 |
| **B** (low volume, complex) | 2,000 | 18 | 2,000 |
| **Total** | 10,000 | 20 | 10,000 |

Total setup overhead cost pool: **\$100,000/year**

#### Traditional allocation (using direct labor hours as the base)

$$\text{Overhead rate} = \frac{\$100{,}000}{10{,}000 \text{ hrs}} = \$10/\text{hr}$$

- Product A: $8,000 \text{ hrs} \times \$10 = \$80,000 \rightarrow \$10.00/\text{unit}$
- Product B: $2,000 \text{ hrs} \times \$10 = \$20,000 \rightarrow \$10.00/\text{unit}$

Both products absorb the same \$10.00/unit overhead, implying setups cost the two products equally per unit — which is false.

#### ABC allocation (using number of setups as the cost driver)

$$\text{Cost per setup} = \frac{\$100{,}000}{20 \text{ setups}} = \$5{,}000/\text{setup}$$

- Product A: $2 \text{ setups} \times \$5{,}000 = \$10,000 \rightarrow \$1.25/\text{unit}$
- Product B: $18 \text{ setups} \times \$5{,}000 = \$90,000 \rightarrow \$45.00/\text{unit}$

+++

### Comparison and impact

| Product | Traditional | ABC | Over/Under |
|---|---|---|---|
| A (high volume, simple) | \$10.00/unit | \$1.25/unit | **Over-costed** by 700% |
| B (low volume, complex) | \$10.00/unit | \$45.00/unit | **Under-costed** by 78% |

**Interpretation**: Traditional allocation masked the fact that Product B drives 90% of setup activity and cost. Product B appears far more profitable (and Product A less profitable) than it actually is under traditional costing — this can distort pricing and product-mix decisions. ABC reveals the true relationship.

:::check
Q: A factory allocates \$60K of inspection overhead using direct labor hours. Product X uses 3,000 DL hours and requires 4 inspections; Product Y uses 3,000 DL hours and requires 36 inspections (40 total). Under ABC, what is the cost per inspection (in dollars)?
= 1500
> Rate = \$60,000 / 40 inspections = \$1{,}500/inspection. Product X: $4 \times \$1{,}500 = \$6{,}000$; Product Y: $36 \times \$1{,}500 = \$54{,}000$.
:::`
    },
    {
      id: 'abc-estimating', title: 'ABC and cost estimating', summary: 'Better data, driver identification, and trade studies',
      body: String.raw`For a cost estimator, ABC/M is relevant in several ways:

### Better historical cost data

ABC-derived costs more accurately reflect the true cost of activities and products. This improves the quality of historical data used to build Cost Estimating Relationships (CERs, Module 9).

**Problem**: Traditional volume-allocated overhead can distort historical unit costs. If you use distorted historical data to build a CER, the resulting regression will carry the distortion forward into future estimates.

**Solution**: ABC produces historical costs that more accurately reflect true resource consumption by cost driver, giving estimators cleaner, more defensible historical data.

+++

### Identifying true cost drivers

ABC's focus on cost drivers directly parallels the cost estimator's search for independent variables in regression-based CER development (Module 8). Both disciplines ask: **"What factors actually explain/cause this cost to vary?"**

A cost estimator might discover through ABC analysis that:
- Number of engineering changes, not labor hours, best explains engineering cost variation
- Number of parts or configurations, not production volume, drives assembly cost
- Support personnel requirements scale with maintenance visits, not operational hours

These insights lead to more accurate CERs.

+++

### Supporting CAIV and target costing trade studies

Understanding which activities drive cost lets estimators and engineers evaluate design/process trade-offs with better insight into which changes will actually reduce cost. If you know that setup activity drives 80% of overhead, reducing setups is a high-leverage target; if direct labor drives cost, process automation is the lever.

### Improved indirect cost estimates

ABC ties overhead to activities and drivers rather than a flat volume-based rate, supporting more defensible estimates of how indirect/overhead costs will change as production volume, product mix, or complexity changes — an important input to estimating linked indirect costs and TOC.

+++

:::warn
**Caution**: ABC/M is a **costing and management technique, not itself a forecasting method**. It explains historical/current cost causality; CERs or other estimating relationships are still needed to project ABC-informed costs into the future.
:::

:::check
Q: How can ABC improve a cost estimator's historical cost data used for CER development?
- It replaces the need for CERs entirely
* It removes distortions from volume-based allocation, providing cleaner historical unit costs and better insight into true cost drivers
- It is a forecasting method that predicts future costs directly
> ABC reveals how overhead is actually caused/consumed, not how traditional accounting allocates it. This gives estimators better baseline data and better driver identification for CERs.
:::`
    }
  ],
  cards: String.raw`
## Fundamentals
Q: Cost management (definition)
A: Planning, estimating, budgeting, monitoring, controlling, and reducing costs across the life cycle to deliver capability affordably.
Q: Traditional cost role vs. CAIV
A: Traditional: cost is a dependent variable (output of design). CAIV: cost is an independent variable (input/design constraint).
Q: When is most life-cycle cost committed?
A: Early, during concept and design decisions, before most money is spent. ("Locked in vs. spent" principle.)
Q: Key characteristics of cost management
A: Proactive (not reactive), life-cycle scope, cross-functional, continuous (greatest leverage early).
Q: Objectives of cost management (list 2)
A: Improve cost visibility; constrain cost growth; identify and reduce cost drivers; support trade-offs; reduce TOC.

## Life Cycle Cost and TOC
Q: Life Cycle Cost (LCC) definition
A: Total cost to the government of a program from concept through disposal, directly attributable to that program.
Q: Four phases of LCC in order
A: Research & Development → Procurement/Investment → Operating & Support (O&S) → Disposal
Q: Which LCC phase is typically the largest?
A: Operating & Support (O&S); often the majority of total LCC.
Q: Total Ownership Cost (TOC) definition
A: LCC plus linked indirect/infrastructure costs not charged directly to the program. TOC ⊇ LCC.
Q: Examples of linked indirect costs
A: Incremental depot/repair infrastructure, base operating support, training infrastructure, shared institutional costs.
Q: Why is the TOC/LCC distinction important?
A: Focusing only on procurement cost while ignoring O&S and linked indirect costs misses the majority of total cost to the enterprise.
Q: O&S cost examples
A: Maintenance, spares, personnel (manning), fuel/consumables, support equipment, logistics over the operational life.

## TOC Reduction
Q: What types of design decisions reduce TOC during design phase?
A: Design for reliability/maintainability, commonality/standardization, open architectures, reduced logistics footprint.
Q: How does reliability improvement reduce TOC?
A: Fewer failures → less maintenance manpower and spares → lower O&S cost.
Q: Why does commonality reduce TOC?
A: Shared spares, training, support equipment across programs reduces indirect infrastructure burden.
Q: Where is the highest-leverage point to reduce TOC?
A: Early in the program during design phase, because most LCC is locked in then and flexibility remains.

## CAIV
Q: CAIV definition
A: Cost As an Independent Variable: cost is treated as a design constraint on equal footing with performance/schedule.
Q: CAIV flow vs. traditional flow
A: CAIV: define affordable cost → determine what requirements/performance fit within it. Traditional: define requirements → design → measure cost.
Q: How does CAIV create a trade space?
A: By identifying which requirements and design choices have the largest cost impact, estimators can deliberately adjust them to fit the cost objective.
Q: Why must cost estimators engage early in CAIV?
A: Because cost is a design parameter, not a post-hoc measurement. Estimators must support requirements-setting and design decisions from the start.
Q: Example CAIV decision
A: If a performance requirement costs \$5M extra but adds minimal user value, CAIV trades it off (relaxes requirement) to stay within affordable cost.

## Target Costing
Q: Target costing formula
A: Target Cost = Target Price − Target Profit
Q: Target costing vs. cost-plus pricing
A: Target costing: price and profit are fixed, cost is variable. Cost-plus: cost is determined first, price/profit follow.
Q: What is the "target cost gap"?
A: The difference between the engineering team's current design cost and the allowable target cost; must be closed via design/process changes.
Q: How is target price determined in target costing?
A: From competitive analysis, market research, or customer affordability constraints.
Q: Market price \$250, required profit 20% on price: target cost?
A: \$200. (Profit = \$250 × 0.20 = \$50; Cost = \$250 − \$50 = \$200.)
Q: Relationship: target costing and CAIV
A: Both set a cost constraint early and manage design to fit. Difference: target costing derives constraint from market price/profit; CAIV from affordability/budget.
Q: Tools used in target costing
A: Value engineering, cross-functional teams, design changes, process improvement, sourcing changes.

## ABC Fundamentals
Q: Activity-Based Costing (ABC) definition
A: Methodology that assigns overhead to products based on the activities that consume resources, not on a single volume-based rate.
Q: ABC chain
A: Resources → Activities → Cost Objects
Q: Resource driver
A: Measure used to assign resource costs to activities (e.g., % of time/equipment/space used by each activity).
Q: Activity (cost) driver
A: Measure of how much of an activity a cost object uses; used to allocate activity costs to cost objects (e.g., number of setups, inspections).
Q: Cost pool
A: Accumulated cost associated with a particular activity, gathered before being allocated to cost objects.
Q: Activity-Based Management (ABM)
A: Use of ABC data to actively manage and improve operations (eliminate non-value-added activities, reduce driver volumes, make strategic decisions).

## ABC vs. Traditional Allocation
Q: Problem with traditional volume-based overhead allocation
A: Single rate (e.g., per DL hour) distorts costs when products differ in complexity/batch size; high-volume simple products get over-costed, low-volume complex get under-costed.
Q: Why does traditional allocation over-cost high-volume simple products?
A: They don't consume much support activity (setups, inspections) per unit, but the single volume rate spreads overhead evenly, overstating their burden.
Q: Why does traditional allocation under-cost low-volume complex products?
A: They consume disproportionate support activity per unit, but the single volume rate doesn't capture that; actual cost appears lower than reality.
Q: ABC worked example: setup costs \$100K for 20 setups. Product A (2 setups), Product B (18 setups). ABC cost per setup?
A: \$5,000/setup
Q: Same example: Product A (8,000 units) ABC overhead cost total, and per unit?
A: Total \$10,000; per unit \$1.25
Q: Same example: Product B (2,000 units) ABC overhead cost total, and per unit?
A: Total \$90,000; per unit \$45.00
Q: Impact of using traditional allocation for this example
A: Product A appears to cost \$10.00/unit overhead (over-costed 700%); Product B costs \$10.00/unit (under-costed 78%). Profitability appears reversed.

## ABC and Estimating
Q: How does ABC improve historical cost data for CER development?
A: Removes distortions from volume-based allocation; provides cleaner historical unit costs and better driver identification.
Q: What is the parallel between ABC and CER development?
A: Both seek to identify true cost drivers: ABC identifies what activities drive cost; CER development identifies what variables explain cost variation.
Q: Is ABC itself a forecasting method?
A: No. ABC explains historical/current cost causality. CERs and other estimating methods are still needed to project costs into the future.
Q: How does ABC help with CAIV trade studies?
A: By identifying which activities consume cost, estimators can advise which design/process changes will actually reduce cost (high-leverage targets).
Q: Role of ABC in estimating linked indirect costs
A: ABC ties overhead to activities/drivers; supports defensible estimates of how indirect costs change with volume, product mix, or complexity changes.

## Industry Insight
Q: High-leverage TOC reduction target
A: Activities and requirements that consume disproportionate cost relative to value added; identified via ABC and cost driver analysis.
Q: Why are CAIV and target costing important?
A: Both reverse traditional flow by constraining cost early, when design flexibility remains. Late cost cuts have little leverage.
Q: Trade space in CAIV
A: The range of requirements, design options, and schedule choices that can be adjusted to keep the program within cost objective.
Q: Market-driven vs. budget-driven cost constraint
A: Target costing: market price and required profit set the cost. CAIV: program affordability/budget sets the cost. Both are cost constraints that shape design.
`
});
