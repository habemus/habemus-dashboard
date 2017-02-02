// native
var fs = require('fs');

var template = fs.readFileSync(__dirname + '/template.html', 'utf8');

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