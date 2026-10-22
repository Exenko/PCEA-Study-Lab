PCEA.addModule({
  id: 'm15', num: 15, title: 'Earned Value Management', short: 'Earned Value', source: 'guide',
  blurb: 'PV/EV/AC, CV/SV, CPI/SPI, EAC and TCPI, the WBS/control-account structure, baselines, and variance analysis.',
  intro: String.raw`Earned Value Management (EVM) integrates **scope, schedule, and cost** into a single measurement system. It answers the critical question: "For the money we spent, how much work did we actually accomplish?"

**The core insight:** Budget-vs-actual alone is misleading. Spending \$300K could mean good efficiency or falling behind. EVM adds a third number — the **budgeted value of the work actually done** — so you can separate cost performance from schedule progress.

**Why it matters:** EVM provides early warning of problems, supports independent EACs, and lets a program manager establish and execute a reasonable baseline.`,
  sections: [
    {
      id: 'basics', title: 'The three core numbers', summary: 'PV, EV, AC and why EVM matters',
      body: String.raw`:::primer:::
A project plans \$400 of work this month and has spent \$300 so far. Sounds like good news, right?

:::check
Q: With only those two numbers (planned \$400, spent \$300), what can you conclude about cost performance?
* Not enough yet: you also need to know how much work was actually accomplished
- The project is \$100 under budget, so it is performing well
- The project is over budget
> Budget-vs-actual alone is misleading. EVM adds the budgeted value of the work actually done (EV), which is what separates cost performance from schedule progress.
:::

+++

EVM integrates technical scope with the time-phased budget required to complete that scope, so program planning and execution can be managed together. It answers the question a plain budget-vs-actual comparison cannot: not just what was spent, but what was actually accomplished for that money.

EVM rests on three core data elements, all measured at the same point in time:

| Term | Old name | Meaning |
|---|---|---|
| **PV**, planned value | **BCWS** | Budgeted cost of work **scheduled** to be done by now |
| **EV**, earned value | **BCWP** | **Budgeted** cost of work **actually performed** to date |
| **AC**, actual cost | **ACWP** | The actual costs incurred to date (the sum of all costs associated with the effort) |

ACWP/BCWP/BCWS are traditional terms; industry uses AC/EV/PV, the preferred terminology of the Project Management Institute College of Performance Management. Both sets are used interchangeably.

:::key
EV is the anchor. Compare EV to AC for **cost** efficiency. Compare EV to PV for **schedule** progress.
:::

+++

### The power of EV

Suppose a project plans to build four aquariums in November at \$100 each — a budget (PV) of \$400. Under a traditional, non-EV approach, the project tracks only the budget and actual expenses: by month's end, actual expenses (AC) are \$300, and the project looks \$100 under plan.

The missing variable is what work was accomplished for that \$300. Suppose only two aquariums were actually built. The budgeted value of that completed work (EV) is \$200 — two aquariums at \$100 each. The project is actually:

- **Over cost**: CV = EV − AC = 200 − 300 = **−\$100**
- **Behind schedule**: only \$200 of the \$400 planned work is done, and the project still needs to build two more aquariums even though November has passed.

Without EV, the \$100 "underrun" looked like good news. EV reveals both problems at once.

{{primer}}

:::tip
Cumulative CPI is usually stable once a project is 15–20% complete and will not change more than 10% from its value at the 20% complete point. Historically, the CPI at completion is very close to or worse than the CPI at the 15–20% complete point.
:::

+++

### EVM on government contracts

The use of EVM on a contract is a risk-based decision. Projects typically use EVM on cost-reimbursable and incentive contracts; the use of EV on LOE and time & materials contracts is discouraged.

:::tip Beyond CEBoK
Major U.S. DoD programs are required to use a formal EVM System (EVMS) above certain contract-value thresholds (roughly \$20M for EVMS application, \$100M for formal system validation), governed by the **EIA-748** standard's 32 guidelines across 5 categories (organization, planning/budgeting/scheduling, accounting, analysis/reports, revisions/data maintenance). CEBoK's testable material does not include these specific dollar thresholds or the guideline count — know that EVM compliance requirements exist and scale with contract size, but the exact figures are not exam content.
:::

:::check
Q: A project plans four aquariums at \$100 each (PV = \$400). By month end, \$300 has been spent (AC) but only two aquariums are complete. What is EV?
= 200
> EV = budgeted cost of work performed = 2 aquariums × \$100 = \$200.
:::

:::check
Q: Using the aquarium data (PV=\$400, EV=\$200, AC=\$300), what is the Cost Variance?
= -100
> CV = EV − AC = 200 − 300 = −\$100 (overrun), even though raw AC (\$300) looked under the \$400 PV.
:::

:::widget evm:::
`
    },
    {
      id: 'employing', title: 'When and why to use EVM', summary: 'Benefits, suitability, and the acquisition process',
      body: String.raw`:::primer:::
Before a contractor ever reports earned value, a lot happens in acquisition. Can you sequence it?

:::order
Q: Put the steps of EVM in the acquisition process in order.
1. The acquisition strategy decides whether EVM is required and states it in the RFP
2. The contractor's proposal supplies the WBS/OBS and BOEs
3. Contract award establishes the initial baseline
4. An Integrated Baseline Review confirms the baseline
5. Regular EV reporting tracks progress during execution
> EVM is used throughout acquisition: strategy and RFP first, then the proposal, the baseline at award, the IBR, and finally regular EV reporting during execution.
:::

+++

### Benefits

EVM can provide early warning of cost or schedule issues. It creates a clear definition of work scope and effort responsibility, and identifies problem areas for management attention across all discrete work in the project. It imposes objective measurement of cost, schedule, and technical progress, and links technical and schedule performance to cost.

+++

### When EVM is suited to a project

Projects should only employ EVM if the benefits outweigh the cost of running it. EVM is best suited for projects that:

- Have **defined deliverables**
- Are **longer in duration**
- Have **strict budget limits** or **incentive contracts**
- Have **little dependence** on other, separately-contracted efforts

EVM is **less suited** to non-deliverable work such as LOE, to projects with open-ended or undefined objectives, and to short-duration projects. Larger projects can more easily absorb the cost of running an EVMS.

The duration guideline is loose: an organization experienced with EVM can apply it cost-effectively even on a shorter effort, while one new to EVM may want a longer project until comfortable with the process. Analysts should use EVM on projects that are **at least six months** long, but guidance varies by organization.

On the contract-type side, EVM is typically used on **cost-reimbursable and incentive contracts**; using it on LOE or Time & Materials contracts is discouraged, as is reporting EV to the government on **Firm Fixed Price (FFP)** contracts (a contractor may still track EV internally on an FFP contract to manage its own risk).

+++

### EVM in the acquisition process

Although EV data collection begins once a program starts execution, EVM is used throughout acquisition:

1. The **acquisition strategy** decides whether EVM is required and states it in the RFP.
2. The contractor's proposal contains the **WBS/OBS** needed to build control accounts and the **BOEs** that feed the EV plans; source selection evaluates the contractor's proposed EVM process and experience.
3. On **contract award**, the initial baseline is established: risk is evaluated, **Management Reserve** is set aside, the resource-loaded **IMS** is baselined, and budgets are assigned to control accounts.
4. An **Integrated Baseline Review (IBR)** confirms the baseline supports program success (see the Advanced section).
5. During execution, regular EV reporting tracks progress against that baseline.

{{primer}}

:::check
Q: Which project is the best fit for EVM?
* An 18-month cost-reimbursement development effort with clearly defined deliverables
- A one-week Firm Fixed Price training class
- An open-ended Level of Effort support contract with undefined objectives
> Longer duration, defined deliverables, and a cost/incentive contract type are exactly the conditions EVM is designed for. LOE and undefined-scope work are discouraged uses.
:::

:::check
Q: Why is EV reporting to the government discouraged on Firm Fixed Price contracts?
* The source only says it is discouraged; the contractor owns all the risk on FFP and may use EV internally to mitigate it
- FFP contracts are always too small to justify an EVMS
- FFP contracts never have a WBS
> Reporting EV to the government on FFP contracts is discouraged. The contractor owns all the risk on an FFP contract and may still use EV internally as a tool to mitigate that risk.
:::`
    },
    {
      id: 'structure', title: 'WBS, control accounts, and baseline structure', summary: 'WBS/OBS/CA, PMB, CBB, MR, and the five EV data elements',
      body: String.raw`:::primer:::
The baseline that performance is measured against has some budget inside it and some deliberately held outside.

:::sort
Q: Is this budget inside the Performance Measurement Baseline (PMB) or outside it?
buckets: Inside the PMB | Outside the PMB
- Time-phased budget planned for the work packages (BCWS) = Inside the PMB
- Undistributed Budget (UB) = Inside the PMB
- Management Reserve = Outside the PMB
> The PMB includes a bucket of money called Undistributed Budget. Management Reserve is set aside over and above the PMB.
:::

+++

### Work Breakdown Structure

The **Work Breakdown Structure (WBS)** is critical to EVM: its hierarchy lets the program manage and report at different levels. A project often has more than one WBS in play:

- The **program WBS** — typically government-defined, referred to simply as "the WBS"
- The **Contractor WBS (CWBS)** — how the contractor plans and manages the work; the program WBS is always at least one level (usually several) higher than the CWBS, because it is the oversight level while the CWBS is the work management level
- The **Cost Element Structure (CES)** — used for developing the cost estimate

**Table 15.1 — Aquarium WBS sample:**

| WBS # | Description |
|---|---|
| 1.0 | Aquarium Development Program |
| 1.1 | Program Management / Systems Engineering |
| 1.2 | Design Aquarium |
| 1.3 | Develop / Integrate Aquarium |
| 1.3.1 | Material Acquisition |
| 1.3.2 | Material Integration |
| 1.3.3 | Development Documentation |
| 1.4 | Test Aquarium |
| 1.5 | Deploy Aquarium |
| 2.0 | Aquarium Maintenance Program |
| 2.1 | Maintain Environment |
| 2.2 | Replace Material |
| 2.3 | Maintain / Replace Fish Population |

+++

### Control accounts and work packages

An **Organizational Breakdown Structure (OBS)** assigns work to the organization performing it (often via Integrated Product Teams, IPTs — with an Overarching IPT and Working-level IPTs on large programs). Where the WBS and the OBS intersect, you get a **Control Account (CA)** — the natural management focal point for EVM, where actual costs are accumulated and compared to EV. A **Control Account Manager (CAM)** owns each CA: tracking and reporting EV data, analyzing metrics, managing risk, and reporting variances.

| Term | Scope | Traits |
|---|---|---|
| **Control Account** | WBS × OBS intersection, one CAM | Integration point for budget, schedule, actuals, and EV |
| **Work Package** | Detailed, short-span tasks or material items required to accomplish the CA objectives | Typically **4–6 weeks** long; specific EV technique assigned before work begins |
| **Planning Package** | Future work yet to be planned in detail as work packages | Always in the future; as time progresses, planning packages are detail planned and become work packages |

+++

### The five EV data elements

| Element | Meaning |
|---|---|
| **BCWS / PV** | Time-phased dollars planned for the work packages |
| **BCWP / EV** | Value earned by work performed to date |
| **ACWP / AC** | Actual costs incurred to date |
| **BAC** | Budget at Completion — the baseline plan for the entire effort |
| **LRE** | Latest Revised Estimate — the contractor's current best estimate of total cost at completion |

**LRE vs. EAC**: these are related but not strictly synonymous. Analysts typically use **LRE** for the **contractor's** own estimate at completion, and **EAC** for the **government's independent** assessment of the estimate at completion.

One more derived element:

$$BCWR = BAC - BCWP \quad \text{(Budgeted Cost of Work Remaining)}$$

+++

### Baseline: PMB, UB, MR, and CBB

The Performance Measurement Baseline (PMB) is the **time-phased budget plan** used to measure performance — the total baseline against which EV is tracked. It includes a bucket of money called **Undistributed Budget (UB)**:

- **Undistributed Budget (UB)**: used when a new effort is added to the contract after the work is progressing. It contains work that is associated with an activity but has not been detail planned and distributed to that activity's work packages. Most contracts strive to distribute UB within 60 days of acquiring the new funds.

**Management Reserve (MR)** is set aside by the PM **over and above** the PMB. It covers unanticipated in-scope changes and is up to the discretion of the PM to use as appropriate. Typically, a log of MR uses must be maintained and reported. The most typical MR range is **7–9%**, but it can be as low as **2–4%** for low-risk projects and cost-plus contracts or as high as **15% or more** for high-risk projects and FFP contracts.

:::tip Beyond CEBoK
Outside this source's wording: MR is generally not time-phased, and it is generally not counted in BAC. The CEBoK text does not say either.
:::

$$CBB = PMB + MR \quad \text{(Contract Budget Base)}$$

The CBB plus fee equals the total contract price.

{{primer}}

:::check
Q: MR = \$50M, PMB = \$950M. Contract Budget Base?
= 1000
> CBB = PMB + MR = 950 + 50 = 1000.
:::

:::check
Q: Where does a Control Account sit in the program structure?
* At the intersection of the WBS and the OBS, owned by one Control Account Manager
- At the top of the WBS only, with no organizational link
- Only within Undistributed Budget
> A Control Account is the crosswalk of a WBS element to an organizational element — the natural EVM management focal point.
:::

:::check
Q: BAC = \$800, BCWP = \$200. What is BCWR?
= 600
> BCWR = BAC − BCWP = 800 − 200 = 600 (planned cost of remaining work).
:::

:::check
Q: A high-risk, FFP-type effort would typically set Management Reserve toward which end of the range?
* The high end (15% or more)
- The low end (2–4%)
- MR is not used on high-risk efforts
> Higher risk and FFP-type work call for more MR (15%+); low-risk or cost-plus work can use as little as 2–4%. Typical MR is 7–9%.
:::`
    },
    {
      id: 'methods', title: 'Measuring earned value', summary: 'The five EV techniques and when to use each',
      body: String.raw`:::primer:::
Imagine a work package that is 80% done at month end. How much credit it earns depends on the technique chosen up front.

:::check
Q: A work package using the 0/100 technique is 80% complete at month end. How much value is earned?
* None yet: 100% is earned only at completion
- 80% of its budget
- 50% of its budget
> With 0/100, 100% of value is earned only at task completion and 0% until then. Under 0/100 a work package earns nothing until it is complete.
:::

+++

Performance (EV/BCWP) must be **taken when the work is accomplished** — this rule creates an interesting situation for in-process work packages, since the contractor gets full credit for entirely complete work packages and no credit for those not started; how in-process packages earn credit depends on the method chosen. Analysts pick the measurement method for each work package **up front**, before work begins, and should minimize subjectivity wherever possible.

### The five methods

- **Milestones**: best for work packages longer than **two months**. Objective milestones are set, ideally **at least one per month**; budget is divided by weighted milestone value and earned as each milestone completes. The most objective method, though not always practical.
- **Percent complete**: measured from schedule duration data or a subjective CAM/PM assessment. The **most subjective** method — use it sparingly. Appropriate for procurement tasks where pieces of a fixed total cost are incurred over several months.
- **0/100**: 100% of value is earned only at task completion, 0% until then. Best for very **short** work packages, preferably less than one month, and for packages in which all costs are not incurred until the end, even if the task spans more than one month — e.g., a procurement item earned when purchased, a one-day meeting, or a trip.
- **50/50 (or X%/Y%)**: for packages of **two months or less** with **no intermediate milestones**. X% (default 50%) is earned at task start, the remainder at task end.
- **Level of Effort (LOE)**: performance is planned and **earned using a straight-line approach — EV always equals PV** for the period. Performance always equals the scheduled amount, so **schedule variances should not occur**. **CV can still occur** if actual costs are higher than expected. LOE is primarily reserved for more time-related work than output-oriented (e.g., for tasks that have no measurable output). Since LOE does not show schedule variances, it should **not** be used for any task with a schedule that might slip or be variable in duration, or for any task with defined deliverables (there is a basis for measuring performance other than time).

:::widget ev-method:::

{{primer}}

+++

### Worked example

For WBS 1.1 Program Management, WBS 1.2 Design, and WBS 1.5.X Deployment to Site A:

- **Program Management**: usually **LOE** — though if specific deliverables are defined for the PM staff, milestones can work too.
- **Design**: a large task, usually split into smaller work packages; **milestone/weighted milestone** is most common (design reviews, component completions), with **percent complete** valid if no interim milestones exist.
- **Deployment to Site A**: **0/100** if deployment fits within a month, **50/50** if it spans two to three months, or **milestones** if deployment is a checklist of discrete activities or a large, long effort.

:::check
Q: A work package is a one-day kickoff meeting. Which EV technique fits best?
* 0/100
- Milestones
- Level of Effort
> Very short tasks with no interim measurable progress earn 100% at completion — 0/100.
:::

:::check
Q: Why can Level of Effort generate a Cost Variance but not a Schedule Variance?
* LOE earns EV equal to PV (so schedule variances should not occur), but AC can still differ from that EV, producing CV
- LOE always overruns
- LOE is not allowed to report CV or SV at all
> With LOE, performance always equals the scheduled amount, so schedule variances should not occur — but cost variance can occur if actual costs are higher than expected.
:::

:::check
Q: An 8-week work package has no natural interim milestones. Best EV technique?
* 50/50 or another X%/Y% split
- 0/100
- Percent complete only
> About two months or less with no intermediate milestones is the textbook case for a 50/50 (or other X/Y) split.
:::`
    },
    {
      id: 'variances', title: 'Variances and performance indices', summary: 'CV, SV, CPI, SPI — diagnosis of cost and schedule health',
      body: String.raw`:::primer:::
CPI and SPI are ratios, and for each one a value above 1.0 means something different from a value below 1.0.

:::sort
Q: Is each reading good news or bad news for the program?
buckets: Favorable | Unfavorable
- CPI = 1.15 = Favorable
- SPI = 0.85 = Unfavorable
- CV = -50 = Unfavorable
- SV = +30 = Favorable
- CPI = 0.90 = Unfavorable
- SPI = 1.10 = Favorable
> Positive variances and indices above 1.0 are favorable (under budget, ahead of schedule); negative variances and indices below 1.0 are unfavorable.
:::

+++

The two **variances** tell you the dollar magnitude of a problem. The two **indices** tell you the **efficiency rate**.

### Variances (dollars)

$$CV = EV - AC \quad \text{(Cost Variance)}$$
$$SV = EV - PV \quad \text{(Schedule Variance)}$$

- **CV < 0**: over cost (overspending)
- **SV < 0**: behind schedule (in dollar terms) — note SV does **not** directly translate into a time delay unless the affected tasks sit on the critical path
- **Positive is good, negative is bad** — same sign convention as VAC

:::key Memory hook
**EV always comes first.** CV = EV minus AC (cost). SV = EV minus PV (schedule).
:::

+++

### Indices (efficiency rates)

$$CPI = \frac{EV}{AC} \quad \text{(Cost Performance Index)}$$
$$SPI = \frac{EV}{PV} \quad \text{(Schedule Performance Index)}$$

- **CPI = 1.0**: on budget. **CPI < 1.0**: overrun. **CPI > 1.0**: under budget (favorable). A CPI of 0.9 means 90 cents of work is earned for every dollar spent.
- **SPI = 1.0**: on schedule. **SPI < 1.0**: behind. **SPI > 1.0**: ahead (favorable).
- Cost estimators also use the **reciprocal of CPI** (1/CPI): the cost incurred for each dollar of value.

**Cumulative vs. current-period indices**: always examine both. Cumulative smooths noise; current-period spots emerging trends. Plot CPI and SPI together to see how schedule deviations affect cost, and vice versa.

{{primer}}

+++

### Percent complete and percent spent

$$\%\text{Planned} = \frac{PV}{BAC} \quad \%\text{Complete} = \frac{EV}{BAC} \quad \%\text{Spent} = \frac{AC}{BAC}$$

If % Spent is much greater than % Complete, the project is significantly overrunning its cost budget. If % Planned is much greater than % Complete, the project is significantly behind schedule.

:::example Secondary practice example
- PV = \$400K, EV = \$350K, AC = \$420K
- CV = 350 − 420 = −70 (overspent by \$70K)
- SV = 350 − 400 = −50 (schedule worth \$50K behind)
- CPI = 350/420 = 0.833 (\$0.83 earned per \$1 spent)
- SPI = 350/400 = 0.875 (87.5% rate of planned work)

This data set is internally consistent and useful for practice, but the aquarium PV/EV/AC = 400/200/300 example from the previous section is CEBoK's own worked example — treat that one as primary.
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
      id: 'pastperf', title: 'Analyzing past performance', summary: 'Variance percentages, quick-healing spikes, MR trends, the aquarium percentages',
      body: String.raw`:::primer:::
EV data is not always trustworthy at face value. Sometimes a problem seems to fix itself in a single month.

:::check
Q: A 0/100 work package spans three months. What will its cost variance (CV) look like?
* Worsening for the first two months, then suddenly healing in month three
- Steady and near zero in all three months
- Improving a little each month
> Under 0/100, costs are incurred but no credit is taken for two months, so CV worsens. When full credit is taken in month three, the CV heals at once.
:::

+++

CV, SV, and VAC are the derived elements most commonly used to assess program status. Look at **cumulative** data to review performance to date, and **current-period** data to spot anomalies, errors, and unusual recent activity. Plot the trend: is the variance getting worse, better, or fluctuating around zero?

### Variance percentages

Analysts usually judge variances as **percentages** rather than raw dollars, since percentages account for program size. **Variances over 10% are considered significant** and warrant examination.

$$CV\% = \frac{CV}{BCWP} = 1 - \frac{1}{CPI} \qquad SV\% = \frac{SV}{BCWS} = SPI - 1$$

+++

### Quick-healing spikes

A **quick-healing spike** — where the EV metrics suddenly jump back to on-cost and on-schedule — can indicate a **rebaseline** has occurred. SVs are especially prone to fluctuating spikes: a month-boundary crossing (material expected Oct 27 arriving Nov 3) can create a large unfavorable SV one month and a healing SV the next, without real project impact. CVs can spike too, particularly from a poorly-chosen measurement technique: a 0/100 task spanning three months will show a worsening CV for the first two months (costs incurred, no credit taken) and then suddenly heal in month three when full credit is taken.

Perfect EV data with no variances at all is improbable — it usually signals a rebaseline or EV data that doesn't reflect real progress.

{{primer}}

+++

### Management Reserve trends

Programs should **not** use MR to cover unfavorable cost variances. Any use of MR to offset or heal a cost growth overrun should be preceded by an examination of the course of action, including discussions between the government and the contractor, if applicable. There are several good reasons to use MR to heal cost overruns:

- If a contract is **cost plus, near completion, or the risk is low**: the MR balance is used to cover a cost overrun, because it makes sense to use funds in hand rather than add dollars for the cost overrun and then reduce dollars for unused MR.
- If a contract is **cost plus and the MR balance is more than sufficient** for remaining contract work: MR is used to cover a small scope increase change, because the cost and time involved in processing an Engineering Change Proposal (ECP) is prohibitive.
- If a contract is **FFP and cost overrun is eating profit**: MR can be used to offset the overrun so that profit reports reflect the estimate of true profit at completion.

Graphing SV, CV, and MR balance together shows how MR use tracks with performance; comparing **% MR remaining** to **% PMB remaining** is a useful unit-free check.

+++

### The three percentages, worked

Returning to the aquarium example (BCWS=\$400, BCWP=\$200, ACWP=\$300, BAC=\$800, LRE=\$1000):

$$\%\text{Spent} = \frac{ACWP}{BAC} = \frac{300}{800} = 37.5\% \qquad \%\text{Complete} = \frac{BCWP}{BAC} = \frac{200}{800} = 25\%$$

$$CPI = \frac{BCWP}{ACWP} = \frac{200}{300} = 0.67 \text{ (67 cents of value per dollar spent)}$$

Note the identities: **%Complete ÷ %Spent = CPI**, and **%Complete ÷ %Planned = SPI**. In the source's example, 50% of MR has been used to date while 25% of the work is complete. Assuming risk is even throughout, the program should be concerned because it is using MR twice as fast as it is completing work. If all of the risks fall at the beginning of the program, the MR balance might be sufficient, but analysts should not assume that risk is distributed in this manner.

:::check
Q: Variances over what threshold are generally considered significant and worth examining?
= 10 ±0
> Analysts typically treat CV% or SV% beyond ±10% as significant.
:::

:::check
Q: CPI = 0.8. What is CV% (using CV% = 1 − 1/CPI)?
= -0.25 ±0.01
> 1 − 1/0.8 = 1 − 1.25 = −0.25, i.e. a 25% unfavorable cost variance.
:::

:::check
Q: EV metrics suddenly jump back to on-cost, on-schedule after a period of poor performance. What does this "quick-healing spike" most likely indicate?
* A rebaseline has occurred
- The program genuinely fixed all its problems overnight
- A data entry error that can be ignored
> A quick healing spike, where EV metrics suddenly revert to on cost and on schedule, can indicate a rebaseline has occurred, rather than real overnight performance improvement.
:::

:::check
Q: Aquarium data: BCWP=\$200, BAC=\$800. % Complete?
= 25 ±0.5
> % Complete = BCWP/BAC = 200/800 = 25%.
:::

:::check
Q: Using MR at twice the rate that work is being completed (50% MR used, 25% complete) is a concern unless...
* Risk is known to be concentrated early in the program
- The contract is Firm Fixed Price
- The program is behind schedule
> If risks genuinely cluster early, burning MR faster than completing work can be reasonable — but analysts should not assume that distribution without evidence.
:::`
    },
    {
      id: 'anomalies', title: 'Anomalies in EV data', summary: 'Nine data patterns that flag a problem in the EVMS',
      body: String.raw`:::primer:::
Some odd-looking EV data has an innocent explanation. Some is simply wrong.

:::sort
Q: Which of these data patterns is always a mistake, and which can have a legitimate explanation?
buckets: Always a mistake | Can be explained
- BCWP or BCWS greater than BAC = Always a mistake
- BAC or EAC below zero = Always a mistake
- BCWP above zero but ACWP equal to zero = Can be explained
- ACWP above zero but BCWP equal to zero = Can be explained
- EAC above zero while BAC is zero = Can be explained
> You cannot plan or complete more than 100% of the work, and a negative BAC or EAC would imply the contractor owes money. The others usually come from lags (invoices, accounting) or contract changes not yet processed.
:::

+++

Analysts scan EV data for outliers or unusual conditions. Nine common anomalies:

1. **BCWS = BCWP = ACWP**: EVM isn't really being applied to that task. Expected for LOE (BCWS = BCWP is normal there), but ACWP is normally different — if all three match, EVM is not being applied to that task; this may be allowed, but the nature of the task should be understood and the monitoring agencies should be comfortable with not using EVM.
2. **BCWP > 0 but ACWP = 0**: over-performance, or a lag between incurring costs and their appearing in accounting (e.g., a travel claim taking 2-3 weeks to process). Can also result from a BCWP correction after a mistyped percent-complete entry.
3. **BCWP > 0 but BCWS = 0**: should never appear in **cumulative** data, since performance requires a plan. In **current-period** data it can happen if a task is behind but catching up — the BCWS was incurred in a prior month.
4. **ACWP > 0 but BCWP = 0**: costs incurred without any credited performance. Usually invoice lag, or effort performed against an incomplete task (no EV can be claimed yet).
5. **BCWP or BCWS > BAC**: a mistake — you cannot plan or complete more than 100% of the work.
6. **BAC > 0 and EAC = 0**: if ACWP is also 0, this may happen if an effort is expected to be down-scoped but the ECP or action to implement that down-scope in the EV data has not occurred. If there is ACWP, it should not be seen, unless the charges are supposed to be moved to another WBS and that change has not occurred.
7. **EAC > 0 and BAC = 0**: new work anticipated but the contract change hasn't landed yet; a contractor may load an EAC against a \$0 WBS line to capture the expected value.
8. **BCWS, BCWP, ACWP all negative**: should only occur in current-period data. It has occurred in cumulative data only when a WBS line item captures rate adjustments that ended up less than estimated. Negatives in current-month data are commonly due to error corrections and transfers of work or cost between WBS line items.
9. **BAC < 0 or EAC < 0**: should never happen — it would imply the contractor owes the government money for work performed.

:::widget evm-anomaly:::

{{primer}}

:::check
Q: Cumulative data shows BCWP > 0 but BCWS = 0 for a task. What does this indicate?
* A data problem — this should never occur in cumulative data, since performance requires a plan to measure against
- Normal behavior for LOE tasks
- The task is ahead of schedule
> Performance can only be credited against a plan. BCWP without any BCWS in cumulative data is a genuine anomaly, not a valid schedule-ahead pattern (that pattern is only acceptable in current-period data).
:::

:::check
Q: A task shows BCWS = BCWP = ACWP every period. What is this most likely to indicate?
* EVM is not really being applied to that task's actual cost/performance measurement
- The task is perfectly on cost and on schedule, which is a good sign
- The task is Level of Effort, and this is always fine
> All three metrics matching (including ACWP) suggests the task isn't really being measured with EVM. For LOE, BCWS = BCWP is expected, but ACWP normally still differs.
:::`
    },
    {
      id: 'reports', title: 'Variance Analysis Reports', summary: 'The four VAR questions, thresholds, and favorable variances',
      body: String.raw`:::primer:::
Every variance could be reported, but nobody has time to read that many reports.

:::check
Q: How is it usually decided which variances need a written Variance Analysis Report?
* Thresholds set up front, as a percentage and/or an absolute dollar amount
- Every nonzero variance gets a report
- Only variances found during the final review
> Reporting every variance is not cost-effective, so thresholds are set up front, such as -10%, \$100K, or ±10%, or ±\$100K.
:::

+++

Variance reports are critical to understanding true program status based on EV data, and should focus on how a CAM is managing the program. Thresholds are established upfront to govern the variance reporting process. Variance reports should answer four questions:

1. **Where** is the variance? What WBS number contains it, and is it primarily labor or material, etc.?
2. **What is the cause?** The issue, risk, or error resulting in the variance.
3. **What is the impact?** Both current impact (as seen in the CV/SV) and at-completion impact (as seen in the VAC or project slip).
4. **What is the Action Plan?** What actions are being taken to fix the problem, to stop the trend, or reassess the full at-completion impact if that is not known at the time the variance is reported.

+++

### Thresholds

Reporting every variance is not cost-effective, so thresholds are set up front — commonly a **percentage** and/or an **absolute dollar amount**, for example **-10%, \$100K, or ±10%, or ±\$100K**. Thresholds can tighten or loosen as a project progresses depending on where the risk sits; some programs instead use a subjective "top ten" critical task list.

Variance reporting tends to focus on unfavorable variances, but **favorable variances matter too** — they represent an opportunity to reallocate funds to accelerate schedule, fix problem areas, or add to Management Reserve.

{{primer}}

:::check
Q: What are the four questions a Variance Analysis Report should answer?
* Where, what caused it, what is the impact, and what is the action plan
- Who, what, where, and why
- Cost, schedule, technical, and risk
> A variance report identifies the WBS location, cause, current and at-completion impact, and the action plan.
:::

:::check
Q: A CV is favorable (positive) and well above the reporting threshold. Should it still be examined?
* Yes — favorable variances represent an opportunity to reallocate funds or add to MR
- No, only unfavorable variances need a VAR
- Only if it is a schedule variance, not a cost variance
> Favorable variances are opportunities, not just "no news" — they can free funds to accelerate schedule or reinforce MR.
:::`
    },
    {
      id: 'eac', title: 'Estimates at completion', summary: 'CPI and CPI×SPI forecasts, VAC, and the aquarium future-performance example',
      body: String.raw`:::primer:::
The aquarium project is over cost (CPI about 0.67) and behind schedule (SPI = 0.5). Two forecasts of its final cost are possible: one uses CPI only, the other uses CPI and SPI together.

:::check
Q: Compared with the CPI-only EAC, how will the CPI x SPI EAC come out for this project?
* Higher, because SPI below 1 raises the EAC
- Lower, because the schedule trend offsets the cost trend
- The same, because SPI does not affect cost
> The CPI x SPI forecast assumes the remaining work follows the same cost and schedule trend, so SPI < 1 raises the EAC. That is why it is usually the worst case.
:::

+++

Analysts emphasize EACs to identify cost drivers and take corrective action, ensure contract ceilings and program budgets are sufficient, and avoid overpaying progress payments. Generally, **CV at completion will not improve** on the CV identified as early as the 20% complete point — problems are rarely fully correctable after that, even with early action.

Using past performance data, one can project an independent EAC using several methods. Two common methods are the CPI forecast and the CPI-SPI forecast.

:::tip Beyond CEBoK
Good practice: compute more than one EAC and understand the assumption each embeds, rather than relying on a single formula. The CEBoK text does not state this rule.
:::

+++

### CPI forecast (best case)

$$EAC_{\text{CPI}} = AC + \frac{BCWR}{CPI} = \frac{BAC}{CPI}$$

Assumes the cumulative CPI holds constant for the rest of the program. It's called the "best case" because, historically, final CPI tends to land close to or worse than the CPI at 15-20% complete — so holding steady is actually a good outcome.

### CPI × SPI forecast (worst case)

$$EAC_{\text{CPI-SPI}} = AC + \frac{BCWR}{CPI \times SPI}$$

Assumes remaining work follows the same cost *and* schedule trend, so it costs more to also heal the schedule variance. Usually the "worst case" since most projects run behind schedule (SPI < 1 raises the EAC) — but if a project is ahead of schedule, SPI > 1 actually *lowers* this EAC, so use the best/worst labels with care.

Note: CEBoK's own text prints these formulas without parentheses around BCWR/CPI — read them as \$AC + (BCWR / CPI)\$, not \$(AC + BCWR) / CPI\$.

+++

### VAC

$$VAC = BAC - LRE$$

- VAC < 0: projected overrun. VAC > 0: projected underrun. Since VAC uses the LRE, it typically reflects the *contractor's* projection.

Government program offices should develop independent EACs that do not rely on EV data. The LRE represents the contractor's best estimate, which includes their assessment of risk and optimism and only covers what is on contract; the independent EAC can include the government's assessment of risk and optimism, plus factor in work to be put on the contract. Using the mathematically calculated EAC is useful, but technical input from the team is equally important. If the remaining work is large enough, the government EAC will be a revised cost estimate that uses traditional cost estimating techniques, and the government may do a modified form of a bottom-up estimate. When the EAC is not calculated using EV data, an EAC developed using EV data can be used as a cross-check.

:::widget eac-range:::

+++

:::example Aquarium future-performance example
Building on the aquarium example: BCWS=\$400, BCWP=\$200, ACWP=\$300, BAC=\$800, LRE=\$1000, CPI = 0.67 (carry as 2/3, not the rounded 0.67, or the results drift), SPI = 0.5.

- **Best case** (CPI forecast): \$800 / (2/3) = **\$1200**
- **Worst case** (CPI × SPI forecast): \$300 + \$600 / [(2/3)(0.5)] = 300 + 1800 = **\$2100**
- **VAC** = BAC − LRE = 800 − 1000 = **−\$200** (contractor projects a \$200 overrun)

Using the rounded CPI = 0.67 instead of 2/3 gives slightly different figures (about \$1194 and \$2091) — carry the exact fraction through the math.
:::

{{primer}}

:::check
Q: BAC=800, BCWP=200, ACWP=300, CPI = 2/3 (0.67). CPI-forecast EAC?
= 1200 ±5
> EAC = BAC/CPI = 800 / (2/3) = 1200.
:::

:::check
Q: Same data, SPI = 0.5. CPI×SPI-forecast EAC (worst case)?
= 2100 ±5
> EAC = ACWP + BCWR/(CPI×SPI) = 300 + 600/(0.667×0.5) = 300 + 1800 = 2100.
:::

:::check
Q: BAC=800, LRE=1000. What is VAC?
= -200
> VAC = BAC − LRE = 800 − 1000 = −200 (projected overrun).
:::

:::challenge evm sc=overrun bac=1000 m=14 lock=sc,bac,m
Q: At month 14 the CPI is 0.895 and BAC is \$1,000. Predict the EAC using $EAC = BAC / CPI$.
predict: eac +- 0.5%
> $1000 / 0.895 \approx 1117$. The CPI method assumes the remaining work goes at the same efficiency as the work so far.
:::`
    },
    {
      id: 'tcpi', title: 'To-complete performance index', summary: 'TCPI_BAC and TCPI_LRE — the reality check on a target',
      body: String.raw`:::primer:::
TCPI is the efficiency a program must achieve on its remaining work to hit a target. CPI is the efficiency it has achieved so far.

:::check
Q: A contractor's TCPI is below its CPI so far. What is the forecast assuming about the rest of the work?
* Productivity will decrease: the remaining work is expected to be done less efficiently
- Productivity will increase
- Nothing: TCPI and CPI cannot be compared
> If TCPI < CPI, productivity is expected to decrease going forward, so ask what is driving that and whether it can be mitigated. The more common case is TCPI > CPI.
:::

+++

The **TCPI** answers: "What efficiency must we achieve on remaining work (BCWR) to finish at a given target X?"

$$TCPI_{\text{BAC}} = \frac{BCWR}{BAC - AC} \qquad TCPI_{\text{LRE}} = \frac{BCWR}{LRE - AC}$$

**TCPI_BAC** is the performance needed to hit the original budget. **TCPI_LRE** is analyzed more often, since it reflects the contractor's own position on future performance.

### Reading TCPI against CPI

- If **TCPI < CPI**: productivity is expected to *decrease* going forward — ask what's driving that and whether it can be mitigated.
- If **TCPI > CPI** (the more common case): productivity is expected to *increase*. As a rule of thumb, a **TCPI more than 5% above cumulative CPI** is considered optimistic and needs further examination — ask whether the assumed improvement is realistic or overly rosy.

**Other future performance considerations:**

- Does ACWP exceed either the BAC or LRE? Usually it does not unless task completion is drawing near, and then it happens frequently. Another possibility is an ECP that is in progress but not yet on contract; if percent complete is less than 80%, an analyst should establish whether the effect is due to an unprocessed ECP or if it is all attributed to overrun.
- Does ACWP exceed LRE? ACWP exceeding BAC occurs more often than ACWP exceeding LRE when the LRE is maintained on a reasonable basis. Due to the lag of getting estimates incorporated into the EVMS, ACWP exceeding LRE does occur often. Analysts should consider whether the forecast needs updating or whether an ECP is expected.

{{primer}}

+++

:::key
TCPI_LRE is analyzed more than other TCPI indices because it reflects the contractor's position regarding future performance. Compare "future performance required" (TCPI) to "past performance achieved" (CPI).
:::

:::example Aquarium example — is the LRE reasonable?
BCWR = BAC − BCWP = 800 − 200 = 600. LRE = 1000, ACWP = 300, CPI = 0.67 (2/3).

$$TCPI_{\text{LRE}} = \frac{600}{1000-300} = \frac{600}{700} = 0.86$$

TCPI_LRE (0.86) is more than 5% above CPI (0.67) — **the LRE may not be reasonable**. The analyst should investigate what's expected to drive such a large jump in performance, and whether the contractor's plan to improve that drastically is credible.
:::

+++

:::check
Q: BAC=800, BCWP=200, ACWP=300. TCPI to BAC?
= 1.2 ±0.01
> TCPI_BAC = BCWR/(BAC-AC) = (800-200)/(800-300) = 600/500 = 1.2.
:::

:::check
Q: BCWR=600, LRE=1000, ACWP=300. TCPI to LRE? (2 decimals)
= 0.86 ±0.01
> TCPI_LRE = 600/(1000-300) = 600/700 = 0.86.
:::

:::check
Q: TCPI_LRE = 0.86, CPI = 0.67. Is the LRE realistic?
* No — TCPI_LRE is more than 5% above CPI, which is optimistic and should be scrutinized
- Yes — TCPI is below 1.0 so it is achievable
- Yes — TCPI and CPI are close enough
> The rule of thumb flags a TCPI more than ~5% above achieved CPI as requiring justification; a 0.19 gap here is well beyond that.
:::

:::challenge evm sc=overrun bac=1000 m=10 lock=sc,bac,m
Q: At month 10, compare the TCPI (to finish on BAC) with the CPI so far. Is finishing on budget realistic?
* No: TCPI is well above CPI
- Yes: TCPI is below CPI
- Yes: TCPI and CPI are about equal
> TCPI is 1.083 against a CPI of 0.925 — more than the ~5% rule-of-thumb gap. Hitting the original budget would require remaining work to run meaningfully more efficiently than anything achieved so far.
:::`
    },
    {
      id: 'summary', title: 'Summary and testable topics', summary: 'EVM benefits recap and what CEBoK actually tests',
      body: String.raw`:::primer:::
EVM comes with formulas, reports, and baselines. Which of those is the "real key" to making it work?

:::check
Q: According to the module, what is the real key to a successful EVMS?
* The partnership and dialogue it opens between government and contractor
- Having the largest number of formulas available to analysts
- Strict penalties for every unfavorable variance
> The real key is the partnership and dialogue EVM opens between government and contractor, giving everyone on a project a sense of ownership in its success.
:::

+++

### Why programs use EVM

- Improved planning
- A clear definition of work before beginning work
- Quick and early problem identification
- Reduced cost and schedule risks
- Reduced propensity to add work without adding budget (i.e., out of scope changes)
- Objective performance measurement
- True cost and schedule condition metrics
- Accurate forecasting of cost to complete
- Repeatable performance and lessons learned data
- Sound data to justify requesting resources

The real key to a successful EVMS is the **partnership and dialogue** it opens between government and contractor — EVM gives everyone on a project a sense of ownership in its success.

{{primer}}

+++

### Testable topics

CEBoK's own testable-topics table for this module is blunt:

| Testable | Testable, less emphasized | Not testable |
|---|---|---|
| **DAU Gold Card formulas and definitions** | — | Related and Advanced topics |

In practice: know **PV/EV/AC, CV/SV, CPI/SPI, EAC (CPI and CPI×SPI forecasts), VAC, BCWR, TCPI, the percentages, EV measurement methods, WBS/control account structure, and PMB/MR/CBB** cold. The Gold Card (Advanced section), IBR, baseline-integrity problems (rubber/front-loaded/out-of-date baselines, OTB), rebaselining math, Earned Schedule/IMS integration, advanced EAC variants, and the general guidelines list are useful background but **not** CEBoK-testable in detail.

:::check
Q: Per CEBoK's own Testable Topics table, what is explicitly listed as testable?
* DAU Gold Card formulas and definitions
- The full Integrated Baseline Review process
- Earned Schedule and SPI(t)
> CEBoK states plainly: testable content is the DAU Gold Card's formulas and definitions; Related and Advanced topics are not testable.
:::

:::check
Q: Which of these is explicitly called out as NOT testable per CEBoK?
* Rubber baselining, front-loaded baselines, and Earned Schedule
- CPI and SPI formulas
- The EV measurement methods (milestones, 0/100, 50/50, LOE)
> CEBoK's Related and Advanced Topics section — covering the Gold Card detail, IBR, baseline problems, OTB, and Earned Schedule/IMS — is explicitly marked not testable.
:::`
    },
    {
      id: 'advanced', title: 'Advanced (not testable per CEBoK)', summary: 'Gold card, IBR, baseline problems, OTB, Earned Schedule/IMS, advanced EACs, guidelines',
      body: String.raw`:::primer:::
A program is finishing months late, yet its schedule index may not show it.

:::check
Q: On a program finishing months late, what happens to the dollar-based SPI as BCWP approaches BAC?
* It drifts toward 1.0, which hides the lateness
- It keeps falling toward 0
- It rises above 1.0
> SV and SPI measure schedule in dollars, not time, and both converge toward zero and 1.0 as BCWP approaches BAC, even on a program finishing months late. Earned Schedule fixes this.
:::

+++

This section covers CEBoK's "Related and Advanced Topics" — useful background, but explicitly **not testable** per the module's own Testable Topics table. Checks here are light and clearly labeled.

### EVM Gold Card

The Defense Acquisition University (DAU) **EVM Gold Card** summarizes important EV information on one small card.

+++

### Integrated Baseline Review (IBR)

An IBR is a joint government/contractor review, held **shortly after contract award** (and after any major re-baseline), to verify the technical content of the PMB and the sufficiency of the related budgets and schedules. Among its objectives:

- Confirm control-account technical content matches the contract scope/SOW and WBS
- Confirm the PMB is complete and captures all work scope
- Assess resource availability and the validity of control-account budgets (via the BOEs)
- Build mutual understanding of the cost/schedule management process, and of what's behind the contractor's performance reports

An IBR is best viewed as a **continuing process**, not a one-time event — follow-on IBRs occur after major program events like a re-plan, rebaseline, or Over Target Baseline.

+++

### Baseline problems

- **Rubber baselining**: a baseline that changes too frequently, typically by pushing near-term work further out — masking schedule and cost variances early on until they're expensive to fix.
- **Front-loaded baseline**: too much budget and insufficient work planned in the early months, so the budget for later months is insufficient to complete that work — also masking cost variances until later.
- **Out-of-date baseline**: legitimate baseline changes haven't been made in a timely fashion, so performance is measured against a baseline that no longer represents reality, over- or under-stating variances.

Every baseline will need change at some point. Baseline **changes** usually occur at least once a quarter, due to the addition of new work to the contract or use of MR. Frequently a baseline will be significantly revamped, or rebaselined, at least once during a project's life, usually as the result of a major ECP or project change. Valid reasons to rebaseline include the addition of major new work, project scope changes directed by the customer, or a technical breakthrough or new approach to solving a problem. Rebaselining **to eliminate a large variance** should be avoided.

An **Over Target Baseline (OTB)** is a rebaseline specifically negotiated to heal cost and schedule variances — for example when small amounts of related, unfunded additional work accumulate variances over time, or when an overrun becomes so extreme it obscures the ability to see new, still-controllable trends.

+++

### Rebaseline example

A program rebaselines after completing \$100 of work (Jan: BCWS=BCWP=ACWP=\$100). Six months later (July, cumulative): BCWS=\$150, BCWP=\$145, ACWP=\$150.

$$\text{Cumulative: } CPI = \frac{145}{150} = 0.97 \quad SPI = \frac{145}{150} = 0.97$$

That 3% variance looks fine — but performance **since the rebaseline** tells a different story:

$$\text{Since rebaseline: } BCWS = 150-100=50,\ BCWP=145-100=45,\ ACWP=150-100=50$$
$$CPI = \frac{45}{50} = 0.9 \quad SPI = \frac{45}{50} = 0.9$$

A -10% variance since the rebaseline, hidden by the larger cumulative base. Cumulative data after a rebaseline dilutes recent performance — always also compute since-rebaseline figures.

:::widget rebaseline:::

+++

### Slip

**Slip** approximates the time impact of a schedule variance: cumulative SV divided by the average current-period BCWS (commonly a 3-month average, though 6-month, project-inception, or current-BCWS-only variants exist). It's flawed — it assumes similar future performance, that make-up time equals original plan time, and that the SV is time-related (a labor-driven SV heals differently than a material-driven one). It also inflates as BCWS shrinks near project completion.

+++

### Earned Schedule and the IMS

EVM's SV/SPI measure schedule in **dollars**, not time, and both converge toward zero/1.0 as BCWP approaches BAC — even on a program finishing months late. **Earned Schedule (ES)** fixes this: the point in time on the cumulative PV curve where the current EV intersects.

$$ES_{\text{cum}} = C + I, \quad I = \frac{EV - PV_C}{PV_{C+1} - PV_C}$$

where C is the number of whole periods where EV ≥ PV, and PV_C is PV at period C (note: CEBoK's own printed formula omits some parentheses around the denominator — read it as shown here).

$$SV(t) = ES - AT \qquad SPI(t) = \frac{ES}{AT}$$

:::example Practice (not from the CEBoK aquarium data set)
AT = 6 months elapsed, cumulative EV = \$600K, which corresponds to \$600K planned at month 4.5 on the PV curve (ES = 4.5).

SPI(t) = 4.5 / 6 = **0.75** — 25% behind schedule in time, a figure that stays meaningful even near completion, unlike dollar-based SPI.
:::

{{primer}}

+++

### Advanced EAC variants

- $EAC = ACWP + BCWR$ — only as good as the integrity of the BCWR estimate itself
- $EAC = ACWP + BCWR/(0.8\,CPI + 0.2\,SPI)$ — a weighted CPI/SPI blend, often used late in a contract
- A general $X\%\,CPI + Y\%\,SPI$ blend, X+Y=100%, justified case by case
- CPI-forecast variants using 3-month, 6-month, or current-month CPI (current-month is very volatile) in place of cumulative CPI
- Linear regression on ACWP vs. BCWP data (doesn't assume a rate change) or regressions at percent-complete intervals against a physical-progress measure

+++

### General guidelines

**Cost**: cumulative CPI is usually stable by 15-20% complete and won't change more than 10% from its value at the 20%-complete point; percent overrun at completion won't be less than percent overrun at 15% complete; subcontracts statistically overrun more (in percentage terms) than the prime.

**Schedule**: cumulative SPI is usually stable by 15-20% complete; early SVs typically lead to later CVs, since managers respond to schedule slip by adding resources/overtime; SV is self-healing as percent complete nears 100%, so place less emphasis on it past ~80% complete; software-heavy programs typically run further behind than non-software programs.

:::check
Q: (Not testable per CEBoK) What is the primary purpose of an Integrated Baseline Review?
* Verify the technical content of the PMB and the sufficiency of the related budgets and schedules
- Audit the contractor's accounting system
- Approve the contractor's fee
> An IBR verifies the technical content of the PMB and the sufficiency of the related budgets and schedules — not an audit or a fee approval.
:::

:::check
Q: (Not testable per CEBoK) A "front-loaded" baseline problem specifically means...
* Too much budget and too little planned work in the early months, leaving later months underbudgeted
- Aggressive early claiming of EV beyond what was actually earned
- A baseline that hasn't been updated in a long time
> Front-loading is a budget-vs-work-planned mismatch across the schedule, distinct from rubber baselining (baseline changed so often that near-term planned work keeps sliding out) or an out-of-date baseline (stale change control).
:::

:::check
Q: (Not testable per CEBoK) Since a rebaseline, cumulative CPI/SPI look fine (0.97) but the since-rebaseline figures are worse (0.9). Why the difference?
* Cumulative data mixes the pre-rebaseline period (reset to on-plan) with recent performance, diluting recent variances
- The since-rebaseline math is wrong; cumulative is always more accurate
- SPI cannot be computed after a rebaseline
> Because EV data is cumulative, recent variances get averaged against a larger base after a rebaseline, minimizing their apparent size — hence the need to also compute performance since the rebaseline specifically.
:::`
    }
  ],
  cards: String.raw`
## Fundamentals
Q: What problem does EVM solve that budget-vs-actual alone cannot?
A: EVM separates cost efficiency from schedule progress by measuring the budgeted value of work actually completed (EV), not just the dollars spent.
Q: BCWS / PV definition
A: Planned Value: the time-phased budgeted cost of work scheduled to be done by a given date.
R: yes
Q: BCWP / EV definition
A: Earned Value: the budgeted cost of work actually performed to date.
R: yes
Q: ACWP / AC definition
A: Actual Cost of Work Performed: the actual costs incurred to date (the sum of all costs associated with the effort).
R: yes
Q: BAC definition
A: Budget at Completion: the baseline plan for the entire effort (the sum of all planned work).
R: yes
Q: LRE vs. EAC
A: LRE is the contractor's own latest revised estimate at completion; EAC generally refers to the government's independent estimate at completion. Related, not strictly synonymous.
Q: Why is EV called the "anchor" in EVM?
A: EV is compared to AC for cost efficiency and to PV for schedule progress; both variances and indices pivot on EV.
Q: Aquarium intro example (CEBoK's primary worked example)
A: PV=\$400, EV=\$200, AC=\$300 (only 2 of 4 planned aquariums built): CV = 200-300 = -\$100, even though raw spend (\$300) looked under the \$400 plan.
Q: EVM benefits over simple budget tracking
A: Improved planning; clear definition of work before beginning work; quick and early problem identification; reduced cost and schedule risks; reduced propensity to add work without adding budget; objective performance measurement; true cost and schedule condition metrics; accurate forecasting of cost to complete; repeatable performance and lessons learned data; sound data to justify requesting resources.
Q: When is EVM best suited to a project?
A: Defined deliverables, longer duration (at least six months, guidance varies by organization), strict budget limits or incentive contracts, little dependence on separately-contracted efforts.
Q: When is EVM discouraged?
A: Non-deliverable work like LOE, open-ended/undefined-objective projects, short-duration efforts; reporting EV to the government is discouraged on FFP contracts (contractor may still track internally).

## WBS, OBS, and Control Accounts
Q: WBS role in EVM
A: The Work Breakdown Structure decomposes technical scope; the program WBS is typically government-defined, and is always at least one level (usually several) higher than the Contractor WBS (CWBS), because it is the oversight level.
Q: CWBS definition
A: Contractor WBS: how the contractor plans and manages the work; the work management level, at least one level (usually several) below the program WBS.
R: yes
Q: CES definition
A: Cost Element Structure: the structure used for developing the cost estimate; level of detail varies by who develops it.
R: yes
Q: OBS definition
A: Organizational Breakdown Structure: assigns work to the performing organization, similar in structure to a WBS but organized by function.
R: yes
Q: Control Account definition
A: The management control point where WBS and OBS intersect; budgets, schedules, actuals, and EV are integrated here, managed by a CAM.
R: yes
Q: Work Package duration guideline
A: Detailed, short-span tasks or material items, typically 4-6 weeks long, required to accomplish the control account objectives; a specific EV technique is assigned before work begins.
R: yes
Q: Planning Package definition
A: Future work yet to be planned in detail as work packages; always in the future. As time progresses, planning packages are detail planned and become work packages.
R: yes

## Data Elements and Baseline
Q: BCWR definition and formula
A: Budgeted Cost of Work Remaining: BCWR = BAC - BCWP, the planned cost of all work left to do.
R: yes
Q: PMB formula
A: The time-phased budget plan, the total baseline against which EV is tracked; it includes a bucket of money called Undistributed Budget (UB).
R: yes
Q: CBB formula
A: CBB = PMB + Management Reserve.
R: yes
Q: Management Reserve definition
A: Budget set aside by the PM over and above the PMB to cover unanticipated in-scope changes, at the PM's discretion; a log of MR uses must typically be maintained and reported.
R: yes
Q: Management Reserve typical ranges
A: Typically 7-9%; as low as 2-4% for low-risk projects or cost-plus contracts; 15% or more for high-risk projects or FFP contracts.
Q: Undistributed Budget definition
A: Budget used when a new effort is added to the contract after work is progressing; it contains work associated with an activity but not yet detail planned and distributed to that activity's work packages. Most contracts strive to distribute UB within 60 days of acquiring the new funds.
R: yes

## EV Measurement Methods
Q: EV technique: Milestones
A: Best for work packages over two months; objective milestones (ideally at least one per month) with weighted budget earned as each completes. Most objective method.
R: yes
Q: EV technique: Percent Complete
A: Most subjective method - use sparingly; appropriate for procurement-type tasks where a fixed total cost is incurred over several months.
R: yes
Q: EV technique: 0/100
A: 100% earned only at completion. Best for very short work packages, preferably less than one month, and packages in which all costs are not incurred until the end, even if the task spans more than one month (procurement purchases, one-day meetings, trips).
R: yes
Q: EV technique: 50/50 (or X%/Y%)
A: Best for packages of two months or less with no intermediate milestones; X% earned at start, remainder at end.
R: yes
Q: EV technique: Level of Effort (LOE)
A: Performance planned and earned on a straight-line basis, EV always equals PV (so schedule variances should not occur), but CV can still occur if actual costs are higher than expected. Primarily reserved for time-related work rather than output-oriented work (e.g., tasks with no measurable output); not for tasks with defined deliverables or a schedule that might slip or be variable in duration.
R: yes
Q: Why can LOE still generate a Cost Variance despite never generating a Schedule Variance?
A: Performance always equals the scheduled amount, so schedule variances should not occur; but AC is determined by actual spending, so CV = EV - AC can still occur if actual costs are higher than expected.

## Variances and Indices
Q: Cost Variance formula
A: CV = EV − AC (negative = overrun)
R: yes
Q: Schedule Variance formula
A: SV = EV − PV (negative = behind schedule in dollar terms; doesn't directly imply a time delay unless the task is on the critical path)
R: yes
Q: Memory hook for CV and SV
A: EV always comes first. CV = EV minus AC (cost). SV = EV minus PV (schedule).
Q: CV sign convention
A: Positive (EV > AC) = good (under cost). Negative (EV < AC) = bad (over cost).
Q: SV sign convention
A: Positive (EV > PV) = good (ahead). Negative (EV < PV) = bad (behind).
Q: CV% formula (identity form)
A: CV% = CV/BCWP = 1 - 1/CPI
R: yes
Q: SV% formula (identity form)
A: SV% = SV/BCWS = SPI - 1
R: yes
Q: % Planned formula
A: % Planned = BCWS/BAC (= PV/BAC)
R: yes
Q: Percent Complete formula
A: % Complete = BCWP/BAC (= EV/BAC)
R: yes
Q: Percent Spent formula
A: % Spent = ACWP/BAC (= AC/BAC)
R: yes
Q: Identity: % Complete / % Spent
A: Equals CPI.
Q: Identity: % Complete / % Planned
A: Equals SPI.
Q: Diagnostic: if % Spent > % Complete
A: If % Spent is much greater than % Complete, the project is significantly overrunning its cost budget.
Q: CPI definition and formula
A: Cost Performance Index = EV / AC. Dollars of value earned per dollar spent. CPI < 1.0 = overrun, CPI > 1.0 = under budget.
R: yes
Q: SPI definition and formula
A: Schedule Performance Index = EV / PV. Rate of work accomplishment vs. plan. SPI < 1.0 = behind, SPI > 1.0 = ahead.
R: yes
Q: CPI stability rule
A: Cumulative CPI is usually stable once a project is 15-20% complete and will not change more than 10% from its value at the 20% complete point; historically the CPI at completion is very close to or worse than the CPI at 15-20% complete.
Q: Variance significance threshold
A: Variances (CV% or SV%) exceeding about 10% are considered significant and warrant examination.
Q: Quick-healing spike
A: EV metrics suddenly reverting to on-cost/on-schedule after poor performance - can indicate a rebaseline has occurred.
R: yes
Q: Aquarium percentages worked example
A: %Spent = 300/800 = 37.5%, %Complete = 200/800 = 25%, CPI = 200/300 = 0.67. Using MR twice as fast as completing work (50% MR used vs 25% complete) is a concern unless risk is known to cluster early.

## Anomalies
Q: Anomaly: BCWS = BCWP = ACWP every period
A: Indicates EVM is not really being applied to that task (expected BCWS=BCWP for LOE, but ACWP usually differs).
Q: Anomaly: BCWP > 0 but ACWP = 0
A: Over-performance, or a lag between incurring costs and their appearing in accounting (e.g., a delayed travel claim).
Q: Anomaly: BCWP > 0 but BCWS = 0
A: Should never occur in cumulative data (performance requires a plan); can occur in current-period data if a behind task is catching up.
Q: Anomaly: ACWP > 0 but BCWP = 0
A: Costs incurred without credited performance - invoice lag, or effort against an incomplete task where EV can't yet be claimed.
Q: Anomaly: BCWP or BCWS > BAC
A: A mistake - you cannot plan or complete more than 100% of the work.
Q: Anomaly: BAC > 0 and EAC = 0
A: If ACWP is also 0, an effort is expected to be down-scoped but the ECP or action implementing it in the EV data has not occurred. If there is ACWP, it should not be seen, unless charges are supposed to be moved to another WBS and that has not occurred.
Q: Anomaly: EAC > 0 and BAC = 0
A: New work anticipated but the contract change hasn't landed in the EVMS yet.
Q: Anomaly: BCWS, BCWP, ACWP all negative
A: Should only occur in current-period data. In cumulative data it has occurred only when a WBS line item captures rate adjustments that ended up less than estimated. In current-month data it is commonly error corrections and transfers of work or cost between WBS line items.
Q: Anomaly: BAC < 0 or EAC < 0
A: Should never happen - would imply the contractor owes the government money for work performed.

## Variance Analysis Reports
Q: Variance Analysis Report (VAR) - four questions
A: Where is the variance (WBS number; labor or material)? What is the cause? What is the impact (current and at-completion)? What is the Action Plan?
R: yes
Q: Variance threshold examples
A: Common patterns: -10%, \$100K, or +/-10%, or +/-\$100K - set up front so not every variance requires a report.
Q: Why review favorable variances too?
A: They represent opportunities to reallocate funds to accelerate schedule, fix problems, or add to Management Reserve - not just "no news."

## Estimates at Completion
Q: EAC general formula
A: Using past performance data, an independent EAC can be projected by several methods; two common ones are the CPI forecast (EAC = ACWP + BCWR/CPI = BAC/CPI) and the CPI-SPI forecast (EAC = ACWP + BCWR/(CPI*SPI)).
R: yes
Q: CPI forecast (best case) formula
A: EAC = AC + BCWR/CPI = BAC/CPI. Assumes cumulative CPI holds constant for the rest of the program.
R: yes
Q: Why is the CPI forecast called "best case" if it assumes no improvement?
A: Because historically final CPI tends to land close to or worse than CPI at 15-20% complete, so holding steady is actually a favorable outcome.
Q: CPI x SPI forecast (worst case) formula
A: EAC = AC + BCWR/(CPI x SPI). Assumes remaining work follows both the cost and schedule trend; usually more pessimistic since most programs run behind schedule (though SPI>1 would lower it).
R: yes
Q: VAC formula and meaning
A: VAC = BAC - LRE. Positive = projected underrun (good). Negative = projected overrun (bad); reflects the contractor's own projection since it uses LRE.
R: yes
Q: Why compute an EAC independent of EV data?
A: Government offices should develop independent EACs that do not rely on EV data; the LRE reflects the contractor's risk and optimism and covers only what is on contract. Technical input is equally important, and the government may do a modified bottom-up estimate. An EV-based EAC can be a cross-check.
Q: Aquarium best-case and worst-case EAC
A: Best case (CPI forecast) = 800/(2/3) = \$1200. Worst case (CPI x SPI forecast, SPI=0.5) = 300 + 600/((2/3)(0.5)) = \$2100. Use the exact fraction 2/3, not rounded 0.67, or results drift slightly.

## To-Complete Performance Index
Q: TCPI_BAC formula
A: BCWR / (BAC - AC). Efficiency required on remaining work to finish at the original budget.
R: yes
Q: TCPI_LRE formula
A: BCWR / (LRE - AC). Efficiency required to finish at the contractor's current LRE estimate; analyzed more often than TCPI_BAC.
R: yes
Q: TCPI vs. CPI - 5% rule
A: A TCPI more than about 5% above the cumulative CPI achieved to date is considered optimistic and requires further examination.
Q: TCPI lower than CPI - what does it mean?
A: Productivity is expected to decrease going forward; ask what events are expected to reduce performance and whether they can be mitigated.
Q: Aquarium TCPI_LRE worked example
A: BCWR=600, LRE=1000, ACWP=300: TCPI_LRE = 600/700 = 0.86, vs CPI = 0.67 - more than 5% above, so the LRE may not be reasonable.

## Testable Topics
Q: CEBoK's Testable Topics table for this module
A: Testable = DAU Gold Card formulas and definitions. Not testable = Related and Advanced Topics (Gold Card detail, IBR, baseline problems, OTB, rebaselining, Earned Schedule/IMS, advanced EACs, general guidelines).

## Advanced (not testable per CEBoK)
Q: Rubber baselining
A: (Not testable) A baseline changed too frequently, typically pushing near-term work out further, masking schedule/cost variances until they're expensive to fix.
R: yes
Q: Front-loaded baseline
A: (Not testable) Too much budget and too little planned work in the early months, leaving later months underbudgeted - masks cost variances until later, distinct from aggressive early EV claiming.
R: yes
Q: Out-of-date baseline
A: (Not testable) Legitimate baseline changes not made in a timely fashion, so performance is measured against a baseline that no longer reflects reality.
R: yes
Q: Over Target Baseline (OTB)
A: (Not testable) A rebaseline specifically negotiated to heal accumulated cost/schedule variances, e.g. from unfunded related work or an overrun so large it obscures new, controllable trends.
R: yes
Q: Rebaseline example: cumulative vs. since-rebaseline indices
A: (Not testable) Cumulative CPI/SPI can look fine (0.97) shortly after a rebaseline while since-rebaseline performance is worse (0.9) - cumulative data dilutes recent variances against the larger base.
Q: Slip definition
A: (Not testable) Cumulative SV divided by average current-period BCWS (often a 3-month average); a rough dollars-to-time conversion, flawed since it assumes similar future performance and inflates as BCWS shrinks near completion.
R: yes
Q: Earned Schedule (ES) definition
A: (Not testable) The point in time on the cumulative PV curve where current EV intersects - "when should we have reached the work we've actually done?"
R: yes
Q: SPI(t) formula
A: (Not testable) SPI(t) = ES/AT, where AT = actual time elapsed; stays meaningful through program completion, unlike dollar-based SPI.
R: yes
Q: SV(t) formula
A: (Not testable) SV(t) = ES - AT, in time units.
R: yes
Q: Why does dollar-based SPI converge to 1.0 near completion?
A: (Not testable) BCWP and BCWS both approach BAC as the program finishes, so EV/PV trends toward 1.0 regardless of actual lateness - Earned Schedule fixes this by measuring time directly.
Q: Advanced EAC: ACWP + BCWR
A: (Not testable) Only as good as the integrity of the BCWR estimate itself.
Q: Advanced EAC: weighted CPI/SPI blend
A: (Not testable) EAC = ACWP + BCWR/(0.8 CPI + 0.2 SPI), often used late in a contract; generalizes to X% CPI + Y% SPI with X+Y=100%.
R: yes
Q: General guideline: SV self-healing
A: (Not testable) SV tends to self-heal as percent complete approaches 100%; place less emphasis on SV once percent complete passes about 80%.
Q: General guideline: early SV and later CV
A: (Not testable) Early schedule variances typically lead to cost variances later, since managers respond to schedule delay by adding resources/overtime.

## Key Pitfalls
Q: Common mistake: confusing CV and SV
A: Remember: CV = EV − AC (cost), SV = EV − PV (schedule); NEVER the reverse. Positive is good throughout EVM.
Q: Common mistake: using current-period data for EACs
A: Use cumulative data for EACs (smooths noise); use current-period for trend-spotting.
Q: Common mistake: including MR in BAC
A: Per the source, MR is set aside over and above the PMB. Beyond CEBoK: BAC is generally taken to exclude MR (the source does not discuss this), since including it would understate % complete.
Q: Common mistake: picking a single EAC formula
A: Several methods can project an EAC; two common ones are the CPI forecast and the CPI-SPI forecast. Beyond CEBoK: compute more than one and reconcile them.
Q: Common mistake: ignoring TCPI
A: A TCPI_BAC or TCPI_LRE far above historical CPI (more than ~5%) is a strong signal the target is not credible.
Q: Sign error trap: CV% and SV% denominators
A: CV% = CV / BCWP (EV), not BAC or AC. SV% = SV / BCWS (PV), not BAC. Wrong denominator gives a wrong percent.
Q: Common mistake: treating LOE as risk-free
A: LOE does not show schedule variances (they should not occur), so it should not be used for any task with a schedule that might slip or be variable in duration; it can still show a cost variance.
`
});
