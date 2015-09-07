(function () {
  'use strict';

  angular.module('kmsscan.views.Init', [
    'kmsscan.services.Data',
    'kmsscan.services.History',
    'kmsscan.services.News',
    'kmsscan.services.Map',
    'kmsscan.services.Typo3'
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


  function InitController($q, dataService, historyService, newsService, mapService, $state, $ionicHistory, $timeout, typo3Service) {
    var vm = this; // view-model

    $q.all([
      dataService.loadCsv(),
      historyService.init(),
      newsService.init(),
      mapService.init(),
      typo3Service.get()
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



    dataService.loadCsv()
      .then(function () {
        $timeout(function () {
          $ionicHistory.nextViewOptions({
            disableAnimate: false,
            disableBack:    true
          });
          $state.go('menu.welcome');
        }, 1000);
      });
  }


}());
