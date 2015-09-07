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


  function TutorialController($translate, $rootScope, $state) {
    var vm = this; // view-model
    vm.language=angular.uppercase($rootScope.settings.language);
    $rootScope.$broadcast('onLanguageChange', vm.language.toLowerCase());

    $rootScope.$on('onLanguageChange', function(event, langKey){
        vm.language = angular.uppercase(langKey);
    });

    vm.onLanguageChange = function () {
      $rootScope.$broadcast('onLanguageChange', vm.language.toLowerCase());
    };

    vm.historyGoBack = function(){
      if($rootScope.settings.isFirstStart){
        $state.go('menu.welcome');
      }else {
        window.history.back();
      }


    }
  }




}());
