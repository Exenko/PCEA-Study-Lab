// Widget manifest: controls (settable sliders/selects), setters (other settable state), outputs (published values).
(function (root) {
  const WidgetMeta = {
    'stats-lab': { controls: [], setters: ['data'], outputs: ['n', 'mean', 'median', 'sd', 'cv', 'beyond2'] },
    'transform': { controls: ['f', 'a', 'b'], setters: [], outputs: ['r2', 'slope', 'intercept'] },
    'lc-explorer': { controls: ['theory', 't1', 'lcs', 'n', 'log'], setters: [], outputs: ['b', 'unitN', 'cavN', 'totalN'] },
    'lmp': { controls: ['F', 'L', 'lcs'], setters: [], outputs: ['ari', 'geo', 'heur', 'half', 'exact'] },
    'regression': { controls: ['mode'], setters: ['data', 'hand'], outputs: ['n', 'b0', 'b1', 'r2', 'see', 'cv', 't', 'p', 'sse', 'sseHand', 'ratio'] },
    'escalation': { controls: ['r', 'o1', 'o2', 'o3', 'amt'], setters: [], outputs: ['raw1', 'wtdBY', 'tyBY'] },
    'montecarlo': { controls: ['rho', 'n'], setters: [], outputs: ['pe', 'pePct', 'mean', 'sd', 'p50', 'p70', 'p80', 'p80ind', 'p80gap'] },
    'dist': { controls: ['d', 'p1', 'p2', 'p3'], setters: [], outputs: ['mean', 'median', 'mode', 'sd'] },
    'npv': { controls: ['r', 'ia', 'ca', 'ib', 'cb', 'n', 'mid'], setters: [], outputs: ['pvA', 'pvB', 'diff', 'sir', 'beRate'] },
    'fpif': { controls: ['tc', 'tp', 'cp', 'gs', 'ac'], setters: [], outputs: ['tpPrice', 'pta', 'ac', 'profit', 'price'] },
    'cpif': { controls: ['tc', 'tf', 'mn', 'mx', 'gs', 'ac'], setters: [], outputs: ['rieLo', 'rieHi', 'fee', 'price'] },
    'evm': { controls: ['sc', 'bac', 'm'], setters: [], outputs: ['m', 'pv', 'ev', 'ac', 'cv', 'sv', 'cpi', 'spi', 'eac', 'tcpi', 'vac'] },
    'burden': { controls: ['dl', 'oh', 'ga', 'fee', 'hrs'], setters: [], outputs: ['cost', 'wrap', 'multiple', 'price'] },
    'sw-effort': { controls: ['A', 'E', 's'], setters: [], outputs: ['effort', 'prod', 'doubleX'] },
    'analogy': { controls: ['c0', 's0', 's1', 'b', 'cx'], setters: [], outputs: ['ratio', 'sized', 'est', 'linear'] },
    'normalize': { controls: ['units', 'infl', 'qty'], setters: [], outputs: ['r2', 'nAdjust', 'byValue'] },
    'method-phase': { controls: ['phase'], setters: [], outputs: ['phase', 'dominant'] },
    'ci-sim': { controls: ['n', 'level', 'method'], setters: ['seed'], outputs: ['n', 'coverage', 'halfWidth'] },
    'lockin': { controls: ['x'], setters: [], outputs: ['x', 'committed', 'spent', 'gap', 'phase'] },
    'trl': { controls: [], setters: [], outputs: [] }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = WidgetMeta; else root.WidgetMeta = WidgetMeta;
})(typeof window !== 'undefined' ? window : this);
