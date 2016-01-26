'use strict';

// native
var path = require('path');
var fs   = require('fs');

// third-party
var _    = require('lodash');
var Q    = require('q');

// load models
var DirectoryData = require('../../models/file-system/directory');

module.exports = /*@ngInject*/ function ProjectCtrl($scope, $state, $stateParams, $rootScope, $translate, projectAPI, zipper, auth, $timeout, ngDialog, CONFIG, loadingDialog) {

  console.log('loadingDialog on ProjectCtrl', loadingDialog);

  var projectId = $stateParams.projectId;

  /**
   * Data store related to the project
   * @type {Object}
   */
  var project = $scope.project = {
    domainRecords: [],
  };
  
  /**
   * Project data loading
   */
  $scope.loadProject = function () {
    // retrieve the requested project
    var projectDataPromise = projectAPI
      .getProjectById(projectId)
      .then(function (project) {

        // set pageTitle
        $rootScope.pageTitle = project.name;

        _.assign($scope.project, project);

        $scope.project.id        = project.objectId;
        $scope.project.name      = project.name;
        $scope.project.safeName  = project.safeName;
        $scope.project.createdDate = project.createdAt;

        $scope.$apply();
      }, function (err) {

        // project loading failed due to some reason.
        // treat this better, for now just go to dashboard
        $state.go('dashboard');
      });


    // retrieve domainRecords related to the project
    var domainDataPromise = projectAPI.listProjectDomainRecords(projectId)
      .then(function (domainRecords) {
        $scope.project.domainRecords = domainRecords || [];
        $scope.$apply();
      }, function (err) {
        console.warn('failed to retrieve domainRecords from project');
      });

    return Q.all([projectDataPromise, domainDataPromise]);
  };

  /**
   * Name editing
   */
  $scope.editNameOfProject = function () {
    ngDialog.open({
      template: fs.readFileSync(path.join(__dirname, '../project-rename/template.html'), 'utf-8'),
      plain: true,
      className: 'ngdialog-theme-habemus',
      controller: require('../project-rename/controller'),
      scope: $scope,

      preCloseCallback: function () {
        $scope.loadProject();
      }
    });
  }

  /**
   * File updating
   */
  $scope.uploadNewVersion = function (files) {
    var zip = zipper.create();

    files.forEach(function (fData) {
      zip.file(fData.path, fData.file);
    });

    $translate('project.preparingUpload')
      .then(function (message) {
        // loading state starts
        loadingDialog.open({ message: message });
      });

    return zip.generate()
      .then(function (zipFile) {

        console.log('zip file generated', zipFile);

        $translate('project.uploading')
          .then(function (message) {
            loadingDialog.setMessage(message);
          });

        // upload
        var upload = projectAPI.uploadProjectZip(projectId, zipFile);

        upload.progress(function (progress) {
          console.log('upload progress ', progress);

          progress = parseInt(progress.completed * 100);

          // progress %
          loadingDialog.setProgress(progress);
          if (progress === 100) {
            $translate('project.finishingUpload')
              .then(function (message) {
                loadingDialog.setMessage(message);
              });
          }
        });

        return upload;

      })
      .then(function () {

        $translate('project.reloadingProjectData')
          .then(function (message) {
            loadingDialog.setMessage(message);
          });

        return $scope.loadProject();
      })
      .finally(function () {

        // loading state ends
        loadingDialog.close();
      })
      .done();
  };

  /**
   * Versioning
   * @param  {[type]} versionName [description]
   * @return {[type]}             [description]
   */
  $scope.downloadProjectVersion = function (versionName) {

    // loading state starts
    loadingDialog.open({
      message: 'preparing download'
    });

    return projectAPI
      .generateDownload($scope.project.id, versionName)
      .then(function (url) {

        loadingDialog.close();

        // http://stackoverflow.com/questions/1066452/easiest-way-to-open-a-download-window-without-navigating-away-from-the-page
        window.location.assign(url);

      }, function (err) {
        console.warn('failed to retrieve download url');
      });
  };

  $scope.restoreProjectVersion = function (versionName) {

    // loading state starts
    loadingDialog.open({
      message: 'restoring version ' + versionName
    });

    return projectAPI.restoreVersion($scope.project.id, versionName)
      .then(function (res) {

        loadingDialog.setMessage('reloading project data');

        return $scope.loadProject();
        console.log(res);
      }, function (err) {
        console.warn('failed to restore version');
      })
      .then(function () {
        // loading state starts
        loadingDialog.close();
      });
  }
  
  $scope.deleteProject = function () {
    ngDialog.open({ 
      template: fs.readFileSync(path.join(__dirname, '../project-delete/template.html'), 'utf-8'),
      plain: true,
      className: 'ngdialog-theme-habemus',
      controller: require('../project-delete/controller'),
      scope: $scope,
    });
  }

  $scope.loadProject();
};