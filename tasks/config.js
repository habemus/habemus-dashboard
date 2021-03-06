/**
 * Configurations shared by all tasks
 * @type {String}
 */

var path = require('path');

exports.root   = path.join(__dirname, '..');
exports.srcDir = 'src';

/**
 * The path to the configuration file of the application
 * @type {String}
 */
exports.appConfigPath = path.join(__dirname, '../src/config/config.json');