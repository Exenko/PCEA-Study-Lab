PCEA.addModule({
  id: 'm02', num: 2, title: 'Cost Estimating Methods', short: 'Estimating Methods', source: 'guide',
  blurb: 'Analogy, parametric, build-up, and other techniques: when to use each, how to cross-check, and why uncertainty matters.',
  intro: String.raw`An estimate is never a single "true" number — it is a range built from data, relationships, or logic, always accompanied by uncertainty.

**The core challenge:** select the technique (or techniques) to use depending upon the **level of fidelity required**.

**Three primary techniques** (analogy, parametric, build-up) plus **other techniques** (expert opinion, extrapolation from actuals). Cost estimators typically use multiple techniques: one to derive the primary estimate and one or more to provide a cross-check to give confidence to the estimate.`,
  sections: [
    {
      id: 'uncertainty', title: 'Uncertainty and Risk', summary: 'Why estimates are uncertain and what risk means',
      body: String.raw`:::primer:::
Estimators compare their numbers with what programs actually end up costing, over and over.

:::check
Q: Across many programs, how do actual costs compare with unadjusted estimates?
- Equally likely to come in above or below
* Systematically above: unadjusted estimates tend to be low
- Systematically below: estimators pad their numbers
> CEBoK treats risk as the upward shift applied to the estimate range because unadjusted estimates tend to be systematically low.
:::

+++

An estimate predicts the future, so it is always uncertain. Separate that uncertainty from **risk**.

### Sources of Uncertainty

Uncertainty captures the range of possible outcomes of the estimate, which characterizes its precision. This is best done as a probability distribution, usually an empirical one resulting from a Monte Carlo simulation, which can then be summarized with a confidence interval.

:::tip Beyond CEBoK
Common sources of uncertainty in practice: data scatter (sample variation, prediction interval), model uncertainty (the technique is an imperfect representation), requirements uncertainty (the system is not fully defined early), schedule uncertainty (slips change phased costs), and technical risk (technology may not mature as planned).

Cost distributions are often right-skewed: large overruns are possible, but underruns are limited. So a point estimate built from "most likely" values usually falls below the mean.
:::

### Past, Present, Future

Cost estimating draws on the **past** (historical cost and other data collected on analogous systems), works in the **present** (normalizing and analyzing that data to build estimating tools), and projects to the **future** (applying those tools to the new system). There is roughly a symmetrical balance between how far an estimate reaches into the future and how far the supporting data reaches into the past — estimating farther out, with new designs and new ways of doing business, requires more historical data to support it.

### Precision vs. Accuracy

**Precision** is the spread of the range of outcomes the estimate produces (a narrow range is more precise). **Accuracy** is whether that range is centered on the true value. Both are desirable, but **accuracy is more important** — precision can give a false sense of security.

**Example**: NOAA's preseason forecasts of North Atlantic hurricanes (1999–2007) captured the actual count within the predicted range in only 3 of 8 years (a ~37.5% confidence interval) — the forecasts looked precise (a narrow range) but weren't, because the true value fell outside the range most of the time. The forecasters were not including enough uncertainty in the estimates, and only gave the illusion of precision. They were better with risk: the average prediction understated the actual average by less than one hurricane per year. The unusually high 2005 season (Katrina and Rita) should not be removed from the data set as an outlier unless there is an analytical explanation (a trend such as increasing temperatures, an error in prediction such as an error band that should have been wider, or an error in data collection). The figure is an example of a track record which estimating organizations should adopt, with a feedback mechanism, so that the data gathered can be used to improve cost estimating and risk analysis.

+++

### Risk vs. Uncertainty

- **Uncertainty**: the range of possible outcomes of the estimate, which characterizes its precision; best expressed as a probability distribution (usually empirical, from Monte Carlo simulation) summarized with a confidence interval (e.g., one million dollars, plus or minus 15 percent)
- **Risk** (CEBoK's definition in this module): the **upward shift** applied to the cost estimate range to account for the fact that unadjusted estimates tend to be **systematically low**. The adjustment is intended to eliminate what appears to be an inherent bias in estimates and improves the estimate's accuracy. Example: if costs come in on average 20% higher than the estimates, cost estimators may want to add 20% to the estimate — not atypical of historical cost growth on some programs.

{{primer}}

:::tip Beyond CEBoK
In general risk management (and in Module 9), a **risk** is also described as a discrete event with a **probability** and a **consequence**, and an **opportunity** is an uncertain event with a positive effect.
:::

Both must be reflected in the final estimate. Report a **range or distribution** with a confidence level, not a bare point number.

+++

:::tip Beyond CEBoK
Common sources of cost growth cited in practice: requirements creep / scope changes; immature technology (low Technology Readiness Level); optimistic assumptions (schedule, learning, vendor quotes); poor analogy selection (too dissimilar); small samples or inadequate historical data; external factors (funding instability, inflation, regulatory change).
:::

:::check
Q: Historically, a program type's actual costs come in about 20% above its estimates. Per CEBoK Module 2, adding 20% to a new estimate of that type accounts for…
* Risk (an upward shift correcting systematic underestimation)
- Uncertainty (the precision of the estimate)
- A sunk cost
- An opportunity
> CEBoK: risk is the upward shift applied to the estimate range because unadjusted estimates tend to be systematically low. Uncertainty describes the range (precision) around the estimate.
:::

:::check
Q: (Beyond CEBoK) Why does a point estimate from "most likely" values usually fall below the mean cost?
* Cost distributions are right-skewed; overruns can be large but underruns are limited
- The estimate method is biased low
- Optimism bias in the data
> Beyond CEBoK: asymmetry. Large upside surprises outweigh large downside, pulling the mean above the mode.
:::`
    },
    {
      id: 'analogy', title: 'Analogy', summary: 'Estimate from one similar system, adjusted for differences',
      body: String.raw`:::primer:::
Estimating from one similar historical system is a short, ordered recipe.

:::order
Q: Put the analogy process steps in order.
1. Identify a similar (analogous) item
2. Obtain the older item's cost (inflation adjustments are part of data normalization)
3. Identify key cost drivers and how the old item relates to the new
4. Adjust the old item's cost for how those cost drivers relate
> Find the similar item, get its cost, identify the key cost drivers and how old relates to new, then adjust the old item's cost.
:::

+++

Use an estimate for an **existing item** to develop an estimate for a **similar item**. Generally, some adjustments must be made to the costs of the older item: programmatic information (e.g., quantity or schedule), physical characteristics (e.g., weight or materials), performance characteristics (e.g., power or pointing accuracy), government or commercial practices, or contract type (e.g., fixed price or cost plus). Economic adjustments for inflation are normally considered part of data normalization. Objectivity is important when making an adjustment, and the source of the analogy and any adjustments must be logical, credible, and acceptable to an informed party. Analogy is a one-for-one comparison, and is useful even alongside more detailed techniques as a cross-check (in this case, the estimates should have the same order of magnitude).

Cost estimators develop analogies at the system, subsystem, or component level, and may use multiple analogies at the lower WBS levels to create a higher level estimate.

### Process

1. Identify a similar (analogous) item
2. Obtain the older item's cost (inflation adjustments are part of data normalization)
3. Identify key cost drivers and how the old item relates to the new
4. Adjust the old item's cost for how those cost drivers relate (a ratio, in the scaling formula below)

{{primer}}

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

**Pros**: Can be used before detailed program requirements are known; the more similar the systems, the stronger the analogy and the easier it is to stand up to review; easy to use if a sufficient database exists on an analogous system.

**Cons**: Tendency to be too subjective (analogies that require too many subjective adjustments are not appropriate); difficult to find sufficient cost, technical, and programmatic data; any estimate using an adjusted analogy constitutes estimating outside the range of the data (a single data point).

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
      body: String.raw`:::primer:::
A CER fit to many historical data points has strengths and weaknesses.

:::sort
Q: Which of these are strengths of parametric estimating, and which are weaknesses?
buckets: Pro | Con
- Versatile: can be developed at any level when there is enough data = Pro
- Quickly reflects design changes by modifying the input parameters = Pro
- Objective measures of validity (statistical significance, standard error) = Pro
- Underlying database must be consistent and sufficiently robust = Con
- Black box syndrome: blindly accepting output without understanding it = Con
- Must be updated to current data; a dated CER can be exactly wrong = Con
> The text lists these as parametric advantages (versatility, quick reflection of design changes and sensitivity analysis, objective measures of validity) and disadvantages (consistent, robust, thoroughly normalized database; black box syndrome; CERs must be updated).
:::

+++

Use a **mathematical relationship** based on historical data (a Cost Estimating Relationship, or **CER**) to relate cost to one or more technical, performance, cost, or programmatic parameters (the **cost drivers**, e.g., weight, thrust, or power), using **multiple systems** to cover a broader range than an analogy. Parametric relationships are commonly referred to as CERs, which include rates, factors, and ratios. A parametric relationship ranges from a simple rule of thumb (e.g., dollars per pound) to a complex regression equation. Develop CERs using regression whenever possible to enable statistical inferences; note, however, that many rates, factors, and ratios in use may not be statistically based.

The independent variables (cost drivers) could be physical characteristics, performance or operational parameters, programmatic variables, or even other costs. The system's cost is the dependent variable.

:::tip Beyond CEBoK
Two common CER forms: linear, $Cost = a + bX$, and power, $Cost = aX^b$. Both can be fit via regression (see Module 8), and a good CER has acceptable $R^2$, t-statistics, and F-statistics.
:::

CEBoK's statistical validity language: a parametric relationship derived through statistical analysis generally has objective measures of validity (the statistical significance of each estimated coefficient and the model as a whole) and a calculated standard error (a measure used in cost risk analysis).

### Example

A CER for the site activation cost element for a Major Automated Information System (MAIS) was developed from 11 data points corresponding to similar systems, where installations ranged from seven to 47 workstations, inclusive. The number of workstations is the cost driver:

$$SiteAct\ (\$K) = 82.8 + 26.5 \times NumWkstn$$

This CER might provide good estimates provided that the number of workstations in the new installation is between about five and 50. It should not be used for values much outside the range of the data on which it was originally based. In an extreme case, the cost of site activation for an installation with no workstations is about \$82.8K, as this is what the equation gives mathematically.

+++

### Building a CER

- Cost estimators generally need an **adequate number of relevant data points**
- **Normalize** data so it can be used to develop a parametric equation that is consistent and complete
- Ensure the system being estimated does not fall too far outside the range of the data or parameters used to develop the equation (**and preferably not at all**). Example: if the new spacecraft is expected to weigh 250 kg and the CER was based on a spacecraft that weighed 2000 kg and higher, then use another CER
- The underlying assumption is that the **historical framework** on which the relationship is based will remain the same for the new system (e.g., the technology and manufacturing processes are not drastically changing)

:::tip Beyond CEBoK
High $R^2$ (>0.90) looks good, but always check that the slope makes sense physically. A strong statistical fit can hide a physically nonsensical relationship.
:::

+++

### Pros and Cons

**Pros**: Versatile (can be developed at any level when there is enough data); cost estimators can quickly and easily capture the effects of design changes by modifying the input parameters; supports sensitivity analysis; objective measures of validity (statistical significance, standard error).

**Cons**: The underlying database must be consistent and sufficiently robust (verify the data were thoroughly normalized); black box syndrome (plugging in inputs and blindly accepting the output without understanding how it is generated); relationships must be updated to capture the most current cost, technical, and programmatic data, since a dated CER can be exactly wrong.

### Uncertainty and Risk

Parametric estimates have the advantage of using statistics to capture the uncertainty in estimating beyond the range of data. The uncertainty is in the intercept and slope of the regression line and can be measured by the **standard error**; there is also uncertainty in the distribution around the regression line, which can be estimated by a **Prediction Interval (PI)**.

Risks can be characterized as those **not included in the historical data set**: new technologies, economic conditions (e.g., inflation), and the labor environment. There may also be risk characterized by **historical growth of the cost driver** (e.g., size, power, weight, lines of code).

{{primer}}

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
      body: String.raw`:::primer:::
Build-up labor splits into two kinds, and they are estimated differently.

:::sort
Q: Which labor is touch labor, and which is non-touch (support) labor?
buckets: Touch labor | Support labor
- Building a circuit card = Touch labor
- A robot handling and working the product = Touch labor
- Quality assurance = Support labor
- Sustaining engineering = Support labor
> Touch labor is workers (human or robotic) actually handling and working the product. Non-touch/support labor, such as quality assurance and sustaining engineering, is often estimated as a factor of touch labor.
:::

+++

Build estimates for higher-level cost elements by **summing or rolling up** detailed estimates for lower-level cost elements. Roll-up is common to estimates produced by any combination of the three techniques; build-up is characterized by estimating at the **lowest definable level at which data exists**.

### Process

- **Labor hours are multiplied by labor rates** to determine costs
- A **detailed parts list or material costs** is also required; the parts required for a task are identified at the lowest level possible, often down to the nut and bolt level
- Consideration is made for **quantity and schedule** to capture the effects of learning curves and production rate
- The **stage of the program** is also important because the processes and standards used to manufacture prototypes are generally different than those for full rate production

:::tip Beyond CEBoK
A general form of the roll-up at one WBS element: $Cost = \sum (Hours_i \times Rate_i) + \sum Materials_i + ODC$, where other direct costs (ODC) such as tooling, test, or travel are often added, and rates are often burdened (fully loaded).
:::

### Standards and Variance Factors

The foundation of build-up is a **standard**: how long a task takes, based on time-and-motion studies done in a controlled, **optimal** production environment. Because no one actually operates at that optimum, a **variance (realization) factor** is calculated from a company's actual historical performance against the standard, and applied to convert standard hours into realistic estimated hours.

Labor also splits into **touch** labor (workers, human or robotic, actually handling and working the product — e.g., building a circuit card) and **non-touch/support** labor (quality assurance, sustaining engineering). Support labor is often estimated as a **factor of touch labor**.

{{primer}}

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

**Pros**: Cost estimators can show exactly what the estimate covers and it helps determine if anything was overlooked; if time and motion studies are involved, there is a fairly accurate depiction of the actual process; variance factors applied to standards are based on verifiable actual cost data; unique to a specific program and manufacturer (contractor).

**Cons**: Can be expensive to implement if companies develop their own standards; requires extensive data collection and monitoring for variance factors; the product specification must be well known and stable and all product/process changes must be reflected in the estimate; many costs (e.g., rework, tooling, quality) are calculated as a percentage of touch labor, so small errors at the touch labor level can be magnified into much larger errors; omissions are likely, since it is very difficult to anticipate all the actual costs.

### Uncertainty and Risk

**Uncertainty** may be in the design specifications, in the performance to standards (usually associated with the labor estimate), and in the unit costs and scrap rates of materials. **Risk** may include an adjustment for potential omissions, the historical growth of design specifications, and the difficulty associated with the integration of lower-level estimates and/or systems or sub-systems.

:::warn
Build-up is defensible for **defined** work, but **omissions are likely**: it is very difficult to anticipate all the actual costs. Risk may include an adjustment for potential omissions, growth of design specifications, and difficulty integrating lower-level estimates.
:::

:::check
Q: Build-up for a subassembly: Engineering 150 hrs @ \$90/hr; Manufacturing 300 hrs @ \$55/hr; Materials \$12,000. Total?
= 42000
> Engineering: $150 \times 90 = 13500$; Mfg: $300 \times 55 = 16500$; labor total = \$30,000; materials \$12,000; grand total = \$42,000.
:::

:::check
Q: A build-up estimate omits risk. Why is this a problem, even if the line-item estimates are accurate?
* Omissions are likely, and risk includes potential omissions, design-specification growth, and integration difficulty
- The hourly rates are probably too high
- It will never converge with a parametric estimate
> It is very difficult to anticipate all the actual costs, so omissions are likely. Risk for build-up may include an adjustment for potential omissions, the historical growth of design specifications, and integration of lower-level estimates.
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
      body: String.raw`:::primer:::
Expert opinion is grounded in anecdotal experience, and human memory is imperfect.

:::check
Q: An expert recalls a past report taking "a week" (40 hours). What is the actual effort most likely to have been?
- Less than 40 hours, since experts overestimate
- About 40 hours
* More than 40 hours, since overtime and rework are forgotten
> Expert opinion rests on anecdotal, often faulty recollection, which tends to understate effort: the expert may forget the overtime or the rework from review comments.
:::

+++

Two supplementary methods fill gaps or validate the primary techniques: **expert opinion** and **extrapolation from actuals**.

### Expert Opinion / Engineering Judgment

Expert opinion is generally viewed as too subjective. Use it only as a last resort, when other methods are not available or not valid for the situation — it is hard to justify as a primary method and difficult to run risk around. It may be used to corroborate or adjust (as in the analogy technique) objective data, to explain an apparent outlier, or early in a program's life cycle for a quick, high-level Rough Order-of-Magnitude (ROM) estimate. It is often used as a secondary method to offer a cross-check. Use the insights of functional experts in conjunction with one of the three established costing techniques. Approaches include:

- **One-on-one interviews**: request any available documentation from the expert; iterate if possible
- **Round-table discussion**: multiple experts present all sides of an issue and stay in the room until they reach consensus, documenting areas of risk
- **Delphi technique**: a group of experts answers **anonymously** (so no single person dominates), the results are summarized and sent back out for coordination/comments; this generates a range of opinions and generally results in convergence to a single number or at least tighter range of possible outcomes — a specific technique from Operations Research (OR)

Don't ask experts to estimate outside the bounds of their experience; get another expert for areas outside their scope; validate credentials; formulate consensus after individual consultation. Always dig into *what data the opinion is based on* and document that source — expert opinion with no accompanying rationale is neither a valid technique nor sound estimating practice.

**Advantage**: it can provide a sanity check or cross-check of an estimate produced using established techniques; SMEs usually provide a different perspective and may point out things not previously considered; interaction with experts allows a better understanding of the product or process.

**Disadvantage**: expert opinion is completely subjective and can be refuted using objective data; it holds little, if any, credibility when not used in conjunction with one of the costing techniques.

:::tip Beyond CEBoK
Common ways experts go wrong: the availability heuristic (recent/memorable cases bias the estimate), Dunning-Kruger (overconfidence in one's own knowledge), and the planning fallacy (underestimating duration or difficulty).
:::

**Uncertainty and risk**: people are not great random-number generators — they tend to **understate both variance (spread) and randomness**. Expert opinion is grounded in anecdotal, and often faulty, recollection: an expert may remember a report taking "a week" (40 hours) but forget the overtime or the rework from review comments — so **faulty recollection tends to understate effort**.

{{primer}}

### Extrapolation from Actuals

An umbrella term for using actual costs from past or current items to predict future costs of the *same* item — not one of the three core techniques, but often combined with them (e.g., actuals feeding a parametric relationship or an analogy). Variants:

- **Averages**: simple or moving average of actual unit costs to date, used as the prediction for future units
- **Learning curves**: the most common variant — cumulative-average or unit theory, Learning Curve Slope (LCS), theoretical first-unit cost (Module 7)
- **Estimate at Completion (EAC)**: uses actual cost and schedule data with Earned Value Management to project cost at completion (Module 15)

Extrapolation from actuals can be used in conjunction with one of the three basic costing techniques; for example, actual data may be used to construct a parametric estimate or as the basis for an analogy.

:::tip Beyond CEBoK
Extrapolation from the program's own actuals is generally regarded as highly credible once actuals exist, since it is based on the same program rather than an analogy.
:::

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
      body: String.raw`:::primer:::
Choosing a technique for an element is a deliberate, staged process.

:::order
Q: Put the technique selection steps in order.
1. Research which techniques are available from all potential sources
2. Compare the techniques against the requirements and against each other
3. Select the technique most appropriate for the estimate (or develop one)
4. Select a secondary technique as a cross-check
> Research the options, compare them (avoiding outdated techniques and checking program phase), select the most appropriate technique, then select a secondary technique as a cross-check.
:::

+++

### Estimate Requirements

Before selecting a technique, understand why the estimate is being done — this drives what's needed and how soon:

- **Purpose**: milestone decisions, budget development, ROM estimates, alternatives comparisons, proposal development/evaluation
- **How much detail is required**, and how soon the estimate is needed
- **What data is available**

An estimate for a milestone decision, for example, requires more detail than a ROM.

:::tip Beyond CEBoK
Rules of thumb sometimes used in practice: ROM (rough order of magnitude) accuracy around ±30-50%; budget-quality accuracy around ±10-15%. Treat these as illustrative, not fixed standards.
:::

### Top-Down vs. Bottom-Up

There are two main ways to structure a cost estimate. Any of the costing techniques may be used with either approach.

| Aspect | Top-Down | Bottom-Up |
|---|---|---|
| **Techniques** | Generally associated with parametric or analogy (any technique may be used) | Most closely associated with the build-up technique (multiple techniques may be used) |
| **Approach** | Known top-level requirements (e.g., weight or power) or parameters are used to develop an estimate for an entire system | Work from information at the lowest level to develop an estimate for an entire system: develop discrete estimates for each element (labor hours, materials, other costs, with direct and indirect rates), then roll up |

:::tip Beyond CEBoK
Practical caveat: top-down (analogy, parametric) estimates are built on the *old* system's actual costs, which by definition never captured risks unique to the *new* system, while bottom-up (build-up) captures only known, defined scope. Either way, an explicit risk/uncertainty treatment is required; see Module 9.
:::

+++

### Cost Element Structure (CES)

A good way to break down the estimate into manageable pieces is to develop a **Cost Element Structure (CES)**. The CES is the framework for an estimate in a **hierarchical tree structure** where the costs of children sum up to the cost of their parent or, conversely, the cost of the parent can be allocated to the children. The **CES dictionary** defines what is included in each element of the CES.

:::tip Beyond CEBoK
In practice, a CES aligned with the WBS helps ensure each element can be assigned the most appropriate technique, nothing is missed or double-counted, and the estimate maps to how data is collected and tracked.
:::

Different WBS elements in the *same* estimate may use *different* techniques (e.g., build-up for hardware, parametric for software, analogy for a subsystem lacking detail). Cost elements are also classified by:

- **Program phase** (development, production, or O&S)
- **Appropriation** (RDT&E, procurement, or O&M)
- **Funding source**
- **Non-recurring vs. recurring** cost
- **Direct vs. indirect** cost

+++

### Technique Selection

1. **Research** which techniques are available from all potential sources: some customers may have specific models they want you to use, many cost estimators maintain a library of costing techniques, and consider developing new ones.
2. **Compare** the techniques against the requirements and against each other: look at the underlying data, do statistical comparisons, and make sure nothing is overlooked or left out. Be careful not to use outdated techniques (a technique developed from old data may not accurately estimate new technology), and make sure the technique is for the appropriate program phase.
3. **Select** the technique most appropriate for the estimate, or develop a technique that fills the needs. Multiple techniques can be used in the same estimate.
4. In addition to selecting a primary technique, **select a secondary technique as a cross-check**.

{{primer}}

### Checking Results

Three levels of rigor, increasing in detail, fidelity, and persuasiveness:

- **Cross-check**: a test of reasonableness — it does not have to result in the exact same number, but should be a similar number; at a minimum, it should be the same order of magnitude
- **Validation**: more detailed than a cross-check — the intent is to get *nearly* the same result using different techniques
- **Independent Cost Estimate (ICE)**: cross-check, validation, and ICE reflect increasing levels of detail, fidelity, and persuasiveness in corroborating a cost estimate

:::tip Beyond CEBoK
When results diverge, do not average them; investigate the cause (data quality, assumptions, scope definition, technique misapplication).
:::

:::widget techniques-compare x=110 showAvg=1 showAnalogy=1 analogyPt=2 showParam=1 showCal=1 calPt=5:::

:::challenge techniques-compare x=110 showAvg=0 showAnalogy=0 analogyPt=2 showParam=0 showCal=0 calPt=5 lock=x,analogyPt,calPt
Q: All four legitimate techniques run on the *same* illustrative dataset. Turn all four on and watch the spread between their estimates grow past 20.
goal: spread > 20
show: showAvg=1 showAnalogy=1 showParam=1 showCal=1
> Even with no bad data, an average, an analogy through one point, an OLS fit, and a CER calibrated through a different point disagree — a large spread is a reason to investigate (data quality, assumptions, technique fit) rather than average (Beyond CEBoK guidance).
:::

### Documentation

Document the ground rules, assumptions, data, and calculations behind the estimate — if in doubt, include it. **Replicability is the acid test**: another analyst should be able to recreate the estimate from the documentation alone. A well-documented estimate is more credible.

:::check
Q: (Beyond CEBoK) Your primary estimate is a detailed build-up (\$15M). A parametric cross-check yields \$18M. You should…
- Split the difference at \$16.5M
- Discard the parametric estimate as less detailed
* Investigate why they diverge; check data quality, assumptions, scope, and technique application
> Beyond CEBoK guidance: convergence confirms; divergence signals a problem to investigate. CEBoK says a cross-check should be a similar number, at a minimum the same order of magnitude.
:::

:::check
Q: Rank cross-check, validation, and ICE from least to most rigorous.
* Cross-check, validation, ICE
- Validation, cross-check, ICE
- ICE, validation, cross-check
> Cross-check should be a similar number (at a minimum the same order of magnitude); validation seeks nearly the same result using different techniques; cross-check, validation, and ICE reflect increasing levels of detail, fidelity, and persuasiveness.
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
      body: String.raw`:::primer:::
Early in a program, gross estimates are expected; they get more detailed as the program matures.

:::check
Q: As a program matures, what happens to its cost estimates?
- They stay gross, because detailed estimates are never possible
- They become less detailed as the design changes
* They get more detailed, as the program becomes more defined and more data is collected
> Early on, gross estimates are expected because detailed estimates are not usually possible (poor program definition, changing requirements, scarce cost data). As the program matures, it becomes more defined, additional data is collected, and the estimates get more detailed.
:::

+++

At the beginning of a program, there is more emphasis on using analogies and parametric relationships. In these early phases, gross estimates are expected as detailed estimates are not usually possible due to poor program definition, changing requirements, and scarce cost data. As the program matures, it becomes more defined, additional data is collected, and the estimates get more detailed. Engineering build-up and extrapolation from actuals are used more frequently in the production and deployment phase and O&S phase.

### Technique by Phase

| Phase | Data Maturity | Preferred Technique(s) |
|---|---|---|
| **Concept / Materiel Solution Analysis** | Minimal; concept only | Analogy, high-level parametric, expert opinion |
| **Technology Development** | Some preliminary design | Parametric, refined analogy |
| **Engineering & Manufacturing Development** | Detailed design, early prototypes | Parametric transitioning to build-up |
| **Production & Deployment** | Detailed drawings, vendor quotes, early actuals | Build-up, extrapolation from actuals |
| **Operations & Support** | Operating history accumulating | Engineering build-up, extrapolation from actuals |

The per-phase detail in this table is a study aid derived from CEBoK's Figure 2.10 (approximate proportional usage of techniques by phase); the text itself states only the early and late emphasis above.

### Key Principle

- **Early** (beginning of a program): more emphasis on **analogies and parametric relationships**; **gross estimates are expected**.
- **Later** (production and deployment, and O&S): **engineering build-up and extrapolation from actuals** are used more frequently.
- As the program matures, it becomes more defined, additional data is collected, and the estimates get more detailed.

:::tip Beyond CEBoK
In practice, update the estimate at each milestone, expect wide confidence ranges early (tightening later), and keep risk/growth allowances and reserves even for late, bottom-up estimates.
:::

{{primer}}

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
> In EMD the estimate is still mostly parametric while build-up grows. By production, detailed drawings, vendor quotes and early actuals make build-up the main technique. In O&S, build-up and extrapolation from actuals continue to be used more frequently.
:::`
    },
    {
      id: 'related', title: 'Below-the-Line, Schedule, and Operations & Support', summary: 'Factor estimating, schedule estimating, and O&S cost structure',
      body: String.raw`:::primer:::
The three cost techniques also predict schedules and O&S costs.

:::sort
Q: Which technique does each example use?
buckets: Analogy | Parametric | Build-up
- Scale a similar project's historical schedule = Analogy
- Annual software maintenance cost per SLOC from a similar system = Analogy
- A Schedule Estimating Relationship (SER) vs. total labor hours = Parametric
- Ship overhaul cost vs. average ship age = Parametric
- Sum lower-level task durations = Build-up
- A reliability-based logistics model such as CASA = Build-up
> Analogy scales a similar effort, parametric uses a statistical relationship to a driving parameter, and build-up sums lower-level pieces.
:::

+++

### Below-the-Line Factors

Below-the-line (BTL) factors are also known as **cost-on-cost CERs**: they use the cost of another element to predict cost through a simple multiplicative relationship. They're **unitless**, often expressed as a **percentage**, and typically model support functions — SEITPM (systems engineering, integration & test, program management) — as a percentage of the program's **prime mission equipment**.

Beware that BTL factors **may not be statistically based**. BTL factors are similar in application to burdens like overhead and General and Administrative (G&A) costs, but BTL factors are **less deterministic**. They should vary based on the system or program being estimated, and should be **based on historical information and derived through statistical methods**. Because a BTL-derived cost is based on an already-estimated cost (with its own risk and uncertainty), that must be carried through the risk analysis (model with functional correlation).

:::tip Beyond CEBoK
Contract pricing sometimes layers burdens multiplicatively on a base cost: $Price = Base \times (1+OH) \times (1+G\&A) \times (1+Fee)$, applied in sequence (base -> OH -> G&A -> fee). This pricing-burden formula belongs to contract pricing (Module 14), not to BTL cost-on-cost CERs.
:::

### Schedule Estimating

The same three techniques used for cost can predict a project's **schedule** — important because it affects both cost time-phasing and the total cost of time-dependent elements.

- **Analogy**: scale a similar project's historical schedule. Example: System A (10 components) took 40 months to integrate — a rate of 4 months/component. System B (15 components): $15 \times 4 = 60$ months (rate view), or equivalently $40 \times (15/10) = 60$ months (ratio view). **Caveat**: integration complexity may not scale linearly with the number of components — it could grow faster (worse than 60 months) or, if there's a large fixed non-recurring piece, slower.
- **Parametric (Schedule Estimating Relationship, SER)**: a statistical relationship between schedule and a schedule-driving parameter (e.g., total labor hours) built from multiple historical efforts. From the source figure: $y = 0.1x + 3.1163$, $R^2 = 0.9769$, relating schedule duration (months) to total labor hours. The slope lets you back out an approximate average manning level for the predicted duration.
- **Build-up**: sum the durations of lower-level work tasks. Beware **deterministic sums on network schedules** — understand the critical path. A build-up schedule estimate will almost always need a **Monte Carlo simulation** to translate individual task-duration estimates into a top-level schedule distribution.

### Operations & Support Estimating

O&S costs are defined as **all of the costs associated with operating, maintaining, and supporting a system**. They are normally a large portion of the total life cycle cost for a system (**some sources say 70-80% for certain types of systems**) and are often excluded or overlooked in the decision making process. They are necessary and important to include in Life Cycle Cost Estimates (LCCEs) so that users and decision makers understand the total cost of a system or program. The acronym O&S may refer to traditional O&S, operations and sustainment costs, or Operations and Maintenance (O&M) costs; here, assume the definition for all of these is the same. O&S costs can include costs for:

- Personnel
- Consumable and repairable materials
- Organizational, intermediate, and depot maintenance (hardware and software)
- Facilities
- Sustainment

**Technique examples**:

- **Analogy**: System A is analogous to System B for annual software maintenance cost. System A: 2.5M SLOC, \$7.5M/yr. System B: 5M SLOC. Rate view: $\$7.5M / 2.5M = \$3/SLOC$, so $\$3 \times 5M = \$15M$. Ratio view: SLOC ratio $5M/2.5M = 2.0$, so $2.0 \times \$7.5M = \$15M$ — both mathematically equivalent.
  Another common approach to estimating software maintenance is to determine the amount of code that can be maintained by each maintainer on an ongoing basis and divide that ratio into the total code base to determine the size of the maintenance staff required. That ratio should be based on historical data from comparable programs.
- **Parametric**: for ship overhaul cost vs. average ship age, it **appears** that a **non-linear** relationship exists.
- **Build-up**: a reliability-based logistics model, such as the Army's Cost Analysis Strategy Assessment (CASA) — a bottom-up total-ownership-cost decision support tool that provides a total cost estimate based on lower-level logistics costs across 25 listed categories. Each lower-level estimate needs a strong basis; to qualify as a true build-up, the lower-level estimates should be derived from standard relationships and reliability data such as Mean Time Between Failures (MTBF) and Mean Time To Repair (MTTR).

{{primer}}

:::tip Beyond CEBoK
As actual sustainment data accumulates over a system's life, O&S estimates can be updated and refined using that experience (extrapolation from actuals).
:::

:::check
Q: Which life-cycle phase's costs are normally a large portion of a system's total life cycle cost, yet are often excluded or overlooked in decision making?
- Research and development
- Production
* Operations & Support
- Disposal
> O&S costs are normally a large portion of the total life cycle cost (some sources say 70-80% for certain types of systems) and are often excluded or overlooked in the decision making process.
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
A: Uncertainty: the range of possible outcomes of the estimate (characterizes precision), best expressed as a probability distribution (usually empirical, from Monte Carlo simulation) summarized with a confidence interval. Risk (CEBoK Module 2): the upward shift applied to the estimate range to account for unadjusted estimates tending to be systematically low (e.g., if costs come in on average 20% higher than estimates, cost estimators may want to add 20%).
Q: Why does a point estimate from "most likely" values usually fall below the mean?
A: Beyond CEBoK: cost distributions are right-skewed; overruns can be large but underruns are limited.
Q: Opportunity (in risk/uncertainty terms)
A: Beyond CEBoK: an uncertain event with a positive effect on cost or schedule.
R: yes
Q: Common sources of cost growth
A: Beyond CEBoK: requirements creep, immature technology (low TRL), optimistic assumptions, poor analogy selection, inadequate data, external factors (inflation, funding instability).
Q: Right-skewed cost distribution
A: Beyond CEBoK: mean > mode; possible large overruns, but limited underruns. Point estimate from most-likely falls below mean.
R: yes

## Analogy
Q: Definition of analogy technique
A: Use the estimate for an existing item to develop an estimate for a similar item, with adjustments (programmatic, physical, performance, government/commercial practices, contract type) made objectively.
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
A: Pros: can be used before detailed program requirements are known; the more similar the systems, the stronger the analogy and the easier to stand up to review; easy if a sufficient database exists on an analogous system. Cons: tendency to be too subjective; difficult to find sufficient cost, technical, and programmatic data; estimating outside the range of the data (single data point).
Q: Analogy power-law exponent (Beyond CEBoK)
A: Some analysts scale by $Cost_{new} = Cost_{analogy} \times (Param_{new}/Param_{analogy})^b$; not the source's linear-ratio method — a single analog point can't determine the exponent $b$ either.
R: yes

## Parametric
Q: Definition of parametric technique
A: Use mathematical relationships (CERs) based on historical data from multiple systems to relate cost to one or more technical, performance, cost, or programmatic parameters.
R: yes
Q: Cost Estimating Relationship (CER)
A: A mathematical relationship between cost drivers (independent variables) and cost (dependent variable); CERs include rates, factors, and ratios, ideally developed using regression (many in use are not statistically based).
R: yes
Q: Linear CER form
A: Beyond CEBoK: $Cost = a + bX$; constant intercept and slope. a = fixed cost, b = cost per unit of X.
R: yes
Q: Power CER form
A: Beyond CEBoK: $Cost = aX^b$; a common nonlinear form for technical cost drivers (weight, power, lines of code).
R: yes
Q: CER validity requirements
A: Objective measures of validity: statistical significance of each estimated coefficient and the model as a whole, and a calculated standard error. Also: adequate number of relevant data points, thoroughly normalized data, system not too far outside the data range, historical framework assumed to remain the same.
Q: Parametric pros and cons
A: Pros: versatile (any level with enough data); quickly reflects design changes via input parameters; supports sensitivity analysis; objective measures of validity. Cons: database must be consistent and sufficiently robust; black box syndrome; must be updated (a dated CER can be exactly wrong).
Q: Extrapolation risk
A: Applying a CER far outside the range of historical data used to build it produces unreliable predictions.
R: yes

## Build-up
Q: Definition of build-up (engineering / bottom-up)
A: Estimate at the lowest definable level at which data exists and sum/roll up to higher-level cost elements (roll-up itself is common to all three techniques).
R: yes
Q: Build-up formula
A: Beyond CEBoK: $Cost = \sum (Hours_i \times Rate_i) + \sum Materials_i + ODC$. CEBoK: labor hours are multiplied by labor rates; a detailed parts list or material costs is also required.
R: yes
Q: Labor cost element calculation
A: Labor hours are multiplied by labor rates to determine costs; quantity and schedule are considered for learning curves and production rate.
Q: Other direct costs (ODC)
A: Beyond CEBoK: tooling, test, travel, and special equipment; direct to the task but not labor or material.
R: yes
Q: Build-up pros and cons
A: Pros: shows exactly what the estimate covers and helps find overlooked items; accurate depiction of the process (with time and motion studies); variance factors based on verifiable actual data; unique to a program and manufacturer. Cons: expensive if company develops own standards; extensive data collection; product specification must be well known and stable; small touch-labor errors magnified; omissions likely.
Q: Build-up and unknown-unknowns
A: Omissions are likely because it is very difficult to anticipate all the actual costs; risk may include an adjustment for potential omissions, growth of design specifications, and integration difficulty.
Q: Management reserve
A: Beyond CEBoK: an explicit allowance added on top of a build-up estimate to cover unknowns, unidentified scope, and risk.
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
A: A subject matter expert (or experts) estimates directly; generally viewed as too subjective. Use only as a last resort, or to corroborate/adjust objective data, as a ROM or cross-check, in conjunction with one of the three established techniques. Always dig into what data the opinion is based on and document it.
R: yes
Q: Expert opinion elicitation methods
A: One-on-one interviews (with iteration); round-table discussion (experts stay until consensus, documenting risk); Delphi technique (anonymous answers, iterated to convergence).
Q: Delphi technique
A: A group of experts answers anonymously to avoid one person dominating; results are summarized and sent back out for coordination/comments; generates a range of opinions and generally results in convergence to a single number or at least a tighter range of possible outcomes (an Operations Research technique).
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
A: Purpose (milestone decision, budget, ROM, alternatives comparison, proposal), how much detail is required, how soon the estimate is needed, and what data is available.
Q: ROM and budget-quality accuracy (Beyond CEBoK)
A: Rules of thumb sometimes cited: ROM ~±30-50%, budget-quality ~±10-15%; not source-defined standards, treat as illustrative.
Q: Top-down vs. bottom-up techniques
A: Any technique may be used with either approach. Top-down: generally associated with parametric or analogy; uses known top-level requirements or parameters for an entire system. Bottom-up: most closely associated with build-up; works from lowest-level information, with discrete estimates rolled up to the entire system.
Q: Cost Element Structure (CES) classification characteristics
A: Program phase (development/production/O&S), appropriation (RDT&E/procurement/O&M), funding source, non-recurring vs. recurring, direct vs. indirect.
Q: Technique selection steps
A: Research available techniques from all sources (customer models, libraries, new ones); compare against requirements and each other (data, statistics; avoid outdated techniques; appropriate program phase); select the most appropriate technique (or develop one); also select a secondary technique as a cross-check.
Q: Cross-check vs. validation vs. ICE
A: Increasing levels of detail, fidelity, and persuasiveness: cross-check (test of reasonableness; similar number, at minimum same order of magnitude) < validation (nearly the same result using different techniques) < Independent Cost Estimate (ICE).
Q: What to do when two techniques give divergent results
A: Beyond CEBoK: investigate the cause (data quality, assumptions, scope, technique misapplication); do not average them.
Q: Documentation's "acid test"
A: Replicability — another analyst should be able to recreate the estimate from the documentation alone.
R: yes

## Life Cycle
Q: Technique progression across the program life cycle
A: Early: more emphasis on analogies and parametric relationships (gross estimates expected). As the program matures, estimates get more detailed; engineering build-up and extrapolation from actuals are used more frequently in production and deployment and O&S.
Q: Early estimate confidence ranges
A: Beyond CEBoK: top-down analogy/parametric estimates carry wide ranges because historical data may not reflect the new system's unique risks. CEBoK: early on, gross estimates are expected (poor program definition, changing requirements, scarce cost data).
Q: Late estimate confidence ranges
A: Beyond CEBoK: build-up estimates can support tighter ranges but should still carry risk/growth allowances. CEBoK: as the program matures, it becomes more defined, more data is collected, and estimates get more detailed.
Q: When to re-estimate
A: Beyond CEBoK: at each program milestone, to reflect updated data, design maturity, and the technique appropriate to that phase.
Q: Concept phase techniques (Materiel Solution Analysis)
A: Analogy, high-level parametric, expert opinion (figure-derived study aid). Early phases emphasize analogies and parametric relationships; gross estimates are expected.
Q: Production phase techniques
A: Engineering build-up and extrapolation from actuals are used more frequently in production and deployment and in O&S.
Q: O&S phase estimation
A: Engineering build-up and extrapolation from actuals are used more frequently in the O&S phase; O&S cost estimating techniques are the same three (analogy, parametric, build-up).

## Related Topics
Q: Below-the-line (BTL) factors
A: Cost-on-cost CERs: unitless, often a percentage, typically modeling SEITPM as a percentage of prime mission equipment; may not be statistically based.
R: yes
Q: BTL factors vs. burdens like OH/G&A
A: Similar in application, but BTL factors are less deterministic; they should vary by system/program and should be based on historical information and derived through statistical methods (beware: they may not be statistically based).
Q: Below-the-line factor formula (Beyond CEBoK)
A: Contract pricing burdens (Module 14): $Price = Base \times (1 + OH) \times (1 + G\&A) \times (1 + Fee)$, applied multiplicatively in sequence — not part of this module's BTL/cost-on-cost CER definition.
Q: SEITPM
A: Systems Engineering, Integration & Test, and Program Management, taken together; commonly estimated as a factor of prime mission equipment (hardware and software) cost.
R: yes
Q: O&S cost elements
A: O&S costs can include personnel, consumable/repairable materials, organizational/intermediate/depot maintenance (hardware and software), facilities, sustainment. O&S costs are all of the costs associated with operating, maintaining, and supporting a system.
Q: O&S as share of life-cycle cost
A: Some sources cite 70-80% for certain types of systems; O&S is often excluded or overlooked in decision-making despite this.
Q: O&S analogy example (software maintenance)
A: System A: 2.5M SLOC, \$7.5M/yr. System B: 5M SLOC. Rate view: \$3/SLOC x 5M = \$15M. Ratio view: SLOC ratio 2.0 x \$7.5M = \$15M — same result.
Q: O&S parametric example
A: Ship overhaul cost vs. average ship age: it appears a non-linear relationship exists.
Q: O&S build-up example
A: A reliability-based logistics model, e.g., the Army's CASA (Cost Analysis Strategy Assessment), built from lower-level logistics costs; to qualify as a true build-up, derived from standard relationships and reliability data (MTBF/MTTR).
Q: Updating O&S estimates
A: Beyond CEBoK: as actual sustainment data accumulates, update/refine O&S forecasts using extrapolation from actuals.
Q: Schedule estimating by analogy
A: System A: 10 components / 40 months (4 months/component). System B: 15 components -> 15 x 4 = 60 months. Caveat: complexity may not scale linearly with component count.
Q: Schedule Estimating Relationship (SER) example
A: From the source figure: $y = 0.1x + 3.1163$, $R^2 = 0.9769$, relating schedule duration to total labor hours; the slope gives an approximate average manning level.
Q: Schedule estimating by build-up
A: Sum lower-level task durations; beware deterministic sums on network schedules — critical-path/network effects usually require Monte Carlo simulation.
`
});
