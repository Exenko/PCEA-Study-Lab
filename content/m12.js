PCEA.addModule({
  id: 'm12', num: 12, title: 'Software Cost Estimating', short: 'Software', source: 'guide',
  blurb: 'Labor-driven cost model. Size (SLOC, function points), equivalent SLOC (ESLOC), complexity and capability drivers, lifecycle models, diseconomies of scale.',
  intro: String.raw`Software cost is nearly 100\% **labor**, driven primarily by **size** (source lines of code or function points), adjusted for complexity, team capability, and schedule.

The estimator must characterize size, select/calibrate a parametric model, apply cost drivers, and cross-check with analogy. Expect **cost and size growth** during development—it is the norm, not the exception.

**Key difference from hardware:** copies are almost free; nearly all cost is development (non-recurring) and maintenance. No production learning curve.`,

  sections: [
    {
      id: 'overview',
      title: 'Software vs. Hardware',
      summary: 'Process, WBS, labor-heavy economics',
      body: String.raw`### Similarities
- Both follow a lifecycle: requirements → design → build → test → deployment
- Both benefit from WBS-driven bottom-up decomposition
- Both use analogy, parametric, and build-up estimating techniques
- Both experience cost growth and schedule risk

### Differences
| | Software | Hardware |
|---|---|---|
| **Cost composition** | Nearly 100\% labor; copies are almost free | Materials + labor + recurring production |
| **Production phase** | Development (non-recurring) dominates; maintenance is often > 50\% of LCC | Recurring unit production with learning curves |
| **Measurability** | Intangible: progress is hard to measure objectively | Physical, observable, measurable (weight) |
| **Change cost** | Seem cheap, so requirements **creep** unchecked | Expensive and visible, encouraging stability |
| **Observability** | "90\% done" is notoriously unreliable status | Hardware wear/failure patterns are traceable |

**Software does not wear out**; it fails due to latent defects and evolving requirements. Software is infinitely malleable, making scope control harder.

+++

### Software development process

Standard phases (names vary, but follow this arc):
1. **Requirements analysis** — define what the system must do
2. **Design** (architecture, then detailed design)
3. **Code** (implementation)
4. **Test** (unit, integration, system, acceptance)
5. **Deployment** and **Maintenance** (often the largest lifecycle cost bucket)

**Key insight:** Coding is only 15–25\% of total software development effort. Design, integration, and test consume the majority.

### WBS for software programs

- Mirror the **build/release structure** (e.g., by Computer Software Configuration Item, **CSCI**) rather than purely by lifecycle phase
- Each software WBS element should carry its own size, language, reuse, and complexity rating
- Integration, test, and program management are commonly captured as separate WBS elements because they do not scale linearly with size alone

:::check
Q: Why don't learning curves apply to producing copies of software?
* Replicating software costs almost nothing; the cost is in development, not repeated production
- Software teams never learn
- Software has no labor cost
> There is no repeated manufacturing of each unit, so there is no production learning to model.
:::

:::check
Q: Compared to hardware estimating, what is a unique difficulty in software cost estimating?
- Software has no WBS structure
* Progress is intangible and hard to measure objectively (e.g., "90% done" is unreliable)
- Software always scales linearly with effort
> Software work products (design, architecture) are invisible, unlike physical hardware, making real progress assessment difficult.
:::
`
    },

    {
      id: 'size',
      title: 'Size Metrics: SLOC and Function Points',
      summary: 'Definitions, ESLOC with adjustment factors, function point counting',
      body: String.raw`### Source Lines of Code (SLOC)

**Definition:** Count of lines of code delivered. Conventions vary (logical vs. physical lines, comments, blank lines), so **consistency of counting** is essential between historical data and new estimate.

**Example of the problem:** The same function in C may be 20 lines; in Python, 10 lines. Raw SLOC comparison across languages is misleading.

### Equivalent SLOC (ESLOC): reuse and modification

Modified or reused code is cheaper than new code, but **not free**. Convert mixed code to **equivalent new-code size** using **adaptation adjustment factors** for design, code, and test effort.

$$AAF = 0.4(\text{\% Design modified}) + 0.3(\text{\% Code modified}) + 0.3(\text{\% Integration/Test effort})$$

$$ESLOC = New\,SLOC + Modified\,SLOC \times AAF + Reused\,SLOC \times AAF$$

+++

:::example
10,000 new SLOC, 5,000 modified (20\% design, 30\% code, 10\% test), 20,000 reused (0\% design, 0\% code, 5\% test).

Modified: $AAF = 0.4(0.20) + 0.3(0.30) + 0.3(0.10) = 0.20$
Reused: $AAF = 0.4(0) + 0.3(0) + 0.3(0.05) = 0.015$
ESLOC $= 10,000 + 5,000(0.20) + 20,000(0.015) = 11,300$ ESLOC

**35,000 physical SLOC → 11,300 ESLOC**. Reuse reduces cost dramatically but does **not** make code free.
:::

:::check
Q: DM = 20\%, CM = 40\%, IM = 100\%. What is the AAF?
= 0.5 ±0.01
> $0.4(0.2) + 0.3(0.4) + 0.3(1.0) = 0.08 + 0.12 + 0.30 = 0.50$
:::

:::check
Q: 20 KSLOC new, 10 KSLOC modified (AAF 0.5), 30 KSLOC reused (AAF 0.1). ESLOC in K?
= 28 ±0.5
> $20 + (10 \times 0.5) + (30 \times 0.1) = 20 + 5 + 3 = 28$ KESLOC
:::

:::check
Q: 15 KSLOC new, 8 KSLOC modified (15\% design, 20\% code, 25\% test), 12 KSLOC reused (0\% design, 0\% code, 10\% test). ESLOC in K (use $AAF = 0.4(\%D) + 0.3(\%C) + 0.3(\%T)$)?
= 16.9 ±0.2
> Modified: $AAF = 0.4(0.15) + 0.3(0.20) + 0.3(0.25) = 0.06 + 0.06 + 0.075 = 0.195$. Reused: $AAF = 0.3(0.10) = 0.03$. $ESLOC = 15 + (8 \times 0.195) + (12 \times 0.03) = 15 + 1.56 + 0.36 = 16.92$ KESLOC
:::

+++

### Function Points (FP)

**Definition:** A size measure based on **functionality as seen by the user** (inputs, outputs, files), independent of programming language. Available earlier than SLOC (from requirements).

**Five function types** (IFPUG):
1. **External Inputs (EI):** data entry, commands → weights 3/4/6 (low/avg/high)
2. **External Outputs (EO):** reports, displays → weights 4/5/7
3. **External Inquiries (EQ):** interactive queries → weights 3/4/6
4. **Internal Logical Files (ILF):** databases → weights 7/10/15
5. **External Interface Files (EIF):** data from other systems → weights 5/7/10

**Process:**
1. Count each type at each complexity level; apply weights → **Unadjusted Function Points (UFP)**
2. Apply **Value Adjustment Factor (VAF)** based on 14 General System Characteristics (communications, performance, reusability, etc., rated 0–5):

$$VAF = 0.65 + 0.01 \sum_{i=1}^{14} GSC_i$$

$$AFP = UFP \times VAF$$

+++

:::example
10 EI (avg, weight 4) = 40; 5 EO (avg, weight 5) = 25; 8 EQ (avg, weight 4) = 32; 3 ILF (avg, weight 10) = 30; 2 EIF (avg, weight 7) = 14.

$UFP = 40 + 25 + 32 + 30 + 14 = 141$

GSC ratings sum to 35 (out of 70 max). $VAF = 0.65 + 0.01(35) = 1.00$

$AFP = 141 \times 1.00 = 141$ Adjusted Function Points.

FP converts to SLOC via language-specific "backfiring" ratios (roughly 50–130 SLOC/FP depending on language).
:::

:::tip
Function points are language-independent and available early (before language choice). SLOC is language-dependent and hard to estimate before code exists. Use FP for early estimates, SLOC for calibration once code exists.
:::

:::check
Q: 8 EI (avg, weight 4), 6 EO (avg, weight 5), 4 EQ (avg, weight 4), 2 ILF (avg, weight 10), 3 EIF (avg, weight 7). Sum of 14 GSC ratings = 40. What is AFP?
= 125 ±1
> $UFP = (8 \times 4) + (6 \times 5) + (4 \times 4) + (2 \times 10) + (3 \times 7) = 32 + 30 + 16 + 20 + 21 = 119$. $VAF = 0.65 + 0.01(40) = 1.05$. $AFP = 119 \times 1.05 = 124.95 \approx 125$
:::
`
    },

    {
      id: 'drivers',
      title: 'Cost Drivers: Complexity, Capability, Schedule',
      summary: 'What adjusts the size-based estimate',
      body: String.raw`Size alone does not determine effort. Software estimates multiply size by **effort adjustment factors (EAF)** representing project-specific conditions.

### Complexity

**Real-time, embedded, and safety-critical** software costs more per line than business applications. Complexity multipliers typically range 0.7 (simple) to 1.5+ (very high). Ratings are usually qualitative: Low (≤1.0), Nominal (1.0), High (1.0–1.5), Very High (>1.5).

### Capability

**Team experience and tool maturity** reduce effort:
- Analyst and programmer skill level
- Application domain experience
- Modern development tools and practices
- CMMI or similar process maturity

High capability can reduce effort by 20–30\%; low capability raises it by 50\%+.

### Development Schedule

**Critical insight:** Software schedule is **not** simply effort ÷ headcount.

- Adding people to a late software project often makes it **later** (communication overhead grows; Brooks' Law).
- Parametric models produce a **nominal schedule** as a function of effort, reflecting inherent sequential constraints (design precedes code; code precedes test).
- Schedule **compression** below nominal requires more staff and carries a cost in defects, rework, and often in calendar time anyway.

+++

:::check
Q: What happens to effort when the schedule is compressed well below nominal?
* It rises
- It falls proportionally
- No change
> Compression requires more staff working in parallel, which adds communication and integration overhead, increasing total effort.
:::

:::warn
**Do not assume schedule = effort ÷ staff.** Software has inherent sequential dependencies and communication overhead. Use a schedule equation, not simple division.
:::

:::check
Q: A project has high complexity (multiplier 1.3), high reliability requirement (1.4), but high capability team (0.85). What is the combined EAF?
= 1.54 ±0.02
> $EAF = 1.3 \times 1.4 \times 0.85 = 1.547$
:::
`
    },

    {
      id: 'lifecycle',
      title: 'Development Lifecycle Models',
      summary: 'Waterfall, Incremental, Evolutionary, Spiral',
      body: String.raw`Different lifecycle models have different cost/schedule implications and different levels of estimating confidence.

### Waterfall

- **Sequential**, phase-gate approach: requirements → design → code → test → deploy
- Each phase finishes before the next begins
- **Estimating advantage:** Requirements and scope are fully known before coding; clear milestones
- **Estimating risk:** Defects found late are very costly; requirements changes are expensive

### Incremental

- System developed and delivered in successive **builds**; requirements known up front but delivery is staged
- Each increment adds new functionality to a stable core
- **Estimating advantage:** Each increment can be sized and estimated somewhat independently; integration overhead is additive

### Evolutionary

- Requirements **not fully known up front**; system evolves through repeated cycles of develop → evaluate → refine
- Later scope is uncertain
- **Estimating challenge:** Hard to estimate total cost/schedule at start; wide ranges required; estimates refined each cycle; must account for rework

### Spiral Model (Boehm)

- Combines iterative development with explicit **risk analysis** at each cycle
- Each spiral includes: determine objectives → identify/resolve risks → develop/verify → plan next
- **Estimating advantage:** Cost estimate updated at each spiral; risk-driven go/no-go decisions
- **Estimating challenge:** Requires multiple estimates over time, not a single fixed-price commitment early

+++

:::check
Q: Which model is explicitly risk-driven with prototyping in each cycle?
- Waterfall
- Incremental
* Spiral
- Evolutionary
> Boehm's spiral model runs each iteration around identifying and resolving the biggest risks.
:::

:::key
**Waterfall** allows a confident single-point estimate at program start (scope is fully known). **Spiral** expects estimates to be refined at each iteration. The choice of model affects how certain an early estimate can be.
:::

:::check
Q: In which lifecycle model are requirements not fully known at program start, and estimates must be refined each cycle?
- Waterfall
- Incremental
* Evolutionary (also called Agile/Iterative)
- Spiral uses risk analysis but assumes requirements are known
> Evolutionary development accepts that requirements emerge during development, so total cost/schedule estimates remain wide and are updated iteratively.
:::
`
    },

    {
      id: 'parametric',
      title: 'Parametric Estimating: The Effort Equation',
      summary: 'Size, scale exponent, cost drivers; diseconomies of scale',
      body: String.raw`### General form

$$Effort = a \times Size^{b} \times EAF$$

- $Effort$ = person-months (or person-hours)
- $Size$ = ESLOC (in thousands: KESLOC) or function points
- $a$ = productivity/calibration constant (depends on organization and environment)
- $b$ = **scale exponent**: how fast effort grows relative to size
- $EAF$ = Effort Adjustment Factor = product of individual cost driver multipliers

### The scale exponent: diseconomies of scale

**For software, $b$ typically exceeds 1.0.** Doubling size multiplies effort by more than double.

$$\text{Effort multiplier when size doubles} = 2^b$$

**Why?** Coordination overhead, interface management, and integration complexity grow **disproportionately** as systems grow larger. This is the opposite of hardware, where bigger production runs reduce unit cost (learning curves/economies of scale).

- $b = 1.0$: Linear (effort doubles when size doubles) — rare
- $b = 1.05$ to $1.15$: Typical software diseconomy
- $b > 1.2$: Very large systems with high complexity

+++

:::check
Q: With exponent $b = 1.1$, doubling the size multiplies effort by about…
= 2.144 ±0.003
> $2^{1.1} = 2.144$, more than double. This is the diseconomy of scale.
:::

:::check
Q: $a = 2.94, b = 1.1$, size = 100 KSLOC, all multipliers = 1. Effort in PM?
= 466 ±2
> $2.94 \times 100^{1.1} = 2.94 \times 158.5 = 466$ PM
:::

:::check
Q: $a = 3.2, b = 1.08$, size = 75 KESLOC, EAF = 1.2. Effort in PM (nearest whole)?
= 407 ±3
> $3.2 \times 75^{1.08} \times 1.2 = 3.2 \times 127.1 \times 1.2 \approx 407$ PM
:::

+++

### Cost driver multipliers (illustrative scales)

Most COCOMO-family models rate each driver on a scale (Very Low to Extra High) and map to a numeric multiplier:

| Rating | Effect |
|---|---|
| Very Low | Multiplier < 1.0 (reduces effort) |
| Low | Multiplier ≈ 0.85–0.95 |
| Nominal | Multiplier = 1.0 (no adjustment) |
| High | Multiplier ≈ 1.1–1.3 |
| Very High | Multiplier ≈ 1.3–1.6+ |
| Extra High | Multiplier 1.6–2.0+ (only for a few drivers, e.g., reliability, complexity) |

**EAF** is the product of all driver multipliers. A project with several "High" or "Very High" ratings (high reliability, tight schedule, high complexity) can reach EAF = 1.5 to 2.0 or more.

:::tip
Cost driver selection is **as important as size** in a credible software estimate. A 50 KSLOC project can cost 100 PM (nominal) or 300 PM (high reliability + tight schedule) depending on drivers.
:::

:::widget sw-effort:::

:::challenge sw-effort A=2.94 E=1.1 s=100 lock=A,E
Q: With $E = 1.10$, the program's size doubles from 100 to 200 KSLOC. Predict the factor by which effort grows.
predict: doubleX +- 1%
> Effort scales by $2^{E} = 2^{1.10} \approx 2.14$. Doubling the size more than doubles the effort: that's the diseconomy of scale built into most software cost models.
:::

:::challenge sw-effort A=2.94 E=1.1 s=100 lock=A,s
Q: Find the exponent at which doubling the size exactly doubles the effort.
goal: doubleX ~ 2 +- 0.5%
show: E=1
> At $E = 1$, effort is proportional to size, so productivity (SLOC per person-month) is flat. Above 1, productivity falls as programs grow; below 1, it rises.
:::`
    },

    {
      id: 'schedule',
      title: 'Schedule, Productivity, and Effort Growth',
      summary: 'Schedule equation, productivity metrics, why estimates grow',
      body: String.raw`### Schedule equation

$$Schedule = c \times Effort^{d}$$

Where $d$ is typically **less than 1.0** (illustrative value 0.3–0.4), reflecting that schedule grows more slowly than effort. You **cannot** compress schedule linearly by adding staff.

**Implication:** Doubling effort does not double the calendar schedule. Adding more people to a late project often makes it later because communication overhead and rework dominate.

+++

:::check
Q: If Effort = 200 PM and Schedule = 3.0 × Effort^0.35, what is the nominal schedule in months?
= 19.6 ±0.2
> $3.0 \times 200^{0.35} = 3.0 \times 6.53 = 19.6$ months
:::

:::check
Q: With exponent $d = 0.4$, doubling the effort multiplies the schedule by approximately…
= 1.32 ±0.01
> $2^{0.4} \approx 1.32$. Schedule grows much more slowly than effort, so you cannot compress calendar time proportionally by adding people.
:::

+++

### Productivity: SLOC/hour or hours/SLOC

Quick rough-order-of-magnitude estimating:

$$Productivity = \frac{SLOC}{Effort(hours)} \text{ or } \frac{hours}{SLOC}$$

**Example:** Team delivered 45,000 ESLOC in 15,000 labor-hours → productivity = 3.0 SLOC/hour or 0.33 hours/SLOC. If next CSCI is 60,000 ESLOC, effort = 60,000 ÷ 3.0 = 20,000 hours.

:::warn
Productivity-based estimating (straightforward size ÷ productivity) assumes $b = 1$ and $EAF = 1$. It does **not** capture diseconomies of scale or cost drivers. Use it only for quick checks, not as a primary technique.
:::

+++

### Why software estimates grow

Size and effort tend to **grow** over development due to:
- Requirements creep (scope expands; original estimate was too narrow)
- Discovered complexity (actual integration effort higher than expected)
- Elaboration of immature requirements (early estimates are systematically optimistic)
- Rework and defect resolution

**Historical data shows growth is the norm, not the exception.** Estimators should apply a **growth factor** (e.g., 20–40\%, depending on maturity) to size early estimates and/or add explicit risk reserve to cost and schedule.

:::check
Q: Early requirements suggest 50 KSLOC. Historical size growth on similar programs averages 30\%. What size should you estimate?
= 65 ±1
> $50 \times 1.30 = 65$ KSLOC. Apply the growth factor upfront.
:::
`
    },

    {
      id: 'techniques',
      title: 'Estimating Techniques: Analogy and Parametric',
      summary: 'Two primary techniques; when to use each',
      body: String.raw`### Analogy

Compare the new software system to a **similar, historical system** with known actual cost, adjusting for differences in size, complexity, and capability. Most credible when the analogous system is truly similar in application domain, language, and environment.

**Advantages:**
- Requires only knowledge of a comparable project
- Often available early (pre-Milestone A)
- Can be highly credible if the comparison is close

**Disadvantages:**
- Depends on finding a truly analogous project
- Adjustments for differences can be subjective
- Often used as a **cross-check** rather than a primary technique

### Parametric

Uses a **CER** (cost estimating relationship) or regression model calibrated to historical data, relating size and cost drivers to effort.

**Advantages:**
- Captures size and cost driver effects systematically
- Can be calibrated to your organization's own data
- Provides a repeatable, auditable method
- Diseconomies of scale are built in

**Disadvantages:**
- Requires historical data to calibrate
- Model coefficients ($a$, $b$, EAF ratings) must be tailored to your domain
- Generic, uncalibrated industry averages can be far off

+++

:::key
**Use both analogy and parametric as cross-checks.** If they disagree, the difference signals uncertainty; investigate why before committing to an estimate.
:::

:::check
Q: When is analogy estimating most credible for a new software CSCI?
* When the analogous system is in the same domain, language, and environment
- When a parametric model doesn't exist
- Always, as a replacement for parametric
> Analogy depends on true similarity; incorrect analogies can be worse than no estimate at all.
:::

:::warn
**Do not use uncalibrated, generic industry coefficients.** They reflect averages across diverse domains, languages, and processes. Calibrate to your organization's historical data (SRDR, internal project data) or the closest comparable reference class. Uncalibrated models can produce errors of ±50\% or more.
:::

:::check
Q: Why must a parametric effort model be calibrated to an organization's own historical data?
* Productivity rates vary dramatically by domain, language, tools, and process maturity; generic coefficients can produce ±50\% errors
- Calibration is optional
- All software has the same productivity
> Historical diversity in software projects is well-documented; generic models reflect broad averages that hide critical project-specific variation.
:::
`
    },

    {
      id: 'challenges',
      title: 'Challenges in Software Estimating',
      summary: 'Six key obstacles and how to address them',
      body: String.raw`| Challenge | Why it matters | Mitigation |
|---|---|---|
| **System Definition** | Immature requirements mean unknown scope at estimate time | Document assumptions; plan for requirements volatility; use wide ranges |
| **Sizing & Technology** | Early size estimates are very uncertain; new languages/tools lack history | Estimate size with multiple methods; apply growth factors; calibrate to new technology data as it emerges |
| **Quality & Reliability** | Higher required reliability (DO-178C, safety-critical) substantially increases effort | Apply quality/reliability multiplier (can be 2x or more); include rigorous design review, test |
| **COTS Integration** | COTS is not free: licensing, glue code, integration, vendor upgrades, compatibility risk | Treat COTS integration like reused code; estimate design, code, and test effort separately |
| **Calibration** | Productivity rates vary enormously by domain, language, environment | Calibrate models to your organization's data; track SRDRs (Software Resources Data Reports); update coefficients as practices evolve |
| **Growth & Demand** | Size and effort grow during development (documented historical pattern) | Apply growth factors to early estimates; include risk/contingency; revisit estimate as requirements mature |

+++

### General best practices

- Document all sizing assumptions, counting conventions (logical vs. physical SLOC), and cost driver ratings
- Use **multiple independent techniques** (analogy + parametric) to cross-check
- Include the **whole life cycle:** maintenance is often more than 50\% of total software cost
- Treat schedule as a **driver** that affects effort, not an output you can freely compress
- Update estimates as requirements and technology choices become known

### IT estimating specifics

Business IT and automated information systems add:
- COTS/ERP configuration (not just off-the-shelf cost, but implementation)
- Data migration
- Infrastructure (hosting, cloud, networking)
- Cybersecurity and compliance
- Help desk and operations

Often **more cost is in deployment and operations than in code itself.** Apply even higher growth factors and maintenance contingency for IT programs.

+++

:::check
Q: Which statement about COTS software is correct?
- It eliminates development cost
* It still carries integration, licensing, glue code and upgrade costs
- It never needs maintenance
> COTS moves cost around rather than eliminating it.
:::

:::check
Q: Early estimate for a new system is 40 KSLOC. Historical data on similar programs shows average size growth of 35\% from initial estimate to delivery. What total size should the estimate account for?
= 54 ±1
> $40 \times (1 + 0.35) = 40 \times 1.35 = 54$ KSLOC. Growth is the norm, not the exception; build it in upfront.
:::

:::warn
**Apply growth factors and risk reserves.** Size and requirements creep is not a risk; it is the documented baseline expectation. Early estimates should include 20–40\% contingency for size/effort growth, depending on how immature requirements are.
:::`
    }
  ],

  cards: String.raw`
## Overview
Q: Key differences: software cost vs. hardware cost
A: Software is nearly 100% labor, copies are free, no production learning curve. Maintenance often >50% of lifecycle cost. Nearly infinitely malleable (requirements creep).
Q: What is CSCI?
A: Computer Software Configuration Item: a software element in the WBS managed as a unit.
Q: Which phases make up the majority of software development effort?
A: Design, integration, and test (coding is only 15–25%).
Q: Why is software progress ("90% done") hard to measure objectively?
A: Software is intangible; progress cannot be measured like physical progress.
Q: Similarities: software and hardware estimating
A: Both follow a lifecycle; both use WBS, analogy, parametric, and build-up techniques; both experience cost growth and schedule risk.

## Size Metrics
Q: Primary driver of software effort
A: Size (SLOC or function points).
Q: SLOC: definition and counting pitfall
A: Lines of code delivered. Conventions vary (logical vs. physical, comments/blank lines), so consistency is critical.
Q: Why SLOC varies by language
A: The same logic can be 20 lines in C or 10 lines in Python; raw SLOC comparison across languages is misleading.
Q: Equivalent SLOC (ESLOC)
A: New + Modified × AAF + Reused × AAF. Converts a mix of new/modified/reused code to equivalent new-code effort.
Q: Why isn't reused code counted as zero cost?
A: Reused code still requires understanding, integration, regression testing, and verification; it always carries a small but nonzero AAF.
Q: COCOMO adaptation adjustment factor (AAF)
A: 0.4 × (% design) + 0.3 × (% code) + 0.3 × (% test/integration)
Q: How to read: DM=15%, CM=25%, IM=20%
A: Design 15% modified, code 25% modified, integration 20% effort needed.
Q: Function Points: definition
A: A language-independent size measure based on delivered functionality (inputs, outputs, files) as seen by the user.
Q: Advantage of function points over SLOC
A: Language-independent; available earlier (from requirements); useful for cross-language comparison.
Q: Five IFPUG function point components
A: External Inputs (EI), External Outputs (EO), External Inquiries (EQ), Internal Logical Files (ILF), External Interface Files (EIF).
Q: How are function point types weighted?
A: Each type at each complexity level (Low/Avg/High) has a weight: EI 3/4/6, EO 4/5/7, EQ 3/4/6, ILF 7/10/15, EIF 5/7/10.
Q: UFP
A: Unadjusted Function Points: sum of all weighted function type counts.
Q: Value Adjustment Factor (VAF)
A: VAF = 0.65 + 0.01 × (sum of 14 GSC ratings). Adjusts UFP for system complexity.
Q: General System Characteristics (GSCs)
A: 14 characteristics (communication, performance, reusability, etc.) each rated 0–5 to set VAF.
Q: Backfiring (FP to SLOC conversion)
A: Convert FP to SLOC using language-specific ratio (roughly 50–130 SLOC/FP depending on language).

## Complexity and Capability
Q: What is complexity in software estimating?
A: Difficulty of logic/algorithms; real-time, embedded, safety-critical software is far more complex (costly) than simple data applications.
Q: Effect of high complexity on effort
A: Multiplier typically 1.1–1.5+ (20–50% increase or more) compared to nominal.
Q: Capability: definition
A: Team experience, programmer skill, domain expertise, tool maturity, process maturity (CMMI).
Q: Effect of high capability on effort
A: Reduces effort by 20–30% compared to nominal (lower multiplier).
Q: Why is schedule compression difficult in software?
A: Adding people increases communication overhead; inherent sequential constraints (design→code→test) cannot be paralleled away.
Q: Brooks' Law
A: Adding people to a late software project often makes it later.
Q: What is the nominal schedule?
A: Parametric output reflecting inherent sequential/critical-path constraints, independent of staffing level.

## Lifecycle Models
Q: Waterfall model
A: Sequential phases, each finished before the next. Predictable, easy to estimate/plan, but inflexible and defects found late are costly.
Q: Incremental model
A: Delivery in successive builds; requirements known up front but delivered in stages. Each build can be estimated independently.
Q: Evolutionary model
A: Requirements refined as builds are fielded. Later scope uncertain; estimates must be wide and refined each cycle.
Q: Spiral model (Boehm)
A: Iterative, risk-driven cycles: determine objectives → identify/resolve risks → develop/verify → plan next cycle.
Q: Estimating advantage of Waterfall
A: Single confident fixed estimate at program start (scope fully known upfront).
Q: Estimating challenge of Spiral
A: Estimates must be revisited and refined at each iteration; no single fixed-price commitment early.
Q: Which lifecycle allows the most confident early estimate?
A: Waterfall (requirements and scope fully known before coding).

## Effort Equation
Q: General parametric effort equation form
A: Effort = a × Size^b × EAF
Q: Meaning of a in the effort equation
A: Productivity/calibration constant (depends on organization and environment).
Q: Meaning of b in the effort equation
A: Scale exponent: how fast effort grows relative to size. For software, b > 1.0 (diseconomies of scale).
Q: Meaning of EAF
A: Effort Adjustment Factor: product of multipliers for complexity, capability, schedule, reliability, etc.
Q: What does b = 1.0 mean?
A: Linear: effort doubles when size doubles (rare for software).
Q: Typical range of b for software
A: 1.05 to 1.15 (diseconomy of scale).
Q: Diseconomies of scale: definition
A: Effort grows faster than size (b > 1.0). Doubling size multiplies effort by more than double.
Q: Why software exhibits diseconomies of scale
A: Coordination overhead, interface management, and integration complexity grow disproportionately as systems grow.
Q: Hardware vs. software scale effects
A: Hardware: bigger production runs reduce unit cost (economies of scale). Software: bigger systems are proportionally more expensive per line (diseconomies).
Q: Effect of doubling size when b = 1.1
A: Effort multiplied by 2^1.1 ≈ 2.14, more than double.
Q: Very High cost driver multiplier range
A: Typically 1.3–1.6+ (some drivers, e.g., high reliability, can reach 2.0+).
Q: How to interpret EAF = 2.0
A: Project costs twice as much effort as nominal (due to combined cost drivers: high complexity, tight schedule, high reliability, etc.).

## Schedule and Productivity
Q: Schedule equation form
A: Schedule = c × Effort^d, where d typically < 1.0 (schedule grows more slowly than effort).
Q: Typical range of exponent d
A: 0.3–0.4 (so schedule grows much more slowly than effort).
Q: What does d < 1.0 mean for scheduling?
A: You cannot compress schedule linearly by adding staff. Doubling effort does not double calendar schedule.
Q: Can you compress software schedule below the nominal level?
A: Yes, but with costs: more staff (communication overhead), higher defect rates, rework, and often little actual calendar reduction.
Q: Productivity: SLOC/hour formula
A: Productivity = SLOC / Effort(hours) (inverse: hours/SLOC).
Q: Quick productivity-based estimating formula
A: Effort = Size / Productivity. Assumes b = 1 and EAF = 1 (no cost drivers); use for ROM checks only.
Q: When is productivity-based estimating appropriate?
A: Quick rough-order-of-magnitude checks only; does not capture diseconomies of scale or cost drivers.
Q: Example: productivity 3.0 SLOC/hour, size 60,000 ESLOC
A: Effort = 60,000 / 3.0 = 20,000 hours.

## Growth and Challenges
Q: Why do software size estimates grow?
A: Requirements creep, discovered complexity, elaboration of immature requirements, rework, integration effort higher than expected.
Q: Is software size/effort growth the exception or the norm?
A: Norm: historical data consistently shows growth between initial estimate and final delivery.
Q: What should an estimator do about expected growth?
A: Apply growth factor (20–40\%, depending on maturity) upfront, or add explicit risk/contingency to estimate.
Q: System Definition challenge
A: Immature requirements at estimate time mean unknown scope; plan for volatility.
Q: Sizing and Technology challenge
A: Early size estimates are very uncertain; new languages/tools lack calibration history.
Q: Quality/Reliability challenge
A: Higher required reliability (DO-178C, safety-critical) multiplies effort (can be 2x or more compared to nominal).
Q: COTS challenge
A: COTS is not free: integration, licensing, glue code, vendor upgrades, compatibility risk.
Q: Calibration challenge
A: Productivity rates vary enormously; uncalibrated generic coefficients can be ±50\% off or more.
Q: Best practice to mitigate calibration risk
A: Calibrate models to your organization's data (SRDRs, internal projects); update coefficients as practices/technologies evolve.
Q: What is SRDR?
A: Software Resources Data Report: DoD data on software size, effort, schedule from contractors.
Q: IT estimating: distinctive cost elements
A: COTS/ERP configuration, data migration, infrastructure/hosting, cybersecurity, help desk, operations (often >50% of cost).
Q: Why is IT estimating harder than development alone?
A: More cost in deployment and operations than in code; COTS dependency; infrastructure and compliance complexity.

## Techniques
Q: Analogy: definition
A: Compare new software to similar historical project with known cost; adjust for size, complexity, capability differences.
Q: Analogy: when most credible
A: When the analogous system is truly similar in domain, language, and environment.
Q: Analogy: advantage
A: Available early; requires only knowledge of a comparable project; highly credible if comparison is close.
Q: Analogy: disadvantage
A: Depends on finding a truly analogous project; adjustments can be subjective.
Q: Parametric: definition
A: Uses a CER calibrated to historical data, relating size and cost drivers to effort.
Q: Parametric: advantage
A: Systematic, repeatable, auditable; diseconomies of scale built in; can be calibrated to your organization.
Q: Parametric: disadvantage
A: Requires historical data; coefficients must be tailored to domain; generic models can be far off.
Q: Primary estimation techniques for software
A: Analogy and parametric. Use both as cross-checks.
Q: What does disagreement between analogy and parametric suggest?
A: Uncertainty in the estimate; investigate the difference before committing.

## Common Mistakes
Q: "Reused code is zero cost" — why this is wrong
A: Reuse always carries integration, test, and verification effort; AAF properly weights this.
Q: Mixing SLOC counting conventions — why dangerous
A: Affects calibration; logical vs. physical lines can differ significantly; historical data and new estimate must use the same convention.
Q: "Software effort scales linearly with size" — why wrong
A: b > 1.0 for software; doubling size multiplies effort by more than double.
Q: "Schedule = Effort / staff" — why wrong
A: Ignores sequential constraints and communication overhead; schedule = c × Effort^d, d < 1.
Q: Using uncalibrated industry coefficients — why risky
A: Generic averages hide domain, language, and process differences; errors can be ±50\% or more.
Q: "Size will stay as estimated" — why unrealistic
A: Historical data shows growth is the norm; apply growth factors upfront.
Q: Confusing SLOC and FP without conversion — why wrong
A: Not directly interchangeable; must use language-specific backfiring ratio (50–130 SLOC/FP).
Q: Ignoring quality/reliability requirements — why risky
A: Can multiply effort by 2x or more; not all software has same productivity.
Q: Underestimating design, integration, test — why costly
A: Coding is minority of effort; requirements, design, integration, test dominate.

## Key Formulas
Q: Effort equation
A: $Effort = a \times Size^b \times EAF$
Q: Schedule equation
A: $Schedule = c \times Effort^d$ (d < 1)
Q: AAF
A: $0.4(\text{\% Design}) + 0.3(\text{\% Code}) + 0.3(\text{\% Test})$
Q: ESLOC
A: $New + Modified \times AAF + Reused \times AAF$
Q: VAF
A: $0.65 + 0.01 \times \sum (14\ GSC\ ratings)$
Q: AFP
A: $UFP \times VAF$
Q: Effort multiplier when size doubles
A: $2^b$ (when b > 1, multiplier > 2)
Q: Productivity
A: $SLOC / Effort(hours)$ or $hours / SLOC$
Q: Growth-adjusted size
A: $Initial\ Size \times (1 + Growth\ Factor)$
`
});
