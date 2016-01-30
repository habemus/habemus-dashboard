var fs   = require('fs');
var path = require('path');

var del         = require('del');
var runSequence = require('run-sequence');
var inquirer    = require('inquirer');
var _           = require('lodash');

var config = require('../config');
var browserifyPipe = require('./auxiliary/browserify')

var REQUIRED_CONFIGURATIONS = [
  'PARSE_APPLICATION_ID',
  'PARSE_JAVASCRIPT_KEY',
  'PROJECT_API_LOCATION',
];

module.exports = function (gulp, $) {

  var tmpDir = '.tmp';

  /**
   * Creates the temporary dir
   */
  gulp.task('distribute:tmp', ['less'], function () {
    return gulp.src(config.srcDir + '/**/*')
      .pipe(gulp.dest(tmpDir));
  });

  /**
   * Clears the temporary dir
   */
  gulp.task('distribute:clear-tmp', function () {
    del.sync(path.join(config.root, tmpDir));
  });

  /**
   * Retrieves configuration from the building environment variables
   * and writes to the configuration file
   */
  gulp.task('distribute:config', ['distribute:tmp'], function (done) {

    // load development configurations
    var devConfig = require('../../src/config/config.json');

    // function that writes the config and finishes the stream
    function writeConfig(appConfig) {
      fs.writeFileSync(
        path.join(config.root, tmpDir, 'config/config.json'),
        JSON.stringify(appConfig),
        'utf8'
      );

      done();
    }

    // check if required configurations are available in the environment
    // if so, proceed to writing the file,
    // otherwise, prompt questions at the user
    var appConfig = {};
    var questions = [];

    REQUIRED_CONFIGURATIONS.forEach(function (cfg) {
      var envValue = process.env[cfg];

      if (envValue) {
        appConfig[cfg] = envValue;
      } else {
        questions.push({
          name: cfg,
          message: cfg,
          // default: devConfig[cfg],
          // make question required
          validate: function (value) {
            return (typeof value !== 'undefined');
          },
        });
      }
    });

    if (questions.length > 0) {
      // ask
      inquirer.prompt(questions, writeConfig);
    } else {
      // write
      writeConfig(appConfig);
    }
  });

  /**
   * Browserifies tmp and annotates
   */
  gulp.task('distribute:javascript', ['distribute:config'], function () {
    return browserifyPipe(tmpDir + '/index.js')
      .pipe($.ngAnnotate())
      .pipe($.stripDebug())
      .pipe(gulp.dest(tmpDir));
  });

  /**
   * Concatenates scripts and stylesheets.
   * Minifies scripts
   * Minifies css
   */
  gulp.task('distribute:optimize', ['distribute:javascript'], function () {
    return gulp.src(tmpDir + '/index.html')
      // builds scripts and css into single files
      .pipe($.useref())
      .pipe($.if('*.js', $.uglify()))
      .pipe($.if('*.css', $.minifyCss()))
      .pipe($.size({
        title: 'distribute:optimize',
        showFiles: true,
        gzip: true
      }))
      .pipe(gulp.dest('dist'));
  });

  /**
   * Copies resources and attempts to optimize them
   */
  gulp.task('distribute:resources', function () {
    return gulp.src(config.srcDir + '/resources/**/*')
      // images
      .pipe($.if('*.png', $.imagemin()))
      .pipe($.size({
        title: 'distribute:resources',
        showFiles: true,
        gzip: true
      }))
      .pipe(gulp.dest('dist/resources'));
  });

  gulp.task('distribute', function () {
    return runSequence(['distribute:optimize', 'distribute:resources'], 'distribute:clear-tmp');
  });

};
