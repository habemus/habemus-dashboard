var util = require('util');

var EntryData = require('./entry');

function FileData(name, parent, data) {

  EntryData.call(this, 'file', name, parent, data);
}

util.inherits(FileData, EntryData);

FileData.prototype.setProgress = function (progress) {

};

module.exports = FileData;