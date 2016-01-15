'use strict';

// native
var path = require('path');
var fs   = require('fs');

// third-party
var _    = require('lodash');
var Q    = require('q');

// load models
var DirectoryData = require('../../models/file-system/directory');

module.exports = /*@ngInject*/ function ProjectCtrl($scope, $state, $stateParams, projectAPI, zipper, auth, $timeout, ngDialog, CONFIG) {

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
  $scope.loadProject = function (projectId) {
    // retrieve the requested project
    var projectDataPromise = projectAPI
      .getProjectById(projectId)
      .then(function (project) {

        _.assign($scope.project, project);

        $scope.project.id        = project.objectId;
        $scope.project.name      = project.name;
        $scope.project.safeName  = project.safeName;
        $scope.project.createdDate = project.createdAt;

        $scope.$apply();
      }, function (err) {
        console.warn('get project failed')
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

//      preCloseCallback: function (data) {
//
//        if (data && data.name) {
//          projectAPI.addDomainToProject($scope.project.id, {
//            name: data.name
//          })
//          .then(function (res) {
//
//            $scope.project.domainRecords.unshift(data);
//
//            $scope.$apply();
//
//          }, function (err) {
//            console.log('failed to add domain');
//            console.error(err);
//
//            alert('failed to add domain');
//          })
//        }
//      }
    });
  }

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

            $scope.project.domainRecords.unshift(data);

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

  /**
   * File updating
   */
  $scope.uploadNewVersion = function (files) {
    var zip = zipper.create();

    files.forEach(function (fData) {
      zip.file(fData.path, fData.file);
    });

    
    // loading state starts
    $(".loading-state").addClass("active");


    return zip.generate()
      .then(function (zipFile) {

        console.log('zip file generated', zipFile);
        // upload
        var upload = projectAPI.uploadProjectZip(projectId, zipFile);

        upload.progress(function (progress) {
          console.log('upload progress ', progress);
          
          // progress %
          $(".progress").text(parseInt(progress.completed * 100) + "%");
        });

        return upload;

      })
      .then(function () {
        return $scope.loadProject(projectId);
      })
      .finally(function () {

        // loading state ends
        $(".loading-state").removeClass("active");
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
    $(".loading-state").addClass("active");

    return projectAPI
      .generateDownload($scope.project.id, versionName)
      .then(function (url) {

        // loading state starts
        $(".loading-state").removeClass("active");

        // http://stackoverflow.com/questions/1066452/easiest-way-to-open-a-download-window-without-navigating-away-from-the-page
        window.location.assign(url);

      }, function (err) {
        console.warn('failed to retrieve download url');
      });
  };

  $scope.restoreProjectVersion = function (versionName) {

    // loading state starts
    $(".loading-state").addClass("active");

    return projectAPI.restoreVersion($scope.project.id, versionName)
      .then(function (res) {

        $scope.loadProject(projectId);
        console.log(res);
      }, function (err) {
        console.warn('failed to restore version');
      })
      .then(function () {
        // loading state starts
        $(".loading-state").removeClass("active");
      })

    // console.log('restore to %s', versionName);
  }




  $scope.loadProject(projectId);
};