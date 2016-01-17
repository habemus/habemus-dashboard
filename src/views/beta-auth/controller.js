'use strict';

module.exports = /*@ngInject*/ function LoginCtrl($scope, $state, auth, $location) {

  $scope.betaToken = '';

  var authData = $location.search().betaData;

  try {
    authData = JSON.parse(atob(authData));
  } catch (e) {
    // discard
  }

  $scope.submitToken = function () {

    if (!$scope.betaToken) {
      $scope.errorMessage = 'please insert your beta token';

    } else {
      auth.logIn(authData.email, $scope.betaToken)
        .then(function () {
          $state.go('dashboard');
          $scope.closeThisDialog();
        }, function (err) {
          $scope.errorMessage = 'sorry, invalid token';
          $scope.$apply();
        });
    }
  };
};