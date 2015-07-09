(function () {
  'use strict';

  angular.module('kmsscan.views.Welcome', [])
    .config(StateConfig)
    .controller('WelcomeCtrl', WelcomeController);


  function StateConfig($stateProvider) {
    $stateProvider
      .state('welcome', {
        url:         '/welcome',
        templateUrl: 'main/views/welcome.html',
        controller:  'WelcomeCtrl as welcome'
      });
  }


  function WelcomeController() {
    var wm = this;  // view-model

    // Code goes here

  }


}());
