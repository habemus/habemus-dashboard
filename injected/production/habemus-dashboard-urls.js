// third-party
const hUrls = require('h-urls');

module.exports = /* @ngInject */ function urls(CONFIG) {

  return hUrls({
    // hosts
    websiteHost: process.env.WEBSITE_HOST,
    uiWorkspaceURI: process.env.UI_WORKSPACE_URI,
  });

};
