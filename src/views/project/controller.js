'use strict';

// native
var path = require('path');
var fs   = require('fs');
var url  = require('url');

// third-party
var Q    = require('q');
const Bluebird = require('bluebird');

const STARTING_RE = /^\//;
const TRAILING_RE = /\/$/;

function _joinPath(part1, part2) {
  return part1.replace(TRAILING_RE, '') + '/' + part2.replace(STARTING_RE, '');
}

function _wait(ms) {
  return new Bluebird(function (resolve, reject) {
    setTimeout(resolve, ms);
  });
}

module.exports = /*@ngInject*/ function ProjectCtrl($scope, $stateParams, $rootScope, $translate, apiHProject, apiHWorkspace, uiHAccountDialog, ngDialog, CONFIG, uiDialogLoading, auxZipPrepare, auxZipUpload, uiIntro) {
  
  uiHAccountDialog.ensureUser({ ensureEmailVerified: true })
    .then(function (user) {
      return $scope.loadProject();
    })
    .then(function (project) {
      return Bluebird.all([
        $scope.ensureLatesteVersionBuildReady(),
        $scope.ensureWorkspaceReady(),
      ]);
    });

  /**
   * Loads the project's data into the scope
   * @return {Bluebird -> Project}
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

      // set pageTitle
      $rootScope.pageTitle = project.name;

      $scope.$apply();

      return project;
    });
  };

  /**
   * Calls `loadProjectLatestVersion` until
   * the latestVersion's buildStatus is at either `failed` or `succeeded`
   * @return {Bluebird -> ProjectVersion}
   */
  $scope.ensureLatesteVersionBuildReady = function () {

    return $scope.loadProjectLatestVersion()
      .then(function (projectLatestVersion) {

        switch (projectLatestVersion.buildStatus.value) {
          case 'failed':
            return Bluebird.reject(new Error('build failed'));
            break;
          case 'succeeded':
            return projectLatestVersion;
            break;
          case 'not-scheduled':
          case 'scheduled':
          case 'started':
            return _wait(3000).then(function () {
              return $scope.ensureLatesteVersionBuildReady();
            });
          default:
            return Bluebird.reject(new Error('invalid build status, unknown error'));
            break;
        }
      })
  };

  /**
   * Loads the project's latest version into the scope.
   * 
   * @return {Bluebird -> ProjectVersion}
   */
  $scope.loadProjectLatestVersion = function () {
    return apiHProject.getLatestVersion(
      uiHAccountDialog.getAuthToken(),
      $stateParams.projectCode,
      {
        byCode: true
      }
    )
    .then(function (projectLatestVersion) {

      $scope.projectLatestVersion = projectLatestVersion;
      $scope.$apply();

      return projectLatestVersion;
    });
  };

  /**
   * Creates the workspace related to this project
   * only if it does not exist.
   * Loads the workspace's data into the scope.
   * 
   * @return {Bluebird -> Workspace}
   */
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