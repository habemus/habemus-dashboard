var Parse                   = require('parse');
var HabemusAuthClient       = require('habemus-auth/client');
var HabemusProjectAPIClient = require('habemus-project-api/client');

module.exports = function (DASHBOARD) {
  DASHBOARD.factory('parse', function (CONFIG) {
    Parse.initialize(
      CONFIG.parse.applicationId,
      CONFIG.parse.javascriptKey
    );

    return Parse;
  });
  DASHBOARD.factory('auth', function (parse, CONFIG) {

    return new HabemusAuthClient({
      parse: parse
    });
  });

  DASHBOARD.factory('projectAPI', function (parse, auth, CONFIG) {

    return new HabemusProjectAPIClient({
      location: CONFIG.projectAPI.location,
      parse: parse,
      auth: auth,
    });
  });

};