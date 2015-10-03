/**
 * @name syncService
 * @module kmsscan.services.Sync
 * @author Gerhard Hirschfeld
 *
 * @description
 * TODO
 *
 */
(function () {
  'use strict';

  var namespace = 'kmsscan.services.Sync';

  angular
    .module(namespace, [
      'kmsscan.utils.Logger',
      'kmsscan.services.rest.Typo3',
      'kmsscan.services.stores.Settings',
      'kmsscan.services.stores.Pages',
      'kmsscan.services.stores.Rooms',
      'kmsscan.services.Images',
      'kmsscan.translateConfig',
      'kmsscan.utils.Parsers'
    ])
    .factory('syncService', SyncService);

  function SyncService($rootScope, $timeout, $q, $ionicPlatform, $ionicHistory, $state, Logger,
                       typo3Service, pagesStoreService, roomsStoreService, settingsStoreService, imagesService,
                       $ionicModal, languagesConstant, parsersUtilsService) {
    var log = new Logger(namespace);
    log.debug('init');

    // Public API
    var service = {
      run: run
    };

    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    /**
     * @name run
     * @description
     * TODO
     */
    function run() {
      $rootScope.syncIsActive = true;
      _showInitModal();
      $ionicPlatform.ready(function () {
        log.debug('$ionicPlatform is ready');
        $rootScope.initModalMessage = 'MESSAGE.SYNC.DATA';
        $q.all([
          _initSettings(),
          _loadData()
        ])
          .then(_parseData)
          .then(_cleanDatabases)
          .then(_updateDatabases)
          .then(_downloadImages)
          .then(_onSuccess)
          .catch(_onError)
          .finally(_onDone);
      });
    }

    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////
    function _showInitModal() {
      $rootScope.initModalMessage = 'MESSAGE.SYNC.DEVICE';
      $rootScope.initModalFailed = false;

      $rootScope.initModalMessageValues = {
        counter: '',
        amount: ''
      };
      $rootScope.initModalOpenApp = function () {
        $rootScope.$broadcast('kmsscan.sync.skipped');
        $rootScope.initLoadingModal.hide();
        $rootScope.syncIsActive = false;
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('menu.welcome', {}, {
          location: 'replace'
        });
      };

      if ($rootScope.initLoadingModal === undefined || !$rootScope.initLoadingModal.isShown()) {
        $ionicModal.fromTemplateUrl('main/views/initProgressModal.html', {
          scope: $rootScope,
          animation: 'init-slide-up'
        }).then(function (modal) {
          $rootScope.initLoadingModal = modal;
          $rootScope.initLoadingModal.show();
        });
      }
    }

    function _initSettings() {
      return settingsStoreService.init();
    }

    function _loadData() {
      var queue = [];
      for (var l = 0; l < languagesConstant.length; l++) {
        queue.push(loadPages(l));
        queue.push(loadRooms(l));
      }
      return $q.all(queue);
    }

    function loadPages(langKey) {
      return typo3Service.loadPages(langKey);
    }

    function loadRooms(langKey) {
      return typo3Service.loadRooms(langKey);
    }

    function _parseData(responses) {
      return {
        settings: responses[0],
        images: parsersUtilsService.parseImagesFromTypo3Response(responses[1]),
        pages: parsersUtilsService.parsePagesFromTypo3Response(responses[1]),
        rooms: parsersUtilsService.parseRoomsFromTypo3Response(responses[1])
      };
    }

    function _cleanDatabases(results) {
      var deferred = $q.defer();
      $q.all([
        pagesStoreService.clean(),
        roomsStoreService.clean()
      ])
        .then(function () {
          deferred.resolve(results);
        })
        .catch(deferred.reject);
      return deferred.promise;
    }

    function _updateDatabases(r) {
      $rootScope.initModalMessage = 'MESSAGE.SYNC.STORE';
      var queue = [];
      for (var l = 0; l < r.pages.length; l++) {
        queue.push(pagesStoreService.sync(r.pages[l]));
        queue.push(roomsStoreService.sync(r.rooms[l]));
      }
      return $q.all(queue)
        .then(function () {
          return r;
        });
    }

    function _downloadImages(r) {
      $rootScope.initModalMessage = 'MESSAGE.SYNC.IMAGES';
      $rootScope.initModalMessageValues.counter = 0;
      $rootScope.initModalMessageValues.amount = Object.keys(r.images).length || 0;
      var deferred = $q.defer();
      imagesService.download(r.images)
        .then(function () {
          deferred.resolve(r);
        })
        .catch(deferred.reject);
      return deferred.promise;
    }

    function _onDone() {

    }

    function _onSuccess(results) {
      $rootScope.initModalMessage = 'MESSAGE.SYNC.SUCCESS';

      if (results.settings.isPristine) {
        goTo('menu.tutorial');
      } else {
        if ($ionicHistory.currentView() && $ionicHistory.currentView().stateId !== 'menu.welcome') {
          goTo('menu.welcome');
        }
      }

      function goTo(stateId) {
        $timeout(function () {
          $ionicHistory.clearHistory();
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go(stateId);
        }, 200);
      }

      $timeout(function () {
        $rootScope.$broadcast('kmsscan.sync.succeeded');
        $rootScope.initLoadingModal.hide();
        $rootScope.syncIsActive = false;
      }, 800);
      log.debug('done', results);
    }

    function _onError(err) {
      log.error('_onError -> catch', err);
      pagesStoreService.isEmpty()
        .then(function (res) {
          $rootScope.initModalHasData = !res;
        })
        .catch(function (err) {
          log.error('isEmpty -> catch', err);
        })
        .finally(function () {
          $rootScope.initModalFailed = err;
          $timeout(function () {
            $rootScope.$broadcast('kmsscan.sync.failed');
          });
        });
    }

  }
})();