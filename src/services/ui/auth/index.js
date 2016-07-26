var fs = require('fs');

const HAuthDialog = require('h-auth/client/ui/dialog');


var template = fs.readFileSync(__dirname + '/template.html', 'utf-8');

module.exports = /* @ngInject */ function (CONFIG) {

  var authDialog = new HAuthDialog({
    serverURI: CONFIG.hAuthURI
  });

  authDialog.attach(document.body);

  return authDialog;
};