'use strict';

module.exports = /*@ngInject*/ function LoginCtrl($scope, auth) {

  $scope.credentials = {};

  $scope.logIn = function () {

    $scope.loading = true;

    auth.logIn($scope.credentials.username, $scope.credentials.password)
      .then(function () {
        $scope.loading = false;
        $scope.closeThisDialog();
      }, function (err) {
        $scope.errorMessage = 'username and password do not match';
        $scope.loading = false;
        $scope.$apply();
      });
  };
};