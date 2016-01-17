var Parse                   = require('parse');
var HabemusAuthClient       = require('h-auth/client');
var HabemusProjectAPIClient = require('h-project-api/client');

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

  DASHBOARD.factory('zipper', require('./zipper'));

  DASHBOARD.factory('authModal', require('./auth-modal'));
  DASHBOARD.factory('betaPasswordResetModal', require('./beta-password-reset-modal'));
  DASHBOARD.factory('betaLoginModal', require('./beta-login-modal'));
};