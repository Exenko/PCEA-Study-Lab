PCEA.addModule({
  id: 'm09', num: 9, title: 'Cost Risk and Uncertainty', short: 'Cost Risk', source: 'guide',
  blurb: 'Why point estimates are too low, risk model architecture, distributions, correlation, Monte Carlo, the risk cube, and how to pick a confidence level.',
  intro: String.raw`A deterministic point estimate (from a CER, analogy, or build-up) is almost never exactly right. **Cost risk analysis** quantifies the range of possible outcomes and their probabilities, so decision-makers can choose a budget with a known **confidence level**. **Cost growth** is the *past* increase in cost from initial estimate to final actual; **cost risk** is *future*, predicted cost growth.

**Key insight:** A cost estimate is not a single number — it is a distribution of possible costs. The S-curve (cumulative distribution) is the primary tool for selecting a funding level.`,
  sections: [
    {
      id: 'definitions', title: 'Risk and Uncertainty Definitions', summary: 'Key terms, types of risk, why programs grow in cost',
      body: String.raw`### Risk vs. Uncertainty vs. Opportunity

- **Uncertainty**: An uncertainty range is added to address the precision of estimating techniques — it exists even with no specific "bad thing" happening (e.g., variation in labor rates, quantities, or CER residual error).
- **Risk**: The possibility of a *specific, identifiable event* that, if it occurs, has a negative effect on cost, schedule, or performance. Risk addresses the *inherent bias* of estimates by calibrating them toward a more accurate result, and properly positioning the point estimate in the probability distribution.
- **Opportunities**: Factors that could result in a *positive* outcome, such as finishing a program earlier or reducing cost exposure.
- Risk analysis differs from **sensitivity analysis**: sensitivity analysis is deterministic (impact of specific cost drivers on the estimate); risk analysis portrays the most accurate probability distribution for overall cost.

+++

### Types of Risk

$$\text{Cost Growth} = \text{Cost Estimating Growth} + \text{Schedule/Technical Growth} + \text{Requirements Growth} + \text{Threat Growth}$$
$$\text{Cost Risk} = \text{Cost Estimating Risk} + \text{Schedule/Technical Risk} + \text{Requirements Risk} + \text{Threat Risk}$$

| Component | Definition |
|---|---|
| **Cost Estimating Risk** | Statistical uncertainty inherent in the estimate — e.g. the uncertainty a least-squares regression CER carries around its point estimate |
| **Schedule/Technical (S/T) Risk** | Difficulty encountered conquering problems posed by the design in the CARD or system specifications — e.g. an infeasible, tight schedule |
| **Requirements Risk** | Unforeseen design shifts from shortfalls in requirements/specification documentation; the design's inability to meet the mission, or misinterpretation of the solution |
| **Threat Risk** | Defense/intelligence-specific: new threats revealed in a System Threat Assessment Report (STAR) — the solution was wrong because the system's needs were incorrect |

Requirements risk and threat risk are **normally implicit** when risk is assessed.

:::tip Beyond CEBoK: systemic vs. random risk
A related, useful distinction (not one of CEBoK's four categories above) is between **systemic (correlated)** risk — moves many or all cost elements the same way (inflation, a labor-rate shift, a policy change) and does *not* diversify away when elements are summed — and **random (uncorrelated)** risk, which affects elements independently and partially cancels when many are summed. This is exactly why correlation matters so much to the total distribution (see Correlation and Total Variance).
:::

+++

### Historical Cost Growth

The point estimate is often characterized as the mean or median of total cost, but historical studies compare estimated to actual costs. Fig. 9.1 and Fig. 9.2 show how, as a program evolves, cost risk becomes *realized* and turns into cost growth — decreasing remaining net risk. At contract end, total cost growth should equal total cost risk, but often does not: most programs show cost overruns, and risk estimates generally fail to anticipate all of a program's growth (Fig. 9.2's shaded "unanticipated cost growth").

One such study (Fig. 9.3) found that only **16%** of programs ended up at or below their cost estimate — point estimates represent a much lower percentile than is often assumed.

**Cost Growth Factor**: $\text{CGF} = \dfrac{\text{Actual Cost}}{\text{Estimated Cost}}$

+++

### Interpreting the Point Estimate and Variability

The two core issues in cost risk are **understatement of cost** and **understatement of variability**.

**Understatement of cost** — misinterpreting what the point estimate represents in the probability distribution. Commonly accepted interpretations:

| Estimating method | Point estimate represents |
|---|---|
| Linear CER or analogy | **Mean** |
| Non-linear CER | **Median** |
| Build-up (historical rates + engineering parameters) | **Mean** |
| SME judgment | **Mode** (limited information to verify this assumption) |

**Understatement of variability** — from omitting risks or bias elements; failing to include functional correlation and/or risk correlation; insufficient data (wider CER prediction intervals); or systematic understatement in non-linear CERs. Underestimating variability understates the median or higher-confidence-level costs.

Independent entities (milestone decision authorities, acquisition review boards) are often less prone to optimistic assumptions than the program office, and typically assume higher most-likely cost scenarios.

:::check
Q: Point estimate \$200M. Comparable programs grew by median factor 1.25. What is the risk-adjusted estimate, in \$M?
= 250
> $200 \times 1.25 = 250$
:::

:::check
Q: In one historical study, what fraction of programs ended at or below their cost estimate?
= 16
> Only 16% (Fig. 9.3) — evidence that point estimates sit at a much lower percentile than is often assumed.
:::

:::check
Q: A cost element's point estimate came from a non-linear CER. What does this point estimate represent statistically?
* The median of the cost probability distribution
- The mean
- The mode
> Non-linear CERs (e.g. power-form) are interpreted as producing the median; linear CERs, analogy, and build-up are interpreted as the mean.
:::`
    },
    {
      id: 'models', title: 'Cost Risk Models and Architecture', summary: 'Input vs. output models, historical vs. expert basis, and the three-part architecture framework',
      body: String.raw`### Types of Cost Risk Models

The risk process breaks into inputs, structure and execution, and outputs. Risk models are characterized along two axes:

**Input vs. Output methods**

| Type | Description |
|---|---|
| **Input Methods** | Assess uncertainty around cost drivers (and the CER error that uses them) to determine cost risk. Vulnerable to correlation issues, and may not capture all potential cost growth. |
| **Output Methods** | Assess uncertainty around the cost estimate by adding schedule, technical, or other risks — a mean shift predicting likely growth. Risk registers are a common example. An output model built on historical data may not offer recommendations for *reducing* risk. |

It is **not safe to combine** input and output methods on the same cost risk driver — the cost risk the output method predicts has already been baked into the cost growth in the data the input method used.

**Historical vs. Expert-Opinion basis** (either can use input or output methods):

| Basis | Description |
|---|---|
| **Historical** | Applies mean growth or a distribution of growth from similar completed programs to the estimate. Requires adjusting the historical data for factors outside pure risk (e.g. quantity, requirements growth) and a dataset appropriate to the program. |
| **Expert-Opinion** | Interviews SMEs for uncertainty and possible risks, then conflates the results into a top-level assessment. Either (a) score a matrix that maps to a cost growth factor (needs completed, already-scored programs to calibrate the mapping), or (b) SMEs directly assess uncertainty, usually via a three-point triangular estimate. SMEs may not conceptualize true worst/best cases, so endpoints are often extrapolated assuming the SME really gave, say, the 15th/85th percentiles. Experts are prone to underestimate variance even when they don't underestimate the mean. |

+++

### Model Architecture: Inputs, Structure, Execution

There are three components to any risk model (Fig. 9.4): **inputs**, **structure**, and **execution**. The risk analyst has little direct say in inputs and outputs — both are driven by the model's structure and execution.

**Inputs** — a scoring methodology for quantifying risk, and a dollar basis for turning risk into cost:

*Scoring* (in order of preference):
- **Ratio** — set scoring where both ratio and distance between scores are meaningful (e.g. score 1 = one week of schedule slip, score 2 = two weeks)
- **Interval** — set scoring without objective criteria; distance between scores is meaningful (e.g. a linear 1–10 scale: low=1, medium=5, high=10)
- **Ordinal** — relative measurement only; distance between levels is unknown (e.g. low/medium/high difficulty)

*Dollar basis* (in order of preference): **Historical** (actual growth from analogous programs), **Domain Expert** (SME assessment from experience), **Conceptual** (arbitrarily assigned — least preferred).

**Structure** — organization (coverage/partition of risk types, whether below-the-line elements are covered) plus the probability model:

*Assigning cost to risk* (four methods): **Risk Estimating Relationships (RERs)** — equations mapping risk score to cost impact, $\text{Cost Impact} = f(\text{Risk Score})$, the preferred method; **Direct Assessment of Distribution Parameters** — adjust a cost element's distribution directly (e.g. shift a triangular distribution's endpoints) instead of using risk scores; **Factors** — a subset of RERs that scale cost by a percentage per risk-score point (linear only, no nonzero intercept); **Rates** — a flat dollar value per risk point, independent of item cost (can suffer from unintuitive units, e.g. \$/flying hour).

**Execution** — computation, then cross-checks (below).

:::check
Q: A risk model uses a scale where low risk = 1, medium = 5, high = 10, with no objective criteria behind the numbers, but the *distance* between scores is meaningful. What kind of scoring is this?
* Interval
- Ratio
- Ordinal
> Ratio scoring needs objective criteria (e.g. "\$X per week of slip"); interval scoring has meaningful distance without objective criteria; ordinal scoring has neither.
:::

:::check
Q: Which cost-to-risk assignment method is the preferred one?
* Risk Estimating Relationships (RERs) — equations relating risk score to cost impact
- Rates (a flat dollar value per risk point)
- Direct assessment of distribution parameters
> RERs are preferred because they characterize cost impact as a function of risk score; Factors are a linear subset of RERs, and Rates/Direct assessment are less preferred paths.
:::

:::check
Q: If SEPM = 15\% of hardware cost, and hardware is uncertain, what happens to SEPM uncertainty in the simulation?
* It inherits hardware's uncertainty through the functional relationship (perfectly correlated with it)
- None — SEPM is a fixed percentage
- It must be entered separately with its own distribution
> A functional relationship automatically passes uncertainty through and creates perfect correlation.
:::`
    },
    {
      id: 'distributions', title: 'Probability Distributions in Risk Models', summary: 'Normal, Lognormal, Triangular, Beta, Bernoulli — and which fit the total',
      body: String.raw`Underestimation of both the mean and standard deviation is an issue across every distribution used in risk models. CEBoK covers five (full mechanics of each are in Module 10):

| Distribution | Conditions |
|---|---|
| **Normal** (Fig. 9.5) | Most likely value = the mean; equally likely to fall above or below the mean; more likely closer to the mean (68% within one std. dev.). Allows negative values (can be problematic); symmetric, so it must be *shifted* to move the mean. |
| **Lognormal** (Fig. 9.6) | A natural result of non-linear CERs. Unbounded above but a finite lower bound (useful since cost has a floor of zero); positively skewed; $\ln(\text{variable})$ is normal. Virtually indistinguishable from Normal when $\text{CV} < 25\%$. |
| **Triangular** (Fig. 9.7) | Min and max pre-determined; most likely value is between them; values near the min/max are as likely as values near the most likely; can be skewed or symmetric. The most commonly used risk distribution (simplicity), but modes of multiple triangular variables are **not additive**. Questionable whether SMEs can truly pin the min/max — sometimes widened by an extra factor. |
| **Beta** (Fig. 9.8) | Min and max pre-determined; shape set by two positive shaping parameters. Solves negative-value issues normal can have; can be symmetric or skewed; less commonly used today (more parameters to manage). |
| **Bernoulli** (Fig. 9.9) | Discrete; assigns probability $p$ to the value 1 and $(1-p)$ to 0 — a simplified Binomial. Used in likelihood/consequence (risk cube) models, where a nonzero result ("success" mathematically) is a risk *occurring*. |

+++

### Which distribution fits the *total* cost?

- **Normal** is likely for total cost when there are many independent (or weakly correlated), weakly skewed lower-level elements.
- **Lognormal** is likely for total cost when lower-level elements are more skewed or correlated. Many total costs in smaller models test as both normal and lognormal.
- **Triangular should not be used for total cost** — the sum of triangularly distributed lower-level elements is *not* itself triangular.
- If simulation derives the total, it might not resemble any named distribution at all — a **convolved cost distribution**.

Models can assign distributions at the **top level** (overall cost) or at **detailed levels** (specific cost drivers, e.g. lines of code). Neither is universally preferable; detailed levels give more insight, but need supporting data.

:::check
Q: A cost element's minimum is zero, it is positively skewed, and its natural log is normally distributed. Which distribution?
* Lognormal
- Normal
- Beta
> Lognormal: finite lower bound, unbounded above, positively skewed, and log-normal by construction — the natural result of non-linear CERs.
:::

:::check
Q: You are summing 20 lower-level triangular cost elements to characterize *total* program cost. Should the total be modeled as triangular?
- Yes, sums of triangular variables are triangular
* No — the sum of triangular elements is not itself triangular; use normal, lognormal, or a simulated (convolved) distribution
> Triangular should never characterize a summed total, only individual elements.
:::`
    },
    {
      id: 'triangular', title: 'Triangular Distribution Deep Dive', summary: 'The workhorse of cost risk: mean, mode, median, variance, and why modes do not add',
      body: String.raw`The **triangular distribution** is the standard choice in cost risk because it is easy to parameterize from expert three-point estimates (Low, Most Likely, High).

**Parameters**: $a$ = low (minimum), $c$ = most likely (mode), $b$ = high (maximum)

### Formulas

$$\text{Mean} = \frac{a + c + b}{3}$$

**Mode** = $c$ (by definition — it is the most-likely input, not computed)

**Median** (piecewise):
- If $c \ge \frac{a+b}{2}$: $\text{Median} = a + \sqrt{\dfrac{(b-a)(c-a)}{2}}$
- If $c \le \frac{a+b}{2}$: $\text{Median} = b - \sqrt{\dfrac{(b-a)(b-c)}{2}}$

$$\text{Variance} = \frac{a^2+b^2+c^2-ab-ac-bc}{18}$$

+++

### Mean ≠ Mode (Critical Insight)

Unless the distribution is perfectly symmetric, **mean and mode are different values**. For right-skewed distributions (the typical cost case, where $b - c > c - a$):

$$\text{Mode} < \text{Median} < \text{Mean}$$

**Why**: A right-skewed distribution has a longer high tail. The far-out high values pull the mean above the mode.

:::key
**This is the single most important concept in the module**: If you sum the "most likely" (modal) values of 20 WBS elements, you do NOT get the most-likely or mean program total. You get a number that **systematically understates** the statistically expected cost because only means are additive.
:::

:::check
Q: Triangular: Low=80, ML=100, High=160. Mean? (2 decimals)
= 113.33
> $(80+100+160)/3 = 340/3 = 113.33$
:::

:::check
Q: Same distribution. Is Mean > Mode?
* Yes, because the high tail is longer
- No, mode is always larger
- Only for perfectly symmetric distributions
> Right-skewed (high tail > low tail) → Mean > Mode. This is the typical cost case.
:::

+++

### Worked Example

A cost element: Low = 80, Most Likely = 100, High = 160 (\$k).

Mean = $(80+100+160)/3 = 113.33$ (above the mode of 100)

Median (since $c=100 < (a+b)/2 = 120$, use the second formula):
$$\text{Median} = 160 - \sqrt{\frac{(160-80)(160-100)}{2}} = 160 - \sqrt{2400} = 160 - 48.99 = 111.01$$

Variance:
$$\sigma^2 = \frac{80^2+160^2+100^2-(80)(160)-(80)(100)-(160)(100)}{18} = \frac{6400+25600+10000-12800-8000-16000}{18} = \frac{5200}{18} = 288.9$$

Standard deviation: $\sigma = \sqrt{288.9} = 17.0$

**Order**: Mode (100) < Median (111.0) < Mean (113.3) — expected for right skew. If you used only the mode (100) as the point estimate, you'd understate the true expected cost by 13.3.

:::check
Q: For the above element (L=80, ML=100, H=160), what is the standard deviation?
= 17.0 ±0.1
> $\sigma = \sqrt{288.9} = 17.0$
:::`
    },
    {
      id: 'summing', title: 'Why Modes Do Not Add', summary: 'The mathematical reason point estimates are too low',
      body: String.raw`### Means Are Additive; Modes Are Not

This is the **single most testable concept** in the entire module.

**Means always add**, regardless of distribution shape or correlation:
$$E\left[\sum X_i\right] = \sum E[X_i]$$

**Modes (most-likely values) do NOT add**:
$$\text{Mode}\left(\sum X_i\right) \ne \sum \text{Mode}(X_i)$$

This is especially true for skewed distributions.

+++

### Practical Consequence

A WBS has 20 cost elements. An estimator gives a "most likely" value for each and sums them to get the "most likely program total."

**This is mathematically wrong** because:

1. The sum of modes is not the mode of the sum
2. For right-skewed elements, the sum of modes systematically **understates** the true expected (mean) total cost
3. No simulation or method-of-moments correction needed — it is provably false by definition

**Example**: Two independent triangular elements, each with Low=80, ML=100, High=160 (Mean = 113.33 each).

- Sum of modes: $100 + 100 = 200$
- Sum of means: $113.33 + 113.33 = 226.67$ ← This **is** the mean of the sum (correct)
- Mode of the summed distribution: Between 200 and 226.67, but NOT simply 200

The difference (226.67 − 200 = 26.67) is cost that an estimator using only modes would miss.

+++

### Why Simulation Matters

**Monte Carlo simulation** or **method-of-moments summation** are required to get the true total distribution because they correctly handle:
- The fact that only means add
- Skewness of each element flowing through to the total
- Correlation between elements

Hand-arithmetic (summing most-likely values) fails on all three counts.

:::check
Q: Element 1: Low 50, ML 80, High 120. Element 2: Low 60, ML 100, High 140. Sum of "most likely" values is 180. What is wrong with calling this the "most likely program cost"?
* Modes are not additive; the true mode of the sum is higher than 180 when elements are right-skewed
- Nothing; summing modes is the correct method
- You must multiply the modes instead of add them
> Only means are additive. For right-skewed elements, the sum of modes understates the true expected (mean) total.
:::

:::check
Q: True or False: The mean of a sum of cost elements equals the sum of their individual means.
* True, always
- False, only if uncorrelated
- False, only if independent
> Means are additive regardless of distribution or correlation. $E[\sum X_i] = \sum E[X_i]$ always.
:::`
    },
    {
      id: 'correlation', title: 'Correlation and Total Variance', summary: 'How correlation widens the total distribution; the four correlation methods',
      body: String.raw`When summing multiple cost elements, **correlation between elements dramatically affects the total spread** — but not the mean. Correlation increases dispersion, shifts the risk-adjusted mean, and is difficult to model.

### The Variance Formula

For two variables:
$$\text{Var}(X+Y) = \sigma_X^2 + \sigma_Y^2 + 2\rho_{XY}\sigma_X\sigma_Y$$

The term $2\rho\sigma_X\sigma_Y$ is the **covariance** contribution to total variance.

For n variables:
$$\text{Var}(\text{Total}) = \sum_i \sigma_i^2 + 2\sum_{i<j}\rho_{ij}\sigma_i\sigma_j$$

+++

### Three Key Cases

**Case 1: Uncorrelated ($\rho = 0$)**
- Variances simply add: $\text{Var}(X+Y) = \sigma_X^2 + \sigma_Y^2$
- **Diversification**: Standard deviation of the total grows slower than linearly; CV shrinks as more independent elements are added

**Case 2: Perfectly Positively Correlated ($\rho = 1$)**
- $\text{Var}(X+Y) = (\sigma_X+\sigma_Y)^2$
- **Standard deviations add directly** (not variances) — no diversification benefit

**Case 3: Partial Correlation ($0 < \rho < 1$)**
- Covariance terms add intermediate contribution — the typical real-world case (shared labor rates, schedule, technical risk)

+++

### The Four Correlation Methods

- **Functional Correlation**: Arises automatically between source and derivative variables through functional (CER) dependency — e.g. program management modeled as a percentage of software cost rises and falls with it. Innate whenever a CER incorporates another variable.
- **Relational Correlation**: A framework for assigning or judging the reasonableness of assumed correlation, leveraging the geometry of regression and bivariate normal variables; gives insight into the tilt/slope of the data around the regression line. An improvement over injected correlation, filling a gap functional correlation leaves.
- **Injected Correlation**: Correlation imposed between two variables by asking SMEs to quantify a likely value (sometimes a low value like 0.2, just to induce some dispersion). Problems: SMEs are unlikely to estimate correlation accurately, and the implications are hard to cross-check.
- **None**: Some models assume all lower-level elements are independent — likely leads to an inaccurate (too-narrow) estimate.

Correlations derived from historical data are preferred. Absent that, it is not uncommon to assign a weak correlation of 0.2–0.3 to at least acknowledge it, though this faces the same cross-check problems as injected correlation.

+++

### Worked Example

Two elements, each $\sigma = 17.0$ (from earlier triangular example).

Uncorrelated ($\rho=0$):
$$\text{Var}(X+Y) = 17.0^2 + 17.0^2 = 289 + 289 = 578 \quad \Rightarrow \quad \sigma_{total} = \sqrt{578} = 24.04$$

Perfectly correlated ($\rho=1$):
$$\sigma_{total} = 17.0 + 17.0 = 34.0$$

**The difference**: perfectly correlated total is 40% larger (34.0 vs 24.04 std dev) — same means, very different spreads.

**Critical pitfall**: Ignoring correlation (assuming $\rho=0$ when elements actually share drivers) produces an S-curve that is too narrow — overstating confidence in the estimate and understating true risk.

:::check
Q: Two cost elements each have $\sigma = 10$ (\$K). They are uncorrelated. What is the total $\sigma$, in \$K?
= 14.14 ±0.01
> $\sigma_{total} = \sqrt{10^2+10^2} = \sqrt{200} = 14.14$
:::

:::check
Q: Same two elements, but perfectly correlated. What is the total $\sigma$, in \$K?
= 20 ±0.1
> $\sigma_{total} = 10 + 10 = 20$ (standard deviations add directly for $\rho=1$)
:::

:::check
Q: Raising correlation from 0 to 0.8 changes the total standard deviation from 24 to 30. What happens to the mean total cost?
- It increases
- It decreases
* It stays the same
> Correlation affects variance (and std dev) of the sum, not its mean. Only means are additive.
:::

:::check
Q: Which correlation method arises automatically because a CER expresses program management as a percentage of software cost?
* Functional correlation
- Injected correlation
- Relational correlation
> Functional correlation is innate whenever a CER incorporates another variable — no separate assumption needed.
:::`
    },
    {
      id: 'scurve', title: 'Monte Carlo, S-Curves, and Confidence Levels', summary: 'Simulation, PDF/CDF, percentiles, and why point estimates sit below 50%',
      body: String.raw`### Monte Carlo Simulation Mechanics

**Monte Carlo** is the standard quantitative method for propagating element-level uncertainty and correlation to a total-program distribution.

**Steps**:
1. Assign a probability distribution (triangular, normal, lognormal, etc.) to each uncertain element, including any applicable correlation
2. For each iteration (software packages easily run thousands): randomly draw a value from each element's distribution and calculate the total
3. Repeat many times to build an empirical distribution of total cost
4. The output varies by software, but can include an S-curve and descriptive statistics: mean, variance, median, and cost at various confidence levels

**Key property**: Correctly captures skewness and non-normality of the total, even when individual elements are simple shapes.

+++

### PDF vs. CDF (the S-Curve)

**PDF (Probability Density Function)**:
- Shows the "height" or likelihood at each cost value
- Area under the curve between two values = probability the outcome falls in that range
- Classic "bell" or "hump" shape (though cost distributions are usually right-skewed, not perfectly normal)

**CDF (Cumulative Distribution Function) — the S-Curve**:
- For each cost value $x$, shows $P(X \le x)$: the probability that total cost will **not exceed** that value
- Starts near 0% at the low end, rises monotonically (always increasing), approaches 100% at the high end
- **Primary tool for decision-makers**: pick a desired **confidence level** (e.g., 70%) on the y-axis, read across to find the corresponding **cost** on the x-axis

:::widget montecarlo:::

:::challenge montecarlo rho=0 n=20000 lock=n
Q: The dashed S-curve assumes no correlation between the elements. Raise $\rho$ until the 80th percentile is at least **10** above the uncorrelated P80.
goal: p80gap >= 10
show: rho=0.6
> Positive correlation makes elements overrun together. That widens the spread of the total and pushes up the high percentiles, while the mean stays put. Leaving correlation out understates the risk reserve.
:::

:::challenge montecarlo rho=0.2 n=20000 lock=n
Q: The point estimate is the sum of each element's most likely value. Where does it fall on the S-curve?
* Well below 50%, because right-skewed elements make overruns more likely than underruns
- About 50%, because it's built from the most likely values
- Above 80%
> Each most-likely value sits left of its skewed distribution's mean, so their sum falls below the total's mean and median. Here it lands near the 10th percentile. That's why a point estimate alone carries little confidence.
:::

Notice:
1. The point estimate (sum of most-likelies) typically sits **well below the 50th percentile** because right-skewed elements have means above their modes
2. Raising correlation widens the total distribution, raising all percentiles
3. The S-curve itself is your funding decision tool

+++

### Rules of Thumb

**Means add**; modes, medians, and percentiles do not.
$$E[\text{Total}] = \sum E[X_i] \text{ (always)}$$
$$\text{50th percentile of total} \ne \sum (\text{50th percentile of each element})$$

When elements are uncorrelated, summing percentiles gives a number that is **too high** (ignoring diversification). When correlation is unknown, assume a modest positive value (around 0.2–0.3) rather than zero.

:::check
Q: A triangular element has Low 80, ML 100, High 150. Mean?
= 110
> $(80+100+150)/3 = 330/3 = 110$
:::

:::check
Q: Can you get the 80th percentile of total cost by adding each element's 80th percentile?
- Yes, percentiles always add
* No; only means add; use the simulated total distribution
- Only if perfectly correlated
> Summing percentiles gives a number that is too high when correlation < 1. The S-curve is your true measure.
:::`
    },
    {
      id: 'methods', title: 'Risk Methods: Historical, Expert, Risk Cube', summary: 'Real-world examples of each method, biases to watch, and the risk cube math',
      body: String.raw`### Historical Cost Risk Methods

Apply empirically observed cost growth from comparable, completed programs to the current estimate.

**Example** (used at MDA and DNI CAIG): scoring is interval with objective criteria, historical dollar basis, RERs map risk score to cost distribution. All four risk types are covered, below-the-line risk flows in via functional correlation, and Monte Carlo is the computation engine. For **cost estimating (CE) risk**, the CER's standard errors/SEE drive the risk; for **S/T risk**, SMEs score hardware on six categories (Technology Advancement, Engineering Development, Reliability, Producibility, Alternative Item, Schedule) and software on seven (Technology Approach, Design Engineering, Coding, Integrated Software/SLOC, Testing, Alternatives, Schedule), 0 (no risk) to 10 (high risk). Scores are combined into a weighted average and mapped, via regression against SAR-derived cost growth factors, to a triangular distribution for cost growth (Fig. 9.14).

**Worked example**: three SMEs score a program's software requirements maturity — Expert A = 3 (low), Expert B = 5 (medium), Expert C = 7 (high) — producing three triangular distributions whose overlay resembles a right-skewed composite. For the Research & Development cost, starting from the Initial Point Estimate (IPE), cost estimating risk adds **8.7%**, then schedule/technical risk adds **25%**, for a total risk of **33.7%** — growth invisible to a bare point estimate.

**Pros**: grounded in actual outcomes, captures "unknown unknowns." **Cons**: needs a large, homogeneous reference class; historical data must be adjusted for things outside risk analysis (quantity, requirements growth); past programs may not represent future risk drivers.

+++

### Expert Opinion Methods

Used by, e.g., the National Geospatial-Intelligence Agency (NGA). SMEs directly assess cost distributions rather than using risk scores; the model covers all four risk types, uses functional correlation for below-the-line elements, triangular distributions, and Monte Carlo.

**A specific method** adapted the Software Engineering Institute's (SEI) Software Risk Evaluation, using an SEI taxonomy with three classes: **Product Engineering** (technical aspects of the work), **Development Environment** (methods, procedures, tools used), and **Program Constraints** (contractual/organizational/operational factors outside the org's control). SMEs are interviewed via structured questionnaires rather than scored; results are **conflated** (see Conflation of Expert Judgments) and applied to the point estimate, then below-the-line items are burdened and rolled up.

**Timeline**: roughly **1 week** to develop the risk questionnaire, then the risk assessment itself (interviews + model setup + simulation) takes about **80 days**, and delivering the final product with documentation takes roughly **10 days**.

**Biases to guard against**:
- **Anchoring**: Experts anchor on the current point estimate and give artificially narrow ranges
- **Optimism Bias**: Experts underestimate the high side
- Experts are prone to underestimate variance even when they don't underestimate the mean

**Mitigation**: structured elicitation, cross-check against any available historical data, and treat stated low/high as roughly the 10th/90th (or 15th/85th) percentiles rather than absolute limits.

:::tip Beyond CEBoK: motivational bias and the Delphi method
Program advocates sometimes intentionally narrow ranges to make a program appear less risky — a **motivational bias** distinct from anchoring or optimism bias. A common mitigation is the **Delphi method**: anonymized, iterative expert elicitation that reduces social pressure to converge toward a program-favorable answer, often paired with asking "what would have to happen to reach the extreme value?" to widen an expert's thinking.
:::

+++

### The Risk Cube Method

A **risk matrix** rating individual risks on **Likelihood** and **Consequence** (typically 1–5 each). SMEs identify each risk factor and estimate the probability of occurrence ($P_x$) and cost impact if it occurs ($C_x$). This is naturally modeled as a **Bernoulli** distribution per risk:

$$\text{Mean of each risk: } E_x = P_x \cdot C_x \qquad \text{Total cost risk} = \sum P_x C_x = \sum E_x$$
$$\text{Variance of each risk: } \text{Var}(X) = P_x(1-P_x)C_x^2 = E_x(1-P_x)C_x$$

:::note CEBoK's printed variance formula
CEBoK's own text prints $\text{Var}(X) = P_x(1-P_x)C_x = E_x(1-P_x)$ — missing the square on $C_x$ in both forms. The correct Bernoulli-risk variance squares the cost impact, as shown above; this app uses the corrected version.
:::

Mean, min, and max are straightforward; **percentiles and medians require a Monte Carlo simulation**. The risk cube generally addresses schedule and technical risk; below-the-line elements and correlation are **not** typically addressed, so while useful for management, it paints an incomplete cost-risk picture.

**Pros**: intuitive, easy to integrate into a PM's risk management process, individual risks are identifiable and manageable. **Cons — it almost always understates risk**: SMEs are biased low on both probability and cost impact; some risk is inevitably unforeseen; the sum of many "too trivial to catch" risks can exceed the largest single risk; and categories like requirements or threat risk (generally unforeseeable) may be omitted entirely.

**Management Reserve vs. Risk**: Management reserve (Fig. 9.27, a percentage of contract value that varies by contract type) is money held back to challenge account managers — it is **not** the same as risk or contingency funds, which are extra funds beyond the point estimate to cover risk possibilities.

**Critical distinction**: The risk cube is fundamentally a **qualitative ranking tool** for prioritization and management attention. It is NOT a statistically rigorous method for deriving a total cost probability distribution (the way Monte Carlo or method-of-moments are). It **complements** quantitative analysis but does NOT replace it. Ideally, the risk cube and a historical analysis run in parallel.

:::widget risk-cube:::

:::check
Q: A risk has 30\% chance of adding \$10M. Its expected value = ?
= 3
> EV = $0.30 \times 10 = 3$M
:::

:::check
Q: A risk cube item has $P_x = 0.4$ and $C_x = \$5M$. Using the corrected formula, what is its variance (in \$M²)?
= 12
> $\text{Var} = P_x(1-P_x)C_x^2 = 0.4(0.6)(25) = 12$. (CEBoK's printed formula omits the square on $C_x$.)
:::

:::check
Q: Why does the risk cube almost always understate total risk?
* SMEs tend to be optimistic about both the number and magnitude of risks, plus some risks go unforeseen entirely
- It uses Monte Carlo simulation, which is inherently biased
- It always uses too few likelihood levels
> SME optimism, unforeseen risks, the sum of "trivial" risks, and omitted categories (requirements/threat) all push the risk cube's total below reality.
:::

:::check
Q: Why is summing the expected values of all discrete risks a poor substitute for simulation?
* It gives the mean impact but not the spread; with few risks, the actual outcome is often 0 or full impact
- Expected values cannot be added
- It overstates total risk
> The expected value is correct on average, but budgeting to it ignores how lumpy real outcomes are (either the risk happens or it doesn't).
:::

:::check
Q: The Risk Cube is best used for:
* Prioritizing risks for management attention
- Deriving a rigorous total cost probability distribution
- Replacing Monte Carlo simulation
> The risk cube is a qualitative prioritization tool. Simulation is needed for quantitative estimates.
:::

+++

### Cross-Checks and Testable Topics

After computing a model, **cross-check** its calculated statistics (mean, CV) and inputs against analogous programs, to build confidence and explain similarities/differences in growth.

:::note CEBoK's Testable Topics
**Testable**: Types of Risk; Input- vs. Output-Based vs. Scenario-Based vs. Risk Cube vs. Expert Opinion; calculating risk dollars.
**Testable, but less emphasized**: interpretation of percentiles of a CDF of total cost; role of correlation in cost risk analysis; schedule risk analysis.
**Not testable**: joint cost and schedule risk analysis; independence and risk.
:::`
    },
    {
      id: 'related', title: 'CER Uncertainty and Confidence Levels', summary: 'How regression statistics feed risk models; choosing a confidence level',
      body: String.raw`### Uncertainty Around CER Estimates

A **least-squares CER** produces a regression equation and associated statistics that directly feed into a risk model:

**Linear (unit-space) CER**: Residuals are approximately normal around the predicted value. Use the **standard error of the estimate (SEE)** to define a normal distribution, or use the **prediction interval** for more conservative bounds. Analysts often use SEE as a proxy for uncertainty, but the SEE is the standard error of the points *around the regression line*, not the standard error of the estimate itself — using SEE alone introduces a systemic bias, understating variability both above and below the median (see CER Prediction Intervals for the correct approach and worked numbers).

**Log-space CER** (power or exponential form): Errors are normal in log space, which means the distribution in dollar space is **lognormal** — right-skewed. The log-space SEE becomes $\sigma$ of $\ln(\text{cost})$.

**Inclusion of input uncertainty**: Also model uncertainty in the input values themselves (e.g., weight on a weight-based CER), which propagates through and adds to the total uncertainty.

:::check
Q: A power-form CER fit in log-log space has SEE = 0.25 in log space. Best distribution for cost uncertainty?
- Normal with $\sigma$ = \$0.25M
* Lognormal with $\sigma$ of ln(cost) = 0.25
- Uniform
> Log-space errors are normal → dollar-space is lognormal (right-skewed). The log SEE is the $\sigma$ of the log.
:::

+++

### Confidence Levels and Contingency

A **risk-adjusted estimate** pairs a point estimate with a **confidence level** (percentile) from the S-curve.

**Common reference points**:
- **Point estimate** (sum of most-likely values): typically sits **below 50%** confidence for right-skewed totals
- **70th or 80th percentile**: Common management choices for program funding (higher percentile = more conservative)

**Contingency / Reserve** = (Cost at chosen confidence level) − (Point estimate or baseline)

**Critical principle**: Selecting the funding confidence level is a **risk-management / policy decision**, not a purely statistical calculation. The estimator's job is to produce an accurate, defensible S-curve; management chooses where on that curve to fund.

:::tip Beyond CEBoK: typical numeric ranges
CEBoK doesn't give a fixed number for where the *mean* sits, but practitioners commonly see it land around **50–60%** confidence for right-skewed totals (above the point estimate, since means exceed modes for skewed distributions). 70th/80th percentile targets, as above, are common — but always a policy choice, not a statistical constant.
:::

:::check
Q: Decision-maker wants 80\% confidence of not exceeding budget. Where do you read the answer?
* The 80th percentile on the S-curve (CDF)
- Point estimate × 1.8
- Sum of each element's 80th percentile
> The S-curve maps cost (x-axis) to confidence level (y-axis). Read up from 80% to find the cost.
:::

:::check
Q: "The point estimate is \$100M." What is missing from this statement?
* A confidence level / S-curve position
- A list of which CERs were used
- The project schedule
> Always state: "\$100M represents the [X]th percentile" to show what risk/reserve that represents.
:::`
    },
    {
      id: 'cer-pi', title: 'CER Prediction Intervals in Risk Models', summary: 'Why SEE understates uncertainty, the prediction-interval formula, and feeding it into Monte Carlo',
      body: String.raw`### Confidence Interval vs. Prediction Interval

A **confidence interval (CI)** is a range for the *true mean* of a parameter at a given significance level $\alpha$ (an $\alpha$ of 0.05 = 95% confidence). A **prediction interval (PI)** is the interval for a *y-value at a specific fitted X*, not the mean — so a PI is always **wider** than a CI, because it includes both the error in the regression coefficients and the error of the individual prediction.

Since the error around the regression line is assumed normal (symmetric), an 80% PI has a 10% chance the actual cost falls below it and a 10% chance above. Equivalently, the PI's endpoints for a given $\alpha$ are the $\alpha/2$ and $1-\alpha/2$ percentiles of the CDF implied by the CER.

**Why not just use SEE?** SEE is the standard error of points around the regression line — not the standard error of the *estimate*. Using SEE alone as the uncertainty measure produces a **systemic bias**, understating variability both above and below the median; the prediction interval is the correct measure.

+++

### The Prediction Interval Formula

$$\hat{Y} \pm t_{\alpha/2,\,df} \cdot SEE\sqrt{1 + \frac{1}{n} + \frac{(X-\bar{X})^2}{\sum X^2 - n\bar{X}^2}}$$

where $\hat Y$ is the CER estimate, $t_{\alpha/2,df}$ is the critical t-value, $n$ is the number of observations, $\bar X$ the mean of the X-values, and $\sum X^2$ the sum of squared X-values.

### Worked Example (Fig. 9.36)

A linear CER: $\text{cost} = 6.571 + 7.714 \cdot \text{weight}$, with SEE = 1.219, $n = 7$ (residual df = 5), $\bar X = 4$, $\sum X^2 = 140$.

For weight = 4.5: $\hat Y = 6.571 + 7.714(4.5) = 41.29$.

$$41.29 \pm t_{\alpha/2,5} \cdot 1.219\sqrt{\frac{8}{7} + \frac{(4.5-4)^2}{140-7(16)}} = 41.29 \pm t_{\alpha/2,5} \cdot 1.219\sqrt{1.1429 + 0.0089}$$

$$\sqrt{1.1518} = 1.0733 \quad\Rightarrow\quad 1.219 \times 1.0733 = 1.308$$

$$\boxed{41.29 \pm t_{\alpha/2,5} \cdot 1.308}$$

+++

### Using the Prediction Interval in Monte Carlo

1. Draw a random number $u$ between 0 and 1 — this is the target percentile.
2. Convert to $\alpha$: if $u \le 0.5$, $\alpha = 2u$; if $u > 0.5$, $\alpha = 2(1-u)$.
3. Look up $t_{\alpha/2, df}$ and compute the PI: $\hat Y \pm t_{\alpha/2,df}\cdot SEE\sqrt{\cdots}$.
4. If $u < 0.5$, take the **left** (lower) endpoint of the PI as this trial's value; otherwise take the **right** (upper) endpoint.

Fig. 9.37 shows the resulting statistics from 1000 trials of this process for the example CER.

+++

### Nonlinear and Multivariate Cases

**Nonlinear (e.g. exponential $y=ae^{bx}$)**: linearize by taking logs ($\ln y = \ln a + bx$), apply the same PI methodology in log space, then transform the result back to unit space before use.

**Multivariate**: the matrix-form prediction interval is
$$Z^T\beta \pm t_{\alpha/2,\,n-k} \cdot \sigma\sqrt{1 + Z^T(X^TX)^{-1}Z}$$
where $Z$ holds the independent-variable values for this prediction (last entry = 1, for the intercept), $\beta$ the fitted coefficients, $X$ the independent-variable data matrix, and $\sigma$ the SEE; degrees of freedom = number of observations minus number of coefficients.

:::widget cer-pi:::

:::check
Q: Why is a prediction interval always wider than a confidence interval at the same $\alpha$?
* It includes both the regression coefficients' error and the error of the individual prediction, not just the mean's error
- It uses a smaller sample size
- Prediction intervals use a normal distribution instead of the t-distribution
> The CI bounds the true mean; the PI bounds an individual predicted value, which carries additional prediction error.
:::

:::check
Q: For the Fig. 9.36 CER example, weight = 4.5 gives $\hat Y = 41.29$ with SEE = 1.219, $n=7$, $\bar X=4$, $\sum X^2=140$. What does SEE get multiplied by inside the prediction interval?
= 1.308 ±0.01
> $\sqrt{1+1/7+(0.5)^2/(140-7\cdot16)} = \sqrt{1.1518}=1.0733$; $1.219\times1.0733=1.308$.
:::

:::check
Q: In the Monte Carlo prediction-interval method, a random draw gives $u = 0.7$. What is $\alpha$, and which PI endpoint is used?
* $\alpha = 2(1-0.7) = 0.6$; use the right (upper) endpoint
- $\alpha = 2(0.7) = 1.4$; use the left endpoint
- $\alpha = 0.7$; use the mean
> Since $u > 0.5$: $\alpha = 2(1-u) = 0.6$, and the upper (right) PI endpoint is used.
:::

:::check
Q: A non-linear (power-form) CER's prediction interval was computed in log space. What must happen before using it in a Monte Carlo trial?
* Transform the result back to unit (dollar) space
- Nothing further is needed
- Multiply by the SEE again
> Log-space PI results must be exponentiated back to unit space before being used as a cost value.
:::`
    },
    {
      id: 'schedule', title: 'Schedule Risk', summary: 'Parallel vs. serial networks, crosslinks, and the RAND schedule growth distribution',
      body: String.raw`### How Schedule Networks Behave

Schedule networks are **stochastic, not deterministic** — this leads to some unusual conclusions. Consider two independent tasks running in parallel: Task A averages 10 hours, Task B averages 8 hours, both normally distributed with CV ≈ 20%. The schedule finishes only when *both* finish.

Naive intuition says the longer task (A, mean 10) sets the overall schedule mean. But 1000 simulated trials (Fig. 9.38) show the **finish time's mean exceeds either individual task's mean** — because in about **20%** of trials, Task B ends up taking longer than Task A. With parallel tasks, either one can end up dictating the critical path.

*This effect compounds*: as more parallel tasks (each normally distributed, mean 10) are added, the critical path's average duration keeps rising (Fig. 9.39) — with more tasks, the likelihood at least one exceeds the mean increases. Raising the CV increases both the magnitude and speed of this critical-path growth.

+++

### Serial Links and Crosslinks

Fig. 9.40 compares Monte Carlo results across schedule topologies, all with an expected critical path duration of 10:

- *Intuition suggests* serial (direct dependency) task chains would worsen schedule risk — but results show **series links actually dampen variability and growth**.
- **Parallel tasks widen variability**, as above.
- A **crosslink** (a task dependent on two or more prior tasks) also **widens variability** — a crosslinked task is effectively serially connected to the *result* of multiple parallel paths, so it inherits their duration issues.

*A schedule with many parallel and/or crosslinked tasks should alert the analyst to significant schedule risk.*

+++

### The RAND Schedule Growth Dataset

A study of the RAND Cost Growth Database, after removing programs with risk-reduction phases, left **59 programs**. Key findings:
- **CV of 42%** — fairly wide dispersion
- Mean Schedule Growth Factor (SGF) of **1.29**, exceeding the median of **1.11** — significant right skew
- Over **20%** of programs show little to no schedule growth — possibly because well-performing programs delay delivery when there's slack, or underperforming programs defer fixes/rush code to hit the baseline schedule

A cluster of data points sits right at SGF = 1.00, complicating the choice of distribution. Both **Lognormal** and **Extreme Value** fit reasonably; the recommended approach is to pick the *theoretically correct* distribution, not just the best-fitting one. Here, **Extreme Value** wins: Extreme Value distributions predict things like the century's highest flood or biggest hurricane, and a schedule is dominated by the *latest* of its parallel paths — the same character of question.

+++

### The Hybrid Distribution

Extreme Value alone fails the Kolmogorov-Smirnov test: K-S statistic **0.161**, well above the critical value **0.113**. The glut of points at SGF = 1.00 is the culprit. The fix: set aside the SGF = 1.00 points, fit Extreme Value to the rest (statistically significant), then add back a **20.3%** probability mass at SGF = 1.00 — the resulting **hybrid distribution** fits the full dataset well.

Use Extreme Value alone to model the *actual* SGF; use the hybrid if modeling the *likely reported* SGF (assuming some fraction of the 1.00 cluster is an artificially forced on-schedule result).

+++

### Cost/Schedule Growth and Program Size

Looking at CGF vs. SGF directly shows **no discernible pattern** — but once program size is added back in, both CGF and SGF separately relate to size, so size differences were confounding the comparison. After normalizing for size (see Program Size, in Historical Cost Growth), the conclusion holds: no clear CGF-SGF relationship even with size controlled for.

Correction factors for schedule risk (Fig. 9.49), applied depending on the analyst's starting point:
- If the program was expected to finish on time but is found to be stretching (schedule changes): multiply cost by **1.11** (useful if schedule risk isn't already captured elsewhere — watch for double-counting).
- If the risk method is schedule-blind and there's credible indication the program will finish **on time**: decrement risk-adjusted cost by a factor of **0.9**.

:::widget schedule-network:::

:::check
Q: Two independent parallel tasks, A (mean 10) and B (mean 8), must both finish before the schedule is done. What happens to the overall finish time's mean vs. Task A's mean?
* It exceeds Task A's mean — in some trials B ends up taking longer and drives the critical path
- It equals Task A's mean exactly, since A has the higher average
- It equals the average of A and B
> In roughly 20% of 1000 simulated trials, B outlasts A; because either task can dictate the critical path, the overall mean exceeds either individual task's mean.
:::

:::check
Q: Which schedule topology *dampens* variability and growth, contrary to intuition?
* Serial (direct dependency) chains
- Parallel tasks
- Crosslinked tasks
> Series links dampen variability/growth; parallel tasks and crosslinks (dependent on 2+ prior tasks) both widen it.
:::

:::check
Q: The RAND dataset shows mean SGF = 1.29 and median SGF = 1.11. What does this tell you about the distribution's shape?
* It is right-skewed (mean pulled above the median by high-growth outliers)
- It is left-skewed
- It is perfectly symmetric
> Mean > median indicates a right-skewed distribution — consistent with a CV of 42% and the Extreme Value/hybrid fit chosen.
:::

:::check
Q: Why is the Extreme Value distribution theoretically preferred over Lognormal for schedule growth, even though both fit reasonably?
* Schedule completion is dominated by the latest of several parallel paths — exactly what Extreme Value distributions model (e.g. flood/hurricane maxima)
- Extreme Value always has a better K-S statistic
- Lognormal cannot have a mode
> The theoretical match (schedule = max of parallel paths) is the deciding factor, not raw fit statistics alone — though the hybrid is still needed to pass K-S.
:::`
    },
    {
      id: 'growth', title: 'Historical Cost Growth & SARs', summary: 'SAR data quality issues, growth trends by phase, EVM-based CPI prediction, and program size',
      body: String.raw`### Data Sources: SARs vs. Contract Data

**Selected Acquisition Reports (SARs)** are DoD's primary source for cost risk data — vendors submit one per acquisition year, and Section 13 (Cost Variance Analysis) shows year-over-year cost changes plus the latest revised estimate. Using the revised (quantity-adjusted) estimate against the baseline estimate lets the analyst calculate the **Cost Growth Factor (CGF)**.

**Contract data** (EVM or Contractor Cost Data Reporting/CCDR) is another source, but harder to use — changing baselines, missing variance explanations, and limited access across a wide range of programs. A **Kolmogorov-Smirnov (K-S) test** found **no statistically significant difference** between contract data and SAR data for programs under **\$1B RDT&E** (failed to reject the null of identical distributions) — though contract data shows *more extreme* growth and dispersion than prior SAR studies found. Given that, **SAR-type data is preferred when available**.

+++

### Common SAR Data Problems

Working with SAR-type data, analysts must adjust for:
- **Quantity**: remove quantity changes from cost growth, or the CGF gets distorted (e.g. same total cost on half the baseline quantity halves the apparent CGF)
- **Beginning points**: prefer data starting at the earliest development stage
- **Cohorting**: group programs covering the same lifecycle phases to avoid distortion
- **Applicability**: are the database's programs fair comparables to the one being assessed?
- **Currency**: data from 1986 or later is generally usable if the dataset is large enough; more recent data is preferred when sufficient applicable points exist

**EVM re-baselining caveat**: a program is often re-baselined during a contract, and the impact of re-baselining is hard to identify from EVM data without deep program knowledge.

+++

### Cost Growth Trends by Phase and Agency

Total cost growth is similar whether or not a program had a risk-reduction phase, but the CGF is *higher* for programs that did have one (Fig. 9.30) — likely because such programs were funded earlier due to inherently higher risk. Growth also varies across agencies (Fig. 9.32), but this largely reflects program-size differences (smaller programs → more relative growth) rather than a true agency effect.

Growth is also **correlated between contiguous phases** — one DoD study found a **0.75 correlation** between the risk-reduction and development phases' growth. Production-phase cost estimates similarly correlate with development-phase actuals, since development is where a program learns about production/procurement costs.

+++

### EVM-Based CPI Prediction

The Cost Performance Index is $\text{CPI} = \dfrac{\text{Earned Value}}{\text{Actual Cost of Work Performed}}$ — useful for cost performance *to date*, but says nothing directly about future growth. A 2003 study built a predictive model:

$$\text{Final CPI} = 0.438 + 0.057 \times (\%\text{Complete}) + 0.497 \times (\text{Current CPI})$$

The model has a constant slope across CPI and percent-complete levels (no interaction term) and considerable noise in the underlying data; the study's data were cell averages, adding noise not reflected in the model inputs, so its confidence/prediction intervals are understated. Percent-complete was not cohorted (programs weren't tracked through time), so the slope reflects the *predicted endpoint*, not a predicted path.

+++

### Program Size and Cost Growth

Smaller programs consistently show **higher relative cost growth** — a pattern that holds across hardware/software and development/production splits, resembling $\text{CGF} \approx 1/\text{Size}$. The RAND RDT&E dataset gives a specific prediction equation:

$$\text{Predicted CGF} = 1.8 \times (\text{MS II Baseline Size, \$M})^{-0.3} + 1.1$$

Dispersion around this prediction is symmetric, but **wider at lower size values** — small programs are both more likely to grow *and* less predictable about how much.

:::check
Q: A K-S test found no statistically significant difference between contract data and SAR data. For which programs does this hold?
* Those under \$1B RDT&E
- All programs regardless of size
- Only production-phase programs
> The K-S test result was specific to programs under \$1B in RDT&E; contract data showed more extreme dispersion overall.
:::

:::check
Q: Why must analysts adjust SAR data for quantity before computing a Cost Growth Factor?
* Because a quantity change alone (with the same total cost) would distort the CGF, even with no real cost growth
- Because SAR data never reports quantity
- Because quantity changes always indicate fraud
> If the baseline quantity is halved but total cost is unchanged, the CGF is thrown off by a factor of two purely from the quantity change.
:::

:::check
Q: Using the size-based CGF prediction equation, what is the predicted CGF for a program with MS II baseline size of \$8M?
= 2.06 ±0.05
> $1.8 \times 8^{-0.3} + 1.1 = 1.8 \times 0.5359 + 1.1 = 0.965 + 1.1 = 2.06$
:::

:::check
Q: In the EVM Final CPI model, which two inputs predict the completed program's CPI?
* Percent complete and the current CPI
- Only the current CPI
- Only percent complete
> $\text{Final CPI} = 0.438 + 0.057(\%\text{Complete}) + 0.497(\text{Current CPI})$ — both terms matter; there is no interaction term, so the effect of each is a constant slope.
:::`
    },
    {
      id: 'conflation', title: 'Conflation of Expert Judgments', summary: 'Merging multiple SME triangular distributions the right way',
      body: String.raw`### The Problem

An analyst consults several experts about one risk item; each provides a triangular distribution. **Conflation** is how these distributions get merged into one probability distribution for that element — first introduced under Expert Opinion Methods.

+++

### Incorrect Approach

**Average the draws**: for every Monte Carlo trial, draw a value from *each* expert's distribution and average them. This seems intuitive but is **wrong** — it **understates the dispersion** among the experts' estimates (averaging draws smooths out exactly the disagreement you're trying to capture).

+++

### Correct Approaches

Choose based on what the experts' disagreement represents:

**If the SMEs reflect a similar assessment of the risk factor:**
- Average the low, mean, and high parameters across the expert triangular distributions into one new distribution, and draw from *that*.
- Randomly choose a percentile, and average that percentile's value across the experts (e.g. a trial could be the average of all five experts' 30th-percentile values).

**If the SMEs reflect multiple different realities:**
- **Stack the distributions**: scale each expert's PDF by $1/n$ (e.g. divide by 5 for five experts), stack the scaled PDFs, and draw from the combined distribution.
- **Pick a random expert per trial**: one trial draws entirely from Expert 1's distribution, the next trial entirely from Expert 4's, etc.

:::widget conflation:::

:::check
Q: Five experts each give a triangular estimate for the same risk item. For each Monte Carlo trial, an analyst draws one value from each expert's distribution and averages the five draws. What is wrong with this?
* It understates the dispersion among the experts' estimates
- Nothing; this is the standard correct approach
- It overstates the mean
> Averaging per-trial draws smooths out expert disagreement, systematically narrowing the resulting distribution's spread.
:::

:::check
Q: The analyst believes the five experts are capturing genuinely different possible realities, not just noisy versions of the same judgment. Which conflation approach fits best?
* Scale each expert's PDF by 1/5 and stack them, or randomly pick one expert's full distribution per trial
- Average the low/mean/high parameters into one distribution
- Average a random percentile across all five experts
> "Multiple realities" call for stacking (scaled PDFs) or per-trial random-expert selection; averaging parameters or percentiles is for experts reflecting a *similar* assessment.
:::

:::check
Q: If the SMEs are believed to share a similar assessment of the risk, which conflation methods are appropriate?
* Average the L/M/H parameters into a new distribution, or average a randomly chosen percentile across experts
- Only stacking scaled PDFs
- Only picking a random expert per trial
> Parameter-averaging and percentile-averaging both apply when experts are reflecting one shared reality rather than distinct ones.
:::`
    }
  ],
  cards: String.raw`
## Definitions
Q: Risk (in cost analysis)
A: An uncertain future event that, if it occurs, has negative effect on cost/schedule/performance; characterized by probability and consequence.
Q: Uncertainty
A: Inherent, irreducible variability in a future outcome; exists even with no specific bad event happening (e.g., labor rate variation).
Q: Cost Risk Analysis
A: Combining uncertainty (in inputs/CERs) with discrete risk events to produce a probability distribution of total program cost.
Q: Cost growth vs. cost risk
A: Cost growth is the past increase in cost from initial estimate to final actual; cost risk is future, predicted cost growth.
Q: The four components of Cost Growth / Cost Risk
A: Cost Estimating, Schedule/Technical, Requirements, and Threat (growth or risk). Requirements and Threat are normally implicit when risk is assessed.
Q: Schedule/Technical (S/T) risk
A: Difficulty conquering problems posed by the design in the CARD or specs, e.g. an infeasible, tight schedule.
Q: Requirements risk
A: Unforeseen design shifts from shortfalls in requirements/spec documentation; design's inability to meet the mission or misinterpretation of the solution.
Q: Threat risk
A: Defense/intelligence risk from new threats revealed in a System Threat Assessment Report (STAR).
Q: Opportunities (vs. risk)
A: Factors that could result in a positive outcome, such as finishing early or reducing cost exposure.
Q: Cost Growth Factor
A: $\dfrac{\text{Actual Cost}}{\text{Estimated Cost}}$ — ratio of actual to estimated cost on completed programs.
Q: Fraction of programs at/below their cost estimate (historical study)
A: Only 16% — point estimates sit at a much lower percentile than often assumed.
Q: Point estimate from a linear CER or analogy is interpreted as...
A: The mean of the cost probability distribution.
Q: Point estimate from a non-linear CER is interpreted as...
A: The median of the cost probability distribution.
Q: Point estimate from SME judgment is interpreted as...
A: The mode — though there is limited information to verify this assumption.
Q: Four causes of understated variability
A: Omitted risks/bias, missing functional or risk correlation, insufficient data (wide CER PIs), and systematic understatement in non-linear CERs.

## Models and Architecture
Q: Input vs. Output risk models
A: Input methods assess uncertainty in cost drivers/CER error; Output methods add schedule/technical/other risk as a mean shift (e.g. risk registers). Not safe to combine both on the same driver.
Q: Historical vs. Expert-opinion basis for a risk model
A: Historical applies growth/CV from similar completed programs; Expert-opinion elicits SME judgment (scored matrix mapped to CGF, or direct three-point/triangular assessment).
Q: Three components of a cost risk model
A: Inputs (scoring + dollar basis), Structure (organization + probability model), Execution (computation + cross-checks).
Q: Three scoring methods, in preference order
A: Ratio (objective criteria, distance meaningful) > Interval (distance meaningful, no objective criteria) > Ordinal (relative only).
Q: Three dollar-basis methods, in preference order
A: Historical (actual growth from analogous programs) > Domain Expert (SME experience) > Conceptual (arbitrary, least preferred).
Q: Four ways to assign cost to risk
A: RERs (Cost Impact = f(Risk Score), preferred), Direct Assessment of Distribution Parameters, Factors (linear RER subset), Rates (flat \$/point).
Q: What is a functional relationship in a risk model?
A: One element computed from another (e.g., SEPM = 15\% of hardware). It passes uncertainty through and creates perfect (functional) correlation.
Q: Why is it unsafe to combine input and output risk methods on the same driver?
A: The output method's predicted cost risk has already been reflected as cost growth in the historical data the input method uses — double counting results.

## Distributions
Q: Normal distribution: three conditions
A: Most likely value = mean; equally likely above/below mean; more likely closer to mean (68% within 1 std dev). Allows negative values; symmetric (must be shifted to move the mean).
Q: Lognormal distribution: conditions
A: Unbounded above, finite lower bound; positively skewed; ln(variable) is normal. Natural result of non-linear CERs; ~indistinguishable from Normal when CV<25%.
Q: Triangular distribution: conditions
A: Min/max pre-determined; mode between them; values near min/max as likely as near the mode; can be skewed or symmetric. Modes of multiple triangular variables are not additive.
Q: Beta distribution: conditions
A: Min/max pre-determined; shape set by two positive shaping parameters. Can be symmetric or skewed; solves negative-value issues normal distributions can have.
Q: Bernoulli distribution: use case
A: Discrete, probability p for value 1 and (1-p) for 0. Used in likelihood/consequence (risk cube) models; a nonzero result is a risk occurring.
Q: Which distribution should NOT be used to characterize total (summed) cost?
A: Triangular — the sum of triangular lower-level elements is not itself triangular.
Q: When is Normal likely to fit total cost? When is Lognormal likely?
A: Normal: many independent/weakly correlated, weakly skewed elements. Lognormal: more skewed or correlated elements. Many totals test as both.
Q: Convolved cost distribution
A: A simulated total distribution that doesn't resemble any specific named probability distribution.

## Triangular Distribution
Q: Triangular distribution parameters
A: $a$ = low (minimum), $c$ = most likely (mode), $b$ = high (maximum).
Q: Triangular mean formula
A: $\dfrac{a+c+b}{3}$
Q: Triangular mode
A: $c$ (the "most likely" input value by definition; NOT computed).
Q: Triangular variance formula
A: $\dfrac{a^2+b^2+c^2-ab-ac-bc}{18}$
Q: When is Mean > Mode for a triangular distribution?
A: When the high tail is longer than the low tail (right-skewed): $b - c > c - a$. Typical for cost distributions.
Q: For right-skewed triangular distribution, what is the order?
A: Mode < Median < Mean. The mean is pulled up by the far-out high tail.
Q: Why is the triangular distribution preferred in cost risk?
A: Easy to parameterize from expert three-point estimates (Low, ML, High); requires no assumption about bell-curve shape.
Q: Triangular(L=80, ML=100, H=160): mean and mode?
A: Mean = 113.33; Mode = 100. Mean is 13\% higher due to right skew.
Q: Same triangular: standard deviation?
A: $\sigma = 17.0$
Q: Triangular median formula (when $c \le (a+b)/2$)
A: $b - \sqrt{\dfrac{(b-a)(b-c)}{2}}$

## Summing vs. Adding
Q: Means are additive (always true or conditional)?
A: Always true, regardless of distribution shape or correlation: $E[\sum X_i] = \sum E[X_i]$
Q: Modes are additive (always true or conditional)?
A: Not additive. Mode of sum $\ne$ sum of modes, especially for skewed distributions.
Q: Why is summing "most likely" values to get a program total wrong?
A: Modes do not add. For right-skewed elements, sum of modes understates the true expected (mean) total cost.
Q: Two triangular elements (L=80, ML=100, H=160 each, mean=113.33 each): sum of modes vs. sum of means?
A: Sum of modes = 200. Sum of means = 226.67 (the correct mean of the total). Difference = 26.67 in missed cost.

## Correlation
Q: Variance of sum of two variables
A: $\text{Var}(X+Y) = \sigma_X^2 + \sigma_Y^2 + 2\rho_{XY}\sigma_X\sigma_Y$
Q: Variance of sum (n variables)
A: $\sum_i \sigma_i^2 + 2\sum_{i<j}\rho_{ij}\sigma_i\sigma_j$
Q: Uncorrelated elements ($\rho=0$): how do variances combine?
A: Variances simply add; std dev of total grows slower than linearly (diversification). CV shrinks as more elements added.
Q: Perfectly correlated elements ($\rho=1$): how do standard deviations combine?
A: $\sigma_{total} = \sum \sigma_i$ — standard deviations add directly (no diversification).
Q: What is the effect of correlation on the mean total cost?
A: None. Correlation affects variance (spread), not mean. Means always add, regardless of correlation.
Q: What is the effect of ignoring correlation?
A: S-curve becomes too narrow (overconfident). Total risk is understated; true percentiles are higher than estimated.
Q: Default correlation assumption when unknown?
A: Modest positive value, around 0.2–0.3 (not zero). Real programs always have some shared drivers.
Q: Two elements, each $\sigma=10$, uncorrelated: total $\sigma$?
A: $\sqrt{10^2+10^2} = \sqrt{200} = 14.14$
Q: Same two elements, perfectly correlated: total $\sigma$?
A: $10 + 10 = 20$
Q: Functional correlation
A: Correlation arising automatically between source and derivative variables via CER/functional dependency (e.g. PM cost as a % of software cost).
Q: Relational correlation
A: A framework using the geometry of regression/bivariate normal variables to assign or judge assumed correlation reasonableness.
Q: Injected correlation
A: Correlation imposed by asking SMEs to quantify a likely value; hard for SMEs to estimate accurately, and hard to cross-check.
Q: "No correlation" assumption: consequence
A: Assumes all elements independent, which likely produces an inaccurate (too-narrow) estimate.

## Monte Carlo and S-Curves
Q: Monte Carlo simulation: what is one iteration?
A: Draw one value from each element's distribution (respecting correlation), sum to get one total-cost sample.
Q: What makes Monte Carlo "Monte Carlo"?
A: Repeated random sampling (thousands of iterations) to build an empirical output distribution.
Q: PDF vs. CDF
A: PDF = probability density (the "height" at each cost value, area under = probability). CDF = cumulative prob: $P(X \le x)$ for each cost $x$.
Q: What is the S-curve?
A: The CDF of total cost, plotted with cost on x-axis, cumulative probability (confidence level) on y-axis. Characteristic S shape.
Q: How do decision-makers use the S-curve?
A: Pick desired confidence level on y-axis, read across to find the corresponding cost on x-axis. That is the budget needed.
Q: Typical position of the point estimate on the S-curve?
A: Well below 50\% confidence. Point estimate (sum of modes) is lower than the mean (sum of means) for right-skewed elements.
Q: Triangular(L=80, ML=100, H=150): mean?
A: $(80+100+150)/3 = 110$

## Risk Methods
Q: Historical risk method: advantage
A: Grounded in actual outcomes, not subjective judgment; captures "unknown unknowns."
Q: Historical risk method: limitation
A: Requires large, homogeneous reference class; past programs may not represent future risk drivers.
Q: Historical model example (BMDO/MDA/DNI CAIG): CE risk, S/T risk, and total
A: CE risk 8.7% + S/T risk 25% = total risk of 33.7% added to the Initial Point Estimate.
Q: Hardware risk scoring categories (6)
A: Technology Advancement, Engineering Development, Reliability, Producibility, Alternative Item, Schedule.
Q: Software risk scoring categories (7)
A: Technology Approach, Design Engineering, Coding, Integrated Software (SLOC), Testing, Alternatives, Schedule.
Q: SEI taxonomy: three major risk classes
A: Product Engineering (technical work), Development Environment (methods/procedures/tools), Program Constraints (contractual/organizational factors).
Q: Expert-based risk assessment timeline (SEI method)
A: ~1 week for the questionnaire, ~80 days for the risk assessment, ~10 days for delivery of results.
Q: Three-point estimate in expert elicitation
A: Low (optimistic), Most Likely (mode), High (pessimistic) — parameterizes triangular or beta distribution.
Q: Expert anchoring bias
A: Experts anchor on current point estimate and give artificially narrow ranges.
Q: Expert optimism bias
A: Experts underestimate the high side.
Q: Treat stated low/high as which percentiles?
A: Roughly the 10th/90th (or 15th/85th) percentiles, not absolute limits.
Q: Risk Cube: expected value and total cost risk formulas
A: $E_x = P_x C_x$ per risk; Total = $\sum E_x$.
Q: Risk Cube: correct variance formula (vs. CEBoK's printed typo)
A: Correct: $\text{Var}(X)=P_x(1-P_x)C_x^2=E_x(1-P_x)C_x$. CEBoK's text omits the square on $C_x$.
Q: Risk Cube: what requires Monte Carlo simulation, beyond mean/min/max?
A: Percentiles and medians.
Q: Risk Cube: is it a full quantitative risk model?
A: No. It is a qualitative prioritization tool; below-the-line elements and correlation are generally not addressed.
Q: Why does the risk cube tend to understate risk?
A: SMEs are biased low on probability and cost impact, some risks go unforeseen, small "trivial" risks can sum larger than the biggest single risk, and categories like requirements/threat risk may be omitted.
Q: Management Reserve vs. Risk/Contingency funds
A: Management reserve is money held back to challenge account managers (% of contract value); risk/contingency funds are extra funds beyond the point estimate for risk. Not interchangeable.
Q: Expected value of a risk
A: Probability $\times$ cost impact.
Q: Why summing expected values of risks is insufficient
A: It gives the mean but not the spread. With few risks, actual outcome is often 0 or the full impact (lumpy).

## CER Uncertainty, Confidence, and Prediction Intervals
Q: Linear CER uncertainty distribution
A: Approximately normal around predicted value, with spread from standard error of estimate (SEE) or prediction interval.
Q: Log-space CER uncertainty distribution
A: Lognormal in dollars (right-skewed); the log-space SEE is $\sigma$ of ln(cost).
Q: Risk-adjusted estimate
A: Point estimate plus a risk/contingency reserve, selected from S-curve at a specific confidence level (percentile).
Q: Typical confidence level of the point estimate
A: Below 50\% for right-skewed total distributions (sum of most-likely values is lower than the mean).
Q: Common management funding confidence levels
A: 70th or 80th percentile, reflecting organizational risk tolerance.
Q: Is there a universally mandated confidence level?
A: No. Selecting confidence level is a management/policy decision, not purely statistical.
Q: Contingency / Reserve formula
A: (Cost at chosen confidence level) − (Point estimate or baseline)
Q: What should accompany every point estimate?
A: Confidence level / S-curve position. Never present a single cost number without stating what percentile it represents.
Q: Why is a prediction interval wider than a confidence interval?
A: The PI includes both the error in the regression coefficients and the error of the individual prediction; the CI only bounds the true mean.
Q: CER Prediction Interval formula
A: $\hat{Y} \pm t_{\alpha/2,df}\cdot SEE\sqrt{1+\tfrac{1}{n}+\tfrac{(X-\bar X)^2}{\sum X^2-n\bar X^2}}$
Q: Fig 9.36 CER example: point estimate for weight=4.5
A: $\hat Y = 6.571+7.714(4.5)=41.29$
Q: Fig 9.36 CER example: the PI's SEE multiplier
A: 1.308 (from $1.219\times\sqrt{1.1518}$)
Q: Monte Carlo with CER prediction intervals: converting a random draw $u$ to $\alpha$
A: If $u\le0.5$: $\alpha=2u$, use the left (lower) PI endpoint. If $u>0.5$: $\alpha=2(1-u)$, use the right (upper) endpoint.
Q: Nonlinear CER prediction intervals: extra step
A: Fit and compute the PI in log space, then transform the result back to unit (dollar) space.
Q: Multivariate CER prediction interval formula
A: $Z^T\beta \pm t_{\alpha/2,n-k}\cdot\sigma\sqrt{1+Z^T(X^TX)^{-1}Z}$

## Schedule Risk
Q: Two parallel independent tasks (means 10 and 8, CV~20%, normal): effect on overall finish time mean
A: The finish time's mean exceeds either individual task's mean — in about 20% of trials the shorter-mean task (B) ends up longer, and either can drive the critical path.
Q: Effect of adding more parallel tasks on the critical path mean
A: It increases, and grows faster with higher CV — more tasks raise the odds at least one exceeds its mean.
Q: Serial links vs. parallel tasks vs. crosslinks: effect on schedule variability
A: Serial links dampen variability/growth; parallel tasks widen it; crosslinks (dependent on 2+ prior tasks) also widen it.
Q: RAND schedule growth dataset: CV, mean SGF, median SGF
A: CV 42%, mean SGF 1.29, median SGF 1.11 (right-skewed); over 20% show little/no growth.
Q: Why is Extreme Value the theoretically preferred distribution for schedule growth?
A: Schedule completion is dominated by the latest of parallel paths, matching what Extreme Value distributions model (e.g. flood/hurricane maxima).
Q: Extreme Value alone: K-S test result on RAND data
A: Fails — K-S statistic 0.161 exceeds the critical value 0.113, due to the cluster of points at SGF=1.00.
Q: Hybrid schedule distribution
A: Extreme Value fit to non-1.00 data points, plus a separate 20.3% probability mass at SGF = 1.00.
Q: Schedule correction factors (cost growth model)
A: 1.11 if a program expected on time is found to be stretching (multiply cost); 0.9 if the risk method is schedule-blind and on-time finish is credible (decrement cost).

## Historical Growth, EVM, and Program Size
Q: SAR data adjustments needed
A: Quantity, beginning points (earliest stage preferred), cohorting (same lifecycle phases), applicability, and currency (1986+ preferred if data sufficient).
Q: K-S test: contract data vs. SAR data
A: No statistically significant difference for programs under \$1B RDT&E; SAR preferred when available since contract data shows more extreme dispersion.
Q: Correlation between risk-reduction and development phase growth (DoD study)
A: 0.75
Q: EVM CPI formula
A: $\text{CPI} = \dfrac{\text{Earned Value}}{\text{Actual Cost of Work Performed}}$
Q: EVM-based Final CPI prediction model
A: $\text{Final CPI} = 0.438 + 0.057(\%\text{Complete}) + 0.497(\text{Current CPI})$
Q: Size-based CGF prediction equation (RAND RDT&E)
A: $\text{Predicted CGF} = 1.8\times(\text{MS II Baseline Size, \$M})^{-0.3}+1.1$
Q: Program size vs. cost growth relationship
A: Smaller programs show higher relative cost growth (roughly CGF ~ 1/Size); dispersion around the prediction is wider at smaller sizes.

## Conflation of Expert Judgments
Q: Conflation
A: The process of merging multiple experts' probability distributions for the same risk item into one distribution.
Q: Incorrect conflation approach
A: Averaging a random draw from each expert's distribution per Monte Carlo trial — understates dispersion among the experts.
Q: Correct conflation when experts reflect a similar assessment
A: Average the L/M/H parameters into a new distribution, or average a randomly chosen percentile value across experts.
Q: Correct conflation when experts reflect multiple realities
A: Scale each expert's PDF by 1/n and stack them, or randomly select one expert's full distribution per trial.
`
});
