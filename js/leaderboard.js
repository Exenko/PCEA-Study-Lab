const Leaderboard = (() => {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  async function route(root) {
    root.innerHTML = `<div class="progress-page"><h1>Leaderboard</h1>
      <p class="muted">Profiles on this server that choose to appear. Only name, rank, XP and streak are shown.</p>
      <label class="lb-opt"><input type="checkbox" id="lbOpt" ${Store.settings.leaderboard ? 'checked' : ''}> Show <b>${esc(Store.profile)}</b> on the leaderboard</label>
      <div id="lbList" class="muted">Loading…</div></div>`;
    const list = root.querySelector('#lbList');
    async function load() {
      try {
        const rows = await Store.api('GET', 'leaderboard');
        list.className = '';
        list.innerHTML = rows.length ? `<table class="ptable lb"><tr><th>#</th><th>Name</th><th>Rank</th><th>XP</th><th>Streak</th></tr>${rows.map((r, i) =>
          `<tr class="${r.name.toLowerCase() === Store.profile.toLowerCase() ? 'me' : ''}"><td>${i + 1}</td><td>${esc(r.name)}</td><td>${esc(r.rank)}</td><td>${r.xp.toLocaleString('en-US')}</td><td>${r.streak}</td></tr>`).join('')}</table>`
          : '<p class="muted">Nobody has opted in yet.</p>';
      } catch (e) { list.textContent = 'Could not load the leaderboard: ' + e.message; }
    }
    root.querySelector('#lbOpt').onchange = async e => {
      Store.settings.leaderboard = e.target.checked;
      Store.save();
      await Store.push();
      load();
    };
    load();
  }
  return { route };
})();
