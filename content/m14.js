PCEA.addModule({
  id: 'm14', num: 14, title: 'Contract Pricing', short: 'Contract Pricing', source: 'guide',
  blurb: 'Contract types allocate cost risk; FPIF and CPIF use share ratios and PTA/RIE; proposals rest on a traceable BOE.',
  intro: String.raw`Contract pricing is the **negotiated agreement** on price and payment method between buyer and seller. It flows downstream of cost estimation (Modules 1–13): once an independent estimate exists, it becomes the basis for a **cost proposal** and **basis of estimate**, which are evaluated and negotiated into a contract with a specific **contract type** that allocates risk.

**Core principle:** the **contract type** (Firm Fixed Price, FPIF, CPIF, CPFF, etc.) determines how cost growth is shared and who bears the risk. The **proposal and BOE** document the rationale for the price. **Price and cost analysis** verify fairness.`,
  sections: [
    {
      id: 'overview', title: 'Basics of contract pricing', summary: 'Acquisition process, purpose, evaluation',
      body: String.raw`### The acquisition process

The path from need to contract award spans:

1. **Requirements** - government defines what it needs
2. **Acquisition planning** - strategy, contract type selection
3. **Solicitation** (RFP/RFQ) - request for proposals
4. **Proposal preparation** - contractor builds cost/price proposal with BOE
5. **Proposal evaluation** - government does technical, cost/price, and past-performance review
6. **Negotiation** - parties reach agreement
7. **Contract award** - terms and price become binding
8. **Administration** - performance tracking, especially critical for cost and incentive contracts

Cost estimators work **both sides**: contractors build proposals; government builds the **Independent Government Cost Estimate (IGCE)** and evaluates.

+++

### Purpose of contract pricing

Contract pricing exists to:

- Arrive at a **fair and reasonable price** for both parties
- **Allocate cost risk** based on how certain the requirements and costs are
- **Motivate** the contractor to control costs and meet schedule/performance
- Protect the government from unreasonable pricing when competition is absent

:::check
Q: What is the government's independent benchmark for evaluating a contractor's proposal?
* The Independent Government Cost Estimate (IGCE)
- The contractor's previous contract price
- The lowest bid received
> The IGCE is developed independently before proposals arrive, then used to evaluate, negotiate, and manage the contract.
:::

+++

### The pricing process in summary

**Contractor prepares:** cost proposal + BOE for each element, explaining how each number was derived.

**Government evaluates:** technical approach, cost/price analysis, comparison to IGCE and prior experience.

**Price/cost analysis** may be required: above the **Truthful Cost or Pricing Data (TINA) threshold** (\$2M under current FAR), certified cost or pricing data may be required unless an exception applies.

:::check
Q: Certified cost or pricing data is typically required above which threshold?
= 2000000 ±0
> \$2,000,000 under the Truthful Cost or Pricing Data Act (TINA) since 2018 (check your current threshold).
:::`
    },
    {
      id: 'types', title: 'Contract types and the risk spectrum', summary: 'FFP to CPFF: who bears cost risk',
      body: String.raw`FAR Part 16 defines a **spectrum of contract types**, differentiated by how cost risk is allocated. Contract type is the **primary mechanism** for managing risk.

### The contract type spectrum

| Type | Contractor Risk | Govt Risk | Fee/Profit | Use Case |
|---|---|---|---|---|
| **Firm Fixed Price (FFP)** | Highest | Lowest | Fixed; overruns reduce profit | Well-defined, low-uncertainty work |
| **Fixed Price Incentive (FPIF)** | High, shared | Low, shared | Share ratio + ceiling cap | Moderate uncertainty, incentive desired |
| **FP with Economic Price Adjustment (FP-EPA)** | Moderate (EPA carved out) | Moderate | Fixed, adjusted for specified indices | Long-term with material/labor volatility |
| **Cost Plus Incentive Fee (CPIF)** | Moderate | Moderate | Fee shares, capped min/max | Uncertain costs; incentive desired |
| **Cost Plus Award Fee (CPAF)** | Low | High | Base + subjective award fee | Hard-to-quantify performance factors |
| **Cost Plus Fixed Fee (CPFF)** | Low | High | Fixed dollar fee | High uncertainty (R&D, basic research) |
| **Time & Materials (T&M) / Labor Hour (LH)** | Low | High | Built-in labor rates + materials | Scope/duration can't be estimated |

**General rule:** as requirements/cost uncertainty increase, contract type moves **from fixed-price toward cost-reimbursement**, shifting risk from contractor to government. The contractor earns a **risk premium** (higher profit) for bearing more risk.

+++

### The share ratio (80/20 example)

Share ratios are written **Government/Contractor**, e.g., **70/30**:

- For each \$1 of **cost overrun** above target, the government pays \$0.70 and the contractor absorbs \$0.30 (profit falls by that amount)
- For each \$1 of **underrun** below target, the government pays \$0.70 less and the contractor gains \$0.30 in profit
- **This ratio is live** until a cap (ceiling in FPIF, min/max fee in CPIF) is hit

:::check
Q: A 75/25 share ratio means…
- The contractor pays 75% of overruns
* The government pays 75% of overruns; contractor pays 25%
- The contractor takes 75% of profit
> Share ratios are Government/Contractor. 75/25 means the govt absorbs 75% of each cost-growth dollar.
:::

+++

:::check
Q: Under FFP, who absorbs the cost of a \$2M overrun?
* The contractor (fully)
- The government
- Shared equally
> FFP price is fixed. Overruns come directly out of contractor profit.
:::`
    },
    {
      id: 'fpif', title: 'Fixed Price Incentive (FPIF)', summary: 'Target cost, share ratio, adjusted profit, PTA',
      body: String.raw`FPIF contracts set a **target cost (TC)**, **target profit (TP)**, a **ceiling price (CP)**, and a **share ratio**. Cost performance is shared via the ratio up to the ceiling; beyond the ceiling, the contractor absorbs 100% of further growth.

### FPIF elements

- **Target Cost (TC)**: the negotiated estimated cost
- **Target Profit (TP)**: the expected profit at target cost
- **Target Price (TPr)**: $TC + TP$ (the base deal price)
- **Ceiling Price (CP)**: the cap on total price the government pays
- **Share Ratio** (e.g., 70/30, written as Govt/Contractor)

### Adjusted profit formula

When actual cost differs from target, profit adjusts:

$$\text{Adjusted Profit} = TP + (\text{Contractor Share}) \times (TC - AC)$$

$$\text{Final Price} = AC + \text{Adjusted Profit}, \quad \text{capped at } CP$$

**Interpretation:**
- If $AC < TC$ (**underrun**): $(TC - AC) > 0$, so Adjusted Profit $>$ TP. Contractor is rewarded.
- If $AC > TC$ (**overrun**): $(TC - AC) < 0$, so Adjusted Profit $<$ TP. Contractor is penalized.

+++

### Point of Total Assumption (PTA)

The actual cost at which the **price reaches the ceiling**. Beyond the PTA, the contractor bears 100% of each additional cost dollar because the price is locked at the ceiling.

$$PTA = TC + \frac{CP - TPr}{\text{Government Share}}$$

**Key fact:** the denominator is the **Government's share**, not the contractor's.

:::widget fpif:::

+++

:::check
Q: TC = \$100M, TP = \$10M, CP = \$120M, share 70/30. Calculate PTA.
= 114.29 ±0.02
> PTA = 100 + (120 - 110) / 0.70 = 100 + 14.29 = \$114.29 million
:::

:::check
Q: Same contract, actual cost = \$90M. Adjusted profit?
= 13
> AP = 10 + 0.30 × (100 - 90) = 10 + 3 = \$13 million
:::

:::check
Q: Same contract, actual cost = \$115M (beyond PTA). Is the price capped at the ceiling?
- No, the share ratio still applies
* Yes, price is locked at \$120M
- Only if the contractor requests it
> Beyond PTA, price freezes at the ceiling (\$120M) and profit becomes squeezed or negative.
:::`
    },
    {
      id: 'cpif', title: 'Cost-Reimbursement Contracts', summary: 'CPFF, CPIF with RIE, CPAF',
      body: String.raw`Cost-reimbursement contracts reimburse the contractor's **allowable, allocable, reasonable costs** (per FAR Part 31) plus a **fee**. They require the contractor to have an adequate accounting system and are used when uncertainty is too high for fixed-price.

### CPFF (Cost Plus Fixed Fee)

- Contractor paid: **all allowable costs + a fixed fee in dollars** (set at award)
- Fee stays the same even if costs overrun, so **fee percentage falls** with overruns
- Provides **minimal cost-control incentive** - the contractor's fee profit is unaffected by performance
- Used for high-risk work (basic R&D, early development, one-of-a-kind) where objective incentive targets cannot yet be set

+++

### CPIF (Cost Plus Incentive Fee)

CPIF is the cost-reimbursement analog of FPIF: **fee** (not total price) varies with cost performance, bounded by a **minimum fee** and **maximum fee**, using a share ratio.

**Key terms:**

- **Target Cost (TC)**, **Target Fee (TF)**
- **Minimum Fee** and **Maximum Fee**: the fee floor and ceiling
- **Share Ratio** (Govt/Contractor), e.g., 75/25

**Adjusted Fee formula** (structurally identical to FPIF's adjusted profit):

$$\text{Adjusted Fee} = TF + (\text{Contractor Share}) \times (TC - AC)$$

$$\text{Final Fee} = \max(\text{Min Fee}, \min(\text{Max Fee}, \text{Adjusted Fee}))$$

**Total amount paid to contractor** = Actual Cost + Final Fee. *Unlike FPIF, there is **no ceiling on total reimbursement**, only on the fee*.

+++

### Range of Incentive Effectiveness (RIE)

The range of actual costs over which the **share ratio is actually operative** — i.e., where the fee changes with cost. Outside the RIE, the fee hits a cap (max or min) and no longer varies.

**Endpoints:**

$$AC_{\text{(Fee=Max)}} = TC - \frac{\text{Max Fee} - TF}{\text{Contractor Share}}$$

$$AC_{\text{(Fee=Min)}} = TC + \frac{TF - \text{Min Fee}}{\text{Contractor Share}}$$

Between these two actual costs, the share ratio is "live" and the contractor has cost-control incentive. Outside, the fee is pegged to its floor or ceiling.

:::widget cpif:::

+++

:::check
Q: CPIF: TC = \$100M, TF = \$8M, share 80/20, min fee = \$3M, max = \$12M. Actual cost = \$105M. Fee?
= 7
> AF = 8 + 0.20 × (100 - 105) = 8 - 1 = \$7 million (within [3, 12], so uncapped).
:::

:::check
Q: Same contract: at what actual cost does fee hit the minimum?
= 125
> AC (min) = 100 + (8 - 3) / 0.20 = 100 + 25 = \$125 million
:::

### CPAF (Cost Plus Award Fee)

- Contractor paid: **allowable costs + base fee (often 0–3%) + award fee**
- **Award fee** is determined **subjectively** by a government Award Fee Board based on performance against criteria in an Award Fee Plan
- Award fee is **not** appealable (unlike CPIF incentive fees, which are formula-driven and thus subject to disputes)
- Used where performance is difficult to quantify with objective metrics (quality, responsiveness, management effectiveness)

+++

:::check
Q: CPAF differs from CPIF in that the fee adjustment is…
- Calculated by a formula
* Determined subjectively by an award board
- Fixed in dollars
> CPIF uses a formula (share ratio); CPAF uses subjective evaluation and is not subject to contract dispute.
:::`
    },
    {
      id: 'proposal', title: 'Cost proposals and basis of estimate', summary: 'BOE content, methodology, cost elements, quality',
      body: String.raw`### Basis of Estimate (BOE)

The **BOE is the documented rationale** for every element of the cost proposal. It must allow an independent reviewer to understand, trace, and verify how each number was derived. A strong BOE is essential to surviving negotiation and cost/price analysis.

**BOE must document, for each element:**

- **What** is being estimated (scope, WBS element, deliverable)
- **How** it was estimated (methodology: build-up, CER/parametric, analogy, expert judgment)
- **Source data** (historical programs, vendor quotes, engineering data, their relevance)
- **Assumptions and exclusions** (what is and is not included)
- **Ground rules** (escalation, labor rates, overhead/G&A applied)
- **Risk treatment** (how uncertainty affects the estimate)

### Level of detail

BOE detail must be **proportional to** the element's dollar value and risk/uncertainty. High-value, high-risk elements warrant defensible, detailed support. Detail must also map to the WBS so that technical, schedule, and cost are traceable to each other.

+++

### Types of cost elements

Proposals break costs into:

- **Direct labor**: hours × rates by labor category
- **Direct material**: purchased parts, raw material, subcontracts
- **Other Direct Costs (ODCs)**: travel, equipment, consulting
- **Indirect costs**: overhead, G&A applied via established rates
- **Facilities Capital Cost of Money (FCCM)**
- **Profit/fee**: per the contract type (often developed with the **Weighted Guidelines** method in DoD)

### Three core BOE relationships

Most BOEs reduce to three recurring equations:

1. **Quantity Equation**: $\text{Total Qty} = \text{Qty per unit} \times \text{\# units}$
   (e.g., converting per-unit labor to total program labor)

2. **Rate/Cost Equation**: $\text{Cost} = \text{Quantity} \times \text{Rate}$ (plus material costs, burdens)
   (e.g., direct labor hours × loaded labor rate)

3. **Escalation Equation**: $\text{Then-Year} = \text{Base-Year} \times (1 + \text{Esc. Rate})^n$
   (e.g., constant-year cost inflated to budget-year dollars)

Every defensible line in a BOE traces back to: **quantity × rate = resource, resource × price = cost, cost (constant) × escalation = cost (then-year)**.

+++

:::check
Q: Which element typically requires the most detailed BOE support?
- Small purchases
- Administrative overhead
* High-dollar, high-risk elements
> Detail is proportional to dollar value and risk. Effort goes where it matters most.
:::

:::check
Q: A BOE says "Engineering labor: 8,000 hours per industry standards." What is the key weakness?
* It lacks traceability to historical data or adjustments for this specific program
- The hours are too high
- It should be in dollars, not hours
> Unsupported claims don't survive scrutiny. The BOE must show *how* the standard was applied *here*.
:::`
    },
    {
      id: 'analysis', title: 'Price and cost analysis', summary: 'Analysis methods, comparative process, realism, quality',
      body: String.raw`### Price analysis vs. cost analysis

The government evaluates proposals using one or both methods:

**Price Analysis:**
- Evaluate the **total price** without examining separate cost elements
- Used when **adequate price competition** exists (multiple competitive offers, comparable market/catalog prices)
- Compare to: competing proposals, prior prices for similar items, published market indices, or parametric models
- Faster and less intrusive than cost analysis

**Cost Analysis:**
- Evaluate the **individual cost elements** (labor hours, rates, material, overhead, G&A, profit)
- Required when **adequate competition does not exist** (sole-source, only one offer meets requirements)
- Also required when **certified cost or pricing data** is obtained (above TINA threshold)
- Verifies reasonableness, allocability, and allowability under FAR Part 31 cost principles

**Cost Realism** (for cost-type contracts):
- Is the proposed cost realistic for the work described?
- Government may adjust the proposed cost to a **most probable cost** for evaluation purposes (different from the contractor's stated price)

+++

### Comparative analysis process

Evaluation follows a structured path:

1. **Technical Understanding**: know the requirement, proposed approach, and any technical differences from the government's understanding
2. **BOE Review**: verify data, methodology, calculations, assumptions for consistency, accuracy, and compliance with FAR Part 31
3. **Independent Assessment**: the government's own estimate of each element (IGCE, should-cost model, DCAA audit findings)
4. **Comparative Analysis**: reconcile differences between proposal and independent assessment; identify negotiation issues
5. **Negotiation Objective**: develop a range (minimum, target, maximum position) for negotiation
6. **Negotiate and Award**: reach agreement, document in a Price Negotiation Memorandum (PNM)

+++

:::check
Q: Five competitive offers are within 5% of each other for a commercial-type component. Which evaluation method is usually sufficient?
* Price analysis only
- Full cost analysis of every element
- Cost realism review
> Adequate competition and market data support price analysis without detailed cost-element review.
:::

:::check
Q: Cost analysis is typically required when…
- You want to be thorough
- Certified cost or pricing data is obtained and adequate competition is absent
* Both of the above
- Neither; price analysis is always sufficient
> Cost analysis is mandatory absence adequate competition or when certified cost/pricing data is provided. Thoroughness alone is not the standard.
:::

+++

### Related topics: UCF, CAS, and PTA/RIE

**Uniform Contract Format (UCF):** FAR-prescribed organization of solicitations and contracts into labeled Sections A–K (or A–M):

| Section | Content |
|---|---|
| **A** | Solicitation/contract form |
| **B** | Supplies/services and prices |
| **C** | Description, specifications, statement of work (SOW) |
| **H** | Special requirements |
| **I** | Contract clauses |
| **L** | **Instructions to offerors** (how to prepare proposals) |
| **M** | **Evaluation factors for award** (how the government will judge proposals) |

**Cost Accounting Standards (CAS):** 19 standards governing measurement, assignment, and allocation of costs on government contracts, ensuring uniformity and consistency. Applicability triggered by contract value and prior CAS-covered work.

**PTA and RIE:** covered in Sections 3–4 above; see those sections for calculations.

:::check
Q: Where in the UCF do offerors learn how proposals will be evaluated?
- Section C
- Section L
* Section M
> Section L = instructions to prepare proposals. Section M = evaluation criteria (how the govt grades them).
:::`
    }
  ],
  cards: String.raw`
## Basics
Q: Goal of contract pricing
A: A price that is fair and reasonable, with a contract type balancing risk and motivating cost control.
Q: Acquisition process order
A: Requirements → planning → solicitation → proposals → evaluation → negotiation → award → administration.
Q: IGCE (Independent Government Cost Estimate)
A: The government's independently developed estimate used to evaluate proposals and set negotiation objectives.
Q: TINA threshold
A: Truthful Cost or Pricing Data Act threshold (e.g., \$2M since 2018); certified cost/pricing data required above it unless an exception applies.
Q: What does a BOE (Basis of Estimate) document?
A: How each proposal element was estimated: scope, method, source data, assumptions, calculations, and rationale.
Q: Three cost-estimating equations in a BOE
A: 1. Quantity = qty/unit × # units · 2. Cost = quantity × rate · 3. Then-year = base-year × (1 + esc. rate)^n

## Contract Types Spectrum
Q: Contract types from highest to lowest contractor risk
A: FFP → FPIF → FP-EPA → CPIF → CPAF → CPFF (T&M and LH also low contractor risk).
Q: FFP: who bears cost overruns?
A: The contractor, entirely; overruns reduce profit directly.
Q: Contract type when requirements are well-defined and costs certain
A: FFP (Firm Fixed Price).
Q: Contract type when cost is uncertain and incentive is desired
A: FPIF or CPIF (incentive types share cost risk via a share ratio).
Q: CPFF: does the fee change if costs overrun?
A: No; the dollar fee is fixed (though fee as a % falls with overruns).
Q: When is CPFF appropriate?
A: High uncertainty (basic R&D, early development) where objective incentive targets cannot be set.
Q: Share ratio meaning (e.g., 70/30)
A: Written as Govt/Contractor: the govt absorbs 70% of each cost-growth dollar; contractor absorbs 30%.
Q: What does a share ratio apply to?
A: Cost performance **between the target cost and a cap** (ceiling in FPIF, min/max fee in CPIF).
Q: FP with Economic Price Adjustment (FP-EPA)
A: Fixed price that adjusts for specified market factors (e.g., material/labor indices) over a long contract.
Q: T&M and LH contracts
A: Time & Materials and Labor Hour; contractor bills fixed labor rates times actual hours + materials. Low cost-control incentive; used when scope cannot be estimated.

## FPIF
Q: FPIF elements
A: Target Cost (TC), Target Profit (TP), Target Price (TPr = TC + TP), Share Ratio, Ceiling Price (CP).
Q: FPIF adjusted profit formula
A: Profit = TP + (contractor share) × (TC − AC); price = AC + profit, capped at CP.
Q: Underrun effect on FPIF profit
A: If AC < TC, the contractor share of the savings increases profit above target (contractor rewarded).
Q: Overrun effect on FPIF profit
A: If AC > TC, the contractor share of the overrun decreases profit below target (contractor penalized).
Q: Point of Total Assumption (PTA) definition
A: The actual cost at which the FPIF price reaches the ceiling; beyond it the contractor absorbs 100% of further cost.
Q: PTA formula
A: PTA = TC + (CP − TPr) / Government Share
Q: Why PTA denominator uses Government Share
A: The government's share represents how much of each cost-growth dollar the govt continues to pay before ceiling is reached; once that's exhausted the contractor pays all.
Q: FPIF: TC = 100, TP = 10, CP = 120, share 70/30. PTA?
A: 100 + (120 − 110)/0.70 = 114.29
Q: FPIF: TC 100, TP 10, AC 90, share 70/30. Profit?
A: 10 + 0.30 × (100 − 90) = 13
Q: FPIF: TC 100, TP 10, AC 120, CP 120, 70/30. Price and profit?
A: Price = 120 (capped); profit = 0 (a loss).
Q: No ceiling price on FPIF
A: False; FPIF always has a ceiling price, which is the cap on total govt payment.

## CPIF
Q: CPIF elements
A: Target Cost (TC), Target Fee (TF), Minimum Fee, Maximum Fee, Share Ratio (Govt/Contractor).
Q: CPIF adjusted fee formula
A: Fee = TF + (contractor share) × (TC − AC), bounded by [min fee, max fee].
Q: Total payment in CPIF
A: Actual Cost + Final Fee. Unlike FPIF, there is **no ceiling on total reimbursement**, only on the fee.
Q: Range of Incentive Effectiveness (RIE)
A: The range of actual costs over which the share ratio is "live" (fee varies with cost between min and max).
Q: RIE low endpoint (cost at max fee)
A: AC = TC − (Max Fee − TF) / Contractor Share
Q: RIE high endpoint (cost at min fee)
A: AC = TC + (TF − Min Fee) / Contractor Share
Q: Cost below RIE low endpoint
A: Fee is capped at max fee; no further incentive for underrun.
Q: Cost above RIE high endpoint
A: Fee is capped at min fee; contractor has no cost-control incentive (negative).
Q: CPIF: TC 100, TF 8, share 80/20, min 3, max 12. AC 105. Fee?
A: 8 + 0.20 × (100 − 105) = 7
Q: CPIF: same. RIE high endpoint (cost at min fee)?
A: 100 + (8 − 3) / 0.20 = 125
Q: CPIF: same. RIE low endpoint (cost at max fee)?
A: 100 − (12 − 8) / 0.20 = 80

## CPAF & Other
Q: CPAF (Cost Plus Award Fee)
A: Cost + base fee (often 0–3%) + award fee earned via subjective evaluation by an Award Fee Board.
Q: Award fee in CPAF
A: Determined subjectively by the government based on performance against evaluation criteria; not subject to contract dispute like CPIF incentive fees.
Q: When is CPAF used?
A: When performance is hard to quantify objectively (e.g., quality, responsiveness, management).
Q: Indefinite Delivery/Indefinite Quantity (IDIQ)
A: A contract vehicle for an unknown quantity of supplies/services over a period; actual work ordered via task/delivery orders with their own contract types.

## BOE & Proposal
Q: BOE content (what must it show)?
A: What is estimated; how (methodology); source data and relevance; assumptions & exclusions; ground rules; how risk was treated.
Q: Good BOE characteristics
A: Traceable to SOW/WBS; based on historical data; clearly calculated; consistent with technical and schedule baselines; explicit about adjustments.
Q: When to apply more BOE detail
A: High-dollar, high-risk elements warrant more detailed, defensible support.
Q: Direct labor vs. ODCs vs. overhead
A: Direct labor = hours × rates by category · ODCs = travel, equipment, consultants · Overhead = allocated cost burden.
Q: Weighted Guidelines
A: The structured DoD method for developing profit/fee objectives on defense contracts.

## Analysis & Evaluation
Q: Price analysis definition
A: Evaluate the total price (not individual cost elements) by comparing to competition, market prices, priors, or IGCE; sufficient when adequate competition exists.
Q: Cost analysis definition
A: Evaluate individual cost elements (hours, rates, material, overhead, profit) for reasonableness and allowability; required when adequate competition is absent.
Q: Cost realism (cost-type contracts)
A: Government assesses whether proposed costs are realistic for the work; may adjust to most probable cost for evaluation.
Q: When is price analysis sufficient?
A: When adequate price competition exists (multiple comparable offers, market data).
Q: When is cost analysis required?
A: When adequate competition is absent or certified cost/pricing data is obtained.
Q: Comparative analysis steps
A: 1 Technical understanding · 2 BOE review · 3 Independent assessment (IGCE) · 4 Comparative analysis (reconcile differences) · 5 Negotiation objective · 6 Negotiate & award.
Q: Price Negotiation Memorandum (PNM)
A: Government documentation of the negotiation outcome (agreed price, rationale, key issues resolved).
Q: Estimate quality
A: Accurate, complete, traceable, consistent with technical/schedule baselines.
Q: Estimate validity
A: Data is current and relevant; assumptions match actual contract terms and schedule; updated as program evolves.

## Uniform Contract Format & Standards
Q: UCF Section L
A: Instructions to Offerors (how to prepare and submit proposals).
Q: UCF Section M
A: Evaluation Factors for Award (criteria by which govt evaluates proposals).
Q: UCF Section B and C
A: B = Supplies/Services and Prices. C = Description, Specifications, Statement of Work (SOW).
Q: Uniform Contract Format sections
A: A (form) · B (supplies/services/prices) · C (SOW/specs) · H (special requirements) · I (clauses) · L (instructions) · M (evaluation).
Q: Cost Accounting Standards (CAS)
A: 19 standards for consistent measurement, assignment, and allocation of costs on covered government contracts.
Q: CAS applicability
A: Triggered by contract value and prior history of CAS-covered contracts; full vs. modified coverage depends on business volume.
`
});
