PCEA.addModule({
  id: 'm08', num: 8, title: 'Regression Analysis', short: 'Regression', source: 'guide',
  blurb: 'Building CERs: least squares, ANOVA, R², SEE, t and F tests, residuals, transformations, and model selection.',
  intro: String.raw`Regression develops **cost estimating relationships (CERs)** that fit historical data best **and** tell you how much to trust them. It is the main tool for relating cost drivers to cost statistically.

Single-variable regression is **bivariate data analysis** (cost Y, one candidate driver X), and the same five basic questions from Module 6 apply here too:

1. **What does it look like?** Scatter and residual plots reveal patterns and validate the functional form.
2. **What is the best guess?** Plug X into the fitted equation.
3. **How much remains unexplained?** SEE and $R^2$.
4. **How precise is the estimate?** The confidence interval (CI) and prediction interval (PI).
5. **How can certainty be ensured?** The F-test (model as a whole) and t-test (each variable).`,
  sections: [
    {
      id: 'model', title: 'The regression model', summary: 'True vs. estimated coefficients, OLS assumptions',
      body: String.raw`The "true" population relationship:
$$Y = \beta_0 + \beta_1 X + \epsilon$$

What we estimate from data:
$$\hat{Y} = b_0 + b_1 X$$

- $\beta$'s are the unknown true values; $b$'s are estimates from the sample.
- $\epsilon$ is the error term, assumed normal with mean 0 and constant variance.
- $\hat{Y}$ is the predicted value.

+++

### OLS assumptions (verify them!)

1. **Linearity**: the relationship is linear (or has been transformed to be).
2. **Independence**: the errors are independent of X.
3. **Homoscedasticity**: the error variance is constant across X.
4. **Normality**: errors are normal with mean 0.
5. **No perfect multicollinearity** (multivariate only).

:::check
Q: Residuals fan out wider as X grows. Which assumption is violated?
- Linearity
- Normality
* Homoscedasticity
- Independence
> Non-constant variance is **heteroscedasticity**, a violation of the homoscedasticity assumption.
:::

:::check
Q: What distinguishes $b_1$ from $\beta_1$?
* $b_1$ is estimated from the sample; $\beta_1$ is the unknown true slope
- $b_1$ is in log space; $\beta_1$ is in unit space
- They are two names for the same number
> Greek letters are population parameters; Latin letters are sample estimates.
:::

+++

### Types of regression models

- **Factors** ($y = bx$): the intercept is assumed to be zero. They should generally be avoided and replaced with the linear regression methods in this module.
- **OLS linear regression** ($y = a + bx + \epsilon$): one dependent, one independent variable, minimizing SSE. Can also fit non-linear shapes (power, log, exponential) by transforming them into linear form first.
- **OLS multivariate linear regression** ($y = a + b_1x_1 + \dots + b_kx_k + \epsilon$): one dependent variable, multiple independent variables. Introduces the risk of multicollinearity.
- **Non-OLS models**: Weighted Least Squares (WLS), Mean Absolute Percentage Error (MAPE), Zero (Mean) Percentage Error (ZMPE). These minimize an error other than SSE and matter when OLS residuals aren't homoscedastic.

### Software and OLS

Always **plot the data and fit a trend line first** in software, before trusting the full regression output. A trend line helps spot outliers or points unduly influencing the fit, reveals curvature the regression might miss, and confirms constants were transformed correctly (they appear in natural form on a trend line). This is especially valuable for non-linear regressions, which are easy to get lost in.

:::tip Two ways to write "linear"
Module 6's algebra notation is $y = mx + b$ ($m$ = slope, $b$ = intercept). Regression notation flips the letters: $y = a + bx$ ($a$ = intercept, $b$ = slope). Same line, different letters — know which convention a problem is using.
:::

### Regression function shapes (Fig 8.7)

| Model | Equation | Shape notes |
|---|---|---|
| Linear | $y = a + bx$ | $b>0$ increasing, $b<0$ decreasing |
| Quadratic | $y = a + bx + cx^2$ | curvature sign follows $c$ |
| Logarithmic | $y = a + b\ln x$ | increases/decreases at a decreasing rate |
| Exponential | $y = ae^{bx}$ | $b>0$ grows, $b<0$ decays |
| Power | $y = ax^b$ | $b<0$ decreasing; $0<b<1$ increasing at a decreasing rate; $b>1$ increasing at an increasing rate |

$b = 0$ (or $c = 0$ in the quadratic) collapses any of these to a constant: average cost isn't related to X at all. Always start with a linear model — if it fits poorly, the residual and scatter plots point toward the right non-linear shape.

:::check
Q: A power model has $0 < b < 1$. How does $Y$ behave as $X$ grows?
* It increases at a decreasing rate
- It increases at an increasing rate
- It decreases
- It stays constant
> A fractional positive exponent gives diminishing returns; $b>1$ would increase at an increasing rate instead.
:::`
    },
    {
      id: 'fit', title: 'Finding the line', summary: 'Least squares slope and intercept, worked example',
      body: String.raw`**Least squares** picks the line that minimizes the sum of squared vertical distances (residuals) from the points to the line. We square them so positive and negative misses don't cancel.

Play with the points. Drag one far from the others and watch the slope, $R^2$ and residual plot react.

:::widget regression:::

:::challenge regression data=seeker mode=hand lock=mode
Q: Fit the Seeker data **by hand**. Drag the two round handles until your line's total squared error is within 5% of the best possible.
goal: ratio < 1.05
show: hand=ols
> The shaded squares are the squared residuals, and OLS picks the one line with the smallest total area. For these data that's $\hat{Y} = 2.50 + 0.585X$, with SSE about 18.17. Every other line leaves more area.
:::

+++

### Slope

$$b_1 = \frac{\sum (X_i - \bar X)(Y_i - \bar Y)}{\sum (X_i - \bar X)^2} = \frac{n\sum XY - \sum X \sum Y}{n\sum X^2 - (\sum X)^2} = r\,\frac{s_y}{s_x}$$

### Intercept

$$b_0 = \bar{Y} - b_1 \bar{X}$$

:::key
The fitted line **always passes through** $(\bar X, \bar Y)$. (The hollow orange circle in the playground.)
:::

:::tip Beyond CEBoK: the geometry behind the formulas
If X and Y are jointly bivariate normal with known population parameters, the **true** slope and intercept are $b = \rho\,\sigma_Y/\sigma_X$ and $a = \mu_Y - \rho(\sigma_Y/\sigma_X)\mu_X$ — the sample formulas above are these same equations with sample estimates ($\bar X, \bar Y, s, r$) standing in for the population values ($\mu, \sigma, \rho$). Geometrically, every possible regression line for given means/SDs sits inside a box whose diagonals have slope $\pm\sigma_Y/\sigma_X$; correlation $\rho$ picks how close the actual line comes to that diagonal.
:::

+++

:::check
Q: $r = 0.8$, $s_y = 10$, $s_x = 4$. What is the slope $b_1$?
= 2
> $b_1 = r \cdot s_y/s_x = 0.8 \times 10/4 = 2.0$
:::

:::check
Q: Same data with $\bar X = 12$ and $\bar Y = 50$. What is $b_0$?
= 26
> $b_0 = 50 - 2(12) = 26$
:::

+++

:::example Seeker cost vs. weight (corrected)
X = {4, 7, 8, 12, 16}, Y = {5, 5, 10, 7, 13}, n = 5

- $\sum X = 47$, $\sum Y = 40$, $\sum X^2 = 529$, $\sum XY = 427$
- $b_1 = \dfrac{5(427) - 47(40)}{5(529) - 47^2} = \dfrac{255}{436} = 0.585$
- $b_0 = 8.0 - 0.585(9.4) = 2.50$
- **$\hat Y = 2.50 + 0.585X$**
:::

:::note CEBoK's printed numbers
CEBoK's own worked example rounds $\bar X$ to 9 (it's actually 9.4), giving $\hat b = (427 - 5\cdot9\cdot8)/(529-5\cdot9^2) = 0.6$ (that printed fraction actually evaluates to 67/124 = 0.54; CEBoK carries 0.6 forward) and $\hat a = 8 - 0.6(9) = 2.5$, so $\hat Y = 2.5 + 0.6X$. CEBoK builds its worked examples on these rounded values: the slope's 95% CI comes out $0.6 \pm 3.18(0.3) = (-0.3, 1.4)$ (note that its own arithmetic, $0.6 \pm 0.9$, would actually give $(-0.3, 1.5)$), and the mean CI at X = 11 comes out $9 \pm 3.8 = (5.2, 12.8)$, restated as \$5.3M–\$12.9M.

This app uses the **exact** values throughout: $\bar X = 9.4$, $b = 0.585$, $a = 2.50$, giving $\hat Y = 2.50 + 0.585X$. The conclusion is unchanged either way — the fit is **not significant** at α = 0.05, and both intervals include zero / span a wide range.
:::

### Predicting a new seeker

At X = 11 kg, the exact fit gives $\hat Y = 2.50 + 0.585(11) = 8.94$ (CEBoK's rounded fit gives about \$9.1M). This is the **mean** of a normal distribution — the spread around it is what the confidence and prediction intervals (below) and the residual plot (next section) quantify.`
    },
    {
      id: 'anova', title: 'ANOVA and goodness of fit', summary: 'SST = SSR + SSE, R², adjusted R², r',
      body: String.raw`Split the total variation in Y into what the line explains and what it doesn't:

| Sum of squares | Formula | Meaning | df |
|---|---|---|---|
| **SST** (total) | $\sum (Y_i - \bar Y)^2$ | total variation | $n-1$ |
| **SSR** (regression) | $\sum (\hat Y_i - \bar Y)^2$ | **explained** | $k$ |
| **SSE** (error) | $\sum (Y_i - \hat Y_i)^2$ | **unexplained** | $n-k-1$ |

$$SST = SSR + SSE$$

:::widget r2-split:::

Mean squares: $MSR = SSR/k$ and $MSE = SSE/(n-k-1)$. (k = number of predictors.)

:::note Two ways to count k
CEBoK's own df notation lets $k$ = the number of estimated **parameters including the intercept** (so SSR has $k-1$ df and SSE has $n-k$ df). This app instead lets $k$ = the number of **predictors** (SSR has $k$ df, SSE has $n-k-1$ df). Both conventions land on the same numbers — for the toy problem, one intercept + one slope = 2 parameters either way, so SSE has $5-2=3$ df and SSR has $2-1=1$ df. Just be consistent within one calculation and check which convention a table or software output is using.
:::

For the toy problem: $MSE = 18.17/3 = 6.06$ and $MSR = 29.83/1 = 29.83$.

+++

### $R^2$, the coefficient of determination

$$R^2 = \frac{SSR}{SST} = 1 - \frac{SSE}{SST}$$

It is the share of Y's variation explained by X, from 0 to 1. Above 0.9 is excellent and above 0.7 is respectable, but **$R^2$ alone says nothing about significance.**

:::check
Q: SSE = 20 and SST = 100. What is $R^2$?
= 0.80
> $R^2 = 1 - 20/100 = 0.80$
:::

+++

### Adjusted $R^2$

$$R^2_{adj} = 1 - \frac{SSE/(n-k-1)}{SST/(n-1)}$$

It penalizes adding variables that don't help. Use it to compare models with **different numbers** of variables.

### Correlation coefficient

$r = \pm\sqrt{R^2}$, with the **same sign as the slope**. It ranges from −1 to +1.

:::check
Q: A regression has $R^2 = 0.64$ and a **negative** slope. What is r?
= -0.8
> $r = -\sqrt{0.64} = -0.8$. The sign follows the slope.
:::

+++

### ANOVA Redux: reconciling CV reduction with $R^2$

Two true statements need reconciling: a CER's job is to **reduce CV** versus a straight average, and $R^2$ measures the **percent of variation explained**. $R^2$ is a Pythagorean (squared) measure; CV reduction is a linear (standard deviation) measure. For a large sample, the CV is reduced by a factor of about $\sqrt{1-R^2}$. For the toy problem ($R^2 = 0.62$), the three methods in the source all agree: CV is reduced by a factor of about **0.71**, a **29%** reduction.

:::key When is a CER worse than just using the average?
If $R^2$ is below $(k-1)/(n-1)$, the CER performs **worse** than the straight average. Example: 11 data points, one predictor ($k=1$): $(1-1)/(11-1) = 0$... using $k$ = parameters (intercept + slope = 2): $(2-1)/(11-1) = 10\%$. An $R^2$ of 10% or less on 11 points means don't bother with the CER (and it likely wouldn't test significant anyway).
:::`
    },
    {
      id: 'see', title: 'SEE and CV', summary: 'How big is the typical miss?',
      body: String.raw`### Standard error of the estimate

$$SEE = \sqrt{MSE} = \sqrt{\frac{SSE}{n-k-1}}$$

It estimates the standard deviation of $\epsilon$, in the **same units as Y**. Lower is better. A quick uncertainty band is $\hat Y \pm SEE$.

### Coefficient of variation

$$CV = \frac{SEE}{\bar Y} \times 100\%$$

This is SEE as a percentage of the mean. It is unitless and comparable across models. **Below 15% is respectable.** Band: $\hat Y \pm CV \times \hat Y$.

+++

:::check
Q: SSE = 18, n = 11, one predictor (k = 1). What is SEE? (3 decimals)
= 1.414 ±0.002
> $df = 11 - 1 - 1 = 9$, so $MSE = 18/9 = 2$ and $SEE = \sqrt 2 = 1.414$.
:::

:::check
Q: SEE = 4.5 and $\bar Y = 30$. CV, as a percent?
= 15
> $4.5/30 = 15\%$, right at the "respectable" line.
:::

:::tip
Sample size and precision: the width of a 68% interval on the mean, in percent, is roughly $CV/\sqrt n$. With CV = 30%, a ±5% interval needs $n = (30/5)^2 = 36$ points. Cost data rarely gives you that, so significance is hard to reach.
:::`
    },
    {
      id: 'significance', title: 'Significance: t and F tests', summary: 'Is the relationship real?',
      body: String.raw`### t-test: is this coefficient different from zero?

- $H_0: \beta_1 = 0$ (no relationship); $H_1: \beta_1 \ne 0$
- $t = \dfrac{b_1}{SE(b_1)}$ with $n-k-1$ df
- If **p < α** (usually 0.05), reject $H_0$: the coefficient is significant.

:::example Toy problem t-test (exact values)
$b = 0.585$, $SE(b) = 0.264$, so $t = 0.585/0.264 = 2.22$, with $n-k-1 = 3$ df. The two-sided p-value is about **0.11**, which is greater than α = 0.05, so the slope is **not significant** — the small sample (n = 5) makes it hard to reach significance even though the scatter plot looks like it trends upward.
:::

:::tip Small samples are normal in cost estimating
When estimating a new Navy destroyer, there may exist only a couple of destroyers, a couple of cruisers, and a frigate as applicable historical ship-class data. Five data points is not an unrealistic sample size to work with — it's exactly why significance is often hard to reach.
:::

### F-test: is the model as a whole useful?

- $H_0$: all slope coefficients are 0; $H_1$: at least one isn't.
- $F = \dfrac{MSR}{MSE}$
- If the p-value (the "Significance F") is below α, the model is significant.

:::key
With **one** X variable, the t-test and the F-test give the **same** answer ($F = t^2$).
:::

For the toy problem: $F = MSR/MSE = 29.83/6.06 = 4.92$, and indeed $t^2 = 2.22^2 \approx 4.92$. Same conclusion either way: not significant (p ≈ 0.11).

+++

:::check
Q: MSR = 120 and MSE = 8. What is F?
= 15
> $F = 120/8 = 15$
:::

### p-values

The p-value is the probability of seeing a relationship this strong **if the true coefficient were zero**.

| p | Reading |
|---|---|
| < 0.01 | highly significant |
| < 0.05 | significant |
| < 0.10 | marginal |
| ≥ 0.10 | not significant |

:::warn
At α = 0.05, when there is truly no relationship you will still see "significant" results 1 time in 20. Run many candidate regressions and some will look good by chance. If an analyst tries many non-significant models before finding a significant one, that "winner" is likely a false positive. **Validate the CER against an independent data set** — either a randomly held-out second half of the original data, or a completely separate data set — rather than trusting the first significant-looking fit.
:::

+++

:::check
Q: A model has $R^2 = 0.93$ but its F-test p-value is 0.21. Accept it?
- Yes, the $R^2$ is excellent
* No, it isn't statistically significant
- Only if CV < 15%
> Significance comes before fit. High $R^2$ with a tiny sample can happen by chance. Check F, then t, then residuals.
:::

### Correlation, causation, and proxy variables

Correlation is a statistical measure; **causation** means the independent variable actually drives the dependent one. There's no statistical test that proves causation — that takes engineering judgment.

:::example The firemen and the fire
Damage from a fire correlates strongly with the number of firemen sent to fight it. That doesn't mean firemen cause damage, or that sending fewer would reduce it. The real driver is the size of the fire (not in the data set): bigger fires draw more firemen **and** cause more damage. Firemen are a **proxy variable** here — not the true cost driver, but a stand-in that correlates with it.
:::

A **proxy variable** is an independent variable not believed to actually drive cost, but that stands in for one that does, when the true driver isn't available or measurable.

:::check
Q: Correlation or causation? Ice cream sales track drownings.
- Causation: ice cream causes drowning
* Correlation only: temperature drives both
> A confounding variable (hot weather) drives both. Choose cost drivers that plausibly **cause** cost.
:::

:::check
Q: In the firemen/fire example, what is the true cost driver, and what role do the firemen play?
* Fire size is the true driver; the number of firemen is a proxy variable
- The firemen are the true driver
- There is no relationship at all
> Fire size isn't in the data set, so the analyst uses firemen count — which correlates with fire size — as a proxy.
:::`
    },
    {
      id: 'residuals', title: 'Residual analysis', summary: 'Patterns that invalidate a model',
      body: String.raw`A residual is actual minus predicted:
$$e_i = Y_i - \hat Y_i$$

Plot residuals against X (or $\hat Y$). **Good:** a random, rectangular band around zero. **Bad** patterns:

| Pattern | Meaning | Remedy |
|---|---|---|
| **Curve / arch** | Non-linear relationship | Try power, exponential, log |
| **Funnel / cone** | Heteroscedasticity | Transform Y, weighted least squares |
| **Wave / cycle** | Serial correlation | Common in time series; in learning curves it can signal lost learning or new work |

:::tip Beyond CEBoK: non-OLS remedies
**Weighted Least Squares (WLS)** minimizes $\sum w_i(y_i - f(x_i))^2$ instead of plain SSE, commonly with $w_i = 1/\sigma_i^2$ — points with less variance get more weight. It's a direct fix for a funnel-shaped residual plot. Separately, OLS assumes an **additive** error, $y = ax^b + \epsilon$; some non-linear processes instead have **multiplicative** error, $y = (ax^b)\cdot\epsilon$ (this is also what OLS-transformed prediction intervals produce once translated back to unit space). MUPE and ZMPE are techniques built for multiplicative error.
:::

:::key
Always look at the residual plot before accepting a model. Patterns in the residuals outweigh good-looking statistics.
:::

For the Seeker toy example, plotting each residual against its X value (Fig 8.13) shows no pattern and roughly constant spread — the OLS assumptions look reasonable, even though the fit itself isn't statistically significant with only n = 5 points.

:::widget outlier-regression:::

+++

Try it: load **Curved** and then **Funnel** in the playground and read the residual plot.

:::widget regression:::

:::challenge regression data=funnel mode=ols lock=mode
Q: Look at the residual plot below the fit. What problem does it show?
* The spread of the residuals grows with X (heteroscedasticity)
- The residuals follow a curve, so the relationship is nonlinear
- One outlier dominates the fit
- Nothing is wrong, since the residuals average zero
> A funnel shape means the error variance isn't constant, which breaks an OLS assumption and makes the SEE and t-tests unreliable. A log transformation or weighted regression usually helps.
:::

:::check
Q: The residual plot shows a smile (arch) shape. What does it suggest?
* The true relationship is non-linear
- The variance is constant
- Multicollinearity
- The model is fine
> A systematic curve means a straight line is the wrong shape. Try a transformation.
:::`
    },
    {
      id: 'intervals', title: 'Confidence and prediction intervals', summary: 'Mean response vs. next observation',
      body: String.raw`### Confidence interval: for the **mean** Y at $X_0$

$$\hat Y \pm t_{\alpha/2,\,n-k-1}\cdot SEE\sqrt{\frac1n + \frac{(X_0-\bar X)^2}{\sum (X_i - \bar X)^2}}$$

### Prediction interval: for **one new** observation at $X_0$

$$\hat Y \pm t_{\alpha/2,\,n-k-1}\cdot SEE\sqrt{1 + \frac1n + \frac{(X_0-\bar X)^2}{\sum (X_i - \bar X)^2}}$$

- Both are **narrowest at $\bar X$** and widen as you move away from it, because there is less information at the extremes.
- The PI is **always wider** than the CI because of the extra "1+" term for individual scatter.

:::widget ci-bands:::

:::example Toy problem: slope CI and mean CI at X = 11 (exact values)
Slope: $b \pm t_{.025,3}\cdot SE(b) = 0.585 \pm 3.182(0.264) = (-0.25, 1.42)$. The interval spans zero, matching the t-test's "not significant" conclusion.

Mean at X = 11: $\hat Y \pm t_{.025,3}\cdot SEE\sqrt{\tfrac1n + \tfrac{(X_0-\bar X)^2}{\sum(X_i-\bar X)^2}} = 8.94 \pm 3.182(2.46)\sqrt{\cdots} = (5.19, 12.69)$.

Prediction interval at X = 11 (adds the "1+" term): $(0.25, 17.62)$ — much wider, because it must also cover the scatter of one new observation, not just uncertainty in the mean.
:::

+++

| Use | Interval |
|---|---|
| Average cost for a program type / risk analysis inputs | CI |
| Cost of a specific new item | PI (more conservative) |

Large-n rule of thumb: ±1 ≈ 68%, ±2 (1.96) ≈ 95%, ±3 (2.58 exactly) ≈ 99%. More precisely, a normal distribution has 68.3%, 95.5%, and 99.7% of its probability within one, two, and three standard deviations of the mean, respectively — this is where those rules of thumb come from once the sample is large enough (roughly $n \ge 30$, per the Central Limit Theorem) for the t-distribution to approach the normal.

:::check
Q: You are estimating the cost of **one specific** new radar. Which interval should you use?
- Confidence interval
* Prediction interval
> A single new item carries its own random scatter, so use the prediction interval.
:::

:::check
Q: Where is a regression confidence interval narrowest?
- At the smallest X
* At $\bar X$
- At the largest X
- It is the same width everywhere
> The $(X_0 - \bar X)^2$ term is zero at the mean of X.
:::

:::warn
Don't extrapolate beyond the data range. Intervals widen quickly and the relationship may not hold out there.
:::`
    },
    {
      id: 'nonlinear', title: 'Non-linear regression', summary: 'Log transforms and the missing intercept',
      body: String.raw`| Model | Equation | Transform | Straight in |
|---|---|---|---|
| Logarithmic | $Y = \beta_0 + \beta_1 \ln X$ | ln X only | semi-log |
| Exponential | $Y = ae^{bX}$ | ln Y only | semi-log |
| Power | $Y = aX^b$ | ln X and ln Y | log-log |

**Power** (most common in cost work): regress $\ln Y$ on $\ln X$, then $a = e^{\alpha}$ and $b = \beta$.
**Exponential:** regress $\ln Y$ on X, then $a = e^{\alpha}$ and $b = \beta$.
**Logarithmic:** just use $\ln X$ as the predictor. No back-transform is needed.

:::widget transform:::

:::challenge transform f=power
Q: These data follow a power function $y = a x^b$. In which space do they plot as a straight line?
* Log-log (ln y against ln x)
- Semi-log (ln y against x)
- Unit space (y against x)
> Taking logs gives $\ln y = \ln a + b \ln x$, which is linear in $\ln x$. Semi-log straightens exponentials. The learning curve is a power function, which is why it plots straight on log-log paper.
:::

+++

:::example Exponential worked example (Fig 8.29/8.30)
Regressing $\ln Y$ on $X$ gives $\ln Y = -3.0 + 1.2X$, statistically significant with $R^2 = 0.88$, SEE = 0.30, CV = 9%. Back-transforming: $a = e^{-3.0} = 0.05$ and $b = 1.2$, so $\hat Y = 0.05e^{1.2x}$. The residual plot (Fig 8.30) shows no pattern and constant spread, consistent with the OLS assumptions holding.
:::

### Choosing a shape from the raw plot
- Curving up at an **increasing** rate → power or exponential
- Curving up at a **decreasing** rate → logarithmic (or power with b < 1)
- S-shaped → logistic (advanced)

### The missing intercept ("data bowing")

Transforms assume $Y = aX^b$ with no constant. Real data is often $Y = aX^b + c$. The symptom is that the transformed plot still **bows** and the residuals arch.

Fixes: adjust Y by a trial constant and refit, use Solver to fit all three parameters, and keep the version with better $R^2$ and lower SEE.

:::example Minding the intercept (Fig 8.31/8.32)
Without adjustment, a toy data set fits $y = 4.2867x^{-0.2467}$ with $R^2 = 0.9162$, but the transformed plot still bows — a sign of a missing non-zero intercept. Subtracting a trial constant of 3 from Y and refitting gives a perfect fit, $y = x^{-1}$ (add the 3 back afterward), with $R^2 = 1$. The bow disappears entirely once the intercept is accounted for.
:::

:::widget intercept-bow:::

*Widget data are a reconstruction following CEBoK's pattern (true model y = 3 + 1/x); at c = 0 the fit is close to, not identical to, CEBoK's 4.2867x^-0.2467, R² 0.9162.*

:::check
Q: After a log-log regression, intercept $\alpha = 1.2$ and slope $\beta = 0.75$. What is $a$ in $Y = aX^b$? (2 decimals)
= 3.32 ±0.01
> $a = e^{1.2} = 3.32$ and $b = 0.75$.
:::`
    },
    {
      id: 'multi', title: 'Multivariate regression and multicollinearity', summary: 'Several drivers, VIF',
      body: String.raw`$$Y = \beta_0 + \beta_1 X_1 + \beta_2 X_2 + \dots + \beta_k X_k + \epsilon$$

Each coefficient is the **partial effect** of its variable with the others held constant. Geometrically: 1 variable gives a line, 2 give a plane, k give a hyperplane.

**Process:** run with all candidate variables → check the overall F → check each t → drop the least significant variable → rerun until every variable is significant. Check a residual plot for **each** X. If every variable ends up dropped, the model reduces to a simple average.

:::example Fig 8.34: a three-variable example
$\hat y = 1.5 + 0.2X_1 - 1.6X_2 + 0.8X_3$. SSR = 4720.8 (df 3, MSR = 1573.6); SSE = 201.0 (df 11, MSE = 18.3); $F = 1573.6/18.3 = 86.1$, p ≈ 0.0000001 — the model as a whole is highly significant. But of the three t-tests, only $X_3$'s coefficient (0.8) is significant. Since the F-test passes but not every t-test does, this model must be **rerun** — first with just $X_3$, or possibly $X_3$ plus one other variable — before it can be accepted.
:::

+++

### Multicollinearity

When the X variables are highly correlated with each other, standard errors inflate, t-stats shrink, coefficients can take the wrong sign, and interpretation gets muddy.

**Variance inflation factor:**
$$VIF_j = \frac{1}{1 - R_j^2}$$

where $R_j^2$ comes from regressing $X_j$ on the other X's.

CEBoK's rule of thumb: **VIF > 10** is severe enough to take a second look — remove one of the high-VIF variables and rerun until the regression is significant.

:::tip Beyond CEBoK
A finer-grained tier some practitioners use: **< 5** generally OK, **5–10** moderate (worth investigating), **> 10** severe. CEBoK itself only states the >10 threshold.
:::

**Symptoms:** large swings in coefficient values when a variable is added or dropped; coefficients with an unexpected sign; expected-significant variables that aren't; a high overall $R^2$ with several non-significant variables; high VIFs. Note that multicollinearity does **not** affect the reliability of SEE, F, or t as calculated — it only clouds interpretation of which variable is "doing the work."
**Fixes:** drop one of the correlated variables, combine them into an index, ridge regression, or more data.

:::tip Beyond CEBoK
**Ridge regression** regularizes the model by adding a ridge constant $k$ to each independent variable's variance, so no variable has to be dropped. It reduces SEE and keeps every variable in the analysis, but the resulting coefficients are biased and harder to interpret directly from the output. Best used only when correlation between predictors is extremely high.
:::

+++

:::check
Q: Regressing $X_2$ on the other predictors gives $R^2 = 0.9$. What is $VIF_2$?
= 10
> $1/(1 - 0.9) = 10$, the threshold for severe multicollinearity.
:::

:::check
Q: Which pair of predictors is a classic multicollinearity trap?
* Weight in pounds and weight in kilograms
- Weight and production rate
- Lines of code and team capability
> They carry exactly the same information. Length and volume for similar shapes is another example.
:::`
    },
    {
      id: 'selection', title: 'Selecting the best model', summary: 'Within type, across type, nested',
      body: String.raw`First, every candidate must be **significant** (F) with **significant variables** (t) and clean **residuals**. Then:

| Comparison | Criterion |
|---|---|
| **Within type** (all linear, all power…) | Highest $R^2$ (adjusted $R^2$ if the variable counts differ) |
| **Across type** (linear vs. power…) | Lowest **SSE computed in unit space** |
| **Nested** (one model adds variables to another) | Look at everything: adjusted $R^2$, SEE, CV, Significance F, t-stats |

:::example Fig 8.35: selecting within type
Three significant linear CERs, each using a different cost driver. A (surface area) has $R^2 = 0.95$ and wins. In a separate pair of power CERs (both regressed in log space), B (speed) has $R^2 = 0.96$ and wins over A. Note: if a lower-$R^2$ model's driver is more useful for decision-making (e.g., for CAIV trades), that practical value can still outweigh a small $R^2$ edge.
:::

:::example Fig 8.37: selecting from nested models
A three-variable model has adjusted $R^2 = 63.6\%$, SEE = 0.178, CV = 16.1%. Dropping $x_3$ (its least significant variable) improves **every** metric: adjusted $R^2 = 64.0\%$, SEE = 0.177, CV = 15.9%, and Significance F also improves. A logical next step would be testing whether $x_1$ can be dropped too.
:::

:::widget nested-model:::

*Widget data are a reconstruction (CEBoK's data table is an unreadable image); its statistics land near, not exactly on, Fig 8.37's 63.6%/64.0%, SEE .178/.177, CV 16.1%/15.9%.*

+++

### Why not $R^2$ across types?

$R^2$ from a log-space fit measures variation in **ln Y**, not Y. It isn't comparable to a unit-space $R^2$.

**Across-type recipe:** fit in transformed space → back-transform the equation → predict $\hat Y$ in unit space → residuals $Y - \hat Y$ → $SSE = \sum e^2$ → the smallest wins.

:::check
Q: Linear CER: SSE = 8.3. Power CER: log-space $R^2$ = 0.97, **unit-space** SSE = 7.2. Which do you pick?
- Linear, because its unit-space $R^2$ is higher
* Power, because its unit-space SSE is lower
- You can't compare them
> Across types, compare SSE in unit space. 7.2 < 8.3, so pick the power model.
:::

:::note Fig 8.36 recipe
For the non-linear model: fit in log space → transform the equation back to unit space → compute $\hat Y$ for each data point in unit space → residuals $Y - \hat Y$ → square and sum them for SSE. This is what turns a log-space power fit's R2 = 0.97 into a comparable unit-space SSE = 7.2.
:::

+++

### Accepting a model: decision tree
1. F-test significant? No → reject.
2. All t-tests significant? No → drop the weakest variable and rerun.
3. Residuals random? No → try another functional form.
4. $R^2$ reasonable in context? Then accept, and use SEE/CV for the uncertainty.

### Reporting a CER
Include the equation, $R^2$ (or adjusted), SEE/CV, F and its p, t's and their p's, n, and a note on the residuals.

:::check
Q: Model A: $R^2$ 0.95, Model B: 0.87, Model C: 0.82, all linear, all significant, same number of variables. Pick?
* A
- B
- C
> Within type with the same number of variables, the highest $R^2$ wins.
:::

+++

### CEBoK's Testable Topics for this module

| Testable | Testable, but less emphasized | Not testable |
|---|---|---|
| All main content, Linear Regression | Log-log regression, Nonlinear regression | Advanced topics, "Minding the intercept" |

:::note
Even though "minding the intercept" (the missing-intercept / data-bowing fix covered under Non-linear regression) is listed as **not testable**, it's included here because it's genuinely useful for building CERs and appears directly in the module's own figures.
:::`
    }
  ],
  cards: String.raw`
## Model
Q: Population regression model
A: $Y = \beta_0 + \beta_1X + \epsilon$
R: yes
Q: Estimated regression equation
A: $\hat{Y} = b_0 + b_1X$ (b's are sample estimates of the true β's)
R: yes
Q: Five OLS assumptions
A: Linearity; independence of errors from X; homoscedasticity (constant variance); normality of errors (mean 0); no perfect multicollinearity.
Q: What is a CER?
A: Cost Estimating Relationship: an equation relating cost to one or more cost drivers, usually built with regression.
R: yes
Q: Why square the errors in least squares?
A: So positive and negative errors don't cancel.
Q: The five bivariate questions
A: What does it look like? What's the best guess? How much is unexplained? How precise is the estimate? How can certainty be ensured?
Q: Four types of regression models
A: Factors (y=bx, intercept 0, generally avoided); OLS linear (y=a+bx+ε); OLS multivariate (y=a+b1x1+...+bkxk+ε); Non-OLS (WLS, MAPE, ZMPE).
Q: Why plot a trend line before trusting software regression output?
A: Spots outliers/undue influence, reveals missed curvature, confirms constants transformed correctly (natural form on a trend line).
Q: Proxy variable
A: An independent variable not believed to actually drive cost, but that stands in for one that does.
R: yes
Q: Firemen/fire example
A: Firemen present correlates with fire damage, but fire size (not in the data) drives both — firemen are a proxy, not the cause.

## Fitting
Q: Slope formula (deviation form)
A: $b_1 = \dfrac{\sum(X-\bar X)(Y-\bar Y)}{\sum (X-\bar X)^2}$
R: yes
Q: Slope formula using correlation
A: $b_1 = r \cdot s_y / s_x$
R: yes
Q: Slope formula (computational)
A: $b_1 = \dfrac{n\sum XY - \sum X\sum Y}{n\sum X^2 - (\sum X)^2}$
R: yes
Q: Intercept formula
A: $b_0 = \bar Y - b_1\bar X$
R: yes
Q: The OLS line always passes through which point?
A: $(\bar X, \bar Y)$
Q: Seeker example (X={4,7,8,12,16}, Y={5,5,10,7,13}): fitted line?
A: $\hat Y = 2.50 + 0.585X$ (exact values; CEBoK's own worked example rounds $\bar X$ to 9 and gets $\hat Y = 2.5+0.6X$). Not significant: p ≈ 0.11, n = 5.

## ANOVA
Q: SST formula and df
A: $\sum(Y_i-\bar Y)^2$; df = n − 1
R: yes
Q: SSR formula and df
A: $\sum(\hat Y_i - \bar Y)^2$; df = k
R: yes
Q: SSE formula and df
A: $\sum(Y_i - \hat Y_i)^2$; df = n − k − 1
R: yes
Q: Fundamental ANOVA identity
A: SST = SSR + SSE (total = explained + unexplained)
R: yes
Q: MSR and MSE
A: MSR = SSR/k; MSE = SSE/(n − k − 1)
R: yes
Q: $R^2$ formula
A: $R^2 = SSR/SST = 1 - SSE/SST$
R: yes
Q: What does $R^2$ measure, and what doesn't it tell you?
A: The proportion of Y's variation explained by X. It does NOT indicate statistical significance.
Q: Adjusted $R^2$ formula and purpose
A: $1 - \frac{SSE/(n-k-1)}{SST/(n-1)}$. Penalizes useless variables; use to compare models with different numbers of variables.
R: yes
Q: Correlation coefficient r from $R^2$
A: $r = \pm\sqrt{R^2}$, with the same sign as the slope.
R: yes
Q: Typical $R^2$ expectations
A: > 0.9 excellent; > 0.7 respectable; lower can still be useful if significant.
Q: Toy problem MSE and MSR (exact values)
A: MSE = 18.17/3 = 6.06; MSR = 29.83/1 = 29.83.
Q: CEBoK's k in ANOVA df vs. this app's k
A: CEBoK: k = number of parameters including intercept (SSR df k-1, SSE df n-k). This app: k = number of predictors (SSR df k, SSE df n-k-1). Same numbers, different label.
Q: CV reduction rule (ANOVA Redux)
A: For large n, CV is reduced by a factor of about $\sqrt{1-R^2}$ versus using the plain average.
Q: When is a CER worse than the straight average?
A: When $R^2 < (k-1)/(n-1)$. Example: 11 points, k=2 (intercept+slope) -> threshold 10%.
Q: Toy problem CV reduction result
A: Factor of about 0.71, a 29% reduction, from R2 = 0.62.

## SEE and CV
Q: SEE formula
A: $SEE = \sqrt{MSE} = \sqrt{SSE/(n-k-1)}$
R: yes
Q: What does SEE represent?
A: The estimated standard deviation of the error term, in Y's units. Lower is better.
Q: Regression CV formula
A: $CV = SEE/\bar Y \times 100\%$
R: yes
Q: Desired regression CV threshold
A: < 15% is respectable (higher can be acceptable).
Q: Rule of thumb linking CV, n and the width of a 68% CI
A: CI width (%) ≈ $CV/\sqrt n$. E.g., CV 30% and ±5% → n = 36.

## Significance
Q: t-statistic for a coefficient
A: $t = b_1 / SE(b_1)$, df = n − k − 1
R: yes
Q: Hypotheses for the slope t-test
A: $H_0: \beta_1 = 0$ (no relationship) vs. $H_1: \beta_1 \ne 0$
Q: F-statistic
A: $F = MSR/MSE$
R: yes
Q: What does the F-test test?
A: Whether the model as a whole is significant ($H_0$: all slope coefficients = 0).
Q: Relationship between t and F in simple (1-variable) regression
A: They give the same result: $F = t^2$.
Q: Decision rule using p-values
A: If p < α (typically 0.05), reject $H_0$: significant.
Q: Definition of p-value (regression)
A: The probability of observing a relationship this strong by chance if the true coefficient were zero.
R: yes
Q: p-value significance levels
A: < 0.01 highly significant; < 0.05 significant; < 0.10 marginal; ≥ 0.10 not significant.
Q: Order of checks when evaluating a regression
A: F-test (overall) → t-tests (each variable) → residual plot → $R^2$ → SEE/CV.
Q: Correlation vs. causation
A: Correlation is a statistical relationship; causation means X drives Y. Pick drivers by engineering judgment (e.g., ice cream & drownings are both driven by temperature).
Q: Toy problem t-test (exact values)
A: t = 0.585/0.264 = 2.22 (3 df), p ≈ 0.11 > 0.05: not significant.
Q: How to guard against a false-positive CER (the "1 in 20" problem)
A: Validate against an independent data set: a randomly held-out second half of the original data, or a completely separate data set.

## Residuals
Q: Residual definition
A: $e_i = Y_i - \hat Y_i$ (actual − predicted)
R: yes
Q: What does a good residual plot look like?
A: A random rectangular band around zero with constant spread and no pattern.
Q: Curved / arched residual pattern means…
A: A non-linear relationship. Try power, exponential, or logarithmic forms.
Q: Funnel / cone residual pattern means…
A: Heteroscedasticity (variance grows with X). Transform Y or use weighted least squares.
Q: Cyclical / wave residual pattern means…
A: Serial correlation (common in time series; in learning curves it can mean lost learning or new work).
Q: Homoscedasticity vs. heteroscedasticity
A: Constant error variance (OLS assumption met) vs. non-constant variance (violated; funnel pattern).

## Intervals
Q: Confidence interval: what does it bound?
A: The true MEAN of Y at $X_0$.
R: yes
Q: Prediction interval: what does it bound?
A: The NEXT INDIVIDUAL observation of Y at $X_0$.
R: yes
Q: Which is wider, CI or PI, and why?
A: The PI. It adds individual residual variation (the "1 +" under the root).
Q: Where are regression intervals narrowest?
A: At $\bar X$. They widen hyperbolically away from it.
Q: SE of mean prediction (CI)
A: $SEE\sqrt{\frac1n + \frac{(X_0-\bar X)^2}{\sum(X_i-\bar X)^2}}$
R: yes
Q: SE for prediction interval
A: $SEE\sqrt{1 + \frac1n + \frac{(X_0-\bar X)^2}{\sum(X_i-\bar X)^2}}$
R: yes
Q: Large-sample critical values for 68/95/99% intervals
A: ≈ 1.0, 1.96, 2.58
Q: When to use a CI vs. a PI in cost work
A: CI: average cost of a program type / risk inputs. PI: a specific new item (more conservative).
Q: Toy problem: slope 95% CI (exact values)
A: $0.585 \pm 3.182(0.264) = (-0.25, 1.42)$
Q: Toy problem: mean CI and PI at X=11 (exact values)
A: Mean CI (5.19, 12.69); PI (0.25, 17.62). $\hat Y = 8.94$.
Q: CEBoK's printed (rounded) toy numbers vs. this app's exact numbers
A: CEBoK rounds $\bar X$ to 9, giving b=0.6, a=2.5, slope CI (-0.3,1.4), mean CI at X=11 (5.2,12.8) / \$5.3M-\$12.9M. Exact: $\bar X$=9.4, b=0.585, a=2.50. Conclusions match either way.
Q: Normal-distribution percentages behind ±1/2/3 SEE
A: 68.3% / 95.5% / 99.7% within one/two/three standard deviations (valid once n is large, roughly n ≥ 30 per the CLT).

## Non-linear
Q: Power model: which variables are transformed?
A: Both: ln X and ln Y (log-log).
Q: Exponential model: which variables are transformed?
A: Only Y (ln Y), semi-log.
Q: Logarithmic model: which variables are transformed?
A: Only X (ln X); no back-transformation needed.
Q: Back-transforming a log-space fit (power or exponential)
A: $a = e^{\alpha}$; $b = \beta$ (the slope stays the same).
Q: Symptom of a missing (non-zero) intercept in a transformed fit
A: "Data bowing": the transformed plot still curves and the residuals arch.
Q: Fixes for a missing intercept
A: Add or subtract a trial constant from Y and refit; use Solver to fit all 3 parameters; keep the better $R^2$ / lower SEE.
Q: Exponential example (Fig 8.29/8.30): transformed fit and back-transform
A: ln Y = -3.0 + 1.2X, R2 = 0.88, SEE = 0.30, CV = 9%. a = e^-3.0 = 0.05, b = 1.2, so $\hat Y = 0.05e^{1.2x}$.
Q: Minding the intercept example (Fig 8.31/8.32): before and after
A: Without adjustment: y = 4.2867x^-0.2467, R2 = 0.9162 (still bows). Subtract 3, refit: y = x^-1 (add 3 back), R2 = 1.

## Multivariate
Q: Meaning of a coefficient in multivariate regression
A: The partial effect of that variable with the others held constant.
Q: Multicollinearity definition
A: High correlation among the independent variables.
R: yes
Q: Effects of multicollinearity
A: Inflated standard errors, lower t-stats, non-significant or wrong-sign coefficients, unstable estimates.
Q: VIF formula
A: $VIF_j = 1/(1 - R_j^2)$, where $R_j^2$ comes from regressing $X_j$ on the other X's.
R: yes
Q: VIF thresholds
A: < 5 OK; 5–10 investigate; > 10 severe.
Q: Symptoms of multicollinearity
A: High $R^2$ but few significant t's; unexpected signs; coefficients jump when variables change; high pairwise correlations.
Q: Remedies for multicollinearity
A: Drop one of the correlated variables; combine them into an index; ridge regression; more data.
Q: Minimum data points for regression
A: Absolute minimum k + 2; practical 3k–5k; 30+ desired.
Q: Fig 8.34 worked multivariate example
A: $\hat y = 1.5+0.2X_1-1.6X_2+0.8X_3$. SSR=4720.8 (df 3, MSR=1573.6); SSE=201.0 (df 11, MSE=18.3); F=86.1, p≈0.0000001. Only $X_3$'s t-test is significant -> rerun.
Q: CEBoK's VIF threshold
A: VIF > 10 is severe enough to take a second look and rerun without that variable.
Q: Weighted Least Squares (WLS)
A: Minimizes $\sum w_i(y_i-f(x_i))^2$; common choice $w_i = 1/\sigma_i^2$. Fixes heteroscedasticity (funnel residuals).
R: yes
Q: Additive vs. multiplicative error
A: OLS assumes additive: $y=ax^b+\epsilon$. Some processes have multiplicative error: $y=(ax^b)\cdot\epsilon$ — needs MUPE/ZMPE, not plain OLS.
Q: Ridge regression: purpose and tradeoff
A: Adds a ridge constant k to each variable's variance so none must be dropped despite high correlation; reduces SEE but biases coefficients and hurts interpretability.
R: yes
Q: Bivariate normal geometry: true slope and intercept
A: $b=\rho\sigma_Y/\sigma_X$; $a=\mu_Y-\rho(\sigma_Y/\sigma_X)\mu_X$. Sample formulas substitute $\bar X,\bar Y,s,r$ for $\mu,\sigma,\rho$.

## Model selection
Q: Selecting among models of the same type
A: Highest $R^2$ (adjusted $R^2$ if the number of variables differs). All must be significant.
Q: Selecting among models of different types (linear vs. power)
A: Lowest SSE calculated in UNIT space.
Q: Why not compare $R^2$ across model types?
A: A log-space $R^2$ measures variation in ln Y, which isn't comparable to a unit-space $R^2$.
Q: Nested models: what to compare?
A: Adjusted $R^2$, SEE, CV, Significance F, and the individual t-stats.
Q: Minimum contents of a regression write-up
A: Equation, $R^2$/adj $R^2$, SEE/CV, F and p, t's and p's, n, residual analysis statement.
Q: Three cross-validation methods
A: Hold-out (20–30%), k-fold, leave-one-out. Often infeasible with small cost data sets; validate with SMEs and analogies instead.
Q: Fig 8.35: selecting within type example
A: Three significant linear CERs; A (surface area) has the highest R2 = 0.95 and is chosen.
Q: Fig 8.37: nested model comparison
A: Dropping x3 improves everything: adjusted R2 63.6% -> 64.0%, SEE 0.178 -> 0.177, CV 16.1% -> 15.9%.
Q: CEBoK's Testable Topics for Module 8
A: Testable: all main content, Linear Regression. Less emphasized: log-log regression, nonlinear regression. Not testable: advanced topics, "minding the intercept."
`
});
