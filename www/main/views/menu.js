/**
 * @module kmsscan.views.Menu
 * @author Gianni Alagna
 *
 * @description
 * This view shows the abstract view with the menu
 *
 */
(function () {
  'use strict';

  var namespace = 'kmsscan.views.Menu';

  angular.module(namespace, [
    'kmsscan.services.stores.Settings',
    'kmsscan.services.stores.Pages'
  ])
    .config(StateConfig)
    .controller('MenuCtrl', MenuController);


  function StateConfig($stateProvider) {
    $stateProvider.state('menu', {
      url: '/menu',
      abstract: true,
      templateUrl: 'main/views/menu.html',
      controller: 'MenuCtrl as menu'
    });
  }

  function MenuController($rootScope, settingsStoreService, pagesStoreService) {
    var vm = this;

    vm.newsBadgeInfos = 0;
    vm.getNewsBadgeInfos = getNewsBadgeInfos;

    $rootScope.$on('kmsscan.views.newsPage.activated', activate);
    $rootScope.$on('kmsscan.sync.succeeded', activate);

    activate();
    //////////////////////
    function activate() {
      settingsStoreService.get()
        .then(function (settings) {
          return pagesStoreService.getNewsBadgeInfos(settings.language);
        })
        .then(function (result) {
          vm.newsBadgeInfos = result.unread;
        });
    }

    function getNewsBadgeInfos() {
      return vm.newsBadgeInfos;
    }


  }


}());

