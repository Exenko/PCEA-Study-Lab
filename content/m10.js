PCEA.addModule({
  id: 'm10', num: 10, title: 'Probability and Statistics', short: 'Probability & Statistics', source: 'guide',
  blurb: 'Distributions, hypothesis testing, statistical tests, and confidence intervals. Build on Module 6 descriptive statistics.',
  intro: String.raw`**Probability** quantifies the likelihood of uncertain future outcomes (0 to 1). **Statistics** draws conclusions from sample data about populations. Together they let you:
- Quantify variability and confidence in point estimates.
- Test whether a CER or cost growth factor is statistically significant, not noise.
- Build probability distributions around cost drivers for risk/uncertainty analysis (Module 12).
- Make defensible claims like "80% confident true cost is below \$X."

This module extends Module 6 (descriptive statistics: mean, median, mode, CV) into **inferential statistics** and hypothesis testing — and, unlike CV in Module 6, teaches the coefficient of variation's role in distribution choice directly (Measures of Dispersion, below).`,
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
      body: String.raw`### PDF and CDF

The **PDF** (Probability Density Function) is the curve itself: probability is the *area* under it between two points, and the total area is 1. The **CDF** (Cumulative Distribution Function) is $P(X \le x)$ — it runs from 0 up to 1 and gives percentiles directly.

**Worked example**: A continuous distribution's CDF reads $F(5) = 0.18$ and $F(10) = 0.58$. Then:
$$P(5 < x < 10) = F(10) - F(5) = 0.58 - 0.18 = 0.40$$

**Key implication for cost estimating**: the probability that the actual cost exactly equals the point estimate is nil (a single point under a continuous PDF has zero area). Instead, ask what the probability is that actual cost falls within 5%, 10%, or 15% of the estimate.

:::check
Q: A cost distribution's CDF gives $F(20) = 0.20$ and $F(50) = 0.75$. What is $P(20 < x < 50)$?
= 0.55 ±0.01
> $F(50) - F(20) = 0.75 - 0.20 = 0.55$.
:::

+++

### Dice example (running example for this module)

Rolling two dice, the sum ranges from 2 to 12. Its **mean** is 7 and its **variance** is 5.83 (computed from the full discrete distribution — not something you need to derive on the exam, just recognize).

+++

### Measures of Dispersion: Coefficient of Variation

$$CV = \frac{\sigma}{\mu}$$

CV is unitless, so it lets you compare dispersion across datasets with different scales. Low CV → data clustered tightly around the mean; high CV → more dispersed, and the mean is a poorer stand-in for the whole distribution (a high CV may also flag outliers — see Module 6).

**Estimate-quality rule**: Cost estimates should have a **CV of less than 15%**. If the CV of a cost dataset exceeds that, consider alternatives to a simple average of historical costs — most often, regression against a cost driver (Module 8), where the regression's own CV (SEE / $\bar y$) is often substantially lower.

**Worked example (Fig. 10.8)**: Two normal distributions share a mean of 10. One has CV = 10% → $\sigma = 0.10 \times 10 = 1$ (tight). The other has CV = 30% → $\sigma = 0.30 \times 10 = 3$ (much more spread out), even though both center on the same value.

:::check
Q: A normal distribution has mean 10 and CV = 30%. What is its standard deviation?
= 3
> $\sigma = CV \times \mu = 0.30 \times 10 = 3$.
:::

:::check
Q: A cost dataset of historical analogous programs has CV = 22%. What should the estimator consider?
* Using regression against a cost driver instead of a simple average — CV exceeds the 15% estimate-quality guideline
- Nothing; 22% is well within tolerance
- Switching immediately to a triangular distribution
> CEBoK's rule of thumb: CV should be under 15% for a simple-average point estimate to be defensible; above that, regression (Module 8) often gives a materially lower CV.
:::

+++

### Normal Distribution

**Shape**: Symmetric, bell-shaped, defined by mean $\mu$ and standard deviation $\sigma$.

**Empirical Rule** (rules for normal distributions):
- $\mu \pm 1\sigma$: 68.3% of outcomes
- $\mu \pm 2\sigma$: 95.5% of outcomes (so 4.5% falls outside)
- $\mu \pm 3\sigma$: 99.7% of outcomes (so 0.3% falls outside)
- $\mu \pm 1.96\sigma$: exactly 95% of outcomes — worth memorizing alongside the three above

**Standardize with z-score** to look up probabilities in a standard table:
$$z = \frac{x - \mu}{\sigma}$$

**When used**: Sums of many independent random elements; CER residuals; sums of cost drivers tend toward normal via the Central Limit Theorem (CLT).

**Limitation**: Allows negative values. For cost (which is never negative), use lognormal instead.

:::check
Q: A cost element has $\mu = 100$, $\sigma = 15$. What is the z-score for $x = 130$?
= 2
> $(130 - 100)/15 = 2$. From a z-table, $P(Z < 2) \approx 0.977$, so about 97.7% of outcomes fall at or below it (the empirical rule's rounded "95.5% within $\pm 2\sigma$" splits to about 97.7%/2.3% per tail).
:::

+++

### Central Limit Theorem (CLT)

The CLT states that the sum of a large number of **independent, identically distributed (iid)** random variables approaches a normal distribution — generally by $n = 30$. Correlation among the summed variables slows convergence slightly but doesn't stop it (as long as no small subset of highly correlated elements dominates the sum).

**Why it matters**: Most cost estimates sum more than 30 WBS elements. If those elements are roughly iid, the CLT says the *top-level* total is normal — even if individual elements are triangular, lognormal, or something else entirely.

**Worked example**: Three triangular distributions with (min, mode, max) of (0.5, 1.0, 3.0), (3.5, 4.5, 7.5), and (6.5, 8.0, 12.0) — all skewed right. Summed together, the result passes a Kolmogorov-Smirnov test for normality. The CLT kicks in fast for sums of triangulars, which matters because many risk models use triangular distributions at the lower WBS levels.

:::widget clt-builder:::

:::check
Q: A WBS sums 35 independent, similarly-scaled cost elements, none dominating the total. What shape should the top-level total roughly follow?
* Approximately normal, by the Central Limit Theorem
- The same shape as the individual elements
- Always triangular
> With n well past 30 and no dominant correlated element, the CLT applies to the sum regardless of the individual elements' shapes.
:::

+++

### Student's t-Distribution

**Shape**: Like normal but with **fatter tails**, reflecting extra uncertainty when you estimate $\sigma$ from a small sample.

**When used**: Whenever $\sigma$ is unknown and estimated as $s$ from a small sample (the typical cost data situation).

**Convergence**: As sample size $n$ grows, t approaches the normal (at df > ~30, very close).

**Formal definition**: the t-distribution is a standard normal divided by the square root of a (scaled) chi-squared:
$$t = \frac{N(0,1)}{\sqrt{\chi^2(n)/n}}$$
where $n$ is the degrees of freedom. Mean = 0, variance = $n/(n-2)$.

Formula for the applied test statistic (mean, $\sigma$ unknown):
$$t = \frac{\bar x - \mu_0}{s/\sqrt n} \quad (df = n-1)$$

:::key
Use **t when $\sigma$ is estimated from data** (standard in cost estimating). Use z only when $\sigma$ is *known* in advance (rare).
:::

+++

### Lognormal Distribution

**Definition**: $X$ is lognormal if $\ln X$ is normally distributed. Equivalently, $X = e^Y$ where $Y \sim N(\mu, \sigma^2)$.

**Key properties**:
- **Always positive** (cannot be negative, unlike normal) — support is $x \in [0, \infty)$.
- **Right-skewed** (long tail to the right), so **Mean > Median > Mode**.
- **Mean** $= e^{\mu + \sigma^2/2}$ (this formula is in CEBoK's core text)

**Why it fits cost**: Cost is bounded at zero and grows multiplicatively (e.g., "cost is 50% over" is easier than "50% under zero"). Log-space CER errors produce lognormal distributions.

:::tip Beyond CEBoK: median and mode formulas
CEBoK gives the lognormal mean formula but not median/mode formulas directly. Standard results (used here for the worked examples):
- **Median** $= e^{\mu}$
- **Mode** $= e^{\mu - \sigma^2}$
:::

:::check
Q: If $\ln(\text{cost})$ is normal with $\mu = 4$, $\sigma = 0.5$, what is the median cost?
= 54.6 ±0.1
> Median $= e^4 = 54.598...$ ≈ 54.6. The mean is higher: $e^{4.125} = 61.9$.
:::

+++

### Triangular Distribution

**Defined by** three parameters: low ($a$), most likely/mode ($c$), high ($b$). Useful for **expert elicitation** (you only need three numbers).

**Mean**: $\displaystyle \frac{a + c + b}{3}$

**Variance**: $\displaystyle \frac{a^2+b^2+c^2-ab-ac-bc}{18}$

**Worked example**: $a = 80K$, $c = 100K$, $b = 150K$ → Mean $= 330/3 = 110K$.

**Note**: the mode of a *sum* of triangular distributions is not the sum of the individual modes — see Module 9 for the full treatment of why "most likely" values don't add.

:::tip Beyond CEBoK: PERT approximations
CEBoK's core text covers the triangular distribution in depth but not PERT formulas; these approximations are standard practice for the Beta/PERT distribution as an alternative to triangular:
- Mean $\approx \dfrac{a + 4m + b}{6}$
- SD $\approx \dfrac{b - a}{6}$
:::

### Beta (PERT) Distribution

**Bounded** on $[a, b]$; shape set by two positive shaping parameters ($\alpha,\beta$), mean $= \alpha/(\alpha+\beta)$; can be skewed either direction. Used in schedule risk analysis and in PERT/critical-path methods. A Beta(1,1) is identical to a Uniform(0,1).

:::check
Q: PERT: low 10, most likely 16, high 28. Using the PERT approximation, what is the mean?
= 17
> $(10 + 4 \times 16 + 28) / 6 = 102 / 6 = 17$ (a Beyond-CEBoK approximation, not the exact Beta formula).
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

### F-Distribution

**Definition**: the ratio of two chi-squared random variables, each divided by its own degrees of freedom ($m$ and $n$):
$$F_{m,n} = \frac{\chi^2(m)/m}{\chi^2(n)/n}$$

- **Mean** $= \dfrac{n}{n-2}$ (for $n>2$)
- **Variance** $= \dfrac{2n^2(m+n-2)}{m(n-2)^2(n-4)}$ (for $n>4$)
- Always right-skewed and non-negative; approaches normal as both $m,n \to \infty$.
- Used in regression (overall-significance F-test) and ANOVA.

:::check
Q: An F-distribution has denominator df $n = 6$. What is its mean?
= 1.5
> $n/(n-2) = 6/4 = 1.5$.
:::

+++

### How distributions relate

- **Binomial** = sum of $n$ independent Bernoulli trials
- **Normal** = limiting form of many distributions (Central Limit Theorem)
- **t** = a standard normal divided by $\sqrt{\chi^2(n)/n}$; **t** → **Normal** as df → ∞
- **F** = ratio of two chi-squared distributions (each divided by its df)
- **Lognormal** = exponential transform of Normal ($\ln X$ is normal)
- **Triangular** and **Beta** both model bounded three-point estimates; Beta is more flexible but harder to fit
- **Beta(1,1)** = **Uniform(0,1)** exactly
- **Rayleigh**($a=1$) = **chi-squared** with 2 degrees of freedom; more generally, $\sqrt{X^2+Y^2}$ for independent $X,Y \sim N(0,\sigma^2)$ is Rayleigh — used in time-phasing R&D cost curves

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

### Full worked example: DoD vs. NAVAIR cost growth

NAVAIR program managers want to know if NAVAIR programs' cost growth differs from other (non-NAVAIR) DoD programs'. This is a **two-sample t-test**, and since no direction is proposed ("is it different"), it's **two-tailed**:
$$H_0: \mu_1 = \mu_2 \qquad H_1: \mu_1 \ne \mu_2$$

**Data** ($X$ = DoD, $Y$ = NAVAIR, $n = m = 20$): $\bar X = 1.19$, $\bar Y = 1.33$, $S_X^2 = 0.12$, $S_Y^2 = 0.09$.

**Pooled variance** (test assumes the two population variances are equal — check the sample variances are reasonably close first):
$$S_p^2 = \frac{(n-1)S_X^2 + (m-1)S_Y^2}{n+m-2} = \frac{19(0.12) + 19(0.09)}{38} = 0.11$$

**Test statistic**, substituting $\mu_X - \mu_Y = 0$ under $H_0$:
$$T = \frac{\bar X - \bar Y - 0}{S_p\sqrt{\frac{1}{n}+\frac{1}{m}}} = \frac{1.19 - 1.33}{\sqrt{0.11(\frac{1}{20}+\frac{1}{20})}} = -1.32$$

:::note CEBoK's rounding
CEBoK rounds the pooled variance to 0.11; with that value the arithmetic gives $-0.14/0.1049 = -1.33$, and CEBoK prints $-1.32$. Unrounded ($S_p^2 = 0.105$) gives $T \approx -1.37$, $p \approx 0.18$. The conclusion is unchanged: fail to reject.
:::

**Critical value**: $t$ with $df = n+m-2 = 38$, two-tailed $\alpha=0.05$ → critical value $\pm 2.02$. Since $-1.32$ is between $-2.02$ and $2.02$, **fail to reject** $H_0$ — no statistically significant difference, even though the raw means (19% vs. 33% average overrun) look quite different.

**Why the "obvious" difference isn't significant**: the two datasets are fairly dispersed — CV of 29% for DoD and 22% for NAVAIR — and that dispersion creates enough uncertainty to swamp the 14-point gap in means. **p-value** (two-tailed) = 0.194: if $\alpha$ had been set to 0.194, you could reject $H_0$, but that would mean a 19.4% chance of incorrectly rejecting a true $H_0$ — too high to accept.

**95% CI for the mean DoD CGF**: $\bar x \pm t_{0.025,19}\cdot s/\sqrt n = 1.19 \pm 2.093 \cdot 0.34/\sqrt{20} = (1.03,\ 1.35)$. Since this interval *contains* 1.33 (the NAVAIR mean), that's the same conclusion from another angle: not enough evidence the means differ.

:::widget two-sample-t:::

:::check
Q: DoD vs. NAVAIR test: $\bar X = 1.19$, $\bar Y = 1.33$, $S_p^2 = 0.11$, $n=m=20$. What is the test statistic $T$?
= -1.32 ±0.02
> $T = (1.19-1.33)/\sqrt{0.11(1/20+1/20)} = -0.14/0.1049 pprox -1.33$ (CEBoK prints $-1.32$).
:::

:::check
Q: In the DoD/NAVAIR example, df = 38 and the two-tailed critical value is ±2.02. What is the conclusion?
* Fail to reject $H_0$ — no statistically significant difference between the means
- Reject $H_0$ — NAVAIR programs grow significantly more
- The test is inconclusive without more data
> $|-1.32| < 2.02$, so the test statistic doesn't clear the critical-value bar; fail to reject.
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

**CI for the difference of two means** (pairs with the two-sample t-test):
$$(\bar x - \bar y) \pm t_{\alpha/2,\,n+m-2}\, S_p\sqrt{\frac{1}{n}+\frac{1}{m}}$$

If a two-tailed test at $\alpha$ would reject $H_0: \mu_1=\mu_2$, then 0 falls outside this same-$\alpha$ CI for the difference — the two are two views of one calculation.

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

**In regression** (Module 8/9): $H_0: b_i = 0$ vs. $H_1: b_i \ne 0$. Test statistic $t = \hat{\beta}_i/SE(\hat\beta_i)$, $df = n-k$ ($k$ = number of parameters estimated, including the intercept) — tests whether a CER coefficient is significantly different from zero.

:::tip Beyond CEBoK: unequal variances
The standard two-sample t assumes equal population variances (the usual case unless sample variances differ markedly). When they don't, a variant — often called the **Welch-Satterthwaite** (or Welch-Smith-Satterthwaite) t-test — uses each sample's own variance in the denominator and an adjusted, typically non-integer, degrees of freedom.
:::

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

**In regression** (Module 8/9): $H_0: b_1=b_2=\cdots=b_k=0$ vs. $H_1$: at least one $b_i \ne 0$. Test statistic $F = \text{MSR}/\text{MSE}$ tests overall significance (do the independent variables jointly explain variation?).

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

**The 25% rule (indistinguishability)**: For CV under 25%, normal and lognormal PDFs look nearly identical, and statistical goodness-of-fit tests cannot tell them apart — data would pass a normality test *and* a lognormality test. Above 25% CV, the lognormal visibly skews away from the normal and the tests can distinguish them. Most cost data has CV under 25%, so **if a large sum of WBS elements tests as lognormal, it is likely just because CV is low — not because the CLT (which predicts normal) has failed.**

This is a different rule from Module 10's earlier **CV < 15%** guideline (Measures of Dispersion) — that one is about *estimate quality* (whether a simple average is a defensible point estimate at all), not about distinguishing normal from lognormal.

:::widget normal-vs-lognormal:::

:::check
Q: Why is lognormal often preferred to normal for modeling total program cost?
* Cost is bounded below zero and tends to be right-skewed
- It is symmetric like cost growth
- It has lighter tails than normal
> A lognormal is positive, right-skewed, and fits multiplicative (percentage) growth, matching typical cost behavior.
:::

:::check
Q: A cost dataset has CV = 18%. Can a statistical test reliably tell whether it's normal or lognormal?
- Yes, easily
* No — under CV 25%, the two distributions are nearly indistinguishable by statistical test
- Only if n > 30
> CEBoK's rule: below 25% CV, normal and lognormal tests can't distinguish the data; above 25%, they can.
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

:::tip Beyond CEBoK: CLT and the mean's extra "niceness"
The distribution of *sample means* approaches normal as $n$ grows, regardless of the underlying data's shape. This is a companion fact to the CLT covered earlier (which is about sums/totals): it's why t-tests and normal-based CI formulas work even when individual data points are skewed — you're testing the mean, not the individual points. Sample means are more normal than the data itself.
:::

:::note CEBoK's Testable Topics
CEBoK's own summary table (Testable Topics) is blunt: **Testable** = all of this module's main content (definitions, distributions, hypothesis testing, statistical tests, confidence intervals). **Testable, but less emphasized** = N/A (nothing in this module gets that middle tier). **Not testable** = the Related and Advanced Topics section (derivations, additional distributions, additional tests) — covered here anyway for completeness, but lower priority for exam prep.
:::

:::check
Q: Per CEBoK's Testable Topics table, which tier does "Related and Advanced Topics" (derivations, chi-squared/Rayleigh/Beta/Extreme Value, additional CIs) fall into?
* Not testable
- Testable, but less emphasized
- Fully testable, same as the rest of the module
> CEBoK marks all main Module 10 content as testable, with nothing in the middle tier, and Advanced Topics as not testable.
:::
`
    },
    {
      id: 'advanced-dists', title: 'Advanced: distributions & simulation', summary: 'Not testable per CEBoK — Buffon’s needle, inverse CDF derivation, normal vs. lognormal detail, bivariate normal, chi-squared/Rayleigh/Beta/Extreme Value',
      body: String.raw`:::note Not testable per CEBoK
Everything in this section and the next ("Advanced: more tests & intervals") falls under CEBoK's **Related and Advanced Topics** — explicitly marked **not testable**. Included for completeness and because the underlying ideas (chi-squared, Rayleigh, Extreme Value, CI for sigma) show up elsewhere in cost estimating.
:::

### Monte Carlo history: Buffon's Needle

Comte de Buffon (1707-1788) devised an experiment to estimate $\pi$: drop a needle of length $L$ onto a floor with parallel lines spaced $D$ apart; the probability it crosses a line is $2L/(\pi D)$. Seeing $\pi$ fall out of a random physical process inspired Pierre-Simon Laplace to propose evaluating unknown values via random events — the origin of the **Monte Carlo method**. Italian mathematician Lazzerini later used this technique to find $\pi$ accurate to 6 decimals (3.1415929).

### Inverse CDF, worked

Every simulation needs a Uniform(0,1) random-number generator. The CDF maps a distribution value to a probability; its inverse maps a probability back to a value. Example: a random draw of $u = 0.0639$ from a Normal(0, 30) maps to $x = -45.677$ — about 1.523 standard deviations below the mean, roughly the 6th percentile.

### Normal distribution: derivation results (no integrals needed)

CEBoK derives the mean, median, and variance of the normal from its PDF using calculus. The results, not the derivations, are what matter for cost work: mean $=\mu$, median $=\mu$ (symmetric), variance $=\sigma^2$ (all as expected, but now formally justified).

### Normal vs. lognormal, in more depth

Figure 10.24 plots normal and lognormal PDFs sharing mean 10, with SD stepped up from 1.0 (CV 10%) to 2.5 (CV 25%) to 5.0 (CV 50%). At CV 10%, the two curves nearly overlap; at CV 25%, they begin to separate; at CV 50%, the lognormal's right skew is unmistakable. This is the same 25% threshold covered under Types of Distributions — the "in cost estimating, low CVs are desirable, most data has CV < 25%" framing is CEBoK's way of saying: don't over-trust a lognormality test result if your CV is already low.

:::check
Q: Figure 10.24 shows normal/lognormal pairs at CV 10%, 25%, and 50%, mean 10. At which CV does the lognormal's skew first become visually and statistically distinguishable from the normal?
* 25%
- 10%
- 50% only
> CEBoK's own figure sets the boundary at 25% CV — below it the pair (b) just begins to separate; above it (c) they're clearly different.
:::

### Bivariate normal and correlation's effect on roll-ups

When $X$ and $Y$ are jointly bivariate normal with correlation $\rho$, a scatter of $(X,Y)$ draws forms a data cloud centered at $(\mu_X,\mu_Y)$. As $\rho \to \pm1$, the cloud tightens and tilts along a line; as $\rho \to 0$, it's a rounder, more dispersed cloud.

**Effect on the sum $X+Y$** (the roll-up case): plot diagonal lines $x+y=C$. With $\rho$ near $+1$, many different $C$ lines intersect the tilted cloud — $X$ and $Y$ move up and down together, so their sum is highly dispersed. With $\rho$ near $-1$, few $C$ lines intersect the cloud — $X$ high tends to pair with $Y$ low, so the sum barely moves. **Positive correlation between WBS elements increases dispersion of the total; negative correlation decreases it** — the same conclusion as Module 9's variance-of-sums formula, seen geometrically here.

:::check
Q: Two WBS elements are bivariate normal with $\rho$ close to $-1$. What happens to the dispersion of their sum, compared to $\rho=0$?
* It decreases — when one element is high the other tends to be low, so the sum barely moves
- It increases
- No effect; only the mean changes
> Negative correlation means fewer diagonal $x+y=C$ lines intersect the (tilted) data cloud — the sum is more tightly clustered than under independence.
:::

+++

### Additional distributions (not testable)

**Chi-squared**: one parameter (df $=n$); mean $=n$, variance $=2n$; approaches normal as $n\to\infty$. Used in goodness-of-fit testing.

**Rayleigh**: one parameter $a$; mean $=a\sqrt{\pi/2}$, variance $=(2-\pi/2)a^2$. Rayleigh($a=1$) = chi-squared with 2 df. Used in time-phasing R&D cost/EAC curves.

**Beta** (formal): shape parameters $\alpha,\beta > 0$ on support $(0,1)$; mean $=\alpha/(\alpha+\beta)$; $\text{Beta}(\alpha,\beta)$ is symmetric to $\text{Beta}(\beta,\alpha)$; $\text{Beta}(1,1) = \text{Uniform}(0,1)$.

**Extreme Value (Type I / Gumbel)**: parameters $a,b>0$; mode $=a$, mean $= a+\gamma b$ ($\gamma\approx0.57721$, the Euler-Mascheroni constant), variance $=b^2\pi^2/6$. Models the *largest* of many variables (flood levels, earthquake magnitudes); in schedule risk, it fits finish-to-finish constraints, since a task can't finish until every sub-task does — the schedule is dominated by the slowest path (see Module 9's schedule-network discussion).

:::check
Q: An Extreme Value (Gumbel) distribution has $a=5$, $b=2$. What is its mode?
= 5
> Mode $= a$ by definition for the Type I extreme value distribution.
:::
`
    },
    {
      id: 'advanced-tests', title: 'Advanced: more tests & intervals', summary: 'Not testable per CEBoK — chi-squared GOF, CI for variance/sigma, k-sample test, t-to-Z convergence',
      body: String.raw`:::note Not testable per CEBoK
Continuing Related and Advanced Topics — not on the exam, but useful background.
:::

### Chi-squared goodness-of-fit, known vs. estimated parameters

$H_0: f_Y(y) = f_0(y)$ vs. $H_1: f_Y(y) \ne f_0(y)$. When *all* parameters of the hypothesized distribution are known in advance (rare in practice), one version of the test applies; when parameters must be estimated from the same data (the usual case), a different version (with adjusted df) is needed.

### CI for a variance (chi-squared based)

$$\left(\frac{(n-1)s^2}{\chi^2_{1-\alpha/2,\,n-1}},\ \sigma^2,\ \frac{(n-1)s^2}{\chi^2_{\alpha/2,\,n-1}}\right)$$

Depends on sample size and standard deviation via the chi-squared distribution — the two chi-squared critical values are *not* symmetric, so this CI is intrinsically asymmetric.

### CI for regression coefficients (pointer)

$$\hat b \pm t_{\alpha/2,\,n-2}\sqrt{\frac{n\sigma^2}{(n-2)\sum_{i=1}^n(x_i-\bar x)^2}}$$

Full treatment (multivariate case, SEE substitution) is in Module 8 Regression Analysis.

### Confidence intervals and sample size

CI and PI width shrink with $\sqrt n$, but never hit zero the way a CI eventually can — the *next single value of X* is always limited by $\sigma$, while the *mean* can, in principle, be known with near-perfect precision as $n\to\infty$. **The penalty for not knowing $\sigma$ (comparing PI/CI width at higher vs. lower confidence) is roughly 2-4×** worse at higher confidence levels — this is exactly what gives the t-distribution its fat tails.

### k-sample test for means

Tests whether two (or more) groups of data were drawn from the same population, without needing to specify the population's distribution function — a non-parametric alternative when you don't want to assume normality.

### The convergence of t to Z

At $\alpha=0.05$ (about $2\sigma$), the t-distribution's critical value is noticeably fatter-tailed than $z=1.96$ for small $n$, converging rapidly as $n$ grows — by $n=30$ the two are very close. Concretely, at $n=5$ the t's 95th-percentile critical value is **32.7% higher** than $z$'s ($2.6/1.96 = 1.327$), versus only about 11% higher at the 68.3rd percentile — the fat-tail effect is much larger at higher confidence levels. (CEBoK rounds $t_{0.975,5} = 2.571$ to 2.6; unrounded, the gap is 31.2%.)

:::check
Q: At $n=5$, the t-distribution's 95th-percentile critical value is what percent higher than the normal's $z=1.96$?
= 32.7 ±0.5
> $2.6/1.96 = 1.327$, i.e. 32.7% higher — versus only ~11% higher at the 68.3rd percentile.
:::

### CI for sigma (standard deviation)

Because $\sigma$ is a second-order moment, it's harder to pin down than $\mu$. For a 95% CI on $\sigma$ with small $n$, the **lower limit sits fairly close to the true $\sigma$, but the upper limit is quite high** — the CI is asymmetric and skewed toward larger values, because errors in estimating $\sigma$ tend to run high. Even in a favorable case (true $\sigma=10$, $\mu=100$, CV only 10%), the upper limit at small $n$ is well above the true $\sigma$.

:::widget ci-sigma:::

:::check
Q: A 95% CI for $\sigma$ from a small sample is noticeably asymmetric. Which way does it skew?
* The upper limit is much higher above the true $\sigma$ than the lower limit is below it
- It's perfectly symmetric, like a CI for the mean
- The lower limit is the one that runs high
> CEBoK's Fig. 10.29: the CI for sigma is skewed with a high upper limit; the lower limit stays fairly close to the true value.
:::
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
A: 68.3%, 95.5%, 99.7%
Q: What percent of a normal distribution falls within ±1.96σ of the mean?
A: Exactly 95% — worth memorizing alongside the 68.3/95.5/99.7 rule.
Q: z-score formula
A: $z = (x - \mu)/\sigma$
Q: What does z-score measure?
A: How many standard deviations a value is from the mean (standardized distance).
Q: Interpretation of $z = 1.5$ from a z-table with $P(Z < 1.5) = 0.9332$
A: About 93.32% of outcomes fall below that value; 6.68% exceed it.
Q: When is normal distribution appropriate for cost?
A: When data is symmetric; below CV 25% a normality test can't reliably distinguish normal from lognormal anyway, so either is defensible.
Q: Can normal distribution be negative?
A: Yes, which is unrealistic for cost; lognormal is better for cost modeling (or truncate the normal at zero and redistribute the weight).
Q: PDF vs. CDF worked example: F(5)=0.18, F(10)=0.58. What is P(5<x<10)?
A: F(10) - F(5) = 0.58 - 0.18 = 0.40.
Q: Probability a continuous random variable equals one exact point (e.g. cost = exactly the point estimate)
A: Zero (nil) — ask instead about the probability of falling within 5%, 10%, or 15% of the estimate.
Q: Dice example: mean and variance of the sum of two dice
A: Mean = 7; Variance = 5.83 (35/6).
Q: Coefficient of variation (CV) formula
A: $CV = \sigma/\mu$ — unitless, so it's comparable across datasets of different scale.
Q: CV estimate-quality rule (CEBoK)
A: Cost estimates should have CV < 15%; above that, consider regression against a cost driver instead of a simple average.
Q: Fig. 10.8 example: mean 10, CV 10% vs. CV 30% — what are the standard deviations?
A: CV 10% → σ = 1; CV 30% → σ = 3 (σ = CV × μ in both cases).
Q: A high CV may indicate what, besides general dispersion?
A: Outliers in the data set.
Q: CLT example: three right-skewed triangulars, (0.5,1.0,3.0), (3.5,4.5,7.5), (6.5,8.0,12.0), summed
A: The sum tests as normal by the Kolmogorov-Smirnov test — the CLT takes effect quickly even for skewed triangulars.
Q: CLT requirement (iid) and typical convergence point
A: Independent, identically distributed elements; sum generally converges to normal by about n = 30.
Q: Does correlation between summed elements break the CLT?
A: Not usually — as long as the sum isn't dominated by a few highly correlated large elements, the CLT still holds (convergence may just be slightly slower).

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
Q: Formal definition of the t-distribution
A: $t = N(0,1) / \sqrt{\chi^2(n)/n}$ — a standard normal divided by the square root of a chi-squared over its df.
Q: t-distribution: mean and variance
A: Mean = 0; Variance = $n/(n-2)$.
Q: In regression, what df does the t-test for a coefficient use?
A: $df = n - k$ (n = sample size, k = number of parameters estimated, e.g. n-2 for simple linear regression).

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
A: Lognormal is usually preferred for cost (positive, right-skewed, fits multiplicative growth); below CV 25% the two are statistically indistinguishable, so either passes.
Q: Normal-vs-lognormal indistinguishability rule
A: Below CV 25%, statistical tests can't reliably tell normal from lognormal data apart; at or above 25%, they can.
Q: If a sum of 30+ WBS elements tests as lognormal, what's the likely explanation?
A: Low CV (under 25%) — not a CLT failure. The CLT still predicts normal for large iid sums; low-CV data just can't be told apart from lognormal by the test.

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
A: Binomial = sum of n Bernoulli trials; Normal = limit of many distributions (CLT); t → Normal as df → ∞; F = ratio of two chi-squareds; Lognormal = exp(Normal); Beta(1,1) = Uniform(0,1); Rayleigh(1) = chi-squared(2 df).
Q: F-distribution: mean and variance
A: Mean = $n/(n-2)$ for $n>2$; Variance = $2n^2(m+n-2) / [m(n-2)^2(n-4)]$ for $n>4$ (m, n = numerator/denominator df).
Q: F-distribution definition
A: Ratio of two chi-squared variables, each divided by its own df: $F_{m,n} = [\chi^2(m)/m] / [\chi^2(n)/n]$.
Q: Beta(1,1) is identical to…
A: Uniform(0,1).
Q: Rayleigh(a=1) is identical to…
A: Chi-squared with 2 degrees of freedom.

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
Q: Regression t-test: H0 and test statistic
A: H0: $b_i = 0$; test statistic = estimated coefficient / standard error, $t$ with $df = n-k$.
Q: Regression F-test: H0 and test statistic
A: H0: $b_1=b_2=\cdots=b_k=0$ (none of the coefficients matter); test statistic = MSR/MSE.
Q: Welch-Satterthwaite (Welch-Smith-Satterthwaite) t-test: when needed
A: When the two samples' variances are not reasonably close — the standard two-sample t assumes equal variances.
Q: DoD vs. NAVAIR example: pooled variance formula
A: $S_p^2 = [(n-1)S_X^2 + (m-1)S_Y^2] / (n+m-2)$.
Q: DoD vs. NAVAIR example: test statistic and conclusion
A: T = -1.32 with df=38; critical value ±2.02 → fail to reject H0 (no significant difference), despite means of 1.19 vs. 1.33.
Q: DoD vs. NAVAIR example: p-value and its meaning
A: p = 0.194 (two-tailed) — rejecting H0 at that level risks a 19.4% chance of a false rejection, too high to accept.
Q: CI for the difference of two means, formula
A: $(\bar x - \bar y) \pm t_{\alpha/2,\,n+m-2} S_p \sqrt{1/n + 1/m}$.
Q: CEBoK Testable Topics summary
A: Testable = all main content; Testable but less emphasized = N/A; Not testable = Related and Advanced Topics (derivations, extra distributions, extra tests).

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
A: Lognormal: positive, right-skewed, fits cost growth (especially large CV). Normal: symmetric, allows negatives; below CV 25% tests can't tell it from lognormal.
Q: Bivariate normal distribution
A: Joint distribution of two correlated normal variables, characterized by two means, two SDs, and correlation ρ.

## Advanced (Not Testable per CEBoK)
Q: Buffon's Needle Experiment
A: Dropping a needle of length L onto lines spaced D apart; probability of crossing is $2L/(\pi D)$ — the historical origin of the Monte Carlo method (via Laplace, generalizing Buffon's approach).
Q: Inverse CDF worked example
A: u=0.0639 drawn from Normal(0,30) maps to x=-45.677, about 1.523σ below the mean (~6th percentile).
Q: Effect of positive vs. negative correlation on a bivariate-normal roll-up's dispersion
A: Positive ρ increases the dispersion of the sum X+Y (elements move together); negative ρ decreases it (they offset).
Q: Chi-squared distribution: mean and variance
A: Mean = n (df); Variance = 2n. Approaches normal as n → ∞.
Q: Rayleigh distribution: mean and variance
A: Mean = $a\sqrt{\pi/2}$; Variance = $(2-\pi/2)a^2$. Used in time-phasing R&D cost curves.
Q: Beta distribution: formal mean formula
A: $\alpha/(\alpha+\beta)$ for shape parameters α, β on support (0,1).
Q: Extreme Value (Gumbel, Type I): mode, mean, variance
A: Mode = a; Mean = $a + \gamma b$ (γ ≈ 0.57721); Variance = $b^2\pi^2/6$.
Q: Why Extreme Value fits schedule risk
A: Finish-to-finish constraints mean a task can't complete until all sub-tasks do — the schedule is dominated by the slowest (extreme) path.
Q: Chi-squared GOF test: known vs. estimated parameters
A: A different test version applies depending on whether all distribution parameters are known in advance (rare) or must be estimated from the same data (usual case, needs adjusted df).
Q: CI for a variance, formula
A: $\left(\dfrac{(n-1)s^2}{\chi^2_{1-\alpha/2,n-1}},\ \sigma^2,\ \dfrac{(n-1)s^2}{\chi^2_{\alpha/2,n-1}}\right)$ — intrinsically asymmetric since the two chi-squared critical values aren't symmetric.
Q: t-to-Z convergence: how much fatter is the t's 95th-percentile critical value at n=5?
A: 32.7% higher than z=1.96 (2.6/1.96 = 1.327), versus only ~11% higher at the 68.3rd percentile.
Q: k-sample test for means: what makes it different from a t-test?
A: It doesn't require specifying the population's distribution function (non-parametric); tests whether groups came from the same population.
Q: CI for sigma: shape
A: Asymmetric and skewed high — the lower limit stays close to the true σ, but the upper limit can be quite far above it, especially at small n.

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
