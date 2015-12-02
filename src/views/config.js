var fs = require('fs');

module.exports = function (DASHBOARD) {

  DASHBOARD.run(function ($templateCache) {
    $templateCache.put(
      'views/project/partials/entry-template.html',
      fs.readFileSync(__dirname + '/project/partials/entry-template.html', 'utf8')
    );
  });

};