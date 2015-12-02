'use strict';

var Parse = require('parse');

module.exports = /*@ngInject*/ function CreateProjectCtrl($scope) {

  $scope.createProject = function () {
    $scope.closeThisDialog({
      name: $scope.name
    });
  }
};