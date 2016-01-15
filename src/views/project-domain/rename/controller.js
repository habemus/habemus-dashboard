'use strict';


module.exports = /*@ngInject*/ function ($scope, $stateParams, projectAPI) {
  
  $scope.setProjectSafeName = function (newSafeName) {

    $('.loading-state').addClass('active');

    projectAPI.setProjectSafeName($scope.project.id, newSafeName)
      .then(function (res) {

        return $scope.loadProject($scope.project.id);

        console.log('success', res);
      }, function (err) {
        
        $('.loading-state').removeClass('active');
        console.warn('failed', err);
      })
      .then(function () {

        $('.loading-state').removeClass('active');
        console.log('update finished');
      });
  };
};