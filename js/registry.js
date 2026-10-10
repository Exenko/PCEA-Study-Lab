// Content files call PCEA.addModule({...}). Cards use a line format:
//   ## Tag name      -> sets the section tag for following cards
//   Q: question      -> starts a card (may continue on following lines)
//   A: answer        -> answer (may continue on following lines)
//   R: yes           -> card also makes sense answer-first (reverse study)
window.PCEA = {
  modules: [],
  addModule(m) {
    m.cardList = parseCards(m.id, m.cards || '');
    this.modules.push(m);
    this.modules.sort((a, b) => a.num - b.num);
  },
  module(id) { return this.modules.find(m => m.id === id); },
  allCards() { return this.modules.flatMap(m => m.cardList); }
};

function hashStr(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

function parseCards(modId, text) {
  const cards = [];
  let tag = 'General', cur = null, field = null;
  const push = () => {
    if (cur && cur.q && cur.a) {
      cur.q = cur.q.trim(); cur.a = cur.a.trim();
      cur.id = modId + '-' + hashStr(cur.q);
      cards.push(cur);
    }
    cur = null; field = null;
  };
  for (const raw of text.split('\n')) {
    const line = raw.replace(/\s+$/, '');
    if (/^##\s+/.test(line)) { push(); tag = line.replace(/^##\s+/, '').trim(); continue; }
    if (/^Q:\s?/.test(line)) { push(); cur = { module: modId, tag, q: line.replace(/^Q:\s?/, ''), a: '' }; field = 'q'; continue; }
    if (/^R:\s*yes$/i.test(line) && cur) { cur.rev = true; field = null; continue; }
    if (/^A:\s?/.test(line) && cur) { cur.a = line.replace(/^A:\s?/, ''); field = 'a'; continue; }
    if (cur && field) cur[field] += '\n' + line.trim();
  }
  push();
  return cards;
}
