module.exports = function (gulp, $) {
  require('./less')(gulp, $);
  require('./javascript')(gulp, $);
  require('./distribute')(gulp, $);
};
