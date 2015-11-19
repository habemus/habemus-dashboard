// native
var util = require('util');

var EventEmitter = require('events').EventEmitter;

var Parse = require('parse');
var Project = Parse.Object.extend("Project");
var Query   = Parse.Query;

function ProjectServiceClient(services) {
  this.userService = services.user;
  this.http        = services.http;
}

util.inherits(ProjectServiceClient, EventEmitter);

ProjectServiceClient.prototype.create = function (projectData) {
  var project = new Project(projectData);

  // allow only the current user to access this project's data
  project.setACL(new Parse.ACL(this.userService.current()));

  // add owner
  project.relation('owners').add(this.userService.current());

  var savePromise = project.save();

  return savePromise.then(function (saved) {
    return saved.toJSON();
  }.bind(this));
};

ProjectServiceClient.prototype.get = function (projectId) {

  var query = new Query(Project);

  return query.get(projectId).then(function (p) {
    return p.toJSON();
  });
};

ProjectServiceClient.prototype.find = function () {

  var query = new Query(Project);

  // only projects for the current user
  query.equalTo('owners', this.userService.current());
  query.descending('createdAt');

  return query.find().then(function (projects) {

    // return array of pure data
    return projects.map(function (p) {
      return p.toJSON();
    });
  });
};

ProjectServiceClient.prototype.update = function (projectId, projectData) {

};

ProjectServiceClient.prototype.delete = function (projectId) {

};

module.exports = function (userService, $http) {

  return new ProjectServiceClient({
    user: userService,
    http: $http,
  });
};