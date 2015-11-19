'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function DashboardCtrl($scope, ngDialog, projectService) {

  // initial find
  projectService.find()
    .then(function (projects) {

      $scope.currentUserProjects = projects || [];

      $scope.$apply();
    });

  // method to create a new project
  $scope.createProject = function () {
    ngDialog.open({
      template: fs.readFileSync(path.join(__dirname, '../create-project/template.html'), 'utf-8'),
      plain: true,
      controller: require('../create-project/controller'),

      preCloseCallback: function (data) {

        if (data && data.name) {
          projectService.create({
            name: data.name
          })
          .then(function (project) {

            $scope.currentUserProjects.unshift(project);

            $scope.$apply();
          })
          .done();
        }
      }
    });
  };
};