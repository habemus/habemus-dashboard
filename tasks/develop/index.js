var fs = require('fs');
var path = require('path');

var inquirer = require('inquirer');

var REQUIRED_CONFIGURATIONS = [
  'PARSE_APPLICATION_ID',
  'PARSE_JAVASCRIPT_KEY',
  'PROJECT_API_LOCATION',
  'ROUTER_LOCATION',
];

module.exports = function (gulp, $) {
  require('./watch')(gulp, $);
  require('./serve-dist')(gulp, $);

  gulp.task('develop:configure', function (done) {
    var appConfig = require(path.join(__dirname, '../../src/config/config.json'));
    var questions = REQUIRED_CONFIGURATIONS.map(function (configName) {
      return {
        name: configName,
        message: configName,
        default: appConfig[configName],
      };
    });

    inquirer.prompt(questions, function (resultConfig) {
      
      fs.writeFileSync(
        path.join(__dirname, '../../src/config/config.json'),
        JSON.stringify(resultConfig, null, '\t'),
        'utf8'
      );

      done();
    });
  });
}