var Q = require('q');

var FD_SELECTOR = '[file-drop]';
var FD_TARGET_CLASS = 'file-drop-target';

var fileReader = require('../../lib/file-reader');
var aux        = require('../../lib/auxiliary');

module.exports = function (MOD) {

  MOD.directive('fileDropContainer', function ($document) {

    return {
      restrict: 'A',
      link: function (scope, element, attrs) {

        console.log('fileDropContainer hey')

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

        $document.bind('mouseout', function (e) {
          if (!e.relatedTarget) {
            scope.clearDropTargets();
          }
        });

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
          // dragleave is triggered too frequently...
          // TODO: we must improve this event handling..
          // scope.clearDropTargets();
        });

        element.bind('drop', function (e) {
          e.preventDefault();

          scope.clearDropTargets();
        });
      },
    }
  });

  MOD.directive('fileDrop', function () {

    return {
      restrict: 'A',
      link: function (scope, element, attrs, ctrl) {

        function filterSystemFiles(fileData) {
          return !aux.isOSInternalFile(fileData.name);
        }

        element.bind('drop', function (e) {

          e.stopPropagation();
          e.preventDefault();

          fileReader
            .fromDropEvent(e.originalEvent, filterSystemFiles)
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