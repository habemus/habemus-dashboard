'use strict';

var Q = require('q');

module.exports = /*@ngInject*/ function BetaPasswordReset($scope, $state, auth) {

  var hasAttemptedSubmit = false;

  $scope.newPassword        = '';
  $scope.newPasswordConfirm = '';

  $scope.validatePassword = function () {

    if ($scope.newPassword.length < 6) {
      $scope.newPasswordErrorMessage = 'your password must have at least 6 characters';

      return false;
    } else {

      $scope.newPasswordErrorMessage = '';

      return true;
    }
  };

  $scope.validatePasswordConfirm = function () {
    if ($scope.newPassword !== $scope.newPasswordConfirm) {
      $scope.newPasswordConfirmErrorMessage = 'passwords do not match';

      return false;
    } else {
      $scope.newPasswordConfirmErrorMessage = '';

      return true;
    }
  }

  $scope.changeBetaPassword = function () {

    if ($scope.validatePassword() && $scope.validatePasswordConfirm()) {

      $scope.loading = true;

      var user = auth.getCurrentUser();

      user.setPassword($scope.newPassword);
      user.set('requirePasswordReset_', false);

      Q(user.save())
        /// no longer needed, as long as sessions are not revoked on
        /// password change (parse.com setting)
        // .then(function () {

        //   // destroy current localstorage session
        //   auth.logOut();

        //   // login
        //   return auth.logIn(user.get('username'), $scope.newPassword);
        // })
        .then(function () {

          // reload page as we do not want the betaData
          // to stay on the url
          var targetUrl = [
            window.location.protocol + '//',
            window.location.host,
            window.location.pathname,
          ].join('');

          window.location.replace(targetUrl);

          $scope.loading = false;
          $scope.$apply();

          this.closeThisDialog();
        }.bind(this), function (err) {

          $scope.loading = false;

          $scope.newPasswordConfirmErrorMessage = 'password reset error please retry';
          $scope.$apply();
        })
        .done();
    }

  };
};