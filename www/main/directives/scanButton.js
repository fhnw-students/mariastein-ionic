(function () {
  'use strict';

  angular.module('kmsscan.directives.ScanButton', [])
    .directive('kmsScanButton', ScanButton);

  function ScanButton() {
    return {
      restrict:    'E',
      replace:     true,
      templateUrl: 'main/directives/scanButton.html'
    };
  }


}());