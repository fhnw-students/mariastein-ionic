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

    vm.language = angular.uppercase($translate.use());

    $rootScope.$on('onLanguageChange', function(event, langKey){
        vm.language = angular.uppercase(langKey);
    });

    vm.onLanguageChange = function () {
      //$translate.use(vm.language.toLowerCase());
      $rootScope.$broadcast('onLanguageChange', vm.language.toLowerCase());
    };
  }


}());
