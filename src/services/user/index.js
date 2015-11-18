// native
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Parse = require('parse');

function UserServiceClient() {

}

util.inherits(UserServiceClient, EventEmitter);

UserServiceClient.prototype.signUp = function (userData) {

  var user = new Parse.User(userData);

  var signupPromise = user.signUp();

  signupPromise.then(function () {
    this.emit('signUp');
  }.bind(this))
  .fail(function () {
    alert('failed')
  });

  return signupPromise;
};

UserServiceClient.prototype.current = Parse.User.current.bind(Parse.User);

UserServiceClient.prototype.logIn = function (username, password) {
  var logInPromise = Parse.User.logIn(username, password);

  logInPromise.then(function () {
    this.emit('logIn');
  }.bind(this))
  .fail(function () {
    alert('logIn failed')
  });

  return logInPromise;
};

UserServiceClient.prototype.logOut = function () {
  var logOutPromise = Parse.User.logOut();

  logOutPromise.then(function () {
    this.emit('logOut');
  }.bind(this))
  .fail(function () {
    alert('logOut failed');
  })

  return logOutPromise;
};

UserServiceClient.prototype.isAuthorized = function () {
  // TODO: logic
  return this.current() ? true : false;
};

UserServiceClient.prototype.isAuthenticated = function () {
  // TODO: logic
  return this.current() ? true : false;
};


module.exports = function () {
  return new UserServiceClient();
};