'use strict';

/**
 * Refresh statuses every 5 seconds
 * @type {Number}
 */
const STATUS_REFRESH_INTERVAL = 5000;


module.exports = /*@ngInject*/ function pHistoryCtrl($scope, $interval, $stateParams, $translate, uiHAccountDialog, uiDialogLoading, apiHProject, auxZipUpload) {

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
   * Creates a new version from the files given.
   * 
   * @param  {File} files
   * @return {Promise}
   */
  $scope.createVersion = function (files) {
    auxZipUpload(
      uiHAccountDialog.getAuthToken(),
      $stateParams.projectCode,
      files,
      {
        byCode: true
      }
    )
    .then(function () {
      $translate('project.reloadingProjectData')
        .then(function (message) {
          uiDialogLoading.open({
            message: message,
          });
        });

      return $scope.loadProjectVersions();
    })
    .then(
      uiDialogLoading.close.bind(uiDialogLoading),
      uiDialogLoading.close.bind(uiDialogLoading)
    );
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

  // initialize
  $scope.loadProjectVersions();
};