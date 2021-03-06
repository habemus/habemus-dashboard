var Q     = require('q');
var JSZip = require('jszip');
var Zip   = require('../../lib/zip');

var aux = require('../../lib/auxiliary');

/**
 * Helper function to loop over object's properties
 */
function _loopObject(obj, fn) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      fn(obj[prop], prop);
    }
  }
}

module.exports = /* @ngInject */ function zipUploadPrepareService(uiDialogError, uiDialogConfirm, $translate) {

  /**
   * Assumes the files are to be zipped together by the browser
   */
  function _multiFileUploadCreateProject(files) {

    var zip = new Zip();

    var indexFileFound = false;

    files.forEach(function (fData) {
      if (fData.path === 'index.html') {
        indexFileFound = true;
      }
      zip.file(fData.path, fData.file);
    });

    if (indexFileFound) {

      return zip.generate();
    } else {
      
      return Q.all([
        $translate('zipPrepare.noIndexHtml'),
        $translate('zipPrepare.cancel'),
        $translate('zipPrepare.confirm')
      ])
      .spread(function (message, cancelLabel, confirmLabel) {
        
        return Q(uiDialogConfirm({
          message: message,
          cancelLabel: cancelLabel,
          confirmLabel: confirmLabel
        }));
      })
      .then(function () {
        return zip.generate();
      });
    }
  }

  /**
   * Assumes the first file is a zip file
   */
  function _zipFileUploadCreateProject(files) {

    var defer = Q.defer();
    
    if (files.length > 1) {
      
      $translate('zipPrepare.pleaseZipBeforeUploading')
        .then(function (messsage) {
          uiDialogError(messsage)
            .closePromise.then(function () {
              defer.reject(new Error('invalid zip file'));
            });
        });

    } else if (!aux.isZipFile(files[0].file)) {
      
      $translate('zipPrepare.invalidZipFile')
        .then(function (message) {
          uiDialogError(message)
            .closePromise.then(function () {
              defer.reject(new Error('invalid zip file'));
            });
        });

    } else {

      var reader = new FileReader();

      reader.onload = function () {
        var contents = reader.result;

        var originalZip = new JSZip();

        try {
          originalZip.load(contents);
        } catch (e) {
          $translate('zipPrepare.invalidZipFile')
            .then(function (message) {
              uiDialogError(message)
                .closePromise.then(function () {
                  defer.reject(new Error('invalid zip file'));
                });
            });
        }
        var finalZip;

        // filter out OSInternal files
        _loopObject(originalZip.files, function (zipFileObject, filename) {
          if (aux.isOSInternalFile(filename)) {
            originalZip.remove(filename);
          }
        });

        // attempt to find a common prefix for all files
        var commonPrefix = aux.commonPrefix(Object.keys(originalZip.files));
        var commonPrefixRegExp = new RegExp('^' + commonPrefix);

        if (commonPrefix && originalZip.files[commonPrefix] && originalZip.files[commonPrefix].dir) {
          // there is a common directory, we should create a new zip file
          finalZip = new JSZip();

          _loopObject(originalZip.files, function (zipFileObject, filename) {

            if (!zipFileObject.dir) {
              filename = filename.replace(commonPrefixRegExp, '');

              finalZip.file(filename, zipFileObject.asArrayBuffer(), {
                createFolders: true,
              });
            }
          });

        } else {
          // no common base directory
          finalZip = originalZip;
        }

        // check if there is an index.html file
        var indexFile = finalZip.file('index.html');

        if (indexFile) {

          defer.resolve(finalZip.generate({ type: 'blob' }));

        } else {
      
          Q.all([
            $translate('zipPrepare.noIndexHtml'),
            $translate('zipPrepare.cancel'),
            $translate('zipPrepare.confirm')
          ])
          .spread(function (message, cancelLabel, confirmLabel) {

            return Q(uiDialogConfirm({
              message: message,
              cancelLabel: cancelLabel,
              confirmLabel: confirmLabel
            }));
          })
          .then(function () {
            defer.resolve(finalZip.generate({
              type: 'blob'
            }));
          }, function () {
            defer.reject(new Error('cancelled'));
          });
        }
      };

      // start reading
      reader.readAsArrayBuffer(files[0].file);
    }

    return defer.promise;
  }

  /**
   * In chrome, as directory selecting is supported,
   * we may let the user select/drop a directory, read its
   * files and generate a zip
   */
  function _chromeCreateProject(files) {
    if (files.length > 1 || (files.length === 1 && !aux.isZipFile(files[0].file))) {
      // multiple files or single html file
      return _multiFileUploadCreateProject(files);
    } else {
      return _zipFileUploadCreateProject(files);
    }
  }

  /**
   * In FF, Safari and IE, directory drag and dropping
   * is not supported, thus we must require the user to upload a zip file
   */
  function _nonChromeCreateProject(files) {
    return _zipFileUploadCreateProject(files);
  }

  return aux.isChrome() ? _chromeCreateProject : _nonChromeCreateProject;
};