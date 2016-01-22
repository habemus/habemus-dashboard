'use strict';

module.exports = /*@ngInject*/ function tabCtrlDomainConnect ($scope, $state, $stateParams, $translate, projectAPI, loadingDialog) {
  // reset error message
  $scope.errorMessage = '';
  

  /**
   * Auxiliary function that validates the domain name on the client side
   * @param  {String} name
   * @return {Promise->String|Null}      Error message
   */
  function _validateDomainName(name) {

    if (!name) {
      return $translate('domainInvalid.empty');
    }

    if (name.split('.').length < 2) {
      return $translate('domainInvalid.invalid');
    }
  }

  $scope.saveConnection = function () {
    var name = $scope.domainName || '';

    // make sure the registered domain does not start with www
    name = name.replace(/^www\./, '');
    
    var error = _validateDomainName(name);
    
    // validate input
    if (!error) {

      loadingDialog.open({
        message: 'connecting'
      });
      
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
        loadingDialog.close();
      });
      
    } else {

      error.then(function (errorMessage) {
        $scope.errorMessage = errorMessage
      });
    };
  };
  
};