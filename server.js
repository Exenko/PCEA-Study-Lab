// PCEA Study Lab server: serves the app and saves each profile's progress to profiles/<name>.json.
// Run with "npm start" (or "node server.js"). Options: --port 8765  --local-only  --no-open
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');
const vm = require('vm');
const Game = require('./js/game.js');

const ROOT = __dirname;
const PROFILES = process.env.PCEA_PROFILES ? path.resolve(process.env.PCEA_PROFILES) : path.join(ROOT, 'profiles');
const PARTS = ['cards', 'checks', 'sections', 'days', 'shop', 'primers'], SINGLES = ['settings', 'deck', 'lastSection', 'seenAch'];
const NAME_RE = /^[A-Za-z0-9](?:[A-Za-z0-9 _-]{0,38}[A-Za-z0-9])?$/;
const RESERVED = /^(con|prn|aux|nul|com\d|lpt\d)$/i;
const MAX_BODY = 20 * 1024 * 1024;
const BACKUP_DAYS = 14;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.md': 'text/markdown; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.ico': 'image/x-icon'
};

const args = process.argv.slice(2);
const argVal = (flag, def) => { const i = args.indexOf(flag); return i >= 0 && args[i + 1] ? args[i + 1] : def; };
const START_PORT = parseInt(argVal('--port', process.env.PORT || '8765'), 10);
const HOST = args.includes('--local-only') ? '127.0.0.1' : '0.0.0.0';

// ---- progress merge (same rules as merge() in js/storage.js; on ties b wins) ----
const obj = v => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
function merge(a, b) {
  a = obj(a); b = obj(b);
  const o = { v: 2, meta: {}, resets: {} };
  for (const p of PARTS) {
    const r = Math.max(obj(a.resets)[p] || 0, obj(b.resets)[p] || 0);
    if (r) o.resets[p] = r;
    const A = obj(a[p]), B = obj(b[p]), out = {};
    for (const k of new Set([...Object.keys(A), ...Object.keys(B)])) {
      const x = obj(A[k]), y = obj(B[k]);
      const pick = !(k in A) ? y : !(k in B) ? x : ((y.mod || 0) >= (x.mod || 0) ? y : x);
      if ((pick.mod || 0) >= r) out[k] = pick;
    }
    o[p] = out;
  }
  for (const k of SINGLES) {
    const ta = obj(a.meta)[k] || 0, tb = obj(b.meta)[k] || 0;
    o[k] = tb >= ta ? (b[k] === undefined ? null : b[k]) : (a[k] === undefined ? null : a[k]);
    o.meta[k] = Math.max(ta, tb);
  }
  {
    const ta = obj(a.meta).seenAch || 0, tb = obj(b.meta).seenAch || 0;
    o.seenAch = (!Array.isArray(a.seenAch) && !Array.isArray(b.seenAch)) ? null
      : [...new Set([...(Array.isArray(a.seenAch) ? a.seenAch : []), ...(Array.isArray(b.seenAch) ? b.seenAch : [])])].sort();
    o.meta.seenAch = Math.max(ta, tb);
  }
  return o;
}

// ---- profile files ----
const validName = n => typeof n === 'string' && NAME_RE.test(n) && !RESERVED.test(n);
const fileOf = n => path.join(PROFILES, n + '.json');
function readProfile(name) {
  try { return JSON.parse(fs.readFileSync(fileOf(name), 'utf8')); }
  catch (e) { if (e.code === 'ENOENT') return null; throw e; }
}
function findName(name) {
  // Match an existing profile case-insensitively so "mike" and "Mike" are the same person on every OS.
  if (!fs.existsSync(PROFILES)) return null;
  const hit = fs.readdirSync(PROFILES).find(f => f.toLowerCase() === (name + '.json').toLowerCase());
  return hit ? hit.slice(0, -5) : null;
}
function backup(name) {
  const src = fileOf(name);
  if (!fs.existsSync(src)) return;
  const dir = path.join(PROFILES, '.backups', name);
  fs.mkdirSync(dir, { recursive: true });
  const day = new Date().toISOString().slice(0, 10);
  const dest = path.join(dir, day + '.json');
  if (!fs.existsSync(dest)) fs.copyFileSync(src, dest);
  fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort().reverse().slice(BACKUP_DAYS)
    .forEach(f => fs.unlinkSync(path.join(dir, f)));
}
function writeProfile(name, data) {
  fs.mkdirSync(PROFILES, { recursive: true });
  backup(name);
  const tmp = fileOf(name) + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data));
  fs.renameSync(tmp, fileOf(name));
}
function listProfiles() {
  if (!fs.existsSync(PROFILES)) return [];
  return fs.readdirSync(PROFILES).filter(f => f.endsWith('.json') && !f.startsWith('.')).map(f => {
    const name = f.slice(0, -5);
    let d = {}; try { d = JSON.parse(fs.readFileSync(path.join(PROFILES, f), 'utf8')); } catch (e) { /* unreadable */ }
    return {
      name,
      studied: Object.values(obj(d.cards)).filter(c => c && c.seen).length,
      updated: fs.statSync(path.join(PROFILES, f)).mtimeMs
    };
  });
}

// ---- leaderboard ----
let catalog = null;
function loadCatalog() {
  if (catalog) return catalog;
  const ctx = { console };
  ctx.window = ctx;
  vm.createContext(ctx);
  const files = ['js/registry.js'].concat(fs.readdirSync(path.join(ROOT, 'content')).filter(f => /^m\d+\.js$/.test(f)).sort().map(f => 'content/' + f));
  files.forEach(f => vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f }));
  catalog = { modules: ctx.PCEA.modules.map(m => ({ id: m.id, cards: m.cardList.map(c => c.id), sections: m.sections.map(s => m.id + '/' + s.id) })) };
  return catalog;
}
function leaderboard() {
  if (!fs.existsSync(PROFILES)) return [];
  const rows = [];
  for (const f of fs.readdirSync(PROFILES).filter(f => f.endsWith('.json') && !f.startsWith('.'))) {
    let d; try { d = JSON.parse(fs.readFileSync(path.join(PROFILES, f), 'utf8')); } catch (e) { continue; }
    if (!d || !d.settings || d.settings.leaderboard !== true) continue;
    const g = Game.compute(d, loadCatalog());
    rows.push({ name: f.slice(0, -5), rank: g.rank.name, xp: g.xp.total, streak: g.streak.current });
  }
  return rows.sort((a, b) => b.xp - a.xp || a.name.localeCompare(b.name));
}

// ---- http ----
function sendJSON(res, code, body) {
  const s = JSON.stringify(body);
  res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(s);
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > MAX_BODY) { reject(new Error('Body too large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => { try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : null); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}

async function api(req, res, parts) {
  const [what, rawName] = parts;
  if (what === 'ping' && req.method === 'GET') return sendJSON(res, 200, { app: 'pcea-study-lab', ok: true });
  if (what === 'leaderboard' && req.method === 'GET') return sendJSON(res, 200, leaderboard());
  if (what !== 'profiles') return sendJSON(res, 404, { error: 'Unknown endpoint' });
  if (!rawName) {
    if (req.method === 'GET') return sendJSON(res, 200, listProfiles());
    return sendJSON(res, 405, { error: 'Method not allowed' });
  }
  if (!validName(rawName)) return sendJSON(res, 400, { error: 'Invalid profile name' });
  const existing = findName(rawName);
  const name = existing || rawName;

  if (req.method === 'GET') {
    const d = existing && readProfile(name);
    return d ? sendJSON(res, 200, d) : sendJSON(res, 404, { error: 'No such profile' });
  }
  if (req.method === 'POST') {
    if (existing) return sendJSON(res, 409, { error: 'A profile with that name already exists.' });
    const body = await readBody(req);
    const d = merge({}, obj(body));
    writeProfile(name, d);
    return sendJSON(res, 201, d);
  }
  if (req.method === 'PUT') {
    const body = obj(await readBody(req));
    // Node is single-threaded and this read-merge-write is synchronous, so concurrent saves can't interleave.
    const merged = merge(existing ? readProfile(name) : {}, body);
    writeProfile(name, merged);
    return sendJSON(res, 200, merged);
  }
  if (req.method === 'DELETE') {
    if (!existing) return sendJSON(res, 404, { error: 'No such profile' });
    const trash = path.join(PROFILES, '.trash');
    fs.mkdirSync(trash, { recursive: true });
    fs.renameSync(fileOf(name), path.join(trash, `${name}-${Date.now()}.json`));
    return sendJSON(res, 200, { ok: true });
  }
  return sendJSON(res, 405, { error: 'Method not allowed' });
}

function serveStatic(req, res, urlPath) {
  let rel = decodeURIComponent(urlPath);
  if (rel === '/' || rel === '') rel = '/index.html';
  const file = path.normalize(path.join(ROOT, rel));
  const relPath = path.relative(ROOT, file);
  const top = relPath.split(path.sep)[0].toLowerCase();
  if (relPath.startsWith('..') || path.isAbsolute(relPath) || ['profiles', 'node_modules', '.git'].includes(top)) { res.writeHead(404); return res.end('Not found'); }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    fs.createReadStream(file).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  const urlPath = req.url.split('?')[0];
  try {
    if (urlPath.startsWith('/api/')) {
      const parts = urlPath.slice(5).split('/').filter(Boolean).map(decodeURIComponent);
      await api(req, res, parts);
    } else if (req.method === 'GET' || req.method === 'HEAD') serveStatic(req, res, urlPath);
    else { res.writeHead(405); res.end(); }
  } catch (e) {
    console.error('Error handling', req.method, urlPath, '-', e.message);
    if (!res.headersSent) sendJSON(res, 500, { error: e.message });
  }
});

function lanAddresses() {
  return Object.values(os.networkInterfaces()).flat()
    .filter(i => i && i.family === 'IPv4' && !i.internal).map(i => i.address);
}
function openBrowser(url) {
  const cmd = process.platform === 'win32' ? `start "" "${url}"` : process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`;
  exec(cmd, () => {});
}

function listen(port, triesLeft) {
  server.once('error', e => {
    if (e.code === 'EADDRINUSE' && triesLeft > 0) listen(port + 1, triesLeft - 1);
    else { console.error('Could not start server:', e.message); process.exit(1); }
  });
  server.listen(port, HOST, () => {
    const local = `http://localhost:${port}`;
    console.log('\nPCEA Study Lab is running.\n');
    console.log(`  On this computer:  ${local}`);
    if (HOST === '0.0.0.0') lanAddresses().forEach(ip => console.log(`  Other devices:     http://${ip}:${port}   (same Wi-Fi / network)`));
    console.log(`\n  Progress files:    ${PROFILES}`);
    console.log('\nLeave this window open while studying. Press Ctrl+C to stop.\n');
    if (!args.includes('--no-open')) openBrowser(local);
  });
}

if (require.main === module) listen(START_PORT, 10);
module.exports = { merge, loadCatalog };
