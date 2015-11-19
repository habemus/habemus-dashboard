'use strict';

module.exports = function HeaderCtrl($scope, $stateParams, $state, userService) {

  $scope.logOut = function () {
    userService
      .logOut()
      .then(function () {
        $state.go('login');
      });
  };
};