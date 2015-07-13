(function () {
  'use strict';

  angular.module('kmsscan.views.Init', [
    'kmsscan.services.Data'
  ])
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


  function InitController(dataService, $state, $ionicHistory, $timeout) {
    var vm = this; // view-model
    dataService.loadCsv()
      .then(function () {
        $timeout(function () {
          $ionicHistory.nextViewOptions({
            //disableAnimate: true,
            disableBack:    true
          });
          $state.go('welcome');
        }, 1000);
      });
  }


}());
