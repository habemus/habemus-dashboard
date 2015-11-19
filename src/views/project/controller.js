'use strict';

module.exports = function ProjectCtrl($scope, $stateParams, projectService, userService) {

  var projectId = $stateParams.projectId;

  $scope.project = {};

  // ng-flow configurations
  $scope.uploadConfigurations = {
    target: 'http://localhost:5000/file',
    permanentErrors:[404, 500, 501],

    fileParameterName: 'files',
    testChunks: false,

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



  // ui.tree study
  $scope.list = [
    {
      "id": 30,
      "title": "3. unicorn-zapper.1",
      "items": [
        {
          "id": 300,
          "title": "3. unicorn-zapper.1.1",
          "items": []
        },
        {
          "id": 301,
          "title": "3. unicorn-zapper.1.2",
          "items": []
        },
        {
          "id": 302,
          "title": "3. unicorn-zapper.1.3",
          "items": []
        },
        {
          "id": 303,
          "title": "3. unicorn-zapper.1.4",
          "items": []
        }
      ]
    },
    {
      "id": 3,
      "title": "3. unicorn-zapper",
      "items": []
    }
  ];
};