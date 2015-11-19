'use strict';

module.exports = function LoginCtrl($scope, $stateParams, $state, userService) {
  console.log('LoginCtrl alive');

  $scope.username = '';
  $scope.password = '';

  $scope.logIn = function (user) {
    userService
      .logIn(user.username, user.password)
      .then(function () {
        $state.go('dashboard');
      })
      .fail(function () {
        alert('login failed, check your credentials');
      });
  };
};