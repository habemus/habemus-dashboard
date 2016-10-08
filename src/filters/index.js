module.exports = function (DASHBOARD) {
  DASHBOARD.filter('urlWebsiteHabemusDomain', function(auxUrls) {
    return function(projectCode, versionCode) {
      return projectCode ? auxUrls.format.websiteHabemusDomain(projectCode, versionCode) : '';
    };
  });

  DASHBOARD.filter('urlWorkspace', function (auxUrls) {
    return function (projectCode) {
      return projectCode ? auxUrls.format.workspace(projectCode) : '';
    }
  });
};
