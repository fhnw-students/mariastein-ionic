/**
 * @name app.run
 * @module kmsscan.run
 * @author Gerhard Hirschfeld
 *
 * @description
 *
 *
 */
(function () {
  'use strict';

  var namespace = 'kmsscan.run';

  angular.module(namespace, [
    'kmsscan.utils.Logger',
    'kmsscan.services.stores.Settings',
    'kmsscan.services.rest.Typo3',
    'kmsscan.services.stores.Pages',
    'kmsscan.services.stores.Rooms',
    'kmsscan.services.Images'
  ])
    .run(run);

  function run($rootScope, $translate, $timeout, $q, $ionicPlatform, Logger, typo3Service, pagesStoreService,
               roomsStoreService, settingsStoreService, imagesService) {
    var log = new Logger(namespace);

    // Global Declarations
    $rootScope.syncIsActive = true;
    $rootScope.onLine = window.navigator.onLine;
    $rootScope.getImagePath = function (imageId) {
      return imagesService.getPath(imageId);
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
        log.debug('$ionicPlatform is ready');
        var backup = [];

        initSettings()
          .then(function () {
            return $q.all([
              loadPages(0), // DE
              loadPages(1), // FR
              loadPages(2), // EN
              loadPages(3), // IT
              loadRooms(0), // DE
              loadRooms(1), // FR
              loadRooms(2), // EN
              loadRooms(3) // IT
            ]);
          })
          .then(function (results) {
            backup = results;
            return $q.all([
              pagesStoreService.clean(),
              roomsStoreService.clean()
            ]);
          })
          .then(function () {
            return $q.all([
              addPages(0, backup[0]), // DE
              addPages(1, backup[1]), // FR
              addPages(2, backup[2]), // EN
              addPages(3, backup[3]), // IT
              addRooms(0, 4, backup), // DE
              addRooms(1, 5, backup), // FR
              addRooms(2, 6, backup), // EN
              addRooms(3, 7, backup) // IT
            ]);
          })
          .then(imagesService.sync)
          .then(function (results) {
            $timeout(function () {
              $rootScope.syncIsActive = false;
              $rootScope.$broadcast('kmsscan.run.activate.succeed');
            });
            log.debug('done', results);
          })
          .catch(function (err) {
            log.error('stop -> catch', err);
            $timeout(function () {
              $rootScope.syncIsActive = false;
              $rootScope.$broadcast('kmsscan.run.activate.failed');
            });
          });

      });
    }

    function loadPages(langKey) {
      return typo3Service.loadPages(langKey);
    }

    function loadRooms(langKey) {
      return typo3Service.loadRooms(langKey);
    }

    function addPages(langKey, typo3Data) {
      return pagesStoreService.sync(langKey, typo3Data.objects)
        .then(function () {
          return typo3Data.images;
        });
    }

    function addRooms(langKey, idx, typo3Data) {
      return roomsStoreService.sync(langKey, idx, typo3Data)
        .then(function () {
          return typo3Data[idx].images;
        });
    }

    function initSettings() {
      return settingsStoreService.init();
    }

  }

}());