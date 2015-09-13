(function() {
  'use strict';

  angular.module('kmsscan.views.History', [
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

  function HistoryController($q, $rootScope, Logger, pagesStoreService, settingsStoreService) {
    var log = new Logger('kmsscan.views.History');
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

    settingsStoreService.onChange(function() {
      activate();
    });
    /////////////////////////////
    function activate() {
      settingsStoreService.get()
        .then(function(settings) {
          return pagesStoreService.getVisited(settings.language);
        })
        .then(function(pages) {
          log.debug('activate() -> succeed', pages);
          vm.pages = pages;
          vm.isPending = false;
          vm.hasFailed = false;
        })
        .catch(function(err) {
          log.error('Failed to load visited pages!', err)
          vm.isPending = false;
          vm.hasFailed = true;
        });
    }

    function isReady() {
      return !$rootScope.syncIsActive && !vm.isPending;
    }

    // $q.all([
    //   historySqlService.getAll(),
    //   objectsStoreService.getAll(),
    //   imagesStoreService.getAll()
    // ])
    //   .then(function (results) {
    //     var history = results[0];
    //     var data = results[1];
    //     var images = results[2];

    //     vm.list = data
    //       .filter(function (item) {
    //         return helpersUtilsService.hasUid(history, item.uid);
    //       })
    //       .map(function (item) {
    //         var h = helpersUtilsService.getByUid(history, item.uid);
    //         item.scanedAt = new Date(h.date);
    //         //item.images = helpersUtilsService.getByUid(images, item.uid);
    //         item.images = item.images.map(function (imageUid) {
    //           return helpersUtilsService.getByUid(images, imageUid);
    //         });
    //         return item;
    //       });

    //     log.info('getAll', vm.list);

    //   });

    //historyService.get()
    //  .then(function (result) {
    //    vm.list = _.map(_.sortByOrder(result, ['stamp'], ['desc']), _.values);
    //  });

  }

}());