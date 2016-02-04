'use strict';

var fs    = require('fs');
var path  = require('path');

var Zip   = require('../../lib/zip');
var JSZip = require('jszip');

// own
var fileReader = require('../../lib/file-reader');

module.exports = /*@ngInject*/ function DashboardCtrl($scope, $translate, projectAPI, $state, ngDialog, loadingDialog, errorDialog, zipPrepare, intro) {

  /**
   * Setup intro
   */
  $scope.$watch('currentUser', function () {

    var currentUser = $scope.currentUser;

    if (!currentUser) { return; }

    // design this so that the intro is only shown when explicitly set
    var guideState = currentUser.guideState || {};

    if (guideState.showDashboardIntro) {
      intro.dashboard().then(function (intro) {
        intro.start()
      });
    }
  });

  // retrieve all projects owned by the current logged user
  // and put them onto the scope as `currentUserProjects`
  projectAPI.findProjects()
    .then(function (projects) {
      $scope.currentUserProjects = projects || [];
      $scope.$apply();
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
          errorDialog(message);
        });

      loadingDialog.close();

      return;
    }

    projectAPI.createProject({
      name: projectName,
    })
    .then(function (projectData) {
      $translate('dashboard.uploading')
        .then(function (message) {
          loadingDialog.setMessage(message);
        });

      // upload
      var upload = projectAPI.uploadProjectZip(projectData.objectId, zipFile);

      upload.progress(function (progress) {
        console.log('upload progress ', progress);

        progress = parseInt(progress.completed * 100);

        // progress %
        loadingDialog.setProgress(progress);
        if (progress === 100) {
          $translate('dashboard.finishingUpload')
            .then(function (message) {
              loadingDialog.setMessage(message);
            });
        }
      });

      return upload.then(function () {
        return projectData;
      });

    }, function () {
      loadingDialog.close();
      $translate('project.errorFailed')
        .then(function (message) {
          // error Dialog opens
          errorDialog(message);
        });
    })
    .then(function (projectData) {

      // navigate to the project view
      $scope.navigateToProject(projectData.objectId);
      
      // loading state ends
      loadingDialog.close();

    }, function (err) {
      console.error(err);
      $translate('project.errorUploaded')
        .then(function (message) {
          // error Dialog opens
          errorDialog(message);
        });

      loadingDialog.close();
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
        loadingDialog.open({ message: message });
      });

    zipPrepare(files)
      .then(function (zipFile) {
        return _createProject(zipFile, projectName);
      }, function (err) {
        loadingDialog.close();
      })
      .done();
  };
  
};