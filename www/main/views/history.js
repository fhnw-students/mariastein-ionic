(function () {
  'use strict';

  var namespace = 'kmsscan.views.History';

  angular.module(namespace, [
    'kmsscan.utils.Logger',
    'kmsscan.services.stores.Pages',
    'kmsscan.services.stores.Settings'
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

  function HistoryController($q, $scope, $rootScope, Logger, pagesStoreService, settingsStoreService) {
    var log = new Logger(namespace);
    var vm = this; // view-model
    vm.isPending = true;
    vm.hasFailed = false;
    vm.noContent = false;
    vm.settings = {};
    vm.pages = [];

    vm.isReady = isReady;

    if ($rootScope.syncIsActive) {
      $rootScope.$on('kmsscan.run.activate.succeed', activate);
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