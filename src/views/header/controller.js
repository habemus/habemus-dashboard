'use strict';

module.exports = /*@ngInject*/ function HeaderCtrl($scope, $stateParams, $state, auth) {
  $scope.logOut = function () {
    auth.logOut()
      .then(function () {
        $state.go('login');
      });
  };
};