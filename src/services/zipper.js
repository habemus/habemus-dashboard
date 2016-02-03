var Zip = require('../lib/zip');

// the export
module.exports = /* @ngInject */ function () {
  return {
    create: function () {
      return new Zip();
    },
  };
};