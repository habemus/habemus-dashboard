// third party
var Q = require('q');
var _ = require('lodash');

var aux = require('../../lib/auxiliary');

module.exports = /* @ngInject */ function (apiAuth, $rootScope, $compile, $timeout) {

  // saves data about the intro so that it will not appear automatically
  // anymore to the user
  function _setAsShown(prop) {

    var user = $rootScope.currentUser;

    var guideState = user.guideState || {};

    guideState[prop] = false;

    apiAuth.updateCurrentUserData({
      guideState: guideState
    });
  };

  function _compileStep(step) {
    var defer = Q.defer();

    var $compiledEl = $compile('<div>' + step.intro + '</div>')($rootScope.$new());

    // get the html on the next tick,
    // we need to let angular run a $diget cycle
    $timeout(function () {
      step.intro = $compiledEl.html();

      defer.resolve(step);
    }, 0);

    return defer.promise;
  }

  ///////////////////////
  /// DASHBOARD INTRO ///
  function dashboard() {

    var createProjectIntro = aux.isChrome() ? 
      "<p translate='dashboard.introCreateProject'></p>" :
      "<p translate='dashboard.introCreateProjectByZip'></p>";

    var sourceSteps = [
      {
        element: '[data-intro-name="create-project"]',
        intro: createProjectIntro,
        position: 'right',
        tooltipClass: 'intro-style'
      },
      {
        element: '[data-intro-name="access-account"]',
        intro: "<p translate='dashboard.introAccessAccount'></p>",
        position: 'bottom-right-aligned',
        tooltipClass: 'intro-style'
      },
      {
        element: '[data-intro-name="send-feedback"]',
        intro: "<p translate='dashboard.introSendFeedBack'></p>",
        position: 'top',
        tooltipClass: 'intro-style'
      },
    ];

    return Q.all(sourceSteps.map(_compileStep))
      .then(function (steps) {

        var dIntro = introJs();
        dIntro.setOptions({
          steps: steps,
          showStepNumbers: false,
          disableInteraction: true,
        });

        dIntro.setAsShown = _setAsShown.bind(null, 'showDashboardIntro');
        dIntro.onexit(dIntro.setAsShown);
        dIntro.oncomplete(dIntro.setAsShown);

        return dIntro;
      });
  }
  /// DASHBOARD INTRO ///
  ///////////////////////
  
  /////////////////////
  /// PROJECT INTRO ///
  function projectIntro() {

    var updateProjectIntro = aux.isChrome() ?
      "<p translate='projectGeneral.introUpdate'></p>" : 
      "<p translate='projectGeneral.introUpdateByZip'></p>";

    var sourceSteps = [
      {
        element: '[data-intro-name="habemus-menu-general"]',
        intro: "<p translate='projectGeneral.introMenuGeneral'></p>",
        position: 'right',
        tooltipClass: 'intro-style'
      },
      {
        element: '[data-intro-name="habemus-edit-name"]',
        intro: "<p translate='projectGeneral.introEditName'></p>",
        position: 'bottom',
        tooltipClass: 'intro-style'
      },
      {
        element: '[data-intro-name="habemus-update-project"]',
        intro: updateProjectIntro,
        position: 'top',
        tooltipClass: 'intro-style'
      },
      {
        element: '[data-intro-name="habemus-view-projects"]',
        intro: "<p translate='projectGeneral.introMyProjects'></p>",
        position: 'bottom',
        tooltipClass: 'intro-style'
      },
      {
        element: '[data-intro-name="habemus-menu-history"]',
        intro: "<p translate='projectGeneral.introMenuHistory'></p>",
        position: 'right',
        tooltipClass: 'intro-style'
      },
      {
        element: '[data-intro-name="habemus-menu-domains"]',
        intro: "<p translate='projectGeneral.introMenuDomains'></p>",
        position: 'right',
        tooltipClass: 'intro-style'
      },
    ];

    return Q.all(sourceSteps.map(_compileStep))
      .then(function (steps) {
        var pIntro = introJs();
        pIntro.setOptions({
          steps: steps,
          showStepNumbers: false,
          disableInteraction: true
        });

        pIntro.setAsShown = _setAsShown.bind(null, 'showProjectIntro');
        pIntro.onexit(pIntro.setAsShown);
        pIntro.oncomplete(pIntro.setAsShown);

        return pIntro;
      });
  }
  /// PROJECT INTRO ///
  /////////////////////


  var intro = {
    dashboard: dashboard,
    project: projectIntro
  }

  return intro;
};