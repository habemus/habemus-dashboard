var fs = require('fs');
var path = require('path');

// third-party


// constants
const SRC_DIR = path.join(__dirname, '../../src');

module.exports = function (gulp, $) {
  gulp.task('prepare-translations', function () {

    var translatableFiles = [
      'src/**/*.html',
      'src/**/*.js',
      '!src/**/*.bundle.js',
      '!src/bower_components/**/*',
    ];

    return gulp.src(translatableFiles)
      .pipe($.prepareTranslations({
        languages: [
          {
            code: 'en-US',
            src: require(SRC_DIR + '/resources/languages/en-US.json'),
          },
          {
            code: 'pt-BR',
            src: require(SRC_DIR + '/resources/languages/pt-BR.json'),
          }
        ],
        patterns: [
          // in html
          /translate=["'](.+?)["']/g,
          /\{\{\s*'(.+?)'\s*|\s*translate\s*\}\}/g,
          // in js
          /\$translate\(["'](.+?)["']\)/g,
          /\$translate\.instant\(["'](.+?)["']\)/g
        ],
      }))
      .pipe(gulp.dest(SRC_DIR + '/resources/languages/tmp'));

  });
};
