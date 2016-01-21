'use strict';

// native
var path = require('path');
var fs   = require('fs');

// third-party
var _    = require('lodash');


module.exports = /*@ngInject*/ function tabCtrlDomainDetail($scope, $stateParams, $state, ngDialog, projectAPI, loadingDialog) {
  $scope.domain = $stateParams.domain;
  
  /**
   * Disconnect domain
   */
  $scope.disconnectDomain = function () {
    ngDialog.openConfirm({
      template: fs.readFileSync(path.join(__dirname, '../disconnect/template.html'), 'utf-8'),
      plain: true,
      className: 'ngdialog-theme-habemus',
      scope: $scope,
    })
    .then(function () {

      loadingDialog.open({
        message: 'disconnecting domain'
      });

      return projectAPI.deleteDomainRecord(
        $scope.project.id,
        $scope.domain.objectId
      )
      .then(function (parseResponse) {

        return $scope.loadProject($scope.project.id);
      })
      .then(function () {
        $state.go('project.domain.info');

        loadingDialog.close();
      });
      
    }, function () {

      // disconnect cancelled

    })
  }
};


