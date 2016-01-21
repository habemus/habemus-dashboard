'use strict';


module.exports = /*@ngInject*/ function ($scope, $stateParams, loadingDialog, projectAPI) {
  
  $scope.setProjectSafeName = function () {

    var newSafeName = $scope.newSafeName;

    if (newSafeName === $scope.project.safeName) {
      return;
    }

    loadingDialog.open({
      message: 'renaming project domain'
    });

    projectAPI.setProjectSafeName($scope.project.id, newSafeName)
      .then(function (res) {

        // clear newSafeName
        $scope.newSafeName = '';

        return $scope.loadProject();

        console.log('success', res);
      }, function (err) {

        loadingDialog.close();

        $scope.error = err.response.body.error.message;

        $scope.$apply();
      })
      .then(function () {
        loadingDialog.close();
      });
  };
};