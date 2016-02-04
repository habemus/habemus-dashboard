'use strict';


module.exports = /*@ngInject*/ function HeaderCtrl($scope, $stateParams, $state, $translate, auth, intro) {
  
  $scope.menuIsOpen = false;
  
  $scope.toggleMenu = function () {
    if ($scope.menuIsOpen) {
      $scope.menuIsOpen = false;
    } else {
      $scope.menuIsOpen = true; 
    }
  }
  
  $scope.logOut = function () {
    auth.logOut()
      .then(function () {
        window.location.href = "http://habem.us";
      });
  };

  $scope.setLanguage = function (lng) {
    $translate.use(lng);
  };
  
  $scope.startIntro = function () {
    var currentState = $state.current;
//    console.log(currentState.name);
    
    if (currentState.name == 'dashboard'){
      intro.dashboard.start();
    } else if (currentState.name == 'project.general') {
      intro.project.start();
    } else if (currentState.name.substr(0,7) == 'project') {
      $state.go('project.general');
      intro.project.start();
    }
  }
  
};