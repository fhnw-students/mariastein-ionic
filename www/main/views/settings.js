/**
 * @module kmsscan.views.Settings
 * @author Gabriel Brunner
 *
 * @description
 * This Controller is used for the settings.html page.
 *
 */
(function () {
  'use strict';

  var namespace = 'kmsscan.views.Settings';

  angular.module(namespace, [
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


  function SettingsController(Logger, $rootScope, settingsStoreService) {
    var vm = this; // view-model
    var log = new Logger(namespace);

    vm.settings = {};
    vm.isReady = isReady;
    vm.saveSettings = saveSettings;
    vm.onLanguageChange = onLanguageChange;

    activate();

    ////////////////////////////////////////
    function activate() {
      $rootScope.$on('onLanguageChange', function (event, langKey) {
        vm.settings.language = angular.uppercase(langKey);
      });
      settingsStoreService.get().then(function (settings) {
        log.debug('activate() - success', settings);
        vm.settings = settings;
      });
    }

    function isReady() {
      return !$rootScope.syncIsActive && !vm.isPending;
    }

    function saveSettings() {
      return settingsStoreService.set(vm.settings).then(function (settings) {
        log.debug('saveSettings() - success', settings);
        vm.settings = settings;
        return settings;
      });
    }

    function onLanguageChange() {
      saveSettings(vm.settings).then(function () {
        $rootScope.$broadcast('onLanguageChange', vm.settings.language);
      });
    }

  }

}());