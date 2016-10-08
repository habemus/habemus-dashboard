// third-party
const hUrls = require('h-urls/dev');

module.exports = /* @ngInject */ function urls(CONFIG) {

  return hUrls({
    // hosts
    websiteHost: process.env.WEBSITE_HOST,

    // development only:
    uiWorkspaceURI: process.env.UI_WORKSPACE_URI,
    hWebsiteServerURI: process.env.H_WEBSITE_SERVER_URI,
  });

};
