(function () {
  'use strict';

  angular.module('kmsscan.run', [
    'kmsscan.services.Data'
  ])
    .run(run);

  function run($log, dataService, barcodeScanner, $rootScope, $translate) {
    $rootScope.scan = barcodeScanner.scan;

    $rootScope.$on('onLanguageChange', function(event, langKey){
      $translate.use(langKey);
    })
  }

}());