'use strict';

// native
var path = require('path');
var fs   = require('fs');

// third-party
var _    = require('lodash');

module.exports = /*@ngInject*/ function accountCtrl($scope, $rootScope, $stateParams, $state, $translate, apiAuth, ngDialog, uiDialogLoading) {
  
  /**
   * Object onto which the account data input fields
   * should set their values
   * @type {Object}
   */
  $scope.accountData = {};
  
  /**
   * Update account data
   */
  $scope.updateAccountData = function () {

    uiDialogLoading.open({
      message: 'saving data'
    });

    apiAuth.updateCurrentUserData({
      name: $scope.accountData.name
    })
    .then(function (updatedUser) {

      $scope.setCurrentUser(updatedUser);

      // reset form
      $scope.resetAccountFormData();
      $rootScope.$apply();

      uiDialogLoading.close();
    }, function (err) {

      uiDialogLoading.close();

      $translate('account.updateDataError')
        .then(function (errorMessage) {
          $scope.errorMessage = 'failed to update account data, please try again later';
        });
    })
    .done();
  };

  /**
   * Discard changes
   */
  $scope.resetAccountFormData = function () {
    $scope.accountData = {};
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