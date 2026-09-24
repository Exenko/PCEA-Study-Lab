// Progress storage, one record per profile.
// Server mode (app opened through server.js): each profile is profiles/<name>.json on the host,
//   shared by every device that connects. A copy is cached in the browser until the server confirms the save.
// Local mode (index.html opened directly): profiles live in this browser's localStorage.
// Records carry a "mod" timestamp so edits from several devices merge (newest record wins).
const Store = (() => {
  const LEGACY = 'pcea-study-lab.v1', CUR = 'pcea.currentProfile', LOCAL = 'pcea.profile:', CACHE = 'pcea.cache:';
  const PARTS = ['cards', 'checks', 'sections', 'days', 'shop'], SINGLES = ['settings', 'deck', 'lastSection'];
  const NAME_RE = /^[A-Za-z0-9](?:[A-Za-z0-9 _-]{0,38}[A-Za-z0-9])?$/;
  const RESERVED = /^(con|prn|aux|nul|com\d|lpt\d)$/i;

  const ls = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } },
    keys() { try { return Object.keys(localStorage); } catch (e) { return []; } }
  };

  function defaults() {
    return {
      v: 2, cards: {}, checks: {}, sections: {}, days: {}, shop: {},
      settings: { hitsToLevel: 2, newPerSession: 20, stepMode: true, theme: null, leaderboard: false, firmName: null, seenAch: null },
      deck: null, lastSection: null, meta: {}, resets: {}
    };
  }
  function normalize(d) {
    d = Object.assign(defaults(), d || {});
    d.settings = Object.assign(defaults().settings, d.settings || {});
    ['meta', 'resets', ...PARTS].forEach(k => { if (!d[k] || typeof d[k] !== 'object') d[k] = {}; });
    return JSON.parse(JSON.stringify(d));
  }
  // Same rules as merge() in server.js. On ties b wins.
  function merge(a, b) {
    a = normalize(a); b = normalize(b);
    const o = defaults();
    for (const p of PARTS) {
      const r = Math.max(a.resets[p] || 0, b.resets[p] || 0);
      if (r) o.resets[p] = r;
      for (const k of new Set([...Object.keys(a[p]), ...Object.keys(b[p])])) {
        const x = a[p][k], y = b[p][k];
        const pick = !x ? y : !y ? x : ((y.mod || 0) >= (x.mod || 0) ? y : x);
        if ((pick.mod || 0) >= r) o[p][k] = pick;
      }
    }
    for (const k of SINGLES) {
      const ta = a.meta[k] || 0, tb = b.meta[k] || 0;
      o[k] = tb >= ta ? b[k] : a[k];
      o.meta[k] = Math.max(ta, tb);
    }
    o.settings = Object.assign(defaults().settings, o.settings || {});
    return o;
  }
  const withoutMod = r => { const c = Object.assign({}, r); delete c.mod; return JSON.stringify(c); };
  const pad = n => String(n).padStart(2, '0');
  const dayKey = t => { const d = new Date(t); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  const studied = d => Object.values((d && d.cards) || {}).filter(c => c && c.seen).length;
  const lastUsed = d => Math.max(0, ...Object.values((d && d.meta) || {}), ...PARTS.flatMap(p => Object.values((d && d[p]) || {}).map(r => (r && r.mod) || 0)));

  const S = {
    data: defaults(), profile: null, mode: 'local', status: '', onStatus: null, onSave: null,
    snap: {}, timer: null, retry: null, busy: false, again: false,
    merge, normalize,
    get settings() { return this.data.settings; },

    async init() {
      if (location.protocol.startsWith('http')) {
        try { const r = await this.api('GET', 'ping'); if (r && r.app === 'pcea-study-lab') this.mode = 'server'; } catch (e) { /* no server */ }
      }
      if (this.mode === 'local') this.migrateLegacy();
      const cur = ls.get(CUR);
      if (cur) { try { await this.open(cur); } catch (e) { this.profile = null; } }
      if (this.mode === 'server') {
        document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') this.pull(); });
      }
    },
    migrateLegacy() {
      const old = ls.get(LEGACY);
      if (old && !ls.keys().some(k => k.startsWith(LOCAL))) { ls.set(LOCAL + 'Me', old); ls.set(CUR, 'Me'); }
    },
    async api(method, path, body) {
      const r = await fetch('api/' + path, {
        method, cache: 'no-store',
        headers: body ? { 'Content-Type': 'application/json' } : {},
        body: body ? JSON.stringify(body) : undefined
      });
      const txt = await r.text();
      const j = txt ? JSON.parse(txt) : null;
      if (!r.ok) { const e = new Error((j && j.error) || ('HTTP ' + r.status)); e.status = r.status; throw e; }
      return j;
    },
    setStatus(s) { this.status = s; if (this.onStatus) this.onStatus(s); },
    checkName(name) {
      name = (name || '').trim();
      if (!NAME_RE.test(name) || RESERVED.test(name)) throw new Error('Use 1–40 letters, numbers, spaces, - or _ (must start and end with a letter or number).');
      return name;
    },

    async listProfiles() {
      if (this.mode === 'server') return this.api('GET', 'profiles');
      return ls.keys().filter(k => k.startsWith(LOCAL)).map(k => {
        let d = null; try { d = JSON.parse(ls.get(k)); } catch (e) { /* ignore */ }
        return { name: k.slice(LOCAL.length), studied: studied(d), updated: lastUsed(d) };
      });
    },
    async open(name) {
      let d;
      const cached = this.mode === 'server' ? ls.get(CACHE + name) : null;
      if (this.mode === 'server') {
        d = await this.api('GET', 'profiles/' + encodeURIComponent(name));
        if (cached) { try { d = merge(d, JSON.parse(cached)); } catch (e) { /* ignore bad cache */ } }
      } else {
        const raw = ls.get(LOCAL + name);
        if (raw == null) throw new Error('No such profile');
        d = JSON.parse(raw);
      }
      clearTimeout(this.timer);
      this.data = normalize(d);
      this.profile = name;
      ls.set(CUR, name);
      this.snap = {}; this.snapshotAll();
      this.setStatus(this.mode === 'server' ? 'saved' : '');
      if (cached) this.push();
    },
    async create(name) {
      name = this.checkName(name);
      const existing = (await this.listProfiles()).map(p => p.name.toLowerCase());
      if (existing.includes(name.toLowerCase())) throw new Error('A profile with that name already exists.');
      if (this.mode === 'server') await this.api('POST', 'profiles/' + encodeURIComponent(name), defaults());
      else ls.set(LOCAL + name, JSON.stringify(defaults()));
      await this.open(name);
    },
    async remove(name) {
      if (this.mode === 'server') await this.api('DELETE', 'profiles/' + encodeURIComponent(name));
      else ls.del(LOCAL + name);
      ls.del(CACHE + name);
      if (name === this.profile) { this.profile = null; this.data = defaults(); ls.del(CUR); }
    },
    signOut() { this.profile = null; this.data = defaults(); ls.del(CUR); },

    // Give changed records a fresh timestamp so merges can tell which copy is newer.
    stamp() {
      const now = Date.now(), d = this.data;
      for (const p of PARTS) {
        const sn = this.snap[p] || (this.snap[p] = {});
        for (const k in d[p]) { const j = withoutMod(d[p][k]); if (sn[k] !== j) { d[p][k].mod = now; sn[k] = j; } }
      }
      for (const k of SINGLES) { const j = JSON.stringify(d[k]); if (this.snap[k] !== j) { d.meta[k] = now; this.snap[k] = j; } }
    },
    snapshotAll() {
      const d = this.data;
      for (const p of PARTS) { this.snap[p] = {}; for (const k in d[p]) this.snap[p][k] = withoutMod(d[p][k]); }
      for (const k of SINGLES) this.snap[k] = JSON.stringify(d[k]);
    },
    save() {
      if (!this.profile) return;
      this.stamp();
      this.persist();
      if (this.onSave) this.onSave();
    },
    persist() {
      const j = JSON.stringify(this.data);
      if (this.mode === 'local') { ls.set(LOCAL + this.profile, j); return; }
      ls.set(CACHE + this.profile, j);
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.push(), 600);
      this.setStatus('saving');
    },
    async push() {
      if (this.mode !== 'server' || !this.profile) return;
      if (this.busy) { this.again = true; return; }
      this.busy = true;
      clearTimeout(this.retry);
      const name = this.profile;
      try {
        const res = await this.api('PUT', 'profiles/' + encodeURIComponent(name), this.data);
        if (name === this.profile) {
          Object.assign(this.data, merge(res, this.data));
          this.snapshotAll();
          if (!this.again) ls.del(CACHE + name);
          this.setStatus('saved');
        }
      } catch (e) {
        this.setStatus('offline');
        this.retry = setTimeout(() => this.push(), 5000);
      } finally {
        this.busy = false;
        if (this.again) { this.again = false; this.push(); }
      }
    },
    async pull() {
      if (this.mode !== 'server' || !this.profile || this.busy) return;
      try {
        const res = await this.api('GET', 'profiles/' + encodeURIComponent(this.profile));
        Object.assign(this.data, merge(res, this.data));
        this.snapshotAll();
      } catch (e) { /* stay on local copy */ }
    },

    exportJSON() { return JSON.stringify(this.data, null, 1); },
    // Replaces this profile's progress with the file's contents.
    importJSON(txt) {
      const d = JSON.parse(txt);
      if (!d || typeof d !== 'object' || !d.cards) throw new Error('Not a PCEA Study Lab export');
      const n = normalize(d), now = Date.now();
      for (const p of PARTS) { for (const k in n[p]) n[p][k].mod = now; n.resets[p] = now - 1; }
      for (const k of SINGLES) n.meta[k] = now;
      this.data = n;
      this.snapshotAll();
      this.persist();
    },
    // Marks today as a study day (streaks). Idempotent, so devices merge cleanly.
    markActive() { const k = dayKey(Date.now()); if (!this.data.days[k]) this.data.days[k] = { a: 1 }; },
    reset(part) {
      this.data[part] = {};
      this.data.resets[part] = Date.now();
      this.snap[part] = {};
      this.save();
    }
  };
  return S;
})();
