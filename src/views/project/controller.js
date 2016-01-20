'use strict';

// native
var path = require('path');
var fs   = require('fs');

// third-party
var _    = require('lodash');
var Q    = require('q');

// load models
var DirectoryData = require('../../models/file-system/directory');

module.exports = /*@ngInject*/ function ProjectCtrl($scope, $state, $stateParams, $rootScope, projectAPI, zipper, auth, $timeout, ngDialog, CONFIG) {

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
        return $scope.loadProject();
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

        $scope.loadProject();
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


  /**
   * Delete Project
   */
  $scope.fakeDeleteProject = function () {
    
    ngDialog.openConfirm({
      template: '<input ng-model="test"><button ng-click="verifyAndConfirm()"> confirmar</button><button ng-click="closeThisDialog()">cancel</button>',
      plain: true,
      
      controller: function ($scope) {
        
        $scope.verifyAndConfirm = function () {
          
          if ($scope.test === 'oi') {
            $scope.confirm();
          } else {
            console.log('voce errou');
          }
          
        }
        
      }
    })
    .then(function handleSuccess() {
      
      $('.loading-state').addClass('active');
      
      
      console.log('confirm start deletion');
      setTimeout(function () {
        console.log('confirm finished deletion');
        $('.loading-state').removeClass('active');
      }, 3000);
    }, function handleCancel() {
      console.log('cancel')
    });
    
  };
//  $scope.deleteProject = function () {
//    ngDialog.openConfirm({
//      template: fs.readFileSync(path.join(__dirname, '../project-delete/template.html'), 'utf-8'),
//      plain: true,
//      className: 'ngdialog-theme-habemus',
//      controller: require('../project-delete/controller'),
//    })
//    .then(function() {
//      $('.loading-state').addClass('active');
//
//      projectAPI.deleteProject(projectId)
//      .then(function () {
//
//        // go back to dashboard, the project won't exist anymore
//        $state.go('dashboard');
//
//        $('.loading-state').removeClass('active');
//
//      }, function (err) {
//
//        console.warn('failed to delete project', err);
//
//        $('.loading-state').removeClass('active');
//
//      })
//      .done();
//    }, function() {
//      console.log("don't delete");
//    });
//  }
  
  
  $scope.deleteProject = function () {
    ngDialog.open({ 
      template: fs.readFileSync(path.join(__dirname, '../project-delete/template.html'), 'utf-8'),
      plain: true,
      className: 'ngdialog-theme-habemus',
      controller: require('../project-delete/controller'),
      scope: $scope,
    });
  }
    
  
//  // delete project
//  $scope.deleteProject = function () {
//    $('.loading-state').addClass('active');
//
//    projectAPI.deleteProject(projectId)
//      .then(function () {
//
//        // go back to dashboard, the project won't exist anymore
//        $state.go('dashboard');
//
//        $('.loading-state').removeClass('active');
//
//      }, function (err) {
//
//        console.warn('failed to delete project', err);
//
//        $('.loading-state').removeClass('active');
//
//      })
//      .done();
//  }


  $scope.loadProject();
};