var fs = require('fs');
var path = require('path');

var inquirer    = require('inquirer');
var runSequence = require('run-sequence');

var config = require('../config');

var REQUIRED_CONFIGURATIONS = [
  'PARSE_APPLICATION_ID',
  'PARSE_JAVASCRIPT_KEY',
  'PROJECT_API_LOCATION',
];

module.exports = function (gulp, $) {
  require('./watch')(gulp, $);
  require('./serve-dist')(gulp, $);

  gulp.task('develop:configure', function (done) {

    try {
      fs.readFileSync(config.appConfigPath, 'utf8');
    } catch (e) {
      fs.writeFileSync(config.appConfigPath, '{}', 'utf8');
    }

    var appConfig = require(path.join(__dirname, '../../src/config/config.json'));
    var questions = REQUIRED_CONFIGURATIONS.map(function (configName) {
      return {
        name: configName,
        message: configName,
        default: appConfig[configName],
        validate: function (value) {
          if (!value) {
            return configName + ' is required';
          } else {
            return true;
          }
        }
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

  /**
   * Runs all tasks for development environment setup and go
   */
  gulp.task('develop', function (done) {

    // check if configuration file exists
    var appConfigExists = false;

    try {
      fs.readFileSync(config.appConfigPath, 'utf8');
      appConfigExists = true;
    } catch (e) {
      fs.writeFileSync(config.appConfigPath, '{}', 'utf8');
    }

    if (appConfigExists) {
      runSequence(['less', 'javascript'], 'serve:develop', 'watch', done);
    } else {
      $.util.log('No configuration file found, we should set it up.');
      runSequence('develop:configure', ['less', 'javascript'], 'serve:develop', 'watch', done);
    }

  });
}