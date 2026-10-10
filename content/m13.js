PCEA.addModule({
  id: 'm13', num: 13, title: 'Economic Analysis', short: 'Economic Analysis', source: 'guide',
  blurb: 'The 7-step EA process, discounting, NPV vs. alternatives, EUAC, and depreciation methods.',
  intro: String.raw`An **economic analysis (EA)** compares the **costs and benefits of competing alternatives** over their life cycles, accounting for the **time value of money**, to support a decision.

Where a cost estimate answers "what will this cost?", EA answers "which alternative is the best economic choice, and why?" EA takes life-cycle cost estimates as input and applies discounting, present-value math, and comparison metrics to rank alternatives fairly.

**Core framework:** cost estimates (what, when) → time-value adjustment (discounting) → comparison metrics (NPV, PV, UAC) → sensitivity testing → recommendation.`,
  sections: [
    {
      id: 'process', title: 'The 7-step EA process', summary: 'From objective through recommendation',
      body: String.raw`Every EA follows a formal seven-step sequence. Exam questions frequently ask you to identify which step a described activity belongs to.

**Step 1: Define the Objective**
- State clearly what decision the analysis supports and what question it answers.
- A poorly defined objective is the most common root cause of a flawed EA.
- **Key rule**: state the *need* without presupposing a solution (e.g., "move X tons per month" not "buy 10 trucks").

**Step 2: Formulate the Assumptions and Ground Rules**
- Establish the **analysis period** (time horizon), **base year**, **discount rate**, inflation treatment, and other common assumptions.
- Ground rules ensure all alternatives are compared on a level playing field.
- Document assumptions explicitly — they are frequently the most scrutinized part of an EA.

**Step 3: Identify and Examine Alternatives**
- Develop a comprehensive, mutually exclusive, feasible set of alternatives; do not limit the brainstorming — the best solutions sometimes come from innovative thinking, and an alternative left off the list will not be examined.
- **Minimum**: every EA needs at least **two** alternatives — the **status quo / baseline** ("do nothing") and one possible solution. With only two choices these are sometimes called the **as is** and **to be** systems. If the status quo includes minor modifications it may be called **status quo plus** (or baseline plus).
- **Recommended**: consider at least **four** alternatives, usually one from each category:
  - **Status quo (or status quo plus)** — change nothing, or make only minor modifications.
  - **Modernize existing assets** — upgrade or recapitalize without full replacement.
  - **Lease/Privatization** — outsource the function to another organization.
  - **New Acquisition** — replace the current system or procure a new materiel solution.
- **Common alternatives** (variants of the basic status-quo-vs-alternative pair): repair vs. replace, buy vs. lease, manual vs. automate, make vs. buy, centralize vs. decentralize.
- Cost alone is not a reason to call an alternative infeasible — cost differences show up later in the cost analysis. Document eliminated alternatives too; they can become feasible again in a later milestone review.

+++

**Step 4: Develop the Cost and Benefits Estimates**
- Develop full **life-cycle cost estimates** (R&D, procurement, O&S, disposal) for each alternative.
- Use consistent methods and data sources across alternatives so differences reflect real alternative differences, not estimating artifacts.
- Express costs in **constant (real) dollars** of the chosen base year unless the analysis specifically requires then-year dollars.
- Quantify benefits where possible in monetary terms (cost avoidance, revenue, productivity); describe qualitatively otherwise.

**Step 5: Compare and Rank the Alternatives**
- Time-phase: lay out each alternative's costs and benefits by year.
- Handle inflation consistently: keep costs in **constant dollars** (inflation removed), or both in then-year dollars.
- **Discount** each year's amount to present value and sum to get PV.
- Apply comparison techniques (NPV, PV of cost, BCR/SIR, EUAC, payback, ROI).

+++

**Step 6: Test Sensitivity of the Alternative's Rankings**
- Vary key assumptions (discount rate, cost estimates, analysis period, inflation rate) one at a time.
- Find **break-even** values where the ranking of alternatives changes.
- If small, plausible changes flip the ranking, the decision is **not robust** — flag it prominently.

**Step 7: Formulate the Recommendation**
- State the recommended alternative and the basis for it (primary metric and value for each alternative).
- Document caveats from sensitivity analysis and any non-quantifiable factors (risk, policy, qualitative benefits).
- Make the analysis defendable and traceable.

+++

:::check
Q: An objective reads "Buy 10 new trucks to replace the fleet." What is the problem?
* It presupposes a solution; it should state the need (move X tons/month)
- It is too short
- It doesn't mention the discount rate
> Good objectives are solution-neutral so that leasing, outsourcing, repair, and other alternatives get fair consideration.
:::

:::check
Q: In which step do you identify cost drivers and benefits parameters?
- Step 2: Formulate assumptions
* Step 4: Develop cost and benefit estimates
- Step 5: Compare and rank
> Step 4 is where you define what you are measuring and why.
:::

:::check
Q: Why is the status quo always included as an alternative?
* It is the baseline against which other alternatives' costs and benefits are measured
- Regulations forbid excluding it
- It is always cheapest
> Every alternative's value is judged relative to continuing as is.
:::`
    },
    {
      id: 'ground-rules', title: 'Ground rules: period of analysis, dollars, costs, and benefits', summary: 'Period-of-analysis methods, constant vs. current dollars, what to include/exclude',
      body: String.raw`### EA period of analysis

Each alternative has an **economic life** (bounded by physical, mission, and/or technological life) and a **period of analysis** (economic life plus any lead time to develop/implement, often ending at Initial Operating Capability). Alternatives frequently have different economic lives, so once each alternative's period of analysis is known, choose one overall **EA period of analysis** using one of three methods:

- **Shortest life**: use the shortest alternative's period of analysis; estimate and include a **residual value** for the other alternatives to account for the benefits they still had left.
- **Common denominator life**: assume each system keeps replacing itself until all alternatives end at the same time (technically the **least common multiple** of the individual periods). Example: lives of 3, 4, and 6 years → a 12-year common denominator; the 3-year system is replaced 3 times, the 4-year system 2 times, the 6-year system once.
- **Uniform Annual Cost (UAC)**: economically adjusts dollars for unequal lives and assumes the **longest** period of analysis among the alternatives.

### Type of dollars and base year

- **Constant (real) year dollars** are used most often in EA. **Current year dollars** are the actual dollar amounts observed/paid in a given year (i.e., include inflation).
- **Never mix constant and current year dollars within the same analysis.**
- **Base Year (BY)**: usually the first year in which the alternatives' expenditures start to differ. For a first-time EA the BY is often one or more years in the future; for an EA update, it is typically the current or a past year. If using constant dollars, the BY must be set at the start of the analysis, since all estimates are adjusted for inflation to that year.

+++

### Costs to include and exclude

**Include:**
- Traditional life-cycle costs: development, acquisition, operations, support, maintenance, disposal.
- **Opportunity costs**: the value of existing assets/resources used by an alternative that could otherwise be used elsewhere.
- **Imputed costs**: the value of services provided to a project without charge (e.g., base operating support).
- If an alternative has a development/phase-in period, include the status quo's operations and phase-out costs during that transition.

**Exclude:**
- **Societal costs/benefits** realized by non-government entities (governed by OMB Circular A-94's "Special Guidance for Public Investment Analysis").
- **Sunk costs** — already realized; do not include them in the estimate, but do document them in the assumptions.

**Optional — wash costs**: costs realized equally by every alternative. Including them shows total program funding; excluding them avoids clutter. Either is fine, but document the choice — including or excluding wash costs changes multiplicative measures like C/BR (it does not change NPV), which is one reason additive measures like NPV are preferred.

+++

### Benefits: types and quantification

Categorize candidate benefits into one of three buckets, in order of preference:
1. **Quantifiable and monetary** — puts benefits in the same units as cost (easiest comparison).
2. **Quantifiable and non-monetary** — measurable but not in dollars (e.g., response time).
3. **Non-quantifiable but qualitative** — described narratively, still useful for the decision.

Monetary benefits break down further into:
- **Cost savings** — a reduced future budget requirement (addressed in the cost estimate).
- **Cost avoidance** — eliminates additional future costs that would otherwise occur, e.g., absorbing new workload without adding overtime or staff (can be addressed in either the cost or benefits estimate).
- **Productivity improvement** — can generate either cost savings or cost avoidance depending on how it affects the budget (addressed in the benefits estimate).

**Residual, terminal, and salvage value** are distinct monetary benefits tied to equipment at the end of an alternative's life:
- **Residual value**: value of an asset at some point *before* the end of its economic life (used when the EA period of analysis is set by the shortest-life method, so longer-lived alternatives still have value left at the cutoff).
- **Terminal value**: value of an asset at the *end* of its economic life. Equals salvage value if physical life defines the end of economic life; can exceed salvage value if mission or technological life defines the end instead.
- **Salvage value**: value of an asset at the end of its *physical* life (e.g., scrap value).

**Exclude from benefits**: societal benefits outside the organization, benefits already realized by one or more alternatives, and any monetary benefit already captured in the cost estimate (double-counting risk — keep the cost and benefits teams in sync).

:::check
Q: Three alternatives have economic lives of 3, 4, and 6 years. Under the common denominator life method, what is the EA period of analysis?
= 12
> Least common multiple of 3, 4, and 6 is 12 years; the 3-year system is replaced 3x, the 4-year system 2x, the 6-year system once.
:::

:::check
Q: An alternative's development costs are \$2M already spent last year. How should this be treated in the current EA?
- Included as a Year-0 cost for that alternative
* Excluded as a sunk cost, but documented in the assumptions
- Split 50/50 between cost and benefits
> Sunk costs are excluded from the estimate itself but should still be documented.
:::

:::check
Q: A benefit that eliminates future overtime costs that would otherwise have been needed is best classified as…
- Cost savings
* Cost avoidance
- Terminal value
> Cost avoidance eliminates additional costs that would otherwise be incurred in the future; cost savings is a reduction in an existing budget requirement.
:::

:::check
Q: An asset's value at the end of its economic life, where economic life is defined by physical life, is called…
- Residual value
* Terminal value (equal to salvage value here)
- An imputed cost
> When physical life defines the end of economic life, terminal value equals salvage value.
:::`
    },
    {
      id: 'discounting', title: 'Time value: discounting, real vs. nominal', summary: 'PV, DF, Fisher equation, mid-year convention',
      body: String.raw`**Discounting** converts future cash flows to a single point in time (usually present value) to reflect the **time value of money**: a dollar today is worth more than a dollar in the future because it can be invested to earn a return.

### The discount factor and present value

$$DF_n = \frac{1}{(1+r)^n} \qquad PV = \sum_{n=0}^{N} CF_n \times DF_n$$

where $r$ = discount rate (as a decimal) and $n$ = years from the base period.

**End-of-year convention** (used for discrete Year 0 costs, e.g., procurement) assumes each year's cash flow occurs on the last day of that year. **Mid-year convention** (used for costs spread throughout the year, e.g., recurring O&M) assumes flows occur on average at mid-year:

$$DF_n^{mid} = \frac{1}{(1+r)^{n-0.5}}$$

Mid-year discount factors are always **larger** than end-of-year for the same year, reflecting earlier average timing.

+++

### Real vs. nominal discount rates

- **Real (constant-dollar) rate**: reflects only the true time value of money, with inflation stripped out. Applied to constant-dollar cash flows.
- **Nominal (market) rate**: includes both real return and expected inflation. Applied to then-year (nominal) cash flows.

The **Fisher equation** (exact):
$$(1 + r_{nominal}) = (1 + r_{real})(1 + i)$$
where $i$ = inflation rate.

**Critical rule**: real rate ↔ constant dollars; nominal rate ↔ then-year dollars. Mismatching is one of the most common EA errors.

:::key U.S. government guidance
**OMB Circular A-94** is the standard source for prescribed federal discount rates, published annually in Appendix C as part of the president's budget submission. Rates are based on the government's cost of borrowing (Treasury notes with maturities of 3, 5, 7, 10, 20, and 30 years, extrapolated linearly for other periods) and are always in the BY of the budget submission. It publishes separate real and nominal rates by maturity; real rates are used with constant-dollar EAs (the most common case), nominal rates with current-dollar analyses such as lease-purchase and asset-acquisition studies. Always match the rate type to the dollar type.
:::

:::tip Beyond CEBoK
OMB Circular A-94's general guidance has historically prescribed about a 7% real discount rate as a base case for most public-investment cost-effectiveness analyses, representing the average pre-tax rate of return on private investment. This specific figure is outside CEBoK's core text — know the *mechanism* (real rate ↔ constant dollars, published in A-94, updated annually) for the exam; the numeric value can change from year to year.
:::

### Escalation vs. discounting

These are easily confused but different: **escalation** applies the effects of inflation to a cost stream; **discounting** converts amounts at different points in time into economically comparable amounts at one point in time, reflecting the time value of money. Fig. 13.2 illustrates both together: a nominal 5% rate of return curve, a 3% inflation curve, and the real-rate curve between them (constant-dollar terms). The exact real rate is *not* simply the nominal rate minus inflation — it is the quotient of the growth factors:

$$\frac{1.05}{1.03} = 1.0194 \Rightarrow 1.94\% \text{ real return}$$

:::widget real-nominal:::

+++

:::check
Q: What is the PV of \$1,000 received in year 3 at a 5% discount rate? (2 decimals)
= 863.84 ±0.05
> $1000 / (1.05^3) = 1000 / 1.157625 = 863.84$
:::

:::check
Q: Real rate 3%, inflation 2%. What is the nominal rate? (2 decimals)
= 5.06 ±0.01
> $(1.03 \times 1.02) - 1 = 1.0506 - 1 = 0.0506 = 5.06\%$
:::

:::check
Q: Nominal rate of return is 5%, inflation is 3% (CEBoK's own escalation-vs-discounting example). What is the (approximate) real rate?
= 1.94 ±0.02
> $1.05 / 1.03 = 1.0194$, i.e., a 1.94% real return — not simply $5\% - 3\% = 2\%$, though that is a close approximation.
:::

:::check
Q: Mid-year discount factor for year 1 at 4%? (4 decimals)
= 0.9806 ±0.0002
> $1 / 1.04^{0.5} = 0.9806$. Compare end-of-year: $1 / 1.04 = 0.9615$; mid-year is larger.
:::`
    },
    {
      id: 'comparison', title: 'Comparison techniques', summary: 'NPV, PV of cost, BCR, SIR, EUAC, payback, ROI',
      body: String.raw`### The main techniques

| Technique | Formula | Use when | Decision rule |
|---|---|---|---|
| **PV of costs** | $\sum CF_n / (1+r)^n$ | Benefits are **equal** across alternatives | Choose **lowest** PV |
| **NPV** | $PV(Benefits) - PV(Costs)$ | Benefits **differ** and can be monetized | Choose **highest** NPV; NPV > 0 is favorable |
| **Benefit-cost ratio (BCR)** | $PV(Benefits) / PV(Costs)$ | Independent projects under budget constraint | BCR > 1.0 is favorable |
| **Savings-to-investment ratio (SIR)** | $PV(Savings) / PV(Investment)$ | Investment that generates savings | SIR > 1.0 is favorable |
| **EUAC / UAC** | $PV \times \dfrac{r(1+r)^N}{(1+r)^N - 1}$ | Alternatives with **unequal lives** | Choose **lowest** UAC |
| **Payback period** | Years until cumulative savings = investment | **Quick screen only** (undiscounted) | Shorter is better; ignores post-payback flows |
| **ROI / IRR** | Rate where NPV = 0 | Supplementary metric | Higher is better; ignores scale |

+++

### NPV is the preferred primary technique

**Net Present Value** is generally preferred because:
- It directly reflects the time value of money.
- It produces a single, unambiguous measure of economic worth in present-value dollars.
- Among mutually exclusive alternatives, the one with the **highest NPV** creates the most total value.
- $NPV > 0$ means the alternative is economically favorable (benefits exceed costs in PV terms).

When benefits are **equal** across alternatives (e.g., all provide the same operational capability), compare **PV of costs** and choose the lowest — this is a cost-minimization analysis.

+++

### The Annuity Present Value Factor

For a uniform stream of equal annual payments over $N$ years at discount rate $r$:

$$\text{Annuity PV Factor} = \sum_{n=1}^{N} \frac{1}{(1+r)^n} = \frac{1 - (1+r)^{-N}}{r}$$

This factor lets you compute the PV of a recurring cost in one step: $PV = \text{Annual Amount} \times \text{Factor}$.

+++

### The C/BR paradox: why NPV, not ratios, ranks mutually exclusive alternatives

C/BR = PV(Costs) / PV(Benefits) (or its reciprocal, B/CR, where higher is better). C/BR can pick a *different* winner than NPV. Example: Alternative 1 has PV benefit \$2 and PV cost \$1; Alternative 2 has PV benefit \$6 and PV cost \$4.

| | NPV | C/BR |
|---|---|---|
| Alt 1 | +\$1 | 0.50 |
| Alt 2 | +\$2 | 0.67 |

Alt 2 **wins on NPV** (+\$2 vs +\$1, more total value created) but **loses on C/BR** (0.67 vs 0.50, Alt 1 is "more efficient" per dollar). This is why efficiency ratios like C/BR, B/CR, and ROI can favor the wrong alternative — they measure efficiency, not total value.

### SIR and payback rule (DoD FMR)

$$SIR = \frac{PV(\text{Savings})}{PV(\text{Investment})}$$

SIR is essentially a B/CR by another name — a result greater than 1.0 is required and higher is better. Per the **DoD Financial Management Regulation, Volume 11B, Chapter 58**, SIR and payback period are both **required** for Capital Purchase Program (CPP) investments. The rule of thumb: **SIR > 1.0 AND payback period < 10 years** is considered economical.

### Internal Rate of Return (IRR)

IRR is the discount rate $r$ that makes NPV of all cash flows equal zero:

$$0 = \sum_{t=0}^{n} \frac{CF_t}{(1+r)^t}$$

IRR is sometimes called ROI, though ROI has different meanings in different contexts. Both IRR and payback period drive NPV to zero — IRR does it by varying the discount rate; payback does it by varying the time horizon.

+++

### Sensitivity analysis assumption categories (Step 6)

When choosing what to test in sensitivity analysis, focus on:
1. **Elements most likely to change** — external factors outside program control, discount rates, anything with a known significant probability of change.
2. **Elements most uncertain or least understood** — high-risk assumptions or ones made for lack of better knowledge.
3. **Significant cost or benefit drivers** — major cost elements (by % of total cost) or CER independent variables.
4. **Factors with key relationships to the results** — the objective statement, program requirements, system operations, and residual value (if economic lives are unequal).

+++

### Payback and ROI: supplementary only

- **Payback period** ignores the time value of money (unless discounted) and ignores all cash flows after payback, potentially favoring a fast-payback alternative with poor long-term economics.
- **ROI** is a ratio and can favor a smaller, higher-percentage-return alternative over a larger alternative that creates more total value.
- **Best practice**: use NPV as the primary ranking criterion, and report payback and ROI as supplementary context.

:::widget npv:::

:::challenge npv r=0.03 lock=ia,ca,ib,cb,n,mid
Q: At 3%, B's lower annual cost outweighs its higher investment. Raise the discount rate until A and B have the same present value (within \$1).
goal: diff ~ 0 +- 1
show: r=0.0775
> Discounting shrinks future savings but not the up-front investment. B's \$22/yr of savings justify its extra \$150 only below about 7.6%; above that rate, A wins. The lower panel shows where the difference crosses zero.
:::

:::challenge npv r=0.03
Q: As the discount rate rises, which alternative gains ground?
* A: low investment, high annual cost
- B: high investment, low annual cost
- Neither, because the rate affects both equally
> A higher rate shrinks the present value of future costs but not today's. Most of A's cost is in the future, so A gains. Capital-heavy alternatives look best at low discount rates.
:::

+++

:::check
Q: Invest \$100 now to save \$30/yr for 5 years; discount rate 5%. NPV? (2 decimals)
= 29.88 ±0.05
> Annuity factor (5-yr) = 4.3295. PV of savings = $30 × 4.3295 = 129.88. NPV = $129.88 − $100 = 29.88$.
:::

:::check
Q: Same investment and savings. What is the SIR? (2 decimals)
= 1.30 ±0.01
> $129.88 / 100 = 1.30 > 1.0$, so the investment is justified.
:::

:::check
Q: Project A: unequal life, same benefits as B. Which is the best comparison?
- PV of costs
* EUAC (Uniform Annual Cost)
- Payback period
> Unequal lives make PVs incomparable. EUAC puts them on a per-year basis.
:::`
    },
    {
      id: 'example', title: 'Worked example: the lawn-mower EA', summary: 'CEBoK’s full 7-step example, mid-year discounting, C/BR flip, sensitivity',
      body: String.raw`CEBoK's core worked example runs the full seven-step process on a deliberately simple, non-technical problem: it takes too long to mow the lawn.

### Steps 1–3: Objective, Assumptions, Alternatives

**Objective**: Of five candidate objectives brainstormed (minimize mowing time, maximize mowing efficiency, identify an optimal lawn maintenance program, improve quality of life, get someone else to mow), CEBoK selects **"Identify the optimal lawn maintenance program"** — broad enough to be solution-neutral, narrow enough to focus the analysis. ("Minimize mowing time" addresses a symptom, not the problem; "get someone else to mow" presupposes a solution; "improve quality of life" is too broad.)

**Assumptions**: only mowing is in scope (not weeding/fertilizing); the lawn is mowed 10 times/year.

**Alternatives** (Table 13.1):

| Alternative | Economic life / PoA |
| --- | --- |
| Status quo | 2 years |
| Upgrade existing mower | 5 years |
| Purchase new mower | 10 years |
| Outsource | Indefinite (∞) |

"Stop mowing" and "move to a smaller-lawn house" were brainstormed but ruled infeasible. The EA period of analysis uses the **UAC method**, so it equals the **longest** alternative period: 10 years, FY08–FY17, in constant FY08 dollars (the common denominator method would also give 10 years here).

+++

### Step 4: Cost and Benefit Estimates

**Table 13.3 (key cost inputs)**: new mower \$2,000; new deck/blades \$300 (material \$200 + labor \$100); engine overhaul \$250 (materials \$50 + labor \$200); fuel/oil \$50/yr; annual maintenance \$100/yr (\$25 parts + \$75 labor); outsourcing \$50/visit (\$500/yr at 10 visits).

**Table 13.4 (time savings, at the mower's time value of \$20/hr)**:

| Alternative | Hours/mow | Annual cost of time | Annual savings vs. status quo |
| --- | --- | --- | --- |
| Status quo | 3 hr | \$600/yr | \$0 |
| Upgraded mower | 2 hr | \$400/yr | \$200 |
| New mower | 1 hr | \$200/yr | \$400 |
| Outsource | 0 hr | \$0/yr | \$600 |

**Residual/salvage value**: current mower sells for \$250 now; salvage values are \$50 (current mower, realized FY09), \$75 (upgraded mower, FY12), and \$200 (new mower, FY17). Ecological benefits and the maintenance/fuel cost avoidance were considered but dropped — ecological benefits are not quantifiable, and the maintenance/fuel avoidance is already captured in the cost estimate (including it in benefits would double-count it).

+++

### Step 5: Compare and Rank

Use the **real 10-year discount rate of 2.8%** (constant-dollar analysis calls for a real rate) with **mid-year discount factors**, since costs and benefits are spread through the year:

$$F_1 = \frac{1}{1.028^{0.5}} \approx 0.9863 \qquad F_2 = \frac{1}{1.028^{1.5}} \approx 0.9594$$

Discounting each alternative's 10-year cost and benefit stream by these factors and computing NPV (as UAB − UAC, since periods of analysis are unequal) gives Table 13.6:

| Alternative | NPV (UAB − UAC) |
| --- | --- |
| **Outsource** | **128** |
| Purchase new mower | 103 |
| Upgrade mower | −31 |
| Status quo | −125 |

**Preliminary recommendation: Outsource** (NPV \$128/yr in today's dollars). Only outsourcing and the new mower have positive NPV.

**The C/BR flip**: if a Cost/Benefit Ratio were used instead of NPV, the **new mower** would win by a narrow margin — it is more *efficient* (lower cost per unit of benefit) but less *effective* (smaller total net benefit). This is the same C/BR-vs-NPV paradox from the Comparison Techniques section, and it is why NPV, not C/BR, drives the recommendation.

+++

### Step 6: Sensitivity Analysis

Focus sensitivity testing on the two positive-NPV alternatives (outsource, new mower) since they are the only real contenders. Test:
- Fuel/oil cost +10%
- Outsourcing cost +10%
- Mower's time value \$20/hr → \$25/hr

Both alternatives' costs and benefits increase, but the outcome is unchanged: **outsourcing wins in every test case**, and the NPV gap between outsourcing and the new mower actually **widens**, making outsourcing even more favorable.

### Step 7: Recommendation

**Recommend outsourcing** — it has the highest NPV in the base case and remains the winner under every sensitivity case tested (fuel/outsourcing costs, mower's time value), so the recommendation is **robust**. The ecological benefit of a newer, cleaner mower is not realized under this alternative — a qualitative caveat worth noting alongside the quantitative result.

:::widget mower-npv:::

+++

:::tip Beyond CEBoK: a second worked example (facility equipment, cost-minimization)
This practice example is not from CEBoK's core text, but illustrates the same UAC math with a cost-minimization case (equal benefits across alternatives) and cleaner round numbers.

**Objective**: choose the lowest life-cycle-cost facility equipment option over 5 years. Real discount rate 5%, end-of-year convention, constant dollars, benefits (operational capability) assumed equal across all three.

| Alternative | Initial Cost (Year 0) | Annual O&M (Years 1–5) |
| --- | --- | --- |
| A | \$500,000 | \$50,000/yr |
| B | \$300,000 | \$90,000/yr |
| C | \$650,000 | \$30,000/yr |

5-year annuity PV factor at 5% = $0.9524+0.9070+0.8638+0.8227+0.7835 = 4.3294$.

| Alternative | PV of Cost | UAC (PV ÷ 4.3294) |
| --- | --- | --- |
| A | \$500,000 + 50,000(4.3294) = \$716,470 | \$165,489 |
| B | \$300,000 + 90,000(4.3294) = \$689,646 | \$159,294 |
| C | \$650,000 + 30,000(4.3294) = \$779,882 | \$180,136 |

**Ranking: B < A < C** — Alternative B is lowest-cost. Re-running at 3% (factor 4.5797) and 8% (factor 3.9926) keeps the same ranking in both cases: B's low initial cost plus higher O&M shifts the break-even point somewhat with the rate, but never enough to lose to C's large Year-0 cost. The recommendation is **robust** across 3–8%.
:::

+++

:::check
Q: Why does CEBoK reject "attempt to get someone else to mow the lawn" as the objective statement?
* It presupposes a solution (outsourcing), which objectives should avoid
- It is not measurable
- It ignores the time value of money
> A good objective states the need, not a specific solution — that is decided later in Step 3/5.
:::

:::check
Q: In the lawn-mower example, why are mid-year discount factors used instead of end-of-year?
* Costs and benefits (mowing, fuel, labor) are spread throughout the year, not concentrated at year-end
- Mid-year factors are always required by OMB A-94
- The BY is mid-fiscal-year
> End-of-year factors are for discrete Year-0-style costs; recurring costs spread through the year use mid-year factors.
:::

:::check
Q: Why is the ecological benefit of the new/upgraded mower excluded from the quantitative NPV comparison?
* It is not readily quantifiable, so it is discussed qualitatively rather than forced into a dollar figure
- It was already included in the cost estimate
- CEBoK considers ecological benefits irrelevant
> Non-quantifiable benefits are documented and considered alongside the numbers, not force-fit into the NPV calculation.
:::

:::check
Q: In the lawn-mower example, which alternative would a Cost/Benefit Ratio (C/BR) favor instead of NPV, and why?
* New mower — it has a better ratio of cost to benefit even though outsourcing creates more total value
- Outsourcing — C/BR and NPV always agree
- Status quo — it has the lowest cost
> C/BR measures efficiency (cost per unit benefit); NPV measures total value created. They can rank differently, which is why NPV is preferred for ranking mutually exclusive alternatives.
:::

:::check
Q: Facility EA (Beyond CEBoK): which alternative has the lowest UAC at r = 5%?
* B (\$159,294)
- A (\$165,489)
- C (\$180,136)
> B has the lowest initial cost, and its higher O&M is not enough to overcome that advantage at a 5% discount rate.
:::`
    },
    {
      id: 'depreciation', title: 'Depreciation methods', summary: 'Straight-line, declining balance, sum-of-years-digits',
      body: String.raw`**Depreciation** allocates the cost of a capital asset over its useful life for accounting and tax purposes. It is **not a cash flow** in itself, but it matters for tax-effect analysis, asset-replacement decisions, and lease-vs-buy comparisons.

**Key terms:**
- **Cost basis**: original cost of the asset (including costs to place it in service).
- **Salvage value**: estimated value at the end of useful life.
- **Useful life ($N$)**: depreciation period, often set by accounting/tax convention.
- **Book value**: cost basis minus accumulated depreciation.

Depreciation = (Cost − Residual value) / Useful life, and cumulative depreciation = Initial value − Current value.

**Methods** (per CEBoK): straight-line (simplest, most common); sinking fund (allocates *more* depreciation to *later* years — the exception, along with straight-line, to the front-loaded pattern); increasing rate of depreciation; declining balance (each period's depreciation = book value × a factor / $N$, usually factor = 2, i.e. double-declining balance); decreasing rate of depreciation (tax-advantageous); MACRS (the US income-tax variant); sum-of-the-years'-digits; historical method; units of production; units of time.

### Straight-Line Depreciation

Equal depreciation expense each year:
$$D_n = \frac{\text{Cost} - \text{Salvage}}{N}$$

**CEBoK's example**: On April 1, 2006, Company A bought equipment costing \$140,000 with a 5-year useful life and \$20,000 salvage value, depreciated to the nearest whole month. Because the asset is placed in service partway through the year, the first year is prorated by months in service (9 of 12):

$$D_{2006} = (140{,}000 - 20{,}000) \times \frac{1}{5} \times \frac{9}{12} = \$18{,}000$$
$$D_{2007} = D_{2008} = (140{,}000 - 20{,}000) \times \frac{1}{5} \times \frac{12}{12} = \$24{,}000/\text{year}$$

+++

### Double-Declining Balance (200% DDB)

An **accelerated method**: applies a constant rate to the **remaining book value** each year, taking larger deductions early. First compute the straight-line rate ($1/N$), then apply a declining-balance factor between 100% and 200%:

$$\text{Rate}_{200\%\,DDB} = \frac{1}{N} \times 200\% \qquad \text{Rate}_{150\%\,DDB} = \frac{1}{N} \times 150\%$$

**Never depreciate below salvage value** — cap the final year so book value ends exactly at salvage.

**Same \$140,000/\$20,000/5-year asset, 200% DDB** (rate = $1/5 \times 200\% = 40\%$), still prorating the first partial year:

| Year | Book Value (beginning) | Rate | Depreciation | Book Value (end) |
| --- | --- | --- | --- | --- |
| 2006 | \$140,000 | 40% | \$42,000 (×9/12 partial year) | \$98,000 |
| 2007 | \$98,000 | 40% | \$39,200 | \$58,800 |
| 2008 | \$58,800 | 40% | \$23,520 | \$35,280 |
| 2009 | \$35,280 | 40% | \$14,112 | \$21,168 |
| 2010 | \$21,168 | 40% | \$1,168 (capped) | \$20,000 |

Without the salvage cap, 2010's 40% depreciation would be \$8,467, dropping book value below the \$20,000 salvage floor — so the final year is capped at whatever brings book value exactly to salvage (\$21,168 − \$20,000 = \$1,168).

:::widget depreciation:::

+++

### Sinking Fund, Fixed Percentage, and Other Methods

**Sinking fund depreciation** is the *only* method besides straight-line that does **not** front-load depreciation — it allocates *more* depreciation to *later* years. Year 1's depreciation equals the annual deposit needed for a sinking fund (at a given interest rate) to accumulate to the depreciation base; each later year adds the sinking-fund deposit plus interest earned so far:

$$R_t = \left(\frac{C - S}{S_{\overline{n}|i}}\right)(1+i)^{t-1}$$

:::note Source figure discrepancy
The extracted source text renders this exponent as "$t+1$"; the intent (and the standard sinking-fund-depreciation formula) is $(1+i)^{t-1}$, consistent with year-1 depreciation equaling the plain sinking-fund deposit (exponent 0) and later years compounding forward. Treat this as a likely transcription artifact in the source, not a rule to memorize literally.
:::

**Fixed percentage method**: each year's depreciation is a fixed percentage of the *beginning* book value. Choosing the rate matters: too low, and ending book value stays well above salvage; too high, and depreciation accumulates so fast that later years hit zero depreciation.

**Declining balance methods** combine straight-line and fixed-percentage: compute the straight-line rate, then scale it by a declining-balance factor (150% or 200%) as shown above.

### Sum-of-the-Years'-Digits (SYD)

Another **accelerated method** using a declining fraction of the depreciable base, where the fraction's numerator is the number of years remaining and its denominator is the sum of digits 1 through $N$:

$$\text{Sum of years' digits for } n \text{ years} = 1 + 2 + \dots + n = (n+1)\left(\frac{n}{2}\right) \qquad D_n = \frac{\text{Remaining Life at Year } n}{SYD} \times (\text{Cost} - \text{Salvage})$$

This general formula scales to any life — for a 500-year asset, $SYD = (500+1)(500/2) = 125{,}250$ (illustrating that it is just $N(N+1)/2$, not something you must sum term by term).

**CEBoK's SYD example**: Company A buys a \$100,000 asset (Jan 1, 2000), 5-year life, \$10,000 residual value. $SYD = 5+4+3+2+1 = 15$, depreciable base = \$90,000.

| Year | Fraction | Depreciation | Book Value (end of year) |
| --- | --- | --- | --- |
| 2000 | 5/15 | \$30,000 | \$70,000 |
| 2001 | 4/15 | \$24,000 | \$46,000 |
| 2002 | 3/15 | \$18,000 | \$28,000 |
| 2003 | 2/15 | \$12,000 | \$16,000 |
| 2004 | 1/15 | \$6,000 | \$10,000 |

+++

### Comparison and key rules

Across straight-line, DDB, and SYD, total depreciation always equals (Cost − Salvage); only the **timing** differs.

- **Straight-line**: even deductions across the life.
- **Sinking fund**: back-loaded (more depreciation in later years) — the other exception to front-loading.
- **DDB and SYD**: front-loaded (more depreciation early, favoring earlier tax deductions).

:::warn Important rule
**Never depreciate an asset below its salvage value.** Cap the final-year depreciation so book value exactly equals (not less than) salvage value.
:::

+++

:::check
Q: \$140,000 asset, \$20,000 salvage, 5-year life, placed in service April 1 (9 months remaining in first year). Straight-line depreciation for the first year?
= 18000
> $(140{,}000 - 20{,}000)/5 \times 9/12 = 24{,}000 \times 0.75 = 18{,}000$.
:::

:::check
Q: Same \$140K/\$20K/5-yr asset, full second year straight-line depreciation?
= 24000
> $(140{,}000-20{,}000)/5 = 24{,}000/\text{year}$ once a full 12 months apply.
:::

:::check
Q: 5-year asset: what is the 200% (double) declining-balance rate?
= 40
> Straight-line rate $1/N = 1/5 = 20\%$, times 200% = 40%.
:::

:::check
Q: Same \$140K/\$20K/5-yr asset, DDB (40% rate): 2010 book value entering the year is \$21,168. What is that year's (final, capped) depreciation?
= 1168
> $0.40 \times 21{,}168 = 8{,}467$ would push book value below the \$20,000 salvage floor, so depreciation is capped at $21{,}168 - 20{,}000 = 1{,}168$.
:::

:::check
Q: \$100,000 asset, \$10,000 residual, 5-year life, sum-of-years'-digits: first-year depreciation?
= 30000
> Sum of digits = 15. Year 1 fraction = 5/15. Depreciation = $(5/15) \times 90{,}000 = 30{,}000$.
:::

:::check
Q: Sum of the years' digits for a 500-year life?
= 125250
> $SYD = (500+1)(500/2) = 501 \times 250 = 125{,}250$ — use the formula, not term-by-term addition.
:::

:::check
Q: Which two depreciation methods do NOT front-load depreciation into the early years?
* Straight-line and sinking fund
- DDB and SYD
- MACRS and units of production
> Straight-line is flat; sinking fund actually back-loads (more depreciation later). All the other accelerated methods front-load.
:::`
    },
    {
      id: 'testable', title: 'Testable Topics', summary: 'What CEBoK expects you to know vs. what it does not',
      body: String.raw`CEBoK publishes an explicit testable-topics breakdown for this module:

| Testable | Testable, but less emphasized | Not testable |
| --- | --- | --- |
| Discounting / present value / time value of money | Depreciation | Relevant US legislation (e.g., Clinger-Cohen Act) |
| Real vs. nominal discount rates, Fisher equation | | Names of cost products that use EA (e.g., AoA vs. BCA vs. CBA) |
| Defining alternatives, including status quo | | Other advanced topics |
| Specifying period of analysis | | |
| Types of benefits and how to monetize/quantify them | | |
| Other main content | | |

In short: know discounting, real/nominal rates and the Fisher equation, alternatives (including the status quo requirement), period of analysis, and benefits cold — these are core exam material. Know depreciation's mechanics, but expect it to be tested less heavily than the core comparison techniques. Legislation names and cost-product terminology (the special cases and advanced topics that follow) are background reading, not exam content.

:::check
Q: Per CEBoK's testable-topics table, which of these is explicitly "not testable"?
- The Fisher equation
- Specifying the period of analysis
* Naming Clinger-Cohen Act compliance requirements
> Legislation names and cost-product naming (AoA vs. BCA vs. CBA) are called out as not testable; discounting/Fisher/period-of-analysis are core testable content.
:::

:::check
Q: How does CEBoK characterize depreciation's exam emphasis relative to discounting and comparison techniques?
* Testable, but less emphasized
- Not testable at all
- Equally emphasized
> Depreciation sits in the middle tier: know the mechanics, but expect it to be tested less than the core process/discounting/comparison content.
:::`
    },
    {
      id: 'related', title: 'Advanced (not testable per CEBoK)', summary: 'FEA, Commercial Activities, AoA, lease-buy, benefits matrix, ROI vs. NPV critique',
      body: String.raw`Per CEBoK's testable-topics table, the special-case studies and legislation names below are **not testable** — read for context, not memorization.

### Functional Economic Analysis (FEA)

An EA applied to **business-process improvement**. Traditional EA math applies, but with added weight on strategic plans, processes, and business functions. Alternatives are usually incremental variations on one basic set of changes rather than a broad new-capability search.

### Commercial Activities (OMB Circular A-76)

Also called privatization or outsourcing studies, governed by **OMB Circular A-76**, which sets rules for what can be outsourced and how to estimate it. The EA is only a small, usually less-detailed part of a full A-76 study; a formal benefits estimate typically isn't developed — the assumption is that either performer (government or contractor) can do the work equally well.

### Analysis of Alternatives (AoA)

A broader, formal **acquisition-milestone study**, running an effectiveness analysis (military worth in performing Mission Tasks) in parallel with, and equal in importance to, a cost analysis (total Life Cycle Cost). Their results are combined to identify the best-value alternative. For major defense acquisition programs (ACAT IA), law requires an AoA at Milestones A and B and at the full-rate production decision.

+++

### Lease vs. Purchase Decisions

Compares $PV(\text{Lease})$ vs. $PV(\text{Purchase} + O\&S - \text{Residual Value})$. Less involved than major-system EAs, but with special considerations: ancillary services (property acquisition/prep, repair/improvements or operations if bundled into the lease, imputed property taxes, imputed insurance), tax effects, and the correct discount-rate/dollar type.

### Special cases not covered in depth

Military construction (MILCON) projects, overseas activities, warranty analysis, and asset sale analysis are all EA variants CEBoK names but does not detail further.

+++

### Benefits decision matrix (non-monetary benefits)

When benefits have no common denominator like dollars, build a decision matrix using **relative ranking**, **weighted relative ranking**, or **weighted point rating**:
1. Generate a common list of benefits with definitions (via stakeholder discussion); get decision-maker approval.
2. Assign a numerical value for each alternative's level of each benefit — ideally from raw physical counts (tons, sq. ft., occupants); if unavailable, an index/ratio; if that's unavailable, an ordinal rating scale (1–10 or poor-to-excellent).
3. Assign a **weight** to each benefit to reflect its relative importance. A weight of 2 means that benefit is valued **twice** as much as a weight of 1; fractional weights (1.25, 1.5) are fine.
4. Multiply each benefit value by its weight and sum, producing a single composite **benefit score** per alternative.
5. Divide each alternative's NPV (cost and monetary benefits only) by its benefit score for a **C/BR** (lowest is best) — or invert it for a **B/CR** (highest is best). As with the earlier C/BR paradox, this is still an efficiency ratio and may not identify the best absolute-value choice.

**Example conclusion table** (facility EA benefits matrix, 10-year NPV):

| Alternative | Net Discounted Cost | Benefit Score | Benefit/Cost Ratio |
| --- | --- | --- | --- |
| Status Quo | — | — | Not Feasible |
| Alternative 1 | \$34,596,762 | 24.53 | 7.1 |
| Alternative 2 | \$42,157,114 | 24.73 | 5.8 |
| Alternative 3 | \$68,307,235 | 26.08 | 3.8 |
| Alternative 4 | \$35,604,337 | 23.15 | 6.5 |
| Alternative 5 | — | — | Not Feasible |

Alternative 3 has the **highest** benefit score but is also the most expensive, disproportionately so, driven mainly by its durability rating (CEBoK's text calls it "Alternative 4" because it is row 4 of Fig 13.19) — the decision maker must judge whether that extra expense is justified. Document the benefits analysis with: identification/definition of each benefit, categorization, measurement method, ranking results, and participating personnel.

:::widget benefits-matrix:::

+++

### NPV vs. ROI vs. Payback: the ranking mistake

A critical mistake in EA is to rank mutually exclusive alternatives by BCR or ROI instead of NPV. Beyond the scale problem, **ROI has a specific mathematical flaw**: if a project's cash flows change sign more than once (e.g., an up-front outflow, then positive cash flows, then a disposal-cost outflow at the end), the ROI equation can have **more than one valid solution**, making the ROI decision rule inapplicable. ROI can also select a project with a negative NPV when positive cash flows precede negative ones. Payback period, meanwhile, has no generally accepted rule for how many years is "acceptable," and ties between projects with identical payback periods give no decision rule at all.

:::check
Q: Project X: payback 2 years, NPV \$5M. Project Y: payback 4 years, NPV \$40M. Same risk, mutually exclusive. Choose?
- X, because of faster payback
* Y, because of higher NPV
> NPV measures total value created. Payback ignores everything after payback and is useful only as a quick screen. For ranking, use NPV.
:::

:::check
Q: Why can ROI favor the wrong alternative in a ranking?
* ROI is a ratio and ignores the scale of the investment; a 50% ROI on \$1K < 20% ROI on \$10M in total value created
- ROI is always negative
- ROI does not account for the time value of money
> NPV correctly ranks by absolute value created, not percentage return.
:::

:::check
Q: A project's cash flows go negative, then positive, then negative again (e.g., disposal costs at the end). What problem does this create for ROI?
* The ROI equation can have more than one valid solution, making the ROI decision rule inapplicable
- ROI becomes undefined
- NPV can no longer be calculated
> Multiple sign changes in the cash flow stream can produce multiple ROI roots; NPV does not have this problem.
:::

:::check
Q: In a weighted benefits matrix, a benefit weighted "2" compared to a benefit weighted "1" is valued…
* Twice as much
- The same
- Half as much
> Weight values are directly proportional — a weight of 2 means twice the value of a weight of 1.
:::

:::check
Q: An A-76 (Commercial Activities) study's EA component differs from a standard EA mainly by…
* Being smaller and less detailed, usually without a full benefits estimate, assuming either performer can do the work equally well
- Requiring a more detailed benefits estimate than usual
- Never comparing cost between alternatives
> A-76 studies assume comparable performance and focus mainly on cost comparison; the EA is one smaller part of the overall study.
:::

:::check
Q: A ranking flips only if cost grows 60%, far beyond historical experience. The recommendation is…
* Robust: the decision holds across plausible assumption ranges
- Fragile: it should not be trusted
- Correct only at the base-case assumptions
> Break-even far outside plausible range means the decision is not sensitive to realistic variation.
:::`
    }
  ],
  cards: String.raw`
## Process Steps
Q: The 7 steps of economic analysis, in order
A: 1 Define objective · 2 Assumptions & ground rules · 3 Identify alternatives · 4 Cost & benefit estimates · 5 Compare & rank · 6 Test sensitivity · 7 Formulate recommendation
R: yes
Q: What makes a good EA objective?
A: States the need without presupposing a solution (e.g., "move X tons/month" not "buy trucks").
Q: What is the status quo alternative?
A: The baseline "do nothing" option against which all others are measured.
R: yes
Q: Treatment of sunk costs in an EA
A: Excluded. Only future, differential costs that vary between alternatives matter.
Q: What are ground rules and why matter?
A: Common assumptions (analysis period, discount rate, base year, inflation treatment) applied consistently to level the comparison.
Q: Name 3 components of ground rules
A: Analysis period, discount rate, base year, inflation treatment, cost estimation conventions.
Q: Minimum number of alternatives an EA must have
A: Two — the status quo/baseline and one possible solution (the "as is"/"to be" pair when there are only two).
Q: The four recommended alternative categories
A: Status quo (or status quo plus), modernize existing assets, lease/privatization, new acquisition.
Q: Name 3 common alternative pairs
A: Repair vs. replace, buy vs. lease, manual vs. automate, make vs. buy, centralize vs. decentralize.
Q: Shortest life period-of-analysis method
A: Use the shortest alternative's period of analysis; estimate a residual value for the other alternatives' remaining benefits.
R: yes
Q: Common denominator life method
A: Assume systems keep replacing themselves until all alternatives end at the same time; technically the least common multiple of the individual periods (e.g., 3/4/6-yr lives → 12-yr period).
R: yes
Q: Uniform Annual Cost (UAC) period-of-analysis method
A: Economically adjusts for unequal lives and uses the longest period of analysis among the alternatives.
R: yes
Q: Rule on mixing constant and current year dollars
A: Never mix them within the same EA.
Q: How is the EA Base Year (BY) usually chosen?
A: The first year in which expenditures start to differ among the alternatives.
Q: Costs to exclude from an EA
A: Societal costs (per OMB A-94) and sunk costs (document them in assumptions, but don't include them in the estimate).
Q: Wash costs
A: Costs realized equally by every alternative; optional to include/exclude, but exclusion affects multiplicative measures like C/BR (not NPV) — document the choice either way.
R: yes
Q: Cost savings vs. cost avoidance
A: Cost savings = reduced future budget requirement (in the cost estimate); cost avoidance = eliminates additional future costs that would otherwise occur (either section).
Q: Residual value vs. terminal value vs. salvage value
A: Residual = value before end of economic life; terminal = value at end of economic life (equals salvage if physical life ends it); salvage = value at end of physical life.

## Discounting Fundamentals
Q: Present value formula (end-of-year)
A: $PV = CF_0 + \sum_{n=1}^{N} \dfrac{CF_n}{(1+r)^n}$
R: yes
Q: Discount factor formula
A: $DF_n = \dfrac{1}{(1+r)^n}$ (end-of-year); $DF_n^{mid} = \dfrac{1}{(1+r)^{n-0.5}}$ (mid-year)
R: yes
Q: Why use discounting in EA?
A: Time value of money: a dollar available now can be invested to earn returns, so it is worth more than a dollar received later.
Q: When do you use mid-year vs. end-of-year discount factors?
A: End-of-year for discrete costs (e.g., Year 0 procurement); mid-year for recurring costs spread through the year (e.g., O&M).
Q: Which discount factor is always larger, mid-year or end-of-year for the same year?
A: Mid-year, because the cash flow occurs earlier on average.
Q: Why must you match discount rate type to dollar type?
A: Real rate is for constant dollars; nominal rate is for then-year dollars. Mismatching is a common error.
Q: Fisher equation (exact)
A: $(1 + r_{nominal}) = (1 + r_{real})(1 + i)$, where $i$ = inflation rate.
R: yes
Q: What does OMB Circular A-94 specify?
A: Federal guidance on discount rates (real and nominal, by maturity), updated annually; prescribes rates for government cost-effectiveness and lease-purchase analysis.
R: yes
Q: CEBoK's own escalation vs. discounting example: nominal rate 5%, inflation 3%. Real rate?
A: $1.05/1.03 = 1.0194$, a 1.94% real return (not simply $5\%-3\%=2\%$, though close).
Q: Escalation vs. discounting
A: Escalation applies inflation's effects to a cost stream; discounting converts amounts at different times to a common point in time, reflecting the time value of money.

## Comparison Techniques
Q: Net Present Value (NPV)
A: $NPV = PV(Benefits) - PV(Costs)$; choose the highest; favorable if > 0.
R: yes
Q: When is PV of cost alone sufficient to rank alternatives?
A: When benefits are equal across alternatives (cost-minimization comparison).
Q: Benefit-cost ratio (BCR)
A: $BCR = \dfrac{PV(Benefits)}{PV(Costs)}$; BCR > 1.0 is favorable.
R: yes
Q: Savings-to-investment ratio (SIR)
A: $SIR = \dfrac{PV(Savings)}{PV(Investment)}$; SIR > 1.0 is favorable.
R: yes
Q: When to use EUAC / Uniform Annual Cost
A: For comparing alternatives with unequal economic lives; puts PV on a per-year basis.
Q: Annuity PV factor formula and its use
A: $\sum_{n=1}^{N} \dfrac{1}{(1+r)^n} = \dfrac{1-(1+r)^{-N}}{r}$; multiply annual amount by factor to get PV of uniform stream.
R: yes
Q: Payback period
A: Time (usually in years) until cumulative savings/benefits equal the initial investment.
R: yes
Q: Is simple payback period discounted or undiscounted?
A: Usually undiscounted. Discounted payback accounts for time value and is always longer.
Q: Why is NPV preferred over BCR/ROI for ranking mutually exclusive alternatives?
A: NPV measures total absolute value created; ratios like BCR and ROI can favor smaller, higher-ratio alternatives over larger, higher-NPV ones.
Q: Payback period weaknesses
A: Ignores time value of money (unless discounted), ignores cash flows after payback point, favors early-payback alternatives with poor long-term economics.
Q: ROI weakness for ranking
A: It is a ratio and ignores investment scale; 50% ROI on \$1K creates less total value than 20% on \$10M.
Q: C/BR paradox example: Alt 1 = \$2 benefit/\$1 cost, Alt 2 = \$6 benefit/\$4 cost. Which wins NPV, which wins C/BR?
A: Alt 2 wins NPV (+\$2 vs +\$1); Alt 1 wins C/BR (0.50 vs 0.67 cost/benefit) — illustrates why NPV, not C/BR, ranks mutually exclusive alternatives.
Q: SIR formula and required per DODFMR Vol 11B Ch 58
A: $SIR = PV(Savings)/PV(Investment)$; DODFMR requires SIR and payback period for Capital Purchase Program investments.
Q: SIR + payback rule of thumb for "economical"
A: SIR > 1.0 AND payback period < 10 years.
Q: IRR (Internal Rate of Return) definition
A: The discount rate $r$ that makes $0 = \sum CF_t/(1+r)^t$, i.e., NPV = 0.
R: yes
Q: How do IRR and payback period both reach NPV = 0, and how do they differ?
A: Both drive NPV to zero; IRR varies the discount rate to do it, payback varies the time horizon.
Q: Four categories of sensitivity analysis assumptions to test
A: Elements most likely to change, elements most uncertain/least understood, significant cost/benefit drivers, factors with key relationships to results (objective, requirements, operations, residual value).

## EA Comparison Example (Facility Equipment)
Q: In the facility EA example, which alternative has the lowest PV of cost at r=5%?
A: B (\$689,646); ranking is B < A < C.
Q: Annuity PV factor for 5 years at r=5%
A: 4.3294 (sum of end-of-year DFs: 0.9524 + 0.9070 + 0.8638 + 0.8227 + 0.7835)
Q: Calculate PV of cost for Alt A (year 0 cost \$500K, annual O&M \$50K, 5-yr factor 4.3294)
A: $500{,}000 + 50{,}000 \times 4.3294 = 716{,}470$
Q: What is the UAC for Alt B in the facility example?
A: \$689,646 / 4.3294 = \$159,294
Q: Why is the facility EA ranking robust to discount-rate changes (3–8%)?
A: Lower-initial-cost alternatives (B) benefit more from higher discount rates; the premium-cost alternative (C) is never competitive over the range tested.
Q: What is the benefit comparison in the facility EA?
A: Benefits are **equal** across all three alternatives (same operational capability); this is a cost-minimization comparison.

## Lawn-Mower Worked Example (CEBoK core)
Q: Lawn-mower EA: real 10-year discount rate used and why
A: 2.8% — a real rate, because the analysis is done in constant FY08 dollars.
Q: Lawn-mower EA Table 13.6 NPV results and ranking
A: Outsource 128, New mower 103, Upgrade mower −31, Status quo −125; outsource wins.
Q: Which two lawn-mower alternatives have positive NPV?
A: Outsource and purchase-new-mower; upgrade and status quo are both negative.
Q: How does a C/BR-based ranking differ from NPV in the lawn-mower example?
A: C/BR would favor the new mower (more efficient, lower cost per unit benefit) over outsourcing (higher total NPV/effectiveness).
Q: Lawn-mower sensitivity analysis: what was tested, and did the ranking change?
A: Fuel/oil +10%, outsourcing cost +10%, mower's time value \$20→\$25/hr; outsourcing still won every case, and its NPV lead over the new mower widened.
Q: Mid-year discount factors for years 1 and 2 at 2.8% (lawn-mower example)
A: $F_1 = 1/1.028^{0.5} \approx 0.9863$; $F_2 = 1/1.028^{1.5} \approx 0.9594$.

## Testable Topics
Q: Core testable topics for this module
A: Discounting/PV/time value of money, real vs. nominal rates, Fisher equation, defining alternatives (incl. status quo), period of analysis, types/quantification of benefits.
Q: Testable-but-less-emphasized topic
A: Depreciation.
Q: Not-testable topics for this module
A: Relevant US legislation (e.g., Clinger-Cohen Act) and names of cost products that use EA (e.g., AoA vs. BCA vs. CBA), plus other advanced topics.

## Depreciation
Q: Depreciation definition and purpose
A: Allocation of an asset's cost over its useful life for accounting and tax purposes; not a cash flow itself.
R: yes
Q: Depreciable base formula
A: Cost − Salvage (residual) value
R: yes
Q: Straight-line depreciation formula
A: $D_n = \dfrac{\text{Cost} - \text{Salvage}}{N}$ per year
R: yes
Q: CEBoK's straight-line example: \$140K cost, \$20K salvage, 5-yr life, placed in service April 1 (9/12 first year)
A: 2006 = $(140{,}000-20{,}000)/5 \times 9/12 = 18{,}000$; 2007 and 2008 = \$24,000/year each
Q: Double-declining balance (DDB): what is the rate for a 5-year asset?
A: $1/N \times 200\% = 1/5 \times 200\% = 40\%$
Q: DDB Year 1 depreciation for the \$140K/9-month partial-year asset
A: $140{,}000 \times 0.40 \times 9/12 = 42{,}000$
Q: Why is DDB called an "accelerated" method?
A: It takes more depreciation in early years, providing larger tax deductions when the asset is newest.
Q: 150% declining balance rate formula
A: Straight-line rate × 150% (vs. × 200% for double/200% declining balance)
R: yes
Q: Sum-of-years'-digits (SYD) general formula
A: $SYD = (N+1)(N/2)$; e.g., for 500 years, $SYD = (501)(250) = 125{,}250$
R: yes
Q: SYD Year 1 fraction for a 5-year asset
A: Remaining life (5) / SYD (15) = 5/15
Q: SYD Year 1 depreciation for \$100K asset, \$10K residual (CEBoK's SYD example)
A: $(5/15) \times (100{,}000 - 10{,}000) = 30{,}000$
Q: Do straight-line, DDB, and SYD all total to the same amount over the asset's life?
A: Yes; all sum to (Cost − Salvage). Only the **timing** differs.
Q: Critical rule about salvage value in DDB
A: Never depreciate an asset below its salvage value; cap the final year's depreciation so book value equals salvage exactly.
Q: Which method allocates MORE depreciation to LATER years?
A: Sinking fund depreciation — the exception, along with straight-line's flat schedule, to the usual front-loaded pattern.
Q: Fixed percentage depreciation method
A: Annual depreciation is a fixed percentage of the beginning-of-year book value; picking too low a rate leaves book value well above salvage, too high a rate drives later years to zero depreciation.
R: yes

## Special Topics
Q: Functional Economic Analysis (FEA)
A: EA applied to business-process decisions, emphasizing full cost accounting (overhead, indirect) and function-wide impact.
R: yes
Q: Analysis of Alternatives (AoA)
A: Broader acquisition study evaluating operational effectiveness, cost, and risk of materiel solutions; EA is a core input but AoA also weighs non-cost factors.
R: yes
Q: Lease vs. purchase comparison
A: Compare PV(Lease payments) vs. PV(Purchase + O&S − Residual Value); attention to discount rate type (often prescribed Treasury rates), tax effects, residual value.
Q: Three types of benefits in benefits analysis
A: Monetizable (cost savings, revenue), quantifiable non-monetary (availability, response time), qualitative (readiness, safety, morale).
Q: What should you do with benefits that cannot be monetized?
A: Describe them qualitatively and present **alongside** the quantitative result; do not omit or force a dollar figure that overstates precision.
Q: Why would cost-effectiveness analysis be used?
A: When benefits cannot be monetized; compare PV of cost per unit of non-monetary effectiveness measure (e.g., cost per operational hour).
Q: Commercial Activities / A-76 studies
A: Outsourcing/privatization studies governed by OMB Circular A-76; the EA within them is smaller/less detailed and usually skips a formal benefits estimate, assuming either performer can do the work equally well.
R: yes
Q: Weighted point rating in a benefits decision matrix
A: Assign each benefit a value and a weight (weight 2 = twice the value of weight 1); multiply and sum for a composite benefit score per alternative.
R: yes
Q: Benefit score to ratio conversion in a benefits matrix
A: Divide alternative's NPV (cost + monetary benefits only) by its benefit score for C/BR (lowest best), or invert for B/CR (highest best).
Q: Why can ROI have more than one valid solution for a project?
A: When cash flows change sign more than once (e.g., outflow, then inflows, then a disposal-cost outflow), the ROI equation can have multiple roots, making the ROI decision rule inapplicable.
Q: A shortcoming of payback period analysis beyond ignoring later cash flows
A: No generally accepted rule for how many years is acceptable, and it gives no decision rule when two projects tie on payback period.

## Sensitivity and Robustness
Q: Purpose of sensitivity analysis (Step 6)
A: Test whether the ranking of alternatives changes when key assumptions (discount rate, cost, life, benefits) vary; find break-even points.
Q: What is a break-even point in sensitivity analysis?
A: The value of an assumption at which two alternatives have equal cost (or at which NPV = 0); the ranking flips.
R: yes
Q: What makes a recommendation robust?
A: The ranking holds across plausible ranges of key assumptions; small changes in assumptions do not flip the winner.
Q: If ranking flips only at extreme assumption values, the recommendation is…
A: Robust; the decision is not sensitive to realistic variation and can be defended.
Q: If ranking flips at small, plausible assumption changes, the recommendation is…
A: Fragile or not robust; flag this in the recommendation and note that the decision depends heavily on those assumptions.
`
});
