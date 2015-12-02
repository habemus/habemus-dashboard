var fs   = require('fs');
var path = require('path');

var del         = require('del');
var runSequence = require('run-sequence');

var config = require('../config');
var browserifyPipe = require('./auxiliary/browserify')

var REQUIRED_CONFIGURATIONS = [
  'PROJECT_API_LOCATION',
  'ROUTER_LOCATION',
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
  gulp.task('distribute:config', ['distribute:tmp'], function () {

    var baseConfig = require('../../src/config/config.json');

    // set values onto config
    REQUIRED_CONFIGURATIONS.forEach(function (prop) {

      var configValue = process.env[prop];

      if (typeof configValue === 'undefined') {
        throw new Error(prop + ' is required for distribute:config');
      }

      baseConfig[prop] = configValue;
    });

    fs.writeFileSync(
      path.join(config.root, tmpDir, 'config/config.json'),
      JSON.stringify(baseConfig),
      'utf8'
    );
  });

  /**
   * Browserifies tmp
   */
  gulp.task('distribute:javascript', ['distribute:config'], function () {
    return browserifyPipe(tmpDir + '/index.js')
      .pipe($.ngAnnotate())
      .pipe(gulp.dest(tmpDir));
  });

  /**
   * Concatenates scripts and stylesheets.
   * Minifies scripts
   */
  gulp.task('distribute:heavy-lifting', ['distribute:javascript'], function () {
    return gulp.src(tmpDir + '/index.html')
      // builds scripts and css into single files
      .pipe($.useref())
      // annotate angular stuff
      .pipe($.if('*.js', $.uglify()))
      .pipe($.if('*.css', $.minifyCss()))
      .pipe($.size({
        title: 'distribute:heavy-lifting',
        showFiles: true,
        gzip: true
      }))
      .pipe(gulp.dest('dist'));
  });

  gulp.task('distribute', function () {
    return runSequence('distribute:heavy-lifting', 'distribute:clear-tmp');
  });

};
