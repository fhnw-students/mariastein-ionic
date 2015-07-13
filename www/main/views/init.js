(function () {
  'use strict';

  angular.module('kmsscan.views.Init', [])
    .config(StateConfig)
    .controller('InitCtrl', InitController);


  function StateConfig($stateProvider) {
    $stateProvider
      .state('init', {
        url:         '/init',
        templateUrl: 'main/views/init.html',
        controller:  'InitCtrl as init'
      });
  }


  function InitController() {
    var vm = this; // view-model

    // Code goes here

  }


}());
