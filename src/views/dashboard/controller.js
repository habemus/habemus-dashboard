'use strict';

// own
var fileReader = require('../../lib/file-reader');

module.exports = /*@ngInject*/ function DashboardCtrl($scope, currentAccount, $translate, uiHAccountDialog, apiHProject, $state, uiDialogLoading, uiDialogError, auxZipPrepare, uiIntro) {

  /**
   * Current Account is resolved by ui-router
   * @type {Object}
   */
  $scope.currentAccount = currentAccount;

  var showIntro = false;

  try {
    // this is not a critical feature
    // wrap in try catch to handle account data structure variation
    showIntro = currentAccount.applicationConfig.dashboard.guides.dashboard === 'new';
  } catch (e) {
    showIntro = false;
  }
  
  if (showIntro) {
    uiIntro.dashboard().then(function (intro) {
      intro.start();
    });
  }

  $scope.loadProjects = function () {
    return apiHProject.list(uiHAccountDialog.getAuthToken())
      .then(function (projects) {
        $scope.projects = projects;
        $scope.$apply();
      });
  };

  /**
   * Navigate to the visualization of a given project
   * @param  {String} projectCode
   */
  $scope.navigateToProject = function (projectCode) {
    $state.go("project.general", { projectCode: projectCode });
  };

  /**
   * Shared create project logic among zip file and multi-file upload types
   * @param  {String} projectName 
   * @param  {File} zipFile     
   */
  function _createProject(zipFile, projectName) {
    if (zipFile.size > 52428800) {
      uiDialogLoading.close();
      // error Dialog opens
      uiDialogError($translate.instant('project.errorSize'));

      return;
    }

    projectName = projectName || 'Project';
    
    apiHProject.create(uiHAccountDialog.getAuthToken(), { name: projectName })
      .then(function (projectData) {
        
        uiDialogLoading.setMessage($translate.instant('dashboard.uploading'));

        // upload
        var upload = apiHProject.createVersion(
          uiHAccountDialog.getAuthToken(),
          projectData._id,
          zipFile
        );

        upload.on('progress', function (progress) {
          console.log('upload progress ', progress);

          progress = parseInt(progress.completed * 100);

          // progress %
          uiDialogLoading.setProgress(progress);
          if (progress === 100) {
            $translate('dashboard.finishingUpload')
              .then(function (message) {
                uiDialogLoading.setMessage(message);
              });
          }
        });

        return upload.promise.then(function () {
          return projectData;
        });

      }, function (err) {        
        uiDialogLoading.close();
        uiDialogError($translate.instant('project.errorFailed'));
      })
      .then(function (projectData) {

        // navigate to the project view
        $scope.navigateToProject(projectData.code);
        
        // loading state ends
        uiDialogLoading.close();

      }, function (err) {
        console.error(err);
        
        uiDialogError($translate.instant('project.errorUploaded'));
        uiDialogLoading.close();
      })
      .catch(function (err) {

        console.log(err);
      });
  }

  /**
   * Creates a project given a set of files
   * @param  {Array -> FileDataObject} files 
   *         Array of file data objects, 
   *         as defined by models/file-system/file
   */
  $scope.createProject = function (files, projectName) {

    uiDialogLoading.open({
      message: $translate.instant('dashboard.preparingUpload')
    });
    
    auxZipPrepare(files)
      .then(function (zipFile) {
        return _createProject(zipFile, projectName);
      }, function (err) {
        uiDialogLoading.close();
      })
      .done();
  };

  // initialize
  $scope.loadProjects();
};