PCEA.addModule({
  id: 'm09', num: 9, title: 'Cost Risk and Uncertainty', short: 'Cost Risk', source: 'guide',
  blurb: 'Why point estimates are too low, triangular distributions, Monte Carlo simulation, correlation, and how to pick a confidence level.',
  intro: String.raw`A deterministic point estimate (from a CER, analogy, or build-up) is almost never exactly right. **Cost risk and uncertainty analysis** quantifies the range of possible outcomes and their probabilities, so decision-makers can choose a budget with a known **confidence level**.

**Key insight:** A cost estimate is not a single number — it is a distribution of possible costs. The S-curve (cumulative distribution) is the primary tool for selecting a funding level.`,
  sections: [
    {
      id: 'definitions', title: 'Risk and Uncertainty Definitions', summary: 'Key terms, types of risk, why programs grow in cost',
      body: String.raw`### Risk vs. Uncertainty

- **Uncertainty**: The natural variability in an estimate because the future is not yet known. It exists even with no specific "bad thing" happening (e.g., variation in labor rates, quantities, or CER residual error).
- **Risk**: The possibility of a *specific, identifiable event* that, if it occurs, has a negative effect on cost, schedule, or performance. Described by **probability of occurrence** and **consequence (impact)** if it occurs.
- **Cost Risk Analysis**: Combining uncertainty (in inputs/CERs) with discrete risk events to produce a probability distribution of total program cost.

+++

### Types of Risk

| Type | Definition |
|---|---|
| **Technical** | Immature technology, integration problems, rework needed — uncertainty in whether the solution will work as designed |
| **Schedule** | Program delays that increase cost (overhead, learning curve disruption, inflation) |
| **Programmatic** | External/management risks: funding instability, requirements changes, acquisition strategy changes |
| **Systemic (Correlated)** | Affects many or all cost elements simultaneously (inflation, labor rate change, policy shift) — does *not* diversify away when elements are summed |
| **Random (Uncorrelated)** | Affects individual elements independently — partially cancels out when many elements are summed |

**Critical distinction**: Systemic risk does not diversify away; random risk does. Ignoring correlation between elements causes total risk to be understated.

+++

### Historical Cost Growth

Empirical studies of completed programs (e.g., DoD acquisition) consistently show:

- Actual costs **exceed** original estimates, often substantially
- The distribution of growth is **right-skewed** (a few programs grow enormously, many grow modestly)
- Causes: optimism bias, requirements creep, immature technology, schedule slips, integration/test underestimation
- **Cost Growth Factor**: $\text{CGF} = \dfrac{\text{Actual Cost}}{\text{Estimated Cost}}$

**Why this matters**: Historical cost growth is empirical proof that point estimates without risk analysis are too low on average. This justifies building probabilistic (not just deterministic) estimates.

:::check
Q: Point estimate \$200M. Comparable programs grew by median factor 1.25. What is the risk-adjusted estimate, in \$M?
= 250
> $200 \times 1.25 = 250$
:::

:::check
Q: Which type of risk affects all elements equally and does NOT diversify away when elements are summed?
* Systemic (correlated)
- Random
- Technical
> Systemic risk — such as inflation or a labor rate shift — moves every element the same way. Random risk partially cancels across many elements.
:::`
    },
    {
      id: 'models', title: 'Cost Risk Models and Architecture', summary: 'Types of models and the three components of a risk model',
      body: String.raw`### Types of Cost Risk Models

CEBoK recognizes four main approaches:

| Type | Method |
|---|---|
| **Analytic (Judgmental)** | Simple multipliers or ranges from historical growth/expert judgment applied to point estimate to create low/most likely/high bounds |
| **Simulation-Based (Monte Carlo)** | Model uncertainty at the cost-element level using distributions; run thousands of iterations summing across elements to build output distribution |
| **Method of Moments** | Analytically derive mean and variance of total using additive properties; fast but gives only moments, not full shape |
| **Expert Elicitation** | Structured expert judgment (three-point estimates) to define distributions when historical data is sparse |

+++

### Model Architecture: Inputs, Structure, Execution

A cost risk model has three interconnected components:

**Inputs** (the data you bring in):
- Point estimate for each WBS element
- Uncertainty ranges/distributions for each element (from historical data, CER statistics, or expert judgment)
- Identified discrete risk events with probability and cost impact
- Correlation assumptions between elements

**Structure** (how elements combine):
- Choice of probability distributions for each element (triangular, normal, lognormal, uniform, beta)
- Correlation structure linking cost elements
- Mathematical architecture (Monte Carlo engine, method-of-moments formula)

**Execution** (running it):
- Perform simulation (thousands of iterations) or analytical calculation
- Generate **PDF** (probability density) and **CDF** (the **S-curve**)
- Extract percentiles to support funding decisions

:::check
Q: If SEPM = 15\% of hardware cost, and hardware is uncertain, what happens to SEPM uncertainty in the simulation?
* It inherits hardware's uncertainty through the functional relationship (perfectly correlated with it)
- None — SEPM is a fixed percentage
- It must be entered separately with its own distribution
> A functional relationship automatically passes uncertainty through and creates perfect correlation.
:::

:::check
Q: Which of these is NOT typically an input to a risk model?
- Probability distributions for WBS elements
- Correlation coefficients between elements
* The simulation software's random seed value
> The seed is internal to the software; inputs are distributions, correlations, and risk events.
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
      id: 'correlation', title: 'Correlation and Total Variance', summary: 'How correlation widens the total distribution; systemic vs. random risk',
      body: String.raw`When summing multiple cost elements, **correlation between elements dramatically affects the total spread** — but not the mean.

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
- Random risk: the "good" and "bad" outcomes of different elements partially cancel

**Case 2: Perfectly Positively Correlated ($\rho = 1$)**
- $\text{Var}(X+Y) = (\sigma_X+\sigma_Y)^2$
- **Standard deviations add directly** (not variances)
- No diversification benefit
- Systemic risk: all elements move the same direction (inflation, labor rate, schedule slip)

**Case 3: Partial Correlation ($0 < \rho < 1$)**
- Covariance terms add intermediate contribution
- Typical real-world case: shared labor rates, schedule, technical risk create modest positive correlation

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
:::`
    },
    {
      id: 'scurve', title: 'Monte Carlo, S-Curves, and Confidence Levels', summary: 'Simulation, PDF/CDF, percentiles, and why point estimates sit below 50%',
      body: String.raw`### Monte Carlo Simulation Mechanics

**Monte Carlo** is the standard quantitative method for propagating element-level uncertainty and correlation to a total-program distribution.

**Steps**:
1. Assign a probability distribution (triangular, normal, lognormal, etc.) to each uncertain element
2. Specify correlation coefficients between elements (or groups sharing a common driver)
3. For each iteration (typically 1000 to 10000):
   - Randomly draw a value from each element's distribution (respecting correlation)
   - Sum across all elements to get one sample of total cost
4. Repeat to build an empirical distribution of total cost
5. Construct the output **PDF** (probability density) and **CDF** (the S-curve) and extract percentiles

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

Notice:
1. The point estimate (sum of most-likelies) typically sits **well below the 50th percentile** because right-skewed elements have means above their modes
2. Raising correlation widens the total distribution, raising all percentiles
3. The S-curve itself is your funding decision tool

+++

### Rules of Thumb

**Means add**; modes, medians, and percentiles do not.
$$E[\text{Total}] = \sum E[X_i] \text{ (always)}$$
$$\text{50th percentile of total} \ne \sum (\text{50th percentile of each element})$$

When elements are uncorrelated, percentiles sum to give a number that is **too high** (ignoring diversification). When correlation is unknown, assume a modest positive value (around 0.2–0.3) rather than zero.

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
      id: 'methods', title: 'Risk Methods: Historical, Expert, Risk Cube', summary: 'Three ways to quantify risk; biases to watch',
      body: String.raw`### Historical Methods

Apply empirically observed cost growth (or variance) from comparable, completed programs to the current point estimate.

**Approach**:
1. Gather data from a reference class of similar completed programs
2. Derive a distribution of **growth factors** (Actual/Estimated) or a **coefficient of variation**
3. Apply to the current point estimate to generate a range or full distribution

**Pros**: Grounded in actual outcomes, captures "unknown unknowns"
**Cons**: Requires a sufficiently large, homogeneous reference class; past programs may not represent future risk drivers (new technology, different acquisition strategy)

+++

### Expert Opinion Methods

When historical data is unavailable or the situation is novel, use **structured expert judgment**, most commonly via **three-point estimate**:

- **Low (L)** — optimistic/best-case value
- **Most Likely (M)** — the mode; expert's best guess of most probable value
- **High (H)** — pessimistic/worst-case value

These parameterize a **triangular** (or PERT/beta) distribution for simulation.

**Biases to guard against**:
- **Anchoring**: Experts anchor on the current point estimate and give artificially narrow ranges
- **Optimism Bias**: Experts underestimate the high side
- **Motivational Bias**: Program advocates intentionally narrow ranges to make the program appear less risky

**Mitigation**: Use structured elicitation (e.g., Delphi method with anonymized responses), ask "what would have to happen to reach the extreme value?" to widen thinking, and cross-check against any available historical data. Treat stated low/high as roughly the 10th/90th percentiles rather than absolute limits.

+++

### The Risk Cube Method

A **risk matrix** (often 5×5) that qualitatively or semi-quantitatively rates individual risks along two (or three) dimensions:

- **Likelihood** (Low/Medium/High or 1–5 scale)
- **Consequence/Impact** (Low/Medium/High or 1–5 scale, often separately for cost, schedule, performance)

**Use**:
- Prioritize which risks need active mitigation
- Rank for management attention (color-coded: green/yellow/red)
- Feed rough-order-of-magnitude cost impacts into a broader risk model

**Critical distinction**: The risk cube is fundamentally a **qualitative ranking tool** for risk management and prioritization. It is NOT a statistically rigorous method for deriving a total cost probability distribution (the way Monte Carlo or method-of-moments are). It **complements** quantitative analysis but does NOT replace it.

:::check
Q: A risk has 30\% chance of adding \$10M. Its expected value = ?
= 3
> EV = $0.30 \times 10 = 3$M
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
:::`
    },
    {
      id: 'related', title: 'CER Uncertainty and Confidence Levels', summary: 'How regression statistics feed risk models; choosing a confidence level',
      body: String.raw`### Uncertainty Around CER Estimates

A **least-squares CER** produces a regression equation and associated statistics that directly feed into a risk model:

**Linear (unit-space) CER**: Residuals are approximately normal around the predicted value. Use the **standard error of the estimate (SEE)** to define a normal distribution, or use the **prediction interval** for more conservative bounds.

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
- **Mean** of the distribution: typically around 50–60% confidence for right-skewed totals
- **70th or 80th percentile**: Common management choices for program funding (higher percentile = more conservative)

**Contingency / Reserve** = (Cost at chosen confidence level) − (Point estimate or baseline)

**Critical principle**: Selecting the funding confidence level is a **risk-management / policy decision**, not a purely statistical calculation. The estimator's job is to produce an accurate, defensible S-curve; management chooses where on that curve to fund.

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
Q: Systemic risk
A: Risk affecting many or all cost elements simultaneously (inflation, labor rate change, policy shift); does NOT diversify away when elements are summed.
Q: Random (uncorrelated) risk
A: Risk affecting individual elements independently; partially cancels out when many elements are summed (diversification).
Q: Cost Growth Factor
A: $\dfrac{\text{Actual Cost}}{\text{Estimated Cost}}$ — ratio of actual to estimated cost on completed programs.
Q: Historical cost growth pattern
A: Actual costs exceed initial estimates (right-skewed distribution); justifies probabilistic estimating, not just deterministic point estimates.
Q: Causes of historical cost growth
A: Optimism bias, requirements creep, immature technology, schedule slips, integration/test underestimation.

## Models and Architecture
Q: Four types of cost risk models
A: Analytic (multipliers/ranges), simulation-based (Monte Carlo), method of moments (analytical), expert elicitation.
Q: Inputs to a cost risk model
A: Point estimates for each WBS element, distributions, discrete risk events and their probabilities, correlation assumptions.
Q: Structure of a cost risk model
A: Choice of probability distributions (triangular/normal/lognormal), correlation structure, mathematical architecture (Monte Carlo or method-of-moments).
Q: Execution of a cost risk model
A: Run simulation or analytical calculation, generate PDF and CDF (S-curve), extract percentiles for funding decisions.
Q: What is a functional relationship in a risk model?
A: One element computed from another (e.g., SEPM = 15\% of hardware). It passes uncertainty through and creates perfect correlation.

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
Q: Three-point estimate in expert elicitation
A: Low (optimistic), Most Likely (mode), High (pessimistic) — parameterizes triangular or beta distribution.
Q: Expert anchoring bias
A: Experts anchor on current point estimate and give artificially narrow ranges.
Q: Expert optimism bias
A: Experts underestimate the high side.
Q: Expert motivational bias
A: Program advocates intentionally narrow ranges to make program appear less risky.
Q: Mitigation for expert biases
A: Structured elicitation (e.g., Delphi, anonymized), ask for extreme scenarios explicitly, cross-check against historical data.
Q: Treat stated low/high as which percentiles?
A: Roughly the 10th/90th percentiles, not absolute limits.
Q: Risk Cube
A: A 5×5 matrix of likelihood (1–5) vs. consequence (1–5) used to rank and prioritize risks (green/yellow/red).
Q: Risk Cube: is it a full quantitative risk model?
A: No. It is a qualitative prioritization tool. Simulation or historical methods are needed for rigorous distribution.
Q: Expected value of a risk
A: Probability $\times$ cost impact.
Q: Why summing expected values of risks is insufficient
A: It gives the mean but not the spread. With few risks, actual outcome is often 0 or the full impact (lumpy).

## CER Uncertainty and Confidence
Q: Linear CER uncertainty distribution
A: Approximately normal around predicted value, with spread from standard error of estimate (SEE) or prediction interval.
Q: Log-space CER uncertainty distribution
A: Lognormal in dollars (right-skewed); the log-space SEE is $\sigma$ of ln(cost).
Q: Risk-adjusted estimate
A: Point estimate plus a risk/contingency reserve, selected from S-curve at a specific confidence level (percentile).
Q: Typical confidence level of the point estimate
A: Below 50\% for right-skewed total distributions (sum of most-likely values is lower than the mean).
Q: Typical confidence level of the mean
A: Around 50–60\% for right-skewed distributions.
Q: Common management funding confidence levels
A: 70th or 80th percentile, reflecting organizational risk tolerance.
Q: Is there a universally mandated confidence level?
A: No. Selecting confidence level is a management/policy decision, not purely statistical. Estimator produces accurate S-curve, management chooses point.
Q: Contingency / Reserve formula
A: (Cost at chosen confidence level) − (Point estimate or baseline)
Q: What should accompany every point estimate?
A: Confidence level / S-curve position. Never present a single cost number without stating what percentile it represents.
`
});
