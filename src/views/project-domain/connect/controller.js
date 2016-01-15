'use strict';


module.exports = /*@ngInject*/ function tabCtrlDomainConnect ($scope, $state, $stateParams, projectAPI) {
  // reset error message
  $scope.errorMessage = '';
  
  $scope.saveConnection = function () {
    var name = $scope.domainName;
    
    // validate input
    if(name != undefined || name != null) {
      
      projectAPI.createDomainRecord($scope.project.id, {
        hostname: name
      })
      .then(function (domain) {

        // add to domainRecords owned by the project
        $scope.project.domainRecords.push(domain);

        $state.go("project.domain.dns", {
          inProgress: true,
          domain: domain
        });

      }, function (err) {

        if (err.code == 142) {
          $scope.errorMessage = 'este domínio já está cadastrado em nosso sistema. caso você seja o proprietário, por favor entre em contato conosco: suporte@habem.us';
        } else {
          $scope.errorMessage = 'ocorrreu um erro :/ por favor tente novamente mais tarde';
        }

        $scope.$apply();
      });
      
    } else {
      $scope.errorMessage = "insira o nome do domínio que você possui";
    };
  };
  
};