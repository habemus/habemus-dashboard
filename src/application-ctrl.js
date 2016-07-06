// native
var path        = require('path');
var fs          = require('fs');
var url         = require('url');
var querystring = require('querystring');

// constants
var BETA_DATA_QUERY_PARAM = 'betaData';

/**
 * Auxiliary function for retrieving betaData query param
 * @return {String||Undefined}
 */
function _getBetaData() {
  var parsedUrl = url.parse(window.location.href);
  var parsedQs  = querystring.parse(parsedUrl.query);

  return parsedQs[BETA_DATA_QUERY_PARAM];
}

module.exports = /* @ngInject */ function ApplicationCtrl($scope, apiAuth, $rootScope, $state, $timeout, $translate, uiAuthDialog) {
  
  function _openLogin() {
    $translate('sessionExpiredLogin').then(function (message) {
      // normal login
      // open login modal and navigate to the desired state
      var dialog = uiAuthDialog.open({
        message: message
      });

      dialog.closePromise.then(function () {
        $state.go('dashboard');
      });
    });
  }

  function _handleAuthStatusChange() {
    // logged in
    apiAuth.getCurrentUser()
      .then(function (user) {

        $scope.setCurrentUser(user);
      }, function (err) {

        if (err.name === 'NotLoggedIn') {
          _openLogin();
        }
      })
      .done();
  }
  
  // apiAuthentication
  apiAuth.on('auth-status-change', _handleAuthStatusChange);
  _handleAuthStatusChange();
  
  $scope.setCurrentUser = function (user) {
    $rootScope.currentUser = user;

    $rootScope.$apply();
  };

  ///////////////
  /// HISTORY ///
  
  // history object to save the history
  var history = [];
  
  $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
    
    var last = {
      state: from,
      params: fromParams
    };

    // add to the history
    history.push(last);
  });
  
  $scope.goBack = function () {
    
    var last = history.pop();
    
    $state.go(last.state.name, last.params)
      .then(function () {
        // pop the last again so that the current state does not get into the history stack
        history.pop();
      });
  };

  /// HISTORY ///
  ///////////////
  
  /////////////////
  /// AUTOFOCUS ///
  // tell Angular to call this function when a route change completes  
  $rootScope.$on('$stateChangeSuccess', function() {  
    // we can't set focus at this point; the DOM isn't ready for us  
  
    // instead, we define a callback to be called after the $digest loop  
    $timeout(function(){  
      // once this is executed, our input should be focusable, so find (with jQuery)  
      // whatever is on the page with the autofocus attribute and focus it; fin.  
      $('[autofocus]').focus();  
    });  
  });

  /// AUTOFOCUS ///
  /////////////////

  
  ////////////////
  /// FEEDBACK ///
  
  $scope.boxIsOpen = false;
  
  $scope.openBoxFeedback = function () {
    $scope.boxIsOpen = true;
  }
  
  $scope.closeBoxFeedback = function () {
    $scope.boxIsOpen = false;
    $scope.message = "";
    $('#file-upload').val("");
    $scope.resultMessage = ""
  }
  
  $scope.handleFileChange = function () {
    console.log(arguments);
  }
  
  $scope.submitFeedback = function () {
    
    console.warn('submitFeedback');
    
  };
  
  /// FEEDBACK ///
  ////////////////
  
};