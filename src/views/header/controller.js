'use strict';

module.exports = function HeaderCtrl($scope, $stateParams, $state, UserService) {

  console.log('HeaderCtrl alive');

  $scope.logOut = function () {
    UserService
      .logOut()
      .then(function () {
        $state.go('login');
      });
  };
};