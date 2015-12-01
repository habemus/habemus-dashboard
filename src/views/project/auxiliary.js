'use strict';

// external dependencies
var _    = require('lodash');
var path = require('path');

function getFullPath(item, partialPath) {

  partialPath = partialPath || '';
  partialPath = path.join(item.path, partialPath);

  if (item.parent) {
    return getFullPath(item.parent, partialPath);
  } else {
    return partialPath;
  }
}

function _createFile(parent, filepath, fileData) {

  var parts   = typeof filepath === 'string' ? filepath.split('/') : filepath;
  var current = parts.shift();

  var currentItem = _.find(parent.items, function (d) {
    return d.type === 'directory' && d.path === current;
  });

  if (!currentItem) {

    currentItem = {
      parent: parent,
      type: parts.length >= 1 ? 'directory' : 'file',
      path: current,
      items: [],
    };

    parent.items.push(currentItem);
  }

  if (parts.length > 0) {
    _createFile(currentItem, parts, fileData);
  }
}

exports.parseFilesIntoUITree = function parseFilesIntoUITree(files) {
  files = files || [];
  var root = {
    path: '',
    type: 'directory',
    items: []
  };

  files.forEach(function (f) {
    _createFile(root, f.path, f);
  });

  return root;
};


exports.getFullPath = getFullPath;