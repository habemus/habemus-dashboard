'use strict';


module.exports = /*@ngInject*/ function HeaderCtrl($scope, $stateParams, $state, $translate, uiHAccountDialog, uiIntro) {
  
  $scope.menuIsOpen = false;
  
  $scope.toggleMenu = function () {
    if ($scope.menuIsOpen) {
      $scope.menuIsOpen = false;
    } else {
      $scope.menuIsOpen = true; 
    }
  }
  
  $scope.logOut = function () {
    uiHAccountDialog.logOut()
      .then(function () {
        window.location.href = "http://habem.us";
      });
  };

  $scope.setLanguage = function (lng) {
    $translate.use(lng);
  };
  
  $scope.startIntro = function () {
    var currentState = $state.current;
    
    if (currentState.name == 'dashboard'){

      uiIntro.dashboard().then(function (dashboardIntro) {
        dashboardIntro.start();
      });

    } else if (currentState.name == 'project.general') {

      uiIntro.project().then(function (projectIntro) {
        projectIntro.start();
      });

    } else if (currentState.name.substr(0,7) == 'project') {
      $state.go('project.general');

      uiIntro.project().then(function (projectIntro) {
        projectIntro.start();
      });
      
    }
  }
  
};