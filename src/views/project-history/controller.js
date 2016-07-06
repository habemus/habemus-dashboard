'use strict';


module.exports = /*@ngInject*/ function pHistoryCtrl($scope, $stateParams, apiAuth, apiProjectManager) {
  $scope
    .loadProjectVersionsIntoScope()
    .done();
};