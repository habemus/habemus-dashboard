'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function DashboardCtrl($scope, ngDialog) {
  console.log('DashboardCtrl alive');

  $scope.createProject = function () {
    ngDialog.open({
      template: fs.readFileSync(path.join(__dirname, '../create-project/template.html'), 'utf-8'),
      plain: true,
      controller: require('../create-project/controller'),
    });
  };
};