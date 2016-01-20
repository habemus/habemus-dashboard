module.exports = /* @ngInject */ function PasswordResetCtrl($scope, auth) {

  $scope.validatePassword = function () {

    if ($scope.newPassword.length < 6) {
      $scope.newPasswordErrorMessage = 'password must have at least 6 characters';
      return false;
    } else {
      $scope.newPasswordErrorMessage = '';
      return true;
    }

    $scope.$apply();
  }

  $scope.validatePasswordConfirm = function () {
    
    if ($scope.newPassword !== $scope.newPasswordConfirm) {
      $scope.newPasswordConfirmErrorMessage = 'passwords do not match';
      return false;
    } else {
      $scope.newPasswordConfirmErrorMessage = '';
      return true;
    }
  }

  $scope.changePassword = function () {

    if ($scope.validatePassword() && $scope.validatePasswordConfirm()) {

      $scope.loading = true;

      auth.changePassword($scope.newPassword)
        .then(function () {

          $scope.loading = false;
          $scope.$apply();

          $scope.closeThisDialog();

        }, function (err) {

          $scope.loading = false;

          $scope.newPasswordConfirmErrorMessage = 'could not update password, please try again later';
          $scope.$apply();
        })
    }

  };

};