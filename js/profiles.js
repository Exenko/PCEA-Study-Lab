const Profiles = (() => {
  const E = Render.el;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function ago(ts) {
    if (!ts) return 'not used yet';
    const m = (Date.now() - ts) / 60000;
    if (m < 2) return 'just now';
    if (m < 60) return Math.round(m) + ' min ago';
    if (m < 1440) return Math.round(m / 60) + ' h ago';
    return Math.round(m / 1440) + ' d ago';
  }

  async function route(root) {
    const server = Store.mode === 'server';
    root.innerHTML = `
      <div class="profiles-page">
        <h1>Who's studying?</h1>
        <p class="muted">${server
          ? 'Each profile keeps its own progress in a file on the computer running the app. Anyone on the same network can open it and pick their profile, and one profile can be used from several devices.'
          : 'Each profile keeps its own progress.'}</p>
        <div class="profile-grid"><p class="muted">Loading…</p></div>
        <form class="panel new-profile">
          <label for="pname"><b>New profile</b></label>
          <div class="row">
            <input id="pname" maxlength="40" placeholder="Name" autocomplete="off">
            <button class="btn" type="submit">Create</button>
          </div>
          <div class="form-err" hidden></div>
        </form>
        ${server ? '' : `
        <div class="callout warn">
          <div class="callout-title">Progress is saved in this browser only</div>
          <div class="callout-body"><p>You opened the app directly from its file, so profiles are stored by this browser. Clearing browsing data would erase them. To keep progress as files in the app folder and use it from other devices, start the app by running <b>npm start</b> in the app folder (or double-click <b>Start PCEA Study Lab</b> on Windows) instead. You can move progress across with Export / Import on the Progress page.</p></div>
        </div>`}
      </div>`;

    const grid = root.querySelector('.profile-grid');
    let list;
    try { list = await Store.listProfiles(); }
    catch (e) { grid.innerHTML = `<p class="form-err">Couldn't reach the server: ${esc(e.message)}</p>`; return; }
    list.sort((a, b) => (b.updated || 0) - (a.updated || 0));
    grid.innerHTML = list.length ? '' : '<p class="muted">No profiles yet. Create one below.</p>';
    list.forEach(p => {
      const tile = E('div', 'profile-tile' + (p.name === Store.profile ? ' current' : ''));
      tile.innerHTML = `
        <button class="profile-open"><span class="avatar">${esc(p.name.slice(0, 1).toUpperCase())}</span>
          <b>${esc(p.name)}</b><span class="muted small">${p.studied || 0} cards studied · ${ago(p.updated)}</span></button>
        <button class="profile-del" title="Delete profile">Delete</button>`;
      tile.querySelector('.profile-open').onclick = async () => {
        try { await Store.open(p.name); App.profileChanged(); location.hash = '#/'; }
        catch (e) { alert('Could not open profile: ' + e.message); }
      };
      tile.querySelector('.profile-del').onclick = async () => {
        const typed = prompt(`Delete "${p.name}" and all of its progress?\n\nType the profile name to confirm.`);
        if (typed == null) return;
        if (typed.trim() !== p.name) { alert('Name did not match. Nothing was deleted.'); return; }
        try { await Store.remove(p.name); App.profileChanged(); route(root); }
        catch (e) { alert('Could not delete: ' + e.message); }
      };
      grid.appendChild(tile);
    });

    const form = root.querySelector('.new-profile'), err = form.querySelector('.form-err');
    form.onsubmit = async e => {
      e.preventDefault();
      err.hidden = true;
      try { await Store.create(form.querySelector('#pname').value); App.profileChanged(); location.hash = '#/'; }
      catch (x) { err.textContent = x.message; err.hidden = false; }
    };
    if (!list.length) form.querySelector('#pname').focus();
  }
  return { route };
})();
