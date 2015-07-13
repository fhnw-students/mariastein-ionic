(function () {
  'use strict';

  angular.module('kmsscan.run', [
    'kmsscan.services.Data'
  ])
    .run(run);

  function run($log, dataService, barcodeScanner, $rootScope) {
    $rootScope.scan = barcodeScanner.scan;
    //dataService.loadCsv();
  }

}());