const HWebsiteClient = require('habemus-website-client');

module.exports = /* @ngInject */ function (CONFIG) {
  return new HWebsiteClient({
    serverURI: CONFIG.hWebsiteURI,
  });
};
