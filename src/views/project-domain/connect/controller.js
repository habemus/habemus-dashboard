'use strict';

module.exports = /*@ngInject*/ function tabCtrlDomainConnect ($scope, $state, $stateParams, $translate, apiHWebsite, uiDialogLoading, uiHAccountDialog) {
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
    var domain = $scope.domainName || '';

    // make sure the registered domain does not start with www
    domain = domain.replace(/^www\./, '');
    
    var error = _validateDomainName(domain);
    
    // validate input
    if (!error) {

      uiDialogLoading.open({
        message: 'connecting'
      });

      uiHAccountDialog.ensureUser({ ensureEmailVerified: true })
        .then(function (user) {

          return apiHWebsite.createDomainRecord(
            uiHAccountDialog.getAuthToken(),
            $scope.project._id,
            {
              domain: domain
            }
          );

        })
        .then(function (domainRecord) {

          // add to domainRecords
          $scope.domainRecords.push(domainRecord);

          $state.go('project.domain.dns', {
            inProgress: true,
            domainRecord: domainRecord
          });

        }, function (err) {

          console.warn(err);

          if (err.code == 142) {
            $scope.errorMessage = 'este domínio já está cadastrado em nosso sistema. caso você seja o proprietário, por favor entre em contato conosco: suporte@habem.us';
          } else {
            $scope.errorMessage = 'ocorrreu um erro :/ por favor tente novamente mais tarde';
          }

          $scope.$apply();
        })
        .finally(function () {
          uiDialogLoading.close();
        });
      
    } else {

      error.then(function (errorMessage) {
        $scope.errorMessage = errorMessage
      });
    };
  };
  
};