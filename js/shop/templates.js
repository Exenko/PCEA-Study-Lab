// Contract templates for the estimating shop. gen(h, tier) returns { brief, answers, explain, inputs }; ins describes the inputs.
// Inputs are rounded before answers are computed, so the numbers shown are exactly the numbers used.
(function (root) {
  const K = [0, 1, 3, 10];
  const r2 = v => Math.round(v * 100) / 100, r3 = v => Math.round(v * 1000) / 1000, r1 = v => Math.round(v * 10) / 10;
  const f = (v, dp = 2) => Number(v).toLocaleString('en-US', { maximumFractionDigits: dp });
  const M = (v, dp = 2) => '\\$' + f(v, dp) + 'M';
  const Kd = (v, dp = 1) => '\\$' + f(v, dp) + 'K';
  const pct = (v, dp = 1) => f(v * 100, dp) + '%';
  const erf = x => { const s = Math.sign(x); x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; };
  const phi = z => 0.5 * (1 + erf(z / Math.SQRT2));
  const lcB = s => Math.log(s) / Math.log(2);

  const T = [];
  const add = t => T.push(t);

  // ---- M5 Inflation & escalation ----
  add({ id: 'esc-compound', module: 'm05', section: 'm05/procedures', title: 'Escalate to then-year dollars',
    ins: { cost: { label: 'Base-year cost', unit: '$M' }, rate: { label: 'Inflation per year', unit: '%' }, years: { label: 'Years', unit: 'yr' } },
    gen(h, tier) {
    const C = r1(h.num(2, 20, 0.5) * K[tier]), by = h.num(2018, 2024, 1), n = h.num(2, 8, 1), rt = h.pick([0.02, 0.025, 0.03, 0.035, 0.04]);
    const ty = C * Math.pow(1 + rt, n);
    return {
      brief: `A subsystem is estimated at ${M(C)} in constant BY${by} dollars. It will be bought in FY${by + n}. Assume inflation of ${pct(rt)} per year throughout. What is the then-year cost?`,
      answers: [{ label: 'Then-year cost', unit: '$M', value: ty }],
      explain: `Compound the constant-dollar cost forward ${n} years:\n\n$$TY = BY \\times (1+r)^n = ${C} \\times ${1 + rt}^{${n}} = ${f(ty, 3)}$$`,
      inputs: { cost: C, rate: rt, years: n }
    };
  } });
  add({ id: 'esc-index', module: 'm05', section: 'm05/indices', title: 'Deflate with index numbers',
    ins: { cost: { label: 'Then-year cost', unit: '$M' }, idxBase: { label: 'Index, base year', unit: '' }, idxYear: { label: 'Index, spend year', unit: '' } },
    gen(h, tier) {
    const T$ = r1(h.num(5, 50, 0.5) * K[tier]), ib = r3(h.num(0.9, 1.1, 0.005)), it = r3(ib * (1 + h.num(0.05, 0.35, 0.01))), by = h.num(2015, 2022, 1), yr = by + h.num(3, 9, 1);
    const v = T$ * ib / it;
    return {
      brief: `A contractor reports ${M(T$)} spent in FY${yr} (then-year dollars). The cost index is ${ib} for FY${by} and ${it} for FY${yr}. Express the cost in constant FY${by} dollars.`,
      answers: [{ label: `Cost in FY${by} dollars`, unit: '$M', value: v }],
      explain: `Divide by the ratio of index values:\n\n$$BY = TY \\times \\frac{I_{${by}}}{I_{${yr}}} = ${T$} \\times \\frac{${ib}}{${it}} = ${f(v, 3)}$$`,
      inputs: { cost: T$, idxBase: ib, idxYear: it }
    };
  } });

  // ---- M2 Methods ----
  add({ id: 'analogy-scale', module: 'm02', section: 'm02/analogy', title: 'Analogy with scaling and complexity',
    ins: { cost: { label: 'Analog cost', unit: '$M' }, oldWt: { label: 'Analog weight', unit: 'lb' }, newWt: { label: 'New weight', unit: 'lb' }, exp: { label: 'Scaling exponent', unit: '' }, factor: { label: 'Complexity factor', unit: '' } },
    gen(h, tier) {
    const C = r1(h.num(10, 90, 1) * K[tier]), wo = h.num(200, 900, 10), wn = r1(wo * h.num(0.7, 1.5, 0.05)), cf = h.pick([1.05, 1.1, 1.15, 1.2, 1.25, 1.3]), p = 0.7;
    const v = C * Math.pow(wn / wo, p) * cf;
    return {
      brief: `The analogous system cost ${M(C)} (same base year) and weighed ${wo} lb. The new system is expected to weigh ${wn} lb. Scale cost by weight with an exponent of ${p}, then apply a complexity factor of ${cf}. What is the analogy estimate?`,
      answers: [{ label: 'Analogy estimate', unit: '$M', value: v }],
      explain: `$$\\text{Cost}_{new} = ${C} \\times \\left(\\frac{${wn}}{${wo}}\\right)^{${p}} \\times ${cf} = ${f(v, 3)}$$\n\nAn analogy is only as good as the adjustments; document why each factor applies.`,
      inputs: { cost: C, oldWt: wo, newWt: wn, exp: p, factor: cf }
    };
  } });

  // ---- M3 Parametric ----
  add({ id: 'cer-power', module: 'm03', section: 'm03/forms', title: 'Apply a power CER',
    ins: { a: { label: 'Coefficient a', unit: '' }, b: { label: 'Exponent b', unit: '' }, weight: { label: 'Weight', unit: 'lb' } },
    gen(h, tier) {
    const a = h.num(1.5, 6, 0.1), b = h.num(0.5, 0.95, 0.01), X = h.num(50, 900, 10) * K[tier];
    const v = a * Math.pow(X, b);
    return {
      brief: `Your CER is $\\text{Cost} = ${a} \\times W^{${b}}$ (cost in \\$K, weight $W$ in lb). The new unit weighs ${f(X, 0)} lb. What does the CER predict?`,
      answers: [{ label: 'Predicted cost', unit: '$K', value: v }],
      explain: `$$${a} \\times ${X}^{${b}} = ${f(v, 2)}$$\n\nWith $b < 1$ there are economies of scale: doubling weight multiplies cost by $2^{${b}} = ${f(Math.pow(2, b), 3)}$.`,
      inputs: { a, b, weight: X }
    };
  } });

  // ---- M6 Descriptive statistics ----
  add({ id: 'stats-cv', module: 'm06', section: 'm06/dispersion', title: 'Mean and coefficient of variation',
    ins: { costs: { label: 'Historical costs', unit: '$K' } },
    gen(h, tier) {
    const n = 4 + tier, base = h.num(20, 80, 1) * K[tier];
    const xs = []; for (let i = 0; i < n; i++) xs.push(h.num(Math.round(base * 0.6), Math.round(base * 1.4), 1));
    if (xs.every(x => x === xs[0])) xs[0] += 1;
    const mean = xs.reduce((s, x) => s + x, 0) / n;
    const sd = Math.sqrt(xs.reduce((s, x) => s + (x - mean) * (x - mean), 0) / (n - 1));
    return {
      brief: `Historical costs (\\$K) for ${n} similar items: ${xs.join(', ')}. Find the mean and the coefficient of variation (use the sample standard deviation).`,
      answers: [{ label: 'Mean', unit: '$K', value: mean }, { label: 'CV', unit: '%', value: sd / mean * 100 }],
      explain: `$$\\bar{x} = ${f(mean, 3)}, \\quad s = \\sqrt{\\frac{\\sum (x-\\bar{x})^2}{n-1}} = ${f(sd, 3)}, \\quad CV = \\frac{s}{\\bar{x}} = ${f(sd / mean * 100, 2)}\\%$$`,
      inputs: { costs: xs.slice() }
    };
  } });

  // ---- M7 Learning curves ----
  add({ id: 'lc-unit', module: 'm07', section: 'm07/equation', title: 'Unit cost on a learning curve',
    ins: { t1: { label: 'Unit 1 hours', unit: 'hours' }, slope: { label: 'Learning slope', unit: '%' }, unit: { label: 'Unit number', unit: '' } },
    gen(h, tier) {
    const T1 = h.num(800, 3000, 50) * K[tier], s = h.pick([0.80, 0.82, 0.85, 0.88, 0.90, 0.92, 0.95]), N = h.num(10, 200, 1);
    const b = lcB(s), v = T1 * Math.pow(N, b);
    return {
      brief: `Unit 1 took ${f(T1, 0)} hours. Assume unit theory with a ${pct(s, 0)} learning curve. How many hours will unit ${N} take?`,
      answers: [{ label: `Hours for unit ${N}`, unit: 'hours', value: v }],
      explain: `$$b = \\frac{\\ln ${s}}{\\ln 2} = ${f(b, 4)}, \\quad Y_{${N}} = ${T1} \\times ${N}^{${f(b, 4)}} = ${f(v, 1)}$$`,
      inputs: { t1: T1, slope: s, unit: N }
    };
  } });
  add({ id: 'lc-lot', module: 'm07', section: 'm07/formulas', title: 'Price a production lot',
    ins: { t1: { label: 'First-unit cost', unit: '$K' }, slope: { label: 'Learning slope', unit: '%' }, first: { label: 'First unit in lot', unit: '' }, qty: { label: 'Lot quantity', unit: '' } },
    gen(h, tier) {
    const T1 = h.num(200, 900, 10) * K[tier], s = h.pick([0.80, 0.85, 0.88, 0.90, 0.92]), F = h.num(11, 60, 1), Q = h.num(10, 40, 1), L = F + Q - 1;
    const b = lcB(s);
    let sum = 0; for (let x = F; x <= L; x++) sum += T1 * Math.pow(x, b);
    const approx = T1 / (b + 1) * (Math.pow(L + 0.5, b + 1) - Math.pow(F - 0.5, b + 1));
    return {
      brief: `First-unit cost is ${Kd(T1, 0)}, unit theory, ${pct(s, 0)} slope. Price the lot of units ${F} through ${L}: total lot cost and average unit cost.`,
      answers: [{ label: 'Lot cost', unit: '$K', value: sum }, { label: 'Average unit cost', unit: '$K', value: sum / Q }],
      explain: `$b = ${f(b, 4)}$. The midpoint approximation gives\n\n$$\\frac{T_1}{b+1}\\left[(L+\\tfrac12)^{b+1} - (F-\\tfrac12)^{b+1}\\right] = ${f(approx, 1)}$$\n\nThe exact sum of units ${F}–${L} is ${f(sum, 1)}, so the average unit cost is ${f(sum / Q, 2)}.`,
      inputs: { t1: T1, slope: s, first: F, qty: Q }
    };
  } });
  add({ id: 'lc-slope', module: 'm07', section: 'm07/process', title: 'Back out the learning slope',
    ins: { unit1: { label: 'Unit A', unit: '' }, hours1: { label: 'Hours for unit A', unit: 'hours' }, unit2: { label: 'Unit B', unit: '' }, hours2: { label: 'Hours for unit B', unit: 'hours' } },
    gen(h, tier) {
    const X1 = h.num(5, 20, 1), X2 = X1 * h.pick([2, 3, 4, 5]), Y1 = h.num(500, 2000, 10) * K[tier], s0 = h.pick([0.78, 0.82, 0.85, 0.88, 0.91, 0.94]);
    const Y2 = r1(Y1 * Math.pow(X2 / X1, lcB(s0)));
    const b = Math.log(Y2 / Y1) / Math.log(X2 / X1), s = Math.pow(2, b);
    return {
      brief: `Under unit theory, unit ${X1} took ${f(Y1, 0)} hours and unit ${X2} took ${f(Y2, 1)} hours. What learning curve slope (%) does that imply?`,
      answers: [{ label: 'Slope', unit: '%', value: s * 100 }],
      explain: `$$b = \\frac{\\ln(${Y2}/${Y1})}{\\ln(${X2}/${X1})} = ${f(b, 4)}, \\quad \\text{slope} = 2^{b} = ${f(s * 100, 2)}\\%$$`,
      inputs: { unit1: X1, hours1: Y1, unit2: X2, hours2: Y2 }
    };
  } });

  // ---- M8 Regression ----
  add({ id: 'reg-fit', module: 'm08', section: 'm08/fit', title: 'Fit a linear CER',
    ins: { xs: { label: 'X values', unit: '' }, ys: { label: 'Y values', unit: '$K' }, xNew: { label: 'X to predict', unit: '' } },
    gen(h, tier) {
    const x0 = h.num(1, 5, 1), st = h.num(1, 4, 1), a = h.num(10, 40, 1) * K[tier], b = h.num(2, 9, 0.5) * K[tier];
    const X = [0, 1, 2, 3, 4].map(i => x0 + i * st), Y = X.map(x => r1(a + b * x + h.num(-3, 3, 0.5) * K[tier]));
    const n = 5, mx = X.reduce((s, v) => s + v, 0) / n, my = Y.reduce((s, v) => s + v, 0) / n;
    const sxy = X.reduce((s, x, i) => s + (x - mx) * (Y[i] - my), 0), sxx = X.reduce((s, x) => s + (x - mx) * (x - mx), 0);
    const bh = sxy / sxx, ah = my - bh * mx, xp = X[4] + st, yp = ah + bh * xp;
    return {
      brief: `Fit $Y = a + bX$ by least squares to these points and predict $Y$ at $X = ${xp}$.\n\n| X | ${X.join(' | ')} |\n|---|${X.map(() => '---').join('|')}|\n| Y (\\$K) | ${Y.join(' | ')} |`,
      answers: [{ label: 'Slope b', unit: '$K per X', value: bh }, { label: `Prediction at X = ${xp}`, unit: '$K', value: yp }],
      explain: `$$\\bar X = ${f(mx, 3)},\\ \\bar Y = ${f(my, 3)},\\ b = \\frac{\\sum(X-\\bar X)(Y-\\bar Y)}{\\sum (X-\\bar X)^2} = \\frac{${f(sxy, 3)}}{${f(sxx, 3)}} = ${f(bh, 4)}$$\n\n$$a = \\bar Y - b\\bar X = ${f(ah, 3)}, \\quad \\hat Y(${xp}) = ${f(yp, 3)}$$`,
      inputs: { xs: X.slice(), ys: Y.slice(), xNew: xp }
    };
  } });

  // ---- M9 Risk ----
  add({ id: 'tri-stats', module: 'm09', section: 'm09/triangular', title: 'Triangular distribution statistics',
    ins: { low: { label: 'Low', unit: '$M' }, mode: { label: 'Most likely', unit: '$M' }, high: { label: 'High', unit: '$M' } },
    gen(h, tier) {
    const L = h.num(5, 20, 0.5) * K[tier], Mo = L + h.num(1, 10, 0.5) * K[tier], H = Mo + h.num(2, 25, 0.5) * K[tier];
    const mean = (L + Mo + H) / 3, sd = Math.sqrt((L * L + Mo * Mo + H * H - L * Mo - L * H - Mo * H) / 18);
    return {
      brief: `An element's cost is triangular with low ${M(L, 1)}, most likely ${M(Mo, 1)} and high ${M(H, 1)}. Find the mean and standard deviation.`,
      answers: [{ label: 'Mean', unit: '$M', value: mean }, { label: 'Standard deviation', unit: '$M', value: sd }],
      explain: `$$\\mu = \\frac{L+M+H}{3} = ${f(mean, 3)}, \\quad \\sigma = \\sqrt{\\frac{L^2+M^2+H^2-LM-LH-MH}{18}} = ${f(sd, 3)}$$\n\nThe mean sits above the mode because the high tail is longer.`,
      inputs: { low: L, mode: Mo, high: H }
    };
  } });
  add({ id: 'risk-sum', module: 'm09', section: 'm09/summing', title: 'Roll up WBS risk',
    ins: { means: { label: 'Element means', unit: '$M' }, sds: { label: 'Element std devs', unit: '$M' }, correlated: { label: 'Perfectly correlated? (1 = yes)', unit: 'flag' } },
    gen(h, tier) {
    const mu = [0, 1, 2].map(() => h.num(10, 60, 1) * K[tier]), sd = mu.map(m => r1(m * h.num(0.1, 0.35, 0.05)));
    const corr = tier >= 2, tm = mu.reduce((s, v) => s + v, 0), ts = corr ? sd.reduce((s, v) => s + v, 0) : Math.sqrt(sd.reduce((s, v) => s + v * v, 0));
    return {
      brief: `Three WBS elements have means ${mu.map(v => M(v, 0)).join(', ')} and standard deviations ${sd.map(v => M(v, 1)).join(', ')}. Treat them as ${corr ? '**perfectly correlated** (ρ = 1)' : '**independent**'}. Find the total mean and total standard deviation.`,
      answers: [{ label: 'Total mean', unit: '$M', value: tm }, { label: 'Total standard deviation', unit: '$M', value: ts }],
      explain: corr
        ? `Means always add: ${f(tm, 1)}. With $\\rho = 1$ standard deviations add too: $\\sigma = ${sd.join(' + ')} = ${f(ts, 3)}$.`
        : `Means add: ${f(tm, 1)}. Independent variances add: $\\sigma = \\sqrt{${sd.map(v => v + '^2').join(' + ')}} = ${f(ts, 3)}$. Ignoring positive correlation like this understates risk.`,
      inputs: { means: mu.slice(), sds: sd.slice(), correlated: corr ? 1 : 0 }
    };
  } });

  // ---- M10 Probability ----
  add({ id: 'normal-prob', module: 'm10', section: 'm10/distributions-basic', title: 'Confidence of a budget',
    ins: { mean: { label: 'Mean', unit: '$M' }, sd: { label: 'Std deviation', unit: '$M' }, budget: { label: 'Budget', unit: '$M' } },
    gen(h, tier) {
    const mu = h.num(50, 200, 1) * K[tier], sg = r1(mu * h.num(0.08, 0.25, 0.01)), z0 = h.pick([-1, -0.5, 0.5, 1, 1.5, 2]), B = r1(mu + z0 * sg);
    const z = (B - mu) / sg, p = phi(z) * 100;
    return {
      brief: `Total cost is normally distributed with mean ${M(mu, 0)} and standard deviation ${M(sg, 1)}. The budget is ${M(B, 1)}. What is the probability (%) that cost comes in at or under budget?`,
      answers: [{ label: 'Probability', unit: '%', value: p }],
      explain: `$$z = \\frac{${B} - ${mu}}{${sg}} = ${f(z, 3)}, \\quad P(C \\le B) = \\Phi(z) = ${f(p, 2)}\\%$$`,
      inputs: { mean: mu, sd: sg, budget: B }
    };
  } });
  add({ id: 'expected-value', module: 'm10', section: 'm10/intro', title: 'Expected cost of outcomes',
    ins: { probs: { label: 'Outcome probabilities', unit: '' }, costs: { label: 'Outcome costs', unit: '$M' } },
    gen(h, tier) {
    const p1 = h.pick([0.1, 0.2, 0.25, 0.3]), p2 = h.pick([0.3, 0.4, 0.5]), p3 = r2(1 - p1 - p2);
    const c = [h.num(10, 30, 1), h.num(30, 60, 1), h.num(60, 120, 1)].map(v => v * K[tier]);
    const ev = p1 * c[0] + p2 * c[1] + p3 * c[2];
    return {
      brief: `A test program has three outcomes: pass first time (p = ${p1}, cost ${M(c[0], 0)}), one retest (p = ${p2}, cost ${M(c[1], 0)}), or redesign (p = ${p3}, cost ${M(c[2], 0)}). What is the expected cost?`,
      answers: [{ label: 'Expected cost', unit: '$M', value: ev }],
      explain: `$$E[C] = ${p1}(${c[0]}) + ${p2}(${c[1]}) + ${p3}(${c[2]}) = ${f(ev, 3)}$$`,
      inputs: { probs: [p1, p2, p3], costs: c.slice() }
    };
  } });

  // ---- M11 Manufacturing ----
  add({ id: 'mfg-labor', module: 'm11', section: 'm11/standards', title: 'Labor from standards',
    ins: { stdHours: { label: 'Standard hours per unit', unit: 'hours' }, qty: { label: 'Units', unit: '' }, realization: { label: 'Realization factor', unit: '' }, rate: { label: 'Wrap rate', unit: '$/hour' } },
    gen(h, tier) {
    const S = h.num(20, 120, 1), Q = h.num(10, 80, 1) * K[tier], R = h.num(1.1, 1.8, 0.05), W = h.num(90, 180, 1);
    const hrs = S * Q * R, cost = hrs * W / 1000;
    return {
      brief: `Each unit has ${S} standard hours. You are building ${Q} units with a realization factor of ${R}. The fully burdened (wrap) rate is \\$${W}/hour. Find the expected hours and labor cost.`,
      answers: [{ label: 'Expected hours', unit: 'hours', value: hrs }, { label: 'Labor cost', unit: '$K', value: cost }],
      explain: `$$\\text{Hours} = ${S} \\times ${Q} \\times ${R} = ${f(hrs, 1)}, \\quad \\text{Cost} = ${f(hrs, 1)} \\times ${W} / 1000 = ${f(cost, 2)}\\ \\text{\\$K}$$`,
      inputs: { stdHours: S, qty: Q, realization: R, rate: W }
    };
  } });
  add({ id: 'make-buy', module: 'm11', section: 'm11/makebuy', title: 'Make-or-buy break-even',
    ins: { tooling: { label: 'Tooling', unit: '$K' }, makeUnit: { label: 'Make cost per unit', unit: '$' }, buyUnit: { label: 'Buy price per unit', unit: '$' } },
    gen(h, tier) {
    const F = h.num(50, 400, 10) * K[tier], v = h.num(20, 120, 1), p = v + h.num(10, 80, 1);
    const q = F * 1000 / (p - v);
    return {
      brief: `Making a part in house needs ${Kd(F, 0)} of tooling plus \\$${v} per unit. A supplier charges \\$${p} per unit. At what quantity do the two options cost the same?`,
      answers: [{ label: 'Break-even quantity', unit: 'units', value: q }],
      explain: `$$Q^* = \\frac{\\text{Fixed}}{p_{buy} - v_{make}} = \\frac{${F * 1000}}{${p} - ${v}} = ${f(q, 1)}$$\n\nAbove this quantity, making is cheaper.`,
      inputs: { tooling: F, makeUnit: v, buyUnit: p }
    };
  } });

  // ---- M12 Software ----
  add({ id: 'sw-effort', module: 'm12', section: 'm12/parametric', title: 'Software effort and cost',
    ins: { a: { label: 'Coefficient A', unit: '' }, b: { label: 'Exponent B', unit: '' }, ksloc: { label: 'Size', unit: 'KSLOC' }, rate: { label: 'Cost per person-month', unit: '$K' } },
    gen(h, tier) {
    const A = h.pick([2.4, 2.94, 3.0, 3.2]), B = h.pick([1.05, 1.08, 1.1, 1.12, 1.15]), S = h.num(10, 120, 1) * K[tier], rate = h.num(15, 25, 0.5);
    const E = A * Math.pow(S, B), cost = E * rate / 1000;
    return {
      brief: `Use the effort model $E = ${A} \\times \\text{KSLOC}^{${B}}$ (person-months). The program is ${f(S, 0)} KSLOC and labor costs ${Kd(rate)} per person-month. Find effort and cost.`,
      answers: [{ label: 'Effort', unit: 'PM', value: E }, { label: 'Cost', unit: '$M', value: cost }],
      explain: `$$E = ${A} \\times ${S}^{${B}} = ${f(E, 1)}\\ \\text{PM}, \\quad \\text{Cost} = ${f(E, 1)} \\times ${rate} / 1000 = ${f(cost, 3)}$$\n\nAn exponent above 1 is a diseconomy of scale: bigger programs cost more per line.`,
      inputs: { a: A, b: B, ksloc: S, rate }
    };
  } });

  // ---- M13 Economic analysis ----
  add({ id: 'npv', module: 'm13', section: 'm13/discounting', title: 'Net present value',
    ins: { invest: { label: 'Up-front cost', unit: '$K' }, flows: { label: 'Savings, years 1-5', unit: '$K' }, rate: { label: 'Discount rate', unit: '%' } },
    gen(h, tier) {
    let I, A, r, v;
    for (let tries = 0; tries < 50; tries++) {
      I = h.num(100, 500, 10) * K[tier]; r = h.pick([0.03, 0.05, 0.07, 0.1]);
      A = [1, 2, 3, 4, 5].map(() => h.num(20, 150, 5) * K[tier]);
      v = -I + A.reduce((s, a, t) => s + a / Math.pow(1 + r, t + 1), 0);
      if (Math.abs(v) >= 0.1 * I) break;
    }
    if (Math.abs(v) < 0.1 * I) { I = Math.round(I / 2); v = -I + A.reduce((s, a, t) => s + a / Math.pow(1 + r, t + 1), 0); }
    return {
      brief: `An upgrade costs ${Kd(I, 0)} now and saves ${A.map(a => Kd(a, 0)).join(', ')} at the end of years 1–5. At a ${pct(r, 0)} discount rate, what is the NPV?`,
      answers: [{ label: 'NPV', unit: '$K', value: v }],
      explain: `$$NPV = -${I} + ${A.map((a, t) => `\\frac{${a}}{${1 + r}^{${t + 1}}}`).join(' + ')} = ${f(v, 2)}$$\n\n${v > 0 ? 'Positive: the upgrade pays for itself.' : 'Negative: the savings do not justify the cost at this rate.'}`,
      inputs: { invest: I, flows: A.slice(), rate: r }
    };
  } });
  add({ id: 'pv-annuity', module: 'm13', section: 'm13/comparison', title: 'Present value of a level cost stream',
    ins: { amount: { label: 'Cost per year', unit: '$K' }, years: { label: 'Years', unit: 'yr' }, rate: { label: 'Discount rate', unit: '%' } },
    gen(h, tier) {
    const A = h.num(20, 200, 5) * K[tier], n = h.num(5, 20, 1), r = h.pick([0.02, 0.03, 0.05, 0.07]);
    const pv = A * (1 - Math.pow(1 + r, -n)) / r;
    return {
      brief: `Operating and support costs are ${Kd(A, 0)} per year for ${n} years, paid at year end. Discount at ${pct(r, 0)}. What is their present value?`,
      answers: [{ label: 'Present value', unit: '$K', value: pv }],
      explain: `$$PV = A \\cdot \\frac{1-(1+r)^{-n}}{r} = ${A} \\times \\frac{1-${1 + r}^{-${n}}}{${r}} = ${f(pv, 2)}$$`,
      inputs: { amount: A, years: n, rate: r }
    };
  } });

  // ---- M14 Contract pricing ----
  const SHARES = [[80, 20], [70, 30], [75, 25], [85, 15]];
  add({ id: 'cpif-fee', module: 'm14', section: 'm14/cpif', title: 'CPIF fee settlement',
    ins: { targetCost: { label: 'Target cost', unit: '$M' }, targetFee: { label: 'Target fee', unit: '$M' }, govShare: { label: 'Govt share', unit: '%' }, conShare: { label: 'Contractor share', unit: '%' }, minFee: { label: 'Minimum fee', unit: '$M' }, maxFee: { label: 'Maximum fee', unit: '$M' }, actual: { label: 'Actual cost', unit: '$M' } },
    gen(h, tier) {
    const TC = h.num(50, 200, 1) * K[tier], TF = r2(TC * h.pick([0.06, 0.07, 0.08])), [g, c] = h.pick(SHARES);
    const mn = r2(TC * h.pick([0.02, 0.03])), mx = r2(TC * h.pick([0.1, 0.12])), AC = r2(TC * (1 + h.num(-0.25, 0.25, 0.01)));
    const raw = TF + c / 100 * (TC - AC), fee = Math.min(mx, Math.max(mn, raw));
    return {
      brief: `CPIF contract: target cost ${M(TC, 2)}, target fee ${M(TF)}, share ratio ${g}/${c} (Govt/Contractor), minimum fee ${M(mn)}, maximum fee ${M(mx)}. Actual cost is ${M(AC)}. Find the fee earned and the total the government pays.`,
      answers: [{ label: 'Fee', unit: '$M', value: fee }, { label: 'Total price', unit: '$M', value: AC + fee }],
      explain: `$$\\text{Fee} = TF + ${c / 100}\\,(TC - AC) = ${TF} + ${c / 100}(${TC} - ${AC}) = ${f(raw, 3)}$$\n\n${raw > mx ? `Capped at the maximum fee, ${mx}.` : raw < mn ? `Raised to the minimum fee, ${mn}.` : 'Within the fee limits.'} Total $= AC + \\text{Fee} = ${f(AC + fee, 3)}$.`,
      inputs: { targetCost: TC, targetFee: TF, govShare: g / 100, conShare: c / 100, minFee: mn, maxFee: mx, actual: AC }
    };
  } });
  add({ id: 'fpif-pta', module: 'm14', section: 'm14/fpif', title: 'FPIF price and PTA',
    ins: { targetCost: { label: 'Target cost', unit: '$M' }, targetProfit: { label: 'Target profit', unit: '$M' }, ceiling: { label: 'Ceiling price', unit: '$M' }, govShare: { label: 'Govt share', unit: '%' }, conShare: { label: 'Contractor share', unit: '%' }, actual: { label: 'Actual cost', unit: '$M' } },
    gen(h, tier) {
    const TC = h.num(50, 200, 1) * K[tier], TP = r2(TC * h.pick([0.08, 0.1, 0.12])), CP = r2((TC + TP) * h.pick([1.1, 1.15, 1.2, 1.25])), [g, c] = h.pick(SHARES);
    const AC = r2(TC * (1 + h.num(-0.15, 0.3, 0.01)));
    const pta = TC + (CP - (TC + TP)) / (g / 100), profit = TP + c / 100 * (TC - AC), price = Math.min(CP, AC + profit);
    return {
      brief: `FPIF contract: target cost ${M(TC, 2)}, target profit ${M(TP)}, ceiling price ${M(CP)}, share ${g}/${c} (Govt/Contractor). Actual cost is ${M(AC)}. Find the point of total assumption and the final price.`,
      answers: [{ label: 'PTA', unit: '$M', value: pta }, { label: 'Final price', unit: '$M', value: price }],
      explain: `$$PTA = TC + \\frac{CP - \\text{Target price}}{\\text{Govt share}} = ${TC} + \\frac{${CP} - ${f(TC + TP, 2)}}{${g / 100}} = ${f(pta, 3)}$$\n\n$$\\text{Profit} = ${TP} + ${c / 100}(${TC} - ${AC}) = ${f(profit, 3)}, \\quad \\text{Price} = \\min(CP,\\ AC + \\text{Profit}) = ${f(price, 3)}$$`,
      inputs: { targetCost: TC, targetProfit: TP, ceiling: CP, govShare: g / 100, conShare: c / 100, actual: AC }
    };
  } });

  // ---- M15 EVM ----
  function evmInputs(h, tier) {
    const BAC = h.num(20, 200, 1) * K[tier], EV = r2(BAC * h.num(0.2, 0.7, 0.01)), PV = r2(EV * h.num(0.85, 1.15, 0.01)), AC = r2(EV * h.num(0.9, 1.3, 0.01));
    return { BAC, EV, PV, AC, CPI: EV / AC, SPI: EV / PV };
  }
  add({ id: 'evm-eac', module: 'm15', section: 'm15/eac', title: 'Forecast at completion',
    ins: { bac: { label: 'BAC', unit: '$M' }, pv: { label: 'PV', unit: '$M' }, ev: { label: 'EV', unit: '$M' }, ac: { label: 'AC', unit: '$M' }, composite: { label: 'Composite EAC? (1 = yes)', unit: 'flag' } },
    gen(h, tier) {
    const e = evmInputs(h, tier), comp = tier >= 2;
    const eac = comp ? e.AC + (e.BAC - e.EV) / (e.CPI * e.SPI) : e.BAC / e.CPI;
    return {
      brief: `BAC ${M(e.BAC, 0)}. To date: PV ${M(e.PV)}, EV ${M(e.EV)}, AC ${M(e.AC)}. Find the CPI and the ${comp ? '**composite (CPI × SPI)**' : '**CPI-based**'} EAC.`,
      answers: [{ label: 'CPI', unit: '', value: e.CPI }, { label: 'EAC', unit: '$M', value: eac }],
      explain: `$$CPI = \\frac{EV}{AC} = ${f(e.CPI, 4)}${comp ? `,\\ SPI = \\frac{EV}{PV} = ${f(e.SPI, 4)}` : ''}$$\n\n$$EAC = ${comp ? `AC + \\frac{BAC - EV}{CPI \\times SPI}` : `\\frac{BAC}{CPI}`} = ${f(eac, 3)}$$`,
      inputs: { bac: e.BAC, pv: e.PV, ev: e.EV, ac: e.AC, composite: comp ? 1 : 0 }
    };
  } });
  add({ id: 'evm-tcpi', module: 'm15', section: 'm15/tcpi', title: 'Efficiency needed to finish on budget',
    ins: { bac: { label: 'BAC', unit: '$M' }, ev: { label: 'EV', unit: '$M' }, ac: { label: 'AC', unit: '$M' } },
    gen(h, tier) {
    const e = evmInputs(h, tier), tcpi = (e.BAC - e.EV) / (e.BAC - e.AC), eac = e.BAC / e.CPI;
    return {
      brief: `BAC ${M(e.BAC, 0)}, EV ${M(e.EV)}, AC ${M(e.AC)}. Find the TCPI needed to finish at BAC, and the estimate to complete (ETC) if the current CPI continues.`,
      answers: [{ label: 'TCPI (BAC)', unit: '', value: tcpi }, { label: 'ETC', unit: '$M', value: eac - e.AC }],
      explain: `$$TCPI = \\frac{BAC - EV}{BAC - AC} = \\frac{${f(e.BAC - e.EV, 2)}}{${f(e.BAC - e.AC, 2)}} = ${f(tcpi, 4)}$$\n\n$$ETC = \\frac{BAC}{CPI} - AC = ${f(eac, 3)} - ${e.AC} = ${f(eac - e.AC, 3)}$$\n\n${tcpi > 1.1 ? 'A TCPI well above the current CPI is rarely achieved.' : ''}`,
      inputs: { bac: e.BAC, ev: e.EV, ac: e.AC }
    };
  } });

  // ---- M16 Cost management ----
  add({ id: 'abc-cost', module: 'm16', section: 'm16/abc-allocation', title: 'Activity-based costing',
    ins: { setupPool: { label: 'Setup cost pool', unit: '$K' }, setups: { label: 'Total setups', unit: '' }, inspPool: { label: 'Inspection cost pool', unit: '$K' }, inspections: { label: 'Total inspections', unit: '' }, aSetups: { label: 'Product A setups', unit: '' }, aInsp: { label: 'Product A inspections', unit: '' } },
    gen(h, tier) {
    const P1 = h.num(100, 600, 10) * K[tier], D1 = h.num(200, 2000, 50), P2 = h.num(50, 400, 10) * K[tier], D2 = h.num(100, 1000, 25);
    const u1 = h.num(10, Math.round(D1 / 4), 5), u2 = h.num(5, Math.round(D2 / 4), 5);
    const rt1 = P1 / D1, cost = rt1 * u1 + P2 / D2 * u2;
    return {
      brief: `Machine setups cost ${Kd(P1, 0)} per year across ${D1} setups. Inspections cost ${Kd(P2, 0)} across ${D2} inspections. Product A uses ${u1} setups and ${u2} inspections. Find the setup rate and the overhead assigned to Product A.`,
      answers: [{ label: 'Setup rate', unit: '$K per setup', value: rt1 }, { label: 'Overhead for A', unit: '$K', value: cost }],
      explain: `$$\\text{Rates: } \\frac{${P1}}{${D1}} = ${f(rt1, 4)},\\ \\frac{${P2}}{${D2}} = ${f(P2 / D2, 4)} \\quad\\Rightarrow\\quad ${u1}(${f(rt1, 4)}) + ${u2}(${f(P2 / D2, 4)}) = ${f(cost, 3)}$$`,
      inputs: { setupPool: P1, setups: D1, inspPool: P2, inspections: D2, aSetups: u1, aInsp: u2 }
    };
  } });

  if (typeof module !== 'undefined' && module.exports) module.exports = T; else root.ShopTemplates = T;
})(this);
