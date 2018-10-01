// third-party
const hUrls = require('habemus-urls');

module.exports = /* @ngInject */ function urls(CONFIG) {

  return hUrls({
    // hosts
    websiteHost: process.env.WEBSITE_HOST,

    // workspace base url
    uiWorkspaceBaseURL: process.env.UI_WORKSPACE_BASE_URL,
  });

};
