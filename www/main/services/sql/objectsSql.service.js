(function () {
  'use strict';

  angular
    .module('kmsscan.services.sql.Objects', [
      'kmsscan.utils.Logger',
      'kmsscan.utils.SqlLite',

      'kmsscan.services.stores.Objects'
    ])
    .factory('objectsSqlService', ObjectsSqlService);

  /**
   * Static Variables
   * @type {{OBJECTS: string, OBJECTS_HAS_IMAGES: string}}
   */
  ObjectsSqlService.TABLENAME = {
    OBJECTS: 'objects',
    OBJECTS_HAS_IMAGES: 'objects_has_images'
  };

  /**
   * Service Class
   * @returns {{sync: sync, getAll: getAll}}
   * @constructor
   */
  function ObjectsSqlService($q, $cordovaSQLite, $ionicPlatform, Logger, sqlLiteUtilsService, objectsStoreService) {
    var log = new Logger('kmsscan.services.sql.Objects');
    log.info('init');

    var db;
    $ionicPlatform.ready(function () {
      if (window.cordova) {
        db = $cordovaSQLite.openDB({name: 'kmsscan'});
        _create();
      }
    });

    // Public API
    var service = {
      sync: sync,
      getAll: getAll
    };

    return service;

    // PUBLIC ///////////////////////////////////////////////////////////////////////////////////////////
    /**
     * @name getAll
     * @description
     * selects all values from the SQL-Lite database and parses them for the application
     *
     * @returns {deferred.promise|{then, always}}
     */
    function getAll() {
      var deferred = $q.defer();
      $q.all([
        _selectAllObjects(),
        _selectAllObjectsHasImages()
      ])
        .then(function (results) {
          var data = results[0];
          data.map(function (item) {
            item.images = results[1]
              .filter(function (image) {
                return image.uid === item.uid;
              })
              .map(function (image) {
                return image.imageId;
              });
            return item;
          });
          deferred.resolve(data);
        });
      return deferred.promise;
    }

    /**
     * @name sync
     * @description
     * Renews the tables of the database and inserts the new data
     *
     * @param data
     * @returns {deferred.promise|{then, always}}
     */
    function sync(data) {
      var deferred = $q.defer();
      _truncateTables()
        .then(_create)
        .then(function () {
          return _insert(data);
        })
        .then(function () {
          return getAll();
        })
        .then(function (res) {
          objectsStoreService.set(res);
          deferred.resolve();
        })
        .catch(function (err) {
          log.error('sync()', err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    // PRIVATE ///////////////////////////////////////////////////////////////////////////////////////////
    /**
     *
     * @returns {deferred.promise|{then, always}}
     * @private
     */
    function _selectAllObjects() {
      return sqlLiteUtilsService.selectAll(db, ObjectsSqlService.TABLENAME.OBJECTS);
    }

    /**
     *
     * @returns {deferred.promise|{then, always}}
     * @private
     */
    function _selectAllObjectsHasImages() {
      return sqlLiteUtilsService.selectAll(db, ObjectsSqlService.TABLENAME.OBJECTS_HAS_IMAGES);
    }

    /**
     *
     * @param data
     * @returns {Promise}
     * @private
     */
    function _insert(data) {
      return $q.all([
        _insertObjects(data),
        _insertImages(data)
      ]);
    }

    /**
     *
     * @param data
     * @returns {Promise}
     * @private
     */
    function _insertImages(data) {
      var query = 'INSERT INTO ' + ObjectsSqlService.TABLENAME.OBJECTS_HAS_IMAGES + ' (uid, imageId) VALUES (?,?)';
      var queue = [];
      for (var i = 0; i < data.length; i++) {
        for (var n = 0; n < data[i].image.length; n++) {
          queue.push(
            $cordovaSQLite.execute(db, query, [
              data[i].uid,
              data[i].image[n].uid
            ])
          );
        }
      }
      return $q.all(queue);
    }

    /**
     *
     * @param data
     * @returns {Promise}
     * @private
     */
    function _insertObjects(data) {
      var query = 'INSERT INTO ' + ObjectsSqlService.TABLENAME.OBJECTS + ' (uid, title, content, teaser, roomId, qrcode) VALUES (?,?,?,?,?,?)';
      var queue = [];
      for (var i = 0; i < data.length; i++) {
        queue.push(
          $cordovaSQLite.execute(db, query, [
            data[i].uid,
            data[i].title || '',
            data[i].content || '',
            data[i].teaser || '',
            data[i].room.uid || null,
            data[i].qrcode || null
          ])
        );
      }
      return $q.all(queue);
    }

    /**
     *
     * @returns {Promise}
     * @private
     */
    function _truncateTables() {
      return $q.all([
        sqlLiteUtilsService.truncateTable(db,ObjectsSqlService.TABLENAME.OBJECTS),
        sqlLiteUtilsService.truncateTable(db,ObjectsSqlService.TABLENAME.OBJECTS_HAS_IMAGES)
      ]);
    }

    /**
     *
     * @returns {Promise}
     * @private
     */
    function _create() {
      return $q.all([
        sqlLiteUtilsService.createTable(db, ObjectsSqlService.TABLENAME.OBJECTS, '(uid integer primary key, title text, content text, teaser text, roomId integer, qrcode text)'),
        sqlLiteUtilsService.createTable(db, ObjectsSqlService.TABLENAME.OBJECTS_HAS_IMAGES, '(uid integer, imageId integer)')
      ]);
    }

  }
})();