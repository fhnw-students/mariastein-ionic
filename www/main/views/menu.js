(function () {
  'use strict';

  angular.module('kmsscan.views.Menu', [])
    .config(StateConfig)
    .controller('MenuCtrl', MenuController);


  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu', {
        url:         '/menu',
        abstract:    true,
        templateUrl: 'main/views/menu.html',
        controller:  'MenuCtrl as menu'
      });
  }

  function MenuController($translate, $rootScope) {
    var vm = this;

    vm.language = angular.uppercase($translate.use());

    vm.onLanguageChange = function () {
      //$translate.use(vm.language.toLowerCase());
      $rootScope.$broadcast('onLanguageChange', vm.language.toLowerCase());
    };

    $rootScope.$on('onLanguageChange', function(event, langKey){
      vm.language = angular.uppercase(langKey);
    });

  }


}());
