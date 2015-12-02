'use strict';


/**
 * Globals: angular
 */
var DASHBOARD = angular.module('habemus-dashboard', [
  'ui.router',
  'ui.tree',
  'ngDialog',
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
require('./routes')(DASHBOARD);

/**
 * Services
 */
require('./services')(DASHBOARD);

/**
 * Controllers
 */
require('./views/templates')(DASHBOARD);
DASHBOARD.controller('ApplicationCtrl', function ApplicationCtrl($scope, auth) {

  var currentUserModel = auth.getCurrentUser();

  if (currentUserModel) {

    currentUserModel.fetch()
      .then(function (user) {
        $scope.setCurrentUser(user.toJSON());
      });


    // $scope.currentUser = auth.current();
    $scope.isAuthorized = auth.isAuthorized;
  }

  auth.on('logIn', function () {
    auth.current()
      .fetch()
      .then(function (user) {
        $scope.setCurrentUser(user.toJSON());
      });
  });
  
  $scope.setCurrentUser = function (user) {
    $scope.currentUser = user;

    $scope.$apply();
  };
});


/**
 * Directives
 */
// require('./directives/file-navigator/file-navigator')(DASHBOARD);
require('./directives/file-drop/file-drop')(DASHBOARD);