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

module.exports = /* @ngInject */ function ApplicationCtrl($scope, auth, $rootScope, $state, $timeout, $translate, Parse, authModal, betaPasswordResetModal, betaLoginModal) {

  function _openLogin() {
    // check if it is a beta login
    var currentUserModel = auth.getCurrentUser();

    var betaData = _getBetaData();

    if (betaData) { 
      // beta login (token based)
      betaLoginModal.open({ betaData: betaData });

    } else {

      $translate('SESSION_EXPIRED_LOGIN').then(function (message) {
        // normal login
        // open login modal and navigate to the desired state
        var dialog = authModal.open({
          message: message
        });

        dialog.closePromise.then(function () {
          $state.go('dashboard');
        });
      });
    }
  }

  function _handleAuthStatusChange() {

    if (auth.isAuthenticated()) {
      // logged in
      auth.getCurrentUser()
        .fetch()
        .then(function (user) {
          $scope.setCurrentUser(user.toJSON());

          // check for beta users that need to change password
          if (user.toJSON().requirePasswordReset_) {
            betaPasswordResetModal.open();
          }
        }, function (err) {

          if (err.code === auth._parse.Error.INVALID_SESSION_TOKEN) {
            auth._parse.User.logOut();
          }
          _openLogin();

        });

    } else {
      // logged out
      _openLogin();
    }
  }

  // authentication
  auth.on('auth-status-change', _handleAuthStatusChange);
  _handleAuthStatusChange();
  
  $scope.setCurrentUser = function (user) {
    $scope.currentUser = user;

    $scope.$apply();
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
    
    var message = $scope.message;
    
    var file = $('#file-upload')[0].files[0];
    
    if (file && message) {
      
      $scope.resultMessage = "Enviando...";
      
      var parseFile = new Parse.File(file.name, file);
      
      parseFile.save().then(function() {
        var feedback = new Parse.Object("Feedback");
        feedback.set("image", parseFile);
        feedback.set("user", Parse.User.current());
        feedback.set("message", message);
        feedback.set("state", $state.$current.name);

        feedback.save().then(function(){
          $scope.message = "";
          $('#file-upload').val("");
          $scope.resultMessage = "Sucesso!"
          
          $scope.$apply();
          
        }, function(error){
          console.log(error);
          $scope.resultMessage = "Something went wrong, please try again";
          
          $scope.$apply();
        })

      }, function(error){
        console.log(error);
        $scope.resultMessage = "Something went wrong, please try again";
        
        $scope.$apply();
      })
    } else if (message) {
      
      $scope.resultMessage = "Enviando...";
            
      var feedback = new Parse.Object("Feedback");
      feedback.set("user", Parse.User.current());
      feedback.set("message", message);
      feedback.set("state", $state.$current.name);

      feedback.save().then(function(){
        $scope.message = "";
        $scope.resultMessage = "Thanks for the feedback!"
        
        $scope.$apply();
        
      }, function(error){
        console.log(error);
        $scope.resultMessage = "Something went wrong, please try again";
        
        $scope.$apply();
      })
      
    } else if (file) {
      
      $scope.resultMessage = "Please write a message";
    } else {
      
    }
    
  };
  
  /// FEEDBACK ///
  ////////////////
  
};