// native
var path = require('path');

// gulp plugins
var gulp       = require('gulp');
var gulpUtil   = require('gulp-util');
var gulpNotify = require('gulp-notify');
var gulpSize   = require('gulp-size');

// browserify stuff
var browserify  = require('browserify');
var brfs        = require('brfs');
var vinylSource = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');

var config = require('../../config');

var lazypipe    = require('lazypipe');
var browserifyPipe = lazypipe();

module.exports = function returnBrowserifyPipe(entry, dest) {
  // Create a gulp stream for the single browserify task
  return browserify({
      // Set the entry option so that it browserifies
      // only one file
      entries: [entry],
      // transforms
      transform: [brfs],

      // standalone global object for main module
      standalone: 'habemus'
    }).bundle()
    .on('error', gulpUtil.log.bind(gulpUtil, 'Browserify Error'))
    .on('error', gulpNotify.onError({
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
    .pipe(gulpSize({
      title: 'javascript',
      showFiles: true
    }))
    .pipe(gulp.dest(dest));
};
