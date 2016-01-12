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
DASHBOARD.controller('ApplicationCtrl', function ApplicationCtrl($scope, auth, $rootScope, $state) {

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
  
  // history object to save the history
  var history = [];
  
  $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
    
    var last = {
      state: from,
      params: fromParams
    };

    // add to the history
    history.push(last);
  });
  
  $scope.goBack = function () {
    
    var last = history.pop();
    
    $state.go(last.state.name, last.params)
      .then(function () {
        // pop the last again so that the current state does not get into the history stack
        history.pop();
      });
  }
});


/**
 * Directives
 */
// require('./directives/file-navigator/file-navigator')(DASHBOARD);
require('./directives/file-drop/file-drop')(DASHBOARD);