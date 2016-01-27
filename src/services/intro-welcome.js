// third party
var _ = require('lodash');

module.exports = /* @ngInject */ function () {


  var steps = [
    { 
      intro: "Hello world!"
    },
    {
      name: 'create-project',
      intro: "Create a project by dragging a folder here.",
    },
  ];

  /**
   * Generates an intro.js compatible step
   */
  function compileStep(sourceStep) {
    return {
      intro: sourceStep.intro,
      element: '[data-intro-name="' + sourceStep.name + '"]',
      position: sourceStep.position
    };
  }

  return function () {
    var intro = introJs();

    intro.setOptions({
      steps: steps.map(compileStep),
      disableInteraction: false,
    });

    intro.start();

    return intro;
  };
};