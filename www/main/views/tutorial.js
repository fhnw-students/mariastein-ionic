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
    vm.language=angular.uppercase($rootScope.settings.language);
    $rootScope.$broadcast('onLanguageChange', vm.language.toLowerCase());

    $rootScope.$on('onLanguageChange', function(event, langKey){
        vm.language = angular.uppercase(langKey);
    });

    vm.onLanguageChange = function () {
      $rootScope.$broadcast('onLanguageChange', vm.language.toLowerCase());
    };

    $rootScope.onClick = function (msg) {
      //ui-sref="menu.welcome"
      //$state.go('^');
     // $location.path("#/menu/welcome");
      alert(msg);
    }




  }




}());
