var fs   = require('fs');
var path = require('path');

var runSequence = require('run-sequence');
var polybuild   = require('polybuild');

var config = require('../config');


var browserifyPipe = require('./auxiliary/browserify')

module.exports = function (gulp, $) {


  gulp.task('distribute:tmp', ['less'], function () {
    gulp.src(config.srcDir + '/**/*')
      .pipe(gulp.dest('.tmp/src'));
  });

  gulp.task('distribute:config', ['distribute:tmp'], function () {

    fs.writeFileSync(config.root)
  });

  gulp.task('distribute:javascript', ['distribute:tmp'], function () {
    return browserifyPipe('.tmp/src/index.js', '.tmp/src');
  });

  gulp.task('distribute:polybuild', ['distribute:javascript'], function () {
    // return gulp.src('.tmp/src/index.html')
    //     // maximumCrush should uglify the js
    //     .pipe(polybuild({ maximumCrush: true }))
    //     .pipe($.size({
    //         title: 'distribute:polybuild',
    //         showFiles: true,
    //         gzip: true
    //     }))
    //     .pipe(gulp.dest('dist'));
  });


  gulp.task('distribute', function () {
    return runSequence('distribute:polybuild')
  });

};
