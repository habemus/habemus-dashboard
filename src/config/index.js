// native
var url = require('url');

// internal
var cfg = require('./config.json');

exports.parse = {
  applicationId: cfg.PARSE_APPLICATION_ID,
  javascriptKey: cfg.PARSE_JAVASCRIPT_KEY,
};

exports.projectAPI = url.parse(cfg.PROJECT_API_LOCATION);
exports.projectAPI.location = cfg.PROJECT_API_LOCATION;

exports.router = url.parse(cfg.ROUTER_LOCATION);
exports.router.location = cfg.ROUTER_LOCATION;