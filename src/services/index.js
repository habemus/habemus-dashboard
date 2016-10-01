module.exports = function (DASHBOARD) {
  // api services
  DASHBOARD.factory('apiHProject', require('./api/h-project'));
  
  // ui services
  DASHBOARD.factory('uiHAccountDialog', require('./ui/h-account'));

  DASHBOARD.factory('uiIntro', require('./ui/intro'));

  DASHBOARD.factory('uiDialogLoading', require('./ui/dialogs/loading'));
  DASHBOARD.factory('uiDialogConfirm', require('./ui/dialogs/confirm'));
  DASHBOARD.factory('uiDialogError', require('./ui/dialogs/error'));
  DASHBOARD.factory('uiDialogInfo', require('./ui/dialogs/info'));

  DASHBOARD.factory('auxZipPrepare', require('./auxiliary/zip-prepare'));
  DASHBOARD.factory('auxZipUpload', require('./auxiliary/zip-upload'));
};