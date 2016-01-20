'use strict';


module.exports = /*@ngInject*/ function ($scope, $stateParams, projectAPI) {
  
  $scope.setProjectSafeName = function () {

    var newSafeName = $scope.newSafeName;

    if (newSafeName === $scope.project.safeName) {
      return;
    }

    $('.loading-state').addClass('active');

    projectAPI.setProjectSafeName($scope.project.id, newSafeName)
      .then(function (res) {

        // clear newSafeName
        $scope.newSafeName = '';

        return $scope.loadProject();

        console.log('success', res);
      }, function (err) {
        
        $('.loading-state').removeClass('active');

        $scope.error = err.response.body.error.message;

        $scope.$apply();
      })
      .then(function () {

        $('.loading-state').removeClass('active');
      });
  };
};