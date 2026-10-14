PCEA.addModule({
  id: 'm14', num: 14, title: 'Contract Pricing', short: 'Contract Pricing', source: 'guide',
  blurb: 'Contract types allocate cost risk; FPIF and CPIF use share ratios and PTA/RIE; proposals rest on a traceable BOE.',
  intro: String.raw`Contract pricing is the **negotiated agreement** on price and payment method between buyer and seller. It flows downstream of cost estimation (Modules 1-13): once an independent estimate exists, it becomes the basis for a **cost proposal** and **basis of estimate**, which are evaluated and negotiated into a contract with a specific **contract type** that allocates risk.

**Core principle:** the **contract type** (Firm Fixed Price, FPIF, CPIF, CPFF, etc.) determines how cost growth is shared and who bears the risk, via a **shareline** - a piecewise-linear function that changes slope at one or more points. The **proposal and BOE** document the rationale for the price. **Price and cost analysis** verify fairness.`,
  sections: [
    {
      id: 'overview', title: 'Basics of contract pricing', summary: 'Acquisition process, purpose, evaluation',
      body: String.raw`:::primer:::
Buying a system is not one step. The government and contractor pass through a fixed chain from need to award.

:::order
Q: Put these stages in the order they happen.
1. Requirements
2. Solicitation (RFP/RFQ)
3. Proposal preparation
4. Proposal evaluation
5. Negotiation
6. Contract award
> The government defines requirements, issues the solicitation, the contractor prepares a proposal, the government evaluates it, the parties negotiate, and then the contract is awarded.
:::

+++

### The acquisition process

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

{{primer}}

+++

### Purpose of contract pricing

Contract pricing exists to establish a **fair and reasonable price** for the effort:

- **Contractor**: defensible BOEs and approved rates support the price
- **Government**: cost analysis supports releasing RFPs and evaluating proposals

Three questions drive the process: What is the potential cost for a system meeting the requirements? What is the cost of the contractor's proposed solution? What are the differences between the two estimates? The IGCE answers the first; the proposal answers the second; cost/price analysis answers the third.

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

:::tip Beyond CEBoK
Above a dollar threshold set by the Truth in Negotiations Act (TINA), now codified as Truthful Cost or Pricing Data (TCPD), certified cost or pricing data may be required unless an exception applies (e.g., adequate price competition). CEBoK does not test the specific FAR dollar threshold or TINA by name - know that *some* dollar threshold exists and drives whether cost analysis (vs. price analysis alone) is required; the current number is not exam content.
:::`
    },
    {
      id: 'types', title: 'Contract types and the risk spectrum', summary: 'FFP to CPFF: fee/profit/margin, share ratios, the risk spectrum',
      body: String.raw`:::primer:::
Every contract type is a bet on who eats a cost surprise. First, which family does each type belong to?

:::sort
Q: Is each contract type fixed-price or cost-reimbursement?
buckets: Fixed-price | Cost-reimbursement
- Firm Fixed Price (FFP) = Fixed-price
- Fixed Price Incentive (FPIF) = Fixed-price
- Cost Plus Fixed Fee (CPFF) = Cost-reimbursement
- Cost Plus Incentive Fee (CPIF) = Cost-reimbursement
- Cost Plus Award Fee (CPAF) = Cost-reimbursement
> Fixed-price contracts set price first and subtract cost to get profit. Cost-reimbursement contracts reimburse allowable cost and add a determined fee to get price.
:::

+++

Contracting rests on **commensurate risk and reward**: the more difficult and riskier the work, the greater the expected profit, tempered by more uncertainty in the outcome. FAR Part 16 defines a **spectrum of contract types**, differentiated by how cost risk is allocated. Contract type is the **primary mechanism** for managing that risk.

The two broad categories are **fixed-price** contracts (price is determined first, then cost is subtracted, resulting in profit - which may be negative) and **cost-reimbursement** contracts (the government reimburses total allowable cost, to which a determined fee is added to result in price).

### Fee, profit, and margin

- **Fee**, a.k.a. **Return On Cost (ROC)**, is the amount paid to the contractor over and above cost, in dollars or as a percent of cost. In contracting, fee is synonymous with the contractor's profit (assuming no ceiling is breached).
- **Margin**, a.k.a. **Return on Sales (ROS)** or **revenue**, is that same profit expressed as a percent of cost **and** profit together (i.e., price).

$$\text{Revenue} = \text{Cost} + \text{Profit} = \text{Price}$$
$$\text{Margin \%} = \frac{\text{Fee \%}}{1 + \text{Fee \%}} \qquad \text{Fee \%} = \frac{\text{Margin \%}}{1 - \text{Margin \%}}$$

**Base case** (CEBoK Fig. 14.5, used throughout this module): Target Cost (TC) = \$10M, Target Profit (TP) = \$1M, so Price = \$11M and revenue at TC = 9.09% (\$1M / \$11M).

+++

### The contract type spectrum

| Type | Contractor Risk | Govt Risk | Fee/Profit | Use Case |
|---|---|---|---|---|
| **Firm Fixed Price (FFP)** | Highest | Lowest | Fixed price; a 0/100 shareline - overruns come directly out of profit | Well-defined, low-uncertainty work |
| **Fixed Price Incentive (FPIF / successive targets)** | High, shared | Low, shared | Share ratio + ceiling cap | Moderate uncertainty, incentive desired |
| **FP with Economic Price Adjustment (FP-EPA)** | Moderate (EPA carved out) | Moderate | Fixed, adjusted for specified prices/costs/indices | Long-term with material/labor volatility |
| **Fixed Price Level of Effort (FP LOE)** | Low-moderate | Moderate | Fixed labor rates; govt dictates hours | Effort not suited to a completion-type contract |
| **Fixed Price Award Fee (FPAF)** | High (base is fixed price) | Low | Fixed price + subjective award fee on top | Qualitative performance can't be objectively measured |
| **Cost Plus Incentive Fee (CPIF)** | Moderate | Moderate | Fee shares, capped min/max | Uncertain costs; incentive desired |
| **Cost Plus Award Fee (CPAF)** | Low | High | Base fee + subjective award fee | Hard-to-quantify performance factors |
| **Cost Plus Fixed Fee (CPFF)** | Low | High | Fixed dollar fee; essentially a 100/0 shareline | High uncertainty (R&D, basic research) |
| **Time & Materials (T&M) / Labor Hour (LH)** | Low | High | Built-in labor rates + materials; no cost-control incentive | Scope/duration can't be estimated |

**General rule:** as requirements/cost uncertainty increase, contract type moves **from fixed-price toward cost-reimbursement**, shifting risk from contractor to government. The contractor earns a **risk premium** (higher profit) for bearing more risk.

{{primer}}

+++

### Other contract vehicles

- **FPI Successive Targets**: specifies a target cost, target profit, shareline(s), a *production point* at which firm targets will later be negotiated, and a ceiling price. Becomes an FFP or FPIF contract once that point is reached. Used when cost/pricing data is insufficient to set a firm target cost before award but will exist afterward.
- **Indefinite delivery contracts** (used when exact quantities/timing of future deliveries are unknown): **definite quantity** (a set amount for a fixed period), **requirements** (fills all actual needs of designated activities during a period, with min/max quantities), and **Indefinite Delivery/Indefinite Quantity (IDIQ)** (a flexible number within stated limits). Work is issued via **delivery orders** (supplies) or **task orders** (performance of tasks); FFP task orders are common.
- **Letter contracts**: preliminary written instruments authorizing immediate work when a binding commitment is needed and there isn't time to negotiate a definitive contract first. The authorized amount **must not exceed 50% of the estimated cost of the definitive contract**.

### The share ratio

Written **Government/Contractor**, e.g., **80/20**: for each dollar of cost overrun above target, the government pays 80 cents and the contractor absorbs 20 cents (profit falls by that amount); for each dollar of underrun, the contractor gains 20 cents in profit while the government saves 80 cents. The government's share is listed first and is usually the larger of the two. **This ratio is live** until a cap (ceiling in FPIF, min/max fee in CPIF) is hit.

**Choosing a share ratio**: a more conservative ratio (e.g., **90/10**) is appropriate for high-risk programs; a more aggressive ratio (e.g., **50/50**) gives the contractor maximum incentive to control cost. A contract can use **multiple share ratios** - one for underruns, a different one for overruns.

:::check
Q: A 75/25 share ratio means...
- The contractor pays 75% of overruns
* The government pays 75% of overruns; contractor pays 25%
- The contractor takes 75% of profit
> Share ratios are Government/Contractor. 75/25 means the govt absorbs 75% of each cost-growth dollar.
:::

+++

:::check
Q: Under FFP, who absorbs the cost of a \$2M overrun?
* The contractor (fully) - FFP is essentially a 0/100 shareline
- The government
- Shared equally
> FFP price is fixed. Overruns come directly out of contractor profit, and savings go straight to profit.
:::

:::check
Q: A program is high-risk with much technical uncertainty. Which share ratio best reflects sound incentive design?
* A conservative ratio such as 90/10
- An aggressive ratio such as 50/50
- No share ratio; use FFP instead
> High risk calls for a conservative (govt-heavy) share ratio; an aggressive ratio like 50/50 is used to maximize contractor incentive on lower-risk work.
:::

:::check
Q: CPFF is best described, in shareline terms, as approximately...
- A 0/100 shareline
* A 100/0 shareline
- A 50/50 shareline
> The government pays essentially all costs; the fixed fee doesn't change with cost performance, so it behaves like a 100/0 (govt/contractor) share.
:::`
    },
    {
      id: 'fpif', title: 'Fixed Price Incentive (FPIF)', summary: 'Target cost, share ratio, adjusted profit, PTA, worked example',
      body: String.raw`:::primer:::
Take the section's \$90M FPIF example, with target profit of \$9M. Overrun or underrun, how does the contractor fare against that target?

:::sort
Q: Is adjusted profit above or below the \$9M target at each final cost (target cost \$90M)?
buckets: Above target profit | Below target profit
- Final cost of \$85M = Above target profit
- Final cost of \$97M = Below target profit
- Final cost of \$105M = Below target profit
> An underrun lifts profit above target. An overrun cuts it below target, and even once price is capped at the ceiling the contractor still earns less than the \$9M target.
:::

+++

FPIF contracts set a **target cost (TC)**, **target profit (TP)**, a **ceiling price (CP)**, and a **share ratio**. Cost performance is shared via the ratio up to the ceiling; beyond the ceiling, the contractor absorbs 100% of further growth (the contract effectively becomes FFP at that point).

### FPIF elements

- **Target Cost (TC)**: the negotiated estimated cost
- **Target Profit (TP)**: the expected profit at target cost (often first expressed as a percent of TC)
- **Target Price (TPr)**: $TC + TP$ (the base deal price)
- **Ceiling Price (CP)**: the cap on total price the government pays
- **Share Ratio** (Govt/Contractor, e.g., 70/30)

### Adjusted profit formula

$$AP = TP + S(TC - FC)$$

where $S$ is the contractor's share and $FC$ is final cost. Equivalently, from the government's side:

$$FP = TP + GS \times (FC - TC) + TC = FC + AP$$

...true as long as the result doesn't exceed the ceiling; if it does, final price is capped at the ceiling.

**Interpretation:**
- If $FC < TC$ (**underrun**): profit is above target. Contractor is rewarded.
- If $FC > TC$ (**overrun**): profit is below target. Contractor is penalized.

+++

### Point of Total Assumption (PTA)

The actual cost at which the **price reaches the ceiling**. Beyond the PTA, the contractor bears 100% of each additional cost dollar because the price is locked at the ceiling.

$$PTA = TC + \frac{CP - TPr}{\text{Government Share}}$$

**Key fact:** the denominator is the **Government's share**, not the contractor's - the gap between target price and ceiling is closed at the government's cents-on-the-dollar rate.

:::widget fpif:::

:::challenge fpif tc=100 tp=10 cp=120 gs=0.7 ac=100 lock=tc,tp,cp,gs
Q: Slide actual cost to the **Point of Total Assumption**, the cost beyond which the contractor pays for every extra dollar.
goal: ac ~ 114.29 +- 1
show: ac=114
> $PTA = (\text{ceiling} - \text{target price}) / \text{gov share} + TC = (120 - 110) / 0.7 + 100 = 114.29$. Past this point the price is capped at the ceiling, so each extra dollar of cost comes out of profit.
:::

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
:::

+++

### CEBoK's worked example (\$90M FPIF)

All three scenarios share: TC = \$90M, TP = "10%" of TC = \$9M (so target price TPr = \$99M), ceiling price CP = \$108M, share ratio 80/20 for underruns and 70/30 for overruns (CEBoK's figures use these ratios without always stating them in prose). PTA works out to \$102.86M.

:::widget fpif-scenarios:::

**Scenario 1 - underrun, FC = \$85M** (below TC): reward. Using $FP = TP + GS(FC - TC) + TC$: $99 + 0.80(85 - 90) = \$95M$. Adjusted profit = final price − final cost = 95 − 85 = **\$10M** (up from the \$9M target). The extra \$1M of contractor profit plus the government's \$4M savings (\$99M − \$95M) together account for the full \$5M underrun.

**Scenario 2 - overrun, FC = \$97M** (above TC, below PTA), 70/30 share: adjusted profit = \$9M − 0.30 × \$7M = \$9M − \$2.1M = **\$6.9M**. The contractor still covers its costs but earns less than target.

**Scenario 3 - overrun beyond PTA, FC = \$105M** (PTA = \$102.86M): price is capped at the ceiling, \$108M. $AP = FP - FC = 108 - 105 = \$3M$ (equivalently, $AP = TP + S(TC - PTA) - (FC - PTA) = 9 + 0.30(90 - 102.86) - (105 - 102.86) = 9 - 3.86 - 2.14 = \$3M$).

{{primer}}

:::note Source note
CEBoK's text renders the target profit as "\$10%" (a typo for "10%," i.e., \$9M) in this example. The scenario share ratios (80/20 underrun, 70/30 overrun) are used in the figure's math but are not spelled out in the surrounding prose - treat the numbers above, not the prose, as authoritative.
:::

:::check
Q: In the \$90M FPIF example, Scenario 1 (FC = \$85M, TC = \$90M, TP = \$9M, 80/20 underrun share): adjusted profit?
= 10 ±0.1
> AP = TP + S(TC-FC): 9 + 0.20(5) = 10; via FP = 99 + 0.80(85-90) = 95; AP = FP - FC = 95 - 85 = \$10M.
:::

:::check
Q: Same example, Scenario 2 (FC = \$97M, 70/30 overrun share): adjusted profit?
= 6.9 ±0.1
> AP = 9 - 0.30(97-90) = 9 - 2.1 = \$6.9M.
:::

:::check
Q: Same example, Scenario 3 (FC = \$105M, PTA = \$102.86M, ceiling = \$108M): final price and adjusted profit?
* Price = \$108M (ceiling); profit = about \$3M
- Price = \$105M; profit = \$9M
- Price = ceiling; profit is negative (a loss)
> Past PTA, price is capped at the \$108M ceiling. AP = FP - FC = 108 - 105 = \$3M - still a profit, just a squeezed one.
:::`
    },
    {
      id: 'cpif', title: 'Cost-Reimbursement and Other Incentive Contracts', summary: 'CPFF, CPIF with RIE, CPAF, worked examples',
      body: String.raw`:::primer:::
FPIF and CPIF both share cost growth through a ratio, yet they end differently when costs run far off target.

:::sort
Q: Which contract type does each description fit?
buckets: FPIF | CPIF
- Has a ceiling price on total payment = FPIF
- Has a minimum fee and a maximum fee = CPIF
- Price is set first, then cost is subtracted to get profit = FPIF
- Contractor is reimbursed allowable cost plus a fee = CPIF
> FPIF caps total price at the ceiling. CPIF reimburses allowable cost plus a fee that is bounded by a minimum and maximum.
:::

+++

Cost-reimbursement contracts reimburse the contractor's **allowable, allocable, reasonable costs** (per FAR Part 31) plus a **fee**. They require an adequate contractor accounting system plus government surveillance, and are used when uncertainty is too high for fixed-price.

### CPFF (Cost Plus Fixed Fee)

- Contractor paid: **all allowable costs + a fixed fee in dollars** (set at award; a function of TC at negotiation, e.g., 10% of cost)
- Fee stays the same even if costs overrun, so **fee percentage falls** with overruns; it does not vary with actual cost, though it may be adjusted if the *scope* of work changes
- Government covers all costs regardless of overrun - essentially a **100/0 shareline**
- **Minimal cost-control incentive** for the contractor - though a *goodwill* risk exists: chronic overruns erode the relationship and can cost the contractor future business
- Used for high-risk work (basic R&D, early development, one-of-a-kind) when CPIF is not practical and objective incentive targets cannot yet be set
- **Fee limits** (FAR 15.404-4): **R&D 15%**, **Production & Services (non-R&D) 10%**, **Architecture/Engineering 6%**. A fixed fee is a **fixed dollar amount** - the FAR specifically **prohibits a fixed-percentage fee**.
- At target cost, revenue (ROS) is the same 9.09% as the FFP base case (\$1M fee / \$11M price); as the contractor overruns, price rises dollar-for-dollar with cost but revenue *declines* (fixed fee over a growing price)

+++

### CPIF (Cost Plus Incentive Fee)

CPIF is the cost-reimbursement analog of FPI: **fee** (not total price) varies with cost performance, bounded by a **minimum fee** and **maximum fee**, using a share ratio. Unlike FPIF, once actual cost moves outside the fee-adjustment range, the contractor is simply paid actual cost plus the min or max fee - **there is no price ceiling** on total reimbursement.

**Key terms:** Target Cost (TC), Target Fee (TF), Minimum Fee, Maximum Fee, Share Ratio (Govt/Contractor).

$$\text{Adjusted Fee} = TF + (\text{Contractor Share}) \times (TC - AC), \quad \text{bounded by } [\text{Min Fee}, \text{Max Fee}]$$

**Total amount paid to contractor** = Actual Cost + Final Fee.

**CEBoK's illustration (Fig. 14.10, using the \$10M TC base case):** under-TC shareline 40/60, over-TC contractor shareline 70/30, minimum fee \$0.3M (3% of TC), maximum fee \$2.0M (20% of TC). Outside the fee's min/max, the contract behaves like CPFF - the fee is pegged and no longer incentivizes cost control.

+++

### Range of Incentive Effectiveness (RIE)

The range of actual costs over which the share ratio is **live** (the fee actually changes with cost). CEBoK's RIE formulas use **asymmetric contractor shares** for over- and under-runs:

$$RIE_{high} = \frac{TF - mF}{CS_{over}} + TC \qquad RIE_{low} = TC - \frac{MF - TF}{CS_{under}}$$

where $mF$/$MF$ are the min/max fee, and $CS_{over}$/$CS_{under}$ are the contractor's shares of an overrun/underrun respectively (note: CEBoK's own text labels both share terms "overrun" - a source typo; treat one as the underrun share as the subscripts indicate).

**Worked example**: TC = \$90M, mF = \$1M, MF = \$10M, TF = \$9M, share 70/30 (used for both sides here). $RIE_{high} = (9-1)/0.30 + 90 = \$116.67M$; $RIE_{low} = 90 - (10-9)/0.30 = \$86.67M$. The \$8M gap between TF and mF is closed at 30 cents on the dollar over a \$26.67M range above TC; the \$1M gap between TF and MF closes over a \$3.33M range below TC.

{{primer}}

:::widget cpif:::

:::challenge cpif ac=130
Q: Actual cost comes in at 130, with a target cost of 100, a target fee of 8, a fee range of 3 to 12, and an 80/20 share. What happens to the fee?
* It stops at the minimum fee of 3, and the government pays the rest of the overrun
- It keeps falling 20 cents per dollar and turns negative
- It stays at the target fee of 8
> The RIE here runs from 80 to 125. Past 125, the fee sits at its floor of 3, and a CPIF contract still reimburses allowable cost. That's the key difference from FPIF, where cost above the PTA comes out of the contractor's profit.
:::

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

:::check
Q: CPFF fee limit for R&D work, per FAR 15.404-4?
= 15 ±0
> 15% - the highest of the three FAR fee caps (Production/Services 10%, A&E 6%).
:::

:::check
Q: Can a CPFF fee be structured as a fixed percentage of actual (not target) cost?
- Yes, that is the standard approach
* No; the FAR specifically prohibits a fixed-percentage fee - the fee must be a fixed dollar amount
> A fixed fee is a dollar amount set at negotiation; only the resulting fee *percentage* changes (falls) as costs move.
:::

### CPAF (Cost Plus Award Fee)

- Contractor paid: **allowable costs + base fee + award fee**, where award fee is determined **subjectively** by a government Award Fee Board incentivizing cost, schedule, and technical performance, evaluated on a percent scale against criteria in an Award Fee Plan
- Chosen when uncertainty makes it hard to forecast costs *and* performance is hard to measure with objective, formula-driven metrics
- The ceiling here is a **cost ceiling** (not a price ceiling as in FPIF): the government covers costs up to that ceiling, no more

**CEBoK's CPAF worked example**: TC = \$90M, potential award fee (TP) = 10% = \$9M, cost ceiling = \$108M. The same \$8.2M award fee is carried through all three scenarios for consistency.

:::widget cpaf-scenarios:::

- **Scenario 1, FC = \$85M**: price = FC + fee = 85 + 8.2 = **\$93.2M**. Cost was controlled but schedule/technical performance evaluation held the earned fee below the \$9M potential (\$0.8M unearned, sometimes reassessable later).
- **Scenario 2, FC = \$102M** (source text says "\$7M more than target," though \$102M − \$90M is actually \$12M more): price = 102 + 8.2 = **\$110.2M**. Cost/schedule/technical incentive was unsuccessful; award fee would likely be reduced in practice, but CEBoK holds it at \$8.2M for consistency across scenarios.
- **Scenario 3, FC = \$115M**, which **exceeds the \$108M cost ceiling**: the government pays only up to the ceiling, so price = ceiling + fee = 108 + 8.2 = **\$116.2M**. Contractor profit is reduced by \$7M (the overrun above the ceiling that the government does not cover) to only **\$1.2M**.

:::note Source figure discrepancy
Figure 14.9's box for Scenario 3 shows \$115M + \$8.2M = \$123.2M, but the text's own math (price capped at the \$108M ceiling) supersedes the figure - cost above the ceiling requires written government authorization and is otherwise the contractor's loss.
:::

+++

:::check
Q: CPAF differs from CPIF in that the fee adjustment is...
- Calculated by a formula
* Determined subjectively by an award board
- Fixed in dollars
> CPIF uses a formula (share ratio); CPAF uses subjective evaluation against an Award Fee Plan.
:::

:::check
Q: In CEBoK's CPAF example (TC \$90M, cost ceiling \$108M, award fee \$8.2M in every scenario), Scenario 3 has FC = \$115M. Final price and profit?
* Price = \$116.2M (ceiling + fee); profit reduced to \$1.2M
- Price = \$123.2M (final cost + fee)
- Price = \$115M (final cost only, no fee)
> The government only covers cost up to the \$108M ceiling: price = 108 + 8.2 = \$116.2M. Profit falls by the \$7M uncovered overrun, down to \$1.2M.
:::

:::check
Q: The "ceiling" in a CPAF contract is a...
- Price ceiling, same as FPIF
* Cost ceiling - the government covers allowable cost only up to this limit
- Fee ceiling
> Unlike FPIF's price ceiling, CPAF (like other cost-reimbursement types) is bounded by a cost ceiling.
:::`
    },
    {
      id: 'proposal', title: 'Cost proposals and basis of estimate', summary: 'BOE content, three equations, cost elements, methodology, quality',
      body: String.raw`:::primer:::
A proposal's basis of estimate leans on one of three equation shapes. Each has its own signature inputs.

:::sort
Q: Which BOE equation does each description fit?
buckets: Analogy equation | Related (indirect) cost equation | Build-up equation
- Starts from the actual cost of a successful analogy program = Analogy equation
- F is the ratio of the estimated system's parameter to the analogy's parameter = Analogy equation
- F is a historically demonstrated fraction applied to an estimated direct cost = Related (indirect) cost equation
- Covers items like program management, test, or design hours = Related (indirect) cost equation
- Multiplies a historical rate such as MH/ft or \$/trip by a measured or design parameter = Build-up equation
> Analogy is E = A x F with F = Pe/Pa. Related cost is E = F x C with F = Ci/Cd. Build-up is E = R x P, a historical rate times a measured or design parameter.
:::

+++

### Basis of Estimate (BOE)

The **BOE is the documented rationale** for every element of the cost proposal, containing a description of the work (WBS, cost type, schedule, activity), the estimating methodology, and all planned resources. It must allow an independent reviewer to understand, trace, and verify - and *replicate* - how each number was derived. BOE quality cannot exceed the quality of the underlying cost estimate.

**BOE content - the 5W+H:**

- **Who** performed the work? (prime vs. subcontractor; combining organizations into one BOE affects rates, overhead, standard hours/FTE - do it carefully)
- **What** tasks were performed? (which tasks the estimate accounts for)
- **Where** did the work take place? (facility/location drives rates, facility costs, travel)
- **When** did the work take place? (fiscal year affects escalation and funding profiles)
- **Why** was this data used? (justify the source)
- **How** was the data normalized or adjusted for similarities and differences? (needed for traceability)

Reference the RFP's Section L (Instructions to Offerors) for page-count and inclusion rules.

### Level of detail

BOE detail must be **proportional to** the element's dollar value and risk/uncertainty. Driving to a lower level of detail can seem more credible but the data to support it is often unavailable - strike the right balance and obey the RFP.

+++

### Types of cost elements

Some BOE authors default to analogies even for Other Direct Costs (ODCs), which raises three distinct kinds of estimating risk:

- **Scaled-by-a-driver**: cost scaled by a factor, rate, or CER (e.g., help-desk staffing as a function of user count). Risk is principally in the **scaling factor**, a judgment-driven stand-in for a CER.
- **M-to-N**: driven by a countable parameter, e.g., one laptop/email account per FTE, one car per three travelers (common in ODCs). Risk is usually in the **N** (the count of FTEs or trips), not the **M** (items per FTE/trip); the N is often justified elsewhere but may fall to the BOE author.
- **Fixed**: pieces easily justified once established as fixed - but this can be over-relied on; a fighter or ship's crew size, for instance, is *not* fixed and varies by project type.

### Estimating Methodologies

Proposal BOEs use the estimating methods from earlier modules: **analogy, parametric (CER), and engineering (build-up)** are the three essential methods (Module 2); a fourth, **standard cost models**, refers to commercial cost models. Other methods (less preferred): **company standard bidding systems** (may need contracting-entity certification), **expert opinion**, and **commercial/catalog/market price**. Use anything else only in the most unusual circumstances.

### The Three Equations of the Basis of Estimate

- **Analogy Equation**: $E = A \times F$, where $F = P_e / P_a$. $E$ is the estimate, $A$ is the analogy's actual cost, $P_e$/$P_a$ are the parameter values for the estimated/analogy systems. $A$ must be **actuals from a successful, justifiable analogy program**; $P$ must be an acceptable, intuitively valid cost driver. **Risk lies in $F$**, because of $P_e$ (the estimated system's parameter is not yet known with certainty), while $A$ and $P_a$ are historical and carry less risk. Preferred variant: $E = A \times F + b$, with $F$ and $b$ justified by regression.
- **Related (Indirect) Cost Equation**: $E = F \times C$, where $F = C_i / C_d$. $E$ is an indirect/derivative cost (program management, test, design hours); $C$ is an estimated direct/Above-the-Line cost. $C$ must be a **well-established direct cost**; $F$ must be a **historically demonstrated fraction**. The BOE-specific risk lies in $F$, but risk also **flows through $C$** because $C$ itself is estimated. Preferred variant: $E = C \times F + b$, justified by regression.
- **Build-Up Equation**: $E = R \times P$, where $R$ is a historical rate (MH/ft, MH/ton, \$/trip) and $P$ is a measured/surveyed/design parameter. $R$ must be **historically demonstrated**; $P$ must be a **measured or design value**. **Risk lies in $P$**, because $R$ is usually well-justified. Preferred variant: $E = R \times P + b$, justified by regression.

:::widget boe-calc:::

{{primer}}

+++

### BOE worked example (Fig. 14.13)

A software interface's labor effort, estimated by **analogy**: average lines of code (LOC) across three similar historical interfaces = 1,776; average hours per LOC = 1.19.

$$1{,}776 \text{ LOC} \times 1.19 \text{ hrs/LOC} = 2{,}113.4 \text{ hrs} \times \$42/\text{hr} = \$88{,}763$$

Labor BOEs frequently stay in hours, with dollarization happening later in pricing. A reviewer without insight into how the historical LOC average was derived cannot recreate the estimate - that traceability gap is the example's key weakness. A reviewer might also regress the historical data as an independent cross-check; ideally the contractor has already done this before submission.

### Estimate quality and validity

The FAR (Section 2.1) defines cost or pricing data as more than historical accounting data: *"all the facts that can be reasonably expected to contribute to the soundness of estimates of future costs and the validity of determinations of costs already incurred."*

**Estimate quality**: the right content (matching the technical baseline and WBS), accepted methodologies, historical data, appropriate statistics, CERs with the best available fit. The estimate should be **unbiased** (neither overly optimistic nor conservative), **comprehensive** (nothing left out) but **not redundant**, with documented ground rules/assumptions, and **replicable** - the best cross-check for documentation.

**Estimate validity**: cross-check results across methodologies (e.g., validate a parametric estimate with an analogy) - the numbers need not match exactly but should be the same order of magnitude. Include more information rather than less, attach (don't merely cite) supporting studies, and show all work.

:::check
Q: Which element typically requires the most detailed BOE support?
- Small purchases
- Administrative overhead
* High-dollar, high-risk elements
> Detail is proportional to dollar value and risk. Effort goes where it matters most.
:::

:::check
Q: In the analogy equation E = A x F, where does the risk principally lie, and why?
* In F, because of Pe (the estimated system's parameter is not yet certain)
- In A, because analogy data is always unreliable
- In Pa, because it is historical
> A and Pa are historical/well-developed and carry less risk; F depends on Pe, the still-uncertain parameter of the system being estimated.
:::

:::check
Q: A BOE scales an ODC using a "help desk staff per 500 users" factor. This is an example of which type of cost element, and where is the risk?
* Scaled-by-a-driver; risk is mainly in the scaling factor itself
- M-to-N; risk is mainly in the "M"
- Fixed; there is minimal risk
> Scaling factors are judgment-driven CER substitutes - that is where the estimating risk concentrates.
:::

:::check
Q: BOE Fig. 14.13: 1,776 LOC x 1.19 hrs/LOC x \$42/hr. Total dollars? (round hours to one decimal first, as CEBoK does)
= 88763 ±2
> 1,776 x 1.19 = 2,113.4 hrs; 2,113.4 x 42 = \$88,763.
:::`
    },
    {
      id: 'analysis', title: 'Price and cost analysis', summary: 'Analysis methods, comparative process, BOE review, errors',
      body: String.raw`:::primer:::
Government evaluators can look at a proposal's bottom line only, or open up every cost element. Each approach has its own triggers.

:::sort
Q: Does each description fit price analysis or cost analysis?
buckets: Price analysis | Cost analysis
- Evaluates the total price without examining separate cost elements = Price analysis
- Used when adequate price competition exists = Price analysis
- Evaluates labor hours, rates, material, overhead, G&A, and profit = Cost analysis
- Verifies reasonableness, allocability, and allowability under FAR Part 31 = Cost analysis
> Price analysis looks at total price, typically under adequate competition. Cost analysis evaluates the individual cost elements and is required when adequate competition is absent or certified data was obtained.
:::

+++

### Price analysis vs. cost analysis

**Price Analysis:**
- Evaluate the **total price** without examining separate cost elements
- Used when **adequate price competition** exists, or where cost justification simply was not submitted as part of the proposal
- Compare to: competing proposals, prior prices for similar items, published market indices, or parametric models

**Cost Analysis:**
- Evaluate the **individual cost elements** (labor hours, rates, material, overhead, G&A, profit)
- Required when adequate competition does not exist, or certified cost or pricing data has been obtained
- Verifies reasonableness, allocability, and allowability under FAR Part 31 cost principles

**Cost Realism** (for cost-type contracts): is the proposed cost realistic for the work described? Government may adjust the proposed cost to a **most probable cost** for evaluation purposes.

{{primer}}

+++

### The comparative analysis process (four steps)

The primary purpose of a cost/price comparative analysis is to evaluate proposals for reasonableness and provide an objective basis for comparison - it also supports decisions like **Cost As an Independent Variable (CAIV)** or **Cost/Benefit Analysis (CBA)**, and helps quantify program risk for negotiation and long-range planning. CEBoK defines **four** steps:

1. **Technical Understanding**: what is the proposal for (initial development, re-plan, added requirements, extension)? How does it relate to program history? How will it affect scheduled work? The analyst is not the systems engineer but cannot ignore technical scope.
2. **BOE Review**: verify data, methodology, calculations, and assumptions using the 5W+H (see the Proposal section), watching for common errors (below).
3. **Independent Assessment**: the analyst builds an **Independent Cost Estimate (ICE)** of the same solution, or an **Independent Cost Assessment (ICA)** of the differences between competing proposals. If a different method reaches the **same answer**, treat that agreement as a **strong cross-check**.
4. **Comparative Analysis**: summarize and document assumptions, resources, and results for both sides; identify and explain **each delta over a predetermined threshold (e.g., 20%)**. Key questions: are the big differences explainable (e.g., comparable software development scope)? Do both estimates contain the same cost elements? Are underlying assumptions different, and why?

:::tip Beyond CEBoK
Some training materials extend this into a longer negotiation checklist - developing a negotiation objective range (minimum/target/maximum) and documenting the outcome in a Price Negotiation Memorandum (PNM). That extended framing is reasonable practice but is not part of CEBoK's core four-step process; the four steps above are what CEBoK tests.
:::

+++

### Common BOE, risk, and pricing errors

**Common BOE errors**: no basis whatsoever; adjustments with no basis; subcontractors with no BOEs; **cherry picking**; missing elements; a BOE out of sync with the technical volume; two BOEs each assuming the other covers a cost (or both claiming the same cost); errors in standards (e.g., MH/year, period of performance); unjustified travel/material quantities or facility costs/choices; basing an estimate on another estimate; learning curve errors.

**Cherry picking** means choosing only one program from a set of otherwise-reasonable analogy programs to get the answer the BOE author wants (usually the lowest, sometimes the highest).

**Common risk-related errors**: missing risks implied by the BOEs; missing or incorrect roll-up of the risk register; not understanding the risk register's relationship to Management Reserve (MR); buried MR; missing technical risks; improperly characterized risks; no (or improper) analysis of Service Level Agreements (SLAs); no risk register at all.

**Common pricing-related errors**: out of sync with the BOEs; missing BOEs or WBS elements; insufficient or no escalation; lack of inflation clauses; currency exchange-rate hedging mischaracterized in risk or MR.

:::check
Q: A BOE analyst has five comparable historical programs available but cites only the cheapest one to support a low estimate. This is...
* Cherry picking
- Cost realism
- A valid analogy, since any historical program is acceptable
> Cherry picking selects one favorable data point from a reasonable set instead of justifying the choice or using the full set.
:::

:::check
Q: Price analysis is conducted on proposals where...
* Cost justification was not submitted as part of the documentation
- The government wants a faster review regardless of documentation
- Certified cost or pricing data has been obtained
> Price analysis evaluates total price without inspecting lower-level cost/profit elements - appropriate when no cost breakdown was submitted (often because of adequate competition).
:::

:::check
Q: Two independent estimating methods (e.g., analogy and parametric) reach essentially the same answer for a cost element. What does CEBoK say to conclude?
* This agreement is a strong cross-check of the proposal
- The methods were redundant and one should be dropped
- This is a coincidence with no evaluative value
> Different methods converging on the same answer is treated as strong corroborating evidence.
:::

+++

### Related topics: UCF and CAS (core)

**Uniform Contract Format (UCF):** FAR-prescribed organization of solicitations/contracts into labeled sections:

| Section | Content |
|---|---|
| **A** | Solicitation/contract form |
| **B** | Supplies/services and prices |
| **C** | Specification/SOW/SOO/ORD |
| **H** | Special contract requirements |
| **I** | Contract clauses |
| **L** | **Instructions, conditions, and notices to offerors** (how to prepare proposals, including BOEs) |
| **M** | **Evaluation Factors for Award** (how proposals will be evaluated - technical acceptability, lowest cost, best value, etc.) |

**Cost Accounting Standards (CAS):** required by Public Law 100-679 on many government contracts, to ensure a contractor's proposal-estimating practices are consistent with its cost-accounting practices. CEBoK lists **20 CAS principles** (Fig. 14.16, numbered 401-420). **Full CAS coverage** applies all of them; **modified CAS coverage** refers to just **401, 402, 405, and 406**.

:::tip Beyond CEBoK
The current, published CAS list (48 CFR 9904) has only **19 active standards** - one number in the 401-420 range is unused/reserved. CEBoK's own count of "20 CAS principles" reflects the full numbered range rather than the current active count; know CEBoK's number (20, full vs. modified 401/402/405/406) for the exam.
:::

:::check
Q: Per CEBoK's Fig. 14.16, how many CAS principles are summarized?
= 20 ±0
> CEBoK lists 20 CAS principles, numbered 401-420 (modified coverage uses just 401, 402, 405, and 406).
:::

:::check
Q: "Modified" CAS coverage applies which standards?
* 401, 402, 405, and 406
- All 20 standards
- Only 401 and 402
> Modified coverage is the smaller subset: 401, 402, 405, 406. Full coverage applies all of them.
:::

:::check
Q: Where in the UCF do offerors learn how proposals will be evaluated?
- Section C
- Section L
* Section M
> Section L = instructions to prepare proposals (including BOEs). Section M = evaluation criteria (how the govt grades them).
:::`
    },
    {
      id: 'testable', title: 'Testable Topics', summary: 'What CEBoK expects you to know for this module',
      body: String.raw`:::primer:::
CEBoK says what to study hardest in this module. Where would you put each topic?

:::sort
Q: How does CEBoK rate each topic for this module?
buckets: Testable | Not testable
- Types of contracts (names and basics of each one) = Testable
- Computing FPIF adjusted profit and PTA, or CPIF adjusted fee and RIE = Testable
- Anything specific about the FAR unless otherwise noted = Not testable
> The table marks contract types and profit/loss calculations as testable. Anything specific about the FAR is not testable unless a number is explicitly called out elsewhere in the module.
:::

+++

CEBoK publishes an explicit testable-topics table for this module:

| Testable | Testable, but less emphasized | Not testable |
|---|---|---|
| Types of contracts (names and basics of each one) | Basis of Estimate | Anything specific about the FAR unless otherwise noted |
| Understanding balance of risk/reward in each contract type | | Names of US government organizations and their roles |
| Calculating vendor profit (loss) in various scenarios | | |

In short: know the contract types (FFP through CPFF and their variants), how each allocates risk and reward, and how to compute contractor profit/loss under a given scenario (FPIF's adjusted profit and PTA, CPIF's adjusted fee and RIE, CPAF's award-fee mechanics). The Basis of Estimate is tested, but less heavily than the contract-type math. Specific FAR citations (thresholds, section numbers) and the names/roles of government organizations (NCCA, CAIG, DCAA, etc.) are background reading, not exam content, unless a specific number is explicitly called out elsewhere in this module (e.g., the CPFF fee caps, the letter-contract 50% rule).

{{primer}}

:::check
Q: Per CEBoK's testable-topics table for this module, which is explicitly called out as "not testable" (absent a specific callout elsewhere)?
- Calculating vendor profit or loss in a given scenario
- The balance of risk and reward across contract types
* The names and roles of specific US government organizations
> Contract type names/mechanics and profit/loss calculations are core testable material; org names and general FAR trivia are not, unless a number is specifically called out (like the CPFF fee caps).
:::

:::check
Q: How does CEBoK characterize the Basis of Estimate's exam emphasis relative to contract types and risk/reward?
* Testable, but less emphasized
- Not testable at all
- Equally emphasized
> BOE sits in the middle tier: know its content and the three cost-estimating equations, but expect contract types and profit/loss scenarios to be tested more heavily.
:::`
    },
    {
      id: 'advanced', title: 'Advanced (not testable per CEBoK)', summary: 'Full UCF, CAS exceptions, contract-type envelope comparison',
      body: String.raw`:::primer:::
Plot contractor profit against actual cost for different contract types. One type draws a very different line from the rest.

:::check
Q: Under CPFF, what happens to the contractor's profit as actual cost overruns?
* Nothing; the profit function is flat
- It falls dollar-for-dollar with the overrun
- It rises as the fee grows with the overrun
> The CPFF profit function is invariant (flat). FFP is the one that rises or falls dollar-for-dollar with under/overruns.
:::

+++

Per the Testable Topics table, the FAR specifics and organizational detail below are **not testable** - read for context, not memorization. (PTA and RIE calculations remain core/testable material, covered in the FPIF and Cost-Reimbursement sections above.)

### Uniform Contract Format (UCF), full structure

| Part | Sections |
|---|---|
| **I - The Schedule** | A Solicitation/Contract Form · B Supplies/Services & Prices · C Specification/SOW/SOO/ORD · D Packaging & Marking · E Inspection & Acceptance · F Deliveries or Performance · G Contract Administration Data · H Special Contract Requirements |
| **II - Contract Clauses** | I Contract Clauses |
| **III - List of Documents** | J List of Attachments |
| **IV - Representations & Instructions** | K Representations, Certifications, & Other Statements · L Instructions, Conditions, & Notices to Offerors · M Evaluation Factors for Award |

Per FAR 15.204: *"The use of a uniform contract format facilitates the preparation of the solicitation and contract as well as the reference to, and use of, those documents by offerors, contractors, and contract administrators."* Section C states the requirements; Section L tells offerors how to respond (including BOE preparation); Section M states how the government will judge proposals.

### CAS coverage exceptions

Full CAS coverage originally applied to all contracts over a threshold, but exceptions now exist, including: FFP and FFP with Economic Price Adjustment for commercial items; FFP contracts awarded on adequate price competition without submitted cost/pricing data; sealed-bid contracts; negotiated contracts/subcontracts under \$650K; contracts/subcontracts with small businesses; subcontracts/contracts to a foreign concern; contracts performed entirely outside the US; contracts/subcontracts where law or regulation sets the price; contracts/subcontracts under \$7.5M (unless the contractor already performs CAS-covered contracts over \$7.5M); and NATO PHM Ship program subcontracts performed outside the US by a foreign concern.

+++

### Contract-type envelope comparison

Plotting **profit**, **price**, and **revenue** functions for FFP, FPI, CPIF, and CPFF on the same axes shows that the two extreme types bound (form the "envelope" of) all possible outcomes:

- **Profit function**: CPFF is invariant (flat); FFP rises or falls dollar-for-dollar with under/overruns. CPIF and FPI sit *between* them, parallel to CPFF at their min/max fee (or PTA) and matching FFP's slope elsewhere.
- **Price function**: CPFF rises/falls dollar-for-dollar with cost; FFP is invariant. Again, CPIF parallels CPFF at min/max fee, FPI parallels FFP at the PTA.
- **Revenue (ROS) function**: CPFF slowly erodes with overruns; FFP declines linearly. CPIF and FPI again sit between, matching the same parallel pattern.

**Takeaway**: CPIF is CPFF with a share-ratio-driven zone in the middle (between the min and max fee); FPI is FFP with a share-ratio-driven zone in the middle (up to the PTA). Everything else is a blend that behaves like whichever bound it's closest to once outside its own incentive range.

:::widget contract-spectrum:::

{{primer}}

:::note Source note
CEBoK's PTA formula section (Related and Advanced Topics) writes $PTA = (CP-TP)/GS + TC$ using "TP" for **target price**, whereas the main FPIF section elsewhere uses TP for **target profit**. Watch for this notational overlap - the formula itself, $PTA = TC + (CP - \text{Target Price})/\text{Government Share}$, is unchanged either way.
:::

+++

:::check
Q: Which two contract types define the "envelope" bounding all other contract types' profit/price/revenue outcomes?
* FFP and CPFF
- FPIF and CPIF
- CPAF and T&M
> FFP (fully fixed price) and CPFF (fully reimbursed cost) sit at opposite ends of the risk spectrum and bound every other type's behavior.
:::

:::check
Q: How does CPIF's profit function relate to CPFF's, outside its min/max fee range?
* It runs parallel to CPFF at the pegged min or max fee
- It always exceeds CPFF's profit
- It has no relationship to CPFF
> Outside the fee-adjustment range, CPIF behaves just like CPFF (fee pegged, cost fully reimbursed) - so the lines run parallel.
:::

:::check
Q: A negotiated contract/subcontract under \$650K is generally...
* Exempt from CAS coverage
- Always fully CAS-covered
- Covered only under modified CAS (401/402/405/406)
> One of several listed CAS exceptions is negotiated contracts/subcontracts below \$650K.
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
R: yes
Q: What does a BOE (Basis of Estimate) document?
A: How each proposal element was estimated: scope, method, source data, assumptions, calculations, and rationale (the 5W+H).
R: yes
Q: The 5W+H of BOE content
A: Who performed the work · What tasks · Where it took place · When it took place · Why the data was used · How it was normalized/adjusted.
R: yes
Q: The three cost-estimating equations of a BOE
A: Analogy: E = A×F, F=Pe/Pa (risk in F/Pe). Related/Indirect: E=F×C, F=Ci/Cd (risk in F, flows through C). Build-up: E=R×P (risk in P).
Q: Preferred variant of each BOE equation
A: Add a y-intercept b (E = A×F+b, E=C×F+b, E=R×P+b), with F/R/P and b justified by regression.

## Fee, Profit, and Margin
Q: Fee (Return On Cost / ROC)
A: The amount paid to the contractor over and above cost, in dollars or % of cost; synonymous with contractor profit absent a ceiling breach.
R: yes
Q: Margin (Return on Sales / ROS)
A: Profit expressed as a percentage of cost + profit together (i.e., of revenue/price), not just of cost.
R: yes
Q: Revenue equation
A: Revenue = Cost + Profit = Price.
R: yes
Q: Margin % to Fee % conversion
A: Margin % = Fee % / (1 + Fee %); Fee % = Margin % / (1 − Margin %).
Q: Base case (Fig. 14.5): TC \$10M, TP \$1M. Price and revenue at TC?
A: Price = \$11M; revenue (ROS) at TC = 9.09% (\$1M / \$11M).

## Contract Types Spectrum
Q: Contract types from highest to lowest contractor risk
A: FFP → FPIF/FPI → FP-EPA → CPIF → CPAF → CPFF (T&M and LH also low contractor risk).
Q: FFP: who bears cost overruns, and what shareline does this resemble?
A: The contractor, entirely; overruns reduce profit directly - essentially a 0/100 (govt/contractor) shareline.
Q: CPFF: what shareline does it resemble?
A: Essentially a 100/0 shareline - the government covers cost regardless, fee is fixed.
Q: Contract type when requirements are well-defined and costs certain
A: FFP (Firm Fixed Price).
Q: Contract type when cost is uncertain and incentive is desired
A: FPIF or CPIF (incentive types share cost risk via a share ratio).
Q: When is CPFF appropriate?
A: High uncertainty (basic R&D, early development), used when CPIF is not practical and objective incentive targets can't yet be set.
Q: Share ratio meaning (e.g., 70/30)
A: Written Govt/Contractor: the govt absorbs 70% of each cost-growth dollar; contractor absorbs 30%.
Q: Choosing a conservative vs. aggressive share ratio
A: High-risk program → conservative ratio (e.g., 90/10); maximum cost-control incentive desired → aggressive ratio (e.g., 50/50).
Q: Can an incentive contract use multiple share ratios?
A: Yes - one ratio can apply to underruns and a different ratio to overruns.
Q: FP with Economic Price Adjustment (FP-EPA)
A: Fixed price adjusted for increases/decreases in specific item prices, specified labor/material costs, or contractually-specified cost indexes.
R: yes
Q: Fixed Price Level of Effort (FP LOE)
A: Fixed labor rates with government-dictated hours; used when the work doesn't suit a completion-type contract.
R: yes
Q: Fixed Price Award Fee (FPAF)
A: A fixed-price contract with a subjective award fee paid on top, used when performance can't be objectively measured.
R: yes
Q: Incentive fee vs. award fee
A: Incentive fee = quantitative, formula-driven; award fee = qualitative, subjectively judged.
Q: FPI Successive Targets contract
A: Specifies target cost/profit, shareline(s), a later production point for negotiating firm targets, and a ceiling price; becomes FFP or FPIF once negotiated.
R: yes
Q: Indefinite delivery contract types
A: Definite quantity (set amount, fixed period); Requirements (fills all actual needs of designated activities); IDIQ (flexible number within stated limits).
Q: Task order vs. delivery order
A: Delivery order = issuance of orders for delivery of supplies; task order = issuance of orders for performance of tasks. FFP task orders are common.
Q: Letter contract dollar limit
A: The authorized amount must not exceed 50% of the estimated cost of the definitive contract.
Q: T&M and LH contracts
A: Time & Materials and Labor Hour; contractor bills fixed labor rates times actual hours (+ materials for T&M). No positive cost-control incentive.
R: yes

## FPIF
Q: FPIF elements
A: Target Cost (TC), Target Profit (TP), Target Price (TPr = TC + TP), Share Ratio, Ceiling Price (CP).
Q: FPIF adjusted profit formula
A: AP = TP + S(TC − FC); FP = FC + AP, capped at CP.
R: yes
Q: Underrun effect on FPIF profit
A: If FC < TC, the contractor share of the savings increases profit above target (contractor rewarded).
Q: Overrun effect on FPIF profit
A: If FC > TC, the contractor share of the overrun decreases profit below target (contractor penalized).
Q: Point of Total Assumption (PTA) definition
A: The actual cost at which the FPIF price reaches the ceiling; beyond it the contractor absorbs 100% of further cost.
R: yes
Q: PTA formula
A: PTA = TC + (CP − Target Price) / Government Share
R: yes
Q: Why PTA denominator uses Government Share
A: The gap between target price and ceiling is closed at the government's cents-on-the-dollar rate; once that share is exhausted, the contractor pays all.
Q: FPIF: TC = 100, TP = 10, CP = 120, share 70/30. PTA?
A: 100 + (120 − 110)/0.70 = 114.29
Q: FPIF: TC 100, TP 10, AC 90, share 70/30. Profit?
A: 10 + 0.30 × (100 − 90) = 13
Q: CEBoK \$90M FPIF example: base terms
A: TC \$90M, TP "10%" (\$9M), ceiling \$108M, PTA ≈ \$102.86M, underrun share 80/20, overrun share 70/30.
Q: \$90M FPIF example, Scenario 1 (FC \$85M): final price and profit
A: FP = TP + GS(FC−TC) + TC = 99 + 0.80(85−90) = \$95M; profit = 95 − 85 = \$10M.
Q: \$90M FPIF example, Scenario 2 (FC \$97M, 70/30 overrun): profit
A: 9 − 0.30×(97−90) = 9 − 2.1 = \$6.9M.
Q: \$90M FPIF example, Scenario 3 (FC \$105M, past PTA \$102.86M): price and profit
A: Price capped at ceiling \$108M; profit = 108 − 105 = \$3M.
Q: No ceiling price on FPIF
A: False; FPIF always has a ceiling price, which caps total government payment.

## CPIF and RIE
Q: CPIF elements
A: Target Cost (TC), Target Fee (TF), Minimum Fee, Maximum Fee, Share Ratio (Govt/Contractor).
Q: CPIF adjusted fee formula
A: Fee = TF + (contractor share) × (TC − AC), bounded by [min fee, max fee].
R: yes
Q: Total payment in CPIF, and how it differs from FPIF
A: Actual Cost + Final Fee; unlike FPIF, there is no ceiling on total reimbursement, only on the fee.
Q: Range of Incentive Effectiveness (RIE)
A: The range of actual costs over which the share ratio is "live" (fee varies with cost between min and max).
R: yes
Q: RIE high endpoint formula
A: RIE_high = (TF − mF) / CS_over + TC
R: yes
Q: RIE low endpoint formula
A: RIE_low = TC − (MF − TF) / CS_under
R: yes
Q: RIE worked example: TC 90, mF 1, MF 10, TF 9, share 70/30 both sides
A: RIE_high = (9−1)/0.30 + 90 ≈ 116.67; RIE_low = 90 − (10−9)/0.30 ≈ 86.67.
Q: CPIF: TC 100, TF 8, share 80/20, min 3, max 12. AC 105. Fee?
A: 8 + 0.20 × (100 − 105) = 7
Q: CPIF: same. RIE high endpoint (cost at min fee)?
A: 100 + (8 − 3) / 0.20 = 125
Q: CPIF: same. RIE low endpoint (cost at max fee)?
A: 100 − (12 − 8) / 0.20 = 80
Q: CEBoK's CPIF illustration (Fig. 14.10) min/max fee as % of TC
A: Min fee \$0.3M (3% of TC); max fee \$2.0M (20% of TC); outside this range the contract behaves like CPFF.

## CPFF
Q: CPFF fee limits per FAR 15.404-4
A: R&D 15% · Production & Services (non-R&D) 10% · Architecture/Engineering 6%.
Q: Is a CPFF fee a fixed percentage or fixed dollar amount?
A: Fixed dollar amount; the FAR specifically prohibits a fixed-percentage fee.
Q: CPFF revenue at target cost (using the \$10M/\$1M base case)
A: 9.09% (\$1M / \$11M) - same ratio as the FFP base case at TC.
Q: Why does CPFF carry a "goodwill risk" despite low cost risk?
A: Chronic overruns erode the contractor-government relationship and can cost the contractor future business, even though the fee itself is unaffected.

## CPAF
Q: CPAF (Cost Plus Award Fee)
A: Cost + base fee + award fee, where award fee is earned via subjective evaluation by an Award Fee Board against an Award Fee Plan.
R: yes
Q: What kind of ceiling does a CPAF contract have?
A: A cost ceiling (not a price ceiling) - government covers allowable cost only up to that limit.
Q: CEBoK's CPAF example (TC \$90M, cost ceiling \$108M, award fee \$8.2M held constant): Scenario 3, FC \$115M
A: Price = ceiling + fee = 108 + 8.2 = \$116.2M; profit reduced by the \$7M uncovered overrun to \$1.2M.
Q: When is CPAF used?
A: When performance is hard to quantify objectively (quality, responsiveness, management) and cost is also hard to forecast.
Q: Indefinite Delivery/Indefinite Quantity (IDIQ)
A: A contract vehicle for a flexible quantity of supplies/services within stated limits over a period; work ordered via task/delivery orders.
R: yes

## BOE & Proposal
Q: BOE worked example (Fig. 14.13): 1,776 LOC x 1.19 hrs/LOC x \$42/hr
A: 1,776 × 1.19 = 2,113.4 hrs; 2,113.4 × 42 = \$88,763.
Q: Types of cost elements and their principal risk
A: Scaled-by-a-driver (risk in the scaling factor) · M-to-N (risk usually in N, the count) · Fixed (easily justified, but can be over-relied on).
Q: The four essential/common BOE estimating methodologies
A: Analogy, parametric (CER), engineering (build-up), and standard cost models.
Q: Less-preferred BOE estimating methods
A: Company standard bidding systems, expert opinion, commercial/catalog/market price.
Q: FAR's definition of cost or pricing data
A: More than historical accounting data - all facts reasonably expected to contribute to the soundness of future-cost estimates and the validity of already-incurred cost determinations.
R: yes
Q: Estimate quality characteristics
A: Right content vs. WBS/technical baseline, accepted methodology, unbiased, comprehensive but not redundant, documented ground rules, replicable.
Q: Estimate validity guideline
A: Cross-check with a second methodology (similar order of magnitude, not necessarily identical); include full documentation; show all work.
Q: Why is "replicability" called the best cross-check for BOE documentation?
A: If a reviewer can independently reproduce the answer using the documented method and data, the estimate's traceability is proven.

## Comparative Analysis
Q: CEBoK's four steps of cost/price comparative analysis
A: 1 Technical understanding · 2 BOE review · 3 Independent assessment (ICE/ICA) · 4 Comparative analysis (explain deltas over a threshold, e.g. 20%).
Q: Cherry picking (BOE error)
A: Choosing only one program from a set of reasonable analogies to get a desired (usually low) answer, instead of justifying the choice.
R: yes
Q: What does agreement between two independent estimating methods indicate?
A: A strong cross-check of the proposal, per CEBoK.
Q: When is price analysis conducted?
A: When cost justification was not submitted with the proposal (often due to adequate price competition) - total price is evaluated without inspecting cost elements.
Q: When is cost analysis required?
A: When adequate competition is absent, or certified cost/pricing data has been obtained.
Q: Common risk-related BOE errors
A: Missing risks, incorrect risk-register roll-up, misunderstanding MR's relationship to the register, buried MR, missing technical risks, no/improper SLA analysis.
Q: Common pricing-related BOE errors
A: Out of sync with BOEs, missing BOEs/WBS, insufficient escalation, lack of inflation clauses, mischaracterized currency-hedging risk.
Q: CAIV and CBA in the context of comparative analysis
A: Comparative analysis results support decisions like Cost As an Independent Variable (CAIV) and Cost/Benefit Analysis (CBA).

## Uniform Contract Format & CAS
Q: UCF Section L
A: Instructions, Conditions, & Notices to Offerors (how to prepare and submit proposals, including BOEs).
R: yes
Q: UCF Section M
A: Evaluation Factors for Award (criteria by which govt evaluates proposals).
R: yes
Q: UCF Section B and C
A: B = Supplies/Services and Prices. C = Specification/SOW/SOO/ORD.
Q: Uniform Contract Format, full parts and sections
A: Part I (A-H, the Schedule) · Part II (I, clauses) · Part III (J, attachments) · Part IV (K-M, representations & instructions).
Q: CEBoK's Cost Accounting Standards (CAS) count and coverage
A: 20 CAS principles (numbered 401-420, Fig. 14.16); full coverage = all 20; modified coverage = 401, 402, 405, 406.
Q: Why does the current published CAS list show only 19 active standards? (Beyond CEBoK)
A: One number in the 401-420 range is unused/reserved in the current 48 CFR 9904 list; CEBoK's count of 20 reflects the full numbered range.
Q: Name 3 CAS coverage exceptions
A: FFP/FFP-EPA for commercial items, sealed-bid contracts, contracts/subcontracts under \$650K, small-business contracts, contracts entirely outside the US.

## Advanced: Contract-Type Envelope
Q: Which two contract types form the "envelope" bounding all others' profit/price/revenue outcomes?
A: FFP and CPFF - the fully-fixed and fully-reimbursed extremes.
Q: How do CPIF and FPI relate to CPFF and FFP outside their incentive range?
A: CPIF runs parallel to CPFF at its pegged min/max fee; FPI runs parallel to FFP at the PTA.
Q: PTA formula notation caveat (Advanced section)
A: The Advanced-topics PTA formula uses "TP" for target price, while the main FPIF section uses TP for target profit - same formula, different label.
`
});
