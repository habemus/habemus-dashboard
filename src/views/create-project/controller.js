'use strict';

module.exports = /*@ngInject*/ function CreateProjectCtrl($scope) {

  $scope.createProject = function () {
    $scope.closeThisDialog({
      name: $scope.name
    });
  }
};