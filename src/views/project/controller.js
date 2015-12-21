'use strict';

// native
var path = require('path');
var fs   = require('fs');

// load models
var DirectoryData = require('../../models/file-system/directory');


module.exports = /*@ngInject*/ function ProjectCtrl($scope, $state, $stateParams, projectAPI, auth, $timeout, ngDialog, CONFIG) {

//  console.log($state);
  
  var projectId = $stateParams.projectId;

  /**
   * Data store related to the project
   * @type {Object}
   */
  var project = $scope.project = {
    rootDirectory: new DirectoryData('/'),
    domains: [],
  };

  function _genFileUrl(fileData) {
    return CONFIG.router.location + '/project/' + project.safeName + fileData.getAbsolutePath();
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

            fileData.setProgress(e.completed);

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
//    console.log('openFile', file);
  };

  // retrieve the requested project
  projectAPI
    .get(projectId)
    .then(function (project) {
      $scope.project.id        = project.objectId;
      $scope.project.name      = project.name;
      $scope.project.safeName  = project.safeName;
      $scope.project.createdDate = project.createdAt;


      $scope.$apply();
    }, function (err) {
      console.warn('get project failed')
    })
    .done();


  // retrieve domains related to the project
  projectAPI.getProjectDomains(projectId)
    .then(function (domains) {
      $scope.project.domains = domains || [];
    }, function (err) {
      console.warn('failed to retrieve domains from project');
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


  /**
   * Domain adding
   */
  $scope.addDomainToProject = function () {
    ngDialog.open({
      template: fs.readFileSync(path.join(__dirname, '../add-domain/template.html'), 'utf-8'),
      plain: true,
      controller: require('../add-domain/controller'),

      preCloseCallback: function (data) {

        if (data && data.name) {
          projectAPI.addDomainToProject($scope.project.id, {
            name: data.name
          })
          .then(function (res) {

            $scope.project.domains.unshift(data);

            $scope.$apply();

          }, function (err) {
            console.log('failed to add domain');
            console.error(err);

            alert('failed to add domain');
          })
        }
      }
    });

  }
};