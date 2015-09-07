(function () {
  'use strict';

  angular.module('kmsscan.views.Scan', [
    'kmsscan.services.stores.Objects',
    'kmsscan.services.stores.History'
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

  function ScanController($cordovaBarcodeScanner, $cordovaVibration, $state, $rootScope, historyStoreService, objectsStoreService) {
    var vm = this; // view-model
    vm.isReady = false;
    vm.barcodeText = "";

    vm.scan = scan;
    vm.submit = submit;

    if (vm.isReady) {
      vm.scan();
    }

    document.addEventListener("deviceready", function () {
      if (cordova.barcodeScanner) {
        vm.isReady = true;
        vm.scan();
      }
    }, false);

    //////////////////////////////////////////

    function scan() {
      $cordovaBarcodeScanner
        .scan()
        .then(function (barcodeData) {
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
        }, function (error) {
          //vm.data = error;
          // An error occurred
        });
    }

    function afterScan(uid) {
      if (objectsStoreService.has(uid)) {
        historyStoreService.visited(uid)
          .then(function () {
            $state.go('menu.detail', {
              id: uid
            }, {
              location: "replace"
            });
          });
      } else {
        $state.go('menu.notFound', {}, {
          location: "replace"
        });
      }
    }

    function submit() {
      if (vm.barcodeText !== "") {
        afterScan(vm.barcodeText);
      }
    }

  }


}());
