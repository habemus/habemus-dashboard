'use strict';


module.exports = /*@ngInject*/ function tabCtrlDomainDns ($scope, $stateParams) {
//  $scope.domain = $stateParams.domain;
  console.log($stateParams);
  
  $scope.inProgress = $stateParams.inProgress;
  
  
};