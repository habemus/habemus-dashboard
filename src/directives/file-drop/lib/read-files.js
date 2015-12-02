var Q         = require('q');
var _         = require('lodash');

/**
 * Enforces the FileDataObject interface.
 * @param  {HTML5 File} file     [description]
 * @param  {String} basePath [description]
 * @return {FileDataObject}
 *         A meta object with extra data on the file
 */
function _buildFileDataObject(file, basePath) {
  return {
    lastModified: file.lastModified,
    name: file.name,
    size: file.size,
    path: basePath + '/' + file.name,
    file: file,
  };
}

/**
 * Reads data from a file entry
 * @param  {FileEntry} fileEntry    [description]
 * @param  {String} basePath The path on which the file sits
 * @return {Promise -> FileDataObject}          [description]
 */
function _parseFileEntry(fileEntry, basePath) {
  var defer = Q.defer();

  fileEntry.file(function (file) {
    defer.resolve(_buildFileDataObject(file, basePath));
  });

  return defer.promise;
}

/**
 * Parses data from a directoryEntry
 * @param  {DirectoryEntry} directoryEntry [description]
 * @param  {String} basePath       [description]
 * @return {Promise -> Array of FileDataObjects}                [description]
 */
function _parseDirectoryEntry(directoryEntry, basePath) {

  // add stuff to base path
  basePath += '/' + directoryEntry.name;

  var defer = Q.defer();

  // get directory contents
  var directoryReader = directoryEntry.createReader();
  directoryReader.readEntries(function (entries) {

    var entryFilePromises = _.map(entries, function (subEntry) {
      return _parseWebkitEntry(subEntry, basePath);
    });

    Q.all(entryFilePromises)
      .then(function (entryFiles) {
        defer.resolve(_.flatten(entryFiles));
      });

  });

  return defer.promise;

}

/**
 * Checks which parser to use (file or directory)
 * @param  {Entry} entry    [description]
 * @param  {String} basePath [description]
 * @return {[type]}          [description]
 */
function _parseWebkitEntry(entry, basePath) {
  if (entry.isFile) {
    return _parseFileEntry(entry, basePath);
  } else if (entry.isDirectory) {
    return _parseDirectoryEntry(entry, basePath);
  }
}

/**
 * Reads files from a drop event
 * @param  {event} e [description]
 * @return {Promise -> Array[FileDataObject]}   [description]
 */
function fromDropEvent(e, filterFn) {

  var defer = Q.defer();

  try {
    var items = e.dataTransfer.items;

    var parsePromises = _.map(items, function (item) {

      var entry = item.webkitGetAsEntry();

      if (entry) {
        var basePath = '';
        return _parseWebkitEntry(entry, basePath);
      }
    });

    Q.all(parsePromises)
      .then(function (files) {

        // flatten deep array
        files = _.flatten(files);

        // check if there is a filter function
        if (typeof filterFn === 'function') {
          files = _.filter(files, filterFn);
        }

        defer.resolve(files);
      });
  } catch (e) {
    var files = e.dataTransfer.files;
    var fileDataObjects = _.map(files, function (file) {
      return _buildFileDataObject(file, '');
    });

    // resolve
    defer.resolve(fileDataObjects);
  }

  return defer.promise;
}

function fromFileInput(input) {
  throw new Error('not implemented yet');
}

exports.fromDropEvent = fromDropEvent;
exports.fromFileInput = fromFileInput;
