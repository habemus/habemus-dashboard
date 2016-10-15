'use strict';

var INTERVAL_TIME = 10000;

module.exports = /*@ngInject*/ function tabCtrlDomainDns ($scope, $stateParams, $interval, apiHWebsite, uiHAccountDialog, uiDialogLoading) {
  
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
   * List of targetDNSRecords and their respective data and statuses
   * @type {Array}
   */
  $scope.targetDNSRecords = [];

  $scope.domainRecord = $stateParams.domainRecord;

  /**
   * Method for loading data on the dns configuration statuses
   * @return {[type]} [description]
   */
  $scope.loadDomainRecord = function () {
    
    $scope.verifying = true;
    
    apiHWebsite
      .getDomainRecord(
        uiHAccountDialog.getAuthToken(),
        $scope.domainRecord.projectId,
        $stateParams.domainRecord._id
      )
      .then(function (domainRecord) {

        $scope.targetDNSRecords = [];

        // verification code TXT
        var _txtPartials = domainRecord.verification.computedPartialResults.txt || {
          active: false,
          score: 0,
        };
        $scope.targetDNSRecords.push({
          type: 'TXT',
          host: domainRecord.verification.subdomain,
          targetValue: domainRecord.verification.code,
          active: _txtPartials.active,
          score: _txtPartials.score,
        });

        domainRecord.ipAddresses.forEach((ipAddress) => {
          var _ipv4Partials = domainRecord.verification.computedPartialResults.ipv4 || {
            active: false,
            score: 0,
          }
          $scope.targetDNSRecords.push({
            type: 'A',
            host: '@',
            targetValue: ipAddress,
            active: _ipv4Partials.active,
            score: _ipv4Partials.score,
          });
        });

        if (domainRecord.enableWwwAlias) {
          var _cnamePartials = domainRecord.verification.computedPartialResults.cname || {
            active: false,
            score: 0
          };
          $scope.targetDNSRecords.push({
            type: 'CNAME',
            host: 'www',
            targetValue: domainRecord.domain,
            active: _cnamePartials.active,
            score: _cnamePartials.score,
          });
        }

        $scope.verifying = false;
        $scope.$apply();

      }, function (err) {
        console.warn(err);

        uiDialogLoading.close();
      })
      .done();
  };

  // start
  $scope.loadDomainRecord();

  CHECK_INTERVAL = $interval(function () {

    $scope.loadDomainRecord();
  }, INTERVAL_TIME);

  $scope.$on('$destroy', function () {
    $interval.cancel(CHECK_INTERVAL);
  });
};