PCEA.addModule({
  id: 'm05', num: 5, title: 'Inflation and Escalation', short: 'Inflation & Escalation', source: 'guide',
  blurb: 'Constant vs. then-year dollars, raw and weighted indices, escalation procedures, and the BY→TY conversion.',
  intro: String.raw`Cost estimates must account for **changing purchasing power** over time. Two competing needs drive this module:

1. **Comparability**: Historical cost data from different years must be normalized to one base year so real cost drivers (not inflation artifacts) are visible.
2. **Budget realism**: Program estimates must be escalated to then-year dollars — the actual inflated dollars Congress will appropriate.

**Core principle:** Estimate in **constant base-year dollars** (inflation-free), then convert to **then-year dollars** for budgets using appropriate indices and time-phasing.`,
  sections: [
    {
      id: 'concepts', title: 'Inflation concepts and the base-year paradigm', summary: 'Constant vs. then-year dollars, purchasing power, inflation defined',
      body: String.raw`**Inflation** is a sustained rise in the general price level of goods and services, which **lowers purchasing power** per dollar. In cost estimating, this means "\$100M" is meaningless without specifying *which year's dollars*.

### Dollars: two types

| | **Constant/Base-Year (BY/CY) Dollars** | **Then-Year (TY) Dollars** |
|---|---|---|
| What it is | Dollars at the price level of one fixed reference year (inflation removed) | Actual dollars spent in each year, including accumulated inflation |
| Use for | CER development, trend analysis, cost comparisons | Budget submissions, appropriations (what Congress funds) |
| Example | "$100M in FY2020 constant dollars" | "$107M in FY2024 then-year dollars" |

:::check
Q: At 2.5% inflation, what is the purchasing power of a dollar next year compared to this year? (4 decimals)
= 0.9756 ±0.0002
> Purchasing power = 1 / (1 + 0.025) = 1 / 1.025 = 0.9756. Money buys less when prices rise.
:::

+++

### The base-year paradigm

**Estimate in constant dollars.** Historical data collected across years can then be compared apples-to-apples; CERs and trend analyses reflect real cost drivers (quantity, technology, scope), not inflation artifacts.

**Convert to then-year for budgets.** The estimate is then **time-phased** (split by when money will be spent) and **escalated** to TY dollars using the appropriate inflation index, producing the dollars that will actually be appropriated.

:::check
Q: Why estimate cost in constant base-year dollars rather than then-year dollars?
* Constant dollars remove inflation, so CERs and trend analyses reflect real cost drivers (quantity, scope, technology), not inflation artifacts
- Constant dollars give lower budget estimates
- Constant dollars are easier to calculate
- Then-year dollars are only for tax purposes
> Constant-year estimation enables apples-to-apples comparison of historical data from different years and isolates real cost relationships.
:::

:::check
Q: You build an estimate in FY2025 constant dollars. Before going into a budget request, what must happen?
* Time-phase it and escalate to then-year dollars for each year
- Discount it to present value
- Nothing; budgets use constant dollars
> Budgets are then-year dollars: the dollars actually appropriated and spent.
:::

+++

### Inflation defined, and why it matters

- **General economy-wide inflation** (monetary policy, supply/demand) is tracked by broad indices like CPI.
- **Sector-specific inflation** in defense (materials, aerospace labor, shipbuilding steel) can differ from the economy. DoD maintains **appropriation-specific indices** (RDT&E, Procurement, O&M, MILCON) because each inflates differently.
- A program spanning 10 years will pay different prices in Year 10 than Year 1 for identical goods, purely due to inflation. Failing to escalate is one of the most common sources of **underestimated** program cost.

:::key Base year = reference point
The base year is the year to which all dollars are normalized. It is set to index = 1.000. All BY/CY dollars are expressed as "in FY[base year] dollars."
:::`
    },
    {
      id: 'escalation-vs-discount', title: 'Escalation vs. discounting — a critical distinction', summary: 'Inflation (price-level change) ≠ time value of money (opportunity cost)',
      body: String.raw`These are **not** the same and must not be confused.

| | **Escalation** | **Discounting** |
|---|---|---|
| Adjusts for | **Price-level change** (inflation) | **Time value of money** (opportunity cost) |
| Purpose | Convert BY dollars to TY dollars (or vice versa) for budget planning | Convert future cash flows to present value for economic analysis |
| Rate used | Inflation rate (e.g., 2.5% per year) | Discount rate / hurdle rate (e.g., 10% per year, set by policy) |
| When applied | Always, when budgeting or comparing costs across years | Economic analysis, NPV, investment decisions |
| Formula | Constant-dollar analysis uses **real** discount rate; then-year uses **nominal** (≈ real + inflation) | |

:::warn
Escalation and discounting can **both** apply to the same cash flow, but they serve different purposes. Do not confuse an inflation index with a discount factor, and do not use one where the other is required.
:::

:::check
Q: An inflation index rises from 1.024 to 1.050. The year-over-year escalation rate is closest to…
= 2.54 ±0.05
> Rate = (1.050 − 1.024) / 1.024 × 100% = 0.026 / 1.024 × 100% = 2.54%
:::

+++

:::check
Q: What is the difference between escalating a cost and discounting it?
* Escalation adjusts for inflation (price-level change); discounting adjusts for opportunity cost (time value of money).
- They are the same thing, just called different names.
- Escalation is for inflation, discounting is for taxes.
> Escalation reflects what prices will actually be; discounting reflects what future dollars are worth today.
:::

:::check
Q: In cost analysis, if you use a 5% discount rate on then-year dollars, have you accounted for inflation in your estimate?
- Yes; discounting removes inflation
* No; you need a separate escalation/inflation adjustment. Discounting reflects opportunity cost, not price-level change.
- Yes, because discount rates include inflation by default
> Discount rates convert future cash flows to present value; they do not adjust for inflation. Those are two separate adjustments.
:::`
    },
    {
      id: 'indices', title: 'Index numbers: raw, weighted, and composite', summary: 'Three types of indices for three different conversion problems',
      body: String.raw`An **index** expresses the price level in a given year relative to a **base year**, where base year = 1.000.

$$\text{Index}_t = \frac{\text{Price}_t}{\text{Price}_{base}}$$

The basic conversion formula is:

$$\text{Cost}_{target} = \text{Cost}_{source} \times \frac{I_{target}}{I_{source}}$$

+++

### Raw Index

A raw index tracks a single cost category (or appropriation) **by year of expenditure/outlay**. Use it for:
- Converting **actual historical expenditures** (money that was already spent in a known year)
- Converting by-year outlay amounts to constant dollars or to then-year dollars

**Formula**: Constant → then-year by outlay year:
$$\text{Cost}_{TY} = \text{Cost}_{BY} \times \frac{I_{outlay\ year}}{I_{base\ year}}$$

:::check
Q: A contract cost \$50M in BY dollars in 2025. Base year is 2020 (index 1.000). What is it in then-year dollars if the 2025 index is 1.120?
= 56
> \$50M × (1.120/1.000) = \$56M
:::

+++

### Weighted Index

When money is **appropriated in one year** but **spent over several future years** (outlay profile), the appropriate index is the **weighted index**: raw indices for each future spend-year, weighted by the outlay percentage.

**Formula:**
$$\text{Weighted Index}(t) = \sum_{k} \big[\text{OutlayPct}_k \times \text{RawIndex}(t+k)\big]$$

where $t$ = appropriation year, $k$ = years after appropriation (0, 1, 2, ...), and $\text{OutlayPct}_k$ sums to 1.0.

**When to use**: Converting BY dollars to **TY budget authority** (the dollars to request/appropriate in a given fiscal year).

:::example Worked example
\$40M in BY, appropriated in FY2023, outlay profile 50%/30%/20% across FY2023–2025. Raw indices: 1.023, 1.048, 1.071.

Weighted Index(FY2023) = (0.50 × 1.023) + (0.30 × 1.048) + (0.20 × 1.071) = 1.0401

TY budget authority = $40M × 1.0401 = $41.60M

(If you used the raw FY2023 index of 1.023 alone, you'd get only $40.92M — understating the true TY request by $0.68M because half the money won't actually be spent/inflate until FY2024–2025.)
:::

:::check
Q: An outlay profile is 50%, 35%, 15% across three years with raw indices 1.000, 1.025, 1.0506. What is the weighted index? (4 decimals)
= 1.0163 ±0.0002
> (0.50 × 1.000) + (0.35 × 1.025) + (0.15 × 1.0506) = 1.0163
:::

+++

### Composite Index

A composite index blends **raw indices across different appropriation categories** (RDT&E, Procurement, O&M, MILCON) by their **dollar share** of total program cost. Use it only when a program mixes appropriations and a single summary escalation rate is needed.

**Formula:**
$$I_{composite} = \sum_i (w_i \times I_i)$$

where $w_i$ = fraction of total dollars in category $i$ (sums to 1.0).

:::tip Don't confuse weighted with composite
- **Weighted index**: blends *across future years* within *one* appropriation, by outlay profile.
- **Composite index**: blends *across appropriation categories* within *one* year, by dollar share.

They solve different problems and use different weights.
:::

:::check
Q: A program is 60% Procurement (index 1.045) and 40% RDT&E (index 1.030). What is the composite index?
= 1.039 ±0.001
> (0.60 × 1.045) + (0.40 × 1.030) = 0.627 + 0.412 = 1.039
:::

+++

### Consumer Price Index (CPI)

CPI (from BLS) tracks a fixed basket of consumer goods. It is **generally not appropriate** for DoD cost estimating because it reflects consumer purchases, not defense-unique materials and labor. Use DoD/appropriation-specific indices instead.

:::check
Q: Your estimate covers aerospace labor and titanium procurement. Should you use the Consumer Price Index (CPI) for escalation?
* No; CPI tracks consumer goods, not defense-unique materials and labor. Use DoD/appropriation-specific indices instead.
- Yes; CPI is the standard for all U.S. cost estimation.
- Yes, but only for the labor portion.
> Defense costs inflate differently than consumer prices. CPI-based escalation would underestimate true DoD cost growth.
:::

:::widget escalation:::

:::challenge escalation r=0.025 o1=0.5 o2=0.35 o3=0.15 amt=100 lock=r,o1,o2,o3,amt
Q: 100 BY2025\$ of work will be appropriated in 2025 and outlaid 50% / 35% / 15% over three years at 2.5% inflation. Predict the TY\$ you must appropriate in 2025.
predict: tyBY +- 0.5%
> The weighted index is $0.50(1) + 0.35(1.025) + 0.15(1.025^2) = 1.0163$, so you need about \$101.63 TY. The raw index for 2025 is 1.0000, but money appropriated in 2025 is spent at later price levels.
:::

:::challenge escalation r=0.025 o1=0.5 o2=0.35 o3=0.15 amt=100 lock=o1,o2,o3,amt
Q: Keep the same outlay profile. Find the inflation rate at which the 2025 appropriation must be about **\$103** (within \$0.10).
goal: tyBY ~ 103 +- 0.1
show: r=0.045
> The appropriation grows by about $0.65r$ (the 35% and 15% of outlays that fall in later years), so about 4.5% gives \$103. A longer outlay tail makes the weighted index more sensitive to inflation.
:::`
    },
    {
      id: 'procedures', title: 'Escalation procedures and examples', summary: 'Step-by-step BY↔TY conversion, multi-year time-phasing, with worked examples',
      body: String.raw`### Step-by-step BY → TY conversion

1. Identify the estimate's **base year** and the **appropriation category** (determines which index table to use).
2. Determine the **year(s) of expenditure** (when money will actually be spent, informed by outlay profile/schedule).
3. Look up the **index values** for base year and each expenditure year.
4. Compute **escalation factor** = Index(expenditure year) / Index(base year).
5. Multiply BY-dollar cost by the escalation factor to get TY amount for that year.
6. Sum across all expenditure years.

### TY → BY conversion (deflating)

Invert the factor:
$$\text{Cost}_{BY} = \text{Cost}_{TY} \times \frac{I_{base}}{I_{expenditure}} = \frac{\text{Cost}_{TY}}{\text{Escalation Factor}}$$

+++

### Example 1: Single-year BY→TY

Cost: \$10.0M in FY2022 constant dollars. Spent in FY2025. Index table (base FY2022 = 1.000): FY2025 index = 1.071.

$$\text{Escalation Factor} = 1.071 / 1.000 = 1.071$$
$$\text{Cost}_{TY} = \$10.0M \times 1.071 = \$10.71M$$

+++

### Example 2: Multi-year spending (time-phased)

Program: \$30.0M in BY (FY2022 constant), spent evenly FY2023–2025 (\$10M/year). Indices: 1.023, 1.048, 1.071.

| FY | BY | Index | TY |
|---|---|---|---|
| 2023 | \$10.0M | 1.023 | \$10.23M |
| 2024 | \$10.0M | 1.048 | \$10.48M |
| 2025 | \$10.0M | 1.071 | \$10.71M |
| **Total** | **\$30.0M** | | **\$31.42M** |

Inflation alone adds \$1.42M.

:::check
Q: Why must a multi-year cost estimate be time-phased before escalation?
* Each year's spending occurs at different price levels; applying a single index to the lump sum ignores outyear inflation.
- Time-phasing reduces the total estimate.
- Only appropriations need time-phasing; actual costs do not.
- Time-phasing is optional when the total is small.
> Each year's portion inflates by that year's index. Skipping time-phasing understates the true then-year total.
:::

:::check
Q: A \$60M BY estimate is split \$20M in FY2023 (index 1.018), \$20M in FY2024 (index 1.041), and \$20M in FY2025 (index 1.065). Total TY cost?
= 62.48
> (\$20.0M × 1.018) + (\$20.0M × 1.041) + (\$20.0M × 1.065) = \$20.36M + \$20.82M + \$21.30M = \$62.48M
:::

+++

### Example 3: TY → BY deflation

Contract paid \$25.0M in FY2024 then-year dollars. Convert to FY2022 constant (Index FY2022 = 1.000, FY2024 = 1.048).

$$\text{Cost}_{BY} = \$25.0M \times \frac{1.000}{1.048} = \$25.0M \times 0.9542 = \$23.85M$$

:::check
Q: A program paid \$22.0M in FY2024 then-year dollars. Index: FY2022 base = 1.000, FY2024 = 1.048. Convert to FY2022 constant dollars.
= 20.99 ±0.01
> Cost(BY) = \$22.0M × (1.000 / 1.048) = \$22.0M × 0.9542 = \$20.99M (constant dollars)
:::`
    },
    {
      id: 'special', title: 'Advanced topics: rebasing, doubling time, time-phasing, pitfalls', summary: 'Changing base year, Rule of 72, time-phasing, custom indices, common errors',
      body: String.raw`### Rebasing an index table to a new base year

When combining data from different base years, pick a common base year and rebase. **Rule**: Divide every index value by the index value of the new base year.

$$\text{Index}'_t = \frac{\text{Index}_t}{\text{Index}_{new\ base}}$$

The new base year becomes 1.000. Relative escalation factors between any two years remain **unchanged** (proof: $(I_a / I_{new}) / (I_b / I_{new}) = I_a / I_b$).

:::check
Q: Base year FY2020 (index 1.000): FY2018 index = 0.950, FY2022 = 1.100. Rebase to FY2022. New FY2018 index? (4 decimals)
= 0.8636 ±0.0002
> 0.950 / 1.100 = 0.8636
:::

:::check
Q: An index table (base FY2022): FY2022 = 1.000, FY2023 = 1.023, FY2024 = 1.048, FY2025 = 1.071. Rebase to FY2024. New FY2025 index? (4 decimals)
= 1.0219 ±0.0002
> 1.071 / 1.048 = 1.0219
:::

+++

### Doubling time and the Rule of 72

At a constant annual inflation rate $r$, how long until prices double?

$$T_{double} = \frac{\ln 2}{\ln(1+r)} \quad \text{or roughly} \quad T_{double} \approx \frac{72}{r\%}$$

Example: At 3% inflation, doubling time ≈ 72/3 = 24 years (exact: 23.4 years).

:::check
Q: Using the Rule of 72, at 2% annual inflation, prices double in approximately how many years?
= 36
> 72 / 2 = 36 years. (Exact: ln(2)/ln(1.02) ≈ 35.0 years.)
:::

:::check
Q: A cost that inflates at 2.4% annually will roughly double in…
= 30
> Rule of 72: 72 / 2.4 = 30 years.
:::

+++

### Time-phasing methodologies

Before escalating, costs must be **time-phased**: spread across the years they will actually be spent. Delays due to schedule changes add inflation even when constant-dollar cost is unchanged. Common phasing profiles: uniform, trapezoidal, beta, **Rayleigh** (for development: rise, peak, tail off).

### Creating and adjusting inflation tables

- **From annual rates**: $I_{t+1} = I_t (1 + r_t)$, with $I_{BY} = 1.000$.
- **Compound escalation over $n$ years**: $I_n = (1 + r)^n$. Do not use simple arithmetic: $1 + (r \times n)$ understates compound inflation.

:::check
Q: Base year index 1.000. If inflation is 2.5% compounded for 3 years, what is the year-3 index? (4 decimals)
= 1.0769 ±0.0002
> (1.025)^3 = 1.0769
:::

:::check
Q: A cost inflates at 3% annually for 4 years. If you use simple escalation (1 + 0.03×4), what do you get vs. the correct compound formula?
= 1.13 ±0.01
> Simple: 1 + (0.03 × 4) = 1.12 (12%). Compound: (1.03)^4 = 1.1255 (12.55%). Simple understates by 0.55 percentage points—significant over time.
:::

+++

### Custom inflation indices

If published indices don't fit (e.g., titanium prices, specialized labor), build a **composite** by weighting multiple relevant price series by their cost shares. The math is the same as the composite-index formula: $\sum (w_i \times I_i)$ where $w_i$ = cost share.

+++

### Common pitfalls and checklist

1. **Mixing constant and then-year dollars** in one analysis.
2. **Wrong appropriation table** (RDT&E ≠ Procurement ≠ O&M, each inflates differently).
3. **Raw vs. weighted confusion**: Using raw index for appropriations (should use weighted) or weighted for outlays (should use raw).
4. **Wrong escalation year**: For costs incurred over a period, use the **midpoint of the expenditure period**, not start or end year.
5. **Forgetting base year**: Always write "in FY[year] dollars" or "in [year] constant dollars."
6. **Simple vs. compound**: Inflation compounds year over year. $(1.03)^5 = 1.159$ (15.9%), not $1 + (0.03 \times 5) = 1.15$ (15%).
7. **Overusing CPI**: Use DoD appropriation-specific indices for defense costs.
8. **Factor direction**: BY → TY: multiply by (TY index / BY index). TY → BY: divide by that factor.

:::tip Mid-point method
When a cost is spread evenly over a period (e.g., work from Jan 2019 to Dec 2021), the "effective" timing is the **midpoint** of the period (about Jan 2020). Use that year's index for escalation, rather than start or end year.
:::`
    }
  ],
  cards: String.raw`
## Concepts
Q: Constant (base-year) dollars
A: Dollars at the price level of one fixed reference year, with inflation removed. Used for analysis and comparison.
Q: Then-year (TY) dollars
A: Actual dollars spent in each year, including accumulated inflation. Used in budget submissions and appropriations.
Q: The base-year estimating paradigm
A: Estimate in constant base-year dollars for comparability and to isolate real cost drivers; convert to then-year dollars for budgets using indices and time-phasing.
Q: Purchasing power
A: What a dollar can buy. Decreases over time under inflation, so the same nominal dollar amount buys less in later years.
Q: Why does cost estimating use BY dollars?
A: Inflation-free comparison; historical data from different years can be analyzed on the same basis; CERs reflect real cost drivers, not inflation artifacts.
Q: Escalation in cost estimating
A: The process of applying an inflation index to convert costs from constant-year dollars to then-year dollars (or vice versa) for budget or historical comparison.
Q: Index in the base year
A: 1.000 (by definition, the reference point).
Q: Why do programs spanning many years underrun if not escalated?
A: Constant-dollar estimates don't account for inflation that will occur over the program span. Without escalation, actual spending will exceed the budget.

## Escalation vs. Discounting
Q: Escalation definition
A: Adjusting for price-level change (inflation); converts BY dollars to TY dollars or vice versa.
Q: Discounting definition
A: Adjusting for time value of money (opportunity cost); converts future cash flows to present value.
Q: Can escalation and discounting both apply to the same cash flow?
A: Yes, but they serve different purposes. Escalation is for budget realism; discounting is for economic analysis (e.g., NPV).
Q: Why must you not confuse escalation with discounting?
A: Escalation reflects inflation (price-level change); discounting reflects opportunity cost. Using the wrong concept produces wrong decisions.
Q: Constant-dollar analysis uses which discount rate?
A: Real discount rate (excludes inflation).
Q: Then-year-dollar analysis uses which discount rate?
A: Nominal discount rate (roughly real rate + inflation).

## Index Numbers and Types
Q: Raw index definition
A: The price level in a single year relative to the base year (1.000). Used for conversions by year of expenditure/outlay.
Q: When to use raw index
A: Converting historical expenditures that were spent in a known fiscal year to constant dollars or to then-year dollars by outlay year.
Q: Escalation factor formula
A: (Index of target year) / (Index of base year). Multiply a BY cost by this to get TY; divide to go TY to BY.
Q: Weighted index definition
A: Raw indices across several future years, weighted by the outlay profile (% of appropriation spent per year). Sums to a single factor.
Q: When to use weighted index
A: Converting BY dollars to TY budget authority (dollars to request in an appropriation year, accounting for multi-year spend-out).
Q: Outlay profile in weighted index
A: The percentage of an appropriated dollar that is actually spent/outlaid in each future year after appropriation. Percentages sum to 1.0.
Q: Why weighted index instead of raw for appropriations?
A: Money appropriated in one year is spent (and inflates) over several years. The weighted index blends the raw indices of future spend-years by their outlay percentages.
Q: Composite index definition
A: Raw (or weighted) indices for different appropriation categories (RDT&E, Procurement, O&M, MILCON), weighted by their dollar share of total program cost.
Q: When to use composite index
A: When a program mixes multiple appropriation categories and a single blended escalation rate is needed for summary-level reporting.
Q: Key difference: weighted vs. composite
A: Weighted blends across future years (outlay phasing) within ONE appropriation; composite blends across appropriation categories by dollar share.
Q: CPI appropriateness for DoD cost estimating
A: Generally NOT appropriate; CPI is a consumer basket, not defense-specific. Use DoD/appropriation-specific indices (RDT&E, Procurement, O&M, MILCON).

## Conversion Procedures
Q: BY to TY conversion formula (general)
A: Cost(TY) = Cost(BY) × [Index(TY) / Index(BY)]
Q: TY to BY conversion formula (deflating)
A: Cost(BY) = Cost(TY) × [Index(BY) / Index(TY)] = Cost(TY) / Escalation Factor
Q: Converting constant FY2020 dollars to then-year FY2025 dollars
A: Cost(TY) = Cost(BY) × [Index(FY2025) / Index(FY2020)]
Q: Converting then-year FY2024 dollars back to constant FY2020 dollars
A: Cost(BY) = Cost(TY) × [Index(FY2020) / Index(FY2024)]
Q: Procedure for multi-year BY→TY conversion
A: Time-phase the total cost by outlay year; escalate each year's BY amount by that year's raw index; sum the TY amounts.
Q: Escalation for \$50M in constant FY2020 dollars, index 1.120 in FY2024, base 1.000
A: \$50M × (1.120/1.000) = \$56M
Q: Deflation for \$84M in then-year FY2024 dollars, index 1.120 for FY2024, base 1.000 for FY2020
A: \$84M × (1.000/1.120) = \$75M (in FY2020 constant dollars)

## Weighted Index
Q: Weighted index formula
A: Weighted Index(t) = Σ[OutlayPct(k) × RawIndex(t+k)] where k = years after appropriation
Q: Example: weighted index calculation
A: Outlay 50%/30%/20%, raw indices 1.023/1.048/1.071: (0.50 × 1.023) + (0.30 × 1.048) + (0.20 × 1.071) = 1.0401
Q: Weighted index for \$40M in BY, appropriated with outlay profile 50/30/20 and indices 1.023/1.048/1.071
A: Weighted = 1.0401; TY budget authority = \$40M × 1.0401 = \$41.60M
Q: Why using raw index alone for a multi-year appropriation understates TY budget authority
A: The raw index reflects prices only at the appropriation year, not the inflation that will accrue to the portion spent in later years. The weighted index accounts for the multi-year spread.

## Rebasing
Q: Rebasing an inflation table
A: Divide every index value by the index value of the new base year. The new base year becomes 1.000.
Q: Rebasing formula
A: Index'(t) = Index(t) / Index(new base year)
Q: After rebasing, do escalation factors between other years change?
A: No. Relative escalation between any two years is unchanged because both numerator and denominator are divided by the same factor.

## Doubling Time and Compound Escalation
Q: Doubling time formula (exact)
A: T(double) = ln(2) / ln(1 + r)
Q: Rule of 72 (doubling time approximation)
A: T(double) ≈ 72 / (rate in percent). Example: 3% → 72/3 = 24 years.
Q: Doubling time at 3% annual inflation (rule of 72)
A: 72/3 = 24 years (exact: 23.4 years)
Q: Compound escalation over n years at rate r
A: Index(n) = (1 + r)^n. Do NOT use simple arithmetic (1 + r×n), which understates.
Q: Compound index after 3 years at 2.5% compounded
A: (1.025)^3 = 1.0769
Q: Compound index after 5 years at 2.5% compounded
A: (1.025)^5 = 1.1314 (total 13.14% cumulative, not 12.5% simple)
Q: Why compound, not simple, escalation over multiple years?
A: Inflation compounds year over year like interest. Simple arithmetic (r × n) significantly understates the true cumulative effect.

## Special Topics and Pitfalls
Q: Mid-point method
A: For costs incurred over a period (e.g., Jan 2019–Dec 2021), use the index at the midpoint of the period (around Jan 2020) for escalation, not start or end year.
Q: Time-phasing definition
A: Spreading a total cost estimate across the years it will actually be spent (using outlay profile) before escalating each year's portion separately.
Q: Rayleigh curve for time-phasing
A: A development-program spending profile: spending rises, peaks mid-program, then tails off. Reflects typical development execution.
Q: Custom inflation index when needed
A: When official indices don't match a program's unique cost mix (specialized commodity or labor, non-standard outlay profile).
Q: Creating a custom composite index
A: Weight multiple raw indices by their cost shares: Composite = Σ(w(i) × Index(i)) where w(i) = cost share of category i.
Q: Three most common escalation errors
A: (1) Using raw instead of weighted for multi-year appropriations; (2) applying a single year's index to a total spent across years; (3) confusing escalation with discounting.
Q: Pitfall: mixing dollar types
A: Never mix constant-year and then-year dollars in the same analysis. Convert all to a common base year first.
Q: Pitfall: wrong appropriation table
A: Each category (RDT&E, Procurement, O&M, MILCON) has different inflation behavior and outlay profiles. Using the wrong table produces a wrong TY estimate.
Q: Pitfall: forgetting base year
A: Always specify "in FY[year] dollars" or "in [year] constant/then-year dollars." Naked dollar amounts are meaningless.
Q: Pitfall: simple vs. compound escalation
A: Inflation compounds. $(1.03)^5$ = 1.159 (15.9%), not 1.15 (15%). Simple arithmetic = significant underestimate.
Q: Pitfall: CPI for DoD
A: CPI tracks consumer goods, not defense-unique costs. Use DoD appropriation-specific indices instead.

## Index Tables
Q: What is a raw-index column in an inflation table?
A: Price level in each year relative to the base year, indexed by year of expenditure/outlay.
Q: Escalation rate in an inflation table
A: Year-over-year percentage change: (Index(t) − Index(t−1)) / Index(t−1) × 100%
Q: Appropriation-category inflation table
A: A published (OSD/DoD) table with raw and weighted indices for a specific "color of money" (e.g., Procurement, RDT&E) and fiscal year.
Q: DoD inflation tables organized by
A: Appropriation category (RDT&E, Procurement by department/commodity, MILCON, O&M, MILPERS) and fiscal year.
Q: Outlay profile row in an inflation table
A: The percentage of an appropriated dollar outlaid in each year after appropriation (e.g., 50% Yr1, 30% Yr2, 20% Yr3).
`
});
