// Loads js/storage.js in a sandbox (as the browser would) and returns its Store object.
const fs = require('fs'), path = require('path'), vm = require('vm');
module.exports = function loadStore() {
  const ctx = { console, Date, Math, JSON, Object, Set, Array, Promise, setTimeout, clearTimeout,
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} }, location: { protocol: 'file:' }, document: { addEventListener() {} } };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', '..', 'js/storage.js'), 'utf8') + '\nthis.Store = Store;', ctx);
  return ctx.Store;
};
