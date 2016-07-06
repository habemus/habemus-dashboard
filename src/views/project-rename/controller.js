'use strict';

var Q    = require('q');

module.exports = /*@ngInject*/ function RenameProject($stateParams, $scope, $translate, apiProjectManager, apiAuth) {

  var projectId = $stateParams.projectId;

  $scope.editName = function () {

    if (!$scope.projectName) {

      $translate('projectRename.projectNameRequired')
        .then(function (message) {
          $scope.error = message;
        });
      return;
    }

    $scope.loading = true;

    // variable to hold starting edition promise
    var editionPromise;

    if ($scope.renameDomain) {
      // start the edition by setting safeName
      editionPromise = apiProjectManager.updateSafeName(
        apiAuth.getAuthToken(),
        projectId,
        $scope.projectName
      );
    } else {
      editionPromise = Q();
    }

    editionPromise
      .then(function () {
        // change the project's name
        return apiProjectManager.update(apiAuth.getAuthToken(), projectId, {
          name: $scope.projectName
        });
      })
      .then(function () {
        $scope.closeThisDialog();

        $scope.loading = false;

        $scope.$apply();
      })
      .catch(function (err) {
        // TODO: improve server-side error handling
        $translate('projectRename.serverSideError')
          .then(function (message) {
            $scope.error = message;

            $scope.loading = false;
          });
      });
  };
};