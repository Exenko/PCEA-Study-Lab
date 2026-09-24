// Handwritten multi-step campaign. Each step's correct answer is revealed before the next step so errors do not cascade.
(function (root) {
  const f = (v, dp = 3) => Number(v).toLocaleString('en-US', { maximumFractionDigits: dp });
  const lcB = s => Math.log(s) / Math.log(2);
  const C = [];

  { const s1 = 42 * Math.pow(1.025, 5), s2 = s1 * 1.2, s3 = s2 * Math.pow(1.03, 2);
    C.push({ id: 'alpha', title: 'Program Alpha: the first quote', rep: 0,
      story: 'A customer wants a quick quote for a radar upgrade. Your only data point is a similar upgrade that cost \\$42.0M in BY2019 dollars.',
      steps: [
        { prompt: 'Bring the analog to BY2024 dollars using 2.5% annual inflation.', answers: [{ label: 'Analog in BY2024', unit: '$M', value: s1 }], explain: `$42 \\times 1.025^5 = ${f(s1)}$` },
        { prompt: 'Engineers judge the new upgrade 20% more complex. Apply a complexity factor of 1.2.', answers: [{ label: 'Estimate, BY2024', unit: '$M', value: s2 }], explain: `$${f(s1)} \\times 1.2 = ${f(s2)}$` },
        { prompt: 'Purchase happens in FY2026. Escalate from BY2024 at 3% per year to then-year dollars.', answers: [{ label: 'Then-year quote', unit: '$M', value: s3 }], explain: `$${f(s2)} \\times 1.03^2 = ${f(s3)}$` }
      ] }); }

  { const t1 = 3.2 * Math.pow(450, 0.72), b = lcB(0.9); let lot = 0; for (let x = 1; x <= 50; x++) lot += t1 * Math.pow(x, b);
    C.push({ id: 'pitch', title: 'The parametric pitch', rep: 1,
      story: 'You are bidding 50 guidance kits. Your CER is $\\text{T1} = 3.2\\,W^{0.72}$ (\\$K, weight in lb), and the plant follows a 90% unit learning curve.',
      steps: [
        { prompt: 'The kit weighs 450 lb. What is the first-unit cost?', answers: [{ label: 'T1', unit: '$K', value: t1 }], explain: `$3.2 \\times 450^{0.72} = ${f(t1)}$` },
        { prompt: 'Total cost of units 1–50 on a 90% unit curve (exact sum).', answers: [{ label: 'Lot cost', unit: '$K', value: lot }], explain: `$b = ${f(b, 4)}$; $\\sum_{x=1}^{50} T_1 x^b = ${f(lot)}$` },
        { prompt: 'Average unit cost for the 50 kits.', answers: [{ label: 'Average', unit: '$K', value: lot / 50 }], explain: `$${f(lot)} / 50 = ${f(lot / 50)}$` }
      ] }); }

  { const BAC = 80, EV = 30, AC = 36, PV = 34, cpi = EV / AC, spi = EV / PV;
    C.push({ id: 'overrun', title: 'The overrun', rep: 2,
      story: 'Midway through development the program manager asks how bad it is. BAC \\$80M; PV \\$34M, EV \\$30M, AC \\$36M.',
      steps: [
        { prompt: 'Find CPI and SPI.', answers: [{ label: 'CPI', unit: '', value: cpi }, { label: 'SPI', unit: '', value: spi }], explain: `$CPI = 30/36 = ${f(cpi, 4)}$, $SPI = 30/34 = ${f(spi, 4)}$` },
        { prompt: 'CPI-based EAC and composite EAC.', answers: [{ label: 'EAC (CPI)', unit: '$M', value: BAC / cpi }, { label: 'EAC (CPI×SPI)', unit: '$M', value: AC + (BAC - EV) / (cpi * spi) }], explain: `$80/${f(cpi, 4)} = ${f(BAC / cpi)}$; $36 + 50/(${f(cpi, 4)} \\times ${f(spi, 4)}) = ${f(AC + (BAC - EV) / (cpi * spi))}$` },
        { prompt: 'TCPI to finish at BAC.', answers: [{ label: 'TCPI', unit: '', value: (BAC - EV) / (BAC - AC) }], explain: `$(80-30)/(80-36) = ${f((BAC - EV) / (BAC - AC), 4)}$, far above the current CPI: the BAC is not credible.` }
      ] }); }

  { const TC = 120, TF = 9.6, mn = 3.6, mx = 14.4, fee = ac => Math.min(mx, Math.max(mn, TF + 0.3 * (TC - ac)));
    const TP = 12, CP = 150, pta = TC + (CP - (TC + TP)) / 0.7, price = Math.min(CP, 132 + TP + 0.3 * (TC - 132));
    C.push({ id: 'incentive', title: 'Incentive negotiation', rep: 3,
      story: 'The customer offers either CPIF (TC \\$120M, TF \\$9.6M, 70/30, fee \\$3.6M–\\$14.4M) or FPIF (TC \\$120M, TP \\$12M, ceiling \\$150M, 70/30).',
      steps: [
        { prompt: 'CPIF fee if actual cost is \\$132M.', answers: [{ label: 'Fee', unit: '$M', value: fee(132) }], explain: `$9.6 + 0.3(120-132) = ${f(fee(132))}$` },
        { prompt: 'CPIF fee if actual cost is \\$100M.', answers: [{ label: 'Fee', unit: '$M', value: fee(100) }], explain: `$9.6 + 0.3(20) = 15.6$, capped at the \\$14.4M maximum.` },
        { prompt: 'FPIF point of total assumption.', answers: [{ label: 'PTA', unit: '$M', value: pta }], explain: `$120 + (150-132)/0.7 = ${f(pta)}$` },
        { prompt: 'FPIF final price if actual cost is \\$132M.', answers: [{ label: 'Price', unit: '$M', value: price }], explain: `Profit $= 12 + 0.3(120-132) = 8.4$; price $= 132 + 8.4 = ${f(price)}$ (below the ceiling).` }
      ] }); }

  { const q = 250000 / (260 - 180), save = (5000 * 260 - (250000 + 5000 * 180)) / 1000;
    C.push({ id: 'actuator', title: 'Make or buy the actuator', rep: 4,
      story: 'Making the actuator needs \\$250K of tooling plus \\$180 per unit; the supplier quotes \\$260 per unit.',
      steps: [
        { prompt: 'Break-even quantity.', answers: [{ label: 'Quantity', unit: 'units', value: q }], explain: `$250{,}000 / (260-180) = ${f(q)}$` },
        { prompt: 'The program needs 5,000 units. How much does making save?', answers: [{ label: 'Savings', unit: '$K', value: save }], explain: `Buy $= 1{,}300$K; make $= 250 + 900 = 1{,}150$K; savings $= ${f(save)}$K.` }
      ] }); }

  { const el = [[10, 12, 18], [20, 25, 40], [5, 6, 9]];
    const mean = el.map(([a, m, b]) => (a + m + b) / 3), sd = el.map(([a, m, b]) => Math.sqrt((a * a + m * m + b * b - a * m - a * b - m * b) / 18));
    const tm = mean.reduce((s, v) => s + v, 0), ts = Math.sqrt(sd.reduce((s, v) => s + v * v, 0)), p80 = tm + 0.8416 * ts;
    C.push({ id: 'risk', title: 'Risk-adjusted budget', rep: 5,
      story: 'Three independent WBS elements are triangular (\\$M): (10, 12, 18), (20, 25, 40), (5, 6, 9) as low, mode, high.',
      steps: [
        { prompt: 'Total mean cost.', answers: [{ label: 'Mean', unit: '$M', value: tm }], explain: `Means ${mean.map(v => f(v)).join(', ')} sum to ${f(tm)}.` },
        { prompt: 'Total standard deviation (independent).', answers: [{ label: 'σ', unit: '$M', value: ts }], explain: `$\\sigma_i$ = ${sd.map(v => f(v)).join(', ')}; root-sum-square = ${f(ts)}.` },
        { prompt: 'Treating the total as normal, what budget gives 80% confidence? (z = 0.8416)', answers: [{ label: '80% budget', unit: '$M', value: p80 }], explain: `$${f(tm)} + 0.8416 \\times ${f(ts)} = ${f(p80)}$` }
      ] }); }

  { const E = 2.94 * Math.pow(85, 1.1), cost = E * 20 / 1000, sch = 3.67 * Math.pow(E, 0.28);
    C.push({ id: 'software', title: 'The software upgrade', rep: 6,
      story: 'A mission-planning rewrite is sized at 85 KSLOC. Use $E = 2.94\\,\\text{KSLOC}^{1.10}$, schedule $= 3.67\\,E^{0.28}$ months, labor \\$20K per person-month.',
      steps: [
        { prompt: 'Effort in person-months.', answers: [{ label: 'Effort', unit: 'PM', value: E }], explain: `$2.94 \\times 85^{1.10} = ${f(E)}$` },
        { prompt: 'Cost in \\$M.', answers: [{ label: 'Cost', unit: '$M', value: cost }], explain: `$${f(E)} \\times 20 / 1000 = ${f(cost)}$` },
        { prompt: 'Schedule in months, and average staff (effort ÷ schedule).', answers: [{ label: 'Schedule', unit: 'months', value: sch }, { label: 'Average staff', unit: 'people', value: E / sch }], explain: `$3.67 \\times ${f(E)}^{0.28} = ${f(sch)}$ months; staff $= ${f(E / sch)}$.` }
      ] }); }

  { const npv = r => -900 + [1, 2, 3, 4, 5].reduce((s, t) => s + 250 / Math.pow(1 + r, t), 0);
    C.push({ id: 'business', title: 'The business case', rep: 7,
      story: 'Final job: a \\$900K automation investment saves \\$250K per year for 5 years (year-end).',
      steps: [
        { prompt: 'NPV at 7%.', answers: [{ label: 'NPV', unit: '$K', value: npv(0.07) }], explain: `$-900 + 250 \\times \\frac{1 - 1.07^{-5}}{0.07} = ${f(npv(0.07))}$` },
        { prompt: 'NPV at 10%.', answers: [{ label: 'NPV', unit: '$K', value: npv(0.1) }], explain: `$-900 + 250 \\times \\frac{1 - 1.1^{-5}}{0.1} = ${f(npv(0.1))}$` },
        { prompt: 'Simple payback period in years.', answers: [{ label: 'Payback', unit: 'years', value: 900 / 250 }], explain: '$900 / 250 = 3.6$ years (ignores the time value of money).' }
      ] }); }

  if (typeof module !== 'undefined' && module.exports) module.exports = C; else root.ShopCampaign = C;
})(this);
