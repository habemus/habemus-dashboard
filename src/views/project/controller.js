'use strict';

// native
var path = require('path');
var fs   = require('fs');

// load models
var DirectoryData = require('../../models/file-system/directory');

module.exports = /*@ngInject*/ function ProjectCtrl($scope, $state, $stateParams, projectAPI, auth, $timeout, ngDialog, CONFIG) {

  var projectId = $stateParams.projectId;

  /**
   * Data store related to the project
   * @type {Object}
   */
  var project = $scope.project = {
    rootDirectory: new DirectoryData('/'),
    domains: [],
  };

  // retrieve the requested project
  projectAPI
    .getProjectById(projectId)
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
      $scope.$apply();
    }, function (err) {
      console.warn('failed to retrieve domains from project');
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