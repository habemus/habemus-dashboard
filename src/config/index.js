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

exports.hAuthURI = 'http://104.196.138.132';
// exports.hProjectManagerURI = 'http://localhost:5000';
exports.hProjectManagerURI = 'http://104.196.1.248';
exports.hDevURI = 'http://localhost:5001';
