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


  function TutorialController($translate) {
    var vm = this; // view-model

    vm.language = angular.uppercase($translate.use());

        vm.onLanguageChange = function () {
          $translate.use(vm.language.toLowerCase());
        };
  }


}());
