(function () {
  'use strict';

  angular.module('kmsscan.views.Init', [
    'kmsscan.utils.Logger',

    'kmsscan.services.rest.Typo3',
    'kmsscan.services.sql.Objects',
    'kmsscan.services.sql.Images',
    'kmsscan.services.sql.Rooms',
    'kmsscan.services.sql.History'
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

  function InitController($rootScope, $state, Logger /*, $q, $ionicPlatform, typo3Service, objectsSqlService, roomsSqlService, imagesSqlService, historySqlService*/) {
    var vm = this; // view-model
    var log = new Logger('kmsscan.views.Init');

    $rootScope.$on('kmsscan.run.activate.succeed', function () {
      log.info('kmsscan.run.activate.succeed');
      $state.go('menu.welcome');
    });

    $rootScope.$on('kmsscan.run.activate.failed', function () {
      log.error('kmsscan.run.activate.failed');
      // TODO
    });

  }

}());