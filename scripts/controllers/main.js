'use strict';

angular.module('demoSwitchWidgetApp').controller('MainCtrl', function ($scope) {
  $scope.switchData = {
    i18nData: {
      on: 'Bật',
      off: 'Tắt'
    },
    active: true,
    state: true
  };

  $scope.english = false;
  $scope.$watch('english', function (val) {
    if (val) {
      $scope.switchData.i18nData = {
        on: 'Bật',
        off: 'Tắt'
      };
    } else {
      $scope.switchData.i18nData = {
        on: 'ON',
        off: 'OFF'
      };
    }
  });

  $scope.btnColor = {
    onStyle: 'warning',
    offStyle: 'danger'
  };
});
