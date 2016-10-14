// native
const fs = require('fs');
const path = require('path');

module.exports = /*@ngInject*/ function tabCtrlGeneral($scope, $stateParams, uiHAccountDialog, auxZipUpload, ngDialog, apiHWorkspace) {

  /**
   * Creates a new version from the given files
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
    )
    .then(function () {

      var confirmUpdateWorkspace = confirm('would you like to update your workspace as well?');

      if (confirmUpdateWorkspace) {
        return apiHWorkspace.loadLatestVersion(
          uiHAccountDialog.getAuthToken(),
          $stateParams.projectCode,
          {
            byProjectCode: true
          }
        );
      }

    })
    .then(function () {
      alert('ok!');
    })
    .catch(function (err) {
      console.warn(err);
    });
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