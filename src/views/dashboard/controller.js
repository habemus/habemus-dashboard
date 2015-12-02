'use strict';

var fs = require('fs');
var path = require('path');

// external dependencies
var generator = require('project-name-generator');

module.exports = /*@ngInject*/ function DashboardCtrl($scope, ngDialog, projectAPI) {

  // initial find
  projectAPI.find()
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
          projectAPI.create({
            safeName: generator({ words: 2 }).dashed,
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