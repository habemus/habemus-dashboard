'use strict';


module.exports = /*@ngInject*/ function tabCtrlDomainDns ($scope, $stateParams, $interval, projectAPI) {
  
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
    
  /**
   * Method for loading data on the dns configuration statuses
   * @return {[type]} [description]
   */
  $scope.loadDomainDnsConfigurations = function () {

    $('.loading-state').addClass('active');

    projectAPI
      .verifyDomainRecord($scope.project.id, $stateParams.domain.objectId)
      .then(function (domainRecord) {

        // $scope.inProgress = configs.status === 'connecting';
        

        $scope.inProgress = false;


        $scope.dnsRecords = [];

        var aggregateCheckStatus = domainRecord.verificationStatus_;

        console.log(aggregateCheckStatus);

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

        // $scope.dnsRecords = configs.records;

        $scope.$apply();

        $('.loading-state').removeClass('active');

      }, function (err) {

      })
      .done();
  };

  // start
  $scope.loadDomainDnsConfigurations();

  var interval = $interval(function () {

    $scope.loadDomainDnsConfigurations();
  }, 5000);

  $scope.$on('$destroy', function () {
    $interval.cancel(interval);
  });
};