'use strict';

// own
var fileReader = require('../../lib/file-reader');

module.exports = /*@ngInject*/ function DashboardCtrl($scope, $translate, uiHAccountDialog, apiHProject, $state, uiDialogLoading, uiDialogError, auxZipPrepare, uiIntro) {

  uiHAccountDialog.ensureUser({
    ensureEmailVerified: true,
  })
  .then(function (user) {
    return $scope.loadProjects();
  });

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
      $translate('project.errorSize')
        .then(function (message) {
          // error Dialog opens
          uiDialogError(message);
        });

      uiDialogLoading.close();

      return;
    }

    projectName = projectName || 'Project';
    
    apiHProject.create(uiHAccountDialog.getAuthToken(), { name: projectName })
      .then(function (projectData) {
        $translate('dashboard.uploading')
          .then(function (message) {
            uiDialogLoading.setMessage(message);
          });

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
        $translate('project.errorFailed')
          .then(function (message) {
            // error Dialog opens
            uiDialogError(message);
          });
      })
      .then(function (projectData) {

        // navigate to the project view
        $scope.navigateToProject(projectData.code);
        
        // loading state ends
        uiDialogLoading.close();

      }, function (err) {
        console.error(err);
        $translate('project.errorUploaded')
          .then(function (message) {
            // error Dialog opens
            uiDialogError(message);
          });

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

    $translate('dashboard.preparingUpload')
      .then(function (message) {
        // loading state starts
        uiDialogLoading.open({ message: message });
      });

    auxZipPrepare(files)
      .then(function (zipFile) {
        return _createProject(zipFile, projectName);
      }, function (err) {
        uiDialogLoading.close();
      })
      .done();
  };
  
};