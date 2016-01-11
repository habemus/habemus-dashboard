'use strict';

module.exports = /*@ngInject*/ function disconnectDomain($scope) {

  $scope.disconnectDomain = function () {
    console.log("disconnect");
    $scope.closeThisDialog({
      name: $scope.name
    });
  };
  
//  setTimeout(function () {
//    $scope.loading = true;
//    $scope.$apply();
//  }, 2000);
};