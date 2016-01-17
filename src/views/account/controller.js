'use strict';

// native
var path = require('path');
var fs   = require('fs');

// third-party
var _    = require('lodash');

// load models
var DirectoryData = require('../../models/file-system/directory');

module.exports = /*@ngInject*/ function accountCtrl($scope, $rootScope, $stateParams, $state, auth, ngDialog) {
  
//  console.log("user: " + $scope.currentUser.username);
  
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

    $('.loading-state').addClass('active');

    auth.updateCurrentUserData({
      name: $scope.accountData.name
    })
    .then(function (updatedUser) {

      $scope.setCurrentUser(updatedUser);

      // reset form
      $scope.resetAccountFormData();
      $rootScope.$apply();

      $('.loading-state').removeClass('active');
    }, function (err) {

      $('.loading-state').removeClass('active');

      $scope.errorMessage = 'failed to update account data, please try again later';
      $scope.$apply();
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
    ngDialog.openConfirm({
      template: fs.readFileSync(path.join(__dirname, '../account-password-reset/template.html'), 'utf-8'),
      plain: true,
      className: 'ngdialog-theme-habemus',
      controller: require('../account-password-reset/controller'),
      scope: $scope,
    }).then(function(){
      console.log("password-reset");
    },function(){
      console.log("cancel");
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
      scope: $scope,
    })
    .then(function() {
      console.log("delete account");
    }, function() {
      console.log("don't delete");
    });
  }
  
};