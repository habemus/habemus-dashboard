// native
var url = require('url');

// own
var fileReader = require('../../lib/file-reader');

module.exports = /*@ngInject*/ function DashboardCtrl($scope, currentAccount, $translate, $filter, uiHAccountDialog, apiHProject, apiHWorkspace, $state, $stateParams, $location, uiDialogLoading, uiDialogError, auxZipPrepare, uiIntro, uiDialogNewProject) {

  /**
   * Current Account is resolved by ui-router
   * @type {Object}
   */
  $scope.currentAccount = currentAccount;

  var showIntro = false;

  try {
    // this is not a critical feature
    // wrap in try catch to handle account data structure variation
    showIntro = currentAccount.applicationConfig.dashboard.guides.dashboard === 'new';
  } catch (e) {
    showIntro = false;
  }
  
  if (showIntro) {
    uiIntro.dashboard().then(function (intro) {
      intro.start();
    });
  }

  $scope.loadProjects = function () {
    return apiHProject.list(uiHAccountDialog.getAuthToken())
      .then(function (projects) {
        $scope.projects = projects;
        $scope.$apply();
      });
  };

  /**
   * Navigate to the visualization of a given project
   * @param  {String} projectCode
   */
  $scope.navigateToProject = function (projectCode) {
    $state.go("project.general", { projectCode: projectCode });
  };

  /**
   * Shared create project logic among zip file and multi-file upload types
   * @param  {String} projectName 
   * @param  {File} zipFile     
   */
  function _createProjectFromZip(zipFile, projectName) {
    if (zipFile.size > 52428800) {
      uiDialogLoading.close();
      // error Dialog opens
      uiDialogError($translate.instant('project.errorSize'));

      return;
    }

    projectName = projectName || 'Project';
    
    apiHProject.create(uiHAccountDialog.getAuthToken(), { name: projectName })
      .then(function (projectData) {
        
        uiDialogLoading.setMessage($translate.instant('dashboard.uploading'));

        // upload
        var upload = apiHProject.createVersion(
          uiHAccountDialog.getAuthToken(),
          projectData._id,
          zipFile
        );

        upload.on('progress', function (progress) {
          console.log('upload progress ', progress);

          progress = parseInt(progress.completed * 100);

          // progress %
          uiDialogLoading.setProgress(progress);
          if (progress === 100) {
            $translate('dashboard.finishingUpload')
              .then(function (message) {
                uiDialogLoading.setMessage(message);
              });
          }
        });

        return upload.promise.then(function () {
          return projectData;
        });

      }, function (err) {        
        uiDialogLoading.close();
        uiDialogError($translate.instant('project.errorFailed'));
      })
      .then(function (projectData) {

        // navigate to the project view
        $scope.navigateToProject(projectData.code);
        
        // loading state ends
        uiDialogLoading.close();

      }, function (err) {
        console.error(err);
        
        uiDialogError($translate.instant('project.errorUploaded'));
        uiDialogLoading.close();
      })
      .catch(function (err) {

        console.log(err);
      });
  }

  /**
   * Creates a project given a set of files
   * @param  {Array -> FileDataObject} files 
   *         Array of file data objects, 
   *         as defined by models/file-system/file
   */
  $scope.createProject = function (files, projectName) {

    uiDialogLoading.open({
      message: $translate.instant('dashboard.preparingUpload')
    });
    
    auxZipPrepare(files)
      .then(function (zipFile) {
        return _createProjectFromZip(zipFile, projectName);
      }, function (err) {
        uiDialogLoading.close();
      })
      .done();
  };

  /**
   * Creates a project from a given templateURL
   * @param  {URL} templateURL
   * @param  {String} projectName
   * @return {Promise}
   */
  $scope.createProjectFromTemplateURL = function (templateURL, projectName) {

    uiDialogLoading.open({
      message: $translate.instant('dashboard.creatingProjectFromTemplate')
    });

    return apiHProject.create(
      uiHAccountDialog.getAuthToken(),
      {
        name: projectName,
        templateURL: templateURL,
      }
    )
    .then(function (projectData) {

      if ($scope.currentAccount.applicationConfig.workspace.version !== 'disabled') {

        return apiHWorkspace.ensureReady(
          uiHAccountDialog.getAuthToken(),
          projectData._id
        )
        .then(function (workspace) {
          // navigate to the project view
          // (only to add it to the browser's history)
          $scope.navigateToProject(projectData.code);

          setTimeout(function () {
            var workspaceURL = $filter('urlWorkspace')(projectData.code);
            window.location = workspaceURL;
          }, 100);
        });

      } else {
        // loading state ends immediately
        uiDialogLoading.close();

        // navigate to the project view
        $scope.navigateToProject(projectData.code);
      }
    })
    .catch(function (err) {
      console.error(err);
      
      uiDialogError($translate.instant('project.errorCreatingProject'));
      uiDialogLoading.close();
    });
  }

  /**
   * Opens the newProject dialog with preconfigured options.
   * 
   * @param  {Object} projectData
   * @return {Promise}
   */
  $scope.openNewProjectDialog = function (projectData) {

    projectData = Object.assign({}, {
      templateURL: undefined,
      name: undefined,
    }, projectData);

    return uiDialogNewProject(projectData).closePromise.then(function (data) {

      var projectData = data.value;

      if (projectData.fromTemplate) {

        return $scope.createProjectFromTemplateURL(
          projectData.templateURL,
          projectData.name
        );

      } else if (projectData.fromFiles) {
        return $scope.createProject(
          projectData.files,
          projectData.name
        );
      }
    });
  };

  // initialize
  $scope.loadProjects();

  var parsedLocation = url.parse(window.location.toString(), true);

  if ($stateParams.templateURL) {
    // http://stackoverflow.com/questions/17376416/angularjs-how-to-clear-query-parameters-in-the-url
    // remove templateURL and projectName from search
    $location.search('templateURL', null);
    $location.search('projectName', null);

    $scope.openNewProjectDialog({
      name: $stateParams.projectName,
      templateURL: $stateParams.templateURL,
    });
  }
};