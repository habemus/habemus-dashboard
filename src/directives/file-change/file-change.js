var Q = require('q');

var FD_SELECTOR = '[file-drop]';
var FD_TARGET_CLASS = 'file-drop-target';

var fileReader = require('../../lib/file-reader');

module.exports = function (module) {

  module.directive('fileChange', function fileChange() {
    return {
      restrict: 'A',
      link: function link(scope, element, attrs, ctrl) {
        element.on('change', onChange);

        scope.$on('destroy', function () {
          element.off('change', onChange);
        });

        function onChange() {

          if ('directory' in attrs) {
            fileReader
              .fromDirectoryInput(element[0])
              .then(function (readData) {

                scope.$rootDir = readData.rootDir;
                scope.$files   = readData.files;
                scope.$eval(attrs.fileChange);
              })
              .done();
          } else {
            fileReader
              .fromFileInput(element[0])
              .then(function (readData) {
                scope.$rootDir = readData.rootDir;
                scope.$files   = readData.files;
                scope.$eval(attrs.fileChange);
              })
          }
        }
      }
    }
  });
};