(function() {
  'use strict';

  angular.module('kmsscan.views.Map', [
      'kmsscan.utils.Logger',
      'kmsscan.services.stores.Pages',
      'kmsscan.services.stores.Settings'
    ])
    .config(StateConfig)
    .controller('MapCtrl', MapController);

  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu.map', {
        url: '/map',
        views: {
          'menuContent': {
            templateUrl: 'main/views/map.html',
            controller: 'MapCtrl as map'
          }
        }
      });
  }

  function MapController($q, $rootScope, Logger, settingsStoreService, roomsStoreService) {
    var log = new Logger('kmsscan.views.Map');
    var vm = this; // view-model
    vm.isPending = true;
    vm.hasFailed = false;
    vm.rooms = [];

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
          return roomsStoreService.getAll(settings.language);
        })
        .then(function(rooms) {
          log.debug('activate() -> succeed', rooms);
          vm.rooms = rooms;
          vm.isPending = false;
          vm.hasFailed = false;
        })
        .catch(function(err) {
          log.error('Failed to load visited rooms!', err)
          vm.isPending = false;
          vm.hasFailed = true;
        });
    }

    function isReady() {
      return !$rootScope.syncIsActive && !vm.isPending;
    }

  }

}());