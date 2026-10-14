PCEA.addModule({
  id: 'm16', num: 16, title: 'Cost Management', short: 'Cost Management', source: 'guide',
  blurb: 'Treat cost as a design constraint, not just an outcome. TOC, CAIV, target costing, and ABC shape acquisition decisions.',
  intro: String.raw`**Cost management** is the planning, controlling, motivating, and evaluating of products, processes, and personnel involved with system/product development from a cost perspective. It helps organizations produce profitable, functional products while maintaining a competitive advantage in cost, quality, functionality, and timeliness.

**The shift**: Historically, cost was a *dependent variable* — an outcome of performance and schedule decisions made elsewhere. Modern cost management treats cost as an *independent variable* — a constraint that requirements, design, and performance must fit within.

**Why it matters**: The greatest program-management leverage over Life Cycle Cost (LCC) occurs **early** in a program, because opportunities to avoid cost evaporate disproportionately faster than expenditures accumulate. This module covers the frameworks that exploit that leverage: Total Ownership Cost (TOC), Cost As an Independent Variable (CAIV), Target Costing, and Activity-Based Costing (ABC).`,
  sections: [
    {
      id: 'definition', title: 'Definition and objectives', summary: 'What cost management does',
      body: String.raw`:::primer:::
Cost can be attacked at every stage of a system's life, but the lever changes from phase to phase.

:::sort
Q: Which life-cycle phase does each cost-reduction approach mainly target?
buckets: R&D | Production | O&S
- Analysis of design alternatives = R&D
- Development trade-offs and process improvements = Production
- Design For Manufacturability and Assembly (DFMA) = Production
- A more intensive cost-of-ownership analysis = O&S
- Concurrent Engineering and Supportability Analysis (CESA) = O&S
> R&D cost is reduced through analysis of design alternatives. Production cost is addressed through development trade-offs and process improvements, including DFMA. O&S is reduced through more intensive cost-of-ownership analysis, made more visible by approaches like CESA.
:::

+++

**Cost management** is the planning, controlling, motivating, and evaluating of products, processes, and personnel involved with system/product development from a cost perspective. It identifies the cost of resources consumed in performing significant activities, determines the efficiency and effectiveness of those activities, and evaluates new activities that can improve future performance.

CEBoK deliberately avoids the term **"cost control"** — it implies costs can be managed by sheer force of will. Instead, management decisions alter the program's course of action in a meaningful way. Cost estimators are vital participants throughout the program life cycle.

### Three ways to reduce cost

1. **Technology** — technological improvements can reduce cost while maintaining or even increasing performance.
2. **Trade-offs** — more often, programs must give something up (performance, scope) to reduce cost.
3. **Re-work requirements with design** — redesign to do it differently and meet the customer's needs at a substantially lower cost.

+++

### Balancing cost and performance

Cost management requires balancing the trade-off between cost and performance. The analyst must capture, for each design alternative:

- **Performance Estimating Relationships (PERs)** — cost-based relationships tied to performance.
- **Summary performance metrics**, e.g. **utility scores**, for each design alternative.
- The **exchange rate** — how much cost the decision maker must trade to achieve a unit increase in performance, or vice versa.

These metrics are bounded by official **thresholds** and **objective values** for performance and cost, used to maximize performance and minimize cost.

:::key
Cost management's greatest leverage over LCC occurs **early** in a program: opportunities to avoid cost evaporate disproportionately faster than expenditures accumulate.
:::

:::check
Q: Why does CEBoK avoid the term "cost control"?
* It implies costs can be managed by sheer force of will, rather than through meaningful management decisions
- It is a term reserved only for commercial industry
- Cost control refers only to disposal-phase costs
> "Cost control" wrongly suggests willpower alone changes outcomes. Real cost management works by altering the program's actual course of action.
:::

:::check
Q: What are the three general ways to reduce cost described in CEBoK?
* Apply new technology; trade off performance/scope; re-work requirements in conjunction with design
- Cut testing, cut documentation, cut training
- Increase schedule, increase scope, increase headcount
> Technology can reduce cost while holding performance; trade-offs give something up; re-working requirements with design meets the need a different, cheaper way.
:::

:::check
Q: In cost/performance trade-off analysis, what does the "exchange rate" represent?
* How much cost must be traded to achieve a unit increase in performance, or vice versa
- The currency conversion used for foreign military sales
- The interest rate applied to escalation
> The exchange rate quantifies the cost-performance trade, alongside PERs and utility scores, bounded by thresholds and objectives.
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
:::

+++

### Objectives of cost management

Cost management assists effective, rational managerial decision making by ensuring LCCs are adequately considered in program decisions — design, budget (program justification), and investment decisions (cost/benefit analyses, etc.). Managers need routine, timely visibility into costs, and individuals throughout the organization should understand cost drivers and how decisions impact cost.

**The ultimate goal of cost management is to achieve system and program affordability.**

Cost management spans the life cycle:
- **R&D** — reduced through analysis of design alternatives.
- **Production** — reduced through development trade-offs and process improvements.
- **Operations and Support (O&S)** — reduced by supporting a more intensive cost-of-ownership analysis.

### Product cost vs. process cost (Fig. 16.1)

Cost management targets both **product costs** (the cost of system design — hardware and/or software) and **process costs** (business, engineering, design, and support processes), across all four life-cycle phases (R&D, Production, O&S, and Disposal).

- R&D cost reductions come from more efficient application of new technology — though incremental R&D *investment* may be required to achieve overall LCC savings.
- Production cost is customarily addressed through development trade-offs, but production-process improvements, **Design For Manufacturability and Assembly (DFMA)**, EVM, and risk management best achieve savings.
- O&S trade-offs are made more visible through approaches like **Concurrent Engineering and Supportability Analysis (CESA)**; new technology and process efficiencies can still reduce cost later, though opportunities diminish over time.
- **Disposal** costs, though sometimes lumped into O&S, matter increasingly — eco-friendly materials and early planning for deactivation, demilitarization, and disposal reduce them.

{{primer}}

### How to make things cheaper

Programs emphasize minimizing production cost but struggle to find practical strategies, since a solution often costs performance. Example approaches (all with an undesirable effect on performance if used alone):

- **Producing less**
- **Reducing scope**
- **Allocating fewer resources**

**Lean and Six Sigma** approach cost management differently — executing a project in a more disciplined, methodical manner to find efficiencies, though these are difficult to achieve, especially later in the development life cycle. Deploying process improvements or new development techniques to retain performance, scope, and schedule at lower cost requires innovation; organizations that devote larger budgets and effort to R&D are more successful at it.

:::check
Q: Which of these directly reduces performance if used alone to cut production cost?
* Producing less, reducing scope, or allocating fewer resources
- Applying Lean/Six Sigma
- Investing more in R&D
> CEBoK notes producing less, reducing scope, and allocating fewer resources all have an undesirable effect on performance — unlike process-improvement approaches.
:::

:::check
Q: Cost management addresses both product cost and process cost (Fig. 16.1). Which best describes "process cost"?
* Cost of business, engineering, design, and support processes
- Cost of the hardware/software design itself
- Cost of disposal only
> Product cost is the cost of the system design (hardware/software); process cost is the cost of the processes (business, engineering, design, support) used to produce and support it.
:::`
    },
    {
      id: 'lcc-toc', title: 'Total Ownership Cost and Life Cycle Cost', summary: 'Two perspectives on total cost',
      body: String.raw`:::primer:::
Total ownership cost can be viewed from the whole organization or from a single program, and the two views are not the same size.

:::sort
Q: Which view does each description belong to?
buckets: Big TOC | Little TOC
- The organizational perspective = Big TOC
- Includes the costs to recruit, train, and retain military and civilian personnel = Big TOC
- Includes all other costs of business operations of the DoD = Big TOC
- The program-level perspective = Little TOC
- Also called Defense Systems TOC = Little TOC
> Big TOC is the organizational DoD perspective, covering personnel and all other business-operations costs. Little TOC, or Defense Systems TOC, is the program-level subset for defense systems.
:::

+++

Managing and reducing *all* cost, not just a portion, requires two perspectives: the **organizational perspective** and the **program/project perspective**.

### DoD Total Ownership Cost (Big TOC)

The organizational perspective is **DoD Total Ownership Cost (DoD TOC)**, defined as:

> "...the sum of all financial resources necessary to organize, equip, train, sustain, and operate military forces sufficient to meet national goals in compliance with all laws, all policies applicable to DoD, all standards in effect for readiness, safety, and quality of life, and all other official measures of performance for DoD and its Components. DoD TOC is comprised of costs to research, develop, acquire, own, operate, and dispose of weapon and support systems, other equipment and real property, the costs to recruit, train, retain, separate and otherwise support military and civilian personnel, and all other costs of business operations of the DoD."

Analysts call this **Big TOC**, to distinguish it from the program-level perspective, **Little TOC** (Defense Systems TOC). Industry commonly uses the analogous term **Total Cost of Ownership (TCO)**, especially for IT systems.

+++

### Little TOC = Life Cycle Cost (LCC)

The program-level subset of DoD TOC for defense systems is **Defense System TOC**, and it is defined as **LCC**. Per **DoD 5000.4-M**, LCC includes not only acquisition-program **direct costs** but also the **indirect costs attributable to the acquisition program** — i.e., costs that would not occur if the program did not exist.

LCC estimates span the entire life cycle: R&D, production, O&S, and disposal. Commercial definitions are similar. Life cycle is often confused with just O&S, but the **Life Cycle Cost Estimate (LCCE)** covers **all costs associated with the program for its complete life cycle, regardless of funding source**.

Analysts must keep **both** TOC perspectives in mind: most TOC reduction efforts are worked at the program/project level, but analysts must avoid program/project decisions that fail to reduce overall TOC, or that increase it.

{{primer}}

:::key
**Little TOC (Defense Systems TOC) = LCC.** "Big TOC" is the organization-wide DoD perspective. LCC already includes both direct costs and the indirect costs attributable to the program — not "LCC plus something extra."
:::

:::check
Q: How does CEBoK define the relationship between TOC and LCC for a defense system?
* Defense System TOC ("Little TOC") is defined as LCC — the program-level perspective on total ownership cost
- TOC = LCC plus unrelated organizational overhead with no causal link to the program
- LCC and TOC are unrelated terms from different modules
> "Little TOC," the program/project view, is defined as LCC. "Big TOC" is the separate, organization-wide DoD perspective.
:::

:::check
Q: Per DoD 5000.4-M, what does LCC include beyond direct program costs?
* Indirect costs attributable to the program — costs that would not occur if the program did not exist
- Only sunk costs already spent
- Costs of unrelated programs sharing the same budget line
> LCC already incorporates causally-linked indirect costs, in addition to direct acquisition costs.
:::

:::check
Q: What does the Life Cycle Cost Estimate (LCCE) cover, and what is it commonly confused with?
* All costs for the program's complete life cycle regardless of funding source; often confused with just the O&S estimate
- Only R&D and production costs; confused with the unit cost
- Only costs funded by the program office; confused with TOC
> LCCE spans the full life cycle regardless of who funds it. CEBoK notes it's often mistakenly equated with the O&S phase alone.
:::

+++

### Linked Indirect Costs

TOC comprises **direct costs** and **indirect costs**. Many indirect costs can only be considered at the organizational level, but those attributable to a specific program or project are **linked indirect costs**, included in the program's TOC perspective. They include the infrastructure that plans, manages, and executes a program, plus common support items and systems over its full life.

Examples: incremental depot/repair infrastructure for a new system; base operating support or training infrastructure driven by fielding a new system; the *marginal* increment of shared cross-program infrastructure attributable to this program.

:::check
Q: What are "linked indirect costs"?
* Indirect costs causally attributable to a specific program (e.g., support infrastructure it drives), even though budgeted elsewhere
- Direct labor charged straight to the program's contract
- Costs unrelated to any specific program
> Linked indirect costs are the indirect costs traceable to a program's existence — the piece of TOC an analyst can attribute to that program.
:::

:::tip Beyond CEBoK
The idea that O&S is "typically the largest phase" of LCC is common industry intuition but is **not asserted in this module's CEBoK text** — the source instead frames LCC around the TOC/LCC/LCCE distinctions above. Treat "O&S usually dominates LCC" as commonly true in practice, not as a quoted CEBoK fact for this module.
:::

:::widget toc-sorter:::`
    },
    {
      id: 'reducing-toc', title: 'Reducing Total Ownership Cost', summary: 'R-TOC process and managing costs early',
      body: String.raw`:::primer:::
A new system is still a blank sheet, while an old one has been fielded for years. Where would you expect cost to be easier to reduce?

:::sort
Q: Does each statement describe the early acquisition process or an old, fielded system?
buckets: Early in acquisition | Old fielded system
- Decisions have more effect on life-cycle cost = Early in acquisition
- Wise decisions reduce cost across all phases = Early in acquisition
- Most cost has already been designed in = Old fielded system
- Cost reduction is difficult = Old fielded system
> The best time to reduce TOC is early, because earlier decisions have more effect on life-cycle cost and, made wisely, reduce cost across all phases. With old systems most cost has already been designed in, making reduction difficult.
:::

+++

The overarching process for managing and reducing all life-cycle costs has been called, by various organizations, **Reducing TOC, Reduction of TOC, R-TOC, RTOC, TOC Reduction,** and **TOCR**. CEBoK uses the generic term **R-TOC**. Regardless of name, these processes address cost by changing *what* is acquired and *how* the system is acquired and operated.

### Why organizations adopt R-TOC

Best-practice organizations adopt sound management practices proactively, but many others adopt cost management only when facing a crisis:

- In **DoD**, the crisis is **affordability** — aging systems and rising O&S costs threaten funds needed for R&D and modernization.
- **Commercial** organizations face crises such as declining profitability and dwindling market share.

### R-TOC key steps

Organizations outline the R-TOC process differently, but key steps include:

1. **Establishing a cost baseline** to measure changes against.
2. **Setting cost reduction targets** to drive improvement.
3. **Developing initiatives** to lower costs.
4. **Rigorously assessing initiatives** and deciding which to fund.
5. **Tracking progress** toward cost reduction and other organizational goals using predefined metrics.

+++

### Manage costs early

The best time to reduce TOC is **early** in the acquisition process. Earlier decisions have more effect on life-cycle cost and, made wisely, reduce cost across all phases. With old systems, by contrast, most cost has already been designed in, making reduction difficult — the only opportunity for significant savings once a system is fielded is **modernization**.

Inserting new technology can lower TOC: new technology increases reliability, which decreases support costs. Process changes that improve support-process efficiency also lead to less costly maintenance and operating requirements.

The two primary methods for affecting cost early are **CAIV** (DoD) and **Target Costing** (commercial) — covered next.

{{primer}}

:::key
**High-leverage point**: Because R&D/design decisions lock in the largest share of downstream TOC, the highest-leverage point to reduce TOC is early in the program, before the design is fixed. Once a system is fielded, modernization is the only path to significant savings.
:::

:::check
Q: What are the five key R-TOC steps, in order?
* Establish a baseline; set targets; develop initiatives; assess and fund initiatives; track progress
- Design, build, test, field, dispose
- Estimate, budget, execute, audit, close out
> R-TOC: baseline -> targets -> initiatives -> assess/fund -> track progress against predefined metrics.
:::

:::check
Q: What commonly triggers an organization to adopt a cost-management/R-TOC approach, per CEBoK?
* A crisis — affordability pressure in DoD, or declining profitability/market share commercially
- A change in the fiscal year
- A new cost estimator joining the program office
> Best-practice organizations act proactively, but CEBoK notes many organizations adopt cost management in response to a crisis of some kind.
:::

:::check
Q: Once a system has already been fielded, what is generally the only remaining opportunity for significant TOC savings?
* Modernization (inserting new technology)
- Renegotiating the original R&D contract
- Reducing the disposal budget
> With old systems, most cost has already been designed in; only modernization (new technology, improved reliability) offers significant remaining savings.
:::

:::tip Beyond CEBoK
Figures 16.2 (a NAVSEA ship TOC decomposition chart) and 16.3 (an F/A-22 TOC decomposition chart) are real-program illustrations CEBoK uses to show how TOC breaks down by category for an actual system. No specific numbers from these charts are testable — the takeaway is simply that large defense programs decompose and track TOC by category.
:::`
    },
    {
      id: 'caiv', title: 'Cost As an Independent Variable', summary: 'Cost as a design constraint, and curves of equal preference',
      body: String.raw`:::primer:::
In traditional acquisition, cost is the thing you find out at the end.

:::order
Q: Put the traditional acquisition sequence in order.
1. Define requirements
2. Design
3. Measure cost
> Traditionally, requirements come first, then design, and cost is measured as an output. Cost is a dependent variable.
:::

+++

Reducing TOC requires a comprehensive process, **CAIV**, to anticipate and reduce cost throughout the life cycle, especially during development. **CAIV is the primary acquisition process and strategy for meeting requirements while reducing TOC.** CAIV is a DoD term; the analogous commercial process is **target costing** (next section).

### Traditional vs. CAIV approach

| | **Traditional** | **CAIV** |
|---|---|---|
| Flow | Define requirements -> Design -> Measure cost | Define affordable cost -> Trade requirements/performance to fit cost |
| Cost role | **Dependent variable** (output) | **Independent variable** (input/constraint) |
| Driver | Requirements/schedule determine cost | Budget/affordability determines design space |
| Trade space | None; cost floats | Deliberately manage trade space among cost, schedule, performance |

:::key
CAIV **reverses the traditional sequence**: instead of "define requirements -> design -> determine cost," CAIV asks "define affordable cost -> determine what requirements/performance can be achieved within that cost."
:::

{{primer}}

:::check
Q: What best describes CAIV?
* Setting cost objectives up front and trading performance and schedule to meet them
- Minimizing cost regardless of performance
- Letting cost vary independently of all other factors
> CAIV treats cost as a controlled input that shapes design. "Independent variable" means cost is a constraint on decisions, not an output.
:::

:::check
Q: Under CAIV, which of the following must the cost estimator do?
- Provide only a final cost estimate after design is complete
* Engage early and continuously in requirements and design decisions to support cost-trade studies
- Focus solely on minimizing the development budget
> CAIV requires estimators to be involved early, not at the end. Cost is a design parameter, not a post-hoc measurement.
:::

+++

### Beyond CEBoK: curves of equal preference

CEBoK's own Testable Topics table calls out "curves of equal preference" and "picking optimal design in a hypothetical scenario" as testable concepts, but the module text itself doesn't walk through the mechanics — so here's the standard treatment.

:::tip Beyond CEBoK
Plot design alternatives in **cost vs. performance** space. A **curve of equal preference** (an indifference curve) connects every combination of cost and performance that the decision maker values **equally** — moving along one curve trades performance for cost (or vice versa) at the **exchange rate** (the curve's slope) without changing overall preference.

- Curves toward higher performance and lower cost (more performance for the same cost, or less cost for the same performance) are **more preferred**.
- The **optimal design** is the feasible alternative that lands on the **most-preferred** curve of equal preference, while still respecting the official cost and performance **thresholds** (the outer bound) and **objectives** (the goal value).
- A design that is cheaper but on a *less*-preferred curve than an affordable, higher-performing alternative is not "optimal" just because it costs less.
:::

:::check
Q: On a cost-vs-performance chart, what do all points along a single "curve of equal preference" have in common?
* The decision maker values them equally, even though their cost/performance mix differs
- They all cost exactly the same
- They all have identical performance
> A curve of equal preference (indifference curve) connects cost/performance combinations judged equally desirable; the slope is the exchange rate.
:::

:::check
Q: Design A costs less but sits on a lower (less-preferred) curve of equal preference than Design B, and both meet the cost/performance thresholds. Which is the "optimal design" under CAIV?
* Design B — it's on the more-preferred curve, so it delivers a better cost/performance trade even though it costs more
- Design A — lowest cost always wins
- Neither — only the objective values matter, not preference curves
> The optimal design is the feasible alternative on the most-preferred curve of equal preference within thresholds and objectives, not simply the cheapest option.
:::

:::check
Q: A hypothetical program has a cost threshold of \$500M and objective of \$400M. Design X costs \$420M and lands on a more-preferred curve than Design Y, which costs \$390M. Both meet the performance objective. Which should be selected under CAIV logic?
* Design X — within threshold, meets performance objective, and on the more-preferred curve
- Design Y — it is closer to the cost objective
- Neither — reject both and restart requirements
> Design X remains within the cost threshold and sits on the more-preferred curve of equal preference; being closer to the objective dollar figure alone doesn't make Design Y "optimal" if it trades away more value.
:::

:::widget design-trade:::`
    },
    {
      id: 'target-costing', title: 'Target Costing', summary: 'Market-driven cost, price, and profit',
      body: String.raw`:::primer:::
Imagine a product the market will pay a fixed price for, and a company that insists on a set profit margin. What is left for cost?

:::check
Q: Customers will pay \$250 per unit and company policy requires a 20% profit margin on price. Which target cost is closest?
- \$50
* \$200
- \$300
> Target Profit is 20% of \$250, or \$50. Target Cost is Target Price minus Target Profit, so \$250 - \$50 = \$200.
:::

+++

Due to increasingly competitive market pressures, organizations use **target costing** to reduce cost while concurrently increasing customer value. Traditionally, organizations focused on satisfying customer requirements and viewed product cost as a **dependent variable** — an after-the-fact result of decisions about a product's functions, features, and performance. Target costing orients products to **customer affordability or market-driven pricing**, treats product cost as an **independent variable** during requirements definition, and proactively works to achieve the target cost during product and process development.

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

### Worked example (illustrative, not from CEBoK)

A company wants to introduce a new product. Market research indicates customers will pay \$250 per unit. Company policy requires 20% profit margin on price.

$$\text{Target Profit} = 0.20 \times \$250 = \$50$$
$$\text{Target Cost} = \$250 - \$50 = \$200$$

If the engineering team's current design would cost \$230 to produce, there is a **\$30 cost gap** that must be closed — through design changes, process improvement, value engineering, or sourcing changes — before production begins.

{{primer}}

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
      body: String.raw`:::primer:::
ABC follows money from where it is spent to where it ends up. Each kind of thing sits at a different point on that path.

:::sort
Q: Is each item a resource, an activity, or a cost object?
buckets: Resource | Activity | Cost Object
- Utilities = Resource
- Facilities = Resource
- Machine setup = Activity
- Inspection = Activity
- Customers = Cost Object
- Contracts = Cost Object
> Resources are inputs like labor, equipment, utilities, and facilities. Activities are work like machine setup, purchasing, and inspection. Cost objects are end items like products, services, customers, or contracts.
:::

+++

**Activity Based Costing and Management (ABC/M)** consists of two elements: cost accounting and management. ABC/M is a methodology for understanding activities, processes, services, and products — it identifies **activities and drivers** that consume resources and affect performance, and associates them with products or services. ABC/M applies to right-sourcing decisions in government and private companies, to product-line rationalization, and, as a key cost-management tool, to the entire life cycle.

**Activity Based Costing (ABC)** is a method of costing in which **activities are the primary cost objects**. ABC measures activity cost and performance and assigns the costs of those activities to other cost objects (products, customers) based on their use of the activities — captured as quantified cost and time data translated into decision information.

**Activity Based Management (ABM)** uses activity cost data to *manage* activities: ABM analyzes whether activities add value to customers and determines how to perform them to maximize customer value and profit. Analysts generally apply ABC to measure the true cost of a single product or service; ABM uses that information across a range of products/services to evaluate the total cost of managing an entire operation. **ABC and ABM work in concert to eliminate non-value-added activities.**

### Key definitions

- **Resources**: The inputs consumed by an organization (labor, equipment, utilities, facilities) that generate cost.
- **Activities**: The work performed within an organization (e.g., machine setup, purchasing, inspection, material handling) that consumes resources.
- **Cost Objects**: The end items to which cost is ultimately assigned — products, services, customers, or contracts.
- **Cost Drivers**: The factors that cause the cost of an activity to increase or decrease (e.g., number of setups, purchase orders, inspections). Cost drivers assign activity costs to cost objects in proportion to each cost object's actual consumption of that activity.
- **Cost Pools**: Groupings of costs associated with a particular activity, accumulated before being allocated to cost objects using the relevant cost driver.

+++

### The ABC flow

$$\textbf{Resources} \rightarrow \textbf{Activities} \rightarrow \textbf{Cost Objects}$$

Resources are consumed by activities (traced via **resource drivers**); activities are consumed by cost objects (traced via **activity/cost drivers**).

**Example**: A factory spends \$100,000 on setup labor per year. That's a *resource*. The setup activity consumes the labor. Individual products (cost objects) consume setups at different rates (the *activity driver*). ABC traces the \$100,000 to each product based on how many setups it requires.

{{primer}}

:::check
Q: In the ABC chain Resources -> Activities -> Cost Objects, what links activity costs to products?
- Resource drivers
* Activity (cost) drivers
- Direct labor hours only
> Resource drivers assign resources to activities; activity drivers (cost drivers) assign activities to cost objects based on actual consumption.
:::

:::check
Q: How does ABM differ from ABC in scope?
* ABC measures true cost of a single product/service; ABM uses that data across a range of products/services to manage the whole operation
- ABC and ABM are the same technique with different names
- ABM only applies to government programs; ABC only to commercial firms
> ABC is the measurement discipline; ABM is the broader management use of ABC data to evaluate and improve operations.
:::`
    },
    {
      id: 'abc-benefits', title: 'Why Activity-Based Costing', summary: 'Strategic, operational, and planning benefits',
      body: String.raw`:::primer:::
A cost method can serve very different decisions, from setting company direction to building next year's budget.

:::sort
Q: At which decision level does ABC provide each benefit?
buckets: Strategic | Operational | Planning and budgeting
- Provides an economic map of the enterprise = Strategic
- Compares costs of goods and services to prices = Strategic
- Identifies process-improvement opportunities = Operational
- Measures organizational impacts of process change = Operational
- Correlates budget changes to resources = Planning and budgeting
- Assists in forecasting required resources to satisfy program requirements = Planning and budgeting
> Strategic benefits include an economic map and competitive price comparison. Operational benefits include finding process improvements and measuring their impact. Planning and budgeting benefits include tying budget changes to resources and forecasting required resources.
:::

+++

ABC supports decision-making across three levels:

- **Strategic decision-making**: provides an economic map of the enterprise, compares process costs to strategic direction, assesses impacts of changes in product/service offerings, and compares costs of goods/services to prices (competitive benchmarking).
- **Operational decision-making**: identifies process-improvement opportunities, measures organizational impacts of process change, clarifies the contribution resources make to processes, and leverages process best practices (internal and external benchmarking).
- **Planning and budgeting decision-making**: correlates budget changes to resources (selective vs. broad-brush changes), assists in forecasting required resources to satisfy program requirements, and supports more effective reporting to stakeholders and customers.

Ultimately, ABC: **improves customer value, increases profit, clarifies cost, and facilitates business planning.**

{{primer}}

### ABC exposes what GAAP hides

Organizations feel pressure to enhance value through cost reduction, but overhead is often ignored in cost-reduction efforts. Traditional accounting does not give management the information needed to improve an organization, because **Generally Accepted Accounting Principles (GAAP) hide overhead**. **ABC exposes overhead.** ABC can be used for business-process improvement, strategic planning, target pricing, product rationalization, product quotation, business simulation, budgeting, and manpower planning.

ABC adds a different perspective from other cost views — organizations may need to manage the cost of performing a mission and the cost of specific products/services simultaneously. ABC's focus on cost drivers improves the realism and clarity of costs rolled up or broken down elsewhere.

+++

### Fig. 16.4: Traditional view vs. ABC view

The same \$57,760,000 in total organizational cost, viewed two ways:

| Traditional category | Cost |
|---|---|
| Personnel | \$45,000,000 |
| Software Licenses | \$2,000,000 |
| Workstations | \$7,500,000 |
| TDY | \$250,000 |
| Transportation | \$95,000 |
| Rent/Leases | \$250,000 |
| Utilities | \$750,000 |
| Network Comms | \$375,000 |
| Maintenance | \$1,450,000 |
| Supplies | \$40,000 |
| Misc. Equipment | \$50,000 |
| **Total** | **\$57,760,000** |

| ABC activity view | Cost |
|---|---|
| Conduct Operations | \$36,640,000 |
| Acquire Equipment | \$12,250,000 |
| Support Operations | \$4,500,000 |
| Develop Budget | \$350,000 |
| Train Personnel | \$575,000 |
| Maintain Records | \$70,000 |
| Operate Comm Center | \$850,000 |
| Install/Maint Computers | \$975,000 |
| Help Desk Support | \$1,550,000 |
| **Total** | **\$57,760,000** |

The **traditional view** shows *what was bought* (line items like Personnel and Workstations). The **ABC view** shows *what was done with it* — the same dollars re-sliced by activity, with the ABC view focused on performing the mission and supporting the performance of the mission.

:::check
Q: In Fig. 16.4, the traditional view lists cost by line item (Personnel, Software Licenses, Rent, ...) while the ABC view lists the same total by activity (Conduct Operations, Acquire Equipment, ...). Both total \$57,760,000. What does this illustrate?
* ABC re-slices the same total cost around what work was actually performed, not what resources were purchased
- ABC always produces a lower total cost than traditional accounting
- The ABC view and traditional view must always disagree on the total
> Same dollars, same total — ABC simply reorganizes them by activity/mission performance rather than by resource line item, exposing overhead GAAP-style categories hide.
:::

:::check
Q: Why does CEBoK say traditional (GAAP-based) accounting fails to give management what it needs to improve an organization?
* GAAP hides overhead; ABC exposes it
- GAAP requires activity-based reporting, which is too granular
- GAAP only applies to commercial firms, not government
> CEBoK states plainly: GAAP hides overhead, and ABC exposes it — that exposure is what enables process improvement and better decisions.
:::

:::widget abc-views:::`
    },
    {
      id: 'abc-allocation', title: 'The allocation problem: worked example', summary: 'Volume-based distortion and worked example',
      body: String.raw`:::primer:::
Two products share a pool of setup overhead. Product A is high volume and simple. Product B is low volume and complex, and it causes 18 of the 20 setups. A traditional system spreads the overhead by direct labor hours and gives both products \$10.00 of overhead per unit.

:::check
Q: Once ABC assigns the overhead by number of setups, what happens to Product B's overhead per unit compared with \$10.00?
* It goes up
- It goes down
- It stays the same
> Product B causes most of the setups, so ABC assigns it far more of the overhead. Its cost rises to \$45.00 per unit, while Product A's falls.
:::

+++

### The problem: traditional volume-based allocation

Traditional overhead allocation assigns indirect/overhead costs to products using a **single, often volume-based allocation base** — commonly direct labor hours, machine hours, or units produced — applied at one uniform overhead rate.

**When products differ significantly in complexity, batch size, or support activities (setups, inspections, engineering changes)**, a single volume-based driver **distorts** the true cost of each product:

- **High-volume, simple products** tend to be **over-costed** (absorb more overhead than they actually cause)
- **Low-volume, complex/specialty products** tend to be **under-costed** (absorb less overhead than they actually cause), because they consume disproportionate amounts of support activity

This can lead to bad pricing, product-mix, and investment decisions because product profitability appears reversed from reality.

The following worked example is an illustrative (not from CEBoK) classroom-style scenario used to demonstrate the distortion; the underlying arithmetic is correct.

+++

### Worked example: traditional vs. ABC (illustrative)

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

**Interpretation**: Traditional allocation masked the fact that Product B drives 90% of setup activity and cost (illustrative figure, not from CEBoK). Product B appears far more profitable (and Product A less profitable) than it actually is under traditional costing — this can distort pricing and product-mix decisions. ABC reveals the true relationship.

{{primer}}

:::check
Q: A factory allocates \$60K of inspection overhead using direct labor hours. Product X uses 3,000 DL hours and requires 4 inspections; Product Y uses 3,000 DL hours and requires 36 inspections (40 total). Under ABC, what is the cost per inspection (in dollars)?
= 1500
> Rate = \$60,000 / 40 inspections = \$1{,}500/inspection. Product X: $4 \times \$1{,}500 = \$6{,}000$; Product Y: $36 \times \$1{,}500 = \$54{,}000$.
:::`
    },
    {
      id: 'abc-model', title: 'The ABC/M model: the CAM-I Cross', summary: 'ABC (what) vs. ABM (why), and the domain of application',
      body: String.raw`:::primer:::
ABC/M has a reputation. Think about how a manager might react when asked to adopt it.

:::check
Q: How do organizations often perceive ABC/M?
- As too simple to be useful
* As expensive to implement
- As usable only in commercial firms
> Organizations often perceive ABC/M as expensive to implement. It has still been used successfully in both industry and government.
:::

+++

Because ABC examines the cost of activities, it primarily addresses **process cost** throughout the life cycle (Fig. 16.5, the ABC/M domain of application).

### The CAM-I Cross (Fig. 16.6)

The basic methodology of ABC and ABM is illustrated on a graphic known as the **CAM-I Cross**:

- **ABC acts vertically, top-down**: assigning and measuring **resources to activities** via **resource drivers** (first-stage assignment), then **activities to outputs/cost objects** via **activity drivers** (second-stage assignment). ABC focuses on **what** things cost, establishing the cost of activities and cost objects. From there, managers determine what changes give the company optimal profitability.
- **ABM acts horizontally, left-to-right**: relating the cost of activities to cost drivers and producing performance measures. ABM focuses on **why** things cost what they do.

The two methodologies act in conjunction: ABC/M facilitates better understanding and management of resource consumption, and better decision making overall.

:::tip Beyond CEBoK
CEBoK's own text names the CAM-I Cross's origin two different ways in the same module: in the Resources section, it cites "Consortium for Advanced **Manufacturing** – International," but in the body text describing the graphic, it calls it the "Consortium for Advanced **Management** International." This is a source inconsistency (both point to the same CAM-I organization) — not something to memorize either way for the exam.
:::

Organizations often perceive ABC/M as expensive to implement. It has been used successfully in both industry and government, but is met with resistance among government contractors, especially defense-sector manufacturers.

{{primer}}

:::check
Q: On the CAM-I Cross, what does the vertical (top-down) axis represent?
* ABC — assigning resources to activities via resource drivers, then activities to cost objects via activity drivers ("what" things cost)
- ABM — relating activities to cost drivers and performance measures ("why" things cost)
- The program's WBS structure
> ABC is the vertical, top-down assignment: resources -> activities (resource drivers) -> cost objects (activity drivers). It focuses on "what."
:::

:::check
Q: On the CAM-I Cross, what does the horizontal (left-to-right) axis represent?
* ABM — relating the cost of activities to cost drivers and producing performance measures ("why" things cost)
- ABC — assigning resources to activities and activities to cost objects
- The chart of accounts
> ABM is the horizontal axis: it explains "why" things cost by tying activities to drivers and performance measures, complementing ABC's "what."
:::

:::widget cam-i-cross:::`
    },
    {
      id: 'abc-estimating', title: 'ABC/M and cost estimating', summary: 'Better data, driver identification, and trade studies',
      body: String.raw`:::primer:::
A traditional estimate shows overhead as one big line. ABC/M cuts the estimate up differently.

:::check
Q: Instead of labor, material, and overhead, what does ABC/M break product cost into?
- The work phases of the schedule
- The same labor, material, and overhead lines
* The activities that must be performed to produce the item
> ABC/M breaks cost into the activities needed to produce the item. Overhead, often one undifferentiated line, is broken into activities, making potential savings visible.
:::

+++

ABC/M is another method of performing cost estimates. Rather than breaking product cost into the traditional labor, material, overhead, etc., ABC/M breaks it into the **activities** that must be performed to produce the item. By looking at what activities actually make up production, management can better see where costs can be saved. Overhead, often shown as a large, undifferentiated line item, gets broken into the activities performed under ABC — making potential cost savings readily visible.

{{primer}}

### Better historical cost data

ABC-derived costs more accurately reflect the true cost of activities and products, improving the quality of historical data used to build **Cost Estimating Relationships (CERs, Module 3)**.

**Problem**: Traditional volume-allocated overhead can distort historical unit costs. If you use distorted historical data to build a CER, the resulting regression carries the distortion forward into future estimates.

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

Understanding which activities drive cost lets estimators and engineers evaluate design/process trade-offs with better insight into which changes will actually reduce cost. If setup activity drives 80% of overhead, reducing setups is a high-leverage target; if direct labor drives cost, process automation is the lever.

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
    },
    {
      id: 'summary', title: 'Summary and testable topics', summary: 'Recap and what CEBoK actually tests',
      body: String.raw`:::primer:::
This module's methods do not work alone. CAIV, target costing, and ABC lean on other tools from earlier in Unit V.

:::check
Q: Which earlier Unit V modules does the summary say are applied alongside CAIV, Target Costing, and ABC?
- Parametric Estimating, Learning Curves, and Inflation
* Economic Analysis, Contracting, and EVM
- Schedule Analysis, Risk, and Data Collection
> The summary says cost management applies CAIV, Target Costing, and ABC along with Economic Analysis, Contracting, and EVM from earlier Unit V modules.
:::

+++

We discussed a holistic approach to cost management that seeks to manage and reduce TOC by applying **CAIV, Target Costing, and ABC**, along with **Economic Analysis, Contracting, and EVM** from earlier Unit V modules.

Cost management employs extensive cost modeling to capture how the interaction of dynamic systems drives cost. It rigorously applies cost estimating throughout the life cycle and better integrates the management processes across the discipline, providing a realistic and impartial assessment of cost objectives relative to other program objectives.

{{primer}}

+++

### Testable topics

CEBoK's own testable-topics table for this module:

| Testable | Testable, less emphasized | Not testable |
|---|---|---|
| CAIV and Design Tradeoffs as a concept | Fully Burdened Cost of Fuel (FBCF) | Names of various US gov't initiatives (e.g., Nunn-McCurdy, WSARA, etc.) |
| Picking optimal design in a hypothetical scenario | | |
| Understanding and working with "curves of equal preference" | | |
| Definition of Total Ownership Cost (TOC) as opposed to LCCE | | |

*(Source note: CEBoK's table lists "opitmal design" — a typo in the original text for "optimal design.")*

In practice: know **Big TOC vs. Little TOC/LCC, TCO, LCCE vs. life cycle/O&S, CAIV's reversed flow, target costing, curves of equal preference and optimal-design selection, ABC's Resources->Activities->Cost Objects flow, resource/activity drivers, and the CAM-I Cross (ABC=what, ABM=why)** cold. Names of specific US government cost-reduction initiatives (Nunn-McCurdy, WSARA) are explicitly **not testable**.

### Fully Burdened Cost of Fuel (FBCF)

:::tip Beyond CEBoK
**FBCF** is the price of fuel plus the cost of the logistics and force protection required to deliver it to the point of use — relevant because delivered fuel cost in a forward or contested environment can be far higher than the purchase price alone. CEBoK marks this topic "testable, but less emphasized" — know the definition, but expect little depth.
:::

:::check
Q: Per CEBoK's Testable Topics table, which of these is explicitly marked NOT testable?
* Names of specific US government initiatives such as Nunn-McCurdy or WSARA
- CAIV and design trade-offs as a concept
- Curves of equal preference
> The table explicitly excludes memorizing specific initiative names; CAIV concepts and curves of equal preference are testable.
:::

:::check
Q: What is the Fully Burdened Cost of Fuel (FBCF)?
* The price of the fuel itself plus the cost of the logistics and force protection needed to deliver it
- The wholesale market price of fuel only
- The cost of fuel storage infrastructure only
> FBCF captures delivered cost, not just purchase price — logistics and force protection to get fuel to the point of use can dominate the total.
:::`
    }
  ],
  cards: String.raw`
## Fundamentals
Q: Cost management (definition)
A: Planning, controlling, motivating, and evaluating products, processes, and personnel from a cost perspective across the life cycle.
R: yes
Q: Why does CEBoK avoid the term "cost control"?
A: It implies cost can be managed by sheer force of will; real cost management works by changing the program's actual course of action.
Q: Three ways to reduce cost
A: Apply new technology; make trade-offs (give something up); re-work requirements in conjunction with design.
Q: PER, utility score, exchange rate
A: PER = cost-based Performance Estimating Relationship; utility score = summary performance metric; exchange rate = cost traded for a unit increase in performance (or vice versa).
Q: Ultimate goal of cost management
A: System and program affordability.
Q: Traditional cost role vs. CAIV
A: Traditional: cost is a dependent variable (output of design). CAIV: cost is an independent variable (input/design constraint).
Q: When is most program management leverage over LCC?
A: Early in a program — opportunities to avoid cost evaporate faster than expenditures accumulate.
Q: Product cost vs. process cost
A: Product cost = cost of the system design (hardware/software). Process cost = cost of business, engineering, design, and support processes.
Q: How to make things cheaper (list)
A: Producing less, reducing scope, allocating fewer resources — all hurt performance; Lean/Six Sigma and R&D investment seek savings without that trade-off.

## Total Ownership Cost and LCC
Q: DoD Total Ownership Cost (Big TOC)
A: Organizational-perspective sum of all financial resources to organize, equip, train, sustain, and operate forces and support DoD business operations.
R: yes
Q: Little TOC / Defense Systems TOC
A: The program/project-level perspective on total ownership cost; defined as LCC.
R: yes
Q: Life Cycle Cost (LCC), per DoD 5000.4-M
A: Includes acquisition-program direct costs plus indirect costs attributable to the program (costs that would not occur if the program did not exist).
R: yes
Q: Life Cycle Cost Estimate (LCCE)
A: Covers all costs for the program's complete life cycle, regardless of funding source; often confused with just the O&S estimate.
R: yes
Q: Industry term for organizational-level TOC
A: Total Cost of Ownership (TCO), especially for IT systems.
Q: Linked indirect costs
A: Indirect costs causally attributable to a specific program (e.g., infrastructure it drives), even though budgeted elsewhere.
R: yes
Q: Why keep both TOC perspectives in mind?
A: Most reduction efforts work at the program level, but analysts must avoid program decisions that fail to reduce (or that increase) overall organizational TOC.

## Reducing TOC (R-TOC)
Q: R-TOC key steps (5)
A: Establish a cost baseline; set reduction targets; develop initiatives; assess and fund initiatives; track progress with predefined metrics.
Q: What commonly triggers R-TOC adoption?
A: A crisis — affordability pressure (DoD) or declining profitability/market share (commercial) — though best-practice orgs act proactively.
Q: Best time to reduce TOC
A: Early in the acquisition process, before design decisions lock in cost.
Q: Only remaining lever once a system is fielded
A: Modernization — inserting new technology to raise reliability and lower support costs, or improving support-process efficiency.
Q: Two ways to affect cost early
A: CAIV (DoD) or Target Costing (commercial).

## CAIV
Q: CAIV definition
A: Cost As an Independent Variable: the primary DoD acquisition process/strategy for meeting requirements while reducing TOC; cost is a design constraint on equal footing with performance/schedule.
R: yes
Q: CAIV flow vs. traditional flow
A: CAIV: define affordable cost -> determine what requirements/performance fit within it. Traditional: define requirements -> design -> measure cost.
Q: Commercial analog of CAIV
A: Target costing.
Q: Curves of equal preference (Beyond CEBoK)
A: Indifference curves in cost-vs-performance space; every point on one curve is equally preferred; slope = exchange rate.
R: yes
Q: Optimal design (Beyond CEBoK)
A: The feasible alternative on the most-preferred curve of equal preference, within official cost/performance thresholds and objectives.
R: yes

## Target Costing
Q: Target costing formula
A: Target Cost = Target Price − Target Profit.
R: yes
Q: Target costing vs. cost-plus pricing
A: Target costing: price and profit are fixed, cost is variable. Cost-plus: cost is determined first, price/profit follow.
Q: What is the "target cost gap"?
A: The difference between the engineering team's current design cost and the allowable target cost; closed via design/process/sourcing changes.
R: yes
Q: Market price \$250, required profit 20% on price: target cost?
A: \$200 (illustrative example). Profit = \$250 x 0.20 = \$50; Cost = \$250 − \$50 = \$200.
Q: Relationship: target costing and CAIV
A: Both set a cost constraint early and manage design to fit. Target costing derives it from market price/profit; CAIV from program affordability/budget.

## ABC Fundamentals
Q: Activity Based Costing (ABC) definition
A: A method of costing in which activities are the primary cost objects; assigns activity cost to cost objects based on their use of the activities.
R: yes
Q: ABC/M
A: Activity Based Costing and Management — combines cost accounting (ABC) with management use of that data (ABM).
R: yes
Q: ABC chain
A: Resources -> Activities -> Cost Objects.
R: yes
Q: Resource driver (first-stage assignment)
A: Measure used to assign resource costs to activities.
R: yes
Q: Activity (cost) driver (second-stage assignment)
A: Measure of how much of an activity a cost object uses; allocates activity costs to cost objects.
R: yes
Q: Cost pool
A: Accumulated cost associated with a particular activity, gathered before allocation to cost objects.
R: yes
Q: Activity-Based Management (ABM)
A: Uses ABC cost data to manage activities — determines how to perform them to maximize customer value and profit.
R: yes
Q: ABC vs. ABM scope
A: ABC measures true cost of a single product/service; ABM uses that data across products/services to manage the whole operation.

## Why ABC
Q: ABC's three decision-making benefits
A: Strategic (economic map, benchmarking), operational (process improvement, best practices), and planning/budgeting (forecasting, reporting).
Q: ABC vs. GAAP
A: GAAP hides overhead; ABC exposes it — enabling process improvement and better decisions.
Q: Fig 16.4 grand total (traditional and ABC views)
A: \$57,760,000 — identical total, reorganized by activity instead of resource line item.
Q: Largest activity in the Fig 16.4 ABC view
A: Conduct Operations, at \$36,640,000.
Q: What the traditional view vs. ABC view each emphasize
A: Traditional = what was bought (line items). ABC = what was done with it (activities), focused on performing and supporting the mission.

## ABC Allocation Example
Q: Problem with traditional volume-based overhead allocation
A: Single rate (e.g., per DL hour) distorts costs when products differ in complexity/batch size; high-volume simple products get over-costed, low-volume complex get under-costed.
Q: ABC worked example: setup costs \$100K for 20 setups. Product A (2 setups), Product B (18 setups). ABC cost per setup?
A: \$5,000/setup (illustrative example).
Q: Same example: Product A (8,000 units) ABC overhead cost total, and per unit?
A: Total \$10,000; per unit \$1.25.
Q: Same example: Product B (2,000 units) ABC overhead cost total, and per unit?
A: Total \$90,000; per unit \$45.00.

## The ABC/M Model
Q: What does ABC primarily address across the life cycle?
A: Process cost (Fig. 16.5, the ABC/M domain of application).
Q: CAM-I Cross — ABC axis
A: Vertical, top-down: resources -> activities (resource drivers, first stage) -> cost objects (activity drivers, second stage). Focuses on "what."
R: yes
Q: CAM-I Cross — ABM axis
A: Horizontal, left-to-right: activities -> cost drivers -> performance measures. Focuses on "why."
R: yes
Q: CAM-I source-name inconsistency (Beyond CEBoK)
A: CEBoK's Resources section says "Consortium for Advanced Manufacturing – International"; the body text says "Consortium for Advanced Management International" — same organization, inconsistent naming in the source.

## ABC and Estimating
Q: How does ABC improve historical cost data for CER development?
A: Removes distortions from volume-based allocation; provides cleaner historical unit costs and better driver identification.
Q: What is the parallel between ABC and CER development?
A: Both seek true cost drivers: ABC identifies what activities drive cost; CER development identifies what variables explain cost variation.
Q: Is ABC itself a forecasting method?
A: No. ABC explains historical/current cost causality. CERs and other estimating methods are still needed to project costs into the future.
Q: How does ABC help with CAIV trade studies?
A: By identifying which activities consume cost, estimators can advise which design/process changes will actually reduce cost (high-leverage targets).

## Testable Topics
Q: CEBoK's Testable Topics table for this module
A: Testable = CAIV/design tradeoffs, optimal design in a hypothetical scenario, curves of equal preference, TOC vs. LCCE definitions. Less emphasized = FBCF. Not testable = names of US gov't initiatives (Nunn-McCurdy, WSARA, etc.).
Q: Fully Burdened Cost of Fuel (FBCF)
A: Price of fuel plus the cost of logistics and force protection to deliver it to the point of use (testable, less emphasized).
R: yes
`
});
