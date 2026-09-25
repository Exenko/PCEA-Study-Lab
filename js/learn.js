const Learn = (() => {
  const E = Render.el;
  const secKey = (m, s) => m.id + '/' + s.id;
  const secState = (m, s) => Store.data.sections[secKey(m, s)] || {};

  function moduleProgress(m) {
    const done = m.sections.filter(s => secState(m, s).done).length;
    return { done, total: m.sections.length };
  }
  function cardCounts(m) {
    const c = m.cardList;
    return {
      total: c.length,
      due: c.filter(x => Scheduler.isDue(x.id)).length,
      fresh: c.filter(x => Scheduler.isNew(x.id)).length,
      mastered: c.filter(x => ['strong', 'mastered'].includes(Scheduler.status(x.id).key)).length
    };
  }
  const sourceBadge = m => m.source === 'guide'
    ? '<span class="badge src-guide" title="Built from the detailed notes in your study guide">From your guide</span>'
    : '<span class="badge src-auth" title="Your guide only has an outline for this module. Explanations were written from general CEBoK knowledge; check them against your course material.">Outline expanded &middot; verify</span>';

  // ---------- overview ----------
  function overview(root) {
    const all = PCEA.allCards();
    const due = all.filter(c => Scheduler.isDue(c.id)).length;
    const last = Store.data.lastSection;
    const lm = last && PCEA.module(last.m);
    const ls = lm && lm.sections.find(s => s.id === last.s);

    // Calculate stats for stat strip
    let secsDone = 0, secsTotal = 0;
    PCEA.modules.forEach(m => {
      secsTotal += m.sections.length;
      secsDone += m.sections.filter(s => secState(m, s).done).length;
    });

    root.innerHTML = `
      <section class="hero">
        <div>
          <h1>PCEA Study Lab</h1>
          <p>Work through each module like a textbook: short steps, questions to check yourself, and things to play with. When you're ready, drill flashcards from whichever modules you pick.</p>
          <div class="hero-actions">
            ${ls ? `<a class="btn" href="#/learn/${lm.id}/${ls.id}">Continue: ${lm.short || lm.title} &rsaquo; ${ls.title}</a>` : `<a class="btn" href="#/learn/${PCEA.modules[0].id}">Start with Module 1</a>`}
            <a class="btn ghost" href="#/cards">${due ? due + ' cards due' : 'Flashcards'}</a>
          </div>
          <div class="hero-stats">
            <div class="stat-tile">
              <b>${PCEA.modules.length}</b>
              <span>Modules</span>
            </div>
            <div class="stat-tile">
              <b>${secsDone}/${secsTotal}</b>
              <span>Sections Done</span>
            </div>
            <div class="stat-tile">
              <b>${due}</b>
              <span>Cards Due</span>
            </div>
          </div>
        </div>
      </section>
      <div class="mod-grid"></div>`;
    const grid = root.querySelector('.mod-grid');
    PCEA.modules.forEach(m => {
      const p = moduleProgress(m), cc = cardCounts(m);
      const a = E('a', 'mod-card' + (m.source === 'guide' ? ' rich' : ''));
      a.href = '#/learn/' + m.id;
      a.innerHTML = `
        <div class="mod-num">Module ${m.num}</div>
        <h3>${m.title}</h3>
        <p>${m.blurb || ''}</p>
        <div class="mod-meta">${sourceBadge(m)}</div>
        <div class="meter"><i style="width:${p.total ? p.done / p.total * 100 : 0}%"></i></div>
        <div class="mod-foot"><span>${p.done}/${p.total} sections</span><span>${cc.total} cards${cc.due ? ' &middot; <b>' + cc.due + ' due</b>' : ''}</span></div>`;
      grid.appendChild(a);
    });
  }

  // ---------- sidebar ----------
  function sidebar(cur, curSec) {
    const nav = E('nav', 'side');
    PCEA.modules.forEach(m => {
      const p = moduleProgress(m);
      const g = E('div', 'side-mod' + (m === cur ? ' open' : ''));
      g.innerHTML = `<a class="side-mod-link" href="#/learn/${m.id}"><span class="n">${m.num}</span><span class="t">${m.short || m.title}</span><span class="c">${p.done}/${p.total}</span></a>`;
      if (m === cur) {
        const ul = E('div', 'side-secs');
        m.sections.forEach(s => {
          const st = secState(m, s);
          ul.innerHTML += `<a href="#/learn/${m.id}/${s.id}" class="${s === curSec ? 'active' : ''} ${st.done ? 'done' : ''}"><i></i>${s.title}</a>`;
        });
        g.appendChild(ul);
      }
      nav.appendChild(g);
    });
    return nav;
  }

  // ---------- module page ----------
  function modulePage(root, m) {
    const layout = E('div', 'learn-layout');
    layout.appendChild(sidebar(m, null));
    const main = E('article', 'reader');
    const cc = cardCounts(m);
    main.innerHTML = `
      <div class="crumbs"><a href="#/learn">Modules</a> &rsaquo; Module ${m.num}</div>
      <h1>${m.title}</h1>
      <div class="mod-meta">${sourceBadge(m)}</div>
      <div class="prose">${Render.md(m.intro || m.blurb || '')}</div>
      <h2>Sections</h2>
      <ol class="sec-list">${m.sections.map(s => `<li class="${secState(m, s).done ? 'done' : ''}"><a href="#/learn/${m.id}/${s.id}"><b>${s.title}</b><span>${s.summary || ''}</span></a></li>`).join('')}</ol>
      <div class="study-box">
        <div><b>${cc.total} flashcards</b> in this module &middot; ${cc.fresh} new &middot; ${cc.due} due &middot; ${cc.mastered} strong</div>
        <a class="btn" href="#/cards?m=${m.id}">Study this module's cards</a>
      </div>`;
    layout.appendChild(main);
    root.appendChild(layout);
  }

  // ---------- section reader ----------
  function sectionPage(root, m, s) {
    Store.data.lastSection = { m: m.id, s: s.id }; Store.save();
    const layout = E('div', 'learn-layout');
    layout.appendChild(sidebar(m, s));
    const main = E('article', 'reader');
    const idx = m.sections.indexOf(s);
    const prev = m.sections[idx - 1], next = m.sections[idx + 1];
    const nextMod = PCEA.modules[PCEA.modules.indexOf(m) + 1];
    const stepMode = Store.settings.stepMode;
    main.innerHTML = `
      <div class="crumbs"><a href="#/learn">Modules</a> &rsaquo; <a href="#/learn/${m.id}">Module ${m.num}: ${m.short || m.title}</a></div>
      <div class="reader-head">
        <h1>${s.title}</h1>
        <div class="seg" role="group" aria-label="Reading mode">
          <button data-mode="step" class="${stepMode ? 'on' : ''}">Step by step</button>
          <button data-mode="page" class="${!stepMode ? 'on' : ''}">Full page</button>
        </div>
      </div>`;
    const key = secKey(m, s);
    const stepsWrap = E('div', 'steps');
    main.appendChild(stepsWrap);
    const ctl = E('div', 'step-ctl');
    main.appendChild(ctl);
    const foot = E('div', 'reader-foot');
    foot.innerHTML = `
      ${prev ? `<a class="btn ghost" href="#/learn/${m.id}/${prev.id}">&lsaquo; ${prev.title}</a>` : '<span></span>'}
      ${next ? `<a class="btn ghost" href="#/learn/${m.id}/${next.id}">${next.title} &rsaquo;</a>`
        : nextMod ? `<a class="btn ghost" href="#/learn/${nextMod.id}">Module ${nextMod.num} &rsaquo;</a>` : '<span></span>'}`;
    main.appendChild(foot);

    const ctx = { key, onChange: update };
    const steps = Render.section(s.body, ctx);
    let shown = stepMode ? Math.max(1, Math.min(steps.length, (Store.data.sections[key] || {}).step || 1)) : steps.length;
    steps.forEach((st, i) => { st.hidden = i >= shown; stepsWrap.appendChild(st); });

    function pending(st) {
      return [...st.querySelectorAll('.check')].filter(c => !c.classList.contains('done')).length;
    }
    function markDone() {
      const st = Store.data.sections[key] = Store.data.sections[key] || {};
      if (!st.done) { st.done = true; st.at = Date.now(); Store.markActive(); Store.save(); refreshSide(); }
    }
    function refreshSide() {
      const old = layout.querySelector('.side');
      old.replaceWith(sidebar(m, s));
    }
    function update() {
      ctl.innerHTML = '';
      if (!Store.settings.stepMode) {
        const b = E('button', 'btn', secState(m, s).done ? 'Section complete ✓' : 'Mark section complete');
        b.onclick = () => { markDone(); update(); };
        ctl.appendChild(b);
        return;
      }
      const cur = steps[shown - 1];
      const blocking = pending(cur);
      const bar = E('div', 'step-bar', `<i style="width:${shown / steps.length * 100}%"></i>`);
      ctl.appendChild(bar);
      if (shown < steps.length) {
        const b = E('button', 'btn', blocking ? 'Answer the question to continue' : 'Continue');
        b.disabled = !!blocking;
        b.onclick = () => {
          steps[shown].hidden = false; steps[shown].classList.add('reveal');
          shown++;
          const st = Store.data.sections[key] = Store.data.sections[key] || {};
          st.step = Math.max(st.step || 0, shown); Store.save();
          update();
          steps[shown - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
        ctl.appendChild(b);
        ctl.appendChild(E('span', 'step-count', `Step ${shown} of ${steps.length}`));
      } else if (!blocking) {
        markDone();
        const msg = E('div', 'step-done', `<b>Section complete.</b> ${next ? 'Next up: ' + next.title + '.' : 'That was the last section in this module.'}`);
        ctl.appendChild(msg);
        const go = E('a', 'btn');
        if (next) { go.href = `#/learn/${m.id}/${next.id}`; go.textContent = 'Next section'; }
        else { go.href = `#/cards?m=${m.id}`; go.textContent = 'Drill this module\'s flashcards'; }
        ctl.appendChild(go);
      } else {
        ctl.appendChild(E('span', 'step-count', 'Answer the question above to finish the section.'));
      }
    }
    main.querySelectorAll('.seg button').forEach(b => b.onclick = () => {
      Store.settings.stepMode = b.dataset.mode === 'step'; Store.save();
      App.render();
    });
    update();
    layout.appendChild(main);
    root.appendChild(layout);
    window.scrollTo(0, 0);
  }

  function route(root, parts) {
    const m = parts[0] && PCEA.module(parts[0]);
    if (!m) return overview(root);
    const s = parts[1] && m.sections.find(x => x.id === parts[1]);
    if (!s) return modulePage(root, m);
    sectionPage(root, m, s);
  }

  return { route, overview, cardCounts, moduleProgress };
})();
