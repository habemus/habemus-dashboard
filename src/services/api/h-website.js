const HWebsiteClient = require('h-website-client');

module.exports = /* @ngInject */ function (CONFIG) {
  return new HWebsiteClient({
    serverURI: CONFIG.hWebsiteURI,
  });
};
