var fs = require('fs');

module.exports = function (DASHBOARD) {

  DASHBOARD.directive('fileNavigator', function () {
    return {
      restrict: 'E',
      scope: {
        path: '=',
        filesystem: '=',
        project: '=',
      },
      template: fs.readFileSync(__dirname + '/template.html', 'utf-8'),

      controller: function ($scope, projectAPI) {

        $scope.openDirectory = function (dirpath) {

          alert(dirpath);
        };

        $scope.openFile = function (filepath) {

        };
      },

      link: function (scope, element, attrs, controller) {


        console.log(scope.filesystem);

        scope.panels = [
          {
            title: 'test-panel',
            items: [
              {
                type: 'directory',
                path: 'lalala'
              },
              {
                type: 'directory',
                path: 'lalala'
              },
              {
                type: 'file',
                path: 'lalala'
              }
            ]
          }
        ];
      },
    };
  });
};
