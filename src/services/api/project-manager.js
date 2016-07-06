const HProjectManagerClient = require('h-project-manager/client');

module.exports = /* @ngInject */ function (CONFIG) {
  return new HProjectManagerClient({
    serverURI: CONFIG.hProjectManagerURI,
  });
}
