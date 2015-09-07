(function () {
  'use strict';

  angular.module('kmsscan.views.Init', [
    'kmsscan.utils.Logger',

    'kmsscan.services.rest.Typo3',
    'kmsscan.services.sql.Objects',
    'kmsscan.services.sql.Rooms',
    'kmsscan.services.sql.Images'
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

  function InitController($q, $ionicPlatform, Logger, typo3Service, objectsSqlService, roomsSqlService, imagesSqlService) {
    var vm = this; // view-model
    var log = new Logger('kmsscan.views.Init');
    vm.typo3Data = {};
    log.info('start');

    $ionicPlatform.ready(function () {
      if (window.cordova) {
        log.info('$ionicPlatform is ready');
        typo3Service.load()
          .then(function (typo3Data) {
            vm.typo3Data = typo3Data;
            log.info('typo3Data', typo3Data);
            return $q.all([
              objectsSqlService.sync(typo3Data.objects)
              //imagesSqlService.sync(typo3Data.images),
              //roomsSqlService.sync(typo3Data.rooms)
            ]);
          })
          .then(function (results) {
            log.info('done', results);
          })
          .catch(function (err) {
            log.error('stop -> catch', err);
            // TODO
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
      } else {
        log.warn('stop ->', 'Cordova Plugins are unreachable');
      }
    });

    //$q.all([
    //  dataService.loadCsv(),
    //  historyService.init(),
    //  newsService.init(),
    //  typo3Service.get(),
    //  mapService.init(),
    //])
    //  .then(function (results) {
    //    $timeout(function () {
    //      $ionicHistory.nextViewOptions({
    //        disableAnimate: false,
    //        disableBack:    true
    //      });
    //      $state.go('menu.welcome');
    //    }, 1000);
    //  });
    //
    //
    //
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