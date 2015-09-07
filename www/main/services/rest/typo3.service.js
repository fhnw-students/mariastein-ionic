(function () {
  'use strict';

  angular
    .module('kmsscan.services.rest.Typo3', [
      'kmsscan.utils.Logger'
    ])
    .factory('typo3Service', Typo3Service);

  function Typo3Service($q, $http, $cordovaFileTransfer, Logger) {
    var log = new Logger('kmsscan.services.rest.Typo3');
    log.info('init');
    var service = {
      load: load,
      downloadImage: downloadImage
    };

    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    function downloadImage(url, id) {
      var deferred = $q.defer();
      url = 'http://localhost:3000/' + url;
      var targetPath = cordova.file.documentsDirectory + id + '.png';
      var trustHosts = true;
      var options = {};
      $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
        .then(function (result) {
          deferred.resolve({
            targetPath: targetPath,
            image: result
          });
        }, function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function load() {
      log.info('load()');
      var deferred = $q.defer();
      $http({
        //http://kloster-mariastein.business-design.ch/index.php?id=136&type=5000
        url: 'http://localhost:3000/data',
        type: 'GET',
        dataType: 'json'
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

    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////
    function _parseRooms(data) {
      var rooms = data.map(function (item) {
        return item.room;
      });
      return _.uniq(rooms, function (item) {
        return item.uid;
      });
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

    function _parseObjects(data) {
      data = data.map(function (item) {
        var newItem = _getObject(item.content);
        newItem.image = _parseImage(newItem.image);
        return newItem;
      });
      log.info('_parseObjects()', data);
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
        a.push(images[key]);
      }
      return a;
    }

  }
})();