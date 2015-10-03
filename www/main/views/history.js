(function () {
  'use strict';

  var namespace = 'kmsscan.views.History';

  angular.module(namespace, [
    'kmsscan.utils.Logger',
    'kmsscan.services.stores.Pages',
    'kmsscan.services.stores.Settings',
    'kmsscan.services.stores.Rooms'
  ])
    .config(StateConfig)
    .controller('HistoryCtrl', HistoryController);

  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu.history', {
        url: '/history',
        views: {
          'menuContent': {
            templateUrl: 'main/views/history.html',
            controller: 'HistoryCtrl as history'
          }
        }
      });
  }

  function HistoryController($q, $scope, $rootScope, Logger, pagesStoreService, settingsStoreService,
                             roomsStoreService) {
    var log = new Logger(namespace);
    var vm = this; // view-model
    vm.isPending = true;
    vm.hasFailed = false;
    vm.noContent = false;
    vm.settings = {};
    vm.pages = [];

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
      $q.all([
        settingsStoreService.get(),
        pagesStoreService.isEmpty()
      ])
        .then(function (results) {
          vm.settings = results[0];
          vm.noContent = results[1];
          return pagesStoreService.getVisited(vm.settings.language);
        })
        .then(function (pages) {
          var deferred = $q.defer();
          var queue = [];
          for (var i = 0; i < pages.length; i++) {
            queue.push(roomsStoreService.get(pages[i].room, vm.settings.language));
          }
          $q.all(queue)
            .then(function (rooms) {
              deferred.resolve(pages.map(function (page, idx) {
                page.room = rooms[idx];
                return page;
              }));
            })
            .catch(deferred.reject);
          return deferred.promise;
        })
        .then(function (pages) {
          log.debug('activate() -> succeed', pages);
          vm.pages = pages;
          vm.hasFailed = false;
        })
        .catch(function (err) {
          log.error('Failed to load visited pages!', err);
          vm.hasFailed = true;
        })
        .finally(function () {
          vm.isPending = false;
        });
    }

    function isReady() {
      return !$rootScope.syncIsActive && !vm.isPending;
    }

  }

}());