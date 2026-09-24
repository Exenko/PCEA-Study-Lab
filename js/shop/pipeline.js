// Pipeline engine: run, check and edit pipelines of nodes, plus the progress rules for the workshop. Pure functions.
(function (root) {
  const N = typeof module !== 'undefined' && module.exports ? require('./nodes.js') : root.ShopNodes;
  const C = typeof module !== 'undefined' && module.exports ? require('./core.js') : root.ShopCore;
  const VALIDATE_N = 5;
  const isStep = r => typeof r === 'string' && /^s\d+$/.test(r);
  const stepIdx = r => +r.slice(1);
  const finite = v => Array.isArray(v) ? v.every(Number.isFinite) : Number.isFinite(v);
  const clone = p => JSON.parse(JSON.stringify(p));

  function resolve(ref, inputs, vals, errs) {
    if (ref && typeof ref === 'object' && Number.isFinite(ref.c)) return ref.c;
    if (typeof ref === 'string' && ref.startsWith('in.') && inputs && ref.slice(3) in inputs) return inputs[ref.slice(3)];
    if (isStep(ref) && stepIdx(ref) < vals.length && !errs[stepIdx(ref)]) return vals[stepIdx(ref)];
    return undefined;
  }

  function run(pipe, inputs) {
    const vals = [], errs = [];
    pipe.steps.forEach(st => {
      const node = N.byId(st.node);
      if (!node) { vals.push(undefined); errs.push(st.node ? 'Unknown node' : 'Choose a block'); return; }
      const args = node.ins.map(p => resolve((st.args || {})[p.name], inputs, vals, errs));
      if (args.some(a => a === undefined)) { vals.push(undefined); errs.push('Waiting on an input'); return; }
      try {
        const v = node.fn(...args);
        if (!finite(v)) { vals.push(undefined); errs.push('Result is not a finite number'); return; }
        vals.push(v); errs.push(null);
      } catch (e) { vals.push(undefined); errs.push(e.message); }
    });
    const outs = (pipe.outs || []).map(r => { const v = isStep(r) ? resolve(r, inputs, vals, errs) : undefined; return typeof v === 'number' ? v : null; });
    return { vals, errs, outs };
  }

  function check(pipe, ins, nAnswers, allowed) {
    const out = [];
    const refProblem = (r, i) => {
      if (r === undefined || r === '' || r === null) return 'Not connected';
      if (typeof r === 'object') return Number.isFinite(r.c) ? null : 'Constant is not a number';
      if (typeof r !== 'string') return 'Not connected';
      if (r.startsWith('in.')) return r.slice(3) in ins ? null : 'Unknown input';
      if (isStep(r)) return stepIdx(r) < i ? null : 'Must use an earlier step';
      return 'Not connected';
    };
    pipe.steps.forEach((st, i) => {
      const node = N.byId(st.node);
      if (!node) { out.push({ step: i, port: null, msg: st.node ? 'Unknown node' : 'Choose a block' }); return; }
      if (allowed && !allowed.has(node.id)) out.push({ step: i, port: null, msg: 'Node not unlocked' });
      node.ins.forEach(p => { const m = refProblem((st.args || {})[p.name], i); if (m) out.push({ step: i, port: p.name, msg: m }); });
    });
    const outs = pipe.outs || [];
    for (let k = 0; k < Math.max(nAnswers, outs.length); k++) {
      if (k >= nAnswers) { out.push({ step: null, port: 'out' + k, msg: `Only ${nAnswers} answer${nAnswers > 1 ? 's' : ''}` }); continue; }
      const m = refProblem(outs[k], pipe.steps.length);
      if (m || !isStep(outs[k])) out.push({ step: null, port: 'out' + k, msg: m || 'Not connected' });
    }
    return out;
  }

  // Rewrites every step ref through f(oldIndex) -> newIndex | null (null means the step is gone).
  function remap(p, f) {
    const map = r => isStep(r) ? (f(stepIdx(r)) == null ? '' : 's' + f(stepIdx(r))) : r;
    p.steps.forEach(st => Object.keys(st.args || {}).forEach(k => { st.args[k] = map(st.args[k]); }));
    p.outs = (p.outs || []).map(r => isStep(r) ? (map(r) || null) : r);
    return p;
  }
  function removeStep(pipe, i) {
    const p = clone(pipe);
    p.steps.splice(i, 1);
    return remap(p, j => j === i ? null : j > i ? j - 1 : j);
  }
  function moveStep(pipe, i, dir) {
    const p = clone(pipe), j = i + dir;
    if (j < 0 || j >= p.steps.length) return p;
    [p.steps[i], p.steps[j]] = [p.steps[j], p.steps[i]];
    return remap(p, k => k === i ? j : k === j ? i : k);
  }
  const primitivesOnly = pipe => pipe.steps.every(st => { const n = N.byId(st.node); return !n || n.kind !== 'domain'; });
  function pctWarning(pipe, i, port, ins) {
    const st = pipe.steps[i], node = st && N.byId(st.node);
    if (!node || node.kind !== 'domain') return null;
    const p = node.ins.find(x => x.name === port), r = (st.args || {})[port];
    if (!p || typeof r !== 'string' || !r.startsWith('in.') || !ins[r.slice(3)]) return null;
    const isPct = ins[r.slice(3)].unit === '%';
    if (!!p.pct === isPct) return null;
    return p.pct ? 'This port expects a rate or share' : 'This port does not expect a rate or share';
  }

  // Runs the pipeline on VALIDATE_N fresh contracts spread across tiers 1..maxTier. Pass means every answer within 1%.
  function validate(pipe, tpl, seedKey, maxTier) {
    const rows = [];
    let problems = null;
    for (let k = 0; k < VALIDATE_N; k++) {
      const tier = 1 + (k % Math.max(1, maxTier));
      const job = tpl.gen(C.helpers(C.rng(C.hash(seedKey + '|' + k))), tier);
      if (!problems) problems = check(pipe, tpl.ins, job.answers.length, null);
      const res = run(pipe, job.inputs);
      const each = job.answers.map((a, i) => res.outs[i] == null ? -0.3 : C.answerScore(res.outs[i], a.value));
      const off = job.answers.map((a, i) => res.outs[i] == null ? null : Math.abs(res.outs[i] - a.value) / Math.abs(a.value) * 100);
      rows.push({ tier, labels: job.answers.map(a => a.label), each, off });
    }
    return { rows, problems, passed: problems.length === 0 && rows.every(r => r.each.every(x => x === 1)) };
  }

  const GATE = 3;
  const recs = d => Object.values((d && d.shop) || {}).filter(r => r && typeof r === 'object');
  const handSolves = (d, id) => recs(d).filter(r => r.tpl === id && r.score === 1 && !r.camp).length;
  const earned = d => new Set(recs(d).filter(r => typeof r.node === 'string').map(r => r.node));
  function allowed(d) {
    const st = C.state(d), out = earned(d);
    N.PRIMITIVE.forEach(n => out.add(n.id));
    N.TOOL.forEach(n => { if (st.has(n.tool)) out.add(n.id); });
    return out;
  }
  const record = (d, id) => ((d && d.shop) || {})['pipe-' + id];
  function status(d, id) {
    const r = record(d, id);
    if (r && r.passed) return 'running';
    return handSolves(d, id) >= GATE ? 'ready' : 'locked';
  }
  function unlocksFor(pipe, id, d) {
    if (!primitivesOnly(pipe)) return [];
    const have = earned(d);
    return N.DOMAIN.filter(n => n.earnedFrom.includes(id) && !have.has(n.id)).map(n => n.id);
  }

  const ShopPipe = { run, check, removeStep, moveStep, primitivesOnly, pctWarning, validate, VALIDATE_N, GATE, handSolves, earned, allowed, record, status, unlocksFor };
  if (typeof module !== 'undefined' && module.exports) module.exports = ShopPipe; else root.ShopPipe = ShopPipe;
})(this);
