(function() {
  'use strict';

  angular.module('kmsscan.views.Map', [
      'kmsscan.utils.Logger',
      'kmsscan.services.stores.Pages',
      'kmsscan.services.stores.Rooms',
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


  function MapController($q, $scope, $rootScope, Logger, settingsStoreService, roomsStoreService, pagesStoreService) {
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

    var eventIndexOnChange = settingsStoreService.onChange(function() {
      activate();
    });

    $scope.$on('$destroy', function  () {
      settingsStoreService.offChange(eventIndexOnChange);
    });
    /////////////////////////////
    function activate() {
      settingsStoreService.get()
        .then(function(settings) {
          return $q.all([
            roomsStoreService.getAll(settings.language),
            pagesStoreService.getVisited(settings.language)
          ]);
        })
        .then(function(results) {
          log.debug('activate() -> succeed', results);
          vm.rooms = results[0];
          var counterObjectsInRooms = roomsStoreService.countObjectsInRooms(results[1]);
          vm.rooms = vm.rooms.map(function  (room) {
            room.scannedObjects = counterObjectsInRooms[room.uid] || 0;
            return room;
          });
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