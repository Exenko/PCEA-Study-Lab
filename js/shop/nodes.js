// Pipeline nodes: primitives (always available), tool nodes (need a tool) and domain nodes (earned). Pure functions.
(function (root) {
  const isL = Array.isArray;
  const num = (x, who) => { if (isL(x)) throw new Error(who + ' needs a number, not a list'); return x; };
  const list = x => isL(x) ? x : [x];
  // Wraps a scalar function so any argument may be a list; lists must have equal length.
  const bc = f => (...a) => {
    const ls = a.filter(isL);
    if (!ls.length) return f(...a);
    const n = ls[0].length;
    if (ls.some(l => l.length !== n)) throw new Error('List lengths differ');
    return Array.from({ length: n }, (_, i) => f(...a.map(x => isL(x) ? x[i] : x)));
  };
  const sum = x => list(x).reduce((s, v) => s + v, 0);
  const mean = x => sum(x) / list(x).length;
  const sdev = x => { const l = list(x), m = mean(l); return Math.sqrt(l.reduce((s, v) => s + (v - m) * (v - m), 0) / (l.length - 1)); };
  const slope = (xs, ys) => { const mx = mean(xs), my = mean(ys); let sxy = 0, sxx = 0; xs.forEach((x, i) => { sxy += (x - mx) * (ys[i] - my); sxx += (x - mx) * (x - mx); }); return sxy / sxx; };
  const erf = x => { const s = Math.sign(x); x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; };
  const P = (id, label, names, fn, hint) => ({ id, kind: 'primitive', label, ins: names.map(name => ({ name })), fn, hint });
  const D = (id, label, module, earnedFrom, ins, fn, hint) => ({ id, kind: 'domain', label, module, earnedFrom, ins: ins.map(s => s.endsWith('%') ? { name: s.slice(0, -1), pct: true } : { name: s }), fn, hint });

  const PRIMITIVE = [
    P('add', 'Add', ['a', 'b'], bc((a, b) => a + b), 'a + b'),
    P('sub', 'Subtract', ['a', 'b'], bc((a, b) => a - b), 'a - b'),
    P('mul', 'Multiply', ['a', 'b'], bc((a, b) => a * b), 'a x b'),
    P('div', 'Divide', ['a', 'b'], bc((a, b) => a / b), 'a / b'),
    P('pow', 'Power', ['base', 'exp'], bc((a, b) => Math.pow(a, b)), 'base ^ exp'),
    P('log', 'Log (ln)', ['x'], bc(Math.log), 'natural log'),
    P('log2', 'Log2', ['x'], bc(Math.log2), 'log base 2'),
    P('exp', 'Exp', ['x'], bc(Math.exp), 'e ^ x'),
    P('sqrt', 'Square root', ['x'], bc(Math.sqrt), 'square root'),
    P('min', 'Min', ['a', 'b'], bc(Math.min), 'smaller of a and b'),
    P('max', 'Max', ['a', 'b'], bc(Math.max), 'larger of a and b'),
    P('if', 'If', ['flag', 'then', 'else'], (c, a, b) => num(c, 'If') !== 0 ? a : b, 'then when flag is not 0, else otherwise'),
    P('range', 'Range', ['from', 'to'], (a, b) => {
      a = num(a, 'Range'); b = num(b, 'Range');
      if (!Number.isInteger(a) || !Number.isInteger(b) || b < a) throw new Error('Range needs whole numbers with from <= to');
      if (b - a + 1 > 1000) throw new Error('Range too long');
      return Array.from({ length: b - a + 1 }, (_, i) => a + i);
    }, 'list from, from+1, ..., to'),
    P('sum', 'Sum', ['list'], sum, 'add up a list'),
    P('mean', 'Mean', ['list'], mean, 'average of a list'),
    P('count', 'Count', ['list'], x => list(x).length, 'number of items')
  ];
  const TOOL = [
    { id: 'normalCDF', kind: 'tool', tool: 'tables', label: 'Normal CDF', ins: [{ name: 'z' }], fn: bc(z => 0.5 * (1 + erf(z / Math.SQRT2))), hint: 'P(Z <= z) from the reference tables' }
  ];
  const DOMAIN = [
    D('escalate', 'Escalate', 'm05', ['esc-compound'], ['cost', 'rate%', 'years'], bc((c, r, n) => c * Math.pow(1 + r, n)), 'cost x (1 + rate) ^ years'),
    D('indexConvert', 'Index convert', 'm05', ['esc-index'], ['cost', 'fromIdx', 'toIdx'], bc((c, f, t) => c * t / f), 'cost x toIdx / fromIdx'),
    D('powerCER', 'Power CER', 'm03', ['cer-power'], ['a', 'x', 'b'], bc((a, x, b) => a * Math.pow(x, b)), 'a x x ^ b'),
    D('stdDev', 'Std dev (sample)', 'm06', ['stats-cv'], ['list'], sdev, 'sample standard deviation'),
    D('cv', 'Coeff. of variation', 'm06', ['stats-cv'], ['list'], x => sdev(x) / mean(x), 'std dev / mean, as a fraction'),
    D('lcUnit', 'LC unit cost', 'm07', ['lc-unit'], ['t1', 'slope%', 'unit'], bc((t1, s, n) => t1 * Math.pow(n, Math.log2(s))), 'T1 x unit ^ log2(slope)'),
    D('lcLotTotal', 'LC lot total', 'm07', ['lc-lot'], ['t1', 'slope%', 'first', 'last'], (t1, s, f, l) => {
      t1 = num(t1, 'LC lot'); s = num(s, 'LC lot'); f = num(f, 'LC lot'); l = num(l, 'LC lot');
      if (l - f + 1 > 1000 || l < f) throw new Error('Lot range invalid');
      let t = 0; for (let x = f; x <= l; x++) t += t1 * Math.pow(x, Math.log2(s)); return t;
    }, 'sum of unit costs, first..last'),
    D('lcSlope', 'LC slope', 'm07', ['lc-slope'], ['unit1', 'hours1', 'unit2', 'hours2'], bc((x1, y1, x2, y2) => Math.pow(2, Math.log(y2 / y1) / Math.log(x2 / x1))), 'slope as a fraction'),
    D('linSlope', 'LS slope', 'm08', ['reg-fit'], ['xs', 'ys'], slope, 'least-squares slope b'),
    D('linIntercept', 'LS intercept', 'm08', ['reg-fit'], ['xs', 'ys'], (xs, ys) => mean(ys) - slope(xs, ys) * mean(xs), 'least-squares intercept a'),
    D('triMean', 'Triangular mean', 'm09', ['tri-stats'], ['low', 'mode', 'high'], bc((l, m, h) => (l + m + h) / 3), '(L + M + H) / 3'),
    D('triSD', 'Triangular std dev', 'm09', ['tri-stats'], ['low', 'mode', 'high'], bc((l, m, h) => Math.sqrt((l * l + m * m + h * h - l * m - l * h - m * h) / 18)), 'triangular standard deviation'),
    D('rss', 'Root sum square', 'm09', ['risk-sum'], ['list'], x => Math.sqrt(list(x).reduce((s, v) => s + v * v, 0)), 'sqrt of the sum of squares'),
    D('expectedValue', 'Expected value', 'm10', ['expected-value'], ['probs', 'values'], (p, v) => sum(bc((a, b) => a * b)(p, v)), 'sum of p x value'),
    D('breakEven', 'Break-even qty', 'm11', ['make-buy'], ['fixed', 'makeUnit', 'buyUnit'], bc((f, m, b) => f / (b - m)), 'fixed / (buy - make)'),
    D('npv', 'NPV', 'm13', ['npv'], ['invest', 'flows', 'rate%'], (i, fl, r) => sum(list(fl).map((a, t) => a / Math.pow(1 + num(r, 'NPV'), t + 1))) - num(i, 'NPV'), '-invest + sum of discounted flows'),
    D('annuityPV', 'Annuity PV', 'm13', ['pv-annuity'], ['amount', 'years', 'rate%'], bc((a, n, r) => a * (1 - Math.pow(1 + r, -n)) / r), 'PV of a level stream'),
    D('cpifFee', 'CPIF fee', 'm14', ['cpif-fee'], ['targetFee', 'targetCost', 'actual', 'conShare%', 'minFee', 'maxFee'], bc((tf, tc, ac, c, mn, mx) => Math.min(mx, Math.max(mn, tf + c * (tc - ac)))), 'target fee + share x underrun, clamped'),
    D('fpifPTA', 'FPIF PTA', 'm14', ['fpif-pta'], ['targetCost', 'targetProfit', 'ceiling', 'govShare%'], bc((tc, tp, cp, g) => tc + (cp - (tc + tp)) / g), 'point of total assumption'),
    D('cpi', 'CPI', 'm15', ['evm-eac'], ['ev', 'ac'], bc((ev, ac) => ev / ac), 'EV / AC'),
    D('spi', 'SPI', 'm15', ['evm-eac'], ['ev', 'pv'], bc((ev, pv) => ev / pv), 'EV / PV'),
    D('eacCPI', 'EAC (CPI)', 'm15', ['evm-eac'], ['bac', 'cpi'], bc((bac, c) => bac / c), 'BAC / CPI'),
    D('eacComposite', 'EAC (composite)', 'm15', ['evm-eac'], ['ac', 'bac', 'ev', 'cpi', 'spi'], bc((ac, bac, ev, c, s) => ac + (bac - ev) / (c * s)), 'AC + (BAC - EV) / (CPI x SPI)'),
    D('tcpi', 'TCPI', 'm15', ['evm-tcpi'], ['bac', 'ev', 'ac'], bc((bac, ev, ac) => (bac - ev) / (bac - ac)), '(BAC - EV) / (BAC - AC)'),
    D('abcRate', 'Activity rate', 'm16', ['abc-cost'], ['pool', 'drivers'], bc((p, d) => p / d), 'cost pool / driver count')
  ];
  const list_ = [...PRIMITIVE, ...TOOL, ...DOMAIN];
  const map = new Map(list_.map(n => [n.id, n]));
  const ShopNodes = { list: list_, byId: id => map.get(id), PRIMITIVE, DOMAIN, TOOL };
  if (typeof module !== 'undefined' && module.exports) module.exports = ShopNodes; else root.ShopNodes = ShopNodes;
})(this);
