var fs = require('fs');

var template = fs.readFileSync(__dirname + '/template.html', 'utf-8');

module.exports = /* @ngInject */ function (ngDialog) {

  // variable to hold a single instance of the dialog
  var openDialog;

  return {
    open: function (options) {

      options = options || {};

      var message   = options.message || 'Login';
      var closeable = options.closeable || false;


      if (openDialog) {
        return openDialog;
      } else {
        openDialog = ngDialog.open({
          template: template,
          plain: true,
          className: 'ngdialog-theme-habemus',
          controller: require('./controller'),

          data: {
            message: message,
            email: options.email
          },

          // prevent it from being closed by the user
          showClose: closeable,
          closeByEscape: closeable,
          closeByDocument: closeable,

          preCloseCallback: function (data) {
            openDialog = false;
          }
        });
      }

      return openDialog;
    }
  }
};