'use strict';

module.exports = function LoginCtrl($scope, $stateParams, $state, UserService) {
  console.log('LoginCtrl alive');

  $scope.username = '';
  $scope.password = '';

  $scope.logIn = function (user) {
    UserService
      .logIn(user.username, user.password)
      .then(function () {
        $state.go('dashboard');
      })
      .fail(function () {
        alert('login failed, check your credentials');
      });
  };
};