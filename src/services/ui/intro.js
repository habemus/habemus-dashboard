// third party
const Bluebird = require('bluebird');

var aux = require('../../lib/auxiliary');

module.exports = /* @ngInject */ function ($rootScope, $compile, $timeout, uiHAccountDialog) {

  // saves data about the intro so that it will not appear automatically
  // anymore to the user
  function _updateGuideStatus(guideName, guideStatus) {

    return uiHAccountDialog.getCurrentAccount()
      .then(function (account) {

        var config = {};
        config['guides.' + guideName] = guideStatus;

        return uiHAccountDialog.hAccountClient.updateApplicationConfig(
          uiHAccountDialog.getAuthToken(),
          account.username,
          'dashboard',
          config
        );
      })
      .then(function (account) {
        // update cached version of account
        uiHAccountDialog.hAccountClient.setCachedAccount(account);
      });
  };

  function _compileStep(step) {
    return new Bluebird(function (resolve, reject) {
      var $compiledEl = $compile('<div>' + step.intro + '</div>')($rootScope.$new());

      // get the html on the next tick,
      // we need to let angular run a $diget cycle
      $timeout(function () {
        step.intro = $compiledEl.html();

        resolve(step);
      }, 0);
    });
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

    return Bluebird.all(sourceSteps.map(_compileStep))
      .then(function (steps) {

        var dIntro = introJs();
        dIntro.setOptions({
          steps: steps,
          showStepNumbers: false,
          disableInteraction: true,
        });

        dIntro.onexit(_updateGuideStatus.bind(null, 'dashboard', 'skipped'));
        dIntro.oncomplete(_updateGuideStatus.bind(null, 'dashboard', 'completed'));

        return dIntro;
      });
  }
  /// DASHBOARD INTRO ///
  ///////////////////////
  
  /////////////////////
  /// PROJECT INTRO ///
  function projectGeneral() {

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

    return Bluebird.all(sourceSteps.map(_compileStep))
      .then(function (steps) {
        var pIntro = introJs();
        pIntro.setOptions({
          steps: steps,
          showStepNumbers: false,
          disableInteraction: true
        });

        pIntro.onexit(_updateGuideStatus.bind(null, 'project-general', 'skipped'));
        pIntro.oncomplete(_updateGuideStatus.bind(null, 'project-general', 'completed'));

        return pIntro;
      });
  }
  /// PROJECT INTRO ///
  /////////////////////


  var intro = {
    dashboard: dashboard,
    projectGeneral: projectGeneral
  }

  return intro;
};