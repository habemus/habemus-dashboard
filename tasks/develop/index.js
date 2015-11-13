var path = require('path');

// External
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var browserify  = require('browserify');
var watchify    = require('watchify');
var brfs        = require('brfs');
var vinylSource = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');
var del         = require('del');

var config = require('../config');

module.exports = function (gulp, $) {

  /**
   * Uses watchify to watch for file
   * changes and recompile javascript
   */
  gulp.task('watch:watchify', function () {

    // Instantiate watchify
    var w = watchify(browserify({
      entries: ['src/index.js']
    }));

    // set brfs transform
    w.transform(brfs);

    w.on('update', watchifyBundle); // on any dep update, runs the bundler
    w.on('log', $.util.log); // output build logs to terminal

    /**
     * Bundles browserify stack using watchify
     */
    function watchifyBundle() {
      return w.bundle()
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
      port: 4000,
      server: {
        baseDir: 'src',
      },
      open: true,
    });
  });

  /**
   * Runs all tasks for development environment setup and go
   */
  gulp.task('develop', function (done) {
    runSequence(['less', 'javascript'], 'serve:develop', 'watch', done);
  });
};
