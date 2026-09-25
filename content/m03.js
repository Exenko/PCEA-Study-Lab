PCEA.addModule({
  id: 'm03', num: 3, title: 'Parametric Estimating', short: 'Parametric Estimating', source: 'guide',
  blurb: 'Cost Estimating Relationships (CERs) derive cost from measurable drivers. Master the 4-step process, functional forms, driver selection, and the risk vs. uncertainty split.',
  intro: String.raw`Parametric estimating uses **Cost Estimating Relationships (CERs)** — mathematical expressions linking cost to one or more independent variables (cost drivers) — to estimate cost quickly and with statistical rigor.

**Why it matters**: Parametric methods are fast, objective, repeatable, statistically defensible, and ideal for early estimates, trade studies, and cross-checks. GAO and ICEAA rank them as best practice when data support them.

**Core workflow**: Identify cost driver(s) → collect and normalize data → develop CER → validate → apply to new system.`,
  sections: [
    {
      id: 'definition', title: 'What is Parametric Estimating?', summary: 'Definition, position among four methods, advantages and disadvantages',
      body: String.raw`### Definition

A **Cost Estimating Relationship (CER)** is a mathematical expression relating cost (dependent variable, $Y$) to one or more cost drivers (independent variables, $X_1, X_2, ...$).

General form: $\hat{Y} = f(X_1, X_2, ..., X_k)$

CER is the output of parametric estimating — the statistical relationship itself.

### Position among the four estimating methods

| Method | Basis | Data Need | Best Used When |
|---|---|---|---|
| **Analogy** | Compare to one similar system | Low (one point + adjustments) | Early, little detail, similar system exists |
| **Parametric (CER)** | Statistical relationship across many systems | Moderate-high (multiple points) | Early-mid design, driver data available |
| **Engineering Build-Up** | Sum of detailed elements | High (detailed design/labor) | Late design, high fidelity needed |
| **Expert Opinion** | SME experience | Low | No data, novel, cross-check |

Parametric methods are **quantifiable** (not "looks like X"), grounded in **statistics** (giving objective fit measures), and require a **database** of multiple analogous data points.

+++

### Advantages

- Fast: applies with limited design information.
- Statistically defensible: includes fit measures and uncertainty ($R^2$, standard error, confidence intervals).
- Good for sensitivity analysis: change driver values to see cost impact.
- Encourages consistency, reduces estimator bias vs. expert judgment.
- Useful across the acquisition life cycle, especially early.

### Disadvantages

- Requires a sufficient, relevant, normalized dataset — not always available.
- Valid only **within the range of the data** used to build it (danger of extrapolation).
- Can mask underlying drivers if the model is a black box.
- Statistical significance ≠ causal/logical validity — relationships must make **engineering/programmatic sense**.

:::check
Q: Parametric estimating is most appropriate when…
* You have historical data from multiple analogous systems and design parameters are known or estimable early
- You have only one very similar historical system for comparison
- The program has completed detailed design and all element costs are known
> Parametric methods shine with a relevant database and early parameter knowledge.
:::

+++

:::check
Q: A CER built from data with drivers ranging 100–500 units is applied to a 800-unit system. What is this practice called, and what is the concern?
* Extrapolation; the relationship's validity outside the data range is unverified
- Interpolation; it requires additional cost data
- Calibration; it needs to be tuned to the new system
> Extrapolation adds risk; you must flag it and increase the estimate's uncertainty bounds.
:::`
    },
    {
      id: 'forms', title: 'CER Functional Forms and Cost Drivers', summary: 'Linear, power, exponential; choosing a form; cost driver criteria',
      body: String.raw`### Common CER Functional Forms

| Form | Equation | Linearized | Typical Use |
|---|---|---|---|
| **Linear** | $Y = b_0 + b_1X$ | Already linear | Constant marginal cost per unit of driver |
| **Power** | $Y = aX^b$ | $\ln Y = \ln a + b\ln X$ | Economies/diseconomies of scale; learning curves |
| **Exponential** | $Y = ae^{bX}$ | $\ln Y = \ln a + bX$ | Rapid growth/decay with driver |
| **Linear-log** | $Y = a + b\ln X$ | Already linear in $\ln X$ | Diminishing returns, one-sided curvature |
| **Multiplicative** | $Y = aX_1^{b_1}X_2^{b_2}$ | $\ln Y = \ln a + b_1\ln X_1 + b_2\ln X_2$ | Multiple drivers, each with scale effect |

**Choosing a form**: Plot the data in unit space first. A straight line → linear. A curve that straightens in log-log space → power. A curve that straightens in semi-log space → exponential. Always test the **engineering rationale**, not just which transform gives the best $R^2$.

+++

### Cost Driver Selection Criteria

A good cost driver must be:

- **Logical/causal**: A believable reason the driver affects cost, not just correlated by coincidence (avoid spurious correlations).
- **Measurable/quantifiable**: Available early, objectively countable (weight, power, lines of code, square footage, etc.).
- **Available early** in the life cycle, before cost is known, so the CER can be predictive.
- **Statistically significant**: Demonstrated relationship via regression (low p-value, high t-stat).
- **Sensitive to design changes**: Changes in the driver meaningfully change cost.
- **Not redundant**: Avoid multicollinearity with other drivers in a multivariate CER.

### Common cost drivers by domain

- **Hardware**: weight, power output, thrust, volume, complexity factors
- **Software**: lines of code, function points, number of interfaces
- **Construction/facilities**: square footage, number of units/beds
- **Site activation**: number of sites, distance, site complexity

:::check
Q: Which is the **weakest** reason to pick a cost driver?
- It has a plausible causal link to cost
- It is known early in the program
* It happens to have the highest correlation in a data-mining run, with no engineering rationale
- It is consistently defined across the historical data
> Correlation without logic is spurious; it won't hold for new systems.
:::

+++

:::check
Q: A driver is statistically significant in a CER but is only known after detailed design. Why might this driver still be rejected?
* Because it isn't available early enough to support early estimates, budgeting, or trade studies
- Because the regression t-stat is not high enough
- Because it will cause multicollinearity
> If the driver is unknown until late, the CER can't apply when you need the estimate.
:::`
    },
    {
      id: 'process', title: 'The 4-Step Parametric Process', summary: 'Data collection → cost drivers → CER development → parametric model',
      body: String.raw`Parametric estimating follows a rigid sequence: **Data Collection → Cost Driver Identification → CER Development → Parametric Model Development**.

### Step 1: Data Collection

**Goal**: Assemble a dataset of historical cost and driver values across analogous systems.

**Key activities**:
- Identify relevant analogous programs/systems (similar technology, function, era).
- Collect **both cost and potential driver data**.
- **Normalize the data** (critical):
    - Inflation adjustment (constant-year dollars)
    - Adjust for scope differences (what's included/excluded)
    - Adjust for non-recurring vs. recurring content
    - Convert to consistent units of measure
- **Document pedigree**: source, date, definition, assumptions.
- Screen for **outliers** and anomalies (never drop without investigation).

**Data sufficiency**: Quality and relevance matter more than quantity. Five well-normalized, directly comparable points beat twenty dissimilar, poorly normalized points.

+++

### Step 2: Cost Driver Identification

**Goal**: Determine which independent variable(s) best explain cost variation.

**Process**:
1. Brainstorm candidate drivers based on engineering knowledge.
2. Screen candidates against selection criteria.
3. **Visualize** relationships with scatter plots.
4. **Test statistically** via simple regression: check correlation, $R^2$, significance (t-stat/p-value).
5. For multivariate CERs, check drivers are not highly correlated (multicollinearity check).

A driver must pass both **statistical tests** (significance) and **logic tests** (makes engineering sense).

+++

### Step 3: CER Development

**Goal**: Fit the mathematical relationship.

**Steps**:
1. Select functional form (linear, power, exponential, etc.) based on scatter plot and logic.
2. Transform data if needed (e.g., logs for power).
3. Run regression (OLS) to estimate coefficients.
4. Evaluate statistical validity: $R^2$, SEE, t-stats, residuals.
5. Evaluate **face validity**: does it make engineering sense?
6. Check the **range of applicability** — min/max driver values in the dataset.

:::widget regression:::

:::challenge regression data=tight lock=mode
Q: This tight data set has $R^2$ near 1. Drag **one** point until $R^2$ drops below 0.5.
goal: r2 < 0.5
show: data=outlier
> A single bad point can wreck a CER. $R^2$ compares explained variation with total variation, and one far-off point adds a lot of unexplained variation. Check the data for errors and outliers before you trust a fit.
:::

+++

### Step 4: Parametric Model Development

**Goal**: Package one or more CERs into a usable estimating model.

**Characteristics**:
- May combine multiple CERs across a Work Breakdown Structure (WBS).
- Can be a commercial tool or custom-built.
- Must include documentation: data sources, normalization, equations, ranges, statistical quality.
- Needs periodic calibration/update as new actual-cost data arrives.
- Should be **validated** against known outcomes before use on new estimates.

:::check
Q: What is **calibration** of a parametric model?
* Adjusting model parameters so it reproduces known historical actuals for similar systems
- Converting all data to a single base year
- Removing outliers from the database
> Calibration tunes a general model to a specific organization's or product line's history.
:::

:::check
Q: In the 4-step parametric process, where does the "check the range of applicability" activity fall?
- Step 2 (Cost Driver Identification)
* Step 3 (CER Development), part of evaluation
- Step 4 (Parametric Model Development)
> You determine valid range by examining the min/max values in the data used to fit the CER.
:::`
    },
    {
      id: 'development', title: 'CER Development: Fitting, Evaluation, Range', summary: 'Regression mechanics, validity checks, extrapolation risk',
      body: String.raw`### From scatter plot to regression

**Plot the raw data** in unit space: cost vs. driver. The shape tells you which functional form to try (straight line → linear; curve → power or exponential).

**For power forms** ($Y = aX^b$), take natural logs: $\ln Y = \ln a + b\ln X$. This becomes a linear regression problem in log-log space, which is how we use OLS to fit power relationships.

**For exponential** ($Y = ae^{bX}$), take the natural log: $\ln Y = \ln a + bX$ (linear in $X$ but log of $Y$).

**For multiplicative multivariate** ($Y = aX_1^{b_1}X_2^{b_2}$), log-transform: $\ln Y = \ln a + b_1\ln X_1 + b_2\ln X_2$. Now run multiple linear regression on the transformed variables.

+++

### Evaluating a fitted CER

After regression, check four things:

1. **Statistical fit** ($R^2$, adjusted $R^2$): what proportion of variance does the CER explain? Higher is better; 0.70+ is typical.
2. **Standard Error of the Estimate (SEE)** or **Coefficient of Variation (CV)**: typical scatter around the line. Lower is better.
3. **Significance of each coefficient** (t-stat / p-value): is each driver statistically significant? If a driver's p-value is high (> 0.05), it may not belong.
4. **Residual plot**: scatter should be random (no pattern, no trends, no funnel shape). Patterns suggest the functional form is wrong.

### Range of applicability

**Every CER has a range:** the minimum and maximum driver values in the **fitting data**. Using the CER **inside** this range is **interpolation** (defensible). Using it **outside** is **extrapolation** (adds risk).

Example: A CER built from 50–500 lb items should not be used for a 2,000 lb item without flagging extrapolation risk.

+++

### Face validity and engineering sense

A statistically significant CER must also make **engineering sense**. Does cost increase with weight? Does it respond to complexity the way your domain expects? If a coefficient is counterintuitive, investigate before using it.

:::check
Q: A linear CER for widget cost is $\hat{Y} = 50 + 0.5X$ (Y in \$K, X = production quantity). $R^2 = 0.92$, t-stat = 8.5. Can you apply this to estimate a 2,000-unit widget?
* Yes, if 2,000 is within the data range used to fit the CER; otherwise flag extrapolation risk
- No, because the t-stat is only 8.5
- No, because R² = 0.92 is below 0.95
> Once the CER is valid (good R², significant t-stat, face validity), range of applicability is the only constraint.
:::

:::check
Q: When you fit a power-form CER $Y = aX^b$ using OLS regression in log space, what are you actually regressing?
* $\ln Y$ (dependent) on $\ln X$ (independent)
- $Y$ on $X$ directly
- $a$ on $b$
> Take logs to linearize the power form, then apply OLS to the transformed variables.
:::`
    },
    {
      id: 'examples', title: 'Worked Examples: Site Activation and Multivariate CER', summary: 'Step-by-step calculations, interpretation of coefficients',
      body: String.raw`### Example 1: Site Activation (Simple Linear CER)

**Scenario**: Historical data on cost to activate communication sites.

| Site | Racks (X) | Activation Cost (\$K) (Y) |
|---|---|---|
| 1 | 4 | 85 |
| 2 | 6 | 120 |
| 3 | 8 | 150 |
| 4 | 10 | 190 |
| 5 | 12 | 215 |

**Step 1 — Choose form**: Plotting shows an approximately straight line → **linear**: $Y = b_0 + b_1X$.

**Step 2 — Compute coefficients** (OLS formula):

$\bar{X} = \frac{4+6+8+10+12}{5} = 8.0$, $\bar{Y} = \frac{85+120+150+190+215}{5} = 152.0$

Using $b_1 = \dfrac{\sum(X_i-\bar{X})(Y_i-\bar{Y})}{\sum(X_i-\bar{X})^2}$:

$\sum(X_i-\bar{X})(Y_i-\bar{Y}) = (-4)(-67) + (-2)(-32) + (0)(-2) + (2)(38) + (4)(63) = 660$

$\sum(X_i-\bar{X})^2 = 16 + 4 + 0 + 4 + 16 = 40$

$b_1 = \frac{660}{40} = 16.5$, $b_0 = 152.0 - 16.5(8.0) = 20.0$

**CER**: $\hat{Y} = 20.0 + 16.5X$

**Step 3 — Apply**: Estimate cost for 9 racks:
$$\hat{Y} = 20.0 + 16.5(9) = 168.5 \text{ \$K}$$

**Interpretation**: $b_0 = 20.0$ is fixed/setup cost; $b_1 = 16.5$ is marginal cost per rack.

**Step 4 — Check range**: Data spans 4–12 racks; 9 is **interpolation** (safe). Estimating 20 racks would be **extrapolation** (flag it).

+++

### Example 2: Multivariate CER with Power Form

**Scenario**: Ship system installation cost driven by ship **displacement** (tons) and **crew workstations** (count).

**Assumed fitted CER** (from log-log multiple regression):

$$Cost = 0.85 \times (Displacement)^{0.6} \times (Workstations)^{0.4}$$

where Cost is in \$M, Displacement in thousands of tons, Workstations is a count.

**Linearized form** used to fit it (via OLS on transformed data):

$$\ln(Cost) = \ln(0.85) + 0.6\ln(Displacement) + 0.4\ln(Workstations)$$

**Apply**: Estimate for Displacement = 10 (thousand tons), Workstations = 25.

$$10^{0.6} = e^{0.6 \times \ln 10} = e^{0.6 \times 2.303} = e^{1.382} \approx 3.98$$
$$25^{0.4} = e^{0.4 \times \ln 25} = e^{0.4 \times 3.219} = e^{1.288} \approx 3.62$$
$$Cost = 0.85 \times 3.98 \times 3.62 \approx 12.26 \text{ \$M}$$

**Interpreting exponents**: Each exponent is an **elasticity** — the percent change in cost for a 1% change in that driver, holding the other constant. Here: 1% more displacement → ~0.6% more cost; 1% more workstations → ~0.4% more cost. Exponents sum to 1.0 (constant returns to scale across both).

+++

:::check
Q: CER: $Cost = 1.5 \times W^{0.7}$ (\$K, W in lbs). Estimate cost for W = 100 lbs. (1 decimal)
= 37.7 ±0.2
> $100^{0.7} = 25.12$, so $1.5 \times 25.12 = 37.7$.
:::

:::check
Q: CER: $Cost = 12 + 0.05W + 1.8P$ (linear). W = 400, P = 10. What is Cost?
= 50
> $12 + 0.05(400) + 1.8(10) = 12 + 20 + 18 = 50$.
:::

:::check
Q: A ship activation CER shows exponent 0.5 on displacement. A 1% increase in displacement, holding all else constant, increases cost by approximately…
= 0.5
> Exponent = elasticity = percent change in cost per 1% change in driver.
:::

:::check
Q: In the multivariate ship CER, if both Displacement and Workstations increase by 1%, cost increases by approximately…
= 1.0
> Elasticities add: $0.6 + 0.4 = 1.0$.
:::`
    },
    {
      id: 'sensitivity', title: 'Sensitivity Analysis, Cost Response, and Risk vs. Uncertainty', summary: 'One-at-a-time sensitivity, response curves, key distinction',
      body: String.raw`### Sensitivity Analysis

**Definition**: Systematically vary a CER's input driver value(s) **one at a time** and observe how the output cost changes, holding other inputs constant.

**Purpose**: Identify which driver(s) the estimate is **most sensitive to**. These drivers are where additional data collection or design refinement adds the most value.

**Example** (site activation CER: $\hat{Y} = 20.0 + 16.5X$):

| Racks (X) | Cost (\$K) | % Change from Base (X=9) |
|---|---|---|
| 7 | 135.5 | −19.6% |
| 9 (base) | 168.5 | — |
| 11 | 201.5 | +19.6% |

A ±2-rack swing produces about ±19.6% in cost. For power forms, sensitivity is proportional to the exponent $b$: a 1% change in $X$ produces ~$b$% change in $Y$ (elasticity).

**Tornado chart**: A bar chart showing the estimate's swing for each input, sorted largest first. It answers: "Which inputs matter most?"

+++

### Cost Response Curves

A **cost response curve** plots cost against a performance or programmatic parameter (e.g., range, accuracy, schedule). It often has a **knee** — a point where added performance becomes disproportionately expensive.

**Use**: Trade studies and requirements analysis. If a cost response curve is flat up to 90% performance then rises steeply, that 90% point is a natural trade-off (cost vs. requirement).

### Parametric analysis of technical parameters

You can apply parametric methods not just to cost, but to **technical parameters themselves**. Example: estimate weight from power output before using weight to estimate cost. This creates a **chain of CERs** — very useful early when even basic physical characteristics aren't finalized.

+++

### Risk vs. Uncertainty (Critical Distinction)

**Uncertainty**: The natural **statistical scatter** of data around a CER's fitted line. It is inherent in every CER because real-world data never fits perfectly. Captured by **Standard Error of the Estimate (SEE)**, **prediction intervals**, and regression residuals. Present whether or not you identify specific risk events.

**Risk**: A distinct, **identifiable event or condition** that could impact cost (e.g., a specific technical risk, a schedule slip risk, a supplier failure). Separate from the CER's statistical error. Typically addressed through **risk analysis and Monte Carlo simulation**, not directly through the regression's error term.

**Key distinction**: Uncertainty is inherent scatter; risk is a discrete event outside the CER's fit. **A complete estimate must account for both.**

:::check
Q: In a parametric estimate, the CER has a standard error (SEE) of ±\$2M around a point estimate of \$50M. This \$2M represents…
* Uncertainty: the natural statistical scatter of data around the fitted CER
- Risk: an identifiable event that could change the cost
- Calibration error in the model
> SEE is a regression statistic capturing inherent scatter, not discrete risk events.
:::

:::check
Q: A cost response curve is flat up to 90% probability of kill, then rises steeply. What does the knee suggest?
* Requirements above ~90% cost disproportionately, so that point is a natural trade-off
- The CER is invalid
- Always buy the highest performance
> The knee shows where performance/cost trades become most valuable.
:::

:::check
Q: Which three items should feed a complete cost risk analysis?
* Uncertainty in the CER itself (SEE/PI), uncertainty in driver values, and discrete risk events
- Only the CER's statistical error
- Only discrete risk events
> A robust estimate layers all three sources of risk.
:::`
    },
    {
      id: 'pitfalls', title: 'Pitfalls, Checks, and Decision Tree', summary: 'Common traps, sanity checks, when to use parametric',
      body: String.raw`### Common Mistakes

1. **Extrapolating beyond the data range** without flagging risk.
2. **Choosing functional form by best $R^2$ alone**, ignoring engineering logic.
3. **Using un-normalized data** (mixed inflation years, scope, units).
4. **Confusing correlation with causation** — statistical significance ≠ causal link.
5. **Ignoring multicollinearity** in multivariate CERs — makes coefficients unstable.
6. **Reporting only a point estimate**, omitting uncertainty range (SEE/PI).
7. **Treating risk and uncertainty as the same thing**.
8. **Dropping outliers without documentation**.
9. **Over-fitting** — adding drivers that raise $R^2$ but aren't individually significant.

+++

### Sanity Checks on a Fitted CER

✓ Cost falls as units increase (or responds logically to the driver)
✓ LCS (learning curves) typically 0.70–0.95
✓ For power forms, $b$ is negative (cost decreases with quantity)
✓ Slope sign and magnitude make engineering sense
✓ $R^2$ ≥ 0.70 (typical threshold)
✓ t-statistics and p-values on coefficients show significance
✓ Residuals scatter randomly (no patterns)
✓ Range of applicability is clearly stated

+++

### Decision Tree: When to Use Parametric Estimating

**No data?** Estimate T1 (first-unit) using other techniques; borrow an LCS or analogy driver from an analogous system; apply the parametric curve.

**Good data on many units, same system?** Parametric is strong. Follow the 4 steps. Prefer ULC (unit curve) over CUMAV (cumulative average) unless required or data is very noisy.

**Lot data (only totals, not units)?** You need lot midpoints to fit a unit curve. Use the heuristic LMP, regress, refine, iterate once.

**Early design, limited detail?** Parametric shines here. Use coarse drivers (weight, power) that are known early.

**Late design, detailed breakdown available?** Consider engineering build-up instead, or use parametric as a cross-check.

**One very similar system?** Use **analogy** instead; parametric needs a database.

:::check
Q: A tornado chart shows the estimate swings \$40M with weight, \$3M with labor rate, and \$2M with SEPM factor. Where should you focus?
* Refining the weight estimate and its uncertainty
- Refining the labor rate
- Refining the SEPM factor
> Sensitivity analysis points to the inputs that move the answer most.
:::

:::check
Q: You have CER coefficients that are statistically significant (p < 0.05) but the fitted relationship predicts that cost **decreases** as weight increases. What should you do?
* Reject this CER; statistical significance does not guarantee logical/causal validity
- Use the CER anyway since it passed the significance test
- Recalculate the p-values
> Face validity and engineering sense are non-negotiable.
:::

:::check
Q: A multivariate CER has a high $R^2$ (0.95) but neither coefficient is significant, and the two drivers correlate at r = 0.97. What is the likely problem?
* Multicollinearity between the drivers
- Heteroscedasticity
- Too many data points
> Highly correlated drivers inflate standard errors and mask individual significance.
:::`
    }
  ],
  cards: String.raw`
## Fundamentals
Q: Parametric estimating (definition)
A: Estimating cost from technical/programmatic parameters using statistical relationships (CERs) derived from historical data.
Q: Cost Estimating Relationship (CER) (definition)
A: A mathematical expression relating cost (Y) to one or more cost drivers (X₁, X₂, ...) — the output of parametric estimating.
Q: General form of a CER
A: $\hat{Y} = f(X_1, X_2, ..., X_k)$ (point estimate of cost as a function of drivers)
Q: Position of parametric estimating among the four methods
A: Between analogy (low data, early) and engineering build-up (high data, late); requires multiple data points but works early.
Q: Key advantages of parametric estimating
A: Fast, objective, repeatable, statistically defensible, good for sensitivity/trades, usable early with limited design detail.
Q: Key disadvantage of parametric estimating
A: Valid only within the range of the data used to build it; extrapolation adds risk.
Q: Why must a CER be logically justified, not just statistically significant?
A: Correlation without causal logic is spurious and won't hold for new systems.

## CER Forms
Q: Linear CER functional form
A: $Y = b_0 + b_1X$ (constant marginal cost per unit of driver)
Q: Power CER functional form
A: $Y = aX^b$ (linearized: $\ln Y = \ln a + b\ln X$ for regression)
Q: Power CER (linearized form for OLS)
A: $\ln Y = \ln a + b\ln X$ (log-log regression)
Q: Exponential CER functional form
A: $Y = ae^{bX}$ (linearized: $\ln Y = \ln a + bX$ for regression)
Q: Exponential CER (linearized form for OLS)
A: $\ln Y = \ln a + bX$ (semi-log regression)
Q: Linear-log CER functional form
A: $Y = a + b\ln X$ (diminishing returns, one-sided curvature)
Q: Multiplicative multivariate CER
A: $Y = aX_1^{b_1}X_2^{b_2}$ (power form with multiple drivers; linearized: $\ln Y = \ln a + b_1\ln X_1 + b_2\ln X_2$)
Q: How do you linearize a power CER for regression?
A: Take natural log of both sides: $\ln Y = \ln a + b\ln X$. Then regress $\ln Y$ on $\ln X$ using OLS.
Q: How to choose which CER functional form to use
A: Plot data in unit space; straight line → linear; curve that straightens in log-log → power; curve that straightens in semi-log → exponential; always verify engineering logic.

## Cost Drivers
Q: Cost driver (definition)
A: An independent variable (e.g., weight, power, lines of code) used to predict/explain cost in a CER.
Q: Five criteria for a good cost driver
A: Logical/causal link to cost, measurable/quantifiable, available early, statistically significant, sensitive to design changes.
Q: Why must a cost driver be "available early"?
A: So the CER can support early estimates, budgeting, and trade studies before final design is known.
Q: Why check multicollinearity between drivers in a multivariate CER?
A: Highly correlated drivers inflate standard errors, making individual coefficients unreliable and hard to interpret.
Q: Common hardware cost drivers
A: Weight, power output, thrust, volume, complexity/technology factors.
Q: Common software cost drivers
A: Lines of code, function points, number of interfaces.
Q: Common facility/construction cost drivers
A: Square footage, number of units/beds/positions.

## The 4-Step Process
Q: The four steps of the parametric process, in order
A: 1. Data Collection 2. Cost Driver Identification 3. CER Development 4. Parametric Model Development
Q: Step 1 of parametric process: Data Collection (key activities)
A: Identify analogous programs, collect cost & driver data, normalize (inflation, scope, units, NR vs. R), document pedigree, screen for outliers.
Q: Step 2 of parametric process: Cost Driver Identification (key activities)
A: Brainstorm candidates, screen against criteria, visualize scatter plots, test significance via regression, check multicollinearity.
Q: Step 3 of parametric process: CER Development (key activities)
A: Choose functional form, transform data if needed, run OLS regression, evaluate fit (R², SEE, t-stats, residuals), check face validity, note range of applicability.
Q: Step 4 of parametric process: Parametric Model Development (key activities)
A: Combine CERs across WBS, add factors for other elements, calibrate (tune to known data), validate (test on held-out data), document fully.
Q: What is calibration of a parametric model?
A: Adjusting model parameters so it reproduces known historical actuals for similar systems (tune to organizational history).
Q: What is validation of a parametric model?
A: Testing the model against data not used to build it to confirm predictive accuracy.
Q: Minimum and preferred number of data points for a CER
A: Minimum 3; 8+ preferred for statistical confidence.

## CER Fitting & Evaluation
Q: When fitting a power-form CER, what transformation is applied before OLS regression?
A: Take natural log of both cost and driver: $\ln Y = \ln a + b\ln X$. Regress $\ln Y$ on $\ln X$.
Q: In a linear CER $Y = b_0 + b_1X$, what does b₀ represent?
A: Fixed or intercept cost (cost when driver = 0 or baseline).
Q: In a linear CER $Y = b_0 + b_1X$, what does b₁ represent?
A: Marginal cost per unit increase in the driver.
Q: Four items to check when evaluating a fitted CER
A: Statistical fit (R², SEE), significance of each coefficient (t-stat, p-value), residuals (random scatter), face validity (engineering sense).
Q: What R² threshold is typical for a defensible CER?
A: 0.70 or higher; lower may lack statistical rigor.
Q: Range of applicability (definition)
A: The minimum and maximum driver values in the dataset used to fit the CER.
Q: Using a CER inside its range of applicability is called ___; outside is called ___
A: Interpolation; extrapolation
Q: Why is extrapolation risky?
A: The relationship's validity outside the fitted range is unverified; adds uncertainty/risk to the estimate.
Q: How do you transform back from a log-space regression to get a in $Y = aX^b$?
A: If the regression gives intercept $\alpha$ and slope $\beta$, then $a = e^{\alpha}$ and $b = \beta$.

## Site Activation Example
Q: Site activation CER from the guide: $$\hat{Y} = 20.0 + 16.5X$$ (Y = cost in \$K, X = racks). Cost for X = 9?
A: $20.0 + 16.5(9) = 168.5$ (\$K)
Q: In site activation CER ($\hat{Y} = 20.0 + 16.5X$), what does the intercept 20.0 represent?
A: Fixed/setup cost (mobilization, site survey, base infrastructure).
Q: In site activation CER ($\hat{Y} = 20.0 + 16.5X$), what does the slope 16.5 represent?
A: Marginal cost (\$K) per additional rack.
Q: Site activation CER was fit from data spanning 4–12 racks. Is using it for 9 racks safe?
A: Yes, 9 is interpolation (within range). Using 20 racks would be extrapolation (flag risk).

## Multivariate CER Example
Q: Multivariate ship CER: $$Cost = 0.85 \times (Displacement)^{0.6} \times (Workstations)^{0.4}$$. Cost for Displacement=10, Workstations=25?
A: $0.85 \times 3.98 \times 3.62 \approx 12.26$ (\$M)
Q: In multivariate power CER, what does an exponent (e.g., 0.6) represent?
A: Elasticity: the percent change in cost per 1% change in that driver, holding other drivers constant.
Q: In the ship CER with exponents 0.6 (displacement) and 0.4 (workstations), if both increase 1%, cost increases by ___%.
A: 1.0 (elasticities add: 0.6 + 0.4 = 1.0)
Q: When exponents in a multiplicative CER sum to 1.0, this suggests ___
A: Constant returns to scale (cost grows proportionally with the combined drivers).
Q: How do you evaluate a multivariate CER for multicollinearity?
A: Check if drivers are highly correlated (r > 0.80); if so, coefficients become unreliable; consider dropping one driver or combining them.

## Sensitivity & Response
Q: Sensitivity analysis (definition)
A: Systematically varying one CER input at a time to see how the output cost changes; identifies which drivers matter most.
Q: Tornado chart (definition)
A: A bar chart of each input's cost swing, sorted largest first; shows which inputs the estimate is most sensitive to.
Q: Cost response curve (definition)
A: A plot of cost vs. a performance or programmatic parameter; often has a "knee" where added performance becomes expensive.
Q: Purpose of a cost response curve
A: Support trade studies and requirements analysis; identify natural trade-off points (e.g., cost vs. performance).
Q: Parametric analysis of technical parameters (concept)
A: Applying parametric methods to technical parameters themselves (e.g., estimating weight from power) before using them as cost drivers — creates a chain of CERs.

## Risk vs. Uncertainty
Q: Uncertainty (in parametric estimates)
A: Natural statistical scatter of data around the CER's fitted line; captured by SEE, prediction intervals, residuals.
Q: Risk (in parametric estimates)
A: A distinct, identifiable event or condition (e.g., a technical risk, schedule slip) that could affect cost, separate from CER statistical error.
Q: Difference between risk and uncertainty
A: Uncertainty is inherent scatter in the CER; risk is a discrete, identifiable event outside the CER's fit. Both belong in a complete estimate.
Q: How is risk typically addressed, separate from the CER's statistical error?
A: Through risk analysis and Monte Carlo simulation, not directly through regression residuals.

## Pitfalls & Decision Tree
Q: Nine common CER mistakes (name any four)
A: Extrapolating without flagging risk; choosing form by R² alone; using un-normalized data; confusing correlation with causation; ignoring multicollinearity; omitting uncertainty range; mixing risk/uncertainty; dropping outliers without documentation; over-fitting.
Q: When CER coefficients are statistically significant but engineering sense is violated, what should you do?
A: Reject the CER; statistical significance does not guarantee causal/logical validity.
Q: Use parametric estimating when…
A: You have historical data from analogous systems, design parameters are known/estimable early, and you want objective, repeatable estimates.
Q: Use analogy when…
A: You have only one very similar historical system and need an estimate; requires minimal data.
Q: Use engineering build-up when…
A: Detailed design is complete and all element costs can be estimated bottom-up.
Q: In a multivariate CER with high R² but no significant individual coefficients and r=0.97 between drivers, the problem is…
A: Multicollinearity; the correlated drivers inflate standard errors, masking individual significance despite good overall fit.
Q: Point estimate vs. uncertainty range in a CER
A: Always report a CER as a point estimate **plus** an uncertainty range (SEE/prediction interval), never point estimate alone.
Q: Sanity check: cost should ___ as the driving quantity increases
A: Decrease (or respond in a logically consistent direction); if cost increases with weight despite engineering judgment, investigate.
Q: A CER built from 100–500-unit data is applied to an 800-unit system. Name this practice and the risk.
A: Extrapolation; the relationship's validity outside the data range is unverified, adding uncertainty.

## Key Formulas & Definitions
Q: Linear CER computational formulas
A: $b_1 = \frac{\sum(X_i-\bar{X})(Y_i-\bar{Y})}{\sum(X_i-\bar{X})^2}$ and $b_0 = \bar{Y} - b_1\bar{X}$
Q: Elasticity (in a power/multiplicative CER)
A: The exponent; represents percent change in cost per 1% change in driver, holding others constant.
`
});
