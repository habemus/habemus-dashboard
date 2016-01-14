'use strict';


module.exports = /*@ngInject*/ function ($scope, $stateParams, projectAPI) {
  
  /**
   * Whether the connection is still in progress
   * @type {[type]}
   */
  $scope.inProgress = $stateParams.inProgress;

  /**
   * List of DNSRecords and their respective data and statuses
   * @type {Array}
   */
  $scope.DNSRecords = [];
    
  /**
   * Method for loading data on the dns configuration statuses
   * @return {[type]} [description]
   */
  $scope.loadDomainDnsConfigurations = function () {

    $('.loading-state').addClass('active');

    projectAPI
      .getDomainDNSConfigurations($scope.project.id, $stateParams.domain.name)
      .then(function (configs) {

        console.log(configs);

        // $scope.inProgress = configs.status === 'connecting';
        
        $scope.inProgress = false;

        configs.records.forEach(function (record) {
          if (record.status === 'pending') {
            $scope.inProgress = true;
          }
        });

        $scope.DNSRecords = configs.records;

        $scope.$apply();

        $('.loading-state').removeClass('active');

      }, function (err) {

      });
  };

  // start
  $scope.loadDomainDnsConfigurations();
};