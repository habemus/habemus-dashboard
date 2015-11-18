// native
var util = require('util');

var Parse = require('parse');
var Project = Parse.Object.extend("Project");
var Query   = Parse.Query;
var Relat

function ProjectServiceClient(services) {

  window.projectService = this;

  this.userService = services.user;

  this.currentUserProjects = [];
}

ProjectServiceClient.prototype.create = function (projectData) {
  var project = new Project(projectData);

  // allow only the current user to access this project's data
  project.setACL(new Parse.ACL(this.userService.current()));

  // add owner
  project.relation('owners').add(this.userService.current());

  var savePromise = project.save();

  savePromise.then(function (saved) {
    this.currentUserProjects.unshift(saved.toJSON());
  }.bind(this));

  return savePromise;
};

ProjectServiceClient.prototype.get = function (projectId) {

};

ProjectServiceClient.prototype.find = function () {

  var query = new Query(Project);

  // only projects for the current user
  query.equalTo('owners', this.userService.current());

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

module.exports = function (UserService) {

  return new ProjectServiceClient({
    user: UserService,
  });
};