PCEA.addModule({
  id: 'm02', num: 2, title: 'Cost Estimating Methods', short: 'Estimating Methods', source: 'guide',
  blurb: 'Analogy, parametric, build-up, and other techniques: when to use each, how to cross-check, and why uncertainty matters.',
  intro: String.raw`An estimate is never a single "true" number — it is a range built from data, relationships, or logic, always accompanied by uncertainty.

**The core challenge:** select a technique (or blend of techniques) appropriate to **data availability**, **program maturity**, and **required accuracy**.

**The four families**: analogy, parametric, build-up, and other (expert opinion, extrapolation, should-cost).`,
  sections: [
    {
      id: 'uncertainty', title: 'Uncertainty and Risk', summary: 'Why estimates are uncertain and what risk means',
      body: String.raw`An estimate predicts the future, so it is always uncertain. Separate that uncertainty from **risk**.

### Sources of Uncertainty

A point estimate is one value drawn from a distribution. Uncertainty comes from:

- **Data uncertainty**: natural scatter in historical data (CER prediction interval, sample variation)
- **Model uncertainty**: the technique itself (analogy, CER, build-up) is an imperfect representation
- **Requirements uncertainty**: the system is not fully defined, especially early
- **Schedule uncertainty**: slips or accelerations change phased costs
- **Technical risk**: technology may not mature as planned, driving rework

Cost distributions are **right-skewed**: large overruns are possible, but underruns are limited. So a point estimate built from "most likely" values usually falls **below** the mean.

+++

### Risk vs. Uncertainty

- **Uncertainty**: natural statistical variability in an estimate given the data and method — describable with a distribution (e.g., ± prediction interval)
- **Risk**: a specific, identifiable event or condition that, **if it happens**, has a (usually negative) effect on cost/schedule/performance. Characterized by **probability** and **consequence**.
- **Opportunity**: an uncertain event with a positive effect

Both must be reflected in the final estimate. Report a **range or distribution** with a confidence level, not a bare point number.

+++

### Common Sources of Cost Growth

- Requirements creep / scope changes
- Immature technology (low Technology Readiness Level)
- Optimistic assumptions (schedule, learning, vendor quotes)
- Poor analogy selection (too dissimilar)
- Small sample sizes or inadequate historical data
- External factors (funding instability, inflation, regulatory change)

:::check
Q: A supplier might go out of business next year (30% chance), adding \$4M to cost. This is best described as…
* A risk (an uncertain event with probability and consequence)
- General estimating uncertainty
- A sunk cost
- An opportunity
> A discrete event with probability and consequence = risk.
:::

:::check
Q: Why does a point estimate from "most likely" values usually fall below the mean cost?
* Cost distributions are right-skewed; overruns can be large but underruns are limited
- The estimate method is biased low
- Optimism bias in the data
> Asymmetry: large upside surprises outweigh large downside, pulling the mean above the mode.
:::`
    },
    {
      id: 'analogy', title: 'Analogy', summary: 'Estimate from one similar system, adjusted for differences',
      body: String.raw`Estimate a new system from **one** (or a few) similar, historical systems, adjusted for differences in size, performance, complexity, or technology.

### Process

1. Identify an analogous system (similar function, technology, design)
2. Obtain the historical cost, normalized for inflation and quantity
3. Identify differences between the analogy and the new system
4. Apply adjustment factors (scaling or judgment-based)

### Scaling Formula

$$Cost_{new} = Cost_{analogy} \times \left(\frac{Parameter_{new}}{Parameter_{analogy}}\right)^{x}$$

where $x$ is a scaling exponent ($x = 1$ = linear).

**Example**: Analogous radar cost \$40M, weighed 500 lbs. New radar weighs 650 lbs, linear scaling (x = 1):
$$Cost_{new} = \$40M \times \frac{650}{500} = \$52M$$

+++

### Factor Adjustment

Multiply by multiple judgment factors for different effects:

$$Cost_{new} = Cost_{analogy} \times f_1 \times f_2 \times ...$$

**Example**: Base system \$10M. Complexity +20% (factor 1.20), but technology maturity saves 10% (factor 0.90):
$$Cost_{new} = \$10M \times 1.20 \times 0.90 = \$10.8M$$

+++

### Pros and Cons

**Pros**: Fast and cheap; based on real data; works early with little design detail; intuitive.

**Cons**: Relies on a single (or few) data point(s); adjustment factors are often subjective; a good analog may not exist; difficult to defend rigorously.

:::check
Q: An analogous aircraft cost \$50M and had 200 kW of power. The new design requires 250 kW. Assuming a 0.5 power exponent, estimate the new cost.
= 55.90 ±0.1
> $\$50M \times (250/200)^{0.5} = \$50M \times 1.1180 = \$55.90M$
:::

:::check
Q: Which technique is most at risk of defending poor analogy choices?
* Analogy
- Parametric
- Build-up
> Analogy relies on a single (or few) analog(s) and subjective adjustments with no statistical rigor.
:::

:::challenge analogy c0=50 s0=1000 s1=1400 b=0.7 cx=1 lock=c0,s0,s1,cx
Q: The analog cost \$50M at a size of 1,000; the new system is 1,400. Adjust the scaling exponent until the size-adjusted cost is **\$60M**.
goal: sized ~ 60 +- 0.5%
show: b=0.55
> $50 \times 1.4^{b} = 60$ gives $b = \ln 1.2 / \ln 1.4 \approx 0.54$. An exponent below 1 means cost grows more slowly than size (economies of scale). With $b = 1$, linear scaling would give \$70M.
:::`
    },
    {
      id: 'parametric', title: 'Parametric', summary: 'Use statistical relationships (CERs) from many data points',
      body: String.raw`Use a **statistical relationship** (a Cost Estimating Relationship, or **CER**) built from **many** historical data points relating cost to measurable parameters (e.g., weight, power, lines of code).

### CER Forms

**Linear:**
$$Cost = a + bX$$

**Power (most common):**
$$Cost = aX^b$$

Both can be fit via **regression** (see Module 8). A good CER has acceptable $R^2$, t-statistics, and F-statistics.

### Example

CER for trucks: $Cost (\$K) = 15 + 2.5 \times Payload\ (tons)$

For a truck with 12-ton payload:
$$Cost = 15 + 2.5(12) = \$45K$$

+++

### Building a CER

A parametric relationship must be:

- **Statistically valid** (good $R^2$, significant slope)
- **Operationally reasonable** (does it make physical sense?)
- **Derived from comparable systems** (homogeneous data)
- **Checked for extrapolation risk** (only valid within the data range)

Sources: in-house regression, published models, vendor parametric tools.

:::tip
High $R^2$ (>0.90) looks good, but always check that the slope makes sense physically. A strong statistical fit can hide a physically nonsensical relationship.
:::

+++

### Pros and Cons

**Pros**: Statistically defensible (if properly built); objective and repeatable; gives uncertainty measures; fast to apply; good for trade/sensitivity analysis.

**Cons**: Requires a sufficient, normalized historical dataset; risk of extrapolating outside the data range; can be a "black box" if the relationship isn't understood.

:::check
Q: A parametric CER for software: $Cost (\$K) = 50 + 0.08 \times SLOC\ (thousands)$. Estimate cost for 400,000 SLOC.
= 82
> $Cost = 50 + 0.08(400) = 50 + 32 = \$82K$
:::

:::check
Q: You fit a power CER: $Cost = 2.5 \times Weight^{0.8}$. The relationship is statistically strong ($R^2 = 0.92$). To apply it to a new system 10 times heavier than any in your database, you should…
- Apply it directly; the $R^2$ is excellent
- Reduce the exponent to make it more conservative
* Check whether extrapolation 10× beyond your data range is justified; it risks poor predictions
> Strong $R^2$ only means fit within the data range. Extrapolation far beyond is risky.
:::`
    },
    {
      id: 'buildup', title: 'Build-up (Engineering / Bottom-up)', summary: 'Estimate from the lowest WBS level and sum',
      body: String.raw`Estimate cost at a **low level of detail** (labor hours, material, tooling) and **roll up** the Work Breakdown Structure (WBS).

### Process

At each WBS element, estimate:

1. Labor hours by category (engineering, manufacturing, quality, etc.)
2. Hourly rates (burdened or fully-loaded)
3. Material costs
4. Other direct costs (ODC: tooling, test, travel)

Then sum:

$$Cost = \sum_{i=1}^{n}(Hours_i \times Rate_i) + \sum_{i=1}^{n} Materials_i + ODC$$

### Example

| Labor Category | Hours | Rate (\$/hr) | Cost |
|---|---|---|---|
| Engineering | 200 | \$95 | \$19,000 |
| Manufacturing | 500 | \$60 | \$30,000 |
| Quality Assurance | 80 | \$70 | \$5,600 |
| **Labor Subtotal** | | | **\$54,600** |
| Materials | | | \$22,000 |
| **Total** | | | **\$76,600** |

+++

### Pros and Cons

**Pros**: Detailed and precise (given accurate inputs); highly traceable/auditable; useful for negotiation; shows exactly what drives cost.

**Cons**: Time- and labor-intensive; requires mature design; small errors compound; only captures *known* tasks — misses unknown-unknowns unless an explicit risk allowance is added.

:::warn
Build-up is defensible for **defined** work. But a detailed estimate built only from known tasks **systematically excludes unknown-unknowns** (integration, rework, unforeseen problems). Always add a management reserve / risk allowance on top.
:::

:::check
Q: Build-up for a subassembly: Engineering 150 hrs @ \$90/hr; Manufacturing 300 hrs @ \$55/hr; Materials \$12,000. Total?
= 42000
> Engineering: $150 \times 90 = 13500$; Mfg: $300 \times 55 = 16500$; labor total = \$30,000; materials \$12,000; grand total = \$42,000.
:::

:::check
Q: A build-up estimate omits risk. Why is this a problem, even if the line-item estimates are accurate?
* It captures only defined tasks and misses unknown-unknowns (integration, rework, unforeseen scope)
- The hourly rates are probably too high
- It will never converge with a parametric estimate
> Bottom-up is built from what you *know*. Historically unplanned work still happens.
:::`
    },
    {
      id: 'other', title: 'Other Techniques and Data', summary: 'Expert opinion, extrapolation, should-cost, and factors',
      body: String.raw`Several supplementary methods fill gaps or validate the primary techniques.

### Expert Opinion / Engineering Judgment

Use when no data exists. A subject matter expert estimates directly, often as a **low / most likely / high** range (see Module 10).

**Watch for**: availability heuristic (recent/memorable cases bias the estimate), optimism bias, Dunning-Kruger (overconfidence in one's knowledge), planning fallacy (underestimating duration/difficulty).

Best practice: **structure** the elicitation (formal low/likely/high), document assumptions, and use **multiple** experts to reduce individual bias.

### Extrapolation from Actuals

Use the program's **own** historical costs (earlier units, lots, actual performance data) to project future costs. Examples:

- Learning curves on earlier production lots (Module 7)
- EVM-based Estimate at Completion (EAC)
- Actual cost growth from prior phases

**Advantage**: Most credible once actuals exist; based on the *same* program, not analogies.

### Should-Cost Estimating

A build-up-like technique focused on what a system *should* cost under efficient operations, rather than what historical data says it *has* cost. Used to identify cost-reduction opportunities and set aggressive but achievable targets.

### Factor and Ratio Estimating

Cost as a percentage or ratio of another element. Examples:

- Systems Engineering / Program Management (SEPM) = 12% of prime mission product cost
- Sustaining support = \$X per year per unit in fleet

:::check
Q: You have actual cost data from units 1–3 of a 10-unit production run. Which technique is most appropriate for units 4–10?
- Analogy
- Parametric
* Extrapolation from actuals (e.g., learning curve)
> The program's own history is the most relevant and credible data.
:::

:::check
Q: An expert thinks software effort should be 15% lower than historical norms due to a new tool. This is best used as…
- The primary estimate
* A sensitivity check on the primary estimate or a constraint on assumed improvement
- A reason to discard all historical data
> Expert judgment can inform assumptions but should not replace data-based estimates entirely.
:::`
    },
    {
      id: 'selection', title: 'Choosing and Cross-Checking', summary: 'Estimate requirements, technique selection, top-down vs. bottom-up',
      body: String.raw`### Estimate Requirements

Before selecting a technique, define the purpose:

- **Purpose**: budget, independent estimate, source selection, affordability analysis, should-cost, milestone decision
- **Required accuracy**: ROM (rough order of magnitude, ±30%–50%) vs. budget-quality (±10%–15%) vs. negotiation-detail
- **Time and resources** available for the estimate
- **Audience**: who reviews, and what level of defensibility do they require

### Top-Down vs. Bottom-Up

| Aspect | Top-Down | Bottom-Up |
|---|---|---|
| **Techniques** | Analogy, parametric | Build-up |
| **Program phase** | Early (concept/design) | Later (detailed design/production) |
| **Speed** | Fast | Slow |
| **Detail/traceability** | Low | High |
| **Captures unknown-unknowns** | Better (historical actuals include real problems) | Worse (only known, defined tasks) |

**Key insight**: Top-down methods (analogy, parametric) implicitly capture real-world cost growth because they are based on what systems *actually* cost, including unforeseen problems. Bottom-up (build-up) captures known scope but needs an explicit risk allowance.

+++

### Cost Element Structure (CES)

Organize the estimate hierarchically (aligned with the WBS) so that:

1. Each element can be assigned the **most appropriate technique**
2. Nothing is **missed or double-counted**
3. The estimate **maps to** how data is collected and tracked
4. The structure is **consistent** across the program life cycle, enabling historical database development

Different WBS elements in the *same* estimate may use *different* techniques (e.g., build-up for hardware, parametric for software, analogy for a subsystem lacking detail).

+++

### Cross-Checking

A credible estimate should be validated by an **independent technique**:

- Build-up estimate → cross-check with a top-down parametric or analogy estimate
- Parametric estimate → cross-check with analogy or a build-up of a critical element
- Large convergence → confidence in the estimate
- Large divergence → investigate (data quality, assumptions, scope definition, technique misapplication)

**Never average** divergent results; **investigate** the cause.

:::check
Q: Your primary estimate is a detailed build-up (\$15M). A parametric cross-check yields \$18M. You should…
- Split the difference at \$16.5M
- Discard the parametric estimate as less detailed
* Investigate why they diverge; check data quality, assumptions, scope, and technique application
> Convergence confirms; divergence signals a problem that must be resolved.
:::

:::check
Q: Prime mission product cost = \$200M. Historical SEPM factor = 12%. SEPM estimate?
= 24
> $0.12 \times 200 = 24$ (in millions).
:::`
    },
    {
      id: 'lifecycle', title: 'Life Cycle and Technique Progression', summary: 'Early techniques to late techniques as data matures',
      body: String.raw`As a program matures, design detail and actual data grow, and the preferred technique shifts.

### Technique by Phase

| Phase | Data Maturity | Preferred Technique(s) |
|---|---|---|
| **Concept / Materiel Solution Analysis** | Minimal; concept only | Analogy, high-level parametric, expert opinion |
| **Technology Development** | Some preliminary design | Parametric, refined analogy |
| **Engineering & Manufacturing Development** | Detailed design, early prototypes | Parametric transitioning to build-up |
| **Production & Deployment** | Detailed drawings, vendor quotes, early actuals | Build-up, extrapolation from actuals |
| **Operations & Support** | Operating history accumulating | Actuals-based trends, parametric O&S drivers |

### Key Principle

- **Early** (concept phase): **top-down** — analogy, parametric. Quick, works with little detail, inherently captures integration and unknowns.
- **Late** (EMD/production): **bottom-up** — build-up, actuals. Detailed, defensible, but needs mature design and explicit risk reserves.
- **Credibility grows** as real data replaces assumptions.

### When to Re-estimate

Technique selection is not "set and forget." **Update at each milestone** to reflect the data and method appropriate at that time. Early estimates carry **wide confidence ranges**; later estimates can **tighten ranges** but must still add risk/growth allowances.

+++

:::check
Q: A missile program is in concept phase with only top-level requirements and one similar historical system. Best pair of techniques?
* Analogy and parametric
- Build-up and expert opinion
- Actuals-based extrapolation
> Minimal design detail and limited data favor top-down analogy and parametric approaches.
:::

:::check
Q: Lots 1–2 of a production missile have actual costs. Estimating lot 3, the best technique is…
- Analogous missile from another program
- Expert engineering judgment
* Extrapolation from the program's own actuals (learning curve)
> Own actuals are more credible and relevant than external analogs.
:::

:::challenge method-phase
Q: Slide through the phases. In which phase does engineering build-up first become the leading technique?
* Production & deployment
- Engineering & Manufacturing Development
- Technology development
- Operations & support
> In EMD the estimate is still mostly parametric while build-up grows. By production, detailed drawings, vendor quotes and early actuals make build-up the main technique. In O&S, actuals-based trends take over.
:::`
    },
    {
      id: 'related', title: 'Below-the-Line and Operations & Support', summary: 'Factor estimating and O&S cost structure',
      body: String.raw`### Below-the-Line Factors

Cost elements that are typically estimated as **percentages** (factors) applied *on top* of a prime/base cost, rather than estimated in detail:

- **Overhead (OH)**: indirect labor, facilities
- **General & Administrative (G&A)**: overhead of overhead
- **Cost of Money (COM)**: financing / facilities capital cost
- **Fee / Profit**: contractor profit or fee

**Formula:**
$$Price = Base \times (1 + OH) \times (1 + G\&A) \times (1 + Fee)$$

Factors come from contractor forward pricing rate agreements or historical accounting data, not independent element-by-element estimation.

:::key
Below-the-line factors are applied sequentially (*multiplicative*), not summed. The order matters: typically base → OH → G&A → fee.
:::

### Operations & Support Estimating

O&S cost is often the **largest share of total life-cycle cost**, even though it's estimated with little design detail at program start. O&S includes:

- Unit-level manpower
- Unit operations (fuel, consumables, training)
- Maintenance (planned, unplanned)
- Sustaining engineering and system improvements
- Indirect support / infrastructure

**Techniques**: O&S estimates lean on **analogy** to similar fielded systems or **parametric relationships** tied to **operating tempo** drivers (e.g., flight hours, steaming days, operating hours per year).

**Key point**: As actual sustainment data accumulates over the system's life, O&S estimates should be **updated/refined** using that experience (extrapolation from actuals).

:::check
Q: Which life-cycle phase usually accounts for the largest share of total ownership cost for long-lived weapon systems?
- Research and development
- Production
* Operations & Support
- Disposal
> O&S runs for decades; R&D and production are one-time. O&S dominates LCC.
:::`
    }
  ],
  cards: String.raw`
## Uncertainty & Risk
Q: Uncertainty vs. risk in cost estimating
A: Uncertainty: natural statistical variability in an estimate given the data/method (describable with a distribution). Risk: a specific identifiable event with probability and consequence.
Q: Why does a point estimate from "most likely" values usually fall below the mean?
A: Cost distributions are right-skewed; overruns can be large but underruns are limited.
Q: Opportunity (in risk/uncertainty terms)
A: An uncertain event with a positive effect on cost or schedule.
Q: Common sources of cost growth
A: Requirements creep, immature technology (low TRL), optimistic assumptions, poor analogy selection, inadequate data, external factors (inflation, funding instability).
Q: Right-skewed cost distribution
A: Mean > mode; possible large overruns, but limited underruns. Point estimate from most-likely falls below mean.

## Analogy
Q: Definition of analogy technique
A: Estimate a new system from one (or a few) similar historical systems, adjusted for differences in size, complexity, technology.
Q: Analogy scaling formula
A: $Cost_{new} = Cost_{analogy} \times (Parameter_{new}/Parameter_{analogy})^x$, where x = scaling exponent.
Q: Linear scaling in analogy
A: x = 1; cost is proportional to the parameter (e.g., weight-cost).
Q: Analogy factor adjustment
A: $Cost_{new} = Cost_{analogy} \times f_1 \times f_2 \times ...$; multiplicative judgment factors.
Q: Analogy pros and cons
A: Pros: fast, cheap, based on real data, works early. Cons: one (or few) data point(s), subjective adjustments, a good analog may not exist.
Q: Analogy scaling exponent 0.5 interpretation
A: Square-root relationship; doubling the parameter increases cost by ~41% (√2 ≈ 1.41).

## Parametric
Q: Definition of parametric technique
A: Use statistical relationships (CERs) built from many historical data points relating cost to measurable parameters.
Q: Cost Estimating Relationship (CER)
A: A statistical equation $Cost = f(parameters)$ derived from regression on historical data.
Q: Linear CER form
A: $Cost = a + bX$; constant intercept and slope. a = fixed cost, b = cost per unit of X.
Q: Power CER form
A: $Cost = aX^b$; proportional relationship. Preferred for technical cost drivers (weight, power, lines of code).
Q: CER validity requirements
A: Good $R^2$ and t/F statistics; operationally reasonable (makes physical sense); derived from comparable, homogeneous data.
Q: Parametric pros and cons
A: Pros: statistically defensible, objective, repeatable, quantifies uncertainty, fast. Cons: needs sufficient normalized data, risk of extrapolation outside data range.
Q: Extrapolation risk
A: Applying a CER far outside the range of historical data used to build it produces unreliable predictions.

## Build-up
Q: Definition of build-up (engineering / bottom-up)
A: Estimate at the lowest WBS level (labor hours × rates, materials, ODC) and sum to total.
Q: Build-up formula
A: $Cost = \sum (Hours_i \times Rate_i) + \sum Materials_i + ODC$
Q: Labor cost element calculation
A: Hours × burdened hourly rate; include all overhead, fringe, and indirect costs in the rate.
Q: Other direct costs (ODC)
A: Tooling, test, travel, and special equipment; direct to the task but not labor or material.
Q: Build-up pros and cons
A: Pros: detailed, precise, highly traceable, good for negotiation. Cons: slow, needs mature design, small errors compound, misses unknowns.
Q: Build-up and unknown-unknowns
A: A bottom-up estimate is built only from known, defined tasks; it systematically excludes unforeseen problems and integration risks unless an explicit reserve is added.
Q: Management reserve
A: An explicit allowance added on top of a build-up estimate to cover unknowns, unidentified scope, and risk — essential for realism.

## Other Techniques
Q: Expert opinion / engineering judgment
A: A subject matter expert estimates directly, often as low/likely/high. Use when no data exists; watch for bias (availability, optimism, planning fallacy).
Q: Extrapolation from actuals
A: Use the program's own historical costs (earlier units, actual EVM data) to project remaining or future costs (e.g., learning curves).
Q: Should-cost estimating
A: Build-up-like technique focused on what a system should cost under efficient operations, used to identify cost-reduction opportunities.
Q: Factor/ratio estimating
A: Estimate a cost as a percentage or ratio of another cost (e.g., SEPM = 12% of prime mission product).

## Technique Selection
Q: Estimate requirements that drive technique choice
A: Purpose, required accuracy/fidelity, time/resources available, audience/defensibility level, program phase.
Q: ROM (rough order of magnitude) accuracy
A: ±30% to ±50%; appropriate for early concept estimates with limited data (analogy, parametric).
Q: Budget-quality estimate accuracy
A: ±10% to ±15%; supports budget allocation; typically build-up or refined parametric.
Q: Top-down vs. bottom-up techniques
A: Top-down: analogy, parametric; bottom-up: build-up. Top-down is fast, captures unknowns; bottom-up is detailed, misses unknowns.
Q: Cost Element Structure (CES)
A: Hierarchical breakdown of estimate by cost element, aligned with WBS; allows different techniques per element and maintains consistency.
Q: Cross-checking estimates
A: Validate primary estimate with an independent technique; convergence confirms, large divergence signals need to investigate.
Q: What to do when two techniques give divergent results
A: Investigate the cause (data quality, assumptions, scope, technique misapplication); do not average them.

## Life Cycle
Q: Technique progression across the program life cycle
A: Early (concept): top-down analogy/parametric. Mid (EMD): parametric transitioning to build-up. Late (production): build-up and actuals.
Q: Early estimate confidence ranges
A: Analogy/parametric estimates carry wide ranges; inherently include integration and unknown-unknowns.
Q: Late estimate confidence ranges
A: Build-up estimates can support tighter ranges but must still add risk/growth allowances for unknowns.
Q: When to re-estimate
A: At each program milestone to reflect updated data, design maturity, and the technique appropriate to that phase.
Q: Concept phase techniques (Materiel Solution Analysis)
A: Analogy, high-level parametric, expert opinion. Minimal design detail; focus on rapid ROM.
Q: Production phase techniques
A: Build-up, extrapolation from actuals, parametric on production efficiency drivers.
Q: O&S phase estimation
A: Parametric on operating tempo (flight hours, operating hours), analogy to similar fielded systems, actuals from accumulated sustainment data.

## Related Topics
Q: Below-the-line factors
A: Overhead, G&A, cost of money, fee — applied as percentages on top of prime/base cost.
Q: Below-the-line factor formula
A: $Price = Base \times (1 + OH) \times (1 + G\&A) \times (1 + Fee)$; factors are multiplicative, applied in sequence.
Q: SEPM
A: Systems Engineering / Program Management; typically estimated as 10–15% of prime mission product cost.
Q: Cost of Money (COM)
A: Financing cost or facilities capital cost factor applied below-the-line.
Q: O&S cost elements
A: Manpower, operations (fuel, consumables), maintenance, sustaining engineering, indirect support.
Q: O&S as share of life-cycle cost
A: Often 50–80% or more of total ownership cost for long-lived systems; dominates the life-cycle cost profile.
Q: O&S cost drivers
A: Operating tempo (flight hours, steaming days), unit population, maintenance labor rates, parts consumption rates.
Q: Updating O&S estimates
A: As actual sustainment data accumulates, update/refine O&S forecasts using extrapolation from actuals.
`
});
