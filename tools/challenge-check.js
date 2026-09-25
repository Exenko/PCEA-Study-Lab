// Runs tools/challenge-check.html in headless Edge/Chrome and prints its report. Set BROWSER to override.
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const candidates = [
  process.env.BROWSER,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'
].filter(Boolean);
const exe = candidates.find(p => fs.existsSync(p));
if (!exe) { console.log('No Edge or Chrome found; set BROWSER to a Chromium-based browser.'); process.exit(2); }
const url = 'file:///' + path.join(__dirname, 'challenge-check.html').replace(/\\/g, '/').replace(/^\/+/, '');
const r = spawnSync(exe, ['--headless=new', '--disable-gpu', '--no-first-run', '--dump-dom', url], { encoding: 'utf8', maxBuffer: 1 << 26, timeout: 180000 });
const m = (r.stdout || '').match(/<pre id="out">([\s\S]*?)<\/pre>/);
if (!m) { console.log('No report in page output.', r.error || '', r.stderr || ''); process.exit(2); }
const txt = m[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
console.log(txt);
process.exit(/SUMMARY ALL PASSED/.test(txt) ? 0 : 1);
