PCEA.addModule({
  id: 'm15', num: 15, title: 'Earned Value Management', short: 'Earned Value', source: 'guide',
  blurb: 'PV/EV/AC, CV/SV, CPI/SPI, EAC and TCPI, baselines, management reserve and variance analysis.',
  intro: String.raw`Earned Value Management (EVM) integrates **scope, schedule, and cost** into a single measurement system. It answers the critical question: "For the money we spent, how much work did we actually accomplish?"

**The core insight:** Budget-vs-actual alone is misleading. Spending \$500K could mean good efficiency or just falling behind. EVM adds a third number — the **budgeted value of the work actually done** — so you can separate cost performance from schedule progress.

**Why it matters:** EVM provides early warning of problems, supports independent cost estimates, and enables management by exception.`,
  sections: [
    {
      id: 'basics', title: 'The three core numbers', summary: 'PV, EV, AC and why EVM matters',
      body: String.raw`Imagine a program budgeted for \$1M, scheduled over 12 months. Three months in, you have spent \$250K. Does that mean you are on budget? Not without knowing: **how much work did you actually accomplish for that \$250K?**

EVM solves this with three core numbers, all measured at the same point in time:

| Term | Old name | Meaning |
|---|---|---|
| **PV**, planned value | **BCWS** | Budget for work **planned** to be done by now |
| **EV**, earned value | **BCWP** | **Budgeted** cost of work you **actually completed** |
| **AC**, actual cost | **ACWP** | What the completed work **really cost** |

:::key
EV is the anchor. Compare EV to AC for **cost** efficiency. Compare EV to PV for **schedule** progress.
:::

+++

### The power of EVM

Suppose you spent \$250K and you planned \$240K of work. If only \$200K of budgeted work is actually complete, you are:
- **Over cost**: spent \$250K for work budgeted at \$200K
- **Behind schedule**: only 83% of planned work done (200/240)

Without EV, the budget variance alone (\$250K − \$240K planned = \$10K overage) looks minor. EV reveals both problems at once.

:::tip
Early warning: these trends stabilize by 15-20% completion and rarely reverse significantly. Cumulative CPI is historically a strong predictor of final cost.
:::

+++

### EVM on government contracts

- Required on major U.S. DoD contracts above thresholds: \$20M for EVMS application, \$100M for formal validation
- Governed by **EIA-748** (Earned Value Management System standard) — 32 guidelines covering organization, planning, accounting, analysis, and change control
- The contractor's control account managers (CAMs) report EV data; the government program manager and cost analyst use it as an independent **surveillance tool** and **EAC cross-check**

:::check
Q: Planned \$400K, completed work budgeted at \$350K, actual cost \$420K. What is EV?
= 350
> EV = budgeted cost of work performed = \$350K.
:::

:::check
Q: A program with EV=\$80K, PV=\$90K, and AC=\$85K. Is it ahead or behind schedule?
- Ahead
* Behind
- On schedule
> SV = EV − PV = 80 − 90 = −10 (negative = behind). The earned work is less than planned.
:::`
    },
    {
      id: 'structure', title: 'Budget structure and control accounts', summary: 'PMB, CBB, MR, UB, CAMs, work packages',
      body: String.raw`The Performance Measurement Baseline (PMB) is the **time-phased budget plan** used to measure performance. It has two parts:

$$PMB = \text{Distributed Budget} + \text{Undistributed Budget}$$

- **Distributed Budget**: Time-phased budgets assigned to control accounts (the main work)
- **Undistributed Budget (UB)**: Budget for authorized work not yet assigned to control accounts (temporary; should clear quickly)

The **Contract Budget Base (CBB)** adds management reserve:

$$CBB = PMB + \text{Management Reserve (MR)}$$

**Management Reserve** is budget held **outside** the PMB for:
- In-scope work that was not originally planned (realized risks)
- Contingencies for unforeseeable problems
- **NOT for scope changes** (those require contract mods)

MR is **not time-phased** and is **not part of BAC** (budget at completion) calculations.

+++

### Control accounts and work packages

The WBS (Work Breakdown Structure, Module 3) intersects with the organization chart to form **control accounts** — the key management control points:

| Term | Scope | Manager | Traits |
|---|---|---|---|
| **Control Account** | A slice of work (WBS) owned by one manager (CAM) | Control Account Manager | Integration point for budget, schedule, actuals, EV |
| **Work Package** | Detailed, near-term tasks within a CA | CAM | Short duration, specific EV technique, discrete start/end |
| **Planning Package** | Far-term work not yet detailed | CAM | Budget held summary-level, rolled into work packages later |

Each work package is assigned an **earned value technique** before work begins (see next section). This determines **when and how much EV is claimed**.

:::check
Q: MR = \$50M, PMB = \$950M. Contract Budget Base?
= 1000
> CBB = PMB + MR = 950 + 50 = 1000.
:::

:::check
Q: Why is too much Level-of-Effort (LOE) a problem?
* LOE earns EV as time passes (EV = PV always), so it hides cost and schedule problems
- LOE always results in overruns
- LOE is never allowed
> With LOE, CV and SV are zero by definition. Keep LOE to genuine support activities (program management, administration).
:::

:::widget evm:::
`
    },
    {
      id: 'variances', title: 'Variances and performance indices', summary: 'CV, SV, CPI, SPI — diagnosis of cost and schedule health',
      body: String.raw`The two **variances** tell you the dollar magnitude of a problem. The two **indices** tell you the **efficiency rate**.

### Variances (dollars)

$$CV = EV - AC \quad \text{(Cost Variance)}$$
$$SV = EV - PV \quad \text{(Schedule Variance)}$$

- **CV < 0**: Over cost (overspending)
- **SV < 0**: Behind schedule (in dollar terms)
- **Positive is good**, negative is bad — same sign convention as VAC

:::key Memory hook
**EV always comes first.** CV = EV minus AC (cost). SV = EV minus PV (schedule).
:::

+++

### Indices (efficiency rates)

$$CPI = \frac{EV}{AC} \quad \text{(Cost Performance Index)}$$
$$SPI = \frac{EV}{PV} \quad \text{(Schedule Performance Index)}$$

- **CPI = 1.0**: On budget. **CPI < 1.0**: Overrun. **CPI > 1.0**: Under budget (favorable).
- **SPI = 1.0**: On schedule. **SPI < 1.0**: Behind. **SPI > 1.0**: Ahead (favorable).

**Cumulative vs. current-period indices**: Always examine both. Cumulative smooths noise; current-period spots emerging trends.

**CPI stability rule** (research by Christensen): The cumulative CPI by about 15–20% completion is historically a strong predictor of final performance and **rarely improves by more than ~10%** after that point.

+++

### Percent complete and percent spent

$$\%\text{Complete} = \frac{EV}{BAC} \quad \%\text{Spent} = \frac{AC}{BAC}$$

If % Spent > % Complete, the program is spending faster than it is accomplishing work — a red flag consistent with CV < 0.

:::example Quick scenario
- PV (planned) = \$400K, EV (earned) = \$350K, AC (spent) = \$420K
- CV = 350 − 420 = −70 (overspent by \$70K)
- SV = 350 − 400 = −50 (schedule worth \$50K behind)
- CPI = 350/420 = 0.833 (\$0.83 earned per \$1 spent)
- SPI = 350/400 = 0.875 (87.5% rate of planned work)
:::

:::check
Q: PV=400, EV=350, AC=420. What is CV?
= -70
> CV = 350 − 420 = −70 (unfavorable).
:::

:::check
Q: Same data. What is CPI (4 decimals)?
= 0.8333 ±0.0005
> 350/420 = 0.8333. Spending at 0.83× efficiency.
:::

:::check
Q: Same data. What is SV?
= -50
> SV = 350 − 400 = −50 (behind schedule).
:::

:::challenge evm sc=overrun bac=1000 m=6 lock=sc,bac
Q: In this program the cost overrun grows over time. Scrub forward to the **first month** in which CPI drops below 0.90.
goal: cpi < 0.9
goal: cpi > 0.89
show: m=14
> CPI slides from 0.925 at month 10 to 0.895 at month 14. Cumulative CPI moves slowly because each month is averaged into everything before it, so once it slips it's hard to recover.
:::`
    },
    {
      id: 'eac', title: 'Estimates at completion', summary: 'EAC formulas, VAC, and choosing among methods',
      body: String.raw`The **Estimate at Completion (EAC)** is your best current forecast of total cost at program end. There is **no single correct formula** — always compute multiple EACs and understand the assumptions each embeds.

$$EAC = AC_{\text{cum}} + ETC$$

Where **ETC** (Estimate to Complete) = budgeted cost of remaining work, adjusted by efficiency.

+++

### Common independent EAC methods

| Method | Formula | Assumes |
|---|---|---|
| **CPI-based** | $EAC = \dfrac{BAC}{CPI}$ or $AC + \dfrac{BAC-EV}{CPI}$ | Past cost efficiency continues on remaining work (often a **lower bound** on realistic EACs) |
| **Composite (CPI × SPI)** | $EAC = AC + \dfrac{BAC-EV}{CPI \times SPI}$ | Schedule pressure also hurts cost; more **pessimistic/conservative** |
| **Budgeted rate** | $EAC = AC + (BAC - EV)$ | Remaining work performed exactly per plan (**optimistic**) |
| **Bottom-up / LRE** | Contractor's latest revised estimate | Fresh re-estimate of remaining work (most credible, most labor-intensive) |

**Variance at Completion (VAC):**
$$VAC = BAC - EAC$$
- VAC < 0: projected overrun
- VAC > 0: projected underrun

+++

:::example EAC comparison
- BAC = \$1000, EV = \$350, AC = \$420
- CPI = 0.8333, SPI = 0.875
- **EAC_CPI** = 1000/0.8333 = **\$1200** (assumes cost efficiency stays 0.833)
- **EAC_composite** = 420 + 650/(0.8333 × 0.875) = 420 + 891 = **\$1311** (worse, schedule pressure adds cost)
- **EAC_best** = 420 + (1000 − 350) = **\$1070** (optimistic; remaining work at plan)
- **VAC_CPI** = 1000 − 1200 = **−\$200** projected overrun

Notice the range: \$1070 to \$1311. Which is credible? CPI-based (\$1200) is often used as a conservative floor.
:::

:::check
Q: BAC=1000, CPI=0.8333. CPI-based EAC?
= 1200 ±1
> 1000/0.8333 = 1200.
:::

:::check
Q: BAC 1000, EV 350, AC 420, CPI 0.8333, SPI 0.875. Composite EAC? (whole dollars)
= 1311 ±2
> 420 + (1000−350)/(0.8333 × 0.875) = 420 + 650/0.7292 = 1311.
:::

:::challenge evm sc=overrun bac=1000 m=14 lock=sc,bac,m
Q: At month 14 the CPI is 0.895 and BAC is \$1,000. Predict the EAC using $EAC = BAC / CPI$.
predict: eac +- 0.5%
> $1000 / 0.895 \approx 1117$. The CPI method assumes the remaining work goes at the same efficiency as the work so far.
:::`
    },
    {
      id: 'tcpi', title: 'To-complete performance index', summary: 'Efficiency needed to hit a cost target — the reality check',
      body: String.raw`The **TCPI** answers: "What efficiency must we achieve on remaining work to finish at a target?"

$$TCPI_{\text{BAC}} = \frac{BAC - EV}{BAC - AC} \quad \quad TCPI_{\text{EAC}} = \frac{BAC - EV}{EAC - AC}$$

- **TCPI_BAC**: Efficiency required to meet the original budget
- **TCPI_EAC**: Efficiency required to meet the current estimate (usually ≈ the CPI already built into the EAC, so it's a consistency check)

### The realism check

If TCPI_BAC is **much higher** than the CPI achieved to date, hitting BAC is not credible. A rule of thumb: if TCPI exceeds achieved CPI by more than ~0.05–0.10, the target is unrealistic.

**Example**: Achieved CPI = 0.85 (spending 1.18× budgeted). To recover and hit BAC, you'd need TCPI = 1.15 or higher. That means reversing historical performance by 35%+ — statistically improbable.

+++

:::key
TCPI is your **best gut-check tool**. It instantly reveals whether a projected EAC or BAC is achievable by comparing "future performance required" to "past performance achieved."
:::

:::example From the worked example
- BAC = 1000, EV = 350, AC = 420
- TCPI_BAC = (1000 − 350)/(1000 − 420) = 650/580 = **1.121**
- Achieved CPI = 0.8333
- Needed TCPI is 35% better than achieved CPI — **BAC is not realistic**. Hitting the original \$1000 budget is statistically improbable.
:::

:::check
Q: BAC 1000, EV 350, AC 420. TCPI to BAC? (3 decimals)
= 1.121 ±0.002
> (1000−350)/(1000−420) = 650/580 = 1.121.
:::

:::check
Q: An EAC is built using historical CPI = 0.92. What should TCPI_EAC roughly equal?
* About 0.92
- About 1.0
- Higher than 1.0
> The EAC formula already accounts for the achieved CPI, so the TCPI needed to hit that EAC should equal the CPI used — internal consistency check.
:::`
    },
    {
      id: 'reports', title: 'Variance reports and baseline reviews', summary: 'VARs, IBR, baseline integrity',
      body: String.raw`### Variance Analysis Reports (VARs)

When CV or SV (current period or cumulative) exceed contractually set **thresholds** (typically ±10% or ±\$X), the Control Account Manager must write a **Variance Analysis Report**:

1. **Root cause**: What went wrong?
2. **Impact**: Effect on EAC and schedule.
3. **Corrective action plan (CAP)**: How will you recover?

Thresholds often tiered by WBS level and dollar value. The goal: focus management attention on accounts actually in trouble.

**Current reporting**: IPMDAR (Integrated Program Management Data and Analysis Report), which replaced the older CPR/IPMR.

+++

### Integrated Baseline Review (IBR)

An IBR is held **shortly after contract award** (and after major re-baseline) — a joint government/contractor review to confirm the PMB is realistic:

- ✓ Technical scope is complete and achievable
- ✓ Schedules are realistic (IMS matches scope and resources)
- ✓ Resources are adequate
- ✓ Risks identified and understood

It builds **mutual confidence** in the baseline before execution begins.

### Baseline integrity warnings

- **Front-loading**: Aggressive early EV earning (overly generous 0/100 or percent-complete claims) inflates early performance, masking true problems.
- **Rubber baselining**: Retroactively adjusting BCWS to artificially improve SPI — a serious **EVMS compliance violation**.
- **Excessive LOE or UB**: Too much LOE hides problems; excessive UB means the baseline is not yet locked down.
- **PMB/IMS mismatch**: The baseline budget doesn't align with the schedule logic or resource plan.

:::check
Q: What is the primary purpose of an Integrated Baseline Review?
* Confirm that the PMB is realistic and that risks are understood
- Audit the contractor's accounting system
- Approve the contractor's fee
> An IBR verifies scope, schedule, budget and risks are aligned in an executable baseline.
:::

:::check
Q: Why is retroactive adjustment of BCWS a problem?
* It artificially improves SPI without reflecting real schedule recovery
- It is required for baseline changes
- It always improves cost performance
> Adjusting BCWS (the plan) after the fact to match BCWP (what was earned) is "rubber baselining" — it destroys the baseline's integrity.
:::

:::challenge evm sc=overrun bac=1000 m=10 lock=sc,bac,m
Q: At month 10, compare the TCPI (to finish on BAC) with the CPI so far. Is finishing on budget realistic?
* No: TCPI is more than 0.10 above CPI
- Yes: TCPI is below CPI
- Yes: TCPI and CPI are about equal
> TCPI is 1.083 against a CPI of 0.925, a gap of 0.16. A TCPI more than about 0.10 above the current CPI would require the remaining work to be done far more efficiently than anything so far, which programs rarely achieve.
:::`
    },
    {
      id: 'schedule', title: 'Earned schedule and schedule metrics', summary: 'SPI(t), why dollar-based SPI breaks down',
      body: String.raw`### The flaw in dollar-based schedule metrics

**SPI** (Schedule Performance Index) is computed as $EV / PV$. Near program completion, as BCWP approaches BAC, the ratio trends toward 1.0 **regardless of how late the program actually is**. A program finishing 6 months late can still show SPI = 0.99 if the final BCWP nearly equals final PV.

This is because SPI measures **dollar value of work**, not **time**.

+++

### Earned Schedule (ES) and SPI(t)

**Earned Schedule** is the point in time on the cumulative PV curve where the current EV intersects. In other words: "At what calendar date on our plan would we have earned the value we've actually accomplished?"

$$SPI(t) = \frac{ES}{AT}$$

Where **AT** = Actual Time elapsed since program start.

- **SPI(t) < 1.0**: Behind schedule (in time)
- **SPI(t) = 1.0**: On schedule
- **SPI(t) > 1.0**: Ahead of schedule

Unlike dollar-based SPI, earned schedule **stays meaningful through program completion**. A 6-month late program will show SPI(t) = 0.67 (ES ÷ 12 months actual).

Time-based SV can also be computed:
$$SV(t) = ES - AT \quad \text{(in time units)}$$

+++

:::example
- Program is 6 months into execution (AT = 6).
- Cumulative PV planned through month 6 is \$800K.
- Current EV is \$600K.
- On the cumulative PV curve, \$600K was planned to occur at month 4.5.
- **ES = 4.5**
- **SPI(t) = 4.5 / 6 = 0.75** — 25% behind schedule (in time)
- **SV(t) = 4.5 − 6 = −1.5 months behind**
:::

:::check
Q: Six months have elapsed (AT=6). Current EV = \$600K = the PV planned for month 4.5. What is SPI(t)?
= 0.75
> ES/AT = 4.5/6 = 0.75; the program is 1.5 months behind schedule.
:::

:::check
Q: Why does dollar-based SPI converge to 1.0 near completion?
* Because BCWP and BCWS both approach BAC, making EV/PV approach 1.0 regardless of lateness
- Because the program is actually finishing on time
- Because the contractor adjusted the baseline
> Dollar-based SPI is computed against dollars of value, which converge as the program finishes. Earned Schedule fixes this by measuring time directly.
:::`
    },
    {
      id: 'gold', title: 'EVM formulas quick reference', summary: 'Gold card, EIA-748, and key takeaways',
      body: String.raw`### The EVM Gold Card

The DoD **EVM Gold Card** is a pocket reference listing all standard formulas and relationships. Memorize these core formulas:

$$CV = EV - AC \quad SV = EV - PV$$
$$CPI = EV/AC \quad SPI = EV/PV$$
$$EAC_{\text{CPI}} = BAC/CPI \quad VAC = BAC - EAC$$
$$TCPI_{\text{BAC}} = (BAC - EV)/(BAC - AC)$$
$$PMB = \text{Distributed Budget} + UB \quad CBB = PMB + MR$$

+++

### EIA-748 and the 32 guidelines

EIA-748 (Earned Value Management System standard) requires compliance in **5 categories**:

1. **Organization**: Management responsibility, WBS definition, integration.
2. **Planning/Budgeting/Scheduling**: Baseline development, time-phasing, traceability to IMS.
3. **Accounting Considerations**: Cost accounting standards, labor/material tracking.
4. **Analysis and Management Reports**: Variance thresholds, VARs, EACs, trending.
5. **Revisions and Data Maintenance**: Baseline change control, configuration management.

You don't need to memorize all 32 guidelines, but understand that they govern **baseline integrity, objective measurement, disciplined change control, and active management using the data**.

### Key lessons (study tips)

1. **EV is the anchor**: All variances and indices flow from EV. Memorize BCWP always comes first (CV = EV − AC, SV = EV − PV).
2. **Cumulative CPI is predictive**: By ~15–20% completion, cumulative CPI rarely changes by more than 10%.
3. **Multiple EACs**: Always compute CPI-based, composite (CPI × SPI), and bottom-up EACs. They bound the real outcome.
4. **TCPI is the gut check**: Compare required efficiency to achieved efficiency. If TCPI >> historical CPI, the target is not credible.
5. **Management reserve is separate**: MR is outside PMB and not included in BAC calculations.
6. **SV/SPI break down late**: Use Earned Schedule (SPI(t)) near program completion for reliable schedule health.
7. **Use the data**: Collecting EVM metrics without acting on variances and trends defeats the purpose.

+++

### Common pitfalls

- Confusing CV and SV signs (both use EV − something; positive is always good)
- Using current-period instead of cumulative data for EACs (cumulative smooths noise)
- Including MR in BAC (BAC = sum of distributed + UB, not including MR)
- Trusting SV/SPI alone near completion (use Earned Schedule instead)
- Picking a single EAC without triangulation (always compute multiple methods)
- Ignoring TCPI as a reality check (a red flag for credibility of targets)
- Rubber baselining (retroactively adjusting BCWS — EVMS violation)

:::check
Q: Which formula is most commonly relied upon for independent EAC?
* $EAC_{\text{CPI}} = BAC/CPI$
- $EAC_{\text{composite}} = AC + (BAC-EV)/(CPI \times SPI)$
- $EAC_{\text{best}} = AC + (BAC-EV)$
> CPI-based EAC is the workhorse — it's simple, assumes past efficiency continues, and is often treated as a conservative floor.
:::

:::check
Q: Why compute multiple independent EACs instead of just one?
* Different methods embed different assumptions; triangulation reveals the range of credible outcomes
- Because the exam requires all three formulas
- Because one formula is never correct
> CPI-based (conservative), composite (pessimistic), bottom-up (realistic re-estimate), and best-case (optimistic) bound your forecast and expose assumption risks.
:::`
    }
  ],
  cards: String.raw`
## Fundamentals
Q: What problem does EVM solve that budget-vs-actual alone cannot?
A: EVM separates cost efficiency from schedule progress by measuring the budgeted value of work actually completed (EV), not just the dollars spent.
Q: BCWS / PV definition
A: Planned Value: the budgeted cost of work scheduled to be completed by a given date.
Q: BCWP / EV definition
A: Earned Value: the budgeted cost of work actually performed (the value earned by completing work).
Q: ACWP / AC definition
A: Actual Cost of Work Performed: the real cost incurred for the work completed.
Q: BAC definition
A: Budget at Completion: the total budgeted value of all work (sum of PMB, excluding MR).
Q: LRE definition
A: Latest Revised Estimate: the contractor's current best estimate of total cost at completion (synonymous with EAC).
Q: Why is EV called the "anchor" in EVM?
A: EV is compared to AC for cost efficiency and to PV for schedule progress; both variances and indices pivot on EV.
Q: Benefits of EVM over simple budget tracking
A: Objective measurement of progress, early warning of problems, defensible EAC, management by exception, single integrated database, cross-program comparison via indices.

## Budget Structure
Q: PMB formula
A: PMB = Distributed Budget + Undistributed Budget (time-phased budget for measurable work).
Q: CBB formula
A: CBB = PMB + Management Reserve.
Q: Management Reserve definition
A: Budget held outside the PMB for in-scope, unplanned work (realized risks), not for scope changes.
Q: Undistributed Budget definition
A: Budget for authorized work not yet assigned to control accounts (temporary; should clear quickly).
Q: Control Account definition
A: The management control point where WBS and organizational responsibility intersect; budgets, schedules, actuals and EV are integrated at this level, managed by a CAM.
Q: Work Package definition
A: A detailed, short-duration task within a control account with a specific earned value technique; discrete start/end dates; should span at most 1–2 reporting periods.
Q: Planning Package definition
A: Far-term work within a control account not yet broken into detailed work packages; budget held at summary level and rolled into work packages as work approaches.
Q: EV technique: 0/100
A: 100% of budget earned only at task completion; 0% until then. Best for very short tasks where no interim credit is reasonable.
Q: EV technique: 50/50 (or weighted split)
A: Fixed percentage (e.g., 50%) earned at start, remainder at completion. Good for short-duration work packages.
Q: EV technique: Percent Complete
A: BCWP = (estimated % complete) × work package budget. Riskiest (subjective) but necessary for longer-duration work with interim measurables.
Q: EV technique: Milestone / Weighted Milestones
A: Budget subdivided among discrete, objectively verifiable milestones; BCWP earned as each is completed.
Q: EV technique: Level of Effort (LOE)
A: BCWP always set equal to BCWS for the period (earns exactly what was planned). Used for support work; cannot generate CV or SV.
Q: EV technique: Apportioned Effort
A: BCWP tied proportionally to the earning of a related, directly-measured base work package (e.g., inspection as a % of production).
Q: Why minimize LOE in a healthy EVMS?
A: Because LOE earns EV exactly equal to PV by definition, it cannot generate cost or schedule variance and masks true performance problems.

## Variances
Q: Cost Variance formula
A: CV = EV − AC (negative = overrun)
Q: Schedule Variance formula
A: SV = EV − PV (negative = behind schedule in dollar terms)
Q: Memory hook for CV and SV
A: EV always comes first. CV = EV minus AC (cost). SV = EV minus PV (schedule).
Q: CV sign convention
A: Positive (EV > AC) = good (under cost). Negative (EV < AC) = bad (over cost).
Q: SV sign convention
A: Positive (EV > PV) = good (ahead). Negative (EV < PV) = bad (behind).
Q: CV% formula
A: CV% = (CV / EV) × 100%
Q: SV% formula
A: SV% = (SV / PV) × 100%
Q: Percent Complete formula
A: % Complete = (EV / BAC) × 100%
Q: Percent Spent formula
A: % Spent = (AC / BAC) × 100%
Q: Diagnostic: if % Spent > % Complete
A: Program is spending faster than it is completing work — consistent with CV < 0 (overrun).

## Indices
Q: CPI definition and formula
A: Cost Performance Index = EV / AC. Dollars of value earned per dollar spent. CPI < 1.0 = overrun, CPI > 1.0 = under budget.
Q: SPI definition and formula
A: Schedule Performance Index = EV / PV. Rate of work accomplishment vs. plan. SPI < 1.0 = behind, SPI > 1.0 = ahead.
Q: CPI stability rule
A: Cumulative CPI by ~15–20% completion is a strong predictor of final CPI and rarely improves by more than ~10% after that point.
Q: Cumulative vs. current-period indices
A: Cumulative smooths noise and is used for EACs; current-period is used to spot emerging trends or inflection points.
Q: Quick check: CPI = 0.85
A: Earning \$0.85 of value for every \$1 spent; 18% cost overrun rate.
Q: Quick check: SPI = 0.90
A: Completing 90% of planned work rate; 10% schedule slip rate.
Q: What CPI > 1.0 might indicate
A: Good cost performance to date, but also watch for front-loading (artificially favorable early EV) that may reverse later.

## Estimates at Completion
Q: EAC general formula
A: EAC = AC + ETC, where ETC (Estimate to Complete) is the cost of remaining work adjusted by efficiency.
Q: CPI-based EAC formula
A: EAC = BAC / CPI (or AC + (BAC − EV) / CPI). Assumes past cost efficiency continues.
Q: CPI-based EAC role
A: Often treated as a conservative floor on realistic EACs; simplest and most commonly used.
Q: Composite (CPI × SPI) EAC formula
A: EAC = AC + (BAC − EV) / (CPI × SPI). Assumes both cost and schedule inefficiency drive up remaining cost — more pessimistic.
Q: Budgeted-rate EAC formula
A: EAC = AC + (BAC − EV). Assumes remaining work performed exactly per plan — optimistic.
Q: Bottom-up / LRE EAC
A: Contractor's fresh detailed estimate of remaining work independent of indices. Most credible but most labor-intensive.
Q: VAC formula and meaning
A: VAC = BAC − EAC. Positive = projected underrun (good). Negative = projected overrun (bad).
Q: When to compute multiple independent EACs
A: Always. Different methods embed different assumptions (past efficiency continues, schedule pressure hurts cost, remaining work at plan); triangulation reveals the range of credible outcomes.
Q: EAC_CPI vs. EAC_composite typical relationship
A: EAC_CPI ≤ EAC_composite (CPI-based is more optimistic; composite is more pessimistic/conservative).

## To-Complete Performance Index
Q: TCPI_BAC formula
A: (BAC − EV) / (BAC − AC). Efficiency required on remaining work to finish at the original budget.
Q: TCPI_EAC formula
A: (BAC − EV) / (EAC − AC). Efficiency required to finish at the current EAC estimate.
Q: How to read TCPI
A: If TCPI >> historical CPI achieved to date, the target is not credible. Rule of thumb: if TCPI exceeds CPI by more than ~0.05–0.10, hitting that target is statistically improbable.
Q: TCPI as a gut-check tool
A: Compare required efficiency (TCPI) to achieved efficiency (cumulative CPI). Large gap signals that the EAC or BAC is unrealistic.
Q: TCPI_EAC as an internal consistency check
A: If EAC is built using cumulative CPI, then TCPI_EAC should roughly equal that CPI. Significant deviation means the EAC formula is inconsistent.

## Reports and Baselines
Q: Variance Analysis Report (VAR) contents
A: Root cause of the variance, impact on EAC and schedule, and corrective action plan (CAP).
Q: Variance threshold
A: Contractually set limits (e.g., ±10% or ±\$X) that trigger a VAR when CV% or SV% exceeds them.
Q: IPMDAR
A: Integrated Program Management Data and Analysis Report — the current DoD reporting vehicle for EVM/schedule data (replaced CPR/IPMR).
Q: Integrated Baseline Review (IBR) purpose
A: A joint government/contractor review to confirm the PMB is realistic, complete, adequately resourced, and risks are identified.
Q: When is an IBR typically held?
A: Shortly after contract award and after major baseline re-baselining.
Q: Front-loading warning sign
A: Aggressive early BCWP earning (overly generous 0/100 or percent-complete claims) that inflates early performance and masks true problems; watch for CPI dropping sharply later.
Q: Rubber baselining definition
A: Retroactively adjusting BCWS (the plan) to artificially improve SPI after work is completed. Serious EVMS compliance violation.
Q: Red flag: excessive LOE or UB in baseline
A: LOE hides problems; excessive UB means the baseline is not yet locked down. Both reduce EVMS credibility.

## Earned Schedule
Q: Earned Schedule (ES) definition
A: The point in time (date) on the cumulative PV curve where the current EV intersects; "when should we have reached the work we've actually done?"
Q: SPI(t) formula
A: SPI(t) = ES / AT, where AT = actual time elapsed. Measures schedule performance in time units instead of dollars.
Q: SPI(t) interpretation
A: SPI(t) < 1.0 = behind schedule (in time). SPI(t) = 1.0 = on schedule. SPI(t) > 1.0 = ahead.
Q: SV(t) formula
A: SV(t) = ES − AT (in time units, e.g., months or weeks).
Q: Why earned schedule matters late in programs
A: Dollar-based SV and SPI converge toward zero and 1.0 as BCWP approaches BAC regardless of actual lateness. SPI(t) stays meaningful to program completion.
Q: Estimated completion date using earned schedule
A: IEAC(t) = AT + [(PD − ES) / SPI(t)], where PD = planned duration.

## EIA-748 and Gold Card
Q: EIA-748 standard
A: Earned Value Management System standard; 32 guidelines organized into 5 categories (Organization, Planning/Budgeting/Scheduling, Accounting, Analysis/Reports, Revisions/Maintenance).
Q: EIA-748 category: Organization
A: Management responsibility, WBS definition, organizational integration, control accounts.
Q: EIA-748 category: Planning/Budgeting/Scheduling
A: Baseline development, time-phasing, traceability to Integrated Master Schedule.
Q: EIA-748 category: Accounting
A: Cost accounting standards, labor/material tracking, traceability to the WBS.
Q: EIA-748 category: Analysis and Management Reports
A: Variance thresholds, VARs, EACs, cumulative and trend analysis.
Q: EIA-748 category: Revisions and Data Maintenance
A: Baseline change control, configuration management, formal re-baselining procedures (OTB/OTS).
Q: Threshold for EVMS application (DoD)
A: \$20M contract value (EVMS application); \$100M for formal system validation.
Q: Over-Target Baseline (OTB)
A: Formal, customer-approved re-baselining that increases the PMB above the original contract budget; requires formal approval and is a significant program event.

## Key Pitfalls
Q: Common mistake: confusing CV and SV
A: Remember: CV = EV − AC (cost), SV = EV − PV (schedule); NEVER the reverse. Positive is good throughout EVM.
Q: Common mistake: using current-period data for EACs
A: Use cumulative data for EACs (smooths noise); use current-period for trend-spotting.
Q: Common mistake: including MR in BAC
A: BAC = sum of distributed + undistributed budgets only. MR is outside PMB and not included. Including MR overstates % complete.
Q: Common mistake: trusting SV/SPI alone late in program
A: Near completion, SV and SPI converge artifically regardless of lateness. Use Earned Schedule (SPI(t)) instead.
Q: Common mistake: picking a single EAC formula
A: Always compute multiple independent EACs (CPI-based, composite, bottom-up) and reconcile. No single formula is correct.
Q: Common mistake: ignoring TCPI
A: A TCPI_BAC far above historical CPI is a strong signal that the BAC is not credible. Use TCPI as your gut-check tool.
Q: Sign error trap: CV% and SV% denominators
A: CV% = CV / EV (not BAC or AC). SV% = SV / BCWS (not BAC). Wrong denominator gives wrong percent.
`
});
