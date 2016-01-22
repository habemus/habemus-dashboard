'use strict';

module.exports = /*@ngInject*/ function LoginCtrl($scope, $state, auth, $translate) {

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

      $translate('betaAuth.noBetaCodeError')
        .then(function (errorMessage) {
          $scope.errorMessage = errorMessage;
        });

    } else {
      auth.logIn(betaData.email, $scope.betaToken)
        .then(function () {

          $scope.loading = false;
          $scope.$apply();

          $state.go('dashboard');
          $scope.closeThisDialog();
        }, function (err) {

          $translate('betaAuth.invalidCodeError')
            .then(function (errorMessage) {
              $scope.loading = false;
              $scope.errorMessage = errorMessage;
            });
        })
        .done();
    }
  };
};