'use strict';

module.exports = /*@ngInject*/ function LoginCtrl($scope, $translate, auth) {

  $scope.credentials = {};

  $scope.logIn = function () {

    $scope.loading = true;

    auth.logIn($scope.credentials.username, $scope.credentials.password)
      .then(function () {
        $scope.loading = false;
        $scope.closeThisDialog();
      }, function (err) {

        $translate('auth.usernameAndPasswordMismatch')
          .then(function (errorMessage) {
            $scope.errorMessage = errorMessage;
            $scope.loading = false;
          });
      });
  };
};