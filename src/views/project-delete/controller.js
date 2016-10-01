'use strict';

// native
var path = require('path');
var fs   = require('fs');

// third-party
var Q    = require('q');

module.exports = /*@ngInject*/ function projectDeleteCtrl($scope, $stateParams, $state, $translate, ngDialog, uiHAccountDialog, apiHProject) {

  $scope.verifyAndConfirm = function () {

    if ($scope.projectName === $scope.project.name) {
      $scope.loading = true;

      apiHProject.scheduleRemoval(
        uiHAccountDialog.getAuthToken(),
        $stateParams.projectCode,
        {
          byCode: true
        }
      )
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