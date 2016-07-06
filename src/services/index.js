module.exports = function (DASHBOARD) {
  // api services
  DASHBOARD.factory('apiAuth', require('./api/auth'));
  DASHBOARD.factory('apiProjectManager', require('./api/project-manager'));
  
  // ui services
  DASHBOARD.factory('uiAuthDialog', require('./ui/auth'));

  DASHBOARD.factory('uiIntro', require('./ui/intro'));

  DASHBOARD.factory('uiDialogLoading', require('./ui/dialogs/loading'));
  DASHBOARD.factory('uiDialogConfirm', require('./ui/dialogs/confirm'));
  DASHBOARD.factory('uiDialogError', require('./ui/dialogs/error'));
  DASHBOARD.factory('uiDialogInfo', require('./ui/dialogs/info'));

  DASHBOARD.factory('auxZipPrepare', require('./auxiliary/zip-prepare'));
  DASHBOARD.factory('auxZipUpload', require('./auxiliary/zip-upload'));
};