'use strict';


module.exports = /*@ngInject*/ function tabCtrlDomain($scope, $stateParams, apiHWebsite, apiHProject, uiHAccountDialog) {

  uiHAccountDialog.ensureUser({ ensureEmailVerified: true })
    .then(function (user) {
      return $scope.loadDomainRecords();
    });
  
};