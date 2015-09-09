(function() {
  'use strict';

  angular.module('kmsscan.views.Scan', [
      'kmsscan.utils.Logger',
      'kmsscan.services.stores.Pages'
    ])
    .config(StateConfig)
    .controller('ScanCtrl', ScanController);

  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu.scan', {
        url: '/scan',
        views: {
          'menuContent': {
            templateUrl: 'main/views/scan.html',
            controller: 'ScanCtrl as scan'
          }
        }
      });
  }

  function ScanController($cordovaBarcodeScanner, $ionicPlatform, $cordovaVibration, $state, $rootScope, Logger, pagesStoreService) {
    var vm = this; // view-model
    var log = new Logger('kmsscan.views.Scan');

    vm.isBarcodeScannerReady = false;
    vm.barcodeText = "";

    vm.isReady = isReady;
    vm.scan = scan;
    vm.submit = submit;
    vm.destroy = destroy;

    $ionicPlatform.ready(activate);
    //////////////////////////////////////////
    function activate() {
      if (window.cordova && window.cordova.barcodeScanner) {
        vm.isBarcodeScannerReady = true;
        vm.scan();
      } else {
        log.warn('Barcode-Scanner is not available!');
      }
    }

    function destroy () {
      pagesStoreService.destroy();
    }

    function scan() {
      $cordovaBarcodeScanner
        .scan()
        .then(function(barcodeData) {
          $cordovaVibration.vibrate($rootScope.settings.vibration);
          if (barcodeData.cancelled !== 1) {
            if (barcodeData.format == "QR_CODE") {
              afterScan(barcodeData.text);
              vm.format = false;
              vm.cancel = false;
            } else {
              vm.format = true;
              vm.cancel = false;
            }
          } else {
            vm.cancel = true;
            vm.format = false;
          }
          // Success! Barcode data is here
        }, function(error) {
          //vm.data = error;
          // An error occurred
        });
    }

    function afterScan(qrCode) {
      log.debug('afterScan()', qrCode);
      pagesStoreService.visited(qrCode)
        .then(function(uid) {
          $state.go('menu.detail', {
            id: uid
          }, {
            location: "replace"
          });
        })
        .catch(function() {
          $state.go('menu.notFound', {}, {
            location: "replace"
          });
        });
    }

    function submit() {
      if (vm.barcodeText !== "") {
        afterScan(vm.barcodeText);
      }
    }

    function isReady() {
      return !$rootScope.syncIsActive && !vm.isPending;
    }

  }

}());