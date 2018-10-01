// third-party
const hUrls = require('habemus-urls/dev');

module.exports = /* @ngInject */ function urls(CONFIG) {

  return hUrls({
    // hosts
    websiteHost: process.env.WEBSITE_HOST,

    // development only:
    uiWorkspaceBaseURL: process.env.UI_WORKSPACE_BASE_URL,
    hWebsiteServerURI: process.env.H_WEBSITE_SERVER_URI,
  });

};
