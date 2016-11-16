// third-party
const Bluebird = require('bluebird');

function _wait(ms) {
  return new Bluebird(function (resolve, reject) {
    setTimeout(resolve, ms);
  });
}

module.exports = /*@ngInject*/ function ProjectCtrl($scope, $stateParams, currentAccount, $rootScope, $translate, apiHProject, apiHWebsite, apiHWorkspace, uiHAccountDialog, ngDialog, CONFIG, uiDialogLoading, uiDialogConfirm, auxZipPrepare, auxZipUpload, uiIntro) {
  
  /**
   * Current Account is resolved by ui-router
   * @type {Object}
   */
  $scope.currentAccount = currentAccount;

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

  /**
   * Loads the domain records associated to the project
   * 
   * @return {Bluebird}
   */
  $scope.loadDomainRecords = function () {

    var authToken = uiHAccountDialog.getAuthToken();

    return apiHProject.get(authToken, $stateParams.projectCode, {
      byCode: true
    })
    .then(function (project) {
      var projectId = $scope.project._id;

      // retrieve the requested project
      return apiHWebsite.listDomainRecords(authToken, projectId);
    })
    .then(function (domainRecords) {
      $scope.domainRecords = domainRecords;

      $scope.$apply();
    });
  };

  /**
   * Creates a new version from the given files
   * 
   * @param  {File} files
   * @return {Promise}
   */
  $scope.createVersion = function (files) {

    var _latestProjectVersion;

    return auxZipUpload(
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
    .then(function (latestVersion) {

      _latestProjectVersion = latestVersion;

      /**
       * Poll the server for the latestVersion
       * until it has its build-status at ready
       * do not put the polling in the promise sequence
       */
      $scope.ensureLatesteVersionBuildReady();

      /**
       * Ask user whether she/he would like to
       * update the associated workspace
       * @type {String}
       */
      return uiDialogConfirm({
        message: $translate.instant('workspace.updateWorkspaceToVersion', {
          versionCode: latestVersion.code,
        }),
        confirmLabel: $translate.instant('actions.yes'),
        cancelLabel: $translate.instant('actions.no'),
      });

    })
    .then(function () {
      // update requested
      // loading state starts
      uiDialogLoading.open({
        message: $translate.instant('workspace.updatingWorkspace'),
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

      return _latestProjectVersion;
    })
    .catch(function (err) {
      // user cancelled
      uiDialogLoading.close();

      console.warn(err);
    });
  };

  // initialize
  $scope.loadProject().then(function (project) {

    var promises = [
      $scope.ensureLatesteVersionBuildReady(),
      $scope.loadDomainRecords()
    ];

    if ($scope.currentAccount.applicationConfig.workspace.version !== 'disabled') {
      promises.push($scope.ensureWorkspaceReady());
    }

    return Bluebird.all(promises);
  });
};