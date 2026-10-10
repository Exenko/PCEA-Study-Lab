PCEA.addModule({
  id: 'm06', num: 6, title: 'Basic Data Analysis', short: 'Data Analysis', source: 'guide',
  blurb: 'Mean, median, mode, spread, CV, skew, outliers, and the charts that reveal them.',
  intro: String.raw`Descriptive statistics summarize the data you already have so you can judge whether it is fit to estimate with. It is the base for regression (Module 8) and probability (Module 10).

**Framework:** data comes from the **past**, you describe it in the **present**, and you use it to estimate the **future**.`,
  sections: [
    {
      id: 'data-types', title: 'Types of data', summary: 'Univariate, bivariate, multivariate, time series',
      body: String.raw`Before calculating anything, ask: *how many variables am I looking at, and what role does each play?* The answer tells you which statistics and charts make sense.

| Type | What it is | Example | Typical chart |
|---|---|---|---|
| **Univariate** | One variable | Historical cost growth factors | Histogram, box plot |
| **Bivariate** | One X (driver), one Y (cost) | Software cost vs. lines of code | Scatter plot |
| **Multivariate** | Several X's, one Y | Ship supply cost vs. crew size **and** hours underway | 3-D plot / pairwise scatters |
| **Time series** | Bivariate with time as X | Monthly freight volume | Line / scatter over time |

:::note
True univariate data is **rare** in cost estimating. Usually there is a driver hiding somewhere.
:::

+++

### Time series has its own traps

Time series is bivariate data where X is time, but three patterns need extra care:

- **Paradigm shift**: the nature of the data changes sharply at some point (for example a new contract or new process).
- **Cycles**: repeating periodic trends (seasonal effects, maintenance schedules).
- **Autocorrelation**: the current value is correlated with values from earlier periods.

:::warn
Regression finds **smooth trends**. It will **not** detect paradigm shifts or cycles. Plot the data first. Moving averages help spot them; dividing the series into subgroups (e.g. 1980-85, 1985-90, ...) and running an **ANOVA** (Analysis of Variance — testing whether the variation between subgroups is statistically significant) can confirm a paradigm shift.
:::

:::check
Q: You model ship supply cost using **crew size** and **hours underway**. What type of data is this?
- Univariate
- Bivariate
* Multivariate
- Time series
> Two independent variables and one dependent variable make it **multivariate**.
:::

+++

### Data validation

Data validation means examining descriptive statistics, assessing potential outliers, and comparing results to historical data. Some important descriptive statistics to compute for every data group:

- **Sample size** — the number of data points selected for analysis.
- **Mean**
- **Standard deviation**
- **Coefficient of Variation (CV)**
- **Specialized averages** — weighted averages (for cost data representing different quantities) or moving averages (for time series). See Module 5 (Inflation) and Module 11 (Manufacturing Cost Estimating).

Statistical software can compute these automatically, but it is better to build the formulas yourself: a macro's output is a snapshot, while a live formula updates when the data changes. A representative sample size is needed before drawing confident, meaningful conclusions.

### Standard Factors

Compare results to historical data whenever possible. The **standard factors handbook** from the Naval Center for Cost Analysis (NCCA) is one source of historical factors available to U.S. Navy analysts; similar heuristics exist for other services, commodities, and organizations. When no heuristics or standard factors exist, a **Subject Matter Expert (SME) or stakeholder review** helps eliminate inappropriate methodologies or erroneous results.

:::check
Q: No standard factors handbook exists for your commodity. What should you do to validate your result?
* Get a SME or stakeholder review
- Assume the result is correct since no factors exist
- Use a different commodity's factors without adjustment
> Without published heuristics, expert or stakeholder review is the fallback validation step.
:::`
    },
    {
      id: 'central', title: 'Central tendency', summary: 'Mean, median, mode, and when to use each',
      body: String.raw`Three numbers compete to be "the typical value." Each answers a slightly different question.

### Mean: the balancing point

$$\bar{x} = \frac{\sum_{i=1}^{n} x_i}{n}$$

It uses every value, which makes it **sensitive to outliers**. Symbol: $\bar{x}$ (sample), $\mu$ (population).

:::key
The sum of deviations from the mean is always **zero**. That is why the mean is called the balancing point.
:::

:::example Freight volume (100k lbs)
229.70, 221.58, 244.94, 250.66 → $\bar{x} = 946.88 / 4 = 236.72$

(CEBoK's text prints 241.96, an arithmetic slip; the four values average 236.72.)
:::

+++

### Mental math trick

Pick any convenient number $c$ near the middle, then average the deviations:

$$\bar{x} = c + \frac{\sum (x_i - c)}{n}$$

:::check
Q: Use the trick with $c = 20$ to find the mean of {18, 23, 19, 24}.
= 21
> Deviations from 20: −2, +3, −1, +4 → sum = 4 → 4/4 = 1 → mean = 20 + 1 = **21**.
:::

:::example CEBoK's therms example
Monthly average therms used: {37, 26, 13, 3, 3, 3, 3, 3, 4, 7, 21, 40}. Pick $c = 10$: deviations are 27, 16, 3, −7, −7, −7, −7, −7, −6, −3, 11, 30, summing to 43. Mean $= 10 + 43/12 = 13.6$. Picking an arbitrary $c$ near the middle keeps the running total small — especially useful with unsorted data, where positive and negative deviations partly cancel as you go.
:::

+++

### Median: the middle

1. Sort the data.
2. Odd count: take the middle value. Even count: average the two middle values.

- {2, 5, 7, 9, 25} → median = **7**
- {3, 6, 8, 11, 13, 30} → median = (8 + 11)/2 = **9.5**

The median ignores how extreme the tails are, so it is **preferred when there are outliers** (family income is the classic example).

### Mode: the most frequent

Best for **categorical / qualitative** data (most common color) and for finding the peak of a distribution. Its weakness: if the most frequent value is still rare, it tells you little.

:::check
Q: Which measure would you report for a data set with one huge outlier?
- Mean
* Median
- Mode
> The median is resistant to outliers; the mean gets pulled toward them.
:::

+++

| Situation | Use |
|---|---|
| Symmetric data, no outliers | Mean |
| Skewed data or outliers | Median |
| Categorical / qualitative data | Mode |

Now try it. Load the **With outlier** preset and watch how far the mean moves compared to the median.

:::widget stats-lab:::

:::challenge stats-lab data=12,15,18,15,22,15,19
Q: Edit the data so the **mean rises above 20** while the **median stays at 15**. Change only one number.
goal: mean > 20
goal: median ~ 15 +- 0
show: data=12,15,18,15,22,15,48
> The median depends only on the middle value, so changing an extreme value leaves it alone. The mean uses every value, so one large number pulls it up. That's why the median is the more robust center for skewed cost data.
:::`
    },
    {
      id: 'dispersion', title: 'Dispersion and CV', summary: 'Variance, standard deviation, coefficient of variation',
      body: String.raw`Two data sets can have the same mean and look nothing alike. Dispersion measures how spread out the values are.

### Variance

$$s^2 = \frac{\sum_{i=1}^{n} (x_i - \bar{x})^2}{n-1} \qquad\text{or}\qquad s^2 = \frac{\sum x_i^2 - n\bar{x}^2}{n-1}$$

- Divide by $n-1$ (degrees of freedom): once you know $\bar{x}$ and $n-1$ of the values, the last value is fixed.
- Units are **squared**, so the number is hard to interpret directly.
- Symbol: $s^2$ (sample), $\sigma^2$ (population).

+++

### Standard deviation

$$s = \sqrt{s^2}$$

Same units as the data, so it is much easier to interpret.

### Coefficient of variation (CV)

$$CV = \frac{s}{\bar{x}} \times 100\%$$

The CV is **unitless**. It expresses spread as a percentage of the mean, so you can compare the dispersion of data sets measured in different units or at different scales.

:::key CV thresholds
- **CV < 15%**: desired for cost estimating (tight data)
- **CV ≈ 5%**: the mean alone is a useful description
- **CV > 15%**: something (a cost driver) is probably causing the variation. Consider developing a CER.
:::

:::example Fig 6.6: same mean, different CV
Two data sets can share the same mean but very different spreads. One set has CV ≈ 17% (tightly distributed around the mean); the other has CV ≈ 38% (much more dispersed) even though both have the same expected value. A much wider range of future values should be expected when predicting from the higher-CV set. If a CER doesn't meaningfully reduce a high CV, the cost driver may be misidentified — or the data may simply be inherently noisier.
:::

+++

:::check
Q: A data set has mean 100 and standard deviation 8. What is the CV, in percent?
= 8
> $CV = 8/100 = 8\%$, comfortably under the 15% threshold.
:::

:::check
Q: Your CV is 32%. What does that suggest?
- The mean is a great estimate on its own
* A cost driver may be causing the variation, so look for a CER
- You should delete the largest values
- Variance was computed with $n$ instead of $n-1$
> High CV signals that something systematic may explain the spread. Look for a driver before settling on an average.
:::

:::check
Q: For the practice data {12, 15, 18, 15, 22, 15, 19}, the mean is 16.57. What is the sample standard deviation? (Use the stats lab above or calculate by hand.)
= 3.31 ±0.02
> $\sum x_i^2 = 1988$ and $n\bar{x}^2 = 116^2/7 = 1922.29$, so the sum of squared deviations is 65.71. Divide by $n-1 = 6$ → $s^2 ≈ 10.95$ → $s ≈ 3.31$. CV ≈ 20.0%, which is above the 15% threshold.
:::

:::challenge stats-lab data=229.70,221.58,244.94,250.66
Q: For the four freight costs (229.70, 221.58, 244.94, 250.66), predict the coefficient of variation. Type it with a % sign, e.g. 7%.
predict: cv +- 5%
> $CV = s / \bar{x} \approx 13.42 / 236.72 \approx 5.67\%$. A CV this small means the spread is tight relative to the mean.
:::`
    },
    {
      id: 'shape', title: 'Skew and outliers', summary: 'Which way the tail points, kurtosis, and the 2σ / 3σ rules',
      body: String.raw`### Skewness

- **Symmetric** (e.g. normal): mean = median = mode
- **Right-skewed** (positive skew): mean > median, the tail extends right (the lognormal is the classic example)
- **Left-skewed** (negative skew): mean < median, the tail extends left (the beta distribution is a classic example)

:::key
The direction of skew follows the **tail**, not the hump.
:::

### Pearson's median skewness

A simple scalar measure of how many standard deviations separate the mean and median:

$$\text{Pearson's median skewness} = \frac{3(\text{Mean} - \text{Median})}{\text{Standard Deviation}}$$

The further from zero, the greater the left or right skew.

+++

### Kurtosis

Kurtosis describes the shape of a distribution's **tails** relative to the normal distribution — whether extreme values are more or less likely than normal. Statistical software usually reports **excess kurtosis** (raw kurtosis minus 3, so the normal distribution reads 0).

| Type | Excess kurtosis | Tails / peak | Example |
|---|---|---|---|
| **Mesokurtic** | 0 (baseline) | Normal tails, standard bell-curve peak | Normal distribution |
| **Leptokurtic** | > 0 | Fatter tails, sharper peak — more extreme values | Laplace distribution |
| **Platykurtic** | < 0 | Thinner tails, flatter peak — fewer extreme values | Uniform distribution |

$$K = \frac{n(n+1)}{(n-1)(n-2)(n-3)} \sum_{i=1}^{n}\left(\frac{x_i - \bar{x}}{s}\right)^4 - \frac{3(n-1)^2}{(n-2)(n-3)}$$

Understanding the likelihood of extreme outcomes helps with risk assessment, where outliers can have a significant impact on the analysis.

:::check
Q: A distribution has fatter tails and a sharper peak than normal, with excess kurtosis > 0. What is it called?
* Leptokurtic
- Mesokurtic
- Platykurtic
> Lepto- means "thin/sharp" — a sharp peak and fat tails, more likely extreme values.
:::

:::check
Q: What excess kurtosis value is the mesokurtic (normal) baseline?
= 0
> Excess kurtosis subtracts 3 from raw kurtosis so the normal distribution reads 0.
:::

+++

:::check
Q: Mean = 50 and median = 45. Which way is the distribution skewed?
* Right-skewed
- Left-skewed
- Symmetric
> The mean is pulled toward the long tail. Mean > median means the tail is on the right.
:::

+++

### Outliers and the normal distribution

| Range | Share of data inside | Share outside (expected) |
|---|---|---|
| $\pm 2\sigma$ | 95.4% | 4.6% |
| $\pm 3\sigma$ | 99.7% | 0.3% |

**Rules:**

- **Review** points more than 3 standard deviations from the mean.
- **Never** remove an outlier without a justification, and document it.
- Look for causes: data errors, program restructuring, or a characteristic mismatch (a helicopter in a missile data set).

Outliers can seriously **bias regression**, changing both the slope and $R^2$.

:::warn
The 2σ/3σ rules assume roughly normal data. With skewed data, check the distribution first. The median may be a better center.
:::

+++

:::check
Q: A data point sits 3.5 standard deviations from the mean. What should you do?
- Delete it; anything beyond 3σ is an error
* Investigate it, and remove it only with a documented reason
- Keep it and never question it
- Replace it with the mean
> It is a candidate for review, not automatic deletion. Investigate (data error? different configuration?), and if you remove it, document why.
:::

:::example Evaluating outliers (ship shakedown hours/ton)
An expert flagged DD 963 as an outlier (too low). Plotting all the data showed that **DD 980** was the real outlier. Looking at the data objectively prevented removing the wrong point.
:::

+++

### Fig 6.3: an outlier's effect on regression

A database point sits **4.24 standard deviations** from the mean — since a point beyond 3σ has only about a 0.3% chance, and beyond 4σ is rarer still, this is a strong outlier candidate.

| | Before removal | After removal |
|---|---|---|
| Regression line | $y = 1.351x + 81.839$ | $y = 1.793x + 19.323$ |
| $R^2$ | 0.1608 | 0.7256 |

Removing the outlier steepened the slope and raised $R^2$ substantially — but remember, outliers must **never** be removed without justification and documentation. In the extreme, iteratively removing the farthest point can leave a data set with no variation at all.

:::widget outlier-regression:::

:::check
Q: A point sits 4.24 SD from the mean; removing it moves $R^2$ from 0.1608 to 0.7256 and the slope from 1.351 to 1.793. What is the correct first step?
* Investigate and document why the point might not belong, before considering removal
- Remove it immediately since R2 improves
- Keep it forever since removing outliers is never allowed
- Average it with the next-closest point
> A large R2 improvement is not itself justification — outliers are removed only with a documented, defensible reason.
:::`
    },
    {
      id: 'visual', title: 'Visualization tools', summary: 'Scatter, histogram, bar, box plot',
      body: String.raw`What you can't see in a table often jumps out of a chart.

### Scatter plots (bivariate)
- **Y-axis**: dependent variable (usually cost). **X-axis**: independent variable (the cost driver).
- Axis types: **unit space** (ordinary), **log-log** (both axes log), **semi-log** (one axis log).
- Show $R^2$ and the regression equation on the chart.

:::example Fig 6.7: strong, weak, and no correlation
Three scatter plots of cost against three candidate drivers: **Variable 1** shows strong correlation (a candidate cost driver), **Variable 2** shows weak correlation, and **Variable 3** shows no correlation at all. Scatter plots are the first step in identifying relevant cost drivers.
:::

:::key There is no real threshold for R2
People often cite a minimum "acceptable" $R^2$, but if a regression is statistically significant, **any** $R^2$ is meaningful because it represents a reduction in the variability of the prediction. $t$- and $F$-statistics, not $R^2$ alone, establish significance. $R^2$ is domain-dependent: it tends to run high in the physical sciences (where measurement error is nearly the only source of variability) and lower in the behavioral/medical sciences (due to irreducible variability in organisms and behavior); cost estimating's $R^2$ values tend to fall somewhere between the two.
:::

### Histograms (univariate)
- X: bins (ranges); Y: frequency or relative frequency. They show an empirical PDF.
- **Bin choice changes the picture.** Too few bins hide the shape; too many create noise. Try several.

:::example Fig 6.11: condominium gas bills
The same univariate cost data (monthly natural gas bills, simple average \$34.19) looks very different depending on bin choice. Letting the software auto-pick bins crams almost everything into one bar and hides the distribution. Manually setting \$15 bins (labeled by their upper bound, e.g. "30" = \$15.00–\$29.99) reveals a skew-right shape with apparent outliers on the right — but the \$15 floor also hides that there is really only **one bill under \$11.15**, obscuring a void near zero that would argue against a true exponential shape. Always experiment with bin width before settling on a final display — it's a trade-off between texture (more bins) and smoothness (fewer bins).
:::

:::widget bin-explorer:::

:::tip Beyond CEBoK: bin width rules (testable, less emphasized)
Rules of thumb such as Sturges' or Scott's formula suggest a bin count/width from the sample size and spread, but CEBoK treats these as a starting point only — always experiment rather than trusting a single formula.
:::

+++

### Bar charts
Compare categories or statistics across groups (for example the means for several categories, with standard deviations). They usually communicate better than a table.

:::example Fig 6.12: Cost Growth Factor by company
A bar chart of mean CGF (dollar-weighted) for several companies' EMD-phase work, with each bar's standard deviation shown as a dashed whisker: Company 1 SD 2.07, Company 2 SD 1.88, Company 3 SD 1.53, Company 4 SD 1.52, Company 5 SD 1.45. Company 1 has the highest mean cost growth; Company 4 is marginally better than Company 3 (lower mean **and** less variation) — a comparison that is much easier to see in the chart than in a table. Note these whiskers are standard deviations, **not** confidence intervals for the mean — to get a CI for the mean, divide the SD by $\sqrt{n}$.
:::

:::check
Q: A bar chart shows each company's SD as a whisker. To turn that into a confidence interval for the mean, what should you do?
* Divide the standard deviation by $\sqrt{n}$
- Multiply the standard deviation by $n$
- Nothing; the SD whisker already is the CI
> The standard error of the mean is $s/\sqrt{n}$; the plotted SD alone describes spread of the data, not precision of the mean estimate.
:::

### Box plots: the five-number summary
1. Minimum
2. Q1 (25th percentile)
3. Median (Q2, 50th)
4. Q3 (75th percentile)
5. Maximum

The **box** holds the middle 50% of the data (Q1 to Q3). The line in the box is the **median**. **Whiskers** reach toward the min and max, and points plotted separately are potential outliers.

:::example Figs 6.13/6.14: the same gas-bill data as a box plot
Q1 ≈ \$11–12, median = \$16.50, Q3 = \$37.00. So 25% of bills fall in the \$11–12 range, the next 25% from Q1 to the \$16.50 median, the next 25% from the median to the \$37.00 Q3, and the top 25% (including potential outliers) above that. The far-right outliers turned out to be winter-month (Dec/Jan/Feb) bills — 4-5× the summer bills, plausibly explained by heating demand (or an occupant home more often). Understanding *why* a point looks like an outlier matters more than the flag itself.
:::

:::check
Q: Which chart best shows the shape of a single variable's distribution?
- Scatter plot
* Histogram
- Log-log plot
> A histogram is the standard tool for the distribution of univariate data.
:::

:::check
Q: The box in a box plot contains what share of the data?
= 50 ±0
> From Q1 (25th) to Q3 (75th) is the middle **50%**.
:::

+++

### Heat maps and correlograms

A heat map plots a main variable across two axis variables as a grid of colored squares — darker/more intense cells indicate higher values (e.g., Seattle's daily precipitation accumulation by month, 1998-2018, shows which accumulation ranges occur most often each month). When used to show **correlation** between numeric variables (both axes list the variables, cell = correlation strength), it's called a **correlogram** — e.g. the classic Iris data set, where petal width/sepal length and petal width/petal length show up as strongly correlated cells. Correlograms are useful in exploratory analysis, both to spot candidate cost drivers and to check for **multicollinearity** among candidate independent variables.

### Waterfall charts

A waterfall chart splits a stacked bar into pieces so each element's contribution to a change is visible individually — a starting point, a series of increases/decreases, and an ending point. Useful for highlighting the change between two estimates (e.g., a baseline vs. an update). Examples: an Estimate at Completion (EAC) walking from a September 2022 baseline through per-CLIN changes to an August 2024 value (supplementing earned value analysis), or a multi-year forecasted inventory-count change for spare parts (supporting a replacement-parts cost estimate).

:::check
Q: You want to show how a program's EAC changed from a September baseline to an updated estimate, broken out by the contribution of each CLIN. Which chart fits best?
* Waterfall chart
- Heat map
- Box plot
> A waterfall chart isolates the starting point, each incremental change, and the ending point.
:::`
    },
    {
      id: 'functions', title: 'Function types and transformations', summary: 'Linear, power, exponential, and making curves straight',
      body: String.raw`Regression works on straight lines. When the data curves, we **transform** it until it is straight, fit a line, then transform back.

| Function | Form | Linear form | Straight in |
|---|---|---|---|
| Linear | $y = \beta_0 + \beta_1 x$ | as is | unit space |
| Power | $y = ax^b$ | $\ln y = \ln a + b\ln x$ | **log-log** |
| Exponential | $y = ae^{bx}$ | $\ln y = \ln a + bx$ | **semi-log** |

- **Linear** is the most basic form and the best first assumption.
- **Power**: slope in log-log space equals the exponent $b$. Learning curves are power functions with negative $b$.
- **Exponential**: rapid growth or decay; less common in CERs.

+++

Try it: pick **Power**, then switch to **Exponential**. The raw data curves, but in the right transformed space it lines up almost perfectly.

:::widget transform:::

+++

### Log rules you'll need

$$\ln(e^x) = x \qquad e^{\ln x} = x \qquad \ln(xy) = \ln x + \ln y$$

### Generalized forms

Real data often has a non-zero constant: $y = ax^b + c$ or $y = ae^{bx} + c$. Theoretical models usually assume $c = 0$. Learning curves are the exception, where $c = 0$ is standard.

:::check
Q: Transform $y = 5x^{0.8}$ into a form suitable for linear regression.
- $y = \ln 5 + 0.8x$
* $\ln y = \ln 5 + 0.8 \ln x$
- $\ln y = 5 + 0.8 \ln x$
- $\ln y = \ln 5 + 0.8x$
> A power function becomes linear in log-log space: take the natural log of both sides.
:::

:::check
Q: Data curves in unit space but is a straight line when only Y is logged. Which function fits?
- Linear
- Power
* Exponential
> Semi-log (log Y only) straightens an exponential.
:::`
    },
    {
      id: 'ml', title: 'Machine learning', summary: 'Supervised classification/regression, unsupervised, reinforcement learning',
      body: String.raw`Machine Learning (ML) algorithms learn from data to make predictions or inform decisions, using statistical, mathematical, and numerical techniques. ML doesn't replace critical thought in cost estimating — it adds tools for specific use cases in the data analysis process.

There are three primary techniques: **supervised** (labeled data), **unsupervised** (unlabeled data, looking for similarity), and **reinforcement** (learning by interacting with an environment in real time). Supervised learning splits into **classification** (predicting a category) and **regression** (predicting a number).

+++

### Classification: five common algorithms

Given a spacecraft-payload data set (weight, power, payload class, cost), plotting weight vs. power shows Class A/B instruments as heavier/higher-power and Class C/D as lighter/lower-power. Five common classification algorithms:

1. Naive Bayes
2. Decision trees
3. Random forests
4. $k$-Nearest Neighbors (kNN)
5. Logistic regression

### Naive Bayes

Naive Bayes is a statistical model based on joint probability distributions, using Bayes' theorem to give a new prediction:

$$P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}$$

:::tip Beyond CEBoK: testable, less emphasized
Bayes' theorem itself is testable but less emphasized than the worked classification example below.
:::

:::example Worked example: classifying a new instrument
Class A/B: weight mean 1100 (SD 100), power mean 1600 (SD 100). Class C/D: weight mean 900 (SD 100), power mean 1400 (SD 100). A new point has weight 1050, power 1525.

- Weight: 1050 is **0.5 SD** from A/B's mean → 30.85% probability; **1.5 SD** from C/D's mean → 6.68% probability.
- Power: 1525 is **0.75 SD** from A/B's mean → 22.66% probability; **1.25 SD** from C/D's mean → 10.56% probability.
- Product: A/B = 0.3085 × 0.2266 = **6.99%**; C/D = 0.0668 × 0.1056 = **0.71%**.
- Normalize: A/B = 6.99/(6.99+0.71) = **90.83%**; C/D = 0.71/(6.99+0.71) = **9.17%**.

The new point is 90.83% likely Class A/B. Naive Bayes classifiers generally work better with normally distributed data, and extend to more than two variables.
:::

:::check
Q: A new point is 0.5 SD from Class A/B's weight mean (30.85% probability) and 0.75 SD from A/B's power mean (22.66%). What's the joint (unnormalized) probability product for A/B?
= 6.99 ±0.05
> 0.3085 × 0.2266 × 100 = 6.99%.
:::

+++

### Decision trees

Decision trees split data via yes/no questions, forming linear branches — good for grouped, nonlinear data. A depth-2 tree on the spacecraft data might read: "If power < 1046, then C/D; else if weight < 1482, then C/D; else A/B." **Depth** is a *tunable parameter*: shallow trees underfit, deep trees overfit. Unlike ordinary linear regression, ML models expose these tunable parameters directly, and analysts commonly loop through many depth values, tracking MSE, to pick the best.

### Random forests

Random forests are **ensemble models**: many decision trees, each trained on a random subset of data and features, with outputs combined for a more accurate, better-generalizing prediction (reducing the overfitting risk of one tree). For cost analysts, random forests can:

- predict future cost from historical data,
- assess risk via probability scores,
- rank variable importance (feature importance),
- detect anomalies, and
- support what-if analysis.

+++

### $k$-Nearest Neighbors (kNN)

kNN predicts a class by majority vote among the $k$ nearest points, using (typically) Euclidean distance:

$$d = \sqrt{(x_1-x_2)^2 + (y_1-y_2)^2}$$

:::example Distance calculation
New point (weight=1500, power=1000) to an existing point (weight=1200, power=900): $d = \sqrt{(1500-1200)^2 + (1000-900)^2} = \sqrt{300^2+100^2} = 316$.

(CEBoK's text prints "$(100-900)^2$" — a typo for $(1000-900)^2$; the 316 result already uses the correct 1000.)
:::

Normalize variables that are on very different scales before computing distance. Euclidean distance is the common choice; Manhattan distance is an alternative. **Small $k$** (e.g. 3) is sensitive to outliers and prone to overfitting; **large $k$** overgeneralizes and underfits. kNN can also be used as an objective method for **estimating by analogy**: a weighted average of the $k$ nearest neighbors on objective criteria (weight, power, other technical/programmatic characteristics).

:::widget ml-classifier:::

:::check
Q: With $k=3$, the model is very sensitive to a single unusual neighbor; with $k=25$, it barely reacts to local structure. What's happening as $k$ grows?
* The model underfits (over-generalizes); small k overfits and is outlier-sensitive
- The model always improves with larger k
- k has no effect on fit
> Small k → high variance/overfitting; large k → high bias/underfitting.
:::

### Logistic regression

Logistic regression solves **binary classification** by applying the logistic function to a linear combination of features, mapping predictions to a probability between 0 and 1:

$$P = \frac{1}{1 + e^{-(\beta_0 + \beta_1 X_1 + \beta_2 X_2 + \dots + \beta_n X_n)}}$$

$\beta_0$ is the intercept, $\beta_i$ are coefficients, $X_i$ are feature values. The coefficients' sign and magnitude indicate each feature's direction and strength of influence. (Worked example in this module's Examples section.)

+++

### ML regression algorithms

Regression predicts a **numerical** outcome. Besides ordinary linear/multivariate regression (Module 8), the same tree-based and neighbor-based ideas from classification adapt to regression:

- **Linear regression**: can even support classification, by mapping a continuous prediction to class labels via thresholds (logistic regression is the binary-probability special case).
- **Decision tree regression**: splits on yes/no questions but predicts a number at each leaf — e.g. spacecraft cost predicted from weight and design life (duration in years).
- **Random forest regression**: averages the predictions of many trees (commonly 100+), each on a random variable subset; more accurate than a single tree but more computationally expensive.
- **kNN regression**: predicts a continuous value as the (weighted) average of the $k$ nearest neighbors' outputs, or estimates probability of an outcome from neighbors' outputs (useful for binary classification too).

:::check
Q: You want to predict spacecraft cost as a number, not a class, using weight and design life, with yes/no splits. Which technique fits?
* Decision tree regression
- Naive Bayes
- k-Means clustering
> Decision trees adapt to regression by predicting a numeric value at each leaf instead of a category.
:::

+++

### Unsupervised learning: $k$-means clustering

Unsupervised learning finds similarity in **unlabeled** data rather than predicting a known category (e.g., Netflix/Amazon/Spotify recommendations — there's no "correct" next item, just similar ones). $k$-means clustering steps:

1. Start with the raw data set.
2. Randomly place $k$ cluster centroids.
3. Assign each point to its nearest centroid.
4. Recalculate each centroid's location.
5. Repeat until stable (centroid-to-point distances stop shrinking).

An analyst could use $k$-means to cross-check an estimate: find the most similar historical projects by feature and compare their costs to the project in question.

### Neural networks

Neural networks are inspired by the brain: an **input layer**, one or more **hidden layers** (where computation happens), and an **output layer** (the result), connected by interconnected nodes ("neurons"). They use forward propagation to compute and backward propagation to learn. Example: training on project duration, size, material/labor cost, and region, labeled "within budget" / "over budget" / "significantly over budget," to output a probability for each budget class on a new project — the model picks the highest-probability class.

### Reinforcement learning

Reinforcement learning has no labeled training set and no supervisor; instead, an agent interacts with a real-world (or simulated) environment in real time, making iterative decisions over a sequence of time-steps and receiving rewards or penalties. Examples: an autonomous vehicle, or a chess-playing agent. For cost estimating, this is an advanced technique that can help optimize resource allocation across projects or dynamically adjust estimates as conditions change; implementation details are beyond this module's scope.

:::check
Q: Which ML category best matches "no labeled training set, agent learns by interacting with the environment and receiving rewards/penalties over time"?
- Supervised learning
- Unsupervised learning
* Reinforcement learning
> Reinforcement learning learns from environment feedback (rewards/penalties), not from a pre-labeled data set.
:::

:::check
Q: A cost analyst wants to group historical projects into similar clusters, with no predefined categories, to cross-check a new estimate. Which technique?
- Logistic regression
* k-Means clustering (unsupervised)
- Decision tree regression
> No labels exist to predict, so this is unsupervised — k-means groups by similarity.
:::

:::check
Q: Which supervised classification algorithm is specifically built for binary (yes/no) outcomes and outputs a probability via the logistic function?
- Random forest
* Logistic regression
- k-Means clustering
> Logistic regression is the standard tool for binary classification with probability outputs.
:::`
    },
    {
      id: 'pitfalls', title: 'Pitfalls, biases and examples', summary: 'Common mistakes and expert-opinion biases',
      body: String.raw`### Data analysis pitfalls

1. **Removing outliers without justification.** Investigate first and document any removal.
2. **Poor histogram binning.** Don't accept the software default; experiment.
3. **Ignoring skewness.** Check the distribution before applying normal-based outlier rules; use the median if the data is heavily skewed.
4. **Relying too much on $R^2$.** Also check t- and F-statistics and whether the result makes operational sense.
5. **Mixing data types.** Keep the data set homogeneous and document your selection criteria.

+++

### Expert opinion biases

| Bias | What it looks like |
|---|---|
| **Availability heuristic** | Overweighting memorable events |
| **Conservatism** | Under-revising beliefs when new data arrives |
| **Dunning-Kruger** | Overestimating one's own expertise |
| **Optimism bias** | Underestimating risk and cost |
| **Planning fallacy** | Underestimating task duration |

The fix: **validate with data analysis, cross-checks and documentation.**

:::example Validating engineering judgment
An expert estimated follow-on ship support at 4% of the lead ship. Plotting historical data for ships 2, 3 and 4 showed a trend pointing to about **6%**. The graph corrected the judgment.
:::

:::check
Q: An estimator insists a task will take 3 months "because it always goes smoothly," even though history shows 5. Which bias is this?
- Conservatism
- Availability heuristic
* Planning fallacy
- Dunning-Kruger effect
> Underestimating how long a task will take is the planning fallacy (closely related to optimism bias).
:::

+++

### Example: classifying risk with logistic regression

Table 6.3 — five historical projects (Size \$M, Duration mo, Team Experience yrs, Team Members, Complexity, Market Volatility Index, Cost Risk High=1):

| Size | Duration | Team Exp | Members | Complexity | Volatility | Risk |
|---|---|---|---|---|---|---|
| 5 | 12 | 5 | 10 | 7 | 60 | 1 |
| 2 | 6 | 8 | 5 | 3 | 30 | 0 |
| 8 | 18 | 4 | 15 | 9 | 80 | 1 |
| 3 | 9 | 6 | 8 | 5 | 50 | 0 |
| 6 | 14 | 7 | 12 | 6 | 70 | 1 |

A fitted logistic regression model gives these coefficients (Table 6.4):

| Feature | Coefficient ($\beta$) |
|---|---|
| Intercept | −8.0 |
| Size | 0.9 |
| Duration | 0.5 |
| Team Experience | −0.8 |
| Team Members | 0.2 |
| Complexity | 1.5 |
| Market Volatility | 0.05 |

Complexity has the largest **positive** influence on risk; Team Experience has the largest **negative** influence (more experienced teams reduce risk).

:::example New project: size \$4M, duration 10 mo, experience 6 yrs, complexity 6, volatility 65
CEBoK's worked calculation also uses **team members = 9**, though its narrative text never states that value for the new project — noted here as a gap in the source.

Log-odds $= -8.0 + (0.9)(4) + (0.5)(10) + (-0.8)(6) + (0.2)(9) + (1.5)(6) + (0.05)(65)$
$= -8.0 + 3.6 + 5.0 - 4.8 + 1.8 + 9.0 + 3.25 = 9.85$

(CEBoK's text prints "= 0.85" — a typo; its own probability calculation correctly uses 9.85.)

$$P = \frac{1}{1+e^{-9.85}} = 0.99995$$

A 99.995% probability the project is high risk — action should be taken to mitigate the drivers, especially complexity.
:::

:::widget logistic-risk:::

:::check
Q: In the logistic risk model, which coefficient has the largest positive influence on predicted cost risk, and which has the largest negative influence?
* Complexity (+1.5) is most positive; Team Experience (−0.8) is most negative
- Market Volatility is most positive; Duration is most negative
- Size is most positive; Team Members is most negative
> Reading Table 6.4: Complexity's coefficient (1.5) is the largest positive magnitude, Team Experience's (−0.8) the largest negative.
:::`
    },
    {
      id: 'advanced', title: 'Related and advanced topics', summary: 'Sample size (advanced) and outlier identification rules (testable, less emphasized)',
      body: String.raw`### Sufficient sample size

Rearranging the confidence-interval formula for the mean into percentage terms gives $1 \pm t_{\alpha/2,n-1}\, CV/\sqrt{n}$ — the estimated mean, plus or minus a range set by the CV and the sample size $n$.

A quick rule of thumb rounds $t \approx 1$:

- **68.3% CI** (±1 SD): range ≈ $CV/\sqrt{n}$
- **95% CI** (≈±2 SD): range ≈ $2\,CV/\sqrt{n}$

:::example Worked example, CV = 30%
At $n = 4$, the 68.3% CI is the estimated mean ±17% — a 68.3% chance the true mean is within 17%. The source's goal is judgments within 5%; for a 95% CI, its Fig 6.45 table gives a sufficient sample of $n = 36$. The rule-of-thumb ($t\approx1$) results track the exact ($t$-distribution) results closely — well worth the simplicity.
:::

:::check
Q: Using the 95% CI rule of thumb $2\,CV/\sqrt{n}$ with CV = 30%, what sample size makes the range ±10% (i.e., $2(0.30)/\sqrt{n} = 0.10$)?
= 36 ±2
> $2(0.30)/\sqrt{36} = 0.60/6 = 0.10$, so ±10% at n = 36.
:::

+++

### Outlier identification rules (testable, less emphasized)

Beyond the simple 2σ/3σ heuristic, several formal tests exist:

- **Chauvenet's Criterion**: assumes normality; multiplies the tail probability by $n$ to get the expected count of such extreme points. If fewer than half a point is expected (tail probability < $1/(2n)$), the value may be an outlier.
- **Grubbs' Test**: assumes normality; a test statistic $G$ (max absolute deviation from the mean, divided by the sample SD, adjusted by a critical value) that, if exceeded, rejects the null hypothesis of "no outliers."
- **Dixon's Q Test**: the gap between the suspected outlier and its nearest neighbor, divided by the data's range, compared against a table of critical values.
- **IQR-based rule**: the same logic as a box plot — flag points more than a set multiple of the IQR beyond Q1 or Q3.

:::check
Q: Which outlier test divides the gap between a suspect point and its nearest neighbor by the overall data range?
- Chauvenet's Criterion
- Grubbs' Test
* Dixon's Q Test
> Dixon's Q statistic is exactly that ratio, compared to a critical-value table.
:::`
    }
  ],
  cards: String.raw`
## Data types
Q: Univariate data
A: A single variable (e.g., historical cost growth factors). Analyzed with descriptive stats; shown with histograms, bar charts, box plots. Rare in cost estimating.
R: yes
Q: Bivariate data
A: One independent variable (X) and one dependent variable (Y), e.g., software cost vs. lines of code. Shown with scatter plots.
R: yes
Q: Multivariate data
A: Several independent variables and one dependent variable, e.g., ship supply cost vs. crew size AND hours underway.
R: yes
Q: Time series data
A: Bivariate data with **time** as the independent variable.
R: yes
Q: Three special considerations for time series data
A: **Paradigm shifts** (sudden change), **cycles** (repeating periodic trends), **autocorrelation** (value correlated with prior periods).
Q: What will regression NOT detect in time series data?
A: Paradigm shifts and cycles. It only finds smooth trends.
Q: Key framework of descriptive statistics (past / present / future)
A: Data originates in the PAST, is described in the PRESENT, and is used to estimate the FUTURE.

## Central tendency
Q: Formula for the sample mean
A: $\bar{x} = \dfrac{\sum x_i}{n}$
R: yes
Q: Mean mental math trick
A: $\bar{x} = c + \dfrac{\sum(x_i - c)}{n}$. Pick a convenient $c$ near the middle, average the deviations, add back.
R: yes
Q: Why is the mean called the "balancing point"?
A: The sum of deviations from the mean always equals zero.
Q: How do you find the median of an even-sized data set?
A: Sort it, then average the two middle values. E.g., {3, 6, 8, 11, 13, 30} → (8+11)/2 = 9.5
Q: When is the median preferred over the mean?
A: When the data is skewed or has outliers (e.g., family income).
Q: When is the mode most useful?
A: Discrete/categorical or qualitative data (most common color) and finding a distribution's peak.
Q: Main limitation of the mode
A: Low predictive value if the most frequent value is still infrequent.
Q: Symbols for sample vs. population mean
A: $\bar{x}$ (sample), $\mu$ (population)

## Dispersion
Q: Sample variance formula (definitional)
A: $s^2 = \dfrac{\sum (x_i - \bar{x})^2}{n-1}$
R: yes
Q: Sample variance, computational form
A: $s^2 = \dfrac{\sum x_i^2 - n\bar{x}^2}{n-1}$
R: yes
Q: Why divide by $n-1$ in the sample variance?
A: Degrees of freedom: once the mean is known, the last data point is determined by the others.
Q: Why is standard deviation easier to interpret than variance?
A: It is in the same units as the data (variance is in squared units).
Q: Coefficient of Variation formula
A: $CV = \dfrac{s}{\bar{x}} \times 100\%$
R: yes
Q: CV threshold desired for cost estimating
A: CV < 15%. Around 5% means the mean alone describes the data well.
Q: What does CV > 15% suggest?
A: A cost driver may be causing the variation, so consider developing a CER.
Q: Key advantage of CV
A: It is unitless, so you can compare dispersion across data sets with different units or scales.

## Shape and outliers
Q: Right-skewed distribution: relationship of mean and median
A: Mean > median; the tail extends to the right (e.g., lognormal).
Q: Left-skewed distribution: relationship of mean and median
A: Mean < median; the tail extends to the left.
Q: Symmetric distribution: mean, median, mode?
A: All equal.
Q: The direction of skew follows the ___
A: Tail (not the hump).
Q: % of normal data within ±2σ and ±3σ
A: ±2σ: 95.4% (4.6% outside). ±3σ: 99.7% (0.3% outside).
Q: Outlier rule of thumb for review
A: Review points more than 3 standard deviations from the mean. Never remove without justification and documentation.
Q: Possible causes to investigate for an outlier
A: Data errors, program restructuring, characteristic mismatch (e.g., helicopter in a missile data set).
Q: How can outliers affect regression?
A: They can bias results, changing the slope and $R^2$. Document any removal.

## Visualization
Q: Scatter plot axis convention
A: Y (vertical) = dependent variable (cost); X (horizontal) = independent variable (cost driver).
Q: Three types of scatter plot axes
A: Unit space (Cartesian), log-log (both axes log), semi-log (one axis log).
Q: Main pitfall when making histograms
A: Bin selection. Too few bins hide detail; too many create noise. Experiment with bin sizes.
Q: Box plot five-number summary
A: Minimum, Q1 (25th), median (50th), Q3 (75th), maximum.
R: yes
Q: What does the box in a box plot contain?
A: The middle 50% of the data (Q1 to Q3); the line inside is the median.
Q: Best use of a bar chart
A: Comparing categorical data or statistics (e.g., means ± std dev) across groups.

## Functions
Q: Power function and its linear form
A: $y = ax^b$ → $\ln y = \ln a + b \ln x$ (linear in log-log space)
R: yes
Q: Exponential function and its linear form
A: $y = ae^{bx}$ → $\ln y = \ln a + bx$ (linear in semi-log space)
R: yes
Q: In log-log space, the slope of a power function equals…
A: The exponent $b$.
Q: Which space straightens each function? Linear / power / exponential
A: Linear → unit space. Power → log-log. Exponential → semi-log.
Q: Generalized (real-data) forms of power and exponential functions
A: $y = ax^b + c$ and $y = ae^{bx} + c$. Real data usually needs a non-zero $c$; learning curves use $c = 0$.

## Pitfalls and biases
Q: Availability heuristic
A: Overweighting memorable events.
R: yes
Q: Conservatism bias
A: Under-revising beliefs when new data arrives.
R: yes
Q: Planning fallacy
A: Underestimating how long a task will take.
R: yes
Q: Optimism bias
A: Underestimating risk and cost.
R: yes
Q: Dunning-Kruger effect
A: Overestimating one's own expertise.
R: yes
Q: Remedy for expert opinion biases
A: Validate with data analysis, cross-checks, and documentation.
Q: Ship support example: what did graphing reveal?
A: 6% of lead ship was more appropriate than the expert's 4% estimate.

## Skew, kurtosis, and outlier examples
Q: Pearson's median skewness formula
A: $3(\text{Mean} - \text{Median}) / \text{Standard Deviation}$
R: yes
Q: Excess kurtosis: mesokurtic / leptokurtic / platykurtic
A: Mesokurtic = 0 (normal baseline). Leptokurtic > 0 (fatter tails, sharper peak, e.g. Laplace). Platykurtic < 0 (thinner tails, flatter peak, e.g. uniform).
Q: Why report "excess" kurtosis rather than raw kurtosis?
A: Raw kurtosis of a normal distribution is 3; subtracting 3 makes the normal baseline read 0.
Q: Fig 6.3 outlier regression example: R2 and slope before/after removing a 4.24 SD outlier
A: Before: y=1.351x+81.839, R2=0.1608. After: y=1.793x+19.323, R2=0.7256. Removing outliers must still be justified and documented.
Q: Fig 6.6 CV example
A: Two data sets with the same mean can have CV ≈17% (tight) vs. CV ≈38% (dispersed) — same expected value, very different prediction ranges.

## Histograms, bar charts, box plots, heat maps
Q: Gas bill histogram example (Fig 6.11)
A: Simple average \$34.19; \$15-wide bins hide that only one bill is under \$11.15, obscuring a near-zero void that argues against a true exponential shape.
Q: Bar chart CGF-by-company example (Fig 6.12): SD values
A: Company 1: 2.07, Company 2: 1.88, Company 3: 1.53, Company 4: 1.52, Company 5: 1.45 — whiskers are SDs, not CIs; divide by sqrt(n) for a CI on the mean.
Q: Box plot gas-bill example (Figs 6.13/6.14) quartiles
A: Q1 ≈ \$11-12, median = \$16.50, Q3 = \$37.00; winter-month bills explain the right-tail outliers.
Q: Heat map vs. correlogram
A: Heat map: grid of colored cells across two axis variables, color = a third variable's value (e.g. Seattle precipitation by month/accumulation). Correlogram: both axes are numeric variables, cell = correlation between them (e.g. Iris petal/sepal measurements).
Q: Waterfall chart use case
A: Isolate a starting value, a series of increases/decreases, and an ending value — e.g. an EAC's change by CLIN, or a multi-year inventory forecast.
Q: Is there a real threshold for a "good" R2 in cost estimating?
A: No — if a regression is statistically significant (check t/F stats), any R2 is meaningful. R2 tends to be high in physical sciences, lower in behavioral/medical sciences; cost estimating falls in between.

## Machine learning: supervised, unsupervised, reinforcement
Q: Three primary ML technique categories
A: Supervised (labeled data), unsupervised (unlabeled data, finds similarity), reinforcement (learns via environment interaction/rewards).
Q: Two categories of supervised learning
A: Classification (predict a category) and regression (predict a number).
Q: Five common classification algorithms (CEBoK)
A: Naive Bayes, decision trees, random forests, k-Nearest Neighbors, logistic regression.
Q: Bayes' theorem
A: $P(A|B) = P(B|A) \cdot P(A) / P(B)$ — testable but less emphasized.
R: yes
Q: Naive Bayes worked example: new point weight 1050 (0.5 SD from A/B, 1.5 SD from C/D), power 1525 (0.75 SD from A/B, 1.25 SD from C/D)
A: Weight probabilities 30.85% (A/B) / 6.68% (C/D); power probabilities 22.66% (A/B) / 10.56% (C/D); products 6.99% / 0.71%; normalized 90.83% A/B / 9.17% C/D.
Q: Decision tree "depth" parameter
A: Maximum number of branch layers; a tunable parameter — shallow trees underfit, deep trees overfit. Analysts often loop over depth values and pick the lowest-MSE tree.
R: yes
Q: Random forest definition
A: An ensemble of many decision trees, each trained on a random subset of data/features, with results combined — reduces single-tree overfitting.
R: yes
Q: Random forest uses for cost analysts
A: Predict future cost, assess risk via probability scores, rank feature importance, detect anomalies, support what-if analysis.
Q: kNN classification rule
A: Majority vote among the k nearest neighbors (by Euclidean or Manhattan distance).
R: yes
Q: kNN distance worked example (with source typo noted)
A: New point (1500,1000) to (1200,900): sqrt((1500-1200)^2+(1000-900)^2) = 316. CEBoK's text prints "(100-900)", a typo for (1000-900).
Q: Effect of small vs. large k in kNN
A: Small k (e.g. 3): sensitive to outliers, prone to overfitting. Large k: over-generalizes, underfits.
Q: kNN as "estimating by analogy"
A: A weighted average of the k nearest neighbors' objective criteria (weight, power, technical/programmatic characteristics) used to estimate a new point.
Q: Logistic regression equation
A: $P = 1/(1+e^{-(\beta_0+\beta_1X_1+\dots+\beta_nX_n)})$; coefficients indicate direction/strength of each feature's influence.
R: yes
Q: ML regression techniques (besides ordinary linear regression)
A: Decision tree regression (numeric leaf values, e.g. spacecraft cost from weight+design life), random forest regression (averages many trees), kNN regression (average of k nearest neighbors' outputs).
Q: k-means clustering steps
A: (1) start with data, (2) randomly place k centroids, (3) assign points to nearest centroid, (4) recompute centroids, (5) repeat until stable.
R: yes
Q: k-means use for cost analysts
A: Cross-check an estimate by finding the most similar historical projects (by feature) and comparing their costs.
Q: Neural network layers
A: Input layer (receives data), hidden layer(s) (computation), output layer (result); trained via forward and backward propagation.
R: yes
Q: Reinforcement learning — key differences from supervised/unsupervised
A: No supervisor, no large pre-collected labeled data set; the agent learns iteratively from real-world (or simulated) feedback (rewards/penalties) over time-steps.
R: yes

## Logistic regression risk example (Table 6.3/6.4)
Q: Logistic risk model coefficients: which feature has the largest positive and largest negative influence?
A: Complexity Score (+1.5) is the largest positive influence; Team Experience (−0.8) is the largest negative influence.
Q: Logistic risk example: new project log-odds and probability
A: Log-odds = -8.0+(0.9)(4)+(0.5)(10)+(-0.8)(6)+(0.2)(9)+(1.5)(6)+(0.05)(65) = 9.85 (CEBoK's text misprints "0.85"); P = 1/(1+e^-9.85) = 0.99995 (99.995% high risk).
Q: Table 6.4 logistic coefficients: intercept and each feature
A: Intercept -8.0; Size 0.9; Duration 0.5; Team Experience -0.8; Team Members 0.2; Complexity 1.5; Market Volatility 0.05.

## Sample size (advanced) and outlier rules (testable, less emphasized)
Q: Rule-of-thumb CI width for the mean using CV
A: 68.3% CI ≈ mean ± CV/sqrt(n); 95% CI ≈ mean ± 2·CV/sqrt(n) (rounds t ≈ 1).
Q: Sample-size example: CV=30%, n=4, 68.3% CI width
A: About ±17% of the mean.
Q: Sample-size example: CV=30%, 95% CI — sufficient n per CEBoK
A: n = 36 (Fig 6.45); the 2·CV/sqrt(n) rule gives ±10% at n = 36.
Q: Chauvenet's Criterion (outlier rule)
A: Assumes normality; multiply tail probability by n. If fewer than 0.5 point is expected (tail probability < 1/(2n)), the point may be an outlier.
R: yes
Q: Grubbs' Test (outlier rule)
A: Assumes normality; test statistic G = max absolute deviation from the mean over the sample SD, compared to a critical value; if exceeded, rejects "no outliers."
R: yes
Q: Dixon's Q Test (outlier rule)
A: Gap between the suspected outlier and its nearest neighbor, divided by the data range; compared to a critical-value table.
R: yes
Q: IQR-based outlier rule
A: Same logic as a box plot: flag points beyond a set multiple of the IQR outside Q1 or Q3.
Q: Mean mental math trick, therms example (c=10)
A: Data {37,26,13,3,3,3,3,3,4,7,21,40}; deviations sum to 43; mean = 10 + 43/12 = 13.6.
`
});
