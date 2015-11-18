'use strict';

var Parse = require('parse');

module.exports = function CreateProjectCtrl($scope, projectService) {

  $scope.createProject = function () {

    projectService.create({
      name: $scope.name
    })
    .then(function (project) {
      console.log('project creation successful');
    })
    .fail(function () {
      console.log('project creation failed');
    });
  }
};