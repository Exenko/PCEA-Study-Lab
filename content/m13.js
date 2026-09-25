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
- Develop a comprehensive, mutually exclusive, feasible set of alternatives.
- Include the **status quo / baseline ("do nothing")** as the reference point for all comparisons.
- Screen out clearly infeasible or dominated alternatives before detailed analysis.

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
**OMB Circular A-94** is the standard source for prescribed federal discount rates, updated annually. It specifies:
- A real rate for most programs (historically ~7%, the average pre-tax private investment return).
- Separate Treasury-based nominal and real rates (by maturity) for lease-purchase and asset-acquisition analyses.
- Always match the rate type to the dollar type.
:::

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
      id: 'example', title: 'Worked example: facility equipment EA', summary: 'All 7 steps, sensitivity, ranking robustness',
      body: String.raw`This is a complete, end-to-end EA following the seven-step process.

### Steps 1–3: Objective, Ground Rules, Alternatives

**Objective**: Determine which of three equipment alternatives provides the lowest life-cycle cost over the next 5 years.

**Ground Rules**:
- Analysis period: 5 years (Years 1–5), acquisition in Year 0.
- Real discount rate: 5%, end-of-year convention.
- All costs in constant base-year dollars.
- Benefits (operational capability) are assumed equivalent; this is a **cost-minimization** comparison.

**Alternatives**:
- **A**: Mid-cost system with moderate annual O&M.
- **B**: Lower-cost system with higher annual O&M.
- **C**: Premium system with low annual O&M.

### Step 4: Cost Estimates

| Alternative | Initial Cost (Year 0) | Annual O&M (Years 1–5) |
| --- | --- | --- |
| A | \$500,000 | \$50,000/yr |
| B | \$300,000 | \$90,000/yr |
| C | \$650,000 | \$30,000/yr |

+++

### Step 5: Compare and Rank

**Annuity PV factor for 5 years at 5%**:
$$0.9524 + 0.9070 + 0.8638 + 0.8227 + 0.7835 = 4.3294$$

**PV of Costs**:
$$PV_A = 500{,}000 + (50{,}000 \times 4.3294) = \$716{,}470$$
$$PV_B = 300{,}000 + (90{,}000 \times 4.3294) = \$689{,}646$$
$$PV_C = 650{,}000 + (30{,}000 \times 4.3294) = \$779{,}882$$

**Uniform Annual Cost** (PV ÷ 4.3294):

| Alternative | PV of Cost | UAC |
| --- | --- | --- |
| A | \$716,470 | \$165,466 |
| B | \$689,646 | \$159,286 |
| C | \$779,882 | \$180,111 |

**Ranking (lowest cost first): B < A < C.** Alternative B is the lowest-cost choice.

+++

### Step 6: Sensitivity Analysis

Re-run at $r = 3\%$ and $r = 8\%$ to test ranking robustness.

**At $r = 3\%$** (5-yr factor = 4.5797):
$$PV_A = 500{,}000 + 50{,}000(4.5797) = \$728{,}985$$
$$PV_B = 300{,}000 + 90{,}000(4.5797) = \$712{,}173$$
$$PV_C = 650{,}000 + 30{,}000(4.5797) = \$787{,}391$$

**At $r = 8\%$** (5-yr factor = 3.9926):
$$PV_A = 500{,}000 + 50{,}000(3.9926) = \$699{,}630$$
$$PV_B = 300{,}000 + 90{,}000(3.9926) = \$659{,}334$$
$$PV_C = 650{,}000 + 30{,}000(3.9926) = \$769{,}778$$

In both cases, the ranking remains **B < A < C**. The recommendation is **robust**.

+++

### Step 7: Recommendation

**Recommend Alternative B**: lowest PV of life-cycle cost (\$689,646) and lowest UAC (\$159,286) at the ground-rule 5% discount rate. The ranking is confirmed robust across 3–8% discount rates.

**Caveat**: B's higher recurring O&M (\$90k/yr) means more long-term budget exposure than A. If O&M volatility or budget uncertainty is a policy concern, qualitatively weigh this risk alongside the quantitative result.

+++

:::check
Q: In the facility EA, why is the ranking robust across discount-rate changes?
* B benefits more from higher rates (future O&M discounted faster); C's large Year-0 cost is never overcome
- The three alternatives have identical total costs
- The sensitivity analysis is not a required step
> Lower initial cost + higher O&M shifts the break-even point. A lower-rate preference for B occurs, but not enough to lose to C.
:::

:::check
Q: At r = 3%, is the ranking the same as at r = 5%?
* Yes, B < A < C in both cases
- No, the ranking flips to A < B < C
- No, C becomes the best option
> Comparing the tables: at 3%, PV values are higher but the order is unchanged.
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

### Straight-Line Depreciation

Equal depreciation expense each year:
$$D_n = \frac{\text{Cost} - \text{Salvage}}{N}$$

The simplest and most common method. Depreciation is constant regardless of time.

**Example**: Cost = \$100K, Salvage = \$10K, Life = 5 years.
$$D_n = \frac{100{,}000 - 10{,}000}{5} = \$18{,}000/\text{year}$$

| Year | Depreciation | Book Value (end of year) |
| --- | --- | --- |
| 1 | \$18,000 | \$82,000 |
| 2 | \$18,000 | \$64,000 |
| 3 | \$18,000 | \$46,000 |
| 4 | \$18,000 | \$28,000 |
| 5 | \$18,000 | \$10,000 |

+++

### Double-Declining Balance (200% DDB)

An **accelerated method**: applies a constant rate to the **remaining book value** each year, taking larger deductions early.

Rate = $2/N$ (for 200% DDB). Depreciation stops once book value reaches salvage value.

**Example**: Same asset, rate = $2/5 = 40\%$.

| Year | Beginning Book Value | Depreciation | Ending Book Value |
| --- | --- | --- | --- |
| 1 | \$100,000 | \$40,000 | \$60,000 |
| 2 | \$60,000 | \$24,000 | \$36,000 |
| 3 | \$36,000 | \$14,400 | \$21,600 |
| 4 | \$21,600 | \$8,640 | \$12,960 |
| 5 | \$12,960 | \$2,960* | \$10,000 |

*Year 5 is capped at \$2,960 so book value equals salvage (\$10,000).

+++

### Sum-of-the-Years'-Digits (SYD)

Another **accelerated method** using a declining fraction of the depreciable base.

$$SYD = \frac{N(N+1)}{2} \qquad D_n = \frac{\text{Remaining Life at Year } n}{SYD} \times (\text{Cost} - \text{Salvage})$$

**Example**: Same asset, SYD = $5(6)/2 = 15$, depreciable base = \$90,000.

| Year | Fraction | Depreciation | Book Value (end of year) |
| --- | --- | --- | --- |
| 1 | 5/15 | \$30,000 | \$70,000 |
| 2 | 4/15 | \$24,000 | \$46,000 |
| 3 | 3/15 | \$18,000 | \$28,000 |
| 4 | 2/15 | \$12,000 | \$16,000 |
| 5 | 1/15 | \$6,000 | \$10,000 |

+++

### Comparison and key rules

Total depreciation across all three methods equals \$90,000 (Cost − Salvage); only the **timing** differs.

- **Straight-line**: even deductions across the life.
- **DDB and SYD**: front-loaded (more depreciation early, favoring earlier tax deductions).

:::warn Important rule
**Never depreciate an asset below its salvage value.** Cap the final-year depreciation so book value exactly equals (not less than) salvage value.
:::

+++

:::check
Q: Cost \$100K, salvage \$10K, 5-year life. Straight-line annual depreciation?
= 18
> $(\text{Cost} - \text{Salvage}) / N = (100{,}000 - 10{,}000) / 5 = 18{,}000$ (in \$K).
:::

:::check
Q: Same asset, sum-of-years'-digits: first-year depreciation?
= 30
> Sum of digits = 15. Year 1 fraction = 5/15. Depreciation = $(5/15) \times 90{,}000 = 30{,}000$ (in \$K).
:::

:::check
Q: Same asset, double-declining balance (rate 40%): first-year depreciation?
= 40
> $0.40 \times 100{,}000 = 40{,}000$ (in \$K). DDB ignores salvage until final year.
:::`
    },
    {
      id: 'related', title: 'Special cases and related topics', summary: 'FEA, AoA, lease-buy, benefits, ROI vs. NPV',
      body: String.raw`### Functional Economic Analysis (FEA)

An EA applied to **business-process or functional-area decisions** (e.g., outsourcing a support function). Emphasizes full cost accounting including overhead and indirect costs. Common in DoD business-process reengineering.

### Analysis of Alternatives (AoA)

A broader, formal **acquisition-milestone study** that evaluates the operational **effectiveness, cost, and risk** of alternative materiel solutions to a capability need.

- EA (life-cycle cost comparison) is a core input to an AoA.
- AoA also weighs effectiveness and risk factors beyond pure cost.
- More comprehensive than a simple cost-only EA.

+++

### Lease vs. Purchase Decisions

A specific EA application comparing:
$$PV(\text{Lease}) \text{ vs. } PV(\text{Purchase} + O\&S - \text{Residual Value})$$

**Key considerations:**
- The correct **discount rate** (nominal Treasury-based rates are often prescribed for lease-purchase analyses per OMB A-94).
- **Tax effects** (lease payments may be tax-deductible; purchase depreciation is).
- **Salvage/residual value** treatment at the end of the lease/analysis period.
- Include all costs and benefits on both sides for a fair comparison.

+++

### Commercial Activities and benefits analysis

**Commercial activities**: EA framework applied to public-vs-private (in-house vs. contract) decisions for commercial-type functions. Requires consistent cost comparisons including overhead and transition costs.

**Benefits analysis**: Benefits may be:
- **Monetizable** (cost avoidance, revenue, productivity gains).
- **Quantifiable but non-monetary** (availability, response time, system reliability).
- **Qualitative** (improved readiness, safety, morale).

Where benefits cannot be monetized reliably, describe them qualitatively and present them **alongside** the quantitative cost comparison rather than omitting them or forcing a dollar figure that overstates precision. Use **cost-effectiveness ratios** (PV of cost per unit of non-monetary effectiveness measure) when appropriate.

+++

### NPV vs. ROI vs. Payback: the ranking mistake

A critical mistake in EA is to rank mutually exclusive alternatives by BCR or ROI instead of NPV.

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
Q: What makes a good EA objective?
A: States the need without presupposing a solution (e.g., "move X tons/month" not "buy trucks").
Q: What is the status quo alternative?
A: The baseline "do nothing" option against which all others are measured.
Q: Treatment of sunk costs in an EA
A: Excluded. Only future, differential costs that vary between alternatives matter.
Q: What are ground rules and why matter?
A: Common assumptions (analysis period, discount rate, base year, inflation treatment) applied consistently to level the comparison.
Q: Name 3 components of ground rules
A: Analysis period, discount rate, base year, inflation treatment, cost estimation conventions.

## Discounting Fundamentals
Q: Present value formula (end-of-year)
A: $PV = CF_0 + \sum_{n=1}^{N} \dfrac{CF_n}{(1+r)^n}$
Q: Discount factor formula
A: $DF_n = \dfrac{1}{(1+r)^n}$ (end-of-year); $DF_n^{mid} = \dfrac{1}{(1+r)^{n-0.5}}$ (mid-year)
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
Q: What does OMB Circular A-94 specify?
A: Federal guidance on discount rates (real and nominal, by maturity), updated annually; prescribes rates for government cost-effectiveness and lease-purchase analysis.

## Comparison Techniques
Q: Net Present Value (NPV)
A: $NPV = PV(Benefits) - PV(Costs)$; choose the highest; favorable if > 0.
Q: When is PV of cost alone sufficient to rank alternatives?
A: When benefits are equal across alternatives (cost-minimization comparison).
Q: Benefit-cost ratio (BCR)
A: $BCR = \dfrac{PV(Benefits)}{PV(Costs)}$; BCR > 1.0 is favorable.
Q: Savings-to-investment ratio (SIR)
A: $SIR = \dfrac{PV(Savings)}{PV(Investment)}$; SIR > 1.0 is favorable.
Q: When to use EUAC / Uniform Annual Cost
A: For comparing alternatives with unequal economic lives; puts PV on a per-year basis.
Q: Annuity PV factor formula and its use
A: $\sum_{n=1}^{N} \dfrac{1}{(1+r)^n} = \dfrac{1-(1+r)^{-N}}{r}$; multiply annual amount by factor to get PV of uniform stream.
Q: Payback period
A: Time (usually in years) until cumulative savings/benefits equal the initial investment.
Q: Is simple payback period discounted or undiscounted?
A: Usually undiscounted. Discounted payback accounts for time value and is always longer.
Q: Why is NPV preferred over BCR/ROI for ranking mutually exclusive alternatives?
A: NPV measures total absolute value created; ratios like BCR and ROI can favor smaller, higher-ratio alternatives over larger, higher-NPV ones.
Q: Payback period weaknesses
A: Ignores time value of money (unless discounted), ignores cash flows after payback point, favors early-payback alternatives with poor long-term economics.
Q: ROI weakness for ranking
A: It is a ratio and ignores investment scale; 50% ROI on \$1K creates less total value than 20% on \$10M.

## EA Comparison Example (Facility Equipment)
Q: In the facility EA example, which alternative has the lowest PV of cost at r=5%?
A: B (\$689,646); ranking is B < A < C.
Q: Annuity PV factor for 5 years at r=5%
A: 4.3294 (sum of end-of-year DFs: 0.9524 + 0.9070 + 0.8638 + 0.8227 + 0.7835)
Q: Calculate PV of cost for Alt A (year 0 cost \$500K, annual O&M \$50K, 5-yr factor 4.3294)
A: $500{,}000 + 50{,}000 \times 4.3294 = 716{,}470$
Q: What is the UAC for Alt B in the facility example?
A: \$689,646 / 4.3294 = \$159,286
Q: Why is the facility EA ranking robust to discount-rate changes (3–8%)?
A: Lower-initial-cost alternatives (B) benefit more from higher discount rates; the premium-cost alternative (C) is never competitive over the range tested.
Q: What is the benefit comparison in the facility EA?
A: Benefits are **equal** across all three alternatives (same operational capability); this is a cost-minimization comparison.

## Depreciation
Q: Depreciation definition and purpose
A: Allocation of an asset's cost over its useful life for accounting and tax purposes; not a cash flow itself.
Q: Depreciable base formula
A: Cost − Salvage value
Q: Straight-line depreciation formula
A: $D_n = \dfrac{\text{Cost} - \text{Salvage}}{N}$ per year
Q: Example: straight-line depreciation, cost \$100K, salvage \$10K, 5-year life
A: $D_n = (100{,}000 - 10{,}000) / 5 = 18{,}000$ per year
Q: Double-declining balance (DDB): what is the rate for a 5-year asset?
A: 2/N = 2/5 = 40% (or 0.40)
Q: DDB Year 1 depreciation for a \$100K asset
A: $100{,}000 \times 0.40 = 40{,}000$
Q: Why is DDB called an "accelerated" method?
A: It takes more depreciation in early years, providing larger tax deductions when the asset is newest.
Q: Sum-of-years'-digits (SYD) method: what is SYD for a 5-year life?
A: $5(6)/2 = 15$
Q: SYD Year 1 fraction for a 5-year asset
A: Remaining life (5) / SYD (15) = 5/15
Q: SYD Year 1 depreciation for \$100K asset, \$10K salvage
A: $(5/15) \times (100{,}000 - 10{,}000) = 30{,}000$
Q: Do all three depreciation methods total to the same amount over the asset's life?
A: Yes; all sum to (Cost − Salvage). Only the **timing** differs.
Q: Critical rule about salvage value in DDB
A: Never depreciate an asset below its salvage value; cap the final year's depreciation so book value equals salvage.

## Special Topics
Q: Functional Economic Analysis (FEA)
A: EA applied to business-process decisions, emphasizing full cost accounting (overhead, indirect) and function-wide impact.
Q: Analysis of Alternatives (AoA)
A: Broader acquisition study evaluating operational effectiveness, cost, and risk of materiel solutions; EA is a core input but AoA also weighs non-cost factors.
Q: Lease vs. purchase comparison
A: Compare PV(Lease payments) vs. PV(Purchase + O&S − Residual Value); attention to discount rate type (often prescribed Treasury rates), tax effects, residual value.
Q: Three types of benefits in benefits analysis
A: Monetizable (cost savings, revenue), quantifiable non-monetary (availability, response time), qualitative (readiness, safety, morale).
Q: What should you do with benefits that cannot be monetized?
A: Describe them qualitatively and present **alongside** the quantitative result; do not omit or force a dollar figure that overstates precision.
Q: Why would cost-effectiveness analysis be used?
A: When benefits cannot be monetized; compare PV of cost per unit of non-monetary effectiveness measure (e.g., cost per operational hour).

## Sensitivity and Robustness
Q: Purpose of sensitivity analysis (Step 6)
A: Test whether the ranking of alternatives changes when key assumptions (discount rate, cost, life, benefits) vary; find break-even points.
Q: What is a break-even point in sensitivity analysis?
A: The value of an assumption at which two alternatives have equal cost (or at which NPV = 0); the ranking flips.
Q: What makes a recommendation robust?
A: The ranking holds across plausible ranges of key assumptions; small changes in assumptions do not flip the winner.
Q: If ranking flips only at extreme assumption values, the recommendation is…
A: Robust; the decision is not sensitive to realistic variation and can be defended.
Q: If ranking flips at small, plausible assumption changes, the recommendation is…
A: Fragile or not robust; flag this in the recommendation and note that the decision depends heavily on those assumptions.
`
});
