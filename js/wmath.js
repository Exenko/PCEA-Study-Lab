// Pure math for widgets (no DOM). Loaded in the browser as WMath and in Node via require.
(function (root) {
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function randn(r) { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function mean(a) { return a.reduce((s, x) => s + x, 0) / a.length; }
  function sd(a) { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); }
  function quant(sorted, p) {
    const i = (sorted.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i);
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
  }
  function erf(x) {
    const t = 1 / (1 + 0.3275911 * Math.abs(x));
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return x >= 0 ? y : -y;
  }
  const Phi = z => 0.5 * (1 + erf(z / Math.SQRT2));
  function triInv(u, a, c, b) {
    if (b <= a) return a;
    const Fc = (c - a) / (b - a);
    return u < Fc ? a + Math.sqrt(u * (b - a) * (c - a)) : b - Math.sqrt((1 - u) * (b - a) * (b - c));
  }
  function ols(xs, ys) {
    const n = xs.length, mx = mean(xs), my = mean(ys);
    let sxx = 0, sxy = 0, sst = 0;
    for (let i = 0; i < n; i++) { sxx += (xs[i] - mx) ** 2; sxy += (xs[i] - mx) * (ys[i] - my); sst += (ys[i] - my) ** 2; }
    const b1 = sxy / sxx, b0 = my - b1 * mx;
    let sse = 0;
    const res = xs.map((x, i) => { const e = ys[i] - (b0 + b1 * x); sse += e * e; return e; });
    const ssr = sst - sse, df = n - 2, mse = sse / df, see = Math.sqrt(mse), seb1 = see / Math.sqrt(sxx);
    return { n, b0, b1, mx, my, sst, sse, ssr, r2: ssr / sst, see, cv: see / my, t: b1 / seb1, F: ssr / mse, res, sxx };
  }
  function lgamma(z) {
    const g = [676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z);
    z -= 1; let x = 0.99999999999980993;
    for (let i = 0; i < 8; i++) x += g[i] / (z + i + 1);
    const t = z + 7.5;
    return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
  }
  function cf(x, a, b) {
    let c = 1, d = 1 - (a + b) * x / (a + 1); d = 1 / (Math.abs(d) < 1e-30 ? 1e-30 : d); let h = d;
    for (let m = 1; m < 200; m++) {
      const m2 = 2 * m;
      let aa = m * (b - m) * x / ((a + m2 - 1) * (a + m2));
      d = 1 + aa * d; d = 1 / (Math.abs(d) < 1e-30 ? 1e-30 : d); c = 1 + aa / c; h *= d * c;
      aa = -(a + m) * (a + b + m) * x / ((a + m2) * (a + m2 + 1));
      d = 1 + aa * d; d = 1 / (Math.abs(d) < 1e-30 ? 1e-30 : d); c = 1 + aa / c;
      const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-10) break;
    }
    return h;
  }
  function ibeta(x, a, b) {
    if (x <= 0) return 0; if (x >= 1) return 1;
    const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b + lgamma(a + b) - lgamma(a) - lgamma(b));
    if (x < (a + 1) / (a + b + 2)) return front * cf(x, a, b) / a;
    return 1 - front * cf(1 - x, b, a) / b;
  }
  // Student t CDF for t >= 0 (callers pass |t|)
  function tcdf(t, df) { return 1 - 0.5 * ibeta(df / (df + t * t), df / 2, 0.5); }
  // Root of f on [lo, hi]; f(lo) and f(hi) must differ in sign, else NaN.
  function bisect(f, lo, hi, it = 80) {
    let flo = f(lo);
    if (flo === 0) return lo;
    if (flo * f(hi) > 0) return NaN;
    for (let i = 0; i < it; i++) {
      const mid = (lo + hi) / 2, fm = f(mid);
      if (fm === 0) return mid;
      if (fm * flo < 0) hi = mid; else { lo = mid; flo = fm; }
    }
    return (lo + hi) / 2;
  }
  const zinv = p => bisect(z => Phi(z) - p, -10, 10);
  const tinv = (p, df) => bisect(t => tcdf(t, df) - p, 0, 1000);

  // Present value of an investment at t=0 plus n annual costs c
  function pvCost(inv, c, n, r, mid) {
    let s = inv;
    for (let t = 1; t <= n; t++) s += c / Math.pow(1 + r, mid ? t - 0.5 : t);
    return s;
  }

  // EVM scenarios: plan completes at month 20
  const smooth = x => x <= 0 ? 0 : x >= 1 ? 1 : 3 * x * x - 2 * x * x * x;
  function evmAt(sc, bac, m) {
    const pv = bac * smooth(m / 20);
    let ev, ac;
    if (sc === 'track') { ev = pv; ac = pv; }
    else if (sc === 'late') { ev = bac * smooth(m / 24); ac = ev / 1.02; }
    else { ev = pv * 0.97; ac = ev / (1 - 0.0075 * m); }
    return { pv, ev, ac };
  }

  // Locked-in vs spent: x = % of program timeline (0-100). Illustrative curves.
  const LOCK_PHASES = ['Concept', 'Design & development', 'Production', 'Operations & support'];
  function lockin(x) {
    const committed = (1 - Math.exp(-x / 15)) / (1 - Math.exp(-100 / 15));
    const spent = Math.pow(x / 100, 2.2);
    const phase = x <= 10 ? 0 : x <= 35 ? 1 : x <= 60 ? 2 : 3;
    return { committed, spent, gap: committed - spent, phase };
  }

  // Method suitability by life-cycle phase (illustrative weights; order: analogy, parametric, build-up, actuals)
  const METHODS = ['Analogy', 'Parametric', 'Engineering build-up', 'Actuals'];
  const PHASES = ['Concept / MSA', 'Technology development', 'EMD', 'Production & deployment', 'Operations & support'];
  const METHOD_WEIGHTS = [
    [0.55, 0.40, 0.05, 0.00],
    [0.30, 0.55, 0.15, 0.00],
    [0.10, 0.45, 0.40, 0.05],
    [0.00, 0.15, 0.45, 0.40],
    [0.00, 0.25, 0.10, 0.65]
  ];

  // Normalization lab: truth T1 = 2 + 0.05*kg (BY2026 $M), recorded as lot-average TY$ in mixed units
  const NORM_B = Math.log(0.9) / Math.log(2), NORM_BY = 2026, NORM_R = 0.025;
  const NORM_RAW = [
    { kg: 120, y: 2014, q: 10, k: true, f: 1.03 }, { kg: 180, y: 2024, q: 3, k: false, f: 0.97 },
    { kg: 250, y: 2012, q: 25, k: false, f: 1.02 }, { kg: 300, y: 2019, q: 6, k: true, f: 0.99 },
    { kg: 380, y: 2016, q: 15, k: false, f: 1.04 }, { kg: 450, y: 2022, q: 40, k: false, f: 0.96 },
    { kg: 520, y: 2013, q: 4, k: true, f: 1.01 }, { kg: 600, y: 2020, q: 12, k: false, f: 0.98 }
  ];
  const NORM_DATA = NORM_RAW.map(d => {
    const t1 = (2 + 0.05 * d.kg) * d.f;
    const rec = t1 * Math.pow(d.q, NORM_B) / Math.pow(1 + NORM_R, NORM_BY - d.y) * (d.k ? 1000 : 1);
    return { kg: d.kg, y: d.y, q: d.q, k: d.k, rec: Math.round(rec * 100) / 100 };
  });
  function normalizeCost(d, o) {
    let c = d.rec;
    if (o.units && d.k) c /= 1000;
    if (o.infl) c *= Math.pow(1 + NORM_R, NORM_BY - d.y);
    if (o.qty) c /= Math.pow(d.q, NORM_B);
    return c;
  }

  // CI coverage simulation from N(mu, sigma)
  function ciSim(o) {
    const r = rng(o.seed), n = o.n, crit = o.method === 'z' ? zinv(1 - (1 - o.level) / 2) : tinv(1 - (1 - o.level) / 2, n - 1);
    const out = [];
    let hits = 0, hw = 0;
    for (let i = 0; i < o.k; i++) {
      const xs = []; for (let j = 0; j < n; j++) xs.push(o.mu + o.sigma * randn(r));
      const m = mean(xs), h = crit * sd(xs) / Math.sqrt(n), cov = m - h <= o.mu && o.mu <= m + h;
      if (cov) hits++;
      hw += h;
      out.push([m - h, m + h, cov]);
    }
    return { intervals: out, coverage: hits / o.k, halfWidth: hw / o.k, crit };
  }

  // Sum of correlated triangular elements (one-factor Gaussian copula)
  function mcSum(els, rho, N, seed) {
    const r = rng(seed), out = new Float64Array(N);
    for (let t = 0; t < N; t++) {
      const Z = randn(r); let s = 0;
      for (const e of els) {
        const z = Math.sqrt(rho) * Z + Math.sqrt(1 - rho) * randn(r);
        s += triInv(Phi(z), Math.min(e.a, e.c), e.c, Math.max(e.b, e.c));
      }
      out[t] = s;
    }
    return Array.from(out).sort((x, y) => x - y);
  }

  const WMath = { rng, randn, mean, sd, quant, erf, Phi, triInv, ols, tcdf, bisect, zinv, tinv, pvCost, evmAt, lockin, LOCK_PHASES, METHODS, PHASES, METHOD_WEIGHTS, NORM_DATA, normalizeCost, ciSim, mcSum };
  if (typeof module !== 'undefined' && module.exports) module.exports = WMath; else root.WMath = WMath;
})(typeof window !== 'undefined' ? window : this);
