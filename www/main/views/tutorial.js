(function() {
  'use strict';

  angular.module('kmsscan.views.Tutorial', [
      'kmsscan.utils.Logger',
      'kmsscan.services.stores.Settings'
    ])
    .config(StateConfig)
    .controller('TutorialCtrl', TutorialController);


  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu.tutorial', {
        url: '/tutorial',
        views: {
          'menuContent': {
            templateUrl: 'main/views/tutorial.html',
            controller: 'TutorialCtrl as tutorial'
          }
        }
      });
  }



  function TutorialController($translate, $rootScope, $state, settingsStoreService, Logger) {
    var vm = this; // view-model
    var log = Logger('kmsscan.views.Tutorial');

    vm.settings = {};

    vm.isReady = isReady;
    vm.onLanguageChange = onLanguageChange;
    vm.historyGoBack = historyGoBack;

    activate();
    //////////////////////////////
    function activate() {
      log.debug('activate');
      $rootScope.$on('onLanguageChange', function(event, langKey) {
        vm.settings.language = angular.uppercase(langKey);
      });

      settingsStoreService.get()
        .then(function(settings) {
          log.debug('activate() - success', settings);
          vm.settings = settings;
        });
    }

    function saveSettings() {
      return settingsStoreService.set(vm.settings)
        .then(function(settings) {
          log.debug('saveSettings() - success', settings);
          vm.settings = settings;
          return settings;
        });
    }

    function onLanguageChange() {
      saveSettings(vm.settings)
        .then(function() {
          $rootScope.$broadcast('onLanguageChange', vm.settings.language);
        });
    }

    function historyGoBack() {
      if (vm.settings.isFirstStart) {
        $state.go('menu.welcome');
      } else {
        window.history.back();
      }
    }
    
    function isReady() {
      return !$rootScope.syncIsActive && !vm.isPending;
    }

  }


}());