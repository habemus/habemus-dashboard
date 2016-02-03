var Q = require('q');

var FD_SELECTOR = '[file-drop]';
var FD_TARGET_CLASS = 'file-drop-target';

var fileReader = require('../../lib/file-reader');

module.exports = function (module) {

  module.directive('fileDropContainer', function () {

    return {
      restrict: 'A',
      link: function (scope, element, attrs) {

        scope.clearDropTargets = function () {
          console.log('clear')
          element
            .find(FD_SELECTOR)
            .removeClass(FD_TARGET_CLASS);
        }
        
        scope.setDropTargets = function () {
          console.log('set');
          element
            .find(FD_SELECTOR)
            .addClass(FD_TARGET_CLASS);
        }

        element.bind('dragend', function (e) {
          e.preventDefault();
          e.stopPropagation();

          scope.clearDropTargets();
        });

        element.bind('dragover', function (e) {

          e.preventDefault();
          e.stopPropagation();
          
          scope.setDropTargets()
          
        });

        element.bind('dragleave', function (e) {
          // scope.clearDropTargets();
        });

        element.bind('drop', function (e) {
          e.preventDefault();

          scope.clearDropTargets();
        });
      },
    }
  });

  module.directive('fileDrop', function () {

    return {
      restrict: 'A',
      link: function (scope, element, attrs, ctrl) {

        function filterDotFiles(fileData) {
          return fileData.name !== '.DS_Store';
        }

        element.bind('drop', function (e) {

          e.stopPropagation();
          e.preventDefault();

          fileReader
            .fromDropEvent(e.originalEvent, filterDotFiles)
            .then(function (readData) {
              // clear the target highlighting
              scope.clearDropTargets();
              
              scope.$rootDir = readData.rootDir;
              scope.$files   = readData.files;
              scope.$eval(attrs.fileDrop);
            })
            .done();
        });
      },
    }
  });
};