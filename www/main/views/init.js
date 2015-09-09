(function() {
  'use strict';

  angular.module('kmsscan.views.Init', [
    'kmsscan.utils.Logger'
  ])
    .config(StateConfig)
    .controller('InitCtrl', InitController);

  function StateConfig($stateProvider) {
    $stateProvider
      .state('init', {
        url: '/init',
        templateUrl: 'main/views/init.html',
        controller: 'InitCtrl as init'
      });
  }

  function InitController($rootScope, $state, Logger, $ionicPopup, $translate) {
    var vm = this; // view-model
    var log = new Logger('kmsscan.views.Init');

    $rootScope.$on('kmsscan.run.activate.succeed', function() {
      log.info('kmsscan.run.activate.succeed');
      $state.go('menu.welcome');
    });

    $rootScope.$on('kmsscan.run.activate.failed', function() {
      log.error('kmsscan.run.activate.failed');
      $state.go('menu.welcome');
      // TODO
    });

    $rootScope.$on('kmsscan.run.offline', function() {
      showOfflinePopup();
    });


    //////////////////////////////////////////

    function showOfflinePopup() {
      // TODO: Use $ionicPopup
    };

  }

}());