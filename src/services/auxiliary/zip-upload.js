var Q     = require('q');
var JSZip = require('jszip');
var Zip   = require('../../lib/zip');

var aux = require('../../lib/auxiliary');

module.exports = /* @ngInject */ function zipUploadPrepareService(uiDialogError, uiDialogLoading, $translate, auxZipPrepare, apiHProject) {

  return function (authToken, projectIdentifier, files, options) {

    $translate('project.preparingUpload')
      .then(function (message) {
        // loading state starts
        uiDialogLoading.open({ message: message });
      });

    return auxZipPrepare(files)
      .then(function (zipFile) {
        if (zipFile.size > 52428800) {
          
          $translate('project.errorSize')
          .then(function (message) {
            // error Dialog opens
            uiDialogError(message);
          });

          uiDialogLoading.close();

          return;
        }

        $translate('project.uploading')
          .then(function (message) {
            uiDialogLoading.setMessage(message);
          });

        var upload = apiHProject.createVersion(
          authToken,
          projectIdentifier,
          zipFile,
          options
        );

        upload.on('progress', function (progress) {
          console.log('upload progress ', progress);

          progress = parseInt(progress.completed * 100);

          // progress %
          uiDialogLoading.setProgress(progress);
          if (progress === 100) {
            $translate('project.finishingUpload')
              .then(function (message) {
                uiDialogLoading.setMessage(message);
              });
          }
        });

        return upload.promise;

      }, function prepareError() {
        uiDialogLoading.close();
      })
      .then(function uploadSuccess(res) {

        // loading state ends
        uiDialogLoading.close();

        console.log(res);

        return res;
      });
  };
};