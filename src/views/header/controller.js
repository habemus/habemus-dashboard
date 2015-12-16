'use strict';


module.exports = /*@ngInject*/ function HeaderCtrl($scope, $stateParams, $state, auth) {
  
  setTimeout( function() {
    console.log($scope.currentUser);  
  }, 1000);
  
  
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
        $state.go('login');
      });
  };
  
};