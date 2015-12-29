'use strict';

var fs = require('fs');
var path = require('path');

// external dependencies
var generator = require('project-name-generator');

module.exports = /*@ngInject*/ function DashboardCtrl($scope, projectAPI, $state, zipper) {
  
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
  $scope.createProject = function (files) {

    var zip = zipper.create();

    files.forEach(function (fData) {
      zip.file(fData.path, fData.file);
    });

    // generate a name for the the project
    var nameForProject = generator({ words: 2 });
    
    // create an entry for the project
    projectAPI.create({
      safeName: nameForProject.dashed,
      name: nameForProject.spaced,
    })
    .then(function (parseResponse) {
      
      console.log('project created at parse', parseResponse);

      // generate the zip file
      return zip.generate()
        .then(function (zipFile) {

          console.log('zip file generated', zipFile);
          // upload
          var uploadPromise = projectAPI.uploadProjectZip(parseResponse.objectId, zipFile);

          uploadPromise.progress(function (progress) {
            console.log('upload progress ', progress);
          });

          return uploadPromise;
        })
        .then(function () {
          // navigate to the project view
          $scope.navigateToProject(parseResponse.objectId);
        });
    })
    .done();
  };
};