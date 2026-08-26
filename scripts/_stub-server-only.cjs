// server-only throws outside a Next server context by design. Neutralise it for node-run tests
// WITHOUT weakening the real guard in src/.
const Module = require('node:module');
const orig = Module._load;
Module._load = function (req, parent, isMain) {
  if (req === 'server-only') return {};
  return orig.apply(this, arguments);
};
