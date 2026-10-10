// Markdown + KaTeX + lesson directives.
// Directives (line-based):
//   +++                       step break (Brilliant-style reveal)
//   :::check [id] ... :::     question block (see parseCheck)
//   :::tip|warn|key|example [Title] ... :::   callout
//   :::widget name [k=v ...] [lock=a,b]:::  interactive widget
//   :::challenge widget [k=v ...] [lock=a,b] ... :::   guided challenge (see js/challenge.js)
//   :::sort [id] ... :::      sort items into buckets (see js/primer.js)
//   :::order [id] ... :::     put items in sequence (see js/primer.js)
//   :::primer:::              first line of a section's first step: that step is a "Before you read" primer
//   {{primer}}                in later prose: recap of the learner's primer answer
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

  // Records a completed check or challenge; first = right on first try without help.
  function record(id, first, extra, ctx) {
    if (!Store.data.checks[id]) Store.data.checks[id] = Object.assign({ first }, extra, { at: Date.now() });
    Store.data.checks[id].done = true;
    Store.markActive();
    Store.save();
    ctx.onChange && ctx.onChange();
  }

  // Multiple-choice buttons; onRight(firstTry) fires when the right option is clicked.
  function optionList(opts, fb, onRight) {
    const list = el('div', 'check-opts');
    let attempts = 0;
    opts.forEach(o => {
      const b = el('button', 'opt', inline(o.text));
      b.onclick = () => {
        attempts++;
        if (o.right) {
          b.classList.add('right');
          fb.innerHTML = '<b>Correct.</b>';
          fb.className = 'check-fb good';
          list.querySelectorAll('.opt').forEach(x => x.disabled = true);
          onRight(attempts === 1);
        } else {
          b.classList.add('wrong'); b.disabled = true;
          fb.innerHTML = 'Not quite &mdash; try again.';
          fb.className = 'check-fb bad';
        }
      };
      list.appendChild(b);
    });
    return list;
  }
  function lockOptions(list, opts) {
    list.querySelectorAll('.opt').forEach((b, i) => { b.disabled = true; if (opts[i].right) b.classList.add('right'); });
  }

  // Rebuilds a finished check/challenge so it can be answered again; the saved first-try record is kept.
  function againBtn(rebuild) {
    const b = el('button', 'btn small ghost check-again', 'Try again');
    b.hidden = true;
    b.onclick = () => { const box = b.closest('.check'); box.replaceWith(rebuild()); };
    return b;
  }

  // ctx: { key, onChange }  -> checks report state through ctx
  function buildCheck(d, ctx, idx, fresh) {
    const c = parseCheck(d.body);
    const id = ctx.key + '#' + (d.args || idx);
    const saved = fresh ? null : Store.data.checks[id];
    const box = el('div', 'check');
    box.dataset.checkId = id;
    box.appendChild(el('div', 'check-label', 'Check your understanding'));
    box.appendChild(el('div', 'check-q', md(c.q.join('\n'))));
    const fb = el('div', 'check-fb');
    fb.setAttribute('role', 'status');
    const exp = el('div', 'check-explain', c.explain.length ? md(c.explain.join('\n')) : '');
    exp.hidden = true;
    const again = againBtn(() => buildCheck(d, ctx, idx, true));

    const finish = (first, revealed) => {
      box.classList.add('done');
      again.hidden = false;
      exp.hidden = false;
      if (revealed) fb.innerHTML = 'Answer revealed.';
      record(id, first, {}, ctx);
    };

    if (c.opts.length) {
      const list = optionList(c.opts, fb, first => finish(first));
      box.appendChild(list);
      if (saved && saved.done) { lockOptions(list, c.opts); box.classList.add('done'); again.hidden = false; exp.hidden = false; }
    } else {
      const row = el('div', 'check-input');
      const inp = el('input');
      inp.type = 'text'; inp.placeholder = c.num ? 'Enter a number' : 'Type your answer';
      const go = el('button', 'btn small', 'Check');
      let attempts = 0;
      const submit = () => {
        if (!inp.value.trim()) return;
        attempts++;
        const ok = c.num ? numMatch(inp.value, c.num) : c.text.includes(inp.value.trim().toLowerCase());
        if (ok) {
          fb.innerHTML = '<b>Correct.</b>'; fb.className = 'check-fb good';
          inp.disabled = true; go.disabled = true; finish(attempts === 1);
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
        inp.disabled = true; go.disabled = true; box.classList.add('done'); again.hidden = false; exp.hidden = false;
      }
    }
    box.append(fb, exp, again);
    return box;
  }

  function buildCallout(d) {
    const box = el('div', 'callout ' + d.type);
    const titles = { tip: 'Tip', warn: 'Watch out', key: 'Key idea', example: 'Worked example', formula: 'Formula', note: 'Note' };
    box.appendChild(el('div', 'callout-title', inline(d.args || titles[d.type] || d.type)));
    box.appendChild(el('div', 'callout-body', md(d.body.join('\n'))));
    return box;
  }

  const CH_LABEL = { target: 'Challenge', predict: 'Predict, then check', choose: 'Explore, then answer' };
  function buildChallenge(d, ctx, idx, fresh) {
    const c = Challenge.parse(d.body);
    const id = ctx.key + '#c' + idx;
    const saved = fresh ? null : Store.data.checks[id];
    const box = el('div', 'check challenge');
    box.dataset.checkId = id;
    if (c.errors.length) {
      box.classList.add('done');
      box.appendChild(el('div', 'check-fb bad', 'Challenge error: ' + c.errors.join('; ')));
      return box;
    }
    const again = againBtn(() => buildChallenge(d, ctx, idx, true));
    box.appendChild(el('div', 'check-label', CH_LABEL[c.type]));
    box.appendChild(el('div', 'check-q', md(c.q.join('\n'))));
    const wbox = el('div', 'widget');
    box.appendChild(wbox);
    const w = Widgets.mount(wbox, d.args);
    const fb = el('div', 'check-fb');
    fb.setAttribute('role', 'status');
    const exp = el('div', 'check-explain', md(c.explain.join('\n')));
    exp.hidden = true;
    const isDone = () => box.classList.contains('done');
    const markDone = () => { box.classList.add('done'); again.hidden = false; exp.hidden = false; };
    const complete = (first, extra) => { markDone(); record(id, first, extra || {}, ctx); };

    if (c.type === 'target') {
      const tools = el('div', 'row-btns ch-tools');
      const stuck = el('button', 'btn small ghost', "I'm stuck");
      const showMe = el('button', 'btn small ghost', 'Show me');
      showMe.hidden = true;
      tools.append(stuck, showMe);
      box.appendChild(tools);
      let helped = false;
      let timer = null;
      const offerHelp = () => { stuck.hidden = true; showMe.hidden = false; };
      const startTimer = () => { if (timer === null) timer = setTimeout(() => { if (!isDone()) offerHelp(); }, 45000); };
      stuck.onclick = offerHelp;
      showMe.onclick = () => { helped = true; w.setMany(c.show); };
      w.onUpdate(out => {
        startTimer();
        if (isDone() || !Challenge.evalGoals(c.goals, out)) return;
        clearTimeout(timer);
        tools.hidden = true;
        fb.innerHTML = helped ? 'Here is one setting that works. Move away and back to see why.' : '<b>Goal reached.</b>';
        fb.className = 'check-fb good';
        complete(!helped);
      });
      if (saved && saved.done) { tools.hidden = true; markDone(); w.setMany(c.show); }
    } else if (c.type === 'predict') {
      const row = el('div', 'check-input');
      const inp = el('input');
      inp.type = 'text'; inp.placeholder = 'Your prediction';
      inp.setAttribute('aria-describedby', id + '-note');
      const go = el('button', 'btn small', 'Lock it in');
      row.append(inp, go);
      const note = el('div', 'w-note', 'Make your prediction first; the chart unlocks after.');
      note.id = id + '-note';
      box.insertBefore(row, wbox);
      box.insertBefore(note, wbox);
      const unfreeze = () => { wbox.classList.remove('w-frozen'); wbox.inert = false; };
      const reveal = guess => {
        const actual = w.out[c.predict.out];
        const ok = Challenge.within(guess, actual, c.predict.tol);
        unfreeze();
        inp.value = inp.value || String(guess);
        inp.disabled = go.disabled = true;
        fb.innerHTML = `<b>${ok ? 'Close enough.' : 'Not quite.'}</b> You said ${Challenge.fmtLike(guess, actual)}; the model gives ${Challenge.fmtLike(actual, actual)}.`;
        fb.className = 'check-fb ' + (ok ? 'good' : 'bad');
        return ok;
      };
      const submit = () => {
        const g = Challenge.readGuess(inp.value, w.out[c.predict.out]);
        if (!isFinite(g)) { fb.innerHTML = 'Enter a number.'; fb.className = 'check-fb bad'; return; }
        complete(reveal(g), { guess: g });
      };
      go.onclick = submit;
      inp.onkeydown = e => { if (e.key === 'Enter') submit(); };
      if (saved && saved.done) {
        markDone();
        if (isFinite(saved.guess)) reveal(saved.guess); else { unfreeze(); inp.disabled = go.disabled = true; }
      } else { wbox.classList.add('w-frozen'); wbox.inert = true; }
    } else {
      const list = optionList(c.opts, fb, first => complete(first));
      box.appendChild(list);
      if (saved && saved.done) { lockOptions(list, c.opts); markDone(); }
    }
    box.append(fb, exp, again);
    return box;
  }

  // Primer blocks commit once (no retry, no wrong-answer stats); answers go to Store.data.primers, never checks.
  function settle(box, exp, ctx) {
    box.classList.add('done');
    exp.hidden = false;
    const again = el('button', 'btn small ghost primer-again', 'Try again');
    again.onclick = () => { Primer.clear(Store.data, ctx.key); Store.save(); App.render(); };
    box.appendChild(again);
  }
  function commit(box, exp, ctx, type, answer, score) {
    Primer.save(Store.data, ctx.key, type, answer, score);
    Store.save();
    settle(box, exp, ctx);
    ctx.onPrimer();
    ctx.onChange && ctx.onChange();
  }

  function buildPrimerCheck(d, ctx) {
    const c = parseCheck(d.body);
    ctx.sec.primer = { type: 'check', spec: c };
    const box = el('div', 'check');
    box.appendChild(el('div', 'check-label', 'Your guess'));
    box.appendChild(el('div', 'check-q', md(c.q.join('\n'))));
    const exp = el('div', 'check-explain', md(c.explain.join('\n')));
    exp.hidden = true;
    const list = el('div', 'check-opts');
    const show = pick => list.querySelectorAll('.opt').forEach((b, i) => {
      b.disabled = true;
      if (c.opts[i].right) b.classList.add('right'); else if (i === pick) b.classList.add('wrong');
    });
    c.opts.forEach((o, i) => {
      const b = el('button', 'opt', inline(o.text));
      b.onclick = () => { show(i); commit(box, exp, ctx, 'check', i, o.right ? '1/1' : '0/1'); };
      list.appendChild(b);
    });
    box.append(list, exp);
    const saved = Primer.answered(Store.data, ctx.key);
    if (saved && saved.type === 'check' && Primer.fits('check', c, saved.answer)) { show(saved.answer); settle(box, exp, ctx); }
    return box;
  }

  function blockError(box, label, errors) {
    box.classList.add('done');
    box.appendChild(el('div', 'check-fb bad', label + ' error: ' + errors.join('; ')));
    return box;
  }

  // :::sort — tap an item then a bucket (or drag it), then commit. Graded outside primers: retry until right.
  function buildSort(d, ctx, idx) {
    const c = Primer.parseSort(d.body);
    const id = ctx.key + '#s' + (d.args || idx);
    const box = el('div', 'check sort');
    if (c.errors.length) return blockError(box, 'Sort', c.errors);
    if (ctx.primer) ctx.sec.primer = { type: 'sort', spec: c }; else box.dataset.checkId = id;
    box.appendChild(el('div', 'check-label', ctx.primer ? 'Your guess' : 'Sort it'));
    box.appendChild(el('div', 'check-q', md(c.q.join('\n'))));
    const pool = el('div', 'sort-pool');
    const grid = el('div', 'sort-buckets');
    const zones = c.buckets.map(name => {
      const z = el('div', 'sort-bucket');
      z.dataset.bucket = name;
      z.append(el('div', 'sort-bucket-name', inline(name)), el('div', 'sort-drop'));
      grid.appendChild(z);
      return z;
    });
    const go = el('button', 'btn small', 'Commit');
    go.disabled = true;
    const fb = el('div', 'check-fb');
    fb.setAttribute('role', 'status');
    const exp = el('div', 'check-explain', md(c.explain.join('\n')));
    exp.hidden = true;
    const placed = c.items.map(() => null);
    let picked = null, locked = false, attempts = 0;
    const chips = c.items.map((it, i) => {
      const b = el('button', 'sort-item', inline(it.text));
      b.draggable = true;
      b.ondragstart = e => e.dataTransfer.setData('text/plain', String(i));
      b.onclick = () => {
        if (locked) return;
        picked = picked === i ? null : i;
        chips.forEach((x, k) => x.classList.toggle('on', k === picked));
      };
      return b;
    });
    Primer.shuffle(c.items.length, id).forEach(i => pool.appendChild(chips[i]));
    const place = (i, bucket) => {
      placed[i] = bucket;
      (bucket == null ? pool : zones.find(z => z.dataset.bucket === bucket).querySelector('.sort-drop')).appendChild(chips[i]);
      chips[i].classList.remove('on', 'wrong');
      picked = null;
      go.disabled = placed.includes(null);
    };
    const target = (node, bucket) => {
      node.onclick = e => { if (!locked && picked !== null && !e.target.closest('.sort-item')) place(picked, bucket); };
      node.ondragover = e => { if (!locked) e.preventDefault(); };
      node.ondrop = e => { e.preventDefault(); if (!locked) place(+e.dataTransfer.getData('text/plain'), bucket); };
    };
    zones.forEach(z => target(z, z.dataset.bucket));
    target(pool, null);
    const reveal = ans => {
      locked = true; go.hidden = true;
      chips.forEach((ch, i) => {
        const ok = ans[i] === c.items[i].bucket;
        ch.disabled = true; ch.draggable = false;
        ch.classList.remove('on', 'wrong');
        ch.classList.add(ok ? 'right' : 'wrong');
        if (!ok) ch.appendChild(el('span', 'sort-fix', '&rarr; ' + inline(c.items[i].bucket)));
      });
    };
    go.onclick = () => {
      const s = Primer.scoreSort(c, placed);
      if (ctx.primer) { reveal(placed); commit(box, exp, ctx, 'sort', placed.slice(), s.right + '/' + s.total); return; }
      attempts++;
      if (s.right === s.total) {
        reveal(placed);
        fb.innerHTML = '<b>Correct.</b>'; fb.className = 'check-fb good';
        box.classList.add('done'); exp.hidden = false;
        record(id, attempts === 1, {}, ctx);
        return;
      }
      chips.forEach((ch, i) => ch.classList.toggle('wrong', placed[i] !== c.items[i].bucket));
      fb.innerHTML = 'Not quite: the red items are in the wrong bucket. Move them and commit again.';
      fb.className = 'check-fb bad';
    };
    box.append(pool, grid, go, fb, exp);
    const saved = ctx.primer ? Primer.answered(Store.data, ctx.key) : null;
    if (ctx.primer && saved && saved.type === 'sort' && Primer.fits('sort', c, saved.answer)) {
      saved.answer.forEach((b, i) => place(i, b)); reveal(saved.answer); settle(box, exp, ctx);
    } else if (!ctx.primer && Store.data.checks[id] && Store.data.checks[id].done) {
      c.items.forEach((it, i) => place(i, it.bucket)); reveal(placed); box.classList.add('done'); exp.hidden = false;
    }
    return box;
  }

  // :::order — drag rows or use the up/down buttons, then commit. Graded outside primers: retry until right.
  function buildOrder(d, ctx, idx) {
    const c = Primer.parseOrder(d.body);
    const id = ctx.key + '#o' + (d.args || idx);
    const box = el('div', 'check order');
    if (c.errors.length) return blockError(box, 'Order', c.errors);
    if (ctx.primer) ctx.sec.primer = { type: 'order', spec: c }; else box.dataset.checkId = id;
    box.appendChild(el('div', 'check-label', ctx.primer ? 'Your guess' : 'Put it in order'));
    box.appendChild(el('div', 'check-q', md(c.q.join('\n'))));
    const list = el('ol', 'order-list');
    const go = el('button', 'btn small', 'Commit');
    const fb = el('div', 'check-fb');
    fb.setAttribute('role', 'status');
    const exp = el('div', 'check-explain', md(c.explain.join('\n')));
    exp.hidden = true;
    let seq = Primer.orderStart(c.items.length, id), locked = false, attempts = 0;
    const draw = () => seq.forEach((v, p) => {
      rows[v].querySelector('.order-num').textContent = (p + 1) + '.';
      rows[v].classList.remove('wrong');
      list.appendChild(rows[v]);
    });
    const move = (i, dir) => {
      const p = seq.indexOf(i), q = p + dir;
      if (locked || q < 0 || q >= seq.length) return;
      [seq[p], seq[q]] = [seq[q], seq[p]];
      draw();
    };
    const rows = c.items.map((t, i) => {
      const li = el('li', 'order-item');
      li.draggable = true;
      const up = el('button', 'order-move', '&uarr;'), dn = el('button', 'order-move', '&darr;');
      up.setAttribute('aria-label', 'Move up'); dn.setAttribute('aria-label', 'Move down');
      up.onclick = () => { move(i, -1); up.focus(); };
      dn.onclick = () => { move(i, 1); dn.focus(); };
      li.append(el('span', 'order-num'), el('span', 'order-text', inline(t)), up, dn);
      li.ondragstart = e => e.dataTransfer.setData('text/plain', String(i));
      li.ondragover = e => { if (!locked) e.preventDefault(); };
      li.ondrop = e => {
        e.preventDefault();
        const from = +e.dataTransfer.getData('text/plain');
        if (locked || from === i) return;
        const to = seq.indexOf(i);
        seq.splice(seq.indexOf(from), 1);
        seq.splice(to, 0, from);
        draw();
      };
      return li;
    });
    const reveal = ans => {
      locked = true; go.hidden = true;
      seq = ans.slice(); draw();
      seq.forEach((v, p) => {
        const row = rows[v], ok = v === p;
        row.draggable = false;
        row.querySelectorAll('.order-move').forEach(b => { b.disabled = true; });
        row.classList.add(ok ? 'right' : 'wrong');
        if (!ok) row.querySelector('.order-text').appendChild(el('span', 'order-fix', `actually step ${v + 1}`));
      });
    };
    go.onclick = () => {
      const s = Primer.scoreOrder(c, seq);
      if (ctx.primer) { const a = seq.slice(); reveal(a); commit(box, exp, ctx, 'order', a, s.right + '/' + s.total); return; }
      attempts++;
      if (s.right === s.total) {
        reveal(seq);
        fb.innerHTML = '<b>Correct.</b>'; fb.className = 'check-fb good';
        box.classList.add('done'); exp.hidden = false;
        record(id, attempts === 1, {}, ctx);
        return;
      }
      seq.forEach((v, p) => rows[v].classList.toggle('wrong', v !== p));
      fb.innerHTML = 'Not quite: the red steps are out of place. Rearrange and commit again.';
      fb.className = 'check-fb bad';
    };
    draw();
    box.append(list, go, fb, exp);
    const saved = ctx.primer ? Primer.answered(Store.data, ctx.key) : null;
    if (ctx.primer && saved && saved.type === 'order' && Primer.fits('order', c, saved.answer)) {
      reveal(saved.answer); settle(box, exp, ctx);
    } else if (!ctx.primer && Store.data.checks[id] && Store.data.checks[id].done) {
      reveal(c.items.map((_, i) => i)); box.classList.add('done'); exp.hidden = false;
    }
    return box;
  }

  function buildWidget(d) {
    const box = el('div', 'widget');
    Widgets.mount(box, d.args);
    return box;
  }

  const RECAP = /\{\{primer\}\}/g;
  function buildStep(text, ctx, counter) {
    const step = el('div', ctx.primer ? 'step primer' : 'step');
    for (const b of splitDirectives(text)) {
      if (b.kind === 'md') { if (b.text.trim()) step.appendChild(el('div', 'prose', md(b.text).replace(RECAP, '<span class="primer-recap"></span>'))); continue; }
      if (b.type === 'primer') step.appendChild(el('div', 'primer-label', 'Before you read'));
      else if (b.type === 'check') step.appendChild(ctx.primer ? buildPrimerCheck(b, ctx) : buildCheck(b, ctx, counter.n++));
      else if (b.type === 'challenge') step.appendChild(buildChallenge(b, ctx, counter.c++));
      else if (b.type === 'sort') step.appendChild(buildSort(b, ctx, counter.s++));
      else if (b.type === 'order') step.appendChild(buildOrder(b, ctx, counter.o++));
      else if (b.type === 'widget') step.appendChild(buildWidget(b));
      else step.appendChild(buildCallout(b));
    }
    return step;
  }

  // Returns array of step elements for a section body. A first step starting with :::primer::: is the primer.
  function section(body, ctx) {
    const counter = { n: 0, c: 0, s: 0, o: 0 };
    const sec = { primer: null };
    const steps = [];
    const fill = () => {
      const e = sec.primer && Primer.answered(Store.data, ctx.key);
      const text = e && e.type === sec.primer.type ? Primer.recap(sec.primer.type, sec.primer.spec, e.answer) : '';
      const html = text ? '<b>Your guess:</b> ' + inline(text) : '';
      steps.forEach(st => st.querySelectorAll('.primer-recap').forEach(sp => { sp.innerHTML = html; }));
    };
    const pctx = Object.assign({}, ctx, { primer: true, sec, onPrimer: fill });
    body.split(/^\+\+\+\s*$/m).forEach((t, i) => steps.push(buildStep(t, i === 0 && /^\s*:::primer:::/.test(t) ? pctx : ctx, counter)));
    fill();
    return steps;
  }

  return { md, inline, section, el, split: splitDirectives };
})();
