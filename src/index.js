'use strict';

var path = require('path');
var fs   = require('fs');

var aux  = require('./lib/auxiliary');

/**
 * Globals: angular
 */
var DASHBOARD = angular.module('habemus-dashboard', [
  'ngSanitize',
  'ngCookies',
  'pascalprecht.translate',
  'ui.router',
  'ngDialog',
  'angular-clipboard',
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
 * Filters
 */
require('./filters')(DASHBOARD);

/**
 * Controllers
 */

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
  $translateProvider.translations('pt', require('./resources/languages/pt.json'));
  
  $translateProvider.registerAvailableLanguageKeys(['en', 'pt'], {
    'en_US': 'en',
    'pt_BR': 'pt'
  });
  
  $translateProvider.determinePreferredLanguage('en');
  $translateProvider.fallbackLanguage('en');
  
});

DASHBOARD.controller('ApplicationCtrl', require('./application-ctrl'));


/**
 * Directives
 */
require('./directives/file-drop/file-drop')(DASHBOARD);
require('./directives/file-change/file-change')(DASHBOARD);
require('./directives/svg-icon')(DASHBOARD);

// http://stackoverflow.com/questions/16310298/if-a-ngsrc-path-resolves-to-a-404-is-there-a-way-to-fallback-to-a-default
DASHBOARD.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });

      attrs.$observe('ngSrc', function(value) {
        if (!value && attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
});
