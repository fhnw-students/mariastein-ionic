(function () {
  'use strict';

  angular.module('kmsscan.views.Tutorial', [])
    .config(StateConfig)
    .controller('TutorialCtrl', TutorialController);


  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu.tutorial', {
        url:         '/tutorial',
        views: {
                  'menuContent': {
                    templateUrl: 'main/views/tutorial.html',
                    controller:  'TutorialCtrl as tutorial'
                  }
               }
      });
  }


  function TutorialController($translate, $rootScope) {
    var vm = this; // view-model
    var sysLang = navigator.language.substring(0,2);
    console.log(sysLang);

    if((sysLang=="de" || sysLang=="en" || sysLang=="fr")){
      vm.language=angular.uppercase(sysLang);
      $rootScope.$broadcast('onLanguageChange', vm.language.toLowerCase());
    }else{
      vm.language= angular.uppercase($translate.use());
    }

    $rootScope.$on('onLanguageChange', function(event, langKey){
        vm.language = angular.uppercase(langKey);
    });

    vm.onLanguageChange = function () {
      //$translate.use(vm.language.toLowerCase());
      $rootScope.$broadcast('onLanguageChange', vm.language.toLowerCase());
    };
  }


}());
