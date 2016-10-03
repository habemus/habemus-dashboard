'use strict';


module.exports = /*@ngInject*/ function ($scope, $translate, $state, $stateParams, uiHAccountDialog, uiDialogLoading, apiHProject) {
  
  $scope.updateCode = function () {

    var newCode = $scope.newCode;

    if (!newCode) {
      $translate('projectDomain.rename.safeNameRequired')
        .then(function (message) {
          $scope.error = message;
        });
        
      return;
    }

    if (newCode === $scope.project.code) {
      return;
    }

    $translate('projectDomain.rename.renaming')
      .then(function (message) {
        uiDialogLoading.open({
          message: message,
        });
      })

    apiHProject.updateCode(
      uiHAccountDialog.getAuthToken(),
      $scope.project.code,
      newCode,
      {
        byCode: true
      }
    )
    .then(function (projectData) {

      // clear newCode
      $scope.newCode = '';
      $scope.$apply();

      // code was changed, we have to navigate to a new url
      $state.go('project.domain.rename', { projectCode: projectData.code });

    }, function (err) {

      uiDialogLoading.close();

      $translate('projectDomain.rename.serverError')
        .then(function (message) {
          $scope.error = message;
        })
    })
    .then(function () {
      uiDialogLoading.close();
    });
  };
};