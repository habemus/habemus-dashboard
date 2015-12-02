var path = require('path');

// browserify stuff
// var browserify  = require('browserify');
// var brfs        = require('brfs');
// var vinylSource = require('vinyl-source-stream');
// var vinylBuffer = require('vinyl-buffer');

var config  = require('../config');

var browserifyPipe = require('./auxiliary/browserify')

module.exports = function (gulp, $) {

  /**
   * Runs the javascript task once
   */
  gulp.task('javascript', function () {
    return browserifyPipe('src/index.js')
      .pipe(gulp.dest(config.srcDir));
  });
};
