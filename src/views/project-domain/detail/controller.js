'use strict';

// native
var path = require('path');
var fs   = require('fs');

module.exports = /*@ngInject*/ function tabCtrlDomainDetail($scope, $stateParams, $state, ngDialog, apiHWebsite, uiHAccountDialog, uiDialogLoading) {
  $scope.domainRecord = $stateParams.domainRecord;
  
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

      uiDialogLoading.open({
        message: 'disconnecting domain'
      });

      return apiHWebsite.deleteDomainRecord(
        uiHAccountDialog.getAuthToken(),
        $scope.project._id,
        $scope.domainRecord._id
      )
      .then(function () {

        return $scope.loadDomainRecords();
      })
      .then(function () {
        $state.go('project.domain.info');

        uiDialogLoading.close();
      });
      
    }, function () {

      // disconnect cancelled

    })
  }
};


