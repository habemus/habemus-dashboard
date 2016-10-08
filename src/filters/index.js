module.exports = function (DASHBOARD) {
  DASHBOARD.filter('urlWebsiteHabemusDomain', function(auxUrls) {
    return function(projectCode) {

      if (!projectCode) {
        return ''
      } else {

        var url = auxUrls.format.websiteHabemusDomain(projectCode);
        console.log(url);

        return url;
      }
    };
  });
};
