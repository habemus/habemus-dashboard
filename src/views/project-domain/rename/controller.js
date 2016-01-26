'use strict';


module.exports = /*@ngInject*/ function ($scope, $translate, $stateParams, loadingDialog, projectAPI) {
  
  $scope.setProjectSafeName = function () {

    var newSafeName = $scope.newSafeName;

    if (!newSafeName) {
      $translate('projectDomain.rename.safeNameRequired')
        .then(function (message) {
          $scope.error = message;
        });
        
      return;
    }

    if (newSafeName === $scope.project.safeName) {
      return;
    }

    $translate('projectDomain.rename.renaming')
      .then(function (message) {
        loadingDialog.open({
          message: message,
        });
      })

    projectAPI.setProjectSafeName($scope.project.id, newSafeName)
      .then(function (res) {

        // clear newSafeName
        $scope.newSafeName = '';

        return $scope.loadProject();

        console.log('success', res);
      }, function (err) {

        loadingDialog.close();

        $translate('projectDomain.rename.serverError')
          .then(function (message) {
            $scope.error = message;
          })
      })
      .then(function () {
        loadingDialog.close();
      });
  };
};