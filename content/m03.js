PCEA.addModule({
  id: 'm03', num: 3, title: 'Parametric Estimating', short: 'Parametric Estimating', source: 'guide',
  blurb: 'Cost Estimating Relationships (CERs) derive cost from measurable drivers. Master the 4-step process, functional forms, driver selection, cost drivers vs. passengers, and calibration.',
  intro: String.raw`Parametric estimating uses **Cost Estimating Relationships (CERs)** — mathematical expressions linking cost to one or more independent variables (cost drivers) — to estimate cost quickly and with statistical rigor.

**PEH definition**: "Parametric estimating is a technique that develops cost estimates based upon the examination and validation of the relationships which exist between a project's technical, programmatic, and cost characteristics as well as the resources consumed during its development, manufacture, maintenance, and/or modification."

**Core workflow (4 steps)**: Data Collection → Cost Driver Identification → CER Development → Parametric Model Development.`,
  sections: [
    {
      id: 'definition', title: 'What is Parametric Estimating?', summary: 'Definition, position among three techniques, advantages, and data sources',
      body: String.raw`### Definition

A **Cost Estimating Relationship (CER)** is a mathematical expression relating cost (dependent variable, $Y$) to one or more cost drivers (independent variables, $X_1, X_2, ...$).

General form: $\hat{Y} = f(X_1, X_2, ..., X_k)$

CER is the output of parametric estimating — the statistical relationship itself. Cost drivers, preferably drawn from an organization's own history, are the independent variables that influence how much money is spent on an item (cost, the dependent variable); these variables become required inputs that must be accurately determined for the CER to produce cost. Parametric relationships can also estimate schedule, weight, and other non-cost outputs.

### Three primary estimating techniques

| Technique | Approach | Key Traits |
|---|---|---|
| **Analogy** | Comparative analysis of similar systems | Usable early, before detailed requirements are known; provides **no objective test of validity** |
| **Parametric Estimating** | Mathematical relationship between a parameter and cost | Historical data can be difficult to obtain; relationships are easily adjusted for requirements changes and provide statistical results to assess quality |
| **Engineering Build-Up** | Sum of detailed lower-level elements rolled up | Requires a high level of data detail and deep collaboration; produces easily **traceable** detail but can be **expensive**; missing or incorrect data raises the risk of omitting costs |

Expert opinion is used alongside these three (see Module 2 Costing Techniques) but isn't one of the primary techniques covered in this module.

Analysts rely heavily on analogy and parametrics early in the acquisition cycle. As design detail matures, build-up sees more use, though parametric estimating continues to play a role. As actuals arrive — from Low-Rate Initial Production (LRIP) or full-rate production — they are incorporated into the estimate. Manufacturers directly incorporate their own costs; government analysts use data available via the **Contractor Cost Data Reporting (CCDR)** system.

+++

### Advantages

The parametric approach provides:

- **Versatility**
- **Objective, quantitative inputs**
- **Easily traceable equations** that clearly link input and output variables
- **Easily adjustable input parameters**

### Statistical measures

Regression analysis produces several statistics used to judge CER quality: the **t-statistic** and **F-statistic** (objective measures of a coefficient's or the model's validity), **R²** (explanatory power), and the **Coefficient of Variation (CV)** (used to derive error bands in cost risk analysis). Module 8 Regression Analysis and Module 9 Cost Risk Analysis explore these measures and their application in more detail.

### Data sources

Some example data types collected to support parametric estimating: Lines of Code (LOC), site deployment plans, subcontractor/vendor procurement data, Test & Evaluation (T&E) schedules, physical characteristics (weight, power), Technical Performance Measures (e.g., speed), resource staffing, and other operational parameters reflecting a concept of operations (CONOPs).

### COTS models vs. in-house models

COTS (Commercial Off-The-Shelf) parametric cost models are generally quicker to build and execute than models built from scratch, but they suffer two disadvantages: lack of visibility into the underlying methodology, and they encourage an over-reliance on the model.

:::tip Beyond CEBoK
This module's source lists exactly four advantages above. Practitioners commonly also describe parametric methods as fast, repeatable, good for sensitivity/trade studies, and helpful for reducing estimator bias versus pure expert judgment — all true in practice, and covered elsewhere in CEBoK, but not part of this module's own advantages list. Likewise, "valid only within the data's range" and "black-box masking of drivers" are real cautions (see the Range of Applicability discussion later in this module) rather than items on this specific list.
:::

:::check
Q: Parametric estimating is most appropriate when…
* You have historical data from multiple analogous systems and design parameters are known or estimable early
- You have only one very similar historical system for comparison
- The program has completed detailed design and all element costs are known
> Parametric methods shine with a relevant database and early parameter knowledge.
:::

+++

:::check
Q: Which of the three primary estimating techniques provides no objective test of validity?
* Analogy
- Parametric Estimating
- Engineering Build-Up
> Analogy compares to one similar system with no statistical test behind the comparison.
:::

:::check
Q: Which statistic is used to derive error bands in cost risk analysis?
* Coefficient of Variation (CV)
- t-statistic
- F-statistic
> R² measures explanatory power; t/F test significance; CV derives the error bands used in risk analysis.
:::`
    },
    {
      id: 'forms', title: 'CER Functional Forms, Cost Drivers, and Cost Passengers', summary: 'Regression forms, driver criteria, cost passengers, rates/factors/ratios',
      body: String.raw`### CER Regression Forms

| Form | Equation | Linearized | Typical Use |
|---|---|---|---|
| **Linear** | $Y = a + bX$ | Already linear | Constant marginal cost per unit of driver |
| **Power** | $Y = aX^b$ | $\ln Y = \ln a + b\ln X$ | Economies/diseconomies of scale; learning curves |
| **Logarithmic** | $Y = a + b\ln X$ | Already linear in $\ln X$ | Diminishing returns, one-sided curvature |
| **Exponential** | $Y = ae^{bX}$ | $\ln Y = \ln a + bX$ | Rapid growth/decay with driver |
| **Generalized polynomial** (less common) | $Y = a + b_1X_1 + b_2X_2 + ... + b_nX_n$ | Already linear in each $X_i$ | Several additive linear drivers |

**Choosing a form**: Plot the data in unit space first. A straight line → linear. A curve that straightens in log-log space → power. A curve that straightens in semi-log space → exponential. Always test the **engineering rationale**, not just which transform gives the best $R^2$.

+++

:::widget cer-forms:::

+++

### What makes a cost driver

Cost drivers are the system-level design decisions and requirements that truly influence how much money is spent. Analysts search for parameters that **logically** drive cost, drawing on SMEs and **scatter plots** (Module 6); identifying drivers is **iterative** with data collection. Some drivers affect more than one cost element or ripple into the design, but parameters that drive **design** are not always the ones that drive **cost**. Collecting data on every possible parameter is prohibitively expensive and inefficient, so identification takes understanding and expertise.

CEBoK's examples of **top-level cost drivers**:

- hardware or equipment
- resource requirements
- level of automation
- technical requirements such as speed and accuracy
- life cycle support concerns such as reliability or maintenance philosophy

**Weight, power, and LOC** are common cost drivers and routinely collected.

:::tip Beyond CEBoK: driver checklist and domain examples
A common practitioner checklist: a good driver is logical/causal, measurable, available early in the life cycle, statistically significant, sensitive to design changes, and not redundant with other drivers (multicollinearity). Typical examples by domain: hardware (weight, power output, thrust, volume), software (lines of code, function points, interfaces), facilities (square footage, number of units/beds).
:::

Some cost drivers may affect more than one cost element or ripple into design; but parameters that drive **design** aren't always the parameters that drive **cost**.

+++

### Cost Passengers

**Cost passengers** are major system components representing the majority of a system's cost — the WBS elements with the highest dollar values — identified using **Pareto charts**. Cost drivers and cost passengers are easy to confuse: analysts looking for savings (e.g., under a Reduction of Total Ownership Cost initiative) often target passengers, but a cost passenger **does not always represent the biggest potential for cost savings**. Cost drivers are the design decisions/requirements that actually control how cost can be influenced; passengers just show where the dollars sit.

**Pea-pod analogy**: A pea pod wraps around the peas, and its design (size, shape) is dictated by the number/shape/size of the peas — the driver — even though the pod itself may be the visible cost item — the passenger. Likewise, a ship's hull or an airplane's airframe is a cost passenger: it's designed to carry the crew and mission equipment (the cost drivers), represents a large share of system cost, but can't easily be changed to influence that cost without changing the underlying requirements it wraps.

+++

### Rates, Factors, and Ratios

Some CERs are simple multipliers rather than full regressions — though, like CERs, they can also be derived from a rigorous regression process:

- **Rate**: cost expressed in dollars per parameter. The most common example is a **labor rate** (\$/hour for a labor category). Cost per function point or per LOC are common software-estimating rates.
- **Factor**: **cost-on-cost**, unitless, usually a percentage — the cost of one element predicts the cost of another. Example: **System Engineering/Program Management (SE/PM)** estimated as 20% of the program's **prime mission equipment** (hardware and software).
- **Ratio**: **parameter on parameter**. Example: an industry-average ratio of **1,200 lines of code (LOC) per integrated Commercial Off-The-Shelf (COTS) package**.

CEBoK notes these three terms are sometimes improperly interchanged. Rates, factors, and ratios are often the result of very simple calculations such as the **arithmetic mean**: $A = \frac{1}{n}\sum_{i=1}^{n} a_i$.

**Calibration example**: if a program later collects actuals showing **1,500 LOC per package** instead of the assumed 1,200, the analyst can update the model. Because the new average could fall within expected statistical variation, options include: re-running the CER with the augmented data set, re-calibrating the CER to pass through the new data point, changing the methodology altogether, or leaving the model unchanged.

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
Q: A program assumed 1,200 LOC per COTS package (a ratio) and later collects actuals showing 1,500 LOC per package. What should the analyst consider?
* The new value could be within expected statistical variation, so options range from re-running/re-calibrating the CER to leaving the model unchanged
- Always immediately replace 1,200 with 1,500 in the model
- Ratios can never be updated once set
> Analysts must judge whether new data requires an update at all before choosing how to update.
:::

:::check
Q: A driver is statistically significant in a CER but is only known after detailed design. Why might this driver still be rejected?
* Because it isn't available early enough to support early estimates, budgeting, or trade studies
- Because the regression t-stat is not high enough
- Because it will cause multicollinearity
> If the driver is unknown until late, the CER can't apply when you need the estimate.
:::`
    },
    {
      id: 'process', title: 'The 4-Step Parametric Process', summary: 'Data collection → cost drivers → CER development (5 steps) → calibration → parametric model',
      body: String.raw`Parametric estimating follows a rigid sequence: **Data Collection → Cost Driver Identification → CER Development → Parametric Model Development**.

### Step 1: Data Collection

**Goal**: Assemble a dataset of historical cost, schedule, and technical data from systems similar to the one being estimated (e.g., skills for a software project; missiles for a missile program; cruisers/destroyers/frigates for a new surface ship).

**Key activities**:
- Gather data from cost reports, the schedule, and requirements documents (e.g., the Cost Analysis Requirements Description, CARD).
- **Normalize the data**: inflation adjustment (constant-year dollars), scope adjustment, non-recurring vs. recurring content, consistent units of measure.
- **Document pedigree**: source, reasoning, assumptions, raw data — for traceability.
- Data collection is **iterative**: analysts keep adding data as new sources are identified.

+++

### Step 2: Cost Driver Identification

**Goal**: Determine which independent variable(s) best explain cost variation.

**Process**:
1. Hypothesize candidate drivers from analogy, organization history, expert judgment, or engineering knowledge of the system.
2. **Scatter plot** the data to visually surface relationships (often easier to interpret than numerical analysis alone).
3. Test each candidate's correlation with cost.
4. Check drivers for multicollinearity before using them together in a multivariate CER.

A driver must pass both **statistical tests** (significance) and **logic tests** (engineering/physical causality). This step is also iterative: analysts can't identify drivers without data, but predicted drivers can shape the data collection plan.

+++

### Step 3: CER Development

The regression process (preferred over simple averaging) follows **five steps**:

1. **Select the Variables**: Determine the independent (source) variable, its data collection methodology, and data type; determine which cost data is the dependent variable.
2. **Test Relationships**: Set aside representative data for later validation. Scatter plot the remaining (working) data set to see the strength, form, and direction of each relationship, and spot trends, anomalies, or outliers.
3. **Perform Regression**: Use Ordinary Least Squares (OLS). Regression equations can be linear ($y=a+bx$), power ($y=ax^b$), logarithmic ($y=a+b\ln x$), exponential ($y=ae^{bx}$), or generalized polynomial (less common, $y=a+b_1x_1+b_2x_2+...+b_nx_n$). Non-linear models are transformed to fit a linear model.
4. **Select CERs**: Choose the CER that best represents the data.
5. **Validate CERs**: Validate against the representative data **held out** in step 2 (not used to build the equation). Use the **Prediction Interval (PI)** methodology to capture uncertainty — important because analysts often apply CERs outside the range of collected data (e.g., estimating a faster, bigger, or more accurate successor system), and PI-based uncertainty grows the further an estimate departs from the core data set.

+++

### Calibration

**Calibration** resets the **y-intercept (constant term)** of a CER to force it through a desired point (Fig 3.4), shifting the whole line vertically. Reasons to calibrate:

- To **correct an analogy**: calibrate a CER to pass through a point determined by the analogy.
- To adjust a broad, robust CER to a **smaller, specific data set** (a company, commodity, or agency's own experience).
- For **CAIV (Cost as an Independent Variable) or Target Costing** trades: a CER with worse statistics but that *is* responsive to the performance parameter of interest can be calibrated to intersect a point generated by a better (but non-responsive) CER.

Calibration has a **separate, secondary meaning** for commercial cost models: inserting historical program inputs and adjusting model parameters (e.g., complexity) until the model matches historical actual costs, making the model more applicable.

Calibration is **not** force-fitting a data point in a regression-based CER, and must be carefully documented. With a calibrated CER, analysts must be extra cautious about the range over which it's applied — it's generally acceptable to stay within **one standard deviation of $x$ from the point of departure**.

:::widget calibration:::

+++

### Step 4: Parametric Model Development

**Goal**: Package one or more CERs into a usable estimating model, mapped to the WBS.

**Characteristics**:
- May combine multiple CERs across a Work Breakdown Structure (WBS), plus other cost estimating techniques; often used for Life Cycle Cost (LCC)/Total Ownership Cost (TOC) estimates.
- May include logic for time phasing, inflation, allocations, Monte Carlo simulation, schedule estimating, learning curves, earned value management, or Design-to-Cost/CAIV trades.
- Elements estimated separately are often correlated; ignoring that correlation understates overall uncertainty (Module 9 Cost and Schedule Risk Analysis).
- When new program-specific actuals arrive, choices include: re-running the CER with the augmented data set, re-calibrating to pass through the new point, changing methodology, or leaving the model unchanged.

:::widget regression:::

:::challenge regression data=tight lock=mode
Q: This tight data set has $R^2$ near 1. Drag **one** point until $R^2$ drops below 0.5.
goal: r2 < 0.5
show: data=outlier
> A single bad point can wreck a CER. $R^2$ compares explained variation with total variation, and one far-off point adds a lot of unexplained variation. Check the data for errors and outliers before you trust a fit.
:::

:::check
Q: What is **calibration** of a CER?
* Resetting the y-intercept (constant term) so the CER passes through a desired point — e.g., to correct an analogy, fit a narrower data set, or support a CAIV/Target Costing trade
- Converting all data to a single base year
- Removing outliers from the database
> Calibration shifts the fitted line vertically to intersect a chosen point; it also has a secondary sense of tuning a commercial model's inputs to match historical actuals.
:::

:::check
Q: How far can a calibrated CER generally be applied from its calibration point without extra caution?
* Within about one standard deviation of x from the point of departure
- Anywhere within the original (uncalibrated) CER's full data range
- Calibrated CERs may be applied at any x value
> Calibration narrows the safe range; analysts should be more cautious than usual about where they apply it.
:::

:::check
Q: In the CER development process, in which step is representative data set aside for later use?
- Select the Variables
* Test Relationships
- Perform Regression
> Holding out representative data during Test Relationships lets analysts validate the CER later on data not used to build it.
:::`
    },
    {
      id: 'development', title: 'CER Development: Fitting, Evaluation, Range', summary: 'Regression mechanics, validity checks, extrapolation risk',
      body: String.raw`### From scatter plot to regression

**Plot the raw data** in unit space: cost vs. driver. The shape tells you which functional form to try (straight line → linear; curve → power or exponential).

**For power forms** ($Y = aX^b$), take natural logs: $\ln Y = \ln a + b\ln X$. This becomes a linear regression problem in log-log space, which is how we use OLS to fit power relationships.

**For exponential** ($Y = ae^{bX}$), take the natural log: $\ln Y = \ln a + bX$ (linear in $X$ but log of $Y$).

**For a generalized polynomial** ($Y = a + b_1X_1 + b_2X_2 + ...$), run multiple linear regression directly on the variables — no transform is needed since it's already linear in each $X_i$.

+++

### Evaluating a fitted CER

After regression, check four things:

1. **Statistical fit** ($R^2$): what proportion of variance does the CER explain? Higher is better; some analysts use 0.70+ as a rule of thumb, though this module's source sets no fixed threshold.
2. **Coefficient of Variation (CV)**: typical scatter around the line, used to derive risk error bands. Lower is better.
3. **Significance of each coefficient** (t-stat / F-stat / p-value): is the model as a whole, and each driver, statistically significant? The model is valid overall if the **F-statistic**'s p-value ("Significance F") is below $\alpha = 0.05$. If a coefficient's p-value is high, that variable may not belong — and if a variable in the model isn't significant, the model should generally be **rejected**. For a single-variable regression, the variable's t-statistic and the model's F-statistic are always identical.
4. **Residual plot**: scatter should be random (no pattern, no trends, no funnel shape). Patterns suggest the functional form is wrong.

An **intercept (constant term)** is often not statistically significant even when the rest of the model is — this is common, and analysts usually accept the predicted intercept anyway. Never interpret an intercept as an actual fixed cost at $X=0$; especially when it's negative, it can simply be outside the CER's valid range and mathematically meaningless as a "cost."

### Range of applicability

**Every CER has a range:** the minimum and maximum driver values in the **fitting data**. Using the CER **inside** this range is **interpolation** (defensible). Using it **outside** is **extrapolation** (adds risk) — and it happens often in practice, since programs frequently target systems faster, bigger, or more capable than their predecessors.

+++

### Face validity and engineering sense

A statistically significant CER must also make **engineering sense**. Does cost increase with weight? Does it respond to complexity the way your domain expects? If a coefficient is counterintuitive, investigate before using it.

:::check
Q: A CER's intercept is not statistically significant, but its single driver variable is highly significant. What should the analyst do?
* Generally accept the predicted intercept anyway — this is common and expected
- Reject the whole model because the intercept isn't significant
- Force the intercept to zero
> An insignificant intercept with a significant driver is normal; rejecting the model applies when a driver (not the intercept) is insignificant.
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
      id: 'examples', title: 'Worked Examples: Site Activation and Multivariate CER', summary: 'CEBoK\'s own two examples, step-by-step',
      body: String.raw`### Example 1: Site Activation (Simple Linear CER)

**Hypothesis**: Site activation cost can be calculated as a function of the number of workstations per site — the bigger an installation, the more workstations, so the greater the site activation cost.

**Scenario**: Cost includes both the site survey and site installation cost for an Automated Information System (AIS), across **11 historical installations**, with number of workstations as $X$ and normalized site activation cost as $Y$.

**Resulting CER** (from OLS regression):

$$\text{site activation} = \$82{,}756 + \$26{,}491 \times \text{number of workstations}$$

The equation is shown to the nearest dollar, but is only **accurate to the thousands** given the granularity of the underlying data.

**Fit quality**: $R^2 \approx 91\%$ — workstations explain almost all the variation in site activation cost, an excellent cost driver. The model as a whole is significant (Significance $F < \alpha = 0.05$), and the workstations coefficient (slope) is highly significant from its t-statistic. The **intercept is not statistically significant** — common, and analysts usually accept the predicted constant term anyway. (If, instead, one of the *variables* isn't significant, the model should be rejected.) Because this is a single-variable regression, the variable's t-statistic and the model's F-statistic are identical.

**Applying the CER** (base case, 10 workstations):
$$\hat{Y} = 82{,}756 + 26{,}491(10) = 347{,}666 \approx \$348\text{K}$$

**Update**: Four new sites were added (15 total). The workstations coefficient and $R^2$ **barely changed**, but the constant term (intercept) **changed quite a bit** — it still isn't statistically significant, though, so it has little effect on the final predicted cost. If the new data had differed a lot from the original, the analyst would investigate normalization, data source, technology change, or a simple mistake.

:::widget site-activation:::

:::challenge site-activation ws=20 addNew=0 lock=ws,addNew
Q: Using CEBoK's site activation CER (\$82,756 + \$26,491 per workstation), predict the cost of activating a 20-workstation site.
predict: pred ±3000
> $\$82{,}756 + \$26{,}491 \times 20 = \$612{,}576$ (accurate only to the thousands).
:::

+++

### Example 2: Multivariate CER (Purchased Services)

**Hypothesis**: Cold iron hours and ship's complement will predict purchased-services cost together better than either variable alone.

**Scenario**: Purchased services (\$K) — non-maintenance services like printing, ADP, laundry, boat rental, port services, rent, utilities, and communications — for the O&S estimate of a new Navy surface ship class, across **7 historical ship classes**. Cost drivers: **cold iron hours** (hours per year the ship isn't steaming) and **ship's complement** (crew size); utilities are assumed the biggest driver of purchased services.

**Single-variable fits**: cold iron hours alone explains $R^2 = 0.39$ (61% unexplained); complement alone explains $R^2 = 0.62$ (38% unexplained). Each is a poor explainer exactly where the other is a good one:

- **Frigate A** (purchased services $387.56K): cold iron hours is a poor explanatory variable (point well below that regression line), but complement is excellent (point almost on the line) — the frigate's **small complement** drives its lower cost, despite spending little time in port.
- **Destroyer C** (purchased services $582.75K): complement is a poor explanatory variable, but the ship's **higher cold iron hours** drives its higher cost.

**Combined (multivariate) regression**: $R^2 = 0.87$ — far better than either driver alone — with an excellent **CV of 9.1%**. Both independent variables are statistically significant; the intercept, again, is not. The two drivers show **low correlation with each other** when plotted against each other, confirming there's no meaningful **multicollinearity** (which would occur if two drivers were significantly correlated with each other, making it unlikely both stay good explanatory variables at once).

The intercept is **negative** — irrelevant here, since the CER only applies within a reasonable range of the drivers that keeps cost positive. **Never interpret a CER's intercept/constant term as a fixed cost at $x=0$.**

:::check
Q: Site activation CER: $\hat{Y} = 82{,}756 + 26{,}491X$ (X = workstations). Estimate cost, to the nearest \$K, for X = 15.
= 480 ±2
> $82{,}756 + 26{,}491(15) = 480{,}121 \approx \$480\text{K}$ (the CER is only accurate to the thousands anyway).
:::

:::check
Q: Using the same site activation CER, roughly what % change in cost results from moving from the 10-workstation base case (\$348K) to 15 workstations (\$480K)?
= 38 ±2
> $(480{,}121-347{,}666)/347{,}666 \approx 0.381$, about +38%.
:::

:::check
Q: In the site activation example, four new sites were added (15 total) and the CER was re-run. What changed the most?
* The constant term (intercept), though it remained statistically insignificant with little effect on predicted cost
- The workstations coefficient, which roughly doubled
- The R² value, which dropped sharply
> The slope and R² barely moved; the intercept shifted quite a bit but still wasn't significant.
:::

:::check
Q: In the multivariate purchased-services example, why is cold iron hours a poor explanatory variable for Frigate A even though the model overall fits well?
* Frigate A's low cost is really driven by its small complement, not by its (low) time in port
- Frigate A has unusually high cold iron hours
- The model has no explanatory power for any ship
> Each driver individually leaves a lot unexplained; which driver "explains" a given ship varies ship to ship.
:::

:::check
Q: The multivariate purchased-services CER has a negative y-intercept. What does this mean?
* The intercept is irrelevant outside the CER's valid range and must never be read as a fixed cost at x = 0
- The model predicts negative purchased-services cost for real ships
- The regression is invalid and should be discarded
> A negative or otherwise odd intercept is common and harmless as long as the CER is applied within its valid driver range.
:::

:::check
Q: Combining cold iron hours and complement raised R² from a maximum of 0.62 (either alone) to 0.87 together, with a CV of 9.1%. What does this indicate?
* An outstanding multivariate CER, since both variables together explain far more variation with a low error band
- The two drivers are redundant (multicollinear)
- The model is overfit and should be simplified to one variable
> Low individual R², high combined R², and low correlation between the drivers together indicate a strong multivariate CER without multicollinearity.
:::

:::widget multi-driver:::`
    },
    {
      id: 'sensitivity', title: 'Sensitivity Analysis, Cost Response Curves, and Risk vs. Uncertainty (Advanced, not testable)', summary: 'Advanced topics — not testable on PCEA: one-at-a-time sensitivity, Monte Carlo, CRCs, WER/SER, risk vs. uncertainty',
      body: String.raw`:::note Advanced: not testable on PCEA
CEBoK's Testable Topics table marks this module's "Advanced topics" (Cost Response Curves, Risk vs. Uncertainty, Sensitivity Analysis, and Parametric Analysis of Technical Parameters) as **Not Testable**. The content below is real CEBoK material, but PCEA questions won't draw from it.
:::

### Sensitivity Analysis

**Definition**: Vary a CER's input driver value **one at a time**, holding all other inputs at base-case values, and observe how output cost changes. This addresses uncertainty in overall cost-output variability by showing which input(s) the estimate is most sensitive to.

**Example** (site activation CER, base case 10 workstations $\approx$ \$348K): at 5 workstations, cost $\approx$ \$215K (about −38%); at 15 workstations, cost $\approx$ \$480K (about +38%).

+++

### Monte Carlo Simulation and Correlation

**Monte Carlo simulation** varies **two or more** inputs simultaneously, computing a **correlation coefficient** for each input against the cost output — a number from −1 (perfectly negative correlation) to +1 (perfectly positive), with 0 meaning no correlation. A chart is often used to visualize relative importance by means of **rank correlation**.

:::tip Beyond CEBoK
"Tornado chart" isn't this module's term — the source just describes a rank-correlation chart. In practice, many analysts do call a bar chart of each input's cost swing (sorted largest first) a tornado diagram/chart, and it's a natural way to present this kind of sensitivity ranking.
:::

+++

### Cost Response Curves (CRCs)

A **CRC** encapsulates an entire cost model in a single equation, relating total or phase cost to one performance or programmatic parameter. CRCs are portable and easy to use, reproducing the cost model's results within a small margin of error — but a CRC is **never more accurate than the underlying cost model**; its value is the fast response it gives decision-makers and designers who lack cost training or easy access to the model itself.

**Source example (Fig 3.14)**: an O&S-phase CRC is built by running the cost model at several values of a performance parameter — here, maximum ship speed, in 1-knot increments from **21 to 27 knots** — plotting the resulting output costs, and fitting a curve to the points. That fitted curve is the CRC.

:::tip Beyond CEBoK
A CRC "knee" (flat, then rising steeply past some threshold) and a probability-of-kill trade example are common illustrations of CRCs elsewhere, but this module's own example is the ship-speed O&S curve above.
:::

+++

### Parametric Analysis of Technical Parameters

Parametric methods can target **technical parameters**, not just cost — the steps are the same, only the dependent/independent variables change:

- **Weight Estimating Relationship (WER)**: estimates an item's weight from variables that drive it. Source example: a ship's crew size may drive the amount of outfitting and furnishings (beds, chairs, etc.) required, measured by weight — so weight (dependent) is estimated as a function of crew size (independent).
- **Schedule Estimating Relationship (SER)**: predicts how long a task will take (see Module 2 Costing Techniques for more).

+++

### Risk vs. Uncertainty

**Uncertainty** describes the variance a data point might show relative to the mean, median, or regression line. **Risk** measures the uncertainty of a *future event* against cost/schedule constraints — identifying the event, its likelihood, and its consequence, then addressing how to account for it.

**Source example (Fig 3.15)**: modal Source Lines of Code (SLOC) count grows over time. Software development cost is plotted as a function of SLOC, with the CARD's SLOC count as the "most likely" value; **uncertainty** is shown as distributions radiating outward from the regression line. Since SLOC is more likely to **grow** than shrink, the analyst should place a **right-skewed triangular distribution** on SLOC (shifting the mean upward) to properly account for the **risk** of software cost growth — updating the estimate's risk bounds rather than simply changing the input value.

:::check
Q: In a parametric estimate, the CER has a standard error of \$2M around a point estimate of \$50M. This \$2M represents…
* Uncertainty: the natural statistical scatter of data around the fitted CER
- Risk: an identifiable event that could change the cost
- Calibration error in the model
> Statistical scatter around the fit is uncertainty, not a discrete risk event.
:::

:::check
Q: Fig 3.14's cost response curve example is built by running the cost model at several values of which parameter, over what range?
* Maximum ship speed, from 21 to 27 knots
- Crew size, from 100 to 500 sailors
- Weight, from 10,000 to 50,000 lbs
> The source's CRC example steps maximum ship speed in 1-knot increments from 21 to 27 knots and fits a curve to the resulting O&S costs.
:::

:::check
Q: For SLOC that is more likely to grow than shrink (Fig 3.15), what should the analyst do to properly account for the risk?
* Place a right-skewed triangular distribution on SLOC, shifting the mean upward, rather than just updating the point input
- Reduce the SLOC estimate to be conservative
- Ignore SLOC growth since it's captured by uncertainty already
> Modeling the asymmetric growth risk (not just statistical scatter) requires a skewed distribution, updating the risk bounds.
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
10. **Force-fitting a calibration point** instead of a documented, careful calibration.

+++

### Sanity Checks on a Fitted CER

✓ Cost responds in a logically consistent direction to the driver (usually increases, but investigate if it doesn't match engineering judgment)
✓ Slope sign and magnitude make engineering sense
✓ t-statistics and p-values on coefficients show significance; the model's F-statistic is significant overall
✓ Residuals scatter randomly (no patterns)
✓ Range of applicability is clearly stated
✓ The intercept is never read as a fixed cost at driver = 0

+++

### Decision Tree: When to Use Parametric Estimating

**No data?** Use analogy or expert opinion instead; parametric needs a database of multiple points.

**Good data on many analogous systems, drivers known early?** Parametric is strong. Follow the 4 steps.

**Early design, limited detail?** Parametric shines here — use coarse drivers (weight, power) that are known early.

**Late design, detailed breakdown available?** Consider engineering build-up instead, or use parametric as a cross-check.

**One very similar system only?** Use **analogy** instead; parametric needs a database.

:::check
Q: Sensitivity analysis shows the estimate swings \$40M with weight, \$3M with labor rate, and \$2M with SEPM factor. Where should you focus?
* Refining the weight estimate and its uncertainty
- Refining the labor rate
- Refining the SEPM factor
> Sensitivity analysis points to the inputs that move the answer most.
:::

:::check
Q: You have CER coefficients that are statistically significant (p < 0.05) but the fitted relationship predicts that cost **decreases** as weight increases, which contradicts engineering judgment. What should you do?
* Reject or investigate this CER; statistical significance does not guarantee logical/causal validity
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
A: Estimating cost from technical/programmatic/cost characteristics using statistical relationships (CERs) derived from historical data (PEH definition).
R: yes
Q: Cost Estimating Relationship (CER) (definition)
A: A mathematical expression relating cost (Y) to one or more cost drivers (X₁, X₂, ...) — the output of parametric estimating.
R: yes
Q: General form of a CER
A: $\hat{Y} = f(X_1, X_2, ..., X_k)$ (point estimate of cost as a function of drivers)
R: yes
Q: The three primary cost estimating techniques
A: Analogy, Parametric Estimating, Engineering Build-Up (expert opinion is used alongside them but isn't one of the three).
Q: Which technique provides no objective test of validity?
A: Analogy — it's a comparative analysis against one similar system.
Q: Which technique is easily traceable but can be expensive, with a high risk of omitting costs if data is missing or incorrect?
A: Engineering Build-Up.
Q: The parametric approach's four advantages
A: Versatility; objective quantitative inputs; easily traceable equations linking input and output; easily adjustable input parameters.
Q: Four statistical measures derived from CER regression analysis
A: t-statistic and F-statistic (validity of coefficients/model), R² (explanatory power), Coefficient of Variation, CV (error bands for cost risk analysis).
Q: Where do government analysts get cost data as a program matures, versus manufacturers?
A: Government analysts use Contractor Cost Data Reporting (CCDR) data and LRIP/full-rate production actuals; manufacturers directly incorporate their own costs.
Q: Trade-off of a COTS parametric cost model vs. one built in-house
A: COTS models are quicker to build and execute, but give less visibility into their underlying methodology and encourage over-reliance on the model.
Q: Why must a CER be logically justified, not just statistically significant?
A: Correlation without causal logic is spurious and won't hold for new systems.

## CER Forms
Q: Linear CER functional form
A: $Y = a + bX$ (constant marginal cost per unit of driver)
R: yes
Q: Power CER functional form
A: $Y = aX^b$ (linearized: $\ln Y = \ln a + b\ln X$ for regression)
R: yes
Q: Power CER (linearized form for OLS)
A: $\ln Y = \ln a + b\ln X$ (log-log regression)
R: yes
Q: Exponential CER functional form
A: $Y = ae^{bX}$ (linearized: $\ln Y = \ln a + bX$ for regression)
R: yes
Q: Exponential CER (linearized form for OLS)
A: $\ln Y = \ln a + bX$ (semi-log regression)
R: yes
Q: Logarithmic CER functional form
A: $Y = a + b\ln X$ (diminishing returns, one-sided curvature)
R: yes
Q: Generalized polynomial CER functional form (less common)
A: $Y = a + b_1X_1 + b_2X_2 + ... + b_nX_n$ (already linear in each $X_i$; multiple additive drivers)
R: yes
Q: How do you linearize a power CER for regression?
A: Take natural log of both sides: $\ln Y = \ln a + b\ln X$. Then regress $\ln Y$ on $\ln X$ using OLS.
Q: How to choose which CER functional form to use
A: Plot data in unit space; straight line → linear; curve that straightens in log-log → power; curve that straightens in semi-log → exponential; always verify engineering logic.

## Cost Drivers
Q: Cost driver (definition)
A: An independent variable (e.g., weight, power, lines of code) that logically drives cost, used to predict cost in a CER.
R: yes
Q: Five criteria for a good cost driver
A: (Beyond CEBoK checklist) Logical/causal link to cost, measurable/quantifiable, available early, statistically significant, sensitive to design changes.
Q: Why must a cost driver be "available early"?
A: So the CER can support early estimates, budgeting, and trade studies before final design is known.
Q: Why check multicollinearity between drivers in a multivariate CER?
A: Highly correlated drivers inflate standard errors, making individual coefficients unreliable and hard to interpret.
Q: Common hardware cost drivers
A: (Beyond CEBoK examples) Weight, power output, thrust, volume, complexity/technology factors. CEBoK: weight, power and LOC are common drivers.
Q: Common software cost drivers
A: (Beyond CEBoK examples) Lines of code, function points, number of interfaces.
Q: CEBoK's examples of top-level cost drivers
A: Hardware or equipment; resource requirements; level of automation; technical requirements (speed, accuracy); life cycle support concerns (reliability, maintenance philosophy).

Q: Common facility/construction cost drivers
A: (Beyond CEBoK examples) Square footage, number of units/beds/positions.

## Cost Passengers
Q: Cost passenger (definition)
A: A major WBS/system component with one of the highest dollar values in the system, identified using Pareto charts.
R: yes
Q: Why don't cost passengers always represent the biggest cost-savings opportunity?
A: Passengers show where cost is concentrated, but cost drivers (the design decisions/requirements) are what actually control how that cost can be influenced.
Q: Pea-pod analogy for cost drivers vs. cost passengers
A: The pod (passenger) wraps and is shaped by the peas (driver) inside it — like a ship's hull or aircraft's airframe, a passenger shaped by the crew/mission equipment it carries (the driver).
R: yes

## Rates, Factors, and Ratios
Q: Rate (as used in CER-style estimating)
A: Cost per parameter, expressed in dollars (e.g., a labor rate in \$/hour, or cost per LOC/function point).
R: yes
Q: Factor (as used in CER-style estimating)
A: Cost-on-cost, unitless, usually a percentage; the cost of one element predicts another's (e.g., SE/PM as 20% of prime mission equipment).
R: yes
Q: Ratio (as used in CER-style estimating)
A: Parameter on parameter (e.g., an industry-average 1,200 LOC per integrated COTS package).
R: yes
Q: SE/PM (in factor estimating)
A: Systems Engineering / Program Management — a factor commonly estimated as a percentage (e.g., 20%) of prime mission equipment cost.
R: yes
Q: A COTS integration ratio was assumed at 1,200 LOC/package; actuals later show 1,500 LOC/package. What are the analyst's options?
A: Re-run the CER with the augmented data set, re-calibrate to pass through the new point, change methodology, or leave the model unchanged if 1,500 is within expected statistical variation.

## The 4-Step Process
Q: The four steps of the parametric process, in order
A: 1. Data Collection 2. Cost Driver Identification 3. CER Development 4. Parametric Model Development
Q: Step 1 of parametric process: Data Collection (key activities)
A: Gather data from cost reports, schedule, and requirements docs (e.g., the CARD); normalize (inflation, scope, units, NR vs. R); document pedigree; iterate as new sources appear.
Q: Step 2 of parametric process: Cost Driver Identification (key activities)
A: Hypothesize candidates, scatter plot, test correlation with cost, check multicollinearity; drivers must pass both statistical and logic tests.
Q: The five steps of CER Development, in order
A: 1. Select the Variables 2. Test Relationships 3. Perform Regression 4. Select CERs 5. Validate CERs
Q: In CER Development, what happens during "Test Relationships"?
A: Representative data is set aside for later validation, and the remaining working data set is scatter plotted to assess strength, form, and direction of each relationship.
Q: In CER Development, what methodology captures uncertainty when validating a CER, especially outside the fitted data's range?
A: The Prediction Interval (PI) methodology.
Q: Step 4 of parametric process: Parametric Model Development (key activities)
A: Combine CERs across the WBS, add other cost techniques as needed, account for correlation between elements, update/re-calibrate as new actuals arrive, document fully.
Q: What is calibration of a CER?
A: Resetting the y-intercept (constant term) so the CER passes through a desired point — used to correct an analogy, adjust to a specific data set, or support a CAIV/Target Costing trade. (Secondary sense: tuning a commercial model's inputs/parameters to match historical actuals.)
R: yes
Q: How far can a calibrated CER generally be applied from its calibration point?
A: Generally within about one standard deviation of x from the point of departure.
Q: What is validation of a parametric model?
A: Testing the model against data not used to build it (held out during CER development) to confirm predictive accuracy.
R: yes
Q: (Beyond CEBoK rule of thumb) Minimum and preferred number of data points for a CER
A: (Beyond CEBoK rule of thumb) Minimum 3; 8+ preferred for statistical confidence — not a number given in this module's source.

## CER Fitting & Evaluation
Q: When fitting a power-form CER, what transformation is applied before OLS regression?
A: Take natural log of both cost and driver: $\ln Y = \ln a + b\ln X$. Regress $\ln Y$ on $\ln X$.
Q: In a linear CER $Y = a + bX$, what does the intercept $a$ represent?
A: The y-intercept — often loosely called a "fixed/setup cost," but never interpret it as an actual cost at driver = 0; a negative or insignificant intercept can simply be outside the CER's meaningful range.
Q: In a linear CER $Y = a + bX$, what does $b$ represent?
A: The marginal cost per unit increase in the driver (the slope).
Q: Four items to check when evaluating a fitted CER
A: Statistical fit (R²), Coefficient of Variation, significance of each coefficient (t-stat/F-stat/p-value), and residuals (random scatter).
Q: What does it mean if the model's F-statistic is significant (Significance F < α = 0.05)?
A: The regression model as a whole is judged statistically valid.
Q: For a single-variable regression, how do the driver's t-statistic and the model's F-statistic relate?
A: They are always identical.
Q: If one variable in a CER is not statistically significant, what should the analyst do? What about an insignificant intercept?
A: Reject the model if a driver variable isn't significant; an insignificant intercept, by contrast, is common and analysts usually accept it anyway.
Q: (Beyond CEBoK rule of thumb) What R² threshold is typical for a defensible CER?
A: (Beyond CEBoK rule of thumb) 0.70 or higher is a common rule of thumb; this module's source doesn't set a fixed threshold.
Q: Range of applicability (definition)
A: The minimum and maximum driver values in the dataset used to fit the CER.
R: yes
Q: Using a CER inside its range of applicability is called ___; outside is called ___
A: Interpolation; extrapolation.
Q: Why is extrapolation risky, and why does it happen often in practice?
A: The relationship's validity outside the fitted range is unverified, adding risk — but analysts often extrapolate anyway since many programs target systems faster, bigger, or more capable than their predecessors.
Q: How do you transform back from a log-space regression to get $a$ in $Y = aX^b$?
A: If the regression gives intercept $\alpha$ and slope $\beta$ in log space, then $a = e^{\alpha}$ and $b = \beta$.

## Site Activation Example
Q: Site Activation example: what is the cost driver, and how many historical installations were used?
A: Number of workstations per site, X; 11 historical installations (later updated to 15).
Q: Site activation CER (from CEBoK): $\hat{Y} = \$82{,}756 + \$26{,}491 \times$ workstations. How accurate is this equation?
A: Only accurate to the thousands of dollars, given the granularity of the underlying data (though shown to the nearest dollar).
Q: Site activation CER: cost for 10 workstations?
A: $82{,}756 + 26{,}491(10) = 347{,}666 \approx \$348$K
Q: Site activation CER: what R² value was achieved, and what does it mean?
A: R² ≈ 91% — the number of workstations explains almost all the variation in site activation cost, an excellent cost driver.
Q: In the site activation example, was the intercept statistically significant? What about the slope?
A: The slope (workstations coefficient) was highly significant; the intercept was not — common, and analysts usually accept it anyway.
Q: When 4 new sites were added to the site activation data (15 total) and the CER re-run, what changed and what didn't?
A: The slope and R² barely changed; the constant term (intercept) changed quite a bit, but remained statistically insignificant with little effect on the predicted cost.

## Multivariate CER Example
Q: Multivariate example: what two cost drivers are hypothesized to predict purchased-services cost, and why?
A: Cold iron hours (time not steaming/in port) and ship's complement (crew size) — the assumption is more port time and more crew mean more purchased services (e.g., utilities).
Q: In the multivariate purchased-services example, what R² does each driver achieve alone, and combined?
A: Cold iron hours alone: R² = 0.39; complement alone: R² = 0.62; combined (multivariate): R² = 0.87.
Q: What CV did the combined multivariate purchased-services CER achieve?
A: 9.1% — an excellent (low) Coefficient of Variation.
Q: Frigate A has purchased services of \$387.56K. Which driver explains this, and why?
A: Complement (crew size) — the frigate's small complement drives its low cost, even though cold iron hours is a poor explanatory variable for this ship.
Q: Destroyer C has purchased services of \$582.75K. Which driver explains this, and why?
A: Cold iron hours — the destroyer's small complement is a poor explanatory variable, but its higher cold iron hours drives the higher cost.
Q: In the multivariate purchased-services example, how did the analysts check for multicollinearity?
A: They plotted the two cost drivers (cold iron hours and complement) against each other and confirmed low correlation between them.
Q: The multivariate purchased-services CER has a negative intercept. What is the correct interpretation?
A: The intercept is irrelevant outside the CER's valid range; it should never be interpreted as a fixed cost when x = 0.

## Sensitivity & Response (Advanced, not testable)
Q: Sensitivity analysis (definition)
A: (Advanced, not testable) Varying one CER input at a time, holding others at base case, to see how output cost changes; identifies which drivers matter most.
R: yes
Q: What does Monte Carlo simulation do differently from one-at-a-time sensitivity analysis?
A: (Advanced, not testable) It varies two or more inputs simultaneously and computes a correlation coefficient (-1 to +1) for each input against the cost output.
Q: "Tornado chart" — is this CEBoK's term?
A: (Advanced, not testable) Not exactly — the source describes a chart that visualizes relative importance via rank correlation; "tornado chart" is common industry usage for this kind of swing-ranked bar chart.
Q: Cost Response Curve (CRC) (definition)
A: (Advanced, not testable) A single equation encapsulating an entire cost model, relating total/phase cost to one parameter; portable and fast, but never more accurate than the underlying cost model.
R: yes
Q: CEBoK's own CRC example (Fig 3.14)
A: (Advanced, not testable) An O&S-phase CRC built by running the cost model at 1-knot increments of maximum ship speed from 21 to 27 knots and fitting a curve to the resulting costs.
Q: Weight Estimating Relationship (WER) (definition)
A: (Advanced, not testable) A parametric relationship estimating an item's weight from a driving variable — e.g., estimating outfitting/furnishings weight from a ship's crew size.
R: yes
Q: Schedule Estimating Relationship (SER) (definition)
A: (Advanced, not testable) A parametric relationship predicting how long a task will take.
R: yes

## Risk vs. Uncertainty (Advanced, not testable)
Q: Uncertainty (in parametric estimates)
A: (Advanced, not testable) The variance a data point might show relative to the mean, median, or regression line.
Q: Risk (in parametric estimates)
A: (Advanced, not testable) Measuring the uncertainty of a future event against cost/schedule constraints — its likelihood and consequence, and how to account for it.
Q: Fig 3.15's SLOC growth example: why put a right-skewed triangular distribution on SLOC?
A: (Advanced, not testable) SLOC is more likely to grow than shrink over time, so a right-skewed distribution shifts the mean upward, properly reflecting that risk in the estimate's bounds rather than just updating the input.
Q: How should an analyst account for the risk of SLOC/cost growth demonstrated by an upward-curving regression line?
A: (Advanced, not testable) Update the risk bounds of the estimate, rather than updating the point inputs.

## Pitfalls & Decision Tree
Q: Ten common CER mistakes (name any four)
A: Extrapolating without flagging risk; choosing form by R² alone; using un-normalized data; confusing correlation with causation; ignoring multicollinearity; omitting uncertainty range; mixing risk/uncertainty; dropping outliers without documentation; over-fitting; force-fitting a calibration point.
Q: When CER coefficients are statistically significant but engineering sense is violated, what should you do?
A: Reject or investigate the CER; statistical significance does not guarantee causal/logical validity.
Q: Sanity check: how should cost move as the driving quantity/parameter increases?
A: In a logically consistent direction with the driver — usually increase; if it instead decreases against engineering judgment (e.g., versus weight), investigate before trusting the CER.
Q: Use parametric estimating when…
A: You have historical data from analogous systems, design parameters are known/estimable early, and you want objective, repeatable estimates.
Q: Use analogy when…
A: You have only one very similar historical system and need an estimate; requires minimal data; provides no objective test of validity.
Q: Use engineering build-up when…
A: Detailed design is complete and all element costs can be estimated bottom-up; traceable but expensive, with risk of omitting costs from missing/incorrect data.
Q: In a multivariate CER with high R² but no significant individual coefficients and r=0.97 between drivers, the problem is…
A: Multicollinearity; the correlated drivers inflate standard errors, masking individual significance despite good overall fit.
Q: Point estimate vs. uncertainty range in a CER
A: Always report a CER as a point estimate **plus** an uncertainty range (SEE/prediction interval), never point estimate alone.
Q: (Beyond CEBoK rule of thumb) A high correlation between two drivers in a multivariate CER, such as r > 0.80, suggests…
A: (Beyond CEBoK rule of thumb) Multicollinearity — the drivers may be redundant, making coefficients unreliable; consider dropping one or combining them.
Q: A CER built from 100–500-unit data is applied to an 800-unit system. Name this practice and the risk.
A: Extrapolation; the relationship's validity outside the data range is unverified, adding risk/uncertainty.

## Key Formulas & Definitions
Q: OLS linear regression computational formulas
A: (Beyond CEBoK formula; see Module 8) $b = \frac{\sum(X_i-\bar{X})(Y_i-\bar{Y})}{\sum(X_i-\bar{X})^2}$ and $a = \bar{Y} - b\bar{X}$
R: yes
Q: Elasticity (in a power-form CER)
A: (Beyond CEBoK term) The exponent $b$ in $Y=aX^b$; represents percent change in cost per 1% change in the driver.
R: yes
`
});
