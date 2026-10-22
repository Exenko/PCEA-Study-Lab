PCEA.addModule({
  id: 'm12', num: 12, title: 'Software Cost Estimating', short: 'Software', source: 'guide',
  blurb: 'Labor-driven cost model. Size (SLOC, function points), equivalent SLOC (ESLOC), complexity and capability drivers, lifecycle models, diseconomies of scale.',
  intro: String.raw`Software cost is driven primarily by **size** (source lines of code or function points), adjusted for complexity, team capability, and schedule.

The estimator must characterize size, select/calibrate a parametric model, and apply cost drivers. Expect **cost and size growth** during development: delivered size is often much larger than the original estimate.

**Key difference from hardware:** software is developed once and further produced by making copies; learning curves do not exist in software. Maintenance costs can be significantly higher than the cost of developing the software. This module uses the **COCOMO II** CER (Boehm) throughout because it is publicly available; many commercial models use similar but proprietary relationships.`,

  sections: [
    {
      id: 'overview',
      title: 'Software vs. Hardware',
      summary: 'Process, WBS, labor-heavy economics',
      body: String.raw`:::primer:::
Before software estimators can cost a program, they walk it through a fixed sequence of engineering steps.

:::order
Q: Put these software engineering steps in the order they happen.
1. Software Requirements Analysis
2. Software Preliminary and Detailed Design
3. Code and Unit Test
4. Unit Integration and Test
5. Software System Test
> Requirements are identified first, then designed, then coded and unit tested at the lowest level. Pieces are then integrated and tested at the CSCI level, and finally tested at the software system level.
:::

+++

### Similarities
- Both follow a lifecycle: requirements → design → build → test → deployment, and both require ongoing maintenance support once operational (included in the program's Life Cycle Cost Estimate)
- Hardware estimates can use any of the Module 2 costing techniques; the factors that influence software development costs are similar to those for hardware
- The three main cost driver categories are the same for both: **size, complexity, capability**

### Differences
| | Software | Hardware |
|---|---|---|
| **Cost composition** | Developed once; further produced by making copies; learning curves do not exist | Materials + labor + recurring production |
| **Production phase** | Developed once; software maintenance costs **can be significantly higher** than the cost of developing the software | Recurring unit production with learning curves |
| **Measurability** | Size measured by software metrics (FP, SLOC, etc.) | Size captured by physical measures (length, height, weight, performance requirements, number of units) |
| **Data/history** | Development moves fast (new languages, methodologies); historical data is limited or restricted | Longer, more mature history; slower, more predictable change |
| **Wear** | Does not degrade or wear out; does not break in a traditional sense, but continued use may uncover bugs that slipped through testing | Will often require replacement due to obsolescence or failure |

+++

### Software development process (system engineering steps)

CEBoK lists seven system engineering steps for software (based on MIL-STD-498):
1. **System Requirements and Design** (Hardware & Software) — documents each requirement and the overall plan for what hardware vs. software will satisfy, and the interfaces
2. **Software Requirements Analysis** — each requirement is identified, documented, given a unique ID, and placed under Change Management (CM) once baselined
3. **Software Preliminary and Detailed Design** — architecture-level, then detailed design; requirements may be allocated to Computer Software Configuration Items (**CSCI**) and further to Computer Software Components (**CSC**)
4. **Code and Unit Test** — coding at the unit level, tested at that lower level (unit testing is a **development** step, not a testing step)
5. **Unit Integration and Test** — CSCs combined and tested at the CSCI level
6. **Software System Test** — testing completed at the system level for software
7. **System Test** (Hardware & Software) — software is added to hardware and tested as an overall system

{{primer}}

### Work Breakdown Structure for software programs

Most organizations mandate a defined WBS (MIL-HDBK-881A gives guidance but allows tailoring; there are no industry standards for a WBS, although IEEE 12207 recommends the use of one). WBSs are based on either the activity or the product. Regardless of structure, the WBS should be at a sufficient level of detail to allow the project team to understand and estimate each element; it defines the content of the estimate and drives the cost estimate model structure and the content of CERs. Different projects may use terms such as modules, releases, sprints, or builds for what are essentially CSCIs.

Table 12.1 (partial WBS sample, CEBoK):

| WBS Element | SE Step for SW |
|---|---|
| 1.1 System | SE/PM (step 1) |
| 1.2 System SIT&E | step 7 |
| 1.3 Hardware | — |
| 1.4 Software → 1.4.1 Build I | |
| &nbsp;&nbsp;1.4.1.1 SE/PM | steps 2, 3 |
| &nbsp;&nbsp;1.4.1.2 SIT&E | steps 5, 6 |
| &nbsp;&nbsp;1.4.1.3 CSCI I | step 4 |
| &nbsp;&nbsp;1.4.1.4 CSCI II → CSC I, CSC II | step 4 |
| 1.4.2 Build II, 1.4.3 Build III | |

SIT&E = Systems Integration Test and Engineering.

:::tip Beyond CEBoK
When using actuals from one program's WBS to estimate another, confirm that both programs define WBS terms (CSCI, build, module) the same way.
:::

:::tip Beyond CEBoK
Coding is commonly cited (outside CEBoK's core text) as only about 15–25\% of total software development effort, with design, integration, and test consuming the majority. Software maintenance is also frequently cited as exceeding 50\% of total lifecycle cost. CEBoK does state maintenance "can be significantly higher" than development cost, without giving a specific percentage.
:::

:::check
Q: Why don't learning curves apply to producing copies of software?
* Software is developed once and further produced by making copies; learning curves do not exist in software
- Software teams never learn
- Software has no labor cost
> There is no repeated manufacturing of each unit, so there is no production learning to model.
:::

:::check
Q: Which system engineering step is considered part of software *development*, not testing?
- Software System Test
* Code and Unit Test
- System Test
- Unit Integration and Test
> Unit testing happens inside the "Code and Unit Test" step and is treated as development, not a test phase.
:::

:::check
Q: What does the WBS define for a software estimate?
* The content of the estimate; it drives the cost estimate model structure and influences the content of CERs
- Only the final schedule, not the cost model
- The labor rates used for every element
- A single industry-standard element list that must be used unchanged
> The WBS defines the content of the estimate and drives the cost estimate model structure and the content of CERs. There are no industry standards for a WBS.
:::
`
    },

    {
      id: 'size',
      title: 'Size Metrics: SLOC and Function Points',
      summary: 'Definitions, ESLOC with adjustment factors, function point counting',
      body: String.raw`:::primer:::
Reused code is cheaper than new code, but is it close to free?

:::check
Q: A system has 10,000 new, 5,000 modified, and 20,000 reused SLOC (35,000 total). Reuse is cheaper than new, but not free. About how many equivalent new-code lines (ESLOC) does that represent?
- About 35,000
* About 11,300
- About 10,000
- About 20,000
> Modified and reused code each count only partly, via a factor between zero and one. The worked example below gives 11,300 ESLOC, far below 35,000 but still above the 10,000 new lines because reuse is not free.
:::

+++

### Source Lines of Code (SLOC)

**Definition:** SLOC (also called delivered source instructions) typically includes executable instructions and data declarations but **excludes comments, blanks, and continuation lines**. There are no standardized rules for *estimating* SLOC before code exists — the most common technique is analogy. Once code is written, automated tools can count it accurately and consistently. This is one definition of SLOC, not the definition of SLOC.

**SLOC advantages:**
- Widely used; most software cost models take SLOC as their size input
- Many organizations already have SLOC-based historical data
- Easily counted by automated code counters once a project is complete

**SLOC disadvantages:**
- Due to a lack of defined rules, discrepancies can occur in SLOC counts, even with standard definitions
- Different languages require different numbers of lines of code to execute the same function, making comparisons impossible
- Dependent on developer skill and coding style

### Counting reused and adapted code

Software size is rarely all new. Common terms (definitions vary by organization, so confirm what is being counted):
- **Reused / verbatim**: copied directly with no modification
- **Adapted / customized / modified**: requires some redesign, recode, and retest
- **New**: requires 100\% design, code, and test

### Equivalent SLOC (ESLOC): reuse and modification

Modified or reused code is cheaper than new code, but **not free**. In calculating ESLOC, include only the amount of design modification, code modification, integration, and testing that would be required in a new development effort. New code requires 100\% design, code, and test. Theoretically, reused code does not require any new design or code and minimal test; the estimator should determine whether the code is retested as standalone code or with the overall system. All code requires some degree of retest prior to software/hardware integration even if no redesign or recode is necessary.

Barry Boehm provides a simple equation to calculate ESLOC:

$$ESLOC = SLOC \times [0.40(\text{\% design modified}) + 0.30(\text{\% code modified}) + 0.30(\text{\% integration and test})]$$

where SLOC is the adapted code. This multiplies the total adapted source lines of code by a factor between zero and one, assuming some of the software needs to be redesigned, recoded, and retested.

:::tip Beyond CEBoK
This app calls the bracketed factor the adaptation adjustment factor (AAF) and applies it to each adapted category of a mixed code base: $ESLOC = New\,SLOC + Modified\,SLOC \times AAF + Reused\,SLOC \times AAF$. The worked examples and practice questions below use this extension. The 0.4/0.3/0.3 split assumes 40\% of a new-development effort is design, 30\% code, 30\% integration and test; other ratios (e.g., 40/25/35) are also used, but the weights should sum to 100\%.
:::

+++

:::example
10,000 new SLOC, 5,000 modified (20\% design, 30\% code, 10\% test), 20,000 reused (0\% design, 0\% code, 5\% test).

Modified: $AAF = 0.4(0.20) + 0.3(0.30) + 0.3(0.10) = 0.20$
Reused: $AAF = 0.4(0) + 0.3(0) + 0.3(0.05) = 0.015$
ESLOC $= 10,000 + 5,000(0.20) + 20,000(0.015) = 11,300$ ESLOC

**35,000 physical SLOC → 11,300 ESLOC**. Reuse reduces cost dramatically but does **not** make code free.
:::

{{primer}}

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

**Definition:** International Function Point Users Group (IFPUG) function points are a size measure based on the Functional User Requirements (FUR), developed by IBM in the 1970s. The rules for IFPUG FPs are defined in the Counting Practices Manual (CPM). FPs are based on the requirements documentation, data schema, architectural diagrams, user manuals, and other sources used to identify the FUR for the project.

**Five-step counting process (CEBoK):**
1. Determine the type of FP count
2. Identify the scope and boundaries of the application
3. Count the data function types and transaction function types
4. Calculate the UFP and the VAF
5. Calculate the AFP

:::tip Beyond CEBoK
IFPUG detail not spelled out in CEBoK's text, which names only data/transaction function types, UFP, VAF, and AFP. Five function types, each counted at low/average/high complexity:
1. **External Inputs (EI):** data entry, commands → weights 3/4/6
2. **External Outputs (EO):** reports, displays → weights 4/5/7
3. **External Inquiries (EQ):** interactive queries → weights 3/4/6
4. **Internal Logical Files (ILF):** databases → weights 7/10/15
5. **External Interface Files (EIF):** data from other systems → weights 5/7/10

$$VAF = 0.65 + 0.01 \sum_{i=1}^{14} GSC_i$$

$$AFP = UFP \times VAF$$

where VAF is the Value Adjustment Factor based on 14 General System Characteristics (GSCs), each rated 0–5.
:::

+++

:::example
Beyond CEBoK (IFPUG detail): 10 EI (avg, weight 4) = 40; 5 EO (avg, weight 5) = 25; 8 EQ (avg, weight 4) = 32; 3 ILF (avg, weight 10) = 30; 2 EIF (avg, weight 7) = 14.

$UFP = 40 + 25 + 32 + 30 + 14 = 141$

GSC ratings sum to 35 (out of 70 max). $VAF = 0.65 + 0.01(35) = 1.00$

$AFP = 141 \times 1.00 = 141$ Adjusted Function Points.
:::

**FP advantages:** available early (from high-level requirements); usable throughout the lifecycle; language- and technology-agnostic; not affected by programmer skill, style, or experience.

**FP disadvantages:** requires trained analysts to apply the Counting Practices Manual (CPM) correctly; takes more time/effort than a subjective count like SLOC; does not measure non-functional/technical requirements (IFPUG's **SNAP** — Software Non-functional Assessment Process — was developed to fill this gap).

:::tip Beyond CEBoK
FP-to-SLOC "backfiring" ratios (roughly 50–130 SLOC per FP depending on language) are a widely cited industry rule of thumb, not a number CEBoK's core text specifies — treat any specific ratio as something to calibrate locally.
:::

:::check
Q: (IFPUG detail, Beyond CEBoK) 8 EI (avg, weight 4), 6 EO (avg, weight 5), 4 EQ (avg, weight 4), 2 ILF (avg, weight 10), 3 EIF (avg, weight 7). Sum of 14 GSC ratings = 40. What is AFP?
= 125 ±1
> $UFP = (8 \times 4) + (6 \times 5) + (4 \times 4) + (2 \times 10) + (3 \times 7) = 32 + 30 + 16 + 20 + 21 = 119$. $VAF = 0.65 + 0.01(40) = 1.05$. $AFP = 119 \times 1.05 = 124.95 \approx 125$
:::

:::check
Q: Why can requirements growth alone significantly increase software cost even if the code is well written?
* Size is the primary cost driver, so growth in requirements grows the size estimate and therefore the effort
- Requirements growth only affects schedule, never cost
- Function points are immune to requirements growth
- Growth only matters after delivery
> Capers Jones assessments cited by CEBoK indicate requirements increase on average from less than 1\% on small end-user systems to 64\% on very large military systems — and since size drives effort, that growth drives cost.
:::
`
    },

    {
      id: 'drivers',
      title: 'Cost Drivers: Complexity and Capability',
      summary: 'The second and third main cost-driver categories, per CEBoK/COCOMO II',
      body: String.raw`:::primer:::
Size is not the only thing that moves software cost. Two more driver categories sit behind the multipliers.

:::sort
Q: Which driver category does each factor belong to?
buckets: Complexity | Capability
- Number of modules to integrate = Complexity
- Hardware limitations such as constrained memory = Complexity
- Programming language = Complexity
- Application experience of the team = Capability
- Experience with the development tools = Capability
- Development location = Capability
> Complexity covers the difficulty of the software itself: language, function, hardware limitations, number of modules, and integration. Capability covers the team and its working conditions: application experience, general skill, schedule constraints, tools experience, and development location.
:::

+++

Beyond size, COCOMO II expresses effort as:

$$PM = A \times Size^{E} \times \prod_{i=1}^{n} EM_i$$

where $A = 2.94$ (a constant), $Size$ is KSLOC, $E$ is the sum of scale factors, and $EM_i$ are effort multipliers for complexity, capability, schedule, and other cost drivers.

### Complexity

Complexity is the second broad area of cost drivers, related to the complexity of the software itself. It relates to the functionality the software must perform and can also be reflected in the language(s) and platform used. CEBoK's list: language, function (intended use), hardware limitations, number of modules, amount of integration, percent of new code, and quality of development (used for maintenance). CEBoK notes there is little published statistical proof of complexity's significance, a symptom of scarce software cost data.

**Table 12.3 (Complexity as a cost driver, 100 KSLOC example, nominal capability):**

| Rating | EAF | PM | Cost @ \$16,000/PM |
|---|---|---|---|
| Very Low | 0.60 | 279 | \$4,467,027 |
| Nominal | 1.00 | 465 | \$7,445,045 |
| Very High | 3.50 | 1,628 | \$26,057,657 |

These EAF values are the *product* of several individual complexity multipliers, all set to best-case or worst-case — an illustration of the extreme, not a typical project.

**Language** ranges from machine language (1GL) through assembly (2GL) to High-Order Languages such as FORTRAN, C, Ada, COBOL (3GL), toward future 4GLs. Object-oriented languages (Ada 95, C++) shift effort toward design and reduce code/test effort.

**Function** (intended use) reflects the degree of reliability and testing required; e.g., operating systems (reliability, strict timing) need more careful design and significantly more testing than simple math operations. PRICE S application types: Statistical/Mathematical, String Manipulation, GUI, Data Storage and Retrieval, Graphical Functions, Online Communications, Control Functions, Multi-Media, Real Time, Interactive, Operating System, Logical Functions.

**Hardware limitations** (constrained memory/storage on weapon or space systems, or schedule delays or requirements uncertainty caused by concurrent development of hardware with software) and **number of modules** (more modules → more integration, standardization, communication, coordination) both add complexity.

### Capability

Capability covers the skill, experience, and working conditions of the development team: application experience, general skill, schedule constraints, tools experience, and development location. More experienced developers should work faster, better, and cheaper; the effort is likely cheaper if the higher cost of skilled developers is offset by their productivity. Compressing a schedule to less than a normal length of time can require more programmers.

**Table 12.4 (Capability as a cost driver, 100 KSLOC, nominal complexity):**

| Rating | EM | PM | Rate | Cost |
|---|---|---|---|---|
| Best | 0.33 | 154 | \$20,000/PM | \$3,071,081 |
| Nominal | 1.00 | 465 | \$16,000/PM | \$7,445,045 |
| Worst (junior) | 5.22 | 2,429 | \$14,000/PM | \$34,005,242 |

Note the reversal from complexity: high complexity multiplies *up* (harder software costs more), while high capability multiplies *down* (less effort, even though the labor rate is higher). CEBoK also notes the effect is asymmetric — the drop from nominal to low capability hurts more than the gain from nominal to high capability.

{{primer}}

:::note Source formula-vs-total mismatch
CEBoK's Table 12.4 "Calculation" column prints \$16,000 in all three rows' formulas, but the stated totals use \$20,000/PM for the best team and \$14,000/PM for the junior team (matching the accompanying text). The \$16,000 in the printed formula column appears to be a copy-paste artifact from Table 12.2/12.3 — use the rate stated in the text (\$20,000 best / \$16,000 nominal / \$14,000 junior).
:::

+++

:::check
Q: Per CEBoK's Table 12.3, if a 100 KSLOC project moves from Nominal to Very Low complexity (EAF 1.0 → 0.60), effort drops from about 465 PM to roughly...
= 279 ±5
> $2.94 \times 100^{1.0997} \times 0.60 \approx 279$ PM.
:::

:::check
Q: Between capability and complexity, which statement is correct about their effort multipliers?
* High complexity multiplies effort up (>1.0); high capability multiplies effort down (<1.0)
- Both always multiply effort up
- Both always multiply effort down
- Capability has no numeric multiplier in COCOMO II
> Complex software costs more (EAF > 1); capable teams cost less effort (EM < 1) even at a higher labor rate.
:::

:::tip Beyond CEBoK
"Adding people to a late software project often makes it later" (Brooks' Law) is a widely cited software-management principle, not a line from this CEBoK module's core text — but it is consistent with CEBoK's schedule-compression discussion (see the Schedule section): compressing a schedule can often increase cost.
:::
`
    },

    {
      id: 'cost-drivers-example',
      title: 'Cost Drivers Example: The Mail-Order Business',
      summary: 'Full worked COCOMO II example: size, complexity, and capability',
      body: String.raw`:::primer:::
A mail-order system sized at 100 KSLOC takes about 465 person-months at nominal settings.

:::check
Q: If the owner shrank the system to 50 KSLOC, would effort be exactly half, more than half, or less than half?
- Exactly half
- More than half
* Less than half
> Table 12.2 shows 50 KSLOC needs about 217 PM against 465 PM for 100 KSLOC. That is less than half, because the scale exponent is above 1 for this model run.
:::

+++

CEBoK runs one running example through the whole module: a hardware store's owner is moving into mail order and needs a system covering human resources, accounting, customer management, and inventory management. The first developer proposal sizes the system at **100,000 SLOC** across three CSCIs: CSCI 1 = 45,000 SLOC, CSCI 2 = 35,000 SLOC, CSCI 3 = 20,000 SLOC (100,000 total).

Using $PM = A \times Size^{E} \times EM$ with $A = 2.94$ and $E = 1.0997$ (nominal), and assuming nominal complexity/capability so all multipliers equal 1:

### Size as a cost driver (Table 12.2)

| KSLOC | Calculation | PM | Total @ \$16,000/PM |
|---|---|---|---|
| 50 | $2.94 \times 50^{1.0997}$ | 217 | \$3,473,959 |
| 100 | $2.94 \times 100^{1.0997}$ | 465 | \$7,445,045 |
| 150 | $2.94 \times 150^{1.0997}$ | 726 | \$11,628,264 |

:::note Source typo
CEBoK's printed Table 12.2 shows the 150 KSLOC total as **\$11,628,624**. Recomputing $2.94 \times 150^{1.0997} \times \$16{,}000$ gives approximately **\$11,628,264** — two digits appear transposed in the source. Learn the method; don't memorize the printed digit-for-digit total.
:::

{{primer}}

### Complexity as a cost driver (Table 12.3) and Capability as a cost driver (Table 12.4)

Holding size at 100 KSLOC, CEBoK then varies complexity (nominal capability) and capability (nominal complexity) — see the Cost Drivers section for both tables. The same 465 PM / \$7,445,045 nominal case anchors all three tables, since all three use identical nominal inputs.

:::widget sw-cost-drivers:::

:::check
Q: Which of the three tables (size, complexity, capability) shares its "nominal" row's numbers with the other two?
* All three: the nominal-complexity, nominal-capability, 100 KSLOC case is identical across all three tables (465 PM, \$7,445,045)
- None; every table's nominal case differs
- Only size and complexity share it
- Only complexity and capability share it
> All three tables vary only one driver at a time from the same 100 KSLOC / nominal / nominal baseline, so that baseline row is identical everywhere it appears.
:::

:::check
Q: Using Table 12.4's stated rates (not the printed \$16,000 formula column), what is the best-team total for 100 KSLOC at EM = 0.33?
= 3071081 ±5000
> $154\ PM \times \$20,000/PM \approx \$3,071,081$, using the \$20,000/PM rate CEBoK's text states for the most skilled team — not the \$16,000 shown in the table's formula column.
:::
`
    },

    {
      id: 'parametric',
      title: 'Parametric Estimating: The Effort Equation',
      summary: 'Size, scale exponent, cost drivers; diseconomies of scale',
      body: String.raw`:::primer:::
Software effort grows with size raised to a scale exponent b. What does the value of b tell you?

:::sort
Q: Match each exponent to the scale effect it produces.
buckets: Economies of scale | Diseconomies of scale
- b = 0.90 = Economies of scale
- b = 0.95 = Economies of scale
- b = 1.0997 = Diseconomies of scale
- b = 1.15 = Diseconomies of scale
- b = 1.30 = Diseconomies of scale
> An exponent greater than one produces diseconomies of scale (the curve bends upward); an exponent less than one produces economies of scale (the curve bends downward). The sum of scale factors is nominally slightly higher than one.
:::

+++

### General form

$$Effort = a \times Size^{b} \times EAF$$

- $Effort$ = person-months (or person-hours)
- $Size$ = ESLOC (in thousands: KESLOC) or function points
- $a$ = productivity/calibration constant (depends on organization and environment); COCOMO II uses $a = 2.94$ for early-design estimates
- $b$ = **scale exponent** (COCOMO II calls this $E$): how fast effort grows relative to size
- $EAF$ = Effort Adjustment Factor = product of individual cost driver multipliers

### The scale exponent: diseconomies of scale

$E$ is the sum of the scale factors (economies or diseconomies of scale), nominally slightly higher than one (COCOMO II's nominal early-design $E = 1.0997$). The diseconomies-of-scale curve (Figure 12.1) bends upward because of an exponent greater than one; the economies-of-scale curve bends downward because of an exponent less than one. Doubling size multiplies effort by more than double when the exponent exceeds one.

$$\text{Effort multiplier when size doubles} = 2^b$$

- $b > 1.0$: diseconomies of scale
- $b = 1.0$: effort doubles when size doubles
- $b < 1.0$: economies of scale

:::tip Beyond CEBoK
Commonly cited rules of thumb: $b$ of about 1.05 to 1.15 for typical software and above 1.2 for very large, highly complex systems. Coordination overhead, interface management, and integration complexity are often blamed for growing disproportionately with system size. CEBoK states none of these bands or reasons.
:::

{{primer}}

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
> $75^{1.08} = 105.94$ (not 127.1). $3.2 \times 105.94 \times 1.2 \approx 407$ PM
:::

+++

### Cost driver multipliers

COCOMO II-family models rate each driver on a scale and map it to a numeric multiplier (see the Cost Drivers section for CEBoK's actual Table 12.3/12.4 complexity and capability numbers: 0.60/1.0/3.5 and 0.33/1.0/5.22). The **EAF** is the product of all applicable driver multipliers.

:::tip Beyond CEBoK
A generic "Very Low ≈ <1.0 … Extra High ≈ 1.6–2.0+" multiplier scale, and specific EAF ranges like "1.5 to 2.0 or more" for a stack of high ratings, are common industry framing rather than numbers printed in this CEBoK module — for CEBoK's own worked complexity/capability multipliers, use Tables 12.3 and 12.4.
:::

:::tip Beyond CEBoK
Cost driver selection is as important as size in a credible software estimate — CEBoK's own example shows a 100 KSLOC project ranging from about 279 PM (very low complexity) to 1,628 PM (very high complexity) from complexity alone, and from about 154 PM (best programmers) to 2,429 PM (junior programmers) from capability alone, each with the other drivers held nominal.
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
      title: 'Schedule and Post-Deployment Support',
      summary: 'The COCOMO II schedule equation, compression, PDSS, maintenance types',
      body: String.raw`:::primer:::
Calendar time and labor are not the same thing.

:::check
Q: A project runs for 6 calendar months with 3 people working the whole time. How much effort is that?
- 6 person-months
- 9 person-months
* 18 person-months
- 2 person-months
> Person-months equal schedule months times the number of people, so 6 months with 3 people is 18 person-months of effort.
:::

+++

### Schedule months vs. person-months

**Schedule months** are calendar months to develop the software. **Person-months (effort)** = schedule months × number of people working. A six-month project with three people has a 6-month schedule but 18 person-months of effort.

{{primer}}

### COCOMO II schedule equation

$$T_{dev} = C \times (PM_{NS})^{(D + 0.2[E - B])} \times SCED\%$$

where $C = 3.67$, $B = 0.91$, $D = 0.28$, $PM_{NS}$ is unscaled person-months, $E$ is the sum of scale factors, and $SCED\%$ is the schedule compression/decompression fraction of the nominal schedule (e.g., a 25\% compression means $SCED\% = 0.75$; a 50\% stretch-out means $SCED\% = 1.50$).

**Schedule example** (mail-order system, 100,000 SLOC, no compression): with $PM = 465$, $E = 1.1433$, $SCED\% = 1.0$:

$$T_{dev} = 3.67 \times 465^{(0.28 + 0.2[1.1433 - 0.91])} \times 1.0 = 27.28\ \text{months}$$

**Convention:** COCOMO II assumes **152 hours per person-month**. If a proposal instead assumes 160 hours/PM, multiply the COCOMO II person-month estimate by $152/160 = 0.95$ to convert to the proposal's units — always document the hours-per-PM convention used.

**Schedule compression example:** the owner needs the system in 18 calendar months instead of 27.28. Solving for SCED%:

$$SCED\% = \frac{18}{3.67 \times 465^{(0.28 + 0.2[1.1433-0.91])}} = 0.66$$

Compressing to 18 months requires **34\% compression** ($1 - 0.66$). This compression should feed back into the cost estimate, not just the schedule estimate, since compressing a schedule can often increase cost.

:::widget sw-schedule:::

+++

:::check
Q: With PM = 465, E = 1.1433, and no compression (SCED\% = 1.0), the COCOMO II nominal schedule is closest to...
= 27.28 ±0.3
> $T_{dev} = 3.67 \times 465^{(0.28+0.2[1.1433-0.91])} \times 1.0 \approx 27.28$ months.
:::

:::check
Q: What can happen to cost when the schedule is compressed well below nominal?
* It can often increase
- It falls proportionally
- It never changes
> Compression can require more programmers, leading to more opportunity for failed communication and coordination, and may cause developers to cut corners, so it can often increase cost.
:::

:::warn
**Do not assume schedule = effort ÷ staff.** COCOMO II's schedule equation is driven by effort raised to a fractional exponent, not simple division.
:::

:::check
Q: A project has high complexity (multiplier 1.3), high reliability requirement (1.4), but high capability team (0.85). What is the combined EAF?
= 1.54 ±0.02
> $EAF = 1.3 \times 1.4 \times 0.85 = 1.547$
:::

+++

### Post-Deployment Software Support (PDSS)

PDSS covers the costs incurred once software is fielded — the operations and support (O&S) phase — and includes but is **not limited to** software maintenance. Help-desk functions (taking calls, filing trouble tickets) are PDSS effort that most software cost estimating models do **not** capture; they must be estimated separately from the maintenance model. The quality of the delivered software strongly drives support cost: well-researched, well-designed, well-documented, well-tested software needs fewer and easier fixes.

### Software maintenance types

Software does not wear out like hardware, but continued use may uncover bugs that slipped through testing, and software may encounter new problems in an environment different from the one it was designed for:
- **Corrective maintenance:** fixes bugs — errors in the code that must change for the software to perform as designed
- **Adaptive maintenance:** accommodates new requirements — hardware changes, COTS upgrades that force changes, new customer requirements
- **Perfective maintenance:** improves the software — speed, reliability, or added functionality

One approach treats maintenance as a **mini-development effort**: isolate the problem code, redesign/recode/retest it, and run the cost model in development mode (not a dedicated maintenance mode), using the same cost drivers but paying particular attention to the quality/condition of the existing code.

:::check
Q: A COTS upgrade forces changes to the developed software. Which maintenance type is this?
- Corrective
* Adaptive
- Perfective
> Adaptive maintenance accommodates new requirements such as hardware changes, COTS upgrades that force changes, and new customer requirements.
:::

:::check
Q: Which PDSS cost is commonly *not* captured by software cost estimating models and must be estimated separately?
* Help desk / trouble-ticket handling
- Corrective maintenance
- Bug fixes
- Code changes
> CEBoK notes models generally only account for software maintenance costs; help desk functions fall outside that and need a separate estimate.
:::
`
    },

    {
      id: 'lifecycle',
      title: 'Programming Paradigms and Development Lifecycle Models',
      summary: 'Linear vs. OO, Waterfall, Incremental, Evolutionary, Spiral — with the mail-order example',
      body: String.raw`:::primer:::
The spiral lifecycle model runs the same four-quadrant loop every cycle.

:::order
Q: Put the four spiral quadrants in the order they happen.
1. Define objectives, alternatives, and constraints
2. Evaluate alternatives and assess risk
3. Carry out development tasks
4. Plan the next spiral
> Each spiral first defines objectives, alternatives, and constraints, then evaluates alternatives and assesses risk. It then does the development tasks and ends by planning the next spiral.
:::

+++

### Programming paradigms: linear vs. object-oriented

A **programming paradigm** is a fundamental style of writing solutions; a **methodology** is a style of solving specific software-engineering problems. Traditional (**linear**) programming builds a system largely custom, one instruction at a time — CEBoK likens this to gunsmithing before 1798, when every gun was custom-made, with parts created specifically for that gun and usable only on that gun; there were no standards, so one person could not build the barrel and another the stock with confidence that the two would fit together.

In **1798, Eli Whitney** won a government contract to manufacture guns and realized the old one-at-a-time approach could not meet it. He standardized parts so they were **interchangeable** across guns, letting each part be produced in the best, cheapest way and then assembled — and repairs became a matter of swapping a part. **Object-oriented (OO) programming** applies the same idea to code: identify the reusable "interchangeable parts" (objects), build them well, and assemble systems from them. A library of proven objects means each new system needs less from-scratch development.

### Development approaches

System-level requirements and implementation are the first and last steps regardless of approach; the sub-system building process in between can be:
- **Waterfall:** a single effort
- **Incremental:** overlapping series of builds
- **Evolutionary:** a series of cycles
- **Spiral:** cycles with added risk/analysis phases
- **Agile:** discrete time blocks

The mail-order business owner gets four consultant proposals, one per lifecycle model, each covering the same HR/accounting/customer-management/inventory system.

+++

### Waterfall

The traditional lifecycle development methodology that models a conventional software engineering cycle; the basis for most software acquisition in government and industry up until the 1990s.

**Benefits:** appropriate when requirements are known and stable; provides a structure for the effort. **Pitfalls:** long development cycle before a useable product is delivered; no product until the entire system is completed; does not accommodate prototyping; not attuned to modern methods and evolving needs.

**Modeling waterfall:** it is the basic methodology on which most models and estimating methods are built, so no special techniques are required — run the whole CSCI/CSC breakdown through the model at once. In the example, the first consultant uses COTS packages for HR, accounting, and inventory, and custom-develops only the Customer Management System (CMS), since its requirements are small and stable:

- CSCI 1 (Customer Management System): CSC 1 (develop/submit orders) = 5,000 SLOC + CSC 2 (verify order) = 7,500 SLOC
- CSCI 2 (verify order): CSC 1 = 3,000 SLOC
- CSCI 3 (approve order): CSC 1 = 1,000 SLOC
- CSCI 4 (status order): CSC 1 = 2,500 SLOC
- Plus 2 COTS packages (priced separately, but included in the model to capture integration cost)

Total custom code: **19,000 SLOC**.

:::note Figure gap in source
CEBoK's incremental-lifecycle figure (12.8) is referenced in the text but appears in the source only as a broken file placeholder ("File:Incremental Lifecycle Methodology Chart.JPG") rather than a viewable image — Figure 12.9 (the incremental *approach*, below) is the one that actually renders with numbers.
:::

### Incremental

A refinement of waterfall: software is built in increments of functionality, each typically following its own mini-waterfall (detailed design → code → test).

**Benefits:** delivers capability sooner in smaller pieces, spreading risk and enabling feedback into later increments; often better final quality. **Pitfalls:** requirements must be defined early; needs a sound architecture up front; users don't get full capability until the end.

**Modeling incremental:** most parametric models take methodology as an input. Lacking that capability, split the estimate into (a) effort that applies to the whole system (system requirements and design, software requirements analysis, software system test, and system test) and (b) effort that applies to each individual increment modeled as a stand-alone waterfall effort (CSCI design through CSCI test only). If sequential and the same team continues, adjust productivity upward for later increments from team learning. Depending on how interrelated or interdependent the increments are, the estimate may require some level of system testing each time an increment is delivered.

CEBoK's Figure 12.9 example: Run 1 (Increment 1) = COTS packages 1–3 + 500 SLOC of "glue" code; Run 2 (Increment 2) = COTS module 1 + 500 SLOC of Customer Management code; Run 3 (Increment 3) = COTS module 3 + 500 SLOC of Customer Management code; Run 4 = total-system requirements analysis, design, and test across Increments 1–3. Total effort is the sum of all four runs.

### Evolutionary

Used when the customer has general objectives but not specific requirements: a core-capability prototype is built, reviewed, and refined across repeated cycles until complete or resources run out. Prototypes may be a paper/software model, a working product, or a similar existing product.

**Benefits:** rapid delivery of an initial product; strong customer involvement. **Pitfalls:** hard to model with no defined ending; may take longer than waterfall; the system must be architected to evolve.

**Modeling evolutionary:** treat each phase as its own waterfall effort, but adjust design/code/test levels because earlier-phase software isn't expected to be fully analyzed/designed/coded/tested — later phases build on (reuse/modify) prior code plus new functionality; not all requirements are known at estimate time, but an assessment has to be made as to what will be done in later phases.

In the mail-order example, the third consultant develops the CMS and integrates COTS in Phase 1 (prototype only, static screens, no database link); Phase 2 revises the interface and links it to the customer order database; testing it prompts a request for automated email status updates. Phase 3 adds those automatic email notifications and search-by-field. Each phase mixes new code, adapted prior-phase code (treated similarly to COTS/reuse), and integration/test effort.

### Spiral model (Boehm, 1988)

Combines an underlying methodology (waterfall/incremental/evolutionary) with explicit **risk analysis** each cycle. Each spiral runs four quadrants: (1) define objectives, alternatives, constraints; (2) evaluate alternatives, assess risk; (3) development tasks (e.g., an evolutionary phase or waterfall's requirements analysis), ending with IOC/FOC/FCA/PCA; (4) plan the next spiral.

**Benefit:** emphasizes risk mitigation and analysis. **Pitfalls:** hard to put on contract; may take longer than other methods.

**Modeling spiral:** similar to evolutionary — model each phase separately, account for reuse from the previous spiral, and include only the phases actually addressed in an early spiral (e.g., only requirements/specification work, no coding yet). Add extra effort for risk assessment, planning, and objectives analysis if the estimating model/CER doesn't already address it.

:::widget sloc-rollup:::

{{primer}}

+++

:::check
Q: Which lifecycle model is explicitly risk-driven with objectives/risk analysis in every cycle?
- Waterfall
- Incremental
* Spiral
- Evolutionary
> Boehm's spiral model runs each iteration around identifying and resolving the biggest risks.
:::

:::key
**Waterfall** is the basic methodology most models are built on; no special modeling techniques are needed. **Evolutionary:** not all requirements are known at estimate time, so an assessment must be made of what will be done in later phases. **Incremental:** model the whole-system effort plus each increment. **Spiral:** model each phase separately.
:::

:::check
Q: In CEBoK's waterfall example, what is the total custom SLOC for the Customer Management System (CSCI 1–4), excluding COTS?
= 19000 ±0
> 5,000 + 7,500 + 3,000 + 1,000 + 2,500 = 19,000 SLOC.
:::

:::check
Q: Eli Whitney's 1798 interchangeable-parts innovation is used by CEBoK as an analogy for which software concept?
* Object-oriented programming (reusable, interchangeable objects)
- Function point counting
- Schedule compression
- Waterfall lifecycle
> Just as interchangeable gun parts let Whitney build and repair guns from standardized components, OO programming builds and repairs software from standardized, reusable objects.
:::

:::check
Q: Why might an incremental model's estimate be built from a whole-system estimate plus per-increment estimates, rather than one single model run?
* The model lacks a methodology input, and whole-system activities (like final system test) don't belong to any one increment
- Incremental development has no whole-system activities
- Parametric models cannot handle CSCIs
- Increments are always identical in size
> System-level requirements/design/test apply once to the whole system, while each increment's design-through-test effort is modeled like its own small waterfall, with productivity adjustments for team learning.
:::
`
    },

    {
      id: 'techniques',
      title: 'Estimating Techniques: Analogy and Parametric',
      summary: 'Two primary techniques, worked examples, and CER development',
      body: String.raw`:::primer:::
Software has two primary estimating techniques, each with its own signature traits.

:::sort
Q: Which technique does each trait describe?
buckets: Analogy | Parametric
- Comparative analysis of similar systems = Analogy
- Adjusts for differences between the new and comparable systems = Analogy
- Mathematical relationship between software size and key parameters = Parametric
- The most common method of estimating software development costs = Parametric
- COCOMO II and SEER-SEM are examples = Parametric
> Analogy is a comparative analysis of similar systems with adjustments to account for differences between the new and comparable systems. Parametric is a mathematical relationship between software size and various key parameters known to affect project costs, and is the most common method of estimating software development costs.
:::

+++

### Analogy

A comparative analysis of similar systems with adjustments to account for differences between the new and comparable systems. Analogy and parametric are the two most common techniques used in software cost estimation.

**Worked example (mail-order, COTS setup):** the first consultant recommends the waterfall approach and estimates COTS package setup by analogy to a similar recent job that used **four** COTS packages: 280 hours setup/config/test, 80 hours data load, 100 hours implementation, 20 hours training (480 hours total, over 3 months). For the mail-order client (a single consolidated package instead of four, smaller company, less-automated data):

- Setup: 280 hrs × (1 − 20\%) = 224 hrs
- Data load: 80 hrs (unchanged — smaller company offset by less-automated data)
- Implementation: 100 hrs × (1 − 15\%) = 85 hrs
- Training: 20 hrs × (1 − 15\%) = 17 hrs
- **Total: 406 hours**

At a fully-burdened rate of \$100,000/year over 1,920 work hours/year:

$$\frac{\$100{,}000}{1{,}920\ hrs} \times 406\ hrs = \$21{,}145$$

(COTS licensing itself is priced separately, from vendor quotes.)

:::widget sw-analogy:::

:::tip Beyond CEBoK
Common framing, not stated in CEBoK's text: analogy is most credible when the analogous system is truly similar in domain, language, and environment, and its adjustments can be subjective.
:::

+++

### Parametric

A mathematical relationship between software size and various key parameters known to affect project costs. Parametric estimating is the most common method of estimating software development costs; COCOMO II, SEER-SEM, PRICE TruePlanning, SLIM, and Construx are all parametric.

**Worked example (mail-order, custom Customer Management code):** the same first consultant uses COCOMO II for the 19,000 SLOC of custom code (from the waterfall breakdown), with $A = 2.94$, an adjusted scale exponent $E = 1.0405$ (lower than the nominal 1.0997 because the developer has done many similar efforts), and an effort multiplier $EM = 0.38$ (a highly skilled, specialized team):

$$PM = 2.94 \times 19^{1.0405} \times 0.38 = 23.92\ \text{person-months}$$

At \$16,000/PM: $23.92 \times \$16{,}000 = \$382{,}643$ (this is added to the analogy-based COTS estimate above).

**Schedule for the same effort** ($PM = 23.92$, $E = 1$ since it's a single small CSCI, $SCED\% = 1.0$):

$$T_{dev} = 3.67 \times 23.92^{0.262} \times 1.0 = 8.43\ \text{months}$$

:::note CEBoK's exponent
CEBoK uses 0.262 here, but its own schedule equation with $E = 1$ gives $0.28 + 0.2(1 - 0.91) = 0.298$, which yields about 9.4 months. Learn CEBoK's printed 8.43 for the exam, and know the equation.
:::

:::tip Beyond CEBoK
Common framing, not stated in CEBoK's text: parametric models are systematic and repeatable, can be calibrated to your own organization's data, and need historical data to calibrate. Using analogy and parametric as cross-checks on each other is good practice, but CEBoK presents them as the two most common techniques, not as cross-checks.
:::

{{primer}}

+++

:::check
Q: In the analogy example, why does the total drop from 480 to 406 hours even though data-load effort stays the same?
* Consolidating to one COTS package (vs. four) and the smaller company reduce setup, implementation, and training, while the less-automated data offsets the smaller company's data-load savings
- Data load always stays fixed regardless of project size
- Only training time changes between analogous projects
- The rate per hour decreased
> Setup falls 20\% (fewer packages), implementation and training fall 15\% each (smaller company), but data load's two effects (smaller company vs. less-automated data) roughly cancel.
:::

:::check
Q: In the parametric example, why is $E = 1.0405$ instead of the nominal 1.0997?
* The developer has done many similar efforts, reducing the scale-factor penalty
- E is always 1.0997 for COCOMO II early design
- Lower E always means higher cost
- E was calibrated from Table 12.3
> COCOMO II's scale factors capture unfamiliarity/inflexibility; strong precedent with this exact kind of system lowers E toward 1.0 (less diseconomy).
:::

:::check
Q: Using $PM = 2.94 \times 19^{1.0405} \times 0.38$, the effort is closest to...
= 23.92 ±0.3
> $19^{1.0405} \approx 21.4$; $2.94 \times 21.4 \times 0.38 \approx 23.92$ PM.
:::

+++

### Developing your own software CER

If good historical data exists, consider a custom CER (Module 8 Regression Analysis has the statistical detail). Key reminders specific to software:
- **Variable selection:** align the organization's needs with what data is actually available
- **Relevant range:** apply the CER only within the range of the underlying data — e.g., a CER built entirely from projects in the 500–2000 FP range should not be trusted to estimate a 5,000 FP effort; the relationship may not hold outside that range
- **Normalization:** ensure the data set is consistent and complete before fitting
- **Test the relationship** with scatter plots before committing to a regression model

:::warn
**Do not use uncalibrated, generic industry coefficients** outside their relevant range. They reflect averages across diverse domains, languages, and processes; a CER's validity does not automatically extend beyond the size range of the data used to build it.
:::

:::check
Q: A CER was built entirely from projects between 500 and 2,000 function points. You need to estimate a 5,000 FP project. What is the concern?
* The estimate falls outside the CER's relevant range, so the fitted relationship may not hold
- Function points cannot exceed 2,000
- The CER must be re-normalized to Celsius
- Nothing — CERs extrapolate reliably by design
> Relevant range matters: relationships fit to one size band aren't guaranteed to extrapolate to a much larger (or smaller) project.
:::
`
    },

    {
      id: 'challenges',
      title: 'Challenges in Software Estimating',
      summary: 'System definition, sizing/technology, quality, COTS, calibration, growth',
      body: String.raw`:::primer:::
Software estimates run into recurring trouble spots, and each one has its own symptom.

:::sort
Q: Which challenge does each symptom or fix belong to?
buckets: System Definition | Calibration | Growth & Demand
- Immature requirements leave the scope unknown = System Definition
- Define a notional system with technical experts = System Definition
- Default model values rarely fit = Calibration
- Collect actuals from completed efforts and calibrate the model = Calibration
- Delivered size is often much larger than estimated = Growth & Demand
- Pre-Y2K demand for COBOL programmers pushed rates up = Growth & Demand
> Immature requirements mean unknown scope, so the mitigation is a notional system defined with technical experts. Default model values rarely fit, so calibrate to actuals. Delivered size is often much larger than estimated, and labor market swings such as the pre-Y2K COBOL scramble shift rates.
:::

+++

| Challenge | Why it matters | Mitigation |
|---|---|---|
| **System Definition** | Immature requirements mean unknown scope at estimate time | Define a notional system with technical experts; identify COTS candidates and independently verify vendor claims; document assumptions and risk for unknowns |
| **Sizing & Technology** | Early size estimates are very uncertain; rapid technology change forces re-integration and tool learning curves | Apply any or all Module 2 methods to size the system (analogy, parametric, extrapolation from actuals, expert opinion); the resulting equations are Size Estimating Relationships (SERs) rather than CERs; plan for technology refresh and COTS version updates during design, not after |
| **Quality** | Poor requirements/interfaces/coding lead to defects found late, when rework is most expensive | Break work into manageable components; define coding standards, taxonomy, interfaces up front; verify/validate and trace requirements each phase; track quality metrics |
| **COTS Integration** | COTS is not free: no code visibility, customization limits, integration complexity, beta-version risk, licensing/upgrades | The development team must still perform requirements definition, design, and test when using COTS, even though overall effort and schedule may be reduced; if COTS is part of a larger system, some code and more test effort will also be required; apply the ~80\% rule (below) to the build-vs-buy decision |
| **Calibration** | Productivity rates vary enormously by domain, language, environment; default model values rarely fit | Collect actual cost/schedule/size data from completed efforts; calibrate the model to it; re-calibrate as practices/technology evolve |
| **Growth & Demand** | Delivered size is often much larger than the original estimate, and effort grows with it; labor market conditions shift rates and availability | Understand when code growth occurs and use proper change management procedures; watch for tight-labor-market effects (e.g., pre-Y2K demand for COBOL programmers pushed rates up and average skill down) |

{{primer}}

### Quality metrics

Typical software quality measures: total defects identified, defects open/closed, failed fixes, defect severity, location of the defect, defect injection phase, and **defect density** (defects per 100 function points or per 1,000 SLOC). Many models estimate expected defects so a project manager can compare against discovered defects to judge whether QA/testing is adequate. Other indicators: degree of **cohesion and coupling** between modules, percentage of requirements satisfied, test coverage, documentation adequacy, **Mean Time to Defect (MTTD)**, and **McCabe's cyclomatic complexity** (the number of linearly independent paths through a module).

### COTS: the ~80\% rule

A common build-vs-buy rule of thumb: if roughly **80\%** of required functionality can be delivered by COTS software with little or no customization, buying is usually the better option; heavy customization needs can make new development more cost-effective instead. Even when buying, the team still performs requirements definition, design, and test — a reduced but nonzero effort — and support costs depend on how much of the system is COTS and how tightly it's integrated with custom code.

### Growth and the labor market

Delivered size is often much larger than the original estimate; the primary cause of code growth is requirements growth (scope creep). Causes include poor understanding of the user's needs, not engaging the correct or any of the affected stakeholders, poor requirements elucidation, new legal or market requirements, and new capabilities identified by stakeholders. Per Capers Jones, requirements increase on average from less than 1\% on small end-user systems to 64\% on very large military systems. Code growth can also result from a poor initial size estimate: subjective estimates such as SLOC and expert judgment are prone to optimistic bias. The key to addressing code growth is to understand when it occurs and to use proper change management procedures. Labor market swings (e.g., the pre-2000 scramble for COBOL programmers due to the **Y2K bug**) can push rates up or force acceptance of less-qualified staff, and can make historical calibration data stale relative to current market conditions.

:::key Testable Topics
CEBoK marks **all of this module's main content as testable**. Nothing in the main text is flagged "testable but less emphasized." The **Related and Advanced Topics** section (general guidelines, OO/object points, IT/AIS/ERP estimating) is explicitly marked **not testable**.
:::

+++

:::check
Q: Which statement about COTS software is correct?
- It eliminates development cost
* It still carries integration, licensing, glue code and upgrade costs
- It never needs maintenance
> COTS moves cost around rather than eliminating it.
:::

:::check
Q: Per the COTS build-vs-buy rule of thumb, buying is usually preferred when COTS can deliver about what percentage of required functionality with little/no customization?
= 80 ±2
> The ~80\% rule: if COTS covers roughly 80\% or more with minimal customization, buy is typically the better option.
:::

:::check
Q: McCabe's cyclomatic complexity measures...
* The number of linearly independent paths through a program module
- Total lines of code in a module
- Defects per 100 function points
- Mean time between failures
> It's a structural complexity/quality metric based on control-flow paths, not a size or defect-rate metric.
:::

:::check
Q: Per Capers Jones data cited by CEBoK, requirements growth on very large military systems averages approximately (%)...
= 64 ±2
> Capers Jones: requirements increase on average from less than 1\% on small end-user systems to 64\% on very large military systems.
:::

:::check
Q: Early estimate for a new system is 40 KSLOC. Historical data on similar programs shows average size growth of 35\% from initial estimate to delivery. What total size should the estimate account for?
= 54 ±1
> $40 \times (1 + 0.35) = 40 \times 1.35 = 54$ KSLOC. (Applying a growth factor is the app's own technique, not a CEBoK formula.)
:::

:::tip Beyond CEBoK
Applying growth factors to early size estimates and adding a risk reserve are common practice, not CEBoK prescriptions. CEBoK's key to addressing code growth is to understand when it occurs and to use proper change management procedures.
:::`
    },

    {
      id: 'advanced',
      title: 'Advanced: Guidelines, OO, Object Points & IT Estimating',
      summary: 'Not testable per CEBoK — general guidelines, OO benefits, object points, AIS/ERP',
      body: String.raw`:::primer:::
Two IT-flavored acquisition terms show up in software estimating. Which traits go with which?

:::sort
Q: Match each trait to AIS or ERP.
buckets: AIS | ERP
- An acquisition program categorization that acquires IT, not typically hardware intensive = AIS
- Estimates are largely software-development estimates = AIS
- Often involves cutting-edge, rapidly changing technology = AIS
- A business support system with modular software design = ERP
- Employee resistance may drive up implementation cost = ERP
> AIS is a categorization of an acquisition program that acquires IT; its estimates are largely software development, often on cutting-edge technology with rapidly changing technical baselines. ERP is a business support system with modular design, where human factors such as employee resistance may drive implementation cost.
:::

+++

:::note Not testable per CEBoK
This module's "Related and Advanced Topics" content, including this section, is explicitly marked **not testable**.
:::

### General guidelines for quick estimates

When a fast estimate is needed, industry rules of thumb can help — but only if they match the domain being estimated. CEBoK's own caution: don't use a **20-year-old COBOL factor** to estimate **C++** development, and don't apply an **automated-information-system (AIS) factor** to estimate **manned space-system life support software**. Guideline variance is generally very large, so treat any such rule as a benchmark to sanity-check a locally developed estimate, not a substitute for one.

Two reference tables are cited (both described here only in purpose, since the printed figures are not legible source material to quote numbers from):
- **Fig. 12.14** (Reifer, *Crosstalk*): cost per line of code by application type and language
- **Fig. 12.15** (Capers Jones): cost per function point by domain, across project sizes

+++

### Object-oriented programming: benefits

- Enables reuse and rapid prototyping — systems are assembled from a standard set of objects rather than rebuilt
- Software is assembled from proven components, generally yielding better quality, with defects easier to locate and fix due to modularity
- Reduces programming, design, and administration effort through component reuse and rapid prototyping
- Modular and message-based, so adding a capability doesn't require a system-wide change
- OO structures mirror how people naturally organize things

### Object points

Developed by **Banker, Kauffman, and Kumar** for sizing **banking system** development, later adopted by Boehm in one of his models. Object points adjust for complexity the same way function points do, but are **user-interface-oriented** and less subjective than SLOC — useful in ICASE (Integrated Computer-Aided Software Engineering) environments where tools remove much of the manual coding that SLOC counts would need. Drawbacks: not widely used, and can't be counted until the end of design, limiting available historical/productivity data. Variants include predictive object points, OO function points, and SEER object points. (Use case points and story points are other agile-era sizing measures CEBoK notes but does not cover further.)

+++

### IT estimating: AIS and ERP

**Automated Information Systems (AIS):** a categorization of an acquisition program that acquires IT and involves equipment that is an integral part of a weapon system or is a tactical communication system. The estimates of AIS systems are largely estimates of software development. AIS systems are not typically hardware intensive, and are commonly cutting-edge technology that is difficult to estimate given the rapid changes in technical baselines.

**Enterprise Resource Planning (ERP):** a business support system built on a **single common database** and modular software design. Estimating ERP implementation adds **gap analysis**, **business process re-engineering (BPR)**, and COTS integration and model development, in addition to the traditional estimation of custom code development. ERP cost drivers are less mature than traditional software drivers and are debated — commonly cited candidates include the dollars spent on the ERP package and the number of requirements, though some experts argue human factors (user comfort with and acceptance of the new system) matter more than any empirical driver, since employee resistance can drive up implementation cost.

**Fig. 12.16** compares AIS vs. ERP program costs; CEBoK states the difference is quantifiable but the source figure's numbers are not legible here — treat this as a described comparison, not a source of specific figures to cite.

{{primer}}

:::check
Q: Why does CEBoK warn against applying a 20-year-old COBOL productivity factor to a new C++ project?
* Guidelines are domain- and technology-specific and carry large variance; an old, cross-language factor is unlikely to fit
- COBOL factors are always higher than C++ factors
- C++ cannot be estimated with any guideline
- COBOL is no longer taught
> The general point: match any rule-of-thumb guideline to the domain, era, and technology actually being estimated.
:::

:::check
Q: Object points were originally developed to size which kind of system?
* Banking systems
- Weapon systems
- Real-time embedded control systems
- Web browsers
> Banker, Kauffman, and Kumar developed object points for banking-system development; Boehm later adopted them in one of his models.
:::

:::check
Q: What distinguishes ERP estimating from a typical custom software estimate?
* It must also account for gap analysis, business process re-engineering, and COTS integration and model development, in addition to traditional custom code estimation
- ERP systems never require custom code
- ERP has no cost drivers at all
- ERP is always cheaper than custom development
> ERP is built on a shared database with modular design; implementing it well requires assessing the gap to current business processes and re-engineering them, not just configuring software.
:::
`
    }
  ],

  cards: String.raw`
## Overview
Q: Key differences: software cost vs. hardware cost
A: Software is developed once and further produced by making copies; learning curves do not exist in software. Maintenance costs can be significantly higher than the cost of developing the software.
Q: What is CSCI?
A: Computer Software Configuration Item: a software element in the WBS managed as a unit; may be broken into CSCs, and further into CSUs.
R: yes
Q: What is CSC?
A: Computer Software Component: a subdivision of a CSCI.
R: yes
Q: The seven system engineering steps for software (CEBoK)
A: (1) System requirements & design, (2) Software requirements analysis, (3) Preliminary & detailed design, (4) Code and unit test, (5) Unit integration and test, (6) Software system test, (7) System test.
Q: Why is unit testing considered a development step, not a test-phase step?
A: It occurs inside "Code and Unit Test" (step 4) and verifies the unit before integration, per CEBoK's step list.
Q: How is software size measured, versus hardware size?
A: Software size is measured with metrics such as FP and SLOC; hardware size is captured by physical measures (length, height, weight, performance requirements, number of units).
Q: Similarities: software and hardware estimating
A: Both follow a lifecycle; hardware estimates can use any Module 2 costing technique; software cost factors are similar to hardware cost factors: size, complexity, capability.
Q: SIT&E (WBS term)
A: Systems Integration Test and Engineering.
R: yes

## Size Metrics
Q: Primary driver of software effort
A: Size (SLOC or function points).
Q: SLOC: definition and counting pitfall
A: Executable instructions and data declarations, excluding comments/blanks/continuation lines. This is one definition of SLOC, not the definition; variations occur between estimators and organizations, so understand what is counted and how.
R: yes
Q: Why SLOC varies by language
A: Different languages require different numbers of lines of code to execute the same function, making comparisons impossible.
Q: SLOC advantage
A: Widely used, available in existing historical data, easily counted by automated tools once code exists.
Q: SLOC disadvantage
A: Lack of defined rules, so discrepancies can occur in counts even with standard definitions; different languages need different line counts for the same function; dependent on developer style.
Q: Reused vs. adapted/customized vs. verbatim code
A: Verbatim/reused = copied with no modification. Adapted/customized/modified = needs some redesign, recode, retest. New = requires full design, code, test.
Q: Equivalent SLOC (ESLOC)
A: ESLOC = SLOC × [0.40 (% design modified) + 0.30 (% code modified) + 0.30 (% integration and test)], with SLOC the adapted code; a factor between zero and one (Boehm).
R: yes
Q: Why isn't reused code counted as zero cost?
A: All code requires some degree of retest prior to software/hardware integration, even if no redesign or recode is necessary. Theoretically, reused code needs no new design or code and minimal test.
Q: ESLOC weighting factor (CEBoK)
A: 0.40 × (% design modified) + 0.30 × (% code modified) + 0.30 × (% integration and test), multiplied by the adapted SLOC. (The app calls this factor AAF: Beyond CEBoK.)
R: yes
Q: How to read: DM=15%, CM=25%, IM=20%
A: Design 15% modified, code 25% modified, integration/test 20% effort needed.
Q: Function Points: definition
A: IFPUG function points are a size measure based on Functional User Requirements (FUR), with counting rules defined in the Counting Practices Manual (CPM); counted from requirements documentation, data schema, architectural diagrams, user manuals, and other sources.
R: yes
Q: Five-step FP counting process (CEBoK)
A: (1) Determine type of FP count, (2) identify scope/boundaries, (3) count data and transaction function types, (4) calculate UFP and VAF, (5) calculate AFP.
Q: Five IFPUG function point components
A: (IFPUG detail, Beyond CEBoK) External Inputs (EI), External Outputs (EO), External Inquiries (EQ), Internal Logical Files (ILF), External Interface Files (EIF). CEBoK itself names data function types and transaction function types.
R: yes
Q: How are function point types weighted?
A: (IFPUG detail, Beyond CEBoK) Each type at each complexity level (Low/Avg/High) has a weight: EI 3/4/6, EO 4/5/7, EQ 3/4/6, ILF 7/10/15, EIF 5/7/10.
Q: UFP
A: Unadjusted Function Points: sum of all weighted function type counts.
R: yes
Q: Value Adjustment Factor (VAF)
A: (IFPUG detail, Beyond CEBoK) VAF = 0.65 + 0.01 × (sum of 14 GSC ratings). Adjusts UFP for system complexity.
R: yes
Q: General System Characteristics (GSCs)
A: (IFPUG detail, Beyond CEBoK) 14 characteristics (communication, performance, reusability, etc.) each rated 0–5 to set VAF.
R: yes
Q: FP advantages
A: Available early (from requirements), usable throughout the lifecycle, language/technology-agnostic, unaffected by programmer skill or style.
Q: FP disadvantages
A: Requires trained analysts (CPM rules), more effort than SLOC to count, doesn't measure non-functional requirements (addressed by SNAP).
Q: SNAP
A: Software Non-functional Assessment Process (IFPUG): measures non-functional requirements that plain function points miss.
R: yes
Q: Capers Jones requirements growth range
A: Requirements increase on average from less than 1% on small end-user systems to 64% on very large military systems (Capers Jones).

## Complexity and Capability
Q: What is complexity in software estimating?
A: The second broad area of cost drivers; relates to the functionality the software must perform and can be reflected in the language(s) and platform used. List: language, function (intended use), hardware limitations, number of modules, amount of integration, percent of new code, quality of development (used for maintenance).
Q: CEBoK Table 12.3 complexity EAF values (100 KSLOC example)
A: Very Low = 0.60 (279 PM), Nominal = 1.0 (465 PM), Very High = 3.5 (1,628 PM).
Q: CEBoK Table 12.4 capability EM values (100 KSLOC example)
A: Best = 0.33 (154 PM, \$20,000/PM), Nominal = 1.0 (465 PM, \$16,000/PM), Worst/junior = 5.22 (2,429 PM, \$14,000/PM).
Q: Why does high complexity raise the multiplier but high capability lower it?
A: Complex software takes more effort (EAF > 1); high-capability teams reduce effort (EM < 1), and the effort is likely cheaper when their higher cost is offset by productivity.
Q: Capability: definition
A: Application experience, general skill, schedule constraints, tools experience, development location.
Q: PRICE S application types (examples)
A: Statistical/Mathematical, String Manipulation, GUI, Data Storage/Retrieval, Graphical Functions, Online Communications, Control Functions, Multi-Media, Real Time, Interactive, Operating System, Logical Functions.
Q: Why is schedule compression difficult in software?
A: Compressing can require more programmers (failed communication and coordination) and may cause developers to cut corners.
Q: What is the nominal schedule?
A: Calendar months from the COCOMO II schedule equation based on base (unscaled) person-months, raised to an exponent driven by the scale factors, with SCED% = 1.0 (no compression or stretch-out).

## Cost Drivers Example
Q: Mail-order example: total SLOC and CSCI split
A: 100,000 SLOC total: CSCI 1 = 45,000, CSCI 2 = 35,000, CSCI 3 = 20,000.
Q: Table 12.2 (size): 50/100/150 KSLOC effort and cost
A: ~217 PM (\$3,473,959), ~465 PM (\$7,445,045), ~726 PM (~\$11,628,264; CEBoK prints \$11,628,624, a likely digit-transposition typo) at \$16,000/PM.
Q: Cost Drivers Example source typo
A: CEBoK's Table 12.2 shows \$11,628,624 for 150 KSLOC; recomputing 2.94×150^1.0997×\$16,000 gives ~\$11,628,264.
Q: Table 12.4 formula-column discrepancy
A: CEBoK's Table 12.4 prints \$16,000 in every row's formula, but the stated totals use \$20,000/PM (best) and \$14,000/PM (junior), per the accompanying text.

## Effort Equation
Q: General parametric effort equation form
A: Effort = a × Size^b × EAF
R: yes
Q: Meaning of a in the effort equation
A: Productivity/calibration constant; COCOMO II uses a = 2.94 for early-design estimates.
Q: Meaning of b (E) in the effort equation
A: Scale exponent (sum of scale factors): how fast effort grows relative to size. E > 1 is diseconomies of scale, E < 1 economies of scale; COCOMO II nominal early-design E = 1.0997, slightly higher than one.
Q: Meaning of EAF
A: Effort Adjustment Factor: product of multipliers for complexity, capability, schedule, reliability, etc.
R: yes
Q: What does b = 1.0 mean?
A: Linear: effort doubles when size doubles.
Q: Typical range of b for software
A: Beyond CEBoK rule of thumb: about 1.05 to 1.15. CEBoK says only that E is nominally slightly higher than one (1.0997).
Q: Diseconomies of scale: definition
A: Effort grows faster than size (b > 1.0). Doubling size multiplies effort by more than double.
R: yes
Q: Why software exhibits diseconomies of scale
A: Beyond CEBoK: commonly attributed to coordination overhead, interface management, and integration complexity growing disproportionately. CEBoK: the curve bends upward because the exponent is greater than one.
Q: Economies vs. diseconomies of scale curves (Fig 12.1)
A: Diseconomies curve bends upward (exponent greater than one); economies curve bends downward (exponent less than one).
Q: Effect of doubling size when b = 1.1
A: Effort multiplied by 2^1.1 ≈ 2.14, more than double.

## Schedule and PDSS
Q: COCOMO II schedule equation
A: Tdev = C × (PM_NS)^(D + 0.2(E - B)) × SCED%, with C = 3.67, B = 0.91, D = 0.28.
R: yes
Q: Mail-order schedule example result
A: 100,000 SLOC, PM = 465, E = 1.1433, SCED% = 1.0 → Tdev ≈ 27.28 months.
Q: Mail-order schedule compression example
A: To hit 18 months instead of 27.28, SCED% = 0.66, i.e., 34% compression.
Q: COCOMO II hours-per-person-month convention
A: 152 hours/PM. If a proposal assumes 160 hrs/PM, multiply COCOMO II's PM estimate by 152/160 = 0.95 to convert.
Q: Can you compress software schedule below the nominal level?
A: Yes, but compressing a schedule can often increase the cost: it can require more programmers (failed communication and coordination) and may cause developers to cut corners. Consider compression in the cost estimate too. Models differ on whether stretching out a schedule increases or decreases cost.
Q: Post-Deployment Software Support (PDSS)
A: Support during Operations & Support (O&S) phase; includes but is not limited to maintenance (e.g., also help desk/trouble tickets, often not captured by cost models).
R: yes
Q: Three types of software maintenance
A: Corrective (fix bugs), Adaptive (accommodate new requirements), Perfective (improve speed/reliability/functionality).
R: yes
Q: Maintenance as "mini-development"
A: Treat maintenance like a small development effort: isolate, redesign, recode, retest the affected code, running the model in development mode with the same cost drivers.

## Lifecycle Models
Q: Eli Whitney (1798) analogy in CEBoK
A: Standardized interchangeable gun parts (vs. custom-fit parts per gun) is CEBoK's analogy for OO programming's reusable, interchangeable objects vs. linear one-at-a-time coding.
Q: Linear vs. OO programming paradigm
A: Linear builds systems largely custom, instruction by instruction. OO builds from reusable, interchangeable objects, reducing from-scratch development over time.
Q: Waterfall model
A: Benefits: appropriate when requirements are known and stable; provides a structure for the effort. Pitfalls: long development cycle before a useable product is delivered; no product until the entire system is completed; does not accommodate prototyping; not attuned to modern methods and evolving needs.
R: yes
Q: Waterfall mail-order example: total custom SLOC
A: 19,000 SLOC (CSCI 1: 5,000+7,500; CSCI 2: 3,000; CSCI 3: 1,000; CSCI 4: 2,500) plus 2 COTS packages.
Q: Incremental model
A: Delivery in successive builds; requirements known up front but delivered in stages. Each build can be estimated independently, with productivity adjustments for team learning.
R: yes
Q: Incremental mail-order example (Fig 12.9)
A: Run 1 = COTS 1-3 + 500 SLOC glue code; Run 2 = COTS module 1 + 500 SLOC CM code; Run 3 = COTS module 3 + 500 SLOC CM code; Run 4 = total-system requirements/design/test across increments.
Q: Evolutionary model
A: Used when general objectives but not specific requirements are known; prototype cycles. Estimating challenge: not all requirements are known at estimate time, but an assessment must be made of what will be done in later phases.
R: yes
Q: Spiral model (Boehm)
A: Iterative, risk-driven cycles: define objectives/alternatives/constraints → evaluate alternatives/assess risk → develop (ending in IOC/FOC/FCA/PCA) → plan next cycle.
R: yes
Q: Estimating advantage of Waterfall
A: It is the basic methodology on which most models and estimating methods are built, so no special techniques are required.
Q: Estimating challenge of Spiral
A: Hard to put on contract and may take longer than other methods; model each phase separately.
Q: How is a waterfall effort modeled?
A: Run all the code through the model at once; no special techniques are required.
Q: Fig 12.8 source gap
A: CEBoK's incremental lifecycle chart (Fig 12.8) appears in the source only as a broken file placeholder, not a viewable figure.

## Techniques
Q: Analogy: definition
A: Comparative analysis of similar systems with adjustments to account for differences between the new and comparable systems.
R: yes
Q: Analogy mail-order example result
A: 406 total hours (224 setup + 80 data load + 85 implementation + 17 training) × \$100,000/yr ÷ 1,920 hrs/yr = \$21,145.
Q: Analogy: when most credible
A: Beyond CEBoK: when the analogous system is truly similar in domain, language, and environment.
Q: Parametric mail-order example (custom code)
A: 19,000 SLOC, A=2.94, E=1.0405 (adjusted for precedent), EM=0.38 (skilled team) → PM = 23.92 → \$382,643 at \$16,000/PM.
Q: Parametric mail-order schedule example
A: Tdev = 3.67 × 23.92^0.262 × 1.0 = 8.43 months (E=1 for this single small CSCI).
Q: Parametric: definition
A: A mathematical relationship between software size and various key parameters known to affect project costs; the most common method of estimating software development costs.
R: yes
Q: Primary estimation techniques for software
A: Analogy and parametric are the two most common techniques.
Q: CER "relevant range" caution
A: A CER built from data in one size range (e.g., 500-2000 FP) may not be valid outside that range (e.g., a 5000 FP estimate).
Q: Steps to develop a custom software CER
A: Careful variable selection, respect the relevant range, normalize the data set, test with scatter plots, then run regression (Module 8).

## Challenges
Q: System Definition challenge
A: Immature requirements at estimate time mean unknown scope; define a notional system with technical experts and independently verify COTS vendor claims.
Q: Sizing and Technology challenge
A: Early size estimates are uncertain; rapid tech change forces COTS re-integration and new-tool learning curves. Size can be estimated with any or all Module 2 methods (analogy, parametric, extrapolation from actuals, expert opinion); the resulting equations are Size Estimating Relationships (SERs) rather than CERs.
Q: Quality challenge: common metrics
A: Defects identified/open/closed, failed fixes, defect severity/location/injection phase, defect density (per 100 FP or 1,000 SLOC), cohesion/coupling, requirements satisfaction %, test coverage, documentation adequacy, MTTD, McCabe cyclomatic complexity.
Q: McCabe's cyclomatic complexity
A: The number of linearly independent paths through a program module; a recognized software quality measure.
R: yes
Q: COTS ~80% rule
A: If COTS can deliver about 80% of required functionality with little/no customization, buying is usually the better option than custom development.
R: yes
Q: COTS challenge
A: No code visibility, hard to customize, integration complexity varies by architecture, beta-version risk, licensing/upgrade costs; the team must still perform requirements definition, design, and test, though overall effort and schedule may be reduced.
Q: Calibration challenge
A: Default parametric model values rarely fit; collect actual project data and calibrate; re-calibrate as practices/technology evolve.
Q: Growth and Demand challenge
A: Delivered size is oftentimes much larger than estimated; primary cause is requirements growth (scope creep). Capers Jones: requirements increase on average from less than 1% (small end-user systems) to 64% (very large military systems). Key to addressing growth: understand when it occurs and use proper change management. Labor-market swings (e.g., pre-Y2K COBOL demand) affect rates and available skill.
Q: Y2K bug and labor market
A: Tight demand for COBOL programmers before 2000 (Y2K remediation) pushed rates up and could force acceptance of less-qualified staff.
Q: Testable Topics for Module 12
A: All main content is testable. No content is "testable but less emphasized." Related and Advanced Topics are not testable.

## Advanced (not testable)
Q: General guideline caution (CEBoK)
A: Don't apply an old/cross-domain factor (e.g., a 20-year-old COBOL factor to C++, or an AIS factor to manned space life support software) — guideline variance is large and domain-specific.
Q: OO programming benefits (CEBoK list)
A: Reuse/rapid prototyping from standard objects, better quality with easier-to-locate defects, reduced admin/design effort, modular/message-based (no system-wide change to add capability).
Q: Object points: origin and adopter
A: Developed by Banker, Kauffman, and Kumar for banking-system sizing; later adopted by Boehm in one of his models.
R: yes
Q: Object points: pros and cons
A: Pro: user-interface-oriented, less subjective than SLOC. Con: not widely used, can't be counted until end of design, limited historical data.
Q: AIS (Automated Information Systems)
A: A categorization of an acquisition program that acquires IT (equipment integral to a weapon system or a tactical communication system); estimates are largely software development; not typically hardware intensive; commonly cutting-edge technology, difficult to estimate given rapid changes in technical baselines.
R: yes
Q: ERP (Enterprise Resource Planning)
A: Business system on a single common database with modular design; estimating adds gap analysis, business process re-engineering, and COTS integration and model development, in addition to traditional custom code estimation.
R: yes
Q: Debated ERP cost drivers
A: Dollars spent on the ERP package and number of requirements are common candidates, but some experts argue human factors (user acceptance/resistance) matter more.

## Key Formulas
Q: Effort equation
A: $Effort = a \times Size^b \times EAF$
R: yes
Q: COCOMO II effort equation
A: $PM = A \times Size^E \times \prod EM_i$, A = 2.94, Size in KSLOC.
R: yes
Q: ESLOC weighting factor
A: $ESLOC = SLOC \times [0.40(\%\,design\ modified) + 0.30(\%\,code\ modified) + 0.30(\%\,integration\ and\ test)]$
R: yes
Q: ESLOC for a mixed code base (Beyond CEBoK)
A: $New + Modified \times AAF + Reused \times AAF$ (app's extension; AAF is the app's name for the bracketed factor)
R: yes
Q: VAF (IFPUG detail, Beyond CEBoK)
A: $0.65 + 0.01 \times \sum (14\ GSC\ ratings)$
R: yes
Q: AFP (IFPUG detail, Beyond CEBoK)
A: $UFP \times VAF$
R: yes
Q: Effort multiplier when size doubles
A: $2^b$ (when b > 1, multiplier > 2)
Q: Growth-adjusted size (app-derived, Beyond CEBoK)
A: $Initial\ Size \times (1 + Growth\ Factor)$
R: yes
`
});
