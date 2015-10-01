/**
 * @name typo3Service
 * @module kmsscan.services.rest.Typo3
 * @author Gery Hirschfeld
 *
 * @description
 * This Service Class handel's all the ajax requestto the typo3 backend.
 *
 */
(function () {
  'use strict';

  var namespace = 'kmsscan.services.rest.Typo3';

  angular
    .module(namespace, [
      'kmsscan.utils.Logger'
    ])
    .factory('typo3Service', Typo3Service);

  Typo3Service.BACKENDS = {
    PROD: 'http://kloster-mariastein.business-design.ch/'
  };

  function Typo3Service($q, $http, $cordovaFileTransfer, Logger) {
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
          //{
          //  objects: objects,
          //  images: _parseImages(objects)
          //});
        })
        .error(function (err) {
          log.error('loadPages() - failed', err);
          deferred.reject(err);
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
          //{
          //  images: _parseImagesFromRooms(response),
          //  rooms: _parseRooms(response)
          //});
        })
        .error(function (err) {
          log.error('loadRooms() - failed', err);
          deferred.reject(err);
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
    function _parseRooms(data) {
      var rooms = data
        .map(function (room) {
          room.image = _parseImage(room.image);
          return room;
        })
        .map(function (room) {
          room.previewImageUid = _getImageByTitle(room.image, 'preview');
          room.mapImageUid = _getImageByTitle(room.image, 'map');
          delete room.image;
          return room;
        });
      return rooms;
    }

    function _getImageByTitle(images, title) {
      images = images.filter(function (image) {
        return image.originalResource.title === title;
      });
      var image = (images.length > 0) ? images[0] : undefined;
      return (image) ? image.uid : image;
    }

    function _parseImages(data) {
      var images = [];
      for (var i = 0; i < data.length; i++) {
        for (var n = 0; n < data[i].image.length; n++) {
          if (data[i].image[n]) {
            images.push(data[i].image[n]);
          }
        }
      }
      return _.uniq(images, function (item) {
        return item.uid;
      });
    }

    function _parseImagesFromRooms(data) {
      var roomsWithImages = data.map(function (obj) {
        return obj.image;
      })
        .map(function (image) {
          return _parseImage(image);
        });

      var images = [];
      for (var r = roomsWithImages.length - 1; r >= 0; r--) {
        for (var i = roomsWithImages[r].length - 1; i >= 0; i--) {
          images.push(roomsWithImages[r][i]);
        }
      }

      return _.uniq(images, function (item) {
        return item.uid;
      });
    }


    function _parseObjects(data) {
      data = data.map(function (item) {
        var newItem = _getObject(item.content);
        newItem
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