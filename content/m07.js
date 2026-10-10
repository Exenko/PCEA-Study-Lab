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
:::

+++

### Names, origins and notation

The learning curve concept goes by many names: **Cost Improvement Curve (CIC)**, cost/quantity relationship, manufacturing progress function, experience curve, product improvement function.

- **T.P. Wright** (1936, "Factors Affecting the Cost of Airplanes") based the original theory on manufacturing data for small two-seater aircraft. His curve is the **CUMAV** theory.
- **J.R. Crawford** of **Lockheed** Aircraft Corporation derived the same equation with a different meaning for $Y$: the **unit / ULC** theory.

**Notation:**
- $UC_i$ = unit cost of the $i$th unit
- $CAUC_k$ = cumulative average unit cost of units 1 through $k$
- Lot size $N = (L - F) + 1$, where $F$ and $L$ are the first and last unit numbers of the lot

:::check
Q: A lot runs from unit 7 through unit 15. What is $N$?
= 9
> $N = (L - F) + 1 = (15 - 7) + 1 = 9$.
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

**CEBoK rule of thumb:** for data with more than about a 2% Coefficient of Variation (CV), CUMAV will likely produce the better statistical fit, even if the true process is ULC. That said, ULC's objections to CUMAV stand: CUMAV uses a synthetic (not observed) variable, obscures the true error and variation of the observed cost, and produces artificially favorable statistics. ULC is generally **preferred** in practice now that spreadsheets make its extra bookkeeping easy.

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
:::

+++

### Comparing the two fits side by side

:::widget lc-compare:::

+++

### CUMAV with lot data (same underlying 85% curve, T1 = 100)

Lots of 2, 3, and 5 units cost \$170.00, \$172.84, and \$239.98. CAUC through the second lot (5 cumulative units): $(170.00+172.84)/5 = 68.57$. The first three lots total \$582.82; since the total of all 20 units is \$990.72 (same perfect data as the unit example), the fourth lot (units 11–20) costs $990.72 - 582.82 = 407.90$.

### ULC with unit vs. lot data (same T1 and slope, different theory)

With **unit data**, ULC gives unit 20 = \$49.54 (coincidentally the same number as the CUMAV *average*, because the data is perfect) but a **total** of the first 20 units of **\$1,240.18** — noticeably higher than CUMAV's total of \$990.72, because ULC's 85% applies to each unit's cost, while CUMAV's 85% applies to the cumulative average; for the same T1 and slope the unit-theory data are higher (CEBoK notes its ULC example data were "significantly higher" than the CUMAV data). Average cost per unit: $1240.18/20 = 62.0$.

:::note Rounding
CEBoK prints the CUMAV total as both 990.72 and 990.69, depending on how $b$ is rounded. With the exact $b$ the totals are 990.79 (CUMAV) and 1240.23 (ULC), which is what the widget shows. The differences are rounding only.
:::

With **lot data**, ULC needs lot midpoints. The heuristic gives an initial $b = -0.2402$; regressing again with refined LMPs gives $b = -0.2345$ (85%, matching the true curve). Because the fit isn't exact with approximated LMPs, the actual total of the first 10 units, \$711.61, differs slightly from the model's predicted \$709.78.

:::check
Q: 85% curve, T1 = 100: Which is larger: the ULC total of the first 20 units, or the CUMAV total?
* ULC total (\$1,240.18) is larger than the CUMAV total (\$990.72)
- CUMAV total is larger
- They are always identical
- Cannot be determined
> ULC's 85% applies to each unit's cost, while CUMAV's 85% applies to the cumulative average; for the same T1 and slope the unit-theory data are higher (CEBoK notes its ULC example data were "significantly higher" than the CUMAV data), so the ULC total is larger.
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

:::example Quick CUMAV calculation
T1 = 100, LCS = 85%, find CAUC for 20 units.
1. $b = \ln 0.85 / \ln 2 = -0.2345$
2. $\bar{Y}_{20} = 100 \cdot 20^{-0.2345} = 49.54$
3. Total $= a \cdot 20^{b+1} = 100 \cdot 20^{0.7655} = 990.72$
:::

:::check
Q: CUMAV, T1 = 100, 85%. Using the totals-difference method, what is the cost of just the 20th unit? (2 decimals)
= 38.15 ±0.05
> $\text{Total}(20) - \text{Total}(19) = 100(20^{0.7655} - 19^{0.7655}) = 100(9.9072 - 9.5257) = 38.15$.
:::

:::warn
**Don't round the LCS.** Keep 4+ decimals. The difference between 85% and 85.23% compounds over many units.
:::

+++

### Fig 7.4: a full worked example (T1 = \$1,000, 85%, unit data)

| Unit | Unit cost | Cumulative cost | CAUC |
|---|---|---|---|
| 1 | \$1,000.00 | \$1,000.00 | \$1,000.00 |
| 2 | \$850.00 | \$1,850.00 | \$925.00 |
| 4 | \$722.50 | — | — |
| 8 | \$614.13 | \$5,935.84 | \$741.98 |

- Lot 1 (units 1–3) total = \$2,622.91
- Lot 2 (units 4–8) total = \$3,312.93, average = \$662.59
- Check: \$2,622.91 + \$3,312.93 = \$5,935.84, matching the cumulative cost through unit 8.

:::widget lot-table:::

:::check
Q: In Fig 7.4, units 4–8 total \$3,312.93. What is the lot's average unit cost (AUC)?
= 662.59 ±0.02
> $N = L - F + 1 = 8 - 4 + 1 = 5$ units. $AUC = 3312.93 / 5 = 662.59$.
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
- ✗ Highly automated work, one-of-a-kind systems, big changes between units, different facilities, major turnover, very short runs, little direct labor

CEBoK's own screening criteria, use the methodology only when:
- direct labor comprises the **majority of the total price**,
- the contract price is **high enough** to warrant the data collection and analysis,
- the **duration of production is long enough** to provide sufficient data, and
- the item is **nonstandard** and will experience a measurable cost reduction from learning.

+++

### Data types and conversions

Five data types summarize a production run: **cumulative cost**, **CAUC**, **unit cost**, **lot cost**, and **lot AUC**. The first three (unit cost, cumulative cost, CAUC) are equivalent — given any one for every unit, the other two can be derived. Lot cost and lot AUC can likewise be derived from any of the unit-level columns.

:::warn
Going the other direction — from **lot cost or lot AUC back to individual unit costs** — loses information. A \$185 lot of 2 units could be a \$100/\$85 split (T1 = \$100, 85% LCS under ULC), or \$92.50/\$92.50 (T1 = \$92.50, 100% LCS), or infinitely many other splits. **Unit costs cannot be uniquely recovered from lot cost or lot AUC.**
:::

:::check
Q: A 2-unit lot totals \$185. Which statement is true?
* Multiple (T1, LCS) combinations can produce this total
- Only a \$100/\$85 split is possible
- The LCS must be 85%
- Unit costs can always be recovered exactly from a lot total
> \$100/\$85 and \$92.50/\$92.50 both sum to \$185 — the split is not unique from lot data alone.
:::

+++

### Testable topics (CEBoK's own list)

:::key
**Testable:** CUMAV theory · Unit theory · Unit theory with rate · Relationships among the theories (e.g., point of intersection) · Algebraic vs. simple lot midpoint · Unit vs. lot data

**Testable, less emphasized:** actual (exact) lot midpoint · log-log transformation (tested under the Regression module)

**Not testable:** approximating discrete sums with definite integrals
:::`
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

:::key CEBoK rules of thumb (mental-math estimates only)
- First lot, fewer than 10 units: LMP ≈ **0.5N**
- First lot, 10 or more units: LMP ≈ **0.3N**
- Successive lots: LMP ≈ **0.5N + previous units produced**

These are rough approximations for quick mental estimates. Use the heuristic or refined formulas above for real analysis — the first lot's LMP is the most sensitive to LCS and lot size, and therefore the hardest to approximate with a rule of thumb.
:::

:::widget lmp:::

:::challenge lmp F=4 L=8 lcs=0.85 lock=F,L,lcs
Q: For a lot of units 4 through 8 on an 85% curve, estimate the lot midpoint with the heuristic (the average of the arithmetic and geometric means). Your answer is checked against the exact LMP, within 2%.
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
- About 0.9 N
- About 0.7 N
* About N/3
- About N/2
> Set F = 1, L = 100 in the calculator: the true LMP is about 0.34 N, which is why CEBoK's rule of thumb for a first lot of 10 or more units is about 0.3N. The first units are so expensive that the "average unit" comes early. Small first lots are closer to N/2 (CEBoK: about 0.5N under 10 units).
:::`
    },
    {
      id: 'special', title: 'Breaks, rate and new work', summary: 'Lost learning, production rate, added content',
      body: String.raw`### Production breaks

Breaks come from customer rate/quantity changes, over-production, supply-chain gaps, strikes, design or process changes. After a break, some learning may be lost:

1. **No change**: short breaks; the process continues as if it never stopped.
2. **Partial loss**: the typical case, and the one best addressed analytically.
3. **Complete loss**: back to T1 (long breaks, complete workforce turnover).

There are two mathematically equivalent ways to view a break: as a percentage of learning lost on the **cost axis**, or as a number of units of learning lost on the **unit axis**. Both amount to moving back up the curve.

The break-unit cost formula:
$$a' = aN^b + L(a - aN^b) = La + (1-L)aN^b$$

- $a'$ = the break-unit cost (cost of the first unit after the break)
- $a$ = the original T1
- $N$ = the unit number of the break unit
- $L$ = fraction of learning lost (0 to 1)
- $b$ = the original learning exponent

Check the extremes: $L=1$ (complete loss) gives $a' = a$ — back to T1. $L=0$ (no loss) gives $a' = aN^b$ — exactly where production would have been anyway.

Once $a'$ is known, find the **effective unit number** $Q$ it corresponds to on the original curve, then resume the curve at $Q$:
$$Q = \left(\frac{a'}{a}\right)^{1/b} \qquad\qquad Y = a\big(Q + (X - N)\big)^b$$

:::widget lc-break:::

:::example Production break example
T1 = 100, 90% curve ($b = -0.152$), unit theory, break after unit 4 ($N=5$), 50% learning lost ($L = 0.50$).
1. $a' = 0.5(100) + (1-0.5)(100)(5^{-0.152}) = 89.15$
2. $Q = (89.15/100)^{1/-0.152} = 2.128$
3. Unit 6: $Y = 100(2.128 + (6-5))^{-0.152} = 84.081$
:::

:::check
Q: T1 = 100, 90% curve, break after unit 4, 50% learning lost. What is the break-unit (unit 5) cost? (2 decimals)
= 89.15 ±0.05
> $a' = 0.5(100) + 0.5(100)(5^{-0.152}) = 89.15$.
:::

:::check
Q: Same break. What effective unit number Q does the break-unit cost correspond to on the original curve? (3 decimals)
= 2.128 ±0.005
> $Q = (89.15/100)^{1/-0.152} = 2.128$.
:::

+++

### Anderlohr's Retrograde Method (1969)

An expert-judgment approach to assessing lost learning. Assign weights summing to **100%** across five areas, then estimate the percent learning lost in each:

1. Personnel learning
2. Supervisory learning
3. Continuity of productivity
4. Methods
5. Special tooling

The **weighted average** across the five areas gives the total percent learning lost ($L$), which then feeds the break formulas above to find the effective unit number on the original curve.

:::widget retrograde:::

:::check
Q: In the Retrograde Method, what do the five weighted categories represent?
* Percent learning lost in personnel, supervisory, productivity continuity, methods, and tooling
- Five different learning curve theories to compare
- Five candidate LCS values to average
- Five production facilities being compared
> Anderlohr's method is a weighted average of expert-assessed learning loss across those five areas.
:::

+++

### Rate theory

RAND Corporation first proposed rate theory in 1974. It adds production rate as a second independent variable to the ULC model:
$$Y = a\,X^b R^c$$

$R$ is the annualized production rate and $c$ is its regression coefficient (found the same way as $b$). Rate theory lets analysts see the cost effect of budget-driven rate changes — but in practice the rate term is **rarely found to be statistically significant**, and it's popular with program offices but unpopular with oversight groups. Always check the rate term's significance, and watch for **multicollinearity** between X and R (cumulative quantity and rate often move together).

### New work

When a new subsystem is added mid-production, it starts its own curve:
$$Y_X = a_1 X^{b_1} + a_2 (X - L)^{b_2}$$

where $a_1, b_1$ describe the original work and $a_2, b_2$ the new work (often the same $b$ is reused), and $L$ is the last unit before the new work began.

:::check
Q: Why must you check multicollinearity in rate theory?
* Cumulative quantity and production rate tend to move together
- Rate is always negatively correlated with cost
- The model has no intercept
> If X and R are highly correlated, the regression can't separate their effects, which inflates standard errors.
:::

+++

### Meta-learning curves

A change in LCS partway through production can itself be modeled as a **meta-learning curve**, whose slope is roughly the **complement** of the change in the underlying LCS. Example: a shift from an 80% LCS to a 70% LCS is a 10-point change, so the meta-LCS ≈ 100% − 10% = **90%**.

:::note
When OLS regression is done in log space, the resulting prediction intervals become **log-t distributions** once transformed back to unit space — and log-t distributions are skewed rightward (toward higher cost).
:::

### Choosing a theory for real (imperfect) data

Real data rarely specifies a theory. Fit both CUMAV and ULC, compare $R^2$, $t$-, and $F$-statistics — CUMAV is inherently biased toward a better fit (its smoothing effect), so a marginally higher CUMAV $R^2$ doesn't automatically mean CUMAV is "truer," just a better statistical match. The **CUMAV iterative method** treats each lot's data independently (rather than using cumulative totals), which avoids problems with missing/concurrent lots, gives more realistic goodness-of-fit statistics, and makes outliers easier to spot — at the cost of complexity similar to ULC.

For estimating **new programs**, two alternatives to a single fitted curve: run a steady-state **should-cost** estimate for the flat, far-down-the-curve "follow units" and run it back up the curve; or use **Quantity As an Independent Variable (QAIV)**, where quantity becomes another independent variable in a Cost Estimating Relationship (CER) that estimates the whole production run or lot directly, instead of estimating T1 and applying a separate learning curve.

:::check
Q: What does QAIV do differently from the standard T1-plus-learning-curve approach?
* It includes quantity as an independent variable in a CER that estimates the whole production run directly
- It always assumes a 100% learning curve
- It ignores quantity entirely
- It replaces regression with expert judgment
> QAIV folds quantity into the CER itself, rather than estimating a first-unit cost and projecting a separate learning curve.
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
:::

+++

### Laws of logs (quick reference)

- $\log_b(b^x) = x$ — log and exponent (same base) undo each other
- $\log(xy) = \log x + \log y$ — product → sum
- $\log(x/y) = \log x - \log y$ — quotient → difference
- $\log(x^n) = n\log x$ — power → multiply out front
- Change of base: $\log_b x = \dfrac{\ln x}{\ln b}$`
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
R: yes
Q: Formula: b from LCS
A: $b = \dfrac{\ln(LCS)}{\ln 2}$
R: yes
Q: Formula: LCS from b
A: $LCS = 2^b$
R: yes
Q: Learning curve in log space
A: $\ln Y = \ln a + b \ln X$, a straight line with slope b and intercept ln(a).
R: yes
Q: Doubling principle
A: Cost at 2X = LCS × cost at X
R: yes
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
R: yes
Q: Unit (ULC) theory: what does Y represent?
A: The cost of the Xth unit itself. Also called the Crawford curve.
R: yes
Q: Which theory is generally preferred, and why?
A: Unit theory (ULC). It uses the actual observed variable and keeps variation transparent. CUMAV smooths and makes statistics look artificially good.
Q: Same nominal LCS: which theory shows steeper cost improvement?
A: CUMAV.
Q: Same data: which theory yields the higher LCS?
A: CUMAV (the fit is flatter).
Q: Another name for CUMAV / for unit curves
A: Wright curves / Crawford curves
R: yes
Q: CEBoK rule of thumb for choosing CUMAV vs. ULC by fit
A: For data with CV greater than about 2%, CUMAV will likely have the better statistical fit, even if ULC is the true process.
Q: Three objections to CUMAV
A: Uses a synthetic (not observed) variable; obscures true error/variation of the observed cost; produces artificially favorable fit statistics.
Q: Other names for the learning curve concept
A: Cost Improvement Curve (CIC), cost/quantity relationship, manufacturing progress function, experience curve, product improvement function.
R: yes
Q: Who originated CUMAV theory, and on what data?
A: T.P. Wright, 1936, using manufacturing data for small two-seater aircraft.
Q: Who originated ULC theory, and where?
A: J.R. Crawford, at Lockheed Aircraft Corporation.
Q: Notation: UC_i, CAUC_k, lot size N
A: UC_i = unit cost of unit i; CAUC_k = cumulative average unit cost through unit k; N = (L − F) + 1.

## Formulas
Q: CUMAV total cost of first X units
A: $aX^{b+1}$ (exponent b+1)
R: yes
Q: CUMAV cost of lot F through L
A: $aL^{b+1} - a(F-1)^{b+1}$
R: yes
Q: ULC total cost of first X units
A: $\sum_{i=1}^{X} a\,i^b$ (no closed form; sum the units)
R: yes
Q: Convert CAUC to the unit cost of unit X
A: $Y_X = X\bar{Y}_X - (X-1)\bar{Y}_{X-1}$
R: yes
Q: Convert unit costs to CAUC
A: $\bar{Y}_X = \sum_{i=1}^{X} Y_i / X$
R: yes
Q: Lot average unit cost (AUC)
A: Total lot cost / (L − F + 1)
R: yes
Q: Individual unit uses exponent ___; total cost uses ___
A: b; b+1
Q: T1 from a log-space regression intercept α
A: $a = e^{\alpha}$ (and b = β)
Q: CUMAV, T1=100, 85%: CAUC at 20 units and total?
A: CAUC = $100 \cdot 20^{-0.2345} = 49.54$; total = 990.72
Q: Why must you not round the LCS?
A: Small rounding errors (85% vs 85.23%) compound over many units. Keep 4+ decimals.
Q: Fig 7.4 (T1=\$1,000, 85%): unit 2, unit 4, unit 8 costs
A: u2 = \$850.00, u4 = \$722.50, u8 = \$614.13
Q: Fig 7.4: cumulative cost and CAUC through unit 8
A: Cumulative = \$5,935.84; CAUC8 = \$741.98
Q: Fig 7.4: total and average of units 4–8 (5-unit lot)
A: Total = \$3,312.93; average (AUC) = \$662.59
Q: CUMAV, T1=100, 85%: cost of the 20th unit alone (totals-difference method)
A: $100(20^{0.7655} - 19^{0.7655}) = 38.15$
Q: ULC vs CUMAV, 85% curve, T1=100: total cost of first 20 units
A: ULC total = \$1,240.18; CUMAV total = \$990.72. ULC's 85% applies to each unit's cost, while CUMAV's 85% applies to the cumulative average; for the same T1 and slope the unit-theory data are higher, so the ULC total is larger.
Q: ULC unit data, same example: average cost of 20 units
A: 1240.18 / 20 = 62.0
Q: CUMAV lot data example: lot costs 170.00/172.84/239.98 for lots of 2/3/5 units. CAUC through lot 2?
A: (170.00+172.84)/5 = 68.57
Q: Same CUMAV lot example: cost of the 4th lot (units 11–20)?
A: Total(20) − first 3 lots = 990.72 − 582.82 = 407.90
Q: ULC lot data example: heuristic b vs. refined b
A: Heuristic b = −0.2402; refined (iterated) b = −0.2345 (85%).
Q: ULC lot data example: actual vs. predicted total of first 10 units
A: Actual = $711.61; model-predicted = $709.78 (small gap from LMP approximation error).

## Process
Q: The 7-step learning curve process
A: 1 Collect & normalize · 2 Plot in unit space · 3 Prepare data (CAUC / LMPs, logs) · 4 Plot in log space · 5 Regress (α, β) · 6 Transform back (a = e^α, b = β, LCS = 2^b) · 7 Apply
R: yes
Q: What is a T1 adder?
A: A separate first-unit adjustment when unit 1 falls well above the curve (common with ships and prototypes).
R: yes
Q: Is T1 the actual cost of unit 1?
A: Not necessarily. It is the regression-derived theoretical first unit.
Q: Minimum and preferred data points for a learning curve
A: Minimum 3; 8+ preferred.
Q: Name 3 situations where learning curves are inappropriate
A: Highly automated production; one-of-a-kind systems; different facilities; major workforce turnover; very short runs; minimal direct labor.
Q: Normalizations needed before learning curve analysis
A: Constant-year dollars; remove labor-mix changes, change orders, and production timing irregularities.
Q: CEBoK's 4 criteria for when to apply learning curve methodology
A: Direct labor is the majority of price; contract price justifies the analysis; production duration is long enough; item is nonstandard and benefits measurably from learning.
Q: The five learning curve data types
A: Cumulative cost, CAUC, unit cost, lot cost, lot AUC.
Q: Can unit costs be recovered from lot cost or lot AUC alone?
A: No — e.g. a \$185 lot of 2 units could be \$100/\$85 or \$92.50/\$92.50 or infinitely many other splits.
Q: CEBoK Testable topics list
A: CUMAV theory, unit theory, unit theory with rate, relationships among theories, algebraic vs. simple LMP, unit vs. lot data.
Q: CEBoK topics tested but less emphasized
A: Actual (exact) lot midpoint; log-log transformation (tested under Regression).
Q: CEBoK topic that is NOT testable
A: Approximating discrete sums with definite integrals.

## Lot midpoint
Q: Definition of lot midpoint (LMP)
A: The unit number whose cost on the unit learning curve equals the lot's average unit cost.
R: yes
Q: When is the LMP required?
A: For unit (ULC) theory with lot data.
Q: LMP heuristic formula
A: $\frac12\left[\sqrt{FL} + \frac{F+L}{2}\right]$, the average of the geometric and arithmetic means.
R: yes
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
R: yes
Q: Roughly where is the true LMP of a large first lot?
A: About N/3 (≈0.34N for 100 units at 85%); small first lots are closer to N/2.
Q: CEBoK LMP rules of thumb (mental math)
A: First lot < 10 units: ≈0.5N. First lot ≥ 10 units: ≈0.3N. Successive lots: ≈0.5N + previous units produced.

## Special topics
Q: Three possible effects of a production break
A: No change (short break), partial learning loss (typical), complete loss / return to T1 (long break, turnover).
Q: Break-unit cost formula
A: $a' = aN^b + L(a - aN^b) = La + (1-L)aN^b$, where L = fraction of learning lost, N = break-unit number.
R: yes
Q: Break formula extremes: L=1 and L=0
A: L=1 (complete loss): a' = a (back to T1). L=0 (no loss): a' = aN^b (as if no break occurred).
Q: Effective unit number Q after a break
A: $Q = (a'/a)^{1/b}$; then resume with $Y = a(Q + (X-N))^b$.
R: yes
Q: T1=100, 90% curve (b=−0.152), break after unit 4, 50% loss: break-unit (unit 5) cost?
A: $a' = 0.5(100) + 0.5(100)(5^{-0.152}) = 89.15$
Q: Same break example: effective unit Q, and unit 6 cost
A: Q = (89.15/100)^(1/−0.152) = 2.128; unit 6 = 100(2.128+1)^−0.152 = 84.081
Q: Anderlohr's Retrograde Method (1969): what does it assess?
A: Percent learning lost after a break, via a weighted average across 5 expert-scored categories, weights summing to 100%.
R: yes
Q: The 5 categories in the Retrograde Method
A: Personnel learning, supervisory learning, continuity of productivity, methods, special tooling.
Q: Rate theory equation
A: $Y = aX^bR^c$, where R = annualized production rate, c = its regression coefficient.
R: yes
Q: Who originated rate theory, and when?
A: The RAND Corporation, 1974.
Q: Is the rate term usually statistically significant?
A: Rarely, in practice — despite the theory's popularity with program offices.
Q: Two checks required with rate theory
A: The rate term must be statistically significant; check multicollinearity between X and R.
Q: New work effects equation
A: $Y_X = a_1X^{b_1} + a_2(X - L)^{b_2}$. New work starts its own curve at the last unit L of the original work.
R: yes
Q: Meta-learning curve rule of thumb
A: Meta-LCS ≈ complement of the change in underlying LCS (e.g., 80%→70% is a 10-pt change, so meta-LCS ≈ 90%).
Q: Why are log-t distributions relevant to learning curve prediction intervals?
A: OLS in log space produces intervals that become log-t (right-skewed) once transformed back into unit space.
Q: CUMAV iterative method: main benefit over standard CUMAV with lot data
A: Treats each lot independently, so it handles missing/concurrent lots, gives more realistic goodness-of-fit, and outliers are easier to spot.
Q: QAIV (Quantity As an Independent Variable)
A: A CER approach that includes quantity as an independent variable to estimate the whole production run/lot directly, instead of T1 + a separate learning curve.
R: yes
Q: Alternative to a fitted curve for estimating far-down-the-curve "follow units"
A: A steady-state should-cost estimate for the follow unit, run back up the curve to earlier units.

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
