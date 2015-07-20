(function () {
  'use strict';

  angular.module('kmsscan.views.Menu', [])
    .config(StateConfig)
    .controller('MenuCtrl', MenuController)
    .constant('SETTINGS_STORAGE_KEY', 'kmsscan-settings');


  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu', {
        url:         '/menu',
        abstract:    true,
        templateUrl: 'main/views/menu.html',
        controller:  'MenuCtrl as menu'
      });
  }

  function MenuController($translate, $q, $log, SETTINGS_STORAGE_KEY, $localForage) {
    var vm = this;

    var settings = {
      language: EN,
      vibration: 0
    };

    vm.language = angular.uppercase($translate.use());

    init();

    vm.onLanguageChange = function () {
      $translate.use(vm.language.toLowerCase());
      settings.language = vm.language.toLowerCase();
      saveSettings();
    };

    vm.onVibraChange = function(){
      if (settings.vibration != 0){
        settings.vibration = 0;
      } else {
        settings.vibration = 100;
      }
      saveSettings();
    }

    function init() {
      var deferred = $q.defer();
      $localForage.getItem(SETTINGS_STORAGE_KEY)
          .then(function (result) {
            if (result !== null) {
              settings = JSON.parse(result);
            }
            deferred.resolve(history);
          })
          .catch(function (err) {
            $log.error(err);
            deferred.reject(err);
          });
      return deferred.promise;
    }

    function saveSettings(){
      $localForage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    }

  }


}());
