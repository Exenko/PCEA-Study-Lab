PCEA.addModule({
  id: 'm02', num: 2, title: 'Cost Estimating Methods', short: 'Estimating Methods', source: 'guide',
  blurb: 'Analogy, parametric, build-up, and other techniques: when to use each, how to cross-check, and why uncertainty matters.',
  intro: String.raw`An estimate is never a single "true" number — it is a range built from data, relationships, or logic, always accompanied by uncertainty.

**The core challenge:** select a technique (or blend of techniques) appropriate to **data availability**, **program maturity**, and **required accuracy**.

**The four families**: analogy, parametric, build-up, and other (expert opinion and extrapolation from actuals).`,
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

### Past, Present, Future

Cost estimating draws on the **past** (historical cost and other data collected on analogous systems), works in the **present** (normalizing and analyzing that data to build estimating tools), and projects to the **future** (applying those tools to the new system). There is roughly a symmetrical balance between how far an estimate reaches into the future and how far the supporting data reaches into the past — estimating farther out, with new designs and new ways of doing business, requires more historical data to support it.

### Precision vs. Accuracy

**Precision** is the spread of the range of outcomes the estimate produces (a narrow range is more precise). **Accuracy** is whether that range is centered on the true value. Both are desirable, but **accuracy is more important** — precision can give a false sense of security.

**Example**: NOAA's preseason forecasts of North Atlantic hurricanes (1999–2007) captured the actual count within the predicted range in only 3 of 8 years (a ~37.5% confidence interval) — the forecasts looked precise (a narrow range) but weren't, because the true value fell outside the range most of the time. The average prediction, however, understated the actual average by less than one hurricane per year — the forecasters were better with risk (the central tendency) than with uncertainty (the spread).

+++

### Risk vs. Uncertainty

- **Uncertainty**: natural statistical variability in an estimate given the data and method — describable with a distribution (e.g., ± prediction interval)
- **Risk** (CEBoK's definition in this module): the **upward shift** applied to the cost estimate range because unadjusted estimates tend to be **systematically low**. It corrects an inherent bias and improves accuracy. Example: if costs come in on average 20% higher than the estimates, add 20% to the estimate — not atypical of historical cost growth.

:::tip Beyond CEBoK
In general risk management (and in Module 9), a **risk** is also described as a discrete event with a **probability** and a **consequence**, and an **opportunity** is an uncertain event with a positive effect.
:::

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
Q: Historically, a program type's actual costs come in about 20% above its estimates. Per CEBoK Module 2, adding 20% to a new estimate of that type accounts for…
* Risk (an upward shift correcting systematic underestimation)
- Uncertainty (the precision of the estimate)
- A sunk cost
- An opportunity
> CEBoK: risk is the upward shift applied to the estimate range because unadjusted estimates tend to be systematically low. Uncertainty describes the range (precision) around the estimate.
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
      body: String.raw`Estimate a new system from **one** (or a few) similar, historical systems, adjusted for differences in size, performance, complexity, or technology. Analogy is a one-for-one comparison, and is useful even alongside more detailed techniques as a cross-check (the estimates should at least be the same order of magnitude).

### Process

1. Identify an analogous system (similar function, technology, design)
2. Obtain the historical cost, normalized for inflation and quantity
3. Identify differences between the analogy and the new system
4. Apply an adjustment (a ratio, scaled from a parameter the two systems share)

### Scaling Formula

An adjusted analogy is a **ratio**: it is equivalent to a linear equation whose graph passes through the origin. Because the analogy is a *single* data point, one point cannot determine a line by itself — so the line is *assumed* to pass through the origin. Any estimate built this way is, by definition, estimating outside the range of the data.

$$Cost_{new} = Cost_{analogy} \times \frac{Parameter_{new}}{Parameter_{analogy}}$$

**Example**: An existing engine (F-100) actually cost \$5.2M and produced 12,000 lb of thrust. A new engine (F-200) needs 16,000 lb of thrust. The thrust ratio is $16{,}000/12{,}000 = 1.33$, so:
$$Cost_{new} = 1.33 \times \$5.2M \approx \$6.9M$$

Equivalently, compute a **rate** from the known point ($\$5.2M / 12{,}000\ lb = \$433K/lb$; CEBoK prints \$443K/lb, a typo) and multiply by the new system's thrust ($16{,}000\ lb$) — both views give the same \$6.9M.

There should be a mathematical, scientific, or logical reason for the ratio's adjustment parameter — is there really a reason cost is directly proportional to thrust for an engine? Relationships tied to **physical properties** are often easier to justify than performance measures: linear feet for cabling of the same cross-section, surface area for a wing or hull of identical thickness/composition, mass or volume for a solid component.

An analogy works best when there are many similarities between old and new systems, adjustments are **quantitative, not qualitative**, and subjective adjustments are minimized. "20% more complex" with no rationale is not acceptable; "20% more integrated circuits" or "20% more weight" is.

+++

### Uncertainty and Risk

- **Point-of-departure uncertainty**: is the chosen analogous system truly analogous to the new one?
- **Relationship uncertainty**: the linear, through-the-origin relationship is assumed, not verified — the true underlying relationship between old and new system is unknown (if it were known, use parametric instead)
- **Uncaptured risk**: the new system may carry risks the old system's costs never captured — new technology, economic conditions (e.g., inflation), the labor environment
- **Scaling-quantity growth**: as the program matures and the design changes, the scaling parameter itself may grow; historical growth in that quantity (size, power, weight, SLOC) is itself a source of risk

+++

### Pros and Cons

**Pros**: Fast and cheap; based on real data; works early with little design detail; easy to defend when the systems are very similar and a sufficient database exists.

**Cons**: A single (or few) data point(s); too easy to make overly subjective adjustments; a good analog may not exist; estimating with an adjusted analogy is inherently estimating outside the range of the data.

:::tip Beyond CEBoK
Some analysts instead scale by a power law, $Cost_{new} = Cost_{analogy} \times (Param_{new}/Param_{analogy})^{b}$, treating $b$ as a parametric-style curve-fitting exponent. This is not the source's linear-ratio treatment: a single analog point can't determine a curve's exponent any more than it can determine a line's slope from data — $b$ has to come from somewhere else (e.g., an assumed economy-of-scale curve).
:::

:::check
Q: An existing engine cost \$5.2M and produced 12,000 lb of thrust. The new engine needs 16,000 lb of thrust. Using the linear-ratio analogy method, estimate the new engine's cost.
= 6.93 ±0.05
> Ratio = $16{,}000/12{,}000 = 1.33$; $Cost_{new} = 1.33 \times \$5.2M \approx \$6.9M$.
:::

:::check
Q: Why is any estimate from an adjusted analogy considered "estimating outside the range of the data"?
* The analogy is a single data point, so the line through it and the origin is assumed, not fit to multiple points
- The analogy technique always underestimates cost
- Analogies can only be used for early concept estimates
> One point can't determine a line; assuming it passes through the origin is a necessary but unverified leap.
:::

:::check
Q: Which technique is most at risk of defending poor analogy choices?
* Analogy
- Parametric
- Build-up
> Analogy relies on a single (or few) analog(s) and subjective adjustments with no statistical rigor.
:::

:::challenge analogy c0=5.2 s0=12000 s1=16000 cx=1 powerOn=0 b=1 lock=c0,s0,cx,powerOn,b
Q: The F-100 engine actually cost \$5.2M and produced 12,000 lb of thrust. The new F-200 needs 16,000 lb. Using the source's linear-ratio analogy, predict the F-200's cost.
predict: linear ±0.05
> Ratio = $16{,}000/12{,}000 = 1.33$; $Cost_{new} = 1.33 \times \$5.2M \approx \$6.9M$.
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

### Standards and Variance Factors

The foundation of build-up is a **standard**: how long a task takes, based on time-and-motion studies done in a controlled, **optimal** production environment. Because no one actually operates at that optimum, a **variance (realization) factor** is calculated from a company's actual historical performance against the standard, and applied to convert standard hours into realistic estimated hours.

Labor also splits into **touch** labor (workers, human or robotic, actually handling and working the product — e.g., building a circuit card) and **non-touch/support** labor (quality assurance, sustaining engineering). Support labor is often estimated as a **factor of touch labor**.

**Worked example** (JSF inlet nacelle, by analogy to the F/A-18 E/F program): the standard for the sheet-metal element is **2,000 touch labor hours**. The F/A-18 E/F program is running a **20% variance** (actuals to standard) and a **48% support-labor factor**.

- Touch hours: $2{,}000 \times 1.2 = 2{,}400$ hours
- Support hours: $2{,}400 \times 0.48 = 1{,}152$ hours
- Total: $2{,}400 + 1{,}152 = 3{,}552$ hours

Labor rates then convert these hours to cost. Note build-up often borrows from the other techniques: the standard and variance factor here came from an *analogy* to the F/A-18 E/F, and the factors themselves are essentially *parametric* relationships.

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
:::

:::check
Q: A standard is 2,000 touch labor hours. The variance factor is 20% and the support-labor factor is 48% of touch hours. Total estimated hours?
= 3552
> Touch: $2{,}000 \times 1.2 = 2{,}400$; support: $2{,}400 \times 0.48 = 1{,}152$; total = $2{,}400 + 1{,}152 = 3{,}552$ hours.
:::

:::widget buildup-hours std=2000 variance=1.2 support=48:::

:::challenge buildup-hours std=2000 variance=1.2 support=48 lock=std,variance,support
Q: Using the JSF inlet-nacelle example (standard 2,000 hours, 20% variance factor, 48% support factor), predict the total estimated hours.
predict: total ±0.5%
> Touch: $2{,}000 \times 1.2 = 2{,}400$; support: $2{,}400 \times 0.48 = 1{,}152$; total = $3{,}552$ hours.
:::`
    },
    {
      id: 'other', title: 'Other Techniques and Data', summary: 'Expert opinion, extrapolation from actuals, and factor/ratio estimating',
      body: String.raw`Two supplementary methods fill gaps or validate the primary techniques: **expert opinion** and **extrapolation from actuals**.

### Expert Opinion / Engineering Judgment

Use expert opinion only as a last resort, when other methods aren't available or valid — it is hard to justify as a primary method and hard to run risk around. Use it when no data exists, or to corroborate/adjust objective data (as in analogy adjustments) and to explain an apparent outlier. Named elicitation approaches:

- **One-on-one interviews**: request any available documentation from the expert; iterate if possible
- **Round-table discussion**: multiple experts present all sides of an issue and stay in the room until they reach consensus, documenting areas of risk
- **Delphi technique**: a group of experts answers **anonymously** (so no single person dominates), the results are summarized and sent back for another round, iterating toward convergence on a single number or a tighter range — a specific Operations Research technique

Don't ask experts to estimate outside the bounds of their experience; get another expert for areas outside their scope; validate credentials; formulate consensus after individual consultation. Always dig into *what data the opinion is based on* and document that source — expert opinion with no accompanying rationale is neither a valid technique nor sound practice.

:::tip Beyond CEBoK
Common ways experts go wrong: the availability heuristic (recent/memorable cases bias the estimate), Dunning-Kruger (overconfidence in one's own knowledge), and the planning fallacy (underestimating duration or difficulty).
:::

**Uncertainty and risk**: people are not great random-number generators — they tend to **understate both variance (spread) and randomness**. Expert opinion is grounded in anecdotal, and often faulty, recollection: an expert may remember a report taking "a week" (40 hours) but forget the overtime or the rework from review comments — so **faulty recollection tends to understate effort**.

### Extrapolation from Actuals

An umbrella term for using actual costs from past or current items to predict future costs of the *same* item — not one of the three core techniques, but often combined with them (e.g., actuals feeding a parametric relationship or an analogy). Variants:

- **Averages**: simple or moving average of actual unit costs to date, used as the prediction for future units
- **Learning curves**: the most common variant — cumulative-average or unit theory, Learning Curve Slope (LCS), theoretical first-unit cost (Module 7)
- **Estimate at Completion (EAC)**: uses actual cost and schedule data with Earned Value Management to project cost at completion (Module 15)

**Advantage**: Most credible once actuals exist; based on the *same* program, not analogies.

:::tip Beyond CEBoK
**Should-cost estimating** is a related, build-up-like technique focused on what a system *should* cost under efficient operations, rather than what historical data says it *has* cost — used to find cost-reduction opportunities and set aggressive but achievable targets. It's a program-management tool alongside the core techniques, not one of the "other" techniques itself.
:::

### Factor and Ratio Estimating

Cost as a percentage or ratio of another element. A common example is **SEITPM** — Systems Engineering, Integration & Test, and Program Management, taken together — estimated as a percentage of the program's **prime mission equipment** (hardware and software) cost.

:::tip Beyond CEBoK
Illustrative SEITPM percentages sometimes cited in practice run roughly 10-15% of prime mission equipment cost — but treat any specific percentage as program- and system-dependent, not a fixed rule.
:::

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

Before selecting a technique, understand why the estimate is being done — this drives what's needed and how soon:

- **Purpose**: milestone decisions, budget development, ROM estimates, alternatives comparisons, proposal development/evaluation
- **How much detail is required**, and how soon the estimate is needed
- **What data is available**
- **Audience**: who reviews, and what level of defensibility do they require

An estimate for a milestone decision, for example, requires more detail than a ROM.

:::tip Beyond CEBoK
Rules of thumb sometimes used in practice: ROM (rough order of magnitude) accuracy around ±30-50%; budget-quality accuracy around ±10-15%. Treat these as illustrative, not fixed standards.
:::

### Top-Down vs. Bottom-Up

| Aspect | Top-Down | Bottom-Up |
|---|---|---|
| **Techniques** | Analogy, parametric | Build-up |
| **Program phase** | Early (concept/design) | Later (detailed design/production) |
| **Speed** | Fast | Slow |
| **Detail/traceability** | Low | High |
| **Unknown-unknowns unique to the new system** | Not captured — analogy/parametric are based on what an *old* system cost, which never included the new system's own new-technology, economic, or labor-environment risks | Also not captured — only known, defined tasks; needs an explicit risk allowance |

**Key caveat (from the source)**: neither approach is safe from unknown-unknowns. Top-down (analogy, parametric) estimates are built on the *old* system's actual costs, which by definition never captured risks unique to the *new* system — new technology, economic conditions, the labor environment. Bottom-up (build-up) captures only known, defined scope. Either way, an explicit risk/uncertainty treatment is required — see Module 9.

+++

### Cost Element Structure (CES)

Organize the estimate hierarchically (aligned with the WBS) so that:

1. Each element can be assigned the **most appropriate technique**
2. Nothing is **missed or double-counted**
3. The estimate **maps to** how data is collected and tracked
4. The structure is **consistent** across the program life cycle, enabling historical database development

Different WBS elements in the *same* estimate may use *different* techniques (e.g., build-up for hardware, parametric for software, analogy for a subsystem lacking detail). Cost elements are also classified by:

- **Program phase** (development, production, or O&S)
- **Appropriation** (RDT&E, procurement, or O&M)
- **Funding source**
- **Non-recurring vs. recurring** cost
- **Direct vs. indirect** cost

+++

### Technique Selection

1. **Research** all potential techniques from every source: customer-mandated models, an estimator's own library of techniques, and developing new ones where needed.
2. **Compare** candidate techniques against each other and against the requirements: look at the underlying data, run statistical comparisons, and make sure nothing is overlooked.
3. **Avoid outdated techniques** — a technique built on old data may not accurately estimate new technology — and **verify the technique fits the program phase**.
4. **Select** the technique most appropriate for the element (or develop one), plus a **secondary technique as a cross-check**.

### Checking Results

Three levels of rigor, increasing in detail, fidelity, and persuasiveness:

- **Cross-check**: a test of reasonableness — doesn't need the exact same number, just the same order of magnitude
- **Validation**: more detailed — the intent is to get *nearly* the same result using a different technique or tool
- **Independent Cost Estimate (ICE)**: the most detailed and persuasive level of corroboration

**Never average** divergent results; **investigate** the cause (data quality, assumptions, scope definition, technique misapplication).

:::widget techniques-compare x=110 showAvg=1 showAnalogy=1 analogyPt=2 showParam=1 showCal=1 calPt=5:::

:::challenge techniques-compare x=110 showAvg=0 showAnalogy=0 analogyPt=2 showParam=0 showCal=0 calPt=5 lock=x,analogyPt,calPt
Q: All four legitimate techniques run on the *same* illustrative dataset. Turn all four on and watch the spread between their estimates grow past 20.
goal: spread > 20
show: showAvg=1 showAnalogy=1 showParam=1 showCal=1
> Even with no bad data, an average, an analogy through one point, an OLS fit, and a CER calibrated through a different point disagree — a large spread signals to investigate (data quality, assumptions, technique fit), never to average.
:::

### Documentation

Document the ground rules, assumptions, data, and calculations behind the estimate — if in doubt, include it. **Replicability is the acid test**: another analyst should be able to recreate the estimate from the documentation alone. A well-documented estimate is more credible.

:::check
Q: Your primary estimate is a detailed build-up (\$15M). A parametric cross-check yields \$18M. You should…
- Split the difference at \$16.5M
- Discard the parametric estimate as less detailed
* Investigate why they diverge; check data quality, assumptions, scope, and technique application
> Convergence confirms; divergence signals a problem that must be resolved.
:::

:::check
Q: Rank cross-check, validation, and ICE from least to most rigorous.
* Cross-check, validation, ICE
- Validation, cross-check, ICE
- ICE, validation, cross-check
> Cross-check only needs the same order of magnitude; validation seeks nearly the same result via a different technique; ICE is the most detailed and persuasive.
:::

:::check
Q: What is the "acid test" for estimate documentation?
* Another analyst could recreate the estimate from the documentation alone
- The estimate matches the budget exactly
- The documentation is shorter than the estimate itself
> Replicability: sufficient detail that someone else could reproduce the work.
:::

:::check
Q: Prime mission equipment cost = \$200M. An illustrative SEITPM factor of 12% is used. SEITPM estimate?
= 24
> $0.12 \times 200 = 24$ (in millions); the 12% figure here is illustrative (Beyond CEBoK), not a source-given constant.
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

- **Early** (concept phase): **top-down** — analogy, parametric. Quick, works with little detail. Top-down estimates carry wide ranges because historical data may not reflect the new system's unique risks.
- **Late** (production): **bottom-up** — build-up, actuals. Detailed, defensible, but needs mature design and explicit risk reserves.
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
      id: 'related', title: 'Below-the-Line, Schedule, and Operations & Support', summary: 'Factor estimating, schedule estimating, and O&S cost structure',
      body: String.raw`### Below-the-Line Factors

Below-the-line (BTL) factors are also known as **cost-on-cost CERs**: they use the cost of another element to predict cost through a simple multiplicative relationship. They're **unitless**, often expressed as a **percentage**, and typically model support functions — SEITPM (systems engineering, integration & test, program management) — as a percentage of the program's **prime mission equipment**.

BTL factors are similar in application to burdens like overhead and G&A, but **less deterministic** — they may **not** be statistically based. They should vary by system/program and, ideally, be **derived statistically from history**. Because a BTL-derived cost is based on an already-estimated cost (with its own risk and uncertainty), that must be carried through the risk analysis (model with functional correlation).

:::tip Beyond CEBoK
Contract pricing sometimes layers burdens multiplicatively on a base cost: $Price = Base \times (1+OH) \times (1+G\&A) \times (1+Fee)$, applied in sequence (base -> OH -> G&A -> fee). This pricing-burden formula belongs to contract pricing (Module 14), not to BTL cost-on-cost CERs.
:::

### Schedule Estimating

The same three techniques used for cost can predict a project's **schedule** — important because it affects both cost time-phasing and the total cost of time-dependent elements.

- **Analogy**: scale a similar project's historical schedule. Example: System A (10 components) took 40 months to integrate — a rate of 4 months/component. System B (15 components): $15 \times 4 = 60$ months (rate view), or equivalently $40 \times (15/10) = 60$ months (ratio view). **Caveat**: integration complexity may not scale linearly with the number of components — it could grow faster (worse than 60 months) or, if there's a large fixed non-recurring piece, slower.
- **Parametric (Schedule Estimating Relationship, SER)**: a statistical relationship between schedule and a schedule-driving parameter (e.g., total labor hours) built from multiple historical efforts. From the source figure: $y = 0.1x + 3.1163$, $R^2 = 0.9769$, relating schedule duration (months) to total labor hours. The slope lets you back out an approximate average manning level for the predicted duration.
- **Build-up**: sum the durations of lower-level work tasks. Beware **deterministic sums on network schedules** — understand the critical path. A build-up schedule estimate will almost always need a **Monte Carlo simulation** to translate individual task-duration estimates into a top-level schedule distribution.

### Operations & Support Estimating

O&S costs are normally a large portion of total life-cycle cost — **some sources cite 70-80% for certain types of systems** — and are often excluded or overlooked in decision-making. O&S includes costs for:

- Personnel
- Consumable and repairable materials
- Organizational, intermediate, and depot maintenance (hardware and software)
- Facilities
- Sustainment

**Technique examples**:

- **Analogy**: System A is analogous to System B for annual software maintenance cost. System A: 2.5M SLOC, \$7.5M/yr. System B: 5M SLOC. Rate view: $\$7.5M / 2.5M = \$3/SLOC$, so $\$3 \times 5M = \$15M$. Ratio view: SLOC ratio $5M/2.5M = 2.0$, so $2.0 \times \$7.5M = \$15M$ — both mathematically equivalent.
- **Parametric**: ship overhaul cost vs. average ship age shows a **non-linear** relationship.
- **Build-up**: a reliability-based logistics model, such as the Army's Cost Analysis Strategy Assessment (CASA) — a bottom-up total-ownership-cost tool built from lower-level logistics costs, ideally derived from standard relationships and reliability data like Mean Time Between Failures (MTBF) and Mean Time To Repair (MTTR).

**Key point**: As actual sustainment data accumulates over the system's life, O&S estimates should be **updated/refined** using that experience (extrapolation from actuals).

:::check
Q: Which life-cycle phase usually accounts for the largest share of total ownership cost for long-lived weapon systems?
- Research and development
- Production
* Operations & Support
- Disposal
> Some sources cite 70-80% for certain types of systems; O&S runs for decades while R&D and production are one-time.
:::

:::check
Q: System A (10 components) took 40 months to integrate. Estimate System B's (15 components) integration schedule by analogy.
= 60
> Rate: 4 months/component x 15 = 60 months; equivalently, $40 \times (15/10) = 60$. Caveat: complexity may not scale linearly with component count.
:::

:::widget schedule-analogy nb=15 nonlinear=0:::

:::challenge schedule-analogy nb=15 nonlinear=0 lock=nb,nonlinear
Q: System A (10 components) took 40 months to integrate — a rate of 4 months/component. Predict System B's (15-component) schedule using the linear rate.
predict: linearMonths ±0.5%
> $15 \times 4 = 60$ months, equivalently $40 \times (15/10) = 60$.
:::

:::check
Q: A schedule SER is $y = 0.1x + 3.1163$ with total labor hours $x$. Estimate the schedule (months) for a 600-hour effort.
= 63.1163 ±0.1
> $y = 0.1(600) + 3.1163 = 60 + 3.1163 = 63.1163$ months.
:::

:::check
Q: Why does a build-up schedule estimate usually need Monte Carlo simulation, unlike a build-up cost estimate?
* Network/critical-path effects mean task durations can't just be deterministically summed
- Schedule estimates never use build-up
- Monte Carlo replaces the need for a critical path
> Simple sums ignore how task dependencies and the critical path drive the overall schedule distribution.
:::`
    }
  ],
  cards: String.raw`
## Uncertainty & Risk
Q: Uncertainty vs. risk in cost estimating
A: Uncertainty: natural statistical variability in an estimate given the data/method (describable with a distribution). Risk (CEBoK Module 2): the upward shift applied to the estimate range because unadjusted estimates tend to be systematically low (e.g., add 20% if costs historically run 20% high).
Q: Why does a point estimate from "most likely" values usually fall below the mean?
A: Cost distributions are right-skewed; overruns can be large but underruns are limited.
Q: Opportunity (in risk/uncertainty terms)
A: An uncertain event with a positive effect on cost or schedule.
R: yes
Q: Common sources of cost growth
A: Requirements creep, immature technology (low TRL), optimistic assumptions, poor analogy selection, inadequate data, external factors (inflation, funding instability).
Q: Right-skewed cost distribution
A: Mean > mode; possible large overruns, but limited underruns. Point estimate from most-likely falls below mean.
R: yes

## Analogy
Q: Definition of analogy technique
A: Estimate a new system from one (or a few) similar historical systems, adjusted for differences in size, complexity, technology.
R: yes
Q: Analogy scaling formula
A: $Cost_{new} = Cost_{analogy} \times (Parameter_{new}/Parameter_{analogy})$; a ratio equivalent to a linear equation through the origin.
R: yes
Q: Why does an adjusted analogy assume the line passes through the origin?
A: The analogy is a single data point; one point can't determine a line's slope, so the line is assumed to pass through the origin.
Q: F-100/F-200 engine analogy example
A: F-100 cost $5.2M at 12,000 lb thrust; F-200 needs 16,000 lb. Ratio = 16,000/12,000 = 1.33; $1.33 \times \$5.2M \approx \$6.9M$ (same result via the $433K/lb rate).
Q: What makes an analogy adjustment defensible?
A: A mathematical, scientific, or logical reason for the ratio parameter; adjustments tied to physical properties (mass, volume, surface area, linear feet) are easier to justify than performance measures.
Q: Analogy uncertainty and risk
A: Uncertainty in whether the point of departure is truly analogous and in the assumed linear relationship; risk from new-system factors the old system's costs never captured (new technology, economic conditions, labor environment) and from historical growth in the scaling quantity.
Q: Analogy pros and cons
A: Pros: fast, cheap, based on real data, works early, easy to defend with similar systems. Cons: one (or few) data point(s), subjective adjustments, a good analog may not exist, inherently estimates outside the data range.
Q: Analogy power-law exponent (Beyond CEBoK)
A: Some analysts scale by $Cost_{new} = Cost_{analogy} \times (Param_{new}/Param_{analogy})^b$; not the source's linear-ratio method — a single analog point can't determine the exponent $b$ either.
R: yes

## Parametric
Q: Definition of parametric technique
A: Use statistical relationships (CERs) built from many historical data points relating cost to measurable parameters.
R: yes
Q: Cost Estimating Relationship (CER)
A: A statistical equation $Cost = f(parameters)$ derived from regression on historical data.
R: yes
Q: Linear CER form
A: $Cost = a + bX$; constant intercept and slope. a = fixed cost, b = cost per unit of X.
R: yes
Q: Power CER form
A: $Cost = aX^b$; proportional relationship. Preferred for technical cost drivers (weight, power, lines of code).
R: yes
Q: CER validity requirements
A: Good $R^2$ and t/F statistics; operationally reasonable (makes physical sense); derived from comparable, homogeneous data.
Q: Parametric pros and cons
A: Pros: statistically defensible, objective, repeatable, quantifies uncertainty, fast. Cons: needs sufficient normalized data, risk of extrapolation outside data range.
Q: Extrapolation risk
A: Applying a CER far outside the range of historical data used to build it produces unreliable predictions.
R: yes

## Build-up
Q: Definition of build-up (engineering / bottom-up)
A: Estimate at the lowest WBS level (labor hours × rates, materials, ODC) and sum to total.
R: yes
Q: Build-up formula
A: $Cost = \sum (Hours_i \times Rate_i) + \sum Materials_i + ODC$
R: yes
Q: Labor cost element calculation
A: Hours × burdened hourly rate; include all overhead, fringe, and indirect costs in the rate.
Q: Other direct costs (ODC)
A: Tooling, test, travel, and special equipment; direct to the task but not labor or material.
R: yes
Q: Build-up pros and cons
A: Pros: detailed, precise, highly traceable, good for negotiation. Cons: slow, needs mature design, small errors compound, misses unknowns.
Q: Build-up and unknown-unknowns
A: A bottom-up estimate is built only from known, defined tasks; it systematically excludes unforeseen problems and integration risks unless an explicit reserve is added.
Q: Management reserve
A: An explicit allowance added on top of a build-up estimate to cover unknowns, unidentified scope, and risk — essential for realism.
R: yes
Q: Build-up standards
A: Developed from time-and-motion studies in an optimal, controlled production environment; capture how long a task takes.
R: yes
Q: Variance (realization) factor
A: A factor calculated from a company's actual historical performance against the standard, used to convert standard hours into realistic estimated hours.
R: yes
Q: Touch vs. non-touch (support) labor
A: Touch labor directly handles/works the product (e.g., assembling a circuit card); non-touch/support labor (QA, sustaining engineering) is often estimated as a factor of touch labor.
R: yes
Q: JSF inlet nacelle build-up example
A: Standard = 2,000 touch hours; 20% variance factor -> 2,400 touch hours; +48% support factor -> 1,152 support hours; total = 3,552 hours.
Q: Build-up uncertainty and risk
A: Uncertainty in design specifications, performance-to-standard, and unit costs/scrap rates; risk from potential omissions, growth in design specs, and integration difficulty.

## Other Techniques
Q: Expert opinion / engineering judgment
A: A subject matter expert (or experts) estimates directly; use only as a last resort or to corroborate/adjust objective data. Always dig into what data the opinion is based on and document it.
R: yes
Q: Expert opinion elicitation methods
A: One-on-one interviews (with iteration); round-table discussion (experts stay until consensus, documenting risk); Delphi technique (anonymous answers, iterated to convergence).
Q: Delphi technique
A: A group of experts answers anonymously to avoid one person dominating; results are summarized and recirculated, iterating toward convergence on a number or tighter range (an Operations Research technique).
R: yes
Q: Expert opinion uncertainty and risk
A: People understate both variance (spread) and randomness; faulty recollection of anecdotal experience tends to understate effort.
Q: Expert opinion bias types (Beyond CEBoK)
A: Availability heuristic, Dunning-Kruger (overconfidence), planning fallacy (underestimating duration/difficulty).
Q: Extrapolation from actuals
A: An umbrella term using actual costs from past/current items to predict future costs of the same item; variants include averages, learning curves, and EVM-based EAC.
R: yes
Q: Should-cost estimating (Beyond CEBoK)
A: A related, build-up-like technique focused on what a system should cost under efficient operations, used to find cost-reduction opportunities; not one of the source's "other" techniques.
R: yes
Q: Factor/ratio (SEITPM) estimating
A: Cost as a percentage/ratio of another element; SEITPM (Systems Engineering, Integration & Test, Program Management) is commonly estimated as a percentage of prime mission equipment (hardware and software) cost.

## Technique Selection
Q: Estimate requirements that drive technique choice
A: Purpose (milestone decision, budget, ROM, alternatives comparison, proposal), how much detail/how soon it's needed, data available, audience/defensibility level.
Q: ROM and budget-quality accuracy (Beyond CEBoK)
A: Rules of thumb sometimes cited: ROM ~±30-50%, budget-quality ~±10-15%; not source-defined standards, treat as illustrative.
Q: Top-down vs. bottom-up techniques
A: Top-down: analogy, parametric. Bottom-up: build-up. Neither reliably captures unknown-unknowns unique to the new system — top-down is built on an old system's costs, bottom-up only on known tasks.
Q: Cost Element Structure (CES) classification characteristics
A: Program phase (development/production/O&S), appropriation (RDT&E/procurement/O&M), funding source, non-recurring vs. recurring, direct vs. indirect.
Q: Technique selection steps
A: Research all potential techniques (customer models, personal libraries, new ones); compare them (data, statistics); avoid outdated techniques for new technology; verify fit to program phase; select a primary plus a secondary cross-check.
Q: Cross-check vs. validation vs. ICE
A: Increasing rigor: cross-check (reasonableness, same order of magnitude) < validation (nearly the same result via a different technique/tool) < Independent Cost Estimate (ICE, most detailed and persuasive).
Q: What to do when two techniques give divergent results
A: Investigate the cause (data quality, assumptions, scope, technique misapplication); do not average them.
Q: Documentation's "acid test"
A: Replicability — another analyst should be able to recreate the estimate from the documentation alone.
R: yes

## Life Cycle
Q: Technique progression across the program life cycle
A: Early (concept): top-down analogy/parametric. Mid (EMD): parametric transitioning to build-up. Late (production): build-up and actuals.
Q: Early estimate confidence ranges
A: Top-down analogy/parametric estimates carry wide ranges because historical data from past programs reflects their integration effects, but may not reflect the new system's unique unknown-unknowns and risks.
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
Q: Below-the-line (BTL) factors
A: Cost-on-cost CERs: unitless, often a percentage, typically modeling SEITPM as a percentage of prime mission equipment; may not be statistically based.
R: yes
Q: BTL factors vs. burdens like OH/G&A
A: Similar in application, but BTL factors are less deterministic; they should vary by system/program and ideally be derived statistically from history.
Q: Below-the-line factor formula (Beyond CEBoK)
A: Contract pricing burdens (Module 14): $Price = Base \times (1 + OH) \times (1 + G\&A) \times (1 + Fee)$, applied multiplicatively in sequence — not part of this module's BTL/cost-on-cost CER definition.
Q: SEITPM
A: Systems Engineering, Integration & Test, and Program Management, taken together; commonly estimated as a factor of prime mission equipment (hardware and software) cost.
R: yes
Q: O&S cost elements
A: Personnel, consumable/repairable materials, organizational/intermediate/depot maintenance (hardware and software), facilities, sustainment.
Q: O&S as share of life-cycle cost
A: Some sources cite 70-80% for certain types of systems; O&S is often excluded or overlooked in decision-making despite this.
Q: O&S analogy example (software maintenance)
A: System A: 2.5M SLOC, \$7.5M/yr. System B: 5M SLOC. Rate view: \$3/SLOC x 5M = \$15M. Ratio view: SLOC ratio 2.0 x \$7.5M = \$15M — same result.
Q: O&S parametric example
A: Ship overhaul cost vs. average ship age shows a non-linear relationship.
Q: O&S build-up example
A: A reliability-based logistics model, e.g., the Army's CASA (Cost Analysis Strategy Assessment), built from lower-level logistics costs using MTBF/MTTR-type reliability data.
Q: Updating O&S estimates
A: As actual sustainment data accumulates, update/refine O&S forecasts using extrapolation from actuals.
Q: Schedule estimating by analogy
A: System A: 10 components / 40 months (4 months/component). System B: 15 components -> 15 x 4 = 60 months. Caveat: complexity may not scale linearly with component count.
Q: Schedule Estimating Relationship (SER) example
A: From the source figure: $y = 0.1x + 3.1163$, $R^2 = 0.9769$, relating schedule duration to total labor hours; the slope gives an approximate average manning level.
Q: Schedule estimating by build-up
A: Sum lower-level task durations; beware deterministic sums on network schedules — critical-path/network effects usually require Monte Carlo simulation.
`
});
