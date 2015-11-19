'use strict';

var Parse = require('parse');

window.Parse = Parse;

/**
 * Globals: angular
 */
var DASHBOARD = angular.module('habemus-dashboard', [
  'ui.router',
  'ui.tree',
  'ngDialog',
  'flow',
]);

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
 * Config
 */
DASHBOARD.config(require('./config/sdks'));
DASHBOARD.config(require('./config/states'));

// verify authentication on statechange
DASHBOARD.run(function ($rootScope, $state, AUTH_EVENTS, userService) {
  $rootScope.$on('$stateChangeStart', function (event, next) {

    if (next.data && next.data.authorizedRoles) {
      var authorizedRoles = next.data.authorizedRoles;
      if (!userService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        if (userService.isAuthenticated()) {
          console.warn('not authorized');

          // user is not allowed
          $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
        } else {
          console.warn('not authenticated');

          $state.go('login')
          // user is not logged in
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        }
      }
    }

    // no authorization config set, thus simply continue
  });
  
});

// ng-flow
DASHBOARD.config(['flowFactoryProvider', function (flowFactoryProvider) {
  flowFactoryProvider.defaults = {

  };
  // You can also set default events:
  flowFactoryProvider.on('catchAll', function (event) {
    
  });
  // Can be used with different implementations of Flow.js
  // flowFactoryProvider.factory = fustyFlowFactory;
}]);

/**
 * Services
 */
DASHBOARD.factory('userService', require('./services/user'));
DASHBOARD.factory('projectService', require('./services/project'));

/**
 * Controllers
 */
DASHBOARD.controller('ApplicationCtrl', function ApplicationCtrl($scope, userService) {

  var currentUserModel = userService.current();

  if (currentUserModel) {

    currentUserModel.fetch()
      .then(function (user) {
        $scope.setCurrentUser(user.toJSON());
      });


    // $scope.currentUser = userService.current();
    $scope.isAuthorized = userService.isAuthorized;
  }

  userService.on('logIn', function () {
    userService.current()
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