'use strict';


function validateDomainName(name) {

  if (!name) {
    return 'insira o nome do domínio que você possui';
  }

  if (name.split('.').length < 2) {
    return 'domínio inválido';
  }
}

module.exports = /*@ngInject*/ function tabCtrlDomainConnect ($scope, $state, $stateParams, projectAPI) {
  // reset error message
  $scope.errorMessage = '';
  
  $scope.saveConnection = function () {
    var name = $scope.domainName;

    // make sure the registered domain does not start with www
    name = name.replace(/^www\./, '');
    
    var error = validateDomainName(name);
    
    // validate input
    if (!error) {

      $('.loading-state').addClass('active');
      
      projectAPI.createDomainRecord($scope.project.id, {
        hostname: name
      })
      .then(function (domain) {

        // add to domainRecords owned by the project
        $scope.project.domainRecords.push(domain);

        $state.go('project.domain.dns', {
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
      })
      .finally(function () {
        $('.loading-state').removeClass('active');
      });
      
    } else {

      $scope.errorMessage = error;
    };
  };
  
};