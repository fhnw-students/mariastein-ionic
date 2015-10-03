/**
 * @module kmsscan.views.MapPage
 * @author Ramon Herzig
 *
 * @description
 * This state is used for display the room with the given uid-parameter.
 * It also shows a map where the room are.
 *
 */
(function () {
  'use strict';

  var namespace = 'kmsscan.views.MapPage';

  angular.module(namespace, [
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

  function MapPageController($scope, $stateParams, $rootScope, Logger, roomsStoreService, settingsStoreService) {
    var vm = this; // view-model
    var log = new Logger(namespace);
    vm.doc = {};
    vm.isPending = true;
    vm.hasFailed = false;

    vm.isReady = isReady;

    if ($rootScope.syncIsActive) {
      $rootScope.$on('kmsscan.sync.succeeded', activate);
    } else {
      activate();
    }

    var eventIndexOnChange = settingsStoreService.onChange(function () {
      activate();
    });

    $scope.$on('$destroy', function () {
      settingsStoreService.offChange(eventIndexOnChange);
    });
    /////////////////////////////
    function activate() {
      settingsStoreService.get()
        .then(function (settings) {
          return roomsStoreService.get($stateParams.uid, settings.language);
        })
        .then(function (doc) {
          log.debug('activate() -> succeed', doc);
          vm.doc = doc;
          vm.isPending = false;
          vm.hasFailed = false;
        })
        .catch(function (err) {
          log.error('Failed to load doc!', err);
          vm.isPending = false;
          vm.hasFailed = true;
        });
    }

    function isReady() {
      return !$rootScope.syncIsActive && !vm.isPending;
    }

  }

}());