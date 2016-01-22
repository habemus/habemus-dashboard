'use strict';

var INTERVAL_TIME = 10000;

module.exports = /*@ngInject*/ function tabCtrlDomainDns ($scope, $stateParams, $interval, projectAPI, loadingDialog) {
  
  /**
   * Var to hold reference to the interval that checks for domain status
   */
  var CHECK_INTERVAL

  /**
   * Whether the connection is still in progress
   * @type {[type]}
   */
  $scope.inProgress = $stateParams.inProgress;

  /**
   * List of dnsRecords and their respective data and statuses
   * @type {Array}
   */
  $scope.dnsRecords = [];
  
  $scope.domainRecord = $stateParams.domain;

  /**
   * Method for loading data on the dns configuration statuses
   * @return {[type]} [description]
   */
  $scope.loadDomainDnsConfigurations = function () {
    
    $scope.verifying = true;
    
    projectAPI
      .verifyDomainRecord($scope.project.id, $stateParams.domain.objectId)
      .then(function (domainRecord) {

        $scope.dnsRecords = [];

        var aggregateCheckStatus = domainRecord.verificationStatus_;

        if (aggregateCheckStatus.verification === 1) {

          $scope.inProgress = false;
          $interval.cancel(CHECK_INTERVAL);
        } else {
          $scope.inProgress = true;
        }

        domainRecord.targetConfigurations_.dnsRecords.forEach(function (recordGroup) {

          var HACK_MAP = {
            // recordType: kind
            TXT: 'verification',
            A: 'A',
            CNAME: 'CNAME'
          };

          recordGroup.targetValues.forEach(function (v) {
            $scope.dnsRecords.push({
              type: recordGroup.type,
              value: v.value,
              required: v.required,
              status: recordGroup.status,
              host: recordGroup.host,

              stability: aggregateCheckStatus[HACK_MAP[recordGroup.type]]
            });
          });

        });

        // configs.records.forEach(function (record) {
        //   if (record.status === 'pending') {
        //     $scope.inProgress = true;
        //   }
        // });
        setTimeout(function() {
          $scope.verifying = false;
          
          // $scope.dnsRecords = configs.records;      
          $scope.$apply();
        }, 1000);

      }, function (err) {
        console.warn(err);

        loadingDialog.close();
      })
      .done();
  };

  // start
  $scope.loadDomainDnsConfigurations();

  CHECK_INTERVAL = $interval(function () {

    $scope.loadDomainDnsConfigurations();
  }, INTERVAL_TIME);

  $scope.$on('$destroy', function () {
    $interval.cancel(CHECK_INTERVAL);
  });
};