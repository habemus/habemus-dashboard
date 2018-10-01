const HWorkspaceClient = require('habemus-workspace-client/public/authenticated');

module.exports = /* @ngInject */ function (CONFIG) {
  return new HWorkspaceClient({
    apiVersion: '0.0.0',
    serverURI: CONFIG.hWorkspaceURI,
  });
};
