'use strict';

var path = require('path');
var fs   = require('fs');
/**
 * Globals: angular
 */
var DASHBOARD = angular.module('habemus-dashboard', [
  'ngSanitize',
  'ngCookies',
  'pascalprecht.translate',
  'ui.router',
  'ngDialog',
  'ui.bootstrap',
  'file-model',
]);

/**
 * Configurations
 */
DASHBOARD.constant('CONFIG', require('./config'));

/**
 * Constants
 */
DASHBOARD.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
});

/**
 * Define routes
 */
require('./routes/index')(DASHBOARD);
require('./routes/project-domain')(DASHBOARD);

/**
 * Services
 */
require('./services')(DASHBOARD);

/**
 * Controllers
 */
require('./views/templates')(DASHBOARD);

DASHBOARD.config(function ($translateProvider) {
  $translateProvider.useStaticFilesLoader({
    prefix: 'resources/languages/',
    suffix: '.json'
  });

  // enable it so that missing translations are logged
  $translateProvider.useMissingTranslationHandlerLog();

  $translateProvider.useSanitizeValueStrategy('escape');
  $translateProvider.useLocalStorage();

  $translateProvider.translations('en', require('./resources/languages/en.json'));
  
  $translateProvider.registerAvailableLanguageKeys(['en', 'pt'], {
    'en_US': 'en',
    'pt_BR': 'pt'
  });
  
  $translateProvider.determinePreferredLanguage('en');
  $translateProvider.fallbackLanguage('en');
  
});

// verify authentication on statechange
DASHBOARD.run(function ($rootScope, $state, $location, AUTH_EVENTS, auth, authModal, ngDialog) {

  window.auth = auth;

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

    if (toState.data && toState.data.authorizedRoles) {
      var authorizedRoles = toState.data.authorizedRoles;

      if (!auth.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        if (auth.isAuthenticated()) {
          // user is not allowed
          $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
        } else {

          auth.handleSessionReset();

          // user is not logged in
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        }
      }
    }

    // no authorization config set, thus simply continue
  });
});

DASHBOARD.controller('ApplicationCtrl', require('./application-ctrl'));


/**
 * Directives
 */
// require('./directives/file-navigator/file-navigator')(DASHBOARD);
require('./directives/file-drop/file-drop')(DASHBOARD);