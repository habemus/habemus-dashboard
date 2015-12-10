'use strict';

module.exports = /*@ngInject*/ function LoginCtrl($scope, $stateParams, $state, auth) {

  $scope.logIn = function (user) {

    auth.logIn(user.username, user.password)
      .then(function () {
        $state.go('dashboard');
      })
      .fail(function () {
        alert('login failed, check your credentials');
      });
  };

  $scope.signUp = function (user) {
    auth.signUp(user.username, user.password, {
        email: user.email
      })
      .then(function () {
        $state.go('dashboard');
      })
      .fail(function () {
        alert('signup failed');
      });
  }
};