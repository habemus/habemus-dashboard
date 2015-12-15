'use strict';

var _ = require('lodash');
var util = require('util');

var aux = require('./auxiliary');

var EntryData = require('./entry');
var FileData  = require('./file');

function _directoryDefaultEntrySortFn(a, b) {

  if (a.type === 'directory' && b.type === 'file') {
    return -1;
  } else if (a.type === 'file' && b.type === 'directory') {
    return 1;
  } else {
    // both are of the same level, compare names
    return a.name < b.name ? -1 : 1;
  }

}

function DirectoryData(name, parent, data) {

  EntryData.call(this, 'directory', name, parent, data);

  // array containing entries of the directory
  this.entries = [];
}

util.inherits(DirectoryData, EntryData);

DirectoryData.prototype.addDirectory = function (dirname, data) {
  var dir = new DirectoryData(dirname, this, data);

  this._addEntry(dir);

  return dir;
};

/**
 * Adds a file to the given path.
 * @param {String} filePath [description]
 * @param {Object} data     [description]
 * @return {FileData} [description]
 */
DirectoryData.prototype.addFile = function (filePath, data) {
  // break the filePath into parts so its easier to manipulate it
  var parts = Array.isArray(filePath) ? filePath : aux.splitPath(filePath);

  // get the current part
  var currentPart = parts.shift();

  // check if this is the leaf
  var isLeaf = (parts.length === 0);

  // try to find the first entry
  var entry = _.find(this.entries, function (e) {
    return e.name === currentPart;
  });

  if (entry) {

    // entry exists
    // if we are adding a leaf, simply set data onto file
    if (isLeaf) {
      entry.setData(data);
      return entry;
    } else {
      // further addition request
      return entry.addFile(parts, data);
    }

  } else {

    // entry does not exist, thus, create it
    if (isLeaf) {
      // create a file object and add it
      var fileData = new FileData(currentPart, this, data);

      fileData.on('progress', function (progress) {
        console.log('aaa', progress)
      });

      this._addEntry(fileData);

      return fileData;
    } else {

      // create a directory object and tell it to add the file
      var dir = this.addDirectory(currentPart, data);

      return dir.addFile(parts, data);
    }
  }
};

DirectoryData.prototype._getEntry = function (entryPath) {
  // break the entryPath into parts so its easier to manipulate it
  var parts = Array.isArray(entryPath) ? entryPath : aux.splitPath(entryPath);

  var currentPart = parts.shift();

  var isLeaf = (parts.length === 0);

  // try to find current part
  var entry = _.find(this.entries, function (e) {
    return e.name === currentPart;
  });

  if (entry) {
    return isLeaf ? entry : entry._getEntry(parts);
  } else {
    // throw new Error('entry not found');
  }
};

DirectoryData.prototype.getFile = function (filePath) {
  var entry = this._getEntry(filePath);

  if (entry instanceof FileData) {
    return entry;
  }
};

DirectoryData.prototype.getDirectory = function (directoryPath) {
  var entry = this._getEntry(directoryPath);

  if (entry instanceof DirectoryData) {
    return entry;
  }
};

DirectoryData.prototype._addEntry = function (entry) {
  this.entries.push(entry);
  this.sortEntries();
}

DirectoryData.prototype.sortEntries = function (fn) {

  var sortFn = fn || _directoryDefaultEntrySortFn;

  this.entries.sort(sortFn);
};

Object.defineProperty(DirectoryData.prototype, 'isEmpty', {
  get: function () {
    return (this.entries.length === 0);
  },

  set: function () {
    throw new Error('set prohibited');
  }
})

module.exports = DirectoryData;