var fs   = require('fs');
var path = require('path');

var TEMPLATES = {
  header:         fs.readFileSync(path.join(__dirname, '../views/header/template.html'), 'utf-8'),
  dashboard:      fs.readFileSync(path.join(__dirname, '../views/dashboard/template.html'), 'utf-8'),
  account:        fs.readFileSync(path.join(__dirname, '../views/account/template.html'), 'utf-8'),
  accountPasswordReset: fs.readFileSync(path.join(__dirname, '../views/account-password-reset/template.html'), 'utf-8'),
  accountDelete:  fs.readFileSync(path.join(__dirname, '../views/account-delete/template.html'), 'utf-8'),
  project:        fs.readFileSync(path.join(__dirname, '../views/project/template.html'), 'utf-8'),
  projectDelete:  fs.readFileSync(path.join(__dirname, '../views/project-delete/template.html'), 'utf-8'),
  projectGeneral: fs.readFileSync(path.join(__dirname, '../views/project-general/template.html'), 'utf-8'),
  projectHistory: fs.readFileSync(path.join(__dirname, '../views/project-history/template.html'), 'utf-8'),
  projectDomain:  fs.readFileSync(path.join(__dirname, '../views/project-domain/template.html'), 'utf-8'),
};

// view objects
var header = {
  template: TEMPLATES.header,
  controller: require('../views/header/controller'),
};

module.exports = function (DASHBOARD) {

  DASHBOARD.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state('dashboard', {
      url: '/?templateURL&projectName',
      data: {
        authorizedRoles: ['developer'],
        pageTitle: 'dashboard',
      },
      views: {
        header: header,
        body: {
          template: TEMPLATES.dashboard,
          controller: require('../views/dashboard/controller'),
        }
      },
      resolve: require('./resolve'),
    });
    
    $stateProvider.state('account', {
      url: '/account',
      data: {
        authorizedRoles: ['developer'],
        pageTitle: 'account',
      },
      views: {
        header: header,
        body: {
          template: TEMPLATES.account,
          controller: require('../views/account/controller'),
        }
      },
      resolve: require('./resolve'),
    });
    
    $stateProvider.state('accountPasswordReset', {
      data: {
        authorizedRoles: ['developer']
      },
      views: {
        header: header,
        body: {
          template: TEMPLATES.accountPasswordReset,
          controller: require('../views/account-password-reset/controller'),
        }
      }
    });
    
    $stateProvider.state('accountDelete', {
      data: {
        authorizedRoles: ['developer']
      },
      views: {
        header: header,
        body: {
          template: TEMPLATES.accountDelete,
          controller: require('../views/account-password-reset/controller'),
        }
      }
    });
    
    $stateProvider.state('project', {
      abstract: true,
      url: '/projects/:projectCode',
      data: {
        authorizedRoles: ['developer']
      },
      views: {
        header: header,
        body: {
          template: TEMPLATES.project,
          controller: require('../views/project/controller'),
        }
      },
      resolve: require('./resolve'),
    });
    
    $stateProvider.state('projectDelete', {
      url: '/',
      data: {
        authorizedRoles: ['developer']
      },
      views: {
        tab: {
          template: TEMPLATES.projectDelete,
          controller: require('../views/project-delete/controller'),
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

  // taken from:
  // https://github.com/angular-ui/ui-router/issues/1431#issuecomment-121929944
  DASHBOARD.directive('uiSrefActiveIf', function($state) {
    return {
      restrict: "A",
      controller: function ($scope, $element, $attrs) {
        var state = $attrs.uiSrefActiveIf;

        function update() {
          if ($state.includes(state) || $state.is(state)) {
            $element.addClass("active");
          } else {
            $element.removeClass("active");
          }
        }

        $scope.$on('$stateChangeSuccess', update);
        update();
      }
    };
  })


};