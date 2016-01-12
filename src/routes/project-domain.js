/**
 * Define states for project-domain navigation.
 * 
 */

// native dependencies
var fs = require('fs');
var path = require('path');

module.exports = function (DASHBOARD) {
  
  DASHBOARD.config(function ($stateProvider, $urlRouterProvider) {
    
    
    $stateProvider.state('project.domain', {
      abstract: true,
      url: '/domain',
      data: {
        authorizedRoles: ['developer']
      },
      views: {
        tab: {
          template: fs.readFileSync(path.join(__dirname, '../views/project-domain/template.html'), 'utf-8'),
          controller: require('../views/project-domain/controller'),
        } 
      }
    });
    
    $stateProvider.state('project.domain.info', {
      url: '',
      data: {
        authorizedRoles: ['developer']
      },
      views: {
        tabContent: {
          template: fs.readFileSync(path.join(__dirname, '../views/project-domain/info/template.html'), 'utf-8'),
          
        }
      }
    });
    
    $stateProvider.state('project.domain.detail', {
      data: {
        authorizedRoles: ['developer']
      },
      params: {
        domain: null
      },
      views: {
        tabContent: {
          template: fs.readFileSync(path.join(__dirname, '../views/project-domain/detail/template.html'), 'utf-8'),
          controller: require('../views/project-domain/detail/controller'),
        }
      }
    });
    
    $stateProvider.state('project.domain.rename', {
      data: {
        authorizedRoles: ['developer']
      },
      views: {
        tabContent: {
          template: fs.readFileSync(path.join(__dirname, '../views/project-domain/rename/template.html'), 'utf-8'),
          controller: require('../views/project-domain/controller'),
        }
      }
    });
    
    $stateProvider.state('project.domain.connect', {
      data: {
        authorizedRoles: ['developer']
      },
      views: {
        tabContent: {
          template: fs.readFileSync(path.join(__dirname, '../views/project-domain/connect/template.html'), 'utf-8'),
          controller: require('../views/project-domain/connect/controller'),
        }
      }
    });
    
    $stateProvider.state('project.domain.dns', {
      data: {
        authorizedRoles: ['developer']
      },
      views: {
        tabContent: {
          template: fs.readFileSync(path.join(__dirname, '../views/project-domain/dns/template.html'), 'utf-8'),
          controller: require('../views/project-domain/dns/controller'),
        }
      },
      params: {
        inProgress: null,
        domain: null,
      },
    });

  });
  
};