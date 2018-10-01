const HProjectClient = require('habemus-project-client');

module.exports = /* @ngInject */ function (CONFIG) {
  return new HProjectClient({
    serverURI: CONFIG.hProjectURI,
  });
};
