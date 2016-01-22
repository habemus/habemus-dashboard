'use strict';

var fs = require('fs');
var path = require('path');

// external dependencies
var generator = require('project-name-generator');

module.exports = /*@ngInject*/ function DashboardCtrl($scope, projectAPI, $state, zipper, ngDialog, loadingDialog) {

  // retrieve all projects owned by the current logged user
  // and put them onto the scope as `currentUserProjects`
  projectAPI.findProjects()
    .then(function (projects) {
      $scope.currentUserProjects = projects || [];
      $scope.$apply();
    });
  
  /**
   * Navigate to the visualization of a given project
   * @param  {String} projectId
   */
  $scope.navigateToProject = function(projectId) {
    $state.go("project.general", {projectId:projectId});
  }

  /**
   * Creates a project given a set of files
   * @param  {Array -> FileDataObject} files 
   *         Array of file data objects, 
   *         as defined by models/file-system/file
   */
  $scope.createProject = function (files, projectName) {

    // loading state starts
    loadingDialog.open({
      message: 'preparing upload'
    });

    var zip = zipper.create();

    files.forEach(function (fData) {
      zip.file(fData.path, fData.file);
    });

    // generate a name for the the project if it is not passed
    // as argument
    projectName = projectName || generator({ words: 2 }).spaced;
    
    // create an entry for the project
    projectAPI.createProject({
      name: projectName,
    })
    .then(function (projectData) {
      
      console.log('project created at parse', projectData);

      // generate the zip file
      return zip.generate()
        .then(function (zipFile) {

          loadingDialog.setMessage('uploading');

          console.log('zip file generated', zipFile);
          // upload
          var upload = projectAPI.uploadProjectZip(projectData.objectId, zipFile);

          upload.progress(function (progress) {
            console.log('upload progress ', progress);
            
            // progress %
            loadingDialog.setProgress(parseInt(progress.completed * 100));
          });

          return upload;
        })
        .then(function () {
          // navigate to the project view
          $scope.navigateToProject(projectData.objectId);
        
          // loading state ends
          loadingDialog.close();    
        })
        .done();
    })
    .fail(function (err) {

      window.err = err;

      loadingDialog.close();
    })
    .done();
  };
  
};