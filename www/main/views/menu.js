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

  function MenuController($translate, $q, $log, SETTINGS_STORAGE_KEY, $localForage, $rootScope) {
    var vm = this;

    $rootScope.settings = {
      language: "",
      vibration: 0
    };

    init()
        .then(function(){
          vm.language = $rootScope.settings.language.toUpperCase();
          $translate.use(vm.language.toLowerCase());
          if ($rootScope.settings.vibration != 0){
            vm.vibration = true;
          } else {
            vm.vibration = false;
          }
        });


    vm.onLanguageChange = function () {
      $translate.use(vm.language.toLowerCase());
      $rootScope.settings.language = vm.language.toLowerCase();
      saveSettings();
    };

    vm.onVibraChange = function(){
      if ($rootScope.settings.vibration != 0){
        $rootScope.settings.vibration = 0;
      } else {
        $rootScope.settings.vibration = 100;
      }
      saveSettings();
    };

    function init() {
      var deferred = $q.defer();
      $localForage.getItem(SETTINGS_STORAGE_KEY)
          .then(function (result) {
            if (result !== null) {
              $rootScope.settings = JSON.parse(result);
            }
            deferred.resolve($rootScope.settings);
          })
          .catch(function (err) {
            $log.error(err);
            deferred.reject(err);
          });
      return deferred.promise;
    }

    function saveSettings(){
      $localForage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify($rootScope.settings));
    }

  }


}());
