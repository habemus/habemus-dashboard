'use strict';

var path = require('path');
var auxiliary = require('./auxiliary');

// load models
var DirectoryData = require('../../models/file-system/directory');


module.exports = function ProjectCtrl($scope, $stateParams, projectAPI, auth, $timeout) {

  var projectId = $stateParams.projectId;

  /**
   * Data store related to the project
   * @type {Object}
   */
  var project = $scope.project = {
    rootDirectory: new DirectoryData('/'),
  };

  function _genFileUrl(fileData) {
    return 'http://localhost:5001/project/' + project.safeName + fileData.getAbsolutePath();
  }

  /**
   * Options to be passed to angular-ui-tree
   * @type {Object}
   */
  $scope.uiTreeOptions = {
    accept: function(sourceNodeScope, destNodesScope, destIndex) {
      return true;
    },
  };

  $scope.uploadFiles = function (dir, droppedFiles) {
    var dirpath = dir.getAbsolutePath();

    droppedFiles.forEach(function (droppedFileData, index) {

      // add to the system
      var fileData = dir.addFile(droppedFileData.path, droppedFileData);

      $scope.$apply();

      var filepath = fileData.getAbsolutePath();

      setTimeout(function () {

        projectAPI.writeFile(projectId, filepath, droppedFileData.file)
          .then(function () {
            
            var fileUrl  = _genFileUrl(fileData);

            fileData.setData('url', fileUrl);

            fileData.setData('uploadProgress', undefined);

            fileData.setData('uploadMessage', 'upload done!');
            $timeout(function () {
              fileData.setData('uploadMessage', undefined);
            }, 2000);

            $scope.$apply();
          })
          .progress(function (e) {

            fileData.setData('uploadProgress', e.completed);

            if (e.completed === 1) {
              fileData.setData('uploadMessage', 'finishing upload');
            }

            $scope.$apply();
          })
          .done();

      }, 1000 * index);
    });
  };

  /**
   * @param  {[type]} dir [description]
   * @return {[type]}     [description]
   */
  $scope.toggleDirectory = function (uiTreeScope, dir) {
    // check if the data is already loaded
    if (!dir.isEmpty) {

      uiTreeScope.toggle();

    } else {

      dir.setData('isLoading', true);

      projectAPI.readdir(projectId, dir.getAbsolutePath())
        .then(function (entries) {

          dir.setData('isLoading', false);

          entries.forEach(function (entry) {
            if (entry.type === 'directory') {
              dir.addDirectory(entry.path, entry);
            } else if (entry.type === 'file') {
              var fileData = dir.addFile(entry.path, entry);
              var fileUrl  = _genFileUrl(fileData);

              fileData.setData('url', fileUrl);
            }
          });

          uiTreeScope.$apply();

          uiTreeScope.expand();
        }, function (err) {

          dir.setData('isLoading', false);
          console.warn('failed to open directory', err);
        })
        .done();
    }
  };

  /**
   * [openFile description]
   * @param  {[type]} file [description]
   * @return {[type]}      [description]
   */
  $scope.openFile = function (file) {
    console.log('openFile', file);
  };

  // retrieve the requested project
  projectAPI
    .get(projectId)
    .then(function (project) {
      $scope.project.id       = project.objectId;
      $scope.project.name     = project.name;
      $scope.project.safeName = project.safeName;
      $scope.$apply();
    }, function (err) {
      console.warn('get project failed')
    })
    .done();

  // retrieve project dir listing
  // projectAPI.readdir(projectId, '/')
  //   .then(function (entries) {

  //     entries.forEach(function (entry) {

  //       if (entry.type === 'directory') {
  //         $scope.project.rootDirectory.addDirectory(entry.path);
  //       } else if (entry.type === 'file') {
  //         var fileData = $scope.project.rootDirectory.addFile(entry.path, entry);
  //         var fileUrl  = _genFileUrl(fileData);
  //         fileData.setData('url', fileUrl);
  //       }

  //     });

  //     $scope.$apply();
  //   }, function (err) {
  //     console.warn('readdir failed');
  //   })
  //   .done();

  // read everything upfront
  projectAPI.readdirDeep(projectId, '/')
    .then(function (entries) {

      entries.forEach(function (entry) {

        if (entry.type === 'directory') {
          $scope.project.rootDirectory.addDirectory(entry.path);
        } else if (entry.type === 'file') {
          var fileData = $scope.project.rootDirectory.addFile(entry.path, entry);
          var fileUrl  = _genFileUrl(fileData);
          fileData.setData('url', fileUrl);
        }

      });

      $scope.$apply();
    }, function (err) {
      console.warn('readdirDeep failed');
    })
    .done();
};