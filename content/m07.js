PCEA.addModule({
  id: 'm07', num: 7, title: 'Learning Curves', short: 'Learning Curves', source: 'guide',
  blurb: 'Each doubling of quantity cuts cost by a constant percentage. CUMAV vs. unit theory, lot midpoints, and breaks.',
  intro: String.raw`Learning curves quantify **cost improvement**: the cost reduction you get from producing many units of the same system under consistent conditions.

**Core principle:** each time the quantity **doubles**, cost falls by a constant percentage. That percentage is set by the **learning curve slope (LCS)**.

**Workflow:** historical data → normalize → analyze → predict future costs.`,
  sections: [
    {
      id: 'equation', title: 'The learning curve equation', summary: 'Y = aX^b, b and LCS, and the doubling rule',
      body: String.raw`Suppose the 1st unit takes 100 hours, the 2nd takes 85, the 4th takes 72.25, and the 8th takes 61.4. Each time quantity doubles, cost is multiplied by **0.85**. That is an **85% learning curve**.

The equation behind it is a power function:

$$Y = aX^b$$

- $Y$ = cost (unit cost *or* cumulative average cost, depending on the theory)
- $X$ = unit number (or cumulative quantity)
- $a$ = **T1**, the theoretical first unit cost
- $b$ = the learning exponent, $\log_2(LCS)$, which is **always negative**

+++

### The two formulas you must know cold

$$b = \frac{\ln(LCS)}{\ln 2} \qquad\qquad LCS = 2^b$$

:::check
Q: What is $b$ for a 90% learning curve? (4 decimals)
= -0.1520 ±0.0005
> $b = \ln(0.90)/\ln(2) = -0.10536/0.69315 = -0.1520$
:::

:::check
Q: A regression gives $b = -0.3219$. What is the LCS, as a decimal?
= 0.80 ±0.002
> $LCS = 2^{-0.3219} = 0.80$, an 80% curve.
:::

+++

### Why doubling works

$$Y_{2X} = a(2X)^b = 2^b \cdot aX^b = LCS \cdot Y_X$$

So **cost at 2X = LCS × cost at X**. When a question asks about unit 2, 4, 8, 16… of a known unit, use doubling. It is much faster.

:::check
Q: T1 = 200 hours on an 80% unit curve. How many hours does unit 8 take?
= 102.4
> Unit 8 is three doublings from unit 1: $200 \times 0.8^3 = 102.4$.
:::

+++

### Log space turns the curve into a line

$$\ln Y = \ln a + b \ln X$$

In log-log space the curve is a **straight line** with slope $b$ and intercept $\ln a$. That is what lets us use ordinary linear regression. Toggle the axes below to see it.

:::widget lc-explorer:::

:::challenge lc-explorer theory=ulc t1=100 lcs=0.95 n=8 log=unit lock=theory,t1,n,log
Q: T1 is \$100. Drag the LCS slider until unit 8 costs **\$51.20**.
goal: unitN ~ 51.2 +- 0.5%
show: lcs=0.8
> Unit 8 is three doublings from unit 1, so $Y_8 = 100 \times LCS^3$. Setting $LCS^3 = 0.512$ gives $LCS = 0.80$: 100, 80, 64, 51.2.
:::

:::tip
Lower LCS (70–80%) = **steeper** learning: lots of touch labor, complex manual work. Higher LCS (90–95%) = **flatter**: automated, simple, mature processes.
:::`
    },
    {
      id: 'theories', title: 'CUMAV vs. unit theory', summary: 'Wright vs. Crawford: what Y means',
      body: String.raw`Both theories use $Y = aX^b$. They disagree about **what $Y$ is**.

| | **CUMAV** (Wright) | **Unit / ULC** (Crawford) |
|---|---|---|
| $Y$ predicts | **Average** cost of units 1 through X (CAUC) | Cost of the **Xth unit** itself |
| Equation | $\bar{Y}_X = aX^b$ | $Y_X = aX^b$ |
| Variable | Synthetic (a running average) | Actual observed cost |
| Effect | Smooths noisy data; statistics look artificially good | Variation stays visible |
| Lot data | Works directly | Needs **lot midpoints** |
| Preference | Generally **not** preferred | Generally **preferred** (default) |

Your guide's rule: use CUMAV only if the customer requires it or the data is very noisy.

+++

### Same LCS, different curves

For the **same nominal LCS**, CUMAV represents **steeper** cost improvement than ULC. The cumulative average only drops 15% per doubling if the individual units drop by *more* than that.

Equivalently: fit both theories to the **same data** and the CUMAV LCS will come out **higher** (flatter).

:::check
Q: Which reduces cost more: an 85% CUMAV curve or an 85% unit curve (same T1)?
* 85% CUMAV
- 85% unit curve
- They are identical
> To pull the *average* down 15% per doubling, individual units must fall faster. So CUMAV at the same LCS implies more improvement.
:::

+++

Switch **Theory** in the explorer and watch the two lines swap roles. Under CUMAV the average follows the clean power curve and the unit cost falls *below* it.

:::widget lc-explorer:::

:::challenge lc-explorer theory=cum t1=100 lcs=0.9 n=4 lock=theory,t1,lcs,n
Q: Under **cumulative average** theory, with T1 = \$100 and a 90% slope, predict the cumulative average cost through unit 4.
predict: cavN +- 1%
> Under Wright's theory the curve gives the cumulative average directly: $\bar{Y}_4 = 100 \times 0.9^2 = 81$. Unit 4 by itself costs less than 81, because the average still carries the more expensive early units.
:::

:::warn
85% CUMAV ≠ 85% ULC. Always state which theory an LCS belongs to. Published industry averages rarely say which one they used.
:::`
    },
    {
      id: 'formulas', title: 'Totals, lots and conversions', summary: 'b+1 exponent, lot costs, CAUC ↔ unit',
      body: String.raw`### CUMAV totals

If $\bar{Y}_X = aX^b$ is the average of the first X units, then the **total** is average × quantity:

$$\text{Total}_{1..X} = X \cdot aX^b = aX^{b+1}$$

:::key
Individual unit or average → exponent $b$. **Total cost → exponent $b+1$.**
:::

**Lot cost (units F through L):**
$$\text{Lot} = aL^{b+1} - a(F-1)^{b+1}$$

+++

:::check
Q: CUMAV, T1 = 100, LCS = 90%. What is the **total** cost of the first 8 units?
= 583.2 ±0.5
> CAUC at unit 8 = $100 \times 0.9^3 = 72.9$ (three doublings). Total = $8 \times 72.9 = 583.2$.
:::

:::check
Q: Same curve. What is the cost of the **lot** of units 5–8?
= 259.2 ±0.5
> Total(8) − Total(4) = $583.2 - 4 \times 81 = 583.2 - 324 = 259.2$.
:::

+++

### Unit theory totals

There is no closed form. Sum the units:
$$\text{Total}_{1..X} = \sum_{i=1}^{X} a\,i^b$$

### Conversions

- **Unit → CAUC:** $\bar{Y}_X = \dfrac{\sum_{i=1}^{X} Y_i}{X}$
- **CAUC → unit:** $Y_X = X\bar{Y}_X - (X-1)\bar{Y}_{X-1}$
- **Lot cost → AUC:** $AUC = \dfrac{\text{lot cost}}{L - F + 1}$

:::check
Q: CUMAV, T1 = 100, 90%. What does **unit 2 by itself** cost?
= 80
> $\bar{Y}_2 = 90$, so total(2) = 180. Unit 2 = $180 - 100 = 80$ (lower than the 90 average).
:::

+++

:::example Quick CUMAV calculation (from your guide)
T1 = 100, LCS = 85%, find CAUC for 20 units.
1. $b = \ln 0.85 / \ln 2 = -0.2345$
2. $\bar{Y}_{20} = 100 \cdot 20^{-0.2345} = 49.54$
3. Total = $49.54 \times 20 = 990.8$
:::

:::warn
**Don't round the LCS.** Keep 4+ decimals. The difference between 85% and 85.23% compounds over many units.
:::`
    },
    {
      id: 'process', title: 'The 7-step process', summary: 'From raw data to a fitted curve',
      body: String.raw`Both theories follow the same procedure:

1. **Collect and normalize** the data: convert to constant-year dollars and remove effects of labor mix, change orders and production irregularities.
2. **Plot in unit space.** Scatter plot, power trendline, check $R^2$ and the visual fit.
3. **Prepare the data.** CUMAV: cumulative quantities and CAUC. ULC with unit data: use as is. ULC with lot data: compute **lot midpoints**. Then take $\ln X$ and $\ln Y$.
4. **Plot in log space.** It should look like a straight line. If it doesn't, reconsider the method.
5. **Regress** $\ln Y$ on $\ln X$ (OLS). Get the intercept $\alpha$ and slope $\beta$, and check the t- and F-statistics.
6. **Transform back.** $a = e^{\alpha}$, $b = \beta$, $LCS = 2^b$.
7. **Apply.** CUMAV totals: CAUC × X. ULC totals: sum the units.

+++

:::check
Q: A log-space regression gives intercept $\alpha = 4.6052$ and slope $\beta = -0.2345$. What is T1?
= 100 ±0.1
> $a = e^{4.6052} = 100.0$ (and $LCS = 2^{-0.2345} = 85\%$).
:::

:::check
Q: In step 6, the slope $\beta$ from log space becomes…
* $b$ directly
- $e^{\beta}$
- $2^{\beta}$, which is $b$
- $\ln \beta$
> The slope carries straight over: $b = \beta$. Only the intercept needs $e^{\alpha}$. Then $LCS = 2^b$.
:::

+++

### T1 and the T1 adder

**T1 is the regression's first-unit value**, not necessarily what unit 1 actually cost. Sometimes unit 1 sits well above the curve (ships, prototypes). A **T1 adder** handles that first-unit premium separately. You need at least 3 data points to estimate a curve.

### When learning curves apply
- ✓ Many units of the same system, the same facility, a stable workforce, the same processes, significant direct labor, no big breaks, enough data (3 minimum, 8+ preferred)
- ✗ Highly automated work, one-of-a-kind systems, big changes between units, different facilities, major turnover, very short runs, little direct labor`
    },
    {
      id: 'lmp', title: 'Lot midpoints', summary: 'The unit where the curve equals the lot average',
      body: String.raw`With **lot data** you only know each lot's total cost, so each lot's average unit cost (AUC). To fit a **unit** curve, you need an X for each AUC. That X is the **lot midpoint (LMP)**: the unit number whose cost on the curve equals the lot's average.

- It is **not** the arithmetic middle of the lot.
- It usually isn't an integer.
- It sits **between** the geometric mean $\sqrt{FL}$ (too low) and the arithmetic mean $\frac{F+L}{2}$ (too high).

Why is the arithmetic mean too high? Early units in the lot cost more than later ones and pull the average up, so the matching unit is earlier than the middle.

+++

### The chicken-and-egg problem

To compute the LMP you need $b$. To estimate $b$ you need the LMPs. The fix is to **start with a heuristic, then iterate**.

**Heuristic (no b needed):**
$$LMP \approx \frac{1}{2}\left[\sqrt{FL} + \frac{F+L}{2}\right]$$

**Refined (needs b):**
$$LMP = \left[\frac{(L+\tfrac12)^{b+1} - (F-\tfrac12)^{b+1}}{(b+1)(L-F+1)}\right]^{1/b}$$

Process: heuristic LMPs → regress for $b$ → refined LMPs → regress again. One pass is usually enough.

+++

:::warn A correction to your guide
Your guide writes the refined formula with $(F-1)$ and $L$ instead of $(F-\tfrac12)$ and $(L+\tfrac12)$. For F = 4, L = 8 and an 85% curve, that version gives **5.25**. The guide's own worked answer, **5.79**, only comes out with the ±½ form (≈ 5.77) or with an exact unit-by-unit sum (5.79). The $(F-1)$/$L$ form is the **CUMAV lot-cost** formula, not an LMP formula. The guide's first-lot rules of thumb (0.62N / 0.70N) also disagree with the math. Use the calculator below to see the actual ratios, and check these against your course notes.
:::

:::widget lmp:::

:::challenge lmp F=4 L=8 lcs=0.85 lock=F,L,lcs
Q: For a lot of units 4 through 8 on an 85% curve, predict the true lot midpoint. Use the heuristic: the average of the arithmetic and geometric means.
predict: exact +- 2%
> Arithmetic mean 6, geometric mean $\sqrt{32} = 5.657$, heuristic 5.83. The exact LMP is 5.79, so the heuristic lands within 1%.
:::

+++

:::check
Q: Lot of units 4–8. What is the heuristic LMP? (2 decimals)
= 5.83 ±0.01
> $\sqrt{32} = 5.657$ and $(4+8)/2 = 6$, so the average is $5.83$.
:::

:::check
Q: Using the arithmetic mean as the LMP will make your estimated lot cost…
- Too high
* Too low
- Exactly right
> The arithmetic mean **overestimates** the LMP. A later unit on a falling curve is cheaper, so the lot cost is **underestimated**.
:::

:::check
Q: For the **first** lot (F = 1), where does the true LMP fall as the lot gets large (say 100 units at 85%)?
- About 0.70 N
- About 0.62 N
* About N/3
- About N/2
> Set F = 1, L = 100 in the calculator: the true LMP is about 0.34 N. The first units are so expensive that the "average unit" comes early. Small first lots are closer to N/2.
:::`
    },
    {
      id: 'special', title: 'Breaks, rate and new work', summary: 'Lost learning, production rate, added content',
      body: String.raw`### Production breaks

After a break, some learning may be lost:

1. **No change**: short breaks; learning continues.
2. **Partial loss**: the typical case.
3. **Complete loss**: back to T1 (long breaks, workforce turnover).

One way to model partial loss is to shrink the exponent:
$$Y = a\,X^{\,b(1-\text{loss})}$$

which is the same as restarting at an **effective unit** $X_{eff} = X^{1-\text{loss}}$.

+++

:::check
Q: T1 = 100, 90% curve ($b = -0.152$). There is a 50% learning loss at unit 5. What is the cost of unit 5? (1 decimal)
= 88.5 ±0.2
> $100 \cdot 5^{-0.152 \times 0.5} = 100 \cdot 5^{-0.076} = 88.5$. (Your guide prints 87.8, but the arithmetic gives 88.5.) Without the break it would be $100 \cdot 5^{-0.152} = 78.3$.
:::

+++

### Rate theory

Add production rate as a second variable:
$$Y = a\,X^b R^c$$

$R$ is the annualized production rate and $c$ is its regression coefficient. Use it when budget-driven rate changes matter. Check that the rate term is **statistically significant**, and watch for **multicollinearity** between X and R (cumulative quantity and rate often rise together).

### New work

When a new subsystem is added mid-production, it starts its own curve:
$$Y_X = a_1 X^{b_1} + a_2 (X - X_{last})^{b_2}$$

:::check
Q: Why must you check multicollinearity in rate theory?
* Cumulative quantity and production rate tend to move together
- Rate is always negatively correlated with cost
- The model has no intercept
> If X and R are highly correlated, the regression can't separate their effects, which inflates standard errors.
:::`
    },
    {
      id: 'exam', title: 'Pitfalls and exam patterns', summary: 'Traps, quick checks, decision tree',
      body: String.raw`### Common traps
- Forgetting to convert LCS ↔ b
- Using $b$ instead of $b+1$ for totals
- Mixing up CUMAV and ULC interpretations
- Using the arithmetic mean as the LMP
- Not transforming back from log space
- Rounding the LCS

### Sanity checks
- Cost falls as units increase (except around breaks)
- LCS is usually between 0.70 and 0.95
- $b$ is negative
- The LMP lies between F and L
- T1 may not equal the actual first-unit cost

+++

### Decision tree

- **No data?** Estimate T1 with other techniques, borrow an LCS from an analogous system, and apply the curve.
- **Unit data?** CUMAV or ULC (prefer ULC). Follow the 7 steps.
- **Lot data?** You need lot midpoints. Prefer ULC with LMP: start with the heuristic, refine, iterate.

### Industry examples (theory rarely stated)

| Product | LCS | Product | LCS |
|---|---|---|---|
| Shillelagh missile | 70.5% | Aircraft assembly | 80% |
| Calculators | 74% | Steel production | 79% |
| Titan III C | 85.4% | Model-T Ford / OH-6A | 86% |
| M113 APC | 93.3% | 7.62mm minigun | 94.7% |
| Electric power | 95% | Airborne radar | 95.4% |

:::check
Q: Which product would you expect to have the **flattest** learning curve?
- Hand-built prototype satellites
* A highly automated power-generation process
- Early aircraft assembly
> Automation leaves little touch labor to learn, so the LCS is high (flat). Electric power is 95%.
:::

:::check
Q: You're given unit 10 costs 58.27 on an 85% unit curve. Cost of unit 20?
= 49.53 ±0.02
> Unit 20 is one doubling from unit 10: $0.85 \times 58.27 = 49.53$.
:::`
    }
  ],
  cards: String.raw`
## Fundamentals
Q: What does a learning curve quantify?
A: Cost improvement: the cost reduction from producing multiple units of the same system under consistent conditions.
Q: Core principle of learning curves
A: Each doubling of quantity reduces cost by a constant percentage (set by the LCS).
Q: Basic learning curve equation
A: $Y = aX^b$. a = T1 (theoretical first unit), b = $\log_2(LCS)$ (negative), X = unit/quantity.
Q: Formula: b from LCS
A: $b = \dfrac{\ln(LCS)}{\ln 2}$
Q: Formula: LCS from b
A: $LCS = 2^b$
Q: Learning curve in log space
A: $\ln Y = \ln a + b \ln X$, a straight line with slope b and intercept ln(a).
Q: Doubling principle
A: Cost at 2X = LCS × cost at X
Q: Why is b always negative?
A: Cost decreases as quantity increases (LCS < 1, so log2(LCS) < 0).
Q: b for an 85% curve
A: −0.2345
Q: b for a 90% curve
A: −0.1520
Q: b for an 80% curve
A: −0.3219
Q: Low LCS (70–80%) indicates…
A: Steep learning: high touch labor, complex processes, low automation.
Q: High LCS (90–95%) indicates…
A: Flat learning: high automation, simple processes, mature technology.
Q: T1 unit 1 = 200, 80% unit curve. Cost of unit 4?
A: $200 \times 0.8^2 = 128$

## Theories
Q: CUMAV theory: what does Y represent?
A: The cumulative average unit cost (CAUC) of units 1 through X. Also called the Wright curve.
Q: Unit (ULC) theory: what does Y represent?
A: The cost of the Xth unit itself. Also called the Crawford curve.
Q: Which theory is generally preferred, and why?
A: Unit theory (ULC). It uses the actual observed variable and keeps variation transparent. CUMAV smooths and makes statistics look artificially good.
Q: Same nominal LCS: which theory shows steeper cost improvement?
A: CUMAV.
Q: Same data: which theory yields the higher LCS?
A: CUMAV (the fit is flatter).
Q: Another name for CUMAV / for unit curves
A: Wright curves / Crawford curves
Q: Your guide's rule for choosing CUMAV
A: Only if the customer requires it or the data has high variation (guide: CV > ~2%); otherwise use ULC.

## Formulas
Q: CUMAV total cost of first X units
A: $aX^{b+1}$ (exponent b+1)
Q: CUMAV cost of lot F through L
A: $aL^{b+1} - a(F-1)^{b+1}$
Q: ULC total cost of first X units
A: $\sum_{i=1}^{X} a\,i^b$ (no closed form; sum the units)
Q: Convert CAUC to the unit cost of unit X
A: $Y_X = X\bar{Y}_X - (X-1)\bar{Y}_{X-1}$
Q: Convert unit costs to CAUC
A: $\bar{Y}_X = \sum_{i=1}^{X} Y_i / X$
Q: Lot average unit cost (AUC)
A: Total lot cost / (L − F + 1)
Q: Individual unit uses exponent ___; total cost uses ___
A: b; b+1
Q: T1 from a log-space regression intercept α
A: $a = e^{\alpha}$ (and b = β)
Q: CUMAV, T1=100, 85%: CAUC at 20 units and total?
A: CAUC = $100 \cdot 20^{-0.2345} = 49.54$; total = 990.8
Q: Why must you not round the LCS?
A: Small rounding errors (85% vs 85.23%) compound over many units. Keep 4+ decimals.

## Process
Q: The 7-step learning curve process
A: 1 Collect & normalize · 2 Plot in unit space · 3 Prepare data (CAUC / LMPs, logs) · 4 Plot in log space · 5 Regress (α, β) · 6 Transform back (a = e^α, b = β, LCS = 2^b) · 7 Apply
Q: What is a T1 adder?
A: A separate first-unit adjustment when unit 1 falls well above the curve (common with ships and prototypes).
Q: Is T1 the actual cost of unit 1?
A: Not necessarily. It is the regression-derived theoretical first unit.
Q: Minimum and preferred data points for a learning curve
A: Minimum 3; 8+ preferred.
Q: Name 3 situations where learning curves are inappropriate
A: Highly automated production; one-of-a-kind systems; different facilities; major workforce turnover; very short runs; minimal direct labor.
Q: Normalizations needed before learning curve analysis
A: Constant-year dollars; remove labor-mix changes, change orders, and production timing irregularities.

## Lot midpoint
Q: Definition of lot midpoint (LMP)
A: The unit number whose cost on the unit learning curve equals the lot's average unit cost.
Q: When is the LMP required?
A: For unit (ULC) theory with lot data.
Q: LMP heuristic formula
A: $\frac12\left[\sqrt{FL} + \frac{F+L}{2}\right]$, the average of the geometric and arithmetic means.
Q: Arithmetic mean vs. true LMP
A: The arithmetic mean always overestimates the LMP, so it underestimates lot cost.
Q: Geometric mean vs. true LMP
A: The geometric mean always underestimates the LMP, so it overestimates lot cost.
Q: The LMP dilemma and its solution
A: You need b to get the LMP and the LMP to get b. Start with the heuristic, regress, refine the LMPs with b, and iterate (once is usually enough).
Q: Heuristic LMP for units 4–8
A: ½(5.657 + 6) = 5.83 (true value ≈ 5.79 at 85%)
Q: Refined LMP formula (needs b)
A: $\left[\frac{(L+\frac12)^{b+1} - (F-\frac12)^{b+1}}{(b+1)N}\right]^{1/b}$
Q: Roughly where is the true LMP of a large first lot?
A: About N/3 (≈0.34N for 100 units at 85%); small first lots are closer to N/2.

## Special topics
Q: Three possible effects of a production break
A: No change (short break), partial learning loss (typical), complete loss / return to T1 (long break, turnover).
Q: Partial learning loss model
A: $Y = a X^{b(1-\text{loss})}$; equivalently effective unit $X^{1-\text{loss}}$.
Q: Rate theory equation
A: $Y = aX^bR^c$, where R = annualized production rate.
Q: Two checks required with rate theory
A: The rate term must be statistically significant; check multicollinearity between X and R.
Q: New work effects equation
A: $Y_X = a_1X^{b_1} + a_2(X - X_{last})^{b_2}$. New work starts its own curve.
Q: T1 = 100, 90%, 50% learning loss at unit 5: cost of unit 5?
A: $100 \cdot 5^{-0.076} = 88.5$ (vs. 78.3 with no break)

## Industry curves
Q: Aircraft assembly typical LCS
A: 80%
Q: Model-T Ford LCS
A: 86%
Q: Electric power LCS
A: 95%
Q: Shillelagh missile LCS
A: 70.5%
Q: M113 APC LCS
A: 93.3%
Q: Caution about published industry learning curves
A: They rarely specify whether they are CUMAV or unit curves.
`
});
