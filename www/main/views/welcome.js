(function() {
  'use strict';

  angular.module('kmsscan.views.Welcome', [
    'kmsscan.services.stores.Pages',
    'kmsscan.services.stores.Images',
    'kmsscan.services.stores.Settings'
  ])
    .config(StateConfig)
    .controller('WelcomeCtrl', WelcomeController);

  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu.welcome', {
        url: '/welcome',
        views: {
          'menuContent': {
            templateUrl: 'main/views/welcome.html',
            controller: 'WelcomeCtrl as welcome'
          }
        }
      });
  }

  //syncIsActive
  function WelcomeController(Logger, $rootScope, pagesStoreService, imagesStoreService, settingsStoreService) {
    var vm = this; // view-model
    var log = new Logger('kmsscan.views.Welcome');
    vm.page = {};
    vm.imagePath = '';
    vm.isPending = true;
    vm.hasFailed = false;
    vm.promise = {};

    vm.isReady = isReady;

    // Events
    if ($rootScope.syncIsActive) {
      $rootScope.$on('kmsscan.run.activate.succeed', activate);
    } else {
      activate();
    }

    settingsStoreService.onChange(function() {
      activate();
    });

    ////////////////////////////////
    function activate() {
      log.info('activate()');
      vm.promise = settingsStoreService.get()
        .then(function(settings) {
          return pagesStoreService.getWelcomePage(settings.language)
        })
        .then(function(page) {
          log.info('activate() -> succeed', page);
          vm.page = page;
          vm.isPending = false;
          vm.hasFailed = false;
        })
        .catch(function(err) {
          log.error('Failed to load welcome page!', err)
          vm.isPending = false;
          vm.hasFailed = true;
        });
    }

    function isReady() {
      return !$rootScope.syncIsActive && !vm.isPending;
    }

  }

}());