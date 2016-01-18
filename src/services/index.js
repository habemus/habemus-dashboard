var Parse                   = require('parse');
var HabemusAuthClient       = require('h-auth/client');
var HabemusProjectAPIClient = require('h-project-api/client');

module.exports = function (DASHBOARD) {
  DASHBOARD.factory('Parse', function (CONFIG) {
    Parse.initialize(
      CONFIG.parse.applicationId,
      CONFIG.parse.javascriptKey
    );

    return Parse;
  });
  DASHBOARD.factory('auth', function (Parse, CONFIG) {

    return new HabemusAuthClient({
      parse: Parse
    });
  });

  DASHBOARD.factory('projectAPI', function (Parse, auth, CONFIG) {

    return new HabemusProjectAPIClient({
      location: CONFIG.projectAPI.location,
      parse: Parse,
      auth: auth,
    });
  });

  DASHBOARD.factory('zipper', require('./zipper'));

};