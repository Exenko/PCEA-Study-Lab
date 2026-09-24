// Achievements are rules over stats computed from profile data; nothing about them is stored except which were already announced.
(function (root) {
  const vals = o => Object.values(o || {}).filter(v => v && typeof v === 'object');
  function stats(d, g, catalog) {
    const cards = vals(d.cards), checks = vals(d.checks), shop = vals(d.shop), mods = (catalog && catalog.modules) || [];
    const contracts = shop.filter(r => r.tpl), good = r => (r.score || 0) >= 0.6;
    const secDone = k => d.sections && d.sections[k] && d.sections[k].done;
    return {
      xp: g.xp.total, rankIdx: g.rank.idx, certified: g.certified,
      streakBest: g.streak.best, activeDays: g.streak.activeDays,
      reviews: cards.reduce((s, c) => s + (c.seen || 0), 0),
      mastered: cards.filter(c => (c.lvl || 0) >= 5).length,
      checks: checks.filter(c => c.done).length,
      firstTry: checks.filter(c => c.first).length,
      sections: vals(d.sections).filter(s => s.done).length,
      modulesRead: mods.filter(m => m.sections.length && m.sections.every(secDone)).length,
      moduleCount: mods.length,
      modulesStrong: mods.filter(m => (g.moduleLevels[m.id] || 0) >= 3).length,
      contracts: contracts.length,
      perfect: contracts.filter(r => (r.score || 0) >= 1).length,
      lc: contracts.filter(r => /^lc-/.test(r.tpl) && good(r)).length,
      evm: contracts.filter(r => /^evm-/.test(r.tpl) && good(r)).length,
      incentive: contracts.filter(r => /^(cpif|fpif)/.test(r.tpl) && good(r)).length,
      tools: shop.filter(r => r.tool).length,
      campaign: new Set(shop.filter(r => r.camp && good(r)).map(r => r.camp)).size
    };
  }
  const a = (id, name, desc, test) => ({ id, name, desc, test });
  const LIST = [
    a('first-section', 'Kickoff Meeting', 'Finish your first lesson section.', s => s.sections >= 1),
    a('module-read', 'Well Read', 'Finish every section of a module.', s => s.modulesRead >= 1),
    a('library', 'Full Library', 'Finish every section of every module.', s => s.moduleCount > 0 && s.modulesRead >= s.moduleCount),
    a('checks-50', 'Checked Out', 'Answer 50 lesson questions.', s => s.checks >= 50),
    a('sharp-25', 'Sharpshooter', 'Get 25 lesson questions right on the first try.', s => s.firstTry >= 25),
    a('sharp-100', 'Zero Variance', 'Get 100 lesson questions right on the first try.', s => s.firstTry >= 100),
    a('reviews-100', 'Data Collection', 'Grade 100 flashcards.', s => s.reviews >= 100),
    a('reviews-1000', 'Large Sample', 'Grade 1,000 flashcards.', s => s.reviews >= 1000),
    a('mastered-10', 'Mastered', 'Bring 10 cards to Mastered.', s => s.mastered >= 10),
    a('mastered-100', 'Subject Matter Expert', 'Bring 100 cards to Mastered.', s => s.mastered >= 100),
    a('strong-module', 'Strong Suit', 'Average Strong across a whole module\'s cards.', s => s.modulesStrong >= 1),
    a('streak-3', 'Learning Curve', 'Study 3 days in a row.', s => s.streakBest >= 3),
    a('streak-7', 'Steady State', 'Study 7 days in a row.', s => s.streakBest >= 7),
    a('streak-30', 'Sustainment', 'Study 30 days in a row.', s => s.streakBest >= 30),
    a('rank-1', 'Promoted', 'Reach Analyst I.', s => s.rankIdx >= 1),
    a('rank-3', 'Senior Staff', 'Reach Senior Estimator.', s => s.rankIdx >= 3),
    a('rank-5', 'Chief Estimator', 'Reach Chief Estimator.', s => s.rankIdx >= 5),
    a('certified', 'PCEA Certified', 'Reach Chief Estimator with every module at Strong.', s => s.certified),
    a('first-contract', 'Open for Business', 'Finish your first shop contract.', s => s.contracts >= 1),
    a('contracts-25', 'Going Concern', 'Finish 25 shop contracts.', s => s.contracts >= 25),
    a('perfect-10', 'On Target', 'Finish 10 contracts with every answer within 1%.', s => s.perfect >= 10),
    a('lc-5', 'Crawford Would Approve', 'Win 5 learning-curve contracts.', s => s.lc >= 5),
    a('evm-5', 'Earned Value', 'Win 5 earned value contracts.', s => s.evm >= 5),
    a('incentive-5', 'Share Ratio', 'Win 5 incentive-contract jobs.', s => s.incentive >= 5),
    a('tools-3', 'Tooled Up', 'Buy 3 things from the tool shop.', s => s.tools >= 3),
    a('first-campaign', 'First Program', 'Complete a campaign contract.', s => s.campaign >= 1),
    a('campaign-done', 'Program Complete', 'Complete all 8 campaign contracts.', s => s.campaign >= 8)
  ];
  function earned(d, g, catalog) { const s = stats(d || {}, g, catalog); return LIST.filter(x => x.test(s)); }
  const Achievements = { LIST, stats, earned };
  if (typeof module !== 'undefined' && module.exports) module.exports = Achievements; else root.Achievements = Achievements;
})(this);
