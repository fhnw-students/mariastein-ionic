(function () {
  'use strict';

  var namespace = 'kmsscan.views.Menu';

  angular.module(namespace, [
    'kmsscan.utils.Logger',
    'kmsscan.services.stores.Settings'
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

  function MenuController(Logger, $rootScope, settingsStoreService) {
    var vm = this;
    var log = Logger(namespace);

    vm.settings = {};
    vm.saveSettings = saveSettings;
    vm.onLanguageChange = onLanguageChange;

    activate();
    ///////////////////////////////
    function activate() {
      $rootScope.$on('onLanguageChange', function (event, langKey) {
        vm.settings.language = angular.uppercase(langKey);
      });
      settingsStoreService.get().then(function (settings) {
        log.debug('activate() - success', settings);
        vm.settings = settings;
      });
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