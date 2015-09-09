(function () {
  'use strict';

  angular.module('kmsscan.views.Menu', [
    'kmsscan.services.stores.Settings'
    ])
    .config(StateConfig)
    .controller('MenuCtrl', MenuController);

  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu', {
        url: '/menu',
        abstract: true,
        templateUrl: 'main/views/menu.html',
        controller: 'MenuCtrl as menu'
      });
  }


  function MenuController($translate, $q, Logger, $rootScope, settingsStoreService, $scope) {
    var vm = this;
    var log = Logger('kmsscan.views.Menu');

    vm.settings = {};
    vm.saveSettings = saveSettings;
    vm.onLanguageChange = onLanguageChange;
    activate();


    ///////////////////////////////
    function activate () {
        settingsStoreService.get()
        .then(function(settings){
            log.warn(settings);
            vm.settings = settings;
        });
    }

    function saveSettings() {
        return settingsStoreService.set(vm.settings)
        .then(function(settings){
            log.warn(settings);
            vm.settings = settings;
            return settings;
        });
    }

    function onLanguageChange() {
        saveSettings(vm.settings)
        .then(function(){
            $rootScope.$broadcast('onLanguageChange', vm.settings.language);
        });
    }



    //if (sysLang == "de" || sysLang == "fr" || sysLang == "it") {
    //  vm.language = angular.uppercase(sysLang);
    //} else {
    //  sysLang = "en";
    //  vm.language = angular.uppercase(sysLang);
    //}
    //
    //$rootScope.settings = {
    //  language: vm.language,
    //  vibration: 0,
    //  music: 0,
    //  isFirstStart: true,
    //  zooming: true
    //};
    //
    //init()
    //    .then(function(){
    //      vm.language = $rootScope.settings.language.toUpperCase();
    //      $rootScope.$broadcast('onLanguageChange', vm.language.toLowerCase());
    //      if ($rootScope.settings.vibration != 0){
    //        vm.vibration = true;
    //      } else {
    //        vm.vibration = false;
    //      }
    //      if ($rootScope.settings.music != 0){
    //        vm.music = true;
    //      } else {
    //        vm.music = false;
    //      }
    //      vm.zooming = $rootScope.settings.zooming;
    //    });
    //
    //vm.onLanguageChange = function () {
    //  $rootScope.$broadcast('onLanguageChange', vm.language.toLowerCase());
    //  $rootScope.$on('onLanguageChange', function (event, langKey) {
    //    vm.language = angular.uppercase(langKey);
    //  });
    //
    //  $rootScope.settings.language = vm.language.toLowerCase();
    //  saveSettings();
    //};
    //
    //vm.onVibraChange = function () {
    //  if ($rootScope.settings.vibration != 0) {
    //    $rootScope.settings.vibration = 0;
    //  } else {
    //    $rootScope.settings.vibration = 100;
    //  }
    //  saveSettings();
    //};
    //
    //vm.onMusicChange = function () {
    //  if ($rootScope.settings.music != 0) {
    //    $rootScope.settings.music = 0;
    //  } else {
    //    $rootScope.settings.music = 1;
    //  }
    //  saveSettings();
    //};
    //
    //vm.onIsFirstStartChange = function () {
    //  if ($rootScope.settings.isFirstStart == false) {
    //    $rootScope.settings.isFirstStart = true;
    //  } else {
    //    $rootScope.settings.isFirstStart = false;
    //  }
    //  saveSettings();
    //};
    //vm.getIsFirstStart = function () {
    //  return isFirstStart;
    //};
    //
    //vm.onZoomChange = function(){
    //  if ($rootScope.settings.zooming){
    //    $rootScope.settings.zooming = false;
    //  } else {
    //    $rootScope.settings.zooming = true;
    //  }
    //  saveSettings();
    //};

    ///////////////////////////////////////////////////////

    //function init() {
    //  var deferred = $q.defer();
    //  $localForage.getItem(SETTINGS_STORAGE_KEY)
    //    .then(function (result) {
    //      if (result !== null) {
    //        $rootScope.settings = _.assign($rootScope.settings, JSON.parse(result));
    //      }
    //      deferred.resolve($rootScope.settings);
    //    })
    //    .catch(function (err) {
    //      $log.error(err);
    //      deferred.reject(err);
    //    });
    //  return deferred.promise;
    //}
    //
    //function saveSettings() {
    //  $localForage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify($rootScope.settings));
    //}

  }


}());
