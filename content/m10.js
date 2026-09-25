PCEA.addModule({
  id: 'm10', num: 10, title: 'Probability and Statistics', short: 'Probability & Statistics', source: 'guide',
  blurb: 'Distributions, hypothesis testing, statistical tests, and confidence intervals. Build on Module 6 descriptive statistics.',
  intro: String.raw`**Probability** quantifies the likelihood of uncertain future outcomes (0 to 1). **Statistics** draws conclusions from sample data about populations. Together they let you:
- Quantify variability and confidence in point estimates.
- Test whether a CER or cost growth factor is statistically significant, not noise.
- Build probability distributions around cost drivers for risk/uncertainty analysis (Module 12).
- Make defensible claims like "80% confident true cost is below \$X."

This module extends Module 6 (descriptive statistics: mean, median, mode, CV) into **inferential statistics** and hypothesis testing.`,
  sections: [
    {
      id: 'intro', title: 'Introduction and definitions', summary: 'Probability vs. statistics; population vs. sample; random variables; parameters vs. statistics',
      body: String.raw`### Core definitions

**Probability** is mathematics describing likelihood of events (0 = impossible, 1 = certain). **Statistics** infers what populations look like from sample data (the inverse problem).

| Term | Meaning |
|---|---|
| **Population** | The entire set of items/values of interest (all historical programs) |
| **Sample** | A subset actually observed (the programs we have data for) |
| **Random variable** | A quantity whose value is uncertain (next year's cost; number of defects) |
| **Discrete** | Countable outcomes (defects per batch: 0, 1, 2, ...) |
| **Continuous** | Any value in a range (cost, weight, time) |
| **Probability Distribution** | A function describing likelihood of each possible value |
| **Parameter** | A numerical characteristic of a population ($\mu$, $\sigma$) — usually unknown |
| **Statistic** | A number computed from sample data ($\bar x$, $s$) — estimates a parameter |
| **Independence** | Occurrence of one event doesn't change probability of another |

+++

### Role in cost estimating

- **Probability**: Model input uncertainty, build S-curves, simulate total program cost.
- **Statistics**: Are CER coefficients significant? How wide are confidence intervals? Do data fit a lognormal distribution?

Taken together: estimate confidently with risk quantified.

:::check
Q: Which is a population parameter and which is a sample statistic?
- μ (sample statistic); $\bar x$ (population parameter)
* μ (population parameter); $\bar x$ (sample statistic)
- Both are parameters
> Parameters describe the (usually unknown) population; statistics are computed from the observed sample and used to estimate parameters.
:::

+++

### Quick link to Module 6

**Module 6 covered**: mean, median, mode; standard deviation; coefficient of variation (CV). Module 10 assumes you know these cold and builds the probability framework around them. (Mean becomes "expected value" of a random variable; standard deviation becomes the "scale" of a distribution; CV becomes a key parameter for lognormal distributions.)

:::check
Q: For a symmetric distribution like the normal, how do mean, median, and mode relate?
* They are equal
- Mean > Median > Mode
- Mode > Median > Mean
> Symmetry means all three measures of center coincide.
:::
`
    },
    {
      id: 'distributions-basic', title: 'Types of distributions', summary: 'Normal, t, lognormal, beta, triangular, Bernoulli: when and why to use each',
      body: String.raw`### Normal Distribution

**Shape**: Symmetric, bell-shaped, defined by mean $\mu$ and standard deviation $\sigma$.

**Empirical Rule** (68–95–99.7):
- $\mu \pm 1\sigma$: 68.3% of outcomes
- $\mu \pm 2\sigma$: 95.4% of outcomes
- $\mu \pm 3\sigma$: 99.7% of outcomes

**Standardize with z-score** to look up probabilities in a standard table:
$$z = \frac{x - \mu}{\sigma}$$

**When used**: Sums of many independent random elements; CER residuals; sums of cost drivers tend toward normal via the Central Limit Theorem.

**Limitation**: Allows negative values. For cost (which is never negative), use lognormal instead.

:::check
Q: A cost element has $\mu = 100$, $\sigma = 15$. What is the z-score for $x = 130$?
= 2
> $(130 - 100)/15 = 2$, so about 97.5% of outcomes are at or below it (from the empirical rule, $2\sigma$ is the 97.7% mark).
:::

+++

### Student's t-Distribution

**Shape**: Like normal but with **fatter tails**, reflecting extra uncertainty when you estimate $\sigma$ from a small sample.

**When used**: Whenever $\sigma$ is unknown and estimated as $s$ from a small sample (the typical cost data situation).

**Convergence**: As sample size $n$ grows, t approaches the normal (at df > ~30, very close).

Formula for test statistic:
$$t = \frac{\bar x - \mu_0}{s/\sqrt n} \quad (df = n-1)$$

:::key
Use **t when $\sigma$ is estimated from data** (standard in cost estimating). Use z only when $\sigma$ is *known* in advance (rare).
:::

+++

### Lognormal Distribution

**Definition**: $X$ is lognormal if $\ln X$ is normally distributed. Equivalently, $X = e^Y$ where $Y \sim N(\mu, \sigma^2)$.

**Key properties**:
- **Always positive** (cannot be negative, unlike normal).
- **Right-skewed** (long tail to the right), so **Mean > Median > Mode**.
- **Median** $= e^{\mu}$
- **Mean** $= e^{\mu + \sigma^2/2}$
- **Mode** $= e^{\mu - \sigma^2}$

**Why it fits cost**: Cost is bounded at zero and grows multiplicatively (e.g., "cost is 50% over" is easier than "50% under zero"). Log-space CER errors produce lognormal distributions.

:::check
Q: If $\ln(\text{cost})$ is normal with $\mu = 4$, $\sigma = 0.5$, what is the median cost?
= 54.6 ±0.1
> Median $= e^4 = 54.598...$ ≈ 54.6. The mean is higher: $e^{4.125} = 61.9$.
:::

+++

### Triangular Distribution

**Defined by** three parameters: low ($a$), most likely ($m$), high ($b$). Useful for **expert elicitation** (you only need three numbers).

**Mean**: $\displaystyle \frac{a + m + b}{3}$

**Worked example**: $a = 80K$, $m = 100K$, $b = 150K$ → Mean $= 330/3 = 110K$.

### Beta (PERT) Distribution

**Bounded** on $[a, b]$; flexible shape (can be skewed either direction). More complex than triangular.

**PERT approximations**:
- Mean $\approx \dfrac{a + 4m + b}{6}$
- SD $\approx \dfrac{b - a}{6}$

:::check
Q: PERT: low 10, most likely 16, high 28. What is the mean?
= 17
> $(10 + 4 \times 16 + 28) / 6 = 102 / 6 = 17$
:::

+++

### Bernoulli Distribution

**Definition**: Single trial, two outcomes: success (1) with probability $p$, failure (0) with probability $1-p$.

- **Mean**: $E(X) = p$
- **Variance**: $Var(X) = p(1-p)$

**Use in cost risk**: Model binary events (technology matures: yes/no) and as a building block for risk models.

:::check
Q: A risk event has probability $p = 0.2$. What is its variance as a Bernoulli variable?
= 0.16
> $0.2 \times 0.8 = 0.16$
:::

+++

### How distributions relate

- **Binomial** = sum of $n$ independent Bernoulli trials
- **Normal** = limiting form of many distributions (Central Limit Theorem)
- **t** → **Normal** as df → ∞
- **Lognormal** = exponential transform of Normal
- **Triangular** and **Beta** both model bounded three-point estimates; Beta is more flexible but harder to fit

See the distribution explorer to watch mean, median, mode separate as skew changes:

:::widget dist:::

:::challenge dist d=logn p1=40 p2=50
Q: For this lognormal, in what order do the mean, median and mode fall?
* mode < median < mean
- mean < median < mode
- All three are equal
> The lognormal is right-skewed: the long upper tail pulls the mean above the median, and the peak (mode) sits lowest. That's the usual shape of cost data.
:::
`
    },
    {
      id: 'correlation', title: 'Covariance and correlation', summary: 'How random variables move together; variance of sums',
      body: String.raw`### Covariance

Measures how two random variables move together:
$$Cov(X,Y) = \frac{\sum(x_i - \bar x)(y_i - \bar y)}{n-1}$$

- **Positive**: variables tend to move in the same direction
- **Negative**: variables tend to move in opposite directions
- **Limitation**: Units are (unit of X) × (unit of Y), so hard to interpret on its own

### Correlation coefficient

Standardizes covariance to $[-1, +1]$:
$$r = \frac{Cov(X,Y)}{s_X \, s_Y}$$

| Value | Meaning |
|---|---|
| $r = +1$ | Perfect positive linear relationship |
| $r = 0$ | No linear relationship |
| $r = -1$ | Perfect negative linear relationship |

Note: $r^2 = R^2$ (coefficient of determination from regression).

+++

### Variance of sums (the critical formula)

$$Var(X + Y) = \sigma_X^2 + \sigma_Y^2 + 2\rho\sigma_X\sigma_Y$$

where $\rho$ is the correlation coefficient.

**Key insight**: Positive correlation **increases** the variance of the total. Ignoring correlation in a cost roll-up **understates risk**.

Special case: If $\rho = 1$ (perfect correlation), $Var(X + Y) = (\sigma_X + \sigma_Y)^2$, so the standard deviations add directly: $SD(X+Y) = \sigma_X + \sigma_Y$.

:::check
Q: $\sigma_X = 3$, $\sigma_Y = 4$, $\rho = 0.5$. What is $Var(X + Y)$?
= 37
> $9 + 16 + 2(0.5)(3)(4) = 9 + 16 + 12 = 37$ (SD ≈ 6.08). With $\rho = 0$ it would be 25 (SD 5).
:::

:::check
Q: If X and Y are perfectly correlated ($\rho = 1$), the SD of the sum equals…
* $\sigma_X + \sigma_Y$
- $\sqrt{\sigma_X^2 + \sigma_Y^2}$
- $\sigma_X \sigma_Y$
> With $\rho = 1$ the variance is $(\sigma_X + \sigma_Y)^2$, so the SDs add directly.
:::
`
    },
    {
      id: 'hypothesis', title: 'Hypothesis testing framework', summary: '$H_0$, $H_a$, significance level, test statistics, critical values, error types',
      body: String.raw`### The five-step framework

1. State $H_0$ (null: default claim, usually "no effect" or "equal to") and $H_a$ (alternative).
2. Choose significance level $\alpha$ (commonly 0.05; sometimes 0.10 or 0.01).
3. Compute the **test statistic** from the sample.
4. Compare to the **critical value** from a table (or compare **p-value** to $\alpha$).
5. **Reject** $H_0$ if the statistic is beyond the critical value ($p < \alpha$); otherwise **fail to reject**.

The test never *proves* $H_0$ true — it either rejects it or doesn't.

+++

### One-tailed vs. two-tailed

| | $H_0$ | $H_a$ | Rejection region |
|---|---|---|---|
| **Two-tailed** | $\mu = \mu_0$ | $\mu \neq \mu_0$ | Both tails; critical value larger in magnitude |
| **One-tailed** | $\mu = \mu_0$ | $\mu > \mu_0$ (or <) | One tail; critical value smaller; easier to reject |

**Rule**: Use two-tailed unless the question is directional (e.g., "is the new process cheaper?" → one-tailed "less than"; "is the cost different?" → two-tailed "not equal").

:::check
Q: A test asks "Is average unit cost different from \$100K?" (no direction specified). Should this be…
* Two-tailed
- One-tailed
> No direction is given, so test against $H_a: \mu \neq 100$ (two-tailed).
:::

+++

### Error types and power

| | $H_0$ true | $H_0$ false |
|---|---|---|
| **Reject** $H_0$ | **Type I Error** (probability $\alpha$) | Correct (power $= 1-\beta$) |
| **Fail to reject** $H_0$ | Correct | **Type II Error** (probability $\beta$) |

- **Type I error** ($\alpha$) = False positive: reject a true $H_0$.
- **Type II error** ($\beta$) = False negative: fail to reject a false $H_0$.
- **Power** $= 1 - \beta$ = Probability of correctly rejecting a false $H_0$.
- **Trade-off**: Lower $\alpha$ reduces false positives but increases $\beta$ (more false negatives), all else equal. More data ($n$) improves both.

:::check
Q: Rejecting a true null hypothesis is a…
* Type I error
- Type II error
- Power
> Type I = false positive, with probability $\alpha$.
:::

+++

### Test statistic and critical value

**Test statistic** = standardized distance from hypothesized value:
$$\text{Test Stat} = \frac{\text{Sample Statistic} - \text{Hypothesized Value}}{\text{Standard Error}}$$

For a mean with unknown $\sigma$:
$$t = \frac{\bar x - \mu_0}{s/\sqrt n} \quad (df = n-1)$$

**Critical value** from table → threshold. If $|t| >$ critical value (or $p < \alpha$), reject $H_0$.

:::example Worked example
Is average unit cost different from \$100K? $n = 16$, $\bar x = 106$, $s = 12$.
- $t = \dfrac{106-100}{12/\sqrt{16}} = \dfrac{6}{3} = 2.0$
- Two-tailed critical $t(df=15, \alpha=0.05) \approx 2.131$
- $|2.0| < 2.131$ → **fail to reject** $H_0$. The evidence isn't strong enough.
:::

+++

### Confidence intervals

A **confidence interval (CI)** gives a range of plausible values for a population parameter at a stated confidence level (e.g., 95%), instead of a point estimate.

**General form**:
$$\text{CI} = \text{Point Estimate} \pm (\text{Critical Value}) \times (\text{Standard Error})$$

**For a mean with unknown $\sigma$** (t-distribution):
$$\bar x \pm t_{\alpha/2,\,n-1} \cdot \frac{s}{\sqrt n}$$

**Interpretation**: Over repeated sampling, 95% of intervals constructed this way contain the true $\mu$. (NOT: "95% probability this specific interval contains $\mu$.")

**Worked example**: $n = 16$, $\bar x = 50$, $s = 8$, 95% CI, df = 15, $t_{0.025,15} \approx 2.131$.
$$\text{Margin of Error} = 2.131 \times \frac{8}{4} = 4.262$$
$$\text{CI} = 50 \pm 4.262 = (45.74, \; 54.26)$$

:::check
Q: n = 25, $\bar x = 52$, s = 10. What is the standard error of $\bar x$?
= 2
> $s/\sqrt n = 10/5 = 2$. A 95% CI is about $52 \pm (t_{0.025,24}) \times 2 \approx 52 \pm 4.1$.
:::

:::challenge ci-sim n=5 level=0.95 method=z lock=n,level,method
Q: Each of 1,000 samples of size 5 gets a "95%" interval built with $z = 1.96$ and the sample $s$. Predict what share of them actually contain $\mu$. Type it with a % sign.
predict: coverage +- 0.04
> Only about 88% do. With small $n$, $s$ is itself uncertain, and $z$ ignores that. The $t$ distribution with $n - 1$ df has fatter tails ($t = 2.78$ for 4 df), which restores 95% coverage.
:::

:::challenge ci-sim n=5 level=0.95 method=z lock=n,level
Q: Keep $n = 5$. Change one setting so the intervals really do cover $\mu$ about 95% of the time (at least 94%).
goal: coverage >= 0.94
show: method=t
> Switching to $t$ widens every interval by $2.78 / 1.96$ at 4 df. That's enough to account for estimating $\sigma$ with $s$. As $n$ grows, $t$ approaches $z$ and the difference fades.
:::
`
    },
    {
      id: 'tests', title: 'Statistical tests', summary: 't-tests, chi-squared, F-tests, Kolmogorov-Smirnov',
      body: String.raw`### t-tests

**One-sample t**: Tests if sample mean differs from a hypothesized value.
$$t = \frac{\bar x - \mu_0}{s/\sqrt n}$$

**Two-sample t**: Tests if means of two independent samples differ.
$$t = \frac{\bar x_1 - \bar x_2}{\sqrt{s_1^2/n_1 + s_2^2/n_2}}$$

**Paired t**: When observations are matched (e.g., before/after), test the mean of the differences.

**In regression** (Module 8/9): $t = \hat{\beta}/s_{\hat{\beta}}$ tests whether a CER slope is significantly different from zero.

:::check
Q: A sample of $n = 25$ has $\bar x = 52$ and $s = 10$. Test statistic against $\mu_0 = 50$?
= 1
> $t = (52 - 50)/(10/\sqrt{25}) = 2/2 = 1.0$
:::

+++

### Chi-Squared ($\chi^2$) Tests

**Goodness-of-fit**: Do observed frequencies match expected frequencies under a hypothesized distribution?
$$\chi^2 = \sum \frac{(O_i - E_i)^2}{E_i}$$

**Test of independence**: Do two categorical variables relate (e.g., contract type vs. overrun)?

**Degrees of freedom**: Goodness-of-fit: $df = k - 1$ (k = categories); independence: $df = (r-1)(c-1)$.

**Worked example**: Observed overruns across 4 program types: O = {20, 15, 25, 10}; expected (equal likelihood, total 70) E = {17.5, 17.5, 17.5, 17.5}.
$$\chi^2 = \frac{(20-17.5)^2}{17.5} + \frac{(15-17.5)^2}{17.5} + \frac{(25-17.5)^2}{17.5} + \frac{(10-17.5)^2}{17.5} = 7.14$$
With $df = 3$, critical $\chi^2_{0.05,3} \approx 7.815$. Since $7.14 < 7.815$, fail to reject $H_0$.

:::check
Q: Observed {30, 25, 20, 25}; expected (equal, total 100) {25, 25, 25, 25}. Calculate $\chi^2$.
= 2
> $(30-25)^2/25 + (25-25)^2/25 + (20-25)^2/25 + (25-25)^2/25 = 25/25 + 0 + 25/25 + 0 = 2.0$
:::

+++

### F-tests

**For comparing two variances**:
$$F = \frac{s_1^2}{s_2^2} \quad \text{(larger variance in numerator)}$$

**In regression** (Module 8/9): $F = \text{MSR}/\text{MSE}$ tests overall significance (do the independent variables jointly explain variation?).

The F-distribution is always right-skewed and non-negative (ratio of two squared quantities).

**Degrees of freedom**: Two values needed — numerator df and denominator df.

:::check
Q: Two datasets have variances $s_1^2 = 64$ and $s_2^2 = 16$. Calculate the F-statistic.
= 4
> $F = 64/16 = 4.0$
:::

+++

### Kolmogorov-Smirnov (K-S) Test

A **goodness-of-fit test** comparing the empirical CDF (observed data) to a theoretical CDF (e.g., lognormal).

$$D = \max |F_{\text{empirical}}(x) - F_{\text{theoretical}}(x)|$$

Works directly on continuous data without binning (unlike chi-square). More powerful for continuous distributions.

**Use in cost estimating**: Check whether cost growth data or CER residuals fit a normal or lognormal distribution before building a risk model.

:::check
Q: The Kolmogorov-Smirnov test compares…
- Means of two samples
* Empirical CDF to a theoretical CDF
- Observed and expected frequencies in bins
> K-S uses the maximum vertical distance between the empirical and theoretical CDFs.
:::
`
    },
    {
      id: 'montecarlo', title: 'Monte Carlo and simulation', summary: 'Sampling from distributions, inverse CDF, why MC works',
      body: String.raw`### Monte Carlo simulation

**Procedure**:
1. Define uncertain inputs (e.g., labor cost, material cost) and their probability distributions (normal, lognormal, triangular).
2. Sample each input independently, thousands of times, from its distribution.
3. Compute the output (total program cost) for each trial.
4. The collection of outputs approximates the output distribution: mean, percentiles, S-curve.

**Accuracy**: Error shrinks like $1/\sqrt{N}$ — to cut error in half, need 4× more trials.

**Use in cost risk** (Module 12): Build a probability distribution for total cost to answer "what's the confidence level at \$X?" or "what's the cost at the 80th percentile?"

+++

### Inverse CDF technique

How to sample a random value from any distribution:
1. Draw $u \sim \text{Uniform}(0,1)$ (what random-number generators give you).
2. Return $x = F^{-1}(u)$ (apply the inverse CDF).

**Why it works**: The CDF $F$ maps values uniformly to [0, 1]; inverting it maps uniform draws back to your target distribution.

**Example**: Uniform$(a=20, b=60)$. For $u = 0.3$:
$$F^{-1}(u) = 20 + 0.3 \times (60 - 20) = 20 + 12 = 32$$

:::check
Q: Uniform(20, 60), random draw $u = 0.3$. What value does the inverse CDF produce?
= 32
> $F^{-1}(u) = a + u(b-a) = 20 + 0.3 \times 40 = 32$
:::

+++

### Normal vs. lognormal for cost

| | Normal | Lognormal |
|---|---|---|
| **Allows negatives?** | Yes | No (bounded at 0) |
| **Skew** | Symmetric | Right-skewed (Mean > Median > Mode) |
| **Good for cost?** | Only if CV is small | Yes, especially for cost growth |
| **CV limit** | < ~15% | Any, naturally scales by percentage |

**Rule**: Use normal for symmetric data or when CV < 15%. Use lognormal for cost, especially with large CV or when errors are multiplicative (log-space CERs).

:::check
Q: Why is lognormal often preferred to normal for modeling total program cost?
* Cost is bounded below zero and tends to be right-skewed
- It is symmetric like cost growth
- It has lighter tails than normal
> A lognormal is positive, right-skewed, and fits multiplicative (percentage) growth, matching typical cost behavior.
:::

+++

### Bivariate normal

The joint distribution of two correlated normal random variables, characterized by $\mu_X$, $\mu_Y$, $\sigma_X$, $\sigma_Y$, and correlation $\rho$. Regression can be viewed as the conditional mean of Y given X under a bivariate normal model.

+++

Related topics: Additional distributions (uniform, exponential, Poisson) and advanced tests (Anderson-Darling, Shapiro-Wilk for normality) are available for specialized situations but are outside the core exam scope. Prioritize the main distributions and tests above.
`
    },
    {
      id: 'practice', title: 'Common pitfalls and practice', summary: 'Error types, what to memorize, worked examples',
      body: String.raw`### Top pitfalls to avoid

1. **Confusing z and t**: Use t when $\sigma$ is estimated from the sample (almost always in cost). Use z only when $\sigma$ is known in advance (rare).
2. **Misinterpreting CIs**: A 95% CI does NOT mean "95% probability the true value is in this interval." It means over repeated sampling, 95% of such intervals contain the true value.
3. **Misreading p-values**: p-value is the probability of the observed (or more extreme) data, *given* $H_0$ is true. It is NOT the probability $H_0$ is true.
4. **One-tail vs. two-tail confusion**: Use one-tail only if the question is directional; two-tail is the conservative default.
5. **Ignoring Type I / Type II trade-off**: Lower $\alpha$ reduces false positives but increases false negatives. More data ($n$) improves both.
6. **Wrong degrees of freedom**: Always use $df = n-1$ for a single sample; confirm the correct df before consulting tables.
7. **Assuming normality without checking**: Use goodness-of-fit tests (K-S, chi-square) or lognormal if data is skewed. Do not assume normal.
8. **Ignoring correlation in cost rolls**: Positive correlation between cost elements increases total variance beyond the simple sum.

+++

### What to memorize cold

- **Z-score**: $z = (x - \mu)/\sigma$
- **Empirical rule**: 68/95/99.7% within ±1/±2/±3σ
- **t-statistic**: $t = (\bar x - \mu_0)/(s/\sqrt n)$, $df = n-1$
- **CI formula**: Point estimate ± (critical value × standard error)
- **Type I = $\alpha$** (reject true $H_0$); **Type II = $\beta$** (fail to reject false $H_0$)
- **One-tail vs. two-tail**: Directional → one-tail; "different" → two-tail
- **Which distribution when**:
  - Normal: symmetric, unbounded
  - Lognormal: right-skewed, positive, good for cost
  - Triangular: three-point expert estimate
  - Beta: flexible bounded distribution
  - Bernoulli: binary event (occur/don't)
  - t: small-sample mean inference
- **Chi-square**: $\chi^2 = \sum (O_i - E_i)^2 / E_i$ for categorical/goodness-of-fit
- **F-test**: Variance ratio; also overall regression significance
- **K-S**: Max distance between empirical and theoretical CDF
- **Triangular mean**: $(a + m + b)/3$
- **Variance of sum**: $\sigma_X^2 + \sigma_Y^2 + 2\rho\sigma_X\sigma_Y$

+++

### Sample calculations

**Example 1**: Cost element, $\mu = 200$, $\sigma = 25$. Probability it exceeds $237.5$?
- $z = (237.5 - 200)/25 = 1.50$
- From z-table: $P(Z < 1.50) = 0.9332$
- $P(X > 237.5) = 1 - 0.9332 = 6.68\%$

**Example 2**: Sample $n = 9$, $\bar x = 120$, $s = 15$. Is the mean significantly different from 105 at $\alpha = 0.05$?
- $t = (120 - 105)/(15/\sqrt 9) = 15/5 = 3.0$
- Critical (two-tailed, df = 8): $t_{0.025,8} = 2.306$
- $|3.0| > 2.306$ → **reject** $H_0$. Significant difference.

**Example 3**: Three-point estimate: min = 60K, most likely = 75K, max = 105K. Mean?
- Triangular: $(60 + 75 + 105)/3 = 240/3 = 80K$

:::check
Q: Which correctly interprets a 95% confidence interval?
- 95% probability the true mean lies in this interval
* Over repeated sampling, 95% of such intervals contain the true mean
- The interval will contain the true mean 95 times out of 100
> The CI is a statement about the procedure (repeated sampling), not this specific interval.
:::

+++

### Central Limit Theorem (bonus insight)

The distribution of sample means approaches normal as $n$ grows, *regardless of the underlying distribution shape*. This is why t-tests and normal-based CI formulas work even when individual data points are skewed — we are testing the mean, not the individual points. Sample means are more normal than the data itself.
`
    }
  ],
  cards: String.raw`
## Fundamentals
Q: Probability vs. Statistics in one sentence each
A: Probability: likelihood of future/uncertain events. Statistics: drawing conclusions from sample data about populations.
Q: Population vs. sample
A: Population: entire set of interest (all programs); Sample: subset actually observed (programs with data).
Q: Parameter vs. statistic
A: Parameter: a characteristic of the population ($\mu$, $\sigma$) — unknown. Statistic: computed from sample ($\bar x$, $s$) — estimates the parameter.
Q: Role of probability in cost estimating
A: Model input uncertainty, build probability distributions for risk analysis, simulate total program cost via Monte Carlo.
Q: Role of statistics in cost estimating
A: Test whether CER coefficients and growth factors are statistically significant; quantify confidence in estimates via intervals.
Q: Random variable definition
A: A quantity whose value is uncertain (e.g., next year's cost, number of defects).
Q: Discrete vs. continuous random variable
A: Discrete: countable outcomes (0, 1, 2, ...); Continuous: any value in a range.
Q: PDF vs. CDF
A: PDF (probability density function): relative likelihood of each value (area under = 1). CDF (cumulative): $P(X \le x)$, runs 0 to 1.
Q: Independence of events
A: Occurrence of one event does not change the probability of another.

## Normal Distribution
Q: Normal distribution: % within 1, 2, 3 σ
A: 68.3%, 95.4%, 99.7%
Q: z-score formula
A: $z = (x - \mu)/\sigma$
Q: What does z-score measure?
A: How many standard deviations a value is from the mean (standardized distance).
Q: Interpretation of $z = 1.5$ from a z-table with $P(Z < 1.5) = 0.9332$
A: About 93.32% of outcomes fall below that value; 6.68% exceed it.
Q: When is normal distribution appropriate for cost?
A: When CV is small (< ~15%) or data is symmetric; otherwise use lognormal.
Q: Can normal distribution be negative?
A: Yes, which is unrealistic for cost; lognormal is better for cost modeling.

## t-Distribution
Q: t-distribution vs. normal
A: t has fatter tails (extra uncertainty from estimating σ with small-sample s); converges to normal as df → ∞.
Q: When to use t-distribution
A: Whenever σ is unknown and estimated from a small sample (the typical cost data case).
Q: Degrees of freedom for a one-sample t-test
A: df = n − 1
Q: When to use z vs. t
A: z: when σ is *known* (rare). t: when σ is *estimated* from data (standard in cost work).
Q: One-sample t-statistic formula
A: $t = (\bar x - \mu_0)/(s/\sqrt n)$, df = n − 1
Q: Two-sample t-statistic formula
A: $t = (\bar x_1 - \bar x_2)/\sqrt{s_1^2/n_1 + s_2^2/n_2}$

## Lognormal Distribution
Q: Definition: X is lognormal if…
A: ln(X) is normally distributed.
Q: Lognormal key properties
A: Always positive; right-skewed; Mean > Median > Mode.
Q: Lognormal median formula
A: $e^{\mu}$ (where μ is the mean of ln(X))
Q: Lognormal mean formula
A: $e^{\mu + \sigma^2/2}$ (always > median)
Q: Lognormal mode formula
A: $e^{\mu - \sigma^2}$ (always < median)
Q: Why lognormal fits cost data
A: Cost is bounded at zero and grows multiplicatively (50% over is easier than 50% under zero); log-space CER errors produce lognormal.
Q: Normal vs. lognormal: which for cost?
A: Lognormal, especially for cost growth and large CV; normal only if CV < ~15% and data is symmetric.

## Distributions: Triangular, Beta, Bernoulli
Q: Triangular distribution: defined by
A: Three parameters: low (a), most likely (m), high (b).
Q: Triangular distribution mean
A: $(a + m + b)/3$
Q: Triangular distribution variance formula
A: $(a^2 + b^2 + c^2 - ab - ac - bc)/18$
Q: When is triangular used in cost estimating?
A: Expert elicitation: only three intuitive inputs needed (best/worst/most likely).
Q: Beta (PERT) distribution: key property
A: Flexible, bounded on [a, b]; can be skewed either direction.
Q: PERT mean approximation
A: $(a + 4m + b)/6$
Q: PERT standard deviation approximation
A: $(b - a)/6$
Q: Bernoulli distribution: two outcomes
A: Success (1) with probability p; failure (0) with probability 1 − p.
Q: Bernoulli mean and variance
A: Mean = p; Variance = p(1 − p)
Q: Bernoulli use in cost risk
A: Models binary risk events (technology matures: yes/no).
Q: Relationships between distributions
A: Binomial = sum of n Bernoulli trials; Normal = limit of many distributions (CLT); t → Normal as df → ∞; Lognormal = exp(Normal).

## Covariance and Correlation
Q: Covariance formula
A: $Cov(X,Y) = \sum(x_i - \bar x)(y_i - \bar y) / (n-1)$
Q: Correlation coefficient formula
A: $r = Cov(X,Y) / (s_X \sigma_Y)$, range [−1, +1]
Q: Interpretation of r = +1, 0, −1
A: +1: perfect positive relationship; 0: no linear relationship; −1: perfect negative relationship.
Q: Relationship between r and R²
A: $R^2 = r^2$ (coefficient of determination in regression).
Q: Variance of a sum of two random variables
A: $\sigma_X^2 + \sigma_Y^2 + 2\rho\sigma_X\sigma_Y$
Q: Effect of positive correlation on the variance of a sum
A: Increases it (beyond the sum of individual variances).
Q: Cost risk modeling: importance of correlation
A: Ignoring positive correlation between cost elements *understates* total program risk.
Q: SD of sum when ρ = 1 (perfect correlation)
A: $\sigma_X + \sigma_Y$ (the SDs add directly, not in quadrature).

## Hypothesis Testing
Q: Null hypothesis definition
A: Default claim, typically "no effect" or "equal to"; denoted H₀.
Q: Alternative hypothesis definition
A: The claim being tested for; denoted H_a or H₁.
Q: Significance level α definition
A: Pre-set threshold for probability of rejecting H₀ when it is true (Type I error).
Q: Common significance levels
A: α = 0.10, 0.05, 0.01 (lower = more conservative)
Q: p-value definition
A: Probability of observing the data (or more extreme), *given* H₀ is true.
Q: Decision rule: reject H₀ when
A: The test statistic falls beyond the critical value (or p < α)
Q: Type I error definition
A: Rejecting H₀ when H₀ is actually true (false positive); probability = α.
Q: Type II error definition
A: Failing to reject H₀ when H₀ is actually false (false negative); probability = β.
Q: Power of a test
A: 1 − β: probability of correctly rejecting a false H₀.
Q: Trade-off between Type I and Type II error
A: Lowering α reduces Type I but increases Type II (all else equal); more data improves both.
Q: Two-tailed test: when and why
A: When H_a is "different" (no direction specified, e.g., $\mu \ne \mu_0$); rejection region split between both tails.
Q: One-tailed test: when and why
A: When H_a is directional (e.g., $\mu > \mu_0$); all rejection region in one tail; easier to reject H₀ at same α.
Q: Test statistic general form
A: (Sample Statistic − Hypothesized Value) / Standard Error
Q: What is the critical value?
A: Threshold from a statistical table (z, t, χ², F) that separates fail-to-reject from reject regions.
Q: Interpretation: fail to reject H₀
A: The data do not provide enough evidence to reject H₀; does NOT prove H₀ true.

## Confidence Intervals
Q: Confidence interval definition
A: A range of plausible values for a population parameter at a stated confidence level (e.g., 95%).
Q: General CI formula
A: Point Estimate ± (Critical Value) × (Standard Error)
Q: CI for a mean (σ unknown, t-distribution)
A: $\bar x \pm t_{\alpha/2,n-1} \times (s/\sqrt n)$
Q: CI for a mean (σ known, z-distribution)
A: $\bar x \pm z_{\alpha/2} \times (\sigma/\sqrt n)$
Q: Correct interpretation of a 95% CI
A: Over repeated sampling, 95% of such intervals contain the true parameter.
Q: Relationship between CI and two-tailed test
A: If μ₀ falls outside a (1−α) CI, a two-tailed test at α would reject H₀: μ = μ₀.
Q: CI width increases with…
A: Higher confidence level, more variability (larger s), smaller sample size.
Q: CI width decreases with…
A: Lower confidence level, less variability, larger sample size.

## Statistical Tests
Q: t-test uses
A: Test means (one-sample, two-sample, paired) and regression coefficients.
Q: Chi-squared test uses
A: Categorical data, goodness-of-fit, independence, variance tests.
Q: Chi-squared goodness-of-fit formula
A: $\chi^2 = \sum (O_i - E_i)^2 / E_i$ (observed vs. expected frequencies)
Q: Chi-squared degrees of freedom: goodness-of-fit
A: df = k − 1 (k = number of categories)
Q: Chi-squared degrees of freedom: test of independence
A: df = (r − 1)(c − 1) (r rows, c columns)
Q: F-test uses
A: Compare two variances; test overall regression significance.
Q: F-statistic formula
A: $F = s_1^2 / s_2^2$ (larger variance in numerator)
Q: F-distribution shape
A: Always right-skewed, non-negative (ratio of two squared quantities).
Q: Kolmogorov-Smirnov (K-S) test
A: Goodness-of-fit test comparing empirical CDF to theoretical CDF.
Q: K-S test statistic
A: $D = \max |F_{\text{empirical}}(x) - F_{\text{theoretical}}(x)|$ (maximum vertical distance)
Q: K-S advantage over chi-squared
A: Works on continuous data directly without binning; generally more powerful.
Q: K-S use in cost estimating
A: Check whether historical cost/growth data or CER residuals fit normal/lognormal before risk modeling.

## Monte Carlo and Simulation
Q: Monte Carlo simulation: basic procedure
A: 1. Define distributions for uncertain inputs. 2. Sample each, thousands of times. 3. Compute outputs. 4. Analyze the output distribution.
Q: Monte Carlo accuracy: how does error shrink?
A: Error ∝ $1/\sqrt N$ (to cut error in half, need 4× trials)
Q: Inverse CDF technique: basic steps
A: 1. Draw u ~ Uniform(0,1). 2. Return x = F⁻¹(u).
Q: Why inverse CDF technique works
A: CDF F maps values uniformly to [0,1]; inverting maps uniform draws back to the target distribution.
Q: Inverse CDF for Uniform(a, b)
A: $F^{-1}(u) = a + u(b - a)$
Q: Normal vs. lognormal for modeling cost
A: Lognormal: positive, right-skewed, fits cost growth (especially large CV). Normal: symmetric, allows negatives (only if CV < ~15%).
Q: Bivariate normal distribution
A: Joint distribution of two correlated normal variables, characterized by two means, two SDs, and correlation ρ.

## Formula Reference
Q: Triangular mean formula
A: $(a + m + b)/3$
Q: PERT approximations
A: Mean ≈ $(a + 4m + b)/6$; SD ≈ $(b − a)/6$
Q: Bernoulli variance
A: $p(1 - p)$
Q: Standard error of the mean
A: $s/\sqrt n$ (or $\sigma/\sqrt n$ if σ known)
Q: Variance of sum of two correlated variables
A: $\sigma_X^2 + \sigma_Y^2 + 2\rho\sigma_X\sigma_Y$
`
});
