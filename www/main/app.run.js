(function () {
  'use strict';

  angular.module('kmsscan.run', [
    'kmsscan.services.Data'
  ])
    .run(run);

  function run($log, dataService) {
    dataService.loadCsv();
    $log.info(dataService.get());
    $log.info(dataService.get(3));
  }

}());