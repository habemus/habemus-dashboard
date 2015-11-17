var fs   = require('fs');
var path = require('path');

var TEMPLATES = {
  header:    fs.readFileSync(path.join(__dirname, '../views/header/template.html'), 'utf-8'),
  dashboard: fs.readFileSync(path.join(__dirname, '../views/dashboard/template.html'), 'utf-8'),
  login:     fs.readFileSync(path.join(__dirname, '../views/login/template.html'), 'utf-8'),
  project:   fs.readFileSync(path.join(__dirname, '../views/project/template.html'), 'utf-8'),
};

// view objects
var header = {
  template: TEMPLATES.header,
  controller: require('../views/header/controller'),
};

module.exports = function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state('login', {
    url: '/login',
    views: {
      body: {
        template: TEMPLATES.login,
        controller: require('../views/login/controller'),
      }
    },
  });

  $stateProvider.state('dashboard', {
    url: '/',
    data: {
      authorizedRoles: ['developer']
    },
    views: {
      header: header,
      body: {
        template: TEMPLATES.dashboard,
        controller: require('../views/dashboard/controller'),
      }
    }
  });

  $stateProvider.state('project', {
    url: '/projects/:projectId',
    data: {
      authorizedRoles: ['developer']
    },
    views: {
      header: header,
      body: {
        template: TEMPLATES.project,
        controller: require('../views/project/controller'),
      }
    }
  });

  $urlRouterProvider.otherwise('/');
}