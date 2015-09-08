(function () {
  'use strict';

  angular
    .module('kmsscan.services.rest.Typo3', [
      'kmsscan.utils.Logger'
    ])
    .factory('typo3Service', Typo3Service);

  Typo3Service.BACKENDS = {
    PROD: {
      PAGES: 'http://kloster-mariastein.business-design.ch/index.php',
      ROOMS: 'http://kloster-mariastein.business-design.ch/index.php',
      FILES: 'http://kloster-mariastein.business-design.ch/'
      //http://kloster-mariastein.business-design.ch/fileadmin/redaktion/benediktinerkloster/bilder/app/others/welcome.JPG
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

    log.info('init');
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
      // TODO Languages
      log.info('loadPages()', langKey);
      var deferred = $q.defer();
      $http({
        url: Typo3Service.BACKENDS[env].PAGES,
        type: 'GET',
        dataType: 'json',
        params: {
          type: 5000,
          id: 136,
          L: langKey || 0
        }
      })
        .success(function (response) {
          log.info('then()', response);
          var objects = _parseObjects(response);

          deferred.resolve({
            objects: objects,
            rooms: _parseRooms(objects),
            images: _parseImages(objects)
          });
        })
        .error(function (err) {
          log.error('error()', err);
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
    function loadRooms() {
      // TODO
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
        log.info('downloadImage()', url);
        $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
          .then(function (result) {
            log.info('downloadImage()', result);
            deferred.resolve({
              targetPath: targetPath,
              image: result
            });
          }, function (err) {
            deferred.reject(err);
          });
      } else {
        log.warn('Cordova is not available!');
        deferred.resolve({});
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
        .map(function (item) {
          return item.room;
        })
        .filter(function (item) {
          return _.isObject(item);
        });
      return _.uniq(rooms, function (item) {
        return item.uid;
      });
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
      return _.uniq(images, function (item) {
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
      data = data.map(function (item) {
        var newItem = _getObject(item.content);
        newItem.image = _parseImage(newItem.image);
        return newItem;
      });
      log.info('_parseObjects()', data);
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


    //function getImageBlob(url, params) {
    //  var deferred = $q.defer();
    //  $http.get(Typo3Service.BACKENDS[env].FILES + url, params, {
    //    responseType: 'arraybuffer'
    //  })
    //    .success(function (response) {
    //      var file = new Blob([response], {type: 'image/jpeg'});
    //      var fileURL = URL.createObjectURL(file);
    //      log.info('fileURL', fileURL);
    //      deferred.resolve(file);
    //    })
    //    .error(deferred.reject);
    //  return deferred.promise;
    //}

  }
})();