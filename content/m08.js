PCEA.addModule({
  id: 'm08', num: 8, title: 'Regression Analysis', short: 'Regression', source: 'guide',
  blurb: 'Building CERs: least squares, ANOVA, R², SEE, t and F tests, residuals, transformations, and model selection.',
  intro: String.raw`Regression develops **cost estimating relationships (CERs)** that fit historical data best **and** tell you how much to trust them. It is the main tool for relating cost drivers to cost statistically.

Every regression answers two questions:
1. **Statistical significance**: is the relationship real?
2. **Uncertainty**: how much variation is still unexplained?`,
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
:::`
    },
    {
      id: 'fit', title: 'Finding the line', summary: 'Least squares slope and intercept, worked example',
      body: String.raw`**Least squares** picks the line that minimizes the sum of squared vertical distances (residuals) from the points to the line. We square them so positive and negative misses don't cancel.

Play with the points. Drag one far from the others and watch the slope, $R^2$ and residual plot react.

:::widget regression:::

:::challenge regression data=seeker mode=hand lock=mode
Q: Fit the Seeker data **by hand**. Drag the two orange handles until your line's total squared error is within 5% of the best possible.
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

:::warn A correction to your guide
Your guide uses $\sum XY = 411$ (the correct value is 427) and then writes $175/436 = 0.6$ (175/436 is actually 0.40). The corrected fit is $\hat Y = 2.50 + 0.585X$ with $R^2 = 0.62$, SEE = 2.46, CV = 31%, F = 4.92 and p ≈ 0.11. The conclusion doesn't change: the fit is **not significant** at α = 0.05 with only n = 5. Load the "Seeker (guide)" preset above to check the numbers.
:::`
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

Mean squares: $MSR = SSR/k$ and $MSE = SSE/(n-k-1)$. (k = number of predictors.)

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

### F-test: is the model as a whole useful?

- $H_0$: all slope coefficients are 0; $H_1$: at least one isn't.
- $F = \dfrac{MSR}{MSE}$
- If the p-value (the "Significance F") is below α, the model is significant.

:::key
With **one** X variable, the t-test and the F-test give the **same** answer ($F = t^2$).
:::

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
At α = 0.05, when there is truly no relationship you will still see "significant" results 1 time in 20. Run many candidate regressions and some will look good by chance. Use engineering judgment to pick drivers.
:::

+++

:::check
Q: A model has $R^2 = 0.93$ but its F-test p-value is 0.21. Accept it?
- Yes, the $R^2$ is excellent
* No, it isn't statistically significant
- Only if CV < 15%
> Significance comes before fit. High $R^2$ with a tiny sample can happen by chance. Check F, then t, then residuals.
:::

:::check
Q: Correlation or causation? Ice cream sales track drownings.
- Causation: ice cream causes drowning
* Correlation only: temperature drives both
> A confounding variable (hot weather) drives both. Choose cost drivers that plausibly **cause** cost.
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

:::key
Always look at the residual plot before accepting a model. Patterns in the residuals outweigh good-looking statistics.
:::

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

+++

| Use | Interval |
|---|---|
| Average cost for a program type / risk analysis inputs | CI |
| Cost of a specific new item | PI (more conservative) |

Large-n rule of thumb: ±1 ≈ 68%, ±2 (1.96) ≈ 95%, ±3 (2.58 exactly) ≈ 99%.

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

### Choosing a shape from the raw plot
- Curving up at an **increasing** rate → power or exponential
- Curving up at a **decreasing** rate → logarithmic (or power with b < 1)
- S-shaped → logistic (advanced)

### The missing intercept ("data bowing")

Transforms assume $Y = aX^b$ with no constant. Real data is often $Y = aX^b + c$. The symptom is that the transformed plot still **bows** and the residuals arch.

Fixes: adjust Y by a trial constant and refit, use Solver to fit all three parameters, and keep the version with better $R^2$ and lower SEE.

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

**Process:** run with all candidate variables → check the overall F → check each t → drop the least significant variable → rerun until every variable is significant. Check a residual plot for **each** X.

+++

### Multicollinearity

When the X variables are highly correlated with each other, standard errors inflate, t-stats shrink, coefficients can take the wrong sign, and interpretation gets muddy.

**Variance inflation factor:**
$$VIF_j = \frac{1}{1 - R_j^2}$$

where $R_j^2$ comes from regressing $X_j$ on the other X's.

| VIF | Reading |
|---|---|
| < 5 | OK |
| 5–10 | moderate; investigate |
| > 10 | severe; act |

**Symptoms:** high $R^2$ but few significant t's; unexpected signs; coefficients jump when variables are added or dropped.
**Fixes:** drop one of the correlated variables, combine them into an index, ridge regression, or more data.

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
:::`
    }
  ],
  cards: String.raw`
## Model
Q: Population regression model
A: $Y = \beta_0 + \beta_1X + \epsilon$
Q: Estimated regression equation
A: $\hat{Y} = b_0 + b_1X$ (b's are sample estimates of the true β's)
Q: Five OLS assumptions
A: Linearity; independence of errors from X; homoscedasticity (constant variance); normality of errors (mean 0); no perfect multicollinearity.
Q: What is a CER?
A: Cost Estimating Relationship: an equation relating cost to one or more cost drivers, usually built with regression.
Q: Why square the errors in least squares?
A: So positive and negative errors don't cancel.

## Fitting
Q: Slope formula (deviation form)
A: $b_1 = \dfrac{\sum(X-\bar X)(Y-\bar Y)}{\sum (X-\bar X)^2}$
Q: Slope formula using correlation
A: $b_1 = r \cdot s_y / s_x$
Q: Slope formula (computational)
A: $b_1 = \dfrac{n\sum XY - \sum X\sum Y}{n\sum X^2 - (\sum X)^2}$
Q: Intercept formula
A: $b_0 = \bar Y - b_1\bar X$
Q: The OLS line always passes through which point?
A: $(\bar X, \bar Y)$
Q: Seeker example (X={4,7,8,12,16}, Y={5,5,10,7,13}): fitted line?
A: $\hat Y = 2.50 + 0.585X$ (ΣXY = 427; the guide's 411 is a typo). Not significant: p ≈ 0.11, n = 5.

## ANOVA
Q: SST formula and df
A: $\sum(Y_i-\bar Y)^2$; df = n − 1
Q: SSR formula and df
A: $\sum(\hat Y_i - \bar Y)^2$; df = k
Q: SSE formula and df
A: $\sum(Y_i - \hat Y_i)^2$; df = n − k − 1
Q: Fundamental ANOVA identity
A: SST = SSR + SSE (total = explained + unexplained)
Q: MSR and MSE
A: MSR = SSR/k; MSE = SSE/(n − k − 1)
Q: $R^2$ formula
A: $R^2 = SSR/SST = 1 - SSE/SST$
Q: What does $R^2$ measure, and what doesn't it tell you?
A: The proportion of Y's variation explained by X. It does NOT indicate statistical significance.
Q: Adjusted $R^2$ formula and purpose
A: $1 - \frac{SSE/(n-k-1)}{SST/(n-1)}$. Penalizes useless variables; use to compare models with different numbers of variables.
Q: Correlation coefficient r from $R^2$
A: $r = \pm\sqrt{R^2}$, with the same sign as the slope.
Q: Typical $R^2$ expectations
A: > 0.9 excellent; > 0.7 respectable; lower can still be useful if significant.

## SEE and CV
Q: SEE formula
A: $SEE = \sqrt{MSE} = \sqrt{SSE/(n-k-1)}$
Q: What does SEE represent?
A: The estimated standard deviation of the error term, in Y's units. Lower is better.
Q: Regression CV formula
A: $CV = SEE/\bar Y \times 100\%$
Q: Desired regression CV threshold
A: < 15% is respectable (higher can be acceptable).
Q: Rule of thumb linking CV, n and the width of a 68% CI
A: CI width (%) ≈ $CV/\sqrt n$. E.g., CV 30% and ±5% → n = 36.

## Significance
Q: t-statistic for a coefficient
A: $t = b_1 / SE(b_1)$, df = n − k − 1
Q: Hypotheses for the slope t-test
A: $H_0: \beta_1 = 0$ (no relationship) vs. $H_1: \beta_1 \ne 0$
Q: F-statistic
A: $F = MSR/MSE$
Q: What does the F-test test?
A: Whether the model as a whole is significant ($H_0$: all slope coefficients = 0).
Q: Relationship between t and F in simple (1-variable) regression
A: They give the same result: $F = t^2$.
Q: Decision rule using p-values
A: If p < α (typically 0.05), reject $H_0$: significant.
Q: Definition of p-value (regression)
A: The probability of observing a relationship this strong by chance if the true coefficient were zero.
Q: p-value significance levels
A: < 0.01 highly significant; < 0.05 significant; < 0.10 marginal; ≥ 0.10 not significant.
Q: Order of checks when evaluating a regression
A: F-test (overall) → t-tests (each variable) → residual plot → $R^2$ → SEE/CV.
Q: Correlation vs. causation
A: Correlation is a statistical relationship; causation means X drives Y. Pick drivers by engineering judgment (e.g., ice cream & drownings are both driven by temperature).

## Residuals
Q: Residual definition
A: $e_i = Y_i - \hat Y_i$ (actual − predicted)
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
Q: Prediction interval: what does it bound?
A: The NEXT INDIVIDUAL observation of Y at $X_0$.
Q: Which is wider, CI or PI, and why?
A: The PI. It adds individual residual variation (the "1 +" under the root).
Q: Where are regression intervals narrowest?
A: At $\bar X$. They widen hyperbolically away from it.
Q: SE of mean prediction (CI)
A: $SEE\sqrt{\frac1n + \frac{(X_0-\bar X)^2}{\sum(X_i-\bar X)^2}}$
Q: SE for prediction interval
A: $SEE\sqrt{1 + \frac1n + \frac{(X_0-\bar X)^2}{\sum(X_i-\bar X)^2}}$
Q: Large-sample critical values for 68/95/99% intervals
A: ≈ 1.0, 1.96, 2.58
Q: When to use a CI vs. a PI in cost work
A: CI: average cost of a program type / risk inputs. PI: a specific new item (more conservative).

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

## Multivariate
Q: Meaning of a coefficient in multivariate regression
A: The partial effect of that variable with the others held constant.
Q: Multicollinearity definition
A: High correlation among the independent variables.
Q: Effects of multicollinearity
A: Inflated standard errors, lower t-stats, non-significant or wrong-sign coefficients, unstable estimates.
Q: VIF formula
A: $VIF_j = 1/(1 - R_j^2)$, where $R_j^2$ comes from regressing $X_j$ on the other X's.
Q: VIF thresholds
A: < 5 OK; 5–10 investigate; > 10 severe.
Q: Symptoms of multicollinearity
A: High $R^2$ but few significant t's; unexpected signs; coefficients jump when variables change; high pairwise correlations.
Q: Remedies for multicollinearity
A: Drop one of the correlated variables; combine them into an index; ridge regression; more data.
Q: Minimum data points for regression
A: Absolute minimum k + 2; practical 3k–5k; 30+ desired.

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
`
});
