const Cards = (() => {
  const E = Render.el;
  const G = Scheduler.G;
  let session = null, keyHandler = null;

  function deck() {
    if (!Store.data.deck) Store.data.deck = { on: {}, starred: false, weak: false };
    const d = Store.data.deck;
    if (!d.on) {
      d.on = {};
      PCEA.modules.forEach(m => { if ((d.mods || {})[m.id]) tagsOf(m).forEach(t => { if (!(d.off || {})[tagKey(m.id, t)]) d.on[tagKey(m.id, t)] = true; }); });
      delete d.mods; delete d.off;
    }
    return d;
  }
  const tagKey = (mid, tag) => mid + '|' + tag;
  function tagsOf(m) { return [...new Set(m.cardList.map(c => c.tag))]; }
  function setModule(m, on) { tagsOf(m).forEach(t => { if (on) deck().on[tagKey(m.id, t)] = true; else delete deck().on[tagKey(m.id, t)]; }); }

  function selected() {
    const d = deck();
    return PCEA.allCards().filter(c =>
      d.on[tagKey(c.module, c.tag)] &&
      (!d.starred || (Store.data.cards[c.id] || {}).star) &&
      (!d.weak || Scheduler.isWeak(c.id)));
  }

  // ---------- deck builder ----------
  function builder(root, query) {
    const d = deck();
    if (query.m) {
      const ids = query.m.split(',');
      d.on = {}; PCEA.modules.forEach(m => { if (ids.includes(m.id)) setModule(m, true); });
      Store.save(); history.replaceState(null, '', '#/cards');
    }

    root.innerHTML = `
      <div class="deck">
        <div class="deck-main">
          <div class="deck-head">
            <h1>Flashcards</h1>
            <div class="deck-quick">
              <button class="chip" data-q="all">All modules</button>
              <button class="chip" data-q="none">None</button>
              <button class="chip" data-q="due">Modules with cards due</button>
            </div>
          </div>
          <p class="muted">Tick the modules you want. Expand a module to include or exclude individual topics.</p>
          <div class="deck-list"></div>
        </div>
        <aside class="deck-side">
          <div class="panel">
            <div class="deck-sum"></div>
            <label class="tog"><input type="checkbox" id="fStar"> Starred cards only</label>
            <label class="tog"><input type="checkbox" id="fWeak"> Weak cards only</label>
            <label class="tog">Show first
              <select id="fDir">
                <option value="q">Term / question</option>
                <option value="a">Definition / answer</option>
                <option value="mix">Mix it up</option>
              </select></label>
            <p class="muted small">Only cards that work both ways are flipped; the rest stay question-first.</p>
            <div class="modes">
              <button class="mode" data-mode="smart"><b>Smart review</b><span>Cards that are due, plus new ones. Cards you miss come back in the same session.</span></button>
              <button class="mode" data-mode="practice"><b>Practice (weighted)</b><span>Goes on as long as you want. Weak cards come up most often, strong cards now and then.</span></button>
              <button class="mode" data-mode="browse"><b>Browse</b><span>Flip through the cards without grading them.</span></button>
            </div>
          </div>
          <details class="panel settings">
            <summary>Scheduling settings</summary>
            <label>Correct answers needed to level up
              <input type="number" id="sX" min="1" max="6" value="${Store.settings.hitsToLevel}"></label>
            <label>New cards per smart session
              <input type="number" id="sNew" min="1" max="200" value="${Store.settings.newPerSession}"></label>
            <p class="muted small">Levels wait ${Scheduler.INTERVALS.slice(1).map(x => x / 86400e3 + 'd').join(', ')} before a card comes back. A miss drops the card one level and it comes back later in the same session.</p>
          </details>
        </aside>
      </div>`;

    const list = root.querySelector('.deck-list');
    PCEA.modules.forEach(m => {
      const cc = Learn.cardCounts(m);
      const row = E('div', 'deck-mod');
      const tags = tagsOf(m);
      row.innerHTML = `
        <div class="deck-mod-row">
          <label><input type="checkbox" class="mchk"> <span class="n">${m.num}</span> ${m.title}</label>
          <span class="deck-stats">${cc.total} cards${cc.due ? ` &middot; <b>${cc.due} due</b>` : ''}${cc.fresh ? ` &middot; ${cc.fresh} new` : ''}</span>
          <button class="exp" title="Choose topics">${tags.length} topics &#9662;</button>
        </div>
        <div class="deck-tags" hidden>${tags.map(t => {
          const n = m.cardList.filter(c => c.tag === t).length;
          return `<label class="tag"><input type="checkbox" data-tag="${t.replace(/"/g, '&quot;')}" ${d.on[tagKey(m.id, t)] ? 'checked' : ''}> ${t} <em>${n}</em></label>`;
        }).join('')}</div>`;
      const tagBox = row.querySelector('.deck-tags'), mchk = row.querySelector('.mchk');
      const syncMod = () => {
        const n = tags.filter(t => deck().on[tagKey(m.id, t)]).length;
        mchk.checked = n === tags.length; mchk.indeterminate = n > 0 && n < tags.length;
      };
      syncMod();
      mchk.onchange = () => {
        setModule(m, mchk.checked);
        tagBox.querySelectorAll('input').forEach(i => i.checked = mchk.checked);
        Store.save(); syncMod(); summary();
      };
      row.querySelector('.exp').onclick = () => tagBox.hidden = !tagBox.hidden;
      tagBox.querySelectorAll('input').forEach(i => i.onchange = () => {
        const k = tagKey(m.id, i.dataset.tag);
        if (i.checked) deck().on[k] = true; else delete deck().on[k];
        Store.save(); syncMod(); summary();
      });
      list.appendChild(row);
    });

    root.querySelectorAll('[data-q]').forEach(b => b.onclick = () => {
      const q = b.dataset.q;
      PCEA.modules.forEach(m => setModule(m, q === 'all' ? true : q === 'none' ? false : Learn.cardCounts(m).due > 0));
      Store.save(); builder(root, {});
    });
    const fStar = root.querySelector('#fStar'), fWeak = root.querySelector('#fWeak');
    fStar.checked = d.starred; fWeak.checked = d.weak;
    fStar.onchange = () => { deck().starred = fStar.checked; Store.save(); summary(); };
    fWeak.onchange = () => { deck().weak = fWeak.checked; Store.save(); summary(); };
    const fDir = root.querySelector('#fDir');
    fDir.value = d.dir || 'q';
    fDir.onchange = () => { deck().dir = fDir.value; Store.save(); };
    root.querySelector('#sX').onchange = e => { Store.settings.hitsToLevel = Math.max(1, Math.min(6, +e.target.value || 2)); Store.save(); };
    root.querySelector('#sNew').onchange = e => { Store.settings.newPerSession = Math.max(1, +e.target.value || 20); Store.save(); summary(); };
    root.querySelectorAll('.mode').forEach(b => b.onclick = () => start(b.dataset.mode));

    function summary() {
      const s = selected();
      const due = s.filter(c => Scheduler.isDue(c.id)).length, fresh = s.filter(c => Scheduler.isNew(c.id)).length;
      const weak = s.filter(c => Scheduler.isWeak(c.id)).length;
      root.querySelector('.deck-sum').innerHTML = `
        <div class="big">${s.length}</div><div class="muted">cards selected</div>
        <div class="sum-row"><span><b>${due}</b> due</span><span><b>${fresh}</b> new</span><span><b>${weak}</b> weak</span></div>
        <div class="muted small">Smart review now: ${due + Math.min(fresh, Store.settings.newPerSession)} cards</div>`;
      root.querySelectorAll('.mode').forEach(b => b.disabled = !s.length);
    }
    summary();
  }

  function start(mode) {
    const cards = selected();
    if (!cards.length) return;
    if (mode === 'smart') session = Scheduler.smartSession(cards, Store.settings.newPerSession);
    else if (mode === 'practice') session = Scheduler.practiceSession(cards);
    else session = Scheduler.browseSession(cards, false);
    location.hash = '#/cards/study';
  }

  // ---------- study ----------
  function study(root) {
    if (!session) { location.hash = '#/cards'; return; }
    root.innerHTML = `
      <div class="study">
        <div class="study-top">
          <a href="#/cards" class="btn ghost small">&lsaquo; Deck</a>
          <div class="study-prog"><i></i></div>
          <span class="study-count"></span>
        </div>
        <div class="card-stage"></div>
        <div class="study-actions"></div>
        <p class="muted small keys"></p>
      </div>`;
    const stage = root.querySelector('.card-stage'), acts = root.querySelector('.study-actions');
    let flipped = false;

    function paint() {
      const c = session.current();
      if (!c) return finished();
      flipped = false;
      const m = PCEA.module(c.module), st = Scheduler.status(c.id), s = Scheduler.get(c.id) || {};
      const dir = deck().dir || 'q', rev = !!c.rev && (dir === 'a' || (dir === 'mix' && Math.random() < 0.5));
      const front = rev ? c.a : c.q, back = rev ? c.q : c.a;
      stage.innerHTML = `
        <div class="fcard" tabindex="0">
          <div class="face front">
            <div class="fmeta"><span>M${m.num} &middot; ${c.tag}</span><span class="lvl ${st.key}">${st.label}${s.lvl ? ' &middot; L' + s.lvl : ''}</span></div>
            <div class="fbody">${Render.md(front)}</div>
            <div class="fhint">Click or press Space to flip</div>
          </div>
          <div class="face back">
            <div class="fmeta"><span>${rev ? 'Term / question' : 'Answer'}</span><button class="star ${s.star ? 'on' : ''}" title="Star (S)">&#9733;</button></div>
            <div class="fbody">${Render.md(back)}</div>
          </div>
        </div>`;
      const card = stage.querySelector('.fcard');
      card.onclick = e => { if (e.target.closest('.star')) return; flip(); };
      stage.querySelector('.star').onclick = e => { e.stopPropagation(); toggleStar(c); };
      actions();
      progress();
    }
    function flip() {
      flipped = !flipped;
      stage.querySelector('.fcard').classList.toggle('flipped', flipped);
      actions();
    }
    function toggleStar(c) {
      const s = Store.data.cards[c.id] || (Store.data.cards[c.id] = { lvl: 0, hits: 0, seen: 0, right: 0, wrong: 0, due: 0, last: 0 });
      s.star = !s.star; Store.save();
      stage.querySelector('.star').classList.toggle('on', s.star);
    }
    function actions() {
      acts.innerHTML = '';
      if (session.mode === 'browse') {
        const p = E('button', 'btn ghost', '&lsaquo; Prev'), f = E('button', 'btn', flipped ? 'Show question' : 'Show answer'), n = E('button', 'btn ghost', 'Next &rsaquo;');
        p.onclick = () => { session.move(-1); paint(); }; n.onclick = () => { session.move(1); paint(); }; f.onclick = flip;
        acts.append(p, f, n);
        root.querySelector('.keys').textContent = 'Keys: Space flip, arrows prev/next, S star';
        return;
      }
      if (!flipped) {
        const f = E('button', 'btn wide', 'Show answer'); f.onclick = flip; acts.appendChild(f);
      } else {
        [['Missed it', G.MISSED, 'bad'], ['Shaky', G.SHAKY, 'mid'], ['Knew it', G.KNEW, 'good']].forEach(([t, g, cls], i) => {
          const b = E('button', 'grade ' + cls, `<b>${t}</b><span>${i + 1}</span>`);
          b.onclick = () => answer(g);
          acts.appendChild(b);
        });
      }
      root.querySelector('.keys').textContent = 'Keys: Space flip, 1 missed, 2 shaky, 3 knew it, S star';
    }
    function answer(g) { session.answer(g); paint(); }
    function progress() {
      const bar = root.querySelector('.study-prog i'), cnt = root.querySelector('.study-count');
      if (session.mode === 'browse') { bar.style.width = ((session.index + 1) / session.list.length * 100) + '%'; cnt.textContent = `${session.index + 1} / ${session.list.length}`; }
      else if (session.mode === 'smart') { bar.style.width = (session.progress * 100) + '%'; cnt.textContent = `${session.remaining} left`; }
      else { const t = session.tally; bar.style.width = '100%'; cnt.textContent = `${t[0] + t[1] + t[2]} answered`; }
    }
    function finished() {
      const t = session.tally || [0, 0, 0];
      stage.innerHTML = `<div class="done-card"><h2>${session.mode === 'smart' ? 'All caught up' : 'Done'}</h2>
        <p>${t[2]} knew &middot; ${t[1]} shaky &middot; ${t[0]} missed</p>
        <p class="muted">Cards you know well will be back in a few days. Want more reps? Practice mode keeps going and favors your weak cards.</p></div>`;
      acts.innerHTML = '';
      const p = E('button', 'btn', 'Keep practicing (weighted)'); p.onclick = () => start('practice');
      const b = E('a', 'btn ghost', 'Back to deck'); b.href = '#/cards';
      acts.append(p, b);
      root.querySelector('.study-prog i').style.width = '100%';
    }
    if (keyHandler) document.removeEventListener('keydown', keyHandler);
    const onKey = keyHandler = e => {
      if (!location.hash.startsWith('#/cards/study')) { document.removeEventListener('keydown', onKey); keyHandler = null; return; }
      if (e.target.matches('input, textarea, select')) return;
      const c = session.current(); if (!c) return;
      if (e.key === ' ') { e.preventDefault(); flip(); }
      else if (e.key === 's' || e.key === 'S') toggleStar(c);
      else if (session.mode === 'browse') { if (e.key === 'ArrowRight') { session.move(1); paint(); } if (e.key === 'ArrowLeft') { session.move(-1); paint(); } }
      else if (flipped && ['1', '2', '3'].includes(e.key)) answer(+e.key - 1);
    };
    document.addEventListener('keydown', onKey);
    paint();
  }

  function route(root, parts, query) {
    if (parts[0] === 'study') study(root);
    else builder(root, query);
  }
  return { route };
})();
