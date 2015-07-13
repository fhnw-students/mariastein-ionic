(function () {
  'use strict';

  angular.module('kmsscan.views.Welcome', [
      'kmsscan.services.BarcodeScanner'
  ])
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


  function WelcomeController(barcodeScanner) {
    var wm = this;  // view-model

    wm.scan = function () {
      barcodeScanner.scan();
    };

  }


}());
