module.exports = function (gulp, $) {
  require('./watch')(gulp, $);
  require('./serve-dist')(gulp, $);
}