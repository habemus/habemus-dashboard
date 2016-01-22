// native
var path = require('path');
var fs   = require('fs');

var template = fs.readFileSync(path.join(__dirname, '../views/loading-dialog/template.html'), 'utf8');

module.exports = /* @ngInject */ function loadingDialogService($compile, $controller, $rootScope) {

  var $loadingScope = $rootScope.$new();
  
  $loadingScope.safeApply = function(fn) {
    var phase = this.$root.$$phase;
    if(phase == '$apply' || phase == '$digest') {
      if(fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };

  function _resetLoadingScopeValues() {
    // set initial values for the loadingScope
    $loadingScope.isActive = false;
    $loadingScope.progress = false;
    $loadingScope.message  = '';
  }

  _resetLoadingScopeValues();

  // Step 1: parse HTML into DOM element
  var angularTemplate = angular.element(template);

  // Step 2: compile the template
  var linkFn = $compile(angularTemplate);

  // Step 3: link the compiled template with the scope.
  var element = linkFn($loadingScope);

  // Step 4: Append to DOM (optional)
  document.querySelector('body').appendChild(element[0]);

  return {
    open: function (options) {
      options = options || {};

      $loadingScope.isActive = true;
      $loadingScope.progress = options.progress || false;
      $loadingScope.message  = options.message  || 'loading';

      $loadingScope.safeApply();
    },
    
    close: function () {
      // reset values to initial state
      _resetLoadingScopeValues();

      $loadingScope.safeApply();
    },

    setMessage: function (message) {
      $loadingScope.message = message;
      $loadingScope.safeApply();
    },

    setProgress: function (progress) {
      $loadingScope.progress = progress;
      $loadingScope.safeApply();
    }
  };
}