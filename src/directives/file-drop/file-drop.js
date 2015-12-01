var Q = require('q');

var FD_SELECTOR = '[file-drop-area]';
var FD_TARGET_CLASS = 'file-drop-target';

function traverseFileTree(item, path, fileList) {
  path = path || "";
  if (item.isFile) {
    // Get file
    item.file(function(file) {

      fileList.push({
        path: path + file.name,
        file: file
      });

    });
  } else if (item.isDirectory) {
    // Get folder contents
    var dirReader = item.createReader();
    dirReader.readEntries(function(entries) {
      for (var i=0; i<entries.length; i++) {
        traverseFileTree(entries[i], path + item.name + "/", fileList);
      }
    });
  }
}

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

        element.bind('dragend', function (e) {
          e.preventDefault();
          e.stopPropagation();

          scope.clearDropTargets();
        })

        element.bind('dragover', function (e) {

          e.preventDefault();
          e.stopPropagation();

          scope.clearDropTargets();

          var target = angular.element(e.target);

          var closestDropArea = target.closest(FD_SELECTOR);

          closestDropArea.addClass(FD_TARGET_CLASS);
        });

        element.bind('dragleave', function (e) {

          // if (e.target === element[0]) {
          scope.clearDropTargets();
          // }
        })
      },
    }
  });

  module.directive('fileDropArea', function () {

    return {
      restrict: 'A',
      link: function (scope, element, attrs, ctrl) {

        element.bind('drop', function (e) {

          e.stopPropagation();
          e.preventDefault();

          // TODO: obviously improve
          try {
            // webkit:

            var fileList = [];
            var items = e.originalEvent.dataTransfer.items;
            for (var i=0; i<items.length; i++) {
              // webkitGetAsEntry is where the magic happens
              var item = items[i].webkitGetAsEntry();
              if (item) {
                traverseFileTree(item, undefined, fileList);
              }
            }

            setTimeout(function () {

              scope.$files = fileList;
              scope.$eval(attrs.fileDropArea);

            }, 1000);

            scope.clearDropTargets();

          } catch (e) {
            // no directory upload

            var fileList = e.target.files || e.originalEvent.dataTransfer.files;
            fileList = Array.prototype.map.call(fileList, function (f) {
              return {
                path: f.name,
                file: f
              };
            });

            scope.$files = fileList;
            scope.$eval(attrs.fileDropArea);

            scope.clearDropTargets();
          }
        });
      },
    }

  });

};