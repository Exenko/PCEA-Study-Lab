PCEA.addModule({
  id: 'm12', num: 12, title: 'Software Cost Estimating', short: 'Software', source: 'guide',
  blurb: 'Labor-driven cost model. Size (SLOC, function points), equivalent SLOC (ESLOC), complexity and capability drivers, lifecycle models, diseconomies of scale.',
  intro: String.raw`Software cost is nearly 100\% **labor**, driven primarily by **size** (source lines of code or function points), adjusted for complexity, team capability, and schedule.

The estimator must characterize size, select/calibrate a parametric model, apply cost drivers, and cross-check with analogy. Expect **cost and size growth** during development—it is the norm, not the exception.

**Key difference from hardware:** copies are almost free; nearly all cost is development (non-recurring) and maintenance. No production learning curve. This module uses the **COCOMO II** CER (Boehm) throughout because it is publicly available; many commercial models use similar but proprietary relationships.`,

  sections: [
    {
      id: 'overview',
      title: 'Software vs. Hardware',
      summary: 'Process, WBS, labor-heavy economics',
      body: String.raw`### Similarities
- Both follow a lifecycle: requirements → design → build → test → deployment, and both require ongoing maintenance support once operational (included in the program's Life Cycle Cost Estimate)
- Both use analogy, parametric, and build-up estimating techniques
- The three main cost driver categories are the same for both: **size, complexity, capability**

### Differences
| | Software | Hardware |
|---|---|---|
| **Cost composition** | Nearly 100\% labor; copies are almost free | Materials + labor + recurring production |
| **Production phase** | Developed once; software maintenance costs **can significantly exceed** the cost of developing the software | Recurring unit production with learning curves |
| **Measurability** | Intangible: progress is hard to measure objectively | Physical, observable, measurable (weight) |
| **Data/history** | Development moves fast (new languages, methodologies); historical data is limited or restricted | Longer, more mature history; slower, more predictable change |
| **Wear** | Software does not wear out; it fails from latent defects and evolving requirements | Hardware wear/failure patterns are traceable, and hardware may need replacement due to obsolescence |

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

### Work Breakdown Structure for software programs

Most organizations mandate a defined WBS (MIL-HDBK-881A gives guidance but allows tailoring; there is no single industry standard). A software WBS is commonly organized by **build/release** and by CSCI/CSC rather than purely by lifecycle phase, so that integration, test, and program management — which do not scale linearly with size alone — can be captured as their own elements.

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

SIT&E = Systems Integration Test and Engineering. Each software WBS element should carry its own size, language, reuse, and complexity rating; when using actuals from one program's WBS to estimate another, confirm that both programs define WBS terms (CSCI, build, module) the same way.

:::tip Beyond CEBoK
Coding is commonly cited (outside CEBoK's core text) as only about 15–25\% of total software development effort, with design, integration, and test consuming the majority. Software maintenance is also frequently cited as exceeding 50\% of total lifecycle cost. CEBoK does state maintenance "can be significantly higher" than development cost, without giving a specific percentage.
:::

:::check
Q: Why don't learning curves apply to producing copies of software?
* Replicating software costs almost nothing; the cost is in development, not repeated production
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
Q: In a software WBS, why are integration, test, and program management often broken out as separate elements rather than folded into each CSCI?
* They do not scale linearly with size alone
- They are the only elements that require a CSCI
- They have no cost impact
- MIL-HDBK-881A forbids combining them
> These functions have their own cost drivers (interfaces, coordination) independent of any one CSCI's size.
:::
`
    },

    {
      id: 'size',
      title: 'Size Metrics: SLOC and Function Points',
      summary: 'Definitions, ESLOC with adjustment factors, function point counting',
      body: String.raw`### Source Lines of Code (SLOC)

**Definition:** SLOC (also called delivered source instructions) typically includes executable instructions and data declarations but **excludes comments, blanks, and continuation lines**. There are no standardized rules for *estimating* SLOC before code exists — the most common technique is analogy. Once code is written, automated tools can count it accurately and consistently.

**SLOC advantages:**
- Widely used; most software cost models take SLOC as their size input
- Many organizations already have SLOC-based historical data
- Easily counted by automated code counters once a project is complete

**SLOC disadvantages:**
- No standard counting rules, so discrepancies occur even between organizations that both claim a "standard" definition — code counts thought to be logical but actually physical can badly distort productivity
- Highly language- and platform-dependent: the same function may take very different line counts in different languages, making cross-language comparison unreliable
- Dependent on developer skill and coding style

### Counting reused and adapted code

Software size is rarely all new. Common terms (definitions vary by organization, so confirm what is being counted):
- **Reused / verbatim**: copied directly with no modification
- **Adapted / customized / modified**: requires some redesign, recode, and retest
- **New**: requires 100\% design, code, and test

### Equivalent SLOC (ESLOC): reuse and modification

Modified or reused code is cheaper than new code, but **not free** — even claims of "no testing required" are suspect; some retest is always needed before integration. Boehm's equation converts a mix of new/modified/reused code to **equivalent new-code size** using an adaptation adjustment factor (AAF):

$$AAF = 0.4(\text{\% Design modified}) + 0.3(\text{\% Code modified}) + 0.3(\text{\% Integration/Test effort})$$

$$ESLOC = New\,SLOC + Modified\,SLOC \times AAF + Reused\,SLOC \times AAF$$

The 0.4/0.3/0.3 split assumes 40\% of a new-development effort is design, 30\% code, 30\% integration and test; other ratios (e.g., 40/25/35) are also used, but the three weights should sum to 100\%.

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

**Definition:** IFPUG function points measure functionality **as seen by the user** (based on Functional User Requirements — inputs, outputs, files), independent of programming language, and can be counted from requirements documentation before code exists.

**Five function types**, each counted at low/average/high complexity:
1. **External Inputs (EI):** data entry, commands → weights 3/4/6
2. **External Outputs (EO):** reports, displays → weights 4/5/7
3. **External Inquiries (EQ):** interactive queries → weights 3/4/6
4. **Internal Logical Files (ILF):** databases → weights 7/10/15
5. **External Interface Files (EIF):** data from other systems → weights 5/7/10

**Five-step counting process (CEBoK):**
1. Determine the type of FP count
2. Identify the scope and boundaries of the application
3. Count the data function types and transaction function types
4. Calculate the UFP and the VAF
5. Calculate the AFP

$$VAF = 0.65 + 0.01 \sum_{i=1}^{14} GSC_i$$

$$AFP = UFP \times VAF$$

where VAF is the Value Adjustment Factor based on 14 General System Characteristics (GSCs), each rated 0–5.

+++

:::example
10 EI (avg, weight 4) = 40; 5 EO (avg, weight 5) = 25; 8 EQ (avg, weight 4) = 32; 3 ILF (avg, weight 10) = 30; 2 EIF (avg, weight 7) = 14.

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
Q: 8 EI (avg, weight 4), 6 EO (avg, weight 5), 4 EQ (avg, weight 4), 2 ILF (avg, weight 10), 3 EIF (avg, weight 7). Sum of 14 GSC ratings = 40. What is AFP?
= 125 ±1
> $UFP = (8 \times 4) + (6 \times 5) + (4 \times 4) + (2 \times 10) + (3 \times 7) = 32 + 30 + 16 + 20 + 21 = 119$. $VAF = 0.65 + 0.01(40) = 1.05$. $AFP = 119 \times 1.05 = 124.95 \approx 125$
:::

:::check
Q: Why can requirements growth alone significantly increase software cost even if the code is well written?
* Size is the primary cost driver, so growth in requirements grows the size estimate and therefore the effort
- Requirements growth only affects schedule, never cost
- Function points are immune to requirements growth
- Growth only matters after delivery
> Capers Jones data cited by CEBoK shows requirements can grow anywhere from under 1\% (small end-user systems) to 64\% (very large military systems) from initial estimate to delivery — and since size drives effort, that growth drives cost.
:::
`
    },

    {
      id: 'drivers',
      title: 'Cost Drivers: Complexity and Capability',
      summary: 'The second and third main cost-driver categories, per CEBoK/COCOMO II',
      body: String.raw`Beyond size, COCOMO II expresses effort as:

$$PM = A \times Size^{E} \times \prod_{i=1}^{n} EM_i$$

where $A = 2.94$ (a constant), $Size$ is KSLOC, $E$ is the sum of scale factors, and $EM_i$ are effort multipliers for complexity, capability, schedule, and other cost drivers.

### Complexity

Complexity relates to the difficulty of the software's logic/algorithms — reflected in language, function (intended use), hardware limitations, number of modules, amount of integration, percent of new code, and quality of development (for maintenance). CEBoK notes there is little published statistical proof of complexity's significance, a symptom of scarce software cost data.

**Table 12.3 (Complexity as a cost driver, 100 KSLOC example, nominal capability):**

| Rating | EAF | PM | Cost @ \$16,000/PM |
|---|---|---|---|
| Very Low | 0.60 | 279 | \$4,467,027 |
| Nominal | 1.00 | 465 | \$7,445,045 |
| Very High | 3.50 | 1,628 | \$26,057,657 |

These EAF values are the *product* of several individual complexity multipliers, all set to best-case or worst-case — an illustration of the extreme, not a typical project.

**Language** ranges from machine language (1GL) through assembly (2GL) to High-Order Languages such as FORTRAN, C, Ada, COBOL (3GL), toward future 4GLs. Object-oriented languages (Ada 95, C++) shift effort toward design and reduce code/test effort.

**Function** (intended use) drives required reliability and testing. PRICE S's application types range from simple to demanding: Statistical/Mathematical, String Manipulation, GUI, Data Storage and Retrieval, Graphical Functions, Online Communications, Control Functions, Multi-Media, Real Time, Interactive, Operating System, Logical Functions — roughly increasing in required reliability, timing criticality, and hardware interaction toward the end of the list.

**Hardware limitations** (constrained memory/storage on weapon or space systems, or schedule risk from concurrent hardware/software development) and **number of modules** (more modules → more integration, standardization, communication, coordination) both add complexity.

### Capability

Capability covers the skill, experience, and working conditions of the development team: application experience, general skill, schedule constraints, tools experience, and development location. Better, more experienced developers — and better development tools (CASE) — reduce effort; a compressed schedule, a difficult work environment, or inexperienced staff raise it.

**Table 12.4 (Capability as a cost driver, 100 KSLOC, nominal complexity):**

| Rating | EM | PM | Rate | Cost |
|---|---|---|---|---|
| Best | 0.33 | 154 | \$20,000/PM | \$3,071,081 |
| Nominal | 1.00 | 465 | \$16,000/PM | \$7,445,045 |
| Worst (junior) | 5.22 | 2,429 | \$14,000/PM | \$34,005,242 |

Note the reversal from complexity: high complexity multiplies *up* (harder software costs more), while high capability multiplies *down* (better people cost less effort even though their labor rate is higher). CEBoK also notes the effect is asymmetric — the drop from nominal to low capability hurts more than the gain from nominal to high capability.

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
"Adding people to a late software project often makes it later" (Brooks' Law) is a widely cited software-management principle, not a line from this CEBoK module's core text — but it is consistent with CEBoK's schedule-compression discussion (see the Schedule section): compressing schedule below nominal generally raises effort rather than lowering it.
:::
`
    },

    {
      id: 'cost-drivers-example',
      title: 'Cost Drivers Example: The Mail-Order Business',
      summary: 'Full worked COCOMO II example: size, complexity, and capability',
      body: String.raw`CEBoK runs one running example through the whole module: a hardware store's owner is moving into mail order and needs a system covering human resources, accounting, customer management, and inventory management. The first developer proposal sizes the system at **100,000 SLOC** across three CSCIs: CSCI 1 = 45,000 SLOC, CSCI 2 = 35,000 SLOC, CSCI 3 = 20,000 SLOC (100,000 total).

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
      body: String.raw`### General form

$$Effort = a \times Size^{b} \times EAF$$

- $Effort$ = person-months (or person-hours)
- $Size$ = ESLOC (in thousands: KESLOC) or function points
- $a$ = productivity/calibration constant (depends on organization and environment); COCOMO II uses $a = 2.94$ for early-design estimates
- $b$ = **scale exponent** (COCOMO II calls this $E$): how fast effort grows relative to size
- $EAF$ = Effort Adjustment Factor = product of individual cost driver multipliers

### The scale exponent: diseconomies of scale

**For software, $b$ typically exceeds 1.0.** Doubling size multiplies effort by more than double.

$$\text{Effort multiplier when size doubles} = 2^b$$

**Why?** Coordination overhead, interface management, and integration complexity grow **disproportionately** as systems grow larger — the opposite of hardware, where bigger production runs reduce unit cost via learning curves/economies of scale.

- $b = 1.0$: Linear (effort doubles when size doubles) — rare
- $b = 1.05$ to $1.15$: Typical software diseconomy (COCOMO II's nominal early-design $E = 1.0997$ falls in this band)
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
> $75^{1.08} = 105.94$ (not 127.1). $3.2 \times 105.94 \times 1.2 \approx 407$ PM
:::

+++

### Cost driver multipliers

COCOMO II-family models rate each driver on a scale and map it to a numeric multiplier (see the Cost Drivers section for CEBoK's actual Table 12.3/12.4 complexity and capability numbers: 0.60/1.0/3.5 and 0.33/1.0/5.22). The **EAF** is the product of all applicable driver multipliers.

:::tip Beyond CEBoK
A generic "Very Low ≈ <1.0 … Extra High ≈ 1.6–2.0+" multiplier scale, and specific EAF ranges like "1.5 to 2.0 or more" for a stack of high ratings, are common industry framing rather than numbers printed in this CEBoK module — for CEBoK's own worked complexity/capability multipliers, use Tables 12.3 and 12.4.
:::

:::tip Beyond CEBoK
Cost driver selection is as important as size in a credible software estimate — CEBoK's own example shows a 100 KSLOC project ranging from about 154 PM (best team, low complexity) to well over 2,400 PM (junior team, high complexity) purely from driver choices.
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
      body: String.raw`### Schedule months vs. person-months

**Schedule months** are calendar months to develop the software. **Person-months (effort)** = schedule months × number of people working. A six-month project with three people has a 6-month schedule but 18 person-months of effort.

### COCOMO II schedule equation

$$T_{dev} = C \times (PM_{NS})^{(D + 0.2[E - B])} \times SCED\%$$

where $C = 3.67$, $B = 0.91$, $D = 0.28$, $PM_{NS}$ is unscaled person-months, $E$ is the sum of scale factors, and $SCED\%$ is the schedule compression/decompression fraction of the nominal schedule (e.g., a 25\% compression means $SCED\% = 0.75$; a 50\% stretch-out means $SCED\% = 1.50$).

**Schedule example** (mail-order system, 100,000 SLOC, no compression): with $PM = 465$, $E = 1.1433$, $SCED\% = 1.0$:

$$T_{dev} = 3.67 \times 465^{(0.28 + 0.2[1.1433 - 0.91])} \times 1.0 = 27.28\ \text{months}$$

**Convention:** COCOMO II assumes **152 hours per person-month**. If a proposal instead assumes 160 hours/PM, multiply the COCOMO II person-month estimate by $152/160 = 0.95$ to convert to the proposal's units — always document the hours-per-PM convention used.

**Schedule compression example:** the owner needs the system in 18 calendar months instead of 27.28. Solving for SCED%:

$$SCED\% = \frac{18}{3.67 \times 465^{(0.28 + 0.2[1.1433-0.91])}} = 0.66$$

Compressing to 18 months requires **34\% compression** ($1 - 0.66$). This compression should feed back into the cost estimate, not just the schedule estimate, since compressed schedules typically raise effort.

:::widget sw-schedule:::

+++

:::check
Q: With PM = 465, E = 1.1433, and no compression (SCED\% = 1.0), the COCOMO II nominal schedule is closest to...
= 27.28 ±0.3
> $T_{dev} = 3.67 \times 465^{(0.28+0.2[1.1433-0.91])} \times 1.0 \approx 27.28$ months.
:::

:::check
Q: What happens to effort when the schedule is compressed well below nominal?
* It rises
- It falls proportionally
- No change
> Compression requires more staff working in parallel, which adds communication and integration overhead, increasing total effort.
:::

:::warn
**Do not assume schedule = effort ÷ staff.** COCOMO II's schedule equation is driven by effort raised to a fractional exponent, not simple division — software has inherent sequential dependencies and communication overhead.
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

Software does not wear out like hardware, but continued use uncovers latent bugs and new environments expose new problems:
- **Corrective maintenance:** fixes bugs — errors in the code that must change for the software to perform as designed
- **Adaptive maintenance:** accommodates new requirements — hardware changes, COTS upgrades that force changes, new customer requirements
- **Perfective maintenance:** improves the software — speed, reliability, or added functionality

One approach treats maintenance as a **mini-development effort**: isolate the problem code, redesign/recode/retest it, and run the cost model in development mode (not a dedicated maintenance mode), using the same cost drivers but paying particular attention to the quality/condition of the existing code.

:::check
Q: A user requests a new report feature not in the original requirements. Which maintenance type is this?
- Corrective
* Adaptive
- Perfective
> Adaptive maintenance accommodates new requirements, including new customer-requested capability.
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
      body: String.raw`### Programming paradigms: linear vs. object-oriented

A **programming paradigm** is a fundamental style of writing solutions; a **methodology** is a style of solving specific software-engineering problems. Traditional (**linear**) programming builds a system largely custom, one instruction at a time — CEBoK likens this to gunsmithing before 1798, when every gun's parts were hand-fitted to that gun alone, with no interchangeability between guns built by different craftsmen.

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

Sequential phase-gate: requirements → design → code → test → deploy, each phase finished before the next begins.

**Benefits:** appropriate when requirements are known and stable; provides clear structure and milestones. **Pitfalls:** long cycle before any usable product; no prototyping; not attuned to evolving needs.

**Modeling waterfall:** since it's the basic methodology most commercial models are built around, no special technique is needed — run the whole CSCI/CSC breakdown through the model at once. In the example, the first consultant uses COTS packages for HR, accounting, and inventory, and custom-develops only the Customer Management System (CMS), since its requirements are small and stable:

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

**Modeling incremental:** split the estimate into (a) whole-system effort (system requirements/design, software requirements analysis, system test) and (b) each increment modeled as a stand-alone waterfall effort (CSCI design through CSCI test only). If sequential and the same team continues, adjust productivity upward for later increments from team learning; add system testing at each delivered increment if the increments are interdependent.

CEBoK's Figure 12.9 example: Run 1 (Increment 1) = COTS packages 1–3 + 500 SLOC of "glue" code; Run 2 (Increment 2) = COTS module 1 + 500 SLOC of Customer Management code; Run 3 (Increment 3) = COTS module 3 + 500 SLOC of Customer Management code; Run 4 = total-system requirements analysis, design, and test across Increments 1–3. Total effort is the sum of all four runs.

### Evolutionary

Used when the customer has general objectives but not specific requirements: a core-capability prototype is built, reviewed, and refined across repeated cycles until complete or resources run out. Prototypes may be a paper/software model, a working product, or a similar existing product.

**Benefits:** rapid delivery of an initial product; strong customer involvement. **Pitfalls:** hard to model with no defined ending; may take longer than waterfall; the system must be architected to evolve.

**Modeling evolutionary:** treat each phase as its own waterfall effort, but adjust design/code/test levels because earlier-phase software isn't expected to be fully analyzed/designed/coded/tested — later phases build on (reuse/modify) prior code plus new functionality; requirements for later phases aren't fully known at estimate time, so assessments must be made and estimates refined each cycle.

In the mail-order example, the third consultant develops the CMS and integrates COTS in Phase 1 (prototype only, static screens, no database link); Phase 2 links the interface to the order database and adds validation and email/status notifications; Phase 3 adds automated notifications and search-by-field. Each phase mixes new code, adapted prior-phase code (treated similarly to COTS/reuse), and integration/test effort.

### Spiral model (Boehm, 1988)

Combines an underlying methodology (waterfall/incremental/evolutionary) with explicit **risk analysis** each cycle. Each spiral runs four quadrants: (1) define objectives, alternatives, constraints; (2) evaluate alternatives, assess risk; (3) development tasks (e.g., an evolutionary phase or waterfall's requirements analysis), ending with IOC/FOC/FCA/PCA; (4) plan the next spiral.

**Benefits:** risk-driven, cost estimate refreshed every spiral. **Pitfalls:** hard to put on a fixed-price contract; may take longer than other methods.

**Modeling spiral:** similar to evolutionary — model each phase separately, account for reuse from the previous spiral, and include only the phases actually addressed in an early spiral (e.g., only requirements/specification work, no coding yet). Add extra effort for risk assessment, planning, and objectives analysis if the estimating model/CER doesn't already address it.

:::widget sloc-rollup:::

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
**Waterfall** allows a confident single-point estimate at program start (scope is fully known). **Evolutionary** and **Spiral** expect estimates to be refined at each iteration because requirements or risks aren't fully known upfront. **Incremental** sits in between: requirements are known early, but delivery — and productivity — should be modeled per increment.
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
Q: Why is the incremental model's estimate typically built from a whole-system estimate plus per-increment estimates, rather than one single model run?
* Whole-system activities (like final system test) don't belong to any one increment, and per-increment productivity may improve with team experience
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
      body: String.raw`### Analogy

Compare the new software system to a **similar, historical system** with known actual cost, adjusting for differences in size, complexity, and capability. Most credible when the analogous system is truly similar in application domain, language, and environment; often used as a **cross-check** rather than a primary technique.

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

**Advantages:** requires only a comparable project; often available early (pre-Milestone A); can be highly credible if the comparison is close. **Disadvantages:** depends on finding a truly analogous project; adjustments can be subjective.

+++

### Parametric

Uses a **CER** (cost estimating relationship) calibrated to historical data, relating size and cost drivers to effort. The most common software estimating method; COCOMO II, SEER-SEM, PRICE TruePlanning, SLIM, and Construx are all parametric.

**Worked example (mail-order, custom Customer Management code):** the same first consultant uses COCOMO II for the 19,000 SLOC of custom code (from the waterfall breakdown), with $A = 2.94$, an adjusted scale exponent $E = 1.0405$ (lower than the nominal 1.0997 because the developer has done many similar efforts), and an effort multiplier $EM = 0.38$ (a highly skilled, specialized team):

$$PM = 2.94 \times 19^{1.0405} \times 0.38 = 23.92\ \text{person-months}$$

At \$16,000/PM: $23.92 \times \$16{,}000 = \$382{,}643$ (this is added to the analogy-based COTS estimate above).

**Schedule for the same effort** ($PM = 23.92$, $E = 1$ since it's a single small CSCI, $SCED\% = 1.0$):

$$T_{dev} = 3.67 \times 23.92^{0.262} \times 1.0 = 8.43\ \text{months}$$

:::note CEBoK's exponent
CEBoK uses 0.262 here, but its own schedule equation with $E = 1$ gives $0.28 + 0.2(1 - 0.91) = 0.298$, which yields about 9.4 months. Learn CEBoK's printed 8.43 for the exam, and know the equation.
:::

**Advantages:** systematic, repeatable, auditable; diseconomies of scale built in; can be calibrated to your own organization's data. **Disadvantages:** requires historical data to calibrate; coefficients ($a$, $b$/$E$, EM ratings) must be tailored to your domain; uncalibrated generic industry averages can be far off.

+++

:::key
**Use both analogy and parametric as cross-checks.** If they disagree, the difference signals uncertainty; investigate why before committing to an estimate.
:::

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
      body: String.raw`| Challenge | Why it matters | Mitigation |
|---|---|---|
| **System Definition** | Immature requirements mean unknown scope at estimate time | Define a notional system with technical experts; identify COTS candidates and independently verify vendor claims; document assumptions and risk for unknowns |
| **Sizing & Technology** | Early size estimates are very uncertain; rapid technology change forces re-integration and tool learning curves | Use multiple sizing methods (Size Estimating Relationships, analogy, parametric); plan for technology refresh and COTS version updates during design, not after |
| **Quality** | Poor requirements/interfaces/coding lead to defects found late, when rework is most expensive | Break work into manageable components; define coding standards, taxonomy, interfaces up front; verify/validate and trace requirements each phase; track quality metrics |
| **COTS Integration** | COTS is not free: no code visibility, customization limits, integration complexity, beta-version risk, licensing/upgrades | Treat COTS integration like reused code: estimate design, code, and test effort separately; apply the ~80\% rule (below) to the build-vs-buy decision |
| **Calibration** | Productivity rates vary enormously by domain, language, environment; default model values rarely fit | Collect actual cost/schedule/size data from completed efforts; calibrate the model to it; re-calibrate as practices/technology evolve |
| **Growth & Demand** | Size and effort grow during development (requirements creep is the documented norm); labor market conditions shift rates and availability | Apply growth factors to early size estimates; add risk reserve; watch for tight-labor-market effects (e.g., pre-Y2K demand for COBOL programmers pushed rates up and average skill down) |

### Quality metrics

Typical software quality measures: total defects identified, defects open/closed, failed fixes, defect severity and injection phase, and **defect density** (defects per 100 function points or per 1,000 SLOC). Many models estimate expected defects so a project manager can compare against discovered defects to judge whether QA/testing is adequate. Other indicators: degree of **cohesion and coupling** between modules, percentage of requirements satisfied, test coverage, documentation adequacy, **Mean Time to Defect (MTTD)**, and **McCabe's cyclomatic complexity** (the number of linearly independent paths through a module).

### COTS: the ~80\% rule

A common build-vs-buy rule of thumb: if roughly **80\%** of required functionality can be delivered by COTS software with little or no customization, buying is usually the better option; heavy customization needs can make new development more cost-effective instead. Even when buying, the team still performs requirements definition, design, and test — a reduced but nonzero effort — and support costs depend on how much of the system is COTS and how tightly it's integrated with custom code.

### Growth and the labor market

Requirements/size growth is the documented norm, driven by poor initial understanding, added stakeholder capabilities, new legal/market requirements, and (per Capers Jones data) ranging from under 1\% growth on small end-user systems to 64\% on very large military systems — worse the later in the lifecycle requirements change, since late changes can force redesign and rework of completed code. Labor market swings (e.g., the pre-2000 scramble for COBOL programmers due to the **Y2K bug**) can push rates up or force acceptance of less-qualified staff, and can make historical calibration data stale relative to current market conditions.

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
Q: Per Capers Jones data cited by CEBoK, requirements growth on very large military systems can reach approximately...
= 64 ±2
> CEBoK cites a range from under 1\% (small end-user systems) to about 64\% (very large military systems).
:::

:::check
Q: Early estimate for a new system is 40 KSLOC. Historical data on similar programs shows average size growth of 35\% from initial estimate to delivery. What total size should the estimate account for?
= 54 ±1
> $40 \times (1 + 0.35) = 40 \times 1.35 = 54$ KSLOC. Growth is the norm, not the exception; build it in upfront.
:::

:::warn
**Apply growth factors and risk reserves.** Requirements/size creep is not a risk to flag and forget — it is the documented baseline expectation for software programs.
:::`
    },

    {
      id: 'advanced',
      title: 'Advanced: Guidelines, OO, Object Points & IT Estimating',
      summary: 'Not testable per CEBoK — general guidelines, OO benefits, object points, AIS/ERP',
      body: String.raw`:::note Not testable per CEBoK
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

**Automated Information Systems (AIS):** an acquisition category for IT-heavy systems (not hardware-intensive); estimates are largely software-development estimates. AIS often involves cutting-edge, rapidly changing technology, making estimation difficult.

**Enterprise Resource Planning (ERP):** a business support system built on a **single common database** and modular software design. Estimating ERP implementation adds **gap analysis**, **business process re-engineering (BPR)**, and COTS integration/model development on top of traditional custom-code estimation. ERP cost drivers are less mature than traditional software drivers and are debated — commonly cited candidates include the dollars spent on the ERP package and the number of requirements, though some experts argue human factors (user comfort with and acceptance of the new system) matter more than any empirical driver, since employee resistance can drive up implementation cost.

**Fig. 12.16** compares AIS vs. ERP program costs; CEBoK states the difference is quantifiable but the source figure's numbers are not legible here — treat this as a described comparison, not a source of specific figures to cite.

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
* It must also account for gap analysis, business process re-engineering, and COTS integration/configuration around a single common database
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
A: Software is nearly 100% labor, copies are free, no production learning curve. Maintenance can significantly exceed development cost. Nearly infinitely malleable (requirements creep).
Q: What is CSCI?
A: Computer Software Configuration Item: a software element in the WBS managed as a unit; may be broken into CSCs, and further into CSUs.
Q: What is CSC?
A: Computer Software Component: a subdivision of a CSCI.
Q: The seven system engineering steps for software (CEBoK)
A: (1) System requirements & design, (2) Software requirements analysis, (3) Preliminary & detailed design, (4) Code and unit test, (5) Unit integration and test, (6) Software system test, (7) System test.
Q: Why is unit testing considered a development step, not a test-phase step?
A: It occurs inside "Code and Unit Test" (step 4) and verifies the unit before integration, per CEBoK's step list.
Q: Why is software progress ("90% done") hard to measure objectively?
A: Software is intangible; progress cannot be measured like physical progress.
Q: Similarities: software and hardware estimating
A: Both follow a lifecycle; both use analogy, parametric, and build-up techniques; drivers fall into the same three categories: size, complexity, capability.
Q: SIT&E (WBS term)
A: Systems Integration Test and Engineering.

## Size Metrics
Q: Primary driver of software effort
A: Size (SLOC or function points).
Q: SLOC: definition and counting pitfall
A: Executable instructions and data declarations, excluding comments/blanks/continuation lines. No standardized estimating rules; counting conventions must match between historical data and new estimate.
Q: Why SLOC varies by language
A: The same logic can take very different line counts in different languages; raw SLOC comparison across languages is misleading.
Q: SLOC advantage
A: Widely used, available in existing historical data, easily counted by automated tools once code exists.
Q: SLOC disadvantage
A: No standard counting rules (logical vs. physical confusion), language/platform dependence, dependent on developer style.
Q: Reused vs. adapted/customized vs. verbatim code
A: Verbatim/reused = copied with no modification. Adapted/customized/modified = needs some redesign, recode, retest. New = requires full design, code, test.
Q: Equivalent SLOC (ESLOC)
A: New + Modified × AAF + Reused × AAF. Converts a mix of new/modified/reused code to equivalent new-code effort.
Q: Why isn't reused code counted as zero cost?
A: Reused code still requires understanding, integration, regression testing, and verification; it always carries a small but nonzero AAF.
Q: COCOMO adaptation adjustment factor (AAF)
A: 0.4 × (% design modified) + 0.3 × (% code modified) + 0.3 × (% integration/test effort); weights should sum to 100%.
Q: How to read: DM=15%, CM=25%, IM=20%
A: Design 15% modified, code 25% modified, integration/test 20% effort needed.
Q: Function Points: definition
A: A language-independent size measure based on delivered functionality (inputs, outputs, files) as seen by the user, per IFPUG's Functional User Requirements.
Q: Five-step FP counting process (CEBoK)
A: (1) Determine type of FP count, (2) identify scope/boundaries, (3) count data and transaction function types, (4) calculate UFP and VAF, (5) calculate AFP.
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
Q: FP advantages
A: Available early (from requirements), usable throughout the lifecycle, language/technology-agnostic, unaffected by programmer skill or style.
Q: FP disadvantages
A: Requires trained analysts (CPM rules), more effort than SLOC to count, doesn't measure non-functional requirements (addressed by SNAP).
Q: SNAP
A: Software Non-functional Assessment Process (IFPUG): measures non-functional requirements that plain function points miss.
Q: Capers Jones requirements growth range
A: From under 1% (small end-user systems) to 64% (very large military systems), from initial estimate to delivery.

## Complexity and Capability
Q: What is complexity in software estimating?
A: Difficulty of logic/algorithms, reflected in language, function, hardware limitations, number of modules, integration amount, % new code, and quality of development.
Q: CEBoK Table 12.3 complexity EAF values (100 KSLOC example)
A: Very Low = 0.60 (279 PM), Nominal = 1.0 (465 PM), Very High = 3.5 (1,628 PM).
Q: CEBoK Table 12.4 capability EM values (100 KSLOC example)
A: Best = 0.33 (154 PM, \$20,000/PM), Nominal = 1.0 (465 PM, \$16,000/PM), Worst/junior = 5.22 (2,429 PM, \$14,000/PM).
Q: Why does high complexity raise the multiplier but high capability lower it?
A: Complex software takes more effort (EAF > 1); capable teams need less effort per line despite a higher pay rate (EM < 1).
Q: Capability: definition
A: Application experience, general skill, schedule constraints, tools experience, development location.
Q: PRICE S application types (examples)
A: Statistical/Mathematical, String Manipulation, GUI, Data Storage/Retrieval, Graphical Functions, Online Communications, Control Functions, Multi-Media, Real Time, Interactive, Operating System, Logical Functions.
Q: Why is schedule compression difficult in software?
A: Adding people increases communication overhead; inherent sequential constraints (design→code→test) cannot be paralleled away.
Q: What is the nominal schedule?
A: The COCOMO II schedule equation's output reflecting inherent sequential/critical-path constraints, independent of staffing level.

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
Q: Meaning of a in the effort equation
A: Productivity/calibration constant; COCOMO II uses a = 2.94 for early-design estimates.
Q: Meaning of b (E) in the effort equation
A: Scale exponent: how fast effort grows relative to size. For software, b > 1.0 (diseconomies of scale); COCOMO II nominal early-design E = 1.0997.
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

## Schedule and PDSS
Q: COCOMO II schedule equation
A: Tdev = C × (PM_NS)^(D + 0.2(E - B)) × SCED%, with C = 3.67, B = 0.91, D = 0.28.
Q: Mail-order schedule example result
A: 100,000 SLOC, PM = 465, E = 1.1433, SCED% = 1.0 → Tdev ≈ 27.28 months.
Q: Mail-order schedule compression example
A: To hit 18 months instead of 27.28, SCED% = 0.66, i.e., 34% compression.
Q: COCOMO II hours-per-person-month convention
A: 152 hours/PM. If a proposal assumes 160 hrs/PM, multiply COCOMO II's PM estimate by 152/160 = 0.95 to convert.
Q: Can you compress software schedule below the nominal level?
A: Yes, but with costs: more staff (communication overhead), higher defect rates, rework, and often little actual calendar reduction — and it should be reflected in the cost estimate too.
Q: Post-Deployment Software Support (PDSS)
A: Support during Operations & Support (O&S) phase; includes but is not limited to maintenance (e.g., also help desk/trouble tickets, often not captured by cost models).
Q: Three types of software maintenance
A: Corrective (fix bugs), Adaptive (accommodate new requirements), Perfective (improve speed/reliability/functionality).
Q: Maintenance as "mini-development"
A: Treat maintenance like a small development effort: isolate, redesign, recode, retest the affected code, running the model in development mode with the same cost drivers.

## Lifecycle Models
Q: Eli Whitney (1798) analogy in CEBoK
A: Standardized interchangeable gun parts (vs. custom-fit parts per gun) is CEBoK's analogy for OO programming's reusable, interchangeable objects vs. linear one-at-a-time coding.
Q: Linear vs. OO programming paradigm
A: Linear builds systems largely custom, instruction by instruction. OO builds from reusable, interchangeable objects, reducing from-scratch development over time.
Q: Waterfall model
A: Sequential phases, each finished before the next. Predictable, easy to estimate/plan, but inflexible and defects found late are costly.
Q: Waterfall mail-order example: total custom SLOC
A: 19,000 SLOC (CSCI 1: 5,000+7,500; CSCI 2: 3,000; CSCI 3: 1,000; CSCI 4: 2,500) plus 2 COTS packages.
Q: Incremental model
A: Delivery in successive builds; requirements known up front but delivered in stages. Each build can be estimated independently, with productivity adjustments for team learning.
Q: Incremental mail-order example (Fig 12.9)
A: Run 1 = COTS 1-3 + 500 SLOC glue code; Run 2 = COTS module 1 + 500 SLOC CM code; Run 3 = COTS module 3 + 500 SLOC CM code; Run 4 = total-system requirements/design/test across increments.
Q: Evolutionary model
A: Requirements refined as builds are fielded via prototype cycles. Later scope uncertain; estimates must be wide and refined each cycle.
Q: Spiral model (Boehm)
A: Iterative, risk-driven cycles: define objectives/alternatives/constraints → evaluate alternatives/assess risk → develop (ending in IOC/FOC/FCA/PCA) → plan next cycle.
Q: Estimating advantage of Waterfall
A: Single confident fixed estimate at program start (scope fully known upfront).
Q: Estimating challenge of Spiral
A: Estimates must be revisited and refined at each iteration; no single fixed-price commitment early; hard to put on contract.
Q: Which lifecycle allows the most confident early estimate?
A: Waterfall (requirements and scope fully known before coding).
Q: Fig 12.8 source gap
A: CEBoK's incremental lifecycle chart (Fig 12.8) appears in the source only as a broken file placeholder, not a viewable figure.

## Techniques
Q: Analogy: definition
A: Compare new software to similar historical project with known cost; adjust for size, complexity, capability differences.
Q: Analogy mail-order example result
A: 406 total hours (224 setup + 80 data load + 85 implementation + 17 training) × \$100,000/yr ÷ 1,920 hrs/yr = \$21,145.
Q: Analogy: when most credible
A: When the analogous system is truly similar in domain, language, and environment.
Q: Parametric mail-order example (custom code)
A: 19,000 SLOC, A=2.94, E=1.0405 (adjusted for precedent), EM=0.38 (skilled team) → PM = 23.92 → \$382,643 at \$16,000/PM.
Q: Parametric mail-order schedule example
A: Tdev = 3.67 × 23.92^0.262 × 1.0 = 8.43 months (E=1 for this single small CSCI).
Q: Parametric: definition
A: Uses a CER calibrated to historical data, relating size and cost drivers to effort.
Q: Primary estimation techniques for software
A: Analogy and parametric. Use both as cross-checks.
Q: What does disagreement between analogy and parametric suggest?
A: Uncertainty in the estimate; investigate the difference before committing.
Q: CER "relevant range" caution
A: A CER built from data in one size range (e.g., 500-2000 FP) may not be valid outside that range (e.g., a 5000 FP estimate).
Q: Steps to develop a custom software CER
A: Careful variable selection, respect the relevant range, normalize the data set, test with scatter plots, then run regression (Module 8).

## Challenges
Q: System Definition challenge
A: Immature requirements at estimate time mean unknown scope; define a notional system with technical experts and independently verify COTS vendor claims.
Q: Sizing and Technology challenge
A: Early size estimates are uncertain; rapid tech change forces COTS re-integration and new-tool learning curves.
Q: Quality challenge: common metrics
A: Defect counts/density (per 100 FP or 1,000 SLOC), cohesion/coupling, requirements satisfaction %, test coverage, documentation adequacy, MTTD, McCabe cyclomatic complexity.
Q: McCabe's cyclomatic complexity
A: The number of linearly independent paths through a program module; a recognized software quality measure.
Q: COTS ~80% rule
A: If COTS can deliver about 80% of required functionality with little/no customization, buying is usually the better option than custom development.
Q: COTS challenge
A: No code visibility, hard to customize, integration complexity varies by architecture, beta-version risk, licensing/upgrade costs; still requires requirements, design, and test effort.
Q: Calibration challenge
A: Default parametric model values rarely fit; collect actual project data and calibrate; re-calibrate as practices/technology evolve.
Q: Growth and Demand challenge
A: Requirements growth is the documented norm (Capers Jones: <1% to 64%); labor-market swings (e.g., pre-Y2K COBOL demand) affect rates and available skill.
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
Q: Object points: pros and cons
A: Pro: user-interface-oriented, less subjective than SLOC. Con: not widely used, can't be counted until end of design, limited historical data.
Q: AIS (Automated Information Systems)
A: IT-heavy acquisition category, not hardware-intensive; estimates are largely software estimates; often cutting-edge/rapidly changing technology.
Q: ERP (Enterprise Resource Planning)
A: Business system on a single common database with modular design; estimating adds gap analysis, business process re-engineering, and COTS integration beyond custom-code estimation.
Q: Debated ERP cost drivers
A: Dollars spent on the ERP package and number of requirements are common candidates, but some experts argue human factors (user acceptance/resistance) matter more.

## Key Formulas
Q: Effort equation
A: $Effort = a \times Size^b \times EAF$
Q: COCOMO II effort equation
A: $PM = A \times Size^E \times \prod EM_i$, A = 2.94, Size in KSLOC.
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
Q: Growth-adjusted size
A: $Initial\ Size \times (1 + Growth\ Factor)$
`
});
