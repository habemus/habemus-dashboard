// native
var fs = require('fs');
var url = require('url');

var TRAILING_SLASH_RE = /\/$/;

// build the url for the blank template 
var parsedLocation = url.parse(window.location.toString());
delete parsedLocation.hash;
parsedLocation.pathname = parsedLocation.path.replace(TRAILING_SLASH_RE, '') + '/resources/project-templates/blank/blank.zip';
var BLANK_PROJECT_TEMPLATE_URL = url.format(parsedLocation);

module.exports = /* @ngInject */ function newProjectDialogService(ngDialog, CONFIG) {


  return function (data) {

    return ngDialog.open({
      template: fs.readFileSync(__dirname + '/template.html', 'utf8'),
      plain: true,
      className: 'ngdialog-theme-habemus',
      controller: function NewProjectDialogCtrl($scope) {

        /**
         * Clears any project config selection
         */
        $scope.clearSelection = function () {
          $scope.ngDialogData.templateURL = false;
        }
        
        /**
         * Sets the templateURL to the blank-template's url
         */
        $scope.createFromBlankTemplate = function () {
          $scope.ngDialogData.templateURL = BLANK_PROJECT_TEMPLATE_URL;
        };

        /**
         * Resolves dialog promise with data formatted
         * for creating a project with the given files
         * 
         * @param  {Array} $files
         * @param  {String} $rootDir
         */
        $scope.createProjectFromFiles = function ($files, $rootDir) {
          console.log('create project from files', $files, $rootDir);

          $scope.closeThisDialog({
            fromFiles: true,

            name: $rootDir,
            files: $files,
          });
        };

        /**
         * Resolves dialog promise with data foramtted
         * for creating a project from a templateURL
         */
        $scope.createProjectFromTemplate = function () {

          $scope.closeThisDialog({
            fromTemplate: true,

            name: $scope.ngDialogData.name,
            templateURL: $scope.ngDialogData.templateURL,
          });
        };

      },
      data: data,
    });
  };
}
