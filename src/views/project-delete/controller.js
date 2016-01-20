'use strict';

// native
var path = require('path');
var fs   = require('fs');

// third-party
var _    = require('lodash');
var Q    = require('q');

// load models
var DirectoryData = require('../../models/file-system/directory');


module.exports = /*@ngInject*/ function projectDeleteCtrl($scope, $stateParams, $state, $translate, auth, ngDialog, projectAPI) {
  
  $scope.verifyAndConfirm = function () {
          
    if ($scope.projectName === $scope.project.name) {
      $scope.loading = true;

      projectAPI.deleteProject($scope.project.id)
      .then(function () {

        // go back to dashboard, the project won't exist anymore

        $scope.loading = false;
        
        $scope.showMessage = true;
        $scope.message = "projeto deletado com sucesso";
        
        $scope.$apply();
        
        $state.go('dashboard');
        
        setTimeout(function () {
          $scope.closeThisDialog();
        }, 2000);

      }, function (err) {

        console.warn('failed to delete project', err);

        $scope.loading = false;
        
        $scope.showMessage = true;
        $scope.message = "falha ao deletar o projeto. Tente novamente.";
        
      })
    } else {
      console.log('voce errou');
    }

  }
};