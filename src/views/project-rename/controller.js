'use strict';

var Q    = require('q');

module.exports = /*@ngInject*/ function RenameProject($scope, projectAPI) {

  $scope.editName = function () {

    if (!$scope.projectName) {
      $scope.error = 'project name is required';
      return;
    }

    $scope.loading = true;

    // variable to hold starting edition promise
    var editionPromise;

    if ($scope.renameDomain) {
      // start the edition by setting safeName
      editionPromise = projectAPI.setProjectSafeName($scope.project.id, $scope.projectName);
    } else {
      editionPromise = Q();
    }

    editionPromise
      .then(function () {
        // change the project's name
        return projectAPI.updateProject($scope.project.id, {
          name: $scope.projectName
        });
      })
      .then(function () {
        // call main scope's loadProject method
        // to ensure the data is up to date
        return $scope.loadProject();
      })
      .then(function () {
        $scope.closeThisDialog();

        $scope.loading = false;

        $scope.$apply();
      }, function (err) {


        $scope.error = err.response.body.error.message;

        $scope.loading = false;
        $scope.$apply();
      })
  };
};