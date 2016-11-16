// native
const fs = require('fs');
const path = require('path');

module.exports = /*@ngInject*/ function ProjectGeneralCtrl($scope, $stateParams, uiHAccountDialog, currentAccount, auxZipUpload, ngDialog, apiHWorkspace, uiDialogConfirm, uiDialogLoading, uiIntro) {

  /**
   * Current Account is resolved by ui-router
   * @type {Object}
   */
  $scope.currentAccount = currentAccount;

  var showIntro = false;

  try {
    // this is not a critical feature
    // wrap in try catch to handle account data structure variation
    showIntro = currentAccount.applicationConfig.dashboard.guides['project-general'] === 'new';
  } catch (e) {
    showIntro = false;
  }

  if (showIntro) {
    uiIntro.projectGeneral().then(function (intro) {
      intro.start();
    });
  }

  /**
   * Creates a new version from the given files
   * 
   * @param  {File} files
   * @return {Promise}
   */
  $scope.createVersion = function (files) {
    auxZipUpload(
      uiHAccountDialog.getAuthToken(),
      $stateParams.projectCode,
      files,
      {
        byCode: true
      }
    )
    .catch(function (err) {
      console.log('upload error');
      console.warn(err);
    })
    .then(function () {

      /**
       * Poll the server for the latestVersion
       * until it has its build-status at ready
       * do not put the polling in the promise sequence
       *
       * This method is defined in the ProjectCtrl (from which this controller inherits)
       */
      $scope.ensureLatesteVersionBuildReady();

      /**
       * Ask user whether she/he would like to
       * update the associated workspace
       * @type {String}
       */
      return uiDialogConfirm({
        message: 'would you like to update your workspace as well?',
        confirmLabel: 'yes',
        cancelLabel: 'no',
      });

    })
    .then(function () {
      // update requested
      // loading state starts
      uiDialogLoading.open({
        message: 'updating workspace'
      });

      return apiHWorkspace.loadLatestVersion(
        uiHAccountDialog.getAuthToken(),
        $stateParams.projectCode,
        {
          byProjectCode: true
        }
      );
    })
    .then(function () {
      uiDialogLoading.close();
    })
    .catch(function (err) {
      // user cancelled
      uiDialogLoading.close();
    });
  };
  
  /**
    * Name editing
    */
  $scope.editName = function () {
    ngDialog.open({
      template: fs.readFileSync(path.join(__dirname, '../project-rename/template.html'), 'utf-8'),
      plain: true,
      className: 'ngdialog-theme-habemus',
      controller: require('../project-rename/controller'),
      scope: $scope,

      preCloseCallback: function () {}
    });
  };
  
  $scope.delete = function () {
    ngDialog.open({ 
      template: fs.readFileSync(path.join(__dirname, '../project-delete/template.html'), 'utf-8'),
      plain: true,
      className: 'ngdialog-theme-habemus',
      controller: require('../project-delete/controller'),
      scope: $scope,
    });
  };
  
};