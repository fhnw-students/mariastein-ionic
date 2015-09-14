(function() {
  'use strict';

  angular.module('kmsscan.views.Settings', [
    'kmsscan.services.stores.Pages',
    'kmsscan.services.stores.Images',
    'kmsscan.services.stores.Settings'
  ])
      .config(StateConfig)
      .controller('SettingsCtrl', SettingsController);

  function StateConfig($stateProvider) {
    $stateProvider
        .state('menu.settings', {
          url: '/settings',
          views: {
            'menuContent': {
              templateUrl: 'main/views/settings.html',
              controller: 'SettingsCtrl as settings'
            }
          }
        });
  }

  //syncIsActive
  function SettingsController(Logger, $rootScope, pagesStoreService, imagesStoreService, settingsStoreService) {
    var vm = this; // view-model
    var log = new Logger('kmsscan.views.Settings');
    vm.settings = {};
    vm.saveSettings = saveSettings;
    vm.onLanguageChange = onLanguageChange;

    activate();
    ///////////////////////////////
    function activate() {
      $rootScope.$on('onLanguageChange', function(event, langKey) {
        vm.settings.language = angular.uppercase(langKey);
      });
      settingsStoreService.get().then(function(settings) {
        log.debug('activate() - success', settings);
        vm.settings = settings;
      });
    }

    function saveSettings() {
      return settingsStoreService.set(vm.settings).then(function(settings) {
        log.debug('saveSettings() - success', settings);
        vm.settings = settings;
        return settings;
      });
    }

    function onLanguageChange() {
      saveSettings(vm.settings).then(function() {
        $rootScope.$broadcast('onLanguageChange', vm.settings.language);
      });
    }

  }

}());