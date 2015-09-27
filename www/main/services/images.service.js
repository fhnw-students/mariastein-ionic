(function () {
  'use strict';

  var namespace = 'kmsscan.services.Images';

  angular
    .module(namespace, [
      'pouchdb',
      'kmsscan.utils.Logger',
      'kmsscan.services.rest.Typo3'
    ])
    .factory('imagesService', ImagesService);

  ImagesService.PLACEHOLDER_IMAGE = 'img/init.png';

  /**
   * Service Class
   * @returns {{sync: sync, getAll: getAll}}
   * @constructor
   */
  function ImagesService($q, Logger, typo3Service) {
    var log = new Logger(namespace, false);
    log.debug('init');

    // Public API
    var service = {
      getPath: getPath,
      sync: sync
    };

    //_activate();
    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    function getPath(uid) {
      if (window.cordova) {
        if (uid) {
          var targetPath = '';
          if (ionic.Platform.isIOS()) {
            targetPath = cordova.file.documentsDirectory;
          }
          if (ionic.Platform.isAndroid()) {
            targetPath = cordova.file.applicationStorageDirectory;
          }

          targetPath += uid + '.png';
          return targetPath;
        } else {
          return '';
        }
      }
      return ImagesService.PLACEHOLDER_IMAGE;
    }

    function sync(results) {
      var deferred = $q.defer();
      results = results
        .filter(function (item) {
          return _.isArray(item);
        });
        
      var images = {};
      for (var l = 0; l < results.length; l++) {
        for (var c = 0; c < results[l].length; c++) {
          images[results[l][c].uid] = results[l][c].originalResource.publicUrl;
        }
      }

      log.debug('sync', images);
      _download(images)
        .then(function (responses) {
          log.debug('success', responses);
          deferred.resolve(images);
        })
        .catch(function (err) {
          log.error('failed', err);
          deferred.reject(err);
        });

      return deferred.promise;
    }

    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////
    function _download(images) {
      var queue = [];
      for (var key in images) {
        queue.push(typo3Service.downloadImage(images[key], key));
      }
      return $q.all(queue);
    }

  }
})();