'use strict';

var Q = require('q');

module.exports = /*@ngInject*/ function RenameProject($stateParams, $scope, $translate, $state, apiProjectManager, apiAuth) {

  /**
   * Get the current project code.
   * It may be modified during the process of renaming
   * @type {String}
   */
  var currentProjectCode = $stateParams.projectCode;

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
      editionPromise = apiProjectManager.updateCode(
        apiAuth.getAuthToken(),
        currentProjectCode,
        $scope.projectName
      );
    } else {
      // simulate a project object using the currentProjectCode
      editionPromise = Q.resolve({
        code: currentProjectCode,
      });
    }

    editionPromise
      .then(function (projectData) {

        // change the project's name
        return apiProjectManager.update(
          apiAuth.getAuthToken(),
          projectData.code,
          {
            name: $scope.projectName
          }
        );
      })
      .then(function (projectData) {

        console.log('changeddd')

        var codeChanged = (currentProjectCode !== projectData.code);

        if (codeChanged) {
          // projectCode was changed, we have to navigate to a new url
          $state.go("project.general", { projectCode: projectData.code });

          $scope.closeThisDialog();

          $scope.loading = false;

          $scope.$apply();

        } else {
          // if no changes were made to the project's code,
          // simply reload its data
          // require the loadProjectIntoScope method
          // to be defined in the scope
          $scope.loadProjectIntoScope()
            .then(function () {
              $scope.closeThisDialog();

              $scope.loading = false;

              $scope.$apply();
            });
        }
      })
      .catch(function (err) {

        console.log(err);

        // TODO: improve server-side error handling
        $translate('projectRename.serverSideError')
          .then(function (message) {
            $scope.error = message;

            $scope.loading = false;
          });
      });
  };
};