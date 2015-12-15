// native
var EventEmitter = require('events').EventEmitter;
var util         = require('util');

// external
var _ = require('lodash');

function EntryData(type, name, parent, data) {

  if (!type) {
    throw new Error('EntryData requires a type');
  }

  if (!name) {
    throw new Error('EntryData requires a name');
  }

  this.type   = type;
  this.name   = name;
  this.parent = parent;

  this.data   = data || {};
}

util.inherits(EntryData, EventEmitter);

EntryData.prototype.getAbsolutePath = function () {

  var parts   = [];
  var current = this;

  while (current.parent) {
    parts.unshift(current.name);
    current = current.parent;
  }

  return '/' + parts.join('/');
};

/**
 * Sets data
 * @param {[type]} data [description]
 */
EntryData.prototype.setData = function () {

  if (typeof arguments[0] === 'object') {
    // setData({ key: 'value' });
    _.assign(this.data, data);
  } else if (arguments.length === 2) {
    // setData('key', 'value');
    this.data[arguments[0]] = arguments[1];
  }
};

Object.defineProperty(EntryData.prototype, 'isDirectory', {
  get: function () {
    return this.type === 'directory';
  }
});

Object.defineProperty(EntryData.prototype, 'isFile', {
  get: function () {
    return this.type === 'file';
  }
});

module.exports = EntryData;