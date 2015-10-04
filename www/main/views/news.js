(function () {
  'use strict';

  var namespace = 'kmsscan.views.News';

  angular.module(namespace, [
    'kmsscan.utils.Logger',
    'kmsscan.services.stores.Pages',
    'kmsscan.services.stores.Settings'
  ])
      .config(StateConfig)
      .controller('NewsCtrl', NewsController);

  function StateConfig($stateProvider) {
    $stateProvider
        .state('menu.news', {
          url: '/news',
          views: {
            'menuContent': {
              templateUrl: 'main/views/news.html',
              controller: 'NewsCtrl as news'
            }
          }
        });
  }

  function NewsController($q, $scope, $rootScope, Logger, pagesStoreService, settingsStoreService) {
    var log = new Logger(namespace);
    var vm = this; // view-model
    vm.isPending = true;
    vm.hasFailed = false;
    vm.news = [];

    vm.isReady = isReady;
    vm.isUnread = isUnread;

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
            return pagesStoreService.getNews(settings.language);
          })
          .then(function (news) {
            log.debug('activate() -> succeed', news);
            vm.news = news;
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

    function isUnread(doc) {
      return doc.visitedAt === undefined;
    }

    function formatDate(date) {
      return moment(date).format();
    }

  }

}());