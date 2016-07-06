const HAuthClient = require('h-auth/client');

module.exports = /* @ngInject */ function (CONFIG) {
  return new HAuthClient({
    serverURI: CONFIG.hAuthURI
  });
};