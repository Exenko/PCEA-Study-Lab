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
      body: String.raw`**Inflation** is an increase in the volume of money and credit relative to available goods and services, resulting in a continuing rise in the general price level. This **lowers purchasing power** per dollar. In cost estimating, this means "\$100M" is meaningless without specifying *which year's dollars, and which type*.

CEBoK draws a strict distinction: **inflation** refers to historical (and projected) changes in price levels, while **escalation** is when the effects of inflation are applied to a dollar amount (**de-escalation** removes them). In common parlance the two words are often used interchangeably, but this module does not.

### Dollars: the key terms

| Term | Meaning |
|---|---|
| **Current Year (CY) dollars** | Money or prices expressed in terms of values actually observed in the economy at the time. Current Year dollars refer to **expenditures**, not obligations. |
| **Constant Year / Base Year (BY) dollars** | Dollars reflected against one specific year, adjusted for inflation. Constant Year and Base Year mean the same thing; "Base Year" is often used for the Base Year of an inflation table or of the program. |
| **Then Year (TY) dollars** | Dollars adjusted to account for outlay profiles, covering escalation of expenditures over a multi-year period. Then Year dollars are used for budget submissions and refer to **obligations**, not expenditures. |
| **Fiscal Year (FY) dollars** | Just a 12-month period label — could be CY, BY, or TY depending on context. Never assume; check what "FY08\$" means from context. |
| **Table's Year** | The Base Year of a specific *index table* — not necessarily the same as the Base Year of the CER or of the estimate. |

:::check
Q: At 2.5% inflation, what is the purchasing power of a dollar next year compared to this year? (4 decimals)
= 0.9756 ±0.0002
> Purchasing power = 1 / (1 + 0.025) = 1 / 1.025 = 0.9756. Money buys less when prices rise.
:::

+++

### The base-year estimating paradigm

All historical data is escalated to a single **Base Year** (usually the present year or the estimate's original year) for developing CERs and other estimating methods. Once a base-year cost estimate exists, it is **time-phased** across the estimated schedule, producing an expenditure or obligation profile. Finally, the base-year costs in each time period are escalated to Current-Year or Then-Year dollars using **raw** or **weighted** indices, respectively — each year escalated with that year's proper index.

Distinguish an **expenditure profile** (when dollars are actually spent = Current Year dollars → use raw indices) from an **obligation profile** (when dollars must be budgeted = Then Year dollars → use weighted indices).

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

:::check
Q: Which type of dollars refers to obligations rather than expenditures?
* Then Year (TY) dollars
- Current Year (CY) dollars
- Constant Year dollars
> Then Year dollars are part of Total Obligational Authority and cover escalation of expenditures over a multi-year obligation period. Current Year dollars refer to expenditures.
:::

+++

### Inflation defined, and why it matters

- **General economy-wide inflation** (monetary policy, supply/demand) is tracked by broad indices like CPI.
- **Sector-specific inflation** in defense (materials, aerospace labor, shipbuilding steel) can differ from the economy. DoD maintains **appropriation-specific indices** (RDT&E, Procurement, O&M, MILCON) because each inflates differently.
- Inflation rates for future years are always estimates; a constant assumed rate near the current rate is common. In the early 1980s escalation factors were 12-15%; when inflation later fell, programs estimated at those rates faced budget cuts. More commonly, assumed rates are later found **too low**, leaving out-year budgets insufficient.
- A program spanning 10 years will pay different prices in Year 10 than Year 1 for identical goods, purely due to inflation. Failing to escalate is one of the most common sources of **underestimated** program cost.

:::tip Fig 5.2: sensitivity to the assumed rate
Figure 5.2 compares a lower rate (3%) and a higher rate (5%) against an assumed constant rate of 4%, over twenty years. Even a one-percentage-point difference compounds into significant then-year dollar differences in the out years. Because of compounding, even symmetric percentage-point risks around the assumed rate produce **asymmetric** dollar risk: the overrun risk from underestimating inflation outweighs the underrun opportunity from overestimating it.
:::

:::widget inflation-sensitivity:::

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
| Purpose | Convert BY dollars to TY dollars (or vice versa) for budget planning | Convert future cash flows to a common point in time (present value) for economic comparison |
| Rate used | Inflation rate | Discount rate, generally tied to a rate of return, usually greater than inflation |
| Dollars used with | Indices convert Constant Year dollars to Current Year / Then Year dollars | Nominal discount rates with Current Year dollars; real discount rates with Constant Year dollars |

Discounting is covered in detail in Module 13 Economic Analysis; it lets estimators compare the present-value cost of alternatives.

:::example Real rate of return
Consider a 5% nominal rate of return with 3% inflation. The **real rate of return** is the quotient of the nominal growth factor and the inflation factor: 1.05 / 1.03 = 1.0194, i.e. a **1.94%** real return — approximately, but not exactly, the simple difference of 2%. The nominal rate is what investments are typically measured against; the real rate indicates the actual increase in purchasing power.
:::

:::check
Q: A nominal rate of return is 5% and inflation is 3%. What is the real rate of return? (4 decimals as a factor)
= 1.0194 ±0.0002
> Real rate factor = 1.05 / 1.03 = 1.0194, i.e. a 1.94% real return — close to, but not exactly, the 2% simple difference.
:::

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
:::

:::check
Q: Real vs. nominal discount rates are applied to which dollar types, respectively?
* Real discount rates to Constant Year dollars; nominal discount rates to Current Year dollars
- Real rates to Then Year dollars; nominal rates to Base Year dollars
- Either rate can be applied to either dollar type interchangeably
> Real rates already exclude inflation, matching Constant Year dollars; nominal rates include inflation, matching Current Year dollars.
:::`
    },
    {
      id: 'indices', title: 'Index numbers: raw, weighted, and composite', summary: 'Raw, weighted (Navy/AF harmonic vs. Army arithmetic), and composite indices',
      body: String.raw`An **index** expresses the price level in a given year relative to a **base year**, where base year = 1.000. Indices are factors and are always multiplicative — multiply or divide depending on direction.

+++

### Raw Index

A raw index is a number representing the change in prices relative to a Base Year of 1.0000, used for **Constant Year to Constant Year** conversions (actual or projected expenditures, not obligations).

**Constant inflation example (Figs 5.3/5.4):** at a constant 5% inflation rate, costs each year are 1.05 times the prior year. The raw index for year two relative to year zero is 1.05 squared = **1.1025**. When inflation is constant, a table isn't strictly needed since the index n years forward is just $(1+r)^n$; when inflation is *not* constant, tables of indices become essential.

:::example Fig 5.5: nonconstant inflation (Navy 2001 indices)
Using the Navy's 2001 indices for what \$1,000 in 2001 was equivalent to over the prior 31 years: from 1981 to 2001 (twenty years), military pay price levels rose by a factor of about **2.12** (3.8% annualized), while RDT&EN price levels rose by a factor of about **1.77** (2.9% annualized) — military pay has inflated faster than RDT&EN purchases.

For 1981-1985: the raw index for 1982 relative to 1981 is **1.1371** (13.71%); the raw index for 1985 relative to 1982 is **1.1140** (11.40%) — prices rose *less* over those three years than in the one prior year. Chaining: the raw index for 1985 relative to 1981 is 1.1371 × 1.1140 = **1.2668**. When assessing inflation risk, note that the low rates of the 2000s-2010s are not always typical; use 30-40 years of data if available.

The Fig 5.5 x-axis includes a year labeled **"197T"**: the government's fiscal year ran July-June through 1976; from 1977 on it runs October-September. 197T is the three-month correction period (July, August, September 1976) that bridges the switch.
:::

:::check
Q: The raw index for 1982 relative to 1981 is 1.1371, and for 1985 relative to 1982 is 1.1140. What is the raw index for 1985 relative to 1981?
= 1.2668 ±0.0005
> Chain the raw indices: 1.1371 × 1.1140 = 1.2668.
:::

:::check
Q: What does the "197T" year on a DoD inflation chart represent?
* The three-month fiscal-year correction period (Jul-Aug-Sep 1976) when the government switched from a July-June to an October-September fiscal year
- A typo for 1970
- A transition to metric units
> Fiscal years ran July-June through 1976, then October-September from 1977 on; 197T covers the bridging quarter.
:::

+++

### Consumer Price Index (CPI)

The CPI tracks a basket of commodities from apparel to wages. To compute the inflation rate from one period to another: (later price − earlier price) / earlier price. To compute the index: later price / earlier price. To annualize an index over a span of years, raise it to the power of the reciprocal of the number of years in the span.

:::example Fig 5.6: gasoline prices
Capital-region gasoline rose from \$1.15 in January 1998 to \$1.44 in September 2001. Inflation rate = (1.44 − 1.15) / 1.15 = **25.2%**. Index = 1.44 / 1.15 = **1.252**. The span is 44 months (44/12 years); annualized rate = 1.252^(12/44) − 1 ≈ **6.3%**.

This example was deliberately left un-updated to illustrate the danger of constant-rate projection: gasoline peaked above \$4/gallon in summer 2008, but projecting the 6.3% annualized rate forward from the \$1.44 September 2001 price would have predicted only about **\$2.21** by September 2008.
:::

:::check
Q: Gasoline rose from \$1.15 (Jan 1998) to \$1.44 (Sep 2001), a 44-month span. What is the annualized inflation rate?
= 6.3 ±0.2
> Index = 1.44/1.15 = 1.252. Annualized = 1.252^(12/44) - 1 ≈ 6.3%.
:::

:::warn Constant-rate projection is dangerous
Projecting the 6.3% annualized gasoline rate from \$1.44 (Sep 2001) forward to Sep 2008 predicts only about \$2.21 — far below the actual peak above \$4. A constant-rate assumption can badly miss real-world price shocks.
:::

+++

### Composite Index

A composite index is a **weighted average of the inflation indices for applicable sub-appropriations or commodities**, used when a cost is funded by more than one appropriation. Determine the percent of cost associated with each index, multiply each index by its percent, and sum.

:::example Composite Material Index Example
A cost is comprised of three commodities: steel (20% of cost, 5.6% escalation rate), automotive (35%, 6.2%), and machinery (45%, 5.7%).

Composite escalation rate = 0.20 × 5.6% + 0.35 × 6.2% + 0.45 × 5.7% = **5.855%**

Composite escalation index = 0.20 × 1.056 + 0.35 × 1.062 + 0.45 × 1.057 = **1.05855**

As expected, the composite rate falls roughly in the middle of the individual rates. Rates and indices are equivalent ways of doing this calculation.
:::

Some of the Navy's composite indices:

| Composite | Components |
|---|---|
| **RDT&EN** | RDT&E Purchases 88.55% + Civilian Payroll 11.45% |
| **O&MN** | O&M Purchases 41.74% + Civilian Payroll 41.21% + Fuel 17.05% |
| **MILCON** | Civilian Pay 7.18% + Military Construction Purchases 92.82% |

A **weighted arithmetic mean** is the correct calculation for composite indices of custom items.

:::check
Q: A composite cost is 20% steel (5.6% rate), 35% automotive (6.2% rate), 45% machinery (5.7% rate). What is the composite escalation index?
= 1.05855 ±0.0002
> 0.20×1.056 + 0.35×1.062 + 0.45×1.057 = 1.05855 (composite rate 5.855%).
:::

:::check
Q: The Navy's RDT&EN composite index combines which two components, and in what shares?
* RDT&E Purchases (88.55%) and Civilian Payroll (11.45%)
- RDT&E Purchases (50%) and Civilian Payroll (50%)
- O&M Purchases and Fuel
> Fig 5.12/composite-index list: RDT&EN = 88.55% RDT&E purchases + 11.45% civilian payroll.
:::

+++

:::widget composite-index:::

### Weighted Index

**From appropriation to expenditure:** an **appropriation** provides budget authority; once committed, it becomes an **obligation** (a legal duty to pay, incurred when an order is placed or a contract awarded); once paid, it becomes an **expenditure**. Once obligated, DoD funds must generally be expended within five years. An **outlay profile** is the historical rate, in percentage terms, at which an appropriation's dollars are expected to be expended, with year one being the year of appropriation.

Some money (military/civilian pay, fuel) must be appropriated and spent the same year; other money (RDT&E, MILCON, procurement) is obligated and expended over "out years." Procurement dollars are **fully funded** at the start of production; RDT&E dollars are **incrementally funded** each year.

There are **two methods** of computing weighted indices, differing on whether the outlay profile is assumed to reflect each year's own dollars, or year-one dollars:

| | **Navy/Air Force method** | **Army method** |
|---|---|---|
| Assumption | Outlay profile reflects **each year's** dollars | Outlay profile reflects **year-one** (Base Year) dollars |
| Equivalent to | Weighted **harmonic** mean of raw indices by outlay % | Weighted **arithmetic** mean of raw indices by outlay % |
| Army's name for this | — | Calls the weighted index a "composite index" (conflicts with this module's use of that term) |

This module uses the **Navy/Air Force (harmonic)** method in its examples.

:::example Outlay Profile Example A: deriving the weighted index (Figs 5.7/5.8)
Outlay profile: 40% year 1, 30% year 2, 20% year 3, 10% year 4 (raw indices such that year 2 de-escalates to 0.273, year 3 to 0.165, year 4 to 0.075 — inflation is zero in year 1 itself).

1. Portion spent per year: 0.400, 0.300, 0.200, 0.100 (dollar-for-dollar of the obligation).
2. Divide each portion by its year's raw index (de-escalate to year-one dollars): 0.400, 0.273, 0.165, 0.075.
3. Sum the de-escalated contributions: 0.400 + 0.273 + 0.165 + 0.075 = **0.9131**. A dollar obligated in year one, spent per this profile, is worth only about 91-92 cents in year-one dollars.
4. Take the reciprocal for the weighted index: 1 / 0.9131 = **1.0952**.

So \$1.0000 / 1.0952 = \$0.9131 (the worth of the expenditure stream per obligated dollar). In practice this is reversed: a need for \$1M of purchasing power requires a budget of \$1M × 1.0952 = **\$1.0952M**.

These calculations are sensitive to rounding — carry many decimal places.
:::

**One-way indices:** weighted indices only convert **Current/Constant Year → Then Year** by multiplying; dividing goes **Then Year → Current/Constant Year**. They are not used in the reverse direction of that pairing.

**Steps to build a weighted index from an outlay profile:**
1. Use the outlay profile to determine the portion spent in each out-year.
2. Divide each portion by its year's raw index (de-escalate).
3. Sum the de-escalated values.
4. Take the reciprocal — that is the weighted index.

The raw index for a table's Base Year is always **1.00** (no escalation needed there); the **weighted** index for that same Base Year is always **slightly greater than 1.00** (it must still account for out-year inflation).

:::check
Q: An outlay profile de-escalates to a total of 0.9131 (Fig 5.7/5.8 example: 0.400+0.273+0.165+0.075). What is the weighted index?
= 1.0952 ±0.0005
> Weighted index = 1 / 0.9131 = 1.0952 (the reciprocal of the summed de-escalated contributions).
:::

:::check
Q: Why is the Navy/Air Force weighted-index method equivalent to a weighted harmonic mean?
* It divides (de-escalates) each outlay-year's portion by its raw index, sums those quotients, then takes the reciprocal — exactly the weighted-harmonic-mean construction
- It multiplies each outlay-year's portion by its raw index and sums
- It takes the geometric mean of the raw indices
> Divide-then-sum-then-reciprocate is the definition of a weighted harmonic mean of the raw indices, weighted by outlay percentage.
:::

:::check
Q: Why is a weighted index "one-way"?
* Multiplying by it converts Current/Constant Year to Then Year; dividing converts Then Year to Current/Constant Year — it cannot be used the other direction of either pairing
- It can only be applied to RDT&E appropriations
- It only works for the table's Base Year
> Weighted indices are defined for the CY↔TY conversion in one fixed direction per operation (multiply forward, divide backward), unlike raw indices used purely for CY↔CY.
:::

:::check
Q: In an index table, what is true of the raw index vs. the weighted index for the table's own Base Year?
* The raw index is always 1.00; the weighted index is always slightly greater than 1.00
- Both are always exactly 1.00
- The weighted index is always slightly less than 1.00
> No escalation is needed to convert the Base Year to itself (raw = 1.00), but the weighted index still has to account for inflation in the out-years the obligation will be spent in, so it is slightly above 1.00.
:::

+++

:::widget weighted-index:::

### Obligations vs. outlays (Figs 5.9-5.11)

Consider \$1,000,000 obligated under two different Navy appropriations (year one = 2001). **Civilian pay** is spent 100% in year one — no inflation applies. **RDT&EN** is spread over five years (mostly the first two), reflecting that RDT&EN is "two-year money" with a five-year expiration period after that (so years 6-7 outlay proportions may be small positive values, not shown here); RDT&EN is partial (incremental) funding, not the full program.

:::example RDT&EN weighted escalation rate
Using the Navy/Air Force weighted-index formula on the RDT&EN outlay profile:

Weighted index = 1 / [0.5233 + (0.361/1.0160) + (0.0579/1.0323) + (0.0393/1.0539) + (0.0185/1.0761)] = **1.0109**

The result is slightly greater than 1.0000, as expected, because the assumed inflation rates here are relatively low.
:::

:::check
Q: For a civilian-pay appropriation where 100% of the money is spent in year one, what is the weighted index?
= 1.0000 ±0.0001
> With 100% spent in the appropriation year itself, there is no out-year inflation to account for, so the weighted index equals the raw index for that year: 1.0000.
:::

:::widget escalation:::

:::challenge escalation r=0.025 o1=0.5 o2=0.35 o3=0.15 amt=100 lock=r,o1,o2,o3,amt
Q: 100 BY2025\$ of work will be appropriated in 2025 and outlaid 50% / 35% / 15% over three years at 2.5% inflation. Predict the TY\$ you must appropriate in 2025.
predict: tyBY +- 0.5%
> This exercise uses CEBoK's Navy/Air Force **harmonic-mean** method (the widget default): weighted index = 1 / [0.50/1 + 0.35/1.025 + 0.15/1.025^2] = 1.0160, so about \$101.60 TY. The Army **arithmetic-mean** method, 0.50(1) + 0.35(1.025) + 0.15(1.025^2) = 1.0163, gives about \$101.63 — the two methods differ because they assume different things about whose dollars the outlay percentages are stated in. Either way, the raw index for 2025 alone (1.0000) is not enough: money appropriated in 2025 is still spent at later, higher price levels.
:::

:::challenge escalation r=0.025 o1=0.5 o2=0.35 o3=0.15 amt=100 lock=o1,o2,o3,amt
Q: Keep the same outlay profile. Find the inflation rate at which the 2025 appropriation must be about **\$103** (within \$0.10).
goal: tyBY ~ 103 +- 0.1
show: r=0.0475
> Practice data (illustrative, not from CEBoK). The appropriation grows by about $0.65r$ (the 35% and 15% of outlays that fall in later years), so roughly 4.75% gives \$103 with the widget's default Navy/Air Force (harmonic) method. (The Army arithmetic method would need about 4.57%.) A longer outlay tail makes the weighted index more sensitive to the assumed inflation rate.
:::

+++

### Budget Year Multiplier

A special index, unique to Then Year ↔ Then Year conversions: the **quotient of two weighted indices** — the weighted index for a given year divided by the weighted index for the table's Base Year. It converts TY directly to TY without an intermediate CY step. Of the three services, **only the Navy** publishes this index. It is handled just like a raw index, except relative to the table's **Then Year** dollars rather than its Base Year.

The Army's names differ from this module's: the Army calls the raw index a **"compound index"** and the weighted index a **"composite index"**.

:::check
Q: What is the Budget Year Multiplier, and which service publishes it?
* The quotient of two weighted indices (a given year's weighted index ÷ the Base Year's weighted index), letting Then Year convert directly to Then Year; only the Navy publishes it
- A raw index used for Constant Year conversions; all three services publish it
- The Army's name for the composite index
> Budget year multipliers combine weighted and raw indices to simplify TY-to-TY conversion; they appear only in Navy tables.
:::

:::check
Q: What does the Army call the raw index and the weighted index, respectively?
* Compound index (raw); composite index (weighted)
- Compound index (weighted); composite index (raw)
- The Army uses the same names as the Navy/Air Force
> Army terminology differs from the rest of this module: raw = compound, weighted = composite.
:::

+++

### Consumer Price Index — use with caution for DoD

CPI is **generally not appropriate** for DoD cost estimating because it reflects consumer purchases, not defense-unique materials and labor. Use DoD/appropriation-specific indices instead.

:::check
Q: Your estimate covers aerospace labor and titanium procurement. Should you use the Consumer Price Index (CPI) for escalation?
* No; CPI tracks consumer goods, not defense-unique materials and labor. Use DoD/appropriation-specific indices instead.
- Yes; CPI is the standard for all U.S. cost estimation.
- Yes, but only for the labor portion.
> Defense costs inflate differently than consumer prices. CPI-based escalation would misstate true DoD cost growth.
:::`
    },
    {
      id: 'procedures', title: 'Escalation procedures and examples', summary: 'The table\'s-year waystation, to-over-from, and the four CEBoK worked examples',
      body: String.raw`Two basic principles govern every inflation-table lookup:

1. **Raw** indices are used for CY ► CY; **weighted** indices are used for CY ◄► TY. (For these purposes, Current Year = Constant Year.)
2. If going **from** the table's year to any other year, **multiply**. If going **from** any other year **to** the table's year, **divide**.

+++

### Fig 5.13: the table's-year waystation

The flow chart for any of the four conversions (CY►CY, CY►TY, TY►CY, TY►TY) uses the table's year as a **waystation**: first convert the starting dollars *to* the table's year (dividing, since you're going from another year to the table's year), then convert *from* the table's year to the ending year (multiplying, since you're going from the table's year to another year).

Step by step:
1. Determine the starting type of dollars (CY/TY and year) and the ending type of dollars (CY/TY and year).
2. Choose the appropriation and its index table(s); note the table's Base Year (the "table's year").
3. Convert to CY of the table's year: **divide** — by the **raw** index if starting from CY, by the **weighted** index if starting from TY.
4. Convert to the CY or TY of the ending year: **multiply** — by the **raw** index if ending in CY, by the **weighted** index if ending in TY.

### Fig 5.14: "To over From"

An equivalent mnemonic: divide by the index of the **FROM** row (raw if from Constant Year, weighted if from Then Year), then multiply by the index of the **TO** row (raw if to Constant Year, weighted if to Then Year).

+++

:::widget cy-ty-stepper:::

### Escalation Example A: CY ► CY (Navy civilian pay)

\$100K CY07 (an actual cost, not a budget estimate) needs to become CY18 (still not feeding a budget). Table's year = 2010.

Step 3 (to table's year, divide by raw index): \$100K CY07 / 0.918 = **\$108.9K CY10**
Step 4 (to ending year, multiply by raw index): \$108.9K CY10 × 1.200 = **\$130.7K CY18**

:::check
Q: \$100K CY07 is converted to the table's year CY10 by dividing by the raw index 0.918, then to CY18 by multiplying by the raw index 1.200. What is the final CY18 amount?
= 130.7 ±0.2
> \$100K / 0.918 = \$108.9K CY10; \$108.9K × 1.200 = \$130.7K CY18.
:::

+++

### Escalation Example B: CY ► TY (Air Force RDT&EN)

\$10M CY06 (a cost, from an analogy) must become TY15 (feeding a budget submission). Table's year = 2015.

Step 3 (to table's year, divide by raw index): \$10M CY06 / 0.832 = **\$12.0M CY15**
Step 4 (to ending year, multiply by weighted index — even same-year CY→TY needs this small conversion): \$12.0M CY15 × 1.012 = **\$12.2M TY15**

:::check
Q: \$10M CY06 divides by the raw index 0.832 to reach CY15, then multiplies by the weighted index 1.012 to reach TY15. What is the TY15 amount?
= 12.2 ±0.05
> \$10M / 0.832 = \$12.0M CY15; \$12.0M × 1.012 = \$12.2M TY15.
:::

+++

### Escalation Example C: TY ► CY (Army MILCON)

\$10M TY15 (from a budget submission) must become CY09 (not feeding a budget). Table's year = 2008 (Army tables carry multiple Base Years; 2007 values could equally have been used).

Step 3 (to table's year, divide by weighted index — starting from TY): \$10M TY15 / 1.198 = **\$8.3M CY08**
Step 4 (to ending year, multiply by raw index): \$8.3M CY08 × 1.020 = **\$8.5M CY09**

:::check
Q: \$10M TY15 divides by the weighted index 1.198 to reach CY08, then multiplies by the raw index 1.020 to reach CY09. What is the CY09 amount?
= 8.5 ±0.1
> \$10M / 1.198 = \$8.3M CY08; \$8.3M × 1.020 = \$8.5M CY09.
:::

+++

### Escalation Example D: TY ► TY (Navy RDT&EN composite)

\$100M TY15 (budget submission) must move two years earlier to TY13 (still a budget estimate). Table's year = 2009; the Navy RDT&EN **composite** indices are used because the specific commodity proportions aren't known.

**Method 1 — through the table's year:**
Step 3 (divide by weighted index): \$100M TY15 / 1.142 = **\$87.6M CY09**
Step 4 (multiply by weighted index): \$87.6M CY09 × 1.098 = **\$96.1M TY13**

**Method 2 — Budget Year Multiplier** (Navy only; treated like a raw index but relative to the table's Then Year rather than its Base Year):
\$100M TY15 / 1.126 = **\$88.8M TY09** (note: slightly greater than the \$87.6M CY09 above, as expected when comparing TY vs. CY of the same year)
\$88.8M TY09 × 1.082 = **\$96.1M TY13** — the same answer.

:::check
Q: (Example D) \$100M TY15 converts to \$87.6M CY09 (÷1.142) then to TY13 (×1.098). What is the final TY13 amount?
= 96.1 ±0.2
> \$100M / 1.142 = \$87.6M CY09; \$87.6M × 1.098 = \$96.1M TY13.
:::

:::check
Q: Using the Budget Year Multiplier method instead, \$100M TY15 / 1.126 gives what TY09 amount, and what does that then become at TY13 (× 1.082)?
= 96.1 ±0.2
> \$100M / 1.126 = \$88.8M TY09; \$88.8M × 1.082 = \$96.1M TY13 — matching Method 1.
:::

+++

### Mid-point method

When exact expenditure/obligation timing isn't known (e.g., \$15M spent sometime across 2006-2008, roughly evenly), use the index for the **midpoint** of that span (2007) for the whole amount. Only use this for converting *historical* data whose exact profile is unknown — never use the midpoint method to convert an estimate into a multi-year estimate; instead, time-phase the base-year estimate first, then apply each year's own inflation rate.

:::check
Q: Why must a multi-year cost estimate be time-phased before escalation, rather than escalated as a lump sum?
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

:::check
Q: A program paid \$22.0M in FY2024 then-year dollars. Index: FY2022 base = 1.000, FY2024 = 1.048. Convert to FY2022 constant dollars.
= 20.99 ±0.01
> Cost(BY) = \$22.0M × (1.000 / 1.048) = \$22.0M × 0.9542 = \$20.99M (constant dollars)
:::

:::tip Beyond CEBoK: quick single-year escalation
For a single-year, same-table-year conversion, the general formula collapses to Cost(target) = Cost(source) × Index(target)/Index(source). This is the same as running the table's-year waystation when the "table's year" happens to equal the source or target year (one of the two steps becomes ×1).
:::`
    },
    {
      id: 'special', title: 'Related and Advanced Topics (CEBoK)', summary: 'Time phasing, doubling time, custom indices, pitfalls and means, special cases',
      body: String.raw`### Time Phasing Methodologies

Time phasing relates percent spent (cost) to percent elapsed (duration) for past programs, using an analogy or average to spread estimates for future programs. Common methods: Level-Loaded, Throughput, Schedule-Based, Trapezoid, Learning Curve, and Probability Distribution-Based (e.g., a **Rayleigh** curve for development: rise, peak, tail off). Time-phasing is often done at the program level; if major elements are phased separately, pay attention to below-the-line elements such as Systems Engineering and Program Management.

+++

### Doubling Time — the Rule of 70 (sometimes quoted as 72)

At a per-period inflation rate $x$ (as a percent), the number of periods $n$ to double is:

$$(1 + \frac{x}{100})^n = 2 \quad\Rightarrow\quad n = \frac{\ln 2}{\ln(1 + x/100)}$$

Approximating the denominator by the first Taylor term rounds $\ln 2 = 0.693$ up to 0.7, giving:

$$n \approx \frac{70}{x}$$

This is the **"Rule of 70,"** sometimes quoted as the **Rule of 72**. At 5% inflation, doubling takes about 70/5 = **14 years**; at 7%, about 70/7 = **10 years**. 70 and 72 are both convenient because together they're even multiples of every single-digit percent plus 10, 12, and 14 — but both are only approximations.

:::check
Q: Using the Rule of 70, at 5% annual inflation, about how many years until prices double?
= 14 ±0.5
> 70 / 5 = 14 years.
:::

:::check
Q: Using the Rule of 72 (the secondary/alternate form), at 2% annual inflation, about how many years until prices double?
= 36
> 72 / 2 = 36 years. (Exact: ln(2)/ln(1.02) ≈ 35.0 years.)
:::

+++

### Creating an Inflation Table (Fig 5.23)

1. **FY** column.
2. **Rate** column, pulled directly from OSD inflation guidance.
3. **Raw index** column = rate + 1 (compounded from the prior year).
4. **Weighted index** column, built from the commodity's outlay profile and the raw indices (Weighted Indices method above).
5. **Budget year multiplier** column = that year's weighted index ÷ the table's Base Year weighted index.

### Adjusting (Rebasing) the Base Year of an Inflation Table (Fig 5.24)

Rebasing to a new table year is itself a CY(old table year) → CY(new table year) computation applied to **every** value in the table, for both raw and weighted indices. **Rule:** divide each index value by the new base year's index value (in the *original* table). The new base year becomes 1.000; relative escalation factors between any two other years are unchanged, since both numerator and denominator are divided by the same factor.

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

### Custom Inflation Indices

When published indices don't fit — technology deflation (e.g., hard-disk storage), unusually high inflation (fuel, steel), or a known contractor's own escalation/deflation rate — build a custom index using the same weighted-indices technique: gather historical data on the percent of future expenditures per commodity and the inflation rate for each.

+++

### Inflation Pitfalls and Means

Three "Pythagorean" means matter here:

- **Arithmetic mean (AM)**: sum divided by count — the usual meaning of "average."
- **Geometric mean (GM)**: multiply the values, then take the $n$th root.
- **Harmonic mean (HM)**: the reciprocal of the arithmetic mean of the reciprocals.

For any set of positive numbers, **AM ≥ GM ≥ HM**, with equality only if all values are equal.

Where each mean belongs:

| Situation | Correct mean |
|---|---|
| Composite index for custom items | Weighted **arithmetic** mean |
| Weighted index from a Navy/Air Force outlay profile | Weighted **harmonic** mean |
| Midpoint (centroid) of a sequence of CY expenditures | Weighted **harmonic** mean (weights = expenditures) |
| Average effective inflation rate over a span of periods | **Geometric** mean of the period rates |

:::check
Q: Which relationship always holds among the arithmetic, geometric, and harmonic means of a set of positive numbers?
* AM ≥ GM ≥ HM, with equality only if all numbers are equal
- HM ≥ GM ≥ AM
- They are always equal
> This is a proven property of the Pythagorean means.
:::

:::check
Q: Which mean is correct for computing the composite index of custom items, and which for the Navy/Air Force weighted index from an outlay profile?
* Weighted arithmetic mean for the composite index; weighted harmonic mean for the Navy/Air Force weighted index
- Weighted harmonic mean for both
- Weighted geometric mean for both
> Composite indices blend appropriation shares (arithmetic); the Navy/AF weighted index de-escalates and reciprocates (harmonic).
:::

:::check
Q: What mean should be used to find the average effective inflation rate over a multi-period span?
* The geometric mean of the period rates, because of the compounding effect
- The arithmetic mean of the period rates
- The harmonic mean of the period rates
> Inflation compounds multiplicatively across periods, so the correct average rate over the span is the geometric mean, not the arithmetic mean.
:::

+++

### CY-to-CY Special Cases

Escalating Constant/Current Year to Constant/Current Year always uses a **raw** index (expenditures only, not obligations):

- **Table's Base Year = the starting CY**: use the raw index for the target CY; **multiply**.
- **Table's Base Year = the target CY**: use the raw index for the starting CY; **divide**.
- **Table's Base Year is neither** (the general case): first divide by the raw index for the starting CY (to reach the table's year), then multiply by the raw index for the target CY. If the Base Year happens to equal one of the two CYs, one factor is 1.0000 and this reduces to one of the two simpler cases above.

+++

:::tip Beyond CEBoK: compound formula
The compound-growth formula is $I_n = (1+r)^n$. A single flat rate is a simplification; CEBoK-grade estimating uses the actual published index tables, where the rate varies year to year.
:::

+++

### Common pitfalls checklist (Beyond CEBoK summary)

1. **Mixing constant and then-year dollars** in one analysis.
2. **Wrong appropriation table** (RDT&E ≠ Procurement ≠ O&M ≠ MILCON — each inflates differently).
3. **Raw vs. weighted confusion**: using a raw index for appropriations (should be weighted) or a weighted index for expenditures (should be raw).
4. **Wrong escalation year**: for costs spread over a period with unknown detail, use the **midpoint**, not start or end year.
5. **Forgetting the base year**: always write "in FY[year] dollars" or "in [year] constant dollars."
6. **Simple vs. compound**: inflation compounds year over year — do not use $1 + (r \times n)$.
7. **Overusing CPI**: use DoD appropriation-specific indices for defense costs.
8. **Factor direction**: table's-year-to-other-year is multiply; other-year-to-table's-year is divide.
9. **Using the wrong mean**: see Pitfalls and Means above — arithmetic, geometric, and harmonic means each answer a different question.

:::tip Mid-point method (CEBoK example)
Total expenditure over 2006-2008 was \$15M, but the yearly split is unknown. If it was spread roughly evenly, the mid-point is **2007**, so use 2007's index to escalate the whole \$15M to 2010 dollars; if most was spent in 2006, use 2006. Use the mid-point only for historical data with an unknown profile; for a multi-year estimate, time-phase the base-year estimate and apply each year's rates.
:::`
    }
  ],
  cards: String.raw`
## Concepts
Q: Constant (base-year) dollars
A: Dollars at the price level of one fixed reference year, with inflation removed. Used for analysis and comparison.
R: yes
Q: Then-year (TY) dollars
A: Actual dollars adjusted to account for outlay profiles, covering escalation of expenditures over a multi-year period. Used in budget submissions; refer to obligations, not expenditures.
R: yes
Q: The base-year estimating paradigm
A: Estimate in constant base-year dollars for comparability and to isolate real cost drivers; convert to then-year dollars for budgets using indices and time-phasing.
Q: Purchasing power
A: What a dollar can buy. Decreases over time under inflation, so the same nominal dollar amount buys less in later years.
R: yes
Q: Why does cost estimating use BY dollars?
A: Inflation-free comparison; historical data from different years can be analyzed on the same basis; CERs reflect real cost drivers, not inflation artifacts.
Q: Escalation in cost estimating
A: The process of applying an inflation index to convert costs from constant-year dollars to then-year dollars (or vice versa) for budget or historical comparison. De-escalation removes the effect.
R: yes
Q: Index in the base year
A: 1.000 (by definition, the reference point).
Q: Why are programs spanning many years underfunded if not escalated?
A: Constant-dollar estimates don't account for inflation that will occur over the program span. Without escalation, actual spending will exceed the budget.
Q: Current Year (CY) dollars refer to which type of spending: expenditures or obligations?
A: Expenditures. Then Year (TY) dollars refer to obligations.
Q: The "table's year"
A: The Base Year of a specific index table — not necessarily the same as the Base Year of the CER, the estimate, or another index table.
R: yes

## Escalation vs. Discounting
Q: Escalation definition
A: Adjusting for price-level change (inflation); converts BY dollars to TY dollars or vice versa.
R: yes
Q: Discounting definition
A: Adjusting for time value of money (opportunity cost); converts future cash flows to a common point in time (present value) for comparison.
R: yes
Q: Can escalation and discounting both apply to the same cash flow?
A: Yes, but they serve different purposes. Escalation is for budget realism; discounting is for economic analysis (e.g., NPV).
Q: Why must you not confuse escalation with discounting?
A: Escalation reflects inflation (price-level change); discounting reflects opportunity cost. Using the wrong concept produces wrong decisions.
Q: Constant-dollar analysis uses which discount rate?
A: Real discount rate (excludes inflation).
Q: Then-year-dollar analysis uses which discount rate?
A: Nominal discount rate (includes inflation; applied to Current Year dollar amounts).
Q: Real rate of return: nominal 5%, inflation 3%
A: 1.05 / 1.03 = 1.0194, a 1.94% real return — approximately, but not exactly, the simple 2% difference.

## Index Numbers and Types
Q: Raw index definition
A: The price level in a single year relative to the base year (1.000). Used for Constant Year to Constant Year conversions of expenditures.
R: yes
Q: When to use raw index
A: Converting Constant/Current Year dollars to another Constant/Current Year (CY►CY); actual historical expenditures.
Q: Escalation factor formula
A: (Index of target year) / (Index of base year). Multiply a BY cost by this to get TY; divide to go TY to BY.
R: yes
Q: Weighted index definition (Navy/Air Force method)
A: The reciprocal of the sum of each outlay-year's portion divided by its raw index — equivalent to a weighted harmonic mean of the raw indices by outlay profile.
R: yes
Q: Weighted index definition (Army method)
A: A weighted arithmetic mean of the raw indices by outlay profile, assuming the outlay profile is stated in year-one (Base Year) dollars. The Army calls this a "composite index."
Q: Navy/Air Force vs. Army weighted-index methods — key difference
A: They differ on whether the outlay profile reflects each year's own dollars (Navy/AF, harmonic mean) or year-one dollars (Army, arithmetic mean).
Q: When to use weighted index
A: Converting Constant/Current Year dollars to Then Year budget authority (CY◄►TY), accounting for multi-year outlay/obligation profiles.
Q: Outlay profile
A: The historical percentage of an appropriation's dollars expected to be expended in each year, with year one being the year of appropriation. Percentages sum to 1.0.
R: yes
Q: Deriving the weighted index from an outlay profile — the four steps
A: (1) Find the portion spent in each out-year; (2) divide each portion by its year's raw index (de-escalate); (3) sum the de-escalated values; (4) take the reciprocal.
Q: Weighted-index worked example: outlay 40/30/20/10, de-escalated contributions 0.400/0.273/0.165/0.075
A: Sum = 0.9131; weighted index = 1/0.9131 = 1.0952. A \$1M need in today's dollars requires a \$1.0952M budget.
Q: Why are weighted indices called "one-way"?
A: Multiplying converts Current/Constant Year to Then Year; dividing converts Then Year to Current/Constant Year — never the reverse direction of either operation.
Q: Raw vs. weighted index for a table's own Base Year
A: Raw index = exactly 1.00; weighted index = slightly greater than 1.00 (it still must account for inflation in the out-years the money will be spent).
Q: RDT&EN weighted escalation rate example (Navy)
A: 1/[0.5233 + 0.361/1.0160 + 0.0579/1.0323 + 0.0393/1.0539 + 0.0185/1.0761] = 1.0109
Q: Why does 100%-year-one outlay (e.g., civilian pay) give a weighted index of 1.0000?
A: With no money spent in out-years, there is no out-year inflation to account for, so the weighted index equals the raw index for the appropriation year (1.0000).
Q: RDT&EN funding type vs. procurement funding type
A: RDT&EN is incrementally funded (funded each year); procurement is fully funded (the whole multi-year buy funded in the year production starts).
Q: RDT&EN as "two-year money"
A: RDT&EN funds may be obligated over two years, followed by a five-year expiration window during which any remaining funds must still be expended.
Q: Budget Year Multiplier
A: The quotient of two weighted indices (a year's weighted index ÷ the table's Base Year weighted index); converts Then Year directly to Then Year. Only the Navy publishes it; handled like a raw index but relative to the table's Then Year.
R: yes
Q: Army's terms for raw and weighted indices
A: Raw index = "compound index"; weighted index = "composite index" (this conflicts with the rest of this module's use of "composite").
Q: Composite index definition
A: A weighted average of the inflation indices for the sub-appropriations or commodities that fund a cost, using a weighted arithmetic mean of the cost shares.
R: yes
Q: When to use composite index
A: When a cost is funded by more than one appropriation/commodity and a single blended escalation rate is needed.
Q: Key difference: weighted vs. composite
A: Weighted blends across future out-years (outlay profile) within ONE appropriation; composite blends across appropriations/commodities by dollar share, within one year.
Q: Composite Material Index Example: steel 20%@5.6%, automotive 35%@6.2%, machinery 45%@5.7%
A: Composite rate = 0.20(5.6%) + 0.35(6.2%) + 0.45(5.7%) = 5.855%; composite index = 0.20(1.056) + 0.35(1.062) + 0.45(1.057) = 1.05855.
Q: Navy composite index: RDT&EN
A: RDT&E Purchases 88.55% + Civilian Payroll 11.45%.
Q: Navy composite index: O&MN
A: O&M Purchases 41.74% + Civilian Payroll 41.21% + Fuel 17.05%.
Q: Navy composite index: MILCON
A: Civilian Pay 7.18% + Military Construction Purchases 92.82%.
Q: Which mean is correct for a composite index of custom items?
A: A weighted arithmetic mean of the component indices by cost share.
Q: CPI appropriateness for DoD cost estimating
A: Generally NOT appropriate; CPI is a consumer basket, not defense-specific. Use DoD/appropriation-specific indices (RDT&E, Procurement, O&M, MILCON).
Q: Gasoline example: \$1.15 (Jan 1998) to \$1.44 (Sep 2001)
A: Inflation rate 25.2%; index 1.252; annualized (44-month span) ≈ 6.3%. Projecting that rate to 2008 would predict only ~\$2.21/gal, far below the actual peak above \$4 — a caution against constant-rate projection.
Q: What does "197T" mean on a DoD inflation chart?
A: The three-month fiscal-year correction period (Jul-Aug-Sep 1976) bridging the switch from a July-June to an October-September federal fiscal year.
R: yes
Q: Navy 1981-2001 example: military pay vs. RDT&EN inflation
A: Military pay rose by a factor of ~2.12 (3.8%/yr annualized); RDT&EN rose by a factor of ~1.77 (2.9%/yr annualized) over the same 20 years.
Q: Chaining raw indices example
A: Raw index 1982/1981 = 1.1371; raw index 1985/1982 = 1.1140; chained raw index 1985/1981 = 1.1371 × 1.1140 = 1.2668.

## Conversion Procedures
Q: BY to TY conversion formula (general)
A: Cost(TY) = Cost(BY) × [Index(TY) / Index(BY)]
R: yes
Q: TY to BY conversion formula (deflating)
A: Cost(BY) = Cost(TY) × [Index(BY) / Index(TY)] = Cost(TY) / Escalation Factor
R: yes
Q: The table's-year waystation rule
A: Convert starting dollars TO the table's year by dividing (raw index if starting CY, weighted if starting TY); then convert FROM the table's year to the ending year by multiplying (raw index if ending CY, weighted if ending TY).
Q: "To over From" method
A: Divide by the index of the FROM row (raw if from Constant Year, weighted if from Then Year); multiply by the index of the TO row (raw if to Constant Year, weighted if to Then Year).
R: yes
Q: Rule for multiplying vs. dividing by an index table
A: Going FROM the table's year TO any other year: multiply. Going FROM any other year TO the table's year: divide.
Q: Escalation Example A (CY►CY, Navy civilian pay): \$100K CY07 → CY10 (÷0.918) → CY18 (×1.200)
A: \$100K / 0.918 = \$108.9K CY10; × 1.200 = \$130.7K CY18.
Q: Escalation Example B (CY►TY, AF RDT&EN): \$10M CY06 → CY15 (÷0.832) → TY15 (×1.012)
A: \$10M / 0.832 = \$12.0M CY15; × 1.012 = \$12.2M TY15.
Q: Escalation Example C (TY►CY, Army MILCON): \$10M TY15 → CY08 (÷1.198) → CY09 (×1.020)
A: \$10M / 1.198 = \$8.3M CY08; × 1.020 = \$8.5M CY09.
Q: Escalation Example D (TY►TY, Navy RDT&EN composite): \$100M TY15 → CY09 (÷1.142) → TY13 (×1.098)
A: \$100M / 1.142 = \$87.6M CY09; × 1.098 = \$96.1M TY13.
Q: Escalation Example D, alternate Budget Year Multiplier method: \$100M TY15 → TY09 (÷1.126) → TY13 (×1.082)
A: \$100M / 1.126 = \$88.8M TY09; × 1.082 = \$96.1M TY13 (same answer as the table's-year method).
Q: Converting constant FY2020 dollars to then-year FY2025 dollars
A: Cost(TY) = Cost(BY) × [Index(FY2025) / Index(FY2020)]
Q: Converting then-year FY2024 dollars back to constant FY2020 dollars
A: Cost(BY) = Cost(TY) × [Index(FY2020) / Index(FY2024)]
Q: Procedure for multi-year BY→TY conversion
A: Time-phase the total cost by outlay year; escalate each year's BY amount by that year's weighted index; sum the TY amounts.
Q: Escalation for \$50M in constant FY2020 dollars, index 1.120 in FY2024, base 1.000
A: \$50M × (1.120/1.000) = \$56M
Q: Deflation for \$84M in then-year FY2024 dollars, index 1.120 for FY2024, base 1.000 for FY2020
A: \$84M × (1.000/1.120) = \$75M (in FY2020 constant dollars)

## Rebasing
Q: Rebasing an inflation table
A: Divide every index value by the index value of the new base year (in the original table). The new base year becomes 1.000.
R: yes
Q: Rebasing formula
A: Index'(t) = Index(t) / Index(new base year)
R: yes
Q: After rebasing, do escalation factors between other years change?
A: No. Relative escalation between any two years is unchanged because both numerator and denominator are divided by the same factor.

## Doubling Time and Compound Escalation
Q: Doubling time formula (exact)
A: n = ln(2) / ln(1 + x/100), where x is the per-period inflation rate as a percent.
R: yes
Q: Rule of 70 (CEBoK's primary doubling-time approximation)
A: n ≈ 70 / x. Derived by rounding ln(2) = 0.693 up to 0.7. Example: 5% → 70/5 = 14 years.
R: yes
Q: Rule of 72 (secondary/alternate form of the doubling-time rule)
A: n ≈ 72 / x. 72 is a convenient alternate to 70 because it's evenly divisible by more single-digit percentages.
R: yes
Q: Doubling time at 5% annual inflation (Rule of 70)
A: 70/5 = 14 years
Q: Doubling time at 7% annual inflation (Rule of 70)
A: 70/7 ≈ 10 years
Q: Compound escalation over n years at rate r
A: Index(n) = (1 + r)^n. Do NOT use simple arithmetic (1 + r×n), which understates.
R: yes
Q: Compound index after 3 years at 2.5% compounded
A: (1.025)^3 = 1.0769
Q: Why compound, not simple, escalation over multiple years?
A: Inflation compounds year over year like interest. Simple arithmetic (r × n) significantly understates the true cumulative effect.

## Special Topics and Pitfalls
Q: Mid-point method
A: For costs incurred over a period whose exact profile is unknown (e.g., Jan 2019–Dec 2021), use the index at the midpoint of the period (about July 2020) for escalation, not start or end year. Only for historical data — a forward estimate should be time-phased year by year instead.
R: yes
Q: Time-phasing definition
A: Relating percent spent (cost) to percent elapsed (duration) for past programs, then using an analogy or average to spread a future estimate before escalating each year's portion separately.
R: yes
Q: Rayleigh curve for time-phasing
A: A development-program spending profile: spending rises, peaks mid-program, then tails off. One of several fitted distributions (with beta, trapezoid, etc.) used to model time-phasing.
R: yes
Q: Custom inflation index when needed
A: When official indices don't match a program's unique cost mix (specialized commodity or labor, non-standard outlay profile, or a known contractor's own escalation rate).
Q: Creating a custom composite index
A: Weight multiple raw indices by their cost shares: Composite = Σ(w(i) × Index(i)) where w(i) = cost share of category i.
Q: AM, GM, HM — definitions
A: Arithmetic mean = sum ÷ count. Geometric mean = nth root of the product. Harmonic mean = reciprocal of the arithmetic mean of the reciprocals.
Q: AM vs. GM vs. HM — ordering
A: AM ≥ GM ≥ HM for any set of positive numbers, with equality only if all the numbers are equal.
Q: Which mean for the composite index vs. the Navy/AF weighted index?
A: Composite index (custom items): weighted arithmetic mean. Navy/AF weighted index from an outlay profile: weighted harmonic mean.
Q: Which mean for the average effective inflation rate over a span of periods?
A: The geometric mean of the period rates, because of the compounding effect.
Q: Which mean for the midpoint (centroid) of a sequence of CY expenditures?
A: A weighted harmonic mean, where the weights are the expenditures and the values are the indices for each period.
Q: Pitfall: mixing dollar types
A: Never mix constant-year and then-year dollars in the same analysis. Convert all to a common base year first.
Q: Pitfall: wrong appropriation table
A: Each category (RDT&E, Procurement, O&M, MILCON) has different inflation behavior and outlay profiles. Using the wrong table produces a wrong TY estimate.
Q: Pitfall: forgetting base year
A: Always specify "in FY[year] dollars" or "in [year] constant/then-year dollars." Naked dollar amounts are meaningless.
Q: Pitfall: simple vs. compound escalation
A: Inflation compounds. (1.03)^5 = 1.159 (15.9%), not 1.15 (15%). Simple arithmetic = significant underestimate.
Q: Pitfall: CPI for DoD
A: CPI tracks consumer goods, not defense-unique costs. Use DoD appropriation-specific indices instead.
Q: CY-to-CY special case: table's Base Year equals the starting CY
A: Use the raw index for the target CY and multiply.
Q: CY-to-CY special case: table's Base Year equals the target CY
A: Use the raw index for the starting CY and divide.
Q: CY-to-CY special case: table's Base Year is neither the starting nor target CY
A: Divide by the raw index for the starting CY (to reach the table's year), then multiply by the raw index for the target CY — the general two-step method.

## Index Tables
Q: What is a raw-index column in an inflation table?
A: Price level in each year relative to the base year, indexed by year of expenditure/outlay.
Q: Escalation rate in an inflation table
A: Year-over-year percentage change: (Index(t) − Index(t−1)) / Index(t−1) × 100%
R: yes
Q: Appropriation-category inflation table
A: A published (OSD/DoD) table with raw and weighted indices for a specific "color of money" (e.g., Procurement, RDT&E) and fiscal year.
Q: DoD inflation tables organized by
A: Appropriation category (RDT&E, Procurement by department/commodity, MILCON, O&M, MILPERS) and fiscal year.
Q: Outlay profile row in an inflation table
A: The percentage of an appropriated dollar outlaid in each year after appropriation (e.g., 50% Yr1, 30% Yr2, 20% Yr3).
Q: Navy index-table column order
A: Fiscal year, inflation rate, raw index, weighted index, budget year multiplier.
Q: Creating an inflation table (Fig 5.23) — column order
A: FY, rate (from OSD guidance), raw index (rate+1, compounded), weighted index (via outlay profile and raw indices), budget year multiplier (weighted index ÷ Base Year weighted index).
`
});
