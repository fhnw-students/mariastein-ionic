(function () {
  'use strict';

  angular
    .module('kmsscan.services.rest.Typo3', [
      'kmsscan.utils.Logger'
    ])
    .factory('typo3Service', Typo3Service);

  function Typo3Service($q, $http, Logger) {
    var log = new Logger('kmsscan.services.rest.Typo3');
    log.info('init');
    var service = {
      load: load,
      getImageBlob: getImageBlob
    };

    return service;

    ////////////////

    function getImageBlob(url, params) {
      var deferred = $q.defer();
      // Simulate a call to Dropbox or other service that can
      // return an image as an ArrayBuffer.
      var xhr = new XMLHttpRequest();
      // Use JSFiddle logo as a sample image to avoid complicating
      // this example with cross-domain issues.
      xhr.open('GET', 'http://localhost:3000/' + url, true);
      // Ask for the result as an ArrayBuffer.
      xhr.responseType = 'arraybuffer';
      xhr.onload = function (e) {
        // Obtain a blob: URL for the image data.
        var arrayBufferView = new Uint8Array(this.response);
        var blob = new Blob([arrayBufferView], {type: "image/jpeg"});
        deferred.resolve({
          response: this.response,
          arrayBufferView: arrayBufferView,
          blob: blob
        });
      };
      xhr.send();
      return deferred.promise;


      //var deferred = $q.defer();
      //log.info('getImageBlob', 'http://localhost:3000/' + url);
      //$http.get('http://localhost:3000/' + url, params, {
      //  responseType: 'arraybuffer'
      //})
      //  .success(function (response) {
      //    var arrayBufferView = new Uint8Array(response);
      //    var blob = new Blob([arrayBufferView], {type: "image/jpeg"});
      //    deferred.resolve(blob);
      //  })
      //  .error(deferred.reject);
      //return deferred.promise;
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