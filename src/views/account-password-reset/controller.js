module.exports = /* @ngInject */ function PasswordResetCtrl($scope, $translate) {

  $scope.validatePassword = function () {

    if ($scope.newPassword.length < 6) {

      $translate('accountPasswordReset.atLeast6Chars')
        .then(function (errorMessage) {
          $scope.newPasswordErrorMessage = errorMessage;
        });

      return false;
    } else {
      $scope.newPasswordErrorMessage = '';
      return true;
    }

    $scope.$apply();
  }

  $scope.validatePasswordConfirm = function () {
    
    if ($scope.newPassword !== $scope.newPasswordConfirm) {

      $translate('accountPasswordReset.passwordsDoNotMatch')
        .then(function (errorMessage) {
          $scope.newPasswordConfirmErrorMessage = errorMessage;
        });

      return false;
    } else {
      $scope.newPasswordConfirmErrorMessage = '';
      return true;
    }
  }

  $scope.changePassword = function () {

    if ($scope.validatePassword() && $scope.validatePasswordConfirm()) {

      $scope.loading = true;

      console.warn('changePassword')

      // apiAuth.changePassword($scope.newPassword)
      //   .then(function () {

      //     $scope.loading = false;
      //     $scope.$apply();

      //     $scope.closeThisDialog();

      //   }, function (err) {

      //     $translate('accountPasswordReset.couldNotUpdatePassword')
      //       .then(function (errorMessage) {
      //         $scope.loading = false;
      //         $scope.newPasswordConfirmErrorMessage = errorMessage;
      //       });
      //   });
    }

  };

};