(function () {
  'use strict';

  angular
    .module('kmsscan.services.sql.Images', [
      'kmsscan.utils.Logger',
      'kmsscan.utils.SqlLite',

      'kmsscan.services.rest.Typo3'
    ])
    .factory('imagesSqlService', ImagesSqlService);

  /**
   * Static Variables
   * @type {{IMAGES: string}}
   */
  ImagesSqlService.TABLENAME = 'images';

  /**
   * Service Class
   * @param $q
   * @param $cordovaSQLite
   * @param $ionicPlatform
   * @returns {{}}
   * @constructor
   */
  function ImagesSqlService($q, $cordovaSQLite, $ionicPlatform, Logger, sqlLiteUtilsService, typo3Service) {
    var log = new Logger('kmsscan.services.sql.Images');
    log.info('init');

    var db;
    $ionicPlatform.ready(function () {
      if (window.cordova) {
        db = $cordovaSQLite.openDB({name: 'kmsscan'});
        _create();
      }
    });

    var service = {
      sync: sync,
      get: get
    };

    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    function sync(data) {
      var deferred = $q.defer();
      _truncateTables()
        .then(_create)
        .then(function () {
          return _inserts(data);
        })
        .then(function () {
          deferred.resolve();
        })
        .catch(function (err) {
          log.error('sync()', err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function get(uid) {
      return _select(uid);
    }

    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////
    function _select(uid) {
      var deferred = $q.defer();
      var query = 'SELECT * FROM ' + ImagesSqlService.TABLENAME + ' WHERE uid = ' + uid;
      $cordovaSQLite.execute(db, query).then(function (res) {
        log.info('select', res);
        var image;
        if (res.rows.length > 0) {
          image = res.rows.item(0);
        }
        deferred.resolve(image);
      }, function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function _inserts(data) {
      var queue = [];
      for (var i = 0; i < data.length; i++) {
        var imageId = data[i].uid;
        var imageUrl = data[i].originalResource.publicUrl;
        queue.push(
          _insert(imageId, imageUrl)
        );
      }
      return $q.all(queue);
    }

    function _insert(imageId, imageUrl) {
      var deferred = $q.defer();
      var query = 'INSERT INTO ' + ImagesSqlService.TABLENAME + ' (uid, data) VALUES (?,?)';
      typo3Service.getImageBlob(imageUrl)
        .then(function (image) {
          return $cordovaSQLite.execute(db, query, [
            imageId,
            image.response
          ])
        })
        .then(function (result) {
          deferred.resolve(result);
        })
        .catch(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    /**
     *
     * @returns {Promise}
     * @private
     */
    function _truncateTables() {
      return sqlLiteUtilsService.truncateTable(db, ImagesSqlService.TABLENAME);
    }

    /**
     *
     * @returns {Promise}
     * @private
     */
    function _create() {
      return sqlLiteUtilsService.createTable(db, ImagesSqlService.TABLENAME, '(uid integer primary key, data blob)');
    }

  }
})();
