'use strict';

/**
 * Refresh statuses every 5 seconds
 * @type {Number}
 */
const STATUS_REFRESH_INTERVAL = 5000;


module.exports = /*@ngInject*/ function pHistoryCtrl($scope, $interval, $stateParams, $translate, uiHAccountDialog, uiDialogLoading, uiDialogConfirm, uiDialogError, apiHProject, apiHWorkspace, auxZipUpload) {

  /**
   * Set an interval to check if any version has its buildStatus is at 'scheduled' status
   * If so, refresh the projectVersions.
   */
  var buildStatusCheckIntervalId = $interval(function checkBuildStatuses() {

    if (!$scope.projectVersions) {
      return;
    }

    var hasVersionAtBuildScheduled = $scope.projectVersions.some(function (version) {
      return version.buildStatus.value === 'scheduled';
    });

    if (hasVersionAtBuildScheduled) {
      $scope.loadProjectVersions();
    } else {
      return;
    }

  }, STATUS_REFRESH_INTERVAL);

  $scope.$on('$destroy', function() {
    $interval.cancel(buildStatusCheckIntervalId);
  });

  /**
   * Proxy method to the project controller (parent of this)
   */
  $scope.createVersion = function () {
    var args = Array.prototype.slice.call(arguments, 0);

    return $scope.$parent.createVersion.apply($scope.$parent, args)
      .then(function (latestVersion) {
        $scope.projectVersions.unshift(latestVersion);
        $scope.$apply();

        return latestVersion;
      });
  };

  /**
   * Loads the current project's versions into scope
   * 
   * @return {Promise}
   */
  $scope.loadProjectVersions = function () {

    $scope.loading = true;

    return apiHProject.listVersions(
        uiHAccountDialog.getAuthToken(),
        $stateParams.projectCode,
        {
          byCode: true,
        }
      )
      .then(function (versions) {
        $scope.projectVersions = versions;
        $scope.loading = false;
        
        $scope.$apply();
      })
      .catch(function (err) {
        $scope.loading = false;

        throw err;
      });
  };

  /**
   * Downloads a specific version of the project
   * 
   * @param  {String} versionCode
   * @return {Promise}
   */
  $scope.downloadVersion = function (versionCode, srcOrDist) {

    srcOrDist = srcOrDist || 'src';

    // loading state starts
    uiDialogLoading.open({
      message: 'preparing download'
    });

    var options = { byCode: true };

    if (srcOrDist === 'src') {
      options.srcSignedURL = 'true';
    } else if (srcOrDist === 'dist') {
      options.distSignedURL = 'true';
    } else {
      throw new Error('srcOrDist invalid');
    }

    return apiHProject.getVersion(
      uiHAccountDialog.getAuthToken(),
      $stateParams.projectCode,
      versionCode,
      options
    )
    .then(function (data) {
      uiDialogLoading.close();

      var downloadURL = srcOrDist === 'src' ? data.srcSignedURL : data.distSignedURL;

      // http://stackoverflow.com/questions/1066452/easiest-way-to-open-a-download-window-without-navigating-away-from-the-page
      window.location.assign(downloadURL);

    }, function (err) {
      uiDialogLoading.close();
    });
  };

  /**
   * Restores the project version identified by the version code
   * 
   * @param  {String} versionCode
   * @return {Promise}
   */
  $scope.restoreVersion = function (versionCode) {

    // loading state starts
    uiDialogLoading.open({
      message: $translate.instant('projectHistory.restoringVersion', {
        versionCode: versionCode,
      })
    });

    return apiHProject.restoreVersion(
      uiHAccountDialog.getAuthToken(),
      $stateParams.projectCode,
      versionCode,
      {
        byCode: true,
      }
    )
    .catch(function (err) {
      console.warn(err);

      uiDialogLoading.close();

      uiDialogError.open({
        message: $translate.instant('projectHistory.restoreError', {
          versionCode: versionCode,
        })
      });
    })
    .then(function (latestVersion) {

      /**
       * Poll the server for the latestVersion
       * until it has its build-status at ready
       * do not put the polling in the promise sequence
       */
      $scope.ensureLatesteVersionBuildReady();

      $scope.projectVersions.unshift(latestVersion);
      $scope.$apply();

      // loading state ends
      uiDialogLoading.close();

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
    })
    .catch(function (err) {
      if (!err) {
        // ng-dialog seems to not pass an error
        // object in case the user cancels

        // user cancelled
        uiDialogLoading.close();
      } else {
        throw err;
      }
    });
  };

  /**
   * Restores the project version identified by the version code
   * 
   * @param  {String} versionCode
   * @return {Promise}
   */
  $scope.scheduleVersionBuild = function (versionCode) {
    // loading state starts
    uiDialogLoading.open({
      message: $translate.instant('project.schedulingVersionBuild'),
    });

    return apiHProject.scheduleVersionBuild(
      uiHAccountDialog.getAuthToken(),
      $stateParams.projectCode,
      versionCode,
      {
        byCode: true,
      }
    )
    .then(function (version) {
      uiDialogLoading.close();

      $scope.loadProjectVersions();
    })
    .catch(function (err) {
      if (!err) {
        // ng-dialog seems to not pass an error
        // object in case the user cancels

        // user cancelled
        uiDialogLoading.close();
      } else {
        throw err;
      }
    });
  };

  // initialize
  $scope.loadProjectVersions();
};