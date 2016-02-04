// native
var path = require('path');
var fs   = require('fs');

var template = fs.readFileSync(path.join(__dirname, '../views/info-dialog/template.html'), 'utf8');

module.exports = /* @ngInject */ function infoDialogService(ngDialog) {

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