// third party
var _ = require('lodash');

module.exports = /* @ngInject */ function (auth, $rootScope) {

  // saves data about the intro so that it will not appear automatically
  // anymore to the user
  function _setAsShown(prop) {

    var user = $rootScope.currentUser;

    var guideState = user.guideState || {};

    guideState[prop] = false;

    auth.updateCurrentUserData({
      guideState: guideState
    });
  };

  ///////////////////////
  /// DASHBOARD INTRO ///
  var dashboardIntro = introJs();
  dashboardIntro.setOptions({
    steps: [
      {
        element: '[data-intro-name="create-project"]',
        intro: "<p translate='dashboard.introCreateProject'>Upload a new project by dragging a folder here or by clicking to choose a folder</p>",
        position: 'right',
        tooltipClass: 'intro-style'
      },
      {
        element: '[data-intro-name="access-account"]',
        intro: "<p translate='dashboard.introAccessAccount'>Access this menu to quickly see the overview of your projects or manage your account settings</p>",
        position: 'bottom-right-aligned',
        tooltipClass: 'intro-style'
      },
      {
        element: '[data-intro-name="send-feedback"]',
        intro: "<p translate='dashboard.introSendFeedBack'>Use this box to contact us whenever you feel like. We want to hear you :)</p>",
        position: 'top',
        tooltipClass: 'intro-style'
      },
    ],
    showStepNumbers: false,
  });

  dashboardIntro.setAsShown = _setAsShown.bind(null, 'showDashboardIntro');
  dashboardIntro.onexit(dashboardIntro.setAsShown);
  dashboardIntro.oncomplete(dashboardIntro.setAsShown);
  /// DASHBOARD INTRO ///
  ///////////////////////
  
  /////////////////////
  /// PROJECT INTRO ///
  var projectIntro = introJs();
  projectIntro.setOptions({
    steps: [
      {
        element: '[data-intro-name="habemus-menu-general"]',
        intro: "<p translate='project.introMenuGeneral'>Set general options of your project</p>",
        position: 'right',
        tooltipClass: 'intro-style'
      },
      {
        element: '[data-intro-name="habemus-edit-name"]',
        intro: "<p translate='project.introEditName'>Click to edit the name of your project</p>",
        position: 'bottom',
        tooltipClass: 'intro-style'
      },
      {
        element: '[data-intro-name="habemus-update-project"]',
        intro: "<p translate='project.introUpdate'>Update your project by dragging the folder here or by clicking to choose the folder from your computer</p>",
        position: 'top',
        tooltipClass: 'intro-style'
      },
      {
        element: '[data-intro-name="habemus-view-projects"]',
        intro: "<p translate='project.introMyProjects'>Go back to see the overview of all your projects</p>",
        position: 'bottom',
        tooltipClass: 'intro-style'
      },
      {
        element: '[data-intro-name="habemus-menu-history"]',
        intro: "<p translate='project.introMenuHistory'>See the versions of your project, restore and download them</p>",
        position: 'right',
        tooltipClass: 'intro-style'
      },
      {
        element: '[data-intro-name="habemus-menu-domains"]',
        intro: "<p translate='project.introMenuDomains'>Connect custom domains and edit the domain created by habemus for your project</p>",
        position: 'right',
        tooltipClass: 'intro-style'
      },
    ],
    showStepNumbers: false,
  });

  projectIntro.setAsShown = _setAsShown.bind(null, 'showProjectIntro');
  projectIntro.onexit(projectIntro.setAsShown);
  projectIntro.oncomplete(projectIntro.setAsShown);
  /// PROJECT INTRO ///
  /////////////////////


  var intro = {
    dashboard: dashboardIntro,
    project: projectIntro
  }

  return intro;
};