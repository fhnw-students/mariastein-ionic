var barcodeScanner = (function () {
  'use strict';

  angular
    .module('kmsscan.services.BarcodeScanner', [
      'ngCordova'
    ])
    .factory('barcodeScanner', BarcodeScanner);

  BarcodeScanner.$inject = ['$q', '$cordovaBarcodeScanner', '$ionicPlatform'];

  /* @ngInject */
  function BarcodeScanner($q, $cordovaBarcodeScanner, $ionicPlatform) {

    var device = false;
    $ionicPlatform.ready(function () {
      device = true;
    });

    var service = {
      scan: scan
    };

    return service;

    ////////////////

    function scan(value) {
      if (device && value) {
        var deferred = $q.defer();
        deferred.resolve(barcode);
        return deferred.promise;
      }
      return $cordovaBarcodeScanner.scan();

    }

  }

  return function (value) {
    console.log(value);
  }

})();