// native
const fs = require('fs');
const path = require('path');

module.exports = /*@ngInject*/ function ProjectGeneralCtrl($scope, currentAccount, ngDialog, uiIntro) {

  /**
   * Current Account is resolved by ui-router
   * @type {Object}
   */
  $scope.currentAccount = currentAccount;

  var showIntro = false;

  try {
    // this is not a critical feature
    // wrap in try catch to handle account data structure variation
    showIntro = currentAccount.applicationConfig.dashboard.guides['project-general'] === 'new';
  } catch (e) {
    showIntro = false;
  }

  if (showIntro) {
    uiIntro.projectGeneral().then(function (intro) {
      intro.start();
    });
  }
  
  /**
   * Proxy method to the project controller (parent of this)
   */
  $scope.createVersion = function () {
    var args = Array.prototype.slice.call(arguments, 0);

    return $scope.$parent.createVersion.apply($scope.$parent, args);
  };

  /**
    * Name editing
    */
  $scope.editName = function () {
    ngDialog.open({
      template: fs.readFileSync(path.join(__dirname, '../project-rename/template.html'), 'utf-8'),
      plain: true,
      className: 'ngdialog-theme-habemus',
      controller: require('../project-rename/controller'),
      scope: $scope,

      preCloseCallback: function () {}
    });
  };
  
  $scope.delete = function () {
    ngDialog.open({ 
      template: fs.readFileSync(path.join(__dirname, '../project-delete/template.html'), 'utf-8'),
      plain: true,
      className: 'ngdialog-theme-habemus',
      controller: require('../project-delete/controller'),
      scope: $scope,
    });
  };
  
};