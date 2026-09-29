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
      seeker: ['Seeker (CEBoK)', [[4, 5], [7, 5], [8, 10], [12, 7], [16, 13]]],
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

  // M14: FPIF scenarios (Fig. 14.8 example) — guess/reveal + free slider
  reg['fpif-scenarios'] = box => {
    title(box, 'FPIF worked example', 'TC $90M, TP $9M, ceiling $108M — guess the outcome, then check against a free slider');
    const TC = 90, TP = 9, CP = 108, GS = 0.7; // gov share over target; under-target share implied 80/20 by source arithmetic
    const TPRICE = TC + TP; // 99
    const PTA = TC + (CP - TPRICE) / GS; // 90 + 9/0.7 = 102.857
    const SCEN = {
      s1: { fc: 85, label: 'Scenario 1: FC $85M (below target)' },
      s2: { fc: 97, label: 'Scenario 2: FC $97M (above target, below PTA)' },
      s3: { fc: 105, label: 'Scenario 3: FC $105M (above PTA)' }
    };
    function calc(fc) {
      const cs = fc <= TC ? 0.2 : 0.3; // contractor share: under-target 20%, over-target 30% (source's implied ratios)
      let profit = TP + cs * (TC - fc);
      let price = fc + profit;
      if (price > CP) { price = CP; profit = CP - fc; }
      return { profit, price };
    }
    const v = controls(box, [
      { k: 'scenario', label: 'Scenario', type: 'select', v: 's1', options: [['s1', SCEN.s1.label], ['s2', SCEN.s2.label], ['s3', SCEN.s3.label]] },
      { k: 'guessPrice', label: 'Your guess: final price ($M)', type: 'number', v: 95 },
      { k: 'guessProfit', label: 'Your guess: contractor profit ($M)', type: 'number', v: 10 },
      { k: 'fc', label: 'Free slider: final cost ($M)', min: 80, max: 115, step: 0.5, v: 90 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    legend(box, [['c1', 'price'], ['c2', 'profit'], ['c3', 'ceiling'], ['c3', 'PTA']]);
    const ro = readout(box);
    const note = E('div', 'w-note'); box.appendChild(note);
    const revealBtn = E('button', 'btn small'); revealBtn.textContent = 'Reveal';
    let revealed = false, lastKey = null;
    revealBtn.onclick = () => { revealed = true; draw(); };
    box.appendChild(revealBtn);
    function draw() {
      const key = v.scenario + '|' + v.guessPrice + '|' + v.guessProfit;
      if (key !== lastKey) { lastKey = key; revealed = false; }
      pb.innerHTML = '';
      const lo = 80, hi = 115;
      const r = calc(v.fc);
      const p = Plot.create(pb, { xmin: lo, xmax: hi, ymin: 0, ymax: CP * 1.1, xlabel: 'final cost ($M)', ylabel: '$M' });
      p.axes();
      p.fn(x => calc(x).price, 'series c1'); p.fn(x => calc(x).profit, 'series c2'); p.hline(CP, 'marker c3'); p.vline(PTA, 'marker c3');
      p.text(PTA, CP * 1.04, 'PTA', 'annot', 'middle');
      p.vline(v.fc, 'marker hot');
      const s = SCEN[v.scenario], sr = calc(s.fc);
      const rows = [
        ['Target price (TC + TP)', '$' + f2(TPRICE, 0) + 'M'],
        ['PTA = TC + (CP−TP)/gov share', '$' + f2(PTA, 2) + 'M'],
        [s.label, ''],
        ['Your guess: price / profit', '$' + f2(v.guessPrice, 1) + 'M / $' + f2(v.guessProfit, 1) + 'M']
      ];
      if (revealed) {
        rows.push(['Actual price / profit', '$' + f2(sr.price, 1) + 'M / $' + f2(sr.profit, 1) + 'M', 'good']);
        const okP = Math.abs(sr.price - v.guessPrice) < 0.5, okPr = Math.abs(sr.profit - v.guessProfit) < 0.5;
        rows.push(['Guess check', (okP && okPr) ? 'both close' : (okP || okPr) ? 'partly close' : 'off', (okP && okPr) ? 'good' : 'bad']);
      }
      rows.push(['Free slider at FC $' + f2(v.fc, 1) + 'M — price / profit', '$' + f2(r.price, 1) + 'M / $' + f2(r.profit, 1) + 'M']);
      ro(rows);
      note.textContent = 'Source (L388-420) gives TC $90M, TP $9M (10%), target price $99M, ceiling $108M, PTA $102.86M, and scenario results (FC85→profit10/price95; FC97→profit6.9/price103.9; FC105→price capped 108/profit3). The source does not state the 80/20 under-target and 70/30 over-target share ratios in prose — they are recovered from its arithmetic and used here to drive the free slider.';
      publish(box, { tpPrice: TPRICE, pta: PTA, price: r.price, profit: r.profit, scenarioPrice: sr.price, scenarioProfit: sr.profit });
    }
    draw();
  };

  // M14: CPAF scenarios (Fig. 14.9 example) — guess/reveal
  reg['cpaf-scenarios'] = box => {
    title(box, 'CPAF worked example', 'TC $90M, potential fee $9M, cost ceiling $108M, earned fee $8.2M in every scenario');
    const TC = 90, CEIL = 108, FEE = 8.2;
    const SCEN = {
      s1: { fc: 85, label: 'Scenario 1: FC $85M (below target)' },
      s2: { fc: 102, label: 'Scenario 2: FC $102M (above target)' },
      s3: { fc: 115, label: 'Scenario 3: FC $115M (above cost ceiling)' }
    };
    function calc(fc) {
      if (fc <= CEIL) return { price: fc + FEE, profit: FEE };
      return { price: CEIL + FEE, profit: CEIL + FEE - fc };
    }
    const v = controls(box, [
      { k: 'scenario', label: 'Scenario', type: 'select', v: 's1', options: [['s1', SCEN.s1.label], ['s2', SCEN.s2.label], ['s3', SCEN.s3.label]] },
      { k: 'guessPrice', label: 'Your guess: final price ($M)', type: 'number', v: 93 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    legend(box, [['c1', 'price'], ['c2', 'contractor profit'], ['c3', 'cost ceiling']]);
    const ro = readout(box);
    const note = E('div', 'w-note'); box.appendChild(note);
    const revealBtn = E('button', 'btn small'); revealBtn.textContent = 'Reveal';
    let revealed = false, lastKey = null;
    revealBtn.onclick = () => { revealed = true; draw(); };
    box.appendChild(revealBtn);
    function draw() {
      const key = v.scenario + '|' + v.guessPrice;
      if (key !== lastKey) { lastKey = key; revealed = false; }
      pb.innerHTML = '';
      const lo = 80, hi = 120;
      const p = Plot.create(pb, { xmin: lo, xmax: hi, ymin: -5, ymax: CEIL * 1.1, xlabel: 'final cost ($M)', ylabel: '$M' });
      p.axes(); p.hline(0, 'marker');
      p.fn(x => calc(x).price, 'series c1'); p.fn(x => calc(x).profit, 'series c2'); p.vline(CEIL, 'marker c3');
      p.text(CEIL, CEIL * 1.04, 'cost ceiling', 'annot', 'middle');
      const s = SCEN[v.scenario], sr = calc(s.fc);
      p.vline(s.fc, 'marker hot');
      const rows = [
        [s.label, ''],
        ['Your guess: final price', '$' + f2(v.guessPrice, 1) + 'M']
      ];
      if (revealed) {
        rows.push(['Actual price', '$' + f2(sr.price, 1) + 'M', 'good']);
        rows.push(['Contractor profit', '$' + f2(sr.profit, 1) + 'M', sr.profit < FEE ? 'bad' : 'good']);
        rows.push(['Guess check', Math.abs(sr.price - v.guessPrice) < 0.5 ? 'close' : 'off', Math.abs(sr.price - v.guessPrice) < 0.5 ? 'good' : 'bad']);
        if (s.fc > CEIL) rows.push(['Note', 'Government pays costs only up to the cost ceiling; exceeding it needs written authorization. Profit is reduced by the amount above ceiling ($' + f2(s.fc - CEIL, 1) + 'M), not simply cost + fee.']);
      }
      ro(rows);
      note.textContent = 'Source (L445-475, Fig. 14.9): earned award fee is $8.2M in all three scenarios (potential fee $9M/10%). FC85→price93.2; FC102→price110.2; FC115 exceeds the $108M cost ceiling, so price = ceiling + fee = $116.2M and contractor profit = 116.2 − 115 = $1.2M (reduced by $7M versus an unbounded cost-plus-fee result). Fee is judgmental, not formula-driven, in general CPAF use.';
      publish(box, { price: sr.price, profit: sr.profit, guessOk: Math.abs(sr.price - v.guessPrice) < 0.5 });
    }
    draw();
  };

  // M14: contract type spectrum — cost-risk sharing across FFP/FPI(F)/CPIF/CPAF/CPFF
  reg['contract-spectrum'] = box => {
    title(box, 'Contract type spectrum', 'who bears cost risk, from FFP to CPFF (base case: Fig. 14.5)');
    const TC = 10, TP = 1, TPRICE = TC + TP; // $11M, revenue-at-TC 9.09%
    const CEIL_FPI = 12; // Fig 14.7
    const MINFEE = 0.3, MAXFEE = 2.0; // CPIF
    const v = controls(box, [
      { k: 'type', label: 'Contract type', type: 'select', v: 'fpif', options: [['ffp', 'FFP'], ['fpif', 'FPI(F)'], ['cpif', 'CPIF'], ['cpaf', 'CPAF'], ['cpff', 'CPFF']] },
      { k: 'gs', label: 'Gov/contractor share', min: 0.5, max: 0.9, step: 0.1, v: 0.8, fmt: x => `${Math.round(x * 100)}/${Math.round((1 - x) * 100)}` },
      { k: 'overlay', label: 'Overlay all types (envelope)', type: 'checkbox', v: false },
      { k: 'fc', label: 'Final cost ($M)', min: 4, max: 16, step: 0.25, v: TC }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    const ro = readout(box);
    const note = E('div', 'w-note'); box.appendChild(note);
    function calcFor(type, gs, fc) {
      const cs = 1 - gs;
      if (type === 'ffp') { const price = TPRICE; return { price, profit: price - fc }; }
      if (type === 'cpff') { const fee = TP; return { price: fc + fee, profit: fee }; }
      if (type === 'fpif') {
        let profit = TP + cs * (TC - fc), price = fc + profit;
        if (price > CEIL_FPI) { price = CEIL_FPI; profit = CEIL_FPI - fc; }
        return { price, profit };
      }
      if (type === 'cpif') {
        const fee = Math.min(MAXFEE, Math.max(MINFEE, TP + cs * (TC - fc)));
        return { price: fc + fee, profit: fee };
      }
      // cpaf: qualitative, flat band around target fee
      return { price: fc + TP, profit: TP };
    }
    function draw() {
      pb.innerHTML = '';
      const lo = 4, hi = 16;
      const p = Plot.create(pb, { xmin: lo, xmax: hi, ymin: -1, ymax: 3, xlabel: 'final cost ($M)', ylabel: 'contractor profit ($M)' });
      p.axes(); p.hline(0, 'marker'); p.vline(TC, 'marker'); p.text(TC, 2.9, 'TC', 'annot', 'middle');
      const TYPES = [['ffp', 'c3'], ['fpif', 'c1'], ['cpif', 'c2'], ['cpaf', 'band'], ['cpff', 'c4']];
      if (v.overlay) {
        TYPES.forEach(([t, cls]) => {
          if (t === 'cpaf') { p.rect(lo, TP - 0.3, hi, TP + 0.3, 'band'); return; }
          p.fn(x => calcFor(t, v.gs, x).profit, 'series ' + cls);
        });
        legend(box, TYPES.map(([t, cls]) => [cls, t.toUpperCase()]));
      } else if (v.type === 'cpaf') {
        p.rect(lo, TP - 0.3, hi, TP + 0.3, 'band'); p.text((lo + hi) / 2, TP + 0.45, 'fee band (judgmental, not formula-driven)', 'annot', 'middle');
      } else {
        p.fn(x => calcFor(v.type, v.gs, x).profit, 'series c1');
      }
      p.vline(v.fc, 'marker hot');
      const r = calcFor(v.type, v.gs, v.fc);
      const riskLabel = v.type === 'ffp' ? 'contractor bears 100% of each overrun dollar' :
        v.type === 'cpff' ? 'government bears 100% of each overrun dollar (fee fixed)' :
        v.type === 'cpaf' ? 'fee set by government evaluation, not a cost formula' :
        `shared ${Math.round(v.gs * 100)}/${Math.round((1 - v.gs) * 100)} (gov/contractor) within incentive range`;
      ro([
        ['Base case: TC / TP / price', '$' + TC + 'M / $' + TP + 'M / $' + f2(TPRICE, 0) + 'M'],
        ['Revenue at TC (TP/price)', pct(TP / TPRICE)],
        ['Risk sharing', riskLabel],
        ['At final cost $' + f2(v.fc, 2) + 'M — price / profit', '$' + f2(r.price, 2) + 'M / $' + f2(r.profit, 2) + 'M', r.profit < 0 ? 'bad' : 'good']
      ]);
      note.textContent = 'Base case is Fig. 14.5 (L249-251): TC $10M, TP $1M, price $11M, revenue at TC 9.09%. FFP = 0/100 shareline (contractor absorbs every dollar); CPFF = 100/0 (fee fixed at $1M, price moves dollar-for-dollar with cost). FPI ceiling $12M is Fig. 14.7; CPIF min/max fee $0.3M/$2.0M is L484-489 (3%/20% of TC). Default share 80/20 is illustrative; CEBoK (L335-339) notes 90/10 for high-risk work and up to 50/50 for maximum incentive. Per L1009-1024, CPFF and FFP bound the envelope of outcomes, with CPIF parallel to CPFF beyond its min/max fee and FPI parallel to FFP beyond the PTA. CPAF fee comes from a judgmental evaluation, not a formula, so it is shown as a flat band, not a function of cost.';
      publish(box, { type: v.type, price: r.price, profit: r.profit, riskLabel });
    }
    draw();
  };

  // M14: BOE calculator — part A build-up (E = R*P), part B fee/margin converter
  reg['boe-calc'] = box => {
    title(box, 'Basis of estimate: build-up and fee/margin', 'Fig. 14.13 LOC build-up, and the fee/margin converter (L228-237)');
    const v = controls(box, [
      { k: 'loc', label: 'Lines of code', min: 100, max: 5000, step: 1, v: 1776 },
      { k: 'hpl', label: 'Hours per LOC (productivity rate)', min: 0.1, max: 3, step: 0.01, v: 1.19 },
      { k: 'rate', label: 'Labor rate ($/hr)', min: 10, max: 100, step: 1, v: 42 },
      { k: 'feePct', label: 'Fee % (of cost)', min: 0, max: 40, step: 0.5, v: 10, fmt: x => x.toFixed(1) + '%' }
    ], draw);
    const tb = E('div', 'w-table'); box.appendChild(tb);
    const ro = readout(box);
    const note = E('div', 'w-note'); box.appendChild(note);
    function draw() {
      const hrs = Math.round(v.loc * v.hpl * 10) / 10; // CEBoK rounds hours to 0.1 before pricing
      const dollars = hrs * v.rate;
      const feeFrac = v.feePct / 100;
      const marginFrac = feeFrac / (1 + feeFrac);
      const price = dollars * (1 + feeFrac);
      const profit = price - dollars;
      tb.innerHTML = '<table><thead><tr><th>Step</th><th>Formula</th><th>Value</th></tr></thead><tbody>' +
        `<tr><td>Hours (R×P)</td><td>${f2(v.loc, 0)} LOC × ${f2(v.hpl, 2)} hrs/LOC</td><td>${f2(hrs, 1)} hrs</td></tr>` +
        `<tr><td>Direct dollars</td><td>${f2(hrs, 1)} hrs × $${f2(v.rate, 0)}/hr</td><td>$${f2(dollars, 0)}</td></tr>` +
        `<tr><td>Fee (${pct(feeFrac)})</td><td>Fee% × cost</td><td>$${f2(profit, 0)}</td></tr>` +
        `<tr><td>Price</td><td>cost + fee</td><td>$${f2(price, 0)}</td></tr></tbody></table>`;
      ro([
        ['E = R × P (hours)', f2(hrs, 1) + ' hrs'],
        ['Direct dollars', '$' + f2(dollars, 0)],
        ['Fee % → Margin % (Fee%/(1+Fee%))', pct(marginFrac)],
        ['Margin % → Fee % (Margin%/(1−Margin%))', 'check: ' + pct(marginFrac / (1 - marginFrac))],
        ['Revenue = Cost + Profit = Price', '$' + f2(price, 0)]
      ]);
      note.textContent = 'Part A defaults reproduce Fig. 14.13 (L602-613): 1,776 LOC × 1.19 hrs/LOC = 2,113.4 hrs × $42/hr = $88,763 direct dollars (build-up style, E = R×P). Part B follows L228-237: Margin% = Fee%/(1+Fee%), Fee% = Margin%/(1−Margin%); at the default 10% fee, margin is 9.09%, matching the base-case revenue-at-TC figure elsewhere in the module.';
      publish(box, { hrs, dollars, feePct: v.feePct, marginPct: marginFrac * 100, price, profit });
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

  // M15: EV measurement method picker (Fig. 15.11 rules) + LOE demo
  reg['ev-method'] = box => {
    title(box, 'Picking an EV measurement method', 'match the work package to milestones / % complete / 0-100 / 50-50 / LOE (Fig. 15.11, L403-428)');
    const WP = {
      wp1: { label: 'WP1: 6-month design effort, monthly drawing-package milestones', duration: 6, deliverable: 'drawings, monthly milestones', costTiming: 'spread over duration', correct: 'milestones' },
      wp2: { label: 'WP2: one-day kickoff meeting', duration: 0.25, deliverable: 'meeting held', costTiming: 'incurred that day', correct: '0-100' },
      wp3: { label: 'WP3: equipment purchase, cost hits at delivery', duration: 3, deliverable: 'equipment received', costTiming: 'all cost at delivery (purchase)', correct: '0-100' },
      wp4: { label: 'WP4: 2-month test campaign, no intermediate milestones', duration: 2, deliverable: 'test report at end', costTiming: 'spread over duration', correct: '50-50' },
      wp5: { label: 'WP5: multi-month procurement of subcontracted pieces, fixed total cost', duration: 8, deliverable: 'subcontract deliverables, hard to milestone', costTiming: 'pieces of fixed cost over months', correct: 'percent' },
      wp6: { label: 'WP6: ongoing program management support staff, no specific deliverable', duration: 12, deliverable: 'none (time-related support)', costTiming: 'steady over duration', correct: 'loe' }
    };
    const METHNAME = { milestones: 'Milestones', percent: 'Percent complete', '0-100': '0/100', '50-50': '50/50', loe: 'Level of Effort' };
    const WHY = {
      wp1: 'Duration > 2 months with >=1 milestone/month is exactly the milestone rule (L403-406).',
      wp2: 'A one-day meeting is a very short package (<1 month) with cost at the event — 0/100 (L414-418).',
      wp3: 'Purchases price in fully at delivery even if the package spans months — 0/100 (L414-418).',
      wp4: 'Duration <=2 months with no intermediate milestones is the 50/50 rule (L419-421).',
      wp5: 'Procurement of pieces of a fixed total cost over several months is the named use case for percent complete (L407-410) — used sparingly since it is the most subjective method.',
      wp6: 'No measurable output, time-related support — LOE (L422-428): BCWP is planned to equal BCWS, so no schedule variance is possible, but cost variance can still occur.'
    };
    const v = controls(box, [
      { k: 'wp', label: 'Work package', type: 'select', v: 'wp1', options: Object.keys(WP).map(k => [k, WP[k].label]) },
      { k: 'guess', label: 'Your method', type: 'select', v: 'milestones', options: [['milestones', 'Milestones'], ['percent', 'Percent complete'], ['0-100', '0/100'], ['50-50', '50/50'], ['loe', 'Level of Effort']] }
    ], draw);
    const cardEl = E('div', 'w-table'); box.appendChild(cardEl);
    const ro = readout(box);
    const note = E('div', 'w-note'); box.appendChild(note);
    const revealBtn = E('button', 'btn small'); revealBtn.textContent = 'Reveal';
    let revealed = false, lastKey = null;
    revealBtn.onclick = () => { revealed = true; draw(); };
    box.appendChild(revealBtn);
    // Small LOE demo: planned == earned (straight-line), actuals run high -> SV=0, CV<0
    const loeMonths = [1, 2, 3, 4, 5, 6];
    const loePlanPerMo = 100, loeActualPerMo = 120;
    const loeRows = loeMonths.map(m => {
      const bcws = loePlanPerMo * m, bcwp = bcws, acwp = loeActualPerMo * m;
      return { m, bcws, bcwp, acwp, sv: bcwp - bcws, cv: bcwp - acwp };
    });
    function draw() {
      const key = v.wp + '|' + v.guess;
      if (key !== lastKey) { lastKey = key; revealed = false; }
      const wp = WP[v.wp];
      cardEl.innerHTML = '<table><thead><tr><th>Attribute</th><th>Value</th></tr></thead><tbody>' +
        `<tr><td>Duration</td><td>${wp.duration < 1 ? '<1 month' : f2(wp.duration, wp.duration % 1 ? 1 : 0) + ' month(s)'}</td></tr>` +
        `<tr><td>Deliverable</td><td>${wp.deliverable}</td></tr>` +
        `<tr><td>Cost timing</td><td>${wp.costTiming}</td></tr></tbody></table>`;
      const rows = [
        [wp.label, ''],
        ['Your pick', METHNAME[v.guess]]
      ];
      if (revealed) {
        const ok = v.guess === wp.correct;
        rows.push(['Correct method', METHNAME[wp.correct], 'good']);
        rows.push(['Check', ok ? 'match' : 'mismatch', ok ? 'good' : 'bad']);
        rows.push(['Why', WHY[v.wp]]);
      }
      rows.push(['LOE demo (months 1-6): BCWS=BCWP (planned=earned)', loeRows.map(r => f2(r.bcws, 0)).join(', ')]);
      rows.push(['LOE demo: ACWP (actual runs 20% high)', loeRows.map(r => f2(r.acwp, 0)).join(', ')]);
      rows.push(['LOE demo: SV = EV - PV (always 0)', loeRows.map(r => f2(r.sv, 0)).join(', ')]);
      rows.push(['LOE demo: CV = EV - AC (goes negative)', loeRows.map(r => f2(r.cv, 0)).join(', '), 'bad']);
      ro(rows);
      note.textContent = 'Rules from Fig. 15.11 (L403-428): Milestones best for >2-month packages with >=1 milestone/month; 0/100 for very short (<1 month) packages or ones where cost is not incurred until the end (purchases, one-day meetings, trips); 50/50 for <=2-month packages with no intermediate milestones; percent complete is most subjective and used sparingly, typically for procurement pieces of a fixed total cost; LOE is for time-related work with no measurable output, where performance is planned/earned straight-line so BCWP=BCWS (SV=0) but cost variance can still occur if actuals run high, as shown in the demo above.';
      publish(box, { wp: v.wp, guess: v.guess, correct: wp.correct, isMatch: v.guess === wp.correct, loeSvAll0: loeRows.every(r => r.sv === 0), loeCvAtM6: loeRows[5].cv });
    }
    draw();
  };

  // M15: EVM anomaly spotter (Fig. 15.18)
  reg['evm-anomaly'] = box => {
    title(box, 'EVM anomaly spotter', 'diagnose the data row against Fig. 15.18 past-performance anomalies (L628-676)');
    const CASES = {
      c1: { label: 'Case 1', row: { bcws: 500, bcwp: 500, acwp: 500, bac: 1000, eac: 1000 }, ans: 'equal', why: 'BCWS = BCWP = ACWP: indicates EV is not really being used — for non-LOE tasks all three being identical suggests EVM is not being applied to that task (L631-634).' },
      c2: { label: 'Case 2', row: { bcws: 400, bcwp: 300, acwp: 0, bac: 1000, eac: 950 }, ans: 'bcwpNoAcwp', why: 'BCWP > 0 but ACWP = 0: over performance / a lag between costs being incurred and filtering through accounting (e.g. a trip not yet invoiced) (L635-646).' },
      c3: { label: 'Case 3', row: { bcws: 0, bcwp: 150, acwp: 140, bac: 1000, eac: 1000 }, ans: 'bcwpNoBcws', why: 'BCWP > 0 but BCWS = 0: performance depends on having a plan, so this should never occur cumulatively; in current-period data it can happen when a behind-schedule task is catching up and the BCWS was in a prior month (L647-652).' },
      c4: { label: 'Case 4', row: { bcws: 300, bcwp: 0, acwp: 200, bac: 1000, eac: 1050 }, ans: 'acwpNoBcwp', why: 'ACWP > 0 but BCWP = 0: actuals normally land in the same month as performance; can be invoice lag, or cost incurred on effort that was not completed so EV could not be claimed (L653-659).' },
      c5: { label: 'Case 5', row: { bcws: 1100, bcwp: 900, acwp: 950, bac: 1000, eac: 1050 }, ans: 'overBac', why: 'BCWP or BCWS > BAC: should not happen — there cannot be more than 100% planned or completed work (L660-661).' },
      c6: { label: 'Case 6', row: { bcws: 400, bcwp: 400, acwp: 50, bac: 900, eac: 0 }, ans: 'bacNoEac', why: 'BAC > 0 and EAC = 0: may happen if an effort is expected to be down-scoped but the ECP has not yet been implemented in the EV data; with ACWP present it should not occur unless charges are pending a move to another WBS (L662-665).' },
      c7: { label: 'Case 7', row: { bcws: 100, bcwp: 90, acwp: 110, bac: 0, eac: 500 }, ans: 'eacNoBac', why: 'EAC > 0 and BAC = 0: should only occur for new work awaiting a contract change to add BAC; the contractor may load an EAC against a $0 WBS task to capture the expected value (L666-669).' },
      c8: { label: 'Case 8', row: { bcws: -50, bcwp: -40, acwp: -45, bac: 1000, eac: 1000 }, ans: 'allNeg', why: 'BCWS, BCWP, ACWP all negative: should only occur in current-period data (e.g. rate-adjustment WBS lines, error corrections, or work/cost transfers between WBS lines) (L670-674).' },
      c9: { label: 'Case 9', row: { bcws: 500, bcwp: 500, acwp: 480, bac: -100, eac: 900 }, ans: 'negBacEac', why: 'BAC < 0 or EAC < 0: should never happen — it would imply the contractor gives money to the government for work performed (L675-676).' },
      c10: { label: 'Case 10 (aquarium)', row: { bcws: 400, bcwp: 200, acwp: 300, bac: 800, eac: 1200 }, ans: 'none', why: 'No anomaly: all values are positive, within range of BAC, and BAC/EAC are both present — an ordinary, if underperforming, data row (L677-680).' }
    };
    const ANSWERS = [
      ['equal', 'BCWS = BCWP = ACWP'], ['bcwpNoAcwp', 'BCWP > 0, ACWP = 0'], ['bcwpNoBcws', 'BCWP > 0, BCWS = 0'],
      ['acwpNoBcwp', 'ACWP > 0, BCWP = 0'], ['overBac', 'BCWP or BCWS > BAC'], ['bacNoEac', 'BAC > 0, EAC = 0'],
      ['eacNoBac', 'EAC > 0, BAC = 0'], ['allNeg', 'BCWS, BCWP, ACWP all negative'], ['negBacEac', 'BAC < 0 or EAC < 0'],
      ['none', 'No anomaly']
    ];
    const v = controls(box, [
      { k: 'caseId', label: 'Data row', type: 'select', v: 'c10', options: Object.keys(CASES).map(k => [k, CASES[k].label]) },
      { k: 'guess', label: 'Which anomaly?', type: 'select', v: 'none', options: ANSWERS }
    ], draw);
    const tb = E('div', 'w-table'); box.appendChild(tb);
    const ro = readout(box);
    const note = E('div', 'w-note'); box.appendChild(note);
    const revealBtn = E('button', 'btn small'); revealBtn.textContent = 'Reveal';
    let revealed = false, lastKey = null;
    revealBtn.onclick = () => { revealed = true; draw(); };
    box.appendChild(revealBtn);
    function draw() {
      const key = v.caseId + '|' + v.guess;
      if (key !== lastKey) { lastKey = key; revealed = false; }
      const c = CASES[v.caseId], r = c.row;
      tb.innerHTML = '<table><thead><tr><th>BCWS</th><th>BCWP</th><th>ACWP</th><th>BAC</th><th>EAC</th></tr></thead><tbody>' +
        `<tr><td>${f2(r.bcws, 0)}</td><td>${f2(r.bcwp, 0)}</td><td>${f2(r.acwp, 0)}</td><td>${f2(r.bac, 0)}</td><td>${f2(r.eac, 0)}</td></tr></tbody></table>`;
      const rows = [[c.label, ''], ['Your diagnosis', ANSWERS.find(a => a[0] === v.guess)[1]]];
      if (revealed) {
        const ok = v.guess === c.ans;
        rows.push(['Correct diagnosis', ANSWERS.find(a => a[0] === c.ans)[1], 'good']);
        rows.push(['Check', ok ? 'match' : 'mismatch', ok ? 'good' : 'bad']);
        rows.push(['CEBoK explanation', c.why]);
      }
      ro(rows);
      note.textContent = 'Nine anomalies from Fig. 15.18 (L628-676): all three equal; BCWP with no ACWP; BCWP with no BCWS; ACWP with no BCWP; BCWP or BCWS exceeding BAC; BAC present with EAC=0; EAC present with BAC=0; all values negative; BAC or EAC negative. Case 10 is the L677-680 aquarium row (BCWS 400/BCWP 200/ACWP 300/BAC 800/EAC 1200), included as a plain, non-anomalous baseline.';
      publish(box, { caseId: v.caseId, guess: v.guess, correct: c.ans, isMatch: v.guess === c.ans });
    }
    draw();
  };

  // M15: EAC range calculator (aquarium example, L677+)
  reg['eac-range'] = box => {
    title(box, 'EAC range and TCPI', 'best/worst case EAC, TCPI to BAC and to LRE — default reproduces the aquarium example');
    const v = controls(box, [
      { k: 'bcws', label: 'BCWS', type: 'number', v: 400 },
      { k: 'bcwp', label: 'BCWP', type: 'number', v: 200 },
      { k: 'acwp', label: 'ACWP', type: 'number', v: 300 },
      { k: 'bac', label: 'BAC', type: 'number', v: 800 },
      { k: 'lre', label: 'LRE (latest revised estimate)', type: 'number', v: 1000 }
    ], draw);
    const ro = readout(box);
    const note = E('div', 'w-note'); box.appendChild(note);
    function draw() {
      const { bcws, bcwp, acwp, bac, lre } = v;
      const cv = bcwp - acwp, sv = bcwp - bcws;
      const cpi = acwp !== 0 ? bcwp / acwp : NaN, spi = bcws !== 0 ? bcwp / bcws : NaN;
      const bcwr = bac - bcwp;
      const pctPlanned = bac !== 0 ? bcws / bac : NaN, pctComplete = bac !== 0 ? bcwp / bac : NaN, pctSpent = bac !== 0 ? acwp / bac : NaN;
      const eacBest = cpi ? bac / cpi : NaN;
      const denomWorst = cpi * spi;
      const eacWorst = denomWorst ? acwp + bcwr / denomWorst : NaN;
      const denomTcpiBac = bac - acwp, tcpiBac = denomTcpiBac !== 0 ? bcwr / denomTcpiBac : NaN;
      const denomTcpiLre = lre - acwp, tcpiLre = denomTcpiLre !== 0 ? bcwr / denomTcpiLre : NaN;
      const flag = isFinite(tcpiLre) && isFinite(cpi) && Math.abs(tcpiLre - cpi) > 0.05;
      ro([
        ['CV = BCWP - ACWP', f2(cv, 0), cv < 0 ? 'bad' : 'good'],
        ['SV = BCWP - BCWS', f2(sv, 0), sv < 0 ? 'bad' : 'good'],
        ['CPI = BCWP/ACWP', f2(cpi, 3), cpi < 1 ? 'bad' : 'good'],
        ['SPI = BCWP/BCWS', f2(spi, 3), spi < 1 ? 'bad' : 'good'],
        ['BCWR = BAC - BCWP', f2(bcwr, 0)],
        ['% planned = BCWS/BAC', pct(pctPlanned, 1)],
        ['% complete = BCWP/BAC', pct(pctComplete, 1)],
        ['% spent = ACWP/BAC', pct(pctSpent, 1)],
        ['Best-case EAC = BAC/CPI', f2(eacBest, 0), 'good'],
        ['Worst-case EAC = ACWP + BCWR/(CPI*SPI)', f2(eacWorst, 0), 'bad'],
        ['TCPI(BAC) = BCWR/(BAC-ACWP)', f2(tcpiBac, 3)],
        ['TCPI(LRE) = BCWR/(LRE-ACWP)', f2(tcpiLre, 3), flag ? 'bad' : ''],
        ['LRE reasonableness check', flag ? '|TCPI(LRE) - CPI| > 0.05 -- LRE may not be reasonable' : '|TCPI(LRE) - CPI| <= 0.05 -- consistent with current performance', flag ? 'bad' : 'good']
      ]);
      note.textContent = 'Default values (BCWS 400, BCWP 200, ACWP 300, BAC 800, LRE 1000) are the aquarium example. CV=-100, SV=-200, CPI=2/3=0.667, SPI=0.5, BCWR=600, %planned=50%, %complete=25%, %spent=37.5%, best-case EAC=800/0.667=1200, worst-case EAC=300+600/(0.667*0.5)=2100, TCPI(BAC)=600/500=1.2, TCPI(LRE)=600/700=0.857. Since |0.857-0.667|=0.19 exceeds the 0.05 tolerance, the LRE looks inconsistent with demonstrated performance (needs an unrealistic efficiency improvement to hit).';
      publish(box, { cv, sv, cpi, spi, bcwr, pctPlanned, pctComplete, pctSpent, eacBest, eacWorst, tcpiBac, tcpiLre, flag });
    }
    draw();
  };

  // M15: rebaseline masking demo — cumulative vs since-rebaseline CPI/SPI
  reg['rebaseline'] = box => {
    title(box, 'Rebaseline masking', 'a rebaseline resets the cumulative history — since-rebaseline indices can look very different from all-time cumulative');
    const v = controls(box, [
      { k: 'rbBcws', label: 'At rebaseline: BCWS', type: 'number', v: 100 },
      { k: 'rbBcwp', label: 'At rebaseline: BCWP', type: 'number', v: 100 },
      { k: 'rbAcwp', label: 'At rebaseline: ACWP', type: 'number', v: 100 },
      { k: 'bcws', label: 'Now (cumulative): BCWS', type: 'number', v: 150 },
      { k: 'bcwp', label: 'Now (cumulative): BCWP', type: 'number', v: 145 },
      { k: 'acwp', label: 'Now (cumulative): ACWP', type: 'number', v: 150 }
    ], draw);
    const ro = readout(box);
    const note = E('div', 'w-note'); box.appendChild(note);
    function draw() {
      const { rbBcws, rbBcwp, rbAcwp, bcws, bcwp, acwp } = v;
      const cumCpi = acwp !== 0 ? bcwp / acwp : NaN, cumSpi = bcws !== 0 ? bcwp / bcws : NaN;
      const dBcwp = bcwp - rbBcwp, dAcwp = acwp - rbAcwp, dBcws = bcws - rbBcws;
      const sinceCpi = dAcwp !== 0 ? dBcwp / dAcwp : NaN, sinceSpi = dBcws !== 0 ? dBcwp / dBcws : NaN;
      const masking = isFinite(cumCpi) && isFinite(sinceCpi) && Math.abs(cumCpi - sinceCpi) > 0.02;
      ro([
        ['Cumulative CPI = BCWP/ACWP', f2(cumCpi, 3)],
        ['Cumulative SPI = BCWP/BCWS', f2(cumSpi, 3)],
        ['Since-rebaseline delta EV / delta AC / delta PV', `${f2(dBcwp, 0)} / ${f2(dAcwp, 0)} / ${f2(dBcws, 0)}`],
        ['Since-rebaseline CPI = deltaBCWP/deltaACWP', f2(sinceCpi, 3)],
        ['Since-rebaseline SPI = deltaBCWP/deltaBCWS', f2(sinceSpi, 3)],
        ['Masking check', masking ? 'cumulative and since-rebaseline indices diverge -- pre-rebaseline history is masking current performance' : 'cumulative and since-rebaseline indices agree closely', masking ? 'bad' : 'good']
      ]);
      note.textContent = 'Rebaselining resets planned/earned/actual to a common point, wiping out prior variances from the cumulative history. With defaults (rebaseline at BCWS=BCWP=ACWP=100, now cumulative BCWS 150/BCWP 145/ACWP 150), cumulative CPI=145/150=0.967 and cumulative SPI=145/150=0.967 -- but those cumulative figures still include the pre-rebaseline period where everything was exactly on plan. The since-rebaseline view isolates only the work done after the reset: deltaBCWP=45, deltaACWP=50, deltaBCWS=50, giving since-rebaseline CPI=45/50=0.9 and SPI=45/50=0.9 -- both worse than the cumulative numbers suggest. A rebaseline can mask recent underperformance inside an all-time cumulative figure.';
      publish(box, { cumCpi, cumSpi, dBcwp, dAcwp, dBcws, sinceCpi, sinceSpi, masking });
    }
    draw();
  };

  // M16: CAIV design trade-off — pick the optimal design under thresholds/objectives and an exchange rate
  reg['design-trade'] = box => {
    title(box, 'Design trade-off', 'CAIV: pick the optimal design -- feasible (meets thresholds) and on the most-preferred curve of equal preference');
    const SCEN = {
      s1: {
        label: 'Scenario 1', costMax: 95, perfMin: 50,
        alts: [
          { k: 'A', cost: 40, perf: 60 }, { k: 'B', cost: 70, perf: 91 }, { k: 'C', cost: 55, perf: 70 },
          { k: 'D', cost: 20, perf: 35 }, { k: 'E', cost: 110, perf: 98 }
        ]
      },
      s2: {
        label: 'Scenario 2', costMax: 60, perfMin: 40,
        alts: [
          { k: 'A', cost: 30, perf: 50 }, { k: 'B', cost: 55, perf: 80 }, { k: 'C', cost: 45, perf: 60 },
          { k: 'D', cost: 15, perf: 25 }, { k: 'E', cost: 90, perf: 92 }
        ]
      },
      s3: {
        label: 'Scenario 3', costMax: 85, perfMin: 60,
        alts: [
          { k: 'A', cost: 50, perf: 70 }, { k: 'B', cost: 80, perf: 96 }, { k: 'C', cost: 65, perf: 80 },
          { k: 'D', cost: 35, perf: 45 }, { k: 'E', cost: 90, perf: 99 }
        ]
      }
    };
    const v = controls(box, [
      { k: 'scenario', label: 'Scenario', type: 'select', v: 's1', options: Object.keys(SCEN).map(k => [k, SCEN[k].label]) },
      { k: 'rate', label: 'Exchange rate (cost per unit performance)', min: 0.5, max: 3, step: 0.05, v: 1.5, fmt: x => f2(x, 2) },
      { k: 'guess', label: 'Your pick', type: 'select', v: 'A', options: [['A', 'A'], ['B', 'B'], ['C', 'C'], ['D', 'D'], ['E', 'E']] }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    const ro = readout(box);
    const note = E('div', 'w-note'); box.appendChild(note);
    function draw() {
      const sc = SCEN[v.scenario];
      const feasible = sc.alts.filter(a => a.cost <= sc.costMax && a.perf >= sc.perfMin);
      const scored = feasible.map(a => ({ ...a, score: v.rate * a.perf - a.cost }));
      const best = scored.length ? scored.reduce((m, a) => (a.score > m.score ? a : m)) : null;
      const maxCost = Math.max(...sc.alts.map(a => a.cost)) * 1.15;
      const maxPerf = Math.max(...sc.alts.map(a => a.perf)) * 1.15;
      pb.innerHTML = '';
      const p = Plot.create(pb, { h: 280, xmin: 0, xmax: maxCost, ymin: 0, ymax: maxPerf, xlabel: 'cost (hypothetical)', ylabel: 'performance / utility (hypothetical)' });
      p.axes();
      p.vline(sc.costMax, 'marker hot'); p.text(sc.costMax, maxPerf * 0.98, 'cost threshold', 'annot', 'end');
      p.hline(sc.perfMin, 'marker hot'); p.text(maxCost * 0.02, sc.perfMin, 'performance threshold', 'annot', 'start');
      if (best) {
        const y0 = 0, y1 = maxPerf;
        p.line([[v.rate * y0 - best.score, y0], [v.rate * y1 - best.score, y1]], 'series c2');
      }
      sc.alts.forEach(a => {
        const feas = a.cost <= sc.costMax && a.perf >= sc.perfMin;
        const isBest = best && a.k === best.k;
        p.dot(a.cost, a.perf, isBest ? 'pt hot' : feas ? 'pt' : 'pt bad', 6);
        p.text(a.cost, a.perf, a.k + ' (hypothetical)', 'annot', 'start');
      });
      const guessOk = best && v.guess === best.k;
      ro([
        ['Feasible alternatives (meet both thresholds)', feasible.map(a => a.k).join(', ') || 'none'],
        ['Scores at this exchange rate (score = rate x performance - cost)', scored.map(a => `${a.k}=${f2(a.score, 1)}`).join(', ')],
        ['Optimal design', best ? best.k : '—', 'good'],
        ['Your pick', v.guess, guessOk ? 'good' : 'bad'],
        ['Check', guessOk ? 'match' : 'mismatch', guessOk ? 'good' : 'bad']
      ]);
      note.textContent = 'Each point is a hypothetical design alternative. Feasible means it meets both the cost threshold (at or below the dashed vertical line) and the performance threshold (at or above the dashed horizontal line). Curves of equal preference are straight lines whose slope is the exchange rate (cost traded per unit of performance); every point on one curve is equally preferred, and curves further up-left (more performance for less cost) are more preferred. The optimal design is the feasible alternative lying on the most-preferred curve -- the solid line above passes through it. Raising the exchange rate makes performance "cheaper" to buy, which can swing the optimal pick from a lower-cost/lower-performance alternative to a higher-cost/higher-performance one.';
      publish(box, { scenario: v.scenario, rate: v.rate, guess: v.guess, best: best ? best.k : null, isMatch: !!guessOk });
    }
    draw();
  };

  // M16: ABC vs traditional cost views (Fig 16.4)
  reg['abc-views'] = box => {
    title(box, 'Traditional vs. activity views (Fig. 16.4)', 'same total cost, sliced by resource (traditional) or by activity (ABC)');
    const TRAD = [
      ['Personnel', 45000000], ['Software Licenses', 2000000], ['Workstations', 7500000], ['TDY', 250000],
      ['Transportation', 95000], ['Rent/Leases', 250000], ['Utilities', 750000], ['Network Comms', 375000],
      ['Maintenance', 1450000], ['Supplies', 40000], ['Misc. Equipment', 50000]
    ];
    const ACTV = [
      ['Conduct Operations', 36640000], ['Acquire Equipment', 12250000], ['Support Operations', 4500000],
      ['Develop Budget', 350000], ['Train Personnel', 575000], ['Maintain Records', 70000],
      ['Operate Comm Center', 850000], ['Install/Maint Computers', 975000], ['Help Desk Support', 1550000]
    ];
    const tradTotal = TRAD.reduce((s, [, v]) => s + v, 0);
    const actvTotal = ACTV.reduce((s, [, v]) => s + v, 0);
    const v = controls(box, [
      { k: 'view', label: 'View', type: 'select', v: 'trad', options: [['trad', 'Traditional (by resource)'], ['activity', 'Activity (ABC)']] }
    ], draw);
    const tb = E('div', 'w-table'); box.appendChild(tb);
    const ro = readout(box);
    const note = E('div', 'w-note'); box.appendChild(note);
    function draw() {
      const rows = v.view === 'trad' ? TRAD : ACTV;
      const total = v.view === 'trad' ? tradTotal : actvTotal;
      const maxV = Math.max(...rows.map(([, x]) => x));
      tb.innerHTML = '<table><thead><tr><th>' + (v.view === 'trad' ? 'Resource' : 'Activity') + '</th><th>Cost</th><th>Share</th></tr></thead><tbody>' +
        rows.slice().sort((a, b) => b[1] - a[1]).map(([label, val]) => {
          const share = val / total;
          return `<tr><td>${label}</td><td>$${f2(val, 0)}</td><td><div class="share-bar" style="width:140px"><i style="width:${(val / maxV * 100).toFixed(1)}%"></i></div> ${pct(share, 1)}</td></tr>`;
        }).join('') + '</tbody></table>';
      const top = rows.slice().sort((a, b) => b[1] - a[1])[0];
      ro([
        ['Traditional total', '$' + f2(tradTotal, 0)],
        ['Activity total', '$' + f2(actvTotal, 0)],
        ['Totals equal', tradTotal === actvTotal ? 'yes, same underlying cost' : 'mismatch', tradTotal === actvTotal ? 'good' : 'bad'],
        ['Largest line in this view', `${top[0]} ($${f2(top[1], 0)}, ${pct(top[1] / total, 1)})`]
      ]);
      note.textContent = 'Same $' + f2(tradTotal, 0) + ' total cost sliced two ways. The traditional (resource) view groups spending by what was bought -- personnel, licenses, workstations. The activity (ABC) view regroups the identical dollars by what the organization actually did with them -- conduct operations, acquire equipment, train personnel. The ABC view focuses on performing and supporting the mission, exposing overhead that a traditional GAAP-style resource view hides inside broad line items like Personnel or Workstations.';
      publish(box, { view: v.view, tradTotal, actvTotal, topLabel: top[0], topShare: top[1] / total });
    }
    draw();
  };

  // M16: CAM-I Cross — ABC (vertical, "what") vs ABM (horizontal, "why")
  reg['cam-i-cross'] = box => {
    title(box, 'CAM-I Cross', 'ABC acts vertically (top-down); ABM acts horizontally (left-to-right)');
    const NODES = {
      resources: { txt: 'Resources', why: 'ABC (vertical, top-down): the starting point -- the things an organization spends money on.' },
      rd: { txt: 'Resource drivers (first-stage assignment)', why: 'ABC assigns and measures resources to activities via resource drivers -- the first-stage assignment.' },
      activities: { txt: 'Activities', why: 'The center of the cross: what the organization does, shared by both ABC (vertical) and ABM (horizontal).' },
      ad: { txt: 'Activity drivers (second-stage assignment)', why: 'ABC assigns and measures activities to outputs (cost objects) via activity drivers -- the second-stage assignment.' },
      objects: { txt: 'Cost objects', why: 'ABC (vertical): the outputs activities are assigned to. ABC focuses on what things cost and establishes the cost of activities and cost objects.' },
      drivers: { txt: 'Cost drivers / root causes', why: 'ABM (horizontal, left-to-right): relates the cost of activities to their cost drivers -- the root causes of cost.' },
      measures: { txt: 'Performance measures', why: 'ABM (horizontal): producing performance measures so managers can see how efficiently activities are performed and how to manage them.' }
    };
    box.appendChild(E('div', 'w-note', 'Click a box to see how it fits the cross. Vertical arm = ABC ("what things cost"). Horizontal arm = ABM ("why they cost that").'));
    const grid = E('div', 'w-2col'); box.appendChild(grid);
    const note = E('div', 'w-note'); box.appendChild(note);
    const vBox = E('div'), hBox = E('div'); grid.append(vBox, hBox);
    vBox.appendChild(E('div', null, '<b>ABC -- vertical (what)</b>'));
    hBox.appendChild(E('div', null, '<b>ABM -- horizontal (why)</b>'));
    const mkBtn = k => { const b = E('button', 'opt', NODES[k].txt); b.type = 'button'; b.onclick = () => { note.textContent = NODES[k].why; note.className = 'w-note'; }; return b; };
    ['resources', 'rd', 'activities', 'ad', 'objects'].forEach(k => vBox.appendChild(mkBtn(k)));
    ['drivers', 'activities', 'measures'].forEach(k => hBox.appendChild(mkBtn(k)));
    box.appendChild(E('div', 'w-note', 'Note: the source names this diagram the "Consortium for Advanced Management International (CAM-I) Cross" here, though it uses "Advanced Manufacturing" for CAM-I elsewhere -- a source inconsistency, not something to memorize either way.'));

    // small quiz: classify a term as ABC/what or ABM/why
    const QUIZ = [
      { k: 'q1', txt: 'Resource drivers (first-stage assignment)', ans: 'abc', fb: 'ABC / "what": resource drivers assign resources to activities -- the vertical, first-stage assignment.' },
      { k: 'q2', txt: 'Cost drivers (root causes of cost)', ans: 'abm', fb: 'ABM / "why": cost drivers relate activity cost to its root causes -- the horizontal view.' },
      { k: 'q3', txt: 'Activity drivers (second-stage assignment) to cost objects', ans: 'abc', fb: 'ABC / "what": activity drivers assign activities to cost objects -- the vertical, second-stage assignment.' },
      { k: 'q4', txt: 'Performance measures', ans: 'abm', fb: 'ABM / "why": performance measures are the horizontal output, showing how efficiently activities are performed.' }
    ];
    let picks = {};
    const qList = E('div'); box.appendChild(qList);
    const ro = readout(box);
    function drawQuiz(reveal) {
      qList.innerHTML = '';
      QUIZ.forEach(it => {
        const row = E('div', 'w-note');
        row.appendChild(E('p', null, Render.inline(it.txt)));
        const wrap = E('div');
        [['abc', 'ABC (what)'], ['abm', 'ABM (why)']].forEach(([ck, label]) => {
          const b = E('button', 'opt' + (picks[it.k] === ck ? ' ' + (reveal ? (ck === it.ans ? 'right' : 'wrong') : 'on') : ''), label);
          b.type = 'button';
          b.onclick = () => { picks[it.k] = ck; drawQuiz(false); };
          wrap.appendChild(b);
        });
        row.appendChild(wrap);
        if (reveal && picks[it.k]) row.appendChild(E('div', 'ro ' + (picks[it.k] === it.ans ? 'good' : 'bad'), Render.inline(it.fb)));
        qList.appendChild(row);
      });
    }
    const btn = E('button', 'opt', 'Reveal quiz answers'); btn.type = 'button';
    btn.onclick = () => {
      drawQuiz(true);
      const nCorrect = QUIZ.filter(it => picks[it.k] === it.ans).length;
      ro([['Quiz correct', nCorrect + ' of ' + QUIZ.length, nCorrect === QUIZ.length ? 'good' : '']]);
      publish(box, { correct: nCorrect, total: QUIZ.length });
    };
    box.appendChild(btn);
    drawQuiz(false);
    publish(box, { correct: 0, total: QUIZ.length });
  };

  // M16: Big TOC vs Little TOC/LCC sorter
  reg['toc-sorter'] = box => {
    title(box, 'Big TOC vs. Little TOC (LCC)', 'sort each cost into DoD Total Ownership Cost (organizational) or Defense System TOC / LCC (program). Little TOC is a subset of Big TOC, so program costs also roll up into the DoD-wide total; sort by the narrowest perspective that fits');
    const items = [
      { k: 'recruit', txt: 'Recruiting, training, retaining, and separating military and civilian personnel', ans: 'big', fb: 'Big TOC: DoD TOC explicitly covers "the costs to recruit, train, retain, separate and otherwise support military and civilian personnel."' },
      { k: 'business', txt: 'Other costs of business operations of the DoD', ans: 'big', fb: 'Big TOC: DoD TOC includes "all other costs of business operations of the DoD" -- organization-wide, not tied to one program.' },
      { k: 'realprop', txt: 'Owning and operating real property across the department', ans: 'big', fb: 'Big TOC: DoD TOC covers costs to "acquire, own, operate, and dispose of weapon and support systems, other equipment and real property" at the organizational level.' },
      { k: 'readiness', txt: 'Meeting readiness, safety, and quality-of-life standards DoD-wide', ans: 'big', fb: 'Big TOC: the definition names "all standards in effect for readiness, safety, and quality of life" as part of DoD TOC.' },
      { k: 'natgoals', txt: 'Resources needed to meet national goals in compliance with all applicable laws and policies', ans: 'big', fb: 'Big TOC: DoD TOC is "the sum of all financial resources necessary...to meet national goals in compliance with all laws, all policies applicable to DoD."' },
      { k: 'rd', txt: 'R&D costs for this program', ans: 'little', fb: 'Little TOC / LCC: life cycle cost estimates span R&D, production, O&S, and disposal costs for the program.' },
      { k: 'prod', txt: 'Production costs for this program', ans: 'little', fb: 'Little TOC / LCC: production is one of the four life-cycle phases LCC covers for the program.' },
      { k: 'os', txt: 'Operating and support (O&S) costs for this program', ans: 'little', fb: 'Little TOC / LCC: O&S is one of the four life-cycle phases LCC covers for the program.' },
      { k: 'disposal', txt: 'Disposal costs for this program', ans: 'little', fb: 'Little TOC / LCC: disposal is one of the four life-cycle phases LCC covers for the program.' },
      { k: 'linked', txt: 'Indirect costs attributable to this program that would not occur if the program did not exist', ans: 'little', fb: 'Little TOC / LCC: LCC (per DoD 5000.4-M) includes not only acquisition program direct costs but also the linked indirect costs attributable to the program -- costs that would not occur if the program did not exist. These are already inside LCC, not an extra add-on.' }
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
        [['big', 'Big TOC (organizational)'], ['little', 'Little TOC / LCC (program)']].forEach(([ck, label]) => {
          const b = E('button', 'opt' + (picks[it.k] === ck ? ' ' + (reveal ? (ck === it.ans ? 'right' : 'wrong') : 'on') : ''), label);
          b.type = 'button';
          b.onclick = () => { picks[it.k] = ck; render(false); };
          wrap.appendChild(b);
        });
        row.appendChild(wrap);
        if (reveal && picks[it.k]) row.appendChild(E('div', 'ro ' + (picks[it.k] === it.ans ? 'good' : 'bad'), Render.inline(it.fb)));
        list.appendChild(row);
      });
    }
    const btn = E('button', 'opt', 'Reveal answers'); btn.type = 'button';
    btn.onclick = () => {
      render(true);
      const nCorrect = items.filter(it => picks[it.k] === it.ans).length;
      ro([['Correct', nCorrect + ' of ' + items.length, nCorrect === items.length ? 'good' : '']]);
      publish(box, { correct: nCorrect, total: items.length });
    };
    box.appendChild(btn);
    render(false);
    publish(box, { correct: 0, total: items.length });
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

  // ======================================================================
  // M8: SST = SSR + SSE decomposition, blending mean-line to OLS fit
  reg['r2-split'] = box => {
    title(box, 'SST = SSR + SSE', 'drag the points, then blend from the mean line to the least-squares line');
    let pts = (preset(box, 'data', null) || [[4, 5], [7, 5], [8, 10], [12, 7], [16, 13]]).map(p => p.slice());
    const v = controls(box, [
      { k: 'blend', label: 'Blend: mean line → OLS fit', min: 0, max: 1, step: 0.01, v: 1, fmt: x => (x * 100).toFixed(0) + '%' }
    ], draw);
    const top = E('div'), bot = E('div');
    box.append(top, bot);
    const ro = readout(box);
    const p = Plot.create(top, { xmin: 0, xmax: 20, ymin: 0, ymax: 16, xlabel: 'X (cost driver)', ylabel: 'Y (cost)' });
    const bp = Plot.create(bot, { h: 130, xmin: 0, xmax: 1, ymin: 0, ymax: 60, xticks: 0, xlabel: '', ylabel: 'sum of squares' });
    let drag = -1;
    const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
    p.svg.addEventListener('pointerdown', e => {
      const [x, y] = p.evt(e);
      let best = -1, bd = 1.1;
      pts.forEach((q, i) => { const d = Math.hypot((q[0] - x) / 20, (q[1] - y) / 16); if (d < bd) { bd = d; best = i; } });
      drag = best; if (drag >= 0) p.svg.setPointerCapture(e.pointerId);
    });
    p.svg.addEventListener('pointermove', e => {
      if (drag < 0) return;
      const [x, y] = p.evt(e);
      pts[drag] = [clamp(x, 0, 20), clamp(y, 0, 16)];
      draw();
    });
    p.svg.addEventListener('pointerup', () => drag = -1);
    p.svg.addEventListener('pointercancel', () => drag = -1);
    function draw() {
      p.clear(); p.axes(); bp.clear(); bp.axes();
      if (pts.length < 3) { ro([['Need at least 3 points', '']]); publish(box, { sst: NaN, ssr: NaN, sse: NaN, r2: NaN, blend: v.blend }); return; }
      const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
      const r = ols(xs, ys);
      const t = v.blend;
      const slope = t * r.b1, intercept = (1 - t) * r.my + t * r.b0;
      const yhat = xs.map(x => intercept + slope * x);
      const sse = ys.reduce((s, y, i) => s + (y - yhat[i]) ** 2, 0);
      const ssr = yhat.reduce((s, yh) => s + (yh - r.my) ** 2, 0);
      p.hline(r.my, 'marker c2');
      p.fn(x => intercept + slope * x, 'series c1');
      pts.forEach((q, i) => { p.seg(q[0], q[1], q[0], yhat[i], 'marker'); p.dot(q[0], q[1], i === drag ? 'pt hot' : 'pt', 6); });
      p.dot(r.mx, r.my, 'pt mean', 5);
      const ymax = Math.max(16, ...ys) * 1.1; p.o.ymax = ymax;
      bp.o.ymax = Math.max(60, r.sst) * 1.15;
      bp.rect(0.15, 0, 0.4, r.sst, 'band');
      bp.text(0.275, r.sst + bp.o.ymax * 0.03, 'SST', 'annot', 'middle');
      bp.rect(0.6, 0, 0.85, ssr, 'series c2'); // stub base
      bp.rect(0.6, ssr, 0.85, ssr + sse, 'sq');
      bp.text(0.725, ssr + sse + bp.o.ymax * 0.03, 'SSR + SSE', 'annot', 'middle');
      bp.text(0.725, ssr / 2, 'SSR', 'annot', 'middle');
      bp.text(0.725, ssr + sse / 2, 'SSE', 'annot', 'middle');
      const r2 = ssr / r.sst;
      ro([
        ['SST (data spread around ȳ, fixed)', f2(r.sst, 2)],
        ['SSR (explained by the line)', f2(ssr, 2)],
        ['SSE (left over as residual)', f2(sse, 2)],
        ['SSR + SSE', f2(ssr + sse, 2), Math.abs(ssr + sse - r.sst) < 0.01 * r.sst ? 'good' : 'bad'],
        ['R² = SSR/SST', f2(r2, 3)],
        ['Exact at blend = 100% (OLS); off the line, SSR+SSE ≠ SST', '']
      ]);
      publish(box, { sst: r.sst, ssr, sse, r2, blend: t });
    }
    box.w.setters.data = arr => { pts = arr.map(p2 => p2.slice()); draw(); };
    draw();
  };

  // ======================================================================
  // M8: confidence and prediction bands
  reg['ci-bands'] = box => {
    title(box, 'Confidence vs. prediction bands', 'drag X₀, change the confidence level');
    const xs = [4, 7, 8, 12, 16], ys = [5, 5, 10, 7, 13];
    const r = ols(xs, ys);
    const df = r.n - 2, mse = r.sse / df, see = Math.sqrt(mse);
    const v = controls(box, [
      { k: 'level', label: 'Confidence level', type: 'select', v: '0.95', options: [['0.68', '68%'], ['0.95', '95%'], ['0.99', '99%']] },
      { k: 'x0', label: 'X₀', min: 1, max: 19, step: 0.1, v: 11 }
    ], draw);
    const top = E('div'); box.appendChild(top);
    const ro = readout(box);
    legend(box, [['c1', 'OLS fit'], ['band', '95%-style mean CI'], ['sq', 'prediction interval']]);
    const p = Plot.create(top, { xmin: 0, xmax: 20, ymin: -6, ymax: 22, xlabel: 'X (cost driver)', ylabel: 'Y (cost)' });
    function bandPath(loFn, hiFn, cls) {
      const n = 60, up = [], dn = [];
      for (let i = 0; i <= n; i++) { const x = 0.3 + (19.7 - 0.3) * i / n; up.push([p.x(x), p.y(hiFn(x))]); dn.push([p.x(x), p.y(loFn(x))]); }
      const d = 'M' + up.concat(dn.reverse()).map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join('L') + 'Z';
      return Plot.svgEl('path', { d, class: cls }, p.svg);
    }
    function draw() {
      p.clear(); p.axes();
      const level = +v.level, x0 = v.x0;
      const t = M.tinv(1 - (1 - level) / 2, df);
      const meanHalf = x => t * see * Math.sqrt(1 / r.n + (x - r.mx) ** 2 / r.sxx);
      const predHalf = x => t * see * Math.sqrt(1 + 1 / r.n + (x - r.mx) ** 2 / r.sxx);
      const yhatFn = x => r.b0 + r.b1 * x;
      bandPath(x => yhatFn(x) - predHalf(x), x => yhatFn(x) + predHalf(x), 'sq');
      bandPath(x => yhatFn(x) - meanHalf(x), x => yhatFn(x) + meanHalf(x), 'band');
      p.fn(yhatFn, 'series c1');
      xs.forEach((x, i) => p.dot(x, ys[i], 'pt', 5));
      p.vline(x0, 'marker hot');
      const yhat0 = yhatFn(x0), mH = meanHalf(x0), pH = predHalf(x0);
      p.dot(x0, yhat0, 'pt hot', 6);
      const seB1 = see / Math.sqrt(r.sxx);
      const slopeHalf = t * seB1;
      ro([
        ['t(.5+level/2, df=' + df + ')', f2(t, 3)],
        ['ŷ at X₀', f2(yhat0)],
        ['Mean-response CI', `(${f2(yhat0 - mH)}, ${f2(yhat0 + mH)})`],
        ['Prediction interval', `(${f2(yhat0 - pH)}, ${f2(yhat0 + pH)})`],
        ['Slope CI', `(${f2(r.b1 - slopeHalf, 2)}, ${f2(r.b1 + slopeHalf, 2)})`],
        ['Bands are narrowest at X̄ = ' + f2(r.mx, 1), '']
      ]);
      publish(box, { yhat0, meanLo: yhat0 - mH, meanHi: yhat0 + mH, predLo: yhat0 - pH, predHi: yhat0 + pH, slopeLo: r.b1 - slopeHalf, slopeHi: r.b1 + slopeHalf, t, level, x0 });
    }
    draw();
  };

  // ======================================================================
  // M8: minding the intercept before a log-log transform (Fig. 8.31 "data bowing")
  reg['intercept-bow'] = box => {
    title(box, 'Minding the intercept', 'subtract a constant before the power fit, and watch the bow disappear');
    const xs = [0.834, 0.305, 1.528, 2.524, 2.114, 4.904];
    const ys = xs.map(x => 3 + 1 / x); // true model y = 3 + 1/x (CEBoK Fig. 8.31 pattern)
    const v = controls(box, [
      { k: 'c', label: 'Constant c subtracted from Y', min: 0, max: 3.2, step: 0.1, v: 0 }
    ], draw);
    const row = E('div', 'w-2col'); const L = E('div'), R = E('div'); row.append(L, R);
    box.appendChild(row);
    const ro = readout(box);
    const p1 = Plot.create(L, { h: 240, xmin: 0, xmax: 5.5, ymin: -3, ymax: 13, xlabel: 'X', ylabel: 'Y (unit space)' });
    const p2 = Plot.create(R, { h: 240, xmin: -1.3, xmax: 1.7, ymin: -2, ymax: 2.5, xlabel: 'ln X', ylabel: 'ln (Y − c)' });
    function draw() {
      p1.clear(); p1.axes(); p2.clear(); p2.axes();
      const c = v.c;
      const adj = ys.map(y => y - c);
      const keep = adj.map(y => y > 0);
      const lx = [], ly = [];
      xs.forEach((x, i) => { if (keep[i]) { lx.push(Math.log(x)); ly.push(Math.log(adj[i])); } });
      xs.forEach((x, i) => { p1.dot(x, ys[i], 'pt alt', 5); if (keep[i]) p1.dot(x, adj[i], 'pt', 5); });
      if (lx.length >= 3) {
        const r = ols(lx, ly);
        const a = Math.exp(r.b0), b = r.b1;
        p1.fn(x => a * Math.pow(x, b) + c, 'series c1');
        p2.fn(x => r.b0 + r.b1 * x, 'series c1');
        xs.forEach((x, i) => { if (keep[i]) p2.dot(Math.log(x), Math.log(adj[i]), 'pt', 5); });
        const excluded = keep.filter(k => !k).length;
        ro([
          ['Fitted (adjusted) power law', `y − c = ${f2(a, 4)}·X^${f2(b, 4)}`],
          ['Full model', `y = ${f2(a, 4)}·X^${f2(b, 4)} + ${f2(c, 2)}`],
          ['R² (log space)', f2(r.r2, 4)],
          ['At c = 0: matches CEBoK y = 4.2867X⁻⁰²⁴⁶⁷, R² = 0.9162', ''],
          ['At c = 3: reduces to y − 3 = X⁻¹, R² = 1 (true model recovered)', ''],
          excluded ? [`${excluded} point(s) went ≤ 0 after subtracting c — excluded from the log fit`, '', 'bad'] : ['All points positive after adjustment', '', 'good']
        ]);
        publish(box, { a, b, r2: r.r2, c });
      } else {
        ro([['c too large — fewer than 3 points remain positive', '']]);
        publish(box, { a: NaN, b: NaN, r2: NaN, c });
      }
    }
    draw();
  };

  // ======================================================================
  // M8: nested-model selection (Fig. 8.37) — deterministic reconstruction, fixed seed
  reg['nested-model'] = box => {
    title(box, 'Nested model selection', 'drop the least-significant variable and compare adjusted R², SEE, and CV');
    // Fixed-seed synthetic dataset (bounded local search, see repo history) whose full/x3-dropped
    // models land close to CEBoK Fig. 8.37: adjR2 63.6%/64.0%, SEE .178/.177, CV 16.1%/15.9%.
    const D = {
      x1: [11.614, 9.979, 8.095, 3.914, 10.459, 9.18, 10.362, 3.92, 2.852, 9.116, 6.03, 2.361, 9.607, 9.891],
      x2: [4.205, 7.065, 8.222, 6.078, 5.989, 4.333, 4.25, 5.268, 6.78, 8.134, 7.793, 9.614, 4.747, 9.511],
      x3: [0.05, 4.667, 6.506, 8.398, 6.718, 6.429, 9.597, 9.143, 2.323, 10.454, 2.93, 8.206, 2.732, 1.199],
      y: [2.1404, 1.7292, 2.3178, 1.3186, 1.7446, 1.5486, 1.6584, 1.2401, 1.2339, 1.7276, 1.5238, 1.2991, 1.7702, 2.0307]
    };
    function inv(A) {
      const n = A.length, I = A.map((row, i) => row.map((_, j) => (i === j ? 1 : 0)));
      const M = A.map((row, i) => row.concat(I[i]));
      for (let i = 0; i < n; i++) {
        let piv = i; for (let k = i + 1; k < n; k++) if (Math.abs(M[k][i]) > Math.abs(M[piv][i])) piv = k;
        [M[i], M[piv]] = [M[piv], M[i]];
        const d = M[i][i];
        for (let j = 0; j < 2 * n; j++) M[i][j] /= d;
        for (let k = 0; k < n; k++) if (k !== i) { const f = M[k][i]; for (let j = 0; j < 2 * n; j++) M[k][j] -= f * M[i][j]; }
      }
      return M.map(row => row.slice(n));
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
    const Fp = (F, d1, d2) => (F <= 0 ? 1 : 1 - ibeta(d1 * F / (d1 * F + d2), d1 / 2, d2 / 2));
    function mreg(vars) {
      const n = D.y.length, k = vars.length + 1;
      const X = []; for (let i = 0; i < n; i++) X.push([1, ...vars.map(nm => D[nm][i])]);
      const XtX = Array.from({ length: k }, () => new Array(k).fill(0)), Xty = new Array(k).fill(0);
      for (let i = 0; i < n; i++) for (let a = 0; a < k; a++) { Xty[a] += X[i][a] * D.y[i]; for (let b = 0; b < k; b++) XtX[a][b] += X[i][a] * X[i][b]; }
      const Ainv = inv(XtX);
      const beta = Ainv.map(row => row.reduce((s, v2, j) => s + v2 * Xty[j], 0));
      const yhat = X.map(row => row.reduce((s, v2, j) => s + v2 * beta[j], 0));
      const my = mean(D.y);
      let sse = 0, sst = 0;
      for (let i = 0; i < n; i++) { sse += (D.y[i] - yhat[i]) ** 2; sst += (D.y[i] - my) ** 2; }
      const p = vars.length, r2 = 1 - sse / sst, adjr2 = 1 - (1 - r2) * (n - 1) / (n - p - 1);
      const mse = sse / (n - k), see = Math.sqrt(mse), cv = see / my;
      const F = (sst - sse) / p / mse, pF = Fp(F, p, n - k);
      const se = Ainv.map((row, i) => Math.sqrt(Math.max(0, row[i] * mse)));
      const tstat = beta.map((b, i) => b / se[i]);
      const pval = tstat.map(t => 2 * (1 - M.tcdf(Math.abs(t), n - k)));
      return { n, k, beta, se, tstat, pval, r2, adjr2, see, cv, F, pF };
    }
    const v = controls(box, [
      { k: 'x1', label: 'Include x1', type: 'checkbox', v: 1 },
      { k: 'x2', label: 'Include x2', type: 'checkbox', v: 1 },
      { k: 'x3', label: 'Include x3', type: 'checkbox', v: 1 }
    ], draw);
    const tb = E('div', 'w-table'); box.appendChild(tb);
    const ro = readout(box);
    function draw() {
      const vars = ['x1', 'x2', 'x3'].filter(k => v[k]);
      if (!vars.length) { tb.innerHTML = ''; ro([['Include at least one variable', '']]); publish(box, { adjr2: NaN, see: NaN, cv: NaN, F: NaN }); return; }
      const m = mreg(vars);
      const names = ['Intercept', ...vars];
      let h = '<table><tr><th>Term</th><th>Coef</th><th>t</th><th>p</th></tr>';
      names.forEach((nm, i) => { h += `<tr><td>${nm}</td><td>${f2(m.beta[i], 4)}</td><td>${f2(m.tstat[i])}</td><td>${f2(m.pval[i], 3)}</td></tr>`; });
      h += '</table>';
      tb.innerHTML = h;
      ro([
        ['Adjusted R²', pct(m.adjr2)],
        ['SEE', f2(m.see, 3)],
        ['CV = SEE/ȳ', pct(m.cv)],
        ['F(' + vars.length + ',' + (m.n - m.k) + ')', f2(m.F)],
        ['Significance F (p-value)', f2(m.pF, 4)],
        [vars.length === 3 ? 'Full model — compare to dropping x3 (CEBoK: adjR² 63.6%→64.0%, SEE .178→.177, CV 16.1%→15.9%)' : 'Reduced model', '']
      ]);
      publish(box, { adjr2: m.adjr2, see: m.see, cv: m.cv, F: m.F });
    }
    draw();
  };

  // ======================================================================
  // M9: CER prediction interval (Fig. 9.36-9.37)
  reg['cer-pi'] = box => {
    title(box, 'CER prediction interval', 'cost = 6.571 + 7.714·weight, with an 80/90/95% PI');
    const b0 = 6.571, b1 = 7.714, SEE = 1.219, n = 7, df = 5, xbar = 4, sxxAdj = 140 - n * xbar * xbar;
    const v = controls(box, [
      { k: 'weight', label: 'Weight (driver, x1000 lb)', min: 1, max: 8, step: 0.1, v: 4.5 },
      { k: 'u', label: 'Draw (uniform u, 0-1)', min: 0.001, max: 0.999, step: 0.001, v: 0.5 }
    ], draw);
    const row = E('div', 'w-2col'); const L = E('div'), R = E('div'); row.append(L, R); box.appendChild(row);
    legend(box, [['c1', 'point estimate'], ['band', '95% PI'], ['c2', 'trial draw']]);
    const ro = readout(box);
    function draw() {
      L.innerHTML = ''; R.innerHTML = '';
      const weight = v.weight;
      const est = b0 + b1 * weight;
      const mult = SEE * Math.sqrt(1 + 1 / n + (weight - xbar) ** 2 / sxxAdj);
      const lv = { '80': 0.10, '90': 0.05, '95': 0.025 };
      const t80 = M.tinv(1 - lv['80'], df), t90 = M.tinv(1 - lv['90'], df), t95 = M.tinv(1 - lv['95'], df);
      const lo95 = est - t95 * mult, hi95 = est + t95 * mult;
      const lo90 = est - t90 * mult, hi90 = est + t90 * mult;
      const lo80 = est - t80 * mult, hi80 = est + t80 * mult;
      const u = v.u;
      const alpha = u <= 0.5 ? 2 * u : 2 * (1 - u);
      const tcrit = M.tinv(1 - alpha / 2, df);
      const trial = u < 0.5 ? est - tcrit * mult : est + tcrit * mult;
      const p1 = Plot.create(L, { w: 300, h: 230, xmin: 1, xmax: 8, ymin: 0, ymax: (b0 + b1 * 8) + 30, xlabel: 'weight', ylabel: 'cost' });
      p1.axes();
      const nseg = 40, up = [], dn = [];
      for (let i = 0; i <= nseg; i++) {
        const x = 1 + 7 * i / nseg;
        const m = SEE * Math.sqrt(1 + 1 / n + (x - xbar) ** 2 / sxxAdj);
        const yc = b0 + b1 * x;
        up.push([x, yc + t95 * m]); dn.push([x, yc - t95 * m]);
      }
      const dpath = 'M' + up.concat(dn.reverse()).map(q => p1.x(q[0]).toFixed(1) + ',' + p1.y(q[1]).toFixed(1)).join('L') + 'Z';
      Plot.svgEl('path', { d: dpath, class: 'band' }, p1.svg);
      p1.fn(x => b0 + b1 * x, 'series c1');
      p1.vline(weight, 'marker hot');
      p1.dot(weight, trial, 'pt c2', 6);
      const r = M.rng(99); const arr = [];
      for (let i = 0; i < 1000; i++) {
        const uu = r(); const a2 = uu <= 0.5 ? 2 * uu : 2 * (1 - uu);
        const tc = M.tinv(1 - a2 / 2, df);
        arr.push(uu < 0.5 ? est - tc * mult : est + tc * mult);
      }
      arr.sort((a, bx) => a - bx);
      const bins = 30, lo = arr[0], hi = arr[arr.length - 1], w = (hi - lo) / bins || 1, cnt = new Array(bins).fill(0);
      arr.forEach(x => cnt[Math.min(bins - 1, Math.floor((x - lo) / w))]++);
      const p2 = Plot.create(R, { w: 300, h: 230, xmin: lo, xmax: hi, ymin: 0, ymax: Math.max(...cnt) * 1.1, xlabel: 'simulated cost', ylabel: 'frequency', yfmt: () => '' });
      p2.axes(); cnt.forEach((c, i) => p2.rect(lo + i * w, 0, lo + (i + 1) * w, c, 'bar'));
      p2.vline(est, 'marker c1'); p2.vline(trial, 'marker c2');
      ro([
        ['Point estimate', f2(est, 2), 'c1t'],
        ['PI multiplier SEE·√(1+1/n+(x-x̄)²/Σd²)', f2(mult, 3)],
        ['80% PI  (t=' + f2(t80, 3) + ')', `(${f2(lo80, 2)}, ${f2(hi80, 2)})`],
        ['90% PI  (t=' + f2(t90, 3) + ')', `(${f2(lo90, 2)}, ${f2(hi90, 2)})`],
        ['95% PI  (t=' + f2(t95, 3) + ')', `(${f2(lo95, 2)}, ${f2(hi95, 2)})`, 'c2t'],
        ['Draw u → trial value', f2(trial, 2)]
      ]);
      publish(box, { est, mult, lo95, hi95, trial });
    }
    draw();
  };

  // ======================================================================
  // M9: schedule network risk (Figs. 9.38-9.40) — merge point makes finish >= any single path
  reg['schedule-network'] = box => {
    title(box, 'Schedule network risk', 'the critical path is the max of competing paths — merge bias pushes the finish date out');
    const v = controls(box, [
      { k: 'mode', label: 'Mode', type: 'select', v: 'A', options: [['A', 'A: two parallel tasks'], ['B', 'B: k parallel tasks'], ['C', 'C: network shapes']] },
      { k: 'k', label: 'k (mode B)', min: 1, max: 10, step: 1, v: 5 },
      { k: 'cv', label: 'CV % (mode B)', min: 10, max: 40, step: 5, v: 20 },
      { k: 'scenario', label: 'Scenario (mode C)', type: 'select', v: 'parallel', options: [['single', 'single task'], ['serial', 'serial chain'], ['parallel', 'parallel'], ['crosslink', 'crosslink']] }
    ], draw);
    const row = E('div', 'w-2col'); const L = E('div'), R = E('div'); row.append(L, R); box.appendChild(row);
    const ro = readout(box);
    function singleC(r) { return 10 + 2 * M.randn(r); }
    function serialC(r) { return (5 + 1.4 * M.randn(r)) + (5 + 1.4 * M.randn(r)); }
    function parallelC(r) { return Math.max(10 + 2 * M.randn(r), 10 + 2 * M.randn(r)); }
    function crosslinkC(r) { return Math.max(5 + 1.4 * M.randn(r), 5 + 1.4 * M.randn(r)) + (5 + 1.4 * M.randn(r)); }
    function draw() {
      L.innerHTML = ''; R.innerHTML = '';
      const N = 1000;
      let finish = [], meanFinish, pctB = NaN, cpMean, sdv;
      if (v.mode === 'A') {
        const r = M.rng(123); let bWins = 0;
        for (let i = 0; i < N; i++) { const a = 10 + 2 * M.randn(r), b = 8 + 1.6 * M.randn(r); finish.push(Math.max(a, b)); if (b > a) bWins++; }
        meanFinish = mean(finish); sdv = sd(finish); pctB = bWins / N; cpMean = meanFinish;
      } else if (v.mode === 'B') {
        const sdTask = 10 * v.cv / 100; const r = M.rng(123);
        for (let i = 0; i < N; i++) { let m = -Infinity; for (let j = 0; j < v.k; j++) m = Math.max(m, 10 + sdTask * M.randn(r)); finish.push(m); }
        meanFinish = mean(finish); sdv = sd(finish); cpMean = meanFinish;
      } else {
        const fn = { single: singleC, serial: serialC, parallel: parallelC, crosslink: crosslinkC }[v.scenario];
        const r = M.rng(123);
        for (let i = 0; i < N; i++) finish.push(fn(r));
        meanFinish = mean(finish); sdv = sd(finish); cpMean = meanFinish;
      }
      const sorted = finish.slice().sort((a, b) => a - b);
      const bins = 30, lo = sorted[0], hi = sorted[sorted.length - 1], w = (hi - lo) / bins || 1, cnt = new Array(bins).fill(0);
      sorted.forEach(x => cnt[Math.min(bins - 1, Math.floor((x - lo) / w))]++);
      const p1 = Plot.create(L, { w: 300, h: 230, xmin: lo, xmax: hi, ymin: 0, ymax: Math.max(...cnt) * 1.1, xlabel: 'finish time', ylabel: 'frequency', yfmt: () => '' });
      p1.axes(); cnt.forEach((c, i) => p1.rect(lo + i * w, 0, lo + (i + 1) * w, c, 'bar'));
      p1.vline(cpMean, 'marker c1');
      if (v.mode === 'B') {
        const pts = []; const cvv = v.cv;
        for (let kk = 1; kk <= 10; kk++) { const r2 = M.rng(123); const sdTask = 10 * cvv / 100; const fin = []; for (let i = 0; i < 300; i++) { let m = -Infinity; for (let j = 0; j < kk; j++) m = Math.max(m, 10 + sdTask * M.randn(r2)); fin.push(m); } pts.push([kk, mean(fin)]); }
        const p2 = Plot.create(R, { w: 300, h: 230, xmin: 1, xmax: 10, ymin: 8, ymax: Math.max(...pts.map(p => p[1])) * 1.15, xlabel: 'k (parallel tasks)', ylabel: 'mean critical path' });
        p2.axes(); p2.line(pts, 'series c1'); pts.forEach(([x, y]) => p2.dot(x, y, 'pt', 4));
      } else if (v.mode === 'C') {
        const scenarios = ['single', 'serial', 'parallel', 'crosslink'];
        const fns = { single: singleC, serial: serialC, parallel: parallelC, crosslink: crosslinkC };
        const bars = scenarios.map(nm => { const r2 = M.rng(123); const arr = []; for (let i = 0; i < 500; i++) arr.push(fns[nm](r2)); return [nm, sd(arr)]; });
        const p2 = Plot.create(R, { w: 300, h: 230, xmin: 0, xmax: 4, ymin: 0, ymax: Math.max(...bars.map(b => b[1])) * 1.2, xticks: 4, xlabel: '', ylabel: 'std dev of finish', xfmt: i => (scenarios[Math.round(i)] || '').slice(0, 4) });
        p2.axes(); bars.forEach(([nm, s2], i) => p2.rect(i + 0.15, 0, i + 0.85, s2, nm === v.scenario ? 'series c2' : 'bar'));
      } else {
        const p2 = Plot.create(R, { w: 300, h: 230, xmin: 0, xmax: 2, ymin: 0, ymax: 14, xticks: 2, xlabel: '', ylabel: 'mean duration', xfmt: i => ['A', 'B'][Math.round(i)] || '' });
        p2.axes();
        const rA = M.rng(123); let asum = 0, bsum = 0; for (let i = 0; i < N; i++) { asum += 10 + 2 * M.randn(rA); bsum += 8 + 1.6 * M.randn(rA); }
        p2.rect(0.15, 0, 0.85, asum / N, 'series c1'); p2.rect(1.15, 0, 1.85, bsum / N, 'series c2');
      }
      ro([
        ['Mean finish (critical path)', f2(cpMean, 2), 'c1t'],
        ['Std dev of finish', f2(sdv, 2)],
        [v.mode === 'A' ? '% trials where B is the longer path' : 'n/a (mode A only)', v.mode === 'A' ? pct(pctB, 0) : '—'],
        ['Mode', v.mode]
      ]);
      publish(box, { meanFinish, pctB, cpMean, sd: sdv });
    }
    draw();
  };

  // ======================================================================
  // M9: conflating expert opinions — averaging draws is not a valid conflation method
  reg['conflation'] = box => {
    title(box, 'Conflating expert opinions', 'averaging independent draws shrinks spread — that is the wrong way to combine estimates');
    const base = [{ a: 80, c: 100, b: 130 }, { a: 90, c: 110, b: 150 }, { a: 70, c: 95, b: 120 }];
    const center = mean(base.map(e => e.c));
    const v = controls(box, [
      { k: 'disagree', label: 'Expert disagreement (spread scale)', min: 0.5, max: 2, step: 0.1, v: 1 },
      { k: 'method', label: 'Conflation method', type: 'select', v: 'avgdraws', options: [
        ['avgdraws', 'Average of independent draws (wrong)'],
        ['avgparams', 'Average L/M/H params, then sample'],
        ['samepercentile', 'Average at same percentile'],
        ['mixture', 'Stacked PDFs (mixture, 1/n each)'],
        ['randexpert', 'Random expert per trial']
      ] }
    ], draw);
    const row = E('div', 'w-2col'); const L = E('div'), R = E('div'); row.append(L, R); box.appendChild(row);
    const ro = readout(box);
    function experts() { const s = v.disagree; return base.map(e => ({ a: center + s * (e.a - center), c: center + s * (e.c - center), b: center + s * (e.b - center) })); }
    function sample(method, exps, r) {
      if (method === 'avgdraws') return mean(exps.map(e => M.triInv(r(), e.a, e.c, e.b)));
      if (method === 'avgparams') { const A = mean(exps.map(e => e.a)), C = mean(exps.map(e => e.c)), B = mean(exps.map(e => e.b)); return M.triInv(r(), A, C, B); }
      if (method === 'samepercentile') { const p = r(); return mean(exps.map(e => M.triInv(p, e.a, e.c, e.b))); }
      const idx = Math.min(exps.length - 1, Math.floor(r() * exps.length));
      const e = exps[idx];
      return M.triInv(r(), e.a, e.c, e.b);
    }
    function draw() {
      L.innerHTML = ''; R.innerHTML = '';
      const N = 2000, exps = experts();
      const methods = ['avgdraws', 'avgparams', 'samepercentile', 'mixture', 'randexpert'];
      const stats = {};
      methods.forEach(m => {
        const r = M.rng(55); const arr = []; for (let i = 0; i < N; i++) arr.push(sample(m, exps, r));
        arr.sort((x, y) => x - y);
        stats[m] = { sdv: sd(arr), p10: quant(arr, 0.1), p90: quant(arr, 0.9), arr };
      });
      const cur = stats[v.method];
      const bins = 30, lo = cur.arr[0], hi = cur.arr[cur.arr.length - 1], w = (hi - lo) / bins || 1, cnt = new Array(bins).fill(0);
      cur.arr.forEach(x => cnt[Math.min(bins - 1, Math.floor((x - lo) / w))]++);
      const p1 = Plot.create(L, { w: 300, h: 230, xmin: lo, xmax: hi, ymin: 0, ymax: Math.max(...cnt) * 1.1, xlabel: 'conflated estimate', ylabel: 'frequency', yfmt: () => '' });
      p1.axes(); cnt.forEach((c, i) => p1.rect(lo + i * w, 0, lo + (i + 1) * w, c, 'bar'));
      const p2 = Plot.create(R, { w: 300, h: 230, xmin: 0, xmax: methods.length, ymin: 0, ymax: Math.max(...methods.map(m => stats[m].sdv)) * 1.2, xticks: methods.length, xlabel: '', ylabel: 'std dev', xfmt: i => (methods[Math.round(i)] || '').slice(0, 6) });
      p2.axes(); methods.forEach((m, i) => p2.rect(i + 0.15, 0, i + 0.85, stats[m].sdv, m === v.method ? 'series c2' : 'bar'));
      ro([
        ['Method', v.method, 'c1t'],
        ['Std dev', f2(cur.sdv, 2)],
        ['P10', f2(cur.p10, 2)], ['P90', f2(cur.p90, 2)],
        ['Smallest SD (misleadingly "precise")', methods.reduce((a, b) => stats[a].sdv < stats[b].sdv ? a : b)],
        ['"Average of draws" underestimates disagreement — not a valid conflation method', '']
      ]);
      publish(box, { sd: cur.sdv, p10: cur.p10, p90: cur.p90, method: v.method });
    }
    draw();
  };

  // ======================================================================
  // M9: discrete risk portfolio — Bernoulli risks, correct Var=P(1-P)C² (CEBoK prints P(1-P)C)
  reg['risk-cube'] = box => {
    title(box, 'Discrete risk portfolio', 'each risk is a Bernoulli event: E=P·C, Var=P(1-P)C² (CEBoK misprints Var=P(1-P)C)');
    const names = ['R1', 'R2', 'R3', 'R4', 'R5'];
    const defP = [0.3, 0.5, 0.1, 0.7, 0.2], defC = [5, 2, 20, 1, 10];
    const defs = [];
    names.forEach((nm, i) => defs.push({ k: 'p' + (i + 1), label: nm + ' — P(occur)', min: 0, max: 1, step: 0.05, v: defP[i], fmt: x => (x * 100).toFixed(0) + '%' }));
    names.forEach((nm, i) => defs.push({ k: 'c' + (i + 1), label: nm + ' — Consequence ($M)', min: 0.5, max: 30, step: 0.5, v: defC[i] }));
    const v = controls(box, defs, draw);
    const row = E('div', 'w-2col'); const L = E('div'), R = E('div'); row.append(L, R); box.appendChild(row);
    const ro = readout(box);
    function draw() {
      L.innerHTML = ''; R.innerHTML = '';
      const P = names.map((_, i) => v['p' + (i + 1)]), C = names.map((_, i) => v['c' + (i + 1)]);
      const ev = P.reduce((s, p, i) => s + p * C[i], 0);
      const varr = P.reduce((s, p, i) => s + p * (1 - p) * C[i] * C[i], 0);
      const sdv = Math.sqrt(varr);
      const N = 3000, r = M.rng(77); const totals = [];
      for (let i = 0; i < N; i++) { let t = 0; for (let j = 0; j < names.length; j++) if (r() < P[j]) t += C[j]; totals.push(t); }
      totals.sort((a, b) => a - b);
      const p80 = quant(totals, 0.8);
      const bins = 25, lo = totals[0], hi = totals[N - 1], w = (hi - lo) / bins || 1, cnt = new Array(bins).fill(0);
      totals.forEach(x => cnt[Math.min(bins - 1, Math.floor((x - lo) / w))]++);
      const p1 = Plot.create(L, { w: 300, h: 230, xmin: lo, xmax: hi, ymin: 0, ymax: Math.max(...cnt) * 1.1, xlabel: 'total risk cost ($M)', ylabel: 'frequency', yfmt: () => '' });
      p1.axes(); cnt.forEach((c, i) => p1.rect(lo + i * w, 0, lo + (i + 1) * w, c, 'bar'));
      p1.vline(ev, 'marker c1'); p1.vline(p80, 'marker c2');
      const maxC = Math.max(...C, 1);
      const p2 = Plot.create(R, { w: 300, h: 230, xmin: 0, xmax: 6, ymin: 0, ymax: 6, xticks: 5, yticks: 5, xlabel: 'likelihood bin (1-5)', ylabel: 'consequence bin (1-5)' });
      p2.axes();
      names.forEach((nm, i) => {
        const pb = Math.min(5, Math.max(1, Math.ceil(P[i] * 5) || 1));
        const cb = Math.min(5, Math.max(1, Math.ceil(C[i] / maxC * 5) || 1));
        p2.dot(pb - 0.5, cb - 0.5, 'pt hot', 8);
        p2.text(pb - 0.5, cb - 0.5 + 0.35, nm, 'annot', 'middle');
      });
      ro([
        ['Expected total (ΣP·C)', f2(ev, 2), 'c1t'],
        ['Std dev (Σ P(1-P)C², independence)', f2(sdv, 2)],
        ['P80 of total (from Monte Carlo — needs simulation, not a formula)', f2(p80, 2), 'c2t'],
        ['Distribution is lumpy/skewed, not normal — mean ± z·σ misleads here', '']
      ]);
      publish(box, { ev, sd: sdv, p80 });
    }
    draw();
  };

  // ======================================================================
  // M10: two-sample t-test — DoD vs NAVAIR cost growth factor (Figs. 10.18-10.21)
  // local t-distribution pdf (lgamma copy — wmath does not export one)
  function tLgamma(z) {
    const g = [676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - tLgamma(1 - z);
    z -= 1; let x = 0.99999999999980993;
    for (let i = 0; i < 8; i++) x += g[i] / (z + i + 1);
    const t = z + 7.5;
    return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
  }
  function tpdf(t, df) {
    const lc = tLgamma((df + 1) / 2) - tLgamma(df / 2) - 0.5 * Math.log(df * Math.PI);
    return Math.exp(lc - (df + 1) / 2 * Math.log(1 + t * t / df));
  }
  reg['two-sample-t'] = box => {
    title(box, 'Two-sample t-test', 'DoD vs NAVAIR cost growth factor — is the difference in means real?');
    const v = controls(box, [
      { k: 'xbar', label: 'X̄ (DoD mean CGF)', min: 0.8, max: 1.8, step: 0.01, v: 1.19 },
      { k: 'ybar', label: 'Ȳ (NAVAIR mean CGF)', min: 0.8, max: 1.8, step: 0.01, v: 1.33 },
      { k: 'sx2', label: 'Sx² (DoD variance)', min: 0.02, max: 0.4, step: 0.01, v: 0.12 },
      { k: 'sy2', label: 'Sy² (NAVAIR variance)', min: 0.02, max: 0.4, step: 0.01, v: 0.09 },
      { k: 'n', label: 'n = m (sample size per group)', min: 5, max: 40, step: 1, v: 20 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    legend(box, [['area', 't-distribution'], ['band', 'rejection region (α=.05)'], ['c2', 'T statistic']]);
    const ro = readout(box);
    function draw() {
      pb.innerHTML = '';
      const n = v.n, m = v.n, df = n + m - 2;
      const sp2 = ((n - 1) * v.sx2 + (m - 1) * v.sy2) / (n + m - 2);
      const T = (v.xbar - v.ybar) / Math.sqrt(sp2 * (1 / n + 1 / m));
      const crit = M.tinv(0.975, df);
      const pval = 2 * (1 - M.tcdf(Math.abs(T), df));
      const lim = Math.max(4, Math.abs(T) + 1, crit + 1);
      const p = Plot.create(pb, { xmin: -lim, xmax: lim, ymin: 0, ymax: tpdf(0, df) * 1.15, xlabel: 't', ylabel: 'density', yfmt: () => '' });
      p.axes();
      const nseg = 100, lo = [], hi = [];
      for (let i = 0; i <= nseg; i++) { const x = -lim + 2 * lim * i / nseg; lo.push([x, tpdf(x, df)]); }
      p.fn(x => tpdf(x, df), 'series area', 120);
      const leftband = [[-lim, 0]]; for (let i = 0; i <= nseg; i++) { const x = -lim + (-crit + lim) * i / nseg; leftband.push([x, tpdf(x, df)]); } leftband.push([-crit, 0]);
      const rightband = [[crit, 0]]; for (let i = 0; i <= nseg; i++) { const x = crit + (lim - crit) * i / nseg; rightband.push([x, tpdf(x, df)]); } rightband.push([lim, 0]);
      [leftband, rightband].forEach(seg => {
        const d = 'M' + seg.map(q => p.x(q[0]).toFixed(1) + ',' + p.y(q[1]).toFixed(1)).join('L') + 'Z';
        Plot.svgEl('path', { d, class: 'band' }, p.svg);
      });
      p.vline(-crit, 'marker'); p.vline(crit, 'marker');
      p.vline(T, 'marker c2 hot');
      const reject = Math.abs(T) > crit;
      ro([
        ['Pooled variance Sp² = [(n-1)Sx²+(m-1)Sy²]/(n+m-2)', f2(sp2, 2), 'c1t'],
        ['T = (X̄-Ȳ)/(Sp·√(1/n+1/m))', f2(T, 2)],
        ['df = n+m-2', df],
        ['Critical value (α=.05, two-tailed)', '±' + f2(crit, 2)],
        ['p-value', f2(pval, 3)],
        ['Verdict', reject ? 'reject H0 — means differ' : 'fail to reject H0 — no significant difference', reject ? 'bad' : 'good']
      ]);
      publish(box, { sp2, T, df, crit, pval });
    }
    draw();
  };

  // ======================================================================
  // M10: Central Limit Theorem builder — sum of triangular distributions approaches normal (Fig. 10.11)
  reg['clt-builder'] = box => {
    title(box, 'CLT builder', 'sum enough skewed triangular WBS elements and the total looks normal');
    const TRIS = [[0.5, 1.0, 3.0], [3.5, 4.5, 7.5], [6.5, 8.0, 12.0]];
    const v = controls(box, [
      { k: 'k', label: 'Number of elements summed', min: 1, max: 30, step: 1, v: 1 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    legend(box, [['bar', 'simulated sum'], ['c1', 'normal overlay (same mean, sd)']]);
    const ro = readout(box);
    function draw() {
      pb.innerHTML = '';
      const N = 5000, r = M.rng(7), arr = [];
      for (let i = 0; i < N; i++) {
        let s = 0;
        for (let j = 0; j < v.k; j++) { const [a, c, b] = TRIS[j % 3]; s += M.triInv(r(), a, c, b); }
        arr.push(s);
      }
      const mu = mean(arr), s2 = sd(arr);
      const skew = arr.reduce((acc, x) => acc + Math.pow((x - mu) / s2, 3), 0) / N;
      const sorted = arr.slice().sort((a, b) => a - b);
      const bins = 30, lo = sorted[0], hi = sorted[sorted.length - 1], w = (hi - lo) / bins || 1, cnt = new Array(bins).fill(0);
      sorted.forEach(x => cnt[Math.min(bins - 1, Math.floor((x - lo) / w))]++);
      const maxCnt = Math.max(...cnt);
      const p = Plot.create(pb, { xmin: lo, xmax: hi, ymin: 0, ymax: maxCnt * 1.15, xlabel: 'sum', ylabel: 'frequency', yfmt: () => '' });
      p.axes(); cnt.forEach((c, i) => p.rect(lo + i * w, 0, lo + (i + 1) * w, c, 'bar'));
      const peak = N * w / (s2 * Math.sqrt(2 * Math.PI));
      p.fn(x => peak * Math.exp(-0.5 * ((x - mu) / s2) ** 2), 'series c1', 120);
      ro([
        ['Elements summed (k)', v.k],
        ['Mean of sum', f2(mu, 2)],
        ['Std dev of sum', f2(s2, 2)],
        ['Sample skewness', f2(skew, 3), Math.abs(skew) < 0.15 ? 'good' : ''],
        ['Shape', Math.abs(skew) < 0.15 ? 'approximately normal (CLT)' : 'still visibly skewed']
      ]);
      publish(box, { k: v.k, mean: mu, sd: s2, skew });
    }
    draw();
  };

  // ======================================================================
  // M10: normal vs lognormal at varying CV (Fig. 10.24) — tests can't tell them apart below CV 25%
  reg['normal-vs-lognormal'] = box => {
    title(box, 'Normal vs lognormal', 'same mean and sd, different shapes — the gap only shows up at higher CV');
    const v = controls(box, [
      { k: 'cv', label: 'Coefficient of variation', min: 5, max: 60, step: 1, v: 10, fmt: x => x + '%' }
    ], draw);
    const bar = E('div', 'w-presets');
    [['CV 10%', 10], ['CV 25%', 25], ['CV 50%', 50]].forEach(([lbl, cv]) => { const b = E('button', 'chip', lbl); b.onclick = () => box.w.set('cv', cv); bar.appendChild(b); });
    box.appendChild(bar);
    const pb = E('div'); box.appendChild(pb);
    legend(box, [['c1', 'normal'], ['c2', 'lognormal']]);
    const ro = readout(box);
    function draw() {
      pb.innerHTML = '';
      const mu = 10, sdv = mu * v.cv / 100;
      const sg = Math.sqrt(Math.log(1 + (sdv / mu) ** 2));
      const mln = Math.log(mu) - sg * sg / 2;
      const npdf = x => Math.exp(-0.5 * ((x - mu) / sdv) ** 2) / (sdv * Math.sqrt(2 * Math.PI));
      const lpdf = x => x <= 0 ? 0 : Math.exp(-((Math.log(x) - mln) ** 2) / (2 * sg * sg)) / (x * sg * Math.sqrt(2 * Math.PI));
      const lo = Math.max(0, mu - 4 * sdv), hi = mu + 4 * sdv;
      let ymax = 0; for (let i = 0; i <= 200; i++) { const x = lo + (hi - lo) * i / 200; ymax = Math.max(ymax, npdf(x), lpdf(x)); }
      const p = Plot.create(pb, { xmin: lo, xmax: hi, ymin: 0, ymax: ymax * 1.1, xlabel: 'x', ylabel: 'density', yfmt: () => '' });
      p.axes(); p.fn(npdf, 'series c1', 150); p.fn(lpdf, 'series c2', 150);
      const distinguishable = v.cv >= 25;
      ro([
        ['Mean (fixed)', f2(mu, 1)],
        ['Std dev = mean·CV', f2(sdv, 2)],
        ['ln-space sigma', f2(sg, 3)],
        ['Tests can distinguish normal vs lognormal?', distinguishable ? 'yes (CV ≥ 25%)' : 'no (CV < 25%)', distinguishable ? 'good' : 'bad'],
        ['CEBoK note', 'below 25% CV, data passes both a normality and a lognormality test']
      ]);
      publish(box, { mean: mu, sd: sdv, sigmaLn: sg, distinguishable });
    }
    draw();
  };

  // ======================================================================
  // M10: confidence intervals for mu and sigma vs sample size (Figs. 10.27-10.29)
  // chi-squared inverse via Wilson-Hilferty approximation (not exact — labeled as such)
  function chi2invWH(p, df) {
    const z = M.zinv(p), h = 2 / (9 * df);
    const val = df * Math.pow(1 - h + z * Math.sqrt(h), 3);
    return Math.max(val, 1e-6);
  }
  reg['ci-sigma'] = box => {
    title(box, 'CI width vs sample size', 'the penalty for not knowing σ, and how hard σ itself is to pin down');
    const v = controls(box, [
      { k: 'n', label: 'Sample size n', min: 2, max: 100, step: 1, v: 6 }
    ], draw);
    const row = E('div', 'w-2col'); const L = E('div'), R = E('div'); row.append(L, R); box.appendChild(row);
    legend(box, [['c1', 't-based (σ unknown)'], ['c2', 'z-based (σ known)'], ['band', 'σ 95% CI (χ²)']]);
    const ro = readout(box);
    function draw() {
      L.innerHTML = ''; R.innerHTML = '';
      const n = v.n, df = n - 1;
      const nMax = 100, pts1 = [], pts2 = [];
      for (let nn = 2; nn <= nMax; nn++) {
        const d = nn - 1;
        pts1.push([nn, M.tinv(0.975, d) / Math.sqrt(nn)]);
        pts2.push([nn, M.zinv(0.975) / Math.sqrt(nn)]);
      }
      const ymax1 = Math.max(...pts1.map(q => q[1])) * 1.1;
      const p1 = Plot.create(L, { w: 300, h: 230, xmin: 2, xmax: nMax, ymin: 0, ymax: ymax1, xlabel: 'n', ylabel: 'half-width factor (× s/√n or σ/√n)' });
      p1.axes(); p1.line(pts1, 'series c1'); p1.line(pts2, 'series c2'); p1.vline(n, 'marker hot');
      const sigLoPts = [], sigHiPts = [];
      for (let nn = 2; nn <= nMax; nn++) {
        const d = nn - 1;
        const chiHi = chi2invWH(0.975, d), chiLo = chi2invWH(0.025, d);
        sigLoPts.push([nn, Math.sqrt(d / chiHi)]);
        sigHiPts.push([nn, Math.sqrt(d / chiLo)]);
      }
      const ymax2 = Math.max(...sigHiPts.map(q => q[1])) * 1.1;
      const p2 = Plot.create(R, { w: 300, h: 230, xmin: 2, xmax: nMax, ymin: 0, ymax: ymax2, xlabel: 'n', ylabel: 'σ CI as multiple of s' });
      p2.axes();
      const band = sigLoPts.concat(sigHiPts.slice().reverse());
      const d = 'M' + band.map(q => p2.x(q[0]).toFixed(1) + ',' + p2.y(q[1]).toFixed(1)).join('L') + 'Z';
      Plot.svgEl('path', { d, class: 'band' }, p2.svg);
      p2.hline(1, 'marker'); p2.vline(n, 'marker hot');
      const tMult = M.tinv(0.975, df) / Math.sqrt(n), zMult = M.zinv(0.975) / Math.sqrt(n);
      const ratio = tMult / zMult - 1;
      const chiHi = chi2invWH(0.975, df), chiLo = chi2invWH(0.025, df);
      const sigLo = Math.sqrt(df / chiHi), sigHi = Math.sqrt(df / chiLo);
      ro([
        ['df = n-1', df],
        ['t(.975,df) half-width factor', f2(tMult, 3), 'c1t'],
        ['z(.975) half-width factor (σ known)', f2(zMult, 3), 'c2t'],
        ['Penalty of not knowing σ', pct(ratio, 1) + ' wider'],
        ['σ 95% CI (× sample s), lower/upper', `${f2(sigLo, 3)} / ${f2(sigHi, 3)}`],
        ['χ² inverse method', 'Wilson-Hilferty approximation (not exact)']
      ]);
      publish(box, { tMult, zMult, ratio, sigLo, sigHi });
    }
    draw();
  };

  // ======================================================================
  // M12: sw-cost-drivers — PM = A * KSLOC^E * EM (COCOMO II), Tables 12.2-12.4
  reg['sw-cost-drivers'] = box => {
    title(box, 'Software cost drivers', 'PM = 2.94 x KSLOC^1.0997 x EM');
    const presets = [
      ['0', 'Size (Table 12.2)'],
      ['1', 'Complexity EM (Table 12.3)'],
      ['2', 'Capability EM (Table 12.4)']
    ];
    const v = controls(box, [
      { k: 'preset', label: 'Scenario', type: 'select', v: '0', options: presets },
      { k: 'kslc', label: 'Size (KSLOC)', min: 10, max: 200, step: 1, v: 100 },
      { k: 'em', label: 'Effort multiplier (EM)', min: 0.3, max: 5.5, step: 0.01, v: 1.0 },
      { k: 'rate', label: 'Rate ($/PM)', min: 5000, max: 25000, step: 500, v: 16000 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    const ro = readout(box);
    const note = E('div', 'w-note'); box.appendChild(note);
    const A = 2.94, EXP = 1.0997;
    const SCEN = {
      '0': { xlabel: 'KSLOC', pts: [[50, 1, 16000, '217 PM -> $3,473,959'], [100, 1, 16000, '465 PM -> $7,445,045'], [150, 1, 16000, '726 PM -> $11,628,264 (source prints 11,628,624 - typo)']] },
      '1': { xlabel: 'complexity EM', pts: [[100, 0.6, 16000, '279 PM -> $4,467,027 (low)'], [100, 1.0, 16000, '465 PM -> $7,445,045 (nominal)'], [100, 3.5, 16000, '1628 PM -> $26,057,657 (high)']] },
      '2': { xlabel: 'capability EM', pts: [[100, 0.33, 20000, '154 PM -> $3,071,081 (best, $20K/PM)'], [100, 1.0, 16000, '465 PM -> $7,445,045 (avg, $16K/PM)'], [100, 5.22, 14000, '2429 PM -> $34,005,242 (junior, $14K/PM)']] }
    };
    function draw() {
      const pm = A * Math.pow(v.kslc, EXP) * v.em;
      const cost = pm * v.rate;
      pb.innerHTML = '';
      const scen = SCEN[v.preset];
      const ymax = Math.max(...scen.pts.map(p => A * Math.pow(p[0], EXP) * p[1] * p[2]), cost) * 1.1;
      const p = Plot.create(pb, { h: 240, xmin: 0, xmax: 3, ymin: 0, ymax, xlabel: '', ylabel: '$', xticks: 3, xfmt: () => '' });
      p.axes();
      scen.pts.forEach((pt, i) => {
        const c = A * Math.pow(pt[0], EXP) * pt[1] * pt[2];
        p.rect(i + 0.15, 0, i + 0.85, c, 'bar c1f');
        p.text(i + 0.5, c + ymax * 0.03, '$' + f2(c, 0), 'annot', 'middle');
      });
      ro([
        ['Effort (PM)', f2(pm, 1)],
        ['Cost', '$' + f2(cost, 0), 'good'],
        ['KSLOC', f2(v.kslc, 0)],
        ['EM', f2(v.em, 2)],
        ['Rate', '$' + f2(v.rate, 0) + '/PM']
      ]);
      note.innerHTML = scen.pts.map(p2 => p2[3]).join('<br>');
      publish(box, { pm, cost, kslc: v.kslc, em: v.em });
    }
    draw();
  };

  // ======================================================================
  // M12: sw-schedule — Tdev = 3.67 * PM^(0.28+0.2(E-0.91)) * SCED%
  reg['sw-schedule'] = box => {
    title(box, 'Development schedule', 'Tdev = 3.67 x PM^(0.28 + 0.2(E - 0.91)) x SCED%');
    const v = controls(box, [
      { k: 'pm', label: 'Person-months (PM)', min: 10, max: 700, step: 1, v: 465 },
      { k: 'E', label: 'Scale factor sum (E)', min: 0.91, max: 1.4, step: 0.001, v: 1.1433 },
      { k: 'sced', label: 'SCED% (schedule compression)', min: 0.5, max: 1.5, step: 0.01, v: 1.0, fmt: x => pct(x, 0) },
      { k: 'target', label: 'Target months (0 = off)', min: 0, max: 40, step: 1, v: 18 },
      { k: 'ex', label: 'Show parametric example (PM 23.92, exp 0.262)', type: 'checkbox', v: 0 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    const ro = readout(box);
    const note = E('div', 'w-note'); box.appendChild(note);
    const B = 0.91, D = 0.28, C = 3.67;
    function tdev(pm, e, sced) { return C * Math.pow(pm, D + 0.2 * (e - B)) * sced; }
    function draw() {
      const exp = D + 0.2 * (v.E - B);
      const t = tdev(v.pm, v.E, v.sced);
      const needSced = v.target > 0 ? v.target / (C * Math.pow(v.pm, exp)) : null;
      pb.innerHTML = '';
      const p = Plot.create(pb, { h: 240, xmin: 0, xmax: Math.max(700, v.pm * 1.2), ymin: 0, ymax: tdev(Math.max(700, v.pm * 1.2), v.E, v.sced) * 1.1, xlabel: 'PM', ylabel: 'Tdev (months)' });
      p.axes(); p.fn(x => tdev(x, v.E, v.sced), 'series c1'); p.dot(v.pm, t, 'pt hot', 5);
      const rows = [
        ['Exponent', f2(exp, 4)],
        ['Tdev at default (PM 465, E 1.1433, SCED 100%)', f2(tdev(465, 1.1433, 1.0), 2) + ' mo (source: 27.28)'],
        ['Tdev at current inputs', f2(t, 2) + ' mo', 'good']
      ];
      if (v.target > 0) {
        rows.push(['Required SCED% for ' + f2(v.target, 0) + '-month target', pct(needSced, 0), 'good']);
        rows.push(['Compression (1 - SCED%)', pct(1 - needSced, 0)]);
        rows.push(['Table example: 18-month target on 465 PM', 'SCED% = 0.66, 34% compression']);
      }
      if (v.ex) {
        const exPm = 23.92, exExp = 0.262, exT = 3.67 * Math.pow(exPm, exExp);
        rows.push(['Parametric example: PM ' + exPm + ', exponent ' + exExp, f2(exT, 2) + ' mo (source: 8.43)']);
        rows.push(['Note', 'source states this exponent directly rather than via 0.28+0.2(E-0.91); using the general formula with E=1 gives a different result (~9.4 mo) — a documented inconsistency in the source text.']);
      }
      ro(rows);
      note.textContent = 'SCED% below 1.0 compresses the schedule (and raises risk/cost); above 1.0 stretches it.';
      publish(box, { tdev: t, exp, needSced: needSced == null ? 0 : needSced });
    }
    draw();
  };

  // ======================================================================
  // M12: sw-analogy — Fig 12.13 COTS setup analogy adjustments
  reg['sw-analogy'] = box => {
    title(box, 'Analogy: COTS set-up estimate', 'Fig. 12.13 — adjust a prior effort\'s hours by task');
    const v = controls(box, [
      { k: 'setupH', label: 'Set-up base hours', min: 0, max: 500, step: 10, v: 280 },
      { k: 'setupAdj', label: 'Set-up adjustment %', min: -50, max: 50, step: 1, v: -20, fmt: x => (x > 0 ? '+' : '') + x + '%' },
      { k: 'dataH', label: 'Data load base hours', min: 0, max: 200, step: 5, v: 80 },
      { k: 'dataAdj', label: 'Data load adjustment %', min: -50, max: 50, step: 1, v: 0, fmt: x => (x > 0 ? '+' : '') + x + '%' },
      { k: 'implH', label: 'Implementation base hours', min: 0, max: 200, step: 5, v: 100 },
      { k: 'implAdj', label: 'Implementation adjustment %', min: -50, max: 50, step: 1, v: -15, fmt: x => (x > 0 ? '+' : '') + x + '%' },
      { k: 'trainH', label: 'Training base hours', min: 0, max: 100, step: 5, v: 20 },
      { k: 'trainAdj', label: 'Training adjustment %', min: -50, max: 50, step: 1, v: -15, fmt: x => (x > 0 ? '+' : '') + x + '%' },
      { k: 'rate', label: 'Fully-burdened rate ($/yr)', min: 50000, max: 200000, step: 5000, v: 100000 },
      { k: 'hrsYr', label: 'Standard hours/year', min: 1000, max: 2500, step: 10, v: 1920 }
    ], draw);
    const tb = E('div', 'w-table'); box.appendChild(tb);
    const ro = readout(box);
    function draw() {
      const rows = [
        ['Set-up', v.setupH, v.setupAdj],
        ['Data load', v.dataH, v.dataAdj],
        ['Implementation', v.implH, v.implAdj],
        ['Training', v.trainH, v.trainAdj]
      ].map(([name, h, adj]) => [name, h, adj, h * (1 + adj / 100)]);
      tb.innerHTML = '<table><tr><th>Task</th><th>Base hrs</th><th>Adj %</th><th>Adjusted hrs</th></tr>' +
        rows.map(r => `<tr><td>${r[0]}</td><td>${f2(r[1], 0)}</td><td>${r[2] > 0 ? '+' : ''}${r[2]}%</td><td>${f2(r[3], 1)}</td></tr>`).join('') + '</table>';
      const totalHrs = rows.reduce((a, r) => a + r[3], 0);
      const cost = totalHrs / v.hrsYr * v.rate;
      ro([
        ['Total hours', f2(totalHrs, 0), 'good'],
        ['Source total (Fig 12.13)', '406 hours'],
        ['Cost', '$' + f2(cost, 0), 'good'],
        ['Source cost', '$21,145']
      ]);
      publish(box, { totalHrs, cost });
    }
    draw();
  };

  // ======================================================================
  // M12: sloc-rollup — Fig 12.7 waterfall CSCI/CSC SLOC tree with roll-up cost/schedule
  reg['sloc-rollup'] = box => {
    title(box, 'SLOC roll-up (Fig. 12.7)', 'edit leaf SLOC; CSCI, system total, cost and schedule roll up');
    const v = controls(box, [
      { k: 'c1a', label: 'CSCI1 CSC1 — Develop orders (SLOC)', min: 0, max: 20000, step: 500, v: 5000 },
      { k: 'c1b', label: 'CSCI1 CSC2 — Submit orders (SLOC)', min: 0, max: 20000, step: 500, v: 7500 },
      { k: 'c2', label: 'CSCI2 — Verify order (SLOC)', min: 0, max: 10000, step: 500, v: 3000 },
      { k: 'c3', label: 'CSCI3 — Approve order (SLOC)', min: 0, max: 10000, step: 500, v: 1000 },
      { k: 'c4', label: 'CSCI4 — Status report (SLOC)', min: 0, max: 10000, step: 500, v: 2500 },
      { k: 'rate', label: 'Rate ($/PM)', min: 5000, max: 25000, step: 500, v: 16000 }
    ], draw);
    const tb = E('div', 'w-table'); box.appendChild(tb);
    const ro = readout(box);
    const note = E('div', 'w-note'); box.appendChild(note);
    const A = 2.94, EXP = 1.0405, EM = 0.38;
    function draw() {
      const csci1 = v.c1a + v.c1b;
      const total = csci1 + v.c2 + v.c3 + v.c4;
      const kslc = total / 1000;
      const pm = A * Math.pow(kslc, EXP) * EM;
      const cost = pm * v.rate;
      const tdev = 3.67 * Math.pow(pm, 0.262);
      tb.innerHTML = '<table>' +
        `<tr><th>CSCI</th><th>SLOC</th></tr>` +
        `<tr><td>CSCI1: Develop/submit orders (CSC1 + CSC2)</td><td>${f2(csci1, 0)}</td></tr>` +
        `<tr><td>CSCI2: Verify order</td><td>${f2(v.c2, 0)}</td></tr>` +
        `<tr><td>CSCI3: Approve order</td><td>${f2(v.c3, 0)}</td></tr>` +
        `<tr><td>CSCI4: Status report</td><td>${f2(v.c4, 0)}</td></tr>` +
        `<tr><td><b>Total custom SLOC</b></td><td><b>${f2(total, 0)}</b></td></tr>` +
        `<tr><td colspan="2">+ COTS Package 1, COTS Package 2 (priced separately, picked up for integration)</td></tr>` +
        '</table>';
      ro([
        ['Total custom SLOC', f2(total, 0) + ' (source: 19,000)', 'good'],
        ['KSLOC', f2(kslc, 3)],
        ['Effort (PM = 2.94 x KSLOC^1.0405 x 0.38)', f2(pm, 2) + ' PM (source: 23.92)', 'good'],
        ['Cost', '$' + f2(cost, 0) + ' (source: $382,643)', 'good'],
        ['Schedule (Tdev = 3.67 x PM^0.262)', f2(tdev, 2) + ' mo (source: 8.43)', 'good']
      ]);
      note.textContent = 'Default leaves reproduce CEBoK Fig. 12.7: CSCI1 5,000+7,500, CSCI2 3,000, CSCI3 1,000, CSCI4 2,500 = 19,000 custom SLOC, plus two COTS packages priced separately.';
      publish(box, { total, pm, cost, tdev });
    }
    draw();
  };

  // ======================================================================
  // M11: skill-mix — weighted (composite) rate vs unweighted average rate (Fig 11.4)
  reg['skill-mix'] = box => {
    title(box, 'Skill-mix composite rate', 'composite = weighted by hours; unweighted average ignores how the hours are actually spent');
    const v = controls(box, [
      { k: 'r1', label: 'Category 1 rate $/hr', min: 10, max: 80, step: 0.25, v: 25 },
      { k: 'h1', label: 'Category 1 hours', min: 0, max: 2000, step: 10, v: 1000 },
      { k: 'r2', label: 'Category 2 rate $/hr', min: 10, max: 80, step: 0.25, v: 30 },
      { k: 'h2', label: 'Category 2 hours', min: 0, max: 2000, step: 10, v: 500 },
      { k: 'r3', label: 'Category 3 rate $/hr', min: 10, max: 80, step: 0.25, v: 40 },
      { k: 'h3', label: 'Category 3 hours', min: 0, max: 2000, step: 10, v: 250 },
      { k: 'r4', label: 'Category 4 rate $/hr', min: 10, max: 80, step: 0.25, v: 50 },
      { k: 'h4', label: 'Category 4 hours', min: 0, max: 2000, step: 10, v: 250 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    legend(box, [['c1', 'hours share by category']]);
    const ro = readout(box);
    const note = E('div', 'w-note'); box.appendChild(note);
    function draw() {
      const rates = [v.r1, v.r2, v.r3, v.r4], hrs = [v.h1, v.h2, v.h3, v.h4];
      const totH = hrs.reduce((a, b) => a + b, 0);
      const totCost = rates.reduce((a, r, i) => a + r * hrs[i], 0);
      const composite = totH > 0 ? totCost / totH : 0;
      const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
      pb.innerHTML = '';
      const ymax = Math.max(...hrs, 1) * 1.2;
      const p = Plot.create(pb, { h: 220, xmin: 0, xmax: 4, ymin: 0, ymax, xlabel: 'category', ylabel: 'hours', xticks: 4, xfmt: x => 'C' + Math.round(x) });
      p.axes();
      hrs.forEach((h, i) => {
        p.rect(i + 0.15, 0, i + 0.85, h, 'bar c1f');
        p.text(i + 0.5, h + ymax * 0.03, f2(h, 0), 'annot', 'middle');
      });
      ro([
        ['Total hours', f2(totH, 0)],
        ['Total labor cost', f2(totCost, 0)],
        ['Composite (weighted) rate', f2(composite, 2), 'good'],
        ['Unweighted average rate', f2(avgRate, 2)],
        ['CEBoK Fig 11.4 rounds unweighted avg to', '$36.00']
      ]);
      note.textContent = 'Composite is lower because most hours (1000 of ' + f2(totH, 0) + ') fall in the cheapest category — the unweighted average treats every category as if it had equal hours, which overstates the true blended rate.';
      publish(box, { totH, totCost, composite, avgRate });
    }
    draw();
  };

  // ======================================================================
  // M11: pfd-standard — Standard time = Measured x Pace / (1 - PF&D), Maynard formula (Table 11.2)
  reg['pfd-standard'] = box => {
    title(box, 'PF&D and standard time', 'Standard time = Measured time x Pace / (1 - PF&D)');
    const v = controls(box, [
      { k: 'measured', label: 'Measured time (hrs)', min: 0.1, max: 5, step: 0.05, v: 1 },
      { k: 'pace', label: 'Pace', min: 0.5, max: 1.5, step: 0.01, v: 1 },
      { k: 'pfd', label: 'PF&D', min: 0, max: 0.6, step: 0.01, v: 0.1, fmt: x => pct(x, 0) },
      { k: 'newpfd', label: 'Table 11.2: new PF&D', min: 0, max: 0.6, step: 0.01, v: 0.25, fmt: x => pct(x, 0) },
      { k: 'qty', label: 'Table 11.2: linear feet', min: 0, max: 2000, step: 10, v: 750 }
    ], draw);
    const ro = readout(box);
    const ro2 = readout(box);
    const note = E('div', 'w-note'); box.appendChild(note);
    const OPS = [['Fit', 2.5], ['Weld', 1.7], ['Grind', 0.8]];
    function draw() {
      const std = v.measured * v.pace / (1 - v.pfd);
      ro([
        ['Measured time', f2(v.measured, 2) + ' hr'],
        ['Pace', f2(v.pace, 2)],
        ['PF&D', pct(v.pfd, 0)],
        ['Standard time', f2(std, 3) + ' hr', 'good']
      ]);
      const rows = [];
      let grandOld = 0, grandNew = 0;
      OPS.forEach(([name, stdHrsAt10]) => {
        const measured = stdHrsAt10 * (1 - 0.10); // back out measured time at pace = 1.0
        const newStd = measured / (1 - v.newpfd);
        const naive = stdHrsAt10 * (1 + (v.newpfd - 0.10)); // naive x(1+PF&D) style adjustment for contrast
        const oldTotal = stdHrsAt10 * v.qty;
        const newTotal = newStd * v.qty;
        grandOld += oldTotal; grandNew += newTotal;
        rows.push([name + ': std @10% PF&D', f2(stdHrsAt10, 2) + ' hr/lf']);
        rows.push([name + ': measured (back-calculated)', f2(measured, 2) + ' hr/lf']);
        rows.push([name + ': new std @ ' + pct(v.newpfd, 0), f2(newStd, 2) + ' hr/lf', 'good']);
        rows.push([name + ': naive x(1+PF&D) estimate (wrong)', f2(naive, 2) + ' hr/lf', 'bad']);
        rows.push([name + ': total @ ' + f2(v.qty, 0) + ' lf', f2(newTotal, 0) + ' hr']);
      });
      rows.push(['Grand total @ 10% PF&D', f2(grandOld, 0) + ' hr']);
      rows.push(['Grand total @ new PF&D', f2(grandNew, 0) + ' hr', 'good']);
      ro2(rows);
      note.textContent = 'The correct formula divides by (1 - PF&D), which grows faster than a naive "multiply by (1 + PF&D)" approximation as PF&D increases — the naive method understates the standard time.';
      publish(box, { std, grandOld, grandNew });
    }
    draw();
  };

  // ======================================================================
  // M11: mua-moving-average — scrap-rate reconstruction + moving average, and raw material cost
  reg['mua-moving-average'] = box => {
    title(box, 'Material utilization (scrap rate) trend', 'reconstructed series (source figure unreadable) — last-5 mean fixed at 22.4%');
    // Deterministic 20-point series, no learning trend, last-5 mean = 22.4% exactly.
    // Values chosen by hand (not from the source image) purely to hit that anchor.
    const SERIES = [26, 21, 24, 19, 27, 20, 25, 18, 23, 21, 26, 19, 24, 20, 27, 21, 25, 19, 22, 22].map(x => x / 100);
    // last five: 21,25,19,22,22 -> mean 21.8; adjust to hit 22.4 exactly by construction below
    const LAST5 = [24, 21, 23, 22, 22].map(x => x / 100); // mean = 22.4
    const FULL = SERIES.slice(0, 15).concat(LAST5);
    const v = controls(box, [
      { k: 'window', label: 'Moving-average window', min: 3, max: 10, step: 1, v: 5 },
      { k: 'weight', label: 'Panel weight (lb)', min: 1, max: 500, step: 1, v: 100 },
      { k: 'price', label: '$/lb', min: 1, max: 500, step: 1, v: 200 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    legend(box, [['pt', 'unit scrap rate'], ['c1', 'moving average']]);
    const ro = readout(box);
    const note = E('div', 'w-note'); box.appendChild(note);
    function movingAvg(arr, w) {
      const out = [];
      for (let i = 0; i < arr.length; i++) {
        const lo = Math.max(0, i - w + 1);
        const slice = arr.slice(lo, i + 1);
        out.push(slice.reduce((a, b) => a + b, 0) / slice.length);
      }
      return out;
    }
    function draw() {
      pb.innerHTML = '';
      const ma = movingAvg(FULL, v.window);
      const ymax = Math.max(...FULL) * 1.2;
      const p = Plot.create(pb, { h: 240, xmin: 0, xmax: 21, ymin: 0, ymax, xlabel: 'unit', ylabel: 'scrap rate' });
      p.axes();
      FULL.forEach((y, i) => p.dot(i + 1, y, 'pt', 4));
      p.line(FULL.map((y, i) => [i + 1, ma[i]]), 'series c1');
      const last5mean = LAST5.reduce((a, b) => a + b, 0) / LAST5.length;
      const mua = last5mean;
      const rawCost = v.weight * (1 + mua) * v.price;
      ro([
        ['Last-5-unit mean scrap rate (MUA)', pct(mua, 1), 'good'],
        ['Window size', v.window],
        ['Latest moving average', pct(ma[ma.length - 1], 1)],
        ['Raw material weight needed', f2(v.weight * (1 + mua), 2) + ' lb'],
        ['Raw material cost', '$' + f2(rawCost, 0), 'good'],
        ['CEBoK printed value (arithmetic slip)', '$24,520']
      ]);
      note.textContent = 'Series is a deterministic reconstruction (the source figure image is unreadable), built only so the last five points average to 22.4% scrap — it is not the original data. CEBoK\'s printed raw-material cost of $24,520 differs slightly from the exact arithmetic ($24,480), a rounding/arithmetic slip in the source.';
      publish(box, { mua, rawCost });
    }
    draw();
  };

  // ======================================================================
  // M11: design-scrap — stock choice vs machining & scrap (Fig 11.9), illustrative numbers
  reg['design-scrap'] = box => {
    title(box, 'Design for manufacture: stock choice vs. scrap', 'illustrative numbers, not exact CEBoK figures — same finished 3-in cover part, three stock options');
    const v = controls(box, [
      { k: 'stock', label: 'Stock option', type: 'select', v: 'plate4', options: [['plate4', '4-in plate (heavy machining)'], ['plate3', '3-in plate (less machining)'], ['nearnet', 'Near-net square plate (no machining)']] },
      { k: 'price', label: '$/lb material', min: 1, max: 50, step: 0.5, v: 8 },
      { k: 'rate', label: 'Machining $/hr', min: 10, max: 200, step: 5, v: 75 }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    const ro = readout(box);
    const note = E('div', 'w-note'); box.appendChild(note);
    // Illustrative: finished part = 3-in thick, fixed finished weight = 30 lb.
    const FINISHED = 30;
    const OPTS = {
      plate4: { label: '4-in plate', bought: 45, machHrs: 4.0 },
      plate3: { label: '3-in plate', bought: 34, machHrs: 1.5 },
      nearnet: { label: 'Near-net square', bought: 30.5, machHrs: 0.2 }
    };
    function draw() {
      const o = OPTS[v.stock];
      const scrapLb = o.bought - FINISHED;
      const scrapPct = scrapLb / o.bought;
      const matCost = o.bought * v.price;
      const machCost = o.machHrs * v.rate;
      const totalCost = matCost + machCost;
      pb.innerHTML = '';
      const p = Plot.create(pb, { h: 220, xmin: 0, xmax: 3, ymin: 0, ymax: Math.max(matCost, totalCost) * 1.2, xlabel: '', ylabel: '$', xticks: 3, xfmt: () => '' });
      p.axes();
      p.rect(0.6, 0, 1.4, matCost, 'bar c1f');
      p.rect(0.6, matCost, 1.4, totalCost, 'bar c2f');
      p.text(1, matCost / 2, 'material', 'annot', 'middle');
      p.text(1, matCost + machCost / 2, 'machining', 'annot c2', 'middle');
      ro([
        ['Stock option', o.label],
        ['Material bought', f2(o.bought, 1) + ' lb'],
        ['Finished part weight', f2(FINISHED, 1) + ' lb'],
        ['Scrap weight', f2(scrapLb, 1) + ' lb'],
        ['Scrap %', pct(scrapPct, 0)],
        ['Machining hours (relative)', f2(o.machHrs, 1) + ' hr'],
        ['Material cost', '$' + f2(matCost, 0)],
        ['Machining cost', '$' + f2(machCost, 0)],
        ['Total cost', '$' + f2(totalCost, 0), 'good']
      ]);
      note.textContent = 'Numbers are illustrative (not exact CEBoK figures) — the point of Fig 11.9 is the tradeoff: buying stock closer to the finished shape cuts scrap and machining time, but near-net stock usually costs more per pound to buy.';
      publish(box, { bought: o.bought, scrapLb, scrapPct, matCost, machCost, totalCost });
    }
    draw();
  };

  // ======================================================================
  // M13: real-nominal — exact vs approximate real rate; escalation vs discounting of $100
  reg['real-nominal'] = box => {
    title(box, 'Real vs nominal rate', 'exact (1+n)/(1+i) − 1 vs the n − i shortcut');
    const v = controls(box, [
      { k: 'n', label: 'Nominal rate', min: 0, max: 0.15, step: 0.0025, v: 0.05, fmt: x => pct(x, 2) },
      { k: 'i', label: 'Inflation rate', min: 0, max: 0.15, step: 0.0025, v: 0.03, fmt: x => pct(x, 2) },
      { k: 't', label: 'Years (for the $100 illustration)', min: 1, max: 20, step: 1, v: 5 }
    ], draw);
    const ro = readout(box);
    const note = E('div', 'w-note'); box.appendChild(note);
    function draw() {
      const exact = (1 + v.n) / (1 + v.i) - 1;
      const approx = v.n - v.i;
      const escalated = 100 * Math.pow(1 + v.i, v.t);
      const discounted = escalated / Math.pow(1 + v.n, v.t);
      const directReal = 100 / Math.pow(1 + exact, v.t);
      ro([
        ['Exact real rate', pct(exact, 2), 'good'],
        ['Approx real rate (n − i)', pct(approx, 2)],
        ['CEBoK example (5% nominal, 3% inflation)', pct((1.05 / 1.03 - 1), 2) + ' exact, ' + pct(0.02, 2) + ' approx'],
        [`$100 escalated at inflation to year ${f2(v.t, 0)}`, '$' + f2(escalated, 2)],
        ['…then discounted back at the nominal rate', '$' + f2(discounted, 2)],
        ['$100 discounted directly at the real rate', '$' + f2(directReal, 2), 'good']
      ]);
      note.textContent = 'Escalating a cash flow at inflation and then discounting it at the nominal rate gives the same present value as discounting the un-escalated amount at the real rate (Fig. 13.2) — the two operations offset when done consistently.';
      publish(box, { exact, approx, escalated, discounted });
    }
    draw();
  };

  // ======================================================================
  // M13: depreciation — SL (month-of-purchase partial year) / DDB / SYD
  reg['depreciation'] = box => {
    title(box, 'Depreciation methods', 'straight-line, double-declining-balance, sum-of-the-years-digits');
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const DEFAULTS = {
      SL: { cost: 140000, salvage: 20000, life: 5, month: 4 },
      DDB: { cost: 140000, salvage: 20000, life: 5, month: 4 },
      SYD: { cost: 100000, salvage: 10000, life: 5, month: 1 }
    };
    let lastMethod = null;
    const v = controls(box, [
      { k: 'method', label: 'Method', type: 'select', v: 'SL', options: [['SL', 'Straight-line'], ['DDB', 'Double-declining balance'], ['SYD', 'Sum-of-the-years-digits']] },
      { k: 'cost', label: 'Cost', min: 1000, max: 500000, step: 1000, v: 140000 },
      { k: 'salvage', label: 'Salvage value', min: 0, max: 100000, step: 1000, v: 20000 },
      { k: 'life', label: 'Life (years)', min: 2, max: 10, step: 1, v: 5 },
      { k: 'month', label: 'Month of purchase', min: 1, max: 12, step: 1, v: 4, fmt: x => MONTHS[Math.round(x) - 1] }
    ], draw);
    const tb = E('div', 'w-table'); box.appendChild(tb);
    const pb = E('div'); box.appendChild(pb);
    const ro = readout(box);
    const note = E('div', 'w-note'); box.appendChild(note);
    function schedule() {
      const rows = [];
      if (v.method === 'SL') {
        const annual = (v.cost - v.salvage) / v.life;
        const frac1 = (12 - v.month + 1) / 12;
        let bv = v.cost;
        const dep1 = annual * frac1;
        bv -= dep1; rows.push([dep1, bv]);
        let remaining = v.cost - v.salvage - dep1;
        while (remaining > 1e-6) {
          const dep = Math.min(annual, remaining);
          bv -= dep; remaining -= dep;
          rows.push([dep, bv]);
        }
      } else if (v.method === 'DDB') {
        const rate = 2 / v.life;
        const frac1 = (12 - v.month + 1) / 12;
        let bv = v.cost;
        for (let y = 1; y <= v.life + 2 && bv > v.salvage + 1e-6; y++) {
          const f = y === 1 ? frac1 : 1;
          const dep = Math.min(bv * rate * f, bv - v.salvage);
          bv -= dep; rows.push([dep, bv]);
        }
      } else {
        const n = v.life, base = v.cost - v.salvage, sumd = n * (n + 1) / 2;
        let bv = v.cost;
        for (let y = 1; y <= n; y++) {
          const dep = (n - y + 1) / sumd * base;
          bv -= dep; rows.push([dep, bv]);
        }
      }
      return rows;
    }
    function draw() {
      if (v.method !== lastMethod) {
        lastMethod = v.method;
        box.w.setMany(DEFAULTS[v.method]);
        return;
      }
      const rows = schedule();
      tb.innerHTML = '<table><thead><tr><th>Year</th><th>Depreciation</th><th>Book value</th></tr></thead><tbody>' +
        rows.map((r, i) => `<tr><td>${v.method === 'DDB' ? 2006 + i : i + 1}</td><td>$${f2(r[0], 0)}</td><td>$${f2(r[1], 0)}</td></tr>`).join('') +
        '</tbody></table>';
      pb.innerHTML = '';
      const ymax = v.cost * 1.05;
      const p = Plot.create(pb, { h: 200, xmin: 0, xmax: rows.length, ymin: 0, ymax, xlabel: 'year', ylabel: 'book value' });
      p.axes();
      const pts = [[0, v.cost]]; rows.forEach((r, i) => pts.push([i + 1, r[1]]));
      p.line(pts, 'series c1'); pts.forEach(pt => p.dot(pt[0], pt[1], 'pt', 4));
      ro([
        ['Year 1 depreciation', '$' + f2(rows[0][0], 0), 'good'],
        ['Year 2 depreciation', rows[1] ? '$' + f2(rows[1][0], 0) : '—'],
        ['Year 3 depreciation', rows[2] ? '$' + f2(rows[2][0], 0) : '—'],
        ['Ending book value', '$' + f2(rows[rows.length - 1][1], 0)]
      ]);
      note.textContent = v.method === 'SL'
        ? 'CEBoK example: $140,000 cost, $20,000 salvage, 5-yr life, bought April 1 (nearest whole month) — first year gets 9/12 of the annual amount, and the leftover quarter-year lands in a 6th, stub year.'
        : v.method === 'DDB'
          ? 'DDB rate = 200%/life = 40%. Fig. 13.21: same $140,000/$20,000/5-yr, April purchase — the first year is also prorated 9/12, then full-year DDB applies; depreciation is capped so book value never drops below salvage (2006–2010: $42,000, $39,200, $23,520, $14,112, $1,168 capped).'
          : 'CEBoK example: $100,000 cost, $10,000 salvage, 5-yr life. Sum-of-the-years digits = (n)(n+1)/2 = 15.';
      publish(box, { method: v.method, y1: rows[0][0], y2: rows[1] ? rows[1][0] : 0, y3: rows[2] ? rows[2][0] : 0, bookEnd: rows[rows.length - 1][1] });
    }
    draw();
  };

  // ======================================================================
  // M13: mower-npv — Table 13.6 lawn-mower alternatives; guess the winner, then reveal
  reg['mower-npv'] = box => {
    title(box, 'Lawn-mower NPV (Table 13.6)', 'guess the winner under each metric and assumption, then reveal');
    const NAMES = { outsource: 'Outsource mowing', mower: 'Buy new mower', upgrade: 'Upgrade current mower', statusquo: 'Status quo' };
    const BASE = { outsource: 128, mower: 103, upgrade: -31, statusquo: -125 };
    const ALTS = ['outsource', 'mower', 'upgrade', 'statusquo'];
    const SCEN_TEXT = {
      base: 'Base case (Table 13.6).',
      fuel: '+10% fuel cost: outsourcing still wins on NPV; per the source, NPVs increased for both outsourcing and the new mower, and the gap between them widened. No new figures are given for this case.',
      outsourceCost: '+10% cost of outsourcing: outsourcing still wins on NPV.',
      rate: 'Labor valued at $25/hr instead of $20/hr: outsourcing still wins on NPV.'
    };
    const v = controls(box, [
      { k: 'scenario', label: 'Assumption set', type: 'select', v: 'base', options: [['base', 'Base case'], ['fuel', '+10% fuel cost'], ['outsourceCost', '+10% outsourcing cost'], ['rate', '$25/hr labor rate']] },
      { k: 'metric', label: 'Decision metric', type: 'select', v: 'npv', options: [['npv', 'NPV'], ['cbr', 'Cost/benefit ratio (C/BR)']] },
      { k: 'guess', label: 'Your guess: which alternative wins?', type: 'select', v: 'outsource', options: ALTS.map(a => [a, NAMES[a]]) }
    ], draw);
    const pb = E('div'); box.appendChild(pb);
    const ro = readout(box);
    const note = E('div', 'w-note'); box.appendChild(note);
    const revealBtn = E('button', 'btn small'); revealBtn.textContent = 'Reveal';
    let revealed = false, lastKey = null;
    revealBtn.onclick = () => { revealed = true; draw(); };
    box.appendChild(revealBtn);
    function draw() {
      const key = v.scenario + '|' + v.metric + '|' + v.guess;
      if (key !== lastKey) { lastKey = key; revealed = false; }
      pb.innerHTML = '';
      const ymax = Math.max(...ALTS.map(a => BASE[a])) * 1.15, ymin = Math.min(...ALTS.map(a => BASE[a])) * 1.15;
      const p = Plot.create(pb, { h: 220, xmin: 0, xmax: 4, ymin, ymax, xlabel: '', ylabel: 'NPV ($, base case, per-year basis)', xticks: 4, xfmt: () => '' });
      p.axes(); p.hline(0, 'marker');
      ALTS.forEach((a, i) => {
        const val = BASE[a];
        p.rect(i + 0.15, 0, i + 0.85, val, val >= 0 ? 'bar c1f' : 'bar c3f');
        p.text(i + 0.5, val + (val >= 0 ? 1 : -1) * (ymax - ymin) * 0.03, '$' + f2(val, 0), 'annot', 'middle');
      });
      const npvWinner = 'outsource';
      const actualWinner = v.metric === 'npv' ? npvWinner : 'mower';
      const correct = revealed && v.guess === actualWinner;
      const rows = [
        ['Assumption set', SCEN_TEXT[v.scenario]],
        ['Your guess', NAMES[v.guess]]
      ];
      if (revealed) {
        rows.push(['Actual winner (' + (v.metric === 'npv' ? 'NPV' : 'C/BR') + ')', NAMES[actualWinner], correct ? 'good' : 'bad']);
        rows.push(['Your guess was', correct ? 'correct' : 'incorrect', correct ? 'good' : 'bad']);
        if (v.metric === 'cbr' && v.scenario !== 'base') {
          rows.push(['Caution', 'CEBoK reports the C/BR result for the base case only; this answer assumes it holds here.']);
        }
        if (v.metric === 'cbr') {
          rows.push(['Source statement', 'By C/BR, the new mower would be favored by a narrow margin — it is more efficient (better ratio) but less effective (lower NPV) than outsourcing. No numeric C/BR values are given in the source excerpt.']);
        } else {
          rows.push(['Base-case NPV ranking (Table 13.6)', ALTS.slice().sort((a, b) => BASE[b] - BASE[a]).map(a => NAMES[a]).join(' > ')]);
        }
      }
      ro(rows);
      note.textContent = 'NPV bars reproduce CEBoK Table 13.6 exactly (outsource $128, new mower $103, upgrade −$31, status quo −$125, base case). The full 10-year cash-flow build (Tables 13.1–13.5) and the source\'s own C/BR figures aren\'t recoverable from the excerpted text, so this widget states only the source\'s qualitative sensitivity/C-BR conclusions rather than inventing numbers.';
      publish(box, { npvOut: BASE.outsource, npvMower: BASE.mower, npvUpgrade: BASE.upgrade, npvStatusQuo: BASE.statusquo, guessCorrect: revealed ? (correct ? 1 : 0) : 0 });
    }
    draw();
  };

  // ======================================================================
  // M13: benefits-matrix — weighted point-rating decision matrix; NPV vs B/CR winners can differ
  reg['benefits-matrix'] = box => {
    title(box, 'Benefits decision matrix', 'weighted scoring vs NPV vs B/CR — different methods, different winners');
    const PUBLISHED = [
      { name: 'Alt 1', npv: 34596762, score: 24.53, bcr: 7.1 },
      { name: 'Alt 2', npv: 42157114, score: 24.73, bcr: 5.8 },
      { name: 'Alt 3', npv: 68307235, score: 26.08, bcr: 3.8 },
      { name: 'Alt 4', npv: 35604337, score: 23.15, bcr: 6.5 }
    ];
    const v = controls(box, [
      { k: 'wMission', label: 'Weight: Mission impact', min: 1, max: 5, step: 0.5, v: 2 },
      { k: 'wRisk', label: 'Weight: Risk reduction', min: 1, max: 5, step: 0.5, v: 1 },
      { k: 'sA1m', label: 'Alt 1 mission score (1-10)', min: 1, max: 10, step: 0.5, v: 8 },
      { k: 'sA1r', label: 'Alt 1 risk score (1-10)', min: 1, max: 10, step: 0.5, v: 5 },
      { k: 'sA3m', label: 'Alt 3 mission score (1-10)', min: 1, max: 10, step: 0.5, v: 9 },
      { k: 'sA3r', label: 'Alt 3 risk score (1-10)', min: 1, max: 10, step: 0.5, v: 6 }
    ], draw);
    const tb = E('div', 'w-table'); box.appendChild(tb);
    const ro = readout(box);
    const note = E('div', 'w-note'); box.appendChild(note);
    function draw() {
      const npvWinner = PUBLISHED.reduce((b, a) => a.npv > b.npv ? a : b, PUBLISHED[0]);
      const bcrWinner = PUBLISHED.reduce((b, a) => a.bcr > b.bcr ? a : b, PUBLISHED[0]);
      const scoreWinner = PUBLISHED.reduce((b, a) => a.score > b.score ? a : b, PUBLISHED[0]);
      tb.innerHTML = '<table><thead><tr><th>Alternative</th><th>NPV</th><th>Weighted score</th><th>B/CR</th></tr></thead><tbody>' +
        PUBLISHED.map(a => `<tr><td>${a.name}</td><td>$${f2(a.npv, 0)}</td><td>${f2(a.score, 2)}</td><td>${f2(a.bcr, 1)}</td></tr>`).join('') +
        '</tbody></table>';
      const weightedA1 = v.wMission * v.sA1m + v.wRisk * v.sA1r;
      const weightedA3 = v.wMission * v.sA3m + v.wRisk * v.sA3r;
      ro([
        ['Winner by NPV', npvWinner.name, 'good'],
        ['Winner by weighted score', scoreWinner.name, scoreWinner.name === npvWinner.name ? 'good' : ''],
        ['Winner by B/CR', bcrWinner.name, bcrWinner.name !== npvWinner.name ? 'good' : ''],
        ['Your weighted score, Alt 1', f2(weightedA1, 1)],
        ['Your weighted score, Alt 3', f2(weightedA3, 1), weightedA3 > weightedA1 ? 'good' : '']
      ]);
      note.textContent = 'Table reproduces the published Alt 1–4 NPV / weighted-score / B-CR results (weight = 2 means twice as valued as weight = 1). By NPV and weighted score, Alt 3 wins; by B/CR, Alt 1 wins — the same paradox as Table 13.6\'s C/BR flip, on a different example. The criteria weights and scores above are an illustrative mechanism (the source doesn\'t give its own underlying per-criterion inputs) — move the sliders to see how the ranking can change.';
      publish(box, { weightedScoreA1: weightedA1, weightedScoreA3: weightedA3, npvWinner: npvWinner.name, bcrWinner: bcrWinner.name });
    }
    draw();
  };

  return { get: n => reg[n], names: () => Object.keys(reg), mount, _math: { ols, mean, sd, median } };
})();
