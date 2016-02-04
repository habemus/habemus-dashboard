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
  
  DASHBOARD.factory('authModal', require('./auth-modal'));
  DASHBOARD.factory('betaPasswordResetModal', require('./beta-password-reset-modal'));
  DASHBOARD.factory('betaLoginModal', require('./beta-login-modal'));
  
  DASHBOARD.factory('intro', require('./intro'));

  DASHBOARD.factory('loadingDialog', require('./loading-dialog'));
  DASHBOARD.factory('confirmationDialog', require('./confirmation-dialog'));
  DASHBOARD.factory('errorDialog', require('./error-dialog'));
  DASHBOARD.factory('infoDialog', require('./info-dialog'));

  DASHBOARD.factory('zipPrepare', require('./zip-prepare'));
};