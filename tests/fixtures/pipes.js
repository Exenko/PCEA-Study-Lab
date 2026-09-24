// Reference pipelines: prim uses only primitive and tool nodes, domain uses earned nodes where they exist.
const S = (node, args) => ({ node, args });
const c = v => ({ c: v });
module.exports = {
  'esc-compound': {
    prim: { steps: [S('add', { a: c(1), b: 'in.rate' }), S('pow', { base: 's0', exp: 'in.years' }), S('mul', { a: 'in.cost', b: 's1' })], outs: ['s2'] },
    domain: { steps: [S('escalate', { cost: 'in.cost', rate: 'in.rate', years: 'in.years' })], outs: ['s0'] }
  },
  'esc-index': {
    prim: { steps: [S('div', { a: 'in.idxBase', b: 'in.idxYear' }), S('mul', { a: 'in.cost', b: 's0' })], outs: ['s1'] },
    domain: { steps: [S('indexConvert', { cost: 'in.cost', fromIdx: 'in.idxYear', toIdx: 'in.idxBase' })], outs: ['s0'] }
  },
  'analogy-scale': {
    prim: { steps: [S('div', { a: 'in.newWt', b: 'in.oldWt' }), S('pow', { base: 's0', exp: 'in.exp' }), S('mul', { a: 'in.cost', b: 's1' }), S('mul', { a: 's2', b: 'in.factor' })], outs: ['s3'] },
    domain: { steps: [S('div', { a: 'in.newWt', b: 'in.oldWt' }), S('powerCER', { a: 'in.cost', x: 's0', b: 'in.exp' }), S('mul', { a: 's1', b: 'in.factor' })], outs: ['s2'] }
  },
  'cer-power': {
    prim: { steps: [S('pow', { base: 'in.weight', exp: 'in.b' }), S('mul', { a: 'in.a', b: 's0' })], outs: ['s1'] },
    domain: { steps: [S('powerCER', { a: 'in.a', x: 'in.weight', b: 'in.b' })], outs: ['s0'] }
  },
  'stats-cv': {
    prim: { steps: [S('mean', { list: 'in.costs' }), S('sub', { a: 'in.costs', b: 's0' }), S('pow', { base: 's1', exp: c(2) }), S('sum', { list: 's2' }),
      S('count', { list: 'in.costs' }), S('sub', { a: 's4', b: c(1) }), S('div', { a: 's3', b: 's5' }), S('sqrt', { x: 's6' }), S('div', { a: 's7', b: 's0' }), S('mul', { a: 's8', b: c(100) })], outs: ['s0', 's9'] },
    domain: { steps: [S('mean', { list: 'in.costs' }), S('cv', { list: 'in.costs' }), S('mul', { a: 's1', b: c(100) })], outs: ['s0', 's2'] }
  },
  'lc-unit': {
    prim: { steps: [S('log2', { x: 'in.slope' }), S('pow', { base: 'in.unit', exp: 's0' }), S('mul', { a: 'in.t1', b: 's1' })], outs: ['s2'] },
    domain: { steps: [S('lcUnit', { t1: 'in.t1', slope: 'in.slope', unit: 'in.unit' })], outs: ['s0'] }
  },
  'lc-lot': {
    prim: { steps: [S('add', { a: 'in.first', b: 'in.qty' }), S('sub', { a: 's0', b: c(1) }), S('range', { from: 'in.first', to: 's1' }), S('log2', { x: 'in.slope' }),
      S('pow', { base: 's2', exp: 's3' }), S('mul', { a: 'in.t1', b: 's4' }), S('sum', { list: 's5' }), S('div', { a: 's6', b: 'in.qty' })], outs: ['s6', 's7'] },
    domain: { steps: [S('add', { a: 'in.first', b: 'in.qty' }), S('sub', { a: 's0', b: c(1) }), S('lcLotTotal', { t1: 'in.t1', slope: 'in.slope', first: 'in.first', last: 's1' }), S('div', { a: 's2', b: 'in.qty' })], outs: ['s2', 's3'] }
  },
  'lc-slope': {
    prim: { steps: [S('div', { a: 'in.hours2', b: 'in.hours1' }), S('log', { x: 's0' }), S('div', { a: 'in.unit2', b: 'in.unit1' }), S('log', { x: 's2' }),
      S('div', { a: 's1', b: 's3' }), S('pow', { base: c(2), exp: 's4' }), S('mul', { a: 's5', b: c(100) })], outs: ['s6'] },
    domain: { steps: [S('lcSlope', { unit1: 'in.unit1', hours1: 'in.hours1', unit2: 'in.unit2', hours2: 'in.hours2' }), S('mul', { a: 's0', b: c(100) })], outs: ['s1'] }
  },
  'reg-fit': {
    prim: { steps: [S('mean', { list: 'in.xs' }), S('mean', { list: 'in.ys' }), S('sub', { a: 'in.xs', b: 's0' }), S('sub', { a: 'in.ys', b: 's1' }),
      S('mul', { a: 's2', b: 's3' }), S('sum', { list: 's4' }), S('pow', { base: 's2', exp: c(2) }), S('sum', { list: 's6' }), S('div', { a: 's5', b: 's7' }),
      S('mul', { a: 's8', b: 's0' }), S('sub', { a: 's1', b: 's9' }), S('mul', { a: 's8', b: 'in.xNew' }), S('add', { a: 's10', b: 's11' })], outs: ['s8', 's12'] },
    domain: { steps: [S('linSlope', { xs: 'in.xs', ys: 'in.ys' }), S('linIntercept', { xs: 'in.xs', ys: 'in.ys' }), S('mul', { a: 's0', b: 'in.xNew' }), S('add', { a: 's1', b: 's2' })], outs: ['s0', 's3'] }
  },
  'tri-stats': {
    prim: { steps: [S('add', { a: 'in.low', b: 'in.mode' }), S('add', { a: 's0', b: 'in.high' }), S('div', { a: 's1', b: c(3) }),
      S('pow', { base: 'in.low', exp: c(2) }), S('pow', { base: 'in.mode', exp: c(2) }), S('pow', { base: 'in.high', exp: c(2) }), S('add', { a: 's3', b: 's4' }), S('add', { a: 's6', b: 's5' }),
      S('mul', { a: 'in.low', b: 'in.mode' }), S('mul', { a: 'in.low', b: 'in.high' }), S('mul', { a: 'in.mode', b: 'in.high' }),
      S('sub', { a: 's7', b: 's8' }), S('sub', { a: 's11', b: 's9' }), S('sub', { a: 's12', b: 's10' }), S('div', { a: 's13', b: c(18) }), S('sqrt', { x: 's14' })], outs: ['s2', 's15'] },
    domain: { steps: [S('triMean', { low: 'in.low', mode: 'in.mode', high: 'in.high' }), S('triSD', { low: 'in.low', mode: 'in.mode', high: 'in.high' })], outs: ['s0', 's1'] }
  },
  'risk-sum': {
    prim: { steps: [S('sum', { list: 'in.means' }), S('sum', { list: 'in.sds' }), S('pow', { base: 'in.sds', exp: c(2) }), S('sum', { list: 's2' }), S('sqrt', { x: 's3' }),
      S('if', { flag: 'in.correlated', then: 's1', else: 's4' })], outs: ['s0', 's5'] },
    domain: { steps: [S('sum', { list: 'in.means' }), S('sum', { list: 'in.sds' }), S('rss', { list: 'in.sds' }), S('if', { flag: 'in.correlated', then: 's1', else: 's2' })], outs: ['s0', 's3'] }
  },
  'normal-prob': {
    prim: { steps: [S('sub', { a: 'in.budget', b: 'in.mean' }), S('div', { a: 's0', b: 'in.sd' }), S('normalCDF', { z: 's1' }), S('mul', { a: 's2', b: c(100) })], outs: ['s3'] },
    domain: { steps: [S('sub', { a: 'in.budget', b: 'in.mean' }), S('div', { a: 's0', b: 'in.sd' }), S('normalCDF', { z: 's1' }), S('mul', { a: 's2', b: c(100) })], outs: ['s3'] }
  },
  'expected-value': {
    prim: { steps: [S('mul', { a: 'in.probs', b: 'in.costs' }), S('sum', { list: 's0' })], outs: ['s1'] },
    domain: { steps: [S('expectedValue', { probs: 'in.probs', values: 'in.costs' })], outs: ['s0'] }
  },
  'mfg-labor': {
    prim: { steps: [S('mul', { a: 'in.stdHours', b: 'in.qty' }), S('mul', { a: 's0', b: 'in.realization' }), S('mul', { a: 's1', b: 'in.rate' }), S('div', { a: 's2', b: c(1000) })], outs: ['s1', 's3'] },
    domain: { steps: [S('mul', { a: 'in.stdHours', b: 'in.qty' }), S('mul', { a: 's0', b: 'in.realization' }), S('mul', { a: 's1', b: 'in.rate' }), S('div', { a: 's2', b: c(1000) })], outs: ['s1', 's3'] }
  },
  'make-buy': {
    prim: { steps: [S('mul', { a: 'in.tooling', b: c(1000) }), S('sub', { a: 'in.buyUnit', b: 'in.makeUnit' }), S('div', { a: 's0', b: 's1' })], outs: ['s2'] },
    domain: { steps: [S('mul', { a: 'in.tooling', b: c(1000) }), S('breakEven', { fixed: 's0', makeUnit: 'in.makeUnit', buyUnit: 'in.buyUnit' })], outs: ['s1'] }
  },
  'sw-effort': {
    prim: { steps: [S('pow', { base: 'in.ksloc', exp: 'in.b' }), S('mul', { a: 'in.a', b: 's0' }), S('mul', { a: 's1', b: 'in.rate' }), S('div', { a: 's2', b: c(1000) })], outs: ['s1', 's3'] },
    domain: { steps: [S('powerCER', { a: 'in.a', x: 'in.ksloc', b: 'in.b' }), S('mul', { a: 's0', b: 'in.rate' }), S('div', { a: 's1', b: c(1000) })], outs: ['s0', 's2'] }
  },
  'npv': {
    prim: { steps: [S('count', { list: 'in.flows' }), S('range', { from: c(1), to: 's0' }), S('add', { a: c(1), b: 'in.rate' }), S('pow', { base: 's2', exp: 's1' }),
      S('div', { a: 'in.flows', b: 's3' }), S('sum', { list: 's4' }), S('sub', { a: 's5', b: 'in.invest' })], outs: ['s6'] },
    domain: { steps: [S('npv', { invest: 'in.invest', flows: 'in.flows', rate: 'in.rate' })], outs: ['s0'] }
  },
  'pv-annuity': {
    prim: { steps: [S('add', { a: c(1), b: 'in.rate' }), S('sub', { a: c(0), b: 'in.years' }), S('pow', { base: 's0', exp: 's1' }), S('sub', { a: c(1), b: 's2' }),
      S('div', { a: 's3', b: 'in.rate' }), S('mul', { a: 'in.amount', b: 's4' })], outs: ['s5'] },
    domain: { steps: [S('annuityPV', { amount: 'in.amount', years: 'in.years', rate: 'in.rate' })], outs: ['s0'] }
  },
  'cpif-fee': {
    prim: { steps: [S('sub', { a: 'in.targetCost', b: 'in.actual' }), S('mul', { a: 'in.conShare', b: 's0' }), S('add', { a: 'in.targetFee', b: 's1' }),
      S('max', { a: 's2', b: 'in.minFee' }), S('min', { a: 's3', b: 'in.maxFee' }), S('add', { a: 'in.actual', b: 's4' })], outs: ['s4', 's5'] },
    domain: { steps: [S('cpifFee', { targetFee: 'in.targetFee', targetCost: 'in.targetCost', actual: 'in.actual', conShare: 'in.conShare', minFee: 'in.minFee', maxFee: 'in.maxFee' }),
      S('add', { a: 'in.actual', b: 's0' })], outs: ['s0', 's1'] }
  },
  'fpif-pta': {
    prim: { steps: [S('add', { a: 'in.targetCost', b: 'in.targetProfit' }), S('sub', { a: 'in.ceiling', b: 's0' }), S('div', { a: 's1', b: 'in.govShare' }), S('add', { a: 'in.targetCost', b: 's2' }),
      S('sub', { a: 'in.targetCost', b: 'in.actual' }), S('mul', { a: 'in.conShare', b: 's4' }), S('add', { a: 'in.targetProfit', b: 's5' }), S('add', { a: 'in.actual', b: 's6' }),
      S('min', { a: 'in.ceiling', b: 's7' })], outs: ['s3', 's8'] },
    domain: { steps: [S('fpifPTA', { targetCost: 'in.targetCost', targetProfit: 'in.targetProfit', ceiling: 'in.ceiling', govShare: 'in.govShare' }),
      S('sub', { a: 'in.targetCost', b: 'in.actual' }), S('mul', { a: 'in.conShare', b: 's1' }), S('add', { a: 'in.targetProfit', b: 's2' }), S('add', { a: 'in.actual', b: 's3' }),
      S('min', { a: 'in.ceiling', b: 's4' })], outs: ['s0', 's5'] }
  },
  'evm-eac': {
    prim: { steps: [S('div', { a: 'in.ev', b: 'in.ac' }), S('div', { a: 'in.ev', b: 'in.pv' }), S('div', { a: 'in.bac', b: 's0' }), S('sub', { a: 'in.bac', b: 'in.ev' }),
      S('mul', { a: 's0', b: 's1' }), S('div', { a: 's3', b: 's4' }), S('add', { a: 'in.ac', b: 's5' }), S('if', { flag: 'in.composite', then: 's6', else: 's2' })], outs: ['s0', 's7'] },
    domain: { steps: [S('cpi', { ev: 'in.ev', ac: 'in.ac' }), S('spi', { ev: 'in.ev', pv: 'in.pv' }), S('eacCPI', { bac: 'in.bac', cpi: 's0' }),
      S('eacComposite', { ac: 'in.ac', bac: 'in.bac', ev: 'in.ev', cpi: 's0', spi: 's1' }), S('if', { flag: 'in.composite', then: 's3', else: 's2' })], outs: ['s0', 's4'] }
  },
  'evm-tcpi': {
    prim: { steps: [S('sub', { a: 'in.bac', b: 'in.ev' }), S('sub', { a: 'in.bac', b: 'in.ac' }), S('div', { a: 's0', b: 's1' }), S('div', { a: 'in.ev', b: 'in.ac' }),
      S('div', { a: 'in.bac', b: 's3' }), S('sub', { a: 's4', b: 'in.ac' })], outs: ['s2', 's5'] },
    domain: { steps: [S('tcpi', { bac: 'in.bac', ev: 'in.ev', ac: 'in.ac' }), S('cpi', { ev: 'in.ev', ac: 'in.ac' }), S('eacCPI', { bac: 'in.bac', cpi: 's1' }), S('sub', { a: 's2', b: 'in.ac' })], outs: ['s0', 's3'] }
  },
  'abc-cost': {
    prim: { steps: [S('div', { a: 'in.setupPool', b: 'in.setups' }), S('div', { a: 'in.inspPool', b: 'in.inspections' }), S('mul', { a: 's0', b: 'in.aSetups' }), S('mul', { a: 's1', b: 'in.aInsp' }), S('add', { a: 's2', b: 's3' })], outs: ['s0', 's4'] },
    domain: { steps: [S('abcRate', { pool: 'in.setupPool', drivers: 'in.setups' }), S('abcRate', { pool: 'in.inspPool', drivers: 'in.inspections' }), S('mul', { a: 's0', b: 'in.aSetups' }), S('mul', { a: 's1', b: 'in.aInsp' }), S('add', { a: 's2', b: 's3' })], outs: ['s0', 's4'] }
  }
};
