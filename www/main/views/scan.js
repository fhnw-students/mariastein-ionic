/**
 * @module kmsscan.views.Scan
 * @author Gabriel Brunner
 *
 * @description
 * This view opens the camera to scan the QR-Code of an object, but if no
 * barcode scanner is available a input will appear to test the scan
 * manually
 *
 */
(function () {
  'use strict';

  var namespace = 'kmsscan.views.Scan';

  angular.module(namespace, [
    'kmsscan.utils.Logger',
    'kmsscan.services.stores.Settings',
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

  function ScanController($q, $ionicHistory, $cordovaBarcodeScanner, $ionicPlatform, $rootScope, $cordovaVibration,
                          $state, settingsStoreService, Logger, pagesStoreService) {
    var vm = this; // view-model
    var log = new Logger(namespace);

    vm.isBarcodeScannerReady = false;
    vm.hasFailed = false;
    vm.isPending = true;
    vm.noContent = false;
    vm.barcodeText = '';
    vm.settings = {};

    vm.isReady = isReady;
    vm.scan = scan;
    vm.submit = submit;

    $ionicPlatform.ready(activate);
    //////////////////////////////////////////
    function activate() {

      $q.all([
        settingsStoreService.get(),
        pagesStoreService.isEmpty()
      ])
        .then(function (results) {
          vm.settings = results[0];
          vm.noContent = results[1];
          vm.hasFailed = false;

          if (window.cordova) {
            vm.isBarcodeScannerReady = true;
            vm.scan();
          } else {
            log.warn('Barcode-Scanner is not available!');
          }
        })
        .catch(function (err) {
          log.error('Failed to load visited pages!', err);
          vm.hasFailed = true;
        })
        .finally(function () {
          vm.isPending = false;
        });
    }

    function scan() {
      $cordovaBarcodeScanner
        .scan()
        .then(function (barcodeData) {
          log.debug('scan()', barcodeData);
          try {
            $cordovaVibration.vibrate(vm.settings.vibration ? 100 : 0);
          } catch (error) {
            log.error('vibrate()', error);
          }
          if (barcodeData.cancelled !== 1) {
            if (barcodeData.format === 'QR_CODE') {
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
        });
    }

    function afterScan(qrCode) {
      log.debug('afterScan()', qrCode);
      pagesStoreService.visited(qrCode)
        .then(function (uid) {
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go('menu.detail', {
            uid: uid
          }, {
            location: 'replace'
          });
        })
        .catch(function () {
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go('menu.notFound', {}, {
            location: 'replace'
          });
        });
    }

    function submit() {
      if (vm.barcodeText !== '') {
        afterScan(vm.barcodeText);
      }
    }

    function isReady() {
      return !$rootScope.syncIsActive && !vm.isPending;
    }

  }

}());