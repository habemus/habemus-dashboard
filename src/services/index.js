var Parse                   = require('parse');
var HabemusAuthClient       = require('habemus-auth/client');
var HabemusProjectAPIClient = require('habemus-project-api/client');

module.exports = function (DASHBOARD) {
  DASHBOARD.factory('parse', function () {
    Parse.initialize(
      "cKsbdOed2RBYhQ4YAdq4gK5bq6Mqt0wYsB59OgpP",
      "xLu44NceqcwtIlZaZPDZZDeKiHRR9MpYGuu5Jzk8"
    );

    return Parse;
  });
  DASHBOARD.factory('auth', function (parse) {

    window.auth = new HabemusAuthClient({
      parse: parse
    });

    return auth;
  });

  DASHBOARD.factory('projectAPI', function (parse, auth) {

    window.projectAPI = new HabemusProjectAPIClient({
      location: 'http://localhost:5000',
      parse: parse,
      auth: auth,
    });

    return window.projectAPI;
  });

};