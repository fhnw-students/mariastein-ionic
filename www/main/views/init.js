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

  function InitController($q, $ionicPlatform, Logger, typo3Service, objectsSqlService, roomsSqlService, imagesSqlService, historySqlService, $cordovaFileTransfer, $timeout, $scope) {
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
              historySqlService.sync(),
              objectsSqlService.sync(typo3Data.objects),
              roomsSqlService.sync(typo3Data.rooms),
              imagesSqlService.sync(typo3Data.images)
            ]);
          })
          .then(function (results) {
            imageTest();
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
    
    function imageTest() {
      var smallImage = document.getElementById('test');
      imagesSqlService.get(42)
        .then(function (image) {
          smallImage.src = image.path;
          log.info('imageTest.done', image);
        })
        .catch(function (err) {
          log.error('imageTest.catch', err);
        });
    }

  }

}());