// Tiny SVG plotting helper for widgets.
const Plot = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function niceTicks(lo, hi, n = 5) {
    if (hi === lo) { hi = lo + 1; }
    const span = hi - lo, step0 = span / n;
    const mag = Math.pow(10, Math.floor(Math.log10(step0)));
    const step = [1, 2, 2.5, 5, 10].map(s => s * mag).find(s => span / s <= n) || 10 * mag;
    const out = [];
    for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(+v.toFixed(10));
    return out;
  }
  function fmt(v) {
    const a = Math.abs(v);
    if (a >= 1e6) return (v / 1e6).toFixed(1) + 'M';
    if (a >= 1e4) return (v / 1e3).toFixed(0) + 'k';
    if (a >= 100) return v.toFixed(0);
    if (a >= 1) return +v.toFixed(2) + '';
    return +v.toFixed(3) + '';
  }

  // opts: {w,h,xmin,xmax,ymin,ymax,xlabel,ylabel,pad}
  function create(container, opts) {
    const o = Object.assign({ w: 560, h: 300, pad: { l: 52, r: 16, t: 14, b: 40 } }, opts);
    const svg = svgEl('svg', { viewBox: `0 0 ${o.w} ${o.h}`, class: 'plot', preserveAspectRatio: 'xMidYMid meet' });
    container.appendChild(svg);
    const P = o.pad;
    const api = {
      svg, o,
      x: v => P.l + (v - o.xmin) / (o.xmax - o.xmin) * (o.w - P.l - P.r),
      y: v => o.h - P.b - (v - o.ymin) / (o.ymax - o.ymin) * (o.h - P.t - P.b),
      ix: px => o.xmin + (px - P.l) / (o.w - P.l - P.r) * (o.xmax - o.xmin),
      iy: py => o.ymin + (o.h - P.b - py) / (o.h - P.t - P.b) * (o.ymax - o.ymin),
      clear() { while (svg.firstChild) svg.removeChild(svg.firstChild); },
      axes() {
        const g = svgEl('g', { class: 'axes' }, svg);
        niceTicks(o.xmin, o.xmax, o.xticks || 6).forEach(t => {
          const X = api.x(t);
          svgEl('line', { x1: X, x2: X, y1: P.t, y2: o.h - P.b, class: 'grid' }, g);
          svgEl('text', { x: X, y: o.h - P.b + 16, 'text-anchor': 'middle', class: 'tick' }, g).textContent = o.xfmt ? o.xfmt(t) : fmt(t);
        });
        niceTicks(o.ymin, o.ymax, o.yticks || 5).forEach(t => {
          const Y = api.y(t);
          svgEl('line', { x1: P.l, x2: o.w - P.r, y1: Y, y2: Y, class: 'grid' }, g);
          svgEl('text', { x: P.l - 6, y: Y + 4, 'text-anchor': 'end', class: 'tick' }, g).textContent = o.yfmt ? o.yfmt(t) : fmt(t);
        });
        svgEl('line', { x1: P.l, x2: o.w - P.r, y1: o.h - P.b, y2: o.h - P.b, class: 'axis' }, g);
        svgEl('line', { x1: P.l, x2: P.l, y1: P.t, y2: o.h - P.b, class: 'axis' }, g);
        if (o.xlabel) svgEl('text', { x: (P.l + o.w - P.r) / 2, y: o.h - 4, 'text-anchor': 'middle', class: 'label' }, g).textContent = o.xlabel;
        if (o.ylabel) svgEl('text', { x: 12, y: (P.t + o.h - P.b) / 2, 'text-anchor': 'middle', class: 'label', transform: `rotate(-90 12 ${(P.t + o.h - P.b) / 2})` }, g).textContent = o.ylabel;
        return g;
      },
      line(pts, cls = 'series') {
        const d = pts.filter(p => isFinite(p[1])).map((p, i) => (i ? 'L' : 'M') + api.x(p[0]).toFixed(1) + ' ' + api.y(p[1]).toFixed(1)).join(' ');
        return svgEl('path', { d, class: cls, fill: 'none' }, svg);
      },
      fn(f, cls, n = 120) {
        const pts = [];
        for (let i = 0; i <= n; i++) { const xv = o.xmin + (o.xmax - o.xmin) * i / n; pts.push([xv, f(xv)]); }
        return api.line(pts.filter(p => p[1] >= o.ymin - (o.ymax - o.ymin) && p[1] <= o.ymax + (o.ymax - o.ymin)), cls);
      },
      dot(xv, yv, cls = 'pt', r = 4) { return svgEl('circle', { cx: api.x(xv), cy: api.y(yv), r, class: cls }, svg); },
      rect(x0, y0, x1, y1, cls) {
        const X0 = api.x(x0), X1 = api.x(x1), Y0 = api.y(y0), Y1 = api.y(y1);
        return svgEl('rect', { x: Math.min(X0, X1), y: Math.min(Y0, Y1), width: Math.abs(X1 - X0), height: Math.abs(Y1 - Y0), class: cls }, svg);
      },
      vline(xv, cls = 'marker') { return svgEl('line', { x1: api.x(xv), x2: api.x(xv), y1: P.t, y2: o.h - P.b, class: cls }, svg); },
      hline(yv, cls = 'marker') { return svgEl('line', { x1: P.l, x2: o.w - P.r, y1: api.y(yv), y2: api.y(yv), class: cls }, svg); },
      text(xv, yv, s, cls = 'annot', anchor = 'start') {
        const t = svgEl('text', { x: api.x(xv), y: api.y(yv), class: cls, 'text-anchor': anchor }, svg);
        t.textContent = s; return t;
      },
      seg(x0, y0, x1, y1, cls) { return svgEl('line', { x1: api.x(x0), y1: api.y(y0), x2: api.x(x1), y2: api.y(y1), class: cls }, svg); },
      // Convert a mouse/touch event to data coordinates
      evt(e) {
        const r = svg.getBoundingClientRect();
        const t = e.touches ? e.touches[0] : e;
        const px = (t.clientX - r.left) / r.width * o.w, py = (t.clientY - r.top) / r.height * o.h;
        return [api.ix(px), api.iy(py)];
      }
    };
    return api;
  }
  return { create, svgEl, fmt, niceTicks };
})();
