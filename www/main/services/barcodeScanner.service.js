(function () {
  'use strict';

  angular
    .module('kmsscan.services.BarcodeScanner', [
      'ngCordova',
      'kmsscan.services.Data'
    ])
    .factory('barcodeScanner', BarcodeScanner);

  BarcodeScanner.$inject = ['$q', '$cordovaBarcodeScanner', '$ionicPlatform', '$state', 'dataService'];

  /* @ngInject */
  function BarcodeScanner($q, $cordovaBarcodeScanner, $ionicPlatform, $state, dataService) {

    var device = false;
    $ionicPlatform.ready(function () {
      device = true;
    });

    var service = {
      scan: scan
    };

    window.barcodeScanner = itemFound;

    return service;

    ////////////////

    function scan() {
      $cordovaBarcodeScanner.scan()
        .then(function (barcodeData) {
          itemFound(barcodeData.text);
        }, function (error) {

          itemFound();
        });
    }

    function itemFound(id) {
      if (id && dataService.has(id)) {
        $state.go('detail', {id: id});
      } else {
        $state.go('notFound');
      }
    }

  }


})();