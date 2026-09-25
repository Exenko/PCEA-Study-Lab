PCEA.addModule({
  id: 'm06', num: 6, title: 'Descriptive Statistics', short: 'Descriptive Statistics', source: 'guide',
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
Regression finds **smooth trends**. It will **not** detect paradigm shifts or cycles. Plot the data first. Moving averages and ANOVA across subgroups help here.
:::

:::check
Q: You model ship supply cost using **crew size** and **hours underway**. What type of data is this?
- Univariate
- Bivariate
* Multivariate
- Time series
> Two independent variables and one dependent variable make it **multivariate**.
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
      id: 'shape', title: 'Skew and outliers', summary: 'Which way the tail points, and the 2σ / 3σ rules',
      body: String.raw`### Skewness

- **Symmetric** (e.g. normal): mean = median = mode
- **Right-skewed**: mean > median, the tail extends right (the lognormal is the classic example)
- **Left-skewed**: mean < median, the tail extends left

:::key
The direction of skew follows the **tail**, not the hump.
:::

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
:::`
    },
    {
      id: 'visual', title: 'Visualization tools', summary: 'Scatter, histogram, bar, box plot',
      body: String.raw`What you can't see in a table often jumps out of a chart.

### Scatter plots (bivariate)
- **Y-axis**: dependent variable (usually cost). **X-axis**: independent variable (the cost driver).
- Axis types: **unit space** (ordinary), **log-log** (both axes log), **semi-log** (one axis log).
- Show $R^2$ and the regression equation on the chart.

### Histograms (univariate)
- X: bins (ranges); Y: frequency or relative frequency. They show an empirical PDF.
- **Bin choice changes the picture.** Too few bins hide the shape; too many create noise. Try several.

+++

### Bar charts
Compare categories or statistics across groups (for example the means for several categories, with standard deviations). They usually communicate better than a table.

### Box plots: the five-number summary
1. Minimum
2. Q1 (25th percentile)
3. Median (Q2, 50th)
4. Q3 (75th percentile)
5. Maximum

The **box** holds the middle 50% of the data (Q1 to Q3). The line in the box is the **median**. **Whiskers** reach toward the min and max, and points plotted separately are potential outliers.

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
:::`
    }
  ],
  cards: String.raw`
## Data types
Q: Univariate data
A: A single variable (e.g., historical cost growth factors). Analyzed with descriptive stats; shown with histograms, bar charts, box plots. Rare in cost estimating.
Q: Bivariate data
A: One independent variable (X) and one dependent variable (Y), e.g., software cost vs. lines of code. Shown with scatter plots.
Q: Multivariate data
A: Several independent variables and one dependent variable, e.g., ship supply cost vs. crew size AND hours underway.
Q: Time series data
A: Bivariate data with **time** as the independent variable.
Q: Three special considerations for time series data
A: **Paradigm shifts** (sudden change), **cycles** (repeating periodic trends), **autocorrelation** (value correlated with prior periods).
Q: What will regression NOT detect in time series data?
A: Paradigm shifts and cycles. It only finds smooth trends.
Q: Key framework of descriptive statistics (past / present / future)
A: Data originates in the PAST, is described in the PRESENT, and is used to estimate the FUTURE.

## Central tendency
Q: Formula for the sample mean
A: $\bar{x} = \dfrac{\sum x_i}{n}$
Q: Mean mental math trick
A: $\bar{x} = c + \dfrac{\sum(x_i - c)}{n}$. Pick a convenient $c$ near the middle, average the deviations, add back.
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
Q: Sample variance, computational form
A: $s^2 = \dfrac{\sum x_i^2 - n\bar{x}^2}{n-1}$
Q: Why divide by $n-1$ in the sample variance?
A: Degrees of freedom: once the mean is known, the last data point is determined by the others.
Q: Why is standard deviation easier to interpret than variance?
A: It is in the same units as the data (variance is in squared units).
Q: Coefficient of Variation formula
A: $CV = \dfrac{s}{\bar{x}} \times 100\%$
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
Q: What does the box in a box plot contain?
A: The middle 50% of the data (Q1 to Q3); the line inside is the median.
Q: Best use of a bar chart
A: Comparing categorical data or statistics (e.g., means ± std dev) across groups.

## Functions
Q: Power function and its linear form
A: $y = ax^b$ → $\ln y = \ln a + b \ln x$ (linear in log-log space)
Q: Exponential function and its linear form
A: $y = ae^{bx}$ → $\ln y = \ln a + bx$ (linear in semi-log space)
Q: In log-log space, the slope of a power function equals…
A: The exponent $b$.
Q: Which space straightens each function? Linear / power / exponential
A: Linear → unit space. Power → log-log. Exponential → semi-log.
Q: Generalized (real-data) forms of power and exponential functions
A: $y = ax^b + c$ and $y = ae^{bx} + c$. Real data usually needs a non-zero $c$; learning curves use $c = 0$.

## Pitfalls and biases
Q: Availability heuristic
A: Overweighting memorable events.
Q: Conservatism bias
A: Under-revising beliefs when new data arrives.
Q: Planning fallacy
A: Underestimating how long a task will take.
Q: Optimism bias
A: Underestimating risk and cost.
Q: Dunning-Kruger effect
A: Overestimating one's own expertise.
Q: Remedy for expert opinion biases
A: Validate with data analysis, cross-checks, and documentation.
Q: Ship support example: what did graphing reveal?
A: 6% of lead ship was more appropriate than the expert's 4% estimate.
`
});
