var fs   = require('fs');
var path = require('path');

var del         = require('del');
var runSequence = require('run-sequence');

var config = require('../config');
var browserifyPipe = require('./auxiliary/browserify');

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
   * Browserifies tmp and annotates
   */
  gulp.task('distribute:javascript', ['distribute:tmp'], function () {
    return browserifyPipe(tmpDir + '/index.js')
      .pipe($.babel({
        presets: ['es2015'],
      }))
      // .pipe($.ngAnnotate())
      // .pipe($.stripDebug())
      // .pipe($.uglify().on('error', function (err) {
      //   console.warn(err);
      // }))
      .pipe($.size({
        title: 'distribute:javascript',
        showFiles: true,
        gzip: true
      }))
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
      // .pipe($.if('*.js', $.uglify()))
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
