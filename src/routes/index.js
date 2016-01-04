var fs   = require('fs');
var path = require('path');

var TEMPLATES = {
  header:    fs.readFileSync(path.join(__dirname, '../views/header/template.html'), 'utf-8'),
  dashboard: fs.readFileSync(path.join(__dirname, '../views/dashboard/template.html'), 'utf-8'),
  login:     fs.readFileSync(path.join(__dirname, '../views/login/template.html'), 'utf-8'),
  project:   fs.readFileSync(path.join(__dirname, '../views/project/template.html'), 'utf-8'),
  projectGeneral:   fs.readFileSync(path.join(__dirname, '../views/project-general/template.html'), 'utf-8'),
  projectFiles:   fs.readFileSync(path.join(__dirname, '../views/project-files/template.html'), 'utf-8'),
  projectHistory:   fs.readFileSync(path.join(__dirname, '../views/project-history/template.html'), 'utf-8'),
};

// view objects
var header = {
  template: TEMPLATES.header,
  controller: require('../views/header/controller'),
};

module.exports = function (DASHBOARD) {

  DASHBOARD.config(function ($stateProvider, $urlRouterProvider) {
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
      abstract: true,
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
    
    $stateProvider.state('project.general', {
      url: '/',
      data: {
        authorizedRoles: ['developer']
      },
      views: {
        tab: {
          template: TEMPLATES.projectGeneral,
          controller: require('../views/project-general/controller'),
        } 
      }
    });
    
    $stateProvider.state('project.files', {
      url: '/files',
      data: {
        authorizedRoles: ['developer']
      },
      views: {
        tab: {
          template: TEMPLATES.projectFiles,
          controller: require('../views/project-files/controller'),
        } 
      }
    });
    
    $stateProvider.state('project.history', {
      url: '/history',
      data: {
        authorizedRoles: ['developer']
      },
      views: {
        tab: {
          template: TEMPLATES.projectHistory,
          controller: require('../views/project-history/controller'),
        } 
      }
    });

    $urlRouterProvider.otherwise('/');
  });
  
  // verify authentication on statechange
  DASHBOARD.run(function ($rootScope, $state, AUTH_EVENTS, auth) {
    $rootScope.$on('$stateChangeStart', function (event, next) {

      if (next.data && next.data.authorizedRoles) {
        var authorizedRoles = next.data.authorizedRoles;
        if (!auth.isAuthorized(authorizedRoles)) {
          event.preventDefault();
          if (auth.isAuthenticated()) {
            console.warn('not authorized');

            // user is not allowed
            $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
          } else {
            console.warn('not authenticated');

            window.location.href = 'http://habem.us';

            // $state.go('login')
            // user is not logged in
            $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
          }
        }
      }

      // no authorization config set, thus simply continue
    });
  });


};