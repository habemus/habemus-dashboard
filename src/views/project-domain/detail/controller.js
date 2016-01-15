'use strict';

// native
var path = require('path');
var fs   = require('fs');

// third-party
var _    = require('lodash');


module.exports = /*@ngInject*/ function tabCtrlDomainDetail($scope, $stateParams, $state, ngDialog, projectAPI) {
  $scope.domain = $stateParams.domain;
  
//  console.log("tudo certo!");
  
  /**
   * Disconnect domain
   */
  $scope.disconnectDomain = function () {
    ngDialog.openConfirm({
      template: fs.readFileSync(path.join(__dirname, '../disconnect/template.html'), 'utf-8'),
      plain: true,
      className: 'ngdialog-theme-habemus',
      controller: require('../disconnect/controller'),
      scope: $scope,
    })
    .then(function () {

      $(".loading-state").addClass("active");

      return projectAPI.deleteDomainRecord($scope.project.id, $scope.domain.objectId);
      
    }, function () {

      // disconnect cancelled

    })
    .then(function (parseResponse) {

      return $scope.loadProject($scope.project.id);
    })
    .then(function () {
      $state.go('project.domain.info');
      $('.loading-state').removeClass('active');
    });
  }
};


