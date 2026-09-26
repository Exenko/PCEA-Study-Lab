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
      const lab = E('label', 'w-ctl' + (d.type === 'checkbox' ? ' w-ctl-check' : ''));
      const name = E('span', 'w-ctl-name', d.label);
      const out = E('span', 'w-ctl-val');
      let inp;
      if (d.type === 'select') {
        inp = E('select');
        d.options.forEach(o => { const op = E('option', null, o[1]); op.value = o[0]; inp.appendChild(op); });
      } else if (d.type === 'checkbox') {
        inp = E('input');
        inp.type = 'checkbox';
      } else {
        inp = E('input');
        inp.type = d.type || 'range';
        if (d.min != null) inp.min = d.min;
        if (d.max != null) inp.max = d.max;
        inp.step = d.step || 'any';
      }
      if (d.type === 'checkbox') inp.checked = !!vals[d.k]; else inp.value = vals[d.k];
      const show = () => { out.textContent = d.type === 'select' || d.type === 'number' || d.type === 'checkbox' ? '' : (d.fmt ? d.fmt(vals[d.k]) : vals[d.k]); };
      inp.addEventListener(d.type === 'checkbox' ? 'change' : 'input', () => {
        vals[d.k] = d.type === 'select' ? inp.value : d.type === 'checkbox' ? (inp.checked ? 1 : 0) : parseFloat(inp.value);
        if (d.type !== 'select' && d.type !== 'checkbox' && isNaN(vals[d.k])) return;
        show(); onChange(vals);
      });
      w.setters[d.k] = x => {
        vals[d.k] = d.type === 'select' ? String(x) : +x;
        if (d.type === 'checkbox') inp.checked = !!vals[d.k]; else inp.value = vals[d.k];
        show(); onChange(vals);
      };
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
    bar.hidden = 'data' in box.w.presets;
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
    bar.hidden = 'data' in box.w.presets;
    box.appendChild(bar);
    const v = controls(box, [
      { k: 'mode', label: 'Line', type: 'select', v: 'ols', options: [['ols', 'Least squares (OLS)'], ['hand', 'Fit by hand (drag the two handles)']] }
    ], draw);
    const top = E('div'), bot = E('div');
    box.append(top, bot);
    const ro = readout(box);
    const p = Plot.create(top, { xmin: 0, xmax: 20, ymin: 0, ymax: 30, xlabel: 'X (cost driver)', ylabel: 'Y (cost)' });
    const rp = Plot.create(bot, { h: 150, xmin: 0, xmax: 20, ymin: -6, ymax: 6, yticks: 4, xlabel: 'X', ylabel: 'residual' });
    const HX = [1, 19];
    let hand = [15, 15];
    let drag = -1;   // point index, -2/-3 = hand handle 0/1, -1 = none
    const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
    const dist = (x0, y0, x1, y1) => Math.hypot((x0 - x1) / 20 * 28, (y0 - y1) / 30 * 15);
    function nearest(x, y) {
      let best = -1, bd = 0.9;
      pts.forEach((q, i) => { const d = dist(q[0], q[1], x, y); if (d < bd) { bd = d; best = i; } });
      return best;
    }
    function nearHandle(x, y) {
      let best = -1, bd = 1.4;
      HX.forEach((hx, i) => { const d = dist(hx, hand[i], x, y); if (d < bd) { bd = d; best = i; } });
      return best;
    }
    p.svg.addEventListener('contextmenu', e => {
      e.preventDefault();
      const [x, y] = p.evt(e);
      const i = nearest(x, y); if (i >= 0) { pts.splice(i, 1); draw(); }
    });
    p.svg.addEventListener('pointerdown', e => {
      if (e.button === 2) return;
      const [x, y] = p.evt(e);
      if (x < 0 || x > 20 || y < 0 || y > 30) return;
      const h = v.mode === 'hand' ? nearHandle(x, y) : -1;
      if (h >= 0) drag = -2 - h;
      else {
        drag = nearest(x, y);
        if (drag < 0) { if (v.mode === 'hand') return; pts.push([x, y]); drag = pts.length - 1; }
      }
      p.svg.setPointerCapture(e.pointerId);
      draw();
    });
    p.svg.addEventListener('pointermove', e => {
      if (drag === -1) return;
      const [x, y] = p.evt(e);
      if (drag <= -2) hand[-2 - drag] = clamp(y, 0, 30);
      else pts[drag] = [clamp(x, 0, 20), clamp(y, 0, 30)];
      draw();
    });
    p.svg.addEventListener('pointerup', () => { drag = -1; });
    p.svg.addEventListener('pointercancel', () => { drag = -1; });
    function draw() {
      p.clear(); p.axes(); rp.clear();
      if (pts.length < 3) {
        pts.forEach(q => p.dot(q[0], q[1], 'pt', 6));
        rp.axes(); ro([['Add at least 3 points', '']]);
        publish(box, { n: pts.length, b0: NaN, b1: NaN, r2: NaN, see: NaN, cv: NaN, t: NaN, p: NaN, sse: NaN, sseHand: NaN, ratio: NaN });
        return;
      }
      const r = ols(pts.map(q => q[0]), pts.map(q => q[1]));
      const byHand = v.mode === 'hand';
      const hb1 = (hand[1] - hand[0]) / (HX[1] - HX[0]), hb0 = hand[0] - hb1 * HX[0];
      const lineAt = byHand ? x => hb0 + hb1 * x : x => r.b0 + r.b1 * x;
      const sseHand = pts.reduce((s, q) => s + (q[1] - (hb0 + hb1 * q[0])) ** 2, 0);
      // squared residuals as true squares: side |e| in y-units, converted to x-units by the pixel aspect
      const k = (p.y(0) - p.y(1)) / (p.x(1) - p.x(0));
      pts.forEach(q => { const e = q[1] - lineAt(q[0]); p.rect(q[0], q[1], q[0] + Math.abs(e) * k * (q[0] > 10 ? -1 : 1), lineAt(q[0]), 'sq'); });
      p.fn(lineAt, byHand ? 'series hand' : 'series c1');
      if (byHand) HX.forEach((hx, i) => p.dot(hx, hand[i], 'handle', 8));
      p.dot(r.mx, r.my, 'pt mean', 5);
      pts.forEach((q, i) => p.dot(q[0], q[1], i === drag ? 'pt hot' : 'pt', 6));
      const res = pts.map(q => q[1] - lineAt(q[0]));
      const m = Math.max(1, ...res.map(Math.abs)) * 1.2;
      rp.o.ymin = -m; rp.o.ymax = m; rp.axes(); rp.hline(0, 'marker');
      pts.forEach((q, i) => rp.dot(q[0], res[i], 'pt alt', 4));
      const df = r.n - 2;
      const tp = 2 * (1 - M.tcdf(Math.abs(r.t), df));
      const ratio = sseHand / r.sse;
      ro(byHand ? [
        ['Your line', `Ŷ = ${f2(hb0)} + ${f2(hb1, 3)}X`],
        ['Your SSE (total area of the squares)', f2(sseHand, 2)],
        ['Your SSE ÷ least-squares SSE', f2(ratio, 3), ratio < 1.05 ? 'good' : 'bad'],
        ['n', r.n]
      ] : [
        ['Equation', `Ŷ = ${f2(r.b0)} + ${f2(r.b1, 3)}X`],
        ['$R^2$', f2(r.r2, 3)],
        ['SEE', f2(r.see)], ['CV = SEE/$\\bar{Y}$', pct(r.cv), r.cv < 0.15 ? 'good' : 'bad'],
        ['SST = SSR + SSE', `${f2(r.sst, 1)} = ${f2(r.ssr, 1)} + ${f2(r.sse, 1)}`],
        ['t-stat (slope)', f2(r.t)], ['F = $t^2$', f2(r.F)],
        ['p-value (slope)', f2(tp, 3), tp < 0.05 ? 'good' : 'bad'], ['n, df', `${r.n}, ${df}`]
      ]);
      publish(box, { n: r.n, b0: r.b0, b1: r.b1, r2: r.r2, see: r.see, cv: r.cv, t: r.t, p: tp, sse: r.sse, sseHand, ratio });
    }
    box.w.setters.data = id => { load(id); draw(); };
    box.w.setters.hand = s => {
      if (s === 'ols' && pts.length >= 3) { const r = ols(pts.map(q => q[0]), pts.map(q => q[1])); hand = HX.map(x => r.b0 + r.b1 * x); }
      draw();
    };
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
    title(box, 'Monte Carlo cost risk', 'sum of triangular WBS elements; dashed curve = no correlation');
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
    tbl.querySelectorAll('input').forEach(inp => inp.oninput = () => { const x = parseFloat(inp.value); if (isFinite(x)) { els[inp.dataset.i][inp.dataset.k] = x; go(); } });
    const v = controls(box, [
      { k: 'rho', label: 'Correlation ρ', min: 0, max: 1, step: 0.05, v: 0.2, fmt: x => x.toFixed(2) },
      { k: 'n', label: 'Trials', type: 'select', v: '5000', options: [['1000', '1,000'], ['5000', '5,000'], ['20000', '20,000']] }
    ], go);
    const row = E('div', 'w-2col'); const L = E('div'), R = E('div'); row.append(L, R); box.appendChild(row);
    const ro = readout(box);
    let s0Key = null, s0Cache = null;
    function go() {
      const N = +v.n;
      const key = N + JSON.stringify(els);
      if (key !== s0Key) { s0Cache = M.mcSum(els, 0, N, 11); s0Key = key; }
      const s = M.mcSum(els, v.rho, N, 11), s0 = s0Cache;
      const pe = els.reduce((a, e) => a + e.c, 0);
      const mu = mean(s), sdev = sd(s);
      const above = s.findIndex(x => x > pe), pctOfPE = (above < 0 ? N : above) / N;
      const p80 = quant(s, 0.8), p80ind = quant(s0, 0.8);
      L.innerHTML = ''; R.innerHTML = '';
      const bins = 30, lo = Math.min(s[0], s0[0]), hi = Math.max(s[N - 1], s0[N - 1]), w = (hi - lo) / bins || 1, cnt = new Array(bins).fill(0);
      s.forEach(x => cnt[Math.min(bins - 1, Math.floor((x - lo) / w))]++);
      const p1 = Plot.create(L, { w: 300, h: 230, xmin: lo, xmax: hi, ymin: 0, ymax: Math.max(...cnt) * 1.1, xlabel: 'total cost', ylabel: 'frequency', yfmt: () => '' });
      p1.axes(); cnt.forEach((c, i) => p1.rect(lo + i * w, 0, lo + (i + 1) * w, c, 'bar'));
      p1.vline(pe, 'marker c2'); p1.vline(mu, 'marker c1');
      const step = Math.ceil(N / 300);
      const curve = arr => arr.filter((_, i) => i % step === 0).map((x, i) => [x, (i * step) / N]);
      const p2 = Plot.create(R, { w: 300, h: 230, xmin: lo, xmax: hi, ymin: 0, ymax: 1, xlabel: 'total cost', ylabel: 'confidence', yfmt: x => (x * 100).toFixed(0) + '%' });
      p2.axes(); p2.line(curve(s0), 'series ghost'); p2.line(curve(s), 'series c1');
      p2.vline(pe, 'marker c2'); p2.hline(0.8, 'marker');
      ro([
        ['Point estimate (sum of modes)', f2(pe, 1), 'c2t'],
        ['Percentile of point estimate', pct(pctOfPE, 0), 'bad'],
        ['Mean of total', f2(mu, 1), 'c1t'], ['Std dev of total', f2(sdev, 1)],
        ['50th percentile', f2(quant(s, 0.5), 1)], ['80th percentile', f2(p80, 1)],
        ['80th percentile with ρ = 0', f2(p80ind, 1)],
        ['Sum of element means', f2(els.reduce((a, e) => a + (e.a + e.b + e.c) / 3, 0), 1)]
      ]);
      publish(box, { pe, pePct: pctOfPE, mean: mu, sd: sdev, p50: quant(s, 0.5), p70: quant(s, 0.7), p80, p80ind, p80gap: p80 - p80ind });
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
    const pb2 = E('div'); box.appendChild(pb2);
    const ro = readout(box);
    function draw() {
      pb.innerHTML = ''; pb2.innerHTML = '';
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
      const gap = r => M.pvCost(v.ia, v.ca, v.n, r, v.mid === 'mid') - M.pvCost(v.ib, v.cb, v.n, r, v.mid === 'mid');
      const beRate = M.bisect(gap, 0, 0.2);
      const gs = []; for (let i = 0; i <= 40; i++) gs.push([0.1 * i / 40, gap(0.1 * i / 40)]);
      const gy = gs.map(q => q[1]), glo = Math.min(0, ...gy), ghi = Math.max(0, ...gy), gpad = (ghi - glo) * 0.1 || 1;
      const q = Plot.create(pb2, { h: 180, xmin: 0, xmax: 0.1, ymin: glo - gpad, ymax: ghi + gpad, xlabel: 'discount rate', ylabel: 'PV(A) − PV(B)', xfmt: x => (x * 100).toFixed(0) + '%' });
      q.axes(); q.hline(0, 'marker'); q.line(gs, 'series c3'); q.vline(v.r, 'marker hot');
      if (beRate <= 0.1) q.vline(beRate, 'marker c2');
      ro([
        ['PV of cost, A', f2(pvA, 1), pvA <= pvB ? 'good' : ''], ['PV of cost, B', f2(pvB, 1), pvB < pvA ? 'good' : ''],
        ['Undiscounted A / B', `${f2(undA, 0)} / ${f2(undB, 0)}`],
        ['Discounted break-even', be],
        ['Break-even discount rate', isFinite(beRate) ? pct(beRate, 2) : 'none from 0% to 20%'],
        ['EUAC A / B', `${f2(pvA / sumDf, 1)} / ${f2(pvB / sumDf, 1)}`],
        ['SIR of B over A = PV savings / extra investment', v.ib !== v.ia ? f2(sir, 2) : '—', sir > 1 ? 'good' : 'bad']
      ]);
      publish(box, { pvA, pvB, diff: pvA - pvB, sir, beRate });
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
    title(box, 'Earned value over time', 'scrub the month and watch the indices move');
    const v = controls(box, [
      { k: 'sc', label: 'Scenario', type: 'select', v: 'overrun', options: [['track', 'On plan'], ['overrun', 'Growing cost overrun'], ['late', 'Behind schedule, on cost']] },
      { k: 'bac', label: 'BAC', type: 'number', v: 1000 },
      { k: 'm', label: 'Month', min: 1, max: 24, step: 1, v: 6 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    legend(box, [['c3', 'PV (plan)'], ['c1', 'EV (earned)'], ['c2', 'AC (actual cost)']]);
    const ro = readout(box);
    function draw() {
      pb.innerHTML = '';
      const bac = v.bac, m = Math.round(v.m);
      const at = t => M.evmAt(v.sc, bac, t);
      const curve = (k, upto) => { const out = []; for (let t = 0; t <= upto + 1e-9; t += 0.25) out.push([t, at(t)[k]]); return out; };
      const { pv, ev, ac } = at(m);
      const cv = ev - ac, sv = ev - pv, cpi = ev / ac, spi = ev / pv;
      const eac = bac / cpi, tcpi = (bac - ev) / (bac - ac), open = bac > ac;
      const p = Plot.create(pb, { xmin: 0, xmax: 24, ymin: 0, ymax: Math.max(bac, at(24).ac) * 1.05, xlabel: 'month', ylabel: 'cumulative $' });
      p.axes(); p.hline(bac, 'marker'); p.text(0.4, bac * 1.02, 'BAC', 'annot');
      p.line(curve('pv', 24), 'series c3'); p.line(curve('ev', m), 'series c1'); p.line(curve('ac', m), 'series c2');
      p.vline(m, 'marker hot');
      ro([
        ['PV / EV / AC', `${f2(pv, 0)} / ${f2(ev, 0)} / ${f2(ac, 0)}`],
        ['CV = EV − AC', f2(cv, 0), cv < 0 ? 'bad' : 'good'], ['SV = EV − PV', f2(sv, 0), sv < 0 ? 'bad' : 'good'],
        ['CPI = EV/AC', f2(cpi, 3), cpi < 1 ? 'bad' : 'good'], ['SPI = EV/PV', f2(spi, 3), spi < 1 ? 'bad' : 'good'],
        ['EAC = BAC/CPI', f2(eac, 0)], ['VAC = BAC − EAC', f2(bac - eac, 0), bac - eac < 0 ? 'bad' : 'good'],
        ['TCPI = (BAC − EV)/(BAC − AC)', open ? f2(tcpi, 3) : 'n/a (BAC already spent)', open && tcpi - cpi > 0.1 ? 'bad' : ''],
        ['TCPI − CPI', open ? f2(tcpi - cpi, 3) + (tcpi - cpi > 0.1 ? ' (unrealistic)' : '') : '—']
      ]);
      publish(box, { m, pv, ev, ac, cv, sv, cpi, spi, eac, tcpi, vac: bac - eac });
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

  // M2: analogy scaling — CEBoK default is a linear ratio through the origin;
  // the power-law exponent is an optional, clearly-labeled Beyond-CEBoK toggle.
  reg['analogy'] = box => {
    title(box, 'Analogy scaling', 'a ratio through the origin, adjusted for a shared parameter');
    const v = controls(box, [
      { k: 'c0', label: 'Analog cost', type: 'number', v: 50 },
      { k: 's0', label: 'Analog size', type: 'number', v: 1000 },
      { k: 's1', label: 'New size', type: 'number', v: 1400 },
      { k: 'cx', label: 'Complexity/adjustment factor', min: 0.5, max: 2, step: 0.05, v: 1 },
      { k: 'powerOn', label: 'Power scaling (Beyond CEBoK)', type: 'checkbox', v: 0 },
      { k: 'b', label: 'Scaling exponent (used only if power scaling is on)', min: 0.3, max: 1.2, step: 0.05, v: 0.7 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    const ro = readout(box);
    function draw() {
      const on = !!v.powerOn;
      const ratio = v.s1 / v.s0;
      const linear = v.c0 * ratio * v.cx;
      const power = v.c0 * Math.pow(ratio, v.b) * v.cx;
      const est = on ? power : linear;
      pb.innerHTML = '';
      const xmax = Math.max(v.s0, v.s1) * 1.3;
      const ymax = Math.max(v.c0, linear, on ? power : 0) * 1.3;
      const p = Plot.create(pb, { h: 260, xmin: 0, xmax, ymin: 0, ymax, xlabel: 'shared size/parameter', ylabel: 'cost' });
      p.axes();
      p.rect(v.s0, 0, xmax, ymax, 'sq');
      p.text(Math.min(xmax * 0.62, v.s0 + (xmax - v.s0) * 0.1), ymax * 0.94, 'outside the data', 'annot');
      p.line([[0, 0], [xmax, v.c0 / v.s0 * xmax]], 'series c1');
      if (on) p.fn(x => v.c0 * Math.pow(x / v.s0, v.b) * v.cx, 'series c3');
      p.dot(v.s0, v.c0, 'pt hot', 6);
      p.text(v.s0, v.c0, ' analog', 'annot');
      p.dot(v.s1, est, 'pt c2', 6);
      p.text(v.s1, est, ' new estimate', 'annot c2');
      ro([['Size ratio', f2(ratio, 3)], ['Linear-ratio estimate (CEBoK)', f2(linear), on ? '' : 'good'],
        ['Power-scaled estimate (Beyond CEBoK)', on ? f2(power) : '—', on ? 'good' : ''],
        ['Estimate shown', f2(est)]]);
      publish(box, { ratio, linear, power, est });
    }
    draw();
  };

  // M4: normalization lab
  reg['normalize'] = box => {
    title(box, 'Normalize the data', 'eight historical programs; turn each adjustment on');
    const onoff = [['0', 'Off'], ['1', 'On']];
    const v = controls(box, [
      { k: 'units', label: 'Convert $K to $M', type: 'select', v: '0', options: onoff },
      { k: 'infl', label: 'Escalate TY$ to BY2026$ (2.5%/yr)', type: 'select', v: '0', options: onoff },
      { k: 'qty', label: 'Adjust lot average to T1 (90% curve)', type: 'select', v: '0', options: onoff }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    const tb = E('div', 'w-table'); box.appendChild(tb);
    const ro = readout(box);
    function draw() {
      const o = { units: v.units === '1', infl: v.infl === '1', qty: v.qty === '1' };
      const D = M.NORM_DATA, ys = D.map(d => M.normalizeCost(d, o));
      const fit = ols(D.map(d => d.kg), ys);
      pb.innerHTML = '';
      const p = Plot.create(pb, { h: 260, xmin: 0, xmax: 650, ymin: 0, ymax: Math.max(...ys) * 1.1, xlabel: 'weight (kg)', ylabel: o.units ? 'cost ($M)' : 'cost (mixed $K and $M)' });
      p.axes(); p.fn(x => fit.b0 + fit.b1 * x, 'series c1');
      D.forEach((d, i) => p.dot(d.kg, ys[i], i === 0 ? 'pt hot' : d.k && !o.units ? 'pt bad' : 'pt', i === 0 ? 7 : 5));
      tb.innerHTML = '<table><tr><th>#</th><th>kg</th><th>Year (TY$)</th><th>Lot midpoint</th><th>Recorded</th><th>Normalized</th></tr>' +
        D.map((d, i) => `<tr><td>${i + 1}${i === 0 ? ' ★' : ''}</td><td>${d.kg}</td><td>${d.y}</td><td>${d.q}</td><td>${f2(d.rec)} ${d.k ? '$K' : '$M'}</td><td>${f2(ys[i], 3)}</td></tr>`).join('') + '</table>';
      const nAdjust = [o.units, o.infl, o.qty].filter(Boolean).length;
      ro([['Adjustments on', nAdjust + ' of 3'], ['$R^2$ of cost vs. weight', f2(fit.r2, 3), fit.r2 > 0.99 ? 'good' : 'bad'], ['Point 1 (★) normalized', f2(ys[0], 3)]]);
      publish(box, { r2: fit.r2, nAdjust, byValue: ys[0] });
    }
    draw();
  };

  // M2: estimating method by life-cycle phase
  reg['method-phase'] = box => {
    title(box, 'Which method, when?', 'illustrative mix of techniques as a program matures');
    const v = controls(box, [{ k: 'phase', label: 'Phase', min: 0, max: 4, step: 1, v: 0, fmt: i => M.PHASES[Math.round(i)] }], draw);
    const pb = E('div'); box.appendChild(pb);
    legend(box, M.METHODS.map((n, i) => ['m' + i, n]));
    const ro = readout(box);
    const short = ['Concept', 'Tech dev', 'EMD', 'Production', 'O&S'];
    function draw() {
      pb.innerHTML = '';
      const ph = Math.round(v.phase), W = M.METHOD_WEIGHTS;
      const p = Plot.create(pb, { h: 240, xmin: 0, xmax: 4, ymin: 0, ymax: 1, xticks: 4, xlabel: 'life-cycle phase', ylabel: 'share of the estimate', xfmt: i => short[Math.round(i)] || '', yfmt: y => Math.round(y * 100) + '%' });
      p.axes();
      for (let k = 0; k < 4; k++) {
        const top = W.map((w, i) => [i, w.slice(0, k + 1).reduce((s, x) => s + x, 0)]);
        const bot = W.map((w, i) => [i, w.slice(0, k).reduce((s, x) => s + x, 0)]).reverse();
        const d = top.concat(bot).map((q, i) => (i ? 'L' : 'M') + p.x(q[0]).toFixed(1) + ' ' + p.y(q[1]).toFixed(1)).join(' ') + ' Z';
        Plot.svgEl('path', { d, class: 'stack m' + k }, p.svg);
      }
      p.vline(ph, 'marker hot');
      const w = W[ph], dom = w.indexOf(Math.max(...w));
      ro(M.METHODS.map((n, i) => [n, pct(w[i], 0), i === dom ? 'good' : '']));
      publish(box, { phase: ph, dominant: dom });
    }
    draw();
  };

  // M10: confidence interval coverage
  reg['ci-sim'] = box => {
    title(box, 'Confidence interval simulator', 'population is normal with μ = 100, σ = 15');
    const v = controls(box, [
      { k: 'n', label: 'Sample size n', min: 2, max: 60, step: 1, v: 10 },
      { k: 'level', label: 'Confidence level', type: 'select', v: '0.95', options: [['0.9', '90%'], ['0.95', '95%'], ['0.99', '99%']] },
      { k: 'method', label: 'Critical value', type: 'select', v: 't', options: [['t', 't with n − 1 df'], ['z', 'z (treats s as if it were σ)']] }
    ], draw);
    let seed = +preset(box, 'seed', 1);
    box.w.setters.seed = s => { seed = +s; draw(); };
    const again = E('button', 'btn small ghost', 'Draw new samples');
    again.onclick = () => { seed++; draw(); };
    box.appendChild(again);
    const pb = E('div'); box.appendChild(pb);
    legend(box, [['c1', 'interval covers μ'], ['bad', 'interval misses μ'], ['c2', 'true μ']]);
    const ro = readout(box);
    function draw() {
      const n = Math.round(v.n), level = parseFloat(v.level);
      const r = M.ciSim({ n, level, method: v.method, seed, k: 1000, mu: 100, sigma: 15 });
      pb.innerHTML = '';
      const shown = r.intervals.slice(0, 40);
      const lo = Math.min(70, ...shown.map(q => q[0])), hi = Math.max(130, ...shown.map(q => q[1]));
      const p = Plot.create(pb, { h: 300, xmin: lo, xmax: hi, ymin: 0, ymax: 41, yticks: 2, xlabel: 'interval for μ (first 40 samples)', yfmt: () => '', pad: { l: 20, r: 16, t: 10, b: 40 } });
      p.axes(); p.vline(100, 'marker c2');
      shown.forEach((q, i) => p.seg(q[0], i + 1, q[1], i + 1, q[2] ? 'ci-hit' : 'ci-miss'));
      ro([
        ['Critical value', f2(r.crit, 3)],
        ['Intervals covering μ (of 1,000)', pct(r.coverage, 1), Math.abs(r.coverage - level) < 0.02 ? 'good' : 'bad'],
        ['Nominal level', pct(level, 0)],
        ['Average half-width', f2(r.halfWidth, 2)]
      ]);
      publish(box, { n, coverage: r.coverage, halfWidth: r.halfWidth });
    }
    draw();
  };

  // M16: locked-in vs. spent life-cycle cost
  reg['lockin'] = box => {
    title(box, 'Locked-in vs. spent', 'illustrative life-cycle curves');
    const v = controls(box, [{ k: 'x', label: 'Point in the life cycle', min: 0, max: 100, step: 1, v: 5, fmt: x => x + '%' }], draw);
    const pb = E('div'); box.appendChild(pb);
    legend(box, [['c2', 'committed (locked in)'], ['c1', 'spent']]);
    const ro = readout(box);
    const starts = [0, 10, 35, 60], labels = ['Concept', 'Design', 'Production', 'O&S'];
    function draw() {
      pb.innerHTML = '';
      const L = M.lockin(v.x);
      const p = Plot.create(pb, { h: 260, xmin: 0, xmax: 100, ymin: 0, ymax: 1.08, xlabel: 'program timeline (%)', ylabel: 'share of life-cycle cost', yfmt: y => Math.round(y * 100) + '%' });
      p.axes();
      starts.slice(1).forEach(b => p.vline(b, 'marker'));
      starts.forEach((s, i) => p.text(s + 1, 1.04, labels[i], 'annot'));
      p.fn(x => M.lockin(x).committed, 'series c2');
      p.fn(x => M.lockin(x).spent, 'series c1');
      p.seg(v.x, L.spent, v.x, L.committed, 'marker hot');
      ro([['Phase', M.LOCK_PHASES[L.phase]], ['Committed', pct(L.committed, 0)], ['Spent', pct(L.spent, 0)], ['Gap (committed − spent)', pct(L.gap, 1), 'c2t']]);
      publish(box, { x: v.x, committed: L.committed, spent: L.spent, gap: L.gap, phase: L.phase });
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
    const band = i => i < 3 ? 'Research (Beyond CEBoK grouping)' : i < 5 ? 'Development (Beyond CEBoK grouping)' : i < 7 ? 'Demonstration (Beyond CEBoK grouping)' : 'Qualification / operations (Beyond CEBoK grouping)';
    const list = E('div', 'trl');
    lv.forEach((t, i) => {
      const r = E('button', 'trl-row', `<b>TRL ${i + 1}</b><span>${t}</span><em>${band(i)}</em>`);
      r.style.setProperty('--w', (30 + i * 8.5) + '%');
      r.onclick = () => r.classList.toggle('open');
      list.appendChild(r);
    });
    box.appendChild(list);
    publish(box, {});
  };

  // M1: MIL-HDBK-881A aircraft WBS (Fig 1.4), illustrative costs
  reg['wbs-tree'] = box => {
    title(box, 'Aircraft WBS (MIL-HDBK-881A)', 'illustrative leaf costs — expand Air Vehicle, edit, watch rollups');
    const NONANALOGOUS = new Set(['av_recon', 'av_asw', 'av_arm']);
    const topLevel = [
      ['seng', 'Systems Engineering / Program Management', 40],
      ['test', 'System Test and Evaluation', 30],
      ['train', 'Training', 10],
      ['data', 'Data', 8],
      ['pse', 'Peculiar Support Equipment', 6],
      ['cse', 'Common Support Equipment', 5],
      ['osa', 'Operational Site Activation', 4],
      ['indfac', 'Industrial Facilities', 7],
      ['spares', 'Initial Spares and Spare Parts', 12]
    ];
    const avChildren = [
      ['av_airframe', 'Airframe', 120], ['av_propulsion', 'Propulsion', 80],
      ['av_avsw', 'Air Vehicle Applications Software', 15], ['av_avssw', 'Air Vehicle System Software', 15],
      ['av_comms', 'Communications/Identification', 10], ['av_nav', 'Navigation/Guidance', 10],
      ['av_cc', 'Central Computer', 8], ['av_fc', 'Fire Control', 12],
      ['av_ddc', 'Data Display and Controls', 9], ['av_surv', 'Survivability', 14],
      ['av_recon', 'Reconnaissance', 10], ['av_afc', 'Automatic Flight Control', 9],
      ['av_cic', 'Central Integrated Checkout', 6], ['av_asw', 'Antisubmarine Warfare', 8],
      ['av_arm', 'Armament', 11], ['av_wd', 'Weapons Delivery', 7], ['av_aux', 'Auxiliary Equipment', 6]
    ];
    const cost = {};
    topLevel.forEach(([id, , v]) => cost[id] = +preset(box, id, v));
    avChildren.forEach(([id, , v]) => cost[id] = +preset(box, id, v));
    let commercial = !!+preset(box, 'commercial', 0);
    let avOpen = true;

    const bar = E('div', 'w-presets');
    const cbtn = E('button', 'btn small ghost', 'Commercial airliner view: off');
    cbtn.onclick = () => { commercial = !commercial; box.w.setters.commercial(commercial ? 1 : 0); };
    bar.appendChild(cbtn);
    box.appendChild(bar);
    box.w.setters.commercial = x => { commercial = !!+x; cbtn.textContent = 'Commercial airliner view: ' + (commercial ? 'on' : 'off'); draw(); };

    const tableWrap = E('div', 'w-table');
    box.appendChild(tableWrap);
    const ro = readout(box);

    avChildren.forEach(([id]) => { box.w.setters[id] = x => { cost[id] = +x; draw(); }; });
    topLevel.forEach(([id]) => { box.w.setters[id] = x => { cost[id] = +x; draw(); }; });

    function avSum() { return avChildren.reduce((s, [id]) => s + (commercial && NONANALOGOUS.has(id) ? 0 : cost[id]), 0); }
    function grandTotal() { return avSum() + topLevel.reduce((s, [id]) => s + cost[id], 0); }

    function row(id, label, val, share, indent, isParent, greyed) {
      const tr = E('tr', greyed ? 'greyed' : '');
      const nameCell = isParent
        ? `<button class="tree-toggle" data-id="${id}">${avOpen ? '▾' : '▸'}</button> <b>${label}</b>`
        : `<span style="padding-left:${indent}px">${label}${greyed ? ' <em>(not analogous — hidden in commercial view)</em>' : ''}</span>`;
      tr.innerHTML = `<td>${nameCell}</td><td>${isParent ? f2(val, 0) : ''}</td><td></td><td></td>`;
      if (!isParent) {
        const td = tr.children[1];
        td.innerHTML = '';
        const inp = E('input'); inp.type = 'number'; inp.min = 0; inp.step = 1; inp.value = val; inp.disabled = greyed;
        inp.addEventListener('input', () => { cost[id] = parseFloat(inp.value) || 0; draw(); });
        td.appendChild(inp);
      }
      const shareTd = tr.children[2];
      shareTd.innerHTML = `<div class="share-bar"><i style="width:${(share * 100).toFixed(1)}%"></i></div>`;
      tr.children[3].textContent = pct(share, 1);
      return tr;
    }

    function draw() {
      const total = grandTotal();
      const avTotal = avSum();
      const rows = [];
      rows.push(row('av', 'Air Vehicle (AV)', avTotal, total ? avTotal / total : 0, 0, true, false));
      if (avOpen) avChildren.forEach(([id, label]) => {
        const grey = commercial && NONANALOGOUS.has(id);
        rows.push(row(id, label, cost[id], total ? (grey ? 0 : cost[id]) / total : 0, 24, false, grey));
      });
      topLevel.forEach(([id, label]) => rows.push(row(id, label, cost[id], total ? cost[id] / total : 0, 0, false, false)));
      tableWrap.innerHTML = '<table><thead><tr><th>Element</th><th>Cost ($M, illustrative)</th><th>Share of total</th><th></th></tr></thead></table>';
      const table = tableWrap.querySelector('table');
      rows.forEach(r => table.appendChild(r));
      table.querySelectorAll('.tree-toggle').forEach(btn => btn.onclick = () => { avOpen = !avOpen; draw(); });
      const hiddenCount = commercial ? NONANALOGOUS.size : 0;
      ro([
        ['Grand total', f2(total, 0) + ' $M (illustrative)'],
        ['Air Vehicle share of total', pct(avTotal / (total || 1), 1)],
        ['Elements hidden (commercial view)', hiddenCount]
      ]);
      publish(box, { total, airVehicleShare: avTotal / (total || 1), hiddenCount });
    }
    draw();
  };

  // M1: positional independence (Fig 1.3)
  reg['independence'] = box => {
    title(box, 'Positional independence', 'who does I and A report to?');
    const nodes = ['C', 'S', 'P', 'B', 'I', 'A'];
    const fixedParent = { S: 'C', P: 'S', B: 'S' };
    const presets = {
      'Case 1 (CEBoK)': { iParent: 'S', aParent: 'S' },
      'Case 2 (CEBoK)': { iParent: 'B', aParent: 'B' }
    };
    const bar = E('div', 'w-presets');
    Object.keys(presets).forEach(k => {
      const b = E('button', 'chip', k);
      b.onclick = () => { box.w.setMany(presets[k]); };
      bar.appendChild(b);
    });
    box.appendChild(bar);
    const v = controls(box, [
      { k: 'iParent', label: 'I (cost group) reports to', type: 'select', v: preset(box, 'iParent', 'S'), options: [['S', 'S (sponsor)'], ['B', 'B (extra management layer)'], ['P', 'P (a different branch)'], ['A', 'A (the acquiring org itself)']] },
      { k: 'aParent', label: 'A (acquiring org) reports to', type: 'select', v: preset(box, 'aParent', 'S'), options: [['S', 'S (sponsor)'], ['B', 'B (extra management layer)'], ['P', 'P (a different branch)']] }
    ], draw);
    const pb = E('div', 'w-org'); box.appendChild(pb);
    const ro = readout(box);
    function ancestors(n) {
      const parent = Object.assign({}, fixedParent, { I: v.iParent, A: v.aParent });
      const chain = [n];
      let cur = n;
      while (parent[cur]) { cur = parent[cur]; chain.push(cur); }
      return chain;
    }
    function draw() {
      const ai = ancestors('I'), aa = ancestors('A');
      const lca = ai.find(n => aa.includes(n));
      const independent = (lca === 'S' || lca === 'B') ? 1 : 0;
      const parent = Object.assign({}, fixedParent, { I: v.iParent, A: v.aParent });
      pb.innerHTML = '';
      nodes.forEach(n => {
        const el = E('div', 'org-node' + (n === lca ? ' hot' : '') + ((n === 'I' || n === 'A') ? ' me' : ''), n);
        pb.appendChild(el);
      });
      const edges = Object.keys(parent).map(k => `${k}→${parent[k]}`).join('  ');
      ro([
        ['I’s chain', ai.join(' → ')],
        ['A’s chain', aa.join(' → ')],
        ['Nearest common superior', lca, independent ? 'good' : 'bad'],
        ['Positionally independent?', independent ? 'Yes' : 'No', independent ? 'good' : 'bad']
      ]);
      pb.title = edges;
      publish(box, { independent, commonSuperior: lca });
    }
    draw();
  };

  // M1: which estimate type applies at each life-cycle phase
  reg['lifecycle-estimates'] = box => {
    title(box, 'Estimate types across the life cycle', 'drag through the phases CEBoK ties estimates to');
    const PH = ['Pre-systems acquisition', 'Systems acquisition (source selection)', 'Before full-rate production', 'In-process / O&S'];
    const TYPE = [
      'Analysis of Alternatives (AoA) / trade studies — select among alternatives before committing to a project',
      'Source selection estimates — compare competitors’ approaches to satisfying requirements',
      'A cost study before full-scale/full-rate production',
      'Estimate At Completion (EAC) — for in-process programs with sufficient cost history, relying on EVM'
    ];
    const v = controls(box, [{ k: 'phase', label: 'Life-cycle phase', min: 0, max: 3, step: 1, v: 0, fmt: i => PH[Math.round(i)] }], draw);
    const pb = E('div', 'w-table'); box.appendChild(pb);
    const ro = readout(box);
    function draw() {
      const ph = Math.round(v.phase);
      const eacActive = ph === 3 ? 1 : 0;
      pb.innerHTML = `<table><tr><th>Phase</th><th>Estimate CEBoK ties to it</th></tr>` +
        PH.map((p, i) => `<tr class="${i === ph ? 'greyed-off' : ''}" style="${i === ph ? 'font-weight:600' : 'opacity:.5'}"><td>${p}</td><td>${TYPE[i]}</td></tr>`).join('') +
        `<tr><td><em>Throughout, any phase</em></td><td>Periodic Independent Cost Estimates (ICEs) for budgeting and program cost tracking</td></tr></table>`;
      ro([['Phase', PH[ph]], ['Estimate type', TYPE[ph].split(' —')[0]], ['EAC applicable?', eacActive ? 'Yes' : 'No', eacActive ? 'good' : '']]);
      publish(box, { phase: ph, eacActive });
    }
    draw();
  };

  // M1: cost-estimate quality checklist
  reg['quality-check'] = box => {
    title(box, 'Estimate quality checklist', 'toggle flaws and watch the six characteristics');
    const v = controls(box, [
      { k: 'noSource', label: 'Source data not documented', type: 'checkbox', v: 0 },
      { k: 'noRepeat', label: "Calculations can't be repeated / traced", type: 'checkbox', v: 0 },
      { k: 'badCER', label: 'CERs not valid or not normalized for inflation', type: 'checkbox', v: 0 },
      { k: 'omitDouble', label: 'WBS elements omitted or double-counted', type: 'checkbox', v: 0 },
      { k: 'late', label: 'Delivered after the decision was made', type: 'checkbox', v: 0 }
    ], draw);
    const ro = readout(box);
    function draw() {
      const accuracy = v.badCER ? 0 : 1;
      const comprehensiveness = v.omitDouble ? 0 : 1;
      const replicability = v.noSource ? 0 : 1;
      const auditability = v.noRepeat ? 0 : 1;
      const credibility = (accuracy && replicability && auditability) ? 1 : 0;
      const timeliness = v.late ? 0 : 1;
      const failCount = [accuracy, comprehensiveness, replicability, auditability, credibility, timeliness].filter(x => !x).length;
      const g = x => x ? 'good' : 'bad';
      ro([
        ['Accuracy', accuracy ? 'pass' : 'FAIL', g(accuracy)],
        ['Comprehensiveness', comprehensiveness ? 'pass' : 'FAIL', g(comprehensiveness)],
        ['Replicability', replicability ? 'pass' : 'FAIL', g(replicability)],
        ['Auditability', auditability ? 'pass' : 'FAIL', g(auditability)],
        ['Credibility (needs Accuracy + Replicability + Auditability)', credibility ? 'pass' : 'FAIL', g(credibility)],
        ['Timeliness', timeliness ? 'pass' : 'FAIL', g(timeliness)]
      ]);
      publish(box, { accuracy, comprehensiveness, replicability, auditability, credibility, timeliness, failCount });
    }
    draw();
  };

  // M2: build-up standard hours -> touch -> support -> total (JSF inlet nacelle example)
  reg['buildup-hours'] = box => {
    title(box, 'Build-up standard hours', 'standard x variance factor = touch; touch x support % = support; sum = total');
    const v = controls(box, [
      { k: 'std', label: 'Standard hours', type: 'number', v: 2000 },
      { k: 'variance', label: 'Variance/realization factor', min: 1, max: 2, step: 0.01, v: 1.2 },
      { k: 'support', label: 'Support-labor factor (%)', min: 0, max: 100, step: 1, v: 48 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    legend(box, [['c1', 'touch hours'], ['c2', 'support hours']]);
    const ro = readout(box);
    function draw() {
      const touch = v.std * v.variance;
      const support = touch * (v.support / 100);
      const total = touch + support;
      pb.innerHTML = '';
      const p = Plot.create(pb, { h: 220, xmin: 0, xmax: 2, ymin: 0, ymax: total * 1.15, xlabel: '', ylabel: 'hours', xticks: 2, xfmt: () => '' });
      p.axes();
      p.rect(0.6, 0, 1.4, touch, 'bar c1f');
      p.rect(0.6, touch, 1.4, total, 'bar c2f');
      p.text(1, touch / 2, f2(touch, 0), 'annot', 'middle');
      p.text(1, touch + support / 2, f2(support, 0), 'annot c2', 'middle');
      ro([['Touch hours', f2(touch, 0)], ['Support hours', f2(support, 0)], ['Total hours', f2(total, 0), 'good']]);
      publish(box, { touchHrs: touch, supportHrs: support, total });
    }
    draw();
  };

  // M2: techniques compared on one dataset — analogy / average / parametric / calibrated CER
  reg['techniques-compare'] = box => {
    title(box, 'Techniques compared', 'illustrative dataset — legitimate techniques on the same data disagree');
    const D = [[10, 22], [20, 35], [35, 58], [50, 74], [65, 95], [80, 118], [95, 132]]; // [driver, cost] illustrative
    const opts = D.map((d, i) => [String(i), `Point ${i + 1} (${d[0]}, ${d[1]})`]);
    const v = controls(box, [
      { k: 'x', label: 'New driver value', min: 5, max: 130, step: 1, v: 110 },
      { k: 'showAvg', label: 'Average', type: 'checkbox', v: 1 },
      { k: 'showAnalogy', label: 'Analogy', type: 'checkbox', v: 1 },
      { k: 'analogyPt', label: 'Analogy point', type: 'select', v: '2', options: opts },
      { k: 'showParam', label: 'Parametric (OLS)', type: 'checkbox', v: 1 },
      { k: 'showCal', label: 'Calibrated CER', type: 'checkbox', v: 1 },
      { k: 'calPt', label: 'Calibration point', type: 'select', v: '5', options: opts }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    legend(box, [['c1', 'data (illustrative)'], ['c2', 'average / parametric'], ['c3', 'analogy'], ['hot', 'calibrated CER']]);
    const ro = readout(box);
    function draw() {
      const x = v.x;
      const avg = mean(D.map(d => d[1]));
      const ai = Math.round(v.analogyPt), ap = D[ai];
      const analogy = ap[1] / ap[0] * x;
      const fit = ols(D.map(d => d[0]), D.map(d => d[1]));
      const param = fit.b0 + fit.b1 * x;
      const ci = Math.round(v.calPt), cp = D[ci];
      const calB0 = cp[1] - fit.b1 * cp[0];
      const cal = calB0 + fit.b1 * x;
      const ests = [];
      if (v.showAvg) ests.push(avg);
      if (v.showAnalogy) ests.push(analogy);
      if (v.showParam) ests.push(param);
      if (v.showCal) ests.push(cal);
      const spread = ests.length ? Math.max(...ests) - Math.min(...ests) : 0;
      pb.innerHTML = '';
      const xmax = Math.max(x, ...D.map(d => d[0])) * 1.15;
      const ymax = Math.max(avg, analogy, param, cal, ...D.map(d => d[1])) * 1.15;
      const p = Plot.create(pb, { h: 260, xmin: 0, xmax, ymin: 0, ymax, xlabel: 'driver', ylabel: 'cost' });
      p.axes();
      D.forEach(d => p.dot(d[0], d[1], 'pt', 5));
      p.dot(ap[0], ap[1], 'pt c3', 7);
      p.dot(cp[0], cp[1], 'pt hot', 7);
      if (v.showAvg) { p.hline(avg, 'marker c2'); p.dot(x, avg, 'pt c2', 6); }
      if (v.showAnalogy) { p.line([[0, 0], [xmax, ap[1] / ap[0] * xmax]], 'series c3'); p.dot(x, analogy, 'pt c3', 6); }
      if (v.showParam) { p.fn(xv => fit.b0 + fit.b1 * xv, 'series c2'); p.dot(x, param, 'pt c2', 6); }
      if (v.showCal) { p.fn(xv => calB0 + fit.b1 * xv, 'series hot'); p.dot(x, cal, 'pt hot', 6); }
      ro([['Average', f2(avg)], ['Analogy (through point ' + (ai + 1) + ')', f2(analogy)], ['Parametric (OLS)', f2(param)],
        ['Calibrated CER (through point ' + (ci + 1) + ')', f2(cal)], ['Spread (max − min) of shown estimates', f2(spread), spread > 20 ? 'bad' : 'good']]);
      publish(box, { avg, analogy, param, cal, spread });
    }
    draw();
  };

  // M2: schedule estimating by analogy — linear rate vs. an illustrative non-linear caveat
  reg['schedule-analogy'] = box => {
    title(box, 'Schedule analogy', 'System A: 10 components / 40 months -> rate for System B');
    const v = controls(box, [
      { k: 'nb', label: 'System B components', min: 10, max: 30, step: 1, v: 15 },
      { k: 'nonlinear', label: 'Non-linear integration growth (illustrative)', type: 'checkbox', v: 0 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    legend(box, [['c1', 'linear rate'], ['c3', 'non-linear (illustrative)'], ['hot', 'System A (analog)']]);
    const ro = readout(box);
    const A = { n: 10, m: 40 }, rate = A.m / A.n;
    function draw() {
      const linearMonths = v.nb * rate;
      // illustrative exponential-ish growth curve anchored at System A's point, clearly Beyond CEBoK
      const k = Math.log(1.6) / A.n;
      const nonlinearMonths = A.m * Math.exp(k * (v.nb - A.n));
      pb.innerHTML = '';
      const xmax = Math.max(v.nb, A.n) * 1.4;
      const ymax = Math.max(linearMonths, v.nonlinear ? nonlinearMonths : 0, A.m) * 1.25;
      const p = Plot.create(pb, { h: 260, xmin: 0, xmax, ymin: 0, ymax, xlabel: 'components', ylabel: 'months' });
      p.axes();
      p.line([[0, 0], [xmax, rate * xmax]], 'series c1');
      if (v.nonlinear) p.fn(xv => A.m * Math.exp(k * (xv - A.n)), 'series c3');
      p.dot(A.n, A.m, 'pt hot', 6);
      p.dot(v.nb, linearMonths, 'pt c1', 6);
      if (v.nonlinear) p.dot(v.nb, nonlinearMonths, 'pt c3', 6);
      ro([['Rate (months/component)', f2(rate, 2)], ['Linear months for System B', f2(linearMonths, 1), 'good'],
        ['Non-linear months (illustrative)', v.nonlinear ? f2(nonlinearMonths, 1) : '—']]);
      publish(box, { linearMonths, nonlinearMonths });
    }
    draw();
  };

  return { get: n => reg[n], names: () => Object.keys(reg), mount, _math: { ols, mean, sd, median } };
})();
