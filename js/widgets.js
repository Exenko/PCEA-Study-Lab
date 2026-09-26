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
      { k: 'method', label: 'Method', type: 'select', v: 'navy', options: [['navy', 'Navy/Air Force (harmonic)'], ['army', 'Army (arithmetic)']] },
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
      // Navy/Air Force method: weighted = 1 / sum(outlay_k / raw_k) — a weighted harmonic mean.
      const wtdNavy = y => 1 / pn.reduce((s, p, k) => s + p / raw(y + k), 0);
      // Army method: weighted = sum(outlay_k * raw_k) — a weighted arithmetic mean.
      const wtdArmy = y => pn.reduce((s, p, k) => s + p * raw(y + k), 0);
      const wtd = v.method === 'army' ? wtdArmy : wtdNavy;
      let h = '<table><tr><th>Year</th><th>Raw index</th><th>Weighted index (Navy/AF)</th><th>Weighted index (Army)</th><th>Outlays in year (TY$)</th><th>Appropriated in year (TY$)</th></tr>';
      for (let y = BY; y <= BY + 5; y++) {
        h += `<tr><td>${y}</td><td>${raw(y).toFixed(4)}</td><td>${wtdNavy(y).toFixed(4)}</td><td>${wtdArmy(y).toFixed(4)}</td><td>${f2(v.amt * raw(y))}</td><td>${f2(v.amt * wtd(y))}</td></tr>`;
      }
      tb.innerHTML = h + '</table>';
      note.innerHTML = Render.inline(`Outlay profile normalized to ${pn.map(x => pct(x, 0)).join(' / ')}. In ${BY} the raw index is 1.0000 (the base year). The Navy/Air Force method sums the de-escalated (each year's dollars) contributions and takes the reciprocal — a weighted harmonic mean, giving **${wtdNavy(BY).toFixed(4)}**. The Army method assumes the profile is in year-one (constant/base year) dollars and takes a weighted arithmetic mean, giving **${wtdArmy(BY).toFixed(4)}**. This module's default is the Navy/Air Force method. **BY$ → TY$: multiply. TY$ → BY$: divide.**`);
      publish(box, { raw1: raw(BY + 1), wtdBY: wtd(BY), tyBY: v.amt * wtd(BY) });
    }
    draw();
  };

  // M5: build a weighted index from an outlay profile, step by step
  reg['weighted-index'] = box => {
    title(box, 'Build a weighted index from an outlay profile', 'de-escalate each year’s portion, sum, then take the reciprocal');
    const v = controls(box, [
      { k: 'o1', label: 'Outlay % yr 1', min: 0, max: 100, step: 1, v: 40 },
      { k: 'o2', label: 'Outlay % yr 2', min: 0, max: 100, step: 1, v: 30 },
      { k: 'o3', label: 'Outlay % yr 3', min: 0, max: 100, step: 1, v: 20 },
      { k: 'o4', label: 'Outlay % yr 4', min: 0, max: 100, step: 1, v: 10 },
      { k: 'r', label: 'Annual inflation rate', min: 0, max: 0.2, step: 0.01, v: 0.1, fmt: x => (x * 100).toFixed(0) + '%' },
      { k: 'guess', label: 'Your guess: weighted index', type: 'number', min: 0, step: 0.0001, v: 1 }
    ], draw);
    const warn = E('div', 'w-note'); box.appendChild(warn);
    const tb = E('div', 'w-table'); box.appendChild(tb);
    const note = E('div', 'w-note'); box.appendChild(note);
    const ro = readout(box);
    let revealed = false;
    const btn = E('button', 'opt', 'Check my guess'); btn.type = 'button';
    btn.addEventListener('click', () => { revealed = true; draw(); });
    box.appendChild(btn);
    function draw() {
      const outlays = [v.o1, v.o2, v.o3, v.o4];
      const total = outlays.reduce((s, x) => s + x, 0);
      warn.innerHTML = Render.inline(Math.abs(total - 100) > 0.001 ? `**Outlay percentages sum to ${f2(total, 0)}%, not 100%.** Adjust before reading the index.` : `Outlay percentages sum to 100%.`);
      warn.className = 'w-note' + (Math.abs(total - 100) > 0.001 ? ' bad' : '');
      const raw = k => Math.pow(1 + v.r, k); // k = 0..3, raw index for year 1+k
      const portions = outlays.map(o => o / 100);
      const deesc = portions.map((p, k) => p / raw(k));
      const sumDeesc = deesc.reduce((s, x) => s + x, 0);
      const wtdNavy = 1 / sumDeesc;
      const wtdArmy = portions.reduce((s, p, k) => s + p * raw(k), 0);
      let h = '<table><tr><th>Year</th><th>Outlay portion</th><th>Raw index</th><th>De-escalated (portion / raw)</th></tr>';
      portions.forEach((p, k) => { h += `<tr><td>Year ${k + 1}</td><td>${f2(p, 3)}</td><td>${raw(k).toFixed(4)}</td><td>${f2(deesc[k], 3)}</td></tr>`; });
      h += `<tr><td colspan="3">Sum of de-escalated contributions</td><td><b>${f2(sumDeesc, 4)}</b></td></tr>`;
      h += `<tr><td colspan="3">Weighted index = 1 / sum (Navy/Air Force method)</td><td><b>${f2(wtdNavy, 4)}</b></td></tr>`;
      tb.innerHTML = h + '</table>';
      note.innerHTML = Render.inline(`Army-method comparison (weighted arithmetic mean, sum of portion × raw index): **${f2(wtdArmy, 4)}**. Source example (outlay 40/30/20/10, 10% inflation): 0.400 + 0.273 + 0.165 + 0.075 = 0.9131 → 1/0.9131 = 1.0952.`);
      if (revealed) {
        const ok = Math.abs(v.guess - wtdNavy) < 0.01;
        ro([['Your guess', f2(v.guess, 4)], ['Actual weighted index (Navy/AF)', f2(wtdNavy, 4), ok ? 'good' : 'bad'], ['Within 0.01?', ok ? 'yes' : 'no', ok ? 'good' : 'bad']]);
      } else ro([['Guess the weighted index, then check', '—']]);
      publish(box, { sumDeesc, wtdNavy, wtdArmy, guessOk: revealed ? Math.abs(v.guess - wtdNavy) < 0.01 : false });
    }
    draw();
  };

  // M5: the table's-year waystation — CY/TY stepper through Fig. 5.13/5.14
  reg['cy-ty-stepper'] = box => {
    title(box, 'Step through the table’s year', 'rule: going INTO the table’s year, divide; going OUT, multiply. Raw for CY, weighted for TY.');
    const CASES = {
      A: { label: 'A: Navy civ pay, CY07 → CY18', from: 'CY07', to: 'CY18', tblYr: '2010', start: 100, unit: '$K',
        s1: { idx: 'raw', op: 'div', factor: 0.918, result: 108.9, label: 'CY07 → CY10 (table’s year)' },
        s2: { idx: 'raw', op: 'mul', factor: 1.200, result: 130.7, label: 'CY10 → CY18' } },
      B: { label: 'B: AF RDT&EN, CY06 → TY15', from: 'CY06', to: 'TY15', tblYr: '2015', start: 10, unit: '$M',
        s1: { idx: 'raw', op: 'div', factor: 0.832, result: 12.0, label: 'CY06 → CY15 (table’s year)' },
        s2: { idx: 'weighted', op: 'mul', factor: 1.012, result: 12.2, label: 'CY15 → TY15' } },
      C: { label: 'C: Army MILCON, TY15 → CY09', from: 'TY15', to: 'CY09', tblYr: '2008', start: 10, unit: '$M',
        s1: { idx: 'weighted', op: 'div', factor: 1.198, result: 8.3, label: 'TY15 → CY08 (table’s year)' },
        s2: { idx: 'raw', op: 'mul', factor: 1.020, result: 8.5, label: 'CY08 → CY09' } },
      D: { label: 'D: Navy RDT&EN, TY15 → TY13', from: 'TY15', to: 'TY13', tblYr: '2009', start: 100, unit: '$M',
        s1: { idx: 'weighted', op: 'div', factor: 1.142, result: 87.6, label: 'TY15 → CY09 (table’s year)' },
        s2: { idx: 'weighted', op: 'mul', factor: 1.098, result: 96.1, label: 'CY09 → TY13' } }
    };
    const v = controls(box, [{ k: 'c', label: 'Example', type: 'select', v: 'A', options: Object.keys(CASES).map(k => [k, CASES[k].label]) }], () => { picks = {}; render(); });
    const info = E('div', 'w-note'); box.appendChild(info);
    const list = E('div', 'w-table'); box.appendChild(list);
    const ro = readout(box);
    let picks = { 1: {}, 2: {} };
    function render() {
      const cs = CASES[v.c];
      info.innerHTML = Render.inline(`Start: **${f2(cs.start, cs.start >= 100 ? 0 : 1)}${cs.unit} ${cs.from}**. Table’s year: ${cs.tblYr}. Target: **${cs.to}**.`);
      let h = '<table><tr><th>Step</th><th>Index type</th><th>Operation</th></tr>';
      [1, 2].forEach(n => {
        const st = cs['s' + n];
        h += `<tr><td>${n}: ${st.label}</td><td>` +
          ['raw', 'weighted'].map(t => `<button type="button" data-step="${n}" data-field="idx" data-val="${t}" class="opt${picks[n].idx === t ? ' on' : ''}">${t}</button>`).join(' ') +
          `</td><td>` +
          ['div', 'mul'].map(o => `<button type="button" data-step="${n}" data-field="op" data-val="${o}" class="opt${picks[n].op === o ? ' on' : ''}">${o === 'div' ? '÷' : '×'}</button>`).join(' ') +
          `</td></tr>`;
      });
      list.innerHTML = h + '</table>';
      list.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
        picks[+b.dataset.step][b.dataset.field] = b.dataset.val;
        render();
      }));
      const done = [1, 2].every(n => picks[n].idx && picks[n].op);
      let rows = [];
      let val = cs.start, ok1 = null, ok2 = null;
      if (picks[1].idx && picks[1].op) {
        ok1 = picks[1].idx === cs.s1.idx && picks[1].op === cs.s1.op;
        val = picks[1].op === 'div' ? val / cs.s1.factor : val * cs.s1.factor;
        rows.push(['Step 1 result', `${f2(val, 1)}${cs.unit}`, ok1 ? 'good' : 'bad']);
        rows.push(['Step 1 rule', `into table’s year → divide; ${cs.from.slice(0, 2)} → raw if CY, weighted if TY`, ok1 ? 'good' : 'bad']);
      }
      if (picks[2].idx && picks[2].op) {
        ok2 = picks[2].idx === cs.s2.idx && picks[2].op === cs.s2.op;
        val = picks[2].op === 'div' ? val / cs.s2.factor : val * cs.s2.factor;
        rows.push(['Step 2 result', `${f2(val, 1)}${cs.unit}`, ok2 ? 'good' : 'bad']);
      }
      if (done) rows.push(['Source answer', `${f2(cs.s2.result, 1)}${cs.unit} ${cs.to}`]);
      ro(rows.length ? rows : [['Pick index type and operation for step 1', '—']]);
      publish(box, { correct: done && !!ok1 && !!ok2, step: (picks[1].idx && picks[1].op ? 1 : 0) + (picks[2].idx && picks[2].op ? 1 : 0) });
    }
    render();
  };

  // M5: composite index builder
  reg['composite-index'] = box => {
    title(box, 'Build a composite index', 'weighted average of commodity escalation rates');
    const PRESETS = {
      steel: [{ n: 'Steel', w: 20, r: 5.6 }, { n: 'Automotive', w: 35, r: 6.2 }, { n: 'Machinery', w: 45, r: 5.7 }],
      rdten: [{ n: 'RDT&EN purchases', w: 88.55, r: 6 }, { n: 'Civilian payroll', w: 11.45, r: 6 }],
      omn: [{ n: 'O&M purchases', w: 41.74, r: 6 }, { n: 'Civilian payroll', w: 41.21, r: 6 }, { n: 'Fuel', w: 17.05, r: 6 }],
      milcon: [{ n: 'Civilian pay', w: 7.18, r: 6 }, { n: 'Military construction purchases', w: 92.82, r: 6 }]
    };
    let rows = PRESETS.steel.map(r => ({ ...r }));
    const btnWrap = E('div'); box.appendChild(btnWrap);
    [['steel', 'Steel/auto/machinery (default)'], ['rdten', 'Navy RDT&EN composite'], ['omn', 'Navy O&MN composite'], ['milcon', 'Navy MILCON composite']].forEach(([k, label]) => {
      const b = E('button', 'opt', label); b.type = 'button';
      b.addEventListener('click', () => { rows = PRESETS[k].map(r => ({ ...r })); render(); });
      btnWrap.appendChild(b);
    });
    const tb = E('div', 'w-table'); box.appendChild(tb);
    const warn = E('div', 'w-note'); box.appendChild(warn);
    const ro = readout(box);
    function render() {
      let h = '<table><tr><th>Commodity</th><th>Weight %</th><th>Escalation rate %</th></tr>';
      rows.forEach((r, i) => {
        h += `<tr><td>${r.n}</td><td><input type="number" data-i="${i}" data-f="w" value="${r.w}" step="0.01"></td><td><input type="number" data-i="${i}" data-f="r" value="${r.r}" step="0.01"></td></tr>`;
      });
      tb.innerHTML = h + '</table>';
      tb.querySelectorAll('input').forEach(inp => inp.oninput = () => { const x = parseFloat(inp.value); if (isFinite(x)) { rows[inp.dataset.i][inp.dataset.f] = x; render(); } });
      const totalW = rows.reduce((s, r) => s + r.w, 0);
      const compRate = rows.reduce((s, r) => s + (r.w / 100) * r.r, 0);
      const compIndex = rows.reduce((s, r) => s + (r.w / 100) * (1 + r.r / 100), 0);
      warn.innerHTML = Render.inline(Math.abs(totalW - 100) > 0.01 ? `**Weights sum to ${f2(totalW, 2)}%, not 100%.**` : `Weights sum to 100%.`);
      warn.className = 'w-note' + (Math.abs(totalW - 100) > 0.01 ? ' bad' : '');
      ro([['Composite escalation rate', f2(compRate, 3) + '%'], ['Composite index', f2(compIndex, 5)]]);
      publish(box, { totalW, compRate, compIndex });
    }
    render();
  };

  // M5: inflation sensitivity over time + doubling time
  reg['inflation-sensitivity'] = box => {
    const last = {};
    title(box, 'How sensitive is a long estimate to the inflation rate?', '$1M base-year amount compounded over 20 years');
    const v = controls(box, [
      { k: 'lo', label: 'Low rate', min: 0.01, max: 0.06, step: 0.0025, v: 0.03, fmt: x => (x * 100).toFixed(2) + '%' },
      { k: 'hi', label: 'High rate', min: 0.01, max: 0.08, step: 0.0025, v: 0.05, fmt: x => (x * 100).toFixed(2) + '%' }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    legend(box, [['c1', 'low'], ['c2', 'assumed 4%'], ['c3', 'high']]);
    const ro = readout(box);
    function draw() {
      pb.innerHTML = '';
      const mid = 0.04, N = 20, amt = 1;
      const series = r => { const out = []; for (let y = 0; y <= N; y++) out.push([y, amt * Math.pow(1 + r, y)]); return out; };
      const lo = series(v.lo), midS = series(mid), hi = series(v.hi);
      const ymax = Math.max(lo[N][1], midS[N][1], hi[N][1]) * 1.05;
      const p = Plot.create(pb, { xmin: 0, xmax: N, ymin: 0, ymax, xlabel: 'year', ylabel: '$M (then-year)' });
      p.axes(); p.line(lo, 'series c1'); p.line(midS, 'series c2'); p.line(hi, 'series c3');
      ro([
        [`End value at ${pct(v.lo)}`, f2(lo[N][1], 2) + 'M'], [`End value at 4.00%`, f2(midS[N][1], 2) + 'M'], [`End value at ${pct(v.hi)}`, f2(hi[N][1], 2) + 'M'],
        ['Divergence (high − low) at year 20', f2(hi[N][1] - lo[N][1], 2) + 'M']
      ]);
      Object.assign(last, { loEnd: lo[N][1], midEnd: midS[N][1], hiEnd: hi[N][1], divergence: hi[N][1] - lo[N][1] }); if ('exact' in last) publish(box, Object.assign({}, last));
    }
    draw();

    title(box, 'Doubling time', 'exact vs. Rule of 70 (source) vs. Rule of 72');
    const v2 = controls(box, [{ k: 'r', label: 'Annual rate', min: 0.01, max: 0.1, step: 0.0025, v: 0.04, fmt: x => (x * 100).toFixed(2) + '%' }], draw2);
    const ro2 = readout(box);
    function draw2() {
      const exact = Math.LN2 / Math.log(1 + v2.r);
      const r70 = 0.70 / v2.r, r72 = 0.72 / v2.r;
      ro2([
        ['Exact doubling time (ln2 / ln(1+r))', f2(exact, 2) + ' yrs', 'c1t'],
        ['Rule of 70 (0.70 / r) — source’s approximation', f2(r70, 2) + ' yrs'],
        ['Rule of 72 (0.72 / r)', f2(r72, 2) + ' yrs'],
        ['Rule-of-70 error vs. exact', f2(Math.abs(r70 - exact), 3) + ' yrs']
      ]);
      Object.assign(last, { exact, r70, r72 }); publish(box, Object.assign({}, last));
    }
    draw2();
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

  // M3: multivariate CER — cold iron hours & complement predicting purchased services (Example 2, illustrative reconstruction of CEBoK stats)
  reg['multi-driver'] = box => {
    title(box, 'Two cost drivers, one estimate', 'purchased services for 7 ship classes — cold iron hours vs. complement (illustrative reconstruction matched to CEBoK stats)');
    const X1 = [1800, 2600, 3400, 4200, 5800, 4600, 5200]; // cold iron hours
    const X2 = [370, 232, 439, 428, 311, 379, 406]; // complement
    const Y = [642.66, 501.61, 930.14, 849.72, 805.47, 950.68, 866.72]; // purchased services ($K), reconstructed to match published R^2/CV
    const v = controls(box, [
      { k: 'mode', label: 'Driver set', type: 'select', v: 'both', options: [['cold', 'Cold iron hours only'], ['comp', 'Complement only'], ['both', 'Both drivers']] }
    ], draw);
    const row = E('div', 'w-2col'); const L = E('div'), R = E('div'); row.append(L, R);
    box.appendChild(row);
    legend(box, [['c1', 'predicted vs. actual (45° = perfect)'], ['c2', 'cold iron hours'], ['c3', 'complement']]);
    const ro = readout(box);
    function pearson(a, b) {
      const ma = mean(a), mb = mean(b);
      let sab = 0, saa = 0, sbb = 0;
      for (let i = 0; i < a.length; i++) { sab += (a[i] - ma) * (b[i] - mb); saa += (a[i] - ma) ** 2; sbb += (b[i] - mb) ** 2; }
      return sab / Math.sqrt(saa * sbb);
    }
    function fitMulti(x1, x2, y) {
      const n = x1.length;
      const X = x1.map((v, i) => [1, v, x2[i]]);
      // normal equations, 3x3 solve
      const XtX = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], Xty = [0, 0, 0];
      for (let i = 0; i < n; i++) for (let a = 0; a < 3; a++) { Xty[a] += X[i][a] * y[i]; for (let b = 0; b < 3; b++) XtX[a][b] += X[i][a] * X[i][b]; }
      const A = XtX.map((r, i) => r.concat([Xty[i]]));
      for (let c = 0; c < 3; c++) {
        let p = c; for (let r = c + 1; r < 3; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
        [A[c], A[p]] = [A[p], A[c]];
        for (let r = 0; r < 3; r++) { if (r === c) continue; const f = A[r][c] / A[c][c]; for (let k = c; k < 4; k++) A[r][k] -= f * A[c][k]; }
      }
      const beta = A.map((r, i) => r[3] / r[i]);
      const pred = X.map(r => r[0] * beta[0] + r[1] * beta[1] + r[2] * beta[2]);
      const my = mean(y);
      const sse = y.reduce((s, yi, i) => s + (yi - pred[i]) ** 2, 0);
      const sst = y.reduce((s, yi) => s + (yi - my) ** 2, 0);
      const see = Math.sqrt(sse / (n - 3));
      return { beta, pred, r2: 1 - sse / sst, cv: see / my };
    }
    function draw() {
      L.innerHTML = ''; R.innerHTML = '';
      const single = ols;
      const cold = single(X1, Y), comp = single(X2, Y), both = fitMulti(X1, X2, Y);
      let pred, r2, cv, eqn;
      if (v.mode === 'cold') { pred = X1.map(x => cold.b0 + cold.b1 * x); r2 = cold.r2; cv = cold.cv; eqn = `y = ${f2(cold.b0, 0)} + ${f2(cold.b1, 2)}·coldIron`; }
      else if (v.mode === 'comp') { pred = X2.map(x => comp.b0 + comp.b1 * x); r2 = comp.r2; cv = comp.cv; eqn = `y = ${f2(comp.b0, 0)} + ${f2(comp.b1, 2)}·complement`; }
      else { pred = both.pred; r2 = both.r2; cv = both.cv; eqn = `y = ${f2(both.beta[0], 0)} + ${f2(both.beta[1], 3)}·coldIron + ${f2(both.beta[2], 2)}·complement`; }
      const maxV = Math.max(...Y, ...pred) * 1.15;
      const p1 = Plot.create(L, { w: 300, h: 240, xmin: 0, xmax: maxV, ymin: 0, ymax: maxV, xlabel: 'predicted ($K)', ylabel: 'actual ($K)' });
      p1.axes(); p1.line([[0, 0], [maxV, maxV]], 'series');
      Y.forEach((y, i) => p1.dot(pred[i], y, 'pt c1', 6));
      const r = pearson(X1, X2);
      const p2 = Plot.create(R, { w: 300, h: 240, xmin: 0, xmax: Math.max(...X1) * 1.15, ymin: 0, ymax: Math.max(...X2) * 1.15, xlabel: 'cold iron hours', ylabel: 'complement' });
      p2.axes(); X1.forEach((x, i) => p2.dot(x, X2[i], 'pt alt', 6));
      p2.text(Math.max(...X1) * 0.5, Math.max(...X2) * 1.05, `driver-vs-driver r = ${f2(r, 2)}`, 'annot');
      ro([
        ['Fitted equation', eqn],
        ['$R^2$', f2(r2, 3), r2 > 0.8 ? 'good' : ''],
        ['CV (both drivers only)', v.mode === 'both' ? pct(cv) : '—', v.mode === 'both' ? 'good' : ''],
        ['Cold-iron-only $R^2$', f2(cold.r2, 3)], ['Complement-only $R^2$', f2(comp.r2, 3)],
        ['Correlation between the two drivers', f2(r, 2), Math.abs(r) < 0.3 ? 'good' : 'bad']
      ]);
      publish(box, { r2, cv: v.mode === 'both' ? cv : NaN, mode: v.mode });
    }
    draw();
  };

  // M3: site activation CER — 11 sites, optionally + 4 new sites (Example 1, illustrative reconstruction of CEBoK stats)
  reg['site-activation'] = box => {
    title(box, 'Site activation CER', 'workstations per site predict site activation cost (illustrative reconstruction matched to CEBoK stats)');
    const X11 = [8, 28, 12, 9, 21, 29, 42, 7, 36, 9, 7];
    const Y11 = [326250, 753979, 496446, 430914, 440618, 752273, 1303204, 223350, 1109971, 218469, 364968];
    const Xnew = [15, 33, 18, 25];
    const Ynew = [302344, 888678, 565241, 750181];
    const v = controls(box, [
      { k: 'addNew', label: 'Add 4 new sites (Fig 3.8, 15 total)', type: 'checkbox', v: 0 },
      { k: 'ws', label: 'Workstations to predict', min: 1, max: 45, step: 1, v: 20 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    legend(box, [['c1', 'original 11 sites'], ['c3', '4 new sites'], ['c2', 'predicted point']]);
    const ro = readout(box);
    function draw() {
      const X = v.addNew ? X11.concat(Xnew) : X11.slice();
      const Y = v.addNew ? Y11.concat(Ynew) : Y11.slice();
      const fit = ols(X, Y);
      const pred = fit.b0 + fit.b1 * v.ws;
      pb.innerHTML = '';
      const xmax = Math.max(...X, v.ws) * 1.15;
      const ymax = Math.max(...Y, pred) * 1.15;
      const p = Plot.create(pb, { h: 260, xmin: 0, xmax, ymin: 0, ymax, xlabel: 'number of workstations', ylabel: 'site activation cost ($)' });
      p.axes(); p.fn(x => fit.b0 + fit.b1 * x, 'series c1');
      X11.forEach((x, i) => p.dot(x, Y11[i], 'pt c1', 6));
      if (v.addNew) Xnew.forEach((x, i) => p.dot(x, Ynew[i], 'pt c3', 6));
      p.dot(v.ws, pred, 'pt c2', 7);
      ro([
        ['n sites', X.length],
        ['Intercept', '$' + f2(fit.b0, 0)],
        ['Slope (per workstation)', '$' + f2(fit.b1, 0)],
        ['$R^2$', f2(fit.r2, 3), fit.r2 > 0.85 ? 'good' : ''],
        [`Predicted cost at ${Math.round(v.ws)} workstations`, '$' + f2(pred, 0), 'good']
      ]);
      publish(box, { intercept: fit.b0, slope: fit.b1, r2: fit.r2, pred });
    }
    draw();
  };

  // M3: CER functional-form explorer — see the curve straighten out in transformed space
  reg['cer-forms'] = box => {
    title(box, 'CER functional forms', 'linear, power, exponential, logarithmic — and their straight-line space');
    const v = controls(box, [
      { k: 'form', label: 'Form', type: 'select', v: 'power', options: [['linear', 'Linear  y = a + bx'], ['power', 'Power  y = a·x^b'], ['exp', 'Exponential  y = a·e^(bx)'], ['log', 'Logarithmic  y = a + b·ln(x)']] },
      { k: 'a', label: 'a', min: 0.5, max: 20, step: 0.5, v: 5 },
      { k: 'b', label: 'b', min: -1.5, max: 1.5, step: 0.05, v: 0.7 },
      { k: 'x', label: 'x (read off y here)', min: 1, max: 20, step: 0.5, v: 10 },
      { k: 'log', label: 'Log view (straighten the curve)', type: 'checkbox', v: 0 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    const ro = readout(box);
    function fOf(form, a, b) {
      if (form === 'linear') return x => a + b * x;
      if (form === 'power') return x => a * Math.pow(x, b);
      if (form === 'exp') return x => a * Math.exp(b * x / 5);
      return x => a + b * Math.log(x);
    }
    function draw() {
      pb.innerHTML = '';
      const f = fOf(v.form, v.a, v.b);
      const xmin = 1, xmax = 20;
      const xs = []; for (let x = xmin; x <= xmax; x += 0.25) xs.push(x);
      const ys = xs.map(f);
      const y = f(v.x);
      const lg = v.form !== 'linear' && v.log;
      let plotXs = xs, plotYs = ys, xlabel = 'x', ylabel = 'y', space = 'natural';
      if (lg) {
        if (v.form === 'power') { plotXs = xs.map(Math.log); plotYs = ys.map(Math.log); xlabel = 'ln x'; ylabel = 'ln y'; space = 'log-log'; }
        else if (v.form === 'exp') { plotXs = xs; plotYs = ys.map(Math.log); xlabel = 'x'; ylabel = 'ln y'; space = 'semi-log'; }
        else { plotXs = xs.map(Math.log); plotYs = ys; xlabel = 'ln x'; ylabel = 'y'; space = 'semi-log'; }
      }
      const finite = plotYs.map((yy, i) => [plotXs[i], yy]).filter(q => isFinite(q[1]) && isFinite(q[0]));
      const xr = finite.map(q => q[0]), yr = finite.map(q => q[1]);
      const p = Plot.create(pb, { h: 260, xmin: Math.min(...xr), xmax: Math.max(...xr), ymin: Math.min(...yr), ymax: Math.max(...yr), xlabel: xlabel + ` (${space} space)`, ylabel });
      p.axes(); p.line(finite, 'series c1');
      const py = lg ? (v.form === 'power' ? Math.log(y) : v.form === 'exp' ? Math.log(y) : y) : y;
      const px = lg ? (v.form === 'power' || v.form === 'log' ? Math.log(v.x) : v.x) : v.x;
      if (isFinite(px) && isFinite(py)) p.dot(px, py, 'pt hot', 7);
      ro([
        ['Form', v.form], ['a', f2(v.a, 2)], ['b', f2(v.b, 2)],
        [`y at x = ${f2(v.x, 1)}`, f2(y, 2)],
        ['Straight-line space', v.form === 'linear' ? 'already linear' : lg ? space + ' (shown)' : space + ' (toggle "log view")']
      ]);
      publish(box, { form: v.form, a: v.a, b: v.b, y });
    }
    draw();
  };

  // M3: calibration — shift an illustrative linear CER to pass through a known actual
  reg['calibration'] = box => {
    title(box, 'Calibrating a CER', 'illustrative base CER shifted vertically to pass through an actual data point (Fig 3.4 concept)');
    const a0 = 50, b0 = 3; // illustrative base CER: cost = 50 + 3*weight
    const v = controls(box, [
      { k: 'x1', label: 'Actual point: weight (x1)', min: 5, max: 90, step: 1, v: 40 },
      { k: 'y2', label: 'Actual point: cost (y2)', min: 0, max: 400, step: 5, v: 250 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    legend(box, [['c1', 'base CER (illustrative)'], ['c2', 'calibrated CER'], ['hot', 'actual data point']]);
    const ro = readout(box);
    function draw() {
      const y1 = a0 + b0 * v.x1;
      const shift = v.y2 - y1;
      const calIntercept = a0 + shift;
      pb.innerHTML = '';
      const xmax = 100;
      const ymax = Math.max(a0 + b0 * xmax, calIntercept + b0 * xmax, v.y2) * 1.15;
      const p = Plot.create(pb, { h: 260, xmin: 0, xmax, ymin: 0, ymax, xlabel: 'weight (illustrative)', ylabel: 'cost (illustrative)' });
      p.axes();
      p.fn(x => a0 + b0 * x, 'series c1');
      p.fn(x => calIntercept + b0 * x, 'series c2');
      p.dot(v.x1, y1, 'pt c1', 6); p.text(v.x1, y1, ' y1 (base)', 'annot c1');
      p.dot(v.x1, v.y2, 'pt hot', 7); p.text(v.x1, v.y2, ' y2 (actual)', 'annot');
      ro([
        ['Base CER', `y = ${a0} + ${b0}x (illustrative)`],
        ['Base predicted y1 at x1', f2(y1)],
        ['Actual y2 at x1', f2(v.y2)],
        ['Shift = y2 − y1', f2(shift), 'good'],
        ['Calibrated intercept', f2(calIntercept), 'good'],
        ['Calibrated CER', `y = ${f2(calIntercept)} + ${b0}x`]
      ]);
      publish(box, { shift, calIntercept });
    }
    draw();
  };

  // M4: data quality ladder — order data types best to worst
  reg['data-quality-ladder'] = box => {
    title(box, 'Rank the data quality', 'drag isn\'t required — use the arrows to order best (top) to worst (bottom)');
    const items = [
      { k: 'actuals', t: 'Actuals for a completed program/contract', fb: 'Best: actuals reflect what was really spent, no estimating left to do.' },
      { k: 'eac90', t: 'EAC for a contract >90% complete', fb: 'Next best: EACs improve as a contract nears completion — but some troubled programs delay re-baselining, so 90% complete is not always a clean line, so check before trusting it.' },
      { k: 'scheduleB', t: 'Schedule B contract line item price (~EAC at 0% complete)', fb: 'Weaker: a line item price is really just the EAC at 0% complete — it does not reflect what was actually spent.' },
      { k: 'historical', t: 'Historical / original budget data', fb: 'Worst: budget data is not actual spent cost, and it usually exists at too high a level to be useful.' }
    ];
    let order = ['scheduleB', 'historical', 'actuals', 'eac90'];
    const list = E('div', 'w-table'); box.appendChild(list);
    const fbBox = E('div', 'w-note'); box.appendChild(fbBox);
    const ro = readout(box);
    function byK(k) { return items.find(i => i.k === k); }
    function move(i, d) {
      const j = i + d;
      if (j < 0 || j >= order.length) return;
      [order[i], order[j]] = [order[j], order[i]];
      draw();
    }
    function draw(checked) {
      list.innerHTML = '';
      const tbl = E('table');
      order.forEach((k, i) => {
        const tr = E('tr');
        tr.innerHTML = `<td>${i + 1}</td><td>${Render.inline(byK(k).t)}</td><td></td>`;
        const cell = tr.lastChild;
        const up = E('button', 'opt', '↑'); up.type = 'button'; up.disabled = i === 0;
        const dn = E('button', 'opt', '↓'); dn.type = 'button'; dn.disabled = i === order.length - 1;
        up.addEventListener('click', () => move(i, -1));
        dn.addEventListener('click', () => move(i, 1));
        cell.append(up, dn);
        tbl.appendChild(tr);
      });
      list.appendChild(tbl);
      const correct = ['actuals', 'eac90', 'scheduleB', 'historical'];
      const isRight = order.join() === correct.join();
      if (checked) {
        fbBox.innerHTML = correct.map((k, i) => `<div class="ro ${order[i] === k ? 'good' : 'bad'}"><b>${i + 1}.</b> ${Render.inline(byK(k).fb)}</div>`).join('');
      } else fbBox.innerHTML = '';
      ro([['Order matches CEBoK ranking', isRight ? 'yes' : 'not yet', isRight ? 'good' : 'bad']]);
      publish(box, { correct: isRight, order: order.slice() });
      return isRight;
    }
    const btn = E('button', 'opt', 'Check my order'); btn.type = 'button';
    btn.addEventListener('click', () => draw(true));
    box.appendChild(btn);
    draw();
  };

  // M4: unit conversion chain — chain factors to normalize EUR/meter to USD/foot
  reg['unit-chain'] = box => {
    title(box, 'Chain the conversion factors', 'even NASA lost a $125M Mars orbiter in 1999 over a metric/English mix-up — get the chain right');
    const v = controls(box, [
      { k: 'scenario', label: 'Scenario', type: 'select', v: 'rate', options: [['rate', 'General data point: €5/meter'], ['cable', 'Optical cable type 1: €10/meter']] }
    ], draw);
    const steps = E('div', 'w-controls'); box.appendChild(steps);
    const ro = readout(box);
    const FACTORS = [
      { k: 'rate', label: '× $1.13 USD/€ (2019-03-23 rate)', mul: 1.13, unit: 'USD/meter' },
      { k: 'in', label: '÷ 39.37 inches/meter', mul: 1 / 39.37, unit: 'USD/inch' },
      { k: 'ft', label: '× 12 inches/foot', mul: 12, unit: 'USD/foot' }
    ];
    let applied = [];
    function base() { return v.scenario === 'cable' ? 10 : 5; }
    function target() { return v.scenario === 'cable' ? 3.44 : 1.72; }
    function draw() {
      applied = [];
      render();
    }
    function render() {
      steps.innerHTML = '';
      let val = base(), unit = 'EUR/meter';
      applied.forEach(k => { const f = FACTORS.find(x => x.k === k); val *= f.mul; unit = f.unit; });
      const rowLab = E('div', 'w-note', `Start: ${f2(base(), 0)} EUR/meter. Running value: <b>${f2(val, 3)} ${unit}</b>`);
      steps.appendChild(rowLab);
      const btnWrap = E('div'); btnWrap.style.marginTop = '6px';
      FACTORS.forEach(f => {
        const b = E('button', 'opt', f.label); b.type = 'button';
        b.disabled = applied.includes(f.k);
        b.addEventListener('click', () => { applied.push(f.k); render(); });
        btnWrap.appendChild(b);
      });
      steps.appendChild(btnWrap);
      const done = applied.length === FACTORS.length;
      const right = done && Math.abs(val - target()) < 0.01;
      ro([
        ['Factors applied', applied.length + ' of 3'],
        ['Result', done ? `$${f2(val, 2)}/foot` : '(apply all 3 factors)', done ? (right ? 'good' : 'bad') : ''],
        ['Target (source)', `$${f2(target(), 2)}/foot`]
      ]);
      publish(box, { value: val, applied: applied.length, correct: !!right });
    }
    draw();
  };

  // M4: contextual completeness sorter — good vs poor context
  reg['context-sorter'] = box => {
    title(box, 'Sort by contextual completeness', 'tap each data point: Good or Poor context, then reveal');
    const items = [
      { k: 'ram', txt: 'Procurement of one 1998 Dodge Ram 1500 regular cab 4x4 truck: standard configuration, 40/60 split cloth seats, optional power package, optional tow package, manual transmission, $18,500 in March 1998, excluding $750 shipping/destination.', ans: 'good', fb: 'Good: quantity, model, all accessory packages, price, the FY98 dollar year, and what is excluded ($750 shipping) are all identified.' },
      { k: 'xyz', txt: 'Fabricating sub-assembly "XYZ": 99.5 labor hours for the 1st unit, 89 hours for the 5th, 84 hours for the 10th, material cost constant at $2,350 (FY01) per assembly.', ans: 'good', fb: 'Good: specific activity/manufacturer, labor hours (not dollars, so labor rate can be applied later), material cost with its dollar year — enough to build a learning curve.' },
      { k: 'om', txt: 'O&M utilities cost $36,500.', ans: 'poor', fb: 'Poor: unknown activity, unknown site/facility scope, unknown dollar year, unknown period (monthly vs. annual) — any of these gaps makes the data unusable.' },
      { k: 'diagram', txt: 'A diagram showing what an object is and how it works.', ans: 'poor', fb: 'Poor: diagrams provide very little insight into cost data by themselves.' },
      { k: 'website', txt: 'Unsubstantiated internet data on a technical spec.', ans: 'poor', fb: 'Poor: internet data must be carefully scrutinized before use; if unsubstantiated it is not a good resource.' }
    ];
    let picks = {};
    const list = E('div'); box.appendChild(list);
    const ro = readout(box);
    function render(reveal) {
      list.innerHTML = '';
      items.forEach(it => {
        const row = E('div', 'w-note');
        const p = E('p', null, Render.inline(it.txt)); row.appendChild(p);
        const wrap = E('div');
        ['good', 'poor'].forEach(choice => {
          const b = E('button', 'opt' + (picks[it.k] === choice ? ' ' + (reveal ? (choice === it.ans ? 'right' : 'wrong') : 'on') : ''), choice === 'good' ? 'Good context' : 'Poor context');
          b.type = 'button';
          b.addEventListener('click', () => { picks[it.k] = choice; render(false); });
          wrap.appendChild(b);
        });
        row.appendChild(wrap);
        if (reveal && picks[it.k]) row.appendChild(E('div', 'ro ' + (picks[it.k] === it.ans ? 'good' : 'bad'), Render.inline(it.fb)));
        list.appendChild(row);
      });
    }
    const btn = E('button', 'opt', 'Reveal answers'); btn.type = 'button';
    btn.addEventListener('click', () => {
      render(true);
      const nCorrect = items.filter(it => picks[it.k] === it.ans).length;
      ro([['Correct', nCorrect + ' of ' + items.length, nCorrect === items.length ? 'good' : '']]);
      publish(box, { correct: nCorrect, total: items.length });
    });
    box.appendChild(btn);
    render(false);
    publish(box, { correct: 0, total: items.length });
  };

  // M4: scale of measurement sorter + Celsius/Fahrenheit interval demo
  reg['scale-sorter'] = box => {
    title(box, 'Classify the scale of measurement', 'nominal, ordinal, interval, or ratio?');
    const SCALES = [['nominal', 'Nominal'], ['ordinal', 'Ordinal'], ['interval', 'Interval'], ['ratio', 'Ratio']];
    const items = [
      { k: 'rank', txt: 'Finishing rank: 1st, 2nd, 3rd', ans: 'ordinal', fb: 'Ordinal: only greater-than/less-than in order is meaningful, not the size of the gaps.' },
      { k: 'year', txt: 'The year (e.g., 1995 to 2005)', ans: 'interval', fb: 'Interval: differences are meaningful (1995-2005 is twice as long as 1995-2000), but there is no true zero.' },
      { k: 'celsius', txt: 'Temperature in degrees Celsius', ans: 'interval', fb: 'Interval: 30°C to 60°C is a 30-degree gap, but 60°C is not "twice as hot" as 30°C — that only holds on a ratio scale like Fahrenheit-independent absolute temperature.' },
      { k: 'money', txt: '$2M compared to $1M (same year, same currency)', ans: 'ratio', fb: 'Ratio: $2M really is twice as much money as $1M once normalized to the same year and currency — true zero exists.' },
      { k: 'risk', txt: 'Risk category: "high risk" vs. "low risk"', ans: 'nominal', fb: 'Nominal/qualitative: a categorical label, even though it may be disguised as ordinal.' },
      { k: 'jersey', txt: 'Soccer jersey numbers (2 = fullback, 10 = midfielder, 15 = forward)', ans: 'interval', fb: 'Loosely interval: the numbers map to field position, so higher numbers sit further forward — they act like an interval scale, not a bare label.' },
      { k: 'baseball', txt: 'Baseball uniform numbers', ans: 'nominal', fb: 'Nominal: a unique label only — it conveys no other information about the player.' }
    ];
    let picks = {};
    const list = E('div'); box.appendChild(list);
    const ro = readout(box);
    function render(reveal) {
      list.innerHTML = '';
      items.forEach(it => {
        const row = E('div', 'w-note');
        row.appendChild(E('p', null, Render.inline(it.txt)));
        const wrap = E('div');
        SCALES.forEach(([sk, label]) => {
          const b = E('button', 'opt' + (picks[it.k] === sk ? ' ' + (reveal ? (sk === it.ans ? 'right' : 'wrong') : 'on') : ''), label);
          b.type = 'button';
          b.addEventListener('click', () => { picks[it.k] = sk; render(false); });
          wrap.appendChild(b);
        });
        row.appendChild(wrap);
        if (reveal && picks[it.k]) row.appendChild(E('div', 'ro ' + (picks[it.k] === it.ans ? 'good' : 'bad'), Render.inline(it.fb)));
        list.appendChild(row);
      });
    }
    const btn = E('button', 'opt', 'Reveal answers'); btn.type = 'button';
    btn.addEventListener('click', () => {
      render(true);
      const nCorrect = items.filter(it => picks[it.k] === it.ans).length;
      ro([['Correct', nCorrect + ' of ' + items.length, nCorrect === items.length ? 'good' : '']]);
      drawDemo();
    });
    box.appendChild(btn);
    render(false);

    // Celsius/Fahrenheit interval demo
    title(box, 'Celsius/Fahrenheit demo', 'doubling C does not double F');
    const v = controls(box, [{ k: 'c', label: 'Celsius', min: 0, max: 100, step: 1, v: 30 }], drawDemo);
    const ro2 = readout(box);
    function drawDemo() {
      const f = v.c * 9 / 5 + 32;
      const f2x = (v.c * 2) * 9 / 5 + 32;
      ro2([
        [`${f2(v.c, 0)}°C`, `${f2(f, 1)}°F`],
        [`${f2(v.c * 2, 0)}°C (double the Celsius)`, `${f2(f2x, 1)}°F (not double the Fahrenheit)`],
        ['Source example', '30°C = 86°F, 60°C = 140°F, but 2×86 ≠ 140']
      ]);
      publish(box, { correct: Object.keys(picks).filter(k => picks[k] === items.find(i => i.k === k).ans).length, total: items.length, c: v.c, f });
    }
    drawDemo();
  };

  // ======================================================================
  // M6: outlier regression (Fig 6.3) — reconstructed data
  reg['outlier-regression'] = box => {
    title(box, 'One point, two stories', 'reconstructed data — toggle the outlier and watch the fit flip');
    const XS = [18, 20, 55, 62, 72, 78, 85, 90, 93, 95, 96, 97, 100, 102, 105, 108, 110, 113, 115, 118, 120, 122, 125, 130, 135, 140, 145, 148, 150, 153];
    const YS = [72.5, 37.7, 85.3, 161, 101.8, 175.8, 162.4, 183.8, 227.1, 243.3, 219.5, 183.1, 175.5, 128.1, 247.8, 265.7, 129.1, 248.8, 265, 168.3, 222.7, 264.3, 244, 227.2, 299.5, 282.6, 253, 245.5, 312.6, 305];
    const OUT = [74, 690.1];
    const v = controls(box, [
      { k: 'outlier', label: 'Include the outlier', type: 'checkbox', v: 1 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    const ro = readout(box);
    legend(box, [['c1', 'fitted line'], ['c2', 'outlier']]);
    function draw() {
      pb.innerHTML = '';
      const xs = v.outlier ? XS.concat([OUT[0]]) : XS.slice();
      const ys = v.outlier ? YS.concat([OUT[1]]) : YS.slice();
      const fit = ols(xs, ys);
      const allY = YS.concat([OUT[1]]);
      const z = (OUT[1] - mean(allY)) / sd(allY); // CEBoK: SDs from the mean
      const p = Plot.create(pb, { h: 260, xmin: 0, xmax: 170, ymin: 0, ymax: v.outlier ? 750 : 350, xlabel: 'weight', ylabel: 'cost' });
      p.axes(); p.fn(x => fit.b0 + fit.b1 * x, 'series c1');
      XS.forEach((x, i) => p.dot(x, YS[i], 'pt', 6));
      if (v.outlier) p.dot(OUT[0], OUT[1], 'pt hot', 8);
      ro([
        ['Equation', `Ŷ = ${f2(fit.b0)} + ${f2(fit.b1, 3)}X`],
        ['$R^2$', f2(fit.r2, 3), fit.r2 > 0.5 ? 'good' : 'bad'],
        ['n', fit.n],
        ['Outlier z (SDs from the mean)', v.outlier ? f2(Math.abs(z), 2) : '—', Math.abs(z) > 3 ? 'bad' : '']
      ]);
      publish(box, { n: fit.n, slope: fit.b1, intercept: fit.b0, r2: fit.r2, outlierZ: Math.abs(z) });
    }
    draw();
  };

  // ======================================================================
  // M6: bin explorer (Figs 6.11/6.13/6.14) — reconstructed gas-bill data
  reg['bin-explorer'] = box => {
    title(box, 'Bin explorer', 'reconstructed monthly gas-bill data — the same distribution, four different stories');
    const DATA = [11, 11.25, 11.5, 11.75, 12, 12, 12, 13, 14, 15, 16, 16.5, 16.5, 26, 30, 33, 36, 37, 37, 72, 82, 92, 100, 103];
    const v = controls(box, [
      { k: 'width', label: 'Bin width ($)', min: 2, max: 40, step: 1, v: 15 },
      { k: 'start', label: 'Bin start ($)', min: 0, max: 20, step: 1, v: 0 },
      { k: 'view', label: 'View', type: 'select', v: 'hist', options: [['hist', 'Histogram'], ['box', 'Box plot']] }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    const ro = readout(box);
    function draw() {
      pb.innerHTML = '';
      const s = [...DATA].sort((a, b) => a - b);
      const m = mean(DATA);
      const q1 = quant(s, 0.25), med = quant(s, 0.5), q3 = quant(s, 0.75), iqr = q3 - q1;
      const loFence = q1 - 1.5 * iqr, hiFence = q3 + 1.5 * iqr;
      const outliers = s.filter(x => x < loFence || x > hiFence);
      const whiskLo = Math.max(s[0], Math.min(...s.filter(x => x >= loFence)));
      const whiskHi = Math.min(s[s.length - 1], Math.max(...s.filter(x => x <= hiFence)));
      if (v.view === 'box') {
        const p = Plot.create(pb, { h: 160, xmin: 0, xmax: 120, ymin: 0, ymax: 1, yticks: 1, xlabel: 'monthly gas bill ($)', pad: { l: 20, r: 16, t: 20, b: 40 }, yfmt: () => '' });
        p.axes();
        p.rect(q1, 0.3, q3, 0.7, 'bar c1f');
        p.seg(whiskLo, 0.5, q1, 0.5, 'marker'); p.seg(q3, 0.5, whiskHi, 0.5, 'marker');
        p.vline(med, 'marker hot');
        outliers.forEach(x => p.dot(x, 0.5, 'pt bad', 5));
        p.dot(whiskLo, 0.5, 'pt', 4); p.dot(whiskHi, 0.5, 'pt', 4);
      } else {
        const lo = v.start, w = Math.max(1, v.width);
        const nb = Math.ceil((s[s.length - 1] - lo) / w) + 1;
        const cnt = new Array(Math.max(1, nb)).fill(0);
        DATA.forEach(x => { const i = Math.floor((x - lo) / w); if (i >= 0 && i < cnt.length) cnt[i]++; });
        const p = Plot.create(pb, { h: 240, xmin: lo, xmax: lo + cnt.length * w, ymin: 0, ymax: Math.max(...cnt) * 1.15 || 1, xlabel: 'monthly gas bill ($)', ylabel: 'frequency' });
        p.axes(); cnt.forEach((c, i) => p.rect(lo + i * w, 0, lo + (i + 1) * w, c, 'bar'));
        p.vline(m, 'marker c1');
      }
      ro([
        ['n', DATA.length], ['Mean', '$' + f2(m, 2)], ['Min', '$' + s[0]],
        ['Q1', '$' + f2(q1, 2)], ['Median', '$' + f2(med, 2)], ['Q3', '$' + f2(q3, 2)],
        ['Bills < $11.15', DATA.filter(x => x < 11.15).length],
        ['Outliers (1.5×IQR rule)', outliers.join(', ') || 'none']
      ]);
      publish(box, { n: DATA.length, mean: m, q1, median: med, q3, iqr, outlierCount: outliers.length });
    }
    draw();
  };

  // ======================================================================
  // M6: Naive Bayes / kNN classifier (Figs 6.20–6.32)
  reg['ml-classifier'] = box => {
    title(box, 'Naive Bayes vs. kNN', 'weight/power instrument classes — click the plane to test a new point');
    const rnd = M.rng(42);
    const gen = (n, mx, my, sx, sy, cls) => Array.from({ length: n }, () => ({ x: mx + sx * M.randn(rnd), y: my + sy * M.randn(rnd), cls }));
    const AB = gen(10, 1100, 1600, 100, 100, 'AB');
    const CD = gen(10, 900, 1400, 100, 100, 'CD');
    const pts = AB.concat(CD);
    const S_AB = { mx: 1100, sx: 100, my: 1600, sy: 100 }, S_CD = { mx: 900, sx: 100, my: 1400, sy: 100 };
    let px = 1050, py = 1525;
    const v = controls(box, [
      { k: 'k', label: 'kNN neighbors (k)', min: 1, max: 15, step: 2, v: 3 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    const ro = readout(box);
    legend(box, [['c1', 'Class A/B'], ['c3', 'Class C/D'], ['hot', 'new point']]);
    let p;
    function place(e) {
      const [x, y] = p.evt(e);
      px = Math.round(x); py = Math.round(y); draw();
    }
    function draw() {
      pb.innerHTML = '';
      p = Plot.create(pb, { h: 300, xmin: 600, xmax: 1400, ymin: 1100, ymax: 1900, xlabel: 'weight', ylabel: 'power' });
      p.axes();
      AB.forEach(q => p.dot(q.x, q.y, 'pt c1', 5));
      CD.forEach(q => p.dot(q.x, q.y, 'pt c3', 5));
      p.svg.addEventListener('pointerdown', place);
      // Naive Bayes: one-tailed normal probability per feature (CEBoK method), product then normalized
      const oneTail = z => 1 - M.Phi(Math.abs(z));
      const zwAB = (px - S_AB.mx) / S_AB.sx, zwCD = (px - S_CD.mx) / S_CD.sx;
      const zpAB = (py - S_AB.my) / S_AB.sy, zpCD = (py - S_CD.my) / S_CD.sy;
      const pw_AB = oneTail(zwAB), pw_CD = oneTail(zwCD);
      const pp_AB = oneTail(zpAB), pp_CD = oneTail(zpCD);
      const prodAB = pw_AB * pp_AB, prodCD = pw_CD * pp_CD;
      const total = prodAB + prodCD || 1;
      const nbAB = prodAB / total, nbCD = prodCD / total;
      // kNN by Euclidean distance in raw units
      const withD = pts.map(q => ({ ...q, d: Math.hypot(q.x - px, q.y - py) })).sort((a, b) => a.d - b.d);
      const k = Math.round(v.k);
      const near = withD.slice(0, k);
      const votesAB = near.filter(q => q.cls === 'AB').length, votesCD = k - votesAB;
      const knnCls = votesAB >= votesCD ? 'AB' : 'CD';
      near.forEach(q => p.seg(px, py, q.x, q.y, 'marker'));
      p.dot(px, py, 'pt hot', 8);
      ro([
        ['New point', `weight ${f2(px, 0)}, power ${f2(py, 0)}`],
        ['Weight prob. (A/B vs C/D)', `${pct(pw_AB, 2)} vs ${pct(pw_CD, 2)}`],
        ['Power prob. (A/B vs C/D)', `${pct(pp_AB, 2)} vs ${pct(pp_CD, 2)}`],
        ['Naive Bayes normalized', `A/B ${pct(nbAB, 2)}, C/D ${pct(nbCD, 2)}`, nbAB > nbCD ? 'c1t' : 'c2t'],
        [`kNN (k=${k}) vote`, `${votesAB} A/B, ${votesCD} C/D → ${knnCls}`]
      ]);
      publish(box, { weightProbAB: pw_AB, weightProbCD: pw_CD, powerProbAB: pp_AB, powerProbCD: pp_CD, nbProbAB: nbAB, nbProbCD: nbCD, knnClass: knnCls, k });
    }
    draw();
  };

  // ======================================================================
  // M6: logistic regression risk model (Table 6.3/6.4)
  reg['logistic-risk'] = box => {
    title(box, 'Logistic risk model', 'project size, schedule, and team features → probability of high cost risk');
    const COEF = { b0: -8.0, size: 0.9, dur: 0.5, exp: -0.8, team: 0.2, cx: 1.5, mkt: 0.05 };
    const v = controls(box, [
      { k: 'size', label: 'Project size ($M)', min: 0, max: 20, step: 0.5, v: 4 },
      { k: 'dur', label: 'Duration (months)', min: 1, max: 30, step: 1, v: 10 },
      { k: 'exp', label: 'Team experience (yrs)', min: 0, max: 15, step: 0.5, v: 6 },
      { k: 'team', label: 'Team members', min: 1, max: 25, step: 1, v: 9 },
      { k: 'cx', label: 'Complexity score', min: 0, max: 10, step: 0.5, v: 6 },
      { k: 'mkt', label: 'Market volatility index', min: 0, max: 100, step: 1, v: 65 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    const ro = readout(box);
    function draw() {
      pb.innerHTML = '';
      const terms = [
        ['Intercept', COEF.b0],
        ['Size', COEF.size * v.size],
        ['Duration', COEF.dur * v.dur],
        ['Experience', COEF.exp * v.exp],
        ['Team members', COEF.team * v.team],
        ['Complexity', COEF.cx * v.cx],
        ['Market volatility', COEF.mkt * v.mkt]
      ];
      const logOdds = terms.reduce((s, t) => s + t[1], 0);
      const P = 1 / (1 + Math.exp(-logOdds));
      const xmax = Math.max(1, ...terms.map(t => Math.abs(t[1]))) * 1.2;
      const p = Plot.create(pb, { h: 220, xmin: -xmax, xmax, ymin: 0, ymax: terms.length, yticks: terms.length, xlabel: 'contribution to log-odds', yfmt: () => '', pad: { l: 20, r: 16, t: 10, b: 40 } });
      p.axes(); p.vline(0, 'marker');
      terms.forEach((t, i) => {
        const y0 = terms.length - i - 0.75, y1 = terms.length - i - 0.25;
        p.rect(0, y0, t[1], y1, t[1] >= 0 ? 'bar c2f' : 'bar c1f');
        p.text(t[1] >= 0 ? t[1] + 0.15 : t[1] - 0.15, (y0 + y1) / 2, `${t[0]}: ${f2(t[1], 2)}`, 'annot', t[1] >= 0 ? 'start' : 'end');
      });
      ro([
        ['Log-odds', f2(logOdds, 2)],
        ['P(high risk) = 1/(1+e^-logodds)', pct(P, 3), P > 0.5 ? 'bad' : 'good']
      ]);
      publish(box, { logOdds, p: P });
    }
    draw();
  };

  // ======================================================================
  // M7: production break, unit theory (Fig 7.46)
  reg['lc-break'] = box => {
    title(box, 'Production break', 'unit theory — partial loss of learning re-anchors the curve');
    const v = controls(box, [
      { k: 't1', label: 'T1 (a)', min: 10, max: 1000, step: 10, v: 100 },
      { k: 'lcs', label: 'LCS', min: 0.7, max: 0.99, step: 0.005, v: 0.90, fmt: x => (x * 100).toFixed(1) + '%' },
      { k: 'n', label: 'Break unit N', type: 'number', min: 1, step: 1, v: 5 },
      { k: 'L', label: 'Learning lost L%', min: 0, max: 100, step: 5, v: 50, fmt: x => x.toFixed(0) + '%' }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    legend(box, [['c1', 'original curve'], ['c2', 'post-break curve']]);
    const ro = readout(box);
    const note = E('div', 'w-note', 'Source example rounds $b$ to −0.152 (from LCS 90%); using the exact $b=\\ln(LCS)/\\ln2$ reproduces the same 89.15 / 2.128 / 84.081 to 3 decimals.');
    box.appendChild(note);
    function draw() {
      pb.innerHTML = '';
      const a = v.t1, b = Math.log(v.lcs) / Math.log(2), N = Math.max(1, Math.round(v.n)), L = v.L / 100;
      const aP = L * a + (1 - L) * a * Math.pow(N, b);
      const Q = Math.pow(aP / a, 1 / b);
      const Xmax = Math.max(20, N + 15);
      const orig = [], post = [];
      for (let x = 1; x <= Xmax; x++) {
        orig.push([x, a * Math.pow(x, b)]);
        post.push([x, x < N ? a * Math.pow(x, b) : a * Math.pow(Q + (x - N), b)]);
      }
      const ymax = a * 1.05;
      const p = Plot.create(pb, { xmin: 0, xmax: Xmax + 1, ymin: 0, ymax, xlabel: 'unit number', ylabel: 'unit cost' });
      p.axes();
      p.line(orig, 'series c1');
      p.line(post, 'series c2');
      p.vline(N, 'marker');
      const unitNplus1 = a * Math.pow(Q + (N + 1 - N), b);
      ro([
        ['$b = \\ln(LCS)/\\ln 2$', f2(b, 3)],
        ["Break unit cost $a'$", f2(aP)],
        ['Effective unit number $Q$', f2(Q, 3)],
        [`Unit ${N + 1} cost (post-break)`, f2(unitNplus1)]
      ]);
      publish(box, { aP, Q, unitNplus1 });
    }
    draw();
  };

  // ======================================================================
  // M7: retrograde analysis (Anderlohr) — assessing lost learning
  reg['retrograde'] = box => {
    title(box, 'Retrograde analysis', 'Anderlohr method — weight each factor’s contribution to lost learning');
    const rows = [
      { k: 'pers', label: 'Personnel learning', w: 30, p: 40 },
      { k: 'sup', label: 'Supervisory learning', w: 20, p: 30 },
      { k: 'cont', label: 'Continuity of productivity', w: 20, p: 50 },
      { k: 'meth', label: 'Methods', w: 15, p: 20 },
      { k: 'tool', label: 'Special tooling', w: 15, p: 25 }
    ];
    const defs = [];
    rows.forEach(r => {
      defs.push({ k: r.k + 'W', label: r.label + ' — weight%', min: 0, max: 100, step: 1, v: r.w });
      defs.push({ k: r.k + 'P', label: r.label + ' — % lost', min: 0, max: 100, step: 1, v: r.p });
    });
    defs.push({ k: 't1', label: 'T1 (a)', min: 10, max: 1000, step: 10, v: 100 });
    defs.push({ k: 'lcs', label: 'LCS', min: 0.7, max: 0.99, step: 0.005, v: 0.90, fmt: x => (x * 100).toFixed(1) + '%' });
    defs.push({ k: 'n', label: 'Break unit N', type: 'number', min: 1, step: 1, v: 5 });
    const v = controls(box, defs, draw);
    const pb = E('div'); box.appendChild(pb);
    const ro = readout(box);
    function draw() {
      pb.innerHTML = '';
      const weightSum = rows.reduce((s, r) => s + v[r.k + 'W'], 0);
      const wLearningLost = rows.reduce((s, r) => s + v[r.k + 'W'] * v[r.k + 'P'], 0) / (weightSum || 1) / 100;
      const p = Plot.create(pb, { h: 220, xmin: 0, xmax: 100, ymin: 0, ymax: rows.length, yticks: rows.length, xlabel: '% lost (bar width = weight)', yfmt: () => '', pad: { l: 20, r: 16, t: 10, b: 40 } });
      p.axes();
      rows.forEach((r, i) => {
        const y0 = rows.length - i - 0.75, y1 = rows.length - i - 0.25;
        p.rect(0, y0, v[r.k + 'P'], y1, 'bar c1f');
        p.text(2, (y0 + y1) / 2, `${r.label}: w${v[r.k + 'W']}% × lost${v[r.k + 'P']}%`, 'annot', 'start');
      });
      const a = v.t1, b = Math.log(v.lcs) / Math.log(2), N = Math.max(1, Math.round(v.n)), L = wLearningLost;
      const aP = L * a + (1 - L) * a * Math.pow(N, b);
      const Q = Math.pow(aP / a, 1 / b);
      ro([
        ['Weight sum', weightSum.toFixed(0) + '%', weightSum !== 100 ? 'bad' : 'good'],
        ['Weighted % learning lost', pct(wLearningLost, 1)],
        ["Break unit cost $a'$ (T1 " + a + ', LCS ' + pct(v.lcs, 0) + ', N ' + N + ')', f2(aP)],
        ['Effective unit number $Q$', f2(Q, 3)]
      ]);
      publish(box, { weightSum, wLearningLost, aP, Q });
    }
    draw();
  };

  // ======================================================================
  // M7: lot table — unit theory, lot boundaries (Fig 7.4)
  reg['lot-table'] = box => {
    title(box, 'Lot cost table', 'unit theory — drag lot boundaries to see lot totals and CAUC');
    const N = 8;
    const v = controls(box, [
      { k: 't1', label: 'T1', min: 10, max: 5000, step: 10, v: 1000 },
      { k: 'lcs', label: 'LCS', min: 0.7, max: 0.99, step: 0.005, v: 0.85, fmt: x => (x * 100).toFixed(1) + '%' },
      { k: 'split', label: 'Lot 1 last unit (of 8)', type: 'number', min: 1, max: 7, step: 1, v: 3 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    const note = E('div', 'w-note', 'Unit costs cannot be recovered from lot totals alone — the lot total only fixes the average.');
    box.appendChild(note);
    const ro = readout(box);
    function draw() {
      const a = v.t1, b = Math.log(v.lcs) / Math.log(2);
      const uc = x => a * Math.pow(x, b);
      const units = []; let cum = 0;
      for (let x = 1; x <= N; x++) { cum += uc(x); units.push({ x, cost: uc(x), cum, cauc: cum / x }); }
      const split = Math.min(N - 1, Math.max(1, Math.round(v.split)));
      const lot1 = units.slice(0, split), lot2 = units.slice(split);
      const lotTotal = arr => arr.reduce((s, u) => s + u.cost, 0);
      const l1total = lotTotal(lot1), l2total = lotTotal(lot2);
      const l1auc = l1total / lot1.length, l2auc = l2total / lot2.length;
      const rowsHtml = units.map(u => `<tr><td>${u.x}</td><td>${f2(u.cost)}</td><td>${f2(u.cum)}</td><td>${f2(u.cauc)}</td><td>${u.x <= split ? '1' : '2'}</td></tr>`).join('');
      pb.innerHTML = `<table class="w-table"><thead><tr><th>Unit</th><th>Unit cost</th><th>Cum. cost</th><th>CAUC</th><th>Lot</th></tr></thead><tbody>${rowsHtml}</tbody></table>`;
      ro([
        [`Lot 1 (units 1–${split})`, `total ${f2(l1total)}, AUC ${f2(l1auc)}`],
        [`Lot 2 (units ${split + 1}–${N})`, `total ${f2(l2total)}, AUC ${f2(l2auc)}`],
        [`Unit ${N} cost`, f2(units[N - 1].cost)],
        [`Cumulative cost through ${N}`, f2(units[N - 1].cum)],
        [`CAUC through ${N}`, f2(units[N - 1].cauc)]
      ]);
      publish(box, { unit2: units[1].cost, unit4: units[3].cost, unit8: units[7].cost, cum8: units[7].cum, cauc8: units[7].cauc, lot2Total: l2total, lot2AUC: l2auc, lot1Total: l1total });
    }
    draw();
  };

  // ======================================================================
  // M7: unit (Crawford) vs CUMAV (Wright) theory comparison
  reg['lc-compare'] = box => {
    title(box, 'Unit vs. CUMAV theory', 'same T1 and LCS, two different cost-quantity theories');
    const v = controls(box, [
      { k: 't1', label: 'T1', min: 10, max: 1000, step: 10, v: 100 },
      { k: 'lcs', label: 'LCS', min: 0.7, max: 0.99, step: 0.005, v: 0.85, fmt: x => (x * 100).toFixed(1) + '%' },
      { k: 'n', label: 'Units N', min: 4, max: 60, step: 1, v: 20 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    legend(box, [['c1', 'Unit theory (Crawford)'], ['c2', 'CUMAV theory (Wright)']]);
    const ro = readout(box);
    function draw() {
      pb.innerHTML = '';
      const a = v.t1, b = Math.log(v.lcs) / Math.log(2), N = Math.round(v.n);
      const unitCurve = [], cumavCurve = [];
      let unitTotal = 0;
      for (let x = 1; x <= N; x++) {
        const u = a * Math.pow(x, b);
        unitTotal += u;
        unitCurve.push([x, u]);
        const cumavTotalX = a * Math.pow(x, b + 1);
        const cumavUnit = x === 1 ? cumavTotalX : cumavTotalX - a * Math.pow(x - 1, b + 1);
        cumavCurve.push([x, cumavUnit]);
      }
      const cumavTotalN = a * Math.pow(N, b + 1);
      const cumavUnitN = N === 1 ? cumavTotalN : cumavTotalN - a * Math.pow(N - 1, b + 1);
      const unitUnitN = unitCurve[N - 1][1];
      const ymax = a * 1.05;
      const p = Plot.create(pb, { xmin: 0, xmax: N + 1, ymin: 0, ymax, xlabel: 'unit number', ylabel: 'unit cost' });
      p.axes();
      p.line(unitCurve, 'series c1');
      p.line(cumavCurve, 'series c2');
      ro([
        ['$b = \\ln(LCS)/\\ln 2$', f2(b, 3)],
        [`Unit theory total cost through ${N}`, f2(unitTotal)],
        [`CUMAV total cost through ${N} = a·N^(b+1)`, f2(cumavTotalN)],
        [`Unit theory unit ${N} cost`, f2(unitUnitN)],
        [`CUMAV unit ${N} cost = total(${N}) − total(${N - 1})`, f2(cumavUnitN)]
      ]);
      publish(box, { unitTotal, cumavTotalN, unitUnitN, cumavUnitN });
    }
    draw();
  };

  return { get: n => reg[n], names: () => Object.keys(reg), mount, _math: { ols, mean, sd, median } };
})();
