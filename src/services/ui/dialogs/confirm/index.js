// native
var fs = require('fs');

var template = fs.readFileSync(__dirname + '/template.html', 'utf8');

module.exports = /* @ngInject */ function confirmationDialogService(ngDialog) {

  return function (options) {
    
    var message, cancelLabel, confirmLabel;
    
    if (typeof options === 'object') {
      message = options.message;
      cancelLabel = options.cancelLabel;
      confirmLabel = options.confirmLabel;
    } else {
      message = options;
      cancelLabel = undefined;
      confirmLabel = undefined;
    }
    
    return ngDialog.openConfirm({
      template: template,
      plain: true,
      className: 'ngdialog-theme-habemus',
      data: {
        message: message,
        cancelLabel: cancelLabel,
        confirmLabel: confirmLabel,
      },
    });
  };
}