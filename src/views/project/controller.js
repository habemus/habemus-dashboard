'use strict';

module.exports = function ProjectCtrl($scope, $stateParams) {
  $scope.project = {
    id: $stateParams.projectId,
  };
};