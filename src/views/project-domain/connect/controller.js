'use strict';


module.exports = /*@ngInject*/ function tabCtrlDomainConnect ($scope, $state, $stateParams, projectAPI) {
//  $scope.domain = $stateParams.domain;
//  console.log($stateParams.domain);
  
  $scope.errorMessage = '';
  
  $scope.saveConnection = function() {
    var name = $scope.domainName
//    console.log(name);
    
    // validate input
    if(name != undefined || name != null){
      $scope.errorMessage = '';
      console.log(name);
      
      projectAPI.addDomainToProject($scope.project.id, {
        name: name
      })
      .then(function (res) {
        $state.go("project.domain.dns", {inProgress: true});

      }, function (err) {
        console.log('failed to add domain');
        console.error(err);

        alert('failed to add domain');
      })
      
    } else {
      console.log("failed to add domain");    
      $scope.errorMessage = "insira o nome do domínio que você possui";
    };
    
    // save
    
//    projectAPI.addDomainToProject($scope.project.id, {
//      name: name
//    })
//    .then(function (res) {
//
//    }, function (err) {
//      console.log('failed to add domain');
//      console.error(err);
//
//      alert('failed to add domain');
//    })
  };
  
};