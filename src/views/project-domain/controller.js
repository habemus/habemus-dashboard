'use strict';


module.exports = /*@ngInject*/ function tabCtrlDomain($scope, $stateParams, apiHWebsite, apiHProject, uiHAccountDialog) {

  uiHAccountDialog.ensureUser({ ensureEmailVerified: true })
    .then(function (user) {
      return $scope.loadDomainRecords();
    });

  $scope.loadDomainRecords = function () {

    var authToken = uiHAccountDialog.getAuthToken();

    return apiHProject.get(authToken, $stateParams.projectCode, {
      byCode: true
    })
    .then(function (project) {
      var projectId = $scope.project._id;

      // retrieve the requested project
      return apiHWebsite.listDomainRecords(authToken, projectId);
    })
    .then(function (domainRecords) {
      $scope.domainRecords = domainRecords;
    });
  };
  
};