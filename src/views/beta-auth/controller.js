'use strict';

module.exports = /*@ngInject*/ function LoginCtrl($scope, $state, auth, $location) {

  $scope.betaToken = '';

  var betaData = $scope.ngDialogData.betaData;

  try {
    betaData = JSON.parse(atob(betaData));
  } catch (e) {
    // discard
    alert('invalid url');
  }

  $scope.submitToken = function () {

    $scope.loading = true;

    if (!$scope.betaToken) {

      $scope.loading = false;
      $scope.errorMessage = 'please insert your beta token';

    } else {
      auth.logIn(betaData.email, $scope.betaToken)
        .then(function () {

          $scope.loading = false;
          $scope.$apply();

          $state.go('dashboard');
          $scope.closeThisDialog();
        }, function (err) {
          $scope.loading = false;
          $scope.errorMessage = 'sorry, invalid token';
          $scope.$apply();
        })
        .done();
    }
  };
};