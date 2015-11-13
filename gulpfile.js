// Native dependencies
var path = require('path');
var fs   = require('fs');

// external dependencies
var gulp = require('gulp');

// Load all installed gulp plugins into $
var $ = require('gulp-load-plugins')();

// Internal dependencies
var config = require('./tasks/config');

// load task definers
require('./tasks/build')(gulp, $);
require('./tasks/develop')(gulp, $);