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
        element: '[data-intro-name="view-projects"]',
        intro: "Hello world!"
      },
      {
        element: '[data-intro-name="create-project"]',
        intro: "Create a project by dragging a folder here.",
        position: 'right',
      },
    ],
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
        element: '[data-intro-name="habemus-domain"]',
        intro: "Hello world!"
      },
    ],
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