'use strict';

// native
var path = require('path');
var fs   = require('fs');

// third-party
var _    = require('lodash');
var Q    = require('q');

var Zip  = require('../../lib/zip');

module.exports = /*@ngInject*/ function ProjectCtrl($scope, $state, $stateParams, $rootScope, $translate, apiProjectManager, apiAuth, $timeout, ngDialog, uiDialogError, CONFIG, uiDialogLoading, auxZipPrepare, auxZipUpload, uiIntro) {

  var projectCode = $stateParams.projectCode;
  
  /**
   * Project data loading
   */
  $scope.loadProjectIntoScope = function () {
    // retrieve the requested project
    return apiAuth.getCurrentUser()
      .then(function (user) {
        return apiProjectManager.getByCode(apiAuth.getAuthToken(), projectCode);
      })
      .then(function (project) {

        $scope.project = project;

        // set pageTitle
        $rootScope.pageTitle = project.name;

        $scope.$apply();
      });
  };

  $scope.loadProjectVersionsIntoScope = function () {

    return apiProjectManager.listVersions(apiAuth.getAuthToken(), projectCode)
      .then(function (versions) {
        
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
    auxZipUpload(apiAuth.getAuthToken(), projectCode, files)
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
      .getVersionSignedURL(apiAuth.getAuthToken(), projectCode, versionId)
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
  };
};