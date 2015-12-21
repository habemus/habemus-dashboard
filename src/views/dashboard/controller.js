'use strict';

var fs = require('fs');
var path = require('path');

// external dependencies
var generator = require('project-name-generator');

module.exports = /*@ngInject*/ function DashboardCtrl($scope, ngDialog, projectAPI, $state) {
  
  // initial find
  projectAPI.find()
    .then(function (projects) {
      
      $scope.currentUserProjects = projects || [];

      $scope.$apply();
    });
  
  
  // navigate to project
  $scope.navigateToProject = function(projectId) {
  
    $state.go("project.general", {projectId:projectId});
    
  }
  
  

  // method to create a new project
  $scope.createProject = function () {
//    ngDialog.open({
//      template: fs.readFileSync(path.join(__dirname, '../create-project/template.html'), 'utf-8'),
//      plain: true,
//      controller: require('../create-project/controller'),
//
//      preCloseCallback: function (data) {
//
//        if (data && data.name) {
//          projectAPI.create({
//            safeName: generator({ words: 2 }).dashed,
//            name: data.name
//          })
//          .then(function (project) {
//
//            $scope.currentUserProjects.unshift(project);
//
//            $scope.$apply();
//          })
//          .done();
//        }
//      }
//    });
    
    var nameForProject = generator({ words: 2 });
    
    projectAPI.create({
      safeName: nameForProject.dashed,
      name: nameForProject.spaced,
    })
    .then(function (parseResponse) {
      
      window.parseResponse = parseResponse;
//      console.log(parseResponse);
      
      $scope.navigateToProject(parseResponse.objectId);
      
    })
    
  };
};