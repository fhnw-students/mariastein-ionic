(function() {
  'use strict';

  angular.module('kmsscan.run', [
      'kmsscan.utils.Logger',

      'kmsscan.services.stores.Settings',
      'kmsscan.services.rest.Typo3',
      'kmsscan.services.stores.Pages',
      'kmsscan.services.stores.Rooms',
      'kmsscan.services.stores.Images'
    ])
    .run(run);

  function run($rootScope, $translate, $timeout, $q, $ionicPlatform, Logger,
    typo3Service, pagesStoreService, roomsStoreService, settingsStoreService, imagesStoreService) {

    var log = new Logger('kmsscan.run');
    $rootScope.syncIsActive = true;
    log.debug('start');

    $rootScope.onLine = window.navigator.onLine;
    $rootScope.getImagePath = function(imageId) {
      return imagesStoreService.getPath(imageId);
    };

    activate();
    onLanguageChange();

    /////////////////////////////////////////
    function onLanguageChange() {
      $rootScope.$on('onLanguageChange', function(event, langKey) {
        $translate.use(langKey);
      });
    }

    function activate() {
      $ionicPlatform.ready(function() {
        log.debug('$ionicPlatform is ready');

        if (window.navigator.onLine) {
          log.debug('Has internet connection');
          var backup = [];

          initSettings()
            .then(function() {
              return $q.all([
                loadPages(0), // DE
                loadPages(1), // FR
                loadPages(2), // EN
                loadPages(3), // IT
                loadRooms(0), // DE
                // loadRooms(1), // FR
                // loadRooms(2), // EN
                // loadRooms(3), // IT
              ]);
            })
            .then(function(results) {
              backup = results;
              return $q.all([
                pagesStoreService.clean(),
                roomsStoreService.clean()
              ]);
            })
            .then(function() {
              return $q.all([
                addPages(0, backup[0]), // DE
                addPages(1, backup[1]), // FR
                addPages(2, backup[2]), // EN
                addPages(3, backup[3]), // IT
                addRooms(0, backup[4]), // DE
                // addRooms(1, backup[5]), // DE
                // addRooms(2, backup[6]), // DE
                // addRooms(3, backup[7]), // DE
              ]);
            })
            .then(imagesStoreService.sync)
            .then(function(results) {
              $timeout(function() {
                $rootScope.syncIsActive = false;
                $rootScope.$broadcast('kmsscan.run.activate.succeed');
              });
              log.debug('done', results);
            })
            .catch(function(err) {
              log.error('stop -> catch', err);
              $timeout(function() {
                $rootScope.syncIsActive = false;
                $rootScope.$broadcast('kmsscan.run.activate.failed');
              });
            });
        } else {
           $timeout(function() {
             $rootScope.$broadcast('kmsscan.run.offline');
           });
        }
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
        .then(function() {
          return typo3Data.images;
        });
    }

    function addRooms(langKey, typo3Data) {
      return roomsStoreService.sync(langKey, typo3Data.rooms)
        .then(function() {
          return typo3Data.images;
        });
    }

    function initSettings() {
      return settingsStoreService.init()
    }

  }

}());