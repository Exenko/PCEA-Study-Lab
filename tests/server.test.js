const assert = require('assert');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');
const http = require('http');
const ROOT = path.join(__dirname, '..');

function req(port, method, p, body) {
  return new Promise((resolve, reject) => {
    const r = http.request({ host: '127.0.0.1', port, method, path: p, headers: body ? { 'Content-Type': 'application/json' } : {} }, res => {
      let s = ''; res.on('data', c => s += c); res.on('end', () => resolve({ status: res.statusCode, body: s ? JSON.parse(s) : null }));
    });
    r.on('error', reject); if (body) r.write(JSON.stringify(body)); r.end();
  });
}
async function withServer(fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pcea-'));
  const port = 18000 + Math.floor(Math.random() * 1000);
  const p = spawn(process.execPath, ['server.js', '--no-open', '--local-only', '--port', String(port)], { cwd: ROOT, env: Object.assign({}, process.env, { PCEA_PROFILES: dir }) });
  try {
    for (let i = 0; i < 50; i++) { try { await req(port, 'GET', '/api/ping'); break; } catch (e) { await new Promise(r => setTimeout(r, 100)); } }
    await fn(port);
  } finally { p.kill(); fs.rmSync(dir, { recursive: true, force: true }); }
}

module.exports = [
  ['catalog loads all modules', () => {
    const cat = require('../server.js').loadCatalog();
    assert.strictEqual(cat.modules.length, 16);
    assert.ok(cat.modules[0].cards.length > 10 && cat.modules[0].sections[0].startsWith('m01/'));
  }],
  ['leaderboard lists only opted-in profiles, by xp', () => withServer(async port => {
    const now = Date.now();
    await req(port, 'POST', '/api/profiles/Ann', { settings: { leaderboard: true }, meta: { settings: now }, sections: { 'm01/definition': { done: true, mod: now } } });
    await req(port, 'POST', '/api/profiles/Bob', { settings: { leaderboard: false }, meta: { settings: now } });
    await req(port, 'POST', '/api/profiles/Cy', { settings: { leaderboard: true }, meta: { settings: now } });
    const r = await req(port, 'GET', '/api/leaderboard');
    assert.strictEqual(r.status, 200);
    assert.deepStrictEqual(r.body.map(x => x.name), ['Ann', 'Cy']);
    assert.strictEqual(r.body[0].xp, 50);
    assert.strictEqual(r.body[0].rank, 'Intern');
    assert.deepStrictEqual(Object.keys(r.body[0]).sort(), ['name', 'rank', 'streak', 'xp']);
  })]
];
