// Pipelines that pass some normal contracts but hard-code the assumption each market shock breaks.
const S = (node, args) => ({ node, args });
const c = v => ({ c: v });
module.exports = {
  'esc-compound': { steps: [S('add', { a: c(1), b: c(0.03) }), S('pow', { base: 's0', exp: 'in.years' }), S('mul', { a: 'in.cost', b: 's1' })], outs: ['s2'] },
  'esc-index': { steps: [S('div', { a: c(1), b: 'in.idxYear' }), S('mul', { a: 'in.cost', b: 's0' })], outs: ['s1'] },
  'lc-unit': { steps: [S('log2', { x: c(0.85) }), S('pow', { base: 'in.unit', exp: 's0' }), S('mul', { a: 'in.t1', b: 's1' })], outs: ['s2'] },
  'lc-lot': { steps: [S('range', { from: c(1), to: 'in.qty' }), S('log2', { x: 'in.slope' }), S('pow', { base: 's0', exp: 's1' }), S('mul', { a: 'in.t1', b: 's2' }),
    S('sum', { list: 's3' }), S('div', { a: 's4', b: 'in.qty' })], outs: ['s4', 's5'] },
  'npv': { steps: [S('npv', { invest: 'in.invest', flows: 'in.flows', rate: c(0.07) })], outs: ['s0'] },
  'evm-eac': { steps: [S('div', { a: 'in.ev', b: 'in.ac' }), S('max', { a: 's0', b: c(0.7) }), S('div', { a: 'in.ev', b: 'in.pv' }), S('div', { a: 'in.bac', b: 's1' }),
    S('sub', { a: 'in.bac', b: 'in.ev' }), S('mul', { a: 's1', b: 's2' }), S('div', { a: 's4', b: 's5' }), S('add', { a: 'in.ac', b: 's6' }),
    S('if', { flag: 'in.composite', then: 's7', else: 's3' })], outs: ['s1', 's8'] },
  'cpif-fee': { steps: [S('sub', { a: 'in.targetCost', b: 'in.actual' }), S('mul', { a: 'in.conShare', b: 's0' }), S('add', { a: 'in.targetFee', b: 's1' }),
    S('add', { a: 'in.actual', b: 's2' })], outs: ['s2', 's3'] },
  'mfg-labor': { steps: [S('mul', { a: 'in.stdHours', b: 'in.qty' }), S('mul', { a: 's0', b: 'in.realization' }), S('mul', { a: 's1', b: c(120) }), S('div', { a: 's2', b: c(1000) })], outs: ['s1', 's3'] }
};
