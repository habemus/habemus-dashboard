var JSZip = require('jszip');
var Q     = require('q');
var _     = require('lodash');

/**
 * Auxiliary function that instantiates file reader and sets
 * `onload` callback
 * @param {String} filename
 * @param  {File} file
 * @return {Promise -> ArrayBuffer}
 */
function _readFile(fData) {
  var defer = Q.defer();

  var reader = new FileReader();

  reader.onload = function () {

    // set contents onto fData
    fData.contents = reader.result;

    // resolve with fData itself
    defer.resolve(fData);
  };

  // start reading
  reader.readAsArrayBuffer(fData.file);

  // return the promise
  return defer.promise;
}

/**
 * Deals with the zipping files from inputs logic
 */
function Zip() {

  // hash to store the files by filename
  this.fileDataObjects = [];
}

/**
 * Loads a zip file
 * @param  {[type]} file [description]
 * @return {[type]}      [description]
 */
// Zip.prototype.load = function (file) {

//   var self = this;

//   return _readFile({
//     name: '',
//     file: file
//   })
//   .then(function (fData) {


//     console.log(fData);
//     var zip = new JSZip();
//     zip.load(fData.contents);

//     console.log(zip.files);

//     _.each(zip.files, function (file, filename) {
//       self.fileDataObjects.push({
//         name: filename,
//       })
//     });

//     zip.files.forEach(function (f) {

//     });

//     return zip.files;
//   })
// };

/**
 * Adds a file to be zipped
 * @param {[type]} filename [description]
 * @param {[type]} file     [description]
 */
Zip.prototype.file = function (filename, file) {
  this.fileDataObjects.push({
    name: filename,
    file: file,
  });
};

/**
 * Generates a zip file
 * @return {[type]} [description]
 */
Zip.prototype.generate = function () {

  console.log(this.fileDataObjects.length + ' will be read');

  var readPromises = this.fileDataObjects.map(_readFile);

  // wait for all read promises to be done
  return Q.all(readPromises)
    .then(function (readResults) {

      // create a jsZip instance
      var zip = new JSZip();

      readResults.forEach(function (res) {
        zip.file(res.name, res.contents, { base64: true });
      });

      return zip.generate({ type: 'blob' });
    });
};

module.exports = Zip;