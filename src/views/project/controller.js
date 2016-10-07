'use strict';

// native
var path = require('path');
var fs   = require('fs');
var url  = require('url');

// third-party
var Q    = require('q');

const STARTING_RE = /^\//;
const TRAILING_RE = /\/$/;

function _joinPath(part1, part2) {
  return part1.replace(TRAILING_RE, '') + '/' + part2.replace(STARTING_RE, '');
}

module.exports = /*@ngInject*/ function ProjectCtrl($scope, $stateParams, $rootScope, $translate, apiHProject, apiHWorkspace, uiHAccountDialog, ngDialog, CONFIG, uiDialogLoading, auxZipPrepare, auxZipUpload, uiIntro) {

  if (!CONFIG.hostURL) {
    throw new Error('hostURL is required');
  }
  
  uiHAccountDialog.ensureUser({ ensureEmailVerified: true })
    .then(function (user) {
      return $scope.loadProject();
    })
    .then(function (project) {
      return $scope.ensureWorkspaceReady();
    });

  /**
   * Project data loading
   */
  $scope.loadProject = function () {
    // retrieve the requested project
    return apiHProject.get(
      uiHAccountDialog.getAuthToken(),
      $stateParams.projectCode,
      {
        byCode: true,
      }
    )
    .then(function (project) {

      $scope.project = project;

      var parsedHostURL = url.parse(CONFIG.hostURL);
      parsedHostURL.host = project.code + '.' + parsedHostURL.host;
      $scope.projectHostURL = url.format(parsedHostURL);

      // set pageTitle
      $rootScope.pageTitle = project.name;

      $scope.$apply();

      return project;
    });
  };

  $scope.ensureWorkspaceReady = function () {

    return $scope.loadProject()
      .then(function (project) {
        return apiHWorkspace.ensureReady(
          uiHAccountDialog.getAuthToken(),
          project._id
        );
      })
      .then(function (workspace) {
        $scope.workspace = workspace;

        $scope.$apply();

        return workspace;
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

  //       return $scope.loadProject();
  //       console.log(res);
  //     }, function (err) {
  //       console.warn('failed to restore version');
  //     })
  //     .then(function () {
  //       // loading state starts
  //       uiDialogLoading.close();
  //     });
  // }
};