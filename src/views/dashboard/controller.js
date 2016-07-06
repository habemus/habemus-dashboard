'use strict';

var fs    = require('fs');
var path  = require('path');

var Zip   = require('../../lib/zip');
var JSZip = require('jszip');

// own
var fileReader = require('../../lib/file-reader');

module.exports = /*@ngInject*/ function DashboardCtrl($scope, $translate, apiAuth, apiProjectManager, $state, ngDialog, uiDialogLoading, uiDialogError, auxZipPrepare, uiIntro) {

  $scope.loadProjectsIntoScope = function () {
    return apiAuth.getCurrentUser()
      .then(function (user) {
        return apiProjectManager.list(apiAuth.getAuthToken());
      })
      .then(function (projects) {
        $scope.currentUserProjects = projects;
        $scope.$apply();
      });
  };

  $scope.loadProjectsIntoScope()
    .catch(function (err) {
      console.warn(err);
    });

  /**
   * Navigate to the visualization of a given project
   * @param  {String} projectId
   */
  $scope.navigateToProject = function (projectId) {
    $state.go("project.general", { projectId: projectId });
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
    
    apiProjectManager.create(apiAuth.getAuthToken(), { name: projectName })
      .then(function (projectData) {
        $translate('dashboard.uploading')
          .then(function (message) {
            uiDialogLoading.setMessage(message);
          });

        // upload
        var upload = apiProjectManager.uploadProjectZip(
          apiAuth.getAuthToken(),
          projectData._id,
          zipFile
        );

        upload.progress(function (progress) {
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

        return upload.then(function () {
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
        $scope.navigateToProject(projectData._id);
        
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

    // explicitly compare with false,
    // because 'undefined' means that the account 
    // was created before the email verification was activated
    if ($scope.currentUser.emailVerified === false) {

      $translate('dashboard.errorUnverifiedEmail')
        .then(function (message) {
          uiDialogError(message);
        });

      uiDialogLoading.close();

      return;
    }

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