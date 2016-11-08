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
  // apis
  if (!process.env.H_ACCOUNT_URI) { throw new Error('H_ACCOUNT_URI env var MUST be set'); }
  if (!process.env.H_PROJECT_URI) { throw new Error('H_PROJECT_URI env var MUST be set'); }
  if (!process.env.H_WEBSITE_URI) { throw new Error('H_WEBSITE_URI env var MUST be set'); }
  if (!process.env.H_WORKSPACE_URI) { throw new Error('H_WORKSPACE_URI env var MUST be set'); }

  // uis
  if (!process.env.UI_WORKSPACE_URI) { throw new Error('UI_WORKSPACE_URI env var MUST be set'); }

  // hosts
  if (!process.env.WEBSITE_HOST) { throw new Error('WEBSITE_HOST env var MUST be set'); }

  // Create a gulp stream for the single browserify task
  var b = browserify({
      // Set the entry option so that it browserifies
      // only one file
      entries: [entry],
      // transforms
      transform: [
        brfs,
        envify({
          // apis
          H_ACCOUNT_URI: process.env.H_ACCOUNT_URI,
          H_PROJECT_URI: process.env.H_PROJECT_URI,
          H_WEBSITE_URI: process.env.H_WEBSITE_URI,
          H_WORKSPACE_URI: process.env.H_WORKSPACE_URI,

          // uis
          UI_WORKSPACE_URI: process.env.UI_WORKSPACE_URI,

          // hosts
          WEBSITE_HOST: process.env.WEBSITE_HOST,
          WORKSPACE_HOST: process.env.WORKSPACE_HOST,
        })
      ],

      // standalone global object for main module
      standalone: 'habemus'
    });

  // inject modules for production environment
  b.require('./injected/production/habemus-dashboard-urls', {
    expose: 'habemus-dashboard-urls'
  });

  return b.bundle()
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
