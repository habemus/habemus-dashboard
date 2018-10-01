// habemus
const HAccountDialog = require('habemus-account-client/browser/ui/dialog');

module.exports = /* @ngInject */ function (CONFIG) {

  var hAccountDialog = new HAccountDialog({
    serverURI: CONFIG.hAccountURI
  });

  hAccountDialog.attach(document.body);

  return hAccountDialog;
};