const App = (() => {
  const root = document.getElementById('app');
  const profileBtn = document.getElementById('profileBtn');

  function parse() {
    const h = location.hash.replace(/^#\/?/, '');
    const [path, qs] = h.split('?');
    const parts = path.split('/').filter(Boolean);
    const query = {};
    (qs || '').split('&').filter(Boolean).forEach(kv => { const [k, v] = kv.split('='); query[k] = decodeURIComponent(v || ''); });
    return { parts, query };
  }

  function render() {
    const { parts, query } = parse();
    let tab = parts[0] || 'learn';
    if (!Store.profile) tab = 'profiles';
    document.querySelectorAll('.tabs a').forEach(a => a.classList.toggle('on', a.dataset.tab === tab));
    root.innerHTML = '';
    if (tab === 'profiles') Profiles.route(root);
    else if (tab === 'cards') Cards.route(root, parts.slice(1), query);
    else if (tab === 'progress') Progress.route(root);
    else Learn.route(root, parts.slice(1));
  }

  function applyTheme() {
    const t = Store.settings.theme;
    if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme;
  }
  document.getElementById('themeBtn').onclick = () => {
    const dark = Store.settings.theme ? Store.settings.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    Store.settings.theme = dark ? 'light' : 'dark';
    Store.save(); applyTheme();
  };

  const STATUS = { saving: 'Saving…', saved: 'Saved', offline: 'Not saved: server unreachable, retrying' };
  function paintProfile() {
    profileBtn.hidden = !Store.profile;
    profileBtn.innerHTML = Store.profile
      ? `<span class="avatar">${Store.profile.slice(0, 1).toUpperCase()}</span><span class="pname">${Store.profile.replace(/</g, '&lt;')}</span><i class="sync ${Store.status}"></i>`
      : '';
    profileBtn.title = Store.profile ? `Switch profile${STATUS[Store.status] ? ' · ' + STATUS[Store.status] : ''}` : '';
  }
  Store.onStatus = paintProfile;
  function profileChanged() { applyTheme(); paintProfile(); }

  window.addEventListener('hashchange', render);
  window.addEventListener('beforeunload', e => { if (Store.status === 'saving' || Store.status === 'offline') { e.preventDefault(); e.returnValue = ''; } });
  applyTheme();
  Store.init().then(() => { profileChanged(); render(); });
  return { render, profileChanged };
})();
