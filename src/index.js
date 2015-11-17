'use strict';

var Parse = require('parse');

/**
 * Globals: angular
 */
var DASHBOARD = angular.module('habemus-dashboard', ['ui.router']);

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
DASHBOARD.run(function ($rootScope, $state, AUTH_EVENTS, UserService) {
  $rootScope.$on('$stateChangeStart', function (event, next) {

    if (next.data && next.data.authorizedRoles) {
      var authorizedRoles = next.data.authorizedRoles;
      if (!UserService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        if (UserService.isAuthenticated()) {
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

/**
 * Services
 */
DASHBOARD.service('UserService', require('./services/user'));
DASHBOARD.service('Session', function () {
  this.create = function (sessionId, userId, userRole) {
    this.id = sessionId;
    this.userId = userId;
    this.userRole = userRole;
  };
  this.destroy = function () {
    this.id = null;
    this.userId = null;
    this.userRole = null;
  };
});

/**
 * Controllers
 */
DASHBOARD.controller('ApplicationCtrl', function ApplicationCtrl($scope, UserService) {

  var currentUserModel = UserService.current();

  if (currentUserModel) {

    currentUserModel.fetch()
      .then(function (user) {
        console.log(user.toJSON());
        $scope.setCurrentUser(user.toJSON());
      });


    // $scope.currentUser = UserService.current();
    $scope.isAuthorized = UserService.isAuthorized;
  }

  UserService.on('logIn', function () {
    UserService.current()
      .fetch()
      .then(function (user) {
        console.log(user.toJSON());
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