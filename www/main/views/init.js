(function () {
  'use strict';

  angular.module('kmsscan.views.Init', [
    'kmsscan.services.Data',
    'kmsscan.services.History'
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


  function InitController($q, dataService, historyService, $state, $ionicHistory, $timeout) {
    var vm = this; // view-model

    $q.all([
      dataService.loadCsv(),
      historyService.init()
    ])
      .then(function (results) {
        $timeout(function () {
          $ionicHistory.nextViewOptions({
            disableAnimate: false,
            disableBack:    true
          });
          $state.go('menu.welcome');
        }, 1000);
      });



    //dataService.loadCsv()
    //  .then(function () {
    //    $timeout(function () {
    //      $ionicHistory.nextViewOptions({
    //        disableAnimate: false,
    //        disableBack:    true
    //      });
    //      $state.go('menu.welcome');
    //    }, 1000);
    //  });
  }


}());
