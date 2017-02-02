'use strict';

var INTERVAL_TIME = 10000;

module.exports = /*@ngInject*/ function tabCtrlDomainDns ($scope, $stateParams, $interval, apiHWebsite, uiHAccountDialog, uiDialogLoading) {
  
  /**
   * Var to hold reference to the interval that checks for domain status
   */
  var CHECK_INTERVAL;
  
  /**
   * List of targetDNSRecords and their respective data and statuses
   * @type {Array}
   */
  $scope.targetDNSRecords = [];

  /**
   * Set targetDNSRecords according to data from the domainRecord
   */
  $scope.$watch('domainRecord', function () {

    var domainRecord = $scope.domainRecord;
    var targetDNSRecords = [];

    // verification code TXT
    var _txtPartials = domainRecord.verification.computedPartialResults.txt || {
      active: false,
      score: 0,
    };
    targetDNSRecords.push({
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
      targetDNSRecords.push({
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
      targetDNSRecords.push({
        type: 'CNAME',
        host: 'www',
        targetValue: domainRecord.domain,
        active: _cnamePartials.active,
        score: _cnamePartials.score,
      });
    }

    $scope.targetDNSRecords = targetDNSRecords;
  })

  $scope.domainRecord = $stateParams.domainRecord;

  /**
   * Method for loading data on the dns configuration statuses
   * @return {[type]} [description]
   */
  $scope.loadDomainRecord = function () {
    
    $scope.verifying = true;
    
    return apiHWebsite
      .getDomainRecord(
        uiHAccountDialog.getAuthToken(),
        $scope.domainRecord.projectId,
        $stateParams.domainRecord._id
      )
      .then(function (domainRecord) {
        $scope.verifying = false;
        $scope.domainRecord = domainRecord;
        $scope.$apply();

      }, function (err) {
        console.warn(err);

        uiDialogLoading.close();
      });
  };

  /**
   * Restarts the verification process for the domainRecord
   * @return {Bluebird -> DomainRecord}
   */
  $scope.restartVerification = function () {

    uiDialogLoading.open({
      message: 'scheduling domain verification restart'
    });

    return apiHWebsite
      .restartDomainRecordVerification(
        uiHAccountDialog.getAuthToken(),
        $scope.domainRecord.projectId,
        $stateParams.domainRecord._id
      )
      .then(function (domainRecord) {
        $scope.domainRecord = domainRecord;
        $scope.$apply();

        uiDialogLoading.close();
      })
      .catch(function (err) {
        console.warn(err);
        uiDialogLoading.close();
      });
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