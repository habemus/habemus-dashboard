'use strict';

// native
var path = require('path');
var fs   = require('fs');

// third-party
var _    = require('lodash');


module.exports = /*@ngInject*/ function tabCtrlDomainDetail($scope, $stateParams, ngDialog) {
  $scope.domain = $stateParams.domain;
  
//  console.log("tudo certo!");
  
  /**
   * Disconnect domain
   */
  $scope.disconnectDomain = function () {
    ngDialog.openConfirm({
      template: fs.readFileSync(path.join(__dirname, '../disconnect/template.html'), 'utf-8'),
      plain: true,
      className: 'ngdialog-theme-habemus',
      controller: require('../disconnect/controller'),
      scope: $scope,
//      confirm: function () {
//        console.log("confirmou!!");
//      }
      
    })
    .then(function () {
      console.log("desconectar domínio");
      
    }, function () {
    });
  }
};


