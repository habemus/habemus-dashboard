var browserSync = require('browser-sync');

module.exports = function (gulp, $) {

  gulp.task('serve:dist', function () {
    var bs = browserSync({
      ghostMode: false,
      port: process.env.DASHBOARD_PORT || 3000,
      server: {
        baseDir: 'dist',
      },
      open: true,
    });
  })
};