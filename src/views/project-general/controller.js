// native
const fs = require('fs');
const path = require('path');

module.exports = /*@ngInject*/ function tabCtrlGeneral($scope, $stateParams, uiHAccountDialog, auxZipUpload, ngDialog) {

  /**
   * Creates a new verfion from the given files
   * 
   * @param  {File} files
   * @return {Promise}
   */
  $scope.createVersion = function (files) {
    auxZipUpload(
      uiHAccountDialog.getAuthToken(),
      $stateParams.projectCode,
      files,
      {
        byCode: true
      }
    );
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