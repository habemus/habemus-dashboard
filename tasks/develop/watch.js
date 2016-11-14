const path = require('path');

// External
const runSequence = require('run-sequence');
const browserSync = require('browser-sync');
const browserify  = require('browserify');
const watchify    = require('watchify');
const brfs        = require('brfs');
const vinylSource = require('vinyl-source-stream');
const vinylBuffer = require('vinyl-buffer');
const del         = require('del');
const envify      = require('envify/custom');

const config = require('../config');

module.exports = function (gulp, $) {

  /**
   * Uses watchify to watch for file
   * changes and recompile javascript
   */
  gulp.task('watch:watchify', function () {

    // apis
    if (!process.env.H_ACCOUNT_URI) { throw new Error('H_ACCOUNT_URI env var MUST be set'); }
    if (!process.env.H_PROJECT_URI) { throw new Error('H_PROJECT_URI env var MUST be set'); }
    if (!process.env.H_WEBSITE_URI) { throw new Error('H_WEBSITE_URI env var MUST be set'); }
    if (!process.env.H_WORKSPACE_URI) { throw new Error('H_WORKSPACE_URI env var MUST be set'); }

    // hosts
    if (!process.env.WEBSITE_HOST) { throw new Error('WEBSITE_HOST env var MUST be set'); }

    // only in development:
    if (!process.env.UI_WORKSPACE_BASE_URL) { throw new Error('UI_WORKSPACE_BASE_URL env var MUST be set'); }
    if (!process.env.H_WEBSITE_SERVER_URI) { throw new Error('H_WEBSITE_SERVER_URI env var MUST be set'); }

    // instantiate browserify
    var b = browserify({
      entries: ['src/index.js'],
      // transforms
      transform: [
        brfs,
        envify({
          // apis
          H_ACCOUNT_URI: process.env.H_ACCOUNT_URI,
          H_PROJECT_URI: process.env.H_PROJECT_URI,
          H_WEBSITE_URI: process.env.H_WEBSITE_URI,
          H_WORKSPACE_URI: process.env.H_WORKSPACE_URI,

          // ui
          UI_WORKSPACE_BASE_URL: process.env.UI_WORKSPACE_BASE_URL,

          // hosts
          WEBSITE_HOST: process.env.WEBSITE_HOST,

          // exposed only in development:
          H_WEBSITE_SERVER_URI: process.env.H_WEBSITE_SERVER_URI,
        })
      ],

      // standalone global object for main module
      standalone: 'habemus'
    });

    // inject modules for development environment
    b.require('./injected/development/habemus-dashboard-urls', {
      expose: 'habemus-dashboard-urls'
    });

    // Instantiate watchify
    var w = watchify(b);

    // set brfs transform
    w.transform(brfs);

    w.on('update', watchifyBundle); // on any dep update, runs the bundler
    w.on('log', $.util.log); // output build logs to terminal

    /**
     * Bundles browserify stack using watchify
     */
    function watchifyBundle() {
      return w.bundle()
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
        .on('error', function () {
          this.emit('end');
        })
        .pipe(vinylSource('index.bundle.js'))
        .pipe(vinylBuffer())
        .on('end', browserSync.reload)
        .pipe(gulp.dest(config.srcDir))
        .pipe($.size({
          title: 'watchify:javascript',
          showFiles: true
        }));
    }

    // Invoke watchify bundle once to start watching files
    // and return the stream in order to prevent subsequent
    // tasks from continuing without the browserify being complete
    // (crappish gulp+browserify+watchify integration)
    return watchifyBundle();
  });

  /**
   * Watches files for changes and acts accordingly
   */
  gulp.task('watch', ['watch:watchify'], function () {

    // HTML
    gulp.watch(config.srcDir + '/**/*.html')
      .on('change', browserSync.reload);

    // LESS
    gulp.watch(config.srcDir + '/**/*.less', ['less']);
    gulp.watch(config.srcDir + '/**/*.css')
      .on('change', browserSync.reload);   
  });

  /**
   * Serves the application client
   */
  gulp.task('serve:develop', function () {
    var bs = browserSync({
      ghostMode: false,
      port: process.env.DASHBOARD_PORT,
      server: {
        baseDir: './',
        routes: {
          "/dashboard": "src"
        },
      },
      startPath: '/dashboard',
      open: true,
    });
  });
};
