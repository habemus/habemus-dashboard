// native
var url    = require('url');

// internal
var config = require('./config.json');

exports.projectAPI = url.parse(config.PROJECT_API_LOCATION);
exports.projectAPI.location = config.PROJECT_API_LOCATION;

exports.router = url.parse(config.ROUTER_LOCATION);
exports.router.location = config.ROUTER_LOCATION;