'use strict';

var Q = require('q');

module.exports = /*@ngInject*/ function RenameProject($stateParams, $scope, $translate, $state, apiHProject, uiHAccountDialog) {

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
      editionPromise = apiHProject.updateCode(
        uiHAccountDialog.getAuthToken(),
        currentProjectCode,
        $scope.projectName,
        {
          byCode: true,
        }
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
        return apiHProject.update(
          uiHAccountDialog.getAuthToken(),
          projectData.code,
          {
            name: $scope.projectName
          },
          {
            byCode: true
          }
        );
      })
      .then(function (projectData) {

        var codeChanged = (currentProjectCode !== projectData.code);

        if (codeChanged) {
          // currentProjectCode was changed, we have to navigate to a new url
          $state.go("project.general", { projectCode: projectData.code });

          $scope.closeThisDialog();

          $scope.loading = false;

          $scope.$apply();

        } else {
          // if no changes were made to the project's code,
          // simply reload its data
          // require the loadProject method
          // to be defined in the scope
          $scope.loadProject()
            .then(function () {
              $scope.closeThisDialog();

              $scope.loading = false;

              $scope.$apply();
            });
        }
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