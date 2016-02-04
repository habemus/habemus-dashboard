// native
var path = require('path');
var fs   = require('fs');

var template = fs.readFileSync(path.join(__dirname, '../views/confirmation-dialog/template.html'), 'utf8');

module.exports = /* @ngInject */ function confirmationDialogService(ngDialog) {

  return function (message) {
    return ngDialog.openConfirm({
      template: template,
      plain: true,
      className: 'ngdialog-theme-habemus',
      data: {
        message: message,
      },
    });
  };
}