// Markdown + KaTeX + lesson directives.
// Directives (line-based):
//   +++                       step break (Brilliant-style reveal)
//   :::check [id] ... :::     question block (see parseCheck)
//   :::tip|warn|key|example [Title] ... :::   callout
//   :::widget name [args]:::  interactive widget
const Render = (() => {
  const OPEN = '\uE000', CLOSE = '\uE001';

  function protect(src) {
    const math = [];
    src = src.replace(/\\\$/g, OPEN + 'D' + CLOSE);
    src = src.replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => { math.push({ t, d: true }); return OPEN + 'M' + (math.length - 1) + CLOSE; });
    src = src.replace(/\$([^$\n]+?)\$/g, (_, t) => { math.push({ t, d: false }); return OPEN + 'M' + (math.length - 1) + CLOSE; });
    return { src, math };
  }
  function restore(html, math) {
    return html
      .replace(new RegExp(OPEN + 'M(\\d+)' + CLOSE, 'g'), (_, i) => {
        const m = math[+i];
        const tex = m.t.split(OPEN + 'D' + CLOSE).join('\\$');
        try { return katex.renderToString(tex, { displayMode: m.d, throwOnError: false }); }
        catch (e) { return '<code>' + m.t + '</code>'; }
      })
      .replace(new RegExp(OPEN + 'D' + CLOSE, 'g'), '$');
  }
  function md(src) {
    const p = protect(src || '');
    return restore(marked.parse(p.src), p.math);
  }
  function inline(src) {
    const p = protect(src || '');
    return restore(marked.parseInline(p.src), p.math);
  }

  // Split raw body into blocks: {kind:'md', text} | {kind:'dir', type, args, body}
  function splitDirectives(text) {
    const out = [];
    let buf = [], dir = null;
    const flush = () => { if (buf.length) out.push({ kind: 'md', text: buf.join('\n') }); buf = []; };
    for (const line of text.split('\n')) {
      if (dir) {
        if (/^:::\s*$/.test(line)) { out.push(dir); dir = null; }
        else dir.body.push(line);
        continue;
      }
      const one = line.match(/^:::(\w+)\s*(.*?):::\s*$/);
      if (one) { flush(); out.push({ kind: 'dir', type: one[1], args: one[2].trim(), body: [] }); continue; }
      const open = line.match(/^:::(\w+)\s*(.*)$/);
      if (open) { flush(); dir = { kind: 'dir', type: open[1], args: open[2].trim(), body: [] }; continue; }
      buf.push(line);
    }
    if (dir) out.push(dir);
    flush();
    return out;
  }

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function parseCheck(lines) {
    const c = { q: [], opts: [], num: null, text: null, explain: [] };
    let mode = 'q';
    for (const l of lines) {
      let m;
      if ((m = l.match(/^\s*([-*])\s+(.*)$/)) && mode !== 'explain') { c.opts.push({ text: m[2], right: m[1] === '*' }); mode = 'opts'; }
      else if ((m = l.match(/^\s*=\s*(.+)$/))) {
        const v = m[1].trim();
        const nm = v.match(/^(-?[\d.eE+-]+)\s*(?:±|\+-)?\s*([\d.]+%?)?$/);
        if (nm) c.num = { v: parseFloat(nm[1]), tol: nm[2] || '1%' };
        else c.text = v.split('|').map(s => s.trim().toLowerCase());
        mode = 'ans';
      }
      else if ((m = l.match(/^\s*>\s?(.*)$/))) { c.explain.push(m[1]); mode = 'explain'; }
      else if (mode === 'explain') c.explain.push(l);
      else if (mode === 'q') c.q.push(l.replace(/^Q:\s?/, ''));
    }
    return c;
  }

  function numMatch(input, num) {
    const x = parseFloat(String(input).replace(/[$,%\s]/g, ''));
    if (isNaN(x)) return false;
    let tol = num.tol.endsWith('%') ? Math.abs(num.v) * parseFloat(num.tol) / 100 : parseFloat(num.tol);
    if (tol === 0) tol = 1e-9;
    return Math.abs(x - num.v) <= tol + 1e-12;
  }

  // ctx: { key, onChange }  -> checks report state through ctx
  function buildCheck(d, ctx, idx) {
    const c = parseCheck(d.body);
    const id = ctx.key + '#' + (d.args || idx);
    const saved = Store.data.checks[id];
    const box = el('div', 'check');
    box.dataset.checkId = id;
    box.appendChild(el('div', 'check-label', 'Check your understanding'));
    box.appendChild(el('div', 'check-q', md(c.q.join('\n'))));
    const fb = el('div', 'check-fb');
    const exp = el('div', 'check-explain', c.explain.length ? md(c.explain.join('\n')) : '');
    exp.hidden = true;
    let attempts = 0;

    const finish = (right, revealed) => {
      if (!Store.data.checks[id]) Store.data.checks[id] = { first: right && attempts === 1 };
      Store.data.checks[id].done = true;
      Store.markActive();
      Store.save();
      box.classList.add('done');
      exp.hidden = false;
      if (revealed) fb.innerHTML = 'Answer revealed.';
      ctx.onChange && ctx.onChange();
    };

    if (c.opts.length) {
      const list = el('div', 'check-opts');
      c.opts.forEach(o => {
        const b = el('button', 'opt', inline(o.text));
        b.onclick = () => {
          if (box.classList.contains('done') && !o.right) return;
          attempts++;
          if (o.right) {
            b.classList.add('right');
            fb.innerHTML = '<b>Correct.</b>';
            fb.className = 'check-fb good';
            list.querySelectorAll('.opt').forEach(x => x.disabled = true);
            finish(true);
          } else {
            b.classList.add('wrong'); b.disabled = true;
            fb.innerHTML = 'Not quite &mdash; try again.';
            fb.className = 'check-fb bad';
          }
        };
        list.appendChild(b);
      });
      box.appendChild(list);
      if (saved && saved.done) {
        list.querySelectorAll('.opt').forEach((b, i) => { b.disabled = true; if (c.opts[i].right) b.classList.add('right'); });
        box.classList.add('done'); exp.hidden = false;
      }
    } else {
      const row = el('div', 'check-input');
      const inp = el('input');
      inp.type = 'text'; inp.placeholder = c.num ? 'Enter a number' : 'Type your answer';
      const go = el('button', 'btn small', 'Check');
      const submit = () => {
        if (!inp.value.trim()) return;
        attempts++;
        const ok = c.num ? numMatch(inp.value, c.num) : c.text.includes(inp.value.trim().toLowerCase());
        if (ok) {
          fb.innerHTML = '<b>Correct.</b>'; fb.className = 'check-fb good';
          inp.disabled = true; go.disabled = true; finish(true);
        } else {
          fb.innerHTML = attempts >= 2 ? 'Not quite. You can reveal the answer.' : 'Not quite &mdash; try again.';
          fb.className = 'check-fb bad';
          if (attempts >= 2) reveal.hidden = false;
        }
      };
      go.onclick = submit;
      inp.onkeydown = e => { if (e.key === 'Enter') submit(); };
      const reveal = el('button', 'btn small ghost', 'Reveal answer');
      reveal.hidden = true;
      reveal.onclick = () => {
        inp.value = c.num ? String(c.num.v) : c.text[0];
        inp.disabled = true; go.disabled = true; reveal.hidden = true;
        finish(false, true);
      };
      row.append(inp, go, reveal);
      box.appendChild(row);
      if (saved && saved.done) {
        inp.value = c.num ? String(c.num.v) : c.text[0];
        inp.disabled = true; go.disabled = true; box.classList.add('done'); exp.hidden = false;
      }
    }
    box.append(fb, exp);
    return box;
  }

  function buildCallout(d) {
    const box = el('div', 'callout ' + d.type);
    const titles = { tip: 'Tip', warn: 'Watch out', key: 'Key idea', example: 'Worked example', formula: 'Formula', note: 'Note' };
    box.appendChild(el('div', 'callout-title', inline(d.args || titles[d.type] || d.type)));
    box.appendChild(el('div', 'callout-body', md(d.body.join('\n'))));
    return box;
  }

  function buildWidget(d) {
    const box = el('div', 'widget');
    const [name, ...rest] = d.args.split(/\s+/);
    const fn = Widgets.get(name);
    if (!fn) { box.textContent = 'Unknown widget: ' + name; return box; }
    try { fn(box, rest.join(' ')); } catch (e) { box.textContent = 'Widget error: ' + e.message; console.error(e); }
    return box;
  }

  function buildStep(text, ctx, counter) {
    const step = el('div', 'step');
    for (const b of splitDirectives(text)) {
      if (b.kind === 'md') { if (b.text.trim()) step.appendChild(el('div', 'prose', md(b.text))); continue; }
      if (b.type === 'check') step.appendChild(buildCheck(b, ctx, counter.n++));
      else if (b.type === 'widget') step.appendChild(buildWidget(b));
      else step.appendChild(buildCallout(b));
    }
    return step;
  }

  // Returns array of step elements for a section body.
  function section(body, ctx) {
    const counter = { n: 0 };
    return body.split(/^\+\+\+\s*$/m).map(t => buildStep(t, ctx, counter));
  }

  return { md, inline, section, el };
})();
