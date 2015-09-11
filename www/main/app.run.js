(function() {
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
              ]);
            })
            .then(function(results) {
              backup = results;
              return pagesStoreService.clean();
            })
            .then(function() {
              return $q.all([
                addPages(0, backup[0]), // DE
                addPages(1, backup[1]), // FR
                addPages(2, backup[2]), // EN
                addPages(3, backup[3]), // IT
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

          // $q.all([
          //   initSettings(),
          //   syncPages(0), // DE
          //   syncPages(1), // FR
          //   syncPages(2), // EN
          //   syncPages(3) // IT,
          //   // syncRooms(0), // DE
          //   // syncRooms(1), // FR
          //   // syncRooms(2), // EN
          //   // syncRooms(3) // IT
          // ])
          //   .then(imagesStoreService.sync)
          //   .then(function(results) {
          //     $timeout(function() {
          //       $rootScope.syncIsActive = false;
          //       $rootScope.$broadcast('kmsscan.run.activate.succeed');
          //     });
          //     log.debug('done', results);
          //   })
          //   .catch(function(err) {
          //     log.error('stop -> catch', err);
          //     $timeout(function() {
          //       $rootScope.syncIsActive = false;
          //       $rootScope.$broadcast('kmsscan.run.activate.failed');
          //     });
          //   });
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

    function addPages(langKey, typo3Data) {
      return pagesStoreService.sync(langKey, typo3Data.objects)
        .then(function() {
          return typo3Data.images;
        });
    }

    // function syncPages(langKey) {
    //   return typo3Service.loadPages(langKey)
    //     .then(function(typo3Data) {
    //       return pagesStoreService.sync(langKey, typo3Data.objects)
    //         .then(function() {
    //           return typo3Data.images;
    //         });
    //     })
    // }

    // function syncRooms(langKey) {
    //   return typo3Service.loadRooms(langKey)
    //     .then(function(typo3Data) {
    //       return roomsStoreService.sync(langKey, typo3Data.rooms)
    //         .then(function() {
    //           return typo3Data.images;
    //         });
    //     })
    // }

    function initSettings() {
      return settingsStoreService.init()
    }

  }

}());