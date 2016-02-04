// native
var path = require('path');
var fs   = require('fs');

var template = fs.readFileSync(path.join(__dirname, '../views/error-dialog/template.html'), 'utf8');

module.exports = /* @ngInject */ function errorDialogService(ngDialog) {

  return function (message) {
    return ngDialog.open({
      template: template,
      plain: true,
      className: 'ngdialog-theme-habemus',
      data: {
        message: message,
      },
    });
  };
}