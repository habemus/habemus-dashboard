'use strict';


module.exports = /*@ngInject*/ function HeaderCtrl($scope, $stateParams, $state, $translate, auth) {
  
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
  
};