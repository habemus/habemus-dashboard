'use strict';

module.exports = /*@ngInject*/ function RenameProject($scope) {

  $scope.editName = function () {
    $scope.closeThisDialog({
      name: $scope.name
    });
  };
  
//  setTimeout(function () {
//    $scope.loading = true;
//    $scope.$apply();
//  }, 2000);
};