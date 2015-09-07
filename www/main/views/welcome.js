(function () {
  'use strict';

  angular.module('kmsscan.views.Welcome', [
  ])
    .config(StateConfig)
    .controller('WelcomeCtrl', WelcomeController);


  function StateConfig($stateProvider) {
    $stateProvider
      .state('menu.welcome', {
        url:   '/welcome',
        views: {
          'menuContent': {
            templateUrl: 'main/views/welcome.html',
            controller:  'WelcomeCtrl as welcome'
          }
        }
      });
  }


  function WelcomeController($ionicHistory) {
    var wm = this;  // view-model
    console.log($ionicHistory.currentTitle());

  }


}());
