'use strict';

var path = require('path');
var fs   = require('fs');

/**
 * Globals: angular
 */
var DASHBOARD = angular.module('habemus-dashboard', [
  'ui.router',
  'ui.tree',
  'ngDialog',
  'ui.bootstrap',
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

// verify authentication on statechange
DASHBOARD.run(function ($rootScope, $state, $location, AUTH_EVENTS, auth, authModal, ngDialog) {

  window.auth = auth;

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

    if (toState.data && toState.data.authorizedRoles) {
      var authorizedRoles = toState.data.authorizedRoles;

      if (!auth.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        if (auth.isAuthenticated()) {
          console.warn('not authorized');

          // user is not allowed
          $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
        } else {


          var betaData = $location.search().betaData;

          if (betaData) {
            // beta login (token based)
            ngDialog.open({
              template: fs.readFileSync(path.join(__dirname, 'views/beta-auth/template.html'), 'utf-8'),
              plain: true,
              className: 'ngdialog-theme-habemus',
              controller: require('./views/beta-auth/controller'),

              // prevent it from being closed by the user
              showClose: false,
              closeByEscape: false,
              closeByDocument: false,
            });
          } else {
            // normal login

            // open login modal and navigate to the desired state
            var dialog = authModal.open();

            dialog.closePromise.then(function () {
              $state.go(toState, toParams);
            });
            

          }
          // user is not logged in
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        }
      }
    }

    // no authorization config set, thus simply continue
  });

  // set page title
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    $rootScope.pageTitle = toState.data.pageTitle || 'habemus';
  });

});

DASHBOARD.controller('ApplicationCtrl', function ApplicationCtrl($scope, auth, $rootScope, $state, $timeout, authModal, betaPasswordResetModal) {

  var currentUserModel = auth.getCurrentUser();

  if (currentUserModel) {

    currentUserModel.fetch()
      .then(function (user) {
        $scope.setCurrentUser(user.toJSON());


        // check for beta users that need to change password
        if (user.toJSON().requirePasswordReset_) {
          console.log('reset')

          betaPasswordResetModal.open();
        }
      }, function (err) {

        if (err.code === auth._parse.Error.INVALID_SESSION_TOKEN) {
          auth._parse.User.logOut();
        }

        // couldn't fetch user,
        // probably logged out
        console.log('logged out');

        // open login modal and navigate to the desired state
        var dialog = authModal.open();
      });

    // $scope.currentUser = auth.current();
    $scope.isAuthorized = auth.isAuthorized;
  }

  auth.on('auth-status-change', function () {
    if (auth.getCurrentUser()) {
      // logged in
      auth.getCurrentUser()
        .fetch()
        .then(function (user) {
          $scope.setCurrentUser(user.toJSON());

          // check for beta users that need to change password
          if (user.toJSON().requirePasswordReset_) {
            console.log('reset')

            betaPasswordResetModal.open();
          }
        });
    } else {
      // logged out
      console.log('logged out')
    }
  });
  
  $scope.setCurrentUser = function (user) {
    $scope.currentUser = user;

    $scope.$apply();
  };

  ///////////////
  /// HISTORY ///
  
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
  };

  /// HISTORY ///
  ///////////////
  
  /////////////////
  /// AUTOFOCUS ///
  // tell Angular to call this function when a route change completes  
  $rootScope.$on('$stateChangeSuccess', function() {  
    // we can't set focus at this point; the DOM isn't ready for us  
  
    // instead, we define a callback to be called after the $digest loop  
    $timeout(function(){  
      // once this is executed, our input should be focusable, so find (with jQuery)  
      // whatever is on the page with the autofocus attribute and focus it; fin.  
      $('[autofocus]').focus();  
    });  
  });

});


/**
 * Directives
 */
// require('./directives/file-navigator/file-navigator')(DASHBOARD);
require('./directives/file-drop/file-drop')(DASHBOARD);