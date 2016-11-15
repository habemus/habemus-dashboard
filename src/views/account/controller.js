'use strict';

// native
const path = require('path');
const fs   = require('fs');

module.exports = /*@ngInject*/ function accountCtrl($scope, currentAccount, $stateParams, $state, $translate, ngDialog, uiDialogLoading, uiHAccountDialog) {
  
  /**
   * Object onto which the account data input fields
   * should set their values
   * @type {Object}
   */
  $scope.currentAccount = currentAccount;

  /**
   * Update account owner data
   */
  $scope.updateAccountOwnerData = function () {

    uiDialogLoading.open({
      message: 'saving data'
    });

    return uiHAccountDialog.hAccountClient.updateAccountOwnerData(
      uiHAccountDialog.getAuthToken(),
      $scope.currentAccount.username,
      $scope.currentAccount.ownerData
    )
    .then(function () {
      uiDialogLoading.close();
    })
    .catch(function (err) {

      console.warn(err);

      uiDialogLoading.close();

      $translate('account.updateDataError')
        .then(function (errorMessage) {
          $scope.errorMessage = 'failed to update account data, please try again later';
        });
    });
  };

  /**
   * Discard changes
   */
  $scope.resetAccountFormData = function () {
    $scope.currentAccount = {};
  }

  /**
   * Reset Password
   */
  $scope.resetPassword = function () {
    ngDialog.open({
      template: fs.readFileSync(path.join(__dirname, '../account-password-reset/template.html'), 'utf-8'),
      plain: true,
      className: 'ngdialog-theme-habemus',
      controller: require('../account-password-reset/controller'),
    });
  }
  
  /**
   * Delete Account
   */
  $scope.accountDelete = function () {
    ngDialog.openConfirm({
      template: fs.readFileSync(path.join(__dirname, '../account-delete/template.html'), 'utf-8'),
      plain: true,
      className: 'ngdialog-theme-habemus',
      controller: require('../account-delete/controller'),
    })
    .then(function() {
      console.log("delete account");
    }, function() {
      console.log("don't delete");
    });
  }
  
};