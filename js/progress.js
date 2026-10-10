const Progress = (() => {
  const E = Render.el;
  const KEYS = [['new', 'New'], ['learning', 'Learning'], ['familiar', 'Familiar'], ['strong', 'Strong'], ['mastered', 'Mastered']];

  function route(root) {
    const all = PCEA.allCards();
    const dist = cards => { const d = {}; KEYS.forEach(([k]) => d[k] = 0); cards.forEach(c => d[Scheduler.status(c.id).key]++); return d; };
    const bar = (d, n) => `<div class="dist">${KEYS.map(([k, l]) => d[k] ? `<i class="${k}" style="width:${d[k] / n * 100}%" title="${l}: ${d[k]}"></i>` : '').join('')}</div>`;
    const checks = Object.entries(Store.data.checks);
    const firstTry = checks.filter(([, v]) => v.first).length;
    const tot = dist(all);
    root.innerHTML = `
      <div class="progress-page">
        <h1>Progress</h1>
        ${Rewards.questsHTML()}
        ${Hud.progressHTML()}
        ${Rewards.cosmeticsHTML()}
        <div class="kpis">
          <div class="kpi"><b>${Object.values(Store.data.sections).filter(s => s.done).length}</b><span>sections completed</span></div>
          <div class="kpi"><b>${checks.length ? Math.round(firstTry / checks.length * 100) + '%' : '—'}</b><span>questions right first try (${checks.length} answered)</span></div>
          <div class="kpi"><b>${all.filter(c => Scheduler.isDue(c.id)).length}</b><span>cards due now</span></div>
          <div class="kpi"><b>${tot.strong + tot.mastered}</b><span>of ${all.length} cards strong or mastered</span></div>
        </div>
        ${bar(tot, all.length)}
        <div class="dist-legend">${KEYS.map(([k, l]) => `<span><i class="${k}"></i>${l} ${tot[k]}</span>`).join('')}</div>
        <table class="ptable">
          <tr><th>Module</th><th>Sections</th><th>Card mastery</th><th>Due</th><th></th></tr>
          ${PCEA.modules.map(m => {
            const p = Learn.moduleProgress(m), d = dist(m.cardList), due = m.cardList.filter(c => Scheduler.isDue(c.id)).length;
            return `<tr><td><a href="#/learn/${m.id}">${m.num}. ${m.short || m.title}</a></td><td>${p.done}/${p.total}</td><td>${bar(d, m.cardList.length || 1)}</td><td>${due || ''}</td><td><a class="btn small ghost" href="#/cards?m=${m.id}">Study</a></td></tr>`;
          }).join('')}
        </table>
        <h2>Weakest cards</h2>
        <div class="weak-list"></div>
        <h2>Your data</h2>
        <p class="muted">${Store.mode === 'server'
          ? `Profile <b>${Store.profile.replace(/</g, '&lt;')}</b> is saved as <b>profiles/${Store.profile.replace(/</g, '&lt;')}.json</b> in the app folder on the computer running the server. Daily backups are kept in profiles/.backups.`
          : `Profile <b>${Store.profile.replace(/</g, '&lt;')}</b> is saved in this browser only. Export a backup to keep a copy, or to move it into the file-based version (npm start).`}
          Import replaces this profile's progress with the file's contents.</p>
        <div class="row-btns">
          <button class="btn ghost" id="exp">Export progress</button>
          <label class="btn ghost">Import progress<input type="file" id="imp" accept=".json" hidden></label>
          <button class="btn ghost danger" id="rstC">Reset flashcard progress</button>
          <button class="btn ghost danger" id="rstL">Reset lesson progress</button>
        </div>
      </div>`;

    const weak = all.filter(c => { const s = Scheduler.get(c.id); return s && s.seen >= 2; })
      .sort((a, b) => Scheduler.accuracy(a.id) - Scheduler.accuracy(b.id)).slice(0, 12);
    root.querySelector('.weak-list').innerHTML = weak.length
      ? weak.map(c => `<div class="weak"><div>${Render.inline(c.q.split('\n')[0])}</div><span>${Math.round(Scheduler.accuracy(c.id) * 100)}% &middot; M${PCEA.module(c.module).num}</span></div>`).join('')
      : '<p class="muted">Cards you have answered at least twice will show here, worst first.</p>';

    root.querySelector('#exp').onclick = () => {
      const blob = new Blob([Store.exportJSON()], { type: 'application/json' });
      const a = E('a'); a.href = URL.createObjectURL(blob); a.download = 'pcea-progress-' + Store.profile.replace(/\s+/g, '_') + '-' + new Date().toISOString().slice(0, 10) + '.json'; a.click();
    };
    root.querySelector('#imp').onchange = e => {
      const f = e.target.files[0]; if (!f) return;
      f.text().then(t => { try { Store.importJSON(t); App.profileChanged(); App.render(); } catch (err) { alert('Import failed: ' + err.message); } });
    };
    root.querySelector('#rstC').onclick = () => { if (confirm('Reset all flashcard progress (levels, stars, history)?')) { Store.reset('cards'); App.render(); } };
    Rewards.wire(root, () => App.render());
    root.querySelector('#rstL').onclick = () => { if (confirm('Reset lesson progress (completed sections and answered questions)?')) { Store.reset('sections'); Store.reset('checks'); Store.reset('primers'); App.render(); } };
  }
  return { route };
})();
