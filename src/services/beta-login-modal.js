var path = require('path');
var fs = require('fs');

var template = fs.readFileSync(path.join(__dirname, '../views/beta-auth/template.html'), 'utf-8');

module.exports = /* @ngInject */ function (ngDialog) {

  // variable to hold a single instance of the dialog
  var openDialog;

  return {
    open: function (options) {

      if (!options.betaData) { throw new Error('betaData is required'); }

      if (openDialog) {
        return openDialog;
      } else {
        openDialog = ngDialog.open({
          name: 'beta-login',
          data: {
            betaData: options.betaData,
          },
          template: template,
          plain: true,
          className: 'ngdialog-theme-habemus',
          controller: require('../views/beta-auth/controller'),

          // prevent it from being closed by the user
          showClose: false,
          closeByEscape: false,
          closeByDocument: false,
        });
      }

      return openDialog;
    }
  }
};