'use strict';

var path = require('path');
var auxiliary = require('./auxiliary');

module.exports = function ProjectCtrl($scope, $stateParams, projectAPI, auth, $timeout) {

  var projectId = $stateParams.projectId;

  /**
   * Data store related to the project
   * @type {Object}
   */
  $scope.project = {};

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
    var dirpath = auxiliary.getFullPath(dir);
    
    droppedFiles.forEach(function (droppedFileData, index) {

      // set is empty to false
      dir.isEmpty = false;

      var fData = {
        path: droppedFileData.path,
        type: 'file',
      };
      dir.items.push(fData);

      $scope.$apply();

      var filepath = dirpath + '/' + droppedFileData.path;

      console.log('upload file ', filepath);

      setTimeout(function () {


        projectAPI.writeFile(projectId, filepath, droppedFileData.file)
          .then(function () {

            delete fData.uploadProgress;

            fData.uploadMessage = 'upload done!';
            $timeout(function () {
              delete fData.uploadMessage;
            }, 2000);

            $scope.$apply();
          })
          .progress(function (e) {

            fData.uploadProgress = e.completed;

            if (e.completed === 1) {
              fData.uploadMessage = 'finishing upload';
            }

            $scope.$apply();
          });

      }, 1000 * index)
    });
  };

  /**
   * @param  {[type]} dir [description]
   * @return {[type]}     [description]
   */
  $scope.toggleDirectory = function (scope, dir) {
    // check if the data is already loaded
    if (dir.items) {

      scope.toggle();

    } else {

      dir.isLoading = true;

      projectAPI.readdir(projectId, auxiliary.getFullPath(dir))
        .then(function (items) {

          dir.isLoading = false;

          // set parent onto items
          items.forEach(function (i) {
            i.parent = dir;
            i.collapsed = true;
            i.url = 'http://localhost:5001/project/' + $scope.project.safeName + '/' + auxiliary.getFullPath(i);
          });

          // set items onto directory
          dir.items = items;
          dir.isEmpty = (items.length === 0);

          $scope.$apply();

          scope.expand();
        }, function (err) {

          dir.isLoading = false;
          console.warn('failed to open directory', err);
        });
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
    })
    .fail(function (err) {
      console.warn('get project failed')
    });

  // retrieve project dir listing
  projectAPI.readdir(projectId, '/')
    .then(function (res) {
      $scope.project.filesystem = {
        path: '',
        items: res,
        isEmpty: (res.length === 0)
      };
      console.log(res);
      $scope.$apply();
    }, function (err) {
      console.warn('readdir failed');
    })
    .done();

  // projectAPI.readdirDeep(projectId, '/')
  //   .then(function (res) {

  //     console.log(auxiliary.parseFilesIntoUITree(res));

  //     $scope.project.filesystem = auxiliary.parseFilesIntoUITree(res).items
  //     // console.log(res);
  //     $scope.$apply();

  //     // console.log(res);

  //   }, function (err) {
  //     console.log(err);
  //     console.log('readdirDeep failed');
  //   })
  //   .done();
};