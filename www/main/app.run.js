(function () {
  'use strict';

  angular.module('kmsscan.run', [
    'kmsscan.utils.Logger',

    'kmsscan.services.stores.Settings',
    'kmsscan.services.rest.Typo3',
    'kmsscan.services.stores.Pages',
    'kmsscan.services.stores.Images'
  ])
    .run(run);

  function run($rootScope, $translate, $timeout, $q, $ionicPlatform, Logger,
               typo3Service, pagesStoreService, settingsStoreService, imagesStoreService) {

    var log = new Logger('kmsscan.run');
    $rootScope.syncIsActive = true;
    log.info('start');

    $rootScope.onLine = window.navigator.onLine;
    $rootScope.getImagePath = function (imageId) {
      return imagesStoreService.getPath(imageId);
    };

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
        log.info('$ionicPlatform is ready');

        if(window.navigator.onLine){
        $q.all([
          initSettings(),
          syncPage(0),  // DE
          syncPage(1),  // FR
          syncPage(2),  // EN
          syncPage(3)   // IT
        ])
          .then(imagesStoreService.sync)
          .then(function (results) {
            $timeout(function () {
              $rootScope.syncIsActive = false;
              $rootScope.$broadcast('kmsscan.run.activate.succeed');
            });
            log.info('done', results);
          })
          .catch(function (err) {
            log.error('stop -> catch', err);
            $timeout(function () {
              $rootScope.syncIsActive = false;
              $rootScope.$broadcast('kmsscan.run.activate.failed');
            });
          });
        }else{
          $timeout(function () {
            $rootScope.$broadcast('kmsscan.run.offline');
          });
        }
      });
    }

    function syncPage(langKey) {
      return typo3Service.loadPages(langKey)
        .then(function (typo3Data) {
          return pagesStoreService.sync(langKey, typo3Data.objects);
        })
    }

    function initSettings() {
      return settingsStoreService.init()
    }


  }

}());