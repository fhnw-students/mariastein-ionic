(function() {
  'use strict';

  angular.module('kmsscan.views.MapPage', [
      'kmsscan.utils.Logger',
      'kmsscan.services.stores.Rooms',
      'kmsscan.services.stores.Settings'
    ])
    .config(StateConfig)
    .controller('MapPageCtrl', MapPageController);

  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu.mapPage', {
        url: '/mapPage/:uid',
        views: {
          'menuContent': {
            templateUrl: 'main/views/mapPage.html',
            controller: 'MapPageCtrl as mapPage'
          }
        }

      });
  }

  function MapPageController($q, $timeout, $window, $stateParams, $ionicModal, $ionicSlideBoxDelegate,
    $ionicBackdrop, $ionicScrollDelegate, $rootScope, Logger, roomsStoreService, settingsStoreService) {
    var vm = this; // view-model
    var log = new Logger('kmsscan.views.Detail');
    vm.doc = {};
    vm.isPending = true;
    vm.hasFailed = false;

    vm.isReady = isReady;

    if ($rootScope.syncIsActive) {
      $rootScope.$on('kmsscan.run.activate.succeed', activate);
    } else {
      activate();
    }

    settingsStoreService.onChange(function() {
      activate();
    });
    /////////////////////////////
    function activate() {
      settingsStoreService.get()
        .then(function(settings) {
          return roomsStoreService.get($stateParams.uid, settings.language);
        })
        .then(function(doc) {
          log.debug('activate() -> succeed', doc);
          vm.doc = doc;
          vm.isPending = false;
          vm.hasFailed = false;
        })
        .catch(function(err) {
          log.error('Failed to load doc!', err)
          vm.isPending = false;
          vm.hasFailed = true;
        });
    }

    function isReady() {
      return !$rootScope.syncIsActive && !vm.isPending;
    }



  }

}());