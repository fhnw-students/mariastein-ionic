(function () {
  'use strict';

  angular.module('kmsscan.run', [
    'kmsscan.utils.Logger',

    'kmsscan.services.rest.Typo3',
    'kmsscan.services.sql.Objects',
    'kmsscan.services.sql.Images',
    'kmsscan.services.sql.Rooms',
    'kmsscan.services.sql.History'
  ])
    .run(run);

  function run($rootScope, $translate, $timeout, $q, $ionicPlatform, Logger, typo3Service, objectsSqlService, roomsSqlService, imagesSqlService, historyStoreService) {
    var log = new Logger('kmsscan.run');
    log.info('start');

    activate();
    onLanguageChange();

    /////////////////////////////////////////
    function onLanguageChange() {
      $rootScope.$on('onLanguageChange', function (event, langKey) {
        $translate.use(langKey);
      });
    }

    function activate() {
      $ionicPlatform.ready(function () {
        if (window.cordova) {
          log.info('$ionicPlatform is ready');
          typo3Service.load()
            .then(function (typo3Data) {
              return $q.all([
                historyStoreService.activate(),
                objectsSqlService.sync(typo3Data.objects),
                roomsSqlService.sync(typo3Data.rooms),
                imagesSqlService.sync(typo3Data.images)
              ]);
            })
            .then(function (results) {
              $timeout(function () {
                $rootScope.$broadcast('kmsscan.run.activate.succeed');
              });
              log.info('done', results);
            })
            .catch(function (err) {
              log.error('stop -> catch', err);
              $timeout(function () {
                $rootScope.$broadcast('kmsscan.run.activate.failed');
              });
              // TODO
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });
        } else {
          log.warn('stop ->', 'Cordova Plugins are unreachable');
          $timeout(function () {
            $rootScope.$broadcast('kmsscan.run.activate.failed');
          }, 1000);
        }
      });
    }


  }

}());