// native
const path = require('path');

// gulp plugins
const gulp       = require('gulp');
const gulpUtil   = require('gulp-util');
const gulpNotify = require('gulp-notify');
const gulpSize   = require('gulp-size');

// browserify stuff
const browserify   = require('browserify');
const brfs         = require('brfs');
const envify       = require('envify/custom');
const vinylSource  = require('vinyl-source-stream');
const vinylBuffer  = require('vinyl-buffer');

const config = require('../../config');

module.exports = function returnBrowserifyPipe(entry) {
  if (!process.env.H_ACCOUNT_URI) {
    throw new Error('H_ACCOUNT_URI env var MUST be set');
  }

  if (!process.env.H_PROJECT_URI) {
    throw new Error('H_PROJECT_URI env var MUST be set');
  }

  if (!process.env.HOST_URL) {
    throw new Error('HOST_URL env var MUST be set');
  }

  if (!process.env.WORKSPACE_URL) {
    throw new Error('WORKSPACE_URL env var MUST be set');
  }

  // Create a gulp stream for the single browserify task
  return browserify({
      // Set the entry option so that it browserifies
      // only one file
      entries: [entry],
      // transforms
      transform: [
        brfs,
        envify({
          H_ACCOUNT_URI: process.env.H_ACCOUNT_URI,
          H_PROJECT_URI: process.env.H_PROJECT_URI,
          HOST_URL: process.env.HOST_URL,
          WORKSPACE_URL: process.env.WORKSPACE_URL,
        })
      ],

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
    }));
};
