var path = require('path');

// browserify stuff
var browserify  = require('browserify');
var brfs        = require('brfs');
var vinylSource = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');

var config  = require('../config');

module.exports = function (gulp, $) {

  /**
   * Runs the javascript task once
   */
  gulp.task('javascript', function () {

    // Create a gulp stream for the single browserify task
    return browserify({
        // Set the entry option so that it browserifies
        // only one file
        entries: ['src/index.js'],
        // transforms
        transform: [brfs],

        // standalone global object for main module
        standalone: 'habemus'
      }).bundle()
      .on('error', $.util.log.bind($.util, 'Browserify Error'))
      .on('error', $.notify.onError({
        title: 'Browserify compiling error',
        message: '<%= error.message %>',
        open: 'file:///<%= error.filename %>',
        sound: 'Glass',
        // Basso, Blow, Bottle, Frog, Funk, Glass, Hero,
        // Morse, Ping, Pop, Purr, Sosumi, Submarine, Tink
        icon: path.join(config.root, 'logo.png'),
      }))
      // transform browserify file stream into a vinyl file object stream
      // and modify the file name
      .pipe(vinylSource('index.bundle.js'))
      .pipe(vinylBuffer())
      // calculate size before writing source maps
      .pipe($.size({
        title: 'javascript',
        showFiles: true
      }))
      .pipe(gulp.dest(config.srcDir));
  });
};
