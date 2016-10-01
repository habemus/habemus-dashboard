const HProjectClient = require('h-project/client');

module.exports = /* @ngInject */ function (CONFIG) {
  return new HProjectClient({
    serverURI: CONFIG.hProjectURI,
  });
}
