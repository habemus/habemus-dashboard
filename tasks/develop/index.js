var fs = require('fs');
var path = require('path');

var runSequence = require('run-sequence');

var config = require('../config');

module.exports = function (gulp, $) {
  require('./watch')(gulp, $);
  require('./serve-dist')(gulp, $);
  require('./i18n')(gulp, $);

  /**
   * Runs all tasks for development environment setup and go
   */
  gulp.task('develop', function () {
    return runSequence(['less', 'javascript'], 'serve:develop', 'watch');
  });
}