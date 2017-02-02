// native
const url = require('url');

module.exports = function (DASHBOARD) {
  DASHBOARD.filter('urlWebsiteHabemusDomain', function(auxUrls) {
    return function(projectCode, versionCode) {
      return projectCode ? auxUrls.format.websiteHabemusDomain(projectCode, versionCode) : '';
    };
  });

  DASHBOARD.filter('urlWebsiteCustomDomain', function (auxUrls) {
    return function (domain) {
      return domain ? auxUrls.format.websiteCustomDomain(domain) : '';
    };
  });

  DASHBOARD.filter('urlWorkspace', function (auxUrls, $translate) {
    return function (projectCode) {
      if (!projectCode) {
        return '';
      } else {

        var uiWorkspaceURL = auxUrls.format.uiWorkspace(projectCode);

        // add the language query parameter:
        var parsed = url.parse(uiWorkspaceURL, true);
        // force url.format to use query object instead of the search
        delete parsed.search;
        parsed.query.lang = $translate.use();

        return url.format(parsed);
      }
    }
  });
};
