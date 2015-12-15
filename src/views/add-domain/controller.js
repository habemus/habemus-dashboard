'use strict';

module.exports = /*@ngInject*/ function CreateProjectCtrl($scope) {

  $scope.addDomain = function () {
    $scope.closeThisDialog({
      name: $scope.name
    });
  }
};