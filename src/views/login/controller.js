'use strict';

module.exports = /*@ngInject*/ function LoginCtrl($scope, $stateParams, $state, auth) {
  $scope.username = '';
  $scope.password = '';

  $scope.logIn = function (user) {

    auth.logIn(user.username, user.password)
      .then(function () {
        $state.go('dashboard');
      })
      .fail(function () {
        alert('login failed, check your credentials');
      });
  };
};