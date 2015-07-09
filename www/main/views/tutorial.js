(function () {
  'use strict';

  angular.module('kmsscan.views.Tutorial', [])
    .config(StateConfig)
    .controller('TutorialCtrl', TutorialController);


  function StateConfig($stateProvider) {
    $stateProvider
      .state('tutorial', {
        url:         '/tutorial',
        templateUrl: 'main/views/tutorial.html',
        controller:  'TutorialCtrl as tutorial'
      });
  }


  function TutorialController() {
    var vm = this; // view-model

    // Code goes here

  }


}());
