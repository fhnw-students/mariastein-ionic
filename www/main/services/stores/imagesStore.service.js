(function () {
  'use strict';

  angular
    .module('kmsscan.services.stores.Images', [
      'pouchdb',
      'kmsscan.utils.Logger',
      'kmsscan.services.rest.Typo3'
    ])
    .factory('imagesStoreService', ImagesStoreService);

  //ImagesStoreService.DBNAME = 'kmsscan.images';
  ImagesStoreService.PLACEHOLDER_IMAGE = {
    path: 'img/init.png'
  };

  /**
   * Service Class
   * @returns {{sync: sync, getAll: getAll}}
   * @constructor
   */
  function ImagesStoreService($q, Logger, pouchDB, typo3Service) {
    var log = new Logger('kmsscan.services.stores.Images');
    var imagesDb;
    log.info('init');


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
        return cordova.file.documentsDirectory + uid + '.png';
      }
      return ImagesStoreService.PLACEHOLDER_IMAGE;
    }

    function sync(results) {
      var deferred = $q.defer();
      results = results
        .filter(function (item) {
          return _.isArray(item);
        })
        .map(function (items) {
          return items.map(function (item) {
            return item.image;
          })
        });

      var images = {};
      for (var l = 0; l < results.length; l++) {
        for (var c = 0; c < results[l].length; c++) {
          for (var i = 0; i < results[l][c].length; i++) {
            if (results[l][c][i] && results[l][c][i].uid && results[l][c][i].originalResource && results[l][c][i].originalResource.publicUrl) {
              images[results[l][c][i].uid] = results[l][c][i].originalResource.publicUrl;
              //  images[results[l][c][i].uid] = {
              //  url: results[l][c][i].originalResource.publicUrl,
              //  uid: results[l][c][i].uid
              //};
            }
          }
        }
      }

      log.info('sync', images);
      //_activate()
      //  .then(function () {
      //    return _download(images);
      //  })
      //  //.then(function (responses) {
      //  //  return _sync(responses);
      //  //})

      _download(images)
        .then(function (responses) {
          log.info('success', responses);
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

    //function _sync(responses) {
    //  var deferred = $q.defer();
    //  if(responses.length === 0){
    //    deferred.resolve();
    //  }else{
    //
    //    //TODO
    //    log.warn(responses);
    //
    //    deferred.resolve();
    //    deferred.reject();
    //
    //  }
    //  return deferred.promise;
    //}


    //function _activate() {
    //  var deferred = $q.defer();
    //  imagesDb = pouchDB(ImagesStoreService.DBNAME, {
    //    adapter: 'websql'
    //  });
    //  //imagesDb.info().then(console.log.bind(console));
    //  deferred.resolve();
    //  return deferred.promise;
    //}
    //
    //function _destroy() {
    //  return imagesDb.destroy();
    //}

  }
})();