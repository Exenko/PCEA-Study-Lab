PCEA.addModule({
  id: 'm11', num: 11, title: 'Manufacturing Cost Estimating', short: 'Manufacturing',
  source: 'guide',
  blurb: 'Break production cost into functional elements: labor rates and burdening, time standards, learning curves, and material with scrap. Make-or-buy decisions.',
  intro: String.raw`Manufacturing cost estimating builds production cost from **functional elements** (engineering, tooling, production run) and **resource categories** (labor and material).

**Core workflow**: decompose into elements → estimate each via rates, standards, quantity factors (learning) and material takeoff → time-phase and adjust for risk.

This module connects Modules 7 (learning curves), 6 (data analysis), and 4 (estimating methods). Unlike R&D estimating, manufacturing costs are heavily **quantity-driven** (learning curve effects), **labor-standard-driven** (time standards, rates), and **material-driven** (bill of materials, scrap).`,
  sections: [
    {
      id: 'process', title: 'Hardware lifecycle and functional cost elements', summary: 'Acquisition reviews, prototype types, manufacturing operations, cost elements',
      body: String.raw`### Acquisition Context and Hardware Development Cycle

Serious consideration of the production environment begins after **Critical Design Review (CDR)**. Recurring activities generally start with the beginning of production immediately following a **Production Readiness Review (PRR)** — a formal examination of whether the design is ready for production, whether production engineering problems have been resolved, and whether the producer has adequately planned for the production phase. PRR may also be called a **Manufacturing Readiness Review (MRR)**. The **Test Readiness Review (TRR)** is the gateway to system integration and test.

Sustaining activities (manufacturing, industrial engineering, other commodity engineering) and program functions (program management, subcontract management, business management, configuration/data management) support both development and production throughout the life cycle.

+++

### Prototype Types (Table 11.1)

CEBoK's Table 11.1 (as printed):

| Type | Definition |
|---|---|
| **Experimental Development Model (XDM)** | Most mature. Confirms cardinal system concepts |
| **Advanced Development Model (ADM)** | More mature. Confirms form, fit, and function of modules and subsystems |
| **Engineering Development Model (EDM)** | Less mature. Confirms reliability, maintainability, etc. |
| **Pre-Production Model (PPM)** | Least mature. Confirms producibility of design |

:::note CEBoK's maturity labels
The "most/least mature" labels in Table 11.1 conflict with CEBoK's own step-up discussion below (ADM costs more than EDM, which costs more than production) and with the usual XDM → ADM → EDM → PPM sequence toward production, where the PPM is the most production-representative. Learn the definitions (what each model confirms); treat the printed maturity labels with caution.
:::

Prototype costs are a sound basis for estimating recurring production unit costs. An **ADM costs more than an EDM**, which costs more than a production version — these **step-up factors** are usually expressed as the ratio of prototype to production version and **vary between about 1.2 and 2.0 between ADM and EDM, and the same amount between EDM and production unit**. Prototype manufacturing is a laboratory environment with considerable engineering oversight, assessing producibility and specification compliance — it is NOT representative of the repetitive production process.

**Best practice**: Exclude prototype/engineering build hours from the production learning curve (distorts T1 and slope); estimate prototype cost separately (analogy, step factor, or engineering buildup).

+++

### Manufacturing Operations

Typical operations in a manufacturing/production facility (per CEBoK):

- **Receiving**: shop work orders and process instructions received on the floor
- **Tool crib**: location of tooling and test equipment required at each stage
- **Machining**: raw material turned into a component via milling, drilling, welding, etc.
- **Sub-assembly area**: purchased parts and components received, inventoried, transferred to assembly
- **Assembly**: machined components and purchased parts come together (e.g., transmitter, structural boom)
- **Finishing**: final processing yields the desired form, fit, and function
- **Shipping**: delivers the finished product to the next higher level of integration or a customer distribution center

+++

### Functional Cost Elements

A Life Cycle Cost Estimate or production estimate should include:

- **Engineering and prototyping costs**
- **Setup costs**: non-recurring or recurring functions, and the procedures, tooling, test equipment, and facilities to produce the component(s)
- **Production run costs**: labor to produce the component(s); materials (subcontracts, purchased parts, raw materials); support labor; overheads (manufacturing direct overhead, material burden, G&A)

Overhead rates on labor generally cover most facilities costs. Production run costs are primarily recurring but may include some non-recurring or semi-recurring activities.

:::check
Q: Which review is the formal examination of whether the design is ready for production and production engineering problems have been resolved?
* Production Readiness Review (PRR)
- Critical Design Review (CDR)
- Test Readiness Review (TRR)
- Preliminary Design Review (PDR)
> PRR (also called MRR) gates the start of recurring production activity.
:::

:::check
Q: Step-up factors between prototype tiers (ADM to EDM, and EDM to production) typically range:
= 1.2-2.0
> CEBoK states these factors vary between about 1.2 and 2.0 in both steps.
:::

:::check
Q: In CEBoK's Table 11.1, which prototype confirms the producibility of the design?
* Pre-Production Model (PPM)
- Experimental Development Model (XDM)
- Engineering Development Model (EDM)
- Advanced Development Model (ADM)
> PPM confirms producibility; XDM confirms cardinal system concepts, ADM form/fit/function, EDM reliability and maintainability.
:::

:::widget burden:::

:::challenge burden dl=40 oh=1.1 ga=0.12 fee=0.08 hrs=1000 lock=dl,oh,hrs
Q: The customer's independent estimate uses a wrap rate of **\$110/hr**. Direct labor and overhead are fixed. Adjust G&A and fee to match it within \$1.
goal: wrap ~ 110 +- 1
show: ga=0.2 fee=0.09
> Wrap rate $= DL (1 + OH)(1 + G\&A)(1 + fee) = 84 (1 + G\&A)(1 + fee)$. You need $(1 + G\&A)(1 + fee) \approx 1.31$, for example 20% G&A with a 9% fee. Each rate compounds on the ones before it.
:::`
    },
    {
      id: 'setup', title: 'Production setup: facilities and tooling', summary: 'CAD/CAM/CAE, GSE, setup cost estimating, FCCOM, soft vs. rate tooling',
      body: String.raw`### Production Setup

Setup is the **non-recurring process** of placing manufacturing equipment and tools in proper arrangement before a production run. Setup time is critical on small production runs, where it may easily exceed run time.

Setup functions (process/industrial engineering) aim to minimize touch labor, optimize material usage (minimal scrap or rework), make procedures easily repeatable, and enable measurement for future process engineering, time standards, and learning curves.

The primary automated tools of production setup:

- **CAD (Computer-Aided Design)**: design and drafting (technical/engineering drawing)
- **CAM (Computer-Aided Manufacturing)**: manufacture of physical models
- **CAE (Computer-Aided Engineering)**: analysis, simulation, design, manufacture, planning, diagnosis, repair

Collectively referred to as **CAD/CAM/CAE**, often used with 3D modeling.

+++

### Ground Support and Test Equipment

Tools and test equipment are non-recurring products of designing and fabricating implements critical to assembly and test. In aerospace, test/support equipment is grouped into **Mechanical Ground Support Equipment (MGSE)** and **Electrical Ground Support Equipment (EGSE)**, which combine to form **Aerospace Ground Equipment (AGE)**.

+++

### Estimating Setup Costs

Setup is typically estimated by **analogy** to a similar program (e.g., Joint Strike Fighter setup time by analogy to F-18 or F-14). The analyst may scale by lot size, degree of automation, or **theoretical first unit (T1) cost** — equivalent to estimating as a factor of T1 cost. To scale by content and automation simultaneously, the analyst may need a factor from a second program pair that has undergone similar automation — this is called a **double analogy**. Parametric CERs may also work but require a homogenous data set. Setup costs often get buried in recurring production costs (amortized over lots) or non-recurring development, making consistent comparable data hard to find.

### Facilities Capital Cost of Money

**Facilities Capital Cost Of Money (FCCOM)**, also known as **Cost Of Facilities Capital (COFC)**, is an allowable cost under some contracts: an imputed cost from applying a rate to facilities capital employed in contract performance. It is NOT an interest charge (which would be unallowable) — it compensates the contractor for capital asset investment.

### Tooling

**Soft tooling** is most widely used in a prototype environment (e.g., silicone-injected molds), for one-time, disposable use. **Rate tooling** is used for increased-quantity manufacture (parts molds injected with steel or aluminum) and can increase efficiency at production quantities.

**Maintenance and recapitalization**: computer workstations used for test may be upgraded every **3–5 years**; mechanical crane assemblies may be upgraded every **10 years**.

+++

### Production Run and IPTs

Once setup is complete, the production run converts raw materials to finished goods, including touch labor, manufacturing support labor, and overhead. Many facilities rely on **Integrated Product Teams (IPTs)**: interdisciplinary teams for review and decision-making in complex development programs, involving all stakeholders in a collaborative forum. The IPT lead typically has responsibility for the make-or-buy decision, exercising creativity with available resources to assess whether a part is more economical to buy than to make in-house.

:::check
Q: A setup-cost factor derived by comparing automation improvements across a second pair of programs, then applied to scale a setup estimate by content and automation together, is called:
* Double analogy
- Parametric CER
- Step-up factor
- Realization factor
> Double analogy combines a primary analogy with a factor borrowed from a second program pair that shows the automation effect.
:::

:::check
Q: FCCOM compensates a contractor for:
* Investment in capital assets (opportunity cost of tied-up funds)
- Interest owed on late government payments
- The cost of scrap material
- Union labor premiums
> FCCOM (= COFC) is an imputed cost, not an interest charge, for capital tied up in facilities.
:::

:::check
Q: Which type of tooling is one-time-use, typically silicone-injected molds used in a prototype environment?
* Soft tooling
- Rate tooling
- Hard tooling
- Recapitalized tooling
> Rate tooling (steel/aluminum-injected molds) is for increased-quantity production instead.
:::

:::tip Beyond CEBoK: MGSE/EGSE examples
Typical MGSE includes handling fixtures, lift slings, and transport dollies. Typical EGSE includes power supplies, signal simulators, and umbilical harnesses used to power and stimulate a unit under test before flight.
:::`
    },
    {
      id: 'labor', title: 'Labor rates and burdening', summary: 'Fully burdened rate buildup: direct labor, fringe, overhead, G&A, fee',
      body: String.raw`**Total Labor = Direct Labor + Indirect Labor.** Direct labor is immediately associated with producing the product; indirect labor includes supporting engineering (industrial, mechanical) and supervisory/management labor, often assessed as a burden on direct labor.

### Burdening Structure

$$\text{Direct Labor Cost} = \text{Direct Labor Rate} \times \text{Labor Hours}$$
$$\text{Total Labor Cost} = (1 + \text{Overhead Rate}) \times \text{Direct Labor Cost}$$

Overhead rates are usually additive but may be stated additively (100% more) or multiplicatively (200%) — read carefully.

Layers, in order, each applied to the correct base:

1. **Direct Labor Rate** — base wage for the labor category
2. **+ Fringe Benefits** (% of direct labor) — payroll taxes, health insurance, pension; **fringe can run about 50% of direct salary cost**, heavily influenced by union benefits packages
3. **= Labor plus Fringe**
4. **+ Overhead** (% of labor+fringe) — manufacturing overhead is usually higher than other overhead (e.g., engineering overhead) due to equipment/tooling costs
5. **= Total Labor Cost**
6. **+ G&A** (% of total cost) — manufacturing contributes heavily to G&A since shop capital equipment is typically included in the G&A burden base
7. **= Total Cost**
8. **+ Fee/Profit** (% of total cost) — driven by risk, including equipment/tooling capacity hindrances
9. **= Fully Burdened Price (wrap rate)**

**FCCOM** can also be affected by manufacturing when facilities/equipment are considered in its calculation.

+++

### Worked Burdening Example

Direct Labor \$30.00/hr, Fringe 35%, Overhead 80% (of labor+fringe), G&A 10%, Fee 8%:

| Layer | Calculation | Amount |
|---|---|---|
| Direct Labor | — | \$30.00 |
| + Fringe (35%) | 0.35 × 30 | \$10.50 |
| **Labor + Fringe** | — | **\$40.50** |
| + Overhead (80%) | 0.80 × 40.50 | \$32.40 |
| **Total Labor Cost** | — | **\$72.90** |
| + G&A (10%) | 0.10 × 72.90 | \$7.29 |
| **Total Cost** | — | **\$80.19** |
| + Fee (8%) | 0.08 × 80.19 | \$6.42 |
| **Wrap Rate** | — | **\$86.61/hr** |

Or: \$30.00 × 1.35 × 1.80 × 1.10 × 1.08 = **\$86.61**

:::key
Each burden % applies to a different cumulative base, not all to the original direct labor rate. Test questions often hide incorrect bases to trap careless arithmetic.
:::

:::check
Q: Direct labor \$40/hr, overhead 110% of DL, G&A 12%, fee 8%. Wrap rate? (2 decimals)
= 101.61 ±0.02
> \$40 × (1 + 1.10) = \$84.00; \$84.00 × (1 + 0.12) = \$94.08; \$94.08 × (1 + 0.08) = \$101.61.
:::

+++

### Two Companies, Same Bid (Fig. 11.3)

Two companies can have the same cost elements but apply burden differently, bidding the **same total amount** for a product/service, yet ending up with different **wrap rates**. In CEBoK's example, **Company B's fully burdened rate is 20% lower than Company A's** even though both bid the same total price — material cost is excluded from the total (only labor is calculated), but material cost is still the base for the material burden factor (labor to handle/process that material).

+++

### Labor Rates in Practice

Rates come from **Forward Pricing Rate Agreements (FPRAs)** — per FAR 15.801, a written agreement negotiated between contractor and government making certain rates and factors available for a specified period, for pricing contracts or modifications not easily estimated for a specific contract/end item/task. A **Forward Pricing Agreement (FPA)** is different: a written agreement with a large-volume contractor setting a pricing *methodology*, which — once established — can determine the complete final price of individual orders (e.g., covering spares acquisition).

Manufacturing labor often involves **organized labor (unions)**, which guarantee specific rates and benefits different from corporate-wide rates — assess these when estimating union-protected tasks. **24-hour operations** generally require a premium to the labor force under labor law, and **state-specific laws** must also be considered.

:::check
Q: A pre-negotiated agreement making certain indirect rates/factors available for a specified period, for pricing costs not easily tied to a specific contract or task, is a:
* Forward Pricing Rate Agreement (FPRA)
- Forward Pricing Agreement (FPA)
- Cost Plus Award Fee contract
- Basic Ordering Agreement
> FPRA (FAR 15.801). FPA instead sets a pricing methodology that can determine a final order price, e.g., for spares.
:::

:::check
Q: If a direct labor rate is \$25/hr and your company's overhead rate is 150% of direct labor, what is the "labor plus overhead" cost per hour?
= 62.5
> Labor + Fringe = 25 × (1 + 0) = 25 (assuming no stated fringe). Labor + Overhead = 25 × (1 + 1.50) = 62.50.
:::

:::check
Q: Fringe benefit rates in manufacturing can run about what percentage of direct salary cost?
= 50 ±5
> CEBoK states fringe (health care, pension) can be about 50% of direct salary cost, heavily influenced by union benefit packages.
:::

:::widget skill-mix:::`
    },
    {
      id: 'composite', title: 'Composite rates and skill mix', summary: 'Blended rates across labor categories, hours-weighted averages',
      body: String.raw`When performing a cost estimate, the proper **skill mix** — the relative mix of junior/senior artisans for a task — must be understood. The skills needed dictate the labor categories in the estimate, and the labor rate used must be a **weighted average** of the junior/senior artisan rates.

### Composite Rate Formula

$$\text{Composite Rate} = \frac{\sum (\text{Direct Rate}_i \times \text{Hours}_i)}{\sum \text{Hours}_i}$$

The composite is the **hours-weighted average** rate across all categories, not a simple average.

+++

### Worked Composite Rate Example (CEBoK Fig. 11.4)

| Labor Category | Rate | Hours | Extended Cost |
| --- | --- | --- | --- |
| Engineer 1 | \$25/hr | 1,000 | \$25,000 |
| Engineer 2 | \$30/hr | 500 | \$15,000 |
| Engineer 3 | \$40/hr | 250 | \$10,000 |
| Engineer 4 | \$50/hr | 250 | \$12,500 |
| **Total** | — | **2,000** | **\$62,500** |

Composite rate = \$62,500 ÷ 2,000 = **\$31.25/hr**.

The **unweighted average** of the four rates is (25 + 30 + 40 + 50)/4 = **\$36.25/hr** (CEBoK states \$36). The composite (\$31.25) is lower than the unweighted average (\$36) because more hours are executed by the more junior (less expensive) labor categories.

:::note
CEBoK rounds the unweighted average to \$36; the exact unweighted average of the four rates is \$36.25.
:::

:::widget skill-mix:::

:::check
Q: Assemblers 60% × \$30/hr, Technicians 40% × \$45/hr. Composite direct rate?
= 36
> 0.6(30) + 0.4(45) = 18 + 18 = 36.
:::

:::check
Q: Using CEBoK's Fig. 11.4 skill-mix table (Eng1 \$25×1000h, Eng2 \$30×500h, Eng3 \$40×250h, Eng4 \$50×250h), the composite direct rate is:
= 31.25 ±0.05
> Total cost \$62,500 / total hours 2,000 = \$31.25/hr — lower than the unweighted \$36 average because junior engineers logged more hours.
:::

+++

### Skill Mix Effects

A shift toward higher-skill labor raises the composite rate **even when each individual rate stays the same**. It is vital for the estimator to determine the appropriate skill mix (skill mix by analogy is a good comparison method) — recalculate the composite if the mix shifts with quantity, design maturity, or automation.

:::check
Q: At start of production, labor is 80% assembler (\$40/hr), 20% engineer (\$80/hr). At mid-production, design stabilizes and mix shifts to 60% assembler, 40% engineer. Which rate is higher?
* Mid-production rate
- Initial rate
- They are equal
> Initial = 0.8(40) + 0.2(80) = 48. Mid = 0.6(40) + 0.4(80) = 56. Engineering content shifted upward.
:::`
    },
    {
      id: 'standards', title: 'Time standards and performance', summary: 'Development of standards, Maynard formula, PF&D, pace, efficiency vs. realization',
      body: String.raw`A **time standard** is the standard duration to perform a specific task, developed via time and motion studies. Time studies should be based on **observed, not estimated** data, and require the correct method, accurate recording, and honest performance evaluation. Build-up (using detailed labor standards) is the hallmark technique of manufacturing cost estimating, but is impeded by insufficient design detail (early in development) or a lack of time standards — companies without mass production (e.g., a satellite builder), non-process-controlled shops, or sole-source cost-type contracts often lack incentive to develop them.

### Techniques for Developing Time Standards

- **Stopwatch time studies**: an analyst records actual task time with a stopwatch, broken into groups of motions
- **Computerized data collection**: a system records the time required, captured by an analyst or generated by the process itself
- **Standard data**: similar to stopwatch methods but separates constant (setup) and variable (cyclical) elements into tables of normal times
- **Formulas**: independent/dependent variables plotted graphically to identify time relationships
- **Work sampling**: periodic observations used to infer the percent of time spent on a task (e.g., observed walking to get a tool 2 of 10 times → 20% of the day)
- **Predetermined time systems**: motion-time tables with rules for elemental body motions (reach, move, turn, grasp, position, disengage, release)

Standard time is NOT the total time to make a product — **non-standard support labor** (manufacturing/industrial engineering, QA, supervision, tooling maintenance) must be added, often as a **percent factor of standard labor**.

+++

### Standard Time Formula (Maynard)

Attributed to the work of **H.P. Maynard**:

$$\text{Standard Time} = \frac{\text{Measured Time} \times \text{Pace}}{1 - \text{PF\&D}}$$

**PF&D** (Personal, Fatigue, and Delay) covers personal needs, unavoidable delays, and a general slow-down from fatigue; PF&D can run **as high as 25%**. **Pace** rates how fast/slow a worker performs relative to normal: 90% = slower than normal, 100% = normal, 110% = faster than normal — normally determined by an industrial engineer. Pace may correct for exogenous effects (shifting workforce composition) or endogenous effects (workforce experience, learning-curve unit, unit maturity); pace and unit/maturity corrections are a significant danger area in standards-based estimation.

:::check
Q: Measured time 2.0 hr, pace 1.05, PF&D 12%. Standard time?
= 2.39 ±0.03
> (2.0 × 1.05) / (1 − 0.12) = 2.10 / 0.88 = 2.39 hours.
:::

:::tip Beyond CEBoK: the (1 + allowance) convention
Some texts and predetermined-motion-time systems (MTM, MOST) instead apply allowances multiplicatively: Standard Time = Measured Time × Pace × (1 + Allowance). This gives a **different** number than CEBoK's division form for the same stated percentage — e.g., a 25% allowance is ×1.25 under the multiplicative convention but ÷0.75 = ×1.333 under CEBoK's Maynard formula. Always check which convention a problem intends.
:::

+++

### Worked Example: Table 11.2 (Shipyard Assembly, Pace = 1.0)

Standard hours were developed at 10% PF&D (covered assembly). The new assembly is outside at 25% PF&D. Convert standard → measured using the old PF&D, then measured → new standard using the new PF&D: $\text{measured} = \text{std}\times(1-0.10)$, $\text{new standard} = \text{measured}/(1-0.25)$.

| Operation | Std hr (per lf) | Measured time | New standard | Total hours |
|---|---|---|---|---|
| Fit | 2.5 | 2.25 | 3.0 | 2,250 |
| Weld | 1.7 | 1.53 | 2.04 | 1,530 |
| Grind | 0.8 | 0.72 | 0.96 | 720 |
| **Total** | **6.0** | | | **4,500** |

Total hours of 4,500 across a combined new-standard of 6.0 hr/lf implies **750 linear feet** of assembly (4,500 ÷ 6.0), consistent with CEBoK's description of estimating total manhours for 750 linear feet.

:::widget pfd-standard:::

:::check
Q: In Table 11.2, the Fit operation's original standard was 2.5 hr/lf at 10% PF&D. What is its measured time?
= 2.25 ±0.02
> Measured = std × (1 − PF&D) = 2.5 × 0.90 = 2.25 hours.
:::

:::check
Q: With the new 25% PF&D, the Fit operation's new standard time (per lf) is:
= 3.0 ±0.05
> New standard = measured / (1 − new PF&D) = 2.25 / 0.75 = 3.0 hours.
:::

+++

### Use of Time Standards

Direct labor hours are estimated as **standard time × realization factor**; direct labor costs are then these hours times the wage rate. Other uses: estimating wages, establishing performance incentives, comparing work methods, determining plant capacity, improving production control, and sizing the workforce/equipment purchases. Standards are more common in earlier, simpler, more measurable work (e.g., large-item manufacture like shipbuilding: time to weld 1 meter of steel, time to install 1 meter of pipe).

+++

### Realization and Efficiency Factors (FR and FE)

Both compare actual labor hours to a defined time standard, and are reciprocals of each other:

- **Realization Factor** $F_R = \dfrac{\text{Actual}}{\text{Standard}}$ — the **variance factor**; similar to a Cost Growth Factor (CGF). Values > 1 mean more hours needed (slower); < 1 mean fewer hours (faster).
- **Efficiency Factor** $F_E = \dfrac{\text{Standard}}{\text{Actual}}$ — similar to an EVM performance index. Values > 1 mean efficiency (faster); < 1 mean inefficiency. $F_E$ is also called **Performance to Standards (PTS)** — the terms are interchangeable.

Most organizations use either $F_E$ or $F_R$, not both; both may be closely related to the pace term.

:::check
Q: Time standard 2.0 hours/unit, realization factor 1.5. Estimated actual hours per unit?
= 3
> 2.0 × 1.5 = 3.0 hours. (Efficiency = 1/1.5 ≈ 67%.)
:::

:::check
Q: Standard = 2.5 hr/unit, historically shop's efficiency (FE) = 0.83. Expected actual hours per unit?
= 3.01 ±0.05
> Actual = Standard / FE = 2.5 / 0.83 = 3.01 hours.
:::`
    },
    {
      id: 'learning', title: 'Learning curves in manufacturing', summary: 'What learns and what doesn\'t; production runs, breaks, P3I, anomalies',
      body: String.raw`**Full learning curve theory is in Module 7.** This section covers manufacturing-specific application and pitfalls. The learning curve idea's genesis and purest application is in the manufacturing environment.

### Production Runs and Learning

For a group to be a single production run, the design should stay almost constant. The longer a run uses the same design, the more learning occurs and the more costs decrease. Each production stage has unique learning characteristics — learning on a **major assembly** (e.g., final integration of a fighter jet airframe) differs from learning on a **minor assembly** (e.g., a bomber's auxiliary power unit subsystem, with much lower integration cost).

### What Learns: Touch Labor

Learning applies to **recurring touch labor** that improves with repetition under consistent conditions. Typical manufacturing learning curves: 75–90% slopes.

**What does NOT learn**:
- **Material cost per unit**: a physical/engineering quantity (same raw material needed regardless of repetition), though scrap rates may improve slightly and bulk discounts are a separate mechanism
- **Non-recurring costs**: setup, tooling, facilities are one-time
- **Prototype/engineering units**: different task, different process maturity
- **Support labor** (QC, planning): often estimated as a **factor of touch labor**, so it inherits the learning

+++

### Production Breaks and Learning Loss

Production breaks occur when a design change requires tooling/setup changes, or when production is interrupted for repair/retrofit (re-inserted at the original production point). If the break is long enough, needed machines, materials, or parts may no longer be available — this can cause a **complete loss of learning**.

**Equipment utilization rate** measures how efficiently manufacturing equipment is used; reducing unused capacity is a common IE goal.

**Pre-Planned Product Improvement (P3I)**: many government programs set aside contract funds for production upgrades, because large contracts are let well in advance of production and unforeseen improvements are often needed as technology advances.

+++

### Anomalies in Applying Learning Curve Theory

An anomaly example: environmental regulations imposed mid-run affecting a painting operation, adding cost. Three possible approaches:

1. Treat post-imposition units as an **entirely separate production run** and calculate a new learning curve
2. **Normalize** the data for units produced under the new regulation and continue applying the same curve
3. Treat the additional steps as **new work** and run a second learning curve to overlap the first

:::check
Q: Which costs are most affected by a production break?
* Recurring touch labor (through learning disruption)
- Material cost per unit
- Non-recurring tooling
- Facilities overhead allocation
> Breaks disrupt learning in labor; material, setup, and facilities are unaffected per se (though facilities costs may still accrue during idleness).
:::

:::check
Q: A mid-production environmental regulation adds a compliance step to a painting operation. Which approach treats the added step as its own overlapping curve rather than replacing or normalizing the original curve?
* Treat the added step as new work and run a second, overlapping learning curve
- Treat all post-imposition units as an entirely separate production run
- Normalize the new units' data and continue the same curve
- Ignore the regulation's cost impact
> CEBoK gives three options: separate run, normalize-and-continue, or new-work overlapping curve (as in Module 7's new-work approach).
:::

:::check
Q: Contract funds set aside for production upgrades to accommodate unforeseen technology improvements identified after contract award are known as:
* Pre-Planned Product Improvement (P3I)
- Facilities Capital Cost of Money (FCCOM)
- Material Usage Allowance (MUA)
- Non-Recurring Engineering (NRE)
> P3I funds production upgrades on programs let well in advance of production.
:::

+++

### Worked Learning Example

First production unit = 500 standard hours, 85% unit curve, $b = \ln(0.85)/\ln(2) = -0.2345$:

$$T_{50} = 500 \times 50^{-0.2345} \approx 500 \times 0.3759 \approx 188 \text{ hours}$$

This hours estimate is then multiplied by the fully burdened labor rate and summed across all units, excluding setup, tooling, and material costs (estimated separately).

:::check
Q: T1 = 800 hr, 90% curve. Hours for unit 20? ($b = -0.1520$)
= 507.4 ±0.5
> $800 \times 20^{-0.1520} = 800 \times 0.6341 = 507.3$ hours.
:::

+++

### Rate Changes and Design Changes

- **Rate theory** adds production rate (units/month) as a second variable: $Y = aX^b R^c$. Watch for **multicollinearity** (X and R often move together, inflating standard errors).
- **New work** mid-production: $Y_X = a_1 X^{b_1} + a_2(X - X_{last})^{b_2}$ (new component starts its own curve).

:::widget lc-explorer:::`
    },
    {
      id: 'material', title: 'Material cost estimating and scrap', summary: 'Material types, composite/exotic materials, scrap rates and MUA, MTOL',
      body: String.raw`### Material Categories

- **Raw Material**: matter the manufacturer transforms into a product (e.g., steel plates welded/fitted into a ship's hull)
- **Purchased Parts**: materials installed to make a final product (e.g., prefabricated doors and hatches)
- **Subcontractor Costs**: expenses for an external company producing a product or service (e.g., power plant subcontract, armament subcontract), determined by make/buy analysis; may include long-lead materials, often labeled "materials" despite being part or all labor (e.g., engineering/consulting services)

**Long-lead material**: specialty or one-batch items requiring significant time to manufacture, often on a separate CLIN or contract number, started well before the rest of the item. Examples: the propulsion system on a Navy ship, specialized chips or boards on a satellite, specialized hardware (servers/processors) in IT infrastructure.

### Material Type

Metal vs. non-metal properties affect both cost and processing. A general rule: **non-metals are easier to machine than metals**. Aluminum in raw form has less tensile/compression strength than steel, but **anodized** aluminum exceeds raw steel's tensile/compression properties; steel itself can also be processed to improve strength.

+++

### Composite Materials

Composite laminates are usually formed in a **near-final shape** with little rework or machining, which increases the relative importance of tooling for composites versus metal parts. Their light weight with comparable strength to metal makes composites preferred in aircraft manufacturing where weight is critical. Bonding chemicals are increasingly replacing traditional fasteners (nuts and bolts), proving superior and often cheaper.

### Exotic Materials

Exotic materials (e.g., radar-absorbing material, first introduced in stealth technology) require special handling and are expensive. Higher-performance material (titanium) costs more than lower-performing material (aluminum), and manufacturability of high-performance materials also raises cost (aluminum machines much faster than titanium). Material defects are costly — raw materials are inspected (sometimes vendor self-certified), and **in-process inspection** catches defects (e.g., stress fractures from a drilled hole pattern) that could not be found beforehand.

+++

### Scrap Rates and Material Usage Allowance

A **scrap rate** expresses, **as a percentage of the material in the end item** (i.e., of the *delivered* weight, not the raw input), the amount of scrap material also consumed/discarded in production. CEBoK notes this is **perfectly analogous to the distinction between fee and margin**: scrap rate is not a percentage of the total material used. On government contracts, scrap rates are called **Material Usage Allowances (MUA)**, negotiated between contractor and government from historical trends of material needed beyond the finished product.

**CAD/CAM** enable automatic generation of a **Material Take-off List (MTOL)**: quantities, dimensions, materials, etc. corresponding to a drawing.

:::widget design-scrap:::

+++

### Material Usage Allowance Example (Figs. 11.7/11.8)

MUA percentage is needed to estimate raw material cost for a new B-2 canopy panel. Material usage has been tracked for the **20** air vehicles of the previous panel design, stable across those units, with scrap rate calculated as the difference between raw material weight and delivered product weight, as a percentage of the **delivered (finished)** weight. A design change for the 21st panel makes it heavier (increased thickness). Using a **five-unit moving average** to smooth natural variation, the MUA at the 20th unit is **22.4%**. No discernible learning occurred in these scrap rates, though analysts should always check for it.

The mass properties engineer estimates the new panel's weight at **100 lb**; raw material costs **\$200/lb**:

$$\text{Raw material cost} = 100 \times (1 + 0.224) \times \$200 = \$24{,}480$$

:::note
CEBoK's worked example prints \$24,520 for this calculation — but 100 × 1.224 × 200 = \$24,480. This appears to be an arithmetic slip in the source; \$24,480 is the correct product.
:::

:::widget mua-moving-average:::

:::check
Q: A scrap/MUA rate is expressed as a percentage of which quantity?
* The delivered (finished) product weight
- The raw material input weight
- The total material purchased
- The scrap material only
> CEBoK: scrap rate as % of end-item material is analogous to fee-vs-margin — it is a percentage of the delivered weight, not the raw input.
:::

:::check
Q: New panel weight 100 lb, five-unit moving-average MUA = 22.4%, raw material \$200/lb. Raw material cost?
= 24480 ±10
> 100 × (1 + 0.224) × 200 = 122.4 × 200 = \$24,480.
:::

+++

### Engineering Design and Scrap (Fig. 11.9)

Design choices directly drive material use, machining cost, and scrap:

- **(a)** 4-inch aluminum plate machined down to a 3-inch cover: extensive machining, large waste
- **(b)** 3-inch plate as raw stock for the same cover: less machining, less scrap
- **(c)** Square plate, no machining needed at all: most cost-effective — eliminates both machining and scrap

+++

### Material Take-Off List and 3D CAD

A **Material Take-off List (MTOL)** — e.g., piping lengths from a ship compartment's 3D CAD drawing — feeds CERs (cost per foot) or vendor per-foot pricing for a quick material buildup. The amount of material required affects material cost AND the labor to handle/install it. 3D CAD also supports **virtual walk-throughs** of compartments to catch manufacturability/maintainability issues early (Fig. 11.10) — though reductions in rework/maintenance should be backed by data (e.g., a partial prototype or pilot study) before use in an estimate. Figure 11.11 gives an aircraft-specific overview of the production cost estimating method, generally applicable.

:::check
Q: Comparing three cover designs machined from plate stock, which is the most cost-effective per CEBoK Fig. 11.9?
* A square plate requiring no machining and producing no scrap
- A 4-inch plate machined down to a 3-inch cover
- A 3-inch plate machined down to a 3-inch cover
- All three cost the same
> Eliminating machining and scrap entirely (the square-plate design) beats either machined-plate option.
:::

+++

### Testable Topics

Per CEBoK: **all main content is testable**; less-emphasized topics are N/A; the **Advanced Topics** (Related & Advanced Topics section) are **not testable**.

:::check
Q: Per CEBoK's Testable Topics table for this module, which content is NOT testable?
* Advanced Topics (DoD reporting, Six Sigma, Lean, Agile, IT services, modeling, IPPD, QA)
- Labor rate burdening
- Time standards
- Scrap rates and MUA
> All main module content is testable; the Related & Advanced Topics section is explicitly marked not testable.
:::`
    },
    {
      id: 'makebuy', title: 'Make-or-buy decisions', summary: 'Cost comparison, breakeven analysis, decision factors',
      body: String.raw`A **make-or-buy** decision chooses whether to produce an item in-house ("make") or purchase from a supplier ("buy"). Responsibility typically belongs to the **IPT lead**, who exercises creativity with available resources and assesses whether a part is more economical to buy outside than make in-house. The cost estimator develops a cost estimate to support this assessment (typically from historical data) and must assess any outside vendor quote for realism and reasonableness — buying may be faster than in-house fabrication, and schedule may matter as much as cost.

### Decision Drivers

Beyond cost:

- **Cost**: compare in-house fully burdened cost vs. supplier price (plus procurement overhead)
- **Capacity**: in-house capability and available capacity
- **Core competency**: retain strategically important (proprietary, critical-path) items in-house
- **Quality/schedule risk**: supplier reliability and lead times
- **Sunk investment**: existing tooling/facilities favor "make" if capacity exists
- **Strategic sourcing**: industrial base, source diversification, government sourcing preferences

**Caution**: lowest unit price does NOT always drive the decision.

+++

### Cost Breakeven Analysis

Simple case: make requires incremental tooling investment, but has lower per-unit cost.

**Breakeven quantity:**

$$Q_{breakeven} = \frac{\text{Incremental Tooling Cost}}{\text{Buy Price} - \text{Make Cost/Unit}}$$

**Worked example**: Make for \$90/unit (no incremental tooling currently in hand), buy for \$102/unit, tooling investment needed = \$40,000.

- Below 3,334 units: buy is cheaper (no tooling sunk cost)
- Above 3,334 units: make is cheaper (tooling amortized)
- Breakeven: \$40,000 / (\$102 − \$90) = 3,333.3 units

Sensitivity: if tooling rises to \$60,000, breakeven = \$60,000 / \$12 = 5,000 units.

:::check
Q: Make cost \$75/unit (no tooling investment in hand), buy \$85/unit, new tooling \$30,000. Breakeven quantity?
= 3000
> 30,000 / (85 - 75) = 30,000 / 10 = 3,000 units.
:::

+++

### Mixed Make/Buy Strategies

Programs often use mixed strategies:
- **Buy** long-lead components and COTS items, focusing in-house on **core/critical items**
- **Allocate buy items** in the bill of materials as purchased parts (distinct cost line), **make items** go through the manufacturing cost buildup (labor, material, overhead)
- **Sum both** at the total cost level

:::check
Q: When an item is marked "buy," how does it typically enter the cost estimate?
* As a purchased part from a supplier quote, separate cost line
- Estimated through in-house labor standards and rates
- As overhead allocation (it "doesn't count")
> Buy items are estimated via supplier quotes, then summed; make items use the full buildup.
:::`
    },
    {
      id: 'adv-programs', title: 'Advanced: DoD reporting, Six Sigma & Lean', summary: 'Not testable per CEBoK — DD 1921-1, Six Sigma DMAIC, Lean/JIT/Kanban/5S, Agile',
      body: String.raw`:::note Not testable per CEBoK
This module's "Related and Advanced Topics" content, including this section, is explicitly marked **not testable**.
:::

### DoD Manufacturing Cost Estimating

Because accounting/tracking procedures differ across organizations and facilities, the standard **DD Form 1921-1, Functional Cost-Hour Report**, tracks top-level labor elements of engineering, tooling, manufacturing, and Quality Control (QC). It displays incurred and estimated costs to completion by functional area, broken out by direct labor hours and major cost element (direct labor, material, overhead), for **recurring, nonrecurring, and total costs**, for the total contract and selected WBS elements chosen by criteria of high cost, high risk, or high technological interest.

+++

### Six Sigma

Developed by **Bill Smith at Motorola** in the mid-1980s as a measure of quality, seeking to remove causes of defects and errors using statistical methods and a dedicated expert infrastructure, inspired by prior quality methodologies (quality control, TQM, zero defects).

"Six sigma" means six standard deviations between a process mean and the nearest requirement limit — practically no items fail to meet requirements. Reducing process variation (variance = std. deviation squared) decreases process sigma, lowering cost and raising customer satisfaction.

**DMAIC** — the five phases of Six Sigma improvement:

- **Define**: team and sponsor agree on scope, goals, financial/performance targets
- **Measure**: understand current process state; collect reliable data on process, speed, quality, cost
- **Analyze**: pinpoint and verify causes affecting key input/output variables
- **Improve**: learn from pilot(s), execute full-scale implementation
- **Control**: complete project work, hand off to process owner with gain-maintenance procedures

Six Sigma places heavy emphasis on the **Voice of the Customer (VOC)**.

+++

### Lean Manufacturing

Treats any resource expenditure not creating end-customer value as waste to be eliminated; goal is maximum quality with less work. Originates from the **Toyota Production System**. Where Six Sigma focuses on reducing defects, Lean focuses on reducing waste (non-value-adding processing/procedure), using value stream maps rather than heavy statistics; combining both is called **Lean Six Sigma**.

**Ship-in-water analogy** (Fig. 11.12): water represents inventory/work-in-process that hides manufacturing problems. High inventory levels let problems (unreliable vendors, excess scrap, inefficiency, capacity imbalances) stay hidden; low inventory surfaces them.

Lean techniques:

- **Just-in-Time (JIT)**: required part at the required machine at the required time, reducing in-process inventory and carrying costs
- **Kanban** ("kan" = visual, "ban" = card): a pull signaling system (cards, plastic markers, or empty bins) tied to actual customer demand, providing exactly what's required plus one spare
- **Value Stream Mapping**: maps current-state material/information flow (including delays), assesses it, then draws and implements a future-state map
- **Poka-yoke**: Japanese for "fail-safe"/"mistake-proof" — limits how an operation can be performed to force correct completion
- **5S**: workplace organization philosophy — **Seiri (Sorting)**: keep only essential items; **Seiton (Straighten/Set in Order)**: arrange tools for workflow; **Seiketsu (Sweeping/Shining)**: clean systematically; **Seiso (Standardizing)**: standardize practices; **Shitsuke (Sustaining)**: maintain/review standards

:::note Source pairing looks swapped
CEBoK's source text pairs *Seiketsu* with "Sweeping/Shining" and *Seiso* with "Standardizing." The standard 5S convention used elsewhere is the reverse: **Seiso = Shine**, **Seiketsu = Standardize**. This looks like a swap in the CEBoK source; the terms above follow CEBoK's wording as printed, not the more common convention.
:::

+++

### Agile Manufacturing

Traditional manufacturing estimating (labor standards, learning curves) requires repetitive, unchanging production flow. Agile manufacturing's flow is flexible and constantly changing, so traditional techniques cannot be used — past data can't predict a non-conforming operation. The characteristic most important to cost estimators is the **non-repetitive nature** of the workflow.

:::check
Q: Which Six Sigma phase focuses on pinpointing and verifying causes affecting key input/output variables?
* Analyze
- Measure
- Improve
- Control
> DMAIC: Define, Measure, Analyze, Improve, Control — Analyze isolates root causes.
:::

:::check
Q: In the Kanban system, what does "kan" mean?
* Visual
- Card
- Pull
- Sort
> "Kan" means visual, "ban" means card — together, a visual card-based pull signal.
:::

:::check
Q: The DoD form used to report recurring, nonrecurring, and total costs by functional labor element (engineering, tooling, manufacturing, QC) is:
* DD Form 1921-1
- DD Form 250
- DD Form 1423
- CDRL Form A
> The Functional Cost-Hour Report, standardized because accounting practices vary across organizations.
:::

:::check
Q: Why can't traditional labor standards and learning curves be applied to Agile manufacturing?
* Its production flow is non-repetitive and constantly changing, so past data can't predict it
- Agile manufacturing has no labor cost at all
- Agile manufacturing never uses tooling
- Standards apply, just at a different slope
> The workflow's non-repetitive nature is the key characteristic cost estimators must recognize.
:::`
    },
    {
      id: 'adv-other', title: 'Advanced: IT services, modeling, IPPD & quality tools', summary: 'Not testable per CEBoK — IT services cost categories, CAD/CAM modeling, IPPD budget allocation, QA tools',
      body: String.raw`:::note Not testable per CEBoK
This module's "Related and Advanced Topics" content, including this section, is explicitly marked **not testable**.
:::

### Information Technology Services

Gartner defines IT services as applying business and technical expertise to enable creation, management, optimization of, or access to information and business processes; segmented by skill type (design, build, run) and category (business process, application, infrastructure services). Cost categories:

- **Recurring/Non-Recurring**: e.g., help desk support (recurring) vs. initial IT equipment purchase (non-recurring)
- **Fixed/Variable**: leasing/facility costs (fixed) vs. costs that fluctuate with user count, e.g., help desk staffing (variable)
- **Direct/Indirect**: software development (direct, attributable to a specific item) vs. systems engineering or program management (indirect)

Labor build-ups and rate development follow the same approach as manufacturing labor, calculating an **IT wrap rate**. Analysis can also determine whether to build in-house IT infrastructure or outsource to a contractor.

+++

### Estimating with Computer Modeling

Example: an aluminum part's setup, performed by **3D computer simulation** of cutter path/speed/feed, versus the pre-simulation approach of machining an actual **first article** by trial and error (time-consuming, costly). The specific savings are unique to the environment, but the estimator must know which technique (hard-tool proof vs. 3D modeling) underlies any historical CER data — **commingling data from the two techniques produces an erroneous estimate**. If historical data doesn't reflect CAD/CAM/CAE, one remedy is to develop a traditional-setup CER/analogy, then apply a percent-reduction factor from an analogy to a program that transitioned from hard-tool proof to simulation.

+++

### Integrated Product and Process Development (IPPD)

IPPD uses cross-functional IPTs formed to develop a product, focusing on the system rather than functional silos; each IPT develops subsystems using interdisciplinary talent and necessary resources (e.g., an IPT for a satellite's electrical power system draws on tooling, machining, assembly, integration, QA plus engineering, business management). Cost estimating/analysis representation on each IPT is essential to show cost impacts of design decisions to bodies like an **Engineering Change Board (ECB)** and design trade studies.

The cost estimate/budget is usually held at the **IPT level**, with ultimate responsibility given to the **IPT leader**, who draws on all necessary resources and has full budget control. Budget allocation approaches:

1. **Equal allocation** based on status quo — all teammates share equally in budget increases/decreases
2. **Historical-data allocation** — based on a similar program or benchmarking data (should-cost)
3. **Reallocation** based on new current task estimates — used after a reorganization requiring revised budgets

+++

### Quality Assurance Tools

QA checks conformity to specification sheets/drawings via two basic inspection forms: **Non-Destructive Inspection (NDI)** and **sampling inspection** (part discarded after inspection). **Statistical Process Control (SPC)** samples parts, records/tracks results, and drives corrective action.

:::tip Beyond CEBoK
**Cost of Quality** splits quality spending into **prevention** (design reviews, training, process improvement), **appraisal** (inspection, testing) and **failure** (rework, scrap, warranty). Prevention is usually cheaper than late failures.
:::

- **Coordinate Measurement Machine (CMM)**: measures polar coordinates for dimensional conformity via touch-trigger probes on three driven axes; can determine both XYZ position and (via probe deflection) the vector of the hit
- **Portable CMM** (robotic-arm-like): angular encoders at wrist, elbow, shoulder measure rotation and flex angle; known link lengths let software compute probe position; does not deflect, so the operator must guide feature measurement per the software's needs
- **Laser Tracker**: transportable; uses servos to rotate/angle the laser, tracking a **Sphere Mounted Retroreflector (SMR)** ball via distance and angle; does not auto-compensate for measured features (e.g., inside vs. outside diameter), requiring operator correction

These machines carry high capital cost, justified by high rework costs on tight-tolerance items (e.g., satellites, submarine pumps/generators).

:::check
Q: Gartner's IT services cost category distinguishing help desk support from an initial IT equipment purchase is:
* Recurring / Non-Recurring
- Fixed / Variable
- Direct / Indirect
- Prime / Subcontract
> Help desk support recurs; the initial equipment purchase to host the service is non-recurring.
:::

:::check
Q: Commingling CER data from a hard-tool-proof setup process with data from a 3D-simulation setup process would:
* Produce an erroneous estimate, since the two techniques have different cost structures
- Be fine, since both produce the same part
- Only matter for material cost, not setup cost
- Automatically self-correct via regression
> The estimator must be sure which setup technique underlies the historical data before applying a CER.
:::

:::check
Q: A portable CMM's angular encoders are located at which three joints?
* Wrist, elbow, and shoulder
- Wrist, ankle, and knee
- Base, mast, and head
- Only the shoulder (single-axis)
> Two encoders per joint (rotation and flex); known segment lengths let software resolve probe position in space.
:::

:::check
Q: A Laser Tracker tracks distance and angle to a:
* Sphere Mounted Retroreflector (SMR)
- Coordinate Measurement probe
- Portable CMM arm
- Poka-yoke sensor
> The SMR ball reflects the laser; the tracker does not itself distinguish feature types (e.g., inside vs. outside diameter) without operator correction.
:::`
    }
  ],
  cards: String.raw`
## Process and Lifecycle
Q: Hardware development cycle stages
A: Concept/Design → Engineering & Prototyping → Production Setup → Production Run → Sustainment/Spares.
Q: Manufacturing functional cost elements (recurring vs. non-recurring)
A: Non-recurring: engineering, prototyping, facilities, special tooling. Recurring: production labor, material, QC.
Q: Why are prototype/engineering unit hours excluded from production learning curves?
A: Prototypes are hand-built with design changes and rework, not process-representative of repetitive production; including them distorts T1 and slope.
Q: Manufacturing operations sequence (CEBoK)
A: Receiving → Tool crib → Machining → Sub-assembly area → Assembly → Finishing → Shipping (to next higher level of integration).
Q: What is the key difference between prototype and production unit labor?
A: Prototypes are engineering-driven with rework; production is repetitive and standardized (learning applies to production only).
Q: What does each CEBoK prototype model confirm (XDM, ADM, EDM, PPM)?
A: XDM: cardinal system concepts. ADM: form, fit, and function of modules and subsystems. EDM: reliability, maintainability, etc. PPM: producibility of design.
Q: Typical step-up factor range between prototype tiers (ADM->EDM, EDM->production)
A: About 1.2 to 2.0 in each step.
Q: PRR / MRR
A: Production Readiness Review (also called Manufacturing Readiness Review): formal examination of whether design is production-ready, production engineering issues resolved, and production planning is adequate.
Q: TRR
A: Test Readiness Review: gateway to system integration and test.

## Production Setup
Q: CAD/CAM/CAE
A: Computer-Aided Design (drafting), Computer-Aided Manufacturing (physical model production), Computer-Aided Engineering (analysis, simulation, planning, diagnosis).
Q: MGSE / EGSE / AGE
A: Mechanical Ground Support Equipment + Electrical Ground Support Equipment = Aerospace Ground Equipment.
Q: Double analogy (setup cost estimating)
A: Scaling a setup estimate by content AND automation, where the automation factor is obtained from a second program pair that showed a similar automation improvement.
Q: FCCOM / COFC
A: Facilities Capital Cost Of Money (= Cost Of Facilities Capital): imputed cost from applying a rate to facilities capital employed in contract performance; not an interest charge, compensates for capital investment.
Q: Soft tooling vs. rate tooling
A: Soft tooling = one-time-use prototype tooling (e.g., silicone-injected molds). Rate tooling = tooling for increased-quantity production (steel/aluminum-injected molds).
Q: Tool/equipment recapitalization cycle
A: Computer workstations ~3-5 years; mechanical crane assemblies ~10 years.
Q: IPT
A: Integrated Product Team: interdisciplinary team for review/decision-making in complex programs; make-or-buy decision typically falls to the IPT lead.

## Labor Rates and Burdening
Q: Burdening structure (order and base)
A: Direct Labor → + Fringe (% of DL) → + Overhead (% of L+F) → + G&A (% of total cost) → + Fee (% of total).
Q: What is a "fully burdened rate" or "wrap rate"?
A: The cost per hour of labor charged to a program, including all burdens (fringe, overhead, G&A, fee).
Q: DL \$40/hr, overhead 110%, G&A 12%, fee 8%. Wrap rate?
A: 40 × (1 + 1.10) × (1 + 0.12) × (1 + 0.08) = 40 × 2.10 × 1.12 × 1.08 ≈ \$101.61
Q: Why does each burden % apply to a different base?
A: Burdens are compounded sequentially; fringe is on direct labor, overhead is on labor+fringe, G&A is on total cost. Applying all to direct labor is incorrect.
Q: Approximate fringe rate as % of direct salary
A: About 50% of direct salary cost, heavily influenced by union benefit packages (health care, pension).
Q: What is an FPRA?
A: Forward Pricing Rate Agreement (FAR 15.801): pre-negotiated labor and indirect rates/factors made available for a specified period, used in contractor proposal pricing.
Q: FPRA vs. FPA
A: FPRA covers rates/factors not easily tied to a specific contract/task. FPA sets a pricing methodology with a large-volume contractor that can determine a complete final order price (e.g., spares).
Q: Two companies bidding the same total price can still differ in what metric (Fig. 11.3)?
A: Fully burdened (wrap) rate — Company B's wrap rate was 20% lower than Company A's despite an identical bid.
Q: Organized labor / 24-hour operations considerations
A: Union rates/benefits may differ from corporate-wide rates; 24-hour operations generally require a labor premium under labor law; state-specific laws also apply.
Q: Direct labor rate escalation is covered in which module?
A: Module 5 (Escalation).

## Composite Rates
Q: Composite (blended) labor rate formula
A: $\dfrac{\sum(\text{Rate}_i \times \text{Hours}_i)}{\sum \text{Hours}_i}$ = total cost / total hours (hours-weighted average, not simple average).
Q: CEBoK Fig. 11.4 composite vs. unweighted average rate
A: Composite = \$31.25/hr (weighted); unweighted average of the four rates = \$36.25 (CEBoK states \$36); composite is lower because junior engineers logged more hours.
Q: When is a composite rate used?
A: When a program has multiple labor categories (assembler, machinist, engineer, inspector, etc.) with different rates and the skill mix is expected to remain stable.
Q: Effect of skill mix shift on composite rate
A: Shift toward higher-skill labor raises the composite rate even if individual rates stay the same.

## Time Standards
Q: Time standard definition
A: The standard duration to perform a specific task, developed via observed (not estimated) time and motion studies.
Q: Techniques for developing time standards (per CEBoK)
A: Stopwatch time studies, computerized data collection, standard data, formulas, work sampling, predetermined time systems.
Q: Standard time formula (Maynard)
A: Standard Time = (Measured Time × Pace) / (1 − PF&D).
Q: PF&D
A: Personal, Fatigue, and Delay allowance; can run as high as 25%.
Q: Pace factor
A: Rating of worker speed vs. normal: 90% = slower, 100% = normal, 110% = faster; usually set by an industrial engineer.
Q: Beyond CEBoK: multiplicative allowance convention
A: Some systems (MTM, MOST) use Standard Time = Measured × Pace × (1 + Allowance) instead of dividing by (1 − Allowance); gives a different result for the same stated %, e.g. 25% is ×1.25 vs ÷0.75 (×1.333).
Q: Table 11.2 worked result: new standard hours (Fit/Weld/Grind) and total
A: Fit 3.0, Weld 2.04, Grind 0.96 hr per linear foot; total 6.0 hr/lf × 750 linear feet = 4,500 total hours.
Q: Realization factor FR
A: FR = Actual / Standard (variance factor, like Cost Growth Factor); >1 means more hours needed.
Q: Efficiency factor FE
A: FE = Standard / Actual (like an EVM performance index; also called PTS, Performance to Standards); >1 means efficient/faster.
Q: Estimated actual hours (divisor convention): standard = 2.5 hr, efficiency = 0.83
A: 2.5 / 0.83 = 3.01 hours (workers 20% slower than standard).
Q: Relationship between realization factor and learning curves
A: Standards are roughly the mature/steady-state production rate; realization/efficiency factors model early inefficiency; learning curves model the transition to the standard.

## Learning in Manufacturing
Q: Which recurring manufacturing costs follow learning curves?
A: Touch labor (assembly, fabrication); NOT material (fixed per unit), NOT non-recurring (setup, tooling), NOT support labor (estimated as % of touch labor, which inherits learning).
Q: Why does material cost NOT follow learning curves?
A: Material consumption is a physical/engineering quantity (part requires the same raw material regardless of repetition); scrap may improve but this is separate from the learning curve mechanism.
Q: Major vs. minor assembly example
A: Major: final integration of a fighter jet airframe. Minor: a bomber's auxiliary power unit subsystem assembly (much lower integration cost).
Q: P3I
A: Pre-Planned Product Improvement: contract funds set aside for production upgrades to accommodate unforeseen technology improvements identified after contract award.
Q: Three approaches to a mid-run anomaly (e.g., new environmental regulation)
A: (1) treat post-imposition units as a separate production run with a new curve; (2) normalize the new units' data and continue the same curve; (3) treat the added steps as new work with a second overlapping curve.
Q: Production break effects on learning
A: Long breaks can cause complete loss of learning (turnover, process drift, unavailable machines/materials); short breaks may allow continuation.
Q: Rate theory equation
A: $Y = aX^b R^c$, where R = production rate and c is regression coefficient; watch for multicollinearity between X and R.
Q: New work added mid-production (equation)
A: $Y_X = a_1 X^{b_1} + a_2(X - X_{last})^{b_2}$ (new component starts its own curve).

## Material Cost Estimating
Q: Three categories of manufacturing materials
A: Raw materials (e.g., steel hull plates), purchased parts (e.g., doors/hatches), subcontracted items (major assemblies, determined by make/buy).
Q: Long-lead material examples
A: Ship propulsion system, specialized satellite chips/boards, specialized IT servers/processors.
Q: Challenges of exotic/composite materials (cost estimating)
A: Higher raw cost, harder to machine (tool wear, scrap), longer lead times; must adjust labor/tooling standards, not borrow from metal-fabrication analogs.
Q: Scrap rate / MUA definition
A: Scrap expressed as a % of the delivered (end-item) material, not the raw input — CEBoK compares this to the fee-vs-margin distinction. On government contracts called Material Usage Allowance (MUA).
Q: MUA worked example: 100 lb panel, 22.4% MUA, \$200/lb raw material
A: 100 × (1 + 0.224) × 200 = \$24,480 (CEBoK's source prints \$24,520, an apparent arithmetic slip).
Q: MUA moving-average method
A: A five-unit moving average smooths natural scrap-rate variation while still reflecting the most recent data.
Q: MTOL
A: Material Take-off List: CAD/CAM-generated list of parts/quantities/dimensions/materials corresponding to a drawing; supports material buildup and 3D walk-throughs for manufacturability checks.
Q: Fig. 11.9 design-vs-scrap example
A: 4" plate machined to 3" cover = most machining/scrap; 3" plate to same cover = less; square plate needing no machining = no scrap, most cost-effective.
Q: Material cost and learning curves (relationship)
A: Material cost generally does NOT follow learning curves; consumption per unit is constant (physical quantity); bulk discounts are separate.
Q: Testable Topics per CEBoK for this module
A: All main content is testable; less-emphasized topics N/A; the Related & Advanced Topics section is explicitly not testable.

## Make-or-Buy
Q: Make-or-buy decision: what is it?
A: Choosing whether to produce a component/subassembly in-house or purchase from a supplier; typically the IPT lead's call.
Q: Key decision drivers for make-or-buy
A: Cost (fully burdened in-house vs. supplier quote), capacity, core competency, quality/schedule risk, sunk tooling/facility investment, strategic sourcing.
Q: Breakeven quantity formula (make-or-buy)
A: Q = Incremental Tooling Cost / (Buy Price − Make Cost/Unit)
Q: Incremental tooling \$40,000, buy price \$102, make cost \$90/unit: breakeven?
A: 40,000 / (102 − 90) = 3,333 units; above this, make is cheaper; below, buy is cheaper.
Q: Why is lowest unit price not always the make-or-buy driver?
A: Capacity, core competency, risk, and sunk investment considerations often outweigh pure unit cost.
Q: In a mixed make-buy program, how are costs combined?
A: Buy items → purchased part cost line from supplier quote; make items → full labor/material/overhead buildup; sum both at total cost level.

## Advanced Topics (not testable per CEBoK)
Q: DD Form 1921-1
A: Functional Cost-Hour Report: tracks recurring, nonrecurring, and total costs by top-level labor element (engineering, tooling, manufacturing, QC) and cost element (direct labor, material, overhead).
Q: Six Sigma origin and method
A: Developed by Bill Smith at Motorola (mid-1980s); DMAIC phases: Define, Measure, Analyze, Improve, Control; heavy emphasis on Voice of the Customer (VOC).
Q: Lean manufacturing ship-in-water analogy
A: Inventory ("water") hides production problems; lowering inventory surfaces inefficiencies (unreliable vendors, excess scrap, capacity imbalances).
Q: Kanban
A: "Kan" = visual, "ban" = card; a pull signaling system tied to actual customer demand, using cards/markers/empty bins.
Q: Poka-yoke
A: Japanese for fail-safe/mistake-proof; limits how an operation can be performed to force correct completion.
Q: 5S elements (as CEBoK's source pairs them)
A: Seiri/Sorting, Seiton/Straighten (Set in Order), Seiketsu/Sweeping-Shining, Seiso/Standardizing, Shitsuke/Sustaining — note the Seiketsu/Seiso pairing looks swapped versus the common Sort-Set-Shine-Standardize-Sustain convention.
Q: Agile manufacturing key characteristic for cost estimators
A: Non-repetitive, constantly-changing workflow — traditional labor standards and learning curves don't apply.
Q: IT services cost category breakdowns (Gartner-based)
A: Recurring/Non-Recurring, Fixed/Variable, Direct/Indirect; labor build-ups compute an IT wrap rate similarly to manufacturing labor.
Q: Computer modeling setup CER pitfall
A: Commingling CER data from hard-tool-proof setup with data from 3D-simulation setup produces an erroneous estimate; must know which technique underlies historical data.
Q: IPPD budget allocation methods
A: Equal allocation (status quo), historical-data allocation (similar program/benchmarking), or reallocation based on new current task estimates (e.g., after reorganization).
Q: QA tools: CMM vs. portable CMM vs. Laser Tracker
A: CMM: fixed three-axis touch-probe machine measuring XYZ + hit vector. Portable CMM: robotic-arm with wrist/elbow/shoulder angular encoders, no deflection sensing. Laser Tracker: transportable, tracks an SMR ball via servo-driven angles/distance, needs operator correction for feature type.
`
});
