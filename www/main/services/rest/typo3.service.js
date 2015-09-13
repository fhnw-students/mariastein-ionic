(function() {
  'use strict';

  angular
    .module('kmsscan.services.rest.Typo3', [
      'kmsscan.utils.Logger'
    ])
    .factory('typo3Service', Typo3Service);

  Typo3Service.BACKENDS = {
    PROD: {
      PAGES: 'http://kloster-mariastein.business-design.ch/routing/klomaapp/page/json',
      ROOMS: 'http://kloster-mariastein.business-design.ch/routing/klomaapp/room/json',
      FILES: 'http://kloster-mariastein.business-design.ch/'
        //Old:  http://kloster-mariastein.business-design.ch/index.php?id=136&type=5000
        //Page: http://kloster-mariastein.business-design.ch/routing/klomaapp/page/json
        //Room: http://kloster-mariastein.business-design.ch/routing/klomaapp/room/json
    },
    DEV: {
      PAGES: 'http://localhost:3000/pages',
      ROOMS: 'http://localhost:3000/rooms',
      FILES: 'http://localhost:3000/'
    }
  };

  /**
   * Service Class
   * @constructor
   */
  function Typo3Service($q, $http, $cordovaFileTransfer, Logger) {
    var log = new Logger('kmsscan.services.rest.Typo3');
    var env = 'PROD';

    log.debug('init');
    var service = {
      loadPages: loadPages,
      loadRooms: loadRooms,
      downloadImage: downloadImage
    };

    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    /**
     *
     * @returns {deferred.promise|{then, always}}
     */
    function loadPages(langKey) {
      log.debug('loadPages()', langKey);
      var deferred = $q.defer();
      $http({
          url: Typo3Service.BACKENDS[env].PAGES,
          type: 'GET',
          dataType: 'json',
          params: {
            // id: 136,
            // type: 5000,
            L: langKey || 0
          }
        })
        .success(function(response) {
          log.debug('loadPages() - success', response);
          var objects = _parseObjects(response);

          deferred.resolve({
            objects: objects,
            images: _parseImages(objects)
          });
        })
        .error(function(err) {
          log.error('loadPages() - failed', err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    /**
     * @description
     * Request all the rooms from the typo3 backend
     *
     * @returns {deferred.promise|{then}}
     */
    function loadRooms(langKey) {
      log.debug('loadRooms()', langKey);
      var deferred = $q.defer();
      $http({
          url: Typo3Service.BACKENDS[env].ROOMS,
          type: 'GET',
          dataType: 'json',
          params: {
            L: langKey || 0
          }
        })
        .success(function(response) {
          log.debug('loadRooms() - success', response);
          deferred.resolve({
            images: _parseImagesFromRooms(response),
            rooms: _parseRooms(response)
          });
        })
        .error(function(err) {
          log.error('loadRooms() - failed', err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    /**
     *
     * @param url
     * @param id
     * @returns {deferred.promise|{then, always}}
     */
    function downloadImage(url, id) {
      var deferred = $q.defer();
      if (window.cordova) {
        url = Typo3Service.BACKENDS[env].FILES + url;
        var targetPath = cordova.file.documentsDirectory + id + '.png';
        var trustHosts = true;
        var options = {};
        log.debug('downloadImage()', url);
        $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
          .then(function(result) {
            log.debug('downloadImage() - success', result);
            deferred.resolve({
              targetPath: targetPath,
              image: result
            });
          }, function(err) {
            log.error('downloadImage() - failed', err);
            deferred.reject(err);
          });
      } else {
        setTimeout(function() {
          log.warn('Cordova is not available!');
          deferred.resolve({});
        }, 500);
      }
      return deferred.promise;
    }

    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////
    /**
     *
     * @param data
     * @returns {Array}
     * @private
     */
    function _parseRooms(data) {
      var rooms = data
        .map(function(room) {
          room.image = _parseImage(room.image);
          return room;
        })
        .map(function(room) {
          room.previewImageUid = _getImageByTitle(room.image, 'preview');
          room.mapImageUid = _getImageByTitle(room.image, 'map');
          delete room.image;
          return room;
        });
      return rooms;
    }

    function _getImageByTitle(images, title) {
      images = images.filter(function(image) {
        return image.originalResource.title === title;
      });
      var image = (images.length > 0) ? images[0] : undefined;
      return (image) ? image.uid : image;
    }

    /**
     *
     * @param data
     * @returns {Array}
     * @private
     */
    function _parseImages(data) {
      var images = [];
      for (var i = 0; i < data.length; i++) {
        for (var n = 0; n < data[i].image.length; n++) {
          if (data[i].image[n]) {
            images.push(data[i].image[n]);
          }
        }
      }
      return _.uniq(images, function(item) {
        return item.uid;
      });
    }

    function _parseImagesFromRooms(data) {
      var roomsWithImages = [];
      roomsWithImages = data.map(function(obj) {
          return obj.image;
        })
        .map(function(image) {
          return _parseImage(image);
        });

      var images = [];
      for (var r = roomsWithImages.length - 1; r >= 0; r--) {
        for (var i = roomsWithImages[r].length - 1; i >= 0; i--) {
          images.push(roomsWithImages[r][i]);
        };
      };

      return _.uniq(images, function(item) {
        return item.uid;
      });
    }

    /**
     *
     * @param data
     * @returns {Array|*}
     * @private
     */
    function _parseObjects(data) {
      data = data.map(function(item) {
        var newItem = _getObject(item.content);
        newItem.image = _parseImage(newItem.image);
        return newItem;
      });
      log.debug('_parseObjects()', data);
      return data;
    }

    /**
     *
     * @param obj
     * @returns {*}
     * @private
     */
    function _getObject(obj) {
      for (var key in obj) {
        if (angular.isObject(obj)) {
          return obj[key];
        }
      }
      return {};
    }

    /**
     *
     * @param images
     * @returns {Array}
     * @private
     */
    function _parseImage(images) {
      var a = [];
      for (var key in images) {
        a.push(images[key]);
      }
      return a;
    }

  }
})();