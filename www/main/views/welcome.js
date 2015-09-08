(function () {
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
    var vm = this;  // view-model
    var log = new Logger('kmsscan.views.Welcome');
    vm.page = {};
    vm.imagePath = '';
    vm.isPending = true;
    vm.promise = {};

    vm.isReady = isReady;

    // Events
    if ($rootScope.syncIsActive) {
      $rootScope.$on('kmsscan.run.activate.succeed', activate);
    } else {
      activate();
    }

    settingsStoreService.onChange(function () {
      activate();
    });


    ////////////////////////////////
    function activate() {
      log.info('activate()');
      vm.isPending = true;
      vm.promise = settingsStoreService.get()
        .then(function (settings) {
          return pagesStoreService.getWelcomePage(settings.language)
        })
        .then(function (page) {
          log.info('activate() -> succeed', page);
          vm.page = page;
          return imagesStoreService.getPath(page.image[0]);
        })
        .then(function (imagePath) {
          log.info('activate() -> succeed', imagePath);
          vm.imagePath = imagePath;
          vm.isPending = false;
          //file:///Users/hirsch-2/Library/Developer/CoreSimulator/Devices/5663B31C-EBF5-447D-B1B1-31D7F5E6DC70/data/Containers/Data/Application/97338C3C-344F-4C79-85FB-81A38D601509/Documents/52.png
        })
    }

    function isReady() {
      return !$rootScope.syncIsActive && !vm.isPending;
    }


  }


}());
