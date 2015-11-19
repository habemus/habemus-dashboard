'use strict';

module.exports = function ProjectCtrl($scope, $stateParams, projectService, userService) {

  var projectId = $stateParams.projectId;

  $scope.project = {};

  // ng-flow configurations
  $scope.uploadConfigurations = {
    // request headers
    headers: function (flowFile) {
      return {
        'X-Project-Id': projectId,
        'X-Project-Safe-Name': $scope.project.safeName,
        'X-Auth-Token': userService.current().getSessionToken(),
      };
    },

    // to be added to request body
    query: function (flowFile) {
      return {
        relativePath: flowFile.relativePath
      }
    },
  };

  projectService
    .get(projectId)
    .then(function (project) {
      $scope.project.id = project.objectId;
      $scope.project.name = project.name;
      $scope.project.safeName = project.safeName;

      $scope.$apply();
    })
    .fail(function (err) {
      alert('get project failed')
    });
};