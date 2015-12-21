var Q = require('q');

var FD_SELECTOR = '[file-drop-area]';
var FD_TARGET_CLASS = 'file-drop-target';

var readFiles = require('./lib/read-files');

module.exports = function (module) {

  module.directive('fileDropContainer', function () {

    return {
      restrict: 'A',
      link: function (scope, element, attrs) {

        scope.clearDropTargets = function () {
          element
            .find(FD_SELECTOR)
            .removeClass(FD_TARGET_CLASS);
        }
        
        scope.setDropTargets = function () {
          element
            .find(FD_SELECTOR)
            .addClass(FD_TARGET_CLASS);
        }

        element.bind('dragend', function (e) {
          e.preventDefault();
          e.stopPropagation();

          scope.clearDropTargets();
        })

        element.bind('dragover', function (e) {

          e.preventDefault();
          e.stopPropagation();
          
          scope.setDropTargets()
          
        });

        element.bind('dragleave', function (e) {
          scope.clearDropTargets();
        })
      },
    }
  });

  module.directive('fileDropArea', function () {

    return {
      restrict: 'A',
      link: function (scope, element, attrs, ctrl) {

        function filterDotFiles(fileData) {
          return fileData.name !== '.DS_Store';
        }

        element.bind('drop', function (e) {

          e.stopPropagation();
          e.preventDefault();

            readFiles.fromDropEvent(e.originalEvent, filterDotFiles)
              .then(function (files) {
                // clear the target highlighting
                scope.clearDropTargets();

                scope.$files = files;
                scope.$eval(attrs.fileDropArea);
              });
        });
      },
    }

  });

};