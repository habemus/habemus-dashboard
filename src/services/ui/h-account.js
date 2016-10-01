// habemus
const HAccountDialog = require('h-account/client/browser/ui/dialog');

module.exports = /* @ngInject */ function (CONFIG) {

  var hAccountDialog = new HAccountDialog({
    serverURI: CONFIG.hAccountURI
  });

  hAccountDialog.attach(document.body);

  return hAccountDialog;
};