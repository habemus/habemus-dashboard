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

        $scope.loading = false;
        
        $scope.hideContent = true;
        $scope.showSuccessMessage = true;
        $scope.message = "projeto excluído com sucesso";
        
        $scope.$apply();
 
        // go back to dashboard, the project won't exist anymore
        $state.go('dashboard');
        
        setTimeout(function () {
          $scope.closeThisDialog();
        }, 2500);

      }, function (err) {

        console.warn('failed to delete project', err);

        $scope.loading = false;
        
        $scope.hideContent = true;
        $scope.showErrorMessage = true;
        $scope.message = "falha ao deletar o projeto. Tente novamente.";
        
      })
    } else {
      console.log('voce errou');
    }

  }
};