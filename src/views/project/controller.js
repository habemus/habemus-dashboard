'use strict';

// native
var path = require('path');
var fs   = require('fs');

// third-party
var _    = require('lodash');
var Q    = require('q');

var Zip  = require('../../lib/zip');

module.exports = /*@ngInject*/ function ProjectCtrl($scope, $state, $stateParams, $rootScope, $translate, apiProjectManager, apiAuth, $timeout, ngDialog, uiDialogError, CONFIG, uiDialogLoading, auxZipPrepare, auxZipUpload, uiIntro) {
  /**
   * Setup uiIntro
   */
//   $scope.$watch('currentUser', function () {
// project.domains
//     var currentUser = $scope.currentUser;

//     if (!currentUser) { return; }

//     // design this so that the uiIntro is only shown when explicitly set
//     var guideState = currentUser.guideState || {};

//     if (guideState.showProjectIntro) {
//       uiIntro.project().then(function (uiIntro) {
//         uiIntro.start();
//       });
//     }
//   });

  var projectId = $stateParams.projectId;
  
  /**
   * Project data loading
   */
  $scope.loadProjectIntoScope = function () {
    // retrieve the requested project
    return apiAuth.getCurrentUser()
      .then(function (user) {
        return apiProjectManager.getById(apiAuth.getAuthToken(), projectId);
      })
      .then(function (project) {

        $scope.project = project;

        // set pageTitle
        $rootScope.pageTitle = project.name;

        $scope.$apply();
      });
  };

  $scope.loadProjectVersionsIntoScope = function () {

    console.log('loadProjectVersionsIntoScope');

    return apiProjectManager.listVersions(apiAuth.getAuthToken(), projectId)
      .then(function (versions) {

        console.log(versions);
        
        $scope.projectVersions = versions;
        
        $scope.$apply();
      });
  };

  /**
    * Name editing
    */
  $scope.editProjectName = function () {
    ngDialog.open({
      template: fs.readFileSync(path.join(__dirname, '../project-rename/template.html'), 'utf-8'),
      plain: true,
      className: 'ngdialog-theme-habemus',
      controller: require('../project-rename/controller'),
      scope: $scope,

      preCloseCallback: function () {
        $scope.loadProjectIntoScope();
      }
    });
  };

  // initialize
  $scope
    .loadProjectIntoScope()
    .done();


  $scope.uploadNewVersion = function (files) {

    console.log('upload new version');
    auxZipUpload(apiAuth.getAuthToken(), projectId, files)
      .then(function () {
        $translate('project.reloadingProjectData')
          .then(function (message) {
            uiDialogLoading.open({
              message: message,
            });
          });

        return Q.all([
          $scope.loadProjectIntoScope(),
          $scope.loadProjectVersionsIntoScope(),
        ]);
      })
      .then(function () {

        uiDialogLoading.close();

      }, function () {

        uiDialogLoading.close();
      })
      .done();
  };

  // /**
  //  * File updating
  //  */
  // $scope.uploadNewVersion = function (files) {

  //   $translate('project.preparingUpload')
  //     .then(function (message) {
  //       // loading state starts
  //       uiDialogLoading.open({ message: message });
  //     });

  //   auxZipPrepare(files)
  //     .then(function (zipFile) {
  //       if (zipFile.size > 52428800) {
          
  //         $translate('project.errorSize')
  //         .then(function (message) {
  //           // error Dialog opens
  //           uiDialogError(message);
  //         });

  //         uiDialogLoading.close();

  //         return;
  //       }

  //       console.log('zip file generated', zipFile);

  //       $translate('project.uploading')
  //         .then(function (message) {
  //           uiDialogLoading.setMessage(message);
  //         });

  //       var upload = projectAPI.uploadProjectIntoScopeZip(projectId, zipFile);

  //       upload.progress(function (progress) {
  //         console.log('upload progress ', progress);

  //         progress = parseInt(progress.completed * 100);

  //         // progress %
  //         uiDialogLoading.setProgress(progress);
  //         if (progress === 100) {
  //           $translate('project.finishingUpload')
  //             .then(function (message) {
  //               uiDialogLoading.setMessage(message);
  //             });
  //         }
  //       });

  //       return upload;

  //     }, function prepareError() {
  //       uiDialogLoading.close();
  //     })
  //     .then(function uploadSuccess() {

  //       $translate('project.reloadingProjectData')
  //         .then(function (message) {
  //           uiDialogLoading.setMessage(message);
  //         });

  //       return $scope.loadProjectIntoScope();
  //     })
  //     .finally(function () {

  //       // loading state ends
  //       uiDialogLoading.close();
  //     })
  //     .done();
  // };

  /**
   * Versioning
   * @param  {[type]} versionId [description]
   * @return {[type]}             [description]
   */
  $scope.downloadProjectVersion = function (versionId) {

    // loading state starts
    uiDialogLoading.open({
      message: 'preparing download'
    });

    return apiProjectManager
      .getVersionSignedURL(apiAuth.getAuthToken(), projectId, versionId)
      .then(function (data) {

        uiDialogLoading.close();

        // http://stackoverflow.com/questions/1066452/easiest-way-to-open-a-download-window-without-navigating-away-from-the-page
        window.location.assign(data.url);

      }, function (err) {
        uiDialogLoading.close();

        console.warn('failed to retrieve download url');
      });
  };

  // $scope.restoreProjectVersion = function (versionId) {

  //   // loading state starts
  //   uiDialogLoading.open({
  //     message: 'restoring version ' + versionId
  //   });

  //   return projectAPI.restoreVersion($scope.project.id, versionId)
  //     .then(function (res) {

  //       uiDialogLoading.setMessage('reloading project data');

  //       return $scope.loadProjectIntoScope();
  //       console.log(res);
  //     }, function (err) {
  //       console.warn('failed to restore version');
  //     })
  //     .then(function () {
  //       // loading state starts
  //       uiDialogLoading.close();
  //     });
  // }
  
  $scope.deleteProject = function () {
    ngDialog.open({ 
      template: fs.readFileSync(path.join(__dirname, '../project-delete/template.html'), 'utf-8'),
      plain: true,
      className: 'ngdialog-theme-habemus',
      controller: require('../project-delete/controller'),
      scope: $scope,
    });
  }
};