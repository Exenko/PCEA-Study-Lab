// Interactive widgets. Use in content with  :::widget name [key=value ...] [lock=a,b]:::
const Widgets = (() => {
  const reg = {};
  const E = Render.el;
  const M = WMath;
  const { mean, sd, quant, ols } = M;
  const median = a => quant([...a].sort((x, y) => x - y), 0.5);
  const f2 = (v, d = 2) => (isFinite(v) ? Number(v).toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d }) : '—');
  const pct = (v, d = 1) => (isFinite(v) ? (v * 100).toFixed(d) + '%' : '—');
  const DEV = typeof location !== 'undefined' && /[?&]dev\b/.test(location.search);

  // ---------- widget handle: presets, locks, setters, published outputs ----------
  function handle(a) {
    const listeners = [];
    const w = {
      name: a.name, presets: a.presets, lock: new Set(a.lock), out: {}, setters: {},
      set(k, v) { if (w.setters[k]) w.setters[k](v); },
      setMany(o) { Object.keys(o).forEach(k => w.set(k, o[k])); },
      onUpdate(fn) { listeners.push(fn); },
      emit(out) { w.out = out; listeners.forEach(f => f(out)); }
    };
    return w;
  }
  function mount(box, argStr) {
    const a = Challenge.parseArgs(argStr);
    const w = box.w = handle(a);
    const fn = reg[a.name];
    if (!fn) { box.textContent = 'Unknown widget: ' + a.name; return w; }
    try { fn(box, w); } catch (e) { box.textContent = 'Widget error: ' + e.message; console.error(e); }
    return w;
  }
  function publish(box, out) {
    if (DEV && typeof WidgetMeta !== 'undefined') {
      const want = ((WidgetMeta[box.w.name] || {}).outputs || []).slice().sort().join();
      if (Object.keys(out).sort().join() !== want) console.warn('widget', box.w.name, 'published', Object.keys(out), 'manifest', want);
    }
    box.w.emit(out);
  }
  const preset = (box, k, d) => (k in box.w.presets ? box.w.presets[k] : d);

  // ---------- shared helpers ----------
  function controls(box, defs, onChange) {
    const w = box.w;
    const wrap = E('div', 'w-controls');
    const vals = {};
    defs.forEach(d => {
      const v0 = d.k in w.presets ? w.presets[d.k] : d.v;
      vals[d.k] = d.type === 'select' ? String(v0) : +v0;
      const lab = E('label', 'w-ctl');
      const name = E('span', 'w-ctl-name', d.label);
      const out = E('span', 'w-ctl-val');
      let inp;
      if (d.type === 'select') {
        inp = E('select');
        d.options.forEach(o => { const op = E('option', null, o[1]); op.value = o[0]; inp.appendChild(op); });
      } else {
        inp = E('input');
        inp.type = d.type || 'range';
        if (d.min != null) inp.min = d.min;
        if (d.max != null) inp.max = d.max;
        inp.step = d.step || 'any';
      }
      inp.value = vals[d.k];
      const show = () => { out.textContent = d.type === 'select' || d.type === 'number' ? '' : (d.fmt ? d.fmt(vals[d.k]) : vals[d.k]); };
      inp.addEventListener('input', () => {
        vals[d.k] = d.type === 'select' ? inp.value : parseFloat(inp.value);
        if (d.type !== 'select' && isNaN(vals[d.k])) return;
        show(); onChange(vals);
      });
      w.setters[d.k] = x => { vals[d.k] = d.type === 'select' ? String(x) : +x; inp.value = vals[d.k]; show(); onChange(vals); };
      if (w.lock.has(d.k)) lab.hidden = true;
      show();
      lab.append(name, inp, out);
      wrap.appendChild(lab);
    });
    box.appendChild(wrap);
    return vals;
  }
  function readout(box) {
    const r = E('div', 'w-readout');
    box.appendChild(r);
    return rows => {
      r.innerHTML = rows.map(([k, v, cls]) => `<div class="ro ${cls || ''}"><span>${Render.inline(k)}</span><b>${v}</b></div>`).join('');
    };
  }
  function title(box, t, sub) {
    box.appendChild(E('div', 'w-title', t + (sub ? `<span>${sub}</span>` : '')));
  }
  function legend(box, items) {
    box.appendChild(E('div', 'w-legend', items.map(([cls, t]) => `<span><i class="sw ${cls}"></i>${Render.inline(t)}</span>`).join('')));
  }

  // ======================================================================
  // M6: descriptive statistics lab
  reg['stats-lab'] = box => {
    title(box, 'Stats lab', 'edit the data and watch the statistics move');
    const presets = {
      'Freight (guide)': '229.70, 221.58, 244.94, 250.66',
      'Practice Q1': '12, 15, 18, 15, 22, 15, 19',
      'Right-skewed': '3, 4, 4, 5, 5, 5, 6, 6, 7, 9, 12, 18',
      'With outlier': '48, 50, 51, 49, 52, 50, 47, 53, 51, 50, 49, 95'
    };
    const bar = E('div', 'w-presets');
    const ta = E('textarea', 'w-data'); ta.rows = 2; ta.value = String(preset(box, 'data', presets['Practice Q1'])).replace(/,(?=\S)/g, ', ');
    Object.keys(presets).forEach(k => { const b = E('button', 'chip', k); b.onclick = () => { ta.value = presets[k]; draw(); }; bar.appendChild(b); });
    box.append(bar, ta);
    const plotBox = E('div'); box.appendChild(plotBox);
    const ro = readout(box);
    legend(box, [['c1', 'mean'], ['c2', 'median'], ['band', 'mean ± 2s']]);
    function draw() {
      const a = ta.value.split(/[\s,;]+/).map(parseFloat).filter(isFinite);
      plotBox.innerHTML = '';
      if (a.length < 2) { ro([['Need at least 2 numbers', '']]); publish(box, { n: a.length, mean: NaN, median: NaN, sd: NaN, cv: NaN, beyond2: NaN }); return; }
      const s = [...a].sort((x, y) => x - y);
      const m = mean(a), med = quant(s, 0.5), sdev = sd(a), cv = sdev / m;
      const counts = {}; a.forEach(x => counts[x] = (counts[x] || 0) + 1);
      const maxc = Math.max(...Object.values(counts));
      const modes = maxc > 1 ? Object.keys(counts).filter(k => counts[k] === maxc).join(', ') : 'none';
      const lo = Math.min(s[0], m - 2.2 * sdev), hi = Math.max(s[s.length - 1], m + 2.2 * sdev);
      const p = Plot.create(plotBox, { h: 170, xmin: lo, xmax: hi, ymin: 0, ymax: maxc + 1, yticks: 2, xlabel: 'value', pad: { l: 20, r: 16, t: 10, b: 40 } });
      p.rect(m - 2 * sdev, 0, m + 2 * sdev, maxc + 1, 'band');
      p.axes();
      const stack = {};
      a.forEach(x => {
        stack[x] = (stack[x] || 0) + 1;
        const z = Math.abs(x - m) / sdev;
        p.dot(x, stack[x] - 0.4, z > 3 ? 'pt bad' : z > 2 ? 'pt warn' : 'pt', 6);
      });
      p.vline(m, 'marker c1'); p.vline(med, 'marker c2');
      const skew = Math.abs(m - med) < 0.02 * sdev ? 'about symmetric' : m > med ? 'right-skewed (mean > median)' : 'left-skewed (mean < median)';
      ro([
        ['n', a.length], ['Mean $\\bar{x}$', f2(m)], ['Median', f2(med)], ['Mode', modes],
        ['Std dev $s$', f2(sdev)], ['Variance $s^2$', f2(sdev * sdev)],
        ['CV', pct(cv), cv < 0.15 ? 'good' : 'bad'], ['Shape', skew],
        ['Beyond 2s', a.filter(x => Math.abs(x - m) > 2 * sdev).length], ['Beyond 3s', a.filter(x => Math.abs(x - m) > 3 * sdev).length]
      ]);
      publish(box, { n: a.length, mean: m, median: med, sd: sdev, cv, beyond2: a.filter(x => Math.abs(x - m) > 2 * sdev).length });
    }
    box.w.setters.data = s => { ta.value = String(s).replace(/,(?=\S)/g, ', '); draw(); };
    ta.oninput = draw; draw();
  };

  // M6/M8: transformations
  reg['transform'] = box => {
    title(box, 'Straighten the curve', 'pick a function, then look at it in transformed space');
    const row = E('div', 'w-2col'); const L = E('div'), R = E('div'); row.append(L, R);
    const v = controls(box, [
      { k: 'f', label: 'Function', type: 'select', v: 'power', options: [['linear', 'Linear  y = a + bx'], ['power', 'Power  y = a·x^b'], ['exp', 'Exponential  y = a·e^(bx)']] },
      { k: 'a', label: 'a', min: 1, max: 20, step: 0.5, v: 10 },
      { k: 'b', label: 'b', min: -1, max: 1.5, step: 0.05, v: 0.6 }
    ], draw);
    box.appendChild(row);
    const note = E('div', 'w-note'); box.appendChild(note);
    const xs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20];
    const rnd = M.rng(7);
    const noise = xs.map(() => 1 + 0.05 * M.randn(rnd));
    function draw() {
      L.innerHTML = ''; R.innerHTML = '';
      const f = v.f === 'linear' ? x => v.a + v.b * x : v.f === 'power' ? x => v.a * Math.pow(x, v.b) : x => v.a * Math.exp(v.b * x / 5);
      const ys = xs.map((x, i) => f(x) * noise[i]);
      const ymax = Math.max(...ys) * 1.1, ymin = Math.min(0, Math.min(...ys) * 1.1);
      const p1 = Plot.create(L, { w: 300, h: 230, xmin: 0, xmax: 21, ymin, ymax, xlabel: 'x (unit space)', ylabel: 'y' });
      p1.axes(); xs.forEach((x, i) => p1.dot(x, ys[i]));
      const tx = v.f === 'power' ? Math.log : x => x;
      const ty = v.f === 'linear' ? y => y : y => Math.log(y);
      const T = xs.map((x, i) => [tx(x), ty(ys[i])]).filter(q => isFinite(q[1]));
      const X = T.map(q => q[0]), Y = T.map(q => q[1]);
      const pad = (lo, hi) => [lo - 0.08 * (hi - lo || 1), hi + 0.08 * (hi - lo || 1)];
      const [x0, x1] = pad(Math.min(...X), Math.max(...X)), [y0, y1] = pad(Math.min(...Y), Math.max(...Y));
      const lbl = v.f === 'power' ? ['ln x', 'ln y', 'log-log'] : v.f === 'exp' ? ['x', 'ln y', 'semi-log'] : ['x', 'y', 'unit'];
      const p2 = Plot.create(R, { w: 300, h: 230, xmin: x0, xmax: x1, ymin: y0, ymax: y1, xlabel: lbl[0] + ' (' + lbl[2] + ' space)', ylabel: lbl[1] });
      p2.axes(); T.forEach(q => p2.dot(q[0], q[1], 'pt alt'));
      const fit = ols(X, Y);
      p2.fn(x => fit.b0 + fit.b1 * x, 'series c2');
      const back = v.f === 'linear' ? `a = ${f2(fit.b0)}, b = ${f2(fit.b1, 3)}` : `a = e^${f2(fit.b0, 3)} = ${f2(Math.exp(fit.b0))}, b = ${f2(v.f === 'exp' ? fit.b1 * 5 : fit.b1, 3)}`;
      note.innerHTML = Render.inline(`Fit in ${lbl[2]} space: slope ${f2(fit.b1, 3)}, intercept ${f2(fit.b0, 3)}, $R^2$ = ${f2(fit.r2, 3)}. Transformed back: ${back}.`);
      publish(box, { r2: fit.r2, slope: fit.b1, intercept: fit.b0 });
    }
    draw();
  };

  // ======================================================================
  // M7: learning curve explorer
  reg['lc-explorer'] = box => {
    title(box, 'Learning curve explorer');
    const v = controls(box, [
      { k: 'theory', label: 'Theory', type: 'select', v: 'ulc', options: [['ulc', 'Unit (Crawford)'], ['cum', 'Cum. average (Wright)']] },
      { k: 't1', label: 'T1', min: 10, max: 1000, step: 10, v: 100 },
      { k: 'lcs', label: 'LCS', min: 0.7, max: 0.99, step: 0.005, v: 0.85, fmt: x => (x * 100).toFixed(1) + '%' },
      { k: 'n', label: 'Units N', min: 4, max: 200, step: 1, v: 32 },
      { k: 'log', label: 'Axes', type: 'select', v: 'unit', options: [['unit', 'Unit space'], ['log', 'Log-log space']] }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    legend(box, [['c1', 'unit cost $Y_x$'], ['c2', 'cumulative average']]);
    const ro = readout(box);
    function draw() {
      pb.innerHTML = '';
      const b = Math.log(v.lcs) / Math.log(2), a = v.t1, N = v.n;
      const unit = [], cav = [];
      let sum = 0;
      for (let x = 1; x <= N; x++) {
        let u, c;
        if (v.theory === 'ulc') { u = a * Math.pow(x, b); sum += u; c = sum / x; }
        else { c = a * Math.pow(x, b); u = x * c - (x - 1) * (x > 1 ? a * Math.pow(x - 1, b) : 0); sum = x * c; }
        unit.push([x, u]); cav.push([x, c]);
      }
      const lg = v.log === 'log';
      const tr = pts => lg ? pts.map(([x, y]) => [Math.log(x), Math.log(y)]) : pts;
      const U = tr(unit), C = tr(cav);
      const ys = U.concat(C).map(q => q[1]);
      const p = Plot.create(pb, {
        xmin: lg ? 0 : 0, xmax: lg ? Math.log(N) * 1.02 : N + 1, ymin: lg ? Math.min(...ys) - 0.1 : 0, ymax: lg ? Math.max(...ys) + 0.1 : a * 1.05,
        xlabel: lg ? 'ln(unit number)' : 'unit number', ylabel: lg ? 'ln(cost)' : 'cost'
      });
      p.axes();
      p.line(U, 'series c1'); p.line(C, 'series c2');
      for (let x = 1; x <= N; x *= 2) { const q = tr([unit[x - 1]])[0]; p.dot(q[0], q[1], 'pt small c1', 3.5); }
      const doubling = [];
      for (let x = 1; x * 2 <= N; x *= 2) doubling.push(`${x}→${x * 2}: ${pct(unit[x * 2 - 1][1] / unit[x - 1][1])}`);
      ro([
        ['$b = \\ln(LCS)/\\ln 2$', f2(b, 4)],
        [`Unit ${N} cost`, f2(unit[N - 1][1])],
        [`Cum. avg through ${N}`, f2(cav[N - 1][1])],
        [`Total cost units 1–${N}`, f2(sum)],
        ['Unit-cost ratio at doublings', doubling.slice(0, 4).join(' · ') || '—']
      ]);
      publish(box, { b, unitN: unit[N - 1][1], cavN: cav[N - 1][1], totalN: sum });
    }
    draw();
  };

  // M7: lot midpoint
  reg['lmp'] = box => {
    title(box, 'Lot midpoint calculator', 'where does the curve hit the lot average?');
    const v = controls(box, [
      { k: 'F', label: 'First unit F', type: 'number', min: 1, step: 1, v: 4 },
      { k: 'L', label: 'Last unit L', type: 'number', min: 1, step: 1, v: 8 },
      { k: 'lcs', label: 'LCS', min: 0.7, max: 0.99, step: 0.005, v: 0.85, fmt: x => (x * 100).toFixed(1) + '%' }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    const ro = readout(box);
    function draw() {
      pb.innerHTML = '';
      const F = Math.max(1, Math.round(v.F)), L = Math.max(F, Math.round(v.L)), N = L - F + 1;
      const b = Math.log(v.lcs) / Math.log(2);
      const ari = (F + L) / 2, geo = Math.sqrt(F * L), heur = (ari + geo) / 2;
      const half = Math.pow((Math.pow(L + 0.5, b + 1) - Math.pow(F - 0.5, b + 1)) / ((b + 1) * N), 1 / b);
      let s = 0; for (let x = F; x <= L; x++) s += Math.pow(x, b);
      const exact = Math.pow(s / N, 1 / b);
      const p = Plot.create(pb, { h: 110, xmin: F - 0.5, xmax: L + 0.5, ymin: 0, ymax: 1, yticks: 1, xlabel: 'unit number', pad: { l: 20, r: 20, t: 10, b: 40 }, yfmt: () => '' });
      p.axes();
      [[geo, 'c3', 'geometric'], [exact, 'c2', 'true LMP'], [ari, 'c1', 'arithmetic']].forEach(([x, c, t], i) => { p.vline(x, 'marker ' + c); p.text(x, 0.85 - i * 0.28, t, 'annot ' + c, 'middle'); });
      ro([
        ['N = L − F + 1', N],
        ['Arithmetic mean (F+L)/2', f2(ari, 3) + ' (too high)'],
        ['Geometric mean √(FL)', f2(geo, 3) + ' (too low)'],
        ['Heuristic (average of both)', f2(heur, 3)],
        ['Formula with F−½ and L+½ (needs b)', f2(half, 3)],
        ['True LMP (exact discrete sum)', f2(exact, 3), 'good'],
        ['True LMP as a fraction of N', F === 1 ? f2(exact / N, 3) + ' × N' : 'n/a (not first lot)']
      ]);
      publish(box, { ari, geo, heur, half, exact });
    }
    draw();
  };

  // ======================================================================
  // M8: regression playground
  reg['regression'] = box => {
    title(box, 'Regression playground', 'click to add points, drag to move, right-click to delete');
    const presets = {
      seeker: ['Seeker (guide)', [[4, 5], [7, 5], [8, 10], [12, 7], [16, 13]]],
      tight: ['Tight linear', [[2, 4.1], [4, 6.2], [6, 7.8], [8, 10.3], [10, 11.9], [12, 14.2], [14, 15.8], [16, 18.1]]],
      outlier: ['One bad point', [[2, 4.1], [4, 6.2], [6, 7.8], [8, 10.3], [10, 11.9], [12, 14.2], [14, 15.8], [16, 2]]],
      curved: ['Curved (try a transform)', [[1, 2], [2, 2.6], [4, 3.9], [6, 5.8], [8, 8.4], [10, 11.8], [12, 16], [14, 21], [16, 27]]],
      funnel: ['Funnel (heteroscedastic)', [[2, 3], [3, 3.4], [5, 4.2], [7, 7.5], [9, 5.5], [11, 11], [13, 6.8], [15, 15.5], [17, 8.5], [18, 17]]]
    };
    let pts;
    const load = id => { pts = (presets[id] || presets.seeker)[1].map(p => p.slice()); };
    load(preset(box, 'data', 'seeker'));
    const bar = E('div', 'w-presets');
    Object.keys(presets).forEach(k => { const b = E('button', 'chip', presets[k][0]); b.onclick = () => { load(k); draw(); }; bar.appendChild(b); });
    const clr = E('button', 'chip', 'Clear'); clr.onclick = () => { pts = []; draw(); }; bar.appendChild(clr);
    box.appendChild(bar);
    const top = E('div'), bot = E('div');
    box.append(top, bot);
    const ro = readout(box);
    const p = Plot.create(top, { xmin: 0, xmax: 20, ymin: 0, ymax: 30, xlabel: 'X (cost driver)', ylabel: 'Y (cost)' });
    const rp = Plot.create(bot, { h: 150, xmin: 0, xmax: 20, ymin: -6, ymax: 6, yticks: 4, xlabel: 'X', ylabel: 'residual' });
    let drag = -1;
    p.svg.addEventListener('contextmenu', e => {
      e.preventDefault();
      const [x, y] = p.evt(e);
      const i = nearest(x, y); if (i >= 0) { pts.splice(i, 1); draw(); }
    });
    p.svg.addEventListener('pointerdown', e => {
      if (e.button === 2) return;
      const [x, y] = p.evt(e);
      if (x < 0 || x > 20 || y < 0 || y > 30) return;
      drag = nearest(x, y);
      if (drag < 0) { pts.push([x, y]); drag = pts.length - 1; }
      p.svg.setPointerCapture(e.pointerId);
      draw();
    });
    p.svg.addEventListener('pointermove', e => {
      if (drag < 0) return;
      const [x, y] = p.evt(e);
      pts[drag] = [Math.min(20, Math.max(0, x)), Math.min(30, Math.max(0, y))];
      draw();
    });
    p.svg.addEventListener('pointerup', () => { drag = -1; });
    function nearest(x, y) {
      let best = -1, bd = 0.9;
      pts.forEach((q, i) => { const d = Math.hypot((q[0] - x) / 20 * 28, (q[1] - y) / 30 * 15); if (d < bd) { bd = d; best = i; } });
      return best;
    }
    function draw() {
      p.clear(); p.axes(); rp.clear();
      pts.forEach((q, i) => p.dot(q[0], q[1], i === drag ? 'pt hot' : 'pt', 6));
      if (pts.length < 3) { rp.axes(); ro([['Add at least 3 points', '']]); publish(box, { n: pts.length, b0: NaN, b1: NaN, r2: NaN, see: NaN, cv: NaN, t: NaN, p: NaN, sse: NaN }); return; }
      const r = ols(pts.map(q => q[0]), pts.map(q => q[1]));
      p.fn(x => r.b0 + r.b1 * x, 'series c1');
      p.dot(r.mx, r.my, 'pt mean', 5);
      pts.forEach((q, i) => p.seg(q[0], q[1], q[0], r.b0 + r.b1 * q[0], 'resid'));
      const m = Math.max(1, ...r.res.map(Math.abs)) * 1.2;
      rp.o.ymin = -m; rp.o.ymax = m; rp.axes(); rp.hline(0, 'marker');
      pts.forEach((q, i) => rp.dot(q[0], r.res[i], 'pt alt', 4));
      // approximate two-tailed p for t via normal/t tail (df small -> use t approx)
      const df = r.n - 2;
      const tp = 2 * (1 - M.tcdf(Math.abs(r.t), df));
      ro([
        ['Equation', `Ŷ = ${f2(r.b0)} + ${f2(r.b1, 3)}X`],
        ['$R^2$', f2(r.r2, 3)],
        ['SEE', f2(r.see)], ['CV = SEE/$\\bar{Y}$', pct(r.cv), r.cv < 0.15 ? 'good' : 'bad'],
        ['SST = SSR + SSE', `${f2(r.sst, 1)} = ${f2(r.ssr, 1)} + ${f2(r.sse, 1)}`],
        ['t-stat (slope)', f2(r.t)], ['F = $t^2$', f2(r.F)],
        ['p-value (slope)', f2(tp, 3), tp < 0.05 ? 'good' : 'bad'], ['n, df', `${r.n}, ${df}`]
      ]);
      publish(box, { n: r.n, b0: r.b0, b1: r.b1, r2: r.r2, see: r.see, cv: r.cv, t: r.t, p: tp, sse: r.sse });
    }
    box.w.setters.data = id => { load(id); draw(); };
    draw();
  };

  // ======================================================================
  // M5: escalation / inflation indices
  reg['escalation'] = box => {
    title(box, 'Raw vs. weighted indices', 'why budget dollars need an outlay profile');
    const v = controls(box, [
      { k: 'r', label: 'Annual inflation', min: 0, max: 0.08, step: 0.0025, v: 0.025, fmt: x => (x * 100).toFixed(2) + '%' },
      { k: 'o1', label: 'Outlay yr 1', min: 0, max: 1, step: 0.05, v: 0.5, fmt: pct },
      { k: 'o2', label: 'Outlay yr 2', min: 0, max: 1, step: 0.05, v: 0.35, fmt: pct },
      { k: 'o3', label: 'Outlay yr 3', min: 0, max: 1, step: 0.05, v: 0.15, fmt: pct },
      { k: 'amt', label: 'BY$ amount', type: 'number', min: 0, step: 1, v: 100 }
    ], draw);
    const tb = E('div', 'w-table'); box.appendChild(tb);
    const note = E('div', 'w-note'); box.appendChild(note);
    const BY = 2025;
    function draw() {
      const prof = [v.o1, v.o2, v.o3], tot = prof.reduce((s, x) => s + x, 0) || 1;
      const pn = prof.map(x => x / tot);
      const raw = y => Math.pow(1 + v.r, y - BY);
      const wtd = y => pn.reduce((s, p, k) => s + p * raw(y + k), 0);
      let h = '<table><tr><th>Year</th><th>Raw index</th><th>Weighted index</th><th>Outlays in year (TY$)</th><th>Appropriated in year (TY$)</th></tr>';
      for (let y = BY; y <= BY + 5; y++) {
        h += `<tr><td>${y}</td><td>${raw(y).toFixed(4)}</td><td>${wtd(y).toFixed(4)}</td><td>${f2(v.amt * raw(y))}</td><td>${f2(v.amt * wtd(y))}</td></tr>`;
      }
      tb.innerHTML = h + '</table>';
      note.innerHTML = Render.inline(`Outlay profile normalized to ${pn.map(x => pct(x, 0)).join(' / ')}. In ${BY} the raw index is 1.0000 (the base year), but the weighted index is **${wtd(BY).toFixed(4)}** because money appropriated in ${BY} is spent over three years at later price levels. **BY$ → TY$: multiply. TY$ → BY$: divide.**`);
      publish(box, { raw1: raw(BY + 1), wtdBY: wtd(BY), tyBY: v.amt * wtd(BY) });
    }
    draw();
  };

  // ======================================================================
  // M9/M10: Monte Carlo S-curve
  reg['montecarlo'] = box => {
    title(box, 'Monte Carlo cost risk', 'sum of triangular WBS elements');
    const els = [
      { n: 'Airframe', a: 80, c: 100, b: 150 },
      { n: 'Propulsion', a: 40, c: 50, b: 80 },
      { n: 'Avionics', a: 55, c: 60, b: 95 },
      { n: 'SEPM', a: 25, c: 30, b: 45 }
    ];
    const tbl = E('div', 'w-table'); box.appendChild(tbl);
    let h = '<table><tr><th>Element</th><th>Low</th><th>Most likely</th><th>High</th></tr>';
    els.forEach((e, i) => { h += `<tr><td>${e.n}</td>` + ['a', 'c', 'b'].map(k => `<td><input type="number" data-i="${i}" data-k="${k}" value="${e[k]}"></td>`).join('') + '</tr>'; });
    tbl.innerHTML = h + '</table>';
    tbl.querySelectorAll('input').forEach(inp => inp.oninput = () => { const x = parseFloat(inp.value); if (isFinite(x)) { els[inp.dataset.i][inp.dataset.k] = x; } });
    const v = controls(box, [
      { k: 'rho', label: 'Correlation ρ', min: 0, max: 1, step: 0.05, v: 0.2, fmt: x => x.toFixed(2) },
      { k: 'n', label: 'Trials', type: 'select', v: '5000', options: [['1000', '1,000'], ['5000', '5,000'], ['20000', '20,000']] }
    ], () => {});
    const run = E('button', 'btn', 'Run simulation'); box.appendChild(run);
    const row = E('div', 'w-2col'); const L = E('div'), R = E('div'); row.append(L, R); box.appendChild(row);
    const ro = readout(box);
    run.onclick = go;
    function go() {
      const N = +v.n;
      const s = M.mcSum(els, v.rho, N, 11);
      const pe = els.reduce((a, e) => a + e.c, 0);
      const mu = mean(s), sdev = sd(s);
      const above = s.findIndex(x => x > pe), pctOfPE = (above < 0 ? N : above) / N;
      L.innerHTML = ''; R.innerHTML = '';
      const bins = 30, lo = s[0], hi = s[N - 1], w = (hi - lo) / bins || 1, cnt = new Array(bins).fill(0);
      s.forEach(x => cnt[Math.min(bins - 1, Math.floor((x - lo) / w))]++);
      const p1 = Plot.create(L, { w: 300, h: 230, xmin: lo, xmax: hi, ymin: 0, ymax: Math.max(...cnt) * 1.1, xlabel: 'total cost', ylabel: 'frequency', yfmt: () => '' });
      p1.axes(); cnt.forEach((c, i) => p1.rect(lo + i * w, 0, lo + (i + 1) * w, c, 'bar'));
      p1.vline(pe, 'marker c2'); p1.vline(mu, 'marker c1');
      const p2 = Plot.create(R, { w: 300, h: 230, xmin: lo, xmax: hi, ymin: 0, ymax: 1, xlabel: 'total cost', ylabel: 'confidence', yfmt: x => (x * 100).toFixed(0) + '%' });
      p2.axes(); p2.line(s.filter((_, i) => i % Math.ceil(N / 300) === 0).map((x, i, arr) => [x, (i * Math.ceil(N / 300)) / N]), 'series c1');
      p2.vline(pe, 'marker c2'); p2.hline(0.8, 'marker');
      ro([
        ['Point estimate (sum of modes)', f2(pe, 1), 'c2t'],
        ['Percentile of point estimate', pct(pctOfPE, 0), 'bad'],
        ['Mean of total', f2(mu, 1), 'c1t'], ['Std dev of total', f2(sdev, 1)],
        ['50th percentile', f2(quant(s, 0.5), 1)], ['80th percentile', f2(quant(s, 0.8), 1)],
        ['Sum of element means', f2(els.reduce((a, e) => a + (e.a + e.b + e.c) / 3, 0), 1)]
      ]);
      publish(box, { pe, pePct: pctOfPE, mean: mu, sd: sdev, p50: quant(s, 0.5), p70: quant(s, 0.7), p80: quant(s, 0.8) });
    }
    go();
  };

  // M10: distribution explorer
  reg['dist'] = box => {
    title(box, 'Distribution explorer', 'where do mean, median and mode land?');
    const v = controls(box, [
      { k: 'd', label: 'Distribution', type: 'select', v: 'tri', options: [['normal', 'Normal'], ['logn', 'Lognormal'], ['tri', 'Triangular']] },
      { k: 'p1', label: 'Param 1', min: 0, max: 100, step: 1, v: 20 },
      { k: 'p2', label: 'Param 2', min: 0, max: 100, step: 1, v: 30 },
      { k: 'p3', label: 'Param 3', min: 0, max: 100, step: 1, v: 80 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    legend(box, [['c1', 'mean'], ['c2', 'median'], ['c3', 'mode']]);
    const ro = readout(box);
    function draw() {
      pb.innerHTML = '';
      let pdf, mu, med, mode, s, lo, hi, desc;
      if (v.d === 'normal') {
        mu = v.p1; s = Math.max(1, v.p2 / 3); med = mode = mu; lo = mu - 4 * s; hi = mu + 4 * s;
        pdf = x => Math.exp(-0.5 * ((x - mu) / s) ** 2) / (s * Math.sqrt(2 * Math.PI));
        desc = `μ = Param 1 = ${mu}; σ = Param 2 ÷ 3 = ${f2(s, 1)}`;
      } else if (v.d === 'logn') {
        const m = Math.log(Math.max(1, v.p1)), sg = 0.1 + v.p2 / 100;
        mu = Math.exp(m + sg * sg / 2); med = Math.exp(m); mode = Math.exp(m - sg * sg); s = Math.sqrt((Math.exp(sg * sg) - 1)) * mu;
        lo = 0; hi = Math.exp(m + 3 * sg);
        pdf = x => x <= 0 ? 0 : Math.exp(-((Math.log(x) - m) ** 2) / (2 * sg * sg)) / (x * sg * Math.sqrt(2 * Math.PI));
        desc = `median $e^{\\mu}$ = ${f2(med, 1)}, σ of ln X = ${f2(sg, 2)}`;
      } else {
        const [a, c, b] = [v.p1, v.p2, v.p3].sort((x, y) => x - y);
        mu = (a + b + c) / 3; mode = c;
        s = Math.sqrt((a * a + b * b + c * c - a * b - a * c - b * c) / 18);
        const Fc = (c - a) / (b - a || 1);
        med = Fc >= 0.5 ? a + Math.sqrt((b - a) * (c - a) / 2) : b - Math.sqrt((b - a) * (b - c) / 2);
        lo = a - 2; hi = b + 2;
        pdf = x => x < a || x > b ? 0 : x <= c ? 2 * (x - a) / ((b - a) * (c - a || 1e-9)) : 2 * (b - x) / ((b - a) * (b - c || 1e-9));
        desc = `low ${a}, mode ${c}, high ${b}`;
      }
      let ymax = 0; for (let i = 0; i <= 200; i++) ymax = Math.max(ymax, pdf(lo + (hi - lo) * i / 200));
      const p = Plot.create(pb, { h: 240, xmin: lo, xmax: hi, ymin: 0, ymax: ymax * 1.1, xlabel: 'x', ylabel: 'density', yfmt: () => '' });
      p.axes(); p.fn(pdf, 'series area', 240);
      p.vline(mu, 'marker c1'); p.vline(med, 'marker c2'); p.vline(mode, 'marker c3');
      ro([['Parameters', desc], ['Mean', f2(mu)], ['Median', f2(med)], ['Mode', f2(mode)], ['Std dev', f2(s)],
        ['Skew', Math.abs(mu - med) < 0.01 * (s || 1) ? 'symmetric' : mu > med ? 'right (mean > median > mode)' : 'left']]);
      publish(box, { mean: mu, median: med, mode, sd: s });
    }
    draw();
  };

  // ======================================================================
  // M13: present value / NPV comparison
  reg['npv'] = box => {
    title(box, 'Compare alternatives with present value', 'lowest PV of cost wins (equal benefits)');
    const v = controls(box, [
      { k: 'r', label: 'Real discount rate', min: 0, max: 0.1, step: 0.0025, v: 0.03, fmt: x => (x * 100).toFixed(2) + '%' },
      { k: 'ia', label: 'A: investment (yr 0)', min: 0, max: 500, step: 5, v: 100 },
      { k: 'ca', label: 'A: annual cost', min: 0, max: 100, step: 1, v: 40 },
      { k: 'ib', label: 'B: investment (yr 0)', min: 0, max: 500, step: 5, v: 250 },
      { k: 'cb', label: 'B: annual cost', min: 0, max: 100, step: 1, v: 18 },
      { k: 'n', label: 'Years of operation', min: 1, max: 20, step: 1, v: 10 },
      { k: 'mid', label: 'Timing', type: 'select', v: 'end', options: [['end', 'End-of-year'], ['mid', 'Mid-year']] }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    legend(box, [['c1', 'Alternative A (cumulative PV)'], ['c2', 'Alternative B']]);
    const ro = readout(box);
    function draw() {
      pb.innerHTML = '';
      const df = t => 1 / Math.pow(1 + v.r, v.mid === 'mid' ? t - 0.5 : t);
      const cum = (inv, c) => { const out = [[0, inv]]; let s = inv; for (let t = 1; t <= v.n; t++) { s += c * df(t); out.push([t, s]); } return out; };
      const A = cum(v.ia, v.ca), B = cum(v.ib, v.cb);
      const pvA = A[A.length - 1][1], pvB = B[B.length - 1][1];
      const undA = v.ia + v.ca * v.n, undB = v.ib + v.cb * v.n;
      const p = Plot.create(pb, { xmin: 0, xmax: v.n, ymin: 0, ymax: Math.max(pvA, pvB, undA, undB) * 1.05, xlabel: 'year', ylabel: 'cumulative PV cost' });
      p.axes(); p.line(A, 'series c1'); p.line(B, 'series c2');
      let be = '—';
      for (let i = 1; i < A.length; i++) if ((A[i - 1][1] - B[i - 1][1]) * (A[i][1] - B[i][1]) <= 0 && A[i - 1][1] !== B[i - 1][1]) { be = 'year ' + i; break; }
      let sumDf = 0; for (let t = 1; t <= v.n; t++) sumDf += df(t);
      const sir = ((v.ca - v.cb) * sumDf) / (v.ib - v.ia);
      ro([
        ['PV of cost, A', f2(pvA, 1), pvA <= pvB ? 'good' : ''], ['PV of cost, B', f2(pvB, 1), pvB < pvA ? 'good' : ''],
        ['Undiscounted A / B', `${f2(undA, 0)} / ${f2(undB, 0)}`],
        ['Discounted break-even', be],
        ['EUAC A / B', `${f2(pvA / sumDf, 1)} / ${f2(pvB / sumDf, 1)}`],
        ['SIR of B over A = PV savings / extra investment', v.ib !== v.ia ? f2(sir, 2) : '—', sir > 1 ? 'good' : 'bad']
      ]);
      publish(box, { pvA, pvB, diff: pvA - pvB, sir });
    }
    draw();
  };

  // ======================================================================
  // M14: fixed price incentive (firm target)
  reg['fpif'] = box => {
    title(box, 'FPIF contract', 'share ratio, ceiling price and the Point of Total Assumption');
    const v = controls(box, [
      { k: 'tc', label: 'Target cost', type: 'number', v: 100 },
      { k: 'tp', label: 'Target profit', type: 'number', v: 10 },
      { k: 'cp', label: 'Ceiling price', type: 'number', v: 120 },
      { k: 'gs', label: 'Gov share (overrun)', min: 0.5, max: 0.95, step: 0.05, v: 0.7, fmt: x => `${Math.round(x * 100)}/${Math.round((1 - x) * 100)}` },
      { k: 'ac', label: 'Actual cost', min: 60, max: 160, step: 1, v: 110 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    legend(box, [['c1', 'final price'], ['c2', 'contractor profit'], ['c3', 'ceiling price']]);
    const ro = readout(box);
    function calc(ac) {
      const cs = 1 - v.gs;
      let profit = v.tp + cs * (v.tc - ac);
      let price = ac + profit;
      if (price > v.cp) { price = v.cp; profit = v.cp - ac; }
      return { price, profit };
    }
    function draw() {
      pb.innerHTML = '';
      const tpPrice = v.tc + v.tp;
      const pta = (v.cp - tpPrice) / v.gs + v.tc;
      const lo = v.tc * 0.6, hi = Math.max(v.tc * 1.6, pta * 1.1);
      const p = Plot.create(pb, { xmin: lo, xmax: hi, ymin: Math.min(0, calc(hi).profit) * 1.1, ymax: v.cp * 1.15, xlabel: 'actual cost', ylabel: '$' });
      p.axes();
      p.fn(x => calc(x).price, 'series c1'); p.fn(x => calc(x).profit, 'series c2'); p.hline(v.cp, 'marker c3'); p.hline(0, 'marker');
      p.vline(pta, 'marker'); p.text(pta, v.cp * 1.08, 'PTA', 'annot', 'middle');
      p.vline(v.ac, 'marker hot');
      const r = calc(v.ac);
      ro([
        ['Target price (TC + TP)', f2(tpPrice)],
        ['PTA = (CP − TP)/gov share + TC', f2(pta), 'c2t'],
        ['At actual cost ' + f2(v.ac, 0) + ': profit', f2(r.profit), r.profit < 0 ? 'bad' : 'good'],
        ['Final price', f2(r.price)],
        ['Region', v.ac <= v.tc ? 'underrun: contractor keeps ' + pct(1 - v.gs, 0) + ' of savings' : v.ac <= pta ? 'overrun, still sharing' : 'beyond PTA: contractor absorbs 100%']
      ]);
      publish(box, { tpPrice, pta, ac: v.ac, profit: r.profit, price: r.price });
    }
    draw();
  };

  // M14: CPIF
  reg['cpif'] = box => {
    title(box, 'CPIF contract', 'fee adjusts with cost inside the Range of Incentive Effectiveness');
    const v = controls(box, [
      { k: 'tc', label: 'Target cost', type: 'number', v: 100 },
      { k: 'tf', label: 'Target fee', type: 'number', v: 8 },
      { k: 'mn', label: 'Min fee', type: 'number', v: 3 },
      { k: 'mx', label: 'Max fee', type: 'number', v: 12 },
      { k: 'gs', label: 'Share (gov/contr.)', min: 0.5, max: 0.95, step: 0.05, v: 0.8, fmt: x => `${Math.round(x * 100)}/${Math.round((1 - x) * 100)}` },
      { k: 'ac', label: 'Actual cost', min: 50, max: 160, step: 1, v: 105 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    const ro = readout(box);
    function fee(ac) { return Math.min(v.mx, Math.max(v.mn, v.tf + (1 - v.gs) * (v.tc - ac))); }
    function draw() {
      pb.innerHTML = '';
      const cs = 1 - v.gs, lo = v.tc - (v.mx - v.tf) / cs, hi = v.tc + (v.tf - v.mn) / cs;
      const p = Plot.create(pb, { h: 240, xmin: Math.min(lo, v.ac) - 10, xmax: Math.max(hi, v.ac) + 10, ymin: 0, ymax: v.mx * 1.25, xlabel: 'actual cost', ylabel: 'fee' });
      p.rect(lo, 0, hi, v.mx * 1.25, 'band');
      p.axes(); p.fn(fee, 'series c1'); p.vline(v.ac, 'marker hot');
      ro([['RIE (fee between min and max)', `${f2(lo, 1)} to ${f2(hi, 1)}`, 'c2t'], ['Fee at actual cost', f2(fee(v.ac)), 'good'],
        ['Total price to government', f2(v.ac + fee(v.ac))], ['Fee as % of actual cost', pct(fee(v.ac) / v.ac)]]);
      publish(box, { rieLo: lo, rieHi: hi, fee: fee(v.ac), price: v.ac + fee(v.ac) });
    }
    draw();
  };

  // ======================================================================
  // M15: EVM
  reg['evm'] = box => {
    title(box, 'Earned value calculator');
    const v = controls(box, [
      { k: 'bac', label: 'BAC', type: 'number', v: 1000 },
      { k: 'pv', label: 'PV (BCWS)', type: 'number', v: 400 },
      { k: 'ev', label: 'EV (BCWP)', type: 'number', v: 350 },
      { k: 'ac', label: 'AC (ACWP)', type: 'number', v: 420 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    const ro = readout(box);
    function draw() {
      pb.innerHTML = '';
      const { bac, pv, ev, ac } = v;
      const cv = ev - ac, sv = ev - pv, cpi = ev / ac, spi = ev / pv;
      const eac1 = bac / cpi, eac2 = ac + (bac - ev) / (cpi * spi), eac3 = ac + (bac - ev);
      const tcpi = (bac - ev) / (bac - ac);
      const p = Plot.create(pb, { h: 150, xmin: 0, xmax: Math.max(bac, ac, eac2) * 1.05, ymin: 0, ymax: 4, yticks: 1, pad: { l: 70, r: 16, t: 8, b: 30 }, yfmt: () => '' });
      p.axes();
      [['PV', pv, 'bar'], ['EV', ev, 'bar c1f'], ['AC', ac, 'bar c2f']].forEach(([n, x, c], i) => { p.rect(0, 3.2 - i, x, 2.6 - i, c); p.text(0, 2.8 - i, n + ' ', 'annot', 'end'); });
      p.vline(bac, 'marker'); p.text(bac, 3.6, 'BAC', 'annot', 'middle');
      ro([
        ['CV = EV − AC', f2(cv, 0), cv < 0 ? 'bad' : 'good'], ['SV = EV − PV', f2(sv, 0), sv < 0 ? 'bad' : 'good'],
        ['CPI = EV/AC', f2(cpi, 3), cpi < 1 ? 'bad' : 'good'], ['SPI = EV/PV', f2(spi, 3), spi < 1 ? 'bad' : 'good'],
        ['% complete = EV/BAC', pct(ev / bac)], ['% spent = AC/BAC', pct(ac / bac)],
        ['EAC = BAC/CPI', f2(eac1, 0)], ['EAC = AC + (BAC−EV)/(CPI·SPI)', f2(eac2, 0)], ['EAC = AC + (BAC−EV)', f2(eac3, 0)],
        ['VAC = BAC − EAC(CPI)', f2(bac - eac1, 0), bac - eac1 < 0 ? 'bad' : 'good'],
        ['TCPI (to hit BAC)', f2(tcpi, 3), tcpi - cpi > 0.1 ? 'bad' : ''],
        ['TCPI − CPI', f2(tcpi - cpi, 3) + (tcpi - cpi > 0.1 ? ' (unrealistic)' : '')]
      ]);
      publish(box, { cv, sv, cpi, spi, eac: eac1, tcpi, vac: bac - eac1 });
    }
    draw();
  };

  // ======================================================================
  // M11: labor burdening
  reg['burden'] = box => {
    title(box, 'Building a wrap rate');
    const v = controls(box, [
      { k: 'dl', label: 'Direct labor $/hr', type: 'number', v: 40 },
      { k: 'oh', label: 'Overhead % (on DL)', min: 0, max: 2, step: 0.01, v: 1.1, fmt: x => pct(x, 0) },
      { k: 'ga', label: 'G&A % (on cost input)', min: 0, max: 0.4, step: 0.005, v: 0.12, fmt: x => pct(x, 1) },
      { k: 'fee', label: 'Fee / profit %', min: 0, max: 0.2, step: 0.005, v: 0.08, fmt: x => pct(x, 1) },
      { k: 'hrs', label: 'Hours', type: 'number', v: 1000 }
    ], draw);
    const ro = readout(box);
    function draw() {
      const oh = v.dl * v.oh, sub = v.dl + oh, ga = sub * v.ga, cost = sub + ga, fee = cost * v.fee, price = cost + fee;
      ro([['Direct labor', f2(v.dl)], ['+ Overhead', f2(oh)], ['= Subtotal', f2(sub)], ['+ G&A', f2(ga)], ['= Fully burdened cost/hr', f2(cost)],
        ['+ Fee', f2(fee)], ['= Wrap rate (price/hr)', f2(price), 'good'], ['Wrap multiple on DL', f2(price / v.dl, 3) + '×'], [`Price for ${v.hrs} hrs`, f2(price * v.hrs, 0)]]);
      publish(box, { cost, wrap: price, multiple: price / v.dl, price: price * v.hrs });
    }
    draw();
  };

  // M12: software effort
  reg['sw-effort'] = box => {
    title(box, 'Software effort vs. size', 'Effort = A · Size^E');
    const v = controls(box, [
      { k: 'A', label: 'A (calibration)', min: 1, max: 5, step: 0.01, v: 2.94 },
      { k: 'E', label: 'Exponent E', min: 0.9, max: 1.3, step: 0.01, v: 1.1 },
      { k: 's', label: 'Size (KSLOC)', min: 5, max: 500, step: 5, v: 100 }
    ], draw);
    const row = E('div', 'w-2col'); const L = E('div'), R = E('div'); row.append(L, R); box.appendChild(row);
    const ro = readout(box);
    function draw() {
      L.innerHTML = ''; R.innerHTML = '';
      const eff = s => v.A * Math.pow(s, v.E);
      const p1 = Plot.create(L, { w: 300, h: 220, xmin: 0, xmax: 500, ymin: 0, ymax: eff(500) * 1.05, xlabel: 'KSLOC', ylabel: 'person-months' });
      p1.axes(); p1.fn(eff, 'series c1'); p1.dot(v.s, eff(v.s), 'pt hot', 5);
      const p2 = Plot.create(R, { w: 300, h: 220, xmin: 0, xmax: 500, ymin: 0, ymax: Math.max(1000 / eff(5) * 5, 1000 / eff(500) * 500) * 1.1, xlabel: 'KSLOC', ylabel: 'SLOC per PM' });
      p2.axes(); p2.fn(s => 1000 * s / eff(s), 'series c2');
      ro([['Effort at ' + v.s + ' KSLOC', f2(eff(v.s), 0) + ' PM'], ['Productivity', f2(1000 * v.s / eff(v.s), 0) + ' SLOC/PM'],
        ['Doubling size multiplies effort by', f2(Math.pow(2, v.E), 3) + '×'], ['Scale', v.E > 1 ? 'diseconomy of scale' : v.E < 1 ? 'economy of scale' : 'linear']]);
      publish(box, { effort: eff(v.s), prod: 1000 * v.s / eff(v.s), doubleX: Math.pow(2, v.E) });
    }
    draw();
  };

  // M2: analogy scaling
  reg['analogy'] = box => {
    title(box, 'Analogy with scaling', 'adjust a known cost for size and complexity');
    const v = controls(box, [
      { k: 'c0', label: 'Analog cost', type: 'number', v: 50 },
      { k: 's0', label: 'Analog size', type: 'number', v: 1000 },
      { k: 's1', label: 'New size', type: 'number', v: 1400 },
      { k: 'b', label: 'Scaling exponent', min: 0.3, max: 1.2, step: 0.05, v: 0.7 },
      { k: 'cx', label: 'Complexity factor', min: 0.5, max: 2, step: 0.05, v: 1.1 }
    ], draw);
    const ro = readout(box);
    function draw() {
      const ratio = v.s1 / v.s0, sized = v.c0 * Math.pow(ratio, v.b), out = sized * v.cx;
      ro([['Size ratio', f2(ratio, 3)], ['Size-adjusted $C_0 (S_1/S_0)^b$', f2(sized)], ['× complexity', f2(out), 'good'],
        ['vs. linear scaling', f2(v.c0 * ratio * v.cx)]]);
      publish(box, { ratio, sized, est: out, linear: v.c0 * ratio * v.cx });
    }
    draw();
  };

  // M1/M5: TRL ladder
  reg['trl'] = box => {
    title(box, 'Technology Readiness Levels', 'click a level');
    const lv = [
      'Basic principles observed and reported', 'Technology concept and/or application formulated',
      'Analytical and experimental critical function and/or characteristic proof of concept',
      'Component and/or breadboard validation in a laboratory environment',
      'Component and/or breadboard validation in a relevant environment',
      'System/subsystem model or prototype demonstration in a relevant environment',
      'System prototype demonstration in an operational environment',
      'Actual system completed and qualified through test and demonstration',
      'Actual system proven through successful mission operations'
    ];
    const band = i => i < 3 ? 'Research' : i < 5 ? 'Development' : i < 7 ? 'Demonstration' : 'Qualification / operations';
    const list = E('div', 'trl');
    lv.forEach((t, i) => {
      const r = E('button', 'trl-row', `<b>TRL ${i + 1}</b><span>${t}</span><em>${band(i)}${i === 5 ? ' · typical Milestone B target' : ''}</em>`);
      r.style.setProperty('--w', (30 + i * 8.5) + '%');
      r.onclick = () => r.classList.toggle('open');
      list.appendChild(r);
    });
    box.appendChild(list);
    publish(box, {});
  };

  return { get: n => reg[n], names: () => Object.keys(reg), mount, _math: { ols, mean, sd, median } };
})();
