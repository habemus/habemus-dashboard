'use strict';

var Parse = require('parse');

module.exports = function CreateProjectCtrl($scope) {

  $scope.createProject = function () {
    $scope.closeThisDialog({
      name: $scope.name
    });
  }
};