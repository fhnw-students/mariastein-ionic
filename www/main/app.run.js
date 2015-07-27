(function () {
  'use strict';

  angular.module('kmsscan.run', [
    'kmsscan.services.Data'
  ])
    .run(run);

  function run($log, $rootScope) {
    // $rootScope.scan = barcodeScanner.scan;
  }

}());