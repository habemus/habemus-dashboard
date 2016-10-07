const HWorkspaceClient = require('h-workspace-client/authenticated');

module.exports = /* @ngInject */ function (CONFIG) {

  console.log(CONFIG)

  return new HWorkspaceClient({
    apiVersion: '0.0.0',
    serverURI: CONFIG.hWorkspaceURI,
  });
};
