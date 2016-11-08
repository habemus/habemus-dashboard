// third-party
const hUrls = require('h-urls');

module.exports = /* @ngInject */ function urls(CONFIG) {

  return hUrls({
    // hosts
    websiteHost: process.env.WEBSITE_HOST,

    /**
     * TODO: change name at h-urls
     * @type {[type]}
     */
    workspaceHost: process.env.WORKSPACE_HOST,
  });

};
