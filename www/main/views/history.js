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
      settingsStoreService.get()
        .then(function (settings) {
          return pagesStoreService.getVisited(settings.language);
        })
        .then(function (pages) {
          log.debug('activate() -> succeed', pages);
          vm.pages = pages;
          vm.isPending = false;
          vm.hasFailed = false;
        })
        .catch(function (err) {
          log.error('Failed to load visited pages!', err);
          vm.isPending = false;
          vm.hasFailed = true;
        });
    }

    function isReady() {
      return !$rootScope.syncIsActive && !vm.isPending;
    }

  }

}());