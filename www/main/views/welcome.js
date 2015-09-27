(function () {
  'use strict';

  var namespace = 'kmsscan.views.Welcome';

  angular.module(namespace, [
    'kmsscan.services.stores.Pages',
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

  function WelcomeController(Logger, $scope, $rootScope, pagesStoreService, settingsStoreService) {
    var vm = this; // view-model
    var log = new Logger(namespace);

    vm.page = {};
    vm.imagePath = '';
    vm.isPending = true;
    vm.hasFailed = false;

    vm.isReady = isReady;

    // Events
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

    ////////////////////////////////
    function activate() {
      log.info('activate()');
      settingsStoreService.get()
        .then(function (settings) {
          return pagesStoreService.getWelcomePage(settings.language);
        })
        .then(function (page) {
          log.debug('activate() -> succeed', page);
          vm.page = page;
          vm.isPending = false;
          vm.hasFailed = false;
        })
        .catch(function (err) {
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