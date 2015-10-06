/**
 * @name typo3Service
 * @module kmsscan.services.rest.Typo3
 * @author Gery Hirschfeld
 *
 * @description
 * This Service Class handel's all the ajax requests the typo3 backend.
 *
 */
(function () {
  'use strict';

  var namespace = 'kmsscan.services.rest.Typo3';

  angular
    .module(namespace, [
      'ngCordova',
      'kmsscan.utils.Logger',
      'kmsscan.utils.Errors'
    ])
    .factory('typo3Service', Typo3Service);

  Typo3Service.BACKENDS = {
    PROD: 'http://kloster-mariastein.business-design.ch/'
  };

  function Typo3Service($q, $http, $cordovaFileTransfer, Logger, errorsUtilsService, $rootScope) {
    var log = new Logger(namespace);
    var env = 'PROD';

    return {
      loadPages: loadPages,
      loadRooms: loadRooms,
      downloadImage: downloadImage
    };

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    /**
     * @name loadPages
     * @description
     * This method request all pages in one language from the
     * typo3 backend.
     *
     * @param langKey String
     * @returns {deferred.promise|{then, always}} Object
     */
    function loadPages(langKey) {
      log.debug('loadPages()', langKey);
      var deferred = $q.defer();
      $http({
        url: Typo3Service.BACKENDS[env] + 'index.php',
        type: 'GET',
        dataType: 'json',
        params: {
          L: langKey || 0,
          id: 137,
          type: 5000
        }
      })
        .success(function (response) {
          log.debug('loadPages() - success', response);
          var objects = _parseObjects(response);
          deferred.resolve(objects);
        })
        .error(function (e, status) {
          log.error('loadPages() - failed', status);
          deferred.reject(errorsUtilsService.get(status === 0 ? 1 : 2, {
            status: status,
            error: e
          }));
        });
      return deferred.promise;
    }

    /**
     * @name loadRooms
     * @description
     * Request all the rooms from the typo3 backend
     *
     * @param langKey String
     * @returns {deferred.promise|{then}} Object
     */
    function loadRooms(langKey) {
      log.debug('loadRooms()', langKey);
      var deferred = $q.defer();
      $http({
        url: Typo3Service.BACKENDS[env] + 'index.php',
        type: 'GET',
        dataType: 'json',
        params: {
          L: langKey || 0,
          id: 138,
          type: 5000
        }
      })
        .success(function (response) {
          response = response.map(function (item) {
            item.image = _parseImage(item.image);
            return item;
          });
          log.debug('loadRooms() - success', response);
          deferred.resolve(response);
        })
        .error(function (e, status) {
          log.error('loadRooms() - failed', status);
          deferred.reject(errorsUtilsService.get(status === 0 ? 1 : 2, {
            status: status,
            error: e
          }));
        });
      return deferred.promise;
    }

    /**
     * @name downloadImage
     * @description
     * This function downloads the given image form the typo3 backend and
     * stores the in the local device directory(targetPath).
     *
     * @param url String
     * @param targetPath String
     * @returns {deferred.promise|{then, always}} Object
     */
    function downloadImage(url, targetPath) {
      var deferred = $q.defer();
      if (window.cordova) {
        url = Typo3Service.BACKENDS[env] + url;
        var trustHosts = true;
        var options = {};
        log.debug('downloadImage()', url);
        $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
          .then(function (result) {
            log.debug('downloadImage() - success', result);
            $rootScope.initModalMessageValues.counter++;
            deferred.resolve({
              targetPath: targetPath,
              image: result
            });
          }, function (err) {
            log.error('downloadImage() - failed', err);
            deferred.reject(err);
          });
      } else {
        setTimeout(function () {
          log.warn('Cordova is not available!');
          deferred.resolve({});
        }, 500);
      }
      return deferred.promise;
    }

    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////
    function _parseObjects(data) {
      data = data.map(function (item) {
        var newItem = _getObject(item.content);
        newItem.image = _parseImage(newItem.image);
        return newItem;
      });
      log.debug('_parseObjects()', data);
      return data;
    }

    function _getObject(obj) {
      for (var key in obj) {
        if (angular.isObject(obj)) {
          return obj[key];
        }
      }
      return {};
    }

    function _parseImage(images) {
      var a = [];
      for (var key in images) {
        if (key) {
          a.push(images[key]);
        }
      }
      return a;
    }
    
  }
})();
