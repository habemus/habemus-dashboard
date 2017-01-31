var fs   = require('fs');
var path = require('path');

var del         = require('del');
var runSequence = require('run-sequence');

var config = require('../config');
var browserifyPipe = require('./auxiliary/browserify');

// HABEMUS.IO google analytics script
const GA_SCRIPT = `<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-71194663-5', 'auto');
  ga('send', 'pageview');

</script>`;

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
  gulp.task('distribute:compile', ['distribute:javascript'], function () {
    return gulp.src(tmpDir + '/index.html')
      // run cheerio before useref, so that we are sure
      // cheerio is run only against index.html
      .pipe($.cheerio(function ($, file, done) {

        $('body').append(GA_SCRIPT);

        done();
      }))
      // builds scripts and css into single files
      .pipe($.useref())
      .pipe($.if('*.css', $.minifyCss()))
      .pipe($.size({
        title: 'distribute:compile',
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
    return runSequence(['distribute:compile', 'distribute:resources'], 'distribute:clear-tmp');
  });

};
